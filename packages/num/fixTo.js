/**
 * 修正补位
 * @method num/fixTo
 * @param {Number|String} num 要补位的数字
 * @param {Number} [w=2] w 补位数量
 * @return {String} 经过补位的字符串
 * @example
 * var $fixTo = require('spore-kit/packages/num/fixTo');
 * $fixTo(0, 2); //return '00'
 */

function fixTo(num, w) {
  var str = num.toString();
  w = Math.max((w || 2) - str.length + 1, 0);
  return new Array(w).join('0') + str;
}

module.exports = fixTo;
