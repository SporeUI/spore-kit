/**
 * 本地存储相关工具函数
 * @module spore-kit/packages/cookie
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/cookie
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.cookie.cookie);
 *
 * // 单独引入 spore-kit/packages/cookie
 * var $cookie = require('@spore-ui/kit/packages/cookie');
 * console.info($cookie.cookie);
 *
 * // 单独引入一个工具对象
 * var $cookie = require('@spore-ui/kit/packages/cookie/cookie');
 */

exports.cookie = require('./cookie');
exports.origin = require('./origin');
