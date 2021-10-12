const $evt = require('spore-kit-evt');

console.log(
	Object.keys($evt).map(
		name => ('spore-kit-evt/' + name)
	).join('\n')
);

describe('evt.events', () => {
	test('evt.events', () => {

	});
});
