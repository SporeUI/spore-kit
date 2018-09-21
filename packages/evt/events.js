/**
 * @module spore-kit-evt/src/events
 * @see http://aralejs.org/
 * @see https://github.com/documentcloud/backbone/blob/master/backbone.js
 * @see https://github.com/joyent/node/blob/master/lib/events.js
 * @example
 * var $events = require('spore-kit-evt/src/events');
 * var object = new $events();
 * object.on('expand', function(){ alert('expanded'); });
 * object.trigger('expand');
 *
 * //给一个对象混合events的方法
 * var obj = {};
 * $events.mixTo(obj);
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

/**
 * Events
 *
 * A module that can be mixed in to *any object* in order to provide it
 * with custom events. You may bind with `on` or remove with `off` callback
 * functions to an event; `trigger`-ing an event fires all callbacks in
 * succession.
 *
 * @constructor module:lib/more/events
 */

var Events = function() {};

/**
 * Bind one or more space separated events, `events`, to a `callback`
 * function. Passing `"all"` will bind the callback to all events fired.
 *
 * @function on
 * @memberof module:lib/more/events
 * @param {string} events 事件名称
 * @param {function} callback 事件回调函数
 * @param {object} [context] 回调函数的执行环境对象
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
 * @function off
 * @memberof module:lib/more/events
 * @param {string} [events] 事件名称
 * @param {function} [callback] 要移除的事件回调函数
 * @param {object} [context] 要移除的回调函数的执行环境对象
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
 * @function trigger
 * @memberof module:lib/more/events
 * @param {string} events 事件名称
 * @param {...*} [arg] 事件参数
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
 * @function Events.mixTo
 * @memberof module:lib/more/events
 * @param {object} receiver 要混合事件函数的对象
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
