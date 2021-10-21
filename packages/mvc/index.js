/**
 * 兼容 IE8 的 MVC 简单实现
 * @module spore-ui/kit/packages/mvc
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/mvc
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.mvc.Model);
 *
 * // 单独引入 @spore-ui/kit/packages/mvc
 * var $mvc = require('@spore-ui/kit/packages/mvc');
 * console.info($mvc.Model);
 *
 * // 单独引入一个组件
 * var $model = require('@spore-ui/kit/packages/mvc/model');
 */

exports.klass = require('./klass');
exports.delegate = require('./delegate');
exports.proxy = require('./proxy');
exports.Base = require('./base');
exports.Model = require('./model');
exports.View = require('./view');
