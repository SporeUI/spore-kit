/* eslint-disable no-control-regex */
/**
 * 从左到右取字符串，中文算两个字符
 * @method leftB
 * @param {String} str
 * @param {Number} lens
 * @returns {String} str
 * @example
 * var $leftB = require('spore-kit/packages/str/leftB');
 * //向汉编致敬
 * $leftB('世界真和谐', 6); // '世界真'
*/

var $bLength = require('./bLength');

function leftB(str, lens) {
  var s = str.replace(/\*/g, ' ')
    .replace(/[^\x00-\xff]/g, '**');
  str = str.slice(0, s.slice(0, lens)
    .replace(/\*\*/g, ' ')
    .replace(/\*/g, '').length);
  if ($bLength(str) > lens && lens > 0) {
    str = str.slice(0, str.length - 1);
  }
  return str;
}

module.exports = leftB;
