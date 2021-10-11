const $cookie = require('spore-kit-cookie');

console.log(
	Object.keys($cookie).map(
		name => ('spore-kit-cookie/' + name)
	).join('\n')
);

describe('cookie.cookie', () => {
	test('cookie 以 URI 编码形式存值', () => {
		$cookie.cookie.set('name', '中文', {
			expires: 1
		});
		expect(document.cookie).toBe('name=%E4%B8%AD%E6%96%87');
	});
	test('cookie 以 URI 编码形式取值', () => {
		document.cookie = 'name=%E5%AD%97%E7%AC%A6';
		const val = $cookie.cookie.get('name');
		expect(val).toBe('字符');
	});
});
