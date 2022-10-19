/**
 * rgb字符串解析
 * - 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - h, s, 和 l 设定在 [0, 1] 之间
 * - 返回的 r, g, 和 b 在 [0, 255]之间
 * @method util/parseRGB
 * @param {String} color 16进制色值
 * @returns {Array} RGB色值数值
 * @example
 * var $parseRGB = require('@spore-ui/kit/packages/util/parseRGB');
 * $parseRGB('#ffffff'); // => [255,255,255]
 * $parseRGB('#fff'); // => [255,255,255]
 */

const REG_HEX = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i;

function parseRGB(color) {
  var str = color;
  if (typeof str !== 'string') {
    throw new Error('Color should be string');
  }
  if (!REG_HEX.test(str)) {
    throw new Error('Wrong RGB color format');
  }

  str = str.replace('#', '');
  var arr;
  if (str.length === 3) {
    arr = str.split('').map(function (c) {
      return c + c;
    });
  } else {
    arr = str.match(/[a-fA-F0-9]{2}/g);
  }
  arr.length = 3;
  return arr.map(function (c) {
    return parseInt(c, 16);
  });
}

module.exports = parseRGB;
