/**
 * 处理地址字符串
 * @module spore-ui/kit/packages/location
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/location
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.location.getQuery);
 *
 * // 单独引入 @spore-ui/kit/packages/location
 * var $location = require('@spore-ui/kit/packages/location');
 * console.info($location.getQuery);
 *
 * // 单独引入一个方法
 * var $getQuery = require('@spore-ui/kit/packages/location/getQuery');
 */

exports.getQuery = require('./getQuery');
exports.setQuery = require('./setQuery');
exports.parse = require('./parse');
