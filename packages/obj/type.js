/**
 * 获取数据类型
 * @method type
 * @param {*} item 任何类型数据
 * @returns {String} 对象类型
 * @example
 * type({}); // 'object'
 * type(1); // 'number'
 * type(''); // 'string'
 * type(function(){}); // 'function'
 * type(); // 'undefined'
 * type(null); // 'null'
 * type(new Date()); // 'date'
 * type(/a/); // 'regexp'
 * type(Symbol('a')); // 'symbol'
 * type(window) // 'window'
 * type(document) // 'htmldocument'
 * type(document.body) // 'htmlbodyelement'
 * type(document.head) // 'htmlheadelement'
 * type(document.getElementsByTagName('div')) // 'htmlcollection'
 * type(document.getElementsByTagName('div')[0]) // 'htmldivelement'
 */

function type (item) {
	return Object.prototype.toString
		.call(item)
		.toLowerCase()
		.replace(/^\[object\s*|\]$/gi, '');
}

module.exports = type;
