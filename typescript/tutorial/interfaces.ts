interface Person { first_name: string; mid_name?: string; last_name: string; readonly my_number: number }
function full_name(p: Person) {// you can also write parameter as ({first_name, last_name}: Person)
	if (p.mid_name) { return `${p.first_name} ${p.mid_name} ${p.last_name}`; }
	return `${p.first_name} ${p.last_name}`;
}

let me = { first_name: 'ya', last_name: 'bai', my_number: 0 };
console.assert(full_name(me) == 'ya bai');

let you = { first_name: 'martin', mid_name: 'luther', last_name: 'king', title: 'jr', my_number: 1 };
console.assert(full_name(you) == 'martin luther king');

interface StringFormat {
	(str: string, is_upper: boolean): string
}

let format: StringFormat;
format = function(str: string, is_upper: boolean = true) {
	return is_upper ? str.toLocaleUpperCase() : str.toLocaleLowerCase();
};

// @ts-ignore
console.assert(format('we') == 'WE');

interface LowerCase {
	(str: string, is_low: boolean, extr: number): string
}
let lower: LowerCase = function(s: string) { return s.toLowerCase(); }
console.assert(lower('HHKB', true, 0) == 'hhkb');

interface Json { toJson(): string; }
class Nation implements Json {
	constructor(private name: string, private id: number) { }
	toJson(): string {
		return JSON.stringify(this);
	}
}

let japan = new Nation('japan', 0);
console.assert(japan.toJson() == '{"name":"japan","id":0}');

// # Extend Interfaces
interface Mailable {
	send(email: string): boolean
	queue(email: string): boolean
}

interface FutureMailable extends Mailable {
	later(email: string, after: number): boolean
}

class Mail implements FutureMailable {
	send(email: string): boolean {
		`send email to ${email}`;
		return true;
	}
	queue(email: string): boolean {
		`queue an email to ${email}`;
		return true;
	}
	later(email: string, after: number): boolean {
		`send email to ${email} in ${after} ms`;
		return true;
	}
}

class Control {
	private state: boolean;
}

interface StatefulControl extends Control {
	enable(): void
}

class Button extends Control implements StatefulControl {
	enable() { }
}
class TextBox extends Control implements StatefulControl {
	enable() { }
}
class Label extends Control { }


// Error: cannot implement because `Chart` does not have state
//class Chart implements StatefulControl {
//	enable() { }
//}

console.log('🫠');
