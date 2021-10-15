/**
 * 将参数设置到 location.search 上
 * @method setQuery
 * @param {String} url URL字符串
 * @param {Object} query 参数对象
 * @returns {String} 拼接好参数的URL字符串
 * @example
 * var $setQuery = require('spore-kit/packages/location/setQuery');
 * $setQuery('localhost'); // 'localhost'
 * $setQuery('localhost', {a: 1}); // 'localhost?a=1'
 * $setQuery('', {a: 1}); // '?a=1'
 * $setQuery('localhost?a=1', {a: 2}); // 'localhost?a=2'
 * $setQuery('localhost?a=1', {a: ''}); // 'localhost?a='
 * $setQuery('localhost?a=1', {a: null}); // 'localhost'
 * $setQuery('localhost?a=1', {b: 2}); // 'localhost?a=1&b=2'
 * $setQuery('localhost?a=1&b=1', {a: 2, b: 3}); // 'localhost?a=2&b=3'
 * $setQuery('localhost#a=1', {a: 2, b: 3}); // 'localhost?a=2&b=3#a=1'
 * $setQuery('#a=1', {a: 2, b: 3}); // '?a=2&b=3#a=1'
 */

function setQuery (url, query) {
	url = url || '';
	if (!query) { return url; }

	var reg = /([^?#]*)(\?{0,1}[^?#]*)(#{0,1}.*)/;
	return url.replace(reg, function(match, path, search, hash) {
		search = search || '';
		search = search.replace(/^\?/, '');

		var para = search.split('&').reduce(function(obj, pair) {
			var arr = pair.split('=');
			if (arr[0]) {
				obj[arr[0]] = arr[1];
			}
			return obj;
		}, {});

		Object.keys(query).forEach(function(key) {
			var value = query[key];
			if (value === null || typeof value === 'undefined') {
				delete para[key];
			} else {
				para[key] = value;
			}
		});

		var paraKeys = Object.keys(para);
		if (!paraKeys.length) {
			search = '';
		} else {
			search = '?' + paraKeys.map(function(key) {
				return key + '=' + para[key];
			}).join('&');
		}

		return path + search + hash;
	});
}

module.exports = setQuery;
