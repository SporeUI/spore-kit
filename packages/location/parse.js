/**
 * 解析URL为一个JSON对象
 * @module
 * @param {string} str URL字符串
 * @return {object} JSON对象
 * @example
 * console.info( parse('http://t.sina.com.cn/profile?beijing=huanyingni') );
 * //	{
 * //		hash : ''
 * //		host : 't.sina.com.cn'
 * //		path : 'profile'
 * //		port : ''
 * //		query : 'beijing=huanyingni'
 * //		scheme : http
 * //		slash : '//'
 * //		url : 'http://t.sina.com.cn/profile?beijing=huanyingni'
 * //	}
 */

function parse(url) {
	var regUrlParse = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
	var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
	var results = regUrlParse.exec(url);
	var that = {};
	if (results) {
		for (var i = 0, len = names.length; i < len; i += 1) {
			that[names[i]] = results[i] || '';
		}
	}
	return that;
}

module.exports = parse;
