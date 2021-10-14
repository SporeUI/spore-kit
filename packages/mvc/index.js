/**
 * # 兼容 IE8 的 MVC 简单实现
 * @module spore-kit-mvc
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/mvc
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.mvc.Model);
 *
 * // 单独引入 spore-kit-mvc
 * var $mvc = require('spore-kit-mvc');
 * console.info($mvc.Model);
 *
 * // 单独引入一个组件
 * var $Model = require('spore-kit-mvc/Model');
 */

exports.klass = require('./klass');
exports.delegate = require('./delegate');
exports.proxy = require('./proxy');
exports.Base = require('./base');
exports.Model = require('./model');
exports.View = require('./view');
