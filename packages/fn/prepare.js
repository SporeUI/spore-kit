/**
 * 包装为一个条件触发管理器。
 *
 * - 调用管理器的 ready 函数设置条件被激活。
 * - 之前插入管理器的函数按顺序执行。
 * - 之后插入管理器的函数立即执行。
 * - 作用机制类似 jQuery.ready, 但可以设置任何条件
 * @return {function} 条件管理触发器函数
 * @module
 * @example
 * 	var timeReady = prepare();
 *
 * 	//设置条件2秒后可执行插入的函数
 * 	setTimeout(function(){
 * 		timeReady.ready();
 * 	}, 2000);
 *
 * 	//2秒后输出1
 * 	timeReady(function(){
 * 		console.info(1);
 * 	});
 *
 * 	//2秒后输出2
 * 	timeReady(function(){
 * 		console.info(2);
 * 	});
 *
 * 	setTimeout(function(){
 * 		//condition 已为true, 立即输出3
 * 		timeReady(function(){
 * 			console.info(3);
 * 		});
 * 	}, 2100);
 */

function prepare() {
	var queue = [];
	var condition = false;
	var model;

	var attampt = function(fn) {
		if (condition) {
			if (typeof fn === 'function') {
				fn(model);
			}
		} else {
			queue.push(fn);
		}
	};

	attampt.ready = function(data) {
		condition = true;
		model = data;
		while (queue.length) {
			var fn = queue.shift();
			if (typeof fn === 'function') {
				fn(model);
			}
		}
	};

	return attampt;
}

module.exports = prepare;
