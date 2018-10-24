/**
 * # 处理事件与广播
 * @name spore-kit-evt
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.evt.occurInside);
 *
 * // 单独引入 spore-kit-evt
 * var $evt = require('spore-kit-evt');
 * console.info($evt.occurInside);
 *
 * // 单独引入一个方法
 * var $occurInside = require('spore-kit-evt/occurInside');
 */

exports.events = require('./events');
exports.listener = require('./listener');
exports.occurInside = require('./occurInside');
exports.tapStop = require('./tapStop');
