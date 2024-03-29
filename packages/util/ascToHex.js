/**
 * ASCII字符串转16进制字符串
 * @method util/ascToHex
 * @param {String} str 需要转换的ASCII字符串
 * @returns {String} 16进制字符串
 * @example
 * var $ascToHex = require('@spore-ui/kit/packages/util/ascToHex');
 * $ascToHex(); // => ''
 * $ascToHex('*+'); // => '2a2b'
 */

function ascToHex(str) {
  if (!str) {
    return '';
  }
  var hex = '';
  var index;
  var len = str.length;
  for (index = 0; index < len; index += 1) {
    var int = str.charCodeAt(index);
    var code = (int).toString(16);
    hex += code;
  }
  return hex;
}

module.exports = ascToHex;
