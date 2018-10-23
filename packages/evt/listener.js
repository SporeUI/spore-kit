/**
 * 广播组件
 * @example
 * 	var channelGlobal = new Listener([
 * 		'event1'
 * 	]);
 * 	channelGlobal.on('event1', function(){
 * 		console.log('event1');
 * 	});
 * 	channelGlobal.on('event2', function(){
 * 		//will not run
 * 		console.log('event2');
 * 	});
 * 	channelGlobal.trigger('event1');
 * 	channelGlobal.trigger('event2');
 */

var $events = require('./events');
// Listener
// -----------------
// 用于全局广播的白名单控制机制

var Listener = function(events) {
	this._whiteList = {};
	this._receiver = new $events();
	if (Array.isArray(events)) {
		events.forEach(this.define.bind(this));
	}
};

// 事件添加，移除，激发的调用方法参考Events
Listener.prototype = {
	constructor: Listener,
	// 在白名单上定义一个事件名称
	define: function(eventName) {
		this._whiteList[eventName] = true;
	},
	// 取消白名单上的事件名称
	undefine: function(eventName) {
		delete this._whiteList[eventName];
	},
	on: function() {
		this._receiver.on.apply(this._receiver, arguments);
	},
	off: function() {
		this._receiver.off.apply(this._receiver, arguments);
	},
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
