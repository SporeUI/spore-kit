/**
 * # 动画交互相关工具
 * @name spore-kit-fx
 * @module
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fx.smoothScrollTo);
 *
 * // 单独引入 spore-kit-fx
 * var $fx = require('spore-kit-fx');
 * console.info($fx.smoothScrollTo);
 *
 * // 单独引入一个方法
 * var $smoothScrollTo = require('spore-kit-fx/smoothScrollTo');
 */

exports.flashAction = require('./flashAction');
exports.fx = require('./fx');
exports.smoothScrollTo = require('./smoothScrollTo');
exports.sticky = require('./sticky');
exports.timer = require('./timer');
exports.transitions = require('./transitions');
