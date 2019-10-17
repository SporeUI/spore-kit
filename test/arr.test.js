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
		assert(arr.join() === '2');
	});
});

describe('arr.find', () => {
	test('find([1, 2, 3, 3, 4, 5], val => (val === 3)) => [2,3]', () => {
		let arr = [1, 2, 3, 3, 4, 5];
		let pos = $arr.find(arr, val => (val === 3));
		assert(pos.join() === '2,3');
	});
});

describe('arr.flatten', () => {
	test('flatten([[1, 2], [3, [4]]]) => [1,2,3,4]', () => {
		let arr = [[1, 2], [3, [4]]];
		let farr = $arr.flatten(arr);
		assert(farr.join() === '1,2,3,4');
	});
});

describe('arr.include', () => {
	test('include([[1, 2], 1) => [1,2]', () => {
		let arr = [1, 2];
		$arr.include(arr, 1);
		assert(arr.join() === '1,2');
		$arr.include(arr, 3);
		assert(arr.join() === '1,2,3');
	});
});
