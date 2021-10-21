/**
 * 数组扁平化
 * @method arr/flatten
 * @param {array} arr 要操作的数组
 * @returns {array} 经过扁平化处理的数组
 * @example
 * var $flatten = require('@spore-ui/kit/packages/arr/flatten');
 * console.info($flatten([1, [2,3], [4,5]])); // [1,2,3,4,5]
 */

var $type = require('../obj/type');

function flatten(arr) {
  var array = [];
  for (var i = 0, l = arr.length; i < l; i += 1) {
    var type = $type(arr[i]);
    if (type === 'null') {
      continue;
    }
    var extraArr = type === 'array' ? flatten(arr[i]) : arr[i];
    array = array.concat(extraArr);
  }
  return array;
}

module.exports = flatten;
