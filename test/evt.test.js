const $evt = require('spore-kit-evt');

const timeout = 5000;

console.log(
	Object.keys($evt).map(
		name => ('spore-kit-evt/' + name)
	).join('\n')
);

describe('evt-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/evt.test.html');
	}, timeout);

	it('title is spore-kit-evt test', async () => {
		await expect(page).toMatch('spore-kit-evt test');
	});
});
