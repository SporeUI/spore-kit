/**
 * # 类数组对象相关工具函数
 * @name spore-kit-arr
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.arr.contains); //function
 *
 * // 单独引入 spore-kit-arr
 * var $arr = require('spore-kit-arr');
 * console.info($arr.contains); //function
 *
 * // 单独引入一个方法
 * var $contains = require('spore-kit-arr/contains');
 */

exports.contains = require('./contains');
exports.erase = require('./erase');
exports.find = require('./find');
exports.flatten = require('./flatten');
exports.include = require('./include');
