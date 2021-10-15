/**
 * 限制数字在一个范围内
 * @method limit
 * @param {Number} num 要限制的数字
 * @param {Number} min 最小边界数值
 * @param {Number} max 最大边界数值
 * @return {Number} 经过限制的数值
 * @example
 * var $limit = require('spore-kit/packages/num/limit');
 * $limit(1, 5, 10); // 5
 * $limit(6, 5, 10); // 6
 * $limit(11, 5, 10); // 10
 */

function limit (num, min, max) {
	return Math.min(Math.max(num, min), max);
}

module.exports = limit;
