/**
 * 16进制字符串转ASCII字符串
 * @method hexToAsc
 * @param {String} str 需要转换的16进制字符串
 * @returns {String} ASCII字符串
 * @example
 * var $hexToAsc = require('spore-kit/packages/util/hexToAsc');
 * $hexToAsc(); // => ''
 * $hexToAsc('2a2b'); // => '*+'
 */

function hexToAsc(hex) {
	if (!hex) {
		return '';
	}
	return hex.replace(/[\da-f]{2}/gi, function(match) {
		var int = parseInt(match, 16);
		return String.fromCharCode(int);
	});
}

module.exports = hexToAsc;
