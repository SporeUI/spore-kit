/**
 * 时间处理与交互工具
 * @module spore-kit/packages/time
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/time
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.time.parseUnit);
 *
 * // 单独引入 spore-kit/packages/time
 * var $time = require('@spore-ui/kit/packages/time');
 * console.info($time.parseUnit);
 *
 * // 单独引入一个方法
 * var $parseUnit = require('@spore-ui/kit/packages/time/parseUnit');
 */

exports.countDown = require('./countDown');
exports.parseUnit = require('./parseUnit');
