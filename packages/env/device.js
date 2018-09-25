/**
 * 检测设备类型
 * console.info(device.huawei);
 */
var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	huawei: (/che1-cl20/i)
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var device = detect();

device.detect = detect;

module.exports = device;
