const $time = require('spore-kit-time');
const assert = require('assert');

console.log(
	Object.keys($time).map(
		name => ('spore-kit-time/' + name)
	).join('\n')
);

describe('time.parseUnit', () => {
	test('parseUnit(12345 * 67890).day => 9', () => {
		assert($time.parseUnit(12345 * 67890).day === 9);
	});
});
