const new_reserv_sub = ['新しいご予約: ', ' 様 (「ほすぴタッチ」オンライン相談（無料）)'];
const reserv_update_sub = ['予約が更新されました: ', ' 様の 「ほすぴタッチ」オンライン相談（無料）'];
const canceled_reserv_sub = 'キャンセルされた予約: 「ほすぴタッチ」オンライン相談（無料） の ';
const my_email = Session.getActiveUser().getEmail();
const calendar_ids = [/* clkoyomi@gmail.com, 社長のid, */'ec29f67611b0808fa720fc24bc48daa07355dd20e4a4483cc58c5cd2e01bf850@group.calendar.google.com'];
const event_title = '【久保田】「ほすぴタッチ」オンライン相談（無料） - ';
const err_msg_template = (where: string, reason: string, id: string) => {
	return new Error(`------------------------------------\nFrom: calendar.ts/${where}\n\t${reason}\n\tcalendar_id: ${id}\n------------------------------------`);
};

namespace EditCalendar {
	export function calendar(mail: GoogleAppsScript.Gmail.GmailMessage) {
		const subject = mail.getSubject();

		if (subject.includes(new_reserv_sub[0])) {
			console.log(`new ${subject}`)
			store_date(mail);
		} else if (subject.includes(reserv_update_sub[0])) {
			console.log(`update ${subject}`)
			update_event(mail);
		} else if (subject.includes(canceled_reserv_sub)) {
			console.log(`cancel ${subject}`)
			delete_event(mail);
		} else if (subject.includes(register_sub)) {
			console.log(`store ${subject}`)
			append_description(mail);
		}
	}
}

type calendar_event = GoogleAppsScript.Calendar.Schema.Event;

/// # Panic
///
/// この関数はカレンダーのイベントを作成できなかった場合例外を投げます
/// 呼び出し元が例外処理の責任を持ちます
function new_event(resource: calendar_event) {
	const register_err = (reason: string, id: string) => {
		return err_msg_template('register_event()', reason, id);
	}


	calendar_ids.forEach((calendar_id) => {
		const err = (reason: string) => {
			return register_err(reason, calendar_id);
		}
		let e = Calendar.Events;
		if (e === undefined) {
			throw err('failed to get calendar events');
		}

		const resource_cpy = JSON.parse(JSON.stringify(resource));
		resource_cpy.summary = event_title;
		let already_reserved = e.list(calendar_id).items;
		if (already_reserved !== undefined) {
			already_reserved = already_reserved.filter((event) => {
				const summary = event.summary;
				return (summary !== undefined) && (summary.includes('久保田') || summary.includes('社長'));
			}).filter((event) => {
				// 時間帯が被っているイベントを検出します
				const s = event.start?.dateTime;
				const e = event.end?.dateTime;
				const s_res = resource.start?.dateTime;
				const e_res = resource.end?.dateTime;
				if (s === undefined || e === undefined || s_res === undefined || e_res === undefined) {
					return false;
				}

				const start0 = new Date(s).getTime();
				const end0 = new Date(e).getTime();

				const start = new Date(s_res).getTime();
				const end = new Date(e_res).getTime();

				if ((start0 <= start && start < end0) || (start0 < end && end <= end0)) {
					return true;
				}

				return false;
			});
		}

		if (already_reserved !== undefined && already_reserved.length !== 0) {
			const suggest_duplication = '先方からの修正待ち：';
			resource.summary = suggest_duplication + resource.summary;
			//						GmailApp.sendEmail()
		}

		console.log(resource);
		e.insert(resource, calendar_id);

		if (resource.description === undefined) {
			throw err('resource.description is undefined');
		}
		const address = parse_address(resource.description);

		if (already_reserved !== undefined && already_reserved.length !== 0) {
			if (resource.description === undefined || resource.start?.dateTime === undefined) { throw err('resource.summary is undefined') }
			const corp = parse_corp(resource.description);
			const name = resource.summary?.substring(event_title.length);
			const date = new Date(resource.start?.dateTime).toLocaleString();
			const body = corp + '\n' + name + 'さま\n\nこの度は「ほすぴタッチ」のオンライン相談（無料）をご予約くださいまして誠にありがとうございます。' + parse_address(resource.description) + `

${date}からのご予約となっていますが、ご希望のお時間は既に他のお客様の予約が入っております。
お手数おかけしますが、他の時間帯にてご予約下さい。

引き続きよろしくお願い申し上げます。

①「ほすぴタッチ」のカタログ・経営層向けミニBOOK・料金表などは
　下記よりダウンロードいただけます。
　https://hospi.ai/beginner/documents/


◇おススメ ◇
②「ほすぴタッチ」では、導入前のシフト作成のお悩みや「ほすぴタッチ」の
　デモ画面のご説明等を、無料のオンライン相談でお受けしております。
　下記よりすぐにご予約できます。どうぞお気軽にご予約ください（無料）。

　◆また、この無料オンライン相談は、本番導入後も永続的に続きます。
　　まるでシフト管理部門が新しくできたようなイメージです。
　https://outlook.office365.com/owa/calendar/Bookings@c-live.jp/bookings/


③また、初期設定・初期導入の作業をすべて当社にて代行いたします。
　※費用はすべて初期費用に含まれますので、追加費用の必要はございません。
　https://hospi.ai/initial-setting/


④お客さまご記入用ヒアリングシートは下記よりダウンロードいただけます。
　https://hospi.ai/initial-setting/excel/


⑥YouTube動画　5分ですぐわかる「ほすぴタッチ」　はこちらをご覧ください。
　https://www.youtube.com/watch?v=pBmmRqfFzC0



◆ほすぴタッチ　お問い合わせ◆
メール：　hospitouch@c-live.jp
オンライン相談（無料）：
https://outlook.office365.com/book/Bookings@c-live.jp/


今後とも、「ほすぴタッチ」を何卒よろしくお願い申し上げます。


ー
AIと数理モデルで勤務シフト表を自動作成
「ほすぴタッチ」　オンラインサポートチーム
ーーーーーーーーーーー
これまで自動化をあきらめていたような
独自のシフトルールや複雑な勤務条件に
こそ威力を発揮
ーーーーーーーーーーー
◇公式ウェブサイト　https://hospi.ai/
◇無料オンライン相談のご予約（オンライン会議形式）
https://outlook.office365.com/owa/calendar/Bookings@c-live.jp/bookings/
ーーーーーーーーーーー`;
			//GmailApp.sendEmail('kubota8801@gmail.com', 'TEST----------------------（ほすぴタッチ）　オンライン相談（無料）ご予約変更のお願い', body);
			GmailApp.sendEmail(address, 'TEST------------------（ほすぴタッチ）　オンライン相談（無料）ご予約変更のお願い', body);
		} else {
			const name = resource.summary?.substring(event_title.length);
			const corp = parse_corp(resource.description);

			//▼10月 21日 (月曜日)　 16:00　開始
			//<https://teams.microsoft.com/l/meetup-join/19%3ameeting_YzIyZDNiNTAtYzBhZC00MmY0LThjNjgtMmI1ZjQ2ZGU1MTk2%40thread.v2/0?context=%7b%22Tid%22%3a%22fc88761e-0a41-4c4a-a1d1-95bb5fdad454%22%2c%22Oid%22%3a%22ce88df1a-0c79-47f1-9b52-229385b124b3%22%7d>
			//会議 ID: 471 400 867 682
			//パスコード: 38RuZB
			//
			// ↑フォーマット
			if (resource.description === undefined || resource.start?.dateTime === undefined) { throw err('resource.summary is undefined') }
			const url = new Date(resource.start?.dateTime).toLocaleString() + '開始\n' + parse_url(resource.description);
			const body = corp + '\n' + name + `さま


この度は「ほすぴタッチ」のオンライン相談（無料）をご予約くださいまして誠にありがとうございます。


①下記の日時にてご予約をたまわりました。
お時間になりましたら、パソコンのブラウザ・カメラ・マイクにて、下記のURLよりご参加ください。

${url}


②「ほすぴタッチ」のカタログ・経営層向けミニBOOK・料金表などは
　下記よりダウンロードいただけます。
　https://hospi.ai/beginner/documents/


◇おススメ ◇
③「ほすぴタッチ」では、導入前のシフト作成のお悩みや「ほすぴタッチ」の
　デモ画面のご説明等を、無料のオンライン相談でお受けしております。
　下記よりすぐにご予約できます。どうぞお気軽にご予約ください（無料）。

　◆また、この無料オンライン相談は、本番導入後も永続的に続きます。
　　まるでシフト管理部門が新しくできたようなイメージです。
　https://outlook.office365.com/owa/calendar/Bookings@c-live.jp/bookings/


④また、初期設定・初期導入の作業をすべて当社にて代行いたします。
　※費用はすべて初期費用に含まれますので、追加費用の必要はございません。
　https://hospi.ai/initial-setting/


⑤お客さまご記入用ヒアリングシートは下記よりダウンロードいただけます。
　https://hospi.ai/initial-setting/excel/


⑥YouTube動画　5分ですぐわかる「ほすぴタッチ」　はこちらをご覧ください。
　https://www.youtube.com/watch?v=pBmmRqfFzC0



◆ほすぴタッチ　お問い合わせ◆
メール：　hospitouch@c-live.jp
オンライン相談（無料）：
https://outlook.office365.com/book/Bookings@c-live.jp/


今後とも、「ほすぴタッチ」を何卒よろしくお願い申し上げます。


ー
AIと数理モデルで勤務シフト表を自動作成
「ほすぴタッチ」　オンラインサポートチーム
ーーーーーーーーーーー
これまで自動化をあきらめていたような
独自のシフトルールや複雑な勤務条件に
こそ威力を発揮
ーーーーーーーーーーー
◇公式ウェブサイト　https://hospi.ai/
◇無料オンライン相談のご予約（オンライン会議形式）
https://outlook.office365.com/owa/calendar/Bookings@c-live.jp/bookings/
ーーーーーーーーーーー`
			// TODO: アドレスを客のものに変える
			//GmailApp.sendEmail('kubota8801@gmail.com', 'TEST-------------', body);
			GmailApp.sendEmail(address, 'TEST-------------', body);
		}
	});
}

/// # Panic
///
/// この関数はカレンダーのイベントをアップデート出来なかった場合例外を投げます
/// 呼び出し元が例外処理の責任を持ちます
function update_event(mail: GoogleAppsScript.Gmail.GmailMessage) {
	const update_err = (reason: string, id: string) => {
		return err_msg_template('update_event()', reason, id);
	}
	let resource: calendar_event = { creator: { email: my_email } };
	resource.summary = parse_subject(mail.getSubject(), 'update');
	const date = parse_date(mail.getPlainBody().split('\n'));
	resource.start = { dateTime: date[0] };
	resource.end = { dateTime: date[1] };

	calendar_ids.forEach((calendar_id) => {
		const err = (reason: string) => {
			return update_err(reason, calendar_id);
		}

		let rslt = detect_target(resource, calendar_id, err);
		if (rslt === undefined) { throw err('no event appear to be updated') }
		rslt.e.update(resource, calendar_id, rslt.event_id);
		console.log('updated successfully!');
		// TODO: アドレスを客のものに変える
		//GmailApp.sendEmail('kubota8801@gmail.com', 'TEST--------------', '予約が更新されました');

		if (rslt.target.description === undefined) { throw err('rslt.target.description is undefined') }
		const address = parse_address(rslt.target.description);
		GmailApp.sendEmail(address, 'TEST--------------', '予約が更新されました');
	});
}

function delete_event(mail: GoogleAppsScript.Gmail.GmailMessage) {
	const delete_err = (reason: string, id: string) => {
		return err_msg_template('delete_event()', reason, id);
	}
	let resource: calendar_event = { creator: { email: my_email } };
	resource.summary = parse_subject(mail.getSubject(), 'delete');
	const date = parse_date(mail.getPlainBody().split('\n'));
	resource.start = { dateTime: date[0] };
	resource.end = { dateTime: date[1] };

	calendar_ids.forEach((calendar_id) => {
		const err = (reason: string) => { return delete_err(reason, calendar_id); }
		let rslt = detect_target(resource, calendar_id, err);
		if (rslt === undefined) { throw err('no event appear to be deleted') }

		rslt.e.remove(calendar_id, rslt.event_id);

		if (rslt.target.description === undefined) { throw err('rslt.target.description is undefined') }
		const address = parse_address(rslt.target.description);
		//GmailApp.sendEmail('kubota8801@gmail.com', 'TEST--------------', '予約がキャンセルされました');
		GmailApp.sendEmail(address, 'TEST--------------', '予約がキャンセルされました');
	});
}

// NOTE: --------------------------------------------------------------------

function detect_target(
	resource: calendar_event,
	calendar_id: string,
	err: (reason: string) => Error
): { e: GoogleAppsScript.Calendar.Collection.EventsCollection, target: calendar_event, event_id: string } | undefined {
	let e = Calendar.Events;
	if (e === undefined) {
		throw err('failed to get calendar events');
	}

	let items = e.list(calendar_id).items;
	if (items === undefined || items.length === 0) {
		throw err('while calling detect_target\n\tthere is no events to be updated\n\nDebug Info:\n' + JSON.stringify(resource));
	}

	let targets = items.filter((item) => {
		const summary = resource.summary;
		if (summary === undefined) {
			return false;
		}
		return item.creator?.email === my_email && item.summary?.includes(summary);
	});
	if (targets.length === 0) {
		return undefined;
	}
	targets.sort((a, b) => {
		const a_datetime = a.start?.dateTime;
		const b_datetime = b.start?.dateTime;

		if (a_datetime === undefined || b_datetime === undefined) {
			throw err('failed to get dateTime');
		}

		const a_dt = new Date(a_datetime).getTime();
		const b_dt = new Date(b_datetime).getTime();

		return a_dt - b_dt;
	});

	const id = targets[0].id;
	if (id === undefined) {
		throw err('failed to get event_id');
	}

	return { e: e, target: targets[0], event_id: id };
}

type edit_type = 'new' | 'update' | 'delete' | 'register';
function parse_subject(sub: string, et: edit_type): string {
	let name = '';
	if (et === 'new') {
		const name_start = new_reserv_sub[0].length;
		const name_end = sub.length - new_reserv_sub[1].length;
		name = sub.substring(name_start, name_end);
	} else if (et === 'update') {
		const name_start = reserv_update_sub[0].length;
		const name_end = sub.length - reserv_update_sub[1].length;
		name = sub.substring(name_start, name_end);
	} else if (et === 'delete') {
		const name_start = canceled_reserv_sub.length;
		name = sub.substring(name_start);
	} else if (et === 'register') {
		const name_start = register_sub.length;
		name = sub.substring(name_start);
	}

	return `${event_title}${name}`;
}

type EventDateTime = GoogleAppsScript.Calendar.Schema.EventDateTime;

function parse_date(body: string[]): [string, string] {
	const idx = body.findIndex((line) => {
		return line.includes('年') && line.includes('月') && line.includes('日');
	});

	let date = body[idx].replace('年', '/')
		.replace('月', '/');
	date = date.substring(0, date.length - 5);
	const duration = body[idx + 1].split(' - ').map((time) => {
		return time.trim();
	});

	// イベントの開始時間
	const start = new Date(`${date} ${duration[0]}`).toISOString();
	// イベントの終了時間
	const end = new Date(`${date} ${duration[1]}`).toISOString();

	return [start, end];
}

function parse_desc(body: string, et: edit_type): string {
	let description: string | undefined;
	if (et === 'new') {
		const lines = body.split('\n');
		const idx = lines.findIndex((line) => {
			return line.includes('<https://teams.microsoft.com/');
		});

		description = `${lines[idx]}\n${lines[idx + 1]}\n${lines[idx + 2]}\n`;

		if (description !== undefined) {
			description = '・面談URL ↓\n' + description;
		}
	} else if (et === 'register') {
		description = body.split('追加情報\n--------------------')[0];
	}

	if (description === undefined) { description = ''; }
	return description;
}

function parse_url(desc: string): string {
	return desc.split('\n').filter((_line, idx) => { return idx === 1 })[0];
}

function parse_address(desc: string): string {
	let address = desc.split('\n').find((line) => {
		return line.includes('メール: ');
	});

	console.log(`取得したアドレス：${address}`)
	if (address === undefined) { return ''; }
	return address.substring('メール: '.length);
}

function parse_corp(desc: string): string {
	let lines = desc.split('\n');
	let corpidx = lines.findIndex((line) => {
		return line.includes('組織名（病院名、施設名、会社名など）');
	});

	let answer = lines[corpidx + 1].split('- ');
	const corp = answer.slice(1).join('');
	return corp;
}
