/**
 * 平滑滚动到某个元素
 * @param {element} node 目标DOM元素
 * @param {object} spec 选项
 * @param {number} [spec.delta=0] 目标滚动位置与目标元素顶部的间距，可以为负值
 * @param {function} [options.callback=$.noop] 滚动完成的回调函数
 * @example
 * //滚动到页面顶端
 * smoothScrollTo(document.body);
 */

var $ = window.$ || window.Zepto || window.jQuery;

function smoothScrollTo(node, spec) {
	var conf = $.extend(
		{
			delta: 0,
			callback: $.noop
		},
		spec
	);

	var offset = $(node).offset();
	var target = offset.top + conf.delta;
	var callback = conf.callback;

	var prevStep;
	var stayCount = 3;

	var timer = null;

	var stopTimer = function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
			window.scrollTo(0, target);
			if ($.isFunction(callback)) {
				callback();
			}
		}
	};

	timer = setInterval(function() {
		var sTop = $(window).scrollTop();
		var delta = sTop - target;
		if (delta > 0) {
			delta = Math.floor(delta * 0.8);
		} else if (delta < 0) {
			delta = Math.ceil(delta * 0.8);
		}

		var step = target + delta;
		if (step === prevStep) {
			stayCount--;
		}
		prevStep = step;

		window.scrollTo(0, step);

		if (step === target || stayCount <= 0) {
			stopTimer();
		}
	}, 16);

	setTimeout(function() {
		stopTimer();
	}, 3000);
}

module.exports = smoothScrollTo;
