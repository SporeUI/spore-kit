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
