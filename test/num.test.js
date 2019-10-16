const $num = require('spore-kit-num');
const assert = require('assert');

console.log(
	Object.keys($num).map(
		name => ('spore-kit-num/' + name)
	).join('\n')
);

describe('num.limit', () => {
	test('limit(1, 0, 2) => 1', () => {
		assert($num.limit(1, 0, 2) === 1);
	});
	test('limit(1, 3, 2) => 2', () => {
		assert($num.limit(1, 3, 2) === 2);
	});
	test('limit(1, 1.5, 2) => 1.5', () => {
		assert($num.limit(1, 1.5, 2) === 1.5);
	});
});

describe('num.numerical', () => {
	test('numerical("10") => 10', () => {
		assert($num.numerical('10') === 10);
	});
	test('numerical("x10") => 0', () => {
		assert($num.numerical('x10') === 0);
	});
	test('numerical("x10", 1) => 0', () => {
		assert($num.numerical('x10', 1) === 1);
	});
	test('numerical("100", 0, 2) => 4', () => {
		assert($num.numerical('100', 0, 2) === 4);
	});
});

describe('num.fixTo', () => {
	test('fixTo(1) => "01"', () => {
		assert($num.fixTo('1') === '01');
	});
	test('fixTo(1, 3) => "001"', () => {
		assert($num.fixTo('1', 3) === '001');
	});
});

describe('num.comma', () => {
	test('comma(1234) => "1,234"', () => {
		assert($num.comma(1234) === '1,234');
	});
	test('comma(12345678) => "12,345,678"', () => {
		assert($num.comma(12345678) === '12,345,678');
	});
	test('comma(12345678.12345678) => "12,345,678.12345678"', () => {
		assert($num.comma(12345678.12345678) === '12,345,678.12345678');
	});
});
