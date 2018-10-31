const $app = require('spore-kit-app');

console.log(
	Object.keys($app).map(
		name => ('spore-kit-app/' + name)
	).join('\n')
);

describe('app-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/app.test.html');
	});

	it('title is spore-kit-app test', async () => {
		await expect(page).toMatch('spore-kit-app test');
	});
});
