/**
 * 十进制IP地址转十六进制
 * @module
 * @param {string} ip 十进制数字的IPV4地址
 * @return {string} 16进制数字IPV4地址
 * @example
 * ipToHex('255.255.255.255'); //return 'ffffffff'
 */

function ipToHex(ip) {
	return ip.replace(/(\d+)\.*/g, function (match, num) {
		num = parseInt(num, 10) || 0;
		num = num.toString(16);
		if (num.length < 2) {
			num = '0' + num;
		}
		return num;
	});
}

module.exports = ipToHex;
