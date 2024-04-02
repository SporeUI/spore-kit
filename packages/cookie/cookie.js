/**
 * 提供对 cookie 的读写能力
 * - 写入时自动用 encodeURIComponent 编码
 * - 读取时自动用 decodeURIComponent 解码
 * @module cookie/cookie
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * var $cookie = require('@spore-ui/kit/packages/cookie/cookie');
 * $cookie.set('name', '中文', {
 *   expires: 1
 * });
 * $cookie.read('name') // '中文'
 */

var Cookie = require('js-cookie');

var instance = Cookie;

if (Cookie.withConverter) {
  instance = Cookie.withConverter({
    read: function (val) {
      return decodeURIComponent(val);
    },
    write: function (val) {
      return encodeURIComponent(val);
    },
  });
}

module.exports = instance;
