/**
 * 判断是否支持触摸屏
 * @type {boolean}
 * @example
 * 	if(touchable()){
 * 		//It is a touch device.
 * 	}
 */

var isTouchable = null;

function touchable() {
	if (isTouchable === null) {
		isTouchable = !!('ontouchstart' in window
		|| (window.DocumentTouch && document instanceof window.DocumentTouch));
	}
	return isTouchable;
}

module.exports = touchable;
