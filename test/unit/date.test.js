const $date = require('spore-kit-date');

console.log(
	Object.keys($date).map(
		name => ('spore-kit-date/' + name)
	).join('\n')
);

describe('date.format', () => {
	test('format(1540915200000) => "2018-10-31 00:00"', () => {
		expect($date.format(1540915200000)).toBe('2018-10-31 00:00');
	});
});
