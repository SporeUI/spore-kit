/**
 * 平滑滚动到某个元素，只进行垂直方向的滚动
 * - requires jQuery/Zepto
 * @method fx/smoothScrollTo
 * @param {Object} node 目标DOM元素
 * @param {Object} spec 选项
 * @param {Number} [spec.delta=0] 目标滚动位置与目标元素顶部的间距，可以为负值
 * @param {Number} [spec.maxDelay=3000] 动画执行时间限制(ms)，动画执行超过此时间则直接停止，立刻滚动到目标位置
 * @param {Function} [options.callback] 滚动完成的回调函数
 * @example
 * var $smoothScrollTo = require('@spore-ui/kit/packages/fx/smoothScrollTo');
 * // 滚动到页面顶端
 * $smoothScrollTo(document.body);
 */

var $assign = require('../obj/assign');

function smoothScrollTo(node, spec) {
  var $ = window.$ || window.Zepto || window.jQuery;

  var conf = $assign({
    delta: 0,
    maxDelay: 3000,
    callback: null,
  }, spec);

  var offset = $(node).offset();
  var target = offset.top + conf.delta;
  var callback = conf.callback;

  var prevStep;
  var stayCount = 3;

  var timer = null;

  var stopTimer = function () {
    if (timer) {
      clearInterval(timer);
      timer = null;
      window.scrollTo(0, target);
      if ($.isFunction(callback)) {
        callback();
      }
    }
  };

  timer = setInterval(function () {
    var sTop = $(window).scrollTop();
    var delta = sTop - target;
    if (delta > 0) {
      delta = Math.floor(delta * 0.8);
    } else if (delta < 0) {
      delta = Math.ceil(delta * 0.8);
    }

    var step = target + delta;
    if (step === prevStep) {
      stayCount -= 1;
    }
    prevStep = step;

    window.scrollTo(0, step);

    if (step === target || stayCount <= 0) {
      stopTimer();
    }
  }, 16);

  setTimeout(function () {
    stopTimer();
  }, conf.maxDelay);
}

module.exports = smoothScrollTo;
