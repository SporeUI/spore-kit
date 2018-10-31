const $mvc = require('spore-kit-mvc');

console.log($mvc);

describe('mvc-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/mvc.test.html');
	});

	it('title is spore-kit-mvc test', async () => {
		await expect(page).toMatch('spore-kit-mvc test');
	});

	it('Should not have any AssertionError', async () => {
		await expect(page).not.toMatch('AssertionError');
	});
});
