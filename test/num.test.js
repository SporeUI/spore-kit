const $num = require('spore-kit-num');

console.log(
	Object.keys($num).map(
		name => ('spore-kit-num/' + name)
	).join('\n')
);

describe('num.limit', () => {
	test('limit(1, 0, 2) => 1', () => {
		expect(
			$num.limit(1, 0, 2)
		).toBe(1);
	});
});
