const ud = undefined;
console.assert(ud === undefined, 'triple ud');
console.assert(ud == undefined, 'double ud');
const str = 'a';
console.assert(str !== undefined, 'triple str');
console.assert(str != undefined, 'double str');

const new_reservation_title = /新しいご予約: ^[.*]$様 (「ほすぴタッチ」オンライン相談（無料）)/;
console.assert(!new_reservation_title.test('新しいご予約: 今関雄揮 様 (「ほすぴタッチ」オンライン相談（無料）)'), 'regex');

const a = 'こんにちはaんsix';
console.assert(a.length == 10, `a len is ${a.length}`);
console.assert(a[0] == 'こ');
console.assert(a.substring(0, 1) == 'こ');

const jp_date_format = new Date('2024年10月7日');
console.assert(Number.isNaN(jp_date_format.getTime()));

let rpls = 'safari';
let new_rpls = rpls.replace('a', 'i');
console.assert(rpls === 'safari', rpls);
console.assert(new_rpls === 'sifari', new_rpls);

const date = new Date('2024/10/1');
const time_duration = '11:00 - 12:00'.split(' - ').map((time) => {
	return time.split(':');
});


const start = date.setHours(parseInt(time_duration[0][0]), parseInt(time_duration[0][1]));
const end = date.setHours(parseInt(time_duration[1][0]), parseInt(time_duration[1][1]));
console.assert(end - start === 60 * 60 * 1000, end - start);

const replaced = '2024年10月7日'.replace('年', '/').replace('月', '/').replace('日', '');
console.assert(replaced === '2024/10/7', `replaced is ${replaced}`);

let date2 = new Date('2024/10/7 11:00');
console.log(date2.toLocaleString());

let aaaaaaa = 0;

for (; aaaaaaa < 10;) {
	try {
		aaaaaaa += 1;
		throw new Error('');
	} catch (e) { continue; }

	aaaaaaa += 1000;
}

console.assert(aaaaaaa === 10);

console.log('🫠');
