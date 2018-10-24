/**
 * # 处理地址字符串
 * @name spore-kit-location
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.location.getQuery);
 *
 * // 单独引入 spore-kit-location
 * var $location = require('spore-kit-location');
 * console.info($location.getQuery);
 *
 * // 单独引入一个方法
 * var $getQuery = require('spore-kit-location/getQuery');
 */

exports.getQuery = require('./getQuery');
exports.setQuery = require('./setQuery');
exports.parse = require('./parse');
