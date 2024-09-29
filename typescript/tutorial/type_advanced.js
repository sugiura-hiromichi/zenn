// all four properties are required
var e = {
    id: 0, email: 'hoge@hugo.com', name: '0w0', phone: '123-4567-8900'
};
var c = {
    name: '', credit: 0, email: '', phone: ''
};
// # type guard
var a = 0;
console.assert(typeof a === 'number');
var A = /** @class */ (function () {
    function A() {
    }
    return A;
}());
var aa = new A();
console.assert(aa instanceof A);
console.assert(!('s' in aa));
aa.s = '';
console.assert('s' in aa);
var body = document.getElementsByTagName('body');
console.assert(body.length == 1);
var head1 = document.createElement('h1');
head1.textContent = 'FromHere';
document.body.appendChild(head1);
var p = document.createElement('p');
p.textContent = 'How do you like wednesday?';
document.body.appendChild(p);
console.log('🫠');
