const $mockUa = require('jest-useragent-mock');
const $env = require('../../packages/env');

console.log(
	Object.keys($env).map(
		name => ('../../packages/env/' + name)
	).join('\n')
);

describe('env.browser', () => {
	test('可简单区别浏览器', () => {
		const strUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36';
		$mockUa.mockUserAgent(strUA);
		$env.browser();
		const browser = $env.browser.detect();
		expect(browser.chrome).toBe(true);
	});
});

describe('env.core', () => {
	test('可简单区别浏览器核心', () => {
		const strUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36';
		$mockUa.mockUserAgent(strUA);
		$env.core();
		const core = $env.core.detect();
		expect(core.webkit).toBe(true);
	});
});

describe('env.device', () => {
	test('可简单区别设备', () => {
		const strUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
		$mockUa.mockUserAgent(strUA);
		$env.device();
		const device = $env.device.detect();
		expect(device.iphone).toBe(true);
	});
});

describe('env.os', () => {
	test('可简单区别操作系统', () => {
		const strUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
		$mockUa.mockUserAgent(strUA);
		$env.os();
		const os = $env.os.detect();
		expect(os.ios).toBe(true);
	});
});

describe('env.uaMatch', () => {
	test('提供通用正则匹配方案', () => {
		const uaMap = {
			trident: 'trident',
			presto: /presto/,
			gecko: function(ua) {
				return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
			}
		};
		const rs1 = $env.uaMatch(uaMap, 'xxx presto xxx');
		expect(rs1.presto).toBe(true);

		const rs2 = $env.uaMatch(uaMap, 'xxx gecko xxx');
		expect(rs2.gecko).toBe(true);

		const rs3 = $env.uaMatch(uaMap, 'xxx trident xxx');
		expect(rs3.trident).toBe(true);
	});
});

describe('env.network', () => {
	test('当前环境支持 onLine', () => {
		let support = $env.network.support();
		expect(support).toBe(true);
	});
	test('验证联网状态', () => {
		let state = false;
		Object.defineProperty(global.navigator, 'onLine', {
			get() {
				return state;
			}
		});
		expect($env.network.onLine()).toBe(false);

		state = true;
		expect($env.network.onLine()).toBe(true);
	});
});

describe('env.touchable', () => {
	test('mock 环境不支持 touch', () => {
		const touchable = $env.touchable();
		expect(touchable).toBe(false);
	});
});

// 存留状态其实是糟糕的设计
// ts 版应当实现函数仅作为过滤器实现
describe('env.webp', () => {
	test('默认 mock 环境支持支持 webp', () => {
		expect($env.webp()).toBe(true);
	});

	test('检测方法可判断是否支持 webp', () => {
		HTMLCanvasElement
			.prototype
			.toDataURL = jest
				.fn()
				.mockReturnValueOnce(
					'data:image/png;base64'
				);
		expect($env.webp.support()).toBe(false);
	});

	test('webp 检测结果会被缓存', () => {
		HTMLCanvasElement
			.prototype
			.toDataURL = jest
				.fn()
				.mockReturnValueOnce(
					'data:image/png;base64'
				);
		expect($env.webp()).toBe(true);
	});
});
