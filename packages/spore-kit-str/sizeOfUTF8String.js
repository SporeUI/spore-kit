/**
 * 取字符串 utf8 编码长度，from 王集鹄
 * @module
 * @param {String} str
 * @return {number} 字符串长度
 * @example
 * $sizeOfUTF8String('中文cc');  //return 8
*/

module.exports = function(str) {
	return (
		typeof unescape !== undefined
			? unescape(encodeURIComponent(str)).length
			: new ArrayBuffer(str, 'utf8').length
	);
};
