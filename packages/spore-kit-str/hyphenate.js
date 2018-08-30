/**
 * 将驼峰格式变为连字符格式
 * @module
 * @param {string} str 驼峰格式的字符串
 * @return {string} 连字符格式的字符串
 * @example
 * hyphenate('libKitStrHyphenate'); //return 'lib-kit-str-hyphenate'
 */

function hyphenate(str) {
	return str.replace(/[A-Z]/g, function ($0) {
		return '-' + $0.toLowerCase();
	});
}

module.exports = hyphenate;
