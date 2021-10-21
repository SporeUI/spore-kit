/* eslint-disable no-control-regex */
/**
 * 获取字符串长度，一个中文算2个字符
 * @method str/bLength
 * @param {String} str 要计算长度的字符串
 * @returns {Number} 字符串长度
 * @example
 * var $bLength = require('@spore-ui/kit/packages/str/bLength');
 * $bLength('中文cc'); // 6
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
