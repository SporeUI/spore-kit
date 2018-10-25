/**
 * UA字符串匹配列表
 * @method uaMatch
 * @param {Object} list 检测 Hash 列表
 * @param {String} ua 用于检测的 UA 字符串
 * @param {Object} conf 检测器选项，传递给检测函数
 * @example
 * var rs = uaMatch({
 * 	trident: 'trident',
 * 	presto: /presto/,
 * 	gecko: function(ua){
 * 		return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
 * 	}
 * }, 'xxx presto xxx');
 * console.info(rs.presto); // true
 * console.info(rs.trident); // undefined
 */

function uaMatch(list, ua, conf) {
	var result = {};
	if (!ua) {
		if (typeof window === 'undefined') {
			ua = '';
		} else {
			ua = window.navigator.userAgent;
		}
	}
	ua = ua.toLowerCase();
	if (typeof list === 'object') {
		Object.keys(list).forEach(function(key) {
			var tester = list[key];
			if (tester) {
				if (typeof tester === 'string') {
					if (ua.indexOf(tester) > -1) {
						result[key] = true;
					}
				} else if (
					Object.prototype.toString.call(tester) === '[object RegExp]'
				) {
					var match = ua.match(tester);
					if (match) {
						if (match[1]) {
							result[key] = match[1];
						} else {
							result[key] = true;
						}
					}
				} else if (typeof tester === 'function') {
					if (tester(ua, conf)) {
						result[key] = tester(ua);
					}
				}
			}
		});
	}

	return result;
}

module.exports = uaMatch;
