const $util = require('spore-kit-util');
const assert = require('assert');

console.log(
	Object.keys($util).map(
		name => ('spore-kit-util/' + name)
	).join('\n')
);

describe('util.abToHex', () => {
	test("abToHex() => ''", () => {
		assert($util.abToHex() === '');
	});

	test('abToHex(buffer)', () => {
		let ab = new ArrayBuffer(2);
		let dv = new DataView(ab);
		dv.setUint8(0, 171);
		dv.setUint8(1, 205);
		assert($util.abToHex(ab) === 'abcd');
	});
});

describe('util.ascToHex', () => {
	test("ascToHex() => ''", () => {
		assert($util.ascToHex() === '');
	});

	test("ascToHex('*+') => '2a2b'", () => {
		assert($util.ascToHex('*+') === '2a2b');
	});
});

describe('util.hexToAb', () => {
	test('hexToAb() => ArrayBuffer(0)', () => {
		let ab = $util.hexToAb();
		assert(ab.toString() === '[object ArrayBuffer]');
		assert(ab.byteLength === 0);
	});

	test("hexToAb('abcd')", () => {
		let ab = $util.hexToAb('abcd');
		let dv = new DataView(ab);
		assert(ab.toString() === '[object ArrayBuffer]');
		assert(ab.byteLength === 2);
		assert(dv.getUint8(0) === 171);
		assert(dv.getUint8(1) === 205);
	});
});

describe('util.hexToAsc', () => {
	test("hexToAsc() => ''", () => {
		assert($util.hexToAsc() === '');
	});

	test("hexToAsc('2a2b') => '*+'", () => {
		assert($util.hexToAsc('2a2b') === '*+');
	});
});

describe('util.hslToRgb', () => {
	test('hslToRgb(0, 0, 0) => [0,0,0]', () => {
		assert($util.hslToRgb(0, 0, 0).join() === '0,0,0');
	});

	test('hslToRgb(0, 0, 1) => [255,255,255]', () => {
		assert($util.hslToRgb(0, 0, 1).join() === '255,255,255');
	});

	test('Convert grey correct.', () => {
		assert($util.hslToRgb(0, 0, 0.7843137254901961).join() === '200,200,200');
	});

	test('Convert color correct.', () => {
		assert($util.hslToRgb(0.5555555555555555, 0.9374999999999999, 0.6862745098039216).join() === '100,200,250');
		assert($util.hslToRgb(0.4444444444444445, 0.9374999999999999, 0.6862745098039216).join() === '100,250,200');
		assert($util.hslToRgb(0.8888888888888888, 0.9374999999999999, 0.6862745098039216).join() === '250,100,200');
		assert($util.hslToRgb(0.5833333333333334, 1, 0.19607843137254902).join() === '0,50,100');
		assert($util.hslToRgb(0.11111111111111112, 0.9374999999999999, 0.6862745098039216).join() === '250,200,100');
	});
});

describe('util.job', () => {
	let num = 0;
	let step = 0;
	test('job(() => {}) => manager', () => {
		let jobM = $util.job(() => {
			num = 10;
			step++;
		});
		$util.job(() => {
			num = 20;
			step++;
		});
		assert(typeof jobM.add === 'function');
	});

	test('job will not execute at now', () => {
		assert(num === 0);
	});

	test('job can be anything', () => {
		let hasError = false;
		try {
			$util.job(1);
		} catch (err) {
			hasError = true;
		}
		assert(hasError === false);
	});

	test('job work later', done => {
		setTimeout(() => {
			assert(num === 20);
			assert(step === 2);
			done();
		}, 50);
	});
});

describe('util.rgbToHsl', () => {
	test('rgbToHsl(0, 0, 0) => [0,0,0]', () => {
		assert($util.rgbToHsl(0, 0, 0).join() === '0,0,0');
	});

	test('rgbToHsl(255, 255, 255) => [0,0,1]', () => {
		assert($util.rgbToHsl(255, 255, 255).join() === '0,0,1');
	});

	test('Convert grey correct.', () => {
		assert($util.rgbToHsl(200, 200, 200).join() === '0,0,0.7843137254901961');
	});

	test('Convert color correct.', () => {
		assert($util.rgbToHsl(100, 200, 250).join() === '0.5555555555555555,0.9374999999999999,0.6862745098039216');
		assert($util.rgbToHsl(100, 250, 200).join() === '0.4444444444444445,0.9374999999999999,0.6862745098039216');
		assert($util.rgbToHsl(250, 100, 200).join() === '0.8888888888888888,0.9374999999999999,0.6862745098039216');
		assert($util.rgbToHsl(0, 50, 100).join() === '0.5833333333333334,1,0.19607843137254902');
		assert($util.rgbToHsl(250, 200, 100).join() === '0.11111111111111112,0.9374999999999999,0.6862745098039216');
	});
});

describe('util.measureDistance', () => {
	test('measureDistance(0, 0, 100, 100) => 9826.40065109978', () => {
		assert($util.measureDistance(0, 0, 100, 100) === 9826.40065109978);
	});
});
