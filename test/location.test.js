const $location = require('spore-kit-location');
const assert = require('assert');

console.log(
	Object.keys($location).map(
		name => ('spore-kit-location/' + name)
	).join('\n')
);

describe('location.getQuery', () => {
	test('getQuery(url, param) => value', () => {
		assert($location.getQuery(
			'http://localhost/profile?beijing=huanyingni',
			'beijing'
		) === 'huanyingni');
	});
});

describe('location.parse', () => {
	test('parse(url) => json', () => {
		let testUrl = 'http://username:password@localhost:8080/profile?beijing=huanyingni#123';
		let loc = $location.parse(testUrl);
		assert(loc.slashes === true);
		assert(loc.protocol === 'http:');
		assert(loc.hash === '#123');
		assert(loc.query === '?beijing=huanyingni');
		assert(loc.pathname === '/profile');
		assert(loc.auth === 'username:password');
		assert(loc.host === 'localhost:8080');
		assert(loc.port === '8080');
		assert(loc.hostname === 'localhost');
		assert(loc.password === 'password');
		assert(loc.username === 'username');
		assert(loc.origin === 'http://localhost:8080');
		assert(loc.href === 'http://username:password@localhost:8080/profile?beijing=huanyingni#123');
	});
});
