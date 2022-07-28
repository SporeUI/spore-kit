/**
 * 简易克隆对象，会丢失函数等不能被 JSON 序列化的内容
 * @method obj/clone
 * @param {Object} object 要克隆的对象
 * @returns {Object} 克隆后的对象
 * @example
 * var $clone = require('@spore-ui/kit/packages/obj/clone');
 * var obj = {a: 1, b: 2};
 * console.info($clone(obj)); //{a: 1, b: 2}
 */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = clone;
