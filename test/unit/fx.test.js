const $fx = require('../../packages/fx');

console.log(
	Object.keys($fx).map(
		name => ('../../packages/fx/' + name)
	).join('\n')
);

describe('fx.easing', () => {
	test('fx.easing', () => {

	});
});
