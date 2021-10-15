/**
 * 模型类: 基础工厂元件类，用于做数据包装，提供可观察的数据对象
 * - 继承自 spore-kit/packages/mvc/base
 * @module Model
 * @param {Object} [options] 初始数据
 * @example
 * var $model = require('spore-kit/packages/mvc/model');
 *
 * var m1 = new $model({
 *   a : 1
 * });
 * m1.on('change:a', function(prevA){
 *   console.info(prevA); // 1
 * });
 * m1.on('change', function(){
 *   console.info('model changed');
 * });
 * m1.set('a', 2);
 *
 * var MyModel = Model.extend({
 *   defaults : {
 *     a : 2,
 *     b : 2
 *   },
 *   events : {
 *     'change:a' : 'updateB'
 *   },
 *   updateB : function(){
 *     this.set('b', this.get('a') + 1);
 *   }
 * });
 *
 * var m2 = new MyModel();
 * console.info(m2.get('b')); // 2
 *
 * m2.set('a', 3);
 * console.info(m2.get('b')); // 4
 *
 * m2.set('b', 5);
 * console.info(m2.get('b')); // 5
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

var setAttr = function (key, value) {
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

var getAttr = function (key) {
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

var removeAttr = function (key) {
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
   * processors : {
   *   name : {
   *     set : function(value){
   *       return value;
   *     },
   *     get : function(value){
   *       return value;
   *     }
   *   }
   * }
   */
  processors: {},

  initialize: function (options) {
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
  setOptions: function (options) {
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
  delegate: function (action, root, events, bind) {
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
  process: function (name, spec) {
    spec = $assign({
      set: function (value) {
        return value;
      },
      get: function (value) {
        return value;
      },
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
  set: function (key, val) {
    if ($isPlainObject(key)) {
      $forEach(key, function (v, k) {
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
  get: function (key) {
    if (typeof key === 'string') {
      if (!this[DATA]) {
        return;
      }
      return getAttr.call(this, key);
    }
    if (typeof key === 'undefined') {
      var data = {};
      $forEach(this.keys(), function (k) {
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
  keys: function () {
    return Object.keys(this[DATA] || {});
  },

  /**
   * 删除模型上的一个键
   * @method Model#remove
   * @memberof Model
   * @param {String} key 属性名称。
   */
  remove: function (key) {
    removeAttr.call(this, key);
    this.trigger('change');
  },

  /**
   * 清除模型中所有数据
   * @method Model#clear
   * @memberof Model
   */
  clear: function () {
    Object.keys(this[DATA]).forEach(removeAttr, this);
    this.trigger('change');
  },

  /**
   * 销毁模型，不会触发任何change事件。
   * - 模型销毁后，无法再设置任何数据。
   * @method Model#destroy
   * @memberof Model
   */
  destroy: function () {
    this.changed = false;
    this.delegate('off');
    this.supr();
    this.clear();
    this[DATA] = null;
  },
});

module.exports = Model;
