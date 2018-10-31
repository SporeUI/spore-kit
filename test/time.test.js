const $time = require('spore-kit-time');

console.log(
	Object.keys($time).map(
		name => ('spore-kit-time/' + name)
	).join('\n')
);

describe('time.parseUnit', () => {
	test('parseUnit(12345 * 67890).day => 9', () => {
		expect(
			$time.parseUnit(12345 * 67890).day
		).toBe(9);
	});
});
