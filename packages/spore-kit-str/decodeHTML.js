/**
 * 解码HTML，将实体字符转换为HTML字符
 * @module
 * @param {string} str 含有实体字符标记的字符串
 * @return {string} HTML字符串
 * @example
 * $decodeHTML('&amp;&lt;&gt;$nbsp;&quot;');  //return '&<> "'
 */

module.exports = function(str) {
	if (typeof str !== 'string') {
		throw new Error('decodeHTML need a string as parameter');
	}
	return str.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#39;/g, '\'')
		.replace(/&nbsp;/g, '\u00A0')
		.replace(/&#32;/g, '\u0020')
		.replace(/&amp;/g, '&');
};

