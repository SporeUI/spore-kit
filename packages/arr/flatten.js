var $type = require('spore-kit-obj/type');

/**
 * 数组扁平化
 * @module
 * @param {array} arr 要操作的数组
 * @return {array} 经过扁平化处理的数组
 * @example
 * console.info(flatten([1,[2,3],[4,5]]));	//[1,2,3,4,5]
 */

function flatten(arr) {
	var array = [];
	for (var i = 0, l = arr.length; i < l; i++) {
		var type = $type(arr[i]);
		if (type === 'null') {
			continue;
		}
		array = array.concat(
			type === 'array' ? flatten(arr[i]) : arr[i]
		);
	}
	return array;
}

module.exports = flatten;
