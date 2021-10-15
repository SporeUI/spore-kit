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

function callUp(options) {
  var conf = $assign({
    protocol: '',
    fallbackUrl: '',
    action: null,
    startTime: new Date().getTime(),
    waiting: 800,
    waitingLimit: 50,
    fallback: function (fallbackUrl) {
      // 在一定时间内无法唤起客户端，跳转下载地址或到中间页
      window.location = fallbackUrl;
    },
    onFallback: null,
    onTimeout: null,
  }, options);

  var wId;
  var iframe;

  if (typeof conf.action === 'function') {
    conf.action();
  } else if ($browser().chrome) {
    // chrome下iframe无法唤起Android客户端，这里使用window.open
    // 另一个方案参考 https://developers.google.com/chrome/mobile/docs/intents
    var win = window.open(conf.protocol);
    wId = setInterval(function () {
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

  setTimeout(function () {
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
 * console.info($contains([1,2,3,4,5], 3)); // true
 */

function contains(arr, item) {
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
 * console.info($erase([1,2,3,4,5],3)); // [1,2,4,5]
 */

function erase(arr, item) {
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

function findInArr(arr, fn, context) {
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

function flatten(arr) {
  var array = [];
  for (var i = 0, l = arr.length; i < l; i += 1) {
    var type = $type(arr[i]);
    if (type === 'null') {
      continue;
    }
    var extraArr = type === 'array' ? flatten(arr[i]) : arr[i];
    array = array.concat(extraArr);
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
 * console.info($include([1,2,3],4)); // [1,2,3,4]
 * console.info($include([1,2,3],3)); // [1,2,3]
 */

var $contains = _dereq_('./contains');

function include(arr, item) {
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
  read: function (val) {
    return decodeURIComponent(val);
  },
  write: function (val) {
    return encodeURIComponent(val);
  },
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

var rLimit = function (num, w) {
  var str = $fixTo(num, w);
  var delta = str.length - w;
  return delta > 0 ? str.substr(delta) : str;
};

function format(dobj, spec) {
  var output = '';
  var data = {};
  var conf = $assign({
    weekday: '日一二三四五六'.split(''),
    template: '{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}',
  }, spec);

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
 *   $getTimeSplit(
 *     '2018-09-20',
 *     'month'
 *   )
 * ).toGMTString();
 * // Sat Sep 01 2018 00:00:00 GMT+0800 (中国标准时间)
 *
 * new Date(
 *   $getTimeSplit(
 *     '2018-09-20 19:23:36',
 *     'hour'
 *   )
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
  'year',
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
    [hour, minutes].join(':'),
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

var offset = function () {
  return {};
};

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
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
  chrome: (/chrome/i),
};

function detect(options, checkers) {
  var conf = $assign({
    ua: '',
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
  gecko: function (ua) {
    return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
  },
};

function detect(options, checkers) {
  var conf = $assign({
    ua: '',
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
  iphone: (/iphone/i),
};

function detect(options, checkers) {
  var conf = $assign({
    ua: '',
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
  android: function (ua) {
    return ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
  },
};

function detect(options, checkers) {
  var conf = $assign({
    ua: '',
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
 *   trident: 'trident',
 *   presto: /presto/,
 *   gecko: function(ua){
 *     return ua.indexOf('gecko') > -1 && ua.indexOf('khtml') === -1;
 *   }
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
    Object.keys(list).forEach(function (key) {
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

function webp() {
  if (isSupportWebp === null) {
    isSupportWebp = support();
  }
  return isSupportWebp;
}

webp.support = support;

module.exports = webp;

},{}],187:[function(_dereq_,module,exports){
/* eslint-disable no-underscore-dangle */
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
  keys = function (o) {
    var result = [];

    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name);
      }
    }
    return result;
  };
}

var Events = function () {};

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

Events.prototype.on = function (events, callback, context) {
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

Events.prototype.off = function (events, callback, context) {
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
Events.prototype.trigger = function (events) {
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
  for (i = 1, len = arguments.length; i < len; i += 1) {
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
Events.mixTo = function (receiver) {
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

var Listener = function (events) {
  this.privateWhiteList = {};
  this.privateReceiver = new $events();
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
  define: function (eventName) {
    this.privateWhiteList[eventName] = true;
  },
  /**
   * 移除白名单上定义的事件名称
   * @method Listener.prototype.undefine
   * @memberof Listener
   * @param {String} eventName
   */
  undefine: function (eventName) {
    delete this.privateWhiteList[eventName];
  },
  /**
   * 广播组件绑定事件
   * @see <a href="#events-prototype-on">events.prototype.on</a>
   * @method Listener.prototype.on
   * @memberof Listener
   * @param {String} eventName 要绑定的事件名称
   * @param {Function} fn 要绑定的事件回调函数
   */
  on: function () {
    this.privateReceiver.on.apply(this.privateReceiver, arguments);
  },
  /**
   * 广播组件移除事件
   * @see <a href="#events-prototype-off">events.prototype.off</a>
   * @method Listener.prototype.off
   * @memberof Listener
   * @param {String} eventName 要移除绑定的事件名称
   * @param {Function} fn 要移除绑定的事件回调函数
   */
  off: function () {
    this.privateReceiver.off.apply(this.privateReceiver, arguments);
  },
  /**
   * 广播组件派发事件
   * @see <a href="#events-prototype-trigger">events.prototype.trigger</a>
   * @method Listener.prototype.trigger
   * @memberof Listener
   * @param {String} eventName 要触发的事件名称
   * @param {...*} [arg] 事件参数
   */
  trigger: function (events) {
    var rest = [].slice.call(arguments, 1);

    // 按照Events.trigger的调用方式，第一个参数是用空格分隔的事件名称列表
    events = events.split(/\s+/);

    // 遍历事件列表，依据白名单决定事件是否激发
    events.forEach(function (evtName) {
      if (this.privateWhiteList[evtName]) {
        this.privateReceiver.trigger.apply(this.privateReceiver, [evtName].concat(rest));
      }
    }.bind(this));
  },
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
      }
      pos = pos.parentNode;
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

var tapStop = function (options) {
  var $ = window.$ || window.Zepto || window.jQuery;

  var conf = $.extend({
    // 遮罩存在时间
    delay: 500,
  }, options);

  if (!miniMask) {
    miniMask = $('<div></div>');
    miniMask.css({
      display: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      'margin-left': '-20px',
      'margin-top': '-20px',
      'z-index': 10000,
      'background-color': 'rgba(0,0,0,0)',
      width: '40px',
      height: '40px',
    }).appendTo(document.body);
  }

  if (!touchStartBound) {
    $(document).on('touchstart', function (evt) {
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
    left: pos.pageX + 'px',
    top: pos.pageY + 'px',
  });
  clearTimeout(timer);
  timer = setTimeout(function () {
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

function delay(fn, duration, bind) {
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

function lock(fn, delay, bind) {
  var timer = null;
  return function () {
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

function once(fn, bind) {
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
function prepare() {
  var queue = [];
  var condition = false;
  var model;

  var attampt = function (fn) {
    if (condition) {
      if (typeof fn === 'function') {
        fn(model);
      }
    } else {
      queue.push(fn);
    }
  };

  attampt.ready = function (data) {
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

function queue(fn, delay, bind) {
  var timer = null;
  var arr = [];
  return function () {
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
 *   this.length = $('#input').val().length;
 *   this.countWords();
 * }, 200, comp));
 */

function reqular(fn, delay, bind) {
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
/* eslint-disable no-plusplus */

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
  linear: function (t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function (t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function (t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function (t) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function (t) {
    return (--t) * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function (t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function (t) {
    return 1 - (--t) * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function (t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function (t) {
    return 1 + (--t) * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  },
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

function flashAction(options) {
  var conf = $assign({
    times: 3,
    delay: 100,
    actionOdd: null,
    actionEven: null,
    recover: null,
  }, options);

  var queue = [];
  for (var i = 0; i < conf.times * 2 + 1; i += 1) {
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
  for (var i = this.length; i >= 0; i -= 1) {
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
    var loopMethod = loop.bind(list);
    var loopDur = Math.round(1000 / fps);
    timers[fps] = $timer.setInterval(loopMethod, loopDur);
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
    this.options = $assign({
      fps: 60,
      duration: 500,
      transition: null,
      frames: null,
      frameSkip: true,
      link: 'ignore',
    }, options);
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
      this.frame += 1;
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
  },
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

function smoothScrollTo(node, spec) {
  var $ = window.$ || window.Zepto || window.jQuery;

  var conf = $assign({
    delta: 0,
    maxDelay: 3000,
    callback: null,
  }, spec);

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
      stayCount -= 1;
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

  var conf = $.extend({
    clone: true,
    placeholder: null,
    disableAndroid: false,
    offsetParent: null,
    styles: {},
  }, options);

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
    visibility: 'hidden',
  });

  that.sticky = function () {
    if (!that.isSticky) {
      that.isSticky = true;
      that.root.css('position', 'fixed');
      that.root.css(conf.styles);
      that.placeholder.insertBefore(that.root);
    }
  };

  that.unSticky = function () {
    if (that.isSticky) {
      that.isSticky = false;
      that.placeholder.remove();
      that.root.css('position', '');
      $.each(conf.styles, function (key) {
        that.root.css(key, '');
      });
    }
  };

  var origOffsetY = that.root.get(0).offsetTop;
  that.checkScrollY = function () {
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
        width: that.placeholder.width() + 'px',
      });
    } else {
      that.root.css({
        width: '',
      });
    }
  };

  that.init = function () {
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

var noop = function () {};

function factory(methodName) {
  var wrappedMethod = null;

  if (typeof window === 'undefined') return;
  var win = window;

  // 如果有对应名称的方法，直接返回该方法，否则返回带有对应浏览器前缀的方法
  var getPrefixMethod = function (name) {
    var upFirstName = name.charAt(0).toUpperCase() + name.substr(1);
    var method = win[name]
      || win['webkit' + upFirstName]
      || win['moz' + upFirstName]
      || win['o' + upFirstName]
      || win['ms' + upFirstName];
    if (typeof method === 'function') {
      return method.bind(win);
    }
    return null;
  };

  var localRequestAnimationFrame = getPrefixMethod('requestAnimationFrame');
  var localCancelAnimationFrame = getPrefixMethod('cancelAnimationFrame') || noop;

  if (localRequestAnimationFrame) {
    var clearTimer = function (obj) {
      if (obj.requestId && typeof obj.step === 'function') {
        obj.step = noop;
        localCancelAnimationFrame(obj.requestId);
        obj.requestId = 0;
      }
    };

    var setTimer = function (fn, delay, type) {
      var obj = {};
      var time = Date.now();
      delay = delay || 0;
      delay = Math.max(delay, 0);
      obj.step = function () {
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
      wrappedMethod = function (fn, delay) {
        return setTimer(fn, delay, 'interval');
      };
    } else if (methodName === 'setTimeout') {
      wrappedMethod = function (fn, delay) {
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

$fx.Transition = function (transition, params) {
  if ($type(params) !== 'array') {
    params = [params];
  }
  var easeIn = function (pos) {
    return transition(pos, params);
  };
  return $assign(easeIn, {
    easeIn: easeIn,
    easeOut: function (pos) {
      return 1 - transition(1 - pos, params);
    },
    easeInOut: function (pos) {
      return (
        (pos <= 0.5
          ? transition(2 * pos, params)
          : 2 - transition(2 * (1 - pos), params)) / 2
      );
    },
  });
};

var Transitions = {
  linear: function (zero) {
    return zero;
  },
};

Transitions.extend = function (transitions) {
  Object.keys(transitions).forEach(function (transition) {
    Transitions[transition] = new $fx.Transition(transitions[transition]);
  });
};

Transitions.extend({
  Pow: function (p, x) {
    return Math.pow(p, (x && x[0]) || 6);
  },

  Expo: function (p) {
    return Math.pow(2, 8 * (p - 1));
  },

  Circ: function (p) {
    return 1 - Math.sin(Math.acos(p));
  },

  Sine: function (p) {
    return 1 - Math.cos(p * Math.PI / 2);
  },

  Back: function (p, x) {
    x = (x && x[0]) || 1.618;
    return Math.pow(p, 2) * ((x + 1) * p - x);
  },

  Bounce: function (p) {
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

  Elastic: function (p, x) {
    return (
      // eslint-disable-next-line no-plusplus
      Math.pow(2, 10 * --p)
      * Math.cos(20 * p * Math.PI * ((x && x[0]) || 1) / 3)
    );
  },
});

['Quad', 'Cubic', 'Quart', 'Quint'].forEach(function (transition, i) {
  Transitions[transition] = new $fx.Transition(function (p) {
    return Math.pow(p, i + 2);
  });
});

$fx.statics({
  getTransition: function () {
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
  },
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
  var onLoad = options.onLoad || function () {};

  var script = document.createElement('script');
  script.async = 'async';
  script.src = src;

  if (charset) {
    script.charset = charset;
  }
  script.onreadystatechange = function () {
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

function get$() {
  var $;
  if (typeof window !== 'undefined') {
    $ = window.$ || window.jQuery || window.Zepto;
  }
  if (!$) {
    throw new Error('Need winddow.$ like jQuery or Zepto.');
  }
  return $;
}

function getHiddenBox() {
  var $ = get$();
  if (hiddenDiv === null) {
    hiddenDiv = $('<div/>').css('display', 'none');
    hiddenDiv.appendTo(document.body);
  }
  return hiddenDiv;
}

function getForm() {
  var $ = get$();
  var form = $('<form style="display:none;"></form>');
  form.appendTo(getHiddenBox());
  return form;
}

function getHiddenInput(form, name) {
  var $ = get$();
  var input = $(form).find('[name="' + name + '"]');
  if (!input.get(0)) {
    input = $('<input type="hidden" name="' + name + '" value=""/>');
    input.appendTo(form);
  }
  return input;
}

function getIframe(name) {
  var $ = get$();
  var html = [
    '<iframe',
    'id="' + name + '" ',
    'name="' + name + '"',
    'src="about:blank"',
    'style="display:none;"></iframe>',
  ].join(' ');
  var iframe = $(html);
  iframe.appendTo(getHiddenBox());
  return iframe;
}

function iframePost(spec) {
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
    success: $.noop,
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
      $.each(conf.data, function (index, item) {
        if (!item) {
          return;
        }
        var inputHtml = [
          '<input',
          'type="hidden"',
          'name="' + item.name + '"',
          'value="' + item.value + '">',
        ].join(' ');
        html.push(inputHtml);
      });
    } else if ($.isPlainObject(conf.data)) {
      $.each(conf.data, function (name, value) {
        var inputHtml = [
          '<input',
          'type="hidden"',
          'name="' + name + '"',
          'value="' + value + '">',
        ].join(' ');
        html.push(inputHtml);
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
    that.callback = function (rs) {
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
    method: that.method,
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
    charset: 'utf-8',
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
      },
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
      params.forEach(function (group) {
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
  }
  return query[name] || '';
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

function parse(url) {
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

function setQuery(url, query) {
  url = url || '';
  if (!query) { return url; }

  var reg = /([^?#]*)(\?{0,1}[^?#]*)(#{0,1}.*)/;
  return url.replace(reg, function (match, path, search, hash) {
    search = search || '';
    search = search.replace(/^\?/, '');

    var para = search.split('&').reduce(function (obj, pair) {
      var arr = pair.split('=');
      if (arr[0]) {
        obj[arr[0]] = arr[1];
      }
      return obj;
    }, {});

    Object.keys(query).forEach(function (key) {
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
      search = '?' + paraKeys.map(function (key) {
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

  initialize: function (options) {
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
  proxy: function (name) {
    var proxyArgs = Array.prototype.slice.call(arguments);
    return $proxy(this, name, proxyArgs);
  },

  /**
   * 移除所有绑定事件，清除用于绑定事件的代理函数
   * @method Base#destroy
   * @memberof Base
   */
  destroy: function () {
    this.setEvents('off');
    this.off();
    this.bound = null;
  },
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

  $forEach(events, function (method, handle) {
    var selector;
    var event;
    var fns = [];
    handle = handle.split(/\s+/);

    if (typeof method === 'string') {
      fns = method.split(/\s+/).map(function (fname) {
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
        fns.forEach(function (fn) {
          root[dlg](selector, event, fn);
        });
      }
    } else if ($isFunction(root[action])) {
      fns.forEach(function (fn) {
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
 * console.info(m2.get('b')); // 2
 *
 * m2.set('a', 3);
 * console.info(m2.get('b')); // 4
 *
 * m2.set('b', 5);
 * console.info(m2.get('b')); // 5
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
    bound[name] = function () {
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
 * obj1.role('button').trigger('click'); // 1
 * obj2.role('button').trigger('click'); // 2
 */

var $base = _dereq_('./base');
var $delegate = _dereq_('./delegate');

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
   * @memberof View
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
   * @memberof View
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
   * @memberof View
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
   * @memberof View
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
   * @memberof View
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
   * @memberof View
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
   * @memberof View
   */
  destroy: function () {
    this.delegate('off');
    this.supr();
    this.resetRoles();
    this.nodes = {};
  },
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

function comma(num) {
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
 * $fixTo(0, 2); //return '00'
 */

function fixTo(num, w) {
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

function limit(num, min, max) {
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

function numerical(str, def, sys) {
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

function assign(obj) {
  obj = obj || {};
  Array.prototype.slice.call(arguments, 1).forEach(function (source) {
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
 * console.info($cover(obj,{b: 3, c: 4})); //{a: 1, b: 3}
 */

function cover() {
  var args = Array.prototype.slice.call(arguments);
  var object = args.shift();
  if (object && typeof object.hasOwnProperty === 'function') {
    var keys = Object.keys(object);
    args.forEach(function (item) {
      if (item && typeof item.hasOwnProperty === 'function') {
        keys.forEach(function (key) {
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
    }
    pos = pos[name];
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

function type(item) {
  return Object.prototype.toString
    .call(item)
    .toLowerCase()
    .replace(/^\[object\s*|\]$/gi, '');
}

module.exports = type;

},{}],233:[function(_dereq_,module,exports){
/* eslint-disable no-control-regex */
/**
 * 获取字符串长度，一个中文算2个字符
 * @method bLength
 * @param {String} str 要计算长度的字符串
 * @returns {Number} 字符串长度
 * @example
 * var $bLength = require('spore-kit/packages/str/bLength');
 * $bLength('中文cc'); // 6
 */

function bLength(str) {
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

function dbcToSbc(str) {
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

function decodeHTML(str) {
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
/* eslint-disable no-control-regex */
/**
 * 编码HTML，将HTML字符转为实体字符
 * @method encodeHTML
 * @param {String} str 含有HTML字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * var $encodeHTML = require('spore-kit/packages/str/encodeHTML');
 * $encodeHTML(`&<>"\' `); // '&amp;&lt;&gt;&quot;&#39;&#32;'
 */

function encodeHTML(str) {
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

function getRnd36(rnd) {
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

function getTime36(date) {
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
var index = 0;

function getUniqueKey() {
  index += 1;
  return (time + (index)).toString(16);
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

function hyphenate(str) {
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

function ipToHex(ip) {
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
/* eslint-disable no-control-regex */
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

function leftB(str, lens) {
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

function sizeOfUTF8String(str) {
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

function substitute(str, obj, reg) {
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

function countDown(spec) {
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
    onStop: null,
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

  var update = function (now) {
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
  that.correct = function (serverTime, localTime) {
    var now = localTime ? new Date(localTime) : +new Date();
    var serverDate = serverTime ? new Date(serverTime) : 0;
    if (serverDate) {
      timeDiff = serverDate - now;
    }
  };

  if (conf.base) {
    that.correct(conf.base);
  }

  var check = function (localDelta) {
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
  that.stop = function () {
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
  that.destroy = function () {
    onChange = null;
    onStop = null;
    that.stop();
  };

  var monitor = allMonitors[timeInterval];

  if (!monitor) {
    monitor = {};
    monitor.queue = [];
    monitor.inspect = function () {
      var now = Date.now();
      var mobj = allMonitors[timeInterval];
      var localDelta = now - localBaseTime;
      if (mobj.queue.length) {
        // 循环当中会删除数组元素，因此需要先复制一下数组
        mobj.queue.slice(0).forEach(function (fn) {
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
  second: 1000,
};

function parseUnit(time, spec) {
  var conf = $assign({
    maxUnit: 'day',
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
  var u8arr = new Uint8Array(buffer);
  var fn = function (bit) {
    return ('00' + bit.toString(16)).slice(-2);
  };
  return Array.prototype.map.call(u8arr, fn).join('');
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
  for (index = 0; index < len; index += 1) {
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
    index += 1;
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
  return hex.replace(/[\da-f]{2}/gi, function (match) {
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

manager.add = function (fn, options) {
  options = options || {};
  manager.queue.push({
    fn: fn,
    conf: options,
  });
  manager.step();
};

manager.step = function () {
  if (!manager.queue.length || manager.timer) { return; }
  manager.timer = setTimeout(function () {
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

function measureDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var powVal = Math.pow(Math.sin(a / 2), 2);
  var ccpVal = Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2);
  var sqrtVal = Math.sqrt(powVal + ccpVal);
  var s = 2 * Math.asin(sqrtVal);
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
  var min = Math.min(r, g, b);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9mYWtlXzJlNmRlZTQ0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2RvY3VtZW50LW9mZnNldC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9kb20tc3VwcG9ydC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9nZXQtZG9jdW1lbnQvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2tsYXNzL2tsYXNzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FwcGx5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25NZXJnZVZhbHVlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbkluLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNsb25lLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldEFsbEtleXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTWFwLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXNJbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNZXJnZURlZXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmVzdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RGdW5jdGlvbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RQYXRoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVBcnJheUJ1ZmZlci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVEYXRhVmlldy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5QXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9sc0luLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUFzc2lnbmVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXNJbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9sc0luLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoQ2xlYXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVCeVRhZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZU9iamVjdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXlhYmxlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNNYXNrZWQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUNsZWFyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlSGFzLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVHZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJSZXN0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NhZmVHZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Nob3J0T3V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvYXNzaWduLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9jbG9uZURlZXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2NvbnN0YW50LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc01hcC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNQbGFpbk9iamVjdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTZXQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVyZ2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL25vb3AuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJBcnJheS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC90b1BsYWluT2JqZWN0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZ2lmeS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9yZXF1aXJlcy1wb3J0L2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL3VybC1wYXJzZS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L25vZGVfbW9kdWxlcy93aXRoaW4tZWxlbWVudC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2FwcC9jYWxsVXAuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZXJhc2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZmluZC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2luY2x1ZGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvY29va2llLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvY29va2llL2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvY29va2llL29yaWdpbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9nZXRMYXN0U3RhcnQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2dldFRpbWVTcGxpdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaXNOb2RlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZG9tL29mZnNldC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9icm93c2VyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L2NvcmUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvZGV2aWNlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L25ldHdvcmsuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvb3MuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZW52L3VhTWF0Y2guanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvd2VicC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvbGlzdGVuZXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvb2NjdXJJbnNpZGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvdGFwU3RvcC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2RlbGF5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZm4vaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9sb2NrLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZm4vb25jZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3ByZXBhcmUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9xdWV1ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3JlZ3VsYXIuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9mbGFzaEFjdGlvbi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZngvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9zbW9vdGhTY3JvbGxUby5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3N0aWNreS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3RpbWVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvZngvdHJhbnNpdGlvbnMuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9hamF4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvaW8vaWZyYW1lUG9zdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2lvL2luZGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvaW8vbG9hZFNkay5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL2dldFF1ZXJ5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL3NldFF1ZXJ5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvbXZjL2Jhc2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvZGVsZWdhdGUuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMva2xhc3MuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvcHJveHkuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvdmlldy5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9jb21tYS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9maXhUby5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9saW1pdC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL251bS9udW1lcmljYWwuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovYXNzaWduLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2NvdmVyLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2ZpbmQuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovaW5kZXguanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovdHlwZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9iTGVuZ3RoLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2RiY1RvU2JjLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2RlY29kZUhUTUwuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZW5jb2RlSFRNTC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9nZXRSbmQzNi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9nZXRUaW1lMzYuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VW5pcXVlS2V5LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2h5cGhlbmF0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9pcFRvSGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2xlZnRCLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvc3RyL3NpemVPZlVURjhTdHJpbmcuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvc3Vic3RpdHV0ZS5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvY291bnREb3duLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdGltZS9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvcGFyc2VVbml0LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9hYlRvSGV4LmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9hc2NUb0hleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9BYi5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9Bc2MuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2hzbFRvUmdiLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9pbmRleC5qcyIsIi9Vc2Vycy90YWIvd29yay9naXRodWIvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvam9iLmpzIiwiL1VzZXJzL3RhYi93b3JrL2dpdGh1Yi9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9tZWFzdXJlRGlzdGFuY2UuanMiLCIvVXNlcnMvdGFiL3dvcmsvZ2l0aHViL3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL3JnYlRvSHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLmFwcCA9IHJlcXVpcmUoJy4vcGFja2FnZXMvYXBwJyk7XG5leHBvcnRzLmFyciA9IHJlcXVpcmUoJy4vcGFja2FnZXMvYXJyJyk7XG5leHBvcnRzLmNvb2tpZSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvY29va2llJyk7XG5leHBvcnRzLmRhdGUgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2RhdGUnKTtcbmV4cG9ydHMuZG9tID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9kb20nKTtcbmV4cG9ydHMuZW52ID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9lbnYnKTtcbmV4cG9ydHMuZXZ0ID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9ldnQnKTtcbmV4cG9ydHMuZm4gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2ZuJyk7XG5leHBvcnRzLmZ4ID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9meCcpO1xuZXhwb3J0cy5pbyA9IHJlcXVpcmUoJy4vcGFja2FnZXMvaW8nKTtcbmV4cG9ydHMubG9jYXRpb24gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2xvY2F0aW9uJyk7XG5leHBvcnRzLm12YyA9IHJlcXVpcmUoJy4vcGFja2FnZXMvbXZjJyk7XG5leHBvcnRzLm51bSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvbnVtJyk7XG5leHBvcnRzLm9iaiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvb2JqJyk7XG5leHBvcnRzLnN0ciA9IHJlcXVpcmUoJy4vcGFja2FnZXMvc3RyJyk7XG5leHBvcnRzLnRpbWUgPSByZXF1aXJlKCcuL3BhY2thZ2VzL3RpbWUnKTtcbmV4cG9ydHMudXRpbCA9IHJlcXVpcmUoJy4vcGFja2FnZXMvdXRpbCcpO1xuIiwidmFyIHN1cHBvcnQgPSByZXF1aXJlKCdkb20tc3VwcG9ydCcpXG52YXIgZ2V0RG9jdW1lbnQgPSByZXF1aXJlKCdnZXQtZG9jdW1lbnQnKVxudmFyIHdpdGhpbkVsZW1lbnQgPSByZXF1aXJlKCd3aXRoaW4tZWxlbWVudCcpXG5cbi8qKlxuICogR2V0IG9mZnNldCBvZiBhIERPTSBFbGVtZW50IG9yIFJhbmdlIHdpdGhpbiB0aGUgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fFJhbmdlfSBlbCAtIHRoZSBET00gZWxlbWVudCBvciBSYW5nZSBpbnN0YW5jZSB0byBtZWFzdXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIGB0b3BgIGFuZCBgbGVmdGAgTnVtYmVyIHZhbHVlc1xuICogQHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb2Zmc2V0KGVsKSB7XG4gIHZhciBkb2MgPSBnZXREb2N1bWVudChlbClcbiAgaWYgKCFkb2MpIHJldHVyblxuXG4gIC8vIE1ha2Ugc3VyZSBpdCdzIG5vdCBhIGRpc2Nvbm5lY3RlZCBET00gbm9kZVxuICBpZiAoIXdpdGhpbkVsZW1lbnQoZWwsIGRvYykpIHJldHVyblxuXG4gIHZhciBib2R5ID0gZG9jLmJvZHlcbiAgaWYgKGJvZHkgPT09IGVsKSB7XG4gICAgcmV0dXJuIGJvZHlPZmZzZXQoZWwpXG4gIH1cblxuICB2YXIgYm94ID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICBpZiAoIHR5cGVvZiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBnQkNSLCBqdXN0IHVzZSAwLDAgcmF0aGVyIHRoYW4gZXJyb3JcbiAgICAvLyBCbGFja0JlcnJ5IDUsIGlPUyAzIChvcmlnaW5hbCBpUGhvbmUpXG4gICAgYm94ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGlmIChlbC5jb2xsYXBzZWQgJiYgYm94LmxlZnQgPT09IDAgJiYgYm94LnRvcCA9PT0gMCkge1xuICAgICAgLy8gY29sbGFwc2VkIFJhbmdlIGluc3RhbmNlcyBzb21ldGltZXMgcmVwb3J0IDAsIDBcbiAgICAgIC8vIHNlZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjg0NzMyOC8zNzY3NzNcbiAgICAgIHZhciBzcGFuID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXG4gICAgICAvLyBFbnN1cmUgc3BhbiBoYXMgZGltZW5zaW9ucyBhbmQgcG9zaXRpb24gYnlcbiAgICAgIC8vIGFkZGluZyBhIHplcm8td2lkdGggc3BhY2UgY2hhcmFjdGVyXG4gICAgICBzcGFuLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShcIlxcdTIwMGJcIikpO1xuICAgICAgZWwuaW5zZXJ0Tm9kZShzcGFuKTtcbiAgICAgIGJveCA9IHNwYW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIFJlbW92ZSB0ZW1wIFNQQU4gYW5kIGdsdWUgYW55IGJyb2tlbiB0ZXh0IG5vZGVzIGJhY2sgdG9nZXRoZXJcbiAgICAgIHZhciBzcGFuUGFyZW50ID0gc3Bhbi5wYXJlbnROb2RlO1xuICAgICAgc3BhblBhcmVudC5yZW1vdmVDaGlsZChzcGFuKTtcbiAgICAgIHNwYW5QYXJlbnQubm9ybWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGRvY0VsID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICB2YXIgY2xpZW50VG9wICA9IGRvY0VsLmNsaWVudFRvcCAgfHwgYm9keS5jbGllbnRUb3AgIHx8IDBcbiAgdmFyIGNsaWVudExlZnQgPSBkb2NFbC5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwXG4gIHZhciBzY3JvbGxUb3AgID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbFRvcFxuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2NFbC5zY3JvbGxMZWZ0XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IGJveC50b3AgICsgc2Nyb2xsVG9wICAtIGNsaWVudFRvcCxcbiAgICBsZWZ0OiBib3gubGVmdCArIHNjcm9sbExlZnQgLSBjbGllbnRMZWZ0XG4gIH1cbn1cblxuZnVuY3Rpb24gYm9keU9mZnNldChib2R5KSB7XG4gIHZhciB0b3AgPSBib2R5Lm9mZnNldFRvcFxuICB2YXIgbGVmdCA9IGJvZHkub2Zmc2V0TGVmdFxuXG4gIGlmIChzdXBwb3J0LmRvZXNOb3RJbmNsdWRlTWFyZ2luSW5Cb2R5T2Zmc2V0KSB7XG4gICAgdG9wICArPSBwYXJzZUZsb2F0KGJvZHkuc3R5bGUubWFyZ2luVG9wIHx8IDApXG4gICAgbGVmdCArPSBwYXJzZUZsb2F0KGJvZHkuc3R5bGUubWFyZ2luTGVmdCB8fCAwKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IHRvcCxcbiAgICBsZWZ0OiBsZWZ0XG4gIH1cbn1cbiIsInZhciBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5JylcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHN1cHBvcnQsXG5cdFx0YWxsLFxuXHRcdGEsXG5cdFx0c2VsZWN0LFxuXHRcdG9wdCxcblx0XHRpbnB1dCxcblx0XHRmcmFnbWVudCxcblx0XHRldmVudE5hbWUsXG5cdFx0aSxcblx0XHRpc1N1cHBvcnRlZCxcblx0XHRjbGlja0ZuLFxuXHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0Ly8gU2V0dXBcblx0ZGl2LnNldEF0dHJpYnV0ZSggXCJjbGFzc05hbWVcIiwgXCJ0XCIgKTtcblx0ZGl2LmlubmVySFRNTCA9IFwiICA8bGluay8+PHRhYmxlPjwvdGFibGU+PGEgaHJlZj0nL2EnPmE8L2E+PGlucHV0IHR5cGU9J2NoZWNrYm94Jy8+XCI7XG5cblx0Ly8gU3VwcG9ydCB0ZXN0cyB3b24ndCBydW4gaW4gc29tZSBsaW1pdGVkIG9yIG5vbi1icm93c2VyIGVudmlyb25tZW50c1xuXHRhbGwgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpO1xuXHRhID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVsgMCBdO1xuXHRpZiAoICFhbGwgfHwgIWEgfHwgIWFsbC5sZW5ndGggKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0Ly8gRmlyc3QgYmF0Y2ggb2YgdGVzdHNcblx0c2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcblx0b3B0ID0gc2VsZWN0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpICk7XG5cdGlucHV0ID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbIDAgXTtcblxuXHRhLnN0eWxlLmNzc1RleHQgPSBcInRvcDoxcHg7ZmxvYXQ6bGVmdDtvcGFjaXR5Oi41XCI7XG5cdHN1cHBvcnQgPSB7XG5cdFx0Ly8gSUUgc3RyaXBzIGxlYWRpbmcgd2hpdGVzcGFjZSB3aGVuIC5pbm5lckhUTUwgaXMgdXNlZFxuXHRcdGxlYWRpbmdXaGl0ZXNwYWNlOiAoIGRpdi5maXJzdENoaWxkLm5vZGVUeXBlID09PSAzICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0Ym9keSBlbGVtZW50cyBhcmVuJ3QgYXV0b21hdGljYWxseSBpbnNlcnRlZFxuXHRcdC8vIElFIHdpbGwgaW5zZXJ0IHRoZW0gaW50byBlbXB0eSB0YWJsZXNcblx0XHR0Ym9keTogIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpLmxlbmd0aCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGxpbmsgZWxlbWVudHMgZ2V0IHNlcmlhbGl6ZWQgY29ycmVjdGx5IGJ5IGlubmVySFRNTFxuXHRcdC8vIFRoaXMgcmVxdWlyZXMgYSB3cmFwcGVyIGVsZW1lbnQgaW4gSUVcblx0XHRodG1sU2VyaWFsaXplOiAhIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpbmtcIikubGVuZ3RoLFxuXG5cdFx0Ly8gR2V0IHRoZSBzdHlsZSBpbmZvcm1hdGlvbiBmcm9tIGdldEF0dHJpYnV0ZVxuXHRcdC8vIChJRSB1c2VzIC5jc3NUZXh0IGluc3RlYWQpXG5cdFx0c3R5bGU6IC90b3AvLnRlc3QoIGEuZ2V0QXR0cmlidXRlKFwic3R5bGVcIikgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IFVSTHMgYXJlbid0IG1hbmlwdWxhdGVkXG5cdFx0Ly8gKElFIG5vcm1hbGl6ZXMgaXQgYnkgZGVmYXVsdClcblx0XHRocmVmTm9ybWFsaXplZDogKCBhLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiL2FcIiApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgZWxlbWVudCBvcGFjaXR5IGV4aXN0c1xuXHRcdC8vIChJRSB1c2VzIGZpbHRlciBpbnN0ZWFkKVxuXHRcdC8vIFVzZSBhIHJlZ2V4IHRvIHdvcmsgYXJvdW5kIGEgV2ViS2l0IGlzc3VlLiBTZWUgIzUxNDVcblx0XHRvcGFjaXR5OiAvXjAuNS8udGVzdCggYS5zdHlsZS5vcGFjaXR5ICksXG5cblx0XHQvLyBWZXJpZnkgc3R5bGUgZmxvYXQgZXhpc3RlbmNlXG5cdFx0Ly8gKElFIHVzZXMgc3R5bGVGbG9hdCBpbnN0ZWFkIG9mIGNzc0Zsb2F0KVxuXHRcdGNzc0Zsb2F0OiAhIWEuc3R5bGUuY3NzRmxvYXQsXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBpZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWQgZm9yIGEgY2hlY2tib3hcblx0XHQvLyB0aGF0IGl0IGRlZmF1bHRzIHRvIFwib25cIi5cblx0XHQvLyAoV2ViS2l0IGRlZmF1bHRzIHRvIFwiXCIgaW5zdGVhZClcblx0XHRjaGVja09uOiAoIGlucHV0LnZhbHVlID09PSBcIm9uXCIgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGEgc2VsZWN0ZWQtYnktZGVmYXVsdCBvcHRpb24gaGFzIGEgd29ya2luZyBzZWxlY3RlZCBwcm9wZXJ0eS5cblx0XHQvLyAoV2ViS2l0IGRlZmF1bHRzIHRvIGZhbHNlIGluc3RlYWQgb2YgdHJ1ZSwgSUUgdG9vLCBpZiBpdCdzIGluIGFuIG9wdGdyb3VwKVxuXHRcdG9wdFNlbGVjdGVkOiBvcHQuc2VsZWN0ZWQsXG5cblx0XHQvLyBUZXN0IHNldEF0dHJpYnV0ZSBvbiBjYW1lbENhc2UgY2xhc3MuIElmIGl0IHdvcmtzLCB3ZSBuZWVkIGF0dHJGaXhlcyB3aGVuIGRvaW5nIGdldC9zZXRBdHRyaWJ1dGUgKGllNi83KVxuXHRcdGdldFNldEF0dHJpYnV0ZTogZGl2LmNsYXNzTmFtZSAhPT0gXCJ0XCIsXG5cblx0XHQvLyBUZXN0cyBmb3IgZW5jdHlwZSBzdXBwb3J0IG9uIGEgZm9ybSAoIzY3NDMpXG5cdFx0ZW5jdHlwZTogISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKS5lbmN0eXBlLFxuXG5cdFx0Ly8gTWFrZXMgc3VyZSBjbG9uaW5nIGFuIGh0bWw1IGVsZW1lbnQgZG9lcyBub3QgY2F1c2UgcHJvYmxlbXNcblx0XHQvLyBXaGVyZSBvdXRlckhUTUwgaXMgdW5kZWZpbmVkLCB0aGlzIHN0aWxsIHdvcmtzXG5cdFx0aHRtbDVDbG9uZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5hdlwiKS5jbG9uZU5vZGUoIHRydWUgKS5vdXRlckhUTUwgIT09IFwiPDpuYXY+PC86bmF2PlwiLFxuXG5cdFx0Ly8galF1ZXJ5LnN1cHBvcnQuYm94TW9kZWwgREVQUkVDQVRFRCBpbiAxLjggc2luY2Ugd2UgZG9uJ3Qgc3VwcG9ydCBRdWlya3MgTW9kZVxuXHRcdGJveE1vZGVsOiAoIGRvY3VtZW50LmNvbXBhdE1vZGUgPT09IFwiQ1NTMUNvbXBhdFwiICksXG5cblx0XHQvLyBXaWxsIGJlIGRlZmluZWQgbGF0ZXJcblx0XHRzdWJtaXRCdWJibGVzOiB0cnVlLFxuXHRcdGNoYW5nZUJ1YmJsZXM6IHRydWUsXG5cdFx0Zm9jdXNpbkJ1YmJsZXM6IGZhbHNlLFxuXHRcdGRlbGV0ZUV4cGFuZG86IHRydWUsXG5cdFx0bm9DbG9uZUV2ZW50OiB0cnVlLFxuXHRcdGlubGluZUJsb2NrTmVlZHNMYXlvdXQ6IGZhbHNlLFxuXHRcdHNocmlua1dyYXBCbG9ja3M6IGZhbHNlLFxuXHRcdHJlbGlhYmxlTWFyZ2luUmlnaHQ6IHRydWUsXG5cdFx0Ym94U2l6aW5nUmVsaWFibGU6IHRydWUsXG5cdFx0cGl4ZWxQb3NpdGlvbjogZmFsc2Vcblx0fTtcblxuXHQvLyBNYWtlIHN1cmUgY2hlY2tlZCBzdGF0dXMgaXMgcHJvcGVybHkgY2xvbmVkXG5cdGlucHV0LmNoZWNrZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm5vQ2xvbmVDaGVja2VkID0gaW5wdXQuY2xvbmVOb2RlKCB0cnVlICkuY2hlY2tlZDtcblxuXHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgb3B0aW9ucyBpbnNpZGUgZGlzYWJsZWQgc2VsZWN0cyBhcmVuJ3QgbWFya2VkIGFzIGRpc2FibGVkXG5cdC8vIChXZWJLaXQgbWFya3MgdGhlbSBhcyBkaXNhYmxlZClcblx0c2VsZWN0LmRpc2FibGVkID0gdHJ1ZTtcblx0c3VwcG9ydC5vcHREaXNhYmxlZCA9ICFvcHQuZGlzYWJsZWQ7XG5cblx0Ly8gVGVzdCB0byBzZWUgaWYgaXQncyBwb3NzaWJsZSB0byBkZWxldGUgYW4gZXhwYW5kbyBmcm9tIGFuIGVsZW1lbnRcblx0Ly8gRmFpbHMgaW4gSW50ZXJuZXQgRXhwbG9yZXJcblx0dHJ5IHtcblx0XHRkZWxldGUgZGl2LnRlc3Q7XG5cdH0gY2F0Y2goIGUgKSB7XG5cdFx0c3VwcG9ydC5kZWxldGVFeHBhbmRvID0gZmFsc2U7XG5cdH1cblxuXHRpZiAoICFkaXYuYWRkRXZlbnRMaXN0ZW5lciAmJiBkaXYuYXR0YWNoRXZlbnQgJiYgZGl2LmZpcmVFdmVudCApIHtcblx0XHRkaXYuYXR0YWNoRXZlbnQoIFwib25jbGlja1wiLCBjbGlja0ZuID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBDbG9uaW5nIGEgbm9kZSBzaG91bGRuJ3QgY29weSBvdmVyIGFueVxuXHRcdFx0Ly8gYm91bmQgZXZlbnQgaGFuZGxlcnMgKElFIGRvZXMgdGhpcylcblx0XHRcdHN1cHBvcnQubm9DbG9uZUV2ZW50ID0gZmFsc2U7XG5cdFx0fSk7XG5cdFx0ZGl2LmNsb25lTm9kZSggdHJ1ZSApLmZpcmVFdmVudChcIm9uY2xpY2tcIik7XG5cdFx0ZGl2LmRldGFjaEV2ZW50KCBcIm9uY2xpY2tcIiwgY2xpY2tGbiApO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYSByYWRpbyBtYWludGFpbnMgaXRzIHZhbHVlXG5cdC8vIGFmdGVyIGJlaW5nIGFwcGVuZGVkIHRvIHRoZSBET01cblx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG5cdGlucHV0LnZhbHVlID0gXCJ0XCI7XG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJ0eXBlXCIsIFwicmFkaW9cIiApO1xuXHRzdXBwb3J0LnJhZGlvVmFsdWUgPSBpbnB1dC52YWx1ZSA9PT0gXCJ0XCI7XG5cblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcImNoZWNrZWRcIiwgXCJjaGVja2VkXCIgKTtcblxuXHQvLyAjMTEyMTcgLSBXZWJLaXQgbG9zZXMgY2hlY2sgd2hlbiB0aGUgbmFtZSBpcyBhZnRlciB0aGUgY2hlY2tlZCBhdHRyaWJ1dGVcblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJ0XCIgKTtcblxuXHRkaXYuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG5cdGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2Lmxhc3RDaGlsZCApO1xuXG5cdC8vIFdlYktpdCBkb2Vzbid0IGNsb25lIGNoZWNrZWQgc3RhdGUgY29ycmVjdGx5IGluIGZyYWdtZW50c1xuXHRzdXBwb3J0LmNoZWNrQ2xvbmUgPSBmcmFnbWVudC5jbG9uZU5vZGUoIHRydWUgKS5jbG9uZU5vZGUoIHRydWUgKS5sYXN0Q2hpbGQuY2hlY2tlZDtcblxuXHQvLyBDaGVjayBpZiBhIGRpc2Nvbm5lY3RlZCBjaGVja2JveCB3aWxsIHJldGFpbiBpdHMgY2hlY2tlZFxuXHQvLyB2YWx1ZSBvZiB0cnVlIGFmdGVyIGFwcGVuZGVkIHRvIHRoZSBET00gKElFNi83KVxuXHRzdXBwb3J0LmFwcGVuZENoZWNrZWQgPSBpbnB1dC5jaGVja2VkO1xuXG5cdGZyYWdtZW50LnJlbW92ZUNoaWxkKCBpbnB1dCApO1xuXHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cblx0Ly8gVGVjaG5pcXVlIGZyb20gSnVyaXkgWmF5dHNldlxuXHQvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9kZXRlY3RpbmctZXZlbnQtc3VwcG9ydC13aXRob3V0LWJyb3dzZXItc25pZmZpbmcvXG5cdC8vIFdlIG9ubHkgY2FyZSBhYm91dCB0aGUgY2FzZSB3aGVyZSBub24tc3RhbmRhcmQgZXZlbnQgc3lzdGVtc1xuXHQvLyBhcmUgdXNlZCwgbmFtZWx5IGluIElFLiBTaG9ydC1jaXJjdWl0aW5nIGhlcmUgaGVscHMgdXMgdG9cblx0Ly8gYXZvaWQgYW4gZXZhbCBjYWxsIChpbiBzZXRBdHRyaWJ1dGUpIHdoaWNoIGNhbiBjYXVzZSBDU1Bcblx0Ly8gdG8gZ28gaGF5d2lyZS4gU2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9TZWN1cml0eS9DU1Bcblx0aWYgKCAhZGl2LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0Zm9yICggaSBpbiB7XG5cdFx0XHRzdWJtaXQ6IHRydWUsXG5cdFx0XHRjaGFuZ2U6IHRydWUsXG5cdFx0XHRmb2N1c2luOiB0cnVlXG5cdFx0fSkge1xuXHRcdFx0ZXZlbnROYW1lID0gXCJvblwiICsgaTtcblx0XHRcdGlzU3VwcG9ydGVkID0gKCBldmVudE5hbWUgaW4gZGl2ICk7XG5cdFx0XHRpZiAoICFpc1N1cHBvcnRlZCApIHtcblx0XHRcdFx0ZGl2LnNldEF0dHJpYnV0ZSggZXZlbnROYW1lLCBcInJldHVybjtcIiApO1xuXHRcdFx0XHRpc1N1cHBvcnRlZCA9ICggdHlwZW9mIGRpdlsgZXZlbnROYW1lIF0gPT09IFwiZnVuY3Rpb25cIiApO1xuXHRcdFx0fVxuXHRcdFx0c3VwcG9ydFsgaSArIFwiQnViYmxlc1wiIF0gPSBpc1N1cHBvcnRlZDtcblx0XHR9XG5cdH1cblxuXHQvLyBSdW4gdGVzdHMgdGhhdCBuZWVkIGEgYm9keSBhdCBkb2MgcmVhZHlcblx0ZG9tcmVhZHkoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRhaW5lciwgZGl2LCB0ZHMsIG1hcmdpbkRpdixcblx0XHRcdGRpdlJlc2V0ID0gXCJwYWRkaW5nOjA7bWFyZ2luOjA7Ym9yZGVyOjA7ZGlzcGxheTpibG9jaztvdmVyZmxvdzpoaWRkZW47Ym94LXNpemluZzpjb250ZW50LWJveDstbW96LWJveC1zaXppbmc6Y29udGVudC1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O1wiLFxuXHRcdFx0Ym9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcblxuXHRcdGlmICggIWJvZHkgKSB7XG5cdFx0XHQvLyBSZXR1cm4gZm9yIGZyYW1lc2V0IGRvY3MgdGhhdCBkb24ndCBoYXZlIGEgYm9keVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSBcInZpc2liaWxpdHk6aGlkZGVuO2JvcmRlcjowO3dpZHRoOjA7aGVpZ2h0OjA7cG9zaXRpb246c3RhdGljO3RvcDowO21hcmdpbi10b3A6MXB4XCI7XG5cdFx0Ym9keS5pbnNlcnRCZWZvcmUoIGNvbnRhaW5lciwgYm9keS5maXJzdENoaWxkICk7XG5cblx0XHQvLyBDb25zdHJ1Y3QgdGhlIHRlc3QgZWxlbWVudFxuXHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgIC8vQ2hlY2sgaWYgdGFibGUgY2VsbHMgc3RpbGwgaGF2ZSBvZmZzZXRXaWR0aC9IZWlnaHQgd2hlbiB0aGV5IGFyZSBzZXRcbiAgICAvL3RvIGRpc3BsYXk6bm9uZSBhbmQgdGhlcmUgYXJlIHN0aWxsIG90aGVyIHZpc2libGUgdGFibGUgY2VsbHMgaW4gYVxuICAgIC8vdGFibGUgcm93OyBpZiBzbywgb2Zmc2V0V2lkdGgvSGVpZ2h0IGFyZSBub3QgcmVsaWFibGUgZm9yIHVzZSB3aGVuXG4gICAgLy9kZXRlcm1pbmluZyBpZiBhbiBlbGVtZW50IGhhcyBiZWVuIGhpZGRlbiBkaXJlY3RseSB1c2luZ1xuICAgIC8vZGlzcGxheTpub25lIChpdCBpcyBzdGlsbCBzYWZlIHRvIHVzZSBvZmZzZXRzIGlmIGEgcGFyZW50IGVsZW1lbnQgaXNcbiAgICAvL2hpZGRlbjsgZG9uIHNhZmV0eSBnb2dnbGVzIGFuZCBzZWUgYnVnICM0NTEyIGZvciBtb3JlIGluZm9ybWF0aW9uKS5cbiAgICAvLyhvbmx5IElFIDggZmFpbHMgdGhpcyB0ZXN0KVxuXHRcdGRpdi5pbm5lckhUTUwgPSBcIjx0YWJsZT48dHI+PHRkPjwvdGQ+PHRkPnQ8L3RkPjwvdHI+PC90YWJsZT5cIjtcblx0XHR0ZHMgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZFwiKTtcblx0XHR0ZHNbIDAgXS5zdHlsZS5jc3NUZXh0ID0gXCJwYWRkaW5nOjA7bWFyZ2luOjA7Ym9yZGVyOjA7ZGlzcGxheTpub25lXCI7XG5cdFx0aXNTdXBwb3J0ZWQgPSAoIHRkc1sgMCBdLm9mZnNldEhlaWdodCA9PT0gMCApO1xuXG5cdFx0dGRzWyAwIF0uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0dGRzWyAxIF0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgZW1wdHkgdGFibGUgY2VsbHMgc3RpbGwgaGF2ZSBvZmZzZXRXaWR0aC9IZWlnaHRcblx0XHQvLyAoSUUgPD0gOCBmYWlsIHRoaXMgdGVzdClcblx0XHRzdXBwb3J0LnJlbGlhYmxlSGlkZGVuT2Zmc2V0cyA9IGlzU3VwcG9ydGVkICYmICggdGRzWyAwIF0ub2Zmc2V0SGVpZ2h0ID09PSAwICk7XG5cblx0XHQvLyBDaGVjayBib3gtc2l6aW5nIGFuZCBtYXJnaW4gYmVoYXZpb3Jcblx0XHRkaXYuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IFwiYm94LXNpemluZzpib3JkZXItYm94Oy1tb3otYm94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6MXB4O2JvcmRlcjoxcHg7ZGlzcGxheTpibG9jazt3aWR0aDo0cHg7bWFyZ2luLXRvcDoxJTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MSU7XCI7XG5cdFx0c3VwcG9ydC5ib3hTaXppbmcgPSAoIGRpdi5vZmZzZXRXaWR0aCA9PT0gNCApO1xuXHRcdHN1cHBvcnQuZG9lc05vdEluY2x1ZGVNYXJnaW5JbkJvZHlPZmZzZXQgPSAoIGJvZHkub2Zmc2V0VG9wICE9PSAxICk7XG5cblx0XHQvLyBOT1RFOiBUbyBhbnkgZnV0dXJlIG1haW50YWluZXIsIHdlJ3ZlIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlXG5cdFx0Ly8gYmVjYXVzZSBqc2RvbSBvbiBub2RlLmpzIHdpbGwgYnJlYWsgd2l0aG91dCBpdC5cblx0XHRpZiAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICkge1xuXHRcdFx0c3VwcG9ydC5waXhlbFBvc2l0aW9uID0gKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZGl2LCBudWxsICkgfHwge30gKS50b3AgIT09IFwiMSVcIjtcblx0XHRcdHN1cHBvcnQuYm94U2l6aW5nUmVsaWFibGUgPSAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBkaXYsIG51bGwgKSB8fCB7IHdpZHRoOiBcIjRweFwiIH0gKS53aWR0aCA9PT0gXCI0cHhcIjtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgZGl2IHdpdGggZXhwbGljaXQgd2lkdGggYW5kIG5vIG1hcmdpbi1yaWdodCBpbmNvcnJlY3RseVxuXHRcdFx0Ly8gZ2V0cyBjb21wdXRlZCBtYXJnaW4tcmlnaHQgYmFzZWQgb24gd2lkdGggb2YgY29udGFpbmVyLiBGb3IgbW9yZVxuXHRcdFx0Ly8gaW5mbyBzZWUgYnVnICMzMzMzXG5cdFx0XHQvLyBGYWlscyBpbiBXZWJLaXQgYmVmb3JlIEZlYiAyMDExIG5pZ2h0bGllc1xuXHRcdFx0Ly8gV2ViS2l0IEJ1ZyAxMzM0MyAtIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyB3cm9uZyB2YWx1ZSBmb3IgbWFyZ2luLXJpZ2h0XG5cdFx0XHRtYXJnaW5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0bWFyZ2luRGl2LnN0eWxlLmNzc1RleHQgPSBkaXYuc3R5bGUuY3NzVGV4dCA9IGRpdlJlc2V0O1xuXHRcdFx0bWFyZ2luRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gbWFyZ2luRGl2LnN0eWxlLndpZHRoID0gXCIwXCI7XG5cdFx0XHRkaXYuc3R5bGUud2lkdGggPSBcIjFweFwiO1xuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKCBtYXJnaW5EaXYgKTtcblx0XHRcdHN1cHBvcnQucmVsaWFibGVNYXJnaW5SaWdodCA9XG5cdFx0XHRcdCFwYXJzZUZsb2F0KCAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBtYXJnaW5EaXYsIG51bGwgKSB8fCB7fSApLm1hcmdpblJpZ2h0ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgZGl2LnN0eWxlLnpvb20gIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHQvLyBDaGVjayBpZiBuYXRpdmVseSBibG9jay1sZXZlbCBlbGVtZW50cyBhY3QgbGlrZSBpbmxpbmUtYmxvY2tcblx0XHRcdC8vIGVsZW1lbnRzIHdoZW4gc2V0dGluZyB0aGVpciBkaXNwbGF5IHRvICdpbmxpbmUnIGFuZCBnaXZpbmdcblx0XHRcdC8vIHRoZW0gbGF5b3V0XG5cdFx0XHQvLyAoSUUgPCA4IGRvZXMgdGhpcylcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdFx0ZGl2LnN0eWxlLmNzc1RleHQgPSBkaXZSZXNldCArIFwid2lkdGg6MXB4O3BhZGRpbmc6MXB4O2Rpc3BsYXk6aW5saW5lO3pvb206MVwiO1xuXHRcdFx0c3VwcG9ydC5pbmxpbmVCbG9ja05lZWRzTGF5b3V0ID0gKCBkaXYub2Zmc2V0V2lkdGggPT09IDMgKTtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgZWxlbWVudHMgd2l0aCBsYXlvdXQgc2hyaW5rLXdyYXAgdGhlaXIgY2hpbGRyZW5cblx0XHRcdC8vIChJRSA2IGRvZXMgdGhpcylcblx0XHRcdGRpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0ZGl2LnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG5cdFx0XHRkaXYuaW5uZXJIVE1MID0gXCI8ZGl2PjwvZGl2PlwiO1xuXHRcdFx0ZGl2LmZpcnN0Q2hpbGQuc3R5bGUud2lkdGggPSBcIjVweFwiO1xuXHRcdFx0c3VwcG9ydC5zaHJpbmtXcmFwQmxvY2tzID0gKCBkaXYub2Zmc2V0V2lkdGggIT09IDMgKTtcblxuXHRcdFx0Y29udGFpbmVyLnN0eWxlLnpvb20gPSAxO1xuXHRcdH1cblxuXHRcdC8vIE51bGwgZWxlbWVudHMgdG8gYXZvaWQgbGVha3MgaW4gSUVcblx0XHRib2R5LnJlbW92ZUNoaWxkKCBjb250YWluZXIgKTtcblx0XHRjb250YWluZXIgPSBkaXYgPSB0ZHMgPSBtYXJnaW5EaXYgPSBudWxsO1xuXHR9KTtcblxuXHQvLyBOdWxsIGVsZW1lbnRzIHRvIGF2b2lkIGxlYWtzIGluIElFXG5cdGZyYWdtZW50LnJlbW92ZUNoaWxkKCBkaXYgKTtcblx0YWxsID0gYSA9IHNlbGVjdCA9IG9wdCA9IGlucHV0ID0gZnJhZ21lbnQgPSBkaXYgPSBudWxsO1xuXG5cdHJldHVybiBzdXBwb3J0O1xufSkoKTtcbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERvY3VtZW50O1xuXG4vLyBkZWZpbmVkIGJ5IHczY1xudmFyIERPQ1VNRU5UX05PREUgPSA5O1xuXG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIGB3YCBpcyBhIERvY3VtZW50IG9iamVjdCwgb3IgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHs/fSBkIC0gRG9jdW1lbnQgb2JqZWN0LCBtYXliZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNEb2N1bWVudCAoZCkge1xuICByZXR1cm4gZCAmJiBkLm5vZGVUeXBlID09PSBET0NVTUVOVF9OT0RFO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGBkb2N1bWVudGAgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gYG5vZGVgLCB3aGljaCBtYXkgYmVcbiAqIGEgRE9NIGVsZW1lbnQsIHRoZSBXaW5kb3cgb2JqZWN0LCBhIFNlbGVjdGlvbiwgYSBSYW5nZS4gQmFzaWNhbGx5IGFueSBET01cbiAqIG9iamVjdCB0aGF0IHJlZmVyZW5jZXMgdGhlIERvY3VtZW50IGluIHNvbWUgd2F5LCB0aGlzIGZ1bmN0aW9uIHdpbGwgZmluZCBpdC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBub2RlIC0gRE9NIG5vZGUsIHNlbGVjdGlvbiwgb3IgcmFuZ2UgaW4gd2hpY2ggdG8gZmluZCB0aGUgYGRvY3VtZW50YCBvYmplY3RcbiAqIEByZXR1cm4ge0RvY3VtZW50fSB0aGUgYGRvY3VtZW50YCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIGBub2RlYFxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGdldERvY3VtZW50KG5vZGUpIHtcbiAgaWYgKGlzRG9jdW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZTtcblxuICB9IGVsc2UgaWYgKGlzRG9jdW1lbnQobm9kZS5vd25lckRvY3VtZW50KSkge1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgfSBlbHNlIGlmIChpc0RvY3VtZW50KG5vZGUuZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuIG5vZGUuZG9jdW1lbnQ7XG5cbiAgfSBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5wYXJlbnROb2RlKTtcblxuICAvLyBSYW5nZSBzdXBwb3J0XG4gIH0gZWxzZSBpZiAobm9kZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcikge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKTtcblxuICB9IGVsc2UgaWYgKG5vZGUuc3RhcnRDb250YWluZXIpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5zdGFydENvbnRhaW5lcik7XG5cbiAgLy8gU2VsZWN0aW9uIHN1cHBvcnRcbiAgfSBlbHNlIGlmIChub2RlLmFuY2hvck5vZGUpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5hbmNob3JOb2RlKTtcbiAgfVxufVxuIiwiLyohIGpzLWNvb2tpZSB2My4wLjEgfCBNSVQgKi9cbjtcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gZ2xvYmFsLkNvb2tpZXM7XG4gICAgdmFyIGV4cG9ydHMgPSBnbG9iYWwuQ29va2llcyA9IGZhY3RvcnkoKTtcbiAgICBleHBvcnRzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7IGdsb2JhbC5Db29raWVzID0gY3VycmVudDsgcmV0dXJuIGV4cG9ydHM7IH07XG4gIH0oKSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG4gIGZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuICB2YXIgZGVmYXVsdENvbnZlcnRlciA9IHtcbiAgICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEsIC0xKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICB9LFxuICAgIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAgIC8lKDJbMzQ2QkZdfDNbQUMtRl18NDB8NVtCREVdfDYwfDdbQkNEXSkvZyxcbiAgICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgICApXG4gICAgfVxuICB9O1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuXG4gIGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgICBmdW5jdGlvbiBzZXQgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZTUpO1xuICAgICAgfVxuICAgICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAga2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgICAucmVwbGFjZSgvWygpXS9nLCBlc2NhcGUpO1xuXG4gICAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblxuICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXG4gICAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAgIC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgICBrZXkgKyAnPScgKyBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0IChrZXkpIHtcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFrZXkpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG4gICAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgICB2YXIgamFyID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZm91bmRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICAgIGphcltmb3VuZEtleV0gPSBjb252ZXJ0ZXIucmVhZCh2YWx1ZSwgZm91bmRLZXkpO1xuXG4gICAgICAgICAgaWYgKGtleSA9PT0gZm91bmRLZXkpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXJcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgIHtcbiAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgIGdldDogZ2V0LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBzZXQoXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgICB9LFxuICAgICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgdmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbiAgcmV0dXJuIGFwaTtcblxufSkpKTtcbiIsIi8qIVxuICAqIGtsYXNzOiBhIGNsYXNzaWNhbCBKUyBPT1AgZmHDp2FkZVxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQva2xhc3NcbiAgKiBMaWNlbnNlIE1JVCAoYykgRHVzdGluIERpYXogMjAxNFxuICAqL1xuXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSgna2xhc3MnLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpc1xuICAgICwgZiA9ICdmdW5jdGlvbidcbiAgICAsIGZuVGVzdCA9IC94eXovLnRlc3QoZnVuY3Rpb24gKCkge3h5en0pID8gL1xcYnN1cHJcXGIvIDogLy4qL1xuICAgICwgcHJvdG8gPSAncHJvdG90eXBlJ1xuXG4gIGZ1bmN0aW9uIGtsYXNzKG8pIHtcbiAgICByZXR1cm4gZXh0ZW5kLmNhbGwoaXNGbihvKSA/IG8gOiBmdW5jdGlvbiAoKSB7fSwgbywgMSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRm4obykge1xuICAgIHJldHVybiB0eXBlb2YgbyA9PT0gZlxuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChrLCBmbiwgc3Vwcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdG1wID0gdGhpcy5zdXByXG4gICAgICB0aGlzLnN1cHIgPSBzdXByW3Byb3RvXVtrXVxuICAgICAgdmFyIHVuZGVmID0ge30uZmFicmljYXRlZFVuZGVmaW5lZFxuICAgICAgdmFyIHJldCA9IHVuZGVmXG4gICAgICB0cnkge1xuICAgICAgICByZXQgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnN1cHIgPSB0bXBcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXRcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcm9jZXNzKHdoYXQsIG8sIHN1cHIpIHtcbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIHdoYXRba10gPSBpc0ZuKG9ba10pXG4gICAgICAgICAgJiYgaXNGbihzdXByW3Byb3RvXVtrXSlcbiAgICAgICAgICAmJiBmblRlc3QudGVzdChvW2tdKVxuICAgICAgICAgID8gd3JhcChrLCBvW2tdLCBzdXByKSA6IG9ba11cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBleHRlbmQobywgZnJvbVN1Yikge1xuICAgIC8vIG11c3QgcmVkZWZpbmUgbm9vcCBlYWNoIHRpbWUgc28gaXQgZG9lc24ndCBpbmhlcml0IGZyb20gcHJldmlvdXMgYXJiaXRyYXJ5IGNsYXNzZXNcbiAgICBmdW5jdGlvbiBub29wKCkge31cbiAgICBub29wW3Byb3RvXSA9IHRoaXNbcHJvdG9dXG4gICAgdmFyIHN1cHIgPSB0aGlzXG4gICAgICAsIHByb3RvdHlwZSA9IG5ldyBub29wKClcbiAgICAgICwgaXNGdW5jdGlvbiA9IGlzRm4obylcbiAgICAgICwgX2NvbnN0cnVjdG9yID0gaXNGdW5jdGlvbiA/IG8gOiB0aGlzXG4gICAgICAsIF9tZXRob2RzID0gaXNGdW5jdGlvbiA/IHt9IDogb1xuICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZSkgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIGVsc2Uge1xuICAgICAgICBmcm9tU3ViIHx8IGlzRnVuY3Rpb24gJiYgc3Vwci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIF9jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm4ubWV0aG9kcyA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICBwcm9jZXNzKHByb3RvdHlwZSwgbywgc3VwcilcbiAgICAgIGZuW3Byb3RvXSA9IHByb3RvdHlwZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBmbi5tZXRob2RzLmNhbGwoZm4sIF9tZXRob2RzKS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmblxuXG4gICAgZm4uZXh0ZW5kID0gYXJndW1lbnRzLmNhbGxlZVxuICAgIGZuW3Byb3RvXS5pbXBsZW1lbnQgPSBmbi5zdGF0aWNzID0gZnVuY3Rpb24gKG8sIG9wdEZuKSB7XG4gICAgICBvID0gdHlwZW9mIG8gPT0gJ3N0cmluZycgPyAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2JqID0ge31cbiAgICAgICAgb2JqW29dID0gb3B0Rm5cbiAgICAgICAgcmV0dXJuIG9ialxuICAgICAgfSgpKSA6IG9cbiAgICAgIHByb2Nlc3ModGhpcywgbywgc3VwcilcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcmV0dXJuIGZuXG4gIH1cblxuICByZXR1cm4ga2xhc3Ncbn0pO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlGaWx0ZXI7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWFwO1xuIiwiLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UHVzaDtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFzc2lnblZhbHVlYCBleGNlcHQgdGhhdCBpdCBkb2Vzbid0IGFzc2lnblxuICogYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmICgodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhZXEob2JqZWN0W2tleV0sIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25NZXJnZVZhbHVlO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbicpLFxuICAgIGJhc2VBc3NpZ25JbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25JbicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgY29weVN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzSW4nKSxcbiAgICBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpLFxuICAgIGdldEFsbEtleXNJbiA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXNJbicpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9faW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzTWFwID0gcmVxdWlyZSgnLi9pc01hcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU2V0ID0gcmVxdWlyZSgnLi9pc1NldCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDEsXG4gICAgQ0xPTkVfRkxBVF9GTEFHID0gMixcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gRGVlcCBjbG9uZVxuICogIDIgLSBGbGF0dGVuIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG4gKiAgNCAtIENsb25lIHN5bWJvbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG4gIHZhciByZXN1bHQsXG4gICAgICBpc0RlZXAgPSBiaXRtYXNrICYgQ0xPTkVfREVFUF9GTEFHLFxuICAgICAgaXNGbGF0ID0gYml0bWFzayAmIENMT05FX0ZMQVRfRkxBRyxcbiAgICAgIGlzRnVsbCA9IGJpdG1hc2sgJiBDTE9ORV9TWU1CT0xTX0ZMQUc7XG5cbiAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICByZXN1bHQgPSBvYmplY3QgPyBjdXN0b21pemVyKHZhbHVlLCBrZXksIG9iamVjdCwgc3RhY2spIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gY29weUFycmF5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKSxcbiAgICAgICAgaXNGdW5jID0gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcblxuICAgIGlmIChpc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjbG9uZUJ1ZmZlcih2YWx1ZSwgaXNEZWVwKTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gKGlzRmxhdCB8fCBpc0Z1bmMpID8ge30gOiBpbml0Q2xvbmVPYmplY3QodmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGlzRmxhdFxuICAgICAgICAgID8gY29weVN5bWJvbHNJbih2YWx1ZSwgYmFzZUFzc2lnbkluKHJlc3VsdCwgdmFsdWUpKVxuICAgICAgICAgIDogY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcCk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KHZhbHVlKTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfVxuICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cbiAgaWYgKGlzU2V0KHZhbHVlKSkge1xuICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oc3ViVmFsdWUpIHtcbiAgICAgIHJlc3VsdC5hZGQoYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdWJWYWx1ZSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoaXNNYXAodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGtleXNGdW5jID0gaXNGdWxsXG4gICAgPyAoaXNGbGF0ID8gZ2V0QWxsS2V5c0luIDogZ2V0QWxsS2V5cylcbiAgICA6IChpc0ZsYXQgPyBrZXlzSW4gOiBrZXlzKTtcblxuICB2YXIgcHJvcHMgPSBpc0FyciA/IHVuZGVmaW5lZCA6IGtleXNGdW5jKHZhbHVlKTtcbiAgYXJyYXlFYWNoKHByb3BzIHx8IHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzdWJWYWx1ZTtcbiAgICAgIHN1YlZhbHVlID0gdmFsdWVba2V5XTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZ2V0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0QWxsS2V5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXBgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IG1hcFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXA7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1NldGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzU2V0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gc2V0VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1NldDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXNJbiA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5c0luKG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5c0luKG9iamVjdCk7XG4gIH1cbiAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzSW47XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBiYXNlTWVyZ2VEZWVwID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlRGVlcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyksXG4gICAgc2FmZUdldCA9IHJlcXVpcmUoJy4vX3NhZmVHZXQnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKG9iamVjdCA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJhc2VGb3Ioc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsdWUpKSB7XG4gICAgICBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICAgID8gY3VzdG9taXplcihzYWZlR2V0KG9iamVjdCwga2V5KSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgICB9XG4gICAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9LCBrZXlzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZTtcbiIsInZhciBhc3NpZ25NZXJnZVZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduTWVyZ2VWYWx1ZScpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuL2lzUGxhaW5PYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpLFxuICAgIHNhZmVHZXQgPSByZXF1aXJlKCcuL19zYWZlR2V0JyksXG4gICAgdG9QbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vdG9QbGFpbk9iamVjdCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZU1lcmdlYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIG1lcmdlcyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBtZXJnZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIG1lcmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIG1lcmdlRnVuYywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgdmFyIG9ialZhbHVlID0gc2FmZUdldChvYmplY3QsIGtleSksXG4gICAgICBzcmNWYWx1ZSA9IHNhZmVHZXQoc291cmNlLCBrZXkpLFxuICAgICAgc3RhY2tlZCA9IHN0YWNrLmdldChzcmNWYWx1ZSk7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBzdGFja2VkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgID8gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICA6IHVuZGVmaW5lZDtcblxuICB2YXIgaXNDb21tb24gPSBuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIHZhciBpc0FyciA9IGlzQXJyYXkoc3JjVmFsdWUpLFxuICAgICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgaXNCdWZmZXIoc3JjVmFsdWUpLFxuICAgICAgICBpc1R5cGVkID0gIWlzQXJyICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKTtcblxuICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyIHx8IGlzQnVmZiB8fCBpc1R5cGVkKSB7XG4gICAgICBpZiAoaXNBcnJheShvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlT2JqZWN0KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGNvcHlBcnJheShvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0J1ZmYpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZUJ1ZmZlcihzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc1R5cGVkKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVUeXBlZEFycmF5KHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXdWYWx1ZSA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHNyY1ZhbHVlKSB8fCBpc0FyZ3VtZW50cyhzcmNWYWx1ZSkpIHtcbiAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICBpZiAoaXNBcmd1bWVudHMob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdG9QbGFpbk9iamVjdChvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNPYmplY3Qob2JqVmFsdWUpIHx8IGlzRnVuY3Rpb24ob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gaW5pdENsb25lT2JqZWN0KHNyY1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaXNDb21tb24pIHtcbiAgICAvLyBSZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBzdGFjay5zZXQoc3JjVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICBtZXJnZUZ1bmMobmV3VmFsdWUsIHNyY1ZhbHVlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIHN0YWNrWydkZWxldGUnXShzcmNWYWx1ZSk7XG4gIH1cbiAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZURlZXA7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG4iLCJ2YXIgY29uc3RhbnQgPSByZXF1aXJlKCcuL2NvbnN0YW50JyksXG4gICAgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcbiAgICAnd3JpdGFibGUnOiB0cnVlXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgdmFsdWVzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgcmV0dXJuIGFycmF5TWFwKHZhbHVlLCBiYXNlVG9TdHJpbmcpICsgJyc7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBgaWRlbnRpdHlgIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgY2FzdCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2FzdEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlIDogaWRlbnRpdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEZ1bmN0aW9uO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gaXNLZXkodmFsdWUsIG9iamVjdCkgPyBbdmFsdWVdIDogc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgZGF0YSB2aWV3LlxuICovXG5mdW5jdGlvbiBjbG9uZURhdGFWaWV3KGRhdGFWaWV3LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIoZGF0YVZpZXcuYnVmZmVyKSA6IGRhdGFWaWV3LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGBzeW1ib2xgIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHN5bWJvbCBUaGUgc3ltYm9sIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzeW1ib2wgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbG9uZVN5bWJvbChzeW1ib2wpIHtcbiAgcmV0dXJuIHN5bWJvbFZhbHVlT2YgPyBPYmplY3Qoc3ltYm9sVmFsdWVPZi5jYWxsKHN5bWJvbCkpIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVTeW1ib2w7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVR5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpO1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICB2YXIgaXNOZXcgPSAhb2JqZWN0O1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9scyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBhbmQgaW5oZXJpdGVkIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzSW4oc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgPyAobGVuZ3RoLS0sIGN1c3RvbWl6ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBpbmRleCwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0luLCBnZXRTeW1ib2xzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXNJbjtcbiIsInZhciBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hcERhdGE7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQcm90b3R5cGU7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCJ2YXIgYXJyYXlGaWx0ZXIgPSByZXF1aXJlKCcuL19hcnJheUZpbHRlcicpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYXJyYXlGaWx0ZXIobmF0aXZlR2V0U3ltYm9scyhvYmplY3QpLCBmdW5jdGlvbihzeW1ib2wpIHtcbiAgICByZXR1cm4gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTeW1ib2xzO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9sc0luID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB3aGlsZSAob2JqZWN0KSB7XG4gICAgYXJyYXlQdXNoKHJlc3VsdCwgZ2V0U3ltYm9scyhvYmplY3QpKTtcbiAgICBvYmplY3QgPSBnZXRQcm90b3R5cGUob2JqZWN0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTeW1ib2xzSW47XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWYWx1ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hIYXM7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyksXG4gICAgY2xvbmVEYXRhVmlldyA9IHJlcXVpcmUoJy4vX2Nsb25lRGF0YVZpZXcnKSxcbiAgICBjbG9uZVJlZ0V4cCA9IHJlcXVpcmUoJy4vX2Nsb25lUmVnRXhwJyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTWFwYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBgU2V0YCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lQXJyYXlCdWZmZXIob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgcmV0dXJuIGNsb25lRGF0YVZpZXcob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBmbG9hdDMyVGFnOiBjYXNlIGZsb2F0NjRUYWc6XG4gICAgY2FzZSBpbnQ4VGFnOiBjYXNlIGludDE2VGFnOiBjYXNlIGludDMyVGFnOlxuICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVUeXBlZEFycmF5KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lUmVnRXhwKG9iamVjdCk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgcmV0dXJuIGNsb25lU3ltYm9sKG9iamVjdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuXG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlID09ICdudW1iZXInIHx8XG4gICAgICAodHlwZSAhPSAnc3ltYm9sJyAmJiByZUlzVWludC50ZXN0KHZhbHVlKSkpICYmXG4gICAgICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFxuICAgIHJlSXNQbGFpblByb3AgPSAvXlxcdyokLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUgYW5kIG5vdCBhIHByb3BlcnR5IHBhdGguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleSh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJyB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4vbWVtb2l6ZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZUNhcHBlZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzSW47XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2UgYHV0aWwudHlwZXNgIGZvciBOb2RlLmpzIDEwKy5cbiAgICB2YXIgdHlwZXMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUucmVxdWlyZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUoJ3V0aWwnKS50eXBlcztcblxuICAgIGlmICh0eXBlcykge1xuICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cblxuICAgIC8vIExlZ2FjeSBgcHJvY2Vzcy5iaW5kaW5nKCd1dGlsJylgIGZvciBOb2RlLmpzIDwgMTAuXG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgLCB1bmxlc3MgYGtleWAgaXMgXCJfX3Byb3RvX19cIiBvciBcImNvbnN0cnVjdG9yXCIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzYWZlR2V0KG9iamVjdCwga2V5KSB7XG4gIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgJiYgdHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGtleSA9PSAnX19wcm90b19fJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzYWZlR2V0O1xuIiwidmFyIGJhc2VTZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VTZXRUb1N0cmluZycpLFxuICAgIHNob3J0T3V0ID0gcmVxdWlyZSgnLi9fc2hvcnRPdXQnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcbiIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0hhcztcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoMCkgPT09IDQ2IC8qIC4gKi8pIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQXNzaWduZXInKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC5cbiAqIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BPYmplY3QuYXNzaWduYF0oaHR0cHM6Ly9tZG4uaW8vT2JqZWN0L2Fzc2lnbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEwLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5hc3NpZ25JblxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gQmFyKCkge1xuICogICB0aGlzLmMgPSAzO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYiA9IDI7XG4gKiBCYXIucHJvdG90eXBlLmQgPSA0O1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAwIH0sIG5ldyBGb28sIG5ldyBCYXIpO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSkge1xuICBpZiAoaXNQcm90b3R5cGUoc291cmNlKSB8fCBpc0FycmF5TGlrZShzb3VyY2UpKSB7XG4gICAgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5jbG9uZWAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgY2xvbmVzIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJlY3Vyc2l2ZWx5IGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGRlZXAgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBkZWVwID0gXy5jbG9uZURlZXAob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhkZWVwWzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBDTE9ORV9ERUVQX0ZMQUcgfCBDTE9ORV9TWU1CT0xTX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGVlcDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXE7XG4iLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGNhc3RGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2Nhc3RGdW5jdGlvbicpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgY2FzdEZ1bmN0aW9uKGl0ZXJhdGVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAqIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2VPYmplY3Q7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwidmFyIGJhc2VJc01hcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNNYXAgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc01hcDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE1hcGAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNNYXAobmV3IE1hcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc01hcChuZXcgV2Vha01hcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNNYXAgPSBub2RlSXNNYXAgPyBiYXNlVW5hcnkobm9kZUlzTWFwKSA6IGJhc2VJc01hcDtcblxubW9kdWxlLmV4cG9ydHMgPSBpc01hcDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYmFzZUlzU2V0ID0gcmVxdWlyZSgnLi9fYmFzZUlzU2V0JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5c0luID0gcmVxdWlyZSgnLi9fYmFzZUtleXNJbicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuL19iYXNlTWVyZ2UnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5hc3NpZ25gIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IG1lcmdlcyBvd24gYW5kXG4gKiBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyBpbnRvIHRoZVxuICogZGVzdGluYXRpb24gb2JqZWN0LiBTb3VyY2UgcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgYXJlXG4gKiBza2lwcGVkIGlmIGEgZGVzdGluYXRpb24gdmFsdWUgZXhpc3RzLiBBcnJheSBhbmQgcGxhaW4gb2JqZWN0IHByb3BlcnRpZXNcbiAqIGFyZSBtZXJnZWQgcmVjdXJzaXZlbHkuIE90aGVyIG9iamVjdHMgYW5kIHZhbHVlIHR5cGVzIGFyZSBvdmVycmlkZGVuIGJ5XG4gKiBhc3NpZ25tZW50LiBTb3VyY2Ugb2JqZWN0cyBhcmUgYXBwbGllZCBmcm9tIGxlZnQgdG8gcmlnaHQuIFN1YnNlcXVlbnRcbiAqIHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjUuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0ge1xuICogICAnYSc6IFt7ICdiJzogMiB9LCB7ICdkJzogNCB9XVxuICogfTtcbiAqXG4gKiB2YXIgb3RoZXIgPSB7XG4gKiAgICdhJzogW3sgJ2MnOiAzIH0sIHsgJ2UnOiA1IH1dXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2Uob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB7ICdhJzogW3sgJ2InOiAyLCAnYyc6IDMgfSwgeyAnZCc6IDQsICdlJzogNSB9XSB9XG4gKi9cbnZhciBtZXJnZSA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCkge1xuICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5ub29wKTtcbiAqIC8vID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZF1cbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub29wO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViQXJyYXk7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcGxhaW4gb2JqZWN0IGZsYXR0ZW5pbmcgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nXG4gKiBrZXllZCBwcm9wZXJ0aWVzIG9mIGB2YWx1ZWAgdG8gb3duIHByb3BlcnRpZXMgb2YgdGhlIHBsYWluIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBwbGFpbiBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgXy50b1BsYWluT2JqZWN0KG5ldyBGb28pKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHRvUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3QodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1N0cmluZztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCB1bmRlZjtcblxuLyoqXG4gKiBEZWNvZGUgYSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKiBAcmV0dXJucyB7U3RyaW5nfE51bGx9IFRoZSBkZWNvZGVkIHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0LnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gZW5jb2RlIGEgZ2l2ZW4gaW5wdXQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgdGhhdCBuZWVkcyB0byBiZSBlbmNvZGVkLlxuICogQHJldHVybnMge1N0cmluZ3xOdWxsfSBUaGUgZW5jb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChpbnB1dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBxdWVyeSBzdHJpbmcgcGFyc2VyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeSBUaGUgcXVlcnkgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgcGFyc2VkLlxuICogQHJldHVybnMge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nKHF1ZXJ5KSB7XG4gIHZhciBwYXJzZXIgPSAvKFtePT8jJl0rKT0/KFteJl0qKS9nXG4gICAgLCByZXN1bHQgPSB7fVxuICAgICwgcGFydDtcblxuICB3aGlsZSAocGFydCA9IHBhcnNlci5leGVjKHF1ZXJ5KSkge1xuICAgIHZhciBrZXkgPSBkZWNvZGUocGFydFsxXSlcbiAgICAgICwgdmFsdWUgPSBkZWNvZGUocGFydFsyXSk7XG5cbiAgICAvL1xuICAgIC8vIFByZXZlbnQgb3ZlcnJpZGluZyBvZiBleGlzdGluZyBwcm9wZXJ0aWVzLiBUaGlzIGVuc3VyZXMgdGhhdCBidWlsZC1pblxuICAgIC8vIG1ldGhvZHMgbGlrZSBgdG9TdHJpbmdgIG9yIF9fcHJvdG9fXyBhcmUgbm90IG92ZXJyaWRlbiBieSBtYWxpY2lvdXNcbiAgICAvLyBxdWVyeXN0cmluZ3MuXG4gICAgLy9cbiAgICAvLyBJbiB0aGUgY2FzZSBpZiBmYWlsZWQgZGVjb2RpbmcsIHdlIHdhbnQgdG8gb21pdCB0aGUga2V5L3ZhbHVlIHBhaXJzXG4gICAgLy8gZnJvbSB0aGUgcmVzdWx0LlxuICAgIC8vXG4gICAgaWYgKGtleSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCBrZXkgaW4gcmVzdWx0KSBjb250aW51ZTtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYSBxdWVyeSBzdHJpbmcgdG8gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogT2JqZWN0IHRoYXQgc2hvdWxkIGJlIHRyYW5zZm9ybWVkLlxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeCBPcHRpb25hbCBwcmVmaXguXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmdpZnkob2JqLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4IHx8ICcnO1xuXG4gIHZhciBwYWlycyA9IFtdXG4gICAgLCB2YWx1ZVxuICAgICwga2V5O1xuXG4gIC8vXG4gIC8vIE9wdGlvbmFsbHkgcHJlZml4IHdpdGggYSAnPycgaWYgbmVlZGVkXG4gIC8vXG4gIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIHByZWZpeCkgcHJlZml4ID0gJz8nO1xuXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmIChoYXMuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICAgIC8vXG4gICAgICAvLyBFZGdlIGNhc2VzIHdoZXJlIHdlIGFjdHVhbGx5IHdhbnQgdG8gZW5jb2RlIHRoZSB2YWx1ZSB0byBhbiBlbXB0eVxuICAgICAgLy8gc3RyaW5nIGluc3RlYWQgb2YgdGhlIHN0cmluZ2lmaWVkIHZhbHVlLlxuICAgICAgLy9cbiAgICAgIGlmICghdmFsdWUgJiYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZiB8fCBpc05hTih2YWx1ZSkpKSB7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGtleSA9IGVuY29kZShrZXkpO1xuICAgICAgdmFsdWUgPSBlbmNvZGUodmFsdWUpO1xuXG4gICAgICAvL1xuICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGVuY29kZSB0aGUgc3RyaW5ncywgd2Ugc2hvdWxkIGJhaWwgb3V0IGFzIHdlIGRvbid0XG4gICAgICAvLyB3YW50IHRvIGFkZCBpbnZhbGlkIHN0cmluZ3MgdG8gdGhlIHF1ZXJ5LlxuICAgICAgLy9cbiAgICAgIGlmIChrZXkgPT09IG51bGwgfHwgdmFsdWUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgcGFpcnMucHVzaChrZXkgKyc9JysgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYWlycy5sZW5ndGggPyBwcmVmaXggKyBwYWlycy5qb2luKCcmJykgOiAnJztcbn1cblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydHMuc3RyaW5naWZ5ID0gcXVlcnlzdHJpbmdpZnk7XG5leHBvcnRzLnBhcnNlID0gcXVlcnlzdHJpbmc7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2hlY2sgaWYgd2UncmUgcmVxdWlyZWQgdG8gYWRkIGEgcG9ydCBudW1iZXIuXG4gKlxuICogQHNlZSBodHRwczovL3VybC5zcGVjLndoYXR3Zy5vcmcvI2RlZmF1bHQtcG9ydFxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBwb3J0IFBvcnQgbnVtYmVyIHdlIG5lZWQgdG8gY2hlY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCB3ZSBuZWVkIHRvIGNoZWNrIGFnYWluc3QuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gSXMgaXQgYSBkZWZhdWx0IHBvcnQgZm9yIHRoZSBnaXZlbiBwcm90b2NvbFxuICogQGFwaSBwcml2YXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVxdWlyZWQocG9ydCwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbC5zcGxpdCgnOicpWzBdO1xuICBwb3J0ID0gK3BvcnQ7XG5cbiAgaWYgKCFwb3J0KSByZXR1cm4gZmFsc2U7XG5cbiAgc3dpdGNoIChwcm90b2NvbCkge1xuICAgIGNhc2UgJ2h0dHAnOlxuICAgIGNhc2UgJ3dzJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gODA7XG5cbiAgICBjYXNlICdodHRwcyc6XG4gICAgY2FzZSAnd3NzJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNDQzO1xuXG4gICAgY2FzZSAnZnRwJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gMjE7XG5cbiAgICBjYXNlICdnb3BoZXInOlxuICAgIHJldHVybiBwb3J0ICE9PSA3MDtcblxuICAgIGNhc2UgJ2ZpbGUnOlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwb3J0ICE9PSAwO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVpcmVkID0gcmVxdWlyZSgncmVxdWlyZXMtcG9ydCcpXG4gICwgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZ2lmeScpXG4gICwgc2xhc2hlcyA9IC9eW0EtWmEtel1bQS1aYS16MC05Ky0uXSo6XFwvXFwvL1xuICAsIHByb3RvY29scmUgPSAvXihbYS16XVthLXowLTkuKy1dKjopPyhcXC9cXC8pPyhbXFxcXC9dKyk/KFtcXFNcXHNdKikvaVxuICAsIHdpbmRvd3NEcml2ZUxldHRlciA9IC9eW2EtekEtWl06L1xuICAsIHdoaXRlc3BhY2UgPSAnW1xcXFx4MDlcXFxceDBBXFxcXHgwQlxcXFx4MENcXFxceDBEXFxcXHgyMFxcXFx4QTBcXFxcdTE2ODBcXFxcdTE4MEVcXFxcdTIwMDBcXFxcdTIwMDFcXFxcdTIwMDJcXFxcdTIwMDNcXFxcdTIwMDRcXFxcdTIwMDVcXFxcdTIwMDZcXFxcdTIwMDdcXFxcdTIwMDhcXFxcdTIwMDlcXFxcdTIwMEFcXFxcdTIwMkZcXFxcdTIwNUZcXFxcdTMwMDBcXFxcdTIwMjhcXFxcdTIwMjlcXFxcdUZFRkZdJ1xuICAsIGxlZnQgPSBuZXcgUmVnRXhwKCdeJysgd2hpdGVzcGFjZSArJysnKTtcblxuLyoqXG4gKiBUcmltIGEgZ2l2ZW4gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIHRyaW0uXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRyaW1MZWZ0KHN0cikge1xuICByZXR1cm4gKHN0ciA/IHN0ciA6ICcnKS50b1N0cmluZygpLnJlcGxhY2UobGVmdCwgJycpO1xufVxuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgcGFyc2UgcnVsZXMgZm9yIHRoZSBVUkwgcGFyc2VyLCBpdCBpbmZvcm1zIHRoZSBwYXJzZXJcbiAqIGFib3V0OlxuICpcbiAqIDAuIFRoZSBjaGFyIGl0IE5lZWRzIHRvIHBhcnNlLCBpZiBpdCdzIGEgc3RyaW5nIGl0IHNob3VsZCBiZSBkb25lIHVzaW5nXG4gKiAgICBpbmRleE9mLCBSZWdFeHAgdXNpbmcgZXhlYyBhbmQgTmFOIG1lYW5zIHNldCBhcyBjdXJyZW50IHZhbHVlLlxuICogMS4gVGhlIHByb3BlcnR5IHdlIHNob3VsZCBzZXQgd2hlbiBwYXJzaW5nIHRoaXMgdmFsdWUuXG4gKiAyLiBJbmRpY2F0aW9uIGlmIGl0J3MgYmFja3dhcmRzIG9yIGZvcndhcmQgcGFyc2luZywgd2hlbiBzZXQgYXMgbnVtYmVyIGl0J3NcbiAqICAgIHRoZSB2YWx1ZSBvZiBleHRyYSBjaGFycyB0aGF0IHNob3VsZCBiZSBzcGxpdCBvZmYuXG4gKiAzLiBJbmhlcml0IGZyb20gbG9jYXRpb24gaWYgbm9uIGV4aXN0aW5nIGluIHRoZSBwYXJzZXIuXG4gKiA0LiBgdG9Mb3dlckNhc2VgIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gKi9cbnZhciBydWxlcyA9IFtcbiAgWycjJywgJ2hhc2gnXSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIFsnPycsICdxdWVyeSddLCAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBmdW5jdGlvbiBzYW5pdGl6ZShhZGRyZXNzLCB1cmwpIHsgICAgIC8vIFNhbml0aXplIHdoYXQgaXMgbGVmdCBvZiB0aGUgYWRkcmVzc1xuICAgIHJldHVybiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSA/IGFkZHJlc3MucmVwbGFjZSgvXFxcXC9nLCAnLycpIDogYWRkcmVzcztcbiAgfSxcbiAgWycvJywgJ3BhdGhuYW1lJ10sICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIFsnQCcsICdhdXRoJywgMV0sICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBmcm9udC5cbiAgW05hTiwgJ2hvc3QnLCB1bmRlZmluZWQsIDEsIDFdLCAgICAgICAvLyBTZXQgbGVmdCBvdmVyIHZhbHVlLlxuICBbLzooXFxkKykkLywgJ3BvcnQnLCB1bmRlZmluZWQsIDFdLCAgICAvLyBSZWdFeHAgdGhlIGJhY2suXG4gIFtOYU4sICdob3N0bmFtZScsIHVuZGVmaW5lZCwgMSwgMV0gICAgLy8gU2V0IGxlZnQgb3Zlci5cbl07XG5cbi8qKlxuICogVGhlc2UgcHJvcGVydGllcyBzaG91bGQgbm90IGJlIGNvcGllZCBvciBpbmhlcml0ZWQgZnJvbS4gVGhpcyBpcyBvbmx5IG5lZWRlZFxuICogZm9yIGFsbCBub24gYmxvYiBVUkwncyBhcyBhIGJsb2IgVVJMIGRvZXMgbm90IGluY2x1ZGUgYSBoYXNoLCBvbmx5IHRoZVxuICogb3JpZ2luLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgaWdub3JlID0geyBoYXNoOiAxLCBxdWVyeTogMSB9O1xuXG4vKipcbiAqIFRoZSBsb2NhdGlvbiBvYmplY3QgZGlmZmVycyB3aGVuIHlvdXIgY29kZSBpcyBsb2FkZWQgdGhyb3VnaCBhIG5vcm1hbCBwYWdlLFxuICogV29ya2VyIG9yIHRocm91Z2ggYSB3b3JrZXIgdXNpbmcgYSBibG9iLiBBbmQgd2l0aCB0aGUgYmxvYmJsZSBiZWdpbnMgdGhlXG4gKiB0cm91YmxlIGFzIHRoZSBsb2NhdGlvbiBvYmplY3Qgd2lsbCBjb250YWluIHRoZSBVUkwgb2YgdGhlIGJsb2IsIG5vdCB0aGVcbiAqIGxvY2F0aW9uIG9mIHRoZSBwYWdlIHdoZXJlIG91ciBjb2RlIGlzIGxvYWRlZCBpbi4gVGhlIGFjdHVhbCBvcmlnaW4gaXNcbiAqIGVuY29kZWQgaW4gdGhlIGBwYXRobmFtZWAgc28gd2UgY2FuIHRoYW5rZnVsbHkgZ2VuZXJhdGUgYSBnb29kIFwiZGVmYXVsdFwiXG4gKiBsb2NhdGlvbiBmcm9tIGl0IHNvIHdlIGNhbiBnZW5lcmF0ZSBwcm9wZXIgcmVsYXRpdmUgVVJMJ3MgYWdhaW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBsb2MgT3B0aW9uYWwgZGVmYXVsdCBsb2NhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBsb2xjYXRpb24gb2JqZWN0LlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBsb2xjYXRpb24obG9jKSB7XG4gIHZhciBnbG9iYWxWYXI7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSBnbG9iYWxWYXIgPSB3aW5kb3c7XG4gIGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSBnbG9iYWxWYXIgPSBnbG9iYWw7XG4gIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gc2VsZjtcbiAgZWxzZSBnbG9iYWxWYXIgPSB7fTtcblxuICB2YXIgbG9jYXRpb24gPSBnbG9iYWxWYXIubG9jYXRpb24gfHwge307XG4gIGxvYyA9IGxvYyB8fCBsb2NhdGlvbjtcblxuICB2YXIgZmluYWxkZXN0aW5hdGlvbiA9IHt9XG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY1xuICAgICwga2V5O1xuXG4gIGlmICgnYmxvYjonID09PSBsb2MucHJvdG9jb2wpIHtcbiAgICBmaW5hbGRlc3RpbmF0aW9uID0gbmV3IFVybCh1bmVzY2FwZShsb2MucGF0aG5hbWUpLCB7fSk7XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGUpIHtcbiAgICBmaW5hbGRlc3RpbmF0aW9uID0gbmV3IFVybChsb2MsIHt9KTtcbiAgICBmb3IgKGtleSBpbiBpZ25vcmUpIGRlbGV0ZSBmaW5hbGRlc3RpbmF0aW9uW2tleV07XG4gIH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGUpIHtcbiAgICBmb3IgKGtleSBpbiBsb2MpIHtcbiAgICAgIGlmIChrZXkgaW4gaWdub3JlKSBjb250aW51ZTtcbiAgICAgIGZpbmFsZGVzdGluYXRpb25ba2V5XSA9IGxvY1trZXldO1xuICAgIH1cblxuICAgIGlmIChmaW5hbGRlc3RpbmF0aW9uLnNsYXNoZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID0gc2xhc2hlcy50ZXN0KGxvYy5ocmVmKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmluYWxkZXN0aW5hdGlvbjtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGEgcHJvdG9jb2wgc2NoZW1lIGlzIHNwZWNpYWwuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFRoZSBwcm90b2NvbCBzY2hlbWUgb2YgdGhlIFVSTFxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBwcm90b2NvbCBzY2hlbWUgaXMgc3BlY2lhbCwgZWxzZSBgZmFsc2VgXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc1NwZWNpYWwoc2NoZW1lKSB7XG4gIHJldHVybiAoXG4gICAgc2NoZW1lID09PSAnZmlsZTonIHx8XG4gICAgc2NoZW1lID09PSAnZnRwOicgfHxcbiAgICBzY2hlbWUgPT09ICdodHRwOicgfHxcbiAgICBzY2hlbWUgPT09ICdodHRwczonIHx8XG4gICAgc2NoZW1lID09PSAnd3M6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ3dzczonXG4gICk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgUHJvdG9jb2xFeHRyYWN0XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCBtYXRjaGVkIGluIHRoZSBVUkwsIGluIGxvd2VyY2FzZS5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2xhc2hlcyBgdHJ1ZWAgaWYgcHJvdG9jb2wgaXMgZm9sbG93ZWQgYnkgXCIvL1wiLCBlbHNlIGBmYWxzZWAuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcmVzdCBSZXN0IG9mIHRoZSBVUkwgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgcHJvdG9jb2wuXG4gKi9cblxuLyoqXG4gKiBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGZyb20gYSBVUkwgd2l0aC93aXRob3V0IGRvdWJsZSBzbGFzaCAoXCIvL1wiKS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBleHRyYWN0IGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gbG9jYXRpb25cbiAqIEByZXR1cm4ge1Byb3RvY29sRXh0cmFjdH0gRXh0cmFjdGVkIGluZm9ybWF0aW9uLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFByb3RvY29sKGFkZHJlc3MsIGxvY2F0aW9uKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcbiAgbG9jYXRpb24gPSBsb2NhdGlvbiB8fCB7fTtcblxuICB2YXIgbWF0Y2ggPSBwcm90b2NvbHJlLmV4ZWMoYWRkcmVzcyk7XG4gIHZhciBwcm90b2NvbCA9IG1hdGNoWzFdID8gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSA6ICcnO1xuICB2YXIgZm9yd2FyZFNsYXNoZXMgPSAhIW1hdGNoWzJdO1xuICB2YXIgb3RoZXJTbGFzaGVzID0gISFtYXRjaFszXTtcbiAgdmFyIHNsYXNoZXNDb3VudCA9IDA7XG4gIHZhciByZXN0O1xuXG4gIGlmIChmb3J3YXJkU2xhc2hlcykge1xuICAgIGlmIChvdGhlclNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSBtYXRjaFsyXSArIG1hdGNoWzNdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFsyXS5sZW5ndGggKyBtYXRjaFszXS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3QgPSBtYXRjaFsyXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbMl0ubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAob3RoZXJTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gbWF0Y2hbM10gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzNdLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdCA9IG1hdGNoWzRdXG4gICAgfVxuICB9XG5cbiAgaWYgKHByb3RvY29sID09PSAnZmlsZTonKSB7XG4gICAgaWYgKHNsYXNoZXNDb3VudCA+PSAyKSB7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZSgyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNTcGVjaWFsKHByb3RvY29sKSkge1xuICAgIHJlc3QgPSBtYXRjaFs0XTtcbiAgfSBlbHNlIGlmIChwcm90b2NvbCkge1xuICAgIGlmIChmb3J3YXJkU2xhc2hlcykge1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoMik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHNsYXNoZXNDb3VudCA+PSAyICYmIGlzU3BlY2lhbChsb2NhdGlvbi5wcm90b2NvbCkpIHtcbiAgICByZXN0ID0gbWF0Y2hbNF07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBzbGFzaGVzOiBmb3J3YXJkU2xhc2hlcyB8fCBpc1NwZWNpYWwocHJvdG9jb2wpLFxuICAgIHNsYXNoZXNDb3VudDogc2xhc2hlc0NvdW50LFxuICAgIHJlc3Q6IHJlc3RcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgcmVsYXRpdmUgVVJMIHBhdGhuYW1lIGFnYWluc3QgYSBiYXNlIFVSTCBwYXRobmFtZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpdmUgUGF0aG5hbWUgb2YgdGhlIHJlbGF0aXZlIFVSTC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlIFBhdGhuYW1lIG9mIHRoZSBiYXNlIFVSTC5cbiAqIEByZXR1cm4ge1N0cmluZ30gUmVzb2x2ZWQgcGF0aG5hbWUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZXNvbHZlKHJlbGF0aXZlLCBiYXNlKSB7XG4gIGlmIChyZWxhdGl2ZSA9PT0gJycpIHJldHVybiBiYXNlO1xuXG4gIHZhciBwYXRoID0gKGJhc2UgfHwgJy8nKS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5jb25jYXQocmVsYXRpdmUuc3BsaXQoJy8nKSlcbiAgICAsIGkgPSBwYXRoLmxlbmd0aFxuICAgICwgbGFzdCA9IHBhdGhbaSAtIDFdXG4gICAgLCB1bnNoaWZ0ID0gZmFsc2VcbiAgICAsIHVwID0gMDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHBhdGhbaV0gPT09ICcuJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXRoW2ldID09PSAnLi4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgaWYgKGkgPT09IDApIHVuc2hpZnQgPSB0cnVlO1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bnNoaWZ0KSBwYXRoLnVuc2hpZnQoJycpO1xuICBpZiAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHBhdGgucHVzaCgnJyk7XG5cbiAgcmV0dXJuIHBhdGguam9pbignLycpO1xufVxuXG4vKipcbiAqIFRoZSBhY3R1YWwgVVJMIGluc3RhbmNlLiBJbnN0ZWFkIG9mIHJldHVybmluZyBhbiBvYmplY3Qgd2UndmUgb3B0ZWQtaW4gdG9cbiAqIGNyZWF0ZSBhbiBhY3R1YWwgY29uc3RydWN0b3IgYXMgaXQncyBtdWNoIG1vcmUgbWVtb3J5IGVmZmljaWVudCBhbmRcbiAqIGZhc3RlciBhbmQgaXQgcGxlYXNlcyBteSBPQ0QuXG4gKlxuICogSXQgaXMgd29ydGggbm90aW5nIHRoYXQgd2Ugc2hvdWxkIG5vdCB1c2UgYFVSTGAgYXMgY2xhc3MgbmFtZSB0byBwcmV2ZW50XG4gKiBjbGFzaGVzIHdpdGggdGhlIGdsb2JhbCBVUkwgaW5zdGFuY2UgdGhhdCBnb3QgaW50cm9kdWNlZCBpbiBicm93c2Vycy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIFVSTCB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBbbG9jYXRpb25dIExvY2F0aW9uIGRlZmF1bHRzIGZvciByZWxhdGl2ZSBwYXRocy5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gW3BhcnNlcl0gUGFyc2VyIGZvciB0aGUgcXVlcnkgc3RyaW5nLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpIHtcbiAgYWRkcmVzcyA9IHRyaW1MZWZ0KGFkZHJlc3MpO1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVcmwpKSB7XG4gICAgcmV0dXJuIG5ldyBVcmwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcik7XG4gIH1cblxuICB2YXIgcmVsYXRpdmUsIGV4dHJhY3RlZCwgcGFyc2UsIGluc3RydWN0aW9uLCBpbmRleCwga2V5XG4gICAgLCBpbnN0cnVjdGlvbnMgPSBydWxlcy5zbGljZSgpXG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY2F0aW9uXG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBpID0gMDtcblxuICAvL1xuICAvLyBUaGUgZm9sbG93aW5nIGlmIHN0YXRlbWVudHMgYWxsb3dzIHRoaXMgbW9kdWxlIHR3byBoYXZlIGNvbXBhdGliaWxpdHkgd2l0aFxuICAvLyAyIGRpZmZlcmVudCBBUEk6XG4gIC8vXG4gIC8vIDEuIE5vZGUuanMncyBgdXJsLnBhcnNlYCBhcGkgd2hpY2ggYWNjZXB0cyBhIFVSTCwgYm9vbGVhbiBhcyBhcmd1bWVudHNcbiAgLy8gICAgd2hlcmUgdGhlIGJvb2xlYW4gaW5kaWNhdGVzIHRoYXQgdGhlIHF1ZXJ5IHN0cmluZyBzaG91bGQgYWxzbyBiZSBwYXJzZWQuXG4gIC8vXG4gIC8vIDIuIFRoZSBgVVJMYCBpbnRlcmZhY2Ugb2YgdGhlIGJyb3dzZXIgd2hpY2ggYWNjZXB0cyBhIFVSTCwgb2JqZWN0IGFzXG4gIC8vICAgIGFyZ3VtZW50cy4gVGhlIHN1cHBsaWVkIG9iamVjdCB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdCB2YWx1ZXMgLyBmYWxsLWJhY2tcbiAgLy8gICAgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICAvL1xuICBpZiAoJ29iamVjdCcgIT09IHR5cGUgJiYgJ3N0cmluZycgIT09IHR5cGUpIHtcbiAgICBwYXJzZXIgPSBsb2NhdGlvbjtcbiAgICBsb2NhdGlvbiA9IG51bGw7XG4gIH1cblxuICBpZiAocGFyc2VyICYmICdmdW5jdGlvbicgIT09IHR5cGVvZiBwYXJzZXIpIHBhcnNlciA9IHFzLnBhcnNlO1xuXG4gIGxvY2F0aW9uID0gbG9sY2F0aW9uKGxvY2F0aW9uKTtcblxuICAvL1xuICAvLyBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGJlZm9yZSBydW5uaW5nIHRoZSBpbnN0cnVjdGlvbnMuXG4gIC8vXG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RQcm90b2NvbChhZGRyZXNzIHx8ICcnLCBsb2NhdGlvbik7XG4gIHJlbGF0aXZlID0gIWV4dHJhY3RlZC5wcm90b2NvbCAmJiAhZXh0cmFjdGVkLnNsYXNoZXM7XG4gIHVybC5zbGFzaGVzID0gZXh0cmFjdGVkLnNsYXNoZXMgfHwgcmVsYXRpdmUgJiYgbG9jYXRpb24uc2xhc2hlcztcbiAgdXJsLnByb3RvY29sID0gZXh0cmFjdGVkLnByb3RvY29sIHx8IGxvY2F0aW9uLnByb3RvY29sIHx8ICcnO1xuICBhZGRyZXNzID0gZXh0cmFjdGVkLnJlc3Q7XG5cbiAgLy9cbiAgLy8gV2hlbiB0aGUgYXV0aG9yaXR5IGNvbXBvbmVudCBpcyBhYnNlbnQgdGhlIFVSTCBzdGFydHMgd2l0aCBhIHBhdGhcbiAgLy8gY29tcG9uZW50LlxuICAvL1xuICBpZiAoXG4gICAgZXh0cmFjdGVkLnByb3RvY29sID09PSAnZmlsZTonICYmIChcbiAgICAgIGV4dHJhY3RlZC5zbGFzaGVzQ291bnQgIT09IDIgfHwgd2luZG93c0RyaXZlTGV0dGVyLnRlc3QoYWRkcmVzcykpIHx8XG4gICAgKCFleHRyYWN0ZWQuc2xhc2hlcyAmJlxuICAgICAgKGV4dHJhY3RlZC5wcm90b2NvbCB8fFxuICAgICAgICBleHRyYWN0ZWQuc2xhc2hlc0NvdW50IDwgMiB8fFxuICAgICAgICAhaXNTcGVjaWFsKHVybC5wcm90b2NvbCkpKVxuICApIHtcbiAgICBpbnN0cnVjdGlvbnNbM10gPSBbLyguKikvLCAncGF0aG5hbWUnXTtcbiAgfVxuXG4gIGZvciAoOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSBpbnN0cnVjdGlvbnNbaV07XG5cbiAgICBpZiAodHlwZW9mIGluc3RydWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhZGRyZXNzID0gaW5zdHJ1Y3Rpb24oYWRkcmVzcywgdXJsKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBhcnNlID0gaW5zdHJ1Y3Rpb25bMF07XG4gICAga2V5ID0gaW5zdHJ1Y3Rpb25bMV07XG5cbiAgICBpZiAocGFyc2UgIT09IHBhcnNlKSB7XG4gICAgICB1cmxba2V5XSA9IGFkZHJlc3M7XG4gICAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHBhcnNlKSB7XG4gICAgICBpZiAofihpbmRleCA9IGFkZHJlc3MuaW5kZXhPZihwYXJzZSkpKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGluc3RydWN0aW9uWzJdKSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZShpbmRleCArIGluc3RydWN0aW9uWzJdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGluZGV4ID0gcGFyc2UuZXhlYyhhZGRyZXNzKSkpIHtcbiAgICAgIHVybFtrZXldID0gaW5kZXhbMV07XG4gICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleC5pbmRleCk7XG4gICAgfVxuXG4gICAgdXJsW2tleV0gPSB1cmxba2V5XSB8fCAoXG4gICAgICByZWxhdGl2ZSAmJiBpbnN0cnVjdGlvblszXSA/IGxvY2F0aW9uW2tleV0gfHwgJycgOiAnJ1xuICAgICk7XG5cbiAgICAvL1xuICAgIC8vIEhvc3RuYW1lLCBob3N0IGFuZCBwcm90b2NvbCBzaG91bGQgYmUgbG93ZXJjYXNlZCBzbyB0aGV5IGNhbiBiZSB1c2VkIHRvXG4gICAgLy8gY3JlYXRlIGEgcHJvcGVyIGBvcmlnaW5gLlxuICAgIC8vXG4gICAgaWYgKGluc3RydWN0aW9uWzRdKSB1cmxba2V5XSA9IHVybFtrZXldLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvL1xuICAvLyBBbHNvIHBhcnNlIHRoZSBzdXBwbGllZCBxdWVyeSBzdHJpbmcgaW4gdG8gYW4gb2JqZWN0LiBJZiB3ZSdyZSBzdXBwbGllZFxuICAvLyB3aXRoIGEgY3VzdG9tIHBhcnNlciBhcyBmdW5jdGlvbiB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IGJ1aWxkLWluXG4gIC8vIHBhcnNlci5cbiAgLy9cbiAgaWYgKHBhcnNlcikgdXJsLnF1ZXJ5ID0gcGFyc2VyKHVybC5xdWVyeSk7XG5cbiAgLy9cbiAgLy8gSWYgdGhlIFVSTCBpcyByZWxhdGl2ZSwgcmVzb2x2ZSB0aGUgcGF0aG5hbWUgYWdhaW5zdCB0aGUgYmFzZSBVUkwuXG4gIC8vXG4gIGlmIChcbiAgICAgIHJlbGF0aXZlXG4gICAgJiYgbG9jYXRpb24uc2xhc2hlc1xuICAgICYmIHVybC5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJ1xuICAgICYmICh1cmwucGF0aG5hbWUgIT09ICcnIHx8IGxvY2F0aW9uLnBhdGhuYW1lICE9PSAnJylcbiAgKSB7XG4gICAgdXJsLnBhdGhuYW1lID0gcmVzb2x2ZSh1cmwucGF0aG5hbWUsIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgfVxuXG4gIC8vXG4gIC8vIERlZmF1bHQgdG8gYSAvIGZvciBwYXRobmFtZSBpZiBub25lIGV4aXN0cy4gVGhpcyBub3JtYWxpemVzIHRoZSBVUkxcbiAgLy8gdG8gYWx3YXlzIGhhdmUgYSAvXG4gIC8vXG4gIGlmICh1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwucGF0aG5hbWUgPSAnLycgKyB1cmwucGF0aG5hbWU7XG4gIH1cblxuICAvL1xuICAvLyBXZSBzaG91bGQgbm90IGFkZCBwb3J0IG51bWJlcnMgaWYgdGhleSBhcmUgYWxyZWFkeSB0aGUgZGVmYXVsdCBwb3J0IG51bWJlclxuICAvLyBmb3IgYSBnaXZlbiBwcm90b2NvbC4gQXMgdGhlIGhvc3QgYWxzbyBjb250YWlucyB0aGUgcG9ydCBudW1iZXIgd2UncmUgZ29pbmdcbiAgLy8gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgaG9zdG5hbWUgd2hpY2ggY29udGFpbnMgbm8gcG9ydCBudW1iZXIuXG4gIC8vXG4gIGlmICghcmVxdWlyZWQodXJsLnBvcnQsIHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICB1cmwucG9ydCA9ICcnO1xuICB9XG5cbiAgLy9cbiAgLy8gUGFyc2UgZG93biB0aGUgYGF1dGhgIGZvciB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkLlxuICAvL1xuICB1cmwudXNlcm5hbWUgPSB1cmwucGFzc3dvcmQgPSAnJztcbiAgaWYgKHVybC5hdXRoKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSB1cmwuYXV0aC5zcGxpdCgnOicpO1xuICAgIHVybC51c2VybmFtZSA9IGluc3RydWN0aW9uWzBdIHx8ICcnO1xuICAgIHVybC5wYXNzd29yZCA9IGluc3RydWN0aW9uWzFdIHx8ICcnO1xuICB9XG5cbiAgdXJsLm9yaWdpbiA9IHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6JyAmJiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSAmJiB1cmwuaG9zdFxuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIC8vXG4gIC8vIFRoZSBocmVmIGlzIGp1c3QgdGhlIGNvbXBpbGVkIHJlc3VsdC5cbiAgLy9cbiAgdXJsLmhyZWYgPSB1cmwudG9TdHJpbmcoKTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY2hhbmdpbmcgcHJvcGVydGllcyBpbiB0aGUgVVJMIGluc3RhbmNlIHRvXG4gKiBpbnN1cmUgdGhhdCB0aGV5IGFsbCBwcm9wYWdhdGUgY29ycmVjdGx5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJ0ICAgICAgICAgIFByb3BlcnR5IHdlIG5lZWQgdG8gYWRqdXN0LlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgICAgICAgICAgVGhlIG5ld2x5IGFzc2lnbmVkIHZhbHVlLlxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBmbiAgV2hlbiBzZXR0aW5nIHRoZSBxdWVyeSwgaXQgd2lsbCBiZSB0aGUgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQgdG8gcGFyc2UgdGhlIHF1ZXJ5LlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2hlbiBzZXR0aW5nIHRoZSBwcm90b2NvbCwgZG91YmxlIHNsYXNoIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgZnJvbSB0aGUgZmluYWwgdXJsIGlmIGl0IGlzIHRydWUuXG4gKiBAcmV0dXJucyB7VVJMfSBVUkwgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBzZXQocGFydCwgdmFsdWUsIGZuKSB7XG4gIHZhciB1cmwgPSB0aGlzO1xuXG4gIHN3aXRjaCAocGFydCkge1xuICAgIGNhc2UgJ3F1ZXJ5JzpcbiAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICB2YWx1ZSA9IChmbiB8fCBxcy5wYXJzZSkodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncG9ydCc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKCFyZXF1aXJlZCh2YWx1ZSwgdXJsLnByb3RvY29sKSkge1xuICAgICAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICAgICAgdXJsW3BhcnRdID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lICsnOicrIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAodXJsLnBvcnQpIHZhbHVlICs9ICc6JysgdXJsLnBvcnQ7XG4gICAgICB1cmwuaG9zdCA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdob3N0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoLzpcXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdCgnOicpO1xuICAgICAgICB1cmwucG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZS5qb2luKCc6Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZTtcbiAgICAgICAgdXJsLnBvcnQgPSAnJztcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwcm90b2NvbCc6XG4gICAgICB1cmwucHJvdG9jb2wgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdXJsLnNsYXNoZXMgPSAhZm47XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BhdGhuYW1lJzpcbiAgICBjYXNlICdoYXNoJzpcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB2YXIgY2hhciA9IHBhcnQgPT09ICdwYXRobmFtZScgPyAnLycgOiAnIyc7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlLmNoYXJBdCgwKSAhPT0gY2hhciA/IGNoYXIgKyB2YWx1ZSA6IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW5zID0gcnVsZXNbaV07XG5cbiAgICBpZiAoaW5zWzRdKSB1cmxbaW5zWzFdXSA9IHVybFtpbnNbMV1dLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICE9PSAnZmlsZTonICYmIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmIHVybC5ob3N0XG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgdXJsLmhyZWYgPSB1cmwudG9TdHJpbmcoKTtcblxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgcHJvcGVydGllcyBiYWNrIGluIHRvIGEgdmFsaWQgYW5kIGZ1bGwgVVJMIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmdpZnkgT3B0aW9uYWwgcXVlcnkgc3RyaW5naWZ5IGZ1bmN0aW9uLlxuICogQHJldHVybnMge1N0cmluZ30gQ29tcGlsZWQgdmVyc2lvbiBvZiB0aGUgVVJMLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyhzdHJpbmdpZnkpIHtcbiAgaWYgKCFzdHJpbmdpZnkgfHwgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHN0cmluZ2lmeSkgc3RyaW5naWZ5ID0gcXMuc3RyaW5naWZ5O1xuXG4gIHZhciBxdWVyeVxuICAgICwgdXJsID0gdGhpc1xuICAgICwgcHJvdG9jb2wgPSB1cmwucHJvdG9jb2w7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLmNoYXJBdChwcm90b2NvbC5sZW5ndGggLSAxKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgKHVybC5zbGFzaGVzIHx8IGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpID8gJy8vJyA6ICcnKTtcblxuICBpZiAodXJsLnVzZXJuYW1lKSB7XG4gICAgcmVzdWx0ICs9IHVybC51c2VybmFtZTtcbiAgICBpZiAodXJsLnBhc3N3b3JkKSByZXN1bHQgKz0gJzonKyB1cmwucGFzc3dvcmQ7XG4gICAgcmVzdWx0ICs9ICdAJztcbiAgfVxuXG4gIHJlc3VsdCArPSB1cmwuaG9zdCArIHVybC5wYXRobmFtZTtcblxuICBxdWVyeSA9ICdvYmplY3QnID09PSB0eXBlb2YgdXJsLnF1ZXJ5ID8gc3RyaW5naWZ5KHVybC5xdWVyeSkgOiB1cmwucXVlcnk7XG4gIGlmIChxdWVyeSkgcmVzdWx0ICs9ICc/JyAhPT0gcXVlcnkuY2hhckF0KDApID8gJz8nKyBxdWVyeSA6IHF1ZXJ5O1xuXG4gIGlmICh1cmwuaGFzaCkgcmVzdWx0ICs9IHVybC5oYXNoO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblVybC5wcm90b3R5cGUgPSB7IHNldDogc2V0LCB0b1N0cmluZzogdG9TdHJpbmcgfTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgVVJMIHBhcnNlciBhbmQgc29tZSBhZGRpdGlvbmFsIHByb3BlcnRpZXMgdGhhdCBtaWdodCBiZSB1c2VmdWwgZm9yXG4vLyBvdGhlcnMgb3IgdGVzdGluZy5cbi8vXG5VcmwuZXh0cmFjdFByb3RvY29sID0gZXh0cmFjdFByb3RvY29sO1xuVXJsLmxvY2F0aW9uID0gbG9sY2F0aW9uO1xuVXJsLnRyaW1MZWZ0ID0gdHJpbUxlZnQ7XG5VcmwucXMgPSBxcztcblxubW9kdWxlLmV4cG9ydHMgPSBVcmw7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXG4vKipcbiAqIENoZWNrIGlmIHRoZSBET00gZWxlbWVudCBgY2hpbGRgIGlzIHdpdGhpbiB0aGUgZ2l2ZW4gYHBhcmVudGAgRE9NIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fFJhbmdlfSBjaGlsZCAtIHRoZSBET00gZWxlbWVudCBvciBSYW5nZSB0byBjaGVjayBpZiBpdCdzIHdpdGhpbiBgcGFyZW50YFxuICogQHBhcmFtIHtET01FbGVtZW50fSBwYXJlbnQgIC0gdGhlIHBhcmVudCBub2RlIHRoYXQgYGNoaWxkYCBjb3VsZCBiZSBpbnNpZGUgb2ZcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgYGNoaWxkYCBpcyB3aXRoaW4gYHBhcmVudGAuIEZhbHNlIG90aGVyd2lzZS5cbiAqIEBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdpdGhpbiAoY2hpbGQsIHBhcmVudCkge1xuICAvLyBkb24ndCB0aHJvdyBpZiBgY2hpbGRgIGlzIG51bGxcbiAgaWYgKCFjaGlsZCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFJhbmdlIHN1cHBvcnRcbiAgaWYgKGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSBjaGlsZCA9IGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICBlbHNlIGlmIChjaGlsZC5lbmRDb250YWluZXIpIGNoaWxkID0gY2hpbGQuZW5kQ29udGFpbmVyO1xuXG4gIC8vIHRyYXZlcnNlIHVwIHRoZSBgcGFyZW50Tm9kZWAgcHJvcGVydGllcyB1bnRpbCBgcGFyZW50YCBpcyBmb3VuZFxuICB2YXIgbm9kZSA9IGNoaWxkO1xuICB3aGlsZSAobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkge1xuICAgIGlmIChub2RlID09IHBhcmVudCkgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLyoqXG4gKiDmraTmlrnms5XnlKjkuo7lkbzotbfmnKzlnLDlrqLmiLfnq6/vvIzlkbzotbflpLHotKXml7bvvIzot7PovazliLDlrqLmiLfnq6/kuIvovb3lnLDlnYDmiJbogIXkuK3pl7TpobVcbiAqIC0g6aaW5YWI6ZyA6KaB5a6i5oi356uv5o+Q5L6b5LiA5Liq5Y2P6K6u5Zyw5Z2AIHByb3RvY29sXG4gKiAtIOeEtuWQjumAmui/h+a1j+iniOWZqOiuv+mXruivpeWcsOWdgOaIluiAhSBpZnJhbWUg6K6/6Zeu6K+l5Y2P6K6u5Zyw5Z2A5p2l6Kem5Y+R5a6i5oi356uv55qE5omT5byA5Yqo5L2cXG4gKiAtIOWcqOiuvuWumuWlveeahOi2heaXtuaXtumXtCAod2FpdGluZykg5Yiw6L6+5pe26L+b6KGM5qOA5p+lXG4gKiAtIOeUseS6jiBJT1Mg5LiL77yM6Lez6L2s5YiwIEFQUO+8jOmhtemdoiBKUyDkvJrooqvpmLvmraLmiafooYxcbiAqIC0g5omA5Lul5aaC5p6c6LaF5pe25pe26Ze05aSn5aSn6LaF6L+H5LqG6aKE5pyf5pe26Ze06IyD5Zu077yM5Y+v5pat5a6aIEFQUCDlt7LooqvmiZPlvIDvvIzmraTml7bop6blj5Egb25UaW1lb3V0IOWbnuiwg+S6i+S7tuWHveaVsFxuICogLSDlr7nkuo4gSU9T77yM5q2k5pe25aaC5p6c5LuOIEFQUCDov5Tlm57pobXpnaLvvIzlsLHlj6/ku6XpgJrov4cgd2FpdGluZ0xpbWl0IOaXtumXtOW3ruadpeWIpOaWreaYr+WQpuimgeaJp+ihjCBmYWxsYmFjayDlm57osIPkuovku7blh73mlbBcbiAqIC0gQW5kcm9pZCDkuIvvvIzot7PovazliLAgQVBQ77yM6aG16Z2iIEpTIOS8mue7p+e7reaJp+ihjFxuICogLSDmraTml7bml6DorrogQVBQIOaYr+WQpuW3suaJk+W8gO+8jOmDveS8muinpuWPkSBvbkZhbGxiYWNrIOS6i+S7tuS4jiBmYWxsYmFjayDlm57osIPkuovku7blh73mlbBcbiAqIC0gZmFsbGJhY2sg6buY6K6k5pON5L2c5piv6Lez6L2s5YiwIGZhbGxiYWNrVXJsIOWuouaIt+err+S4i+i9veWcsOWdgOaIluiAheS4remXtOmhteWcsOWdgFxuICogLSDov5nmoLflr7nkuo7msqHmnInlronoo4UgQVBQIOeahOenu+WKqOerr++8jOmhtemdouS8muWcqOi2heaXtuS6i+S7tuWPkeeUn+aXtu+8jOebtOaOpei3s+i9rOWIsCBmYWxsYmFja1VybFxuICogQG1ldGhvZCBjYWxsVXBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wcm90b2NvbCDlrqLmiLfnq69BUFDlkbzotbfljY/orq7lnLDlnYBcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmZhbGxiYWNrVXJsIOWuouaIt+err+S4i+i9veWcsOWdgOaIluiAheS4remXtOmhteWcsOWdgFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5hY3Rpb24g6Ieq5a6a5LmJ5ZG86LW35a6i5oi356uv55qE5pa55byPXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc3RhcnRUaW1lPW5ldyBEYXRlKCkuZ2V0VGltZSgpXSDlkbzotbflrqLmiLfnq6/nmoTlvIDlp4vml7bpl7QobXMp77yM5Lul5pe26Ze05pWw5YC85L2c5Li65Y+C5pWwXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2FpdGluZz04MDBdIOWRvOi1t+i2heaXtuetieW+heaXtumXtChtcylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53YWl0aW5nTGltaXQ9NTBdIOi2heaXtuWQjuajgOafpeWbnuiwg+aYr+WQpuWcqOatpOaXtumXtOmZkOWItuWGheinpuWPkShtcylcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmZhbGxiYWNrPWZ1bmN0aW9uICgpIHsgd2luZG93LmxvY2F0aW9uID0gZmFsbGJhY2tVcmw7IH1dIOm7mOiupOWbnumAgOaTjeS9nFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25GYWxsYmFjaz1udWxsXSDlkbzotbfmk43kvZzmnKrog73miJDlip/miafooYzml7bop6blj5HnmoTlm57osIPkuovku7blh73mlbBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uVGltZW91dD1udWxsXSDlkbzotbfotoXml7bop6blj5HnmoTlm57osIPkuovku7blh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNhbGxVcCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAvY2FsbFVwJyk7XG4gKiAkY2FsbFVwKHtcbiAqICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICogICB3YWl0aW5nOiA4MDAsXG4gKiAgIHdhaXRpbmdMaW1pdDogNTAsXG4gKiAgIHByb3RvY29sIDogc2NoZW1lLFxuICogICBmYWxsYmFja1VybCA6IGRvd25sb2FkLFxuICogICBvbkZhbGxiYWNrIDogZnVuY3Rpb24gKCkge1xuICogICAgIC8vIHNob3VsZCBkb3dubG9hZFxuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkYnJvd3NlciA9IHJlcXVpcmUoJy4uL2Vudi9icm93c2VyJyk7XG5cbmZ1bmN0aW9uIGNhbGxVcChvcHRpb25zKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgcHJvdG9jb2w6ICcnLFxuICAgIGZhbGxiYWNrVXJsOiAnJyxcbiAgICBhY3Rpb246IG51bGwsXG4gICAgc3RhcnRUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICB3YWl0aW5nOiA4MDAsXG4gICAgd2FpdGluZ0xpbWl0OiA1MCxcbiAgICBmYWxsYmFjazogZnVuY3Rpb24gKGZhbGxiYWNrVXJsKSB7XG4gICAgICAvLyDlnKjkuIDlrprml7bpl7TlhoXml6Dms5XllKTotbflrqLmiLfnq6/vvIzot7PovazkuIvovb3lnLDlnYDmiJbliLDkuK3pl7TpobVcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGZhbGxiYWNrVXJsO1xuICAgIH0sXG4gICAgb25GYWxsYmFjazogbnVsbCxcbiAgICBvblRpbWVvdXQ6IG51bGwsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIHZhciB3SWQ7XG4gIHZhciBpZnJhbWU7XG5cbiAgaWYgKHR5cGVvZiBjb25mLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbmYuYWN0aW9uKCk7XG4gIH0gZWxzZSBpZiAoJGJyb3dzZXIoKS5jaHJvbWUpIHtcbiAgICAvLyBjaHJvbWXkuItpZnJhbWXml6Dms5XllKTotbdBbmRyb2lk5a6i5oi356uv77yM6L+Z6YeM5L2/55Sod2luZG93Lm9wZW5cbiAgICAvLyDlj6bkuIDkuKrmlrnmoYjlj4LogIMgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hyb21lL21vYmlsZS9kb2NzL2ludGVudHNcbiAgICB2YXIgd2luID0gd2luZG93Lm9wZW4oY29uZi5wcm90b2NvbCk7XG4gICAgd0lkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiB3aW4gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwod0lkKTtcbiAgICAgICAgd2luLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICB9IGVsc2Uge1xuICAgIC8vIOWIm+W7umlmcmFtZVxuICAgIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGlmcmFtZS5zcmMgPSBjb25mLnByb3RvY29sO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgfVxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGlmICh3SWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwod0lkKTtcbiAgICB9XG5cbiAgICBpZiAoaWZyYW1lKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb25mLm9uVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uZi5vblRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICAvLyBpb3PkuIvvvIzot7PovazliLBBUFDvvIzpobXpnaJKU+S8muiiq+mYu+atouaJp+ihjOOAglxuICAgIC8vIOWboOatpOWmguaenOi2heaXtuaXtumXtOWkp+Wkp+i2hei/h+S6humihOacn+aXtumXtOiMg+WbtO+8jOWPr+aWreWumkFQUOW3suiiq+aJk+W8gOOAglxuICAgIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGNvbmYuc3RhcnRUaW1lIDwgY29uZi53YWl0aW5nICsgY29uZi53YWl0aW5nTGltaXQpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uZi5vbkZhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmYub25GYWxsYmFjaygpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBjb25mLmZhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmYuZmFsbGJhY2soY29uZi5mYWxsYmFja1VybCk7XG4gICAgICB9XG4gICAgfVxuICB9LCBjb25mLndhaXRpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbGxVcDtcbiIsIi8qKlxuICogIyDlpITnkIbkuI7lrqLmiLfnq6/nm7jlhbPnmoTkuqTkupJcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL2FwcFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvYXBwXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmFwcC5jYWxsVXApO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvYXBwXG4gKiB2YXIgJGFwcCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAnKTtcbiAqIGNvbnNvbGUuaW5mbygkYXBwLmNhbGxVcCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGNhbGxVcCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcHAvY2FsbFVwJyk7XG4gKi9cblxuZXhwb3J0cy5jYWxsVXAgPSByZXF1aXJlKCcuL2NhbGxVcCcpO1xuIiwiLyoqXG4gKiDnoa7orqTlr7nosaHmmK/lkKblnKjmlbDnu4TkuK1cbiAqIEBtZXRob2QgY29udGFpbnNcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7Kn0gaXRlbSDopoHmkJzntKLnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtCb29sZWFufSDlpoLmnpzlr7nosaHlnKjmlbDnu4TkuK3vvIzov5Tlm54gdHJ1ZVxuICogQGV4YW1wbGVcbiAqIHZhciAkY29udGFpbnMgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvYXJyLyRjb250YWlucycpO1xuICogY29uc29sZS5pbmZvKCRjb250YWlucyhbMSwyLDMsNCw1XSwgMykpOyAvLyB0cnVlXG4gKi9cblxuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XG4gIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xuICByZXR1cm4gaW5kZXggPj0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWlucztcbiIsIi8qKlxuICog5Yig6Zmk5pWw57uE5Lit55qE5a+56LGhXG4gKiBAbWV0aG9kIGVyYXNlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0geyp9IGl0ZW0g6KaB5riF6Zmk55qE5a+56LGhXG4gKiBAcmV0dXJucyB7TnVtYmVyfSDlr7nosaHljp/mnKzmiYDlnKjkvY3nva5cbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVyYXNlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9lcmFzZScpO1xuICogY29uc29sZS5pbmZvKCRlcmFzZShbMSwyLDMsNCw1XSwzKSk7IC8vIFsxLDIsNCw1XVxuICovXG5cbmZ1bmN0aW9uIGVyYXNlKGFyciwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gaW5kZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXJhc2U7XG4iLCIvKipcbiAqIOafpeaJvuespuWQiOadoeS7tueahOWFg+e0oOWcqOaVsOe7hOS4reeahOS9jee9rlxuICogQG1ldGhvZCBmaW5kXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDmnaHku7blh73mlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0g5Ye95pWw55qEdGhpc+aMh+WQkVxuICogQHJldHVybiB7QXJyYXl9IOespuWQiOadoeS7tueahOWFg+e0oOWcqOaVsOe7hOS4reeahOS9jee9rlxuICogQGV4YW1wbGVcbiAqIHZhciAkZmluZCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvZmluZCcpO1xuICogY29uc29sZS5pbmZvKCRmaW5kKFsxLDIsMyw0LDVdLCBmdW5jdGlvbiAoaXRlbSkge1xuICogICByZXR1cm4gaXRlbSA8IDM7XG4gKiB9KTsgLy8gWzAsIDFdXG4gKi9cblxuZnVuY3Rpb24gZmluZEluQXJyKGFyciwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IFtdO1xuICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBpdGVtLCBpbmRleCwgYXJyKSkge1xuICAgICAgcG9zaXRpb25zLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwb3NpdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEluQXJyO1xuIiwiLyoqXG4gKiDmlbDnu4TmiYHlubPljJZcbiAqIEBtZXRob2QgZmxhdHRlblxuICogQHBhcmFtIHthcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHJldHVybnMge2FycmF5fSDnu4/ov4fmiYHlubPljJblpITnkIbnmoTmlbDnu4RcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZsYXR0ZW4gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvYXJyL2ZsYXR0ZW4nKTtcbiAqIGNvbnNvbGUuaW5mbygkZmxhdHRlbihbMSwgWzIsM10sIFs0LDVdXSkpOyAvLyBbMSwyLDMsNCw1XVxuICovXG5cbnZhciAkdHlwZSA9IHJlcXVpcmUoJy4uL29iai90eXBlJyk7XG5cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyKSB7XG4gIHZhciBhcnJheSA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpICs9IDEpIHtcbiAgICB2YXIgdHlwZSA9ICR0eXBlKGFycltpXSk7XG4gICAgaWYgKHR5cGUgPT09ICdudWxsJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHZhciBleHRyYUFyciA9IHR5cGUgPT09ICdhcnJheScgPyBmbGF0dGVuKGFycltpXSkgOiBhcnJbaV07XG4gICAgYXJyYXkgPSBhcnJheS5jb25jYXQoZXh0cmFBcnIpO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuO1xuIiwiLyoqXG4gKiDnoa7orqTlr7nosaHmmK/lkKblnKjmlbDnu4TkuK3vvIzkuI3lrZjlnKjliJnlsIblr7nosaHmj5LlhaXliLDmlbDnu4TkuK1cbiAqIEBtZXRob2QgaW5jbHVkZVxuICogQHBhcmFtIHtBcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHBhcmFtIHsqfSBpdGVtIOimgeaPkuWFpeeahOWvueixoVxuICogQHJldHVybnMge0FycmF5fSDnu4/ov4flpITnkIbnmoTmupDmlbDnu4RcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGluY2x1ZGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvYXJyL2luY2x1ZGUnKTtcbiAqIGNvbnNvbGUuaW5mbygkaW5jbHVkZShbMSwyLDNdLDQpKTsgLy8gWzEsMiwzLDRdXG4gKiBjb25zb2xlLmluZm8oJGluY2x1ZGUoWzEsMiwzXSwzKSk7IC8vIFsxLDIsM11cbiAqL1xuXG52YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuXG5mdW5jdGlvbiBpbmNsdWRlKGFyciwgaXRlbSkge1xuICBpZiAoISRjb250YWlucyhhcnIsIGl0ZW0pKSB7XG4gICAgYXJyLnB1c2goaXRlbSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmNsdWRlO1xuIiwiLyoqXG4gKiAjIOexu+aVsOe7hOWvueixoeebuOWFs+W3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvYXJyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9hcnJcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuYXJyLmNvbnRhaW5zKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2FyclxuICogdmFyICRhcnIgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvYXJyJyk7XG4gKiBjb25zb2xlLmluZm8oJGFyci5jb250YWlucyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9jb250YWlucycpO1xuICovXG5cbmV4cG9ydHMuY29udGFpbnMgPSByZXF1aXJlKCcuL2NvbnRhaW5zJyk7XG5leHBvcnRzLmVyYXNlID0gcmVxdWlyZSgnLi9lcmFzZScpO1xuZXhwb3J0cy5maW5kID0gcmVxdWlyZSgnLi9maW5kJyk7XG5leHBvcnRzLmZsYXR0ZW4gPSByZXF1aXJlKCcuL2ZsYXR0ZW4nKTtcbmV4cG9ydHMuaW5jbHVkZSA9IHJlcXVpcmUoJy4vaW5jbHVkZScpO1xuIiwiLyoqXG4gKiDmj5Dkvpvlr7kgY29va2llIOeahOivu+WGmeiDveWKm1xuICogLSDlhpnlhaXml7boh6rliqjnlKggZW5jb2RlVVJJQ29tcG9uZW50IOe8lueggVxuICogLSDor7vlj5bml7boh6rliqjnlKggZGVjb2RlVVJJQ29tcG9uZW50IOino+eggVxuICogQG1vZHVsZSBjb29raWVcbiAqIEBzZWUgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvanMtY29va2llXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb29raWUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvY29va2llL2Nvb2tpZScpO1xuICogJGNvb2tpZS5zZXQoJ25hbWUnLCAn5Lit5paHJywge1xuICogICBleHBpcmVzOiAxXG4gKiB9KTtcbiAqICRjb29raWUucmVhZCgnbmFtZScpIC8vICfkuK3mlocnXG4gKi9cblxudmFyIENvb2tpZSA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xuXG52YXIgaW5zdGFuY2UgPSBDb29raWUud2l0aENvbnZlcnRlcih7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zdGFuY2U7XG4iLCIvKipcbiAqICMg5pys5Zyw5a2Y5YKo55u45YWz5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9jb29raWVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2Nvb2tpZVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5jb29raWUuY29va2llKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZVxuICogdmFyICRjb29raWUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvY29va2llJyk7XG4gKiBjb25zb2xlLmluZm8oJGNvb2tpZS5jb29raWUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quW3peWFt+WvueixoVxuICogdmFyICRjb29raWUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvY29va2llL2Nvb2tpZScpO1xuICovXG5cbmV4cG9ydHMuY29va2llID0gcmVxdWlyZSgnLi9jb29raWUnKTtcbmV4cG9ydHMub3JpZ2luID0gcmVxdWlyZSgnLi9vcmlnaW4nKTtcbiIsIi8qKlxuICog5o+Q5L6b5a+5IGNvb2tpZSDnmoTor7vlhpnog73liptcbiAqIC0g5q2k5qih5Z2X55u05o6l5o+Q5L6bIGpzLWNvb2tpZSDnmoTljp/nlJ/og73lipvvvIzkuI3lgZrku7vkvZXoh6rliqjnvJbop6PnoIFcbiAqIEBtb2R1bGUgb3JpZ2luXG4gKiBAc2VlIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2pzLWNvb2tpZVxuICogQGV4YW1wbGVcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9vcmlnaW4nKTtcbiAqICRjb29raWUuc2V0KCduYW1lJywgJ3ZhbHVlJywge1xuICogICBleHBpcmVzOiAxXG4gKiB9KTtcbiAqICRjb29raWUucmVhZCgnbmFtZScpIC8vICd2YWx1ZSdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdqcy1jb29raWUnKTtcbiIsIi8qKlxuICog5pel5pyf5a+56LGh5qC85byP5YyW6L6T5Ye6XG4gKlxuICog5qC85byP5YyW5pel5pyf5a+56LGh5qih5p2/6ZSu5YC86K+05piOXG4gKiAtIHllYXIg5bm05Lu95Y6f5aeL5pWw5YC8XG4gKiAtIG1vbnRoIOaciOS7veWOn+Wni+aVsOWAvFsxLCAxMl1cbiAqIC0gZGF0ZSDml6XmnJ/ljp/lp4vmlbDlgLxbMSwgMzFdXG4gKiAtIGRheSDmmJ/mnJ/ljp/lp4vmlbDlgLxbMCwgNl1cbiAqIC0gaG91cnMg5bCP5pe25Y6f5aeL5pWw5YC8WzAsIDIzXVxuICogLSBtaW5pdXRlcyDliIbpkp/ljp/lp4vmlbDlgLxbMCwgNTldXG4gKiAtIHNlY29uZHMg56eS5Y6f5aeL5pWw5YC8WzAsIDU5XVxuICogLSBtaWxsaVNlY29uZHMg5q+r56eS5Y6f5aeL5pWw5YC8WzAsIDk5OV1cbiAqIC0gWVlZWSDlubTku73mlbDlgLzvvIznsr7noa7liLA05L2NKDEyID0+ICcwMDEyJylcbiAqIC0gWVkg5bm05Lu95pWw5YC877yM57K+56Gu5YiwMuS9jSgyMDE4ID0+ICcxOCcpXG4gKiAtIFkg5bm05Lu95Y6f5aeL5pWw5YC8XG4gKiAtIE1NIOaciOS7veaVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBNIOaciOS7veWOn+Wni+aVsOWAvFxuICogLSBERCDml6XmnJ/mlbDlgLzvvIznsr7noa7liLAy5L2NKDMgPT4gJzAzJylcbiAqIC0gRCDml6XmnJ/ljp/lp4vmlbDlgLxcbiAqIC0gZCDmmJ/mnJ/mlbDlgLzvvIzpgJrov4cgd2Vla2RheSDlj4LmlbDmmKDlsITlj5blvpcoMCA9PiAn5pelJylcbiAqIC0gaGgg5bCP5pe25pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIGgg5bCP5pe25Y6f5aeL5pWw5YC8XG4gKiAtIG1tIOWIhumSn+aVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBtIOWIhumSn+WOn+Wni+aVsOWAvFxuICogLSBzcyDnp5LmlbDlgLzvvIznsr7noa7liLAy5L2NKDkgPT4gJzA5JylcbiAqIC0gcyDnp5Lljp/lp4vmlbDlgLxcbiAqIC0gbXNzIOavq+enkuaVsOWAvO+8jOeyvuehruWIsDPkvY0oOSA9PiAnMDA5JylcbiAqIC0gbXMg5q+r56eS5Y6f5aeL5pWw5YC8XG4gKiBAbWV0aG9kIGZvcm1hdFxuICogQHBhcmFtIHtEYXRlfSBkb2JqIOaXpeacn+Wvueixoe+8jOaIluiAheWPr+S7peiiq+i9rOaNouS4uuaXpeacn+WvueixoeeahOaVsOaNrlxuICogQHBhcmFtIHtPYmplY3R9IFtzcGVjXSDmoLzlvI/ljJbpgInpoblcbiAqIEBwYXJhbSB7QXJyYXl9IFtzcGVjLndlZWtkYXk9J+aXpeS4gOS6jOS4ieWbm+S6lOWFrScuc3BsaXQoJycpXSDkuIDlkajlhoXlkITlpKnlr7nlupTlkI3np7DvvIzpobrluo/ku47lkajml6XnrpfotbdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy50ZW1wbGF0ZT0ne3tZWVlZfX0te3tNTX19LXt7RER9fSB7e2hofX06e3ttbX19J10g5qC85byP5YyW5qih5p2/XG4gKiBAcmV0dXJuIHtTdHJpbmd9IOagvOW8j+WMluWujOaIkOeahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZm9ybWF0ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0Jyk7XG4gKiBjb25zb2xlLmluZm8oXG4gKiAgICRmb3JtYXQobmV3IERhdGUoKSx7XG4gKiAgICAgdGVtcGxhdGUgOiAne3tZWVlZfX3lubR7e01NfX3mnIh7e0REfX3ml6Ug5ZGoe3tkfX0ge3toaH195pe2e3ttbX195YiGe3tzc31956eSJ1xuICogICB9KVxuICogKTtcbiAqIC8vIDIwMTXlubQwOeaciDA55pelIOWRqOS4iSAxNOaXtjE55YiGNDLnp5JcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkc3Vic3RpdHV0ZSA9IHJlcXVpcmUoJy4uL3N0ci9zdWJzdGl0dXRlJyk7XG52YXIgJGZpeFRvID0gcmVxdWlyZSgnLi4vbnVtL2ZpeFRvJyk7XG52YXIgJGdldFVUQ0RhdGUgPSByZXF1aXJlKCcuL2dldFVUQ0RhdGUnKTtcblxudmFyIHJMaW1pdCA9IGZ1bmN0aW9uIChudW0sIHcpIHtcbiAgdmFyIHN0ciA9ICRmaXhUbyhudW0sIHcpO1xuICB2YXIgZGVsdGEgPSBzdHIubGVuZ3RoIC0gdztcbiAgcmV0dXJuIGRlbHRhID4gMCA/IHN0ci5zdWJzdHIoZGVsdGEpIDogc3RyO1xufTtcblxuZnVuY3Rpb24gZm9ybWF0KGRvYmosIHNwZWMpIHtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICB2YXIgZGF0YSA9IHt9O1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHdlZWtkYXk6ICfml6XkuIDkuozkuInlm5vkupTlha0nLnNwbGl0KCcnKSxcbiAgICB0ZW1wbGF0ZTogJ3t7WVlZWX19LXt7TU19fS17e0REfX0ge3toaH19Ont7bW19fScsXG4gIH0sIHNwZWMpO1xuXG4gIC8vIOino+WGs+S4jeWQjOacjeWKoeWZqOaXtuWMuuS4jeS4gOiHtOWPr+iDveS8muWvvOiHtOaXpeacn+WIneWni+WMluaXtumXtOS4jeS4gOiHtOeahOmXrumimFxuICAvLyDkvKDlhaXmlbDlrZfku6XljJfkuqzml7bljLrml7bpl7TkuLrlh4ZcbiAgdmFyIHV0Y0RhdGUgPSAkZ2V0VVRDRGF0ZShkb2JqKTtcbiAgZGF0YS55ZWFyID0gdXRjRGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICBkYXRhLm1vbnRoID0gdXRjRGF0ZS5nZXRVVENNb250aCgpICsgMTtcbiAgZGF0YS5kYXRlID0gdXRjRGF0ZS5nZXRVVENEYXRlKCk7XG4gIGRhdGEuZGF5ID0gdXRjRGF0ZS5nZXRVVENEYXkoKTtcbiAgZGF0YS5ob3VycyA9IHV0Y0RhdGUuZ2V0VVRDSG91cnMoKTtcbiAgZGF0YS5taW5pdXRlcyA9IHV0Y0RhdGUuZ2V0VVRDTWludXRlcygpO1xuICBkYXRhLnNlY29uZHMgPSB1dGNEYXRlLmdldFVUQ1NlY29uZHMoKTtcbiAgZGF0YS5taWxsaVNlY29uZHMgPSB1dGNEYXRlLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuXG4gIGRhdGEuWVlZWSA9IHJMaW1pdChkYXRhLnllYXIsIDQpO1xuICBkYXRhLllZID0gckxpbWl0KGRhdGEueWVhciwgMik7XG4gIGRhdGEuWSA9IGRhdGEueWVhcjtcblxuICBkYXRhLk1NID0gJGZpeFRvKGRhdGEubW9udGgsIDIpO1xuICBkYXRhLk0gPSBkYXRhLm1vbnRoO1xuXG4gIGRhdGEuREQgPSAkZml4VG8oZGF0YS5kYXRlLCAyKTtcbiAgZGF0YS5EID0gZGF0YS5kYXRlO1xuXG4gIGRhdGEuZCA9IGNvbmYud2Vla2RheVtkYXRhLmRheV07XG5cbiAgZGF0YS5oaCA9ICRmaXhUbyhkYXRhLmhvdXJzLCAyKTtcbiAgZGF0YS5oID0gZGF0YS5ob3VycztcblxuICBkYXRhLm1tID0gJGZpeFRvKGRhdGEubWluaXV0ZXMsIDIpO1xuICBkYXRhLm0gPSBkYXRhLm1pbml1dGVzO1xuXG4gIGRhdGEuc3MgPSAkZml4VG8oZGF0YS5zZWNvbmRzLCAyKTtcbiAgZGF0YS5zID0gZGF0YS5zZWNvbmRzO1xuXG4gIGRhdGEubXNzID0gJGZpeFRvKGRhdGEubWlsbGlTZWNvbmRzLCAzKTtcbiAgZGF0YS5tcyA9IGRhdGEubWlsbGlTZWNvbmRzO1xuXG4gIG91dHB1dCA9ICRzdWJzdGl0dXRlKGNvbmYudGVtcGxhdGUsIGRhdGEpO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdDtcbiIsIi8qKlxuICog6I635Y+W6L+H5Y675LiA5q615pe26Ze055qE6LW35aeL5pel5pyf77yM5aaCM+aciOWJjeesrDHlpKnvvIwy5ZGo5YmN56ysMeWkqe+8jDPlsI/ml7bliY3mlbTngrlcbiAqIEBtZXRob2QgZ2V0TGFzdFN0YXJ0XG4gKiBAcGFyYW0ge051bWJlcnxEYXRlfSB0aW1lIOWunumZheaXtumXtFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUg5Y2V5L2N5pe26Ze057G75Z6L77yM5Y+v6YCJIFsneWVhcicsICdtb250aCcsICd3ZWVrJywgJ2RheScsICdob3VyJ11cbiAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCDlpJrlsJHljZXkvY3ml7bpl7TkuYvliY1cbiAqIEByZXR1cm5zIHtEYXRlfSDmnIDov5HljZXkvY3ml7bpl7TnmoTotbflp4vml7bpl7Tlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldExhc3RTdGFydCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2dldExhc3RTdGFydCcpO1xuICogdmFyIHRpbWUgPSAkZ2V0TGFzdFN0YXJ0KFxuICogICBuZXcgRGF0ZSgnMjAxOC0xMC0yNScpLFxuICogICAnbW9udGgnLFxuICogICAwXG4gKiApLmdldFRpbWUoKTsgLy8gMTUzODMyMzIwMDAwMFxuICogbmV3IERhdGUodGltZSk7IC8vIE1vbiBPY3QgMDEgMjAxOCAwMDowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICovXG5cbnZhciAkZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnLi9nZXRUaW1lU3BsaXQnKTtcbnZhciAkZ2V0VVRDRGF0ZSA9IHJlcXVpcmUoJy4vZ2V0VVRDRGF0ZScpO1xuXG52YXIgSE9VUiA9IDYwICogNjAgKiAxMDAwO1xudmFyIERBWSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbmZ1bmN0aW9uIGdldExhc3RTdGFydCh0aW1lLCB0eXBlLCBjb3VudCkge1xuICB2YXIgbG9jYWxUaW1lID0gbmV3IERhdGUodGltZSk7XG4gIHZhciB1dGNUaW1lID0gJGdldFVUQ0RhdGUodGltZSk7XG4gIHZhciBzdGFtcCA9IHV0Y1RpbWU7XG4gIHZhciB5ZWFyO1xuICB2YXIgbW9udGg7XG4gIHZhciBhbGxNb250aHM7XG4gIHZhciB1bml0O1xuICBpZiAoIXR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVpcmVkIHBhcmFtIHR5cGUnKTtcbiAgfVxuICBjb3VudCA9IGNvdW50IHx8IDA7XG4gIGlmICh0eXBlID09PSAneWVhcicpIHtcbiAgICB5ZWFyID0gdXRjVGltZS5nZXRVVENGdWxsWWVhcigpO1xuICAgIHllYXIgLT0gY291bnQ7XG4gICAgc3RhbXAgPSBuZXcgRGF0ZSh5ZWFyICsgJy8xLzEnKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbW9udGgnKSB7XG4gICAgeWVhciA9IHV0Y1RpbWUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICBtb250aCA9IHV0Y1RpbWUuZ2V0VVRDTW9udGgoKTtcbiAgICBhbGxNb250aHMgPSB5ZWFyICogMTIgKyBtb250aCAtIGNvdW50O1xuICAgIHllYXIgPSBNYXRoLmZsb29yKGFsbE1vbnRocyAvIDEyKTtcbiAgICBtb250aCA9IGFsbE1vbnRocyAtIHllYXIgKiAxMjtcbiAgICBtb250aCArPSAxO1xuICAgIHN0YW1wID0gbmV3IERhdGUoW3llYXIsIG1vbnRoLCAxXS5qb2luKCcvJykpO1xuICB9IGVsc2Uge1xuICAgIHVuaXQgPSBIT1VSO1xuICAgIGlmICh0eXBlID09PSAnZGF5Jykge1xuICAgICAgdW5pdCA9IERBWTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICd3ZWVrJykge1xuICAgICAgdW5pdCA9IDcgKiBEQVk7XG4gICAgfVxuICAgIHZhciBuZXdMb2NhbFRpbWUgPSBsb2NhbFRpbWUgLSBjb3VudCAqIHVuaXQ7XG4gICAgc3RhbXAgPSAkZ2V0VGltZVNwbGl0KG5ld0xvY2FsVGltZSwgdHlwZSk7XG4gIH1cblxuICByZXR1cm4gc3RhbXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TGFzdFN0YXJ0O1xuIiwiLyoqXG4gKiDojrflj5bmn5DkuKrml7bpl7TnmoQg5pW05bm0fOaVtOaciHzmlbTml6V85pW05pe2fOaVtOWIhiDml7bpl7Tlr7nosaFcbiAqIEBtZXRob2QgZ2V0VGltZVNwbGl0XG4gKiBAcGFyYW0ge051bWJlcnxEYXRlfSB0aW1lIOWunumZheaXtumXtFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUg5Y2V5L2N5pe26Ze057G75Z6L77yM5Y+v6YCJIFsneWVhcicsICdtb250aCcsICd3ZWVrJywgJ2RheScsICdob3VyJ11cbiAqIEByZXR1cm5zIHtEYXRlfSDml7bpl7TmlbTngrnlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFRpbWVTcGxpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2dldFRpbWVTcGxpdCcpO1xuICogbmV3IERhdGUoXG4gKiAgICRnZXRUaW1lU3BsaXQoXG4gKiAgICAgJzIwMTgtMDktMjAnLFxuICogICAgICdtb250aCdcbiAqICAgKVxuICogKS50b0dNVFN0cmluZygpO1xuICogLy8gU2F0IFNlcCAwMSAyMDE4IDAwOjAwOjAwIEdNVCswODAwICjkuK3lm73moIflh4bml7bpl7QpXG4gKlxuICogbmV3IERhdGUoXG4gKiAgICRnZXRUaW1lU3BsaXQoXG4gKiAgICAgJzIwMTgtMDktMjAgMTk6MjM6MzYnLFxuICogICAgICdob3VyJ1xuICogICApXG4gKiApLnRvR01UU3RyaW5nKCk7XG4gKiAvLyBUaHUgU2VwIDIwIDIwMTggMTk6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqL1xudmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnLi9nZXRVVENEYXRlJyk7XG5cbnZhciBEQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG52YXIgVElNRV9VTklUUyA9IFtcbiAgJ2hvdXInLFxuICAnZGF5JyxcbiAgJ3dlZWsnLFxuICAnbW9udGgnLFxuICAneWVhcicsXG5dO1xuXG5mdW5jdGlvbiBnZXRUaW1lU3BsaXQodGltZSwgdHlwZSkge1xuICBpZiAoIXR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVpcmVkIHBhcmFtIHR5cGUnKTtcbiAgfVxuXG4gIHZhciBsb2NhbFRpbWUgPSBuZXcgRGF0ZSh0aW1lKTtcbiAgdmFyIHV0Y1RpbWUgPSAkZ2V0VVRDRGF0ZSh0aW1lKTtcblxuICAvLyDku6XlkajkuIDkuLrotbflp4vml7bpl7RcbiAgdmFyIGRheSA9IHV0Y1RpbWUuZ2V0RGF5KCk7XG4gIGRheSA9IGRheSA9PT0gMCA/IDYgOiBkYXkgLSAxO1xuXG4gIHZhciBpbmRleCA9IFRJTUVfVU5JVFMuaW5kZXhPZih0eXBlKTtcbiAgaWYgKGluZGV4ID09PSAyKSB7XG4gICAgdXRjVGltZSA9IG5ldyBEYXRlKGxvY2FsVGltZSAtIGRheSAqIERBWSk7XG4gIH1cbiAgdmFyIHllYXIgPSB1dGNUaW1lLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIHZhciBtb250aCA9IHV0Y1RpbWUuZ2V0VVRDTW9udGgoKSArIDE7XG4gIHZhciBkYXRlID0gdXRjVGltZS5nZXRVVENEYXRlKCk7XG4gIHZhciBob3VyID0gdXRjVGltZS5nZXRVVENIb3VycygpO1xuICB2YXIgbWludXRlcyA9IHV0Y1RpbWUuZ2V0VVRDTWludXRlcygpO1xuXG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgbWludXRlcyA9ICcwMCc7XG4gIH1cbiAgaWYgKGluZGV4ID49IDEpIHtcbiAgICBob3VyID0gJzAwJztcbiAgfVxuICBpZiAoaW5kZXggPj0gMykge1xuICAgIGRhdGUgPSAxO1xuICB9XG4gIGlmIChpbmRleCA+PSA0KSB7XG4gICAgbW9udGggPSAxO1xuICB9XG5cbiAgdmFyIHN0ciA9IFtcbiAgICBbeWVhciwgbW9udGgsIGRhdGVdLmpvaW4oJy8nKSxcbiAgICBbaG91ciwgbWludXRlc10uam9pbignOicpLFxuICBdLmpvaW4oJyAnKTtcblxuICByZXR1cm4gbmV3IERhdGUoc3RyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUaW1lU3BsaXQ7XG4iLCIvKipcbiAqIOiOt+WPluS4gOS4quaXtumXtOWvueixoe+8jOWFtuW5tOaciOWRqOaXpeaXtuWIhuenkuetiSBVVEMg5YC85LiO5YyX5Lqs5pe26Ze05L+d5oyB5LiA6Ie044CCXG4gKiDop6PlhrPkuI3lkIzmnI3liqHlmajml7bljLrkuI3kuIDoh7TlnLrmma/kuIvvvIzlj6/og73kvJrlr7zoh7Tml6XmnJ/orqHnrpfkuI3kuIDoh7TnmoTpl67popguXG4gKiBAbWV0aG9kIGdldFVUQ0RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcmV0dXJucyB7RGF0ZX0gVVRD5pe26Ze0XG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZScpO1xuICogdmFyIGNuVGltZSA9IDE1NDA5MTUyMDAwMDA7IC8vIChXZWQgT2N0IDMxIDIwMTggMDA6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtCkpXG4gKiB2YXIgdXRjRGF0ZSA9ICRnZXRVVENEYXRlKGNuVGltZSkuZ2V0VGltZSgpO1xuICogLy8gMTU0MDg4NjQwMDAwMCBUdWUgT2N0IDMwIDIwMTggMTY6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqIHV0Y0RhdGUuZ2V0VVRDZGF0ZSgpOyAvLyAzMVxuICogdXRjRGF0ZS5nZXRIb3VycygpOyAvLyA4XG4gKiB1dGNEYXRlLmdldFVUQ0hvdXJzKCk7IC8vIDBcbiAqL1xuZnVuY3Rpb24gZ2V0VVRDRGF0ZSh0aW1lKSB7XG4gIHZhciB1dGNEYXRlID0gbmV3IERhdGUobmV3IERhdGUodGltZSkuZ2V0VGltZSgpICsgMjg4MDAwMDApO1xuICByZXR1cm4gdXRjRGF0ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRVVENEYXRlO1xuIiwiLyoqXG4gKiAjIOaXpeacn+ebuOWFs+W3peWFt1xuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvZGF0ZVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZGF0ZVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5kYXRlLmZvcm1hdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9kYXRlXG4gKiB2YXIgJGRhdGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZGF0ZScpO1xuICogY29uc29sZS5pbmZvKCRkYXRlLmZvcm1hdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGZvcm1hdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2Zvcm1hdCcpO1xuICovXG5cbmV4cG9ydHMuZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcbmV4cG9ydHMuZ2V0TGFzdFN0YXJ0ID0gcmVxdWlyZSgnLi9nZXRMYXN0U3RhcnQnKTtcbmV4cG9ydHMuZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnLi9nZXRUaW1lU3BsaXQnKTtcbiIsIi8qKlxuICogIyBET00g5pON5L2c55u45YWz5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9kb21cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2RvbVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5kb20uaXNOb2RlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2RvbVxuICogdmFyICRkb20gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZG9tJyk7XG4gKiBjb25zb2xlLmluZm8oJGRvbS5pc05vZGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRpc05vZGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZG9tL2lzTm9kZScpO1xuICovXG5cbmV4cG9ydHMuaXNOb2RlID0gcmVxdWlyZSgnLi9pc05vZGUnKTtcbmV4cG9ydHMub2Zmc2V0ID0gcmVxdWlyZSgnLi9vZmZzZXQnKTtcbiIsIi8qKlxuICog5Yik5pat5a+56LGh5piv5ZCm5Li6ZG9t5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDopoHliKTmlq3nmoTlr7nosaFcbiAqIEByZXR1cm4ge0Jvb2xlYW59IOaYr+WQpuS4umRvbeWFg+e0oFxuICogQGV4YW1wbGVcbiAqIHZhciAkaXNOb2RlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2RvbS9pc05vZGUnKTtcbiAqICRpc05vZGUoZG9jdW1lbnQuYm9keSkgLy8gMVxuICovXG5mdW5jdGlvbiBpc05vZGUobm9kZSkge1xuICByZXR1cm4gKFxuICAgIG5vZGVcbiAgICAmJiBub2RlLm5vZGVOYW1lXG4gICAgJiYgbm9kZS5ub2RlVHlwZVxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTm9kZTtcbiIsIi8qKlxuICog6I635Y+WIERPTSDlhYPntKDnm7jlr7nkuo4gZG9jdW1lbnQg55qE6L656LedXG4gKiBAbWV0aG9kIG9mZnNldFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdGltb3hsZXkvb2Zmc2V0XG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDopoHorqHnrpcgb2Zmc2V0IOeahCBkb20g5a+56LGhXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9mZnNldCDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG9mZnNldCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vb2Zmc2V0Jyk7XG4gKiB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhcmdldCcpO1xuICogY29uc29sZS5sb2coJG9mZnNldCh0YXJnZXQpKTtcbiAqIC8vIHt0b3A6IDY5LCBsZWZ0OiAxMDh9XG4gKi9cblxudmFyIG9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHt9O1xufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICBvZmZzZXQgPSByZXF1aXJlKCdkb2N1bWVudC1vZmZzZXQnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmZzZXQ7XG4iLCIvKipcbiAqIOajgOa1i+a1j+iniOWZqOexu+Wei1xuICpcbiAqIOaUr+aMgeeahOexu+Wei+ajgOa1i1xuICogLSBxcVxuICogLSB1Y1xuICogLSBiYWlkdVxuICogLSBtaXVpXG4gKiAtIHdlaXhpblxuICogLSBxem9uZVxuICogLSBxcW5ld3NcbiAqIC0gcXFob3VzZVxuICogLSBxcWJyb3dzZXJcbiAqIC0gY2hyb21lXG4gKiBAbWV0aG9kIGJyb3dzZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkYnJvd3NlciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvYnJvd3NlcicpO1xuICogY29uc29sZS5pbmZvKCRicm93c2VyKCkuY2hyb21lKTtcbiAqIGNvbnNvbGUuaW5mbygkYnJvd3Nlci5kZXRlY3QoKSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICR1YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5cbnZhciB0ZXN0ZXJzID0ge1xuICBxcTogKC9xcVxcLyhbXFxkLl0rKS9pKSxcbiAgdWM6ICgvdWNicm93c2VyL2kpLFxuICBiYWlkdTogKC9iYWlkdWJyb3dzZXIvaSksXG4gIG1pdWk6ICgvbWl1aWJyb3dzZXIvaSksXG4gIHdlaXhpbjogKC9taWNyb21lc3Nlbmdlci9pKSxcbiAgcXpvbmU6ICgvcXpvbmVcXC8vaSksXG4gIHFxbmV3czogKC9xcW5ld3NcXC8oW1xcZC5dKykvaSksXG4gIHFxaG91c2U6ICgvcXFob3VzZS9pKSxcbiAgcXFicm93c2VyOiAoL3FxYnJvd3Nlci9pKSxcbiAgY2hyb21lOiAoL2Nocm9tZS9pKSxcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHVhOiAnJyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgJGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cbiAgcmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gZW52QnJvd3NlcigpIHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXN1bHQgPSBkZXRlY3QoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5lbnZCcm93c2VyLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnZCcm93c2VyO1xuIiwiLyoqXG4gKiDmo4DmtYvmtY/op4jlmajmoLjlv4NcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gdHJpZGVudFxuICogLSBwcmVzdG9cbiAqIC0gd2Via2l0XG4gKiAtIGdlY2tvXG4gKiBAbWV0aG9kIGNvcmVcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkY29yZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvY29yZScpO1xuICogY29uc29sZS5pbmZvKCRjb3JlKCkud2Via2l0KTtcbiAqIGNvbnNvbGUuaW5mbygkY29yZS5kZXRlY3QoKSk7XG4gKi9cblxudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcblxudmFyIHRlc3RlcnMgPSB7XG4gIHRyaWRlbnQ6ICgvdHJpZGVudC9pKSxcbiAgcHJlc3RvOiAoL3ByZXN0by9pKSxcbiAgd2Via2l0OiAoL3dlYmtpdC9pKSxcbiAgZ2Vja286IGZ1bmN0aW9uICh1YSkge1xuICAgIHJldHVybiB1YS5pbmRleE9mKCdnZWNrbycpID4gLTEgJiYgdWEuaW5kZXhPZigna2h0bWwnKSA9PT0gLTE7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICB1YTogJycsXG4gIH0sIG9wdGlvbnMpO1xuXG4gICRhc3NpZ24odGVzdGVycywgY2hlY2tlcnMpO1xuXG4gIHJldHVybiAkdWFNYXRjaCh0ZXN0ZXJzLCBjb25mLnVhLCBjb25mKTtcbn1cblxudmFyIHJlc3VsdCA9IG51bGw7XG5cbmZ1bmN0aW9uIGNvcmUoKSB7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gZGV0ZWN0KCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuY29yZS5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZTtcbiIsIi8qKlxuICog5qOA5rWL6K6+5aSH57G75Z6LXG4gKlxuICog5pSv5oyB55qE57G75Z6L5qOA5rWLXG4gKiAtIGh1YXdlaVxuICogLSBvcHBvXG4gKiAtIHZpdm9cbiAqIC0geGlhb21pXG4gKiAtIHNhbXNvbmdcbiAqIC0gaXBob25lXG4gKiBAbWV0aG9kIGRldmljZVxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogdmFyICRkZXZpY2UgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L2RldmljZScpO1xuICogY29uc29sZS5pbmZvKCRkZXZpY2UoKS5odWF3ZWkpO1xuICogY29uc29sZS5pbmZvKCRkZXZpY2UuZGV0ZWN0KCkpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcbiAgaHVhd2VpOiAoL2h1YXdlaS9pKSxcbiAgb3BwbzogKC9vcHBvL2kpLFxuICB2aXZvOiAoL3Zpdm8vaSksXG4gIHhpYW9taTogKC94aWFvbWkvaSksXG4gIHNhbXNvbmc6ICgvc20tL2kpLFxuICBpcGhvbmU6ICgvaXBob25lL2kpLFxufTtcblxuZnVuY3Rpb24gZGV0ZWN0KG9wdGlvbnMsIGNoZWNrZXJzKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgdWE6ICcnLFxuICB9LCBvcHRpb25zKTtcblxuICAkYXNzaWduKHRlc3RlcnMsIGNoZWNrZXJzKTtcblxuICByZXR1cm4gJHVhTWF0Y2godGVzdGVycywgY29uZi51YSwgY29uZik7XG59XG5cbnZhciByZXN1bHQgPSBudWxsO1xuXG5mdW5jdGlvbiBkZXZpY2UoKSB7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gZGV0ZWN0KCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZGV2aWNlLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBkZXZpY2U7XG4iLCIvKipcbiAqICMg546v5aKD5qOA5rWL5LiO5Yik5pat5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9lbnZcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2VudlxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5lbnYudG91Y2hhYmxlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2VudlxuICogdmFyICRlbnYgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52Jyk7XG4gKiBjb25zb2xlLmluZm8oJGVudi50b3VjaGFibGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICR0b3VjaGFibGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L3RvdWNoYWJsZScpO1xuICovXG5cbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3NlcicpO1xuZXhwb3J0cy5jb3JlID0gcmVxdWlyZSgnLi9jb3JlJyk7XG5leHBvcnRzLmRldmljZSA9IHJlcXVpcmUoJy4vZGV2aWNlJyk7XG5leHBvcnRzLm5ldHdvcmsgPSByZXF1aXJlKCcuL25ldHdvcmsnKTtcbmV4cG9ydHMub3MgPSByZXF1aXJlKCcuL29zJyk7XG5leHBvcnRzLnRvdWNoYWJsZSA9IHJlcXVpcmUoJy4vdG91Y2hhYmxlJyk7XG5leHBvcnRzLnVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcbmV4cG9ydHMud2VicCA9IHJlcXVpcmUoJy4vd2VicCcpO1xuIiwiLyoqXG4gKiDnvZHnu5znjq/looPmo4DmtYtcbiAqIEBtb2R1bGUgbmV0d29ya1xuICovXG5cbnZhciBzdXBwb3J0T25saW5lID0gbnVsbDtcblxuLyoqXG4gKiDliKTmlq3pobXpnaLmmK/lkKbmlK/mjIHogZTnvZHmo4DmtYtcbiAqIEBtZXRob2QgbmV0d29yay5zdXBwb3J0XG4gKiBAbWVtYmVyb2YgbmV0d29ya1xuICogQHJldHVybnMge0Jvb2xlYW59IOaYr+WQpuaUr+aMgeiBlOe9keajgOa1i1xuICogQGV4YW1wbGVcbiAqIHZhciAkbmV0d29yayA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvbmV0d29yaycpO1xuICogJG5ldHdvcmsuc3VwcG9ydCgpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN1cHBvcnQoKSB7XG4gIGlmIChzdXBwb3J0T25saW5lID09PSBudWxsKSB7XG4gICAgc3VwcG9ydE9ubGluZSA9ICEhKCdvbkxpbmUnIGluIHdpbmRvdy5uYXZpZ2F0b3IpO1xuICB9XG4gIHJldHVybiBzdXBwb3J0T25saW5lO1xufVxuXG4vKipcbiAqIOWIpOaWremhtemdouaYr+WQpuiBlOe9kVxuICogQG1ldGhvZCBuZXR3b3JrLm9uTGluZVxuICogQG1lbWJlcm9mIG5ldHdvcmtcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbogZTnvZFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG5ldHdvcmsgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L25ldHdvcmsnKTtcbiAqICRuZXR3b3JrLm9uTGluZSgpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIG9uTGluZSgpIHtcbiAgcmV0dXJuIHN1cHBvcnQoKSA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lIDogdHJ1ZTtcbn1cblxuZXhwb3J0cy5zdXBwb3J0ID0gc3VwcG9ydDtcbmV4cG9ydHMub25MaW5lID0gb25MaW5lO1xuIiwiLyoqXG4gKiDmo4DmtYvmk43kvZzns7vnu5/nsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gaW9zXG4gKiAtIGFuZHJvaWRcbiAqIEBtZXRob2Qgb3NcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkb3MgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZW52L29zJyk7XG4gKiBjb25zb2xlLmluZm8oJG9zKCkuaW9zKTtcbiAqIGNvbnNvbGUuaW5mbygkb3MuZGV0ZWN0KCkpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcbiAgaW9zOiAvbGlrZSBtYWMgb3MgeC9pLFxuICBhbmRyb2lkOiBmdW5jdGlvbiAodWEpIHtcbiAgICByZXR1cm4gdWEuaW5kZXhPZignYW5kcm9pZCcpID4gLTEgfHwgdWEuaW5kZXhPZignbGludXgnKSA+IC0xO1xuICB9LFxufTtcblxuZnVuY3Rpb24gZGV0ZWN0KG9wdGlvbnMsIGNoZWNrZXJzKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgdWE6ICcnLFxuICB9LCBvcHRpb25zKTtcblxuICAkYXNzaWduKHRlc3RlcnMsIGNoZWNrZXJzKTtcblxuICByZXR1cm4gJHVhTWF0Y2godGVzdGVycywgY29uZi51YSwgY29uZik7XG59XG5cbnZhciByZXN1bHQgPSBudWxsO1xuXG5mdW5jdGlvbiBvcygpIHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXN1bHQgPSBkZXRlY3QoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5vcy5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gb3M7XG4iLCIvKipcbiAqIOWIpOaWrea1j+iniOWZqOaYr+WQpuaUr+aMgeinpuaRuOWxj1xuICogQG1ldGhvZCB0b3VjaGFibGVcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIHop6bmkbjlsY9cbiAqIEBleGFtcGxlXG4gKiB2YXIgJHRvdWNoYWJsZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlJyk7XG4gKiBpZiAoJHRvdWNoYWJsZSgpKSB7XG4gKiAgIC8vIEl0IGlzIGEgdG91Y2ggZGV2aWNlLlxuICogfVxuICovXG5cbnZhciBpc1RvdWNoYWJsZSA9IG51bGw7XG5cbmZ1bmN0aW9uIHRvdWNoYWJsZSgpIHtcbiAgaWYgKGlzVG91Y2hhYmxlID09PSBudWxsKSB7XG4gICAgaXNUb3VjaGFibGUgPSAhISgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3dcbiAgICB8fCAod2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRUb3VjaCkpO1xuICB9XG4gIHJldHVybiBpc1RvdWNoYWJsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b3VjaGFibGU7XG4iLCIvKipcbiAqIFVB5a2X56ym5Liy5Yy56YWN5YiX6KGoXG4gKiBAbWV0aG9kIHVhTWF0Y2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0IOajgOa1iyBIYXNoIOWIl+ihqFxuICogQHBhcmFtIHtTdHJpbmd9IHVhIOeUqOS6juajgOa1i+eahCBVQSDlrZfnrKbkuLJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25mIOajgOa1i+WZqOmAiemhue+8jOS8oOmAkue7meajgOa1i+WHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdWFNYXRjaCcpO1xuICogdmFyIHJzID0gJHVhTWF0Y2goe1xuICogICB0cmlkZW50OiAndHJpZGVudCcsXG4gKiAgIHByZXN0bzogL3ByZXN0by8sXG4gKiAgIGdlY2tvOiBmdW5jdGlvbih1YSl7XG4gKiAgICAgcmV0dXJuIHVhLmluZGV4T2YoJ2dlY2tvJykgPiAtMSAmJiB1YS5pbmRleE9mKCdraHRtbCcpID09PSAtMTtcbiAqICAgfVxuICogfSwgJ3h4eCBwcmVzdG8geHh4Jyk7XG4gKiBjb25zb2xlLmluZm8ocnMucHJlc3RvKTsgLy8gdHJ1ZVxuICogY29uc29sZS5pbmZvKHJzLnRyaWRlbnQpOyAvLyB1bmRlZmluZWRcbiAqL1xuXG5mdW5jdGlvbiB1YU1hdGNoKGxpc3QsIHVhLCBjb25mKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgaWYgKCF1YSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdWEgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB9XG4gIH1cbiAgdWEgPSB1YS50b0xvd2VyQ2FzZSgpO1xuICBpZiAodHlwZW9mIGxpc3QgPT09ICdvYmplY3QnKSB7XG4gICAgT2JqZWN0LmtleXMobGlzdCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgdGVzdGVyID0gbGlzdFtrZXldO1xuICAgICAgaWYgKHRlc3Rlcikge1xuICAgICAgICBpZiAodHlwZW9mIHRlc3RlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAodWEuaW5kZXhPZih0ZXN0ZXIpID4gLTEpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRlc3RlcikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXG4gICAgICAgICkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IHVhLm1hdGNoKHRlc3Rlcik7XG4gICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlc3RlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICh0ZXN0ZXIodWEsIGNvbmYpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHRlc3Rlcih1YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVhTWF0Y2g7XG4iLCJ2YXIgaXNTdXBwb3J0V2VicCA9IG51bGw7XG5cbi8qKlxuICogd2VicCDnm7jlhbPmo4DmtYtcbiAqIEBtb2R1bGUgd2VicFxuICovXG5cbi8qKlxuICog5Yik5pat5rWP6KeI5Zmo5piv5ZCm5pSv5oyBd2VicFxuICogQG1ldGhvZCB3ZWJwLnN1cHBvcnRcbiAqIEBtZW1iZXJvZiB3ZWJwXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5piv5ZCm5pSv5oyBd2VicFxuICogQGV4YW1wbGVcbiAqIHZhciAkd2VicCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvd2VicCcpO1xuICogY29uc29sZS5pbmZvKCR3ZWJwLnN1cHBvcnQoKSk7IC8vIHRydWUvZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3VwcG9ydCgpIHtcbiAgdmFyIHJzID0gISFbXS5tYXBcbiAgICAmJiBkb2N1bWVudFxuICAgICAgLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgICAudG9EYXRhVVJMKCdpbWFnZS93ZWJwJylcbiAgICAgIC5pbmRleE9mKCdkYXRhOmltYWdlL3dlYnAnKSA9PT0gMDtcbiAgcmV0dXJuIHJzO1xufVxuXG5mdW5jdGlvbiB3ZWJwKCkge1xuICBpZiAoaXNTdXBwb3J0V2VicCA9PT0gbnVsbCkge1xuICAgIGlzU3VwcG9ydFdlYnAgPSBzdXBwb3J0KCk7XG4gIH1cbiAgcmV0dXJuIGlzU3VwcG9ydFdlYnA7XG59XG5cbndlYnAuc3VwcG9ydCA9IHN1cHBvcnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gd2VicDtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKipcbiAqIEEgbW9kdWxlIHRoYXQgY2FuIGJlIG1peGVkIGluIHRvICphbnkgb2JqZWN0KiBpbiBvcmRlciB0byBwcm92aWRlIGl0XG4gKiB3aXRoIGN1c3RvbSBldmVudHMuIFlvdSBtYXkgYmluZCB3aXRoIGBvbmAgb3IgcmVtb3ZlIHdpdGggYG9mZmAgY2FsbGJhY2tcbiAqIGZ1bmN0aW9ucyB0byBhbiBldmVudDsgYHRyaWdnZXJgLWluZyBhbiBldmVudCBmaXJlcyBhbGwgY2FsbGJhY2tzIGluXG4gKiBzdWNjZXNzaW9uLlxuICogLSDkuIDkuKrlj6/ku6Xooqvmt7flkIjliLDku7vkvZXlr7nosaHnmoTmqKHlnZfvvIznlKjkuo7mj5Dkvpvoh6rlrprkuYnkuovku7bjgIJcbiAqIC0g5Y+v5Lul55SoIG9uLCBvZmYg5pa55rOV5p2l57uR5a6a56e76Zmk5LqL5Lu244CCXG4gKiAtIOeUqCB0cmlnZ2VyIOadpeinpuWPkeS6i+S7tumAmuefpeOAglxuICogQGNsYXNzIEV2ZW50c1xuICogQHNlZSDnsbvkvLzlt6Xlhbc6IE1pdHRcbiAqIEBzZWUgaHR0cDovL2FyYWxlanMub3JnL1xuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZG9jdW1lbnRjbG91ZC9iYWNrYm9uZS9ibG9iL21hc3Rlci9iYWNrYm9uZS5qc1xuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvYmxvYi9tYXN0ZXIvbGliL2V2ZW50cy5qc1xuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIHZhciBldnQgPSBuZXcgJGV2ZW50cygpO1xuICogZXZ0Lm9uKCdhY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAqICAgY29uc29sZS5pbmZvKCdhY3Rpb24gdHJpZ2dlcmVkJyk7XG4gKiB9KTtcbiAqIGV2dC50cmlnZ2VyKCdhY3Rpb24nKTtcbiAqL1xuXG4vLyBSZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBzcGxpdCBldmVudCBzdHJpbmdzXG52YXIgZXZlbnRTcGxpdHRlciA9IC9cXHMrLztcblxudmFyIGtleXMgPSBPYmplY3Qua2V5cztcblxuaWYgKCFrZXlzKSB7XG4gIGtleXMgPSBmdW5jdGlvbiAobykge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gbykge1xuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbnZhciBFdmVudHMgPSBmdW5jdGlvbiAoKSB7fTtcblxuLyoqXG4gKiBCaW5kIG9uZSBvciBtb3JlIHNwYWNlIHNlcGFyYXRlZCBldmVudHMsIGBldmVudHNgLCB0byBhIGBjYWxsYmFja2BcbiAqIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmQgdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gKiAtIOe7keWumuS4gOS4quS6i+S7tuWbnuiwg+WHveaVsO+8jOaIluiAheeUqOWkmuS4quepuuagvOWIhumalOadpee7keWumuWkmuS4quS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDkvKDlhaXlj4LmlbAgYCdhbGwnYCDkvJrlnKjmiYDmnInkuovku7blj5HnlJ/ml7booqvop6blj5HjgIJcbiAqIEBtZXRob2QgRXZlbnRzI29uXG4gKiBAbWVtYmVyb2YgRXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzIOS6i+S7tuWQjeensFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sg5LqL5Lu25Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIOWbnuiwg+WHveaVsOeahOaJp+ihjOeOr+Wig+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIHZhciBldnQgPSBuZXcgJGV2ZW50cygpO1xuICpcbiAqIC8vIOe7keWumjHkuKrkuovku7ZcbiAqIGV2dC5vbignZXZlbnQtbmFtZScsIGZ1bmN0aW9uICgpIHt9KTtcbiAqXG4gKiAvLyDnu5Hlrpoy5Liq5LqL5Lu2XG4gKiBldnQub24oJ2V2ZW50MSBldmVudDInLCBmdW5jdGlvbiAoKSB7fSk7XG4gKlxuICogLy8g57uR5a6a5Li65omA5pyJ5LqL5Lu2XG4gKiBldnQub24oJ2FsbCcsIGZ1bmN0aW9uICgpIHt9KTtcbiAqL1xuXG5FdmVudHMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgdmFyIGNhY2hlO1xuICB2YXIgZXZlbnQ7XG4gIHZhciBsaXN0O1xuICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjYWNoZSA9IHRoaXMuX19ldmVudHMgfHwgKHRoaXMuX19ldmVudHMgPSB7fSk7XG4gIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcblxuICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICB3aGlsZSAoZXZlbnQpIHtcbiAgICBsaXN0ID0gY2FjaGVbZXZlbnRdIHx8IChjYWNoZVtldmVudF0gPSBbXSk7XG4gICAgbGlzdC5wdXNoKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBvbmUgb3IgbWFueSBjYWxsYmFja3MuIElmIGBjb250ZXh0YCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3NcbiAqIHdpdGggdGhhdCBmdW5jdGlvbi4gSWYgYGNhbGxiYWNrYCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3MgZm9yIHRoZVxuICogZXZlbnQuIElmIGBldmVudHNgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kIGNhbGxiYWNrcyBmb3IgYWxsIGV2ZW50cy5cbiAqIC0g56e76Zmk5LiA5Liq5oiW6ICF5aSa5Liq5LqL5Lu25Zue6LCD5Ye95pWw44CCXG4gKiAtIOWmguaenOS4jeS8oOmAkiBjYWxsYmFjayDlj4LmlbDvvIzkvJrnp7vpmaTmiYDmnInor6Xml7bpl7TlkI3np7DnmoTkuovku7blm57osIPlh73mlbDjgIJcbiAqIC0g5aaC5p6c5LiN5oyH5a6a5LqL5Lu25ZCN56ew77yM56e76Zmk5omA5pyJ6Ieq5a6a5LmJ5LqL5Lu25Zue6LCD5Ye95pWw44CCXG4gKiBAbWV0aG9kIEV2ZW50cyNvZmZcbiAqIEBtZW1iZXJvZiBFdmVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRzXSDkuovku7blkI3np7BcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10g6KaB56e76Zmk55qE5LqL5Lu25Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIOimgeenu+mZpOeahOWbnuiwg+WHveaVsOeahOaJp+ihjOeOr+Wig+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIHZhciBldnQgPSBuZXcgJGV2ZW50cygpO1xuICogdmFyIGJvdW5kID0ge307XG4gKiBib3VuZC50ZXN0ID0gZnVuY3Rpb24gKCkge307XG4gKlxuICogLy8g56e76Zmk5LqL5Lu25ZCN5Li6IGV2ZW50LW5hbWUg55qE5LqL5Lu25Zue6LCD5Ye95pWwIGJvdW5kLnRlc3RcbiAqIGV2dC5vZmYoJ2V2ZW50LW5hbWUnLCBib3VuZC50ZXN0KTtcbiAqXG4gKiAvLyDnp7vpmaTkuovku7blkI3kuLogJ2V2ZW50JyDnmoTmiYDmnInkuovku7blm57osIPlh73mlbBcbiAqIGV2dC5vZmYoJ2V2ZW50Jyk7XG4gKlxuICogLy8g56e76Zmk5omA5pyJ6Ieq5a6a5LmJ5LqL5Lu2XG4gKiBldnQub2ZmKCk7XG4gKi9cblxuRXZlbnRzLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuICB2YXIgY2FjaGU7XG4gIHZhciBldmVudDtcbiAgdmFyIGxpc3Q7XG4gIHZhciBpO1xuXG4gIC8vIE5vIGV2ZW50cywgb3IgcmVtb3ZpbmcgKmFsbCogZXZlbnRzLlxuICBjYWNoZSA9IHRoaXMuX19ldmVudHM7XG4gIGlmICghY2FjaGUpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBpZiAoIShldmVudHMgfHwgY2FsbGJhY2sgfHwgY29udGV4dCkpIHtcbiAgICBkZWxldGUgdGhpcy5fX2V2ZW50cztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV2ZW50cyA9IGV2ZW50cyA/IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKSA6IGtleXMoY2FjaGUpO1xuXG4gIC8vIExvb3AgdGhyb3VnaCB0aGUgY2FsbGJhY2sgbGlzdCwgc3BsaWNpbmcgd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGZvciAoZXZlbnQgPSBldmVudHMuc2hpZnQoKTsgZXZlbnQ7IGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCkpIHtcbiAgICBsaXN0ID0gY2FjaGVbZXZlbnRdO1xuICAgIGlmICghbGlzdCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKCEoY2FsbGJhY2sgfHwgY29udGV4dCkpIHtcbiAgICAgIGRlbGV0ZSBjYWNoZVtldmVudF07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDI7IGkgPj0gMDsgaSAtPSAyKSB7XG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgKGNhbGxiYWNrICYmIGxpc3RbaV0gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIHx8IChjb250ZXh0ICYmIGxpc3RbaSArIDFdICE9PSBjb250ZXh0KVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbGlzdC5zcGxpY2UoaSwgMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuICogcGFzc2VkIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyBgdHJpZ2dlcmAgaXMsIGFwYXJ0IGZyb20gdGhlIGV2ZW50IG5hbWVcbiAqICh1bmxlc3MgeW91J3JlIGxpc3RlbmluZyBvbiBgXCJhbGxcImAsIHdoaWNoIHdpbGwgY2F1c2UgeW91ciBjYWxsYmFjayB0b1xuICogcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuICogLSDmtL7lj5HkuIDkuKrmiJbogIXlpJrkuKrkuovku7bvvIzkvJrop6blj5Hlr7nlupTkuovku7blkI3np7Dnu5HlrprnmoTmiYDmnInkuovku7blh73mlbDjgIJcbiAqIC0g56ys5LiA5Liq5Y+C5pWw5piv5LqL5Lu25ZCN56ew77yM5Ymp5LiL5YW25LuW5Y+C5pWw5bCG5L2c5Li65LqL5Lu25Zue6LCD55qE5Y+C5pWw44CCXG4gKiBAbWV0aG9kIEV2ZW50cyN0cmlnZ2VyXG4gKiBAbWVtYmVyb2YgRXZlbnRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRzIOS6i+S7tuWQjeensFxuICogQHBhcmFtIHsuLi4qfSBbYXJnXSDkuovku7blj4LmlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGV2ZW50cyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvZXZlbnRzJyk7XG4gKiB2YXIgZXZ0ID0gbmV3ICRldmVudHMoKTtcbiAqXG4gKiAvLyDop6blj5Hkuovku7blkI3kuLogJ2V2ZW50LW5hbWUnIOeahOS6i+S7tlxuICogZXZ0LnRyaWdnZXIoJ2V2ZW50LW5hbWUnKTtcbiAqXG4gKiAvLyDlkIzml7bop6blj5Ey5Liq5LqL5Lu2XG4gKiBldnQudHJpZ2dlcignZXZlbnQxIGV2ZW50MicpO1xuICpcbiAqIC8vIOinpuWPkeS6i+S7tuWQjOaXtuS8oOmAkuWPguaVsFxuICogZXZ0Lm9uKCdldmVudC14JywgZnVuY3Rpb24gKGEsIGIpIHtcbiAqICAgY29uc29sZS5pbmZvKGEsIGIpOyAvLyAxLCAyXG4gKiB9KTtcbiAqIGV2dC50cmlnZ2VyKCdldmVudC14JywgMSwgMik7XG4gKi9cbkV2ZW50cy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudHMpIHtcbiAgdmFyIGNhY2hlO1xuICB2YXIgZXZlbnQ7XG4gIHZhciBhbGw7XG4gIHZhciBsaXN0O1xuICB2YXIgaTtcbiAgdmFyIGxlbjtcbiAgdmFyIHJlc3QgPSBbXTtcbiAgdmFyIGFyZ3M7XG5cbiAgY2FjaGUgPSB0aGlzLl9fZXZlbnRzO1xuICBpZiAoIWNhY2hlKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBldmVudHMgPSBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcik7XG5cbiAgLy8gRmlsbCB1cCBgcmVzdGAgd2l0aCB0aGUgY2FsbGJhY2sgYXJndW1lbnRzLiAgU2luY2Ugd2UncmUgb25seSBjb3B5aW5nXG4gIC8vIHRoZSB0YWlsIG9mIGBhcmd1bWVudHNgLCBhIGxvb3AgaXMgbXVjaCBmYXN0ZXIgdGhhbiBBcnJheSNzbGljZS5cbiAgZm9yIChpID0gMSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgcmVzdFtpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gIH1cblxuICAvLyBGb3IgZWFjaCBldmVudCwgd2FsayB0aHJvdWdoIHRoZSBsaXN0IG9mIGNhbGxiYWNrcyB0d2ljZSwgZmlyc3QgdG9cbiAgLy8gdHJpZ2dlciB0aGUgZXZlbnQsIHRoZW4gdG8gdHJpZ2dlciBhbnkgYFwiYWxsXCJgIGNhbGxiYWNrcy5cbiAgZm9yIChldmVudCA9IGV2ZW50cy5zaGlmdCgpOyBldmVudDsgZXZlbnQgPSBldmVudHMuc2hpZnQoKSkge1xuICAgIC8vIENvcHkgY2FsbGJhY2sgbGlzdHMgdG8gcHJldmVudCBtb2RpZmljYXRpb24uXG4gICAgYWxsID0gY2FjaGUuYWxsO1xuICAgIGlmIChhbGwpIHtcbiAgICAgIGFsbCA9IGFsbC5zbGljZSgpO1xuICAgIH1cblxuICAgIGxpc3QgPSBjYWNoZVtldmVudF07XG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGxpc3QgPSBsaXN0LnNsaWNlKCk7XG4gICAgfVxuXG4gICAgLy8gRXhlY3V0ZSBldmVudCBjYWxsYmFja3MuXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgbGlzdFtpXS5hcHBseShsaXN0W2kgKyAxXSB8fCB0aGlzLCByZXN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeGVjdXRlIFwiYWxsXCIgY2FsbGJhY2tzLlxuICAgIGlmIChhbGwpIHtcbiAgICAgIGFyZ3MgPSBbZXZlbnRdLmNvbmNhdChyZXN0KTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFsbC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICBhbGxbaV0uYXBwbHkoYWxsW2kgKyAxXSB8fCB0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTWl4IGBFdmVudHNgIHRvIG9iamVjdCBpbnN0YW5jZSBvciBDbGFzcyBmdW5jdGlvbi5cbiAqIC0g5bCG6Ieq5a6a5LqL5Lu25a+56LGh77yM5re35ZCI5Yiw5LiA5Liq57G755qE5a6e5L6L44CCXG4gKiBAbWV0aG9kIEV2ZW50cy5taXhUb1xuICogQG1lbWJlcm9mIEV2ZW50c1xuICogQHBhcmFtIHtPYmplY3R9IHJlY2VpdmVyIOimgea3t+WQiOS6i+S7tuWHveaVsOeahOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIC8vIOe7meS4gOS4quWunuS+i+a3t+WQiOiHquWumuS5ieS6i+S7tuaWueazlVxuICogdmFyIG9iaiA9IHt9O1xuICogJGV2ZW50cy5taXhUbyhvYmopO1xuICpcbiAqIC8vIOeUn+aIkOS4gOS4quWunuS+i1xuICogdmFyIG8xID0gT2JqZWN0LmNyZWF0ZShvYmopO1xuICpcbiAqIC8vIOWPr+S7peWcqOi/meS4quWvueixoeS4iuiwg+eUqOiHquWumuS5ieS6i+S7tueahOaWueazleS6hlxuICogbzEub24oJ2V2ZW50JywgZnVuY3Rpb24gKCkge30pO1xuICovXG5FdmVudHMubWl4VG8gPSBmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgcmVjZWl2ZXIgPSByZWNlaXZlci5wcm90b3R5cGUgfHwgcmVjZWl2ZXI7XG4gIHZhciBwcm90byA9IEV2ZW50cy5wcm90b3R5cGU7XG5cbiAgZm9yICh2YXIgcCBpbiBwcm90bykge1xuICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgcmVjZWl2ZXJbcF0gPSBwcm90b1twXTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRzO1xuIiwiLyoqXG4gKiAjIOWkhOeQhuS6i+S7tuS4juW5v+aSrVxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvZXZ0XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9ldnRcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZXZ0Lm9jY3VySW5zaWRlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL2V2dFxuICogdmFyICRldnQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGV2dC5vY2N1ckluc2lkZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJG9jY3VySW5zaWRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9vY2N1ckluc2lkZScpO1xuICovXG5cbmV4cG9ydHMuRXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbmV4cG9ydHMuTGlzdGVuZXIgPSByZXF1aXJlKCcuL2xpc3RlbmVyJyk7XG5leHBvcnRzLm9jY3VySW5zaWRlID0gcmVxdWlyZSgnLi9vY2N1ckluc2lkZScpO1xuZXhwb3J0cy50YXBTdG9wID0gcmVxdWlyZSgnLi90YXBTdG9wJyk7XG4iLCIvKipcbiAqIOW5v+aSree7hOS7tlxuICogLSDmnoTpgKDlrp7kvovml7bvvIzpnIDopoHkvKDlhaXkuovku7bnmb3lkI3ljZXliJfooajjgIJcbiAqIC0g5Y+q5pyJ5Zyo55m95ZCN5Y2V5YiX6KGo5LiK55qE5LqL5Lu25omN5Y+v5Lul6KKr6Kem5Y+R44CCXG4gKiAtIOS6i+S7tua3u+WKoO+8jOenu+mZpO+8jOa/gOWPkeeahOiwg+eUqOaWueazleWPguiAgyBFdmVudHPjgIJcbiAqIEBzZWUgc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHNcbiAqIEBjbGFzcyBMaXN0ZW5lclxuICogQGV4YW1wbGVcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxpc3RlbmVyID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9saXN0ZW5lcicpO1xuICpcbiAqIC8vIOeZveWQjeWNlemHjOWPquiusOW9leS6hiBldmVudDEg5LqL5Lu2XG4gKiB2YXIgY2hhbm5lbEdsb2JhbCA9IG5ldyAkbGlzdGVuZXIoW1xuICogICAnZXZlbnQxJ1xuICogXSk7XG4gKiBjaGFubmVsR2xvYmFsLm9uKCdldmVudDEnLCBmdW5jdGlvbigpe1xuICogICBjb25zb2xlLmxvZygnZXZlbnQxJyk7XG4gKiB9KTtcbiAqIGNoYW5uZWxHbG9iYWwub24oJ2V2ZW50MicsIGZ1bmN0aW9uKCl7XG4gKiAgIC8vIHdpbGwgbm90IHJ1blxuICogICBjb25zb2xlLmxvZygnZXZlbnQyJyk7XG4gKiB9KTtcbiAqIGNoYW5uZWxHbG9iYWwudHJpZ2dlcignZXZlbnQxJyk7XG4gKiBjaGFubmVsR2xvYmFsLnRyaWdnZXIoJ2V2ZW50MicpO1xuICovXG5cbnZhciAkZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcblxudmFyIExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50cykge1xuICB0aGlzLnByaXZhdGVXaGl0ZUxpc3QgPSB7fTtcbiAgdGhpcy5wcml2YXRlUmVjZWl2ZXIgPSBuZXcgJGV2ZW50cygpO1xuICBpZiAoQXJyYXkuaXNBcnJheShldmVudHMpKSB7XG4gICAgZXZlbnRzLmZvckVhY2godGhpcy5kZWZpbmUuYmluZCh0aGlzKSk7XG4gIH1cbn07XG5cbkxpc3RlbmVyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IExpc3RlbmVyLFxuICAvKipcbiAgICog5Zyo55m95ZCN5Y2V5LiK5a6a5LmJ5LiA5Liq5LqL5Lu25ZCN56ewXG4gICAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLmRlZmluZVxuICAgKiBAbWVtYmVyb2YgTGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgKi9cbiAgZGVmaW5lOiBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgdGhpcy5wcml2YXRlV2hpdGVMaXN0W2V2ZW50TmFtZV0gPSB0cnVlO1xuICB9LFxuICAvKipcbiAgICog56e76Zmk55m95ZCN5Y2V5LiK5a6a5LmJ55qE5LqL5Lu25ZCN56ewXG4gICAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLnVuZGVmaW5lXG4gICAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAqL1xuICB1bmRlZmluZTogZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLnByaXZhdGVXaGl0ZUxpc3RbZXZlbnROYW1lXTtcbiAgfSxcbiAgLyoqXG4gICAqIOW5v+aSree7hOS7tue7keWumuS6i+S7tlxuICAgKiBAc2VlIDxhIGhyZWY9XCIjZXZlbnRzLXByb3RvdHlwZS1vblwiPmV2ZW50cy5wcm90b3R5cGUub248L2E+XG4gICAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLm9uXG4gICAqIEBtZW1iZXJvZiBMaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIOimgee7keWumueahOS6i+S7tuWQjeensFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHnu5HlrprnmoTkuovku7blm57osIPlh73mlbBcbiAgICovXG4gIG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcml2YXRlUmVjZWl2ZXIub24uYXBwbHkodGhpcy5wcml2YXRlUmVjZWl2ZXIsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIC8qKlxuICAgKiDlub/mkq3nu4Tku7bnp7vpmaTkuovku7ZcbiAgICogQHNlZSA8YSBocmVmPVwiI2V2ZW50cy1wcm90b3R5cGUtb2ZmXCI+ZXZlbnRzLnByb3RvdHlwZS5vZmY8L2E+XG4gICAqIEBtZXRob2QgTGlzdGVuZXIucHJvdG90eXBlLm9mZlxuICAgKiBAbWVtYmVyb2YgTGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSDopoHnp7vpmaTnu5HlrprnmoTkuovku7blkI3np7BcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB56e76Zmk57uR5a6a55qE5LqL5Lu25Zue6LCD5Ye95pWwXG4gICAqL1xuICBvZmY6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByaXZhdGVSZWNlaXZlci5vZmYuYXBwbHkodGhpcy5wcml2YXRlUmVjZWl2ZXIsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIC8qKlxuICAgKiDlub/mkq3nu4Tku7bmtL7lj5Hkuovku7ZcbiAgICogQHNlZSA8YSBocmVmPVwiI2V2ZW50cy1wcm90b3R5cGUtdHJpZ2dlclwiPmV2ZW50cy5wcm90b3R5cGUudHJpZ2dlcjwvYT5cbiAgICogQG1ldGhvZCBMaXN0ZW5lci5wcm90b3R5cGUudHJpZ2dlclxuICAgKiBAbWVtYmVyb2YgTGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSDopoHop6blj5HnmoTkuovku7blkI3np7BcbiAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSDkuovku7blj4LmlbBcbiAgICovXG4gIHRyaWdnZXI6IGZ1bmN0aW9uIChldmVudHMpIHtcbiAgICB2YXIgcmVzdCA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIC8vIOaMieeFp0V2ZW50cy50cmlnZ2Vy55qE6LCD55So5pa55byP77yM56ys5LiA5Liq5Y+C5pWw5piv55So56m65qC85YiG6ZqU55qE5LqL5Lu25ZCN56ew5YiX6KGoXG4gICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KC9cXHMrLyk7XG5cbiAgICAvLyDpgY3ljobkuovku7bliJfooajvvIzkvp3mja7nmb3lkI3ljZXlhrPlrprkuovku7bmmK/lkKbmv4Dlj5FcbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZXZ0TmFtZSkge1xuICAgICAgaWYgKHRoaXMucHJpdmF0ZVdoaXRlTGlzdFtldnROYW1lXSkge1xuICAgICAgICB0aGlzLnByaXZhdGVSZWNlaXZlci50cmlnZ2VyLmFwcGx5KHRoaXMucHJpdmF0ZVJlY2VpdmVyLCBbZXZ0TmFtZV0uY29uY2F0KHJlc3QpKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0ZW5lcjtcbiIsIi8qKlxuICog5Yik5pat5LqL5Lu25piv5ZCm5Y+R55Sf5Zyo5LiA5LiqIERvbSDlhYPntKDlhoXjgIJcbiAqIC0g5bi455So5LqO5Yik5pat54K55Ye75LqL5Lu25Y+R55Sf5Zyo5rWu5bGC5aSW5pe25YWz6Zet5rWu5bGC44CCXG4gKiBAbWV0aG9kIG9jY3VySW5zaWRlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQg5rWP6KeI5Zmo5LqL5Lu25a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnlKjkuo7mr5TovoPkuovku7blj5HnlJ/ljLrln5/nmoQgRG9tIOWvueixoVxuICogQHJldHVybnMge0Jvb2xlYW59IOS6i+S7tuaYr+WQpuWPkeeUn+WcqCBub2RlIOWGhVxuICogQGV4YW1wbGVcbiAqIHZhciAkb2NjdXJJbnNpZGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZXZ0L29jY3VySW5zaWRlJyk7XG4gKiAkKCcubGF5ZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldnQpe1xuICogICBpZigkb2NjdXJJbnNpZGUoZXZ0LCAkKHRoaXMpLmZpbmQoJ2Nsb3NlJykuZ2V0KDApKSl7XG4gKiAgICAgJCh0aGlzKS5oaWRlKCk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbmZ1bmN0aW9uIG9jY3VySW5zaWRlKGV2ZW50LCBub2RlKSB7XG4gIGlmIChub2RlICYmIGV2ZW50ICYmIGV2ZW50LnRhcmdldCkge1xuICAgIHZhciBwb3MgPSBldmVudC50YXJnZXQ7XG4gICAgd2hpbGUgKHBvcykge1xuICAgICAgaWYgKHBvcyA9PT0gbm9kZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHBvcyA9IHBvcy5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2NjdXJJbnNpZGU7XG4iLCIvKipcbiAqIOeUqOmBrue9qeeahOaWueW8j+mYu+atoiB0YXAg5LqL5Lu256m/6YCP5byV5Y+R6KGo5Y2V5YWD57Sg6I635Y+W54Sm54K544CCXG4gKiAtIOaOqOiNkOeUqCBmYXN0Y2xpY2sg5p2l6Kej5Yaz6Kem5bGP5LqL5Lu256m/6YCP6Zeu6aKY44CCXG4gKiAtIOatpOe7hOS7tueUqOWcqCBmYXN0Y2xpY2sg5pyq6IO96Kej5Yaz6Zeu6aKY5pe244CC5oiW6ICF5LiN5pa55L6/5L2/55SoIGZhc3RjbGljayDml7bjgIJcbiAqIEBtZXRob2QgdGFwU3RvcFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg54K55Ye76YCJ6aG5XG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kZWxheSDkuLTml7bmta7lsYLlnKjov5nkuKrlu7bov5/ml7bpl7QobXMp5LmL5ZCO5YWz6ZetXG4gKiBAZXhhbXBsZVxuICogdmFyICR0YXBTdG9wID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2V2dC90YXBTdG9wJyk7XG4gKiAkKCcubWFzaycpLm9uKCd0YXAnLCBmdW5jdGlvbigpe1xuICogICAkdGFwU3RvcCgpO1xuICogICAkKHRoaXMpLmhpZGUoKTtcbiAqIH0pO1xuICovXG52YXIgbWluaU1hc2sgPSBudWxsO1xudmFyIHBvcyA9IHt9O1xudmFyIHRpbWVyID0gbnVsbDtcbnZhciB0b3VjaFN0YXJ0Qm91bmQgPSBmYWxzZTtcblxudmFyIHRhcFN0b3AgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgJCA9IHdpbmRvdy4kIHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5O1xuXG4gIHZhciBjb25mID0gJC5leHRlbmQoe1xuICAgIC8vIOmBrue9qeWtmOWcqOaXtumXtFxuICAgIGRlbGF5OiA1MDAsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIGlmICghbWluaU1hc2spIHtcbiAgICBtaW5pTWFzayA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgbWluaU1hc2suY3NzKHtcbiAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgICdtYXJnaW4tbGVmdCc6ICctMjBweCcsXG4gICAgICAnbWFyZ2luLXRvcCc6ICctMjBweCcsXG4gICAgICAnei1pbmRleCc6IDEwMDAwLFxuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICB3aWR0aDogJzQwcHgnLFxuICAgICAgaGVpZ2h0OiAnNDBweCcsXG4gICAgfSkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gIH1cblxuICBpZiAoIXRvdWNoU3RhcnRCb3VuZCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKCEoZXZ0ICYmIGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHRvdWNoID0gZXZ0LnRvdWNoZXNbMF07XG4gICAgICBwb3MucGFnZVggPSB0b3VjaC5wYWdlWDtcbiAgICAgIHBvcy5wYWdlWSA9IHRvdWNoLnBhZ2VZO1xuICAgIH0pO1xuICAgIHRvdWNoU3RhcnRCb3VuZCA9IHRydWU7XG4gIH1cblxuICB2YXIgZGVsYXkgPSBwYXJzZUludChjb25mLmRlbGF5LCAxMCkgfHwgMDtcbiAgbWluaU1hc2suc2hvdygpLmNzcyh7XG4gICAgbGVmdDogcG9zLnBhZ2VYICsgJ3B4JyxcbiAgICB0b3A6IHBvcy5wYWdlWSArICdweCcsXG4gIH0pO1xuICBjbGVhclRpbWVvdXQodGltZXIpO1xuICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIG1pbmlNYXNrLmhpZGUoKTtcbiAgfSwgZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0YXBTdG9wO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIC0g55So5LqO5aSE55CG5a+G6ZuG5LqL5Lu277yM5bu26L+f5pe26Ze05YaF5ZCM5pe26Kem5Y+R55qE5Ye95pWw6LCD55So44CCXG4gKiAtIOacgOe7iOWPquWcqOacgOWQjuS4gOasoeiwg+eUqOW7tui/n+WQju+8jOaJp+ihjOS4gOasoeOAglxuICogQG1ldGhvZCBkZWxheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24g5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoR0aGlz5oyH5ZCRXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IOe7j+i/h+WMheijheeahOW7tui/n+inpuWPkeWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkZGVsYXkgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZm4vZGVsYXknKTtcbiAqIHZhciBjb21wID0ge1xuICogICBjb3VudFdvcmRzIDogZnVuY3Rpb24oKXtcbiAqICAgICBjb25zb2xlLmluZm8odGhpcy5sZW5ndGgpO1xuICogICB9XG4gKiB9O1xuICpcbiAqICAvLyDnlq/ni4Lngrnlh7sgaW5wdXQg77yM5YGc5LiL5p2lIDUwMCBtcyDlkI7vvIzop6blj5Hlh73mlbDosIPnlKhcbiAqICQoJyNpbnB1dCcpLmtleWRvd24oJGRlbGF5KGZ1bmN0aW9uKCl7XG4gKiAgIHRoaXMubGVuZ3RoID0gJCgnI2lucHV0JykudmFsKCkubGVuZ3RoO1xuICogICB0aGlzLmNvdW50V29yZHMoKTtcbiAqIH0sIDUwMCwgY29tcCkpO1xuICovXG5cbmZ1bmN0aW9uIGRlbGF5KGZuLCBkdXJhdGlvbiwgYmluZCkge1xuICB2YXIgdGltZXIgPSBudWxsO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbi5hcHBseShiaW5kLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9LCBkdXJhdGlvbik7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsYXk7XG4iLCIvKipcbiAqICMg5Ye95pWw5YyF6KOF77yM6I635Y+W54m55q6K5omn6KGM5pa55byPXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9mblxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZm5cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZm4uZGVsYXkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvZm5cbiAqIHZhciAkZm4gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZm4nKTtcbiAqIGNvbnNvbGUuaW5mbygkZm4uZGVsYXkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRkZWxheSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9kZWxheScpO1xuICovXG5cbmV4cG9ydHMuZGVsYXkgPSByZXF1aXJlKCcuL2RlbGF5Jyk7XG5leHBvcnRzLmxvY2sgPSByZXF1aXJlKCcuL2xvY2snKTtcbmV4cG9ydHMub25jZSA9IHJlcXVpcmUoJy4vb25jZScpO1xuZXhwb3J0cy5xdWV1ZSA9IHJlcXVpcmUoJy4vcXVldWUnKTtcbmV4cG9ydHMucHJlcGFyZSA9IHJlcXVpcmUoJy4vcHJlcGFyZScpO1xuZXhwb3J0cy5yZWd1bGFyID0gcmVxdWlyZSgnLi9yZWd1bGFyJyk7XG4iLCIvKipcbiAqIOWMheijheS4uuinpuWPkeS4gOasoeWQju+8jOmihOe9ruaXtumXtOWGheS4jeiDveWGjeasoeinpuWPkeeahOWHveaVsFxuICogLSDnsbvkvLzkuo7mioDog73lhrfljbTjgIJcbiAqIEBtZXRob2QgbG9ja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE5Ya35Y206Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRsb2NrID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2xvY2snKTtcbiAqIHZhciByZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICogICBjb25zb2xlLmluZm8oJ2RvIHJlcXVlc3QnKTtcbiAqIH07XG4gKiAkKCcjaW5wdXQnKS5rZXlkb3duKCRsb2NrKHJlcXVlc3QsIDUwMCkpO1xuICogLy8g56ys5LiA5qyh5oyJ6ZSu77yM5bCx5Lya6Kem5Y+R5LiA5qyh5Ye95pWw6LCD55SoXG4gKiAvLyDkuYvlkI7ov57nu63mjInplK7vvIzku4XlnKggNTAwbXMg57uT5p2f5ZCO5YaN5qyh5oyJ6ZSu77yM5omN5Lya5YaN5qyh6Kem5Y+RIHJlcXVlc3Qg5Ye95pWw6LCD55SoXG4gKi9cblxuZnVuY3Rpb24gbG9jayhmbiwgZGVsYXksIGJpbmQpIHtcbiAgdmFyIHRpbWVyID0gbnVsbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgIH0sIGRlbGF5KTtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbi5hcHBseShiaW5kLCBhcmdzKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9jaztcbiIsIi8qKlxuICog5YyF6KOF5Li65LuF6Kem5Y+R5LiA5qyh55qE5Ye95pWwXG4gKiAtIOiiq+WMheijheeahOWHveaVsOaZuuiDveaJp+ihjOS4gOasoe+8jOS5i+WQjuS4jeS8muWGjeaJp+ihjFxuICogQG1ldGhvZCBvbmNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYmluZF0g5Ye95pWw55qEIHRoaXMg5oyH5ZCRXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IOivpeWHveaVsOS7heiDveinpuWPkeaJp+ihjOS4gOasoVxuICogQGV4YW1wbGVcbiAqIHZhciAkb25jZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9vbmNlJyk7XG4gKiB2YXIgZm4gPSAkb25jZShmdW5jdGlvbiAoKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnb3V0cHV0Jyk7XG4gKiB9KTtcbiAqIGZuKCk7IC8vICdvdXRwdXQnXG4gKiBmbigpOyAvLyB3aWxsIGRvIG5vdGhpbmdcbiAqL1xuXG5mdW5jdGlvbiBvbmNlKGZuLCBiaW5kKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbi5hcHBseShiaW5kLCBhcmd1bWVudHMpO1xuICAgICAgZm4gPSBudWxsO1xuICAgICAgYmluZCA9IG51bGw7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIvKipcbiAqIOWMheijheS4uuS4gOS4quadoeS7tuinpuWPkeeuoeeQhuWZqFxuICogLSDosIPnlKjnrqHnkIblmajnmoQgcmVhZHkg5Ye95pWw5p2l5r+A5rS75p2h5Lu244CCXG4gKiAtIOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOWHveaVsOaMiemYn+WIl+mhuuW6j+aJp+ihjOOAglxuICogLSDkuYvlkI7mj5LlhaXnrqHnkIblmajnmoTlh73mlbDnq4vljbPmiafooYzjgIJcbiAqIC0g5L2c55So5py65Yi257G75Ly8IGpRdWVyeS5yZWFkeSwg5Y+v5Lul6K6+572u5Lu75L2V5p2h5Lu244CCXG4gKiBAbW9kdWxlIHByZXBhcmVcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g5p2h5Lu26Kem5Y+R566h55CG5Zmo5Ye95pWw77yM5Lyg5YWl5LiA5LiqIGZ1bmN0aW9uIOS9nOS4uuS7u+WKoeaJp+ihjOWHveaVsOWPguaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkcHJlcGFyZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9wcmVwYXJlJyk7XG4gKiAvLyDnlJ/miJDkuIDkuKrnrqHnkIblmajlh73mlbAgdGltZVJlYWR5XG4gKiB2YXIgdGltZVJlYWR5ID0gJHByZXBhcmUoKTtcbiAqXG4gKiAvLyDorr7nva7mnaHku7bkuLoy56eS5ZCO5bCx57uqXG4gKiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAqICAgdGltZVJlYWR5LnJlYWR5KCk7XG4gKiB9LCAyMDAwKTtcbiAqXG4gKiAvLyDosIPnlKjnrqHnkIblmajlh73mlbAgdGltZVJlYWR577yM5o+S5YWl6KaB5omn6KGM55qE5Lu75Yqh5Ye95pWwXG4gKiB0aW1lUmVhZHkoZnVuY3Rpb24gKCkge1xuICogICAvLyAyIOenkuWQjui+k+WHuiAxXG4gKiAgIGNvbnNvbGUuaW5mbygxKTtcbiAqIH0pO1xuICpcbiAqIC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqIHRpbWVSZWFkeShmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIDIg56eS5ZCO6L6T5Ye6IDJcbiAqICAgY29uc29sZS5pbmZvKDIpO1xuICogfSk7XG4gKlxuICogLy8gMjEwMG1zIOWQjuaJp+ihjFxuICogc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqICAgdGltZVJlYWR5KGZ1bmN0aW9uICgpIHtcbiAqICAgICAvLyDnq4vljbPmiafooYzvvIzovpPlh7ogM1xuICogICAgIGNvbnNvbGUuaW5mbygzKTtcbiAqICAgfSk7XG4gKiB9LCAyMTAwKTtcbiAqL1xuXG4vKipcbiAqIOa/gOa0u+S7u+WKoeeuoeeQhuWZqOeahOinpuWPkeadoeS7tu+8jOWcqOatpOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOS7u+WKoeaMiemYn+WIl+mhuuW6j+aJp+ihjO+8jOS5i+WQjuaPkuWFpeeahOS7u+WKoeWHveaVsOeri+WNs+aJp+ihjOOAglxuICogQG1ldGhvZCBwcmVwYXJlI3JlYWR5XG4gKiBAbWVtYmVyb2YgcHJlcGFyZVxuICovXG5mdW5jdGlvbiBwcmVwYXJlKCkge1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIGNvbmRpdGlvbiA9IGZhbHNlO1xuICB2YXIgbW9kZWw7XG5cbiAgdmFyIGF0dGFtcHQgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZuKG1vZGVsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcXVldWUucHVzaChmbik7XG4gICAgfVxuICB9O1xuXG4gIGF0dGFtcHQucmVhZHkgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbmRpdGlvbiA9IHRydWU7XG4gICAgbW9kZWwgPSBkYXRhO1xuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZuKG1vZGVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGF0dGFtcHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJlcGFyZTtcbiIsIi8qKlxuICog5YyF6KOF5Li65LiA5Liq6Zif5YiX77yM5oyJ6K6+572u55qE5pe26Ze06Ze06ZqU6Kem5Y+R5Lu75Yqh5Ye95pWwXG4gKiAtIOaPkuWFpemYn+WIl+eahOaJgOacieWHveaVsOmDveS8muaJp+ihjO+8jOS9huavj+asoeaJp+ihjOS5i+mXtOmDveS8muacieS4gOS4quWbuuWumueahOaXtumXtOmXtOmalOOAglxuICogQG1ldGhvZCBxdWV1ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE6Zif5YiX6Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRxdWV1ZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9xdWV1ZScpO1xuICogdmFyIHQxID0gRGF0ZS5ub3coKTtcbiAqIHZhciBkb1NvbXRoaW5nID0gJHF1ZXVlKGZ1bmN0aW9uIChpbmRleCkge1xuICogICBjb25zb2xlLmluZm8oaW5kZXggKyAnOicgKyAoRGF0ZS5ub3coKSAtIHQxKSk7XG4gKiB9LCAyMDApO1xuICogLy8g5q+P6ZqUMjAwbXPovpPlh7rkuIDkuKrml6Xlv5fjgIJcbiAqIGZvcih2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKXtcbiAqICAgZG9Tb210aGluZyhpKTtcbiAqIH1cbiAqL1xuXG5mdW5jdGlvbiBxdWV1ZShmbiwgZGVsYXksIGJpbmQpIHtcbiAgdmFyIHRpbWVyID0gbnVsbDtcbiAgdmFyIGFyciA9IFtdO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgYXJyLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbi5hcHBseShiaW5kLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXRpbWVyKSB7XG4gICAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyci5zaGlmdCgpKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcXVldWU7XG4iLCIvKipcbiAqIOWMheijheS4uuinhOW+i+inpuWPkeeahOWHveaVsO+8jOeUqOS6jumZjeS9juWvhumbhuS6i+S7tueahOWkhOeQhumikeeOh1xuICogLSDlnKjnlq/ni4Lmk43kvZzmnJ/pl7TvvIzmjInnhafop4Tlvovml7bpl7Tpl7TpmpTvvIzmnaXosIPnlKjku7vliqHlh73mlbBcbiAqIEBtZXRob2QgcmVxdWxhclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTlrprml7bop6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHJlZ3VsYXIgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZm4vcmVndWxhcicpO1xuICogdmFyIGNvbXAgPSB7XG4gKiAgIGNvdW50V29yZHMgOiBmdW5jdGlvbigpe1xuICogICAgIGNvbnNvbGUuaW5mbyh0aGlzLmxlbmd0aCk7XG4gKiAgIH1cbiAqIH07XG4gKiAvLyDnlq/ni4LmjInplK7vvIzmr4/pmpQgMjAwbXMg5omN5pyJ5LiA5qyh5oyJ6ZSu5pyJ5pWIXG4gKiAkKCcjaW5wdXQnKS5rZXlkb3duKCRyZWd1bGFyKGZ1bmN0aW9uKCl7XG4gKiAgIHRoaXMubGVuZ3RoID0gJCgnI2lucHV0JykudmFsKCkubGVuZ3RoO1xuICogICB0aGlzLmNvdW50V29yZHMoKTtcbiAqIH0sIDIwMCwgY29tcCkpO1xuICovXG5cbmZ1bmN0aW9uIHJlcXVsYXIoZm4sIGRlbGF5LCBiaW5kKSB7XG4gIHZhciBlbmFibGUgPSB0cnVlO1xuICB2YXIgdGltZXIgPSBudWxsO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgZW5hYmxlID0gdHJ1ZTtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICBpZiAoIXRpbWVyKSB7XG4gICAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5hYmxlKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVuYWJsZSA9IGZhbHNlO1xuICAgICAgfSwgZGVsYXkpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1bGFyO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGx1c3BsdXMgKi9cblxuLyoqXG4gKiDnroDljZXnmoQgRWFzaW5nIEZ1bmN0aW9uc1xuICogLSDlgLzln5/lj5jljJbojIPlm7TvvIzku44gWzAsIDFdIOWIsCBbMCwgMV1cbiAqIC0g5Y2z6L6T5YWl5YC86IyD5Zu05LuOIDAg5YiwIDFcbiAqIC0g6L6T5Ye65Lmf5Li65LuOIDAg5YiwIDFcbiAqIC0g6YCC5ZCI6L+b6KGM55m+5YiG5q+U5Yqo55S76L+Q566XXG4gKlxuICog5Yqo55S75Ye95pWwXG4gKiAtIGxpbmVhclxuICogLSBlYXNlSW5RdWFkXG4gKiAtIGVhc2VPdXRRdWFkXG4gKiAtIGVhc2VJbk91dFF1YWRcbiAqIC0gZWFzZUluQ3ViaWNcbiAqIC0gZWFzZUluUXVhcnRcbiAqIC0gZWFzZU91dFF1YXJ0XG4gKiAtIGVhc2VJbk91dFF1YXJ0XG4gKiAtIGVhc2VJblF1aW50XG4gKiAtIGVhc2VPdXRRdWludFxuICogLSBlYXNlSW5PdXRRdWludFxuICogQG1vZHVsZSBlYXNpbmdcbiAqIEBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTRcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVhc2luZyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcnKTtcbiAqICRlYXNpbmcubGluZWFyKDAuNSk7IC8vIDAuNVxuICogJGVhc2luZy5lYXNlSW5RdWFkKDAuNSk7IC8vIDAuMjVcbiAqICRlYXNpbmcuZWFzZUluQ3ViaWMoMC41KTsgLy8gMC4xMjVcbiAqL1xudmFyIGVhc2luZyA9IHtcbiAgLy8gbm8gZWFzaW5nLCBubyBhY2NlbGVyYXRpb25cbiAgbGluZWFyOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0O1xuICB9LFxuICAvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VJblF1YWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgKiB0O1xuICB9LFxuICAvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuICBlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCAqICgyIC0gdCk7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0IDwgMC41ID8gMiAqIHQgKiB0IDogLTEgKyAoNCAtIDIgKiB0KSAqIHQ7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHlcbiAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdDtcbiAgfSxcbiAgLy8gZGVjZWxlcmF0aW5nIHRvIHplcm8gdmVsb2NpdHlcbiAgZWFzZU91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiAoLS10KSAqIHQgKiB0ICsgMTtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW9uIHVudGlsIGhhbGZ3YXksIHRoZW4gZGVjZWxlcmF0aW9uXG4gIGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0IDwgMC41ID8gNCAqIHQgKiB0ICogdCA6ICh0IC0gMSkgKiAoMiAqIHQgLSAyKSAqICgyICogdCAtIDIpICsgMTtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuICBlYXNlSW5RdWFydDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogdDtcbiAgfSxcbiAgLy8gZGVjZWxlcmF0aW5nIHRvIHplcm8gdmVsb2NpdHlcbiAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiAxIC0gKC0tdCkgKiB0ICogdCAqIHQ7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDggKiB0ICogdCAqIHQgKiB0IDogMSAtIDggKiAoLS10KSAqIHQgKiB0ICogdDtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogdCAqIHQ7XG4gIH0sXG4gIC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gMSArICgtLXQpICogdCAqIHQgKiB0ICogdDtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW9uIHVudGlsIGhhbGZ3YXksIHRoZW4gZGVjZWxlcmF0aW9uXG4gIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0IDwgMC41ID8gMTYgKiB0ICogdCAqIHQgKiB0ICogdCA6IDEgKyAxNiAqICgtLXQpICogdCAqIHQgKiB0ICogdDtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZWFzaW5nO1xuIiwiLyoqXG4gKiDlsIHoo4Xpl6rng4HliqjkvZxcbiAqIEBtZXRob2QgZmxhc2hBY3Rpb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnRpbWVzPTNdIOmXqueDgeasoeaVsO+8jOm7mOiupDPmrKFcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5kZWxheT0xMDBdIOmXqueDgemXtOmalOaXtumXtChtcylcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLmFjdGlvbk9kZF0g5aWH5pWw5Zue6LCDXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5hY3Rpb25FdmVuXSDlgbbmlbDlm57osINcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLnJlY292ZXJdIOeKtuaAgeaBouWkjeWbnuiwg1xuICogQGV4YW1wbGVcbiAqIHZhciAkZmxhc2hBY3Rpb24gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZmxhc2hBY3Rpb24nKTtcbiAqIC8vIOaWh+Wtl+mXqueDge+8jOWlh+aVsOasoeWRiOeOsOS4uue6ouiJsu+8jOWBtuaVsOasoeaIkOe6pOe7tOiTneiJsu+8jOWKqOeUu+e7k+adn+WRiOeOsOS4uum7keiJslxuICogdmFyIHRleHQgPSAkKCcjdGFyZ2V0IHNwYW4udHh0Jyk7XG4gKiAkZmxhc2hBY3Rpb24oe1xuICogICBhY3Rpb25PZGQgOiBmdW5jdGlvbiAoKXtcbiAqICAgICB0ZXh0LmNzcygnY29sb3InLCAnI2YwMCcpO1xuICogICB9LFxuICogICBhY3Rpb25FdmVuIDogZnVuY3Rpb24gKCl7XG4gKiAgICAgdGV4dC5jc3MoJ2NvbG9yJywgJyMwMGYnKTtcbiAqICAgfSxcbiAqICAgcmVjb3ZlciA6IGZ1bmN0aW9uICgpe1xuICogICAgIHRleHQuY3NzKCdjb2xvcicsICcjMDAwJyk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxuZnVuY3Rpb24gZmxhc2hBY3Rpb24ob3B0aW9ucykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHRpbWVzOiAzLFxuICAgIGRlbGF5OiAxMDAsXG4gICAgYWN0aW9uT2RkOiBudWxsLFxuICAgIGFjdGlvbkV2ZW46IG51bGwsXG4gICAgcmVjb3ZlcjogbnVsbCxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgdmFyIHF1ZXVlID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZi50aW1lcyAqIDIgKyAxOyBpICs9IDEpIHtcbiAgICBxdWV1ZS5wdXNoKChpICsgMSkgKiBjb25mLmRlbGF5KTtcbiAgfVxuXG4gIHF1ZXVlLmZvckVhY2goZnVuY3Rpb24gKHRpbWUsIGluZGV4KSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaW5kZXggPj0gcXVldWUubGVuZ3RoIC0gMSkge1xuICAgICAgICBpZiAoY29uZi5yZWNvdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29uZi5yZWNvdmVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggJSAyID09PSAwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZi5hY3Rpb25FdmVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29uZi5hY3Rpb25FdmVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmYuYWN0aW9uT2RkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmYuYWN0aW9uT2RkKCk7XG4gICAgICB9XG4gICAgfSwgdGltZSk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXNoQWN0aW9uO1xuIiwiLyoqXG4gKiDliqjnlLvnsbsgLSDnlKjkuo7lpITnkIbkuI3pgILlkIjkvb/nlKggdHJhbnNpdGlvbiDnmoTliqjnlLvlnLrmma9cbiAqXG4gKiDlj6/nu5HlrprnmoTkuovku7ZcbiAqIC0gc3RhcnQg5Yqo55S75byA5aeL5pe26Kem5Y+RXG4gKiAtIGNvbXBsZXRlIOWKqOeUu+W3suWujOaIkFxuICogLSBzdG9wIOWKqOeUu+WwmuacquWujOaIkOWwseiiq+S4reaWrVxuICogLSBjYW5jZWwg5Yqo55S76KKr5Y+W5raIXG4gKiBAY2xhc3MgRnhcbiAqIEBzZWUgaHR0cHM6Ly9tb290b29scy5uZXQvY29yZS9kb2NzLzEuNi4wL0Z4L0Z4XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g5Yqo55S76YCJ6aG5XG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnBzPTYwXSDluKfpgJ/njocoZi9zKe+8jOWunumZheS4iuWKqOeUu+i/kOihjOeahOacgOmrmOW4p+mAn+eOh+S4jeS8mumrmOS6jiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg5o+Q5L6b55qE5bin6YCf546HXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZHVyYXRpb249NTAwXSDliqjnlLvmjIHnu63ml7bpl7QobXMpXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gW29wdGlvbnMudHJhbnNpdGlvbl0g5Yqo55S75omn6KGM5pa55byP77yM5Y+C6KeBIHNwb3JlLWtpdC9wYWNrYWdlcy9meC90cmFuc2l0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lc10g5LuO5ZOq5LiA5bin5byA5aeL5omn6KGMXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZyYW1lU2tpcD10cnVlXSDmmK/lkKbot7PluKdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5saW5rPSdpZ25vcmUnXSDliqjnlLvooZTmjqXmlrnlvI/vvIzlj6/pgInvvJpbJ2lnbm9yZScsICdjYW5jZWwnXVxuICogQGV4YW1wbGVcbiAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcbiAqIHZhciBmeCA9IG5ldyAkZngoe1xuICogICBkdXJhdGlvbiA6IDEwMDBcbiAqIH0pO1xuICogZnguc2V0ID0gZnVuY3Rpb24gKG5vdykge1xuICogICBub2RlLnN0eWxlLm1hcmdpbkxlZnQgPSBub3cgKyAncHgnO1xuICogfTtcbiAqIGZ4Lm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gKiAgIGNvbnNvbGUuaW5mbygnYW5pbWF0aW9uIGVuZCcpO1xuICogfSk7XG4gKiBmeC5zdGFydCgwLCA2MDApOyAvLyAx56eS5YaF5pWw5a2X5LuOMOWinuWKoOWIsDYwMFxuICovXG5cbnZhciAka2xhc3MgPSByZXF1aXJlKCdrbGFzcycpO1xudmFyICRldmVudHMgPSByZXF1aXJlKCcuLi9ldnQvZXZlbnRzJyk7XG52YXIgJGVyYXNlID0gcmVxdWlyZSgnLi4vYXJyL2VyYXNlJyk7XG52YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnLi4vYXJyL2NvbnRhaW5zJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJyk7XG5cbi8vIGdsb2JhbCB0aW1lcnNcbi8vIOS9v+eUqOWFrOWFseWumuaXtuWZqOWPr+S7peWHj+Wwkea1j+iniOWZqOi1hOa6kOa2iOiAl1xudmFyIGluc3RhbmNlcyA9IHt9O1xudmFyIHRpbWVycyA9IHt9O1xuXG52YXIgbG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aDsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzW2ldO1xuICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2Uuc3RlcChub3cpO1xuICAgIH1cbiAgfVxufTtcblxudmFyIHB1c2hJbnN0YW5jZSA9IGZ1bmN0aW9uIChmcHMpIHtcbiAgdmFyIGxpc3QgPSBpbnN0YW5jZXNbZnBzXSB8fCAoaW5zdGFuY2VzW2Zwc10gPSBbXSk7XG4gIGxpc3QucHVzaCh0aGlzKTtcbiAgaWYgKCF0aW1lcnNbZnBzXSkge1xuICAgIHZhciBsb29wTWV0aG9kID0gbG9vcC5iaW5kKGxpc3QpO1xuICAgIHZhciBsb29wRHVyID0gTWF0aC5yb3VuZCgxMDAwIC8gZnBzKTtcbiAgICB0aW1lcnNbZnBzXSA9ICR0aW1lci5zZXRJbnRlcnZhbChsb29wTWV0aG9kLCBsb29wRHVyKTtcbiAgfVxufTtcblxudmFyIHB1bGxJbnN0YW5jZSA9IGZ1bmN0aW9uIChmcHMpIHtcbiAgdmFyIGxpc3QgPSBpbnN0YW5jZXNbZnBzXTtcbiAgaWYgKGxpc3QpIHtcbiAgICAkZXJhc2UobGlzdCwgdGhpcyk7XG4gICAgaWYgKCFsaXN0Lmxlbmd0aCAmJiB0aW1lcnNbZnBzXSkge1xuICAgICAgZGVsZXRlIGluc3RhbmNlc1tmcHNdO1xuICAgICAgdGltZXJzW2Zwc10gPSAkdGltZXIuY2xlYXJJbnRlcnZhbCh0aW1lcnNbZnBzXSk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgRnggPSAka2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICRhc3NpZ24oe1xuICAgICAgZnBzOiA2MCxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICB0cmFuc2l0aW9uOiBudWxsLFxuICAgICAgZnJhbWVzOiBudWxsLFxuICAgICAgZnJhbWVTa2lwOiB0cnVlLFxuICAgICAgbGluazogJ2lnbm9yZScsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiuvue9ruWunuS+i+eahOmAiemhuVxuICAgKiBAbWV0aG9kIEZ4I3NldE9wdGlvbnNcbiAgICogQG1lbWJlcm9mIEZ4XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOWKqOeUu+mAiemhuVxuICAgKi9cbiAgc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbmYgPSAkYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDorr7nva7liqjnlLvnmoTmiafooYzmlrnlvI/vvIzphY3nva7nvJPliqjmlYjmnpxcbiAgICogQGludGVyZmFjZSBGeCNnZXRUcmFuc2l0aW9uXG4gICAqIEBtZW1iZXJvZiBGeFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguZ2V0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICogICByZXR1cm4gZnVuY3Rpb24gKHApIHtcbiAgICogICAgIHJldHVybiAtKE1hdGguY29zKE1hdGguUEkgKiBwKSAtIDEpIC8gMjtcbiAgICogICB9O1xuICAgKiB9O1xuICAgKi9cbiAgZ2V0VHJhbnNpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIC0oTWF0aC5jb3MoTWF0aC5QSSAqIHApIC0gMSkgLyAyO1xuICAgIH07XG4gIH0sXG5cbiAgc3RlcDogZnVuY3Rpb24gKG5vdykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZnJhbWVTa2lwKSB7XG4gICAgICB2YXIgZGlmZiA9IHRoaXMudGltZSAhPSBudWxsID8gbm93IC0gdGhpcy50aW1lIDogMDtcbiAgICAgIHZhciBmcmFtZXMgPSBkaWZmIC8gdGhpcy5mcmFtZUludGVydmFsO1xuICAgICAgdGhpcy50aW1lID0gbm93O1xuICAgICAgdGhpcy5mcmFtZSArPSBmcmFtZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJhbWUgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mcmFtZSA8IHRoaXMuZnJhbWVzKSB7XG4gICAgICB2YXIgZGVsdGEgPSB0aGlzLnRyYW5zaXRpb24odGhpcy5mcmFtZSAvIHRoaXMuZnJhbWVzKTtcbiAgICAgIHRoaXMuc2V0KHRoaXMuY29tcHV0ZSh0aGlzLmZyb20sIHRoaXMudG8sIGRlbHRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJhbWUgPSB0aGlzLmZyYW1lcztcbiAgICAgIHRoaXMuc2V0KHRoaXMuY29tcHV0ZSh0aGlzLmZyb20sIHRoaXMudG8sIDEpKTtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICog6K6+572u5b2T5YmN5Yqo55S75bin55qE6L+H5rih5pWw5YC8XG4gICAqIEBpbnRlcmZhY2UgRngjc2V0XG4gICAqIEBtZW1iZXJvZiBGeFxuICAgKiBAcGFyYW0ge051bWJlcn0gbm93IOW9k+WJjeWKqOeUu+W4p+eahOi/h+a4oeaVsOWAvFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc2V0ID0gZnVuY3Rpb24gKG5vdykge1xuICAgKiAgIG5vZGUuc3R5bGUubWFyZ2luTGVmdCA9IG5vdyArICdweCc7XG4gICAqIH07XG4gICAqL1xuICBzZXQ6IGZ1bmN0aW9uIChub3cpIHtcbiAgICByZXR1cm4gbm93O1xuICB9LFxuXG4gIGNvbXB1dGU6IGZ1bmN0aW9uIChmcm9tLCB0bywgZGVsdGEpIHtcbiAgICByZXR1cm4gRnguY29tcHV0ZShmcm9tLCB0bywgZGVsdGEpO1xuICB9LFxuXG4gIGNoZWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5saW5rID09PSAnY2FuY2VsJykge1xuICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOW8gOWni+aJp+ihjOWKqOeUu1xuICAgKiBAbWV0aG9kIEZ4I3N0YXJ0XG4gICAqIEBtZW1iZXJvZiBGeFxuICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbSDliqjnlLvlvIDlp4vmlbDlgLxcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRvIOWKqOeUu+e7k+adn+aVsOWAvFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTsgLy8g5byA5aeL5Yqo55S7XG4gICAqL1xuICBzdGFydDogZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrKGZyb20sIHRvKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMuZnJvbSA9IGZyb207XG4gICAgdGhpcy50byA9IHRvO1xuICAgIHRoaXMuZnJhbWUgPSB0aGlzLm9wdGlvbnMuZnJhbWVTa2lwID8gMCA6IC0xO1xuICAgIHRoaXMudGltZSA9IG51bGw7XG4gICAgdGhpcy50cmFuc2l0aW9uID0gdGhpcy5nZXRUcmFuc2l0aW9uKCk7XG4gICAgdmFyIGZyYW1lcyA9IHRoaXMub3B0aW9ucy5mcmFtZXM7XG4gICAgdmFyIGZwcyA9IHRoaXMub3B0aW9ucy5mcHM7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5vcHRpb25zLmR1cmF0aW9uO1xuICAgIHRoaXMuZHVyYXRpb24gPSBGeC5EdXJhdGlvbnNbZHVyYXRpb25dIHx8IHBhcnNlSW50KGR1cmF0aW9uLCAxMCkgfHwgMDtcbiAgICB0aGlzLmZyYW1lSW50ZXJ2YWwgPSAxMDAwIC8gZnBzO1xuICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzIHx8IE1hdGgucm91bmQodGhpcy5kdXJhdGlvbiAvIHRoaXMuZnJhbWVJbnRlcnZhbCk7XG4gICAgdGhpcy50cmlnZ2VyKCdzdGFydCcpO1xuICAgIHB1c2hJbnN0YW5jZS5jYWxsKHRoaXMsIGZwcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOWBnOatouWKqOeUu1xuICAgKiBAbWV0aG9kIEZ4I3N0b3BcbiAgICogQG1lbWJlcm9mIEZ4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5zdG9wKCk7IC8vIOeri+WIu+WBnOatouWKqOeUu1xuICAgKi9cbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICB0aGlzLnRpbWUgPSBudWxsO1xuICAgICAgcHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgICBpZiAodGhpcy5mcmFtZXMgPT09IHRoaXMuZnJhbWUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21wbGV0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzdG9wJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDlj5bmtojliqjnlLtcbiAgICogQG1ldGhvZCBGeCNjYW5jZWxcbiAgICogQG1lbWJlcm9mIEZ4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5jYW5jZWwoKTsgLy8g56uL5Yi75Y+W5raI5Yqo55S7XG4gICAqL1xuICBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1J1bm5pbmcoKSkge1xuICAgICAgdGhpcy50aW1lID0gbnVsbDtcbiAgICAgIHB1bGxJbnN0YW5jZS5jYWxsKHRoaXMsIHRoaXMub3B0aW9ucy5mcHMpO1xuICAgICAgdGhpcy5mcmFtZSA9IHRoaXMuZnJhbWVzO1xuICAgICAgdGhpcy50cmlnZ2VyKCdjYW5jZWwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOaaguWBnOWKqOeUu1xuICAgKiBAbWV0aG9kIEZ4I3BhdXNlXG4gICAqIEBtZW1iZXJvZiBGeFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTtcbiAgICogZngucGF1c2UoKTsgLy8g56uL5Yi75pqC5YGc5Yqo55S7XG4gICAqL1xuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICB0aGlzLnRpbWUgPSBudWxsO1xuICAgICAgcHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnu6fnu63miafooYzliqjnlLtcbiAgICogQG1ldGhvZCBGeCNyZXN1bWVcbiAgICogQG1lbWJlcm9mIEZ4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5wYXVzZSgpO1xuICAgKiBmeC5yZXN1bWUoKTsgLy8g56uL5Yi757un57ut5Yqo55S7XG4gICAqL1xuICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5mcmFtZSA8IHRoaXMuZnJhbWVzICYmICF0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICBwdXNoSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOWIpOaWreWKqOeUu+aYr+WQpuato+WcqOi/kOihjFxuICAgKiBAbWV0aG9kIEZ4I2lzUnVubmluZ1xuICAgKiBAbWVtYmVyb2YgRnhcbiAgICogQHJldHVybnMge0Jvb2xlYW59IOWKqOeUu+aYr+WQpuato+WcqOi/kOihjFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTtcbiAgICogZngucGF1c2UoKTtcbiAgICogZnguaXNSdW5uaW5nKCk7IC8vIGZhbHNlXG4gICAqL1xuICBpc1J1bm5pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGlzdCA9IGluc3RhbmNlc1t0aGlzLm9wdGlvbnMuZnBzXTtcbiAgICByZXR1cm4gbGlzdCAmJiAkY29udGFpbnMobGlzdCwgdGhpcyk7XG4gIH0sXG59KTtcblxuJGV2ZW50cy5taXhUbyhGeCk7XG5cbkZ4LmNvbXB1dGUgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIGRlbHRhKSB7XG4gIHJldHVybiAodG8gLSBmcm9tKSAqIGRlbHRhICsgZnJvbTtcbn07XG5cbkZ4LkR1cmF0aW9ucyA9IHsgc2hvcnQ6IDI1MCwgbm9ybWFsOiA1MDAsIGxvbmc6IDEwMDAgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBGeDtcbiIsIi8qKlxuICogIyDliqjnlLvkuqTkupLnm7jlhbPlt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL2Z4XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9meFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5meC5zbW9vdGhTY3JvbGxUbyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9meFxuICogdmFyICRmeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meCcpO1xuICogY29uc29sZS5pbmZvKCRmeC5zbW9vdGhTY3JvbGxUbyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3Ntb290aFNjcm9sbFRvJyk7XG4gKi9cblxuZXhwb3J0cy5lYXNpbmcgPSByZXF1aXJlKCcuL2Vhc2luZycpO1xuZXhwb3J0cy5mbGFzaEFjdGlvbiA9IHJlcXVpcmUoJy4vZmxhc2hBY3Rpb24nKTtcbmV4cG9ydHMuRnggPSByZXF1aXJlKCcuL2Z4Jyk7XG5leHBvcnRzLnNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnLi9zbW9vdGhTY3JvbGxUbycpO1xuZXhwb3J0cy5zdGlja3kgPSByZXF1aXJlKCcuL3N0aWNreScpO1xuZXhwb3J0cy50aW1lciA9IHJlcXVpcmUoJy4vdGltZXInKTtcbmV4cG9ydHMudHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuL3RyYW5zaXRpb25zJyk7XG4iLCIvKipcbiAqIOW5s+a7kea7muWKqOWIsOafkOS4quWFg+e0oO+8jOWPqui/m+ihjOWeguebtOaWueWQkeeahOa7muWKqFxuICogLSByZXF1aXJlcyBqUXVlcnkvWmVwdG9cbiAqIEBtZXRob2Qgc21vb3RoU2Nyb2xsVG9cbiAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIOebruagh0RPTeWFg+e0oFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6YCJ6aG5XG4gKiBAcGFyYW0ge051bWJlcn0gW3NwZWMuZGVsdGE9MF0g55uu5qCH5rua5Yqo5L2N572u5LiO55uu5qCH5YWD57Sg6aG26YOo55qE6Ze06Led77yM5Y+v5Lul5Li66LSf5YC8XG4gKiBAcGFyYW0ge051bWJlcn0gW3NwZWMubWF4RGVsYXk9MzAwMF0g5Yqo55S75omn6KGM5pe26Ze06ZmQ5Yi2KG1zKe+8jOWKqOeUu+aJp+ihjOi2hei/h+atpOaXtumXtOWImeebtOaOpeWBnOatou+8jOeri+WIu+a7muWKqOWIsOebruagh+S9jee9rlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuY2FsbGJhY2tdIOa7muWKqOWujOaIkOeahOWbnuiwg+WHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkc21vb3RoU2Nyb2xsVG8gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvc21vb3RoU2Nyb2xsVG8nKTtcbiAqIC8vIOa7muWKqOWIsOmhtemdoumhtuerr1xuICogJHNtb290aFNjcm9sbFRvKGRvY3VtZW50LmJvZHkpO1xuICovXG5cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG5mdW5jdGlvbiBzbW9vdGhTY3JvbGxUbyhub2RlLCBzcGVjKSB7XG4gIHZhciAkID0gd2luZG93LiQgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnk7XG5cbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICBkZWx0YTogMCxcbiAgICBtYXhEZWxheTogMzAwMCxcbiAgICBjYWxsYmFjazogbnVsbCxcbiAgfSwgc3BlYyk7XG5cbiAgdmFyIG9mZnNldCA9ICQobm9kZSkub2Zmc2V0KCk7XG4gIHZhciB0YXJnZXQgPSBvZmZzZXQudG9wICsgY29uZi5kZWx0YTtcbiAgdmFyIGNhbGxiYWNrID0gY29uZi5jYWxsYmFjaztcblxuICB2YXIgcHJldlN0ZXA7XG4gIHZhciBzdGF5Q291bnQgPSAzO1xuXG4gIHZhciB0aW1lciA9IG51bGw7XG5cbiAgdmFyIHN0b3BUaW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRhcmdldCk7XG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgZGVsdGEgPSBzVG9wIC0gdGFyZ2V0O1xuICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgIGRlbHRhID0gTWF0aC5mbG9vcihkZWx0YSAqIDAuOCk7XG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDApIHtcbiAgICAgIGRlbHRhID0gTWF0aC5jZWlsKGRlbHRhICogMC44KTtcbiAgICB9XG5cbiAgICB2YXIgc3RlcCA9IHRhcmdldCArIGRlbHRhO1xuICAgIGlmIChzdGVwID09PSBwcmV2U3RlcCkge1xuICAgICAgc3RheUNvdW50IC09IDE7XG4gICAgfVxuICAgIHByZXZTdGVwID0gc3RlcDtcblxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGVwKTtcblxuICAgIGlmIChzdGVwID09PSB0YXJnZXQgfHwgc3RheUNvdW50IDw9IDApIHtcbiAgICAgIHN0b3BUaW1lcigpO1xuICAgIH1cbiAgfSwgMTYpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHN0b3BUaW1lcigpO1xuICB9LCBjb25mLm1heERlbGF5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzbW9vdGhTY3JvbGxUbztcbiIsIi8qKlxuICogSU9TIHN0aWNreSDmlYjmnpwgcG9seWZpbGxcbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnm67moIdET03lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jbG9uZT10cnVlXSDmmK/lkKbliJvlu7rkuIDkuKogY2xvbmUg5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucGxhY2Vob2xkZXI9bnVsbF0gc3RpY2t5IOaViOaenOWQr+WKqOaXtueahOWNoOS9jSBkb20g5YWD57SgXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmRpc2FibGVBbmRyb2lkPWZhbHNlXSDmmK/lkKblnKggQW5kcm9pZCDkuIvlgZznlKggc3RpY2t5IOaViOaenFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9mZnNldFBhcmVudD1udWxsXSDmj5DkvpvkuIDkuKrnm7jlr7nlrprkvY3lhYPntKDmnaXljLnphY3mta7liqjml7bnmoTlrprkvY3moLflvI9cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdHlsZXM9e31dIOi/m+WFpSBzdGlja3kg54q25oCB5pe255qE5qC35byPXG4gKiBAZXhhbXBsZVxuICogdmFyICRzdGlja3kgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvZngvc3RpY2t5Jyk7XG4gKiAkc3RpY2t5KCQoJ2gxJykuZ2V0KDApKTtcbiAqL1xuXG5mdW5jdGlvbiBzdGlja3kobm9kZSwgb3B0aW9ucykge1xuICB2YXIgJCA9IHdpbmRvdy4kIHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5O1xuXG4gIHZhciAkd2luID0gJCh3aW5kb3cpO1xuICB2YXIgJGRvYyA9ICQoZG9jdW1lbnQpO1xuXG4gIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHZhciBpc0lPUyA9ICEhdWEubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC9pKTtcbiAgdmFyIGlzQW5kcm9pZCA9IHVhLmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHVhLmluZGV4T2YoJ0xpbnV4JykgPiAtMTtcblxuICB2YXIgdGhhdCA9IHt9O1xuICB0aGF0LmlzSU9TID0gaXNJT1M7XG4gIHRoYXQuaXNBbmRyb2lkID0gaXNBbmRyb2lkO1xuXG4gIHZhciBjb25mID0gJC5leHRlbmQoe1xuICAgIGNsb25lOiB0cnVlLFxuICAgIHBsYWNlaG9sZGVyOiBudWxsLFxuICAgIGRpc2FibGVBbmRyb2lkOiBmYWxzZSxcbiAgICBvZmZzZXRQYXJlbnQ6IG51bGwsXG4gICAgc3R5bGVzOiB7fSxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgdGhhdC5yb290ID0gJChub2RlKTtcblxuICBpZiAoIXRoYXQucm9vdC5nZXQoMCkpIHsgcmV0dXJuOyB9XG4gIHRoYXQub2Zmc2V0UGFyZW50ID0gdGhhdC5yb290Lm9mZnNldFBhcmVudCgpO1xuXG4gIGlmIChjb25mLm9mZnNldFBhcmVudCkge1xuICAgIHRoYXQub2Zmc2V0UGFyZW50ID0gJChjb25mLm9mZnNldFBhcmVudCk7XG4gIH1cblxuICBpZiAoIXRoYXQub2Zmc2V0UGFyZW50WzBdKSB7XG4gICAgdGhhdC5vZmZzZXRQYXJlbnQgPSAkKGRvY3VtZW50LmJvZHkpO1xuICB9XG5cbiAgdGhhdC5pc1N0aWNreSA9IGZhbHNlO1xuXG4gIGlmIChjb25mLnBsYWNlaG9sZGVyKSB7XG4gICAgdGhhdC5wbGFjZWhvbGRlciA9ICQoY29uZi5wbGFjZWhvbGRlcik7XG4gIH0gZWxzZSB7XG4gICAgdGhhdC5wbGFjZWhvbGRlciA9ICQoJzxkaXYvPicpO1xuICB9XG5cbiAgaWYgKGNvbmYuY2xvbmUpIHtcbiAgICB0aGF0LmNsb25lID0gdGhhdC5yb290LmNsb25lKCk7XG4gICAgdGhhdC5jbG9uZS5hcHBlbmRUbyh0aGF0LnBsYWNlaG9sZGVyKTtcbiAgfVxuXG4gIHRoYXQucGxhY2Vob2xkZXIuY3NzKHtcbiAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyxcbiAgfSk7XG5cbiAgdGhhdC5zdGlja3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGF0LmlzU3RpY2t5KSB7XG4gICAgICB0aGF0LmlzU3RpY2t5ID0gdHJ1ZTtcbiAgICAgIHRoYXQucm9vdC5jc3MoJ3Bvc2l0aW9uJywgJ2ZpeGVkJyk7XG4gICAgICB0aGF0LnJvb3QuY3NzKGNvbmYuc3R5bGVzKTtcbiAgICAgIHRoYXQucGxhY2Vob2xkZXIuaW5zZXJ0QmVmb3JlKHRoYXQucm9vdCk7XG4gICAgfVxuICB9O1xuXG4gIHRoYXQudW5TdGlja3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoYXQuaXNTdGlja3kpIHtcbiAgICAgIHRoYXQuaXNTdGlja3kgPSBmYWxzZTtcbiAgICAgIHRoYXQucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG4gICAgICB0aGF0LnJvb3QuY3NzKCdwb3NpdGlvbicsICcnKTtcbiAgICAgICQuZWFjaChjb25mLnN0eWxlcywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB0aGF0LnJvb3QuY3NzKGtleSwgJycpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvcmlnT2Zmc2V0WSA9IHRoYXQucm9vdC5nZXQoMCkub2Zmc2V0VG9wO1xuICB0aGF0LmNoZWNrU2Nyb2xsWSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoYXQuaXNTdGlja3kpIHtcbiAgICAgIG9yaWdPZmZzZXRZID0gdGhhdC5yb290LmdldCgwKS5vZmZzZXRUb3A7XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbFkgPSAwO1xuICAgIGlmICh0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2Nyb2xsWSA9IHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKS5zY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFkgPiBvcmlnT2Zmc2V0WSkge1xuICAgICAgdGhhdC5zdGlja3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC51blN0aWNreSgpO1xuICAgIH1cblxuICAgIGlmICh0aGF0LmlzU3RpY2t5KSB7XG4gICAgICB0aGF0LnJvb3QuY3NzKHtcbiAgICAgICAgd2lkdGg6IHRoYXQucGxhY2Vob2xkZXIud2lkdGgoKSArICdweCcsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5yb290LmNzcyh7XG4gICAgICAgIHdpZHRoOiAnJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB0aGF0LmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzQW5kcm9pZCAmJiBjb25mLmRpc2FibGVBbmRyb2lkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0lPUyAmJiB0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIC8vIElPUzkrIOaUr+aMgSBwb3NpdGlvbjpzdGlja3kg5bGe5oCnXG4gICAgICB0aGF0LnJvb3QuY3NzKCdwb3NpdGlvbicsICdzdGlja3knKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5LiA6Iis5rWP6KeI5Zmo55u05o6l5pSv5oyBXG4gICAgICBpZiAodGhhdC5vZmZzZXRQYXJlbnQuZ2V0KDApID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICR3aW4ub24oJ3Njcm9sbCcsIHRoYXQuY2hlY2tTY3JvbGxZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQub2Zmc2V0UGFyZW50Lm9uKCdzY3JvbGwnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG4gICAgICB9XG5cbiAgICAgICR3aW4ub24oJ3Jlc2l6ZScsIHRoYXQuY2hlY2tTY3JvbGxZKTtcbiAgICAgICRkb2Mub24oJ3RvdWNoc3RhcnQnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG4gICAgICAkZG9jLm9uKCd0b3VjaG1vdmUnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG4gICAgICAkZG9jLm9uKCd0b3VjaGVuZCcsIHRoYXQuY2hlY2tTY3JvbGxZKTtcbiAgICAgIHRoYXQuY2hlY2tTY3JvbGxZKCk7XG4gICAgfVxuICB9O1xuXG4gIHRoYXQuaW5pdCgpO1xuICByZXR1cm4gdGhhdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGlja3k7XG4iLCIvKipcbiAqIOeUqCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg5YyF6KOF5a6a5pe25ZmoXG4gKiAtIOWmguaenOa1j+iniOWZqOS4jeaUr+aMgSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQVBJ77yM5YiZ5L2/55SoIEJPTSDljp/mnKznmoTlrprml7blmahBUElcbiAqIEBtb2R1bGUgdGltZXJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHRpbWVyID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3RpbWVyJyk7XG4gKiAkdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnb3V0cHV0IHRoaXMgbG9nIGFmdGVyIDEwMDBtcycpO1xuICogfSwgMTAwMCk7XG4gKi9cblxudmFyIFRpbWVyID0ge307XG5cbnZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbmZ1bmN0aW9uIGZhY3RvcnkobWV0aG9kTmFtZSkge1xuICB2YXIgd3JhcHBlZE1ldGhvZCA9IG51bGw7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgLy8g5aaC5p6c5pyJ5a+55bqU5ZCN56ew55qE5pa55rOV77yM55u05o6l6L+U5Zue6K+l5pa55rOV77yM5ZCm5YiZ6L+U5Zue5bim5pyJ5a+55bqU5rWP6KeI5Zmo5YmN57yA55qE5pa55rOVXG4gIHZhciBnZXRQcmVmaXhNZXRob2QgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciB1cEZpcnN0TmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKTtcbiAgICB2YXIgbWV0aG9kID0gd2luW25hbWVdXG4gICAgICB8fCB3aW5bJ3dlYmtpdCcgKyB1cEZpcnN0TmFtZV1cbiAgICAgIHx8IHdpblsnbW96JyArIHVwRmlyc3ROYW1lXVxuICAgICAgfHwgd2luWydvJyArIHVwRmlyc3ROYW1lXVxuICAgICAgfHwgd2luWydtcycgKyB1cEZpcnN0TmFtZV07XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBtZXRob2QuYmluZCh3aW4pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICB2YXIgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBnZXRQcmVmaXhNZXRob2QoJ3JlcXVlc3RBbmltYXRpb25GcmFtZScpO1xuICB2YXIgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSA9IGdldFByZWZpeE1ldGhvZCgnY2FuY2VsQW5pbWF0aW9uRnJhbWUnKSB8fCBub29wO1xuXG4gIGlmIChsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIHZhciBjbGVhclRpbWVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgaWYgKG9iai5yZXF1ZXN0SWQgJiYgdHlwZW9mIG9iai5zdGVwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9iai5zdGVwID0gbm9vcDtcbiAgICAgICAgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZShvYmoucmVxdWVzdElkKTtcbiAgICAgICAgb2JqLnJlcXVlc3RJZCA9IDA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzZXRUaW1lciA9IGZ1bmN0aW9uIChmbiwgZGVsYXksIHR5cGUpIHtcbiAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcbiAgICAgIGRlbGF5ID0gTWF0aC5tYXgoZGVsYXksIDApO1xuICAgICAgb2JqLnN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAobm93IC0gdGltZSA+IGRlbGF5KSB7XG4gICAgICAgICAgZm4oKTtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVyKG9iaik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWUgPSBub3c7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iai5yZXF1ZXN0SWQgPSBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZShvYmouc3RlcCk7XG4gICAgICB9O1xuICAgICAgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUob2JqLnN0ZXApO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgaWYgKG1ldGhvZE5hbWUgPT09ICdzZXRJbnRlcnZhbCcpIHtcbiAgICAgIHdyYXBwZWRNZXRob2QgPSBmdW5jdGlvbiAoZm4sIGRlbGF5KSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lcihmbiwgZGVsYXksICdpbnRlcnZhbCcpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1ldGhvZE5hbWUgPT09ICdzZXRUaW1lb3V0Jykge1xuICAgICAgd3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uIChmbiwgZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVyKGZuLCBkZWxheSwgJ3RpbWVvdXQnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnY2xlYXJUaW1lb3V0Jykge1xuICAgICAgd3JhcHBlZE1ldGhvZCA9IGNsZWFyVGltZXI7XG4gICAgfSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnY2xlYXJJbnRlcnZhbCcpIHtcbiAgICAgIHdyYXBwZWRNZXRob2QgPSBjbGVhclRpbWVyO1xuICAgIH1cbiAgfVxuXG4gIGlmICghd3JhcHBlZE1ldGhvZCAmJiB0aGlzW21ldGhvZE5hbWVdKSB7XG4gICAgd3JhcHBlZE1ldGhvZCA9IHRoaXNbbWV0aG9kTmFtZV0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiB3cmFwcGVkTWV0aG9kO1xufVxuXG4vKipcbiAqIOiuvue9rumHjeWkjeiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lci5zZXRJbnRlcnZhbFxuICogQG1lbWJlcm9mIHRpbWVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDlrprml7bph43lpI3osIPnlKjnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF0g6YeN5aSN6LCD55So55qE6Ze06ZqU5pe26Ze0KG1zKVxuICogQHJldHVybnMge09iamVjdH0g5a6a5pe25Zmo5a+56LGh77yM5Y+v5Lyg5YWlIGNsZWFySW50ZXJ2YWwg5pa55rOV5p2l57uI5q2i6L+Z5Liq5a6a5pe25ZmoXG4gKi9cblRpbWVyLnNldEludGVydmFsID0gZmFjdG9yeSgnc2V0SW50ZXJ2YWwnKTtcblxuLyoqXG4gKiDmuIXpmaTph43lpI3osIPnlKjlrprml7blmahcbiAqIEBtZXRob2QgdGltZXIuY2xlYXJJbnRlcnZhbFxuICogQG1lbWJlcm9mIHRpbWVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIOWumuaXtuWZqOWvueixoVxuICovXG5UaW1lci5jbGVhckludGVydmFsID0gZmFjdG9yeSgnY2xlYXJJbnRlcnZhbCcpO1xuXG4vKipcbiAqIOiuvue9ruW7tuaXtuiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lci5zZXRUaW1lb3V0XG4gKiBAbWVtYmVyb2YgdGltZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOW7tuaXtuiwg+eUqOeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXSDlu7bml7bosIPnlKjnmoTpl7TpmpTml7bpl7QobXMpXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlrprml7blmajlr7nosaHvvIzlj6/kvKDlhaUgY2xlYXJUaW1lb3V0IOaWueazleadpee7iOatoui/meS4quWumuaXtuWZqFxuICovXG5UaW1lci5zZXRUaW1lb3V0ID0gZmFjdG9yeSgnc2V0VGltZW91dCcpO1xuXG4vKipcbiAqIOa4hemZpOW7tuaXtuiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lci5jbGVhclRpbWVvdXRcbiAqIEBtZW1iZXJvZiB0aW1lclxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDlrprml7blmajlr7nosaFcbiAqL1xuVGltZXIuY2xlYXJUaW1lb3V0ID0gZmFjdG9yeSgnY2xlYXJUaW1lb3V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1taXhlZC1vcGVyYXRvcnMgKi9cbi8qKlxuICog5Yqo55S76L+Q6KGM5pa55byP5bqTXG4gKiAtIFBvd1xuICogLSBFeHBvXG4gKiAtIENpcmNcbiAqIC0gU2luZVxuICogLSBCYWNrXG4gKiAtIEJvdW5jZVxuICogLSBFbGFzdGljXG4gKiAtIFF1YWRcbiAqIC0gQ3ViaWNcbiAqIC0gUXVhcnRcbiAqIC0gUXVpbnRcbiAqIEBtb2R1bGUgdHJhbnNpdGlvbnNcbiAqIEBzZWUgaHR0cHM6Ly9tb290b29scy5uZXQvY29yZS9kb2NzLzEuNi4wL0Z4L0Z4LlRyYW5zaXRpb25zI0Z4LVRyYW5zaXRpb25zXG4gKiBAZXhhbXBsZVxuICogdmFyICRmeCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9meCcpO1xuICogdmFyICR0cmFuc2l0aW9ucyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9meC90cmFuc2l0aW9ucycpO1xuICogbmV3ICRmeCh7XG4gKiAgIHRyYW5zaXRpb24gOiAkdHJhbnNpdGlvbnMuU2luZS5lYXNlSW5PdXRcbiAqIH0pO1xuICogbmV3ICRmeCh7XG4gKiAgIHRyYW5zaXRpb24gOiAnU2luZTpJbidcbiAqIH0pO1xuICogbmV3ICRmeCh7XG4gKiAgIHRyYW5zaXRpb24gOiAnU2luZTpJbjpPdXQnXG4gKiB9KTtcbiAqL1xuXG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbnZhciAkZnggPSByZXF1aXJlKCcuL2Z4Jyk7XG5cbiRmeC5UcmFuc2l0aW9uID0gZnVuY3Rpb24gKHRyYW5zaXRpb24sIHBhcmFtcykge1xuICBpZiAoJHR5cGUocGFyYW1zKSAhPT0gJ2FycmF5Jykge1xuICAgIHBhcmFtcyA9IFtwYXJhbXNdO1xuICB9XG4gIHZhciBlYXNlSW4gPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgcmV0dXJuIHRyYW5zaXRpb24ocG9zLCBwYXJhbXMpO1xuICB9O1xuICByZXR1cm4gJGFzc2lnbihlYXNlSW4sIHtcbiAgICBlYXNlSW46IGVhc2VJbixcbiAgICBlYXNlT3V0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gMSAtIHRyYW5zaXRpb24oMSAtIHBvcywgcGFyYW1zKTtcbiAgICB9LFxuICAgIGVhc2VJbk91dDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgKHBvcyA8PSAwLjVcbiAgICAgICAgICA/IHRyYW5zaXRpb24oMiAqIHBvcywgcGFyYW1zKVxuICAgICAgICAgIDogMiAtIHRyYW5zaXRpb24oMiAqICgxIC0gcG9zKSwgcGFyYW1zKSkgLyAyXG4gICAgICApO1xuICAgIH0sXG4gIH0pO1xufTtcblxudmFyIFRyYW5zaXRpb25zID0ge1xuICBsaW5lYXI6IGZ1bmN0aW9uICh6ZXJvKSB7XG4gICAgcmV0dXJuIHplcm87XG4gIH0sXG59O1xuXG5UcmFuc2l0aW9ucy5leHRlbmQgPSBmdW5jdGlvbiAodHJhbnNpdGlvbnMpIHtcbiAgT2JqZWN0LmtleXModHJhbnNpdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICBUcmFuc2l0aW9uc1t0cmFuc2l0aW9uXSA9IG5ldyAkZnguVHJhbnNpdGlvbih0cmFuc2l0aW9uc1t0cmFuc2l0aW9uXSk7XG4gIH0pO1xufTtcblxuVHJhbnNpdGlvbnMuZXh0ZW5kKHtcbiAgUG93OiBmdW5jdGlvbiAocCwgeCkge1xuICAgIHJldHVybiBNYXRoLnBvdyhwLCAoeCAmJiB4WzBdKSB8fCA2KTtcbiAgfSxcblxuICBFeHBvOiBmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiBNYXRoLnBvdygyLCA4ICogKHAgLSAxKSk7XG4gIH0sXG5cbiAgQ2lyYzogZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gMSAtIE1hdGguc2luKE1hdGguYWNvcyhwKSk7XG4gIH0sXG5cbiAgU2luZTogZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gMSAtIE1hdGguY29zKHAgKiBNYXRoLlBJIC8gMik7XG4gIH0sXG5cbiAgQmFjazogZnVuY3Rpb24gKHAsIHgpIHtcbiAgICB4ID0gKHggJiYgeFswXSkgfHwgMS42MTg7XG4gICAgcmV0dXJuIE1hdGgucG93KHAsIDIpICogKCh4ICsgMSkgKiBwIC0geCk7XG4gIH0sXG5cbiAgQm91bmNlOiBmdW5jdGlvbiAocCkge1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgYSA9IDA7XG4gICAgdmFyIGIgPSAxO1xuICAgIHdoaWxlIChwIDwgKDcgLSA0ICogYSkgLyAxMSkge1xuICAgICAgdmFsdWUgPSBiICogYiAtIE1hdGgucG93KCgxMSAtIDYgKiBhIC0gMTEgKiBwKSAvIDQsIDIpO1xuICAgICAgYSArPSBiO1xuICAgICAgYiAvPSAyO1xuICAgIH1cbiAgICB2YWx1ZSA9IGIgKiBiIC0gTWF0aC5wb3coKDExIC0gNiAqIGEgLSAxMSAqIHApIC8gNCwgMik7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuXG4gIEVsYXN0aWM6IGZ1bmN0aW9uIChwLCB4KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wbHVzcGx1c1xuICAgICAgTWF0aC5wb3coMiwgMTAgKiAtLXApXG4gICAgICAqIE1hdGguY29zKDIwICogcCAqIE1hdGguUEkgKiAoKHggJiYgeFswXSkgfHwgMSkgLyAzKVxuICAgICk7XG4gIH0sXG59KTtcblxuWydRdWFkJywgJ0N1YmljJywgJ1F1YXJ0JywgJ1F1aW50J10uZm9yRWFjaChmdW5jdGlvbiAodHJhbnNpdGlvbiwgaSkge1xuICBUcmFuc2l0aW9uc1t0cmFuc2l0aW9uXSA9IG5ldyAkZnguVHJhbnNpdGlvbihmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiBNYXRoLnBvdyhwLCBpICsgMik7XG4gIH0pO1xufSk7XG5cbiRmeC5zdGF0aWNzKHtcbiAgZ2V0VHJhbnNpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFucyA9IHRoaXMub3B0aW9ucy50cmFuc2l0aW9uIHx8IFRyYW5zaXRpb25zLlNpbmUuZWFzZUluT3V0O1xuICAgIGlmICh0eXBlb2YgdHJhbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgZGF0YSA9IHRyYW5zLnNwbGl0KCc6Jyk7XG4gICAgICB0cmFucyA9IFRyYW5zaXRpb25zO1xuICAgICAgdHJhbnMgPSB0cmFuc1tkYXRhWzBdXSB8fCB0cmFuc1tkYXRhWzBdXTtcbiAgICAgIGlmIChkYXRhWzFdKSB7XG4gICAgICAgIHRyYW5zID0gdHJhbnNbJ2Vhc2UnICsgZGF0YVsxXSArIChkYXRhWzJdID8gZGF0YVsyXSA6ICcnKV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cmFucztcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zaXRpb25zO1xuIiwiLyoqXG4gKiBhamF4IOivt+axguaWueazle+8jOS9v+eUqOaWueW8j+S4jiBqUXVlcnksIFplcHRvIOexu+S8vO+8jOWvuSBqUXVlcnksIFplcHRvIOaXoOS+nei1llxuICogQG1ldGhvZCBhamF4XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Gb3JiZXNMaW5kZXNheS9hamF4XG4gKiBAZXhhbXBsZVxuICogdmFyICRhamF4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2lvL2FqYXgnKTtcbiAqIGRvY3VtZW50LmRvbWFpbiA9ICdxcS5jb20nO1xuICogJGFqYXgoe1xuICogICB1cmw6ICdodHRwOi8vYS5xcS5jb20vZm9ybScsXG4gKiAgIGRhdGE6IFt7XG4gKiAgICAgbjE6ICd2MScsXG4gKiAgICAgbjI6ICd2MidcbiAqICAgfV0sXG4gKiAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChycykge1xuICogICAgIGNvbnNvbGUuaW5mbyhycyk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbnZhciB0eXBlID0gcmVxdWlyZSgnLi4vb2JqL3R5cGUnKVxuXG52YXIganNvbnBJRCA9IDAsXG4gICAga2V5LFxuICAgIG5hbWUsXG4gICAgcnNjcmlwdCA9IC88c2NyaXB0XFxiW148XSooPzooPyE8XFwvc2NyaXB0Pik8W148XSopKjxcXC9zY3JpcHQ+L2dpLFxuICAgIHNjcmlwdFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC9qYXZhc2NyaXB0L2ksXG4gICAgeG1sVHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL3htbC9pLFxuICAgIGpzb25UeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIGh0bWxUeXBlID0gJ3RleHQvaHRtbCcsXG4gICAgYmxhbmtSRSA9IC9eXFxzKiQvXG5cbnZhciBhamF4ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgdmFyIHNldHRpbmdzID0gZXh0ZW5kKHt9LCBvcHRpb25zIHx8IHt9KVxuICBmb3IgKGtleSBpbiBhamF4LnNldHRpbmdzKSBpZiAoc2V0dGluZ3Nba2V5XSA9PT0gdW5kZWZpbmVkKSBzZXR0aW5nc1trZXldID0gYWpheC5zZXR0aW5nc1trZXldXG5cbiAgYWpheFN0YXJ0KHNldHRpbmdzKVxuXG4gIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIHNldHRpbmdzLmNyb3NzRG9tYWluID0gL14oW1xcdy1dKzopP1xcL1xcLyhbXlxcL10rKS8udGVzdChzZXR0aW5ncy51cmwpICYmXG4gICAgUmVnRXhwLiQyICE9IHdpbmRvdy5sb2NhdGlvbi5ob3N0XG5cbiAgdmFyIGRhdGFUeXBlID0gc2V0dGluZ3MuZGF0YVR5cGUsIGhhc1BsYWNlaG9sZGVyID0gLz1cXD8vLnRlc3Qoc2V0dGluZ3MudXJsKVxuICBpZiAoZGF0YVR5cGUgPT0gJ2pzb25wJyB8fCBoYXNQbGFjZWhvbGRlcikge1xuICAgIGlmICghaGFzUGxhY2Vob2xkZXIpIHNldHRpbmdzLnVybCA9IGFwcGVuZFF1ZXJ5KHNldHRpbmdzLnVybCwgJ2NhbGxiYWNrPT8nKVxuICAgIHJldHVybiBhamF4LkpTT05QKHNldHRpbmdzKVxuICB9XG5cbiAgaWYgKCFzZXR0aW5ncy51cmwpIHNldHRpbmdzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpXG4gIHNlcmlhbGl6ZURhdGEoc2V0dGluZ3MpXG5cbiAgdmFyIG1pbWUgPSBzZXR0aW5ncy5hY2NlcHRzW2RhdGFUeXBlXSxcbiAgICAgIGJhc2VIZWFkZXJzID0geyB9LFxuICAgICAgcHJvdG9jb2wgPSAvXihbXFx3LV0rOilcXC9cXC8vLnRlc3Qoc2V0dGluZ3MudXJsKSA/IFJlZ0V4cC4kMSA6IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCxcbiAgICAgIHhociA9IGFqYXguc2V0dGluZ3MueGhyKCksIGFib3J0VGltZW91dFxuXG4gIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIGJhc2VIZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnXG4gIGlmIChtaW1lKSB7XG4gICAgYmFzZUhlYWRlcnNbJ0FjY2VwdCddID0gbWltZVxuICAgIGlmIChtaW1lLmluZGV4T2YoJywnKSA+IC0xKSBtaW1lID0gbWltZS5zcGxpdCgnLCcsIDIpWzBdXG4gICAgeGhyLm92ZXJyaWRlTWltZVR5cGUgJiYgeGhyLm92ZXJyaWRlTWltZVR5cGUobWltZSlcbiAgfVxuICBpZiAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgKHNldHRpbmdzLmRhdGEgJiYgc2V0dGluZ3MudHlwZS50b1VwcGVyQ2FzZSgpICE9ICdHRVQnKSlcbiAgICBiYXNlSGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gIHNldHRpbmdzLmhlYWRlcnMgPSBleHRlbmQoYmFzZUhlYWRlcnMsIHNldHRpbmdzLmhlYWRlcnMgfHwge30pXG5cbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXG4gICAgICB2YXIgcmVzdWx0LCBlcnJvciA9IGZhbHNlXG4gICAgICBpZiAoKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHx8IHhoci5zdGF0dXMgPT0gMzA0IHx8ICh4aHIuc3RhdHVzID09IDAgJiYgcHJvdG9jb2wgPT0gJ2ZpbGU6JykpIHtcbiAgICAgICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBtaW1lVG9EYXRhVHlwZSh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKVxuICAgICAgICByZXN1bHQgPSB4aHIucmVzcG9uc2VUZXh0XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoZGF0YVR5cGUgPT0gJ3NjcmlwdCcpICAgICgxLGV2YWwpKHJlc3VsdClcbiAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PSAneG1sJykgIHJlc3VsdCA9IHhoci5yZXNwb25zZVhNTFxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICdqc29uJykgcmVzdWx0ID0gYmxhbmtSRS50ZXN0KHJlc3VsdCkgPyBudWxsIDogSlNPTi5wYXJzZShyZXN1bHQpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgZXJyb3IgPSBlIH1cblxuICAgICAgICBpZiAoZXJyb3IpIGFqYXhFcnJvcihlcnJvciwgJ3BhcnNlcmVycm9yJywgeGhyLCBzZXR0aW5ncylcbiAgICAgICAgZWxzZSBhamF4U3VjY2VzcyhyZXN1bHQsIHhociwgc2V0dGluZ3MpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhamF4RXJyb3IobnVsbCwgJ2Vycm9yJywgeGhyLCBzZXR0aW5ncylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgYXN5bmMgPSAnYXN5bmMnIGluIHNldHRpbmdzID8gc2V0dGluZ3MuYXN5bmMgOiB0cnVlXG4gIHhoci5vcGVuKHNldHRpbmdzLnR5cGUsIHNldHRpbmdzLnVybCwgYXN5bmMpXG5cbiAgZm9yIChuYW1lIGluIHNldHRpbmdzLmhlYWRlcnMpIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHNldHRpbmdzLmhlYWRlcnNbbmFtZV0pXG5cbiAgaWYgKGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpID09PSBmYWxzZSkge1xuICAgIHhoci5hYm9ydCgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAoc2V0dGluZ3MudGltZW91dCA+IDApIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBlbXB0eVxuICAgICAgeGhyLmFib3J0KClcbiAgICAgIGFqYXhFcnJvcihudWxsLCAndGltZW91dCcsIHhociwgc2V0dGluZ3MpXG4gICAgfSwgc2V0dGluZ3MudGltZW91dClcblxuICAvLyBhdm9pZCBzZW5kaW5nIGVtcHR5IHN0cmluZyAoIzMxOSlcbiAgeGhyLnNlbmQoc2V0dGluZ3MuZGF0YSA/IHNldHRpbmdzLmRhdGEgOiBudWxsKVxuICByZXR1cm4geGhyXG59XG5cblxuLy8gdHJpZ2dlciBhIGN1c3RvbSBldmVudCBhbmQgcmV0dXJuIGZhbHNlIGlmIGl0IHdhcyBjYW5jZWxsZWRcbmZ1bmN0aW9uIHRyaWdnZXJBbmRSZXR1cm4oY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XG4gIC8vdG9kbzogRmlyZSBvZmYgc29tZSBldmVudHNcbiAgLy92YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50TmFtZSlcbiAgLy8kKGNvbnRleHQpLnRyaWdnZXIoZXZlbnQsIGRhdGEpXG4gIHJldHVybiB0cnVlOy8vIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWRcbn1cblxuLy8gdHJpZ2dlciBhbiBBamF4IFwiZ2xvYmFsXCIgZXZlbnRcbmZ1bmN0aW9uIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xuICBpZiAoc2V0dGluZ3MuZ2xvYmFsKSByZXR1cm4gdHJpZ2dlckFuZFJldHVybihjb250ZXh0IHx8IGRvY3VtZW50LCBldmVudE5hbWUsIGRhdGEpXG59XG5cbi8vIE51bWJlciBvZiBhY3RpdmUgQWpheCByZXF1ZXN0c1xuYWpheC5hY3RpdmUgPSAwXG5cbmZ1bmN0aW9uIGFqYXhTdGFydChzZXR0aW5ncykge1xuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmIGFqYXguYWN0aXZlKysgPT09IDApIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RhcnQnKVxufVxuZnVuY3Rpb24gYWpheFN0b3Aoc2V0dGluZ3MpIHtcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiAhKC0tYWpheC5hY3RpdmUpKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0b3AnKVxufVxuXG4vLyB0cmlnZ2VycyBhbiBleHRyYSBnbG9iYWwgZXZlbnQgXCJhamF4QmVmb3JlU2VuZFwiIHRoYXQncyBsaWtlIFwiYWpheFNlbmRcIiBidXQgY2FuY2VsYWJsZVxuZnVuY3Rpb24gYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgaWYgKHNldHRpbmdzLmJlZm9yZVNlbmQuY2FsbChjb250ZXh0LCB4aHIsIHNldHRpbmdzKSA9PT0gZmFsc2UgfHxcbiAgICAgIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4QmVmb3JlU2VuZCcsIFt4aHIsIHNldHRpbmdzXSkgPT09IGZhbHNlKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4U2VuZCcsIFt4aHIsIHNldHRpbmdzXSlcbn1cbmZ1bmN0aW9uIGFqYXhTdWNjZXNzKGRhdGEsIHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0LCBzdGF0dXMgPSAnc3VjY2VzcydcbiAgc2V0dGluZ3Muc3VjY2Vzcy5jYWxsKGNvbnRleHQsIGRhdGEsIHN0YXR1cywgeGhyKVxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFN1Y2Nlc3MnLCBbeGhyLCBzZXR0aW5ncywgZGF0YV0pXG4gIGFqYXhDb21wbGV0ZShzdGF0dXMsIHhociwgc2V0dGluZ3MpXG59XG4vLyB0eXBlOiBcInRpbWVvdXRcIiwgXCJlcnJvclwiLCBcImFib3J0XCIsIFwicGFyc2VyZXJyb3JcIlxuZnVuY3Rpb24gYWpheEVycm9yKGVycm9yLCB0eXBlLCB4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICBzZXR0aW5ncy5lcnJvci5jYWxsKGNvbnRleHQsIHhociwgdHlwZSwgZXJyb3IpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4RXJyb3InLCBbeGhyLCBzZXR0aW5ncywgZXJyb3JdKVxuICBhamF4Q29tcGxldGUodHlwZSwgeGhyLCBzZXR0aW5ncylcbn1cbi8vIHN0YXR1czogXCJzdWNjZXNzXCIsIFwibm90bW9kaWZpZWRcIiwgXCJlcnJvclwiLCBcInRpbWVvdXRcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcbmZ1bmN0aW9uIGFqYXhDb21wbGV0ZShzdGF0dXMsIHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIHNldHRpbmdzLmNvbXBsZXRlLmNhbGwoY29udGV4dCwgeGhyLCBzdGF0dXMpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4Q29tcGxldGUnLCBbeGhyLCBzZXR0aW5nc10pXG4gIGFqYXhTdG9wKHNldHRpbmdzKVxufVxuXG4vLyBFbXB0eSBmdW5jdGlvbiwgdXNlZCBhcyBkZWZhdWx0IGNhbGxiYWNrXG5mdW5jdGlvbiBlbXB0eSgpIHt9XG5cbmFqYXguSlNPTlAgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgaWYgKCEoJ3R5cGUnIGluIG9wdGlvbnMpKSByZXR1cm4gYWpheChvcHRpb25zKVxuXG4gIHZhciBjYWxsYmFja05hbWUgPSAnanNvbnAnICsgKCsranNvbnBJRCksXG4gICAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG4gICAgYWJvcnQgPSBmdW5jdGlvbigpe1xuICAgICAgLy90b2RvOiByZW1vdmUgc2NyaXB0XG4gICAgICAvLyQoc2NyaXB0KS5yZW1vdmUoKVxuICAgICAgaWYgKGNhbGxiYWNrTmFtZSBpbiB3aW5kb3cpIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZW1wdHlcbiAgICAgIGFqYXhDb21wbGV0ZSgnYWJvcnQnLCB4aHIsIG9wdGlvbnMpXG4gICAgfSxcbiAgICB4aHIgPSB7IGFib3J0OiBhYm9ydCB9LCBhYm9ydFRpbWVvdXQsXG4gICAgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXVxuICAgICAgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cbiAgaWYgKG9wdGlvbnMuZXJyb3IpIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgeGhyLmFib3J0KClcbiAgICBvcHRpb25zLmVycm9yKClcbiAgfVxuXG4gIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgY2xlYXJUaW1lb3V0KGFib3J0VGltZW91dClcbiAgICAgIC8vdG9kbzogcmVtb3ZlIHNjcmlwdFxuICAgICAgLy8kKHNjcmlwdCkucmVtb3ZlKClcbiAgICBkZWxldGUgd2luZG93W2NhbGxiYWNrTmFtZV1cbiAgICBhamF4U3VjY2VzcyhkYXRhLCB4aHIsIG9wdGlvbnMpXG4gIH1cblxuICBzZXJpYWxpemVEYXRhKG9wdGlvbnMpXG4gIHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybC5yZXBsYWNlKC89XFw/LywgJz0nICsgY2FsbGJhY2tOYW1lKVxuXG4gIC8vIFVzZSBpbnNlcnRCZWZvcmUgaW5zdGVhZCBvZiBhcHBlbmRDaGlsZCB0byBjaXJjdW12ZW50IGFuIElFNiBidWcuXG4gIC8vIFRoaXMgYXJpc2VzIHdoZW4gYSBiYXNlIG5vZGUgaXMgdXNlZCAoc2VlIGpRdWVyeSBidWdzICMyNzA5IGFuZCAjNDM3OCkuXG4gIGhlYWQuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgaGVhZC5maXJzdENoaWxkKTtcblxuICBpZiAob3B0aW9ucy50aW1lb3V0ID4gMCkgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgeGhyLmFib3J0KClcbiAgICAgIGFqYXhDb21wbGV0ZSgndGltZW91dCcsIHhociwgb3B0aW9ucylcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQpXG5cbiAgcmV0dXJuIHhoclxufVxuXG5hamF4LnNldHRpbmdzID0ge1xuICAvLyBEZWZhdWx0IHR5cGUgb2YgcmVxdWVzdFxuICB0eXBlOiAnR0VUJyxcbiAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBiZWZvcmUgcmVxdWVzdFxuICBiZWZvcmVTZW5kOiBlbXB0eSxcbiAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkc1xuICBzdWNjZXNzOiBlbXB0eSxcbiAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCB0aGUgdGhlIHNlcnZlciBkcm9wcyBlcnJvclxuICBlcnJvcjogZW1wdHksXG4gIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgb24gcmVxdWVzdCBjb21wbGV0ZSAoYm90aDogZXJyb3IgYW5kIHN1Y2Nlc3MpXG4gIGNvbXBsZXRlOiBlbXB0eSxcbiAgLy8gVGhlIGNvbnRleHQgZm9yIHRoZSBjYWxsYmFja3NcbiAgY29udGV4dDogbnVsbCxcbiAgLy8gV2hldGhlciB0byB0cmlnZ2VyIFwiZ2xvYmFsXCIgQWpheCBldmVudHNcbiAgZ2xvYmFsOiB0cnVlLFxuICAvLyBUcmFuc3BvcnRcbiAgeGhyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKVxuICB9LFxuICAvLyBNSU1FIHR5cGVzIG1hcHBpbmdcbiAgYWNjZXB0czoge1xuICAgIHNjcmlwdDogJ3RleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCcsXG4gICAganNvbjogICBqc29uVHlwZSxcbiAgICB4bWw6ICAgICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJyxcbiAgICBodG1sOiAgIGh0bWxUeXBlLFxuICAgIHRleHQ6ICAgJ3RleHQvcGxhaW4nXG4gIH0sXG4gIC8vIFdoZXRoZXIgdGhlIHJlcXVlc3QgaXMgdG8gYW5vdGhlciBkb21haW5cbiAgY3Jvc3NEb21haW46IGZhbHNlLFxuICAvLyBEZWZhdWx0IHRpbWVvdXRcbiAgdGltZW91dDogMFxufVxuXG5mdW5jdGlvbiBtaW1lVG9EYXRhVHlwZShtaW1lKSB7XG4gIHJldHVybiBtaW1lICYmICggbWltZSA9PSBodG1sVHlwZSA/ICdodG1sJyA6XG4gICAgbWltZSA9PSBqc29uVHlwZSA/ICdqc29uJyA6XG4gICAgc2NyaXB0VHlwZVJFLnRlc3QobWltZSkgPyAnc2NyaXB0JyA6XG4gICAgeG1sVHlwZVJFLnRlc3QobWltZSkgJiYgJ3htbCcgKSB8fCAndGV4dCdcbn1cblxuZnVuY3Rpb24gYXBwZW5kUXVlcnkodXJsLCBxdWVyeSkge1xuICByZXR1cm4gKHVybCArICcmJyArIHF1ZXJ5KS5yZXBsYWNlKC9bJj9dezEsMn0vLCAnPycpXG59XG5cbi8vIHNlcmlhbGl6ZSBwYXlsb2FkIGFuZCBhcHBlbmQgaXQgdG8gdGhlIFVSTCBmb3IgR0VUIHJlcXVlc3RzXG5mdW5jdGlvbiBzZXJpYWxpemVEYXRhKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGUob3B0aW9ucy5kYXRhKSA9PT0gJ29iamVjdCcpIG9wdGlvbnMuZGF0YSA9IHBhcmFtKG9wdGlvbnMuZGF0YSlcbiAgaWYgKG9wdGlvbnMuZGF0YSAmJiAoIW9wdGlvbnMudHlwZSB8fCBvcHRpb25zLnR5cGUudG9VcHBlckNhc2UoKSA9PSAnR0VUJykpXG4gICAgb3B0aW9ucy51cmwgPSBhcHBlbmRRdWVyeShvcHRpb25zLnVybCwgb3B0aW9ucy5kYXRhKVxufVxuXG5hamF4LmdldCA9IGZ1bmN0aW9uKHVybCwgc3VjY2Vzcyl7IHJldHVybiBhamF4KHsgdXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3MgfSkgfVxuXG5hamF4LnBvc3QgPSBmdW5jdGlvbih1cmwsIGRhdGEsIHN1Y2Nlc3MsIGRhdGFUeXBlKXtcbiAgaWYgKHR5cGUoZGF0YSkgPT09ICdmdW5jdGlvbicpIGRhdGFUeXBlID0gZGF0YVR5cGUgfHwgc3VjY2Vzcywgc3VjY2VzcyA9IGRhdGEsIGRhdGEgPSBudWxsXG4gIHJldHVybiBhamF4KHsgdHlwZTogJ1BPU1QnLCB1cmw6IHVybCwgZGF0YTogZGF0YSwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6IGRhdGFUeXBlIH0pXG59XG5cbmFqYXguZ2V0SlNPTiA9IGZ1bmN0aW9uKHVybCwgc3VjY2Vzcyl7XG4gIHJldHVybiBhamF4KHsgdXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGFUeXBlOiAnanNvbicgfSlcbn1cblxudmFyIGVzY2FwZSA9IGVuY29kZVVSSUNvbXBvbmVudFxuXG5mdW5jdGlvbiBzZXJpYWxpemUocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsLCBzY29wZSl7XG4gIHZhciBhcnJheSA9IHR5cGUob2JqKSA9PT0gJ2FycmF5JztcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgaWYgKHNjb3BlKSBrZXkgPSB0cmFkaXRpb25hbCA/IHNjb3BlIDogc2NvcGUgKyAnWycgKyAoYXJyYXkgPyAnJyA6IGtleSkgKyAnXSdcbiAgICAvLyBoYW5kbGUgZGF0YSBpbiBzZXJpYWxpemVBcnJheSgpIGZvcm1hdFxuICAgIGlmICghc2NvcGUgJiYgYXJyYXkpIHBhcmFtcy5hZGQodmFsdWUubmFtZSwgdmFsdWUudmFsdWUpXG4gICAgLy8gcmVjdXJzZSBpbnRvIG5lc3RlZCBvYmplY3RzXG4gICAgZWxzZSBpZiAodHJhZGl0aW9uYWwgPyAodHlwZSh2YWx1ZSkgPT09ICdhcnJheScpIDogKHR5cGUodmFsdWUpID09PSAnb2JqZWN0JykpXG4gICAgICBzZXJpYWxpemUocGFyYW1zLCB2YWx1ZSwgdHJhZGl0aW9uYWwsIGtleSlcbiAgICBlbHNlIHBhcmFtcy5hZGQoa2V5LCB2YWx1ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJhbShvYmosIHRyYWRpdGlvbmFsKXtcbiAgdmFyIHBhcmFtcyA9IFtdXG4gIHBhcmFtcy5hZGQgPSBmdW5jdGlvbihrLCB2KXsgdGhpcy5wdXNoKGVzY2FwZShrKSArICc9JyArIGVzY2FwZSh2KSkgfVxuICBzZXJpYWxpemUocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsKVxuICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKCclMjAnLCAnKycpXG59XG5cbmZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQpIHtcbiAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuICBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpXG4gICAgICBpZiAoc291cmNlW2tleV0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICB9KVxuICByZXR1cm4gdGFyZ2V0XG59XG4iLCIvKipcbiAqIOWKoOi9vSBzY3JpcHQg5paH5Lu2XG4gKiBAbWV0aG9kIGdldFNjcmlwdFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5zcmMgc2NyaXB0IOWcsOWdgFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNoYXJzZXQ9J3V0Zi04J10gc2NyaXB0IOe8lueggVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25Mb2FkXSBzY3JpcHQg5Yqg6L295a6M5oiQ55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRTY3JpcHQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0Jyk7XG4gKiAkZ2V0U2NyaXB0KHtcbiAqICAgc3JjOiAnaHR0cHM6Ly9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTMuMy4xLm1pbi5qcycsXG4gKiAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICogICAgIGNvbnNvbGUuaW5mbyh3aW5kb3cualF1ZXJ5KTtcbiAqICAgfVxuICogfSk7XG4gKi9cblxuZnVuY3Rpb24gZ2V0U2NyaXB0KG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHNyYyA9IG9wdGlvbnMuc3JjIHx8ICcnO1xuICB2YXIgY2hhcnNldCA9IG9wdGlvbnMuY2hhcnNldCB8fCAnJztcbiAgdmFyIG9uTG9hZCA9IG9wdGlvbnMub25Mb2FkIHx8IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LmFzeW5jID0gJ2FzeW5jJztcbiAgc2NyaXB0LnNyYyA9IHNyYztcblxuICBpZiAoY2hhcnNldCkge1xuICAgIHNjcmlwdC5jaGFyc2V0ID0gY2hhcnNldDtcbiAgfVxuICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnJlYWR5U3RhdGVcbiAgICAgIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCdcbiAgICAgIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuICAgICkge1xuICAgICAgaWYgKHR5cGVvZiBvbkxvYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb25Mb2FkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ubG9hZCA9IG51bGw7XG4gICAgICB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgfVxuICB9O1xuICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICByZXR1cm4gc2NyaXB0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFNjcmlwdDtcbiIsIi8qKlxuICog5bCB6KOFIGlmcmFtZSBwb3N0IOaooeW8j1xuICogLSByZXF1aXJlcyBqUXVlcnkvWmVwdG9cbiAqIEBtZXRob2QgaWZyYW1lUG9zdFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6K+35rGC6YCJ6aG5XG4gKiBAcGFyYW0ge09iamVjdH0gW3NwZWMuZm9ybT1udWxsXSDopoHor7fmsYLnmoTooajljZVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnVybCDor7fmsYLlnLDlnYBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBzcGVjLmRhdGEg6K+35rGC5pWw5o2uXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMudGFyZ2V0PScnXSDnm67moIcgaWZyYW1lIOWQjeensFxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLm1ldGhvZD0ncG9zdCddIOivt+axguaWueW8j1xuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmFjY2VwdENoYXJzZXQ9JyddIOivt+axguebruagh+eahOe8lueggVxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmpzb25wPSdjYWxsYmFjayddIOS8oOmAkue7meaOpeWPo+eahOWbnuiwg+WPguaVsOWQjeensFxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmpzb25wTWV0aG9kPScnXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlj4LmlbDnmoTkvKDpgJLmlrnlvI/vvIzlj6/pgIlbJ3Bvc3QnLCAnZ2V0J11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucENhbGxiYWNrPScnXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlh73mlbDlkI3np7DvvIzpu5jorqToh6rliqjnlJ/miJBcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucEFkZFBhcmVudD0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Ye95pWw5ZCN56ew6ZyA6KaB6ZmE5bim55qE5YmN57yA6LCD55So6Lev5b6EXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5jb21wbGV0ZV0g6I635b6X5pWw5o2u55qE5Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5zdWNjZXNzXSDmiJDlip/ojrflvpfmlbDmja7nmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGlmcmFtZVBvc3QgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8vaWZyYW1lUG9zdCcpO1xuICogZG9jdW1lbnQuZG9tYWluID0gJ3FxLmNvbSc7XG4gKiBpZnJhbWVQb3N0KHtcbiAqICAgdXJsOiAnaHR0cDovL2EucXEuY29tL2Zvcm0nLFxuICogICBkYXRhOiBbe1xuICogICAgIG4xOiAndjEnLFxuICogICAgIG4yOiAndjInXG4gKiAgIH1dLFxuICogICBzdWNjZXNzOiBmdW5jdGlvbiAocnMpIHtcbiAqICAgICBjb25zb2xlLmluZm8ocnMpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgaGlkZGVuRGl2ID0gbnVsbDtcblxuZnVuY3Rpb24gZ2V0JCgpIHtcbiAgdmFyICQ7XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICQgPSB3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bztcbiAgfVxuICBpZiAoISQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgd2luZGRvdy4kIGxpa2UgalF1ZXJ5IG9yIFplcHRvLicpO1xuICB9XG4gIHJldHVybiAkO1xufVxuXG5mdW5jdGlvbiBnZXRIaWRkZW5Cb3goKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICBpZiAoaGlkZGVuRGl2ID09PSBudWxsKSB7XG4gICAgaGlkZGVuRGl2ID0gJCgnPGRpdi8+JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICBoaWRkZW5EaXYuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gIH1cbiAgcmV0dXJuIGhpZGRlbkRpdjtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9ybSgpIHtcbiAgdmFyICQgPSBnZXQkKCk7XG4gIHZhciBmb3JtID0gJCgnPGZvcm0gc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+PC9mb3JtPicpO1xuICBmb3JtLmFwcGVuZFRvKGdldEhpZGRlbkJveCgpKTtcbiAgcmV0dXJuIGZvcm07XG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlbklucHV0KGZvcm0sIG5hbWUpIHtcbiAgdmFyICQgPSBnZXQkKCk7XG4gIHZhciBpbnB1dCA9ICQoZm9ybSkuZmluZCgnW25hbWU9XCInICsgbmFtZSArICdcIl0nKTtcbiAgaWYgKCFpbnB1dC5nZXQoMCkpIHtcbiAgICBpbnB1dCA9ICQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIicgKyBuYW1lICsgJ1wiIHZhbHVlPVwiXCIvPicpO1xuICAgIGlucHV0LmFwcGVuZFRvKGZvcm0pO1xuICB9XG4gIHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gZ2V0SWZyYW1lKG5hbWUpIHtcbiAgdmFyICQgPSBnZXQkKCk7XG4gIHZhciBodG1sID0gW1xuICAgICc8aWZyYW1lJyxcbiAgICAnaWQ9XCInICsgbmFtZSArICdcIiAnLFxuICAgICduYW1lPVwiJyArIG5hbWUgKyAnXCInLFxuICAgICdzcmM9XCJhYm91dDpibGFua1wiJyxcbiAgICAnc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+PC9pZnJhbWU+JyxcbiAgXS5qb2luKCcgJyk7XG4gIHZhciBpZnJhbWUgPSAkKGh0bWwpO1xuICBpZnJhbWUuYXBwZW5kVG8oZ2V0SGlkZGVuQm94KCkpO1xuICByZXR1cm4gaWZyYW1lO1xufVxuXG5mdW5jdGlvbiBpZnJhbWVQb3N0KHNwZWMpIHtcbiAgdmFyICQgPSBnZXQkKCk7XG4gIHZhciBjb25mID0gJC5leHRlbmQoe1xuICAgIGZvcm06IG51bGwsXG4gICAgdXJsOiAnJyxcbiAgICBkYXRhOiBbXSxcbiAgICB0YXJnZXQ6ICcnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGFjY2VwdENoYXJzZXQ6ICcnLFxuICAgIGpzb25wOiAnY2FsbGJhY2snLFxuICAgIGpzb25wTWV0aG9kOiAnJyxcbiAgICBqc29ucENhbGxiYWNrOiAnJyxcbiAgICBqc29ucEFkZFBhcmVudDogJycsXG4gICAgY29tcGxldGU6ICQubm9vcCxcbiAgICBzdWNjZXNzOiAkLm5vb3AsXG4gIH0sIHNwZWMpO1xuXG4gIHZhciB0aGF0ID0ge307XG4gIHRoYXQudXJsID0gY29uZi51cmw7XG5cbiAgdGhhdC5qc29ucCA9IGNvbmYuanNvbnAgfHwgJ2NhbGxiYWNrJztcbiAgdGhhdC5tZXRob2QgPSBjb25mLm1ldGhvZCB8fCAncG9zdCc7XG4gIHRoYXQuanNvbnBNZXRob2QgPSAkLnR5cGUoY29uZi5qc29ucE1ldGhvZCkgPT09ICdzdHJpbmcnXG4gICAgPyBjb25mLmpzb25wTWV0aG9kLnRvTG93ZXJDYXNlKClcbiAgICA6ICcnO1xuXG4gIHZhciBmb3JtID0gJChjb25mLmZvcm0pO1xuICBpZiAoIWZvcm0ubGVuZ3RoKSB7XG4gICAgZm9ybSA9IGdldEZvcm0oKTtcblxuICAgIHZhciBodG1sID0gW107XG4gICAgaWYgKCQuaXNBcnJheShjb25mLmRhdGEpKSB7XG4gICAgICAkLmVhY2goY29uZi5kYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbnB1dEh0bWwgPSBbXG4gICAgICAgICAgJzxpbnB1dCcsXG4gICAgICAgICAgJ3R5cGU9XCJoaWRkZW5cIicsXG4gICAgICAgICAgJ25hbWU9XCInICsgaXRlbS5uYW1lICsgJ1wiJyxcbiAgICAgICAgICAndmFsdWU9XCInICsgaXRlbS52YWx1ZSArICdcIj4nLFxuICAgICAgICBdLmpvaW4oJyAnKTtcbiAgICAgICAgaHRtbC5wdXNoKGlucHV0SHRtbCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCQuaXNQbGFpbk9iamVjdChjb25mLmRhdGEpKSB7XG4gICAgICAkLmVhY2goY29uZi5kYXRhLCBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGlucHV0SHRtbCA9IFtcbiAgICAgICAgICAnPGlucHV0JyxcbiAgICAgICAgICAndHlwZT1cImhpZGRlblwiJyxcbiAgICAgICAgICAnbmFtZT1cIicgKyBuYW1lICsgJ1wiJyxcbiAgICAgICAgICAndmFsdWU9XCInICsgdmFsdWUgKyAnXCI+JyxcbiAgICAgICAgXS5qb2luKCcgJyk7XG4gICAgICAgIGh0bWwucHVzaChpbnB1dEh0bWwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgICQoaHRtbC5qb2luKCcnKSkuYXBwZW5kVG8oZm9ybSk7XG4gIH1cbiAgdGhhdC5mb3JtID0gZm9ybTtcbiAgdGhhdC5jb25mID0gY29uZjtcblxuICB2YXIgdGltZVN0YW1wID0gK25ldyBEYXRlKCk7XG4gIHZhciBpZnJhbWVOYW1lID0gJ2lmcmFtZScgKyB0aW1lU3RhbXA7XG5cbiAgdGhhdC50aW1lU3RhbXAgPSB0aW1lU3RhbXA7XG4gIHRoYXQuaWZyYW1lTmFtZSA9IGlmcmFtZU5hbWU7XG5cbiAgaWYgKGNvbmYuYWNjZXB0Q2hhcnNldCkge1xuICAgIGZvcm0uYXR0cignYWNjZXB0LWNoYXJzZXQnLCBjb25mLmFjY2VwdENoYXJzZXQpO1xuICAgIHRoYXQuYWNjZXB0Q2hhcnNldCA9IGNvbmYuYWNjZXB0Q2hhcnNldDtcbiAgfVxuXG4gIHZhciBpZnJhbWUgPSBudWxsO1xuICB2YXIgdGFyZ2V0ID0gJyc7XG4gIGlmIChjb25mLnRhcmdldCkge1xuICAgIHRhcmdldCA9IGNvbmYudGFyZ2V0O1xuICAgIGlmIChbJ19ibGFuaycsICdfc2VsZicsICdfcGFyZW50JywgJ190b3AnXS5pbmRleE9mKGNvbmYudGFyZ2V0KSA8IDApIHtcbiAgICAgIGlmcmFtZSA9ICQoJ2lmcmFtZVtuYW1lPVwiJyArIGNvbmYudGFyZ2V0ICsgJ1wiXScpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSBpZnJhbWVOYW1lO1xuICAgIGlmcmFtZSA9IGdldElmcmFtZShpZnJhbWVOYW1lKTtcbiAgfVxuICBmb3JtLmF0dHIoJ3RhcmdldCcsIHRhcmdldCk7XG4gIHRoYXQudGFyZ2V0ID0gdGFyZ2V0O1xuICB0aGF0LmlmcmFtZSA9IGlmcmFtZTtcblxuICB2YXIganNvbnBDYWxsYmFjayA9IGNvbmYuanNvbnBDYWxsYmFjayB8fCAnaWZyYW1lQ2FsbGJhY2snICsgdGltZVN0YW1wO1xuICB0aGF0Lmpzb25wQ2FsbGJhY2sgPSBqc29ucENhbGxiYWNrO1xuXG4gIGlmICghdGhhdC5qc29ucE1ldGhvZCB8fCB0aGF0Lmpzb25wTWV0aG9kID09PSAncG9zdCcpIHtcbiAgICB2YXIgaW5wdXQgPSBnZXRIaWRkZW5JbnB1dChmb3JtLCB0aGF0Lmpzb25wKTtcbiAgICBpbnB1dC52YWwoY29uZi5qc29ucEFkZFBhcmVudCArIGpzb25wQ2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKHRoYXQuanNvbnBNZXRob2QgPT09ICdnZXQnKSB7XG4gICAgdGhhdC51cmwgPSB0aGF0LnVybFxuICAgICAgKyAodGhhdC51cmwuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpXG4gICAgICArIHRoYXQuanNvbnBcbiAgICAgICsgJz0nXG4gICAgICArIGpzb25wQ2FsbGJhY2s7XG4gIH1cblxuICBpZiAoIWNvbmYuanNvbnBDYWxsYmFjaykge1xuICAgIHRoYXQuY2FsbGJhY2sgPSBmdW5jdGlvbiAocnMpIHtcbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oY29uZi5jb21wbGV0ZSkpIHtcbiAgICAgICAgY29uZi5jb21wbGV0ZShycywgdGhhdCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oY29uZi5zdWNjZXNzKSkge1xuICAgICAgICBjb25mLnN1Y2Nlc3MocnMsIHRoYXQsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aW5kb3dbanNvbnBDYWxsYmFja10gPSB0aGF0LmNhbGxiYWNrO1xuICB9XG5cbiAgZm9ybS5hdHRyKHtcbiAgICBhY3Rpb246IHRoYXQudXJsLFxuICAgIG1ldGhvZDogdGhhdC5tZXRob2QsXG4gIH0pO1xuXG4gIGZvcm0uc3VibWl0KCk7XG5cbiAgcmV0dXJuIHRoYXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWZyYW1lUG9zdDtcbiIsIi8qKlxuICogIyDlpITnkIbnvZHnu5zkuqTkupJcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL2lvXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9pb1xuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5pby5nZXRTY3JpcHQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvaW9cbiAqIHZhciAkaW8gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvaW8nKTtcbiAqIGNvbnNvbGUuaW5mbygkaW8uZ2V0U2NyaXB0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZ2V0U2NyaXB0ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2lvL2dldFNjcmlwdCcpO1xuICovXG5cbmV4cG9ydHMuYWpheCA9IHJlcXVpcmUoJy4vYWpheCcpO1xuZXhwb3J0cy5nZXRTY3JpcHQgPSByZXF1aXJlKCcuL2dldFNjcmlwdCcpO1xuZXhwb3J0cy5pZnJhbWVQb3N0ID0gcmVxdWlyZSgnLi9pZnJhbWVQb3N0Jyk7XG5leHBvcnRzLmxvYWRTZGsgPSByZXF1aXJlKCcuL2xvYWRTZGsnKTtcbiIsInZhciAkYXNzaWduID0gcmVxdWlyZSgnbG9kYXNoL2Fzc2lnbicpO1xudmFyICRnZXQgPSByZXF1aXJlKCdsb2Rhc2gvZ2V0Jyk7XG52YXIgJGdldFNjcmlwdCA9IHJlcXVpcmUoJy4vZ2V0U2NyaXB0Jyk7XG5cbnZhciBwcm9wTmFtZSA9ICdTUE9SRV9TREtfUFJPTUlTRSc7XG52YXIgY2FjaGUgPSBudWxsO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgY2FjaGUgPSB3aW5kb3dbcHJvcE5hbWVdO1xuICBpZiAoIWNhY2hlKSB7XG4gICAgY2FjaGUgPSB7fTtcbiAgICB3aW5kb3dbcHJvcE5hbWVdID0gY2FjaGU7XG4gIH1cbn0gZWxzZSB7XG4gIGNhY2hlID0ge307XG59XG5cbi8qKlxuICogc2RrIOWKoOi9vee7n+S4gOWwgeijhVxuICogLSDlpJrmrKHosIPnlKjkuI3kvJrlj5Hotbfph43lpI3or7fmsYJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubmFtZSBzZGsg5YWo5bGA5Y+Y6YeP5ZCN56ewXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgc2NyaXB0IOWcsOWdgFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNoYXJzZXQ9J3V0Zi04J10gc2NyaXB0IOe8lueggVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25Mb2FkXSBzY3JpcHQg5Yqg6L295a6M5oiQ55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRsb2FkU2RrID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2lvL2xvYWRTZGsnKTtcbiAqICRsb2FkU2RrKHtcbiAqICAgbmFtZTogJ1RlbmNlbnRDYXB0Y2hhJyxcbiAqICAgdXJsOiAnaHR0cHM6Ly9zc2wuY2FwdGNoYS5xcS5jb20vVENhcHRjaGEuanMnXG4gKiB9KS50aGVuKFRlbmNlbnRDYXB0Y2hhID0+IHt9KVxuICovXG52YXIgbG9hZFNkayA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgbmFtZTogJycsXG4gICAgdXJsOiAnJyxcbiAgICBjaGFyc2V0OiAndXRmLTgnLFxuICB9LCBvcHRpb25zKTtcblxuICB2YXIgbmFtZSA9IGNvbmYubmFtZTtcbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmVxdWlyZSBwYXJhbWV0ZXI6IG9wdGlvbnMubmFtZScpKTtcbiAgfVxuICBpZiAoIWNvbmYudXJsKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmVxdWlyZSBwYXJhbWV0ZXI6IG9wdGlvbnMudXJsJykpO1xuICB9XG5cbiAgdmFyIHBtID0gY2FjaGVbbmFtZV07XG4gIGlmIChwbSkge1xuICAgIGlmIChwbS5zZGspIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocG0uc2RrKTtcbiAgICB9XG4gICAgcmV0dXJuIHBtO1xuICB9XG5cbiAgcG0gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICRnZXRTY3JpcHQoe1xuICAgICAgc3JjOiBjb25mLnVybCxcbiAgICAgIGNoYXJzZXQ6IGNvbmYuY2hhcnNldCxcbiAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2RrID0gJGdldCh3aW5kb3csIG5hbWUpO1xuICAgICAgICBwbS5zZGsgPSBzZGs7XG4gICAgICAgIHJlc29sdmUoc2RrKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICBjYWNoZVtuYW1lXSA9IHBtO1xuXG4gIHJldHVybiBwbTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZFNkaztcbiIsIi8qKlxuICog6Kej5p6QIGxvY2F0aW9uLnNlYXJjaCDkuLrkuIDkuKpKU09O5a+56LGhXG4gKiAtIOaIluiAheiOt+WPluWFtuS4reafkOS4quWPguaVsFxuICogQG1ldGhvZCBnZXRRdWVyeVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkzlrZfnrKbkuLJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIOWPguaVsOWQjeensFxuICogQHJldHVybnMge09iamVjdHxTdHJpbmd9IHF1ZXJ55a+56LGhIHwg5Y+C5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRRdWVyeSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9nZXRRdWVyeScpO1xuICogdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0L3Byb2ZpbGU/YmVpamluZz1odWFueWluZ25pJztcbiAqIGNvbnNvbGUuaW5mbyggJGdldFF1ZXJ5KHVybCkgKTtcbiAqIC8vIHtiZWlqaW5nIDogJ2h1YW55aW5nbmknfVxuICogY29uc29sZS5pbmZvKCAkZ2V0UXVlcnkodXJsLCAnYmVpamluZycpICk7XG4gKiAvLyAnaHVhbnlpbmduaSdcbiAqL1xuXG52YXIgY2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gZ2V0UXVlcnkodXJsLCBuYW1lKSB7XG4gIHZhciBxdWVyeSA9IGNhY2hlW3VybF0gfHwge307XG5cbiAgaWYgKHVybCkge1xuICAgIHZhciBzZWFyY2hJbmRleCA9IHVybC5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKHNlYXJjaEluZGV4ID49IDApIHtcbiAgICAgIHZhciBzZWFyY2ggPSB1cmwuc2xpY2Uoc2VhcmNoSW5kZXggKyAxLCB1cmwubGVuZ3RoKTtcbiAgICAgIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKC8jLiovLCAnJyk7XG5cbiAgICAgIHZhciBwYXJhbXMgPSBzZWFyY2guc3BsaXQoJyYnKTtcbiAgICAgIHBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uIChncm91cCkge1xuICAgICAgICB2YXIgZXF1YWxJbmRleCA9IGdyb3VwLmluZGV4T2YoJz0nKTtcbiAgICAgICAgaWYgKGVxdWFsSW5kZXggPiAwKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGdyb3VwLnNsaWNlKDAsIGVxdWFsSW5kZXgpO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGdyb3VwLnNsaWNlKGVxdWFsSW5kZXggKyAxLCBncm91cC5sZW5ndGgpO1xuICAgICAgICAgIHF1ZXJ5W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGNhY2hlW3VybF0gPSBxdWVyeTtcbiAgfVxuXG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiBxdWVyeTtcbiAgfVxuICByZXR1cm4gcXVlcnlbbmFtZV0gfHwgJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UXVlcnk7XG4iLCIvKipcbiAqICMg5aSE55CG5Zyw5Z2A5a2X56ym5LiyXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvblxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbG9jYXRpb25cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQubG9jYXRpb24uZ2V0UXVlcnkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb25cbiAqIHZhciAkbG9jYXRpb24gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24nKTtcbiAqIGNvbnNvbGUuaW5mbygkbG9jYXRpb24uZ2V0UXVlcnkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRnZXRRdWVyeSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9nZXRRdWVyeScpO1xuICovXG5cbmV4cG9ydHMuZ2V0UXVlcnkgPSByZXF1aXJlKCcuL2dldFF1ZXJ5Jyk7XG5leHBvcnRzLnNldFF1ZXJ5ID0gcmVxdWlyZSgnLi9zZXRRdWVyeScpO1xuZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbiIsIi8qKlxuICog6Kej5p6QVVJM5Li65LiA5Liq5a+56LGhXG4gKiBAbWV0aG9kIHBhcnNlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFVSTOWtl+espuS4slxuICogQHJldHVybnMge09iamVjdH0gVVJM5a+56LGhXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bnNoaWZ0aW8vdXJsLXBhcnNlXG4gKiBAZXhhbXBsZVxuICogdmFyICRwYXJzZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZScpO1xuICogJHBhcnNlKCdodHRwOi8vbG9jYWxob3N0L3Byb2ZpbGU/YmVpamluZz1odWFueWluZ25pIzEyMycpO1xuICogLy8ge1xuICogLy8gICBzbGFzaGVzOiB0cnVlLFxuICogLy8gICBwcm90b2NvbDogJ2h0dHA6JyxcbiAqIC8vICAgaGFzaDogJyMxMjMnLFxuICogLy8gICBxdWVyeTogJz9iZWlqaW5nPWh1YW55aW5nbmknLFxuICogLy8gICBwYXRobmFtZTogJy9wcm9maWxlJyxcbiAqIC8vICAgYXV0aDogJ3VzZXJuYW1lOnBhc3N3b3JkJyxcbiAqIC8vICAgaG9zdDogJ2xvY2FsaG9zdDo4MDgwJyxcbiAqIC8vICAgcG9ydDogJzgwODAnLFxuICogLy8gICBob3N0bmFtZTogJ2xvY2FsaG9zdCcsXG4gKiAvLyAgIHBhc3N3b3JkOiAncGFzc3dvcmQnLFxuICogLy8gICB1c2VybmFtZTogJ3VzZXJuYW1lJyxcbiAqIC8vICAgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAqIC8vICAgaHJlZjogJ2h0dHA6Ly91c2VybmFtZTpwYXNzd29yZEBsb2NhbGhvc3Q6ODA4MC9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSMxMjMnXG4gKiAvLyB9XG4gKi9cblxudmFyIFVybCA9IHJlcXVpcmUoJ3VybC1wYXJzZScpO1xuXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgcmV0dXJuIG5ldyBVcmwodXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsIi8qKlxuICog5bCG5Y+C5pWw6K6+572u5YiwIGxvY2F0aW9uLnNlYXJjaCDkuIpcbiAqIEBtZXRob2Qgc2V0UXVlcnlcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJM5a2X56ym5LiyXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnkg5Y+C5pWw5a+56LGhXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDmi7zmjqXlpb3lj4LmlbDnmoRVUkzlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNldFF1ZXJ5ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL3NldFF1ZXJ5Jyk7XG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdCcpOyAvLyAnbG9jYWxob3N0J1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3QnLCB7YTogMX0pOyAvLyAnbG9jYWxob3N0P2E9MSdcbiAqICRzZXRRdWVyeSgnJywge2E6IDF9KTsgLy8gJz9hPTEnXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEnLCB7YTogMn0pOyAvLyAnbG9jYWxob3N0P2E9MidcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHthOiAnJ30pOyAvLyAnbG9jYWxob3N0P2E9J1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2E6IG51bGx9KTsgLy8gJ2xvY2FsaG9zdCdcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHtiOiAyfSk7IC8vICdsb2NhbGhvc3Q/YT0xJmI9MidcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0P2E9MSZiPTEnLCB7YTogMiwgYjogM30pOyAvLyAnbG9jYWxob3N0P2E9MiZiPTMnXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdCNhPTEnLCB7YTogMiwgYjogM30pOyAvLyAnbG9jYWxob3N0P2E9MiZiPTMjYT0xJ1xuICogJHNldFF1ZXJ5KCcjYT0xJywge2E6IDIsIGI6IDN9KTsgLy8gJz9hPTImYj0zI2E9MSdcbiAqL1xuXG5mdW5jdGlvbiBzZXRRdWVyeSh1cmwsIHF1ZXJ5KSB7XG4gIHVybCA9IHVybCB8fCAnJztcbiAgaWYgKCFxdWVyeSkgeyByZXR1cm4gdXJsOyB9XG5cbiAgdmFyIHJlZyA9IC8oW14/I10qKShcXD97MCwxfVtePyNdKikoI3swLDF9LiopLztcbiAgcmV0dXJuIHVybC5yZXBsYWNlKHJlZywgZnVuY3Rpb24gKG1hdGNoLCBwYXRoLCBzZWFyY2gsIGhhc2gpIHtcbiAgICBzZWFyY2ggPSBzZWFyY2ggfHwgJyc7XG4gICAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJyk7XG5cbiAgICB2YXIgcGFyYSA9IHNlYXJjaC5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbiAob2JqLCBwYWlyKSB7XG4gICAgICB2YXIgYXJyID0gcGFpci5zcGxpdCgnPScpO1xuICAgICAgaWYgKGFyclswXSkge1xuICAgICAgICBvYmpbYXJyWzBdXSA9IGFyclsxXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30pO1xuXG4gICAgT2JqZWN0LmtleXMocXVlcnkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gcXVlcnlba2V5XTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlbGV0ZSBwYXJhW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBwYXJhS2V5cyA9IE9iamVjdC5rZXlzKHBhcmEpO1xuICAgIGlmICghcGFyYUtleXMubGVuZ3RoKSB7XG4gICAgICBzZWFyY2ggPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoID0gJz8nICsgcGFyYUtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSArICc9JyArIHBhcmFba2V5XTtcbiAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aCArIHNlYXJjaCArIGhhc2g7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFF1ZXJ5O1xuIiwiLyoqXG4gKiDln7rnoYDlt6XljoLlhYPku7bnsbtcbiAqIC0g6K+l57G75re35ZCI5LqGIHNwb3JlLWtpdC9wYWNrYWdlcy9ldnQvZXZlbnRzIOeahOaWueazleOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAqIEBtb2R1bGUgQmFzZVxuICogQGV4YW1wbGVcbiAqIHZhciAkYmFzZSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvYmFzZScpO1xuICpcbiAqIHZhciBDaGlsZENsYXNzID0gJGJhc2UuZXh0ZW5kKHtcbiAqICAgZGVmYXVsdHMgOiB7XG4gKiAgICAgbm9kZSA6IG51bGxcbiAqICAgfSxcbiAqICAgYnVpbGQgOiBmdW5jdGlvbigpIHtcbiAqICAgICB0aGlzLm5vZGUgPSAkKHRoaXMuY29uZi5ub2RlKTtcbiAqICAgfSxcbiAqICAgc2V0RXZlbnRzIDogZnVuY3Rpb24oYWN0aW9uKSB7XG4gKiAgICAgdmFyIHByb3h5ID0gdGhpcy5wcm94eSgpO1xuICogICAgIHRoaXMubm9kZVthY3Rpb25dKCdjbGljaycsIHByb3h5KCdvbmNsaWNrJykpO1xuICogICB9LFxuICogICBvbmNsaWNrIDogZnVuY3Rpb24oKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKCdjbGlja2VkJyk7XG4gKiAgICAgdGhpcy50cmlnZ2VyKCdjbGljaycpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiB2YXIgb2JqID0gbmV3IENoaWxkQ2xhc3Moe1xuICogICBub2RlIDogZG9jdW1lbnQuYm9keVxuICogfSk7XG4gKlxuICogb2JqLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICogICBjb25zb2xlLmluZm8oJ29iaiBpcyBjbGlja2VkJyk7XG4gKiB9KTtcbiAqL1xuXG52YXIgJG1lcmdlID0gcmVxdWlyZSgnbG9kYXNoL21lcmdlJyk7XG52YXIgJG5vb3AgPSByZXF1aXJlKCdsb2Rhc2gvbm9vcCcpO1xudmFyICRpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzUGxhaW5PYmplY3QnKTtcbnZhciAkZXZlbnRzID0gcmVxdWlyZSgnLi4vZXZ0L2V2ZW50cycpO1xudmFyICRrbGFzcyA9IHJlcXVpcmUoJy4va2xhc3MnKTtcbnZhciAkcHJveHkgPSByZXF1aXJlKCcuL3Byb3h5Jyk7XG5cbnZhciBCYXNlID0gJGtsYXNzKHtcbiAgLyoqXG4gICAqIOexu+eahOm7mOiupOmAiemhueWvueixoe+8jOe7keWumuWcqOWOn+Wei+S4iu+8jOS4jeimgeWcqOWunuS+i+S4reebtOaOpeS/ruaUuei/meS4quWvueixoVxuICAgKiBAbmFtZSBCYXNlI2RlZmF1bHRzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBCYXNlXG4gICAqL1xuICBkZWZhdWx0czoge30sXG5cbiAgLyoqXG4gICAqIOexu+eahOWunumZhemAiemhue+8jHNldE9wdGlvbnMg5pa55rOV5Lya5L+u5pS56L+Z5Liq5a+56LGhXG4gICAqIEBuYW1lIEJhc2UjY29uZlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgQmFzZVxuICAgKi9cblxuICAvKipcbiAgICog5a2Y5pS+5Luj55CG5Ye95pWw55qE6ZuG5ZCIXG4gICAqIEBuYW1lIEJhc2UjYm91bmRcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIEJhc2VcbiAgICovXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5idWlsZCgpO1xuICAgIHRoaXMuc2V0RXZlbnRzKCdvbicpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmt7Hluqbmt7flkIjkvKDlhaXnmoTpgInpobnkuI7pu5jorqTpgInpobnvvIzmt7flkIjlrozmiJDnmoTpgInpobnlr7nosaHlj6/pgJrov4cgdGhpcy5jb25mIOWxnuaAp+iuv+mXrlxuICAgKiBAbWV0aG9kIEJhc2Ujc2V0T3B0aW9uc1xuICAgKiBAbWVtYmVyb2YgQmFzZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuICAgKi9cbiAgc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbmYgPSB0aGlzLmNvbmYgfHwgJG1lcmdlKHt9LCB0aGlzLmRlZmF1bHRzKTtcbiAgICBpZiAoISRpc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgICRtZXJnZSh0aGlzLmNvbmYsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDlhYPku7bliJ3lp4vljJbmjqXlj6Plh73mlbDvvIzlrp7kvovljJblhYPku7bml7bkvJroh6rliqjpppblhYjosIPnlKhcbiAgICogQGFic3RyYWN0XG4gICAqIEBtZXRob2QgQmFzZSNidWlsZFxuICAgKiBAbWVtYmVyb2YgQmFzZVxuICAgKi9cbiAgYnVpbGQ6ICRub29wLFxuXG4gIC8qKlxuICAgKiDlhYPku7bkuovku7bnu5HlrprmjqXlj6Plh73mlbDvvIzlrp7kvovljJblhYPku7bml7bkvJroh6rliqjlnKggYnVpbGQg5LmL5ZCO6LCD55SoXG4gICAqIEBtZXRob2QgQmFzZSNzZXRFdmVudHNcbiAgICogQG1lbWJlcm9mIEJhc2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IFthY3Rpb249J29uJ10g57uR5a6a5oiW6ICF56e76Zmk5LqL5Lu255qE5qCH6K6w77yM5Y+v6YCJ5YC85pyJ77yaWydvbicsICdvZmYnXVxuICAgKi9cbiAgc2V0RXZlbnRzOiAkbm9vcCxcblxuICAvKipcbiAgICog5Ye95pWw5Luj55CG77yM56Gu5L+d5Ye95pWw5Zyo5b2T5YmN57G75Yib5bu655qE5a6e5L6L5LiK5LiL5paH5Lit5omn6KGM44CCXG4gICAqIOi/meS6m+eUqOS6jue7keWumuS6i+S7tueahOS7o+eQhuWHveaVsOmDveaUvuWcqOWxnuaApyB0aGlzLmJvdW5kIOS4iuOAglxuICAgKiBAbWV0aG9kIEJhc2UjcHJveHlcbiAgICogQG1lbWJlcm9mIEJhc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lPSdwcm94eSddIOWHveaVsOWQjeensFxuICAgKi9cbiAgcHJveHk6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHByb3h5QXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuICRwcm94eSh0aGlzLCBuYW1lLCBwcm94eUFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnp7vpmaTmiYDmnInnu5Hlrprkuovku7bvvIzmuIXpmaTnlKjkuo7nu5Hlrprkuovku7bnmoTku6PnkIblh73mlbBcbiAgICogQG1ldGhvZCBCYXNlI2Rlc3Ryb3lcbiAgICogQG1lbWJlcm9mIEJhc2VcbiAgICovXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldEV2ZW50cygnb2ZmJyk7XG4gICAgdGhpcy5vZmYoKTtcbiAgICB0aGlzLmJvdW5kID0gbnVsbDtcbiAgfSxcbn0pO1xuXG5CYXNlLm1ldGhvZHMoJGV2ZW50cy5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCIvKipcbiAqIOS6i+S7tuWvueixoee7keWumu+8jOWwhmV2ZW50c+S4reWMheWQq+eahOmUruWAvOWvueaYoOWwhOS4uuS7o+eQhueahOS6i+S7tuOAglxuICogLSDkuovku7bplK7lgLzlr7nmoLzlvI/lj6/ku6XkuLrvvJpcbiAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZCd9XG4gKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cbiAqIC0geydldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gKiBAbWV0aG9kIGRlbGVnYXRlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFjdGlvbiDlvIAv5YWz5Luj55CG77yM5Y+v6YCJ77yaWydvbicsICdvZmYnXeOAglxuICogQHBhcmFtIHtPYmplY3R9IHJvb3Qg6K6+572u5Luj55CG55qE5qC56IqC54K577yM5Y+v5Lul5piv5LiA5LiqanF1ZXJ55a+56LGh77yM5oiW6ICF5piv5re35ZCI5LqGIHNwb3JlLWtpdC9wYWNrYWdlcy9ldnQvZXZlbnRzIOaWueazleeahOWvueixoeOAglxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyDkuovku7bplK7lgLzlr7lcbiAqIEBwYXJhbSB7T2JqZWN0fSBiaW5kIOaMh+WumuS6i+S7tuWHveaVsOe7keWumueahOWvueixoe+8jOW/hemhu+S4uk1WQ+exu+eahOWunuS+i+OAglxuICovXG5cbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC9mb3JFYWNoJyk7XG5cbmZ1bmN0aW9uIGRlbGVnYXRlKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKSB7XG4gIHZhciBwcm94eTtcbiAgdmFyIGRsZztcbiAgaWYgKCFyb290KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghYmluZCB8fCAhJGlzRnVuY3Rpb24oYmluZC5wcm94eSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm94eSA9IGJpbmQucHJveHkoKTtcbiAgYWN0aW9uID0gYWN0aW9uID09PSAnb24nID8gJ29uJyA6ICdvZmYnO1xuICBkbGcgPSBhY3Rpb24gPT09ICdvbicgPyAnZGVsZWdhdGUnIDogJ3VuZGVsZWdhdGUnO1xuICBldmVudHMgPSAkYXNzaWduKHt9LCBldmVudHMpO1xuXG4gICRmb3JFYWNoKGV2ZW50cywgZnVuY3Rpb24gKG1ldGhvZCwgaGFuZGxlKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIHZhciBldmVudDtcbiAgICB2YXIgZm5zID0gW107XG4gICAgaGFuZGxlID0gaGFuZGxlLnNwbGl0KC9cXHMrLyk7XG5cbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGZucyA9IG1ldGhvZC5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbiAoZm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHByb3h5KGZuYW1lKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoJGlzRnVuY3Rpb24obWV0aG9kKSkge1xuICAgICAgZm5zID0gW21ldGhvZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudCA9IGhhbmRsZS5wb3AoKTtcblxuICAgIGlmIChoYW5kbGUubGVuZ3RoID49IDEpIHtcbiAgICAgIHNlbGVjdG9yID0gaGFuZGxlLmpvaW4oJyAnKTtcbiAgICAgIGlmICgkaXNGdW5jdGlvbihyb290W2RsZ10pKSB7XG4gICAgICAgIGZucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgIHJvb3RbZGxnXShzZWxlY3RvciwgZXZlbnQsIGZuKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgkaXNGdW5jdGlvbihyb290W2FjdGlvbl0pKSB7XG4gICAgICBmbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcm9vdFthY3Rpb25dKGV2ZW50LCBmbik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiLyoqXG4gKiAjIOWFvOWuuSBJRTgg55qEIE1WQyDnroDljZXlrp7njrBcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL212Y1xuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbXZjXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIHNwb3JlLWtpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdzcG9yZS1raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0Lm12Yy5Nb2RlbCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLWtpdC9wYWNrYWdlcy9tdmNcbiAqIHZhciAkbXZjID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL212YycpO1xuICogY29uc29sZS5pbmZvKCRtdmMuTW9kZWwpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4que7hOS7tlxuICogdmFyICRtb2RlbCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwnKTtcbiAqL1xuXG5leHBvcnRzLmtsYXNzID0gcmVxdWlyZSgnLi9rbGFzcycpO1xuZXhwb3J0cy5kZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmV4cG9ydHMucHJveHkgPSByZXF1aXJlKCcuL3Byb3h5Jyk7XG5leHBvcnRzLkJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbmV4cG9ydHMuTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyk7XG5leHBvcnRzLlZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKipcbiAqIGNsYXNzIOeahCBFUzUg5a6e546wXG4gKiAtIOS4uuS7o+eggemAmui/hyBlc2xpbnQg5qOA5p+l5YGa5LqG5Lqb5L+u5pS5XG4gKiBAbW9kdWxlIGtsYXNzXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQva2xhc3NcbiAqL1xuXG52YXIgZm5UZXN0ID0gKC94eXovKS50ZXN0KGZ1bmN0aW9uICgpIHsgdmFyIHh5ejsgcmV0dXJuIHh5ejsgfSkgPyAoL1xcYnN1cHJcXGIvKSA6ICgvLiovKTtcbnZhciBwcm90byA9ICdwcm90b3R5cGUnO1xuXG5mdW5jdGlvbiBpc0ZuKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiB3cmFwKGssIGZuLCBzdXByKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRtcCA9IHRoaXMuc3VwcjtcbiAgICB0aGlzLnN1cHIgPSBzdXByW3Byb3RvXVtrXTtcbiAgICB2YXIgdW5kZWYgPSB7fS5mYWJyaWNhdGVkVW5kZWZpbmVkO1xuICAgIHZhciByZXQgPSB1bmRlZjtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zdXByID0gdG1wO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBleGVjUHJvY2Vzcyh3aGF0LCBvLCBzdXByKSB7XG4gIGZvciAodmFyIGsgaW4gbykge1xuICAgIGlmIChvLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICB3aGF0W2tdID0gKFxuICAgICAgICBpc0ZuKG9ba10pXG4gICAgICAgICYmIGlzRm4oc3Vwcltwcm90b11ba10pXG4gICAgICAgICYmIGZuVGVzdC50ZXN0KG9ba10pXG4gICAgICApID8gd3JhcChrLCBvW2tdLCBzdXByKSA6IG9ba107XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvLCBmcm9tU3ViKSB7XG4gIC8vIG11c3QgcmVkZWZpbmUgbm9vcCBlYWNoIHRpbWUgc28gaXQgZG9lc24ndCBpbmhlcml0IGZyb20gcHJldmlvdXMgYXJiaXRyYXJ5IGNsYXNzZXNcbiAgdmFyIE5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcbiAgTm9vcFtwcm90b10gPSB0aGlzW3Byb3RvXTtcblxuICB2YXIgc3VwciA9IHRoaXM7XG4gIHZhciBwcm90b3R5cGUgPSBuZXcgTm9vcCgpO1xuICB2YXIgaXNGdW5jdGlvbiA9IGlzRm4obyk7XG4gIHZhciBfY29uc3RydWN0b3IgPSBpc0Z1bmN0aW9uID8gbyA6IHRoaXM7XG4gIHZhciBfbWV0aG9kcyA9IGlzRnVuY3Rpb24gPyB7fSA6IG87XG5cbiAgZnVuY3Rpb24gZm4oKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZSkge1xuICAgICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmcm9tU3ViIHx8IGlzRnVuY3Rpb24pIHtcbiAgICAgICAgc3Vwci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgX2NvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZm4ubWV0aG9kcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBleGVjUHJvY2Vzcyhwcm90b3R5cGUsIG9iaiwgc3Vwcik7XG4gICAgZm5bcHJvdG9dID0gcHJvdG90eXBlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIGZuLm1ldGhvZHMuY2FsbChmbiwgX21ldGhvZHMpLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZuO1xuXG4gIGZuLmV4dGVuZCA9IGV4dGVuZDtcbiAgZm4uc3RhdGljcyA9IGZ1bmN0aW9uIChzcGVjLCBvcHRGbikge1xuICAgIHNwZWMgPSB0eXBlb2Ygc3BlYyA9PT0gJ3N0cmluZycgPyAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgb2JqW3NwZWNdID0gb3B0Rm47XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0oKSkgOiBzcGVjO1xuICAgIGV4ZWNQcm9jZXNzKHRoaXMsIHNwZWMsIHN1cHIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIGZuW3Byb3RvXS5pbXBsZW1lbnQgPSBmbi5zdGF0aWNzO1xuXG4gIHJldHVybiBmbjtcbn1cblxuZnVuY3Rpb24ga2xhc3Mobykge1xuICByZXR1cm4gZXh0ZW5kLmNhbGwoaXNGbihvKSA/IG8gOiBmdW5jdGlvbiAoKSB7fSwgbywgMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2xhc3M7XG4iLCIvKipcbiAqIOaooeWei+exuzog5Z+656GA5bel5Y6C5YWD5Lu257G777yM55So5LqO5YGa5pWw5o2u5YyF6KOF77yM5o+Q5L6b5Y+v6KeC5a+f55qE5pWw5o2u5a+56LGhXG4gKiAtIOe7p+aJv+iHqiBzcG9yZS1raXQvcGFja2FnZXMvbXZjL2Jhc2VcbiAqIEBtb2R1bGUgTW9kZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g5Yid5aeL5pWw5o2uXG4gKiBAZXhhbXBsZVxuICogdmFyICRtb2RlbCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwnKTtcbiAqXG4gKiB2YXIgbTEgPSBuZXcgJG1vZGVsKHtcbiAqICAgYSA6IDFcbiAqIH0pO1xuICogbTEub24oJ2NoYW5nZTphJywgZnVuY3Rpb24ocHJldkEpe1xuICogICBjb25zb2xlLmluZm8ocHJldkEpOyAvLyAxXG4gKiB9KTtcbiAqIG0xLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICogICBjb25zb2xlLmluZm8oJ21vZGVsIGNoYW5nZWQnKTtcbiAqIH0pO1xuICogbTEuc2V0KCdhJywgMik7XG4gKlxuICogdmFyIE15TW9kZWwgPSBNb2RlbC5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICBhIDogMixcbiAqICAgICBiIDogMlxuICogICB9LFxuICogICBldmVudHMgOiB7XG4gKiAgICAgJ2NoYW5nZTphJyA6ICd1cGRhdGVCJ1xuICogICB9LFxuICogICB1cGRhdGVCIDogZnVuY3Rpb24oKXtcbiAqICAgICB0aGlzLnNldCgnYicsIHRoaXMuZ2V0KCdhJykgKyAxKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogdmFyIG0yID0gbmV3IE15TW9kZWwoKTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7IC8vIDJcbiAqXG4gKiBtMi5zZXQoJ2EnLCAzKTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7IC8vIDRcbiAqXG4gKiBtMi5zZXQoJ2InLCA1KTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7IC8vIDVcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG52YXIgJGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xudmFyICRpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoL2lzQXJyYXknKTtcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJ2xvZGFzaC9mb3JFYWNoJyk7XG52YXIgJGNsb25lRGVlcCA9IHJlcXVpcmUoJ2xvZGFzaC9jbG9uZURlZXAnKTtcbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuLy8g5pWw5o2u5bGe5oCn5ZCN56ewXG52YXIgREFUQSA9ICdfX2RhdGFfXyc7XG5cbnZhciBzZXRBdHRyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIGRhdGEgPSB0aGlzW0RBVEFdO1xuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHByZXZWYWx1ZSA9IGRhdGFba2V5XTtcblxuICB2YXIgcHJvY2Vzc29yID0gdGhpcy5wcm9jZXNzb3JzW2tleV07XG4gIGlmIChwcm9jZXNzb3IgJiYgJGlzRnVuY3Rpb24ocHJvY2Vzc29yLnNldCkpIHtcbiAgICB2YWx1ZSA9IHByb2Nlc3Nvci5zZXQodmFsdWUpO1xuICB9XG5cbiAgaWYgKHZhbHVlICE9PSBwcmV2VmFsdWUpIHtcbiAgICBkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICB0aGF0LmNoYW5nZWQgPSB0cnVlO1xuICAgIHRoYXQudHJpZ2dlcignY2hhbmdlOicgKyBrZXksIHByZXZWYWx1ZSk7XG4gIH1cbn07XG5cbnZhciBnZXRBdHRyID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgdmFsdWUgPSB0aGlzW0RBVEFdW2tleV07XG4gIGlmICgkaXNQbGFpbk9iamVjdCh2YWx1ZSkpIHtcbiAgICB2YWx1ZSA9ICRjbG9uZURlZXAodmFsdWUpO1xuICB9IGVsc2UgaWYgKCRpc0FycmF5KHZhbHVlKSkge1xuICAgIHZhbHVlID0gJGNsb25lRGVlcCh2YWx1ZSk7XG4gIH1cblxuICB2YXIgcHJvY2Vzc29yID0gdGhpcy5wcm9jZXNzb3JzW2tleV07XG4gIGlmIChwcm9jZXNzb3IgJiYgJGlzRnVuY3Rpb24ocHJvY2Vzc29yLmdldCkpIHtcbiAgICB2YWx1ZSA9IHByb2Nlc3Nvci5nZXQodmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxudmFyIHJlbW92ZUF0dHIgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIGRlbGV0ZSB0aGlzW0RBVEFdW2tleV07XG4gIHRoaXMudHJpZ2dlcignY2hhbmdlOicgKyBrZXkpO1xufTtcblxudmFyIE1vZGVsID0gJGJhc2UuZXh0ZW5kKHtcblxuICAvKipcbiAgICog5qih5Z6L55qE6buY6K6k5pWw5o2uXG4gICAqIC0g57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG4gICAqIEBuYW1lIE1vZGVsI2RlZmF1bHRzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBNb2RlbFxuICAgKi9cbiAgZGVmYXVsdHM6IHt9LFxuXG4gIC8qKlxuICAgKiDmqKHlnovnmoTkuovku7bnu5HlrprliJfooajjgIJcbiAgICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogLSDlsL3ph4/lnKggZXZlbnRzIOWvueixoeWumuS5ieWxnuaAp+WFs+iBlOS6i+S7tuOAglxuICAgKiAtIOS6i+S7tuW6lOW9k+S7heeUqOS6juiHqui6q+WxnuaAp+eahOWFs+iBlOi/kOeul+OAglxuICAgKiAtIOS6i+S7tue7keWumuagvOW8j+WPr+S7peS4uu+8mlxuICAgKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuICAgKiAtIHsnZXZlbnQnOidtZXRob2QxIG1ldGhvZDInfVxuICAgKiBAbmFtZSBNb2RlbCNldmVudHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqL1xuICBldmVudHM6IHt9LFxuXG4gIC8qKlxuICAgKiDmqKHlnovmlbDmja7nmoTpooTlpITnkIblmajjgIJcbiAgICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogQG5hbWUgTW9kZWwjcHJvY2Vzc29yc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgTW9kZWxcbiAgICogQGV4YW1wbGVcbiAgICogcHJvY2Vzc29ycyA6IHtcbiAgICogICBuYW1lIDoge1xuICAgKiAgICAgc2V0IDogZnVuY3Rpb24odmFsdWUpe1xuICAgKiAgICAgICByZXR1cm4gdmFsdWU7XG4gICAqICAgICB9LFxuICAgKiAgICAgZ2V0IDogZnVuY3Rpb24odmFsdWUpe1xuICAgKiAgICAgICByZXR1cm4gdmFsdWU7XG4gICAqICAgICB9XG4gICAqICAgfVxuICAgKiB9XG4gICAqL1xuICBwcm9jZXNzb3JzOiB7fSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXNbREFUQV0gPSB7fTtcbiAgICB0aGlzLmRlZmF1bHRzID0gJGFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgdGhpcy5ldmVudHMgPSAkYXNzaWduKHt9LCB0aGlzLmV2ZW50cyk7XG4gICAgdGhpcy5wcm9jZXNzb3JzID0gJGFzc2lnbih7fSwgdGhpcy5wcm9jZXNzb3JzKTtcbiAgICB0aGlzLmNoYW5nZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuYnVpbGQoKTtcbiAgICB0aGlzLmRlbGVnYXRlKCdvbicpO1xuICAgIHRoaXMuc2V0RXZlbnRzKCdvbicpO1xuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICog5rex5bqm5re35ZCI5Lyg5YWl55qE6YCJ6aG55LiO6buY6K6k6YCJ6aG577yM54S25ZCO5re35ZCI5Yiw5pWw5o2u5a+56LGh5LitXG4gICAqIEBtZXRob2QgTW9kZWwjc2V0T3B0aW9uc1xuICAgKiBAbWVtYmVyb2YgTW9kZWxcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAgICovXG4gIHNldE9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cyk7XG4gICAgdGhpcy5zdXByKG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0KG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnu5HlrpogZXZlbnRzIOWvueixoeWIl+S4vueahOS6i+S7tuOAguWcqOWIneWni+WMluaXtuiHquWKqOaJp+ihjOS6hiB0aGlzLmRlbGVnYXRlKCdvbicp44CCXG4gICAqIEBtZXRob2QgTW9kZWwjZGVsZWdhdGVcbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbYWN0aW9uPSdvbiddIOe7keWumuWKqOS9nOagh+iusOOAguWPr+mAie+8mlsnb24nLCAnb2ZmJ11cbiAgICovXG4gIGRlbGVnYXRlOiBmdW5jdGlvbiAoYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpIHtcbiAgICBhY3Rpb24gPSBhY3Rpb24gfHwgJ29uJztcbiAgICByb290ID0gcm9vdCB8fCB0aGlzO1xuICAgIGV2ZW50cyA9IGV2ZW50cyB8fCB0aGlzLmV2ZW50cztcbiAgICBiaW5kID0gYmluZCB8fCB0aGlzO1xuICAgICRkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOaVsOaNrumihOWkhOeQhlxuICAgKiBAbWV0aG9kIE1vZGVsI3Byb2Nlc3NcbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg5qih5Z6L5bGe5oCn5ZCN56ew44CC5oiW6ICFSlNPTuaVsOaNruOAglxuICAgKiBAcGFyYW0geyp9IFt2YWxdIOaVsOaNrlxuICAgKi9cbiAgcHJvY2VzczogZnVuY3Rpb24gKG5hbWUsIHNwZWMpIHtcbiAgICBzcGVjID0gJGFzc2lnbih7XG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICB9LCBzcGVjKTtcbiAgICB0aGlzLnByb2Nlc3NvcnNbbmFtZV0gPSBzcGVjO1xuICB9LFxuXG4gIC8qKlxuICAgKiDorr7nva7mqKHlnovmlbDmja5cbiAgICogQG1ldGhvZCBNb2RlbCNzZXRcbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0ga2V5IOaooeWei+WxnuaAp+WQjeensOOAguaIluiAhUpTT07mlbDmja7jgIJcbiAgICogQHBhcmFtIHsqfSBbdmFsXSDmlbDmja5cbiAgICovXG4gIHNldDogZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgaWYgKCRpc1BsYWluT2JqZWN0KGtleSkpIHtcbiAgICAgICRmb3JFYWNoKGtleSwgZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgc2V0QXR0ci5jYWxsKHRoaXMsIGssIHYpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzZXRBdHRyLmNhbGwodGhpcywga2V5LCB2YWwpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGFuZ2VkKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgdGhpcy5jaGFuZ2VkID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiDojrflj5bmqKHlnovlr7nlupTlsZ7mgKfnmoTlgLznmoTmi7fotJ1cbiAgICogLSDlpoLmnpzkuI3kvKDlj4LmlbDvvIzliJnnm7TmjqXojrflj5bmlbTkuKrmqKHlnovmlbDmja7jgIJcbiAgICogLSDlpoLmnpzlgLzmmK/kuIDkuKrlr7nosaHvvIzliJnor6Xlr7nosaHkvJrooqvmt7Hmi7fotJ3jgIJcbiAgICogQG1ldGhvZCBNb2RlbCNnZXRcbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XSDmqKHlnovlsZ7mgKflkI3np7DjgIJcbiAgICogQHJldHVybnMgeyp9IOWxnuaAp+WQjeensOWvueW6lOeahOWAvFxuICAgKi9cbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXRoaXNbREFUQV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdldEF0dHIuY2FsbCh0aGlzLCBrZXkpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAkZm9yRWFjaCh0aGlzLmtleXMoKSwgZnVuY3Rpb24gKGspIHtcbiAgICAgICAgZGF0YVtrXSA9IGdldEF0dHIuY2FsbCh0aGlzLCBrKTtcbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiOt+WPluaooeWei+S4iuiuvue9rueahOaJgOaciemUruWQjVxuICAgKiBAbWV0aG9kIE1vZGVsI2tleXNcbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqIEByZXR1cm5zIHtBcnJheX0g5bGe5oCn5ZCN56ew5YiX6KGoXG4gICAqL1xuICBrZXlzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbREFUQV0gfHwge30pO1xuICB9LFxuXG4gIC8qKlxuICAgKiDliKDpmaTmqKHlnovkuIrnmoTkuIDkuKrplK5cbiAgICogQG1ldGhvZCBNb2RlbCNyZW1vdmVcbiAgICogQG1lbWJlcm9mIE1vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg5bGe5oCn5ZCN56ew44CCXG4gICAqL1xuICByZW1vdmU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZW1vdmVBdHRyLmNhbGwodGhpcywga2V5KTtcbiAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmuIXpmaTmqKHlnovkuK3miYDmnInmlbDmja5cbiAgICogQG1ldGhvZCBNb2RlbCNjbGVhclxuICAgKiBAbWVtYmVyb2YgTW9kZWxcbiAgICovXG4gIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpc1tEQVRBXSkuZm9yRWFjaChyZW1vdmVBdHRyLCB0aGlzKTtcbiAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDplIDmr4HmqKHlnovvvIzkuI3kvJrop6blj5Hku7vkvZVjaGFuZ2Xkuovku7bjgIJcbiAgICogLSDmqKHlnovplIDmr4HlkI7vvIzml6Dms5Xlho3orr7nva7ku7vkvZXmlbDmja7jgIJcbiAgICogQG1ldGhvZCBNb2RlbCNkZXN0cm95XG4gICAqIEBtZW1iZXJvZiBNb2RlbFxuICAgKi9cbiAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGVsZWdhdGUoJ29mZicpO1xuICAgIHRoaXMuc3VwcigpO1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzW0RBVEFdID0gbnVsbDtcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwiLyoqXG4gKiDlh73mlbDku6PnkIbvvIznoa7kv53lh73mlbDlnKjlvZPliY3nsbvliJvlu7rnmoTlrp7kvovkuIrkuIvmlofkuK3miafooYzjgIJcbiAqIC0g6L+Z5Lqb55So5LqO57uR5a6a5LqL5Lu255qE5Luj55CG5Ye95pWw6YO95pS+5Zyo5bGe5oCnIGluc3RhbmNlLmJvdW5kIOS4iuOAglxuICogLSDlip/og73nsbvkvLwgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQg44CCXG4gKiAtIOWPr+S7peS8oOmAkumineWkluWPguaVsOS9nOS4uuWHveaVsOaJp+ihjOeahOm7mOiupOWPguaVsO+8jOi/veWKoOWcqOWunumZheWPguaVsOS5i+WQjuOAglxuICogQHBhcmFtIHtvYmplY3R9IGluc3RhbmNlIOWvueixoeWunuS+i1xuICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lPSdwcm94eSddIOWHveaVsOWQjeensFxuICovXG5cbnZhciAkaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC9pc0Z1bmN0aW9uJyk7XG5cbnZhciBBUCA9IEFycmF5LnByb3RvdHlwZTtcblxuZnVuY3Rpb24gcHJveHkoaW5zdGFuY2UsIG5hbWUsIHByb3h5QXJncykge1xuICBpZiAoIWluc3RhbmNlLmJvdW5kKSB7XG4gICAgaW5zdGFuY2UuYm91bmQgPSB7fTtcbiAgfVxuICB2YXIgYm91bmQgPSBpbnN0YW5jZS5ib3VuZDtcbiAgcHJveHlBcmdzID0gcHJveHlBcmdzIHx8IFtdO1xuICBwcm94eUFyZ3Muc2hpZnQoKTtcbiAgbmFtZSA9IG5hbWUgfHwgJ3Byb3h5JztcbiAgaWYgKCEkaXNGdW5jdGlvbihib3VuZFtuYW1lXSkpIHtcbiAgICBib3VuZFtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkaXNGdW5jdGlvbihpbnN0YW5jZVtuYW1lXSkpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBUC5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZVtuYW1lXS5hcHBseShpbnN0YW5jZSwgYXJncy5jb25jYXQocHJveHlBcmdzKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4gYm91bmRbbmFtZV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJveHk7XG4iLCIvKipcbiAqIOinhuWbvuexuzog5Z+656GA5bel5Y6C5YWD5Lu257G777yM55So5LqO5a+56KeG5Zu+57uE5Lu255qE5YyF6KOFXG4gKiAtIOS+nei1liBqUXVlcnkvWmVwdG9cbiAqIC0g57un5om/6IeqIHNwb3JlLWtpdC9wYWNrYWdlcy9tdmMvYmFzZVxuICogQG1vZHVsZSBWaWV3XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBbb3B0aW9ucy5ub2RlXSDpgInmi6nlmajlrZfnrKbkuLLvvIzmiJbogIVET03lhYPntKDvvIzmiJbogIVqcXVlcnnlr7nosaHvvIznlKjkuo7mjIflrprop4blm77nmoTmoLnoioLngrnjgIJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50ZW1wbGF0ZV0g6KeG5Zu+55qE5qih5p2/5a2X56ym5Liy77yM5Lmf5Y+v5Lul5piv5Liq5a2X56ym5Liy5pWw57uE77yM5Yib5bu66KeG5Zu+RE9N5pe25Lya6Ieq5Yqoam9pbuS4uuWtl+espuS4suWkhOeQhuOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmV2ZW50c10g55So5LqO6KaG55uW5Luj55CG5LqL5Lu25YiX6KGo44CCXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucm9sZV0g6KeS6Imy5a+56LGh5pig5bCE6KGo77yM5Y+v5oyH5a6acm9sZeaWueazlei/lOWbnueahGpxdWVyeeWvueixoeOAglxuICogQGV4YW1wbGVcbiAqIHZhciAkdmlldyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvdmlldycpO1xuICpcbiAqIHZhciBUUEwgPSB7XG4gKiAgIGJveCA6IFtcbiAqICAgICAnPGRpdj4nLFxuICogICAgICAgJzxidXR0b24gcm9sZT1cImJ1dHRvblwiPjwvYnV0dG9uPicsXG4gKiAgICAgJzwvZGl2PidcbiAqICAgXVxuICogfTtcbiAqXG4gKiB2YXIgVGVzdFZpZXcgPSAkdmlldy5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICB0ZW1wbGF0ZSA6IFRQTC5ib3hcbiAqICAgfSxcbiAqICAgZXZlbnRzIDoge1xuICogICAgICdidXR0b24gY2xpY2snIDogJ21ldGhvZDEnXG4gKiAgIH0sXG4gKiAgIGJ1aWxkIDogZnVuY3Rpb24oKXtcbiAqICAgICB0aGlzLnJvbGUoJ3Jvb3QnKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAqICAgfSxcbiAqICAgbWV0aG9kMSA6IGZ1bmN0aW9uKGV2dCl7XG4gKiAgICAgY29uc29sZS5pbmZvKDEpO1xuICogICB9LFxuICogICBtZXRob2QyIDogZnVuY3Rpb24oZXZ0KXtcbiAqICAgICBjb25zb2xlLmluZm8oMik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIHZhciBvYmoxID0gbmV3IFRlc3RWaWV3KCk7XG4gKiB2YXIgb2JqMiA9IG5ldyBUZXN0Vmlldyh7XG4gKiAgIGV2ZW50cyA6IHtcbiAqICAgICAnYnV0dG9uIGNsaWNrJyA6ICdtZXRob2QyJ1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBvYmoxLnJvbGUoJ2J1dHRvbicpLnRyaWdnZXIoJ2NsaWNrJyk7IC8vIDFcbiAqIG9iajIucm9sZSgnYnV0dG9uJykudHJpZ2dlcignY2xpY2snKTsgLy8gMlxuICovXG5cbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuZnVuY3Rpb24gZ2V0JCgpIHtcbiAgcmV0dXJuICh3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byk7XG59XG5cbi8vIOiOt+WPluinhuWbvueahOagueiKgueCuVxudmFyIGdldFJvb3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICB2YXIgY29uZiA9IHRoaXMuY29uZjtcbiAgdmFyIHRlbXBsYXRlID0gY29uZi50ZW1wbGF0ZTtcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgdmFyIHJvb3QgPSBub2Rlcy5yb290O1xuICBpZiAoIXJvb3QpIHtcbiAgICBpZiAoY29uZi5ub2RlKSB7XG4gICAgICByb290ID0gJChjb25mLm5vZGUpO1xuICAgIH1cbiAgICBpZiAoIXJvb3QgfHwgIXJvb3QubGVuZ3RoKSB7XG4gICAgICBpZiAoJC50eXBlKHRlbXBsYXRlKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLmpvaW4oJycpO1xuICAgICAgfVxuICAgICAgcm9vdCA9ICQodGVtcGxhdGUpO1xuICAgIH1cbiAgICBub2Rlcy5yb290ID0gcm9vdDtcbiAgfVxuICByZXR1cm4gcm9vdDtcbn07XG5cbnZhciBWaWV3ID0gJGJhc2UuZXh0ZW5kKHtcbiAgLyoqXG4gICAqIOexu+eahOm7mOiupOmAiemhueWvueixoe+8jOe7keWumuWcqOWOn+Wei+S4iu+8jOS4jeimgeWcqOWunuS+i+S4reebtOaOpeS/ruaUuei/meS4quWvueixoeOAglxuICAgKiBAbmFtZSBWaWV3I2RlZmF1bHRzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBWaWV3XG4gICAqL1xuICBkZWZhdWx0czoge1xuICAgIG5vZGU6ICcnLFxuICAgIHRlbXBsYXRlOiAnJyxcbiAgICBldmVudHM6IHt9LFxuICAgIHJvbGU6IHt9LFxuICB9LFxuXG4gIC8qKlxuICAgKiDop4blm77nmoTku6PnkIbkuovku7bnu5HlrprliJfooajvvIznu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogLSDkuovku7bnu5HlrprmoLzlvI/lj6/ku6XkuLrvvJpcbiAgICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kJ31cbiAgICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cbiAgICogQG5hbWUgVmlldyNldmVudHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFZpZXdcbiAgICovXG4gIGV2ZW50czoge30sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5vZGVzID0ge307XG5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5idWlsZCgpO1xuICAgIHRoaXMuZGVsZWdhdGUoJ29uJyk7XG4gICAgdGhpcy5zZXRFdmVudHMoJ29uJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOa3seW6pua3t+WQiOS8oOWFpeeahOmAiemhueS4jum7mOiupOmAiemhue+8jOa3t+WQiOWujOaIkOeahOmAiemhueWvueixoeWPr+mAmui/hyB0aGlzLmNvbmYg5bGe5oCn6K6/6ZeuXG4gICAqIEBtZXRob2QgVmlldyNzZXRPcHRpb25zXG4gICAqIEBtZW1iZXJvZiBWaWV3XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g6YCJ6aG5XG4gICAqL1xuICBzZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciAkID0gZ2V0JCgpO1xuICAgIHRoaXMuY29uZiA9IHRoaXMuY29uZiB8fCAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgaWYgKCEkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgJC5leHRlbmQodHJ1ZSwgdGhpcy5jb25mLCBvcHRpb25zKTtcbiAgICB0aGlzLmV2ZW50cyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmV2ZW50cywgb3B0aW9ucy5ldmVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnu5HlrpogZXZlbnRzIOWvueixoeWIl+S4vueahOS6i+S7tuOAglxuICAgKiAtIOWcqOWIneWni+WMluaXtuiHquWKqOaJp+ihjOS6hiB0aGlzLmRlbGVnYXRlKCdvbicp44CCXG4gICAqIEBtZXRob2QgVmlldyNkZWxlZ2F0ZVxuICAgKiBAbWVtYmVyb2YgVmlld1xuICAgKiBAc2VlIHNwb3JlLWtpdC9wYWNrYWdlcy9tdmMvZGVsZWdhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IFthY3Rpb249J29uJ10g57uR5a6a5Yqo5L2c5qCH6K6w44CC5Y+v6YCJ77yaWydvbicsICdvZmYnXVxuICAgKi9cbiAgZGVsZWdhdGU6IGZ1bmN0aW9uIChhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCkge1xuICAgIGFjdGlvbiA9IGFjdGlvbiB8fCAnb24nO1xuICAgIHJvb3QgPSByb290IHx8IHRoaXMucm9sZSgncm9vdCcpO1xuICAgIGV2ZW50cyA9IGV2ZW50cyB8fCB0aGlzLmV2ZW50cztcbiAgICBiaW5kID0gYmluZCB8fCB0aGlzO1xuICAgICRkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiOt+WPliAvIOiuvue9ruinkuiJsuWvueixoeaMh+WumueahCBqUXVlcnkg5a+56LGh44CCXG4gICAqIC0g5rOo5oSP77ya6I635Y+W5Yiw6KeS6Imy5YWD57Sg5ZCO77yM6K+lIGpRdWVyeSDlr7nosaHkvJrnvJPlrZjlnKjop4blm77lr7nosaHkuK1cbiAgICogQG1ldGhvZCBWaWV3I3JvbGVcbiAgICogQG1lbWJlcm9mIFZpZXdcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUg6KeS6Imy5a+56LGh5ZCN56ewXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZWxlbWVudF0g6KeS6Imy5a+56LGh5oyH5a6a55qEZG9t5YWD57Sg5oiW6ICFIGpRdWVyeSDlr7nosaHjgIJcbiAgICogQHJldHVybnMge09iamVjdH0g6KeS6Imy5ZCN5a+55bqU55qEIGpRdWVyeSDlr7nosaHjgIJcbiAgICovXG4gIHJvbGU6IGZ1bmN0aW9uIChuYW1lLCBlbGVtZW50KSB7XG4gICAgdmFyICQgPSBnZXQkKCk7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICB2YXIgcm9vdCA9IGdldFJvb3QuY2FsbCh0aGlzKTtcbiAgICB2YXIgcm9sZSA9IHRoaXMuY29uZi5yb2xlIHx8IHt9O1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgaWYgKG5vZGVzW25hbWVdKSB7XG4gICAgICAgIGVsZW1lbnQgPSBub2Rlc1tuYW1lXTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lID09PSAncm9vdCcpIHtcbiAgICAgICAgZWxlbWVudCA9IHJvb3Q7XG4gICAgICB9IGVsc2UgaWYgKCFlbGVtZW50IHx8ICFlbGVtZW50Lmxlbmd0aCkge1xuICAgICAgICBpZiAocm9sZVtuYW1lXSkge1xuICAgICAgICAgIGVsZW1lbnQgPSByb290LmZpbmQocm9sZVtuYW1lXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudCA9IHJvb3QuZmluZCgnW3JvbGU9XCInICsgbmFtZSArICdcIl0nKTtcbiAgICAgICAgfVxuICAgICAgICBub2Rlc1tuYW1lXSA9IGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgbm9kZXNbbmFtZV0gPSBlbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSxcblxuICAvKipcbiAgICog5riF6Zmk6KeG5Zu+57yT5a2Y55qE6KeS6Imy5a+56LGhXG4gICAqIEBtZXRob2QgVmlldyNyZXNldFJvbGVzXG4gICAqIEBtZW1iZXJvZiBWaWV3XG4gICAqL1xuICByZXNldFJvbGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICQgPSBnZXQkKCk7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICAkLmVhY2gobm9kZXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAobmFtZSAhPT0gJ3Jvb3QnKSB7XG4gICAgICAgIG5vZGVzW25hbWVdID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIG5vZGVzW25hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiDplIDmr4Hop4blm77vvIzph4rmlL7lhoXlrZhcbiAgICogQG1ldGhvZCBWaWV3I2Rlc3Ryb3lcbiAgICogQG1lbWJlcm9mIFZpZXdcbiAgICovXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmRlbGVnYXRlKCdvZmYnKTtcbiAgICB0aGlzLnN1cHIoKTtcbiAgICB0aGlzLnJlc2V0Um9sZXMoKTtcbiAgICB0aGlzLm5vZGVzID0ge307XG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuIiwiLyoqXG4gKiDmlbDlrZfnmoTljYPliIbkvY3pgJflj7fliIbpmpTooajnpLrms5VcbiAqIC0gSUU4IOeahCB0b0xvY2FsU3RyaW5nIOe7meWHuuS6huWwj+aVsOeCueWQjjLkvY06IE4uMDBcbiAqIEBtZXRob2QgY29tbWFcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTAxMTAyL2hvdy10by1wcmludC1hLW51bWJlci13aXRoLWNvbW1hcy1hcy10aG91c2FuZHMtc2VwYXJhdG9ycy1pbi1qYXZhc2NyaXB0XG4gKiBAcGFyYW0ge051bWJlcn0gbnVtIOaVsOWtl1xuICogQHJldHVybnMge1N0cmluZ30g5Y2D5YiG5L2N6KGo56S655qE5pWw5a2XXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb21tYSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vY29tbWEnKTtcbiAqICRjb21tYSgxMjM0NTY3KTsgLy8nMSwyMzQsNTY3J1xuICovXG5cbmZ1bmN0aW9uIGNvbW1hKG51bSkge1xuICB2YXIgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tbWE7XG4iLCIvKipcbiAqIOS/ruato+ihpeS9jVxuICogQG1ldGhvZCBmaXhUb1xuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBudW0g6KaB6KGl5L2N55qE5pWw5a2XXG4gKiBAcGFyYW0ge051bWJlcn0gW3c9Ml0gdyDooaXkvY3mlbDph49cbiAqIEByZXR1cm4ge1N0cmluZ30g57uP6L+H6KGl5L2N55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRmaXhUbyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vZml4VG8nKTtcbiAqICRmaXhUbygwLCAyKTsgLy9yZXR1cm4gJzAwJ1xuICovXG5cbmZ1bmN0aW9uIGZpeFRvKG51bSwgdykge1xuICB2YXIgc3RyID0gbnVtLnRvU3RyaW5nKCk7XG4gIHcgPSBNYXRoLm1heCgodyB8fCAyKSAtIHN0ci5sZW5ndGggKyAxLCAwKTtcbiAgcmV0dXJuIG5ldyBBcnJheSh3KS5qb2luKCcwJykgKyBzdHI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZml4VG87XG4iLCIvKipcbiAqICMg5aSE55CG5pWw5a2X77yM5pWw5o2u6L2s5o2iXG4gKiBAbW9kdWxlIHNwb3JlLWtpdC9wYWNrYWdlcy9udW1cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL251bVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5udW0ubGltaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvbnVtXG4gKiB2YXIgJG51bSA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0nKTtcbiAqIGNvbnNvbGUuaW5mbygkbnVtLmxpbWl0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkbGltaXQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbnVtL2xpbWl0Jyk7XG4gKi9cblxuZXhwb3J0cy5jb21tYSA9IHJlcXVpcmUoJy4vY29tbWEnKTtcbmV4cG9ydHMuZml4VG8gPSByZXF1aXJlKCcuL2ZpeFRvJyk7XG5leHBvcnRzLmxpbWl0ID0gcmVxdWlyZSgnLi9saW1pdCcpO1xuZXhwb3J0cy5udW1lcmljYWwgPSByZXF1aXJlKCcuL251bWVyaWNhbCcpO1xuIiwiLyoqXG4gKiDpmZDliLbmlbDlrZflnKjkuIDkuKrojIPlm7TlhoVcbiAqIEBtZXRob2QgbGltaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSBudW0g6KaB6ZmQ5Yi255qE5pWw5a2XXG4gKiBAcGFyYW0ge051bWJlcn0gbWluIOacgOWwj+i+ueeVjOaVsOWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IG1heCDmnIDlpKfovrnnlYzmlbDlgLxcbiAqIEByZXR1cm4ge051bWJlcn0g57uP6L+H6ZmQ5Yi255qE5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRsaW1pdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vbGltaXQnKTtcbiAqICRsaW1pdCgxLCA1LCAxMCk7IC8vIDVcbiAqICRsaW1pdCg2LCA1LCAxMCk7IC8vIDZcbiAqICRsaW1pdCgxMSwgNSwgMTApOyAvLyAxMFxuICovXG5cbmZ1bmN0aW9uIGxpbWl0KG51bSwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG51bSwgbWluKSwgbWF4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaW1pdDtcbiIsIi8qKlxuICog5bCG5pWw5o2u57G75Z6L6L2s5Li65pW05pWw5pWw5a2X77yM6L2s5o2i5aSx6LSl5YiZ6L+U5Zue5LiA5Liq6buY6K6k5YC8XG4gKiBAbWV0aG9kIG51bWVyaWNhbFxuICogQHBhcmFtIHsqfSBzdHIg6KaB6L2s5o2i55qE5pWw5o2uXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlZj0wXSDovazmjaLlpLHotKXml7bnmoTpu5jorqTlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3lzPTEwXSDov5vliLZcbiAqIEByZXR1cm4ge051bWJlcn0g6L2s5o2i6ICM5b6X55qE5pW05pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRudW1lcmljYWwgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvbnVtL251bWVyaWNhbCcpO1xuICogJG51bWVyaWNhbCgnMTB4Jyk7IC8vIDEwXG4gKiAkbnVtZXJpY2FsKCd4MTAnKTsgLy8gMFxuICovXG5cbmZ1bmN0aW9uIG51bWVyaWNhbChzdHIsIGRlZiwgc3lzKSB7XG4gIGRlZiA9IGRlZiB8fCAwO1xuICBzeXMgPSBzeXMgfHwgMTA7XG4gIHJldHVybiBwYXJzZUludChzdHIsIHN5cykgfHwgZGVmO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG51bWVyaWNhbDtcbiIsIi8qKlxuICog5omp5bGV5bm26KaG55uW5a+56LGhXG4gKiBAbWV0aG9kIGFzc2lnblxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDopoHmianlsZXnmoTlr7nosaFcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIOimgeaJqeWxleeahOWxnuaAp+mUruWAvOWvuVxuICogQHJldHVybnMge09iamVjdH0g5omp5bGV5ZCO55qE5rqQ5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRhc3NpZ24gPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvb2JqL2Fzc2lnbicpO1xuICogdmFyIG9iaiA9IHthOiAxLCBiOiAyfTtcbiAqIGNvbnNvbGUuaW5mbygkYXNzaWduKG9iaiwge2I6IDMsIGM6IDR9KSk7IC8vIHthOiAxLCBiOiAzLCBjOiA0fVxuICogY29uc29sZS5pbmZvKCRhc3NpZ24oe30sIG9iaiwge2I6IDMsIGM6IDR9KSk7IC8vIHthOiAxLCBiOiAzLCBjOiA0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2lnbihvYmopIHtcbiAgb2JqID0gb2JqIHx8IHt9O1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciBwcm9wO1xuICAgIHNvdXJjZSA9IHNvdXJjZSB8fCB7fTtcbiAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsIi8qKlxuICog6KaG55uW5a+56LGh77yM5LiN5re75Yqg5paw55qE6ZSuXG4gKiBAbWV0aG9kIGNvdmVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IOimgeimhueblueahOWvueixoVxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0g6KaB6KaG55uW55qE5bGe5oCn6ZSu5YC85a+5XG4gKiBAcmV0dXJucyB7T2JqZWN0fSDopobnm5blkI7nmoTmupDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvdmVyID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL29iai9jb3ZlcicpO1xuICogdmFyIG9iaiA9IHthOiAxLCBiOiAyfTtcbiAqIGNvbnNvbGUuaW5mbygkY292ZXIob2JqLHtiOiAzLCBjOiA0fSkpOyAvL3thOiAxLCBiOiAzfVxuICovXG5cbmZ1bmN0aW9uIGNvdmVyKCkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIHZhciBvYmplY3QgPSBhcmdzLnNoaWZ0KCk7XG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtLmhhc093blByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3ZlcjtcbiIsIi8qKlxuICog5p+l5om+5a+56LGh6Lev5b6E5LiK55qE5YC8KOeugOaYk+eJiClcbiAqIEBzZWUgbG9kYXNoLmdldFxuICogQG1ldGhvZCBmaW5kXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IOimgeafpeaJvueahOWvueixoVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGgg6KaB5p+l5om+55qE6Lev5b6EXG4gKiBAcmV0dXJuIHsqfSDlr7nosaHot6/lvoTkuIrnmoTlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZpbmQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvb2JqL2ZpbmQnKTtcbiAqIHZhciBvYmogPSB7YTp7Yjp7YzoxfX19O1xuICogY29uc29sZS5pbmZvKCRmaW5kKG9iaiwnYS5iLmMnKSk7IC8vIDFcbiAqIGNvbnNvbGUuaW5mbygkZmluZChvYmosJ2EuYycpKTsgLy8gdW5kZWZpbmVkXG4gKi9cblxuZnVuY3Rpb24gZmluZFBhdGgob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8ICcnO1xuICBpZiAoIXBhdGgpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBxdWV1ZSA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIG5hbWU7XG4gIHZhciBwb3MgPSBvYmplY3Q7XG5cbiAgd2hpbGUgKHF1ZXVlLmxlbmd0aCkge1xuICAgIG5hbWUgPSBxdWV1ZS5zaGlmdCgpO1xuICAgIGlmICghcG9zW25hbWVdKSB7XG4gICAgICByZXR1cm4gcG9zW25hbWVdO1xuICAgIH1cbiAgICBwb3MgPSBwb3NbbmFtZV07XG4gIH1cblxuICByZXR1cm4gcG9zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRQYXRoO1xuIiwiLyoqXG4gKiAjIOWvueixoeWkhOeQhuS4juWIpOaWrVxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvb2JqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9vYmpcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQub2JqLnR5cGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvb2JqXG4gKiB2YXIgJG9iaiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmonKTtcbiAqIGNvbnNvbGUuaW5mbygkb2JqLnR5cGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICR0eXBlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL29iai90eXBlJyk7XG4gKi9cblxuZXhwb3J0cy5hc3NpZ24gPSByZXF1aXJlKCcuL2Fzc2lnbicpO1xuZXhwb3J0cy5jb3ZlciA9IHJlcXVpcmUoJy4vY292ZXInKTtcbmV4cG9ydHMuZmluZCA9IHJlcXVpcmUoJy4vZmluZCcpO1xuZXhwb3J0cy50eXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XG4iLCIvKipcbiAqIOiOt+WPluaVsOaNruexu+Wei1xuICogQG1ldGhvZCB0eXBlXG4gKiBAcGFyYW0geyp9IGl0ZW0g5Lu75L2V57G75Z6L5pWw5o2uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDlr7nosaHnsbvlnotcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHR5cGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvb2JqL3R5cGUnKTtcbiAqICR0eXBlKHt9KTsgLy8gJ29iamVjdCdcbiAqICR0eXBlKDEpOyAvLyAnbnVtYmVyJ1xuICogJHR5cGUoJycpOyAvLyAnc3RyaW5nJ1xuICogJHR5cGUoZnVuY3Rpb24oKXt9KTsgLy8gJ2Z1bmN0aW9uJ1xuICogJHR5cGUoKTsgLy8gJ3VuZGVmaW5lZCdcbiAqICR0eXBlKG51bGwpOyAvLyAnbnVsbCdcbiAqICR0eXBlKG5ldyBEYXRlKCkpOyAvLyAnZGF0ZSdcbiAqICR0eXBlKC9hLyk7IC8vICdyZWdleHAnXG4gKiAkdHlwZShTeW1ib2woJ2EnKSk7IC8vICdzeW1ib2wnXG4gKiAkdHlwZSh3aW5kb3cpIC8vICd3aW5kb3cnXG4gKiAkdHlwZShkb2N1bWVudCkgLy8gJ2h0bWxkb2N1bWVudCdcbiAqICR0eXBlKGRvY3VtZW50LmJvZHkpIC8vICdodG1sYm9keWVsZW1lbnQnXG4gKiAkdHlwZShkb2N1bWVudC5oZWFkKSAvLyAnaHRtbGhlYWRlbGVtZW50J1xuICogJHR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpKSAvLyAnaHRtbGNvbGxlY3Rpb24nXG4gKiAkdHlwZShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JylbMF0pIC8vICdodG1sZGl2ZWxlbWVudCdcbiAqL1xuXG5mdW5jdGlvbiB0eXBlKGl0ZW0pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChpdGVtKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL15cXFtvYmplY3RcXHMqfFxcXSQvZ2ksICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29udHJvbC1yZWdleCAqL1xuLyoqXG4gKiDojrflj5blrZfnrKbkuLLplb/luqbvvIzkuIDkuKrkuK3mlofnrpcy5Liq5a2X56ymXG4gKiBAbWV0aG9kIGJMZW5ndGhcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg6KaB6K6h566X6ZW/5bqm55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7TnVtYmVyfSDlrZfnrKbkuLLplb/luqZcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGJMZW5ndGggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2JMZW5ndGgnKTtcbiAqICRiTGVuZ3RoKCfkuK3mlodjYycpOyAvLyA2XG4gKi9cblxuZnVuY3Rpb24gYkxlbmd0aChzdHIpIHtcbiAgdmFyIGFNYXRjaDtcbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBhTWF0Y2ggPSBzdHIubWF0Y2goL1teXFx4MDAtXFx4ZmZdL2cpO1xuICByZXR1cm4gKHN0ci5sZW5ndGggKyAoIWFNYXRjaCA/IDAgOiBhTWF0Y2gubGVuZ3RoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYkxlbmd0aDtcbiIsIi8qKlxuICog5YWo6KeS5a2X56ym6L2s5Y2K6KeS5a2X56ymXG4gKiBAbWV0aG9kIGRiY1RvU2JjXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWMheWQq+S6huWFqOinkuWtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g57uP6L+H6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRkYmNUb1NiYyA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZGJjVG9TYmMnKTtcbiAqICRkYmNUb1NiYygn77yz77yh77yh77yz77yk77ym77yz77yh77yk77ymJyk7IC8vICdTQUFTREZTQURGJ1xuICovXG5cbmZ1bmN0aW9uIGRiY1RvU2JjKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXHVmZjAxLVxcdWZmNWVdL2csIGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoYS5jaGFyQ29kZUF0KDApIC0gNjUyNDgpO1xuICB9KS5yZXBsYWNlKC9cXHUzMDAwL2csICcgJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGJjVG9TYmM7XG4iLCIvKipcbiAqIOino+eggUhUTUzvvIzlsIblrp7kvZPlrZfnrKbovazmjaLkuLpIVE1M5a2X56ymXG4gKiBAbWV0aG9kIGRlY29kZUhUTUxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg5ZCr5pyJ5a6e5L2T5a2X56ym55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBIVE1M5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRkZWNvZGVIVE1MID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9kZWNvZGVIVE1MJyk7XG4gKiAkZGVjb2RlSFRNTCgnJmFtcDsmbHQ7Jmd0OyZxdW90OyYjMzk7JiMzMjsnKTsgLy8gJyY8PlwiXFwnICdcbiAqL1xuXG5mdW5jdGlvbiBkZWNvZGVIVE1MKHN0cikge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY29kZUhUTUwgbmVlZCBhIHN0cmluZyBhcyBwYXJhbWV0ZXInKTtcbiAgfVxuICByZXR1cm4gc3RyLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgIC5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgLnJlcGxhY2UoLyYjMzk7L2csICdcXCcnKVxuICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgJ1xcdTAwQTAnKVxuICAgIC5yZXBsYWNlKC8mIzMyOy9nLCAnXFx1MDAyMCcpXG4gICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb2RlSFRNTDtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnRyb2wtcmVnZXggKi9cbi8qKlxuICog57yW56CBSFRNTO+8jOWwhkhUTUzlrZfnrKbovazkuLrlrp7kvZPlrZfnrKZcbiAqIEBtZXRob2QgZW5jb2RlSFRNTFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDlkKvmnIlIVE1M5a2X56ym55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDnu4/ov4fovazmjaLnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVuY29kZUhUTUwgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2VuY29kZUhUTUwnKTtcbiAqICRlbmNvZGVIVE1MKGAmPD5cIlxcJyBgKTsgLy8gJyZhbXA7Jmx0OyZndDsmcXVvdDsmIzM5OyYjMzI7J1xuICovXG5cbmZ1bmN0aW9uIGVuY29kZUhUTUwoc3RyKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignZW5jb2RlSFRNTCBuZWVkIGEgc3RyaW5nIGFzIHBhcmFtZXRlcicpO1xuICB9XG4gIHJldHVybiBzdHIucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpXG4gICAgLnJlcGxhY2UoL1xcdTAwQTAvZywgJyZuYnNwOycpXG4gICAgLnJlcGxhY2UoLyhcXHUwMDIwfFxcdTAwMEJ8XFx1MjAyOHxcXHUyMDI5fFxcZikvZywgJyYjMzI7Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW5jb2RlSFRNTDtcbiIsIi8qKlxuICog6I635Y+WMzbov5vliLbpmo/mnLrlrZfnrKbkuLJcbiAqIEBtZXRob2QgZ2V0Um5kMzZcbiAqIEBwYXJhbSB7RmxvYXR9IFtybmRdIOmaj+acuuaVsO+8jOS4jeS8oOWImeeUn+aIkOS4gOS4qumaj+acuuaVsFxuICogQHJldHVybiB7U3RyaW5nfSDovazmiJDkuLozNui/m+WItueahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0Um5kMzYgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2dldFJuZDM2Jyk7XG4gKiAkZ2V0Um5kMzYoMC41ODEwNzY2ODMyNTkwNDQ2KTsgLy8gJ2t4MnBveno5cmdmJ1xuICovXG5cbmZ1bmN0aW9uIGdldFJuZDM2KHJuZCkge1xuICBybmQgPSBybmQgfHwgTWF0aC5yYW5kb20oKTtcbiAgcmV0dXJuIHJuZC50b1N0cmluZygzNikucmVwbGFjZSgvXjAuLywgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJuZDM2O1xuIiwiLyoqXG4gKiDojrflj5YzNui/m+WItuaXpeacn+Wtl+espuS4slxuICogQG1ldGhvZCBnZXRUaW1lMzZcbiAqIEBwYXJhbSB7RGF0ZX0gW2RhdGVdIOespuWQiOinhOiMg+eahOaXpeacn+Wtl+espuS4suaIluiAheaVsOWtl++8jOS4jeS8oOWPguaVsOWImeS9v+eUqOW9k+WJjeWuouaIt+err+aXtumXtFxuICogQHJldHVybiB7U3RyaW5nfSDovazmiJDkuLozNui/m+WItueahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0VGltZTM2ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9nZXRUaW1lMzYnKTtcbiAqICRnZXRUaW1lMzYoJzIwMjAnKTsgLy8gJ2s0dWphaW8wJ1xuICovXG5cbmZ1bmN0aW9uIGdldFRpbWUzNihkYXRlKSB7XG4gIGRhdGUgPSBkYXRlID8gbmV3IERhdGUoZGF0ZSkgOiBuZXcgRGF0ZSgpO1xuICByZXR1cm4gZGF0ZS5nZXRUaW1lKCkudG9TdHJpbmcoMzYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRpbWUzNjtcbiIsIi8qKlxuICog55Sf5oiQ5LiA5Liq5LiN5LiO5LmL5YmN6YeN5aSN55qE6ZqP5py65a2X56ym5LiyXG4gKiBAbWV0aG9kIGdldFVuaXF1ZUtleVxuICogQHJldHVybnMge1N0cmluZ30g6ZqP5py65a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRVbmlxdWVLZXkgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2dldFVuaXF1ZUtleScpO1xuICogJGdldFVuaXF1ZUtleSgpOyAvLyAnMTY2YWFlMWZhOWYnXG4gKi9cblxudmFyIHRpbWUgPSArbmV3IERhdGUoKTtcbnZhciBpbmRleCA9IDA7XG5cbmZ1bmN0aW9uIGdldFVuaXF1ZUtleSgpIHtcbiAgaW5kZXggKz0gMTtcbiAgcmV0dXJuICh0aW1lICsgKGluZGV4KSkudG9TdHJpbmcoMTYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFVuaXF1ZUtleTtcbiIsIi8qKlxuICog5bCG6am85bOw5qC85byP5Y+Y5Li66L+e5a2X56ym5qC85byPXG4gKiBAbWV0aG9kIGh5cGhlbmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpqbzls7DmoLzlvI/nmoTlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOi/nuWtl+espuagvOW8j+eahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkaHlwaGVuYXRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9oeXBoZW5hdGUnKTtcbiAqICRoeXBoZW5hdGUoJ2xpYktpdFN0ckh5cGhlbmF0ZScpOyAvLyAnbGliLWtpdC1zdHItaHlwaGVuYXRlJ1xuICovXG5cbmZ1bmN0aW9uIGh5cGhlbmF0ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAoJDApIHtcbiAgICByZXR1cm4gJy0nICsgJDAudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwaGVuYXRlO1xuIiwiLyoqXG4gKiAjIOWtl+espuS4suWkhOeQhuS4juWIpOaWrVxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvc3RyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9zdHJcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvc3RyXG4gKiB2YXIgJHN0ciA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHInKTtcbiAqIGNvbnNvbGUuaW5mbygkc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRzdWJzdGl0dXRlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9zdWJzdGl0dXRlJyk7XG4gKi9cblxuZXhwb3J0cy5iTGVuZ3RoID0gcmVxdWlyZSgnLi9iTGVuZ3RoJyk7XG5leHBvcnRzLmRiY1RvU2JjID0gcmVxdWlyZSgnLi9kYmNUb1NiYycpO1xuZXhwb3J0cy5kZWNvZGVIVE1MID0gcmVxdWlyZSgnLi9kZWNvZGVIVE1MJyk7XG5leHBvcnRzLmVuY29kZUhUTUwgPSByZXF1aXJlKCcuL2VuY29kZUhUTUwnKTtcbmV4cG9ydHMuZ2V0Um5kMzYgPSByZXF1aXJlKCcuL2dldFJuZDM2Jyk7XG5leHBvcnRzLmdldFRpbWUzNiA9IHJlcXVpcmUoJy4vZ2V0VGltZTM2Jyk7XG5leHBvcnRzLmdldFVuaXF1ZUtleSA9IHJlcXVpcmUoJy4vZ2V0VW5pcXVlS2V5Jyk7XG5leHBvcnRzLmh5cGhlbmF0ZSA9IHJlcXVpcmUoJy4vaHlwaGVuYXRlJyk7XG5leHBvcnRzLmlwVG9IZXggPSByZXF1aXJlKCcuL2lwVG9IZXgnKTtcbmV4cG9ydHMubGVmdEIgPSByZXF1aXJlKCcuL2xlZnRCJyk7XG5leHBvcnRzLnNpemVPZlVURjhTdHJpbmcgPSByZXF1aXJlKCcuL3NpemVPZlVURjhTdHJpbmcnKTtcbmV4cG9ydHMuc3Vic3RpdHV0ZSA9IHJlcXVpcmUoJy4vc3Vic3RpdHV0ZScpO1xuIiwiLyoqXG4gKiDljYHov5vliLZJUOWcsOWdgOi9rOWNgeWFrei/m+WItlxuICogQG1ldGhvZCBpcFRvSGV4XG4gKiBAcGFyYW0ge1N0cmluZ30gaXAg5Y2B6L+b5Yi25pWw5a2X55qESVBWNOWcsOWdgFxuICogQHJldHVybiB7U3RyaW5nfSAxNui/m+WItuaVsOWtl0lQVjTlnLDlnYBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGlwVG9IZXggPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2lwVG9IZXgnKTtcbiAqICRpcFRvSGV4KCcyNTUuMjU1LjI1NS4yNTUnKTsgLy9yZXR1cm4gJ2ZmZmZmZmZmJ1xuICovXG5cbmZ1bmN0aW9uIGlwVG9IZXgoaXApIHtcbiAgcmV0dXJuIGlwLnJlcGxhY2UoLyhcXGQrKVxcLiovZywgZnVuY3Rpb24gKG1hdGNoLCBudW0pIHtcbiAgICBudW0gPSBwYXJzZUludChudW0sIDEwKSB8fCAwO1xuICAgIG51bSA9IG51bS50b1N0cmluZygxNik7XG4gICAgaWYgKG51bS5sZW5ndGggPCAyKSB7XG4gICAgICBudW0gPSAnMCcgKyBudW07XG4gICAgfVxuICAgIHJldHVybiBudW07XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlwVG9IZXg7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb250cm9sLXJlZ2V4ICovXG4vKipcbiAqIOS7juW3puWIsOWPs+WPluWtl+espuS4su+8jOS4reaWh+eul+S4pOS4quWtl+esplxuICogQG1ldGhvZCBsZWZ0QlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbnNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0clxuICogQGV4YW1wbGVcbiAqIHZhciAkbGVmdEIgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL2xlZnRCJyk7XG4gKiAvL+WQkeaxiee8luiHtOaVrFxuICogJGxlZnRCKCfkuJbnlYznnJ/lkozosJAnLCA2KTsgLy8gJ+S4lueVjOecnydcbiovXG5cbnZhciAkYkxlbmd0aCA9IHJlcXVpcmUoJy4vYkxlbmd0aCcpO1xuXG5mdW5jdGlvbiBsZWZ0QihzdHIsIGxlbnMpIHtcbiAgdmFyIHMgPSBzdHIucmVwbGFjZSgvXFwqL2csICcgJylcbiAgICAucmVwbGFjZSgvW15cXHgwMC1cXHhmZl0vZywgJyoqJyk7XG4gIHN0ciA9IHN0ci5zbGljZSgwLCBzLnNsaWNlKDAsIGxlbnMpXG4gICAgLnJlcGxhY2UoL1xcKlxcKi9nLCAnICcpXG4gICAgLnJlcGxhY2UoL1xcKi9nLCAnJykubGVuZ3RoKTtcbiAgaWYgKCRiTGVuZ3RoKHN0cikgPiBsZW5zICYmIGxlbnMgPiAwKSB7XG4gICAgc3RyID0gc3RyLnNsaWNlKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxlZnRCO1xuIiwiLyoqXG4gKiDlj5blrZfnrKbkuLIgdXRmOCDnvJbnoIHplb/luqbvvIxmcm9tIOeOi+mbhum5hFxuICogQG1ldGhvZCBzaXplT2ZVVEY4U3RyaW5nXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7TnVtYmVyfSDlrZfnrKbkuLLplb/luqZcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNpemVPZlVURjhTdHJpbmcgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL3NpemVPZlVURjhTdHJpbmcnKTtcbiAqICRzaXplT2ZVVEY4U3RyaW5nKCfkuK3mlodjYycpOyAvL3JldHVybiA4XG4qL1xuXG5mdW5jdGlvbiBzaXplT2ZVVEY4U3RyaW5nKHN0cikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB1bmVzY2FwZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpLmxlbmd0aFxuICAgICAgOiBuZXcgQXJyYXlCdWZmZXIoc3RyLCAndXRmOCcpLmxlbmd0aFxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpemVPZlVURjhTdHJpbmc7XG4iLCIvKipcbiAqIOeugOWNleaooeadv+WHveaVsFxuICogQG1ldGhvZCBzdWJzdGl0dXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOimgeabv+aNouaooeadv+eahOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDmqKHmnb/lr7nlupTnmoTmlbDmja7lr7nosaFcbiAqIEBwYXJhbSB7UmVnRXhwfSBbcmVnPS9cXFxcP1xce1xceyhbXnt9XSspXFx9XFx9L2ddIOino+aekOaooeadv+eahOato+WImeihqOi+vuW8j1xuICogQHJldHVybiB7U3RyaW5nfSDmm7/mjaLkuobmqKHmnb/nmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHN1YnN0aXR1dGUgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvc3RyL3N1YnN0aXR1dGUnKTtcbiAqICRzdWJzdGl0dXRlKCd7e2NpdHl9feasoui/juaCqCcsIHtjaXR5OifljJfkuqwnfSk7IC8vICfljJfkuqzmrKLov47mgqgnXG4gKi9cblxuZnVuY3Rpb24gc3Vic3RpdHV0ZShzdHIsIG9iaiwgcmVnKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShyZWcgfHwgKC9cXFxcP1xce1xceyhbXnt9XSspXFx9XFx9L2cpLCBmdW5jdGlvbiAobWF0Y2gsIG5hbWUpIHtcbiAgICBpZiAobWF0Y2guY2hhckF0KDApID09PSAnXFxcXCcpIHtcbiAgICAgIHJldHVybiBtYXRjaC5zbGljZSgxKTtcbiAgICB9XG4gICAgLy8g5rOo5oSP77yab2JqW25hbWVdICE9IG51bGwg562J5ZCM5LqOIG9ialtuYW1lXSAhPT0gbnVsbCAmJiBvYmpbbmFtZV0gIT09IHVuZGVmaW5lZFxuICAgIHJldHVybiAob2JqW25hbWVdICE9IG51bGwpID8gb2JqW25hbWVdIDogJyc7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1YnN0aXR1dGU7XG4iLCIvKipcbiAqIOaPkOS+m+WAkuiuoeaXtuWZqOe7n+S4gOWwgeijhVxuICogQG1ldGhvZCBjb3VudERvd25cbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOmAiemhuVxuICogQHBhcmFtIHtEYXRlfSBbc3BlYy5iYXNlXSDnn6vmraPml7bpl7TvvIzlpoLmnpzpnIDopoHnlKjmnI3liqHnq6/ml7bpl7Tnn6vmraPlgJLorqHml7bvvIzkvb/nlKjmraTlj4LmlbBcbiAqIEBwYXJhbSB7RGF0ZX0gW3NwZWMudGFyZ2V0PURhdGUubm93KCkgKyAzMDAwXSDnm67moIfml7bpl7RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5pbnRlcnZhbD0xMDAwXSDlgJLorqHml7bop6blj5Hpl7TpmpRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzcGVjLm9uQ2hhbmdlXSDlgJLorqHml7bop6blj5Hlj5jmm7TnmoTkuovku7blm57osINcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzcGVjLm9uU3RvcF0g5YCS6K6h5pe257uT5p2f55qE5Zue6LCDXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlgJLorqHml7blr7nosaHlrp7kvotcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvdW50RG93biA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy90aW1lL2NvdW50RG93bicpO1xuICogdmFyIHRhcmdldCA9IERhdGUubm93KCkgKyA1MDAwO1xuICogdmFyIGNkMSA9ICRjb3VudERvd24oe1xuICogICB0YXJnZXQgOiB0YXJnZXQsXG4gKiAgIG9uQ2hhbmdlIDogZnVuY3Rpb24oZGVsdGEpe1xuICogICAgIGNvbnNvbGUuaW5mbygnY2QxIGNoYW5nZScsIGRlbHRhKTtcbiAqICAgfSxcbiAqICAgb25TdG9wIDogZnVuY3Rpb24oZGVsdGEpe1xuICogICAgIGNvbnNvbGUuaW5mbygnY2QxIHN0b3AnLCBkZWx0YSk7XG4gKiAgIH1cbiAqIH0pO1xuICogc2V0VGltZW91dChmdW5jdGlvbigpe1xuICogICAvL3RyaWdnZXIgc3RvcFxuICogICBjZDEuc3RvcCgpO1xuICogfSwgMjAwMCk7XG4gKiB2YXIgY2QyID0gY291bnREb3duKHtcbiAqICAgdGFyZ2V0IDogdGFyZ2V0LFxuICogICBpbnRlcnZhbCA6IDIwMDAsXG4gKiAgIG9uQ2hhbmdlIDogZnVuY3Rpb24oZGVsdGEpe1xuICogICAgIGNvbnNvbGUuaW5mbygnY2QyIGNoYW5nZScsIGRlbHRhKTtcbiAqICAgfSxcbiAqICAgb25TdG9wIDogZnVuY3Rpb24oZGVsdGEpe1xuICogICAgIGNvbnNvbGUuaW5mbygnY2QyIHN0b3AnLCBkZWx0YSk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbnZhciAkZXJhc2UgPSByZXF1aXJlKCcuLi9hcnIvZXJhc2UnKTtcbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG52YXIgYWxsTW9uaXRvcnMgPSB7fTtcbnZhciBsb2NhbEJhc2VUaW1lID0gRGF0ZS5ub3coKTtcblxuZnVuY3Rpb24gY291bnREb3duKHNwZWMpIHtcbiAgdmFyIHRoYXQgPSB7fTtcblxuICAvLyDkuLrku4DkuYjkuI3kvb/nlKggdGltZUxlZnQg5Y+C5pWw5pu/5o2iIGJhc2Ug5ZKMIHRhcmdldDpcbiAgLy8g5aaC5p6c55SoIHRpbWVMZWZ0IOS9nOS4uuWPguaVsO+8jOiuoeaXtuWZqOWIneWni+WMluS5i+WJjeWmguaenOaciei/m+eoi+mYu+Whnu+8jOacieWPr+iDveS8muWvvOiHtOS4juebruagh+aXtumXtOS6p+eUn+ivr+W3rlxuICAvLyDpobXpnaLlpJrkuKrlrprml7blmajkuIDotbfliJ3lp4vljJbml7bvvIzkvJrlh7rnjrDorqHml7blmajmm7TmlrDkuI3lkIzmraXnmoTnjrDosaHvvIzlkIzml7blvJXlj5HpobXpnaLlpJrlpITmsqHmnInkuIDotbflm57mtYFcbiAgLy8g5L+d55WZ55uu5YmN6L+Z5Liq5pa55qGI77yM55So5LqO6ZyA6KaB57K+56Gu5YCS6K6h5pe255qE5oOF5Ya1XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgYmFzZTogbnVsbCxcbiAgICB0YXJnZXQ6IERhdGUubm93KCkgKyAzMDAwLFxuICAgIGludGVydmFsOiAxMDAwLFxuICAgIG9uQ2hhbmdlOiBudWxsLFxuICAgIG9uU3RvcDogbnVsbCxcbiAgfSwgc3BlYyk7XG5cbiAgdmFyIHRpbWVEaWZmID0gMDtcbiAgdmFyIHRhcmdldCA9ICtuZXcgRGF0ZShjb25mLnRhcmdldCk7XG4gIHZhciBpbnRlcnZhbCA9IHBhcnNlSW50KGNvbmYuaW50ZXJ2YWwsIDEwKSB8fCAwO1xuICB2YXIgb25DaGFuZ2UgPSBjb25mLm9uQ2hhbmdlO1xuICB2YXIgb25TdG9wID0gY29uZi5vblN0b3A7XG5cbiAgLy8g5L2/5YCS6K6h5pe26Kem5Y+R5pe26Ze057K+56Gu5YyWXG4gIC8vIOS9v+eUqOWbuuWumueahOinpuWPkemikeeOh++8jOWHj+WwkemcgOimgeWIm+W7uueahOWumuaXtuWZqFxuICB2YXIgdGltZUludGVydmFsID0gaW50ZXJ2YWw7XG4gIGlmICh0aW1lSW50ZXJ2YWwgPCA1MDApIHtcbiAgICB0aW1lSW50ZXJ2YWwgPSAxMDtcbiAgfSBlbHNlIGlmICh0aW1lSW50ZXJ2YWwgPCA1MDAwKSB7XG4gICAgdGltZUludGVydmFsID0gMTAwO1xuICB9IGVsc2Uge1xuICAgIHRpbWVJbnRlcnZhbCA9IDEwMDA7XG4gIH1cblxuICB2YXIgZGVsdGE7XG4gIHZhciBjdXJVbml0O1xuXG4gIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAobm93KSB7XG4gICAgZGVsdGEgPSB0YXJnZXQgLSBub3c7XG4gICAgdmFyIHVuaXQgPSBNYXRoLmNlaWwoZGVsdGEgLyBpbnRlcnZhbCk7XG4gICAgaWYgKHVuaXQgIT09IGN1clVuaXQpIHtcbiAgICAgIGN1clVuaXQgPSB1bml0O1xuICAgICAgaWYgKHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvbkNoYW5nZShkZWx0YSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiDph43orr7nm67moIfml7bpl7RcbiAgICogQG1ldGhvZCBjb3VudERvd24jc2V0VGFyZ2V0XG4gICAqIEBtZW1iZXJvZiBjb3VudERvd25cbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNkID0gY291bnREb3duKCk7XG4gICAqIHZhciBsb2NhbFRpbWUgPSAnMjAxOS8wMS8wMSc7XG4gICAqIGNkLnNldFRhcmdldChzZXJ2ZXJUaW1lKTtcbiAgICovXG4gIHRoYXQuc2V0VGFyZ2V0ID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICB0YXJnZXQgPSArbmV3IERhdGUodGltZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIOe6oOato+aXtumXtOW3rlxuICAgKiBAbWV0aG9kIGNvdW50RG93biNjb3JyZWN0XG4gICAqIEBtZW1iZXJvZiBjb3VudERvd25cbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNkID0gY291bnREb3duKCk7XG4gICAqIHZhciBzZXJ2ZXJUaW1lID0gJzIwMTkvMDEvMDEnO1xuICAgKiB2YXIgbG9jYWxUaW1lID0gJzIwMjAvMDEvMDEnO1xuICAgKiBjZC5jb3JyZWN0KHNlcnZlclRpbWUpO1xuICAgKiBjZC5jb3JyZWN0KHNlcnZlclRpbWUsIGxvY2FsVGltZSk7XG4gICAqL1xuICB0aGF0LmNvcnJlY3QgPSBmdW5jdGlvbiAoc2VydmVyVGltZSwgbG9jYWxUaW1lKSB7XG4gICAgdmFyIG5vdyA9IGxvY2FsVGltZSA/IG5ldyBEYXRlKGxvY2FsVGltZSkgOiArbmV3IERhdGUoKTtcbiAgICB2YXIgc2VydmVyRGF0ZSA9IHNlcnZlclRpbWUgPyBuZXcgRGF0ZShzZXJ2ZXJUaW1lKSA6IDA7XG4gICAgaWYgKHNlcnZlckRhdGUpIHtcbiAgICAgIHRpbWVEaWZmID0gc2VydmVyRGF0ZSAtIG5vdztcbiAgICB9XG4gIH07XG5cbiAgaWYgKGNvbmYuYmFzZSkge1xuICAgIHRoYXQuY29ycmVjdChjb25mLmJhc2UpO1xuICB9XG5cbiAgdmFyIGNoZWNrID0gZnVuY3Rpb24gKGxvY2FsRGVsdGEpIHtcbiAgICB2YXIgbm93ID0gbG9jYWxCYXNlVGltZSArIHRpbWVEaWZmICsgbG9jYWxEZWx0YTtcbiAgICB1cGRhdGUobm93KTtcbiAgICBpZiAoZGVsdGEgPD0gMCkge1xuICAgICAgdGhhdC5zdG9wKG5vdyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiDlgZzmraLlgJLorqHml7ZcbiAgICogQG1ldGhvZCBjb3VudERvd24jc3RvcFxuICAgKiBAbWVtYmVyb2YgY291bnREb3duXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBjZCA9IGNvdW50RG93bigpO1xuICAgKiBjZC5zdG9wKCk7XG4gICAqL1xuICB0aGF0LnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vYmogPSBhbGxNb25pdG9yc1t0aW1lSW50ZXJ2YWxdO1xuICAgIGlmIChtb2JqICYmIG1vYmoucXVldWUpIHtcbiAgICAgICRlcmFzZShtb2JqLnF1ZXVlLCBjaGVjayk7XG4gICAgfVxuICAgIC8vIG9uU3RvcOS6i+S7tuinpuWPkeW/hemhu+WcqOS7jumYn+WIl+enu+mZpOWbnuiwg+S5i+WQjlxuICAgIC8vIOWQpuWImeW+queOr+aOpeabv+eahOWumuaXtuWZqOS8muW8leWPkeatu+W+queOr1xuICAgIGlmICh0eXBlb2Ygb25TdG9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvblN0b3AoZGVsdGEpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICog6ZSA5q+B5YCS6K6h5pe2XG4gICAqIEBtZXRob2QgY291bnREb3duI2Rlc3Ryb3lcbiAgICogQG1lbWJlcm9mIGNvdW50RG93blxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcbiAgICogY2QuZGVzdHJveSgpO1xuICAgKi9cbiAgdGhhdC5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIG9uQ2hhbmdlID0gbnVsbDtcbiAgICBvblN0b3AgPSBudWxsO1xuICAgIHRoYXQuc3RvcCgpO1xuICB9O1xuXG4gIHZhciBtb25pdG9yID0gYWxsTW9uaXRvcnNbdGltZUludGVydmFsXTtcblxuICBpZiAoIW1vbml0b3IpIHtcbiAgICBtb25pdG9yID0ge307XG4gICAgbW9uaXRvci5xdWV1ZSA9IFtdO1xuICAgIG1vbml0b3IuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgdmFyIG1vYmogPSBhbGxNb25pdG9yc1t0aW1lSW50ZXJ2YWxdO1xuICAgICAgdmFyIGxvY2FsRGVsdGEgPSBub3cgLSBsb2NhbEJhc2VUaW1lO1xuICAgICAgaWYgKG1vYmoucXVldWUubGVuZ3RoKSB7XG4gICAgICAgIC8vIOW+queOr+W9k+S4reS8muWIoOmZpOaVsOe7hOWFg+e0oO+8jOWboOatpOmcgOimgeWFiOWkjeWItuS4gOS4i+aVsOe7hFxuICAgICAgICBtb2JqLnF1ZXVlLnNsaWNlKDApLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgZm4obG9jYWxEZWx0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb2JqLnRpbWVyKTtcbiAgICAgICAgYWxsTW9uaXRvcnNbdGltZUludGVydmFsXSA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSBtb2JqLnRpbWVyO1xuICAgICAgfVxuICAgIH07XG4gICAgYWxsTW9uaXRvcnNbdGltZUludGVydmFsXSA9IG1vbml0b3I7XG4gIH1cblxuICBtb25pdG9yLnF1ZXVlLnB1c2goY2hlY2spO1xuXG4gIGlmICghbW9uaXRvci50aW1lcikge1xuICAgIG1vbml0b3IudGltZXIgPSBzZXRJbnRlcnZhbChtb25pdG9yLmluc3BlY3QsIHRpbWVJbnRlcnZhbCk7XG4gIH1cblxuICBtb25pdG9yLmluc3BlY3QoKTtcblxuICByZXR1cm4gdGhhdDtcbn1cblxuY291bnREb3duLmFsbE1vbml0b3JzID0gYWxsTW9uaXRvcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGNvdW50RG93bjtcbiIsIi8qKlxuICogIyDml7bpl7TlpITnkIbkuI7kuqTkupLlt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUta2l0L3BhY2thZ2VzL3RpbWVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL3RpbWVcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgc3BvcmUta2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQudGltZS5wYXJzZVVuaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS1raXQvcGFja2FnZXMvdGltZVxuICogdmFyICR0aW1lID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUnKTtcbiAqIGNvbnNvbGUuaW5mbygkdGltZS5wYXJzZVVuaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRwYXJzZVVuaXQgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdGltZS9wYXJzZVVuaXQnKTtcbiAqL1xuXG5leHBvcnRzLmNvdW50RG93biA9IHJlcXVpcmUoJy4vY291bnREb3duJyk7XG5leHBvcnRzLnBhcnNlVW5pdCA9IHJlcXVpcmUoJy4vcGFyc2VVbml0Jyk7XG4iLCIvKipcbiAqIOaXtumXtOaVsOWtl+aLhuWIhuS4uuWkqeaXtuWIhuenklxuICogQG1ldGhvZCBwYXJzZVVuaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIOavq+enkuaVsFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMubWF4VW5pdD0nZGF5J10g5ouG5YiG5pe26Ze055qE5pyA5aSn5Y2V5L2N77yM5Y+v6YCJIFsnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCddXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDmi4bliIblrozmiJDnmoTlpKnml7bliIbnp5JcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHBhcnNlVW5pdCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy90aW1lL3BhcnNlVW5pdCcpO1xuICogY29uc29sZS5pbmZvKCAkcGFyc2VVbml0KDEyMzQ1ICogNjc4OTApICk7XG4gKiAvLyBPYmplY3Qge2RheTogOSwgaG91cjogMTYsIG1pbnV0ZTogNDgsIHNlY29uZDogMjIsIG1zOiA1MH1cbiAqIGNvbnNvbGUuaW5mbyggJHBhcnNlVW5pdCgxMjM0NSAqIDY3ODkwLCB7bWF4VW5pdCA6ICdob3VyJ30pICk7XG4gKiAvLyBPYmplY3Qge2hvdXI6IDIzMiwgbWludXRlOiA0OCwgc2Vjb25kOiAyMiwgbXM6IDUwfVxuICovXG5cbnZhciAkbnVtZXJpY2FsID0gcmVxdWlyZSgnLi4vbnVtL251bWVyaWNhbCcpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbnZhciBVTklUID0ge1xuICBkYXk6IDI0ICogNjAgKiA2MCAqIDEwMDAsXG4gIGhvdXI6IDYwICogNjAgKiAxMDAwLFxuICBtaW51dGU6IDYwICogMTAwMCxcbiAgc2Vjb25kOiAxMDAwLFxufTtcblxuZnVuY3Rpb24gcGFyc2VVbml0KHRpbWUsIHNwZWMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICBtYXhVbml0OiAnZGF5JyxcbiAgfSwgc3BlYyk7XG5cbiAgdmFyIGRhdGEgPSB7fTtcbiAgdmFyIG1heFVuaXQgPSAkbnVtZXJpY2FsKFVOSVRbY29uZi5tYXhVbml0XSk7XG4gIHZhciB1RGF5ID0gVU5JVC5kYXk7XG4gIHZhciB1SG91ciA9IFVOSVQuaG91cjtcbiAgdmFyIHVNaW51dGUgPSBVTklULm1pbnV0ZTtcbiAgdmFyIHVTZWNvbmQgPSBVTklULnNlY29uZDtcblxuICBpZiAobWF4VW5pdCA+PSB1RGF5KSB7XG4gICAgdGltZSA9ICRudW1lcmljYWwodGltZSk7XG4gICAgZGF0YS5kYXkgPSBNYXRoLmZsb29yKHRpbWUgLyB1RGF5KTtcbiAgfVxuXG4gIGlmIChtYXhVbml0ID49IHVIb3VyKSB7XG4gICAgdGltZSAtPSAkbnVtZXJpY2FsKGRhdGEuZGF5ICogdURheSk7XG4gICAgZGF0YS5ob3VyID0gTWF0aC5mbG9vcih0aW1lIC8gdUhvdXIpO1xuICB9XG5cbiAgaWYgKG1heFVuaXQgPj0gdU1pbnV0ZSkge1xuICAgIHRpbWUgLT0gJG51bWVyaWNhbChkYXRhLmhvdXIgKiB1SG91cik7XG4gICAgZGF0YS5taW51dGUgPSBNYXRoLmZsb29yKHRpbWUgLyB1TWludXRlKTtcbiAgfVxuXG4gIGlmIChtYXhVbml0ID49IHVTZWNvbmQpIHtcbiAgICB0aW1lIC09ICRudW1lcmljYWwoZGF0YS5taW51dGUgKiB1TWludXRlKTtcbiAgICBkYXRhLnNlY29uZCA9IE1hdGguZmxvb3IodGltZSAvIHVTZWNvbmQpO1xuICB9XG5cbiAgZGF0YS5tcyA9IHRpbWUgLSBkYXRhLnNlY29uZCAqIHVTZWNvbmQ7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VVbml0O1xuIiwiLyoqXG4gKiBBcnJheUJ1ZmZlcui9rDE26L+b5Yi25a2X56ym5LiyXG4gKiBAbWV0aG9kIGFiVG9IZXhcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGJ1ZmZlciDpnIDopoHovazmjaLnmoQgQXJyYXlCdWZmZXJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IDE26L+b5Yi25a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRhYlRvSGV4ID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvYWJUb0hleCcpO1xuICogdmFyIGFiID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICogdmFyIGR2ID0gbmV3IERhdGFWaWV3KGFiKTtcbiAqIGR2LnNldFVpbnQ4KDAsIDE3MSk7XG4gKiBkdi5zZXRVaW50OCgxLCAyMDUpO1xuICogJGFiVG9IZXgoYWIpOyAvLyA9PiAnYWJjZCdcbiAqL1xuXG5mdW5jdGlvbiBhYlRvSGV4KGJ1ZmZlcikge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJ1ZmZlcikgIT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXScpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgdmFyIHU4YXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgdmFyIGZuID0gZnVuY3Rpb24gKGJpdCkge1xuICAgIHJldHVybiAoJzAwJyArIGJpdC50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgfTtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh1OGFyciwgZm4pLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFiVG9IZXg7XG4iLCIvKipcbiAqIEFTQ0lJ5a2X56ym5Liy6L2sMTbov5vliLblrZfnrKbkuLJcbiAqIEBtZXRob2QgYXNjVG9IZXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg6ZyA6KaB6L2s5o2i55qEQVNDSUnlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IDE26L+b5Yi25a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRhc2NUb0hleCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2FzY1RvSGV4Jyk7XG4gKiAkYXNjVG9IZXgoKTsgLy8gPT4gJydcbiAqICRhc2NUb0hleCgnKisnKTsgLy8gPT4gJzJhMmInXG4gKi9cblxuZnVuY3Rpb24gYXNjVG9IZXgoc3RyKSB7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHZhciBoZXggPSAnJztcbiAgdmFyIGluZGV4O1xuICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCArPSAxKSB7XG4gICAgdmFyIGludCA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICB2YXIgY29kZSA9IChpbnQpLnRvU3RyaW5nKDE2KTtcbiAgICBoZXggKz0gY29kZTtcbiAgfVxuICByZXR1cm4gaGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzY1RvSGV4O1xuIiwiLyoqXG4gKiAxNui/m+WItuWtl+espuS4sui9rEFycmF5QnVmZmVyXG4gKiBAbWV0aG9kIGhleFRvQWJcbiAqIEBzZWUgaHR0cHM6Ly9jYW5pdXNlLmNvbS8jc2VhcmNoPUFycmF5QnVmZmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmcgOimgei9rOaNoueahDE26L+b5Yi25a2X56ym5LiyXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IOiiq+i9rOaNouWQjueahCBBcnJheUJ1ZmZlciDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGhleFRvQWIgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oZXhUb0FiJyk7XG4gKiB2YXIgYWIgPSAkaGV4VG9BYigpO1xuICogYWIuYnl0ZUxlbmd0aDsgLy8gPT4gMFxuICogYWIgPSAkaGV4VG9BYignYWJjZCcpO1xuICogdmFyIGR2ID0gbmV3IERhdGFWaWV3KGFiKTtcbiAqIGFiLmJ5dGVMZW5ndGg7IC8vID0+IDJcbiAqIGR2LmdldFVpbnQ4KDApOyAvLyA9PiAxNzFcbiAqIGR2LmdldFVpbnQ4KDEpOyAvLyA9PiAyMDVcbiAqL1xuXG5mdW5jdGlvbiBoZXhUb0FiKHN0cikge1xuICBpZiAoIXN0cikge1xuICAgIHJldHVybiBuZXcgQXJyYXlCdWZmZXIoMCk7XG4gIH1cbiAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihNYXRoLmNlaWwoc3RyLmxlbmd0aCAvIDIpKTtcbiAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBpO1xuICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNvZGUgPSBwYXJzZUludChzdHIuc3Vic3RyKGksIDIpLCAxNik7XG4gICAgZGF0YVZpZXcuc2V0VWludDgoaW5kZXgsIGNvZGUpO1xuICAgIGluZGV4ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXhUb0FiO1xuIiwiLyoqXG4gKiAxNui/m+WItuWtl+espuS4sui9rEFTQ0lJ5a2X56ym5LiyXG4gKiBAbWV0aG9kIGhleFRvQXNjXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmcgOimgei9rOaNoueahDE26L+b5Yi25a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBBU0NJSeWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkaGV4VG9Bc2MgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oZXhUb0FzYycpO1xuICogJGhleFRvQXNjKCk7IC8vID0+ICcnXG4gKiAkaGV4VG9Bc2MoJzJhMmInKTsgLy8gPT4gJyorJ1xuICovXG5cbmZ1bmN0aW9uIGhleFRvQXNjKGhleCkge1xuICBpZiAoIWhleCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gaGV4LnJlcGxhY2UoL1tcXGRhLWZdezJ9L2dpLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICB2YXIgaW50ID0gcGFyc2VJbnQobWF0Y2gsIDE2KTtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShpbnQpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoZXhUb0FzYztcbiIsIi8qKlxuICogSFNM6aKc6Imy5YC86L2s5o2i5Li6UkdCXG4gKiAtIOaNoueul+WFrOW8j+aUuee8luiHqiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hTTF9jb2xvcl9zcGFjZS5cbiAqIC0gaCwgcywg5ZKMIGwg6K6+5a6a5ZyoIFswLCAxXSDkuYvpl7RcbiAqIC0g6L+U5Zue55qEIHIsIGcsIOWSjCBiIOWcqCBbMCwgMjU1XeS5i+mXtFxuICogQG1ldGhvZCBoc2xUb1JnYlxuICogQHBhcmFtIHtOdW1iZXJ9IGgg6Imy55u4XG4gKiBAcGFyYW0ge051bWJlcn0gcyDppbHlkozluqZcbiAqIEBwYXJhbSB7TnVtYmVyfSBsIOS6ruW6plxuICogQHJldHVybnMge0FycmF5fSBSR0LoibLlgLzmlbDlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGhzbFRvUmdiID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaHNsVG9SZ2InKTtcbiAqICRoc2xUb1JnYigwLCAwLCAwKTsgLy8gPT4gWzAsMCwwXVxuICogJGhzbFRvUmdiKDAsIDAsIDEpOyAvLyA9PiBbMjU1LDI1NSwyNTVdXG4gKiAkaHNsVG9SZ2IoMC41NTU1NTU1NTU1NTU1NTU1LCAwLjkzNzQ5OTk5OTk5OTk5OTksIDAuNjg2Mjc0NTA5ODAzOTIxNik7IC8vID0+IFsxMDAsMjAwLDI1MF1cbiAqL1xuXG5mdW5jdGlvbiBodWVUb1JnYihwLCBxLCB0KSB7XG4gIGlmICh0IDwgMCkgdCArPSAxO1xuICBpZiAodCA+IDEpIHQgLT0gMTtcbiAgaWYgKHQgPCAxIC8gNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gIGlmICh0IDwgMSAvIDIpIHJldHVybiBxO1xuICBpZiAodCA8IDIgLyAzKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDY7XG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBoc2xUb1JnYihoLCBzLCBsKSB7XG4gIHZhciByO1xuICB2YXIgZztcbiAgdmFyIGI7XG5cbiAgaWYgKHMgPT09IDApIHtcbiAgICAvLyBhY2hyb21hdGljXG4gICAgciA9IGw7XG4gICAgZyA9IGw7XG4gICAgYiA9IGw7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgIHZhciBwID0gMiAqIGwgLSBxO1xuICAgIHIgPSBodWVUb1JnYihwLCBxLCBoICsgMSAvIDMpO1xuICAgIGcgPSBodWVUb1JnYihwLCBxLCBoKTtcbiAgICBiID0gaHVlVG9SZ2IocCwgcSwgaCAtIDEgLyAzKTtcbiAgfVxuICByZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhzbFRvUmdiO1xuIiwiLyoqXG4gKiAjIOWFtuS7luW3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS1raXQvcGFja2FnZXMvdXRpbFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdXRpbFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBzcG9yZS1raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnc3BvcmUta2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC51dGlsLmhzbFRvUmdiKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgc3BvcmUta2l0L3BhY2thZ2VzL3V0aWxcbiAqIHZhciAkdXRpbCA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsJyk7XG4gKiBjb25zb2xlLmluZm8oJHV0aWwuaHNsVG9SZ2IpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRoc2xUb1JnYiA9IHJlcXVpcmUoJ3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2hzbFRvUmdiJyk7XG4gKi9cblxuZXhwb3J0cy5hYlRvSGV4ID0gcmVxdWlyZSgnLi9hYlRvSGV4Jyk7XG5leHBvcnRzLmFzY1RvSGV4ID0gcmVxdWlyZSgnLi9hc2NUb0hleCcpO1xuZXhwb3J0cy5oZXhUb0FiID0gcmVxdWlyZSgnLi9oZXhUb0FiJyk7XG5leHBvcnRzLmhleFRvQXNjID0gcmVxdWlyZSgnLi9oZXhUb0FzYycpO1xuZXhwb3J0cy5oc2xUb1JnYiA9IHJlcXVpcmUoJy4vaHNsVG9SZ2InKTtcbmV4cG9ydHMuam9iID0gcmVxdWlyZSgnLi9qb2InKTtcbmV4cG9ydHMubWVhc3VyZURpc3RhbmNlID0gcmVxdWlyZSgnLi9tZWFzdXJlRGlzdGFuY2UnKTtcbmV4cG9ydHMucmdiVG9Ic2wgPSByZXF1aXJlKCcuL3JnYlRvSHNsJyk7XG4iLCIvKipcbiAqIOS7u+WKoeWIhuaXtuaJp+ihjFxuICogLSDkuIDmlrnpnaLpgb/lhY3ljZXmrKFyZWZsb3fmtYHnqIvmiafooYzlpKrlpJpqc+S7u+WKoeWvvOiHtOa1j+iniOWZqOWNoeatu1xuICogLSDlj6bkuIDmlrnpnaLljZXkuKrku7vliqHnmoTmiqXplJnkuI3kvJrlvbHlk43lkI7nu63ku7vliqHnmoTmiafooYxcbiAqIEBtZXRob2Qgam9iXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDku7vliqHlh73mlbBcbiAqIEByZXR1cm5zIHtPYmplY3R9IOS7u+WKoemYn+WIl+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkam9iID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvam9iJyk7XG4gKiAkam9iKGZ1bmN0aW9uKCkge1xuICogICAvL3Rhc2sxIHN0YXJ0XG4gKiB9KTtcbiAqICRqb2IoZnVuY3Rpb24oKSB7XG4gKiAgIC8vdGFzazIgc3RhcnRcbiAqIH0pO1xuICovXG5cbnZhciBtYW5hZ2VyID0ge307XG5cbm1hbmFnZXIucXVldWUgPSBbXTtcblxubWFuYWdlci5hZGQgPSBmdW5jdGlvbiAoZm4sIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG1hbmFnZXIucXVldWUucHVzaCh7XG4gICAgZm46IGZuLFxuICAgIGNvbmY6IG9wdGlvbnMsXG4gIH0pO1xuICBtYW5hZ2VyLnN0ZXAoKTtcbn07XG5cbm1hbmFnZXIuc3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFtYW5hZ2VyLnF1ZXVlLmxlbmd0aCB8fCBtYW5hZ2VyLnRpbWVyKSB7IHJldHVybjsgfVxuICBtYW5hZ2VyLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSBtYW5hZ2VyLnF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtLmZuICYmIHR5cGVvZiBpdGVtLmZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGl0ZW0uZm4uY2FsbChudWxsKTtcbiAgICAgIH1cbiAgICAgIG1hbmFnZXIudGltZXIgPSBudWxsO1xuICAgICAgbWFuYWdlci5zdGVwKCk7XG4gICAgfVxuICB9LCAxKTtcbn07XG5cbmZ1bmN0aW9uIGpvYihmbiwgb3B0aW9ucykge1xuICBtYW5hZ2VyLmFkZChmbiwgb3B0aW9ucyk7XG4gIHJldHVybiBtYW5hZ2VyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGpvYjtcbiIsIi8qKlxuICog5rWL6YeP5Zyw55CG5Z2Q5qCH55qE6Led56a7XG4gKiBAbWV0aG9kIG1lYXN1cmVEaXN0YW5jZVxuICogQHBhcmFtIHtOdW1iZXJ9IGxhdDEg5Z2Q5qCHMeeyvuW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxuZzEg5Z2Q5qCHMee6rOW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxhdDIg5Z2Q5qCHMueyvuW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxuZzIg5Z2Q5qCHMue6rOW6plxuICogQHJldHVybnMge051bWJlcn0gMuS4quWdkOagh+S5i+mXtOeahOi3neemu++8iOWNg+exs++8iVxuICogQGV4YW1wbGVcbiAqIHZhciAkbWVhc3VyZURpc3RhbmNlID0gcmVxdWlyZSgnc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvbWVhc3VyZURpc3RhbmNlJyk7XG4gKiB2YXIgZGlzdGFuY2UgPSAkbWVhc3VyZURpc3RhbmNlKDAsIDAsIDEwMCwgMTAwKTtcbiAqIC8vIDk4MjYuNDAwNjUxMDk5NzhcbiAqL1xuXG5mdW5jdGlvbiBtZWFzdXJlRGlzdGFuY2UobGF0MSwgbG5nMSwgbGF0MiwgbG5nMikge1xuICB2YXIgcmFkTGF0MSA9IChsYXQxICogTWF0aC5QSSkgLyAxODAuMDtcbiAgdmFyIHJhZExhdDIgPSAobGF0MiAqIE1hdGguUEkpIC8gMTgwLjA7XG4gIHZhciBhID0gcmFkTGF0MSAtIHJhZExhdDI7XG4gIHZhciBiID0gKGxuZzEgKiBNYXRoLlBJKSAvIDE4MC4wIC0gKGxuZzIgKiBNYXRoLlBJKSAvIDE4MC4wO1xuICB2YXIgcG93VmFsID0gTWF0aC5wb3coTWF0aC5zaW4oYSAvIDIpLCAyKTtcbiAgdmFyIGNjcFZhbCA9IE1hdGguY29zKHJhZExhdDEpICogTWF0aC5jb3MocmFkTGF0MikgKiBNYXRoLnBvdyhNYXRoLnNpbihiIC8gMiksIDIpO1xuICB2YXIgc3FydFZhbCA9IE1hdGguc3FydChwb3dWYWwgKyBjY3BWYWwpO1xuICB2YXIgcyA9IDIgKiBNYXRoLmFzaW4oc3FydFZhbCk7XG4gIC8vIOWcsOeQg+WNiuW+hFxuICBzICo9IDYzNzguMTM3O1xuICByZXR1cm4gcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZWFzdXJlRGlzdGFuY2U7XG4iLCIvKipcbiAqIFJHQiDpopzoibLlgLzovazmjaLkuLogSFNMLlxuICogLSDovazmjaLlhazlvI/lj4LogIPoh6ogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfY29sb3Jfc3BhY2UuXG4gKiAtIHIsIGcsIOWSjCBiIOmcgOimgeWcqCBbMCwgMjU1XSDojIPlm7TlhoVcbiAqIC0g6L+U5Zue55qEIGgsIHMsIOWSjCBsIOWcqCBbMCwgMV0g5LmL6Ze0XG4gKiBAcGFyYW0ge051bWJlcn0gciDnuqLoibLoibLlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBnIOe7v+iJsuiJsuWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IGIg6JOd6Imy6Imy5YC8XG4gKiBAcmV0dXJucyB7QXJyYXl9IEhTTOWQhOWAvOaVsOe7hFxuICogQGV4YW1wbGVcbiAqIHZhciAkcmdiVG9Ic2wgPSByZXF1aXJlKCdzcG9yZS1raXQvcGFja2FnZXMvdXRpbC9yZ2JUb0hzbCcpO1xuICogJHJnYlRvSHNsKDEwMCwgMjAwLCAyNTApOyAvLyA9PiBbMC41NTU1NTU1NTU1NTU1NTU1LDAuOTM3NDk5OTk5OTk5OTk5OSwwLjY4NjI3NDUwOTgwMzkyMTZdXG4gKiAkcmdiVG9Ic2woMCwgMCwgMCk7IC8vID0+IFswLDAsMF1cbiAqICRyZ2JUb0hzbCgyNTUsIDI1NSwgMjU1KTsgLy8gPT4gWzAsMCwxXVxuICovXG5cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcbiAgciAvPSAyNTU7XG4gIGcgLz0gMjU1O1xuICBiIC89IDI1NTtcbiAgdmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICB2YXIgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gIHZhciBoO1xuICB2YXIgcztcbiAgdmFyIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cbiAgaWYgKG1heCA9PT0gbWluKSB7XG4gICAgLy8gYWNocm9tYXRpY1xuICAgIGggPSAwO1xuICAgIHMgPSAwO1xuICB9IGVsc2Uge1xuICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgIHMgPSBsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKTtcbiAgICBpZiAobWF4ID09PSByKSB7XG4gICAgICBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7XG4gICAgfSBlbHNlIGlmIChtYXggPT09IGcpIHtcbiAgICAgIGggPSAoYiAtIHIpIC8gZCArIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGggPSAociAtIGcpIC8gZCArIDQ7XG4gICAgfVxuICAgIGggLz0gNjtcbiAgfVxuXG4gIHJldHVybiBbaCwgcywgbF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmdiVG9Ic2w7XG4iXX0=
(1)
});
