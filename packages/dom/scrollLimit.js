/**
 * 显示滚动区域滑动滚动事件不再穿透到底部
 * - ios 需要给滚动区域添加样式属性: -webkit-overflow-scrolling: touch;
 * - 仅支持单方向滑动禁用
 * @method dom/scrollLimit
 * @param {Object} el 要限制滚动穿透的滚动区域元素
 * @param {Object} options 限制滚动穿透的选项
 * @param {String} [options.direction='y'] 限制滚动的方向，取值: ['x', 'y']
 * @return {Boolean} 是否为dom元素
 * @example
 * var $scrollLimit = require('@spore-ui/kit/packages/dom/scrollLimit');
 * var scroller = document.getElementById('scroller');
 * var limiter = $scrollLimit(scroller, { direction: 'y' });
 * // 初始化时
 * limiter.attach();
 * // 卸载组件时
 * limiter.detach();
 */
var $assign = require('../obj/assign');

function scrollLimit(el, options) {
  var inst = {};

  var conf = $assign({
    direction: 'y',
  }, options);

  var scrollTop = 0;
  var scrollLeft = 0;
  var clientHeight = 0;
  var clientWidth = 0;
  var scrollHeight = 0;
  var scrollWidth = 0;
  var toTop = false;
  var toBottom = false;
  var toLeft = false;
  var toRight = false;
  var moveStartX = 0;
  var moveStartY = 0;

  var updateState = function () {
    scrollTop = el.scrollTop;
    scrollLeft = el.scrollLeft;
    clientHeight = el.clientHeight;
    scrollHeight = el.scrollHeight;
    scrollWidth = el.scrollWidth;

    toTop = scrollTop <= 0;
    toBottom = scrollTop + clientHeight >= scrollHeight;
    toLeft = scrollLeft <= 0;
    toRight = scrollLeft + clientWidth >= scrollWidth;
  };

  var getEvent = function (evt) {
    var tev = evt;
    if (evt.touches && evt.touches.length) {
      tev = evt.touches[0];
    }
    return tev;
  };

  inst.checkScroll = function (evt) {
    evt.stopPropagation();
    updateState();
  };

  inst.checkStart = function (evt) {
    var tev = getEvent(evt);
    moveStartX = tev.clientX;
    moveStartY = tev.clientY;
  };

  inst.checkMove = function (evt) {
    updateState();
    var tev = getEvent(evt);
    if (conf.direction === 'x') {
      if (toLeft && (tev.clientX > moveStartX)) {
        evt.preventDefault();
      }
      if (toRight && (tev.clientX < moveStartX)) {
        evt.preventDefault();
      }
    } else {
      if (toTop && (tev.clientY > moveStartY)) {
        evt.preventDefault();
      }
      if (toBottom && (tev.clientY < moveStartY)) {
        evt.preventDefault();
      }
    }
  };

  var setEvents = function (type) {
    var prefix = type === 'on' ? 'add' : 'remove';
    var method = prefix + 'EventListener';
    if (typeof el[method] === 'function') {
      el[method]('scroll', inst.checkScroll);
      el[method]('touchmove', inst.checkMove);
      el[method]('touchstart', inst.checkStart);
    }
  };

  inst.attach = function () {
    updateState();
    setEvents('on');
  };

  inst.detach = function () {
    setEvents('off');
  };

  return inst;
}

module.scrollLimit = scrollLimit;
