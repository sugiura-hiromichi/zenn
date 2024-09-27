

class ConnectionInfo {
	constructor(
		readonly scope: string,
		readonly client_id: string,
		readonly client_secret: string,
		readonly service_account: string,
		readonly private_key: string,
	) { }
}

function postToLineWorks() {
	const bot_id = 8725755;
	const channel_id = '0c7c5780-0010-2458-c141-6e9a5947c318';
	const config = new ConnectionInfo(
		'bot',
		'2tfPQSyho5xPUBFD_OTx',
		'pXUqNhECKO',
		'c15uv.serviceaccount@9kv8xiyi',
		`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCDSjJ1qfGihfVJ
ruzoCHCSWmvxYihX1LYO540HI4QA1d5gaHiSenXux7OLMuFMDD967Ib8xxSMwtZM
wm/BF/4C65YMzxyz1hY38iU64sc5FiysY6SvAoGwzot23qOtWdcJuxy53A7ykUWl
By1bypizlWDtGnbsZR1B5q4zzR8b4SG2I+8mXJpKMu6YvnErXjfYyzYN8IGZDxuc
mZLyuMUuonqFTOYVbCW5KaIdXENeflte2rMPDltkkWnhOmwp/sQicHo7+C3r1yDq
VgplwCdMopSDj1L9dGKVEfZpWmg7lIeeugtGpi3+S2fRNOx7CZVDAOjT/cFnkLJT
SyQPezUfAgMBAAECggEAHamq4ujFnlmzxLUP85DMllR1pPDveoClrZJlS6KblXC8
sH2KGFYwxQU7rIyPWJY/1W8RRJVaMD9pGaiohTD9g/1kRnqY2ozZMkS0YqyQJHa9
GyncMGpZkO/plK7SvjzZF+q9n8R3YBiwaovHlMCeZZyvbIKZMenahWQwIaYLjEmq
wYGLymsAX9Dv+ugKk2SSkPjiV+7fMKyUxNcYnmg1D0EIE7ok96NPsHhjaW17huk4
u9JXdkhjOaED2dITBGEgc/AoRpDxzjLeEcimfunPBFbQkHnC3Dr0zyeP1duxShLO
NT3435S5Tab8F4fwmKvrFd1ZrEl8A1eVfPXe3hOI2QKBgQDQrNWSSXz7lRGzw+CM
1D714RarJkIXOoxHSKqL/LVOc0vCWcSh7Z85RruGHDLc+lpNnLkcusNqCcPaj/hv
JUbk4d4Z6tEUb8y92Dzul6mmvkSoLcIQZ5cjjd1QlH065DNqmKtO4ghHzCfeGcyz
+IwBAhrsVszf7OZUPCLo07ZRQwKBgQChEI/z2WtWQIJhgo2KhA3QTKxpR+Q8AfL1
f5dPwbv3GHTU0oG8eWZ63HrwoRruBHwG5M/W4ESfnIg0ctoQ9lTKgREi6SwSiCYL
geCIpcgdUGNnzx0qI4RlkE1NX4N6hiUQOpiY7GmaA3QF8ndYtXMxS1nL+2YXbJlg
Eb1NGBPQ9QKBgQCApKwdPPSx3BpHqk+6QfZ2ekcRR8qiq1Njdqa9GhNjw6xGqjSQ
Zv8rvjFI4gVxOV2GT0HHNlPWASMekHblfiOQYrYbYCl44dtkhfQ6WoEZ7F5DF8J1
focsQf7X+FKjhZ807d1eCfZ03KUPRPRvVqBo1rVmUbSHr3HnKBOVWT8iJQKBgDCA
5Fjy6LgYxSrIPgewrNhFvsYVuE256Ii128NQ/GH1I3nTyu4PQSVOsFc2rP1wrEkH
Lu/uqbvHT907mR/yjqZNJ/PzdCpAhfSBMDT2d8UcKFNis8201HIheqYKVXXYX+D7
RGkJCOQwlggUdIxqWD5ICsq68ourUKT1sqQ80/rhAoGANI9AQ+OV9kgyMRIOLtAH
mi3WNov3DlxTs87wCpbXLrPLefd/cSmF+xUvu0X0si6yp3NdOb5rE4klDV9v0uJK
KRA4mkzr07aEhv3VPITWvGtSCIzSuUVpprzShp9aodNRYW1rtez/V2Ql/0zcgQ88
qJuMuZjazr0NqJQRvsdEUOY=
-----END PRIVATE KEY-----`,
	);
	const url = `https://www.worksapis.com/v1.0/bots/${bot_id}/channels/${channel_id}/messages`;

	const mails = get_mail('');
	const access_token = get_access_token(config);

}
