/**
 * 获取一个时间对象，其年月周日时分秒等 UTC 值与北京时间保持一致。
 * 解决不同服务器时区不一致场景下，可能会导致日期计算不一致的问题.
 * @method getUTCDate
 * @param {Number|Date} time 实际时间
 * @returns {Date} UTC时间
 * @example
 * var $getUTCDate = require('spore-kit/packages/date/getUTCDate');
 * var cnTime = 1540915200000; // (Wed Oct 31 2018 00:00:00 GMT+0800 (中国标准时间))
 * var utcDate = $getUTCDate(cnTime).getTime();
 * // 1540886400000 Tue Oct 30 2018 16:00:00 GMT+0800 (中国标准时间)
 * utcDate.getUTCdate(); // 31
 * utcDate.getHours(); // 8
 * utcDate.getUTCHours(); // 0
 */
function getUTCDate(time) {
	var utcDate = new Date(new Date(time).getTime() + 28800000);
	return utcDate;
}

module.exports = getUTCDate;
