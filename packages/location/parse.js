/**
 * 解析URL为一个对象
 * @method parse
 * @param {String} str URL字符串
 * @returns {Object} URL对象
 * @see https://github.com/unshiftio/url-parse
 * @example
 * parse('http://localhost/profile?beijing=huanyingni#123')
 * {
 *   slashes: true,
 *   protocol: 'http:',
 *   hash: '#123',
 *   query: '?beijing=huanyingni',
 *   pathname: '/profile',
 *   auth: 'username:password',
 *   host: 'localhost:8080',
 *   port: '8080',
 *   hostname: 'localhost',
 *   password: 'password',
 *   username: 'username',
 *   origin: 'http://localhost:8080',
 *   href: 'http://username:password@localhost:8080/profile?beijing=huanyingni#123'
 * }
 */

var Url = require('url-parse');

function parse (url) {
	return new Url(url);
}

module.exports = parse;
