var $contains = require('./contains');

/**
 * 确认对象是否在数组中，不存在则将对象插入到数组中
 * @module
 * @param {array} arr 要操作的数组
 * @param {*} item 要插入的对象
 * @return {array} 经过处理的源数组
 * @example
 * console.info(include([1,2,3],4));	//[1,2,3,4]
 * console.info(include([1,2,3],3));	//[1,2,3]
 */

function include(arr, item) {
	if (!$contains(arr, item)) {
		arr.push(item);
	}
	return arr;
}

module.exports = include;
