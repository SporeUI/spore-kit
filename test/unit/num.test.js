const $num = require('../../packages/num');

console.log(
	Object.keys($num).map(
		name => ('../../packages/num/' + name)
	).join('\n')
);

describe('num.limit', () => {
	test('limit(1, 0, 2) => 1', () => {
		expect($num.limit(1, 0, 2)).toBe(1);
	});
	test('limit(1, 3, 2) => 2', () => {
		expect($num.limit(1, 3, 2)).toBe(2);
	});
	test('limit(1, 1.5, 2) => 1.5', () => {
		expect($num.limit(1, 1.5, 2)).toBe(1.5);
	});
});

describe('num.numerical', () => {
	test('numerical("10") => 10', () => {
		expect($num.numerical('10')).toBe(10);
	});
	test('numerical("x10") => 0', () => {
		expect($num.numerical('x10')).toBe(0);
	});
	test('numerical("x10", 1) => 0', () => {
		expect($num.numerical('x10', 1)).toBe(1);
	});
	test('numerical("100", 0, 2) => 4', () => {
		expect($num.numerical('100', 0, 2)).toBe(4);
	});
});

describe('num.fixTo', () => {
	test('fixTo(1) => "01"', () => {
		expect($num.fixTo('1')).toBe('01');
	});
	test('fixTo(1, 3) => "001"', () => {
		expect($num.fixTo('1', 3)).toBe('001');
	});
});

describe('num.comma', () => {
	test('comma(1234) => "1,234"', () => {
		expect($num.comma(1234)).toBe('1,234');
	});
	test('comma(12345678) => "12,345,678"', () => {
		expect($num.comma(12345678)).toBe('12,345,678');
	});
	test('comma(12345678.12345678) => "12,345,678.12345678"', () => {
		expect($num.comma(12345678.12345678)).toBe('12,345,678.12345678');
	});
});
