/**
 * 加载 script 文件
 * @method io/getScript
 * @param {Object} options 选项
 * @param {String} options.src script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 * var $getScript = require('spore-kit/packages/io/getScript');
 * $getScript({
 *   src: 'https://code.jquery.com/jquery-3.3.1.min.js',
 *   onLoad: function () {
 *     console.info(window.jQuery);
 *   }
 * });
 */

function getScript(options) {
  options = options || {};

  var src = options.src || '';
  var charset = options.charset || '';
  var onLoad = options.onLoad || function () {};

  var script = document.createElement('script');
  script.async = 'async';
  script.src = src;

  if (charset) {
    script.charset = charset;
  }
  script.onreadystatechange = function () {
    if (
      !this.readyState
      || this.readyState === 'loaded'
      || this.readyState === 'complete'
    ) {
      if (typeof onLoad === 'function') {
        onLoad();
      }
      this.onload = null;
      this.onreadystatechange = null;
      this.parentNode.removeChild(this);
    }
  };
  script.onload = script.onreadystatechange;
  document.getElementsByTagName('head')[0].appendChild(script);
  return script;
}

module.exports = getScript;
