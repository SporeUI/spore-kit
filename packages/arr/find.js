/**
 * 查找符合条件的元素在数组中的位置
 * @module
 * @param {array} arr 要操作的数组
 * @param {function} fn 条件函数
 * @param {object} [context] 函数的this指向
 * @return {array} 符合条件的元素在数组中的位置
 * @example
 * 	console.info(find([1,2,3,4,5],function(item){
 * 		return item < 3;
 * 	});	//[0, 1]
 */

function find(arr, fn, context) {
	var positions = [];
	arr.forEach(function(item, index) {
		if (fn.call(context, item, index, arr)) {
			positions.push(index);
		}
	});
	return positions;
}

module.exports = find;
