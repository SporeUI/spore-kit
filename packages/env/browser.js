/**
 * 检测浏览器类型
 *
 * 支持的类型检测
 * - qq
 * - uc
 * - baidu
 * - miui
 * - weixin
 * - qzone
 * - qqnews
 * - qqhouse
 * - qqbrowser
 * - chrome
 * @method browser
 * @returns {Object} UA 检查结果
 * @example
 * var $browser = require('spore-kit/packages/env/browser');
 * console.info($browser().chrome);
 * console.info($browser.detect());
 */
var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	qq: (/qq\/([\d.]+)/i),
	uc: (/ucbrowser/i),
	baidu: (/baidubrowser/i),
	miui: (/miuibrowser/i),
	weixin: (/micromessenger/i),
	qzone: (/qzone\//i),
	qqnews: (/qqnews\/([\d.]+)/i),
	qqhouse: (/qqhouse/i),
	qqbrowser: (/qqbrowser/i),
	chrome: (/chrome/i)
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function envBrowser() {
	if (!result) {
		result = detect();
	}
	return result;
}

envBrowser.detect = detect;

module.exports = envBrowser;
