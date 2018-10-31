const $cookie = require('spore-kit-cookie');

console.log(
	Object.keys($cookie).map(
		name => ('spore-kit-cookie/' + name)
	).join('\n')
);

describe('cookie-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/cookie.test.html');
	});

	it('title is spore-kit-cookie test', async () => {
		await expect(page).toMatch('spore-kit-cookie test');
	});
});
