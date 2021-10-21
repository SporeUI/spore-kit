/**
 * 确认对象是否在数组中
 * @method arr/contains
 * @param {Array} arr 要操作的数组
 * @param {*} item 要搜索的对象
 * @returns {Boolean} 如果对象在数组中，返回 true
 * @example
 * var $contains = require('@spore-ui/kit/packages/arr/$contains');
 * console.info($contains([1,2,3,4,5], 3)); // true
 */

function contains(arr, item) {
  var index = arr.indexOf(item);
  return index >= 0;
}

module.exports = contains;
