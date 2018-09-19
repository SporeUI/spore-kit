/**
 * 限制数字在一个范围内
 * @module
 * @param {number} num 要限制的数字
 * @param {number} min 最小边界数值
 * @param {number} max 最大边界数值
 * @return {number} 经过限制的数值
 * @example
 * limit(1, 5, 10);	//return 5
 * limit(6, 5, 10);	//return 6
 * limit(11, 5, 10);	//return 10
 */

function limit(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

module.exports = limit;
