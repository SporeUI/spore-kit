const $io = require('spore-kit-io');

console.log(
	Object.keys($io).map(
		name => ('spore-kit-io/' + name)
	).join('\n')
);

describe('io-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/io.test.html');
	});

	it('title is spore-kit-io test', async () => {
		await expect(page).toMatch('spore-kit-io test');
	});
});
