/* eslint-disable no-underscore-dangle */
/**
 * class 的 ES5 实现
 * - 为代码通过 eslint 检查做了些修改
 * @module klass
 * @see https://github.com/ded/klass
 */

var fnTest = (/xyz/).test(function () { var xyz; return xyz; }) ? (/\bsupr\b/) : (/.*/);
var proto = 'prototype';

function isFn(o) {
  return typeof o === 'function';
}

function wrap(k, fn, supr) {
  return function () {
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

function execProcess(what, o, supr) {
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
  var Noop = function () {};
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

  fn.methods = function (obj) {
    execProcess(prototype, obj, supr);
    fn[proto] = prototype;
    return this;
  };

  fn.methods.call(fn, _methods).prototype.constructor = fn;

  fn.extend = extend;
  fn.statics = function (spec, optFn) {
    spec = typeof spec === 'string' ? (function () {
      var obj = {};
      obj[spec] = optFn;
      return obj;
    }()) : spec;
    execProcess(this, spec, supr);
    return this;
  };

  fn[proto].implement = fn.statics;

  return fn;
}

function klass(o) {
  return extend.call(isFn(o) ? o : function () {}, o, 1);
}

module.exports = klass;
