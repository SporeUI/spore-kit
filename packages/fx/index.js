/**
 * 动画交互相关工具
 * @module spore-kit/packages/fx
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fx
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fx.smoothScrollTo);
 *
 * // 单独引入 spore-kit/packages/fx
 * var $fx = require('spore-kit/packages/fx');
 * console.info($fx.smoothScrollTo);
 *
 * // 单独引入一个方法
 * var $smoothScrollTo = require('spore-kit/packages/fx/smoothScrollTo');
 */

exports.easing = require('./easing');
exports.flashAction = require('./flashAction');
exports.Fx = require('./fx');
exports.smoothScrollTo = require('./smoothScrollTo');
exports.sticky = require('./sticky');
exports.timer = require('./timer');
exports.transitions = require('./transitions');
