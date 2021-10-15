/**
 * IOS sticky 效果 polyfill
 * - requires jQuery/Zepto
 * @param {Object} node 目标DOM元素
 * @param {Object} options 选项
 * @param {Boolean} [options.clone=true] 是否创建一个 clone 元素
 * @param {Object} [options.placeholder=null] sticky 效果启动时的占位 dom 元素
 * @param {Boolean} [options.disableAndroid=false] 是否在 Android 下停用 sticky 效果
 * @param {Object} [options.offsetParent=null] 提供一个相对定位元素来匹配浮动时的定位样式
 * @param {Object} [options.styles={}] 进入 sticky 状态时的样式
 * @example
 * var $sticky = require('spore-kit/packages/fx/sticky');
 * $sticky($('h1').get(0));
 */

function sticky(node, options) {
  var $ = window.$ || window.Zepto || window.jQuery;

  var $win = $(window);
  var $doc = $(document);

  var ua = navigator.userAgent;
  var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
  var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;

  var that = {};
  that.isIOS = isIOS;
  that.isAndroid = isAndroid;

  var conf = $.extend(
    {
      clone: true,
      placeholder: null,
      disableAndroid: false,
      offsetParent: null,
      styles: {},
    },
    options,
  );

  that.root = $(node);

  if (!that.root.get(0)) { return; }
  that.offsetParent = that.root.offsetParent();

  if (conf.offsetParent) {
    that.offsetParent = $(conf.offsetParent);
  }

  if (!that.offsetParent[0]) {
    that.offsetParent = $(document.body);
  }

  that.isSticky = false;

  if (conf.placeholder) {
    that.placeholder = $(conf.placeholder);
  } else {
    that.placeholder = $('<div/>');
  }

  if (conf.clone) {
    that.clone = that.root.clone();
    that.clone.appendTo(that.placeholder);
  }

  that.placeholder.css({
    visibility: 'hidden',
  });

  that.sticky = function () {
    if (!that.isSticky) {
      that.isSticky = true;
      that.root.css('position', 'fixed');
      that.root.css(conf.styles);
      that.placeholder.insertBefore(that.root);
    }
  };

  that.unSticky = function () {
    if (that.isSticky) {
      that.isSticky = false;
      that.placeholder.remove();
      that.root.css('position', '');
      $.each(conf.styles, function (key) {
        that.root.css(key, '');
      });
    }
  };

  var origOffsetY = that.root.get(0).offsetTop;
  that.checkScrollY = function () {
    if (!that.isSticky) {
      origOffsetY = that.root.get(0).offsetTop;
    }

    var scrollY = 0;
    if (that.offsetParent.get(0) === document.body) {
      scrollY = window.scrollY;
    } else {
      scrollY = that.offsetParent.get(0).scrollTop;
    }

    if (scrollY > origOffsetY) {
      that.sticky();
    } else {
      that.unSticky();
    }

    if (that.isSticky) {
      that.root.css({
        width: that.placeholder.width() + 'px',
      });
    } else {
      that.root.css({
        width: '',
      });
    }
  };

  that.init = function () {
    if (isAndroid && conf.disableAndroid) {
      return;
    }
    if (isIOS && that.offsetParent.get(0) === document.body) {
      // IOS9+ 支持 position:sticky 属性
      that.root.css('position', 'sticky');
    } else {
      // 一般浏览器直接支持
      if (that.offsetParent.get(0) === document.body) {
        $win.on('scroll', that.checkScrollY);
      } else {
        that.offsetParent.on('scroll', that.checkScrollY);
      }

      $win.on('resize', that.checkScrollY);
      $doc.on('touchstart', that.checkScrollY);
      $doc.on('touchmove', that.checkScrollY);
      $doc.on('touchend', that.checkScrollY);
      that.checkScrollY();
    }
  };

  that.init();
  return that;
}

module.exports = sticky;
