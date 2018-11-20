/**
 * ArrayBuffer转16进制字符串
 * @method abToHex
 * @param {ArrayBuffer} buffer 需要转换的 ArrayBuffer
 * @returns {String} 16进制字符串
 */

function abToHex (buffer) {
	if (Object.prototype.toString.call(buffer) !== '[object ArrayBuffer]') {
		return '';
	}
	return Array.prototype.map.call(
		new Uint8Array(buffer),
		bit => ('00' + bit.toString(16)).slice(-2)
	).join('');
}

module.exports = abToHex;
