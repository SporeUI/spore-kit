const $str = require('spore-kit-str');
const assert = require('assert');

console.log(
	Object.keys($str).map(
		name => ('spore-kit-str/' + name)
	).join('\n')
);

describe('str.bLength', () => {
	test('bLength: mix chn char', () => {
		assert($str.bLength('中文cc') === 6);
	});
	test('bLength: empty string', () => {
		assert($str.bLength('') === 0);
	});
	test('bLength: eng string', () => {
		assert($str.bLength('cc') === 2);
	});
});

describe('str.dbcToSbc', () => {
	test('dbcToSbc: base', () => {
		assert($str.dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ') === 'SAASDFSADF');
	});
});

describe('str.decodeHTML', () => {
	test('decodeHTML: base', () => {
		assert($str.decodeHTML('&amp;&lt;&gt;&quot;&#39;&#32;') === '&<>"\' ');
	});
});

describe('str.encodeHTML', () => {
	test('encodeHTML: base', () => {
		assert($str.encodeHTML('&<>"\' ') === '&amp;&lt;&gt;&quot;&#39;&#32;');
	});
});

describe('str.getRnd36', () => {
	test('getRnd36: return string', () => {
		assert(typeof $str.getRnd36() === 'string');
	});
	test('getRnd36: return length', () => {
		assert($str.getRnd36().length > 0);
	});
	test('getRnd36: use para', () => {
		assert($str.getRnd36(0.5810766832590446) === 'kx2pozz9rgf');
	});
});

describe('str.getTime36', () => {
	test('getTime36: return string', () => {
		assert(typeof $str.getTime36() === 'string');
	});
	test('getTime36: return length', () => {
		assert($str.getTime36().length >= 8);
	});
	test('getTime36: use para', () => {
		assert($str.getTime36('2020') === 'k4ujaio0');
	});
});

describe('str.getUniqueKey', () => {
	test('getUniqueKey: return type', () => {
		assert(typeof $str.getUniqueKey() === 'string');
	});
	test('getUniqueKey: return length', () => {
		assert($str.getUniqueKey().length > 0);
	});
	test('getUniqueKey: no repeat', () => {
		let key1 = $str.getUniqueKey();
		let key2 = $str.getUniqueKey();
		assert(key1 !== key2);
	});
});

describe('str.hyphenate', () => {
	test('hyphenate: base', () => {
		assert($str.hyphenate('libKitStrHyphenate') === 'lib-kit-str-hyphenate');
	});
});

describe('str.ipToHex', () => {
	test('ipToHex: base', () => {
		assert($str.ipToHex('255.255.255.255') === 'ffffffff');
	});
});

describe('str.leftB', () => {
	test('leftB: base', () => {
		assert($str.leftB('世界真和谐', 6) === '世界真');
	});
});

describe('str.sizeOfUTF8String', () => {
	test('sizeOfUTF8String: base', () => {
		assert($str.sizeOfUTF8String('中文cc') === 8);
	});
});

describe('str.substitute', () => {
	test('substitute: base', () => {
		assert($str.substitute('{{city}}欢迎您', { city: '北京' }) === '北京欢迎您');
	});
	test('substitute: custom', () => {
		assert($str.substitute('[city]欢迎您', { city: '北京' }, (/\\?\[([^[\]]+)\]/g)) === '北京欢迎您');
	});
});
