/**
 * 判断浏览器是否支持触摸屏
 * @method env/touchable
 * @returns {Boolean} 是否支持触摸屏
 * @example
 * var $touchable = require('@spore-ui/kit/packages/env/touchable');
 * if ($touchable()) {
 *   // It is a touch device.
 * }
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
