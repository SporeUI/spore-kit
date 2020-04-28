var $assign = require('lodash/assign');
var $get = require('lodash/get');
var $getScript = require('./getScript');

var propName = 'SPORE_SDK_PROMISE';
var cache = window[propName];
if (!cache) {
	cache = {};
	window[propName] = cache;
}

/**
 * # sdk 加载统一封装
 * - 多次调用不会发起重复请求
 * @param {Object} options 选项
 * @param {String} options.name sdk 全局变量名称
 * @param {String} options.url script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 * loadSdk({
 * 	name: 'TencentCaptcha',
 * 	url: 'https://ssl.captcha.qq.com/TCaptcha.js'
 * }).then(TencentCaptcha => {})
 */
var loadSdk = function (options) {
	var conf = $assign({
		name: '',
		url: '',
		charset: 'utf-8'
	}, options);

	var name = conf.name;
	if (!name) {
		return Promise.reject(new Error('Require parameter: options.name'));
	}
	if (!conf.url) {
		return Promise.reject(new Error('Require parameter: options.url'));
	}

	var pm = cache[name];
	if (pm) {
		if (pm.sdk) {
			return Promise.resolve(pm.sdk);
		}
		return pm;
	}

	pm = new Promise(function (resolve) {
		$getScript({
			src: conf.url,
			charset: conf.charset,
			onLoad: function () {
				var sdk = $get(window, name);
				pm.sdk = sdk;
				resolve(sdk);
			}
		});
	});
	cache[name] = pm;

	return pm;
};

module.exports = loadSdk;
