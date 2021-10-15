/**
 * 动画类 - 用于处理不适合使用 transition 的动画场景
 *
 * 可绑定的事件
 * - start 动画开始时触发
 * - complete 动画已完成
 * - stop 动画尚未完成就被中断
 * - cancel 动画被取消
 * @class fx/Fx
 * @see https://mootools.net/core/docs/1.6.0/Fx/Fx
 * @constructor
 * @param {Object} [options] 动画选项
 * @param {Number} [options.fps=60] 帧速率(f/s)，实际上动画运行的最高帧速率不会高于 requestAnimationFrame 提供的帧速率
 * @param {Number} [options.duration=500] 动画持续时间(ms)
 * @param {String|Function} [options.transition] 动画执行方式，参见 spore-kit/packages/fx/transitions
 * @param {Number} [options.frames] 从哪一帧开始执行
 * @param {Boolean} [options.frameSkip=true] 是否跳帧
 * @param {String} [options.link='ignore'] 动画衔接方式，可选：['ignore', 'cancel']
 * @example
 * var $fx = require('spore-kit/packages/fx/fx');
 * var fx = new $fx({
 *   duration : 1000
 * });
 * fx.set = function (now) {
 *   node.style.marginLeft = now + 'px';
 * };
 * fx.on('complete', function(){
 *   console.info('animation end');
 * });
 * fx.start(0, 600); // 1秒内数字从0增加到600
 */

var $klass = require('klass');
var $events = require('../evt/events');
var $erase = require('../arr/erase');
var $contains = require('../arr/contains');
var $assign = require('../obj/assign');
var $timer = require('./timer');

// global timers
// 使用公共定时器可以减少浏览器资源消耗
var instances = {};
var timers = {};

var loop = function () {
  var now = Date.now();
  for (var i = this.length; i >= 0; i -= 1) {
    var instance = this[i];
    if (instance) {
      instance.step(now);
    }
  }
};

var pushInstance = function (fps) {
  var list = instances[fps] || (instances[fps] = []);
  list.push(this);
  if (!timers[fps]) {
    var loopMethod = loop.bind(list);
    var loopDur = Math.round(1000 / fps);
    timers[fps] = $timer.setInterval(loopMethod, loopDur);
  }
};

var pullInstance = function (fps) {
  var list = instances[fps];
  if (list) {
    $erase(list, this);
    if (!list.length && timers[fps]) {
      delete instances[fps];
      timers[fps] = $timer.clearInterval(timers[fps]);
    }
  }
};

var Fx = $klass({
  initialize: function (options) {
    this.options = $assign({
      fps: 60,
      duration: 500,
      transition: null,
      frames: null,
      frameSkip: true,
      link: 'ignore',
    }, options);
  },

  /**
   * 设置实例的选项
   * @method Fx#setOptions
   * @memberof fx/Fx
   * @param {Object} options 动画选项
   */
  setOptions: function (options) {
    this.conf = $assign({}, this.options, options);
  },

  /**
   * 设置动画的执行方式，配置缓动效果
   * @interface Fx#getTransition
   * @memberof fx/Fx
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.getTransition = function () {
   *   return function (p) {
   *     return -(Math.cos(Math.PI * p) - 1) / 2;
   *   };
   * };
   */
  getTransition: function () {
    return function (p) {
      return -(Math.cos(Math.PI * p) - 1) / 2;
    };
  },

  step: function (now) {
    if (this.options.frameSkip) {
      var diff = this.time != null ? now - this.time : 0;
      var frames = diff / this.frameInterval;
      this.time = now;
      this.frame += frames;
    } else {
      this.frame += 1;
    }

    if (this.frame < this.frames) {
      var delta = this.transition(this.frame / this.frames);
      this.set(this.compute(this.from, this.to, delta));
    } else {
      this.frame = this.frames;
      this.set(this.compute(this.from, this.to, 1));
      this.stop();
    }
  },

  /**
   * 设置当前动画帧的过渡数值
   * @interface Fx#set
   * @memberof fx/Fx
   * @param {Number} now 当前动画帧的过渡数值
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.set = function (now) {
   *   node.style.marginLeft = now + 'px';
   * };
   */
  set: function (now) {
    return now;
  },

  compute: function (from, to, delta) {
    return Fx.compute(from, to, delta);
  },

  check: function () {
    if (!this.isRunning()) {
      return true;
    }
    if (this.options.link === 'cancel') {
      this.cancel();
      return true;
    }
    return false;
  },

  /**
   * 开始执行动画
   * @method Fx#start
   * @memberof fx/Fx
   * @param {Number} from 动画开始数值
   * @param {Number} to 动画结束数值
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.start(); // 开始动画
   */
  start: function (from, to) {
    if (!this.check(from, to)) {
      return this;
    }
    this.from = from;
    this.to = to;
    this.frame = this.options.frameSkip ? 0 : -1;
    this.time = null;
    this.transition = this.getTransition();
    var frames = this.options.frames;
    var fps = this.options.fps;
    var duration = this.options.duration;
    this.duration = Fx.Durations[duration] || parseInt(duration, 10) || 0;
    this.frameInterval = 1000 / fps;
    this.frames = frames || Math.round(this.duration / this.frameInterval);
    this.trigger('start');
    pushInstance.call(this, fps);
    return this;
  },

  /**
   * 停止动画
   * @method Fx#stop
   * @memberof fx/Fx
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.start();
   * fx.stop(); // 立刻停止动画
   */
  stop: function () {
    if (this.isRunning()) {
      this.time = null;
      pullInstance.call(this, this.options.fps);
      if (this.frames === this.frame) {
        this.trigger('complete');
      } else {
        this.trigger('stop');
      }
    }
    return this;
  },

  /**
   * 取消动画
   * @method Fx#cancel
   * @memberof fx/Fx
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.start();
   * fx.cancel(); // 立刻取消动画
   */
  cancel: function () {
    if (this.isRunning()) {
      this.time = null;
      pullInstance.call(this, this.options.fps);
      this.frame = this.frames;
      this.trigger('cancel');
    }
    return this;
  },

  /**
   * 暂停动画
   * @method Fx#pause
   * @memberof fx/Fx
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.start();
   * fx.pause(); // 立刻暂停动画
   */
  pause: function () {
    if (this.isRunning()) {
      this.time = null;
      pullInstance.call(this, this.options.fps);
    }
    return this;
  },

  /**
   * 继续执行动画
   * @method Fx#resume
   * @memberof fx/Fx
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.start();
   * fx.pause();
   * fx.resume(); // 立刻继续动画
   */
  resume: function () {
    if (this.frame < this.frames && !this.isRunning()) {
      pushInstance.call(this, this.options.fps);
    }
    return this;
  },

  /**
   * 判断动画是否正在运行
   * @method Fx#isRunning
   * @memberof fx/Fx
   * @returns {Boolean} 动画是否正在运行
   * @example
   * var $fx = require('spore-kit/packages/fx/fx');
   * var fx = new $fx();
   * fx.start();
   * fx.pause();
   * fx.isRunning(); // false
   */
  isRunning: function () {
    var list = instances[this.options.fps];
    return list && $contains(list, this);
  },
});

$events.mixTo(Fx);

Fx.compute = function (from, to, delta) {
  return (to - from) * delta + from;
};

Fx.Durations = { short: 250, normal: 500, long: 1000 };

module.exports = Fx;
