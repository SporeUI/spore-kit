/**
 * 用 requestAnimationFrame 包装定时器
 * - 如果浏览器不支持 requestAnimationFrame API，则使用 BOM 原本的定时器API
 * @module fx/timer
 * @example
 * var $timer = require('@spore-ui/kit/packages/fx/timer');
 * $timer.setTimeout(function () {
 *   console.info('output this log after 1000ms');
 * }, 1000);
 */

var Timer = {};

var noop = function () {};

function factory(methodName) {
  var wrappedMethod = null;

  if (typeof window === 'undefined') return;
  var win = window;

  // 如果有对应名称的方法，直接返回该方法，否则返回带有对应浏览器前缀的方法
  var getPrefixMethod = function (name) {
    var upFirstName = name.charAt(0).toUpperCase() + name.substr(1);
    var method = win[name]
      || win['webkit' + upFirstName]
      || win['moz' + upFirstName]
      || win['o' + upFirstName]
      || win['ms' + upFirstName];
    if (typeof method === 'function') {
      return method.bind(win);
    }
    return null;
  };

  var localRequestAnimationFrame = getPrefixMethod('requestAnimationFrame');
  var localCancelAnimationFrame = getPrefixMethod('cancelAnimationFrame') || noop;

  if (localRequestAnimationFrame) {
    var clearTimer = function (obj) {
      if (obj.requestId && typeof obj.step === 'function') {
        obj.step = noop;
        localCancelAnimationFrame(obj.requestId);
        obj.requestId = 0;
      }
    };

    var setTimer = function (fn, delay, type) {
      var obj = {};
      var time = Date.now();
      delay = delay || 0;
      delay = Math.max(delay, 0);
      obj.step = function () {
        var now = Date.now();
        if (now - time > delay) {
          fn();
          if (type === 'timeout') {
            clearTimer(obj);
          } else {
            time = now;
          }
        }
        obj.requestId = localRequestAnimationFrame(obj.step);
      };
      localRequestAnimationFrame(obj.step);
      return obj;
    };

    if (methodName === 'setInterval') {
      wrappedMethod = function (fn, delay) {
        return setTimer(fn, delay, 'interval');
      };
    } else if (methodName === 'setTimeout') {
      wrappedMethod = function (fn, delay) {
        return setTimer(fn, delay, 'timeout');
      };
    } else if (methodName === 'clearTimeout') {
      wrappedMethod = clearTimer;
    } else if (methodName === 'clearInterval') {
      wrappedMethod = clearTimer;
    }
  }

  if (!wrappedMethod && this[methodName]) {
    wrappedMethod = this[methodName].bind(this);
  }

  return wrappedMethod;
}

/**
 * 设置重复调用定时器
 * @method timer.setInterval
 * @memberof timer
 * @param {Function} fn 定时重复调用的函数
 * @param {Number} [delay=0] 重复调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearInterval 方法来终止这个定时器
 */
Timer.setInterval = factory('setInterval');

/**
 * 清除重复调用定时器
 * @method timer.clearInterval
 * @memberof timer
 * @param {Object} obj 定时器对象
 */
Timer.clearInterval = factory('clearInterval');

/**
 * 设置延时调用定时器
 * @method timer.setTimeout
 * @memberof timer
 * @param {Function} fn 延时调用的函数
 * @param {Number} [delay=0] 延时调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearTimeout 方法来终止这个定时器
 */
Timer.setTimeout = factory('setTimeout');

/**
 * 清除延时调用定时器
 * @method timer.clearTimeout
 * @memberof timer
 * @param {Object} obj 定时器对象
 */
Timer.clearTimeout = factory('clearTimeout');

module.exports = Timer;
