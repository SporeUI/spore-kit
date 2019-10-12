!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sporeKit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.app = require('./packages/app');
exports.arr = require('./packages/arr');
exports.cookie = require('./packages/cookie');
exports.date = require('./packages/date');
exports.dom = require('./packages/dom');
exports.env = require('./packages/env');
exports.evt = require('./packages/evt');
exports.fn = require('./packages/fn');
exports.fx = require('./packages/fx');
exports.io = require('./packages/io');
exports.location = require('./packages/location');
exports.mvc = require('./packages/mvc');
exports.num = require('./packages/num');
exports.obj = require('./packages/obj');
exports.str = require('./packages/str');
exports.time = require('./packages/time');
exports.util = require('./packages/util');

},{"./packages/app":3,"./packages/arr":13,"./packages/cookie":16,"./packages/date":22,"./packages/dom":26,"./packages/env":37,"./packages/evt":45,"./packages/fn":50,"./packages/fx":59,"./packages/io":72,"./packages/location":74,"./packages/mvc":79,"./packages/num":221,"./packages/obj":227,"./packages/str":235,"./packages/time":241,"./packages/util":251}],2:[function(require,module,exports){
/**
 * 此方法用于呼起本地客户端，呼起失败时，跳转到客户端下载地址或者中间页
 * - 首先需要客户端提供一个协议地址 protocol
 * - 然后通过浏览器访问该地址或者 iframe 访问该协议地址来触发客户端的打开动作
 * - 在设定好的超时时间 (waiting) 到达时进行检查
 * - 由于 IOS 下，跳转到 APP，页面 JS 会被阻止执行
 * - 所以如果超时时间大大超过了预期时间范围，可断定 APP 已被打开，此时触发 onTimeout 回调事件函数
 * - 对于 IOS，此时如果从 APP 返回页面，就可以通过 waitingLimit 时间差来判断是否要执行 fallback 回调事件函数
 * - Android 下，跳转到 APP，页面 JS 会继续执行
 * - 此时无论 APP 是否已打开，都会触发 onFallback 事件与 fallback 回调事件函数
 * - fallback 默认操作是跳转到 fallbackUrl 客户端下载地址或者中间页地址
 * - 这样对于没有安装 APP 的移动端，页面会在超时事件发生时，直接跳转到 fallbackUrl
 * @method callUp
 * @param {Object} options
 * @param {String} options.protocol 客户端APP呼起协议地址
 * @param {String} options.fallbackUrl 客户端下载地址或者中间页地址
 * @param {Function} options.action 自定义呼起客户端的方式
 * @param {Number} [options.startTime=new Date().getTime()] 呼起客户端的开始时间(ms)，以时间数值作为参数
 * @param {Number} [options.waiting=800] 呼起超时等待时间(ms)
 * @param {Number} [options.waitingLimit=50] 超时后检查回调是否在此时间限制内触发(ms)
 * @param {Function} [options.fallback=function () { window.location = fallbackUrl; }] 默认回退操作
 * @param {Function} [options.onFallback=null] 呼起操作未能成功执行时触发的回调事件函数
 * @param {Function} [options.onTimeout=null] 呼起超时触发的回调事件函数
 * @example
 * callUp({
 * 	startTime: Date.now(),
 * 	waiting: 800,
 * 	waitingLimit: 50,
 * 	protocol : scheme,
 * 	fallbackUrl : download,
 * 	onFallback : function () {
 * 		// should download
 * 	}
 * });
 */

var $assign = require('spore-kit-obj/assign');
var $browser = require('spore-kit-env/browser');

function callUp (options) {
	var conf = $assign({
		protocol: '',
		fallbackUrl: '',
		action: null,
		startTime: new Date().getTime(),
		waiting: 800,
		waitingLimit: 50,
		fallback: function(fallbackUrl) {
			// 在一定时间内无法唤起客户端，跳转下载地址或到中间页
			window.location = fallbackUrl;
		},
		onFallback: null,
		onTimeout: null
	}, options);

	var wId;
	var iframe;

	if (typeof conf.action === 'function') {
		conf.action();
	} else if ($browser().chrome) {
		// chrome下iframe无法唤起Android客户端，这里使用window.open
		// 另一个方案参考 https://developers.google.com/chrome/mobile/docs/intents
		var win = window.open(conf.protocol);
		wId = setInterval(function() {
			if (typeof win === 'object') {
				clearInterval(wId);
				win.close();
			}
		}, 10);
	} else {
		// 创建iframe
		iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.src = conf.protocol;
		document.body.appendChild(iframe);
	}

	setTimeout(function() {
		if (wId) {
			clearInterval(wId);
		}

		if (iframe) {
			document.body.removeChild(iframe);
		}

		if (typeof conf.onTimeout === 'function') {
			conf.onTimeout();
		}

		// ios下，跳转到APP，页面JS会被阻止执行。
		// 因此如果超时时间大大超过了预期时间范围，可断定APP已被打开。
		if (new Date().getTime() - conf.startTime < conf.waiting + conf.waitingLimit) {
			if (typeof conf.onFallback === 'function') {
				conf.onFallback();
			}
			if (typeof conf.fallback === 'function') {
				conf.fallback(conf.fallbackUrl);
			}
		}
	}, conf.waiting);
}

module.exports = callUp;

},{"spore-kit-env/browser":4,"spore-kit-obj/assign":7}],3:[function(require,module,exports){
/**
 * # 处理与客户端相关的交互
 * @module spore-kit-app
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/app
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.app.callUp);
 *
 * // 单独引入 spore-kit-app
 * var $app = require('spore-kit-app');
 * console.info($app.callUp);
 *
 * // 单独引入一个方法
 * var $callUp = require('spore-kit-app/callUp');
 */

exports.callUp = require('./callUp');

},{"./callUp":2}],4:[function(require,module,exports){
/**
 * 检测浏览器类型
 *
 * 支持的类型检测
 * - qq
 * - uc
 * - baidu
 * - miui
 * - weixin
 * - qzone
 * - qqnews
 * - qqhouse
 * - qqbrowser
 * - chrome
 * @method browser
 * @returns {Object} UA 检查结果
 * @example
 * console.info(browser().chrome);
 */
var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	qq: (/qq\/([\d.]+)/i),
	uc: (/ucbrowser/i),
	baidu: (/baidubrowser/i),
	miui: (/miuibrowser/i),
	weixin: (/micromessenger/i),
	qzone: (/qzone\//i),
	qqnews: (/qqnews\/([\d.]+)/i),
	qqhouse: (/qqhouse/i),
	qqbrowser: (/qqbrowser/i),
	chrome: (/chrome/i)
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function browser() {
	if (!result) {
		result = detect();
	}
	return result;
}

browser.detect = detect;

module.exports = browser;

},{"./uaMatch":6,"spore-kit-obj/assign":5}],5:[function(require,module,exports){
/**
 * 扩展并覆盖对象
 * @method assign
 * @param {Object} obj 要扩展的对象
 * @param {Object} item 要扩展的属性键值对
 * @returns {Object} 扩展后的源对象
 * @example
 * var obj = {a: 1, b: 2};
 * console.info(assign(obj, {b: 3, c: 4})); // {a: 1, b: 3, c: 4}
 * console.info(assign({}, obj, {b: 3, c: 4})); // {a: 1, b: 3, c: 4}
 */

function assign (obj) {
	obj = obj || {};
	Array.prototype.slice.call(arguments, 1).forEach(function(source) {
		var prop;
		source = source || {};
		for (prop in source) {
			if (source.hasOwnProperty(prop)) {
				obj[prop] = source[prop];
			}
		}
	});
	return obj;
}

module.exports = assign;

},{}],6:[function(require,module,exports){
/**
 * UA字符串匹配列表
 * @method uaMatch
 * @param {Object} list 检测 Hash 列表
 * @param {String} ua 用于检测的 UA 字符串
 * @param {Object} conf 检测器选项，传递给检测函数
 * @example
 * var rs = uaMatch({
 * 	trident: 'trident',
 * 	presto: /presto/,
 * 	gecko: function(ua){
 * 		return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
 * 	}
 * }, 'xxx presto xxx');
 * console.info(rs.presto); // true
 * console.info(rs.trident); // undefined
 */

function uaMatch(list, ua, conf) {
	var result = {};
	if (!ua) {
		if (typeof window === 'undefined') {
			ua = '';
		} else {
			ua = window.navigator.userAgent;
		}
	}
	ua = ua.toLowerCase();
	if (typeof list === 'object') {
		Object.keys(list).forEach(function(key) {
			var tester = list[key];
			if (tester) {
				if (typeof tester === 'string') {
					if (ua.indexOf(tester) > -1) {
						result[key] = true;
					}
				} else if (
					Object.prototype.toString.call(tester) === '[object RegExp]'
				) {
					var match = ua.match(tester);
					if (match) {
						if (match[1]) {
							result[key] = match[1];
						} else {
							result[key] = true;
						}
					}
				} else if (typeof tester === 'function') {
					if (tester(ua, conf)) {
						result[key] = tester(ua);
					}
				}
			}
		});
	}

	return result;
}

module.exports = uaMatch;

},{}],7:[function(require,module,exports){
module.exports=require(5)
},{}],8:[function(require,module,exports){
/**
 * 确认对象是否在数组中
 * @method contains
 * @param {Array} arr 要操作的数组
 * @param {*} item 要搜索的对象
 * @returns {Boolean} 如果对象在数组中，返回 true
 * @example
 * console.info(contains([1,2,3,4,5], 3));	// true
 */

function contains (arr, item) {
	var index = arr.indexOf(item);
	return index >= 0;
}

module.exports = contains;

},{}],9:[function(require,module,exports){
/**
 * 删除数组中的对象
 * @method erase
 * @param {Array} arr 要操作的数组
 * @param {*} item 要清除的对象
 * @returns {Number} 对象原本所在位置
 * @example
 * console.info(erase([1,2,3,4,5],3));	// [1,2,4,5]
 */

function erase (arr, item) {
	var index = arr.indexOf(item);
	if (index >= 0) {
		arr.splice(index, 1);
	}
	return index;
}

module.exports = erase;

},{}],10:[function(require,module,exports){
/**
 * 查找符合条件的元素在数组中的位置
 * @method find
 * @param {Array} arr 要操作的数组
 * @param {Function} fn 条件函数
 * @param {Object} [context] 函数的this指向
 * @return {Array} 符合条件的元素在数组中的位置
 * @example
 * 	console.info(find([1,2,3,4,5], function (item) {
 * 		return item < 3;
 * 	});	// [0, 1]
 */

function find (arr, fn, context) {
	var positions = [];
	arr.forEach(function (item, index) {
		if (fn.call(context, item, index, arr)) {
			positions.push(index);
		}
	});
	return positions;
}

module.exports = find;

},{}],11:[function(require,module,exports){
/**
 * 数组扁平化
 * @method flatten
 * @param {array} arr 要操作的数组
 * @returns {array} 经过扁平化处理的数组
 * @example
 * console.info(flatten([1, [2,3], [4,5]]));	// [1,2,3,4,5]
 */

var $type = require('spore-kit-obj/type');

function flatten (arr) {
	var array = [];
	for (var i = 0, l = arr.length; i < l; i++) {
		var type = $type(arr[i]);
		if (type === 'null') {
			continue;
		}
		array = array.concat(
			type === 'array' ? flatten(arr[i]) : arr[i]
		);
	}
	return array;
}

module.exports = flatten;

},{"spore-kit-obj/type":14}],12:[function(require,module,exports){
/**
 * 确认对象是否在数组中，不存在则将对象插入到数组中
 * @method include
 * @param {Array} arr 要操作的数组
 * @param {*} item 要插入的对象
 * @returns {Array} 经过处理的源数组
 * @example
 * console.info(include([1,2,3],4));	// [1,2,3,4]
 * console.info(include([1,2,3],3));	// [1,2,3]
 */

var $contains = require('./contains');

function include (arr, item) {
	if (!$contains(arr, item)) {
		arr.push(item);
	}
	return arr;
}

module.exports = include;

},{"./contains":8}],13:[function(require,module,exports){
/**
 * # 类数组对象相关工具函数
 * @module spore-kit-arr
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/arr
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.arr.contains);
 *
 * // 单独引入 spore-kit-arr
 * var $arr = require('spore-kit-arr');
 * console.info($arr.contains);
 *
 * // 单独引入一个方法
 * var $contains = require('spore-kit-arr/contains');
 */

exports.contains = require('./contains');
exports.erase = require('./erase');
exports.find = require('./find');
exports.flatten = require('./flatten');
exports.include = require('./include');

},{"./contains":8,"./erase":9,"./find":10,"./flatten":11,"./include":12}],14:[function(require,module,exports){
/**
 * 获取数据类型
 * @method type
 * @param {*} item 任何类型数据
 * @returns {String} 对象类型
 * @example
 * type({}); // 'object'
 * type(1); // 'number'
 * type(''); // 'string'
 * type(function(){}); // 'function'
 * type(); // 'undefined'
 * type(null); // 'null'
 * type(new Date()); // 'date'
 * type(/a/); // 'regexp'
 * type(Symbol('a')); // 'symbol'
 * type(window) // 'window'
 * type(document) // 'htmldocument'
 * type(document.body) // 'htmlbodyelement'
 * type(document.head) // 'htmlheadelement'
 * type(document.getElementsByTagName('div')) // 'htmlcollection'
 * type(document.getElementsByTagName('div')[0]) // 'htmldivelement'
 */

function type (item) {
	return Object.prototype.toString
		.call(item)
		.toLowerCase()
		.replace(/^\[object\s*|\]$/gi, '');
}

module.exports = type;

},{}],15:[function(require,module,exports){
/**
 * 提供对 cookie 的读写能力
 * - 写入时自动用 encodeURIComponent 编码
 * - 读取时自动用 decodeURIComponent 解码
 * @module cookie
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * cookie.set('name', 'value', {
 * 	expires: 1
 * });
 * cookie.read('name')	// 'value'
 */

var Cookie = require('js-cookie');

var instance = Cookie.withConverter({
	read: function(val) {
		return decodeURIComponent(val);
	},
	write: function(val) {
		return encodeURIComponent(val);
	}
});

module.exports = instance;

},{"js-cookie":17}],16:[function(require,module,exports){
/**
 * # 本地存储相关工具函数
 * @module spore-kit-cookie
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/cookie
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.cookie.cookie);
 *
 * // 单独引入 spore-kit-cookie
 * var $cookie = require('spore-kit-cookie');
 * console.info($cookie.cookie);
 *
 * // 单独引入一个工具对象
 * var $cookie = require('spore-kit-cookie/cookie');
 */

exports.cookie = require('./cookie');
exports.origin = require('./origin');

},{"./cookie":15,"./origin":18}],17:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],18:[function(require,module,exports){
/**
 * 提供对 cookie 的读写能力
 * - 此模块直接提供 js-cookie 的原生能力，不做任何自动编解码
 * @module origin
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * origin.set('name', 'value', {
 * 	expires: 1
 * });
 * origin.read('name')	// 'value'
 */
module.exports = require('js-cookie');

},{"js-cookie":17}],19:[function(require,module,exports){
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
 * @method format
 * @param {Date} dobj 日期对象，或者可以被转换为日期对象的数据
 * @param {Object} [spec] 格式化选项
 * @param {Array} [spec.weekday='日一二三四五六'.split('')] 一周内各天对应名称，顺序从周日算起
 * @param {String} [spec.template='{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}'] 格式化模板
 * @return {String} 格式化完成的字符串
 * @example
 * 	console.info(
 * 		format(new Date(),{
 * 			template : '{{YYYY}}年{{MM}}月{{DD}}日 周{{d}} {{hh}}时{{mm}}分{{ss}}秒'
 * 		})
 * 	);
 * 	// 2015年09月09日 周三 14时19分42秒
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
	data.milliSeconds = dobj.getMilliseconds();

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

	data.mss = $fixTo(data.milliSeconds, 2);
	data.ms = data.milliSeconds;

	output = $substitute(conf.template, data);
	return output;
}

module.exports = format;

},{"spore-kit-num/fixTo":23,"spore-kit-obj/assign":24,"spore-kit-str/substitute":25}],20:[function(require,module,exports){
/**
 * 获取过去一段时间的起始日期，如3月前第1天，2周前第1天，3小时前整点
 * @method getLastStart
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @param {Number} count 多少单位时间之前
 * @returns {Date} 最近单位时间的起始时间对象
 * @example
 * var time = getLastStart(
 * 	new Date('2018-10-25'),
 * 	'month',
 * 	0
 * ).getTime(); // 1538323200000
 * new Date(time); // Mon Oct 01 2018 00:00:00 GMT+0800 (中国标准时间)
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
	if (!type) {
		throw new Error('required param type');
	}
	count = count || 0;
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
		stamp = new Date([year, month, 1].join('/'));
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

},{"./getTimeSplit":21}],21:[function(require,module,exports){
/**
 * 获取某个时间的 整年|整月|整日|整时|整分 时间对象
 * @method getTimeSplit
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @returns {Date} 时间整点对象
 * @example
 * new Date(
 * 	getTimeSplit(
 * 		'2018-09-20',
 * 		'month'
 * 	)
 * ).toGMTString();
 * // Sat Sep 01 2018 00:00:00 GMT+0800 (中国标准时间)
 *
 * new Date(
 * 	getTimeSplit(
 * 		'2018-09-20 19:23:36',
 * 		'hour'
 * 	)
 * ).toGMTString();
 * // Thu Sep 20 2018 19:00:00 GMT+0800 (中国标准时间)
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
	if (!type) {
		throw new Error('required param type');
	}

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

},{}],22:[function(require,module,exports){
/**
 * # 日期相关工具
 * @module spore-kit-date
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/date
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.date.format);
 *
 * // 单独引入 spore-kit-date
 * var $date = require('spore-kit-date');
 * console.info($date.format);
 *
 * // 单独引入一个方法
 * var $format = require('spore-kit-date/format');
 */

exports.format = require('./format');
exports.getLastStart = require('./getLastStart');
exports.getTimeSplit = require('./getTimeSplit');

},{"./format":19,"./getLastStart":20,"./getTimeSplit":21}],23:[function(require,module,exports){
/**
 * 修正补位
 * @method fixTo
 * @param {Number|String} num 要补位的数字
 * @param {Number} [w=2] w 补位数量
 * @return {String} 经过补位的字符串
 * @example
 * fixTo(0, 2);	//return '00'
 */

function fixTo (num, w) {
	var str = num.toString();
	w = Math.max((w || 2) - str.length + 1, 0);
	return new Array(w).join('0') + str;
}

module.exports = fixTo;

},{}],24:[function(require,module,exports){
module.exports=require(5)
},{}],25:[function(require,module,exports){
/**
 * 简单模板函数
 * @method substitute
 * @param {String} str 要替换模板的字符串
 * @param {Object} obj 模板对应的数据对象
 * @param {RegExp} [reg=/\\?\{\{([^{}]+)\}\}/g] 解析模板的正则表达式
 * @return {String} 替换了模板的字符串
 * @example
 * substitute('{{city}}欢迎您', {{city:'北京'}}); // '北京欢迎您'
 */

function substitute (str, obj, reg) {
	return str.replace(reg || (/\\?\{\{([^{}]+)\}\}/g), function (match, name) {
		if (match.charAt(0) === '\\') {
			return match.slice(1);
		}
		// 注意：obj[name] != null 等同于 obj[name] !== null && obj[name] !== undefined
		return (obj[name] != null) ? obj[name] : '';
	});
}

module.exports = substitute;

},{}],26:[function(require,module,exports){
/**
 * # DOM 操作相关工具函数
 * @module spore-kit-dom
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/dom
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.dom.isNode);
 *
 * // 单独引入 spore-kit-dom
 * var $dom = require('spore-kit-dom');
 * console.info($dom.isNode);
 *
 * // 单独引入一个方法
 * var $isNode = require('spore-kit-dom/isNode');
 */

exports.isNode = require('./isNode');
exports.offset = require('./offset');

},{"./isNode":27,"./offset":33}],27:[function(require,module,exports){
/**
 * 判断对象是否为dom元素
 * @param {Object} node 要判断的对象
 * @return {Boolean} 是否为dom元素
 */
function isNode(node) {
	return (
		node
		&& node.nodeName
		&& node.nodeType
	);
}

module.exports = isNode;

},{}],28:[function(require,module,exports){
var support = require('dom-support')
var getDocument = require('get-document')
var withinElement = require('within-element')

/**
 * Get offset of a DOM Element or Range within the document.
 *
 * @param {DOMElement|Range} el - the DOM element or Range instance to measure
 * @return {Object} An object with `top` and `left` Number values
 * @public
 */

module.exports = function offset(el) {
  var doc = getDocument(el)
  if (!doc) return

  // Make sure it's not a disconnected DOM node
  if (!withinElement(el, doc)) return

  var body = doc.body
  if (body === el) {
    return bodyOffset(el)
  }

  var box = { top: 0, left: 0 }
  if ( typeof el.getBoundingClientRect !== "undefined" ) {
    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    box = el.getBoundingClientRect()

    if (el.collapsed && box.left === 0 && box.top === 0) {
      // collapsed Range instances sometimes report 0, 0
      // see: http://stackoverflow.com/a/6847328/376773
      var span = doc.createElement("span");

      // Ensure span has dimensions and position by
      // adding a zero-width space character
      span.appendChild(doc.createTextNode("\u200b"));
      el.insertNode(span);
      box = span.getBoundingClientRect();

      // Remove temp SPAN and glue any broken text nodes back together
      var spanParent = span.parentNode;
      spanParent.removeChild(span);
      spanParent.normalize();
    }
  }

  var docEl = doc.documentElement
  var clientTop  = docEl.clientTop  || body.clientTop  || 0
  var clientLeft = docEl.clientLeft || body.clientLeft || 0
  var scrollTop  = window.pageYOffset || docEl.scrollTop
  var scrollLeft = window.pageXOffset || docEl.scrollLeft

  return {
    top: box.top  + scrollTop  - clientTop,
    left: box.left + scrollLeft - clientLeft
  }
}

function bodyOffset(body) {
  var top = body.offsetTop
  var left = body.offsetLeft

  if (support.doesNotIncludeMarginInBodyOffset) {
    top  += parseFloat(body.style.marginTop || 0)
    left += parseFloat(body.style.marginLeft || 0)
  }

  return {
    top: top,
    left: left
  }
}

},{"dom-support":29,"get-document":31,"within-element":32}],29:[function(require,module,exports){
var domready = require('domready')

module.exports = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( !div.addEventListener ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	domready(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

    //Check if table cells still have offsetWidth/Height when they are set
    //to display:none and there are still other visible table cells in a
    //table row; if so, offsetWidth/Height are not reliable for use when
    //determining if an element has been hidden directly using
    //display:none (it is still safe to use offsets if a parent element is
    //hidden; don safety goggles and see bug #4512 for more information).
    //(only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();

},{"domready":30}],30:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],31:[function(require,module,exports){

/**
 * Module exports.
 */

module.exports = getDocument;

// defined by w3c
var DOCUMENT_NODE = 9;

/**
 * Returns `true` if `w` is a Document object, or `false` otherwise.
 *
 * @param {?} d - Document object, maybe
 * @return {Boolean}
 * @private
 */

function isDocument (d) {
  return d && d.nodeType === DOCUMENT_NODE;
}

/**
 * Returns the `document` object associated with the given `node`, which may be
 * a DOM element, the Window object, a Selection, a Range. Basically any DOM
 * object that references the Document in some way, this function will find it.
 *
 * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
 * @return {Document} the `document` object associated with `node`
 * @public
 */

function getDocument(node) {
  if (isDocument(node)) {
    return node;

  } else if (isDocument(node.ownerDocument)) {
    return node.ownerDocument;

  } else if (isDocument(node.document)) {
    return node.document;

  } else if (node.parentNode) {
    return getDocument(node.parentNode);

  // Range support
  } else if (node.commonAncestorContainer) {
    return getDocument(node.commonAncestorContainer);

  } else if (node.startContainer) {
    return getDocument(node.startContainer);

  // Selection support
  } else if (node.anchorNode) {
    return getDocument(node.anchorNode);
  }
}

},{}],32:[function(require,module,exports){

/**
 * Check if the DOM element `child` is within the given `parent` DOM element.
 *
 * @param {DOMElement|Range} child - the DOM element or Range to check if it's within `parent`
 * @param {DOMElement} parent  - the parent node that `child` could be inside of
 * @return {Boolean} True if `child` is within `parent`. False otherwise.
 * @public
 */

module.exports = function within (child, parent) {
  // don't throw if `child` is null
  if (!child) return false;

  // Range support
  if (child.commonAncestorContainer) child = child.commonAncestorContainer;
  else if (child.endContainer) child = child.endContainer;

  // traverse up the `parentNode` properties until `parent` is found
  var node = child;
  while (node = node.parentNode) {
    if (node == parent) return true;
  }

  return false;
};

},{}],33:[function(require,module,exports){
/**
 * 获取 DOM 元素相对于 document 的边距
 * @method offset
 * @see https://github.com/timoxley/offset
 * @param {Object} node 要计算 offset 的 dom 对象
 * @return {Object} offset 对象
 * @example
 * var offset = require('document-offset')
 * var target = document.getElementById('target')
 * console.log(offset(target))
 * // {top: 69, left: 108}
 */

var offset = null;

if (typeof window !== 'undefined') {
	offset = require('document-offset');
}

module.exports = offset;

},{"document-offset":28}],34:[function(require,module,exports){
module.exports=require(4)
},{"./uaMatch":42,"spore-kit-obj/assign":39}],35:[function(require,module,exports){
/**
 * 检测浏览器核心
 *
 * 支持的类型检测
 * - trident
 * - presto
 * - webkit
 * - gecko
 * @method core
 * @returns {Object} UA 检查结果
 * @example
 * console.info(core().webkit);
 */

var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	trident: (/trident/i),
	presto: (/presto/i),
	webkit: (/webkit/i),
	gecko: function(ua) {
		return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
	}
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function core() {
	if (!result) {
		result = detect();
	}
	return result;
}

core.detect = detect;

module.exports = core;

},{"./uaMatch":42,"spore-kit-obj/assign":39}],36:[function(require,module,exports){
/**
 * 检测设备类型
 *
 * 支持的类型检测
 * - huawei
 * - oppo
 * - vivo
 * - xiaomi
 * - samsong
 * - iphone
 * @method device
 * @returns {Object} UA 检查结果
 * @example
 * console.info(device().huawei);
 */
var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	huawei: (/huawei/i),
	oppo: (/oppo/i),
	vivo: (/vivo/i),
	xiaomi: (/xiaomi/i),
	samsong: (/sm-/i),
	iphone: (/iphone/i)
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function device() {
	if (!result) {
		result = detect();
	}
	return result;
}

device.detect = detect;

module.exports = device;

},{"./uaMatch":42,"spore-kit-obj/assign":39}],37:[function(require,module,exports){
/**
 * # 环境检测与判断工具
 * @module spore-kit-env
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/env
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.env.touchable);
 *
 * // 单独引入 spore-kit-env
 * var $env = require('spore-kit-env');
 * console.info($env.touchable);
 *
 * // 单独引入一个方法
 * var $touchable = require('spore-kit-env/touchable');
 */

exports.browser = require('./browser');
exports.core = require('./core');
exports.device = require('./device');
exports.network = require('./network');
exports.os = require('./os');
exports.touchable = require('./touchable');
exports.uaMatch = require('./uaMatch');
exports.webp = require('./webp');

},{"./browser":34,"./core":35,"./device":36,"./network":38,"./os":40,"./touchable":41,"./uaMatch":42,"./webp":43}],38:[function(require,module,exports){
/**
 * 网络环境检测
 * @module network
 */

var supportOnline = null;

/**
 * 判断页面是否支持联网检测
 * @method network.support
 * @memberof network
 * @returns {Boolean} 是否支持联网检测
 * @example
 * network.support(); // true/false
 */
function support() {
	if (supportOnline === null) {
		supportOnline = !!('onLine' in window.navigator);
	}
	return supportOnline;
}

/**
 * 判断页面是否联网
 * @method network.onLine
 * @memberof network
 * @returns {Boolean} 是否联网
 * @example
 * network.onLine(); //true/false
 */
function onLine() {
	return support() ? window.navigator.onLine : true;
}

exports.support = support;
exports.onLine = onLine;

},{}],39:[function(require,module,exports){
module.exports=require(5)
},{}],40:[function(require,module,exports){
/**
 * 检测操作系统类型
 *
 * 支持的类型检测
 * - ios
 * - android
 * @method os
 * @returns {Object} UA 检查结果
 * @example
 * console.info(os().ios);
 */
var $assign = require('spore-kit-obj/assign');
var $uaMatch = require('./uaMatch');

var testers = {
	ios: /like mac os x/i,
	android: function(ua) {
		return ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
	}
};

function detect(options, checkers) {
	var conf = $assign({
		ua: ''
	}, options);

	$assign(testers, checkers);

	return $uaMatch(testers, conf.ua, conf);
}

var result = null;

function os() {
	if (!result) {
		result = detect();
	}
	return result;
}

os.detect = detect;

module.exports = os;

},{"./uaMatch":42,"spore-kit-obj/assign":39}],41:[function(require,module,exports){
/**
 * 判断浏览器是否支持触摸屏
 * @method touchable
 * @returns {Boolean} 是否支持触摸屏
 * @example
 * if (touchable()) {
 * 	//It is a touch device.
 * }
 */

var isTouchable = null;

function touchable() {
	if (isTouchable === null) {
		isTouchable = !!('ontouchstart' in window
		|| (window.DocumentTouch && document instanceof window.DocumentTouch));
	}
	return isTouchable;
}

module.exports = touchable;

},{}],42:[function(require,module,exports){
module.exports=require(6)
},{}],43:[function(require,module,exports){
var isSupportWebp = null;

/**
 * webp 相关检测
 * @module webp
 */

/**
 * 判断浏览器是否支持webp
 * @method webp.support
 * @memberof webp
 * @returns {Boolean} 是否支持webp
 * @example
 * console.info(webp.support()); // true/false
 */
function support() {
	if (isSupportWebp === null) {
		isSupportWebp = !![].map
			&& document
				.createElement('canvas')
				.toDataURL('image/webp')
				.indexOf('data:image/webp') === 0;
	}
	return isSupportWebp;
}

var webp = {};
webp.support = support;

module.exports = webp;

},{}],44:[function(require,module,exports){
/**
 * A module that can be mixed in to *any object* in order to provide it
 * with custom events. You may bind with `on` or remove with `off` callback
 * functions to an event; `trigger`-ing an event fires all callbacks in
 * succession.
 * - 一个可以被混合到任何对象的模块，用于提供自定义事件。
 * - 可以用 on, off 方法来绑定移除事件。
 * - 用 trigger 来触发事件通知。
 * @class Events
 * @see http://aralejs.org/
 * @see https://github.com/documentcloud/backbone/blob/master/backbone.js
 * @see https://github.com/joyent/node/blob/master/lib/events.js
 * @example
 * var Events = require('spore-kit-evt/events');
 *
 * var $kit = require('spore-kit');
 * var Events = $kit.evt.Events;
 */

// Regular expression used to split event strings
var eventSplitter = /\s+/;

// Helpers
// -------

var keys = Object.keys;

if (!keys) {
	keys = function(o) {
		var result = [];

		for (var name in o) {
			if (o.hasOwnProperty(name)) {
				result.push(name);
			}
		}
		return result;
	};
}

var Events = function() {};

/**
 * Bind one or more space separated events, `events`, to a `callback`
 * function. Passing `"all"` will bind the callback to all events fired.
 * - 绑定一个事件回调函数，或者用多个空格分隔来绑定多个事件回调函数。
 * - 传入参数 `'all'` 会在所有事件发生时被触发。
 * @method Events#on
 * @memberof Events
 * @param {String} events 事件名称
 * @param {Function} callback 事件回调函数
 * @param {Object} [context] 回调函数的执行环境对象
 * @example
 * var evt = new Events();
 *
 * // 绑定1个事件
 * evt.on('event-name', function () {});
 *
 * // 绑定2个事件
 * evt.on('event1 event2', function () {});
 *
 * // 绑定为所有事件
 * evt.on('all', function () {});
 */

Events.prototype.on = function(events, callback, context) {
	var cache;
	var event;
	var list;
	if (!callback) {
		return this;
	}

	cache = this.__events || (this.__events = {});
	events = events.split(eventSplitter);

	event = events.shift();
	while (event) {
		list = cache[event] || (cache[event] = []);
		list.push(callback, context);
		event = events.shift();
	}

	return this;
};

/**
 * Remove one or many callbacks. If `context` is null, removes all callbacks
 * with that function. If `callback` is null, removes all callbacks for the
 * event. If `events` is null, removes all bound callbacks for all events.
 * - 移除一个或者多个事件回调函数。
 * - 如果不传递 callback 参数，会移除所有该时间名称的事件回调函数。
 * - 如果不指定事件名称，移除所有自定义事件回调函数。
 * @method Events#off
 * @memberof Events
 * @param {String} [events] 事件名称
 * @param {Function} [callback] 要移除的事件回调函数
 * @param {Object} [context] 要移除的回调函数的执行环境对象
 * @example
 * var evt = new Events();
 * var bound = {};
 * bound.test = function () {};
 *
 * // 移除事件名为 event-name 的事件回调函数 bound.test
 * evt.off('event-name', bound.test);
 *
 * // 移除事件名为 'event' 的所有事件回调函数
 * evt.off('event');
 *
 * // 移除所有自定义事件
 * evt.off();
 */

Events.prototype.off = function(events, callback, context) {
	var cache;
	var event;
	var list;
	var i;

	// No events, or removing *all* events.
	cache = this.__events;
	if (!cache) {
		return this;
	}
	if (!(events || callback || context)) {
		delete this.__events;
		return this;
	}

	events = events ? events.split(eventSplitter) : keys(cache);

	// Loop through the callback list, splicing where appropriate.
	for (event = events.shift(); event; event = events.shift()) {
		list = cache[event];
		if (!list) {
			continue;
		}

		if (!(callback || context)) {
			delete cache[event];
			continue;
		}

		for (i = list.length - 2; i >= 0; i -= 2) {
			if (
				!(
					(callback && list[i] !== callback)
					|| (context && list[i + 1] !== context)
				)
			) {
				list.splice(i, 2);
			}
		}
	}

	return this;
};

/**
 * Trigger one or many events, firing all bound callbacks. Callbacks are
 * passed the same arguments as `trigger` is, apart from the event name
 * (unless you're listening on `"all"`, which will cause your callback to
 * receive the true name of the event as the first argument).
 * - 派发一个或者多个事件，会触发对应事件名称绑定的所有事件函数。
 * - 第一个参数是事件名称，剩下其他参数将作为事件回调的参数。
 * @method Events#trigger
 * @memberof Events
 * @param {string} events 事件名称
 * @param {...*} [arg] 事件参数
 * @example
 * var evt = new Events();
 *
 * // 触发事件名为 'event-name' 的事件
 * evt.trigger('event-name');
 *
 * // 同时触发2个事件
 * evt.trigger('event1 event2');
 *
 * // 触发事件同时传递参数
 * evt.on('event-x', function (a, b) {
 * 	console.info(a, b); // 1, 2
 * });
 * evt.trigger('event-x', 1, 2);
 */
Events.prototype.trigger = function(events) {
	var cache;
	var event;
	var all;
	var list;
	var i;
	var len;
	var rest = [];
	var args;

	cache = this.__events;
	if (!cache) {
		return this;
	}

	events = events.split(eventSplitter);

	// Fill up `rest` with the callback arguments.  Since we're only copying
	// the tail of `arguments`, a loop is much faster than Array#slice.
	for (i = 1, len = arguments.length; i < len; i++) {
		rest[i - 1] = arguments[i];
	}

	// For each event, walk through the list of callbacks twice, first to
	// trigger the event, then to trigger any `"all"` callbacks.
	for (event = events.shift(); event; event = events.shift()) {
		// Copy callback lists to prevent modification.
		all = cache.all;
		if (all) {
			all = all.slice();
		}

		list = cache[event];
		if (list) {
			list = list.slice();
		}

		// Execute event callbacks.
		if (list) {
			for (i = 0, len = list.length; i < len; i += 2) {
				list[i].apply(list[i + 1] || this, rest);
			}
		}

		// Execute "all" callbacks.
		if (all) {
			args = [event].concat(rest);
			for (i = 0, len = all.length; i < len; i += 2) {
				all[i].apply(all[i + 1] || this, args);
			}
		}
	}

	return this;
};

/**
 * Mix `Events` to object instance or Class function.
 * - 将自定事件对象，混合到一个类的实例。
 * @method Events.mixTo
 * @memberof Events
 * @param {Object} receiver 要混合事件函数的对象
 * @example
 * // 给一个实例混合自定义事件方法
 * var obj = {};
 * Events.mixTo(obj);
 *
 * // 生成一个实例
 * var o1 = Object.create(obj);
 *
 * // 可以在这个对象上调用自定义事件的方法了
 * o1.on('event', function () {});
 */
Events.mixTo = function(receiver) {
	receiver = receiver.prototype || receiver;
	var proto = Events.prototype;

	for (var p in proto) {
		if (proto.hasOwnProperty(p)) {
			receiver[p] = proto[p];
		}
	}
};

module.exports = Events;

},{}],45:[function(require,module,exports){
/**
 * # 处理事件与广播
 * @module spore-kit-evt
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/evt
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.evt.occurInside);
 *
 * // 单独引入 spore-kit-evt
 * var $evt = require('spore-kit-evt');
 * console.info($evt.occurInside);
 *
 * // 单独引入一个方法
 * var $occurInside = require('spore-kit-evt/occurInside');
 */

exports.Events = require('./events');
exports.Listener = require('./listener');
exports.occurInside = require('./occurInside');
exports.tapStop = require('./tapStop');

},{"./events":44,"./listener":46,"./occurInside":47,"./tapStop":48}],46:[function(require,module,exports){
/**
 * 广播组件
 * - 构造实例时，需要传入事件白名单列表。
 * - 只有在白名单列表上的事件才可以被触发。
 * - 事件添加，移除，激发的调用方法参考 Events。
 * @see spore-kit-evt/events
 * @class Listener
 * @example
 * @example
 * var Listener = require('spore-kit-evt/listener');
 *
 * var $kit = require('spore-kit');
 * var Listener = $kit.evt.Listener;
 *
 * // 白名单里只记录了 event1 事件
 * var channelGlobal = new Listener([
 * 	'event1'
 * ]);
 * channelGlobal.on('event1', function(){
 * 	console.log('event1');
 * });
 * channelGlobal.on('event2', function(){
 * 	// will not run
 * 	console.log('event2');
 * });
 * channelGlobal.trigger('event1');
 * channelGlobal.trigger('event2');
 */

var $events = require('./events');

var Listener = function(events) {
	this._whiteList = {};
	this._receiver = new $events();
	if (Array.isArray(events)) {
		events.forEach(this.define.bind(this));
	}
};

Listener.prototype = {
	constructor: Listener,
	/**
	 * 在白名单上定义一个事件名称
	 * @method Listener.prototype.define
	 * @memberof Listener
	 * @param {String} eventName
	 */
	define: function(eventName) {
		this._whiteList[eventName] = true;
	},
	/**
	 * 移除白名单上定义的事件名称
	 * @method Listener.prototype.undefine
	 * @memberof Listener
	 * @param {String} eventName
	 */
	undefine: function(eventName) {
		delete this._whiteList[eventName];
	},
	/**
	 * 广播组件绑定事件
	 * @see <a href="#events-prototype-on">events.prototype.on</a>
	 * @method Listener.prototype.on
	 * @memberof Listener
	 * @param {String} eventName 要绑定的事件名称
	 * @param {Function} fn 要绑定的事件回调函数
	 */
	on: function() {
		this._receiver.on.apply(this._receiver, arguments);
	},
	/**
	 * 广播组件移除事件
	 * @see <a href="#events-prototype-off">events.prototype.off</a>
	 * @method Listener.prototype.off
	 * @memberof Listener
	 * @param {String} eventName 要移除绑定的事件名称
	 * @param {Function} fn 要移除绑定的事件回调函数
	 */
	off: function() {
		this._receiver.off.apply(this._receiver, arguments);
	},
	/**
	 * 广播组件派发事件
	 * @see <a href="#events-prototype-trigger">events.prototype.trigger</a>
	 * @method Listener.prototype.trigger
	 * @memberof Listener
	 * @param {String} eventName 要触发的事件名称
	 * @param {...*} [arg] 事件参数
	 */
	trigger: function(events) {
		var rest = [].slice.call(arguments, 1);

		// 按照Events.trigger的调用方式，第一个参数是用空格分隔的事件名称列表
		events = events.split(/\s+/);

		// 遍历事件列表，依据白名单决定事件是否激发
		events.forEach(function(evtName) {
			if (this._whiteList[evtName]) {
				this._receiver.trigger.apply(this._receiver, [evtName].concat(rest));
			}
		}.bind(this));
	}
};

module.exports = Listener;

},{"./events":44}],47:[function(require,module,exports){
/**
 * 判断事件是否发生在一个 Dom 元素内。
 * - 常用于判断点击事件发生在浮层外时关闭浮层。
 * @method occurInside
 * @param {Object} event 浏览器事件对象
 * @param {Object} node 用于比较事件发生区域的 Dom 对象
 * @returns {Boolean} 事件是否发生在 node 内
 * @example
 * $('.layer').on('click', function(evt){
 * 	if(occurInside(evt, $(this).find('close').get(0))){
 * 		$(this).hide();
 * 	}
 * });
 */

function occurInside(event, node) {
	if (node && event && event.target) {
		var pos = event.target;
		while (pos) {
			if (pos === node) {
				return true;
			} else {
				pos = pos.parentNode;
			}
		}
	}
	return false;
}

module.exports = occurInside;

},{}],48:[function(require,module,exports){
/**
 * 用遮罩的方式阻止 tap 事件穿透引发表单元素获取焦点。
 * - 推荐用 fastclick 来解决触屏事件穿透问题。
 * - 此组件用在 fastclick 未能解决问题时。或者不方便使用 fastclick 时。
 * @method tapStop
 * @param {Object} options 点击选项
 * @param {Number} options.delay 临时浮层在这个延迟时间(ms)之后关闭
 * @example
 * $('.mask').on('tap', function(){
 * 	tapStop();
 * 	$(this).hide();
 * });
 */
var miniMask = null;
var pos = {};
var timer = null;
var touchStartBound = false;

var tapStop = function(options) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var conf = $.extend({
		// 遮罩存在时间
		delay: 500
	}, options);

	if (!miniMask) {
		miniMask = $('<div></div>');
		miniMask.css({
			'display': 'none',
			'position': 'absolute',
			'left': 0,
			'top': 0,
			'margin-left': '-20px',
			'margin-top': '-20px',
			'z-index': 10000,
			'background-color': 'rgba(0,0,0,0)',
			'width': '40px',
			'height': '40px'
		}).appendTo(document.body);
	}

	if (!touchStartBound) {
		$(document).on('touchstart', function(evt) {
			if (!(evt && evt.touches && evt.touches.length)) {
				return;
			}
			var touch = evt.touches[0];
			pos.pageX = touch.pageX;
			pos.pageY = touch.pageY;
		});
		touchStartBound = true;
	}

	var delay = parseInt(conf.delay, 10) || 0;
	miniMask.show().css({
		'left': pos.pageX + 'px',
		'top': pos.pageY + 'px'
	});
	clearTimeout(timer);
	timer = setTimeout(function() {
		miniMask.hide();
	}, delay);
};

module.exports = tapStop;

},{}],49:[function(require,module,exports){
/**
 * 包装为延迟触发的函数
 * - 用于处理密集事件，延迟时间内同时触发的函数调用。
 * - 最终只在最后一次调用延迟后，执行一次。
 * @method delay
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} duration 延迟时间(ms)
 * @param {Object} [bind] 函数的this指向
 * @returns {Function} 经过包装的延迟触发函数
 * @example
 *	var comp = {
 *		countWords : function(){
 *			console.info(this.length);
 *		}
 *	};
 *
 *  // 疯狂点击 input ，停下来 500 ms 后，触发函数调用
 *	$('#input').keydown(delay(function(){
 *		this.length = $('#input').val().length;
 *		this.countWords();
 *	}, 500, comp));
 */

function delay (fn, duration, bind) {
	var timer = null;
	return function () {
		bind = bind || this;
		if (timer) {
			clearTimeout(timer);
		}
		var args = arguments;
		timer = setTimeout(function () {
			if (typeof fn === 'function') {
				fn.apply(bind, args);
			}
		}, duration);
	};
}

module.exports = delay;

},{}],50:[function(require,module,exports){
/**
 * # 函数包装，获取特殊执行方式
 * @module spore-kit-fn
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fn
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fn.delay);
 *
 * // 单独引入 spore-kit-fn
 * var $fn = require('spore-kit-fn');
 * console.info($fn.delay);
 *
 * // 单独引入一个方法
 * var $delay = require('spore-kit-fn/delay');
 */

exports.delay = require('./delay');
exports.lock = require('./lock');
exports.once = require('./once');
exports.queue = require('./queue');
exports.prepare = require('./prepare');
exports.regular = require('./regular');

},{"./delay":49,"./lock":51,"./once":52,"./prepare":53,"./queue":54,"./regular":55}],51:[function(require,module,exports){
/**
 * 包装为触发一次后，预置时间内不能再次触发的函数
 * - 类似于技能冷却。
 * @method lock
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的冷却触发函数
 * @example
 *	var request = function () {
 *		console.info('do request');
 *	};
 *	$('#input').keydown(lock(request, 500));
 *	// 第一次按键，就会触发一次函数调用
 *	// 之后连续按键，仅在 500ms 结束后再次按键，才会再次触发 request 函数调用
 */

function lock (fn, delay, bind) {
	var timer = null;
	return function() {
		if (timer) {
			return;
		}
		bind = bind || this;
		var args = arguments;
		timer = setTimeout(function () {
			timer = null;
		}, delay);
		if (typeof fn === 'function') {
			fn.apply(bind, args);
		}
	};
}

module.exports = lock;

},{}],52:[function(require,module,exports){
/**
 * 包装为仅触发一次的函数
 * - 被包装的函数智能执行一次，之后不会再执行
 * @method once
 * @param {Function} fn 要延迟触发的函数
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 该函数仅能触发执行一次
 * @example
 *	var fn = once(function () {
 *		console.info('output');
 *	});
 *	fn(); // 'output'
 *	fn(); // will do nothing
 */

function once (fn, bind) {
	return function () {
		bind = bind || this;
		if (typeof fn === 'function') {
			fn.apply(bind, arguments);
			fn = null;
			bind = null;
		}
	};
}

module.exports = once;

},{}],53:[function(require,module,exports){
/**
 * 包装为一个条件触发管理器
 * - 调用管理器的 ready 函数来激活条件。
 * - 之前插入管理器的函数按队列顺序执行。
 * - 之后插入管理器的函数立即执行。
 * - 作用机制类似 jQuery.ready, 可以设置任何条件。
 * @module prepare
 * @returns {Function} 条件触发管理器函数，传入一个 function 作为任务执行函数参数
 * @example
 *	// 生成一个管理器函数 timeReady
 *	var timeReady = prepare();
 *
 *	// 设置条件为2秒后就绪
 *	setTimeout(function () {
 *		timeReady.ready();
 *	}, 2000);
 *
 *	// 调用管理器函数 timeReady，插入要执行的任务函数
 *	timeReady(function () {
 *		// 2 秒后输出 1
 *		console.info(1);
 *	});
 *
 *	// 调用管理器函数 timeReady，插入要执行的任务函数
 *	timeReady(function () {
 *		// 2 秒后输出 2
 *		console.info(2);
 *	});
 *
 *	// 2100ms 后执行
 *	setTimeout(function () {
 *		// 调用管理器函数 timeReady，插入要执行的任务函数
 *		timeReady(function () {
 *			// 立即执行，输出 3
 *			console.info(3);
 *		});
 *	}, 2100);
 */

/**
 * 激活任务管理器的触发条件，在此之前插入管理器的任务按队列顺序执行，之后插入的任务函数立即执行。
 * @method prepare#ready
 * @memberof prepare
 */
function prepare () {
	var queue = [];
	var condition = false;
	var model;

	var attampt = function(fn) {
		if (condition) {
			if (typeof fn === 'function') {
				fn(model);
			}
		} else {
			queue.push(fn);
		}
	};

	attampt.ready = function(data) {
		condition = true;
		model = data;
		while (queue.length) {
			var fn = queue.shift();
			if (typeof fn === 'function') {
				fn(model);
			}
		}
	};

	return attampt;
}

module.exports = prepare;

},{}],54:[function(require,module,exports){
/**
 * 包装为一个队列，按设置的时间间隔触发任务函数
 * - 插入队列的所有函数都会执行，但每次执行之间都会有一个固定的时间间隔。
 * @method queue
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的队列触发函数
 * @example
 *	var t1 = Date.now();
 *	var doSomthing = queue(function (index) {
 *		console.info(index + ':' + (Date.now() - t1));
 *	}, 200);
 *	// 每隔200ms输出一个日志。
 *	for(var i = 0; i < 10; i++){
 *		doSomthing(i);
 *	}
 */

function queue (fn, delay, bind) {
	var timer = null;
	var arr = [];
	return function() {
		bind = bind || this;
		var args = arguments;
		arr.push(function () {
			if (typeof fn === 'function') {
				fn.apply(bind, args);
			}
		});
		if (!timer) {
			timer = setInterval(function () {
				if (!arr.length) {
					clearInterval(timer);
					timer = null;
				} else {
					arr.shift()();
				}
			}, delay);
		}
	};
}

module.exports = queue;

},{}],55:[function(require,module,exports){
/**
 * 包装为规律触发的函数，用于降低密集事件的处理频率
 * - 在疯狂操作期间，按照规律时间间隔，来调用任务函数
 * @method reqular
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @return {Function} 经过包装的定时触发函数
 * @example
 *	var comp = {
 *		countWords : function(){
 *			console.info(this.length);
 *		}
 *	};
 *	// 疯狂按键，每隔 200ms 才有一次按键有效
 *	$('#input').keydown(regular(function(){
 *		this.length = $('#input').val().length;
 *		this.countWords();
 *	}, 200, comp));
 */

function reqular (fn, delay, bind) {
	var enable = true;
	var timer = null;
	return function () {
		bind = bind || this;
		enable = true;
		var args = arguments;
		if (!timer) {
			timer = setInterval(function () {
				if (typeof fn === 'function') {
					fn.apply(bind, args);
				}
				if (!enable) {
					clearInterval(timer);
					timer = null;
				}
				enable = false;
			}, delay);
		}
	};
}

module.exports = reqular;

},{}],56:[function(require,module,exports){
/**
 * 简单的 Easing Functions
 * - 值域变化范围，从 [0, 1] 到 [0, 1]
 * - 即输入值范围从 0 到 1
 * - 输出也为从 0 到 1
 * - 适合进行百分比动画运算
 *
 * 动画函数
 * - linear
 * - easeInQuad
 * - easeOutQuad
 * - easeInOutQuad
 * - easeInCubic
 * - easeInQuart
 * - easeOutQuart
 * - easeInOutQuart
 * - easeInQuint
 * - easeOutQuint
 * - easeInOutQuint
 * @module easing
 * @see https://gist.github.com/gre/1650294
 * @example
 * easing.linear(0.5); // 0.5
 * easing.easeInQuad(0.5); // 0.25
 * easing.easeInCubic(0.5); // 0.125
 */
var easing = {
	// no easing, no acceleration
	linear: function(t) {
		return t;
	},
	// accelerating from zero velocity
	easeInQuad: function(t) {
		return t * t;
	},
	// decelerating to zero velocity
	easeOutQuad: function(t) {
		return t * (2 - t);
	},
	// acceleration until halfway, then deceleration
	easeInOutQuad: function(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	},
	// accelerating from zero velocity
	easeInCubic: function(t) {
		return t * t * t;
	},
	// decelerating to zero velocity
	easeOutCubic: function(t) {
		return (--t) * t * t + 1;
	},
	// acceleration until halfway, then deceleration
	easeInOutCubic: function(t) {
		return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	},
	// accelerating from zero velocity
	easeInQuart: function(t) {
		return t * t * t * t;
	},
	// decelerating to zero velocity
	easeOutQuart: function(t) {
		return 1 - (--t) * t * t * t;
	},
	// acceleration until halfway, then deceleration
	easeInOutQuart: function(t) {
		return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
	},
	// accelerating from zero velocity
	easeInQuint: function(t) {
		return t * t * t * t * t;
	},
	// decelerating to zero velocity
	easeOutQuint: function(t) {
		return 1 + (--t) * t * t * t * t;
	},
	// acceleration until halfway, then deceleration
	easeInOutQuint: function(t) {
		return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
	}
};

module.exports = easing;

},{}],57:[function(require,module,exports){
/**
 * 封装闪烁动作
 * @method flashAction
 * @param {object} options 选项
 * @param {number} [options.times=3] 闪烁次数，默认3次
 * @param {number} [options.delay=100] 闪烁间隔时间(ms)
 * @param {function} [options.actionOdd] 奇数回调
 * @param {function} [options.actionEven] 偶数回调
 * @param {function} [options.recover] 状态恢复回调
 * @example
 * 	// 文字闪烁，奇数次呈现为红色，偶数次成纤维蓝色，动画结束呈现为黑色
 *	var text = $('#target span.txt');
 *	$flashAction({
 *		actionOdd : function (){
 *			text.css('color', '#f00');
 *		},
 *		actionEven : function (){
 *			text.css('color', '#00f');
 *		},
 *		recover : function (){
 *			text.css('color', '#000');
 *		}
 *	});
 */
var $assign = require('spore-kit-obj/assign');

function flashAction (options) {
	var conf = $assign(
		{
			times: 3,
			delay: 100,
			actionOdd: null,
			actionEven: null,
			recover: null
		},
		options
	);

	var queue = [];
	for (var i = 0; i < conf.times * 2 + 1; i++) {
		queue.push((i + 1) * conf.delay);
	}

	queue.forEach(function (time, index) {
		setTimeout(function () {
			if (index >= queue.length - 1) {
				if (conf.recover === 'function') {
					conf.recover();
				}
			} else if (index % 2 === 0) {
				if (typeof conf.actionEven === 'function') {
					conf.actionEven();
				}
			} else if (typeof conf.actionOdd === 'function') {
				conf.actionOdd();
			}
		}, time);
	});
}

module.exports = flashAction;

},{"spore-kit-obj/assign":64}],58:[function(require,module,exports){
/**
 * 动画类 - 用于处理不适合使用 transition 的动画场景
 *
 * 可绑定的事件
 * - start 动画开始时触发
 * - complete 动画已完成
 * - stop 动画尚未完成就被中断
 * - cancel 动画被取消
 * @class Fx
 * @see https://mootools.net/core/docs/1.6.0/Fx/Fx
 * @constructor
 * @param {Object} [options] 动画选项
 * @param {Number} [options.fps=60] 帧速率(f/s)，实际上动画运行的最高帧速率不会高于 requestAnimationFrame 提供的帧速率
 * @param {Number} [options.duration=500] 动画持续时间(ms)
 * @param {String|Function} [options.transition] 动画执行方式，参见 spore-kit-fx/transitions
 * @param {Number} [options.frames] 从哪一帧开始执行
 * @param {Boolean} [options.frameSkip=true] 是否跳帧
 * @param {String} [options.link='ignore'] 动画衔接方式，可选：['ignore', 'cancel']
 * @example
 *	var fx = new Fx({
 *		duration : 1000
 *	});
 *	fx.set = function (now) {
 *		node.style.marginLeft = now + 'px';
 *	};
 *	fx.on('complete', function(){
 *		console.info('animation end');
 *	});
 *	fx.start(0, 600);  // 1秒内数字从0增加到600
 */

var $klass = require('klass');
var $events = require('spore-kit-evt/events');
var $erase = require('spore-kit-arr/erase');
var $contains = require('spore-kit-arr/contains');
var $assign = require('spore-kit-obj/assign');
var $timer = require('./timer');

// global timers
// 使用公共定时器可以减少浏览器资源消耗
var instances = {};
var timers = {};

var loop = function () {
	var now = Date.now();
	for (var i = this.length; i--;) {
		var instance = this[i];
		if (instance) {
			instance.step(now);
		}
	}
};

var pushInstance = function (fps) {
	var list = instances[fps] || (instances[fps] = []);
	list.push(this);
	if (!timers[fps]) {
		timers[fps] = $timer.setInterval(
			loop.bind(list),
			Math.round(1000 / fps)
		);
	}
};

var pullInstance = function (fps) {
	var list = instances[fps];
	if (list) {
		$erase(list, this);
		if (!list.length && timers[fps]) {
			delete instances[fps];
			timers[fps] = $timer.clearInterval(timers[fps]);
		}
	}
};

var Fx = $klass({
	initialize: function (options) {
		this.options = $assign(
			{
				fps: 60,
				duration: 500,
				transition: null,
				frames: null,
				frameSkip: true,
				link: 'ignore'
			},
			options
		);
	},

	/**
	 * 设置实例的选项
	 * @method Fx#setOptions
	 * @memberof Fx
	 * @param {Object} options 动画选项
	 */
	setOptions: function (options) {
		this.conf = $assign({}, this.options, options);
	},

	/**
	 * 设置动画的执行方式，配置缓动效果
	 * @interface Fx#getTransition
	 * @memberof Fx
	 * @example
	 *	var fx = new Fx();
	 *	fx.getTransition = function () {
	 *		return function (p) {
	 *			return -(Math.cos(Math.PI * p) - 1) / 2;
	 *		};
	 *	};
	 */
	getTransition: function () {
		return function (p) {
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function (now) {
		if (this.options.frameSkip) {
			var diff = this.time != null ? now - this.time : 0;
			var frames = diff / this.frameInterval;
			this.time = now;
			this.frame += frames;
		} else {
			this.frame++;
		}

		if (this.frame < this.frames) {
			var delta = this.transition(this.frame / this.frames);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.frame = this.frames;
			this.set(this.compute(this.from, this.to, 1));
			this.stop();
		}
	},

	/**
	 * 设置当前动画帧的过渡数值
	 * @interface Fx#set
	 * @memberof Fx
	 * @param {Number} now 当前动画帧的过渡数值
	 * @example
	 *	var fx = new Fx();
	 *	fx.set = function (now) {
	 *		node.style.marginLeft = now + 'px';
	 *	};
	 */
	set: function (now) {
		return now;
	},

	compute: function (from, to, delta) {
		return Fx.compute(from, to, delta);
	},

	check: function () {
		if (!this.isRunning()) {
			return true;
		}
		if (this.options.link === 'cancel') {
			this.cancel();
			return true;
		}
		return false;
	},

	/**
	 * 开始执行动画
	 * @method Fx#start
	 * @memberof Fx
	 * @param {Number} from 动画开始数值
	 * @param {Number} to 动画结束数值
	 * @example
	 *	var fx = new Fx();
	 *	fx.start(); // 开始动画
	 */
	start: function (from, to) {
		if (!this.check(from, to)) {
			return this;
		}
		this.from = from;
		this.to = to;
		this.frame = this.options.frameSkip ? 0 : -1;
		this.time = null;
		this.transition = this.getTransition();
		var frames = this.options.frames;
		var fps = this.options.fps;
		var duration = this.options.duration;
		this.duration = Fx.Durations[duration] || parseInt(duration, 10) || 0;
		this.frameInterval = 1000 / fps;
		this.frames = frames || Math.round(this.duration / this.frameInterval);
		this.trigger('start');
		pushInstance.call(this, fps);
		return this;
	},

	/**
	 * 停止动画
	 * @method Fx#stop
	 * @memberof Fx
	 * @example
	 *	var fx = new Fx();
	 *	fx.start();
	 *	fx.stop(); // 立刻停止动画
	 */
	stop: function () {
		if (this.isRunning()) {
			this.time = null;
			pullInstance.call(this, this.options.fps);
			if (this.frames === this.frame) {
				this.trigger('complete');
			} else {
				this.trigger('stop');
			}
		}
		return this;
	},

	/**
	 * 取消动画
	 * @method Fx#cancel
	 * @memberof Fx
	 * @example
	 *	var fx = new Fx();
	 *	fx.start();
	 *	fx.cancel(); // 立刻取消动画
	 */
	cancel: function () {
		if (this.isRunning()) {
			this.time = null;
			pullInstance.call(this, this.options.fps);
			this.frame = this.frames;
			this.trigger('cancel');
		}
		return this;
	},

	/**
	 * 暂停动画
	 * @method Fx#pause
	 * @memberof Fx
	 * @example
	 *	var fx = new Fx();
	 *	fx.start();
	 *	fx.pause(); // 立刻暂停动画
	 */
	pause: function () {
		if (this.isRunning()) {
			this.time = null;
			pullInstance.call(this, this.options.fps);
		}
		return this;
	},

	/**
	 * 继续执行动画
	 * @method Fx#resume
	 * @memberof Fx
	 * @example
	 *	var fx = new Fx();
	 *	fx.start();
	 *	fx.pause();
	 *	fx.resume(); // 立刻继续动画
	 */
	resume: function () {
		if (this.frame < this.frames && !this.isRunning()) {
			pushInstance.call(this, this.options.fps);
		}
		return this;
	},

	/**
	 * 判断动画是否正在运行
	 * @method Fx#isRunning
	 * @memberof Fx
	 * @returns {Boolean} 动画是否正在运行
	 * @example
	 *	var fx = new Fx();
	 *	fx.start();
	 *	fx.pause();
	 *	fx.isRunning(); // false
	 */
	isRunning: function () {
		var list = instances[this.options.fps];
		return list && $contains(list, this);
	}
});

$events.mixTo(Fx);

Fx.compute = function (from, to, delta) {
	return (to - from) * delta + from;
};

Fx.Durations = { short: 250, normal: 500, long: 1000 };

module.exports = Fx;

},{"./timer":68,"klass":60,"spore-kit-arr/contains":61,"spore-kit-arr/erase":62,"spore-kit-evt/events":63,"spore-kit-obj/assign":64}],59:[function(require,module,exports){
/**
 * # 动画交互相关工具
 * @module spore-kit-fx
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fx
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fx.smoothScrollTo);
 *
 * // 单独引入 spore-kit-fx
 * var $fx = require('spore-kit-fx');
 * console.info($fx.smoothScrollTo);
 *
 * // 单独引入一个方法
 * var $smoothScrollTo = require('spore-kit-fx/smoothScrollTo');
 */

exports.easing = require('./easing');
exports.flashAction = require('./flashAction');
exports.Fx = require('./fx');
exports.smoothScrollTo = require('./smoothScrollTo');
exports.sticky = require('./sticky');
exports.timer = require('./timer');
exports.transitions = require('./transitions');

},{"./easing":56,"./flashAction":57,"./fx":58,"./smoothScrollTo":66,"./sticky":67,"./timer":68,"./transitions":69}],60:[function(require,module,exports){
/*!
  * klass: a classical JS OOP façade
  * https://github.com/ded/klass
  * License MIT (c) Dustin Diaz 2014
  */

!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klass', this, function () {
  var context = this
    , f = 'function'
    , fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/
    , proto = 'prototype'

  function klass(o) {
    return extend.call(isFn(o) ? o : function () {}, o, 1)
  }

  function isFn(o) {
    return typeof o === f
  }

  function wrap(k, fn, supr) {
    return function () {
      var tmp = this.supr
      this.supr = supr[proto][k]
      var undef = {}.fabricatedUndefined
      var ret = undef
      try {
        ret = fn.apply(this, arguments)
      } finally {
        this.supr = tmp
      }
      return ret
    }
  }

  function process(what, o, supr) {
    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        what[k] = isFn(o[k])
          && isFn(supr[proto][k])
          && fnTest.test(o[k])
          ? wrap(k, o[k], supr) : o[k]
      }
    }
  }

  function extend(o, fromSub) {
    // must redefine noop each time so it doesn't inherit from previous arbitrary classes
    function noop() {}
    noop[proto] = this[proto]
    var supr = this
      , prototype = new noop()
      , isFunction = isFn(o)
      , _constructor = isFunction ? o : this
      , _methods = isFunction ? {} : o
    function fn() {
      if (this.initialize) this.initialize.apply(this, arguments)
      else {
        fromSub || isFunction && supr.apply(this, arguments)
        _constructor.apply(this, arguments)
      }
    }

    fn.methods = function (o) {
      process(prototype, o, supr)
      fn[proto] = prototype
      return this
    }

    fn.methods.call(fn, _methods).prototype.constructor = fn

    fn.extend = arguments.callee
    fn[proto].implement = fn.statics = function (o, optFn) {
      o = typeof o == 'string' ? (function () {
        var obj = {}
        obj[o] = optFn
        return obj
      }()) : o
      process(this, o, supr)
      return this
    }

    return fn
  }

  return klass
});

},{}],61:[function(require,module,exports){
module.exports=require(8)
},{}],62:[function(require,module,exports){
module.exports=require(9)
},{}],63:[function(require,module,exports){
module.exports=require(44)
},{}],64:[function(require,module,exports){
module.exports=require(5)
},{}],65:[function(require,module,exports){
module.exports=require(14)
},{}],66:[function(require,module,exports){
/**
 * 平滑滚动到某个元素，只进行垂直方向的滚动
 * - requires jQuery/Zepto
 * @method smoothScrollTo
 * @param {Object} node 目标DOM元素
 * @param {Object} spec 选项
 * @param {Number} [spec.delta=0] 目标滚动位置与目标元素顶部的间距，可以为负值
 * @param {Number} [spec.maxDelay=3000] 动画执行时间限制(ms)，动画执行超过此时间则直接停止，立刻滚动到目标位置
 * @param {Function} [options.callback] 滚动完成的回调函数
 * @example
 * // 滚动到页面顶端
 * smoothScrollTo(document.body);
 */

var $assign = require('spore-kit-obj/assign');

function smoothScrollTo (node, spec) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var conf = $assign(
		{
			delta: 0,
			maxDelay: 3000,
			callback: null
		},
		spec
	);

	var offset = $(node).offset();
	var target = offset.top + conf.delta;
	var callback = conf.callback;

	var prevStep;
	var stayCount = 3;

	var timer = null;

	var stopTimer = function () {
		if (timer) {
			clearInterval(timer);
			timer = null;
			window.scrollTo(0, target);
			if ($.isFunction(callback)) {
				callback();
			}
		}
	};

	timer = setInterval(function () {
		var sTop = $(window).scrollTop();
		var delta = sTop - target;
		if (delta > 0) {
			delta = Math.floor(delta * 0.8);
		} else if (delta < 0) {
			delta = Math.ceil(delta * 0.8);
		}

		var step = target + delta;
		if (step === prevStep) {
			stayCount--;
		}
		prevStep = step;

		window.scrollTo(0, step);

		if (step === target || stayCount <= 0) {
			stopTimer();
		}
	}, 16);

	setTimeout(function () {
		stopTimer();
	}, conf.maxDelay);
}

module.exports = smoothScrollTo;

},{"spore-kit-obj/assign":64}],67:[function(require,module,exports){
/**
 * IOS sticky 效果 polyfill
 * - requires jQuery/Zepto
 * @param {Object} node 目标DOM元素
 * @param {Object} options 选项
 * @param {Boolean} [options.clone=true] 是否创建一个 clone 元素
 * @param {Object} [options.placeholder=null] sticky 效果启动时的占位 dom 元素
 * @param {Boolean} [options.disableAndroid=false] 是否在 Android 下停用 sticky 效果
 * @param {Object} [options.offsetParent=null] 提供一个相对定位元素来匹配浮动时的定位样式
 * @param {Object} [options.styles={}] 进入 sticky 状态时的样式
 * @example
 * sticky($('h1').get(0));
 */

function sticky(node, options) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var $win = $(window);
	var $doc = $(document);

	var ua = navigator.userAgent;
	var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
	var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;

	var that = {};
	that.isIOS = isIOS;
	that.isAndroid = isAndroid;

	var conf = $.extend(
		{
			clone: true,
			placeholder: null,
			disableAndroid: false,
			offsetParent: null,
			styles: {}
		},
		options
	);

	that.root = $(node);

	if (!that.root.get(0)) { return; }
	that.offsetParent = that.root.offsetParent();

	if (conf.offsetParent) {
		that.offsetParent = $(conf.offsetParent);
	}

	if (!that.offsetParent[0]) {
		that.offsetParent = $(document.body);
	}

	that.isSticky = false;

	if (conf.placeholder) {
		that.placeholder = $(conf.placeholder);
	} else {
		that.placeholder = $('<div/>');
	}

	if (conf.clone) {
		that.clone = that.root.clone();
		that.clone.appendTo(that.placeholder);
	}

	that.placeholder.css({
		visibility: 'hidden'
	});

	that.sticky = function() {
		if (!that.isSticky) {
			that.isSticky = true;
			that.root.css('position', 'fixed');
			that.root.css(conf.styles);
			that.placeholder.insertBefore(that.root);
		}
	};

	that.unSticky = function() {
		if (that.isSticky) {
			that.isSticky = false;
			that.placeholder.remove();
			that.root.css('position', '');
			$.each(conf.styles, function(key) {
				that.root.css(key, '');
			});
		}
	};

	var origOffsetY = that.root.get(0).offsetTop;
	that.checkScrollY = function() {
		if (!that.isSticky) {
			origOffsetY = that.root.get(0).offsetTop;
		}

		var scrollY = 0;
		if (that.offsetParent.get(0) === document.body) {
			scrollY = window.scrollY;
		} else {
			scrollY = that.offsetParent.get(0).scrollTop;
		}

		if (scrollY > origOffsetY) {
			that.sticky();
		} else {
			that.unSticky();
		}

		if (that.isSticky) {
			that.root.css({
				'width': that.placeholder.width() + 'px'
			});
		} else {
			that.root.css({
				'width': ''
			});
		}
	};

	that.init = function() {
		if (isAndroid && conf.disableAndroid) {
			return;
		}
		if (isIOS && that.offsetParent.get(0) === document.body) {
			// IOS9+ 支持 position:sticky 属性
			that.root.css('position', 'sticky');
		} else {
			// 一般浏览器直接支持
			if (that.offsetParent.get(0) === document.body) {
				$win.on('scroll', that.checkScrollY);
			} else {
				that.offsetParent.on('scroll', that.checkScrollY);
			}

			$win.on('resize', that.checkScrollY);
			$doc.on('touchstart', that.checkScrollY);
			$doc.on('touchmove', that.checkScrollY);
			$doc.on('touchend', that.checkScrollY);
			that.checkScrollY();
		}
	};

	that.init();
	return that;
}

module.exports = sticky;

},{}],68:[function(require,module,exports){
/**
 * 用 requestAnimationFrame 包装定时器
 * - 如果浏览器不支持 requestAnimationFrame API，则使用 BOM 原本的定时器API
 * - requires jQuery/Zepto
 * @module timer
 * @example
 *	timer.setTimeout(function () {
 *		console.info('output this log after 1000ms');
 *	}, 1000);
 */

var Timer = {};

function factory(methodName) {
	var $win = null;
	var $ = null;
	var wrappedMethod = null;

	if (typeof window !== 'undefined') {
		$win = window;
		$ = $win.$ || $win.Zepto || $win.jQuery;
	}

	if ($win && $) {
		// 取得对应的浏览器前缀
		var prefix = '';
		if ($.getPrefix) {
			prefix = $.getPrefix().replace(/-/gi, '');
		}

		// 如果有对应名称的方法，直接返回该方法，否则返回带有对应浏览器前缀的方法
		var getPrefixMethod = function(name) {
			var prefixName = name.charAt(0).toUpperCase() + name.substr(1);
			var method = $win[name] || $win[prefix + prefixName];
			if ($.type(method) === 'function') {
				return method.bind($win);
			} else {
				return null;
			}
		};

		var localRequestAnimationFrame = getPrefixMethod('requestAnimationFrame');
		var localCancelAnimationFrame = getPrefixMethod('cancelAnimationFrame') || $.noop;

		if (localRequestAnimationFrame) {
			var clearTimer = function(obj) {
				if (obj.requestId && $.type(obj.step) === 'function') {
					obj.step = $.noop;
					localCancelAnimationFrame(obj.requestId);
					obj.requestId = 0;
				}
			};

			var setTimer = function(fn, delay, type) {
				var obj = {};
				var time = Date.now();
				delay = delay || 0;
				delay = Math.max(delay, 0);
				obj.step = function() {
					var now = Date.now();
					if (now - time > delay) {
						fn();
						if (type === 'timeout') {
							clearTimer(obj);
						} else {
							time = now;
						}
					}
					obj.requestId = localRequestAnimationFrame(obj.step);
				};
				localRequestAnimationFrame(obj.step);
				return obj;
			};

			if (methodName === 'setInterval') {
				wrappedMethod = function(fn, delay) {
					return setTimer(fn, delay, 'interval');
				};
			} else if (methodName === 'setTimeout') {
				wrappedMethod = function(fn, delay) {
					return setTimer(fn, delay, 'timeout');
				};
			} else if (methodName === 'clearTimeout') {
				wrappedMethod = clearTimer;
			} else if (methodName === 'clearInterval') {
				wrappedMethod = clearTimer;
			}
		}
	}

	if (!wrappedMethod && this[methodName]) {
		wrappedMethod = this[methodName].bind(this);
	}

	return wrappedMethod;
}

/**
 * 设置重复调用定时器
 * @method timer.setInterval
 * @memberof timer
 * @param {Function} fn 定时重复调用的函数
 * @param {Number} [delay=0] 重复调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearInterval 方法来终止这个定时器
 */
Timer.setInterval = factory('setInterval');

/**
 * 清除重复调用定时器
 * @method timer.clearInterval
 * @memberof timer
 * @param {Object} obj 定时器对象
 */
Timer.clearInterval = factory('clearInterval');

/**
 * 设置延时调用定时器
 * @method timer.setTimeout
 * @memberof timer
 * @param {Function} fn 延时调用的函数
 * @param {Number} [delay=0] 延时调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearTimeout 方法来终止这个定时器
 */
Timer.setTimeout = factory('setTimeout');

/**
 * 清除延时调用定时器
 * @method timer.clearTimeout
 * @memberof timer
 * @param {Object} obj 定时器对象
 */
Timer.clearTimeout = factory('clearTimeout');

module.exports = Timer;

},{}],69:[function(require,module,exports){
/**
 * 动画运行方式库
 * - Pow
 * - Expo
 * - Circ
 * - Sine
 * - Back
 * - Bounce
 * - Elastic
 * - Quad
 * - Cubic
 * - Quart
 * - Quint
 * @module transitions
 * @see https://mootools.net/core/docs/1.6.0/Fx/Fx.Transitions#Fx-Transitions
 * @example
 *	var Fx = require('spore-kit-fx/fx');
 *	var transitions = require('spore-kit-fx/transitions');
 *	new Fx({
 *		transition : transitions.Sine.easeInOut
 *	});
 *	new Fx({
 *		transition : 'Sine:In'
 *	});
 *	new Fx({
 *		transition : 'Sine:In:Out'
 *	});
 */

var $type = require('spore-kit-obj/type');
var $assign = require('spore-kit-obj/assign');

var $fx = require('./fx');

$fx.Transition = function(transition, params) {
	if ($type(params) !== 'array') {
		params = [params];
	}
	var easeIn = function(pos) {
		return transition(pos, params);
	};
	return $assign(easeIn, {
		easeIn: easeIn,
		easeOut: function(pos) {
			return 1 - transition(1 - pos, params);
		},
		easeInOut: function(pos) {
			return (
				(pos <= 0.5
					? transition(2 * pos, params)
					: 2 - transition(2 * (1 - pos), params)) / 2
			);
		}
	});
};

var Transitions = {
	linear: function(zero) {
		return zero;
	}
};

Transitions.extend = function(transitions) {
	Object.keys(transitions).forEach(function(transition) {
		Transitions[transition] = new $fx.Transition(transitions[transition]);
	});
};

Transitions.extend({
	Pow: function(p, x) {
		return Math.pow(p, (x && x[0]) || 6);
	},

	Expo: function(p) {
		return Math.pow(2, 8 * (p - 1));
	},

	Circ: function(p) {
		return 1 - Math.sin(Math.acos(p));
	},

	Sine: function(p) {
		return 1 - Math.cos(p * Math.PI / 2);
	},

	Back: function(p, x) {
		x = (x && x[0]) || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	Bounce: function(p) {
		var value;
		var a = 0;
		var b = 1;
		while (p < (7 - 4 * a) / 11) {
			value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
			a += b;
			b /= 2;
		}
		value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
		return value;
	},

	Elastic: function(p, x) {
		return (
			Math.pow(2, 10 * --p)
			* Math.cos(20 * p * Math.PI * ((x && x[0]) || 1) / 3)
		);
	}
});

['Quad', 'Cubic', 'Quart', 'Quint'].forEach(function(transition, i) {
	Transitions[transition] = new $fx.Transition(function(p) {
		return Math.pow(p, i + 2);
	});
});

$fx.statics({
	getTransition: function() {
		var trans = this.options.transition || Transitions.Sine.easeInOut;
		if (typeof trans === 'string') {
			var data = trans.split(':');
			trans = Transitions;
			trans = trans[data[0]] || trans[data[0]];
			if (data[1]) {
				trans = trans['ease' + data[1] + (data[2] ? data[2] : '')];
			}
		}
		return trans;
	}
});

module.exports = Transitions;

},{"./fx":58,"spore-kit-obj/assign":64,"spore-kit-obj/type":65}],70:[function(require,module,exports){
/**
 * 加载 script 文件
 * @method getScript
 * @param {Object} options 选项
 * @param {String} options.src script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 *	getScript({
 *		src: 'https://code.jquery.com/jquery-3.3.1.min.js',
 *		onLoad: function () {
 *			console.info(window.jQuery);
 *		}
 *	});
 */

function getScript(options) {
	options = options || {};

	var src = options.src || '';
	var charset = options.charset || '';
	var onLoad = options.onLoad || function() {};

	var script = document.createElement('script');
	script.async = 'async';
	script.src = src;

	if (charset) {
		script.charset = charset;
	}
	script.onreadystatechange = function() {
		if (
			!this.readyState
			|| this.readyState === 'loaded'
			|| this.readyState === 'complete'
		) {
			if (typeof onLoad === 'function') {
				onLoad();
			}
			this.onload = null;
			this.onreadystatechange = null;
			this.parentNode.removeChild(this);
		}
	};
	script.onload = script.onreadystatechange;
	document.getElementsByTagName('head')[0].appendChild(script);
	return script;
}

module.exports = getScript;

},{}],71:[function(require,module,exports){
/**
 * 封装 iframe post 模式
 * - requires jQuery/Zepto
 * @method iframePost
 * @param {Object} spec 请求选项
 * @param {Object} [spec.form=null] 要请求的表单
 * @param {String} spec.url 请求地址
 * @param {Array|Object} spec.data 请求数据
 * @param {String} [spec.target=''] 目标 iframe 名称
 * @param {String} [spec.method='post'] 请求方式
 * @param {String} [spec.acceptCharset=''] 请求目标的编码
 * @param {String} [spec.jsonp='callback'] 传递给接口的回调参数名称
 * @param {String} [spec.jsonpMethod=''] 传递给接口的回调参数的传递方式，可选['post', 'get']
 * @param {String} [spec.jsonpCallback=''] 传递给接口的回调函数名称，默认自动生成
 * @param {String} [spec.jsonpAddParent=''] 传递给接口的回调函数名称需要附带的前缀调用路径
 * @param {Function} [spec.complete] 获得数据的回调函数
 * @param {Function} [spec.success] 成功获得数据的回调函数
 * @example
 *	document.domain = 'qq.com';
 *	iframePost({
 *		url: 'http://a.qq.com/form',
 *		data: [{
 *			n1: 'v1',
 *			n2: 'v2'
 *		}],
 *		success: function (rs) {
 *			console.info(rs);
 *		}
 *	});
 */

var hiddenDiv = null;

function get$ () {
	var $;
	if (typeof window !== 'undefined') {
		$ = window.$ || window.jQuery || window.Zepto;
	}
	if (!$) {
		throw new Error('Need winddow.$ like jQuery or Zepto.');
	}
	return $;
}

function getHiddenBox () {
	var $ = get$();
	if (hiddenDiv === null) {
		hiddenDiv = $('<div/>').css('display', 'none');
		hiddenDiv.appendTo(document.body);
	}
	return hiddenDiv;
}

function getForm () {
	var $ = get$();
	var form = $('<form style="display:none;"></form>');
	form.appendTo(getHiddenBox());
	return form;
}

function getHiddenInput (form, name) {
	var $ = get$();
	var input = $(form).find('[name="' + name + '"]');
	if (!input.get(0)) {
		input = $('<input type="hidden" name="' + name + '" value=""/>');
		input.appendTo(form);
	}
	return input;
}

function getIframe (name) {
	var $ = get$();
	var iframe = $(
		'<iframe id="'
		+ name
		+ '" name="'
		+ name
		+ '" src="about:blank" style="display:none;"></iframe>'
	);
	iframe.appendTo(getHiddenBox());
	return iframe;
}

function iframePost (spec) {
	var $ = get$();
	var conf = $.extend({
		form: null,
		url: '',
		data: [],
		target: '',
		method: 'post',
		acceptCharset: '',
		jsonp: 'callback',
		jsonpMethod: '',
		jsonpCallback: '',
		jsonpAddParent: '',
		complete: $.noop,
		success: $.noop
	}, spec);

	var that = {};
	that.url = conf.url;

	that.jsonp = conf.jsonp || 'callback';
	that.method = conf.method || 'post';
	that.jsonpMethod = $.type(conf.jsonpMethod) === 'string'
		? conf.jsonpMethod.toLowerCase()
		: '';

	var form = $(conf.form);
	if (!form.length) {
		form = getForm();

		var html = [];
		if ($.isArray(conf.data)) {
			$.each(conf.data, function(index, item) {
				if (!item) {
					return;
				}
				html.push(
					'<input type="hidden" name="'
					+ item.name
					+ '" value="'
					+ item.value
					+ '">'
				);
			});
		} else if ($.isPlainObject(conf.data)) {
			$.each(conf.data, function(name, value) {
				html.push(
					'<input type="hidden" name="'
					+ name
					+ '" value="'
					+ value
					+ '">'
				);
			});
		}
		$(html.join('')).appendTo(form);
	}
	that.form = form;
	that.conf = conf;

	var timeStamp = +new Date();
	var iframeName = 'iframe' + timeStamp;

	that.timeStamp = timeStamp;
	that.iframeName = iframeName;

	if (conf.acceptCharset) {
		form.attr('accept-charset', conf.acceptCharset);
		that.acceptCharset = conf.acceptCharset;
	}

	var iframe = null;
	var target = '';
	if (conf.target) {
		target = conf.target;
		if (['_blank', '_self', '_parent', '_top'].indexOf(conf.target) < 0) {
			iframe = $('iframe[name="' + conf.target + '"]');
		}
	} else {
		target = iframeName;
		iframe = getIframe(iframeName);
	}
	form.attr('target', target);
	that.target = target;
	that.iframe = iframe;

	var jsonpCallback = conf.jsonpCallback || 'iframeCallback' + timeStamp;
	that.jsonpCallback = jsonpCallback;

	if (!that.jsonpMethod || that.jsonpMethod === 'post') {
		var input = getHiddenInput(form, that.jsonp);
		input.val(conf.jsonpAddParent + jsonpCallback);
	} else if (that.jsonpMethod === 'get') {
		that.url = that.url
			+ (that.url.indexOf('?') >= 0 ? '&' : '?')
			+ that.jsonp
			+ '='
			+ jsonpCallback;
	}

	if (!conf.jsonpCallback) {
		that.callback = function(rs) {
			if ($.isFunction(conf.complete)) {
				conf.complete(rs, that, 'success');
			}
			if ($.isFunction(conf.success)) {
				conf.success(rs, that, 'success');
			}
		};
		window[jsonpCallback] = that.callback;
	}

	form.attr({
		action: that.url,
		method: that.method
	});

	form.submit();

	return that;
}

module.exports = iframePost;

},{}],72:[function(require,module,exports){
/**
 * # 处理网络交互
 * @module spore-kit-io
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/io
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.io.getScript);
 *
 * // 单独引入 spore-kit-io
 * var $io = require('spore-kit-io');
 * console.info($io.getScript);
 *
 * // 单独引入一个方法
 * var $getScript = require('spore-kit-io/getScript');
 */

exports.iframePost = require('./iframePost');
exports.getScript = require('./getScript');

},{"./getScript":70,"./iframePost":71}],73:[function(require,module,exports){
/**
 * 解析 location.search 为一个JSON对象
 * - 或者获取其中某个参数
 * @method getQuery
 * @param {String} url URL字符串
 * @param {String} name 参数名称
 * @returns {Object|String} query对象 | 参数值
 * @example
 *	var url = 'http://localhost/profile?beijing=huanyingni';
 *	console.info( getQuery(url) );
 *	// {beijing : 'huanyingni'}
 *	console.info( getQuery(url, 'beijing') );
 *	// 'huanyingni'
 */

var cache = {};

function getQuery(url, name) {
	var query = cache[url] || {};

	if (url) {
		var searchIndex = url.indexOf('?');
		if (searchIndex >= 0) {
			var search = url.slice(searchIndex + 1, url.length);
			search = search.replace(/#.*/, '');

			var params = search.split('&');
			params.forEach(function(group) {
				var equalIndex = group.indexOf('=');
				if (equalIndex > 0) {
					var key = group.slice(0, equalIndex);
					var value = group.slice(equalIndex + 1, group.length);
					query[key] = value;
				}
			});
		}
		cache[url] = query;
	}

	if (!name) {
		return query;
	} else {
		return query[name] || '';
	}
}

module.exports = getQuery;

},{}],74:[function(require,module,exports){
/**
 * # 处理地址字符串
 * @module spore-kit-location
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/location
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.location.getQuery);
 *
 * // 单独引入 spore-kit-location
 * var $location = require('spore-kit-location');
 * console.info($location.getQuery);
 *
 * // 单独引入一个方法
 * var $getQuery = require('spore-kit-location/getQuery');
 */

exports.getQuery = require('./getQuery');
exports.setQuery = require('./setQuery');
exports.parse = require('./parse');

},{"./getQuery":73,"./parse":75,"./setQuery":76}],75:[function(require,module,exports){
/**
 * 解析URL为一个JSON对象
 * @method parse
 * @param {String} str URL字符串
 * @returns {Object} JSON对象
 * @example
 * console.info( parse('http://t.sina.com.cn/profile?beijing=huanyingni') );
 * //	{
 * //		hash : ''
 * //		host : 't.sina.com.cn'
 * //		path : 'profile'
 * //		port : ''
 * //		query : 'beijing=huanyingni'
 * //		scheme : http
 * //		slash : '//'
 * //		url : 'http://t.sina.com.cn/profile?beijing=huanyingni'
 * //	}
 */

function parse (url) {
	var regUrlParse = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
	var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
	var results = regUrlParse.exec(url);
	var that = {};
	if (results) {
		for (var i = 0, len = names.length; i < len; i += 1) {
			that[names[i]] = results[i] || '';
		}
	}
	return that;
}

module.exports = parse;

},{}],76:[function(require,module,exports){
/**
 * 将参数设置到 location.search 上
 * @method setQuery
 * @param {String} url URL字符串
 * @param {Object} query 参数对象
 * @returns {String} 拼接好参数的URL字符串
 * @example
 * setQuery('localhost'); // 'localhost'
 * setQuery('localhost', {a: 1}); // 'localhost?a=1'
 * setQuery('', {a: 1}); // '?a=1'
 * setQuery('localhost?a=1', {a: 2}); // 'localhost?a=2'
 * setQuery('localhost?a=1', {a: ''}); // 'localhost?a='
 * setQuery('localhost?a=1', {a: null}); // 'localhost'
 * setQuery('localhost?a=1', {b: 2}); // 'localhost?a=1&b=2'
 * setQuery('localhost?a=1&b=1', {a: 2, b: 3}); // 'localhost?a=2&b=3'
 * setQuery('localhost#a=1', {a: 2, b: 3}); // 'localhost?a=2&b=3#a=1'
 * setQuery('#a=1', {a: 2, b: 3}); // '?a=2&b=3#a=1'
 */

function setQuery (url, query) {
	url = url || '';
	if (!query) { return url; }

	var reg = /([^?#]*)(\?{0,1}[^?#]*)(#{0,1}.*)/;
	return url.replace(reg, function(match, path, search, hash) {
		search = search || '';
		search = search.replace(/^\?/, '');

		var para = search.split('&').reduce(function(obj, pair) {
			var arr = pair.split('=');
			if (arr[0]) {
				obj[arr[0]] = arr[1];
			}
			return obj;
		}, {});

		Object.keys(query).forEach(function(key) {
			var value = query[key];
			if (value === null || typeof value === 'undefined') {
				delete para[key];
			} else {
				para[key] = value;
			}
		});

		var paraKeys = Object.keys(para);
		if (!paraKeys.length) {
			search = '';
		} else {
			search = '?' + paraKeys.map(function(key) {
				return key + '=' + para[key];
			}).join('&');
		}

		return path + search + hash;
	});
}

module.exports = setQuery;

},{}],77:[function(require,module,exports){
/**
 * 基础工厂元件类
 * - 该类混合了 spore-kit-evt/events 的方法。
 * @param {Object} [options] 选项
 * @module Base
 * @example
 *	var Base = require('spore-kit-mvc/base');
 *
 *	var ChildClass = Base.extend({
 *		defaults : {
 *			node : null
 *		},
 *		build : function() {
 *			this.node = $(this.conf.node);
 *		},
 *		setEvents : function(action) {
 *			var proxy = this.proxy();
 *			this.node[action]('click', proxy('onclick'));
 *		},
 *		onclick : function() {
 *			console.info('clicked');
 *			this.trigger('click');
 *		}
 *	});
 *
 *	var obj = new ChildClass({
 *		node : document.body
 *	});
 *
 *	obj.on('click', function() {
 *		console.info('obj is clicked');
 *	});
 */

var $events = require('spore-kit-evt/events');
var $merge = require('lodash/merge');
var $noop = require('lodash/noop');
var $isPlainObject = require('lodash/isPlainObject');
var $isFunction = require('lodash/isFunction');
var $klass = require('./klass');

var AP = Array.prototype;
var Base = $klass({
	/**
	 * 类的默认选项对象，绑定在原型上，不要在实例中直接修改这个对象
	 * @name Base#defaults
	 * @type {Object}
	 * @memberof Base
	 */
	defaults: {},

	/**
	 * 类的实际选项，setOptions 方法会修改这个对象
	 * @name Base#conf
	 * @type {Object}
	 * @memberof Base
	 */

	/**
	 * 存放代理函数的集合
	 * @name Base#bound
	 * @type {Object}
	 * @memberof Base
	 */

	initialize: function(options) {
		this.setOptions(options);
		this.build();
		this.setEvents('on');
	},

	/**
	 * 深度混合传入的选项与默认选项，混合完成的选项对象可通过 this.conf 属性访问
	 * @method Base#setOptions
	 * @memberof Base
	 * @param {Object} [options] 选项
	 */
	setOptions: function(options) {
		this.conf = this.conf || $merge({}, this.defaults);
		if (!$isPlainObject(options)) {
			options = {};
		}
		$merge(this.conf, options);
	},

	/**
	 * 元件初始化接口函数，实例化元件时会自动首先调用
	 * @abstract
	 * @method Base#build
	 * @memberof Base
	 */
	build: $noop,

	/**
	 * 元件事件绑定接口函数，实例化元件时会自动在 build 之后调用
	 * @method Base#setEvents
	 * @memberof Base
	 * @param {String} [action='on'] 绑定或者移除事件的标记，可选值有：['on', 'off']
	 */
	setEvents: $noop,

	/**
	 * 函数代理，确保函数在当前类创建的实例上下文中执行。
	 * 这些用于绑定事件的代理函数都放在属性 this.bound 上。
	 * 功能类似 Function.prototype.bind 。
	 * 可以传递额外参数作为函数执行的默认参数，追加在实际参数之后。
	 * @method Base#proxy
	 * @memberof Base
	 * @param {string} [name='proxy'] 函数名称
	 */
	proxy: function(name) {
		var that = this;
		var bound = this.bound ? this.bound : this.bound = {};
		var proxyArgs = AP.slice.call(arguments);
		proxyArgs.shift();
		name = name || 'proxy';
		if (!$isFunction(bound[name])) {
			bound[name] = function() {
				if ($isFunction(that[name])) {
					var args = AP.slice.call(arguments);
					return that[name].apply(that, args.concat(proxyArgs));
				}
			};
		}
		return bound[name];
	},

	/**
	 * 移除所有绑定事件，清除用于绑定事件的代理函数
	 * @method Base#destroy
	 * @memberof Base
	 */
	destroy: function() {
		this.setEvents('off');
		this.off();
		this.bound = null;
	}
});

Base.methods($events.prototype);

module.exports = Base;

},{"./klass":80,"lodash/isFunction":202,"lodash/isPlainObject":207,"lodash/merge":212,"lodash/noop":213,"spore-kit-evt/events":217}],78:[function(require,module,exports){
/**
 * 事件对象绑定，将events中包含的键值对映射为代理的事件。
 * - 事件键值对格式可以为：
 * - {'selector event':'method'}
 * - {'event':'method'}
 * - {'selector event':'method1 method2'}
 * - {'event':'method1 method2'}
 * @method delegate
 * @param {Boolean} action 开/关代理，可选：['on', 'off']。
 * @param {Object} root 设置代理的根节点，可以是一个jquery对象，或者是混合了 spore-kit-evt/events 方法的对象。
 * @param {Object} events 事件键值对
 * @param {Object} bind 指定事件函数绑定的对象，必须为MVC类的实例。
 */

var $isFunction = require('lodash/isFunction');
var $assign = require('lodash/assign');
var $forEach = require('lodash/forEach');

function delegate(action, root, events, bind) {
	var proxy;
	var dlg;
	if (!root) {
		return;
	}
	if (!bind || !$isFunction(bind.proxy)) {
		return;
	}

	proxy = bind.proxy();
	action = action === 'on' ? 'on' : 'off';
	dlg = action === 'on' ? 'delegate' : 'undelegate';
	events = $assign({}, events);

	$forEach(events, function(method, handle) {
		var selector;
		var event;
		var fns = [];
		handle = handle.split(/\s+/);

		if (typeof method === 'string') {
			fns = method.split(/\s+/).map(function(fname) {
				return proxy(fname);
			});
		} else if ($isFunction(method)) {
			fns = [method];
		} else {
			return;
		}

		event = handle.pop();

		if (handle.length >= 1) {
			selector = handle.join(' ');
			if ($isFunction(root[dlg])) {
				fns.forEach(function(fn) {
					root[dlg](selector, event, fn);
				});
			}
		} else if ($isFunction(root[action])) {
			fns.forEach(function(fn) {
				root[action](event, fn);
			});
		}
	});
}

module.exports = delegate;

},{"lodash/assign":191,"lodash/forEach":195,"lodash/isFunction":202}],79:[function(require,module,exports){
/**
 * # 兼容 IE8 的 MVC 简单实现
 * @module spore-kit-mvc
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/mvc
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.mvc.Model);
 *
 * // 单独引入 spore-kit-mvc
 * var $mvc = require('spore-kit-mvc');
 * console.info($mvc.Model);
 *
 * // 单独引入一个组件
 * var $Model = require('spore-kit-mvc/Model');
 */

exports.klass = require('./klass');
exports.delegate = require('./delegate');
exports.Base = require('./base');
exports.Model = require('./model');
exports.View = require('./view');

},{"./base":77,"./delegate":78,"./klass":80,"./model":81,"./view":218}],80:[function(require,module,exports){
/**
 * class 的 ES5 实现
 * - 为代码通过 eslint 检查做了些修改
 * @module klass
 * @see https://github.com/ded/klass
 */

var fnTest = (/xyz/).test(function() { var xyz; return xyz; }) ? (/\bsupr\b/) : (/.*/);
var proto = 'prototype';

function isFn(o) {
	return typeof o === 'function';
}

function wrap(k, fn, supr) {
	return function() {
		var tmp = this.supr;
		this.supr = supr[proto][k];
		var undef = {}.fabricatedUndefined;
		var ret = undef;
		try {
			ret = fn.apply(this, arguments);
		} finally {
			this.supr = tmp;
		}
		return ret;
	};
}

function process(what, o, supr) {
	for (var k in o) {
		if (o.hasOwnProperty(k)) {
			what[k] = (
				isFn(o[k])
				&& isFn(supr[proto][k])
				&& fnTest.test(o[k])
			) ? wrap(k, o[k], supr) : o[k];
		}
	}
}

function extend(o, fromSub) {
	// must redefine noop each time so it doesn't inherit from previous arbitrary classes
	var Noop = function() {};
	Noop[proto] = this[proto];

	var supr = this;
	var prototype = new Noop();
	var isFunction = isFn(o);
	var _constructor = isFunction ? o : this;
	var _methods = isFunction ? {} : o;

	function fn() {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		} else {
			if (fromSub || isFunction) {
				supr.apply(this, arguments);
			}
			_constructor.apply(this, arguments);
		}
	}

	fn.methods = function(obj) {
		process(prototype, obj, supr);
		fn[proto] = prototype;
		return this;
	};

	fn.methods.call(fn, _methods).prototype.constructor = fn;

	fn.extend = extend;
	fn.statics = function(spec, optFn) {
		spec = typeof spec === 'string' ? (function() {
			var obj = {};
			obj[spec] = optFn;
			return obj;
		}()) : spec;
		process(this, spec, supr);
		return this;
	};

	fn[proto].implement = fn.statics;

	return fn;
}

function klass(o) {
	return extend.call(isFn(o) ? o : function() {}, o, 1);
}

module.exports = klass;

},{}],81:[function(require,module,exports){
/**
 * 模型类: 基础工厂元件类，用于做数据包装，提供可观察的数据对象
 * - 继承自 spore-kit-mvc/base
 * @module Model
 * @param {Object} [options] 初始数据
 * @example
 *	var Model = require('spore-kit-mvc/model');
 *
 *	var m1 = new Model({
 *		a : 1
 *	});
 *	m1.on('change:a', function(prevA){
 *		console.info(prevA);	// 1
 *	});
 *	m1.on('change', function(){
 *		console.info('model changed');
 *	});
 *	m1.set('a', 2);
 *
 *	var MyModel = Model.extend({
 *		defaults : {
 *			a : 2,
 *			b : 2
 *		},
 *		events : {
 *			'change:a' : 'updateB'
 *		},
 *		updateB : function(){
 *			this.set('b', this.get('a') + 1);
 *		}
 *	});
 *
 *	var m2 = new MyModel();
 *	console.info(m2.get('b'));	// 2
 *
 *	m2.set('a', 3);
 *	console.info(m2.get('b'));	// 4
 *
 *	m2.set('b', 5);
 *	console.info(m2.get('b'));	// 5
 */

var $assign = require('lodash/assign');
var $isFunction = require('lodash/isFunction');
var $isPlainObject = require('lodash/isPlainObject');
var $isArray = require('lodash/isArray');
var $forEach = require('lodash/forEach');
var $cloneDeep = require('lodash/cloneDeep');
var $base = require('./base');
var $delegate = require('./delegate');

// 数据属性名称
var DATA = '__data__';

var setAttr = function(key, value) {
	if (typeof key !== 'string') {
		return;
	}
	var that = this;
	var data = this[DATA];
	if (!data) {
		return;
	}
	var prevValue = data[key];

	var processor = this.processors[key];
	if (processor && $isFunction(processor.set)) {
		value = processor.set(value);
	}

	if (value !== prevValue) {
		data[key] = value;
		that.changed = true;
		that.trigger('change:' + key, prevValue);
	}
};

var getAttr = function(key) {
	var value = this[DATA][key];
	if ($isPlainObject(value)) {
		value = $cloneDeep(value);
	} else if ($isArray(value)) {
		value = $cloneDeep(value);
	}

	var processor = this.processors[key];
	if (processor && $isFunction(processor.get)) {
		value = processor.get(value);
	}

	return value;
};

var removeAttr = function(key) {
	delete this[DATA][key];
	this.trigger('change:' + key);
};

var Model = $base.extend({

	/**
	 * 模型的默认数据
	 * - 绑定在原型上，不要在实例中直接修改这个对象。
	 * @name Model#defaults
	 * @type {Object}
	 * @memberof Model
	 */
	defaults: {},

	/**
	 * 模型的事件绑定列表。
	 * - 绑定在原型上，不要在实例中直接修改这个对象。
	 * - 尽量在 events 对象定义属性关联事件。
	 * - 事件应当仅用于自身属性的关联运算。
	 * - 事件绑定格式可以为：
	 * - {'event':'method'}
	 * - {'event':'method1 method2'}
	 * @name Model#events
	 * @type {Object}
	 * @memberof Model
	 */
	events: {},

	/**
	 * 模型数据的预处理器。
	 * - 绑定在原型上，不要在实例中直接修改这个对象。
	 * @name Model#processors
	 * @type {Object}
	 * @memberof Model
	 * @example
	 *	processors : {
	 *		name : {
	 *			set : function(value){
	 *				return value;
	 *			},
	 *			get : function(value){
	 *				return value;
	 *			}
	 *		}
	 *	}
	*/
	processors: {},

	initialize: function(options) {
		this[DATA] = {};
		this.defaults = $assign({}, this.defaults);
		this.events = $assign({}, this.events);
		this.processors = $assign({}, this.processors);
		this.changed = false;

		this.build();
		this.delegate('on');
		this.setEvents('on');
		this.setOptions(options);
	},

	/**
	 * 深度混合传入的选项与默认选项，然后混合到数据对象中
	 * @method Model#setOptions
	 * @memberof Model
	 * @param {Object} [options] 选项
	 */
	setOptions: function(options) {
		this.set(this.defaults);
		this.supr(options);
		this.set(options);
	},

	/**
	 * 绑定 events 对象列举的事件。在初始化时自动执行了 this.delegate('on')。
	 * @method Model#delegate
	 * @memberof Model
	 * @param {String} [action='on'] 绑定动作标记。可选：['on', 'off']
	 */
	delegate: function(action, root, events, bind) {
		action = action || 'on';
		root = root || this;
		events = events || this.events;
		bind = bind || this;
		$delegate(action, root, events, bind);
	},

	/**
	 * 数据预处理
	 * @method Model#process
	 * @memberof Model
	 * @param {String} key 模型属性名称。或者JSON数据。
	 * @param {*} [val] 数据
	 */
	process: function(name, spec) {
		spec = $assign({
			set: function(value) {
				return value;
			},
			get: function(value) {
				return value;
			}
		}, spec);
		this.processors[name] = spec;
	},

	/**
	 * 设置模型数据
	 * @method Model#set
	 * @memberof Model
	 * @param {String|Object} key 模型属性名称。或者JSON数据。
	 * @param {*} [val] 数据
	 */
	set: function(key, val) {
		if ($isPlainObject(key)) {
			$forEach(key, function(v, k) {
				setAttr.call(this, k, v);
			}.bind(this));
		} else if (typeof key === 'string') {
			setAttr.call(this, key, val);
		}
		if (this.changed) {
			this.trigger('change');
			this.changed = false;
		}
	},

	/**
	 * 获取模型对应属性的值的拷贝
	 * - 如果不传参数，则直接获取整个模型数据。
	 * - 如果值是一个对象，则该对象会被深拷贝。
	 * @method Model#get
	 * @memberof Model
	 * @param {String} [key] 模型属性名称。
	 * @returns {*} 属性名称对应的值
	 */
	get: function(key) {
		if (typeof key === 'string') {
			if (!this[DATA]) {
				return;
			}
			return getAttr.call(this, key);
		}
		if (typeof key === 'undefined') {
			var data = {};
			$forEach(this.keys(), function(k) {
				data[k] = getAttr.call(this, k);
			}.bind(this));
			return data;
		}
	},

	/**
	 * 获取模型上设置的所有键名
	 * @method Model#keys
	 * @memberof Model
	 * @returns {Array} 属性名称列表
	 */
	keys: function() {
		return Object.keys(this[DATA] || {});
	},

	/**
	 * 删除模型上的一个键
	 * @method Model#remove
	 * @memberof Model
	 * @param {String} key 属性名称。
	 */
	remove: function(key) {
		removeAttr.call(this, key);
		this.trigger('change');
	},

	/**
	 * 清除模型中所有数据
	 * @method Model#clear
	 * @memberof Model
	 */
	clear: function() {
		Object.keys(this[DATA]).forEach(removeAttr, this);
		this.trigger('change');
	},

	/**
	 * 销毁模型，不会触发任何change事件。
	 * - 模型销毁后，无法再设置任何数据。
	 * @method Model#destroy
	 * @memberof Model
	 */
	destroy: function() {
		this.changed = false;
		this.delegate('off');
		this.supr();
		this.clear();
		this[DATA] = null;
	}
});

module.exports = Model;

},{"./base":77,"./delegate":78,"lodash/assign":191,"lodash/cloneDeep":192,"lodash/forEach":195,"lodash/isArray":198,"lodash/isFunction":202,"lodash/isPlainObject":207}],82:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":144,"./_root":181}],83:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":151,"./_hashDelete":152,"./_hashGet":153,"./_hashHas":154,"./_hashSet":155}],84:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":164,"./_listCacheDelete":165,"./_listCacheGet":166,"./_listCacheHas":167,"./_listCacheSet":168}],85:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":144,"./_root":181}],86:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":169,"./_mapCacheDelete":170,"./_mapCacheGet":171,"./_mapCacheHas":172,"./_mapCacheSet":173}],87:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":144,"./_root":181}],88:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":144,"./_root":181}],89:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":84,"./_stackClear":185,"./_stackDelete":186,"./_stackGet":187,"./_stackHas":188,"./_stackSet":189}],90:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":181}],91:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":181}],92:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":144,"./_root":181}],93:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],94:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],95:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],96:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":122,"./_isIndex":159,"./isArguments":197,"./isArray":198,"./isBuffer":201,"./isTypedArray":209}],97:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],98:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;

},{"./_baseAssignValue":103,"./eq":194}],99:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":103,"./eq":194}],100:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":194}],101:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":132,"./keys":210}],102:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":132,"./keysIn":211}],103:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":139}],104:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isMap = require('./isMap'),
    isObject = require('./isObject'),
    isSet = require('./isSet'),
    keys = require('./keys');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":89,"./_arrayEach":94,"./_assignValue":99,"./_baseAssign":101,"./_baseAssignIn":102,"./_cloneBuffer":126,"./_copyArray":131,"./_copySymbols":133,"./_copySymbolsIn":134,"./_getAllKeys":141,"./_getAllKeysIn":142,"./_getTag":149,"./_initCloneArray":156,"./_initCloneByTag":157,"./_initCloneObject":158,"./isArray":198,"./isBuffer":201,"./isMap":204,"./isObject":205,"./isSet":208,"./keys":210}],105:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":205}],106:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":108,"./_createBaseEach":137}],107:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":138}],108:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":107,"./keys":210}],109:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":97,"./isArray":198}],110:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":90,"./_getRawTag":146,"./_objectToString":178}],111:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":110,"./isObjectLike":206}],112:[function(require,module,exports){
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;

},{"./_getTag":149,"./isObjectLike":206}],113:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":162,"./_toSource":190,"./isFunction":202,"./isObject":205}],114:[function(require,module,exports){
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;

},{"./_getTag":149,"./isObjectLike":206}],115:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":110,"./isLength":203,"./isObjectLike":206}],116:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":163,"./_nativeKeys":175}],117:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./_isPrototype":163,"./_nativeKeysIn":176,"./isObject":205}],118:[function(require,module,exports){
var Stack = require('./_Stack'),
    assignMergeValue = require('./_assignMergeValue'),
    baseFor = require('./_baseFor'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isObject = require('./isObject'),
    keysIn = require('./keysIn'),
    safeGet = require('./_safeGet');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;

},{"./_Stack":89,"./_assignMergeValue":98,"./_baseFor":107,"./_baseMergeDeep":119,"./_safeGet":182,"./isObject":205,"./keysIn":211}],119:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    cloneBuffer = require('./_cloneBuffer'),
    cloneTypedArray = require('./_cloneTypedArray'),
    copyArray = require('./_copyArray'),
    initCloneObject = require('./_initCloneObject'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    safeGet = require('./_safeGet'),
    toPlainObject = require('./toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;

},{"./_assignMergeValue":98,"./_cloneBuffer":126,"./_cloneTypedArray":130,"./_copyArray":131,"./_initCloneObject":158,"./_safeGet":182,"./isArguments":197,"./isArray":198,"./isArrayLikeObject":200,"./isBuffer":201,"./isFunction":202,"./isObject":205,"./isPlainObject":207,"./isTypedArray":209,"./toPlainObject":216}],120:[function(require,module,exports){
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

},{"./_overRest":180,"./_setToString":183,"./identity":196}],121:[function(require,module,exports){
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

},{"./_defineProperty":139,"./constant":193,"./identity":196}],122:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],123:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],124:[function(require,module,exports){
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

},{"./identity":196}],125:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":91}],126:[function(require,module,exports){
var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":181}],127:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":125}],128:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],129:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":90}],130:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":125}],131:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],132:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":99,"./_baseAssignValue":103}],133:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":132,"./_getSymbols":147}],134:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":132,"./_getSymbolsIn":148}],135:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":181}],136:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_baseRest":120,"./_isIterateeCall":160}],137:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":199}],138:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],139:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":144}],140:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],141:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":109,"./_getSymbols":147,"./keys":210}],142:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":109,"./_getSymbolsIn":148,"./keysIn":211}],143:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":161}],144:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":113,"./_getValue":150}],145:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":179}],146:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":90}],147:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":95,"./stubArray":214}],148:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":97,"./_getPrototype":145,"./_getSymbols":147,"./stubArray":214}],149:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":82,"./_Map":85,"./_Promise":87,"./_Set":88,"./_WeakMap":92,"./_baseGetTag":110,"./_toSource":190}],150:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],151:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":174}],152:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],153:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":174}],154:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":174}],155:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":174}],156:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],157:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":125,"./_cloneDataView":127,"./_cloneRegExp":128,"./_cloneSymbol":129,"./_cloneTypedArray":130}],158:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":105,"./_getPrototype":145,"./_isPrototype":163}],159:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],160:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":159,"./eq":194,"./isArrayLike":199,"./isObject":205}],161:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],162:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":135}],163:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],164:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],165:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":100}],166:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":100}],167:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":100}],168:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":100}],169:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":83,"./_ListCache":84,"./_Map":85}],170:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":143}],171:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":143}],172:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":143}],173:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":143}],174:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":144}],175:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":179}],176:[function(require,module,exports){
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],177:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":140}],178:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],179:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],180:[function(require,module,exports){
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":93}],181:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":140}],182:[function(require,module,exports){
/**
 * Gets the value at `key`, unless `key` is "__proto__".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key == '__proto__') {
    return;
  }

  return object[key];
}

module.exports = safeGet;

},{}],183:[function(require,module,exports){
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

},{"./_baseSetToString":121,"./_shortOut":184}],184:[function(require,module,exports){
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

},{}],185:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":84}],186:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],187:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],188:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],189:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":84,"./_Map":85,"./_MapCache":86}],190:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],191:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    isArrayLike = require('./isArrayLike'),
    isPrototype = require('./_isPrototype'),
    keys = require('./keys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;

},{"./_assignValue":99,"./_copyObject":132,"./_createAssigner":136,"./_isPrototype":163,"./isArrayLike":199,"./keys":210}],192:[function(require,module,exports){
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;

},{"./_baseClone":104}],193:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],194:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],195:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

},{"./_arrayEach":94,"./_baseEach":106,"./_castFunction":124,"./isArray":198}],196:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],197:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":111,"./isObjectLike":206}],198:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],199:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":202,"./isLength":203}],200:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":199,"./isObjectLike":206}],201:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":181,"./stubFalse":215}],202:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":110,"./isObject":205}],203:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],204:[function(require,module,exports){
var baseIsMap = require('./_baseIsMap'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;

},{"./_baseIsMap":112,"./_baseUnary":123,"./_nodeUtil":177}],205:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],206:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],207:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":110,"./_getPrototype":145,"./isObjectLike":206}],208:[function(require,module,exports){
var baseIsSet = require('./_baseIsSet'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;

},{"./_baseIsSet":114,"./_baseUnary":123,"./_nodeUtil":177}],209:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":115,"./_baseUnary":123,"./_nodeUtil":177}],210:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":96,"./_baseKeys":116,"./isArrayLike":199}],211:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":96,"./_baseKeysIn":117,"./isArrayLike":199}],212:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;

},{"./_baseMerge":118,"./_createAssigner":136}],213:[function(require,module,exports){
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],214:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],215:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],216:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;

},{"./_copyObject":132,"./keysIn":211}],217:[function(require,module,exports){
module.exports=require(44)
},{}],218:[function(require,module,exports){
/**
 * 视图类: 基础工厂元件类，用于对视图组件的包装
 * - 依赖 jQuery/Zepto
 * - 继承自 spore-kit-mvc/base
 * @module View
 * @param {Object} [options] 选项
 * @param {String|Object} [options.node] 选择器字符串，或者DOM元素，或者jquery对象，用于指定视图的根节点。
 * @param {String} [options.template] 视图的模板字符串，也可以是个字符串数组，创建视图DOM时会自动join为字符串处理。
 * @param {Object} [options.events] 用于覆盖代理事件列表。
 * @param {Object} [options.role] 角色对象映射表，可指定role方法返回的jquery对象。
 * @example
 *	var View = require('spore-kit-mvc/view');
 *	var TPL = {
 *		box : [
 *			'<div>',
 *				'<button role="button"></button>',
 *			'</div>'
 *		]
 *	};
 *
 *	var TestView = View.extend({
 *		defaults : {
 *			template : TPL.box
 *		},
 *		events : {
 *			'button click' : 'method1'
 *		},
 *		build : function(){
 *			this.role('root').appendTo(document.body);
 *		},
 *		method1 : function(evt){
 *			console.info(1);
 *		},
 *		method2 : function(evt){
 *			console.info(2);
 *		}
 *	});
 *
 *	var obj1 = new TestView();
 *	var obj2 = new TestView({
 *		events : {
 *			'button click' : 'method2'
 *		}
 *	});
 *
 *	obj1.role('button').trigger('click');	// 1
 *	obj2.role('button').trigger('click');	// 2
 */

var $base = require('./base');
var $delegate = require('./delegate');

function get$() {
	return (window.$ || window.jQuery || window.Zepto);
}

// 获取视图的根节点
var getRoot = function() {
	var $ = get$();
	var conf = this.conf;
	var template = conf.template;
	var nodes = this.nodes;
	var root = nodes.root;
	if (!root) {
		if (conf.node) {
			root = $(conf.node);
		}
		if (!root || !root.length) {
			if ($.type(template) === 'array') {
				template = template.join('');
			}
			root = $(template);
		}
		nodes.root = root;
	}
	return root;
};

var View = $base.extend({
	/**
	 * 类的默认选项对象，绑定在原型上，不要在实例中直接修改这个对象。
	 * @name View#defaults
	 * @type {Object}
	 * @memberof View
	 */
	defaults: {
		node: '',
		template: '',
		events: {},
		role: {}
	},

	/**
	 * 视图的代理事件绑定列表，绑定在原型上，不要在实例中直接修改这个对象。
	 * - 事件绑定格式可以为：
	 * - {'selector event':'method'}
	 * - {'selector event':'method1 method2'}
	 * @name View#events
	 * @type {Object}
	 * @memberof View
	 */
	events: {},

	initialize: function(options) {
		this.nodes = {};

		this.setOptions(options);
		this.build();
		this.delegate('on');
		this.setEvents('on');
	},

	/**
	 * 深度混合传入的选项与默认选项，混合完成的选项对象可通过 this.conf 属性访问
	 * @method View#setOptions
	 * @memberof View
	 * @param {Object} [options] 选项
	 */
	setOptions: function(options) {
		var $ = get$();
		this.conf = this.conf || $.extend(true, {}, this.defaults);
		if (!$.isPlainObject(options)) {
			options = {};
		}
		$.extend(true, this.conf, options);
		this.events = $.extend({}, this.events, options.events);
	},

	/**
	 * 绑定 events 对象列举的事件。
	 * - 在初始化时自动执行了 this.delegate('on')。
	 * @method View#delegate
	 * @memberof View
	 * @see spore-kit-mvc/delegate
	 * @param {String} [action='on'] 绑定动作标记。可选：['on', 'off']
	 */
	delegate: function(action, root, events, bind) {
		action = action || 'on';
		root = root || this.role('root');
		events = events || this.events;
		bind = bind || this;
		$delegate(action, root, events, bind);
	},

	/**
	 * 获取 / 设置角色对象指定的 jQuery 对象。
	 * - 注意：获取到角色元素后，该 jQuery 对象会缓存在视图对象中
	 * @method View#role
	 * @memberof View
	 * @param {String} name 角色对象名称
	 * @param {Object} [element] 角色对象指定的dom元素或者 jQuery 对象。
	 * @returns {Object} 角色名对应的 jQuery 对象。
	 */
	role: function(name, element) {
		var $ = get$();
		var nodes = this.nodes;
		var root = getRoot.call(this);
		var role = this.conf.role || {};
		if (!element) {
			if (nodes[name]) {
				element = nodes[name];
			}
			if (name === 'root') {
				element = root;
			} else if (!element || !element.length) {
				if (role[name]) {
					element = root.find(role[name]);
				} else {
					element = root.find('[role="' + name + '"]');
				}
				nodes[name] = element;
			}
		} else {
			element = $(element);
			nodes[name] = element;
		}
		return element;
	},

	/**
	 * 清除视图缓存的角色对象
	 * @method View#resetRoles
	 * @memberof View
	 */
	resetRoles: function() {
		var $ = get$();
		var nodes = this.nodes;
		$.each(nodes, function(name) {
			if (name !== 'root') {
				nodes[name] = null;
				delete nodes[name];
			}
		});
	},

	/**
	 * 销毁视图，释放内存
	 * @method View#destroy
	 * @memberof View
	 */
	destroy: function() {
		this.delegate('off');
		this.supr();
		this.resetRoles();
		this.nodes = {};
	}
});

module.exports = View;

},{"./base":77,"./delegate":78}],219:[function(require,module,exports){
/**
 * 数字的千分位逗号分隔表示法
 * - IE8 的 toLocalString 给出了小数点后2位: N.00
 * @method comma
 * @see http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * @param {Number} num 数字
 * @returns {String} 千分位表示的数字
 * @example
 * comma(1234567); //'1,234,567'
 */

function comma (num) {
	var parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

module.exports = comma;

},{}],220:[function(require,module,exports){
module.exports=require(23)
},{}],221:[function(require,module,exports){
/**
 * # 处理数字，数据转换
 * @module spore-kit-num
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/num
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.num.limit);
 *
 * // 单独引入 spore-kit-num
 * var $num = require('spore-kit-num');
 * console.info($num.limit);
 *
 * // 单独引入一个方法
 * var $limit = require('spore-kit-num/limit');
 */

exports.comma = require('./comma');
exports.fixTo = require('./fixTo');
exports.limit = require('./limit');
exports.numerical = require('./numerical');

},{"./comma":219,"./fixTo":220,"./limit":222,"./numerical":223}],222:[function(require,module,exports){
/**
 * 限制数字在一个范围内
 * @method limit
 * @param {Number} num 要限制的数字
 * @param {Number} min 最小边界数值
 * @param {Number} max 最大边界数值
 * @return {Number} 经过限制的数值
 * @example
 * limit(1, 5, 10); // 5
 * limit(6, 5, 10); // 6
 * limit(11, 5, 10); // 10
 */

function limit (num, min, max) {
	return Math.min(Math.max(num, min), max);
}

module.exports = limit;

},{}],223:[function(require,module,exports){
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

},{}],224:[function(require,module,exports){
module.exports=require(5)
},{}],225:[function(require,module,exports){
/**
 * 覆盖对象，不添加新的键
 * @method cover
 * @param {Object} object 要覆盖的对象
 * @param {Object} item 要覆盖的属性键值对
 * @returns {Object} 覆盖后的源对象
 * @example
 * var obj = {a: 1, b: 2};
 * console.info(cover(obj,{b: 3, c: 4}));	//{a: 1, b: 3}
 */

function cover() {
	var args = Array.prototype.slice.call(arguments);
	var object = args.shift();
	if (object && typeof object.hasOwnProperty === 'function') {
		var keys = Object.keys(object);
		args.forEach(function(item) {
			if (item && typeof item.hasOwnProperty === 'function') {
				keys.forEach(function(key) {
					if (item.hasOwnProperty(key)) {
						object[key] = item[key];
					}
				});
			}
		});
	} else {
		return object;
	}

	return object;
}

module.exports = cover;

},{}],226:[function(require,module,exports){
/**
 * 查找对象路径上的值
 * @method find
 * @param {Object} object 要查找的对象
 * @param {String} path 要查找的路径
 * @return {*} 对象路径上的值
 * @example
 * var obj = {a:{b:{c:1}}};
 * console.info(find(obj,'a.b.c')); // 1
 * console.info(find(obj,'a.c')); // undefined
 */

function find(object, path) {
	path = path || '';
	if (!path) {
		return object;
	}
	if (!object) {
		return object;
	}

	var queue = path.split('.');
	var name;
	var pos = object;

	while (queue.length) {
		name = queue.shift();
		if (!pos[name]) {
			return pos[name];
		} else {
			pos = pos[name];
		}
	}

	return pos;
}

module.exports = find;

},{}],227:[function(require,module,exports){
/**
 * # 对象处理与判断
 * @module spore-kit-obj
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/obj
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.obj.type);
 *
 * // 单独引入 spore-kit-obj
 * var $obj = require('spore-kit-obj');
 * console.info($obj.type);
 *
 * // 单独引入一个方法
 * var $type = require('spore-kit-obj/type');
 */

exports.assign = require('./assign');
exports.cover = require('./cover');
exports.find = require('./find');
exports.type = require('./type');

},{"./assign":224,"./cover":225,"./find":226,"./type":228}],228:[function(require,module,exports){
module.exports=require(14)
},{}],229:[function(require,module,exports){
/**
 * 获取字符串长度，一个中文算2个字符
 * @method bLength
 * @param {String} str 要计算长度的字符串
 * @returns {Number} 字符串长度
 * @example
 * bLength('中文cc'); // 6
 */

function bLength (str) {
	var aMatch;
	if (!str) {
		return 0;
	}
	aMatch = str.match(/[^\x00-\xff]/g);
	return (str.length + (!aMatch ? 0 : aMatch.length));
}

module.exports = bLength;

},{}],230:[function(require,module,exports){
/**
 * 全角字符转半角字符
 * @method dbcToSbc
 * @param {String} str 包含了全角字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ'); // 'SAASDFSADF'
 */

function dbcToSbc (str) {
	return str.replace(/[\uff01-\uff5e]/g, function (a) {
		return String.fromCharCode(a.charCodeAt(0) - 65248);
	}).replace(/\u3000/g, ' ');
}

module.exports = dbcToSbc;

},{}],231:[function(require,module,exports){
/**
 * 解码HTML，将实体字符转换为HTML字符
 * @method decodeHTML
 * @param {String} str 含有实体字符的字符串
 * @returns {String} HTML字符串
 * @example
 * decodeHTML('&amp;&lt;&gt;$nbsp;&quot;'); // '&<> "'
 */

function decodeHTML (str) {
	if (typeof str !== 'string') {
		throw new Error('decodeHTML need a string as parameter');
	}
	return str.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#39;/g, '\'')
		.replace(/&nbsp;/g, '\u00A0')
		.replace(/&#32;/g, '\u0020')
		.replace(/&amp;/g, '&');
}

module.exports = decodeHTML;

},{}],232:[function(require,module,exports){
/**
 * 编码HTML，将HTML字符转为实体字符
 * @method encodeHTML
 * @param {String} str 含有HTML字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * encodeHTML('&<>" '); // '&amp;&lt;&gt;&quot;$nbsp;'
 */

function encodeHTML (str) {
	if (typeof str !== 'string') {
		throw new Error('encodeHTML need a string as parameter');
	}
	return str.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#39;')
		.replace(/\u00A0/g, '&nbsp;')
		.replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g, '&#32;');
}

module.exports = encodeHTML;

},{}],233:[function(require,module,exports){
/**
 * 生成一个不与之前重复的随机字符串
 * @method getUniqueKey
 * @returns {String} 随机字符串
 * @example
 * getUniqueKey(); // '166aae1fa9f'
 */

var time = +new Date();
var index = 1;

function getUniqueKey () {
	return (time + (index++)).toString(16);
}

module.exports = getUniqueKey;

},{}],234:[function(require,module,exports){
/**
 * 将驼峰格式变为连字符格式
 * @method hyphenate
 * @param {String} str 驼峰格式的字符串
 * @returns {String} 连字符格式的字符串
 * @example
 * hyphenate('libKitStrHyphenate'); // 'lib-kit-str-hyphenate'
 */

function hyphenate (str) {
	return str.replace(/[A-Z]/g, function ($0) {
		return '-' + $0.toLowerCase();
	});
}

module.exports = hyphenate;

},{}],235:[function(require,module,exports){
/**
 * # 字符串处理与判断
 * @module spore-kit-str
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/str
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.str.substitute);
 *
 * // 单独引入 spore-kit-str
 * var $str = require('spore-kit-str');
 * console.info($str.substitute);
 *
 * // 单独引入一个方法
 * var $substitute = require('spore-kit-str/substitute');
 */

exports.bLength = require('./bLength');
exports.dbcToSbc = require('./dbcToSbc');
exports.decodeHTML = require('./decodeHTML');
exports.encodeHTML = require('./encodeHTML');
exports.getUniqueKey = require('./getUniqueKey');
exports.hyphenate = require('./hyphenate');
exports.ipToHex = require('./ipToHex');
exports.leftB = require('./leftB');
exports.sizeOfUTF8String = require('./sizeOfUTF8String');
exports.substitute = require('./substitute');

},{"./bLength":229,"./dbcToSbc":230,"./decodeHTML":231,"./encodeHTML":232,"./getUniqueKey":233,"./hyphenate":234,"./ipToHex":236,"./leftB":237,"./sizeOfUTF8String":238,"./substitute":239}],236:[function(require,module,exports){
/**
 * 十进制IP地址转十六进制
 * @method ipToHex
 * @param {String} ip 十进制数字的IPV4地址
 * @return {String} 16进制数字IPV4地址
 * @example
 * ipToHex('255.255.255.255'); //return 'ffffffff'
 */

function ipToHex (ip) {
	return ip.replace(/(\d+)\.*/g, function (match, num) {
		num = parseInt(num, 10) || 0;
		num = num.toString(16);
		if (num.length < 2) {
			num = '0' + num;
		}
		return num;
	});
}

module.exports = ipToHex;

},{}],237:[function(require,module,exports){
/**
 * 从左到右取字符串，中文算两个字符
 * @method leftB
 * @param {String} str
 * @param {Number} lens
 * @returns {String} str
 * @example
 * //向汉编致敬
 * leftB('世界真和谐', 6); // '世界真'
*/

var $bLength = require('./bLength');

function leftB (str, lens) {
	var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
	str = str.slice(0, s.slice(0, lens).replace(/\*\*/g, ' ').replace(/\*/g, '').length);
	if ($bLength(str) > lens && lens > 0) {
		str = str.slice(0, str.length - 1);
	}
	return str;
}

module.exports = leftB;

},{"./bLength":229}],238:[function(require,module,exports){
/**
 * 取字符串 utf8 编码长度，from 王集鹄
 * @method sizeOfUTF8String
 * @param {String} str
 * @returns {Number} 字符串长度
 * @example
 * sizeOfUTF8String('中文cc'); //return 8
*/

function sizeOfUTF8String (str) {
	return (
		typeof unescape !== 'undefined'
			? unescape(encodeURIComponent(str)).length
			: new ArrayBuffer(str, 'utf8').length
	);
}

module.exports = sizeOfUTF8String;

},{}],239:[function(require,module,exports){
module.exports=require(25)
},{}],240:[function(require,module,exports){
/**
 * 提供倒计时器统一封装
 * @method countDown
 * @param {Object} spec 选项
 * @param {Date} [spec.base] 矫正时间，如果需要用服务端时间矫正倒计时，使用此参数
 * @param {Date} [spec.target=Date.now() + 3000] 目标时间
 * @param {Number} [spec.interval=1000] 倒计时触发间隔
 * @param {Function} [spec.onChange] 倒计时触发变更的事件回调
 * @param {Function} [spec.onStop] 倒计时结束的回调
 * @returns {Object} 倒计时对象实例
 * @example
 *	var target = Date.now() + 5000;
 *	var cd1 = countDown({
 *		target : target,
 *		onChange : function(delta){
 *			console.info('cd1 change', delta);
 *		},
 *		onStop : function(delta){
 *			console.info('cd1 stop', delta);
 *		}
 *	});
 *	setTimeout(function(){
 *		//trigger stop
 *		cd1.stop();
 *	}, 2000);
 *	var cd2 = countDown({
 *		target : target,
 *		interval : 2000,
 *		onChange : function(delta){
 *			console.info('cd2 change', delta);
 *		},
 *		onStop : function(delta){
 *			console.info('cd2 stop', delta);
 *		}
 *	});
 */

var $erase = require('spore-kit-arr/erase');
var $assign = require('spore-kit-obj/assign');

var allMonitors = {};
var localBaseTime = Date.now();

function countDown (spec) {
	var that = {};

	// 为什么不使用 timeLeft 参数替换 base 和 target:
	// 如果用 timeLeft 作为参数，计时器初始化之前如果有进程阻塞，有可能会导致与目标时间产生误差
	// 页面多个定时器一起初始化时，会出现计时器更新不同步的现象，同时引发页面多处没有一起回流
	// 保留目前这个方案，用于需要精确倒计时的情况
	var conf = $assign({
		base: null,
		target: Date.now() + 3000,
		interval: 1000,
		onChange: null,
		onStop: null
	}, spec);

	var base = +new Date(conf.base);
	var target = +new Date(conf.target);
	var interval = parseInt(conf.interval, 10) || 0;

	// 使倒计时触发时间精确化
	// 使用固定的触发频率，减少需要创建的定时器
	var delay = interval;
	if (delay < 500) {
		delay = 10;
	} else if (delay < 5000) {
		delay = 100;
	} else {
		delay = 1000;
	}

	var delta;
	var curUnit;

	var update = function(now) {
		delta = target - now;
		var unit = Math.ceil(delta / interval);
		if (unit !== curUnit) {
			curUnit = unit;
			if (typeof conf.onChange === 'function') {
				conf.onChange(delta);
			}
		}
	};

	var check = function(localDelta) {
		var now = conf.base ? base + localDelta : localBaseTime + localDelta;
		update(now);
		if (delta <= 0) {
			that.stop(now);
		}
	};

	/**
	 * 停止倒计时
	 * @method countDown#stop
	 * @memberof countDown
	 * @example
	 * var cd = countDown();
	 * cd.stop();
	 */
	that.stop = function() {
		var mobj = allMonitors[delay];
		if (mobj && mobj.queue) {
			$erase(mobj.queue, check);
		}
		// onStop事件触发必须在从队列移除回调之后
		// 否则循环接替的定时器会引发死循环
		if (typeof conf.onStop === 'function') {
			conf.onStop(delta);
		}
	};

	var monitor = allMonitors[delay];

	if (!monitor) {
		monitor = {};
		monitor.queue = [];
		monitor.inspect = function() {
			var now = Date.now();
			var mobj = allMonitors[delay];
			var localDelta = now - localBaseTime;
			if (mobj.queue.length) {
				// 循环当中会删除数组元素，因此需要先复制一下数组
				mobj.queue.slice(0).forEach(function(fn) {
					fn(localDelta);
				});
			} else {
				clearInterval(mobj.timer);
				allMonitors[delay] = null;
				delete mobj.timer;
			}
		};
		allMonitors[delay] = monitor;
	}

	monitor.queue.push(check);

	if (!monitor.timer) {
		monitor.timer = setInterval(monitor.inspect, delay);
	}

	monitor.inspect();

	return that;
}

module.exports = countDown;

},{"spore-kit-arr/erase":242,"spore-kit-obj/assign":244}],241:[function(require,module,exports){
/**
 * # 时间处理与交互工具
 * @module spore-kit-time
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/time
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.time.parseUnit);
 *
 * // 单独引入 spore-kit-time
 * var $time = require('spore-kit-time');
 * console.info($time.parseUnit);
 *
 * // 单独引入一个方法
 * var $parseUnit = require('spore-kit-time/parseUnit');
 */

exports.countDown = require('./countDown');
exports.parseUnit = require('./parseUnit');

},{"./countDown":240,"./parseUnit":245}],242:[function(require,module,exports){
module.exports=require(9)
},{}],243:[function(require,module,exports){
module.exports=require(223)
},{}],244:[function(require,module,exports){
module.exports=require(5)
},{}],245:[function(require,module,exports){
/**
 * 时间数字拆分为天时分秒
 * @method parseUnit
 * @param {Number} time 毫秒数
 * @param {Object} spec 选项
 * @param {String} [spec.maxUnit='day'] 拆分时间的最大单位，可选 ['day', 'hour', 'minute', 'second']
 * @returns {Object} 拆分完成的天时分秒
 * @example
 * console.info( parseUnit(12345 * 67890) );
 * // Object {day: 9, hour: 16, minute: 48, second: 22, ms: 50}
 * console.info( parseUnit(12345 * 67890, {maxUnit : 'hour'}) );
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

function parseUnit(time, spec) {
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

module.exports = parseUnit;

},{"spore-kit-num/numerical":243,"spore-kit-obj/assign":244}],246:[function(require,module,exports){
/**
 * ArrayBuffer转16进制字符串
 * @method abToHex
 * @param {ArrayBuffer} buffer 需要转换的 ArrayBuffer
 * @returns {String} 16进制字符串
 * @example
 * var ab = new ArrayBuffer(2);
 * var dv = new DataView(ab);
 * dv.setUint8(0, 171);
 * dv.setUint8(1, 205);
 * abToHex(ab); // => 'abcd'
 */

function abToHex(buffer) {
	if (Object.prototype.toString.call(buffer) !== '[object ArrayBuffer]') {
		return '';
	}
	return Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2);
		}
	).join('');
}

module.exports = abToHex;

},{}],247:[function(require,module,exports){
/**
 * ASCII字符串转16进制字符串
 * @method ascToHex
 * @param {String} str 需要转换的ASCII字符串
 * @returns {String} 16进制字符串
 * @example
 * ascToHex(); // => ''
 * ascToHex('*+'); // => '2a2b'
 */

function ascToHex(str) {
	if (!str) {
		return '';
	}
	var hex = '';
	var index;
	var len = str.length;
	for (index = 0; index < len; index++) {
		var int = str.charCodeAt(index);
		var code = (int).toString(16);
		hex += code;
	}
	return hex;
}

module.exports = ascToHex;

},{}],248:[function(require,module,exports){
/**
 * 16进制字符串转ArrayBuffer
 * @method hexToAb
 * @see https://caniuse.com/#search=ArrayBuffer
 * @param {String} str 需要转换的16进制字符串
 * @returns {ArrayBuffer} 被转换后的 ArrayBuffer 对象
 * @example
 * var ab = hexToAb();
 * ab.byteLength; // => 0
 * ab = hexToAb('abcd');
 * var dv = new DataView(ab);
 * ab.byteLength; // => 2
 * dv.getUint8(0); // => 171
 * dv.getUint8(1); // => 205
 */

function hexToAb(str) {
	if (!str) {
		return new ArrayBuffer(0);
	}
	var buffer = new ArrayBuffer(Math.ceil(str.length / 2));
	var dataView = new DataView(buffer);
	var index = 0;
	var i;
	var len = str.length;
	for (i = 0; i < len; i += 2) {
		var code = parseInt(str.substr(i, 2), 16);
		dataView.setUint8(index, code);
		index++;
	}
	return buffer;
}

module.exports = hexToAb;

},{}],249:[function(require,module,exports){
/**
 * 16进制字符串转ASCII字符串
 * @method hexToAsc
 * @param {String} str 需要转换的16进制字符串
 * @returns {String} ASCII字符串
 * @example
 * hexToAsc(); // => ''
 * hexToAsc('2a2b'); // => '*+'
 */

function hexToAsc(hex) {
	if (!hex) {
		return '';
	}
	return hex.replace(/[\da-f]{2}/gi, function(match) {
		var int = parseInt(match, 16);
		return String.fromCharCode(int);
	});
}

module.exports = hexToAsc;

},{}],250:[function(require,module,exports){
/**
 * HSL颜色值转换为RGB
 * - 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - h, s, 和 l 设定在 [0, 1] 之间
 * - 返回的 r, g, 和 b 在 [0, 255]之间
 * @method hslToRgb
 * @param {Number} h 色相
 * @param {Number} s 饱和度
 * @param {Number} l 亮度
 * @returns {Array} RGB色值数值
 * @example
 * hslToRgb(0, 0, 0); // => [0,0,0]
 * hslToRgb(0, 0, 1); // => [255,255,255]
 * hslToRgb(0.5555555555555555, 0.9374999999999999, 0.6862745098039216); // => [100,200,250]
 */

function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

function hslToRgb(h, s, l) {
	var r;
	var g;
	var b;

	if (s === 0) {
		// achromatic
		r = l;
		g = l;
		b = l;
	} else {
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports = hslToRgb;

},{}],251:[function(require,module,exports){
/**
 * # 其他工具函数
 * @module spore-kit-util
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/util
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.util.hslToRgb);
 *
 * // 单独引入 spore-kit-util
 * var $util = require('spore-kit-util');
 * console.info($util.hslToRgb);
 *
 * // 单独引入一个方法
 * var $hslToRgb = require('spore-kit-util/hslToRgb');
 */

exports.abToHex = require('./abToHex');
exports.ascToHex = require('./ascToHex');
exports.hexToAb = require('./hexToAb');
exports.hexToAsc = require('./hexToAsc');
exports.hslToRgb = require('./hslToRgb');
exports.job = require('./job');
exports.measureDistance = require('./measureDistance');
exports.rgbToHsl = require('./rgbToHsl');

},{"./abToHex":246,"./ascToHex":247,"./hexToAb":248,"./hexToAsc":249,"./hslToRgb":250,"./job":252,"./measureDistance":253,"./rgbToHsl":254}],252:[function(require,module,exports){
/**
 * 任务分时执行
 * - 一方面避免单次reflow流程执行太多js任务导致浏览器卡死
 * - 另一方面单个任务的报错不会影响后续任务的执行
 * @method job
 * @param {Function} fn 任务函数
 * @returns {Object} 任务队列对象
 * @example
 * job(function() {
 * 	//task1 start
 * });
 * job(function() {
 * 	//task2 start
 * });
 */

var manager = {};

manager.queue = [];

manager.add = function(fn, options) {
	options = options || {};
	manager.queue.push({
		fn: fn,
		conf: options
	});
	manager.step();
};

manager.step = function() {
	if (!manager.queue.length || manager.timer) { return; }
	manager.timer = setTimeout(function() {
		var item = manager.queue.shift();
		if (item) {
			if (item.fn && typeof item.fn === 'function') {
				item.fn.call(null);
			}
			manager.timer = null;
			manager.step();
		}
	}, 1);
};

function job(fn, options) {
	manager.add(fn, options);
	return manager;
}

module.exports = job;

},{}],253:[function(require,module,exports){
/**
 * 测量地理坐标的距离
 * @method measureDistance
 * @param {Number} lat1 坐标1精度
 * @param {Number} lng1 坐标1纬度
 * @param {Number} lat2 坐标2精度
 * @param {Number} lng2 坐标2纬度
 * @returns {Number} 2个坐标之间的距离（千米）
 * @example
 * var distance = measureDistance(
 *   SQUARELOCATION.latitude,
 *   SQUARELOCATION.longitude,
 *   coords.latitude,
 *   coords.longitude,
 * );
 */

function measureDistance (lat1, lng1, lat2, lng2) {
	var radLat1 = (lat1 * Math.PI) / 180.0;
	var radLat2 = (lat2 * Math.PI) / 180.0;
	var a = radLat1 - radLat2;
	var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
	var s = 2 * Math.asin(
		Math.sqrt(
			(Math.sin(a / 2) ** 2)
			+ Math.cos(radLat1) * Math.cos(radLat2) * (Math.sin(b / 2) ** 2)
		)
	);
	// 地球半径
	s *= 6378.137;
	return s;
}

module.exports = measureDistance;

},{}],254:[function(require,module,exports){
/**
 * RGB 颜色值转换为 HSL.
 * - 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - r, g, 和 b 需要在 [0, 255] 范围内
 * - 返回的 h, s, 和 l 在 [0, 1] 之间
 * @param {Number} r 红色色值
 * @param {Number} g 绿色色值
 * @param {Number} b 蓝色色值
 * @returns {Array} HSL各值数组
 * @example
 * rgbToHsl(100, 200, 250); // => [0.5555555555555555,0.9374999999999999,0.6862745098039216]
 * rgbToHsl(0, 0, 0); // => [0,0,0]
 * rgbToHsl(255, 255, 255); // => [0,0,1]
 */

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	var max = Math.max(r, g, b);
	var	min = Math.min(r, g, b);
	var h;
	var s;
	var l = (max + min) / 2;

	if (max === min) {
		// achromatic
		h = 0;
		s = 0;
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max === r) {
			h = (g - b) / d + (g < b ? 6 : 0);
		} else if (max === g) {
			h = (b - r) / d + 2;
		} else {
			h = (r - g) / d + 4;
		}
		h /= 6;
	}

	return [h, s, l];
}

module.exports = rgbToHsl;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L2Zha2VfM2VmNDQwZmIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvYXBwL2NhbGxVcC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAvaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvYXBwL25vZGVfbW9kdWxlcy9zcG9yZS1raXQtZW52L2Jyb3dzZXIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvYXBwL25vZGVfbW9kdWxlcy9zcG9yZS1raXQtZW52L25vZGVfbW9kdWxlcy9zcG9yZS1raXQtb2JqL2Fzc2lnbi5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAvbm9kZV9tb2R1bGVzL3Nwb3JlLWtpdC1lbnYvdWFNYXRjaC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2VyYXNlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9maW5kLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9pbmNsdWRlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvbm9kZV9tb2R1bGVzL3Nwb3JlLWtpdC1vYmovdHlwZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvY29va2llLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9vcmlnaW4uanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9mb3JtYXQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9nZXRMYXN0U3RhcnQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9nZXRUaW1lU3BsaXQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL25vZGVfbW9kdWxlcy9zcG9yZS1raXQtbnVtL2ZpeFRvLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvbm9kZV9tb2R1bGVzL3Nwb3JlLWtpdC1zdHIvc3Vic3RpdHV0ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZG9tL2lzTm9kZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vbm9kZV9tb2R1bGVzL2RvY3VtZW50LW9mZnNldC9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vbm9kZV9tb2R1bGVzL2RvbS1zdXBwb3J0L2luZGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2RvbS9ub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZG9tL25vZGVfbW9kdWxlcy9nZXQtZG9jdW1lbnQvaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZG9tL25vZGVfbW9kdWxlcy93aXRoaW4tZWxlbWVudC9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vb2Zmc2V0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9jb3JlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9kZXZpY2UuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZW52L2luZGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9uZXR3b3JrLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9vcy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi93ZWJwLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZXZ0L2luZGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9saXN0ZW5lci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvb2NjdXJJbnNpZGUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZXZ0L3RhcFN0b3AuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZm4vZGVsYXkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZm4vaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZm4vbG9jay5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9vbmNlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3ByZXBhcmUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZm4vcXVldWUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZm4vcmVndWxhci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZngvZmxhc2hBY3Rpb24uanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZngvZnguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZngvaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvZngvbm9kZV9tb2R1bGVzL2tsYXNzL2tsYXNzLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3Ntb290aFNjcm9sbFRvLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3N0aWNreS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC90aW1lci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC90cmFuc2l0aW9ucy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9nZXRTY3JpcHQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvaW8vaWZyYW1lUG9zdC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9nZXRRdWVyeS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9pbmRleC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9zZXRRdWVyeS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvYmFzZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvZGVsZWdhdGUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL2luZGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9rbGFzcy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19MaXN0Q2FjaGUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduTWVyZ2VWYWx1ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jSW5kZXhPZi5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduVmFsdWUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hcC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNTZXQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5c0luLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWVyZ2UuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZURlZXAuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VSZXN0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZURhdGFWaWV3LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVJlZ0V4cC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weUFycmF5LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9scy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHNJbi5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQXNzaWduZXIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VFYWNoLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19kZWZpbmVQcm9wZXJ0eS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5c0luLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXBEYXRhLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzSW4uanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFRhZy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQXJyYXkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUJ5VGFnLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSXRlcmF0ZWVDYWxsLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzTWFza2VkLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZVNldC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5c0luLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJSZXN0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19zYWZlR2V0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb1N0cmluZy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2hvcnRPdXQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9hc3NpZ24uanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvY2xvbmVEZWVwLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2NvbnN0YW50LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2ZvckVhY2guanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTWFwLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1BsYWluT2JqZWN0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU2V0LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9tZXJnZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9ub29wLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJBcnJheS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbXZjL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9QbGFpbk9iamVjdC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvdmlldy5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vY29tbWEuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvbnVtL2luZGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL251bS9saW1pdC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vbnVtZXJpY2FsLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL29iai9jb3Zlci5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovZmluZC5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2JMZW5ndGguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2RiY1RvU2JjLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9kZWNvZGVIVE1MLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9lbmNvZGVIVE1MLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9nZXRVbmlxdWVLZXkuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2h5cGhlbmF0ZS5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2lwVG9IZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2xlZnRCLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9zaXplT2ZVVEY4U3RyaW5nLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvY291bnREb3duLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvaW5kZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvdGltZS9wYXJzZVVuaXQuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9hYlRvSGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvYXNjVG9IZXguanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oZXhUb0FiLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9Bc2MuanMiLCIvVXNlcnMvdG9ueS93b3JrL2dpdGh1Yi9zcG9yZS9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oc2xUb1JnYi5qcyIsIi9Vc2Vycy90b255L3dvcmsvZ2l0aHViL3Nwb3JlL3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2luZGV4LmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvam9iLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvbWVhc3VyZURpc3RhbmNlLmpzIiwiL1VzZXJzL3Rvbnkvd29yay9naXRodWIvc3BvcmUvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvcmdiVG9Ic2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLmFwcCA9IHJlcXVpcmUoJy4vcGFja2FnZXMvYXBwJyk7XG5leHBvcnRzLmFyciA9IHJlcXVpcmUoJy4vcGFja2FnZXMvYXJyJyk7XG5leHBvcnRzLmNvb2tpZSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvY29va2llJyk7XG5leHBvcnRzLmRhdGUgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2RhdGUnKTtcbmV4cG9ydHMuZG9tID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9kb20nKTtcbmV4cG9ydHMuZW52ID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9lbnYnKTtcbmV4cG9ydHMuZXZ0ID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9ldnQnKTtcbmV4cG9ydHMuZm4gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2ZuJyk7XG5leHBvcnRzLmZ4ID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9meCcpO1xuZXhwb3J0cy5pbyA9IHJlcXVpcmUoJy4vcGFja2FnZXMvaW8nKTtcbmV4cG9ydHMubG9jYXRpb24gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2xvY2F0aW9uJyk7XG5leHBvcnRzLm12YyA9IHJlcXVpcmUoJy4vcGFja2FnZXMvbXZjJyk7XG5leHBvcnRzLm51bSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvbnVtJyk7XG5leHBvcnRzLm9iaiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvb2JqJyk7XG5leHBvcnRzLnN0ciA9IHJlcXVpcmUoJy4vcGFja2FnZXMvc3RyJyk7XG5leHBvcnRzLnRpbWUgPSByZXF1aXJlKCcuL3BhY2thZ2VzL3RpbWUnKTtcbmV4cG9ydHMudXRpbCA9IHJlcXVpcmUoJy4vcGFja2FnZXMvdXRpbCcpO1xuIiwiLyoqXG4gKiDmraTmlrnms5XnlKjkuo7lkbzotbfmnKzlnLDlrqLmiLfnq6/vvIzlkbzotbflpLHotKXml7bvvIzot7PovazliLDlrqLmiLfnq6/kuIvovb3lnLDlnYDmiJbogIXkuK3pl7TpobVcbiAqIC0g6aaW5YWI6ZyA6KaB5a6i5oi356uv5o+Q5L6b5LiA5Liq5Y2P6K6u5Zyw5Z2AIHByb3RvY29sXG4gKiAtIOeEtuWQjumAmui/h+a1j+iniOWZqOiuv+mXruivpeWcsOWdgOaIluiAhSBpZnJhbWUg6K6/6Zeu6K+l5Y2P6K6u5Zyw5Z2A5p2l6Kem5Y+R5a6i5oi356uv55qE5omT5byA5Yqo5L2cXG4gKiAtIOWcqOiuvuWumuWlveeahOi2heaXtuaXtumXtCAod2FpdGluZykg5Yiw6L6+5pe26L+b6KGM5qOA5p+lXG4gKiAtIOeUseS6jiBJT1Mg5LiL77yM6Lez6L2s5YiwIEFQUO+8jOmhtemdoiBKUyDkvJrooqvpmLvmraLmiafooYxcbiAqIC0g5omA5Lul5aaC5p6c6LaF5pe25pe26Ze05aSn5aSn6LaF6L+H5LqG6aKE5pyf5pe26Ze06IyD5Zu077yM5Y+v5pat5a6aIEFQUCDlt7LooqvmiZPlvIDvvIzmraTml7bop6blj5Egb25UaW1lb3V0IOWbnuiwg+S6i+S7tuWHveaVsFxuICogLSDlr7nkuo4gSU9T77yM5q2k5pe25aaC5p6c5LuOIEFQUCDov5Tlm57pobXpnaLvvIzlsLHlj6/ku6XpgJrov4cgd2FpdGluZ0xpbWl0IOaXtumXtOW3ruadpeWIpOaWreaYr+WQpuimgeaJp+ihjCBmYWxsYmFjayDlm57osIPkuovku7blh73mlbBcbiAqIC0gQW5kcm9pZCDkuIvvvIzot7PovazliLAgQVBQ77yM6aG16Z2iIEpTIOS8mue7p+e7reaJp+ihjFxuICogLSDmraTml7bml6DorrogQVBQIOaYr+WQpuW3suaJk+W8gO+8jOmDveS8muinpuWPkSBvbkZhbGxiYWNrIOS6i+S7tuS4jiBmYWxsYmFjayDlm57osIPkuovku7blh73mlbBcbiAqIC0gZmFsbGJhY2sg6buY6K6k5pON5L2c5piv6Lez6L2s5YiwIGZhbGxiYWNrVXJsIOWuouaIt+err+S4i+i9veWcsOWdgOaIluiAheS4remXtOmhteWcsOWdgFxuICogLSDov5nmoLflr7nkuo7msqHmnInlronoo4UgQVBQIOeahOenu+WKqOerr++8jOmhtemdouS8muWcqOi2heaXtuS6i+S7tuWPkeeUn+aXtu+8jOebtOaOpei3s+i9rOWIsCBmYWxsYmFja1VybFxuICogQG1ldGhvZCBjYWxsVXBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wcm90b2NvbCDlrqLmiLfnq69BUFDlkbzotbfljY/orq7lnLDlnYBcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmZhbGxiYWNrVXJsIOWuouaIt+err+S4i+i9veWcsOWdgOaIluiAheS4remXtOmhteWcsOWdgFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5hY3Rpb24g6Ieq5a6a5LmJ5ZG86LW35a6i5oi356uv55qE5pa55byPXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc3RhcnRUaW1lPW5ldyBEYXRlKCkuZ2V0VGltZSgpXSDlkbzotbflrqLmiLfnq6/nmoTlvIDlp4vml7bpl7QobXMp77yM5Lul5pe26Ze05pWw5YC85L2c5Li65Y+C5pWwXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2FpdGluZz04MDBdIOWRvOi1t+i2heaXtuetieW+heaXtumXtChtcylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53YWl0aW5nTGltaXQ9NTBdIOi2heaXtuWQjuajgOafpeWbnuiwg+aYr+WQpuWcqOatpOaXtumXtOmZkOWItuWGheinpuWPkShtcylcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmZhbGxiYWNrPWZ1bmN0aW9uICgpIHsgd2luZG93LmxvY2F0aW9uID0gZmFsbGJhY2tVcmw7IH1dIOm7mOiupOWbnumAgOaTjeS9nFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25GYWxsYmFjaz1udWxsXSDlkbzotbfmk43kvZzmnKrog73miJDlip/miafooYzml7bop6blj5HnmoTlm57osIPkuovku7blh73mlbBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uVGltZW91dD1udWxsXSDlkbzotbfotoXml7bop6blj5HnmoTlm57osIPkuovku7blh73mlbBcbiAqIEBleGFtcGxlXG4gKiBjYWxsVXAoe1xuICogXHRzdGFydFRpbWU6IERhdGUubm93KCksXG4gKiBcdHdhaXRpbmc6IDgwMCxcbiAqIFx0d2FpdGluZ0xpbWl0OiA1MCxcbiAqIFx0cHJvdG9jb2wgOiBzY2hlbWUsXG4gKiBcdGZhbGxiYWNrVXJsIDogZG93bmxvYWQsXG4gKiBcdG9uRmFsbGJhY2sgOiBmdW5jdGlvbiAoKSB7XG4gKiBcdFx0Ly8gc2hvdWxkIGRvd25sb2FkXG4gKiBcdH1cbiAqIH0pO1xuICovXG5cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnc3BvcmUta2l0LW9iai9hc3NpZ24nKTtcbnZhciAkYnJvd3NlciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1lbnYvYnJvd3NlcicpO1xuXG5mdW5jdGlvbiBjYWxsVXAgKG9wdGlvbnMpIHtcblx0dmFyIGNvbmYgPSAkYXNzaWduKHtcblx0XHRwcm90b2NvbDogJycsXG5cdFx0ZmFsbGJhY2tVcmw6ICcnLFxuXHRcdGFjdGlvbjogbnVsbCxcblx0XHRzdGFydFRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuXHRcdHdhaXRpbmc6IDgwMCxcblx0XHR3YWl0aW5nTGltaXQ6IDUwLFxuXHRcdGZhbGxiYWNrOiBmdW5jdGlvbihmYWxsYmFja1VybCkge1xuXHRcdFx0Ly8g5Zyo5LiA5a6a5pe26Ze05YaF5peg5rOV5ZSk6LW35a6i5oi356uv77yM6Lez6L2s5LiL6L295Zyw5Z2A5oiW5Yiw5Lit6Ze06aG1XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSBmYWxsYmFja1VybDtcblx0XHR9LFxuXHRcdG9uRmFsbGJhY2s6IG51bGwsXG5cdFx0b25UaW1lb3V0OiBudWxsXG5cdH0sIG9wdGlvbnMpO1xuXG5cdHZhciB3SWQ7XG5cdHZhciBpZnJhbWU7XG5cblx0aWYgKHR5cGVvZiBjb25mLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGNvbmYuYWN0aW9uKCk7XG5cdH0gZWxzZSBpZiAoJGJyb3dzZXIoKS5jaHJvbWUpIHtcblx0XHQvLyBjaHJvbWXkuItpZnJhbWXml6Dms5XllKTotbdBbmRyb2lk5a6i5oi356uv77yM6L+Z6YeM5L2/55Sod2luZG93Lm9wZW5cblx0XHQvLyDlj6bkuIDkuKrmlrnmoYjlj4LogIMgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hyb21lL21vYmlsZS9kb2NzL2ludGVudHNcblx0XHR2YXIgd2luID0gd2luZG93Lm9wZW4oY29uZi5wcm90b2NvbCk7XG5cdFx0d0lkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodHlwZW9mIHdpbiA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh3SWQpO1xuXHRcdFx0XHR3aW4uY2xvc2UoKTtcblx0XHRcdH1cblx0XHR9LCAxMCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8g5Yib5bu6aWZyYW1lXG5cdFx0aWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG5cdFx0aWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0aWZyYW1lLnNyYyA9IGNvbmYucHJvdG9jb2w7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXHR9XG5cblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRpZiAod0lkKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHdJZCk7XG5cdFx0fVxuXG5cdFx0aWYgKGlmcmFtZSkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgY29uZi5vblRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNvbmYub25UaW1lb3V0KCk7XG5cdFx0fVxuXG5cdFx0Ly8gaW9z5LiL77yM6Lez6L2s5YiwQVBQ77yM6aG16Z2iSlPkvJrooqvpmLvmraLmiafooYzjgIJcblx0XHQvLyDlm6DmraTlpoLmnpzotoXml7bml7bpl7TlpKflpKfotoXov4fkuobpooTmnJ/ml7bpl7TojIPlm7TvvIzlj6/mlq3lrppBUFDlt7LooqvmiZPlvIDjgIJcblx0XHRpZiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBjb25mLnN0YXJ0VGltZSA8IGNvbmYud2FpdGluZyArIGNvbmYud2FpdGluZ0xpbWl0KSB7XG5cdFx0XHRpZiAodHlwZW9mIGNvbmYub25GYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjb25mLm9uRmFsbGJhY2soKTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgY29uZi5mYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjb25mLmZhbGxiYWNrKGNvbmYuZmFsbGJhY2tVcmwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwgY29uZi53YWl0aW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYWxsVXA7XG4iLCIvKipcbiAqICMg5aSE55CG5LiO5a6i5oi356uv55u45YWz55qE5Lqk5LqSXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC1hcHBcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2FwcFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5hcHAuY2FsbFVwKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LWFwcFxuICogdmFyICRhcHAgPSByZXF1aXJlKCdzcG9yZS1raXQtYXBwJyk7XG4gKiBjb25zb2xlLmluZm8oJGFwcC5jYWxsVXApO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRjYWxsVXAgPSByZXF1aXJlKCdzcG9yZS1raXQtYXBwL2NhbGxVcCcpO1xuICovXG5cbmV4cG9ydHMuY2FsbFVwID0gcmVxdWlyZSgnLi9jYWxsVXAnKTtcbiIsIi8qKlxuICog5qOA5rWL5rWP6KeI5Zmo57G75Z6LXG4gKlxuICog5pSv5oyB55qE57G75Z6L5qOA5rWLXG4gKiAtIHFxXG4gKiAtIHVjXG4gKiAtIGJhaWR1XG4gKiAtIG1pdWlcbiAqIC0gd2VpeGluXG4gKiAtIHF6b25lXG4gKiAtIHFxbmV3c1xuICogLSBxcWhvdXNlXG4gKiAtIHFxYnJvd3NlclxuICogLSBjaHJvbWVcbiAqIEBtZXRob2QgYnJvd3NlclxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogY29uc29sZS5pbmZvKGJyb3dzZXIoKS5jaHJvbWUpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovYXNzaWduJyk7XG52YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcblxudmFyIHRlc3RlcnMgPSB7XG5cdHFxOiAoL3FxXFwvKFtcXGQuXSspL2kpLFxuXHR1YzogKC91Y2Jyb3dzZXIvaSksXG5cdGJhaWR1OiAoL2JhaWR1YnJvd3Nlci9pKSxcblx0bWl1aTogKC9taXVpYnJvd3Nlci9pKSxcblx0d2VpeGluOiAoL21pY3JvbWVzc2VuZ2VyL2kpLFxuXHRxem9uZTogKC9xem9uZVxcLy9pKSxcblx0cXFuZXdzOiAoL3FxbmV3c1xcLyhbXFxkLl0rKS9pKSxcblx0cXFob3VzZTogKC9xcWhvdXNlL2kpLFxuXHRxcWJyb3dzZXI6ICgvcXFicm93c2VyL2kpLFxuXHRjaHJvbWU6ICgvY2hyb21lL2kpXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcblx0dmFyIGNvbmYgPSAkYXNzaWduKHtcblx0XHR1YTogJydcblx0fSwgb3B0aW9ucyk7XG5cblx0JGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cblx0cmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gYnJvd3NlcigpIHtcblx0aWYgKCFyZXN1bHQpIHtcblx0XHRyZXN1bHQgPSBkZXRlY3QoKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5icm93c2VyLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBicm93c2VyO1xuIiwiLyoqXG4gKiDmianlsZXlubbopobnm5blr7nosaFcbiAqIEBtZXRob2QgYXNzaWduXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIOimgeaJqeWxleeahOWvueixoVxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0g6KaB5omp5bGV55qE5bGe5oCn6ZSu5YC85a+5XG4gKiBAcmV0dXJucyB7T2JqZWN0fSDmianlsZXlkI7nmoTmupDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgb2JqID0ge2E6IDEsIGI6IDJ9O1xuICogY29uc29sZS5pbmZvKGFzc2lnbihvYmosIHtiOiAzLCBjOiA0fSkpOyAvLyB7YTogMSwgYjogMywgYzogNH1cbiAqIGNvbnNvbGUuaW5mbyhhc3NpZ24oe30sIG9iaiwge2I6IDMsIGM6IDR9KSk7IC8vIHthOiAxLCBiOiAzLCBjOiA0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2lnbiAob2JqKSB7XG5cdG9iaiA9IG9iaiB8fCB7fTtcblx0QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuXHRcdHZhciBwcm9wO1xuXHRcdHNvdXJjZSA9IHNvdXJjZSB8fCB7fTtcblx0XHRmb3IgKHByb3AgaW4gc291cmNlKSB7XG5cdFx0XHRpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG5cdFx0XHRcdG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsIi8qKlxuICogVUHlrZfnrKbkuLLljLnphY3liJfooahcbiAqIEBtZXRob2QgdWFNYXRjaFxuICogQHBhcmFtIHtPYmplY3R9IGxpc3Qg5qOA5rWLIEhhc2gg5YiX6KGoXG4gKiBAcGFyYW0ge1N0cmluZ30gdWEg55So5LqO5qOA5rWL55qEIFVBIOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IGNvbmYg5qOA5rWL5Zmo6YCJ6aG577yM5Lyg6YCS57uZ5qOA5rWL5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyIHJzID0gdWFNYXRjaCh7XG4gKiBcdHRyaWRlbnQ6ICd0cmlkZW50JyxcbiAqIFx0cHJlc3RvOiAvcHJlc3RvLyxcbiAqIFx0Z2Vja286IGZ1bmN0aW9uKHVhKXtcbiAqIFx0XHRyZXR1cm4gdWEuaW5kZXhPZignZ2Vja28nKSA+IC0xICYmIHVhLmluZGV4T2YoJ2todG1sJykgPT09IC0xO1xuICogXHR9XG4gKiB9LCAneHh4IHByZXN0byB4eHgnKTtcbiAqIGNvbnNvbGUuaW5mbyhycy5wcmVzdG8pOyAvLyB0cnVlXG4gKiBjb25zb2xlLmluZm8ocnMudHJpZGVudCk7IC8vIHVuZGVmaW5lZFxuICovXG5cbmZ1bmN0aW9uIHVhTWF0Y2gobGlzdCwgdWEsIGNvbmYpIHtcblx0dmFyIHJlc3VsdCA9IHt9O1xuXHRpZiAoIXVhKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR1YSA9ICcnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuXHRcdH1cblx0fVxuXHR1YSA9IHVhLnRvTG93ZXJDYXNlKCk7XG5cdGlmICh0eXBlb2YgbGlzdCA9PT0gJ29iamVjdCcpIHtcblx0XHRPYmplY3Qua2V5cyhsaXN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0dmFyIHRlc3RlciA9IGxpc3Rba2V5XTtcblx0XHRcdGlmICh0ZXN0ZXIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiB0ZXN0ZXIgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0aWYgKHVhLmluZGV4T2YodGVzdGVyKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0ZXN0ZXIpID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSB1YS5tYXRjaCh0ZXN0ZXIpO1xuXHRcdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdFx0aWYgKG1hdGNoWzFdKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdFtrZXldID0gbWF0Y2hbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiB0ZXN0ZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRpZiAodGVzdGVyKHVhLCBjb25mKSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W2tleV0gPSB0ZXN0ZXIodWEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1YU1hdGNoO1xuIiwiLyoqXG4gKiDnoa7orqTlr7nosaHmmK/lkKblnKjmlbDnu4TkuK1cbiAqIEBtZXRob2QgY29udGFpbnNcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7Kn0gaXRlbSDopoHmkJzntKLnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtCb29sZWFufSDlpoLmnpzlr7nosaHlnKjmlbDnu4TkuK3vvIzov5Tlm54gdHJ1ZVxuICogQGV4YW1wbGVcbiAqIGNvbnNvbGUuaW5mbyhjb250YWlucyhbMSwyLDMsNCw1XSwgMykpO1x0Ly8gdHJ1ZVxuICovXG5cbmZ1bmN0aW9uIGNvbnRhaW5zIChhcnIsIGl0ZW0pIHtcblx0dmFyIGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG5cdHJldHVybiBpbmRleCA+PSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zO1xuIiwiLyoqXG4gKiDliKDpmaTmlbDnu4TkuK3nmoTlr7nosaFcbiAqIEBtZXRob2QgZXJhc2VcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7Kn0gaXRlbSDopoHmuIXpmaTnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWvueixoeWOn+acrOaJgOWcqOS9jee9rlxuICogQGV4YW1wbGVcbiAqIGNvbnNvbGUuaW5mbyhlcmFzZShbMSwyLDMsNCw1XSwzKSk7XHQvLyBbMSwyLDQsNV1cbiAqL1xuXG5mdW5jdGlvbiBlcmFzZSAoYXJyLCBpdGVtKSB7XG5cdHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xuXHRpZiAoaW5kZXggPj0gMCkge1xuXHRcdGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuXHR9XG5cdHJldHVybiBpbmRleDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcmFzZTtcbiIsIi8qKlxuICog5p+l5om+56ym5ZCI5p2h5Lu255qE5YWD57Sg5Zyo5pWw57uE5Lit55qE5L2N572uXG4gKiBAbWV0aG9kIGZpbmRcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOadoeS7tuWHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSDlh73mlbDnmoR0aGlz5oyH5ZCRXG4gKiBAcmV0dXJuIHtBcnJheX0g56ym5ZCI5p2h5Lu255qE5YWD57Sg5Zyo5pWw57uE5Lit55qE5L2N572uXG4gKiBAZXhhbXBsZVxuICogXHRjb25zb2xlLmluZm8oZmluZChbMSwyLDMsNCw1XSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAqIFx0XHRyZXR1cm4gaXRlbSA8IDM7XG4gKiBcdH0pO1x0Ly8gWzAsIDFdXG4gKi9cblxuZnVuY3Rpb24gZmluZCAoYXJyLCBmbiwgY29udGV4dCkge1xuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuXHRcdGlmIChmbi5jYWxsKGNvbnRleHQsIGl0ZW0sIGluZGV4LCBhcnIpKSB7XG5cdFx0XHRwb3NpdGlvbnMucHVzaChpbmRleCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHBvc2l0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kO1xuIiwiLyoqXG4gKiDmlbDnu4TmiYHlubPljJZcbiAqIEBtZXRob2QgZmxhdHRlblxuICogQHBhcmFtIHthcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHJldHVybnMge2FycmF5fSDnu4/ov4fmiYHlubPljJblpITnkIbnmoTmlbDnu4RcbiAqIEBleGFtcGxlXG4gKiBjb25zb2xlLmluZm8oZmxhdHRlbihbMSwgWzIsM10sIFs0LDVdXSkpO1x0Ly8gWzEsMiwzLDQsNV1cbiAqL1xuXG52YXIgJHR5cGUgPSByZXF1aXJlKCdzcG9yZS1raXQtb2JqL3R5cGUnKTtcblxuZnVuY3Rpb24gZmxhdHRlbiAoYXJyKSB7XG5cdHZhciBhcnJheSA9IFtdO1xuXHRmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHR2YXIgdHlwZSA9ICR0eXBlKGFycltpXSk7XG5cdFx0aWYgKHR5cGUgPT09ICdudWxsJykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGFycmF5ID0gYXJyYXkuY29uY2F0KFxuXHRcdFx0dHlwZSA9PT0gJ2FycmF5JyA/IGZsYXR0ZW4oYXJyW2ldKSA6IGFycltpXVxuXHRcdCk7XG5cdH1cblx0cmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW47XG4iLCIvKipcbiAqIOehruiupOWvueixoeaYr+WQpuWcqOaVsOe7hOS4re+8jOS4jeWtmOWcqOWImeWwhuWvueixoeaPkuWFpeWIsOaVsOe7hOS4rVxuICogQG1ldGhvZCBpbmNsdWRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0geyp9IGl0ZW0g6KaB5o+S5YWl55qE5a+56LGhXG4gKiBAcmV0dXJucyB7QXJyYXl9IOe7j+i/h+WkhOeQhueahOa6kOaVsOe7hFxuICogQGV4YW1wbGVcbiAqIGNvbnNvbGUuaW5mbyhpbmNsdWRlKFsxLDIsM10sNCkpO1x0Ly8gWzEsMiwzLDRdXG4gKiBjb25zb2xlLmluZm8oaW5jbHVkZShbMSwyLDNdLDMpKTtcdC8vIFsxLDIsM11cbiAqL1xuXG52YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuXG5mdW5jdGlvbiBpbmNsdWRlIChhcnIsIGl0ZW0pIHtcblx0aWYgKCEkY29udGFpbnMoYXJyLCBpdGVtKSkge1xuXHRcdGFyci5wdXNoKGl0ZW0pO1xuXHR9XG5cdHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5jbHVkZTtcbiIsIi8qKlxuICogIyDnsbvmlbDnu4Tlr7nosaHnm7jlhbPlt6Xlhbflh73mlbBcbiAqIEBtb2R1bGUgc3BvcmUta2l0LWFyclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvYXJyXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmFyci5jb250YWlucyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC1hcnJcbiAqIHZhciAkYXJyID0gcmVxdWlyZSgnc3BvcmUta2l0LWFycicpO1xuICogY29uc29sZS5pbmZvKCRhcnIuY29udGFpbnMpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRjb250YWlucyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1hcnIvY29udGFpbnMnKTtcbiAqL1xuXG5leHBvcnRzLmNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuZXhwb3J0cy5lcmFzZSA9IHJlcXVpcmUoJy4vZXJhc2UnKTtcbmV4cG9ydHMuZmluZCA9IHJlcXVpcmUoJy4vZmluZCcpO1xuZXhwb3J0cy5mbGF0dGVuID0gcmVxdWlyZSgnLi9mbGF0dGVuJyk7XG5leHBvcnRzLmluY2x1ZGUgPSByZXF1aXJlKCcuL2luY2x1ZGUnKTtcbiIsIi8qKlxuICog6I635Y+W5pWw5o2u57G75Z6LXG4gKiBAbWV0aG9kIHR5cGVcbiAqIEBwYXJhbSB7Kn0gaXRlbSDku7vkvZXnsbvlnovmlbDmja5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IOWvueixoeexu+Wei1xuICogQGV4YW1wbGVcbiAqIHR5cGUoe30pOyAvLyAnb2JqZWN0J1xuICogdHlwZSgxKTsgLy8gJ251bWJlcidcbiAqIHR5cGUoJycpOyAvLyAnc3RyaW5nJ1xuICogdHlwZShmdW5jdGlvbigpe30pOyAvLyAnZnVuY3Rpb24nXG4gKiB0eXBlKCk7IC8vICd1bmRlZmluZWQnXG4gKiB0eXBlKG51bGwpOyAvLyAnbnVsbCdcbiAqIHR5cGUobmV3IERhdGUoKSk7IC8vICdkYXRlJ1xuICogdHlwZSgvYS8pOyAvLyAncmVnZXhwJ1xuICogdHlwZShTeW1ib2woJ2EnKSk7IC8vICdzeW1ib2wnXG4gKiB0eXBlKHdpbmRvdykgLy8gJ3dpbmRvdydcbiAqIHR5cGUoZG9jdW1lbnQpIC8vICdodG1sZG9jdW1lbnQnXG4gKiB0eXBlKGRvY3VtZW50LmJvZHkpIC8vICdodG1sYm9keWVsZW1lbnQnXG4gKiB0eXBlKGRvY3VtZW50LmhlYWQpIC8vICdodG1saGVhZGVsZW1lbnQnXG4gKiB0eXBlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKSkgLy8gJ2h0bWxjb2xsZWN0aW9uJ1xuICogdHlwZShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JylbMF0pIC8vICdodG1sZGl2ZWxlbWVudCdcbiAqL1xuXG5mdW5jdGlvbiB0eXBlIChpdGVtKSB7XG5cdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cdFx0LmNhbGwoaXRlbSlcblx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdC5yZXBsYWNlKC9eXFxbb2JqZWN0XFxzKnxcXF0kL2dpLCAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZTtcbiIsIi8qKlxuICog5o+Q5L6b5a+5IGNvb2tpZSDnmoTor7vlhpnog73liptcbiAqIC0g5YaZ5YWl5pe26Ieq5Yqo55SoIGVuY29kZVVSSUNvbXBvbmVudCDnvJbnoIFcbiAqIC0g6K+75Y+W5pe26Ieq5Yqo55SoIGRlY29kZVVSSUNvbXBvbmVudCDop6PnoIFcbiAqIEBtb2R1bGUgY29va2llXG4gKiBAc2VlIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2pzLWNvb2tpZVxuICogQGV4YW1wbGVcbiAqIGNvb2tpZS5zZXQoJ25hbWUnLCAndmFsdWUnLCB7XG4gKiBcdGV4cGlyZXM6IDFcbiAqIH0pO1xuICogY29va2llLnJlYWQoJ25hbWUnKVx0Ly8gJ3ZhbHVlJ1xuICovXG5cbnZhciBDb29raWUgPSByZXF1aXJlKCdqcy1jb29raWUnKTtcblxudmFyIGluc3RhbmNlID0gQ29va2llLndpdGhDb252ZXJ0ZXIoe1xuXHRyZWFkOiBmdW5jdGlvbih2YWwpIHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cdH0sXG5cdHdyaXRlOiBmdW5jdGlvbih2YWwpIHtcblx0XHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluc3RhbmNlO1xuIiwiLyoqXG4gKiAjIOacrOWcsOWtmOWCqOebuOWFs+W3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS1raXQtY29va2llXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9jb29raWVcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuY29va2llLmNvb2tpZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC1jb29raWVcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnc3BvcmUta2l0LWNvb2tpZScpO1xuICogY29uc29sZS5pbmZvKCRjb29raWUuY29va2llKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrlt6Xlhbflr7nosaFcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnc3BvcmUta2l0LWNvb2tpZS9jb29raWUnKTtcbiAqL1xuXG5leHBvcnRzLmNvb2tpZSA9IHJlcXVpcmUoJy4vY29va2llJyk7XG5leHBvcnRzLm9yaWdpbiA9IHJlcXVpcmUoJy4vb3JpZ2luJyk7XG4iLCIvKiFcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjIuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcbiAqXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IGZhbHNlO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZVxuXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XG5cdFx0XHRcdFx0cGF0aDogJy8nXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0dmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdGV4cGlyZXMuc2V0TWlsbGlzZWNvbmRzKGV4cGlyZXMuZ2V0TWlsbGlzZWNvbmRzKCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGV4cGlyZXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSdyZSB1c2luZyBcImV4cGlyZXNcIiBiZWNhdXNlIFwibWF4LWFnZVwiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUVcblx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRcdFx0aWYgKCFjb252ZXJ0ZXIud3JpdGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XG5cblx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuXG5cdFx0XHRcdGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWFkXG5cblx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG5cdFx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC4gQWxzbyBwcmV2ZW50cyBvZGQgcmVzdWx0IHdoZW5cblx0XHRcdC8vIGNhbGxpbmcgXCJnZXQoKVwiXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuXHRcdFx0dmFyIHJkZWNvZGUgPSAvKCVbMC05QS1aXXsyfSkrL2c7XG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gcGFydHNbMF0ucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvbnZlcnRlci5yZWFkID9cblx0XHRcdFx0XHRcdGNvbnZlcnRlci5yZWFkKGNvb2tpZSwgbmFtZSkgOiBjb252ZXJ0ZXIoY29va2llLCBuYW1lKSB8fFxuXHRcdFx0XHRcdFx0Y29va2llLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gY29va2llO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtuYW1lXSA9IGNvb2tpZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0YXBpLnNldCA9IGFwaTtcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKGFwaSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGFwaS5hcHBseSh7XG5cdFx0XHRcdGpzb246IHRydWVcblx0XHRcdH0sIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cdFx0fTtcblx0XHRhcGkuZGVmYXVsdHMgPSB7fTtcblxuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcblx0XHRcdFx0ZXhwaXJlczogLTFcblx0XHRcdH0pKTtcblx0XHR9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcbiIsIi8qKlxuICog5o+Q5L6b5a+5IGNvb2tpZSDnmoTor7vlhpnog73liptcbiAqIC0g5q2k5qih5Z2X55u05o6l5o+Q5L6bIGpzLWNvb2tpZSDnmoTljp/nlJ/og73lipvvvIzkuI3lgZrku7vkvZXoh6rliqjnvJbop6PnoIFcbiAqIEBtb2R1bGUgb3JpZ2luXG4gKiBAc2VlIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2pzLWNvb2tpZVxuICogQGV4YW1wbGVcbiAqIG9yaWdpbi5zZXQoJ25hbWUnLCAndmFsdWUnLCB7XG4gKiBcdGV4cGlyZXM6IDFcbiAqIH0pO1xuICogb3JpZ2luLnJlYWQoJ25hbWUnKVx0Ly8gJ3ZhbHVlJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xuIiwiLyoqXG4gKiDml6XmnJ/lr7nosaHmoLzlvI/ljJbovpPlh7pcbiAqXG4gKiDmoLzlvI/ljJbml6XmnJ/lr7nosaHmqKHmnb/plK7lgLzor7TmmI5cbiAqIC0geWVhciDlubTku73ljp/lp4vmlbDlgLxcbiAqIC0gbW9udGgg5pyI5Lu95Y6f5aeL5pWw5YC8WzEsIDEyXVxuICogLSBkYXRlIOaXpeacn+WOn+Wni+aVsOWAvFsxLCAzMV1cbiAqIC0gZGF5IOaYn+acn+WOn+Wni+aVsOWAvFswLCA2XVxuICogLSBob3VycyDlsI/ml7bljp/lp4vmlbDlgLxbMCwgMjNdXG4gKiAtIG1pbml1dGVzIOWIhumSn+WOn+Wni+aVsOWAvFswLCA1OV1cbiAqIC0gc2Vjb25kcyDnp5Lljp/lp4vmlbDlgLxbMCwgNTldXG4gKiAtIG1pbGxpU2Vjb25kcyDmr6vnp5Lljp/lp4vmlbDlgLxbMCwgOTk5XVxuICogLSBZWVlZIOW5tOS7veaVsOWAvO+8jOeyvuehruWIsDTkvY0oMTIgPT4gJzAwMTInKVxuICogLSBZWSDlubTku73mlbDlgLzvvIznsr7noa7liLAy5L2NKDIwMTggPT4gJzE4JylcbiAqIC0gWSDlubTku73ljp/lp4vmlbDlgLxcbiAqIC0gTU0g5pyI5Lu95pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIE0g5pyI5Lu95Y6f5aeL5pWw5YC8XG4gKiAtIEREIOaXpeacn+aVsOWAvO+8jOeyvuehruWIsDLkvY0oMyA9PiAnMDMnKVxuICogLSBEIOaXpeacn+WOn+Wni+aVsOWAvFxuICogLSBkIOaYn+acn+aVsOWAvO+8jOmAmui/hyB3ZWVrZGF5IOWPguaVsOaYoOWwhOWPluW+lygwID0+ICfml6UnKVxuICogLSBoaCDlsI/ml7bmlbDlgLzvvIznsr7noa7liLAy5L2NKDkgPT4gJzA5JylcbiAqIC0gaCDlsI/ml7bljp/lp4vmlbDlgLxcbiAqIC0gbW0g5YiG6ZKf5pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIG0g5YiG6ZKf5Y6f5aeL5pWw5YC8XG4gKiAtIHNzIOenkuaVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBzIOenkuWOn+Wni+aVsOWAvFxuICogLSBtc3Mg5q+r56eS5pWw5YC877yM57K+56Gu5YiwM+S9jSg5ID0+ICcwMDknKVxuICogLSBtcyDmr6vnp5Lljp/lp4vmlbDlgLxcbiAqIEBtZXRob2QgZm9ybWF0XG4gKiBAcGFyYW0ge0RhdGV9IGRvYmog5pel5pyf5a+56LGh77yM5oiW6ICF5Y+v5Lul6KKr6L2s5o2i5Li65pel5pyf5a+56LGh55qE5pWw5o2uXG4gKiBAcGFyYW0ge09iamVjdH0gW3NwZWNdIOagvOW8j+WMlumAiemhuVxuICogQHBhcmFtIHtBcnJheX0gW3NwZWMud2Vla2RheT0n5pel5LiA5LqM5LiJ5Zub5LqU5YWtJy5zcGxpdCgnJyldIOS4gOWRqOWGheWQhOWkqeWvueW6lOWQjeensO+8jOmhuuW6j+S7juWRqOaXpeeul+i1t1xuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLnRlbXBsYXRlPSd7e1lZWVl9fS17e01NfX0te3tERH19IHt7aGh9fTp7e21tfX0nXSDmoLzlvI/ljJbmqKHmnb9cbiAqIEByZXR1cm4ge1N0cmluZ30g5qC85byP5YyW5a6M5oiQ55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogXHRjb25zb2xlLmluZm8oXG4gKiBcdFx0Zm9ybWF0KG5ldyBEYXRlKCkse1xuICogXHRcdFx0dGVtcGxhdGUgOiAne3tZWVlZfX3lubR7e01NfX3mnIh7e0REfX3ml6Ug5ZGoe3tkfX0ge3toaH195pe2e3ttbX195YiGe3tzc31956eSJ1xuICogXHRcdH0pXG4gKiBcdCk7XG4gKiBcdC8vIDIwMTXlubQwOeaciDA55pelIOWRqOS4iSAxNOaXtjE55YiGNDLnp5JcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovYXNzaWduJyk7XG52YXIgJHN1YnN0aXR1dGUgPSByZXF1aXJlKCdzcG9yZS1raXQtc3RyL3N1YnN0aXR1dGUnKTtcbnZhciAkZml4VG8gPSByZXF1aXJlKCdzcG9yZS1raXQtbnVtL2ZpeFRvJyk7XG5cbnZhciByTGltaXQgPSBmdW5jdGlvbihudW0sIHcpIHtcblx0dmFyIHN0ciA9ICRmaXhUbyhudW0sIHcpO1xuXHR2YXIgZGVsdGEgPSBzdHIubGVuZ3RoIC0gdztcblx0cmV0dXJuIGRlbHRhID4gMCA/IHN0ci5zdWJzdHIoZGVsdGEpIDogc3RyO1xufTtcblxuZnVuY3Rpb24gZm9ybWF0KGRvYmosIHNwZWMpIHtcblx0dmFyIG91dHB1dCA9ICcnO1xuXHR2YXIgZGF0YSA9IHt9O1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oXG5cdFx0e1xuXHRcdFx0d2Vla2RheTogJ+aXpeS4gOS6jOS4ieWbm+S6lOWFrScuc3BsaXQoJycpLFxuXHRcdFx0dGVtcGxhdGU6ICd7e1lZWVl9fS17e01NfX0te3tERH19IHt7aGh9fTp7e21tfX0nXG5cdFx0fSxcblx0XHRzcGVjXG5cdCk7XG5cblx0ZG9iaiA9IG5ldyBEYXRlKGRvYmopO1xuXHRkYXRhLnllYXIgPSBkb2JqLmdldEZ1bGxZZWFyKCk7XG5cdGRhdGEubW9udGggPSBkb2JqLmdldE1vbnRoKCkgKyAxO1xuXHRkYXRhLmRhdGUgPSBkb2JqLmdldERhdGUoKTtcblx0ZGF0YS5kYXkgPSBkb2JqLmdldERheSgpO1xuXHRkYXRhLmhvdXJzID0gZG9iai5nZXRIb3VycygpO1xuXHRkYXRhLm1pbml1dGVzID0gZG9iai5nZXRNaW51dGVzKCk7XG5cdGRhdGEuc2Vjb25kcyA9IGRvYmouZ2V0U2Vjb25kcygpO1xuXHRkYXRhLm1pbGxpU2Vjb25kcyA9IGRvYmouZ2V0TWlsbGlzZWNvbmRzKCk7XG5cblx0ZGF0YS5ZWVlZID0gckxpbWl0KGRhdGEueWVhciwgNCk7XG5cdGRhdGEuWVkgPSByTGltaXQoZGF0YS55ZWFyLCAyKTtcblx0ZGF0YS5ZID0gZGF0YS55ZWFyO1xuXG5cdGRhdGEuTU0gPSAkZml4VG8oZGF0YS5tb250aCwgMik7XG5cdGRhdGEuTSA9IGRhdGEubW9udGg7XG5cblx0ZGF0YS5ERCA9ICRmaXhUbyhkYXRhLmRhdGUsIDIpO1xuXHRkYXRhLkQgPSBkYXRhLmRhdGU7XG5cblx0ZGF0YS5kID0gY29uZi53ZWVrZGF5W2RhdGEuZGF5XTtcblxuXHRkYXRhLmhoID0gJGZpeFRvKGRhdGEuaG91cnMsIDIpO1xuXHRkYXRhLmggPSBkYXRhLmhvdXJzO1xuXG5cdGRhdGEubW0gPSAkZml4VG8oZGF0YS5taW5pdXRlcywgMik7XG5cdGRhdGEubSA9IGRhdGEubWluaXV0ZXM7XG5cblx0ZGF0YS5zcyA9ICRmaXhUbyhkYXRhLnNlY29uZHMsIDIpO1xuXHRkYXRhLnMgPSBkYXRhLnNlY29uZHM7XG5cblx0ZGF0YS5tc3MgPSAkZml4VG8oZGF0YS5taWxsaVNlY29uZHMsIDIpO1xuXHRkYXRhLm1zID0gZGF0YS5taWxsaVNlY29uZHM7XG5cblx0b3V0cHV0ID0gJHN1YnN0aXR1dGUoY29uZi50ZW1wbGF0ZSwgZGF0YSk7XG5cdHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0O1xuIiwiLyoqXG4gKiDojrflj5bov4fljrvkuIDmrrXml7bpl7TnmoTotbflp4vml6XmnJ/vvIzlpoIz5pyI5YmN56ysMeWkqe+8jDLlkajliY3nrKwx5aSp77yMM+Wwj+aXtuWJjeaVtOeCuVxuICogQG1ldGhvZCBnZXRMYXN0U3RhcnRcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSDljZXkvY3ml7bpl7TnsbvlnovvvIzlj6/pgIkgWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInXVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IOWkmuWwkeWNleS9jeaXtumXtOS5i+WJjVxuICogQHJldHVybnMge0RhdGV9IOacgOi/keWNleS9jeaXtumXtOeahOi1t+Wni+aXtumXtOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciB0aW1lID0gZ2V0TGFzdFN0YXJ0KFxuICogXHRuZXcgRGF0ZSgnMjAxOC0xMC0yNScpLFxuICogXHQnbW9udGgnLFxuICogXHQwXG4gKiApLmdldFRpbWUoKTsgLy8gMTUzODMyMzIwMDAwMFxuICogbmV3IERhdGUodGltZSk7IC8vIE1vbiBPY3QgMDEgMjAxOCAwMDowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICovXG5cbnZhciAkZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnLi9nZXRUaW1lU3BsaXQnKTtcblxudmFyIEhPVVIgPSA2MCAqIDYwICogMTAwMDtcbnZhciBEQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG5mdW5jdGlvbiBnZXRMYXN0U3RhcnQodGltZSwgdHlwZSwgY291bnQpIHtcblx0dmFyIGRhdGV0aW1lID0gbmV3IERhdGUodGltZSk7XG5cdHZhciBzdGFtcCA9IGRhdGV0aW1lO1xuXHR2YXIgeWVhcjtcblx0dmFyIG1vbnRoO1xuXHR2YXIgYWxsTW9udGhzO1xuXHR2YXIgdW5pdDtcblx0aWYgKCF0eXBlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdyZXF1aXJlZCBwYXJhbSB0eXBlJyk7XG5cdH1cblx0Y291bnQgPSBjb3VudCB8fCAwO1xuXHRpZiAodHlwZSA9PT0gJ3llYXInKSB7XG5cdFx0eWVhciA9IGRhdGV0aW1lLmdldEZ1bGxZZWFyKCk7XG5cdFx0eWVhciAtPSBjb3VudDtcblx0XHRzdGFtcCA9IG5ldyBEYXRlKHllYXIgKyAnLzEvMScpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtb250aCcpIHtcblx0XHR5ZWFyID0gZGF0ZXRpbWUuZ2V0RnVsbFllYXIoKTtcblx0XHRtb250aCA9IGRhdGV0aW1lLmdldE1vbnRoKCk7XG5cdFx0YWxsTW9udGhzID0geWVhciAqIDEyICsgbW9udGggLSBjb3VudDtcblx0XHR5ZWFyID0gTWF0aC5mbG9vcihhbGxNb250aHMgLyAxMik7XG5cdFx0bW9udGggPSBhbGxNb250aHMgLSB5ZWFyICogMTI7XG5cdFx0bW9udGggKz0gMTtcblx0XHRzdGFtcCA9IG5ldyBEYXRlKFt5ZWFyLCBtb250aCwgMV0uam9pbignLycpKTtcblx0fSBlbHNlIHtcblx0XHR1bml0ID0gSE9VUjtcblx0XHRpZiAodHlwZSA9PT0gJ2RheScpIHtcblx0XHRcdHVuaXQgPSBEQVk7XG5cdFx0fVxuXHRcdGlmICh0eXBlID09PSAnd2VlaycpIHtcblx0XHRcdHVuaXQgPSA3ICogREFZO1xuXHRcdH1cblx0XHRkYXRldGltZSAtPSBjb3VudCAqIHVuaXQ7XG5cdFx0c3RhbXAgPSAkZ2V0VGltZVNwbGl0KGRhdGV0aW1lLCB0eXBlKTtcblx0fVxuXG5cdHJldHVybiBzdGFtcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMYXN0U3RhcnQ7XG4iLCIvKipcbiAqIOiOt+WPluafkOS4quaXtumXtOeahCDmlbTlubR85pW05pyIfOaVtOaXpXzmlbTml7Z85pW05YiGIOaXtumXtOWvueixoVxuICogQG1ldGhvZCBnZXRUaW1lU3BsaXRcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSDljZXkvY3ml7bpl7TnsbvlnovvvIzlj6/pgIkgWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInXVxuICogQHJldHVybnMge0RhdGV9IOaXtumXtOaVtOeCueWvueixoVxuICogQGV4YW1wbGVcbiAqIG5ldyBEYXRlKFxuICogXHRnZXRUaW1lU3BsaXQoXG4gKiBcdFx0JzIwMTgtMDktMjAnLFxuICogXHRcdCdtb250aCdcbiAqIFx0KVxuICogKS50b0dNVFN0cmluZygpO1xuICogLy8gU2F0IFNlcCAwMSAyMDE4IDAwOjAwOjAwIEdNVCswODAwICjkuK3lm73moIflh4bml7bpl7QpXG4gKlxuICogbmV3IERhdGUoXG4gKiBcdGdldFRpbWVTcGxpdChcbiAqIFx0XHQnMjAxOC0wOS0yMCAxOToyMzozNicsXG4gKiBcdFx0J2hvdXInXG4gKiBcdClcbiAqICkudG9HTVRTdHJpbmcoKTtcbiAqIC8vIFRodSBTZXAgMjAgMjAxOCAxOTowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICovXG5cbnZhciBEQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG52YXIgVElNRV9VTklUUyA9IFtcblx0J2hvdXInLFxuXHQnZGF5Jyxcblx0J3dlZWsnLFxuXHQnbW9udGgnLFxuXHQneWVhcidcbl07XG5cbmZ1bmN0aW9uIGdldFRpbWVTcGxpdCh0aW1lLCB0eXBlKSB7XG5cdGlmICghdHlwZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcigncmVxdWlyZWQgcGFyYW0gdHlwZScpO1xuXHR9XG5cblx0dmFyIGRhdGV0aW1lID0gbmV3IERhdGUodGltZSk7XG5cblx0Ly8g5Lul5ZGo5LiA5Li66LW35aeL5pe26Ze0XG5cdHZhciBkYXkgPSBkYXRldGltZS5nZXREYXkoKTtcblx0ZGF5ID0gZGF5ID09PSAwID8gNiA6IGRheSAtIDE7XG5cblx0dmFyIGluZGV4ID0gVElNRV9VTklUUy5pbmRleE9mKHR5cGUpO1xuXHRpZiAoaW5kZXggPT09IDIpIHtcblx0XHRkYXRldGltZSA9IG5ldyBEYXRlKGRhdGV0aW1lIC0gZGF5ICogREFZKTtcblx0fVxuXHR2YXIgeWVhciA9IGRhdGV0aW1lLmdldEZ1bGxZZWFyKCk7XG5cdHZhciBtb250aCA9IGRhdGV0aW1lLmdldE1vbnRoKCkgKyAxO1xuXHR2YXIgZGF0ZSA9IGRhdGV0aW1lLmdldERhdGUoKTtcblx0dmFyIGhvdXIgPSBkYXRldGltZS5nZXRIb3VycygpO1xuXHR2YXIgbWludXRlcyA9IGRhdGV0aW1lLmdldE1pbnV0ZXMoKTtcblxuXHRpZiAoaW5kZXggPj0gMCkge1xuXHRcdG1pbnV0ZXMgPSAnMDAnO1xuXHR9XG5cdGlmIChpbmRleCA+PSAxKSB7XG5cdFx0aG91ciA9ICcwMCc7XG5cdH1cblx0aWYgKGluZGV4ID49IDMpIHtcblx0XHRkYXRlID0gMTtcblx0fVxuXHRpZiAoaW5kZXggPj0gNCkge1xuXHRcdG1vbnRoID0gMTtcblx0fVxuXG5cdHZhciBzdHIgPSBbXG5cdFx0W3llYXIsIG1vbnRoLCBkYXRlXS5qb2luKCcvJyksXG5cdFx0W2hvdXIsIG1pbnV0ZXNdLmpvaW4oJzonKVxuXHRdLmpvaW4oJyAnKTtcblxuXHRyZXR1cm4gbmV3IERhdGUoc3RyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUaW1lU3BsaXQ7XG4iLCIvKipcbiAqICMg5pel5pyf55u45YWz5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLWtpdC1kYXRlXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9kYXRlXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmRhdGUuZm9ybWF0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LWRhdGVcbiAqIHZhciAkZGF0ZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1kYXRlJyk7XG4gKiBjb25zb2xlLmluZm8oJGRhdGUuZm9ybWF0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZm9ybWF0ID0gcmVxdWlyZSgnc3BvcmUta2l0LWRhdGUvZm9ybWF0Jyk7XG4gKi9cblxuZXhwb3J0cy5mb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuZXhwb3J0cy5nZXRMYXN0U3RhcnQgPSByZXF1aXJlKCcuL2dldExhc3RTdGFydCcpO1xuZXhwb3J0cy5nZXRUaW1lU3BsaXQgPSByZXF1aXJlKCcuL2dldFRpbWVTcGxpdCcpO1xuIiwiLyoqXG4gKiDkv67mraPooaXkvY1cbiAqIEBtZXRob2QgZml4VG9cbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gbnVtIOimgeihpeS9jeeahOaVsOWtl1xuICogQHBhcmFtIHtOdW1iZXJ9IFt3PTJdIHcg6KGl5L2N5pWw6YePXG4gKiBAcmV0dXJuIHtTdHJpbmd9IOe7j+i/h+ihpeS9jeeahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIGZpeFRvKDAsIDIpO1x0Ly9yZXR1cm4gJzAwJ1xuICovXG5cbmZ1bmN0aW9uIGZpeFRvIChudW0sIHcpIHtcblx0dmFyIHN0ciA9IG51bS50b1N0cmluZygpO1xuXHR3ID0gTWF0aC5tYXgoKHcgfHwgMikgLSBzdHIubGVuZ3RoICsgMSwgMCk7XG5cdHJldHVybiBuZXcgQXJyYXkodykuam9pbignMCcpICsgc3RyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpeFRvO1xuIiwiLyoqXG4gKiDnroDljZXmqKHmnb/lh73mlbBcbiAqIEBtZXRob2Qgc3Vic3RpdHV0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDopoHmm7/mjaLmqKHmnb/nmoTlrZfnrKbkuLJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog5qih5p2/5a+55bqU55qE5pWw5o2u5a+56LGhXG4gKiBAcGFyYW0ge1JlZ0V4cH0gW3JlZz0vXFxcXD9cXHtcXHsoW157fV0rKVxcfVxcfS9nXSDop6PmnpDmqKHmnb/nmoTmraPliJnooajovr7lvI9cbiAqIEByZXR1cm4ge1N0cmluZ30g5pu/5o2i5LqG5qih5p2/55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogc3Vic3RpdHV0ZSgne3tjaXR5fX3mrKLov47mgqgnLCB7e2NpdHk6J+WMl+S6rCd9fSk7IC8vICfljJfkuqzmrKLov47mgqgnXG4gKi9cblxuZnVuY3Rpb24gc3Vic3RpdHV0ZSAoc3RyLCBvYmosIHJlZykge1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UocmVnIHx8ICgvXFxcXD9cXHtcXHsoW157fV0rKVxcfVxcfS9nKSwgZnVuY3Rpb24gKG1hdGNoLCBuYW1lKSB7XG5cdFx0aWYgKG1hdGNoLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoMSk7XG5cdFx0fVxuXHRcdC8vIOazqOaEj++8mm9ialtuYW1lXSAhPSBudWxsIOetieWQjOS6jiBvYmpbbmFtZV0gIT09IG51bGwgJiYgb2JqW25hbWVdICE9PSB1bmRlZmluZWRcblx0XHRyZXR1cm4gKG9ialtuYW1lXSAhPSBudWxsKSA/IG9ialtuYW1lXSA6ICcnO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdWJzdGl0dXRlO1xuIiwiLyoqXG4gKiAjIERPTSDmk43kvZznm7jlhbPlt6Xlhbflh73mlbBcbiAqIEBtb2R1bGUgc3BvcmUta2l0LWRvbVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZG9tXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmRvbS5pc05vZGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQtZG9tXG4gKiB2YXIgJGRvbSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1kb20nKTtcbiAqIGNvbnNvbGUuaW5mbygkZG9tLmlzTm9kZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGlzTm9kZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1kb20vaXNOb2RlJyk7XG4gKi9cblxuZXhwb3J0cy5pc05vZGUgPSByZXF1aXJlKCcuL2lzTm9kZScpO1xuZXhwb3J0cy5vZmZzZXQgPSByZXF1aXJlKCcuL29mZnNldCcpO1xuIiwiLyoqXG4gKiDliKTmlq3lr7nosaHmmK/lkKbkuLpkb23lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIOimgeWIpOaWreeahOWvueixoVxuICogQHJldHVybiB7Qm9vbGVhbn0g5piv5ZCm5Li6ZG9t5YWD57SgXG4gKi9cbmZ1bmN0aW9uIGlzTm9kZShub2RlKSB7XG5cdHJldHVybiAoXG5cdFx0bm9kZVxuXHRcdCYmIG5vZGUubm9kZU5hbWVcblx0XHQmJiBub2RlLm5vZGVUeXBlXG5cdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOb2RlO1xuIiwidmFyIHN1cHBvcnQgPSByZXF1aXJlKCdkb20tc3VwcG9ydCcpXG52YXIgZ2V0RG9jdW1lbnQgPSByZXF1aXJlKCdnZXQtZG9jdW1lbnQnKVxudmFyIHdpdGhpbkVsZW1lbnQgPSByZXF1aXJlKCd3aXRoaW4tZWxlbWVudCcpXG5cbi8qKlxuICogR2V0IG9mZnNldCBvZiBhIERPTSBFbGVtZW50IG9yIFJhbmdlIHdpdGhpbiB0aGUgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fFJhbmdlfSBlbCAtIHRoZSBET00gZWxlbWVudCBvciBSYW5nZSBpbnN0YW5jZSB0byBtZWFzdXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIGB0b3BgIGFuZCBgbGVmdGAgTnVtYmVyIHZhbHVlc1xuICogQHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb2Zmc2V0KGVsKSB7XG4gIHZhciBkb2MgPSBnZXREb2N1bWVudChlbClcbiAgaWYgKCFkb2MpIHJldHVyblxuXG4gIC8vIE1ha2Ugc3VyZSBpdCdzIG5vdCBhIGRpc2Nvbm5lY3RlZCBET00gbm9kZVxuICBpZiAoIXdpdGhpbkVsZW1lbnQoZWwsIGRvYykpIHJldHVyblxuXG4gIHZhciBib2R5ID0gZG9jLmJvZHlcbiAgaWYgKGJvZHkgPT09IGVsKSB7XG4gICAgcmV0dXJuIGJvZHlPZmZzZXQoZWwpXG4gIH1cblxuICB2YXIgYm94ID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICBpZiAoIHR5cGVvZiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBnQkNSLCBqdXN0IHVzZSAwLDAgcmF0aGVyIHRoYW4gZXJyb3JcbiAgICAvLyBCbGFja0JlcnJ5IDUsIGlPUyAzIChvcmlnaW5hbCBpUGhvbmUpXG4gICAgYm94ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGlmIChlbC5jb2xsYXBzZWQgJiYgYm94LmxlZnQgPT09IDAgJiYgYm94LnRvcCA9PT0gMCkge1xuICAgICAgLy8gY29sbGFwc2VkIFJhbmdlIGluc3RhbmNlcyBzb21ldGltZXMgcmVwb3J0IDAsIDBcbiAgICAgIC8vIHNlZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjg0NzMyOC8zNzY3NzNcbiAgICAgIHZhciBzcGFuID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXG4gICAgICAvLyBFbnN1cmUgc3BhbiBoYXMgZGltZW5zaW9ucyBhbmQgcG9zaXRpb24gYnlcbiAgICAgIC8vIGFkZGluZyBhIHplcm8td2lkdGggc3BhY2UgY2hhcmFjdGVyXG4gICAgICBzcGFuLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShcIlxcdTIwMGJcIikpO1xuICAgICAgZWwuaW5zZXJ0Tm9kZShzcGFuKTtcbiAgICAgIGJveCA9IHNwYW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIFJlbW92ZSB0ZW1wIFNQQU4gYW5kIGdsdWUgYW55IGJyb2tlbiB0ZXh0IG5vZGVzIGJhY2sgdG9nZXRoZXJcbiAgICAgIHZhciBzcGFuUGFyZW50ID0gc3Bhbi5wYXJlbnROb2RlO1xuICAgICAgc3BhblBhcmVudC5yZW1vdmVDaGlsZChzcGFuKTtcbiAgICAgIHNwYW5QYXJlbnQubm9ybWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGRvY0VsID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICB2YXIgY2xpZW50VG9wICA9IGRvY0VsLmNsaWVudFRvcCAgfHwgYm9keS5jbGllbnRUb3AgIHx8IDBcbiAgdmFyIGNsaWVudExlZnQgPSBkb2NFbC5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwXG4gIHZhciBzY3JvbGxUb3AgID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbFRvcFxuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2NFbC5zY3JvbGxMZWZ0XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IGJveC50b3AgICsgc2Nyb2xsVG9wICAtIGNsaWVudFRvcCxcbiAgICBsZWZ0OiBib3gubGVmdCArIHNjcm9sbExlZnQgLSBjbGllbnRMZWZ0XG4gIH1cbn1cblxuZnVuY3Rpb24gYm9keU9mZnNldChib2R5KSB7XG4gIHZhciB0b3AgPSBib2R5Lm9mZnNldFRvcFxuICB2YXIgbGVmdCA9IGJvZHkub2Zmc2V0TGVmdFxuXG4gIGlmIChzdXBwb3J0LmRvZXNOb3RJbmNsdWRlTWFyZ2luSW5Cb2R5T2Zmc2V0KSB7XG4gICAgdG9wICArPSBwYXJzZUZsb2F0KGJvZHkuc3R5bGUubWFyZ2luVG9wIHx8IDApXG4gICAgbGVmdCArPSBwYXJzZUZsb2F0KGJvZHkuc3R5bGUubWFyZ2luTGVmdCB8fCAwKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IHRvcCxcbiAgICBsZWZ0OiBsZWZ0XG4gIH1cbn1cbiIsInZhciBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5JylcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHN1cHBvcnQsXG5cdFx0YWxsLFxuXHRcdGEsXG5cdFx0c2VsZWN0LFxuXHRcdG9wdCxcblx0XHRpbnB1dCxcblx0XHRmcmFnbWVudCxcblx0XHRldmVudE5hbWUsXG5cdFx0aSxcblx0XHRpc1N1cHBvcnRlZCxcblx0XHRjbGlja0ZuLFxuXHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0Ly8gU2V0dXBcblx0ZGl2LnNldEF0dHJpYnV0ZSggXCJjbGFzc05hbWVcIiwgXCJ0XCIgKTtcblx0ZGl2LmlubmVySFRNTCA9IFwiICA8bGluay8+PHRhYmxlPjwvdGFibGU+PGEgaHJlZj0nL2EnPmE8L2E+PGlucHV0IHR5cGU9J2NoZWNrYm94Jy8+XCI7XG5cblx0Ly8gU3VwcG9ydCB0ZXN0cyB3b24ndCBydW4gaW4gc29tZSBsaW1pdGVkIG9yIG5vbi1icm93c2VyIGVudmlyb25tZW50c1xuXHRhbGwgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpO1xuXHRhID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVsgMCBdO1xuXHRpZiAoICFhbGwgfHwgIWEgfHwgIWFsbC5sZW5ndGggKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0Ly8gRmlyc3QgYmF0Y2ggb2YgdGVzdHNcblx0c2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcblx0b3B0ID0gc2VsZWN0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpICk7XG5cdGlucHV0ID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbIDAgXTtcblxuXHRhLnN0eWxlLmNzc1RleHQgPSBcInRvcDoxcHg7ZmxvYXQ6bGVmdDtvcGFjaXR5Oi41XCI7XG5cdHN1cHBvcnQgPSB7XG5cdFx0Ly8gSUUgc3RyaXBzIGxlYWRpbmcgd2hpdGVzcGFjZSB3aGVuIC5pbm5lckhUTUwgaXMgdXNlZFxuXHRcdGxlYWRpbmdXaGl0ZXNwYWNlOiAoIGRpdi5maXJzdENoaWxkLm5vZGVUeXBlID09PSAzICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0Ym9keSBlbGVtZW50cyBhcmVuJ3QgYXV0b21hdGljYWxseSBpbnNlcnRlZFxuXHRcdC8vIElFIHdpbGwgaW5zZXJ0IHRoZW0gaW50byBlbXB0eSB0YWJsZXNcblx0XHR0Ym9keTogIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpLmxlbmd0aCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGxpbmsgZWxlbWVudHMgZ2V0IHNlcmlhbGl6ZWQgY29ycmVjdGx5IGJ5IGlubmVySFRNTFxuXHRcdC8vIFRoaXMgcmVxdWlyZXMgYSB3cmFwcGVyIGVsZW1lbnQgaW4gSUVcblx0XHRodG1sU2VyaWFsaXplOiAhIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpbmtcIikubGVuZ3RoLFxuXG5cdFx0Ly8gR2V0IHRoZSBzdHlsZSBpbmZvcm1hdGlvbiBmcm9tIGdldEF0dHJpYnV0ZVxuXHRcdC8vIChJRSB1c2VzIC5jc3NUZXh0IGluc3RlYWQpXG5cdFx0c3R5bGU6IC90b3AvLnRlc3QoIGEuZ2V0QXR0cmlidXRlKFwic3R5bGVcIikgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IFVSTHMgYXJlbid0IG1hbmlwdWxhdGVkXG5cdFx0Ly8gKElFIG5vcm1hbGl6ZXMgaXQgYnkgZGVmYXVsdClcblx0XHRocmVmTm9ybWFsaXplZDogKCBhLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiL2FcIiApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgZWxlbWVudCBvcGFjaXR5IGV4aXN0c1xuXHRcdC8vIChJRSB1c2VzIGZpbHRlciBpbnN0ZWFkKVxuXHRcdC8vIFVzZSBhIHJlZ2V4IHRvIHdvcmsgYXJvdW5kIGEgV2ViS2l0IGlzc3VlLiBTZWUgIzUxNDVcblx0XHRvcGFjaXR5OiAvXjAuNS8udGVzdCggYS5zdHlsZS5vcGFjaXR5ICksXG5cblx0XHQvLyBWZXJpZnkgc3R5bGUgZmxvYXQgZXhpc3RlbmNlXG5cdFx0Ly8gKElFIHVzZXMgc3R5bGVGbG9hdCBpbnN0ZWFkIG9mIGNzc0Zsb2F0KVxuXHRcdGNzc0Zsb2F0OiAhIWEuc3R5bGUuY3NzRmxvYXQsXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBpZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWQgZm9yIGEgY2hlY2tib3hcblx0XHQvLyB0aGF0IGl0IGRlZmF1bHRzIHRvIFwib25cIi5cblx0XHQvLyAoV2ViS2l0IGRlZmF1bHRzIHRvIFwiXCIgaW5zdGVhZClcblx0XHRjaGVja09uOiAoIGlucHV0LnZhbHVlID09PSBcIm9uXCIgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGEgc2VsZWN0ZWQtYnktZGVmYXVsdCBvcHRpb24gaGFzIGEgd29ya2luZyBzZWxlY3RlZCBwcm9wZXJ0eS5cblx0XHQvLyAoV2ViS2l0IGRlZmF1bHRzIHRvIGZhbHNlIGluc3RlYWQgb2YgdHJ1ZSwgSUUgdG9vLCBpZiBpdCdzIGluIGFuIG9wdGdyb3VwKVxuXHRcdG9wdFNlbGVjdGVkOiBvcHQuc2VsZWN0ZWQsXG5cblx0XHQvLyBUZXN0IHNldEF0dHJpYnV0ZSBvbiBjYW1lbENhc2UgY2xhc3MuIElmIGl0IHdvcmtzLCB3ZSBuZWVkIGF0dHJGaXhlcyB3aGVuIGRvaW5nIGdldC9zZXRBdHRyaWJ1dGUgKGllNi83KVxuXHRcdGdldFNldEF0dHJpYnV0ZTogZGl2LmNsYXNzTmFtZSAhPT0gXCJ0XCIsXG5cblx0XHQvLyBUZXN0cyBmb3IgZW5jdHlwZSBzdXBwb3J0IG9uIGEgZm9ybSAoIzY3NDMpXG5cdFx0ZW5jdHlwZTogISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKS5lbmN0eXBlLFxuXG5cdFx0Ly8gTWFrZXMgc3VyZSBjbG9uaW5nIGFuIGh0bWw1IGVsZW1lbnQgZG9lcyBub3QgY2F1c2UgcHJvYmxlbXNcblx0XHQvLyBXaGVyZSBvdXRlckhUTUwgaXMgdW5kZWZpbmVkLCB0aGlzIHN0aWxsIHdvcmtzXG5cdFx0aHRtbDVDbG9uZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5hdlwiKS5jbG9uZU5vZGUoIHRydWUgKS5vdXRlckhUTUwgIT09IFwiPDpuYXY+PC86bmF2PlwiLFxuXG5cdFx0Ly8galF1ZXJ5LnN1cHBvcnQuYm94TW9kZWwgREVQUkVDQVRFRCBpbiAxLjggc2luY2Ugd2UgZG9uJ3Qgc3VwcG9ydCBRdWlya3MgTW9kZVxuXHRcdGJveE1vZGVsOiAoIGRvY3VtZW50LmNvbXBhdE1vZGUgPT09IFwiQ1NTMUNvbXBhdFwiICksXG5cblx0XHQvLyBXaWxsIGJlIGRlZmluZWQgbGF0ZXJcblx0XHRzdWJtaXRCdWJibGVzOiB0cnVlLFxuXHRcdGNoYW5nZUJ1YmJsZXM6IHRydWUsXG5cdFx0Zm9jdXNpbkJ1YmJsZXM6IGZhbHNlLFxuXHRcdGRlbGV0ZUV4cGFuZG86IHRydWUsXG5cdFx0bm9DbG9uZUV2ZW50OiB0cnVlLFxuXHRcdGlubGluZUJsb2NrTmVlZHNMYXlvdXQ6IGZhbHNlLFxuXHRcdHNocmlua1dyYXBCbG9ja3M6IGZhbHNlLFxuXHRcdHJlbGlhYmxlTWFyZ2luUmlnaHQ6IHRydWUsXG5cdFx0Ym94U2l6aW5nUmVsaWFibGU6IHRydWUsXG5cdFx0cGl4ZWxQb3NpdGlvbjogZmFsc2Vcblx0fTtcblxuXHQvLyBNYWtlIHN1cmUgY2hlY2tlZCBzdGF0dXMgaXMgcHJvcGVybHkgY2xvbmVkXG5cdGlucHV0LmNoZWNrZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm5vQ2xvbmVDaGVja2VkID0gaW5wdXQuY2xvbmVOb2RlKCB0cnVlICkuY2hlY2tlZDtcblxuXHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgb3B0aW9ucyBpbnNpZGUgZGlzYWJsZWQgc2VsZWN0cyBhcmVuJ3QgbWFya2VkIGFzIGRpc2FibGVkXG5cdC8vIChXZWJLaXQgbWFya3MgdGhlbSBhcyBkaXNhYmxlZClcblx0c2VsZWN0LmRpc2FibGVkID0gdHJ1ZTtcblx0c3VwcG9ydC5vcHREaXNhYmxlZCA9ICFvcHQuZGlzYWJsZWQ7XG5cblx0Ly8gVGVzdCB0byBzZWUgaWYgaXQncyBwb3NzaWJsZSB0byBkZWxldGUgYW4gZXhwYW5kbyBmcm9tIGFuIGVsZW1lbnRcblx0Ly8gRmFpbHMgaW4gSW50ZXJuZXQgRXhwbG9yZXJcblx0dHJ5IHtcblx0XHRkZWxldGUgZGl2LnRlc3Q7XG5cdH0gY2F0Y2goIGUgKSB7XG5cdFx0c3VwcG9ydC5kZWxldGVFeHBhbmRvID0gZmFsc2U7XG5cdH1cblxuXHRpZiAoICFkaXYuYWRkRXZlbnRMaXN0ZW5lciAmJiBkaXYuYXR0YWNoRXZlbnQgJiYgZGl2LmZpcmVFdmVudCApIHtcblx0XHRkaXYuYXR0YWNoRXZlbnQoIFwib25jbGlja1wiLCBjbGlja0ZuID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBDbG9uaW5nIGEgbm9kZSBzaG91bGRuJ3QgY29weSBvdmVyIGFueVxuXHRcdFx0Ly8gYm91bmQgZXZlbnQgaGFuZGxlcnMgKElFIGRvZXMgdGhpcylcblx0XHRcdHN1cHBvcnQubm9DbG9uZUV2ZW50ID0gZmFsc2U7XG5cdFx0fSk7XG5cdFx0ZGl2LmNsb25lTm9kZSggdHJ1ZSApLmZpcmVFdmVudChcIm9uY2xpY2tcIik7XG5cdFx0ZGl2LmRldGFjaEV2ZW50KCBcIm9uY2xpY2tcIiwgY2xpY2tGbiApO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYSByYWRpbyBtYWludGFpbnMgaXRzIHZhbHVlXG5cdC8vIGFmdGVyIGJlaW5nIGFwcGVuZGVkIHRvIHRoZSBET01cblx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG5cdGlucHV0LnZhbHVlID0gXCJ0XCI7XG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJ0eXBlXCIsIFwicmFkaW9cIiApO1xuXHRzdXBwb3J0LnJhZGlvVmFsdWUgPSBpbnB1dC52YWx1ZSA9PT0gXCJ0XCI7XG5cblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcImNoZWNrZWRcIiwgXCJjaGVja2VkXCIgKTtcblxuXHQvLyAjMTEyMTcgLSBXZWJLaXQgbG9zZXMgY2hlY2sgd2hlbiB0aGUgbmFtZSBpcyBhZnRlciB0aGUgY2hlY2tlZCBhdHRyaWJ1dGVcblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJ0XCIgKTtcblxuXHRkaXYuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG5cdGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2Lmxhc3RDaGlsZCApO1xuXG5cdC8vIFdlYktpdCBkb2Vzbid0IGNsb25lIGNoZWNrZWQgc3RhdGUgY29ycmVjdGx5IGluIGZyYWdtZW50c1xuXHRzdXBwb3J0LmNoZWNrQ2xvbmUgPSBmcmFnbWVudC5jbG9uZU5vZGUoIHRydWUgKS5jbG9uZU5vZGUoIHRydWUgKS5sYXN0Q2hpbGQuY2hlY2tlZDtcblxuXHQvLyBDaGVjayBpZiBhIGRpc2Nvbm5lY3RlZCBjaGVja2JveCB3aWxsIHJldGFpbiBpdHMgY2hlY2tlZFxuXHQvLyB2YWx1ZSBvZiB0cnVlIGFmdGVyIGFwcGVuZGVkIHRvIHRoZSBET00gKElFNi83KVxuXHRzdXBwb3J0LmFwcGVuZENoZWNrZWQgPSBpbnB1dC5jaGVja2VkO1xuXG5cdGZyYWdtZW50LnJlbW92ZUNoaWxkKCBpbnB1dCApO1xuXHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cblx0Ly8gVGVjaG5pcXVlIGZyb20gSnVyaXkgWmF5dHNldlxuXHQvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9kZXRlY3RpbmctZXZlbnQtc3VwcG9ydC13aXRob3V0LWJyb3dzZXItc25pZmZpbmcvXG5cdC8vIFdlIG9ubHkgY2FyZSBhYm91dCB0aGUgY2FzZSB3aGVyZSBub24tc3RhbmRhcmQgZXZlbnQgc3lzdGVtc1xuXHQvLyBhcmUgdXNlZCwgbmFtZWx5IGluIElFLiBTaG9ydC1jaXJjdWl0aW5nIGhlcmUgaGVscHMgdXMgdG9cblx0Ly8gYXZvaWQgYW4gZXZhbCBjYWxsIChpbiBzZXRBdHRyaWJ1dGUpIHdoaWNoIGNhbiBjYXVzZSBDU1Bcblx0Ly8gdG8gZ28gaGF5d2lyZS4gU2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9TZWN1cml0eS9DU1Bcblx0aWYgKCAhZGl2LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0Zm9yICggaSBpbiB7XG5cdFx0XHRzdWJtaXQ6IHRydWUsXG5cdFx0XHRjaGFuZ2U6IHRydWUsXG5cdFx0XHRmb2N1c2luOiB0cnVlXG5cdFx0fSkge1xuXHRcdFx0ZXZlbnROYW1lID0gXCJvblwiICsgaTtcblx0XHRcdGlzU3VwcG9ydGVkID0gKCBldmVudE5hbWUgaW4gZGl2ICk7XG5cdFx0XHRpZiAoICFpc1N1cHBvcnRlZCApIHtcblx0XHRcdFx0ZGl2LnNldEF0dHJpYnV0ZSggZXZlbnROYW1lLCBcInJldHVybjtcIiApO1xuXHRcdFx0XHRpc1N1cHBvcnRlZCA9ICggdHlwZW9mIGRpdlsgZXZlbnROYW1lIF0gPT09IFwiZnVuY3Rpb25cIiApO1xuXHRcdFx0fVxuXHRcdFx0c3VwcG9ydFsgaSArIFwiQnViYmxlc1wiIF0gPSBpc1N1cHBvcnRlZDtcblx0XHR9XG5cdH1cblxuXHQvLyBSdW4gdGVzdHMgdGhhdCBuZWVkIGEgYm9keSBhdCBkb2MgcmVhZHlcblx0ZG9tcmVhZHkoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRhaW5lciwgZGl2LCB0ZHMsIG1hcmdpbkRpdixcblx0XHRcdGRpdlJlc2V0ID0gXCJwYWRkaW5nOjA7bWFyZ2luOjA7Ym9yZGVyOjA7ZGlzcGxheTpibG9jaztvdmVyZmxvdzpoaWRkZW47Ym94LXNpemluZzpjb250ZW50LWJveDstbW96LWJveC1zaXppbmc6Y29udGVudC1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O1wiLFxuXHRcdFx0Ym9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcblxuXHRcdGlmICggIWJvZHkgKSB7XG5cdFx0XHQvLyBSZXR1cm4gZm9yIGZyYW1lc2V0IGRvY3MgdGhhdCBkb24ndCBoYXZlIGEgYm9keVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSBcInZpc2liaWxpdHk6aGlkZGVuO2JvcmRlcjowO3dpZHRoOjA7aGVpZ2h0OjA7cG9zaXRpb246c3RhdGljO3RvcDowO21hcmdpbi10b3A6MXB4XCI7XG5cdFx0Ym9keS5pbnNlcnRCZWZvcmUoIGNvbnRhaW5lciwgYm9keS5maXJzdENoaWxkICk7XG5cblx0XHQvLyBDb25zdHJ1Y3QgdGhlIHRlc3QgZWxlbWVudFxuXHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgIC8vQ2hlY2sgaWYgdGFibGUgY2VsbHMgc3RpbGwgaGF2ZSBvZmZzZXRXaWR0aC9IZWlnaHQgd2hlbiB0aGV5IGFyZSBzZXRcbiAgICAvL3RvIGRpc3BsYXk6bm9uZSBhbmQgdGhlcmUgYXJlIHN0aWxsIG90aGVyIHZpc2libGUgdGFibGUgY2VsbHMgaW4gYVxuICAgIC8vdGFibGUgcm93OyBpZiBzbywgb2Zmc2V0V2lkdGgvSGVpZ2h0IGFyZSBub3QgcmVsaWFibGUgZm9yIHVzZSB3aGVuXG4gICAgLy9kZXRlcm1pbmluZyBpZiBhbiBlbGVtZW50IGhhcyBiZWVuIGhpZGRlbiBkaXJlY3RseSB1c2luZ1xuICAgIC8vZGlzcGxheTpub25lIChpdCBpcyBzdGlsbCBzYWZlIHRvIHVzZSBvZmZzZXRzIGlmIGEgcGFyZW50IGVsZW1lbnQgaXNcbiAgICAvL2hpZGRlbjsgZG9uIHNhZmV0eSBnb2dnbGVzIGFuZCBzZWUgYnVnICM0NTEyIGZvciBtb3JlIGluZm9ybWF0aW9uKS5cbiAgICAvLyhvbmx5IElFIDggZmFpbHMgdGhpcyB0ZXN0KVxuXHRcdGRpdi5pbm5lckhUTUwgPSBcIjx0YWJsZT48dHI+PHRkPjwvdGQ+PHRkPnQ8L3RkPjwvdHI+PC90YWJsZT5cIjtcblx0XHR0ZHMgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZFwiKTtcblx0XHR0ZHNbIDAgXS5zdHlsZS5jc3NUZXh0ID0gXCJwYWRkaW5nOjA7bWFyZ2luOjA7Ym9yZGVyOjA7ZGlzcGxheTpub25lXCI7XG5cdFx0aXNTdXBwb3J0ZWQgPSAoIHRkc1sgMCBdLm9mZnNldEhlaWdodCA9PT0gMCApO1xuXG5cdFx0dGRzWyAwIF0uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0dGRzWyAxIF0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgZW1wdHkgdGFibGUgY2VsbHMgc3RpbGwgaGF2ZSBvZmZzZXRXaWR0aC9IZWlnaHRcblx0XHQvLyAoSUUgPD0gOCBmYWlsIHRoaXMgdGVzdClcblx0XHRzdXBwb3J0LnJlbGlhYmxlSGlkZGVuT2Zmc2V0cyA9IGlzU3VwcG9ydGVkICYmICggdGRzWyAwIF0ub2Zmc2V0SGVpZ2h0ID09PSAwICk7XG5cblx0XHQvLyBDaGVjayBib3gtc2l6aW5nIGFuZCBtYXJnaW4gYmVoYXZpb3Jcblx0XHRkaXYuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IFwiYm94LXNpemluZzpib3JkZXItYm94Oy1tb3otYm94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6MXB4O2JvcmRlcjoxcHg7ZGlzcGxheTpibG9jazt3aWR0aDo0cHg7bWFyZ2luLXRvcDoxJTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MSU7XCI7XG5cdFx0c3VwcG9ydC5ib3hTaXppbmcgPSAoIGRpdi5vZmZzZXRXaWR0aCA9PT0gNCApO1xuXHRcdHN1cHBvcnQuZG9lc05vdEluY2x1ZGVNYXJnaW5JbkJvZHlPZmZzZXQgPSAoIGJvZHkub2Zmc2V0VG9wICE9PSAxICk7XG5cblx0XHQvLyBOT1RFOiBUbyBhbnkgZnV0dXJlIG1haW50YWluZXIsIHdlJ3ZlIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlXG5cdFx0Ly8gYmVjYXVzZSBqc2RvbSBvbiBub2RlLmpzIHdpbGwgYnJlYWsgd2l0aG91dCBpdC5cblx0XHRpZiAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICkge1xuXHRcdFx0c3VwcG9ydC5waXhlbFBvc2l0aW9uID0gKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZGl2LCBudWxsICkgfHwge30gKS50b3AgIT09IFwiMSVcIjtcblx0XHRcdHN1cHBvcnQuYm94U2l6aW5nUmVsaWFibGUgPSAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBkaXYsIG51bGwgKSB8fCB7IHdpZHRoOiBcIjRweFwiIH0gKS53aWR0aCA9PT0gXCI0cHhcIjtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgZGl2IHdpdGggZXhwbGljaXQgd2lkdGggYW5kIG5vIG1hcmdpbi1yaWdodCBpbmNvcnJlY3RseVxuXHRcdFx0Ly8gZ2V0cyBjb21wdXRlZCBtYXJnaW4tcmlnaHQgYmFzZWQgb24gd2lkdGggb2YgY29udGFpbmVyLiBGb3IgbW9yZVxuXHRcdFx0Ly8gaW5mbyBzZWUgYnVnICMzMzMzXG5cdFx0XHQvLyBGYWlscyBpbiBXZWJLaXQgYmVmb3JlIEZlYiAyMDExIG5pZ2h0bGllc1xuXHRcdFx0Ly8gV2ViS2l0IEJ1ZyAxMzM0MyAtIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyB3cm9uZyB2YWx1ZSBmb3IgbWFyZ2luLXJpZ2h0XG5cdFx0XHRtYXJnaW5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0bWFyZ2luRGl2LnN0eWxlLmNzc1RleHQgPSBkaXYuc3R5bGUuY3NzVGV4dCA9IGRpdlJlc2V0O1xuXHRcdFx0bWFyZ2luRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gbWFyZ2luRGl2LnN0eWxlLndpZHRoID0gXCIwXCI7XG5cdFx0XHRkaXYuc3R5bGUud2lkdGggPSBcIjFweFwiO1xuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKCBtYXJnaW5EaXYgKTtcblx0XHRcdHN1cHBvcnQucmVsaWFibGVNYXJnaW5SaWdodCA9XG5cdFx0XHRcdCFwYXJzZUZsb2F0KCAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBtYXJnaW5EaXYsIG51bGwgKSB8fCB7fSApLm1hcmdpblJpZ2h0ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgZGl2LnN0eWxlLnpvb20gIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHQvLyBDaGVjayBpZiBuYXRpdmVseSBibG9jay1sZXZlbCBlbGVtZW50cyBhY3QgbGlrZSBpbmxpbmUtYmxvY2tcblx0XHRcdC8vIGVsZW1lbnRzIHdoZW4gc2V0dGluZyB0aGVpciBkaXNwbGF5IHRvICdpbmxpbmUnIGFuZCBnaXZpbmdcblx0XHRcdC8vIHRoZW0gbGF5b3V0XG5cdFx0XHQvLyAoSUUgPCA4IGRvZXMgdGhpcylcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0ZGl2LnN0eWxlLmNzc1RleHQgPSBkaXZSZXNldCArIFwid2lkdGg6MXB4O3BhZGRpbmc6MXB4O2Rpc3BsYXk6aW5saW5lO3pvb206MVwiO1xuXHRcdFx0c3VwcG9ydC5pbmxpbmVCbG9ja05lZWRzTGF5b3V0ID0gKCBkaXYub2Zmc2V0V2lkdGggPT09IDMgKTtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgZWxlbWVudHMgd2l0aCBsYXlvdXQgc2hyaW5rLXdyYXAgdGhlaXIgY2hpbGRyZW5cblx0XHRcdC8vIChJRSA2IGRvZXMgdGhpcylcblx0XHRcdGRpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0ZGl2LnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG5cdFx0XHRkaXYuaW5uZXJIVE1MID0gXCI8ZGl2PjwvZGl2PlwiO1xuXHRcdFx0ZGl2LmZpcnN0Q2hpbGQuc3R5bGUud2lkdGggPSBcIjVweFwiO1xuXHRcdFx0c3VwcG9ydC5zaHJpbmtXcmFwQmxvY2tzID0gKCBkaXYub2Zmc2V0V2lkdGggIT09IDMgKTtcblxuXHRcdFx0Y29udGFpbmVyLnN0eWxlLnpvb20gPSAxO1xuXHRcdH1cblxuXHRcdC8vIE51bGwgZWxlbWVudHMgdG8gYXZvaWQgbGVha3MgaW4gSUVcblx0XHRib2R5LnJlbW92ZUNoaWxkKCBjb250YWluZXIgKTtcblx0XHRjb250YWluZXIgPSBkaXYgPSB0ZHMgPSBtYXJnaW5EaXYgPSBudWxsO1xuXHR9KTtcblxuXHQvLyBOdWxsIGVsZW1lbnRzIHRvIGF2b2lkIGxlYWtzIGluIElFXG5cdGZyYWdtZW50LnJlbW92ZUNoaWxkKCBkaXYgKTtcblx0YWxsID0gYSA9IHNlbGVjdCA9IG9wdCA9IGlucHV0ID0gZnJhZ21lbnQgPSBkaXYgPSBudWxsO1xuXG5cdHJldHVybiBzdXBwb3J0O1xufSkoKTtcbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERvY3VtZW50O1xuXG4vLyBkZWZpbmVkIGJ5IHczY1xudmFyIERPQ1VNRU5UX05PREUgPSA5O1xuXG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIGB3YCBpcyBhIERvY3VtZW50IG9iamVjdCwgb3IgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHs/fSBkIC0gRG9jdW1lbnQgb2JqZWN0LCBtYXliZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNEb2N1bWVudCAoZCkge1xuICByZXR1cm4gZCAmJiBkLm5vZGVUeXBlID09PSBET0NVTUVOVF9OT0RFO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGBkb2N1bWVudGAgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gYG5vZGVgLCB3aGljaCBtYXkgYmVcbiAqIGEgRE9NIGVsZW1lbnQsIHRoZSBXaW5kb3cgb2JqZWN0LCBhIFNlbGVjdGlvbiwgYSBSYW5nZS4gQmFzaWNhbGx5IGFueSBET01cbiAqIG9iamVjdCB0aGF0IHJlZmVyZW5jZXMgdGhlIERvY3VtZW50IGluIHNvbWUgd2F5LCB0aGlzIGZ1bmN0aW9uIHdpbGwgZmluZCBpdC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBub2RlIC0gRE9NIG5vZGUsIHNlbGVjdGlvbiwgb3IgcmFuZ2UgaW4gd2hpY2ggdG8gZmluZCB0aGUgYGRvY3VtZW50YCBvYmplY3RcbiAqIEByZXR1cm4ge0RvY3VtZW50fSB0aGUgYGRvY3VtZW50YCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIGBub2RlYFxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGdldERvY3VtZW50KG5vZGUpIHtcbiAgaWYgKGlzRG9jdW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZTtcblxuICB9IGVsc2UgaWYgKGlzRG9jdW1lbnQobm9kZS5vd25lckRvY3VtZW50KSkge1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgfSBlbHNlIGlmIChpc0RvY3VtZW50KG5vZGUuZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuIG5vZGUuZG9jdW1lbnQ7XG5cbiAgfSBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5wYXJlbnROb2RlKTtcblxuICAvLyBSYW5nZSBzdXBwb3J0XG4gIH0gZWxzZSBpZiAobm9kZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcikge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKTtcblxuICB9IGVsc2UgaWYgKG5vZGUuc3RhcnRDb250YWluZXIpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5zdGFydENvbnRhaW5lcik7XG5cbiAgLy8gU2VsZWN0aW9uIHN1cHBvcnRcbiAgfSBlbHNlIGlmIChub2RlLmFuY2hvck5vZGUpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5hbmNob3JOb2RlKTtcbiAgfVxufVxuIiwiXG4vKipcbiAqIENoZWNrIGlmIHRoZSBET00gZWxlbWVudCBgY2hpbGRgIGlzIHdpdGhpbiB0aGUgZ2l2ZW4gYHBhcmVudGAgRE9NIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fFJhbmdlfSBjaGlsZCAtIHRoZSBET00gZWxlbWVudCBvciBSYW5nZSB0byBjaGVjayBpZiBpdCdzIHdpdGhpbiBgcGFyZW50YFxuICogQHBhcmFtIHtET01FbGVtZW50fSBwYXJlbnQgIC0gdGhlIHBhcmVudCBub2RlIHRoYXQgYGNoaWxkYCBjb3VsZCBiZSBpbnNpZGUgb2ZcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgYGNoaWxkYCBpcyB3aXRoaW4gYHBhcmVudGAuIEZhbHNlIG90aGVyd2lzZS5cbiAqIEBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdpdGhpbiAoY2hpbGQsIHBhcmVudCkge1xuICAvLyBkb24ndCB0aHJvdyBpZiBgY2hpbGRgIGlzIG51bGxcbiAgaWYgKCFjaGlsZCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFJhbmdlIHN1cHBvcnRcbiAgaWYgKGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSBjaGlsZCA9IGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICBlbHNlIGlmIChjaGlsZC5lbmRDb250YWluZXIpIGNoaWxkID0gY2hpbGQuZW5kQ29udGFpbmVyO1xuXG4gIC8vIHRyYXZlcnNlIHVwIHRoZSBgcGFyZW50Tm9kZWAgcHJvcGVydGllcyB1bnRpbCBgcGFyZW50YCBpcyBmb3VuZFxuICB2YXIgbm9kZSA9IGNoaWxkO1xuICB3aGlsZSAobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkge1xuICAgIGlmIChub2RlID09IHBhcmVudCkgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLyoqXG4gKiDojrflj5YgRE9NIOWFg+e0oOebuOWvueS6jiBkb2N1bWVudCDnmoTovrnot51cbiAqIEBtZXRob2Qgb2Zmc2V0XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90aW1veGxleS9vZmZzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIOimgeiuoeeulyBvZmZzZXQg55qEIGRvbSDlr7nosaFcbiAqIEByZXR1cm4ge09iamVjdH0gb2Zmc2V0IOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciBvZmZzZXQgPSByZXF1aXJlKCdkb2N1bWVudC1vZmZzZXQnKVxuICogdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXJnZXQnKVxuICogY29uc29sZS5sb2cob2Zmc2V0KHRhcmdldCkpXG4gKiAvLyB7dG9wOiA2OSwgbGVmdDogMTA4fVxuICovXG5cbnZhciBvZmZzZXQgPSBudWxsO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0b2Zmc2V0ID0gcmVxdWlyZSgnZG9jdW1lbnQtb2Zmc2V0Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0O1xuIiwiLyoqXG4gKiDmo4DmtYvmtY/op4jlmajmoLjlv4NcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gdHJpZGVudFxuICogLSBwcmVzdG9cbiAqIC0gd2Via2l0XG4gKiAtIGdlY2tvXG4gKiBAbWV0aG9kIGNvcmVcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIGNvbnNvbGUuaW5mbyhjb3JlKCkud2Via2l0KTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovYXNzaWduJyk7XG52YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcblxudmFyIHRlc3RlcnMgPSB7XG5cdHRyaWRlbnQ6ICgvdHJpZGVudC9pKSxcblx0cHJlc3RvOiAoL3ByZXN0by9pKSxcblx0d2Via2l0OiAoL3dlYmtpdC9pKSxcblx0Z2Vja286IGZ1bmN0aW9uKHVhKSB7XG5cdFx0cmV0dXJuIHVhLmluZGV4T2YoJ2dlY2tvJykgPiAtMSAmJiB1YS5pbmRleE9mKCdraHRtbCcpID09PSAtMTtcblx0fVxufTtcblxuZnVuY3Rpb24gZGV0ZWN0KG9wdGlvbnMsIGNoZWNrZXJzKSB7XG5cdHZhciBjb25mID0gJGFzc2lnbih7XG5cdFx0dWE6ICcnXG5cdH0sIG9wdGlvbnMpO1xuXG5cdCRhc3NpZ24odGVzdGVycywgY2hlY2tlcnMpO1xuXG5cdHJldHVybiAkdWFNYXRjaCh0ZXN0ZXJzLCBjb25mLnVhLCBjb25mKTtcbn1cblxudmFyIHJlc3VsdCA9IG51bGw7XG5cbmZ1bmN0aW9uIGNvcmUoKSB7XG5cdGlmICghcmVzdWx0KSB7XG5cdFx0cmVzdWx0ID0gZGV0ZWN0KCk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuY29yZS5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZTtcbiIsIi8qKlxuICog5qOA5rWL6K6+5aSH57G75Z6LXG4gKlxuICog5pSv5oyB55qE57G75Z6L5qOA5rWLXG4gKiAtIGh1YXdlaVxuICogLSBvcHBvXG4gKiAtIHZpdm9cbiAqIC0geGlhb21pXG4gKiAtIHNhbXNvbmdcbiAqIC0gaXBob25lXG4gKiBAbWV0aG9kIGRldmljZVxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogY29uc29sZS5pbmZvKGRldmljZSgpLmh1YXdlaSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnc3BvcmUta2l0LW9iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcblx0aHVhd2VpOiAoL2h1YXdlaS9pKSxcblx0b3BwbzogKC9vcHBvL2kpLFxuXHR2aXZvOiAoL3Zpdm8vaSksXG5cdHhpYW9taTogKC94aWFvbWkvaSksXG5cdHNhbXNvbmc6ICgvc20tL2kpLFxuXHRpcGhvbmU6ICgvaXBob25lL2kpXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcblx0dmFyIGNvbmYgPSAkYXNzaWduKHtcblx0XHR1YTogJydcblx0fSwgb3B0aW9ucyk7XG5cblx0JGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cblx0cmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gZGV2aWNlKCkge1xuXHRpZiAoIXJlc3VsdCkge1xuXHRcdHJlc3VsdCA9IGRldGVjdCgpO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmRldmljZS5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gZGV2aWNlO1xuIiwiLyoqXG4gKiAjIOeOr+Wig+ajgOa1i+S4juWIpOaWreW3peWFt1xuICogQG1vZHVsZSBzcG9yZS1raXQtZW52XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9lbnZcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZW52LnRvdWNoYWJsZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC1lbnZcbiAqIHZhciAkZW52ID0gcmVxdWlyZSgnc3BvcmUta2l0LWVudicpO1xuICogY29uc29sZS5pbmZvKCRlbnYudG91Y2hhYmxlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkdG91Y2hhYmxlID0gcmVxdWlyZSgnc3BvcmUta2l0LWVudi90b3VjaGFibGUnKTtcbiAqL1xuXG5leHBvcnRzLmJyb3dzZXIgPSByZXF1aXJlKCcuL2Jyb3dzZXInKTtcbmV4cG9ydHMuY29yZSA9IHJlcXVpcmUoJy4vY29yZScpO1xuZXhwb3J0cy5kZXZpY2UgPSByZXF1aXJlKCcuL2RldmljZScpO1xuZXhwb3J0cy5uZXR3b3JrID0gcmVxdWlyZSgnLi9uZXR3b3JrJyk7XG5leHBvcnRzLm9zID0gcmVxdWlyZSgnLi9vcycpO1xuZXhwb3J0cy50b3VjaGFibGUgPSByZXF1aXJlKCcuL3RvdWNoYWJsZScpO1xuZXhwb3J0cy51YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5leHBvcnRzLndlYnAgPSByZXF1aXJlKCcuL3dlYnAnKTtcbiIsIi8qKlxuICog572R57uc546v5aKD5qOA5rWLXG4gKiBAbW9kdWxlIG5ldHdvcmtcbiAqL1xuXG52YXIgc3VwcG9ydE9ubGluZSA9IG51bGw7XG5cbi8qKlxuICog5Yik5pat6aG16Z2i5piv5ZCm5pSv5oyB6IGU572R5qOA5rWLXG4gKiBAbWV0aG9kIG5ldHdvcmsuc3VwcG9ydFxuICogQG1lbWJlcm9mIG5ldHdvcmtcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIHogZTnvZHmo4DmtYtcbiAqIEBleGFtcGxlXG4gKiBuZXR3b3JrLnN1cHBvcnQoKTsgLy8gdHJ1ZS9mYWxzZVxuICovXG5mdW5jdGlvbiBzdXBwb3J0KCkge1xuXHRpZiAoc3VwcG9ydE9ubGluZSA9PT0gbnVsbCkge1xuXHRcdHN1cHBvcnRPbmxpbmUgPSAhISgnb25MaW5lJyBpbiB3aW5kb3cubmF2aWdhdG9yKTtcblx0fVxuXHRyZXR1cm4gc3VwcG9ydE9ubGluZTtcbn1cblxuLyoqXG4gKiDliKTmlq3pobXpnaLmmK/lkKbogZTnvZFcbiAqIEBtZXRob2QgbmV0d29yay5vbkxpbmVcbiAqIEBtZW1iZXJvZiBuZXR3b3JrXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5piv5ZCm6IGU572RXG4gKiBAZXhhbXBsZVxuICogbmV0d29yay5vbkxpbmUoKTsgLy90cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIG9uTGluZSgpIHtcblx0cmV0dXJuIHN1cHBvcnQoKSA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lIDogdHJ1ZTtcbn1cblxuZXhwb3J0cy5zdXBwb3J0ID0gc3VwcG9ydDtcbmV4cG9ydHMub25MaW5lID0gb25MaW5lO1xuIiwiLyoqXG4gKiDmo4DmtYvmk43kvZzns7vnu5/nsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gaW9zXG4gKiAtIGFuZHJvaWRcbiAqIEBtZXRob2Qgb3NcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIGNvbnNvbGUuaW5mbyhvcygpLmlvcyk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnc3BvcmUta2l0LW9iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcblx0aW9zOiAvbGlrZSBtYWMgb3MgeC9pLFxuXHRhbmRyb2lkOiBmdW5jdGlvbih1YSkge1xuXHRcdHJldHVybiB1YS5pbmRleE9mKCdhbmRyb2lkJykgPiAtMSB8fCB1YS5pbmRleE9mKCdsaW51eCcpID4gLTE7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdHVhOiAnJ1xuXHR9LCBvcHRpb25zKTtcblxuXHQkYXNzaWduKHRlc3RlcnMsIGNoZWNrZXJzKTtcblxuXHRyZXR1cm4gJHVhTWF0Y2godGVzdGVycywgY29uZi51YSwgY29uZik7XG59XG5cbnZhciByZXN1bHQgPSBudWxsO1xuXG5mdW5jdGlvbiBvcygpIHtcblx0aWYgKCFyZXN1bHQpIHtcblx0XHRyZXN1bHQgPSBkZXRlY3QoKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5vcy5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gb3M7XG4iLCIvKipcbiAqIOWIpOaWrea1j+iniOWZqOaYr+WQpuaUr+aMgeinpuaRuOWxj1xuICogQG1ldGhvZCB0b3VjaGFibGVcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIHop6bmkbjlsY9cbiAqIEBleGFtcGxlXG4gKiBpZiAodG91Y2hhYmxlKCkpIHtcbiAqIFx0Ly9JdCBpcyBhIHRvdWNoIGRldmljZS5cbiAqIH1cbiAqL1xuXG52YXIgaXNUb3VjaGFibGUgPSBudWxsO1xuXG5mdW5jdGlvbiB0b3VjaGFibGUoKSB7XG5cdGlmIChpc1RvdWNoYWJsZSA9PT0gbnVsbCkge1xuXHRcdGlzVG91Y2hhYmxlID0gISEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93XG5cdFx0fHwgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpKTtcblx0fVxuXHRyZXR1cm4gaXNUb3VjaGFibGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG91Y2hhYmxlO1xuIiwidmFyIGlzU3VwcG9ydFdlYnAgPSBudWxsO1xuXG4vKipcbiAqIHdlYnAg55u45YWz5qOA5rWLXG4gKiBAbW9kdWxlIHdlYnBcbiAqL1xuXG4vKipcbiAqIOWIpOaWrea1j+iniOWZqOaYr+WQpuaUr+aMgXdlYnBcbiAqIEBtZXRob2Qgd2VicC5zdXBwb3J0XG4gKiBAbWVtYmVyb2Ygd2VicFxuICogQHJldHVybnMge0Jvb2xlYW59IOaYr+WQpuaUr+aMgXdlYnBcbiAqIEBleGFtcGxlXG4gKiBjb25zb2xlLmluZm8od2VicC5zdXBwb3J0KCkpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN1cHBvcnQoKSB7XG5cdGlmIChpc1N1cHBvcnRXZWJwID09PSBudWxsKSB7XG5cdFx0aXNTdXBwb3J0V2VicCA9ICEhW10ubWFwXG5cdFx0XHQmJiBkb2N1bWVudFxuXHRcdFx0XHQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcblx0XHRcdFx0LnRvRGF0YVVSTCgnaW1hZ2Uvd2VicCcpXG5cdFx0XHRcdC5pbmRleE9mKCdkYXRhOmltYWdlL3dlYnAnKSA9PT0gMDtcblx0fVxuXHRyZXR1cm4gaXNTdXBwb3J0V2VicDtcbn1cblxudmFyIHdlYnAgPSB7fTtcbndlYnAuc3VwcG9ydCA9IHN1cHBvcnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gd2VicDtcbiIsIi8qKlxuICogQSBtb2R1bGUgdGhhdCBjYW4gYmUgbWl4ZWQgaW4gdG8gKmFueSBvYmplY3QqIGluIG9yZGVyIHRvIHByb3ZpZGUgaXRcbiAqIHdpdGggY3VzdG9tIGV2ZW50cy4gWW91IG1heSBiaW5kIHdpdGggYG9uYCBvciByZW1vdmUgd2l0aCBgb2ZmYCBjYWxsYmFja1xuICogZnVuY3Rpb25zIHRvIGFuIGV2ZW50OyBgdHJpZ2dlcmAtaW5nIGFuIGV2ZW50IGZpcmVzIGFsbCBjYWxsYmFja3MgaW5cbiAqIHN1Y2Nlc3Npb24uXG4gKiAtIOS4gOS4quWPr+S7peiiq+a3t+WQiOWIsOS7u+S9leWvueixoeeahOaooeWdl++8jOeUqOS6juaPkOS+m+iHquWumuS5ieS6i+S7tuOAglxuICogLSDlj6/ku6XnlKggb24sIG9mZiDmlrnms5XmnaXnu5Hlrprnp7vpmaTkuovku7bjgIJcbiAqIC0g55SoIHRyaWdnZXIg5p2l6Kem5Y+R5LqL5Lu26YCa55+l44CCXG4gKiBAY2xhc3MgRXZlbnRzXG4gKiBAc2VlIGh0dHA6Ly9hcmFsZWpzLm9yZy9cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RvY3VtZW50Y2xvdWQvYmFja2JvbmUvYmxvYi9tYXN0ZXIvYmFja2JvbmUuanNcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2Jsb2IvbWFzdGVyL2xpYi9ldmVudHMuanNcbiAqIEBleGFtcGxlXG4gKiB2YXIgRXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0LWV2dC9ldmVudHMnKTtcbiAqXG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogdmFyIEV2ZW50cyA9ICRraXQuZXZ0LkV2ZW50cztcbiAqL1xuXG4vLyBSZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBzcGxpdCBldmVudCBzdHJpbmdzXG52YXIgZXZlbnRTcGxpdHRlciA9IC9cXHMrLztcblxuLy8gSGVscGVyc1xuLy8gLS0tLS0tLVxuXG52YXIga2V5cyA9IE9iamVjdC5rZXlzO1xuXG5pZiAoIWtleXMpIHtcblx0a2V5cyA9IGZ1bmN0aW9uKG8pIHtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHRmb3IgKHZhciBuYW1lIGluIG8pIHtcblx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKG5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xufVxuXG52YXIgRXZlbnRzID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBCaW5kIG9uZSBvciBtb3JlIHNwYWNlIHNlcGFyYXRlZCBldmVudHMsIGBldmVudHNgLCB0byBhIGBjYWxsYmFja2BcbiAqIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmQgdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gKiAtIOe7keWumuS4gOS4quS6i+S7tuWbnuiwg+WHveaVsO+8jOaIluiAheeUqOWkmuS4quepuuagvOWIhumalOadpee7keWumuWkmuS4quS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDkvKDlhaXlj4LmlbAgYCdhbGwnYCDkvJrlnKjmiYDmnInkuovku7blj5HnlJ/ml7booqvop6blj5HjgIJcbiAqIEBtZXRob2QgRXZlbnRzI29uXG4gKiBAbWVtYmVyb2YgRXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzIOS6i+S7tuWQjeensFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sg5LqL5Lu25Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIOWbnuiwg+WHveaVsOeahOaJp+ihjOeOr+Wig+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciBldnQgPSBuZXcgRXZlbnRzKCk7XG4gKlxuICogLy8g57uR5a6aMeS4quS6i+S7tlxuICogZXZ0Lm9uKCdldmVudC1uYW1lJywgZnVuY3Rpb24gKCkge30pO1xuICpcbiAqIC8vIOe7keWumjLkuKrkuovku7ZcbiAqIGV2dC5vbignZXZlbnQxIGV2ZW50MicsIGZ1bmN0aW9uICgpIHt9KTtcbiAqXG4gKiAvLyDnu5HlrprkuLrmiYDmnInkuovku7ZcbiAqIGV2dC5vbignYWxsJywgZnVuY3Rpb24gKCkge30pO1xuICovXG5cbkV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cdHZhciBjYWNoZTtcblx0dmFyIGV2ZW50O1xuXHR2YXIgbGlzdDtcblx0aWYgKCFjYWxsYmFjaykge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Y2FjaGUgPSB0aGlzLl9fZXZlbnRzIHx8ICh0aGlzLl9fZXZlbnRzID0ge30pO1xuXHRldmVudHMgPSBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcik7XG5cblx0ZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcblx0d2hpbGUgKGV2ZW50KSB7XG5cdFx0bGlzdCA9IGNhY2hlW2V2ZW50XSB8fCAoY2FjaGVbZXZlbnRdID0gW10pO1xuXHRcdGxpc3QucHVzaChjYWxsYmFjaywgY29udGV4dCk7XG5cdFx0ZXZlbnQgPSBldmVudHMuc2hpZnQoKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgb25lIG9yIG1hbnkgY2FsbGJhY2tzLiBJZiBgY29udGV4dGAgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgY2FsbGJhY2tzXG4gKiB3aXRoIHRoYXQgZnVuY3Rpb24uIElmIGBjYWxsYmFja2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgY2FsbGJhY2tzIGZvciB0aGVcbiAqIGV2ZW50LiBJZiBgZXZlbnRzYCBpcyBudWxsLCByZW1vdmVzIGFsbCBib3VuZCBjYWxsYmFja3MgZm9yIGFsbCBldmVudHMuXG4gKiAtIOenu+mZpOS4gOS4quaIluiAheWkmuS4quS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDlpoLmnpzkuI3kvKDpgJIgY2FsbGJhY2sg5Y+C5pWw77yM5Lya56e76Zmk5omA5pyJ6K+l5pe26Ze05ZCN56ew55qE5LqL5Lu25Zue6LCD5Ye95pWw44CCXG4gKiAtIOWmguaenOS4jeaMh+WumuS6i+S7tuWQjeensO+8jOenu+mZpOaJgOacieiHquWumuS5ieS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogQG1ldGhvZCBFdmVudHMjb2ZmXG4gKiBAbWVtYmVyb2YgRXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gW2V2ZW50c10g5LqL5Lu25ZCN56ewXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIOimgeenu+mZpOeahOS6i+S7tuWbnuiwg+WHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSDopoHnp7vpmaTnmoTlm57osIPlh73mlbDnmoTmiafooYznjq/looPlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgZXZ0ID0gbmV3IEV2ZW50cygpO1xuICogdmFyIGJvdW5kID0ge307XG4gKiBib3VuZC50ZXN0ID0gZnVuY3Rpb24gKCkge307XG4gKlxuICogLy8g56e76Zmk5LqL5Lu25ZCN5Li6IGV2ZW50LW5hbWUg55qE5LqL5Lu25Zue6LCD5Ye95pWwIGJvdW5kLnRlc3RcbiAqIGV2dC5vZmYoJ2V2ZW50LW5hbWUnLCBib3VuZC50ZXN0KTtcbiAqXG4gKiAvLyDnp7vpmaTkuovku7blkI3kuLogJ2V2ZW50JyDnmoTmiYDmnInkuovku7blm57osIPlh73mlbBcbiAqIGV2dC5vZmYoJ2V2ZW50Jyk7XG4gKlxuICogLy8g56e76Zmk5omA5pyJ6Ieq5a6a5LmJ5LqL5Lu2XG4gKiBldnQub2ZmKCk7XG4gKi9cblxuRXZlbnRzLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cdHZhciBjYWNoZTtcblx0dmFyIGV2ZW50O1xuXHR2YXIgbGlzdDtcblx0dmFyIGk7XG5cblx0Ly8gTm8gZXZlbnRzLCBvciByZW1vdmluZyAqYWxsKiBldmVudHMuXG5cdGNhY2hlID0gdGhpcy5fX2V2ZW50cztcblx0aWYgKCFjYWNoZSkge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGlmICghKGV2ZW50cyB8fCBjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuXHRcdGRlbGV0ZSB0aGlzLl9fZXZlbnRzO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0ZXZlbnRzID0gZXZlbnRzID8gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpIDoga2V5cyhjYWNoZSk7XG5cblx0Ly8gTG9vcCB0aHJvdWdoIHRoZSBjYWxsYmFjayBsaXN0LCBzcGxpY2luZyB3aGVyZSBhcHByb3ByaWF0ZS5cblx0Zm9yIChldmVudCA9IGV2ZW50cy5zaGlmdCgpOyBldmVudDsgZXZlbnQgPSBldmVudHMuc2hpZnQoKSkge1xuXHRcdGxpc3QgPSBjYWNoZVtldmVudF07XG5cdFx0aWYgKCFsaXN0KSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoIShjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuXHRcdFx0ZGVsZXRlIGNhY2hlW2V2ZW50XTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMjsgaSA+PSAwOyBpIC09IDIpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0IShcblx0XHRcdFx0XHQoY2FsbGJhY2sgJiYgbGlzdFtpXSAhPT0gY2FsbGJhY2spXG5cdFx0XHRcdFx0fHwgKGNvbnRleHQgJiYgbGlzdFtpICsgMV0gIT09IGNvbnRleHQpXG5cdFx0XHRcdClcblx0XHRcdCkge1xuXHRcdFx0XHRsaXN0LnNwbGljZShpLCAyKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVHJpZ2dlciBvbmUgb3IgbWFueSBldmVudHMsIGZpcmluZyBhbGwgYm91bmQgY2FsbGJhY2tzLiBDYWxsYmFja3MgYXJlXG4gKiBwYXNzZWQgdGhlIHNhbWUgYXJndW1lbnRzIGFzIGB0cmlnZ2VyYCBpcywgYXBhcnQgZnJvbSB0aGUgZXZlbnQgbmFtZVxuICogKHVubGVzcyB5b3UncmUgbGlzdGVuaW5nIG9uIGBcImFsbFwiYCwgd2hpY2ggd2lsbCBjYXVzZSB5b3VyIGNhbGxiYWNrIHRvXG4gKiByZWNlaXZlIHRoZSB0cnVlIG5hbWUgb2YgdGhlIGV2ZW50IGFzIHRoZSBmaXJzdCBhcmd1bWVudCkuXG4gKiAtIOa0vuWPkeS4gOS4quaIluiAheWkmuS4quS6i+S7tu+8jOS8muinpuWPkeWvueW6lOS6i+S7tuWQjeensOe7keWumueahOaJgOacieS6i+S7tuWHveaVsOOAglxuICogLSDnrKzkuIDkuKrlj4LmlbDmmK/kuovku7blkI3np7DvvIzliankuIvlhbbku5blj4LmlbDlsIbkvZzkuLrkuovku7blm57osIPnmoTlj4LmlbDjgIJcbiAqIEBtZXRob2QgRXZlbnRzI3RyaWdnZXJcbiAqIEBtZW1iZXJvZiBFdmVudHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudHMg5LqL5Lu25ZCN56ewXG4gKiBAcGFyYW0gey4uLip9IFthcmddIOS6i+S7tuWPguaVsFxuICogQGV4YW1wbGVcbiAqIHZhciBldnQgPSBuZXcgRXZlbnRzKCk7XG4gKlxuICogLy8g6Kem5Y+R5LqL5Lu25ZCN5Li6ICdldmVudC1uYW1lJyDnmoTkuovku7ZcbiAqIGV2dC50cmlnZ2VyKCdldmVudC1uYW1lJyk7XG4gKlxuICogLy8g5ZCM5pe26Kem5Y+RMuS4quS6i+S7tlxuICogZXZ0LnRyaWdnZXIoJ2V2ZW50MSBldmVudDInKTtcbiAqXG4gKiAvLyDop6blj5Hkuovku7blkIzml7bkvKDpgJLlj4LmlbBcbiAqIGV2dC5vbignZXZlbnQteCcsIGZ1bmN0aW9uIChhLCBiKSB7XG4gKiBcdGNvbnNvbGUuaW5mbyhhLCBiKTsgLy8gMSwgMlxuICogfSk7XG4gKiBldnQudHJpZ2dlcignZXZlbnQteCcsIDEsIDIpO1xuICovXG5FdmVudHMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihldmVudHMpIHtcblx0dmFyIGNhY2hlO1xuXHR2YXIgZXZlbnQ7XG5cdHZhciBhbGw7XG5cdHZhciBsaXN0O1xuXHR2YXIgaTtcblx0dmFyIGxlbjtcblx0dmFyIHJlc3QgPSBbXTtcblx0dmFyIGFyZ3M7XG5cblx0Y2FjaGUgPSB0aGlzLl9fZXZlbnRzO1xuXHRpZiAoIWNhY2hlKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRldmVudHMgPSBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcik7XG5cblx0Ly8gRmlsbCB1cCBgcmVzdGAgd2l0aCB0aGUgY2FsbGJhY2sgYXJndW1lbnRzLiAgU2luY2Ugd2UncmUgb25seSBjb3B5aW5nXG5cdC8vIHRoZSB0YWlsIG9mIGBhcmd1bWVudHNgLCBhIGxvb3AgaXMgbXVjaCBmYXN0ZXIgdGhhbiBBcnJheSNzbGljZS5cblx0Zm9yIChpID0gMSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0cmVzdFtpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cdH1cblxuXHQvLyBGb3IgZWFjaCBldmVudCwgd2FsayB0aHJvdWdoIHRoZSBsaXN0IG9mIGNhbGxiYWNrcyB0d2ljZSwgZmlyc3QgdG9cblx0Ly8gdHJpZ2dlciB0aGUgZXZlbnQsIHRoZW4gdG8gdHJpZ2dlciBhbnkgYFwiYWxsXCJgIGNhbGxiYWNrcy5cblx0Zm9yIChldmVudCA9IGV2ZW50cy5zaGlmdCgpOyBldmVudDsgZXZlbnQgPSBldmVudHMuc2hpZnQoKSkge1xuXHRcdC8vIENvcHkgY2FsbGJhY2sgbGlzdHMgdG8gcHJldmVudCBtb2RpZmljYXRpb24uXG5cdFx0YWxsID0gY2FjaGUuYWxsO1xuXHRcdGlmIChhbGwpIHtcblx0XHRcdGFsbCA9IGFsbC5zbGljZSgpO1xuXHRcdH1cblxuXHRcdGxpc3QgPSBjYWNoZVtldmVudF07XG5cdFx0aWYgKGxpc3QpIHtcblx0XHRcdGxpc3QgPSBsaXN0LnNsaWNlKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRXhlY3V0ZSBldmVudCBjYWxsYmFja3MuXG5cdFx0aWYgKGxpc3QpIHtcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcblx0XHRcdFx0bGlzdFtpXS5hcHBseShsaXN0W2kgKyAxXSB8fCB0aGlzLCByZXN0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBFeGVjdXRlIFwiYWxsXCIgY2FsbGJhY2tzLlxuXHRcdGlmIChhbGwpIHtcblx0XHRcdGFyZ3MgPSBbZXZlbnRdLmNvbmNhdChyZXN0KTtcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IGFsbC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuXHRcdFx0XHRhbGxbaV0uYXBwbHkoYWxsW2kgKyAxXSB8fCB0aGlzLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTWl4IGBFdmVudHNgIHRvIG9iamVjdCBpbnN0YW5jZSBvciBDbGFzcyBmdW5jdGlvbi5cbiAqIC0g5bCG6Ieq5a6a5LqL5Lu25a+56LGh77yM5re35ZCI5Yiw5LiA5Liq57G755qE5a6e5L6L44CCXG4gKiBAbWV0aG9kIEV2ZW50cy5taXhUb1xuICogQG1lbWJlcm9mIEV2ZW50c1xuICogQHBhcmFtIHtPYmplY3R9IHJlY2VpdmVyIOimgea3t+WQiOS6i+S7tuWHveaVsOeahOWvueixoVxuICogQGV4YW1wbGVcbiAqIC8vIOe7meS4gOS4quWunuS+i+a3t+WQiOiHquWumuS5ieS6i+S7tuaWueazlVxuICogdmFyIG9iaiA9IHt9O1xuICogRXZlbnRzLm1peFRvKG9iaik7XG4gKlxuICogLy8g55Sf5oiQ5LiA5Liq5a6e5L6LXG4gKiB2YXIgbzEgPSBPYmplY3QuY3JlYXRlKG9iaik7XG4gKlxuICogLy8g5Y+v5Lul5Zyo6L+Z5Liq5a+56LGh5LiK6LCD55So6Ieq5a6a5LmJ5LqL5Lu255qE5pa55rOV5LqGXG4gKiBvMS5vbignZXZlbnQnLCBmdW5jdGlvbiAoKSB7fSk7XG4gKi9cbkV2ZW50cy5taXhUbyA9IGZ1bmN0aW9uKHJlY2VpdmVyKSB7XG5cdHJlY2VpdmVyID0gcmVjZWl2ZXIucHJvdG90eXBlIHx8IHJlY2VpdmVyO1xuXHR2YXIgcHJvdG8gPSBFdmVudHMucHJvdG90eXBlO1xuXG5cdGZvciAodmFyIHAgaW4gcHJvdG8pIHtcblx0XHRpZiAocHJvdG8uaGFzT3duUHJvcGVydHkocCkpIHtcblx0XHRcdHJlY2VpdmVyW3BdID0gcHJvdG9bcF07XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50cztcbiIsIi8qKlxuICogIyDlpITnkIbkuovku7bkuI7lub/mkq1cbiAqIEBtb2R1bGUgc3BvcmUta2l0LWV2dFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZXZ0XG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmV2dC5vY2N1ckluc2lkZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC1ldnRcbiAqIHZhciAkZXZ0ID0gcmVxdWlyZSgnc3BvcmUta2l0LWV2dCcpO1xuICogY29uc29sZS5pbmZvKCRldnQub2NjdXJJbnNpZGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRvY2N1ckluc2lkZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1ldnQvb2NjdXJJbnNpZGUnKTtcbiAqL1xuXG5leHBvcnRzLkV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG5leHBvcnRzLkxpc3RlbmVyID0gcmVxdWlyZSgnLi9saXN0ZW5lcicpO1xuZXhwb3J0cy5vY2N1ckluc2lkZSA9IHJlcXVpcmUoJy4vb2NjdXJJbnNpZGUnKTtcbmV4cG9ydHMudGFwU3RvcCA9IHJlcXVpcmUoJy4vdGFwU3RvcCcpO1xuIiwiLyoqXG4gKiDlub/mkq3nu4Tku7ZcbiAqIC0g5p6E6YCg5a6e5L6L5pe277yM6ZyA6KaB5Lyg5YWl5LqL5Lu255m95ZCN5Y2V5YiX6KGo44CCXG4gKiAtIOWPquacieWcqOeZveWQjeWNleWIl+ihqOS4iueahOS6i+S7tuaJjeWPr+S7peiiq+inpuWPkeOAglxuICogLSDkuovku7bmt7vliqDvvIznp7vpmaTvvIzmv4Dlj5HnmoTosIPnlKjmlrnms5Xlj4LogIMgRXZlbnRz44CCXG4gKiBAc2VlIHNwb3JlLWtpdC1ldnQvZXZlbnRzXG4gKiBAY2xhc3MgTGlzdGVuZXJcbiAqIEBleGFtcGxlXG4gKiBAZXhhbXBsZVxuICogdmFyIExpc3RlbmVyID0gcmVxdWlyZSgnc3BvcmUta2l0LWV2dC9saXN0ZW5lcicpO1xuICpcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiB2YXIgTGlzdGVuZXIgPSAka2l0LmV2dC5MaXN0ZW5lcjtcbiAqXG4gKiAvLyDnmb3lkI3ljZXph4zlj6rorrDlvZXkuoYgZXZlbnQxIOS6i+S7tlxuICogdmFyIGNoYW5uZWxHbG9iYWwgPSBuZXcgTGlzdGVuZXIoW1xuICogXHQnZXZlbnQxJ1xuICogXSk7XG4gKiBjaGFubmVsR2xvYmFsLm9uKCdldmVudDEnLCBmdW5jdGlvbigpe1xuICogXHRjb25zb2xlLmxvZygnZXZlbnQxJyk7XG4gKiB9KTtcbiAqIGNoYW5uZWxHbG9iYWwub24oJ2V2ZW50MicsIGZ1bmN0aW9uKCl7XG4gKiBcdC8vIHdpbGwgbm90IHJ1blxuICogXHRjb25zb2xlLmxvZygnZXZlbnQyJyk7XG4gKiB9KTtcbiAqIGNoYW5uZWxHbG9iYWwudHJpZ2dlcignZXZlbnQxJyk7XG4gKiBjaGFubmVsR2xvYmFsLnRyaWdnZXIoJ2V2ZW50MicpO1xuICovXG5cbnZhciAkZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcblxudmFyIExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRzKSB7XG5cdHRoaXMuX3doaXRlTGlzdCA9IHt9O1xuXHR0aGlzLl9yZWNlaXZlciA9IG5ldyAkZXZlbnRzKCk7XG5cdGlmIChBcnJheS5pc0FycmF5KGV2ZW50cykpIHtcblx0XHRldmVudHMuZm9yRWFjaCh0aGlzLmRlZmluZS5iaW5kKHRoaXMpKTtcblx0fVxufTtcblxuTGlzdGVuZXIucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogTGlzdGVuZXIsXG5cdC8qKlxuXHQgKiDlnKjnmb3lkI3ljZXkuIrlrprkuYnkuIDkuKrkuovku7blkI3np7Bcblx0ICogQG1ldGhvZCBMaXN0ZW5lci5wcm90b3R5cGUuZGVmaW5lXG5cdCAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG5cdCAqL1xuXHRkZWZpbmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuXHRcdHRoaXMuX3doaXRlTGlzdFtldmVudE5hbWVdID0gdHJ1ZTtcblx0fSxcblx0LyoqXG5cdCAqIOenu+mZpOeZveWQjeWNleS4iuWumuS5ieeahOS6i+S7tuWQjeensFxuXHQgKiBAbWV0aG9kIExpc3RlbmVyLnByb3RvdHlwZS51bmRlZmluZVxuXHQgKiBAbWVtYmVyb2YgTGlzdGVuZXJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuXHQgKi9cblx0dW5kZWZpbmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuXHRcdGRlbGV0ZSB0aGlzLl93aGl0ZUxpc3RbZXZlbnROYW1lXTtcblx0fSxcblx0LyoqXG5cdCAqIOW5v+aSree7hOS7tue7keWumuS6i+S7tlxuXHQgKiBAc2VlIDxhIGhyZWY9XCIjZXZlbnRzLXByb3RvdHlwZS1vblwiPmV2ZW50cy5wcm90b3R5cGUub248L2E+XG5cdCAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLm9uXG5cdCAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIOimgee7keWumueahOS6i+S7tuWQjeensFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHnu5HlrprnmoTkuovku7blm57osIPlh73mlbBcblx0ICovXG5cdG9uOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9yZWNlaXZlci5vbi5hcHBseSh0aGlzLl9yZWNlaXZlciwgYXJndW1lbnRzKTtcblx0fSxcblx0LyoqXG5cdCAqIOW5v+aSree7hOS7tuenu+mZpOS6i+S7tlxuXHQgKiBAc2VlIDxhIGhyZWY9XCIjZXZlbnRzLXByb3RvdHlwZS1vZmZcIj5ldmVudHMucHJvdG90eXBlLm9mZjwvYT5cblx0ICogQG1ldGhvZCBMaXN0ZW5lci5wcm90b3R5cGUub2ZmXG5cdCAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIOimgeenu+mZpOe7keWumueahOS6i+S7tuWQjeensFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHnp7vpmaTnu5HlrprnmoTkuovku7blm57osIPlh73mlbBcblx0ICovXG5cdG9mZjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fcmVjZWl2ZXIub2ZmLmFwcGx5KHRoaXMuX3JlY2VpdmVyLCBhcmd1bWVudHMpO1xuXHR9LFxuXHQvKipcblx0ICog5bm/5pKt57uE5Lu25rS+5Y+R5LqL5Lu2XG5cdCAqIEBzZWUgPGEgaHJlZj1cIiNldmVudHMtcHJvdG90eXBlLXRyaWdnZXJcIj5ldmVudHMucHJvdG90eXBlLnRyaWdnZXI8L2E+XG5cdCAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLnRyaWdnZXJcblx0ICogQG1lbWJlcm9mIExpc3RlbmVyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUg6KaB6Kem5Y+R55qE5LqL5Lu25ZCN56ewXG5cdCAqIEBwYXJhbSB7Li4uKn0gW2FyZ10g5LqL5Lu25Y+C5pWwXG5cdCAqL1xuXHR0cmlnZ2VyOiBmdW5jdGlvbihldmVudHMpIHtcblx0XHR2YXIgcmVzdCA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuXHRcdC8vIOaMieeFp0V2ZW50cy50cmlnZ2Vy55qE6LCD55So5pa55byP77yM56ys5LiA5Liq5Y+C5pWw5piv55So56m65qC85YiG6ZqU55qE5LqL5Lu25ZCN56ew5YiX6KGoXG5cdFx0ZXZlbnRzID0gZXZlbnRzLnNwbGl0KC9cXHMrLyk7XG5cblx0XHQvLyDpgY3ljobkuovku7bliJfooajvvIzkvp3mja7nmb3lkI3ljZXlhrPlrprkuovku7bmmK/lkKbmv4Dlj5Fcblx0XHRldmVudHMuZm9yRWFjaChmdW5jdGlvbihldnROYW1lKSB7XG5cdFx0XHRpZiAodGhpcy5fd2hpdGVMaXN0W2V2dE5hbWVdKSB7XG5cdFx0XHRcdHRoaXMuX3JlY2VpdmVyLnRyaWdnZXIuYXBwbHkodGhpcy5fcmVjZWl2ZXIsIFtldnROYW1lXS5jb25jYXQocmVzdCkpO1xuXHRcdFx0fVxuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdGVuZXI7XG4iLCIvKipcbiAqIOWIpOaWreS6i+S7tuaYr+WQpuWPkeeUn+WcqOS4gOS4qiBEb20g5YWD57Sg5YaF44CCXG4gKiAtIOW4uOeUqOS6juWIpOaWreeCueWHu+S6i+S7tuWPkeeUn+WcqOa1ruWxguWkluaXtuWFs+mXrea1ruWxguOAglxuICogQG1ldGhvZCBvY2N1ckluc2lkZVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IOa1j+iniOWZqOS6i+S7tuWvueixoVxuICogQHBhcmFtIHtPYmplY3R9IG5vZGUg55So5LqO5q+U6L6D5LqL5Lu25Y+R55Sf5Yy65Z+f55qEIERvbSDlr7nosaFcbiAqIEByZXR1cm5zIHtCb29sZWFufSDkuovku7bmmK/lkKblj5HnlJ/lnKggbm9kZSDlhoVcbiAqIEBleGFtcGxlXG4gKiAkKCcubGF5ZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldnQpe1xuICogXHRpZihvY2N1ckluc2lkZShldnQsICQodGhpcykuZmluZCgnY2xvc2UnKS5nZXQoMCkpKXtcbiAqIFx0XHQkKHRoaXMpLmhpZGUoKTtcbiAqIFx0fVxuICogfSk7XG4gKi9cblxuZnVuY3Rpb24gb2NjdXJJbnNpZGUoZXZlbnQsIG5vZGUpIHtcblx0aWYgKG5vZGUgJiYgZXZlbnQgJiYgZXZlbnQudGFyZ2V0KSB7XG5cdFx0dmFyIHBvcyA9IGV2ZW50LnRhcmdldDtcblx0XHR3aGlsZSAocG9zKSB7XG5cdFx0XHRpZiAocG9zID09PSBub2RlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cG9zID0gcG9zLnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvY2N1ckluc2lkZTtcbiIsIi8qKlxuICog55So6YGu572p55qE5pa55byP6Zi75q2iIHRhcCDkuovku7bnqb/pgI/lvJXlj5HooajljZXlhYPntKDojrflj5bnhKbngrnjgIJcbiAqIC0g5o6o6I2Q55SoIGZhc3RjbGljayDmnaXop6PlhrPop6blsY/kuovku7bnqb/pgI/pl67popjjgIJcbiAqIC0g5q2k57uE5Lu255So5ZyoIGZhc3RjbGljayDmnKrog73op6PlhrPpl67popjml7bjgILmiJbogIXkuI3mlrnkvr/kvb/nlKggZmFzdGNsaWNrIOaXtuOAglxuICogQG1ldGhvZCB0YXBTdG9wXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDngrnlh7vpgInpoblcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmRlbGF5IOS4tOaXtua1ruWxguWcqOi/meS4quW7tui/n+aXtumXtChtcynkuYvlkI7lhbPpl61cbiAqIEBleGFtcGxlXG4gKiAkKCcubWFzaycpLm9uKCd0YXAnLCBmdW5jdGlvbigpe1xuICogXHR0YXBTdG9wKCk7XG4gKiBcdCQodGhpcykuaGlkZSgpO1xuICogfSk7XG4gKi9cbnZhciBtaW5pTWFzayA9IG51bGw7XG52YXIgcG9zID0ge307XG52YXIgdGltZXIgPSBudWxsO1xudmFyIHRvdWNoU3RhcnRCb3VuZCA9IGZhbHNlO1xuXG52YXIgdGFwU3RvcCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyICQgPSB3aW5kb3cuJCB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcblxuXHR2YXIgY29uZiA9ICQuZXh0ZW5kKHtcblx0XHQvLyDpga7nvanlrZjlnKjml7bpl7Rcblx0XHRkZWxheTogNTAwXG5cdH0sIG9wdGlvbnMpO1xuXG5cdGlmICghbWluaU1hc2spIHtcblx0XHRtaW5pTWFzayA9ICQoJzxkaXY+PC9kaXY+Jyk7XG5cdFx0bWluaU1hc2suY3NzKHtcblx0XHRcdCdkaXNwbGF5JzogJ25vbmUnLFxuXHRcdFx0J3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcblx0XHRcdCdsZWZ0JzogMCxcblx0XHRcdCd0b3AnOiAwLFxuXHRcdFx0J21hcmdpbi1sZWZ0JzogJy0yMHB4Jyxcblx0XHRcdCdtYXJnaW4tdG9wJzogJy0yMHB4Jyxcblx0XHRcdCd6LWluZGV4JzogMTAwMDAsXG5cdFx0XHQnYmFja2dyb3VuZC1jb2xvcic6ICdyZ2JhKDAsMCwwLDApJyxcblx0XHRcdCd3aWR0aCc6ICc0MHB4Jyxcblx0XHRcdCdoZWlnaHQnOiAnNDBweCdcblx0XHR9KS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0fVxuXG5cdGlmICghdG91Y2hTdGFydEJvdW5kKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdGlmICghKGV2dCAmJiBldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGgpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciB0b3VjaCA9IGV2dC50b3VjaGVzWzBdO1xuXHRcdFx0cG9zLnBhZ2VYID0gdG91Y2gucGFnZVg7XG5cdFx0XHRwb3MucGFnZVkgPSB0b3VjaC5wYWdlWTtcblx0XHR9KTtcblx0XHR0b3VjaFN0YXJ0Qm91bmQgPSB0cnVlO1xuXHR9XG5cblx0dmFyIGRlbGF5ID0gcGFyc2VJbnQoY29uZi5kZWxheSwgMTApIHx8IDA7XG5cdG1pbmlNYXNrLnNob3coKS5jc3Moe1xuXHRcdCdsZWZ0JzogcG9zLnBhZ2VYICsgJ3B4Jyxcblx0XHQndG9wJzogcG9zLnBhZ2VZICsgJ3B4J1xuXHR9KTtcblx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0dGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdG1pbmlNYXNrLmhpZGUoKTtcblx0fSwgZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0YXBTdG9wO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIC0g55So5LqO5aSE55CG5a+G6ZuG5LqL5Lu277yM5bu26L+f5pe26Ze05YaF5ZCM5pe26Kem5Y+R55qE5Ye95pWw6LCD55So44CCXG4gKiAtIOacgOe7iOWPquWcqOacgOWQjuS4gOasoeiwg+eUqOW7tui/n+WQju+8jOaJp+ihjOS4gOasoeOAglxuICogQG1ldGhvZCBkZWxheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24g5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoR0aGlz5oyH5ZCRXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IOe7j+i/h+WMheijheeahOW7tui/n+inpuWPkeWHveaVsFxuICogQGV4YW1wbGVcbiAqXHR2YXIgY29tcCA9IHtcbiAqXHRcdGNvdW50V29yZHMgOiBmdW5jdGlvbigpe1xuICpcdFx0XHRjb25zb2xlLmluZm8odGhpcy5sZW5ndGgpO1xuICpcdFx0fVxuICpcdH07XG4gKlxuICogIC8vIOeWr+eLgueCueWHuyBpbnB1dCDvvIzlgZzkuIvmnaUgNTAwIG1zIOWQju+8jOinpuWPkeWHveaVsOiwg+eUqFxuICpcdCQoJyNpbnB1dCcpLmtleWRvd24oZGVsYXkoZnVuY3Rpb24oKXtcbiAqXHRcdHRoaXMubGVuZ3RoID0gJCgnI2lucHV0JykudmFsKCkubGVuZ3RoO1xuICpcdFx0dGhpcy5jb3VudFdvcmRzKCk7XG4gKlx0fSwgNTAwLCBjb21wKSk7XG4gKi9cblxuZnVuY3Rpb24gZGVsYXkgKGZuLCBkdXJhdGlvbiwgYmluZCkge1xuXHR2YXIgdGltZXIgPSBudWxsO1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGJpbmQgPSBiaW5kIHx8IHRoaXM7XG5cdFx0aWYgKHRpbWVyKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdH1cblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHR0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRmbi5hcHBseShiaW5kLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9LCBkdXJhdGlvbik7XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsYXk7XG4iLCIvKipcbiAqICMg5Ye95pWw5YyF6KOF77yM6I635Y+W54m55q6K5omn6KGM5pa55byPXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC1mblxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZm5cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZm4uZGVsYXkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQtZm5cbiAqIHZhciAkZm4gPSByZXF1aXJlKCdzcG9yZS1raXQtZm4nKTtcbiAqIGNvbnNvbGUuaW5mbygkZm4uZGVsYXkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRkZWxheSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1mbi9kZWxheScpO1xuICovXG5cbmV4cG9ydHMuZGVsYXkgPSByZXF1aXJlKCcuL2RlbGF5Jyk7XG5leHBvcnRzLmxvY2sgPSByZXF1aXJlKCcuL2xvY2snKTtcbmV4cG9ydHMub25jZSA9IHJlcXVpcmUoJy4vb25jZScpO1xuZXhwb3J0cy5xdWV1ZSA9IHJlcXVpcmUoJy4vcXVldWUnKTtcbmV4cG9ydHMucHJlcGFyZSA9IHJlcXVpcmUoJy4vcHJlcGFyZScpO1xuZXhwb3J0cy5yZWd1bGFyID0gcmVxdWlyZSgnLi9yZWd1bGFyJyk7XG4iLCIvKipcbiAqIOWMheijheS4uuinpuWPkeS4gOasoeWQju+8jOmihOe9ruaXtumXtOWGheS4jeiDveWGjeasoeinpuWPkeeahOWHveaVsFxuICogLSDnsbvkvLzkuo7mioDog73lhrfljbTjgIJcbiAqIEBtZXRob2QgbG9ja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE5Ya35Y206Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICpcdHZhciByZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICpcdFx0Y29uc29sZS5pbmZvKCdkbyByZXF1ZXN0Jyk7XG4gKlx0fTtcbiAqXHQkKCcjaW5wdXQnKS5rZXlkb3duKGxvY2socmVxdWVzdCwgNTAwKSk7XG4gKlx0Ly8g56ys5LiA5qyh5oyJ6ZSu77yM5bCx5Lya6Kem5Y+R5LiA5qyh5Ye95pWw6LCD55SoXG4gKlx0Ly8g5LmL5ZCO6L+e57ut5oyJ6ZSu77yM5LuF5ZyoIDUwMG1zIOe7k+adn+WQjuWGjeasoeaMiemUru+8jOaJjeS8muWGjeasoeinpuWPkSByZXF1ZXN0IOWHveaVsOiwg+eUqFxuICovXG5cbmZ1bmN0aW9uIGxvY2sgKGZuLCBkZWxheSwgYmluZCkge1xuXHR2YXIgdGltZXIgPSBudWxsO1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRpbWVyKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGJpbmQgPSBiaW5kIHx8IHRoaXM7XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0dGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdHRpbWVyID0gbnVsbDtcblx0XHR9LCBkZWxheSk7XG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Zm4uYXBwbHkoYmluZCwgYXJncyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvY2s7XG4iLCIvKipcbiAqIOWMheijheS4uuS7heinpuWPkeS4gOasoeeahOWHveaVsFxuICogLSDooqvljIXoo4XnmoTlh73mlbDmmbrog73miafooYzkuIDmrKHvvIzkuYvlkI7kuI3kvJrlho3miafooYxcbiAqIEBtZXRob2Qgb25jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDor6Xlh73mlbDku4Xog73op6blj5HmiafooYzkuIDmrKFcbiAqIEBleGFtcGxlXG4gKlx0dmFyIGZuID0gb25jZShmdW5jdGlvbiAoKSB7XG4gKlx0XHRjb25zb2xlLmluZm8oJ291dHB1dCcpO1xuICpcdH0pO1xuICpcdGZuKCk7IC8vICdvdXRwdXQnXG4gKlx0Zm4oKTsgLy8gd2lsbCBkbyBub3RoaW5nXG4gKi9cblxuZnVuY3Rpb24gb25jZSAoZm4sIGJpbmQpIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRiaW5kID0gYmluZCB8fCB0aGlzO1xuXHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGZuLmFwcGx5KGJpbmQsIGFyZ3VtZW50cyk7XG5cdFx0XHRmbiA9IG51bGw7XG5cdFx0XHRiaW5kID0gbnVsbDtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIi8qKlxuICog5YyF6KOF5Li65LiA5Liq5p2h5Lu26Kem5Y+R566h55CG5ZmoXG4gKiAtIOiwg+eUqOeuoeeQhuWZqOeahCByZWFkeSDlh73mlbDmnaXmv4DmtLvmnaHku7bjgIJcbiAqIC0g5LmL5YmN5o+S5YWl566h55CG5Zmo55qE5Ye95pWw5oyJ6Zif5YiX6aG65bqP5omn6KGM44CCXG4gKiAtIOS5i+WQjuaPkuWFpeeuoeeQhuWZqOeahOWHveaVsOeri+WNs+aJp+ihjOOAglxuICogLSDkvZznlKjmnLrliLbnsbvkvLwgalF1ZXJ5LnJlYWR5LCDlj6/ku6Xorr7nva7ku7vkvZXmnaHku7bjgIJcbiAqIEBtb2R1bGUgcHJlcGFyZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDmnaHku7bop6blj5HnrqHnkIblmajlh73mlbDvvIzkvKDlhaXkuIDkuKogZnVuY3Rpb24g5L2c5Li65Lu75Yqh5omn6KGM5Ye95pWw5Y+C5pWwXG4gKiBAZXhhbXBsZVxuICpcdC8vIOeUn+aIkOS4gOS4queuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHlcbiAqXHR2YXIgdGltZVJlYWR5ID0gcHJlcGFyZSgpO1xuICpcbiAqXHQvLyDorr7nva7mnaHku7bkuLoy56eS5ZCO5bCx57uqXG4gKlx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKlx0XHR0aW1lUmVhZHkucmVhZHkoKTtcbiAqXHR9LCAyMDAwKTtcbiAqXG4gKlx0Ly8g6LCD55So566h55CG5Zmo5Ye95pWwIHRpbWVSZWFkee+8jOaPkuWFpeimgeaJp+ihjOeahOS7u+WKoeWHveaVsFxuICpcdHRpbWVSZWFkeShmdW5jdGlvbiAoKSB7XG4gKlx0XHQvLyAyIOenkuWQjui+k+WHuiAxXG4gKlx0XHRjb25zb2xlLmluZm8oMSk7XG4gKlx0fSk7XG4gKlxuICpcdC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqXHR0aW1lUmVhZHkoZnVuY3Rpb24gKCkge1xuICpcdFx0Ly8gMiDnp5LlkI7ovpPlh7ogMlxuICpcdFx0Y29uc29sZS5pbmZvKDIpO1xuICpcdH0pO1xuICpcbiAqXHQvLyAyMTAwbXMg5ZCO5omn6KGMXG4gKlx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKlx0XHQvLyDosIPnlKjnrqHnkIblmajlh73mlbAgdGltZVJlYWR577yM5o+S5YWl6KaB5omn6KGM55qE5Lu75Yqh5Ye95pWwXG4gKlx0XHR0aW1lUmVhZHkoZnVuY3Rpb24gKCkge1xuICpcdFx0XHQvLyDnq4vljbPmiafooYzvvIzovpPlh7ogM1xuICpcdFx0XHRjb25zb2xlLmluZm8oMyk7XG4gKlx0XHR9KTtcbiAqXHR9LCAyMTAwKTtcbiAqL1xuXG4vKipcbiAqIOa/gOa0u+S7u+WKoeeuoeeQhuWZqOeahOinpuWPkeadoeS7tu+8jOWcqOatpOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOS7u+WKoeaMiemYn+WIl+mhuuW6j+aJp+ihjO+8jOS5i+WQjuaPkuWFpeeahOS7u+WKoeWHveaVsOeri+WNs+aJp+ihjOOAglxuICogQG1ldGhvZCBwcmVwYXJlI3JlYWR5XG4gKiBAbWVtYmVyb2YgcHJlcGFyZVxuICovXG5mdW5jdGlvbiBwcmVwYXJlICgpIHtcblx0dmFyIHF1ZXVlID0gW107XG5cdHZhciBjb25kaXRpb24gPSBmYWxzZTtcblx0dmFyIG1vZGVsO1xuXG5cdHZhciBhdHRhbXB0ID0gZnVuY3Rpb24oZm4pIHtcblx0XHRpZiAoY29uZGl0aW9uKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGZuKG1vZGVsKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVldWUucHVzaChmbik7XG5cdFx0fVxuXHR9O1xuXG5cdGF0dGFtcHQucmVhZHkgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0Y29uZGl0aW9uID0gdHJ1ZTtcblx0XHRtb2RlbCA9IGRhdGE7XG5cdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCkge1xuXHRcdFx0dmFyIGZuID0gcXVldWUuc2hpZnQoKTtcblx0XHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Zm4obW9kZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gYXR0YW1wdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcmVwYXJlO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrkuIDkuKrpmJ/liJfvvIzmjInorr7nva7nmoTml7bpl7Tpl7TpmpTop6blj5Hku7vliqHlh73mlbBcbiAqIC0g5o+S5YWl6Zif5YiX55qE5omA5pyJ5Ye95pWw6YO95Lya5omn6KGM77yM5L2G5q+P5qyh5omn6KGM5LmL6Ze06YO95Lya5pyJ5LiA5Liq5Zu65a6a55qE5pe26Ze06Ze06ZqU44CCXG4gKiBAbWV0aG9kIHF1ZXVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTpmJ/liJfop6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKlx0dmFyIHQxID0gRGF0ZS5ub3coKTtcbiAqXHR2YXIgZG9Tb210aGluZyA9IHF1ZXVlKGZ1bmN0aW9uIChpbmRleCkge1xuICpcdFx0Y29uc29sZS5pbmZvKGluZGV4ICsgJzonICsgKERhdGUubm93KCkgLSB0MSkpO1xuICpcdH0sIDIwMCk7XG4gKlx0Ly8g5q+P6ZqUMjAwbXPovpPlh7rkuIDkuKrml6Xlv5fjgIJcbiAqXHRmb3IodmFyIGkgPSAwOyBpIDwgMTA7IGkrKyl7XG4gKlx0XHRkb1NvbXRoaW5nKGkpO1xuICpcdH1cbiAqL1xuXG5mdW5jdGlvbiBxdWV1ZSAoZm4sIGRlbGF5LCBiaW5kKSB7XG5cdHZhciB0aW1lciA9IG51bGw7XG5cdHZhciBhcnIgPSBbXTtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGJpbmQgPSBiaW5kIHx8IHRoaXM7XG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0YXJyLnB1c2goZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRmbi5hcHBseShiaW5kLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpZiAoIXRpbWVyKSB7XG5cdFx0XHR0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCFhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdFx0dGltZXIgPSBudWxsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFyci5zaGlmdCgpKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGRlbGF5KTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcXVldWU7XG4iLCIvKipcbiAqIOWMheijheS4uuinhOW+i+inpuWPkeeahOWHveaVsO+8jOeUqOS6jumZjeS9juWvhumbhuS6i+S7tueahOWkhOeQhumikeeOh1xuICogLSDlnKjnlq/ni4Lmk43kvZzmnJ/pl7TvvIzmjInnhafop4Tlvovml7bpl7Tpl7TpmpTvvIzmnaXosIPnlKjku7vliqHlh73mlbBcbiAqIEBtZXRob2QgcmVxdWxhclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTlrprml7bop6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKlx0dmFyIGNvbXAgPSB7XG4gKlx0XHRjb3VudFdvcmRzIDogZnVuY3Rpb24oKXtcbiAqXHRcdFx0Y29uc29sZS5pbmZvKHRoaXMubGVuZ3RoKTtcbiAqXHRcdH1cbiAqXHR9O1xuICpcdC8vIOeWr+eLguaMiemUru+8jOavj+malCAyMDBtcyDmiY3mnInkuIDmrKHmjInplK7mnInmlYhcbiAqXHQkKCcjaW5wdXQnKS5rZXlkb3duKHJlZ3VsYXIoZnVuY3Rpb24oKXtcbiAqXHRcdHRoaXMubGVuZ3RoID0gJCgnI2lucHV0JykudmFsKCkubGVuZ3RoO1xuICpcdFx0dGhpcy5jb3VudFdvcmRzKCk7XG4gKlx0fSwgMjAwLCBjb21wKSk7XG4gKi9cblxuZnVuY3Rpb24gcmVxdWxhciAoZm4sIGRlbGF5LCBiaW5kKSB7XG5cdHZhciBlbmFibGUgPSB0cnVlO1xuXHR2YXIgdGltZXIgPSBudWxsO1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGJpbmQgPSBiaW5kIHx8IHRoaXM7XG5cdFx0ZW5hYmxlID0gdHJ1ZTtcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHRpZiAoIXRpbWVyKSB7XG5cdFx0XHR0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghZW5hYmxlKSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdFx0dGltZXIgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVuYWJsZSA9IGZhbHNlO1xuXHRcdFx0fSwgZGVsYXkpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1bGFyO1xuIiwiLyoqXG4gKiDnroDljZXnmoQgRWFzaW5nIEZ1bmN0aW9uc1xuICogLSDlgLzln5/lj5jljJbojIPlm7TvvIzku44gWzAsIDFdIOWIsCBbMCwgMV1cbiAqIC0g5Y2z6L6T5YWl5YC86IyD5Zu05LuOIDAg5YiwIDFcbiAqIC0g6L6T5Ye65Lmf5Li65LuOIDAg5YiwIDFcbiAqIC0g6YCC5ZCI6L+b6KGM55m+5YiG5q+U5Yqo55S76L+Q566XXG4gKlxuICog5Yqo55S75Ye95pWwXG4gKiAtIGxpbmVhclxuICogLSBlYXNlSW5RdWFkXG4gKiAtIGVhc2VPdXRRdWFkXG4gKiAtIGVhc2VJbk91dFF1YWRcbiAqIC0gZWFzZUluQ3ViaWNcbiAqIC0gZWFzZUluUXVhcnRcbiAqIC0gZWFzZU91dFF1YXJ0XG4gKiAtIGVhc2VJbk91dFF1YXJ0XG4gKiAtIGVhc2VJblF1aW50XG4gKiAtIGVhc2VPdXRRdWludFxuICogLSBlYXNlSW5PdXRRdWludFxuICogQG1vZHVsZSBlYXNpbmdcbiAqIEBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTRcbiAqIEBleGFtcGxlXG4gKiBlYXNpbmcubGluZWFyKDAuNSk7IC8vIDAuNVxuICogZWFzaW5nLmVhc2VJblF1YWQoMC41KTsgLy8gMC4yNVxuICogZWFzaW5nLmVhc2VJbkN1YmljKDAuNSk7IC8vIDAuMTI1XG4gKi9cbnZhciBlYXNpbmcgPSB7XG5cdC8vIG5vIGVhc2luZywgbm8gYWNjZWxlcmF0aW9uXG5cdGxpbmVhcjogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0O1xuXHR9LFxuXHQvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG5cdGVhc2VJblF1YWQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gdCAqIHQ7XG5cdH0sXG5cdC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG5cdGVhc2VPdXRRdWFkOiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQgKiAoMiAtIHQpO1xuXHR9LFxuXHQvLyBhY2NlbGVyYXRpb24gdW50aWwgaGFsZndheSwgdGhlbiBkZWNlbGVyYXRpb25cblx0ZWFzZUluT3V0UXVhZDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0IDwgMC41ID8gMiAqIHQgKiB0IDogLTEgKyAoNCAtIDIgKiB0KSAqIHQ7XG5cdH0sXG5cdC8vIGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHlcblx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gdCAqIHQgKiB0O1xuXHR9LFxuXHQvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuXHRlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gKC0tdCkgKiB0ICogdCArIDE7XG5cdH0sXG5cdC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuXHRlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0IDwgMC41ID8gNCAqIHQgKiB0ICogdCA6ICh0IC0gMSkgKiAoMiAqIHQgLSAyKSAqICgyICogdCAtIDIpICsgMTtcblx0fSxcblx0Ly8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuXHRlYXNlSW5RdWFydDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0ICogdCAqIHQgKiB0O1xuXHR9LFxuXHQvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuXHRlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gMSAtICgtLXQpICogdCAqIHQgKiB0O1xuXHR9LFxuXHQvLyBhY2NlbGVyYXRpb24gdW50aWwgaGFsZndheSwgdGhlbiBkZWNlbGVyYXRpb25cblx0ZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gdCA8IDAuNSA/IDggKiB0ICogdCAqIHQgKiB0IDogMSAtIDggKiAoLS10KSAqIHQgKiB0ICogdDtcblx0fSxcblx0Ly8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuXHRlYXNlSW5RdWludDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0ICogdCAqIHQgKiB0ICogdDtcblx0fSxcblx0Ly8gZGVjZWxlcmF0aW5nIHRvIHplcm8gdmVsb2NpdHlcblx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIDEgKyAoLS10KSAqIHQgKiB0ICogdCAqIHQ7XG5cdH0sXG5cdC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuXHRlYXNlSW5PdXRRdWludDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0IDwgMC41ID8gMTYgKiB0ICogdCAqIHQgKiB0ICogdCA6IDEgKyAxNiAqICgtLXQpICogdCAqIHQgKiB0ICogdDtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlYXNpbmc7XG4iLCIvKipcbiAqIOWwgeijhemXqueDgeWKqOS9nFxuICogQG1ldGhvZCBmbGFzaEFjdGlvblxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMg6YCJ6aG5XG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGltZXM9M10g6Zeq54OB5qyh5pWw77yM6buY6K6kM+asoVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmRlbGF5PTEwMF0g6Zeq54OB6Ze06ZqU5pe26Ze0KG1zKVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMuYWN0aW9uT2RkXSDlpYfmlbDlm57osINcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLmFjdGlvbkV2ZW5dIOWBtuaVsOWbnuiwg1xuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMucmVjb3Zlcl0g54q25oCB5oGi5aSN5Zue6LCDXG4gKiBAZXhhbXBsZVxuICogXHQvLyDmloflrZfpl6rng4HvvIzlpYfmlbDmrKHlkYjnjrDkuLrnuqLoibLvvIzlgbbmlbDmrKHmiJDnuqTnu7Tok53oibLvvIzliqjnlLvnu5PmnZ/lkYjnjrDkuLrpu5HoibJcbiAqXHR2YXIgdGV4dCA9ICQoJyN0YXJnZXQgc3Bhbi50eHQnKTtcbiAqXHQkZmxhc2hBY3Rpb24oe1xuICpcdFx0YWN0aW9uT2RkIDogZnVuY3Rpb24gKCl7XG4gKlx0XHRcdHRleHQuY3NzKCdjb2xvcicsICcjZjAwJyk7XG4gKlx0XHR9LFxuICpcdFx0YWN0aW9uRXZlbiA6IGZ1bmN0aW9uICgpe1xuICpcdFx0XHR0ZXh0LmNzcygnY29sb3InLCAnIzAwZicpO1xuICpcdFx0fSxcbiAqXHRcdHJlY292ZXIgOiBmdW5jdGlvbiAoKXtcbiAqXHRcdFx0dGV4dC5jc3MoJ2NvbG9yJywgJyMwMDAnKTtcbiAqXHRcdH1cbiAqXHR9KTtcbiAqL1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCdzcG9yZS1raXQtb2JqL2Fzc2lnbicpO1xuXG5mdW5jdGlvbiBmbGFzaEFjdGlvbiAob3B0aW9ucykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oXG5cdFx0e1xuXHRcdFx0dGltZXM6IDMsXG5cdFx0XHRkZWxheTogMTAwLFxuXHRcdFx0YWN0aW9uT2RkOiBudWxsLFxuXHRcdFx0YWN0aW9uRXZlbjogbnVsbCxcblx0XHRcdHJlY292ZXI6IG51bGxcblx0XHR9LFxuXHRcdG9wdGlvbnNcblx0KTtcblxuXHR2YXIgcXVldWUgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb25mLnRpbWVzICogMiArIDE7IGkrKykge1xuXHRcdHF1ZXVlLnB1c2goKGkgKyAxKSAqIGNvbmYuZGVsYXkpO1xuXHR9XG5cblx0cXVldWUuZm9yRWFjaChmdW5jdGlvbiAodGltZSwgaW5kZXgpIHtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChpbmRleCA+PSBxdWV1ZS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGlmIChjb25mLnJlY292ZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjb25mLnJlY292ZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChpbmRleCAlIDIgPT09IDApIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBjb25mLmFjdGlvbkV2ZW4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjb25mLmFjdGlvbkV2ZW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgY29uZi5hY3Rpb25PZGQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y29uZi5hY3Rpb25PZGQoKTtcblx0XHRcdH1cblx0XHR9LCB0aW1lKTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhc2hBY3Rpb247XG4iLCIvKipcbiAqIOWKqOeUu+exuyAtIOeUqOS6juWkhOeQhuS4jemAguWQiOS9v+eUqCB0cmFuc2l0aW9uIOeahOWKqOeUu+WcuuaZr1xuICpcbiAqIOWPr+e7keWumueahOS6i+S7tlxuICogLSBzdGFydCDliqjnlLvlvIDlp4vml7bop6blj5FcbiAqIC0gY29tcGxldGUg5Yqo55S75bey5a6M5oiQXG4gKiAtIHN0b3Ag5Yqo55S75bCa5pyq5a6M5oiQ5bCx6KKr5Lit5patXG4gKiAtIGNhbmNlbCDliqjnlLvooqvlj5bmtohcbiAqIEBjbGFzcyBGeFxuICogQHNlZSBodHRwczovL21vb3Rvb2xzLm5ldC9jb3JlL2RvY3MvMS42LjAvRngvRnhcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDliqjnlLvpgInpoblcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcHM9NjBdIOW4p+mAn+eOhyhmL3Mp77yM5a6e6ZmF5LiK5Yqo55S76L+Q6KGM55qE5pyA6auY5bin6YCf546H5LiN5Lya6auY5LqOIHJlcXVlc3RBbmltYXRpb25GcmFtZSDmj5DkvpvnmoTluKfpgJ/njodcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj01MDBdIOWKqOeUu+aMgee7reaXtumXtChtcylcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBbb3B0aW9ucy50cmFuc2l0aW9uXSDliqjnlLvmiafooYzmlrnlvI/vvIzlj4Lop4Egc3BvcmUta2l0LWZ4L3RyYW5zaXRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVzXSDku47lk6rkuIDluKflvIDlp4vmiafooYxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZnJhbWVTa2lwPXRydWVdIOaYr+WQpui3s+W4p1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmxpbms9J2lnbm9yZSddIOWKqOeUu+ihlOaOpeaWueW8j++8jOWPr+mAie+8mlsnaWdub3JlJywgJ2NhbmNlbCddXG4gKiBAZXhhbXBsZVxuICpcdHZhciBmeCA9IG5ldyBGeCh7XG4gKlx0XHRkdXJhdGlvbiA6IDEwMDBcbiAqXHR9KTtcbiAqXHRmeC5zZXQgPSBmdW5jdGlvbiAobm93KSB7XG4gKlx0XHRub2RlLnN0eWxlLm1hcmdpbkxlZnQgPSBub3cgKyAncHgnO1xuICpcdH07XG4gKlx0Zngub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAqXHRcdGNvbnNvbGUuaW5mbygnYW5pbWF0aW9uIGVuZCcpO1xuICpcdH0pO1xuICpcdGZ4LnN0YXJ0KDAsIDYwMCk7ICAvLyAx56eS5YaF5pWw5a2X5LuOMOWinuWKoOWIsDYwMFxuICovXG5cbnZhciAka2xhc3MgPSByZXF1aXJlKCdrbGFzcycpO1xudmFyICRldmVudHMgPSByZXF1aXJlKCdzcG9yZS1raXQtZXZ0L2V2ZW50cycpO1xudmFyICRlcmFzZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1hcnIvZXJhc2UnKTtcbnZhciAkY29udGFpbnMgPSByZXF1aXJlKCdzcG9yZS1raXQtYXJyL2NvbnRhaW5zJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovYXNzaWduJyk7XG52YXIgJHRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpO1xuXG4vLyBnbG9iYWwgdGltZXJzXG4vLyDkvb/nlKjlhazlhbHlrprml7blmajlj6/ku6Xlh4/lsJHmtY/op4jlmajotYTmupDmtojogJdcbnZhciBpbnN0YW5jZXMgPSB7fTtcbnZhciB0aW1lcnMgPSB7fTtcblxudmFyIGxvb3AgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXHRmb3IgKHZhciBpID0gdGhpcy5sZW5ndGg7IGktLTspIHtcblx0XHR2YXIgaW5zdGFuY2UgPSB0aGlzW2ldO1xuXHRcdGlmIChpbnN0YW5jZSkge1xuXHRcdFx0aW5zdGFuY2Uuc3RlcChub3cpO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHB1c2hJbnN0YW5jZSA9IGZ1bmN0aW9uIChmcHMpIHtcblx0dmFyIGxpc3QgPSBpbnN0YW5jZXNbZnBzXSB8fCAoaW5zdGFuY2VzW2Zwc10gPSBbXSk7XG5cdGxpc3QucHVzaCh0aGlzKTtcblx0aWYgKCF0aW1lcnNbZnBzXSkge1xuXHRcdHRpbWVyc1tmcHNdID0gJHRpbWVyLnNldEludGVydmFsKFxuXHRcdFx0bG9vcC5iaW5kKGxpc3QpLFxuXHRcdFx0TWF0aC5yb3VuZCgxMDAwIC8gZnBzKVxuXHRcdCk7XG5cdH1cbn07XG5cbnZhciBwdWxsSW5zdGFuY2UgPSBmdW5jdGlvbiAoZnBzKSB7XG5cdHZhciBsaXN0ID0gaW5zdGFuY2VzW2Zwc107XG5cdGlmIChsaXN0KSB7XG5cdFx0JGVyYXNlKGxpc3QsIHRoaXMpO1xuXHRcdGlmICghbGlzdC5sZW5ndGggJiYgdGltZXJzW2Zwc10pIHtcblx0XHRcdGRlbGV0ZSBpbnN0YW5jZXNbZnBzXTtcblx0XHRcdHRpbWVyc1tmcHNdID0gJHRpbWVyLmNsZWFySW50ZXJ2YWwodGltZXJzW2Zwc10pO1xuXHRcdH1cblx0fVxufTtcblxudmFyIEZ4ID0gJGtsYXNzKHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHR0aGlzLm9wdGlvbnMgPSAkYXNzaWduKFxuXHRcdFx0e1xuXHRcdFx0XHRmcHM6IDYwLFxuXHRcdFx0XHRkdXJhdGlvbjogNTAwLFxuXHRcdFx0XHR0cmFuc2l0aW9uOiBudWxsLFxuXHRcdFx0XHRmcmFtZXM6IG51bGwsXG5cdFx0XHRcdGZyYW1lU2tpcDogdHJ1ZSxcblx0XHRcdFx0bGluazogJ2lnbm9yZSdcblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zXG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICog6K6+572u5a6e5L6L55qE6YCJ6aG5XG5cdCAqIEBtZXRob2QgRngjc2V0T3B0aW9uc1xuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5Yqo55S76YCJ6aG5XG5cdCAqL1xuXHRzZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdHRoaXMuY29uZiA9ICRhc3NpZ24oe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOiuvue9ruWKqOeUu+eahOaJp+ihjOaWueW8j++8jOmFjee9rue8k+WKqOaViOaenFxuXHQgKiBAaW50ZXJmYWNlIEZ4I2dldFRyYW5zaXRpb25cblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBleGFtcGxlXG5cdCAqXHR2YXIgZnggPSBuZXcgRngoKTtcblx0ICpcdGZ4LmdldFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG5cdCAqXHRcdHJldHVybiBmdW5jdGlvbiAocCkge1xuXHQgKlx0XHRcdHJldHVybiAtKE1hdGguY29zKE1hdGguUEkgKiBwKSAtIDEpIC8gMjtcblx0ICpcdFx0fTtcblx0ICpcdH07XG5cdCAqL1xuXHRnZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChwKSB7XG5cdFx0XHRyZXR1cm4gLShNYXRoLmNvcyhNYXRoLlBJICogcCkgLSAxKSAvIDI7XG5cdFx0fTtcblx0fSxcblxuXHRzdGVwOiBmdW5jdGlvbiAobm93KSB7XG5cdFx0aWYgKHRoaXMub3B0aW9ucy5mcmFtZVNraXApIHtcblx0XHRcdHZhciBkaWZmID0gdGhpcy50aW1lICE9IG51bGwgPyBub3cgLSB0aGlzLnRpbWUgOiAwO1xuXHRcdFx0dmFyIGZyYW1lcyA9IGRpZmYgLyB0aGlzLmZyYW1lSW50ZXJ2YWw7XG5cdFx0XHR0aGlzLnRpbWUgPSBub3c7XG5cdFx0XHR0aGlzLmZyYW1lICs9IGZyYW1lcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5mcmFtZSsrO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZyYW1lIDwgdGhpcy5mcmFtZXMpIHtcblx0XHRcdHZhciBkZWx0YSA9IHRoaXMudHJhbnNpdGlvbih0aGlzLmZyYW1lIC8gdGhpcy5mcmFtZXMpO1xuXHRcdFx0dGhpcy5zZXQodGhpcy5jb21wdXRlKHRoaXMuZnJvbSwgdGhpcy50bywgZGVsdGEpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5mcmFtZSA9IHRoaXMuZnJhbWVzO1xuXHRcdFx0dGhpcy5zZXQodGhpcy5jb21wdXRlKHRoaXMuZnJvbSwgdGhpcy50bywgMSkpO1xuXHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDorr7nva7lvZPliY3liqjnlLvluKfnmoTov4fmuKHmlbDlgLxcblx0ICogQGludGVyZmFjZSBGeCNzZXRcblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBub3cg5b2T5YmN5Yqo55S75bin55qE6L+H5rih5pWw5YC8XG5cdCAqIEBleGFtcGxlXG5cdCAqXHR2YXIgZnggPSBuZXcgRngoKTtcblx0ICpcdGZ4LnNldCA9IGZ1bmN0aW9uIChub3cpIHtcblx0ICpcdFx0bm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gbm93ICsgJ3B4Jztcblx0ICpcdH07XG5cdCAqL1xuXHRzZXQ6IGZ1bmN0aW9uIChub3cpIHtcblx0XHRyZXR1cm4gbm93O1xuXHR9LFxuXG5cdGNvbXB1dGU6IGZ1bmN0aW9uIChmcm9tLCB0bywgZGVsdGEpIHtcblx0XHRyZXR1cm4gRnguY29tcHV0ZShmcm9tLCB0bywgZGVsdGEpO1xuXHR9LFxuXG5cdGNoZWNrOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCF0aGlzLmlzUnVubmluZygpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHRoaXMub3B0aW9ucy5saW5rID09PSAnY2FuY2VsJykge1xuXHRcdFx0dGhpcy5jYW5jZWwoKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOW8gOWni+aJp+ihjOWKqOeUu1xuXHQgKiBAbWV0aG9kIEZ4I3N0YXJ0XG5cdCAqIEBtZW1iZXJvZiBGeFxuXHQgKiBAcGFyYW0ge051bWJlcn0gZnJvbSDliqjnlLvlvIDlp4vmlbDlgLxcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHRvIOWKqOeUu+e7k+adn+aVsOWAvFxuXHQgKiBAZXhhbXBsZVxuXHQgKlx0dmFyIGZ4ID0gbmV3IEZ4KCk7XG5cdCAqXHRmeC5zdGFydCgpOyAvLyDlvIDlp4vliqjnlLtcblx0ICovXG5cdHN0YXJ0OiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0XHRpZiAoIXRoaXMuY2hlY2soZnJvbSwgdG8pKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0dGhpcy5mcm9tID0gZnJvbTtcblx0XHR0aGlzLnRvID0gdG87XG5cdFx0dGhpcy5mcmFtZSA9IHRoaXMub3B0aW9ucy5mcmFtZVNraXAgPyAwIDogLTE7XG5cdFx0dGhpcy50aW1lID0gbnVsbDtcblx0XHR0aGlzLnRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24oKTtcblx0XHR2YXIgZnJhbWVzID0gdGhpcy5vcHRpb25zLmZyYW1lcztcblx0XHR2YXIgZnBzID0gdGhpcy5vcHRpb25zLmZwcztcblx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLm9wdGlvbnMuZHVyYXRpb247XG5cdFx0dGhpcy5kdXJhdGlvbiA9IEZ4LkR1cmF0aW9uc1tkdXJhdGlvbl0gfHwgcGFyc2VJbnQoZHVyYXRpb24sIDEwKSB8fCAwO1xuXHRcdHRoaXMuZnJhbWVJbnRlcnZhbCA9IDEwMDAgLyBmcHM7XG5cdFx0dGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgTWF0aC5yb3VuZCh0aGlzLmR1cmF0aW9uIC8gdGhpcy5mcmFtZUludGVydmFsKTtcblx0XHR0aGlzLnRyaWdnZXIoJ3N0YXJ0Jyk7XG5cdFx0cHVzaEluc3RhbmNlLmNhbGwodGhpcywgZnBzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICog5YGc5q2i5Yqo55S7XG5cdCAqIEBtZXRob2QgRngjc3RvcFxuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQGV4YW1wbGVcblx0ICpcdHZhciBmeCA9IG5ldyBGeCgpO1xuXHQgKlx0Znguc3RhcnQoKTtcblx0ICpcdGZ4LnN0b3AoKTsgLy8g56uL5Yi75YGc5q2i5Yqo55S7XG5cdCAqL1xuXHRzdG9wOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcblx0XHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0XHRwdWxsSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcblx0XHRcdGlmICh0aGlzLmZyYW1lcyA9PT0gdGhpcy5mcmFtZSkge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NvbXBsZXRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3N0b3AnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOWPlua2iOWKqOeUu1xuXHQgKiBAbWV0aG9kIEZ4I2NhbmNlbFxuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQGV4YW1wbGVcblx0ICpcdHZhciBmeCA9IG5ldyBGeCgpO1xuXHQgKlx0Znguc3RhcnQoKTtcblx0ICpcdGZ4LmNhbmNlbCgpOyAvLyDnq4vliLvlj5bmtojliqjnlLtcblx0ICovXG5cdGNhbmNlbDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmlzUnVubmluZygpKSB7XG5cdFx0XHR0aGlzLnRpbWUgPSBudWxsO1xuXHRcdFx0cHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG5cdFx0XHR0aGlzLmZyYW1lID0gdGhpcy5mcmFtZXM7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NhbmNlbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICog5pqC5YGc5Yqo55S7XG5cdCAqIEBtZXRob2QgRngjcGF1c2Vcblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBleGFtcGxlXG5cdCAqXHR2YXIgZnggPSBuZXcgRngoKTtcblx0ICpcdGZ4LnN0YXJ0KCk7XG5cdCAqXHRmeC5wYXVzZSgpOyAvLyDnq4vliLvmmoLlgZzliqjnlLtcblx0ICovXG5cdHBhdXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcblx0XHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0XHRwdWxsSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOe7p+e7reaJp+ihjOWKqOeUu1xuXHQgKiBAbWV0aG9kIEZ4I3Jlc3VtZVxuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQGV4YW1wbGVcblx0ICpcdHZhciBmeCA9IG5ldyBGeCgpO1xuXHQgKlx0Znguc3RhcnQoKTtcblx0ICpcdGZ4LnBhdXNlKCk7XG5cdCAqXHRmeC5yZXN1bWUoKTsgLy8g56uL5Yi757un57ut5Yqo55S7XG5cdCAqL1xuXHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5mcmFtZSA8IHRoaXMuZnJhbWVzICYmICF0aGlzLmlzUnVubmluZygpKSB7XG5cdFx0XHRwdXNoSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOWIpOaWreWKqOeUu+aYr+WQpuato+WcqOi/kOihjFxuXHQgKiBAbWV0aG9kIEZ4I2lzUnVubmluZ1xuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQHJldHVybnMge0Jvb2xlYW59IOWKqOeUu+aYr+WQpuato+WcqOi/kOihjFxuXHQgKiBAZXhhbXBsZVxuXHQgKlx0dmFyIGZ4ID0gbmV3IEZ4KCk7XG5cdCAqXHRmeC5zdGFydCgpO1xuXHQgKlx0ZngucGF1c2UoKTtcblx0ICpcdGZ4LmlzUnVubmluZygpOyAvLyBmYWxzZVxuXHQgKi9cblx0aXNSdW5uaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGxpc3QgPSBpbnN0YW5jZXNbdGhpcy5vcHRpb25zLmZwc107XG5cdFx0cmV0dXJuIGxpc3QgJiYgJGNvbnRhaW5zKGxpc3QsIHRoaXMpO1xuXHR9XG59KTtcblxuJGV2ZW50cy5taXhUbyhGeCk7XG5cbkZ4LmNvbXB1dGUgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIGRlbHRhKSB7XG5cdHJldHVybiAodG8gLSBmcm9tKSAqIGRlbHRhICsgZnJvbTtcbn07XG5cbkZ4LkR1cmF0aW9ucyA9IHsgc2hvcnQ6IDI1MCwgbm9ybWFsOiA1MDAsIGxvbmc6IDEwMDAgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBGeDtcbiIsIi8qKlxuICogIyDliqjnlLvkuqTkupLnm7jlhbPlt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUta2l0LWZ4XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9meFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5meC5zbW9vdGhTY3JvbGxUbyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC1meFxuICogdmFyICRmeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1meCcpO1xuICogY29uc29sZS5pbmZvKCRmeC5zbW9vdGhTY3JvbGxUbyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnc3BvcmUta2l0LWZ4L3Ntb290aFNjcm9sbFRvJyk7XG4gKi9cblxuZXhwb3J0cy5lYXNpbmcgPSByZXF1aXJlKCcuL2Vhc2luZycpO1xuZXhwb3J0cy5mbGFzaEFjdGlvbiA9IHJlcXVpcmUoJy4vZmxhc2hBY3Rpb24nKTtcbmV4cG9ydHMuRnggPSByZXF1aXJlKCcuL2Z4Jyk7XG5leHBvcnRzLnNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnLi9zbW9vdGhTY3JvbGxUbycpO1xuZXhwb3J0cy5zdGlja3kgPSByZXF1aXJlKCcuL3N0aWNreScpO1xuZXhwb3J0cy50aW1lciA9IHJlcXVpcmUoJy4vdGltZXInKTtcbmV4cG9ydHMudHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuL3RyYW5zaXRpb25zJyk7XG4iLCIvKiFcbiAgKiBrbGFzczogYSBjbGFzc2ljYWwgSlMgT09QIGZhw6dhZGVcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL2tsYXNzXG4gICogTGljZW5zZSBNSVQgKGMpIER1c3RpbiBEaWF6IDIwMTRcbiAgKi9cblxuIWZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ2tsYXNzJywgdGhpcywgZnVuY3Rpb24gKCkge1xuICB2YXIgY29udGV4dCA9IHRoaXNcbiAgICAsIGYgPSAnZnVuY3Rpb24nXG4gICAgLCBmblRlc3QgPSAveHl6Ly50ZXN0KGZ1bmN0aW9uICgpIHt4eXp9KSA/IC9cXGJzdXByXFxiLyA6IC8uKi9cbiAgICAsIHByb3RvID0gJ3Byb3RvdHlwZSdcblxuICBmdW5jdGlvbiBrbGFzcyhvKSB7XG4gICAgcmV0dXJuIGV4dGVuZC5jYWxsKGlzRm4obykgPyBvIDogZnVuY3Rpb24gKCkge30sIG8sIDEpXG4gIH1cblxuICBmdW5jdGlvbiBpc0ZuKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG8gPT09IGZcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaywgZm4sIHN1cHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRtcCA9IHRoaXMuc3VwclxuICAgICAgdGhpcy5zdXByID0gc3Vwcltwcm90b11ba11cbiAgICAgIHZhciB1bmRlZiA9IHt9LmZhYnJpY2F0ZWRVbmRlZmluZWRcbiAgICAgIHZhciByZXQgPSB1bmRlZlxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0ID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5zdXByID0gdG1wXG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJvY2Vzcyh3aGF0LCBvLCBzdXByKSB7XG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICB3aGF0W2tdID0gaXNGbihvW2tdKVxuICAgICAgICAgICYmIGlzRm4oc3Vwcltwcm90b11ba10pXG4gICAgICAgICAgJiYgZm5UZXN0LnRlc3Qob1trXSlcbiAgICAgICAgICA/IHdyYXAoaywgb1trXSwgc3VwcikgOiBvW2tdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZXh0ZW5kKG8sIGZyb21TdWIpIHtcbiAgICAvLyBtdXN0IHJlZGVmaW5lIG5vb3AgZWFjaCB0aW1lIHNvIGl0IGRvZXNuJ3QgaW5oZXJpdCBmcm9tIHByZXZpb3VzIGFyYml0cmFyeSBjbGFzc2VzXG4gICAgZnVuY3Rpb24gbm9vcCgpIHt9XG4gICAgbm9vcFtwcm90b10gPSB0aGlzW3Byb3RvXVxuICAgIHZhciBzdXByID0gdGhpc1xuICAgICAgLCBwcm90b3R5cGUgPSBuZXcgbm9vcCgpXG4gICAgICAsIGlzRnVuY3Rpb24gPSBpc0ZuKG8pXG4gICAgICAsIF9jb25zdHJ1Y3RvciA9IGlzRnVuY3Rpb24gPyBvIDogdGhpc1xuICAgICAgLCBfbWV0aG9kcyA9IGlzRnVuY3Rpb24gPyB7fSA6IG9cbiAgICBmdW5jdGlvbiBmbigpIHtcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemUpIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICBlbHNlIHtcbiAgICAgICAgZnJvbVN1YiB8fCBpc0Z1bmN0aW9uICYmIHN1cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICBfY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZuLm1ldGhvZHMgPSBmdW5jdGlvbiAobykge1xuICAgICAgcHJvY2Vzcyhwcm90b3R5cGUsIG8sIHN1cHIpXG4gICAgICBmbltwcm90b10gPSBwcm90b3R5cGVcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZm4ubWV0aG9kcy5jYWxsKGZuLCBfbWV0aG9kcykucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gZm5cblxuICAgIGZuLmV4dGVuZCA9IGFyZ3VtZW50cy5jYWxsZWVcbiAgICBmbltwcm90b10uaW1wbGVtZW50ID0gZm4uc3RhdGljcyA9IGZ1bmN0aW9uIChvLCBvcHRGbikge1xuICAgICAgbyA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHt9XG4gICAgICAgIG9ialtvXSA9IG9wdEZuXG4gICAgICAgIHJldHVybiBvYmpcbiAgICAgIH0oKSkgOiBvXG4gICAgICBwcm9jZXNzKHRoaXMsIG8sIHN1cHIpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHJldHVybiBmblxuICB9XG5cbiAgcmV0dXJuIGtsYXNzXG59KTtcbiIsIi8qKlxuICog5bmz5ruR5rua5Yqo5Yiw5p+Q5Liq5YWD57Sg77yM5Y+q6L+b6KGM5Z6C55u05pa55ZCR55qE5rua5YqoXG4gKiAtIHJlcXVpcmVzIGpRdWVyeS9aZXB0b1xuICogQG1ldGhvZCBzbW9vdGhTY3JvbGxUb1xuICogQHBhcmFtIHtPYmplY3R9IG5vZGUg55uu5qCHRE9N5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gc3BlYyDpgInpoblcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5kZWx0YT0wXSDnm67moIfmu5rliqjkvY3nva7kuI7nm67moIflhYPntKDpobbpg6jnmoTpl7Tot53vvIzlj6/ku6XkuLrotJ/lgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5tYXhEZWxheT0zMDAwXSDliqjnlLvmiafooYzml7bpl7TpmZDliLYobXMp77yM5Yqo55S75omn6KGM6LaF6L+H5q2k5pe26Ze05YiZ55u05o6l5YGc5q2i77yM56uL5Yi75rua5Yqo5Yiw55uu5qCH5L2N572uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5jYWxsYmFja10g5rua5Yqo5a6M5oiQ55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogLy8g5rua5Yqo5Yiw6aG16Z2i6aG256uvXG4gKiBzbW9vdGhTY3JvbGxUbyhkb2N1bWVudC5ib2R5KTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovYXNzaWduJyk7XG5cbmZ1bmN0aW9uIHNtb290aFNjcm9sbFRvIChub2RlLCBzcGVjKSB7XG5cdHZhciAkID0gd2luZG93LiQgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnk7XG5cblx0dmFyIGNvbmYgPSAkYXNzaWduKFxuXHRcdHtcblx0XHRcdGRlbHRhOiAwLFxuXHRcdFx0bWF4RGVsYXk6IDMwMDAsXG5cdFx0XHRjYWxsYmFjazogbnVsbFxuXHRcdH0sXG5cdFx0c3BlY1xuXHQpO1xuXG5cdHZhciBvZmZzZXQgPSAkKG5vZGUpLm9mZnNldCgpO1xuXHR2YXIgdGFyZ2V0ID0gb2Zmc2V0LnRvcCArIGNvbmYuZGVsdGE7XG5cdHZhciBjYWxsYmFjayA9IGNvbmYuY2FsbGJhY2s7XG5cblx0dmFyIHByZXZTdGVwO1xuXHR2YXIgc3RheUNvdW50ID0gMztcblxuXHR2YXIgdGltZXIgPSBudWxsO1xuXG5cdHZhciBzdG9wVGltZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRpbWVyKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcblx0XHRcdHRpbWVyID0gbnVsbDtcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCB0YXJnZXQpO1xuXHRcdFx0aWYgKCQuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdFx0dmFyIGRlbHRhID0gc1RvcCAtIHRhcmdldDtcblx0XHRpZiAoZGVsdGEgPiAwKSB7XG5cdFx0XHRkZWx0YSA9IE1hdGguZmxvb3IoZGVsdGEgKiAwLjgpO1xuXHRcdH0gZWxzZSBpZiAoZGVsdGEgPCAwKSB7XG5cdFx0XHRkZWx0YSA9IE1hdGguY2VpbChkZWx0YSAqIDAuOCk7XG5cdFx0fVxuXG5cdFx0dmFyIHN0ZXAgPSB0YXJnZXQgKyBkZWx0YTtcblx0XHRpZiAoc3RlcCA9PT0gcHJldlN0ZXApIHtcblx0XHRcdHN0YXlDb3VudC0tO1xuXHRcdH1cblx0XHRwcmV2U3RlcCA9IHN0ZXA7XG5cblx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgc3RlcCk7XG5cblx0XHRpZiAoc3RlcCA9PT0gdGFyZ2V0IHx8IHN0YXlDb3VudCA8PSAwKSB7XG5cdFx0XHRzdG9wVGltZXIoKTtcblx0XHR9XG5cdH0sIDE2KTtcblxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRzdG9wVGltZXIoKTtcblx0fSwgY29uZi5tYXhEZWxheSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc21vb3RoU2Nyb2xsVG87XG4iLCIvKipcbiAqIElPUyBzdGlja3kg5pWI5p6cIHBvbHlmaWxsXG4gKiAtIHJlcXVpcmVzIGpRdWVyeS9aZXB0b1xuICogQHBhcmFtIHtPYmplY3R9IG5vZGUg55uu5qCHRE9N5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDpgInpoblcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2xvbmU9dHJ1ZV0g5piv5ZCm5Yib5bu65LiA5LiqIGNsb25lIOWFg+e0oFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnBsYWNlaG9sZGVyPW51bGxdIHN0aWNreSDmlYjmnpzlkK/liqjml7bnmoTljaDkvY0gZG9tIOWFg+e0oFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kaXNhYmxlQW5kcm9pZD1mYWxzZV0g5piv5ZCm5ZyoIEFuZHJvaWQg5LiL5YGc55SoIHN0aWNreSDmlYjmnpxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vZmZzZXRQYXJlbnQ9bnVsbF0g5o+Q5L6b5LiA5Liq55u45a+55a6a5L2N5YWD57Sg5p2l5Yy56YWN5rWu5Yqo5pe255qE5a6a5L2N5qC35byPXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc3R5bGVzPXt9XSDov5vlhaUgc3RpY2t5IOeKtuaAgeaXtueahOagt+W8j1xuICogQGV4YW1wbGVcbiAqIHN0aWNreSgkKCdoMScpLmdldCgwKSk7XG4gKi9cblxuZnVuY3Rpb24gc3RpY2t5KG5vZGUsIG9wdGlvbnMpIHtcblx0dmFyICQgPSB3aW5kb3cuJCB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcblxuXHR2YXIgJHdpbiA9ICQod2luZG93KTtcblx0dmFyICRkb2MgPSAkKGRvY3VtZW50KTtcblxuXHR2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXHR2YXIgaXNJT1MgPSAhIXVhLm1hdGNoKC9cXChpW147XSs7KCBVOyk/IENQVS4rTWFjIE9TIFgvaSk7XG5cdHZhciBpc0FuZHJvaWQgPSB1YS5pbmRleE9mKCdBbmRyb2lkJykgPiAtMSB8fCB1YS5pbmRleE9mKCdMaW51eCcpID4gLTE7XG5cblx0dmFyIHRoYXQgPSB7fTtcblx0dGhhdC5pc0lPUyA9IGlzSU9TO1xuXHR0aGF0LmlzQW5kcm9pZCA9IGlzQW5kcm9pZDtcblxuXHR2YXIgY29uZiA9ICQuZXh0ZW5kKFxuXHRcdHtcblx0XHRcdGNsb25lOiB0cnVlLFxuXHRcdFx0cGxhY2Vob2xkZXI6IG51bGwsXG5cdFx0XHRkaXNhYmxlQW5kcm9pZDogZmFsc2UsXG5cdFx0XHRvZmZzZXRQYXJlbnQ6IG51bGwsXG5cdFx0XHRzdHlsZXM6IHt9XG5cdFx0fSxcblx0XHRvcHRpb25zXG5cdCk7XG5cblx0dGhhdC5yb290ID0gJChub2RlKTtcblxuXHRpZiAoIXRoYXQucm9vdC5nZXQoMCkpIHsgcmV0dXJuOyB9XG5cdHRoYXQub2Zmc2V0UGFyZW50ID0gdGhhdC5yb290Lm9mZnNldFBhcmVudCgpO1xuXG5cdGlmIChjb25mLm9mZnNldFBhcmVudCkge1xuXHRcdHRoYXQub2Zmc2V0UGFyZW50ID0gJChjb25mLm9mZnNldFBhcmVudCk7XG5cdH1cblxuXHRpZiAoIXRoYXQub2Zmc2V0UGFyZW50WzBdKSB7XG5cdFx0dGhhdC5vZmZzZXRQYXJlbnQgPSAkKGRvY3VtZW50LmJvZHkpO1xuXHR9XG5cblx0dGhhdC5pc1N0aWNreSA9IGZhbHNlO1xuXG5cdGlmIChjb25mLnBsYWNlaG9sZGVyKSB7XG5cdFx0dGhhdC5wbGFjZWhvbGRlciA9ICQoY29uZi5wbGFjZWhvbGRlcik7XG5cdH0gZWxzZSB7XG5cdFx0dGhhdC5wbGFjZWhvbGRlciA9ICQoJzxkaXYvPicpO1xuXHR9XG5cblx0aWYgKGNvbmYuY2xvbmUpIHtcblx0XHR0aGF0LmNsb25lID0gdGhhdC5yb290LmNsb25lKCk7XG5cdFx0dGhhdC5jbG9uZS5hcHBlbmRUbyh0aGF0LnBsYWNlaG9sZGVyKTtcblx0fVxuXG5cdHRoYXQucGxhY2Vob2xkZXIuY3NzKHtcblx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHR9KTtcblxuXHR0aGF0LnN0aWNreSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghdGhhdC5pc1N0aWNreSkge1xuXHRcdFx0dGhhdC5pc1N0aWNreSA9IHRydWU7XG5cdFx0XHR0aGF0LnJvb3QuY3NzKCdwb3NpdGlvbicsICdmaXhlZCcpO1xuXHRcdFx0dGhhdC5yb290LmNzcyhjb25mLnN0eWxlcyk7XG5cdFx0XHR0aGF0LnBsYWNlaG9sZGVyLmluc2VydEJlZm9yZSh0aGF0LnJvb3QpO1xuXHRcdH1cblx0fTtcblxuXHR0aGF0LnVuU3RpY2t5ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoYXQuaXNTdGlja3kpIHtcblx0XHRcdHRoYXQuaXNTdGlja3kgPSBmYWxzZTtcblx0XHRcdHRoYXQucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG5cdFx0XHR0aGF0LnJvb3QuY3NzKCdwb3NpdGlvbicsICcnKTtcblx0XHRcdCQuZWFjaChjb25mLnN0eWxlcywgZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRcdHRoYXQucm9vdC5jc3Moa2V5LCAnJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0dmFyIG9yaWdPZmZzZXRZID0gdGhhdC5yb290LmdldCgwKS5vZmZzZXRUb3A7XG5cdHRoYXQuY2hlY2tTY3JvbGxZID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCF0aGF0LmlzU3RpY2t5KSB7XG5cdFx0XHRvcmlnT2Zmc2V0WSA9IHRoYXQucm9vdC5nZXQoMCkub2Zmc2V0VG9wO1xuXHRcdH1cblxuXHRcdHZhciBzY3JvbGxZID0gMDtcblx0XHRpZiAodGhhdC5vZmZzZXRQYXJlbnQuZ2V0KDApID09PSBkb2N1bWVudC5ib2R5KSB7XG5cdFx0XHRzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNjcm9sbFkgPSB0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkuc2Nyb2xsVG9wO1xuXHRcdH1cblxuXHRcdGlmIChzY3JvbGxZID4gb3JpZ09mZnNldFkpIHtcblx0XHRcdHRoYXQuc3RpY2t5KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoYXQudW5TdGlja3koKTtcblx0XHR9XG5cblx0XHRpZiAodGhhdC5pc1N0aWNreSkge1xuXHRcdFx0dGhhdC5yb290LmNzcyh7XG5cdFx0XHRcdCd3aWR0aCc6IHRoYXQucGxhY2Vob2xkZXIud2lkdGgoKSArICdweCdcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGF0LnJvb3QuY3NzKHtcblx0XHRcdFx0J3dpZHRoJzogJydcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR0aGF0LmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoaXNBbmRyb2lkICYmIGNvbmYuZGlzYWJsZUFuZHJvaWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKGlzSU9TICYmIHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKSA9PT0gZG9jdW1lbnQuYm9keSkge1xuXHRcdFx0Ly8gSU9TOSsg5pSv5oyBIHBvc2l0aW9uOnN0aWNreSDlsZ7mgKdcblx0XHRcdHRoYXQucm9vdC5jc3MoJ3Bvc2l0aW9uJywgJ3N0aWNreScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyDkuIDoiKzmtY/op4jlmajnm7TmjqXmlK/mjIFcblx0XHRcdGlmICh0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkgPT09IGRvY3VtZW50LmJvZHkpIHtcblx0XHRcdFx0JHdpbi5vbignc2Nyb2xsJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhhdC5vZmZzZXRQYXJlbnQub24oJ3Njcm9sbCcsIHRoYXQuY2hlY2tTY3JvbGxZKTtcblx0XHRcdH1cblxuXHRcdFx0JHdpbi5vbigncmVzaXplJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuXHRcdFx0JGRvYy5vbigndG91Y2hzdGFydCcsIHRoYXQuY2hlY2tTY3JvbGxZKTtcblx0XHRcdCRkb2Mub24oJ3RvdWNobW92ZScsIHRoYXQuY2hlY2tTY3JvbGxZKTtcblx0XHRcdCRkb2Mub24oJ3RvdWNoZW5kJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuXHRcdFx0dGhhdC5jaGVja1Njcm9sbFkoKTtcblx0XHR9XG5cdH07XG5cblx0dGhhdC5pbml0KCk7XG5cdHJldHVybiB0aGF0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0aWNreTtcbiIsIi8qKlxuICog55SoIHJlcXVlc3RBbmltYXRpb25GcmFtZSDljIXoo4Xlrprml7blmahcbiAqIC0g5aaC5p6c5rWP6KeI5Zmo5LiN5pSv5oyBIHJlcXVlc3RBbmltYXRpb25GcmFtZSBBUEnvvIzliJnkvb/nlKggQk9NIOWOn+acrOeahOWumuaXtuWZqEFQSVxuICogLSByZXF1aXJlcyBqUXVlcnkvWmVwdG9cbiAqIEBtb2R1bGUgdGltZXJcbiAqIEBleGFtcGxlXG4gKlx0dGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKlx0XHRjb25zb2xlLmluZm8oJ291dHB1dCB0aGlzIGxvZyBhZnRlciAxMDAwbXMnKTtcbiAqXHR9LCAxMDAwKTtcbiAqL1xuXG52YXIgVGltZXIgPSB7fTtcblxuZnVuY3Rpb24gZmFjdG9yeShtZXRob2ROYW1lKSB7XG5cdHZhciAkd2luID0gbnVsbDtcblx0dmFyICQgPSBudWxsO1xuXHR2YXIgd3JhcHBlZE1ldGhvZCA9IG51bGw7XG5cblx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0JHdpbiA9IHdpbmRvdztcblx0XHQkID0gJHdpbi4kIHx8ICR3aW4uWmVwdG8gfHwgJHdpbi5qUXVlcnk7XG5cdH1cblxuXHRpZiAoJHdpbiAmJiAkKSB7XG5cdFx0Ly8g5Y+W5b6X5a+55bqU55qE5rWP6KeI5Zmo5YmN57yAXG5cdFx0dmFyIHByZWZpeCA9ICcnO1xuXHRcdGlmICgkLmdldFByZWZpeCkge1xuXHRcdFx0cHJlZml4ID0gJC5nZXRQcmVmaXgoKS5yZXBsYWNlKC8tL2dpLCAnJyk7XG5cdFx0fVxuXG5cdFx0Ly8g5aaC5p6c5pyJ5a+55bqU5ZCN56ew55qE5pa55rOV77yM55u05o6l6L+U5Zue6K+l5pa55rOV77yM5ZCm5YiZ6L+U5Zue5bim5pyJ5a+55bqU5rWP6KeI5Zmo5YmN57yA55qE5pa55rOVXG5cdFx0dmFyIGdldFByZWZpeE1ldGhvZCA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHZhciBwcmVmaXhOYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpO1xuXHRcdFx0dmFyIG1ldGhvZCA9ICR3aW5bbmFtZV0gfHwgJHdpbltwcmVmaXggKyBwcmVmaXhOYW1lXTtcblx0XHRcdGlmICgkLnR5cGUobWV0aG9kKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRyZXR1cm4gbWV0aG9kLmJpbmQoJHdpbik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZ2V0UHJlZml4TWV0aG9kKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnKTtcblx0XHR2YXIgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSA9IGdldFByZWZpeE1ldGhvZCgnY2FuY2VsQW5pbWF0aW9uRnJhbWUnKSB8fCAkLm5vb3A7XG5cblx0XHRpZiAobG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcblx0XHRcdHZhciBjbGVhclRpbWVyID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0XHRcdGlmIChvYmoucmVxdWVzdElkICYmICQudHlwZShvYmouc3RlcCkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRvYmouc3RlcCA9ICQubm9vcDtcblx0XHRcdFx0XHRsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lKG9iai5yZXF1ZXN0SWQpO1xuXHRcdFx0XHRcdG9iai5yZXF1ZXN0SWQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgc2V0VGltZXIgPSBmdW5jdGlvbihmbiwgZGVsYXksIHR5cGUpIHtcblx0XHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0XHR2YXIgdGltZSA9IERhdGUubm93KCk7XG5cdFx0XHRcdGRlbGF5ID0gZGVsYXkgfHwgMDtcblx0XHRcdFx0ZGVsYXkgPSBNYXRoLm1heChkZWxheSwgMCk7XG5cdFx0XHRcdG9iai5zdGVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0aWYgKG5vdyAtIHRpbWUgPiBkZWxheSkge1xuXHRcdFx0XHRcdFx0Zm4oKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlID09PSAndGltZW91dCcpIHtcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lcihvYmopO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGltZSA9IG5vdztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b2JqLnJlcXVlc3RJZCA9IGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9iai5zdGVwKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0bG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUob2JqLnN0ZXApO1xuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fTtcblxuXHRcdFx0aWYgKG1ldGhvZE5hbWUgPT09ICdzZXRJbnRlcnZhbCcpIHtcblx0XHRcdFx0d3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uKGZuLCBkZWxheSkge1xuXHRcdFx0XHRcdHJldHVybiBzZXRUaW1lcihmbiwgZGVsYXksICdpbnRlcnZhbCcpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnc2V0VGltZW91dCcpIHtcblx0XHRcdFx0d3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uKGZuLCBkZWxheSkge1xuXHRcdFx0XHRcdHJldHVybiBzZXRUaW1lcihmbiwgZGVsYXksICd0aW1lb3V0Jyk7XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKG1ldGhvZE5hbWUgPT09ICdjbGVhclRpbWVvdXQnKSB7XG5cdFx0XHRcdHdyYXBwZWRNZXRob2QgPSBjbGVhclRpbWVyO1xuXHRcdFx0fSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnY2xlYXJJbnRlcnZhbCcpIHtcblx0XHRcdFx0d3JhcHBlZE1ldGhvZCA9IGNsZWFyVGltZXI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKCF3cmFwcGVkTWV0aG9kICYmIHRoaXNbbWV0aG9kTmFtZV0pIHtcblx0XHR3cmFwcGVkTWV0aG9kID0gdGhpc1ttZXRob2ROYW1lXS5iaW5kKHRoaXMpO1xuXHR9XG5cblx0cmV0dXJuIHdyYXBwZWRNZXRob2Q7XG59XG5cbi8qKlxuICog6K6+572u6YeN5aSN6LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyLnNldEludGVydmFsXG4gKiBAbWVtYmVyb2YgdGltZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOWumuaXtumHjeWkjeiwg+eUqOeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXSDph43lpI3osIPnlKjnmoTpl7TpmpTml7bpl7QobXMpXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlrprml7blmajlr7nosaHvvIzlj6/kvKDlhaUgY2xlYXJJbnRlcnZhbCDmlrnms5XmnaXnu4jmraLov5nkuKrlrprml7blmahcbiAqL1xuVGltZXIuc2V0SW50ZXJ2YWwgPSBmYWN0b3J5KCdzZXRJbnRlcnZhbCcpO1xuXG4vKipcbiAqIOa4hemZpOmHjeWkjeiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lci5jbGVhckludGVydmFsXG4gKiBAbWVtYmVyb2YgdGltZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog5a6a5pe25Zmo5a+56LGhXG4gKi9cblRpbWVyLmNsZWFySW50ZXJ2YWwgPSBmYWN0b3J5KCdjbGVhckludGVydmFsJyk7XG5cbi8qKlxuICog6K6+572u5bu25pe26LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyLnNldFRpbWVvdXRcbiAqIEBtZW1iZXJvZiB0aW1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g5bu25pe26LCD55So55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbGF5PTBdIOW7tuaXtuiwg+eUqOeahOmXtOmalOaXtumXtChtcylcbiAqIEByZXR1cm5zIHtPYmplY3R9IOWumuaXtuWZqOWvueixoe+8jOWPr+S8oOWFpSBjbGVhclRpbWVvdXQg5pa55rOV5p2l57uI5q2i6L+Z5Liq5a6a5pe25ZmoXG4gKi9cblRpbWVyLnNldFRpbWVvdXQgPSBmYWN0b3J5KCdzZXRUaW1lb3V0Jyk7XG5cbi8qKlxuICog5riF6Zmk5bu25pe26LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyLmNsZWFyVGltZW91dFxuICogQG1lbWJlcm9mIHRpbWVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIOWumuaXtuWZqOWvueixoVxuICovXG5UaW1lci5jbGVhclRpbWVvdXQgPSBmYWN0b3J5KCdjbGVhclRpbWVvdXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsIi8qKlxuICog5Yqo55S76L+Q6KGM5pa55byP5bqTXG4gKiAtIFBvd1xuICogLSBFeHBvXG4gKiAtIENpcmNcbiAqIC0gU2luZVxuICogLSBCYWNrXG4gKiAtIEJvdW5jZVxuICogLSBFbGFzdGljXG4gKiAtIFF1YWRcbiAqIC0gQ3ViaWNcbiAqIC0gUXVhcnRcbiAqIC0gUXVpbnRcbiAqIEBtb2R1bGUgdHJhbnNpdGlvbnNcbiAqIEBzZWUgaHR0cHM6Ly9tb290b29scy5uZXQvY29yZS9kb2NzLzEuNi4wL0Z4L0Z4LlRyYW5zaXRpb25zI0Z4LVRyYW5zaXRpb25zXG4gKiBAZXhhbXBsZVxuICpcdHZhciBGeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1meC9meCcpO1xuICpcdHZhciB0cmFuc2l0aW9ucyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1meC90cmFuc2l0aW9ucycpO1xuICpcdG5ldyBGeCh7XG4gKlx0XHR0cmFuc2l0aW9uIDogdHJhbnNpdGlvbnMuU2luZS5lYXNlSW5PdXRcbiAqXHR9KTtcbiAqXHRuZXcgRngoe1xuICpcdFx0dHJhbnNpdGlvbiA6ICdTaW5lOkluJ1xuICpcdH0pO1xuICpcdG5ldyBGeCh7XG4gKlx0XHR0cmFuc2l0aW9uIDogJ1NpbmU6SW46T3V0J1xuICpcdH0pO1xuICovXG5cbnZhciAkdHlwZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovdHlwZScpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCdzcG9yZS1raXQtb2JqL2Fzc2lnbicpO1xuXG52YXIgJGZ4ID0gcmVxdWlyZSgnLi9meCcpO1xuXG4kZnguVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb24sIHBhcmFtcykge1xuXHRpZiAoJHR5cGUocGFyYW1zKSAhPT0gJ2FycmF5Jykge1xuXHRcdHBhcmFtcyA9IFtwYXJhbXNdO1xuXHR9XG5cdHZhciBlYXNlSW4gPSBmdW5jdGlvbihwb3MpIHtcblx0XHRyZXR1cm4gdHJhbnNpdGlvbihwb3MsIHBhcmFtcyk7XG5cdH07XG5cdHJldHVybiAkYXNzaWduKGVhc2VJbiwge1xuXHRcdGVhc2VJbjogZWFzZUluLFxuXHRcdGVhc2VPdXQ6IGZ1bmN0aW9uKHBvcykge1xuXHRcdFx0cmV0dXJuIDEgLSB0cmFuc2l0aW9uKDEgLSBwb3MsIHBhcmFtcyk7XG5cdFx0fSxcblx0XHRlYXNlSW5PdXQ6IGZ1bmN0aW9uKHBvcykge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0KHBvcyA8PSAwLjVcblx0XHRcdFx0XHQ/IHRyYW5zaXRpb24oMiAqIHBvcywgcGFyYW1zKVxuXHRcdFx0XHRcdDogMiAtIHRyYW5zaXRpb24oMiAqICgxIC0gcG9zKSwgcGFyYW1zKSkgLyAyXG5cdFx0XHQpO1xuXHRcdH1cblx0fSk7XG59O1xuXG52YXIgVHJhbnNpdGlvbnMgPSB7XG5cdGxpbmVhcjogZnVuY3Rpb24oemVybykge1xuXHRcdHJldHVybiB6ZXJvO1xuXHR9XG59O1xuXG5UcmFuc2l0aW9ucy5leHRlbmQgPSBmdW5jdGlvbih0cmFuc2l0aW9ucykge1xuXHRPYmplY3Qua2V5cyh0cmFuc2l0aW9ucykuZm9yRWFjaChmdW5jdGlvbih0cmFuc2l0aW9uKSB7XG5cdFx0VHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0gPSBuZXcgJGZ4LlRyYW5zaXRpb24odHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0pO1xuXHR9KTtcbn07XG5cblRyYW5zaXRpb25zLmV4dGVuZCh7XG5cdFBvdzogZnVuY3Rpb24ocCwgeCkge1xuXHRcdHJldHVybiBNYXRoLnBvdyhwLCAoeCAmJiB4WzBdKSB8fCA2KTtcblx0fSxcblxuXHRFeHBvOiBmdW5jdGlvbihwKSB7XG5cdFx0cmV0dXJuIE1hdGgucG93KDIsIDggKiAocCAtIDEpKTtcblx0fSxcblxuXHRDaXJjOiBmdW5jdGlvbihwKSB7XG5cdFx0cmV0dXJuIDEgLSBNYXRoLnNpbihNYXRoLmFjb3MocCkpO1xuXHR9LFxuXG5cdFNpbmU6IGZ1bmN0aW9uKHApIHtcblx0XHRyZXR1cm4gMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJIC8gMik7XG5cdH0sXG5cblx0QmFjazogZnVuY3Rpb24ocCwgeCkge1xuXHRcdHggPSAoeCAmJiB4WzBdKSB8fCAxLjYxODtcblx0XHRyZXR1cm4gTWF0aC5wb3cocCwgMikgKiAoKHggKyAxKSAqIHAgLSB4KTtcblx0fSxcblxuXHRCb3VuY2U6IGZ1bmN0aW9uKHApIHtcblx0XHR2YXIgdmFsdWU7XG5cdFx0dmFyIGEgPSAwO1xuXHRcdHZhciBiID0gMTtcblx0XHR3aGlsZSAocCA8ICg3IC0gNCAqIGEpIC8gMTEpIHtcblx0XHRcdHZhbHVlID0gYiAqIGIgLSBNYXRoLnBvdygoMTEgLSA2ICogYSAtIDExICogcCkgLyA0LCAyKTtcblx0XHRcdGEgKz0gYjtcblx0XHRcdGIgLz0gMjtcblx0XHR9XG5cdFx0dmFsdWUgPSBiICogYiAtIE1hdGgucG93KCgxMSAtIDYgKiBhIC0gMTEgKiBwKSAvIDQsIDIpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fSxcblxuXHRFbGFzdGljOiBmdW5jdGlvbihwLCB4KSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdE1hdGgucG93KDIsIDEwICogLS1wKVxuXHRcdFx0KiBNYXRoLmNvcygyMCAqIHAgKiBNYXRoLlBJICogKCh4ICYmIHhbMF0pIHx8IDEpIC8gMylcblx0XHQpO1xuXHR9XG59KTtcblxuWydRdWFkJywgJ0N1YmljJywgJ1F1YXJ0JywgJ1F1aW50J10uZm9yRWFjaChmdW5jdGlvbih0cmFuc2l0aW9uLCBpKSB7XG5cdFRyYW5zaXRpb25zW3RyYW5zaXRpb25dID0gbmV3ICRmeC5UcmFuc2l0aW9uKGZ1bmN0aW9uKHApIHtcblx0XHRyZXR1cm4gTWF0aC5wb3cocCwgaSArIDIpO1xuXHR9KTtcbn0pO1xuXG4kZnguc3RhdGljcyh7XG5cdGdldFRyYW5zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0cmFucyA9IHRoaXMub3B0aW9ucy50cmFuc2l0aW9uIHx8IFRyYW5zaXRpb25zLlNpbmUuZWFzZUluT3V0O1xuXHRcdGlmICh0eXBlb2YgdHJhbnMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR2YXIgZGF0YSA9IHRyYW5zLnNwbGl0KCc6Jyk7XG5cdFx0XHR0cmFucyA9IFRyYW5zaXRpb25zO1xuXHRcdFx0dHJhbnMgPSB0cmFuc1tkYXRhWzBdXSB8fCB0cmFuc1tkYXRhWzBdXTtcblx0XHRcdGlmIChkYXRhWzFdKSB7XG5cdFx0XHRcdHRyYW5zID0gdHJhbnNbJ2Vhc2UnICsgZGF0YVsxXSArIChkYXRhWzJdID8gZGF0YVsyXSA6ICcnKV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0cmFucztcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbnM7XG4iLCIvKipcbiAqIOWKoOi9vSBzY3JpcHQg5paH5Lu2XG4gKiBAbWV0aG9kIGdldFNjcmlwdFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5zcmMgc2NyaXB0IOWcsOWdgFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNoYXJzZXQ9J3V0Zi04J10gc2NyaXB0IOe8lueggVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25Mb2FkXSBzY3JpcHQg5Yqg6L295a6M5oiQ55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICpcdGdldFNjcmlwdCh7XG4gKlx0XHRzcmM6ICdodHRwczovL2NvZGUuanF1ZXJ5LmNvbS9qcXVlcnktMy4zLjEubWluLmpzJyxcbiAqXHRcdG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICpcdFx0XHRjb25zb2xlLmluZm8od2luZG93LmpRdWVyeSk7XG4gKlx0XHR9XG4gKlx0fSk7XG4gKi9cblxuZnVuY3Rpb24gZ2V0U2NyaXB0KG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0dmFyIHNyYyA9IG9wdGlvbnMuc3JjIHx8ICcnO1xuXHR2YXIgY2hhcnNldCA9IG9wdGlvbnMuY2hhcnNldCB8fCAnJztcblx0dmFyIG9uTG9hZCA9IG9wdGlvbnMub25Mb2FkIHx8IGZ1bmN0aW9uKCkge307XG5cblx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRzY3JpcHQuYXN5bmMgPSAnYXN5bmMnO1xuXHRzY3JpcHQuc3JjID0gc3JjO1xuXG5cdGlmIChjaGFyc2V0KSB7XG5cdFx0c2NyaXB0LmNoYXJzZXQgPSBjaGFyc2V0O1xuXHR9XG5cdHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoXG5cdFx0XHQhdGhpcy5yZWFkeVN0YXRlXG5cdFx0XHR8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnXG5cdFx0XHR8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcblx0XHQpIHtcblx0XHRcdGlmICh0eXBlb2Ygb25Mb2FkID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdG9uTG9hZCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5vbmxvYWQgPSBudWxsO1xuXHRcdFx0dGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuXHRcdFx0dGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuXHRcdH1cblx0fTtcblx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0cmV0dXJuIHNjcmlwdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTY3JpcHQ7XG4iLCIvKipcbiAqIOWwgeijhSBpZnJhbWUgcG9zdCDmqKHlvI9cbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAbWV0aG9kIGlmcmFtZVBvc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOivt+axgumAiemhuVxuICogQHBhcmFtIHtPYmplY3R9IFtzcGVjLmZvcm09bnVsbF0g6KaB6K+35rGC55qE6KGo5Y2VXG4gKiBAcGFyYW0ge1N0cmluZ30gc3BlYy51cmwg6K+35rGC5Zyw5Z2AXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gc3BlYy5kYXRhIOivt+axguaVsOaNrlxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLnRhcmdldD0nJ10g55uu5qCHIGlmcmFtZSDlkI3np7BcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5tZXRob2Q9J3Bvc3QnXSDor7fmsYLmlrnlvI9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5hY2NlcHRDaGFyc2V0PScnXSDor7fmsYLnm67moIfnmoTnvJbnoIFcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucD0nY2FsbGJhY2snXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlj4LmlbDlkI3np7BcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucE1ldGhvZD0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Y+C5pWw55qE5Lyg6YCS5pa55byP77yM5Y+v6YCJWydwb3N0JywgJ2dldCddXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMuanNvbnBDYWxsYmFjaz0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Ye95pWw5ZCN56ew77yM6buY6K6k6Ieq5Yqo55Sf5oiQXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMuanNvbnBBZGRQYXJlbnQ9JyddIOS8oOmAkue7meaOpeWPo+eahOWbnuiwg+WHveaVsOWQjeensOmcgOimgemZhOW4pueahOWJjee8gOiwg+eUqOi3r+W+hFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3NwZWMuY29tcGxldGVdIOiOt+W+l+aVsOaNrueahOWbnuiwg+WHveaVsFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3NwZWMuc3VjY2Vzc10g5oiQ5Yqf6I635b6X5pWw5o2u55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICpcdGRvY3VtZW50LmRvbWFpbiA9ICdxcS5jb20nO1xuICpcdGlmcmFtZVBvc3Qoe1xuICpcdFx0dXJsOiAnaHR0cDovL2EucXEuY29tL2Zvcm0nLFxuICpcdFx0ZGF0YTogW3tcbiAqXHRcdFx0bjE6ICd2MScsXG4gKlx0XHRcdG4yOiAndjInXG4gKlx0XHR9XSxcbiAqXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChycykge1xuICpcdFx0XHRjb25zb2xlLmluZm8ocnMpO1xuICpcdFx0fVxuICpcdH0pO1xuICovXG5cbnZhciBoaWRkZW5EaXYgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXQkICgpIHtcblx0dmFyICQ7XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdCQgPSB3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bztcblx0fVxuXHRpZiAoISQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ05lZWQgd2luZGRvdy4kIGxpa2UgalF1ZXJ5IG9yIFplcHRvLicpO1xuXHR9XG5cdHJldHVybiAkO1xufVxuXG5mdW5jdGlvbiBnZXRIaWRkZW5Cb3ggKCkge1xuXHR2YXIgJCA9IGdldCQoKTtcblx0aWYgKGhpZGRlbkRpdiA9PT0gbnVsbCkge1xuXHRcdGhpZGRlbkRpdiA9ICQoJzxkaXYvPicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0aGlkZGVuRGl2LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXHR9XG5cdHJldHVybiBoaWRkZW5EaXY7XG59XG5cbmZ1bmN0aW9uIGdldEZvcm0gKCkge1xuXHR2YXIgJCA9IGdldCQoKTtcblx0dmFyIGZvcm0gPSAkKCc8Zm9ybSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIj48L2Zvcm0+Jyk7XG5cdGZvcm0uYXBwZW5kVG8oZ2V0SGlkZGVuQm94KCkpO1xuXHRyZXR1cm4gZm9ybTtcbn1cblxuZnVuY3Rpb24gZ2V0SGlkZGVuSW5wdXQgKGZvcm0sIG5hbWUpIHtcblx0dmFyICQgPSBnZXQkKCk7XG5cdHZhciBpbnB1dCA9ICQoZm9ybSkuZmluZCgnW25hbWU9XCInICsgbmFtZSArICdcIl0nKTtcblx0aWYgKCFpbnB1dC5nZXQoMCkpIHtcblx0XHRpbnB1dCA9ICQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIicgKyBuYW1lICsgJ1wiIHZhbHVlPVwiXCIvPicpO1xuXHRcdGlucHV0LmFwcGVuZFRvKGZvcm0pO1xuXHR9XG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gZ2V0SWZyYW1lIChuYW1lKSB7XG5cdHZhciAkID0gZ2V0JCgpO1xuXHR2YXIgaWZyYW1lID0gJChcblx0XHQnPGlmcmFtZSBpZD1cIidcblx0XHQrIG5hbWVcblx0XHQrICdcIiBuYW1lPVwiJ1xuXHRcdCsgbmFtZVxuXHRcdCsgJ1wiIHNyYz1cImFib3V0OmJsYW5rXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+PC9pZnJhbWU+J1xuXHQpO1xuXHRpZnJhbWUuYXBwZW5kVG8oZ2V0SGlkZGVuQm94KCkpO1xuXHRyZXR1cm4gaWZyYW1lO1xufVxuXG5mdW5jdGlvbiBpZnJhbWVQb3N0IChzcGVjKSB7XG5cdHZhciAkID0gZ2V0JCgpO1xuXHR2YXIgY29uZiA9ICQuZXh0ZW5kKHtcblx0XHRmb3JtOiBudWxsLFxuXHRcdHVybDogJycsXG5cdFx0ZGF0YTogW10sXG5cdFx0dGFyZ2V0OiAnJyxcblx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRhY2NlcHRDaGFyc2V0OiAnJyxcblx0XHRqc29ucDogJ2NhbGxiYWNrJyxcblx0XHRqc29ucE1ldGhvZDogJycsXG5cdFx0anNvbnBDYWxsYmFjazogJycsXG5cdFx0anNvbnBBZGRQYXJlbnQ6ICcnLFxuXHRcdGNvbXBsZXRlOiAkLm5vb3AsXG5cdFx0c3VjY2VzczogJC5ub29wXG5cdH0sIHNwZWMpO1xuXG5cdHZhciB0aGF0ID0ge307XG5cdHRoYXQudXJsID0gY29uZi51cmw7XG5cblx0dGhhdC5qc29ucCA9IGNvbmYuanNvbnAgfHwgJ2NhbGxiYWNrJztcblx0dGhhdC5tZXRob2QgPSBjb25mLm1ldGhvZCB8fCAncG9zdCc7XG5cdHRoYXQuanNvbnBNZXRob2QgPSAkLnR5cGUoY29uZi5qc29ucE1ldGhvZCkgPT09ICdzdHJpbmcnXG5cdFx0PyBjb25mLmpzb25wTWV0aG9kLnRvTG93ZXJDYXNlKClcblx0XHQ6ICcnO1xuXG5cdHZhciBmb3JtID0gJChjb25mLmZvcm0pO1xuXHRpZiAoIWZvcm0ubGVuZ3RoKSB7XG5cdFx0Zm9ybSA9IGdldEZvcm0oKTtcblxuXHRcdHZhciBodG1sID0gW107XG5cdFx0aWYgKCQuaXNBcnJheShjb25mLmRhdGEpKSB7XG5cdFx0XHQkLmVhY2goY29uZi5kYXRhLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuXHRcdFx0XHRpZiAoIWl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aHRtbC5wdXNoKFxuXHRcdFx0XHRcdCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInXG5cdFx0XHRcdFx0KyBpdGVtLm5hbWVcblx0XHRcdFx0XHQrICdcIiB2YWx1ZT1cIidcblx0XHRcdFx0XHQrIGl0ZW0udmFsdWVcblx0XHRcdFx0XHQrICdcIj4nXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKCQuaXNQbGFpbk9iamVjdChjb25mLmRhdGEpKSB7XG5cdFx0XHQkLmVhY2goY29uZi5kYXRhLCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuXHRcdFx0XHRodG1sLnB1c2goXG5cdFx0XHRcdFx0JzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIidcblx0XHRcdFx0XHQrIG5hbWVcblx0XHRcdFx0XHQrICdcIiB2YWx1ZT1cIidcblx0XHRcdFx0XHQrIHZhbHVlXG5cdFx0XHRcdFx0KyAnXCI+J1xuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdCQoaHRtbC5qb2luKCcnKSkuYXBwZW5kVG8oZm9ybSk7XG5cdH1cblx0dGhhdC5mb3JtID0gZm9ybTtcblx0dGhhdC5jb25mID0gY29uZjtcblxuXHR2YXIgdGltZVN0YW1wID0gK25ldyBEYXRlKCk7XG5cdHZhciBpZnJhbWVOYW1lID0gJ2lmcmFtZScgKyB0aW1lU3RhbXA7XG5cblx0dGhhdC50aW1lU3RhbXAgPSB0aW1lU3RhbXA7XG5cdHRoYXQuaWZyYW1lTmFtZSA9IGlmcmFtZU5hbWU7XG5cblx0aWYgKGNvbmYuYWNjZXB0Q2hhcnNldCkge1xuXHRcdGZvcm0uYXR0cignYWNjZXB0LWNoYXJzZXQnLCBjb25mLmFjY2VwdENoYXJzZXQpO1xuXHRcdHRoYXQuYWNjZXB0Q2hhcnNldCA9IGNvbmYuYWNjZXB0Q2hhcnNldDtcblx0fVxuXG5cdHZhciBpZnJhbWUgPSBudWxsO1xuXHR2YXIgdGFyZ2V0ID0gJyc7XG5cdGlmIChjb25mLnRhcmdldCkge1xuXHRcdHRhcmdldCA9IGNvbmYudGFyZ2V0O1xuXHRcdGlmIChbJ19ibGFuaycsICdfc2VsZicsICdfcGFyZW50JywgJ190b3AnXS5pbmRleE9mKGNvbmYudGFyZ2V0KSA8IDApIHtcblx0XHRcdGlmcmFtZSA9ICQoJ2lmcmFtZVtuYW1lPVwiJyArIGNvbmYudGFyZ2V0ICsgJ1wiXScpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHR0YXJnZXQgPSBpZnJhbWVOYW1lO1xuXHRcdGlmcmFtZSA9IGdldElmcmFtZShpZnJhbWVOYW1lKTtcblx0fVxuXHRmb3JtLmF0dHIoJ3RhcmdldCcsIHRhcmdldCk7XG5cdHRoYXQudGFyZ2V0ID0gdGFyZ2V0O1xuXHR0aGF0LmlmcmFtZSA9IGlmcmFtZTtcblxuXHR2YXIganNvbnBDYWxsYmFjayA9IGNvbmYuanNvbnBDYWxsYmFjayB8fCAnaWZyYW1lQ2FsbGJhY2snICsgdGltZVN0YW1wO1xuXHR0aGF0Lmpzb25wQ2FsbGJhY2sgPSBqc29ucENhbGxiYWNrO1xuXG5cdGlmICghdGhhdC5qc29ucE1ldGhvZCB8fCB0aGF0Lmpzb25wTWV0aG9kID09PSAncG9zdCcpIHtcblx0XHR2YXIgaW5wdXQgPSBnZXRIaWRkZW5JbnB1dChmb3JtLCB0aGF0Lmpzb25wKTtcblx0XHRpbnB1dC52YWwoY29uZi5qc29ucEFkZFBhcmVudCArIGpzb25wQ2FsbGJhY2spO1xuXHR9IGVsc2UgaWYgKHRoYXQuanNvbnBNZXRob2QgPT09ICdnZXQnKSB7XG5cdFx0dGhhdC51cmwgPSB0aGF0LnVybFxuXHRcdFx0KyAodGhhdC51cmwuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpXG5cdFx0XHQrIHRoYXQuanNvbnBcblx0XHRcdCsgJz0nXG5cdFx0XHQrIGpzb25wQ2FsbGJhY2s7XG5cdH1cblxuXHRpZiAoIWNvbmYuanNvbnBDYWxsYmFjaykge1xuXHRcdHRoYXQuY2FsbGJhY2sgPSBmdW5jdGlvbihycykge1xuXHRcdFx0aWYgKCQuaXNGdW5jdGlvbihjb25mLmNvbXBsZXRlKSkge1xuXHRcdFx0XHRjb25mLmNvbXBsZXRlKHJzLCB0aGF0LCAnc3VjY2VzcycpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCQuaXNGdW5jdGlvbihjb25mLnN1Y2Nlc3MpKSB7XG5cdFx0XHRcdGNvbmYuc3VjY2VzcyhycywgdGhhdCwgJ3N1Y2Nlc3MnKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHdpbmRvd1tqc29ucENhbGxiYWNrXSA9IHRoYXQuY2FsbGJhY2s7XG5cdH1cblxuXHRmb3JtLmF0dHIoe1xuXHRcdGFjdGlvbjogdGhhdC51cmwsXG5cdFx0bWV0aG9kOiB0aGF0Lm1ldGhvZFxuXHR9KTtcblxuXHRmb3JtLnN1Ym1pdCgpO1xuXG5cdHJldHVybiB0aGF0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlmcmFtZVBvc3Q7XG4iLCIvKipcbiAqICMg5aSE55CG572R57uc5Lqk5LqSXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC1pb1xuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvaW9cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuaW8uZ2V0U2NyaXB0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LWlvXG4gKiB2YXIgJGlvID0gcmVxdWlyZSgnc3BvcmUta2l0LWlvJyk7XG4gKiBjb25zb2xlLmluZm8oJGlvLmdldFNjcmlwdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGdldFNjcmlwdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1pby9nZXRTY3JpcHQnKTtcbiAqL1xuXG5leHBvcnRzLmlmcmFtZVBvc3QgPSByZXF1aXJlKCcuL2lmcmFtZVBvc3QnKTtcbmV4cG9ydHMuZ2V0U2NyaXB0ID0gcmVxdWlyZSgnLi9nZXRTY3JpcHQnKTtcbiIsIi8qKlxuICog6Kej5p6QIGxvY2F0aW9uLnNlYXJjaCDkuLrkuIDkuKpKU09O5a+56LGhXG4gKiAtIOaIluiAheiOt+WPluWFtuS4reafkOS4quWPguaVsFxuICogQG1ldGhvZCBnZXRRdWVyeVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkzlrZfnrKbkuLJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIOWPguaVsOWQjeensFxuICogQHJldHVybnMge09iamVjdHxTdHJpbmd9IHF1ZXJ55a+56LGhIHwg5Y+C5pWw5YC8XG4gKiBAZXhhbXBsZVxuICpcdHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdC9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSc7XG4gKlx0Y29uc29sZS5pbmZvKCBnZXRRdWVyeSh1cmwpICk7XG4gKlx0Ly8ge2JlaWppbmcgOiAnaHVhbnlpbmduaSd9XG4gKlx0Y29uc29sZS5pbmZvKCBnZXRRdWVyeSh1cmwsICdiZWlqaW5nJykgKTtcbiAqXHQvLyAnaHVhbnlpbmduaSdcbiAqL1xuXG52YXIgY2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gZ2V0UXVlcnkodXJsLCBuYW1lKSB7XG5cdHZhciBxdWVyeSA9IGNhY2hlW3VybF0gfHwge307XG5cblx0aWYgKHVybCkge1xuXHRcdHZhciBzZWFyY2hJbmRleCA9IHVybC5pbmRleE9mKCc/Jyk7XG5cdFx0aWYgKHNlYXJjaEluZGV4ID49IDApIHtcblx0XHRcdHZhciBzZWFyY2ggPSB1cmwuc2xpY2Uoc2VhcmNoSW5kZXggKyAxLCB1cmwubGVuZ3RoKTtcblx0XHRcdHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKC8jLiovLCAnJyk7XG5cblx0XHRcdHZhciBwYXJhbXMgPSBzZWFyY2guc3BsaXQoJyYnKTtcblx0XHRcdHBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG5cdFx0XHRcdHZhciBlcXVhbEluZGV4ID0gZ3JvdXAuaW5kZXhPZignPScpO1xuXHRcdFx0XHRpZiAoZXF1YWxJbmRleCA+IDApIHtcblx0XHRcdFx0XHR2YXIga2V5ID0gZ3JvdXAuc2xpY2UoMCwgZXF1YWxJbmRleCk7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gZ3JvdXAuc2xpY2UoZXF1YWxJbmRleCArIDEsIGdyb3VwLmxlbmd0aCk7XG5cdFx0XHRcdFx0cXVlcnlba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y2FjaGVbdXJsXSA9IHF1ZXJ5O1xuXHR9XG5cblx0aWYgKCFuYW1lKSB7XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBxdWVyeVtuYW1lXSB8fCAnJztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFF1ZXJ5O1xuIiwiLyoqXG4gKiAjIOWkhOeQhuWcsOWdgOWtl+espuS4slxuICogQG1vZHVsZSBzcG9yZS1raXQtbG9jYXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2xvY2F0aW9uXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmxvY2F0aW9uLmdldFF1ZXJ5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LWxvY2F0aW9uXG4gKiB2YXIgJGxvY2F0aW9uID0gcmVxdWlyZSgnc3BvcmUta2l0LWxvY2F0aW9uJyk7XG4gKiBjb25zb2xlLmluZm8oJGxvY2F0aW9uLmdldFF1ZXJ5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZ2V0UXVlcnkgPSByZXF1aXJlKCdzcG9yZS1raXQtbG9jYXRpb24vZ2V0UXVlcnknKTtcbiAqL1xuXG5leHBvcnRzLmdldFF1ZXJ5ID0gcmVxdWlyZSgnLi9nZXRRdWVyeScpO1xuZXhwb3J0cy5zZXRRdWVyeSA9IHJlcXVpcmUoJy4vc2V0UXVlcnknKTtcbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG4iLCIvKipcbiAqIOino+aekFVSTOS4uuS4gOS4qkpTT07lr7nosaFcbiAqIEBtZXRob2QgcGFyc2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVVJM5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBKU09O5a+56LGhXG4gKiBAZXhhbXBsZVxuICogY29uc29sZS5pbmZvKCBwYXJzZSgnaHR0cDovL3Quc2luYS5jb20uY24vcHJvZmlsZT9iZWlqaW5nPWh1YW55aW5nbmknKSApO1xuICogLy9cdHtcbiAqIC8vXHRcdGhhc2ggOiAnJ1xuICogLy9cdFx0aG9zdCA6ICd0LnNpbmEuY29tLmNuJ1xuICogLy9cdFx0cGF0aCA6ICdwcm9maWxlJ1xuICogLy9cdFx0cG9ydCA6ICcnXG4gKiAvL1x0XHRxdWVyeSA6ICdiZWlqaW5nPWh1YW55aW5nbmknXG4gKiAvL1x0XHRzY2hlbWUgOiBodHRwXG4gKiAvL1x0XHRzbGFzaCA6ICcvLydcbiAqIC8vXHRcdHVybCA6ICdodHRwOi8vdC5zaW5hLmNvbS5jbi9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSdcbiAqIC8vXHR9XG4gKi9cblxuZnVuY3Rpb24gcGFyc2UgKHVybCkge1xuXHR2YXIgcmVnVXJsUGFyc2UgPSAvXig/OihbQS1aYS16XSspOihcXC97MCwzfSkpPyhbMC05LlxcLUEtWmEtel0rXFwuWzAtOUEtWmEtel0rKT8oPzo6KFxcZCspKT8oPzpcXC8oW14/I10qKSk/KD86XFw/KFteI10qKSk/KD86IyguKikpPyQvO1xuXHR2YXIgbmFtZXMgPSBbJ3VybCcsICdzY2hlbWUnLCAnc2xhc2gnLCAnaG9zdCcsICdwb3J0JywgJ3BhdGgnLCAncXVlcnknLCAnaGFzaCddO1xuXHR2YXIgcmVzdWx0cyA9IHJlZ1VybFBhcnNlLmV4ZWModXJsKTtcblx0dmFyIHRoYXQgPSB7fTtcblx0aWYgKHJlc3VsdHMpIHtcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcblx0XHRcdHRoYXRbbmFtZXNbaV1dID0gcmVzdWx0c1tpXSB8fCAnJztcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRoYXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG4iLCIvKipcbiAqIOWwhuWPguaVsOiuvue9ruWIsCBsb2NhdGlvbi5zZWFyY2gg5LiKXG4gKiBAbWV0aG9kIHNldFF1ZXJ5XG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSTOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IOWPguaVsOWvueixoVxuICogQHJldHVybnMge1N0cmluZ30g5ou85o6l5aW95Y+C5pWw55qEVVJM5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogc2V0UXVlcnkoJ2xvY2FsaG9zdCcpOyAvLyAnbG9jYWxob3N0J1xuICogc2V0UXVlcnkoJ2xvY2FsaG9zdCcsIHthOiAxfSk7IC8vICdsb2NhbGhvc3Q/YT0xJ1xuICogc2V0UXVlcnkoJycsIHthOiAxfSk7IC8vICc/YT0xJ1xuICogc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEnLCB7YTogMn0pOyAvLyAnbG9jYWxob3N0P2E9MidcbiAqIHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2E6ICcnfSk7IC8vICdsb2NhbGhvc3Q/YT0nXG4gKiBzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHthOiBudWxsfSk7IC8vICdsb2NhbGhvc3QnXG4gKiBzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHtiOiAyfSk7IC8vICdsb2NhbGhvc3Q/YT0xJmI9MidcbiAqIHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJmI9MScsIHthOiAyLCBiOiAzfSk7IC8vICdsb2NhbGhvc3Q/YT0yJmI9MydcbiAqIHNldFF1ZXJ5KCdsb2NhbGhvc3QjYT0xJywge2E6IDIsIGI6IDN9KTsgLy8gJ2xvY2FsaG9zdD9hPTImYj0zI2E9MSdcbiAqIHNldFF1ZXJ5KCcjYT0xJywge2E6IDIsIGI6IDN9KTsgLy8gJz9hPTImYj0zI2E9MSdcbiAqL1xuXG5mdW5jdGlvbiBzZXRRdWVyeSAodXJsLCBxdWVyeSkge1xuXHR1cmwgPSB1cmwgfHwgJyc7XG5cdGlmICghcXVlcnkpIHsgcmV0dXJuIHVybDsgfVxuXG5cdHZhciByZWcgPSAvKFtePyNdKikoXFw/ezAsMX1bXj8jXSopKCN7MCwxfS4qKS87XG5cdHJldHVybiB1cmwucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG1hdGNoLCBwYXRoLCBzZWFyY2gsIGhhc2gpIHtcblx0XHRzZWFyY2ggPSBzZWFyY2ggfHwgJyc7XG5cdFx0c2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJyk7XG5cblx0XHR2YXIgcGFyYSA9IHNlYXJjaC5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbihvYmosIHBhaXIpIHtcblx0XHRcdHZhciBhcnIgPSBwYWlyLnNwbGl0KCc9Jyk7XG5cdFx0XHRpZiAoYXJyWzBdKSB7XG5cdFx0XHRcdG9ialthcnJbMF1dID0gYXJyWzFdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9LCB7fSk7XG5cblx0XHRPYmplY3Qua2V5cyhxdWVyeSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHZhciB2YWx1ZSA9IHF1ZXJ5W2tleV07XG5cdFx0XHRpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkZWxldGUgcGFyYVtrZXldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyYVtrZXldID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR2YXIgcGFyYUtleXMgPSBPYmplY3Qua2V5cyhwYXJhKTtcblx0XHRpZiAoIXBhcmFLZXlzLmxlbmd0aCkge1xuXHRcdFx0c2VhcmNoID0gJyc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlYXJjaCA9ICc/JyArIHBhcmFLZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcblx0XHRcdFx0cmV0dXJuIGtleSArICc9JyArIHBhcmFba2V5XTtcblx0XHRcdH0pLmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aCArIHNlYXJjaCArIGhhc2g7XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFF1ZXJ5O1xuIiwiLyoqXG4gKiDln7rnoYDlt6XljoLlhYPku7bnsbtcbiAqIC0g6K+l57G75re35ZCI5LqGIHNwb3JlLWtpdC1ldnQvZXZlbnRzIOeahOaWueazleOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAqIEBtb2R1bGUgQmFzZVxuICogQGV4YW1wbGVcbiAqXHR2YXIgQmFzZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1tdmMvYmFzZScpO1xuICpcbiAqXHR2YXIgQ2hpbGRDbGFzcyA9IEJhc2UuZXh0ZW5kKHtcbiAqXHRcdGRlZmF1bHRzIDoge1xuICpcdFx0XHRub2RlIDogbnVsbFxuICpcdFx0fSxcbiAqXHRcdGJ1aWxkIDogZnVuY3Rpb24oKSB7XG4gKlx0XHRcdHRoaXMubm9kZSA9ICQodGhpcy5jb25mLm5vZGUpO1xuICpcdFx0fSxcbiAqXHRcdHNldEV2ZW50cyA6IGZ1bmN0aW9uKGFjdGlvbikge1xuICpcdFx0XHR2YXIgcHJveHkgPSB0aGlzLnByb3h5KCk7XG4gKlx0XHRcdHRoaXMubm9kZVthY3Rpb25dKCdjbGljaycsIHByb3h5KCdvbmNsaWNrJykpO1xuICpcdFx0fSxcbiAqXHRcdG9uY2xpY2sgOiBmdW5jdGlvbigpIHtcbiAqXHRcdFx0Y29uc29sZS5pbmZvKCdjbGlja2VkJyk7XG4gKlx0XHRcdHRoaXMudHJpZ2dlcignY2xpY2snKTtcbiAqXHRcdH1cbiAqXHR9KTtcbiAqXG4gKlx0dmFyIG9iaiA9IG5ldyBDaGlsZENsYXNzKHtcbiAqXHRcdG5vZGUgOiBkb2N1bWVudC5ib2R5XG4gKlx0fSk7XG4gKlxuICpcdG9iai5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAqXHRcdGNvbnNvbGUuaW5mbygnb2JqIGlzIGNsaWNrZWQnKTtcbiAqXHR9KTtcbiAqL1xuXG52YXIgJGV2ZW50cyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1ldnQvZXZlbnRzJyk7XG52YXIgJG1lcmdlID0gcmVxdWlyZSgnbG9kYXNoL21lcmdlJyk7XG52YXIgJG5vb3AgPSByZXF1aXJlKCdsb2Rhc2gvbm9vcCcpO1xudmFyICRpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzUGxhaW5PYmplY3QnKTtcbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGtsYXNzID0gcmVxdWlyZSgnLi9rbGFzcycpO1xuXG52YXIgQVAgPSBBcnJheS5wcm90b3R5cGU7XG52YXIgQmFzZSA9ICRrbGFzcyh7XG5cdC8qKlxuXHQgKiDnsbvnmoTpu5jorqTpgInpobnlr7nosaHvvIznu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaFcblx0ICogQG5hbWUgQmFzZSNkZWZhdWx0c1xuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKi9cblx0ZGVmYXVsdHM6IHt9LFxuXG5cdC8qKlxuXHQgKiDnsbvnmoTlrp7pmYXpgInpobnvvIxzZXRPcHRpb25zIOaWueazleS8muS/ruaUuei/meS4quWvueixoVxuXHQgKiBAbmFtZSBCYXNlI2NvbmZcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIEJhc2Vcblx0ICovXG5cblx0LyoqXG5cdCAqIOWtmOaUvuS7o+eQhuWHveaVsOeahOmbhuWQiFxuXHQgKiBAbmFtZSBCYXNlI2JvdW5kXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqIEBtZW1iZXJvZiBCYXNlXG5cdCAqL1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy5idWlsZCgpO1xuXHRcdHRoaXMuc2V0RXZlbnRzKCdvbicpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDmt7Hluqbmt7flkIjkvKDlhaXnmoTpgInpobnkuI7pu5jorqTpgInpobnvvIzmt7flkIjlrozmiJDnmoTpgInpobnlr7nosaHlj6/pgJrov4cgdGhpcy5jb25mIOWxnuaAp+iuv+mXrlxuXHQgKiBAbWV0aG9kIEJhc2Ujc2V0T3B0aW9uc1xuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuXHQgKi9cblx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHRoaXMuY29uZiA9IHRoaXMuY29uZiB8fCAkbWVyZ2Uoe30sIHRoaXMuZGVmYXVsdHMpO1xuXHRcdGlmICghJGlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcblx0XHRcdG9wdGlvbnMgPSB7fTtcblx0XHR9XG5cdFx0JG1lcmdlKHRoaXMuY29uZiwgb3B0aW9ucyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOWFg+S7tuWIneWni+WMluaOpeWPo+WHveaVsO+8jOWunuS+i+WMluWFg+S7tuaXtuS8muiHquWKqOmmluWFiOiwg+eUqFxuXHQgKiBAYWJzdHJhY3Rcblx0ICogQG1ldGhvZCBCYXNlI2J1aWxkXG5cdCAqIEBtZW1iZXJvZiBCYXNlXG5cdCAqL1xuXHRidWlsZDogJG5vb3AsXG5cblx0LyoqXG5cdCAqIOWFg+S7tuS6i+S7tue7keWumuaOpeWPo+WHveaVsO+8jOWunuS+i+WMluWFg+S7tuaXtuS8muiHquWKqOWcqCBidWlsZCDkuYvlkI7osIPnlKhcblx0ICogQG1ldGhvZCBCYXNlI3NldEV2ZW50c1xuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprmiJbogIXnp7vpmaTkuovku7bnmoTmoIforrDvvIzlj6/pgInlgLzmnInvvJpbJ29uJywgJ29mZiddXG5cdCAqL1xuXHRzZXRFdmVudHM6ICRub29wLFxuXG5cdC8qKlxuXHQgKiDlh73mlbDku6PnkIbvvIznoa7kv53lh73mlbDlnKjlvZPliY3nsbvliJvlu7rnmoTlrp7kvovkuIrkuIvmlofkuK3miafooYzjgIJcblx0ICog6L+Z5Lqb55So5LqO57uR5a6a5LqL5Lu255qE5Luj55CG5Ye95pWw6YO95pS+5Zyo5bGe5oCnIHRoaXMuYm91bmQg5LiK44CCXG5cdCAqIOWKn+iDveexu+S8vCBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCDjgIJcblx0ICog5Y+v5Lul5Lyg6YCS6aKd5aSW5Y+C5pWw5L2c5Li65Ye95pWw5omn6KGM55qE6buY6K6k5Y+C5pWw77yM6L+95Yqg5Zyo5a6e6ZmF5Y+C5pWw5LmL5ZCO44CCXG5cdCAqIEBtZXRob2QgQmFzZSNwcm94eVxuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW25hbWU9J3Byb3h5J10g5Ye95pWw5ZCN56ewXG5cdCAqL1xuXHRwcm94eTogZnVuY3Rpb24obmFtZSkge1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHR2YXIgYm91bmQgPSB0aGlzLmJvdW5kID8gdGhpcy5ib3VuZCA6IHRoaXMuYm91bmQgPSB7fTtcblx0XHR2YXIgcHJveHlBcmdzID0gQVAuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdHByb3h5QXJncy5zaGlmdCgpO1xuXHRcdG5hbWUgPSBuYW1lIHx8ICdwcm94eSc7XG5cdFx0aWYgKCEkaXNGdW5jdGlvbihib3VuZFtuYW1lXSkpIHtcblx0XHRcdGJvdW5kW25hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkaXNGdW5jdGlvbih0aGF0W25hbWVdKSkge1xuXHRcdFx0XHRcdHZhciBhcmdzID0gQVAuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdFx0XHRcdHJldHVybiB0aGF0W25hbWVdLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KHByb3h5QXJncykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gYm91bmRbbmFtZV07XG5cdH0sXG5cblx0LyoqXG5cdCAqIOenu+mZpOaJgOaciee7keWumuS6i+S7tu+8jOa4hemZpOeUqOS6jue7keWumuS6i+S7tueahOS7o+eQhuWHveaVsFxuXHQgKiBAbWV0aG9kIEJhc2UjZGVzdHJveVxuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKi9cblx0ZGVzdHJveTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRFdmVudHMoJ29mZicpO1xuXHRcdHRoaXMub2ZmKCk7XG5cdFx0dGhpcy5ib3VuZCA9IG51bGw7XG5cdH1cbn0pO1xuXG5CYXNlLm1ldGhvZHMoJGV2ZW50cy5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCIvKipcbiAqIOS6i+S7tuWvueixoee7keWumu+8jOWwhmV2ZW50c+S4reWMheWQq+eahOmUruWAvOWvueaYoOWwhOS4uuS7o+eQhueahOS6i+S7tuOAglxuICogLSDkuovku7bplK7lgLzlr7nmoLzlvI/lj6/ku6XkuLrvvJpcbiAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZCd9XG4gKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cbiAqIC0geydldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gKiBAbWV0aG9kIGRlbGVnYXRlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFjdGlvbiDlvIAv5YWz5Luj55CG77yM5Y+v6YCJ77yaWydvbicsICdvZmYnXeOAglxuICogQHBhcmFtIHtPYmplY3R9IHJvb3Qg6K6+572u5Luj55CG55qE5qC56IqC54K577yM5Y+v5Lul5piv5LiA5LiqanF1ZXJ55a+56LGh77yM5oiW6ICF5piv5re35ZCI5LqGIHNwb3JlLWtpdC1ldnQvZXZlbnRzIOaWueazleeahOWvueixoeOAglxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyDkuovku7bplK7lgLzlr7lcbiAqIEBwYXJhbSB7T2JqZWN0fSBiaW5kIOaMh+WumuS6i+S7tuWHveaVsOe7keWumueahOWvueixoe+8jOW/hemhu+S4uk1WQ+exu+eahOWunuS+i+OAglxuICovXG5cbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC9mb3JFYWNoJyk7XG5cbmZ1bmN0aW9uIGRlbGVnYXRlKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKSB7XG5cdHZhciBwcm94eTtcblx0dmFyIGRsZztcblx0aWYgKCFyb290KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmICghYmluZCB8fCAhJGlzRnVuY3Rpb24oYmluZC5wcm94eSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRwcm94eSA9IGJpbmQucHJveHkoKTtcblx0YWN0aW9uID0gYWN0aW9uID09PSAnb24nID8gJ29uJyA6ICdvZmYnO1xuXHRkbGcgPSBhY3Rpb24gPT09ICdvbicgPyAnZGVsZWdhdGUnIDogJ3VuZGVsZWdhdGUnO1xuXHRldmVudHMgPSAkYXNzaWduKHt9LCBldmVudHMpO1xuXG5cdCRmb3JFYWNoKGV2ZW50cywgZnVuY3Rpb24obWV0aG9kLCBoYW5kbGUpIHtcblx0XHR2YXIgc2VsZWN0b3I7XG5cdFx0dmFyIGV2ZW50O1xuXHRcdHZhciBmbnMgPSBbXTtcblx0XHRoYW5kbGUgPSBoYW5kbGUuc3BsaXQoL1xccysvKTtcblxuXHRcdGlmICh0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJykge1xuXHRcdFx0Zm5zID0gbWV0aG9kLnNwbGl0KC9cXHMrLykubWFwKGZ1bmN0aW9uKGZuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBwcm94eShmbmFtZSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKCRpc0Z1bmN0aW9uKG1ldGhvZCkpIHtcblx0XHRcdGZucyA9IFttZXRob2RdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXZlbnQgPSBoYW5kbGUucG9wKCk7XG5cblx0XHRpZiAoaGFuZGxlLmxlbmd0aCA+PSAxKSB7XG5cdFx0XHRzZWxlY3RvciA9IGhhbmRsZS5qb2luKCcgJyk7XG5cdFx0XHRpZiAoJGlzRnVuY3Rpb24ocm9vdFtkbGddKSkge1xuXHRcdFx0XHRmbnMuZm9yRWFjaChmdW5jdGlvbihmbikge1xuXHRcdFx0XHRcdHJvb3RbZGxnXShzZWxlY3RvciwgZXZlbnQsIGZuKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICgkaXNGdW5jdGlvbihyb290W2FjdGlvbl0pKSB7XG5cdFx0XHRmbnMuZm9yRWFjaChmdW5jdGlvbihmbikge1xuXHRcdFx0XHRyb290W2FjdGlvbl0oZXZlbnQsIGZuKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCIvKipcbiAqICMg5YW85a65IElFOCDnmoQgTVZDIOeugOWNleWunueOsFxuICogQG1vZHVsZSBzcG9yZS1raXQtbXZjXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9tdmNcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQubXZjLk1vZGVsKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LW12Y1xuICogdmFyICRtdmMgPSByZXF1aXJlKCdzcG9yZS1raXQtbXZjJyk7XG4gKiBjb25zb2xlLmluZm8oJG12Yy5Nb2RlbCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq57uE5Lu2XG4gKiB2YXIgJE1vZGVsID0gcmVxdWlyZSgnc3BvcmUta2l0LW12Yy9Nb2RlbCcpO1xuICovXG5cbmV4cG9ydHMua2xhc3MgPSByZXF1aXJlKCcuL2tsYXNzJyk7XG5leHBvcnRzLmRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuZXhwb3J0cy5CYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5leHBvcnRzLk1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpO1xuZXhwb3J0cy5WaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG4iLCIvKipcbiAqIGNsYXNzIOeahCBFUzUg5a6e546wXG4gKiAtIOS4uuS7o+eggemAmui/hyBlc2xpbnQg5qOA5p+l5YGa5LqG5Lqb5L+u5pS5XG4gKiBAbW9kdWxlIGtsYXNzXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQva2xhc3NcbiAqL1xuXG52YXIgZm5UZXN0ID0gKC94eXovKS50ZXN0KGZ1bmN0aW9uKCkgeyB2YXIgeHl6OyByZXR1cm4geHl6OyB9KSA/ICgvXFxic3VwclxcYi8pIDogKC8uKi8pO1xudmFyIHByb3RvID0gJ3Byb3RvdHlwZSc7XG5cbmZ1bmN0aW9uIGlzRm4obykge1xuXHRyZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIHdyYXAoaywgZm4sIHN1cHIpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0bXAgPSB0aGlzLnN1cHI7XG5cdFx0dGhpcy5zdXByID0gc3Vwcltwcm90b11ba107XG5cdFx0dmFyIHVuZGVmID0ge30uZmFicmljYXRlZFVuZGVmaW5lZDtcblx0XHR2YXIgcmV0ID0gdW5kZWY7XG5cdFx0dHJ5IHtcblx0XHRcdHJldCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdHRoaXMuc3VwciA9IHRtcDtcblx0XHR9XG5cdFx0cmV0dXJuIHJldDtcblx0fTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzcyh3aGF0LCBvLCBzdXByKSB7XG5cdGZvciAodmFyIGsgaW4gbykge1xuXHRcdGlmIChvLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHR3aGF0W2tdID0gKFxuXHRcdFx0XHRpc0ZuKG9ba10pXG5cdFx0XHRcdCYmIGlzRm4oc3Vwcltwcm90b11ba10pXG5cdFx0XHRcdCYmIGZuVGVzdC50ZXN0KG9ba10pXG5cdFx0XHQpID8gd3JhcChrLCBvW2tdLCBzdXByKSA6IG9ba107XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvLCBmcm9tU3ViKSB7XG5cdC8vIG11c3QgcmVkZWZpbmUgbm9vcCBlYWNoIHRpbWUgc28gaXQgZG9lc24ndCBpbmhlcml0IGZyb20gcHJldmlvdXMgYXJiaXRyYXJ5IGNsYXNzZXNcblx0dmFyIE5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXHROb29wW3Byb3RvXSA9IHRoaXNbcHJvdG9dO1xuXG5cdHZhciBzdXByID0gdGhpcztcblx0dmFyIHByb3RvdHlwZSA9IG5ldyBOb29wKCk7XG5cdHZhciBpc0Z1bmN0aW9uID0gaXNGbihvKTtcblx0dmFyIF9jb25zdHJ1Y3RvciA9IGlzRnVuY3Rpb24gPyBvIDogdGhpcztcblx0dmFyIF9tZXRob2RzID0gaXNGdW5jdGlvbiA/IHt9IDogbztcblxuXHRmdW5jdGlvbiBmbigpIHtcblx0XHRpZiAodGhpcy5pbml0aWFsaXplKSB7XG5cdFx0XHR0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGZyb21TdWIgfHwgaXNGdW5jdGlvbikge1xuXHRcdFx0XHRzdXByLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRfY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHRmbi5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0cHJvY2Vzcyhwcm90b3R5cGUsIG9iaiwgc3Vwcik7XG5cdFx0Zm5bcHJvdG9dID0gcHJvdG90eXBlO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdGZuLm1ldGhvZHMuY2FsbChmbiwgX21ldGhvZHMpLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZuO1xuXG5cdGZuLmV4dGVuZCA9IGV4dGVuZDtcblx0Zm4uc3RhdGljcyA9IGZ1bmN0aW9uKHNwZWMsIG9wdEZuKSB7XG5cdFx0c3BlYyA9IHR5cGVvZiBzcGVjID09PSAnc3RyaW5nJyA/IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialtzcGVjXSA9IG9wdEZuO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9KCkpIDogc3BlYztcblx0XHRwcm9jZXNzKHRoaXMsIHNwZWMsIHN1cHIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdGZuW3Byb3RvXS5pbXBsZW1lbnQgPSBmbi5zdGF0aWNzO1xuXG5cdHJldHVybiBmbjtcbn1cblxuZnVuY3Rpb24ga2xhc3Mobykge1xuXHRyZXR1cm4gZXh0ZW5kLmNhbGwoaXNGbihvKSA/IG8gOiBmdW5jdGlvbigpIHt9LCBvLCAxKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrbGFzcztcbiIsIi8qKlxuICog5qih5Z6L57G7OiDln7rnoYDlt6XljoLlhYPku7bnsbvvvIznlKjkuo7lgZrmlbDmja7ljIXoo4XvvIzmj5Dkvpvlj6/op4Llr5/nmoTmlbDmja7lr7nosaFcbiAqIC0g57un5om/6IeqIHNwb3JlLWtpdC1tdmMvYmFzZVxuICogQG1vZHVsZSBNb2RlbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDliJ3lp4vmlbDmja5cbiAqIEBleGFtcGxlXG4gKlx0dmFyIE1vZGVsID0gcmVxdWlyZSgnc3BvcmUta2l0LW12Yy9tb2RlbCcpO1xuICpcbiAqXHR2YXIgbTEgPSBuZXcgTW9kZWwoe1xuICpcdFx0YSA6IDFcbiAqXHR9KTtcbiAqXHRtMS5vbignY2hhbmdlOmEnLCBmdW5jdGlvbihwcmV2QSl7XG4gKlx0XHRjb25zb2xlLmluZm8ocHJldkEpO1x0Ly8gMVxuICpcdH0pO1xuICpcdG0xLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICpcdFx0Y29uc29sZS5pbmZvKCdtb2RlbCBjaGFuZ2VkJyk7XG4gKlx0fSk7XG4gKlx0bTEuc2V0KCdhJywgMik7XG4gKlxuICpcdHZhciBNeU1vZGVsID0gTW9kZWwuZXh0ZW5kKHtcbiAqXHRcdGRlZmF1bHRzIDoge1xuICpcdFx0XHRhIDogMixcbiAqXHRcdFx0YiA6IDJcbiAqXHRcdH0sXG4gKlx0XHRldmVudHMgOiB7XG4gKlx0XHRcdCdjaGFuZ2U6YScgOiAndXBkYXRlQidcbiAqXHRcdH0sXG4gKlx0XHR1cGRhdGVCIDogZnVuY3Rpb24oKXtcbiAqXHRcdFx0dGhpcy5zZXQoJ2InLCB0aGlzLmdldCgnYScpICsgMSk7XG4gKlx0XHR9XG4gKlx0fSk7XG4gKlxuICpcdHZhciBtMiA9IG5ldyBNeU1vZGVsKCk7XG4gKlx0Y29uc29sZS5pbmZvKG0yLmdldCgnYicpKTtcdC8vIDJcbiAqXG4gKlx0bTIuc2V0KCdhJywgMyk7XG4gKlx0Y29uc29sZS5pbmZvKG0yLmdldCgnYicpKTtcdC8vIDRcbiAqXG4gKlx0bTIuc2V0KCdiJywgNSk7XG4gKlx0Y29uc29sZS5pbmZvKG0yLmdldCgnYicpKTtcdC8vIDVcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xudmFyICRpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXknKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC9mb3JFYWNoJyk7XG52YXIgJGNsb25lRGVlcCA9IHJlcXVpcmUoJ2xvZGFzaC9jbG9uZURlZXAnKTtcbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuLy8g5pWw5o2u5bGe5oCn5ZCN56ewXG52YXIgREFUQSA9ICdfX2RhdGFfXyc7XG5cbnZhciBzZXRBdHRyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgZGF0YSA9IHRoaXNbREFUQV07XG5cdGlmICghZGF0YSkge1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgcHJldlZhbHVlID0gZGF0YVtrZXldO1xuXG5cdHZhciBwcm9jZXNzb3IgPSB0aGlzLnByb2Nlc3NvcnNba2V5XTtcblx0aWYgKHByb2Nlc3NvciAmJiAkaXNGdW5jdGlvbihwcm9jZXNzb3Iuc2V0KSkge1xuXHRcdHZhbHVlID0gcHJvY2Vzc29yLnNldCh2YWx1ZSk7XG5cdH1cblxuXHRpZiAodmFsdWUgIT09IHByZXZWYWx1ZSkge1xuXHRcdGRhdGFba2V5XSA9IHZhbHVlO1xuXHRcdHRoYXQuY2hhbmdlZCA9IHRydWU7XG5cdFx0dGhhdC50cmlnZ2VyKCdjaGFuZ2U6JyArIGtleSwgcHJldlZhbHVlKTtcblx0fVxufTtcblxudmFyIGdldEF0dHIgPSBmdW5jdGlvbihrZXkpIHtcblx0dmFyIHZhbHVlID0gdGhpc1tEQVRBXVtrZXldO1xuXHRpZiAoJGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XG5cdFx0dmFsdWUgPSAkY2xvbmVEZWVwKHZhbHVlKTtcblx0fSBlbHNlIGlmICgkaXNBcnJheSh2YWx1ZSkpIHtcblx0XHR2YWx1ZSA9ICRjbG9uZURlZXAodmFsdWUpO1xuXHR9XG5cblx0dmFyIHByb2Nlc3NvciA9IHRoaXMucHJvY2Vzc29yc1trZXldO1xuXHRpZiAocHJvY2Vzc29yICYmICRpc0Z1bmN0aW9uKHByb2Nlc3Nvci5nZXQpKSB7XG5cdFx0dmFsdWUgPSBwcm9jZXNzb3IuZ2V0KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciByZW1vdmVBdHRyID0gZnVuY3Rpb24oa2V5KSB7XG5cdGRlbGV0ZSB0aGlzW0RBVEFdW2tleV07XG5cdHRoaXMudHJpZ2dlcignY2hhbmdlOicgKyBrZXkpO1xufTtcblxudmFyIE1vZGVsID0gJGJhc2UuZXh0ZW5kKHtcblxuXHQvKipcblx0ICog5qih5Z6L55qE6buY6K6k5pWw5o2uXG5cdCAqIC0g57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG5cdCAqIEBuYW1lIE1vZGVsI2RlZmF1bHRzXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKi9cblx0ZGVmYXVsdHM6IHt9LFxuXG5cdC8qKlxuXHQgKiDmqKHlnovnmoTkuovku7bnu5HlrprliJfooajjgIJcblx0ICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcblx0ICogLSDlsL3ph4/lnKggZXZlbnRzIOWvueixoeWumuS5ieWxnuaAp+WFs+iBlOS6i+S7tuOAglxuXHQgKiAtIOS6i+S7tuW6lOW9k+S7heeUqOS6juiHqui6q+WxnuaAp+eahOWFs+iBlOi/kOeul+OAglxuXHQgKiAtIOS6i+S7tue7keWumuagvOW8j+WPr+S7peS4uu+8mlxuXHQgKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuXHQgKiAtIHsnZXZlbnQnOidtZXRob2QxIG1ldGhvZDInfVxuXHQgKiBAbmFtZSBNb2RlbCNldmVudHNcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqL1xuXHRldmVudHM6IHt9LFxuXG5cdC8qKlxuXHQgKiDmqKHlnovmlbDmja7nmoTpooTlpITnkIblmajjgIJcblx0ICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcblx0ICogQG5hbWUgTW9kZWwjcHJvY2Vzc29yc1xuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAbWVtYmVyb2YgTW9kZWxcblx0ICogQGV4YW1wbGVcblx0ICpcdHByb2Nlc3NvcnMgOiB7XG5cdCAqXHRcdG5hbWUgOiB7XG5cdCAqXHRcdFx0c2V0IDogZnVuY3Rpb24odmFsdWUpe1xuXHQgKlx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHQgKlx0XHRcdH0sXG5cdCAqXHRcdFx0Z2V0IDogZnVuY3Rpb24odmFsdWUpe1xuXHQgKlx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHQgKlx0XHRcdH1cblx0ICpcdFx0fVxuXHQgKlx0fVxuXHQqL1xuXHRwcm9jZXNzb3JzOiB7fSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dGhpc1tEQVRBXSA9IHt9O1xuXHRcdHRoaXMuZGVmYXVsdHMgPSAkYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzKTtcblx0XHR0aGlzLmV2ZW50cyA9ICRhc3NpZ24oe30sIHRoaXMuZXZlbnRzKTtcblx0XHR0aGlzLnByb2Nlc3NvcnMgPSAkYXNzaWduKHt9LCB0aGlzLnByb2Nlc3NvcnMpO1xuXHRcdHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuXG5cdFx0dGhpcy5idWlsZCgpO1xuXHRcdHRoaXMuZGVsZWdhdGUoJ29uJyk7XG5cdFx0dGhpcy5zZXRFdmVudHMoJ29uJyk7XG5cdFx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDmt7Hluqbmt7flkIjkvKDlhaXnmoTpgInpobnkuI7pu5jorqTpgInpobnvvIznhLblkI7mt7flkIjliLDmlbDmja7lr7nosaHkuK1cblx0ICogQG1ldGhvZCBNb2RlbCNzZXRPcHRpb25zXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuXHQgKi9cblx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpO1xuXHRcdHRoaXMuc3VwcihvcHRpb25zKTtcblx0XHR0aGlzLnNldChvcHRpb25zKTtcblx0fSxcblxuXHQvKipcblx0ICog57uR5a6aIGV2ZW50cyDlr7nosaHliJfkuL7nmoTkuovku7bjgILlnKjliJ3lp4vljJbml7boh6rliqjmiafooYzkuoYgdGhpcy5kZWxlZ2F0ZSgnb24nKeOAglxuXHQgKiBAbWV0aG9kIE1vZGVsI2RlbGVnYXRlXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprliqjkvZzmoIforrDjgILlj6/pgInvvJpbJ29uJywgJ29mZiddXG5cdCAqL1xuXHRkZWxlZ2F0ZTogZnVuY3Rpb24oYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpIHtcblx0XHRhY3Rpb24gPSBhY3Rpb24gfHwgJ29uJztcblx0XHRyb290ID0gcm9vdCB8fCB0aGlzO1xuXHRcdGV2ZW50cyA9IGV2ZW50cyB8fCB0aGlzLmV2ZW50cztcblx0XHRiaW5kID0gYmluZCB8fCB0aGlzO1xuXHRcdCRkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOaVsOaNrumihOWkhOeQhlxuXHQgKiBAbWV0aG9kIE1vZGVsI3Byb2Nlc3Ncblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg5qih5Z6L5bGe5oCn5ZCN56ew44CC5oiW6ICFSlNPTuaVsOaNruOAglxuXHQgKiBAcGFyYW0geyp9IFt2YWxdIOaVsOaNrlxuXHQgKi9cblx0cHJvY2VzczogZnVuY3Rpb24obmFtZSwgc3BlYykge1xuXHRcdHNwZWMgPSAkYXNzaWduKHtcblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdGdldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sIHNwZWMpO1xuXHRcdHRoaXMucHJvY2Vzc29yc1tuYW1lXSA9IHNwZWM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOiuvue9ruaooeWei+aVsOaNrlxuXHQgKiBAbWV0aG9kIE1vZGVsI3NldFxuXHQgKiBAbWVtYmVyb2YgTW9kZWxcblx0ICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBrZXkg5qih5Z6L5bGe5oCn5ZCN56ew44CC5oiW6ICFSlNPTuaVsOaNruOAglxuXHQgKiBAcGFyYW0geyp9IFt2YWxdIOaVsOaNrlxuXHQgKi9cblx0c2V0OiBmdW5jdGlvbihrZXksIHZhbCkge1xuXHRcdGlmICgkaXNQbGFpbk9iamVjdChrZXkpKSB7XG5cdFx0XHQkZm9yRWFjaChrZXksIGZ1bmN0aW9uKHYsIGspIHtcblx0XHRcdFx0c2V0QXR0ci5jYWxsKHRoaXMsIGssIHYpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRzZXRBdHRyLmNhbGwodGhpcywga2V5LCB2YWwpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5jaGFuZ2VkKSB7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuXHRcdFx0dGhpcy5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDojrflj5bmqKHlnovlr7nlupTlsZ7mgKfnmoTlgLznmoTmi7fotJ1cblx0ICogLSDlpoLmnpzkuI3kvKDlj4LmlbDvvIzliJnnm7TmjqXojrflj5bmlbTkuKrmqKHlnovmlbDmja7jgIJcblx0ICogLSDlpoLmnpzlgLzmmK/kuIDkuKrlr7nosaHvvIzliJnor6Xlr7nosaHkvJrooqvmt7Hmi7fotJ3jgIJcblx0ICogQG1ldGhvZCBNb2RlbCNnZXRcblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XSDmqKHlnovlsZ7mgKflkI3np7DjgIJcblx0ICogQHJldHVybnMgeyp9IOWxnuaAp+WQjeensOWvueW6lOeahOWAvFxuXHQgKi9cblx0Z2V0OiBmdW5jdGlvbihrZXkpIHtcblx0XHRpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGlmICghdGhpc1tEQVRBXSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZ2V0QXR0ci5jYWxsKHRoaXMsIGtleSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dmFyIGRhdGEgPSB7fTtcblx0XHRcdCRmb3JFYWNoKHRoaXMua2V5cygpLCBmdW5jdGlvbihrKSB7XG5cdFx0XHRcdGRhdGFba10gPSBnZXRBdHRyLmNhbGwodGhpcywgayk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDojrflj5bmqKHlnovkuIrorr7nva7nmoTmiYDmnInplK7lkI1cblx0ICogQG1ldGhvZCBNb2RlbCNrZXlzXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IOWxnuaAp+WQjeensOWIl+ihqFxuXHQgKi9cblx0a2V5czogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbREFUQV0gfHwge30pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDliKDpmaTmqKHlnovkuIrnmoTkuIDkuKrplK5cblx0ICogQG1ldGhvZCBNb2RlbCNyZW1vdmVcblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg5bGe5oCn5ZCN56ew44CCXG5cdCAqL1xuXHRyZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHJlbW92ZUF0dHIuY2FsbCh0aGlzLCBrZXkpO1xuXHRcdHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOa4hemZpOaooeWei+S4reaJgOacieaVsOaNrlxuXHQgKiBAbWV0aG9kIE1vZGVsI2NsZWFyXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKi9cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdE9iamVjdC5rZXlzKHRoaXNbREFUQV0pLmZvckVhY2gocmVtb3ZlQXR0ciwgdGhpcyk7XG5cdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcblx0fSxcblxuXHQvKipcblx0ICog6ZSA5q+B5qih5Z6L77yM5LiN5Lya6Kem5Y+R5Lu75L2VY2hhbmdl5LqL5Lu244CCXG5cdCAqIC0g5qih5Z6L6ZSA5q+B5ZCO77yM5peg5rOV5YaN6K6+572u5Lu75L2V5pWw5o2u44CCXG5cdCAqIEBtZXRob2QgTW9kZWwjZGVzdHJveVxuXHQgKiBAbWVtYmVyb2YgTW9kZWxcblx0ICovXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdHRoaXMuZGVsZWdhdGUoJ29mZicpO1xuXHRcdHRoaXMuc3VwcigpO1xuXHRcdHRoaXMuY2xlYXIoKTtcblx0XHR0aGlzW0RBVEFdID0gbnVsbDtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhc3NpZ25WYWx1ZWAgZXhjZXB0IHRoYXQgaXQgZG9lc24ndCBhc3NpZ25cbiAqIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWVxKG9iamVjdFtrZXldLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduTWVyZ2VWYWx1ZTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25JbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbkluKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgY29weU9iamVjdChzb3VyY2UsIGtleXNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25JbjtcbiIsInZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGFzc2lnblZhbHVlYCBhbmQgYGFzc2lnbk1lcmdlVmFsdWVgIHdpdGhvdXRcbiAqIHZhbHVlIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycgJiYgZGVmaW5lUHJvcGVydHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgICAnZW51bWVyYWJsZSc6IHRydWUsXG4gICAgICAndmFsdWUnOiB2YWx1ZSxcbiAgICAgICd3cml0YWJsZSc6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnblZhbHVlO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBiYXNlQXNzaWduSW4gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduSW4nKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgY29weVN5bWJvbHMgPSByZXF1aXJlKCcuL19jb3B5U3ltYm9scycpLFxuICAgIGNvcHlTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19jb3B5U3ltYm9sc0luJyksXG4gICAgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKSxcbiAgICBnZXRBbGxLZXlzSW4gPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzSW4nKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpbml0Q2xvbmVBcnJheSA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUFycmF5JyksXG4gICAgaW5pdENsb25lQnlUYWcgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc01hcCA9IHJlcXVpcmUoJy4vaXNNYXAnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1NldCA9IHJlcXVpcmUoJy4vaXNTZXQnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoaXNNYXAodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBrZXlzRnVuYyA9IGlzRnVsbFxuICAgID8gKGlzRmxhdCA/IGdldEFsbEtleXNJbiA6IGdldEFsbEtleXMpXG4gICAgOiAoaXNGbGF0ID8ga2V5c0luIDoga2V5cyk7XG5cbiAgdmFyIHByb3BzID0gaXNBcnIgPyB1bmRlZmluZWQgOiBrZXlzRnVuYyh2YWx1ZSk7XG4gIGFycmF5RWFjaChwcm9wcyB8fCB2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3ViVmFsdWU7XG4gICAgICBzdWJWYWx1ZSA9IHZhbHVlW2tleV07XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgYXNzaWduVmFsdWUocmVzdWx0LCBrZXksIGJhc2VDbG9uZShzdWJWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNsb25lO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNyZWF0ZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhc3NpZ25pbmdcbiAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG8gVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG52YXIgYmFzZUNyZWF0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gb2JqZWN0KCkge31cbiAgcmV0dXJuIGZ1bmN0aW9uKHByb3RvKSB7XG4gICAgaWYgKCFpc09iamVjdChwcm90bykpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKG9iamVjdENyZWF0ZSkge1xuICAgICAgcmV0dXJuIG9iamVjdENyZWF0ZShwcm90byk7XG4gICAgfVxuICAgIG9iamVjdC5wcm90b3R5cGUgPSBwcm90bztcbiAgICB2YXIgcmVzdWx0ID0gbmV3IG9iamVjdDtcbiAgICBvYmplY3QucHJvdG90eXBlID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDcmVhdGU7XG4iLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0QWxsS2V5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXBgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IG1hcFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXA7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1NldGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzU2V0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gc2V0VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1NldDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXNJbiA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5c0luKG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5c0luKG9iamVjdCk7XG4gIH1cbiAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzSW47XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBiYXNlTWVyZ2VEZWVwID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlRGVlcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyksXG4gICAgc2FmZUdldCA9IHJlcXVpcmUoJy4vX3NhZmVHZXQnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKG9iamVjdCA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJhc2VGb3Ioc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIGJhc2VNZXJnZSwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgICAgPyBjdXN0b21pemVyKHNhZmVHZXQob2JqZWN0LCBrZXkpLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH0sIGtleXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwidmFyIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5JyksXG4gICAgc2FmZUdldCA9IHJlcXVpcmUoJy4vX3NhZmVHZXQnKSxcbiAgICB0b1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi90b1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFjaykge1xuICB2YXIgb2JqVmFsdWUgPSBzYWZlR2V0KG9iamVjdCwga2V5KSxcbiAgICAgIHNyY1ZhbHVlID0gc2FmZUdldChzb3VyY2UsIGtleSksXG4gICAgICBzdGFja2VkID0gc3RhY2suZ2V0KHNyY1ZhbHVlKTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHN0YWNrZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIHZhciBpc0NvbW1vbiA9IG5ld1ZhbHVlID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgdmFyIGlzQXJyID0gaXNBcnJheShzcmNWYWx1ZSksXG4gICAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiBpc0J1ZmZlcihzcmNWYWx1ZSksXG4gICAgICAgIGlzVHlwZWQgPSAhaXNBcnIgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkoc3JjVmFsdWUpO1xuXG4gICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnIgfHwgaXNCdWZmIHx8IGlzVHlwZWQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNBcnJheUxpa2VPYmplY3Qob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gY29weUFycmF5KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQnVmZikge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lQnVmZmVyKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzVHlwZWQpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZVR5cGVkQXJyYXkoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc3JjVmFsdWUpIHx8IGlzQXJndW1lbnRzKHNyY1ZhbHVlKSkge1xuICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIGlmIChpc0FyZ3VtZW50cyhvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0b1BsYWluT2JqZWN0KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc09iamVjdChvYmpWYWx1ZSkgfHwgaXNGdW5jdGlvbihvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpbml0Q2xvbmVPYmplY3Qoc3JjVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHN0YWNrLnNldChzcmNWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIG1lcmdlRnVuYyhuZXdWYWx1ZSwgc3JjVmFsdWUsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgc3RhY2tbJ2RlbGV0ZSddKHNyY1ZhbHVlKTtcbiAgfVxuICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlRGVlcDtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcbiIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgZGF0YSB2aWV3LlxuICovXG5mdW5jdGlvbiBjbG9uZURhdGFWaWV3KGRhdGFWaWV3LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIoZGF0YVZpZXcuYnVmZmVyKSA6IGRhdGFWaWV3LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGBzeW1ib2xgIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHN5bWJvbCBUaGUgc3ltYm9sIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzeW1ib2wgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbG9uZVN5bWJvbChzeW1ib2wpIHtcbiAgcmV0dXJuIHN5bWJvbFZhbHVlT2YgPyBPYmplY3Qoc3ltYm9sVmFsdWVPZi5jYWxsKHN5bWJvbCkpIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVTeW1ib2w7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVR5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpO1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICB2YXIgaXNOZXcgPSAhb2JqZWN0O1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9scyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBhbmQgaW5oZXJpdGVkIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzSW4oc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgPyAobGVuZ3RoLS0sIGN1c3RvbWl6ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBpbmRleCwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0luLCBnZXRTeW1ib2xzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXNJbjtcbiIsInZhciBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hcERhdGE7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQcm90b3R5cGU7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCJ2YXIgYXJyYXlGaWx0ZXIgPSByZXF1aXJlKCcuL19hcnJheUZpbHRlcicpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYXJyYXlGaWx0ZXIobmF0aXZlR2V0U3ltYm9scyhvYmplY3QpLCBmdW5jdGlvbihzeW1ib2wpIHtcbiAgICByZXR1cm4gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTeW1ib2xzO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9sc0luID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB3aGlsZSAob2JqZWN0KSB7XG4gICAgYXJyYXlQdXNoKHJlc3VsdCwgZ2V0U3ltYm9scyhvYmplY3QpKTtcbiAgICBvYmplY3QgPSBnZXRQcm90b3R5cGUob2JqZWN0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTeW1ib2xzSW47XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWYWx1ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hIYXM7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyksXG4gICAgY2xvbmVEYXRhVmlldyA9IHJlcXVpcmUoJy4vX2Nsb25lRGF0YVZpZXcnKSxcbiAgICBjbG9uZVJlZ0V4cCA9IHJlcXVpcmUoJy4vX2Nsb25lUmVnRXhwJyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTWFwYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBgU2V0YCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lQXJyYXlCdWZmZXIob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgcmV0dXJuIGNsb25lRGF0YVZpZXcob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBmbG9hdDMyVGFnOiBjYXNlIGZsb2F0NjRUYWc6XG4gICAgY2FzZSBpbnQ4VGFnOiBjYXNlIGludDE2VGFnOiBjYXNlIGludDMyVGFnOlxuICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVUeXBlZEFycmF5KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lUmVnRXhwKG9iamVjdCk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgcmV0dXJuIGNsb25lU3ltYm9sKG9iamVjdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuXG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlID09ICdudW1iZXInIHx8XG4gICAgICAodHlwZSAhPSAnc3ltYm9sJyAmJiByZUlzVWludC50ZXN0KHZhbHVlKSkpICYmXG4gICAgICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5c0luO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCwgdW5sZXNzIGBrZXlgIGlzIFwiX19wcm90b19fXCIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzYWZlR2V0KG9iamVjdCwga2V5KSB7XG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FmZUdldDtcbiIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUFzc2lnbmVyJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICogZGVzdGluYXRpb24gb2JqZWN0LiBTb3VyY2Ugb2JqZWN0cyBhcmUgYXBwbGllZCBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gKiBTdWJzZXF1ZW50IHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHBzOi8vbWRuLmlvL09iamVjdC9hc3NpZ24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAc2VlIF8uYXNzaWduSW5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIEJhcigpIHtcbiAqICAgdGhpcy5jID0gMztcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmIgPSAyO1xuICogQmFyLnByb3RvdHlwZS5kID0gNDtcbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMCB9LCBuZXcgRm9vLCBuZXcgQmFyKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYyc6IDMgfVxuICovXG52YXIgYXNzaWduID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgaWYgKGlzUHJvdG90eXBlKHNvdXJjZSkgfHwgaXNBcnJheUxpa2Uoc291cmNlKSkge1xuICAgIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG4iLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uY2xvbmVgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGNsb25lcyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZWN1cnNpdmVseSBjbG9uZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkZWVwIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZVxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICdhJzogMSB9LCB7ICdiJzogMiB9XTtcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmVEZWVwKG9iamVjdHMpO1xuICogY29uc29sZS5sb2coZGVlcFswXSA9PT0gb2JqZWN0c1swXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBjbG9uZURlZXAodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgQ0xPTkVfREVFUF9GTEFHIHwgQ0xPTkVfU1lNQk9MU19GTEFHKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURlZXA7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZU9iamVjdDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCJ2YXIgYmFzZUlzTWFwID0gcmVxdWlyZSgnLi9fYmFzZUlzTWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc01hcCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzTWFwO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTWFwYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc01hcChuZXcgTWFwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTWFwKG5ldyBXZWFrTWFwKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc01hcCA9IG5vZGVJc01hcCA/IGJhc2VVbmFyeShub2RlSXNNYXApIDogYmFzZUlzTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFwO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBpbmZlciB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuICovXG52YXIgb2JqZWN0Q3RvclN0cmluZyA9IGZ1bmNUb1N0cmluZy5jYWxsKE9iamVjdCk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC44LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QobmV3IEZvbyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpIHx8IGJhc2VHZXRUYWcodmFsdWUpICE9IG9iamVjdFRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcHJvdG8gPSBnZXRQcm90b3R5cGUodmFsdWUpO1xuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgQ3RvciA9IGhhc093blByb3BlcnR5LmNhbGwocHJvdG8sICdjb25zdHJ1Y3RvcicpICYmIHByb3RvLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yIGluc3RhbmNlb2YgQ3RvciAmJlxuICAgIGZ1bmNUb1N0cmluZy5jYWxsKEN0b3IpID09IG9iamVjdEN0b3JTdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQbGFpbk9iamVjdDtcbiIsInZhciBiYXNlSXNTZXQgPSByZXF1aXJlKCcuL19iYXNlSXNTZXQnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzU2V0ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNTZXQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTZXRgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU2V0KG5ldyBTZXQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTZXQobmV3IFdlYWtTZXQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzU2V0ID0gbm9kZUlzU2V0ID8gYmFzZVVuYXJ5KG5vZGVJc1NldCkgOiBiYXNlSXNTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTZXQ7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzSW4gPSByZXF1aXJlKCcuL19iYXNlS2V5c0luJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuL19iYXNlTWVyZ2UnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5hc3NpZ25gIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IG1lcmdlcyBvd24gYW5kXG4gKiBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyBpbnRvIHRoZVxuICogZGVzdGluYXRpb24gb2JqZWN0LiBTb3VyY2UgcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgYXJlXG4gKiBza2lwcGVkIGlmIGEgZGVzdGluYXRpb24gdmFsdWUgZXhpc3RzLiBBcnJheSBhbmQgcGxhaW4gb2JqZWN0IHByb3BlcnRpZXNcbiAqIGFyZSBtZXJnZWQgcmVjdXJzaXZlbHkuIE90aGVyIG9iamVjdHMgYW5kIHZhbHVlIHR5cGVzIGFyZSBvdmVycmlkZGVuIGJ5XG4gKiBhc3NpZ25tZW50LiBTb3VyY2Ugb2JqZWN0cyBhcmUgYXBwbGllZCBmcm9tIGxlZnQgdG8gcmlnaHQuIFN1YnNlcXVlbnRcbiAqIHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjUuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0ge1xuICogICAnYSc6IFt7ICdiJzogMiB9LCB7ICdkJzogNCB9XVxuICogfTtcbiAqXG4gKiB2YXIgb3RoZXIgPSB7XG4gKiAgICdhJzogW3sgJ2MnOiAzIH0sIHsgJ2UnOiA1IH1dXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2Uob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB7ICdhJzogW3sgJ2InOiAyLCAnYyc6IDMgfSwgeyAnZCc6IDQsICdlJzogNSB9XSB9XG4gKi9cbnZhciBtZXJnZSA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCkge1xuICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5ub29wKTtcbiAqIC8vID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZF1cbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub29wO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViQXJyYXk7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcGxhaW4gb2JqZWN0IGZsYXR0ZW5pbmcgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nXG4gKiBrZXllZCBwcm9wZXJ0aWVzIG9mIGB2YWx1ZWAgdG8gb3duIHByb3BlcnRpZXMgb2YgdGhlIHBsYWluIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBwbGFpbiBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgXy50b1BsYWluT2JqZWN0KG5ldyBGb28pKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHRvUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3QodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGxhaW5PYmplY3Q7XG4iLCIvKipcbiAqIOinhuWbvuexuzog5Z+656GA5bel5Y6C5YWD5Lu257G777yM55So5LqO5a+56KeG5Zu+57uE5Lu255qE5YyF6KOFXG4gKiAtIOS+nei1liBqUXVlcnkvWmVwdG9cbiAqIC0g57un5om/6IeqIHNwb3JlLWtpdC1tdmMvYmFzZVxuICogQG1vZHVsZSBWaWV3XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBbb3B0aW9ucy5ub2RlXSDpgInmi6nlmajlrZfnrKbkuLLvvIzmiJbogIVET03lhYPntKDvvIzmiJbogIVqcXVlcnnlr7nosaHvvIznlKjkuo7mjIflrprop4blm77nmoTmoLnoioLngrnjgIJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50ZW1wbGF0ZV0g6KeG5Zu+55qE5qih5p2/5a2X56ym5Liy77yM5Lmf5Y+v5Lul5piv5Liq5a2X56ym5Liy5pWw57uE77yM5Yib5bu66KeG5Zu+RE9N5pe25Lya6Ieq5Yqoam9pbuS4uuWtl+espuS4suWkhOeQhuOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmV2ZW50c10g55So5LqO6KaG55uW5Luj55CG5LqL5Lu25YiX6KGo44CCXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucm9sZV0g6KeS6Imy5a+56LGh5pig5bCE6KGo77yM5Y+v5oyH5a6acm9sZeaWueazlei/lOWbnueahGpxdWVyeeWvueixoeOAglxuICogQGV4YW1wbGVcbiAqXHR2YXIgVmlldyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1tdmMvdmlldycpO1xuICpcdHZhciBUUEwgPSB7XG4gKlx0XHRib3ggOiBbXG4gKlx0XHRcdCc8ZGl2PicsXG4gKlx0XHRcdFx0JzxidXR0b24gcm9sZT1cImJ1dHRvblwiPjwvYnV0dG9uPicsXG4gKlx0XHRcdCc8L2Rpdj4nXG4gKlx0XHRdXG4gKlx0fTtcbiAqXG4gKlx0dmFyIFRlc3RWaWV3ID0gVmlldy5leHRlbmQoe1xuICpcdFx0ZGVmYXVsdHMgOiB7XG4gKlx0XHRcdHRlbXBsYXRlIDogVFBMLmJveFxuICpcdFx0fSxcbiAqXHRcdGV2ZW50cyA6IHtcbiAqXHRcdFx0J2J1dHRvbiBjbGljaycgOiAnbWV0aG9kMSdcbiAqXHRcdH0sXG4gKlx0XHRidWlsZCA6IGZ1bmN0aW9uKCl7XG4gKlx0XHRcdHRoaXMucm9sZSgncm9vdCcpLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICpcdFx0fSxcbiAqXHRcdG1ldGhvZDEgOiBmdW5jdGlvbihldnQpe1xuICpcdFx0XHRjb25zb2xlLmluZm8oMSk7XG4gKlx0XHR9LFxuICpcdFx0bWV0aG9kMiA6IGZ1bmN0aW9uKGV2dCl7XG4gKlx0XHRcdGNvbnNvbGUuaW5mbygyKTtcbiAqXHRcdH1cbiAqXHR9KTtcbiAqXG4gKlx0dmFyIG9iajEgPSBuZXcgVGVzdFZpZXcoKTtcbiAqXHR2YXIgb2JqMiA9IG5ldyBUZXN0Vmlldyh7XG4gKlx0XHRldmVudHMgOiB7XG4gKlx0XHRcdCdidXR0b24gY2xpY2snIDogJ21ldGhvZDInXG4gKlx0XHR9XG4gKlx0fSk7XG4gKlxuICpcdG9iajEucm9sZSgnYnV0dG9uJykudHJpZ2dlcignY2xpY2snKTtcdC8vIDFcbiAqXHRvYmoyLnJvbGUoJ2J1dHRvbicpLnRyaWdnZXIoJ2NsaWNrJyk7XHQvLyAyXG4gKi9cblxudmFyICRiYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG52YXIgJGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuXG5mdW5jdGlvbiBnZXQkKCkge1xuXHRyZXR1cm4gKHdpbmRvdy4kIHx8IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbn1cblxuLy8g6I635Y+W6KeG5Zu+55qE5qC56IqC54K5XG52YXIgZ2V0Um9vdCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgJCA9IGdldCQoKTtcblx0dmFyIGNvbmYgPSB0aGlzLmNvbmY7XG5cdHZhciB0ZW1wbGF0ZSA9IGNvbmYudGVtcGxhdGU7XG5cdHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG5cdHZhciByb290ID0gbm9kZXMucm9vdDtcblx0aWYgKCFyb290KSB7XG5cdFx0aWYgKGNvbmYubm9kZSkge1xuXHRcdFx0cm9vdCA9ICQoY29uZi5ub2RlKTtcblx0XHR9XG5cdFx0aWYgKCFyb290IHx8ICFyb290Lmxlbmd0aCkge1xuXHRcdFx0aWYgKCQudHlwZSh0ZW1wbGF0ZSkgPT09ICdhcnJheScpIHtcblx0XHRcdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5qb2luKCcnKTtcblx0XHRcdH1cblx0XHRcdHJvb3QgPSAkKHRlbXBsYXRlKTtcblx0XHR9XG5cdFx0bm9kZXMucm9vdCA9IHJvb3Q7XG5cdH1cblx0cmV0dXJuIHJvb3Q7XG59O1xuXG52YXIgVmlldyA9ICRiYXNlLmV4dGVuZCh7XG5cdC8qKlxuXHQgKiDnsbvnmoTpu5jorqTpgInpobnlr7nosaHvvIznu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcblx0ICogQG5hbWUgVmlldyNkZWZhdWx0c1xuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAbWVtYmVyb2YgVmlld1xuXHQgKi9cblx0ZGVmYXVsdHM6IHtcblx0XHRub2RlOiAnJyxcblx0XHR0ZW1wbGF0ZTogJycsXG5cdFx0ZXZlbnRzOiB7fSxcblx0XHRyb2xlOiB7fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDop4blm77nmoTku6PnkIbkuovku7bnu5HlrprliJfooajvvIznu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcblx0ICogLSDkuovku7bnu5HlrprmoLzlvI/lj6/ku6XkuLrvvJpcblx0ICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kJ31cblx0ICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cblx0ICogQG5hbWUgVmlldyNldmVudHNcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICovXG5cdGV2ZW50czoge30sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHRoaXMubm9kZXMgPSB7fTtcblxuXHRcdHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblx0XHR0aGlzLmJ1aWxkKCk7XG5cdFx0dGhpcy5kZWxlZ2F0ZSgnb24nKTtcblx0XHR0aGlzLnNldEV2ZW50cygnb24nKTtcblx0fSxcblxuXHQvKipcblx0ICog5rex5bqm5re35ZCI5Lyg5YWl55qE6YCJ6aG55LiO6buY6K6k6YCJ6aG577yM5re35ZCI5a6M5oiQ55qE6YCJ6aG55a+56LGh5Y+v6YCa6L+HIHRoaXMuY29uZiDlsZ7mgKforr/pl65cblx0ICogQG1ldGhvZCBWaWV3I3NldE9wdGlvbnNcblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcblx0ICovXG5cdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR2YXIgJCA9IGdldCQoKTtcblx0XHR0aGlzLmNvbmYgPSB0aGlzLmNvbmYgfHwgJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZGVmYXVsdHMpO1xuXHRcdGlmICghJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG5cdFx0XHRvcHRpb25zID0ge307XG5cdFx0fVxuXHRcdCQuZXh0ZW5kKHRydWUsIHRoaXMuY29uZiwgb3B0aW9ucyk7XG5cdFx0dGhpcy5ldmVudHMgPSAkLmV4dGVuZCh7fSwgdGhpcy5ldmVudHMsIG9wdGlvbnMuZXZlbnRzKTtcblx0fSxcblxuXHQvKipcblx0ICog57uR5a6aIGV2ZW50cyDlr7nosaHliJfkuL7nmoTkuovku7bjgIJcblx0ICogLSDlnKjliJ3lp4vljJbml7boh6rliqjmiafooYzkuoYgdGhpcy5kZWxlZ2F0ZSgnb24nKeOAglxuXHQgKiBAbWV0aG9kIFZpZXcjZGVsZWdhdGVcblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICogQHNlZSBzcG9yZS1raXQtbXZjL2RlbGVnYXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBbYWN0aW9uPSdvbiddIOe7keWumuWKqOS9nOagh+iusOOAguWPr+mAie+8mlsnb24nLCAnb2ZmJ11cblx0ICovXG5cdGRlbGVnYXRlOiBmdW5jdGlvbihhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCkge1xuXHRcdGFjdGlvbiA9IGFjdGlvbiB8fCAnb24nO1xuXHRcdHJvb3QgPSByb290IHx8IHRoaXMucm9sZSgncm9vdCcpO1xuXHRcdGV2ZW50cyA9IGV2ZW50cyB8fCB0aGlzLmV2ZW50cztcblx0XHRiaW5kID0gYmluZCB8fCB0aGlzO1xuXHRcdCRkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOiOt+WPliAvIOiuvue9ruinkuiJsuWvueixoeaMh+WumueahCBqUXVlcnkg5a+56LGh44CCXG5cdCAqIC0g5rOo5oSP77ya6I635Y+W5Yiw6KeS6Imy5YWD57Sg5ZCO77yM6K+lIGpRdWVyeSDlr7nosaHkvJrnvJPlrZjlnKjop4blm77lr7nosaHkuK1cblx0ICogQG1ldGhvZCBWaWV3I3JvbGVcblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICogQHBhcmFtIHtTdHJpbmd9IG5hbWUg6KeS6Imy5a+56LGh5ZCN56ewXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbZWxlbWVudF0g6KeS6Imy5a+56LGh5oyH5a6a55qEZG9t5YWD57Sg5oiW6ICFIGpRdWVyeSDlr7nosaHjgIJcblx0ICogQHJldHVybnMge09iamVjdH0g6KeS6Imy5ZCN5a+55bqU55qEIGpRdWVyeSDlr7nosaHjgIJcblx0ICovXG5cdHJvbGU6IGZ1bmN0aW9uKG5hbWUsIGVsZW1lbnQpIHtcblx0XHR2YXIgJCA9IGdldCQoKTtcblx0XHR2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuXHRcdHZhciByb290ID0gZ2V0Um9vdC5jYWxsKHRoaXMpO1xuXHRcdHZhciByb2xlID0gdGhpcy5jb25mLnJvbGUgfHwge307XG5cdFx0aWYgKCFlbGVtZW50KSB7XG5cdFx0XHRpZiAobm9kZXNbbmFtZV0pIHtcblx0XHRcdFx0ZWxlbWVudCA9IG5vZGVzW25hbWVdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUgPT09ICdyb290Jykge1xuXHRcdFx0XHRlbGVtZW50ID0gcm9vdDtcblx0XHRcdH0gZWxzZSBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQubGVuZ3RoKSB7XG5cdFx0XHRcdGlmIChyb2xlW25hbWVdKSB7XG5cdFx0XHRcdFx0ZWxlbWVudCA9IHJvb3QuZmluZChyb2xlW25hbWVdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtZW50ID0gcm9vdC5maW5kKCdbcm9sZT1cIicgKyBuYW1lICsgJ1wiXScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5vZGVzW25hbWVdID0gZWxlbWVudDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cdFx0XHRub2Rlc1tuYW1lXSA9IGVsZW1lbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDmuIXpmaTop4blm77nvJPlrZjnmoTop5LoibLlr7nosaFcblx0ICogQG1ldGhvZCBWaWV3I3Jlc2V0Um9sZXNcblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICovXG5cdHJlc2V0Um9sZXM6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkID0gZ2V0JCgpO1xuXHRcdHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG5cdFx0JC5lYWNoKG5vZGVzLCBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRpZiAobmFtZSAhPT0gJ3Jvb3QnKSB7XG5cdFx0XHRcdG5vZGVzW25hbWVdID0gbnVsbDtcblx0XHRcdFx0ZGVsZXRlIG5vZGVzW25hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDplIDmr4Hop4blm77vvIzph4rmlL7lhoXlrZhcblx0ICogQG1ldGhvZCBWaWV3I2Rlc3Ryb3lcblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICovXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZGVsZWdhdGUoJ29mZicpO1xuXHRcdHRoaXMuc3VwcigpO1xuXHRcdHRoaXMucmVzZXRSb2xlcygpO1xuXHRcdHRoaXMubm9kZXMgPSB7fTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcbiIsIi8qKlxuICog5pWw5a2X55qE5Y2D5YiG5L2N6YCX5Y+35YiG6ZqU6KGo56S65rOVXG4gKiAtIElFOCDnmoQgdG9Mb2NhbFN0cmluZyDnu5nlh7rkuoblsI/mlbDngrnlkI4y5L2NOiBOLjAwXG4gKiBAbWV0aG9kIGNvbW1hXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjkwMTEwMi9ob3ctdG8tcHJpbnQtYS1udW1iZXItd2l0aC1jb21tYXMtYXMtdGhvdXNhbmRzLXNlcGFyYXRvcnMtaW4tamF2YXNjcmlwdFxuICogQHBhcmFtIHtOdW1iZXJ9IG51bSDmlbDlrZdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOWNg+WIhuS9jeihqOekuueahOaVsOWtl1xuICogQGV4YW1wbGVcbiAqIGNvbW1hKDEyMzQ1NjcpOyAvLycxLDIzNCw1NjcnXG4gKi9cblxuZnVuY3Rpb24gY29tbWEgKG51bSkge1xuXHR2YXIgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuXHRwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG5cdHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tbWE7XG4iLCIvKipcbiAqICMg5aSE55CG5pWw5a2X77yM5pWw5o2u6L2s5o2iXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC1udW1cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL251bVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5udW0ubGltaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQtbnVtXG4gKiB2YXIgJG51bSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1udW0nKTtcbiAqIGNvbnNvbGUuaW5mbygkbnVtLmxpbWl0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkbGltaXQgPSByZXF1aXJlKCdzcG9yZS1raXQtbnVtL2xpbWl0Jyk7XG4gKi9cblxuZXhwb3J0cy5jb21tYSA9IHJlcXVpcmUoJy4vY29tbWEnKTtcbmV4cG9ydHMuZml4VG8gPSByZXF1aXJlKCcuL2ZpeFRvJyk7XG5leHBvcnRzLmxpbWl0ID0gcmVxdWlyZSgnLi9saW1pdCcpO1xuZXhwb3J0cy5udW1lcmljYWwgPSByZXF1aXJlKCcuL251bWVyaWNhbCcpO1xuIiwiLyoqXG4gKiDpmZDliLbmlbDlrZflnKjkuIDkuKrojIPlm7TlhoVcbiAqIEBtZXRob2QgbGltaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSBudW0g6KaB6ZmQ5Yi255qE5pWw5a2XXG4gKiBAcGFyYW0ge051bWJlcn0gbWluIOacgOWwj+i+ueeVjOaVsOWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IG1heCDmnIDlpKfovrnnlYzmlbDlgLxcbiAqIEByZXR1cm4ge051bWJlcn0g57uP6L+H6ZmQ5Yi255qE5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogbGltaXQoMSwgNSwgMTApOyAvLyA1XG4gKiBsaW1pdCg2LCA1LCAxMCk7IC8vIDZcbiAqIGxpbWl0KDExLCA1LCAxMCk7IC8vIDEwXG4gKi9cblxuZnVuY3Rpb24gbGltaXQgKG51bSwgbWluLCBtYXgpIHtcblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG51bSwgbWluKSwgbWF4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaW1pdDtcbiIsIi8qKlxuICog5bCG5pWw5o2u57G75Z6L6L2s5Li65pW05pWw5pWw5a2X77yM6L2s5o2i5aSx6LSl5YiZ6L+U5Zue5LiA5Liq6buY6K6k5YC8XG4gKiBAbWV0aG9kIG51bWVyaWNhbFxuICogQHBhcmFtIHsqfSBzdHIg6KaB6L2s5o2i55qE5pWw5o2uXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlZj0wXSDovazmjaLlpLHotKXml7bnmoTpu5jorqTlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3lzPTEwXSDov5vliLZcbiAqIEByZXR1cm4ge051bWJlcn0g6L2s5o2i6ICM5b6X55qE5pW05pWwXG4gKiBAZXhhbXBsZVxuICogbnVtZXJpY2FsKCcxMHgnKTsgLy8gMTBcbiAqIG51bWVyaWNhbCgneDEwJyk7IC8vIDBcbiAqL1xuXG5mdW5jdGlvbiBudW1lcmljYWwgKHN0ciwgZGVmLCBzeXMpIHtcblx0ZGVmID0gZGVmIHx8IDA7XG5cdHN5cyA9IHN5cyB8fCAxMDtcblx0cmV0dXJuIHBhcnNlSW50KHN0ciwgc3lzKSB8fCBkZWY7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbnVtZXJpY2FsO1xuIiwiLyoqXG4gKiDopobnm5blr7nosaHvvIzkuI3mt7vliqDmlrDnmoTplK5cbiAqIEBtZXRob2QgY292ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3Qg6KaB6KaG55uW55qE5a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSDopoHopobnm5bnmoTlsZ7mgKfplK7lgLzlr7lcbiAqIEByZXR1cm5zIHtPYmplY3R9IOimhuebluWQjueahOa6kOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciBvYmogPSB7YTogMSwgYjogMn07XG4gKiBjb25zb2xlLmluZm8oY292ZXIob2JqLHtiOiAzLCBjOiA0fSkpO1x0Ly97YTogMSwgYjogM31cbiAqL1xuXG5mdW5jdGlvbiBjb3ZlcigpIHtcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHR2YXIgb2JqZWN0ID0gYXJncy5zaGlmdCgpO1xuXHRpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QuaGFzT3duUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cdFx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGlmIChpdGVtICYmIHR5cGVvZiBpdGVtLmhhc093blByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdFx0XHRpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0XHRvYmplY3Rba2V5XSA9IGl0ZW1ba2V5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblxuXHRyZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvdmVyO1xuIiwiLyoqXG4gKiDmn6Xmib7lr7nosaHot6/lvoTkuIrnmoTlgLxcbiAqIEBtZXRob2QgZmluZFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCDopoHmn6Xmib7nmoTlr7nosaFcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIOimgeafpeaJvueahOi3r+W+hFxuICogQHJldHVybiB7Kn0g5a+56LGh6Lev5b6E5LiK55qE5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyIG9iaiA9IHthOntiOntjOjF9fX07XG4gKiBjb25zb2xlLmluZm8oZmluZChvYmosJ2EuYi5jJykpOyAvLyAxXG4gKiBjb25zb2xlLmluZm8oZmluZChvYmosJ2EuYycpKTsgLy8gdW5kZWZpbmVkXG4gKi9cblxuZnVuY3Rpb24gZmluZChvYmplY3QsIHBhdGgpIHtcblx0cGF0aCA9IHBhdGggfHwgJyc7XG5cdGlmICghcGF0aCkge1xuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblx0aWYgKCFvYmplY3QpIHtcblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0dmFyIHF1ZXVlID0gcGF0aC5zcGxpdCgnLicpO1xuXHR2YXIgbmFtZTtcblx0dmFyIHBvcyA9IG9iamVjdDtcblxuXHR3aGlsZSAocXVldWUubGVuZ3RoKSB7XG5cdFx0bmFtZSA9IHF1ZXVlLnNoaWZ0KCk7XG5cdFx0aWYgKCFwb3NbbmFtZV0pIHtcblx0XHRcdHJldHVybiBwb3NbbmFtZV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBvcyA9IHBvc1tuYW1lXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcG9zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmQ7XG4iLCIvKipcbiAqICMg5a+56LGh5aSE55CG5LiO5Yik5patXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC1vYmpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL29ialxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5vYmoudHlwZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC1vYmpcbiAqIHZhciAkb2JqID0gcmVxdWlyZSgnc3BvcmUta2l0LW9iaicpO1xuICogY29uc29sZS5pbmZvKCRvYmoudHlwZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHR5cGUgPSByZXF1aXJlKCdzcG9yZS1raXQtb2JqL3R5cGUnKTtcbiAqL1xuXG5leHBvcnRzLmFzc2lnbiA9IHJlcXVpcmUoJy4vYXNzaWduJyk7XG5leHBvcnRzLmNvdmVyID0gcmVxdWlyZSgnLi9jb3ZlcicpO1xuZXhwb3J0cy5maW5kID0gcmVxdWlyZSgnLi9maW5kJyk7XG5leHBvcnRzLnR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcbiIsIi8qKlxuICog6I635Y+W5a2X56ym5Liy6ZW/5bqm77yM5LiA5Liq5Lit5paH566XMuS4quWtl+esplxuICogQG1ldGhvZCBiTGVuZ3RoXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOimgeiuoeeul+mVv+W6pueahOWtl+espuS4slxuICogQHJldHVybnMge051bWJlcn0g5a2X56ym5Liy6ZW/5bqmXG4gKiBAZXhhbXBsZVxuICogYkxlbmd0aCgn5Lit5paHY2MnKTsgLy8gNlxuICovXG5cbmZ1bmN0aW9uIGJMZW5ndGggKHN0cikge1xuXHR2YXIgYU1hdGNoO1xuXHRpZiAoIXN0cikge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdGFNYXRjaCA9IHN0ci5tYXRjaCgvW15cXHgwMC1cXHhmZl0vZyk7XG5cdHJldHVybiAoc3RyLmxlbmd0aCArICghYU1hdGNoID8gMCA6IGFNYXRjaC5sZW5ndGgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiTGVuZ3RoO1xuIiwiLyoqXG4gKiDlhajop5LlrZfnrKbovazljYrop5LlrZfnrKZcbiAqIEBtZXRob2QgZGJjVG9TYmNcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg5YyF5ZCr5LqG5YWo6KeS5a2X56ym55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDnu4/ov4fovazmjaLnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiBkYmNUb1NiYygn77yz77yh77yh77yz77yk77ym77yz77yh77yk77ymJyk7IC8vICdTQUFTREZTQURGJ1xuICovXG5cbmZ1bmN0aW9uIGRiY1RvU2JjIChzdHIpIHtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9bXFx1ZmYwMS1cXHVmZjVlXS9nLCBmdW5jdGlvbiAoYSkge1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGEuY2hhckNvZGVBdCgwKSAtIDY1MjQ4KTtcblx0fSkucmVwbGFjZSgvXFx1MzAwMC9nLCAnICcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRiY1RvU2JjO1xuIiwiLyoqXG4gKiDop6PnoIFIVE1M77yM5bCG5a6e5L2T5a2X56ym6L2s5o2i5Li6SFRNTOWtl+esplxuICogQG1ldGhvZCBkZWNvZGVIVE1MXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWQq+acieWunuS9k+Wtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gSFRNTOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIGRlY29kZUhUTUwoJyZhbXA7Jmx0OyZndDskbmJzcDsmcXVvdDsnKTsgLy8gJyY8PiBcIidcbiAqL1xuXG5mdW5jdGlvbiBkZWNvZGVIVE1MIChzdHIpIHtcblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdkZWNvZGVIVE1MIG5lZWQgYSBzdHJpbmcgYXMgcGFyYW1ldGVyJyk7XG5cdH1cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcblx0XHQucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG5cdFx0LnJlcGxhY2UoLyZndDsvZywgJz4nKVxuXHRcdC5yZXBsYWNlKC8mIzM5Oy9nLCAnXFwnJylcblx0XHQucmVwbGFjZSgvJm5ic3A7L2csICdcXHUwMEEwJylcblx0XHQucmVwbGFjZSgvJiMzMjsvZywgJ1xcdTAwMjAnKVxuXHRcdC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlY29kZUhUTUw7XG4iLCIvKipcbiAqIOe8lueggUhUTUzvvIzlsIZIVE1M5a2X56ym6L2s5Li65a6e5L2T5a2X56ymXG4gKiBAbWV0aG9kIGVuY29kZUhUTUxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg5ZCr5pyJSFRNTOWtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g57uP6L+H6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogZW5jb2RlSFRNTCgnJjw+XCIgJyk7IC8vICcmYW1wOyZsdDsmZ3Q7JnF1b3Q7JG5ic3A7J1xuICovXG5cbmZ1bmN0aW9uIGVuY29kZUhUTUwgKHN0cikge1xuXHRpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2VuY29kZUhUTUwgbmVlZCBhIHN0cmluZyBhcyBwYXJhbWV0ZXInKTtcblx0fVxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyYvZywgJyZhbXA7Jylcblx0XHQucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG5cdFx0LnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuXHRcdC5yZXBsYWNlKC8+L2csICcmZ3Q7Jylcblx0XHQucmVwbGFjZSgvJy9nLCAnJiMzOTsnKVxuXHRcdC5yZXBsYWNlKC9cXHUwMEEwL2csICcmbmJzcDsnKVxuXHRcdC5yZXBsYWNlKC8oXFx1MDAyMHxcXHUwMDBCfFxcdTIwMjh8XFx1MjAyOXxcXGYpL2csICcmIzMyOycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVuY29kZUhUTUw7XG4iLCIvKipcbiAqIOeUn+aIkOS4gOS4quS4jeS4juS5i+WJjemHjeWkjeeahOmaj+acuuWtl+espuS4slxuICogQG1ldGhvZCBnZXRVbmlxdWVLZXlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOmaj+acuuWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIGdldFVuaXF1ZUtleSgpOyAvLyAnMTY2YWFlMWZhOWYnXG4gKi9cblxudmFyIHRpbWUgPSArbmV3IERhdGUoKTtcbnZhciBpbmRleCA9IDE7XG5cbmZ1bmN0aW9uIGdldFVuaXF1ZUtleSAoKSB7XG5cdHJldHVybiAodGltZSArIChpbmRleCsrKSkudG9TdHJpbmcoMTYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFVuaXF1ZUtleTtcbiIsIi8qKlxuICog5bCG6am85bOw5qC85byP5Y+Y5Li66L+e5a2X56ym5qC85byPXG4gKiBAbWV0aG9kIGh5cGhlbmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpqbzls7DmoLzlvI/nmoTlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOi/nuWtl+espuagvOW8j+eahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIGh5cGhlbmF0ZSgnbGliS2l0U3RySHlwaGVuYXRlJyk7IC8vICdsaWIta2l0LXN0ci1oeXBoZW5hdGUnXG4gKi9cblxuZnVuY3Rpb24gaHlwaGVuYXRlIChzdHIpIHtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAoJDApIHtcblx0XHRyZXR1cm4gJy0nICsgJDAudG9Mb3dlckNhc2UoKTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwaGVuYXRlO1xuIiwiLyoqXG4gKiAjIOWtl+espuS4suWkhOeQhuS4juWIpOaWrVxuICogQG1vZHVsZSBzcG9yZS1raXQtc3RyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9zdHJcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQtc3RyXG4gKiB2YXIgJHN0ciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1zdHInKTtcbiAqIGNvbnNvbGUuaW5mbygkc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRzdWJzdGl0dXRlID0gcmVxdWlyZSgnc3BvcmUta2l0LXN0ci9zdWJzdGl0dXRlJyk7XG4gKi9cblxuZXhwb3J0cy5iTGVuZ3RoID0gcmVxdWlyZSgnLi9iTGVuZ3RoJyk7XG5leHBvcnRzLmRiY1RvU2JjID0gcmVxdWlyZSgnLi9kYmNUb1NiYycpO1xuZXhwb3J0cy5kZWNvZGVIVE1MID0gcmVxdWlyZSgnLi9kZWNvZGVIVE1MJyk7XG5leHBvcnRzLmVuY29kZUhUTUwgPSByZXF1aXJlKCcuL2VuY29kZUhUTUwnKTtcbmV4cG9ydHMuZ2V0VW5pcXVlS2V5ID0gcmVxdWlyZSgnLi9nZXRVbmlxdWVLZXknKTtcbmV4cG9ydHMuaHlwaGVuYXRlID0gcmVxdWlyZSgnLi9oeXBoZW5hdGUnKTtcbmV4cG9ydHMuaXBUb0hleCA9IHJlcXVpcmUoJy4vaXBUb0hleCcpO1xuZXhwb3J0cy5sZWZ0QiA9IHJlcXVpcmUoJy4vbGVmdEInKTtcbmV4cG9ydHMuc2l6ZU9mVVRGOFN0cmluZyA9IHJlcXVpcmUoJy4vc2l6ZU9mVVRGOFN0cmluZycpO1xuZXhwb3J0cy5zdWJzdGl0dXRlID0gcmVxdWlyZSgnLi9zdWJzdGl0dXRlJyk7XG4iLCIvKipcbiAqIOWNgei/m+WItklQ5Zyw5Z2A6L2s5Y2B5YWt6L+b5Yi2XG4gKiBAbWV0aG9kIGlwVG9IZXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBpcCDljYHov5vliLbmlbDlrZfnmoRJUFY05Zyw5Z2AXG4gKiBAcmV0dXJuIHtTdHJpbmd9IDE26L+b5Yi25pWw5a2XSVBWNOWcsOWdgFxuICogQGV4YW1wbGVcbiAqIGlwVG9IZXgoJzI1NS4yNTUuMjU1LjI1NScpOyAvL3JldHVybiAnZmZmZmZmZmYnXG4gKi9cblxuZnVuY3Rpb24gaXBUb0hleCAoaXApIHtcblx0cmV0dXJuIGlwLnJlcGxhY2UoLyhcXGQrKVxcLiovZywgZnVuY3Rpb24gKG1hdGNoLCBudW0pIHtcblx0XHRudW0gPSBwYXJzZUludChudW0sIDEwKSB8fCAwO1xuXHRcdG51bSA9IG51bS50b1N0cmluZygxNik7XG5cdFx0aWYgKG51bS5sZW5ndGggPCAyKSB7XG5cdFx0XHRudW0gPSAnMCcgKyBudW07XG5cdFx0fVxuXHRcdHJldHVybiBudW07XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlwVG9IZXg7XG4iLCIvKipcbiAqIOS7juW3puWIsOWPs+WPluWtl+espuS4su+8jOS4reaWh+eul+S4pOS4quWtl+esplxuICogQG1ldGhvZCBsZWZ0QlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbnNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0clxuICogQGV4YW1wbGVcbiAqIC8v5ZCR5rGJ57yW6Ie05pWsXG4gKiBsZWZ0Qign5LiW55WM55yf5ZKM6LCQJywgNik7IC8vICfkuJbnlYznnJ8nXG4qL1xuXG52YXIgJGJMZW5ndGggPSByZXF1aXJlKCcuL2JMZW5ndGgnKTtcblxuZnVuY3Rpb24gbGVmdEIgKHN0ciwgbGVucykge1xuXHR2YXIgcyA9IHN0ci5yZXBsYWNlKC9cXCovZywgJyAnKS5yZXBsYWNlKC9bXlxceDAwLVxceGZmXS9nLCAnKionKTtcblx0c3RyID0gc3RyLnNsaWNlKDAsIHMuc2xpY2UoMCwgbGVucykucmVwbGFjZSgvXFwqXFwqL2csICcgJykucmVwbGFjZSgvXFwqL2csICcnKS5sZW5ndGgpO1xuXHRpZiAoJGJMZW5ndGgoc3RyKSA+IGxlbnMgJiYgbGVucyA+IDApIHtcblx0XHRzdHIgPSBzdHIuc2xpY2UoMCwgc3RyLmxlbmd0aCAtIDEpO1xuXHR9XG5cdHJldHVybiBzdHI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGVmdEI7XG4iLCIvKipcbiAqIOWPluWtl+espuS4siB1dGY4IOe8lueggemVv+W6pu+8jGZyb20g546L6ZuG6bmEXG4gKiBAbWV0aG9kIHNpemVPZlVURjhTdHJpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWtl+espuS4sumVv+W6plxuICogQGV4YW1wbGVcbiAqIHNpemVPZlVURjhTdHJpbmcoJ+S4reaWh2NjJyk7IC8vcmV0dXJuIDhcbiovXG5cbmZ1bmN0aW9uIHNpemVPZlVURjhTdHJpbmcgKHN0cikge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB1bmVzY2FwZSAhPT0gJ3VuZGVmaW5lZCdcblx0XHRcdD8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpLmxlbmd0aFxuXHRcdFx0OiBuZXcgQXJyYXlCdWZmZXIoc3RyLCAndXRmOCcpLmxlbmd0aFxuXHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpemVPZlVURjhTdHJpbmc7XG4iLCIvKipcbiAqIOaPkOS+m+WAkuiuoeaXtuWZqOe7n+S4gOWwgeijhVxuICogQG1ldGhvZCBjb3VudERvd25cbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOmAiemhuVxuICogQHBhcmFtIHtEYXRlfSBbc3BlYy5iYXNlXSDnn6vmraPml7bpl7TvvIzlpoLmnpzpnIDopoHnlKjmnI3liqHnq6/ml7bpl7Tnn6vmraPlgJLorqHml7bvvIzkvb/nlKjmraTlj4LmlbBcbiAqIEBwYXJhbSB7RGF0ZX0gW3NwZWMudGFyZ2V0PURhdGUubm93KCkgKyAzMDAwXSDnm67moIfml7bpl7RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5pbnRlcnZhbD0xMDAwXSDlgJLorqHml7bop6blj5Hpl7TpmpRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzcGVjLm9uQ2hhbmdlXSDlgJLorqHml7bop6blj5Hlj5jmm7TnmoTkuovku7blm57osINcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzcGVjLm9uU3RvcF0g5YCS6K6h5pe257uT5p2f55qE5Zue6LCDXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlgJLorqHml7blr7nosaHlrp7kvotcbiAqIEBleGFtcGxlXG4gKlx0dmFyIHRhcmdldCA9IERhdGUubm93KCkgKyA1MDAwO1xuICpcdHZhciBjZDEgPSBjb3VudERvd24oe1xuICpcdFx0dGFyZ2V0IDogdGFyZ2V0LFxuICpcdFx0b25DaGFuZ2UgOiBmdW5jdGlvbihkZWx0YSl7XG4gKlx0XHRcdGNvbnNvbGUuaW5mbygnY2QxIGNoYW5nZScsIGRlbHRhKTtcbiAqXHRcdH0sXG4gKlx0XHRvblN0b3AgOiBmdW5jdGlvbihkZWx0YSl7XG4gKlx0XHRcdGNvbnNvbGUuaW5mbygnY2QxIHN0b3AnLCBkZWx0YSk7XG4gKlx0XHR9XG4gKlx0fSk7XG4gKlx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuICpcdFx0Ly90cmlnZ2VyIHN0b3BcbiAqXHRcdGNkMS5zdG9wKCk7XG4gKlx0fSwgMjAwMCk7XG4gKlx0dmFyIGNkMiA9IGNvdW50RG93bih7XG4gKlx0XHR0YXJnZXQgOiB0YXJnZXQsXG4gKlx0XHRpbnRlcnZhbCA6IDIwMDAsXG4gKlx0XHRvbkNoYW5nZSA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqXHRcdFx0Y29uc29sZS5pbmZvKCdjZDIgY2hhbmdlJywgZGVsdGEpO1xuICpcdFx0fSxcbiAqXHRcdG9uU3RvcCA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqXHRcdFx0Y29uc29sZS5pbmZvKCdjZDIgc3RvcCcsIGRlbHRhKTtcbiAqXHRcdH1cbiAqXHR9KTtcbiAqL1xuXG52YXIgJGVyYXNlID0gcmVxdWlyZSgnc3BvcmUta2l0LWFyci9lcmFzZScpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCdzcG9yZS1raXQtb2JqL2Fzc2lnbicpO1xuXG52YXIgYWxsTW9uaXRvcnMgPSB7fTtcbnZhciBsb2NhbEJhc2VUaW1lID0gRGF0ZS5ub3coKTtcblxuZnVuY3Rpb24gY291bnREb3duIChzcGVjKSB7XG5cdHZhciB0aGF0ID0ge307XG5cblx0Ly8g5Li65LuA5LmI5LiN5L2/55SoIHRpbWVMZWZ0IOWPguaVsOabv+aNoiBiYXNlIOWSjCB0YXJnZXQ6XG5cdC8vIOWmguaenOeUqCB0aW1lTGVmdCDkvZzkuLrlj4LmlbDvvIzorqHml7blmajliJ3lp4vljJbkuYvliY3lpoLmnpzmnInov5vnqIvpmLvloZ7vvIzmnInlj6/og73kvJrlr7zoh7TkuI7nm67moIfml7bpl7TkuqfnlJ/or6/lt65cblx0Ly8g6aG16Z2i5aSa5Liq5a6a5pe25Zmo5LiA6LW35Yid5aeL5YyW5pe277yM5Lya5Ye6546w6K6h5pe25Zmo5pu05paw5LiN5ZCM5q2l55qE546w6LGh77yM5ZCM5pe25byV5Y+R6aG16Z2i5aSa5aSE5rKh5pyJ5LiA6LW35Zue5rWBXG5cdC8vIOS/neeVmeebruWJjei/meS4quaWueahiO+8jOeUqOS6jumcgOimgeeyvuehruWAkuiuoeaXtueahOaDheWGtVxuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdGJhc2U6IG51bGwsXG5cdFx0dGFyZ2V0OiBEYXRlLm5vdygpICsgMzAwMCxcblx0XHRpbnRlcnZhbDogMTAwMCxcblx0XHRvbkNoYW5nZTogbnVsbCxcblx0XHRvblN0b3A6IG51bGxcblx0fSwgc3BlYyk7XG5cblx0dmFyIGJhc2UgPSArbmV3IERhdGUoY29uZi5iYXNlKTtcblx0dmFyIHRhcmdldCA9ICtuZXcgRGF0ZShjb25mLnRhcmdldCk7XG5cdHZhciBpbnRlcnZhbCA9IHBhcnNlSW50KGNvbmYuaW50ZXJ2YWwsIDEwKSB8fCAwO1xuXG5cdC8vIOS9v+WAkuiuoeaXtuinpuWPkeaXtumXtOeyvuehruWMllxuXHQvLyDkvb/nlKjlm7rlrprnmoTop6blj5HpopHnjofvvIzlh4/lsJHpnIDopoHliJvlu7rnmoTlrprml7blmahcblx0dmFyIGRlbGF5ID0gaW50ZXJ2YWw7XG5cdGlmIChkZWxheSA8IDUwMCkge1xuXHRcdGRlbGF5ID0gMTA7XG5cdH0gZWxzZSBpZiAoZGVsYXkgPCA1MDAwKSB7XG5cdFx0ZGVsYXkgPSAxMDA7XG5cdH0gZWxzZSB7XG5cdFx0ZGVsYXkgPSAxMDAwO1xuXHR9XG5cblx0dmFyIGRlbHRhO1xuXHR2YXIgY3VyVW5pdDtcblxuXHR2YXIgdXBkYXRlID0gZnVuY3Rpb24obm93KSB7XG5cdFx0ZGVsdGEgPSB0YXJnZXQgLSBub3c7XG5cdFx0dmFyIHVuaXQgPSBNYXRoLmNlaWwoZGVsdGEgLyBpbnRlcnZhbCk7XG5cdFx0aWYgKHVuaXQgIT09IGN1clVuaXQpIHtcblx0XHRcdGN1clVuaXQgPSB1bml0O1xuXHRcdFx0aWYgKHR5cGVvZiBjb25mLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNvbmYub25DaGFuZ2UoZGVsdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR2YXIgY2hlY2sgPSBmdW5jdGlvbihsb2NhbERlbHRhKSB7XG5cdFx0dmFyIG5vdyA9IGNvbmYuYmFzZSA/IGJhc2UgKyBsb2NhbERlbHRhIDogbG9jYWxCYXNlVGltZSArIGxvY2FsRGVsdGE7XG5cdFx0dXBkYXRlKG5vdyk7XG5cdFx0aWYgKGRlbHRhIDw9IDApIHtcblx0XHRcdHRoYXQuc3RvcChub3cpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICog5YGc5q2i5YCS6K6h5pe2XG5cdCAqIEBtZXRob2QgY291bnREb3duI3N0b3Bcblx0ICogQG1lbWJlcm9mIGNvdW50RG93blxuXHQgKiBAZXhhbXBsZVxuXHQgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcblx0ICogY2Quc3RvcCgpO1xuXHQgKi9cblx0dGhhdC5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1vYmogPSBhbGxNb25pdG9yc1tkZWxheV07XG5cdFx0aWYgKG1vYmogJiYgbW9iai5xdWV1ZSkge1xuXHRcdFx0JGVyYXNlKG1vYmoucXVldWUsIGNoZWNrKTtcblx0XHR9XG5cdFx0Ly8gb25TdG9w5LqL5Lu26Kem5Y+R5b+F6aG75Zyo5LuO6Zif5YiX56e76Zmk5Zue6LCD5LmL5ZCOXG5cdFx0Ly8g5ZCm5YiZ5b6q546v5o6l5pu/55qE5a6a5pe25Zmo5Lya5byV5Y+R5q275b6q546vXG5cdFx0aWYgKHR5cGVvZiBjb25mLm9uU3RvcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y29uZi5vblN0b3AoZGVsdGEpO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgbW9uaXRvciA9IGFsbE1vbml0b3JzW2RlbGF5XTtcblxuXHRpZiAoIW1vbml0b3IpIHtcblx0XHRtb25pdG9yID0ge307XG5cdFx0bW9uaXRvci5xdWV1ZSA9IFtdO1xuXHRcdG1vbml0b3IuaW5zcGVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHR2YXIgbW9iaiA9IGFsbE1vbml0b3JzW2RlbGF5XTtcblx0XHRcdHZhciBsb2NhbERlbHRhID0gbm93IC0gbG9jYWxCYXNlVGltZTtcblx0XHRcdGlmIChtb2JqLnF1ZXVlLmxlbmd0aCkge1xuXHRcdFx0XHQvLyDlvqrnjq/lvZPkuK3kvJrliKDpmaTmlbDnu4TlhYPntKDvvIzlm6DmraTpnIDopoHlhYjlpI3liLbkuIDkuIvmlbDnu4Rcblx0XHRcdFx0bW9iai5xdWV1ZS5zbGljZSgwKS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG5cdFx0XHRcdFx0Zm4obG9jYWxEZWx0YSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChtb2JqLnRpbWVyKTtcblx0XHRcdFx0YWxsTW9uaXRvcnNbZGVsYXldID0gbnVsbDtcblx0XHRcdFx0ZGVsZXRlIG1vYmoudGltZXI7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRhbGxNb25pdG9yc1tkZWxheV0gPSBtb25pdG9yO1xuXHR9XG5cblx0bW9uaXRvci5xdWV1ZS5wdXNoKGNoZWNrKTtcblxuXHRpZiAoIW1vbml0b3IudGltZXIpIHtcblx0XHRtb25pdG9yLnRpbWVyID0gc2V0SW50ZXJ2YWwobW9uaXRvci5pbnNwZWN0LCBkZWxheSk7XG5cdH1cblxuXHRtb25pdG9yLmluc3BlY3QoKTtcblxuXHRyZXR1cm4gdGhhdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3VudERvd247XG4iLCIvKipcbiAqICMg5pe26Ze05aSE55CG5LiO5Lqk5LqS5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLWtpdC10aW1lXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy90aW1lXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LnRpbWUucGFyc2VVbml0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LXRpbWVcbiAqIHZhciAkdGltZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC10aW1lJyk7XG4gKiBjb25zb2xlLmluZm8oJHRpbWUucGFyc2VVbml0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkcGFyc2VVbml0ID0gcmVxdWlyZSgnc3BvcmUta2l0LXRpbWUvcGFyc2VVbml0Jyk7XG4gKi9cblxuZXhwb3J0cy5jb3VudERvd24gPSByZXF1aXJlKCcuL2NvdW50RG93bicpO1xuZXhwb3J0cy5wYXJzZVVuaXQgPSByZXF1aXJlKCcuL3BhcnNlVW5pdCcpO1xuIiwiLyoqXG4gKiDml7bpl7TmlbDlrZfmi4bliIbkuLrlpKnml7bliIbnp5JcbiAqIEBtZXRob2QgcGFyc2VVbml0XG4gKiBAcGFyYW0ge051bWJlcn0gdGltZSDmr6vnp5LmlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLm1heFVuaXQ9J2RheSddIOaLhuWIhuaXtumXtOeahOacgOWkp+WNleS9je+8jOWPr+mAiSBbJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnXVxuICogQHJldHVybnMge09iamVjdH0g5ouG5YiG5a6M5oiQ55qE5aSp5pe25YiG56eSXG4gKiBAZXhhbXBsZVxuICogY29uc29sZS5pbmZvKCBwYXJzZVVuaXQoMTIzNDUgKiA2Nzg5MCkgKTtcbiAqIC8vIE9iamVjdCB7ZGF5OiA5LCBob3VyOiAxNiwgbWludXRlOiA0OCwgc2Vjb25kOiAyMiwgbXM6IDUwfVxuICogY29uc29sZS5pbmZvKCBwYXJzZVVuaXQoMTIzNDUgKiA2Nzg5MCwge21heFVuaXQgOiAnaG91cid9KSApO1xuICogLy8gT2JqZWN0IHtob3VyOiAyMzIsIG1pbnV0ZTogNDgsIHNlY29uZDogMjIsIG1zOiA1MH1cbiAqL1xuXG52YXIgJG51bWVyaWNhbCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1udW0vbnVtZXJpY2FsJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC1vYmovYXNzaWduJyk7XG5cbnZhciBVTklUID0ge1xuXHRkYXk6IDI0ICogNjAgKiA2MCAqIDEwMDAsXG5cdGhvdXI6IDYwICogNjAgKiAxMDAwLFxuXHRtaW51dGU6IDYwICogMTAwMCxcblx0c2Vjb25kOiAxMDAwXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVuaXQodGltZSwgc3BlYykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdG1heFVuaXQ6ICdkYXknXG5cdH0sIHNwZWMpO1xuXG5cdHZhciBkYXRhID0ge307XG5cdHZhciBtYXhVbml0ID0gJG51bWVyaWNhbChVTklUW2NvbmYubWF4VW5pdF0pO1xuXHR2YXIgdURheSA9IFVOSVQuZGF5O1xuXHR2YXIgdUhvdXIgPSBVTklULmhvdXI7XG5cdHZhciB1TWludXRlID0gVU5JVC5taW51dGU7XG5cdHZhciB1U2Vjb25kID0gVU5JVC5zZWNvbmQ7XG5cblx0aWYgKG1heFVuaXQgPj0gdURheSkge1xuXHRcdHRpbWUgPSAkbnVtZXJpY2FsKHRpbWUpO1xuXHRcdGRhdGEuZGF5ID0gTWF0aC5mbG9vcih0aW1lIC8gdURheSk7XG5cdH1cblxuXHRpZiAobWF4VW5pdCA+PSB1SG91cikge1xuXHRcdHRpbWUgLT0gJG51bWVyaWNhbChkYXRhLmRheSAqIHVEYXkpO1xuXHRcdGRhdGEuaG91ciA9IE1hdGguZmxvb3IodGltZSAvIHVIb3VyKTtcblx0fVxuXG5cdGlmIChtYXhVbml0ID49IHVNaW51dGUpIHtcblx0XHR0aW1lIC09ICRudW1lcmljYWwoZGF0YS5ob3VyICogdUhvdXIpO1xuXHRcdGRhdGEubWludXRlID0gTWF0aC5mbG9vcih0aW1lIC8gdU1pbnV0ZSk7XG5cdH1cblxuXHRpZiAobWF4VW5pdCA+PSB1U2Vjb25kKSB7XG5cdFx0dGltZSAtPSAkbnVtZXJpY2FsKGRhdGEubWludXRlICogdU1pbnV0ZSk7XG5cdFx0ZGF0YS5zZWNvbmQgPSBNYXRoLmZsb29yKHRpbWUgLyB1U2Vjb25kKTtcblx0fVxuXG5cdGRhdGEubXMgPSB0aW1lIC0gZGF0YS5zZWNvbmQgKiB1U2Vjb25kO1xuXG5cdHJldHVybiBkYXRhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlVW5pdDtcbiIsIi8qKlxuICogQXJyYXlCdWZmZXLovawxNui/m+WItuWtl+espuS4slxuICogQG1ldGhvZCBhYlRvSGV4XG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIg6ZyA6KaB6L2s5o2i55qEIEFycmF5QnVmZmVyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAxNui/m+WItuWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAqIHZhciBkdiA9IG5ldyBEYXRhVmlldyhhYik7XG4gKiBkdi5zZXRVaW50OCgwLCAxNzEpO1xuICogZHYuc2V0VWludDgoMSwgMjA1KTtcbiAqIGFiVG9IZXgoYWIpOyAvLyA9PiAnYWJjZCdcbiAqL1xuXG5mdW5jdGlvbiBhYlRvSGV4KGJ1ZmZlcikge1xuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJ1ZmZlcikgIT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXScpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChcblx0XHRuZXcgVWludDhBcnJheShidWZmZXIpLFxuXHRcdGZ1bmN0aW9uKGJpdCkge1xuXHRcdFx0cmV0dXJuICgnMDAnICsgYml0LnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuXHRcdH1cblx0KS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhYlRvSGV4O1xuIiwiLyoqXG4gKiBBU0NJSeWtl+espuS4sui9rDE26L+b5Yi25a2X56ym5LiyXG4gKiBAbWV0aG9kIGFzY1RvSGV4XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmcgOimgei9rOaNoueahEFTQ0lJ5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAxNui/m+WItuWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIGFzY1RvSGV4KCk7IC8vID0+ICcnXG4gKiBhc2NUb0hleCgnKisnKTsgLy8gPT4gJzJhMmInXG4gKi9cblxuZnVuY3Rpb24gYXNjVG9IZXgoc3RyKSB7XG5cdGlmICghc3RyKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdHZhciBoZXggPSAnJztcblx0dmFyIGluZGV4O1xuXHR2YXIgbGVuID0gc3RyLmxlbmd0aDtcblx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCsrKSB7XG5cdFx0dmFyIGludCA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KTtcblx0XHR2YXIgY29kZSA9IChpbnQpLnRvU3RyaW5nKDE2KTtcblx0XHRoZXggKz0gY29kZTtcblx0fVxuXHRyZXR1cm4gaGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzY1RvSGV4O1xuIiwiLyoqXG4gKiAxNui/m+WItuWtl+espuS4sui9rEFycmF5QnVmZmVyXG4gKiBAbWV0aG9kIGhleFRvQWJcbiAqIEBzZWUgaHR0cHM6Ly9jYW5pdXNlLmNvbS8jc2VhcmNoPUFycmF5QnVmZmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmcgOimgei9rOaNoueahDE26L+b5Yi25a2X56ym5LiyXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IOiiq+i9rOaNouWQjueahCBBcnJheUJ1ZmZlciDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgYWIgPSBoZXhUb0FiKCk7XG4gKiBhYi5ieXRlTGVuZ3RoOyAvLyA9PiAwXG4gKiBhYiA9IGhleFRvQWIoJ2FiY2QnKTtcbiAqIHZhciBkdiA9IG5ldyBEYXRhVmlldyhhYik7XG4gKiBhYi5ieXRlTGVuZ3RoOyAvLyA9PiAyXG4gKiBkdi5nZXRVaW50OCgwKTsgLy8gPT4gMTcxXG4gKiBkdi5nZXRVaW50OCgxKTsgLy8gPT4gMjA1XG4gKi9cblxuZnVuY3Rpb24gaGV4VG9BYihzdHIpIHtcblx0aWYgKCFzdHIpIHtcblx0XHRyZXR1cm4gbmV3IEFycmF5QnVmZmVyKDApO1xuXHR9XG5cdHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoTWF0aC5jZWlsKHN0ci5sZW5ndGggLyAyKSk7XG5cdHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHR2YXIgaW5kZXggPSAwO1xuXHR2YXIgaTtcblx0dmFyIGxlbiA9IHN0ci5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuXHRcdHZhciBjb2RlID0gcGFyc2VJbnQoc3RyLnN1YnN0cihpLCAyKSwgMTYpO1xuXHRcdGRhdGFWaWV3LnNldFVpbnQ4KGluZGV4LCBjb2RlKTtcblx0XHRpbmRleCsrO1xuXHR9XG5cdHJldHVybiBidWZmZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGV4VG9BYjtcbiIsIi8qKlxuICogMTbov5vliLblrZfnrKbkuLLovaxBU0NJSeWtl+espuS4slxuICogQG1ldGhvZCBoZXhUb0FzY1xuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpnIDopoHovazmjaLnmoQxNui/m+WItuWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gQVNDSUnlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiBoZXhUb0FzYygpOyAvLyA9PiAnJ1xuICogaGV4VG9Bc2MoJzJhMmInKTsgLy8gPT4gJyorJ1xuICovXG5cbmZ1bmN0aW9uIGhleFRvQXNjKGhleCkge1xuXHRpZiAoIWhleCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXHRyZXR1cm4gaGV4LnJlcGxhY2UoL1tcXGRhLWZdezJ9L2dpLCBmdW5jdGlvbihtYXRjaCkge1xuXHRcdHZhciBpbnQgPSBwYXJzZUludChtYXRjaCwgMTYpO1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGludCk7XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhleFRvQXNjO1xuIiwiLyoqXG4gKiBIU0zpopzoibLlgLzovazmjaLkuLpSR0JcbiAqIC0g5o2i566X5YWs5byP5pS557yW6IeqIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFNMX2NvbG9yX3NwYWNlLlxuICogLSBoLCBzLCDlkowgbCDorr7lrprlnKggWzAsIDFdIOS5i+mXtFxuICogLSDov5Tlm57nmoQgciwgZywg5ZKMIGIg5ZyoIFswLCAyNTVd5LmL6Ze0XG4gKiBAbWV0aG9kIGhzbFRvUmdiXG4gKiBAcGFyYW0ge051bWJlcn0gaCDoibLnm7hcbiAqIEBwYXJhbSB7TnVtYmVyfSBzIOmlseWSjOW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGwg5Lqu5bqmXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJHQuiJsuWAvOaVsOWAvFxuICogQGV4YW1wbGVcbiAqIGhzbFRvUmdiKDAsIDAsIDApOyAvLyA9PiBbMCwwLDBdXG4gKiBoc2xUb1JnYigwLCAwLCAxKTsgLy8gPT4gWzI1NSwyNTUsMjU1XVxuICogaHNsVG9SZ2IoMC41NTU1NTU1NTU1NTU1NTU1LCAwLjkzNzQ5OTk5OTk5OTk5OTksIDAuNjg2Mjc0NTA5ODAzOTIxNik7IC8vID0+IFsxMDAsMjAwLDI1MF1cbiAqL1xuXG5mdW5jdGlvbiBodWVUb1JnYihwLCBxLCB0KSB7XG5cdGlmICh0IDwgMCkgdCArPSAxO1xuXHRpZiAodCA+IDEpIHQgLT0gMTtcblx0aWYgKHQgPCAxIC8gNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG5cdGlmICh0IDwgMSAvIDIpIHJldHVybiBxO1xuXHRpZiAodCA8IDIgLyAzKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDY7XG5cdHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBoc2xUb1JnYihoLCBzLCBsKSB7XG5cdHZhciByO1xuXHR2YXIgZztcblx0dmFyIGI7XG5cblx0aWYgKHMgPT09IDApIHtcblx0XHQvLyBhY2hyb21hdGljXG5cdFx0ciA9IGw7XG5cdFx0ZyA9IGw7XG5cdFx0YiA9IGw7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuXHRcdHZhciBwID0gMiAqIGwgLSBxO1xuXHRcdHIgPSBodWVUb1JnYihwLCBxLCBoICsgMSAvIDMpO1xuXHRcdGcgPSBodWVUb1JnYihwLCBxLCBoKTtcblx0XHRiID0gaHVlVG9SZ2IocCwgcSwgaCAtIDEgLyAzKTtcblx0fVxuXHRyZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhzbFRvUmdiO1xuIiwiLyoqXG4gKiAjIOWFtuS7luW3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS1raXQtdXRpbFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdXRpbFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC51dGlsLmhzbFRvUmdiKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0LXV0aWxcbiAqIHZhciAkdXRpbCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC11dGlsJyk7XG4gKiBjb25zb2xlLmluZm8oJHV0aWwuaHNsVG9SZ2IpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRoc2xUb1JnYiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC11dGlsL2hzbFRvUmdiJyk7XG4gKi9cblxuZXhwb3J0cy5hYlRvSGV4ID0gcmVxdWlyZSgnLi9hYlRvSGV4Jyk7XG5leHBvcnRzLmFzY1RvSGV4ID0gcmVxdWlyZSgnLi9hc2NUb0hleCcpO1xuZXhwb3J0cy5oZXhUb0FiID0gcmVxdWlyZSgnLi9oZXhUb0FiJyk7XG5leHBvcnRzLmhleFRvQXNjID0gcmVxdWlyZSgnLi9oZXhUb0FzYycpO1xuZXhwb3J0cy5oc2xUb1JnYiA9IHJlcXVpcmUoJy4vaHNsVG9SZ2InKTtcbmV4cG9ydHMuam9iID0gcmVxdWlyZSgnLi9qb2InKTtcbmV4cG9ydHMubWVhc3VyZURpc3RhbmNlID0gcmVxdWlyZSgnLi9tZWFzdXJlRGlzdGFuY2UnKTtcbmV4cG9ydHMucmdiVG9Ic2wgPSByZXF1aXJlKCcuL3JnYlRvSHNsJyk7XG4iLCIvKipcbiAqIOS7u+WKoeWIhuaXtuaJp+ihjFxuICogLSDkuIDmlrnpnaLpgb/lhY3ljZXmrKFyZWZsb3fmtYHnqIvmiafooYzlpKrlpJpqc+S7u+WKoeWvvOiHtOa1j+iniOWZqOWNoeatu1xuICogLSDlj6bkuIDmlrnpnaLljZXkuKrku7vliqHnmoTmiqXplJnkuI3kvJrlvbHlk43lkI7nu63ku7vliqHnmoTmiafooYxcbiAqIEBtZXRob2Qgam9iXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDku7vliqHlh73mlbBcbiAqIEByZXR1cm5zIHtPYmplY3R9IOS7u+WKoemYn+WIl+WvueixoVxuICogQGV4YW1wbGVcbiAqIGpvYihmdW5jdGlvbigpIHtcbiAqIFx0Ly90YXNrMSBzdGFydFxuICogfSk7XG4gKiBqb2IoZnVuY3Rpb24oKSB7XG4gKiBcdC8vdGFzazIgc3RhcnRcbiAqIH0pO1xuICovXG5cbnZhciBtYW5hZ2VyID0ge307XG5cbm1hbmFnZXIucXVldWUgPSBbXTtcblxubWFuYWdlci5hZGQgPSBmdW5jdGlvbihmbiwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0bWFuYWdlci5xdWV1ZS5wdXNoKHtcblx0XHRmbjogZm4sXG5cdFx0Y29uZjogb3B0aW9uc1xuXHR9KTtcblx0bWFuYWdlci5zdGVwKCk7XG59O1xuXG5tYW5hZ2VyLnN0ZXAgPSBmdW5jdGlvbigpIHtcblx0aWYgKCFtYW5hZ2VyLnF1ZXVlLmxlbmd0aCB8fCBtYW5hZ2VyLnRpbWVyKSB7IHJldHVybjsgfVxuXHRtYW5hZ2VyLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHR2YXIgaXRlbSA9IG1hbmFnZXIucXVldWUuc2hpZnQoKTtcblx0XHRpZiAoaXRlbSkge1xuXHRcdFx0aWYgKGl0ZW0uZm4gJiYgdHlwZW9mIGl0ZW0uZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0aXRlbS5mbi5jYWxsKG51bGwpO1xuXHRcdFx0fVxuXHRcdFx0bWFuYWdlci50aW1lciA9IG51bGw7XG5cdFx0XHRtYW5hZ2VyLnN0ZXAoKTtcblx0XHR9XG5cdH0sIDEpO1xufTtcblxuZnVuY3Rpb24gam9iKGZuLCBvcHRpb25zKSB7XG5cdG1hbmFnZXIuYWRkKGZuLCBvcHRpb25zKTtcblx0cmV0dXJuIG1hbmFnZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gam9iO1xuIiwiLyoqXG4gKiDmtYvph4/lnLDnkIblnZDmoIfnmoTot53nprtcbiAqIEBtZXRob2QgbWVhc3VyZURpc3RhbmNlXG4gKiBAcGFyYW0ge051bWJlcn0gbGF0MSDlnZDmoIcx57K+5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbG5nMSDlnZDmoIcx57qs5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbGF0MiDlnZDmoIcy57K+5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbG5nMiDlnZDmoIcy57qs5bqmXG4gKiBAcmV0dXJucyB7TnVtYmVyfSAy5Liq5Z2Q5qCH5LmL6Ze055qE6Led56a777yI5Y2D57Gz77yJXG4gKiBAZXhhbXBsZVxuICogdmFyIGRpc3RhbmNlID0gbWVhc3VyZURpc3RhbmNlKFxuICogICBTUVVBUkVMT0NBVElPTi5sYXRpdHVkZSxcbiAqICAgU1FVQVJFTE9DQVRJT04ubG9uZ2l0dWRlLFxuICogICBjb29yZHMubGF0aXR1ZGUsXG4gKiAgIGNvb3Jkcy5sb25naXR1ZGUsXG4gKiApO1xuICovXG5cbmZ1bmN0aW9uIG1lYXN1cmVEaXN0YW5jZSAobGF0MSwgbG5nMSwgbGF0MiwgbG5nMikge1xuXHR2YXIgcmFkTGF0MSA9IChsYXQxICogTWF0aC5QSSkgLyAxODAuMDtcblx0dmFyIHJhZExhdDIgPSAobGF0MiAqIE1hdGguUEkpIC8gMTgwLjA7XG5cdHZhciBhID0gcmFkTGF0MSAtIHJhZExhdDI7XG5cdHZhciBiID0gKGxuZzEgKiBNYXRoLlBJKSAvIDE4MC4wIC0gKGxuZzIgKiBNYXRoLlBJKSAvIDE4MC4wO1xuXHR2YXIgcyA9IDIgKiBNYXRoLmFzaW4oXG5cdFx0TWF0aC5zcXJ0KFxuXHRcdFx0KE1hdGguc2luKGEgLyAyKSAqKiAyKVxuXHRcdFx0KyBNYXRoLmNvcyhyYWRMYXQxKSAqIE1hdGguY29zKHJhZExhdDIpICogKE1hdGguc2luKGIgLyAyKSAqKiAyKVxuXHRcdClcblx0KTtcblx0Ly8g5Zyw55CD5Y2K5b6EXG5cdHMgKj0gNjM3OC4xMzc7XG5cdHJldHVybiBzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lYXN1cmVEaXN0YW5jZTtcbiIsIi8qKlxuICogUkdCIOminOiJsuWAvOi9rOaNouS4uiBIU0wuXG4gKiAtIOi9rOaNouWFrOW8j+WPguiAg+iHqiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hTTF9jb2xvcl9zcGFjZS5cbiAqIC0gciwgZywg5ZKMIGIg6ZyA6KaB5ZyoIFswLCAyNTVdIOiMg+WbtOWGhVxuICogLSDov5Tlm57nmoQgaCwgcywg5ZKMIGwg5ZyoIFswLCAxXSDkuYvpl7RcbiAqIEBwYXJhbSB7TnVtYmVyfSByIOe6ouiJsuiJsuWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IGcg57u/6Imy6Imy5YC8XG4gKiBAcGFyYW0ge051bWJlcn0gYiDok53oibLoibLlgLxcbiAqIEByZXR1cm5zIHtBcnJheX0gSFNM5ZCE5YC85pWw57uEXG4gKiBAZXhhbXBsZVxuICogcmdiVG9Ic2woMTAwLCAyMDAsIDI1MCk7IC8vID0+IFswLjU1NTU1NTU1NTU1NTU1NTUsMC45Mzc0OTk5OTk5OTk5OTk5LDAuNjg2Mjc0NTA5ODAzOTIxNl1cbiAqIHJnYlRvSHNsKDAsIDAsIDApOyAvLyA9PiBbMCwwLDBdXG4gKiByZ2JUb0hzbCgyNTUsIDI1NSwgMjU1KTsgLy8gPT4gWzAsMCwxXVxuICovXG5cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcblx0ciAvPSAyNTU7XG5cdGcgLz0gMjU1O1xuXHRiIC89IDI1NTtcblx0dmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuXHR2YXJcdG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuXHR2YXIgaDtcblx0dmFyIHM7XG5cdHZhciBsID0gKG1heCArIG1pbikgLyAyO1xuXG5cdGlmIChtYXggPT09IG1pbikge1xuXHRcdC8vIGFjaHJvbWF0aWNcblx0XHRoID0gMDtcblx0XHRzID0gMDtcblx0fSBlbHNlIHtcblx0XHR2YXIgZCA9IG1heCAtIG1pbjtcblx0XHRzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG5cdFx0aWYgKG1heCA9PT0gcikge1xuXHRcdFx0aCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApO1xuXHRcdH0gZWxzZSBpZiAobWF4ID09PSBnKSB7XG5cdFx0XHRoID0gKGIgLSByKSAvIGQgKyAyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoID0gKHIgLSBnKSAvIGQgKyA0O1xuXHRcdH1cblx0XHRoIC89IDY7XG5cdH1cblxuXHRyZXR1cm4gW2gsIHMsIGxdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJnYlRvSHNsO1xuIl19
(1)
});
