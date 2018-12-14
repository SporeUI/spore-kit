/**
 * 任务分时执行
 * - 一方面避免单次reflow流程执行太多js任务导致浏览器卡死
 * - 另一方面单个任务的报错不会影响后续任务的执行
 * @method job
 * @param {Function} 任务函数
 * @returns {Object} 任务队列对象
 * @example
 * job(function() {
 * 	//task1 start
 * });
 * job(function() {
 * 	//task2 start
 * });
 */

var manager = {};

manager.queue = [];

manager.add = function(fn, options) {
	options = options || {};
	manager.queue.push({
		fn: fn,
		conf: options
	});
	manager.step();
};

manager.step = function() {
	if (!manager.queue.length || manager.timer) { return; }
	manager.timer = setTimeout(function() {
		var item = manager.queue.shift();
		if (item) {
			if (item.fn && typeof item.fn === 'function') {
				item.fn.call(null);
			}
			manager.timer = null;
			manager.step();
		}
	}, 1);
};

function job(fn, options) {
	manager.add(fn, options);
	return manager;
}

module.exports = job;
