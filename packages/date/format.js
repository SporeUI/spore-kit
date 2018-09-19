/**
 * 日期对象格式化输出
 * @module
 * @param {date} dobj 日期对象，或者可以被转换为日期对象的数据
 * @param {object} spec 格式化选项
 * @param {array} [spec.weekday='日一二三四五六'.split('')] 一周内各天对应字符，从周日算起
 * @param {string} [spec.template='{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}'] 格式化模板
 * @return {string} 格式化完成的字符串
 * @example
 * 	var $dateFormat = require('lib/kit/date/format');
 * 	console.info(
 * 		$dateFormat(new Date(),{
 * 			template : '{{YYYY}}年{{MM}}月{{DD}}日 周{{d}} {{hh}}时{{mm}}分{{ss}}秒'
 * 		})
 * 	);
 * 	//2015年09月09日 周三 14时19分42秒
 */

var $assign = require('spore-kit-obj/assign');
var $substitute = require('spore-kit-str/substitute');
var $fixTo = require('spore-kit-num/fixTo');

var rLimit = function(num, w) {
	var str = $fixTo(num, w);
	var delta = str.length - w;
	return delta > 0 ? str.substr(delta) : str;
};

function format(dobj, spec) {
	var output = '';
	var data = {};
	var conf = $assign(
		{
			weekday: '日一二三四五六'.split(''),
			template: '{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}'
		},
		spec
	);

	dobj = new Date(dobj);
	data.year = dobj.getFullYear();
	data.month = dobj.getMonth() + 1;
	data.date = dobj.getDate();
	data.day = dobj.getDay();
	data.hours = dobj.getHours();
	data.miniutes = dobj.getMinutes();
	data.seconds = dobj.getSeconds();

	data.YYYY = rLimit(data.year, 4);
	data.YY = rLimit(data.year, 2);
	data.Y = data.year;

	data.MM = $fixTo(data.month, 2);
	data.M = data.month;

	data.DD = $fixTo(data.date, 2);
	data.D = data.date;

	data.d = conf.weekday[data.day];

	data.hh = $fixTo(data.hours, 2);
	data.h = data.hours;

	data.mm = $fixTo(data.miniutes, 2);
	data.m = data.miniutes;

	data.ss = $fixTo(data.seconds, 2);
	data.s = data.seconds;

	output = $substitute(conf.template, data);
	return output;
}

module.exports = format;
