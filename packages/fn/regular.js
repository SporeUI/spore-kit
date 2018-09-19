/**
 * 包装为规律触发的函数，用于降低密集事件的处理频率
 * @module
 * @param {function} fn 要延迟触发的函数
 * @param {number} delay 延迟时间[ms]
 * @param {object} [bind] 函数的this指向
 * @return {function} 经过包装的定时触发函数
 * @example
 * 	var comp = {
 * 		countWords : function(){
 * 			console.info(this.length);
 * 		}
 * 	};
 * 	$('#input').keydown(regular(function(){
 * 		this.length = $('#input').val().length;
 * 		this.countWords();
 * 	}, 200, comp));
 */

function reqular(fn, delay, bind) {
	var enable = true;
	var timer = null;
	return function() {
		bind = bind || this;
		enable = true;
		var args = arguments;
		if (!timer) {
			timer = setInterval(function() {
				fn.apply(bind, args);
				if (!enable) {
					clearInterval(timer);
					timer = null;
				}
				enable = false;
			}, delay);
		}
	};
}

module.exports = reqular;
