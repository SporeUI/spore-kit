/**
 * 字符串处理与判断
 * @module spore-ui/kit/packages/str
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/str
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.str.substitute);
 *
 * // 单独引入 @spore-ui/kit/packages/str
 * var $str = require('@spore-ui/kit/packages/str');
 * console.info($str.substitute);
 *
 * // 单独引入一个方法
 * var $substitute = require('@spore-ui/kit/packages/str/substitute');
 */

exports.bLength = require('./bLength');
exports.dbcToSbc = require('./dbcToSbc');
exports.decodeHTML = require('./decodeHTML');
exports.encodeHTML = require('./encodeHTML');
exports.getRnd36 = require('./getRnd36');
exports.getTime36 = require('./getTime36');
exports.getUniqueKey = require('./getUniqueKey');
exports.hyphenate = require('./hyphenate');
exports.ipToHex = require('./ipToHex');
exports.leftB = require('./leftB');
exports.sizeOfUTF8String = require('./sizeOfUTF8String');
exports.substitute = require('./substitute');
