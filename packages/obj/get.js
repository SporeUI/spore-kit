var $type = require('./type');
var $keyPathSplit = require('../str/keyPathSplit');

/**
 * 从对象路径取值(简易版)
 * @method obj/get
 * @see [lodash.get](https://lodash.com/docs/4.17.15#get)
 * @param {Object|Array} obj 要取值的对象或者数组
 * @param {String} xpath 要取值的路径
 * @param {Any} [defaultValue] 值为 undefined 则取此默认值
 * @returns {Any} 取得的值
 * @example
 * var $get = require('@spore-ui/kit/packages/obj/get');
 * var obj = {a: {b: {c: 1}}};
 * console.info($get(obj, 'a.b.c'); // 1
 * console.info($get(obj, 'e'); // undefined
 * console.info($get(obj, 'e', 3); // 3
 * var arr = [1, {a: [2, 3]}];
 * console.info($get(arr, '[1].a[1]'); // 3
 */

// 引用 lodash/get 会引入超过10kb 代码，用这个方法来精简 sdk 体积

function get(obj, xpath, def) {
  if (!obj) return undefined;
  if (typeof xpath !== 'string') return undefined;
  var arrXpath = $keyPathSplit(xpath);
  var point = obj;
  var len = arrXpath.length;
  var index;
  for (index = 0; index < len; index += 1) {
    var key = arrXpath[index];
    var otype = $type(point);
    if (otype === 'array') {
      if (/^\d+$/.test(key)) {
        key = parseInt(key, 10);
      }
      point = point[key];
    } else if (typeof point === 'object') {
      point = point[key];
    } else {
      point = undefined;
      break;
    }
  }
  var value = point;
  if ($type(value) === 'undefined') {
    if ($type(def) !== 'undefined') {
      value = def;
    }
  }
  return value;
}

module.exports = get;
