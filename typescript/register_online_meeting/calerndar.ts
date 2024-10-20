const err_msg_template = (where: string, reason: string, id: string) => {
	return new Error(`------------------------------------\nFrom: calendar.ts/${where}\n\t${reason}\n\tcalendar_id: ${id}\n------------------------------------`);
};

namespace EditCalendar {
	export function calendar(mail: GoogleAppsScript.Gmail.GmailMessage) {
		const subject = mail.getSubject();

		if (subject.includes(Template.reserv_sub)) {
			console.log(`new ${subject}`)
			new_event(mail);
		} else if (subject.includes(Template.update_sub)) {
			console.log(`update ${subject}`)
			update_event(mail);
		} else if (subject.includes(Template.cancel_sub)) {
			console.log(`cancel ${subject}`)
			delete_event(mail);
		}
	}
}

type edit_type = 'new' | 'update' | 'delete';
interface ReservationDetail {
	name: string,
	corp: string,//名前に所属が入っていて重複する場合を検出する
	address: string,
	phone: string,
	note: string,
	is_first_time: boolean,
	industry: string,
	url_of_customer: string,
	inner_note: string,
	meeting_url: string
}

/// # Panic
///
/// この関数はカレンダーのイベントを作成できなかった場合例外を投げます
/// 呼び出し元が例外処理の責任を持ちます
function new_event(mail: GoogleAppsScript.Gmail.GmailMessage) {
	if (mail.getPlainBody().search('名前: ') === -1) { return; }

	const register_err = (reason: string, id: string) => {
		return err_msg_template('register_event()', reason, id);
	}
	const plain_body = mail.getPlainBody().split('\n');

	// メール本文を解析
	const name = parse_name(plain_body, 'new');
	const corp = parse_corp(plain_body);
	const address = parse_address(plain_body);
	const phone = parse_phone(plain_body);
	const note = parse_note(plain_body);
	const is_first_time = parse_is_first_time(plain_body);
	const industry = parse_industry(plain_body);
	const url_of_customer = parse_url_of_customer(plain_body);
	const inner_note = parse_inner_note(plain_body);
	const meeting_url = parse_meeting_url(plain_body);

	const customer_info: ReservationDetail = {
		name: name,
		corp: corp,
		address: address,
		phone: phone,
		note: note,
		is_first_time: is_first_time,
		industry: industry,
		url_of_customer: url_of_customer,
		inner_note: inner_note,
		meeting_url: meeting_url,
	}

	// Calendarの取得

	// Calendarへの登録

	// メールの送信

}

/// # Panic
///
/// この関数はカレンダーのイベントをアップデート出来なかった場合例外を投げます
/// 呼び出し元が例外処理の責任を持ちます
function update_event(mail: GoogleAppsScript.Gmail.GmailMessage) {
	const update_err = (reason: string, id: string) => {
		return err_msg_template('update_event()', reason, id);
	}
	const plain_body = mail.getPlainBody().split('\n');

	let resource: GoogleAppsScript.Calendar.Schema.Event = { creator: { email: Template.my_email } };
	resource.summary = parse_name(plain_body, 'update');
	const date = parse_date(mail.getPlainBody().split('\n'));
	resource.start = { dateTime: date[0] };
	resource.end = { dateTime: date[1] };

	throw new Error('unimplemented');
}

function delete_event(mail: GoogleAppsScript.Gmail.GmailMessage) {
	const delete_err = (reason: string, id: string) => {
		return err_msg_template('delete_event()', reason, id);
	}

	throw new Error('unimplemented');
}

type EventDateTime = GoogleAppsScript.Calendar.Schema.EventDateTime;
/*

---
*/
function parse_name(body_lines: string[], et: edit_type): string {
	let name: string;
	const idx = body_lines.findIndex((line) => {
		if (et === 'new') {
			return line.includes('名前: ');
		} else {
			throw new Error('unimplemented');
		}
	});

	return body_lines[idx].substring('名前: '.length);
}

function parse_corp(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('組織名（病院名、施設名、会社名など）');
	});

	let answer = lines[idx + 1].split('- ');
	const corp = answer.slice(1).join(' ');
	return corp;
}

function parse_address(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('メール: ');
	});

	return lines[idx].substring('メール: '.length);
}

function parse_phone(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('電話番号: ');
	});

	return lines[idx].substring('電話番号: '.length);
}

function parse_note(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('メモ: ');
	});

	return lines[idx].substring('メモ: '.length);
}

function parse_is_first_time(lines: string[]): boolean {
	let idx = lines.findIndex((line) => {
		return line.includes('初めてのご予約ですか？');
	});

	return lines[idx + 1].includes('はい');
}

function parse_industry(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('お客さまの業種をお知らせください。');
	});

	let answer = lines[idx + 1].split('- ');
	const industry = answer.slice(1).join('- ');
	return industry;
}

function parse_url_of_customer(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('貴社のウェブサイトのURL（アドレス）');
	});

	let answer = lines[idx + 1].split('- ');
	const customer_url = answer.slice(1).join(' ');
	return customer_url;
}

function parse_inner_note(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('内部メモ');
	});

	let inner_note = lines[idx + 2];
	if (inner_note === 'ここでは、このサービスに関するメモを追加できます。このメモは、あなたとスタッフだけが見ることができます。') {
		inner_note = '';
	}
	return inner_note;
}

function parse_meeting_url(lines: string[]): string {
	let idx = lines.findIndex((line) => {
		return line.includes('今すぐ会議に参加する<');
	});

	const meeting_url = lines.slice(idx, idx + 3).join('\n');
	return meeting_url;
}

function parse_date(lines: string[]): [string, string] {
	throw new Error('unimplemented');
	return ['', ''];
}
/*

---
*/

function test() {
	//const mail_id = `<74650e11e20e4eda8ceb1a4749679d23@TYCP286MB2896.JPNP286.PROD.OUTLOOK.COM>`;
	const thread = GmailApp.search('FW: 「ほすぴタッチ」オンライン相談（無料） - シーメンスヘルスケア松本純弥')[0];
	const message = thread.getMessages()[0].getPlainBody().split('n');
	console.log(parse_name(message, 'new'));
	console.log(parse_corp(message));
	console.log(parse_address(message));
	console.log(parse_phone(message));
	console.log(parse_note(message));
	console.log(parse_is_first_time(message));
	console.log(parse_industry(message));
	console.log(parse_url_of_customer(message));
	console.log(parse_inner_note(message));
	console.log(parse_meeting_url(message));
	console.log(parse_date(message));
}
