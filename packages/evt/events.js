/**
 * A module that can be mixed in to *any object* in order to provide it
 * with custom events. You may bind with `on` or remove with `off` callback
 * functions to an event; `trigger`-ing an event fires all callbacks in
 * succession.
 *
 * 一个可以被混合到任何对象的模块，用于提供自定义事件。
 * 可以用 on, off 方法来绑定移除事件。
 * 用 trigger 来触发事件通知
 *
 * @class Events
 * @see http://aralejs.org/
 * @see https://github.com/documentcloud/backbone/blob/master/backbone.js
 * @see https://github.com/joyent/node/blob/master/lib/events.js
 * @example
 * var Events = require('spore-kit-evt/events');
 *
 * var $kit = require('spore-kit');
 * var Events = $kit.evt.events;
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
 *
 * 绑定一个事件回调函数，或者用多个空格分隔来绑定多个事件回调函数。
 * 传入参数 `'all'` 会在所有事件发生时被触发。
 *
 * @method Events.prototype.on
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
 *
 * 移除一个或者多个事件回调函数。
 * 如果不传递 callback 参数，会移除所有该时间名称的事件回调函数。
 * 如果不指定事件名称，移除所有自定义事件回调函数。
 *
 * @method Events.prototype.off
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
 *
 * 派发一个或者多个事件，会触发对应事件名称绑定的所有事件函数。
 * 第一个参数是事件名称，剩下其他参数将作为事件回调的参数。
 *
 * @method Events.prototype.trigger
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
 *
 * 将自定事件对象，混合到一个类的实例。
 *
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
