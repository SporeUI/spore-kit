/**
 * 编码HTML，将HTML字符转为实体字符
 * @module
 * @param {string} str 含有HTML字符的字符串
 * @return {string} 经过转换的字符串
 * @example
 * encodeHTML('&<>" ');  //return '&amp;&lt;&gt;&quot;$nbsp;'
 */

function encodeHTML(str) {
	if (typeof str !== 'string') {
		throw new Error('encodeHTML need a string as parameter');
	}
	return str.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#39;')
		.replace(/\u00A0/g, '&nbsp;')
		.replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g, '&#32;');
}

module.exports = encodeHTML;
