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
