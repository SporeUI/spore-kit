/**
 * 检测浏览器核心
 *
 * 支持的类型检测
 * - trident
 * - presto
 * - webkit
 * - gecko
 * @method core
 * @returns {Object} UA 检查结果
 * @example
 * var $core = require('spore-kit/packages/env/core');
 * console.info($core().webkit);
 * console.info($core.detect());
 */

var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
  trident: (/trident/i),
  presto: (/presto/i),
  webkit: (/webkit/i),
  gecko: function (ua) {
    return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
  },
};

function detect(options, checkers) {
  var conf = $assign({
    ua: '',
  }, options);

  $assign(testers, checkers);

  return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function core() {
  if (!result) {
    result = detect();
  }
  return result;
}

core.detect = detect;

module.exports = core;
