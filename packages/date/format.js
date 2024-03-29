/**
 * 日期对象格式化输出
 *
 * 格式化日期对象模板键值说明
 * - year 年份原始数值
 * - month 月份原始数值[1, 12]
 * - date 日期原始数值[1, 31]
 * - day 星期原始数值[0, 6]
 * - hours 小时原始数值[0, 23]
 * - miniutes 分钟原始数值[0, 59]
 * - seconds 秒原始数值[0, 59]
 * - milliSeconds 毫秒原始数值[0, 999]
 * - YYYY 年份数值，精确到4位(12 => '0012')
 * - YY 年份数值，精确到2位(2018 => '18')
 * - Y 年份原始数值
 * - MM 月份数值，精确到2位(9 => '09')
 * - M 月份原始数值
 * - DD 日期数值，精确到2位(3 => '03')
 * - D 日期原始数值
 * - d 星期数值，通过 weekday 参数映射取得(0 => '日')
 * - hh 小时数值，精确到2位(9 => '09')
 * - h 小时原始数值
 * - mm 分钟数值，精确到2位(9 => '09')
 * - m 分钟原始数值
 * - ss 秒数值，精确到2位(9 => '09')
 * - s 秒原始数值
 * - mss 毫秒数值，精确到3位(9 => '009')
 * - ms 毫秒原始数值
 * @method date/format
 * @param {Date} dobj 日期对象，或者可以被转换为日期对象的数据
 * @param {Object} [spec] 格式化选项
 * @param {Array} [spec.weekday='日一二三四五六'.split('')] 一周内各天对应名称，顺序从周日算起
 * @param {String} [spec.template='{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}'] 格式化模板
 * @return {String} 格式化完成的字符串
 * @example
 * var $format = require('@spore-ui/kit/packages/date/format');
 * console.info(
 *   $format(new Date(),{
 *     template : '{{YYYY}}年{{MM}}月{{DD}}日 周{{d}} {{hh}}时{{mm}}分{{ss}}秒'
 *   })
 * );
 * // 2015年09月09日 周三 14时19分42秒
 */

var $assign = require('../obj/assign');
var $substitute = require('../str/substitute');
var $fixTo = require('../num/fixTo');
var $getUTCDate = require('./getUTCDate');

var rLimit = function (num, w) {
  var str = $fixTo(num, w);
  var delta = str.length - w;
  return delta > 0 ? str.substr(delta) : str;
};

function format(dobj, spec) {
  var output = '';
  var data = {};
  var conf = $assign({
    weekday: '日一二三四五六'.split(''),
    template: '{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}',
  }, spec);

  // 解决不同服务器时区不一致可能会导致日期初始化时间不一致的问题
  // 传入数字以北京时区时间为准
  var utcDate = $getUTCDate(dobj);
  data.year = utcDate.getUTCFullYear();
  data.month = utcDate.getUTCMonth() + 1;
  data.date = utcDate.getUTCDate();
  data.day = utcDate.getUTCDay();
  data.hours = utcDate.getUTCHours();
  data.miniutes = utcDate.getUTCMinutes();
  data.seconds = utcDate.getUTCSeconds();
  data.milliSeconds = utcDate.getUTCMilliseconds();

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

  data.mss = $fixTo(data.milliSeconds, 3);
  data.ms = data.milliSeconds;

  output = $substitute(conf.template, data);
  return output;
}

module.exports = format;
