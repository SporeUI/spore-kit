/**
 * 检测设备类型
 * console.info(device().huawei);
 */
var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	huawei: (/huawei/i),
	oppo: (/oppo/i),
	vivo: (/vivo/i),
	xiaomi: (/xiaomi/i),
	samsong: (/sm-/i),
	iphone: (/iphone/i)
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function device() {
	if (!result) {
		result = detect();
	}
	return result;
}

device.detect = detect;

module.exports = device;
