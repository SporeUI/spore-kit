describe('app', () => {
	beforeEach(async () => {
		await page.goto('http://localhost:3000/test/dom.test.html');
	});

	it('title is dom-test', async () => {
		await expect(page).toMatch('dom-test');
	});
});
