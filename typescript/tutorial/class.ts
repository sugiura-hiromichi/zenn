class Nation {
	constructor(private readonly name: string, private population: number = 0) {
		this.name = name;
		this.population = population;
	}

	get_verbose_info(): string {
		return `name: ${this.name}, population: ${this.population}`
	}
}

let japan = new Nation('japan');
console.assert(japan.get_verbose_info() === 'name: japan, population: 0');

// # Getter & Setter
class Person {
	private static _count: number = 0;
	private _age: number;
	private readonly _birth_date: string;
	private _family_name: string;
	private _given_name: string;

	constructor(age: number, birth_date: string, family_name: string, given_name: string) {
		Person._count += 1;
		this._age = age;
		this._birth_date = birth_date;
		this._family_name = family_name;
		this._given_name = given_name;
	}

	static get_count(): number {
		return Person._count;
	}

	get age(): number {
		return this._age;
	}
	set age(n: number) {
		if (n < 0) { throw new Error('age is invalid'); }
		this._age = n;
	}

	get birth_date(): string {
		return this._birth_date;
	}

	get name(): string {
		return `${this._family_name} ${this._given_name}`;
	}
	set family_name(fn: string) {
		this._family_name = fn;
	}
	set given_name(gn: string) {
		this._given_name = gn;
	}
}

let me = new Person(0, Date(), 'nico', 'nico');
console.assert(me.name === 'nico nico');

// # Inheritance
class AncientNation extends Nation {
	constructor(name: string, population: number = 0, private current_region: string[],) {
		if (typeof population === 'undefined') {
			population = 0;
		}
		super(name, population);
		this.current_region = current_region;
	}

	get_verbose_info(): string {
		return super.get_verbose_info() + `, current_region: ${this.current_region}`;
	}
}

let wa = new AncientNation('wa', 0, ['japan']);
console.assert(wa.get_verbose_info() === 'name: wa, population: 0, current_region: japan', wa.get_verbose_info());

// # Static Methods & Properties
console.assert(Person.get_count() === 1);
let you = new Person(0, Date(), 'you', 'tube');
console.assert(Person.get_count() === 2);

// # Abstract Class
abstract class Employee {
	constructor(private first_name: string, private last_name: string) { }
	abstract get_salary(): number;
	get full_name(): string {
		return `${this.first_name} ${this.last_name}`;
	}
	compensation_statement(): string {
		return `${this.full_name} makes ${this.get_salary()} a month`;
	}
}

// ` let employee = new Employee('ya', 'o'); ` this code cause error because Abstract Class can not
// be instantialized
class FullTimeEmployee extends Employee {
	constructor(first_name: string, last_name: string, private salary: number) {
		super(first_name, last_name);
	}

	get_salary(): number {
		return this.salary;
	}
}

class Contractor extends Employee {
	constructor(first_name: string, last_name: string, private rate: number, private hours: number) {
		super(first_name, last_name)
	}

	get_salary(): number {
		return this.rate * this.hours;
	}
}

let emp1 = new FullTimeEmployee('emp', '1', 666);
let emp2 = new Contractor('emp', '2', 25250, 0.1);
console.assert(emp1.compensation_statement() === 'emp 1 makes 666 a month');
console.assert(emp2.compensation_statement() === 'emp 2 makes 2525 a month');

console.log('🫠');
