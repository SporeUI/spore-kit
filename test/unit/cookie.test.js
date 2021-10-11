const $cookie = require('spore-kit-cookie');

console.log(
	Object.keys($cookie).map(
		name => ('spore-kit-cookie/' + name)
	).join('\n')
);

describe('cookie.cookie', () => {
	const Cookie = $cookie.cookie;
	test('cookie 以 URI 编码形式存值', () => {
		Cookie.set('key1', 'a b', {
			expires: 1
		});
		expect(document.cookie).toBe('key1=a%20b');
		Cookie.remove('key1');
	});
	test('cookie 以 URI 编码形式取值', () => {
		document.cookie = 'key2=a%20b';
		const val = Cookie.get('key2');
		expect(val).toBe('a b');
		Cookie.remove('key2');
	});
});

// 从测试中可以看到 js-cookie 默认已经实现了默认字符编码
// 因此之后的版本可以移除这个工具方法
// 当前仓库保留该方法以实现对旧代码兼容
describe('cookie.origin', () => {
	const Cookie = $cookie.origin;
	test('cookie 默认形式存值', () => {
		Cookie.set('key3', 'a b', {
			expires: 1
		});
		expect(document.cookie).toBe('key3=a%20b');
		Cookie.remove('key3');
	});
	test('cookie 默认形式取值', () => {
		document.cookie = 'key4=a%20b';
		const val = Cookie.get('key4');
		expect(val).toBe('a b');
		Cookie.remove('key4');
	});
});
