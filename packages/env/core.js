/**
 * 检测浏览器核心
 * console.info(core().webkit);
 */

var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	trident: 'trident',
	presto: 'presto',
	webkit: 'webkit',
	gecko: function(ua) {
		return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
	}
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function core() {
	if (!result) {
		result = detect();
		result.detect = detect;
	}
	return result;
}

module.exports = core;
