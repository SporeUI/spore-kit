const $arr = require('spore-kit-arr');
const assert = require('assert');

console.log(
	Object.keys($arr).map(
		name => ('spore-kit-arr/' + name)
	).join('\n')
);

describe('arr.contains', () => {
	test('contains([1, 2], 1) => true', () => {
		assert($arr.contains([1, 2], 1) === true);
	});
});

describe('arr.erase', () => {
	test('erase([1, 2], 1) => [2]', () => {
		let arr = [1, 2];
		$arr.erase(arr, 1);
		assert(arr.length === 1);
		assert(arr[0] === 2);
	});
});

describe('arr.find', () => {
	test('find([1, 2, 3, 3, 4, 5], val => (val === 3)) => [2,3]', () => {
		let arr = [1, 2, 3, 3, 4, 5];
		let pos = $arr.find(arr, val => (val === 3));
		assert(pos.length === 2);
		assert(pos[0] === 2);
		assert(pos[1] === 3);
	});
});
