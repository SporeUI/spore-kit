/**
 * 包装为一个条件触发管理器
 * - 调用管理器的 ready 函数来激活条件。
 * - 之前插入管理器的函数按队列顺序执行。
 * - 之后插入管理器的函数立即执行。
 * - 作用机制类似 jQuery.ready, 可以设置任何条件。
 * @module prepare
 * @returns {Function} 条件触发管理器函数，传入一个 function 作为任务执行函数参数
 * @example
 *	// 生成一个管理器函数 timeReady
 *	var timeReady = prepare();
 *
 *	// 设置条件为2秒后就绪
 *	setTimeout(function () {
 *		timeReady.ready();
 *	}, 2000);
 *
 *	// 调用管理器函数 timeReady，插入要执行的任务函数
 *	timeReady(function () {
 *		// 2 秒后输出 1
 *		console.info(1);
 *	});
 *
 *	// 调用管理器函数 timeReady，插入要执行的任务函数
 *	timeReady(function () {
 *		// 2 秒后输出 2
 *		console.info(2);
 *	});
 *
 *	// 2100ms 后执行
 *	setTimeout(function () {
 *		// 调用管理器函数 timeReady，插入要执行的任务函数
 *		timeReady(function () {
 *			// 立即执行，输出 3
 *			console.info(3);
 *		});
 *	}, 2100);
 */

/**
 * 激活任务管理器的触发条件，在此之前插入管理器的任务按队列顺序执行，之后插入的任务函数立即执行。
 * @method prepare.ready
 * @memberof prepare
 */
function prepare () {
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
