const $fn = require('spore-kit-fn');

console.log(
	Object.keys($fn).map(
		name => ('spore-kit-fn/' + name)
	).join('\n')
);

describe('fn.delay', () => {
	test('typeof delay(() => {}) => function', () => {
		expect(typeof $fn.delay(() => {})).toBe('function');
	});
});
