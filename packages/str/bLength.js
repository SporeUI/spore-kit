/**
 * 获取字符串长度，一个中文算2个字符
 * @module
 * @param {string} str 要计算长度的字符串
 * @return {number} 字符串长度
 * @example
 * bLength('中文cc');  //return 6
 */

function bLength(str) {
	var aMatch;
	if (!str) {
		return 0;
	}
	aMatch = str.match(/[^\x00-\xff]/g);
	return (str.length + (!aMatch ? 0 : aMatch.length));
}

module.exports = bLength;
