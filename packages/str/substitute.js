/**
 * 简单模板函数
 * @method str/substitute
 * @param {String} str 要替换模板的字符串
 * @param {Object} obj 模板对应的数据对象
 * @param {RegExp} [reg=/\\?\{\{([^{}]+)\}\}/g] 解析模板的正则表达式
 * @return {String} 替换了模板的字符串
 * @example
 * var $substitute = require('spore-kit/packages/str/substitute');
 * $substitute('{{city}}欢迎您', {city:'北京'}); // '北京欢迎您'
 */

function substitute(str, obj, reg) {
  return str.replace(reg || (/\\?\{\{([^{}]+)\}\}/g), function (match, name) {
    if (match.charAt(0) === '\\') {
      return match.slice(1);
    }
    // 注意：obj[name] != null 等同于 obj[name] !== null && obj[name] !== undefined
    return (obj[name] != null) ? obj[name] : '';
  });
}

module.exports = substitute;
