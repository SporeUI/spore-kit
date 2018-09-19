/**
 * 加载script
 * @param {object} options script选项
 * @param {string} options.src script地址
 * @param {string} [options.charset='utf-8'] script编码
 * @param {function} [options.onLoad] script加载完成的回调函数
 */

function getScript(options) {
	options = options || {};

	var src = options.src || '';
	var charset = options.charset || '';
	var onLoad = options.onLoad || function() {};

	var script = document.createElement('script');
	script.async = 'async';
	script.src = src;

	if (charset) {
		script.charset = charset;
	}
	script.onreadystatechange = function() {
		if (
			!this.readyState
			|| this.readyState === 'loaded'
			|| this.readyState === 'complete'
		) {
			if (typeof onLoad === 'function') {
				onLoad();
			}
			this.onload = null;
			this.onreadystatechange = null;
			this.parentNode.removeChild(this);
		}
	};
	script.onload = script.onreadystatechange;
	document.getElementsByTagName('head')[0].appendChild(script);
	return script;
}

module.exports = getScript;
