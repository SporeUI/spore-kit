/**
 * 时间数字拆分为天时分秒
 * @module
 * @param {number} time 毫秒数
 * @param {object} spec 选项
 * @param {string} [spec.maxUnit='day'] 拆分时间的最大单位，可选 ['day', 'hour', 'minute', 'second']
 * @return {object} 拆分完成的天时分秒
 * @example
 * console.info( timeSplit(12345 * 67890) );
 * // Object {day: 9, hour: 16, minute: 48, second: 22, ms: 50}
 * console.info( timeSplit(12345 * 67890, {maxUnit : 'hour'}) );
 * // Object {hour: 232, minute: 48, second: 22, ms: 50}
 */

var $numerical = require('spore-kit-num/numerical');
var $assign = require('spore-kit-obj/assign');

var UNIT = {
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000
};

function timeSplit(time, spec) {
	var conf = $assign({
		maxUnit: 'day'
	}, spec);

	var data = {};
	var maxUnit = $numerical(UNIT[conf.maxUnit]);
	var uDay = UNIT.day;
	var uHour = UNIT.hour;
	var uMinute = UNIT.minute;
	var uSecond = UNIT.second;

	if (maxUnit >= uDay) {
		time = $numerical(time);
		data.day = Math.floor(time / uDay);
	}

	if (maxUnit >= uHour) {
		time -= $numerical(data.day * uDay);
		data.hour = Math.floor(time / uHour);
	}

	if (maxUnit >= uMinute) {
		time -= $numerical(data.hour * uHour);
		data.minute = Math.floor(time / uMinute);
	}

	if (maxUnit >= uSecond) {
		time -= $numerical(data.minute * uMinute);
		data.second = Math.floor(time / uSecond);
	}

	data.ms = time - data.second * uSecond;

	return data;
}

module.exports = timeSplit;
