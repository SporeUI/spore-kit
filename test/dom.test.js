const $dom = require('spore-kit-dom');

const timeout = 5000;

console.log(
	Object.keys($dom).map(
		name => ('spore-kit-dom/' + name)
	).join('\n')
);

describe('dom-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/dom.test.html');
	}, timeout);

	it('title is spore-kit-dom test', async () => {
		await expect(page).toMatch('spore-kit-dom test');
	});
});
