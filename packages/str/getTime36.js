/**
 * 获取36进制日期字符串
 * @method getTime36
 * @param {Date} [date] 符合规范的日期字符串或者数字，不传参数则使用当前客户端时间
 * @return {String} 转成为36进制的字符串
 * @example
 * var $getTime36 = require('spore-kit/packages/str/getTime36');
 * $getTime36('2020'); // 'k4ujaio0'
 */

function getTime36(date) {
  date = date ? new Date(date) : new Date();
  return date.getTime().toString(36);
}

module.exports = getTime36;
