/**
 * 生成一个不与之前重复的随机字符串
 * @module
 * @return {string} 随机字符串
 */

var time = +new Date();
var index = 1;

function getUniqueKey() {
	return (time + (index++)).toString(16);
}

module.exports = getUniqueKey;
