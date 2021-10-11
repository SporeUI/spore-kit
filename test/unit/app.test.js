const $app = require('spore-kit-app');
const $browser = require('spore-kit-env/browser');

jest.mock('spore-kit-env/browser');

console.log(
	Object.keys($app).map(
		name => ('spore-kit-app/' + name)
	).join('\n')
);

describe('app.callUp', () => {
	test('默认用 iframe 插入方式唤起客户端，可以在指定时间后调用 fallback', done => {
		jest.useFakeTimers();
		const fallbackUrl = 'https://fallback-url';
		let onFallbackCalled = false;
		let onTimeoutCalled = false;
		$browser.mockReturnValue({
			node: true
		});

		const appendChildSpy = jest.spyOn(
			document.body,
			'appendChild'
		);

		const removeChildSpy = jest.spyOn(
			document.body,
			'removeChild'
		);

		$app.callUp({
			protocol: 'scheme://',
			fallbackUrl,
			fallback(url) {
				expect(url).toBe(fallbackUrl);
				expect(onTimeoutCalled).toBe(true);
				expect(onFallbackCalled).toBe(true);
				expect(appendChildSpy).toHaveBeenCalled();
				expect(removeChildSpy).toHaveBeenCalled();
				done();
			},
			onTimeout() {
				onTimeoutCalled = true;
			},
			onFallback() {
				onFallbackCalled = true;
			}
		});
		jest.runAllTimers();
	});

	test('chrome 环境执行 window.open 唤起客户端', done => {
		jest.useRealTimers();
		jest.setTimeout(100);
		$browser.mockReturnValue({
			chrome: true
		});

		const fallbackUrl = 'https://fallback-url';
		let onFallbackCalled = false;
		let onTimeoutCalled = false;
		let windowOpenCalled = false;
		let windowCloseCalled = false;

		window.open = jest.fn().mockImplementation(() => {
			windowOpenCalled = true;
			return {
				close() {
					windowCloseCalled = true;
				}
			};
		});

		$app.callUp({
			waiting: 30,
			waitingLimit: 30,
			protocol: 'scheme://',
			fallbackUrl,
			fallback(url) {
				expect(url).toBe(fallbackUrl);
				expect(onTimeoutCalled).toBe(true);
				expect(onFallbackCalled).toBe(true);
				expect(windowOpenCalled).toBe(true);
				expect(windowCloseCalled).toBe(true);
				done();
			},
			onTimeout() {
				onTimeoutCalled = true;
			},
			onFallback() {
				onFallbackCalled = true;
			}
		});
	});
});
