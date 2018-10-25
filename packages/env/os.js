/**
 * 检测操作系统类型
 *
 * 支持的类型检测
 * - ios
 * - android
 * @method os
 * @returns {Object} UA 检查结果
 * @example
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
	}
	return result;
}

os.detect = detect;

module.exports = os;
