const $str = require('spore-kit-str');

console.log(
	Object.keys($str).map(
		name => ('spore-kit-str/' + name)
	).join('\n')
);

describe('str.bLength', () => {
	test('bLength("中文cc").length is 6', () => {
		expect($str.bLength('中文cc')).toBe(6);
	});

	test('bLength("").length is 0', () => {
		expect($str.bLength('')).toBe(0);
	});

	test('bLength("cc").length is 2', () => {
		expect($str.bLength('cc')).toBe(2);
	});
});
