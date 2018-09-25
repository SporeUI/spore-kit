/**
 * 解析 location.search 为一个JSON对象
 *
 * 或者获取其中某个参数
 * @module
 * @param {string} url URL字符串
 * @return {object|string} query对象 | 参数值
 * @example
 * var url = 'http://localhost/profile?beijing=huanyingni';
 * console.info( getQuery(url) );
 * //	{beijing : 'huanyingni'}
 * console.info( getQuery(url, 'beijing') );
 * //	'huanyingni'
 */

var cache = {};

function getQuery(url, name) {
	var query = cache[url] || {};

	if (url) {
		var searchIndex = url.indexOf('?');
		if (searchIndex >= 0) {
			var search = url.slice(searchIndex + 1, url.length);
			search = search.replace(/#.*/, '');

			var params = search.split('&');
			params.forEach(function(group) {
				var equalIndex = group.indexOf('=');
				if (equalIndex > 0) {
					var key = group.slice(0, equalIndex);
					var value = group.slice(equalIndex + 1, group.length);
					query[key] = value;
				}
			});
		}
		cache[url] = query;
	}

	if (!name) {
		return query;
	} else {
		return query[name] || '';
	}
}

module.exports = getQuery;
