/**
 * 比较版本号
 * @method util/compareVersion
 * @param {String} v1 版本号1
 * @param {String} v2 版本号2
 * @returns {Object} info 版本号比较信息
 * @returns {Object} info.level 版本号差异所在级别
 * @returns {Object} info.delta 版本号差异数值
 * @example
 * var $compareVersion = require('@spore-ui/kit/packages/util/compareVersion');
 * // delta 取值可以理解为 前面的值 减去 后面的值
 * var info1 = $compareVersion('1.0.1', '1.2.2');
 * // {level: 1, delta: -2}
 * var info2 = $compareVersion('1.3.1', '1.2.2');
 * // {level: 1, delta: 1}
 */

function compareVersion(v1, v2) {
  var arrV1 = v1.split('.');
  var arrV2 = v2.split('.');
  var maxLength = Math.max(arrV1.length, arrV2.length);
  var index = 0;
  var delta = 0;

  for (index = 0; index < maxLength; index += 1) {
    var pv1 = parseInt(arrV1[index], 10) || 0;
    var pv2 = parseInt(arrV2[index], 10) || 0;
    delta = pv1 - pv2;
    if (delta !== 0) {
      break;
    }
  }

  if (!v1 && !v2) {
    index = 0;
  }

  return {
    level: index,
    delta,
  };
}

module.exports = compareVersion;
