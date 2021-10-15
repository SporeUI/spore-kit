/**
 * 提供对 cookie 的读写能力
 * - 此模块直接提供 js-cookie 的原生能力，不做任何自动编解码
 * @module origin
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * var $cookie = require('spore-kit/packages/cookie/origin');
 * $cookie.set('name', 'value', {
 *   expires: 1
 * });
 * $cookie.read('name') // 'value'
 */
module.exports = require('js-cookie');
