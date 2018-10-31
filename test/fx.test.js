const $fx = require('spore-kit-fx');

console.log(
	Object.keys($fx).map(
		name => ('spore-kit-fx/' + name)
	).join('\n')
);

describe('fx-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/fx.test.html');
	});

	it('title is spore-kit-fx test', async () => {
		await expect(page).toMatch('spore-kit-fx test');
	});
});
