const LABEL = 'booking_registered';

function main() {
	try {
		booking_mails();
	} catch (e) {
		GmailApp.sendEmail(
			'clive.hospitouch@gmail.com',
			'エラー：オンライン相談自動化の処理が正常に終了しませんでした',
			'エラー内容：\n\n' + e,
			{ name: 'GAS実行失敗' }
		)
		GmailApp.sendEmail(
			'kubota8801@gmail.com',
			'エラー：オンライン相談自動化の処理が正常に終了しませんでした',
			'エラー内容：\n\n' + e,
			{ name: 'GAS実行失敗' }
		)
	}
}

function booking_mails() {
	const booking_address = 'hospitouch2@c-live.jp';

	// `lABEL`が存在する場合は新たに作成し、存在する場合は何もしない
	//GmailApp.createLabel(LABEL);
	let threads = GmailApp.search(`in:inbox AND has:nouserlabels -l:${LABEL} AND from:${booking_address} AND after: 2024/10/17`);

	threads.sort((a, b) => {
		const am = a.getMessages()[0].getDate().getTime();
		const bm = b.getMessages()[0].getDate().getTime();
		return am - bm;
	});

	let sorted_messages = threads.flatMap((thread) => {
		return thread.getMessages();
	});

	sorted_messages.sort((a: GoogleAppsScript.Gmail.GmailMessage, b: GoogleAppsScript.Gmail.GmailMessage) => {
		return a.getDate().getTime() - b.getDate().getTime();
	});

	const u = Gmail.Users;
	if (u === undefined) { throw new Error(`Gmail.Users is undefined`); }
	const l = u.Labels;
	if (l === undefined) { throw new Error(`Gmail.Users.Labels is undefined`); }
	const label = l.list(Session.getActiveUser().getEmail()).labels?.find((l) => {
		return l.name === LABEL;
	});
	if (label === undefined) {
		GmailApp.createLabel(LABEL);
		throw new Error(`failed to get label_id`);
	}
	const label_id = label.id;
	if (label_id === undefined) { throw new Error(`label id is undefined`); }

	for (let i = 0; i < sorted_messages.length; i += 1) {
		try {
			EditCalendar.calendar(sorted_messages[i]);
		} catch (e) {
			console.log(e);
			continue;
		}

		let msg = u.Messages;
		if (msg === undefined) { throw new Error("Gmail.Users.Messages is undefined"); }
		msg.modify({ addLabelIds: [label_id] }, Session.getActiveUser().getEmail(), sorted_messages[i].getId());
	}

}

function test2() {
	let threads = GmailApp.search('from: hospitouch2@c-live.jp');
	console.log(threads[1].getMessages()[0].getBody());
	console.log(threads[1].getMessages()[0].getPlainBody());
}
