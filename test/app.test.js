const $app = require('spore-kit-app');

console.log($app);

describe('app-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/app.test.html');
	});

	it('title is spore-kit-app test', async () => {
		await expect(page).toMatch('spore-kit-app test');
	});
});
