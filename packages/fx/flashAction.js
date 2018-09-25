/**
 * 封装闪烁动作
 * @param {object} options 选项
 * @param {number} [options.times=3] 闪烁次数
 * @param {number} [options.delay=100] 闪烁间隔时间，单位为毫秒
 * @param {function} [options.actionOdd=$.noop] 奇数回调
 * @param {function} [options.actionEven=$.noop] 偶数回调
 * @param {function} [options.recover] 状态恢复回调
 * @example
 * 	var text = $('#target span.txt');
 * 	$flashAction({
 * 		actionOdd : function(){
 * 			text.css('color', '#f00');
 * 		},
 * 		actionEven : function(){
 * 			text.css('color', '#00f');
 * 		},
 * 		recover : function(){
 * 			text.css('color', '#000');
 * 		}
 * 	});
 */

function flashAction (options) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var conf = $.extend(
		{
			times: 3,
			delay: 100,
			actionOdd: $.noop,
			actionEven: $.noop,
			recover: $.noop
		},
		options
	);

	var queue = [];
	for (var i = 0; i < conf.times * 2 + 1; i++) {
		queue.push((i + 1) * conf.delay);
	}

	$.each(queue, function(index, time) {
		setTimeout(function() {
			if (index >= queue.length - 1) {
				conf.recover();
			} else if (index % 2 === 0) {
				conf.actionEven();
			} else {
				conf.actionOdd();
			}
		}, time);
	});
}

module.exports = flashAction;
