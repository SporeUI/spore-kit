/**
 * 包装为延迟触发的函数
 * @module
 * @param {function} fn 要延迟触发的函数
 * @param {number} duration 延迟时间[ms]
 * @param {object} [bind] 函数的this指向
 * @return {function} 经过包装的延迟触发函数
 * @example
 *	var comp = {
 *		countWords : function(){
 *			console.info(this.length);
 *		}
 *	};
 *	$('#input').keydown(delay(function(){
 *		this.length = $('#input').val().length;
 *		this.countWords();
 *	}, 200, comp));
 */

function delay(fn, duration, bind) {
	var timer = null;
	return function() {
		bind = bind || this;
		if (timer) {
			clearTimeout(timer);
		}
		var args = arguments;
		timer = setTimeout(function() {
			fn.apply(bind, args);
		}, duration);
	};
}

module.exports = delay;
