/**
 * 包装为延迟触发的函数
 *
 * 用于处理密集事件，延迟时间内同时触发的函数调用，最终只在最后一次调用延迟后，执行一次。
 * @method delay
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} duration 延迟时间(ms)
 * @param {Object} [bind] 函数的this指向
 * @returns {Function} 经过包装的延迟触发函数
 * @example
 *	var comp = {
 *		countWords : function(){
 *			console.info(this.length);
 *		}
 *	};
 *
 *  // 疯狂点击 input ，停下来 500 ms 后，触发函数调用
 *	$('#input').keydown(delay(function(){
 *		this.length = $('#input').val().length;
 *		this.countWords();
 *	}, 500, comp));
 */

function delay(fn, duration, bind) {
	var timer = null;
	return function() {
		bind = bind || this;
		if (timer) {
			clearTimeout(timer);
		}
		var args = arguments;
		timer = setTimeout(function () {
			if (typeof fn === 'function') {
				fn.apply(bind, args);
			}
		}, duration);
	};
}

module.exports = delay;
