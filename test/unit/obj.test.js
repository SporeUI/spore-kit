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
  test('可以空值作为参数', () => {
    const extra = $obj.assign({
      a: 1,
    }, null);
    expect(extra.a).toBe(1);
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

describe('obj.get', () => {
  test('get(null) => undefined', () => {
    expect($obj.get(null)).toBeUndefined();
    expect($obj.get(undefined)).toBeUndefined();
    expect($obj.get(0)).toBeUndefined();
    expect($obj.get({ a: 1 })).toBeUndefined();
  });
  test('get({a: 1}, "").a => 1', () => {
    expect($obj.get({ a: 1 }, '').a).toBe(1);
  });
  test('get({a: 1}, "a") => 1', () => {
    expect($obj.get({ a: 1 }, 'a')).toBe(1);
  });
  test('get({a: 1}, "b", 0) => 0', () => {
    expect($obj.get({ a: 1 }, 'b', 0)).toBe(0);
  });
  test('get({a: {b: {c: 1}}}, "a.b.c") => 1', () => {
    var target = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    expect($obj.get(target, 'a.b').c).toBe(1);
    expect($obj.get(target, 'a.b.c')).toBe(1);
    expect($obj.get(target, 'a.b.c.d')).toBeUndefined();
  });
  test('get([1,2], "1") => 2', () => {
    expect($obj.get([1, 2], '[1]')).toBe(2);
    expect($obj.get([1, 2], '[a]')).toBeUndefined();
  });
  test('get([1, {a: [2, 3]}], "[1].a[1]") => 3', () => {
    var target = [
      1,
      {
        a: [2, 3],
      },
    ];
    expect($obj.get(target, '[1].a')[0]).toBe(2);
    expect($obj.get(target, '[1].a[0]')).toBe(2);
    expect($obj.get(target, '[1].a[1]')).toBe(3);
  });
});

describe('obj.set', () => {
  test('set()', () => {
    $obj.set();
    expect(1).toBe(1);
  });
  test('set(obj)', () => {
    var rs = { a: 1 };
    $obj.set(rs);
    expect(rs.a).toBe(1);
  });
  test('set(obj, "", 2)', () => {
    var rs = { a: 1 };
    $obj.set(rs, '', 2);
    expect(rs.a).toBe(1);
  });
  test('set(obj, "a", 2)', () => {
    var rs = { a: 1 };
    $obj.set(rs, 'a', 2);
    expect(rs.a).toBe(2);
  });
  test('set([1, 2, 3], "1", 0)', () => {
    var rs = [1, 2, 3];
    $obj.set(rs, '1', 0);
    expect(rs[1]).toBe(0);
  });
  test('set({a: {b: {c: 1}}}, "a.b.c", 2)', () => {
    var rs = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    $obj.set(rs, 'a.b.c', 2);
    expect(rs.a.b.c).toBe(2);
    $obj.set(rs, 'a.d', { e: 5 });
    expect(rs.a.d.e).toBe(5);
    $obj.set(rs, 'a.b');
    expect(rs.a.b.c).toBe(2);
    $obj.set(rs, 'a.b.d.e', 6);
    expect(rs.a.b.d).toBeUndefined();
  });
  test('set(arr, "[1][2][3]", 9)', () => {
    var rs = [1, [2, 1, [4, 5, 6, 7], 5, 7], 3];
    $obj.set(rs, '[1][2][3]', 9);
    expect(rs[1][2][3]).toBe(9);
    $obj.set(rs, '[1][2][3]');
    expect(rs[1][2][3]).toBe(9);
    $obj.set(rs, '[1][a]', 6);
    expect(rs[1].a).toBe(6);
    $obj.set(rs, '[1][3][8]', 0);
    expect(rs[1][3][8]).toBeUndefined();
  });
  test('set(arr, "[2]", 1)', () => {
    var rs = [1, 2];
    $obj.set(rs, '[2]', 5);
    expect(rs[2]).toBe(5);
  });
});
