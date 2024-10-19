// 接続に共通して必要、もしくはある接続に対して決まっている情報を格納
const INFO = {
	client_id: 'fscPUQTmGNUkx4C54HQR',
	client_secret: 'sv2gsQ_x0B',
	private_key: `
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCGx1zJTMnK+kEJXjxNIeDXO7xjeBi6x+IuPVfeK6nIQ7K0vPzfktpkmxCb1u2gRec+VrxEv/GKeNbxLS/VpNowcMCLKtufmucaD92tE8Hie1dx81hOPBDNkb0e5DXc9mYU+MSNJO1pIUcLFeDnO5XnWdJv+sXYuP+JkrE+KZDvhNQGcKZFo0imTHGdzbGj/Vxi4Uen3O58oVAfjVVN9wYXEiI5c3omcMpZpdpLw4kzsQxZ6Du+fNpfT0VYUYK6n0iwjSYKmuehPgGY6zobqNvoqNPrR+uo9p3T7qAcRHbXeI1zwmPyPq5SHElIKUkNvu31SC8n5osA2HRQc+CxaDXHAgMBAAECggEAWSo5g19OvP802ZrDcA/yrNHzPycrzR4Bz697mxrt1vSanKHO9aY034wKv97AFGFKq9477YvCo2ZwZNwNIl1Oj+94Ilm3NG8JZx+J+z/v7ALHhjaEfDWWtDkvkelOjSFhxYwSlIISopOGaZoO0UuFT6oH41dXXpp9TCmFIufi3+HcWUGyza2k/v1fseu+W+SM7ZNugu7fIrroltQe7vA7GmUjeQAaZJJfqcW6xUq5FP37+ILNJ7uQ9MU46y9dpbEBn1ACEWpOESfm+wRlP7xQJL93VPzymjbEgpcee/cqCmvENbsAElpexRwyEf1Gzn2GxinCF8q+TWKjwSxX8eo6AQKBgQDNLKW2oj1jy7CTtSmCIJowCM6OsbdsKrAG26+dTy4etc1pkYjlEYZ71YliOChRudiRC6S8+rjH0FjC8g/ZDX950OeNL+sI8aCGqYrGQMNSsIAc+IejXrHVkDkG2xoHqVdQfxQlwdfui1iX/1NdF5VAV64GfjMZ1JmGrsEPguKoxwKBgQCoKoAn2Ll6wjunx9/3eF1CDlESuxsBLg+RfXdEDIL+o83xIZ8piiZcEmUOLIayS+WMaHUMJN9XVm01bqsuuinR+jyjFApxCY1cNu/LMvbfS1nSVh2g50Wub60dDbdfuAYe/ltYaiT6gV0PW/tVaSyIzZixabugB6l9wsNQQZMLAQKBgCKVnw1NBboXsJkFVYzYwATOxzqoXDnAbFGLoGuM2EJW9NwRqxipvpiLIxBKVQmJoSa55rfwL0uHJB8gPGmi69T10MIszJqCWEO6umi2q/X5SG8ZuYthP+q219X/AsE92zj3YscGiMZt+K4OXNf5TLA+11fC2AxHmOVp+aMKtfgrAoGAIlE6AeeqQjDs95pETD4V2esOBGKGakE6EBiohAyBlvFaj4Cq+FEm7tcaJEBV5IC0gWi3qhjEMxCCDMtex5RaAG2ufiES2Gp4nH7hhHgMBRldZR0JwtIvWB+WFj28VB47sYt6nJpcnXpUwVOmAJIL8obySBIppciqf+2E6hXXqgECgYB9SsgP1XSid8e/+iA/EkscGkHy67L5gmZGs/fx5Sjyi3dRk5tHq0XaMjET9Iq4LhXgpOwQHcBgkqZdxzvLeux3CLmzVrFM3dSLCLJeR4H5c+oANFt0Qk2rh3yVncvl/fyqqLH+YN3xZEm/XnU5oJkhAschHFnDBtbYwk7hFAA67A==
-----END PRIVATE KEY-----
`,
	service_account: 'jrfwv.serviceaccount@c-live',
	scope: 'bot'
};

interface LWResponse { }

class LWAccessTokenResponse implements LWResponse {
	constructor(
		readonly access_token: string,
		readonly refresh_token: string,
		readonly token_type: string,
		readonly expires_in: string,
		readonly scope: string
	) { }
}

// Service Account認証を通じてAccessTokenを発行
// [参考](https://developers.worksmobile.com/jp/docs/auth-jwt)
function get_access_token() {
	const header = Utilities.base64Encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
	console.log(header);
	const now = Date.now();
	const claim_set = Utilities.base64Encode(JSON.stringify(
		{
			iss: INFO.client_id,
			sub: INFO.service_account,
			iat: Math.floor(now / 1000),
			exp: Math.floor(now / 1000 + 3600)
		}
	));
	console.log(claim_set);

	const head_claim_encoded = `${header}.${claim_set}`;
	const signature = Utilities.base64Encode(
		Utilities.computeRsaSha256Signature(head_claim_encoded, INFO.private_key)
	);
	const jwt = `${head_claim_encoded}.${signature}`;

	const url = 'https://auth.worksmobile.com/oauth2/v2.0/token';
	const params = {
		method: 'post' as GoogleAppsScript.URL_Fetch.HttpMethod,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		payload: {
			assertion: jwt,
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			client_id: INFO.client_id,
			client_secret: INFO.client_secret,
			scope: INFO.scope
		}
	}

	//const res = JSON.parse(UrlFetchApp.fetch(url, params).getContentText());
	const res = response_to_json(UrlFetchApp.fetch(url, params));
	return new LWAccessTokenResponse(res.access_token, res.refresh_token, res.token_type, res.expires_in, res.scope);
}

// APIを利用します
function send_request(url: string, method: GoogleAppsScript.URL_Fetch.HttpMethod, content_type: string, body: object) {
	const params = {
		method: method,
		headers: {
			Authorization: `Bearer ${get_access_token().access_token}`,
			'Content-Type': content_type
		},
		payload: body
	}

	return UrlFetchApp.fetch(url, params);
}

// 返されたデータをobjectに変換します
function response_to_json(response: GoogleAppsScript.URL_Fetch.HTTPResponse, charset?: string) {
	if (charset === undefined) {
		return JSON.parse(response.getContentText());
	} else {
		return JSON.parse(response.getContentText(charset));
	}
}

// `send_request`と`response_to_json`を実行します
function get_response(url: string, method: GoogleAppsScript.URL_Fetch.HttpMethod, content_type: string, body: object) {
	const response = send_request(url, method, content_type, body);
	return response_to_json(response);
}

function test() {
	console.log(get_access_token());
}

export { INFO, LWResponse, LWAccessTokenResponse, get_access_token, send_request, response_to_json, get_response };
