const $fn = require('../../packages/fn');

console.log(
	Object.keys($fn).map(
		name => ('../../packages/fn/' + name)
	).join('\n')
);

describe('fn.delay', () => {
	test('typeof delay(() => {}) => function', () => {
		expect(typeof $fn.delay(() => {})).toBe('function');
	});
});
