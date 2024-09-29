export function fibonacci(n: number): number {
	if (n < 0) {
		return 0;
	}
	if (n == 1 || n == 0) {
		return n;
	}
	return fibonacci(n - 1) + fibonacci(n - 2);
}

let test_fibonacci = [[1, 2, 3, 4, 5, 6], [1, 1, 2, 3, 5, 8]];
let len = test_fibonacci[0].length;
for (let i = 0; i < len; i++) {
	console.assert(fibonacci(test_fibonacci[0][i]) == test_fibonacci[1][i]);
}

// # Function Types
let add: (x: number, y: number) => number;
add = function(a: number, b: number): number {
	return a - b;
}

let arithmetic_op = [(x: number, y: number) => x + y, (x: number, y: number) => x - y, (x: number, y: number) => x * y, (x: number, y: number) => x / y,];
let answer = [5, -1, 6, 2 / 3];
len = arithmetic_op.length;
for (let i = 0; i < len; i++) {
	console.assert(arithmetic_op[i](2, 3) == answer[i], `i is ${i}`);
}

// # Optional parameters
function mul(a: number, b: number, c?: number): number {
	if (typeof c !== 'undefined') {
		return a * b * c;
	}
	return a * b;
}

// # Default Parameters
function complex_condition(b: string, a: number = 6,): boolean {
	return !(a < 6) && b.length > a;
}
console.assert(complex_condition('1234567'));

function add_one_or_more(a: number = 1, b: number): number {
	return a + b;
}
console.assert(add_one_or_more(undefined, 0) == 1);

// # Rest Parameter
function rest_param(...args: (number | string | boolean)[]): [number, string, boolean] {
	let sum = 0;
	let concat = '';
	let has_true = false;
	args.forEach((arg) => {
		switch (typeof arg) {
			case "string":
				concat += arg;
				break;
			case "number":
				sum += arg;
				break;
			case "boolean":
				has_true = has_true || arg;
				break;
			default:
				console.assert(false, 'arg must be only number, string, or boolean');
		}
	});
	return [sum, concat, has_true];
}

let [sum, concat, has_true] = rest_param(1, 1, 'si', false, 'ng', -2, 'apole', 666, true, true);
console.assert(sum == 666);
console.assert(concat == 'singapole');
console.assert(has_true == true);


function terminal(): void {
	console.log('🫠');
}
terminal()
