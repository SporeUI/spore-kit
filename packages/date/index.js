/**
 * 日期相关工具
 * @module spore-ui/kit/packages/date
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/date
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.date.format);
 *
 * // 单独引入 @spore-ui/kit/packages/date
 * var $date = require('@spore-ui/kit/packages/date');
 * console.info($date.format);
 *
 * // 单独引入一个方法
 * var $format = require('@spore-ui/kit/packages/date/format');
 */

exports.format = require('./format');
exports.getLastStart = require('./getLastStart');
exports.getTimeSplit = require('./getTimeSplit');
