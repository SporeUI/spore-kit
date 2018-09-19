/**
 * 提供倒计时器统一封装
 * @module
 * @param {object} spec 选项
 * @param {date} [spec.base=null] 矫正时间，如果需要用服务端时间矫正倒计时，使用此参数
 * @param {date} [spec.target=Date.now() + 3000] 目标时间
 * @param {interval} [spec.interval=1000] 倒计时触发间隔
 * @param {function} [spec.onChange=$.noop] 倒计时触发变更的事件回调
 * @param {function} [spec.onStop=$.noop] 倒计时结束的回调
 * @example
 * 	var target = Date.now() + 5000;
 * 	var cd1 = countDown({
 * 		target : target,
 * 		onChange : function(delta){
 * 			console.info('cd1 change', delta);
 * 		},
 * 		onStop : function(delta){
 * 			console.info('cd1 stop', delta);
 * 		}
 * 	});
 * 	setTimeout(function(){
 * 		//trigger stop
 * 		cd1.stop();
 * 	}, 2000);
 * 	var cd2 = countDown({
 * 		target : target,
 * 		interval : 2000,
 * 		onChange : function(delta){
 * 			console.info('cd2 change', delta);
 * 		},
 * 		onStop : function(delta){
 * 			console.info('cd2 stop', delta);
 * 		}
 * 	});
 */

var $erase = require('spore-kit-arr/erase');
var $assign = require('spore-kit-obj/assign');

var allMonitors = {};
var localBaseTime = Date.now();
var noop = function() {};

function countDown(spec) {
	var that = {};

	// 为什么不使用 timeLeft 参数替换 base 和 target:
	// 如果用 timeLeft 作为参数，计时器初始化之前如果有进程阻塞，有可能会导致与目标时间产生误差
	// 页面多个定时器一起初始化时，会出现计时器更新不同步的现象，同时引发页面多处没有一起回流
	// 保留目前这个方案，用于需要精确倒计时的情况
	var conf = $assign({
		base: null,
		target: Date.now() + 3000,
		interval: 1000,
		onChange: noop,
		onStop: noop
	}, spec);

	var base = +new Date(conf.base);
	var target = +new Date(conf.target);
	var interval = parseInt(conf.interval, 10) || 0;

	// 使倒计时触发时间精确化
	// 使用固定的触发频率，减少需要创建的定时器
	var delay = interval;
	if (delay < 500) {
		delay = 10;
	} else if (delay < 5000) {
		delay = 100;
	} else {
		delay = 1000;
	}

	var delta;
	var curUnit;

	var update = function(now) {
		delta = target - now;
		var unit = Math.ceil(delta / interval);
		if (unit !== curUnit) {
			curUnit = unit;
			conf.onChange(delta);
		}
	};

	var check = function(localDelta) {
		var now = conf.base ? base + localDelta : localBaseTime + localDelta;
		update(now);
		if (delta <= 0) {
			that.stop(now);
		}
	};

	// 停止倒计时
	that.stop = function() {
		var mobj = allMonitors[delay];
		if (mobj && mobj.queue) {
			$erase(mobj.queue, check);
		}
		// onStop事件触发必须在从队列移除回调之后
		// 否则循环接替的定时器会引发死循环
		conf.onStop(delta);
	};

	var monitor = allMonitors[delay];

	if (!monitor) {
		monitor = {};
		monitor.queue = [];
		monitor.inspect = function() {
			var now = Date.now();
			var mobj = allMonitors[delay];
			var localDelta = now - localBaseTime;
			if (mobj.queue.length) {
				// 循环当中会删除数组元素，因此需要先复制一下数组
				mobj.queue.slice(0).forEach(function(fn) {
					fn(localDelta);
				});
			} else {
				clearInterval(mobj.timer);
				allMonitors[delay] = null;
				delete mobj.timer;
			}
		};
		allMonitors[delay] = monitor;
	}

	monitor.queue.push(check);

	if (!monitor.timer) {
		monitor.timer = setInterval(monitor.inspect, delay);
	}

	monitor.inspect();

	return that;
}

module.exports = countDown;
