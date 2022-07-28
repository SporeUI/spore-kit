var $type = require('./type');

var mergeArr;
var mergeObj;

var isObj = function (item) {
  return (
    item
    && typeof item === 'object'
  );
};

var mergeItem = function (origin, item, key) {
  var prev = origin[key];
  if (
    $type(prev) === 'array'
    && $type(item) === 'array'
  ) {
    mergeArr(prev, item);
  } else if (
    isObj(prev)
    && isObj(item)
  ) {
    mergeObj(prev, item);
  } else {
    origin[key] = item;
  }
};

mergeArr = function (origin, source) {
  source.forEach(function (item, index) {
    mergeItem(origin, item, index);
  });
};

mergeObj = function (origin, source) {
  Object.keys(source).forEach(function (key) {
    mergeItem(origin, source[key], key);
  });
};

/**
 * 深度混合源对象，会保留函数引用
 * @method obj/merge
 * @param {Object} origin 要混合的源对象
 * @param {Object} target 要混合的对象
 * @returns {Object} 混合之后的对象
 * @example
 * var $merge = require('@spore-ui/kit/packages/obj/merge');
 * var origin = {a:{b:{c:1}}};
 * var target = {a:{b:{d:2}}};
 * console.info($merge(origin, target));
 * // {a:{b:{c:1,d:2}}};
 */
var merge = function (origin) {
  if (typeof origin !== 'object') return origin;
  var rests = Array.prototype.slice.call(arguments, 1);
  rests.forEach(function (source) {
    if ($type(source) === 'array') {
      mergeArr(origin, source);
    } else if (isObj(source)) {
      mergeObj(origin, source);
    }
  });
  return origin;
};

module.exports = merge;
