!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sporeKit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
exports.app = _dereq_('./packages/app');
exports.arr = _dereq_('./packages/arr');
exports.cookie = _dereq_('./packages/cookie');
exports.date = _dereq_('./packages/date');
exports.dom = _dereq_('./packages/dom');
exports.env = _dereq_('./packages/env');
exports.evt = _dereq_('./packages/evt');
exports.fn = _dereq_('./packages/fn');
exports.fx = _dereq_('./packages/fx');
exports.io = _dereq_('./packages/io');
exports.location = _dereq_('./packages/location');
exports.mvc = _dereq_('./packages/mvc');
exports.num = _dereq_('./packages/num');
exports.obj = _dereq_('./packages/obj');
exports.str = _dereq_('./packages/str');
exports.time = _dereq_('./packages/time');
exports.util = _dereq_('./packages/util');

},{"./packages/app":160,"./packages/arr":166,"./packages/cookie":168,"./packages/date":174,"./packages/dom":175,"./packages/env":181,"./packages/evt":188,"./packages/fn":193,"./packages/fx":202,"./packages/io":210,"./packages/location":213,"./packages/mvc":218,"./packages/num":225,"./packages/obj":231,"./packages/str":241,"./packages/time":247,"./packages/util":254}],2:[function(_dereq_,module,exports){
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

},{"dom-support":3,"get-document":5,"within-element":158}],3:[function(_dereq_,module,exports){
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

},{"domready":4}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){

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

},{}],6:[function(_dereq_,module,exports){
/*! js-cookie v3.0.1 | MIT */
;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (function () {
    var current = global.Cookies;
    var exports = global.Cookies = factory();
    exports.noConflict = function () { global.Cookies = current; return exports; };
  }()));
}(this, (function () { 'use strict';

  /* eslint-disable no-var */
  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target
  }
  /* eslint-enable no-var */

  /* eslint-disable no-var */
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };
  /* eslint-enable no-var */

  /* eslint-disable no-var */

  function init (converter, defaultAttributes) {
    function set (key, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        key + '=' + converter.write(value, key) + stringifiedAttributes)
    }

    function get (key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(
            key,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });
  /* eslint-enable no-var */

  return api;

})));

},{}],7:[function(_dereq_,module,exports){
/*!
  * klass: a classical JS OOP façade
  * https://github.com/ded/klass
  * License MIT (c) Dustin Diaz 2014
  */

!function (name, context, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else context[name] = definition()
}('klass', this, function () {
  var context = this
    , f = 'function'
    , fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/
    , proto = 'prototype'

  function klass(o) {
    return extend.call(isFn(o) ? o : function () {}, o, 1)
  }

  function isFn(o) {
    return typeof o === f
  }

  function wrap(k, fn, supr) {
    return function () {
      var tmp = this.supr
      this.supr = supr[proto][k]
      var undef = {}.fabricatedUndefined
      var ret = undef
      try {
        ret = fn.apply(this, arguments)
      } finally {
        this.supr = tmp
      }
      return ret
    }
  }

  function process(what, o, supr) {
    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        what[k] = isFn(o[k])
          && isFn(supr[proto][k])
          && fnTest.test(o[k])
          ? wrap(k, o[k], supr) : o[k]
      }
    }
  }

  function extend(o, fromSub) {
    // must redefine noop each time so it doesn't inherit from previous arbitrary classes
    function noop() {}
    noop[proto] = this[proto]
    var supr = this
      , prototype = new noop()
      , isFunction = isFn(o)
      , _constructor = isFunction ? o : this
      , _methods = isFunction ? {} : o
    function fn() {
      if (this.initialize) this.initialize.apply(this, arguments)
      else {
        fromSub || isFunction && supr.apply(this, arguments)
        _constructor.apply(this, arguments)
      }
    }

    fn.methods = function (o) {
      process(prototype, o, supr)
      fn[proto] = prototype
      return this
    }

    fn.methods.call(fn, _methods).prototype.constructor = fn

    fn.extend = arguments.callee
    fn[proto].implement = fn.statics = function (o, optFn) {
      o = typeof o == 'string' ? (function () {
        var obj = {}
        obj[o] = optFn
        return obj
      }()) : o
      process(this, o, supr)
      return this
    }

    return fn
  }

  return klass
});

},{}],8:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":74,"./_root":113}],9:[function(_dereq_,module,exports){
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

},{"./_hashClear":81,"./_hashDelete":82,"./_hashGet":83,"./_hashHas":84,"./_hashSet":85}],10:[function(_dereq_,module,exports){
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

},{"./_listCacheClear":95,"./_listCacheDelete":96,"./_listCacheGet":97,"./_listCacheHas":98,"./_listCacheSet":99}],11:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":74,"./_root":113}],12:[function(_dereq_,module,exports){
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

},{"./_mapCacheClear":100,"./_mapCacheDelete":101,"./_mapCacheGet":102,"./_mapCacheHas":103,"./_mapCacheSet":104}],13:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":74,"./_root":113}],14:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":74,"./_root":113}],15:[function(_dereq_,module,exports){
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

},{"./_ListCache":10,"./_stackClear":117,"./_stackDelete":118,"./_stackGet":119,"./_stackHas":120,"./_stackSet":121}],16:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":113}],17:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":113}],18:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":74,"./_root":113}],19:[function(_dereq_,module,exports){
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

},{}],20:[function(_dereq_,module,exports){
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

},{}],21:[function(_dereq_,module,exports){
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

},{}],22:[function(_dereq_,module,exports){
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

},{"./_baseTimes":50,"./_isIndex":89,"./isArguments":132,"./isArray":133,"./isBuffer":136,"./isTypedArray":145}],23:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],24:[function(_dereq_,module,exports){
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

},{}],25:[function(_dereq_,module,exports){
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

},{"./_baseAssignValue":30,"./eq":128}],26:[function(_dereq_,module,exports){
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

},{"./_baseAssignValue":30,"./eq":128}],27:[function(_dereq_,module,exports){
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

},{"./eq":128}],28:[function(_dereq_,module,exports){
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

},{"./_copyObject":62,"./keys":146}],29:[function(_dereq_,module,exports){
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

},{"./_copyObject":62,"./keysIn":147}],30:[function(_dereq_,module,exports){
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

},{"./_defineProperty":69}],31:[function(_dereq_,module,exports){
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
    keys = _dereq_('./keys'),
    keysIn = _dereq_('./keysIn');

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
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
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

},{"./_Stack":15,"./_arrayEach":20,"./_assignValue":26,"./_baseAssign":28,"./_baseAssignIn":29,"./_cloneBuffer":56,"./_copyArray":61,"./_copySymbols":63,"./_copySymbolsIn":64,"./_getAllKeys":71,"./_getAllKeysIn":72,"./_getTag":79,"./_initCloneArray":86,"./_initCloneByTag":87,"./_initCloneObject":88,"./isArray":133,"./isBuffer":136,"./isMap":139,"./isObject":140,"./isSet":143,"./keys":146,"./keysIn":147}],32:[function(_dereq_,module,exports){
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

},{"./isObject":140}],33:[function(_dereq_,module,exports){
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

},{"./_baseForOwn":35,"./_createBaseEach":67}],34:[function(_dereq_,module,exports){
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

},{"./_createBaseFor":68}],35:[function(_dereq_,module,exports){
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

},{"./_baseFor":34,"./keys":146}],36:[function(_dereq_,module,exports){
var castPath = _dereq_('./_castPath'),
    toKey = _dereq_('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":54,"./_toKey":123}],37:[function(_dereq_,module,exports){
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

},{"./_arrayPush":24,"./isArray":133}],38:[function(_dereq_,module,exports){
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

},{"./_Symbol":16,"./_getRawTag":76,"./_objectToString":110}],39:[function(_dereq_,module,exports){
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

},{"./_baseGetTag":38,"./isObjectLike":141}],40:[function(_dereq_,module,exports){
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

},{"./_getTag":79,"./isObjectLike":141}],41:[function(_dereq_,module,exports){
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

},{"./_isMasked":93,"./_toSource":124,"./isFunction":137,"./isObject":140}],42:[function(_dereq_,module,exports){
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

},{"./_getTag":79,"./isObjectLike":141}],43:[function(_dereq_,module,exports){
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

},{"./_baseGetTag":38,"./isLength":138,"./isObjectLike":141}],44:[function(_dereq_,module,exports){
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

},{"./_isPrototype":94,"./_nativeKeys":107}],45:[function(_dereq_,module,exports){
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

},{"./_isPrototype":94,"./_nativeKeysIn":108,"./isObject":140}],46:[function(_dereq_,module,exports){
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
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
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

},{"./_Stack":15,"./_assignMergeValue":25,"./_baseFor":34,"./_baseMergeDeep":47,"./_safeGet":114,"./isObject":140,"./keysIn":147}],47:[function(_dereq_,module,exports){
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

},{"./_assignMergeValue":25,"./_cloneBuffer":56,"./_cloneTypedArray":60,"./_copyArray":61,"./_initCloneObject":88,"./_safeGet":114,"./isArguments":132,"./isArray":133,"./isArrayLikeObject":135,"./isBuffer":136,"./isFunction":137,"./isObject":140,"./isPlainObject":142,"./isTypedArray":145,"./toPlainObject":153}],48:[function(_dereq_,module,exports){
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

},{"./_overRest":112,"./_setToString":115,"./identity":131}],49:[function(_dereq_,module,exports){
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

},{"./_defineProperty":69,"./constant":127,"./identity":131}],50:[function(_dereq_,module,exports){
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

},{}],51:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol'),
    arrayMap = _dereq_('./_arrayMap'),
    isArray = _dereq_('./isArray'),
    isSymbol = _dereq_('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":16,"./_arrayMap":23,"./isArray":133,"./isSymbol":144}],52:[function(_dereq_,module,exports){
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

},{}],53:[function(_dereq_,module,exports){
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

},{"./identity":131}],54:[function(_dereq_,module,exports){
var isArray = _dereq_('./isArray'),
    isKey = _dereq_('./_isKey'),
    stringToPath = _dereq_('./_stringToPath'),
    toString = _dereq_('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

},{"./_isKey":91,"./_stringToPath":122,"./isArray":133,"./toString":154}],55:[function(_dereq_,module,exports){
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

},{"./_Uint8Array":17}],56:[function(_dereq_,module,exports){
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

},{"./_root":113}],57:[function(_dereq_,module,exports){
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

},{"./_cloneArrayBuffer":55}],58:[function(_dereq_,module,exports){
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

},{}],59:[function(_dereq_,module,exports){
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

},{"./_Symbol":16}],60:[function(_dereq_,module,exports){
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

},{"./_cloneArrayBuffer":55}],61:[function(_dereq_,module,exports){
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

},{}],62:[function(_dereq_,module,exports){
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

},{"./_assignValue":26,"./_baseAssignValue":30}],63:[function(_dereq_,module,exports){
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

},{"./_copyObject":62,"./_getSymbols":77}],64:[function(_dereq_,module,exports){
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

},{"./_copyObject":62,"./_getSymbolsIn":78}],65:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":113}],66:[function(_dereq_,module,exports){
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

},{"./_baseRest":48,"./_isIterateeCall":90}],67:[function(_dereq_,module,exports){
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

},{"./isArrayLike":134}],68:[function(_dereq_,module,exports){
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

},{}],69:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":74}],70:[function(_dereq_,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],71:[function(_dereq_,module,exports){
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

},{"./_baseGetAllKeys":37,"./_getSymbols":77,"./keys":146}],72:[function(_dereq_,module,exports){
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

},{"./_baseGetAllKeys":37,"./_getSymbolsIn":78,"./keysIn":147}],73:[function(_dereq_,module,exports){
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

},{"./_isKeyable":92}],74:[function(_dereq_,module,exports){
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

},{"./_baseIsNative":41,"./_getValue":80}],75:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":111}],76:[function(_dereq_,module,exports){
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

},{"./_Symbol":16}],77:[function(_dereq_,module,exports){
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

},{"./_arrayFilter":21,"./stubArray":151}],78:[function(_dereq_,module,exports){
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

},{"./_arrayPush":24,"./_getPrototype":75,"./_getSymbols":77,"./stubArray":151}],79:[function(_dereq_,module,exports){
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

},{"./_DataView":8,"./_Map":11,"./_Promise":13,"./_Set":14,"./_WeakMap":18,"./_baseGetTag":38,"./_toSource":124}],80:[function(_dereq_,module,exports){
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

},{}],81:[function(_dereq_,module,exports){
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

},{"./_nativeCreate":106}],82:[function(_dereq_,module,exports){
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

},{}],83:[function(_dereq_,module,exports){
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

},{"./_nativeCreate":106}],84:[function(_dereq_,module,exports){
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

},{"./_nativeCreate":106}],85:[function(_dereq_,module,exports){
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

},{"./_nativeCreate":106}],86:[function(_dereq_,module,exports){
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

},{}],87:[function(_dereq_,module,exports){
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

},{"./_cloneArrayBuffer":55,"./_cloneDataView":57,"./_cloneRegExp":58,"./_cloneSymbol":59,"./_cloneTypedArray":60}],88:[function(_dereq_,module,exports){
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

},{"./_baseCreate":32,"./_getPrototype":75,"./_isPrototype":94}],89:[function(_dereq_,module,exports){
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

},{}],90:[function(_dereq_,module,exports){
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

},{"./_isIndex":89,"./eq":128,"./isArrayLike":134,"./isObject":140}],91:[function(_dereq_,module,exports){
var isArray = _dereq_('./isArray'),
    isSymbol = _dereq_('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":133,"./isSymbol":144}],92:[function(_dereq_,module,exports){
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

},{}],93:[function(_dereq_,module,exports){
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

},{"./_coreJsData":65}],94:[function(_dereq_,module,exports){
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

},{}],95:[function(_dereq_,module,exports){
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

},{}],96:[function(_dereq_,module,exports){
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

},{"./_assocIndexOf":27}],97:[function(_dereq_,module,exports){
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

},{"./_assocIndexOf":27}],98:[function(_dereq_,module,exports){
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

},{"./_assocIndexOf":27}],99:[function(_dereq_,module,exports){
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

},{"./_assocIndexOf":27}],100:[function(_dereq_,module,exports){
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

},{"./_Hash":9,"./_ListCache":10,"./_Map":11}],101:[function(_dereq_,module,exports){
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

},{"./_getMapData":73}],102:[function(_dereq_,module,exports){
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

},{"./_getMapData":73}],103:[function(_dereq_,module,exports){
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

},{"./_getMapData":73}],104:[function(_dereq_,module,exports){
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

},{"./_getMapData":73}],105:[function(_dereq_,module,exports){
var memoize = _dereq_('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

},{"./memoize":148}],106:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":74}],107:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":111}],108:[function(_dereq_,module,exports){
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

},{}],109:[function(_dereq_,module,exports){
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

},{"./_freeGlobal":70}],110:[function(_dereq_,module,exports){
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

},{}],111:[function(_dereq_,module,exports){
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

},{}],112:[function(_dereq_,module,exports){
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

},{"./_apply":19}],113:[function(_dereq_,module,exports){
var freeGlobal = _dereq_('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":70}],114:[function(_dereq_,module,exports){
/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

module.exports = safeGet;

},{}],115:[function(_dereq_,module,exports){
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

},{"./_baseSetToString":49,"./_shortOut":116}],116:[function(_dereq_,module,exports){
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

},{}],117:[function(_dereq_,module,exports){
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

},{"./_ListCache":10}],118:[function(_dereq_,module,exports){
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

},{}],119:[function(_dereq_,module,exports){
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

},{}],120:[function(_dereq_,module,exports){
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

},{}],121:[function(_dereq_,module,exports){
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

},{"./_ListCache":10,"./_Map":11,"./_MapCache":12}],122:[function(_dereq_,module,exports){
var memoizeCapped = _dereq_('./_memoizeCapped');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./_memoizeCapped":105}],123:[function(_dereq_,module,exports){
var isSymbol = _dereq_('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":144}],124:[function(_dereq_,module,exports){
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

},{}],125:[function(_dereq_,module,exports){
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

},{"./_assignValue":26,"./_copyObject":62,"./_createAssigner":66,"./_isPrototype":94,"./isArrayLike":134,"./keys":146}],126:[function(_dereq_,module,exports){
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

},{"./_baseClone":31}],127:[function(_dereq_,module,exports){
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

},{}],128:[function(_dereq_,module,exports){
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

},{}],129:[function(_dereq_,module,exports){
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

},{"./_arrayEach":20,"./_baseEach":33,"./_castFunction":53,"./isArray":133}],130:[function(_dereq_,module,exports){
var baseGet = _dereq_('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":36}],131:[function(_dereq_,module,exports){
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

},{}],132:[function(_dereq_,module,exports){
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

},{"./_baseIsArguments":39,"./isObjectLike":141}],133:[function(_dereq_,module,exports){
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

},{}],134:[function(_dereq_,module,exports){
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

},{"./isFunction":137,"./isLength":138}],135:[function(_dereq_,module,exports){
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

},{"./isArrayLike":134,"./isObjectLike":141}],136:[function(_dereq_,module,exports){
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

},{"./_root":113,"./stubFalse":152}],137:[function(_dereq_,module,exports){
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

},{"./_baseGetTag":38,"./isObject":140}],138:[function(_dereq_,module,exports){
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

},{}],139:[function(_dereq_,module,exports){
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

},{"./_baseIsMap":40,"./_baseUnary":52,"./_nodeUtil":109}],140:[function(_dereq_,module,exports){
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

},{}],141:[function(_dereq_,module,exports){
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

},{}],142:[function(_dereq_,module,exports){
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

},{"./_baseGetTag":38,"./_getPrototype":75,"./isObjectLike":141}],143:[function(_dereq_,module,exports){
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

},{"./_baseIsSet":42,"./_baseUnary":52,"./_nodeUtil":109}],144:[function(_dereq_,module,exports){
var baseGetTag = _dereq_('./_baseGetTag'),
    isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":38,"./isObjectLike":141}],145:[function(_dereq_,module,exports){
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

},{"./_baseIsTypedArray":43,"./_baseUnary":52,"./_nodeUtil":109}],146:[function(_dereq_,module,exports){
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

},{"./_arrayLikeKeys":22,"./_baseKeys":44,"./isArrayLike":134}],147:[function(_dereq_,module,exports){
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

},{"./_arrayLikeKeys":22,"./_baseKeysIn":45,"./isArrayLike":134}],148:[function(_dereq_,module,exports){
var MapCache = _dereq_('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":12}],149:[function(_dereq_,module,exports){
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

},{"./_baseMerge":46,"./_createAssigner":66}],150:[function(_dereq_,module,exports){
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

},{}],151:[function(_dereq_,module,exports){
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

},{}],152:[function(_dereq_,module,exports){
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

},{}],153:[function(_dereq_,module,exports){
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

},{"./_copyObject":62,"./keysIn":147}],154:[function(_dereq_,module,exports){
var baseToString = _dereq_('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":51}],155:[function(_dereq_,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],156:[function(_dereq_,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],157:[function(_dereq_,module,exports){
(function (global){
'use strict';

var required = _dereq_('requires-port')
  , qs = _dereq_('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"querystringify":155,"requires-port":156}],158:[function(_dereq_,module,exports){

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

},{}],159:[function(_dereq_,module,exports){
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
 * var $callUp = require('spore-kit/packages/app/callUp');
 * $callUp({
 *   startTime: Date.now(),
 *   waiting: 800,
 *   waitingLimit: 50,
 *   protocol : scheme,
 *   fallbackUrl : download,
 *   onFallback : function () {
 *     // should download
 *   }
 * });
 */

var $assign = _dereq_('../obj/assign');
var $browser = _dereq_('../env/browser');

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

},{"../env/browser":178,"../obj/assign":228}],160:[function(_dereq_,module,exports){
/**
 * # 处理与客户端相关的交互
 * @module spore-kit/packages/app
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/app
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.app.callUp);
 *
 * // 单独引入 spore-kit/packages/app
 * var $app = require('spore-kit/packages/app');
 * console.info($app.callUp);
 *
 * // 单独引入一个方法
 * var $callUp = require('spore-kit/packages/app/callUp');
 */

exports.callUp = _dereq_('./callUp');

},{"./callUp":159}],161:[function(_dereq_,module,exports){
/**
 * 确认对象是否在数组中
 * @method contains
 * @param {Array} arr 要操作的数组
 * @param {*} item 要搜索的对象
 * @returns {Boolean} 如果对象在数组中，返回 true
 * @example
 * var $contains = require('spore-kit/packages/arr/$contains');
 * console.info($contains([1,2,3,4,5], 3));	// true
 */

function contains (arr, item) {
	var index = arr.indexOf(item);
	return index >= 0;
}

module.exports = contains;

},{}],162:[function(_dereq_,module,exports){
/**
 * 删除数组中的对象
 * @method erase
 * @param {Array} arr 要操作的数组
 * @param {*} item 要清除的对象
 * @returns {Number} 对象原本所在位置
 * @example
 * var $erase = require('spore-kit/packages/arr/erase');
 * console.info($erase([1,2,3,4,5],3));	// [1,2,4,5]
 */

function erase (arr, item) {
	var index = arr.indexOf(item);
	if (index >= 0) {
		arr.splice(index, 1);
	}
	return index;
}

module.exports = erase;

},{}],163:[function(_dereq_,module,exports){
/**
 * 查找符合条件的元素在数组中的位置
 * @method find
 * @param {Array} arr 要操作的数组
 * @param {Function} fn 条件函数
 * @param {Object} [context] 函数的this指向
 * @return {Array} 符合条件的元素在数组中的位置
 * @example
 * var $find = require('spore-kit/packages/arr/find');
 * console.info($find([1,2,3,4,5], function (item) {
 *   return item < 3;
 * }); // [0, 1]
 */

function findInArr (arr, fn, context) {
	var positions = [];
	arr.forEach(function (item, index) {
		if (fn.call(context, item, index, arr)) {
			positions.push(index);
		}
	});
	return positions;
}

module.exports = findInArr;

},{}],164:[function(_dereq_,module,exports){
/**
 * 数组扁平化
 * @method flatten
 * @param {array} arr 要操作的数组
 * @returns {array} 经过扁平化处理的数组
 * @example
 * var $flatten = require('spore-kit/packages/arr/flatten');
 * console.info($flatten([1, [2,3], [4,5]])); // [1,2,3,4,5]
 */

var $type = _dereq_('../obj/type');

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

},{"../obj/type":232}],165:[function(_dereq_,module,exports){
/**
 * 确认对象是否在数组中，不存在则将对象插入到数组中
 * @method include
 * @param {Array} arr 要操作的数组
 * @param {*} item 要插入的对象
 * @returns {Array} 经过处理的源数组
 * @example
 * var $include = require('spore-kit/packages/arr/include');
 * console.info($include([1,2,3],4));	// [1,2,3,4]
 * console.info($include([1,2,3],3));	// [1,2,3]
 */

var $contains = _dereq_('./contains');

function include (arr, item) {
	if (!$contains(arr, item)) {
		arr.push(item);
	}
	return arr;
}

module.exports = include;

},{"./contains":161}],166:[function(_dereq_,module,exports){
/**
 * # 类数组对象相关工具函数
 * @module spore-kit/packages/arr
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/arr
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.arr.contains);
 *
 * // 单独引入 spore-kit/packages/arr
 * var $arr = require('spore-kit/packages/arr');
 * console.info($arr.contains);
 *
 * // 单独引入一个方法
 * var $contains = require('spore-kit/packages/arr/contains');
 */

exports.contains = _dereq_('./contains');
exports.erase = _dereq_('./erase');
exports.find = _dereq_('./find');
exports.flatten = _dereq_('./flatten');
exports.include = _dereq_('./include');

},{"./contains":161,"./erase":162,"./find":163,"./flatten":164,"./include":165}],167:[function(_dereq_,module,exports){
/**
 * 提供对 cookie 的读写能力
 * - 写入时自动用 encodeURIComponent 编码
 * - 读取时自动用 decodeURIComponent 解码
 * @module cookie
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * var $cookie = require('spore-kit/packages/cookie/cookie');
 * $cookie.set('name', '中文', {
 *   expires: 1
 * });
 * $cookie.read('name') // '中文'
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

},{"js-cookie":6}],168:[function(_dereq_,module,exports){
/**
 * # 本地存储相关工具函数
 * @module spore-kit/packages/cookie
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/cookie
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.cookie.cookie);
 *
 * // 单独引入 spore-kit/packages/cookie
 * var $cookie = require('spore-kit/packages/cookie');
 * console.info($cookie.cookie);
 *
 * // 单独引入一个工具对象
 * var $cookie = require('spore-kit/packages/cookie/cookie');
 */

exports.cookie = _dereq_('./cookie');
exports.origin = _dereq_('./origin');

},{"./cookie":167,"./origin":169}],169:[function(_dereq_,module,exports){
/**
 * 提供对 cookie 的读写能力
 * - 此模块直接提供 js-cookie 的原生能力，不做任何自动编解码
 * @module origin
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * var $cookie = require('spore-kit/packages/cookie/origin');
 * $cookie.set('name', 'value', {
 *   expires: 1
 * });
 * $cookie.read('name') // 'value'
 */
module.exports = _dereq_('js-cookie');

},{"js-cookie":6}],170:[function(_dereq_,module,exports){
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
 * var $format = require('spore-kit/packages/date/format');
 * console.info(
 *   $format(new Date(),{
 *     template : '{{YYYY}}年{{MM}}月{{DD}}日 周{{d}} {{hh}}时{{mm}}分{{ss}}秒'
 *   })
 * );
 * // 2015年09月09日 周三 14时19分42秒
 */

var $assign = _dereq_('../obj/assign');
var $substitute = _dereq_('../str/substitute');
var $fixTo = _dereq_('../num/fixTo');
var $getUTCDate = _dereq_('./getUTCDate');

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

	// 解决不同服务器时区不一致可能会导致日期初始化时间不一致的问题
	// 传入数字以北京时区时间为准
	var utcDate = $getUTCDate(dobj);
	data.year = utcDate.getUTCFullYear();
	data.month = utcDate.getUTCMonth() + 1;
	data.date = utcDate.getUTCDate();
	data.day = utcDate.getUTCDay();
	data.hours = utcDate.getUTCHours();
	data.miniutes = utcDate.getUTCMinutes();
	data.seconds = utcDate.getUTCSeconds();
	data.milliSeconds = utcDate.getUTCMilliseconds();

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

	data.mss = $fixTo(data.milliSeconds, 3);
	data.ms = data.milliSeconds;

	output = $substitute(conf.template, data);
	return output;
}

module.exports = format;

},{"../num/fixTo":224,"../obj/assign":228,"../str/substitute":245,"./getUTCDate":173}],171:[function(_dereq_,module,exports){
/**
 * 获取过去一段时间的起始日期，如3月前第1天，2周前第1天，3小时前整点
 * @method getLastStart
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @param {Number} count 多少单位时间之前
 * @returns {Date} 最近单位时间的起始时间对象
 * @example
 * var $getLastStart = require('spore-kit/packages/date/getLastStart');
 * var time = $getLastStart(
 *   new Date('2018-10-25'),
 *   'month',
 *   0
 * ).getTime(); // 1538323200000
 * new Date(time); // Mon Oct 01 2018 00:00:00 GMT+0800 (中国标准时间)
 */

var $getTimeSplit = _dereq_('./getTimeSplit');
var $getUTCDate = _dereq_('./getUTCDate');

var HOUR = 60 * 60 * 1000;
var DAY = 24 * 60 * 60 * 1000;

function getLastStart(time, type, count) {
	var localTime = new Date(time);
	var utcTime = $getUTCDate(time);
	var stamp = utcTime;
	var year;
	var month;
	var allMonths;
	var unit;
	if (!type) {
		throw new Error('required param type');
	}
	count = count || 0;
	if (type === 'year') {
		year = utcTime.getUTCFullYear();
		year -= count;
		stamp = new Date(year + '/1/1');
	} else if (type === 'month') {
		year = utcTime.getUTCFullYear();
		month = utcTime.getUTCMonth();
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
		var newLocalTime = localTime - count * unit;
		stamp = $getTimeSplit(newLocalTime, type);
	}

	return stamp;
}

module.exports = getLastStart;

},{"./getTimeSplit":172,"./getUTCDate":173}],172:[function(_dereq_,module,exports){
/**
 * 获取某个时间的 整年|整月|整日|整时|整分 时间对象
 * @method getTimeSplit
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @returns {Date} 时间整点对象
 * @example
 * var $getTimeSplit = require('spore-kit/packages/date/getTimeSplit');
 * new Date(
 * 	$getTimeSplit(
 * 		'2018-09-20',
 * 		'month'
 * 	)
 * ).toGMTString();
 * // Sat Sep 01 2018 00:00:00 GMT+0800 (中国标准时间)
 *
 * new Date(
 * 	$getTimeSplit(
 * 		'2018-09-20 19:23:36',
 * 		'hour'
 * 	)
 * ).toGMTString();
 * // Thu Sep 20 2018 19:00:00 GMT+0800 (中国标准时间)
 */
var $getUTCDate = _dereq_('./getUTCDate');

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

	var localTime = new Date(time);
	var utcTime = $getUTCDate(time);

	// 以周一为起始时间
	var day = utcTime.getDay();
	day = day === 0 ? 6 : day - 1;

	var index = TIME_UNITS.indexOf(type);
	if (index === 2) {
		utcTime = new Date(localTime - day * DAY);
	}
	var year = utcTime.getUTCFullYear();
	var month = utcTime.getUTCMonth() + 1;
	var date = utcTime.getUTCDate();
	var hour = utcTime.getUTCHours();
	var minutes = utcTime.getUTCMinutes();

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

},{"./getUTCDate":173}],173:[function(_dereq_,module,exports){
/**
 * 获取一个时间对象，其年月周日时分秒等 UTC 值与北京时间保持一致。
 * 解决不同服务器时区不一致场景下，可能会导致日期计算不一致的问题.
 * @method getUTCDate
 * @param {Number|Date} time 实际时间
 * @returns {Date} UTC时间
 * @example
 * var $getUTCDate = require('spore-kit/packages/date/getUTCDate');
 * var cnTime = 1540915200000; // (Wed Oct 31 2018 00:00:00 GMT+0800 (中国标准时间))
 * var utcDate = $getUTCDate(cnTime).getTime();
 * // 1540886400000 Tue Oct 30 2018 16:00:00 GMT+0800 (中国标准时间)
 * utcDate.getUTCdate(); // 31
 * utcDate.getHours(); // 8
 * utcDate.getUTCHours(); // 0
 */
function getUTCDate(time) {
	var utcDate = new Date(new Date(time).getTime() + 28800000);
	return utcDate;
}

module.exports = getUTCDate;

},{}],174:[function(_dereq_,module,exports){
/**
 * # 日期相关工具
 * @module spore-kit/packages/date
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/date
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.date.format);
 *
 * // 单独引入 spore-kit/packages/date
 * var $date = require('spore-kit/packages/date');
 * console.info($date.format);
 *
 * // 单独引入一个方法
 * var $format = require('spore-kit/packages/date/format');
 */

exports.format = _dereq_('./format');
exports.getLastStart = _dereq_('./getLastStart');
exports.getTimeSplit = _dereq_('./getTimeSplit');

},{"./format":170,"./getLastStart":171,"./getTimeSplit":172}],175:[function(_dereq_,module,exports){
/**
 * # DOM 操作相关工具函数
 * @module spore-kit/packages/dom
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/dom
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.dom.isNode);
 *
 * // 单独引入 spore-kit/packages/dom
 * var $dom = require('spore-kit/packages/dom');
 * console.info($dom.isNode);
 *
 * // 单独引入一个方法
 * var $isNode = require('spore-kit/packages/dom/isNode');
 */

exports.isNode = _dereq_('./isNode');
exports.offset = _dereq_('./offset');

},{"./isNode":176,"./offset":177}],176:[function(_dereq_,module,exports){
/**
 * 判断对象是否为dom元素
 * @param {Object} node 要判断的对象
 * @return {Boolean} 是否为dom元素
 * @example
 * var $isNode = require('spore-kit/packages/dom/isNode');
 * $isNode(document.body) // 1
 */
function isNode(node) {
	return (
		node
		&& node.nodeName
		&& node.nodeType
	);
}

module.exports = isNode;

},{}],177:[function(_dereq_,module,exports){
/**
 * 获取 DOM 元素相对于 document 的边距
 * @method offset
 * @see https://github.com/timoxley/offset
 * @param {Object} node 要计算 offset 的 dom 对象
 * @return {Object} offset 对象
 * @example
 * var $offset = require('spore-kit/packages/dom/offset');
 * var target = document.getElementById('target');
 * console.log($offset(target));
 * // {top: 69, left: 108}
 */

var offset = function() {
	return {};
};

if (typeof window !== 'undefined') {
	offset = _dereq_('document-offset');
}

module.exports = offset;

},{"document-offset":2}],178:[function(_dereq_,module,exports){
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
 * var $browser = require('spore-kit/packages/env/browser');
 * console.info($browser().chrome);
 * console.info($browser.detect());
 */
var $assign = _dereq_('../obj/assign');
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

function envBrowser() {
	if (!result) {
		result = detect();
	}
	return result;
}

envBrowser.detect = detect;

module.exports = envBrowser;

},{"../obj/assign":228,"./uaMatch":185}],179:[function(_dereq_,module,exports){
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
 * var $core = require('spore-kit/packages/env/core');
 * console.info($core().webkit);
 * console.info($core.detect());
 */

var $assign = _dereq_('../obj/assign');
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

},{"../obj/assign":228,"./uaMatch":185}],180:[function(_dereq_,module,exports){
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
 * var $device = require('spore-kit/packages/env/device');
 * console.info($device().huawei);
 * console.info($device.detect());
 */
var $assign = _dereq_('../obj/assign');
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

},{"../obj/assign":228,"./uaMatch":185}],181:[function(_dereq_,module,exports){
/**
 * # 环境检测与判断工具
 * @module spore-kit/packages/env
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/env
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.env.touchable);
 *
 * // 单独引入 spore-kit/packages/env
 * var $env = require('spore-kit/packages/env');
 * console.info($env.touchable);
 *
 * // 单独引入一个方法
 * var $touchable = require('spore-kit/packages/env/touchable');
 */

exports.browser = _dereq_('./browser');
exports.core = _dereq_('./core');
exports.device = _dereq_('./device');
exports.network = _dereq_('./network');
exports.os = _dereq_('./os');
exports.touchable = _dereq_('./touchable');
exports.uaMatch = _dereq_('./uaMatch');
exports.webp = _dereq_('./webp');

},{"./browser":178,"./core":179,"./device":180,"./network":182,"./os":183,"./touchable":184,"./uaMatch":185,"./webp":186}],182:[function(_dereq_,module,exports){
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
 * var $network = require('spore-kit/packages/env/network');
 * $network.support(); // true/false
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
 * var $network = require('spore-kit/packages/env/network');
 * $network.onLine(); // true/false
 */
function onLine() {
	return support() ? window.navigator.onLine : true;
}

exports.support = support;
exports.onLine = onLine;

},{}],183:[function(_dereq_,module,exports){
/**
 * 检测操作系统类型
 *
 * 支持的类型检测
 * - ios
 * - android
 * @method os
 * @returns {Object} UA 检查结果
 * @example
 * var $os = require('spore-kit/packages/env/os');
 * console.info($os().ios);
 * console.info($os.detect());
 */
var $assign = _dereq_('../obj/assign');
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

},{"../obj/assign":228,"./uaMatch":185}],184:[function(_dereq_,module,exports){
/**
 * 判断浏览器是否支持触摸屏
 * @method touchable
 * @returns {Boolean} 是否支持触摸屏
 * @example
 * var $touchable = require('spore-kit/packages/env/touchable');
 * if ($touchable()) {
 *   // It is a touch device.
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

},{}],185:[function(_dereq_,module,exports){
/**
 * UA字符串匹配列表
 * @method uaMatch
 * @param {Object} list 检测 Hash 列表
 * @param {String} ua 用于检测的 UA 字符串
 * @param {Object} conf 检测器选项，传递给检测函数
 * @example
 * var $uaMatch = require('spore-kit/packages/env/uaMatch');
 * var rs = $uaMatch({
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

},{}],186:[function(_dereq_,module,exports){
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
 * var $webp = require('spore-kit/packages/env/webp');
 * console.info($webp.support()); // true/false
 */
function support() {
	var rs = !![].map
		&& document
			.createElement('canvas')
			.toDataURL('image/webp')
			.indexOf('data:image/webp') === 0;
	return rs;
}

function webp () {
	if (isSupportWebp === null) {
		isSupportWebp = support();
	}
	return isSupportWebp;
}

webp.support = support;

module.exports = webp;

},{}],187:[function(_dereq_,module,exports){
/**
 * A module that can be mixed in to *any object* in order to provide it
 * with custom events. You may bind with `on` or remove with `off` callback
 * functions to an event; `trigger`-ing an event fires all callbacks in
 * succession.
 * - 一个可以被混合到任何对象的模块，用于提供自定义事件。
 * - 可以用 on, off 方法来绑定移除事件。
 * - 用 trigger 来触发事件通知。
 * @class Events
 * @see 类似工具: Mitt
 * @see http://aralejs.org/
 * @see https://github.com/documentcloud/backbone/blob/master/backbone.js
 * @see https://github.com/joyent/node/blob/master/lib/events.js
 * @example
 * var $events = require('spore-kit/packages/evt/events');
 * var evt = new $events();
 * evt.on('action', function() {
 *   console.info('action triggered');
 * });
 * evt.trigger('action');
 */

// Regular expression used to split event strings
var eventSplitter = /\s+/;

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
 * var $events = require('spore-kit/packages/evt/events');
 * var evt = new $events();
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
 * var $events = require('spore-kit/packages/evt/events');
 * var evt = new $events();
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
 * var $events = require('spore-kit/packages/evt/events');
 * var evt = new $events();
 *
 * // 触发事件名为 'event-name' 的事件
 * evt.trigger('event-name');
 *
 * // 同时触发2个事件
 * evt.trigger('event1 event2');
 *
 * // 触发事件同时传递参数
 * evt.on('event-x', function (a, b) {
 *   console.info(a, b); // 1, 2
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
 * var $events = require('spore-kit/packages/evt/events');
 * // 给一个实例混合自定义事件方法
 * var obj = {};
 * $events.mixTo(obj);
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

},{}],188:[function(_dereq_,module,exports){
/**
 * # 处理事件与广播
 * @module spore-kit/packages/evt
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/evt
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.evt.occurInside);
 *
 * // 单独引入 spore-kit/packages/evt
 * var $evt = require('spore-kit/packages/evt');
 * console.info($evt.occurInside);
 *
 * // 单独引入一个方法
 * var $occurInside = require('spore-kit/packages/evt/occurInside');
 */

exports.Events = _dereq_('./events');
exports.Listener = _dereq_('./listener');
exports.occurInside = _dereq_('./occurInside');
exports.tapStop = _dereq_('./tapStop');

},{"./events":187,"./listener":189,"./occurInside":190,"./tapStop":191}],189:[function(_dereq_,module,exports){
/**
 * 广播组件
 * - 构造实例时，需要传入事件白名单列表。
 * - 只有在白名单列表上的事件才可以被触发。
 * - 事件添加，移除，激发的调用方法参考 Events。
 * @see spore-kit/packages/evt/events
 * @class Listener
 * @example
 * @example
 * var $listener = require('spore-kit/packages/evt/listener');
 *
 * // 白名单里只记录了 event1 事件
 * var channelGlobal = new $listener([
 *   'event1'
 * ]);
 * channelGlobal.on('event1', function(){
 *   console.log('event1');
 * });
 * channelGlobal.on('event2', function(){
 *   // will not run
 *   console.log('event2');
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

},{"./events":187}],190:[function(_dereq_,module,exports){
/**
 * 判断事件是否发生在一个 Dom 元素内。
 * - 常用于判断点击事件发生在浮层外时关闭浮层。
 * @method occurInside
 * @param {Object} event 浏览器事件对象
 * @param {Object} node 用于比较事件发生区域的 Dom 对象
 * @returns {Boolean} 事件是否发生在 node 内
 * @example
 * var $occurInside = require('spore-kit/packages/evt/occurInside');
 * $('.layer').on('click', function(evt){
 *   if($occurInside(evt, $(this).find('close').get(0))){
 *     $(this).hide();
 *   }
 * });
 */

function occurInside(event, node) {
	if (node && event && event.target) {
		var pos = event.target;
		while (pos) {
			if (pos === node) {
				return true;
			} else {
				pos = pos.parentNode;
			}
		}
	}
	return false;
}

module.exports = occurInside;

},{}],191:[function(_dereq_,module,exports){
/**
 * 用遮罩的方式阻止 tap 事件穿透引发表单元素获取焦点。
 * - 推荐用 fastclick 来解决触屏事件穿透问题。
 * - 此组件用在 fastclick 未能解决问题时。或者不方便使用 fastclick 时。
 * @method tapStop
 * @param {Object} options 点击选项
 * @param {Number} options.delay 临时浮层在这个延迟时间(ms)之后关闭
 * @example
 * var $tapStop = require('spore-kit/packages/evt/tapStop');
 * $('.mask').on('tap', function(){
 *   $tapStop();
 *   $(this).hide();
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

},{}],192:[function(_dereq_,module,exports){
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
 * var $delay = require('spore-kit/packages/fn/delay');
 * var comp = {
 *   countWords : function(){
 *     console.info(this.length);
 *   }
 * };
 *
 *  // 疯狂点击 input ，停下来 500 ms 后，触发函数调用
 * $('#input').keydown($delay(function(){
 *   this.length = $('#input').val().length;
 *   this.countWords();
 * }, 500, comp));
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

},{}],193:[function(_dereq_,module,exports){
/**
 * # 函数包装，获取特殊执行方式
 * @module spore-kit/packages/fn
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fn
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fn.delay);
 *
 * // 单独引入 spore-kit/packages/fn
 * var $fn = require('spore-kit/packages/fn');
 * console.info($fn.delay);
 *
 * // 单独引入一个方法
 * var $delay = require('spore-kit/packages/fn/delay');
 */

exports.delay = _dereq_('./delay');
exports.lock = _dereq_('./lock');
exports.once = _dereq_('./once');
exports.queue = _dereq_('./queue');
exports.prepare = _dereq_('./prepare');
exports.regular = _dereq_('./regular');

},{"./delay":192,"./lock":194,"./once":195,"./prepare":196,"./queue":197,"./regular":198}],194:[function(_dereq_,module,exports){
/**
 * 包装为触发一次后，预置时间内不能再次触发的函数
 * - 类似于技能冷却。
 * @method lock
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的冷却触发函数
 * @example
 * var $lock = require('spore-kit/packages/fn/lock');
 * var request = function () {
 *   console.info('do request');
 * };
 * $('#input').keydown($lock(request, 500));
 * // 第一次按键，就会触发一次函数调用
 * // 之后连续按键，仅在 500ms 结束后再次按键，才会再次触发 request 函数调用
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

},{}],195:[function(_dereq_,module,exports){
/**
 * 包装为仅触发一次的函数
 * - 被包装的函数智能执行一次，之后不会再执行
 * @method once
 * @param {Function} fn 要延迟触发的函数
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 该函数仅能触发执行一次
 * @example
 * var $once = require('spore-kit/packages/fn/once');
 * var fn = $once(function () {
 *   console.info('output');
 * });
 * fn(); // 'output'
 * fn(); // will do nothing
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

},{}],196:[function(_dereq_,module,exports){
/**
 * 包装为一个条件触发管理器
 * - 调用管理器的 ready 函数来激活条件。
 * - 之前插入管理器的函数按队列顺序执行。
 * - 之后插入管理器的函数立即执行。
 * - 作用机制类似 jQuery.ready, 可以设置任何条件。
 * @module prepare
 * @returns {Function} 条件触发管理器函数，传入一个 function 作为任务执行函数参数
 * @example
 * var $prepare = require('spore-kit/packages/fn/prepare');
 * // 生成一个管理器函数 timeReady
 * var timeReady = $prepare();
 *
 * // 设置条件为2秒后就绪
 * setTimeout(function () {
 *   timeReady.ready();
 * }, 2000);
 *
 * // 调用管理器函数 timeReady，插入要执行的任务函数
 * timeReady(function () {
 *   // 2 秒后输出 1
 *   console.info(1);
 * });
 *
 * // 调用管理器函数 timeReady，插入要执行的任务函数
 * timeReady(function () {
 *   // 2 秒后输出 2
 *   console.info(2);
 * });
 *
 * // 2100ms 后执行
 * setTimeout(function () {
 *   // 调用管理器函数 timeReady，插入要执行的任务函数
 *   timeReady(function () {
 *     // 立即执行，输出 3
 *     console.info(3);
 *   });
 * }, 2100);
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

},{}],197:[function(_dereq_,module,exports){
/**
 * 包装为一个队列，按设置的时间间隔触发任务函数
 * - 插入队列的所有函数都会执行，但每次执行之间都会有一个固定的时间间隔。
 * @method queue
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的队列触发函数
 * @example
 * var $queue = require('spore-kit/packages/fn/queue');
 * var t1 = Date.now();
 * var doSomthing = $queue(function (index) {
 *   console.info(index + ':' + (Date.now() - t1));
 * }, 200);
 * // 每隔200ms输出一个日志。
 * for(var i = 0; i < 10; i++){
 *   doSomthing(i);
 * }
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

},{}],198:[function(_dereq_,module,exports){
/**
 * 包装为规律触发的函数，用于降低密集事件的处理频率
 * - 在疯狂操作期间，按照规律时间间隔，来调用任务函数
 * @method reqular
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @return {Function} 经过包装的定时触发函数
 * @example
 * var $regular = require('spore-kit/packages/fn/regular');
 * var comp = {
 *   countWords : function(){
 *     console.info(this.length);
 *   }
 * };
 * // 疯狂按键，每隔 200ms 才有一次按键有效
 * $('#input').keydown($regular(function(){
 * 	this.length = $('#input').val().length;
 * 	this.countWords();
 * }, 200, comp));
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

},{}],199:[function(_dereq_,module,exports){
/**
 * 简单的 Easing Functions
 * - 值域变化范围，从 [0, 1] 到 [0, 1]
 * - 即输入值范围从 0 到 1
 * - 输出也为从 0 到 1
 * - 适合进行百分比动画运算
 *
 * 动画函数
 * - linear
 * - easeInQuad
 * - easeOutQuad
 * - easeInOutQuad
 * - easeInCubic
 * - easeInQuart
 * - easeOutQuart
 * - easeInOutQuart
 * - easeInQuint
 * - easeOutQuint
 * - easeInOutQuint
 * @module easing
 * @see https://gist.github.com/gre/1650294
 * @example
 * var $easing = require('spore-kit/packages/fx/easing');
 * $easing.linear(0.5); // 0.5
 * $easing.easeInQuad(0.5); // 0.25
 * $easing.easeInCubic(0.5); // 0.125
 */
var easing = {
	// no easing, no acceleration
	linear: function(t) {
		return t;
	},
	// accelerating from zero velocity
	easeInQuad: function(t) {
		return t * t;
	},
	// decelerating to zero velocity
	easeOutQuad: function(t) {
		return t * (2 - t);
	},
	// acceleration until halfway, then deceleration
	easeInOutQuad: function(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	},
	// accelerating from zero velocity
	easeInCubic: function(t) {
		return t * t * t;
	},
	// decelerating to zero velocity
	easeOutCubic: function(t) {
		return (--t) * t * t + 1;
	},
	// acceleration until halfway, then deceleration
	easeInOutCubic: function(t) {
		return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	},
	// accelerating from zero velocity
	easeInQuart: function(t) {
		return t * t * t * t;
	},
	// decelerating to zero velocity
	easeOutQuart: function(t) {
		return 1 - (--t) * t * t * t;
	},
	// acceleration until halfway, then deceleration
	easeInOutQuart: function(t) {
		return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
	},
	// accelerating from zero velocity
	easeInQuint: function(t) {
		return t * t * t * t * t;
	},
	// decelerating to zero velocity
	easeOutQuint: function(t) {
		return 1 + (--t) * t * t * t * t;
	},
	// acceleration until halfway, then deceleration
	easeInOutQuint: function(t) {
		return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
	}
};

module.exports = easing;

},{}],200:[function(_dereq_,module,exports){
/**
 * 封装闪烁动作
 * @method flashAction
 * @param {object} options 选项
 * @param {number} [options.times=3] 闪烁次数，默认3次
 * @param {number} [options.delay=100] 闪烁间隔时间(ms)
 * @param {function} [options.actionOdd] 奇数回调
 * @param {function} [options.actionEven] 偶数回调
 * @param {function} [options.recover] 状态恢复回调
 * @example
 * var $flashAction = require('spore-kit/packages/fx/flashAction');
 * // 文字闪烁，奇数次呈现为红色，偶数次成纤维蓝色，动画结束呈现为黑色
 * var text = $('#target span.txt');
 * $flashAction({
 *   actionOdd : function (){
 *     text.css('color', '#f00');
 *   },
 *   actionEven : function (){
 *     text.css('color', '#00f');
 *   },
 *   recover : function (){
 *     text.css('color', '#000');
 *   }
 * });
 */
var $assign = _dereq_('../obj/assign');

function flashAction (options) {
	var conf = $assign(
		{
			times: 3,
			delay: 100,
			actionOdd: null,
			actionEven: null,
			recover: null
		},
		options
	);

	var queue = [];
	for (var i = 0; i < conf.times * 2 + 1; i++) {
		queue.push((i + 1) * conf.delay);
	}

	queue.forEach(function (time, index) {
		setTimeout(function () {
			if (index >= queue.length - 1) {
				if (conf.recover === 'function') {
					conf.recover();
				}
			} else if (index % 2 === 0) {
				if (typeof conf.actionEven === 'function') {
					conf.actionEven();
				}
			} else if (typeof conf.actionOdd === 'function') {
				conf.actionOdd();
			}
		}, time);
	});
}

module.exports = flashAction;

},{"../obj/assign":228}],201:[function(_dereq_,module,exports){
/**
 * 动画类 - 用于处理不适合使用 transition 的动画场景
 *
 * 可绑定的事件
 * - start 动画开始时触发
 * - complete 动画已完成
 * - stop 动画尚未完成就被中断
 * - cancel 动画被取消
 * @class Fx
 * @see https://mootools.net/core/docs/1.6.0/Fx/Fx
 * @constructor
 * @param {Object} [options] 动画选项
 * @param {Number} [options.fps=60] 帧速率(f/s)，实际上动画运行的最高帧速率不会高于 requestAnimationFrame 提供的帧速率
 * @param {Number} [options.duration=500] 动画持续时间(ms)
 * @param {String|Function} [options.transition] 动画执行方式，参见 spore-kit/packages/fx/transitions
 * @param {Number} [options.frames] 从哪一帧开始执行
 * @param {Boolean} [options.frameSkip=true] 是否跳帧
 * @param {String} [options.link='ignore'] 动画衔接方式，可选：['ignore', 'cancel']
 * @example
 * var $fx = require('spore-kit/packages/fx/fx');
 * var fx = new $fx({
 *   duration : 1000
 * });
 * fx.set = function (now) {
 *   node.style.marginLeft = now + 'px';
 * };
 * fx.on('complete', function(){
 *   console.info('animation end');
 * });
 * fx.start(0, 600); // 1秒内数字从0增加到600
 */

var $klass = _dereq_('klass');
var $events = _dereq_('../evt/events');
var $erase = _dereq_('../arr/erase');
var $contains = _dereq_('../arr/contains');
var $assign = _dereq_('../obj/assign');
var $timer = _dereq_('./timer');

// global timers
// 使用公共定时器可以减少浏览器资源消耗
var instances = {};
var timers = {};

var loop = function () {
	var now = Date.now();
	for (var i = this.length; i--;) {
		var instance = this[i];
		if (instance) {
			instance.step(now);
		}
	}
};

var pushInstance = function (fps) {
	var list = instances[fps] || (instances[fps] = []);
	list.push(this);
	if (!timers[fps]) {
		timers[fps] = $timer.setInterval(
			loop.bind(list),
			Math.round(1000 / fps)
		);
	}
};

var pullInstance = function (fps) {
	var list = instances[fps];
	if (list) {
		$erase(list, this);
		if (!list.length && timers[fps]) {
			delete instances[fps];
			timers[fps] = $timer.clearInterval(timers[fps]);
		}
	}
};

var Fx = $klass({
	initialize: function (options) {
		this.options = $assign(
			{
				fps: 60,
				duration: 500,
				transition: null,
				frames: null,
				frameSkip: true,
				link: 'ignore'
			},
			options
		);
	},

	/**
	 * 设置实例的选项
	 * @method Fx#setOptions
	 * @memberof Fx
	 * @param {Object} options 动画选项
	 */
	setOptions: function (options) {
		this.conf = $assign({}, this.options, options);
	},

	/**
	 * 设置动画的执行方式，配置缓动效果
	 * @interface Fx#getTransition
	 * @memberof Fx
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.getTransition = function () {
	 *   return function (p) {
	 *     return -(Math.cos(Math.PI * p) - 1) / 2;
	 *   };
	 * };
	 */
	getTransition: function () {
		return function (p) {
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function (now) {
		if (this.options.frameSkip) {
			var diff = this.time != null ? now - this.time : 0;
			var frames = diff / this.frameInterval;
			this.time = now;
			this.frame += frames;
		} else {
			this.frame++;
		}

		if (this.frame < this.frames) {
			var delta = this.transition(this.frame / this.frames);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.frame = this.frames;
			this.set(this.compute(this.from, this.to, 1));
			this.stop();
		}
	},

	/**
	 * 设置当前动画帧的过渡数值
	 * @interface Fx#set
	 * @memberof Fx
	 * @param {Number} now 当前动画帧的过渡数值
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.set = function (now) {
	 *   node.style.marginLeft = now + 'px';
	 * };
	 */
	set: function (now) {
		return now;
	},

	compute: function (from, to, delta) {
		return Fx.compute(from, to, delta);
	},

	check: function () {
		if (!this.isRunning()) {
			return true;
		}
		if (this.options.link === 'cancel') {
			this.cancel();
			return true;
		}
		return false;
	},

	/**
	 * 开始执行动画
	 * @method Fx#start
	 * @memberof Fx
	 * @param {Number} from 动画开始数值
	 * @param {Number} to 动画结束数值
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.start(); // 开始动画
	 */
	start: function (from, to) {
		if (!this.check(from, to)) {
			return this;
		}
		this.from = from;
		this.to = to;
		this.frame = this.options.frameSkip ? 0 : -1;
		this.time = null;
		this.transition = this.getTransition();
		var frames = this.options.frames;
		var fps = this.options.fps;
		var duration = this.options.duration;
		this.duration = Fx.Durations[duration] || parseInt(duration, 10) || 0;
		this.frameInterval = 1000 / fps;
		this.frames = frames || Math.round(this.duration / this.frameInterval);
		this.trigger('start');
		pushInstance.call(this, fps);
		return this;
	},

	/**
	 * 停止动画
	 * @method Fx#stop
	 * @memberof Fx
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.start();
	 * fx.stop(); // 立刻停止动画
	 */
	stop: function () {
		if (this.isRunning()) {
			this.time = null;
			pullInstance.call(this, this.options.fps);
			if (this.frames === this.frame) {
				this.trigger('complete');
			} else {
				this.trigger('stop');
			}
		}
		return this;
	},

	/**
	 * 取消动画
	 * @method Fx#cancel
	 * @memberof Fx
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.start();
	 * fx.cancel(); // 立刻取消动画
	 */
	cancel: function () {
		if (this.isRunning()) {
			this.time = null;
			pullInstance.call(this, this.options.fps);
			this.frame = this.frames;
			this.trigger('cancel');
		}
		return this;
	},

	/**
	 * 暂停动画
	 * @method Fx#pause
	 * @memberof Fx
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.start();
	 * fx.pause(); // 立刻暂停动画
	 */
	pause: function () {
		if (this.isRunning()) {
			this.time = null;
			pullInstance.call(this, this.options.fps);
		}
		return this;
	},

	/**
	 * 继续执行动画
	 * @method Fx#resume
	 * @memberof Fx
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.start();
	 * fx.pause();
	 * fx.resume(); // 立刻继续动画
	 */
	resume: function () {
		if (this.frame < this.frames && !this.isRunning()) {
			pushInstance.call(this, this.options.fps);
		}
		return this;
	},

	/**
	 * 判断动画是否正在运行
	 * @method Fx#isRunning
	 * @memberof Fx
	 * @returns {Boolean} 动画是否正在运行
	 * @example
	 * var $fx = require('spore-kit/packages/fx/fx');
	 * var fx = new $fx();
	 * fx.start();
	 * fx.pause();
	 * fx.isRunning(); // false
	 */
	isRunning: function () {
		var list = instances[this.options.fps];
		return list && $contains(list, this);
	}
});

$events.mixTo(Fx);

Fx.compute = function (from, to, delta) {
	return (to - from) * delta + from;
};

Fx.Durations = { short: 250, normal: 500, long: 1000 };

module.exports = Fx;

},{"../arr/contains":161,"../arr/erase":162,"../evt/events":187,"../obj/assign":228,"./timer":205,"klass":7}],202:[function(_dereq_,module,exports){
/**
 * # 动画交互相关工具
 * @module spore-kit/packages/fx
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fx
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.fx.smoothScrollTo);
 *
 * // 单独引入 spore-kit/packages/fx
 * var $fx = require('spore-kit/packages/fx');
 * console.info($fx.smoothScrollTo);
 *
 * // 单独引入一个方法
 * var $smoothScrollTo = require('spore-kit/packages/fx/smoothScrollTo');
 */

exports.easing = _dereq_('./easing');
exports.flashAction = _dereq_('./flashAction');
exports.Fx = _dereq_('./fx');
exports.smoothScrollTo = _dereq_('./smoothScrollTo');
exports.sticky = _dereq_('./sticky');
exports.timer = _dereq_('./timer');
exports.transitions = _dereq_('./transitions');

},{"./easing":199,"./flashAction":200,"./fx":201,"./smoothScrollTo":203,"./sticky":204,"./timer":205,"./transitions":206}],203:[function(_dereq_,module,exports){
/**
 * 平滑滚动到某个元素，只进行垂直方向的滚动
 * - requires jQuery/Zepto
 * @method smoothScrollTo
 * @param {Object} node 目标DOM元素
 * @param {Object} spec 选项
 * @param {Number} [spec.delta=0] 目标滚动位置与目标元素顶部的间距，可以为负值
 * @param {Number} [spec.maxDelay=3000] 动画执行时间限制(ms)，动画执行超过此时间则直接停止，立刻滚动到目标位置
 * @param {Function} [options.callback] 滚动完成的回调函数
 * @example
 * var $smoothScrollTo = require('spore-kit/packages/fx/smoothScrollTo');
 * // 滚动到页面顶端
 * $smoothScrollTo(document.body);
 */

var $assign = _dereq_('../obj/assign');

function smoothScrollTo (node, spec) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var conf = $assign(
		{
			delta: 0,
			maxDelay: 3000,
			callback: null
		},
		spec
	);

	var offset = $(node).offset();
	var target = offset.top + conf.delta;
	var callback = conf.callback;

	var prevStep;
	var stayCount = 3;

	var timer = null;

	var stopTimer = function () {
		if (timer) {
			clearInterval(timer);
			timer = null;
			window.scrollTo(0, target);
			if ($.isFunction(callback)) {
				callback();
			}
		}
	};

	timer = setInterval(function () {
		var sTop = $(window).scrollTop();
		var delta = sTop - target;
		if (delta > 0) {
			delta = Math.floor(delta * 0.8);
		} else if (delta < 0) {
			delta = Math.ceil(delta * 0.8);
		}

		var step = target + delta;
		if (step === prevStep) {
			stayCount--;
		}
		prevStep = step;

		window.scrollTo(0, step);

		if (step === target || stayCount <= 0) {
			stopTimer();
		}
	}, 16);

	setTimeout(function () {
		stopTimer();
	}, conf.maxDelay);
}

module.exports = smoothScrollTo;

},{"../obj/assign":228}],204:[function(_dereq_,module,exports){
/**
 * IOS sticky 效果 polyfill
 * - requires jQuery/Zepto
 * @param {Object} node 目标DOM元素
 * @param {Object} options 选项
 * @param {Boolean} [options.clone=true] 是否创建一个 clone 元素
 * @param {Object} [options.placeholder=null] sticky 效果启动时的占位 dom 元素
 * @param {Boolean} [options.disableAndroid=false] 是否在 Android 下停用 sticky 效果
 * @param {Object} [options.offsetParent=null] 提供一个相对定位元素来匹配浮动时的定位样式
 * @param {Object} [options.styles={}] 进入 sticky 状态时的样式
 * @example
 * var $sticky = require('spore-kit/packages/fx/sticky');
 * $sticky($('h1').get(0));
 */

function sticky(node, options) {
	var $ = window.$ || window.Zepto || window.jQuery;

	var $win = $(window);
	var $doc = $(document);

	var ua = navigator.userAgent;
	var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
	var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;

	var that = {};
	that.isIOS = isIOS;
	that.isAndroid = isAndroid;

	var conf = $.extend(
		{
			clone: true,
			placeholder: null,
			disableAndroid: false,
			offsetParent: null,
			styles: {}
		},
		options
	);

	that.root = $(node);

	if (!that.root.get(0)) { return; }
	that.offsetParent = that.root.offsetParent();

	if (conf.offsetParent) {
		that.offsetParent = $(conf.offsetParent);
	}

	if (!that.offsetParent[0]) {
		that.offsetParent = $(document.body);
	}

	that.isSticky = false;

	if (conf.placeholder) {
		that.placeholder = $(conf.placeholder);
	} else {
		that.placeholder = $('<div/>');
	}

	if (conf.clone) {
		that.clone = that.root.clone();
		that.clone.appendTo(that.placeholder);
	}

	that.placeholder.css({
		visibility: 'hidden'
	});

	that.sticky = function() {
		if (!that.isSticky) {
			that.isSticky = true;
			that.root.css('position', 'fixed');
			that.root.css(conf.styles);
			that.placeholder.insertBefore(that.root);
		}
	};

	that.unSticky = function() {
		if (that.isSticky) {
			that.isSticky = false;
			that.placeholder.remove();
			that.root.css('position', '');
			$.each(conf.styles, function(key) {
				that.root.css(key, '');
			});
		}
	};

	var origOffsetY = that.root.get(0).offsetTop;
	that.checkScrollY = function() {
		if (!that.isSticky) {
			origOffsetY = that.root.get(0).offsetTop;
		}

		var scrollY = 0;
		if (that.offsetParent.get(0) === document.body) {
			scrollY = window.scrollY;
		} else {
			scrollY = that.offsetParent.get(0).scrollTop;
		}

		if (scrollY > origOffsetY) {
			that.sticky();
		} else {
			that.unSticky();
		}

		if (that.isSticky) {
			that.root.css({
				'width': that.placeholder.width() + 'px'
			});
		} else {
			that.root.css({
				'width': ''
			});
		}
	};

	that.init = function() {
		if (isAndroid && conf.disableAndroid) {
			return;
		}
		if (isIOS && that.offsetParent.get(0) === document.body) {
			// IOS9+ 支持 position:sticky 属性
			that.root.css('position', 'sticky');
		} else {
			// 一般浏览器直接支持
			if (that.offsetParent.get(0) === document.body) {
				$win.on('scroll', that.checkScrollY);
			} else {
				that.offsetParent.on('scroll', that.checkScrollY);
			}

			$win.on('resize', that.checkScrollY);
			$doc.on('touchstart', that.checkScrollY);
			$doc.on('touchmove', that.checkScrollY);
			$doc.on('touchend', that.checkScrollY);
			that.checkScrollY();
		}
	};

	that.init();
	return that;
}

module.exports = sticky;

},{}],205:[function(_dereq_,module,exports){
/**
 * 用 requestAnimationFrame 包装定时器
 * - 如果浏览器不支持 requestAnimationFrame API，则使用 BOM 原本的定时器API
 * @module timer
 * @example
 * var $timer = require('spore-kit/packages/fx/timer');
 * $timer.setTimeout(function () {
 *   console.info('output this log after 1000ms');
 * }, 1000);
 */

var Timer = {};

var noop = function() {};

function factory(methodName) {
	var wrappedMethod = null;

	if (typeof window === 'undefined') return;
	var win = window;

	// 如果有对应名称的方法，直接返回该方法，否则返回带有对应浏览器前缀的方法
	var getPrefixMethod = function(name) {
		var upFirstName = name.charAt(0).toUpperCase() + name.substr(1);
		var method = win[name]
			|| win['webkit' + upFirstName]
			|| win['moz' + upFirstName]
			|| win['o' + upFirstName]
			|| win['ms' + upFirstName];
		if (typeof method === 'function') {
			return method.bind(win);
		} else {
			return null;
		}
	};

	var localRequestAnimationFrame = getPrefixMethod('requestAnimationFrame');
	var localCancelAnimationFrame = getPrefixMethod('cancelAnimationFrame') || noop;

	if (localRequestAnimationFrame) {
		var clearTimer = function(obj) {
			if (obj.requestId && typeof obj.step === 'function') {
				obj.step = noop;
				localCancelAnimationFrame(obj.requestId);
				obj.requestId = 0;
			}
		};

		var setTimer = function(fn, delay, type) {
			var obj = {};
			var time = Date.now();
			delay = delay || 0;
			delay = Math.max(delay, 0);
			obj.step = function() {
				var now = Date.now();
				if (now - time > delay) {
					fn();
					if (type === 'timeout') {
						clearTimer(obj);
					} else {
						time = now;
					}
				}
				obj.requestId = localRequestAnimationFrame(obj.step);
			};
			localRequestAnimationFrame(obj.step);
			return obj;
		};

		if (methodName === 'setInterval') {
			wrappedMethod = function(fn, delay) {
				return setTimer(fn, delay, 'interval');
			};
		} else if (methodName === 'setTimeout') {
			wrappedMethod = function(fn, delay) {
				return setTimer(fn, delay, 'timeout');
			};
		} else if (methodName === 'clearTimeout') {
			wrappedMethod = clearTimer;
		} else if (methodName === 'clearInterval') {
			wrappedMethod = clearTimer;
		}
	}

	if (!wrappedMethod && this[methodName]) {
		wrappedMethod = this[methodName].bind(this);
	}

	return wrappedMethod;
}

/**
 * 设置重复调用定时器
 * @method timer.setInterval
 * @memberof timer
 * @param {Function} fn 定时重复调用的函数
 * @param {Number} [delay=0] 重复调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearInterval 方法来终止这个定时器
 */
Timer.setInterval = factory('setInterval');

/**
 * 清除重复调用定时器
 * @method timer.clearInterval
 * @memberof timer
 * @param {Object} obj 定时器对象
 */
Timer.clearInterval = factory('clearInterval');

/**
 * 设置延时调用定时器
 * @method timer.setTimeout
 * @memberof timer
 * @param {Function} fn 延时调用的函数
 * @param {Number} [delay=0] 延时调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearTimeout 方法来终止这个定时器
 */
Timer.setTimeout = factory('setTimeout');

/**
 * 清除延时调用定时器
 * @method timer.clearTimeout
 * @memberof timer
 * @param {Object} obj 定时器对象
 */
Timer.clearTimeout = factory('clearTimeout');

module.exports = Timer;

},{}],206:[function(_dereq_,module,exports){
/* eslint-disable no-mixed-operators */
/**
 * 动画运行方式库
 * - Pow
 * - Expo
 * - Circ
 * - Sine
 * - Back
 * - Bounce
 * - Elastic
 * - Quad
 * - Cubic
 * - Quart
 * - Quint
 * @module transitions
 * @see https://mootools.net/core/docs/1.6.0/Fx/Fx.Transitions#Fx-Transitions
 * @example
 * var $fx = require('spore-kit/packages/fx/fx');
 * var $transitions = require('spore-kit/packages/fx/transitions');
 * new $fx({
 *   transition : $transitions.Sine.easeInOut
 * });
 * new $fx({
 *   transition : 'Sine:In'
 * });
 * new $fx({
 *   transition : 'Sine:In:Out'
 * });
 */

var $type = _dereq_('../obj/type');
var $assign = _dereq_('../obj/assign');

var $fx = _dereq_('./fx');

$fx.Transition = function(transition, params) {
	if ($type(params) !== 'array') {
		params = [params];
	}
	var easeIn = function(pos) {
		return transition(pos, params);
	};
	return $assign(easeIn, {
		easeIn: easeIn,
		easeOut: function(pos) {
			return 1 - transition(1 - pos, params);
		},
		easeInOut: function(pos) {
			return (
				(pos <= 0.5
					? transition(2 * pos, params)
					: 2 - transition(2 * (1 - pos), params)) / 2
			);
		}
	});
};

var Transitions = {
	linear: function(zero) {
		return zero;
	}
};

Transitions.extend = function(transitions) {
	Object.keys(transitions).forEach(function(transition) {
		Transitions[transition] = new $fx.Transition(transitions[transition]);
	});
};

Transitions.extend({
	Pow: function(p, x) {
		return Math.pow(p, (x && x[0]) || 6);
	},

	Expo: function(p) {
		return Math.pow(2, 8 * (p - 1));
	},

	Circ: function(p) {
		return 1 - Math.sin(Math.acos(p));
	},

	Sine: function(p) {
		return 1 - Math.cos(p * Math.PI / 2);
	},

	Back: function(p, x) {
		x = (x && x[0]) || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	Bounce: function(p) {
		var value;
		var a = 0;
		var b = 1;
		while (p < (7 - 4 * a) / 11) {
			value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
			a += b;
			b /= 2;
		}
		value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
		return value;
	},

	Elastic: function(p, x) {
		return (
			Math.pow(2, 10 * --p)
			* Math.cos(20 * p * Math.PI * ((x && x[0]) || 1) / 3)
		);
	}
});

['Quad', 'Cubic', 'Quart', 'Quint'].forEach(function(transition, i) {
	Transitions[transition] = new $fx.Transition(function(p) {
		return Math.pow(p, i + 2);
	});
});

$fx.statics({
	getTransition: function() {
		var trans = this.options.transition || Transitions.Sine.easeInOut;
		if (typeof trans === 'string') {
			var data = trans.split(':');
			trans = Transitions;
			trans = trans[data[0]] || trans[data[0]];
			if (data[1]) {
				trans = trans['ease' + data[1] + (data[2] ? data[2] : '')];
			}
		}
		return trans;
	}
});

module.exports = Transitions;

},{"../obj/assign":228,"../obj/type":232,"./fx":201}],207:[function(_dereq_,module,exports){
/**
 * ajax 请求方法，使用方式与 jQuery, Zepto 类似，对 jQuery, Zepto 无依赖
 * @method ajax
 * @see https://github.com/ForbesLindesay/ajax
 * @example
 * var $ajax = require('spore-kit/packages/io/ajax');
 * document.domain = 'qq.com';
 * $ajax({
 *   url: 'http://a.qq.com/form',
 *   data: [{
 *     n1: 'v1',
 *     n2: 'v2'
 *   }],
 *   success: function (rs) {
 *     console.info(rs);
 *   }
 * });
 */

var type = _dereq_('../obj/type')

var jsonpID = 0,
    key,
    name,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = 'application/json',
    htmlType = 'text/html',
    blankRE = /^\s*$/

var ajax = module.exports = function(options){
  var settings = extend({}, options || {})
  for (key in ajax.settings) if (settings[key] === undefined) settings[key] = ajax.settings[key]

  ajaxStart(settings)

  if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
    RegExp.$2 != window.location.host

  var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
  if (dataType == 'jsonp' || hasPlaceholder) {
    if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
    return ajax.JSONP(settings)
  }

  if (!settings.url) settings.url = window.location.toString()
  serializeData(settings)

  var mime = settings.accepts[dataType],
      baseHeaders = { },
      protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
      xhr = ajax.settings.xhr(), abortTimeout

  if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
  if (mime) {
    baseHeaders['Accept'] = mime
    if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
    xhr.overrideMimeType && xhr.overrideMimeType(mime)
  }
  if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
    baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
  settings.headers = extend(baseHeaders, settings.headers || {})

  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      clearTimeout(abortTimeout)
      var result, error = false
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
        dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
        result = xhr.responseText

        try {
          if (dataType == 'script')    (1,eval)(result)
          else if (dataType == 'xml')  result = xhr.responseXML
          else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
        } catch (e) { error = e }

        if (error) ajaxError(error, 'parsererror', xhr, settings)
        else ajaxSuccess(result, xhr, settings)
      } else {
        ajaxError(null, 'error', xhr, settings)
      }
    }
  }

  var async = 'async' in settings ? settings.async : true
  xhr.open(settings.type, settings.url, async)

  for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

  if (ajaxBeforeSend(xhr, settings) === false) {
    xhr.abort()
    return false
  }

  if (settings.timeout > 0) abortTimeout = setTimeout(function(){
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, settings)
    }, settings.timeout)

  // avoid sending empty string (#319)
  xhr.send(settings.data ? settings.data : null)
  return xhr
}


// trigger a custom event and return false if it was cancelled
function triggerAndReturn(context, eventName, data) {
  //todo: Fire off some events
  //var event = $.Event(eventName)
  //$(context).trigger(event, data)
  return true;//!event.defaultPrevented
}

// trigger an Ajax "global" event
function triggerGlobal(settings, context, eventName, data) {
  if (settings.global) return triggerAndReturn(context || document, eventName, data)
}

// Number of active Ajax requests
ajax.active = 0

function ajaxStart(settings) {
  if (settings.global && ajax.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
}
function ajaxStop(settings) {
  if (settings.global && !(--ajax.active)) triggerGlobal(settings, null, 'ajaxStop')
}

// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
function ajaxBeforeSend(xhr, settings) {
  var context = settings.context
  if (settings.beforeSend.call(context, xhr, settings) === false ||
      triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
    return false

  triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
}
function ajaxSuccess(data, xhr, settings) {
  var context = settings.context, status = 'success'
  settings.success.call(context, data, status, xhr)
  triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
  ajaxComplete(status, xhr, settings)
}
// type: "timeout", "error", "abort", "parsererror"
function ajaxError(error, type, xhr, settings) {
  var context = settings.context
  settings.error.call(context, xhr, type, error)
  triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
  ajaxComplete(type, xhr, settings)
}
// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
function ajaxComplete(status, xhr, settings) {
  var context = settings.context
  settings.complete.call(context, xhr, status)
  triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
  ajaxStop(settings)
}

// Empty function, used as default callback
function empty() {}

ajax.JSONP = function(options){
  if (!('type' in options)) return ajax(options)

  var callbackName = 'jsonp' + (++jsonpID),
    script = document.createElement('script'),
    abort = function(){
      //todo: remove script
      //$(script).remove()
      if (callbackName in window) window[callbackName] = empty
      ajaxComplete('abort', xhr, options)
    },
    xhr = { abort: abort }, abortTimeout,
    head = document.getElementsByTagName("head")[0]
      || document.documentElement

  if (options.error) script.onerror = function() {
    xhr.abort()
    options.error()
  }

  window[callbackName] = function(data){
    clearTimeout(abortTimeout)
      //todo: remove script
      //$(script).remove()
    delete window[callbackName]
    ajaxSuccess(data, xhr, options)
  }

  serializeData(options)
  script.src = options.url.replace(/=\?/, '=' + callbackName)

  // Use insertBefore instead of appendChild to circumvent an IE6 bug.
  // This arises when a base node is used (see jQuery bugs #2709 and #4378).
  head.insertBefore(script, head.firstChild);

  if (options.timeout > 0) abortTimeout = setTimeout(function(){
      xhr.abort()
      ajaxComplete('timeout', xhr, options)
    }, options.timeout)

  return xhr
}

ajax.settings = {
  // Default type of request
  type: 'GET',
  // Callback that is executed before request
  beforeSend: empty,
  // Callback that is executed if the request succeeds
  success: empty,
  // Callback that is executed the the server drops error
  error: empty,
  // Callback that is executed on request complete (both: error and success)
  complete: empty,
  // The context for the callbacks
  context: null,
  // Whether to trigger "global" Ajax events
  global: true,
  // Transport
  xhr: function () {
    return new window.XMLHttpRequest()
  },
  // MIME types mapping
  accepts: {
    script: 'text/javascript, application/javascript',
    json:   jsonType,
    xml:    'application/xml, text/xml',
    html:   htmlType,
    text:   'text/plain'
  },
  // Whether the request is to another domain
  crossDomain: false,
  // Default timeout
  timeout: 0
}

function mimeToDataType(mime) {
  return mime && ( mime == htmlType ? 'html' :
    mime == jsonType ? 'json' :
    scriptTypeRE.test(mime) ? 'script' :
    xmlTypeRE.test(mime) && 'xml' ) || 'text'
}

function appendQuery(url, query) {
  return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}

// serialize payload and append it to the URL for GET requests
function serializeData(options) {
  if (type(options.data) === 'object') options.data = param(options.data)
  if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
    options.url = appendQuery(options.url, options.data)
}

ajax.get = function(url, success){ return ajax({ url: url, success: success }) }

ajax.post = function(url, data, success, dataType){
  if (type(data) === 'function') dataType = dataType || success, success = data, data = null
  return ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType })
}

ajax.getJSON = function(url, success){
  return ajax({ url: url, success: success, dataType: 'json' })
}

var escape = encodeURIComponent

function serialize(params, obj, traditional, scope){
  var array = type(obj) === 'array';
  for (var key in obj) {
    var value = obj[key];

    if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
    // handle data in serializeArray() format
    if (!scope && array) params.add(value.name, value.value)
    // recurse into nested objects
    else if (traditional ? (type(value) === 'array') : (type(value) === 'object'))
      serialize(params, value, traditional, key)
    else params.add(key, value)
  }
}

function param(obj, traditional){
  var params = []
  params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
  serialize(params, obj, traditional)
  return params.join('&').replace('%20', '+')
}

function extend(target) {
  var slice = Array.prototype.slice;
  slice.call(arguments, 1).forEach(function(source) {
    for (key in source)
      if (source[key] !== undefined)
        target[key] = source[key]
  })
  return target
}

},{"../obj/type":232}],208:[function(_dereq_,module,exports){
/**
 * 加载 script 文件
 * @method getScript
 * @param {Object} options 选项
 * @param {String} options.src script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 * var $getScript = require('spore-kit/packages/io/getScript');
 * $getScript({
 *   src: 'https://code.jquery.com/jquery-3.3.1.min.js',
 *   onLoad: function () {
 *     console.info(window.jQuery);
 *   }
 * });
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

},{}],209:[function(_dereq_,module,exports){
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
 * var $iframePost = require('spore-kit/packages/io/iframePost');
 * document.domain = 'qq.com';
 * iframePost({
 *   url: 'http://a.qq.com/form',
 *   data: [{
 *     n1: 'v1',
 *     n2: 'v2'
 *   }],
 *   success: function (rs) {
 *     console.info(rs);
 *   }
 * });
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

},{}],210:[function(_dereq_,module,exports){
/**
 * # 处理网络交互
 * @module spore-kit/packages/io
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/io
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.io.getScript);
 *
 * // 单独引入 spore-kit/packages/io
 * var $io = require('spore-kit/packages/io');
 * console.info($io.getScript);
 *
 * // 单独引入一个方法
 * var $getScript = require('spore-kit/packages/io/getScript');
 */

exports.ajax = _dereq_('./ajax');
exports.getScript = _dereq_('./getScript');
exports.iframePost = _dereq_('./iframePost');
exports.loadSdk = _dereq_('./loadSdk');

},{"./ajax":207,"./getScript":208,"./iframePost":209,"./loadSdk":211}],211:[function(_dereq_,module,exports){
var $assign = _dereq_('lodash/assign');
var $get = _dereq_('lodash/get');
var $getScript = _dereq_('./getScript');

var propName = 'SPORE_SDK_PROMISE';
var cache = null;

if (typeof window !== 'undefined') {
	cache = window[propName];
	if (!cache) {
		cache = {};
		window[propName] = cache;
	}
} else {
	cache = {};
}

/**
 * sdk 加载统一封装
 * - 多次调用不会发起重复请求
 * @param {Object} options 选项
 * @param {String} options.name sdk 全局变量名称
 * @param {String} options.url script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 * var $loadSdk = require('spore-kit/packages/io/loadSdk');
 * $loadSdk({
 *   name: 'TencentCaptcha',
 *   url: 'https://ssl.captcha.qq.com/TCaptcha.js'
 * }).then(TencentCaptcha => {})
 */
var loadSdk = function (options) {
	var conf = $assign({
		name: '',
		url: '',
		charset: 'utf-8'
	}, options);

	var name = conf.name;
	if (!name) {
		return Promise.reject(new Error('Require parameter: options.name'));
	}
	if (!conf.url) {
		return Promise.reject(new Error('Require parameter: options.url'));
	}

	var pm = cache[name];
	if (pm) {
		if (pm.sdk) {
			return Promise.resolve(pm.sdk);
		}
		return pm;
	}

	pm = new Promise(function (resolve) {
		$getScript({
			src: conf.url,
			charset: conf.charset,
			onLoad: function () {
				var sdk = $get(window, name);
				pm.sdk = sdk;
				resolve(sdk);
			}
		});
	});
	cache[name] = pm;

	return pm;
};

module.exports = loadSdk;

},{"./getScript":208,"lodash/assign":125,"lodash/get":130}],212:[function(_dereq_,module,exports){
/**
 * 解析 location.search 为一个JSON对象
 * - 或者获取其中某个参数
 * @method getQuery
 * @param {String} url URL字符串
 * @param {String} name 参数名称
 * @returns {Object|String} query对象 | 参数值
 * @example
 * var $getQuery = require('spore-kit/packages/location/getQuery');
 * var url = 'http://localhost/profile?beijing=huanyingni';
 * console.info( $getQuery(url) );
 * // {beijing : 'huanyingni'}
 * console.info( $getQuery(url, 'beijing') );
 * // 'huanyingni'
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

},{}],213:[function(_dereq_,module,exports){
/**
 * # 处理地址字符串
 * @module spore-kit/packages/location
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/location
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.location.getQuery);
 *
 * // 单独引入 spore-kit/packages/location
 * var $location = require('spore-kit/packages/location');
 * console.info($location.getQuery);
 *
 * // 单独引入一个方法
 * var $getQuery = require('spore-kit/packages/location/getQuery');
 */

exports.getQuery = _dereq_('./getQuery');
exports.setQuery = _dereq_('./setQuery');
exports.parse = _dereq_('./parse');

},{"./getQuery":212,"./parse":214,"./setQuery":215}],214:[function(_dereq_,module,exports){
/**
 * 解析URL为一个对象
 * @method parse
 * @param {String} str URL字符串
 * @returns {Object} URL对象
 * @see https://github.com/unshiftio/url-parse
 * @example
 * var $parse = require('spore-kit/packages/location/parse');
 * $parse('http://localhost/profile?beijing=huanyingni#123');
 * // {
 * //   slashes: true,
 * //   protocol: 'http:',
 * //   hash: '#123',
 * //   query: '?beijing=huanyingni',
 * //   pathname: '/profile',
 * //   auth: 'username:password',
 * //   host: 'localhost:8080',
 * //   port: '8080',
 * //   hostname: 'localhost',
 * //   password: 'password',
 * //   username: 'username',
 * //   origin: 'http://localhost:8080',
 * //   href: 'http://username:password@localhost:8080/profile?beijing=huanyingni#123'
 * // }
 */

var Url = _dereq_('url-parse');

function parse (url) {
	return new Url(url);
}

module.exports = parse;

},{"url-parse":157}],215:[function(_dereq_,module,exports){
/**
 * 将参数设置到 location.search 上
 * @method setQuery
 * @param {String} url URL字符串
 * @param {Object} query 参数对象
 * @returns {String} 拼接好参数的URL字符串
 * @example
 * var $setQuery = require('spore-kit/packages/location/setQuery');
 * $setQuery('localhost'); // 'localhost'
 * $setQuery('localhost', {a: 1}); // 'localhost?a=1'
 * $setQuery('', {a: 1}); // '?a=1'
 * $setQuery('localhost?a=1', {a: 2}); // 'localhost?a=2'
 * $setQuery('localhost?a=1', {a: ''}); // 'localhost?a='
 * $setQuery('localhost?a=1', {a: null}); // 'localhost'
 * $setQuery('localhost?a=1', {b: 2}); // 'localhost?a=1&b=2'
 * $setQuery('localhost?a=1&b=1', {a: 2, b: 3}); // 'localhost?a=2&b=3'
 * $setQuery('localhost#a=1', {a: 2, b: 3}); // 'localhost?a=2&b=3#a=1'
 * $setQuery('#a=1', {a: 2, b: 3}); // '?a=2&b=3#a=1'
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

},{}],216:[function(_dereq_,module,exports){
/**
 * 基础工厂元件类
 * - 该类混合了 spore-kit/packages/evt/events 的方法。
 * @param {Object} [options] 选项
 * @module Base
 * @example
 * var $base = require('spore-kit/packages/mvc/base');
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

var $merge = _dereq_('lodash/merge');
var $noop = _dereq_('lodash/noop');
var $isPlainObject = _dereq_('lodash/isPlainObject');
var $events = _dereq_('../evt/events');
var $klass = _dereq_('./klass');
var $proxy = _dereq_('./proxy');

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
	 * @method Base#proxy
	 * @memberof Base
	 * @param {string} [name='proxy'] 函数名称
	 */
	proxy: function(name) {
		var proxyArgs = Array.prototype.slice.call(arguments);
		return $proxy(this, name, proxyArgs);
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

},{"../evt/events":187,"./klass":219,"./proxy":221,"lodash/isPlainObject":142,"lodash/merge":149,"lodash/noop":150}],217:[function(_dereq_,module,exports){
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

},{"lodash/assign":125,"lodash/forEach":129,"lodash/isFunction":137}],218:[function(_dereq_,module,exports){
/**
 * # 兼容 IE8 的 MVC 简单实现
 * @module spore-kit/packages/mvc
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/mvc
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.mvc.Model);
 *
 * // 单独引入 spore-kit/packages/mvc
 * var $mvc = require('spore-kit/packages/mvc');
 * console.info($mvc.Model);
 *
 * // 单独引入一个组件
 * var $model = require('spore-kit/packages/mvc/model');
 */

exports.klass = _dereq_('./klass');
exports.delegate = _dereq_('./delegate');
exports.proxy = _dereq_('./proxy');
exports.Base = _dereq_('./base');
exports.Model = _dereq_('./model');
exports.View = _dereq_('./view');

},{"./base":216,"./delegate":217,"./klass":219,"./model":220,"./proxy":221,"./view":222}],219:[function(_dereq_,module,exports){
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
		execProcess(prototype, obj, supr);
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
		execProcess(this, spec, supr);
		return this;
	};

	fn[proto].implement = fn.statics;

	return fn;
}

function klass(o) {
	return extend.call(isFn(o) ? o : function() {}, o, 1);
}

module.exports = klass;

},{}],220:[function(_dereq_,module,exports){
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
 * console.info(m2.get('b'));	// 2
 *
 * m2.set('a', 3);
 * console.info(m2.get('b'));	// 4
 *
 * m2.set('b', 5);
 * console.info(m2.get('b'));	// 5
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

},{"./base":216,"./delegate":217,"lodash/assign":125,"lodash/cloneDeep":126,"lodash/forEach":129,"lodash/isArray":133,"lodash/isFunction":137,"lodash/isPlainObject":142}],221:[function(_dereq_,module,exports){
/**
 * 函数代理，确保函数在当前类创建的实例上下文中执行。
 * - 这些用于绑定事件的代理函数都放在属性 instance.bound 上。
 * - 功能类似 Function.prototype.bind 。
 * - 可以传递额外参数作为函数执行的默认参数，追加在实际参数之后。
 * @param {object} instance 对象实例
 * @param {string} [name='proxy'] 函数名称
 */

var $isFunction = _dereq_('lodash/isFunction');

var AP = Array.prototype;

function proxy(instance, name, proxyArgs) {
	if (!instance.bound) {
		instance.bound = {};
	}
	var bound = instance.bound;
	proxyArgs = proxyArgs || [];
	proxyArgs.shift();
	name = name || 'proxy';
	if (!$isFunction(bound[name])) {
		bound[name] = function() {
			if ($isFunction(instance[name])) {
				var args = AP.slice.call(arguments);
				return instance[name].apply(instance, args.concat(proxyArgs));
			}
		};
	}
	return bound[name];
}

module.exports = proxy;

},{"lodash/isFunction":137}],222:[function(_dereq_,module,exports){
/**
 * 视图类: 基础工厂元件类，用于对视图组件的包装
 * - 依赖 jQuery/Zepto
 * - 继承自 spore-kit/packages/mvc/base
 * @module View
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
 * obj1.role('button').trigger('click');	// 1
 * obj2.role('button').trigger('click');	// 2
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
	 * @see spore-kit/packages/mvc/delegate
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

},{"./base":216,"./delegate":217}],223:[function(_dereq_,module,exports){
/**
 * 数字的千分位逗号分隔表示法
 * - IE8 的 toLocalString 给出了小数点后2位: N.00
 * @method comma
 * @see http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * @param {Number} num 数字
 * @returns {String} 千分位表示的数字
 * @example
 * var $comma = require('spore-kit/packages/num/comma');
 * $comma(1234567); //'1,234,567'
 */

function comma (num) {
	var parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

module.exports = comma;

},{}],224:[function(_dereq_,module,exports){
/**
 * 修正补位
 * @method fixTo
 * @param {Number|String} num 要补位的数字
 * @param {Number} [w=2] w 补位数量
 * @return {String} 经过补位的字符串
 * @example
 * var $fixTo = require('spore-kit/packages/num/fixTo');
 * $fixTo(0, 2);	//return '00'
 */

function fixTo (num, w) {
	var str = num.toString();
	w = Math.max((w || 2) - str.length + 1, 0);
	return new Array(w).join('0') + str;
}

module.exports = fixTo;

},{}],225:[function(_dereq_,module,exports){
/**
 * # 处理数字，数据转换
 * @module spore-kit/packages/num
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/num
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.num.limit);
 *
 * // 单独引入 spore-kit/packages/num
 * var $num = require('spore-kit/packages/num');
 * console.info($num.limit);
 *
 * // 单独引入一个方法
 * var $limit = require('spore-kit/packages/num/limit');
 */

exports.comma = _dereq_('./comma');
exports.fixTo = _dereq_('./fixTo');
exports.limit = _dereq_('./limit');
exports.numerical = _dereq_('./numerical');

},{"./comma":223,"./fixTo":224,"./limit":226,"./numerical":227}],226:[function(_dereq_,module,exports){
/**
 * 限制数字在一个范围内
 * @method limit
 * @param {Number} num 要限制的数字
 * @param {Number} min 最小边界数值
 * @param {Number} max 最大边界数值
 * @return {Number} 经过限制的数值
 * @example
 * var $limit = require('spore-kit/packages/num/limit');
 * $limit(1, 5, 10); // 5
 * $limit(6, 5, 10); // 6
 * $limit(11, 5, 10); // 10
 */

function limit (num, min, max) {
	return Math.min(Math.max(num, min), max);
}

module.exports = limit;

},{}],227:[function(_dereq_,module,exports){
/**
 * 将数据类型转为整数数字，转换失败则返回一个默认值
 * @method numerical
 * @param {*} str 要转换的数据
 * @param {Number} [def=0] 转换失败时的默认值
 * @param {Number} [sys=10] 进制
 * @return {Number} 转换而得的整数
 * @example
 * var $numerical = require('spore-kit/packages/num/numerical');
 * $numerical('10x'); // 10
 * $numerical('x10'); // 0
 */

function numerical (str, def, sys) {
	def = def || 0;
	sys = sys || 10;
	return parseInt(str, sys) || def;
}

module.exports = numerical;

},{}],228:[function(_dereq_,module,exports){
/**
 * 扩展并覆盖对象
 * @method assign
 * @param {Object} obj 要扩展的对象
 * @param {Object} item 要扩展的属性键值对
 * @returns {Object} 扩展后的源对象
 * @example
 * var $assign = require('spore-kit/packages/obj/assign');
 * var obj = {a: 1, b: 2};
 * console.info($assign(obj, {b: 3, c: 4})); // {a: 1, b: 3, c: 4}
 * console.info($assign({}, obj, {b: 3, c: 4})); // {a: 1, b: 3, c: 4}
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

},{}],229:[function(_dereq_,module,exports){
/**
 * 覆盖对象，不添加新的键
 * @method cover
 * @param {Object} object 要覆盖的对象
 * @param {Object} item 要覆盖的属性键值对
 * @returns {Object} 覆盖后的源对象
 * @example
 * var $cover = require('spore-kit/packages/obj/cover');
 * var obj = {a: 1, b: 2};
 * console.info($cover(obj,{b: 3, c: 4}));	//{a: 1, b: 3}
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

},{}],230:[function(_dereq_,module,exports){
/**
 * 查找对象路径上的值(简易版)
 * @see lodash.get
 * @method find
 * @param {Object} object 要查找的对象
 * @param {String} path 要查找的路径
 * @return {*} 对象路径上的值
 * @example
 * var $find = require('spore-kit/packages/obj/find');
 * var obj = {a:{b:{c:1}}};
 * console.info($find(obj,'a.b.c')); // 1
 * console.info($find(obj,'a.c')); // undefined
 */

function findPath(object, path) {
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

module.exports = findPath;

},{}],231:[function(_dereq_,module,exports){
/**
 * # 对象处理与判断
 * @module spore-kit/packages/obj
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/obj
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.obj.type);
 *
 * // 单独引入 spore-kit/packages/obj
 * var $obj = require('spore-kit/packages/obj');
 * console.info($obj.type);
 *
 * // 单独引入一个方法
 * var $type = require('spore-kit/packages/obj/type');
 */

exports.assign = _dereq_('./assign');
exports.cover = _dereq_('./cover');
exports.find = _dereq_('./find');
exports.type = _dereq_('./type');

},{"./assign":228,"./cover":229,"./find":230,"./type":232}],232:[function(_dereq_,module,exports){
/**
 * 获取数据类型
 * @method type
 * @param {*} item 任何类型数据
 * @returns {String} 对象类型
 * @example
 * var $type = require('spore-kit/packages/obj/type');
 * $type({}); // 'object'
 * $type(1); // 'number'
 * $type(''); // 'string'
 * $type(function(){}); // 'function'
 * $type(); // 'undefined'
 * $type(null); // 'null'
 * $type(new Date()); // 'date'
 * $type(/a/); // 'regexp'
 * $type(Symbol('a')); // 'symbol'
 * $type(window) // 'window'
 * $type(document) // 'htmldocument'
 * $type(document.body) // 'htmlbodyelement'
 * $type(document.head) // 'htmlheadelement'
 * $type(document.getElementsByTagName('div')) // 'htmlcollection'
 * $type(document.getElementsByTagName('div')[0]) // 'htmldivelement'
 */

function type (item) {
	return Object.prototype.toString
		.call(item)
		.toLowerCase()
		.replace(/^\[object\s*|\]$/gi, '');
}

module.exports = type;

},{}],233:[function(_dereq_,module,exports){
/**
 * 获取字符串长度，一个中文算2个字符
 * @method bLength
 * @param {String} str 要计算长度的字符串
 * @returns {Number} 字符串长度
 * @example
 * var $bLength = require('spore-kit/packages/str/bLength');
 * $bLength('中文cc'); // 6
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

},{}],234:[function(_dereq_,module,exports){
/**
 * 全角字符转半角字符
 * @method dbcToSbc
 * @param {String} str 包含了全角字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * var $dbcToSbc = require('spore-kit/packages/str/dbcToSbc');
 * $dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ'); // 'SAASDFSADF'
 */

function dbcToSbc (str) {
	return str.replace(/[\uff01-\uff5e]/g, function (a) {
		return String.fromCharCode(a.charCodeAt(0) - 65248);
	}).replace(/\u3000/g, ' ');
}

module.exports = dbcToSbc;

},{}],235:[function(_dereq_,module,exports){
/**
 * 解码HTML，将实体字符转换为HTML字符
 * @method decodeHTML
 * @param {String} str 含有实体字符的字符串
 * @returns {String} HTML字符串
 * @example
 * var $decodeHTML = require('spore-kit/packages/str/decodeHTML');
 * $decodeHTML('&amp;&lt;&gt;&quot;&#39;&#32;'); // '&<>"\' '
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

},{}],236:[function(_dereq_,module,exports){
/**
 * 编码HTML，将HTML字符转为实体字符
 * @method encodeHTML
 * @param {String} str 含有HTML字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * var $encodeHTML = require('spore-kit/packages/str/encodeHTML');
 * $encodeHTML(`&<>"\' `); // '&amp;&lt;&gt;&quot;&#39;&#32;'
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

},{}],237:[function(_dereq_,module,exports){
/**
 * 获取36进制随机字符串
 * @method getRnd36
 * @param {Float} [rnd] 随机数，不传则生成一个随机数
 * @return {String} 转成为36进制的字符串
 * @example
 * var $getRnd36 = require('spore-kit/packages/str/getRnd36');
 * $getRnd36(0.5810766832590446); // 'kx2pozz9rgf'
 */

function getRnd36 (rnd) {
	rnd = rnd || Math.random();
	return rnd.toString(36).replace(/^0./, '');
}

module.exports = getRnd36;

},{}],238:[function(_dereq_,module,exports){
/**
 * 获取36进制日期字符串
 * @method getTime36
 * @param {Date} [date] 符合规范的日期字符串或者数字，不传参数则使用当前客户端时间
 * @return {String} 转成为36进制的字符串
 * @example
 * var $getTime36 = require('spore-kit/packages/str/getTime36');
 * $getTime36('2020'); // 'k4ujaio0'
 */

function getTime36 (date) {
	date = date ? new Date(date) : new Date();
	return date.getTime().toString(36);
}

module.exports = getTime36;

},{}],239:[function(_dereq_,module,exports){
/**
 * 生成一个不与之前重复的随机字符串
 * @method getUniqueKey
 * @returns {String} 随机字符串
 * @example
 * var $getUniqueKey = require('spore-kit/packages/str/getUniqueKey');
 * $getUniqueKey(); // '166aae1fa9f'
 */

var time = +new Date();
var index = 1;

function getUniqueKey () {
	return (time + (index++)).toString(16);
}

module.exports = getUniqueKey;

},{}],240:[function(_dereq_,module,exports){
/**
 * 将驼峰格式变为连字符格式
 * @method hyphenate
 * @param {String} str 驼峰格式的字符串
 * @returns {String} 连字符格式的字符串
 * @example
 * var $hyphenate = require('spore-kit/packages/str/hyphenate');
 * $hyphenate('libKitStrHyphenate'); // 'lib-kit-str-hyphenate'
 */

function hyphenate (str) {
	return str.replace(/[A-Z]/g, function ($0) {
		return '-' + $0.toLowerCase();
	});
}

module.exports = hyphenate;

},{}],241:[function(_dereq_,module,exports){
/**
 * # 字符串处理与判断
 * @module spore-kit/packages/str
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/str
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.str.substitute);
 *
 * // 单独引入 spore-kit/packages/str
 * var $str = require('spore-kit/packages/str');
 * console.info($str.substitute);
 *
 * // 单独引入一个方法
 * var $substitute = require('spore-kit/packages/str/substitute');
 */

exports.bLength = _dereq_('./bLength');
exports.dbcToSbc = _dereq_('./dbcToSbc');
exports.decodeHTML = _dereq_('./decodeHTML');
exports.encodeHTML = _dereq_('./encodeHTML');
exports.getRnd36 = _dereq_('./getRnd36');
exports.getTime36 = _dereq_('./getTime36');
exports.getUniqueKey = _dereq_('./getUniqueKey');
exports.hyphenate = _dereq_('./hyphenate');
exports.ipToHex = _dereq_('./ipToHex');
exports.leftB = _dereq_('./leftB');
exports.sizeOfUTF8String = _dereq_('./sizeOfUTF8String');
exports.substitute = _dereq_('./substitute');

},{"./bLength":233,"./dbcToSbc":234,"./decodeHTML":235,"./encodeHTML":236,"./getRnd36":237,"./getTime36":238,"./getUniqueKey":239,"./hyphenate":240,"./ipToHex":242,"./leftB":243,"./sizeOfUTF8String":244,"./substitute":245}],242:[function(_dereq_,module,exports){
/**
 * 十进制IP地址转十六进制
 * @method ipToHex
 * @param {String} ip 十进制数字的IPV4地址
 * @return {String} 16进制数字IPV4地址
 * @example
 * var $ipToHex = require('spore-kit/packages/str/ipToHex');
 * $ipToHex('255.255.255.255'); //return 'ffffffff'
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

},{}],243:[function(_dereq_,module,exports){
/**
 * 从左到右取字符串，中文算两个字符
 * @method leftB
 * @param {String} str
 * @param {Number} lens
 * @returns {String} str
 * @example
 * var $leftB = require('spore-kit/packages/str/leftB');
 * //向汉编致敬
 * $leftB('世界真和谐', 6); // '世界真'
*/

var $bLength = _dereq_('./bLength');

function leftB (str, lens) {
	var s = str.replace(/\*/g, ' ')
		.replace(/[^\x00-\xff]/g, '**');
	str = str.slice(0, s.slice(0, lens)
		.replace(/\*\*/g, ' ')
		.replace(/\*/g, '').length);
	if ($bLength(str) > lens && lens > 0) {
		str = str.slice(0, str.length - 1);
	}
	return str;
}

module.exports = leftB;

},{"./bLength":233}],244:[function(_dereq_,module,exports){
/**
 * 取字符串 utf8 编码长度，from 王集鹄
 * @method sizeOfUTF8String
 * @param {String} str
 * @returns {Number} 字符串长度
 * @example
 * var $sizeOfUTF8String = require('spore-kit/packages/str/sizeOfUTF8String');
 * $sizeOfUTF8String('中文cc'); //return 8
*/

function sizeOfUTF8String (str) {
	return (
		typeof unescape !== 'undefined'
			? unescape(encodeURIComponent(str)).length
			: new ArrayBuffer(str, 'utf8').length
	);
}

module.exports = sizeOfUTF8String;

},{}],245:[function(_dereq_,module,exports){
/**
 * 简单模板函数
 * @method substitute
 * @param {String} str 要替换模板的字符串
 * @param {Object} obj 模板对应的数据对象
 * @param {RegExp} [reg=/\\?\{\{([^{}]+)\}\}/g] 解析模板的正则表达式
 * @return {String} 替换了模板的字符串
 * @example
 * var $substitute = require('spore-kit/packages/str/substitute');
 * $substitute('{{city}}欢迎您', {city:'北京'}); // '北京欢迎您'
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

},{}],246:[function(_dereq_,module,exports){
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
 * var $countDown = require('spore-kit/packages/time/countDown');
 * var target = Date.now() + 5000;
 * var cd1 = $countDown({
 *   target : target,
 *   onChange : function(delta){
 *     console.info('cd1 change', delta);
 *   },
 *   onStop : function(delta){
 *     console.info('cd1 stop', delta);
 *   }
 * });
 * setTimeout(function(){
 *   //trigger stop
 *   cd1.stop();
 * }, 2000);
 * var cd2 = countDown({
 *   target : target,
 *   interval : 2000,
 *   onChange : function(delta){
 *     console.info('cd2 change', delta);
 *   },
 *   onStop : function(delta){
 *     console.info('cd2 stop', delta);
 *   }
 * });
 */

var $erase = _dereq_('../arr/erase');
var $assign = _dereq_('../obj/assign');

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

	var timeDiff = 0;
	var target = +new Date(conf.target);
	var interval = parseInt(conf.interval, 10) || 0;
	var onChange = conf.onChange;
	var onStop = conf.onStop;

	// 使倒计时触发时间精确化
	// 使用固定的触发频率，减少需要创建的定时器
	var timeInterval = interval;
	if (timeInterval < 500) {
		timeInterval = 10;
	} else if (timeInterval < 5000) {
		timeInterval = 100;
	} else {
		timeInterval = 1000;
	}

	var delta;
	var curUnit;

	var update = function(now) {
		delta = target - now;
		var unit = Math.ceil(delta / interval);
		if (unit !== curUnit) {
			curUnit = unit;
			if (typeof onChange === 'function') {
				onChange(delta);
			}
		}
	};

	/**
	 * 重设目标时间
	 * @method countDown#setTarget
	 * @memberof countDown
	 * @example
	 * var cd = countDown();
	 * var localTime = '2019/01/01';
	 * cd.setTarget(serverTime);
	 */
	that.setTarget = function (time) {
		target = +new Date(time);
	};

	/**
	 * 纠正时间差
	 * @method countDown#correct
	 * @memberof countDown
	 * @example
	 * var cd = countDown();
	 * var serverTime = '2019/01/01';
	 * var localTime = '2020/01/01';
	 * cd.correct(serverTime);
	 * cd.correct(serverTime, localTime);
	 */
	that.correct = function(serverTime, localTime) {
		var now = localTime ? new Date(localTime) : +new Date();
		var serverDate = serverTime ? new Date(serverTime) : 0;
		if (serverDate) {
			timeDiff = serverDate - now;
		}
	};

	if (conf.base) {
		that.correct(conf.base);
	}

	var check = function(localDelta) {
		var now = localBaseTime + timeDiff + localDelta;
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
		var mobj = allMonitors[timeInterval];
		if (mobj && mobj.queue) {
			$erase(mobj.queue, check);
		}
		// onStop事件触发必须在从队列移除回调之后
		// 否则循环接替的定时器会引发死循环
		if (typeof onStop === 'function') {
			onStop(delta);
		}
	};

	/**
	 * 销毁倒计时
	 * @method countDown#destroy
	 * @memberof countDown
	 * @example
	 * var cd = countDown();
	 * cd.destroy();
	 */
	that.destroy = function() {
		onChange = null;
		onStop = null;
		that.stop();
	};

	var monitor = allMonitors[timeInterval];

	if (!monitor) {
		monitor = {};
		monitor.queue = [];
		monitor.inspect = function() {
			var now = Date.now();
			var mobj = allMonitors[timeInterval];
			var localDelta = now - localBaseTime;
			if (mobj.queue.length) {
				// 循环当中会删除数组元素，因此需要先复制一下数组
				mobj.queue.slice(0).forEach(function(fn) {
					fn(localDelta);
				});
			} else {
				clearInterval(mobj.timer);
				allMonitors[timeInterval] = null;
				delete mobj.timer;
			}
		};
		allMonitors[timeInterval] = monitor;
	}

	monitor.queue.push(check);

	if (!monitor.timer) {
		monitor.timer = setInterval(monitor.inspect, timeInterval);
	}

	monitor.inspect();

	return that;
}

countDown.allMonitors = allMonitors;
module.exports = countDown;

},{"../arr/erase":162,"../obj/assign":228}],247:[function(_dereq_,module,exports){
/**
 * # 时间处理与交互工具
 * @module spore-kit/packages/time
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/time
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.time.parseUnit);
 *
 * // 单独引入 spore-kit/packages/time
 * var $time = require('spore-kit/packages/time');
 * console.info($time.parseUnit);
 *
 * // 单独引入一个方法
 * var $parseUnit = require('spore-kit/packages/time/parseUnit');
 */

exports.countDown = _dereq_('./countDown');
exports.parseUnit = _dereq_('./parseUnit');

},{"./countDown":246,"./parseUnit":248}],248:[function(_dereq_,module,exports){
/**
 * 时间数字拆分为天时分秒
 * @method parseUnit
 * @param {Number} time 毫秒数
 * @param {Object} spec 选项
 * @param {String} [spec.maxUnit='day'] 拆分时间的最大单位，可选 ['day', 'hour', 'minute', 'second']
 * @returns {Object} 拆分完成的天时分秒
 * @example
 * var $parseUnit = require('spore-kit/packages/time/parseUnit');
 * console.info( $parseUnit(12345 * 67890) );
 * // Object {day: 9, hour: 16, minute: 48, second: 22, ms: 50}
 * console.info( $parseUnit(12345 * 67890, {maxUnit : 'hour'}) );
 * // Object {hour: 232, minute: 48, second: 22, ms: 50}
 */

var $numerical = _dereq_('../num/numerical');
var $assign = _dereq_('../obj/assign');

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

},{"../num/numerical":227,"../obj/assign":228}],249:[function(_dereq_,module,exports){
/**
 * ArrayBuffer转16进制字符串
 * @method abToHex
 * @param {ArrayBuffer} buffer 需要转换的 ArrayBuffer
 * @returns {String} 16进制字符串
 * @example
 * var $abToHex = require('spore-kit/packages/util/abToHex');
 * var ab = new ArrayBuffer(2);
 * var dv = new DataView(ab);
 * dv.setUint8(0, 171);
 * dv.setUint8(1, 205);
 * $abToHex(ab); // => 'abcd'
 */

function abToHex(buffer) {
	if (Object.prototype.toString.call(buffer) !== '[object ArrayBuffer]') {
		return '';
	}
	return Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2);
		}
	).join('');
}

module.exports = abToHex;

},{}],250:[function(_dereq_,module,exports){
/**
 * ASCII字符串转16进制字符串
 * @method ascToHex
 * @param {String} str 需要转换的ASCII字符串
 * @returns {String} 16进制字符串
 * @example
 * var $ascToHex = require('spore-kit/packages/util/ascToHex');
 * $ascToHex(); // => ''
 * $ascToHex('*+'); // => '2a2b'
 */

function ascToHex(str) {
	if (!str) {
		return '';
	}
	var hex = '';
	var index;
	var len = str.length;
	for (index = 0; index < len; index++) {
		var int = str.charCodeAt(index);
		var code = (int).toString(16);
		hex += code;
	}
	return hex;
}

module.exports = ascToHex;

},{}],251:[function(_dereq_,module,exports){
/**
 * 16进制字符串转ArrayBuffer
 * @method hexToAb
 * @see https://caniuse.com/#search=ArrayBuffer
 * @param {String} str 需要转换的16进制字符串
 * @returns {ArrayBuffer} 被转换后的 ArrayBuffer 对象
 * @example
 * var $hexToAb = require('spore-kit/packages/util/hexToAb');
 * var ab = $hexToAb();
 * ab.byteLength; // => 0
 * ab = $hexToAb('abcd');
 * var dv = new DataView(ab);
 * ab.byteLength; // => 2
 * dv.getUint8(0); // => 171
 * dv.getUint8(1); // => 205
 */

function hexToAb(str) {
	if (!str) {
		return new ArrayBuffer(0);
	}
	var buffer = new ArrayBuffer(Math.ceil(str.length / 2));
	var dataView = new DataView(buffer);
	var index = 0;
	var i;
	var len = str.length;
	for (i = 0; i < len; i += 2) {
		var code = parseInt(str.substr(i, 2), 16);
		dataView.setUint8(index, code);
		index++;
	}
	return buffer;
}

module.exports = hexToAb;

},{}],252:[function(_dereq_,module,exports){
/**
 * 16进制字符串转ASCII字符串
 * @method hexToAsc
 * @param {String} str 需要转换的16进制字符串
 * @returns {String} ASCII字符串
 * @example
 * var $hexToAsc = require('spore-kit/packages/util/hexToAsc');
 * $hexToAsc(); // => ''
 * $hexToAsc('2a2b'); // => '*+'
 */

function hexToAsc(hex) {
	if (!hex) {
		return '';
	}
	return hex.replace(/[\da-f]{2}/gi, function(match) {
		var int = parseInt(match, 16);
		return String.fromCharCode(int);
	});
}

module.exports = hexToAsc;

},{}],253:[function(_dereq_,module,exports){
/**
 * HSL颜色值转换为RGB
 * - 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - h, s, 和 l 设定在 [0, 1] 之间
 * - 返回的 r, g, 和 b 在 [0, 255]之间
 * @method hslToRgb
 * @param {Number} h 色相
 * @param {Number} s 饱和度
 * @param {Number} l 亮度
 * @returns {Array} RGB色值数值
 * @example
 * var $hslToRgb = require('spore-kit/packages/util/hslToRgb');
 * $hslToRgb(0, 0, 0); // => [0,0,0]
 * $hslToRgb(0, 0, 1); // => [255,255,255]
 * $hslToRgb(0.5555555555555555, 0.9374999999999999, 0.6862745098039216); // => [100,200,250]
 */

function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

function hslToRgb(h, s, l) {
	var r;
	var g;
	var b;

	if (s === 0) {
		// achromatic
		r = l;
		g = l;
		b = l;
	} else {
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports = hslToRgb;

},{}],254:[function(_dereq_,module,exports){
/**
 * # 其他工具函数
 * @module spore-kit/packages/util
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/util
 * @example
 * // 统一引入 spore-kit
 * var $kit = require('spore-kit');
 * console.info($kit.util.hslToRgb);
 *
 * // 单独引入 spore-kit/packages/util
 * var $util = require('spore-kit/packages/util');
 * console.info($util.hslToRgb);
 *
 * // 单独引入一个方法
 * var $hslToRgb = require('spore-kit/packages/util/hslToRgb');
 */

exports.abToHex = _dereq_('./abToHex');
exports.ascToHex = _dereq_('./ascToHex');
exports.hexToAb = _dereq_('./hexToAb');
exports.hexToAsc = _dereq_('./hexToAsc');
exports.hslToRgb = _dereq_('./hslToRgb');
exports.job = _dereq_('./job');
exports.measureDistance = _dereq_('./measureDistance');
exports.rgbToHsl = _dereq_('./rgbToHsl');

},{"./abToHex":249,"./ascToHex":250,"./hexToAb":251,"./hexToAsc":252,"./hslToRgb":253,"./job":255,"./measureDistance":256,"./rgbToHsl":257}],255:[function(_dereq_,module,exports){
/**
 * 任务分时执行
 * - 一方面避免单次reflow流程执行太多js任务导致浏览器卡死
 * - 另一方面单个任务的报错不会影响后续任务的执行
 * @method job
 * @param {Function} fn 任务函数
 * @returns {Object} 任务队列对象
 * @example
 * var $job = require('spore-kit/packages/util/job');
 * $job(function() {
 *   //task1 start
 * });
 * $job(function() {
 *   //task2 start
 * });
 */

var manager = {};

manager.queue = [];

manager.add = function(fn, options) {
	options = options || {};
	manager.queue.push({
		fn: fn,
		conf: options
	});
	manager.step();
};

manager.step = function() {
	if (!manager.queue.length || manager.timer) { return; }
	manager.timer = setTimeout(function() {
		var item = manager.queue.shift();
		if (item) {
			if (item.fn && typeof item.fn === 'function') {
				item.fn.call(null);
			}
			manager.timer = null;
			manager.step();
		}
	}, 1);
};

function job(fn, options) {
	manager.add(fn, options);
	return manager;
}

module.exports = job;

},{}],256:[function(_dereq_,module,exports){
/**
 * 测量地理坐标的距离
 * @method measureDistance
 * @param {Number} lat1 坐标1精度
 * @param {Number} lng1 坐标1纬度
 * @param {Number} lat2 坐标2精度
 * @param {Number} lng2 坐标2纬度
 * @returns {Number} 2个坐标之间的距离（千米）
 * @example
 * var $measureDistance = require('spore-kit/packages/util/measureDistance');
 * var distance = $measureDistance(0, 0, 100, 100);
 * // 9826.40065109978
 */

function measureDistance (lat1, lng1, lat2, lng2) {
	var radLat1 = (lat1 * Math.PI) / 180.0;
	var radLat2 = (lat2 * Math.PI) / 180.0;
	var a = radLat1 - radLat2;
	var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
	var s = 2 * Math.asin(
		Math.sqrt(
			Math.pow(Math.sin(a / 2), 2)
			+ Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
		)
	);
	// 地球半径
	s *= 6378.137;
	return s;
}

module.exports = measureDistance;

},{}],257:[function(_dereq_,module,exports){
/**
 * RGB 颜色值转换为 HSL.
 * - 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - r, g, 和 b 需要在 [0, 255] 范围内
 * - 返回的 h, s, 和 l 在 [0, 1] 之间
 * @param {Number} r 红色色值
 * @param {Number} g 绿色色值
 * @param {Number} b 蓝色色值
 * @returns {Array} HSL各值数组
 * @example
 * var $rgbToHsl = require('spore-kit/packages/util/rgbToHsl');
 * $rgbToHsl(100, 200, 250); // => [0.5555555555555555,0.9374999999999999,0.6862745098039216]
 * $rgbToHsl(0, 0, 0); // => [0,0,0]
 * $rgbToHsl(255, 255, 255); // => [0,0,1]
 */

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	var max = Math.max(r, g, b);
	var	min = Math.min(r, g, b);
	var h;
	var s;
	var l = (max + min) / 2;

	if (max === min) {
		// achromatic
		h = 0;
		s = 0;
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max === r) {
			h = (g - b) / d + (g < b ? 6 : 0);
		} else if (max === g) {
			h = (b - r) / d + 2;
		} else {
			h = (r - g) / d + 4;
		}
		h /= 6;
	}

	return [h, s, l];
}

module.exports = rgbToHsl;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9mYWtlX2M4NzgyMjFlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2RvY3VtZW50LW9mZnNldC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9kb20tc3VwcG9ydC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9nZXQtZG9jdW1lbnQvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2tsYXNzL2tsYXNzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FwcGx5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25NZXJnZVZhbHVlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNsb25lLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldEFsbEtleXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTWFwLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXNJbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZURlZXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmVzdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RGdW5jdGlvbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RQYXRoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVBcnJheUJ1ZmZlci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVEYXRhVmlldy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5QXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9sc0luLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUFzc2lnbmVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXNJbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9sc0luLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoQ2xlYXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVCeVRhZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZU9iamVjdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXlhYmxlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNNYXNrZWQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUNsZWFyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlSGFzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVHZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJSZXN0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NhZmVHZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Nob3J0T3V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvYXNzaWduLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9jbG9uZURlZXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2NvbnN0YW50LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc01hcC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNQbGFpbk9iamVjdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVyZ2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL25vb3AuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJBcnJheS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC90b1BsYWluT2JqZWN0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZ2lmeS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9yZXF1aXJlcy1wb3J0L2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL3VybC1wYXJzZS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy93aXRoaW4tZWxlbWVudC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2FwcC9jYWxsVXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZXJhc2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZmluZC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2luY2x1ZGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvY29va2llLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvY29va2llL2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvY29va2llL29yaWdpbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9nZXRMYXN0U3RhcnQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2dldFRpbWVTcGxpdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaXNOb2RlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZG9tL29mZnNldC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9icm93c2VyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L2NvcmUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvZGV2aWNlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L25ldHdvcmsuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvb3MuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L3VhTWF0Y2guanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvd2VicC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvbGlzdGVuZXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvb2NjdXJJbnNpZGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvdGFwU3RvcC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2RlbGF5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZm4vaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9sb2NrLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZm4vb25jZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3ByZXBhcmUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9xdWV1ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3JlZ3VsYXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9mbGFzaEFjdGlvbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZngvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9zbW9vdGhTY3JvbGxUby5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3N0aWNreS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3RpbWVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZngvdHJhbnNpdGlvbnMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9hamF4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvaW8vaWZyYW1lUG9zdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2lvL2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvaW8vbG9hZFNkay5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL2dldFF1ZXJ5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL3NldFF1ZXJ5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvbXZjL2Jhc2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvZGVsZWdhdGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMva2xhc3MuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvcHJveHkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvdmlldy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9jb21tYS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9maXhUby5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9saW1pdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9udW1lcmljYWwuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovYXNzaWduLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2NvdmVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2ZpbmQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovdHlwZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9iTGVuZ3RoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2RiY1RvU2JjLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2RlY29kZUhUTUwuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZW5jb2RlSFRNTC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9nZXRSbmQzNi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9nZXRUaW1lMzYuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VW5pcXVlS2V5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2h5cGhlbmF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9pcFRvSGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2xlZnRCLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL3NpemVPZlVURjhTdHJpbmcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvc3Vic3RpdHV0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvY291bnREb3duLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdGltZS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvcGFyc2VVbml0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9hYlRvSGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9hc2NUb0hleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9BYi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9Bc2MuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2hzbFRvUmdiLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvam9iLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9tZWFzdXJlRGlzdGFuY2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL3JnYlRvSHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMuYXBwID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9hcHAnKTtcbmV4cG9ydHMuYXJyID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9hcnInKTtcbmV4cG9ydHMuY29va2llID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9jb29raWUnKTtcbmV4cG9ydHMuZGF0ZSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZGF0ZScpO1xuZXhwb3J0cy5kb20gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2RvbScpO1xuZXhwb3J0cy5lbnYgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2VudicpO1xuZXhwb3J0cy5ldnQgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2V2dCcpO1xuZXhwb3J0cy5mbiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZm4nKTtcbmV4cG9ydHMuZnggPSByZXF1aXJlKCcuL3BhY2thZ2VzL2Z4Jyk7XG5leHBvcnRzLmlvID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9pbycpO1xuZXhwb3J0cy5sb2NhdGlvbiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvbG9jYXRpb24nKTtcbmV4cG9ydHMubXZjID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9tdmMnKTtcbmV4cG9ydHMubnVtID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9udW0nKTtcbmV4cG9ydHMub2JqID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9vYmonKTtcbmV4cG9ydHMuc3RyID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9zdHInKTtcbmV4cG9ydHMudGltZSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvdGltZScpO1xuZXhwb3J0cy51dGlsID0gcmVxdWlyZSgnLi9wYWNrYWdlcy91dGlsJyk7XG4iLCJ2YXIgc3VwcG9ydCA9IHJlcXVpcmUoJ2RvbS1zdXBwb3J0JylcbnZhciBnZXREb2N1bWVudCA9IHJlcXVpcmUoJ2dldC1kb2N1bWVudCcpXG52YXIgd2l0aGluRWxlbWVudCA9IHJlcXVpcmUoJ3dpdGhpbi1lbGVtZW50JylcblxuLyoqXG4gKiBHZXQgb2Zmc2V0IG9mIGEgRE9NIEVsZW1lbnQgb3IgUmFuZ2Ugd2l0aGluIHRoZSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR8UmFuZ2V9IGVsIC0gdGhlIERPTSBlbGVtZW50IG9yIFJhbmdlIGluc3RhbmNlIHRvIG1lYXN1cmVcbiAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IHdpdGggYHRvcGAgYW5kIGBsZWZ0YCBOdW1iZXIgdmFsdWVzXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvZmZzZXQoZWwpIHtcbiAgdmFyIGRvYyA9IGdldERvY3VtZW50KGVsKVxuICBpZiAoIWRvYykgcmV0dXJuXG5cbiAgLy8gTWFrZSBzdXJlIGl0J3Mgbm90IGEgZGlzY29ubmVjdGVkIERPTSBub2RlXG4gIGlmICghd2l0aGluRWxlbWVudChlbCwgZG9jKSkgcmV0dXJuXG5cbiAgdmFyIGJvZHkgPSBkb2MuYm9keVxuICBpZiAoYm9keSA9PT0gZWwpIHtcbiAgICByZXR1cm4gYm9keU9mZnNldChlbClcbiAgfVxuXG4gIHZhciBib3ggPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gIGlmICggdHlwZW9mIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGdCQ1IsIGp1c3QgdXNlIDAsMCByYXRoZXIgdGhhbiBlcnJvclxuICAgIC8vIEJsYWNrQmVycnkgNSwgaU9TIDMgKG9yaWdpbmFsIGlQaG9uZSlcbiAgICBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgaWYgKGVsLmNvbGxhcHNlZCAmJiBib3gubGVmdCA9PT0gMCAmJiBib3gudG9wID09PSAwKSB7XG4gICAgICAvLyBjb2xsYXBzZWQgUmFuZ2UgaW5zdGFuY2VzIHNvbWV0aW1lcyByZXBvcnQgMCwgMFxuICAgICAgLy8gc2VlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82ODQ3MzI4LzM3Njc3M1xuICAgICAgdmFyIHNwYW4gPSBkb2MuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cbiAgICAgIC8vIEVuc3VyZSBzcGFuIGhhcyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbiBieVxuICAgICAgLy8gYWRkaW5nIGEgemVyby13aWR0aCBzcGFjZSBjaGFyYWN0ZXJcbiAgICAgIHNwYW4uYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKFwiXFx1MjAwYlwiKSk7XG4gICAgICBlbC5pbnNlcnROb2RlKHNwYW4pO1xuICAgICAgYm94ID0gc3Bhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gUmVtb3ZlIHRlbXAgU1BBTiBhbmQgZ2x1ZSBhbnkgYnJva2VuIHRleHQgbm9kZXMgYmFjayB0b2dldGhlclxuICAgICAgdmFyIHNwYW5QYXJlbnQgPSBzcGFuLnBhcmVudE5vZGU7XG4gICAgICBzcGFuUGFyZW50LnJlbW92ZUNoaWxkKHNwYW4pO1xuICAgICAgc3BhblBhcmVudC5ub3JtYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZG9jRWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gIHZhciBjbGllbnRUb3AgID0gZG9jRWwuY2xpZW50VG9wICB8fCBib2R5LmNsaWVudFRvcCAgfHwgMFxuICB2YXIgY2xpZW50TGVmdCA9IGRvY0VsLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDBcbiAgdmFyIHNjcm9sbFRvcCAgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsVG9wXG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbExlZnRcblxuICByZXR1cm4ge1xuICAgIHRvcDogYm94LnRvcCAgKyBzY3JvbGxUb3AgIC0gY2xpZW50VG9wLFxuICAgIGxlZnQ6IGJveC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnRcbiAgfVxufVxuXG5mdW5jdGlvbiBib2R5T2Zmc2V0KGJvZHkpIHtcbiAgdmFyIHRvcCA9IGJvZHkub2Zmc2V0VG9wXG4gIHZhciBsZWZ0ID0gYm9keS5vZmZzZXRMZWZ0XG5cbiAgaWYgKHN1cHBvcnQuZG9lc05vdEluY2x1ZGVNYXJnaW5JbkJvZHlPZmZzZXQpIHtcbiAgICB0b3AgICs9IHBhcnNlRmxvYXQoYm9keS5zdHlsZS5tYXJnaW5Ub3AgfHwgMClcbiAgICBsZWZ0ICs9IHBhcnNlRmxvYXQoYm9keS5zdHlsZS5tYXJnaW5MZWZ0IHx8IDApXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvcDogdG9wLFxuICAgIGxlZnQ6IGxlZnRcbiAgfVxufVxuIiwidmFyIGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgc3VwcG9ydCxcblx0XHRhbGwsXG5cdFx0YSxcblx0XHRzZWxlY3QsXG5cdFx0b3B0LFxuXHRcdGlucHV0LFxuXHRcdGZyYWdtZW50LFxuXHRcdGV2ZW50TmFtZSxcblx0XHRpLFxuXHRcdGlzU3VwcG9ydGVkLFxuXHRcdGNsaWNrRm4sXG5cdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHQvLyBTZXR1cFxuXHRkaXYuc2V0QXR0cmlidXRlKCBcImNsYXNzTmFtZVwiLCBcInRcIiApO1xuXHRkaXYuaW5uZXJIVE1MID0gXCIgIDxsaW5rLz48dGFibGU+PC90YWJsZT48YSBocmVmPScvYSc+YTwvYT48aW5wdXQgdHlwZT0nY2hlY2tib3gnLz5cIjtcblxuXHQvLyBTdXBwb3J0IHRlc3RzIHdvbid0IHJ1biBpbiBzb21lIGxpbWl0ZWQgb3Igbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzXG5cdGFsbCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIik7XG5cdGEgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWyAwIF07XG5cdGlmICggIWFsbCB8fCAhYSB8fCAhYWxsLmxlbmd0aCApIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHQvLyBGaXJzdCBiYXRjaCBvZiB0ZXN0c1xuXHRzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXHRvcHQgPSBzZWxlY3QuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikgKTtcblx0aW5wdXQgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVsgMCBdO1xuXG5cdGEuc3R5bGUuY3NzVGV4dCA9IFwidG9wOjFweDtmbG9hdDpsZWZ0O29wYWNpdHk6LjVcIjtcblx0c3VwcG9ydCA9IHtcblx0XHQvLyBJRSBzdHJpcHMgbGVhZGluZyB3aGl0ZXNwYWNlIHdoZW4gLmlubmVySFRNTCBpcyB1c2VkXG5cdFx0bGVhZGluZ1doaXRlc3BhY2U6ICggZGl2LmZpcnN0Q2hpbGQubm9kZVR5cGUgPT09IDMgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRib2R5IGVsZW1lbnRzIGFyZW4ndCBhdXRvbWF0aWNhbGx5IGluc2VydGVkXG5cdFx0Ly8gSUUgd2lsbCBpbnNlcnQgdGhlbSBpbnRvIGVtcHR5IHRhYmxlc1xuXHRcdHRib2R5OiAhZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIikubGVuZ3RoLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgbGluayBlbGVtZW50cyBnZXQgc2VyaWFsaXplZCBjb3JyZWN0bHkgYnkgaW5uZXJIVE1MXG5cdFx0Ly8gVGhpcyByZXF1aXJlcyBhIHdyYXBwZXIgZWxlbWVudCBpbiBJRVxuXHRcdGh0bWxTZXJpYWxpemU6ICEhZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiKS5sZW5ndGgsXG5cblx0XHQvLyBHZXQgdGhlIHN0eWxlIGluZm9ybWF0aW9uIGZyb20gZ2V0QXR0cmlidXRlXG5cdFx0Ly8gKElFIHVzZXMgLmNzc1RleHQgaW5zdGVhZClcblx0XHRzdHlsZTogL3RvcC8udGVzdCggYS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiKSApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgVVJMcyBhcmVuJ3QgbWFuaXB1bGF0ZWRcblx0XHQvLyAoSUUgbm9ybWFsaXplcyBpdCBieSBkZWZhdWx0KVxuXHRcdGhyZWZOb3JtYWxpemVkOiAoIGEuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIvYVwiICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBlbGVtZW50IG9wYWNpdHkgZXhpc3RzXG5cdFx0Ly8gKElFIHVzZXMgZmlsdGVyIGluc3RlYWQpXG5cdFx0Ly8gVXNlIGEgcmVnZXggdG8gd29yayBhcm91bmQgYSBXZWJLaXQgaXNzdWUuIFNlZSAjNTE0NVxuXHRcdG9wYWNpdHk6IC9eMC41Ly50ZXN0KCBhLnN0eWxlLm9wYWNpdHkgKSxcblxuXHRcdC8vIFZlcmlmeSBzdHlsZSBmbG9hdCBleGlzdGVuY2Vcblx0XHQvLyAoSUUgdXNlcyBzdHlsZUZsb2F0IGluc3RlYWQgb2YgY3NzRmxvYXQpXG5cdFx0Y3NzRmxvYXQ6ICEhYS5zdHlsZS5jc3NGbG9hdCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGlmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCBmb3IgYSBjaGVja2JveFxuXHRcdC8vIHRoYXQgaXQgZGVmYXVsdHMgdG8gXCJvblwiLlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gXCJcIiBpbnN0ZWFkKVxuXHRcdGNoZWNrT246ICggaW5wdXQudmFsdWUgPT09IFwib25cIiApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgYSBzZWxlY3RlZC1ieS1kZWZhdWx0IG9wdGlvbiBoYXMgYSB3b3JraW5nIHNlbGVjdGVkIHByb3BlcnR5LlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gZmFsc2UgaW5zdGVhZCBvZiB0cnVlLCBJRSB0b28sIGlmIGl0J3MgaW4gYW4gb3B0Z3JvdXApXG5cdFx0b3B0U2VsZWN0ZWQ6IG9wdC5zZWxlY3RlZCxcblxuXHRcdC8vIFRlc3Qgc2V0QXR0cmlidXRlIG9uIGNhbWVsQ2FzZSBjbGFzcy4gSWYgaXQgd29ya3MsIHdlIG5lZWQgYXR0ckZpeGVzIHdoZW4gZG9pbmcgZ2V0L3NldEF0dHJpYnV0ZSAoaWU2LzcpXG5cdFx0Z2V0U2V0QXR0cmlidXRlOiBkaXYuY2xhc3NOYW1lICE9PSBcInRcIixcblxuXHRcdC8vIFRlc3RzIGZvciBlbmN0eXBlIHN1cHBvcnQgb24gYSBmb3JtICgjNjc0Mylcblx0XHRlbmN0eXBlOiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLmVuY3R5cGUsXG5cblx0XHQvLyBNYWtlcyBzdXJlIGNsb25pbmcgYW4gaHRtbDUgZWxlbWVudCBkb2VzIG5vdCBjYXVzZSBwcm9ibGVtc1xuXHRcdC8vIFdoZXJlIG91dGVySFRNTCBpcyB1bmRlZmluZWQsIHRoaXMgc3RpbGwgd29ya3Ncblx0XHRodG1sNUNsb25lOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpLmNsb25lTm9kZSggdHJ1ZSApLm91dGVySFRNTCAhPT0gXCI8Om5hdj48LzpuYXY+XCIsXG5cblx0XHQvLyBqUXVlcnkuc3VwcG9ydC5ib3hNb2RlbCBERVBSRUNBVEVEIGluIDEuOCBzaW5jZSB3ZSBkb24ndCBzdXBwb3J0IFF1aXJrcyBNb2RlXG5cdFx0Ym94TW9kZWw6ICggZG9jdW1lbnQuY29tcGF0TW9kZSA9PT0gXCJDU1MxQ29tcGF0XCIgKSxcblxuXHRcdC8vIFdpbGwgYmUgZGVmaW5lZCBsYXRlclxuXHRcdHN1Ym1pdEJ1YmJsZXM6IHRydWUsXG5cdFx0Y2hhbmdlQnViYmxlczogdHJ1ZSxcblx0XHRmb2N1c2luQnViYmxlczogZmFsc2UsXG5cdFx0ZGVsZXRlRXhwYW5kbzogdHJ1ZSxcblx0XHRub0Nsb25lRXZlbnQ6IHRydWUsXG5cdFx0aW5saW5lQmxvY2tOZWVkc0xheW91dDogZmFsc2UsXG5cdFx0c2hyaW5rV3JhcEJsb2NrczogZmFsc2UsXG5cdFx0cmVsaWFibGVNYXJnaW5SaWdodDogdHJ1ZSxcblx0XHRib3hTaXppbmdSZWxpYWJsZTogdHJ1ZSxcblx0XHRwaXhlbFBvc2l0aW9uOiBmYWxzZVxuXHR9O1xuXG5cdC8vIE1ha2Ugc3VyZSBjaGVja2VkIHN0YXR1cyBpcyBwcm9wZXJseSBjbG9uZWRcblx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdHN1cHBvcnQubm9DbG9uZUNoZWNrZWQgPSBpbnB1dC5jbG9uZU5vZGUoIHRydWUgKS5jaGVja2VkO1xuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBvcHRpb25zIGluc2lkZSBkaXNhYmxlZCBzZWxlY3RzIGFyZW4ndCBtYXJrZWQgYXMgZGlzYWJsZWRcblx0Ly8gKFdlYktpdCBtYXJrcyB0aGVtIGFzIGRpc2FibGVkKVxuXHRzZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm9wdERpc2FibGVkID0gIW9wdC5kaXNhYmxlZDtcblxuXHQvLyBUZXN0IHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRlbGV0ZSBhbiBleHBhbmRvIGZyb20gYW4gZWxlbWVudFxuXHQvLyBGYWlscyBpbiBJbnRlcm5ldCBFeHBsb3JlclxuXHR0cnkge1xuXHRcdGRlbGV0ZSBkaXYudGVzdDtcblx0fSBjYXRjaCggZSApIHtcblx0XHRzdXBwb3J0LmRlbGV0ZUV4cGFuZG8gPSBmYWxzZTtcblx0fVxuXG5cdGlmICggIWRpdi5hZGRFdmVudExpc3RlbmVyICYmIGRpdi5hdHRhY2hFdmVudCAmJiBkaXYuZmlyZUV2ZW50ICkge1xuXHRcdGRpdi5hdHRhY2hFdmVudCggXCJvbmNsaWNrXCIsIGNsaWNrRm4gPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vIENsb25pbmcgYSBub2RlIHNob3VsZG4ndCBjb3B5IG92ZXIgYW55XG5cdFx0XHQvLyBib3VuZCBldmVudCBoYW5kbGVycyAoSUUgZG9lcyB0aGlzKVxuXHRcdFx0c3VwcG9ydC5ub0Nsb25lRXZlbnQgPSBmYWxzZTtcblx0XHR9KTtcblx0XHRkaXYuY2xvbmVOb2RlKCB0cnVlICkuZmlyZUV2ZW50KFwib25jbGlja1wiKTtcblx0XHRkaXYuZGV0YWNoRXZlbnQoIFwib25jbGlja1wiLCBjbGlja0ZuICk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhIHJhZGlvIG1haW50YWlucyBpdHMgdmFsdWVcblx0Ly8gYWZ0ZXIgYmVpbmcgYXBwZW5kZWQgdG8gdGhlIERPTVxuXHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0aW5wdXQudmFsdWUgPSBcInRcIjtcblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJyYWRpb1wiICk7XG5cdHN1cHBvcnQucmFkaW9WYWx1ZSA9IGlucHV0LnZhbHVlID09PSBcInRcIjtcblxuXHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIiApO1xuXG5cdC8vICMxMTIxNyAtIFdlYktpdCBsb3NlcyBjaGVjayB3aGVuIHRoZSBuYW1lIGlzIGFmdGVyIHRoZSBjaGVja2VkIGF0dHJpYnV0ZVxuXHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcInRcIiApO1xuXG5cdGRpdi5hcHBlbmRDaGlsZCggaW5wdXQgKTtcblx0ZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYubGFzdENoaWxkICk7XG5cblx0Ly8gV2ViS2l0IGRvZXNuJ3QgY2xvbmUgY2hlY2tlZCBzdGF0ZSBjb3JyZWN0bHkgaW4gZnJhZ21lbnRzXG5cdHN1cHBvcnQuY2hlY2tDbG9uZSA9IGZyYWdtZW50LmNsb25lTm9kZSggdHJ1ZSApLmNsb25lTm9kZSggdHJ1ZSApLmxhc3RDaGlsZC5jaGVja2VkO1xuXG5cdC8vIENoZWNrIGlmIGEgZGlzY29ubmVjdGVkIGNoZWNrYm94IHdpbGwgcmV0YWluIGl0cyBjaGVja2VkXG5cdC8vIHZhbHVlIG9mIHRydWUgYWZ0ZXIgYXBwZW5kZWQgdG8gdGhlIERPTSAoSUU2LzcpXG5cdHN1cHBvcnQuYXBwZW5kQ2hlY2tlZCA9IGlucHV0LmNoZWNrZWQ7XG5cblx0ZnJhZ21lbnQucmVtb3ZlQ2hpbGQoIGlucHV0ICk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuXHQvLyBUZWNobmlxdWUgZnJvbSBKdXJpeSBaYXl0c2V2XG5cdC8vIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2RldGVjdGluZy1ldmVudC1zdXBwb3J0LXdpdGhvdXQtYnJvd3Nlci1zbmlmZmluZy9cblx0Ly8gV2Ugb25seSBjYXJlIGFib3V0IHRoZSBjYXNlIHdoZXJlIG5vbi1zdGFuZGFyZCBldmVudCBzeXN0ZW1zXG5cdC8vIGFyZSB1c2VkLCBuYW1lbHkgaW4gSUUuIFNob3J0LWNpcmN1aXRpbmcgaGVyZSBoZWxwcyB1cyB0b1xuXHQvLyBhdm9pZCBhbiBldmFsIGNhbGwgKGluIHNldEF0dHJpYnV0ZSkgd2hpY2ggY2FuIGNhdXNlIENTUFxuXHQvLyB0byBnbyBoYXl3aXJlLiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL1NlY3VyaXR5L0NTUFxuXHRpZiAoICFkaXYuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRmb3IgKCBpIGluIHtcblx0XHRcdHN1Ym1pdDogdHJ1ZSxcblx0XHRcdGNoYW5nZTogdHJ1ZSxcblx0XHRcdGZvY3VzaW46IHRydWVcblx0XHR9KSB7XG5cdFx0XHRldmVudE5hbWUgPSBcIm9uXCIgKyBpO1xuXHRcdFx0aXNTdXBwb3J0ZWQgPSAoIGV2ZW50TmFtZSBpbiBkaXYgKTtcblx0XHRcdGlmICggIWlzU3VwcG9ydGVkICkge1xuXHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKCBldmVudE5hbWUsIFwicmV0dXJuO1wiICk7XG5cdFx0XHRcdGlzU3VwcG9ydGVkID0gKCB0eXBlb2YgZGl2WyBldmVudE5hbWUgXSA9PT0gXCJmdW5jdGlvblwiICk7XG5cdFx0XHR9XG5cdFx0XHRzdXBwb3J0WyBpICsgXCJCdWJibGVzXCIgXSA9IGlzU3VwcG9ydGVkO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJ1biB0ZXN0cyB0aGF0IG5lZWQgYSBib2R5IGF0IGRvYyByZWFkeVxuXHRkb21yZWFkeShmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udGFpbmVyLCBkaXYsIHRkcywgbWFyZ2luRGl2LFxuXHRcdFx0ZGl2UmVzZXQgPSBcInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbjtib3gtc2l6aW5nOmNvbnRlbnQtYm94Oy1tb3otYm94LXNpemluZzpjb250ZW50LWJveDstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7XCIsXG5cdFx0XHRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuXG5cdFx0aWYgKCAhYm9keSApIHtcblx0XHRcdC8vIFJldHVybiBmb3IgZnJhbWVzZXQgZG9jcyB0aGF0IGRvbid0IGhhdmUgYSBib2R5XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb250YWluZXIuc3R5bGUuY3NzVGV4dCA9IFwidmlzaWJpbGl0eTpoaWRkZW47Ym9yZGVyOjA7d2lkdGg6MDtoZWlnaHQ6MDtwb3NpdGlvbjpzdGF0aWM7dG9wOjA7bWFyZ2luLXRvcDoxcHhcIjtcblx0XHRib2R5Lmluc2VydEJlZm9yZSggY29udGFpbmVyLCBib2R5LmZpcnN0Q2hpbGQgKTtcblxuXHRcdC8vIENvbnN0cnVjdCB0aGUgdGVzdCBlbGVtZW50XG5cdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXG4gICAgLy9DaGVjayBpZiB0YWJsZSBjZWxscyBzdGlsbCBoYXZlIG9mZnNldFdpZHRoL0hlaWdodCB3aGVuIHRoZXkgYXJlIHNldFxuICAgIC8vdG8gZGlzcGxheTpub25lIGFuZCB0aGVyZSBhcmUgc3RpbGwgb3RoZXIgdmlzaWJsZSB0YWJsZSBjZWxscyBpbiBhXG4gICAgLy90YWJsZSByb3c7IGlmIHNvLCBvZmZzZXRXaWR0aC9IZWlnaHQgYXJlIG5vdCByZWxpYWJsZSBmb3IgdXNlIHdoZW5cbiAgICAvL2RldGVybWluaW5nIGlmIGFuIGVsZW1lbnQgaGFzIGJlZW4gaGlkZGVuIGRpcmVjdGx5IHVzaW5nXG4gICAgLy9kaXNwbGF5Om5vbmUgKGl0IGlzIHN0aWxsIHNhZmUgdG8gdXNlIG9mZnNldHMgaWYgYSBwYXJlbnQgZWxlbWVudCBpc1xuICAgIC8vaGlkZGVuOyBkb24gc2FmZXR5IGdvZ2dsZXMgYW5kIHNlZSBidWcgIzQ1MTIgZm9yIG1vcmUgaW5mb3JtYXRpb24pLlxuICAgIC8vKG9ubHkgSUUgOCBmYWlscyB0aGlzIHRlc3QpXG5cdFx0ZGl2LmlubmVySFRNTCA9IFwiPHRhYmxlPjx0cj48dGQ+PC90ZD48dGQ+dDwvdGQ+PC90cj48L3RhYmxlPlwiO1xuXHRcdHRkcyA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpO1xuXHRcdHRkc1sgMCBdLnN0eWxlLmNzc1RleHQgPSBcInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5Om5vbmVcIjtcblx0XHRpc1N1cHBvcnRlZCA9ICggdGRzWyAwIF0ub2Zmc2V0SGVpZ2h0ID09PSAwICk7XG5cblx0XHR0ZHNbIDAgXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHR0ZHNbIDEgXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHQvLyBDaGVjayBpZiBlbXB0eSB0YWJsZSBjZWxscyBzdGlsbCBoYXZlIG9mZnNldFdpZHRoL0hlaWdodFxuXHRcdC8vIChJRSA8PSA4IGZhaWwgdGhpcyB0ZXN0KVxuXHRcdHN1cHBvcnQucmVsaWFibGVIaWRkZW5PZmZzZXRzID0gaXNTdXBwb3J0ZWQgJiYgKCB0ZHNbIDAgXS5vZmZzZXRIZWlnaHQgPT09IDAgKTtcblxuXHRcdC8vIENoZWNrIGJveC1zaXppbmcgYW5kIG1hcmdpbiBiZWhhdmlvclxuXHRcdGRpdi5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdGRpdi5zdHlsZS5jc3NUZXh0ID0gXCJib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoxcHg7Ym9yZGVyOjFweDtkaXNwbGF5OmJsb2NrO3dpZHRoOjRweDttYXJnaW4tdG9wOjElO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxJTtcIjtcblx0XHRzdXBwb3J0LmJveFNpemluZyA9ICggZGl2Lm9mZnNldFdpZHRoID09PSA0ICk7XG5cdFx0c3VwcG9ydC5kb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldCA9ICggYm9keS5vZmZzZXRUb3AgIT09IDEgKTtcblxuXHRcdC8vIE5PVEU6IFRvIGFueSBmdXR1cmUgbWFpbnRhaW5lciwgd2UndmUgd2luZG93LmdldENvbXB1dGVkU3R5bGVcblx0XHQvLyBiZWNhdXNlIGpzZG9tIG9uIG5vZGUuanMgd2lsbCBicmVhayB3aXRob3V0IGl0LlxuXHRcdGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgKSB7XG5cdFx0XHRzdXBwb3J0LnBpeGVsUG9zaXRpb24gPSAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBkaXYsIG51bGwgKSB8fCB7fSApLnRvcCAhPT0gXCIxJVwiO1xuXHRcdFx0c3VwcG9ydC5ib3hTaXppbmdSZWxpYWJsZSA9ICggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGRpdiwgbnVsbCApIHx8IHsgd2lkdGg6IFwiNHB4XCIgfSApLndpZHRoID09PSBcIjRweFwiO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBkaXYgd2l0aCBleHBsaWNpdCB3aWR0aCBhbmQgbm8gbWFyZ2luLXJpZ2h0IGluY29ycmVjdGx5XG5cdFx0XHQvLyBnZXRzIGNvbXB1dGVkIG1hcmdpbi1yaWdodCBiYXNlZCBvbiB3aWR0aCBvZiBjb250YWluZXIuIEZvciBtb3JlXG5cdFx0XHQvLyBpbmZvIHNlZSBidWcgIzMzMzNcblx0XHRcdC8vIEZhaWxzIGluIFdlYktpdCBiZWZvcmUgRmViIDIwMTEgbmlnaHRsaWVzXG5cdFx0XHQvLyBXZWJLaXQgQnVnIDEzMzQzIC0gZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5zIHdyb25nIHZhbHVlIGZvciBtYXJnaW4tcmlnaHRcblx0XHRcdG1hcmdpbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUuY3NzVGV4dCA9IGRpdi5zdHlsZS5jc3NUZXh0ID0gZGl2UmVzZXQ7XG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBtYXJnaW5EaXYuc3R5bGUud2lkdGggPSBcIjBcIjtcblx0XHRcdGRpdi5zdHlsZS53aWR0aCA9IFwiMXB4XCI7XG5cdFx0XHRkaXYuYXBwZW5kQ2hpbGQoIG1hcmdpbkRpdiApO1xuXHRcdFx0c3VwcG9ydC5yZWxpYWJsZU1hcmdpblJpZ2h0ID1cblx0XHRcdFx0IXBhcnNlRmxvYXQoICggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIG1hcmdpbkRpdiwgbnVsbCApIHx8IHt9ICkubWFyZ2luUmlnaHQgKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBkaXYuc3R5bGUuem9vbSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdC8vIENoZWNrIGlmIG5hdGl2ZWx5IGJsb2NrLWxldmVsIGVsZW1lbnRzIGFjdCBsaWtlIGlubGluZS1ibG9ja1xuXHRcdFx0Ly8gZWxlbWVudHMgd2hlbiBzZXR0aW5nIHRoZWlyIGRpc3BsYXkgdG8gJ2lubGluZScgYW5kIGdpdmluZ1xuXHRcdFx0Ly8gdGhlbSBsYXlvdXRcblx0XHRcdC8vIChJRSA8IDggZG9lcyB0aGlzKVxuXHRcdFx0ZGl2LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IGRpdlJlc2V0ICsgXCJ3aWR0aDoxcHg7cGFkZGluZzoxcHg7ZGlzcGxheTppbmxpbmU7em9vbToxXCI7XG5cdFx0XHRzdXBwb3J0LmlubGluZUJsb2NrTmVlZHNMYXlvdXQgPSAoIGRpdi5vZmZzZXRXaWR0aCA9PT0gMyApO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBlbGVtZW50cyB3aXRoIGxheW91dCBzaHJpbmstd3JhcCB0aGVpciBjaGlsZHJlblxuXHRcdFx0Ly8gKElFIDYgZG9lcyB0aGlzKVxuXHRcdFx0ZGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0XHRkaXYuc3R5bGUub3ZlcmZsb3cgPSBcInZpc2libGVcIjtcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBcIjxkaXY+PC9kaXY+XCI7XG5cdFx0XHRkaXYuZmlyc3RDaGlsZC5zdHlsZS53aWR0aCA9IFwiNXB4XCI7XG5cdFx0XHRzdXBwb3J0LnNocmlua1dyYXBCbG9ja3MgPSAoIGRpdi5vZmZzZXRXaWR0aCAhPT0gMyApO1xuXG5cdFx0XHRjb250YWluZXIuc3R5bGUuem9vbSA9IDE7XG5cdFx0fVxuXG5cdFx0Ly8gTnVsbCBlbGVtZW50cyB0byBhdm9pZCBsZWFrcyBpbiBJRVxuXHRcdGJvZHkucmVtb3ZlQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRcdGNvbnRhaW5lciA9IGRpdiA9IHRkcyA9IG1hcmdpbkRpdiA9IG51bGw7XG5cdH0pO1xuXG5cdC8vIE51bGwgZWxlbWVudHMgdG8gYXZvaWQgbGVha3MgaW4gSUVcblx0ZnJhZ21lbnQucmVtb3ZlQ2hpbGQoIGRpdiApO1xuXHRhbGwgPSBhID0gc2VsZWN0ID0gb3B0ID0gaW5wdXQgPSBmcmFnbWVudCA9IGRpdiA9IG51bGw7XG5cblx0cmV0dXJuIHN1cHBvcnQ7XG59KSgpO1xuIiwiLyohXG4gICogZG9tcmVhZHkgKGMpIER1c3RpbiBEaWF6IDIwMTQgLSBMaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxuXG59KCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgZm5zID0gW10sIGxpc3RlbmVyXG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgaGFjayA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGxcbiAgICAsIGRvbUNvbnRlbnRMb2FkZWQgPSAnRE9NQ29udGVudExvYWRlZCdcbiAgICAsIGxvYWRlZCA9IChoYWNrID8gL15sb2FkZWR8XmMvIDogL15sb2FkZWR8Xml8XmMvKS50ZXN0KGRvYy5yZWFkeVN0YXRlKVxuXG5cbiAgaWYgKCFsb2FkZWQpXG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyKVxuICAgIGxvYWRlZCA9IDFcbiAgICB3aGlsZSAobGlzdGVuZXIgPSBmbnMuc2hpZnQoKSkgbGlzdGVuZXIoKVxuICB9KVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICBsb2FkZWQgPyBzZXRUaW1lb3V0KGZuLCAwKSA6IGZucy5wdXNoKGZuKVxuICB9XG5cbn0pO1xuIiwiXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RG9jdW1lbnQ7XG5cbi8vIGRlZmluZWQgYnkgdzNjXG52YXIgRE9DVU1FTlRfTk9ERSA9IDk7XG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgYHdgIGlzIGEgRG9jdW1lbnQgb2JqZWN0LCBvciBgZmFsc2VgIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0gez99IGQgLSBEb2N1bWVudCBvYmplY3QsIG1heWJlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0RvY3VtZW50IChkKSB7XG4gIHJldHVybiBkICYmIGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX05PREU7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYGRvY3VtZW50YCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBgbm9kZWAsIHdoaWNoIG1heSBiZVxuICogYSBET00gZWxlbWVudCwgdGhlIFdpbmRvdyBvYmplY3QsIGEgU2VsZWN0aW9uLCBhIFJhbmdlLiBCYXNpY2FsbHkgYW55IERPTVxuICogb2JqZWN0IHRoYXQgcmVmZXJlbmNlcyB0aGUgRG9jdW1lbnQgaW4gc29tZSB3YXksIHRoaXMgZnVuY3Rpb24gd2lsbCBmaW5kIGl0LlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IG5vZGUgLSBET00gbm9kZSwgc2VsZWN0aW9uLCBvciByYW5nZSBpbiB3aGljaCB0byBmaW5kIHRoZSBgZG9jdW1lbnRgIG9iamVjdFxuICogQHJldHVybiB7RG9jdW1lbnR9IHRoZSBgZG9jdW1lbnRgIG9iamVjdCBhc3NvY2lhdGVkIHdpdGggYG5vZGVgXG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZ2V0RG9jdW1lbnQobm9kZSkge1xuICBpZiAoaXNEb2N1bWVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuXG4gIH0gZWxzZSBpZiAoaXNEb2N1bWVudChub2RlLm93bmVyRG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudDtcblxuICB9IGVsc2UgaWYgKGlzRG9jdW1lbnQobm9kZS5kb2N1bWVudCkpIHtcbiAgICByZXR1cm4gbm9kZS5kb2N1bWVudDtcblxuICB9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLnBhcmVudE5vZGUpO1xuXG4gIC8vIFJhbmdlIHN1cHBvcnRcbiAgfSBlbHNlIGlmIChub2RlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSB7XG4gICAgcmV0dXJuIGdldERvY3VtZW50KG5vZGUuY29tbW9uQW5jZXN0b3JDb250YWluZXIpO1xuXG4gIH0gZWxzZSBpZiAobm9kZS5zdGFydENvbnRhaW5lcikge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLnN0YXJ0Q29udGFpbmVyKTtcblxuICAvLyBTZWxlY3Rpb24gc3VwcG9ydFxuICB9IGVsc2UgaWYgKG5vZGUuYW5jaG9yTm9kZSkge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLmFuY2hvck5vZGUpO1xuICB9XG59XG4iLCIvKiEganMtY29va2llIHYzLjAuMSB8IE1JVCAqL1xuO1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBnbG9iYWwuQ29va2llcztcbiAgICB2YXIgZXhwb3J0cyA9IGdsb2JhbC5Db29raWVzID0gZmFjdG9yeSgpO1xuICAgIGV4cG9ydHMubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHsgZ2xvYmFsLkNvb2tpZXMgPSBjdXJyZW50OyByZXR1cm4gZXhwb3J0czsgfTtcbiAgfSgpKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbiAgZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFxuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG4gIHZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICAgIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlWzBdID09PSAnXCInKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyglW1xcZEEtRl17Mn0pKy9naSwgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgIH0sXG4gICAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkucmVwbGFjZShcbiAgICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgICBkZWNvZGVVUklDb21wb25lbnRcbiAgICAgIClcbiAgICB9XG4gIH07XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbiAgZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xuICAgIGZ1bmN0aW9uIHNldCAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XG4gICAgICB9XG4gICAgICBpZiAoYXR0cmlidXRlcy5leHBpcmVzKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICAgICAucmVwbGFjZSgvJSgyWzM0NkJdfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXG4gICAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICAgIHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcbiAgICAgIGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgICAgLy8gICAgIGNoYXJhY3RlcjpcbiAgICAgICAgLy8gQ29uc3VtZSB0aGUgY2hhcmFjdGVycyBvZiB0aGUgdW5wYXJzZWQtYXR0cmlidXRlcyB1cCB0byxcbiAgICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXS5zcGxpdCgnOycpWzBdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XG4gICAgICAgIGtleSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQgKGtleSkge1xuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgKGFyZ3VtZW50cy5sZW5ndGggJiYgIWtleSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcbiAgICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcbiAgICAgIHZhciBqYXIgPSB7fTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBmb3VuZEtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XG4gICAgICAgICAgamFyW2ZvdW5kS2V5XSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZEtleSk7XG5cbiAgICAgICAgICBpZiAoa2V5ID09PSBmb3VuZEtleSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXkgPyBqYXJba2V5XSA6IGphclxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAge1xuICAgICAgICBzZXQ6IHNldCxcbiAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuICAgICAgICAgIHNldChcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgYXNzaWduKHt9LCBhdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICAgIGV4cGlyZXM6IC0xXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpdGhBdHRyaWJ1dGVzOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICAgIHJldHVybiBpbml0KHRoaXMuY29udmVydGVyLCBhc3NpZ24oe30sIHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcykpXG4gICAgICAgIH0sXG4gICAgICAgIHdpdGhDb252ZXJ0ZXI6IGZ1bmN0aW9uIChjb252ZXJ0ZXIpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdChhc3NpZ24oe30sIHRoaXMuY29udmVydGVyLCBjb252ZXJ0ZXIpLCB0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoZGVmYXVsdEF0dHJpYnV0ZXMpIH0sXG4gICAgICAgIGNvbnZlcnRlcjogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShjb252ZXJ0ZXIpIH1cbiAgICAgIH1cbiAgICApXG4gIH1cblxuICB2YXIgYXBpID0gaW5pdChkZWZhdWx0Q29udmVydGVyLCB7IHBhdGg6ICcvJyB9KTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICByZXR1cm4gYXBpO1xuXG59KSkpO1xuIiwiLyohXG4gICoga2xhc3M6IGEgY2xhc3NpY2FsIEpTIE9PUCBmYcOnYWRlXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9rbGFzc1xuICAqIExpY2Vuc2UgTUlUIChjKSBEdXN0aW4gRGlheiAyMDE0XG4gICovXG5cbiFmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdrbGFzcycsIHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbnRleHQgPSB0aGlzXG4gICAgLCBmID0gJ2Z1bmN0aW9uJ1xuICAgICwgZm5UZXN0ID0gL3h5ei8udGVzdChmdW5jdGlvbiAoKSB7eHl6fSkgPyAvXFxic3VwclxcYi8gOiAvLiovXG4gICAgLCBwcm90byA9ICdwcm90b3R5cGUnXG5cbiAgZnVuY3Rpb24ga2xhc3Mobykge1xuICAgIHJldHVybiBleHRlbmQuY2FsbChpc0ZuKG8pID8gbyA6IGZ1bmN0aW9uICgpIHt9LCBvLCAxKVxuICB9XG5cbiAgZnVuY3Rpb24gaXNGbihvKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvID09PSBmXG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGssIGZuLCBzdXByKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0bXAgPSB0aGlzLnN1cHJcbiAgICAgIHRoaXMuc3VwciA9IHN1cHJbcHJvdG9dW2tdXG4gICAgICB2YXIgdW5kZWYgPSB7fS5mYWJyaWNhdGVkVW5kZWZpbmVkXG4gICAgICB2YXIgcmV0ID0gdW5kZWZcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc3VwciA9IHRtcFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3Mod2hhdCwgbywgc3Vwcikge1xuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgd2hhdFtrXSA9IGlzRm4ob1trXSlcbiAgICAgICAgICAmJiBpc0ZuKHN1cHJbcHJvdG9dW2tdKVxuICAgICAgICAgICYmIGZuVGVzdC50ZXN0KG9ba10pXG4gICAgICAgICAgPyB3cmFwKGssIG9ba10sIHN1cHIpIDogb1trXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGV4dGVuZChvLCBmcm9tU3ViKSB7XG4gICAgLy8gbXVzdCByZWRlZmluZSBub29wIGVhY2ggdGltZSBzbyBpdCBkb2Vzbid0IGluaGVyaXQgZnJvbSBwcmV2aW91cyBhcmJpdHJhcnkgY2xhc3Nlc1xuICAgIGZ1bmN0aW9uIG5vb3AoKSB7fVxuICAgIG5vb3BbcHJvdG9dID0gdGhpc1twcm90b11cbiAgICB2YXIgc3VwciA9IHRoaXNcbiAgICAgICwgcHJvdG90eXBlID0gbmV3IG5vb3AoKVxuICAgICAgLCBpc0Z1bmN0aW9uID0gaXNGbihvKVxuICAgICAgLCBfY29uc3RydWN0b3IgPSBpc0Z1bmN0aW9uID8gbyA6IHRoaXNcbiAgICAgICwgX21ldGhvZHMgPSBpc0Z1bmN0aW9uID8ge30gOiBvXG4gICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplKSB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZyb21TdWIgfHwgaXNGdW5jdGlvbiAmJiBzdXByLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgX2NvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbi5tZXRob2RzID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHByb2Nlc3MocHJvdG90eXBlLCBvLCBzdXByKVxuICAgICAgZm5bcHJvdG9dID0gcHJvdG90eXBlXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGZuLm1ldGhvZHMuY2FsbChmbiwgX21ldGhvZHMpLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZuXG5cbiAgICBmbi5leHRlbmQgPSBhcmd1bWVudHMuY2FsbGVlXG4gICAgZm5bcHJvdG9dLmltcGxlbWVudCA9IGZuLnN0YXRpY3MgPSBmdW5jdGlvbiAobywgb3B0Rm4pIHtcbiAgICAgIG8gPSB0eXBlb2YgbyA9PSAnc3RyaW5nJyA/IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvYmogPSB7fVxuICAgICAgICBvYmpbb10gPSBvcHRGblxuICAgICAgICByZXR1cm4gb2JqXG4gICAgICB9KCkpIDogb1xuICAgICAgcHJvY2Vzcyh0aGlzLCBvLCBzdXByKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICByZXR1cm4gZm5cbiAgfVxuXG4gIHJldHVybiBrbGFzc1xufSk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXNzaWduVmFsdWVgIGV4Y2VwdCB0aGF0IGl0IGRvZXNuJ3QgYXNzaWduXG4gKiBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICFlcShvYmplY3Rba2V5XSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbk1lcmdlVmFsdWU7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25JbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduSW47XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUFzc2lnbkluID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbkluJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBjb3B5U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHNJbicpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNNYXAgPSByZXF1aXJlKCcuL2lzTWFwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTZXQgPSByZXF1aXJlKCcuL2lzU2V0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc01hcCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcbiIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5nZXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXQob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IDAsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbdG9LZXkocGF0aFtpbmRleCsrXSldO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hcGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWFwKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gbWFwVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hcDtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzU2V0YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNTZXQodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBzZXRUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzU2V0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5c0luID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXNzaWduTWVyZ2VWYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnbk1lcmdlVmFsdWUnKSxcbiAgICBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGJhc2VNZXJnZURlZXAgPSByZXF1aXJlKCcuL19iYXNlTWVyZ2VEZWVwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKSxcbiAgICBzYWZlR2V0ID0gcmVxdWlyZSgnLi9fc2FmZUdldCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAob2JqZWN0ID09PSBzb3VyY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmFzZUZvcihzb3VyY2UsIGZ1bmN0aW9uKHNyY1ZhbHVlLCBrZXkpIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIGlmIChpc09iamVjdChzcmNWYWx1ZSkpIHtcbiAgICAgIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIGJhc2VNZXJnZSwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgICAgPyBjdXN0b21pemVyKHNhZmVHZXQob2JqZWN0LCBrZXkpLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH0sIGtleXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwidmFyIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5JyksXG4gICAgc2FmZUdldCA9IHJlcXVpcmUoJy4vX3NhZmVHZXQnKSxcbiAgICB0b1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi90b1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFjaykge1xuICB2YXIgb2JqVmFsdWUgPSBzYWZlR2V0KG9iamVjdCwga2V5KSxcbiAgICAgIHNyY1ZhbHVlID0gc2FmZUdldChzb3VyY2UsIGtleSksXG4gICAgICBzdGFja2VkID0gc3RhY2suZ2V0KHNyY1ZhbHVlKTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHN0YWNrZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIHZhciBpc0NvbW1vbiA9IG5ld1ZhbHVlID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgdmFyIGlzQXJyID0gaXNBcnJheShzcmNWYWx1ZSksXG4gICAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiBpc0J1ZmZlcihzcmNWYWx1ZSksXG4gICAgICAgIGlzVHlwZWQgPSAhaXNBcnIgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkoc3JjVmFsdWUpO1xuXG4gICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnIgfHwgaXNCdWZmIHx8IGlzVHlwZWQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNBcnJheUxpa2VPYmplY3Qob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gY29weUFycmF5KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQnVmZikge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lQnVmZmVyKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzVHlwZWQpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZVR5cGVkQXJyYXkoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc3JjVmFsdWUpIHx8IGlzQXJndW1lbnRzKHNyY1ZhbHVlKSkge1xuICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIGlmIChpc0FyZ3VtZW50cyhvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0b1BsYWluT2JqZWN0KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc09iamVjdChvYmpWYWx1ZSkgfHwgaXNGdW5jdGlvbihvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpbml0Q2xvbmVPYmplY3Qoc3JjVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHN0YWNrLnNldChzcmNWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIG1lcmdlRnVuYyhuZXdWYWx1ZSwgc3JjVmFsdWUsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgc3RhY2tbJ2RlbGV0ZSddKHNyY1ZhbHVlKTtcbiAgfVxuICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlRGVlcDtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcbiIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQnVmZmVyO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHN5bWJvbCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuICByZXR1cm4gc3ltYm9sVmFsdWVPZiA/IE9iamVjdChzeW1ib2xWYWx1ZU9mLmNhbGwoc3ltYm9sKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVN5bWJvbDtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lVHlwZWRBcnJheTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyk7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpO1xuXG4vKipcbiAqIENvcGllcyBvd24gc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHNJbihzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzSW47XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwidmFyIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGJhc2VSZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXM7XG4iLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHNJbicpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzSW4sIGdldFN5bWJvbHNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5c0luO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldFByb3RvdHlwZSA9IG92ZXJBcmcoT2JqZWN0LmdldFByb3RvdHlwZU9mLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFByb3RvdHlwZTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsInZhciBhcnJheUZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5RmlsdGVyJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzSW4gPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlIChvYmplY3QpIHtcbiAgICBhcnJheVB1c2gocmVzdWx0LCBnZXRTeW1ib2xzKG9iamVjdCkpO1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZShvYmplY3QpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHNJbjtcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hEZWxldGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoR2V0O1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBuZXcgYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKSxcbiAgICBjbG9uZURhdGFWaWV3ID0gcmVxdWlyZSgnLi9fY2xvbmVEYXRhVmlldycpLFxuICAgIGNsb25lUmVnRXhwID0gcmVxdWlyZSgnLi9fY2xvbmVSZWdFeHAnKSxcbiAgICBjbG9uZVN5bWJvbCA9IHJlcXVpcmUoJy4vX2Nsb25lU3ltYm9sJyksXG4gICAgY2xvbmVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fY2xvbmVUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBNYXBgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIGBTZXRgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVCeVRhZyhvYmplY3QsIHRhZywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICByZXR1cm4gY2xvbmVEYXRhVmlldyhvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVSZWdFeHAob2JqZWN0KTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yO1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTeW1ib2wob2JqZWN0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUJ5VGFnO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdClcbiAgICAgICkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgICB2YWx1ZSA9PSBudWxsIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAob2JqZWN0ICE9IG51bGwgJiYgdmFsdWUgaW4gT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5YWJsZTtcbiIsInZhciBjb3JlSnNEYXRhID0gcmVxdWlyZSgnLi9fY29yZUpzRGF0YScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUHJvdG90eXBlO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUNsZWFyO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlRGVsZXRlO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUdldDtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlSGFzO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlU2V0O1xuIiwidmFyIEhhc2ggPSByZXF1aXJlKCcuL19IYXNoJyksXG4gICAgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUNsZWFyO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlRGVsZXRlO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUdldDtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlSGFzO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZVNldDtcbiIsInZhciBtZW1vaXplID0gcmVxdWlyZSgnLi9tZW1vaXplJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBtYXhpbXVtIG1lbW9pemUgY2FjaGUgc2l6ZS4gKi9cbnZhciBNQVhfTUVNT0laRV9TSVpFID0gNTAwO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tZW1vaXplYCB3aGljaCBjbGVhcnMgdGhlIG1lbW9pemVkIGZ1bmN0aW9uJ3NcbiAqIGNhY2hlIHdoZW4gaXQgZXhjZWVkcyBgTUFYX01FTU9JWkVfU0laRWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtZW1vaXplQ2FwcGVkKGZ1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IG1lbW9pemUoZnVuYywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGNhY2hlLnNpemUgPT09IE1BWF9NRU1PSVpFX1NJWkUpIHtcbiAgICAgIGNhY2hlLmNsZWFyKCk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH0pO1xuXG4gIHZhciBjYWNoZSA9IHJlc3VsdC5jYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplQ2FwcGVkO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUNyZWF0ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlXG4gKiBbYE9iamVjdC5rZXlzYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBleGNlcHQgdGhhdCBpdCBpbmNsdWRlcyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBuYXRpdmVLZXlzSW4ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG4gICAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXNJbjtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAsIHVubGVzcyBga2V5YCBpcyBcIl9fcHJvdG9fX1wiIG9yIFwiY29uc3RydWN0b3JcIi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHNhZmVHZXQob2JqZWN0LCBrZXkpIHtcbiAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyAmJiB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNhZmVHZXQ7XG4iLCJ2YXIgYmFzZVNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVNldFRvU3RyaW5nJyksXG4gICAgc2hvcnRPdXQgPSByZXF1aXJlKCcuL19zaG9ydE91dCcpO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDgwMCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG4gKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcbiAqIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcbiAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblxuICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tTZXQ7XG4iLCJ2YXIgbWVtb2l6ZUNhcHBlZCA9IHJlcXVpcmUoJy4vX21lbW9pemVDYXBwZWQnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oPzpcXC58XFxbXFxdKSg/OlxcLnxcXFtcXF18JCkpL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChzdHJpbmcuY2hhckNvZGVBdCgwKSA9PT0gNDYgLyogLiAqLykge1xuICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgfVxuICBzdHJpbmcucmVwbGFjZShyZVByb3BOYW1lLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3ViU3RyaW5nKSB7XG4gICAgcmVzdWx0LnB1c2gocXVvdGUgPyBzdWJTdHJpbmcucmVwbGFjZShyZUVzY2FwZUNoYXIsICckMScpIDogKG51bWJlciB8fCBtYXRjaCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ1RvUGF0aDtcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9LZXk7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgY3JlYXRlQXNzaWduZXIgPSByZXF1aXJlKCcuL19jcmVhdGVBc3NpZ25lcicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIGRlc3RpbmF0aW9uIG9iamVjdC4gU291cmNlIG9iamVjdHMgYXJlIGFwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICogU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgIGFuZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwczovL21kbi5pby9PYmplY3QvYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMTAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQHNlZSBfLmFzc2lnbkluXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBCYXIoKSB7XG4gKiAgIHRoaXMuYyA9IDM7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5iID0gMjtcbiAqIEJhci5wcm90b3R5cGUuZCA9IDQ7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDAgfSwgbmV3IEZvbywgbmV3IEJhcik7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAqL1xudmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlKSB7XG4gIGlmIChpc1Byb3RvdHlwZShzb3VyY2UpIHx8IGlzQXJyYXlMaWtlKHNvdXJjZSkpIHtcbiAgICBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgc291cmNlW2tleV0pO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDEsXG4gICAgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmNsb25lYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBjbG9uZXMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmVjdXJzaXZlbHkgY2xvbmUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZGVlcCBjbG9uZWQgdmFsdWUuXG4gKiBAc2VlIF8uY2xvbmVcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAnYSc6IDEgfSwgeyAnYic6IDIgfV07XG4gKlxuICogdmFyIGRlZXAgPSBfLmNsb25lRGVlcChvYmplY3RzKTtcbiAqIGNvbnNvbGUubG9nKGRlZXBbMF0gPT09IG9iamVjdHNbMF0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gY2xvbmVEZWVwKHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIENMT05FX0RFRVBfRkxBRyB8IENMT05FX1NZTUJPTFNfRkxBRyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEZWVwO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgY2FzdEZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fY2FzdEZ1bmN0aW9uJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIFwibGVuZ3RoXCJcbiAqIHByb3BlcnR5IGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciB1c2UgYF8uZm9ySW5gXG4gKiBvciBgXy5mb3JPd25gIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyBlYWNoXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzZWUgXy5mb3JFYWNoUmlnaHRcbiAqIEBleGFtcGxlXG4gKlxuICogXy5mb3JFYWNoKFsxLCAyXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzIGAxYCB0aGVuIGAyYC5cbiAqXG4gKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgJ2EnIHRoZW4gJ2InIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpLlxuICovXG5mdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RWFjaCA6IGJhc2VFYWNoO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBjYXN0RnVuY3Rpb24oaXRlcmF0ZWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGBvYmplY3RgLiBJZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXNcbiAqIGB1bmRlZmluZWRgLCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgcmV0dXJuZWQgaW4gaXRzIHBsYWNlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy43LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBmb3IgYHVuZGVmaW5lZGAgcmVzb2x2ZWQgdmFsdWVzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYyc6IDMgfSB9XSB9O1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2FbMF0uYi5jJyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCBbJ2EnLCAnMCcsICdiJywgJ2MnXSk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCAnYS5iLmMnLCAnZGVmYXVsdCcpO1xuICogLy8gPT4gJ2RlZmF1bHQnXG4gKi9cbmZ1bmN0aW9uIGdldChvYmplY3QsIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZU9iamVjdDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCJ2YXIgYmFzZUlzTWFwID0gcmVxdWlyZSgnLi9fYmFzZUlzTWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc01hcCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzTWFwO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTWFwYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc01hcChuZXcgTWFwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTWFwKG5ldyBXZWFrTWFwKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc01hcCA9IG5vZGVJc01hcCA/IGJhc2VVbmFyeShub2RlSXNNYXApIDogYmFzZUlzTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFwO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBpbmZlciB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuICovXG52YXIgb2JqZWN0Q3RvclN0cmluZyA9IGZ1bmNUb1N0cmluZy5jYWxsKE9iamVjdCk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC44LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QobmV3IEZvbyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpIHx8IGJhc2VHZXRUYWcodmFsdWUpICE9IG9iamVjdFRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcHJvdG8gPSBnZXRQcm90b3R5cGUodmFsdWUpO1xuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgQ3RvciA9IGhhc093blByb3BlcnR5LmNhbGwocHJvdG8sICdjb25zdHJ1Y3RvcicpICYmIHByb3RvLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yIGluc3RhbmNlb2YgQ3RvciAmJlxuICAgIGZ1bmNUb1N0cmluZy5jYWxsKEN0b3IpID09IG9iamVjdEN0b3JTdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQbGFpbk9iamVjdDtcbiIsInZhciBiYXNlSXNTZXQgPSByZXF1aXJlKCcuL19iYXNlSXNTZXQnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzU2V0ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNTZXQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTZXRgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU2V0KG5ldyBTZXQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTZXQobmV3IFdlYWtTZXQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzU2V0ID0gbm9kZUlzU2V0ID8gYmFzZVVuYXJ5KG5vZGVJc1NldCkgOiBiYXNlSXNTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTZXQ7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzSW4gPSByZXF1aXJlKCcuL19iYXNlS2V5c0luJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbWVtb2l6ZXMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuIElmIGByZXNvbHZlcmAgaXNcbiAqIHByb3ZpZGVkLCBpdCBkZXRlcm1pbmVzIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdCBiYXNlZCBvbiB0aGVcbiAqIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uIEJ5IGRlZmF1bHQsIHRoZSBmaXJzdCBhcmd1bWVudFxuICogcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIG1hcCBjYWNoZSBrZXkuIFRoZSBgZnVuY2BcbiAqIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLlxuICpcbiAqICoqTm90ZToqKiBUaGUgY2FjaGUgaXMgZXhwb3NlZCBhcyB0aGUgYGNhY2hlYCBwcm9wZXJ0eSBvbiB0aGUgbWVtb2l6ZWRcbiAqIGZ1bmN0aW9uLiBJdHMgY3JlYXRpb24gbWF5IGJlIGN1c3RvbWl6ZWQgYnkgcmVwbGFjaW5nIHRoZSBgXy5tZW1vaXplLkNhY2hlYFxuICogY29uc3RydWN0b3Igd2l0aCBvbmUgd2hvc2UgaW5zdGFuY2VzIGltcGxlbWVudCB0aGVcbiAqIFtgTWFwYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcHJvcGVydGllcy1vZi10aGUtbWFwLXByb3RvdHlwZS1vYmplY3QpXG4gKiBtZXRob2QgaW50ZXJmYWNlIG9mIGBjbGVhcmAsIGBkZWxldGVgLCBgZ2V0YCwgYGhhc2AsIGFuZCBgc2V0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXNvbHZlcl0gVGhlIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIGNhY2hlIGtleS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogMiB9O1xuICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9O1xuICpcbiAqIHZhciB2YWx1ZXMgPSBfLm1lbW9pemUoXy52YWx1ZXMpO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiB2YWx1ZXMob3RoZXIpO1xuICogLy8gPT4gWzMsIDRdXG4gKlxuICogb2JqZWN0LmEgPSAyO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiAvLyBNb2RpZnkgdGhlIHJlc3VsdCBjYWNoZS5cbiAqIHZhbHVlcy5jYWNoZS5zZXQob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWydhJywgJ2InXVxuICpcbiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuXG4gKiBfLm1lbW9pemUuQ2FjaGUgPSBXZWFrTWFwO1xuICovXG5mdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nIHx8IChyZXNvbHZlciAhPSBudWxsICYmIHR5cGVvZiByZXNvbHZlciAhPSAnZnVuY3Rpb24nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7XG5cbiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBjYWNoZS5nZXQoa2V5KTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgbWVtb2l6ZWQuY2FjaGUgPSBjYWNoZS5zZXQoa2V5LCByZXN1bHQpIHx8IGNhY2hlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIG1lbW9pemVkLmNhY2hlID0gbmV3IChtZW1vaXplLkNhY2hlIHx8IE1hcENhY2hlKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG4vLyBFeHBvc2UgYE1hcENhY2hlYC5cbm1lbW9pemUuQ2FjaGUgPSBNYXBDYWNoZTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplO1xuIiwidmFyIGJhc2VNZXJnZSA9IHJlcXVpcmUoJy4vX2Jhc2VNZXJnZScpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQXNzaWduZXInKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmFzc2lnbmAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgbWVyZ2VzIG93biBhbmRcbiAqIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3RzIGludG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuIFNvdXJjZSBwcm9wZXJ0aWVzIHRoYXQgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCBhcmVcbiAqIHNraXBwZWQgaWYgYSBkZXN0aW5hdGlvbiB2YWx1ZSBleGlzdHMuIEFycmF5IGFuZCBwbGFpbiBvYmplY3QgcHJvcGVydGllc1xuICogYXJlIG1lcmdlZCByZWN1cnNpdmVseS4gT3RoZXIgb2JqZWN0cyBhbmQgdmFsdWUgdHlwZXMgYXJlIG92ZXJyaWRkZW4gYnlcbiAqIGFzc2lnbm1lbnQuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC4gU3Vic2VxdWVudFxuICogc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuNS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7XG4gKiAgICdhJzogW3sgJ2InOiAyIH0sIHsgJ2QnOiA0IH1dXG4gKiB9O1xuICpcbiAqIHZhciBvdGhlciA9IHtcbiAqICAgJ2EnOiBbeyAnYyc6IDMgfSwgeyAnZSc6IDUgfV1cbiAqIH07XG4gKlxuICogXy5tZXJnZShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHsgJ2EnOiBbeyAnYic6IDIsICdjJzogMyB9LCB7ICdkJzogNCwgJ2UnOiA1IH1dIH1cbiAqL1xudmFyIG1lcmdlID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4KSB7XG4gIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLm5vb3ApO1xuICogLy8gPT4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkXVxuICovXG5mdW5jdGlvbiBub29wKCkge1xuICAvLyBObyBvcGVyYXRpb24gcGVyZm9ybWVkLlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5vb3A7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJBcnJheTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmdcbiAqIGtleWVkIHByb3BlcnRpZXMgb2YgYHZhbHVlYCB0byBvd24gcHJvcGVydGllcyBvZiB0aGUgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY29weU9iamVjdCh2YWx1ZSwga2V5c0luKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9QbGFpbk9iamVjdDtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHVuZGVmO1xuXG4vKipcbiAqIERlY29kZSBhIFVSSSBlbmNvZGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFVSSSBlbmNvZGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIHtTdHJpbmd8TnVsbH0gVGhlIGRlY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoaW5wdXQucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRlbXB0cyB0byBlbmNvZGUgYSBnaXZlbiBpbnB1dC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIGVuY29kZWQuXG4gKiBAcmV0dXJucyB7U3RyaW5nfE51bGx9IFRoZSBlbmNvZGVkIHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIHF1ZXJ5IHN0cmluZyBwYXJzZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5IFRoZSBxdWVyeSBzdHJpbmcgdGhhdCBuZWVkcyB0byBiZSBwYXJzZWQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnkpIHtcbiAgdmFyIHBhcnNlciA9IC8oW149PyMmXSspPT8oW14mXSopL2dcbiAgICAsIHJlc3VsdCA9IHt9XG4gICAgLCBwYXJ0O1xuXG4gIHdoaWxlIChwYXJ0ID0gcGFyc2VyLmV4ZWMocXVlcnkpKSB7XG4gICAgdmFyIGtleSA9IGRlY29kZShwYXJ0WzFdKVxuICAgICAgLCB2YWx1ZSA9IGRlY29kZShwYXJ0WzJdKTtcblxuICAgIC8vXG4gICAgLy8gUHJldmVudCBvdmVycmlkaW5nIG9mIGV4aXN0aW5nIHByb3BlcnRpZXMuIFRoaXMgZW5zdXJlcyB0aGF0IGJ1aWxkLWluXG4gICAgLy8gbWV0aG9kcyBsaWtlIGB0b1N0cmluZ2Agb3IgX19wcm90b19fIGFyZSBub3Qgb3ZlcnJpZGVuIGJ5IG1hbGljaW91c1xuICAgIC8vIHF1ZXJ5c3RyaW5ncy5cbiAgICAvL1xuICAgIC8vIEluIHRoZSBjYXNlIGlmIGZhaWxlZCBkZWNvZGluZywgd2Ugd2FudCB0byBvbWl0IHRoZSBrZXkvdmFsdWUgcGFpcnNcbiAgICAvLyBmcm9tIHRoZSByZXN1bHQuXG4gICAgLy9cbiAgICBpZiAoa2V5ID09PSBudWxsIHx8IHZhbHVlID09PSBudWxsIHx8IGtleSBpbiByZXN1bHQpIGNvbnRpbnVlO1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhIHF1ZXJ5IHN0cmluZyB0byBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBPYmplY3QgdGhhdCBzaG91bGQgYmUgdHJhbnNmb3JtZWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4IE9wdGlvbmFsIHByZWZpeC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZ2lmeShvYmosIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggfHwgJyc7XG5cbiAgdmFyIHBhaXJzID0gW11cbiAgICAsIHZhbHVlXG4gICAgLCBrZXk7XG5cbiAgLy9cbiAgLy8gT3B0aW9uYWxseSBwcmVmaXggd2l0aCBhICc/JyBpZiBuZWVkZWRcbiAgLy9cbiAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgcHJlZml4KSBwcmVmaXggPSAnPyc7XG5cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhcy5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgLy9cbiAgICAgIC8vIEVkZ2UgY2FzZXMgd2hlcmUgd2UgYWN0dWFsbHkgd2FudCB0byBlbmNvZGUgdGhlIHZhbHVlIHRvIGFuIGVtcHR5XG4gICAgICAvLyBzdHJpbmcgaW5zdGVhZCBvZiB0aGUgc3RyaW5naWZpZWQgdmFsdWUuXG4gICAgICAvL1xuICAgICAgaWYgKCF2YWx1ZSAmJiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmIHx8IGlzTmFOKHZhbHVlKSkpIHtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cblxuICAgICAga2V5ID0gZW5jb2RlKGtleSk7XG4gICAgICB2YWx1ZSA9IGVuY29kZSh2YWx1ZSk7XG5cbiAgICAgIC8vXG4gICAgICAvLyBJZiB3ZSBmYWlsZWQgdG8gZW5jb2RlIHRoZSBzdHJpbmdzLCB3ZSBzaG91bGQgYmFpbCBvdXQgYXMgd2UgZG9uJ3RcbiAgICAgIC8vIHdhbnQgdG8gYWRkIGludmFsaWQgc3RyaW5ncyB0byB0aGUgcXVlcnkuXG4gICAgICAvL1xuICAgICAgaWYgKGtleSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBwYWlycy5wdXNoKGtleSArJz0nKyB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhaXJzLmxlbmd0aCA/IHByZWZpeCArIHBhaXJzLmpvaW4oJyYnKSA6ICcnO1xufVxuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuZXhwb3J0cy5zdHJpbmdpZnkgPSBxdWVyeXN0cmluZ2lmeTtcbmV4cG9ydHMucGFyc2UgPSBxdWVyeXN0cmluZztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayBpZiB3ZSdyZSByZXF1aXJlZCB0byBhZGQgYSBwb3J0IG51bWJlci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jZGVmYXVsdC1wb3J0XG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHBvcnQgUG9ydCBudW1iZXIgd2UgbmVlZCB0byBjaGVja1xuICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sIFByb3RvY29sIHdlIG5lZWQgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJcyBpdCBhIGRlZmF1bHQgcG9ydCBmb3IgdGhlIGdpdmVuIHByb3RvY29sXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXF1aXJlZChwb3J0LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sLnNwbGl0KCc6JylbMF07XG4gIHBvcnQgPSArcG9ydDtcblxuICBpZiAoIXBvcnQpIHJldHVybiBmYWxzZTtcblxuICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgY2FzZSAnaHR0cCc6XG4gICAgY2FzZSAnd3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA4MDtcblxuICAgIGNhc2UgJ2h0dHBzJzpcbiAgICBjYXNlICd3c3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA0NDM7XG5cbiAgICBjYXNlICdmdHAnOlxuICAgIHJldHVybiBwb3J0ICE9PSAyMTtcblxuICAgIGNhc2UgJ2dvcGhlcic6XG4gICAgcmV0dXJuIHBvcnQgIT09IDcwO1xuXG4gICAgY2FzZSAnZmlsZSc6XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBvcnQgIT09IDA7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWlyZWQgPSByZXF1aXJlKCdyZXF1aXJlcy1wb3J0JylcbiAgLCBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5naWZ5JylcbiAgLCBzbGFzaGVzID0gL15bQS1aYS16XVtBLVphLXowLTkrLS5dKjpcXC9cXC8vXG4gICwgcHJvdG9jb2xyZSA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFxcL1xcLyk/KFtcXFxcL10rKT8oW1xcU1xcc10qKS9pXG4gICwgd2luZG93c0RyaXZlTGV0dGVyID0gL15bYS16QS1aXTovXG4gICwgd2hpdGVzcGFjZSA9ICdbXFxcXHgwOVxcXFx4MEFcXFxceDBCXFxcXHgwQ1xcXFx4MERcXFxceDIwXFxcXHhBMFxcXFx1MTY4MFxcXFx1MTgwRVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwQVxcXFx1MjAyRlxcXFx1MjA1RlxcXFx1MzAwMFxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1RkVGRl0nXG4gICwgbGVmdCA9IG5ldyBSZWdFeHAoJ14nKyB3aGl0ZXNwYWNlICsnKycpO1xuXG4vKipcbiAqIFRyaW0gYSBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gdHJpbS5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XG4gIHJldHVybiAoc3RyID8gc3RyIDogJycpLnRvU3RyaW5nKCkucmVwbGFjZShsZWZ0LCAnJyk7XG59XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBwYXJzZSBydWxlcyBmb3IgdGhlIFVSTCBwYXJzZXIsIGl0IGluZm9ybXMgdGhlIHBhcnNlclxuICogYWJvdXQ6XG4gKlxuICogMC4gVGhlIGNoYXIgaXQgTmVlZHMgdG8gcGFyc2UsIGlmIGl0J3MgYSBzdHJpbmcgaXQgc2hvdWxkIGJlIGRvbmUgdXNpbmdcbiAqICAgIGluZGV4T2YsIFJlZ0V4cCB1c2luZyBleGVjIGFuZCBOYU4gbWVhbnMgc2V0IGFzIGN1cnJlbnQgdmFsdWUuXG4gKiAxLiBUaGUgcHJvcGVydHkgd2Ugc2hvdWxkIHNldCB3aGVuIHBhcnNpbmcgdGhpcyB2YWx1ZS5cbiAqIDIuIEluZGljYXRpb24gaWYgaXQncyBiYWNrd2FyZHMgb3IgZm9yd2FyZCBwYXJzaW5nLCB3aGVuIHNldCBhcyBudW1iZXIgaXQnc1xuICogICAgdGhlIHZhbHVlIG9mIGV4dHJhIGNoYXJzIHRoYXQgc2hvdWxkIGJlIHNwbGl0IG9mZi5cbiAqIDMuIEluaGVyaXQgZnJvbSBsb2NhdGlvbiBpZiBub24gZXhpc3RpbmcgaW4gdGhlIHBhcnNlci5cbiAqIDQuIGB0b0xvd2VyQ2FzZWAgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAqL1xudmFyIHJ1bGVzID0gW1xuICBbJyMnLCAnaGFzaCddLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWyc/JywgJ3F1ZXJ5J10sICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIGZ1bmN0aW9uIHNhbml0aXplKGFkZHJlc3MsIHVybCkgeyAgICAgLy8gU2FuaXRpemUgd2hhdCBpcyBsZWZ0IG9mIHRoZSBhZGRyZXNzXG4gICAgcmV0dXJuIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpID8gYWRkcmVzcy5yZXBsYWNlKC9cXFxcL2csICcvJykgOiBhZGRyZXNzO1xuICB9LFxuICBbJy8nLCAncGF0aG5hbWUnXSwgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWydAJywgJ2F1dGgnLCAxXSwgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGZyb250LlxuICBbTmFOLCAnaG9zdCcsIHVuZGVmaW5lZCwgMSwgMV0sICAgICAgIC8vIFNldCBsZWZ0IG92ZXIgdmFsdWUuXG4gIFsvOihcXGQrKSQvLCAncG9ydCcsIHVuZGVmaW5lZCwgMV0sICAgIC8vIFJlZ0V4cCB0aGUgYmFjay5cbiAgW05hTiwgJ2hvc3RuYW1lJywgdW5kZWZpbmVkLCAxLCAxXSAgICAvLyBTZXQgbGVmdCBvdmVyLlxuXTtcblxuLyoqXG4gKiBUaGVzZSBwcm9wZXJ0aWVzIHNob3VsZCBub3QgYmUgY29waWVkIG9yIGluaGVyaXRlZCBmcm9tLiBUaGlzIGlzIG9ubHkgbmVlZGVkXG4gKiBmb3IgYWxsIG5vbiBibG9iIFVSTCdzIGFzIGEgYmxvYiBVUkwgZG9lcyBub3QgaW5jbHVkZSBhIGhhc2gsIG9ubHkgdGhlXG4gKiBvcmlnaW4uXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBpZ25vcmUgPSB7IGhhc2g6IDEsIHF1ZXJ5OiAxIH07XG5cbi8qKlxuICogVGhlIGxvY2F0aW9uIG9iamVjdCBkaWZmZXJzIHdoZW4geW91ciBjb2RlIGlzIGxvYWRlZCB0aHJvdWdoIGEgbm9ybWFsIHBhZ2UsXG4gKiBXb3JrZXIgb3IgdGhyb3VnaCBhIHdvcmtlciB1c2luZyBhIGJsb2IuIEFuZCB3aXRoIHRoZSBibG9iYmxlIGJlZ2lucyB0aGVcbiAqIHRyb3VibGUgYXMgdGhlIGxvY2F0aW9uIG9iamVjdCB3aWxsIGNvbnRhaW4gdGhlIFVSTCBvZiB0aGUgYmxvYiwgbm90IHRoZVxuICogbG9jYXRpb24gb2YgdGhlIHBhZ2Ugd2hlcmUgb3VyIGNvZGUgaXMgbG9hZGVkIGluLiBUaGUgYWN0dWFsIG9yaWdpbiBpc1xuICogZW5jb2RlZCBpbiB0aGUgYHBhdGhuYW1lYCBzbyB3ZSBjYW4gdGhhbmtmdWxseSBnZW5lcmF0ZSBhIGdvb2QgXCJkZWZhdWx0XCJcbiAqIGxvY2F0aW9uIGZyb20gaXQgc28gd2UgY2FuIGdlbmVyYXRlIHByb3BlciByZWxhdGl2ZSBVUkwncyBhZ2Fpbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGxvYyBPcHRpb25hbCBkZWZhdWx0IGxvY2F0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IGxvbGNhdGlvbiBvYmplY3QuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGxvbGNhdGlvbihsb2MpIHtcbiAgdmFyIGdsb2JhbFZhcjtcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHdpbmRvdztcbiAgZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IGdsb2JhbDtcbiAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSBnbG9iYWxWYXIgPSBzZWxmO1xuICBlbHNlIGdsb2JhbFZhciA9IHt9O1xuXG4gIHZhciBsb2NhdGlvbiA9IGdsb2JhbFZhci5sb2NhdGlvbiB8fCB7fTtcbiAgbG9jID0gbG9jIHx8IGxvY2F0aW9uO1xuXG4gIHZhciBmaW5hbGRlc3RpbmF0aW9uID0ge31cbiAgICAsIHR5cGUgPSB0eXBlb2YgbG9jXG4gICAgLCBrZXk7XG5cbiAgaWYgKCdibG9iOicgPT09IGxvYy5wcm90b2NvbCkge1xuICAgIGZpbmFsZGVzdGluYXRpb24gPSBuZXcgVXJsKHVuZXNjYXBlKGxvYy5wYXRobmFtZSksIHt9KTtcbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZSkge1xuICAgIGZpbmFsZGVzdGluYXRpb24gPSBuZXcgVXJsKGxvYywge30pO1xuICAgIGZvciAoa2V5IGluIGlnbm9yZSkgZGVsZXRlIGZpbmFsZGVzdGluYXRpb25ba2V5XTtcbiAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gdHlwZSkge1xuICAgIGZvciAoa2V5IGluIGxvYykge1xuICAgICAgaWYgKGtleSBpbiBpZ25vcmUpIGNvbnRpbnVlO1xuICAgICAgZmluYWxkZXN0aW5hdGlvbltrZXldID0gbG9jW2tleV07XG4gICAgfVxuXG4gICAgaWYgKGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uLnNsYXNoZXMgPSBzbGFzaGVzLnRlc3QobG9jLmhyZWYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmaW5hbGRlc3RpbmF0aW9uO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYSBwcm90b2NvbCBzY2hlbWUgaXMgc3BlY2lhbC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gVGhlIHByb3RvY29sIHNjaGVtZSBvZiB0aGUgVVJMXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHByb3RvY29sIHNjaGVtZSBpcyBzcGVjaWFsLCBlbHNlIGBmYWxzZWBcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGlzU3BlY2lhbChzY2hlbWUpIHtcbiAgcmV0dXJuIChcbiAgICBzY2hlbWUgPT09ICdmaWxlOicgfHxcbiAgICBzY2hlbWUgPT09ICdmdHA6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2h0dHA6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2h0dHBzOicgfHxcbiAgICBzY2hlbWUgPT09ICd3czonIHx8XG4gICAgc2NoZW1lID09PSAnd3NzOidcbiAgKTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBQcm90b2NvbEV4dHJhY3RcbiAqIEB0eXBlIE9iamVjdFxuICogQHByb3BlcnR5IHtTdHJpbmd9IHByb3RvY29sIFByb3RvY29sIG1hdGNoZWQgaW4gdGhlIFVSTCwgaW4gbG93ZXJjYXNlLlxuICogQHByb3BlcnR5IHtCb29sZWFufSBzbGFzaGVzIGB0cnVlYCBpZiBwcm90b2NvbCBpcyBmb2xsb3dlZCBieSBcIi8vXCIsIGVsc2UgYGZhbHNlYC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSByZXN0IFJlc3Qgb2YgdGhlIFVSTCB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBwcm90b2NvbC5cbiAqL1xuXG4vKipcbiAqIEV4dHJhY3QgcHJvdG9jb2wgaW5mb3JtYXRpb24gZnJvbSBhIFVSTCB3aXRoL3dpdGhvdXQgZG91YmxlIHNsYXNoIChcIi8vXCIpLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIFVSTCB3ZSB3YW50IHRvIGV4dHJhY3QgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhdGlvblxuICogQHJldHVybiB7UHJvdG9jb2xFeHRyYWN0fSBFeHRyYWN0ZWQgaW5mb3JtYXRpb24uXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBleHRyYWN0UHJvdG9jb2woYWRkcmVzcywgbG9jYXRpb24pIHtcbiAgYWRkcmVzcyA9IHRyaW1MZWZ0KGFkZHJlc3MpO1xuICBsb2NhdGlvbiA9IGxvY2F0aW9uIHx8IHt9O1xuXG4gIHZhciBtYXRjaCA9IHByb3RvY29scmUuZXhlYyhhZGRyZXNzKTtcbiAgdmFyIHByb3RvY29sID0gbWF0Y2hbMV0gPyBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpIDogJyc7XG4gIHZhciBmb3J3YXJkU2xhc2hlcyA9ICEhbWF0Y2hbMl07XG4gIHZhciBvdGhlclNsYXNoZXMgPSAhIW1hdGNoWzNdO1xuICB2YXIgc2xhc2hlc0NvdW50ID0gMDtcbiAgdmFyIHJlc3Q7XG5cbiAgaWYgKGZvcndhcmRTbGFzaGVzKSB7XG4gICAgaWYgKG90aGVyU2xhc2hlcykge1xuICAgICAgcmVzdCA9IG1hdGNoWzJdICsgbWF0Y2hbM10gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzJdLmxlbmd0aCArIG1hdGNoWzNdLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdCA9IG1hdGNoWzJdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFsyXS5sZW5ndGg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChvdGhlclNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSBtYXRjaFszXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbM10ubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0ID0gbWF0Y2hbNF1cbiAgICB9XG4gIH1cblxuICBpZiAocHJvdG9jb2wgPT09ICdmaWxlOicpIHtcbiAgICBpZiAoc2xhc2hlc0NvdW50ID49IDIpIHtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKDIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc1NwZWNpYWwocHJvdG9jb2wpKSB7XG4gICAgcmVzdCA9IG1hdGNoWzRdO1xuICB9IGVsc2UgaWYgKHByb3RvY29sKSB7XG4gICAgaWYgKGZvcndhcmRTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZSgyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoc2xhc2hlc0NvdW50ID49IDIgJiYgaXNTcGVjaWFsKGxvY2F0aW9uLnByb3RvY29sKSkge1xuICAgIHJlc3QgPSBtYXRjaFs0XTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgIHNsYXNoZXM6IGZvcndhcmRTbGFzaGVzIHx8IGlzU3BlY2lhbChwcm90b2NvbCksXG4gICAgc2xhc2hlc0NvdW50OiBzbGFzaGVzQ291bnQsXG4gICAgcmVzdDogcmVzdFxuICB9O1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSByZWxhdGl2ZSBVUkwgcGF0aG5hbWUgYWdhaW5zdCBhIGJhc2UgVVJMIHBhdGhuYW1lLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGl2ZSBQYXRobmFtZSBvZiB0aGUgcmVsYXRpdmUgVVJMLlxuICogQHBhcmFtIHtTdHJpbmd9IGJhc2UgUGF0aG5hbWUgb2YgdGhlIGJhc2UgVVJMLlxuICogQHJldHVybiB7U3RyaW5nfSBSZXNvbHZlZCBwYXRobmFtZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmUocmVsYXRpdmUsIGJhc2UpIHtcbiAgaWYgKHJlbGF0aXZlID09PSAnJykgcmV0dXJuIGJhc2U7XG5cbiAgdmFyIHBhdGggPSAoYmFzZSB8fCAnLycpLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmNvbmNhdChyZWxhdGl2ZS5zcGxpdCgnLycpKVxuICAgICwgaSA9IHBhdGgubGVuZ3RoXG4gICAgLCBsYXN0ID0gcGF0aFtpIC0gMV1cbiAgICAsIHVuc2hpZnQgPSBmYWxzZVxuICAgICwgdXAgPSAwO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAocGF0aFtpXSA9PT0gJy4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHBhdGhbaV0gPT09ICcuLicpIHtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBpZiAoaSA9PT0gMCkgdW5zaGlmdCA9IHRydWU7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgaWYgKHVuc2hpZnQpIHBhdGgudW5zaGlmdCgnJyk7XG4gIGlmIChsYXN0ID09PSAnLicgfHwgbGFzdCA9PT0gJy4uJykgcGF0aC5wdXNoKCcnKTtcblxuICByZXR1cm4gcGF0aC5qb2luKCcvJyk7XG59XG5cbi8qKlxuICogVGhlIGFjdHVhbCBVUkwgaW5zdGFuY2UuIEluc3RlYWQgb2YgcmV0dXJuaW5nIGFuIG9iamVjdCB3ZSd2ZSBvcHRlZC1pbiB0b1xuICogY3JlYXRlIGFuIGFjdHVhbCBjb25zdHJ1Y3RvciBhcyBpdCdzIG11Y2ggbW9yZSBtZW1vcnkgZWZmaWNpZW50IGFuZFxuICogZmFzdGVyIGFuZCBpdCBwbGVhc2VzIG15IE9DRC5cbiAqXG4gKiBJdCBpcyB3b3J0aCBub3RpbmcgdGhhdCB3ZSBzaG91bGQgbm90IHVzZSBgVVJMYCBhcyBjbGFzcyBuYW1lIHRvIHByZXZlbnRcbiAqIGNsYXNoZXMgd2l0aCB0aGUgZ2xvYmFsIFVSTCBpbnN0YW5jZSB0aGF0IGdvdCBpbnRyb2R1Y2VkIGluIGJyb3dzZXJzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IFtsb2NhdGlvbl0gTG9jYXRpb24gZGVmYXVsdHMgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBbcGFyc2VyXSBQYXJzZXIgZm9yIHRoZSBxdWVyeSBzdHJpbmcuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBVcmwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcikge1xuICBhZGRyZXNzID0gdHJpbUxlZnQoYWRkcmVzcyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVybCkpIHtcbiAgICByZXR1cm4gbmV3IFVybChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKTtcbiAgfVxuXG4gIHZhciByZWxhdGl2ZSwgZXh0cmFjdGVkLCBwYXJzZSwgaW5zdHJ1Y3Rpb24sIGluZGV4LCBrZXlcbiAgICAsIGluc3RydWN0aW9ucyA9IHJ1bGVzLnNsaWNlKClcbiAgICAsIHR5cGUgPSB0eXBlb2YgbG9jYXRpb25cbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIGkgPSAwO1xuXG4gIC8vXG4gIC8vIFRoZSBmb2xsb3dpbmcgaWYgc3RhdGVtZW50cyBhbGxvd3MgdGhpcyBtb2R1bGUgdHdvIGhhdmUgY29tcGF0aWJpbGl0eSB3aXRoXG4gIC8vIDIgZGlmZmVyZW50IEFQSTpcbiAgLy9cbiAgLy8gMS4gTm9kZS5qcydzIGB1cmwucGFyc2VgIGFwaSB3aGljaCBhY2NlcHRzIGEgVVJMLCBib29sZWFuIGFzIGFyZ3VtZW50c1xuICAvLyAgICB3aGVyZSB0aGUgYm9vbGVhbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcXVlcnkgc3RyaW5nIHNob3VsZCBhbHNvIGJlIHBhcnNlZC5cbiAgLy9cbiAgLy8gMi4gVGhlIGBVUkxgIGludGVyZmFjZSBvZiB0aGUgYnJvd3NlciB3aGljaCBhY2NlcHRzIGEgVVJMLCBvYmplY3QgYXNcbiAgLy8gICAgYXJndW1lbnRzLiBUaGUgc3VwcGxpZWQgb2JqZWN0IHdpbGwgYmUgdXNlZCBhcyBkZWZhdWx0IHZhbHVlcyAvIGZhbGwtYmFja1xuICAvLyAgICBmb3IgcmVsYXRpdmUgcGF0aHMuXG4gIC8vXG4gIGlmICgnb2JqZWN0JyAhPT0gdHlwZSAmJiAnc3RyaW5nJyAhPT0gdHlwZSkge1xuICAgIHBhcnNlciA9IGxvY2F0aW9uO1xuICAgIGxvY2F0aW9uID0gbnVsbDtcbiAgfVxuXG4gIGlmIChwYXJzZXIgJiYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHBhcnNlcikgcGFyc2VyID0gcXMucGFyc2U7XG5cbiAgbG9jYXRpb24gPSBsb2xjYXRpb24obG9jYXRpb24pO1xuXG4gIC8vXG4gIC8vIEV4dHJhY3QgcHJvdG9jb2wgaW5mb3JtYXRpb24gYmVmb3JlIHJ1bm5pbmcgdGhlIGluc3RydWN0aW9ucy5cbiAgLy9cbiAgZXh0cmFjdGVkID0gZXh0cmFjdFByb3RvY29sKGFkZHJlc3MgfHwgJycsIGxvY2F0aW9uKTtcbiAgcmVsYXRpdmUgPSAhZXh0cmFjdGVkLnByb3RvY29sICYmICFleHRyYWN0ZWQuc2xhc2hlcztcbiAgdXJsLnNsYXNoZXMgPSBleHRyYWN0ZWQuc2xhc2hlcyB8fCByZWxhdGl2ZSAmJiBsb2NhdGlvbi5zbGFzaGVzO1xuICB1cmwucHJvdG9jb2wgPSBleHRyYWN0ZWQucHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2wgfHwgJyc7XG4gIGFkZHJlc3MgPSBleHRyYWN0ZWQucmVzdDtcblxuICAvL1xuICAvLyBXaGVuIHRoZSBhdXRob3JpdHkgY29tcG9uZW50IGlzIGFic2VudCB0aGUgVVJMIHN0YXJ0cyB3aXRoIGEgcGF0aFxuICAvLyBjb21wb25lbnQuXG4gIC8vXG4gIGlmIChcbiAgICBleHRyYWN0ZWQucHJvdG9jb2wgPT09ICdmaWxlOicgJiYgKFxuICAgICAgZXh0cmFjdGVkLnNsYXNoZXNDb3VudCAhPT0gMiB8fCB3aW5kb3dzRHJpdmVMZXR0ZXIudGVzdChhZGRyZXNzKSkgfHxcbiAgICAoIWV4dHJhY3RlZC5zbGFzaGVzICYmXG4gICAgICAoZXh0cmFjdGVkLnByb3RvY29sIHx8XG4gICAgICAgIGV4dHJhY3RlZC5zbGFzaGVzQ291bnQgPCAyIHx8XG4gICAgICAgICFpc1NwZWNpYWwodXJsLnByb3RvY29sKSkpXG4gICkge1xuICAgIGluc3RydWN0aW9uc1szXSA9IFsvKC4qKS8sICdwYXRobmFtZSddO1xuICB9XG5cbiAgZm9yICg7IGkgPCBpbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uc1tpXTtcblxuICAgIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFkZHJlc3MgPSBpbnN0cnVjdGlvbihhZGRyZXNzLCB1cmwpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcGFyc2UgPSBpbnN0cnVjdGlvblswXTtcbiAgICBrZXkgPSBpbnN0cnVjdGlvblsxXTtcblxuICAgIGlmIChwYXJzZSAhPT0gcGFyc2UpIHtcbiAgICAgIHVybFtrZXldID0gYWRkcmVzcztcbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGFyc2UpIHtcbiAgICAgIGlmICh+KGluZGV4ID0gYWRkcmVzcy5pbmRleE9mKHBhcnNlKSkpIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgaW5zdHJ1Y3Rpb25bMl0pIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKGluZGV4ICsgaW5zdHJ1Y3Rpb25bMl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZShpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgoaW5kZXggPSBwYXJzZS5leGVjKGFkZHJlc3MpKSkge1xuICAgICAgdXJsW2tleV0gPSBpbmRleFsxXTtcbiAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4LmluZGV4KTtcbiAgICB9XG5cbiAgICB1cmxba2V5XSA9IHVybFtrZXldIHx8IChcbiAgICAgIHJlbGF0aXZlICYmIGluc3RydWN0aW9uWzNdID8gbG9jYXRpb25ba2V5XSB8fCAnJyA6ICcnXG4gICAgKTtcblxuICAgIC8vXG4gICAgLy8gSG9zdG5hbWUsIGhvc3QgYW5kIHByb3RvY29sIHNob3VsZCBiZSBsb3dlcmNhc2VkIHNvIHRoZXkgY2FuIGJlIHVzZWQgdG9cbiAgICAvLyBjcmVhdGUgYSBwcm9wZXIgYG9yaWdpbmAuXG4gICAgLy9cbiAgICBpZiAoaW5zdHJ1Y3Rpb25bNF0pIHVybFtrZXldID0gdXJsW2tleV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEFsc28gcGFyc2UgdGhlIHN1cHBsaWVkIHF1ZXJ5IHN0cmluZyBpbiB0byBhbiBvYmplY3QuIElmIHdlJ3JlIHN1cHBsaWVkXG4gIC8vIHdpdGggYSBjdXN0b20gcGFyc2VyIGFzIGZ1bmN0aW9uIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgYnVpbGQtaW5cbiAgLy8gcGFyc2VyLlxuICAvL1xuICBpZiAocGFyc2VyKSB1cmwucXVlcnkgPSBwYXJzZXIodXJsLnF1ZXJ5KTtcblxuICAvL1xuICAvLyBJZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCByZXNvbHZlIHRoZSBwYXRobmFtZSBhZ2FpbnN0IHRoZSBiYXNlIFVSTC5cbiAgLy9cbiAgaWYgKFxuICAgICAgcmVsYXRpdmVcbiAgICAmJiBsb2NhdGlvbi5zbGFzaGVzXG4gICAgJiYgdXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nXG4gICAgJiYgKHVybC5wYXRobmFtZSAhPT0gJycgfHwgbG9jYXRpb24ucGF0aG5hbWUgIT09ICcnKVxuICApIHtcbiAgICB1cmwucGF0aG5hbWUgPSByZXNvbHZlKHVybC5wYXRobmFtZSwgbG9jYXRpb24ucGF0aG5hbWUpO1xuICB9XG5cbiAgLy9cbiAgLy8gRGVmYXVsdCB0byBhIC8gZm9yIHBhdGhuYW1lIGlmIG5vbmUgZXhpc3RzLiBUaGlzIG5vcm1hbGl6ZXMgdGhlIFVSTFxuICAvLyB0byBhbHdheXMgaGF2ZSBhIC9cbiAgLy9cbiAgaWYgKHVybC5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJyAmJiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSkge1xuICAgIHVybC5wYXRobmFtZSA9ICcvJyArIHVybC5wYXRobmFtZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIHNob3VsZCBub3QgYWRkIHBvcnQgbnVtYmVycyBpZiB0aGV5IGFyZSBhbHJlYWR5IHRoZSBkZWZhdWx0IHBvcnQgbnVtYmVyXG4gIC8vIGZvciBhIGdpdmVuIHByb3RvY29sLiBBcyB0aGUgaG9zdCBhbHNvIGNvbnRhaW5zIHRoZSBwb3J0IG51bWJlciB3ZSdyZSBnb2luZ1xuICAvLyBvdmVycmlkZSBpdCB3aXRoIHRoZSBob3N0bmFtZSB3aGljaCBjb250YWlucyBubyBwb3J0IG51bWJlci5cbiAgLy9cbiAgaWYgKCFyZXF1aXJlZCh1cmwucG9ydCwgdXJsLnByb3RvY29sKSkge1xuICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgIHVybC5wb3J0ID0gJyc7XG4gIH1cblxuICAvL1xuICAvLyBQYXJzZSBkb3duIHRoZSBgYXV0aGAgZm9yIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQuXG4gIC8vXG4gIHVybC51c2VybmFtZSA9IHVybC5wYXNzd29yZCA9ICcnO1xuICBpZiAodXJsLmF1dGgpIHtcbiAgICBpbnN0cnVjdGlvbiA9IHVybC5hdXRoLnNwbGl0KCc6Jyk7XG4gICAgdXJsLnVzZXJuYW1lID0gaW5zdHJ1Y3Rpb25bMF0gfHwgJyc7XG4gICAgdXJsLnBhc3N3b3JkID0gaW5zdHJ1Y3Rpb25bMV0gfHwgJyc7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICE9PSAnZmlsZTonICYmIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmIHVybC5ob3N0XG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgLy9cbiAgLy8gVGhlIGhyZWYgaXMganVzdCB0aGUgY29tcGlsZWQgcmVzdWx0LlxuICAvL1xuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjaGFuZ2luZyBwcm9wZXJ0aWVzIGluIHRoZSBVUkwgaW5zdGFuY2UgdG9cbiAqIGluc3VyZSB0aGF0IHRoZXkgYWxsIHByb3BhZ2F0ZSBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgICAgICAgICAgUHJvcGVydHkgd2UgbmVlZCB0byBhZGp1c3QuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAgICAgICAgICBUaGUgbmV3bHkgYXNzaWduZWQgdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IGZuICBXaGVuIHNldHRpbmcgdGhlIHF1ZXJ5LCBpdCB3aWxsIGJlIHRoZSBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZCB0byBwYXJzZSB0aGUgcXVlcnkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHNldHRpbmcgdGhlIHByb3RvY29sLCBkb3VibGUgc2xhc2ggd2lsbCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCBmcm9tIHRoZSBmaW5hbCB1cmwgaWYgaXQgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIHtVUkx9IFVSTCBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHNldChwYXJ0LCB2YWx1ZSwgZm4pIHtcbiAgdmFyIHVybCA9IHRoaXM7XG5cbiAgc3dpdGNoIChwYXJ0KSB7XG4gICAgY2FzZSAncXVlcnknOlxuICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHZhbHVlID0gKGZuIHx8IHFzLnBhcnNlKSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwb3J0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoIXJlcXVpcmVkKHZhbHVlLCB1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgICAgICB1cmxbcGFydF0gPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWUgKyc6JysgdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICh1cmwucG9ydCkgdmFsdWUgKz0gJzonKyB1cmwucG9ydDtcbiAgICAgIHVybC5ob3N0ID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3QnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICgvOlxcZCskLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCc6Jyk7XG4gICAgICAgIHVybC5wb3J0ID0gdmFsdWUucG9wKCk7XG4gICAgICAgIHVybC5ob3N0bmFtZSA9IHZhbHVlLmpvaW4oJzonKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybC5ob3N0bmFtZSA9IHZhbHVlO1xuICAgICAgICB1cmwucG9ydCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3Byb3RvY29sJzpcbiAgICAgIHVybC5wcm90b2NvbCA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICB1cmwuc2xhc2hlcyA9ICFmbjtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncGF0aG5hbWUnOlxuICAgIGNhc2UgJ2hhc2gnOlxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHZhciBjaGFyID0gcGFydCA9PT0gJ3BhdGhuYW1lJyA/ICcvJyA6ICcjJztcbiAgICAgICAgdXJsW3BhcnRdID0gdmFsdWUuY2hhckF0KDApICE9PSBjaGFyID8gY2hhciArIHZhbHVlIDogdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnMgPSBydWxlc1tpXTtcblxuICAgIGlmIChpbnNbNF0pIHVybFtpbnNbMV1dID0gdXJsW2luc1sxXV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgIT09ICdmaWxlOicgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiYgdXJsLmhvc3RcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xuXG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBwcm9wZXJ0aWVzIGJhY2sgaW4gdG8gYSB2YWxpZCBhbmQgZnVsbCBVUkwgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZ2lmeSBPcHRpb25hbCBxdWVyeSBzdHJpbmdpZnkgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBDb21waWxlZCB2ZXJzaW9uIG9mIHRoZSBVUkwuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHN0cmluZ2lmeSkge1xuICBpZiAoIXN0cmluZ2lmeSB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3RyaW5naWZ5KSBzdHJpbmdpZnkgPSBxcy5zdHJpbmdpZnk7XG5cbiAgdmFyIHF1ZXJ5XG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBwcm90b2NvbCA9IHVybC5wcm90b2NvbDtcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuY2hhckF0KHByb3RvY29sLmxlbmd0aCAtIDEpICE9PSAnOicpIHByb3RvY29sICs9ICc6JztcblxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAodXJsLnNsYXNoZXMgfHwgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyAnLy8nIDogJycpO1xuXG4gIGlmICh1cmwudXNlcm5hbWUpIHtcbiAgICByZXN1bHQgKz0gdXJsLnVzZXJuYW1lO1xuICAgIGlmICh1cmwucGFzc3dvcmQpIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9XG5cbiAgcmVzdWx0ICs9IHVybC5ob3N0ICsgdXJsLnBhdGhuYW1lO1xuXG4gIHF1ZXJ5ID0gJ29iamVjdCcgPT09IHR5cGVvZiB1cmwucXVlcnkgPyBzdHJpbmdpZnkodXJsLnF1ZXJ5KSA6IHVybC5xdWVyeTtcbiAgaWYgKHF1ZXJ5KSByZXN1bHQgKz0gJz8nICE9PSBxdWVyeS5jaGFyQXQoMCkgPyAnPycrIHF1ZXJ5IDogcXVlcnk7XG5cbiAgaWYgKHVybC5oYXNoKSByZXN1bHQgKz0gdXJsLmhhc2g7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuVXJsLnByb3RvdHlwZSA9IHsgc2V0OiBzZXQsIHRvU3RyaW5nOiB0b1N0cmluZyB9O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBVUkwgcGFyc2VyIGFuZCBzb21lIGFkZGl0aW9uYWwgcHJvcGVydGllcyB0aGF0IG1pZ2h0IGJlIHVzZWZ1bCBmb3Jcbi8vIG90aGVycyBvciB0ZXN0aW5nLlxuLy9cblVybC5leHRyYWN0UHJvdG9jb2wgPSBleHRyYWN0UHJvdG9jb2w7XG5VcmwubG9jYXRpb24gPSBsb2xjYXRpb247XG5VcmwudHJpbUxlZnQgPSB0cmltTGVmdDtcblVybC5xcyA9IHFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVybDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcbi8qKlxuICogQ2hlY2sgaWYgdGhlIERPTSBlbGVtZW50IGBjaGlsZGAgaXMgd2l0aGluIHRoZSBnaXZlbiBgcGFyZW50YCBET00gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR8UmFuZ2V9IGNoaWxkIC0gdGhlIERPTSBlbGVtZW50IG9yIFJhbmdlIHRvIGNoZWNrIGlmIGl0J3Mgd2l0aGluIGBwYXJlbnRgXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IHBhcmVudCAgLSB0aGUgcGFyZW50IG5vZGUgdGhhdCBgY2hpbGRgIGNvdWxkIGJlIGluc2lkZSBvZlxuICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiBgY2hpbGRgIGlzIHdpdGhpbiBgcGFyZW50YC4gRmFsc2Ugb3RoZXJ3aXNlLlxuICogQHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2l0aGluIChjaGlsZCwgcGFyZW50KSB7XG4gIC8vIGRvbid0IHRocm93IGlmIGBjaGlsZGAgaXMgbnVsbFxuICBpZiAoIWNoaWxkKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gUmFuZ2Ugc3VwcG9ydFxuICBpZiAoY2hpbGQuY29tbW9uQW5jZXN0b3JDb250YWluZXIpIGNoaWxkID0gY2hpbGQuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gIGVsc2UgaWYgKGNoaWxkLmVuZENvbnRhaW5lcikgY2hpbGQgPSBjaGlsZC5lbmRDb250YWluZXI7XG5cbiAgLy8gdHJhdmVyc2UgdXAgdGhlIGBwYXJlbnROb2RlYCBwcm9wZXJ0aWVzIHVudGlsIGBwYXJlbnRgIGlzIGZvdW5kXG4gIHZhciBub2RlID0gY2hpbGQ7XG4gIHdoaWxlIChub2RlID0gbm9kZS5wYXJlbnROb2RlKSB7XG4gICAgaWYgKG5vZGUgPT0gcGFyZW50KSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIvKipcbiAqIOatpOaWueazleeUqOS6juWRvOi1t+acrOWcsOWuouaIt+err++8jOWRvOi1t+Wksei0peaXtu+8jOi3s+i9rOWIsOWuouaIt+err+S4i+i9veWcsOWdgOaIluiAheS4remXtOmhtVxuICogLSDpppblhYjpnIDopoHlrqLmiLfnq6/mj5DkvpvkuIDkuKrljY/orq7lnLDlnYAgcHJvdG9jb2xcbiAqIC0g54S25ZCO6YCa6L+H5rWP6KeI5Zmo6K6/6Zeu6K+l5Zyw5Z2A5oiW6ICFIGlmcmFtZSDorr/pl67or6XljY/orq7lnLDlnYDmnaXop6blj5HlrqLmiLfnq6/nmoTmiZPlvIDliqjkvZxcbiAqIC0g5Zyo6K6+5a6a5aW955qE6LaF5pe25pe26Ze0ICh3YWl0aW5nKSDliLDovr7ml7bov5vooYzmo4Dmn6VcbiAqIC0g55Sx5LqOIElPUyDkuIvvvIzot7PovazliLAgQVBQ77yM6aG16Z2iIEpTIOS8muiiq+mYu+atouaJp+ihjFxuICogLSDmiYDku6XlpoLmnpzotoXml7bml7bpl7TlpKflpKfotoXov4fkuobpooTmnJ/ml7bpl7TojIPlm7TvvIzlj6/mlq3lrpogQVBQIOW3suiiq+aJk+W8gO+8jOatpOaXtuinpuWPkSBvblRpbWVvdXQg5Zue6LCD5LqL5Lu25Ye95pWwXG4gKiAtIOWvueS6jiBJT1PvvIzmraTml7blpoLmnpzku44gQVBQIOi/lOWbnumhtemdou+8jOWwseWPr+S7pemAmui/hyB3YWl0aW5nTGltaXQg5pe26Ze05beu5p2l5Yik5pat5piv5ZCm6KaB5omn6KGMIGZhbGxiYWNrIOWbnuiwg+S6i+S7tuWHveaVsFxuICogLSBBbmRyb2lkIOS4i++8jOi3s+i9rOWIsCBBUFDvvIzpobXpnaIgSlMg5Lya57un57ut5omn6KGMXG4gKiAtIOatpOaXtuaXoOiuuiBBUFAg5piv5ZCm5bey5omT5byA77yM6YO95Lya6Kem5Y+RIG9uRmFsbGJhY2sg5LqL5Lu25LiOIGZhbGxiYWNrIOWbnuiwg+S6i+S7tuWHveaVsFxuICogLSBmYWxsYmFjayDpu5jorqTmk43kvZzmmK/ot7PovazliLAgZmFsbGJhY2tVcmwg5a6i5oi356uv5LiL6L295Zyw5Z2A5oiW6ICF5Lit6Ze06aG15Zyw5Z2AXG4gKiAtIOi/meagt+WvueS6juayoeacieWuieijhSBBUFAg55qE56e75Yqo56uv77yM6aG16Z2i5Lya5Zyo6LaF5pe25LqL5Lu25Y+R55Sf5pe277yM55u05o6l6Lez6L2s5YiwIGZhbGxiYWNrVXJsXG4gKiBAbWV0aG9kIGNhbGxVcFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnByb3RvY29sIOWuouaIt+err0FQUOWRvOi1t+WNj+iuruWcsOWdgFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuZmFsbGJhY2tVcmwg5a6i5oi356uv5LiL6L295Zyw5Z2A5oiW6ICF5Lit6Ze06aG15Zyw5Z2AXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmFjdGlvbiDoh6rlrprkuYnlkbzotbflrqLmiLfnq6/nmoTmlrnlvI9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zdGFydFRpbWU9bmV3IERhdGUoKS5nZXRUaW1lKCldIOWRvOi1t+WuouaIt+err+eahOW8gOWni+aXtumXtChtcynvvIzku6Xml7bpl7TmlbDlgLzkvZzkuLrlj4LmlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53YWl0aW5nPTgwMF0g5ZG86LW36LaF5pe2562J5b6F5pe26Ze0KG1zKVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndhaXRpbmdMaW1pdD01MF0g6LaF5pe25ZCO5qOA5p+l5Zue6LCD5piv5ZCm5Zyo5q2k5pe26Ze06ZmQ5Yi25YaF6Kem5Y+RKG1zKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZmFsbGJhY2s9ZnVuY3Rpb24gKCkgeyB3aW5kb3cubG9jYXRpb24gPSBmYWxsYmFja1VybDsgfV0g6buY6K6k5Zue6YCA5pON5L2cXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkZhbGxiYWNrPW51bGxdIOWRvOi1t+aTjeS9nOacquiDveaIkOWKn+aJp+ihjOaXtuinpuWPkeeahOWbnuiwg+S6i+S7tuWHveaVsFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25UaW1lb3V0PW51bGxdIOWRvOi1t+i2heaXtuinpuWPkeeahOWbnuiwg+S6i+S7tuWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkY2FsbFVwID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2FwcC9jYWxsVXAnKTtcbiAqICRjYWxsVXAoe1xuICogICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gKiAgIHdhaXRpbmc6IDgwMCxcbiAqICAgd2FpdGluZ0xpbWl0OiA1MCxcbiAqICAgcHJvdG9jb2wgOiBzY2hlbWUsXG4gKiAgIGZhbGxiYWNrVXJsIDogZG93bmxvYWQsXG4gKiAgIG9uRmFsbGJhY2sgOiBmdW5jdGlvbiAoKSB7XG4gKiAgICAgLy8gc2hvdWxkIGRvd25sb2FkXG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICRicm93c2VyID0gcmVxdWlyZSgnLi4vZW52L2Jyb3dzZXInKTtcblxuZnVuY3Rpb24gY2FsbFVwIChvcHRpb25zKSB7XG5cdHZhciBjb25mID0gJGFzc2lnbih7XG5cdFx0cHJvdG9jb2w6ICcnLFxuXHRcdGZhbGxiYWNrVXJsOiAnJyxcblx0XHRhY3Rpb246IG51bGwsXG5cdFx0c3RhcnRUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcblx0XHR3YWl0aW5nOiA4MDAsXG5cdFx0d2FpdGluZ0xpbWl0OiA1MCxcblx0XHRmYWxsYmFjazogZnVuY3Rpb24oZmFsbGJhY2tVcmwpIHtcblx0XHRcdC8vIOWcqOS4gOWumuaXtumXtOWGheaXoOazleWUpOi1t+WuouaIt+err++8jOi3s+i9rOS4i+i9veWcsOWdgOaIluWIsOS4remXtOmhtVxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gZmFsbGJhY2tVcmw7XG5cdFx0fSxcblx0XHRvbkZhbGxiYWNrOiBudWxsLFxuXHRcdG9uVGltZW91dDogbnVsbFxuXHR9LCBvcHRpb25zKTtcblxuXHR2YXIgd0lkO1xuXHR2YXIgaWZyYW1lO1xuXG5cdGlmICh0eXBlb2YgY29uZi5hY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRjb25mLmFjdGlvbigpO1xuXHR9IGVsc2UgaWYgKCRicm93c2VyKCkuY2hyb21lKSB7XG5cdFx0Ly8gY2hyb21l5LiLaWZyYW1l5peg5rOV5ZSk6LW3QW5kcm9pZOWuouaIt+err++8jOi/memHjOS9v+eUqHdpbmRvdy5vcGVuXG5cdFx0Ly8g5Y+m5LiA5Liq5pa55qGI5Y+C6ICDIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2Nocm9tZS9tb2JpbGUvZG9jcy9pbnRlbnRzXG5cdFx0dmFyIHdpbiA9IHdpbmRvdy5vcGVuKGNvbmYucHJvdG9jb2wpO1xuXHRcdHdJZCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHR5cGVvZiB3aW4gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwod0lkKTtcblx0XHRcdFx0d2luLmNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0fSwgMTApO1xuXHR9IGVsc2Uge1xuXHRcdC8vIOWIm+W7umlmcmFtZVxuXHRcdGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXHRcdGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdGlmcmFtZS5zcmMgPSBjb25mLnByb3RvY29sO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblx0fVxuXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHdJZCkge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh3SWQpO1xuXHRcdH1cblxuXHRcdGlmIChpZnJhbWUpIHtcblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGNvbmYub25UaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjb25mLm9uVGltZW91dCgpO1xuXHRcdH1cblxuXHRcdC8vIGlvc+S4i++8jOi3s+i9rOWIsEFQUO+8jOmhtemdokpT5Lya6KKr6Zi75q2i5omn6KGM44CCXG5cdFx0Ly8g5Zug5q2k5aaC5p6c6LaF5pe25pe26Ze05aSn5aSn6LaF6L+H5LqG6aKE5pyf5pe26Ze06IyD5Zu077yM5Y+v5pat5a6aQVBQ5bey6KKr5omT5byA44CCXG5cdFx0aWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gY29uZi5zdGFydFRpbWUgPCBjb25mLndhaXRpbmcgKyBjb25mLndhaXRpbmdMaW1pdCkge1xuXHRcdFx0aWYgKHR5cGVvZiBjb25mLm9uRmFsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y29uZi5vbkZhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGNvbmYuZmFsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y29uZi5mYWxsYmFjayhjb25mLmZhbGxiYWNrVXJsKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIGNvbmYud2FpdGluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FsbFVwO1xuIiwiLyoqXG4gKiAjIOWkhOeQhuS4juWuouaIt+err+ebuOWFs+eahOS6pOS6klxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvYXBwXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9hcHBcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuYXBwLmNhbGxVcCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9hcHBcbiAqIHZhciAkYXBwID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2FwcCcpO1xuICogY29uc29sZS5pbmZvKCRhcHAuY2FsbFVwKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkY2FsbFVwID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2FwcC9jYWxsVXAnKTtcbiAqL1xuXG5leHBvcnRzLmNhbGxVcCA9IHJlcXVpcmUoJy4vY2FsbFVwJyk7XG4iLCIvKipcbiAqIOehruiupOWvueixoeaYr+WQpuWcqOaVsOe7hOS4rVxuICogQG1ldGhvZCBjb250YWluc1xuICogQHBhcmFtIHtBcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHBhcmFtIHsqfSBpdGVtIOimgeaQnOe0oueahOWvueixoVxuICogQHJldHVybnMge0Jvb2xlYW59IOWmguaenOWvueixoeWcqOaVsOe7hOS4re+8jOi/lOWbniB0cnVlXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb250YWlucyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvJGNvbnRhaW5zJyk7XG4gKiBjb25zb2xlLmluZm8oJGNvbnRhaW5zKFsxLDIsMyw0LDVdLCAzKSk7XHQvLyB0cnVlXG4gKi9cblxuZnVuY3Rpb24gY29udGFpbnMgKGFyciwgaXRlbSkge1xuXHR2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcblx0cmV0dXJuIGluZGV4ID49IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7XG4iLCIvKipcbiAqIOWIoOmZpOaVsOe7hOS4reeahOWvueixoVxuICogQG1ldGhvZCBlcmFzZVxuICogQHBhcmFtIHtBcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHBhcmFtIHsqfSBpdGVtIOimgea4hemZpOeahOWvueixoVxuICogQHJldHVybnMge051bWJlcn0g5a+56LGh5Y6f5pys5omA5Zyo5L2N572uXG4gKiBAZXhhbXBsZVxuICogdmFyICRlcmFzZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZXJhc2UnKTtcbiAqIGNvbnNvbGUuaW5mbygkZXJhc2UoWzEsMiwzLDQsNV0sMykpO1x0Ly8gWzEsMiw0LDVdXG4gKi9cblxuZnVuY3Rpb24gZXJhc2UgKGFyciwgaXRlbSkge1xuXHR2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcblx0aWYgKGluZGV4ID49IDApIHtcblx0XHRhcnIuc3BsaWNlKGluZGV4LCAxKTtcblx0fVxuXHRyZXR1cm4gaW5kZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXJhc2U7XG4iLCIvKipcbiAqIOafpeaJvuespuWQiOadoeS7tueahOWFg+e0oOWcqOaVsOe7hOS4reeahOS9jee9rlxuICogQG1ldGhvZCBmaW5kXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDmnaHku7blh73mlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0g5Ye95pWw55qEdGhpc+aMh+WQkVxuICogQHJldHVybiB7QXJyYXl9IOespuWQiOadoeS7tueahOWFg+e0oOWcqOaVsOe7hOS4reeahOS9jee9rlxuICogQGV4YW1wbGVcbiAqIHZhciAkZmluZCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZmluZCcpO1xuICogY29uc29sZS5pbmZvKCRmaW5kKFsxLDIsMyw0LDVdLCBmdW5jdGlvbiAoaXRlbSkge1xuICogICByZXR1cm4gaXRlbSA8IDM7XG4gKiB9KTsgLy8gWzAsIDFdXG4gKi9cblxuZnVuY3Rpb24gZmluZEluQXJyIChhcnIsIGZuLCBjb250ZXh0KSB7XG5cdHZhciBwb3NpdGlvbnMgPSBbXTtcblx0YXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG5cdFx0aWYgKGZuLmNhbGwoY29udGV4dCwgaXRlbSwgaW5kZXgsIGFycikpIHtcblx0XHRcdHBvc2l0aW9ucy5wdXNoKGluZGV4KTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gcG9zaXRpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbkFycjtcbiIsIi8qKlxuICog5pWw57uE5omB5bmz5YyWXG4gKiBAbWV0aG9kIGZsYXR0ZW5cbiAqIEBwYXJhbSB7YXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEByZXR1cm5zIHthcnJheX0g57uP6L+H5omB5bmz5YyW5aSE55CG55qE5pWw57uEXG4gKiBAZXhhbXBsZVxuICogdmFyICRmbGF0dGVuID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuJyk7XG4gKiBjb25zb2xlLmluZm8oJGZsYXR0ZW4oWzEsIFsyLDNdLCBbNCw1XV0pKTsgLy8gWzEsMiwzLDQsNV1cbiAqL1xuXG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xuXG5mdW5jdGlvbiBmbGF0dGVuIChhcnIpIHtcblx0dmFyIGFycmF5ID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdHZhciB0eXBlID0gJHR5cGUoYXJyW2ldKTtcblx0XHRpZiAodHlwZSA9PT0gJ251bGwnKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0YXJyYXkgPSBhcnJheS5jb25jYXQoXG5cdFx0XHR0eXBlID09PSAnYXJyYXknID8gZmxhdHRlbihhcnJbaV0pIDogYXJyW2ldXG5cdFx0KTtcblx0fVxuXHRyZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlbjtcbiIsIi8qKlxuICog56Gu6K6k5a+56LGh5piv5ZCm5Zyo5pWw57uE5Lit77yM5LiN5a2Y5Zyo5YiZ5bCG5a+56LGh5o+S5YWl5Yiw5pWw57uE5LitXG4gKiBAbWV0aG9kIGluY2x1ZGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7Kn0gaXRlbSDopoHmj5LlhaXnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtBcnJheX0g57uP6L+H5aSE55CG55qE5rqQ5pWw57uEXG4gKiBAZXhhbXBsZVxuICogdmFyICRpbmNsdWRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9pbmNsdWRlJyk7XG4gKiBjb25zb2xlLmluZm8oJGluY2x1ZGUoWzEsMiwzXSw0KSk7XHQvLyBbMSwyLDMsNF1cbiAqIGNvbnNvbGUuaW5mbygkaW5jbHVkZShbMSwyLDNdLDMpKTtcdC8vIFsxLDIsM11cbiAqL1xuXG52YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuXG5mdW5jdGlvbiBpbmNsdWRlIChhcnIsIGl0ZW0pIHtcblx0aWYgKCEkY29udGFpbnMoYXJyLCBpdGVtKSkge1xuXHRcdGFyci5wdXNoKGl0ZW0pO1xuXHR9XG5cdHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5jbHVkZTtcbiIsIi8qKlxuICogIyDnsbvmlbDnu4Tlr7nosaHnm7jlhbPlt6Xlhbflh73mlbBcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL2FyclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvYXJyXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmFyci5jb250YWlucyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9hcnJcbiAqIHZhciAkYXJyID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2FycicpO1xuICogY29uc29sZS5pbmZvKCRhcnIuY29udGFpbnMpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRjb250YWlucyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMnKTtcbiAqL1xuXG5leHBvcnRzLmNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuZXhwb3J0cy5lcmFzZSA9IHJlcXVpcmUoJy4vZXJhc2UnKTtcbmV4cG9ydHMuZmluZCA9IHJlcXVpcmUoJy4vZmluZCcpO1xuZXhwb3J0cy5mbGF0dGVuID0gcmVxdWlyZSgnLi9mbGF0dGVuJyk7XG5leHBvcnRzLmluY2x1ZGUgPSByZXF1aXJlKCcuL2luY2x1ZGUnKTtcbiIsIi8qKlxuICog5o+Q5L6b5a+5IGNvb2tpZSDnmoTor7vlhpnog73liptcbiAqIC0g5YaZ5YWl5pe26Ieq5Yqo55SoIGVuY29kZVVSSUNvbXBvbmVudCDnvJbnoIFcbiAqIC0g6K+75Y+W5pe26Ieq5Yqo55SoIGRlY29kZVVSSUNvbXBvbmVudCDop6PnoIFcbiAqIEBtb2R1bGUgY29va2llXG4gKiBAc2VlIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2pzLWNvb2tpZVxuICogQGV4YW1wbGVcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9jb29raWUnKTtcbiAqICRjb29raWUuc2V0KCduYW1lJywgJ+S4reaWhycsIHtcbiAqICAgZXhwaXJlczogMVxuICogfSk7XG4gKiAkY29va2llLnJlYWQoJ25hbWUnKSAvLyAn5Lit5paHJ1xuICovXG5cbnZhciBDb29raWUgPSByZXF1aXJlKCdqcy1jb29raWUnKTtcblxudmFyIGluc3RhbmNlID0gQ29va2llLndpdGhDb252ZXJ0ZXIoe1xuXHRyZWFkOiBmdW5jdGlvbih2YWwpIHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cdH0sXG5cdHdyaXRlOiBmdW5jdGlvbih2YWwpIHtcblx0XHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluc3RhbmNlO1xuIiwiLyoqXG4gKiAjIOacrOWcsOWtmOWCqOebuOWFs+W3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvY29va2llXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9jb29raWVcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuY29va2llLmNvb2tpZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9jb29raWVcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZScpO1xuICogY29uc29sZS5pbmZvKCRjb29raWUuY29va2llKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrlt6Xlhbflr7nosaFcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9jb29raWUnKTtcbiAqL1xuXG5leHBvcnRzLmNvb2tpZSA9IHJlcXVpcmUoJy4vY29va2llJyk7XG5leHBvcnRzLm9yaWdpbiA9IHJlcXVpcmUoJy4vb3JpZ2luJyk7XG4iLCIvKipcbiAqIOaPkOS+m+WvuSBjb29raWUg55qE6K+75YaZ6IO95YqbXG4gKiAtIOatpOaooeWdl+ebtOaOpeaPkOS+myBqcy1jb29raWUg55qE5Y6f55Sf6IO95Yqb77yM5LiN5YGa5Lu75L2V6Ieq5Yqo57yW6Kej56CBXG4gKiBAbW9kdWxlIG9yaWdpblxuICogQHNlZSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9qcy1jb29raWVcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvb2tpZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvb3JpZ2luJyk7XG4gKiAkY29va2llLnNldCgnbmFtZScsICd2YWx1ZScsIHtcbiAqICAgZXhwaXJlczogMVxuICogfSk7XG4gKiAkY29va2llLnJlYWQoJ25hbWUnKSAvLyAndmFsdWUnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnanMtY29va2llJyk7XG4iLCIvKipcbiAqIOaXpeacn+WvueixoeagvOW8j+WMlui+k+WHulxuICpcbiAqIOagvOW8j+WMluaXpeacn+Wvueixoeaooeadv+mUruWAvOivtOaYjlxuICogLSB5ZWFyIOW5tOS7veWOn+Wni+aVsOWAvFxuICogLSBtb250aCDmnIjku73ljp/lp4vmlbDlgLxbMSwgMTJdXG4gKiAtIGRhdGUg5pel5pyf5Y6f5aeL5pWw5YC8WzEsIDMxXVxuICogLSBkYXkg5pif5pyf5Y6f5aeL5pWw5YC8WzAsIDZdXG4gKiAtIGhvdXJzIOWwj+aXtuWOn+Wni+aVsOWAvFswLCAyM11cbiAqIC0gbWluaXV0ZXMg5YiG6ZKf5Y6f5aeL5pWw5YC8WzAsIDU5XVxuICogLSBzZWNvbmRzIOenkuWOn+Wni+aVsOWAvFswLCA1OV1cbiAqIC0gbWlsbGlTZWNvbmRzIOavq+enkuWOn+Wni+aVsOWAvFswLCA5OTldXG4gKiAtIFlZWVkg5bm05Lu95pWw5YC877yM57K+56Gu5YiwNOS9jSgxMiA9PiAnMDAxMicpXG4gKiAtIFlZIOW5tOS7veaVsOWAvO+8jOeyvuehruWIsDLkvY0oMjAxOCA9PiAnMTgnKVxuICogLSBZIOW5tOS7veWOn+Wni+aVsOWAvFxuICogLSBNTSDmnIjku73mlbDlgLzvvIznsr7noa7liLAy5L2NKDkgPT4gJzA5JylcbiAqIC0gTSDmnIjku73ljp/lp4vmlbDlgLxcbiAqIC0gREQg5pel5pyf5pWw5YC877yM57K+56Gu5YiwMuS9jSgzID0+ICcwMycpXG4gKiAtIEQg5pel5pyf5Y6f5aeL5pWw5YC8XG4gKiAtIGQg5pif5pyf5pWw5YC877yM6YCa6L+HIHdlZWtkYXkg5Y+C5pWw5pig5bCE5Y+W5b6XKDAgPT4gJ+aXpScpXG4gKiAtIGhoIOWwj+aXtuaVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBoIOWwj+aXtuWOn+Wni+aVsOWAvFxuICogLSBtbSDliIbpkp/mlbDlgLzvvIznsr7noa7liLAy5L2NKDkgPT4gJzA5JylcbiAqIC0gbSDliIbpkp/ljp/lp4vmlbDlgLxcbiAqIC0gc3Mg56eS5pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIHMg56eS5Y6f5aeL5pWw5YC8XG4gKiAtIG1zcyDmr6vnp5LmlbDlgLzvvIznsr7noa7liLAz5L2NKDkgPT4gJzAwOScpXG4gKiAtIG1zIOavq+enkuWOn+Wni+aVsOWAvFxuICogQG1ldGhvZCBmb3JtYXRcbiAqIEBwYXJhbSB7RGF0ZX0gZG9iaiDml6XmnJ/lr7nosaHvvIzmiJbogIXlj6/ku6XooqvovazmjaLkuLrml6XmnJ/lr7nosaHnmoTmlbDmja5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3BlY10g5qC85byP5YyW6YCJ6aG5XG4gKiBAcGFyYW0ge0FycmF5fSBbc3BlYy53ZWVrZGF5PSfml6XkuIDkuozkuInlm5vkupTlha0nLnNwbGl0KCcnKV0g5LiA5ZGo5YaF5ZCE5aSp5a+55bqU5ZCN56ew77yM6aG65bqP5LuO5ZGo5pel566X6LW3XG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMudGVtcGxhdGU9J3t7WVlZWX19LXt7TU19fS17e0REfX0ge3toaH19Ont7bW19fSddIOagvOW8j+WMluaooeadv1xuICogQHJldHVybiB7U3RyaW5nfSDmoLzlvI/ljJblrozmiJDnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZvcm1hdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2Zvcm1hdCcpO1xuICogY29uc29sZS5pbmZvKFxuICogICAkZm9ybWF0KG5ldyBEYXRlKCkse1xuICogICAgIHRlbXBsYXRlIDogJ3t7WVlZWX195bm0e3tNTX195pyIe3tERH195pelIOWRqHt7ZH19IHt7aGh9feaXtnt7bW19feWIhnt7c3N9feenkidcbiAqICAgfSlcbiAqICk7XG4gKiAvLyAyMDE15bm0MDnmnIgwOeaXpSDlkajkuIkgMTTml7YxOeWIhjQy56eSXG4gKi9cblxudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHN1YnN0aXR1dGUgPSByZXF1aXJlKCcuLi9zdHIvc3Vic3RpdHV0ZScpO1xudmFyICRmaXhUbyA9IHJlcXVpcmUoJy4uL251bS9maXhUbycpO1xudmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnLi9nZXRVVENEYXRlJyk7XG5cbnZhciByTGltaXQgPSBmdW5jdGlvbihudW0sIHcpIHtcblx0dmFyIHN0ciA9ICRmaXhUbyhudW0sIHcpO1xuXHR2YXIgZGVsdGEgPSBzdHIubGVuZ3RoIC0gdztcblx0cmV0dXJuIGRlbHRhID4gMCA/IHN0ci5zdWJzdHIoZGVsdGEpIDogc3RyO1xufTtcblxuZnVuY3Rpb24gZm9ybWF0KGRvYmosIHNwZWMpIHtcblx0dmFyIG91dHB1dCA9ICcnO1xuXHR2YXIgZGF0YSA9IHt9O1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oXG5cdFx0e1xuXHRcdFx0d2Vla2RheTogJ+aXpeS4gOS6jOS4ieWbm+S6lOWFrScuc3BsaXQoJycpLFxuXHRcdFx0dGVtcGxhdGU6ICd7e1lZWVl9fS17e01NfX0te3tERH19IHt7aGh9fTp7e21tfX0nXG5cdFx0fSxcblx0XHRzcGVjXG5cdCk7XG5cblx0Ly8g6Kej5Yaz5LiN5ZCM5pyN5Yqh5Zmo5pe25Yy65LiN5LiA6Ie05Y+v6IO95Lya5a+86Ie05pel5pyf5Yid5aeL5YyW5pe26Ze05LiN5LiA6Ie055qE6Zeu6aKYXG5cdC8vIOS8oOWFpeaVsOWtl+S7peWMl+S6rOaXtuWMuuaXtumXtOS4uuWHhlxuXHR2YXIgdXRjRGF0ZSA9ICRnZXRVVENEYXRlKGRvYmopO1xuXHRkYXRhLnllYXIgPSB1dGNEYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG5cdGRhdGEubW9udGggPSB1dGNEYXRlLmdldFVUQ01vbnRoKCkgKyAxO1xuXHRkYXRhLmRhdGUgPSB1dGNEYXRlLmdldFVUQ0RhdGUoKTtcblx0ZGF0YS5kYXkgPSB1dGNEYXRlLmdldFVUQ0RheSgpO1xuXHRkYXRhLmhvdXJzID0gdXRjRGF0ZS5nZXRVVENIb3VycygpO1xuXHRkYXRhLm1pbml1dGVzID0gdXRjRGF0ZS5nZXRVVENNaW51dGVzKCk7XG5cdGRhdGEuc2Vjb25kcyA9IHV0Y0RhdGUuZ2V0VVRDU2Vjb25kcygpO1xuXHRkYXRhLm1pbGxpU2Vjb25kcyA9IHV0Y0RhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG5cblx0ZGF0YS5ZWVlZID0gckxpbWl0KGRhdGEueWVhciwgNCk7XG5cdGRhdGEuWVkgPSByTGltaXQoZGF0YS55ZWFyLCAyKTtcblx0ZGF0YS5ZID0gZGF0YS55ZWFyO1xuXG5cdGRhdGEuTU0gPSAkZml4VG8oZGF0YS5tb250aCwgMik7XG5cdGRhdGEuTSA9IGRhdGEubW9udGg7XG5cblx0ZGF0YS5ERCA9ICRmaXhUbyhkYXRhLmRhdGUsIDIpO1xuXHRkYXRhLkQgPSBkYXRhLmRhdGU7XG5cblx0ZGF0YS5kID0gY29uZi53ZWVrZGF5W2RhdGEuZGF5XTtcblxuXHRkYXRhLmhoID0gJGZpeFRvKGRhdGEuaG91cnMsIDIpO1xuXHRkYXRhLmggPSBkYXRhLmhvdXJzO1xuXG5cdGRhdGEubW0gPSAkZml4VG8oZGF0YS5taW5pdXRlcywgMik7XG5cdGRhdGEubSA9IGRhdGEubWluaXV0ZXM7XG5cblx0ZGF0YS5zcyA9ICRmaXhUbyhkYXRhLnNlY29uZHMsIDIpO1xuXHRkYXRhLnMgPSBkYXRhLnNlY29uZHM7XG5cblx0ZGF0YS5tc3MgPSAkZml4VG8oZGF0YS5taWxsaVNlY29uZHMsIDMpO1xuXHRkYXRhLm1zID0gZGF0YS5taWxsaVNlY29uZHM7XG5cblx0b3V0cHV0ID0gJHN1YnN0aXR1dGUoY29uZi50ZW1wbGF0ZSwgZGF0YSk7XG5cdHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0O1xuIiwiLyoqXG4gKiDojrflj5bov4fljrvkuIDmrrXml7bpl7TnmoTotbflp4vml6XmnJ/vvIzlpoIz5pyI5YmN56ysMeWkqe+8jDLlkajliY3nrKwx5aSp77yMM+Wwj+aXtuWJjeaVtOeCuVxuICogQG1ldGhvZCBnZXRMYXN0U3RhcnRcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSDljZXkvY3ml7bpl7TnsbvlnovvvIzlj6/pgIkgWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInXVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IOWkmuWwkeWNleS9jeaXtumXtOS5i+WJjVxuICogQHJldHVybnMge0RhdGV9IOacgOi/keWNleS9jeaXtumXtOeahOi1t+Wni+aXtumXtOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0TGFzdFN0YXJ0ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0TGFzdFN0YXJ0Jyk7XG4gKiB2YXIgdGltZSA9ICRnZXRMYXN0U3RhcnQoXG4gKiAgIG5ldyBEYXRlKCcyMDE4LTEwLTI1JyksXG4gKiAgICdtb250aCcsXG4gKiAgIDBcbiAqICkuZ2V0VGltZSgpOyAvLyAxNTM4MzIzMjAwMDAwXG4gKiBuZXcgRGF0ZSh0aW1lKTsgLy8gTW9uIE9jdCAwMSAyMDE4IDAwOjAwOjAwIEdNVCswODAwICjkuK3lm73moIflh4bml7bpl7QpXG4gKi9cblxudmFyICRnZXRUaW1lU3BsaXQgPSByZXF1aXJlKCcuL2dldFRpbWVTcGxpdCcpO1xudmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnLi9nZXRVVENEYXRlJyk7XG5cbnZhciBIT1VSID0gNjAgKiA2MCAqIDEwMDA7XG52YXIgREFZID0gMjQgKiA2MCAqIDYwICogMTAwMDtcblxuZnVuY3Rpb24gZ2V0TGFzdFN0YXJ0KHRpbWUsIHR5cGUsIGNvdW50KSB7XG5cdHZhciBsb2NhbFRpbWUgPSBuZXcgRGF0ZSh0aW1lKTtcblx0dmFyIHV0Y1RpbWUgPSAkZ2V0VVRDRGF0ZSh0aW1lKTtcblx0dmFyIHN0YW1wID0gdXRjVGltZTtcblx0dmFyIHllYXI7XG5cdHZhciBtb250aDtcblx0dmFyIGFsbE1vbnRocztcblx0dmFyIHVuaXQ7XG5cdGlmICghdHlwZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcigncmVxdWlyZWQgcGFyYW0gdHlwZScpO1xuXHR9XG5cdGNvdW50ID0gY291bnQgfHwgMDtcblx0aWYgKHR5cGUgPT09ICd5ZWFyJykge1xuXHRcdHllYXIgPSB1dGNUaW1lLmdldFVUQ0Z1bGxZZWFyKCk7XG5cdFx0eWVhciAtPSBjb3VudDtcblx0XHRzdGFtcCA9IG5ldyBEYXRlKHllYXIgKyAnLzEvMScpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtb250aCcpIHtcblx0XHR5ZWFyID0gdXRjVGltZS5nZXRVVENGdWxsWWVhcigpO1xuXHRcdG1vbnRoID0gdXRjVGltZS5nZXRVVENNb250aCgpO1xuXHRcdGFsbE1vbnRocyA9IHllYXIgKiAxMiArIG1vbnRoIC0gY291bnQ7XG5cdFx0eWVhciA9IE1hdGguZmxvb3IoYWxsTW9udGhzIC8gMTIpO1xuXHRcdG1vbnRoID0gYWxsTW9udGhzIC0geWVhciAqIDEyO1xuXHRcdG1vbnRoICs9IDE7XG5cdFx0c3RhbXAgPSBuZXcgRGF0ZShbeWVhciwgbW9udGgsIDFdLmpvaW4oJy8nKSk7XG5cdH0gZWxzZSB7XG5cdFx0dW5pdCA9IEhPVVI7XG5cdFx0aWYgKHR5cGUgPT09ICdkYXknKSB7XG5cdFx0XHR1bml0ID0gREFZO1xuXHRcdH1cblx0XHRpZiAodHlwZSA9PT0gJ3dlZWsnKSB7XG5cdFx0XHR1bml0ID0gNyAqIERBWTtcblx0XHR9XG5cdFx0dmFyIG5ld0xvY2FsVGltZSA9IGxvY2FsVGltZSAtIGNvdW50ICogdW5pdDtcblx0XHRzdGFtcCA9ICRnZXRUaW1lU3BsaXQobmV3TG9jYWxUaW1lLCB0eXBlKTtcblx0fVxuXG5cdHJldHVybiBzdGFtcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMYXN0U3RhcnQ7XG4iLCIvKipcbiAqIOiOt+WPluafkOS4quaXtumXtOeahCDmlbTlubR85pW05pyIfOaVtOaXpXzmlbTml7Z85pW05YiGIOaXtumXtOWvueixoVxuICogQG1ldGhvZCBnZXRUaW1lU3BsaXRcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSDljZXkvY3ml7bpl7TnsbvlnovvvIzlj6/pgIkgWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInXVxuICogQHJldHVybnMge0RhdGV9IOaXtumXtOaVtOeCueWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VGltZVNwbGl0Jyk7XG4gKiBuZXcgRGF0ZShcbiAqIFx0JGdldFRpbWVTcGxpdChcbiAqIFx0XHQnMjAxOC0wOS0yMCcsXG4gKiBcdFx0J21vbnRoJ1xuICogXHQpXG4gKiApLnRvR01UU3RyaW5nKCk7XG4gKiAvLyBTYXQgU2VwIDAxIDIwMTggMDA6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqXG4gKiBuZXcgRGF0ZShcbiAqIFx0JGdldFRpbWVTcGxpdChcbiAqIFx0XHQnMjAxOC0wOS0yMCAxOToyMzozNicsXG4gKiBcdFx0J2hvdXInXG4gKiBcdClcbiAqICkudG9HTVRTdHJpbmcoKTtcbiAqIC8vIFRodSBTZXAgMjAgMjAxOCAxOTowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICovXG52YXIgJGdldFVUQ0RhdGUgPSByZXF1aXJlKCcuL2dldFVUQ0RhdGUnKTtcblxudmFyIERBWSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbnZhciBUSU1FX1VOSVRTID0gW1xuXHQnaG91cicsXG5cdCdkYXknLFxuXHQnd2VlaycsXG5cdCdtb250aCcsXG5cdCd5ZWFyJ1xuXTtcblxuZnVuY3Rpb24gZ2V0VGltZVNwbGl0KHRpbWUsIHR5cGUpIHtcblx0aWYgKCF0eXBlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdyZXF1aXJlZCBwYXJhbSB0eXBlJyk7XG5cdH1cblxuXHR2YXIgbG9jYWxUaW1lID0gbmV3IERhdGUodGltZSk7XG5cdHZhciB1dGNUaW1lID0gJGdldFVUQ0RhdGUodGltZSk7XG5cblx0Ly8g5Lul5ZGo5LiA5Li66LW35aeL5pe26Ze0XG5cdHZhciBkYXkgPSB1dGNUaW1lLmdldERheSgpO1xuXHRkYXkgPSBkYXkgPT09IDAgPyA2IDogZGF5IC0gMTtcblxuXHR2YXIgaW5kZXggPSBUSU1FX1VOSVRTLmluZGV4T2YodHlwZSk7XG5cdGlmIChpbmRleCA9PT0gMikge1xuXHRcdHV0Y1RpbWUgPSBuZXcgRGF0ZShsb2NhbFRpbWUgLSBkYXkgKiBEQVkpO1xuXHR9XG5cdHZhciB5ZWFyID0gdXRjVGltZS5nZXRVVENGdWxsWWVhcigpO1xuXHR2YXIgbW9udGggPSB1dGNUaW1lLmdldFVUQ01vbnRoKCkgKyAxO1xuXHR2YXIgZGF0ZSA9IHV0Y1RpbWUuZ2V0VVRDRGF0ZSgpO1xuXHR2YXIgaG91ciA9IHV0Y1RpbWUuZ2V0VVRDSG91cnMoKTtcblx0dmFyIG1pbnV0ZXMgPSB1dGNUaW1lLmdldFVUQ01pbnV0ZXMoKTtcblxuXHRpZiAoaW5kZXggPj0gMCkge1xuXHRcdG1pbnV0ZXMgPSAnMDAnO1xuXHR9XG5cdGlmIChpbmRleCA+PSAxKSB7XG5cdFx0aG91ciA9ICcwMCc7XG5cdH1cblx0aWYgKGluZGV4ID49IDMpIHtcblx0XHRkYXRlID0gMTtcblx0fVxuXHRpZiAoaW5kZXggPj0gNCkge1xuXHRcdG1vbnRoID0gMTtcblx0fVxuXG5cdHZhciBzdHIgPSBbXG5cdFx0W3llYXIsIG1vbnRoLCBkYXRlXS5qb2luKCcvJyksXG5cdFx0W2hvdXIsIG1pbnV0ZXNdLmpvaW4oJzonKVxuXHRdLmpvaW4oJyAnKTtcblxuXHRyZXR1cm4gbmV3IERhdGUoc3RyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUaW1lU3BsaXQ7XG4iLCIvKipcbiAqIOiOt+WPluS4gOS4quaXtumXtOWvueixoe+8jOWFtuW5tOaciOWRqOaXpeaXtuWIhuenkuetiSBVVEMg5YC85LiO5YyX5Lqs5pe26Ze05L+d5oyB5LiA6Ie044CCXG4gKiDop6PlhrPkuI3lkIzmnI3liqHlmajml7bljLrkuI3kuIDoh7TlnLrmma/kuIvvvIzlj6/og73kvJrlr7zoh7Tml6XmnJ/orqHnrpfkuI3kuIDoh7TnmoTpl67popguXG4gKiBAbWV0aG9kIGdldFVUQ0RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcmV0dXJucyB7RGF0ZX0gVVRD5pe26Ze0XG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZScpO1xuICogdmFyIGNuVGltZSA9IDE1NDA5MTUyMDAwMDA7IC8vIChXZWQgT2N0IDMxIDIwMTggMDA6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtCkpXG4gKiB2YXIgdXRjRGF0ZSA9ICRnZXRVVENEYXRlKGNuVGltZSkuZ2V0VGltZSgpO1xuICogLy8gMTU0MDg4NjQwMDAwMCBUdWUgT2N0IDMwIDIwMTggMTY6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqIHV0Y0RhdGUuZ2V0VVRDZGF0ZSgpOyAvLyAzMVxuICogdXRjRGF0ZS5nZXRIb3VycygpOyAvLyA4XG4gKiB1dGNEYXRlLmdldFVUQ0hvdXJzKCk7IC8vIDBcbiAqL1xuZnVuY3Rpb24gZ2V0VVRDRGF0ZSh0aW1lKSB7XG5cdHZhciB1dGNEYXRlID0gbmV3IERhdGUobmV3IERhdGUodGltZSkuZ2V0VGltZSgpICsgMjg4MDAwMDApO1xuXHRyZXR1cm4gdXRjRGF0ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRVVENEYXRlO1xuIiwiLyoqXG4gKiAjIOaXpeacn+ebuOWFs+W3peWFt1xuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvZGF0ZVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZGF0ZVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5kYXRlLmZvcm1hdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9kYXRlXG4gKiB2YXIgJGRhdGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZGF0ZScpO1xuICogY29uc29sZS5pbmZvKCRkYXRlLmZvcm1hdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGZvcm1hdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2Zvcm1hdCcpO1xuICovXG5cbmV4cG9ydHMuZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcbmV4cG9ydHMuZ2V0TGFzdFN0YXJ0ID0gcmVxdWlyZSgnLi9nZXRMYXN0U3RhcnQnKTtcbmV4cG9ydHMuZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnLi9nZXRUaW1lU3BsaXQnKTtcbiIsIi8qKlxuICogIyBET00g5pON5L2c55u45YWz5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9kb21cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2RvbVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5kb20uaXNOb2RlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2RvbVxuICogdmFyICRkb20gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZG9tJyk7XG4gKiBjb25zb2xlLmluZm8oJGRvbS5pc05vZGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRpc05vZGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZG9tL2lzTm9kZScpO1xuICovXG5cbmV4cG9ydHMuaXNOb2RlID0gcmVxdWlyZSgnLi9pc05vZGUnKTtcbmV4cG9ydHMub2Zmc2V0ID0gcmVxdWlyZSgnLi9vZmZzZXQnKTtcbiIsIi8qKlxuICog5Yik5pat5a+56LGh5piv5ZCm5Li6ZG9t5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDopoHliKTmlq3nmoTlr7nosaFcbiAqIEByZXR1cm4ge0Jvb2xlYW59IOaYr+WQpuS4umRvbeWFg+e0oFxuICogQGV4YW1wbGVcbiAqIHZhciAkaXNOb2RlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RvbS9pc05vZGUnKTtcbiAqICRpc05vZGUoZG9jdW1lbnQuYm9keSkgLy8gMVxuICovXG5mdW5jdGlvbiBpc05vZGUobm9kZSkge1xuXHRyZXR1cm4gKFxuXHRcdG5vZGVcblx0XHQmJiBub2RlLm5vZGVOYW1lXG5cdFx0JiYgbm9kZS5ub2RlVHlwZVxuXHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTm9kZTtcbiIsIi8qKlxuICog6I635Y+WIERPTSDlhYPntKDnm7jlr7nkuo4gZG9jdW1lbnQg55qE6L656LedXG4gKiBAbWV0aG9kIG9mZnNldFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdGltb3hsZXkvb2Zmc2V0XG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDopoHorqHnrpcgb2Zmc2V0IOeahCBkb20g5a+56LGhXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9mZnNldCDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG9mZnNldCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vb2Zmc2V0Jyk7XG4gKiB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhcmdldCcpO1xuICogY29uc29sZS5sb2coJG9mZnNldCh0YXJnZXQpKTtcbiAqIC8vIHt0b3A6IDY5LCBsZWZ0OiAxMDh9XG4gKi9cblxudmFyIG9mZnNldCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge307XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0b2Zmc2V0ID0gcmVxdWlyZSgnZG9jdW1lbnQtb2Zmc2V0Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0O1xuIiwiLyoqXG4gKiDmo4DmtYvmtY/op4jlmajnsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gcXFcbiAqIC0gdWNcbiAqIC0gYmFpZHVcbiAqIC0gbWl1aVxuICogLSB3ZWl4aW5cbiAqIC0gcXpvbmVcbiAqIC0gcXFuZXdzXG4gKiAtIHFxaG91c2VcbiAqIC0gcXFicm93c2VyXG4gKiAtIGNocm9tZVxuICogQG1ldGhvZCBicm93c2VyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBVQSDmo4Dmn6Xnu5PmnpxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGJyb3dzZXIgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L2Jyb3dzZXInKTtcbiAqIGNvbnNvbGUuaW5mbygkYnJvd3NlcigpLmNocm9tZSk7XG4gKiBjb25zb2xlLmluZm8oJGJyb3dzZXIuZGV0ZWN0KCkpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcblx0cXE6ICgvcXFcXC8oW1xcZC5dKykvaSksXG5cdHVjOiAoL3VjYnJvd3Nlci9pKSxcblx0YmFpZHU6ICgvYmFpZHVicm93c2VyL2kpLFxuXHRtaXVpOiAoL21pdWlicm93c2VyL2kpLFxuXHR3ZWl4aW46ICgvbWljcm9tZXNzZW5nZXIvaSksXG5cdHF6b25lOiAoL3F6b25lXFwvL2kpLFxuXHRxcW5ld3M6ICgvcXFuZXdzXFwvKFtcXGQuXSspL2kpLFxuXHRxcWhvdXNlOiAoL3FxaG91c2UvaSksXG5cdHFxYnJvd3NlcjogKC9xcWJyb3dzZXIvaSksXG5cdGNocm9tZTogKC9jaHJvbWUvaSlcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdHVhOiAnJ1xuXHR9LCBvcHRpb25zKTtcblxuXHQkYXNzaWduKHRlc3RlcnMsIGNoZWNrZXJzKTtcblxuXHRyZXR1cm4gJHVhTWF0Y2godGVzdGVycywgY29uZi51YSwgY29uZik7XG59XG5cbnZhciByZXN1bHQgPSBudWxsO1xuXG5mdW5jdGlvbiBlbnZCcm93c2VyKCkge1xuXHRpZiAoIXJlc3VsdCkge1xuXHRcdHJlc3VsdCA9IGRldGVjdCgpO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmVudkJyb3dzZXIuZGV0ZWN0ID0gZGV0ZWN0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVudkJyb3dzZXI7XG4iLCIvKipcbiAqIOajgOa1i+a1j+iniOWZqOaguOW/g1xuICpcbiAqIOaUr+aMgeeahOexu+Wei+ajgOa1i1xuICogLSB0cmlkZW50XG4gKiAtIHByZXN0b1xuICogLSB3ZWJraXRcbiAqIC0gZ2Vja29cbiAqIEBtZXRob2QgY29yZVxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb3JlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9jb3JlJyk7XG4gKiBjb25zb2xlLmluZm8oJGNvcmUoKS53ZWJraXQpO1xuICogY29uc29sZS5pbmZvKCRjb3JlLmRldGVjdCgpKTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcblx0dHJpZGVudDogKC90cmlkZW50L2kpLFxuXHRwcmVzdG86ICgvcHJlc3RvL2kpLFxuXHR3ZWJraXQ6ICgvd2Via2l0L2kpLFxuXHRnZWNrbzogZnVuY3Rpb24odWEpIHtcblx0XHRyZXR1cm4gdWEuaW5kZXhPZignZ2Vja28nKSA+IC0xICYmIHVhLmluZGV4T2YoJ2todG1sJykgPT09IC0xO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcblx0dmFyIGNvbmYgPSAkYXNzaWduKHtcblx0XHR1YTogJydcblx0fSwgb3B0aW9ucyk7XG5cblx0JGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cblx0cmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gY29yZSgpIHtcblx0aWYgKCFyZXN1bHQpIHtcblx0XHRyZXN1bHQgPSBkZXRlY3QoKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5jb3JlLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlO1xuIiwiLyoqXG4gKiDmo4DmtYvorr7lpIfnsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gaHVhd2VpXG4gKiAtIG9wcG9cbiAqIC0gdml2b1xuICogLSB4aWFvbWlcbiAqIC0gc2Ftc29uZ1xuICogLSBpcGhvbmVcbiAqIEBtZXRob2QgZGV2aWNlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBVQSDmo4Dmn6Xnu5PmnpxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGRldmljZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvZGV2aWNlJyk7XG4gKiBjb25zb2xlLmluZm8oJGRldmljZSgpLmh1YXdlaSk7XG4gKiBjb25zb2xlLmluZm8oJGRldmljZS5kZXRlY3QoKSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICR1YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5cbnZhciB0ZXN0ZXJzID0ge1xuXHRodWF3ZWk6ICgvaHVhd2VpL2kpLFxuXHRvcHBvOiAoL29wcG8vaSksXG5cdHZpdm86ICgvdml2by9pKSxcblx0eGlhb21pOiAoL3hpYW9taS9pKSxcblx0c2Ftc29uZzogKC9zbS0vaSksXG5cdGlwaG9uZTogKC9pcGhvbmUvaSlcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdHVhOiAnJ1xuXHR9LCBvcHRpb25zKTtcblxuXHQkYXNzaWduKHRlc3RlcnMsIGNoZWNrZXJzKTtcblxuXHRyZXR1cm4gJHVhTWF0Y2godGVzdGVycywgY29uZi51YSwgY29uZik7XG59XG5cbnZhciByZXN1bHQgPSBudWxsO1xuXG5mdW5jdGlvbiBkZXZpY2UoKSB7XG5cdGlmICghcmVzdWx0KSB7XG5cdFx0cmVzdWx0ID0gZGV0ZWN0KCk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZGV2aWNlLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBkZXZpY2U7XG4iLCIvKipcbiAqICMg546v5aKD5qOA5rWL5LiO5Yik5pat5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9lbnZcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2VudlxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5lbnYudG91Y2hhYmxlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2VudlxuICogdmFyICRlbnYgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52Jyk7XG4gKiBjb25zb2xlLmluZm8oJGVudi50b3VjaGFibGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICR0b3VjaGFibGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L3RvdWNoYWJsZScpO1xuICovXG5cbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3NlcicpO1xuZXhwb3J0cy5jb3JlID0gcmVxdWlyZSgnLi9jb3JlJyk7XG5leHBvcnRzLmRldmljZSA9IHJlcXVpcmUoJy4vZGV2aWNlJyk7XG5leHBvcnRzLm5ldHdvcmsgPSByZXF1aXJlKCcuL25ldHdvcmsnKTtcbmV4cG9ydHMub3MgPSByZXF1aXJlKCcuL29zJyk7XG5leHBvcnRzLnRvdWNoYWJsZSA9IHJlcXVpcmUoJy4vdG91Y2hhYmxlJyk7XG5leHBvcnRzLnVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcbmV4cG9ydHMud2VicCA9IHJlcXVpcmUoJy4vd2VicCcpO1xuIiwiLyoqXG4gKiDnvZHnu5znjq/looPmo4DmtYtcbiAqIEBtb2R1bGUgbmV0d29ya1xuICovXG5cbnZhciBzdXBwb3J0T25saW5lID0gbnVsbDtcblxuLyoqXG4gKiDliKTmlq3pobXpnaLmmK/lkKbmlK/mjIHogZTnvZHmo4DmtYtcbiAqIEBtZXRob2QgbmV0d29yay5zdXBwb3J0XG4gKiBAbWVtYmVyb2YgbmV0d29ya1xuICogQHJldHVybnMge0Jvb2xlYW59IOaYr+WQpuaUr+aMgeiBlOe9keajgOa1i1xuICogQGV4YW1wbGVcbiAqIHZhciAkbmV0d29yayA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvbmV0d29yaycpO1xuICogJG5ldHdvcmsuc3VwcG9ydCgpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN1cHBvcnQoKSB7XG5cdGlmIChzdXBwb3J0T25saW5lID09PSBudWxsKSB7XG5cdFx0c3VwcG9ydE9ubGluZSA9ICEhKCdvbkxpbmUnIGluIHdpbmRvdy5uYXZpZ2F0b3IpO1xuXHR9XG5cdHJldHVybiBzdXBwb3J0T25saW5lO1xufVxuXG4vKipcbiAqIOWIpOaWremhtemdouaYr+WQpuiBlOe9kVxuICogQG1ldGhvZCBuZXR3b3JrLm9uTGluZVxuICogQG1lbWJlcm9mIG5ldHdvcmtcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbogZTnvZFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG5ldHdvcmsgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L25ldHdvcmsnKTtcbiAqICRuZXR3b3JrLm9uTGluZSgpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIG9uTGluZSgpIHtcblx0cmV0dXJuIHN1cHBvcnQoKSA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lIDogdHJ1ZTtcbn1cblxuZXhwb3J0cy5zdXBwb3J0ID0gc3VwcG9ydDtcbmV4cG9ydHMub25MaW5lID0gb25MaW5lO1xuIiwiLyoqXG4gKiDmo4DmtYvmk43kvZzns7vnu5/nsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gaW9zXG4gKiAtIGFuZHJvaWRcbiAqIEBtZXRob2Qgb3NcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkb3MgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L29zJyk7XG4gKiBjb25zb2xlLmluZm8oJG9zKCkuaW9zKTtcbiAqIGNvbnNvbGUuaW5mbygkb3MuZGV0ZWN0KCkpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcblx0aW9zOiAvbGlrZSBtYWMgb3MgeC9pLFxuXHRhbmRyb2lkOiBmdW5jdGlvbih1YSkge1xuXHRcdHJldHVybiB1YS5pbmRleE9mKCdhbmRyb2lkJykgPiAtMSB8fCB1YS5pbmRleE9mKCdsaW51eCcpID4gLTE7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdHVhOiAnJ1xuXHR9LCBvcHRpb25zKTtcblxuXHQkYXNzaWduKHRlc3RlcnMsIGNoZWNrZXJzKTtcblxuXHRyZXR1cm4gJHVhTWF0Y2godGVzdGVycywgY29uZi51YSwgY29uZik7XG59XG5cbnZhciByZXN1bHQgPSBudWxsO1xuXG5mdW5jdGlvbiBvcygpIHtcblx0aWYgKCFyZXN1bHQpIHtcblx0XHRyZXN1bHQgPSBkZXRlY3QoKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5vcy5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gb3M7XG4iLCIvKipcbiAqIOWIpOaWrea1j+iniOWZqOaYr+WQpuaUr+aMgeinpuaRuOWxj1xuICogQG1ldGhvZCB0b3VjaGFibGVcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIHop6bmkbjlsY9cbiAqIEBleGFtcGxlXG4gKiB2YXIgJHRvdWNoYWJsZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlJyk7XG4gKiBpZiAoJHRvdWNoYWJsZSgpKSB7XG4gKiAgIC8vIEl0IGlzIGEgdG91Y2ggZGV2aWNlLlxuICogfVxuICovXG5cbnZhciBpc1RvdWNoYWJsZSA9IG51bGw7XG5cbmZ1bmN0aW9uIHRvdWNoYWJsZSgpIHtcblx0aWYgKGlzVG91Y2hhYmxlID09PSBudWxsKSB7XG5cdFx0aXNUb3VjaGFibGUgPSAhISgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3dcblx0XHR8fCAod2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRUb3VjaCkpO1xuXHR9XG5cdHJldHVybiBpc1RvdWNoYWJsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b3VjaGFibGU7XG4iLCIvKipcbiAqIFVB5a2X56ym5Liy5Yy56YWN5YiX6KGoXG4gKiBAbWV0aG9kIHVhTWF0Y2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0IOajgOa1iyBIYXNoIOWIl+ihqFxuICogQHBhcmFtIHtTdHJpbmd9IHVhIOeUqOS6juajgOa1i+eahCBVQSDlrZfnrKbkuLJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25mIOajgOa1i+WZqOmAiemhue+8jOS8oOmAkue7meajgOa1i+WHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdWFNYXRjaCcpO1xuICogdmFyIHJzID0gJHVhTWF0Y2goe1xuICogXHR0cmlkZW50OiAndHJpZGVudCcsXG4gKiBcdHByZXN0bzogL3ByZXN0by8sXG4gKiBcdGdlY2tvOiBmdW5jdGlvbih1YSl7XG4gKiBcdFx0cmV0dXJuIHVhLmluZGV4T2YoJ2dlY2tvJykgPiAtMSAmJiB1YS5pbmRleE9mKCdraHRtbCcpID09PSAtMTtcbiAqIFx0fVxuICogfSwgJ3h4eCBwcmVzdG8geHh4Jyk7XG4gKiBjb25zb2xlLmluZm8ocnMucHJlc3RvKTsgLy8gdHJ1ZVxuICogY29uc29sZS5pbmZvKHJzLnRyaWRlbnQpOyAvLyB1bmRlZmluZWRcbiAqL1xuXG5mdW5jdGlvbiB1YU1hdGNoKGxpc3QsIHVhLCBjb25mKSB7XG5cdHZhciByZXN1bHQgPSB7fTtcblx0aWYgKCF1YSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dWEgPSAnJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcblx0XHR9XG5cdH1cblx0dWEgPSB1YS50b0xvd2VyQ2FzZSgpO1xuXHRpZiAodHlwZW9mIGxpc3QgPT09ICdvYmplY3QnKSB7XG5cdFx0T2JqZWN0LmtleXMobGlzdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHZhciB0ZXN0ZXIgPSBsaXN0W2tleV07XG5cdFx0XHRpZiAodGVzdGVyKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgdGVzdGVyID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGlmICh1YS5pbmRleE9mKHRlc3RlcikgPiAtMSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W2tleV0gPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGVzdGVyKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gdWEubWF0Y2godGVzdGVyKTtcblx0XHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRcdGlmIChtYXRjaFsxXSkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IG1hdGNoWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0W2tleV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgdGVzdGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0aWYgKHRlc3Rlcih1YSwgY29uZikpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtrZXldID0gdGVzdGVyKHVhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdWFNYXRjaDtcbiIsInZhciBpc1N1cHBvcnRXZWJwID0gbnVsbDtcblxuLyoqXG4gKiB3ZWJwIOebuOWFs+ajgOa1i1xuICogQG1vZHVsZSB3ZWJwXG4gKi9cblxuLyoqXG4gKiDliKTmlq3mtY/op4jlmajmmK/lkKbmlK/mjIF3ZWJwXG4gKiBAbWV0aG9kIHdlYnAuc3VwcG9ydFxuICogQG1lbWJlcm9mIHdlYnBcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIF3ZWJwXG4gKiBAZXhhbXBsZVxuICogdmFyICR3ZWJwID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Vudi93ZWJwJyk7XG4gKiBjb25zb2xlLmluZm8oJHdlYnAuc3VwcG9ydCgpKTsgLy8gdHJ1ZS9mYWxzZVxuICovXG5mdW5jdGlvbiBzdXBwb3J0KCkge1xuXHR2YXIgcnMgPSAhIVtdLm1hcFxuXHRcdCYmIGRvY3VtZW50XG5cdFx0XHQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcblx0XHRcdC50b0RhdGFVUkwoJ2ltYWdlL3dlYnAnKVxuXHRcdFx0LmluZGV4T2YoJ2RhdGE6aW1hZ2Uvd2VicCcpID09PSAwO1xuXHRyZXR1cm4gcnM7XG59XG5cbmZ1bmN0aW9uIHdlYnAgKCkge1xuXHRpZiAoaXNTdXBwb3J0V2VicCA9PT0gbnVsbCkge1xuXHRcdGlzU3VwcG9ydFdlYnAgPSBzdXBwb3J0KCk7XG5cdH1cblx0cmV0dXJuIGlzU3VwcG9ydFdlYnA7XG59XG5cbndlYnAuc3VwcG9ydCA9IHN1cHBvcnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gd2VicDtcbiIsIi8qKlxuICogQSBtb2R1bGUgdGhhdCBjYW4gYmUgbWl4ZWQgaW4gdG8gKmFueSBvYmplY3QqIGluIG9yZGVyIHRvIHByb3ZpZGUgaXRcbiAqIHdpdGggY3VzdG9tIGV2ZW50cy4gWW91IG1heSBiaW5kIHdpdGggYG9uYCBvciByZW1vdmUgd2l0aCBgb2ZmYCBjYWxsYmFja1xuICogZnVuY3Rpb25zIHRvIGFuIGV2ZW50OyBgdHJpZ2dlcmAtaW5nIGFuIGV2ZW50IGZpcmVzIGFsbCBjYWxsYmFja3MgaW5cbiAqIHN1Y2Nlc3Npb24uXG4gKiAtIOS4gOS4quWPr+S7peiiq+a3t+WQiOWIsOS7u+S9leWvueixoeeahOaooeWdl++8jOeUqOS6juaPkOS+m+iHquWumuS5ieS6i+S7tuOAglxuICogLSDlj6/ku6XnlKggb24sIG9mZiDmlrnms5XmnaXnu5Hlrprnp7vpmaTkuovku7bjgIJcbiAqIC0g55SoIHRyaWdnZXIg5p2l6Kem5Y+R5LqL5Lu26YCa55+l44CCXG4gKiBAY2xhc3MgRXZlbnRzXG4gKiBAc2VlIOexu+S8vOW3peWFtzogTWl0dFxuICogQHNlZSBodHRwOi8vYXJhbGVqcy5vcmcvXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kb2N1bWVudGNsb3VkL2JhY2tib25lL2Jsb2IvbWFzdGVyL2JhY2tib25lLmpzXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9ibG9iL21hc3Rlci9saWIvZXZlbnRzLmpzXG4gKiBAZXhhbXBsZVxuICogdmFyICRldmVudHMgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKiBldnQub24oJ2FjdGlvbicsIGZ1bmN0aW9uKCkge1xuICogICBjb25zb2xlLmluZm8oJ2FjdGlvbiB0cmlnZ2VyZWQnKTtcbiAqIH0pO1xuICogZXZ0LnRyaWdnZXIoJ2FjdGlvbicpO1xuICovXG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIHNwbGl0IGV2ZW50IHN0cmluZ3NcbnZhciBldmVudFNwbGl0dGVyID0gL1xccysvO1xuXG52YXIga2V5cyA9IE9iamVjdC5rZXlzO1xuXG5pZiAoIWtleXMpIHtcblx0a2V5cyA9IGZ1bmN0aW9uKG8pIHtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHRmb3IgKHZhciBuYW1lIGluIG8pIHtcblx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKG5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xufVxuXG52YXIgRXZlbnRzID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBCaW5kIG9uZSBvciBtb3JlIHNwYWNlIHNlcGFyYXRlZCBldmVudHMsIGBldmVudHNgLCB0byBhIGBjYWxsYmFja2BcbiAqIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmQgdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gKiAtIOe7keWumuS4gOS4quS6i+S7tuWbnuiwg+WHveaVsO+8jOaIluiAheeUqOWkmuS4quepuuagvOWIhumalOadpee7keWumuWkmuS4quS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDkvKDlhaXlj4LmlbAgYCdhbGwnYCDkvJrlnKjmiYDmnInkuovku7blj5HnlJ/ml7booqvop6blj5HjgIJcbiAqIEBtZXRob2QgRXZlbnRzI29uXG4gKiBAbWVtYmVyb2YgRXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzIOS6i+S7tuWQjeensFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sg5LqL5Lu25Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIOWbnuiwg+WHveaVsOeahOaJp+ihjOeOr+Wig+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIHZhciBldnQgPSBuZXcgJGV2ZW50cygpO1xuICpcbiAqIC8vIOe7keWumjHkuKrkuovku7ZcbiAqIGV2dC5vbignZXZlbnQtbmFtZScsIGZ1bmN0aW9uICgpIHt9KTtcbiAqXG4gKiAvLyDnu5Hlrpoy5Liq5LqL5Lu2XG4gKiBldnQub24oJ2V2ZW50MSBldmVudDInLCBmdW5jdGlvbiAoKSB7fSk7XG4gKlxuICogLy8g57uR5a6a5Li65omA5pyJ5LqL5Lu2XG4gKiBldnQub24oJ2FsbCcsIGZ1bmN0aW9uICgpIHt9KTtcbiAqL1xuXG5FdmVudHMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuXHR2YXIgY2FjaGU7XG5cdHZhciBldmVudDtcblx0dmFyIGxpc3Q7XG5cdGlmICghY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGNhY2hlID0gdGhpcy5fX2V2ZW50cyB8fCAodGhpcy5fX2V2ZW50cyA9IHt9KTtcblx0ZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuXG5cdGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG5cdHdoaWxlIChldmVudCkge1xuXHRcdGxpc3QgPSBjYWNoZVtldmVudF0gfHwgKGNhY2hlW2V2ZW50XSA9IFtdKTtcblx0XHRsaXN0LnB1c2goY2FsbGJhY2ssIGNvbnRleHQpO1xuXHRcdGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIG9uZSBvciBtYW55IGNhbGxiYWNrcy4gSWYgYGNvbnRleHRgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrc1xuICogd2l0aCB0aGF0IGZ1bmN0aW9uLiBJZiBgY2FsbGJhY2tgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrcyBmb3IgdGhlXG4gKiBldmVudC4gSWYgYGV2ZW50c2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgYm91bmQgY2FsbGJhY2tzIGZvciBhbGwgZXZlbnRzLlxuICogLSDnp7vpmaTkuIDkuKrmiJbogIXlpJrkuKrkuovku7blm57osIPlh73mlbDjgIJcbiAqIC0g5aaC5p6c5LiN5Lyg6YCSIGNhbGxiYWNrIOWPguaVsO+8jOS8muenu+mZpOaJgOacieivpeaXtumXtOWQjeensOeahOS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDlpoLmnpzkuI3mjIflrprkuovku7blkI3np7DvvIznp7vpmaTmiYDmnInoh6rlrprkuYnkuovku7blm57osIPlh73mlbDjgIJcbiAqIEBtZXRob2QgRXZlbnRzI29mZlxuICogQG1lbWJlcm9mIEV2ZW50c1xuICogQHBhcmFtIHtTdHJpbmd9IFtldmVudHNdIOS6i+S7tuWQjeensFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSDopoHnp7vpmaTnmoTkuovku7blm57osIPlh73mlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0g6KaB56e76Zmk55qE5Zue6LCD5Ye95pWw55qE5omn6KGM546v5aKD5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRldmVudHMgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKiB2YXIgYm91bmQgPSB7fTtcbiAqIGJvdW5kLnRlc3QgPSBmdW5jdGlvbiAoKSB7fTtcbiAqXG4gKiAvLyDnp7vpmaTkuovku7blkI3kuLogZXZlbnQtbmFtZSDnmoTkuovku7blm57osIPlh73mlbAgYm91bmQudGVzdFxuICogZXZ0Lm9mZignZXZlbnQtbmFtZScsIGJvdW5kLnRlc3QpO1xuICpcbiAqIC8vIOenu+mZpOS6i+S7tuWQjeS4uiAnZXZlbnQnIOeahOaJgOacieS6i+S7tuWbnuiwg+WHveaVsFxuICogZXZ0Lm9mZignZXZlbnQnKTtcbiAqXG4gKiAvLyDnp7vpmaTmiYDmnInoh6rlrprkuYnkuovku7ZcbiAqIGV2dC5vZmYoKTtcbiAqL1xuXG5FdmVudHMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcblx0dmFyIGNhY2hlO1xuXHR2YXIgZXZlbnQ7XG5cdHZhciBsaXN0O1xuXHR2YXIgaTtcblxuXHQvLyBObyBldmVudHMsIG9yIHJlbW92aW5nICphbGwqIGV2ZW50cy5cblx0Y2FjaGUgPSB0aGlzLl9fZXZlbnRzO1xuXHRpZiAoIWNhY2hlKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0aWYgKCEoZXZlbnRzIHx8IGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX19ldmVudHM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRldmVudHMgPSBldmVudHMgPyBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcikgOiBrZXlzKGNhY2hlKTtcblxuXHQvLyBMb29wIHRocm91Z2ggdGhlIGNhbGxiYWNrIGxpc3QsIHNwbGljaW5nIHdoZXJlIGFwcHJvcHJpYXRlLlxuXHRmb3IgKGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7IGV2ZW50OyBldmVudCA9IGV2ZW50cy5zaGlmdCgpKSB7XG5cdFx0bGlzdCA9IGNhY2hlW2V2ZW50XTtcblx0XHRpZiAoIWxpc3QpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGlmICghKGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG5cdFx0XHRkZWxldGUgY2FjaGVbZXZlbnRdO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gbGlzdC5sZW5ndGggLSAyOyBpID49IDA7IGkgLT0gMikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhKFxuXHRcdFx0XHRcdChjYWxsYmFjayAmJiBsaXN0W2ldICE9PSBjYWxsYmFjaylcblx0XHRcdFx0XHR8fCAoY29udGV4dCAmJiBsaXN0W2kgKyAxXSAhPT0gY29udGV4dClcblx0XHRcdFx0KVxuXHRcdFx0KSB7XG5cdFx0XHRcdGxpc3Quc3BsaWNlKGksIDIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUcmlnZ2VyIG9uZSBvciBtYW55IGV2ZW50cywgZmlyaW5nIGFsbCBib3VuZCBjYWxsYmFja3MuIENhbGxiYWNrcyBhcmVcbiAqIHBhc3NlZCB0aGUgc2FtZSBhcmd1bWVudHMgYXMgYHRyaWdnZXJgIGlzLCBhcGFydCBmcm9tIHRoZSBldmVudCBuYW1lXG4gKiAodW5sZXNzIHlvdSdyZSBsaXN0ZW5pbmcgb24gYFwiYWxsXCJgLCB3aGljaCB3aWxsIGNhdXNlIHlvdXIgY2FsbGJhY2sgdG9cbiAqIHJlY2VpdmUgdGhlIHRydWUgbmFtZSBvZiB0aGUgZXZlbnQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50KS5cbiAqIC0g5rS+5Y+R5LiA5Liq5oiW6ICF5aSa5Liq5LqL5Lu277yM5Lya6Kem5Y+R5a+55bqU5LqL5Lu25ZCN56ew57uR5a6a55qE5omA5pyJ5LqL5Lu25Ye95pWw44CCXG4gKiAtIOesrOS4gOS4quWPguaVsOaYr+S6i+S7tuWQjeensO+8jOWJqeS4i+WFtuS7luWPguaVsOWwhuS9nOS4uuS6i+S7tuWbnuiwg+eahOWPguaVsOOAglxuICogQG1ldGhvZCBFdmVudHMjdHJpZ2dlclxuICogQG1lbWJlcm9mIEV2ZW50c1xuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50cyDkuovku7blkI3np7BcbiAqIEBwYXJhbSB7Li4uKn0gW2FyZ10g5LqL5Lu25Y+C5pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRldmVudHMgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKlxuICogLy8g6Kem5Y+R5LqL5Lu25ZCN5Li6ICdldmVudC1uYW1lJyDnmoTkuovku7ZcbiAqIGV2dC50cmlnZ2VyKCdldmVudC1uYW1lJyk7XG4gKlxuICogLy8g5ZCM5pe26Kem5Y+RMuS4quS6i+S7tlxuICogZXZ0LnRyaWdnZXIoJ2V2ZW50MSBldmVudDInKTtcbiAqXG4gKiAvLyDop6blj5Hkuovku7blkIzml7bkvKDpgJLlj4LmlbBcbiAqIGV2dC5vbignZXZlbnQteCcsIGZ1bmN0aW9uIChhLCBiKSB7XG4gKiAgIGNvbnNvbGUuaW5mbyhhLCBiKTsgLy8gMSwgMlxuICogfSk7XG4gKiBldnQudHJpZ2dlcignZXZlbnQteCcsIDEsIDIpO1xuICovXG5FdmVudHMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihldmVudHMpIHtcblx0dmFyIGNhY2hlO1xuXHR2YXIgZXZlbnQ7XG5cdHZhciBhbGw7XG5cdHZhciBsaXN0O1xuXHR2YXIgaTtcblx0dmFyIGxlbjtcblx0dmFyIHJlc3QgPSBbXTtcblx0dmFyIGFyZ3M7XG5cblx0Y2FjaGUgPSB0aGlzLl9fZXZlbnRzO1xuXHRpZiAoIWNhY2hlKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRldmVudHMgPSBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcik7XG5cblx0Ly8gRmlsbCB1cCBgcmVzdGAgd2l0aCB0aGUgY2FsbGJhY2sgYXJndW1lbnRzLiAgU2luY2Ugd2UncmUgb25seSBjb3B5aW5nXG5cdC8vIHRoZSB0YWlsIG9mIGBhcmd1bWVudHNgLCBhIGxvb3AgaXMgbXVjaCBmYXN0ZXIgdGhhbiBBcnJheSNzbGljZS5cblx0Zm9yIChpID0gMSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0cmVzdFtpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cdH1cblxuXHQvLyBGb3IgZWFjaCBldmVudCwgd2FsayB0aHJvdWdoIHRoZSBsaXN0IG9mIGNhbGxiYWNrcyB0d2ljZSwgZmlyc3QgdG9cblx0Ly8gdHJpZ2dlciB0aGUgZXZlbnQsIHRoZW4gdG8gdHJpZ2dlciBhbnkgYFwiYWxsXCJgIGNhbGxiYWNrcy5cblx0Zm9yIChldmVudCA9IGV2ZW50cy5zaGlmdCgpOyBldmVudDsgZXZlbnQgPSBldmVudHMuc2hpZnQoKSkge1xuXHRcdC8vIENvcHkgY2FsbGJhY2sgbGlzdHMgdG8gcHJldmVudCBtb2RpZmljYXRpb24uXG5cdFx0YWxsID0gY2FjaGUuYWxsO1xuXHRcdGlmIChhbGwpIHtcblx0XHRcdGFsbCA9IGFsbC5zbGljZSgpO1xuXHRcdH1cblxuXHRcdGxpc3QgPSBjYWNoZVtldmVudF07XG5cdFx0aWYgKGxpc3QpIHtcblx0XHRcdGxpc3QgPSBsaXN0LnNsaWNlKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRXhlY3V0ZSBldmVudCBjYWxsYmFja3MuXG5cdFx0aWYgKGxpc3QpIHtcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcblx0XHRcdFx0bGlzdFtpXS5hcHBseShsaXN0W2kgKyAxXSB8fCB0aGlzLCByZXN0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBFeGVjdXRlIFwiYWxsXCIgY2FsbGJhY2tzLlxuXHRcdGlmIChhbGwpIHtcblx0XHRcdGFyZ3MgPSBbZXZlbnRdLmNvbmNhdChyZXN0KTtcblx0XHRcdGZvciAoaSA9IDAsIGxlbiA9IGFsbC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuXHRcdFx0XHRhbGxbaV0uYXBwbHkoYWxsW2kgKyAxXSB8fCB0aGlzLCBhcmdzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTWl4IGBFdmVudHNgIHRvIG9iamVjdCBpbnN0YW5jZSBvciBDbGFzcyBmdW5jdGlvbi5cbiAqIC0g5bCG6Ieq5a6a5LqL5Lu25a+56LGh77yM5re35ZCI5Yiw5LiA5Liq57G755qE5a6e5L6L44CCXG4gKiBAbWV0aG9kIEV2ZW50cy5taXhUb1xuICogQG1lbWJlcm9mIEV2ZW50c1xuICogQHBhcmFtIHtPYmplY3R9IHJlY2VpdmVyIOimgea3t+WQiOS6i+S7tuWHveaVsOeahOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIC8vIOe7meS4gOS4quWunuS+i+a3t+WQiOiHquWumuS5ieS6i+S7tuaWueazlVxuICogdmFyIG9iaiA9IHt9O1xuICogJGV2ZW50cy5taXhUbyhvYmopO1xuICpcbiAqIC8vIOeUn+aIkOS4gOS4quWunuS+i1xuICogdmFyIG8xID0gT2JqZWN0LmNyZWF0ZShvYmopO1xuICpcbiAqIC8vIOWPr+S7peWcqOi/meS4quWvueixoeS4iuiwg+eUqOiHquWumuS5ieS6i+S7tueahOaWueazleS6hlxuICogbzEub24oJ2V2ZW50JywgZnVuY3Rpb24gKCkge30pO1xuICovXG5FdmVudHMubWl4VG8gPSBmdW5jdGlvbihyZWNlaXZlcikge1xuXHRyZWNlaXZlciA9IHJlY2VpdmVyLnByb3RvdHlwZSB8fCByZWNlaXZlcjtcblx0dmFyIHByb3RvID0gRXZlbnRzLnByb3RvdHlwZTtcblxuXHRmb3IgKHZhciBwIGluIHByb3RvKSB7XG5cdFx0aWYgKHByb3RvLmhhc093blByb3BlcnR5KHApKSB7XG5cdFx0XHRyZWNlaXZlcltwXSA9IHByb3RvW3BdO1xuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudHM7XG4iLCIvKipcbiAqICMg5aSE55CG5LqL5Lu25LiO5bm/5pKtXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9ldnRcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2V2dFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5ldnQub2NjdXJJbnNpZGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvZXZ0XG4gKiB2YXIgJGV2dCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQnKTtcbiAqIGNvbnNvbGUuaW5mbygkZXZ0Lm9jY3VySW5zaWRlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkb2NjdXJJbnNpZGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L29jY3VySW5zaWRlJyk7XG4gKi9cblxuZXhwb3J0cy5FdmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xuZXhwb3J0cy5MaXN0ZW5lciA9IHJlcXVpcmUoJy4vbGlzdGVuZXInKTtcbmV4cG9ydHMub2NjdXJJbnNpZGUgPSByZXF1aXJlKCcuL29jY3VySW5zaWRlJyk7XG5leHBvcnRzLnRhcFN0b3AgPSByZXF1aXJlKCcuL3RhcFN0b3AnKTtcbiIsIi8qKlxuICog5bm/5pKt57uE5Lu2XG4gKiAtIOaehOmAoOWunuS+i+aXtu+8jOmcgOimgeS8oOWFpeS6i+S7tueZveWQjeWNleWIl+ihqOOAglxuICogLSDlj6rmnInlnKjnmb3lkI3ljZXliJfooajkuIrnmoTkuovku7bmiY3lj6/ku6Xooqvop6blj5HjgIJcbiAqIC0g5LqL5Lu25re75Yqg77yM56e76Zmk77yM5r+A5Y+R55qE6LCD55So5pa55rOV5Y+C6ICDIEV2ZW50c+OAglxuICogQHNlZSBzcG9yZS1raXQvcGFja2FnZXMvZXZ0L2V2ZW50c1xuICogQGNsYXNzIExpc3RlbmVyXG4gKiBAZXhhbXBsZVxuICogQGV4YW1wbGVcbiAqIHZhciAkbGlzdGVuZXIgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L2xpc3RlbmVyJyk7XG4gKlxuICogLy8g55m95ZCN5Y2V6YeM5Y+q6K6w5b2V5LqGIGV2ZW50MSDkuovku7ZcbiAqIHZhciBjaGFubmVsR2xvYmFsID0gbmV3ICRsaXN0ZW5lcihbXG4gKiAgICdldmVudDEnXG4gKiBdKTtcbiAqIGNoYW5uZWxHbG9iYWwub24oJ2V2ZW50MScsIGZ1bmN0aW9uKCl7XG4gKiAgIGNvbnNvbGUubG9nKCdldmVudDEnKTtcbiAqIH0pO1xuICogY2hhbm5lbEdsb2JhbC5vbignZXZlbnQyJywgZnVuY3Rpb24oKXtcbiAqICAgLy8gd2lsbCBub3QgcnVuXG4gKiAgIGNvbnNvbGUubG9nKCdldmVudDInKTtcbiAqIH0pO1xuICogY2hhbm5lbEdsb2JhbC50cmlnZ2VyKCdldmVudDEnKTtcbiAqIGNoYW5uZWxHbG9iYWwudHJpZ2dlcignZXZlbnQyJyk7XG4gKi9cblxudmFyICRldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xuXG52YXIgTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudHMpIHtcblx0dGhpcy5fd2hpdGVMaXN0ID0ge307XG5cdHRoaXMuX3JlY2VpdmVyID0gbmV3ICRldmVudHMoKTtcblx0aWYgKEFycmF5LmlzQXJyYXkoZXZlbnRzKSkge1xuXHRcdGV2ZW50cy5mb3JFYWNoKHRoaXMuZGVmaW5lLmJpbmQodGhpcykpO1xuXHR9XG59O1xuXG5MaXN0ZW5lci5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBMaXN0ZW5lcixcblx0LyoqXG5cdCAqIOWcqOeZveWQjeWNleS4iuWumuS5ieS4gOS4quS6i+S7tuWQjeensFxuXHQgKiBAbWV0aG9kIExpc3RlbmVyLnByb3RvdHlwZS5kZWZpbmVcblx0ICogQG1lbWJlcm9mIExpc3RlbmVyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcblx0ICovXG5cdGRlZmluZTogZnVuY3Rpb24oZXZlbnROYW1lKSB7XG5cdFx0dGhpcy5fd2hpdGVMaXN0W2V2ZW50TmFtZV0gPSB0cnVlO1xuXHR9LFxuXHQvKipcblx0ICog56e76Zmk55m95ZCN5Y2V5LiK5a6a5LmJ55qE5LqL5Lu25ZCN56ewXG5cdCAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLnVuZGVmaW5lXG5cdCAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG5cdCAqL1xuXHR1bmRlZmluZTogZnVuY3Rpb24oZXZlbnROYW1lKSB7XG5cdFx0ZGVsZXRlIHRoaXMuX3doaXRlTGlzdFtldmVudE5hbWVdO1xuXHR9LFxuXHQvKipcblx0ICog5bm/5pKt57uE5Lu257uR5a6a5LqL5Lu2XG5cdCAqIEBzZWUgPGEgaHJlZj1cIiNldmVudHMtcHJvdG90eXBlLW9uXCI+ZXZlbnRzLnByb3RvdHlwZS5vbjwvYT5cblx0ICogQG1ldGhvZCBMaXN0ZW5lci5wcm90b3R5cGUub25cblx0ICogQG1lbWJlcm9mIExpc3RlbmVyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUg6KaB57uR5a6a55qE5LqL5Lu25ZCN56ewXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgee7keWumueahOS6i+S7tuWbnuiwg+WHveaVsFxuXHQgKi9cblx0b246IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX3JlY2VpdmVyLm9uLmFwcGx5KHRoaXMuX3JlY2VpdmVyLCBhcmd1bWVudHMpO1xuXHR9LFxuXHQvKipcblx0ICog5bm/5pKt57uE5Lu256e76Zmk5LqL5Lu2XG5cdCAqIEBzZWUgPGEgaHJlZj1cIiNldmVudHMtcHJvdG90eXBlLW9mZlwiPmV2ZW50cy5wcm90b3R5cGUub2ZmPC9hPlxuXHQgKiBAbWV0aG9kIExpc3RlbmVyLnByb3RvdHlwZS5vZmZcblx0ICogQG1lbWJlcm9mIExpc3RlbmVyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUg6KaB56e76Zmk57uR5a6a55qE5LqL5Lu25ZCN56ewXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeenu+mZpOe7keWumueahOS6i+S7tuWbnuiwg+WHveaVsFxuXHQgKi9cblx0b2ZmOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9yZWNlaXZlci5vZmYuYXBwbHkodGhpcy5fcmVjZWl2ZXIsIGFyZ3VtZW50cyk7XG5cdH0sXG5cdC8qKlxuXHQgKiDlub/mkq3nu4Tku7bmtL7lj5Hkuovku7Zcblx0ICogQHNlZSA8YSBocmVmPVwiI2V2ZW50cy1wcm90b3R5cGUtdHJpZ2dlclwiPmV2ZW50cy5wcm90b3R5cGUudHJpZ2dlcjwvYT5cblx0ICogQG1ldGhvZCBMaXN0ZW5lci5wcm90b3R5cGUudHJpZ2dlclxuXHQgKiBAbWVtYmVyb2YgTGlzdGVuZXJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSDopoHop6blj5HnmoTkuovku7blkI3np7Bcblx0ICogQHBhcmFtIHsuLi4qfSBbYXJnXSDkuovku7blj4LmlbBcblx0ICovXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50cykge1xuXHRcdHZhciByZXN0ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdFx0Ly8g5oyJ54WnRXZlbnRzLnRyaWdnZXLnmoTosIPnlKjmlrnlvI/vvIznrKzkuIDkuKrlj4LmlbDmmK/nlKjnqbrmoLzliIbpmpTnmoTkuovku7blkI3np7DliJfooahcblx0XHRldmVudHMgPSBldmVudHMuc3BsaXQoL1xccysvKTtcblxuXHRcdC8vIOmBjeWOhuS6i+S7tuWIl+ihqO+8jOS+neaNrueZveWQjeWNleWGs+WumuS6i+S7tuaYr+WQpua/gOWPkVxuXHRcdGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2dE5hbWUpIHtcblx0XHRcdGlmICh0aGlzLl93aGl0ZUxpc3RbZXZ0TmFtZV0pIHtcblx0XHRcdFx0dGhpcy5fcmVjZWl2ZXIudHJpZ2dlci5hcHBseSh0aGlzLl9yZWNlaXZlciwgW2V2dE5hbWVdLmNvbmNhdChyZXN0KSk7XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0ZW5lcjtcbiIsIi8qKlxuICog5Yik5pat5LqL5Lu25piv5ZCm5Y+R55Sf5Zyo5LiA5LiqIERvbSDlhYPntKDlhoXjgIJcbiAqIC0g5bi455So5LqO5Yik5pat54K55Ye75LqL5Lu25Y+R55Sf5Zyo5rWu5bGC5aSW5pe25YWz6Zet5rWu5bGC44CCXG4gKiBAbWV0aG9kIG9jY3VySW5zaWRlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQg5rWP6KeI5Zmo5LqL5Lu25a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnlKjkuo7mr5TovoPkuovku7blj5HnlJ/ljLrln5/nmoQgRG9tIOWvueixoVxuICogQHJldHVybnMge0Jvb2xlYW59IOS6i+S7tuaYr+WQpuWPkeeUn+WcqCBub2RlIOWGhVxuICogQGV4YW1wbGVcbiAqIHZhciAkb2NjdXJJbnNpZGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L29jY3VySW5zaWRlJyk7XG4gKiAkKCcubGF5ZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldnQpe1xuICogICBpZigkb2NjdXJJbnNpZGUoZXZ0LCAkKHRoaXMpLmZpbmQoJ2Nsb3NlJykuZ2V0KDApKSl7XG4gKiAgICAgJCh0aGlzKS5oaWRlKCk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbmZ1bmN0aW9uIG9jY3VySW5zaWRlKGV2ZW50LCBub2RlKSB7XG5cdGlmIChub2RlICYmIGV2ZW50ICYmIGV2ZW50LnRhcmdldCkge1xuXHRcdHZhciBwb3MgPSBldmVudC50YXJnZXQ7XG5cdFx0d2hpbGUgKHBvcykge1xuXHRcdFx0aWYgKHBvcyA9PT0gbm9kZSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBvcyA9IHBvcy5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2NjdXJJbnNpZGU7XG4iLCIvKipcbiAqIOeUqOmBrue9qeeahOaWueW8j+mYu+atoiB0YXAg5LqL5Lu256m/6YCP5byV5Y+R6KGo5Y2V5YWD57Sg6I635Y+W54Sm54K544CCXG4gKiAtIOaOqOiNkOeUqCBmYXN0Y2xpY2sg5p2l6Kej5Yaz6Kem5bGP5LqL5Lu256m/6YCP6Zeu6aKY44CCXG4gKiAtIOatpOe7hOS7tueUqOWcqCBmYXN0Y2xpY2sg5pyq6IO96Kej5Yaz6Zeu6aKY5pe244CC5oiW6ICF5LiN5pa55L6/5L2/55SoIGZhc3RjbGljayDml7bjgIJcbiAqIEBtZXRob2QgdGFwU3RvcFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg54K55Ye76YCJ6aG5XG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kZWxheSDkuLTml7bmta7lsYLlnKjov5nkuKrlu7bov5/ml7bpl7QobXMp5LmL5ZCO5YWz6ZetXG4gKiBAZXhhbXBsZVxuICogdmFyICR0YXBTdG9wID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC90YXBTdG9wJyk7XG4gKiAkKCcubWFzaycpLm9uKCd0YXAnLCBmdW5jdGlvbigpe1xuICogICAkdGFwU3RvcCgpO1xuICogICAkKHRoaXMpLmhpZGUoKTtcbiAqIH0pO1xuICovXG52YXIgbWluaU1hc2sgPSBudWxsO1xudmFyIHBvcyA9IHt9O1xudmFyIHRpbWVyID0gbnVsbDtcbnZhciB0b3VjaFN0YXJ0Qm91bmQgPSBmYWxzZTtcblxudmFyIHRhcFN0b3AgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHZhciAkID0gd2luZG93LiQgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnk7XG5cblx0dmFyIGNvbmYgPSAkLmV4dGVuZCh7XG5cdFx0Ly8g6YGu572p5a2Y5Zyo5pe26Ze0XG5cdFx0ZGVsYXk6IDUwMFxuXHR9LCBvcHRpb25zKTtcblxuXHRpZiAoIW1pbmlNYXNrKSB7XG5cdFx0bWluaU1hc2sgPSAkKCc8ZGl2PjwvZGl2PicpO1xuXHRcdG1pbmlNYXNrLmNzcyh7XG5cdFx0XHQnZGlzcGxheSc6ICdub25lJyxcblx0XHRcdCdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG5cdFx0XHQnbGVmdCc6IDAsXG5cdFx0XHQndG9wJzogMCxcblx0XHRcdCdtYXJnaW4tbGVmdCc6ICctMjBweCcsXG5cdFx0XHQnbWFyZ2luLXRvcCc6ICctMjBweCcsXG5cdFx0XHQnei1pbmRleCc6IDEwMDAwLFxuXHRcdFx0J2JhY2tncm91bmQtY29sb3InOiAncmdiYSgwLDAsMCwwKScsXG5cdFx0XHQnd2lkdGgnOiAnNDBweCcsXG5cdFx0XHQnaGVpZ2h0JzogJzQwcHgnXG5cdFx0fSkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cdH1cblxuXHRpZiAoIXRvdWNoU3RhcnRCb3VuZCkge1xuXHRcdCQoZG9jdW1lbnQpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRpZiAoIShldnQgJiYgZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgdG91Y2ggPSBldnQudG91Y2hlc1swXTtcblx0XHRcdHBvcy5wYWdlWCA9IHRvdWNoLnBhZ2VYO1xuXHRcdFx0cG9zLnBhZ2VZID0gdG91Y2gucGFnZVk7XG5cdFx0fSk7XG5cdFx0dG91Y2hTdGFydEJvdW5kID0gdHJ1ZTtcblx0fVxuXG5cdHZhciBkZWxheSA9IHBhcnNlSW50KGNvbmYuZGVsYXksIDEwKSB8fCAwO1xuXHRtaW5pTWFzay5zaG93KCkuY3NzKHtcblx0XHQnbGVmdCc6IHBvcy5wYWdlWCArICdweCcsXG5cdFx0J3RvcCc6IHBvcy5wYWdlWSArICdweCdcblx0fSk7XG5cdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRtaW5pTWFzay5oaWRlKCk7XG5cdH0sIGRlbGF5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGFwU3RvcDtcbiIsIi8qKlxuICog5YyF6KOF5Li65bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiAtIOeUqOS6juWkhOeQhuWvhumbhuS6i+S7tu+8jOW7tui/n+aXtumXtOWGheWQjOaXtuinpuWPkeeahOWHveaVsOiwg+eUqOOAglxuICogLSDmnIDnu4jlj6rlnKjmnIDlkI7kuIDmrKHosIPnlKjlu7bov5/lkI7vvIzmiafooYzkuIDmrKHjgIJcbiAqIEBtZXRob2QgZGVsYXlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeW7tui/n+inpuWPkeeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIOW7tui/n+aXtumXtChtcylcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYmluZF0g5Ye95pWw55qEdGhpc+aMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTlu7bov5/op6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGRlbGF5ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2RlbGF5Jyk7XG4gKiB2YXIgY29tcCA9IHtcbiAqICAgY291bnRXb3JkcyA6IGZ1bmN0aW9uKCl7XG4gKiAgICAgY29uc29sZS5pbmZvKHRoaXMubGVuZ3RoKTtcbiAqICAgfVxuICogfTtcbiAqXG4gKiAgLy8g55av54uC54K55Ye7IGlucHV0IO+8jOWBnOS4i+adpSA1MDAgbXMg5ZCO77yM6Kem5Y+R5Ye95pWw6LCD55SoXG4gKiAkKCcjaW5wdXQnKS5rZXlkb3duKCRkZWxheShmdW5jdGlvbigpe1xuICogICB0aGlzLmxlbmd0aCA9ICQoJyNpbnB1dCcpLnZhbCgpLmxlbmd0aDtcbiAqICAgdGhpcy5jb3VudFdvcmRzKCk7XG4gKiB9LCA1MDAsIGNvbXApKTtcbiAqL1xuXG5mdW5jdGlvbiBkZWxheSAoZm4sIGR1cmF0aW9uLCBiaW5kKSB7XG5cdHZhciB0aW1lciA9IG51bGw7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0YmluZCA9IGJpbmQgfHwgdGhpcztcblx0XHRpZiAodGltZXIpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0fVxuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xuXHRcdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH0sIGR1cmF0aW9uKTtcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxheTtcbiIsIi8qKlxuICogIyDlh73mlbDljIXoo4XvvIzojrflj5bnibnmrormiafooYzmlrnlvI9cbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL2ZuXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9mblxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5mbi5kZWxheSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9mblxuICogdmFyICRmbiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbicpO1xuICogY29uc29sZS5pbmZvKCRmbi5kZWxheSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGRlbGF5ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2RlbGF5Jyk7XG4gKi9cblxuZXhwb3J0cy5kZWxheSA9IHJlcXVpcmUoJy4vZGVsYXknKTtcbmV4cG9ydHMubG9jayA9IHJlcXVpcmUoJy4vbG9jaycpO1xuZXhwb3J0cy5vbmNlID0gcmVxdWlyZSgnLi9vbmNlJyk7XG5leHBvcnRzLnF1ZXVlID0gcmVxdWlyZSgnLi9xdWV1ZScpO1xuZXhwb3J0cy5wcmVwYXJlID0gcmVxdWlyZSgnLi9wcmVwYXJlJyk7XG5leHBvcnRzLnJlZ3VsYXIgPSByZXF1aXJlKCcuL3JlZ3VsYXInKTtcbiIsIi8qKlxuICog5YyF6KOF5Li66Kem5Y+R5LiA5qyh5ZCO77yM6aKE572u5pe26Ze05YaF5LiN6IO95YaN5qyh6Kem5Y+R55qE5Ye95pWwXG4gKiAtIOexu+S8vOS6juaKgOiDveWGt+WNtOOAglxuICogQG1ldGhvZCBsb2NrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTlhrfljbTop6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxvY2sgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZm4vbG9jaycpO1xuICogdmFyIHJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnZG8gcmVxdWVzdCcpO1xuICogfTtcbiAqICQoJyNpbnB1dCcpLmtleWRvd24oJGxvY2socmVxdWVzdCwgNTAwKSk7XG4gKiAvLyDnrKzkuIDmrKHmjInplK7vvIzlsLHkvJrop6blj5HkuIDmrKHlh73mlbDosIPnlKhcbiAqIC8vIOS5i+WQjui/nue7reaMiemUru+8jOS7heWcqCA1MDBtcyDnu5PmnZ/lkI7lho3mrKHmjInplK7vvIzmiY3kvJrlho3mrKHop6blj5EgcmVxdWVzdCDlh73mlbDosIPnlKhcbiAqL1xuXG5mdW5jdGlvbiBsb2NrIChmbiwgZGVsYXksIGJpbmQpIHtcblx0dmFyIHRpbWVyID0gbnVsbDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aW1lcikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRiaW5kID0gYmluZCB8fCB0aGlzO1xuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xuXHRcdHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aW1lciA9IG51bGw7XG5cdFx0fSwgZGVsYXkpO1xuXHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2NrO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrku4Xop6blj5HkuIDmrKHnmoTlh73mlbBcbiAqIC0g6KKr5YyF6KOF55qE5Ye95pWw5pm66IO95omn6KGM5LiA5qyh77yM5LmL5ZCO5LiN5Lya5YaN5omn6KGMXG4gKiBAbWV0aG9kIG9uY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeW7tui/n+inpuWPkeeahOWHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g6K+l5Ye95pWw5LuF6IO96Kem5Y+R5omn6KGM5LiA5qyhXG4gKiBAZXhhbXBsZVxuICogdmFyICRvbmNlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2ZuL29uY2UnKTtcbiAqIHZhciBmbiA9ICRvbmNlKGZ1bmN0aW9uICgpIHtcbiAqICAgY29uc29sZS5pbmZvKCdvdXRwdXQnKTtcbiAqIH0pO1xuICogZm4oKTsgLy8gJ291dHB1dCdcbiAqIGZuKCk7IC8vIHdpbGwgZG8gbm90aGluZ1xuICovXG5cbmZ1bmN0aW9uIG9uY2UgKGZuLCBiaW5kKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0YmluZCA9IGJpbmQgfHwgdGhpcztcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRmbi5hcHBseShiaW5kLCBhcmd1bWVudHMpO1xuXHRcdFx0Zm4gPSBudWxsO1xuXHRcdFx0YmluZCA9IG51bGw7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIvKipcbiAqIOWMheijheS4uuS4gOS4quadoeS7tuinpuWPkeeuoeeQhuWZqFxuICogLSDosIPnlKjnrqHnkIblmajnmoQgcmVhZHkg5Ye95pWw5p2l5r+A5rS75p2h5Lu244CCXG4gKiAtIOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOWHveaVsOaMiemYn+WIl+mhuuW6j+aJp+ihjOOAglxuICogLSDkuYvlkI7mj5LlhaXnrqHnkIblmajnmoTlh73mlbDnq4vljbPmiafooYzjgIJcbiAqIC0g5L2c55So5py65Yi257G75Ly8IGpRdWVyeS5yZWFkeSwg5Y+v5Lul6K6+572u5Lu75L2V5p2h5Lu244CCXG4gKiBAbW9kdWxlIHByZXBhcmVcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g5p2h5Lu26Kem5Y+R566h55CG5Zmo5Ye95pWw77yM5Lyg5YWl5LiA5LiqIGZ1bmN0aW9uIOS9nOS4uuS7u+WKoeaJp+ihjOWHveaVsOWPguaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkcHJlcGFyZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9wcmVwYXJlJyk7XG4gKiAvLyDnlJ/miJDkuIDkuKrnrqHnkIblmajlh73mlbAgdGltZVJlYWR5XG4gKiB2YXIgdGltZVJlYWR5ID0gJHByZXBhcmUoKTtcbiAqXG4gKiAvLyDorr7nva7mnaHku7bkuLoy56eS5ZCO5bCx57uqXG4gKiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAqICAgdGltZVJlYWR5LnJlYWR5KCk7XG4gKiB9LCAyMDAwKTtcbiAqXG4gKiAvLyDosIPnlKjnrqHnkIblmajlh73mlbAgdGltZVJlYWR577yM5o+S5YWl6KaB5omn6KGM55qE5Lu75Yqh5Ye95pWwXG4gKiB0aW1lUmVhZHkoZnVuY3Rpb24gKCkge1xuICogICAvLyAyIOenkuWQjui+k+WHuiAxXG4gKiAgIGNvbnNvbGUuaW5mbygxKTtcbiAqIH0pO1xuICpcbiAqIC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqIHRpbWVSZWFkeShmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIDIg56eS5ZCO6L6T5Ye6IDJcbiAqICAgY29uc29sZS5pbmZvKDIpO1xuICogfSk7XG4gKlxuICogLy8gMjEwMG1zIOWQjuaJp+ihjFxuICogc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqICAgdGltZVJlYWR5KGZ1bmN0aW9uICgpIHtcbiAqICAgICAvLyDnq4vljbPmiafooYzvvIzovpPlh7ogM1xuICogICAgIGNvbnNvbGUuaW5mbygzKTtcbiAqICAgfSk7XG4gKiB9LCAyMTAwKTtcbiAqL1xuXG4vKipcbiAqIOa/gOa0u+S7u+WKoeeuoeeQhuWZqOeahOinpuWPkeadoeS7tu+8jOWcqOatpOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOS7u+WKoeaMiemYn+WIl+mhuuW6j+aJp+ihjO+8jOS5i+WQjuaPkuWFpeeahOS7u+WKoeWHveaVsOeri+WNs+aJp+ihjOOAglxuICogQG1ldGhvZCBwcmVwYXJlI3JlYWR5XG4gKiBAbWVtYmVyb2YgcHJlcGFyZVxuICovXG5mdW5jdGlvbiBwcmVwYXJlICgpIHtcblx0dmFyIHF1ZXVlID0gW107XG5cdHZhciBjb25kaXRpb24gPSBmYWxzZTtcblx0dmFyIG1vZGVsO1xuXG5cdHZhciBhdHRhbXB0ID0gZnVuY3Rpb24oZm4pIHtcblx0XHRpZiAoY29uZGl0aW9uKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGZuKG1vZGVsKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVldWUucHVzaChmbik7XG5cdFx0fVxuXHR9O1xuXG5cdGF0dGFtcHQucmVhZHkgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0Y29uZGl0aW9uID0gdHJ1ZTtcblx0XHRtb2RlbCA9IGRhdGE7XG5cdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCkge1xuXHRcdFx0dmFyIGZuID0gcXVldWUuc2hpZnQoKTtcblx0XHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Zm4obW9kZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gYXR0YW1wdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcmVwYXJlO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrkuIDkuKrpmJ/liJfvvIzmjInorr7nva7nmoTml7bpl7Tpl7TpmpTop6blj5Hku7vliqHlh73mlbBcbiAqIC0g5o+S5YWl6Zif5YiX55qE5omA5pyJ5Ye95pWw6YO95Lya5omn6KGM77yM5L2G5q+P5qyh5omn6KGM5LmL6Ze06YO95Lya5pyJ5LiA5Liq5Zu65a6a55qE5pe26Ze06Ze06ZqU44CCXG4gKiBAbWV0aG9kIHF1ZXVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTpmJ/liJfop6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHF1ZXVlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3F1ZXVlJyk7XG4gKiB2YXIgdDEgPSBEYXRlLm5vdygpO1xuICogdmFyIGRvU29tdGhpbmcgPSAkcXVldWUoZnVuY3Rpb24gKGluZGV4KSB7XG4gKiAgIGNvbnNvbGUuaW5mbyhpbmRleCArICc6JyArIChEYXRlLm5vdygpIC0gdDEpKTtcbiAqIH0sIDIwMCk7XG4gKiAvLyDmr4/pmpQyMDBtc+i+k+WHuuS4gOS4quaXpeW/l+OAglxuICogZm9yKHZhciBpID0gMDsgaSA8IDEwOyBpKyspe1xuICogICBkb1NvbXRoaW5nKGkpO1xuICogfVxuICovXG5cbmZ1bmN0aW9uIHF1ZXVlIChmbiwgZGVsYXksIGJpbmQpIHtcblx0dmFyIHRpbWVyID0gbnVsbDtcblx0dmFyIGFyciA9IFtdO1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0YmluZCA9IGJpbmQgfHwgdGhpcztcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHRhcnIucHVzaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGlmICghdGltZXIpIHtcblx0XHRcdHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoIWFyci5sZW5ndGgpIHtcblx0XHRcdFx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcblx0XHRcdFx0XHR0aW1lciA9IG51bGw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXJyLnNoaWZ0KCkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgZGVsYXkpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWV1ZTtcbiIsIi8qKlxuICog5YyF6KOF5Li66KeE5b6L6Kem5Y+R55qE5Ye95pWw77yM55So5LqO6ZmN5L2O5a+G6ZuG5LqL5Lu255qE5aSE55CG6aKR546HXG4gKiAtIOWcqOeWr+eLguaTjeS9nOacn+mXtO+8jOaMieeFp+inhOW+i+aXtumXtOmXtOmalO+8jOadpeiwg+eUqOS7u+WKoeWHveaVsFxuICogQG1ldGhvZCByZXF1bGFyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybiB7RnVuY3Rpb259IOe7j+i/h+WMheijheeahOWumuaXtuinpuWPkeWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkcmVndWxhciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9yZWd1bGFyJyk7XG4gKiB2YXIgY29tcCA9IHtcbiAqICAgY291bnRXb3JkcyA6IGZ1bmN0aW9uKCl7XG4gKiAgICAgY29uc29sZS5pbmZvKHRoaXMubGVuZ3RoKTtcbiAqICAgfVxuICogfTtcbiAqIC8vIOeWr+eLguaMiemUru+8jOavj+malCAyMDBtcyDmiY3mnInkuIDmrKHmjInplK7mnInmlYhcbiAqICQoJyNpbnB1dCcpLmtleWRvd24oJHJlZ3VsYXIoZnVuY3Rpb24oKXtcbiAqIFx0dGhpcy5sZW5ndGggPSAkKCcjaW5wdXQnKS52YWwoKS5sZW5ndGg7XG4gKiBcdHRoaXMuY291bnRXb3JkcygpO1xuICogfSwgMjAwLCBjb21wKSk7XG4gKi9cblxuZnVuY3Rpb24gcmVxdWxhciAoZm4sIGRlbGF5LCBiaW5kKSB7XG5cdHZhciBlbmFibGUgPSB0cnVlO1xuXHR2YXIgdGltZXIgPSBudWxsO1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGJpbmQgPSBiaW5kIHx8IHRoaXM7XG5cdFx0ZW5hYmxlID0gdHJ1ZTtcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHRpZiAoIXRpbWVyKSB7XG5cdFx0XHR0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghZW5hYmxlKSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdFx0dGltZXIgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVuYWJsZSA9IGZhbHNlO1xuXHRcdFx0fSwgZGVsYXkpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1bGFyO1xuIiwiLyoqXG4gKiDnroDljZXnmoQgRWFzaW5nIEZ1bmN0aW9uc1xuICogLSDlgLzln5/lj5jljJbojIPlm7TvvIzku44gWzAsIDFdIOWIsCBbMCwgMV1cbiAqIC0g5Y2z6L6T5YWl5YC86IyD5Zu05LuOIDAg5YiwIDFcbiAqIC0g6L6T5Ye65Lmf5Li65LuOIDAg5YiwIDFcbiAqIC0g6YCC5ZCI6L+b6KGM55m+5YiG5q+U5Yqo55S76L+Q566XXG4gKlxuICog5Yqo55S75Ye95pWwXG4gKiAtIGxpbmVhclxuICogLSBlYXNlSW5RdWFkXG4gKiAtIGVhc2VPdXRRdWFkXG4gKiAtIGVhc2VJbk91dFF1YWRcbiAqIC0gZWFzZUluQ3ViaWNcbiAqIC0gZWFzZUluUXVhcnRcbiAqIC0gZWFzZU91dFF1YXJ0XG4gKiAtIGVhc2VJbk91dFF1YXJ0XG4gKiAtIGVhc2VJblF1aW50XG4gKiAtIGVhc2VPdXRRdWludFxuICogLSBlYXNlSW5PdXRRdWludFxuICogQG1vZHVsZSBlYXNpbmdcbiAqIEBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTRcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVhc2luZyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcnKTtcbiAqICRlYXNpbmcubGluZWFyKDAuNSk7IC8vIDAuNVxuICogJGVhc2luZy5lYXNlSW5RdWFkKDAuNSk7IC8vIDAuMjVcbiAqICRlYXNpbmcuZWFzZUluQ3ViaWMoMC41KTsgLy8gMC4xMjVcbiAqL1xudmFyIGVhc2luZyA9IHtcblx0Ly8gbm8gZWFzaW5nLCBubyBhY2NlbGVyYXRpb25cblx0bGluZWFyOiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQ7XG5cdH0sXG5cdC8vIGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHlcblx0ZWFzZUluUXVhZDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0ICogdDtcblx0fSxcblx0Ly8gZGVjZWxlcmF0aW5nIHRvIHplcm8gdmVsb2NpdHlcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gdCAqICgyIC0gdCk7XG5cdH0sXG5cdC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQgPCAwLjUgPyAyICogdCAqIHQgOiAtMSArICg0IC0gMiAqIHQpICogdDtcblx0fSxcblx0Ly8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuXHRlYXNlSW5DdWJpYzogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0ICogdCAqIHQ7XG5cdH0sXG5cdC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG5cdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiAoLS10KSAqIHQgKiB0ICsgMTtcblx0fSxcblx0Ly8gYWNjZWxlcmF0aW9uIHVudGlsIGhhbGZ3YXksIHRoZW4gZGVjZWxlcmF0aW9uXG5cdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xuXHR9LFxuXHQvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG5cdGVhc2VJblF1YXJ0OiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQgKiB0ICogdCAqIHQ7XG5cdH0sXG5cdC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiAxIC0gKC0tdCkgKiB0ICogdCAqIHQ7XG5cdH0sXG5cdC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24odCkge1xuXHRcdHJldHVybiB0IDwgMC41ID8gOCAqIHQgKiB0ICogdCAqIHQgOiAxIC0gOCAqICgtLXQpICogdCAqIHQgKiB0O1xuXHR9LFxuXHQvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG5cdGVhc2VJblF1aW50OiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQgKiB0ICogdCAqIHQgKiB0O1xuXHR9LFxuXHQvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuXHRlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRyZXR1cm4gMSArICgtLXQpICogdCAqIHQgKiB0ICogdDtcblx0fSxcblx0Ly8gYWNjZWxlcmF0aW9uIHVudGlsIGhhbGZ3YXksIHRoZW4gZGVjZWxlcmF0aW9uXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbih0KSB7XG5cdFx0cmV0dXJuIHQgPCAwLjUgPyAxNiAqIHQgKiB0ICogdCAqIHQgKiB0IDogMSArIDE2ICogKC0tdCkgKiB0ICogdCAqIHQgKiB0O1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2luZztcbiIsIi8qKlxuICog5bCB6KOF6Zeq54OB5Yqo5L2cXG4gKiBAbWV0aG9kIGZsYXNoQWN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyDpgInpoblcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy50aW1lcz0zXSDpl6rng4HmrKHmlbDvvIzpu5jorqQz5qyhXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZGVsYXk9MTAwXSDpl6rng4Hpl7TpmpTml7bpl7QobXMpXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5hY3Rpb25PZGRdIOWlh+aVsOWbnuiwg1xuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMuYWN0aW9uRXZlbl0g5YG25pWw5Zue6LCDXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5yZWNvdmVyXSDnirbmgIHmgaLlpI3lm57osINcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZsYXNoQWN0aW9uID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2ZsYXNoQWN0aW9uJyk7XG4gKiAvLyDmloflrZfpl6rng4HvvIzlpYfmlbDmrKHlkYjnjrDkuLrnuqLoibLvvIzlgbbmlbDmrKHmiJDnuqTnu7Tok53oibLvvIzliqjnlLvnu5PmnZ/lkYjnjrDkuLrpu5HoibJcbiAqIHZhciB0ZXh0ID0gJCgnI3RhcmdldCBzcGFuLnR4dCcpO1xuICogJGZsYXNoQWN0aW9uKHtcbiAqICAgYWN0aW9uT2RkIDogZnVuY3Rpb24gKCl7XG4gKiAgICAgdGV4dC5jc3MoJ2NvbG9yJywgJyNmMDAnKTtcbiAqICAgfSxcbiAqICAgYWN0aW9uRXZlbiA6IGZ1bmN0aW9uICgpe1xuICogICAgIHRleHQuY3NzKCdjb2xvcicsICcjMDBmJyk7XG4gKiAgIH0sXG4gKiAgIHJlY292ZXIgOiBmdW5jdGlvbiAoKXtcbiAqICAgICB0ZXh0LmNzcygnY29sb3InLCAnIzAwMCcpO1xuICogICB9XG4gKiB9KTtcbiAqL1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbmZ1bmN0aW9uIGZsYXNoQWN0aW9uIChvcHRpb25zKSB7XG5cdHZhciBjb25mID0gJGFzc2lnbihcblx0XHR7XG5cdFx0XHR0aW1lczogMyxcblx0XHRcdGRlbGF5OiAxMDAsXG5cdFx0XHRhY3Rpb25PZGQ6IG51bGwsXG5cdFx0XHRhY3Rpb25FdmVuOiBudWxsLFxuXHRcdFx0cmVjb3ZlcjogbnVsbFxuXHRcdH0sXG5cdFx0b3B0aW9uc1xuXHQpO1xuXG5cdHZhciBxdWV1ZSA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbmYudGltZXMgKiAyICsgMTsgaSsrKSB7XG5cdFx0cXVldWUucHVzaCgoaSArIDEpICogY29uZi5kZWxheSk7XG5cdH1cblxuXHRxdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uICh0aW1lLCBpbmRleCkge1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKGluZGV4ID49IHF1ZXVlLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0aWYgKGNvbmYucmVjb3ZlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbmYucmVjb3ZlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGluZGV4ICUgMiA9PT0gMCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGNvbmYuYWN0aW9uRXZlbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbmYuYWN0aW9uRXZlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb25mLmFjdGlvbk9kZCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjb25mLmFjdGlvbk9kZCgpO1xuXHRcdFx0fVxuXHRcdH0sIHRpbWUpO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGFzaEFjdGlvbjtcbiIsIi8qKlxuICog5Yqo55S757G7IC0g55So5LqO5aSE55CG5LiN6YCC5ZCI5L2/55SoIHRyYW5zaXRpb24g55qE5Yqo55S75Zy65pmvXG4gKlxuICog5Y+v57uR5a6a55qE5LqL5Lu2XG4gKiAtIHN0YXJ0IOWKqOeUu+W8gOWni+aXtuinpuWPkVxuICogLSBjb21wbGV0ZSDliqjnlLvlt7LlrozmiJBcbiAqIC0gc3RvcCDliqjnlLvlsJrmnKrlrozmiJDlsLHooqvkuK3mlq1cbiAqIC0gY2FuY2VsIOWKqOeUu+iiq+WPlua2iFxuICogQGNsYXNzIEZ4XG4gKiBAc2VlIGh0dHBzOi8vbW9vdG9vbHMubmV0L2NvcmUvZG9jcy8xLjYuMC9GeC9GeFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOWKqOeUu+mAiemhuVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZwcz02MF0g5bin6YCf546HKGYvcynvvIzlrp7pmYXkuIrliqjnlLvov5DooYznmoTmnIDpq5jluKfpgJ/njofkuI3kvJrpq5jkuo4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOaPkOS+m+eahOW4p+mAn+eOh1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTUwMF0g5Yqo55S75oyB57ut5pe26Ze0KG1zKVxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IFtvcHRpb25zLnRyYW5zaXRpb25dIOWKqOeUu+aJp+ihjOaWueW8j++8jOWPguingSBzcG9yZS1raXQvcGFja2FnZXMvZngvdHJhbnNpdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZXNdIOS7juWTquS4gOW4p+W8gOWni+aJp+ihjFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5mcmFtZVNraXA9dHJ1ZV0g5piv5ZCm6Lez5binXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubGluaz0naWdub3JlJ10g5Yqo55S76KGU5o6l5pa55byP77yM5Y+v6YCJ77yaWydpZ25vcmUnLCAnY2FuY2VsJ11cbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZ4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gKiB2YXIgZnggPSBuZXcgJGZ4KHtcbiAqICAgZHVyYXRpb24gOiAxMDAwXG4gKiB9KTtcbiAqIGZ4LnNldCA9IGZ1bmN0aW9uIChub3cpIHtcbiAqICAgbm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gbm93ICsgJ3B4JztcbiAqIH07XG4gKiBmeC5vbignY29tcGxldGUnLCBmdW5jdGlvbigpe1xuICogICBjb25zb2xlLmluZm8oJ2FuaW1hdGlvbiBlbmQnKTtcbiAqIH0pO1xuICogZnguc3RhcnQoMCwgNjAwKTsgLy8gMeenkuWGheaVsOWtl+S7jjDlop7liqDliLA2MDBcbiAqL1xuXG52YXIgJGtsYXNzID0gcmVxdWlyZSgna2xhc3MnKTtcbnZhciAkZXZlbnRzID0gcmVxdWlyZSgnLi4vZXZ0L2V2ZW50cycpO1xudmFyICRlcmFzZSA9IHJlcXVpcmUoJy4uL2Fyci9lcmFzZScpO1xudmFyICRjb250YWlucyA9IHJlcXVpcmUoJy4uL2Fyci9jb250YWlucycpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpO1xuXG4vLyBnbG9iYWwgdGltZXJzXG4vLyDkvb/nlKjlhazlhbHlrprml7blmajlj6/ku6Xlh4/lsJHmtY/op4jlmajotYTmupDmtojogJdcbnZhciBpbnN0YW5jZXMgPSB7fTtcbnZhciB0aW1lcnMgPSB7fTtcblxudmFyIGxvb3AgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXHRmb3IgKHZhciBpID0gdGhpcy5sZW5ndGg7IGktLTspIHtcblx0XHR2YXIgaW5zdGFuY2UgPSB0aGlzW2ldO1xuXHRcdGlmIChpbnN0YW5jZSkge1xuXHRcdFx0aW5zdGFuY2Uuc3RlcChub3cpO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHB1c2hJbnN0YW5jZSA9IGZ1bmN0aW9uIChmcHMpIHtcblx0dmFyIGxpc3QgPSBpbnN0YW5jZXNbZnBzXSB8fCAoaW5zdGFuY2VzW2Zwc10gPSBbXSk7XG5cdGxpc3QucHVzaCh0aGlzKTtcblx0aWYgKCF0aW1lcnNbZnBzXSkge1xuXHRcdHRpbWVyc1tmcHNdID0gJHRpbWVyLnNldEludGVydmFsKFxuXHRcdFx0bG9vcC5iaW5kKGxpc3QpLFxuXHRcdFx0TWF0aC5yb3VuZCgxMDAwIC8gZnBzKVxuXHRcdCk7XG5cdH1cbn07XG5cbnZhciBwdWxsSW5zdGFuY2UgPSBmdW5jdGlvbiAoZnBzKSB7XG5cdHZhciBsaXN0ID0gaW5zdGFuY2VzW2Zwc107XG5cdGlmIChsaXN0KSB7XG5cdFx0JGVyYXNlKGxpc3QsIHRoaXMpO1xuXHRcdGlmICghbGlzdC5sZW5ndGggJiYgdGltZXJzW2Zwc10pIHtcblx0XHRcdGRlbGV0ZSBpbnN0YW5jZXNbZnBzXTtcblx0XHRcdHRpbWVyc1tmcHNdID0gJHRpbWVyLmNsZWFySW50ZXJ2YWwodGltZXJzW2Zwc10pO1xuXHRcdH1cblx0fVxufTtcblxudmFyIEZ4ID0gJGtsYXNzKHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHR0aGlzLm9wdGlvbnMgPSAkYXNzaWduKFxuXHRcdFx0e1xuXHRcdFx0XHRmcHM6IDYwLFxuXHRcdFx0XHRkdXJhdGlvbjogNTAwLFxuXHRcdFx0XHR0cmFuc2l0aW9uOiBudWxsLFxuXHRcdFx0XHRmcmFtZXM6IG51bGwsXG5cdFx0XHRcdGZyYW1lU2tpcDogdHJ1ZSxcblx0XHRcdFx0bGluazogJ2lnbm9yZSdcblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zXG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICog6K6+572u5a6e5L6L55qE6YCJ6aG5XG5cdCAqIEBtZXRob2QgRngjc2V0T3B0aW9uc1xuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5Yqo55S76YCJ6aG5XG5cdCAqL1xuXHRzZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdHRoaXMuY29uZiA9ICRhc3NpZ24oe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOiuvue9ruWKqOeUu+eahOaJp+ihjOaWueW8j++8jOmFjee9rue8k+WKqOaViOaenFxuXHQgKiBAaW50ZXJmYWNlIEZ4I2dldFRyYW5zaXRpb25cblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBleGFtcGxlXG5cdCAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcblx0ICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuXHQgKiBmeC5nZXRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuXHQgKiAgIHJldHVybiBmdW5jdGlvbiAocCkge1xuXHQgKiAgICAgcmV0dXJuIC0oTWF0aC5jb3MoTWF0aC5QSSAqIHApIC0gMSkgLyAyO1xuXHQgKiAgIH07XG5cdCAqIH07XG5cdCAqL1xuXHRnZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChwKSB7XG5cdFx0XHRyZXR1cm4gLShNYXRoLmNvcyhNYXRoLlBJICogcCkgLSAxKSAvIDI7XG5cdFx0fTtcblx0fSxcblxuXHRzdGVwOiBmdW5jdGlvbiAobm93KSB7XG5cdFx0aWYgKHRoaXMub3B0aW9ucy5mcmFtZVNraXApIHtcblx0XHRcdHZhciBkaWZmID0gdGhpcy50aW1lICE9IG51bGwgPyBub3cgLSB0aGlzLnRpbWUgOiAwO1xuXHRcdFx0dmFyIGZyYW1lcyA9IGRpZmYgLyB0aGlzLmZyYW1lSW50ZXJ2YWw7XG5cdFx0XHR0aGlzLnRpbWUgPSBub3c7XG5cdFx0XHR0aGlzLmZyYW1lICs9IGZyYW1lcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5mcmFtZSsrO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmZyYW1lIDwgdGhpcy5mcmFtZXMpIHtcblx0XHRcdHZhciBkZWx0YSA9IHRoaXMudHJhbnNpdGlvbih0aGlzLmZyYW1lIC8gdGhpcy5mcmFtZXMpO1xuXHRcdFx0dGhpcy5zZXQodGhpcy5jb21wdXRlKHRoaXMuZnJvbSwgdGhpcy50bywgZGVsdGEpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5mcmFtZSA9IHRoaXMuZnJhbWVzO1xuXHRcdFx0dGhpcy5zZXQodGhpcy5jb21wdXRlKHRoaXMuZnJvbSwgdGhpcy50bywgMSkpO1xuXHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDorr7nva7lvZPliY3liqjnlLvluKfnmoTov4fmuKHmlbDlgLxcblx0ICogQGludGVyZmFjZSBGeCNzZXRcblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBub3cg5b2T5YmN5Yqo55S75bin55qE6L+H5rih5pWw5YC8XG5cdCAqIEBleGFtcGxlXG5cdCAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcblx0ICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuXHQgKiBmeC5zZXQgPSBmdW5jdGlvbiAobm93KSB7XG5cdCAqICAgbm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gbm93ICsgJ3B4Jztcblx0ICogfTtcblx0ICovXG5cdHNldDogZnVuY3Rpb24gKG5vdykge1xuXHRcdHJldHVybiBub3c7XG5cdH0sXG5cblx0Y29tcHV0ZTogZnVuY3Rpb24gKGZyb20sIHRvLCBkZWx0YSkge1xuXHRcdHJldHVybiBGeC5jb21wdXRlKGZyb20sIHRvLCBkZWx0YSk7XG5cdH0sXG5cblx0Y2hlY2s6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoIXRoaXMuaXNSdW5uaW5nKCkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAodGhpcy5vcHRpb25zLmxpbmsgPT09ICdjYW5jZWwnKSB7XG5cdFx0XHR0aGlzLmNhbmNlbCgpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXHQvKipcblx0ICog5byA5aeL5omn6KGM5Yqo55S7XG5cdCAqIEBtZXRob2QgRngjc3RhcnRcblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tIOWKqOeUu+W8gOWni+aVsOWAvFxuXHQgKiBAcGFyYW0ge051bWJlcn0gdG8g5Yqo55S757uT5p2f5pWw5YC8XG5cdCAqIEBleGFtcGxlXG5cdCAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcblx0ICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuXHQgKiBmeC5zdGFydCgpOyAvLyDlvIDlp4vliqjnlLtcblx0ICovXG5cdHN0YXJ0OiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0XHRpZiAoIXRoaXMuY2hlY2soZnJvbSwgdG8pKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0dGhpcy5mcm9tID0gZnJvbTtcblx0XHR0aGlzLnRvID0gdG87XG5cdFx0dGhpcy5mcmFtZSA9IHRoaXMub3B0aW9ucy5mcmFtZVNraXAgPyAwIDogLTE7XG5cdFx0dGhpcy50aW1lID0gbnVsbDtcblx0XHR0aGlzLnRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24oKTtcblx0XHR2YXIgZnJhbWVzID0gdGhpcy5vcHRpb25zLmZyYW1lcztcblx0XHR2YXIgZnBzID0gdGhpcy5vcHRpb25zLmZwcztcblx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLm9wdGlvbnMuZHVyYXRpb247XG5cdFx0dGhpcy5kdXJhdGlvbiA9IEZ4LkR1cmF0aW9uc1tkdXJhdGlvbl0gfHwgcGFyc2VJbnQoZHVyYXRpb24sIDEwKSB8fCAwO1xuXHRcdHRoaXMuZnJhbWVJbnRlcnZhbCA9IDEwMDAgLyBmcHM7XG5cdFx0dGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgTWF0aC5yb3VuZCh0aGlzLmR1cmF0aW9uIC8gdGhpcy5mcmFtZUludGVydmFsKTtcblx0XHR0aGlzLnRyaWdnZXIoJ3N0YXJ0Jyk7XG5cdFx0cHVzaEluc3RhbmNlLmNhbGwodGhpcywgZnBzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICog5YGc5q2i5Yqo55S7XG5cdCAqIEBtZXRob2QgRngjc3RvcFxuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQGV4YW1wbGVcblx0ICogdmFyICRmeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9meCcpO1xuXHQgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG5cdCAqIGZ4LnN0YXJ0KCk7XG5cdCAqIGZ4LnN0b3AoKTsgLy8g56uL5Yi75YGc5q2i5Yqo55S7XG5cdCAqL1xuXHRzdG9wOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcblx0XHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0XHRwdWxsSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcblx0XHRcdGlmICh0aGlzLmZyYW1lcyA9PT0gdGhpcy5mcmFtZSkge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NvbXBsZXRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3N0b3AnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOWPlua2iOWKqOeUu1xuXHQgKiBAbWV0aG9kIEZ4I2NhbmNlbFxuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQGV4YW1wbGVcblx0ICogdmFyICRmeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9meCcpO1xuXHQgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG5cdCAqIGZ4LnN0YXJ0KCk7XG5cdCAqIGZ4LmNhbmNlbCgpOyAvLyDnq4vliLvlj5bmtojliqjnlLtcblx0ICovXG5cdGNhbmNlbDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmlzUnVubmluZygpKSB7XG5cdFx0XHR0aGlzLnRpbWUgPSBudWxsO1xuXHRcdFx0cHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG5cdFx0XHR0aGlzLmZyYW1lID0gdGhpcy5mcmFtZXM7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NhbmNlbCcpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICog5pqC5YGc5Yqo55S7XG5cdCAqIEBtZXRob2QgRngjcGF1c2Vcblx0ICogQG1lbWJlcm9mIEZ4XG5cdCAqIEBleGFtcGxlXG5cdCAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcblx0ICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuXHQgKiBmeC5zdGFydCgpO1xuXHQgKiBmeC5wYXVzZSgpOyAvLyDnq4vliLvmmoLlgZzliqjnlLtcblx0ICovXG5cdHBhdXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcblx0XHRcdHRoaXMudGltZSA9IG51bGw7XG5cdFx0XHRwdWxsSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOe7p+e7reaJp+ihjOWKqOeUu1xuXHQgKiBAbWV0aG9kIEZ4I3Jlc3VtZVxuXHQgKiBAbWVtYmVyb2YgRnhcblx0ICogQGV4YW1wbGVcblx0ICogdmFyICRmeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9meCcpO1xuXHQgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG5cdCAqIGZ4LnN0YXJ0KCk7XG5cdCAqIGZ4LnBhdXNlKCk7XG5cdCAqIGZ4LnJlc3VtZSgpOyAvLyDnq4vliLvnu6fnu63liqjnlLtcblx0ICovXG5cdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmZyYW1lIDwgdGhpcy5mcmFtZXMgJiYgIXRoaXMuaXNSdW5uaW5nKCkpIHtcblx0XHRcdHB1c2hJbnN0YW5jZS5jYWxsKHRoaXMsIHRoaXMub3B0aW9ucy5mcHMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICog5Yik5pat5Yqo55S75piv5ZCm5q2j5Zyo6L+Q6KGMXG5cdCAqIEBtZXRob2QgRngjaXNSdW5uaW5nXG5cdCAqIEBtZW1iZXJvZiBGeFxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Yqo55S75piv5ZCm5q2j5Zyo6L+Q6KGMXG5cdCAqIEBleGFtcGxlXG5cdCAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcblx0ICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuXHQgKiBmeC5zdGFydCgpO1xuXHQgKiBmeC5wYXVzZSgpO1xuXHQgKiBmeC5pc1J1bm5pbmcoKTsgLy8gZmFsc2Vcblx0ICovXG5cdGlzUnVubmluZzogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBsaXN0ID0gaW5zdGFuY2VzW3RoaXMub3B0aW9ucy5mcHNdO1xuXHRcdHJldHVybiBsaXN0ICYmICRjb250YWlucyhsaXN0LCB0aGlzKTtcblx0fVxufSk7XG5cbiRldmVudHMubWl4VG8oRngpO1xuXG5GeC5jb21wdXRlID0gZnVuY3Rpb24gKGZyb20sIHRvLCBkZWx0YSkge1xuXHRyZXR1cm4gKHRvIC0gZnJvbSkgKiBkZWx0YSArIGZyb207XG59O1xuXG5GeC5EdXJhdGlvbnMgPSB7IHNob3J0OiAyNTAsIG5vcm1hbDogNTAwLCBsb25nOiAxMDAwIH07XG5cbm1vZHVsZS5leHBvcnRzID0gRng7XG4iLCIvKipcbiAqICMg5Yqo55S75Lqk5LqS55u45YWz5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9meFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZnhcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZnguc21vb3RoU2Nyb2xsVG8pO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvZnhcbiAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngnKTtcbiAqIGNvbnNvbGUuaW5mbygkZnguc21vb3RoU2Nyb2xsVG8pO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRzbW9vdGhTY3JvbGxUbyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9zbW9vdGhTY3JvbGxUbycpO1xuICovXG5cbmV4cG9ydHMuZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcnKTtcbmV4cG9ydHMuZmxhc2hBY3Rpb24gPSByZXF1aXJlKCcuL2ZsYXNoQWN0aW9uJyk7XG5leHBvcnRzLkZ4ID0gcmVxdWlyZSgnLi9meCcpO1xuZXhwb3J0cy5zbW9vdGhTY3JvbGxUbyA9IHJlcXVpcmUoJy4vc21vb3RoU2Nyb2xsVG8nKTtcbmV4cG9ydHMuc3RpY2t5ID0gcmVxdWlyZSgnLi9zdGlja3knKTtcbmV4cG9ydHMudGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJyk7XG5leHBvcnRzLnRyYW5zaXRpb25zID0gcmVxdWlyZSgnLi90cmFuc2l0aW9ucycpO1xuIiwiLyoqXG4gKiDlubPmu5Hmu5rliqjliLDmn5DkuKrlhYPntKDvvIzlj6rov5vooYzlnoLnm7TmlrnlkJHnmoTmu5rliqhcbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAbWV0aG9kIHNtb290aFNjcm9sbFRvXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnm67moIdET03lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOmAiemhuVxuICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVjLmRlbHRhPTBdIOebruagh+a7muWKqOS9jee9ruS4juebruagh+WFg+e0oOmhtumDqOeahOmXtOi3ne+8jOWPr+S7peS4uui0n+WAvFxuICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVjLm1heERlbGF5PTMwMDBdIOWKqOeUu+aJp+ihjOaXtumXtOmZkOWItihtcynvvIzliqjnlLvmiafooYzotoXov4fmraTml7bpl7TliJnnm7TmjqXlgZzmraLvvIznq4vliLvmu5rliqjliLDnm67moIfkvY3nva5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmNhbGxiYWNrXSDmu5rliqjlrozmiJDnmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3Ntb290aFNjcm9sbFRvJyk7XG4gKiAvLyDmu5rliqjliLDpobXpnaLpobbnq69cbiAqICRzbW9vdGhTY3JvbGxUbyhkb2N1bWVudC5ib2R5KTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxuZnVuY3Rpb24gc21vb3RoU2Nyb2xsVG8gKG5vZGUsIHNwZWMpIHtcblx0dmFyICQgPSB3aW5kb3cuJCB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcblxuXHR2YXIgY29uZiA9ICRhc3NpZ24oXG5cdFx0e1xuXHRcdFx0ZGVsdGE6IDAsXG5cdFx0XHRtYXhEZWxheTogMzAwMCxcblx0XHRcdGNhbGxiYWNrOiBudWxsXG5cdFx0fSxcblx0XHRzcGVjXG5cdCk7XG5cblx0dmFyIG9mZnNldCA9ICQobm9kZSkub2Zmc2V0KCk7XG5cdHZhciB0YXJnZXQgPSBvZmZzZXQudG9wICsgY29uZi5kZWx0YTtcblx0dmFyIGNhbGxiYWNrID0gY29uZi5jYWxsYmFjaztcblxuXHR2YXIgcHJldlN0ZXA7XG5cdHZhciBzdGF5Q291bnQgPSAzO1xuXG5cdHZhciB0aW1lciA9IG51bGw7XG5cblx0dmFyIHN0b3BUaW1lciA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGltZXIpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGltZXIpO1xuXHRcdFx0dGltZXIgPSBudWxsO1xuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIHRhcmdldCk7XG5cdFx0XHRpZiAoJC5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHR2YXIgZGVsdGEgPSBzVG9wIC0gdGFyZ2V0O1xuXHRcdGlmIChkZWx0YSA+IDApIHtcblx0XHRcdGRlbHRhID0gTWF0aC5mbG9vcihkZWx0YSAqIDAuOCk7XG5cdFx0fSBlbHNlIGlmIChkZWx0YSA8IDApIHtcblx0XHRcdGRlbHRhID0gTWF0aC5jZWlsKGRlbHRhICogMC44KTtcblx0XHR9XG5cblx0XHR2YXIgc3RlcCA9IHRhcmdldCArIGRlbHRhO1xuXHRcdGlmIChzdGVwID09PSBwcmV2U3RlcCkge1xuXHRcdFx0c3RheUNvdW50LS07XG5cdFx0fVxuXHRcdHByZXZTdGVwID0gc3RlcDtcblxuXHRcdHdpbmRvdy5zY3JvbGxUbygwLCBzdGVwKTtcblxuXHRcdGlmIChzdGVwID09PSB0YXJnZXQgfHwgc3RheUNvdW50IDw9IDApIHtcblx0XHRcdHN0b3BUaW1lcigpO1xuXHRcdH1cblx0fSwgMTYpO1xuXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdHN0b3BUaW1lcigpO1xuXHR9LCBjb25mLm1heERlbGF5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzbW9vdGhTY3JvbGxUbztcbiIsIi8qKlxuICogSU9TIHN0aWNreSDmlYjmnpwgcG9seWZpbGxcbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnm67moIdET03lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jbG9uZT10cnVlXSDmmK/lkKbliJvlu7rkuIDkuKogY2xvbmUg5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucGxhY2Vob2xkZXI9bnVsbF0gc3RpY2t5IOaViOaenOWQr+WKqOaXtueahOWNoOS9jSBkb20g5YWD57SgXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmRpc2FibGVBbmRyb2lkPWZhbHNlXSDmmK/lkKblnKggQW5kcm9pZCDkuIvlgZznlKggc3RpY2t5IOaViOaenFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9mZnNldFBhcmVudD1udWxsXSDmj5DkvpvkuIDkuKrnm7jlr7nlrprkvY3lhYPntKDmnaXljLnphY3mta7liqjml7bnmoTlrprkvY3moLflvI9cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdHlsZXM9e31dIOi/m+WFpSBzdGlja3kg54q25oCB5pe255qE5qC35byPXG4gKiBAZXhhbXBsZVxuICogdmFyICRzdGlja3kgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvc3RpY2t5Jyk7XG4gKiAkc3RpY2t5KCQoJ2gxJykuZ2V0KDApKTtcbiAqL1xuXG5mdW5jdGlvbiBzdGlja3kobm9kZSwgb3B0aW9ucykge1xuXHR2YXIgJCA9IHdpbmRvdy4kIHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5O1xuXG5cdHZhciAkd2luID0gJCh3aW5kb3cpO1xuXHR2YXIgJGRvYyA9ICQoZG9jdW1lbnQpO1xuXG5cdHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cdHZhciBpc0lPUyA9ICEhdWEubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC9pKTtcblx0dmFyIGlzQW5kcm9pZCA9IHVhLmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHVhLmluZGV4T2YoJ0xpbnV4JykgPiAtMTtcblxuXHR2YXIgdGhhdCA9IHt9O1xuXHR0aGF0LmlzSU9TID0gaXNJT1M7XG5cdHRoYXQuaXNBbmRyb2lkID0gaXNBbmRyb2lkO1xuXG5cdHZhciBjb25mID0gJC5leHRlbmQoXG5cdFx0e1xuXHRcdFx0Y2xvbmU6IHRydWUsXG5cdFx0XHRwbGFjZWhvbGRlcjogbnVsbCxcblx0XHRcdGRpc2FibGVBbmRyb2lkOiBmYWxzZSxcblx0XHRcdG9mZnNldFBhcmVudDogbnVsbCxcblx0XHRcdHN0eWxlczoge31cblx0XHR9LFxuXHRcdG9wdGlvbnNcblx0KTtcblxuXHR0aGF0LnJvb3QgPSAkKG5vZGUpO1xuXG5cdGlmICghdGhhdC5yb290LmdldCgwKSkgeyByZXR1cm47IH1cblx0dGhhdC5vZmZzZXRQYXJlbnQgPSB0aGF0LnJvb3Qub2Zmc2V0UGFyZW50KCk7XG5cblx0aWYgKGNvbmYub2Zmc2V0UGFyZW50KSB7XG5cdFx0dGhhdC5vZmZzZXRQYXJlbnQgPSAkKGNvbmYub2Zmc2V0UGFyZW50KTtcblx0fVxuXG5cdGlmICghdGhhdC5vZmZzZXRQYXJlbnRbMF0pIHtcblx0XHR0aGF0Lm9mZnNldFBhcmVudCA9ICQoZG9jdW1lbnQuYm9keSk7XG5cdH1cblxuXHR0aGF0LmlzU3RpY2t5ID0gZmFsc2U7XG5cblx0aWYgKGNvbmYucGxhY2Vob2xkZXIpIHtcblx0XHR0aGF0LnBsYWNlaG9sZGVyID0gJChjb25mLnBsYWNlaG9sZGVyKTtcblx0fSBlbHNlIHtcblx0XHR0aGF0LnBsYWNlaG9sZGVyID0gJCgnPGRpdi8+Jyk7XG5cdH1cblxuXHRpZiAoY29uZi5jbG9uZSkge1xuXHRcdHRoYXQuY2xvbmUgPSB0aGF0LnJvb3QuY2xvbmUoKTtcblx0XHR0aGF0LmNsb25lLmFwcGVuZFRvKHRoYXQucGxhY2Vob2xkZXIpO1xuXHR9XG5cblx0dGhhdC5wbGFjZWhvbGRlci5jc3Moe1xuXHRcdHZpc2liaWxpdHk6ICdoaWRkZW4nXG5cdH0pO1xuXG5cdHRoYXQuc3RpY2t5ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCF0aGF0LmlzU3RpY2t5KSB7XG5cdFx0XHR0aGF0LmlzU3RpY2t5ID0gdHJ1ZTtcblx0XHRcdHRoYXQucm9vdC5jc3MoJ3Bvc2l0aW9uJywgJ2ZpeGVkJyk7XG5cdFx0XHR0aGF0LnJvb3QuY3NzKGNvbmYuc3R5bGVzKTtcblx0XHRcdHRoYXQucGxhY2Vob2xkZXIuaW5zZXJ0QmVmb3JlKHRoYXQucm9vdCk7XG5cdFx0fVxuXHR9O1xuXG5cdHRoYXQudW5TdGlja3kgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhhdC5pc1N0aWNreSkge1xuXHRcdFx0dGhhdC5pc1N0aWNreSA9IGZhbHNlO1xuXHRcdFx0dGhhdC5wbGFjZWhvbGRlci5yZW1vdmUoKTtcblx0XHRcdHRoYXQucm9vdC5jc3MoJ3Bvc2l0aW9uJywgJycpO1xuXHRcdFx0JC5lYWNoKGNvbmYuc3R5bGVzLCBmdW5jdGlvbihrZXkpIHtcblx0XHRcdFx0dGhhdC5yb290LmNzcyhrZXksICcnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgb3JpZ09mZnNldFkgPSB0aGF0LnJvb3QuZ2V0KDApLm9mZnNldFRvcDtcblx0dGhhdC5jaGVja1Njcm9sbFkgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIXRoYXQuaXNTdGlja3kpIHtcblx0XHRcdG9yaWdPZmZzZXRZID0gdGhhdC5yb290LmdldCgwKS5vZmZzZXRUb3A7XG5cdFx0fVxuXG5cdFx0dmFyIHNjcm9sbFkgPSAwO1xuXHRcdGlmICh0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkgPT09IGRvY3VtZW50LmJvZHkpIHtcblx0XHRcdHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2Nyb2xsWSA9IHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKS5zY3JvbGxUb3A7XG5cdFx0fVxuXG5cdFx0aWYgKHNjcm9sbFkgPiBvcmlnT2Zmc2V0WSkge1xuXHRcdFx0dGhhdC5zdGlja3koKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhhdC51blN0aWNreSgpO1xuXHRcdH1cblxuXHRcdGlmICh0aGF0LmlzU3RpY2t5KSB7XG5cdFx0XHR0aGF0LnJvb3QuY3NzKHtcblx0XHRcdFx0J3dpZHRoJzogdGhhdC5wbGFjZWhvbGRlci53aWR0aCgpICsgJ3B4J1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoYXQucm9vdC5jc3Moe1xuXHRcdFx0XHQnd2lkdGgnOiAnJ1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdHRoYXQuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChpc0FuZHJvaWQgJiYgY29uZi5kaXNhYmxlQW5kcm9pZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoaXNJT1MgJiYgdGhhdC5vZmZzZXRQYXJlbnQuZ2V0KDApID09PSBkb2N1bWVudC5ib2R5KSB7XG5cdFx0XHQvLyBJT1M5KyDmlK/mjIEgcG9zaXRpb246c3RpY2t5IOWxnuaAp1xuXHRcdFx0dGhhdC5yb290LmNzcygncG9zaXRpb24nLCAnc3RpY2t5Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIOS4gOiIrOa1j+iniOWZqOebtOaOpeaUr+aMgVxuXHRcdFx0aWYgKHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKSA9PT0gZG9jdW1lbnQuYm9keSkge1xuXHRcdFx0XHQkd2luLm9uKCdzY3JvbGwnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGF0Lm9mZnNldFBhcmVudC5vbignc2Nyb2xsJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuXHRcdFx0fVxuXG5cdFx0XHQkd2luLm9uKCdyZXNpemUnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG5cdFx0XHQkZG9jLm9uKCd0b3VjaHN0YXJ0JywgdGhhdC5jaGVja1Njcm9sbFkpO1xuXHRcdFx0JGRvYy5vbigndG91Y2htb3ZlJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuXHRcdFx0JGRvYy5vbigndG91Y2hlbmQnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG5cdFx0XHR0aGF0LmNoZWNrU2Nyb2xsWSgpO1xuXHRcdH1cblx0fTtcblxuXHR0aGF0LmluaXQoKTtcblx0cmV0dXJuIHRoYXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RpY2t5O1xuIiwiLyoqXG4gKiDnlKggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOWMheijheWumuaXtuWZqFxuICogLSDlpoLmnpzmtY/op4jlmajkuI3mlK/mjIEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEFQSe+8jOWImeS9v+eUqCBCT00g5Y6f5pys55qE5a6a5pe25ZmoQVBJXG4gKiBAbW9kdWxlIHRpbWVyXG4gKiBAZXhhbXBsZVxuICogdmFyICR0aW1lciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC90aW1lcicpO1xuICogJHRpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICogICBjb25zb2xlLmluZm8oJ291dHB1dCB0aGlzIGxvZyBhZnRlciAxMDAwbXMnKTtcbiAqIH0sIDEwMDApO1xuICovXG5cbnZhciBUaW1lciA9IHt9O1xuXG52YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbmZ1bmN0aW9uIGZhY3RvcnkobWV0aG9kTmFtZSkge1xuXHR2YXIgd3JhcHBlZE1ldGhvZCA9IG51bGw7XG5cblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdHZhciB3aW4gPSB3aW5kb3c7XG5cblx0Ly8g5aaC5p6c5pyJ5a+55bqU5ZCN56ew55qE5pa55rOV77yM55u05o6l6L+U5Zue6K+l5pa55rOV77yM5ZCm5YiZ6L+U5Zue5bim5pyJ5a+55bqU5rWP6KeI5Zmo5YmN57yA55qE5pa55rOVXG5cdHZhciBnZXRQcmVmaXhNZXRob2QgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0dmFyIHVwRmlyc3ROYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpO1xuXHRcdHZhciBtZXRob2QgPSB3aW5bbmFtZV1cblx0XHRcdHx8IHdpblsnd2Via2l0JyArIHVwRmlyc3ROYW1lXVxuXHRcdFx0fHwgd2luWydtb3onICsgdXBGaXJzdE5hbWVdXG5cdFx0XHR8fCB3aW5bJ28nICsgdXBGaXJzdE5hbWVdXG5cdFx0XHR8fCB3aW5bJ21zJyArIHVwRmlyc3ROYW1lXTtcblx0XHRpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIG1ldGhvZC5iaW5kKHdpbik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBnZXRQcmVmaXhNZXRob2QoJ3JlcXVlc3RBbmltYXRpb25GcmFtZScpO1xuXHR2YXIgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSA9IGdldFByZWZpeE1ldGhvZCgnY2FuY2VsQW5pbWF0aW9uRnJhbWUnKSB8fCBub29wO1xuXG5cdGlmIChsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuXHRcdHZhciBjbGVhclRpbWVyID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0XHRpZiAob2JqLnJlcXVlc3RJZCAmJiB0eXBlb2Ygb2JqLnN0ZXAgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0b2JqLnN0ZXAgPSBub29wO1xuXHRcdFx0XHRsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lKG9iai5yZXF1ZXN0SWQpO1xuXHRcdFx0XHRvYmoucmVxdWVzdElkID0gMDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIHNldFRpbWVyID0gZnVuY3Rpb24oZm4sIGRlbGF5LCB0eXBlKSB7XG5cdFx0XHR2YXIgb2JqID0ge307XG5cdFx0XHR2YXIgdGltZSA9IERhdGUubm93KCk7XG5cdFx0XHRkZWxheSA9IGRlbGF5IHx8IDA7XG5cdFx0XHRkZWxheSA9IE1hdGgubWF4KGRlbGF5LCAwKTtcblx0XHRcdG9iai5zdGVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRpZiAobm93IC0gdGltZSA+IGRlbGF5KSB7XG5cdFx0XHRcdFx0Zm4oKTtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3RpbWVvdXQnKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVyKG9iaik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRpbWUgPSBub3c7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdG9iai5yZXF1ZXN0SWQgPSBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZShvYmouc3RlcCk7XG5cdFx0XHR9O1xuXHRcdFx0bG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUob2JqLnN0ZXApO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9O1xuXG5cdFx0aWYgKG1ldGhvZE5hbWUgPT09ICdzZXRJbnRlcnZhbCcpIHtcblx0XHRcdHdyYXBwZWRNZXRob2QgPSBmdW5jdGlvbihmbiwgZGVsYXkpIHtcblx0XHRcdFx0cmV0dXJuIHNldFRpbWVyKGZuLCBkZWxheSwgJ2ludGVydmFsJyk7XG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAobWV0aG9kTmFtZSA9PT0gJ3NldFRpbWVvdXQnKSB7XG5cdFx0XHR3cmFwcGVkTWV0aG9kID0gZnVuY3Rpb24oZm4sIGRlbGF5KSB7XG5cdFx0XHRcdHJldHVybiBzZXRUaW1lcihmbiwgZGVsYXksICd0aW1lb3V0Jyk7XG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAobWV0aG9kTmFtZSA9PT0gJ2NsZWFyVGltZW91dCcpIHtcblx0XHRcdHdyYXBwZWRNZXRob2QgPSBjbGVhclRpbWVyO1xuXHRcdH0gZWxzZSBpZiAobWV0aG9kTmFtZSA9PT0gJ2NsZWFySW50ZXJ2YWwnKSB7XG5cdFx0XHR3cmFwcGVkTWV0aG9kID0gY2xlYXJUaW1lcjtcblx0XHR9XG5cdH1cblxuXHRpZiAoIXdyYXBwZWRNZXRob2QgJiYgdGhpc1ttZXRob2ROYW1lXSkge1xuXHRcdHdyYXBwZWRNZXRob2QgPSB0aGlzW21ldGhvZE5hbWVdLmJpbmQodGhpcyk7XG5cdH1cblxuXHRyZXR1cm4gd3JhcHBlZE1ldGhvZDtcbn1cblxuLyoqXG4gKiDorr7nva7ph43lpI3osIPnlKjlrprml7blmahcbiAqIEBtZXRob2QgdGltZXIuc2V0SW50ZXJ2YWxcbiAqIEBtZW1iZXJvZiB0aW1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g5a6a5pe26YeN5aSN6LCD55So55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbGF5PTBdIOmHjeWkjeiwg+eUqOeahOmXtOmalOaXtumXtChtcylcbiAqIEByZXR1cm5zIHtPYmplY3R9IOWumuaXtuWZqOWvueixoe+8jOWPr+S8oOWFpSBjbGVhckludGVydmFsIOaWueazleadpee7iOatoui/meS4quWumuaXtuWZqFxuICovXG5UaW1lci5zZXRJbnRlcnZhbCA9IGZhY3RvcnkoJ3NldEludGVydmFsJyk7XG5cbi8qKlxuICog5riF6Zmk6YeN5aSN6LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyLmNsZWFySW50ZXJ2YWxcbiAqIEBtZW1iZXJvZiB0aW1lclxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDlrprml7blmajlr7nosaFcbiAqL1xuVGltZXIuY2xlYXJJbnRlcnZhbCA9IGZhY3RvcnkoJ2NsZWFySW50ZXJ2YWwnKTtcblxuLyoqXG4gKiDorr7nva7lu7bml7bosIPnlKjlrprml7blmahcbiAqIEBtZXRob2QgdGltZXIuc2V0VGltZW91dFxuICogQG1lbWJlcm9mIHRpbWVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDlu7bml7bosIPnlKjnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF0g5bu25pe26LCD55So55qE6Ze06ZqU5pe26Ze0KG1zKVxuICogQHJldHVybnMge09iamVjdH0g5a6a5pe25Zmo5a+56LGh77yM5Y+v5Lyg5YWlIGNsZWFyVGltZW91dCDmlrnms5XmnaXnu4jmraLov5nkuKrlrprml7blmahcbiAqL1xuVGltZXIuc2V0VGltZW91dCA9IGZhY3RvcnkoJ3NldFRpbWVvdXQnKTtcblxuLyoqXG4gKiDmuIXpmaTlu7bml7bosIPnlKjlrprml7blmahcbiAqIEBtZXRob2QgdGltZXIuY2xlYXJUaW1lb3V0XG4gKiBAbWVtYmVyb2YgdGltZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog5a6a5pe25Zmo5a+56LGhXG4gKi9cblRpbWVyLmNsZWFyVGltZW91dCA9IGZhY3RvcnkoJ2NsZWFyVGltZW91dCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWl4ZWQtb3BlcmF0b3JzICovXG4vKipcbiAqIOWKqOeUu+i/kOihjOaWueW8j+W6k1xuICogLSBQb3dcbiAqIC0gRXhwb1xuICogLSBDaXJjXG4gKiAtIFNpbmVcbiAqIC0gQmFja1xuICogLSBCb3VuY2VcbiAqIC0gRWxhc3RpY1xuICogLSBRdWFkXG4gKiAtIEN1YmljXG4gKiAtIFF1YXJ0XG4gKiAtIFF1aW50XG4gKiBAbW9kdWxlIHRyYW5zaXRpb25zXG4gKiBAc2VlIGh0dHBzOi8vbW9vdG9vbHMubmV0L2NvcmUvZG9jcy8xLjYuMC9GeC9GeC5UcmFuc2l0aW9ucyNGeC1UcmFuc2l0aW9uc1xuICogQGV4YW1wbGVcbiAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcbiAqIHZhciAkdHJhbnNpdGlvbnMgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvdHJhbnNpdGlvbnMnKTtcbiAqIG5ldyAkZngoe1xuICogICB0cmFuc2l0aW9uIDogJHRyYW5zaXRpb25zLlNpbmUuZWFzZUluT3V0XG4gKiB9KTtcbiAqIG5ldyAkZngoe1xuICogICB0cmFuc2l0aW9uIDogJ1NpbmU6SW4nXG4gKiB9KTtcbiAqIG5ldyAkZngoe1xuICogICB0cmFuc2l0aW9uIDogJ1NpbmU6SW46T3V0J1xuICogfSk7XG4gKi9cblxudmFyICR0eXBlID0gcmVxdWlyZSgnLi4vb2JqL3R5cGUnKTtcbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG52YXIgJGZ4ID0gcmVxdWlyZSgnLi9meCcpO1xuXG4kZnguVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb24sIHBhcmFtcykge1xuXHRpZiAoJHR5cGUocGFyYW1zKSAhPT0gJ2FycmF5Jykge1xuXHRcdHBhcmFtcyA9IFtwYXJhbXNdO1xuXHR9XG5cdHZhciBlYXNlSW4gPSBmdW5jdGlvbihwb3MpIHtcblx0XHRyZXR1cm4gdHJhbnNpdGlvbihwb3MsIHBhcmFtcyk7XG5cdH07XG5cdHJldHVybiAkYXNzaWduKGVhc2VJbiwge1xuXHRcdGVhc2VJbjogZWFzZUluLFxuXHRcdGVhc2VPdXQ6IGZ1bmN0aW9uKHBvcykge1xuXHRcdFx0cmV0dXJuIDEgLSB0cmFuc2l0aW9uKDEgLSBwb3MsIHBhcmFtcyk7XG5cdFx0fSxcblx0XHRlYXNlSW5PdXQ6IGZ1bmN0aW9uKHBvcykge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0KHBvcyA8PSAwLjVcblx0XHRcdFx0XHQ/IHRyYW5zaXRpb24oMiAqIHBvcywgcGFyYW1zKVxuXHRcdFx0XHRcdDogMiAtIHRyYW5zaXRpb24oMiAqICgxIC0gcG9zKSwgcGFyYW1zKSkgLyAyXG5cdFx0XHQpO1xuXHRcdH1cblx0fSk7XG59O1xuXG52YXIgVHJhbnNpdGlvbnMgPSB7XG5cdGxpbmVhcjogZnVuY3Rpb24oemVybykge1xuXHRcdHJldHVybiB6ZXJvO1xuXHR9XG59O1xuXG5UcmFuc2l0aW9ucy5leHRlbmQgPSBmdW5jdGlvbih0cmFuc2l0aW9ucykge1xuXHRPYmplY3Qua2V5cyh0cmFuc2l0aW9ucykuZm9yRWFjaChmdW5jdGlvbih0cmFuc2l0aW9uKSB7XG5cdFx0VHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0gPSBuZXcgJGZ4LlRyYW5zaXRpb24odHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0pO1xuXHR9KTtcbn07XG5cblRyYW5zaXRpb25zLmV4dGVuZCh7XG5cdFBvdzogZnVuY3Rpb24ocCwgeCkge1xuXHRcdHJldHVybiBNYXRoLnBvdyhwLCAoeCAmJiB4WzBdKSB8fCA2KTtcblx0fSxcblxuXHRFeHBvOiBmdW5jdGlvbihwKSB7XG5cdFx0cmV0dXJuIE1hdGgucG93KDIsIDggKiAocCAtIDEpKTtcblx0fSxcblxuXHRDaXJjOiBmdW5jdGlvbihwKSB7XG5cdFx0cmV0dXJuIDEgLSBNYXRoLnNpbihNYXRoLmFjb3MocCkpO1xuXHR9LFxuXG5cdFNpbmU6IGZ1bmN0aW9uKHApIHtcblx0XHRyZXR1cm4gMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJIC8gMik7XG5cdH0sXG5cblx0QmFjazogZnVuY3Rpb24ocCwgeCkge1xuXHRcdHggPSAoeCAmJiB4WzBdKSB8fCAxLjYxODtcblx0XHRyZXR1cm4gTWF0aC5wb3cocCwgMikgKiAoKHggKyAxKSAqIHAgLSB4KTtcblx0fSxcblxuXHRCb3VuY2U6IGZ1bmN0aW9uKHApIHtcblx0XHR2YXIgdmFsdWU7XG5cdFx0dmFyIGEgPSAwO1xuXHRcdHZhciBiID0gMTtcblx0XHR3aGlsZSAocCA8ICg3IC0gNCAqIGEpIC8gMTEpIHtcblx0XHRcdHZhbHVlID0gYiAqIGIgLSBNYXRoLnBvdygoMTEgLSA2ICogYSAtIDExICogcCkgLyA0LCAyKTtcblx0XHRcdGEgKz0gYjtcblx0XHRcdGIgLz0gMjtcblx0XHR9XG5cdFx0dmFsdWUgPSBiICogYiAtIE1hdGgucG93KCgxMSAtIDYgKiBhIC0gMTEgKiBwKSAvIDQsIDIpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fSxcblxuXHRFbGFzdGljOiBmdW5jdGlvbihwLCB4KSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdE1hdGgucG93KDIsIDEwICogLS1wKVxuXHRcdFx0KiBNYXRoLmNvcygyMCAqIHAgKiBNYXRoLlBJICogKCh4ICYmIHhbMF0pIHx8IDEpIC8gMylcblx0XHQpO1xuXHR9XG59KTtcblxuWydRdWFkJywgJ0N1YmljJywgJ1F1YXJ0JywgJ1F1aW50J10uZm9yRWFjaChmdW5jdGlvbih0cmFuc2l0aW9uLCBpKSB7XG5cdFRyYW5zaXRpb25zW3RyYW5zaXRpb25dID0gbmV3ICRmeC5UcmFuc2l0aW9uKGZ1bmN0aW9uKHApIHtcblx0XHRyZXR1cm4gTWF0aC5wb3cocCwgaSArIDIpO1xuXHR9KTtcbn0pO1xuXG4kZnguc3RhdGljcyh7XG5cdGdldFRyYW5zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0cmFucyA9IHRoaXMub3B0aW9ucy50cmFuc2l0aW9uIHx8IFRyYW5zaXRpb25zLlNpbmUuZWFzZUluT3V0O1xuXHRcdGlmICh0eXBlb2YgdHJhbnMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR2YXIgZGF0YSA9IHRyYW5zLnNwbGl0KCc6Jyk7XG5cdFx0XHR0cmFucyA9IFRyYW5zaXRpb25zO1xuXHRcdFx0dHJhbnMgPSB0cmFuc1tkYXRhWzBdXSB8fCB0cmFuc1tkYXRhWzBdXTtcblx0XHRcdGlmIChkYXRhWzFdKSB7XG5cdFx0XHRcdHRyYW5zID0gdHJhbnNbJ2Vhc2UnICsgZGF0YVsxXSArIChkYXRhWzJdID8gZGF0YVsyXSA6ICcnKV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0cmFucztcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbnM7XG4iLCIvKipcbiAqIGFqYXgg6K+35rGC5pa55rOV77yM5L2/55So5pa55byP5LiOIGpRdWVyeSwgWmVwdG8g57G75Ly877yM5a+5IGpRdWVyeSwgWmVwdG8g5peg5L6d6LWWXG4gKiBAbWV0aG9kIGFqYXhcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0ZvcmJlc0xpbmRlc2F5L2FqYXhcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGFqYXggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8vYWpheCcpO1xuICogZG9jdW1lbnQuZG9tYWluID0gJ3FxLmNvbSc7XG4gKiAkYWpheCh7XG4gKiAgIHVybDogJ2h0dHA6Ly9hLnFxLmNvbS9mb3JtJyxcbiAqICAgZGF0YTogW3tcbiAqICAgICBuMTogJ3YxJyxcbiAqICAgICBuMjogJ3YyJ1xuICogICB9XSxcbiAqICAgc3VjY2VzczogZnVuY3Rpb24gKHJzKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKHJzKTtcbiAqICAgfVxuICogfSk7XG4gKi9cblxudmFyIHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpXG5cbnZhciBqc29ucElEID0gMCxcbiAgICBrZXksXG4gICAgbmFtZSxcbiAgICByc2NyaXB0ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2ksXG4gICAgc2NyaXB0VHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL2phdmFzY3JpcHQvaSxcbiAgICB4bWxUeXBlUkUgPSAvXig/OnRleHR8YXBwbGljYXRpb24pXFwveG1sL2ksXG4gICAganNvblR5cGUgPSAnYXBwbGljYXRpb24vanNvbicsXG4gICAgaHRtbFR5cGUgPSAndGV4dC9odG1sJyxcbiAgICBibGFua1JFID0gL15cXHMqJC9cblxudmFyIGFqYXggPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICB2YXIgc2V0dGluZ3MgPSBleHRlbmQoe30sIG9wdGlvbnMgfHwge30pXG4gIGZvciAoa2V5IGluIGFqYXguc2V0dGluZ3MpIGlmIChzZXR0aW5nc1trZXldID09PSB1bmRlZmluZWQpIHNldHRpbmdzW2tleV0gPSBhamF4LnNldHRpbmdzW2tleV1cblxuICBhamF4U3RhcnQoc2V0dGluZ3MpXG5cbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikgc2V0dGluZ3MuY3Jvc3NEb21haW4gPSAvXihbXFx3LV0rOik/XFwvXFwvKFteXFwvXSspLy50ZXN0KHNldHRpbmdzLnVybCkgJiZcbiAgICBSZWdFeHAuJDIgIT0gd2luZG93LmxvY2F0aW9uLmhvc3RcblxuICB2YXIgZGF0YVR5cGUgPSBzZXR0aW5ncy5kYXRhVHlwZSwgaGFzUGxhY2Vob2xkZXIgPSAvPVxcPy8udGVzdChzZXR0aW5ncy51cmwpXG4gIGlmIChkYXRhVHlwZSA9PSAnanNvbnAnIHx8IGhhc1BsYWNlaG9sZGVyKSB7XG4gICAgaWYgKCFoYXNQbGFjZWhvbGRlcikgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLCAnY2FsbGJhY2s9PycpXG4gICAgcmV0dXJuIGFqYXguSlNPTlAoc2V0dGluZ3MpXG4gIH1cblxuICBpZiAoIXNldHRpbmdzLnVybCkgc2V0dGluZ3MudXJsID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcbiAgc2VyaWFsaXplRGF0YShzZXR0aW5ncylcblxuICB2YXIgbWltZSA9IHNldHRpbmdzLmFjY2VwdHNbZGF0YVR5cGVdLFxuICAgICAgYmFzZUhlYWRlcnMgPSB7IH0sXG4gICAgICBwcm90b2NvbCA9IC9eKFtcXHctXSs6KVxcL1xcLy8udGVzdChzZXR0aW5ncy51cmwpID8gUmVnRXhwLiQxIDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sLFxuICAgICAgeGhyID0gYWpheC5zZXR0aW5ncy54aHIoKSwgYWJvcnRUaW1lb3V0XG5cbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikgYmFzZUhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXSA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgaWYgKG1pbWUpIHtcbiAgICBiYXNlSGVhZGVyc1snQWNjZXB0J10gPSBtaW1lXG4gICAgaWYgKG1pbWUuaW5kZXhPZignLCcpID4gLTEpIG1pbWUgPSBtaW1lLnNwbGl0KCcsJywgMilbMF1cbiAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSAmJiB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lKVxuICB9XG4gIGlmIChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAoc2V0dGluZ3MuZGF0YSAmJiBzZXR0aW5ncy50eXBlLnRvVXBwZXJDYXNlKCkgIT0gJ0dFVCcpKVxuICAgIGJhc2VIZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgc2V0dGluZ3MuaGVhZGVycyA9IGV4dGVuZChiYXNlSGVhZGVycywgc2V0dGluZ3MuaGVhZGVycyB8fCB7fSlcblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGFib3J0VGltZW91dClcbiAgICAgIHZhciByZXN1bHQsIGVycm9yID0gZmFsc2VcbiAgICAgIGlmICgoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgfHwgeGhyLnN0YXR1cyA9PSAzMDQgfHwgKHhoci5zdGF0dXMgPT0gMCAmJiBwcm90b2NvbCA9PSAnZmlsZTonKSkge1xuICAgICAgICBkYXRhVHlwZSA9IGRhdGFUeXBlIHx8IG1pbWVUb0RhdGFUeXBlKHhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJykpXG4gICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChkYXRhVHlwZSA9PSAnc2NyaXB0JykgICAgKDEsZXZhbCkocmVzdWx0KVxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICd4bWwnKSAgcmVzdWx0ID0geGhyLnJlc3BvbnNlWE1MXG4gICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT0gJ2pzb24nKSByZXN1bHQgPSBibGFua1JFLnRlc3QocmVzdWx0KSA/IG51bGwgOiBKU09OLnBhcnNlKHJlc3VsdClcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBlcnJvciA9IGUgfVxuXG4gICAgICAgIGlmIChlcnJvcikgYWpheEVycm9yKGVycm9yLCAncGFyc2VyZXJyb3InLCB4aHIsIHNldHRpbmdzKVxuICAgICAgICBlbHNlIGFqYXhTdWNjZXNzKHJlc3VsdCwgeGhyLCBzZXR0aW5ncylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFqYXhFcnJvcihudWxsLCAnZXJyb3InLCB4aHIsIHNldHRpbmdzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBhc3luYyA9ICdhc3luYycgaW4gc2V0dGluZ3MgPyBzZXR0aW5ncy5hc3luYyA6IHRydWVcbiAgeGhyLm9wZW4oc2V0dGluZ3MudHlwZSwgc2V0dGluZ3MudXJsLCBhc3luYylcblxuICBmb3IgKG5hbWUgaW4gc2V0dGluZ3MuaGVhZGVycykgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgc2V0dGluZ3MuaGVhZGVyc1tuYW1lXSlcblxuICBpZiAoYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlKSB7XG4gICAgeGhyLmFib3J0KClcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmIChzZXR0aW5ncy50aW1lb3V0ID4gMCkgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGVtcHR5XG4gICAgICB4aHIuYWJvcnQoKVxuICAgICAgYWpheEVycm9yKG51bGwsICd0aW1lb3V0JywgeGhyLCBzZXR0aW5ncylcbiAgICB9LCBzZXR0aW5ncy50aW1lb3V0KVxuXG4gIC8vIGF2b2lkIHNlbmRpbmcgZW1wdHkgc3RyaW5nICgjMzE5KVxuICB4aHIuc2VuZChzZXR0aW5ncy5kYXRhID8gc2V0dGluZ3MuZGF0YSA6IG51bGwpXG4gIHJldHVybiB4aHJcbn1cblxuXG4vLyB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IGFuZCByZXR1cm4gZmFsc2UgaWYgaXQgd2FzIGNhbmNlbGxlZFxuZnVuY3Rpb24gdHJpZ2dlckFuZFJldHVybihjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcbiAgLy90b2RvOiBGaXJlIG9mZiBzb21lIGV2ZW50c1xuICAvL3ZhciBldmVudCA9ICQuRXZlbnQoZXZlbnROYW1lKVxuICAvLyQoY29udGV4dCkudHJpZ2dlcihldmVudCwgZGF0YSlcbiAgcmV0dXJuIHRydWU7Ly8hZXZlbnQuZGVmYXVsdFByZXZlbnRlZFxufVxuXG4vLyB0cmlnZ2VyIGFuIEFqYXggXCJnbG9iYWxcIiBldmVudFxuZnVuY3Rpb24gdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwpIHJldHVybiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQgfHwgZG9jdW1lbnQsIGV2ZW50TmFtZSwgZGF0YSlcbn1cblxuLy8gTnVtYmVyIG9mIGFjdGl2ZSBBamF4IHJlcXVlc3RzXG5hamF4LmFjdGl2ZSA9IDBcblxuZnVuY3Rpb24gYWpheFN0YXJ0KHNldHRpbmdzKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwgJiYgYWpheC5hY3RpdmUrKyA9PT0gMCkgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgbnVsbCwgJ2FqYXhTdGFydCcpXG59XG5mdW5jdGlvbiBhamF4U3RvcChzZXR0aW5ncykge1xuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmICEoLS1hamF4LmFjdGl2ZSkpIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RvcCcpXG59XG5cbi8vIHRyaWdnZXJzIGFuIGV4dHJhIGdsb2JhbCBldmVudCBcImFqYXhCZWZvcmVTZW5kXCIgdGhhdCdzIGxpa2UgXCJhamF4U2VuZFwiIGJ1dCBjYW5jZWxhYmxlXG5mdW5jdGlvbiBhamF4QmVmb3JlU2VuZCh4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICBpZiAoc2V0dGluZ3MuYmVmb3JlU2VuZC5jYWxsKGNvbnRleHQsIHhociwgc2V0dGluZ3MpID09PSBmYWxzZSB8fFxuICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhCZWZvcmVTZW5kJywgW3hociwgc2V0dGluZ3NdKSA9PT0gZmFsc2UpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTZW5kJywgW3hociwgc2V0dGluZ3NdKVxufVxuZnVuY3Rpb24gYWpheFN1Y2Nlc3MoZGF0YSwgeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHQsIHN0YXR1cyA9ICdzdWNjZXNzJ1xuICBzZXR0aW5ncy5zdWNjZXNzLmNhbGwoY29udGV4dCwgZGF0YSwgc3RhdHVzLCB4aHIpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4U3VjY2VzcycsIFt4aHIsIHNldHRpbmdzLCBkYXRhXSlcbiAgYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncylcbn1cbi8vIHR5cGU6IFwidGltZW91dFwiLCBcImVycm9yXCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXG5mdW5jdGlvbiBhamF4RXJyb3IoZXJyb3IsIHR5cGUsIHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIHNldHRpbmdzLmVycm9yLmNhbGwoY29udGV4dCwgeGhyLCB0eXBlLCBlcnJvcilcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhFcnJvcicsIFt4aHIsIHNldHRpbmdzLCBlcnJvcl0pXG4gIGFqYXhDb21wbGV0ZSh0eXBlLCB4aHIsIHNldHRpbmdzKVxufVxuLy8gc3RhdHVzOiBcInN1Y2Nlc3NcIiwgXCJub3Rtb2RpZmllZFwiLCBcImVycm9yXCIsIFwidGltZW91dFwiLCBcImFib3J0XCIsIFwicGFyc2VyZXJyb3JcIlxuZnVuY3Rpb24gYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgc2V0dGluZ3MuY29tcGxldGUuY2FsbChjb250ZXh0LCB4aHIsIHN0YXR1cylcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhDb21wbGV0ZScsIFt4aHIsIHNldHRpbmdzXSlcbiAgYWpheFN0b3Aoc2V0dGluZ3MpXG59XG5cbi8vIEVtcHR5IGZ1bmN0aW9uLCB1c2VkIGFzIGRlZmF1bHQgY2FsbGJhY2tcbmZ1bmN0aW9uIGVtcHR5KCkge31cblxuYWpheC5KU09OUCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICBpZiAoISgndHlwZScgaW4gb3B0aW9ucykpIHJldHVybiBhamF4KG9wdGlvbnMpXG5cbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdqc29ucCcgKyAoKytqc29ucElEKSxcbiAgICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSxcbiAgICBhYm9ydCA9IGZ1bmN0aW9uKCl7XG4gICAgICAvL3RvZG86IHJlbW92ZSBzY3JpcHRcbiAgICAgIC8vJChzY3JpcHQpLnJlbW92ZSgpXG4gICAgICBpZiAoY2FsbGJhY2tOYW1lIGluIHdpbmRvdykgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBlbXB0eVxuICAgICAgYWpheENvbXBsZXRlKCdhYm9ydCcsIHhociwgb3B0aW9ucylcbiAgICB9LFxuICAgIHhociA9IHsgYWJvcnQ6IGFib3J0IH0sIGFib3J0VGltZW91dCxcbiAgICBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdXG4gICAgICB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblxuICBpZiAob3B0aW9ucy5lcnJvcikgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB4aHIuYWJvcnQoKVxuICAgIG9wdGlvbnMuZXJyb3IoKVxuICB9XG5cbiAgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKXtcbiAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxuICAgICAgLy90b2RvOiByZW1vdmUgc2NyaXB0XG4gICAgICAvLyQoc2NyaXB0KS5yZW1vdmUoKVxuICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tOYW1lXVxuICAgIGFqYXhTdWNjZXNzKGRhdGEsIHhociwgb3B0aW9ucylcbiAgfVxuXG4gIHNlcmlhbGl6ZURhdGEob3B0aW9ucylcbiAgc2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsLnJlcGxhY2UoLz1cXD8vLCAnPScgKyBjYWxsYmFja05hbWUpXG5cbiAgLy8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkIHRvIGNpcmN1bXZlbnQgYW4gSUU2IGJ1Zy5cbiAgLy8gVGhpcyBhcmlzZXMgd2hlbiBhIGJhc2Ugbm9kZSBpcyB1c2VkIChzZWUgalF1ZXJ5IGJ1Z3MgIzI3MDkgYW5kICM0Mzc4KS5cbiAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQpO1xuXG4gIGlmIChvcHRpb25zLnRpbWVvdXQgPiAwKSBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgICAgYWpheENvbXBsZXRlKCd0aW1lb3V0JywgeGhyLCBvcHRpb25zKVxuICAgIH0sIG9wdGlvbnMudGltZW91dClcblxuICByZXR1cm4geGhyXG59XG5cbmFqYXguc2V0dGluZ3MgPSB7XG4gIC8vIERlZmF1bHQgdHlwZSBvZiByZXF1ZXN0XG4gIHR5cGU6ICdHRVQnLFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGJlZm9yZSByZXF1ZXN0XG4gIGJlZm9yZVNlbmQ6IGVtcHR5LFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXG4gIHN1Y2Nlc3M6IGVtcHR5LFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIHRoZSB0aGUgc2VydmVyIGRyb3BzIGVycm9yXG4gIGVycm9yOiBlbXB0eSxcbiAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBvbiByZXF1ZXN0IGNvbXBsZXRlIChib3RoOiBlcnJvciBhbmQgc3VjY2VzcylcbiAgY29tcGxldGU6IGVtcHR5LFxuICAvLyBUaGUgY29udGV4dCBmb3IgdGhlIGNhbGxiYWNrc1xuICBjb250ZXh0OiBudWxsLFxuICAvLyBXaGV0aGVyIHRvIHRyaWdnZXIgXCJnbG9iYWxcIiBBamF4IGV2ZW50c1xuICBnbG9iYWw6IHRydWUsXG4gIC8vIFRyYW5zcG9ydFxuICB4aHI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG4gIH0sXG4gIC8vIE1JTUUgdHlwZXMgbWFwcGluZ1xuICBhY2NlcHRzOiB7XG4gICAgc2NyaXB0OiAndGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcbiAgICBqc29uOiAgIGpzb25UeXBlLFxuICAgIHhtbDogICAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnLFxuICAgIGh0bWw6ICAgaHRtbFR5cGUsXG4gICAgdGV4dDogICAndGV4dC9wbGFpbidcbiAgfSxcbiAgLy8gV2hldGhlciB0aGUgcmVxdWVzdCBpcyB0byBhbm90aGVyIGRvbWFpblxuICBjcm9zc0RvbWFpbjogZmFsc2UsXG4gIC8vIERlZmF1bHQgdGltZW91dFxuICB0aW1lb3V0OiAwXG59XG5cbmZ1bmN0aW9uIG1pbWVUb0RhdGFUeXBlKG1pbWUpIHtcbiAgcmV0dXJuIG1pbWUgJiYgKCBtaW1lID09IGh0bWxUeXBlID8gJ2h0bWwnIDpcbiAgICBtaW1lID09IGpzb25UeXBlID8gJ2pzb24nIDpcbiAgICBzY3JpcHRUeXBlUkUudGVzdChtaW1lKSA/ICdzY3JpcHQnIDpcbiAgICB4bWxUeXBlUkUudGVzdChtaW1lKSAmJiAneG1sJyApIHx8ICd0ZXh0J1xufVxuXG5mdW5jdGlvbiBhcHBlbmRRdWVyeSh1cmwsIHF1ZXJ5KSB7XG4gIHJldHVybiAodXJsICsgJyYnICsgcXVlcnkpLnJlcGxhY2UoL1smP117MSwyfS8sICc/Jylcbn1cblxuLy8gc2VyaWFsaXplIHBheWxvYWQgYW5kIGFwcGVuZCBpdCB0byB0aGUgVVJMIGZvciBHRVQgcmVxdWVzdHNcbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuICBpZiAodHlwZShvcHRpb25zLmRhdGEpID09PSAnb2JqZWN0Jykgb3B0aW9ucy5kYXRhID0gcGFyYW0ob3B0aW9ucy5kYXRhKVxuICBpZiAob3B0aW9ucy5kYXRhICYmICghb3B0aW9ucy50eXBlIHx8IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpID09ICdHRVQnKSlcbiAgICBvcHRpb25zLnVybCA9IGFwcGVuZFF1ZXJ5KG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEpXG59XG5cbmFqYXguZ2V0ID0gZnVuY3Rpb24odXJsLCBzdWNjZXNzKXsgcmV0dXJuIGFqYXgoeyB1cmw6IHVybCwgc3VjY2Vzczogc3VjY2VzcyB9KSB9XG5cbmFqYXgucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUpe1xuICBpZiAodHlwZShkYXRhKSA9PT0gJ2Z1bmN0aW9uJykgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBzdWNjZXNzLCBzdWNjZXNzID0gZGF0YSwgZGF0YSA9IG51bGxcbiAgcmV0dXJuIGFqYXgoeyB0eXBlOiAnUE9TVCcsIHVybDogdXJsLCBkYXRhOiBkYXRhLCBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhVHlwZTogZGF0YVR5cGUgfSlcbn1cblxuYWpheC5nZXRKU09OID0gZnVuY3Rpb24odXJsLCBzdWNjZXNzKXtcbiAgcmV0dXJuIGFqYXgoeyB1cmw6IHVybCwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6ICdqc29uJyB9KVxufVxuXG52YXIgZXNjYXBlID0gZW5jb2RlVVJJQ29tcG9uZW50XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwsIHNjb3BlKXtcbiAgdmFyIGFycmF5ID0gdHlwZShvYmopID09PSAnYXJyYXknO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICBpZiAoc2NvcGUpIGtleSA9IHRyYWRpdGlvbmFsID8gc2NvcGUgOiBzY29wZSArICdbJyArIChhcnJheSA/ICcnIDoga2V5KSArICddJ1xuICAgIC8vIGhhbmRsZSBkYXRhIGluIHNlcmlhbGl6ZUFycmF5KCkgZm9ybWF0XG4gICAgaWYgKCFzY29wZSAmJiBhcnJheSkgcGFyYW1zLmFkZCh2YWx1ZS5uYW1lLCB2YWx1ZS52YWx1ZSlcbiAgICAvLyByZWN1cnNlIGludG8gbmVzdGVkIG9iamVjdHNcbiAgICBlbHNlIGlmICh0cmFkaXRpb25hbCA/ICh0eXBlKHZhbHVlKSA9PT0gJ2FycmF5JykgOiAodHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnKSlcbiAgICAgIHNlcmlhbGl6ZShwYXJhbXMsIHZhbHVlLCB0cmFkaXRpb25hbCwga2V5KVxuICAgIGVsc2UgcGFyYW1zLmFkZChrZXksIHZhbHVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhcmFtKG9iaiwgdHJhZGl0aW9uYWwpe1xuICB2YXIgcGFyYW1zID0gW11cbiAgcGFyYW1zLmFkZCA9IGZ1bmN0aW9uKGssIHYpeyB0aGlzLnB1c2goZXNjYXBlKGspICsgJz0nICsgZXNjYXBlKHYpKSB9XG4gIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwpXG4gIHJldHVybiBwYXJhbXMuam9pbignJicpLnJlcGxhY2UoJyUyMCcsICcrJylcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4gIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIGZvciAoa2V5IGluIHNvdXJjZSlcbiAgICAgIGlmIChzb3VyY2Vba2V5XSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gIH0pXG4gIHJldHVybiB0YXJnZXRcbn1cbiIsIi8qKlxuICog5Yqg6L29IHNjcmlwdCDmlofku7ZcbiAqIEBtZXRob2QgZ2V0U2NyaXB0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDpgInpoblcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnNyYyBzY3JpcHQg5Zyw5Z2AXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2hhcnNldD0ndXRmLTgnXSBzY3JpcHQg57yW56CBXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkxvYWRdIHNjcmlwdCDliqDovb3lrozmiJDnmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFNjcmlwdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9nZXRTY3JpcHQnKTtcbiAqICRnZXRTY3JpcHQoe1xuICogICBzcmM6ICdodHRwczovL2NvZGUuanF1ZXJ5LmNvbS9qcXVlcnktMy4zLjEubWluLmpzJyxcbiAqICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKHdpbmRvdy5qUXVlcnkpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG5mdW5jdGlvbiBnZXRTY3JpcHQob3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHR2YXIgc3JjID0gb3B0aW9ucy5zcmMgfHwgJyc7XG5cdHZhciBjaGFyc2V0ID0gb3B0aW9ucy5jaGFyc2V0IHx8ICcnO1xuXHR2YXIgb25Mb2FkID0gb3B0aW9ucy5vbkxvYWQgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdHNjcmlwdC5hc3luYyA9ICdhc3luYyc7XG5cdHNjcmlwdC5zcmMgPSBzcmM7XG5cblx0aWYgKGNoYXJzZXQpIHtcblx0XHRzY3JpcHQuY2hhcnNldCA9IGNoYXJzZXQ7XG5cdH1cblx0c2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChcblx0XHRcdCF0aGlzLnJlYWR5U3RhdGVcblx0XHRcdHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCdcblx0XHRcdHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuXHRcdCkge1xuXHRcdFx0aWYgKHR5cGVvZiBvbkxvYWQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0b25Mb2FkKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm9ubG9hZCA9IG51bGw7XG5cdFx0XHR0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHR0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG5cdFx0fVxuXHR9O1xuXHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXHRyZXR1cm4gc2NyaXB0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFNjcmlwdDtcbiIsIi8qKlxuICog5bCB6KOFIGlmcmFtZSBwb3N0IOaooeW8j1xuICogLSByZXF1aXJlcyBqUXVlcnkvWmVwdG9cbiAqIEBtZXRob2QgaWZyYW1lUG9zdFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6K+35rGC6YCJ6aG5XG4gKiBAcGFyYW0ge09iamVjdH0gW3NwZWMuZm9ybT1udWxsXSDopoHor7fmsYLnmoTooajljZVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnVybCDor7fmsYLlnLDlnYBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBzcGVjLmRhdGEg6K+35rGC5pWw5o2uXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMudGFyZ2V0PScnXSDnm67moIcgaWZyYW1lIOWQjeensFxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLm1ldGhvZD0ncG9zdCddIOivt+axguaWueW8j1xuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmFjY2VwdENoYXJzZXQ9JyddIOivt+axguebruagh+eahOe8lueggVxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmpzb25wPSdjYWxsYmFjayddIOS8oOmAkue7meaOpeWPo+eahOWbnuiwg+WPguaVsOWQjeensFxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmpzb25wTWV0aG9kPScnXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlj4LmlbDnmoTkvKDpgJLmlrnlvI/vvIzlj6/pgIlbJ3Bvc3QnLCAnZ2V0J11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucENhbGxiYWNrPScnXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlh73mlbDlkI3np7DvvIzpu5jorqToh6rliqjnlJ/miJBcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucEFkZFBhcmVudD0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Ye95pWw5ZCN56ew6ZyA6KaB6ZmE5bim55qE5YmN57yA6LCD55So6Lev5b6EXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5jb21wbGV0ZV0g6I635b6X5pWw5o2u55qE5Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5zdWNjZXNzXSDmiJDlip/ojrflvpfmlbDmja7nmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGlmcmFtZVBvc3QgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8vaWZyYW1lUG9zdCcpO1xuICogZG9jdW1lbnQuZG9tYWluID0gJ3FxLmNvbSc7XG4gKiBpZnJhbWVQb3N0KHtcbiAqICAgdXJsOiAnaHR0cDovL2EucXEuY29tL2Zvcm0nLFxuICogICBkYXRhOiBbe1xuICogICAgIG4xOiAndjEnLFxuICogICAgIG4yOiAndjInXG4gKiAgIH1dLFxuICogICBzdWNjZXNzOiBmdW5jdGlvbiAocnMpIHtcbiAqICAgICBjb25zb2xlLmluZm8ocnMpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgaGlkZGVuRGl2ID0gbnVsbDtcblxuZnVuY3Rpb24gZ2V0JCAoKSB7XG5cdHZhciAkO1xuXHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQkID0gd2luZG93LiQgfHwgd2luZG93LmpRdWVyeSB8fCB3aW5kb3cuWmVwdG87XG5cdH1cblx0aWYgKCEkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdOZWVkIHdpbmRkb3cuJCBsaWtlIGpRdWVyeSBvciBaZXB0by4nKTtcblx0fVxuXHRyZXR1cm4gJDtcbn1cblxuZnVuY3Rpb24gZ2V0SGlkZGVuQm94ICgpIHtcblx0dmFyICQgPSBnZXQkKCk7XG5cdGlmIChoaWRkZW5EaXYgPT09IG51bGwpIHtcblx0XHRoaWRkZW5EaXYgPSAkKCc8ZGl2Lz4nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdGhpZGRlbkRpdi5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0fVxuXHRyZXR1cm4gaGlkZGVuRGl2O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtICgpIHtcblx0dmFyICQgPSBnZXQkKCk7XG5cdHZhciBmb3JtID0gJCgnPGZvcm0gc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+PC9mb3JtPicpO1xuXHRmb3JtLmFwcGVuZFRvKGdldEhpZGRlbkJveCgpKTtcblx0cmV0dXJuIGZvcm07XG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlbklucHV0IChmb3JtLCBuYW1lKSB7XG5cdHZhciAkID0gZ2V0JCgpO1xuXHR2YXIgaW5wdXQgPSAkKGZvcm0pLmZpbmQoJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyk7XG5cdGlmICghaW5wdXQuZ2V0KDApKSB7XG5cdFx0aW5wdXQgPSAkKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInICsgbmFtZSArICdcIiB2YWx1ZT1cIlwiLz4nKTtcblx0XHRpbnB1dC5hcHBlbmRUbyhmb3JtKTtcblx0fVxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIGdldElmcmFtZSAobmFtZSkge1xuXHR2YXIgJCA9IGdldCQoKTtcblx0dmFyIGlmcmFtZSA9ICQoXG5cdFx0JzxpZnJhbWUgaWQ9XCInXG5cdFx0KyBuYW1lXG5cdFx0KyAnXCIgbmFtZT1cIidcblx0XHQrIG5hbWVcblx0XHQrICdcIiBzcmM9XCJhYm91dDpibGFua1wiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiPjwvaWZyYW1lPidcblx0KTtcblx0aWZyYW1lLmFwcGVuZFRvKGdldEhpZGRlbkJveCgpKTtcblx0cmV0dXJuIGlmcmFtZTtcbn1cblxuZnVuY3Rpb24gaWZyYW1lUG9zdCAoc3BlYykge1xuXHR2YXIgJCA9IGdldCQoKTtcblx0dmFyIGNvbmYgPSAkLmV4dGVuZCh7XG5cdFx0Zm9ybTogbnVsbCxcblx0XHR1cmw6ICcnLFxuXHRcdGRhdGE6IFtdLFxuXHRcdHRhcmdldDogJycsXG5cdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0YWNjZXB0Q2hhcnNldDogJycsXG5cdFx0anNvbnA6ICdjYWxsYmFjaycsXG5cdFx0anNvbnBNZXRob2Q6ICcnLFxuXHRcdGpzb25wQ2FsbGJhY2s6ICcnLFxuXHRcdGpzb25wQWRkUGFyZW50OiAnJyxcblx0XHRjb21wbGV0ZTogJC5ub29wLFxuXHRcdHN1Y2Nlc3M6ICQubm9vcFxuXHR9LCBzcGVjKTtcblxuXHR2YXIgdGhhdCA9IHt9O1xuXHR0aGF0LnVybCA9IGNvbmYudXJsO1xuXG5cdHRoYXQuanNvbnAgPSBjb25mLmpzb25wIHx8ICdjYWxsYmFjayc7XG5cdHRoYXQubWV0aG9kID0gY29uZi5tZXRob2QgfHwgJ3Bvc3QnO1xuXHR0aGF0Lmpzb25wTWV0aG9kID0gJC50eXBlKGNvbmYuanNvbnBNZXRob2QpID09PSAnc3RyaW5nJ1xuXHRcdD8gY29uZi5qc29ucE1ldGhvZC50b0xvd2VyQ2FzZSgpXG5cdFx0OiAnJztcblxuXHR2YXIgZm9ybSA9ICQoY29uZi5mb3JtKTtcblx0aWYgKCFmb3JtLmxlbmd0aCkge1xuXHRcdGZvcm0gPSBnZXRGb3JtKCk7XG5cblx0XHR2YXIgaHRtbCA9IFtdO1xuXHRcdGlmICgkLmlzQXJyYXkoY29uZi5kYXRhKSkge1xuXHRcdFx0JC5lYWNoKGNvbmYuZGF0YSwgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblx0XHRcdFx0aWYgKCFpdGVtKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGh0bWwucHVzaChcblx0XHRcdFx0XHQnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiJ1xuXHRcdFx0XHRcdCsgaXRlbS5uYW1lXG5cdFx0XHRcdFx0KyAnXCIgdmFsdWU9XCInXG5cdFx0XHRcdFx0KyBpdGVtLnZhbHVlXG5cdFx0XHRcdFx0KyAnXCI+J1xuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICgkLmlzUGxhaW5PYmplY3QoY29uZi5kYXRhKSkge1xuXHRcdFx0JC5lYWNoKGNvbmYuZGF0YSwgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0XHRcdFx0aHRtbC5wdXNoKFxuXHRcdFx0XHRcdCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInXG5cdFx0XHRcdFx0KyBuYW1lXG5cdFx0XHRcdFx0KyAnXCIgdmFsdWU9XCInXG5cdFx0XHRcdFx0KyB2YWx1ZVxuXHRcdFx0XHRcdCsgJ1wiPidcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQkKGh0bWwuam9pbignJykpLmFwcGVuZFRvKGZvcm0pO1xuXHR9XG5cdHRoYXQuZm9ybSA9IGZvcm07XG5cdHRoYXQuY29uZiA9IGNvbmY7XG5cblx0dmFyIHRpbWVTdGFtcCA9ICtuZXcgRGF0ZSgpO1xuXHR2YXIgaWZyYW1lTmFtZSA9ICdpZnJhbWUnICsgdGltZVN0YW1wO1xuXG5cdHRoYXQudGltZVN0YW1wID0gdGltZVN0YW1wO1xuXHR0aGF0LmlmcmFtZU5hbWUgPSBpZnJhbWVOYW1lO1xuXG5cdGlmIChjb25mLmFjY2VwdENoYXJzZXQpIHtcblx0XHRmb3JtLmF0dHIoJ2FjY2VwdC1jaGFyc2V0JywgY29uZi5hY2NlcHRDaGFyc2V0KTtcblx0XHR0aGF0LmFjY2VwdENoYXJzZXQgPSBjb25mLmFjY2VwdENoYXJzZXQ7XG5cdH1cblxuXHR2YXIgaWZyYW1lID0gbnVsbDtcblx0dmFyIHRhcmdldCA9ICcnO1xuXHRpZiAoY29uZi50YXJnZXQpIHtcblx0XHR0YXJnZXQgPSBjb25mLnRhcmdldDtcblx0XHRpZiAoWydfYmxhbmsnLCAnX3NlbGYnLCAnX3BhcmVudCcsICdfdG9wJ10uaW5kZXhPZihjb25mLnRhcmdldCkgPCAwKSB7XG5cdFx0XHRpZnJhbWUgPSAkKCdpZnJhbWVbbmFtZT1cIicgKyBjb25mLnRhcmdldCArICdcIl0nKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0dGFyZ2V0ID0gaWZyYW1lTmFtZTtcblx0XHRpZnJhbWUgPSBnZXRJZnJhbWUoaWZyYW1lTmFtZSk7XG5cdH1cblx0Zm9ybS5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpO1xuXHR0aGF0LnRhcmdldCA9IHRhcmdldDtcblx0dGhhdC5pZnJhbWUgPSBpZnJhbWU7XG5cblx0dmFyIGpzb25wQ2FsbGJhY2sgPSBjb25mLmpzb25wQ2FsbGJhY2sgfHwgJ2lmcmFtZUNhbGxiYWNrJyArIHRpbWVTdGFtcDtcblx0dGhhdC5qc29ucENhbGxiYWNrID0ganNvbnBDYWxsYmFjaztcblxuXHRpZiAoIXRoYXQuanNvbnBNZXRob2QgfHwgdGhhdC5qc29ucE1ldGhvZCA9PT0gJ3Bvc3QnKSB7XG5cdFx0dmFyIGlucHV0ID0gZ2V0SGlkZGVuSW5wdXQoZm9ybSwgdGhhdC5qc29ucCk7XG5cdFx0aW5wdXQudmFsKGNvbmYuanNvbnBBZGRQYXJlbnQgKyBqc29ucENhbGxiYWNrKTtcblx0fSBlbHNlIGlmICh0aGF0Lmpzb25wTWV0aG9kID09PSAnZ2V0Jykge1xuXHRcdHRoYXQudXJsID0gdGhhdC51cmxcblx0XHRcdCsgKHRoYXQudXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKVxuXHRcdFx0KyB0aGF0Lmpzb25wXG5cdFx0XHQrICc9J1xuXHRcdFx0KyBqc29ucENhbGxiYWNrO1xuXHR9XG5cblx0aWYgKCFjb25mLmpzb25wQ2FsbGJhY2spIHtcblx0XHR0aGF0LmNhbGxiYWNrID0gZnVuY3Rpb24ocnMpIHtcblx0XHRcdGlmICgkLmlzRnVuY3Rpb24oY29uZi5jb21wbGV0ZSkpIHtcblx0XHRcdFx0Y29uZi5jb21wbGV0ZShycywgdGhhdCwgJ3N1Y2Nlc3MnKTtcblx0XHRcdH1cblx0XHRcdGlmICgkLmlzRnVuY3Rpb24oY29uZi5zdWNjZXNzKSkge1xuXHRcdFx0XHRjb25mLnN1Y2Nlc3MocnMsIHRoYXQsICdzdWNjZXNzJyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR3aW5kb3dbanNvbnBDYWxsYmFja10gPSB0aGF0LmNhbGxiYWNrO1xuXHR9XG5cblx0Zm9ybS5hdHRyKHtcblx0XHRhY3Rpb246IHRoYXQudXJsLFxuXHRcdG1ldGhvZDogdGhhdC5tZXRob2Rcblx0fSk7XG5cblx0Zm9ybS5zdWJtaXQoKTtcblxuXHRyZXR1cm4gdGhhdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZnJhbWVQb3N0O1xuIiwiLyoqXG4gKiAjIOWkhOeQhue9kee7nOS6pOS6klxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvaW9cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2lvXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmlvLmdldFNjcmlwdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9pb1xuICogdmFyICRpbyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9pbycpO1xuICogY29uc29sZS5pbmZvKCRpby5nZXRTY3JpcHQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRnZXRTY3JpcHQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0Jyk7XG4gKi9cblxuZXhwb3J0cy5hamF4ID0gcmVxdWlyZSgnLi9hamF4Jyk7XG5leHBvcnRzLmdldFNjcmlwdCA9IHJlcXVpcmUoJy4vZ2V0U2NyaXB0Jyk7XG5leHBvcnRzLmlmcmFtZVBvc3QgPSByZXF1aXJlKCcuL2lmcmFtZVBvc3QnKTtcbmV4cG9ydHMubG9hZFNkayA9IHJlcXVpcmUoJy4vbG9hZFNkaycpO1xuIiwidmFyICRhc3NpZ24gPSByZXF1aXJlKCdsb2Rhc2gvYXNzaWduJyk7XG52YXIgJGdldCA9IHJlcXVpcmUoJ2xvZGFzaC9nZXQnKTtcbnZhciAkZ2V0U2NyaXB0ID0gcmVxdWlyZSgnLi9nZXRTY3JpcHQnKTtcblxudmFyIHByb3BOYW1lID0gJ1NQT1JFX1NES19QUk9NSVNFJztcbnZhciBjYWNoZSA9IG51bGw7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRjYWNoZSA9IHdpbmRvd1twcm9wTmFtZV07XG5cdGlmICghY2FjaGUpIHtcblx0XHRjYWNoZSA9IHt9O1xuXHRcdHdpbmRvd1twcm9wTmFtZV0gPSBjYWNoZTtcblx0fVxufSBlbHNlIHtcblx0Y2FjaGUgPSB7fTtcbn1cblxuLyoqXG4gKiBzZGsg5Yqg6L2957uf5LiA5bCB6KOFXG4gKiAtIOWkmuasoeiwg+eUqOS4jeS8muWPkei1t+mHjeWkjeivt+axglxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5uYW1lIHNkayDlhajlsYDlj5jph4/lkI3np7BcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCBzY3JpcHQg5Zyw5Z2AXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2hhcnNldD0ndXRmLTgnXSBzY3JpcHQg57yW56CBXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkxvYWRdIHNjcmlwdCDliqDovb3lrozmiJDnmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxvYWRTZGsgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8vbG9hZFNkaycpO1xuICogJGxvYWRTZGsoe1xuICogICBuYW1lOiAnVGVuY2VudENhcHRjaGEnLFxuICogICB1cmw6ICdodHRwczovL3NzbC5jYXB0Y2hhLnFxLmNvbS9UQ2FwdGNoYS5qcydcbiAqIH0pLnRoZW4oVGVuY2VudENhcHRjaGEgPT4ge30pXG4gKi9cbnZhciBsb2FkU2RrID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0dmFyIGNvbmYgPSAkYXNzaWduKHtcblx0XHRuYW1lOiAnJyxcblx0XHR1cmw6ICcnLFxuXHRcdGNoYXJzZXQ6ICd1dGYtOCdcblx0fSwgb3B0aW9ucyk7XG5cblx0dmFyIG5hbWUgPSBjb25mLm5hbWU7XG5cdGlmICghbmFtZSkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1JlcXVpcmUgcGFyYW1ldGVyOiBvcHRpb25zLm5hbWUnKSk7XG5cdH1cblx0aWYgKCFjb25mLnVybCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1JlcXVpcmUgcGFyYW1ldGVyOiBvcHRpb25zLnVybCcpKTtcblx0fVxuXG5cdHZhciBwbSA9IGNhY2hlW25hbWVdO1xuXHRpZiAocG0pIHtcblx0XHRpZiAocG0uc2RrKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBtLnNkayk7XG5cdFx0fVxuXHRcdHJldHVybiBwbTtcblx0fVxuXG5cdHBtID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHQkZ2V0U2NyaXB0KHtcblx0XHRcdHNyYzogY29uZi51cmwsXG5cdFx0XHRjaGFyc2V0OiBjb25mLmNoYXJzZXQsXG5cdFx0XHRvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHNkayA9ICRnZXQod2luZG93LCBuYW1lKTtcblx0XHRcdFx0cG0uc2RrID0gc2RrO1xuXHRcdFx0XHRyZXNvbHZlKHNkayk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHRjYWNoZVtuYW1lXSA9IHBtO1xuXG5cdHJldHVybiBwbTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZFNkaztcbiIsIi8qKlxuICog6Kej5p6QIGxvY2F0aW9uLnNlYXJjaCDkuLrkuIDkuKpKU09O5a+56LGhXG4gKiAtIOaIluiAheiOt+WPluWFtuS4reafkOS4quWPguaVsFxuICogQG1ldGhvZCBnZXRRdWVyeVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkzlrZfnrKbkuLJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIOWPguaVsOWQjeensFxuICogQHJldHVybnMge09iamVjdHxTdHJpbmd9IHF1ZXJ55a+56LGhIHwg5Y+C5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRRdWVyeSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9nZXRRdWVyeScpO1xuICogdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0L3Byb2ZpbGU/YmVpamluZz1odWFueWluZ25pJztcbiAqIGNvbnNvbGUuaW5mbyggJGdldFF1ZXJ5KHVybCkgKTtcbiAqIC8vIHtiZWlqaW5nIDogJ2h1YW55aW5nbmknfVxuICogY29uc29sZS5pbmZvKCAkZ2V0UXVlcnkodXJsLCAnYmVpamluZycpICk7XG4gKiAvLyAnaHVhbnlpbmduaSdcbiAqL1xuXG52YXIgY2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gZ2V0UXVlcnkodXJsLCBuYW1lKSB7XG5cdHZhciBxdWVyeSA9IGNhY2hlW3VybF0gfHwge307XG5cblx0aWYgKHVybCkge1xuXHRcdHZhciBzZWFyY2hJbmRleCA9IHVybC5pbmRleE9mKCc/Jyk7XG5cdFx0aWYgKHNlYXJjaEluZGV4ID49IDApIHtcblx0XHRcdHZhciBzZWFyY2ggPSB1cmwuc2xpY2Uoc2VhcmNoSW5kZXggKyAxLCB1cmwubGVuZ3RoKTtcblx0XHRcdHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKC8jLiovLCAnJyk7XG5cblx0XHRcdHZhciBwYXJhbXMgPSBzZWFyY2guc3BsaXQoJyYnKTtcblx0XHRcdHBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG5cdFx0XHRcdHZhciBlcXVhbEluZGV4ID0gZ3JvdXAuaW5kZXhPZignPScpO1xuXHRcdFx0XHRpZiAoZXF1YWxJbmRleCA+IDApIHtcblx0XHRcdFx0XHR2YXIga2V5ID0gZ3JvdXAuc2xpY2UoMCwgZXF1YWxJbmRleCk7XG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gZ3JvdXAuc2xpY2UoZXF1YWxJbmRleCArIDEsIGdyb3VwLmxlbmd0aCk7XG5cdFx0XHRcdFx0cXVlcnlba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y2FjaGVbdXJsXSA9IHF1ZXJ5O1xuXHR9XG5cblx0aWYgKCFuYW1lKSB7XG5cdFx0cmV0dXJuIHF1ZXJ5O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBxdWVyeVtuYW1lXSB8fCAnJztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFF1ZXJ5O1xuIiwiLyoqXG4gKiAjIOWkhOeQhuWcsOWdgOWtl+espuS4slxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2xvY2F0aW9uXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmxvY2F0aW9uLmdldFF1ZXJ5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uXG4gKiB2YXIgJGxvY2F0aW9uID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uJyk7XG4gKiBjb25zb2xlLmluZm8oJGxvY2F0aW9uLmdldFF1ZXJ5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZ2V0UXVlcnkgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vZ2V0UXVlcnknKTtcbiAqL1xuXG5leHBvcnRzLmdldFF1ZXJ5ID0gcmVxdWlyZSgnLi9nZXRRdWVyeScpO1xuZXhwb3J0cy5zZXRRdWVyeSA9IHJlcXVpcmUoJy4vc2V0UXVlcnknKTtcbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG4iLCIvKipcbiAqIOino+aekFVSTOS4uuS4gOS4quWvueixoVxuICogQG1ldGhvZCBwYXJzZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBVUkzlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVSTOWvueixoVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW5zaGlmdGlvL3VybC1wYXJzZVxuICogQGV4YW1wbGVcbiAqIHZhciAkcGFyc2UgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vcGFyc2UnKTtcbiAqICRwYXJzZSgnaHR0cDovL2xvY2FsaG9zdC9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSMxMjMnKTtcbiAqIC8vIHtcbiAqIC8vICAgc2xhc2hlczogdHJ1ZSxcbiAqIC8vICAgcHJvdG9jb2w6ICdodHRwOicsXG4gKiAvLyAgIGhhc2g6ICcjMTIzJyxcbiAqIC8vICAgcXVlcnk6ICc/YmVpamluZz1odWFueWluZ25pJyxcbiAqIC8vICAgcGF0aG5hbWU6ICcvcHJvZmlsZScsXG4gKiAvLyAgIGF1dGg6ICd1c2VybmFtZTpwYXNzd29yZCcsXG4gKiAvLyAgIGhvc3Q6ICdsb2NhbGhvc3Q6ODA4MCcsXG4gKiAvLyAgIHBvcnQ6ICc4MDgwJyxcbiAqIC8vICAgaG9zdG5hbWU6ICdsb2NhbGhvc3QnLFxuICogLy8gICBwYXNzd29yZDogJ3Bhc3N3b3JkJyxcbiAqIC8vICAgdXNlcm5hbWU6ICd1c2VybmFtZScsXG4gKiAvLyAgIG9yaWdpbjogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gKiAvLyAgIGhyZWY6ICdodHRwOi8vdXNlcm5hbWU6cGFzc3dvcmRAbG9jYWxob3N0OjgwODAvcHJvZmlsZT9iZWlqaW5nPWh1YW55aW5nbmkjMTIzJ1xuICogLy8gfVxuICovXG5cbnZhciBVcmwgPSByZXF1aXJlKCd1cmwtcGFyc2UnKTtcblxuZnVuY3Rpb24gcGFyc2UgKHVybCkge1xuXHRyZXR1cm4gbmV3IFVybCh1cmwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xuIiwiLyoqXG4gKiDlsIblj4LmlbDorr7nva7liLAgbG9jYXRpb24uc2VhcmNoIOS4ilxuICogQG1ldGhvZCBzZXRRdWVyeVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkzlrZfnrKbkuLJcbiAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeSDlj4LmlbDlr7nosaFcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOaLvOaOpeWlveWPguaVsOeahFVSTOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkc2V0UXVlcnkgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vc2V0UXVlcnknKTtcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0Jyk7IC8vICdsb2NhbGhvc3QnXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdCcsIHthOiAxfSk7IC8vICdsb2NhbGhvc3Q/YT0xJ1xuICogJHNldFF1ZXJ5KCcnLCB7YTogMX0pOyAvLyAnP2E9MSdcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHthOiAyfSk7IC8vICdsb2NhbGhvc3Q/YT0yJ1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2E6ICcnfSk7IC8vICdsb2NhbGhvc3Q/YT0nXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEnLCB7YTogbnVsbH0pOyAvLyAnbG9jYWxob3N0J1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2I6IDJ9KTsgLy8gJ2xvY2FsaG9zdD9hPTEmYj0yJ1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJmI9MScsIHthOiAyLCBiOiAzfSk7IC8vICdsb2NhbGhvc3Q/YT0yJmI9MydcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0I2E9MScsIHthOiAyLCBiOiAzfSk7IC8vICdsb2NhbGhvc3Q/YT0yJmI9MyNhPTEnXG4gKiAkc2V0UXVlcnkoJyNhPTEnLCB7YTogMiwgYjogM30pOyAvLyAnP2E9MiZiPTMjYT0xJ1xuICovXG5cbmZ1bmN0aW9uIHNldFF1ZXJ5ICh1cmwsIHF1ZXJ5KSB7XG5cdHVybCA9IHVybCB8fCAnJztcblx0aWYgKCFxdWVyeSkgeyByZXR1cm4gdXJsOyB9XG5cblx0dmFyIHJlZyA9IC8oW14/I10qKShcXD97MCwxfVtePyNdKikoI3swLDF9LiopLztcblx0cmV0dXJuIHVybC5yZXBsYWNlKHJlZywgZnVuY3Rpb24obWF0Y2gsIHBhdGgsIHNlYXJjaCwgaGFzaCkge1xuXHRcdHNlYXJjaCA9IHNlYXJjaCB8fCAnJztcblx0XHRzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKTtcblxuXHRcdHZhciBwYXJhID0gc2VhcmNoLnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uKG9iaiwgcGFpcikge1xuXHRcdFx0dmFyIGFyciA9IHBhaXIuc3BsaXQoJz0nKTtcblx0XHRcdGlmIChhcnJbMF0pIHtcblx0XHRcdFx0b2JqW2FyclswXV0gPSBhcnJbMV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0sIHt9KTtcblxuXHRcdE9iamVjdC5rZXlzKHF1ZXJ5KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0dmFyIHZhbHVlID0gcXVlcnlba2V5XTtcblx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRlbGV0ZSBwYXJhW2tleV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJhW2tleV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHZhciBwYXJhS2V5cyA9IE9iamVjdC5rZXlzKHBhcmEpO1xuXHRcdGlmICghcGFyYUtleXMubGVuZ3RoKSB7XG5cdFx0XHRzZWFyY2ggPSAnJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VhcmNoID0gJz8nICsgcGFyYUtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0XHRyZXR1cm4ga2V5ICsgJz0nICsgcGFyYVtrZXldO1xuXHRcdFx0fSkuam9pbignJicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXRoICsgc2VhcmNoICsgaGFzaDtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0UXVlcnk7XG4iLCIvKipcbiAqIOWfuuehgOW3peWOguWFg+S7tuexu1xuICogLSDor6Xnsbvmt7flkIjkuoYgc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMg55qE5pa55rOV44CCXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuICogQG1vZHVsZSBCYXNlXG4gKiBAZXhhbXBsZVxuICogdmFyICRiYXNlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL212Yy9iYXNlJyk7XG4gKlxuICogdmFyIENoaWxkQ2xhc3MgPSAkYmFzZS5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICBub2RlIDogbnVsbFxuICogICB9LFxuICogICBidWlsZCA6IGZ1bmN0aW9uKCkge1xuICogICAgIHRoaXMubm9kZSA9ICQodGhpcy5jb25mLm5vZGUpO1xuICogICB9LFxuICogICBzZXRFdmVudHMgOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAqICAgICB2YXIgcHJveHkgPSB0aGlzLnByb3h5KCk7XG4gKiAgICAgdGhpcy5ub2RlW2FjdGlvbl0oJ2NsaWNrJywgcHJveHkoJ29uY2xpY2snKSk7XG4gKiAgIH0sXG4gKiAgIG9uY2xpY2sgOiBmdW5jdGlvbigpIHtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NsaWNrZWQnKTtcbiAqICAgICB0aGlzLnRyaWdnZXIoJ2NsaWNrJyk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIHZhciBvYmogPSBuZXcgQ2hpbGRDbGFzcyh7XG4gKiAgIG5vZGUgOiBkb2N1bWVudC5ib2R5XG4gKiB9KTtcbiAqXG4gKiBvYmoub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnb2JqIGlzIGNsaWNrZWQnKTtcbiAqIH0pO1xuICovXG5cbnZhciAkbWVyZ2UgPSByZXF1aXJlKCdsb2Rhc2gvbWVyZ2UnKTtcbnZhciAkbm9vcCA9IHJlcXVpcmUoJ2xvZGFzaC9ub29wJyk7XG52YXIgJGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xudmFyICRldmVudHMgPSByZXF1aXJlKCcuLi9ldnQvZXZlbnRzJyk7XG52YXIgJGtsYXNzID0gcmVxdWlyZSgnLi9rbGFzcycpO1xudmFyICRwcm94eSA9IHJlcXVpcmUoJy4vcHJveHknKTtcblxudmFyIEJhc2UgPSAka2xhc3Moe1xuXHQvKipcblx0ICog57G755qE6buY6K6k6YCJ6aG55a+56LGh77yM57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGhXG5cdCAqIEBuYW1lIEJhc2UjZGVmYXVsdHNcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIEJhc2Vcblx0ICovXG5cdGRlZmF1bHRzOiB7fSxcblxuXHQvKipcblx0ICog57G755qE5a6e6ZmF6YCJ6aG577yMc2V0T3B0aW9ucyDmlrnms5XkvJrkv67mlLnov5nkuKrlr7nosaFcblx0ICogQG5hbWUgQmFzZSNjb25mXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqIEBtZW1iZXJvZiBCYXNlXG5cdCAqL1xuXG5cdC8qKlxuXHQgKiDlrZjmlL7ku6PnkIblh73mlbDnmoTpm4blkIhcblx0ICogQG5hbWUgQmFzZSNib3VuZFxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKi9cblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXHRcdHRoaXMuYnVpbGQoKTtcblx0XHR0aGlzLnNldEV2ZW50cygnb24nKTtcblx0fSxcblxuXHQvKipcblx0ICog5rex5bqm5re35ZCI5Lyg5YWl55qE6YCJ6aG55LiO6buY6K6k6YCJ6aG577yM5re35ZCI5a6M5oiQ55qE6YCJ6aG55a+56LGh5Y+v6YCa6L+HIHRoaXMuY29uZiDlsZ7mgKforr/pl65cblx0ICogQG1ldGhvZCBCYXNlI3NldE9wdGlvbnNcblx0ICogQG1lbWJlcm9mIEJhc2Vcblx0ICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcblx0ICovXG5cdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR0aGlzLmNvbmYgPSB0aGlzLmNvbmYgfHwgJG1lcmdlKHt9LCB0aGlzLmRlZmF1bHRzKTtcblx0XHRpZiAoISRpc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG5cdFx0XHRvcHRpb25zID0ge307XG5cdFx0fVxuXHRcdCRtZXJnZSh0aGlzLmNvbmYsIG9wdGlvbnMpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDlhYPku7bliJ3lp4vljJbmjqXlj6Plh73mlbDvvIzlrp7kvovljJblhYPku7bml7bkvJroh6rliqjpppblhYjosIPnlKhcblx0ICogQGFic3RyYWN0XG5cdCAqIEBtZXRob2QgQmFzZSNidWlsZFxuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKi9cblx0YnVpbGQ6ICRub29wLFxuXG5cdC8qKlxuXHQgKiDlhYPku7bkuovku7bnu5HlrprmjqXlj6Plh73mlbDvvIzlrp7kvovljJblhYPku7bml7bkvJroh6rliqjlnKggYnVpbGQg5LmL5ZCO6LCD55SoXG5cdCAqIEBtZXRob2QgQmFzZSNzZXRFdmVudHNcblx0ICogQG1lbWJlcm9mIEJhc2Vcblx0ICogQHBhcmFtIHtTdHJpbmd9IFthY3Rpb249J29uJ10g57uR5a6a5oiW6ICF56e76Zmk5LqL5Lu255qE5qCH6K6w77yM5Y+v6YCJ5YC85pyJ77yaWydvbicsICdvZmYnXVxuXHQgKi9cblx0c2V0RXZlbnRzOiAkbm9vcCxcblxuXHQvKipcblx0ICog5Ye95pWw5Luj55CG77yM56Gu5L+d5Ye95pWw5Zyo5b2T5YmN57G75Yib5bu655qE5a6e5L6L5LiK5LiL5paH5Lit5omn6KGM44CCXG5cdCAqIOi/meS6m+eUqOS6jue7keWumuS6i+S7tueahOS7o+eQhuWHveaVsOmDveaUvuWcqOWxnuaApyB0aGlzLmJvdW5kIOS4iuOAglxuXHQgKiBAbWV0aG9kIEJhc2UjcHJveHlcblx0ICogQG1lbWJlcm9mIEJhc2Vcblx0ICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lPSdwcm94eSddIOWHveaVsOWQjeensFxuXHQgKi9cblx0cHJveHk6IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHR2YXIgcHJveHlBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gJHByb3h5KHRoaXMsIG5hbWUsIHByb3h5QXJncyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOenu+mZpOaJgOaciee7keWumuS6i+S7tu+8jOa4hemZpOeUqOS6jue7keWumuS6i+S7tueahOS7o+eQhuWHveaVsFxuXHQgKiBAbWV0aG9kIEJhc2UjZGVzdHJveVxuXHQgKiBAbWVtYmVyb2YgQmFzZVxuXHQgKi9cblx0ZGVzdHJveTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRFdmVudHMoJ29mZicpO1xuXHRcdHRoaXMub2ZmKCk7XG5cdFx0dGhpcy5ib3VuZCA9IG51bGw7XG5cdH1cbn0pO1xuXG5CYXNlLm1ldGhvZHMoJGV2ZW50cy5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCIvKipcbiAqIOS6i+S7tuWvueixoee7keWumu+8jOWwhmV2ZW50c+S4reWMheWQq+eahOmUruWAvOWvueaYoOWwhOS4uuS7o+eQhueahOS6i+S7tuOAglxuICogLSDkuovku7bplK7lgLzlr7nmoLzlvI/lj6/ku6XkuLrvvJpcbiAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZCd9XG4gKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cbiAqIC0geydldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gKiBAbWV0aG9kIGRlbGVnYXRlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFjdGlvbiDlvIAv5YWz5Luj55CG77yM5Y+v6YCJ77yaWydvbicsICdvZmYnXeOAglxuICogQHBhcmFtIHtPYmplY3R9IHJvb3Qg6K6+572u5Luj55CG55qE5qC56IqC54K577yM5Y+v5Lul5piv5LiA5LiqanF1ZXJ55a+56LGh77yM5oiW6ICF5piv5re35ZCI5LqGIHNwb3JlLWtpdC9wYWNrYWdlcy9ldnQvZXZlbnRzIOaWueazleeahOWvueixoeOAglxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyDkuovku7bplK7lgLzlr7lcbiAqIEBwYXJhbSB7T2JqZWN0fSBiaW5kIOaMh+WumuS6i+S7tuWHveaVsOe7keWumueahOWvueixoe+8jOW/hemhu+S4uk1WQ+exu+eahOWunuS+i+OAglxuICovXG5cbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC9mb3JFYWNoJyk7XG5cbmZ1bmN0aW9uIGRlbGVnYXRlKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKSB7XG5cdHZhciBwcm94eTtcblx0dmFyIGRsZztcblx0aWYgKCFyb290KSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmICghYmluZCB8fCAhJGlzRnVuY3Rpb24oYmluZC5wcm94eSkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRwcm94eSA9IGJpbmQucHJveHkoKTtcblx0YWN0aW9uID0gYWN0aW9uID09PSAnb24nID8gJ29uJyA6ICdvZmYnO1xuXHRkbGcgPSBhY3Rpb24gPT09ICdvbicgPyAnZGVsZWdhdGUnIDogJ3VuZGVsZWdhdGUnO1xuXHRldmVudHMgPSAkYXNzaWduKHt9LCBldmVudHMpO1xuXG5cdCRmb3JFYWNoKGV2ZW50cywgZnVuY3Rpb24obWV0aG9kLCBoYW5kbGUpIHtcblx0XHR2YXIgc2VsZWN0b3I7XG5cdFx0dmFyIGV2ZW50O1xuXHRcdHZhciBmbnMgPSBbXTtcblx0XHRoYW5kbGUgPSBoYW5kbGUuc3BsaXQoL1xccysvKTtcblxuXHRcdGlmICh0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJykge1xuXHRcdFx0Zm5zID0gbWV0aG9kLnNwbGl0KC9cXHMrLykubWFwKGZ1bmN0aW9uKGZuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBwcm94eShmbmFtZSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKCRpc0Z1bmN0aW9uKG1ldGhvZCkpIHtcblx0XHRcdGZucyA9IFttZXRob2RdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXZlbnQgPSBoYW5kbGUucG9wKCk7XG5cblx0XHRpZiAoaGFuZGxlLmxlbmd0aCA+PSAxKSB7XG5cdFx0XHRzZWxlY3RvciA9IGhhbmRsZS5qb2luKCcgJyk7XG5cdFx0XHRpZiAoJGlzRnVuY3Rpb24ocm9vdFtkbGddKSkge1xuXHRcdFx0XHRmbnMuZm9yRWFjaChmdW5jdGlvbihmbikge1xuXHRcdFx0XHRcdHJvb3RbZGxnXShzZWxlY3RvciwgZXZlbnQsIGZuKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICgkaXNGdW5jdGlvbihyb290W2FjdGlvbl0pKSB7XG5cdFx0XHRmbnMuZm9yRWFjaChmdW5jdGlvbihmbikge1xuXHRcdFx0XHRyb290W2FjdGlvbl0oZXZlbnQsIGZuKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCIvKipcbiAqICMg5YW85a65IElFOCDnmoQgTVZDIOeugOWNleWunueOsFxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvbXZjXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9tdmNcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQubXZjLk1vZGVsKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL212Y1xuICogdmFyICRtdmMgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbXZjJyk7XG4gKiBjb25zb2xlLmluZm8oJG12Yy5Nb2RlbCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq57uE5Lu2XG4gKiB2YXIgJG1vZGVsID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL212Yy9tb2RlbCcpO1xuICovXG5cbmV4cG9ydHMua2xhc3MgPSByZXF1aXJlKCcuL2tsYXNzJyk7XG5leHBvcnRzLmRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuZXhwb3J0cy5wcm94eSA9IHJlcXVpcmUoJy4vcHJveHknKTtcbmV4cG9ydHMuQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuZXhwb3J0cy5Nb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKTtcbmV4cG9ydHMuVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuIiwiLyoqXG4gKiBjbGFzcyDnmoQgRVM1IOWunueOsFxuICogLSDkuLrku6PnoIHpgJrov4cgZXNsaW50IOajgOafpeWBmuS6huS6m+S/ruaUuVxuICogQG1vZHVsZSBrbGFzc1xuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGVkL2tsYXNzXG4gKi9cblxudmFyIGZuVGVzdCA9ICgveHl6LykudGVzdChmdW5jdGlvbigpIHsgdmFyIHh5ejsgcmV0dXJuIHh5ejsgfSkgPyAoL1xcYnN1cHJcXGIvKSA6ICgvLiovKTtcbnZhciBwcm90byA9ICdwcm90b3R5cGUnO1xuXG5mdW5jdGlvbiBpc0ZuKG8pIHtcblx0cmV0dXJuIHR5cGVvZiBvID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiB3cmFwKGssIGZuLCBzdXByKSB7XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdG1wID0gdGhpcy5zdXByO1xuXHRcdHRoaXMuc3VwciA9IHN1cHJbcHJvdG9dW2tdO1xuXHRcdHZhciB1bmRlZiA9IHt9LmZhYnJpY2F0ZWRVbmRlZmluZWQ7XG5cdFx0dmFyIHJldCA9IHVuZGVmO1xuXHRcdHRyeSB7XG5cdFx0XHRyZXQgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHR0aGlzLnN1cHIgPSB0bXA7XG5cdFx0fVxuXHRcdHJldHVybiByZXQ7XG5cdH07XG59XG5cbmZ1bmN0aW9uIGV4ZWNQcm9jZXNzKHdoYXQsIG8sIHN1cHIpIHtcblx0Zm9yICh2YXIgayBpbiBvKSB7XG5cdFx0aWYgKG8uaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdHdoYXRba10gPSAoXG5cdFx0XHRcdGlzRm4ob1trXSlcblx0XHRcdFx0JiYgaXNGbihzdXByW3Byb3RvXVtrXSlcblx0XHRcdFx0JiYgZm5UZXN0LnRlc3Qob1trXSlcblx0XHRcdCkgPyB3cmFwKGssIG9ba10sIHN1cHIpIDogb1trXTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG8sIGZyb21TdWIpIHtcblx0Ly8gbXVzdCByZWRlZmluZSBub29wIGVhY2ggdGltZSBzbyBpdCBkb2Vzbid0IGluaGVyaXQgZnJvbSBwcmV2aW91cyBhcmJpdHJhcnkgY2xhc3Nlc1xuXHR2YXIgTm9vcCA9IGZ1bmN0aW9uKCkge307XG5cdE5vb3BbcHJvdG9dID0gdGhpc1twcm90b107XG5cblx0dmFyIHN1cHIgPSB0aGlzO1xuXHR2YXIgcHJvdG90eXBlID0gbmV3IE5vb3AoKTtcblx0dmFyIGlzRnVuY3Rpb24gPSBpc0ZuKG8pO1xuXHR2YXIgX2NvbnN0cnVjdG9yID0gaXNGdW5jdGlvbiA/IG8gOiB0aGlzO1xuXHR2YXIgX21ldGhvZHMgPSBpc0Z1bmN0aW9uID8ge30gOiBvO1xuXG5cdGZ1bmN0aW9uIGZuKCkge1xuXHRcdGlmICh0aGlzLmluaXRpYWxpemUpIHtcblx0XHRcdHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZnJvbVN1YiB8fCBpc0Z1bmN0aW9uKSB7XG5cdFx0XHRcdHN1cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH1cblx0XHRcdF9jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdGZuLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcblx0XHRleGVjUHJvY2Vzcyhwcm90b3R5cGUsIG9iaiwgc3Vwcik7XG5cdFx0Zm5bcHJvdG9dID0gcHJvdG90eXBlO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdGZuLm1ldGhvZHMuY2FsbChmbiwgX21ldGhvZHMpLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZuO1xuXG5cdGZuLmV4dGVuZCA9IGV4dGVuZDtcblx0Zm4uc3RhdGljcyA9IGZ1bmN0aW9uKHNwZWMsIG9wdEZuKSB7XG5cdFx0c3BlYyA9IHR5cGVvZiBzcGVjID09PSAnc3RyaW5nJyA/IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialtzcGVjXSA9IG9wdEZuO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9KCkpIDogc3BlYztcblx0XHRleGVjUHJvY2Vzcyh0aGlzLCBzcGVjLCBzdXByKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRmbltwcm90b10uaW1wbGVtZW50ID0gZm4uc3RhdGljcztcblxuXHRyZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGtsYXNzKG8pIHtcblx0cmV0dXJuIGV4dGVuZC5jYWxsKGlzRm4obykgPyBvIDogZnVuY3Rpb24oKSB7fSwgbywgMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2xhc3M7XG4iLCIvKipcbiAqIOaooeWei+exuzog5Z+656GA5bel5Y6C5YWD5Lu257G777yM55So5LqO5YGa5pWw5o2u5YyF6KOF77yM5o+Q5L6b5Y+v6KeC5a+f55qE5pWw5o2u5a+56LGhXG4gKiAtIOe7p+aJv+iHqiBzcG9yZS1raXQvcGFja2FnZXMvbXZjL2Jhc2VcbiAqIEBtb2R1bGUgTW9kZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g5Yid5aeL5pWw5o2uXG4gKiBAZXhhbXBsZVxuICogdmFyICRtb2RlbCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwnKTtcbiAqXG4gKiB2YXIgbTEgPSBuZXcgJG1vZGVsKHtcbiAqICAgYSA6IDFcbiAqIH0pO1xuICogbTEub24oJ2NoYW5nZTphJywgZnVuY3Rpb24ocHJldkEpe1xuICogICBjb25zb2xlLmluZm8ocHJldkEpOyAvLyAxXG4gKiB9KTtcbiAqIG0xLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICogICBjb25zb2xlLmluZm8oJ21vZGVsIGNoYW5nZWQnKTtcbiAqIH0pO1xuICogbTEuc2V0KCdhJywgMik7XG4gKlxuICogdmFyIE15TW9kZWwgPSBNb2RlbC5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICBhIDogMixcbiAqICAgICBiIDogMlxuICogICB9LFxuICogICBldmVudHMgOiB7XG4gKiAgICAgJ2NoYW5nZTphJyA6ICd1cGRhdGVCJ1xuICogICB9LFxuICogICB1cGRhdGVCIDogZnVuY3Rpb24oKXtcbiAqICAgICB0aGlzLnNldCgnYicsIHRoaXMuZ2V0KCdhJykgKyAxKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogdmFyIG0yID0gbmV3IE15TW9kZWwoKTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7XHQvLyAyXG4gKlxuICogbTIuc2V0KCdhJywgMyk7XG4gKiBjb25zb2xlLmluZm8obTIuZ2V0KCdiJykpO1x0Ly8gNFxuICpcbiAqIG0yLnNldCgnYicsIDUpO1xuICogY29uc29sZS5pbmZvKG0yLmdldCgnYicpKTtcdC8vIDVcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xudmFyICRpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXknKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC9mb3JFYWNoJyk7XG52YXIgJGNsb25lRGVlcCA9IHJlcXVpcmUoJ2xvZGFzaC9jbG9uZURlZXAnKTtcbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuLy8g5pWw5o2u5bGe5oCn5ZCN56ewXG52YXIgREFUQSA9ICdfX2RhdGFfXyc7XG5cbnZhciBzZXRBdHRyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgZGF0YSA9IHRoaXNbREFUQV07XG5cdGlmICghZGF0YSkge1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgcHJldlZhbHVlID0gZGF0YVtrZXldO1xuXG5cdHZhciBwcm9jZXNzb3IgPSB0aGlzLnByb2Nlc3NvcnNba2V5XTtcblx0aWYgKHByb2Nlc3NvciAmJiAkaXNGdW5jdGlvbihwcm9jZXNzb3Iuc2V0KSkge1xuXHRcdHZhbHVlID0gcHJvY2Vzc29yLnNldCh2YWx1ZSk7XG5cdH1cblxuXHRpZiAodmFsdWUgIT09IHByZXZWYWx1ZSkge1xuXHRcdGRhdGFba2V5XSA9IHZhbHVlO1xuXHRcdHRoYXQuY2hhbmdlZCA9IHRydWU7XG5cdFx0dGhhdC50cmlnZ2VyKCdjaGFuZ2U6JyArIGtleSwgcHJldlZhbHVlKTtcblx0fVxufTtcblxudmFyIGdldEF0dHIgPSBmdW5jdGlvbihrZXkpIHtcblx0dmFyIHZhbHVlID0gdGhpc1tEQVRBXVtrZXldO1xuXHRpZiAoJGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XG5cdFx0dmFsdWUgPSAkY2xvbmVEZWVwKHZhbHVlKTtcblx0fSBlbHNlIGlmICgkaXNBcnJheSh2YWx1ZSkpIHtcblx0XHR2YWx1ZSA9ICRjbG9uZURlZXAodmFsdWUpO1xuXHR9XG5cblx0dmFyIHByb2Nlc3NvciA9IHRoaXMucHJvY2Vzc29yc1trZXldO1xuXHRpZiAocHJvY2Vzc29yICYmICRpc0Z1bmN0aW9uKHByb2Nlc3Nvci5nZXQpKSB7XG5cdFx0dmFsdWUgPSBwcm9jZXNzb3IuZ2V0KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciByZW1vdmVBdHRyID0gZnVuY3Rpb24oa2V5KSB7XG5cdGRlbGV0ZSB0aGlzW0RBVEFdW2tleV07XG5cdHRoaXMudHJpZ2dlcignY2hhbmdlOicgKyBrZXkpO1xufTtcblxudmFyIE1vZGVsID0gJGJhc2UuZXh0ZW5kKHtcblxuXHQvKipcblx0ICog5qih5Z6L55qE6buY6K6k5pWw5o2uXG5cdCAqIC0g57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG5cdCAqIEBuYW1lIE1vZGVsI2RlZmF1bHRzXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKi9cblx0ZGVmYXVsdHM6IHt9LFxuXG5cdC8qKlxuXHQgKiDmqKHlnovnmoTkuovku7bnu5HlrprliJfooajjgIJcblx0ICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcblx0ICogLSDlsL3ph4/lnKggZXZlbnRzIOWvueixoeWumuS5ieWxnuaAp+WFs+iBlOS6i+S7tuOAglxuXHQgKiAtIOS6i+S7tuW6lOW9k+S7heeUqOS6juiHqui6q+WxnuaAp+eahOWFs+iBlOi/kOeul+OAglxuXHQgKiAtIOS6i+S7tue7keWumuagvOW8j+WPr+S7peS4uu+8mlxuXHQgKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuXHQgKiAtIHsnZXZlbnQnOidtZXRob2QxIG1ldGhvZDInfVxuXHQgKiBAbmFtZSBNb2RlbCNldmVudHNcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqL1xuXHRldmVudHM6IHt9LFxuXG5cdC8qKlxuXHQgKiDmqKHlnovmlbDmja7nmoTpooTlpITnkIblmajjgIJcblx0ICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcblx0ICogQG5hbWUgTW9kZWwjcHJvY2Vzc29yc1xuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAbWVtYmVyb2YgTW9kZWxcblx0ICogQGV4YW1wbGVcblx0ICpcdHByb2Nlc3NvcnMgOiB7XG5cdCAqXHRcdG5hbWUgOiB7XG5cdCAqXHRcdFx0c2V0IDogZnVuY3Rpb24odmFsdWUpe1xuXHQgKlx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHQgKlx0XHRcdH0sXG5cdCAqXHRcdFx0Z2V0IDogZnVuY3Rpb24odmFsdWUpe1xuXHQgKlx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHQgKlx0XHRcdH1cblx0ICpcdFx0fVxuXHQgKlx0fVxuXHQqL1xuXHRwcm9jZXNzb3JzOiB7fSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dGhpc1tEQVRBXSA9IHt9O1xuXHRcdHRoaXMuZGVmYXVsdHMgPSAkYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzKTtcblx0XHR0aGlzLmV2ZW50cyA9ICRhc3NpZ24oe30sIHRoaXMuZXZlbnRzKTtcblx0XHR0aGlzLnByb2Nlc3NvcnMgPSAkYXNzaWduKHt9LCB0aGlzLnByb2Nlc3NvcnMpO1xuXHRcdHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuXG5cdFx0dGhpcy5idWlsZCgpO1xuXHRcdHRoaXMuZGVsZWdhdGUoJ29uJyk7XG5cdFx0dGhpcy5zZXRFdmVudHMoJ29uJyk7XG5cdFx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDmt7Hluqbmt7flkIjkvKDlhaXnmoTpgInpobnkuI7pu5jorqTpgInpobnvvIznhLblkI7mt7flkIjliLDmlbDmja7lr7nosaHkuK1cblx0ICogQG1ldGhvZCBNb2RlbCNzZXRPcHRpb25zXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuXHQgKi9cblx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpO1xuXHRcdHRoaXMuc3VwcihvcHRpb25zKTtcblx0XHR0aGlzLnNldChvcHRpb25zKTtcblx0fSxcblxuXHQvKipcblx0ICog57uR5a6aIGV2ZW50cyDlr7nosaHliJfkuL7nmoTkuovku7bjgILlnKjliJ3lp4vljJbml7boh6rliqjmiafooYzkuoYgdGhpcy5kZWxlZ2F0ZSgnb24nKeOAglxuXHQgKiBAbWV0aG9kIE1vZGVsI2RlbGVnYXRlXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprliqjkvZzmoIforrDjgILlj6/pgInvvJpbJ29uJywgJ29mZiddXG5cdCAqL1xuXHRkZWxlZ2F0ZTogZnVuY3Rpb24oYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpIHtcblx0XHRhY3Rpb24gPSBhY3Rpb24gfHwgJ29uJztcblx0XHRyb290ID0gcm9vdCB8fCB0aGlzO1xuXHRcdGV2ZW50cyA9IGV2ZW50cyB8fCB0aGlzLmV2ZW50cztcblx0XHRiaW5kID0gYmluZCB8fCB0aGlzO1xuXHRcdCRkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOaVsOaNrumihOWkhOeQhlxuXHQgKiBAbWV0aG9kIE1vZGVsI3Byb2Nlc3Ncblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg5qih5Z6L5bGe5oCn5ZCN56ew44CC5oiW6ICFSlNPTuaVsOaNruOAglxuXHQgKiBAcGFyYW0geyp9IFt2YWxdIOaVsOaNrlxuXHQgKi9cblx0cHJvY2VzczogZnVuY3Rpb24obmFtZSwgc3BlYykge1xuXHRcdHNwZWMgPSAkYXNzaWduKHtcblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdGdldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sIHNwZWMpO1xuXHRcdHRoaXMucHJvY2Vzc29yc1tuYW1lXSA9IHNwZWM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOiuvue9ruaooeWei+aVsOaNrlxuXHQgKiBAbWV0aG9kIE1vZGVsI3NldFxuXHQgKiBAbWVtYmVyb2YgTW9kZWxcblx0ICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBrZXkg5qih5Z6L5bGe5oCn5ZCN56ew44CC5oiW6ICFSlNPTuaVsOaNruOAglxuXHQgKiBAcGFyYW0geyp9IFt2YWxdIOaVsOaNrlxuXHQgKi9cblx0c2V0OiBmdW5jdGlvbihrZXksIHZhbCkge1xuXHRcdGlmICgkaXNQbGFpbk9iamVjdChrZXkpKSB7XG5cdFx0XHQkZm9yRWFjaChrZXksIGZ1bmN0aW9uKHYsIGspIHtcblx0XHRcdFx0c2V0QXR0ci5jYWxsKHRoaXMsIGssIHYpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRzZXRBdHRyLmNhbGwodGhpcywga2V5LCB2YWwpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5jaGFuZ2VkKSB7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuXHRcdFx0dGhpcy5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDojrflj5bmqKHlnovlr7nlupTlsZ7mgKfnmoTlgLznmoTmi7fotJ1cblx0ICogLSDlpoLmnpzkuI3kvKDlj4LmlbDvvIzliJnnm7TmjqXojrflj5bmlbTkuKrmqKHlnovmlbDmja7jgIJcblx0ICogLSDlpoLmnpzlgLzmmK/kuIDkuKrlr7nosaHvvIzliJnor6Xlr7nosaHkvJrooqvmt7Hmi7fotJ3jgIJcblx0ICogQG1ldGhvZCBNb2RlbCNnZXRcblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XSDmqKHlnovlsZ7mgKflkI3np7DjgIJcblx0ICogQHJldHVybnMgeyp9IOWxnuaAp+WQjeensOWvueW6lOeahOWAvFxuXHQgKi9cblx0Z2V0OiBmdW5jdGlvbihrZXkpIHtcblx0XHRpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdGlmICghdGhpc1tEQVRBXSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZ2V0QXR0ci5jYWxsKHRoaXMsIGtleSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dmFyIGRhdGEgPSB7fTtcblx0XHRcdCRmb3JFYWNoKHRoaXMua2V5cygpLCBmdW5jdGlvbihrKSB7XG5cdFx0XHRcdGRhdGFba10gPSBnZXRBdHRyLmNhbGwodGhpcywgayk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiDojrflj5bmqKHlnovkuIrorr7nva7nmoTmiYDmnInplK7lkI1cblx0ICogQG1ldGhvZCBNb2RlbCNrZXlzXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IOWxnuaAp+WQjeensOWIl+ihqFxuXHQgKi9cblx0a2V5czogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbREFUQV0gfHwge30pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDliKDpmaTmqKHlnovkuIrnmoTkuIDkuKrplK5cblx0ICogQG1ldGhvZCBNb2RlbCNyZW1vdmVcblx0ICogQG1lbWJlcm9mIE1vZGVsXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg5bGe5oCn5ZCN56ew44CCXG5cdCAqL1xuXHRyZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHJlbW92ZUF0dHIuY2FsbCh0aGlzLCBrZXkpO1xuXHRcdHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOa4hemZpOaooeWei+S4reaJgOacieaVsOaNrlxuXHQgKiBAbWV0aG9kIE1vZGVsI2NsZWFyXG5cdCAqIEBtZW1iZXJvZiBNb2RlbFxuXHQgKi9cblx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdE9iamVjdC5rZXlzKHRoaXNbREFUQV0pLmZvckVhY2gocmVtb3ZlQXR0ciwgdGhpcyk7XG5cdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcblx0fSxcblxuXHQvKipcblx0ICog6ZSA5q+B5qih5Z6L77yM5LiN5Lya6Kem5Y+R5Lu75L2VY2hhbmdl5LqL5Lu244CCXG5cdCAqIC0g5qih5Z6L6ZSA5q+B5ZCO77yM5peg5rOV5YaN6K6+572u5Lu75L2V5pWw5o2u44CCXG5cdCAqIEBtZXRob2QgTW9kZWwjZGVzdHJveVxuXHQgKiBAbWVtYmVyb2YgTW9kZWxcblx0ICovXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdHRoaXMuZGVsZWdhdGUoJ29mZicpO1xuXHRcdHRoaXMuc3VwcigpO1xuXHRcdHRoaXMuY2xlYXIoKTtcblx0XHR0aGlzW0RBVEFdID0gbnVsbDtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCIvKipcbiAqIOWHveaVsOS7o+eQhu+8jOehruS/neWHveaVsOWcqOW9k+WJjeexu+WIm+W7uueahOWunuS+i+S4iuS4i+aWh+S4reaJp+ihjOOAglxuICogLSDov5nkupvnlKjkuo7nu5Hlrprkuovku7bnmoTku6PnkIblh73mlbDpg73mlL7lnKjlsZ7mgKcgaW5zdGFuY2UuYm91bmQg5LiK44CCXG4gKiAtIOWKn+iDveexu+S8vCBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCDjgIJcbiAqIC0g5Y+v5Lul5Lyg6YCS6aKd5aSW5Y+C5pWw5L2c5Li65Ye95pWw5omn6KGM55qE6buY6K6k5Y+C5pWw77yM6L+95Yqg5Zyo5a6e6ZmF5Y+C5pWw5LmL5ZCO44CCXG4gKiBAcGFyYW0ge29iamVjdH0gaW5zdGFuY2Ug5a+56LGh5a6e5L6LXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWU9J3Byb3h5J10g5Ye95pWw5ZCN56ewXG4gKi9cblxudmFyICRpc0Z1bmN0aW9uID0gcmVxdWlyZSgnbG9kYXNoL2lzRnVuY3Rpb24nKTtcblxudmFyIEFQID0gQXJyYXkucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBwcm94eShpbnN0YW5jZSwgbmFtZSwgcHJveHlBcmdzKSB7XG5cdGlmICghaW5zdGFuY2UuYm91bmQpIHtcblx0XHRpbnN0YW5jZS5ib3VuZCA9IHt9O1xuXHR9XG5cdHZhciBib3VuZCA9IGluc3RhbmNlLmJvdW5kO1xuXHRwcm94eUFyZ3MgPSBwcm94eUFyZ3MgfHwgW107XG5cdHByb3h5QXJncy5zaGlmdCgpO1xuXHRuYW1lID0gbmFtZSB8fCAncHJveHknO1xuXHRpZiAoISRpc0Z1bmN0aW9uKGJvdW5kW25hbWVdKSkge1xuXHRcdGJvdW5kW25hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoJGlzRnVuY3Rpb24oaW5zdGFuY2VbbmFtZV0pKSB7XG5cdFx0XHRcdHZhciBhcmdzID0gQVAuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdFx0XHRyZXR1cm4gaW5zdGFuY2VbbmFtZV0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MuY29uY2F0KHByb3h5QXJncykpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIGJvdW5kW25hbWVdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb3h5O1xuIiwiLyoqXG4gKiDop4blm77nsbs6IOWfuuehgOW3peWOguWFg+S7tuexu++8jOeUqOS6juWvueinhuWbvue7hOS7tueahOWMheijhVxuICogLSDkvp3otZYgalF1ZXJ5L1plcHRvXG4gKiAtIOe7p+aJv+iHqiBzcG9yZS1raXQvcGFja2FnZXMvbXZjL2Jhc2VcbiAqIEBtb2R1bGUgVmlld1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gW29wdGlvbnMubm9kZV0g6YCJ5oup5Zmo5a2X56ym5Liy77yM5oiW6ICFRE9N5YWD57Sg77yM5oiW6ICFanF1ZXJ55a+56LGh77yM55So5LqO5oyH5a6a6KeG5Zu+55qE5qC56IqC54K544CCXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudGVtcGxhdGVdIOinhuWbvueahOaooeadv+Wtl+espuS4su+8jOS5n+WPr+S7peaYr+S4quWtl+espuS4suaVsOe7hO+8jOWIm+W7uuinhuWbvkRPTeaXtuS8muiHquWKqGpvaW7kuLrlrZfnrKbkuLLlpITnkIbjgIJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5ldmVudHNdIOeUqOS6juimhuebluS7o+eQhuS6i+S7tuWIl+ihqOOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnJvbGVdIOinkuiJsuWvueixoeaYoOWwhOihqO+8jOWPr+aMh+WumnJvbGXmlrnms5Xov5Tlm57nmoRqcXVlcnnlr7nosaHjgIJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHZpZXcgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbXZjL3ZpZXcnKTtcbiAqXG4gKiB2YXIgVFBMID0ge1xuICogICBib3ggOiBbXG4gKiAgICAgJzxkaXY+JyxcbiAqICAgICAgICc8YnV0dG9uIHJvbGU9XCJidXR0b25cIj48L2J1dHRvbj4nLFxuICogICAgICc8L2Rpdj4nXG4gKiAgIF1cbiAqIH07XG4gKlxuICogdmFyIFRlc3RWaWV3ID0gJHZpZXcuZXh0ZW5kKHtcbiAqICAgZGVmYXVsdHMgOiB7XG4gKiAgICAgdGVtcGxhdGUgOiBUUEwuYm94XG4gKiAgIH0sXG4gKiAgIGV2ZW50cyA6IHtcbiAqICAgICAnYnV0dG9uIGNsaWNrJyA6ICdtZXRob2QxJ1xuICogICB9LFxuICogICBidWlsZCA6IGZ1bmN0aW9uKCl7XG4gKiAgICAgdGhpcy5yb2xlKCdyb290JykuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gKiAgIH0sXG4gKiAgIG1ldGhvZDEgOiBmdW5jdGlvbihldnQpe1xuICogICAgIGNvbnNvbGUuaW5mbygxKTtcbiAqICAgfSxcbiAqICAgbWV0aG9kMiA6IGZ1bmN0aW9uKGV2dCl7XG4gKiAgICAgY29uc29sZS5pbmZvKDIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiB2YXIgb2JqMSA9IG5ldyBUZXN0VmlldygpO1xuICogdmFyIG9iajIgPSBuZXcgVGVzdFZpZXcoe1xuICogICBldmVudHMgOiB7XG4gKiAgICAgJ2J1dHRvbiBjbGljaycgOiAnbWV0aG9kMidcbiAqICAgfVxuICogfSk7XG4gKlxuICogb2JqMS5yb2xlKCdidXR0b24nKS50cmlnZ2VyKCdjbGljaycpO1x0Ly8gMVxuICogb2JqMi5yb2xlKCdidXR0b24nKS50cmlnZ2VyKCdjbGljaycpO1x0Ly8gMlxuICovXG5cbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuZnVuY3Rpb24gZ2V0JCgpIHtcblx0cmV0dXJuICh3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byk7XG59XG5cbi8vIOiOt+WPluinhuWbvueahOagueiKgueCuVxudmFyIGdldFJvb3QgPSBmdW5jdGlvbigpIHtcblx0dmFyICQgPSBnZXQkKCk7XG5cdHZhciBjb25mID0gdGhpcy5jb25mO1xuXHR2YXIgdGVtcGxhdGUgPSBjb25mLnRlbXBsYXRlO1xuXHR2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuXHR2YXIgcm9vdCA9IG5vZGVzLnJvb3Q7XG5cdGlmICghcm9vdCkge1xuXHRcdGlmIChjb25mLm5vZGUpIHtcblx0XHRcdHJvb3QgPSAkKGNvbmYubm9kZSk7XG5cdFx0fVxuXHRcdGlmICghcm9vdCB8fCAhcm9vdC5sZW5ndGgpIHtcblx0XHRcdGlmICgkLnR5cGUodGVtcGxhdGUpID09PSAnYXJyYXknKSB7XG5cdFx0XHRcdHRlbXBsYXRlID0gdGVtcGxhdGUuam9pbignJyk7XG5cdFx0XHR9XG5cdFx0XHRyb290ID0gJCh0ZW1wbGF0ZSk7XG5cdFx0fVxuXHRcdG5vZGVzLnJvb3QgPSByb290O1xuXHR9XG5cdHJldHVybiByb290O1xufTtcblxudmFyIFZpZXcgPSAkYmFzZS5leHRlbmQoe1xuXHQvKipcblx0ICog57G755qE6buY6K6k6YCJ6aG55a+56LGh77yM57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG5cdCAqIEBuYW1lIFZpZXcjZGVmYXVsdHNcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIFZpZXdcblx0ICovXG5cdGRlZmF1bHRzOiB7XG5cdFx0bm9kZTogJycsXG5cdFx0dGVtcGxhdGU6ICcnLFxuXHRcdGV2ZW50czoge30sXG5cdFx0cm9sZToge31cblx0fSxcblxuXHQvKipcblx0ICog6KeG5Zu+55qE5Luj55CG5LqL5Lu257uR5a6a5YiX6KGo77yM57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG5cdCAqIC0g5LqL5Lu257uR5a6a5qC85byP5Y+v5Lul5Li677yaXG5cdCAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZCd9XG5cdCAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG5cdCAqIEBuYW1lIFZpZXcjZXZlbnRzXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqIEBtZW1iZXJvZiBWaWV3XG5cdCAqL1xuXHRldmVudHM6IHt9LFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR0aGlzLm5vZGVzID0ge307XG5cblx0XHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy5idWlsZCgpO1xuXHRcdHRoaXMuZGVsZWdhdGUoJ29uJyk7XG5cdFx0dGhpcy5zZXRFdmVudHMoJ29uJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOa3seW6pua3t+WQiOS8oOWFpeeahOmAiemhueS4jum7mOiupOmAiemhue+8jOa3t+WQiOWujOaIkOeahOmAiemhueWvueixoeWPr+mAmui/hyB0aGlzLmNvbmYg5bGe5oCn6K6/6ZeuXG5cdCAqIEBtZXRob2QgVmlldyNzZXRPcHRpb25zXG5cdCAqIEBtZW1iZXJvZiBWaWV3XG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g6YCJ6aG5XG5cdCAqL1xuXHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dmFyICQgPSBnZXQkKCk7XG5cdFx0dGhpcy5jb25mID0gdGhpcy5jb25mIHx8ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRlZmF1bHRzKTtcblx0XHRpZiAoISQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuXHRcdFx0b3B0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHQkLmV4dGVuZCh0cnVlLCB0aGlzLmNvbmYsIG9wdGlvbnMpO1xuXHRcdHRoaXMuZXZlbnRzID0gJC5leHRlbmQoe30sIHRoaXMuZXZlbnRzLCBvcHRpb25zLmV2ZW50cyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOe7keWumiBldmVudHMg5a+56LGh5YiX5Li+55qE5LqL5Lu244CCXG5cdCAqIC0g5Zyo5Yid5aeL5YyW5pe26Ieq5Yqo5omn6KGM5LqGIHRoaXMuZGVsZWdhdGUoJ29uJynjgIJcblx0ICogQG1ldGhvZCBWaWV3I2RlbGVnYXRlXG5cdCAqIEBtZW1iZXJvZiBWaWV3XG5cdCAqIEBzZWUgc3BvcmUta2l0L3BhY2thZ2VzL212Yy9kZWxlZ2F0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprliqjkvZzmoIforrDjgILlj6/pgInvvJpbJ29uJywgJ29mZiddXG5cdCAqL1xuXHRkZWxlZ2F0ZTogZnVuY3Rpb24oYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpIHtcblx0XHRhY3Rpb24gPSBhY3Rpb24gfHwgJ29uJztcblx0XHRyb290ID0gcm9vdCB8fCB0aGlzLnJvbGUoJ3Jvb3QnKTtcblx0XHRldmVudHMgPSBldmVudHMgfHwgdGhpcy5ldmVudHM7XG5cdFx0YmluZCA9IGJpbmQgfHwgdGhpcztcblx0XHQkZGVsZWdhdGUoYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDojrflj5YgLyDorr7nva7op5LoibLlr7nosaHmjIflrprnmoQgalF1ZXJ5IOWvueixoeOAglxuXHQgKiAtIOazqOaEj++8muiOt+WPluWIsOinkuiJsuWFg+e0oOWQju+8jOivpSBqUXVlcnkg5a+56LGh5Lya57yT5a2Y5Zyo6KeG5Zu+5a+56LGh5LitXG5cdCAqIEBtZXRob2QgVmlldyNyb2xlXG5cdCAqIEBtZW1iZXJvZiBWaWV3XG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIOinkuiJsuWvueixoeWQjeensFxuXHQgKiBAcGFyYW0ge09iamVjdH0gW2VsZW1lbnRdIOinkuiJsuWvueixoeaMh+WumueahGRvbeWFg+e0oOaIluiAhSBqUXVlcnkg5a+56LGh44CCXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IOinkuiJsuWQjeWvueW6lOeahCBqUXVlcnkg5a+56LGh44CCXG5cdCAqL1xuXHRyb2xlOiBmdW5jdGlvbihuYW1lLCBlbGVtZW50KSB7XG5cdFx0dmFyICQgPSBnZXQkKCk7XG5cdFx0dmFyIG5vZGVzID0gdGhpcy5ub2Rlcztcblx0XHR2YXIgcm9vdCA9IGdldFJvb3QuY2FsbCh0aGlzKTtcblx0XHR2YXIgcm9sZSA9IHRoaXMuY29uZi5yb2xlIHx8IHt9O1xuXHRcdGlmICghZWxlbWVudCkge1xuXHRcdFx0aWYgKG5vZGVzW25hbWVdKSB7XG5cdFx0XHRcdGVsZW1lbnQgPSBub2Rlc1tuYW1lXTtcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lID09PSAncm9vdCcpIHtcblx0XHRcdFx0ZWxlbWVudCA9IHJvb3Q7XG5cdFx0XHR9IGVsc2UgaWYgKCFlbGVtZW50IHx8ICFlbGVtZW50Lmxlbmd0aCkge1xuXHRcdFx0XHRpZiAocm9sZVtuYW1lXSkge1xuXHRcdFx0XHRcdGVsZW1lbnQgPSByb290LmZpbmQocm9sZVtuYW1lXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbWVudCA9IHJvb3QuZmluZCgnW3JvbGU9XCInICsgbmFtZSArICdcIl0nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRub2Rlc1tuYW1lXSA9IGVsZW1lbnQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXHRcdFx0bm9kZXNbbmFtZV0gPSBlbGVtZW50O1xuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudDtcblx0fSxcblxuXHQvKipcblx0ICog5riF6Zmk6KeG5Zu+57yT5a2Y55qE6KeS6Imy5a+56LGhXG5cdCAqIEBtZXRob2QgVmlldyNyZXNldFJvbGVzXG5cdCAqIEBtZW1iZXJvZiBWaWV3XG5cdCAqL1xuXHRyZXNldFJvbGVzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgJCA9IGdldCQoKTtcblx0XHR2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuXHRcdCQuZWFjaChub2RlcywgZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0aWYgKG5hbWUgIT09ICdyb290Jykge1xuXHRcdFx0XHRub2Rlc1tuYW1lXSA9IG51bGw7XG5cdFx0XHRcdGRlbGV0ZSBub2Rlc1tuYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICog6ZSA5q+B6KeG5Zu+77yM6YeK5pS+5YaF5a2YXG5cdCAqIEBtZXRob2QgVmlldyNkZXN0cm95XG5cdCAqIEBtZW1iZXJvZiBWaWV3XG5cdCAqL1xuXHRkZXN0cm95OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmRlbGVnYXRlKCdvZmYnKTtcblx0XHR0aGlzLnN1cHIoKTtcblx0XHR0aGlzLnJlc2V0Um9sZXMoKTtcblx0XHR0aGlzLm5vZGVzID0ge307XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG4iLCIvKipcbiAqIOaVsOWtl+eahOWNg+WIhuS9jemAl+WPt+WIhumalOihqOekuuazlVxuICogLSBJRTgg55qEIHRvTG9jYWxTdHJpbmcg57uZ5Ye65LqG5bCP5pWw54K55ZCOMuS9jTogTi4wMFxuICogQG1ldGhvZCBjb21tYVxuICogQHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MDExMDIvaG93LXRvLXByaW50LWEtbnVtYmVyLXdpdGgtY29tbWFzLWFzLXRob3VzYW5kcy1zZXBhcmF0b3JzLWluLWphdmFzY3JpcHRcbiAqIEBwYXJhbSB7TnVtYmVyfSBudW0g5pWw5a2XXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDljYPliIbkvY3ooajnpLrnmoTmlbDlrZdcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvbW1hID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL251bS9jb21tYScpO1xuICogJGNvbW1hKDEyMzQ1NjcpOyAvLycxLDIzNCw1NjcnXG4gKi9cblxuZnVuY3Rpb24gY29tbWEgKG51bSkge1xuXHR2YXIgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuXHRwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG5cdHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tbWE7XG4iLCIvKipcbiAqIOS/ruato+ihpeS9jVxuICogQG1ldGhvZCBmaXhUb1xuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBudW0g6KaB6KGl5L2N55qE5pWw5a2XXG4gKiBAcGFyYW0ge051bWJlcn0gW3c9Ml0gdyDooaXkvY3mlbDph49cbiAqIEByZXR1cm4ge1N0cmluZ30g57uP6L+H6KGl5L2N55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRmaXhUbyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vZml4VG8nKTtcbiAqICRmaXhUbygwLCAyKTtcdC8vcmV0dXJuICcwMCdcbiAqL1xuXG5mdW5jdGlvbiBmaXhUbyAobnVtLCB3KSB7XG5cdHZhciBzdHIgPSBudW0udG9TdHJpbmcoKTtcblx0dyA9IE1hdGgubWF4KCh3IHx8IDIpIC0gc3RyLmxlbmd0aCArIDEsIDApO1xuXHRyZXR1cm4gbmV3IEFycmF5KHcpLmpvaW4oJzAnKSArIHN0cjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaXhUbztcbiIsIi8qKlxuICogIyDlpITnkIbmlbDlrZfvvIzmlbDmja7ovazmjaJcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL251bVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbnVtXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0Lm51bS5saW1pdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9udW1cbiAqIHZhciAkbnVtID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL251bScpO1xuICogY29uc29sZS5pbmZvKCRudW0ubGltaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRsaW1pdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vbGltaXQnKTtcbiAqL1xuXG5leHBvcnRzLmNvbW1hID0gcmVxdWlyZSgnLi9jb21tYScpO1xuZXhwb3J0cy5maXhUbyA9IHJlcXVpcmUoJy4vZml4VG8nKTtcbmV4cG9ydHMubGltaXQgPSByZXF1aXJlKCcuL2xpbWl0Jyk7XG5leHBvcnRzLm51bWVyaWNhbCA9IHJlcXVpcmUoJy4vbnVtZXJpY2FsJyk7XG4iLCIvKipcbiAqIOmZkOWItuaVsOWtl+WcqOS4gOS4quiMg+WbtOWGhVxuICogQG1ldGhvZCBsaW1pdFxuICogQHBhcmFtIHtOdW1iZXJ9IG51bSDopoHpmZDliLbnmoTmlbDlrZdcbiAqIEBwYXJhbSB7TnVtYmVyfSBtaW4g5pyA5bCP6L6555WM5pWw5YC8XG4gKiBAcGFyYW0ge051bWJlcn0gbWF4IOacgOWkp+i+ueeVjOaVsOWAvFxuICogQHJldHVybiB7TnVtYmVyfSDnu4/ov4fpmZDliLbnmoTmlbDlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxpbWl0ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL251bS9saW1pdCcpO1xuICogJGxpbWl0KDEsIDUsIDEwKTsgLy8gNVxuICogJGxpbWl0KDYsIDUsIDEwKTsgLy8gNlxuICogJGxpbWl0KDExLCA1LCAxMCk7IC8vIDEwXG4gKi9cblxuZnVuY3Rpb24gbGltaXQgKG51bSwgbWluLCBtYXgpIHtcblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG51bSwgbWluKSwgbWF4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaW1pdDtcbiIsIi8qKlxuICog5bCG5pWw5o2u57G75Z6L6L2s5Li65pW05pWw5pWw5a2X77yM6L2s5o2i5aSx6LSl5YiZ6L+U5Zue5LiA5Liq6buY6K6k5YC8XG4gKiBAbWV0aG9kIG51bWVyaWNhbFxuICogQHBhcmFtIHsqfSBzdHIg6KaB6L2s5o2i55qE5pWw5o2uXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlZj0wXSDovazmjaLlpLHotKXml7bnmoTpu5jorqTlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3lzPTEwXSDov5vliLZcbiAqIEByZXR1cm4ge051bWJlcn0g6L2s5o2i6ICM5b6X55qE5pW05pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRudW1lcmljYWwgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbnVtL251bWVyaWNhbCcpO1xuICogJG51bWVyaWNhbCgnMTB4Jyk7IC8vIDEwXG4gKiAkbnVtZXJpY2FsKCd4MTAnKTsgLy8gMFxuICovXG5cbmZ1bmN0aW9uIG51bWVyaWNhbCAoc3RyLCBkZWYsIHN5cykge1xuXHRkZWYgPSBkZWYgfHwgMDtcblx0c3lzID0gc3lzIHx8IDEwO1xuXHRyZXR1cm4gcGFyc2VJbnQoc3RyLCBzeXMpIHx8IGRlZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBudW1lcmljYWw7XG4iLCIvKipcbiAqIOaJqeWxleW5tuimhuebluWvueixoVxuICogQG1ldGhvZCBhc3NpZ25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog6KaB5omp5bGV55qE5a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSDopoHmianlsZXnmoTlsZ7mgKfplK7lgLzlr7lcbiAqIEByZXR1cm5zIHtPYmplY3R9IOaJqeWxleWQjueahOa6kOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkYXNzaWduID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL29iai9hc3NpZ24nKTtcbiAqIHZhciBvYmogPSB7YTogMSwgYjogMn07XG4gKiBjb25zb2xlLmluZm8oJGFzc2lnbihvYmosIHtiOiAzLCBjOiA0fSkpOyAvLyB7YTogMSwgYjogMywgYzogNH1cbiAqIGNvbnNvbGUuaW5mbygkYXNzaWduKHt9LCBvYmosIHtiOiAzLCBjOiA0fSkpOyAvLyB7YTogMSwgYjogMywgYzogNH1cbiAqL1xuXG5mdW5jdGlvbiBhc3NpZ24gKG9iaikge1xuXHRvYmogPSBvYmogfHwge307XG5cdEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcblx0XHR2YXIgcHJvcDtcblx0XHRzb3VyY2UgPSBzb3VyY2UgfHwge307XG5cdFx0Zm9yIChwcm9wIGluIHNvdXJjZSkge1xuXHRcdFx0aWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuXHRcdFx0XHRvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG4iLCIvKipcbiAqIOimhuebluWvueixoe+8jOS4jea3u+WKoOaWsOeahOmUrlxuICogQG1ldGhvZCBjb3ZlclxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCDopoHopobnm5bnmoTlr7nosaFcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIOimgeimhueblueahOWxnuaAp+mUruWAvOWvuVxuICogQHJldHVybnMge09iamVjdH0g6KaG55uW5ZCO55qE5rqQ5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb3ZlciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovY292ZXInKTtcbiAqIHZhciBvYmogPSB7YTogMSwgYjogMn07XG4gKiBjb25zb2xlLmluZm8oJGNvdmVyKG9iaix7YjogMywgYzogNH0pKTtcdC8ve2E6IDEsIGI6IDN9XG4gKi9cblxuZnVuY3Rpb24gY292ZXIoKSB7XG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0dmFyIG9iamVjdCA9IGFyZ3Muc2hpZnQoKTtcblx0aWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0Lmhhc093blByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuXHRcdGFyZ3MuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbS5oYXNPd25Qcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRcdFx0b2JqZWN0W2tleV0gPSBpdGVtW2tleV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0cmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3ZlcjtcbiIsIi8qKlxuICog5p+l5om+5a+56LGh6Lev5b6E5LiK55qE5YC8KOeugOaYk+eJiClcbiAqIEBzZWUgbG9kYXNoLmdldFxuICogQG1ldGhvZCBmaW5kXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IOimgeafpeaJvueahOWvueixoVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGgg6KaB5p+l5om+55qE6Lev5b6EXG4gKiBAcmV0dXJuIHsqfSDlr7nosaHot6/lvoTkuIrnmoTlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZpbmQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvb2JqL2ZpbmQnKTtcbiAqIHZhciBvYmogPSB7YTp7Yjp7YzoxfX19O1xuICogY29uc29sZS5pbmZvKCRmaW5kKG9iaiwnYS5iLmMnKSk7IC8vIDFcbiAqIGNvbnNvbGUuaW5mbygkZmluZChvYmosJ2EuYycpKTsgLy8gdW5kZWZpbmVkXG4gKi9cblxuZnVuY3Rpb24gZmluZFBhdGgob2JqZWN0LCBwYXRoKSB7XG5cdHBhdGggPSBwYXRoIHx8ICcnO1xuXHRpZiAoIXBhdGgpIHtcblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cdGlmICghb2JqZWN0KSB7XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdHZhciBxdWV1ZSA9IHBhdGguc3BsaXQoJy4nKTtcblx0dmFyIG5hbWU7XG5cdHZhciBwb3MgPSBvYmplY3Q7XG5cblx0d2hpbGUgKHF1ZXVlLmxlbmd0aCkge1xuXHRcdG5hbWUgPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdGlmICghcG9zW25hbWVdKSB7XG5cdFx0XHRyZXR1cm4gcG9zW25hbWVdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwb3MgPSBwb3NbbmFtZV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHBvcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kUGF0aDtcbiIsIi8qKlxuICogIyDlr7nosaHlpITnkIbkuI7liKTmlq1cbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL29ialxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvb2JqXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0Lm9iai50eXBlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL29ialxuICogdmFyICRvYmogPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvb2JqJyk7XG4gKiBjb25zb2xlLmluZm8oJG9iai50eXBlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkdHlwZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovdHlwZScpO1xuICovXG5cbmV4cG9ydHMuYXNzaWduID0gcmVxdWlyZSgnLi9hc3NpZ24nKTtcbmV4cG9ydHMuY292ZXIgPSByZXF1aXJlKCcuL2NvdmVyJyk7XG5leHBvcnRzLmZpbmQgPSByZXF1aXJlKCcuL2ZpbmQnKTtcbmV4cG9ydHMudHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xuIiwiLyoqXG4gKiDojrflj5bmlbDmja7nsbvlnotcbiAqIEBtZXRob2QgdHlwZVxuICogQHBhcmFtIHsqfSBpdGVtIOS7u+S9leexu+Wei+aVsOaNrlxuICogQHJldHVybnMge1N0cmluZ30g5a+56LGh57G75Z6LXG4gKiBAZXhhbXBsZVxuICogdmFyICR0eXBlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL29iai90eXBlJyk7XG4gKiAkdHlwZSh7fSk7IC8vICdvYmplY3QnXG4gKiAkdHlwZSgxKTsgLy8gJ251bWJlcidcbiAqICR0eXBlKCcnKTsgLy8gJ3N0cmluZydcbiAqICR0eXBlKGZ1bmN0aW9uKCl7fSk7IC8vICdmdW5jdGlvbidcbiAqICR0eXBlKCk7IC8vICd1bmRlZmluZWQnXG4gKiAkdHlwZShudWxsKTsgLy8gJ251bGwnXG4gKiAkdHlwZShuZXcgRGF0ZSgpKTsgLy8gJ2RhdGUnXG4gKiAkdHlwZSgvYS8pOyAvLyAncmVnZXhwJ1xuICogJHR5cGUoU3ltYm9sKCdhJykpOyAvLyAnc3ltYm9sJ1xuICogJHR5cGUod2luZG93KSAvLyAnd2luZG93J1xuICogJHR5cGUoZG9jdW1lbnQpIC8vICdodG1sZG9jdW1lbnQnXG4gKiAkdHlwZShkb2N1bWVudC5ib2R5KSAvLyAnaHRtbGJvZHllbGVtZW50J1xuICogJHR5cGUoZG9jdW1lbnQuaGVhZCkgLy8gJ2h0bWxoZWFkZWxlbWVudCdcbiAqICR0eXBlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKSkgLy8gJ2h0bWxjb2xsZWN0aW9uJ1xuICogJHR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpWzBdKSAvLyAnaHRtbGRpdmVsZW1lbnQnXG4gKi9cblxuZnVuY3Rpb24gdHlwZSAoaXRlbSkge1xuXHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXHRcdC5jYWxsKGl0ZW0pXG5cdFx0LnRvTG93ZXJDYXNlKClcblx0XHQucmVwbGFjZSgvXlxcW29iamVjdFxccyp8XFxdJC9naSwgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7XG4iLCIvKipcbiAqIOiOt+WPluWtl+espuS4sumVv+W6pu+8jOS4gOS4quS4reaWh+eulzLkuKrlrZfnrKZcbiAqIEBtZXRob2QgYkxlbmd0aFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDopoHorqHnrpfplb/luqbnmoTlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWtl+espuS4sumVv+W6plxuICogQGV4YW1wbGVcbiAqIHZhciAkYkxlbmd0aCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvYkxlbmd0aCcpO1xuICogJGJMZW5ndGgoJ+S4reaWh2NjJyk7IC8vIDZcbiAqL1xuXG5mdW5jdGlvbiBiTGVuZ3RoIChzdHIpIHtcblx0dmFyIGFNYXRjaDtcblx0aWYgKCFzdHIpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXHRhTWF0Y2ggPSBzdHIubWF0Y2goL1teXFx4MDAtXFx4ZmZdL2cpO1xuXHRyZXR1cm4gKHN0ci5sZW5ndGggKyAoIWFNYXRjaCA/IDAgOiBhTWF0Y2gubGVuZ3RoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYkxlbmd0aDtcbiIsIi8qKlxuICog5YWo6KeS5a2X56ym6L2s5Y2K6KeS5a2X56ymXG4gKiBAbWV0aG9kIGRiY1RvU2JjXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWMheWQq+S6huWFqOinkuWtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g57uP6L+H6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRkYmNUb1NiYyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZGJjVG9TYmMnKTtcbiAqICRkYmNUb1NiYygn77yz77yh77yh77yz77yk77ym77yz77yh77yk77ymJyk7IC8vICdTQUFTREZTQURGJ1xuICovXG5cbmZ1bmN0aW9uIGRiY1RvU2JjIChzdHIpIHtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9bXFx1ZmYwMS1cXHVmZjVlXS9nLCBmdW5jdGlvbiAoYSkge1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGEuY2hhckNvZGVBdCgwKSAtIDY1MjQ4KTtcblx0fSkucmVwbGFjZSgvXFx1MzAwMC9nLCAnICcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRiY1RvU2JjO1xuIiwiLyoqXG4gKiDop6PnoIFIVE1M77yM5bCG5a6e5L2T5a2X56ym6L2s5o2i5Li6SFRNTOWtl+esplxuICogQG1ldGhvZCBkZWNvZGVIVE1MXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWQq+acieWunuS9k+Wtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gSFRNTOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZGVjb2RlSFRNTCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZGVjb2RlSFRNTCcpO1xuICogJGRlY29kZUhUTUwoJyZhbXA7Jmx0OyZndDsmcXVvdDsmIzM5OyYjMzI7Jyk7IC8vICcmPD5cIlxcJyAnXG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlSFRNTCAoc3RyKSB7XG5cdGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignZGVjb2RlSFRNTCBuZWVkIGEgc3RyaW5nIGFzIHBhcmFtZXRlcicpO1xuXHR9XG5cdHJldHVybiBzdHIucmVwbGFjZSgvJnF1b3Q7L2csICdcIicpXG5cdFx0LnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuXHRcdC5yZXBsYWNlKC8mZ3Q7L2csICc+Jylcblx0XHQucmVwbGFjZSgvJiMzOTsvZywgJ1xcJycpXG5cdFx0LnJlcGxhY2UoLyZuYnNwOy9nLCAnXFx1MDBBMCcpXG5cdFx0LnJlcGxhY2UoLyYjMzI7L2csICdcXHUwMDIwJylcblx0XHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWNvZGVIVE1MO1xuIiwiLyoqXG4gKiDnvJbnoIFIVE1M77yM5bCGSFRNTOWtl+espui9rOS4uuWunuS9k+Wtl+esplxuICogQG1ldGhvZCBlbmNvZGVIVE1MXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWQq+aciUhUTUzlrZfnrKbnmoTlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOe7j+i/h+i9rOaNoueahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZW5jb2RlSFRNTCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZW5jb2RlSFRNTCcpO1xuICogJGVuY29kZUhUTUwoYCY8PlwiXFwnIGApOyAvLyAnJmFtcDsmbHQ7Jmd0OyZxdW90OyYjMzk7JiMzMjsnXG4gKi9cblxuZnVuY3Rpb24gZW5jb2RlSFRNTCAoc3RyKSB7XG5cdGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignZW5jb2RlSFRNTCBuZWVkIGEgc3RyaW5nIGFzIHBhcmFtZXRlcicpO1xuXHR9XG5cdHJldHVybiBzdHIucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuXHRcdC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jylcblx0XHQucmVwbGFjZSgvPC9nLCAnJmx0OycpXG5cdFx0LnJlcGxhY2UoLz4vZywgJyZndDsnKVxuXHRcdC5yZXBsYWNlKC8nL2csICcmIzM5OycpXG5cdFx0LnJlcGxhY2UoL1xcdTAwQTAvZywgJyZuYnNwOycpXG5cdFx0LnJlcGxhY2UoLyhcXHUwMDIwfFxcdTAwMEJ8XFx1MjAyOHxcXHUyMDI5fFxcZikvZywgJyYjMzI7Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW5jb2RlSFRNTDtcbiIsIi8qKlxuICog6I635Y+WMzbov5vliLbpmo/mnLrlrZfnrKbkuLJcbiAqIEBtZXRob2QgZ2V0Um5kMzZcbiAqIEBwYXJhbSB7RmxvYXR9IFtybmRdIOmaj+acuuaVsO+8jOS4jeS8oOWImeeUn+aIkOS4gOS4qumaj+acuuaVsFxuICogQHJldHVybiB7U3RyaW5nfSDovazmiJDkuLozNui/m+WItueahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0Um5kMzYgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2dldFJuZDM2Jyk7XG4gKiAkZ2V0Um5kMzYoMC41ODEwNzY2ODMyNTkwNDQ2KTsgLy8gJ2t4MnBveno5cmdmJ1xuICovXG5cbmZ1bmN0aW9uIGdldFJuZDM2IChybmQpIHtcblx0cm5kID0gcm5kIHx8IE1hdGgucmFuZG9tKCk7XG5cdHJldHVybiBybmQudG9TdHJpbmcoMzYpLnJlcGxhY2UoL14wLi8sICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSbmQzNjtcbiIsIi8qKlxuICog6I635Y+WMzbov5vliLbml6XmnJ/lrZfnrKbkuLJcbiAqIEBtZXRob2QgZ2V0VGltZTM2XG4gKiBAcGFyYW0ge0RhdGV9IFtkYXRlXSDnrKblkIjop4TojIPnmoTml6XmnJ/lrZfnrKbkuLLmiJbogIXmlbDlrZfvvIzkuI3kvKDlj4LmlbDliJnkvb/nlKjlvZPliY3lrqLmiLfnq6/ml7bpl7RcbiAqIEByZXR1cm4ge1N0cmluZ30g6L2s5oiQ5Li6Mzbov5vliLbnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFRpbWUzNiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VGltZTM2Jyk7XG4gKiAkZ2V0VGltZTM2KCcyMDIwJyk7IC8vICdrNHVqYWlvMCdcbiAqL1xuXG5mdW5jdGlvbiBnZXRUaW1lMzYgKGRhdGUpIHtcblx0ZGF0ZSA9IGRhdGUgPyBuZXcgRGF0ZShkYXRlKSA6IG5ldyBEYXRlKCk7XG5cdHJldHVybiBkYXRlLmdldFRpbWUoKS50b1N0cmluZygzNik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGltZTM2O1xuIiwiLyoqXG4gKiDnlJ/miJDkuIDkuKrkuI3kuI7kuYvliY3ph43lpI3nmoTpmo/mnLrlrZfnrKbkuLJcbiAqIEBtZXRob2QgZ2V0VW5pcXVlS2V5XG4gKiBAcmV0dXJucyB7U3RyaW5nfSDpmo/mnLrlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFVuaXF1ZUtleSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VW5pcXVlS2V5Jyk7XG4gKiAkZ2V0VW5pcXVlS2V5KCk7IC8vICcxNjZhYWUxZmE5ZidcbiAqL1xuXG52YXIgdGltZSA9ICtuZXcgRGF0ZSgpO1xudmFyIGluZGV4ID0gMTtcblxuZnVuY3Rpb24gZ2V0VW5pcXVlS2V5ICgpIHtcblx0cmV0dXJuICh0aW1lICsgKGluZGV4KyspKS50b1N0cmluZygxNik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VW5pcXVlS2V5O1xuIiwiLyoqXG4gKiDlsIbpqbzls7DmoLzlvI/lj5jkuLrov57lrZfnrKbmoLzlvI9cbiAqIEBtZXRob2QgaHlwaGVuYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmpvOWzsOagvOW8j+eahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g6L+e5a2X56ym5qC85byP55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRoeXBoZW5hdGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2h5cGhlbmF0ZScpO1xuICogJGh5cGhlbmF0ZSgnbGliS2l0U3RySHlwaGVuYXRlJyk7IC8vICdsaWIta2l0LXN0ci1oeXBoZW5hdGUnXG4gKi9cblxuZnVuY3Rpb24gaHlwaGVuYXRlIChzdHIpIHtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAoJDApIHtcblx0XHRyZXR1cm4gJy0nICsgJDAudG9Mb3dlckNhc2UoKTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwaGVuYXRlO1xuIiwiLyoqXG4gKiAjIOWtl+espuS4suWkhOeQhuS4juWIpOaWrVxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvc3RyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9zdHJcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvc3RyXG4gKiB2YXIgJHN0ciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHInKTtcbiAqIGNvbnNvbGUuaW5mbygkc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRzdWJzdGl0dXRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9zdWJzdGl0dXRlJyk7XG4gKi9cblxuZXhwb3J0cy5iTGVuZ3RoID0gcmVxdWlyZSgnLi9iTGVuZ3RoJyk7XG5leHBvcnRzLmRiY1RvU2JjID0gcmVxdWlyZSgnLi9kYmNUb1NiYycpO1xuZXhwb3J0cy5kZWNvZGVIVE1MID0gcmVxdWlyZSgnLi9kZWNvZGVIVE1MJyk7XG5leHBvcnRzLmVuY29kZUhUTUwgPSByZXF1aXJlKCcuL2VuY29kZUhUTUwnKTtcbmV4cG9ydHMuZ2V0Um5kMzYgPSByZXF1aXJlKCcuL2dldFJuZDM2Jyk7XG5leHBvcnRzLmdldFRpbWUzNiA9IHJlcXVpcmUoJy4vZ2V0VGltZTM2Jyk7XG5leHBvcnRzLmdldFVuaXF1ZUtleSA9IHJlcXVpcmUoJy4vZ2V0VW5pcXVlS2V5Jyk7XG5leHBvcnRzLmh5cGhlbmF0ZSA9IHJlcXVpcmUoJy4vaHlwaGVuYXRlJyk7XG5leHBvcnRzLmlwVG9IZXggPSByZXF1aXJlKCcuL2lwVG9IZXgnKTtcbmV4cG9ydHMubGVmdEIgPSByZXF1aXJlKCcuL2xlZnRCJyk7XG5leHBvcnRzLnNpemVPZlVURjhTdHJpbmcgPSByZXF1aXJlKCcuL3NpemVPZlVURjhTdHJpbmcnKTtcbmV4cG9ydHMuc3Vic3RpdHV0ZSA9IHJlcXVpcmUoJy4vc3Vic3RpdHV0ZScpO1xuIiwiLyoqXG4gKiDljYHov5vliLZJUOWcsOWdgOi9rOWNgeWFrei/m+WItlxuICogQG1ldGhvZCBpcFRvSGV4XG4gKiBAcGFyYW0ge1N0cmluZ30gaXAg5Y2B6L+b5Yi25pWw5a2X55qESVBWNOWcsOWdgFxuICogQHJldHVybiB7U3RyaW5nfSAxNui/m+WItuaVsOWtl0lQVjTlnLDlnYBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGlwVG9IZXggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2lwVG9IZXgnKTtcbiAqICRpcFRvSGV4KCcyNTUuMjU1LjI1NS4yNTUnKTsgLy9yZXR1cm4gJ2ZmZmZmZmZmJ1xuICovXG5cbmZ1bmN0aW9uIGlwVG9IZXggKGlwKSB7XG5cdHJldHVybiBpcC5yZXBsYWNlKC8oXFxkKylcXC4qL2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtKSB7XG5cdFx0bnVtID0gcGFyc2VJbnQobnVtLCAxMCkgfHwgMDtcblx0XHRudW0gPSBudW0udG9TdHJpbmcoMTYpO1xuXHRcdGlmIChudW0ubGVuZ3RoIDwgMikge1xuXHRcdFx0bnVtID0gJzAnICsgbnVtO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVtO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpcFRvSGV4O1xuIiwiLyoqXG4gKiDku47lt6bliLDlj7Plj5blrZfnrKbkuLLvvIzkuK3mlofnrpfkuKTkuKrlrZfnrKZcbiAqIEBtZXRob2QgbGVmdEJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5zXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxlZnRCID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9sZWZ0QicpO1xuICogLy/lkJHmsYnnvJboh7TmlaxcbiAqICRsZWZ0Qign5LiW55WM55yf5ZKM6LCQJywgNik7IC8vICfkuJbnlYznnJ8nXG4qL1xuXG52YXIgJGJMZW5ndGggPSByZXF1aXJlKCcuL2JMZW5ndGgnKTtcblxuZnVuY3Rpb24gbGVmdEIgKHN0ciwgbGVucykge1xuXHR2YXIgcyA9IHN0ci5yZXBsYWNlKC9cXCovZywgJyAnKVxuXHRcdC5yZXBsYWNlKC9bXlxceDAwLVxceGZmXS9nLCAnKionKTtcblx0c3RyID0gc3RyLnNsaWNlKDAsIHMuc2xpY2UoMCwgbGVucylcblx0XHQucmVwbGFjZSgvXFwqXFwqL2csICcgJylcblx0XHQucmVwbGFjZSgvXFwqL2csICcnKS5sZW5ndGgpO1xuXHRpZiAoJGJMZW5ndGgoc3RyKSA+IGxlbnMgJiYgbGVucyA+IDApIHtcblx0XHRzdHIgPSBzdHIuc2xpY2UoMCwgc3RyLmxlbmd0aCAtIDEpO1xuXHR9XG5cdHJldHVybiBzdHI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGVmdEI7XG4iLCIvKipcbiAqIOWPluWtl+espuS4siB1dGY4IOe8lueggemVv+W6pu+8jGZyb20g546L6ZuG6bmEXG4gKiBAbWV0aG9kIHNpemVPZlVURjhTdHJpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWtl+espuS4sumVv+W6plxuICogQGV4YW1wbGVcbiAqIHZhciAkc2l6ZU9mVVRGOFN0cmluZyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvc2l6ZU9mVVRGOFN0cmluZycpO1xuICogJHNpemVPZlVURjhTdHJpbmcoJ+S4reaWh2NjJyk7IC8vcmV0dXJuIDhcbiovXG5cbmZ1bmN0aW9uIHNpemVPZlVURjhTdHJpbmcgKHN0cikge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB1bmVzY2FwZSAhPT0gJ3VuZGVmaW5lZCdcblx0XHRcdD8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpLmxlbmd0aFxuXHRcdFx0OiBuZXcgQXJyYXlCdWZmZXIoc3RyLCAndXRmOCcpLmxlbmd0aFxuXHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpemVPZlVURjhTdHJpbmc7XG4iLCIvKipcbiAqIOeugOWNleaooeadv+WHveaVsFxuICogQG1ldGhvZCBzdWJzdGl0dXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOimgeabv+aNouaooeadv+eahOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDmqKHmnb/lr7nlupTnmoTmlbDmja7lr7nosaFcbiAqIEBwYXJhbSB7UmVnRXhwfSBbcmVnPS9cXFxcP1xce1xceyhbXnt9XSspXFx9XFx9L2ddIOino+aekOaooeadv+eahOato+WImeihqOi+vuW8j1xuICogQHJldHVybiB7U3RyaW5nfSDmm7/mjaLkuobmqKHmnb/nmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHN1YnN0aXR1dGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL3N1YnN0aXR1dGUnKTtcbiAqICRzdWJzdGl0dXRlKCd7e2NpdHl9feasoui/juaCqCcsIHtjaXR5OifljJfkuqwnfSk7IC8vICfljJfkuqzmrKLov47mgqgnXG4gKi9cblxuZnVuY3Rpb24gc3Vic3RpdHV0ZSAoc3RyLCBvYmosIHJlZykge1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UocmVnIHx8ICgvXFxcXD9cXHtcXHsoW157fV0rKVxcfVxcfS9nKSwgZnVuY3Rpb24gKG1hdGNoLCBuYW1lKSB7XG5cdFx0aWYgKG1hdGNoLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoMSk7XG5cdFx0fVxuXHRcdC8vIOazqOaEj++8mm9ialtuYW1lXSAhPSBudWxsIOetieWQjOS6jiBvYmpbbmFtZV0gIT09IG51bGwgJiYgb2JqW25hbWVdICE9PSB1bmRlZmluZWRcblx0XHRyZXR1cm4gKG9ialtuYW1lXSAhPSBudWxsKSA/IG9ialtuYW1lXSA6ICcnO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdWJzdGl0dXRlO1xuIiwiLyoqXG4gKiDmj5DkvpvlgJLorqHml7blmajnu5/kuIDlsIHoo4VcbiAqIEBtZXRob2QgY291bnREb3duXG4gKiBAcGFyYW0ge09iamVjdH0gc3BlYyDpgInpoblcbiAqIEBwYXJhbSB7RGF0ZX0gW3NwZWMuYmFzZV0g55+r5q2j5pe26Ze077yM5aaC5p6c6ZyA6KaB55So5pyN5Yqh56uv5pe26Ze055+r5q2j5YCS6K6h5pe277yM5L2/55So5q2k5Y+C5pWwXG4gKiBAcGFyYW0ge0RhdGV9IFtzcGVjLnRhcmdldD1EYXRlLm5vdygpICsgMzAwMF0g55uu5qCH5pe26Ze0XG4gKiBAcGFyYW0ge051bWJlcn0gW3NwZWMuaW50ZXJ2YWw9MTAwMF0g5YCS6K6h5pe26Kem5Y+R6Ze06ZqUXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5vbkNoYW5nZV0g5YCS6K6h5pe26Kem5Y+R5Y+Y5pu055qE5LqL5Lu25Zue6LCDXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5vblN0b3BdIOWAkuiuoeaXtue7k+adn+eahOWbnuiwg1xuICogQHJldHVybnMge09iamVjdH0g5YCS6K6h5pe25a+56LGh5a6e5L6LXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb3VudERvd24gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdGltZS9jb3VudERvd24nKTtcbiAqIHZhciB0YXJnZXQgPSBEYXRlLm5vdygpICsgNTAwMDtcbiAqIHZhciBjZDEgPSAkY291bnREb3duKHtcbiAqICAgdGFyZ2V0IDogdGFyZ2V0LFxuICogICBvbkNoYW5nZSA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMSBjaGFuZ2UnLCBkZWx0YSk7XG4gKiAgIH0sXG4gKiAgIG9uU3RvcCA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMSBzdG9wJywgZGVsdGEpO1xuICogICB9XG4gKiB9KTtcbiAqIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAqICAgLy90cmlnZ2VyIHN0b3BcbiAqICAgY2QxLnN0b3AoKTtcbiAqIH0sIDIwMDApO1xuICogdmFyIGNkMiA9IGNvdW50RG93bih7XG4gKiAgIHRhcmdldCA6IHRhcmdldCxcbiAqICAgaW50ZXJ2YWwgOiAyMDAwLFxuICogICBvbkNoYW5nZSA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMiBjaGFuZ2UnLCBkZWx0YSk7XG4gKiAgIH0sXG4gKiAgIG9uU3RvcCA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMiBzdG9wJywgZGVsdGEpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgJGVyYXNlID0gcmVxdWlyZSgnLi4vYXJyL2VyYXNlJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxudmFyIGFsbE1vbml0b3JzID0ge307XG52YXIgbG9jYWxCYXNlVGltZSA9IERhdGUubm93KCk7XG5cbmZ1bmN0aW9uIGNvdW50RG93biAoc3BlYykge1xuXHR2YXIgdGhhdCA9IHt9O1xuXG5cdC8vIOS4uuS7gOS5iOS4jeS9v+eUqCB0aW1lTGVmdCDlj4LmlbDmm7/mjaIgYmFzZSDlkowgdGFyZ2V0OlxuXHQvLyDlpoLmnpznlKggdGltZUxlZnQg5L2c5Li65Y+C5pWw77yM6K6h5pe25Zmo5Yid5aeL5YyW5LmL5YmN5aaC5p6c5pyJ6L+b56iL6Zi75aGe77yM5pyJ5Y+v6IO95Lya5a+86Ie05LiO55uu5qCH5pe26Ze05Lqn55Sf6K+v5beuXG5cdC8vIOmhtemdouWkmuS4quWumuaXtuWZqOS4gOi1t+WIneWni+WMluaXtu+8jOS8muWHuueOsOiuoeaXtuWZqOabtOaWsOS4jeWQjOatpeeahOeOsOixoe+8jOWQjOaXtuW8leWPkemhtemdouWkmuWkhOayoeacieS4gOi1t+Wbnua1gVxuXHQvLyDkv53nlZnnm67liY3ov5nkuKrmlrnmoYjvvIznlKjkuo7pnIDopoHnsr7noa7lgJLorqHml7bnmoTmg4XlhrVcblx0dmFyIGNvbmYgPSAkYXNzaWduKHtcblx0XHRiYXNlOiBudWxsLFxuXHRcdHRhcmdldDogRGF0ZS5ub3coKSArIDMwMDAsXG5cdFx0aW50ZXJ2YWw6IDEwMDAsXG5cdFx0b25DaGFuZ2U6IG51bGwsXG5cdFx0b25TdG9wOiBudWxsXG5cdH0sIHNwZWMpO1xuXG5cdHZhciB0aW1lRGlmZiA9IDA7XG5cdHZhciB0YXJnZXQgPSArbmV3IERhdGUoY29uZi50YXJnZXQpO1xuXHR2YXIgaW50ZXJ2YWwgPSBwYXJzZUludChjb25mLmludGVydmFsLCAxMCkgfHwgMDtcblx0dmFyIG9uQ2hhbmdlID0gY29uZi5vbkNoYW5nZTtcblx0dmFyIG9uU3RvcCA9IGNvbmYub25TdG9wO1xuXG5cdC8vIOS9v+WAkuiuoeaXtuinpuWPkeaXtumXtOeyvuehruWMllxuXHQvLyDkvb/nlKjlm7rlrprnmoTop6blj5HpopHnjofvvIzlh4/lsJHpnIDopoHliJvlu7rnmoTlrprml7blmahcblx0dmFyIHRpbWVJbnRlcnZhbCA9IGludGVydmFsO1xuXHRpZiAodGltZUludGVydmFsIDwgNTAwKSB7XG5cdFx0dGltZUludGVydmFsID0gMTA7XG5cdH0gZWxzZSBpZiAodGltZUludGVydmFsIDwgNTAwMCkge1xuXHRcdHRpbWVJbnRlcnZhbCA9IDEwMDtcblx0fSBlbHNlIHtcblx0XHR0aW1lSW50ZXJ2YWwgPSAxMDAwO1xuXHR9XG5cblx0dmFyIGRlbHRhO1xuXHR2YXIgY3VyVW5pdDtcblxuXHR2YXIgdXBkYXRlID0gZnVuY3Rpb24obm93KSB7XG5cdFx0ZGVsdGEgPSB0YXJnZXQgLSBub3c7XG5cdFx0dmFyIHVuaXQgPSBNYXRoLmNlaWwoZGVsdGEgLyBpbnRlcnZhbCk7XG5cdFx0aWYgKHVuaXQgIT09IGN1clVuaXQpIHtcblx0XHRcdGN1clVuaXQgPSB1bml0O1xuXHRcdFx0aWYgKHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRvbkNoYW5nZShkZWx0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiDph43orr7nm67moIfml7bpl7Rcblx0ICogQG1ldGhvZCBjb3VudERvd24jc2V0VGFyZ2V0XG5cdCAqIEBtZW1iZXJvZiBjb3VudERvd25cblx0ICogQGV4YW1wbGVcblx0ICogdmFyIGNkID0gY291bnREb3duKCk7XG5cdCAqIHZhciBsb2NhbFRpbWUgPSAnMjAxOS8wMS8wMSc7XG5cdCAqIGNkLnNldFRhcmdldChzZXJ2ZXJUaW1lKTtcblx0ICovXG5cdHRoYXQuc2V0VGFyZ2V0ID0gZnVuY3Rpb24gKHRpbWUpIHtcblx0XHR0YXJnZXQgPSArbmV3IERhdGUodGltZSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIOe6oOato+aXtumXtOW3rlxuXHQgKiBAbWV0aG9kIGNvdW50RG93biNjb3JyZWN0XG5cdCAqIEBtZW1iZXJvZiBjb3VudERvd25cblx0ICogQGV4YW1wbGVcblx0ICogdmFyIGNkID0gY291bnREb3duKCk7XG5cdCAqIHZhciBzZXJ2ZXJUaW1lID0gJzIwMTkvMDEvMDEnO1xuXHQgKiB2YXIgbG9jYWxUaW1lID0gJzIwMjAvMDEvMDEnO1xuXHQgKiBjZC5jb3JyZWN0KHNlcnZlclRpbWUpO1xuXHQgKiBjZC5jb3JyZWN0KHNlcnZlclRpbWUsIGxvY2FsVGltZSk7XG5cdCAqL1xuXHR0aGF0LmNvcnJlY3QgPSBmdW5jdGlvbihzZXJ2ZXJUaW1lLCBsb2NhbFRpbWUpIHtcblx0XHR2YXIgbm93ID0gbG9jYWxUaW1lID8gbmV3IERhdGUobG9jYWxUaW1lKSA6ICtuZXcgRGF0ZSgpO1xuXHRcdHZhciBzZXJ2ZXJEYXRlID0gc2VydmVyVGltZSA/IG5ldyBEYXRlKHNlcnZlclRpbWUpIDogMDtcblx0XHRpZiAoc2VydmVyRGF0ZSkge1xuXHRcdFx0dGltZURpZmYgPSBzZXJ2ZXJEYXRlIC0gbm93O1xuXHRcdH1cblx0fTtcblxuXHRpZiAoY29uZi5iYXNlKSB7XG5cdFx0dGhhdC5jb3JyZWN0KGNvbmYuYmFzZSk7XG5cdH1cblxuXHR2YXIgY2hlY2sgPSBmdW5jdGlvbihsb2NhbERlbHRhKSB7XG5cdFx0dmFyIG5vdyA9IGxvY2FsQmFzZVRpbWUgKyB0aW1lRGlmZiArIGxvY2FsRGVsdGE7XG5cdFx0dXBkYXRlKG5vdyk7XG5cdFx0aWYgKGRlbHRhIDw9IDApIHtcblx0XHRcdHRoYXQuc3RvcChub3cpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICog5YGc5q2i5YCS6K6h5pe2XG5cdCAqIEBtZXRob2QgY291bnREb3duI3N0b3Bcblx0ICogQG1lbWJlcm9mIGNvdW50RG93blxuXHQgKiBAZXhhbXBsZVxuXHQgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcblx0ICogY2Quc3RvcCgpO1xuXHQgKi9cblx0dGhhdC5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1vYmogPSBhbGxNb25pdG9yc1t0aW1lSW50ZXJ2YWxdO1xuXHRcdGlmIChtb2JqICYmIG1vYmoucXVldWUpIHtcblx0XHRcdCRlcmFzZShtb2JqLnF1ZXVlLCBjaGVjayk7XG5cdFx0fVxuXHRcdC8vIG9uU3RvcOS6i+S7tuinpuWPkeW/hemhu+WcqOS7jumYn+WIl+enu+mZpOWbnuiwg+S5i+WQjlxuXHRcdC8vIOWQpuWImeW+queOr+aOpeabv+eahOWumuaXtuWZqOS8muW8leWPkeatu+W+queOr1xuXHRcdGlmICh0eXBlb2Ygb25TdG9wID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRvblN0b3AoZGVsdGEpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICog6ZSA5q+B5YCS6K6h5pe2XG5cdCAqIEBtZXRob2QgY291bnREb3duI2Rlc3Ryb3lcblx0ICogQG1lbWJlcm9mIGNvdW50RG93blxuXHQgKiBAZXhhbXBsZVxuXHQgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcblx0ICogY2QuZGVzdHJveSgpO1xuXHQgKi9cblx0dGhhdC5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdFx0b25DaGFuZ2UgPSBudWxsO1xuXHRcdG9uU3RvcCA9IG51bGw7XG5cdFx0dGhhdC5zdG9wKCk7XG5cdH07XG5cblx0dmFyIG1vbml0b3IgPSBhbGxNb25pdG9yc1t0aW1lSW50ZXJ2YWxdO1xuXG5cdGlmICghbW9uaXRvcikge1xuXHRcdG1vbml0b3IgPSB7fTtcblx0XHRtb25pdG9yLnF1ZXVlID0gW107XG5cdFx0bW9uaXRvci5pbnNwZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdHZhciBtb2JqID0gYWxsTW9uaXRvcnNbdGltZUludGVydmFsXTtcblx0XHRcdHZhciBsb2NhbERlbHRhID0gbm93IC0gbG9jYWxCYXNlVGltZTtcblx0XHRcdGlmIChtb2JqLnF1ZXVlLmxlbmd0aCkge1xuXHRcdFx0XHQvLyDlvqrnjq/lvZPkuK3kvJrliKDpmaTmlbDnu4TlhYPntKDvvIzlm6DmraTpnIDopoHlhYjlpI3liLbkuIDkuIvmlbDnu4Rcblx0XHRcdFx0bW9iai5xdWV1ZS5zbGljZSgwKS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG5cdFx0XHRcdFx0Zm4obG9jYWxEZWx0YSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChtb2JqLnRpbWVyKTtcblx0XHRcdFx0YWxsTW9uaXRvcnNbdGltZUludGVydmFsXSA9IG51bGw7XG5cdFx0XHRcdGRlbGV0ZSBtb2JqLnRpbWVyO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0YWxsTW9uaXRvcnNbdGltZUludGVydmFsXSA9IG1vbml0b3I7XG5cdH1cblxuXHRtb25pdG9yLnF1ZXVlLnB1c2goY2hlY2spO1xuXG5cdGlmICghbW9uaXRvci50aW1lcikge1xuXHRcdG1vbml0b3IudGltZXIgPSBzZXRJbnRlcnZhbChtb25pdG9yLmluc3BlY3QsIHRpbWVJbnRlcnZhbCk7XG5cdH1cblxuXHRtb25pdG9yLmluc3BlY3QoKTtcblxuXHRyZXR1cm4gdGhhdDtcbn1cblxuY291bnREb3duLmFsbE1vbml0b3JzID0gYWxsTW9uaXRvcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGNvdW50RG93bjtcbiIsIi8qKlxuICogIyDml7bpl7TlpITnkIbkuI7kuqTkupLlt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL3RpbWVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL3RpbWVcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQudGltZS5wYXJzZVVuaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvdGltZVxuICogdmFyICR0aW1lID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUnKTtcbiAqIGNvbnNvbGUuaW5mbygkdGltZS5wYXJzZVVuaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRwYXJzZVVuaXQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdGltZS9wYXJzZVVuaXQnKTtcbiAqL1xuXG5leHBvcnRzLmNvdW50RG93biA9IHJlcXVpcmUoJy4vY291bnREb3duJyk7XG5leHBvcnRzLnBhcnNlVW5pdCA9IHJlcXVpcmUoJy4vcGFyc2VVbml0Jyk7XG4iLCIvKipcbiAqIOaXtumXtOaVsOWtl+aLhuWIhuS4uuWkqeaXtuWIhuenklxuICogQG1ldGhvZCBwYXJzZVVuaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIOavq+enkuaVsFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMubWF4VW5pdD0nZGF5J10g5ouG5YiG5pe26Ze055qE5pyA5aSn5Y2V5L2N77yM5Y+v6YCJIFsnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCddXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDmi4bliIblrozmiJDnmoTlpKnml7bliIbnp5JcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHBhcnNlVW5pdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy90aW1lL3BhcnNlVW5pdCcpO1xuICogY29uc29sZS5pbmZvKCAkcGFyc2VVbml0KDEyMzQ1ICogNjc4OTApICk7XG4gKiAvLyBPYmplY3Qge2RheTogOSwgaG91cjogMTYsIG1pbnV0ZTogNDgsIHNlY29uZDogMjIsIG1zOiA1MH1cbiAqIGNvbnNvbGUuaW5mbyggJHBhcnNlVW5pdCgxMjM0NSAqIDY3ODkwLCB7bWF4VW5pdCA6ICdob3VyJ30pICk7XG4gKiAvLyBPYmplY3Qge2hvdXI6IDIzMiwgbWludXRlOiA0OCwgc2Vjb25kOiAyMiwgbXM6IDUwfVxuICovXG5cbnZhciAkbnVtZXJpY2FsID0gcmVxdWlyZSgnLi4vbnVtL251bWVyaWNhbCcpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbnZhciBVTklUID0ge1xuXHRkYXk6IDI0ICogNjAgKiA2MCAqIDEwMDAsXG5cdGhvdXI6IDYwICogNjAgKiAxMDAwLFxuXHRtaW51dGU6IDYwICogMTAwMCxcblx0c2Vjb25kOiAxMDAwXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVuaXQodGltZSwgc3BlYykge1xuXHR2YXIgY29uZiA9ICRhc3NpZ24oe1xuXHRcdG1heFVuaXQ6ICdkYXknXG5cdH0sIHNwZWMpO1xuXG5cdHZhciBkYXRhID0ge307XG5cdHZhciBtYXhVbml0ID0gJG51bWVyaWNhbChVTklUW2NvbmYubWF4VW5pdF0pO1xuXHR2YXIgdURheSA9IFVOSVQuZGF5O1xuXHR2YXIgdUhvdXIgPSBVTklULmhvdXI7XG5cdHZhciB1TWludXRlID0gVU5JVC5taW51dGU7XG5cdHZhciB1U2Vjb25kID0gVU5JVC5zZWNvbmQ7XG5cblx0aWYgKG1heFVuaXQgPj0gdURheSkge1xuXHRcdHRpbWUgPSAkbnVtZXJpY2FsKHRpbWUpO1xuXHRcdGRhdGEuZGF5ID0gTWF0aC5mbG9vcih0aW1lIC8gdURheSk7XG5cdH1cblxuXHRpZiAobWF4VW5pdCA+PSB1SG91cikge1xuXHRcdHRpbWUgLT0gJG51bWVyaWNhbChkYXRhLmRheSAqIHVEYXkpO1xuXHRcdGRhdGEuaG91ciA9IE1hdGguZmxvb3IodGltZSAvIHVIb3VyKTtcblx0fVxuXG5cdGlmIChtYXhVbml0ID49IHVNaW51dGUpIHtcblx0XHR0aW1lIC09ICRudW1lcmljYWwoZGF0YS5ob3VyICogdUhvdXIpO1xuXHRcdGRhdGEubWludXRlID0gTWF0aC5mbG9vcih0aW1lIC8gdU1pbnV0ZSk7XG5cdH1cblxuXHRpZiAobWF4VW5pdCA+PSB1U2Vjb25kKSB7XG5cdFx0dGltZSAtPSAkbnVtZXJpY2FsKGRhdGEubWludXRlICogdU1pbnV0ZSk7XG5cdFx0ZGF0YS5zZWNvbmQgPSBNYXRoLmZsb29yKHRpbWUgLyB1U2Vjb25kKTtcblx0fVxuXG5cdGRhdGEubXMgPSB0aW1lIC0gZGF0YS5zZWNvbmQgKiB1U2Vjb25kO1xuXG5cdHJldHVybiBkYXRhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlVW5pdDtcbiIsIi8qKlxuICogQXJyYXlCdWZmZXLovawxNui/m+WItuWtl+espuS4slxuICogQG1ldGhvZCBhYlRvSGV4XG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIg6ZyA6KaB6L2s5o2i55qEIEFycmF5QnVmZmVyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAxNui/m+WItuWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkYWJUb0hleCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2FiVG9IZXgnKTtcbiAqIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAqIHZhciBkdiA9IG5ldyBEYXRhVmlldyhhYik7XG4gKiBkdi5zZXRVaW50OCgwLCAxNzEpO1xuICogZHYuc2V0VWludDgoMSwgMjA1KTtcbiAqICRhYlRvSGV4KGFiKTsgLy8gPT4gJ2FiY2QnXG4gKi9cblxuZnVuY3Rpb24gYWJUb0hleChidWZmZXIpIHtcblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChidWZmZXIpICE9PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXG5cdFx0bmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSxcblx0XHRmdW5jdGlvbihiaXQpIHtcblx0XHRcdHJldHVybiAoJzAwJyArIGJpdC50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcblx0XHR9XG5cdCkuam9pbignJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWJUb0hleDtcbiIsIi8qKlxuICogQVNDSUnlrZfnrKbkuLLovawxNui/m+WItuWtl+espuS4slxuICogQG1ldGhvZCBhc2NUb0hleFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpnIDopoHovazmjaLnmoRBU0NJSeWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gMTbov5vliLblrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGFzY1RvSGV4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvYXNjVG9IZXgnKTtcbiAqICRhc2NUb0hleCgpOyAvLyA9PiAnJ1xuICogJGFzY1RvSGV4KCcqKycpOyAvLyA9PiAnMmEyYidcbiAqL1xuXG5mdW5jdGlvbiBhc2NUb0hleChzdHIpIHtcblx0aWYgKCFzdHIpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblx0dmFyIGhleCA9ICcnO1xuXHR2YXIgaW5kZXg7XG5cdHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuXHRmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcblx0XHR2YXIgaW50ID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgpO1xuXHRcdHZhciBjb2RlID0gKGludCkudG9TdHJpbmcoMTYpO1xuXHRcdGhleCArPSBjb2RlO1xuXHR9XG5cdHJldHVybiBoZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNjVG9IZXg7XG4iLCIvKipcbiAqIDE26L+b5Yi25a2X56ym5Liy6L2sQXJyYXlCdWZmZXJcbiAqIEBtZXRob2QgaGV4VG9BYlxuICogQHNlZSBodHRwczovL2Nhbml1c2UuY29tLyNzZWFyY2g9QXJyYXlCdWZmZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg6ZyA6KaB6L2s5o2i55qEMTbov5vliLblrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0g6KKr6L2s5o2i5ZCO55qEIEFycmF5QnVmZmVyIOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkaGV4VG9BYiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2hleFRvQWInKTtcbiAqIHZhciBhYiA9ICRoZXhUb0FiKCk7XG4gKiBhYi5ieXRlTGVuZ3RoOyAvLyA9PiAwXG4gKiBhYiA9ICRoZXhUb0FiKCdhYmNkJyk7XG4gKiB2YXIgZHYgPSBuZXcgRGF0YVZpZXcoYWIpO1xuICogYWIuYnl0ZUxlbmd0aDsgLy8gPT4gMlxuICogZHYuZ2V0VWludDgoMCk7IC8vID0+IDE3MVxuICogZHYuZ2V0VWludDgoMSk7IC8vID0+IDIwNVxuICovXG5cbmZ1bmN0aW9uIGhleFRvQWIoc3RyKSB7XG5cdGlmICghc3RyKSB7XG5cdFx0cmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKTtcblx0fVxuXHR2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKE1hdGguY2VpbChzdHIubGVuZ3RoIC8gMikpO1xuXHR2YXIgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcblx0dmFyIGluZGV4ID0gMDtcblx0dmFyIGk7XG5cdHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuXHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcblx0XHR2YXIgY29kZSA9IHBhcnNlSW50KHN0ci5zdWJzdHIoaSwgMiksIDE2KTtcblx0XHRkYXRhVmlldy5zZXRVaW50OChpbmRleCwgY29kZSk7XG5cdFx0aW5kZXgrKztcblx0fVxuXHRyZXR1cm4gYnVmZmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhleFRvQWI7XG4iLCIvKipcbiAqIDE26L+b5Yi25a2X56ym5Liy6L2sQVNDSUnlrZfnrKbkuLJcbiAqIEBtZXRob2QgaGV4VG9Bc2NcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg6ZyA6KaB6L2s5o2i55qEMTbov5vliLblrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IEFTQ0lJ5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRoZXhUb0FzYyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2hleFRvQXNjJyk7XG4gKiAkaGV4VG9Bc2MoKTsgLy8gPT4gJydcbiAqICRoZXhUb0FzYygnMmEyYicpOyAvLyA9PiAnKisnXG4gKi9cblxuZnVuY3Rpb24gaGV4VG9Bc2MoaGV4KSB7XG5cdGlmICghaGV4KSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cdHJldHVybiBoZXgucmVwbGFjZSgvW1xcZGEtZl17Mn0vZ2ksIGZ1bmN0aW9uKG1hdGNoKSB7XG5cdFx0dmFyIGludCA9IHBhcnNlSW50KG1hdGNoLCAxNik7XG5cdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoaW50KTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGV4VG9Bc2M7XG4iLCIvKipcbiAqIEhTTOminOiJsuWAvOi9rOaNouS4ulJHQlxuICogLSDmjaLnrpflhazlvI/mlLnnvJboh6ogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfY29sb3Jfc3BhY2UuXG4gKiAtIGgsIHMsIOWSjCBsIOiuvuWumuWcqCBbMCwgMV0g5LmL6Ze0XG4gKiAtIOi/lOWbnueahCByLCBnLCDlkowgYiDlnKggWzAsIDI1NV3kuYvpl7RcbiAqIEBtZXRob2QgaHNsVG9SZ2JcbiAqIEBwYXJhbSB7TnVtYmVyfSBoIOiJsuebuFxuICogQHBhcmFtIHtOdW1iZXJ9IHMg6aWx5ZKM5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbCDkuq7luqZcbiAqIEByZXR1cm5zIHtBcnJheX0gUkdC6Imy5YC85pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRoc2xUb1JnYiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2hzbFRvUmdiJyk7XG4gKiAkaHNsVG9SZ2IoMCwgMCwgMCk7IC8vID0+IFswLDAsMF1cbiAqICRoc2xUb1JnYigwLCAwLCAxKTsgLy8gPT4gWzI1NSwyNTUsMjU1XVxuICogJGhzbFRvUmdiKDAuNTU1NTU1NTU1NTU1NTU1NSwgMC45Mzc0OTk5OTk5OTk5OTk5LCAwLjY4NjI3NDUwOTgwMzkyMTYpOyAvLyA9PiBbMTAwLDIwMCwyNTBdXG4gKi9cblxuZnVuY3Rpb24gaHVlVG9SZ2IocCwgcSwgdCkge1xuXHRpZiAodCA8IDApIHQgKz0gMTtcblx0aWYgKHQgPiAxKSB0IC09IDE7XG5cdGlmICh0IDwgMSAvIDYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuXHRpZiAodCA8IDEgLyAyKSByZXR1cm4gcTtcblx0aWYgKHQgPCAyIC8gMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIgLyAzIC0gdCkgKiA2O1xuXHRyZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gaHNsVG9SZ2IoaCwgcywgbCkge1xuXHR2YXIgcjtcblx0dmFyIGc7XG5cdHZhciBiO1xuXG5cdGlmIChzID09PSAwKSB7XG5cdFx0Ly8gYWNocm9tYXRpY1xuXHRcdHIgPSBsO1xuXHRcdGcgPSBsO1xuXHRcdGIgPSBsO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcblx0XHR2YXIgcCA9IDIgKiBsIC0gcTtcblx0XHRyID0gaHVlVG9SZ2IocCwgcSwgaCArIDEgLyAzKTtcblx0XHRnID0gaHVlVG9SZ2IocCwgcSwgaCk7XG5cdFx0YiA9IGh1ZVRvUmdiKHAsIHEsIGggLSAxIC8gMyk7XG5cdH1cblx0cmV0dXJuIFtNYXRoLnJvdW5kKHIgKiAyNTUpLCBNYXRoLnJvdW5kKGcgKiAyNTUpLCBNYXRoLnJvdW5kKGIgKiAyNTUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoc2xUb1JnYjtcbiIsIi8qKlxuICogIyDlhbbku5blt6Xlhbflh73mlbBcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL3V0aWxcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL3V0aWxcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQudXRpbC5oc2xUb1JnYik7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy91dGlsXG4gKiB2YXIgJHV0aWwgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdXRpbCcpO1xuICogY29uc29sZS5pbmZvKCR1dGlsLmhzbFRvUmdiKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkaHNsVG9SZ2IgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oc2xUb1JnYicpO1xuICovXG5cbmV4cG9ydHMuYWJUb0hleCA9IHJlcXVpcmUoJy4vYWJUb0hleCcpO1xuZXhwb3J0cy5hc2NUb0hleCA9IHJlcXVpcmUoJy4vYXNjVG9IZXgnKTtcbmV4cG9ydHMuaGV4VG9BYiA9IHJlcXVpcmUoJy4vaGV4VG9BYicpO1xuZXhwb3J0cy5oZXhUb0FzYyA9IHJlcXVpcmUoJy4vaGV4VG9Bc2MnKTtcbmV4cG9ydHMuaHNsVG9SZ2IgPSByZXF1aXJlKCcuL2hzbFRvUmdiJyk7XG5leHBvcnRzLmpvYiA9IHJlcXVpcmUoJy4vam9iJyk7XG5leHBvcnRzLm1lYXN1cmVEaXN0YW5jZSA9IHJlcXVpcmUoJy4vbWVhc3VyZURpc3RhbmNlJyk7XG5leHBvcnRzLnJnYlRvSHNsID0gcmVxdWlyZSgnLi9yZ2JUb0hzbCcpO1xuIiwiLyoqXG4gKiDku7vliqHliIbml7bmiafooYxcbiAqIC0g5LiA5pa56Z2i6YG/5YWN5Y2V5qyhcmVmbG935rWB56iL5omn6KGM5aSq5aSaanPku7vliqHlr7zoh7TmtY/op4jlmajljaHmrbtcbiAqIC0g5Y+m5LiA5pa56Z2i5Y2V5Liq5Lu75Yqh55qE5oql6ZSZ5LiN5Lya5b2x5ZON5ZCO57ut5Lu75Yqh55qE5omn6KGMXG4gKiBAbWV0aG9kIGpvYlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g5Lu75Yqh5Ye95pWwXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDku7vliqHpmJ/liJflr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGpvYiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2pvYicpO1xuICogJGpvYihmdW5jdGlvbigpIHtcbiAqICAgLy90YXNrMSBzdGFydFxuICogfSk7XG4gKiAkam9iKGZ1bmN0aW9uKCkge1xuICogICAvL3Rhc2syIHN0YXJ0XG4gKiB9KTtcbiAqL1xuXG52YXIgbWFuYWdlciA9IHt9O1xuXG5tYW5hZ2VyLnF1ZXVlID0gW107XG5cbm1hbmFnZXIuYWRkID0gZnVuY3Rpb24oZm4sIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG1hbmFnZXIucXVldWUucHVzaCh7XG5cdFx0Zm46IGZuLFxuXHRcdGNvbmY6IG9wdGlvbnNcblx0fSk7XG5cdG1hbmFnZXIuc3RlcCgpO1xufTtcblxubWFuYWdlci5zdGVwID0gZnVuY3Rpb24oKSB7XG5cdGlmICghbWFuYWdlci5xdWV1ZS5sZW5ndGggfHwgbWFuYWdlci50aW1lcikgeyByZXR1cm47IH1cblx0bWFuYWdlci50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGl0ZW0gPSBtYW5hZ2VyLnF1ZXVlLnNoaWZ0KCk7XG5cdFx0aWYgKGl0ZW0pIHtcblx0XHRcdGlmIChpdGVtLmZuICYmIHR5cGVvZiBpdGVtLmZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGl0ZW0uZm4uY2FsbChudWxsKTtcblx0XHRcdH1cblx0XHRcdG1hbmFnZXIudGltZXIgPSBudWxsO1xuXHRcdFx0bWFuYWdlci5zdGVwKCk7XG5cdFx0fVxuXHR9LCAxKTtcbn07XG5cbmZ1bmN0aW9uIGpvYihmbiwgb3B0aW9ucykge1xuXHRtYW5hZ2VyLmFkZChmbiwgb3B0aW9ucyk7XG5cdHJldHVybiBtYW5hZ2VyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGpvYjtcbiIsIi8qKlxuICog5rWL6YeP5Zyw55CG5Z2Q5qCH55qE6Led56a7XG4gKiBAbWV0aG9kIG1lYXN1cmVEaXN0YW5jZVxuICogQHBhcmFtIHtOdW1iZXJ9IGxhdDEg5Z2Q5qCHMeeyvuW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxuZzEg5Z2Q5qCHMee6rOW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxhdDIg5Z2Q5qCHMueyvuW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxuZzIg5Z2Q5qCHMue6rOW6plxuICogQHJldHVybnMge051bWJlcn0gMuS4quWdkOagh+S5i+mXtOeahOi3neemu++8iOWNg+exs++8iVxuICogQGV4YW1wbGVcbiAqIHZhciAkbWVhc3VyZURpc3RhbmNlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvbWVhc3VyZURpc3RhbmNlJyk7XG4gKiB2YXIgZGlzdGFuY2UgPSAkbWVhc3VyZURpc3RhbmNlKDAsIDAsIDEwMCwgMTAwKTtcbiAqIC8vIDk4MjYuNDAwNjUxMDk5NzhcbiAqL1xuXG5mdW5jdGlvbiBtZWFzdXJlRGlzdGFuY2UgKGxhdDEsIGxuZzEsIGxhdDIsIGxuZzIpIHtcblx0dmFyIHJhZExhdDEgPSAobGF0MSAqIE1hdGguUEkpIC8gMTgwLjA7XG5cdHZhciByYWRMYXQyID0gKGxhdDIgKiBNYXRoLlBJKSAvIDE4MC4wO1xuXHR2YXIgYSA9IHJhZExhdDEgLSByYWRMYXQyO1xuXHR2YXIgYiA9IChsbmcxICogTWF0aC5QSSkgLyAxODAuMCAtIChsbmcyICogTWF0aC5QSSkgLyAxODAuMDtcblx0dmFyIHMgPSAyICogTWF0aC5hc2luKFxuXHRcdE1hdGguc3FydChcblx0XHRcdE1hdGgucG93KE1hdGguc2luKGEgLyAyKSwgMilcblx0XHRcdCsgTWF0aC5jb3MocmFkTGF0MSkgKiBNYXRoLmNvcyhyYWRMYXQyKSAqIE1hdGgucG93KE1hdGguc2luKGIgLyAyKSwgMilcblx0XHQpXG5cdCk7XG5cdC8vIOWcsOeQg+WNiuW+hFxuXHRzICo9IDYzNzguMTM3O1xuXHRyZXR1cm4gcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZWFzdXJlRGlzdGFuY2U7XG4iLCIvKipcbiAqIFJHQiDpopzoibLlgLzovazmjaLkuLogSFNMLlxuICogLSDovazmjaLlhazlvI/lj4LogIPoh6ogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfY29sb3Jfc3BhY2UuXG4gKiAtIHIsIGcsIOWSjCBiIOmcgOimgeWcqCBbMCwgMjU1XSDojIPlm7TlhoVcbiAqIC0g6L+U5Zue55qEIGgsIHMsIOWSjCBsIOWcqCBbMCwgMV0g5LmL6Ze0XG4gKiBAcGFyYW0ge051bWJlcn0gciDnuqLoibLoibLlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBnIOe7v+iJsuiJsuWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IGIg6JOd6Imy6Imy5YC8XG4gKiBAcmV0dXJucyB7QXJyYXl9IEhTTOWQhOWAvOaVsOe7hFxuICogQGV4YW1wbGVcbiAqIHZhciAkcmdiVG9Ic2wgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdXRpbC9yZ2JUb0hzbCcpO1xuICogJHJnYlRvSHNsKDEwMCwgMjAwLCAyNTApOyAvLyA9PiBbMC41NTU1NTU1NTU1NTU1NTU1LDAuOTM3NDk5OTk5OTk5OTk5OSwwLjY4NjI3NDUwOTgwMzkyMTZdXG4gKiAkcmdiVG9Ic2woMCwgMCwgMCk7IC8vID0+IFswLDAsMF1cbiAqICRyZ2JUb0hzbCgyNTUsIDI1NSwgMjU1KTsgLy8gPT4gWzAsMCwxXVxuICovXG5cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcblx0ciAvPSAyNTU7XG5cdGcgLz0gMjU1O1xuXHRiIC89IDI1NTtcblx0dmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuXHR2YXJcdG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuXHR2YXIgaDtcblx0dmFyIHM7XG5cdHZhciBsID0gKG1heCArIG1pbikgLyAyO1xuXG5cdGlmIChtYXggPT09IG1pbikge1xuXHRcdC8vIGFjaHJvbWF0aWNcblx0XHRoID0gMDtcblx0XHRzID0gMDtcblx0fSBlbHNlIHtcblx0XHR2YXIgZCA9IG1heCAtIG1pbjtcblx0XHRzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG5cdFx0aWYgKG1heCA9PT0gcikge1xuXHRcdFx0aCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApO1xuXHRcdH0gZWxzZSBpZiAobWF4ID09PSBnKSB7XG5cdFx0XHRoID0gKGIgLSByKSAvIGQgKyAyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoID0gKHIgLSBnKSAvIGQgKyA0O1xuXHRcdH1cblx0XHRoIC89IDY7XG5cdH1cblxuXHRyZXR1cm4gW2gsIHMsIGxdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJnYlRvSHNsO1xuIl19
(1)
});
