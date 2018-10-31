const $env = require('spore-kit-env');

console.log(
	Object.keys($env).map(
		name => ('spore-kit-env/' + name)
	).join('\n')
);

describe('env-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/env.test.html');
	});

	it('title is spore-kit-env test', async () => {
		await expect(page).toMatch('spore-kit-env test');
	});
});
