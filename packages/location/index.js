/**
 * # 处理地址字符串
 * @module spore-kit-location
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/location
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
