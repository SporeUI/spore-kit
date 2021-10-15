/**
 * 包装为一个队列，按设置的时间间隔触发任务函数
 * - 插入队列的所有函数都会执行，但每次执行之间都会有一个固定的时间间隔。
 * @method queue
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的队列触发函数
 * @example
 * var $queue = require('spore-kit/packages/fn/queue');
 * var t1 = Date.now();
 * var doSomthing = $queue(function (index) {
 *   console.info(index + ':' + (Date.now() - t1));
 * }, 200);
 * // 每隔200ms输出一个日志。
 * for(var i = 0; i < 10; i++){
 *   doSomthing(i);
 * }
 */

function queue (fn, delay, bind) {
	var timer = null;
	var arr = [];
	return function() {
		bind = bind || this;
		var args = arguments;
		arr.push(function () {
			if (typeof fn === 'function') {
				fn.apply(bind, args);
			}
		});
		if (!timer) {
			timer = setInterval(function () {
				if (!arr.length) {
					clearInterval(timer);
					timer = null;
				} else {
					arr.shift()();
				}
			}, delay);
		}
	};
}

module.exports = queue;
