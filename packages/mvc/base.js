/**
 * 基础工厂元件类
 * - 该类混合了 [evt/Events](#evt-events) 的方法。
 * @param {Object} [options] 选项
 * @module mvc/Base
 * @example
 * var $base = require('@spore-ui/kit/packages/mvc/base');
 *
 * var ChildClass = $base.extend({
 *   defaults : {
 *     node : null
 *   },
 *   build : function() {
 *     this.node = $(this.conf.node);
 *   },
 *   setEvents : function(action) {
 *     var proxy = this.proxy();
 *     this.node[action]('click', proxy('onclick'));
 *   },
 *   onclick : function() {
 *     console.info('clicked');
 *     this.trigger('click');
 *   }
 * });
 *
 * var obj = new ChildClass({
 *   node : document.body
 * });
 *
 * obj.on('click', function() {
 *   console.info('obj is clicked');
 * });
 */

var $merge = require('lodash/merge');
var $noop = require('lodash/noop');
var $isPlainObject = require('lodash/isPlainObject');
var $events = require('../evt/events');
var $klass = require('./klass');
var $proxy = require('./proxy');

var Base = $klass({
  /**
   * 类的默认选项对象，绑定在原型上，不要在实例中直接修改这个对象
   * @name Base#defaults
   * @type {Object}
   * @memberof mvc/Base
   */
  defaults: {},

  /**
   * 类的实际选项，setOptions 方法会修改这个对象
   * @name Base#conf
   * @type {Object}
   * @memberof mvc/Base
   */

  /**
   * 存放代理函数的集合
   * @name Base#bound
   * @type {Object}
   * @memberof mvc/Base
   */

  initialize: function (options) {
    this.setOptions(options);
    this.build();
    this.setEvents('on');
  },

  /**
   * 深度混合传入的选项与默认选项，混合完成的选项对象可通过 this.conf 属性访问
   * @method Base#setOptions
   * @memberof mvc/Base
   * @param {Object} [options] 选项
   */
  setOptions: function (options) {
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
   * @memberof mvc/Base
   */
  build: $noop,

  /**
   * 元件事件绑定接口函数，实例化元件时会自动在 build 之后调用
   * @method Base#setEvents
   * @memberof mvc/Base
   * @param {String} [action='on'] 绑定或者移除事件的标记，可选值有：['on', 'off']
   */
  setEvents: $noop,

  /**
   * 函数代理，确保函数在当前类创建的实例上下文中执行。
   * 这些用于绑定事件的代理函数都放在属性 this.bound 上。
   * @method Base#proxy
   * @memberof mvc/Base
   * @param {string} [name='proxy'] 函数名称
   */
  proxy: function (name) {
    var proxyArgs = Array.prototype.slice.call(arguments);
    return $proxy(this, name, proxyArgs);
  },

  /**
   * 移除所有绑定事件，清除用于绑定事件的代理函数
   * @method Base#destroy
   * @memberof mvc/Base
   */
  destroy: function () {
    this.setEvents('off');
    this.off();
    this.bound = null;
  },
});

Base.methods($events.prototype);

module.exports = Base;
