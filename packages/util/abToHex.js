/**
 * ArrayBuffer转16进制字符串
 * @method util/abToHex
 * @param {ArrayBuffer} buffer 需要转换的 ArrayBuffer
 * @returns {String} 16进制字符串
 * @example
 * var $abToHex = require('@spore-ui/kit/packages/util/abToHex');
 * var ab = new ArrayBuffer(2);
 * var dv = new DataView(ab);
 * dv.setUint8(0, 171);
 * dv.setUint8(1, 205);
 * $abToHex(ab); // => 'abcd'
 */

function abToHex(buffer) {
  if (Object.prototype.toString.call(buffer) !== '[object ArrayBuffer]') {
    return '';
  }
  var u8arr = new Uint8Array(buffer);
  var fn = function (bit) {
    return ('00' + bit.toString(16)).slice(-2);
  };
  return Array.prototype.map.call(u8arr, fn).join('');
}

module.exports = abToHex;
