var $type = require('./type');
var $get = require('./get');
var $keyPathSplit = require('../str/keyPathSplit');

/**
 * 向对象路径设置值(简易版)
 * @method obj/set
 * @see [lodash.set](https://lodash.com/docs/4.17.15#set)
 * @param {Object|Array} obj 要设置值的对象或者数组
 * @param {String} xpath 要取值的路径
 * @param {Any} value 要设置的值
 * @returns {undefined}
 * @example
 * var $set = require('@spore-ui/kit/packages/obj/set');
 * var obj = {a: {b: {c: 1}}};
 * $set(obj, 'a.b.c', 2);
 * console.info(obj.a.b.c) // 2
 */
function set(obj, xpath, value) {
  if (!obj) return;
  if (typeof xpath !== 'string') return;
  if (!xpath) return;
  var arrXpath = $keyPathSplit(xpath);
  var key = arrXpath.pop();
  var target = $get(obj, arrXpath.join('.'));
  if (!target) return;
  if ($type(target) === 'array') {
    if (/^\d+$/.test(key)) {
      key = parseInt(key, 10);
    }
    if ($type(value) !== 'undefined') {
      target[key] = value;
    }
  } else if ($type(target) === 'object') {
    if ($type(value) !== 'undefined') {
      target[key] = value;
    }
  }
}

module.exports = set;
