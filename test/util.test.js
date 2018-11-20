const $util = require('spore-kit-util');

console.log(
	Object.keys($util).map(
		name => ('spore-kit-util/' + name)
	).join('\n')
);

describe('util.hexToAsc', () => {
	test("hexToAsc() => ''", () => {
		expect(
			$util.hexToAsc()
		).toBe('');
	});

	test("hexToAsc('2a2b') => '*+'", () => {
		expect(
			$util.hexToAsc('2a2b')
		).toBe('*+');
	});
});

describe('util.hslToRgb', () => {
	test('hslToRgb(0, 0, 0) => [0,0,0]', () => {
		expect(
			$util.hslToRgb(0, 0, 0).join()
		).toBe('0,0,0');
	});

	test('hslToRgb(0, 0, 1) => [255,255,255]', () => {
		expect(
			$util.hslToRgb(0, 0, 1).join()
		).toBe('255,255,255');
	});

	test('Convert grey correct.', () => {
		expect(
			$util.hslToRgb(0, 0, 0.7843137254901961).join()
		).toBe('200,200,200');
	});

	test('Convert color correct.', () => {
		expect(
			$util.hslToRgb(0.5555555555555555, 0.9374999999999999, 0.6862745098039216).join()
		).toBe('100,200,250');
		expect(
			$util.hslToRgb(0.4444444444444445, 0.9374999999999999, 0.6862745098039216).join()
		).toBe('100,250,200');
		expect(
			$util.hslToRgb(0.8888888888888888, 0.9374999999999999, 0.6862745098039216).join()
		).toBe('250,100,200');
		expect(
			$util.hslToRgb(0.5833333333333334, 1, 0.19607843137254902).join()
		).toBe('0,50,100');
		expect(
			$util.hslToRgb(0.11111111111111112, 0.9374999999999999, 0.6862745098039216).join()
		).toBe('250,200,100');
	});
});

describe('util.rgbToHsl', () => {
	test('rgbToHsl(0, 0, 0) => [0,0,0]', () => {
		expect(
			$util.rgbToHsl(0, 0, 0).join()
		).toBe('0,0,0');
	});

	test('rgbToHsl(255, 255, 255) => [0,0,1]', () => {
		expect(
			$util.rgbToHsl(255, 255, 255).join()
		).toBe('0,0,1');
	});

	test('Convert grey correct.', () => {
		expect(
			$util.rgbToHsl(200, 200, 200).join()
		).toBe('0,0,0.7843137254901961');
	});

	test('Convert color correct.', () => {
		expect(
			$util.rgbToHsl(100, 200, 250).join()
		).toBe('0.5555555555555555,0.9374999999999999,0.6862745098039216');
		expect(
			$util.rgbToHsl(100, 250, 200).join()
		).toBe('0.4444444444444445,0.9374999999999999,0.6862745098039216');
		expect(
			$util.rgbToHsl(250, 100, 200).join()
		).toBe('0.8888888888888888,0.9374999999999999,0.6862745098039216');
		expect(
			$util.rgbToHsl(0, 50, 100).join()
		).toBe('0.5833333333333334,1,0.19607843137254902');
		expect(
			$util.rgbToHsl(250, 200, 100).join()
		).toBe('0.11111111111111112,0.9374999999999999,0.6862745098039216');
	});
});
