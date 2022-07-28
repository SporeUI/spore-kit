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

describe('obj.clone', () => {
  test('clone({a: 1})', () => {
    var origin = { a: 1 };
    var cobj = $obj.clone(origin);
    origin.a = 2;
    expect(cobj.a).toBe(1);
  });
  test('clone(null)', () => {
    var origin = null;
    var cobj = $obj.clone(origin);
    expect(cobj).toBe(null);
  });
  test('clone([1,2])', () => {
    var origin = [1, 2];
    var cobj = $obj.clone(origin);
    origin[0] = 3;
    expect(cobj[0]).toBe(1);
  });
  test('clone({a: 1, b: () => {}})', () => {
    var fn = function () {};
    var origin = {
      a: 1,
      b: fn,
    };
    var cobj = $obj.clone(origin);
    cobj.a = 2;
    expect(cobj.a).toBe(2);
    expect(origin.a).toBe(1);
    expect(origin.b).toBe(fn);
    expect(cobj.b).toBeUndefined();
  });
});

describe('obj.cloneDeep', () => {
  test('cloneDeep({a: 1})', () => {
    var origin = { a: 1 };
    var cobj = $obj.cloneDeep(origin);
    origin.a = 2;
    expect(cobj.a).toBe(1);
  });
  test('cloneDeep(null)', () => {
    var origin = null;
    var cobj = $obj.cloneDeep(origin);
    expect(cobj).toBe(null);
  });
  test('cloneDeep([1,2])', () => {
    var origin = [1, 2];
    var cobj = $obj.cloneDeep(origin);
    origin[0] = 3;
    expect(cobj[0]).toBe(1);
  });
  test('cloneDeep({a: 1, b: () => {}})', () => {
    var fn = function () {};
    var origin = {
      a: 1,
      b: fn,
    };
    var cobj = $obj.cloneDeep(origin);
    cobj.a = 2;
    expect(cobj.a).toBe(2);
    expect(origin.a).toBe(1);
    expect(origin.b).toBe(fn);
    expect(cobj.b).toBe(fn);
  });
  test('cloneDeep({ mixed })', () => {
    var fn = function () {};
    var origin = {
      a: 1,
      b: [
        1,
        2,
        {
          c: 3,
          d: fn,
        },
      ],
    };
    var cobj = $obj.cloneDeep(origin);
    cobj.b[1] = 5;
    expect(origin.b[1]).toBe(2);
    origin.b[2].c = 4;
    expect(cobj.b[2].c).toBe(3);
    expect(cobj.b[2].d).toBe(fn);
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

describe('obj.merge', () => {
  test('merge(1, 2)', () => {
    var mobj = $obj.merge(1, 2);
    expect(mobj).toBe(1);
  });
  test('merge({a: 1})', () => {
    var origin = { a: 1 };
    var mobj = $obj.merge(origin);
    origin.a = 2;
    expect(mobj.a).toBe(1);
  });
  test('merge({a: 1}, {a: 2})', () => {
    var origin = { a: 1 };
    var mobj = $obj.merge(origin, {
      b: 2,
    });
    origin.a = 3;
    expect(mobj.a).toBe(1);
    expect(mobj.b).toBe(2);
    expect(origin.b).toBeUndefined();
  });
  test('merge([1, [2, 3, [4, 5]]], [3, [6, [7, 8], [9]]])', () => {
    var origin = [1, [2, 3, [4, 5]]];
    var source = [3, [6, [7, 8], [9]]];
    var mobj = $obj.merge(origin, source);
    expect(origin[0]).toBe(1);
    expect(mobj[0]).toBe(3);
    expect(mobj[1][0]).toBe(6);
    expect(mobj[1][1][0]).toBe(7);
    expect(mobj[1][1][1]).toBe(8);
    expect(mobj[1][2][0]).toBe(9);
    expect(mobj[1][2][1]).toBe(5);
  });
  test('merge({a: 1, b: { c: 3 }}, {a: 2, b: { d: 4 }})', () => {
    var origin = {
      a: 1,
      b: {
        c: 3,
      },
    };
    var source = {
      a: 2,
      b: {
        d: 4,
      },
    };
    var mobj = $obj.merge(origin, source);
    expect(mobj.a).toBe(2);
    expect(mobj.b.c).toBe(3);
    expect(mobj.b.d).toBe(4);
  });
  test('merge({a: 1, b: [2, 3], c: {d: 4}}, null, {}, {b: [8]}, {c: {d: 9}})', () => {
    var origin = {
      a: 1,
      b: [2, 3],
      c: {
        d: 4,
      },
    };
    var mobj = $obj.merge(
      origin,
      null,
      {},
      {
        b: [8],
      },
      {
        c: {
          d: 9,
        },
      },
    );
    expect(mobj.a).toBe(1);
    expect(mobj.b[0]).toBe(8);
    expect(mobj.c.d).toBe(9);
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

describe('obj.type', () => {
  test('type({}) => "object"', () => {
    expect($obj.type({})).toBe('object');
  });
  test('type(0) => "number"', () => {
    expect($obj.type(0)).toBe('number');
  });
  test('type("") => "string"', () => {
    expect($obj.type('')).toBe('string');
  });
  test('type(function(){}) => "function"', () => {
    expect($obj.type(function () {})).toBe('function');
  });
  test('type(undefined) => "undefined"', () => {
    expect($obj.type(undefined)).toBe('undefined');
  });
  test('type(null) => "null"', () => {
    expect($obj.type(null)).toBe('null');
  });
  test('type(new Date()) => "date"', () => {
    expect($obj.type(new Date())).toBe('date');
  });
  test('type(/a/) => "regexp"', () => {
    expect($obj.type(/a/)).toBe('regexp');
  });
  test('type(Symbol("a")) => "symbol"', () => {
    expect($obj.type(Symbol('a'))).toBe('symbol');
  });
});
