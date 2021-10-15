const $evt = require('../../packages/evt');

console.log(
	Object.keys($evt).map(
		name => ('../../packages/evt/' + name)
	).join('\n')
);

describe('evt.events', () => {
	test('evt.events', () => {

	});
});
