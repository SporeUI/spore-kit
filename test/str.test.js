const $str = require('spore-kit-str');
const assert = require('assert');

console.log(
	Object.keys($str).map(
		name => ('spore-kit-str/' + name)
	).join('\n')
);

describe('str.bLength', () => {
	test('bLength("中文cc").length is 6', () => {
		assert($str.bLength('中文cc') === 6);
	});

	test('bLength("").length is 0', () => {
		assert($str.bLength('') === 0);
	});

	test('bLength("cc").length is 2', () => {
		assert($str.bLength('cc') === 2);
	});
});
