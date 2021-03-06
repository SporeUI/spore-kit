/**
 * # 本地存储相关工具函数
 * @module spore-kit-cookie
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/cookie
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.cookie.cookie);
 *
 * // 单独引入 spore-kit-cookie
 * var $cookie = require('spore-kit-cookie');
 * console.info($cookie.cookie);
 *
 * // 单独引入一个工具对象
 * var $cookie = require('spore-kit-cookie/cookie');
 */

exports.cookie = require('./cookie');
exports.origin = require('./origin');
