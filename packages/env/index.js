/**
 * # 环境检测与判断工具
 * @name spore-kit-env
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.env.touchable);
 *
 * // 单独引入 spore-kit-env
 * var $env = require('spore-kit-env');
 * console.info($env.touchable);
 *
 * // 单独引入一个方法
 * var $touchable = require('spore-kit-env/touchable');
 */

exports.browser = require('./browser');
exports.core = require('./core');
exports.device = require('./device');
exports.network = require('./network');
exports.os = require('./os');
exports.touchable = require('./touchable');
exports.uaMatch = require('./uaMatch');
exports.webp = require('./webp');
