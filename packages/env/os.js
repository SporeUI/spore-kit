/**
 * 检测操作系统类型
 * console.info(os().ios);
 */
var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	ios: /like mac os x/i,
	android: function(ua) {
		return ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
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

function os() {
	if (!result) {
		result = detect();
		result.detect = detect;
	}
	return result;
}

module.exports = os;
