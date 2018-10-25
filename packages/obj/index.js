/**
 * # 对象处理与判断
 * @module spore-kit-obj
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/obj
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.obj.type);
 *
 * // 单独引入 spore-kit-obj
 * var $obj = require('spore-kit-obj');
 * console.info($obj.type);
 *
 * // 单独引入一个方法
 * var $type = require('spore-kit-obj/type');
 */

exports.assign = require('./assign');
exports.cover = require('./cover');
exports.find = require('./find');
exports.type = require('./type');
