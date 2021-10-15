/**
 * 处理与客户端相关的交互
 * @module spore-kit/packages/app
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/app
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.app.callUp);
 *
 * // 单独引入 spore-kit/packages/app
 * var $app = require('spore-kit/packages/app');
 * console.info($app.callUp);
 *
 * // 单独引入一个方法
 * var $callUp = require('spore-kit/packages/app/callUp');
 */

exports.callUp = require('./callUp');
