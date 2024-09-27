// # Primitive Types

// ## Number Type

let num: number;
// `console.log(price);` this code cause error because price is used before initialized

// decimal
num = 3.1415;
console.assert(num == 3.1415);

// binary
num = 0b1010011010;
console.assert(num == 666);

// octal
num = 0o1411;
console.assert(num == 777);

// hexdecimal
num = 0x1229;
console.assert(num == 4649);

// big integer
let big: bigint = 1234567890987654321n;
console.assert(big == 1234567890987654321n);
big = 0n;
console.assert(big == 0n);

// ## String Type
let str: string = 'HHKB';
console.assert(str == 'HHKB');

str = `multi
line
string`;
console.assert(str == 'multi\nline\nstring');

let interpolation1 = 'one';
let interpolation2 = 'two';
let interpolation = `zero ${interpolation1} ${interpolation2}`;
console.assert(interpolation == 'zero one two');

// ## bolean Type
let bool: boolean = true;
console.assert(bool);
// do not use `Boolean` type as possible

// # Basic Types

// ## Object Type
let obj: { key0: string, key1: number, key2: boolean } = { key0: 'value0', key1: 1, key2: false };
console.assert(obj.key0 == 'value0');
console.assert(obj.key1 == 1);
console.assert(obj.key2 == false);
console.assert(typeof obj == 'object');

let empty: object;// you can also annotate as `let empty: {};`
empty = {};
console.assert(empty.toString() == '[object Object]');
console.assert(typeof empty == 'object');

// ## Array Type
let ary: number[] = [];
ary[0] = 4;
ary.push(3);
console.assert(ary.toString() == '4,3');
console.assert(typeof ary[0] == 'number');
console.assert(typeof ary == 'object');
console.assert(ary.length == 2);
console.assert(ary.map(i => i * 2).toString() == '8,6');

let mix: (number | boolean)[];
mix = [true, 3];
console.assert(mix.toString() == 'true,3');

// ## Tuple Type
let tpl: [number, boolean] = [3, true];
console.assert(tpl.toString() == '3,true');
let tpl0: [number, string?] = [0];
console.assert(tpl0.toString() == '0');
console.assert(tpl0[1] == undefined);
tpl0[1] = 'a';
console.assert(tpl0.toString() == '0,a');

// ## Enum Type
enum A {
	a,
	b
}

let e = A.a;
console.assert(e == A.a);
console.assert(e == 0);
e = 1;
console.assert(e == A.b);

// ## Any Type
let rslt: any;
console.assert(typeof rslt == 'undefined');
rslt = 0;
console.assert(rslt == 0);
rslt = 'OwO';
console.assert(rslt == 'OwO');
rslt = [1, 1, 2, 3, 5];
const total = rslt.reduce((a: number, b: number) => a + b, 0);
console.assert(total == 12);
console.assert(typeof total == 'number');
// any types passes type check
console.assert(typeof rslt.a == 'undefined');

// ## Unknown Type
let uk: unknown;
uk = 0; uk = '0w0'; uk = true; uk = Symbol();
console.assert(typeof uk == 'symbol');
// `uk.reduce((x:number,y:number)=>x+y,0)` this code cause error because unknown type must be
// asserted to a specific type
uk = [1, 2, 3];
const sum = (uk as number[]).reduce((a: number, b: number) => a + b, 0);
console.assert(sum == 6);

// ## Union Type
let uni: number | boolean;
uni = 5;
uni = true;

// ## String Literal Type
let str_lit: 'str_lit';
str_lit = 'str_lit';
// `str_lit = '0w0';` this code cause error
type CustomMouseEvent = 'click' | 'scroll' | 'moveleft' | 'movedown' | 'moveup' | 'moveright';
let mouse_event: CustomMouseEvent;

// ## Never Type
let nvr: never;// never type is unassignable
// interserction type is inferred as `never`


// # Type Aliases

// ## Primitive Types
type aliased_string = string;
let str_aliased: aliased_string = 'aliased';
console.assert(typeof str_aliased == 'string');
//`console.assert(typeof str_aliased == 'aliased_string');` this code cause error

// ## Object Types
type AliasedObj = { name: aliased_string, age: number };
let obj_aliased: AliasedObj = { name: 'me', age: 666 };

// ## union Types
type alphanumeric = string | number;
let an: alphanumeric = 0;
console.assert(typeof an == 'number');

// ## Intersection Types
type Personal = { name: string; age: number }; type Contact = { email: string; phone: string };
type PersonWithContact = Personal & Contact;
let candidate: PersonWithContact = {
	name: '0w0', age: 0, email: 'google@gmail.com', phone: '999-9999-9999'
};


console.log("🫠");
