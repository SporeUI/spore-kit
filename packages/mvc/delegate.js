/**
 * 事件对象绑定，将events中包含的键值对映射为代理的事件。
 * - 事件键值对格式可以为：
 * - {'selector event':'method'}
 * - {'event':'method'}
 * - {'selector event':'method1 method2'}
 * - {'event':'method1 method2'}
 * @method delegate
 * @param {Boolean} action 开/关代理，可选：['on', 'off']。
 * @param {Object} root 设置代理的根节点，可以是一个jquery对象，或者是混合了 spore-kit/packages/evt/events 方法的对象。
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
