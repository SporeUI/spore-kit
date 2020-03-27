/**
 * 提供倒计时器统一封装
 * @method countDown
 * @param {Object} spec 选项
 * @param {Date} [spec.base] 矫正时间，如果需要用服务端时间矫正倒计时，使用此参数
 * @param {Date} [spec.target=Date.now() + 3000] 目标时间
 * @param {Number} [spec.interval=1000] 倒计时触发间隔
 * @param {Function} [spec.onChange] 倒计时触发变更的事件回调
 * @param {Function} [spec.onStop] 倒计时结束的回调
 * @returns {Object} 倒计时对象实例
 * @example
 *	var target = Date.now() + 5000;
 *	var cd1 = countDown({
 *		target : target,
 *		onChange : function(delta){
 *			console.info('cd1 change', delta);
 *		},
 *		onStop : function(delta){
 *			console.info('cd1 stop', delta);
 *		}
 *	});
 *	setTimeout(function(){
 *		//trigger stop
 *		cd1.stop();
 *	}, 2000);
 *	var cd2 = countDown({
 *		target : target,
 *		interval : 2000,
 *		onChange : function(delta){
 *			console.info('cd2 change', delta);
 *		},
 *		onStop : function(delta){
 *			console.info('cd2 stop', delta);
 *		}
 *	});
 */

var $erase = require('spore-kit-arr/erase');
var $assign = require('spore-kit-obj/assign');

var allMonitors = {};
var localBaseTime = Date.now();

function countDown (spec) {
	var that = {};

	// 为什么不使用 timeLeft 参数替换 base 和 target:
	// 如果用 timeLeft 作为参数，计时器初始化之前如果有进程阻塞，有可能会导致与目标时间产生误差
	// 页面多个定时器一起初始化时，会出现计时器更新不同步的现象，同时引发页面多处没有一起回流
	// 保留目前这个方案，用于需要精确倒计时的情况
	var conf = $assign({
		base: null,
		target: Date.now() + 3000,
		interval: 1000,
		onChange: null,
		onStop: null
	}, spec);

	var timeDiff = 0;
	var target = +new Date(conf.target);
	var interval = parseInt(conf.interval, 10) || 0;

	// 使倒计时触发时间精确化
	// 使用固定的触发频率，减少需要创建的定时器
	var timeInterval = interval;
	if (timeInterval < 500) {
		timeInterval = 10;
	} else if (timeInterval < 5000) {
		timeInterval = 100;
	} else {
		timeInterval = 1000;
	}

	var delta;
	var curUnit;

	var update = function(now) {
		delta = target - now;
		var unit = Math.ceil(delta / interval);
		if (unit !== curUnit) {
			curUnit = unit;
			if (typeof conf.onChange === 'function') {
				conf.onChange(delta);
			}
		}
	};

	/**
	 * 纠正时间差
	 * @method countDown#correct
	 * @memberof countDown
	 * @example
	 * var cd = countDown();
	 * var serverTime = '2019/01/01';
	 * var localTime = '2020/01/01';
	 * cd.correct(serverTime);
	 * cd.correct(serverTime, localTime);
	 */
	that.correct = function(serverTime, localTime) {
		var now = localTime ? new Date(localTime) : +new Date();
		var serverDate = serverTime ? new Date(serverTime) : 0;
		if (serverDate) {
			timeDiff = serverDate - now;
		}
	};

	if (conf.base) {
		that.correct(conf.base);
	}

	var check = function(localDelta) {
		var now = localBaseTime + timeDiff + localDelta;
		update(now);
		if (delta <= 0) {
			that.stop(now);
		}
	};

	/**
	 * 停止倒计时
	 * @method countDown#stop
	 * @memberof countDown
	 * @example
	 * var cd = countDown();
	 * cd.stop();
	 */
	that.stop = function() {
		var mobj = allMonitors[timeInterval];
		if (mobj && mobj.queue) {
			$erase(mobj.queue, check);
		}
		// onStop事件触发必须在从队列移除回调之后
		// 否则循环接替的定时器会引发死循环
		if (typeof conf.onStop === 'function') {
			conf.onStop(delta);
		}
	};

	var monitor = allMonitors[timeInterval];

	if (!monitor) {
		monitor = {};
		monitor.queue = [];
		monitor.inspect = function() {
			var now = Date.now();
			var mobj = allMonitors[timeInterval];
			var localDelta = now - localBaseTime;
			if (mobj.queue.length) {
				// 循环当中会删除数组元素，因此需要先复制一下数组
				mobj.queue.slice(0).forEach(function(fn) {
					fn(localDelta);
				});
			} else {
				clearInterval(mobj.timer);
				allMonitors[timeInterval] = null;
				delete mobj.timer;
			}
		};
		allMonitors[timeInterval] = monitor;
	}

	monitor.queue.push(check);

	if (!monitor.timer) {
		monitor.timer = setInterval(monitor.inspect, timeInterval);
	}

	monitor.inspect();

	return that;
}

module.exports = countDown;
