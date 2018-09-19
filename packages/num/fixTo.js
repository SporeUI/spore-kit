/**
 * 修正补位
 * @module
 * @param {number|string} num 要补位的数字
 * @param {number} [w=2] w 补位数量
 * @return {string} 经过补位的字符串
 * @example
 * fixTo(0,2);	//return '00'
 */

function fixTo(num, w) {
	var str = num.toString();
	w = Math.max((w || 2) - str.length + 1, 0);
	return new Array(w).join('0') + str;
}

module.exports = fixTo;
