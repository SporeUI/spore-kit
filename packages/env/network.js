/**
 * 网络环境检测
 */

var supportOnline = null;

/**
 * 判断是否支持联网检测
 * @return {boolean} true/false
 */
function support() {
	if (supportOnline === null) {
		supportOnline = !!('onLine' in window.navigator);
	}
	return supportOnline;
}

/**
 * 判断是否联网
 * @return {boolean} true/false
 */
function onLine() {
	return support() ? window.navigator.onLine : true;
}

exports.support = support;
exports.onLine = onLine;
