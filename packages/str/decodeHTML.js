/**
 * 解码HTML，将实体字符转换为HTML字符
 * @method decodeHTML
 * @param {String} str 含有实体字符的字符串
 * @returns {String} HTML字符串
 * @example
 * var $decodeHTML = require('spore-kit/packages/str/decodeHTML');
 * $decodeHTML('&amp;&lt;&gt;&quot;&#39;&#32;'); // '&<>"\' '
 */

function decodeHTML (str) {
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
}

module.exports = decodeHTML;
