/**
 * 获取36进制随机字符串
 * @method getRnd36
 * @param {Float} [rnd] 随机数，不传则生成一个随机数
 * @return {String} 转成为36进制的字符串
 * @example
 * var $getRnd36 = require('spore-kit/packages/str/getRnd36');
 * $getRnd36(0.5810766832590446); // 'kx2pozz9rgf'
 */

function getRnd36 (rnd) {
	rnd = rnd || Math.random();
	return rnd.toString(36).replace(/^0./, '');
}

module.exports = getRnd36;
