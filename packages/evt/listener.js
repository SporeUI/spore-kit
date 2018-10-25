/**
 * 广播组件
 *
 * 构造实例时，需要传入事件白名单列表。
 * 只有在白名单列表上的事件才可以被触发。
 * 事件添加，移除，激发的调用方法参考 Events。
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
