const $obj = require('../../packages/obj');

const $console = console;

$console.log(
  Object.keys($obj).map(
    (name) => (`../../packages/obj/${name}`),
  ).join('\n'),
);

describe('obj.assign', () => {
  test('assign 用于覆盖对象的键值', () => {
    const origin = {
      a: 1, b: 2,
    };
    const extra = $obj.assign(origin, {
      b: 3,
      c: 4,
    });
    expect(Object.keys(extra).length).toBe(3);
    expect(extra.b).toBe(3);
    expect(extra.c).toBe(4);
  });
  test('可以从空值生成对象', () => {
    const extra = $obj.assign(null, {
      b: 3,
      c: 4,
    });
    expect(Object.keys(extra).length).toBe(2);
    expect(extra.b).toBe(3);
    expect(extra.c).toBe(4);
  });
});

describe('obj.cover', () => {
  test('cover 方法不会创建新 key', () => {
    const origin = {
      a: 1,
      b: 2,
    };
    const extra = $obj.cover(origin, {
      b: 3,
      c: 4,
    });
    expect(Object.keys(extra).length).toBe(2);
    expect(extra.b).toBe(3);
    expect(extra.c).toBeUndefined();
  });
  test('非对象数据不做扩展', () => {
    const extra = $obj.cover(null, {
      b: 3,
      c: 4,
    });
    expect(extra).toBe(null);
  });
});

describe('obj.find', () => {
  test('find 方法实现简易版的对象路径查找', () => {
    const target = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    expect($obj.find(null, 'a.b')).toBe(null);
    expect($obj.find(target)).toBe(target);
    expect($obj.find(target, 'a.b.c')).toBe(1);
    expect($obj.find(target, 'a.c')).toBeUndefined();
  });
});

describe('obj.type', () => {
  test('type(null) => "null"', () => {
    expect($obj.type(null)).toBe('null');
  });
});
