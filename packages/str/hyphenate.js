/**
 * 将驼峰格式变为连字符格式
 * @method str/hyphenate
 * @param {String} str 驼峰格式的字符串
 * @returns {String} 连字符格式的字符串
 * @example
 * var $hyphenate = require('@spore-ui/kit/packages/str/hyphenate');
 * $hyphenate('libKitStrHyphenate'); // 'lib-kit-str-hyphenate'
 */

function hyphenate(str) {
  return str.replace(/[A-Z]/g, function ($0) {
    return '-' + $0.toLowerCase();
  });
}

module.exports = hyphenate;
