var isSupportWebp = null;

/**
 * 判断是否支持webp
 * @return {boolean} true/false
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
