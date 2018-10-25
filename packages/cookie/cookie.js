/**
 * 提供对 cookie 的读写能力
 * - 写入时自动用 encodeURIComponent 编码
 * - 读取时自动用 decodeURIComponent 解码
 * @module cookie
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * cookie.set('name', 'value', {
 * 	expires: 1
 * });
 * cookie.read('name')	// 'value'
 */

var Cookie = require('js-cookie');

var instance = Cookie.withConverter({
	read: function(val) {
		return decodeURIComponent(val);
	},
	write: function(val) {
		return encodeURIComponent(val);
	}
});

module.exports = instance;
