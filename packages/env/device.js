/**
 * 检测设备类型
 *
 * 支持的类型检测
 * - huawei
 * - oppo
 * - vivo
 * - xiaomi
 * - samsong
 * - iphone
 * @method device
 * @returns {Object} UA 检查结果
 * @example
 * var $device = require('spore-kit/packages/env/device');
 * console.info($device().huawei);
 * console.info($device.detect());
 */
var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
  huawei: (/huawei/i),
  oppo: (/oppo/i),
  vivo: (/vivo/i),
  xiaomi: (/xiaomi/i),
  samsong: (/sm-/i),
  iphone: (/iphone/i),
};

function detect(options, checkers) {
  var conf = $assign({
    ua: '',
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
