/**
 * HSL颜色值转换为RGB
 * - 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - h, s, 和 l 设定在 [0, 1] 之间
 * - 返回的 r, g, 和 b 在 [0, 255]之间
 * @method hslToRgb
 * @param {Number} h 色相
 * @param {Number} s 饱和度
 * @param {Number} l 亮度
 * @returns {Array} RGB色值数值
 * @example
 * var $hslToRgb = require('spore-kit/packages/util/hslToRgb');
 * $hslToRgb(0, 0, 0); // => [0,0,0]
 * $hslToRgb(0, 0, 1); // => [255,255,255]
 * $hslToRgb(0.5555555555555555, 0.9374999999999999, 0.6862745098039216); // => [100,200,250]
 */

function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

function hslToRgb(h, s, l) {
	var r;
	var g;
	var b;

	if (s === 0) {
		// achromatic
		r = l;
		g = l;
		b = l;
	} else {
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports = hslToRgb;
