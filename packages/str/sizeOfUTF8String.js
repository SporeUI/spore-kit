/**
 * 取字符串 utf8 编码长度，from 王集鹄
 * @method sizeOfUTF8String
 * @param {String} str
 * @returns {Number} 字符串长度
 * @example
 * sizeOfUTF8String('中文cc'); //return 8
*/

function sizeOfUTF8String (str) {
	return (
		typeof unescape !== 'undefined'
			? unescape(encodeURIComponent(str)).length
			: new ArrayBuffer(str, 'utf8').length
	);
}

module.exports = sizeOfUTF8String;
