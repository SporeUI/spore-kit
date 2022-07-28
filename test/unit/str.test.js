const $str = require('../../packages/str');

const $console = console;

$console.log(
  Object.keys($str).map(
    (name) => (`../../packages/str/${name}`),
  ).join('\n'),
);

describe('str.bLength', () => {
  test('bLength: mix chn char', () => {
    expect($str.bLength('中文cc')).toBe(6);
  });
  test('bLength: empty string', () => {
    expect($str.bLength('')).toBe(0);
  });
  test('bLength: eng string', () => {
    expect($str.bLength('cc')).toBe(2);
  });
});

describe('str.dbcToSbc', () => {
  test('dbcToSbc: base', () => {
    const str = $str.dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ');
    expect(str).toBe('SAASDFSADF');
  });
});

describe('str.decodeHTML', () => {
  test('参数必须为字符串', () => {
    let isError = false;
    try {
      $str.decodeHTML(0);
    } catch (err) {
      isError = true;
    }
    expect(isError).toBe(true);
  });
  test('decodeHTML: base', () => {
    const str = $str.decodeHTML('&amp;&lt;&gt;&quot;&#39;&#32;');
    expect(str).toBe('&<>"\' ');
  });
});

describe('str.encodeHTML', () => {
  test('参数必须为字符串', () => {
    let isError = false;
    try {
      $str.encodeHTML(0);
    } catch (err) {
      isError = true;
    }
    expect(isError).toBe(true);
  });
  test('encodeHTML: base', () => {
    const str = $str.encodeHTML('&<>"\' ');
    expect(str).toBe('&amp;&lt;&gt;&quot;&#39;&#32;');
  });
});

describe('str.getRnd36', () => {
  test('getRnd36: return string', () => {
    expect(typeof $str.getRnd36()).toBe('string');
  });
  test('getRnd36: return length', () => {
    expect($str.getRnd36().length > 0);
  });
  test('getRnd36: use para', () => {
    const str = $str.getRnd36(0.5810766832590446);
    expect(str).toBe('kx2pozz9rgf');
  });
});

describe('str.getTime36', () => {
  test('getTime36: return string', () => {
    expect(typeof $str.getTime36()).toBe('string');
  });
  test('getTime36: return length', () => {
    const len = $str.getTime36().length;
    expect(len).toBeGreaterThanOrEqual(8);
  });
  test('getTime36: use para', () => {
    expect($str.getTime36('2020')).toBe('k4ujaio0');
  });
});

describe('str.getUniqueKey', () => {
  test('getUniqueKey: return type', () => {
    expect(typeof $str.getUniqueKey()).toBe('string');
  });
  test('getUniqueKey: return length', () => {
    const len = $str.getUniqueKey().length;
    expect(len).toBeGreaterThan(0);
  });
  test('getUniqueKey: no repeat', () => {
    const key1 = $str.getUniqueKey();
    const key2 = $str.getUniqueKey();
    expect(key1).not.toBe(key2);
  });
});

describe('str.hyphenate', () => {
  test('hyphenate: base', () => {
    const str = $str.hyphenate('libKitStrHyphenate');
    expect(str).toBe('lib-kit-str-hyphenate');
  });
});

describe('str.ipToHex', () => {
  test('ipToHex: base', () => {
    expect($str.ipToHex('255.255.255.255')).toBe('ffffffff');
    expect($str.ipToHex('10.10.10.10')).toBe('0a0a0a0a');
  });
});

describe('str.leftB', () => {
  test('leftB: base', () => {
    expect($str.leftB('a世界真和谐', 5)).toBe('a世界');
    expect($str.leftB('a世界真和谐', 6)).toBe('a世界');
    expect($str.leftB('a世界真和谐', 7)).toBe('a世界真');
    expect($str.leftB('世界真和谐', 6)).toBe('世界真');
    expect($str.leftB('世界真和谐', 12)).toBe('世界真和谐');
  });
  test('正确处理全角字符', () => {
    expect($str.leftB('aＳＡＡＳＤ', 5)).toBe('aＳＡ');
  });
});

describe('str.sizeOfUTF8String', () => {
  test('sizeOfUTF8String: base', () => {
    expect($str.sizeOfUTF8String('中文c')).toBe(7);
  });
});

describe('str.substitute', () => {
  test('substitute: base', () => {
    const str = $str.substitute(
      '{{city}}欢迎您',
      { city: '北京' },
    );
    expect(str).toBe('北京欢迎您');
  });
  test('substitute: custom', () => {
    const str = $str.substitute(
      '[city]欢迎您',
      { city: '北京' },
      (/\\?\[([^[\]]+)\]/g),
    );
    expect(str).toBe('北京欢迎您');
  });
});

describe('str.keyPathSplit', () => {
  test('keyPathSplit() => []', () => {
    var rs = JSON.stringify($str.keyPathSplit());
    expect(rs).toBe('[]');
  });
  test('keyPathSplit(null) => []', () => {
    var rs = JSON.stringify($str.keyPathSplit(null));
    expect(rs).toBe('[]');
  });
  test('keyPathSplit("") => []', () => {
    var rs1 = JSON.stringify($str.keyPathSplit(''));
    expect(rs1).toBe('[]');
  });
  test('keyPathSplit("[1].a[1][2].b.c") => ["1", "a", "1", "2", "b", "c"]', () => {
    var rs1 = JSON.stringify($str.keyPathSplit('[1].a[1][2].b.c'));
    expect(rs1).toBe('["1","a","1","2","b","c"]');
  });
});
