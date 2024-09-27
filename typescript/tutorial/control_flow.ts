// # if
let not_falsy = true;
if (not_falsy) {
	console.assert(not_falsy);
} else {
	console.log('🫠');
}

// sugered statement of above
not_falsy ? console.assert(not_falsy) : console.log('🫠');

// # switch .. case
let btn = 0;
let log: string;

switch (btn) {
	case 0: case 1: case 5:
		log = 'del';
		break;
	case 6: case 8: case 7:
		log = 'update';
		break;
	default:
		log = 'new';
}
console.assert(log == 'del');
// ..
