/**
 * # 时间处理与交互工具
 * @name spore-kit-time
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.time.parseUnit);
 *
 * // 单独引入 spore-kit-time
 * var $time = require('spore-kit-time');
 * console.info($time.parseUnit);
 *
 * // 单独引入一个方法
 * var $parseUnit = require('spore-kit-time/parseUnit');
 */

exports.countDown = require('./countDown');
exports.parseUnit = require('./parseUnit');
