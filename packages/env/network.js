/**
 * 网络环境检测
 * @module network
 */

var supportOnline = null;

/**
 * 判断页面是否支持联网检测
 * @method network.support
 * @returns {Boolean} 是否支持联网检测
 * @example
 * network.support(); // true/false
 */
function support() {
	if (supportOnline === null) {
		supportOnline = !!('onLine' in window.navigator);
	}
	return supportOnline;
}

/**
 * 判断页面是否联网
 * @method network.onLine
 * @returns {Boolean} 是否联网
 * @example
 * network.onLine(); //true/false
 */
function onLine() {
	return support() ? window.navigator.onLine : true;
}

exports.support = support;
exports.onLine = onLine;
