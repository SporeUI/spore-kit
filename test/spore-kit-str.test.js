const $kit = require('../index');

const test = global.test;
const expect = global.expect;
const describe = global.describe;

describe('$kit.str.bLength', () => {
	const bLength = $kit.str.bLength;
	test('bLength("中文cc").length is 6', () => {
		expect(bLength('中文cc')).toBe(6);
	});

	test('bLength("").length is 0', () => {
		expect(bLength('')).toBe(0);
	});

	test('bLength("cc").length is 2', () => {
		expect(bLength('cc')).toBe(2);
	});
});
