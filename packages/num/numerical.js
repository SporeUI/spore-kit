/**
 * 将数据类型转为整数数字，转换失败则返回一个默认值
 * @method numerical
 * @param {*} str 要转换的数据
 * @param {Number} [def=0] 转换失败时的默认值
 * @param {Number} [sys=10] 进制
 * @return {Number} 转换而得的整数
 * @example
 * numerical('10x'); // 10
 * numerical('x10'); // 0
 */

function numerical (str, def, sys) {
	def = def || 0;
	sys = sys || 10;
	return parseInt(str, sys) || def;
}

module.exports = numerical;
