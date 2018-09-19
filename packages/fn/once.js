/**
 * 包装为仅触发一次的函数
 * @module
 * @param {function} fn 要延迟触发的函数
 * @param {object} [bind] 函数的this指向
 * @return {function} 该函数仅能触发执行一次
 * @example
 * 	var fn = once(function(){
 * 		console.info('output');
 * 	});
 * 	fn(); //log output
 * 	fn(); //will do nothing
 */

function once(fn, bind) {
	return function() {
		bind = bind || this;
		if (fn) {
			fn.apply(bind, arguments);
			fn = null;
			bind = null;
		}
	};
}

module.exports = once;
