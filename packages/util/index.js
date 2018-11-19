/**
 * # 其他工具函数
 * @module spore-kit-util
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/util
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.util.hslToRgb);
 *
 * // 单独引入 spore-kit-util
 * var $util = require('spore-kit-util');
 * console.info($util.hslToRgb);
 *
 * // 单独引入一个方法
 * var $hslToRgb = require('spore-kit-util/hslToRgb');
 */

exports.hslToRgb = require('./hslToRgb');
exports.rgbToHsl = require('./rgbToHsl');
