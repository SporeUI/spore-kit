/**
 * 对象处理与判断
 * @module @spore-ui/kit/packages/obj
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/obj
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.obj.type);
 *
 * // 单独引入 @spore-ui/kit/packages/obj
 * var $obj = require('@spore-ui/kit/packages/obj');
 * console.info($obj.type);
 *
 * // 单独引入一个方法
 * var $type = require('@spore-ui/kit/packages/obj/type');
 */

exports.assign = require('./assign');
exports.cover = require('./cover');
exports.find = require('./find');
exports.type = require('./type');
