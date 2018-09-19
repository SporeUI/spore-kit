/**
 * 获取过去一段时间的起始日期，如3月前第1天，2周前第1天，3小时前整点
 * @module
 * @param {number|date} time 实际时间
 * @param {string} type 时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @param {number} count 多少单位时间之前
 */

var $getTimeSplit = require('./getTimeSplit');

var HOUR = 60 * 60 * 1000;
var DAY = 24 * 60 * 60 * 1000;

function getLastStart(time, type, count) {
	var datetime = new Date(time);
	var stamp = datetime;
	var year;
	var month;
	var allMonths;
	var unit;
	if (type === 'year') {
		year = datetime.getFullYear();
		year -= count;
		stamp = new Date(year + '/1/1');
	} else if (type === 'month') {
		year = datetime.getFullYear();
		month = datetime.getMonth();
		allMonths = year * 12 + month - count;
		year = Math.floor(allMonths / 12);
		month = allMonths - year * 12;
		month += 1;
		stamp = new Date(`${year}/${month}/1`);
	} else {
		unit = HOUR;
		if (type === 'day') {
			unit = DAY;
		}
		if (type === 'week') {
			unit = 7 * DAY;
		}
		datetime -= count * unit;
		stamp = $getTimeSplit(datetime, type);
	}

	return stamp;
}

module.exports = getLastStart;
