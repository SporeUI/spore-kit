/**
 * DOM 操作相关工具函数
 * @module spore-ui/kit/packages/dom
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/dom
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.dom.isNode);
 *
 * // 单独引入 @spore-ui/kit/packages/dom
 * var $dom = require('@spore-ui/kit/packages/dom');
 * console.info($dom.isNode);
 *
 * // 单独引入一个方法
 * var $isNode = require('@spore-ui/kit/packages/dom/isNode');
 */

exports.isNode = require('./isNode');
exports.offset = require('./offset');
exports.scrollLimit = require('./scrollLimit');
