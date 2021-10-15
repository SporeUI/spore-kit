var isSupportWebp = null;

/**
 * webp 相关检测
 * @module webp
 */

/**
 * 判断浏览器是否支持webp
 * @method webp.support
 * @memberof webp
 * @returns {Boolean} 是否支持webp
 * @example
 * var $webp = require('spore-kit/packages/env/webp');
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

function webp () {
	if (isSupportWebp === null) {
		isSupportWebp = support();
	}
	return isSupportWebp;
}

webp.support = support;

module.exports = webp;
