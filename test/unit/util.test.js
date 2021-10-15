const $util = require('../../packages/util');

const $console = console;

$console.log(
  Object.keys($util).map(
    (name) => (`../../packages/util/${name}`),
  ).join('\n'),
);

describe('util.abToHex', () => {
  test("abToHex() => ''", () => {
    expect($util.abToHex()).toBe('');
  });

  test('abToHex(buffer)', () => {
    const ab = new ArrayBuffer(2);
    const dv = new DataView(ab);
    dv.setUint8(0, 171);
    dv.setUint8(1, 205);
    expect($util.abToHex(ab)).toBe('abcd');
  });
});

describe('util.ascToHex', () => {
  test("ascToHex() => ''", () => {
    expect($util.ascToHex()).toBe('');
  });

  test("ascToHex('*+') => '2a2b'", () => {
    expect($util.ascToHex('*+')).toBe('2a2b');
  });
});

describe('util.hexToAb', () => {
  test('hexToAb() => ArrayBuffer(0)', () => {
    const ab = $util.hexToAb();
    expect(ab.toString()).toBe('[object ArrayBuffer]');
    expect(ab.byteLength).toBe(0);
  });

  test("hexToAb('abcd')", () => {
    const ab = $util.hexToAb('abcd');
    const dv = new DataView(ab);
    expect(ab.toString()).toBe('[object ArrayBuffer]');
    expect(ab.byteLength).toBe(2);
    expect(dv.getUint8(0)).toBe(171);
    expect(dv.getUint8(1)).toBe(205);
  });
});

describe('util.hexToAsc', () => {
  test("hexToAsc() => ''", () => {
    expect($util.hexToAsc()).toBe('');
  });

  test("hexToAsc('2a2b') => '*+'", () => {
    expect($util.hexToAsc('2a2b')).toBe('*+');
  });
});

describe('util.hslToRgb', () => {
  test('hslToRgb(0, 0, 0) => [0,0,0]', () => {
    const rgb = $util.hslToRgb(0, 0, 0).join();
    expect(rgb).toBe('0,0,0');
  });

  test('hslToRgb(0, 0, 1) => [255,255,255]', () => {
    const rgb = $util.hslToRgb(0, 0, 1).join();
    expect(rgb).toBe('255,255,255');
  });

  test('Convert grey correct.', () => {
    const rgb = $util.hslToRgb(0, 0, 0.7843137254901961).join();
    expect(rgb).toBe('200,200,200');
  });

  test('Convert color correct.', () => {
    const rgb = $util.hslToRgb(
      0.5555555555555555,
      0.9374999999999999,
      0.6862745098039216,
    ).join();
    expect(rgb).toBe('100,200,250');
  });
});

describe('util.job', () => {
  let num = 0;
  let step = 0;
  test('job(() => {}) => manager', () => {
    const jobM = $util.job(() => {
      num = 10;
      step += 1;
    });
    $util.job(() => {
      num = 20;
      step += 1;
    });
    expect(typeof jobM.add).toBe('function');
  });

  test('job will not execute at now', () => {
    expect(num).toBe(0);
  });

  test('job can be anything', () => {
    let hasError = false;
    try {
      $util.job(1);
    } catch (err) {
      hasError = true;
    }
    expect(hasError).toBe(false);
  });

  test('job work later', (done) => {
    setTimeout(() => {
      expect(num).toBe(20);
      expect(step).toBe(2);
      done();
    }, 50);
  });
});

describe('util.rgbToHsl', () => {
  test('rgbToHsl(0, 0, 0) => [0,0,0]', () => {
    const hsl = $util.rgbToHsl(0, 0, 0).join();
    expect(hsl).toBe('0,0,0');
  });

  test('rgbToHsl(255, 255, 255) => [0,0,1]', () => {
    const hsl = $util.rgbToHsl(255, 255, 255).join();
    expect(hsl).toBe('0,0,1');
  });

  test('Convert grey correct.', () => {
    const hsl = $util.rgbToHsl(200, 200, 200).join();
    expect(hsl).toBe('0,0,0.7843137254901961');
  });

  test('Convert color correct.', () => {
    const hsl = $util.rgbToHsl(100, 200, 250).join();
    const val = [
      0.5555555555555555,
      0.9374999999999999,
      0.6862745098039216,
    ].join();
    expect(hsl).toBe(val);
  });
});

describe('util.measureDistance', () => {
  test('measureDistance(0, 0, 100, 100) => 9826.40065109978', () => {
    const distance = $util.measureDistance(0, 0, 100, 100);
    expect(distance).toBe(9826.40065109978);
  });
});
