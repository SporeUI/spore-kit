const $location = require('spore-kit-location');

console.log(
	Object.keys($location).map(
		name => ('spore-kit-location/' + name)
	).join('\n')
);

describe('location.getQuery', () => {
	test('getQuery(url, param) => value', () => {
		expect(
			$location.getQuery(
				'http://localhost/profile?beijing=huanyingni',
				'beijing'
			)
		).toBe('huanyingni');
	});
});
