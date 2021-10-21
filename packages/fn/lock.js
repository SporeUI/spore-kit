/**
 * 包装为触发一次后，预置时间内不能再次触发的函数
 * - 类似于技能冷却。
 * @method fn/lock
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的冷却触发函数
 * @example
 * var $lock = require('@spore-ui/kit/packages/fn/lock');
 * var request = function () {
 *   console.info('do request');
 * };
 * $('#input').keydown($lock(request, 500));
 * // 第一次按键，就会触发一次函数调用
 * // 之后连续按键，仅在 500ms 结束后再次按键，才会再次触发 request 函数调用
 */

function lock(fn, delay, bind) {
  var timer = null;
  return function () {
    if (timer) {
      return;
    }
    bind = bind || this;
    var args = arguments;
    timer = setTimeout(function () {
      timer = null;
    }, delay);
    if (typeof fn === 'function') {
      fn.apply(bind, args);
    }
  };
}

module.exports = lock;
