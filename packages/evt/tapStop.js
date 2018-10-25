/**
 * 用遮罩的方式阻止 tap 事件穿透引发表单元素获取焦点。
 * - 推荐用 fastclick 来解决触屏事件穿透问题。
 * - 此组件用在 fastclick 未能解决问题时。或者不方便使用 fastclick 时。
 * @method tapStop
 * @param {Object} options 点击选项
 * @param {Number} options.delay 临时浮层在这个延迟时间(ms)之后关闭
 * @example
 * $('.mask').on('tap', function(){
 * 	tapStop();
 * 	$(this).hide();
 * });
 */
var miniMask = null;
var pos = {};
var timer = null;
var touchStartBound = false;

var tapStop = function(options) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var conf = $.extend({
		// 遮罩存在时间
		delay: 500
	}, options);

	if (!miniMask) {
		miniMask = $('<div></div>');
		miniMask.css({
			'display': 'none',
			'position': 'absolute',
			'left': 0,
			'top': 0,
			'margin-left': '-20px',
			'margin-top': '-20px',
			'z-index': 10000,
			'background-color': 'rgba(0,0,0,0)',
			'width': '40px',
			'height': '40px'
		}).appendTo(document.body);
	}

	if (!touchStartBound) {
		$(document).on('touchstart', function(evt) {
			if (!(evt && evt.touches && evt.touches.length)) {
				return;
			}
			var touch = evt.touches[0];
			pos.pageX = touch.pageX;
			pos.pageY = touch.pageY;
		});
		touchStartBound = true;
	}

	var delay = parseInt(conf.delay, 10) || 0;
	miniMask.show().css({
		'left': pos.pageX + 'px',
		'top': pos.pageY + 'px'
	});
	clearTimeout(timer);
	timer = setTimeout(function() {
		miniMask.hide();
	}, delay);
};

module.exports = tapStop;
