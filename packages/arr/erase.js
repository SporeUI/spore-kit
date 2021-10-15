/**
 * 删除数组中的对象
 * @method erase
 * @param {Array} arr 要操作的数组
 * @param {*} item 要清除的对象
 * @returns {Number} 对象原本所在位置
 * @example
 * var $erase = require('spore-kit/packages/arr/erase');
 * console.info($erase([1,2,3,4,5],3));	// [1,2,4,5]
 */

function erase (arr, item) {
	var index = arr.indexOf(item);
	if (index >= 0) {
		arr.splice(index, 1);
	}
	return index;
}

module.exports = erase;
