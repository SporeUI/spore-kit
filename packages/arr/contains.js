/**
 * 确认对象是否在数组中
 * @module
 * @param {array} arr 要操作的数组
 * @param {*} item 要搜索的对象
 * @return {boolean} 如果对象在数组中，返回true
 * @example
 * console.info(contains([1,2,3,4,5],3));	//true
 */

function contains(arr, item) {
	var index = arr.indexOf(item);
	return index >= 0;
}

module.exports = contains;
