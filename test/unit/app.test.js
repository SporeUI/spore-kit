const $app = require('spore-kit-app');

console.log(
	Object.keys($app).map(
		name => ('spore-kit-app/' + name)
	).join('\n')
);

describe('app.callUp', () => {
	test('contains([1, 2], 1) => true', done => {
		const fallbackUrl = 'https://fallback-url';
		let onFallbackCalled = false;
		$app.callUp({
			startTime: Date.now(),
			waiting: 50,
			waitingLimit: 10,
			protocol: 'scheme://',
			fallbackUrl,
			fallback(url) {
				expect(url).toBe(fallbackUrl);
				expect(onFallbackCalled).toBe(true);
				done();
			},
			onFallback() {
				onFallbackCalled = true;
			}
		});
	});
});
