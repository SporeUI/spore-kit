/**
 * 包装为规律触发的函数，用于降低密集事件的处理频率
 * - 在疯狂操作期间，按照规律时间间隔，来调用任务函数
 * @method reqular
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @return {Function} 经过包装的定时触发函数
 * @example
 * var $regular = require('spore-kit/packages/fn/regular');
 * var comp = {
 *   countWords : function(){
 *     console.info(this.length);
 *   }
 * };
 * // 疯狂按键，每隔 200ms 才有一次按键有效
 * $('#input').keydown($regular(function(){
 *   this.length = $('#input').val().length;
 *   this.countWords();
 * }, 200, comp));
 */

function reqular(fn, delay, bind) {
  var enable = true;
  var timer = null;
  return function () {
    bind = bind || this;
    enable = true;
    var args = arguments;
    if (!timer) {
      timer = setInterval(function () {
        if (typeof fn === 'function') {
          fn.apply(bind, args);
        }
        if (!enable) {
          clearInterval(timer);
          timer = null;
        }
        enable = false;
      }, delay);
    }
  };
}

module.exports = reqular;
