var isSupportWebp = null;

/**
 * 判断浏览器是否支持webp
 * @method env/webp
 * @returns {Boolean} 是否支持webp
 * @example
 * var $webp = require('@spore-ui/kit/packages/env/webp');
 * console.info($webp()); // true/false
 */

/**
 * 判断浏览器是否支持webp
 * @method env/webp.support
 * @memberof env/webp
 * @returns {Boolean} 是否支持webp
 * @example
 * var $webp = require('@spore-ui/kit/packages/env/webp');
 * console.info($webp.support()); // true/false
 */
function support() {
  var rs = !![].map
    && document
      .createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
  return rs;
}

function webp() {
  if (isSupportWebp === null) {
    isSupportWebp = support();
  }
  return isSupportWebp;
}

webp.support = support;

module.exports = webp;
