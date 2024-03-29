/**
 * 生成一个不与之前重复的随机字符串
 * @method str/getUniqueKey
 * @returns {String} 随机字符串
 * @example
 * var $getUniqueKey = require('@spore-ui/kit/packages/str/getUniqueKey');
 * $getUniqueKey(); // '166aae1fa9f'
 */

var time = +new Date();
var index = 0;

function getUniqueKey() {
  index += 1;
  return (time + (index)).toString(16);
}

module.exports = getUniqueKey;
