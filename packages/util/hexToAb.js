/**
 * 16进制字符串转ArrayBuffer
 * @method hexToAb
 * @param {String} str 需要转换的16进制字符串
 * @returns {ArrayBuffer} 被转换后的 ArrayBuffer 对象
 */

function hexToAb(str) {
	if (!str) {
		return new ArrayBuffer(0);
	}
	var buffer = new ArrayBuffer(Math.ceil(str.length / 2));
	var dataView = new DataView(buffer);
	var index = 0;
	var i;
	var len = str.length;
	for (i = 0; i < len; i += 2) {
		var code = parseInt(str.substr(i, 2), 16);
		dataView.setUint8(index, code);
		index++;
	}
	return buffer;
}

module.exports = hexToAb;
