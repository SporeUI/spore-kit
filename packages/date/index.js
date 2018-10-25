/**
 * # 日期相关工具
 * @name spore-kit-date
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.date.format);
 *
 * // 单独引入 spore-kit-date
 * var $date = require('spore-kit-date');
 * console.info($date.format);
 *
 * // 单独引入一个方法
 * var $format = require('spore-kit-date/format');
 */

exports.format = require('./format');
exports.getLastStart = require('./getLastStart');
exports.getTimeSplit = require('./getTimeSplit');
