var $type = require('./type');

/**
 * 深度克隆对象，会保留函数引用
 * @method obj/cloneDeep
 * @param {Object} item 要克隆的对象
 * @returns {Object} 克隆后的对象
 * @example
 * var $cloneDeep = require('@spore-ui/kit/packages/obj/cloneDeep');
 * var obj = {a: 1, b: 2, c: function () {}};
 * console.info($cloneDeep(obj)); //{a: 1, b: 2, c: function () {}}
 */

var cloneArr;
var cloneObj;
var cloneDeep;

cloneArr = function (arr) {
  var carr = [];
  arr.forEach(function (item, index) {
    carr[index] = cloneDeep(item);
  });
  return carr;
};

cloneObj = function (obj) {
  var cobj = {};
  Object.keys(obj).forEach(function (key) {
    var item = obj[key];
    cobj[key] = cloneDeep(item);
  });
  return cobj;
};

cloneDeep = function (item) {
  if ($type(item) === 'array') {
    return cloneArr(item);
  }
  if ($type(item) === 'object') {
    return cloneObj(item);
  }
  return item;
};

module.exports = cloneDeep;
