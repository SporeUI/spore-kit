const $util = require('spore-kit-util');

console.log(
	Object.keys($util).map(
		name => ('spore-kit-util/' + name)
	).join('\n')
);

describe('util.rgbToHsl', () => {
	test('rgbToHsl(0, 0, 0).join() => 0,0,0', () => {
		expect(
			$util.rgbToHsl(0, 0, 0).join()
		).toBe('0,0,0');
	});
});
