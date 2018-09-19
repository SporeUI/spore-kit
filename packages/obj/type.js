/**
 * 获取数据类型
 * @module
 * @param {mixed} 任何类型数据
 * @return {string} 对象类型
 * @example
 * console.info(type({}));		//function
 * console.info(type(undefined));	//undefined
 */

module.exports = function(item) {
	return Object.prototype.toString
		.call(item)
		.toLowerCase()
		.replace(/^\[object\s*|\]$/gi, '');
};
