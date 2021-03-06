/**
 * 获取 DOM 元素相对于 document 的边距
 * @method offset
 * @see https://github.com/timoxley/offset
 * @param {Object} node 要计算 offset 的 dom 对象
 * @return {Object} offset 对象
 * @example
 * var offset = require('document-offset')
 * var target = document.getElementById('target')
 * console.log(offset(target))
 * // {top: 69, left: 108}
 */

var offset = null;

if (typeof window !== 'undefined') {
	offset = require('document-offset');
}

module.exports = offset;
