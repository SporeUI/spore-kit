/**
 * 获取过去一段时间的起始日期，如3月前第1天，2周前第1天，3小时前整点
 * @method getLastStart
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @param {Number} count 多少单位时间之前
 * @returns {Date} 最近单位时间的起始时间对象
 * @example
 * var $getLastStart = require('spore-kit/packages/date/getLastStart');
 * var time = $getLastStart(
 *   new Date('2018-10-25'),
 *   'month',
 *   0
 * ).getTime(); // 1538323200000
 * new Date(time); // Mon Oct 01 2018 00:00:00 GMT+0800 (中国标准时间)
 */

var $getTimeSplit = require('./getTimeSplit');
var $getUTCDate = require('./getUTCDate');

var HOUR = 60 * 60 * 1000;
var DAY = 24 * 60 * 60 * 1000;

function getLastStart(time, type, count) {
	var localTime = new Date(time);
	var utcTime = $getUTCDate(time);
	var stamp = utcTime;
	var year;
	var month;
	var allMonths;
	var unit;
	if (!type) {
		throw new Error('required param type');
	}
	count = count || 0;
	if (type === 'year') {
		year = utcTime.getUTCFullYear();
		year -= count;
		stamp = new Date(year + '/1/1');
	} else if (type === 'month') {
		year = utcTime.getUTCFullYear();
		month = utcTime.getUTCMonth();
		allMonths = year * 12 + month - count;
		year = Math.floor(allMonths / 12);
		month = allMonths - year * 12;
		month += 1;
		stamp = new Date([year, month, 1].join('/'));
	} else {
		unit = HOUR;
		if (type === 'day') {
			unit = DAY;
		}
		if (type === 'week') {
			unit = 7 * DAY;
		}
		var newLocalTime = localTime - count * unit;
		stamp = $getTimeSplit(newLocalTime, type);
	}

	return stamp;
}

module.exports = getLastStart;
