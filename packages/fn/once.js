/**
 * 包装为仅触发一次的函数
 * - 被包装的函数智能执行一次，之后不会再执行
 * @method once
 * @param {Function} fn 要延迟触发的函数
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 该函数仅能触发执行一次
 * @example
 *	var fn = once(function () {
 *		console.info('output');
 *	});
 *	fn(); // 'output'
 *	fn(); // will do nothing
 */

function once (fn, bind) {
	return function () {
		bind = bind || this;
		if (typeof fn === 'function') {
			fn.apply(bind, arguments);
			fn = null;
			bind = null;
		}
	};
}

module.exports = once;
