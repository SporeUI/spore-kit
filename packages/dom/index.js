/**
 * # DOM 操作相关工具函数
 * @module spore-kit-dom
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/dom
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.dom.isNode);
 *
 * // 单独引入 spore-kit-dom
 * var $dom = require('spore-kit-dom');
 * console.info($dom.isNode);
 *
 * // 单独引入一个方法
 * var $isNode = require('spore-kit-dom/isNode');
 */

exports.isNode = require('./isNode');
exports.offset = require('./offset');
