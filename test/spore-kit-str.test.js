const $str = require('../packages/spore-kit-str');

const test = global.test;
const expect = global.expect;

test('bLength("中文cc").length is 6', () => {
	expect($str.bLength('中文cc')).toBe(6);
});
