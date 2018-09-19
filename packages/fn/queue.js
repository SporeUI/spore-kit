/**
 * 包装为一个队列，按设置的时间间隔触发
 * @module
 * @param {function} fn 要延迟触发的函数
 * @param {number} delay 延迟时间[ms]
 * @param {object} [bind] 函数的this指向
 * @return {function} 经过包装的队列触发函数
 * @example
 * 	var t1 = Date.now();
 * 	var doSomthing = queue(function(index){
 * 		console.info(index + ':' + (Date.now() - t1));
 * 	}, 200);
 * 	//每隔200ms输出一个日志。
 * 	for(var i = 0; i < 10; i++){
 * 		doSomthing(i);
 * 	}
 */

function queue(fn, delay, bind) {
	var timer = null;
	var arr = [];
	return function() {
		bind = bind || this;
		var args = arguments;
		arr.push(function() {
			fn.apply(bind, args);
		});
		if (!timer) {
			timer = setInterval(function() {
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
