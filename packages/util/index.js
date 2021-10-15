/**
 * 其他工具函数
 * @module spore-kit/packages/util
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/util
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.util.hslToRgb);
 *
 * // 单独引入 spore-kit/packages/util
 * var $util = require('spore-kit/packages/util');
 * console.info($util.hslToRgb);
 *
 * // 单独引入一个方法
 * var $hslToRgb = require('spore-kit/packages/util/hslToRgb');
 */

exports.abToHex = require('./abToHex');
exports.ascToHex = require('./ascToHex');
exports.hexToAb = require('./hexToAb');
exports.hexToAsc = require('./hexToAsc');
exports.hslToRgb = require('./hslToRgb');
exports.job = require('./job');
exports.measureDistance = require('./measureDistance');
exports.rgbToHsl = require('./rgbToHsl');
