/**
 * # 函数包装，获取特殊执行方式
 * @name spore-kit-fn
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fn.delay);
 *
 * // 单独引入 spore-kit-fn
 * var $fn = require('spore-kit-fn');
 * console.info($fn.delay);
 *
 * // 单独引入一个方法
 * var $delay = require('spore-kit-fn/delay');
 */

exports.delay = require('./delay');
exports.lock = require('./lock');
exports.once = require('./once');
exports.queue = require('./queue');
exports.prepare = require('./prepare');
exports.regular = require('./regular');
