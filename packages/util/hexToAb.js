/**
 * 16进制字符串转ArrayBuffer
 * @method util/hexToAb
 * @see https://caniuse.com/#search=ArrayBuffer
 * @param {String} str 需要转换的16进制字符串
 * @returns {ArrayBuffer} 被转换后的 ArrayBuffer 对象
 * @example
 * var $hexToAb = require('@spore-ui/kit/packages/util/hexToAb');
 * var ab = $hexToAb();
 * ab.byteLength; // => 0
 * ab = $hexToAb('abcd');
 * var dv = new DataView(ab);
 * ab.byteLength; // => 2
 * dv.getUint8(0); // => 171
 * dv.getUint8(1); // => 205
 */

function hexToAb(str) {
  if (!str) {
    return new ArrayBuffer(0);
  }
  var buffer = new ArrayBuffer(Math.ceil(str.length / 2));
  var dataView = new DataView(buffer);
  var index = 0;
  var i;
  var len = str.length;
  for (i = 0; i < len; i += 2) {
    var code = parseInt(str.substr(i, 2), 16);
    dataView.setUint8(index, code);
    index += 1;
  }
  return buffer;
}

module.exports = hexToAb;
