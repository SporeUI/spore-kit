/**
 * 扩展并覆盖对象
 * @method obj/assign
 * @param {Object} obj 要扩展的对象
 * @param {Object} item 要扩展的属性键值对
 * @returns {Object} 扩展后的源对象
 * @example
 * var $assign = require('spore-kit/packages/obj/assign');
 * var obj = {a: 1, b: 2};
 * console.info($assign(obj, {b: 3, c: 4})); // {a: 1, b: 3, c: 4}
 * console.info($assign({}, obj, {b: 3, c: 4})); // {a: 1, b: 3, c: 4}
 */

function assign(obj) {
  obj = obj || {};
  Array.prototype.slice.call(arguments, 1).forEach(function (source) {
    var prop;
    source = source || {};
    for (prop in source) {
      if (source.hasOwnProperty(prop)) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

module.exports = assign;
