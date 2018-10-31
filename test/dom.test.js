const $dom = require('spore-kit-dom');

console.log($dom);

describe('dom-ui-test', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/dom.test.html');
	});

	it('title is dom-test', async () => {
		await expect(page).toMatch('spore-kit-dom test');
	});
});
