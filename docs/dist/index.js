!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sporeKit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
exports.app = _dereq_('./packages/app');
exports.arr = _dereq_('./packages/arr');
exports.cookie = _dereq_('./packages/cookie');
exports.date = _dereq_('./packages/date');
exports.dom = _dereq_('./packages/dom');
exports.env = _dereq_('./packages/env');
exports.evt = _dereq_('./packages/evt');
exports.fn = _dereq_('./packages/fn');
exports.io = _dereq_('./packages/io');
exports.location = _dereq_('./packages/location');
exports.mvc = _dereq_('./packages/mvc');
exports.num = _dereq_('./packages/num');
exports.obj = _dereq_('./packages/obj');
exports.str = _dereq_('./packages/str');
exports.time = _dereq_('./packages/time');

},{"./packages/app":3,"./packages/arr":13,"./packages/cookie":16,"./packages/date":22,"./packages/dom":26,"./packages/env":37,"./packages/evt":45,"./packages/fn":50,"./packages/io":58,"./packages/location":60,"./packages/mvc":65,"./packages/num":207,"./packages/obj":213,"./packages/str":221,"./packages/time":227}],2:[function(_dereq_,module,exports){
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

var $assign = _dereq_('spore-kit-obj/assign');
var $browser = _dereq_('spore-kit-env/browser');

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

},{"spore-kit-env/browser":4,"spore-kit-obj/assign":7}],3:[function(_dereq_,module,exports){
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

exports.callUp = _dereq_('./callUp');

},{"./callUp":2}],4:[function(_dereq_,module,exports){
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
var $assign = _dereq_('spore-kit-obj/assign');
var $uaMatch = _dereq_('./uaMatch');

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

},{"./uaMatch":6,"spore-kit-obj/assign":5}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
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

},{}],7:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],8:[function(_dereq_,module,exports){
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

},{}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
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

},{}],11:[function(_dereq_,module,exports){
/**
 * 数组扁平化
 * @method flatten
 * @param {array} arr 要操作的数组
 * @returns {array} 经过扁平化处理的数组
 * @example
 * console.info(flatten([1, [2,3], [4,5]]));	// [1,2,3,4,5]
 */

var $type = _dereq_('spore-kit-obj/type');

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

},{"spore-kit-obj/type":14}],12:[function(_dereq_,module,exports){
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

var $contains = _dereq_('./contains');

function include (arr, item) {
	if (!$contains(arr, item)) {
		arr.push(item);
	}
	return arr;
}

module.exports = include;

},{"./contains":8}],13:[function(_dereq_,module,exports){
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

exports.contains = _dereq_('./contains');
exports.erase = _dereq_('./erase');
exports.find = _dereq_('./find');
exports.flatten = _dereq_('./flatten');
exports.include = _dereq_('./include');

},{"./contains":8,"./erase":9,"./find":10,"./flatten":11,"./include":12}],14:[function(_dereq_,module,exports){
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

},{}],15:[function(_dereq_,module,exports){
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

var Cookie = _dereq_('js-cookie');

var instance = Cookie.withConverter({
	read: function(val) {
		return decodeURIComponent(val);
	},
	write: function(val) {
		return encodeURIComponent(val);
	}
});

module.exports = instance;

},{"js-cookie":17}],16:[function(_dereq_,module,exports){
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

exports.cookie = _dereq_('./cookie');
exports.origin = _dereq_('./origin');

},{"./cookie":15,"./origin":18}],17:[function(_dereq_,module,exports){
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

},{}],18:[function(_dereq_,module,exports){
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
module.exports = _dereq_('js-cookie');

},{"js-cookie":17}],19:[function(_dereq_,module,exports){
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

var $assign = _dereq_('spore-kit-obj/assign');
var $substitute = _dereq_('spore-kit-str/substitute');
var $fixTo = _dereq_('spore-kit-num/fixTo');

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

},{"spore-kit-num/fixTo":23,"spore-kit-obj/assign":24,"spore-kit-str/substitute":25}],20:[function(_dereq_,module,exports){
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

var $getTimeSplit = _dereq_('./getTimeSplit');

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

},{"./getTimeSplit":21}],21:[function(_dereq_,module,exports){
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

},{}],22:[function(_dereq_,module,exports){
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

exports.format = _dereq_('./format');
exports.getLastStart = _dereq_('./getLastStart');
exports.getTimeSplit = _dereq_('./getTimeSplit');

},{"./format":19,"./getLastStart":20,"./getTimeSplit":21}],23:[function(_dereq_,module,exports){
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

},{}],24:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],25:[function(_dereq_,module,exports){
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

},{}],26:[function(_dereq_,module,exports){
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

exports.isNode = _dereq_('./isNode');
exports.offset = _dereq_('./offset');

},{"./isNode":27,"./offset":33}],27:[function(_dereq_,module,exports){
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

},{}],28:[function(_dereq_,module,exports){
var support = _dereq_('dom-support')
var getDocument = _dereq_('get-document')
var withinElement = _dereq_('within-element')

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

},{"dom-support":29,"get-document":31,"within-element":32}],29:[function(_dereq_,module,exports){
var domready = _dereq_('domready')

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

},{"domready":30}],30:[function(_dereq_,module,exports){
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

},{}],31:[function(_dereq_,module,exports){

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

},{}],32:[function(_dereq_,module,exports){

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

},{}],33:[function(_dereq_,module,exports){
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

var offset = _dereq_('document-offset');

module.exports = offset;

},{"document-offset":28}],34:[function(_dereq_,module,exports){
module.exports=_dereq_(4)
},{"./uaMatch":42,"spore-kit-obj/assign":39}],35:[function(_dereq_,module,exports){
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

var $assign = _dereq_('spore-kit-obj/assign');
var $uaMatch = _dereq_('./uaMatch');

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

},{"./uaMatch":42,"spore-kit-obj/assign":39}],36:[function(_dereq_,module,exports){
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
var $assign = _dereq_('spore-kit-obj/assign');
var $uaMatch = _dereq_('./uaMatch');

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

},{"./uaMatch":42,"spore-kit-obj/assign":39}],37:[function(_dereq_,module,exports){
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

exports.browser = _dereq_('./browser');
exports.core = _dereq_('./core');
exports.device = _dereq_('./device');
exports.network = _dereq_('./network');
exports.os = _dereq_('./os');
exports.touchable = _dereq_('./touchable');
exports.uaMatch = _dereq_('./uaMatch');
exports.webp = _dereq_('./webp');

},{"./browser":34,"./core":35,"./device":36,"./network":38,"./os":40,"./touchable":41,"./uaMatch":42,"./webp":43}],38:[function(_dereq_,module,exports){
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

},{}],39:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],40:[function(_dereq_,module,exports){
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
var $assign = _dereq_('spore-kit-obj/assign');
var $uaMatch = _dereq_('./uaMatch');

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

},{"./uaMatch":42,"spore-kit-obj/assign":39}],41:[function(_dereq_,module,exports){
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

},{}],42:[function(_dereq_,module,exports){
module.exports=_dereq_(6)
},{}],43:[function(_dereq_,module,exports){
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

},{}],44:[function(_dereq_,module,exports){
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

},{}],45:[function(_dereq_,module,exports){
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

exports.Events = _dereq_('./events');
exports.Listener = _dereq_('./listener');
exports.occurInside = _dereq_('./occurInside');
exports.tapStop = _dereq_('./tapStop');

},{"./events":44,"./listener":46,"./occurInside":47,"./tapStop":48}],46:[function(_dereq_,module,exports){
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

var $events = _dereq_('./events');

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

},{"./events":44}],47:[function(_dereq_,module,exports){
/**
 * 判断事件是否发生在一个 Dom 元素内。
 * - require jQuery/Zepto
 * - 常用于判断点击事件发生在浮层外时关闭浮层。
 * @method occurInside
 * @param {Object} event 浏览器事件对象
 * @param {Object} node 用于比较事件发生区域的 Dom 对象
 * @returns {Boolean} 事件是否发生在 node 内
 * @example
 * $('.layer').on('click', function(evt){
 * 	if(occurInside(evt, $(this).find('close'))){
 * 		$(this).hide();
 * 	}
 * });
 */

function occurInside(event, node) {
	var $ = window.$ || window.Zepto || window.jQuery;
	node = $(node);

	if (node.length && event && event.target) {
		var element = node[0];
		var pos = event.target;
		while (pos.parentNode) {
			if (pos === element) {
				return true;
			} else {
				pos = pos.parentNode;
			}
		}
	}

	return false;
}

module.exports = occurInside;

},{}],48:[function(_dereq_,module,exports){
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

},{}],49:[function(_dereq_,module,exports){
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

},{}],50:[function(_dereq_,module,exports){
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

exports.delay = _dereq_('./delay');
exports.lock = _dereq_('./lock');
exports.once = _dereq_('./once');
exports.queue = _dereq_('./queue');
exports.prepare = _dereq_('./prepare');
exports.regular = _dereq_('./regular');

},{"./delay":49,"./lock":51,"./once":52,"./prepare":53,"./queue":54,"./regular":55}],51:[function(_dereq_,module,exports){
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

},{}],52:[function(_dereq_,module,exports){
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

},{}],53:[function(_dereq_,module,exports){
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

},{}],54:[function(_dereq_,module,exports){
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

},{}],55:[function(_dereq_,module,exports){
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

},{}],56:[function(_dereq_,module,exports){
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

},{}],57:[function(_dereq_,module,exports){
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

},{}],58:[function(_dereq_,module,exports){
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

exports.iframePost = _dereq_('./iframePost');
exports.getScript = _dereq_('./getScript');

},{"./getScript":56,"./iframePost":57}],59:[function(_dereq_,module,exports){
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

},{}],60:[function(_dereq_,module,exports){
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

exports.getQuery = _dereq_('./getQuery');
exports.setQuery = _dereq_('./setQuery');
exports.parse = _dereq_('./parse');

},{"./getQuery":59,"./parse":61,"./setQuery":62}],61:[function(_dereq_,module,exports){
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

},{}],62:[function(_dereq_,module,exports){
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

},{}],63:[function(_dereq_,module,exports){
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

var $events = _dereq_('spore-kit-evt/events');
var $merge = _dereq_('lodash/merge');
var $noop = _dereq_('lodash/noop');
var $isPlainObject = _dereq_('lodash/isPlainObject');
var $isFunction = _dereq_('lodash/isFunction');
var $klass = _dereq_('./klass');

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

},{"./klass":66,"lodash/isFunction":188,"lodash/isPlainObject":193,"lodash/merge":198,"lodash/noop":199,"spore-kit-evt/events":203}],64:[function(_dereq_,module,exports){
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

var $isFunction = _dereq_('lodash/isFunction');
var $assign = _dereq_('lodash/assign');
var $forEach = _dereq_('lodash/forEach');

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

},{"lodash/assign":177,"lodash/forEach":181,"lodash/isFunction":188}],65:[function(_dereq_,module,exports){
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

exports.klass = _dereq_('./klass');
exports.delegate = _dereq_('./delegate');
exports.Base = _dereq_('./base');
exports.Model = _dereq_('./model');
exports.View = _dereq_('./view');

},{"./base":63,"./delegate":64,"./klass":66,"./model":67,"./view":204}],66:[function(_dereq_,module,exports){
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

},{}],67:[function(_dereq_,module,exports){
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

var $assign = _dereq_('lodash/assign');
var $isFunction = _dereq_('lodash/isFunction');
var $isPlainObject = _dereq_('lodash/isPlainObject');
var $isArray = _dereq_('lodash/isArray');
var $forEach = _dereq_('lodash/forEach');
var $cloneDeep = _dereq_('lodash/cloneDeep');
var $base = _dereq_('./base');
var $delegate = _dereq_('./delegate');

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

},{"./base":63,"./delegate":64,"lodash/assign":177,"lodash/cloneDeep":178,"lodash/forEach":181,"lodash/isArray":184,"lodash/isFunction":188,"lodash/isPlainObject":193}],68:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":130,"./_root":167}],69:[function(_dereq_,module,exports){
var hashClear = _dereq_('./_hashClear'),
    hashDelete = _dereq_('./_hashDelete'),
    hashGet = _dereq_('./_hashGet'),
    hashHas = _dereq_('./_hashHas'),
    hashSet = _dereq_('./_hashSet');

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

},{"./_hashClear":137,"./_hashDelete":138,"./_hashGet":139,"./_hashHas":140,"./_hashSet":141}],70:[function(_dereq_,module,exports){
var listCacheClear = _dereq_('./_listCacheClear'),
    listCacheDelete = _dereq_('./_listCacheDelete'),
    listCacheGet = _dereq_('./_listCacheGet'),
    listCacheHas = _dereq_('./_listCacheHas'),
    listCacheSet = _dereq_('./_listCacheSet');

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

},{"./_listCacheClear":150,"./_listCacheDelete":151,"./_listCacheGet":152,"./_listCacheHas":153,"./_listCacheSet":154}],71:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":130,"./_root":167}],72:[function(_dereq_,module,exports){
var mapCacheClear = _dereq_('./_mapCacheClear'),
    mapCacheDelete = _dereq_('./_mapCacheDelete'),
    mapCacheGet = _dereq_('./_mapCacheGet'),
    mapCacheHas = _dereq_('./_mapCacheHas'),
    mapCacheSet = _dereq_('./_mapCacheSet');

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

},{"./_mapCacheClear":155,"./_mapCacheDelete":156,"./_mapCacheGet":157,"./_mapCacheHas":158,"./_mapCacheSet":159}],73:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":130,"./_root":167}],74:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":130,"./_root":167}],75:[function(_dereq_,module,exports){
var ListCache = _dereq_('./_ListCache'),
    stackClear = _dereq_('./_stackClear'),
    stackDelete = _dereq_('./_stackDelete'),
    stackGet = _dereq_('./_stackGet'),
    stackHas = _dereq_('./_stackHas'),
    stackSet = _dereq_('./_stackSet');

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

},{"./_ListCache":70,"./_stackClear":171,"./_stackDelete":172,"./_stackGet":173,"./_stackHas":174,"./_stackSet":175}],76:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":167}],77:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":167}],78:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":130,"./_root":167}],79:[function(_dereq_,module,exports){
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

},{}],80:[function(_dereq_,module,exports){
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

},{}],81:[function(_dereq_,module,exports){
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

},{}],82:[function(_dereq_,module,exports){
var baseTimes = _dereq_('./_baseTimes'),
    isArguments = _dereq_('./isArguments'),
    isArray = _dereq_('./isArray'),
    isBuffer = _dereq_('./isBuffer'),
    isIndex = _dereq_('./_isIndex'),
    isTypedArray = _dereq_('./isTypedArray');

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

},{"./_baseTimes":108,"./_isIndex":145,"./isArguments":183,"./isArray":184,"./isBuffer":187,"./isTypedArray":195}],83:[function(_dereq_,module,exports){
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

},{}],84:[function(_dereq_,module,exports){
var baseAssignValue = _dereq_('./_baseAssignValue'),
    eq = _dereq_('./eq');

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

},{"./_baseAssignValue":89,"./eq":180}],85:[function(_dereq_,module,exports){
var baseAssignValue = _dereq_('./_baseAssignValue'),
    eq = _dereq_('./eq');

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

},{"./_baseAssignValue":89,"./eq":180}],86:[function(_dereq_,module,exports){
var eq = _dereq_('./eq');

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

},{"./eq":180}],87:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    keys = _dereq_('./keys');

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

},{"./_copyObject":118,"./keys":196}],88:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    keysIn = _dereq_('./keysIn');

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

},{"./_copyObject":118,"./keysIn":197}],89:[function(_dereq_,module,exports){
var defineProperty = _dereq_('./_defineProperty');

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

},{"./_defineProperty":125}],90:[function(_dereq_,module,exports){
var Stack = _dereq_('./_Stack'),
    arrayEach = _dereq_('./_arrayEach'),
    assignValue = _dereq_('./_assignValue'),
    baseAssign = _dereq_('./_baseAssign'),
    baseAssignIn = _dereq_('./_baseAssignIn'),
    cloneBuffer = _dereq_('./_cloneBuffer'),
    copyArray = _dereq_('./_copyArray'),
    copySymbols = _dereq_('./_copySymbols'),
    copySymbolsIn = _dereq_('./_copySymbolsIn'),
    getAllKeys = _dereq_('./_getAllKeys'),
    getAllKeysIn = _dereq_('./_getAllKeysIn'),
    getTag = _dereq_('./_getTag'),
    initCloneArray = _dereq_('./_initCloneArray'),
    initCloneByTag = _dereq_('./_initCloneByTag'),
    initCloneObject = _dereq_('./_initCloneObject'),
    isArray = _dereq_('./isArray'),
    isBuffer = _dereq_('./isBuffer'),
    isMap = _dereq_('./isMap'),
    isObject = _dereq_('./isObject'),
    isSet = _dereq_('./isSet'),
    keys = _dereq_('./keys');

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

},{"./_Stack":75,"./_arrayEach":80,"./_assignValue":85,"./_baseAssign":87,"./_baseAssignIn":88,"./_cloneBuffer":112,"./_copyArray":117,"./_copySymbols":119,"./_copySymbolsIn":120,"./_getAllKeys":127,"./_getAllKeysIn":128,"./_getTag":135,"./_initCloneArray":142,"./_initCloneByTag":143,"./_initCloneObject":144,"./isArray":184,"./isBuffer":187,"./isMap":190,"./isObject":191,"./isSet":194,"./keys":196}],91:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

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

},{"./isObject":191}],92:[function(_dereq_,module,exports){
var baseForOwn = _dereq_('./_baseForOwn'),
    createBaseEach = _dereq_('./_createBaseEach');

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

},{"./_baseForOwn":94,"./_createBaseEach":123}],93:[function(_dereq_,module,exports){
var createBaseFor = _dereq_('./_createBaseFor');

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

},{"./_createBaseFor":124}],94:[function(_dereq_,module,exports){
var baseFor = _dereq_('./_baseFor'),
    keys = _dereq_('./keys');

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

},{"./_baseFor":93,"./keys":196}],95:[function(_dereq_,module,exports){
var arrayPush = _dereq_('./_arrayPush'),
    isArray = _dereq_('./isArray');

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

},{"./_arrayPush":83,"./isArray":184}],96:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol'),
    getRawTag = _dereq_('./_getRawTag'),
    objectToString = _dereq_('./_objectToString');

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

},{"./_Symbol":76,"./_getRawTag":132,"./_objectToString":164}],97:[function(_dereq_,module,exports){
var baseGetTag = _dereq_('./_baseGetTag'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./_baseGetTag":96,"./isObjectLike":192}],98:[function(_dereq_,module,exports){
var getTag = _dereq_('./_getTag'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./_getTag":135,"./isObjectLike":192}],99:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isMasked = _dereq_('./_isMasked'),
    isObject = _dereq_('./isObject'),
    toSource = _dereq_('./_toSource');

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

},{"./_isMasked":148,"./_toSource":176,"./isFunction":188,"./isObject":191}],100:[function(_dereq_,module,exports){
var getTag = _dereq_('./_getTag'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./_getTag":135,"./isObjectLike":192}],101:[function(_dereq_,module,exports){
var baseGetTag = _dereq_('./_baseGetTag'),
    isLength = _dereq_('./isLength'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./_baseGetTag":96,"./isLength":189,"./isObjectLike":192}],102:[function(_dereq_,module,exports){
var isPrototype = _dereq_('./_isPrototype'),
    nativeKeys = _dereq_('./_nativeKeys');

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

},{"./_isPrototype":149,"./_nativeKeys":161}],103:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject'),
    isPrototype = _dereq_('./_isPrototype'),
    nativeKeysIn = _dereq_('./_nativeKeysIn');

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

},{"./_isPrototype":149,"./_nativeKeysIn":162,"./isObject":191}],104:[function(_dereq_,module,exports){
var Stack = _dereq_('./_Stack'),
    assignMergeValue = _dereq_('./_assignMergeValue'),
    baseFor = _dereq_('./_baseFor'),
    baseMergeDeep = _dereq_('./_baseMergeDeep'),
    isObject = _dereq_('./isObject'),
    keysIn = _dereq_('./keysIn'),
    safeGet = _dereq_('./_safeGet');

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

},{"./_Stack":75,"./_assignMergeValue":84,"./_baseFor":93,"./_baseMergeDeep":105,"./_safeGet":168,"./isObject":191,"./keysIn":197}],105:[function(_dereq_,module,exports){
var assignMergeValue = _dereq_('./_assignMergeValue'),
    cloneBuffer = _dereq_('./_cloneBuffer'),
    cloneTypedArray = _dereq_('./_cloneTypedArray'),
    copyArray = _dereq_('./_copyArray'),
    initCloneObject = _dereq_('./_initCloneObject'),
    isArguments = _dereq_('./isArguments'),
    isArray = _dereq_('./isArray'),
    isArrayLikeObject = _dereq_('./isArrayLikeObject'),
    isBuffer = _dereq_('./isBuffer'),
    isFunction = _dereq_('./isFunction'),
    isObject = _dereq_('./isObject'),
    isPlainObject = _dereq_('./isPlainObject'),
    isTypedArray = _dereq_('./isTypedArray'),
    safeGet = _dereq_('./_safeGet'),
    toPlainObject = _dereq_('./toPlainObject');

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

},{"./_assignMergeValue":84,"./_cloneBuffer":112,"./_cloneTypedArray":116,"./_copyArray":117,"./_initCloneObject":144,"./_safeGet":168,"./isArguments":183,"./isArray":184,"./isArrayLikeObject":186,"./isBuffer":187,"./isFunction":188,"./isObject":191,"./isPlainObject":193,"./isTypedArray":195,"./toPlainObject":202}],106:[function(_dereq_,module,exports){
var identity = _dereq_('./identity'),
    overRest = _dereq_('./_overRest'),
    setToString = _dereq_('./_setToString');

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

},{"./_overRest":166,"./_setToString":169,"./identity":182}],107:[function(_dereq_,module,exports){
var constant = _dereq_('./constant'),
    defineProperty = _dereq_('./_defineProperty'),
    identity = _dereq_('./identity');

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

},{"./_defineProperty":125,"./constant":179,"./identity":182}],108:[function(_dereq_,module,exports){
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

},{}],109:[function(_dereq_,module,exports){
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

},{}],110:[function(_dereq_,module,exports){
var identity = _dereq_('./identity');

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

},{"./identity":182}],111:[function(_dereq_,module,exports){
var Uint8Array = _dereq_('./_Uint8Array');

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

},{"./_Uint8Array":77}],112:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

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

},{"./_root":167}],113:[function(_dereq_,module,exports){
var cloneArrayBuffer = _dereq_('./_cloneArrayBuffer');

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

},{"./_cloneArrayBuffer":111}],114:[function(_dereq_,module,exports){
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

},{}],115:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol');

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

},{"./_Symbol":76}],116:[function(_dereq_,module,exports){
var cloneArrayBuffer = _dereq_('./_cloneArrayBuffer');

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

},{"./_cloneArrayBuffer":111}],117:[function(_dereq_,module,exports){
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

},{}],118:[function(_dereq_,module,exports){
var assignValue = _dereq_('./_assignValue'),
    baseAssignValue = _dereq_('./_baseAssignValue');

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

},{"./_assignValue":85,"./_baseAssignValue":89}],119:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    getSymbols = _dereq_('./_getSymbols');

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

},{"./_copyObject":118,"./_getSymbols":133}],120:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    getSymbolsIn = _dereq_('./_getSymbolsIn');

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

},{"./_copyObject":118,"./_getSymbolsIn":134}],121:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":167}],122:[function(_dereq_,module,exports){
var baseRest = _dereq_('./_baseRest'),
    isIterateeCall = _dereq_('./_isIterateeCall');

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

},{"./_baseRest":106,"./_isIterateeCall":146}],123:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('./isArrayLike');

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

},{"./isArrayLike":185}],124:[function(_dereq_,module,exports){
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

},{}],125:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":130}],126:[function(_dereq_,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],127:[function(_dereq_,module,exports){
var baseGetAllKeys = _dereq_('./_baseGetAllKeys'),
    getSymbols = _dereq_('./_getSymbols'),
    keys = _dereq_('./keys');

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

},{"./_baseGetAllKeys":95,"./_getSymbols":133,"./keys":196}],128:[function(_dereq_,module,exports){
var baseGetAllKeys = _dereq_('./_baseGetAllKeys'),
    getSymbolsIn = _dereq_('./_getSymbolsIn'),
    keysIn = _dereq_('./keysIn');

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

},{"./_baseGetAllKeys":95,"./_getSymbolsIn":134,"./keysIn":197}],129:[function(_dereq_,module,exports){
var isKeyable = _dereq_('./_isKeyable');

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

},{"./_isKeyable":147}],130:[function(_dereq_,module,exports){
var baseIsNative = _dereq_('./_baseIsNative'),
    getValue = _dereq_('./_getValue');

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

},{"./_baseIsNative":99,"./_getValue":136}],131:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":165}],132:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol');

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

},{"./_Symbol":76}],133:[function(_dereq_,module,exports){
var arrayFilter = _dereq_('./_arrayFilter'),
    stubArray = _dereq_('./stubArray');

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

},{"./_arrayFilter":81,"./stubArray":200}],134:[function(_dereq_,module,exports){
var arrayPush = _dereq_('./_arrayPush'),
    getPrototype = _dereq_('./_getPrototype'),
    getSymbols = _dereq_('./_getSymbols'),
    stubArray = _dereq_('./stubArray');

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

},{"./_arrayPush":83,"./_getPrototype":131,"./_getSymbols":133,"./stubArray":200}],135:[function(_dereq_,module,exports){
var DataView = _dereq_('./_DataView'),
    Map = _dereq_('./_Map'),
    Promise = _dereq_('./_Promise'),
    Set = _dereq_('./_Set'),
    WeakMap = _dereq_('./_WeakMap'),
    baseGetTag = _dereq_('./_baseGetTag'),
    toSource = _dereq_('./_toSource');

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

},{"./_DataView":68,"./_Map":71,"./_Promise":73,"./_Set":74,"./_WeakMap":78,"./_baseGetTag":96,"./_toSource":176}],136:[function(_dereq_,module,exports){
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

},{}],137:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

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

},{"./_nativeCreate":160}],138:[function(_dereq_,module,exports){
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

},{}],139:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

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

},{"./_nativeCreate":160}],140:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

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

},{"./_nativeCreate":160}],141:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

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

},{"./_nativeCreate":160}],142:[function(_dereq_,module,exports){
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

},{}],143:[function(_dereq_,module,exports){
var cloneArrayBuffer = _dereq_('./_cloneArrayBuffer'),
    cloneDataView = _dereq_('./_cloneDataView'),
    cloneRegExp = _dereq_('./_cloneRegExp'),
    cloneSymbol = _dereq_('./_cloneSymbol'),
    cloneTypedArray = _dereq_('./_cloneTypedArray');

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

},{"./_cloneArrayBuffer":111,"./_cloneDataView":113,"./_cloneRegExp":114,"./_cloneSymbol":115,"./_cloneTypedArray":116}],144:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./_baseCreate'),
    getPrototype = _dereq_('./_getPrototype'),
    isPrototype = _dereq_('./_isPrototype');

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

},{"./_baseCreate":91,"./_getPrototype":131,"./_isPrototype":149}],145:[function(_dereq_,module,exports){
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

},{}],146:[function(_dereq_,module,exports){
var eq = _dereq_('./eq'),
    isArrayLike = _dereq_('./isArrayLike'),
    isIndex = _dereq_('./_isIndex'),
    isObject = _dereq_('./isObject');

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

},{"./_isIndex":145,"./eq":180,"./isArrayLike":185,"./isObject":191}],147:[function(_dereq_,module,exports){
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

},{}],148:[function(_dereq_,module,exports){
var coreJsData = _dereq_('./_coreJsData');

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

},{"./_coreJsData":121}],149:[function(_dereq_,module,exports){
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

},{}],150:[function(_dereq_,module,exports){
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

},{}],151:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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

},{"./_assocIndexOf":86}],152:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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

},{"./_assocIndexOf":86}],153:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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

},{"./_assocIndexOf":86}],154:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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

},{"./_assocIndexOf":86}],155:[function(_dereq_,module,exports){
var Hash = _dereq_('./_Hash'),
    ListCache = _dereq_('./_ListCache'),
    Map = _dereq_('./_Map');

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

},{"./_Hash":69,"./_ListCache":70,"./_Map":71}],156:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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

},{"./_getMapData":129}],157:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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

},{"./_getMapData":129}],158:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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

},{"./_getMapData":129}],159:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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

},{"./_getMapData":129}],160:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":130}],161:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":165}],162:[function(_dereq_,module,exports){
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

},{}],163:[function(_dereq_,module,exports){
var freeGlobal = _dereq_('./_freeGlobal');

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

},{"./_freeGlobal":126}],164:[function(_dereq_,module,exports){
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

},{}],165:[function(_dereq_,module,exports){
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

},{}],166:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply');

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

},{"./_apply":79}],167:[function(_dereq_,module,exports){
var freeGlobal = _dereq_('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":126}],168:[function(_dereq_,module,exports){
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

},{}],169:[function(_dereq_,module,exports){
var baseSetToString = _dereq_('./_baseSetToString'),
    shortOut = _dereq_('./_shortOut');

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

},{"./_baseSetToString":107,"./_shortOut":170}],170:[function(_dereq_,module,exports){
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

},{}],171:[function(_dereq_,module,exports){
var ListCache = _dereq_('./_ListCache');

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

},{"./_ListCache":70}],172:[function(_dereq_,module,exports){
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

},{}],173:[function(_dereq_,module,exports){
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

},{}],174:[function(_dereq_,module,exports){
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

},{}],175:[function(_dereq_,module,exports){
var ListCache = _dereq_('./_ListCache'),
    Map = _dereq_('./_Map'),
    MapCache = _dereq_('./_MapCache');

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

},{"./_ListCache":70,"./_Map":71,"./_MapCache":72}],176:[function(_dereq_,module,exports){
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

},{}],177:[function(_dereq_,module,exports){
var assignValue = _dereq_('./_assignValue'),
    copyObject = _dereq_('./_copyObject'),
    createAssigner = _dereq_('./_createAssigner'),
    isArrayLike = _dereq_('./isArrayLike'),
    isPrototype = _dereq_('./_isPrototype'),
    keys = _dereq_('./keys');

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

},{"./_assignValue":85,"./_copyObject":118,"./_createAssigner":122,"./_isPrototype":149,"./isArrayLike":185,"./keys":196}],178:[function(_dereq_,module,exports){
var baseClone = _dereq_('./_baseClone');

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

},{"./_baseClone":90}],179:[function(_dereq_,module,exports){
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

},{}],180:[function(_dereq_,module,exports){
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

},{}],181:[function(_dereq_,module,exports){
var arrayEach = _dereq_('./_arrayEach'),
    baseEach = _dereq_('./_baseEach'),
    castFunction = _dereq_('./_castFunction'),
    isArray = _dereq_('./isArray');

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

},{"./_arrayEach":80,"./_baseEach":92,"./_castFunction":110,"./isArray":184}],182:[function(_dereq_,module,exports){
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

},{}],183:[function(_dereq_,module,exports){
var baseIsArguments = _dereq_('./_baseIsArguments'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./_baseIsArguments":97,"./isObjectLike":192}],184:[function(_dereq_,module,exports){
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

},{}],185:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isLength = _dereq_('./isLength');

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

},{"./isFunction":188,"./isLength":189}],186:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('./isArrayLike'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./isArrayLike":185,"./isObjectLike":192}],187:[function(_dereq_,module,exports){
var root = _dereq_('./_root'),
    stubFalse = _dereq_('./stubFalse');

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

},{"./_root":167,"./stubFalse":201}],188:[function(_dereq_,module,exports){
var baseGetTag = _dereq_('./_baseGetTag'),
    isObject = _dereq_('./isObject');

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

},{"./_baseGetTag":96,"./isObject":191}],189:[function(_dereq_,module,exports){
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

},{}],190:[function(_dereq_,module,exports){
var baseIsMap = _dereq_('./_baseIsMap'),
    baseUnary = _dereq_('./_baseUnary'),
    nodeUtil = _dereq_('./_nodeUtil');

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

},{"./_baseIsMap":98,"./_baseUnary":109,"./_nodeUtil":163}],191:[function(_dereq_,module,exports){
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

},{}],192:[function(_dereq_,module,exports){
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

},{}],193:[function(_dereq_,module,exports){
var baseGetTag = _dereq_('./_baseGetTag'),
    getPrototype = _dereq_('./_getPrototype'),
    isObjectLike = _dereq_('./isObjectLike');

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

},{"./_baseGetTag":96,"./_getPrototype":131,"./isObjectLike":192}],194:[function(_dereq_,module,exports){
var baseIsSet = _dereq_('./_baseIsSet'),
    baseUnary = _dereq_('./_baseUnary'),
    nodeUtil = _dereq_('./_nodeUtil');

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

},{"./_baseIsSet":100,"./_baseUnary":109,"./_nodeUtil":163}],195:[function(_dereq_,module,exports){
var baseIsTypedArray = _dereq_('./_baseIsTypedArray'),
    baseUnary = _dereq_('./_baseUnary'),
    nodeUtil = _dereq_('./_nodeUtil');

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

},{"./_baseIsTypedArray":101,"./_baseUnary":109,"./_nodeUtil":163}],196:[function(_dereq_,module,exports){
var arrayLikeKeys = _dereq_('./_arrayLikeKeys'),
    baseKeys = _dereq_('./_baseKeys'),
    isArrayLike = _dereq_('./isArrayLike');

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

},{"./_arrayLikeKeys":82,"./_baseKeys":102,"./isArrayLike":185}],197:[function(_dereq_,module,exports){
var arrayLikeKeys = _dereq_('./_arrayLikeKeys'),
    baseKeysIn = _dereq_('./_baseKeysIn'),
    isArrayLike = _dereq_('./isArrayLike');

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

},{"./_arrayLikeKeys":82,"./_baseKeysIn":103,"./isArrayLike":185}],198:[function(_dereq_,module,exports){
var baseMerge = _dereq_('./_baseMerge'),
    createAssigner = _dereq_('./_createAssigner');

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

},{"./_baseMerge":104,"./_createAssigner":122}],199:[function(_dereq_,module,exports){
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

},{}],200:[function(_dereq_,module,exports){
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

},{}],201:[function(_dereq_,module,exports){
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

},{}],202:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    keysIn = _dereq_('./keysIn');

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

},{"./_copyObject":118,"./keysIn":197}],203:[function(_dereq_,module,exports){
module.exports=_dereq_(44)
},{}],204:[function(_dereq_,module,exports){
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

var $base = _dereq_('./base');
var $delegate = _dereq_('./delegate');

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

},{"./base":63,"./delegate":64}],205:[function(_dereq_,module,exports){
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

},{}],206:[function(_dereq_,module,exports){
module.exports=_dereq_(23)
},{}],207:[function(_dereq_,module,exports){
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

exports.comma = _dereq_('./comma');
exports.fixTo = _dereq_('./fixTo');
exports.limit = _dereq_('./limit');
exports.numerical = _dereq_('./numerical');

},{"./comma":205,"./fixTo":206,"./limit":208,"./numerical":209}],208:[function(_dereq_,module,exports){
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

},{}],209:[function(_dereq_,module,exports){
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

},{}],210:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],211:[function(_dereq_,module,exports){
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

},{}],212:[function(_dereq_,module,exports){
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

},{}],213:[function(_dereq_,module,exports){
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

exports.assign = _dereq_('./assign');
exports.cover = _dereq_('./cover');
exports.find = _dereq_('./find');
exports.type = _dereq_('./type');

},{"./assign":210,"./cover":211,"./find":212,"./type":214}],214:[function(_dereq_,module,exports){
module.exports=_dereq_(14)
},{}],215:[function(_dereq_,module,exports){
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

},{}],216:[function(_dereq_,module,exports){
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

},{}],217:[function(_dereq_,module,exports){
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

},{}],218:[function(_dereq_,module,exports){
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

},{}],219:[function(_dereq_,module,exports){
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

},{}],220:[function(_dereq_,module,exports){
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

},{}],221:[function(_dereq_,module,exports){
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

exports.bLength = _dereq_('./bLength');
exports.dbcToSbc = _dereq_('./dbcToSbc');
exports.decodeHTML = _dereq_('./decodeHTML');
exports.encodeHTML = _dereq_('./encodeHTML');
exports.getUniqueKey = _dereq_('./getUniqueKey');
exports.hyphenate = _dereq_('./hyphenate');
exports.ipToHex = _dereq_('./ipToHex');
exports.leftB = _dereq_('./leftB');
exports.sizeOfUTF8String = _dereq_('./sizeOfUTF8String');
exports.substitute = _dereq_('./substitute');

},{"./bLength":215,"./dbcToSbc":216,"./decodeHTML":217,"./encodeHTML":218,"./getUniqueKey":219,"./hyphenate":220,"./ipToHex":222,"./leftB":223,"./sizeOfUTF8String":224,"./substitute":225}],222:[function(_dereq_,module,exports){
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

},{}],223:[function(_dereq_,module,exports){
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

var $bLength = _dereq_('./bLength');

function leftB (str, lens) {
	var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
	str = str.slice(0, s.slice(0, lens).replace(/\*\*/g, ' ').replace(/\*/g, '').length);
	if ($bLength(str) > lens && lens > 0) {
		str = str.slice(0, str.length - 1);
	}
	return str;
}

module.exports = leftB;

},{"./bLength":215}],224:[function(_dereq_,module,exports){
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

},{}],225:[function(_dereq_,module,exports){
module.exports=_dereq_(25)
},{}],226:[function(_dereq_,module,exports){
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

var $erase = _dereq_('spore-kit-arr/erase');
var $assign = _dereq_('spore-kit-obj/assign');

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

},{"spore-kit-arr/erase":228,"spore-kit-obj/assign":230}],227:[function(_dereq_,module,exports){
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

exports.countDown = _dereq_('./countDown');
exports.parseUnit = _dereq_('./parseUnit');

},{"./countDown":226,"./parseUnit":231}],228:[function(_dereq_,module,exports){
module.exports=_dereq_(9)
},{}],229:[function(_dereq_,module,exports){
module.exports=_dereq_(209)
},{}],230:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],231:[function(_dereq_,module,exports){
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

var $numerical = _dereq_('spore-kit-num/numerical');
var $assign = _dereq_('spore-kit-obj/assign');

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

},{"spore-kit-num/numerical":229,"spore-kit-obj/assign":230}]},{},[1])
(1)
});