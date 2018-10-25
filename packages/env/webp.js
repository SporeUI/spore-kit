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
 * console.info(webp.support()); // true/false
 */
function support() {
	if (isSupportWebp === null) {
		isSupportWebp = !![].map
			&& document
				.createElement('canvas')
				.toDataURL('image/webp')
				.indexOf('data:image/webp') === 0;
	}
	return isSupportWebp;
}

var webp = {};
webp.support = support;

module.exports = webp;
