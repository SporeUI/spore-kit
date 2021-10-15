/**
 * 此方法用于呼起本地客户端，呼起失败时，跳转到客户端下载地址或者中间页
 * - 首先需要客户端提供一个协议地址 protocol
 * - 然后通过浏览器访问该地址或者 iframe 访问该协议地址来触发客户端的打开动作
 * - 在设定好的超时时间 (waiting) 到达时进行检查
 * - 由于 IOS 下，跳转到 APP，页面 JS 会被阻止执行
 * - 所以如果超时时间大大超过了预期时间范围，可断定 APP 已被打开，此时触发 onTimeout 回调事件函数
 * - 对于 IOS，此时如果从 APP 返回页面，就可以通过 waitingLimit 时间差来判断是否要执行 fallback 回调事件函数
 * - Android 下，跳转到 APP，页面 JS 会继续执行
 * - 此时无论 APP 是否已打开，都会触发 onFallback 事件与 fallback 回调事件函数
 * - fallback 默认操作是跳转到 fallbackUrl 客户端下载地址或者中间页地址
 * - 这样对于没有安装 APP 的移动端，页面会在超时事件发生时，直接跳转到 fallbackUrl
 * @method callUp
 * @param {Object} options
 * @param {String} options.protocol 客户端APP呼起协议地址
 * @param {String} options.fallbackUrl 客户端下载地址或者中间页地址
 * @param {Function} options.action 自定义呼起客户端的方式
 * @param {Number} [options.startTime=new Date().getTime()] 呼起客户端的开始时间(ms)，以时间数值作为参数
 * @param {Number} [options.waiting=800] 呼起超时等待时间(ms)
 * @param {Number} [options.waitingLimit=50] 超时后检查回调是否在此时间限制内触发(ms)
 * @param {Function} [options.fallback=function () { window.location = fallbackUrl; }] 默认回退操作
 * @param {Function} [options.onFallback=null] 呼起操作未能成功执行时触发的回调事件函数
 * @param {Function} [options.onTimeout=null] 呼起超时触发的回调事件函数
 * @example
 * var $callUp = require('spore-kit/packages/app/callUp');
 * $callUp({
 *   startTime: Date.now(),
 *   waiting: 800,
 *   waitingLimit: 50,
 *   protocol : scheme,
 *   fallbackUrl : download,
 *   onFallback : function () {
 *     // should download
 *   }
 * });
 */

var $assign = require('../obj/assign');
var $browser = require('../env/browser');

function callUp (options) {
	var conf = $assign({
		protocol: '',
		fallbackUrl: '',
		action: null,
		startTime: new Date().getTime(),
		waiting: 800,
		waitingLimit: 50,
		fallback: function(fallbackUrl) {
			// 在一定时间内无法唤起客户端，跳转下载地址或到中间页
			window.location = fallbackUrl;
		},
		onFallback: null,
		onTimeout: null
	}, options);

	var wId;
	var iframe;

	if (typeof conf.action === 'function') {
		conf.action();
	} else if ($browser().chrome) {
		// chrome下iframe无法唤起Android客户端，这里使用window.open
		// 另一个方案参考 https://developers.google.com/chrome/mobile/docs/intents
		var win = window.open(conf.protocol);
		wId = setInterval(function() {
			if (typeof win === 'object') {
				clearInterval(wId);
				win.close();
			}
		}, 10);
	} else {
		// 创建iframe
		iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.src = conf.protocol;
		document.body.appendChild(iframe);
	}

	setTimeout(function() {
		if (wId) {
			clearInterval(wId);
		}

		if (iframe) {
			document.body.removeChild(iframe);
		}

		if (typeof conf.onTimeout === 'function') {
			conf.onTimeout();
		}

		// ios下，跳转到APP，页面JS会被阻止执行。
		// 因此如果超时时间大大超过了预期时间范围，可断定APP已被打开。
		if (new Date().getTime() - conf.startTime < conf.waiting + conf.waitingLimit) {
			if (typeof conf.onFallback === 'function') {
				conf.onFallback();
			}
			if (typeof conf.fallback === 'function') {
				conf.fallback(conf.fallbackUrl);
			}
		}
	}, conf.waiting);
}

module.exports = callUp;
