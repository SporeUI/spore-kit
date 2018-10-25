/**
 * 封装闪烁动作
 * @method flashAction
 * @param {object} options 选项
 * @param {number} [options.times=3] 闪烁次数，默认3次
 * @param {number} [options.delay=100] 闪烁间隔时间(ms)
 * @param {function} [options.actionOdd] 奇数回调
 * @param {function} [options.actionEven] 偶数回调
 * @param {function} [options.recover] 状态恢复回调
 * @example
 * 	// 文字闪烁，奇数次呈现为红色，偶数次成纤维蓝色，动画结束呈现为黑色
 *	var text = $('#target span.txt');
 *	$flashAction({
 *		actionOdd : function (){
 *			text.css('color', '#f00');
 *		},
 *		actionEven : function (){
 *			text.css('color', '#00f');
 *		},
 *		recover : function (){
 *			text.css('color', '#000');
 *		}
 *	});
 */
var $assign = require('spore-kit-obj/assign');

function flashAction (options) {
	var conf = $assign(
		{
			times: 3,
			delay: 100,
			actionOdd: null,
			actionEven: null,
			recover: null
		},
		options
	);

	var queue = [];
	for (var i = 0; i < conf.times * 2 + 1; i++) {
		queue.push((i + 1) * conf.delay);
	}

	queue.forEach(function (time, index) {
		setTimeout(function () {
			if (index >= queue.length - 1) {
				if (conf.recover === 'function') {
					conf.recover();
				}
			} else if (index % 2 === 0) {
				if (typeof conf.actionEven === 'function') {
					conf.actionEven();
				}
			} else if (typeof conf.actionOdd === 'function') {
				conf.actionOdd();
			}
		}, time);
	});
}

module.exports = flashAction;
