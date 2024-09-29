// # intersection
// intersected_string_and_number
type alphanumeric = string & number;// actual type of alphanumeric is never
type num_str_union = string | number;

interface BusinessPartner { name: string; credit: number }
interface Identity { id: number; name: string }
interface Contact { email: string; phone: string }

type Employee = Identity & Contact;
type Customer = BusinessPartner & Contact;

// all four properties are required
let e: Employee = {
	id: 0, email: 'hoge@hugo.com', name: '0w0', phone: '123-4567-8900'
}
let c: Customer = {
	name: '', credit: 0, email: '', phone: ''
}

// ## type order
// `an` `na` is same type
type an = string & number;
type na = number & string;

// # type guard
let a = 0;
console.assert(typeof a === 'number');

class A { s: string; t: string }
let aa = new A();
console.assert(aa instanceof A);
console.assert(!('s' in aa));
aa.s = '';
console.assert('s' in aa);

let body = document.getElementsByTagName('body');
console.assert(body.length == 1);

let head1 = document.createElement('h1');
head1.textContent = 'FromHere';
document.body.appendChild(head1);

let p = document.createElement('p');
p.textContent = 'How do you like wednesday?';
document.body.appendChild(p);

console.log('🫠');
