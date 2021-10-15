/**
 * 获取 DOM 元素相对于 document 的边距
 * @method offset
 * @see https://github.com/timoxley/offset
 * @param {Object} node 要计算 offset 的 dom 对象
 * @return {Object} offset 对象
 * @example
 * var $offset = require('spore-kit/packages/dom/offset');
 * var target = document.getElementById('target');
 * console.log($offset(target));
 * // {top: 69, left: 108}
 */

var offset = function () {
  return {};
};

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  offset = require('document-offset');
}

module.exports = offset;
