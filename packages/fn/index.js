/**
 * 函数包装，获取特殊执行方式
 * @module spore-ui/kit/packages/fn
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fn
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.fn.delay);
 *
 * // 单独引入 @spore-ui/kit/packages/fn
 * var $fn = require('@spore-ui/kit/packages/fn');
 * console.info($fn.delay);
 *
 * // 单独引入一个方法
 * var $delay = require('@spore-ui/kit/packages/fn/delay');
 */

exports.delay = require('./delay');
exports.lock = require('./lock');
exports.noop = require('./noop');
exports.once = require('./once');
exports.queue = require('./queue');
exports.prepare = require('./prepare');
exports.regular = require('./regular');
