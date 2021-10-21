/**
 * 环境检测与判断工具
 * @module @spore-ui/kit/packages/env
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/env
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.env.touchable);
 *
 * // 单独引入 @spore-ui/kit/packages/env
 * var $env = require('@spore-ui/kit/packages/env');
 * console.info($env.touchable);
 *
 * // 单独引入一个方法
 * var $touchable = require('@spore-ui/kit/packages/env/touchable');
 */

exports.browser = require('./browser');
exports.core = require('./core');
exports.device = require('./device');
exports.network = require('./network');
exports.os = require('./os');
exports.touchable = require('./touchable');
exports.uaMatch = require('./uaMatch');
exports.webp = require('./webp');
