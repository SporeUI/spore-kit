const $location = require('spore-kit-location');

console.log(
	Object.keys($location).map(
		name => ('spore-kit-location/' + name)
	).join('\n')
);

describe('location.getQuery', () => {
	test('getQuery(url, param) => value', () => {
		expect($location.getQuery(
			'http://localhost/profile?beijing=huanyingni',
			'beijing'
		)).toBe('huanyingni');
	});
});

describe('location.parse', () => {
	test('parse(url) => json', () => {
		let testUrl = 'http://username:password@localhost:8080/profile?beijing=huanyingni#123';
		let loc = $location.parse(testUrl);
		expect(loc.slashes).toBe(true);
		expect(loc.protocol).toBe('http:');
		expect(loc.hash).toBe('#123');
		expect(loc.query).toBe('?beijing=huanyingni');
		expect(loc.pathname).toBe('/profile');
		expect(loc.auth).toBe('username:password');
		expect(loc.host).toBe('localhost:8080');
		expect(loc.port).toBe('8080');
		expect(loc.hostname).toBe('localhost');
		expect(loc.password).toBe('password');
		expect(loc.username).toBe('username');
		expect(loc.origin).toBe('http://localhost:8080');
		expect(loc.href).toBe('http://username:password@localhost:8080/profile?beijing=huanyingni#123');
	});
});

describe('location.setQuery', () => {
	test('没有 query 参数就不追加 query', () => {
		expect($location.setQuery('localhost')).toBe('localhost');
	});
	test('正常覆盖 query', () => {
		const url1 = $location.setQuery('localhost', { a: 1 });
		expect(url1).toBe('localhost?a=1');

		const url2 = $location.setQuery('localhost?a=1', { a: 2 });
		expect(url2).toBe('localhost?a=2');

		const url3 = $location.setQuery('localhost?a=1', {
			a: ''
		});
		expect(url3).toBe('localhost?a=');

		const url4 = $location.setQuery('localhost?a=1', {
			b: 2
		});
		expect(url4).toBe('localhost?a=1&b=2');

		const url5 = $location.setQuery('localhost?a=1&b=1', {
			a: 2,
			b: 3
		});
		expect(url5).toBe('localhost?a=2&b=3');
	});
	test('移除 query key', () => {
		const url = $location.setQuery('localhost?a=1', {
			a: null
		});
		expect(url).toBe('localhost');
	});
	test('对空地址也可以追加 query', () => {
		const url = $location.setQuery('', { a: 1 });
		expect(url).toBe('?a=1');
	});
	test('存在 hash 时，query 插入到中间', () => {
		const url = $location.setQuery('localhost#a=1', {
			a: 2,
			b: 3
		});
		expect(url).toBe('localhost?a=2&b=3#a=1');
	});
	test('对空地址 hash 也可以追加 query', () => {
		const url = $location.setQuery('#a=1', {
			a: 2,
			b: 3
		});
		expect(url).toBe('?a=2&b=3#a=1');
	});
});
