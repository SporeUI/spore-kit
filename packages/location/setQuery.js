/**
 * 将参数设置到 location.search 上
 * @module
 * @param {string} url URL字符串
 * @param {object} query 参数对象
 * @return {string} 拼接好参数的URL字符串
 * @example
 * 	console.assert(
 * 		setQuery('localhost', {a: 1}),
 * 		'localhost?a=1'
 * 	);
 *
 * 	var table = [
 * 		{
 * 			url: 'localhost',
 * 			result: 'localhost'
 * 		},
 * 		{
 * 			url: '',
 * 			query: {a: 1},
 * 			result: '?a=1'
 * 		},
 * 		{
 * 			url: 'localhost',
 * 			query: {a: 1},
 * 			result: 'localhost?a=1'
 * 		},
 * 		{
 * 			url: 'localhost?a=1',
 * 			query: {a: 2},
 * 			result: 'localhost?a=2'
 * 		},
 * 		{
 * 			url: 'localhost?a=1',
 * 			query: {a: ''},
 * 			result: 'localhost?a='
 * 		},
 * 		{
 * 			url: 'localhost?a=1',
 * 			query: {a: null},
 * 			result: 'localhost'
 * 		},
 * 		{
 * 			url: 'localhost?a=1',
 * 			query: {b: 2},
 * 			result: 'localhost?a=1&b=2'
 * 		},
 * 		{
 * 			url: 'localhost?a=1&b=1',
 * 			query: {a: 2, b: 3},
 * 			result: 'localhost?a=2&b=3'
 * 		},
 * 		{
 * 			url: 'localhost#a=1',
 * 			query: {a: 2, b: 3},
 * 			result: 'localhost?a=2&b=3#a=1'
 * 		},
 * 		{
 * 			url: '#a=1',
 * 			query: {a: 2, b: 3},
 * 			result: '?a=2&b=3#a=1'
 * 		}
 * 	].map(function(item){
 * 		var result = setQuery(item.url, item.query);
 * 		return {
 * 			url: item.url,
 * 			query: item.query ? JSON.stringify(item.query) : item.query,
 * 			'should': item.result,
 * 			actual: result,
 * 			assert: result === item.result
 * 		};
 * 	});
 * 	console.table(table);
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
