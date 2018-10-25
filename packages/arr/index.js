/**
 * # 类数组对象相关工具函数
 * @module spore-kit-arr
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/arr
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.arr.contains);
 *
 * // 单独引入 spore-kit-arr
 * var $arr = require('spore-kit-arr');
 * console.info($arr.contains);
 *
 * // 单独引入一个方法
 * var $contains = require('spore-kit-arr/contains');
 */

exports.contains = require('./contains');
exports.erase = require('./erase');
exports.find = require('./find');
exports.flatten = require('./flatten');
exports.include = require('./include');
