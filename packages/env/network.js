/**
 * 网络环境检测
 * @module env/network
 */

var supportOnline = null;

/**
 * 判断页面是否支持联网检测
 * @method env/network.support
 * @memberof env/network
 * @returns {Boolean} 是否支持联网检测
 * @example
 * var $network = require('@spore-ui/kit/packages/env/network');
 * $network.support(); // true/false
 */
function support() {
  if (supportOnline === null) {
    supportOnline = !!('onLine' in window.navigator);
  }
  return supportOnline;
}

/**
 * 判断页面是否联网
 * @method env/network.onLine
 * @memberof env/network
 * @returns {Boolean} 是否联网
 * @example
 * var $network = require('@spore-ui/kit/packages/env/network');
 * $network.onLine(); // true/false
 */
function onLine() {
  return support() ? window.navigator.onLine : true;
}

exports.support = support;
exports.onLine = onLine;
