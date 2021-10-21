/**
 * 处理事件与广播
 * @module spore-kit/packages/evt
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/evt
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.evt.occurInside);
 *
 * // 单独引入 spore-kit/packages/evt
 * var $evt = require('@spore-ui/kit/packages/evt');
 * console.info($evt.occurInside);
 *
 * // 单独引入一个方法
 * var $occurInside = require('@spore-ui/kit/packages/evt/occurInside');
 */

exports.Events = require('./events');
exports.Listener = require('./listener');
exports.occurInside = require('./occurInside');
exports.tapStop = require('./tapStop');
