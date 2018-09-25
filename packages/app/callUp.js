/**
 * 呼起本地客户端
 * @param {object} options
 * @example
 * 	callUp({
 * 		startTime: Date.now(),
 * 		waiting: 800,
 * 		waitingLimit: 50,
 * 		protocol : scheme,
 * 		fallbackUrl : download,
 * 		onFallback : function(){
 * 			// should download
 * 		}
 * 	});
 */

var $assign = require('spore-kit-obj/assign');
var $browser = require('spore-kit-env/browser');

var noop = function() {};

function callUp (options) {
	var conf = $assign({
		// 客户端APP呼起协议地址
		protocol: '',
		// 客户端下载地址或者中间页地址
		fallbackUrl: '',
		// 自定义呼起客户端的方式
		action: null,
		// 开始时间
		startTime: new Date().getTime(),
		// 呼起超时等待时间
		waiting: 800,
		// 超时后检查回调是否在此时间限制内触发
		waitingLimit: 50,
		// 默认回退操作
		fallback: function(fallbackUrl) {
			// 在一定时间内无法唤起客户端，跳转下载地址或到中间页
			window.location = fallbackUrl;
		},
		// 呼起超时触发的事件
		onTimeout: noop,
		// 呼起操作未能成功执行时触发的事件
		onFallback: noop
	}, options);

	var wId;
	var iframe;

	if (typeof conf.action === 'function') {
		conf.action();
	} else if ($browser.chrome) {
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

		conf.onTimeout();

		// ios下，跳转到APP，页面JS会被阻止执行。
		// 因此如果超时时间大大超过了预期时间范围，可断定APP已被打开。
		if (new Date().getTime() - conf.startTime < conf.waiting + conf.waitingLimit) {
			conf.onFallback();
			conf.fallback(conf.fallbackUrl);
		}
	}, conf.waiting);
}

module.exports = callUp;
