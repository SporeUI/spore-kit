/**
 * 全角字符转半角字符
 * @module
 * @param {string} str 包含了全角字符的字符串
 * @return {string} 经过转换的字符串
 * @example
 * dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ');	//return 'SAASDFSADF'
 */

function dbcToSbc(str) {
	return str.replace(/[\uff01-\uff5e]/g, function (a) {
		return String.fromCharCode(a.charCodeAt(0) - 65248);
	}).replace(/\u3000/g, ' ');
}

module.exports = dbcToSbc;
