/**
 * 视图类: 基础工厂元件类，用于对视图组件的包装
 * - 依赖 jQuery/Zepto
 * - 继承自 spore-kit/packages/mvc/base
 * @module mvc/View
 * @param {Object} [options] 选项
 * @param {String|Object} [options.node] 选择器字符串，或者DOM元素，或者jquery对象，用于指定视图的根节点。
 * @param {String} [options.template] 视图的模板字符串，也可以是个字符串数组，创建视图DOM时会自动join为字符串处理。
 * @param {Object} [options.events] 用于覆盖代理事件列表。
 * @param {Object} [options.role] 角色对象映射表，可指定role方法返回的jquery对象。
 * @example
 * var $view = require('spore-kit/packages/mvc/view');
 *
 * var TPL = {
 *   box : [
 *     '<div>',
 *       '<button role="button"></button>',
 *     '</div>'
 *   ]
 * };
 *
 * var TestView = $view.extend({
 *   defaults : {
 *     template : TPL.box
 *   },
 *   events : {
 *     'button click' : 'method1'
 *   },
 *   build : function(){
 *     this.role('root').appendTo(document.body);
 *   },
 *   method1 : function(evt){
 *     console.info(1);
 *   },
 *   method2 : function(evt){
 *     console.info(2);
 *   }
 * });
 *
 * var obj1 = new TestView();
 * var obj2 = new TestView({
 *   events : {
 *     'button click' : 'method2'
 *   }
 * });
 *
 * obj1.role('button').trigger('click'); // 1
 * obj2.role('button').trigger('click'); // 2
 */

var $base = require('./base');
var $delegate = require('./delegate');

function get$() {
  return (window.$ || window.jQuery || window.Zepto);
}

// 获取视图的根节点
var getRoot = function () {
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
   * @memberof mvc/View
   */
  defaults: {
    node: '',
    template: '',
    events: {},
    role: {},
  },

  /**
   * 视图的代理事件绑定列表，绑定在原型上，不要在实例中直接修改这个对象。
   * - 事件绑定格式可以为：
   * - {'selector event':'method'}
   * - {'selector event':'method1 method2'}
   * @name View#events
   * @type {Object}
   * @memberof mvc/View
   */
  events: {},

  initialize: function (options) {
    this.nodes = {};

    this.setOptions(options);
    this.build();
    this.delegate('on');
    this.setEvents('on');
  },

  /**
   * 深度混合传入的选项与默认选项，混合完成的选项对象可通过 this.conf 属性访问
   * @method View#setOptions
   * @memberof mvc/View
   * @param {Object} [options] 选项
   */
  setOptions: function (options) {
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
   * @memberof mvc/View
   * @see spore-kit/packages/mvc/delegate
   * @param {String} [action='on'] 绑定动作标记。可选：['on', 'off']
   */
  delegate: function (action, root, events, bind) {
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
   * @memberof mvc/View
   * @param {String} name 角色对象名称
   * @param {Object} [element] 角色对象指定的dom元素或者 jQuery 对象。
   * @returns {Object} 角色名对应的 jQuery 对象。
   */
  role: function (name, element) {
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
   * @memberof mvc/View
   */
  resetRoles: function () {
    var $ = get$();
    var nodes = this.nodes;
    $.each(nodes, function (name) {
      if (name !== 'root') {
        nodes[name] = null;
        delete nodes[name];
      }
    });
  },

  /**
   * 销毁视图，释放内存
   * @method View#destroy
   * @memberof mvc/View
   */
  destroy: function () {
    this.delegate('off');
    this.supr();
    this.resetRoles();
    this.nodes = {};
  },
});

module.exports = View;
