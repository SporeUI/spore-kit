/**
 * 查找对象路径上的值(简易版)
 * @see lodash.get
 * @method find
 * @param {Object} object 要查找的对象
 * @param {String} path 要查找的路径
 * @return {*} 对象路径上的值
 * @example
 * var $find = require('spore-kit/packages/obj/find');
 * var obj = {a:{b:{c:1}}};
 * console.info($find(obj,'a.b.c')); // 1
 * console.info($find(obj,'a.c')); // undefined
 */

function findPath(object, path) {
  path = path || '';
  if (!path) {
    return object;
  }
  if (!object) {
    return object;
  }

  var queue = path.split('.');
  var name;
  var pos = object;

  while (queue.length) {
    name = queue.shift();
    if (!pos[name]) {
      return pos[name];
    }
    pos = pos[name];
  }

  return pos;
}

module.exports = findPath;
