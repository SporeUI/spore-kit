const $dom = require('../../packages/dom');

const $console = console;

$console.log(
  Object.keys($dom).map(
    (name) => (`../../packages/dom/${name}`),
  ).join('\n'),
);

describe('dom.isNode', () => {
  test('isNode(document) => true', () => {
    expect(!!$dom.isNode(document)).toBe(true);
    expect(!!$dom.isNode({})).toBe(false);
  });
});

describe('dom.offset', () => {
  test('offset(document.body) => {left: 0, top: 0}', () => {
    const offsetBody = $dom.offset(document.body);
    expect(offsetBody.left).toBe(0);
    expect(offsetBody.top).toBe(0);
  });
});

describe('dom.scrollLimit', () => {
  test('scrollLimit methods', () => {
    const limiterY = $dom.scrollLimit(document.body);
    expect(typeof limiterY.attach).toBe('function');
    expect(typeof limiterY.detach).toBe('function');
    limiterY.attach();
    limiterY.detach();
  });
});
