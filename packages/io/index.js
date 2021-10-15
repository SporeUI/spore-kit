/**
 * # 处理网络交互
 * @module spore-kit/packages/io
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/io
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.io.getScript);
 *
 * // 单独引入 spore-kit/packages/io
 * var $io = require('spore-kit/packages/io');
 * console.info($io.getScript);
 *
 * // 单独引入一个方法
 * var $getScript = require('spore-kit/packages/io/getScript');
 */

exports.ajax = require('./ajax');
exports.getScript = require('./getScript');
exports.iframePost = require('./iframePost');
exports.loadSdk = require('./loadSdk');
