/**
 * 检测浏览器类型
 * console.info(browser().chrome);
 */
var $assign = require('spore-kit-obj/assign');
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

function browser() {
	if (!result) {
		result = detect();
	}
	return result;
}

browser.detect = detect;

module.exports = browser;
