/**
 * 其他工具函数
 * @module spore-ui/kit/packages/util
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/util
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.util.hslToRgb);
 *
 * // 单独引入 @spore-ui/kit/packages/util
 * var $util = require('@spore-ui/kit/packages/util');
 * console.info($util.hslToRgb);
 *
 * // 单独引入一个方法
 * var $hslToRgb = require('@spore-ui/kit/packages/util/hslToRgb');
 */

exports.abToHex = require('./abToHex');
exports.ascToHex = require('./ascToHex');
exports.compareVersion = require('./compareVersion');
exports.hexToAb = require('./hexToAb');
exports.hexToAsc = require('./hexToAsc');
exports.hslToRgb = require('./hslToRgb');
exports.job = require('./job');
exports.measureDistance = require('./measureDistance');
exports.parseRGB = require('./parseRGB');
exports.rgbToHsl = require('./rgbToHsl');
