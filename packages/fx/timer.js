/**
 * 用 requestAnimationFrame 包装定时器
 *
 * 如果浏览器不支持 requestAnimationFrame API，则使用BOM原本的定时器API
 * @module
 * @example
 * 	timer.setTimeout(function(){
 * 		console.info('output this log after 1000ms');
 * 	}, 1000);
 */

var Timer = {};

if (typeof window !== 'undefined') {
	var $ = window.$ || window.Zepto || window.jQuery;

	var $win = window;

	// 取得对应的浏览器前缀
	var prefix = $.getPrefix().replace(/-/gi, '');

	// 如果有对应名称的方法，直接返回该方法，否则返回带有对应浏览器前缀的方法
	var getPrefixMethod = function(name) {
		var prefixName = name.charAt(0).toUpperCase() + name.substr(1);
		var method = $win[name] || $win[prefix + prefixName];
		if ($.type(method) === 'function') {
			return method.bind($win);
		} else {
			return null;
		}
	};

	var localRequestAnimationFrame = getPrefixMethod('requestAnimationFrame');
	var localCancelAnimationFrame = getPrefixMethod('cancelAnimationFrame') || $.noop;

	if (localRequestAnimationFrame) {
		var clearTimer = function(obj) {
			if (obj.requestId && $.type(obj.step) === 'function') {
				obj.step = $.noop;
				localCancelAnimationFrame(obj.requestId);
				obj.requestId = 0;
			}
		};

		var setTimer = function(fn, delay, type) {
			var obj = {};
			var time = Date.now();
			delay = delay || 0;
			delay = Math.max(delay, 0);
			obj.step = function() {
				var now = Date.now();
				if (now - time > delay) {
					fn();
					if (type === 'timeout') {
						clearTimer(obj);
					} else {
						time = now;
					}
				}
				obj.requestId = localRequestAnimationFrame(obj.step);
			};
			localRequestAnimationFrame(obj.step);
			return obj;
		};

		Timer.setInterval = function(fn, delay) {
			return setTimer(fn, delay, 'interval');
		};

		Timer.setTimeout = function(fn, delay) {
			return setTimer(fn, delay, 'timeout');
		};

		Timer.clearTimeout = clearTimer;
		Timer.clearInterval = clearTimer;
	}

	/**
	 * 设置重复调用定时器
	 * @function setInterval
	 * @memberof timer
	 * @param {function} fn 定时重复调用的函数
	 * @param {number} [delay=0] 重复调用的间隔时间(ms)
	 * @return {object} 定时器对象，可传入clearInterval方法来终止这个定时器
	 */
	Timer.setInterval = Timer.setInterval || $win.setInterval.bind($win);

	/**
	 * 清除重复调用定时器
	 * @memberof timer
	 * @function clearInterval
	 * @param {object} obj 定时器对象
	 */
	Timer.clearInterval = Timer.clearInterval || $win.clearInterval.bind($win);

	/**
	 * 设置延时调用定时器
	 * @function setTimeout
	 * @memberof timer
	 * @param {function} fn 延时调用的函数
	 * @param {number} [delay=0] 延时调用的间隔时间(ms)
	 * @return {object} 定时器对象，可传入clearTimeout方法来终止这个定时器
	 */
	Timer.setTimeout = Timer.setTimeout || $win.setTimeout.bind($win);

	/**
	 * 清除延时调用定时器
	 * @function clearTimeout
	 * @memberof timer
	 * @param {object} obj 定时器对象
	 */
	Timer.clearTimeout = Timer.clearTimeout || $win.clearTimeout.bind($win);
}

module.exports = Timer;
