const $mvc = require('spore-kit-mvc');

const timeout = 10000;

console.log(
	Object.keys($mvc).map(
		name => ('spore-kit-mvc/' + name)
	).join('\n')
);

describe('mvc-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/mvc.test.html');
		await page.waitFor(1000);
	}, timeout);
	it('title is spore-kit-mvc', async () => {
		await expect(page).toMatch('spore-kit-mvc');
	});
	it('Should not have any AssertionError', async () => {
		await expect(page).not.toMatch('AssertionError');
	});
});
