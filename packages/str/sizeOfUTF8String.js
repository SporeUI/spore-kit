/**
 * 取字符串 utf8 编码长度，from 王集鹄
 * @method str/sizeOfUTF8String
 * @param {String} str
 * @returns {Number} 字符串长度
 * @example
 * var $sizeOfUTF8String = require('spore-kit/packages/str/sizeOfUTF8String');
 * $sizeOfUTF8String('中文cc'); //return 8
*/

function sizeOfUTF8String(str) {
  return (
    typeof unescape !== 'undefined'
      ? unescape(encodeURIComponent(str)).length
      : new ArrayBuffer(str, 'utf8').length
  );
}

module.exports = sizeOfUTF8String;
