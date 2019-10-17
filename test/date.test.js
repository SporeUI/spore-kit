const $date = require('spore-kit-date');
const assert = require('assert');

console.log(
	Object.keys($date).map(
		name => ('spore-kit-date/' + name)
	).join('\n')
);

describe('date.format', () => {
	test('format(1540915200000) => ""', () => {
		assert($date.format(1540915200000) === '2018-10-31 00:00');
	});
});
