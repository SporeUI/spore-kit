/**
 * 将数据类型转为整数数字
 * @module
 * @param {mixed} str 要转换的数据
 * @param {number} [def=0] 转换失败时的默认值
 * @param {number} [sys=10] 进制
 * @return {number} 转换而得的整数
 * @example
 * numerical('10x');	//return 10
 * numerical('x10');	//return 0
 */

module.exports = function(str, def, sys) {
	def = def || 0;
	sys = sys || 10;
	return parseInt(str, sys) || def;
};
