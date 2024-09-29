import { fibonacci } from './functions';
console.assert(fibonacci(6) === 8);

function merge<U extends object, V extends object>(o1: U, o2: V) {
	return { o1, o2 };
}

// this code cause error
// ` let person = merge({ name: 'John' }, 25); `

class Stack<T> {
	private elements: T[] = [];
	constructor(private size: number) { }
	push(e: T): void {
		this.elements.push(e);
	}
}

// # generic interfaces
interface IF<T> { }
