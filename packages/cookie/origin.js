/**
 * 提供对 cookie 的读写能力
 * - 此模块直接提供 js-cookie 的原生能力，不做任何自动编解码
 * @module origin
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * origin.set('name', 'value', {
 * 	expires: 1
 * });
 * origin.read('name')	//value
 */
module.exports = require('js-cookie');
