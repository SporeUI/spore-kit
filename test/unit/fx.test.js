const $fx = require('../../packages/fx');

const $console = console;

$console.log(
  Object.keys($fx).map(
    (name) => (`../../packages/fx/${name}`),
  ).join('\n'),
);

describe('fx.easing', () => {
  test('fx.easing.linear', () => {
    const val = $fx.easing.linear(0.3);
    expect(val).toBe(0.3);
  });

  test('fx.easing.easeInQuad', () => {
    const val = $fx.easing.easeInQuad(0.3);
    expect(val).toBe(0.09);
  });

  test('fx.easing.easeOutQuad', () => {
    const val = $fx.easing.easeOutQuad(0.3);
    expect(val).toBe(0.51);
  });

  test('fx.easing.easeInOutQuad', () => {
    const val = $fx.easing.easeInOutQuad(0.3);
    expect(val).toBe(0.18);
  });

  test('fx.easing.easeInCubic', () => {
    const val = $fx.easing.easeInCubic(0.3);
    expect(val).toBe(0.027);
  });

  test('fx.easing.easeOutCubic', () => {
    const val = $fx.easing.easeOutCubic(0.3);
    expect(val).toBe(0.657);
  });

  test('fx.easing.easeInOutCubic', () => {
    const val = $fx.easing.easeInOutCubic(0.3);
    expect(val).toBe(0.108);
  });

  test('fx.easing.easeInQuart', () => {
    const val = $fx.easing.easeInQuart(0.3);
    expect(val).toBe(0.0081);
  });

  test('fx.easing.easeOutQuart', () => {
    const val = $fx.easing.easeOutQuart(0.3);
    expect(val).toBe(0.7599);
  });

  test('fx.easing.easeInOutQuart', () => {
    const val = $fx.easing.easeInOutQuart(0.3);
    expect(val).toBe(0.0648);
  });

  test('fx.easing.easeInQuint', () => {
    const val = $fx.easing.easeInQuint(0.3);
    expect(val).toBe(0.00243);
  });

  test('fx.easing.easeOutQuint', () => {
    const val = $fx.easing.easeOutQuint(0.3);
    expect(val).toBe(0.8319300000000001);
  });

  test('fx.easing.easeInOutQuint', () => {
    const val = $fx.easing.easeInOutQuint(0.3);
    expect(val).toBe(0.03888);
  });
});
