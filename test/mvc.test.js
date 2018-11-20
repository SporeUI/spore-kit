const $mvc = require('spore-kit-mvc');

const timeout = 5000;

console.log(
	Object.keys($mvc).map(
		name => ('spore-kit-mvc/' + name)
	).join('\n')
);

describe('mvc-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/mvc.test.html');
	}, timeout);
	it('title is spore-kit-mvc test', async () => {
		await expect(page).toMatch('spore-kit-mvc test');
	});
	it('Should not have any AssertionError', async () => {
		await expect(page).not.toMatch('AssertionError');
	});
});
