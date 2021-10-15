/**
 * 函数代理，确保函数在当前类创建的实例上下文中执行。
 * - 这些用于绑定事件的代理函数都放在属性 instance.bound 上。
 * - 功能类似 Function.prototype.bind 。
 * - 可以传递额外参数作为函数执行的默认参数，追加在实际参数之后。
 * @method mvc/proxy
 * @param {object} instance 对象实例
 * @param {string} [name='proxy'] 函数名称
 */

var $isFunction = require('lodash/isFunction');

var AP = Array.prototype;

function proxy(instance, name, proxyArgs) {
  if (!instance.bound) {
    instance.bound = {};
  }
  var bound = instance.bound;
  proxyArgs = proxyArgs || [];
  proxyArgs.shift();
  name = name || 'proxy';
  if (!$isFunction(bound[name])) {
    bound[name] = function () {
      if ($isFunction(instance[name])) {
        var args = AP.slice.call(arguments);
        return instance[name].apply(instance, args.concat(proxyArgs));
      }
    };
  }
  return bound[name];
}

module.exports = proxy;
