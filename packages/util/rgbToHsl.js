/**
 * RGB 颜色值转换为 HSL.
 * - 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - r, g, 和 b 需要在 [0, 255] 范围内
 * - 返回的 h, s, 和 l 在 [0, 1] 之间
 * @param {Number} r 红色色值
 * @param {Number} g 绿色色值
 * @param {Number} b 蓝色色值
 * @return {Array} HSL各值数组
 */

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	var max = Math.max(r, g, b);
	var	min = Math.min(r, g, b);
	var h;
	var s;
	var l = (max + min) / 2;

	if (max === min) {
		// achromatic
		h = 0;
		s = 0;
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default:
				break;
		}
		h /= 6;
	}

	return [h, s, l];
}

module.exports = rgbToHsl;
