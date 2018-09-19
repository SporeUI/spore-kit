/**
 * 获取某个时间的 整年|整月|整日|整时|整分 时间戳
 * @param {number|date} time 实际时间
 * @param {string} type 时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 */

var DAY = 24 * 60 * 60 * 1000;

var TIME_UNITS = [
	'hour',
	'day',
	'week',
	'month',
	'year'
];

function getTimeSplit(time, type) {
	var datetime = new Date(time);

	// 以周一为起始时间
	var day = datetime.getDay();
	day = day === 0 ? 6 : day - 1;

	var index = TIME_UNITS.indexOf(type);
	if (index === 2) {
		datetime = new Date(datetime - day * DAY);
	}
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1;
	var date = datetime.getDate();
	var hour = datetime.getHours();
	var minutes = datetime.getMinutes();

	if (index >= 0) {
		minutes = '00';
	}
	if (index >= 1) {
		hour = '00';
	}
	if (index >= 3) {
		date = 1;
	}
	if (index >= 4) {
		month = 1;
	}

	var str = [
		[year, month, date].join('/'),
		[hour, minutes].join(':')
	].join(' ');

	return new Date(str);
}

module.exports = getTimeSplit;
