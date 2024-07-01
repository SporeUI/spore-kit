!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sporeKit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.app = require('./packages/app');
exports.arr = require('./packages/arr');
exports.cookie = require('./packages/cookie');
exports.date = require('./packages/date');
exports.dom = require('./packages/dom');
exports.env = require('./packages/env');
exports.evt = require('./packages/evt');
exports.fn = require('./packages/fn');
exports.fx = require('./packages/fx');
exports.io = require('./packages/io');
exports.location = require('./packages/location');
exports.mvc = require('./packages/mvc');
exports.num = require('./packages/num');
exports.obj = require('./packages/obj');
exports.str = require('./packages/str');
exports.time = require('./packages/time');
exports.util = require('./packages/util');

},{"./packages/app":12,"./packages/arr":18,"./packages/cookie":20,"./packages/date":26,"./packages/dom":27,"./packages/env":34,"./packages/evt":41,"./packages/fn":46,"./packages/fx":56,"./packages/io":64,"./packages/location":67,"./packages/mvc":72,"./packages/num":79,"./packages/obj":88,"./packages/str":100,"./packages/time":107,"./packages/util":115}],2:[function(require,module,exports){
var support = require('dom-support')
var getDocument = require('get-document')
var withinElement = require('within-element')

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

},{"dom-support":3,"get-document":5,"within-element":10}],3:[function(require,module,exports){
var domready = require('domready')

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

},{"domready":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){
/*! js-cookie v3.0.5 | MIT */
;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global.Cookies;
    var exports = global.Cookies = factory();
    exports.noConflict = function () { global.Cookies = current; return exports; };
  })());
})(this, (function () { 'use strict';

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
    function set (name, value, attributes) {
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

      name = encodeURIComponent(name)
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
        name + '=' + converter.write(value, name) + stringifiedAttributes)
    }

    function get (name) {
      if (typeof document === 'undefined' || (arguments.length && !name)) {
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
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);

          if (name === found) {
            break
          }
        } catch (e) {}
      }

      return name ? jar[name] : jar
    }

    return Object.create(
      {
        set,
        get,
        remove: function (name, attributes) {
          set(
            name,
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

}));

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
(function (global){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
  , CRHTLF = /[\n\r\t]/g
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , port = /:\d+$/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/;

/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
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
  [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
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
  address = address.replace(CRHTLF, '');
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
  address = address.replace(CRHTLF, '');

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
      index = parse === '@'
        ? address.lastIndexOf(parse)
        : address.indexOf(parse);

      if (~index) {
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
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));

      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password))
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;
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

      if (port.test(value)) {
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

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username +':'+ url.password : url.username;

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
    , host = url.host
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result =
    protocol +
    ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  } else if (url.password) {
    result += ':'+ url.password;
    result += '@';
  } else if (
    url.protocol !== 'file:' &&
    isSpecial(url.protocol) &&
    !host &&
    url.pathname !== '/'
  ) {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  }

  //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //
  if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
    host += ':';
  }

  result += host + url.pathname;

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
},{"querystringify":7,"requires-port":8}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){
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
 * @method app/callUp
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
 * var $callUp = require('@spore-ui/kit/packages/app/callUp');
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

var $assign = require('../obj/assign');
var $browser = require('../env/browser');

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

},{"../env/browser":31,"../obj/assign":82}],12:[function(require,module,exports){
/**
 * 处理与客户端相关的交互
 * @module spore-ui/kit/packages/app
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/app
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.app.callUp);
 *
 * // 单独引入 @spore-ui/kit/packages/app
 * var $app = require('@spore-ui/kit/packages/app');
 * console.info($app.callUp);
 *
 * // 单独引入一个方法
 * var $callUp = require('@spore-ui/kit/packages/app/callUp');
 */

exports.callUp = require('./callUp');

},{"./callUp":11}],13:[function(require,module,exports){
/**
 * 确认对象是否在数组中
 * @method arr/contains
 * @param {Array} arr 要操作的数组
 * @param {*} item 要搜索的对象
 * @returns {Boolean} 如果对象在数组中，返回 true
 * @example
 * var $contains = require('@spore-ui/kit/packages/arr/$contains');
 * console.info($contains([1,2,3,4,5], 3)); // true
 */

function contains(arr, item) {
  var index = arr.indexOf(item);
  return index >= 0;
}

module.exports = contains;

},{}],14:[function(require,module,exports){
/**
 * 删除数组中的对象
 * @method arr/erase
 * @param {Array} arr 要操作的数组
 * @param {*} item 要清除的对象
 * @returns {Number} 对象原本所在位置
 * @example
 * var $erase = require('@spore-ui/kit/packages/arr/erase');
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

},{}],15:[function(require,module,exports){
/**
 * 查找符合条件的元素在数组中的位置
 * @method arr/find
 * @param {Array} arr 要操作的数组
 * @param {Function} fn 条件函数
 * @param {Object} [context] 函数的this指向
 * @return {Array} 符合条件的元素在数组中的位置
 * @example
 * var $find = require('@spore-ui/kit/packages/arr/find');
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

},{}],16:[function(require,module,exports){
/**
 * 数组扁平化
 * @method arr/flatten
 * @param {array} arr 要操作的数组
 * @returns {array} 经过扁平化处理的数组
 * @example
 * var $flatten = require('@spore-ui/kit/packages/arr/flatten');
 * console.info($flatten([1, [2,3], [4,5]])); // [1,2,3,4,5]
 */

var $type = require('../obj/type');

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

},{"../obj/type":91}],17:[function(require,module,exports){
/**
 * 确认对象是否在数组中，不存在则将对象插入到数组中
 * @method arr/include
 * @param {Array} arr 要操作的数组
 * @param {*} item 要插入的对象
 * @returns {Array} 经过处理的源数组
 * @example
 * var $include = require('@spore-ui/kit/packages/arr/include');
 * console.info($include([1,2,3],4)); // [1,2,3,4]
 * console.info($include([1,2,3],3)); // [1,2,3]
 */

var $contains = require('./contains');

function include(arr, item) {
  if (!$contains(arr, item)) {
    arr.push(item);
  }
  return arr;
}

module.exports = include;

},{"./contains":13}],18:[function(require,module,exports){
/**
 * 类数组对象相关工具函数
 * @module spore-ui/kit/packages/arr
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/arr
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.arr.contains);
 *
 * // 单独引入 @spore-ui/kit/packages/arr
 * var $arr = require('@spore-ui/kit/packages/arr');
 * console.info($arr.contains);
 *
 * // 单独引入一个方法
 * var $contains = require('@spore-ui/kit/packages/arr/contains');
 */

exports.contains = require('./contains');
exports.erase = require('./erase');
exports.find = require('./find');
exports.flatten = require('./flatten');
exports.include = require('./include');

},{"./contains":13,"./erase":14,"./find":15,"./flatten":16,"./include":17}],19:[function(require,module,exports){
/**
 * 提供对 cookie 的读写能力
 * - 写入时自动用 encodeURIComponent 编码
 * - 读取时自动用 decodeURIComponent 解码
 * @module cookie/cookie
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * var $cookie = require('@spore-ui/kit/packages/cookie/cookie');
 * $cookie.set('name', '中文', {
 *   expires: 1
 * });
 * $cookie.read('name') // '中文'
 */

var Cookie = require('js-cookie');

var instance = Cookie;

if (Cookie.withConverter) {
  instance = Cookie.withConverter({
    read: function (val) {
      return decodeURIComponent(val);
    },
    write: function (val) {
      return encodeURIComponent(val);
    },
  });
}

module.exports = instance;

},{"js-cookie":6}],20:[function(require,module,exports){
/**
 * 本地存储相关工具函数
 * @module spore-ui/kit/packages/cookie
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/cookie
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.cookie.cookie);
 *
 * // 单独引入 spore-ui/kit/packages/cookie
 * var $cookie = require('@spore-ui/kit/packages/cookie');
 * console.info($cookie.cookie);
 *
 * // 单独引入一个工具对象
 * var $cookie = require('@spore-ui/kit/packages/cookie/cookie');
 */

exports.cookie = require('./cookie');
exports.origin = require('./origin');

},{"./cookie":19,"./origin":21}],21:[function(require,module,exports){
/**
 * 提供对 cookie 的读写能力
 * - 此模块直接提供 js-cookie 的原生能力，不做任何自动编解码
 * @module cookie/origin
 * @see https://www.npmjs.com/package/js-cookie
 * @example
 * var $cookie = require('@spore-ui/kit/packages/cookie/origin');
 * $cookie.set('name', 'value', {
 *   expires: 1
 * });
 * $cookie.read('name') // 'value'
 */
module.exports = require('js-cookie');

},{"js-cookie":6}],22:[function(require,module,exports){
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
 * @method date/format
 * @param {Date} dobj 日期对象，或者可以被转换为日期对象的数据
 * @param {Object} [spec] 格式化选项
 * @param {Array} [spec.weekday='日一二三四五六'.split('')] 一周内各天对应名称，顺序从周日算起
 * @param {String} [spec.template='{{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}'] 格式化模板
 * @return {String} 格式化完成的字符串
 * @example
 * var $format = require('@spore-ui/kit/packages/date/format');
 * console.info(
 *   $format(new Date(),{
 *     template : '{{YYYY}}年{{MM}}月{{DD}}日 周{{d}} {{hh}}时{{mm}}分{{ss}}秒'
 *   })
 * );
 * // 2015年09月09日 周三 14时19分42秒
 */

var $assign = require('../obj/assign');
var $substitute = require('../str/substitute');
var $fixTo = require('../num/fixTo');
var $getUTCDate = require('./getUTCDate');

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

},{"../num/fixTo":78,"../obj/assign":82,"../str/substitute":105,"./getUTCDate":25}],23:[function(require,module,exports){
/**
 * 获取过去一段时间的起始日期，如3月前第1天，2周前第1天，3小时前整点
 * @method date/getLastStart
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @param {Number} count 多少单位时间之前
 * @returns {Date} 最近单位时间的起始时间对象
 * @example
 * var $getLastStart = require('@spore-ui/kit/packages/date/getLastStart');
 * var time = $getLastStart(
 *   new Date('2018-10-25'),
 *   'month',
 *   0
 * ).getTime(); // 1538323200000
 * new Date(time); // Mon Oct 01 2018 00:00:00 GMT+0800 (中国标准时间)
 */

var $getTimeSplit = require('./getTimeSplit');
var $getUTCDate = require('./getUTCDate');

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

},{"./getTimeSplit":24,"./getUTCDate":25}],24:[function(require,module,exports){
/**
 * 获取某个时间的 整年|整月|整日|整时|整分 时间对象
 * @method date/getTimeSplit
 * @param {Number|Date} time 实际时间
 * @param {String} type 单位时间类型，可选 ['year', 'month', 'week', 'day', 'hour']
 * @returns {Date} 时间整点对象
 * @example
 * var $getTimeSplit = require('@spore-ui/kit/packages/date/getTimeSplit');
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
var $getUTCDate = require('./getUTCDate');

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

},{"./getUTCDate":25}],25:[function(require,module,exports){
/**
 * 获取一个时间对象，其年月周日时分秒等 UTC 值与北京时间保持一致。
 * 解决不同服务器时区不一致场景下，可能会导致日期计算不一致的问题.
 * @method date/getUTCDate
 * @param {Number|Date} time 实际时间
 * @returns {Date} UTC时间
 * @example
 * var $getUTCDate = require('@spore-ui/kit/packages/date/getUTCDate');
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

},{}],26:[function(require,module,exports){
/**
 * 日期相关工具
 * @module spore-ui/kit/packages/date
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/date
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.date.format);
 *
 * // 单独引入 @spore-ui/kit/packages/date
 * var $date = require('@spore-ui/kit/packages/date');
 * console.info($date.format);
 *
 * // 单独引入一个方法
 * var $format = require('@spore-ui/kit/packages/date/format');
 */

exports.format = require('./format');
exports.getLastStart = require('./getLastStart');
exports.getTimeSplit = require('./getTimeSplit');

},{"./format":22,"./getLastStart":23,"./getTimeSplit":24}],27:[function(require,module,exports){
/**
 * DOM 操作相关工具函数
 * @module spore-ui/kit/packages/dom
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/dom
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.dom.isNode);
 *
 * // 单独引入 @spore-ui/kit/packages/dom
 * var $dom = require('@spore-ui/kit/packages/dom');
 * console.info($dom.isNode);
 *
 * // 单独引入一个方法
 * var $isNode = require('@spore-ui/kit/packages/dom/isNode');
 */

exports.isNode = require('./isNode');
exports.offset = require('./offset');
exports.scrollLimit = require('./scrollLimit');

},{"./isNode":28,"./offset":29,"./scrollLimit":30}],28:[function(require,module,exports){
/**
 * 判断对象是否为dom元素
 * @method dom/isNode
 * @param {Object} node 要判断的对象
 * @return {Boolean} 是否为dom元素
 * @example
 * var $isNode = require('@spore-ui/kit/packages/dom/isNode');
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

},{}],29:[function(require,module,exports){
/**
 * 获取 DOM 元素相对于 document 的边距
 * @method dom/offset
 * @see https://github.com/timoxley/offset
 * @param {Object} node 要计算 offset 的 dom 对象
 * @return {Object} offset 对象
 * @example
 * var $offset = require('@spore-ui/kit/packages/dom/offset');
 * var target = document.getElementById('target');
 * console.log($offset(target));
 * // {top: 69, left: 108}
 */

var offset = function () {
  return {};
};

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  offset = require('document-offset');
}

module.exports = offset;

},{"document-offset":2}],30:[function(require,module,exports){
/**
 * 显示滚动区域滑动滚动事件不再穿透到底部
 * - ios 需要给滚动区域添加样式属性: -webkit-overflow-scrolling: touch;
 * - 仅支持单方向滑动禁用
 * @method dom/scrollLimit
 * @param {Object} el 要限制滚动穿透的滚动区域元素
 * @param {Object} options 限制滚动穿透的选项
 * @param {String} [options.direction='y'] 限制滚动的方向，取值: ['x', 'y']
 * @return {Boolean} 是否为dom元素
 * @example
 * var $scrollLimit = require('@spore-ui/kit/packages/dom/scrollLimit');
 * var scroller = document.getElementById('scroller');
 * var limiter = $scrollLimit(scroller, { direction: 'y' });
 * // 初始化时
 * limiter.attach();
 * // 卸载组件时
 * limiter.detach();
 */
var $assign = require('../obj/assign');

function scrollLimit(el, options) {
  var inst = {};

  var conf = $assign({
    direction: 'y',
  }, options);

  var scrollTop = 0;
  var scrollLeft = 0;
  var clientHeight = 0;
  var clientWidth = 0;
  var scrollHeight = 0;
  var scrollWidth = 0;
  var toTop = false;
  var toBottom = false;
  var toLeft = false;
  var toRight = false;
  var moveStartX = 0;
  var moveStartY = 0;

  var updateState = function () {
    scrollTop = el.scrollTop;
    scrollLeft = el.scrollLeft;
    clientHeight = el.clientHeight;
    scrollHeight = el.scrollHeight;
    scrollWidth = el.scrollWidth;

    toTop = scrollTop <= 0;
    toBottom = scrollTop + clientHeight >= scrollHeight;
    toLeft = scrollLeft <= 0;
    toRight = scrollLeft + clientWidth >= scrollWidth;
  };

  var getEvent = function (evt) {
    var tev = evt;
    if (evt.touches && evt.touches.length) {
      tev = evt.touches[0];
    }
    return tev;
  };

  inst.checkScroll = function (evt) {
    evt.stopPropagation();
    updateState();
  };

  inst.checkStart = function (evt) {
    var tev = getEvent(evt);
    moveStartX = tev.clientX;
    moveStartY = tev.clientY;
  };

  inst.checkMove = function (evt) {
    updateState();
    var tev = getEvent(evt);
    if (conf.direction === 'x') {
      if (toLeft && (tev.clientX > moveStartX)) {
        evt.preventDefault();
      }
      if (toRight && (tev.clientX < moveStartX)) {
        evt.preventDefault();
      }
    } else {
      if (toTop && (tev.clientY > moveStartY)) {
        evt.preventDefault();
      }
      if (toBottom && (tev.clientY < moveStartY)) {
        evt.preventDefault();
      }
    }
  };

  var setEvents = function (type) {
    var prefix = type === 'on' ? 'add' : 'remove';
    var method = prefix + 'EventListener';
    if (typeof el[method] === 'function') {
      el[method]('scroll', inst.checkScroll);
      el[method]('touchmove', inst.checkMove);
      el[method]('touchstart', inst.checkStart);
    }
  };

  inst.attach = function () {
    updateState();
    setEvents('on');
  };

  inst.detach = function () {
    setEvents('off');
  };

  return inst;
}

module.exports = scrollLimit;

},{"../obj/assign":82}],31:[function(require,module,exports){
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
 * @method env/browser
 * @returns {Object} UA 检查结果
 * @example
 * var $browser = require('@spore-ui/kit/packages/env/browser');
 * console.info($browser().chrome);
 * console.info($browser.detect());
 */
var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

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

},{"../obj/assign":82,"./uaMatch":38}],32:[function(require,module,exports){
/**
 * 检测浏览器核心
 *
 * 支持的类型检测
 * - trident
 * - presto
 * - webkit
 * - gecko
 * @method env/core
 * @returns {Object} UA 检查结果
 * @example
 * var $core = require('@spore-ui/kit/packages/env/core');
 * console.info($core().webkit);
 * console.info($core.detect());
 */

var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

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

},{"../obj/assign":82,"./uaMatch":38}],33:[function(require,module,exports){
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
 * @method env/device
 * @returns {Object} UA 检查结果
 * @example
 * var $device = require('@spore-ui/kit/packages/env/device');
 * console.info($device().huawei);
 * console.info($device.detect());
 */
var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

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

},{"../obj/assign":82,"./uaMatch":38}],34:[function(require,module,exports){
/**
 * 环境检测与判断工具
 * @module spore-ui/kit/packages/env
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/env
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.env.touchable);
 *
 * // 单独引入 @spore-ui/kit/packages/env
 * var $env = require('@spore-ui/kit/packages/env');
 * console.info($env.touchable);
 *
 * // 单独引入一个方法
 * var $touchable = require('@spore-ui/kit/packages/env/touchable');
 */

exports.browser = require('./browser');
exports.core = require('./core');
exports.device = require('./device');
exports.network = require('./network');
exports.os = require('./os');
exports.touchable = require('./touchable');
exports.uaMatch = require('./uaMatch');
exports.webp = require('./webp');

},{"./browser":31,"./core":32,"./device":33,"./network":35,"./os":36,"./touchable":37,"./uaMatch":38,"./webp":39}],35:[function(require,module,exports){
/**
 * 网络环境检测
 * @module env/network
 */

var supportOnline = null;

/**
 * 判断页面是否支持联网检测
 * @method env/network.support
 * @memberof env/network
 * @returns {Boolean} 是否支持联网检测
 * @example
 * var $network = require('@spore-ui/kit/packages/env/network');
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
 * @method env/network.onLine
 * @memberof env/network
 * @returns {Boolean} 是否联网
 * @example
 * var $network = require('@spore-ui/kit/packages/env/network');
 * $network.onLine(); // true/false
 */
function onLine() {
  return support() ? window.navigator.onLine : true;
}

exports.support = support;
exports.onLine = onLine;

},{}],36:[function(require,module,exports){
/**
 * 检测操作系统类型
 *
 * 支持的类型检测
 * - ios
 * - android
 * @method env/os
 * @returns {Object} UA 检查结果
 * @example
 * var $os = require('@spore-ui/kit/packages/env/os');
 * console.info($os().ios);
 * console.info($os.detect());
 */
var $assign = require('../obj/assign');
var $uaMatch = require('./uaMatch');

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

},{"../obj/assign":82,"./uaMatch":38}],37:[function(require,module,exports){
/**
 * 判断浏览器是否支持触摸屏
 * @method env/touchable
 * @returns {Boolean} 是否支持触摸屏
 * @example
 * var $touchable = require('@spore-ui/kit/packages/env/touchable');
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

},{}],38:[function(require,module,exports){
/**
 * UA字符串匹配列表
 * @method env/uaMatch
 * @param {Object} list 检测 Hash 列表
 * @param {String} ua 用于检测的 UA 字符串
 * @param {Object} conf 检测器选项，传递给检测函数
 * @example
 * var $uaMatch = require('@spore-ui/kit/packages/env/uaMatch');
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

},{}],39:[function(require,module,exports){
var isSupportWebp = null;

/**
 * 判断浏览器是否支持webp
 * @method env/webp
 * @returns {Boolean} 是否支持webp
 * @example
 * var $webp = require('@spore-ui/kit/packages/env/webp');
 * console.info($webp()); // true/false
 */

/**
 * 判断浏览器是否支持webp
 * @method env/webp.support
 * @memberof env/webp
 * @returns {Boolean} 是否支持webp
 * @example
 * var $webp = require('@spore-ui/kit/packages/env/webp');
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

},{}],40:[function(require,module,exports){
/* eslint-disable no-underscore-dangle */
/**
 * A module that can be mixed in to *any object* in order to provide it
 * with custom events. You may bind with `on` or remove with `off` callback
 * functions to an event; `trigger`-ing an event fires all callbacks in
 * succession.
 * - 一个可以被混合到任何对象的模块，用于提供自定义事件。
 * - 可以用 on, off 方法来绑定移除事件。
 * - 用 trigger 来触发事件通知。
 * @class evt/Events
 * @see [mitt](https://github.com/developit/mitt)
 * @see [aralejs](http://aralejs.org/)
 * @see [backbone](https://github.com/documentcloud/backbone/blob/master/backbone.js)
 * @see [events](https://github.com/joyent/node/blob/master/lib/events.js)
 * @example
 * var $events = require('@spore-ui/kit/packages/evt/events');
 * var evt = new $events();
 * evt.on('action', function() {
 *   console.info('action triggered');
 * });
 * evt.trigger('action');
 */

// Regular expression used to split event strings
var eventSplitter = /\s+/;

var Events = function () {};

/**
 * Bind one or more space separated events, `events`, to a `callback`
 * function. Passing `"all"` will bind the callback to all events fired.
 * - 绑定一个事件回调函数，或者用多个空格分隔来绑定多个事件回调函数。
 * - 传入参数 `'all'` 会在所有事件发生时被触发。
 * @method Events#on
 * @memberof evt/Events
 * @param {String} events 事件名称
 * @param {Function} callback 事件回调函数
 * @param {Object} [context] 回调函数的执行环境对象
 * @example
 * var $events = require('@spore-ui/kit/packages/evt/events');
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
 * @memberof evt/Events
 * @param {String} [events] 事件名称
 * @param {Function} [callback] 要移除的事件回调函数
 * @param {Object} [context] 要移除的回调函数的执行环境对象
 * @example
 * var $events = require('@spore-ui/kit/packages/evt/events');
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

  events = events ? events.split(eventSplitter) : Object.keys(cache);

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
 * @memberof evt/Events
 * @param {string} events 事件名称
 * @param {...*} [arg] 事件参数
 * @example
 * var $events = require('@spore-ui/kit/packages/evt/events');
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
 * @memberof evt/Events
 * @param {Object} receiver 要混合事件函数的对象
 * @example
 * var $events = require('@spore-ui/kit/packages/evt/events');
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

},{}],41:[function(require,module,exports){
/**
 * 处理事件与广播
 * @module spore-ui/kit/packages/evt
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/evt
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.evt.occurInside);
 *
 * // 单独引入 @spore-ui/kit/packages/evt
 * var $evt = require('@spore-ui/kit/packages/evt');
 * console.info($evt.occurInside);
 *
 * // 单独引入一个方法
 * var $occurInside = require('@spore-ui/kit/packages/evt/occurInside');
 */

exports.Events = require('./events');
exports.Listener = require('./listener');
exports.occurInside = require('./occurInside');
exports.tapStop = require('./tapStop');

},{"./events":40,"./listener":42,"./occurInside":43,"./tapStop":44}],42:[function(require,module,exports){
/**
 * 广播组件
 * - 构造实例时，需要传入事件白名单列表。
 * - 只有在白名单列表上的事件才可以被触发。
 * - 事件添加，移除，激发的调用方法参考 Events。
 * @see [evt/Events](#evt-events)
 * @class evt/Listener
 * @example
 * @example
 * var $listener = require('@spore-ui/kit/packages/evt/listener');
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

var $events = require('./events');

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
   * @method Listener#define
   * @memberof evt/Listener
   * @param {String} eventName
   */
  define: function (eventName) {
    this.privateWhiteList[eventName] = true;
  },
  /**
   * 移除白名单上定义的事件名称
   * @method Listener#undefine
   * @memberof evt/Listener
   * @param {String} eventName
   */
  undefine: function (eventName) {
    delete this.privateWhiteList[eventName];
  },
  /**
   * 广播组件绑定事件
   * @see [Events#on](#events-on)
   * @method Listener#on
   * @memberof evt/Listener
   * @param {String} eventName 要绑定的事件名称
   * @param {Function} fn 要绑定的事件回调函数
   */
  on: function () {
    this.privateReceiver.on.apply(this.privateReceiver, arguments);
  },
  /**
   * 广播组件移除事件
   * @see [Events#off](#events-off)
   * @method Listener#off
   * @memberof evt/Listener
   * @param {String} eventName 要移除绑定的事件名称
   * @param {Function} fn 要移除绑定的事件回调函数
   */
  off: function () {
    this.privateReceiver.off.apply(this.privateReceiver, arguments);
  },
  /**
   * 广播组件派发事件
   * @see [Events#trigger](#events-trigger)
   * @method Listener#trigger
   * @memberof evt/Listener
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

},{"./events":40}],43:[function(require,module,exports){
/**
 * 判断事件是否发生在一个 Dom 元素内。
 * - 常用于判断点击事件发生在浮层外时关闭浮层。
 * @method evt/occurInside
 * @param {Object} event 浏览器事件对象
 * @param {Object} node 用于比较事件发生区域的 Dom 对象
 * @returns {Boolean} 事件是否发生在 node 内
 * @example
 * var $occurInside = require('@spore-ui/kit/packages/evt/occurInside');
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

},{}],44:[function(require,module,exports){
/**
 * 用遮罩的方式阻止 tap 事件穿透引发表单元素获取焦点。
 * - 推荐用 fastclick 来解决触屏事件穿透问题。
 * - 此组件用在 fastclick 未能解决问题时。或者不方便使用 fastclick 时。
 * @method evt/tapStop
 * @param {Object} options 点击选项
 * @param {Number} options.delay 临时浮层在这个延迟时间(ms)之后关闭
 * @example
 * var $tapStop = require('@spore-ui/kit/packages/evt/tapStop');
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
    miniMask = $('<div class="tap-stop-mask"></div>');
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

},{}],45:[function(require,module,exports){
/**
 * 包装为延迟触发的函数
 * - 用于处理密集事件，延迟时间内同时触发的函数调用。
 * - 最终只在最后一次调用延迟后，执行一次。
 * @method fn/delay
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} duration 延迟时间(ms)
 * @param {Object} [bind] 函数的this指向
 * @returns {Function} 经过包装的延迟触发函数
 * @example
 * var $delay = require('@spore-ui/kit/packages/fn/delay');
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

},{}],46:[function(require,module,exports){
/**
 * 函数包装，获取特殊执行方式
 * @module spore-ui/kit/packages/fn
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fn
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.fn.delay);
 *
 * // 单独引入 @spore-ui/kit/packages/fn
 * var $fn = require('@spore-ui/kit/packages/fn');
 * console.info($fn.delay);
 *
 * // 单独引入一个方法
 * var $delay = require('@spore-ui/kit/packages/fn/delay');
 */

exports.delay = require('./delay');
exports.lock = require('./lock');
exports.noop = require('./noop');
exports.once = require('./once');
exports.queue = require('./queue');
exports.prepare = require('./prepare');
exports.regular = require('./regular');

},{"./delay":45,"./lock":47,"./noop":48,"./once":49,"./prepare":50,"./queue":51,"./regular":52}],47:[function(require,module,exports){
/**
 * 包装为触发一次后，预置时间内不能再次触发的函数
 * - 类似于技能冷却。
 * @method fn/lock
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的冷却触发函数
 * @example
 * var $lock = require('@spore-ui/kit/packages/fn/lock');
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

},{}],48:[function(require,module,exports){
module.exports = function () {};

},{}],49:[function(require,module,exports){
/**
 * 包装为仅触发一次的函数
 * - 被包装的函数智能执行一次，之后不会再执行
 * @method fn/once
 * @param {Function} fn 要延迟触发的函数
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 该函数仅能触发执行一次
 * @example
 * var $once = require('@spore-ui/kit/packages/fn/once');
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

},{}],50:[function(require,module,exports){
/**
 * 包装为一个条件触发管理器
 * - 调用管理器的 ready 函数来激活条件。
 * - 之前插入管理器的函数按队列顺序执行。
 * - 之后插入管理器的函数立即执行。
 * - 作用机制类似 jQuery.ready, 可以设置任何条件。
 * @module fn/prepare
 * @returns {Function} 条件触发管理器函数，传入一个 function 作为任务执行函数参数
 * @example
 * var $prepare = require('@spore-ui/kit/packages/fn/prepare');
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

},{}],51:[function(require,module,exports){
/**
 * 包装为一个队列，按设置的时间间隔触发任务函数
 * - 插入队列的所有函数都会执行，但每次执行之间都会有一个固定的时间间隔。
 * @method fn/queue
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @returns {Function} 经过包装的队列触发函数
 * @example
 * var $queue = require('@spore-ui/kit/packages/fn/queue');
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

},{}],52:[function(require,module,exports){
/**
 * 包装为规律触发的函数，用于降低密集事件的处理频率
 * - 在疯狂操作期间，按照规律时间间隔，来调用任务函数
 * @method fn/regular
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间(ms)
 * @param {Object} [bind] 函数的 this 指向
 * @return {Function} 经过包装的定时触发函数
 * @example
 * var $regular = require('@spore-ui/kit/packages/fn/regular');
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

function regular(fn, delay, bind) {
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

module.exports = regular;

},{}],53:[function(require,module,exports){
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
 * @module fx/easing
 * @see [easing.js](https://gist.github.com/gre/1650294)
 * @example
 * var $easing = require('@spore-ui/kit/packages/fx/easing');
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

},{}],54:[function(require,module,exports){
/**
 * 封装闪烁动作
 * @method fx/flashAction
 * @param {object} options 选项
 * @param {number} [options.times=3] 闪烁次数，默认3次
 * @param {number} [options.delay=100] 闪烁间隔时间(ms)
 * @param {function} [options.actionOdd] 奇数回调
 * @param {function} [options.actionEven] 偶数回调
 * @param {function} [options.recover] 状态恢复回调
 * @example
 * var $flashAction = require('@spore-ui/kit/packages/fx/flashAction');
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
var $assign = require('../obj/assign');

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
        if (typeof conf.recover === 'function') {
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

},{"../obj/assign":82}],55:[function(require,module,exports){
/**
 * 动画类 - 用于处理不适合使用 transition 的动画场景
 *
 * 可绑定的事件
 * - start 动画开始时触发
 * - complete 动画已完成
 * - stop 动画尚未完成就被中断
 * - cancel 动画被取消
 * @class fx/Fx
 * @see [mootools/Fx](https://mootools.net/core/docs/1.6.0/Fx/Fx)
 * @constructor
 * @param {Object} [options] 动画选项
 * @param {Number} [options.fps=60] 帧速率(f/s)，实际上动画运行的最高帧速率不会高于 requestAnimationFrame 提供的帧速率
 * @param {Number} [options.duration=500] 动画持续时间(ms)
 * @param {String|Function} [options.transition] 动画执行方式，参见 [fx/transitions](#fx-transitions)
 * @param {Number} [options.frames] 从哪一帧开始执行
 * @param {Boolean} [options.frameSkip=true] 是否跳帧
 * @param {String} [options.link='ignore'] 动画衔接方式，可选：['ignore', 'cancel']
 * @example
 * var $fx = require('@spore-ui/kit/packages/fx/fx');
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

var $klass = require('../mvc/klass');
var $events = require('../evt/events');
var $erase = require('../arr/erase');
var $contains = require('../arr/contains');
var $assign = require('../obj/assign');
var $timer = require('./timer');

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
   * @memberof fx/Fx
   * @param {Object} options 动画选项
   */
  setOptions: function (options) {
    this.conf = $assign({}, this.options, options);
  },

  /**
   * 设置动画的执行方式，配置缓动效果
   * @interface Fx#getTransition
   * @memberof fx/Fx
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @param {Number} now 当前动画帧的过渡数值
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @param {Number} from 动画开始数值
   * @param {Number} to 动画结束数值
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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
   * @memberof fx/Fx
   * @returns {Boolean} 动画是否正在运行
   * @example
   * var $fx = require('@spore-ui/kit/packages/fx/fx');
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

},{"../arr/contains":13,"../arr/erase":14,"../evt/events":40,"../mvc/klass":73,"../obj/assign":82,"./timer":59}],56:[function(require,module,exports){
/**
 * 动画交互相关工具
 * @module spore-ui/kit/packages/fx
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/fx
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.fx.smoothScrollTo);
 *
 * // 单独引入 @spore-ui/kit/packages/fx
 * var $fx = require('@spore-ui/kit/packages/fx');
 * console.info($fx.smoothScrollTo);
 *
 * // 单独引入一个方法
 * var $smoothScrollTo = require('@spore-ui/kit/packages/fx/smoothScrollTo');
 */

exports.easing = require('./easing');
exports.flashAction = require('./flashAction');
exports.Fx = require('./fx');
exports.smoothScrollTo = require('./smoothScrollTo');
exports.sticky = require('./sticky');
exports.timer = require('./timer');
exports.transitions = require('./transitions');

},{"./easing":53,"./flashAction":54,"./fx":55,"./smoothScrollTo":57,"./sticky":58,"./timer":59,"./transitions":60}],57:[function(require,module,exports){
/**
 * 平滑滚动到某个元素，只进行垂直方向的滚动
 * - requires jQuery/Zepto
 * @method fx/smoothScrollTo
 * @param {Object} node 目标DOM元素
 * @param {Object} spec 选项
 * @param {Number} [spec.delta=0] 目标滚动位置与目标元素顶部的间距，可以为负值
 * @param {Number} [spec.maxDelay=3000] 动画执行时间限制(ms)，动画执行超过此时间则直接停止，立刻滚动到目标位置
 * @param {Function} [options.callback] 滚动完成的回调函数
 * @example
 * var $smoothScrollTo = require('@spore-ui/kit/packages/fx/smoothScrollTo');
 * // 滚动到页面顶端
 * $smoothScrollTo(document.body);
 */

var $assign = require('../obj/assign');

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

},{"../obj/assign":82}],58:[function(require,module,exports){
/**
 * IOS sticky 效果 polyfill
 * - requires jQuery/Zepto
 * @method fx/sticky
 * @param {Object} node 目标DOM元素
 * @param {Object} options 选项
 * @param {Boolean} [options.clone=true] 是否创建一个 clone 元素
 * @param {Object} [options.placeholder=null] sticky 效果启动时的占位 dom 元素
 * @param {Boolean} [options.disableAndroid=false] 是否在 Android 下停用 sticky 效果
 * @param {Object} [options.offsetParent=null] 提供一个相对定位元素来匹配浮动时的定位样式
 * @param {Object} [options.styles={}] 进入 sticky 状态时的样式
 * @example
 * var $sticky = require('@spore-ui/kit/packages/fx/sticky');
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

},{}],59:[function(require,module,exports){
/**
 * 用 requestAnimationFrame 包装定时器
 * - 如果浏览器不支持 requestAnimationFrame API，则使用 BOM 原本的定时器API
 * @module fx/timer
 * @example
 * var $timer = require('@spore-ui/kit/packages/fx/timer');
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
 * @method timer#setInterval
 * @memberof fx/timer
 * @param {Function} fn 定时重复调用的函数
 * @param {Number} [delay=0] 重复调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearInterval 方法来终止这个定时器
 */
Timer.setInterval = factory('setInterval');

/**
 * 清除重复调用定时器
 * @method timer#clearInterval
 * @memberof fx/timer
 * @param {Object} obj 定时器对象
 */
Timer.clearInterval = factory('clearInterval');

/**
 * 设置延时调用定时器
 * @method timer#setTimeout
 * @memberof fx/timer
 * @param {Function} fn 延时调用的函数
 * @param {Number} [delay=0] 延时调用的间隔时间(ms)
 * @returns {Object} 定时器对象，可传入 clearTimeout 方法来终止这个定时器
 */
Timer.setTimeout = factory('setTimeout');

/**
 * 清除延时调用定时器
 * @method timer#clearTimeout
 * @memberof fx/timer
 * @param {Object} obj 定时器对象
 */
Timer.clearTimeout = factory('clearTimeout');

module.exports = Timer;

},{}],60:[function(require,module,exports){
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
 * @module fx/transitions
 * @see [mootools/Fx.Transitions](https://mootools.net/core/docs/1.6.0/Fx/Fx.Transitions#Fx-Transitions)
 * @example
 * var $fx = require('@spore-ui/kit/packages/fx/fx');
 * var $transitions = require('@spore-ui/kit/packages/fx/transitions');
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

var $type = require('../obj/type');
var $assign = require('../obj/assign');

var $fx = require('./fx');

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

},{"../obj/assign":82,"../obj/type":91,"./fx":55}],61:[function(require,module,exports){
/**
 * ajax 请求方法，使用方式与 jQuery, Zepto 类似，对 jQuery, Zepto 无依赖
 * @method io/ajax
 * @see [ajax](https://github.com/ForbesLindesay/ajax)
 * @example
 * var $ajax = require('@spore-ui/kit/packages/io/ajax');
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

var type = require('../obj/type')

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

},{"../obj/type":91}],62:[function(require,module,exports){
/**
 * 加载 script 文件
 * @method io/getScript
 * @param {Object} options 选项
 * @param {String} options.src script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 * var $getScript = require('@spore-ui/kit/packages/io/getScript');
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
  var wtop = options.wtop || window;
  var doc = wtop.document;

  var script = doc.createElement('script');
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
  doc.getElementsByTagName('head')[0].appendChild(script);
  return script;
}

module.exports = getScript;

},{}],63:[function(require,module,exports){
/**
 * 封装 iframe post 模式
 * - requires jQuery/Zepto
 * @method io/iframePost
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
 * var $iframePost = require('@spore-ui/kit/packages/io/iframePost');
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
      if ($.isFunction(conf.success)) {
        conf.success(rs, that, 'success');
      }
      if ($.isFunction(conf.complete)) {
        conf.complete(rs, that, 'success');
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

},{}],64:[function(require,module,exports){
/**
 * 处理网络交互
 * @module spore-ui/kit/packages/io
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/io
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.io.getScript);
 *
 * // 单独引入 @spore-ui/kit/packages/io
 * var $io = require('@spore-ui/kit/packages/io');
 * console.info($io.getScript);
 *
 * // 单独引入一个方法
 * var $getScript = require('@spore-ui/kit/packages/io/getScript');
 */

exports.ajax = require('./ajax');
exports.getScript = require('./getScript');
exports.iframePost = require('./iframePost');
exports.loadSdk = require('./loadSdk');

},{"./ajax":61,"./getScript":62,"./iframePost":63,"./loadSdk":65}],65:[function(require,module,exports){
var $assign = require('../obj/assign');
var $get = require('../obj/get');
var $getScript = require('./getScript');

var propName = 'SPORE_SDK_PROMISE';
var cache = null;

/**
 * sdk 加载统一封装
 * - 多次调用不会发起重复请求
 * @method io/loadSdk
 * @param {Object} options 选项
 * @param {String} options.name sdk 全局变量名称
 * @param {String} options.url script 地址
 * @param {String} [options.charset='utf-8'] script 编码
 * @param {Function} [options.onLoad] script 加载完成的回调函数
 * @example
 * var $loadSdk = require('@spore-ui/kit/packages/io/loadSdk');
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
    wtop: window,
  }, options);

  if (typeof conf.wtop !== 'undefined') {
    cache = conf.wtop[propName];
    if (!cache) {
      cache = {};
      conf.wtop[propName] = cache;
    }
  } else {
    cache = {};
  }

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
      wtop: conf.wtop,
      onLoad: function () {
        var sdk = $get(conf.wtop, name);
        pm.sdk = sdk;
        resolve(sdk);
      },
    });
  });
  cache[name] = pm;

  return pm;
};

module.exports = loadSdk;

},{"../obj/assign":82,"../obj/get":87,"./getScript":62}],66:[function(require,module,exports){
/**
 * 解析 location.search 为一个JSON对象
 * - 或者获取其中某个参数
 * @method location/getQuery
 * @param {String} url URL字符串
 * @param {String} name 参数名称
 * @returns {Object|String} query对象 | 参数值
 * @example
 * var $getQuery = require('@spore-ui/kit/packages/location/getQuery');
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

},{}],67:[function(require,module,exports){
/**
 * 处理地址字符串
 * @module spore-ui/kit/packages/location
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/location
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.location.getQuery);
 *
 * // 单独引入 @spore-ui/kit/packages/location
 * var $location = require('@spore-ui/kit/packages/location');
 * console.info($location.getQuery);
 *
 * // 单独引入一个方法
 * var $getQuery = require('@spore-ui/kit/packages/location/getQuery');
 */

exports.getQuery = require('./getQuery');
exports.setQuery = require('./setQuery');
exports.parse = require('./parse');

},{"./getQuery":66,"./parse":68,"./setQuery":69}],68:[function(require,module,exports){
/**
 * 解析URL为一个对象
 * @method location/parse
 * @param {String} str URL字符串
 * @returns {Object} URL对象
 * @see [url-parse](https://github.com/unshiftio/url-parse)
 * @example
 * var $parse = require('@spore-ui/kit/packages/location/parse');
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

var Url = require('url-parse');

function parse(url) {
  return new Url(url);
}

module.exports = parse;

},{"url-parse":9}],69:[function(require,module,exports){
/**
 * 将参数设置到 location.search 上
 * @method location/setQuery
 * @param {String} url URL字符串
 * @param {Object} query 参数对象
 * @returns {String} 拼接好参数的URL字符串
 * @example
 * var $setQuery = require('@spore-ui/kit/packages/location/setQuery');
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

},{}],70:[function(require,module,exports){
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

var $merge = require('../obj/merge');
var $type = require('../obj/type');
var $noop = require('../fn/noop');
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
   * 混合传入的选项与默认选项，混合完成的选项对象可通过 this.conf 属性访问
   * @method Base#setOptions
   * @memberof mvc/Base
   * @param {Object} [options] 选项
   */
  setOptions: function (options) {
    this.conf = this.conf || $merge({}, this.defaults);
    if ($type(options) !== 'object') {
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

},{"../evt/events":40,"../fn/noop":48,"../obj/merge":89,"../obj/type":91,"./klass":73,"./proxy":75}],71:[function(require,module,exports){
/**
 * 事件对象绑定，将events中包含的键值对映射为代理的事件。
 * - 事件键值对格式可以为：
 * - {'selector event':'method'}
 * - {'event':'method'}
 * - {'selector event':'method1 method2'}
 * - {'event':'method1 method2'}
 * @method mvc/delegate
 * @param {Boolean} action 开/关代理，可选：['on', 'off']。
 * @param {Object} root 设置代理的根节点，可以是一个jquery对象，或者是混合了 spore-kit/packages/evt/events 方法的对象。
 * @param {Object} events 事件键值对
 * @param {Object} bind 指定事件函数绑定的对象，必须为MVC类的实例。
 */

var $assign = require('../obj/assign');
var $type = require('../obj/type');

function delegate(action, root, events, bind) {
  var proxy;
  var dlg;
  if (!root) {
    return;
  }
  if (!bind || $type(bind.proxy) !== 'function') {
    return;
  }

  proxy = bind.proxy();
  action = action === 'on' ? 'on' : 'off';
  dlg = action === 'on' ? 'delegate' : 'undelegate';
  events = $assign({}, events);

  Object.keys(events).forEach(function (handle) {
    var method = events[handle];
    var selector;
    var event;
    var fns = [];
    handle = handle.split(/\s+/);

    if (typeof method === 'string') {
      fns = method.split(/\s+/).map(function (fname) {
        return proxy(fname);
      });
    } else if ($type(method) === 'function') {
      fns = [method];
    } else {
      return;
    }

    event = handle.pop();

    if (handle.length >= 1) {
      selector = handle.join(' ');
      if ($type(root[dlg]) === 'function') {
        fns.forEach(function (fn) {
          root[dlg](selector, event, fn);
        });
      }
    } else if ($type(root[action]) === 'function') {
      fns.forEach(function (fn) {
        root[action](event, fn);
      });
    }
  });
}

module.exports = delegate;

},{"../obj/assign":82,"../obj/type":91}],72:[function(require,module,exports){
/**
 * 兼容 IE8 的 MVC 简单实现
 * @module spore-ui/kit/packages/mvc
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/mvc
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.mvc.Model);
 *
 * // 单独引入 @spore-ui/kit/packages/mvc
 * var $mvc = require('@spore-ui/kit/packages/mvc');
 * console.info($mvc.Model);
 *
 * // 单独引入一个组件
 * var $model = require('@spore-ui/kit/packages/mvc/model');
 */

exports.klass = require('./klass');
exports.delegate = require('./delegate');
exports.proxy = require('./proxy');
exports.Base = require('./base');
exports.Model = require('./model');
exports.View = require('./view');

},{"./base":70,"./delegate":71,"./klass":73,"./model":74,"./proxy":75,"./view":76}],73:[function(require,module,exports){
/* eslint-disable no-underscore-dangle */
/**
 * class 的 ES5 实现
 * - 为代码通过 eslint 检查做了些修改
 * @module mvc/klass
 * @see [klass](https://github.com/ded/klass)
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

},{}],74:[function(require,module,exports){
/**
 * 模型类: 基础工厂元件类，用于做数据包装，提供可观察的数据对象
 * - 继承自 [mvc/base](#mvc-base)
 * @module mvc/Model
 * @param {Object} [options] 初始数据
 * @example
 * var $model = require('@spore-ui/kit/packages/mvc/model');
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

var $assign = require('../obj/assign');
var $type = require('../obj/type');
var $cloneDeep = require('../obj/cloneDeep');
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
  if (processor && $type(processor.set) === 'function') {
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
  if ($type(value) === 'object') {
    value = $cloneDeep(value);
  } else if ($type(value === 'array')) {
    value = $cloneDeep(value);
  }

  var processor = this.processors[key];
  if (processor && $type(processor.get) === 'function') {
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
   * @memberof mvc/Model
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
   * @memberof mvc/Model
   */
  events: {},

  /**
   * 模型数据的预处理器。
   * - 绑定在原型上，不要在实例中直接修改这个对象。
   * @name Model#processors
   * @type {Object}
   * @memberof mvc/Model
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
   * @memberof mvc/Model
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
   * @memberof mvc/Model
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
   * @memberof mvc/Model
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
   * @memberof mvc/Model
   * @param {String|Object} key 模型属性名称。或者JSON数据。
   * @param {*} [val] 数据
   */
  set: function (key, val) {
    if ($type(key) === 'object') {
      Object.keys(key).forEach(function (k) {
        var v = key[k];
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
   * @memberof mvc/Model
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
      this.keys().forEach(function (k) {
        data[k] = getAttr.call(this, k);
      }.bind(this));
      return data;
    }
  },

  /**
   * 获取模型上设置的所有键名
   * @method Model#keys
   * @memberof mvc/Model
   * @returns {Array} 属性名称列表
   */
  keys: function () {
    return Object.keys(this[DATA] || {});
  },

  /**
   * 删除模型上的一个键
   * @method Model#remove
   * @memberof mvc/Model
   * @param {String} key 属性名称。
   */
  remove: function (key) {
    removeAttr.call(this, key);
    this.trigger('change');
  },

  /**
   * 清除模型中所有数据
   * @method Model#clear
   * @memberof mvc/Model
   */
  clear: function () {
    Object.keys(this[DATA]).forEach(removeAttr, this);
    this.trigger('change');
  },

  /**
   * 销毁模型，不会触发任何change事件。
   * - 模型销毁后，无法再设置任何数据。
   * @method Model#destroy
   * @memberof mvc/Model
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

},{"../obj/assign":82,"../obj/cloneDeep":84,"../obj/type":91,"./base":70,"./delegate":71}],75:[function(require,module,exports){
/**
 * 函数代理，确保函数在当前类创建的实例上下文中执行。
 * - 这些用于绑定事件的代理函数都放在属性 instance.bound 上。
 * - 功能类似 Function.prototype.bind 。
 * - 可以传递额外参数作为函数执行的默认参数，追加在实际参数之后。
 * @method mvc/proxy
 * @param {object} instance 对象实例
 * @param {string} [name='proxy'] 函数名称
 */

var $type = require('../obj/type');

var AP = Array.prototype;

function proxy(instance, name, proxyArgs) {
  if (!instance.bound) {
    instance.bound = {};
  }
  var bound = instance.bound;
  proxyArgs = proxyArgs || [];
  proxyArgs.shift();
  name = name || 'proxy';
  if ($type(bound[name]) !== 'function') {
    bound[name] = function () {
      if ($type(instance[name]) === 'function') {
        var args = AP.slice.call(arguments);
        return instance[name].apply(instance, args.concat(proxyArgs));
      }
    };
  }
  return bound[name];
}

module.exports = proxy;

},{"../obj/type":91}],76:[function(require,module,exports){
/**
 * 视图类: 基础工厂元件类，用于对视图组件的包装
 * - 依赖 jQuery/Zepto
 * - 继承自 [mvc/base](#mvc-base)
 * @module mvc/View
 * @param {Object} [options] 选项
 * @param {String|Object} [options.node] 选择器字符串，或者DOM元素，或者jquery对象，用于指定视图的根节点。
 * @param {String} [options.template] 视图的模板字符串，也可以是个字符串数组，创建视图DOM时会自动join为字符串处理。
 * @param {Object} [options.events] 用于覆盖代理事件列表。
 * @param {Object} [options.role] 角色对象映射表，可指定role方法返回的jquery对象。
 * @example
 * var $view = require('@spore-ui/kit/packages/mvc/view');
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
   * @see [mvc/delegate](#mvc-delegate)
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

},{"./base":70,"./delegate":71}],77:[function(require,module,exports){
/**
 * 数字的千分位逗号分隔表示法
 * - IE8 的 toLocalString 给出了小数点后2位: N.00
 * @method num/comma
 * @see http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * @param {Number} num 数字
 * @returns {String} 千分位表示的数字
 * @example
 * var $comma = require('@spore-ui/kit/packages/num/comma');
 * $comma(1234567); //'1,234,567'
 */

function comma(num) {
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

module.exports = comma;

},{}],78:[function(require,module,exports){
/**
 * 修正补位
 * @method num/fixTo
 * @param {Number|String} num 要补位的数字
 * @param {Number} [w=2] w 补位数量
 * @return {String} 经过补位的字符串
 * @example
 * var $fixTo = require('@spore-ui/kit/packages/num/fixTo');
 * $fixTo(0, 2); //return '00'
 */

function fixTo(num, w) {
  var str = num.toString();
  w = Math.max((w || 2) - str.length + 1, 0);
  return new Array(w).join('0') + str;
}

module.exports = fixTo;

},{}],79:[function(require,module,exports){
/**
 * 处理数字，数据转换
 * @module spore-ui/kit/packages/num
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/num
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.num.limit);
 *
 * // 单独引入 @spore-ui/kit/packages/num
 * var $num = require('@spore-ui/kit/packages/num');
 * console.info($num.limit);
 *
 * // 单独引入一个方法
 * var $limit = require('@spore-ui/kit/packages/num/limit');
 */

exports.comma = require('./comma');
exports.fixTo = require('./fixTo');
exports.limit = require('./limit');
exports.numerical = require('./numerical');

},{"./comma":77,"./fixTo":78,"./limit":80,"./numerical":81}],80:[function(require,module,exports){
/**
 * 限制数字在一个范围内
 * @method num/limit
 * @param {Number} num 要限制的数字
 * @param {Number} min 最小边界数值
 * @param {Number} max 最大边界数值
 * @return {Number} 经过限制的数值
 * @example
 * var $limit = require('@spore-ui/kit/packages/num/limit');
 * $limit(1, 5, 10); // 5
 * $limit(6, 5, 10); // 6
 * $limit(11, 5, 10); // 10
 */

function limit(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

module.exports = limit;

},{}],81:[function(require,module,exports){
/**
 * 将数据类型转为整数数字，转换失败则返回一个默认值
 * @method num/numerical
 * @param {*} str 要转换的数据
 * @param {Number} [def=0] 转换失败时的默认值
 * @param {Number} [sys=10] 进制
 * @return {Number} 转换而得的整数
 * @example
 * var $numerical = require('@spore-ui/kit/packages/num/numerical');
 * $numerical('10x'); // 10
 * $numerical('x10'); // 0
 */

function numerical(str, def, sys) {
  def = def || 0;
  sys = sys || 10;
  return parseInt(str, sys) || def;
}

module.exports = numerical;

},{}],82:[function(require,module,exports){
/**
 * 扩展并覆盖对象
 * @method obj/assign
 * @param {Object} obj 要扩展的对象
 * @param {Object} item 要扩展的属性键值对
 * @returns {Object} 扩展后的源对象
 * @example
 * var $assign = require('@spore-ui/kit/packages/obj/assign');
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

},{}],83:[function(require,module,exports){
/**
 * 简易克隆对象，会丢失函数等不能被 JSON 序列化的内容
 * @method obj/clone
 * @param {Object} object 要克隆的对象
 * @returns {Object} 克隆后的对象
 * @example
 * var $clone = require('@spore-ui/kit/packages/obj/clone');
 * var obj = {a: 1, b: 2};
 * console.info($clone(obj)); //{a: 1, b: 2}
 */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = clone;

},{}],84:[function(require,module,exports){
var $type = require('./type');

/**
 * 深度克隆对象，会保留函数引用
 * @method obj/cloneDeep
 * @param {Object} item 要克隆的对象
 * @returns {Object} 克隆后的对象
 * @example
 * var $cloneDeep = require('@spore-ui/kit/packages/obj/cloneDeep');
 * var obj = {a: 1, b: 2, c: function () {}};
 * console.info($cloneDeep(obj)); //{a: 1, b: 2, c: function () {}}
 */

var cloneArr;
var cloneObj;
var cloneDeep;

cloneArr = function (arr) {
  var carr = [];
  arr.forEach(function (item, index) {
    carr[index] = cloneDeep(item);
  });
  return carr;
};

cloneObj = function (obj) {
  var cobj = {};
  Object.keys(obj).forEach(function (key) {
    var item = obj[key];
    cobj[key] = cloneDeep(item);
  });
  return cobj;
};

cloneDeep = function (item) {
  if ($type(item) === 'array') {
    return cloneArr(item);
  }
  if ($type(item) === 'object') {
    return cloneObj(item);
  }
  return item;
};

module.exports = cloneDeep;

},{"./type":91}],85:[function(require,module,exports){
/**
 * 覆盖对象，不添加新的键
 * @method obj/cover
 * @param {Object} object 要覆盖的对象
 * @param {Object} item 要覆盖的属性键值对
 * @returns {Object} 覆盖后的源对象
 * @example
 * var $cover = require('@spore-ui/kit/packages/obj/cover');
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

},{}],86:[function(require,module,exports){
/**
 * 查找对象路径上的值(简易版)
 * @see [lodash.get](https://lodash.com/docs/4.17.15#get)
 * @method obj/find
 * @param {Object} object 要查找的对象
 * @param {String} path 要查找的路径
 * @return {*} 对象路径上的值
 * @example
 * var $find = require('@spore-ui/kit/packages/obj/find');
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

},{}],87:[function(require,module,exports){
var $type = require('./type');
var $keyPathSplit = require('../str/keyPathSplit');

/**
 * 从对象路径取值(简易版)
 * @method obj/get
 * @see [lodash.get](https://lodash.com/docs/4.17.15#get)
 * @param {Object|Array} obj 要取值的对象或者数组
 * @param {String} xpath 要取值的路径
 * @param {Any} [defaultValue] 值为 undefined 则取此默认值
 * @returns {Any} 取得的值
 * @example
 * var $get = require('@spore-ui/kit/packages/obj/get');
 * var obj = {a: {b: {c: 1}}};
 * console.info($get(obj, 'a.b.c'); // 1
 * console.info($get(obj, 'e'); // undefined
 * console.info($get(obj, 'e', 3); // 3
 * var arr = [1, {a: [2, 3]}];
 * console.info($get(arr, '[1].a[1]'); // 3
 */

// 引用 lodash/get 会引入超过10kb 代码，用这个方法来精简 sdk 体积

function get(obj, xpath, def) {
  if (!obj) return undefined;
  if (typeof xpath !== 'string') return undefined;
  var arrXpath = $keyPathSplit(xpath);
  var point = obj;
  var len = arrXpath.length;
  var index;
  for (index = 0; index < len; index += 1) {
    var key = arrXpath[index];
    var otype = $type(point);
    if (otype === 'array') {
      if (/^\d+$/.test(key)) {
        key = parseInt(key, 10);
      }
      point = point[key];
    } else if (point === null) {
      point = undefined;
      break;
    } else if (typeof point === 'object') {
      point = point[key];
    } else {
      point = undefined;
      break;
    }
  }
  var value = point;
  if ($type(value) === 'undefined') {
    if ($type(def) !== 'undefined') {
      value = def;
    }
  }
  return value;
}

module.exports = get;

},{"../str/keyPathSplit":102,"./type":91}],88:[function(require,module,exports){
/**
 * 对象处理与判断
 * @module spore-ui/kit/packages/obj
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/obj
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.obj.type);
 *
 * // 单独引入 @spore-ui/kit/packages/obj
 * var $obj = require('@spore-ui/kit/packages/obj');
 * console.info($obj.type);
 *
 * // 单独引入一个方法
 * var $type = require('@spore-ui/kit/packages/obj/type');
 */

exports.assign = require('./assign');
exports.clone = require('./clone');
exports.cloneDeep = require('./cloneDeep');
exports.merge = require('./merge');
exports.cover = require('./cover');
exports.find = require('./find');
exports.get = require('./get');
exports.set = require('./set');
exports.type = require('./type');

},{"./assign":82,"./clone":83,"./cloneDeep":84,"./cover":85,"./find":86,"./get":87,"./merge":89,"./set":90,"./type":91}],89:[function(require,module,exports){
var $type = require('./type');

var mergeArr;
var mergeObj;

var isObj = function (item) {
  return (
    item
    && typeof item === 'object'
  );
};

var mergeItem = function (origin, item, key) {
  var prev = origin[key];
  if (
    $type(prev) === 'array'
    && $type(item) === 'array'
  ) {
    mergeArr(prev, item);
  } else if (
    isObj(prev)
    && isObj(item)
  ) {
    mergeObj(prev, item);
  } else {
    origin[key] = item;
  }
};

mergeArr = function (origin, source) {
  source.forEach(function (item, index) {
    mergeItem(origin, item, index);
  });
};

mergeObj = function (origin, source) {
  Object.keys(source).forEach(function (key) {
    mergeItem(origin, source[key], key);
  });
};

/**
 * 深度混合源对象，会保留函数引用
 * @method obj/merge
 * @param {Object} origin 要混合的源对象
 * @param {Object} target 要混合的对象
 * @returns {Object} 混合之后的对象
 * @example
 * var $merge = require('@spore-ui/kit/packages/obj/merge');
 * var origin = {a:{b:{c:1}}};
 * var target = {a:{b:{d:2}}};
 * console.info($merge(origin, target));
 * // {a:{b:{c:1,d:2}}};
 */
var merge = function (origin) {
  if (typeof origin !== 'object') return origin;
  var rests = Array.prototype.slice.call(arguments, 1);
  rests.forEach(function (source) {
    if ($type(source) === 'array') {
      mergeArr(origin, source);
    } else if (isObj(source)) {
      mergeObj(origin, source);
    }
  });
  return origin;
};

module.exports = merge;

},{"./type":91}],90:[function(require,module,exports){
var $type = require('./type');
var $get = require('./get');
var $keyPathSplit = require('../str/keyPathSplit');

/**
 * 向对象路径设置值(简易版)
 * @method obj/set
 * @see [lodash.set](https://lodash.com/docs/4.17.15#set)
 * @param {Object|Array} obj 要设置值的对象或者数组
 * @param {String} xpath 要取值的路径
 * @param {Any} value 要设置的值
 * @returns {undefined}
 * @example
 * var $set = require('@spore-ui/kit/packages/obj/set');
 * var obj = {a: {b: {c: 1}}};
 * $set(obj, 'a.b.c', 2);
 * console.info(obj.a.b.c) // 2
 */
function set(obj, xpath, value) {
  if (!obj) return;
  if (typeof xpath !== 'string') return;
  if (!xpath) return;
  var arrXpath = $keyPathSplit(xpath);
  var key = arrXpath.pop();
  var target = $get(obj, arrXpath.join('.'));
  if (!target) return;
  if ($type(target) === 'array') {
    if (/^\d+$/.test(key)) {
      key = parseInt(key, 10);
    }
    if ($type(value) !== 'undefined') {
      target[key] = value;
    }
  } else if ($type(target) === 'object') {
    if ($type(value) !== 'undefined') {
      target[key] = value;
    }
  }
}

module.exports = set;

},{"../str/keyPathSplit":102,"./get":87,"./type":91}],91:[function(require,module,exports){
/**
 * 获取数据类型
 * @method obj/type
 * @param {*} item 任何类型数据
 * @returns {String} 对象类型
 * @example
 * var $type = require('@spore-ui/kit/packages/obj/type');
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

},{}],92:[function(require,module,exports){
/* eslint-disable no-control-regex */
/**
 * 获取字符串长度，一个中文算2个字符
 * @method str/bLength
 * @param {String} str 要计算长度的字符串
 * @returns {Number} 字符串长度
 * @example
 * var $bLength = require('@spore-ui/kit/packages/str/bLength');
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

},{}],93:[function(require,module,exports){
/**
 * 全角字符转半角字符
 * @method str/dbcToSbc
 * @param {String} str 包含了全角字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * var $dbcToSbc = require('@spore-ui/kit/packages/str/dbcToSbc');
 * $dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ'); // 'SAASDFSADF'
 */

function dbcToSbc(str) {
  return str.replace(/[\uff01-\uff5e]/g, function (a) {
    return String.fromCharCode(a.charCodeAt(0) - 65248);
  }).replace(/\u3000/g, ' ');
}

module.exports = dbcToSbc;

},{}],94:[function(require,module,exports){
/**
 * 解码HTML，将实体字符转换为HTML字符
 * @method str/decodeHTML
 * @param {String} str 含有实体字符的字符串
 * @returns {String} HTML字符串
 * @example
 * var $decodeHTML = require('@spore-ui/kit/packages/str/decodeHTML');
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

},{}],95:[function(require,module,exports){
/* eslint-disable no-control-regex */
/**
 * 编码HTML，将HTML字符转为实体字符
 * @method str/encodeHTML
 * @param {String} str 含有HTML字符的字符串
 * @returns {String} 经过转换的字符串
 * @example
 * var $encodeHTML = require('@spore-ui/kit/packages/str/encodeHTML');
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

},{}],96:[function(require,module,exports){
/**
 * 获取36进制随机字符串
 * @method str/getRnd36
 * @param {Float} [rnd] 随机数，不传则生成一个随机数
 * @return {String} 转成为36进制的字符串
 * @example
 * var $getRnd36 = require('@spore-ui/kit/packages/str/getRnd36');
 * $getRnd36(0.5810766832590446); // 'kx2pozz9rgf'
 */

function getRnd36(rnd) {
  rnd = rnd || Math.random();
  return rnd.toString(36).replace(/^0./, '');
}

module.exports = getRnd36;

},{}],97:[function(require,module,exports){
/**
 * 获取36进制日期字符串
 * @method str/getTime36
 * @param {Date} [date] 符合规范的日期字符串或者数字，不传参数则使用当前客户端时间
 * @return {String} 转成为36进制的字符串
 * @example
 * var $getTime36 = require('@spore-ui/kit/packages/str/getTime36');
 * $getTime36('2020'); // 'k4ujaio0'
 */

function getTime36(date) {
  date = date ? new Date(date) : new Date();
  return date.getTime().toString(36);
}

module.exports = getTime36;

},{}],98:[function(require,module,exports){
/**
 * 生成一个不与之前重复的随机字符串
 * @method str/getUniqueKey
 * @returns {String} 随机字符串
 * @example
 * var $getUniqueKey = require('@spore-ui/kit/packages/str/getUniqueKey');
 * $getUniqueKey(); // '166aae1fa9f'
 */

var time = +new Date();
var index = 0;

function getUniqueKey() {
  index += 1;
  return (time + (index)).toString(16);
}

module.exports = getUniqueKey;

},{}],99:[function(require,module,exports){
/**
 * 将驼峰格式变为连字符格式
 * @method str/hyphenate
 * @param {String} str 驼峰格式的字符串
 * @returns {String} 连字符格式的字符串
 * @example
 * var $hyphenate = require('@spore-ui/kit/packages/str/hyphenate');
 * $hyphenate('libKitStrHyphenate'); // 'lib-kit-str-hyphenate'
 */

function hyphenate(str) {
  return str.replace(/[A-Z]/g, function ($0) {
    return '-' + $0.toLowerCase();
  });
}

module.exports = hyphenate;

},{}],100:[function(require,module,exports){
/**
 * 字符串处理与判断
 * @module spore-ui/kit/packages/str
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/str
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.str.substitute);
 *
 * // 单独引入 @spore-ui/kit/packages/str
 * var $str = require('@spore-ui/kit/packages/str');
 * console.info($str.substitute);
 *
 * // 单独引入一个方法
 * var $substitute = require('@spore-ui/kit/packages/str/substitute');
 */

exports.bLength = require('./bLength');
exports.dbcToSbc = require('./dbcToSbc');
exports.decodeHTML = require('./decodeHTML');
exports.encodeHTML = require('./encodeHTML');
exports.getRnd36 = require('./getRnd36');
exports.getTime36 = require('./getTime36');
exports.getUniqueKey = require('./getUniqueKey');
exports.hyphenate = require('./hyphenate');
exports.ipToHex = require('./ipToHex');
exports.leftB = require('./leftB');
exports.sizeOfUTF8String = require('./sizeOfUTF8String');
exports.substitute = require('./substitute');
exports.keyPathSplit = require('./keyPathSplit');

},{"./bLength":92,"./dbcToSbc":93,"./decodeHTML":94,"./encodeHTML":95,"./getRnd36":96,"./getTime36":97,"./getUniqueKey":98,"./hyphenate":99,"./ipToHex":101,"./keyPathSplit":102,"./leftB":103,"./sizeOfUTF8String":104,"./substitute":105}],101:[function(require,module,exports){
/**
 * 十进制IP地址转十六进制
 * @method str/ipToHex
 * @param {String} ip 十进制数字的IPV4地址
 * @return {String} 16进制数字IPV4地址
 * @example
 * var $ipToHex = require('@spore-ui/kit/packages/str/ipToHex');
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

},{}],102:[function(require,module,exports){
/**
 * 解析对象路径为一个数组
 * @method str/keyPathSplit
 * @param {String} 对象路径
 * @returns {Array} 对象路径数组
 * @example
 * var $keyPathSplit = require('@spore-ui/kit/packages/str/keyPathSplit');
 * console.info($keyPathSplit('[1].a[1][2]b.c'); // ['1', 'a', '1', '2', 'b', 'c']
 */

function keyPathSplit(xpath) {
  if (typeof xpath !== 'string') return [];
  var arrXpath = [];
  xpath.split('.').forEach(function (itemPath) {
    var strItem = itemPath.replace(/\[([^[\]]+)\]/g, '.$1');
    var itemArr = strItem.split('.');
    if (itemArr[0] === '') {
      itemArr.shift();
    }
    itemArr.forEach(function (item) {
      arrXpath.push(item);
    });
  });
  return arrXpath;
}

module.exports = keyPathSplit;

},{}],103:[function(require,module,exports){
/* eslint-disable no-control-regex */
/**
 * 从左到右取字符串，中文算两个字符
 * @method str/leftB
 * @param {String} str
 * @param {Number} lens
 * @returns {String} str
 * @example
 * var $leftB = require('@spore-ui/kit/packages/str/leftB');
 * //向汉编致敬
 * $leftB('世界真和谐', 6); // '世界真'
*/

var $bLength = require('./bLength');

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

},{"./bLength":92}],104:[function(require,module,exports){
/**
 * 取字符串 utf8 编码长度，from 王集鹄
 * @method str/sizeOfUTF8String
 * @param {String} str
 * @returns {Number} 字符串长度
 * @example
 * var $sizeOfUTF8String = require('@spore-ui/kit/packages/str/sizeOfUTF8String');
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

},{}],105:[function(require,module,exports){
/**
 * 简单模板函数
 * @method str/substitute
 * @param {String} str 要替换模板的字符串
 * @param {Object} obj 模板对应的数据对象
 * @param {RegExp} [reg=/\\?\{\{([^{}]+)\}\}/g] 解析模板的正则表达式
 * @return {String} 替换了模板的字符串
 * @example
 * var $substitute = require('@spore-ui/kit/packages/str/substitute');
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

},{}],106:[function(require,module,exports){
/**
 * 提供倒计时器统一封装
 * @method time/countDown
 * @param {Object} spec 选项
 * @param {Date} [spec.base] 矫正时间，如果需要用服务端时间矫正倒计时，使用此参数
 * @param {Date} [spec.target=Date.now() + 3000] 目标时间
 * @param {Number} [spec.interval=1000] 倒计时触发间隔
 * @param {Function} [spec.onChange] 倒计时触发变更的事件回调
 * @param {Function} [spec.onStop] 倒计时结束的回调
 * @returns {Object} 倒计时对象实例
 * @example
 * var $countDown = require('@spore-ui/kit/packages/time/countDown');
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

var $erase = require('../arr/erase');
var $assign = require('../obj/assign');

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
   * @memberof time/countDown
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
   * @memberof time/countDown
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
   * @memberof time/countDown
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
   * @memberof time/countDown
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

},{"../arr/erase":14,"../obj/assign":82}],107:[function(require,module,exports){
/**
 * 时间处理与交互工具
 * @module spore-ui/kit/packages/time
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/time
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.time.parseUnit);
 *
 * // 单独引入 @spore-ui/kit/packages/time
 * var $time = require('@spore-ui/kit/packages/time');
 * console.info($time.parseUnit);
 *
 * // 单独引入一个方法
 * var $parseUnit = require('@spore-ui/kit/packages/time/parseUnit');
 */

exports.countDown = require('./countDown');
exports.parseUnit = require('./parseUnit');

},{"./countDown":106,"./parseUnit":108}],108:[function(require,module,exports){
/**
 * 时间数字拆分为天时分秒
 * @method time/parseUnit
 * @param {Number} time 毫秒数
 * @param {Object} spec 选项
 * @param {String} [spec.maxUnit='day'] 拆分时间的最大单位，可选 ['day', 'hour', 'minute', 'second']
 * @returns {Object} 拆分完成的天时分秒
 * @example
 * var $parseUnit = require('@spore-ui/kit/packages/time/parseUnit');
 * console.info( $parseUnit(12345 * 67890) );
 * // Object {day: 9, hour: 16, minute: 48, second: 22, ms: 50}
 * console.info( $parseUnit(12345 * 67890, {maxUnit : 'hour'}) );
 * // Object {hour: 232, minute: 48, second: 22, ms: 50}
 */

var $numerical = require('../num/numerical');
var $assign = require('../obj/assign');

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

},{"../num/numerical":81,"../obj/assign":82}],109:[function(require,module,exports){
/**
 * ArrayBuffer转16进制字符串
 * @method util/abToHex
 * @param {ArrayBuffer} buffer 需要转换的 ArrayBuffer
 * @returns {String} 16进制字符串
 * @example
 * var $abToHex = require('@spore-ui/kit/packages/util/abToHex');
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

},{}],110:[function(require,module,exports){
/**
 * ASCII字符串转16进制字符串
 * @method util/ascToHex
 * @param {String} str 需要转换的ASCII字符串
 * @returns {String} 16进制字符串
 * @example
 * var $ascToHex = require('@spore-ui/kit/packages/util/ascToHex');
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

},{}],111:[function(require,module,exports){
/**
 * 比较版本号
 * @method util/compareVersion
 * @param {String} v1 版本号1
 * @param {String} v2 版本号2
 * @returns {Object} info 版本号比较信息
 * @returns {Object} info.level 版本号差异所在级别
 * @returns {Object} info.delta 版本号差异数值
 * @example
 * var $compareVersion = require('@spore-ui/kit/packages/util/compareVersion');
 * // delta 取值可以理解为 前面的值 减去 后面的值
 * var info1 = $compareVersion('1.0.1', '1.2.2');
 * // {level: 1, delta: -2}
 * var info2 = $compareVersion('1.3.1', '1.2.2');
 * // {level: 1, delta: 1}
 */

function compareVersion(v1, v2) {
  var arrV1 = v1.split('.');
  var arrV2 = v2.split('.');
  var maxLength = Math.max(arrV1.length, arrV2.length);
  var index = 0;
  var delta = 0;

  for (index = 0; index < maxLength; index += 1) {
    var pv1 = parseInt(arrV1[index], 10) || 0;
    var pv2 = parseInt(arrV2[index], 10) || 0;
    delta = pv1 - pv2;
    if (delta !== 0) {
      break;
    }
  }

  if (!v1 && !v2) {
    index = 0;
  }

  return {
    level: index,
    delta: delta,
  };
}

module.exports = compareVersion;

},{}],112:[function(require,module,exports){
/**
 * 16进制字符串转ArrayBuffer
 * @method util/hexToAb
 * @see https://caniuse.com/#search=ArrayBuffer
 * @param {String} str 需要转换的16进制字符串
 * @returns {ArrayBuffer} 被转换后的 ArrayBuffer 对象
 * @example
 * var $hexToAb = require('@spore-ui/kit/packages/util/hexToAb');
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

},{}],113:[function(require,module,exports){
/**
 * 16进制字符串转ASCII字符串
 * @method util/hexToAsc
 * @param {String} str 需要转换的16进制字符串
 * @returns {String} ASCII字符串
 * @example
 * var $hexToAsc = require('@spore-ui/kit/packages/util/hexToAsc');
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

},{}],114:[function(require,module,exports){
/**
 * HSL颜色值转换为RGB
 * - 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - h, s, 和 l 设定在 [0, 1] 之间
 * - 返回的 r, g, 和 b 在 [0, 255]之间
 * @method util/hslToRgb
 * @param {Number} h 色相
 * @param {Number} s 饱和度
 * @param {Number} l 亮度
 * @returns {Array} RGB色值数值
 * @example
 * var $hslToRgb = require('@spore-ui/kit/packages/util/hslToRgb');
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

},{}],115:[function(require,module,exports){
/**
 * 其他工具函数
 * @module spore-ui/kit/packages/util
 * @see https://github.com/SporeUI/spore-kit/tree/master/packages/util
 * @example
 * // 统一引入 @spore-ui/kit
 * var $kit = require('@spore-ui/kit');
 * console.info($kit.util.hslToRgb);
 *
 * // 单独引入 @spore-ui/kit/packages/util
 * var $util = require('@spore-ui/kit/packages/util');
 * console.info($util.hslToRgb);
 *
 * // 单独引入一个方法
 * var $hslToRgb = require('@spore-ui/kit/packages/util/hslToRgb');
 */

exports.abToHex = require('./abToHex');
exports.ascToHex = require('./ascToHex');
exports.compareVersion = require('./compareVersion');
exports.hexToAb = require('./hexToAb');
exports.hexToAsc = require('./hexToAsc');
exports.hslToRgb = require('./hslToRgb');
exports.job = require('./job');
exports.measureDistance = require('./measureDistance');
exports.parseRGB = require('./parseRGB');
exports.rgbToHsl = require('./rgbToHsl');

},{"./abToHex":109,"./ascToHex":110,"./compareVersion":111,"./hexToAb":112,"./hexToAsc":113,"./hslToRgb":114,"./job":116,"./measureDistance":117,"./parseRGB":118,"./rgbToHsl":119}],116:[function(require,module,exports){
/**
 * 任务分时执行
 * - 一方面避免单次reflow流程执行太多js任务导致浏览器卡死
 * - 另一方面单个任务的报错不会影响后续任务的执行
 * @method util/job
 * @param {Function} fn 任务函数
 * @returns {Object} 任务队列对象
 * @example
 * var $job = require('@spore-ui/kit/packages/util/job');
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

},{}],117:[function(require,module,exports){
/**
 * 测量地理坐标的距离
 * @method util/measureDistance
 * @param {Number} lat1 坐标1精度
 * @param {Number} lng1 坐标1纬度
 * @param {Number} lat2 坐标2精度
 * @param {Number} lng2 坐标2纬度
 * @returns {Number} 2个坐标之间的距离（千米）
 * @example
 * var $measureDistance = require('@spore-ui/kit/packages/util/measureDistance');
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

},{}],118:[function(require,module,exports){
/**
 * rgb字符串解析
 * - 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - h, s, 和 l 设定在 [0, 1] 之间
 * - 返回的 r, g, 和 b 在 [0, 255]之间
 * @method util/parseRGB
 * @param {String} color 16进制色值
 * @returns {Array} RGB色值数值
 * @example
 * var $parseRGB = require('@spore-ui/kit/packages/util/parseRGB');
 * $parseRGB('#ffffff'); // => [255,255,255]
 * $parseRGB('#fff'); // => [255,255,255]
 */

const REG_HEX = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i;

function parseRGB(color) {
  var str = color;
  if (typeof str !== 'string') {
    throw new Error('Color should be string');
  }
  if (!REG_HEX.test(str)) {
    throw new Error('Wrong RGB color format');
  }

  str = str.replace('#', '');
  var arr;
  if (str.length === 3) {
    arr = str.split('').map(function (c) {
      return c + c;
    });
  } else {
    arr = str.match(/[a-fA-F0-9]{2}/g);
  }
  arr.length = 3;
  return arr.map(function (c) {
    return parseInt(c, 16);
  });
}

module.exports = parseRGB;

},{}],119:[function(require,module,exports){
/**
 * RGB 颜色值转换为 HSL.
 * - 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * - r, g, 和 b 需要在 [0, 255] 范围内
 * - 返回的 h, s, 和 l 在 [0, 1] 之间
 * @method util/rgbToHsl
 * @param {Number} r 红色色值
 * @param {Number} g 绿色色值
 * @param {Number} b 蓝色色值
 * @returns {Array} HSL各值数组
 * @example
 * var $rgbToHsl = require('@spore-ui/kit/packages/util/rgbToHsl');
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
    s = 0; // achromatic
    h = s;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return [h, s, l];
}

module.exports = rgbToHsl;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvZmFrZV81MTdkN2RlYi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2RvY3VtZW50LW9mZnNldC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2RvbS1zdXBwb3J0L2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9nZXQtZG9jdW1lbnQvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9qcy1jb29raWUvZGlzdC9qcy5jb29raWUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZ2lmeS9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy91cmwtcGFyc2UvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy93aXRoaW4tZWxlbWVudC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXBwL2NhbGxVcC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXBwL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9lcmFzZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2ZpbmQuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvaW5jbHVkZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvY29va2llLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9vcmlnaW4uanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2dldExhc3RTdGFydC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9nZXRUaW1lU3BsaXQuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZG9tL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaXNOb2RlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vb2Zmc2V0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vc2Nyb2xsTGltaXQuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9icm93c2VyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvY29yZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L2RldmljZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvbmV0d29yay5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L29zLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdWFNYXRjaC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L3dlYnAuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZXZ0L2xpc3RlbmVyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvb2NjdXJJbnNpZGUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC90YXBTdG9wLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9kZWxheS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZm4vaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2xvY2suanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL25vb3AuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL29uY2UuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3ByZXBhcmUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3F1ZXVlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9yZWd1bGFyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2ZsYXNoQWN0aW9uLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9meC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZngvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3Ntb290aFNjcm9sbFRvLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9zdGlja3kuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3RpbWVyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC90cmFuc2l0aW9ucy5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvaW8vYWpheC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9pZnJhbWVQb3N0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvaW8vbG9hZFNkay5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vZ2V0UXVlcnkuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vc2V0UXVlcnkuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9iYXNlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvZGVsZWdhdGUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbXZjL2tsYXNzLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9wcm94eS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbXZjL3ZpZXcuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL251bS9jb21tYS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbnVtL2ZpeFRvLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL251bS9saW1pdC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbnVtL251bWVyaWNhbC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2Fzc2lnbi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2Nsb25lLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovY2xvbmVEZWVwLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovY292ZXIuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL29iai9maW5kLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovZ2V0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL29iai9tZXJnZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL3NldC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL3R5cGUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9iTGVuZ3RoLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZGJjVG9TYmMuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9kZWNvZGVIVE1MLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZW5jb2RlSFRNTC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2dldFJuZDM2LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VGltZTM2LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VW5pcXVlS2V5LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvaHlwaGVuYXRlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9pcFRvSGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIva2V5UGF0aFNwbGl0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvbGVmdEIuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9zaXplT2ZVVEY4U3RyaW5nLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvc3Vic3RpdHV0ZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdGltZS9jb3VudERvd24uanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvcGFyc2VVbml0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2FiVG9IZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvYXNjVG9IZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvY29tcGFyZVZlcnNpb24uanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9BYi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oZXhUb0FzYy5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oc2xUb1JnYi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9qb2IuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvbWVhc3VyZURpc3RhbmNlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL3BhcnNlUkdCLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL3JnYlRvSHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL2tCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMuYXBwID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9hcHAnKTtcbmV4cG9ydHMuYXJyID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9hcnInKTtcbmV4cG9ydHMuY29va2llID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9jb29raWUnKTtcbmV4cG9ydHMuZGF0ZSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZGF0ZScpO1xuZXhwb3J0cy5kb20gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2RvbScpO1xuZXhwb3J0cy5lbnYgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2VudicpO1xuZXhwb3J0cy5ldnQgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2V2dCcpO1xuZXhwb3J0cy5mbiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZm4nKTtcbmV4cG9ydHMuZnggPSByZXF1aXJlKCcuL3BhY2thZ2VzL2Z4Jyk7XG5leHBvcnRzLmlvID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9pbycpO1xuZXhwb3J0cy5sb2NhdGlvbiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvbG9jYXRpb24nKTtcbmV4cG9ydHMubXZjID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9tdmMnKTtcbmV4cG9ydHMubnVtID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9udW0nKTtcbmV4cG9ydHMub2JqID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9vYmonKTtcbmV4cG9ydHMuc3RyID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9zdHInKTtcbmV4cG9ydHMudGltZSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvdGltZScpO1xuZXhwb3J0cy51dGlsID0gcmVxdWlyZSgnLi9wYWNrYWdlcy91dGlsJyk7XG4iLCJ2YXIgc3VwcG9ydCA9IHJlcXVpcmUoJ2RvbS1zdXBwb3J0JylcbnZhciBnZXREb2N1bWVudCA9IHJlcXVpcmUoJ2dldC1kb2N1bWVudCcpXG52YXIgd2l0aGluRWxlbWVudCA9IHJlcXVpcmUoJ3dpdGhpbi1lbGVtZW50JylcblxuLyoqXG4gKiBHZXQgb2Zmc2V0IG9mIGEgRE9NIEVsZW1lbnQgb3IgUmFuZ2Ugd2l0aGluIHRoZSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR8UmFuZ2V9IGVsIC0gdGhlIERPTSBlbGVtZW50IG9yIFJhbmdlIGluc3RhbmNlIHRvIG1lYXN1cmVcbiAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IHdpdGggYHRvcGAgYW5kIGBsZWZ0YCBOdW1iZXIgdmFsdWVzXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvZmZzZXQoZWwpIHtcbiAgdmFyIGRvYyA9IGdldERvY3VtZW50KGVsKVxuICBpZiAoIWRvYykgcmV0dXJuXG5cbiAgLy8gTWFrZSBzdXJlIGl0J3Mgbm90IGEgZGlzY29ubmVjdGVkIERPTSBub2RlXG4gIGlmICghd2l0aGluRWxlbWVudChlbCwgZG9jKSkgcmV0dXJuXG5cbiAgdmFyIGJvZHkgPSBkb2MuYm9keVxuICBpZiAoYm9keSA9PT0gZWwpIHtcbiAgICByZXR1cm4gYm9keU9mZnNldChlbClcbiAgfVxuXG4gIHZhciBib3ggPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gIGlmICggdHlwZW9mIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGdCQ1IsIGp1c3QgdXNlIDAsMCByYXRoZXIgdGhhbiBlcnJvclxuICAgIC8vIEJsYWNrQmVycnkgNSwgaU9TIDMgKG9yaWdpbmFsIGlQaG9uZSlcbiAgICBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgaWYgKGVsLmNvbGxhcHNlZCAmJiBib3gubGVmdCA9PT0gMCAmJiBib3gudG9wID09PSAwKSB7XG4gICAgICAvLyBjb2xsYXBzZWQgUmFuZ2UgaW5zdGFuY2VzIHNvbWV0aW1lcyByZXBvcnQgMCwgMFxuICAgICAgLy8gc2VlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82ODQ3MzI4LzM3Njc3M1xuICAgICAgdmFyIHNwYW4gPSBkb2MuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cbiAgICAgIC8vIEVuc3VyZSBzcGFuIGhhcyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbiBieVxuICAgICAgLy8gYWRkaW5nIGEgemVyby13aWR0aCBzcGFjZSBjaGFyYWN0ZXJcbiAgICAgIHNwYW4uYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKFwiXFx1MjAwYlwiKSk7XG4gICAgICBlbC5pbnNlcnROb2RlKHNwYW4pO1xuICAgICAgYm94ID0gc3Bhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gUmVtb3ZlIHRlbXAgU1BBTiBhbmQgZ2x1ZSBhbnkgYnJva2VuIHRleHQgbm9kZXMgYmFjayB0b2dldGhlclxuICAgICAgdmFyIHNwYW5QYXJlbnQgPSBzcGFuLnBhcmVudE5vZGU7XG4gICAgICBzcGFuUGFyZW50LnJlbW92ZUNoaWxkKHNwYW4pO1xuICAgICAgc3BhblBhcmVudC5ub3JtYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZG9jRWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gIHZhciBjbGllbnRUb3AgID0gZG9jRWwuY2xpZW50VG9wICB8fCBib2R5LmNsaWVudFRvcCAgfHwgMFxuICB2YXIgY2xpZW50TGVmdCA9IGRvY0VsLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDBcbiAgdmFyIHNjcm9sbFRvcCAgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsVG9wXG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbExlZnRcblxuICByZXR1cm4ge1xuICAgIHRvcDogYm94LnRvcCAgKyBzY3JvbGxUb3AgIC0gY2xpZW50VG9wLFxuICAgIGxlZnQ6IGJveC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnRcbiAgfVxufVxuXG5mdW5jdGlvbiBib2R5T2Zmc2V0KGJvZHkpIHtcbiAgdmFyIHRvcCA9IGJvZHkub2Zmc2V0VG9wXG4gIHZhciBsZWZ0ID0gYm9keS5vZmZzZXRMZWZ0XG5cbiAgaWYgKHN1cHBvcnQuZG9lc05vdEluY2x1ZGVNYXJnaW5JbkJvZHlPZmZzZXQpIHtcbiAgICB0b3AgICs9IHBhcnNlRmxvYXQoYm9keS5zdHlsZS5tYXJnaW5Ub3AgfHwgMClcbiAgICBsZWZ0ICs9IHBhcnNlRmxvYXQoYm9keS5zdHlsZS5tYXJnaW5MZWZ0IHx8IDApXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvcDogdG9wLFxuICAgIGxlZnQ6IGxlZnRcbiAgfVxufVxuIiwidmFyIGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgc3VwcG9ydCxcblx0XHRhbGwsXG5cdFx0YSxcblx0XHRzZWxlY3QsXG5cdFx0b3B0LFxuXHRcdGlucHV0LFxuXHRcdGZyYWdtZW50LFxuXHRcdGV2ZW50TmFtZSxcblx0XHRpLFxuXHRcdGlzU3VwcG9ydGVkLFxuXHRcdGNsaWNrRm4sXG5cdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHQvLyBTZXR1cFxuXHRkaXYuc2V0QXR0cmlidXRlKCBcImNsYXNzTmFtZVwiLCBcInRcIiApO1xuXHRkaXYuaW5uZXJIVE1MID0gXCIgIDxsaW5rLz48dGFibGU+PC90YWJsZT48YSBocmVmPScvYSc+YTwvYT48aW5wdXQgdHlwZT0nY2hlY2tib3gnLz5cIjtcblxuXHQvLyBTdXBwb3J0IHRlc3RzIHdvbid0IHJ1biBpbiBzb21lIGxpbWl0ZWQgb3Igbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzXG5cdGFsbCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIik7XG5cdGEgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWyAwIF07XG5cdGlmICggIWFsbCB8fCAhYSB8fCAhYWxsLmxlbmd0aCApIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHQvLyBGaXJzdCBiYXRjaCBvZiB0ZXN0c1xuXHRzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXHRvcHQgPSBzZWxlY3QuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikgKTtcblx0aW5wdXQgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVsgMCBdO1xuXG5cdGEuc3R5bGUuY3NzVGV4dCA9IFwidG9wOjFweDtmbG9hdDpsZWZ0O29wYWNpdHk6LjVcIjtcblx0c3VwcG9ydCA9IHtcblx0XHQvLyBJRSBzdHJpcHMgbGVhZGluZyB3aGl0ZXNwYWNlIHdoZW4gLmlubmVySFRNTCBpcyB1c2VkXG5cdFx0bGVhZGluZ1doaXRlc3BhY2U6ICggZGl2LmZpcnN0Q2hpbGQubm9kZVR5cGUgPT09IDMgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRib2R5IGVsZW1lbnRzIGFyZW4ndCBhdXRvbWF0aWNhbGx5IGluc2VydGVkXG5cdFx0Ly8gSUUgd2lsbCBpbnNlcnQgdGhlbSBpbnRvIGVtcHR5IHRhYmxlc1xuXHRcdHRib2R5OiAhZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIikubGVuZ3RoLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgbGluayBlbGVtZW50cyBnZXQgc2VyaWFsaXplZCBjb3JyZWN0bHkgYnkgaW5uZXJIVE1MXG5cdFx0Ly8gVGhpcyByZXF1aXJlcyBhIHdyYXBwZXIgZWxlbWVudCBpbiBJRVxuXHRcdGh0bWxTZXJpYWxpemU6ICEhZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiKS5sZW5ndGgsXG5cblx0XHQvLyBHZXQgdGhlIHN0eWxlIGluZm9ybWF0aW9uIGZyb20gZ2V0QXR0cmlidXRlXG5cdFx0Ly8gKElFIHVzZXMgLmNzc1RleHQgaW5zdGVhZClcblx0XHRzdHlsZTogL3RvcC8udGVzdCggYS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiKSApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgVVJMcyBhcmVuJ3QgbWFuaXB1bGF0ZWRcblx0XHQvLyAoSUUgbm9ybWFsaXplcyBpdCBieSBkZWZhdWx0KVxuXHRcdGhyZWZOb3JtYWxpemVkOiAoIGEuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIvYVwiICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBlbGVtZW50IG9wYWNpdHkgZXhpc3RzXG5cdFx0Ly8gKElFIHVzZXMgZmlsdGVyIGluc3RlYWQpXG5cdFx0Ly8gVXNlIGEgcmVnZXggdG8gd29yayBhcm91bmQgYSBXZWJLaXQgaXNzdWUuIFNlZSAjNTE0NVxuXHRcdG9wYWNpdHk6IC9eMC41Ly50ZXN0KCBhLnN0eWxlLm9wYWNpdHkgKSxcblxuXHRcdC8vIFZlcmlmeSBzdHlsZSBmbG9hdCBleGlzdGVuY2Vcblx0XHQvLyAoSUUgdXNlcyBzdHlsZUZsb2F0IGluc3RlYWQgb2YgY3NzRmxvYXQpXG5cdFx0Y3NzRmxvYXQ6ICEhYS5zdHlsZS5jc3NGbG9hdCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGlmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCBmb3IgYSBjaGVja2JveFxuXHRcdC8vIHRoYXQgaXQgZGVmYXVsdHMgdG8gXCJvblwiLlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gXCJcIiBpbnN0ZWFkKVxuXHRcdGNoZWNrT246ICggaW5wdXQudmFsdWUgPT09IFwib25cIiApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgYSBzZWxlY3RlZC1ieS1kZWZhdWx0IG9wdGlvbiBoYXMgYSB3b3JraW5nIHNlbGVjdGVkIHByb3BlcnR5LlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gZmFsc2UgaW5zdGVhZCBvZiB0cnVlLCBJRSB0b28sIGlmIGl0J3MgaW4gYW4gb3B0Z3JvdXApXG5cdFx0b3B0U2VsZWN0ZWQ6IG9wdC5zZWxlY3RlZCxcblxuXHRcdC8vIFRlc3Qgc2V0QXR0cmlidXRlIG9uIGNhbWVsQ2FzZSBjbGFzcy4gSWYgaXQgd29ya3MsIHdlIG5lZWQgYXR0ckZpeGVzIHdoZW4gZG9pbmcgZ2V0L3NldEF0dHJpYnV0ZSAoaWU2LzcpXG5cdFx0Z2V0U2V0QXR0cmlidXRlOiBkaXYuY2xhc3NOYW1lICE9PSBcInRcIixcblxuXHRcdC8vIFRlc3RzIGZvciBlbmN0eXBlIHN1cHBvcnQgb24gYSBmb3JtICgjNjc0Mylcblx0XHRlbmN0eXBlOiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLmVuY3R5cGUsXG5cblx0XHQvLyBNYWtlcyBzdXJlIGNsb25pbmcgYW4gaHRtbDUgZWxlbWVudCBkb2VzIG5vdCBjYXVzZSBwcm9ibGVtc1xuXHRcdC8vIFdoZXJlIG91dGVySFRNTCBpcyB1bmRlZmluZWQsIHRoaXMgc3RpbGwgd29ya3Ncblx0XHRodG1sNUNsb25lOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpLmNsb25lTm9kZSggdHJ1ZSApLm91dGVySFRNTCAhPT0gXCI8Om5hdj48LzpuYXY+XCIsXG5cblx0XHQvLyBqUXVlcnkuc3VwcG9ydC5ib3hNb2RlbCBERVBSRUNBVEVEIGluIDEuOCBzaW5jZSB3ZSBkb24ndCBzdXBwb3J0IFF1aXJrcyBNb2RlXG5cdFx0Ym94TW9kZWw6ICggZG9jdW1lbnQuY29tcGF0TW9kZSA9PT0gXCJDU1MxQ29tcGF0XCIgKSxcblxuXHRcdC8vIFdpbGwgYmUgZGVmaW5lZCBsYXRlclxuXHRcdHN1Ym1pdEJ1YmJsZXM6IHRydWUsXG5cdFx0Y2hhbmdlQnViYmxlczogdHJ1ZSxcblx0XHRmb2N1c2luQnViYmxlczogZmFsc2UsXG5cdFx0ZGVsZXRlRXhwYW5kbzogdHJ1ZSxcblx0XHRub0Nsb25lRXZlbnQ6IHRydWUsXG5cdFx0aW5saW5lQmxvY2tOZWVkc0xheW91dDogZmFsc2UsXG5cdFx0c2hyaW5rV3JhcEJsb2NrczogZmFsc2UsXG5cdFx0cmVsaWFibGVNYXJnaW5SaWdodDogdHJ1ZSxcblx0XHRib3hTaXppbmdSZWxpYWJsZTogdHJ1ZSxcblx0XHRwaXhlbFBvc2l0aW9uOiBmYWxzZVxuXHR9O1xuXG5cdC8vIE1ha2Ugc3VyZSBjaGVja2VkIHN0YXR1cyBpcyBwcm9wZXJseSBjbG9uZWRcblx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdHN1cHBvcnQubm9DbG9uZUNoZWNrZWQgPSBpbnB1dC5jbG9uZU5vZGUoIHRydWUgKS5jaGVja2VkO1xuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBvcHRpb25zIGluc2lkZSBkaXNhYmxlZCBzZWxlY3RzIGFyZW4ndCBtYXJrZWQgYXMgZGlzYWJsZWRcblx0Ly8gKFdlYktpdCBtYXJrcyB0aGVtIGFzIGRpc2FibGVkKVxuXHRzZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm9wdERpc2FibGVkID0gIW9wdC5kaXNhYmxlZDtcblxuXHQvLyBUZXN0IHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRlbGV0ZSBhbiBleHBhbmRvIGZyb20gYW4gZWxlbWVudFxuXHQvLyBGYWlscyBpbiBJbnRlcm5ldCBFeHBsb3JlclxuXHR0cnkge1xuXHRcdGRlbGV0ZSBkaXYudGVzdDtcblx0fSBjYXRjaCggZSApIHtcblx0XHRzdXBwb3J0LmRlbGV0ZUV4cGFuZG8gPSBmYWxzZTtcblx0fVxuXG5cdGlmICggIWRpdi5hZGRFdmVudExpc3RlbmVyICYmIGRpdi5hdHRhY2hFdmVudCAmJiBkaXYuZmlyZUV2ZW50ICkge1xuXHRcdGRpdi5hdHRhY2hFdmVudCggXCJvbmNsaWNrXCIsIGNsaWNrRm4gPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vIENsb25pbmcgYSBub2RlIHNob3VsZG4ndCBjb3B5IG92ZXIgYW55XG5cdFx0XHQvLyBib3VuZCBldmVudCBoYW5kbGVycyAoSUUgZG9lcyB0aGlzKVxuXHRcdFx0c3VwcG9ydC5ub0Nsb25lRXZlbnQgPSBmYWxzZTtcblx0XHR9KTtcblx0XHRkaXYuY2xvbmVOb2RlKCB0cnVlICkuZmlyZUV2ZW50KFwib25jbGlja1wiKTtcblx0XHRkaXYuZGV0YWNoRXZlbnQoIFwib25jbGlja1wiLCBjbGlja0ZuICk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhIHJhZGlvIG1haW50YWlucyBpdHMgdmFsdWVcblx0Ly8gYWZ0ZXIgYmVpbmcgYXBwZW5kZWQgdG8gdGhlIERPTVxuXHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0aW5wdXQudmFsdWUgPSBcInRcIjtcblx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJyYWRpb1wiICk7XG5cdHN1cHBvcnQucmFkaW9WYWx1ZSA9IGlucHV0LnZhbHVlID09PSBcInRcIjtcblxuXHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIiApO1xuXG5cdC8vICMxMTIxNyAtIFdlYktpdCBsb3NlcyBjaGVjayB3aGVuIHRoZSBuYW1lIGlzIGFmdGVyIHRoZSBjaGVja2VkIGF0dHJpYnV0ZVxuXHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcInRcIiApO1xuXG5cdGRpdi5hcHBlbmRDaGlsZCggaW5wdXQgKTtcblx0ZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYubGFzdENoaWxkICk7XG5cblx0Ly8gV2ViS2l0IGRvZXNuJ3QgY2xvbmUgY2hlY2tlZCBzdGF0ZSBjb3JyZWN0bHkgaW4gZnJhZ21lbnRzXG5cdHN1cHBvcnQuY2hlY2tDbG9uZSA9IGZyYWdtZW50LmNsb25lTm9kZSggdHJ1ZSApLmNsb25lTm9kZSggdHJ1ZSApLmxhc3RDaGlsZC5jaGVja2VkO1xuXG5cdC8vIENoZWNrIGlmIGEgZGlzY29ubmVjdGVkIGNoZWNrYm94IHdpbGwgcmV0YWluIGl0cyBjaGVja2VkXG5cdC8vIHZhbHVlIG9mIHRydWUgYWZ0ZXIgYXBwZW5kZWQgdG8gdGhlIERPTSAoSUU2LzcpXG5cdHN1cHBvcnQuYXBwZW5kQ2hlY2tlZCA9IGlucHV0LmNoZWNrZWQ7XG5cblx0ZnJhZ21lbnQucmVtb3ZlQ2hpbGQoIGlucHV0ICk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuXHQvLyBUZWNobmlxdWUgZnJvbSBKdXJpeSBaYXl0c2V2XG5cdC8vIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2RldGVjdGluZy1ldmVudC1zdXBwb3J0LXdpdGhvdXQtYnJvd3Nlci1zbmlmZmluZy9cblx0Ly8gV2Ugb25seSBjYXJlIGFib3V0IHRoZSBjYXNlIHdoZXJlIG5vbi1zdGFuZGFyZCBldmVudCBzeXN0ZW1zXG5cdC8vIGFyZSB1c2VkLCBuYW1lbHkgaW4gSUUuIFNob3J0LWNpcmN1aXRpbmcgaGVyZSBoZWxwcyB1cyB0b1xuXHQvLyBhdm9pZCBhbiBldmFsIGNhbGwgKGluIHNldEF0dHJpYnV0ZSkgd2hpY2ggY2FuIGNhdXNlIENTUFxuXHQvLyB0byBnbyBoYXl3aXJlLiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL1NlY3VyaXR5L0NTUFxuXHRpZiAoICFkaXYuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRmb3IgKCBpIGluIHtcblx0XHRcdHN1Ym1pdDogdHJ1ZSxcblx0XHRcdGNoYW5nZTogdHJ1ZSxcblx0XHRcdGZvY3VzaW46IHRydWVcblx0XHR9KSB7XG5cdFx0XHRldmVudE5hbWUgPSBcIm9uXCIgKyBpO1xuXHRcdFx0aXNTdXBwb3J0ZWQgPSAoIGV2ZW50TmFtZSBpbiBkaXYgKTtcblx0XHRcdGlmICggIWlzU3VwcG9ydGVkICkge1xuXHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKCBldmVudE5hbWUsIFwicmV0dXJuO1wiICk7XG5cdFx0XHRcdGlzU3VwcG9ydGVkID0gKCB0eXBlb2YgZGl2WyBldmVudE5hbWUgXSA9PT0gXCJmdW5jdGlvblwiICk7XG5cdFx0XHR9XG5cdFx0XHRzdXBwb3J0WyBpICsgXCJCdWJibGVzXCIgXSA9IGlzU3VwcG9ydGVkO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJ1biB0ZXN0cyB0aGF0IG5lZWQgYSBib2R5IGF0IGRvYyByZWFkeVxuXHRkb21yZWFkeShmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udGFpbmVyLCBkaXYsIHRkcywgbWFyZ2luRGl2LFxuXHRcdFx0ZGl2UmVzZXQgPSBcInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbjtib3gtc2l6aW5nOmNvbnRlbnQtYm94Oy1tb3otYm94LXNpemluZzpjb250ZW50LWJveDstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7XCIsXG5cdFx0XHRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuXG5cdFx0aWYgKCAhYm9keSApIHtcblx0XHRcdC8vIFJldHVybiBmb3IgZnJhbWVzZXQgZG9jcyB0aGF0IGRvbid0IGhhdmUgYSBib2R5XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb250YWluZXIuc3R5bGUuY3NzVGV4dCA9IFwidmlzaWJpbGl0eTpoaWRkZW47Ym9yZGVyOjA7d2lkdGg6MDtoZWlnaHQ6MDtwb3NpdGlvbjpzdGF0aWM7dG9wOjA7bWFyZ2luLXRvcDoxcHhcIjtcblx0XHRib2R5Lmluc2VydEJlZm9yZSggY29udGFpbmVyLCBib2R5LmZpcnN0Q2hpbGQgKTtcblxuXHRcdC8vIENvbnN0cnVjdCB0aGUgdGVzdCBlbGVtZW50XG5cdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXG4gICAgLy9DaGVjayBpZiB0YWJsZSBjZWxscyBzdGlsbCBoYXZlIG9mZnNldFdpZHRoL0hlaWdodCB3aGVuIHRoZXkgYXJlIHNldFxuICAgIC8vdG8gZGlzcGxheTpub25lIGFuZCB0aGVyZSBhcmUgc3RpbGwgb3RoZXIgdmlzaWJsZSB0YWJsZSBjZWxscyBpbiBhXG4gICAgLy90YWJsZSByb3c7IGlmIHNvLCBvZmZzZXRXaWR0aC9IZWlnaHQgYXJlIG5vdCByZWxpYWJsZSBmb3IgdXNlIHdoZW5cbiAgICAvL2RldGVybWluaW5nIGlmIGFuIGVsZW1lbnQgaGFzIGJlZW4gaGlkZGVuIGRpcmVjdGx5IHVzaW5nXG4gICAgLy9kaXNwbGF5Om5vbmUgKGl0IGlzIHN0aWxsIHNhZmUgdG8gdXNlIG9mZnNldHMgaWYgYSBwYXJlbnQgZWxlbWVudCBpc1xuICAgIC8vaGlkZGVuOyBkb24gc2FmZXR5IGdvZ2dsZXMgYW5kIHNlZSBidWcgIzQ1MTIgZm9yIG1vcmUgaW5mb3JtYXRpb24pLlxuICAgIC8vKG9ubHkgSUUgOCBmYWlscyB0aGlzIHRlc3QpXG5cdFx0ZGl2LmlubmVySFRNTCA9IFwiPHRhYmxlPjx0cj48dGQ+PC90ZD48dGQ+dDwvdGQ+PC90cj48L3RhYmxlPlwiO1xuXHRcdHRkcyA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpO1xuXHRcdHRkc1sgMCBdLnN0eWxlLmNzc1RleHQgPSBcInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5Om5vbmVcIjtcblx0XHRpc1N1cHBvcnRlZCA9ICggdGRzWyAwIF0ub2Zmc2V0SGVpZ2h0ID09PSAwICk7XG5cblx0XHR0ZHNbIDAgXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHR0ZHNbIDEgXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHQvLyBDaGVjayBpZiBlbXB0eSB0YWJsZSBjZWxscyBzdGlsbCBoYXZlIG9mZnNldFdpZHRoL0hlaWdodFxuXHRcdC8vIChJRSA8PSA4IGZhaWwgdGhpcyB0ZXN0KVxuXHRcdHN1cHBvcnQucmVsaWFibGVIaWRkZW5PZmZzZXRzID0gaXNTdXBwb3J0ZWQgJiYgKCB0ZHNbIDAgXS5vZmZzZXRIZWlnaHQgPT09IDAgKTtcblxuXHRcdC8vIENoZWNrIGJveC1zaXppbmcgYW5kIG1hcmdpbiBiZWhhdmlvclxuXHRcdGRpdi5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdGRpdi5zdHlsZS5jc3NUZXh0ID0gXCJib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoxcHg7Ym9yZGVyOjFweDtkaXNwbGF5OmJsb2NrO3dpZHRoOjRweDttYXJnaW4tdG9wOjElO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxJTtcIjtcblx0XHRzdXBwb3J0LmJveFNpemluZyA9ICggZGl2Lm9mZnNldFdpZHRoID09PSA0ICk7XG5cdFx0c3VwcG9ydC5kb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldCA9ICggYm9keS5vZmZzZXRUb3AgIT09IDEgKTtcblxuXHRcdC8vIE5PVEU6IFRvIGFueSBmdXR1cmUgbWFpbnRhaW5lciwgd2UndmUgd2luZG93LmdldENvbXB1dGVkU3R5bGVcblx0XHQvLyBiZWNhdXNlIGpzZG9tIG9uIG5vZGUuanMgd2lsbCBicmVhayB3aXRob3V0IGl0LlxuXHRcdGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgKSB7XG5cdFx0XHRzdXBwb3J0LnBpeGVsUG9zaXRpb24gPSAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBkaXYsIG51bGwgKSB8fCB7fSApLnRvcCAhPT0gXCIxJVwiO1xuXHRcdFx0c3VwcG9ydC5ib3hTaXppbmdSZWxpYWJsZSA9ICggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGRpdiwgbnVsbCApIHx8IHsgd2lkdGg6IFwiNHB4XCIgfSApLndpZHRoID09PSBcIjRweFwiO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBkaXYgd2l0aCBleHBsaWNpdCB3aWR0aCBhbmQgbm8gbWFyZ2luLXJpZ2h0IGluY29ycmVjdGx5XG5cdFx0XHQvLyBnZXRzIGNvbXB1dGVkIG1hcmdpbi1yaWdodCBiYXNlZCBvbiB3aWR0aCBvZiBjb250YWluZXIuIEZvciBtb3JlXG5cdFx0XHQvLyBpbmZvIHNlZSBidWcgIzMzMzNcblx0XHRcdC8vIEZhaWxzIGluIFdlYktpdCBiZWZvcmUgRmViIDIwMTEgbmlnaHRsaWVzXG5cdFx0XHQvLyBXZWJLaXQgQnVnIDEzMzQzIC0gZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5zIHdyb25nIHZhbHVlIGZvciBtYXJnaW4tcmlnaHRcblx0XHRcdG1hcmdpbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUuY3NzVGV4dCA9IGRpdi5zdHlsZS5jc3NUZXh0ID0gZGl2UmVzZXQ7XG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBtYXJnaW5EaXYuc3R5bGUud2lkdGggPSBcIjBcIjtcblx0XHRcdGRpdi5zdHlsZS53aWR0aCA9IFwiMXB4XCI7XG5cdFx0XHRkaXYuYXBwZW5kQ2hpbGQoIG1hcmdpbkRpdiApO1xuXHRcdFx0c3VwcG9ydC5yZWxpYWJsZU1hcmdpblJpZ2h0ID1cblx0XHRcdFx0IXBhcnNlRmxvYXQoICggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIG1hcmdpbkRpdiwgbnVsbCApIHx8IHt9ICkubWFyZ2luUmlnaHQgKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBkaXYuc3R5bGUuem9vbSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdC8vIENoZWNrIGlmIG5hdGl2ZWx5IGJsb2NrLWxldmVsIGVsZW1lbnRzIGFjdCBsaWtlIGlubGluZS1ibG9ja1xuXHRcdFx0Ly8gZWxlbWVudHMgd2hlbiBzZXR0aW5nIHRoZWlyIGRpc3BsYXkgdG8gJ2lubGluZScgYW5kIGdpdmluZ1xuXHRcdFx0Ly8gdGhlbSBsYXlvdXRcblx0XHRcdC8vIChJRSA8IDggZG9lcyB0aGlzKVxuXHRcdFx0ZGl2LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IGRpdlJlc2V0ICsgXCJ3aWR0aDoxcHg7cGFkZGluZzoxcHg7ZGlzcGxheTppbmxpbmU7em9vbToxXCI7XG5cdFx0XHRzdXBwb3J0LmlubGluZUJsb2NrTmVlZHNMYXlvdXQgPSAoIGRpdi5vZmZzZXRXaWR0aCA9PT0gMyApO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBlbGVtZW50cyB3aXRoIGxheW91dCBzaHJpbmstd3JhcCB0aGVpciBjaGlsZHJlblxuXHRcdFx0Ly8gKElFIDYgZG9lcyB0aGlzKVxuXHRcdFx0ZGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0XHRkaXYuc3R5bGUub3ZlcmZsb3cgPSBcInZpc2libGVcIjtcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBcIjxkaXY+PC9kaXY+XCI7XG5cdFx0XHRkaXYuZmlyc3RDaGlsZC5zdHlsZS53aWR0aCA9IFwiNXB4XCI7XG5cdFx0XHRzdXBwb3J0LnNocmlua1dyYXBCbG9ja3MgPSAoIGRpdi5vZmZzZXRXaWR0aCAhPT0gMyApO1xuXG5cdFx0XHRjb250YWluZXIuc3R5bGUuem9vbSA9IDE7XG5cdFx0fVxuXG5cdFx0Ly8gTnVsbCBlbGVtZW50cyB0byBhdm9pZCBsZWFrcyBpbiBJRVxuXHRcdGJvZHkucmVtb3ZlQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRcdGNvbnRhaW5lciA9IGRpdiA9IHRkcyA9IG1hcmdpbkRpdiA9IG51bGw7XG5cdH0pO1xuXG5cdC8vIE51bGwgZWxlbWVudHMgdG8gYXZvaWQgbGVha3MgaW4gSUVcblx0ZnJhZ21lbnQucmVtb3ZlQ2hpbGQoIGRpdiApO1xuXHRhbGwgPSBhID0gc2VsZWN0ID0gb3B0ID0gaW5wdXQgPSBmcmFnbWVudCA9IGRpdiA9IG51bGw7XG5cblx0cmV0dXJuIHN1cHBvcnQ7XG59KSgpO1xuIiwiLyohXG4gICogZG9tcmVhZHkgKGMpIER1c3RpbiBEaWF6IDIwMTQgLSBMaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxuXG59KCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgZm5zID0gW10sIGxpc3RlbmVyXG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgaGFjayA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGxcbiAgICAsIGRvbUNvbnRlbnRMb2FkZWQgPSAnRE9NQ29udGVudExvYWRlZCdcbiAgICAsIGxvYWRlZCA9IChoYWNrID8gL15sb2FkZWR8XmMvIDogL15sb2FkZWR8Xml8XmMvKS50ZXN0KGRvYy5yZWFkeVN0YXRlKVxuXG5cbiAgaWYgKCFsb2FkZWQpXG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyKVxuICAgIGxvYWRlZCA9IDFcbiAgICB3aGlsZSAobGlzdGVuZXIgPSBmbnMuc2hpZnQoKSkgbGlzdGVuZXIoKVxuICB9KVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICBsb2FkZWQgPyBzZXRUaW1lb3V0KGZuLCAwKSA6IGZucy5wdXNoKGZuKVxuICB9XG5cbn0pO1xuIiwiXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RG9jdW1lbnQ7XG5cbi8vIGRlZmluZWQgYnkgdzNjXG52YXIgRE9DVU1FTlRfTk9ERSA9IDk7XG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgYHdgIGlzIGEgRG9jdW1lbnQgb2JqZWN0LCBvciBgZmFsc2VgIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0gez99IGQgLSBEb2N1bWVudCBvYmplY3QsIG1heWJlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0RvY3VtZW50IChkKSB7XG4gIHJldHVybiBkICYmIGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX05PREU7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYGRvY3VtZW50YCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBgbm9kZWAsIHdoaWNoIG1heSBiZVxuICogYSBET00gZWxlbWVudCwgdGhlIFdpbmRvdyBvYmplY3QsIGEgU2VsZWN0aW9uLCBhIFJhbmdlLiBCYXNpY2FsbHkgYW55IERPTVxuICogb2JqZWN0IHRoYXQgcmVmZXJlbmNlcyB0aGUgRG9jdW1lbnQgaW4gc29tZSB3YXksIHRoaXMgZnVuY3Rpb24gd2lsbCBmaW5kIGl0LlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IG5vZGUgLSBET00gbm9kZSwgc2VsZWN0aW9uLCBvciByYW5nZSBpbiB3aGljaCB0byBmaW5kIHRoZSBgZG9jdW1lbnRgIG9iamVjdFxuICogQHJldHVybiB7RG9jdW1lbnR9IHRoZSBgZG9jdW1lbnRgIG9iamVjdCBhc3NvY2lhdGVkIHdpdGggYG5vZGVgXG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZ2V0RG9jdW1lbnQobm9kZSkge1xuICBpZiAoaXNEb2N1bWVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuXG4gIH0gZWxzZSBpZiAoaXNEb2N1bWVudChub2RlLm93bmVyRG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudDtcblxuICB9IGVsc2UgaWYgKGlzRG9jdW1lbnQobm9kZS5kb2N1bWVudCkpIHtcbiAgICByZXR1cm4gbm9kZS5kb2N1bWVudDtcblxuICB9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLnBhcmVudE5vZGUpO1xuXG4gIC8vIFJhbmdlIHN1cHBvcnRcbiAgfSBlbHNlIGlmIChub2RlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSB7XG4gICAgcmV0dXJuIGdldERvY3VtZW50KG5vZGUuY29tbW9uQW5jZXN0b3JDb250YWluZXIpO1xuXG4gIH0gZWxzZSBpZiAobm9kZS5zdGFydENvbnRhaW5lcikge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLnN0YXJ0Q29udGFpbmVyKTtcblxuICAvLyBTZWxlY3Rpb24gc3VwcG9ydFxuICB9IGVsc2UgaWYgKG5vZGUuYW5jaG9yTm9kZSkge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLmFuY2hvck5vZGUpO1xuICB9XG59XG4iLCIvKiEganMtY29va2llIHYzLjAuNSB8IE1JVCAqL1xuO1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gZ2xvYmFsLkNvb2tpZXM7XG4gICAgdmFyIGV4cG9ydHMgPSBnbG9iYWwuQ29va2llcyA9IGZhY3RvcnkoKTtcbiAgICBleHBvcnRzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7IGdsb2JhbC5Db29raWVzID0gY3VycmVudDsgcmV0dXJuIGV4cG9ydHM7IH07XG4gIH0pKCkpO1xufSkodGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuICBmdW5jdGlvbiBhc3NpZ24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbiAgdmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gICAgcmVhZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICAgIGRlY29kZVVSSUNvbXBvbmVudFxuICAgICAgKVxuICAgIH1cbiAgfTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuICBmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIsIGRlZmF1bHRBdHRyaWJ1dGVzKSB7XG4gICAgZnVuY3Rpb24gc2V0IChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XG4gICAgICB9XG4gICAgICBpZiAoYXR0cmlidXRlcy5leHBpcmVzKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpXG4gICAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgICAgdmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuICAgICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxuICAgICAgICAvLyAuLi5cbiAgICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgICAvLyAgICAgY2hhcmFjdGVyOlxuICAgICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoZG9jdW1lbnQuY29va2llID1cbiAgICAgICAgbmFtZSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwgbmFtZSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0IChuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAhbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcbiAgICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcbiAgICAgIHZhciBqYXIgPSB7fTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XG4gICAgICAgICAgamFyW2ZvdW5kXSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZCk7XG5cbiAgICAgICAgICBpZiAobmFtZSA9PT0gZm91bmQpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZSA/IGphcltuYW1lXSA6IGphclxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAge1xuICAgICAgICBzZXQsXG4gICAgICAgIGdldCxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICAgIHNldChcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgICB9LFxuICAgICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgdmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbiAgcmV0dXJuIGFwaTtcblxufSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHVuZGVmO1xuXG4vKipcbiAqIERlY29kZSBhIFVSSSBlbmNvZGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFVSSSBlbmNvZGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIHtTdHJpbmd8TnVsbH0gVGhlIGRlY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoaW5wdXQucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRlbXB0cyB0byBlbmNvZGUgYSBnaXZlbiBpbnB1dC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIGVuY29kZWQuXG4gKiBAcmV0dXJucyB7U3RyaW5nfE51bGx9IFRoZSBlbmNvZGVkIHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIHF1ZXJ5IHN0cmluZyBwYXJzZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5IFRoZSBxdWVyeSBzdHJpbmcgdGhhdCBuZWVkcyB0byBiZSBwYXJzZWQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnkpIHtcbiAgdmFyIHBhcnNlciA9IC8oW149PyMmXSspPT8oW14mXSopL2dcbiAgICAsIHJlc3VsdCA9IHt9XG4gICAgLCBwYXJ0O1xuXG4gIHdoaWxlIChwYXJ0ID0gcGFyc2VyLmV4ZWMocXVlcnkpKSB7XG4gICAgdmFyIGtleSA9IGRlY29kZShwYXJ0WzFdKVxuICAgICAgLCB2YWx1ZSA9IGRlY29kZShwYXJ0WzJdKTtcblxuICAgIC8vXG4gICAgLy8gUHJldmVudCBvdmVycmlkaW5nIG9mIGV4aXN0aW5nIHByb3BlcnRpZXMuIFRoaXMgZW5zdXJlcyB0aGF0IGJ1aWxkLWluXG4gICAgLy8gbWV0aG9kcyBsaWtlIGB0b1N0cmluZ2Agb3IgX19wcm90b19fIGFyZSBub3Qgb3ZlcnJpZGVuIGJ5IG1hbGljaW91c1xuICAgIC8vIHF1ZXJ5c3RyaW5ncy5cbiAgICAvL1xuICAgIC8vIEluIHRoZSBjYXNlIGlmIGZhaWxlZCBkZWNvZGluZywgd2Ugd2FudCB0byBvbWl0IHRoZSBrZXkvdmFsdWUgcGFpcnNcbiAgICAvLyBmcm9tIHRoZSByZXN1bHQuXG4gICAgLy9cbiAgICBpZiAoa2V5ID09PSBudWxsIHx8IHZhbHVlID09PSBudWxsIHx8IGtleSBpbiByZXN1bHQpIGNvbnRpbnVlO1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhIHF1ZXJ5IHN0cmluZyB0byBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBPYmplY3QgdGhhdCBzaG91bGQgYmUgdHJhbnNmb3JtZWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4IE9wdGlvbmFsIHByZWZpeC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZ2lmeShvYmosIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggfHwgJyc7XG5cbiAgdmFyIHBhaXJzID0gW11cbiAgICAsIHZhbHVlXG4gICAgLCBrZXk7XG5cbiAgLy9cbiAgLy8gT3B0aW9uYWxseSBwcmVmaXggd2l0aCBhICc/JyBpZiBuZWVkZWRcbiAgLy9cbiAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgcHJlZml4KSBwcmVmaXggPSAnPyc7XG5cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhcy5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgLy9cbiAgICAgIC8vIEVkZ2UgY2FzZXMgd2hlcmUgd2UgYWN0dWFsbHkgd2FudCB0byBlbmNvZGUgdGhlIHZhbHVlIHRvIGFuIGVtcHR5XG4gICAgICAvLyBzdHJpbmcgaW5zdGVhZCBvZiB0aGUgc3RyaW5naWZpZWQgdmFsdWUuXG4gICAgICAvL1xuICAgICAgaWYgKCF2YWx1ZSAmJiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmIHx8IGlzTmFOKHZhbHVlKSkpIHtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cblxuICAgICAga2V5ID0gZW5jb2RlKGtleSk7XG4gICAgICB2YWx1ZSA9IGVuY29kZSh2YWx1ZSk7XG5cbiAgICAgIC8vXG4gICAgICAvLyBJZiB3ZSBmYWlsZWQgdG8gZW5jb2RlIHRoZSBzdHJpbmdzLCB3ZSBzaG91bGQgYmFpbCBvdXQgYXMgd2UgZG9uJ3RcbiAgICAgIC8vIHdhbnQgdG8gYWRkIGludmFsaWQgc3RyaW5ncyB0byB0aGUgcXVlcnkuXG4gICAgICAvL1xuICAgICAgaWYgKGtleSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBwYWlycy5wdXNoKGtleSArJz0nKyB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhaXJzLmxlbmd0aCA/IHByZWZpeCArIHBhaXJzLmpvaW4oJyYnKSA6ICcnO1xufVxuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuZXhwb3J0cy5zdHJpbmdpZnkgPSBxdWVyeXN0cmluZ2lmeTtcbmV4cG9ydHMucGFyc2UgPSBxdWVyeXN0cmluZztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayBpZiB3ZSdyZSByZXF1aXJlZCB0byBhZGQgYSBwb3J0IG51bWJlci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jZGVmYXVsdC1wb3J0XG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHBvcnQgUG9ydCBudW1iZXIgd2UgbmVlZCB0byBjaGVja1xuICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sIFByb3RvY29sIHdlIG5lZWQgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJcyBpdCBhIGRlZmF1bHQgcG9ydCBmb3IgdGhlIGdpdmVuIHByb3RvY29sXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXF1aXJlZChwb3J0LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sLnNwbGl0KCc6JylbMF07XG4gIHBvcnQgPSArcG9ydDtcblxuICBpZiAoIXBvcnQpIHJldHVybiBmYWxzZTtcblxuICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgY2FzZSAnaHR0cCc6XG4gICAgY2FzZSAnd3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA4MDtcblxuICAgIGNhc2UgJ2h0dHBzJzpcbiAgICBjYXNlICd3c3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA0NDM7XG5cbiAgICBjYXNlICdmdHAnOlxuICAgIHJldHVybiBwb3J0ICE9PSAyMTtcblxuICAgIGNhc2UgJ2dvcGhlcic6XG4gICAgcmV0dXJuIHBvcnQgIT09IDcwO1xuXG4gICAgY2FzZSAnZmlsZSc6XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBvcnQgIT09IDA7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWlyZWQgPSByZXF1aXJlKCdyZXF1aXJlcy1wb3J0JylcbiAgLCBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5naWZ5JylcbiAgLCBjb250cm9sT3JXaGl0ZXNwYWNlID0gL15bXFx4MDAtXFx4MjBcXHUwMGEwXFx1MTY4MFxcdTIwMDAtXFx1MjAwYVxcdTIwMjhcXHUyMDI5XFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZl0rL1xuICAsIENSSFRMRiA9IC9bXFxuXFxyXFx0XS9nXG4gICwgc2xhc2hlcyA9IC9eW0EtWmEtel1bQS1aYS16MC05Ky0uXSo6XFwvXFwvL1xuICAsIHBvcnQgPSAvOlxcZCskL1xuICAsIHByb3RvY29scmUgPSAvXihbYS16XVthLXowLTkuKy1dKjopPyhcXC9cXC8pPyhbXFxcXC9dKyk/KFtcXFNcXHNdKikvaVxuICAsIHdpbmRvd3NEcml2ZUxldHRlciA9IC9eW2EtekEtWl06LztcblxuLyoqXG4gKiBSZW1vdmUgY29udHJvbCBjaGFyYWN0ZXJzIGFuZCB3aGl0ZXNwYWNlIGZyb20gdGhlIGJlZ2lubmluZyBvZiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHN0ciBTdHJpbmcgdG8gdHJpbS5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IEEgbmV3IHN0cmluZyByZXByZXNlbnRpbmcgYHN0cmAgc3RyaXBwZWQgb2YgY29udHJvbFxuICogICAgIGNoYXJhY3RlcnMgYW5kIHdoaXRlc3BhY2UgZnJvbSBpdHMgYmVnaW5uaW5nLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiB0cmltTGVmdChzdHIpIHtcbiAgcmV0dXJuIChzdHIgPyBzdHIgOiAnJykudG9TdHJpbmcoKS5yZXBsYWNlKGNvbnRyb2xPcldoaXRlc3BhY2UsICcnKTtcbn1cblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIHBhcnNlIHJ1bGVzIGZvciB0aGUgVVJMIHBhcnNlciwgaXQgaW5mb3JtcyB0aGUgcGFyc2VyXG4gKiBhYm91dDpcbiAqXG4gKiAwLiBUaGUgY2hhciBpdCBOZWVkcyB0byBwYXJzZSwgaWYgaXQncyBhIHN0cmluZyBpdCBzaG91bGQgYmUgZG9uZSB1c2luZ1xuICogICAgaW5kZXhPZiwgUmVnRXhwIHVzaW5nIGV4ZWMgYW5kIE5hTiBtZWFucyBzZXQgYXMgY3VycmVudCB2YWx1ZS5cbiAqIDEuIFRoZSBwcm9wZXJ0eSB3ZSBzaG91bGQgc2V0IHdoZW4gcGFyc2luZyB0aGlzIHZhbHVlLlxuICogMi4gSW5kaWNhdGlvbiBpZiBpdCdzIGJhY2t3YXJkcyBvciBmb3J3YXJkIHBhcnNpbmcsIHdoZW4gc2V0IGFzIG51bWJlciBpdCdzXG4gKiAgICB0aGUgdmFsdWUgb2YgZXh0cmEgY2hhcnMgdGhhdCBzaG91bGQgYmUgc3BsaXQgb2ZmLlxuICogMy4gSW5oZXJpdCBmcm9tIGxvY2F0aW9uIGlmIG5vbiBleGlzdGluZyBpbiB0aGUgcGFyc2VyLlxuICogNC4gYHRvTG93ZXJDYXNlYCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICovXG52YXIgcnVsZXMgPSBbXG4gIFsnIycsICdoYXNoJ10sICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJz8nLCAncXVlcnknXSwgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgZnVuY3Rpb24gc2FuaXRpemUoYWRkcmVzcywgdXJsKSB7ICAgICAvLyBTYW5pdGl6ZSB3aGF0IGlzIGxlZnQgb2YgdGhlIGFkZHJlc3NcbiAgICByZXR1cm4gaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyBhZGRyZXNzLnJlcGxhY2UoL1xcXFwvZywgJy8nKSA6IGFkZHJlc3M7XG4gIH0sXG4gIFsnLycsICdwYXRobmFtZSddLCAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJ0AnLCAnYXV0aCcsIDFdLCAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgZnJvbnQuXG4gIFtOYU4sICdob3N0JywgdW5kZWZpbmVkLCAxLCAxXSwgICAgICAgLy8gU2V0IGxlZnQgb3ZlciB2YWx1ZS5cbiAgWy86KFxcZCopJC8sICdwb3J0JywgdW5kZWZpbmVkLCAxXSwgICAgLy8gUmVnRXhwIHRoZSBiYWNrLlxuICBbTmFOLCAnaG9zdG5hbWUnLCB1bmRlZmluZWQsIDEsIDFdICAgIC8vIFNldCBsZWZ0IG92ZXIuXG5dO1xuXG4vKipcbiAqIFRoZXNlIHByb3BlcnRpZXMgc2hvdWxkIG5vdCBiZSBjb3BpZWQgb3IgaW5oZXJpdGVkIGZyb20uIFRoaXMgaXMgb25seSBuZWVkZWRcbiAqIGZvciBhbGwgbm9uIGJsb2IgVVJMJ3MgYXMgYSBibG9iIFVSTCBkb2VzIG5vdCBpbmNsdWRlIGEgaGFzaCwgb25seSB0aGVcbiAqIG9yaWdpbi5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xudmFyIGlnbm9yZSA9IHsgaGFzaDogMSwgcXVlcnk6IDEgfTtcblxuLyoqXG4gKiBUaGUgbG9jYXRpb24gb2JqZWN0IGRpZmZlcnMgd2hlbiB5b3VyIGNvZGUgaXMgbG9hZGVkIHRocm91Z2ggYSBub3JtYWwgcGFnZSxcbiAqIFdvcmtlciBvciB0aHJvdWdoIGEgd29ya2VyIHVzaW5nIGEgYmxvYi4gQW5kIHdpdGggdGhlIGJsb2JibGUgYmVnaW5zIHRoZVxuICogdHJvdWJsZSBhcyB0aGUgbG9jYXRpb24gb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgVVJMIG9mIHRoZSBibG9iLCBub3QgdGhlXG4gKiBsb2NhdGlvbiBvZiB0aGUgcGFnZSB3aGVyZSBvdXIgY29kZSBpcyBsb2FkZWQgaW4uIFRoZSBhY3R1YWwgb3JpZ2luIGlzXG4gKiBlbmNvZGVkIGluIHRoZSBgcGF0aG5hbWVgIHNvIHdlIGNhbiB0aGFua2Z1bGx5IGdlbmVyYXRlIGEgZ29vZCBcImRlZmF1bHRcIlxuICogbG9jYXRpb24gZnJvbSBpdCBzbyB3ZSBjYW4gZ2VuZXJhdGUgcHJvcGVyIHJlbGF0aXZlIFVSTCdzIGFnYWluLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gbG9jIE9wdGlvbmFsIGRlZmF1bHQgbG9jYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gbG9sY2F0aW9uIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbG9sY2F0aW9uKGxvYykge1xuICB2YXIgZ2xvYmFsVmFyO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gd2luZG93O1xuICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gZ2xvYmFsO1xuICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHNlbGY7XG4gIGVsc2UgZ2xvYmFsVmFyID0ge307XG5cbiAgdmFyIGxvY2F0aW9uID0gZ2xvYmFsVmFyLmxvY2F0aW9uIHx8IHt9O1xuICBsb2MgPSBsb2MgfHwgbG9jYXRpb247XG5cbiAgdmFyIGZpbmFsZGVzdGluYXRpb24gPSB7fVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NcbiAgICAsIGtleTtcblxuICBpZiAoJ2Jsb2I6JyA9PT0gbG9jLnByb3RvY29sKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwodW5lc2NhcGUobG9jLnBhdGhuYW1lKSwge30pO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwobG9jLCB7fSk7XG4gICAgZm9yIChrZXkgaW4gaWdub3JlKSBkZWxldGUgZmluYWxkZXN0aW5hdGlvbltrZXldO1xuICB9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlKSB7XG4gICAgZm9yIChrZXkgaW4gbG9jKSB7XG4gICAgICBpZiAoa2V5IGluIGlnbm9yZSkgY29udGludWU7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uW2tleV0gPSBsb2Nba2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9IHNsYXNoZXMudGVzdChsb2MuaHJlZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbmFsZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHByb3RvY29sIHNjaGVtZSBpcyBzcGVjaWFsLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBUaGUgcHJvdG9jb2wgc2NoZW1lIG9mIHRoZSBVUkxcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcHJvdG9jb2wgc2NoZW1lIGlzIHNwZWNpYWwsIGVsc2UgYGZhbHNlYFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaXNTcGVjaWFsKHNjaGVtZSkge1xuICByZXR1cm4gKFxuICAgIHNjaGVtZSA9PT0gJ2ZpbGU6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2Z0cDonIHx8XG4gICAgc2NoZW1lID09PSAnaHR0cDonIHx8XG4gICAgc2NoZW1lID09PSAnaHR0cHM6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ3dzOicgfHxcbiAgICBzY2hlbWUgPT09ICd3c3M6J1xuICApO1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIFByb3RvY29sRXh0cmFjdFxuICogQHR5cGUgT2JqZWN0XG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgbWF0Y2hlZCBpbiB0aGUgVVJMLCBpbiBsb3dlcmNhc2UuXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHNsYXNoZXMgYHRydWVgIGlmIHByb3RvY29sIGlzIGZvbGxvd2VkIGJ5IFwiLy9cIiwgZWxzZSBgZmFsc2VgLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHJlc3QgUmVzdCBvZiB0aGUgVVJMIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHByb3RvY29sLlxuICovXG5cbi8qKlxuICogRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBmcm9tIGEgVVJMIHdpdGgvd2l0aG91dCBkb3VibGUgc2xhc2ggKFwiLy9cIikuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gZXh0cmFjdCBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IGxvY2F0aW9uXG4gKiBAcmV0dXJuIHtQcm90b2NvbEV4dHJhY3R9IEV4dHJhY3RlZCBpbmZvcm1hdGlvbi5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbChhZGRyZXNzLCBsb2NhdGlvbikge1xuICBhZGRyZXNzID0gdHJpbUxlZnQoYWRkcmVzcyk7XG4gIGFkZHJlc3MgPSBhZGRyZXNzLnJlcGxhY2UoQ1JIVExGLCAnJyk7XG4gIGxvY2F0aW9uID0gbG9jYXRpb24gfHwge307XG5cbiAgdmFyIG1hdGNoID0gcHJvdG9jb2xyZS5leGVjKGFkZHJlc3MpO1xuICB2YXIgcHJvdG9jb2wgPSBtYXRjaFsxXSA/IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgdmFyIGZvcndhcmRTbGFzaGVzID0gISFtYXRjaFsyXTtcbiAgdmFyIG90aGVyU2xhc2hlcyA9ICEhbWF0Y2hbM107XG4gIHZhciBzbGFzaGVzQ291bnQgPSAwO1xuICB2YXIgcmVzdDtcblxuICBpZiAoZm9yd2FyZFNsYXNoZXMpIHtcbiAgICBpZiAob3RoZXJTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gbWF0Y2hbMl0gKyBtYXRjaFszXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbMl0ubGVuZ3RoICsgbWF0Y2hbM10ubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0ID0gbWF0Y2hbMl0gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzJdLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG90aGVyU2xhc2hlcykge1xuICAgICAgcmVzdCA9IG1hdGNoWzNdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFszXS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3QgPSBtYXRjaFs0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChwcm90b2NvbCA9PT0gJ2ZpbGU6Jykge1xuICAgIGlmIChzbGFzaGVzQ291bnQgPj0gMikge1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoMik7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3BlY2lhbChwcm90b2NvbCkpIHtcbiAgICByZXN0ID0gbWF0Y2hbNF07XG4gIH0gZWxzZSBpZiAocHJvdG9jb2wpIHtcbiAgICBpZiAoZm9yd2FyZFNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKDIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzbGFzaGVzQ291bnQgPj0gMiAmJiBpc1NwZWNpYWwobG9jYXRpb24ucHJvdG9jb2wpKSB7XG4gICAgcmVzdCA9IG1hdGNoWzRdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgc2xhc2hlczogZm9yd2FyZFNsYXNoZXMgfHwgaXNTcGVjaWFsKHByb3RvY29sKSxcbiAgICBzbGFzaGVzQ291bnQ6IHNsYXNoZXNDb3VudCxcbiAgICByZXN0OiByZXN0XG4gIH07XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhIHJlbGF0aXZlIFVSTCBwYXRobmFtZSBhZ2FpbnN0IGEgYmFzZSBVUkwgcGF0aG5hbWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlbGF0aXZlIFBhdGhuYW1lIG9mIHRoZSByZWxhdGl2ZSBVUkwuXG4gKiBAcGFyYW0ge1N0cmluZ30gYmFzZSBQYXRobmFtZSBvZiB0aGUgYmFzZSBVUkwuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJlc29sdmVkIHBhdGhuYW1lLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZShyZWxhdGl2ZSwgYmFzZSkge1xuICBpZiAocmVsYXRpdmUgPT09ICcnKSByZXR1cm4gYmFzZTtcblxuICB2YXIgcGF0aCA9IChiYXNlIHx8ICcvJykuc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuY29uY2F0KHJlbGF0aXZlLnNwbGl0KCcvJykpXG4gICAgLCBpID0gcGF0aC5sZW5ndGhcbiAgICAsIGxhc3QgPSBwYXRoW2kgLSAxXVxuICAgICwgdW5zaGlmdCA9IGZhbHNlXG4gICAgLCB1cCA9IDA7XG5cbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChwYXRoW2ldID09PSAnLicpIHtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGF0aFtpXSA9PT0gJy4uJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIGlmIChpID09PSAwKSB1bnNoaWZ0ID0gdHJ1ZTtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICBpZiAodW5zaGlmdCkgcGF0aC51bnNoaWZ0KCcnKTtcbiAgaWYgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSBwYXRoLnB1c2goJycpO1xuXG4gIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcbn1cblxuLyoqXG4gKiBUaGUgYWN0dWFsIFVSTCBpbnN0YW5jZS4gSW5zdGVhZCBvZiByZXR1cm5pbmcgYW4gb2JqZWN0IHdlJ3ZlIG9wdGVkLWluIHRvXG4gKiBjcmVhdGUgYW4gYWN0dWFsIGNvbnN0cnVjdG9yIGFzIGl0J3MgbXVjaCBtb3JlIG1lbW9yeSBlZmZpY2llbnQgYW5kXG4gKiBmYXN0ZXIgYW5kIGl0IHBsZWFzZXMgbXkgT0NELlxuICpcbiAqIEl0IGlzIHdvcnRoIG5vdGluZyB0aGF0IHdlIHNob3VsZCBub3QgdXNlIGBVUkxgIGFzIGNsYXNzIG5hbWUgdG8gcHJldmVudFxuICogY2xhc2hlcyB3aXRoIHRoZSBnbG9iYWwgVVJMIGluc3RhbmNlIHRoYXQgZ290IGludHJvZHVjZWQgaW4gYnJvd3NlcnMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBwYXJzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gW2xvY2F0aW9uXSBMb2NhdGlvbiBkZWZhdWx0cyBmb3IgcmVsYXRpdmUgcGF0aHMuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtwYXJzZXJdIFBhcnNlciBmb3IgdGhlIHF1ZXJ5IHN0cmluZy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIFVybChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcbiAgYWRkcmVzcyA9IGFkZHJlc3MucmVwbGFjZShDUkhUTEYsICcnKTtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVXJsKSkge1xuICAgIHJldHVybiBuZXcgVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpO1xuICB9XG5cbiAgdmFyIHJlbGF0aXZlLCBleHRyYWN0ZWQsIHBhcnNlLCBpbnN0cnVjdGlvbiwgaW5kZXgsIGtleVxuICAgICwgaW5zdHJ1Y3Rpb25zID0gcnVsZXMuc2xpY2UoKVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NhdGlvblxuICAgICwgdXJsID0gdGhpc1xuICAgICwgaSA9IDA7XG5cbiAgLy9cbiAgLy8gVGhlIGZvbGxvd2luZyBpZiBzdGF0ZW1lbnRzIGFsbG93cyB0aGlzIG1vZHVsZSB0d28gaGF2ZSBjb21wYXRpYmlsaXR5IHdpdGhcbiAgLy8gMiBkaWZmZXJlbnQgQVBJOlxuICAvL1xuICAvLyAxLiBOb2RlLmpzJ3MgYHVybC5wYXJzZWAgYXBpIHdoaWNoIGFjY2VwdHMgYSBVUkwsIGJvb2xlYW4gYXMgYXJndW1lbnRzXG4gIC8vICAgIHdoZXJlIHRoZSBib29sZWFuIGluZGljYXRlcyB0aGF0IHRoZSBxdWVyeSBzdHJpbmcgc2hvdWxkIGFsc28gYmUgcGFyc2VkLlxuICAvL1xuICAvLyAyLiBUaGUgYFVSTGAgaW50ZXJmYWNlIG9mIHRoZSBicm93c2VyIHdoaWNoIGFjY2VwdHMgYSBVUkwsIG9iamVjdCBhc1xuICAvLyAgICBhcmd1bWVudHMuIFRoZSBzdXBwbGllZCBvYmplY3Qgd2lsbCBiZSB1c2VkIGFzIGRlZmF1bHQgdmFsdWVzIC8gZmFsbC1iYWNrXG4gIC8vICAgIGZvciByZWxhdGl2ZSBwYXRocy5cbiAgLy9cbiAgaWYgKCdvYmplY3QnICE9PSB0eXBlICYmICdzdHJpbmcnICE9PSB0eXBlKSB7XG4gICAgcGFyc2VyID0gbG9jYXRpb247XG4gICAgbG9jYXRpb24gPSBudWxsO1xuICB9XG5cbiAgaWYgKHBhcnNlciAmJiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgcGFyc2VyKSBwYXJzZXIgPSBxcy5wYXJzZTtcblxuICBsb2NhdGlvbiA9IGxvbGNhdGlvbihsb2NhdGlvbik7XG5cbiAgLy9cbiAgLy8gRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBiZWZvcmUgcnVubmluZyB0aGUgaW5zdHJ1Y3Rpb25zLlxuICAvL1xuICBleHRyYWN0ZWQgPSBleHRyYWN0UHJvdG9jb2woYWRkcmVzcyB8fCAnJywgbG9jYXRpb24pO1xuICByZWxhdGl2ZSA9ICFleHRyYWN0ZWQucHJvdG9jb2wgJiYgIWV4dHJhY3RlZC5zbGFzaGVzO1xuICB1cmwuc2xhc2hlcyA9IGV4dHJhY3RlZC5zbGFzaGVzIHx8IHJlbGF0aXZlICYmIGxvY2F0aW9uLnNsYXNoZXM7XG4gIHVybC5wcm90b2NvbCA9IGV4dHJhY3RlZC5wcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbCB8fCAnJztcbiAgYWRkcmVzcyA9IGV4dHJhY3RlZC5yZXN0O1xuXG4gIC8vXG4gIC8vIFdoZW4gdGhlIGF1dGhvcml0eSBjb21wb25lbnQgaXMgYWJzZW50IHRoZSBVUkwgc3RhcnRzIHdpdGggYSBwYXRoXG4gIC8vIGNvbXBvbmVudC5cbiAgLy9cbiAgaWYgKFxuICAgIGV4dHJhY3RlZC5wcm90b2NvbCA9PT0gJ2ZpbGU6JyAmJiAoXG4gICAgICBleHRyYWN0ZWQuc2xhc2hlc0NvdW50ICE9PSAyIHx8IHdpbmRvd3NEcml2ZUxldHRlci50ZXN0KGFkZHJlc3MpKSB8fFxuICAgICghZXh0cmFjdGVkLnNsYXNoZXMgJiZcbiAgICAgIChleHRyYWN0ZWQucHJvdG9jb2wgfHxcbiAgICAgICAgZXh0cmFjdGVkLnNsYXNoZXNDb3VudCA8IDIgfHxcbiAgICAgICAgIWlzU3BlY2lhbCh1cmwucHJvdG9jb2wpKSlcbiAgKSB7XG4gICAgaW5zdHJ1Y3Rpb25zWzNdID0gWy8oLiopLywgJ3BhdGhuYW1lJ107XG4gIH1cblxuICBmb3IgKDsgaSA8IGluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zW2ldO1xuXG4gICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYWRkcmVzcyA9IGluc3RydWN0aW9uKGFkZHJlc3MsIHVybCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgaWYgKHBhcnNlICE9PSBwYXJzZSkge1xuICAgICAgdXJsW2tleV0gPSBhZGRyZXNzO1xuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXJzZSkge1xuICAgICAgaW5kZXggPSBwYXJzZSA9PT0gJ0AnXG4gICAgICAgID8gYWRkcmVzcy5sYXN0SW5kZXhPZihwYXJzZSlcbiAgICAgICAgOiBhZGRyZXNzLmluZGV4T2YocGFyc2UpO1xuXG4gICAgICBpZiAofmluZGV4KSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGluc3RydWN0aW9uWzJdKSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZShpbmRleCArIGluc3RydWN0aW9uWzJdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGluZGV4ID0gcGFyc2UuZXhlYyhhZGRyZXNzKSkpIHtcbiAgICAgIHVybFtrZXldID0gaW5kZXhbMV07XG4gICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleC5pbmRleCk7XG4gICAgfVxuXG4gICAgdXJsW2tleV0gPSB1cmxba2V5XSB8fCAoXG4gICAgICByZWxhdGl2ZSAmJiBpbnN0cnVjdGlvblszXSA/IGxvY2F0aW9uW2tleV0gfHwgJycgOiAnJ1xuICAgICk7XG5cbiAgICAvL1xuICAgIC8vIEhvc3RuYW1lLCBob3N0IGFuZCBwcm90b2NvbCBzaG91bGQgYmUgbG93ZXJjYXNlZCBzbyB0aGV5IGNhbiBiZSB1c2VkIHRvXG4gICAgLy8gY3JlYXRlIGEgcHJvcGVyIGBvcmlnaW5gLlxuICAgIC8vXG4gICAgaWYgKGluc3RydWN0aW9uWzRdKSB1cmxba2V5XSA9IHVybFtrZXldLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvL1xuICAvLyBBbHNvIHBhcnNlIHRoZSBzdXBwbGllZCBxdWVyeSBzdHJpbmcgaW4gdG8gYW4gb2JqZWN0LiBJZiB3ZSdyZSBzdXBwbGllZFxuICAvLyB3aXRoIGEgY3VzdG9tIHBhcnNlciBhcyBmdW5jdGlvbiB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IGJ1aWxkLWluXG4gIC8vIHBhcnNlci5cbiAgLy9cbiAgaWYgKHBhcnNlcikgdXJsLnF1ZXJ5ID0gcGFyc2VyKHVybC5xdWVyeSk7XG5cbiAgLy9cbiAgLy8gSWYgdGhlIFVSTCBpcyByZWxhdGl2ZSwgcmVzb2x2ZSB0aGUgcGF0aG5hbWUgYWdhaW5zdCB0aGUgYmFzZSBVUkwuXG4gIC8vXG4gIGlmIChcbiAgICAgIHJlbGF0aXZlXG4gICAgJiYgbG9jYXRpb24uc2xhc2hlc1xuICAgICYmIHVybC5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJ1xuICAgICYmICh1cmwucGF0aG5hbWUgIT09ICcnIHx8IGxvY2F0aW9uLnBhdGhuYW1lICE9PSAnJylcbiAgKSB7XG4gICAgdXJsLnBhdGhuYW1lID0gcmVzb2x2ZSh1cmwucGF0aG5hbWUsIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgfVxuXG4gIC8vXG4gIC8vIERlZmF1bHQgdG8gYSAvIGZvciBwYXRobmFtZSBpZiBub25lIGV4aXN0cy4gVGhpcyBub3JtYWxpemVzIHRoZSBVUkxcbiAgLy8gdG8gYWx3YXlzIGhhdmUgYSAvXG4gIC8vXG4gIGlmICh1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwucGF0aG5hbWUgPSAnLycgKyB1cmwucGF0aG5hbWU7XG4gIH1cblxuICAvL1xuICAvLyBXZSBzaG91bGQgbm90IGFkZCBwb3J0IG51bWJlcnMgaWYgdGhleSBhcmUgYWxyZWFkeSB0aGUgZGVmYXVsdCBwb3J0IG51bWJlclxuICAvLyBmb3IgYSBnaXZlbiBwcm90b2NvbC4gQXMgdGhlIGhvc3QgYWxzbyBjb250YWlucyB0aGUgcG9ydCBudW1iZXIgd2UncmUgZ29pbmdcbiAgLy8gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgaG9zdG5hbWUgd2hpY2ggY29udGFpbnMgbm8gcG9ydCBudW1iZXIuXG4gIC8vXG4gIGlmICghcmVxdWlyZWQodXJsLnBvcnQsIHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICB1cmwucG9ydCA9ICcnO1xuICB9XG5cbiAgLy9cbiAgLy8gUGFyc2UgZG93biB0aGUgYGF1dGhgIGZvciB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkLlxuICAvL1xuICB1cmwudXNlcm5hbWUgPSB1cmwucGFzc3dvcmQgPSAnJztcblxuICBpZiAodXJsLmF1dGgpIHtcbiAgICBpbmRleCA9IHVybC5hdXRoLmluZGV4T2YoJzonKTtcblxuICAgIGlmICh+aW5kZXgpIHtcbiAgICAgIHVybC51c2VybmFtZSA9IHVybC5hdXRoLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgIHVybC51c2VybmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLnVzZXJuYW1lKSk7XG5cbiAgICAgIHVybC5wYXNzd29yZCA9IHVybC5hdXRoLnNsaWNlKGluZGV4ICsgMSk7XG4gICAgICB1cmwucGFzc3dvcmQgPSBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHVybC5wYXNzd29yZCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHVybC51c2VybmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLmF1dGgpKTtcbiAgICB9XG5cbiAgICB1cmwuYXV0aCA9IHVybC5wYXNzd29yZCA/IHVybC51c2VybmFtZSArJzonKyB1cmwucGFzc3dvcmQgOiB1cmwudXNlcm5hbWU7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICE9PSAnZmlsZTonICYmIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmIHVybC5ob3N0XG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgLy9cbiAgLy8gVGhlIGhyZWYgaXMganVzdCB0aGUgY29tcGlsZWQgcmVzdWx0LlxuICAvL1xuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjaGFuZ2luZyBwcm9wZXJ0aWVzIGluIHRoZSBVUkwgaW5zdGFuY2UgdG9cbiAqIGluc3VyZSB0aGF0IHRoZXkgYWxsIHByb3BhZ2F0ZSBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgICAgICAgICAgUHJvcGVydHkgd2UgbmVlZCB0byBhZGp1c3QuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAgICAgICAgICBUaGUgbmV3bHkgYXNzaWduZWQgdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IGZuICBXaGVuIHNldHRpbmcgdGhlIHF1ZXJ5LCBpdCB3aWxsIGJlIHRoZSBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZCB0byBwYXJzZSB0aGUgcXVlcnkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHNldHRpbmcgdGhlIHByb3RvY29sLCBkb3VibGUgc2xhc2ggd2lsbCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCBmcm9tIHRoZSBmaW5hbCB1cmwgaWYgaXQgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIHtVUkx9IFVSTCBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHNldChwYXJ0LCB2YWx1ZSwgZm4pIHtcbiAgdmFyIHVybCA9IHRoaXM7XG5cbiAgc3dpdGNoIChwYXJ0KSB7XG4gICAgY2FzZSAncXVlcnknOlxuICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHZhbHVlID0gKGZuIHx8IHFzLnBhcnNlKSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwb3J0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoIXJlcXVpcmVkKHZhbHVlLCB1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgICAgICB1cmxbcGFydF0gPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWUgKyc6JysgdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICh1cmwucG9ydCkgdmFsdWUgKz0gJzonKyB1cmwucG9ydDtcbiAgICAgIHVybC5ob3N0ID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3QnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmIChwb3J0LnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoJzonKTtcbiAgICAgICAgdXJsLnBvcnQgPSB2YWx1ZS5wb3AoKTtcbiAgICAgICAgdXJsLmhvc3RuYW1lID0gdmFsdWUuam9pbignOicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsLmhvc3RuYW1lID0gdmFsdWU7XG4gICAgICAgIHVybC5wb3J0ID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncHJvdG9jb2wnOlxuICAgICAgdXJsLnByb3RvY29sID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHVybC5zbGFzaGVzID0gIWZuO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwYXRobmFtZSc6XG4gICAgY2FzZSAnaGFzaCc6XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGNoYXIgPSBwYXJ0ID09PSAncGF0aG5hbWUnID8gJy8nIDogJyMnO1xuICAgICAgICB1cmxbcGFydF0gPSB2YWx1ZS5jaGFyQXQoMCkgIT09IGNoYXIgPyBjaGFyICsgdmFsdWUgOiB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd1c2VybmFtZSc6XG4gICAgY2FzZSAncGFzc3dvcmQnOlxuICAgICAgdXJsW3BhcnRdID0gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0aCc6XG4gICAgICB2YXIgaW5kZXggPSB2YWx1ZS5pbmRleE9mKCc6Jyk7XG5cbiAgICAgIGlmICh+aW5kZXgpIHtcbiAgICAgICAgdXJsLnVzZXJuYW1lID0gdmFsdWUuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB1cmwudXNlcm5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHVybC51c2VybmFtZSkpO1xuXG4gICAgICAgIHVybC5wYXNzd29yZCA9IHZhbHVlLnNsaWNlKGluZGV4ICsgMSk7XG4gICAgICAgIHVybC5wYXNzd29yZCA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLnBhc3N3b3JkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwudXNlcm5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlucyA9IHJ1bGVzW2ldO1xuXG4gICAgaWYgKGluc1s0XSkgdXJsW2luc1sxXV0gPSB1cmxbaW5zWzFdXS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdXJsLmF1dGggPSB1cmwucGFzc3dvcmQgPyB1cmwudXNlcm5hbWUgKyc6JysgdXJsLnBhc3N3b3JkIDogdXJsLnVzZXJuYW1lO1xuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgIT09ICdmaWxlOicgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiYgdXJsLmhvc3RcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xuXG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBwcm9wZXJ0aWVzIGJhY2sgaW4gdG8gYSB2YWxpZCBhbmQgZnVsbCBVUkwgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZ2lmeSBPcHRpb25hbCBxdWVyeSBzdHJpbmdpZnkgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBDb21waWxlZCB2ZXJzaW9uIG9mIHRoZSBVUkwuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHN0cmluZ2lmeSkge1xuICBpZiAoIXN0cmluZ2lmeSB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3RyaW5naWZ5KSBzdHJpbmdpZnkgPSBxcy5zdHJpbmdpZnk7XG5cbiAgdmFyIHF1ZXJ5XG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBob3N0ID0gdXJsLmhvc3RcbiAgICAsIHByb3RvY29sID0gdXJsLnByb3RvY29sO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5jaGFyQXQocHJvdG9jb2wubGVuZ3RoIC0gMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIHZhciByZXN1bHQgPVxuICAgIHByb3RvY29sICtcbiAgICAoKHVybC5wcm90b2NvbCAmJiB1cmwuc2xhc2hlcykgfHwgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyAnLy8nIDogJycpO1xuXG4gIGlmICh1cmwudXNlcm5hbWUpIHtcbiAgICByZXN1bHQgKz0gdXJsLnVzZXJuYW1lO1xuICAgIGlmICh1cmwucGFzc3dvcmQpIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9IGVsc2UgaWYgKHVybC5wYXNzd29yZCkge1xuICAgIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9IGVsc2UgaWYgKFxuICAgIHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6JyAmJlxuICAgIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmXG4gICAgIWhvc3QgJiZcbiAgICB1cmwucGF0aG5hbWUgIT09ICcvJ1xuICApIHtcbiAgICAvL1xuICAgIC8vIEFkZCBiYWNrIHRoZSBlbXB0eSB1c2VyaW5mbywgb3RoZXJ3aXNlIHRoZSBvcmlnaW5hbCBpbnZhbGlkIFVSTFxuICAgIC8vIG1pZ2h0IGJlIHRyYW5zZm9ybWVkIGludG8gYSB2YWxpZCBvbmUgd2l0aCBgdXJsLnBhdGhuYW1lYCBhcyBob3N0LlxuICAgIC8vXG4gICAgcmVzdWx0ICs9ICdAJztcbiAgfVxuXG4gIC8vXG4gIC8vIFRyYWlsaW5nIGNvbG9uIGlzIHJlbW92ZWQgZnJvbSBgdXJsLmhvc3RgIHdoZW4gaXQgaXMgcGFyc2VkLiBJZiBpdCBzdGlsbFxuICAvLyBlbmRzIHdpdGggYSBjb2xvbiwgdGhlbiBhZGQgYmFjayB0aGUgdHJhaWxpbmcgY29sb24gdGhhdCB3YXMgcmVtb3ZlZC4gVGhpc1xuICAvLyBwcmV2ZW50cyBhbiBpbnZhbGlkIFVSTCBmcm9tIGJlaW5nIHRyYW5zZm9ybWVkIGludG8gYSB2YWxpZCBvbmUuXG4gIC8vXG4gIGlmIChob3N0W2hvc3QubGVuZ3RoIC0gMV0gPT09ICc6JyB8fCAocG9ydC50ZXN0KHVybC5ob3N0bmFtZSkgJiYgIXVybC5wb3J0KSkge1xuICAgIGhvc3QgKz0gJzonO1xuICB9XG5cbiAgcmVzdWx0ICs9IGhvc3QgKyB1cmwucGF0aG5hbWU7XG5cbiAgcXVlcnkgPSAnb2JqZWN0JyA9PT0gdHlwZW9mIHVybC5xdWVyeSA/IHN0cmluZ2lmeSh1cmwucXVlcnkpIDogdXJsLnF1ZXJ5O1xuICBpZiAocXVlcnkpIHJlc3VsdCArPSAnPycgIT09IHF1ZXJ5LmNoYXJBdCgwKSA/ICc/JysgcXVlcnkgOiBxdWVyeTtcblxuICBpZiAodXJsLmhhc2gpIHJlc3VsdCArPSB1cmwuaGFzaDtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5VcmwucHJvdG90eXBlID0geyBzZXQ6IHNldCwgdG9TdHJpbmc6IHRvU3RyaW5nIH07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIFVSTCBwYXJzZXIgYW5kIHNvbWUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgYmUgdXNlZnVsIGZvclxuLy8gb3RoZXJzIG9yIHRlc3RpbmcuXG4vL1xuVXJsLmV4dHJhY3RQcm90b2NvbCA9IGV4dHJhY3RQcm90b2NvbDtcblVybC5sb2NhdGlvbiA9IGxvbGNhdGlvbjtcblVybC50cmltTGVmdCA9IHRyaW1MZWZ0O1xuVXJsLnFzID0gcXM7XG5cbm1vZHVsZS5leHBvcnRzID0gVXJsO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlxuLyoqXG4gKiBDaGVjayBpZiB0aGUgRE9NIGVsZW1lbnQgYGNoaWxkYCBpcyB3aXRoaW4gdGhlIGdpdmVuIGBwYXJlbnRgIERPTSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RE9NRWxlbWVudHxSYW5nZX0gY2hpbGQgLSB0aGUgRE9NIGVsZW1lbnQgb3IgUmFuZ2UgdG8gY2hlY2sgaWYgaXQncyB3aXRoaW4gYHBhcmVudGBcbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gcGFyZW50ICAtIHRoZSBwYXJlbnQgbm9kZSB0aGF0IGBjaGlsZGAgY291bGQgYmUgaW5zaWRlIG9mXG4gKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIGBjaGlsZGAgaXMgd2l0aGluIGBwYXJlbnRgLiBGYWxzZSBvdGhlcndpc2UuXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3aXRoaW4gKGNoaWxkLCBwYXJlbnQpIHtcbiAgLy8gZG9uJ3QgdGhyb3cgaWYgYGNoaWxkYCBpcyBudWxsXG4gIGlmICghY2hpbGQpIHJldHVybiBmYWxzZTtcblxuICAvLyBSYW5nZSBzdXBwb3J0XG4gIGlmIChjaGlsZC5jb21tb25BbmNlc3RvckNvbnRhaW5lcikgY2hpbGQgPSBjaGlsZC5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgZWxzZSBpZiAoY2hpbGQuZW5kQ29udGFpbmVyKSBjaGlsZCA9IGNoaWxkLmVuZENvbnRhaW5lcjtcblxuICAvLyB0cmF2ZXJzZSB1cCB0aGUgYHBhcmVudE5vZGVgIHByb3BlcnRpZXMgdW50aWwgYHBhcmVudGAgaXMgZm91bmRcbiAgdmFyIG5vZGUgPSBjaGlsZDtcbiAgd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpIHtcbiAgICBpZiAobm9kZSA9PSBwYXJlbnQpIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8qKlxuICog5q2k5pa55rOV55So5LqO5ZG86LW35pys5Zyw5a6i5oi356uv77yM5ZG86LW35aSx6LSl5pe277yM6Lez6L2s5Yiw5a6i5oi356uv5LiL6L295Zyw5Z2A5oiW6ICF5Lit6Ze06aG1XG4gKiAtIOmmluWFiOmcgOimgeWuouaIt+err+aPkOS+m+S4gOS4quWNj+iuruWcsOWdgCBwcm90b2NvbFxuICogLSDnhLblkI7pgJrov4fmtY/op4jlmajorr/pl67or6XlnLDlnYDmiJbogIUgaWZyYW1lIOiuv+mXruivpeWNj+iuruWcsOWdgOadpeinpuWPkeWuouaIt+err+eahOaJk+W8gOWKqOS9nFxuICogLSDlnKjorr7lrprlpb3nmoTotoXml7bml7bpl7QgKHdhaXRpbmcpIOWIsOi+vuaXtui/m+ihjOajgOafpVxuICogLSDnlLHkuo4gSU9TIOS4i++8jOi3s+i9rOWIsCBBUFDvvIzpobXpnaIgSlMg5Lya6KKr6Zi75q2i5omn6KGMXG4gKiAtIOaJgOS7peWmguaenOi2heaXtuaXtumXtOWkp+Wkp+i2hei/h+S6humihOacn+aXtumXtOiMg+WbtO+8jOWPr+aWreWumiBBUFAg5bey6KKr5omT5byA77yM5q2k5pe26Kem5Y+RIG9uVGltZW91dCDlm57osIPkuovku7blh73mlbBcbiAqIC0g5a+55LqOIElPU++8jOatpOaXtuWmguaenOS7jiBBUFAg6L+U5Zue6aG16Z2i77yM5bCx5Y+v5Lul6YCa6L+HIHdhaXRpbmdMaW1pdCDml7bpl7Tlt67mnaXliKTmlq3mmK/lkKbopoHmiafooYwgZmFsbGJhY2sg5Zue6LCD5LqL5Lu25Ye95pWwXG4gKiAtIEFuZHJvaWQg5LiL77yM6Lez6L2s5YiwIEFQUO+8jOmhtemdoiBKUyDkvJrnu6fnu63miafooYxcbiAqIC0g5q2k5pe25peg6K66IEFQUCDmmK/lkKblt7LmiZPlvIDvvIzpg73kvJrop6blj5Egb25GYWxsYmFjayDkuovku7bkuI4gZmFsbGJhY2sg5Zue6LCD5LqL5Lu25Ye95pWwXG4gKiAtIGZhbGxiYWNrIOm7mOiupOaTjeS9nOaYr+i3s+i9rOWIsCBmYWxsYmFja1VybCDlrqLmiLfnq6/kuIvovb3lnLDlnYDmiJbogIXkuK3pl7TpobXlnLDlnYBcbiAqIC0g6L+Z5qC35a+55LqO5rKh5pyJ5a6J6KOFIEFQUCDnmoTnp7vliqjnq6/vvIzpobXpnaLkvJrlnKjotoXml7bkuovku7blj5HnlJ/ml7bvvIznm7TmjqXot7PovazliLAgZmFsbGJhY2tVcmxcbiAqIEBtZXRob2QgYXBwL2NhbGxVcFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnByb3RvY29sIOWuouaIt+err0FQUOWRvOi1t+WNj+iuruWcsOWdgFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuZmFsbGJhY2tVcmwg5a6i5oi356uv5LiL6L295Zyw5Z2A5oiW6ICF5Lit6Ze06aG15Zyw5Z2AXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmFjdGlvbiDoh6rlrprkuYnlkbzotbflrqLmiLfnq6/nmoTmlrnlvI9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zdGFydFRpbWU9bmV3IERhdGUoKS5nZXRUaW1lKCldIOWRvOi1t+WuouaIt+err+eahOW8gOWni+aXtumXtChtcynvvIzku6Xml7bpl7TmlbDlgLzkvZzkuLrlj4LmlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53YWl0aW5nPTgwMF0g5ZG86LW36LaF5pe2562J5b6F5pe26Ze0KG1zKVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndhaXRpbmdMaW1pdD01MF0g6LaF5pe25ZCO5qOA5p+l5Zue6LCD5piv5ZCm5Zyo5q2k5pe26Ze06ZmQ5Yi25YaF6Kem5Y+RKG1zKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZmFsbGJhY2s9ZnVuY3Rpb24gKCkgeyB3aW5kb3cubG9jYXRpb24gPSBmYWxsYmFja1VybDsgfV0g6buY6K6k5Zue6YCA5pON5L2cXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkZhbGxiYWNrPW51bGxdIOWRvOi1t+aTjeS9nOacquiDveaIkOWKn+aJp+ihjOaXtuinpuWPkeeahOWbnuiwg+S6i+S7tuWHveaVsFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25UaW1lb3V0PW51bGxdIOWRvOi1t+i2heaXtuinpuWPkeeahOWbnuiwg+S6i+S7tuWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkY2FsbFVwID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcHAvY2FsbFVwJyk7XG4gKiAkY2FsbFVwKHtcbiAqICAgc3RhcnRUaW1lOiBEYXRlLm5vdygpLFxuICogICB3YWl0aW5nOiA4MDAsXG4gKiAgIHdhaXRpbmdMaW1pdDogNTAsXG4gKiAgIHByb3RvY29sIDogc2NoZW1lLFxuICogICBmYWxsYmFja1VybCA6IGRvd25sb2FkLFxuICogICBvbkZhbGxiYWNrIDogZnVuY3Rpb24gKCkge1xuICogICAgIC8vIHNob3VsZCBkb3dubG9hZFxuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkYnJvd3NlciA9IHJlcXVpcmUoJy4uL2Vudi9icm93c2VyJyk7XG5cbmZ1bmN0aW9uIGNhbGxVcChvcHRpb25zKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgcHJvdG9jb2w6ICcnLFxuICAgIGZhbGxiYWNrVXJsOiAnJyxcbiAgICBhY3Rpb246IG51bGwsXG4gICAgc3RhcnRUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICB3YWl0aW5nOiA4MDAsXG4gICAgd2FpdGluZ0xpbWl0OiA1MCxcbiAgICBmYWxsYmFjazogZnVuY3Rpb24gKGZhbGxiYWNrVXJsKSB7XG4gICAgICAvLyDlnKjkuIDlrprml7bpl7TlhoXml6Dms5XllKTotbflrqLmiLfnq6/vvIzot7PovazkuIvovb3lnLDlnYDmiJbliLDkuK3pl7TpobVcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGZhbGxiYWNrVXJsO1xuICAgIH0sXG4gICAgb25GYWxsYmFjazogbnVsbCxcbiAgICBvblRpbWVvdXQ6IG51bGwsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIHZhciB3SWQ7XG4gIHZhciBpZnJhbWU7XG5cbiAgaWYgKHR5cGVvZiBjb25mLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbmYuYWN0aW9uKCk7XG4gIH0gZWxzZSBpZiAoJGJyb3dzZXIoKS5jaHJvbWUpIHtcbiAgICAvLyBjaHJvbWXkuItpZnJhbWXml6Dms5XllKTotbdBbmRyb2lk5a6i5oi356uv77yM6L+Z6YeM5L2/55Sod2luZG93Lm9wZW5cbiAgICAvLyDlj6bkuIDkuKrmlrnmoYjlj4LogIMgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vY2hyb21lL21vYmlsZS9kb2NzL2ludGVudHNcbiAgICB2YXIgd2luID0gd2luZG93Lm9wZW4oY29uZi5wcm90b2NvbCk7XG4gICAgd0lkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiB3aW4gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwod0lkKTtcbiAgICAgICAgd2luLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICB9IGVsc2Uge1xuICAgIC8vIOWIm+W7umlmcmFtZVxuICAgIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGlmcmFtZS5zcmMgPSBjb25mLnByb3RvY29sO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgfVxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGlmICh3SWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwod0lkKTtcbiAgICB9XG5cbiAgICBpZiAoaWZyYW1lKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb25mLm9uVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uZi5vblRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICAvLyBpb3PkuIvvvIzot7PovazliLBBUFDvvIzpobXpnaJKU+S8muiiq+mYu+atouaJp+ihjOOAglxuICAgIC8vIOWboOatpOWmguaenOi2heaXtuaXtumXtOWkp+Wkp+i2hei/h+S6humihOacn+aXtumXtOiMg+WbtO+8jOWPr+aWreWumkFQUOW3suiiq+aJk+W8gOOAglxuICAgIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGNvbmYuc3RhcnRUaW1lIDwgY29uZi53YWl0aW5nICsgY29uZi53YWl0aW5nTGltaXQpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uZi5vbkZhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmYub25GYWxsYmFjaygpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBjb25mLmZhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmYuZmFsbGJhY2soY29uZi5mYWxsYmFja1VybCk7XG4gICAgICB9XG4gICAgfVxuICB9LCBjb25mLndhaXRpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbGxVcDtcbiIsIi8qKlxuICog5aSE55CG5LiO5a6i5oi356uv55u45YWz55qE5Lqk5LqSXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcHBcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2FwcFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmFwcC5jYWxsVXApO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2FwcFxuICogdmFyICRhcHAgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2FwcCcpO1xuICogY29uc29sZS5pbmZvKCRhcHAuY2FsbFVwKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkY2FsbFVwID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcHAvY2FsbFVwJyk7XG4gKi9cblxuZXhwb3J0cy5jYWxsVXAgPSByZXF1aXJlKCcuL2NhbGxVcCcpO1xuIiwiLyoqXG4gKiDnoa7orqTlr7nosaHmmK/lkKblnKjmlbDnu4TkuK1cbiAqIEBtZXRob2QgYXJyL2NvbnRhaW5zXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0geyp9IGl0ZW0g6KaB5pCc57Si55qE5a+56LGhXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5aaC5p6c5a+56LGh5Zyo5pWw57uE5Lit77yM6L+U5ZueIHRydWVcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnIvJGNvbnRhaW5zJyk7XG4gKiBjb25zb2xlLmluZm8oJGNvbnRhaW5zKFsxLDIsMyw0LDVdLCAzKSk7IC8vIHRydWVcbiAqL1xuXG5mdW5jdGlvbiBjb250YWlucyhhcnIsIGl0ZW0pIHtcbiAgdmFyIGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gIHJldHVybiBpbmRleCA+PSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zO1xuIiwiLyoqXG4gKiDliKDpmaTmlbDnu4TkuK3nmoTlr7nosaFcbiAqIEBtZXRob2QgYXJyL2VyYXNlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0geyp9IGl0ZW0g6KaB5riF6Zmk55qE5a+56LGhXG4gKiBAcmV0dXJucyB7TnVtYmVyfSDlr7nosaHljp/mnKzmiYDlnKjkvY3nva5cbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVyYXNlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnIvZXJhc2UnKTtcbiAqIGNvbnNvbGUuaW5mbygkZXJhc2UoWzEsMiwzLDQsNV0sMykpOyAvLyBbMSwyLDQsNV1cbiAqL1xuXG5mdW5jdGlvbiBlcmFzZShhcnIsIGl0ZW0pIHtcbiAgdmFyIGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVyYXNlO1xuIiwiLyoqXG4gKiDmn6Xmib7nrKblkIjmnaHku7bnmoTlhYPntKDlnKjmlbDnu4TkuK3nmoTkvY3nva5cbiAqIEBtZXRob2QgYXJyL2ZpbmRcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOadoeS7tuWHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSDlh73mlbDnmoR0aGlz5oyH5ZCRXG4gKiBAcmV0dXJuIHtBcnJheX0g56ym5ZCI5p2h5Lu255qE5YWD57Sg5Zyo5pWw57uE5Lit55qE5L2N572uXG4gKiBAZXhhbXBsZVxuICogdmFyICRmaW5kID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnIvZmluZCcpO1xuICogY29uc29sZS5pbmZvKCRmaW5kKFsxLDIsMyw0LDVdLCBmdW5jdGlvbiAoaXRlbSkge1xuICogICByZXR1cm4gaXRlbSA8IDM7XG4gKiB9KTsgLy8gWzAsIDFdXG4gKi9cblxuZnVuY3Rpb24gZmluZEluQXJyKGFyciwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IFtdO1xuICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBpdGVtLCBpbmRleCwgYXJyKSkge1xuICAgICAgcG9zaXRpb25zLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwb3NpdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEluQXJyO1xuIiwiLyoqXG4gKiDmlbDnu4TmiYHlubPljJZcbiAqIEBtZXRob2QgYXJyL2ZsYXR0ZW5cbiAqIEBwYXJhbSB7YXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEByZXR1cm5zIHthcnJheX0g57uP6L+H5omB5bmz5YyW5aSE55CG55qE5pWw57uEXG4gKiBAZXhhbXBsZVxuICogdmFyICRmbGF0dGVuID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnIvZmxhdHRlbicpO1xuICogY29uc29sZS5pbmZvKCRmbGF0dGVuKFsxLCBbMiwzXSwgWzQsNV1dKSk7IC8vIFsxLDIsMyw0LDVdXG4gKi9cblxudmFyICR0eXBlID0gcmVxdWlyZSgnLi4vb2JqL3R5cGUnKTtcblxuZnVuY3Rpb24gZmxhdHRlbihhcnIpIHtcbiAgdmFyIGFycmF5ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkgKz0gMSkge1xuICAgIHZhciB0eXBlID0gJHR5cGUoYXJyW2ldKTtcbiAgICBpZiAodHlwZSA9PT0gJ251bGwnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdmFyIGV4dHJhQXJyID0gdHlwZSA9PT0gJ2FycmF5JyA/IGZsYXR0ZW4oYXJyW2ldKSA6IGFycltpXTtcbiAgICBhcnJheSA9IGFycmF5LmNvbmNhdChleHRyYUFycik7XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW47XG4iLCIvKipcbiAqIOehruiupOWvueixoeaYr+WQpuWcqOaVsOe7hOS4re+8jOS4jeWtmOWcqOWImeWwhuWvueixoeaPkuWFpeWIsOaVsOe7hOS4rVxuICogQG1ldGhvZCBhcnIvaW5jbHVkZVxuICogQHBhcmFtIHtBcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHBhcmFtIHsqfSBpdGVtIOimgeaPkuWFpeeahOWvueixoVxuICogQHJldHVybnMge0FycmF5fSDnu4/ov4flpITnkIbnmoTmupDmlbDnu4RcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGluY2x1ZGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Fyci9pbmNsdWRlJyk7XG4gKiBjb25zb2xlLmluZm8oJGluY2x1ZGUoWzEsMiwzXSw0KSk7IC8vIFsxLDIsMyw0XVxuICogY29uc29sZS5pbmZvKCRpbmNsdWRlKFsxLDIsM10sMykpOyAvLyBbMSwyLDNdXG4gKi9cblxudmFyICRjb250YWlucyA9IHJlcXVpcmUoJy4vY29udGFpbnMnKTtcblxuZnVuY3Rpb24gaW5jbHVkZShhcnIsIGl0ZW0pIHtcbiAgaWYgKCEkY29udGFpbnMoYXJyLCBpdGVtKSkge1xuICAgIGFyci5wdXNoKGl0ZW0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5jbHVkZTtcbiIsIi8qKlxuICog57G75pWw57uE5a+56LGh55u45YWz5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2FyclxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmFyci5jb250YWlucyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvYXJyXG4gKiB2YXIgJGFyciA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvYXJyJyk7XG4gKiBjb25zb2xlLmluZm8oJGFyci5jb250YWlucyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMnKTtcbiAqL1xuXG5leHBvcnRzLmNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuZXhwb3J0cy5lcmFzZSA9IHJlcXVpcmUoJy4vZXJhc2UnKTtcbmV4cG9ydHMuZmluZCA9IHJlcXVpcmUoJy4vZmluZCcpO1xuZXhwb3J0cy5mbGF0dGVuID0gcmVxdWlyZSgnLi9mbGF0dGVuJyk7XG5leHBvcnRzLmluY2x1ZGUgPSByZXF1aXJlKCcuL2luY2x1ZGUnKTtcbiIsIi8qKlxuICog5o+Q5L6b5a+5IGNvb2tpZSDnmoTor7vlhpnog73liptcbiAqIC0g5YaZ5YWl5pe26Ieq5Yqo55SoIGVuY29kZVVSSUNvbXBvbmVudCDnvJbnoIFcbiAqIC0g6K+75Y+W5pe26Ieq5Yqo55SoIGRlY29kZVVSSUNvbXBvbmVudCDop6PnoIFcbiAqIEBtb2R1bGUgY29va2llL2Nvb2tpZVxuICogQHNlZSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9qcy1jb29raWVcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvb2tpZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvY29va2llL2Nvb2tpZScpO1xuICogJGNvb2tpZS5zZXQoJ25hbWUnLCAn5Lit5paHJywge1xuICogICBleHBpcmVzOiAxXG4gKiB9KTtcbiAqICRjb29raWUucmVhZCgnbmFtZScpIC8vICfkuK3mlocnXG4gKi9cblxudmFyIENvb2tpZSA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xuXG52YXIgaW5zdGFuY2UgPSBDb29raWU7XG5cbmlmIChDb29raWUud2l0aENvbnZlcnRlcikge1xuICBpbnN0YW5jZSA9IENvb2tpZS53aXRoQ29udmVydGVyKHtcbiAgICByZWFkOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuICAgIH0sXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc3RhbmNlO1xuIiwiLyoqXG4gKiDmnKzlnLDlrZjlgqjnm7jlhbPlt6Xlhbflh73mlbBcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Nvb2tpZVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvY29va2llXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuY29va2llLmNvb2tpZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9jb29raWVcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9jb29raWUnKTtcbiAqIGNvbnNvbGUuaW5mbygkY29va2llLmNvb2tpZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5bel5YW35a+56LGhXG4gKiB2YXIgJGNvb2tpZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvY29va2llL2Nvb2tpZScpO1xuICovXG5cbmV4cG9ydHMuY29va2llID0gcmVxdWlyZSgnLi9jb29raWUnKTtcbmV4cG9ydHMub3JpZ2luID0gcmVxdWlyZSgnLi9vcmlnaW4nKTtcbiIsIi8qKlxuICog5o+Q5L6b5a+5IGNvb2tpZSDnmoTor7vlhpnog73liptcbiAqIC0g5q2k5qih5Z2X55u05o6l5o+Q5L6bIGpzLWNvb2tpZSDnmoTljp/nlJ/og73lipvvvIzkuI3lgZrku7vkvZXoh6rliqjnvJbop6PnoIFcbiAqIEBtb2R1bGUgY29va2llL29yaWdpblxuICogQHNlZSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9qcy1jb29raWVcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvb2tpZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvY29va2llL29yaWdpbicpO1xuICogJGNvb2tpZS5zZXQoJ25hbWUnLCAndmFsdWUnLCB7XG4gKiAgIGV4cGlyZXM6IDFcbiAqIH0pO1xuICogJGNvb2tpZS5yZWFkKCduYW1lJykgLy8gJ3ZhbHVlJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xuIiwiLyoqXG4gKiDml6XmnJ/lr7nosaHmoLzlvI/ljJbovpPlh7pcbiAqXG4gKiDmoLzlvI/ljJbml6XmnJ/lr7nosaHmqKHmnb/plK7lgLzor7TmmI5cbiAqIC0geWVhciDlubTku73ljp/lp4vmlbDlgLxcbiAqIC0gbW9udGgg5pyI5Lu95Y6f5aeL5pWw5YC8WzEsIDEyXVxuICogLSBkYXRlIOaXpeacn+WOn+Wni+aVsOWAvFsxLCAzMV1cbiAqIC0gZGF5IOaYn+acn+WOn+Wni+aVsOWAvFswLCA2XVxuICogLSBob3VycyDlsI/ml7bljp/lp4vmlbDlgLxbMCwgMjNdXG4gKiAtIG1pbml1dGVzIOWIhumSn+WOn+Wni+aVsOWAvFswLCA1OV1cbiAqIC0gc2Vjb25kcyDnp5Lljp/lp4vmlbDlgLxbMCwgNTldXG4gKiAtIG1pbGxpU2Vjb25kcyDmr6vnp5Lljp/lp4vmlbDlgLxbMCwgOTk5XVxuICogLSBZWVlZIOW5tOS7veaVsOWAvO+8jOeyvuehruWIsDTkvY0oMTIgPT4gJzAwMTInKVxuICogLSBZWSDlubTku73mlbDlgLzvvIznsr7noa7liLAy5L2NKDIwMTggPT4gJzE4JylcbiAqIC0gWSDlubTku73ljp/lp4vmlbDlgLxcbiAqIC0gTU0g5pyI5Lu95pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIE0g5pyI5Lu95Y6f5aeL5pWw5YC8XG4gKiAtIEREIOaXpeacn+aVsOWAvO+8jOeyvuehruWIsDLkvY0oMyA9PiAnMDMnKVxuICogLSBEIOaXpeacn+WOn+Wni+aVsOWAvFxuICogLSBkIOaYn+acn+aVsOWAvO+8jOmAmui/hyB3ZWVrZGF5IOWPguaVsOaYoOWwhOWPluW+lygwID0+ICfml6UnKVxuICogLSBoaCDlsI/ml7bmlbDlgLzvvIznsr7noa7liLAy5L2NKDkgPT4gJzA5JylcbiAqIC0gaCDlsI/ml7bljp/lp4vmlbDlgLxcbiAqIC0gbW0g5YiG6ZKf5pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIG0g5YiG6ZKf5Y6f5aeL5pWw5YC8XG4gKiAtIHNzIOenkuaVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBzIOenkuWOn+Wni+aVsOWAvFxuICogLSBtc3Mg5q+r56eS5pWw5YC877yM57K+56Gu5YiwM+S9jSg5ID0+ICcwMDknKVxuICogLSBtcyDmr6vnp5Lljp/lp4vmlbDlgLxcbiAqIEBtZXRob2QgZGF0ZS9mb3JtYXRcbiAqIEBwYXJhbSB7RGF0ZX0gZG9iaiDml6XmnJ/lr7nosaHvvIzmiJbogIXlj6/ku6XooqvovazmjaLkuLrml6XmnJ/lr7nosaHnmoTmlbDmja5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3BlY10g5qC85byP5YyW6YCJ6aG5XG4gKiBAcGFyYW0ge0FycmF5fSBbc3BlYy53ZWVrZGF5PSfml6XkuIDkuozkuInlm5vkupTlha0nLnNwbGl0KCcnKV0g5LiA5ZGo5YaF5ZCE5aSp5a+55bqU5ZCN56ew77yM6aG65bqP5LuO5ZGo5pel566X6LW3XG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMudGVtcGxhdGU9J3t7WVlZWX19LXt7TU19fS17e0REfX0ge3toaH19Ont7bW19fSddIOagvOW8j+WMluaooeadv1xuICogQHJldHVybiB7U3RyaW5nfSDmoLzlvI/ljJblrozmiJDnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZvcm1hdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZGF0ZS9mb3JtYXQnKTtcbiAqIGNvbnNvbGUuaW5mbyhcbiAqICAgJGZvcm1hdChuZXcgRGF0ZSgpLHtcbiAqICAgICB0ZW1wbGF0ZSA6ICd7e1lZWVl9feW5tHt7TU19feaciHt7RER9feaXpSDlkah7e2R9fSB7e2hofX3ml7Z7e21tfX3liIZ7e3NzfX3np5InXG4gKiAgIH0pXG4gKiApO1xuICogLy8gMjAxNeW5tDA55pyIMDnml6Ug5ZGo5LiJIDE05pe2MTnliIY0MuenklxuICovXG5cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICRzdWJzdGl0dXRlID0gcmVxdWlyZSgnLi4vc3RyL3N1YnN0aXR1dGUnKTtcbnZhciAkZml4VG8gPSByZXF1aXJlKCcuLi9udW0vZml4VG8nKTtcbnZhciAkZ2V0VVRDRGF0ZSA9IHJlcXVpcmUoJy4vZ2V0VVRDRGF0ZScpO1xuXG52YXIgckxpbWl0ID0gZnVuY3Rpb24gKG51bSwgdykge1xuICB2YXIgc3RyID0gJGZpeFRvKG51bSwgdyk7XG4gIHZhciBkZWx0YSA9IHN0ci5sZW5ndGggLSB3O1xuICByZXR1cm4gZGVsdGEgPiAwID8gc3RyLnN1YnN0cihkZWx0YSkgOiBzdHI7XG59O1xuXG5mdW5jdGlvbiBmb3JtYXQoZG9iaiwgc3BlYykge1xuICB2YXIgb3V0cHV0ID0gJyc7XG4gIHZhciBkYXRhID0ge307XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgd2Vla2RheTogJ+aXpeS4gOS6jOS4ieWbm+S6lOWFrScuc3BsaXQoJycpLFxuICAgIHRlbXBsYXRlOiAne3tZWVlZfX0te3tNTX19LXt7RER9fSB7e2hofX06e3ttbX19JyxcbiAgfSwgc3BlYyk7XG5cbiAgLy8g6Kej5Yaz5LiN5ZCM5pyN5Yqh5Zmo5pe25Yy65LiN5LiA6Ie05Y+v6IO95Lya5a+86Ie05pel5pyf5Yid5aeL5YyW5pe26Ze05LiN5LiA6Ie055qE6Zeu6aKYXG4gIC8vIOS8oOWFpeaVsOWtl+S7peWMl+S6rOaXtuWMuuaXtumXtOS4uuWHhlxuICB2YXIgdXRjRGF0ZSA9ICRnZXRVVENEYXRlKGRvYmopO1xuICBkYXRhLnllYXIgPSB1dGNEYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIGRhdGEubW9udGggPSB1dGNEYXRlLmdldFVUQ01vbnRoKCkgKyAxO1xuICBkYXRhLmRhdGUgPSB1dGNEYXRlLmdldFVUQ0RhdGUoKTtcbiAgZGF0YS5kYXkgPSB1dGNEYXRlLmdldFVUQ0RheSgpO1xuICBkYXRhLmhvdXJzID0gdXRjRGF0ZS5nZXRVVENIb3VycygpO1xuICBkYXRhLm1pbml1dGVzID0gdXRjRGF0ZS5nZXRVVENNaW51dGVzKCk7XG4gIGRhdGEuc2Vjb25kcyA9IHV0Y0RhdGUuZ2V0VVRDU2Vjb25kcygpO1xuICBkYXRhLm1pbGxpU2Vjb25kcyA9IHV0Y0RhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG5cbiAgZGF0YS5ZWVlZID0gckxpbWl0KGRhdGEueWVhciwgNCk7XG4gIGRhdGEuWVkgPSByTGltaXQoZGF0YS55ZWFyLCAyKTtcbiAgZGF0YS5ZID0gZGF0YS55ZWFyO1xuXG4gIGRhdGEuTU0gPSAkZml4VG8oZGF0YS5tb250aCwgMik7XG4gIGRhdGEuTSA9IGRhdGEubW9udGg7XG5cbiAgZGF0YS5ERCA9ICRmaXhUbyhkYXRhLmRhdGUsIDIpO1xuICBkYXRhLkQgPSBkYXRhLmRhdGU7XG5cbiAgZGF0YS5kID0gY29uZi53ZWVrZGF5W2RhdGEuZGF5XTtcblxuICBkYXRhLmhoID0gJGZpeFRvKGRhdGEuaG91cnMsIDIpO1xuICBkYXRhLmggPSBkYXRhLmhvdXJzO1xuXG4gIGRhdGEubW0gPSAkZml4VG8oZGF0YS5taW5pdXRlcywgMik7XG4gIGRhdGEubSA9IGRhdGEubWluaXV0ZXM7XG5cbiAgZGF0YS5zcyA9ICRmaXhUbyhkYXRhLnNlY29uZHMsIDIpO1xuICBkYXRhLnMgPSBkYXRhLnNlY29uZHM7XG5cbiAgZGF0YS5tc3MgPSAkZml4VG8oZGF0YS5taWxsaVNlY29uZHMsIDMpO1xuICBkYXRhLm1zID0gZGF0YS5taWxsaVNlY29uZHM7XG5cbiAgb3V0cHV0ID0gJHN1YnN0aXR1dGUoY29uZi50ZW1wbGF0ZSwgZGF0YSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0O1xuIiwiLyoqXG4gKiDojrflj5bov4fljrvkuIDmrrXml7bpl7TnmoTotbflp4vml6XmnJ/vvIzlpoIz5pyI5YmN56ysMeWkqe+8jDLlkajliY3nrKwx5aSp77yMM+Wwj+aXtuWJjeaVtOeCuVxuICogQG1ldGhvZCBkYXRlL2dldExhc3RTdGFydFxuICogQHBhcmFtIHtOdW1iZXJ8RGF0ZX0gdGltZSDlrp7pmYXml7bpl7RcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIOWNleS9jeaXtumXtOexu+Wei++8jOWPr+mAiSBbJ3llYXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAnaG91ciddXG4gKiBAcGFyYW0ge051bWJlcn0gY291bnQg5aSa5bCR5Y2V5L2N5pe26Ze05LmL5YmNXG4gKiBAcmV0dXJucyB7RGF0ZX0g5pyA6L+R5Y2V5L2N5pe26Ze055qE6LW35aeL5pe26Ze05a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRMYXN0U3RhcnQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGUvZ2V0TGFzdFN0YXJ0Jyk7XG4gKiB2YXIgdGltZSA9ICRnZXRMYXN0U3RhcnQoXG4gKiAgIG5ldyBEYXRlKCcyMDE4LTEwLTI1JyksXG4gKiAgICdtb250aCcsXG4gKiAgIDBcbiAqICkuZ2V0VGltZSgpOyAvLyAxNTM4MzIzMjAwMDAwXG4gKiBuZXcgRGF0ZSh0aW1lKTsgLy8gTW9uIE9jdCAwMSAyMDE4IDAwOjAwOjAwIEdNVCswODAwICjkuK3lm73moIflh4bml7bpl7QpXG4gKi9cblxudmFyICRnZXRUaW1lU3BsaXQgPSByZXF1aXJlKCcuL2dldFRpbWVTcGxpdCcpO1xudmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnLi9nZXRVVENEYXRlJyk7XG5cbnZhciBIT1VSID0gNjAgKiA2MCAqIDEwMDA7XG52YXIgREFZID0gMjQgKiA2MCAqIDYwICogMTAwMDtcblxuZnVuY3Rpb24gZ2V0TGFzdFN0YXJ0KHRpbWUsIHR5cGUsIGNvdW50KSB7XG4gIHZhciBsb2NhbFRpbWUgPSBuZXcgRGF0ZSh0aW1lKTtcbiAgdmFyIHV0Y1RpbWUgPSAkZ2V0VVRDRGF0ZSh0aW1lKTtcbiAgdmFyIHN0YW1wID0gdXRjVGltZTtcbiAgdmFyIHllYXI7XG4gIHZhciBtb250aDtcbiAgdmFyIGFsbE1vbnRocztcbiAgdmFyIHVuaXQ7XG4gIGlmICghdHlwZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVxdWlyZWQgcGFyYW0gdHlwZScpO1xuICB9XG4gIGNvdW50ID0gY291bnQgfHwgMDtcbiAgaWYgKHR5cGUgPT09ICd5ZWFyJykge1xuICAgIHllYXIgPSB1dGNUaW1lLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgeWVhciAtPSBjb3VudDtcbiAgICBzdGFtcCA9IG5ldyBEYXRlKHllYXIgKyAnLzEvMScpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdtb250aCcpIHtcbiAgICB5ZWFyID0gdXRjVGltZS5nZXRVVENGdWxsWWVhcigpO1xuICAgIG1vbnRoID0gdXRjVGltZS5nZXRVVENNb250aCgpO1xuICAgIGFsbE1vbnRocyA9IHllYXIgKiAxMiArIG1vbnRoIC0gY291bnQ7XG4gICAgeWVhciA9IE1hdGguZmxvb3IoYWxsTW9udGhzIC8gMTIpO1xuICAgIG1vbnRoID0gYWxsTW9udGhzIC0geWVhciAqIDEyO1xuICAgIG1vbnRoICs9IDE7XG4gICAgc3RhbXAgPSBuZXcgRGF0ZShbeWVhciwgbW9udGgsIDFdLmpvaW4oJy8nKSk7XG4gIH0gZWxzZSB7XG4gICAgdW5pdCA9IEhPVVI7XG4gICAgaWYgKHR5cGUgPT09ICdkYXknKSB7XG4gICAgICB1bml0ID0gREFZO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ3dlZWsnKSB7XG4gICAgICB1bml0ID0gNyAqIERBWTtcbiAgICB9XG4gICAgdmFyIG5ld0xvY2FsVGltZSA9IGxvY2FsVGltZSAtIGNvdW50ICogdW5pdDtcbiAgICBzdGFtcCA9ICRnZXRUaW1lU3BsaXQobmV3TG9jYWxUaW1lLCB0eXBlKTtcbiAgfVxuXG4gIHJldHVybiBzdGFtcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMYXN0U3RhcnQ7XG4iLCIvKipcbiAqIOiOt+WPluafkOS4quaXtumXtOeahCDmlbTlubR85pW05pyIfOaVtOaXpXzmlbTml7Z85pW05YiGIOaXtumXtOWvueixoVxuICogQG1ldGhvZCBkYXRlL2dldFRpbWVTcGxpdFxuICogQHBhcmFtIHtOdW1iZXJ8RGF0ZX0gdGltZSDlrp7pmYXml7bpl7RcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIOWNleS9jeaXtumXtOexu+Wei++8jOWPr+mAiSBbJ3llYXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAnaG91ciddXG4gKiBAcmV0dXJucyB7RGF0ZX0g5pe26Ze05pW054K55a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRUaW1lU3BsaXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGUvZ2V0VGltZVNwbGl0Jyk7XG4gKiBuZXcgRGF0ZShcbiAqICAgJGdldFRpbWVTcGxpdChcbiAqICAgICAnMjAxOC0wOS0yMCcsXG4gKiAgICAgJ21vbnRoJ1xuICogICApXG4gKiApLnRvR01UU3RyaW5nKCk7XG4gKiAvLyBTYXQgU2VwIDAxIDIwMTggMDA6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqXG4gKiBuZXcgRGF0ZShcbiAqICAgJGdldFRpbWVTcGxpdChcbiAqICAgICAnMjAxOC0wOS0yMCAxOToyMzozNicsXG4gKiAgICAgJ2hvdXInXG4gKiAgIClcbiAqICkudG9HTVRTdHJpbmcoKTtcbiAqIC8vIFRodSBTZXAgMjAgMjAxOCAxOTowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICovXG52YXIgJGdldFVUQ0RhdGUgPSByZXF1aXJlKCcuL2dldFVUQ0RhdGUnKTtcblxudmFyIERBWSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbnZhciBUSU1FX1VOSVRTID0gW1xuICAnaG91cicsXG4gICdkYXknLFxuICAnd2VlaycsXG4gICdtb250aCcsXG4gICd5ZWFyJyxcbl07XG5cbmZ1bmN0aW9uIGdldFRpbWVTcGxpdCh0aW1lLCB0eXBlKSB7XG4gIGlmICghdHlwZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVxdWlyZWQgcGFyYW0gdHlwZScpO1xuICB9XG5cbiAgdmFyIGxvY2FsVGltZSA9IG5ldyBEYXRlKHRpbWUpO1xuICB2YXIgdXRjVGltZSA9ICRnZXRVVENEYXRlKHRpbWUpO1xuXG4gIC8vIOS7peWRqOS4gOS4uui1t+Wni+aXtumXtFxuICB2YXIgZGF5ID0gdXRjVGltZS5nZXREYXkoKTtcbiAgZGF5ID0gZGF5ID09PSAwID8gNiA6IGRheSAtIDE7XG5cbiAgdmFyIGluZGV4ID0gVElNRV9VTklUUy5pbmRleE9mKHR5cGUpO1xuICBpZiAoaW5kZXggPT09IDIpIHtcbiAgICB1dGNUaW1lID0gbmV3IERhdGUobG9jYWxUaW1lIC0gZGF5ICogREFZKTtcbiAgfVxuICB2YXIgeWVhciA9IHV0Y1RpbWUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgdmFyIG1vbnRoID0gdXRjVGltZS5nZXRVVENNb250aCgpICsgMTtcbiAgdmFyIGRhdGUgPSB1dGNUaW1lLmdldFVUQ0RhdGUoKTtcbiAgdmFyIGhvdXIgPSB1dGNUaW1lLmdldFVUQ0hvdXJzKCk7XG4gIHZhciBtaW51dGVzID0gdXRjVGltZS5nZXRVVENNaW51dGVzKCk7XG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBtaW51dGVzID0gJzAwJztcbiAgfVxuICBpZiAoaW5kZXggPj0gMSkge1xuICAgIGhvdXIgPSAnMDAnO1xuICB9XG4gIGlmIChpbmRleCA+PSAzKSB7XG4gICAgZGF0ZSA9IDE7XG4gIH1cbiAgaWYgKGluZGV4ID49IDQpIHtcbiAgICBtb250aCA9IDE7XG4gIH1cblxuICB2YXIgc3RyID0gW1xuICAgIFt5ZWFyLCBtb250aCwgZGF0ZV0uam9pbignLycpLFxuICAgIFtob3VyLCBtaW51dGVzXS5qb2luKCc6JyksXG4gIF0uam9pbignICcpO1xuXG4gIHJldHVybiBuZXcgRGF0ZShzdHIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRpbWVTcGxpdDtcbiIsIi8qKlxuICog6I635Y+W5LiA5Liq5pe26Ze05a+56LGh77yM5YW25bm05pyI5ZGo5pel5pe25YiG56eS562JIFVUQyDlgLzkuI7ljJfkuqzml7bpl7Tkv53mjIHkuIDoh7TjgIJcbiAqIOino+WGs+S4jeWQjOacjeWKoeWZqOaXtuWMuuS4jeS4gOiHtOWcuuaZr+S4i++8jOWPr+iDveS8muWvvOiHtOaXpeacn+iuoeeul+S4jeS4gOiHtOeahOmXrumimC5cbiAqIEBtZXRob2QgZGF0ZS9nZXRVVENEYXRlXG4gKiBAcGFyYW0ge051bWJlcnxEYXRlfSB0aW1lIOWunumZheaXtumXtFxuICogQHJldHVybnMge0RhdGV9IFVUQ+aXtumXtFxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0VVRDRGF0ZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZGF0ZS9nZXRVVENEYXRlJyk7XG4gKiB2YXIgY25UaW1lID0gMTU0MDkxNTIwMDAwMDsgLy8gKFdlZCBPY3QgMzEgMjAxOCAwMDowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KSlcbiAqIHZhciB1dGNEYXRlID0gJGdldFVUQ0RhdGUoY25UaW1lKS5nZXRUaW1lKCk7XG4gKiAvLyAxNTQwODg2NDAwMDAwIFR1ZSBPY3QgMzAgMjAxOCAxNjowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICogdXRjRGF0ZS5nZXRVVENkYXRlKCk7IC8vIDMxXG4gKiB1dGNEYXRlLmdldEhvdXJzKCk7IC8vIDhcbiAqIHV0Y0RhdGUuZ2V0VVRDSG91cnMoKTsgLy8gMFxuICovXG5mdW5jdGlvbiBnZXRVVENEYXRlKHRpbWUpIHtcbiAgdmFyIHV0Y0RhdGUgPSBuZXcgRGF0ZShuZXcgRGF0ZSh0aW1lKS5nZXRUaW1lKCkgKyAyODgwMDAwMCk7XG4gIHJldHVybiB1dGNEYXRlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFVUQ0RhdGU7XG4iLCIvKipcbiAqIOaXpeacn+ebuOWFs+W3peWFt1xuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvZGF0ZVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZGF0ZVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmRhdGUuZm9ybWF0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kYXRlXG4gKiB2YXIgJGRhdGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGUnKTtcbiAqIGNvbnNvbGUuaW5mbygkZGF0ZS5mb3JtYXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRmb3JtYXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0Jyk7XG4gKi9cblxuZXhwb3J0cy5mb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xuZXhwb3J0cy5nZXRMYXN0U3RhcnQgPSByZXF1aXJlKCcuL2dldExhc3RTdGFydCcpO1xuZXhwb3J0cy5nZXRUaW1lU3BsaXQgPSByZXF1aXJlKCcuL2dldFRpbWVTcGxpdCcpO1xuIiwiLyoqXG4gKiBET00g5pON5L2c55u45YWz5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb21cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2RvbVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmRvbS5pc05vZGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RvbVxuICogdmFyICRkb20gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RvbScpO1xuICogY29uc29sZS5pbmZvKCRkb20uaXNOb2RlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkaXNOb2RlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb20vaXNOb2RlJyk7XG4gKi9cblxuZXhwb3J0cy5pc05vZGUgPSByZXF1aXJlKCcuL2lzTm9kZScpO1xuZXhwb3J0cy5vZmZzZXQgPSByZXF1aXJlKCcuL29mZnNldCcpO1xuZXhwb3J0cy5zY3JvbGxMaW1pdCA9IHJlcXVpcmUoJy4vc2Nyb2xsTGltaXQnKTtcbiIsIi8qKlxuICog5Yik5pat5a+56LGh5piv5ZCm5Li6ZG9t5YWD57SgXG4gKiBAbWV0aG9kIGRvbS9pc05vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIOimgeWIpOaWreeahOWvueixoVxuICogQHJldHVybiB7Qm9vbGVhbn0g5piv5ZCm5Li6ZG9t5YWD57SgXG4gKiBAZXhhbXBsZVxuICogdmFyICRpc05vZGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RvbS9pc05vZGUnKTtcbiAqICRpc05vZGUoZG9jdW1lbnQuYm9keSkgLy8gMVxuICovXG5mdW5jdGlvbiBpc05vZGUobm9kZSkge1xuICByZXR1cm4gKFxuICAgIG5vZGVcbiAgICAmJiBub2RlLm5vZGVOYW1lXG4gICAgJiYgbm9kZS5ub2RlVHlwZVxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTm9kZTtcbiIsIi8qKlxuICog6I635Y+WIERPTSDlhYPntKDnm7jlr7nkuo4gZG9jdW1lbnQg55qE6L656LedXG4gKiBAbWV0aG9kIGRvbS9vZmZzZXRcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3RpbW94bGV5L29mZnNldFxuICogQHBhcmFtIHtPYmplY3R9IG5vZGUg6KaB6K6h566XIG9mZnNldCDnmoQgZG9tIOWvueixoVxuICogQHJldHVybiB7T2JqZWN0fSBvZmZzZXQg5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRvZmZzZXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RvbS9vZmZzZXQnKTtcbiAqIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFyZ2V0Jyk7XG4gKiBjb25zb2xlLmxvZygkb2Zmc2V0KHRhcmdldCkpO1xuICogLy8ge3RvcDogNjksIGxlZnQ6IDEwOH1cbiAqL1xuXG52YXIgb2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge307XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gIG9mZnNldCA9IHJlcXVpcmUoJ2RvY3VtZW50LW9mZnNldCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9mZnNldDtcbiIsIi8qKlxuICog5pi+56S65rua5Yqo5Yy65Z+f5ruR5Yqo5rua5Yqo5LqL5Lu25LiN5YaN56m/6YCP5Yiw5bqV6YOoXG4gKiAtIGlvcyDpnIDopoHnu5nmu5rliqjljLrln5/mt7vliqDmoLflvI/lsZ7mgKc6IC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcbiAqIC0g5LuF5pSv5oyB5Y2V5pa55ZCR5ruR5Yqo56aB55SoXG4gKiBAbWV0aG9kIGRvbS9zY3JvbGxMaW1pdFxuICogQHBhcmFtIHtPYmplY3R9IGVsIOimgemZkOWItua7muWKqOepv+mAj+eahOa7muWKqOWMuuWfn+WFg+e0oFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6ZmQ5Yi25rua5Yqo56m/6YCP55qE6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZGlyZWN0aW9uPSd5J10g6ZmQ5Yi25rua5Yqo55qE5pa55ZCR77yM5Y+W5YC8OiBbJ3gnLCAneSddXG4gKiBAcmV0dXJuIHtCb29sZWFufSDmmK/lkKbkuLpkb23lhYPntKBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNjcm9sbExpbWl0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb20vc2Nyb2xsTGltaXQnKTtcbiAqIHZhciBzY3JvbGxlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JvbGxlcicpO1xuICogdmFyIGxpbWl0ZXIgPSAkc2Nyb2xsTGltaXQoc2Nyb2xsZXIsIHsgZGlyZWN0aW9uOiAneScgfSk7XG4gKiAvLyDliJ3lp4vljJbml7ZcbiAqIGxpbWl0ZXIuYXR0YWNoKCk7XG4gKiAvLyDljbjovb3nu4Tku7bml7ZcbiAqIGxpbWl0ZXIuZGV0YWNoKCk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG5mdW5jdGlvbiBzY3JvbGxMaW1pdChlbCwgb3B0aW9ucykge1xuICB2YXIgaW5zdCA9IHt9O1xuXG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgZGlyZWN0aW9uOiAneScsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIHZhciBzY3JvbGxUb3AgPSAwO1xuICB2YXIgc2Nyb2xsTGVmdCA9IDA7XG4gIHZhciBjbGllbnRIZWlnaHQgPSAwO1xuICB2YXIgY2xpZW50V2lkdGggPSAwO1xuICB2YXIgc2Nyb2xsSGVpZ2h0ID0gMDtcbiAgdmFyIHNjcm9sbFdpZHRoID0gMDtcbiAgdmFyIHRvVG9wID0gZmFsc2U7XG4gIHZhciB0b0JvdHRvbSA9IGZhbHNlO1xuICB2YXIgdG9MZWZ0ID0gZmFsc2U7XG4gIHZhciB0b1JpZ2h0ID0gZmFsc2U7XG4gIHZhciBtb3ZlU3RhcnRYID0gMDtcbiAgdmFyIG1vdmVTdGFydFkgPSAwO1xuXG4gIHZhciB1cGRhdGVTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY3JvbGxUb3AgPSBlbC5zY3JvbGxUb3A7XG4gICAgc2Nyb2xsTGVmdCA9IGVsLnNjcm9sbExlZnQ7XG4gICAgY2xpZW50SGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICAgIHNjcm9sbEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodDtcbiAgICBzY3JvbGxXaWR0aCA9IGVsLnNjcm9sbFdpZHRoO1xuXG4gICAgdG9Ub3AgPSBzY3JvbGxUb3AgPD0gMDtcbiAgICB0b0JvdHRvbSA9IHNjcm9sbFRvcCArIGNsaWVudEhlaWdodCA+PSBzY3JvbGxIZWlnaHQ7XG4gICAgdG9MZWZ0ID0gc2Nyb2xsTGVmdCA8PSAwO1xuICAgIHRvUmlnaHQgPSBzY3JvbGxMZWZ0ICsgY2xpZW50V2lkdGggPj0gc2Nyb2xsV2lkdGg7XG4gIH07XG5cbiAgdmFyIGdldEV2ZW50ID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0ZXYgPSBldnQ7XG4gICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCkge1xuICAgICAgdGV2ID0gZXZ0LnRvdWNoZXNbMF07XG4gICAgfVxuICAgIHJldHVybiB0ZXY7XG4gIH07XG5cbiAgaW5zdC5jaGVja1Njcm9sbCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdXBkYXRlU3RhdGUoKTtcbiAgfTtcblxuICBpbnN0LmNoZWNrU3RhcnQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHRldiA9IGdldEV2ZW50KGV2dCk7XG4gICAgbW92ZVN0YXJ0WCA9IHRldi5jbGllbnRYO1xuICAgIG1vdmVTdGFydFkgPSB0ZXYuY2xpZW50WTtcbiAgfTtcblxuICBpbnN0LmNoZWNrTW92ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB1cGRhdGVTdGF0ZSgpO1xuICAgIHZhciB0ZXYgPSBnZXRFdmVudChldnQpO1xuICAgIGlmIChjb25mLmRpcmVjdGlvbiA9PT0gJ3gnKSB7XG4gICAgICBpZiAodG9MZWZ0ICYmICh0ZXYuY2xpZW50WCA+IG1vdmVTdGFydFgpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRvUmlnaHQgJiYgKHRldi5jbGllbnRYIDwgbW92ZVN0YXJ0WCkpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0b1RvcCAmJiAodGV2LmNsaWVudFkgPiBtb3ZlU3RhcnRZKSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0b0JvdHRvbSAmJiAodGV2LmNsaWVudFkgPCBtb3ZlU3RhcnRZKSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIHNldEV2ZW50cyA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIHByZWZpeCA9IHR5cGUgPT09ICdvbicgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgIHZhciBtZXRob2QgPSBwcmVmaXggKyAnRXZlbnRMaXN0ZW5lcic7XG4gICAgaWYgKHR5cGVvZiBlbFttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBlbFttZXRob2RdKCdzY3JvbGwnLCBpbnN0LmNoZWNrU2Nyb2xsKTtcbiAgICAgIGVsW21ldGhvZF0oJ3RvdWNobW92ZScsIGluc3QuY2hlY2tNb3ZlKTtcbiAgICAgIGVsW21ldGhvZF0oJ3RvdWNoc3RhcnQnLCBpbnN0LmNoZWNrU3RhcnQpO1xuICAgIH1cbiAgfTtcblxuICBpbnN0LmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB1cGRhdGVTdGF0ZSgpO1xuICAgIHNldEV2ZW50cygnb24nKTtcbiAgfTtcblxuICBpbnN0LmRldGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRFdmVudHMoJ29mZicpO1xuICB9O1xuXG4gIHJldHVybiBpbnN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNjcm9sbExpbWl0O1xuIiwiLyoqXG4gKiDmo4DmtYvmtY/op4jlmajnsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gcXFcbiAqIC0gdWNcbiAqIC0gYmFpZHVcbiAqIC0gbWl1aVxuICogLSB3ZWl4aW5cbiAqIC0gcXpvbmVcbiAqIC0gcXFuZXdzXG4gKiAtIHFxaG91c2VcbiAqIC0gcXFicm93c2VyXG4gKiAtIGNocm9tZVxuICogQG1ldGhvZCBlbnYvYnJvd3NlclxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogdmFyICRicm93c2VyID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvYnJvd3NlcicpO1xuICogY29uc29sZS5pbmZvKCRicm93c2VyKCkuY2hyb21lKTtcbiAqIGNvbnNvbGUuaW5mbygkYnJvd3Nlci5kZXRlY3QoKSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICR1YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5cbnZhciB0ZXN0ZXJzID0ge1xuICBxcTogKC9xcVxcLyhbXFxkLl0rKS9pKSxcbiAgdWM6ICgvdWNicm93c2VyL2kpLFxuICBiYWlkdTogKC9iYWlkdWJyb3dzZXIvaSksXG4gIG1pdWk6ICgvbWl1aWJyb3dzZXIvaSksXG4gIHdlaXhpbjogKC9taWNyb21lc3Nlbmdlci9pKSxcbiAgcXpvbmU6ICgvcXpvbmVcXC8vaSksXG4gIHFxbmV3czogKC9xcW5ld3NcXC8oW1xcZC5dKykvaSksXG4gIHFxaG91c2U6ICgvcXFob3VzZS9pKSxcbiAgcXFicm93c2VyOiAoL3FxYnJvd3Nlci9pKSxcbiAgY2hyb21lOiAoL2Nocm9tZS9pKSxcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHVhOiAnJyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgJGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cbiAgcmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gZW52QnJvd3NlcigpIHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXN1bHQgPSBkZXRlY3QoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5lbnZCcm93c2VyLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnZCcm93c2VyO1xuIiwiLyoqXG4gKiDmo4DmtYvmtY/op4jlmajmoLjlv4NcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gdHJpZGVudFxuICogLSBwcmVzdG9cbiAqIC0gd2Via2l0XG4gKiAtIGdlY2tvXG4gKiBAbWV0aG9kIGVudi9jb3JlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBVQSDmo4Dmn6Xnu5PmnpxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvcmUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi9jb3JlJyk7XG4gKiBjb25zb2xlLmluZm8oJGNvcmUoKS53ZWJraXQpO1xuICogY29uc29sZS5pbmZvKCRjb3JlLmRldGVjdCgpKTtcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcbiAgdHJpZGVudDogKC90cmlkZW50L2kpLFxuICBwcmVzdG86ICgvcHJlc3RvL2kpLFxuICB3ZWJraXQ6ICgvd2Via2l0L2kpLFxuICBnZWNrbzogZnVuY3Rpb24gKHVhKSB7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ2dlY2tvJykgPiAtMSAmJiB1YS5pbmRleE9mKCdraHRtbCcpID09PSAtMTtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHVhOiAnJyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgJGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cbiAgcmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gY29yZSgpIHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXN1bHQgPSBkZXRlY3QoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5jb3JlLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlO1xuIiwiLyoqXG4gKiDmo4DmtYvorr7lpIfnsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gaHVhd2VpXG4gKiAtIG9wcG9cbiAqIC0gdml2b1xuICogLSB4aWFvbWlcbiAqIC0gc2Ftc29uZ1xuICogLSBpcGhvbmVcbiAqIEBtZXRob2QgZW52L2RldmljZVxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogdmFyICRkZXZpY2UgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi9kZXZpY2UnKTtcbiAqIGNvbnNvbGUuaW5mbygkZGV2aWNlKCkuaHVhd2VpKTtcbiAqIGNvbnNvbGUuaW5mbygkZGV2aWNlLmRldGVjdCgpKTtcbiAqL1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcblxudmFyIHRlc3RlcnMgPSB7XG4gIGh1YXdlaTogKC9odWF3ZWkvaSksXG4gIG9wcG86ICgvb3Bwby9pKSxcbiAgdml2bzogKC92aXZvL2kpLFxuICB4aWFvbWk6ICgveGlhb21pL2kpLFxuICBzYW1zb25nOiAoL3NtLS9pKSxcbiAgaXBob25lOiAoL2lwaG9uZS9pKSxcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHVhOiAnJyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgJGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cbiAgcmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gZGV2aWNlKCkge1xuICBpZiAoIXJlc3VsdCkge1xuICAgIHJlc3VsdCA9IGRldGVjdCgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmRldmljZS5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gZGV2aWNlO1xuIiwiLyoqXG4gKiDnjq/looPmo4DmtYvkuI7liKTmlq3lt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2VudlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZW52XG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZW52LnRvdWNoYWJsZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvZW52XG4gKiB2YXIgJGVudiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZW52Jyk7XG4gKiBjb25zb2xlLmluZm8oJGVudi50b3VjaGFibGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICR0b3VjaGFibGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi90b3VjaGFibGUnKTtcbiAqL1xuXG5leHBvcnRzLmJyb3dzZXIgPSByZXF1aXJlKCcuL2Jyb3dzZXInKTtcbmV4cG9ydHMuY29yZSA9IHJlcXVpcmUoJy4vY29yZScpO1xuZXhwb3J0cy5kZXZpY2UgPSByZXF1aXJlKCcuL2RldmljZScpO1xuZXhwb3J0cy5uZXR3b3JrID0gcmVxdWlyZSgnLi9uZXR3b3JrJyk7XG5leHBvcnRzLm9zID0gcmVxdWlyZSgnLi9vcycpO1xuZXhwb3J0cy50b3VjaGFibGUgPSByZXF1aXJlKCcuL3RvdWNoYWJsZScpO1xuZXhwb3J0cy51YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5leHBvcnRzLndlYnAgPSByZXF1aXJlKCcuL3dlYnAnKTtcbiIsIi8qKlxuICog572R57uc546v5aKD5qOA5rWLXG4gKiBAbW9kdWxlIGVudi9uZXR3b3JrXG4gKi9cblxudmFyIHN1cHBvcnRPbmxpbmUgPSBudWxsO1xuXG4vKipcbiAqIOWIpOaWremhtemdouaYr+WQpuaUr+aMgeiBlOe9keajgOa1i1xuICogQG1ldGhvZCBlbnYvbmV0d29yay5zdXBwb3J0XG4gKiBAbWVtYmVyb2YgZW52L25ldHdvcmtcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIHogZTnvZHmo4DmtYtcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG5ldHdvcmsgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi9uZXR3b3JrJyk7XG4gKiAkbmV0d29yay5zdXBwb3J0KCk7IC8vIHRydWUvZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3VwcG9ydCgpIHtcbiAgaWYgKHN1cHBvcnRPbmxpbmUgPT09IG51bGwpIHtcbiAgICBzdXBwb3J0T25saW5lID0gISEoJ29uTGluZScgaW4gd2luZG93Lm5hdmlnYXRvcik7XG4gIH1cbiAgcmV0dXJuIHN1cHBvcnRPbmxpbmU7XG59XG5cbi8qKlxuICog5Yik5pat6aG16Z2i5piv5ZCm6IGU572RXG4gKiBAbWV0aG9kIGVudi9uZXR3b3JrLm9uTGluZVxuICogQG1lbWJlcm9mIGVudi9uZXR3b3JrXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5piv5ZCm6IGU572RXG4gKiBAZXhhbXBsZVxuICogdmFyICRuZXR3b3JrID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvbmV0d29yaycpO1xuICogJG5ldHdvcmsub25MaW5lKCk7IC8vIHRydWUvZmFsc2VcbiAqL1xuZnVuY3Rpb24gb25MaW5lKCkge1xuICByZXR1cm4gc3VwcG9ydCgpID8gd2luZG93Lm5hdmlnYXRvci5vbkxpbmUgOiB0cnVlO1xufVxuXG5leHBvcnRzLnN1cHBvcnQgPSBzdXBwb3J0O1xuZXhwb3J0cy5vbkxpbmUgPSBvbkxpbmU7XG4iLCIvKipcbiAqIOajgOa1i+aTjeS9nOezu+e7n+exu+Wei1xuICpcbiAqIOaUr+aMgeeahOexu+Wei+ajgOa1i1xuICogLSBpb3NcbiAqIC0gYW5kcm9pZFxuICogQG1ldGhvZCBlbnYvb3NcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkb3MgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi9vcycpO1xuICogY29uc29sZS5pbmZvKCRvcygpLmlvcyk7XG4gKiBjb25zb2xlLmluZm8oJG9zLmRldGVjdCgpKTtcbiAqL1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcblxudmFyIHRlc3RlcnMgPSB7XG4gIGlvczogL2xpa2UgbWFjIG9zIHgvaSxcbiAgYW5kcm9pZDogZnVuY3Rpb24gKHVhKSB7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ2FuZHJvaWQnKSA+IC0xIHx8IHVhLmluZGV4T2YoJ2xpbnV4JykgPiAtMTtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGRldGVjdChvcHRpb25zLCBjaGVja2Vycykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHVhOiAnJyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgJGFzc2lnbih0ZXN0ZXJzLCBjaGVja2Vycyk7XG5cbiAgcmV0dXJuICR1YU1hdGNoKHRlc3RlcnMsIGNvbmYudWEsIGNvbmYpO1xufVxuXG52YXIgcmVzdWx0ID0gbnVsbDtcblxuZnVuY3Rpb24gb3MoKSB7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gZGV0ZWN0KCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxub3MuZGV0ZWN0ID0gZGV0ZWN0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9zO1xuIiwiLyoqXG4gKiDliKTmlq3mtY/op4jlmajmmK/lkKbmlK/mjIHop6bmkbjlsY9cbiAqIEBtZXRob2QgZW52L3RvdWNoYWJsZVxuICogQHJldHVybnMge0Jvb2xlYW59IOaYr+WQpuaUr+aMgeinpuaRuOWxj1xuICogQGV4YW1wbGVcbiAqIHZhciAkdG91Y2hhYmxlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlJyk7XG4gKiBpZiAoJHRvdWNoYWJsZSgpKSB7XG4gKiAgIC8vIEl0IGlzIGEgdG91Y2ggZGV2aWNlLlxuICogfVxuICovXG5cbnZhciBpc1RvdWNoYWJsZSA9IG51bGw7XG5cbmZ1bmN0aW9uIHRvdWNoYWJsZSgpIHtcbiAgaWYgKGlzVG91Y2hhYmxlID09PSBudWxsKSB7XG4gICAgaXNUb3VjaGFibGUgPSAhISgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3dcbiAgICB8fCAod2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRUb3VjaCkpO1xuICB9XG4gIHJldHVybiBpc1RvdWNoYWJsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b3VjaGFibGU7XG4iLCIvKipcbiAqIFVB5a2X56ym5Liy5Yy56YWN5YiX6KGoXG4gKiBAbWV0aG9kIGVudi91YU1hdGNoXG4gKiBAcGFyYW0ge09iamVjdH0gbGlzdCDmo4DmtYsgSGFzaCDliJfooahcbiAqIEBwYXJhbSB7U3RyaW5nfSB1YSDnlKjkuo7mo4DmtYvnmoQgVUEg5a2X56ym5LiyXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZiDmo4DmtYvlmajpgInpobnvvIzkvKDpgJLnu5nmo4DmtYvlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi91YU1hdGNoJyk7XG4gKiB2YXIgcnMgPSAkdWFNYXRjaCh7XG4gKiAgIHRyaWRlbnQ6ICd0cmlkZW50JyxcbiAqICAgcHJlc3RvOiAvcHJlc3RvLyxcbiAqICAgZ2Vja286IGZ1bmN0aW9uKHVhKXtcbiAqICAgICByZXR1cm4gdWEuaW5kZXhPZignZ2Vja28nKSA+IC0xICYmIHVhLmluZGV4T2YoJ2todG1sJykgPT09IC0xO1xuICogICB9XG4gKiB9LCAneHh4IHByZXN0byB4eHgnKTtcbiAqIGNvbnNvbGUuaW5mbyhycy5wcmVzdG8pOyAvLyB0cnVlXG4gKiBjb25zb2xlLmluZm8ocnMudHJpZGVudCk7IC8vIHVuZGVmaW5lZFxuICovXG5cbmZ1bmN0aW9uIHVhTWF0Y2gobGlzdCwgdWEsIGNvbmYpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBpZiAoIXVhKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB1YSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIH1cbiAgfVxuICB1YSA9IHVhLnRvTG93ZXJDYXNlKCk7XG4gIGlmICh0eXBlb2YgbGlzdCA9PT0gJ29iamVjdCcpIHtcbiAgICBPYmplY3Qua2V5cyhsaXN0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciB0ZXN0ZXIgPSBsaXN0W2tleV07XG4gICAgICBpZiAodGVzdGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGVzdGVyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmICh1YS5pbmRleE9mKHRlc3RlcikgPiAtMSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGVzdGVyKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcbiAgICAgICAgKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gdWEubWF0Y2godGVzdGVyKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFsxXSkge1xuICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVzdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKHRlc3Rlcih1YSwgY29uZikpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGVzdGVyKHVhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdWFNYXRjaDtcbiIsInZhciBpc1N1cHBvcnRXZWJwID0gbnVsbDtcblxuLyoqXG4gKiDliKTmlq3mtY/op4jlmajmmK/lkKbmlK/mjIF3ZWJwXG4gKiBAbWV0aG9kIGVudi93ZWJwXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5piv5ZCm5pSv5oyBd2VicFxuICogQGV4YW1wbGVcbiAqIHZhciAkd2VicCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZW52L3dlYnAnKTtcbiAqIGNvbnNvbGUuaW5mbygkd2VicCgpKTsgLy8gdHJ1ZS9mYWxzZVxuICovXG5cbi8qKlxuICog5Yik5pat5rWP6KeI5Zmo5piv5ZCm5pSv5oyBd2VicFxuICogQG1ldGhvZCBlbnYvd2VicC5zdXBwb3J0XG4gKiBAbWVtYmVyb2YgZW52L3dlYnBcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIF3ZWJwXG4gKiBAZXhhbXBsZVxuICogdmFyICR3ZWJwID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvd2VicCcpO1xuICogY29uc29sZS5pbmZvKCR3ZWJwLnN1cHBvcnQoKSk7IC8vIHRydWUvZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3VwcG9ydCgpIHtcbiAgdmFyIHJzID0gISFbXS5tYXBcbiAgICAmJiBkb2N1bWVudFxuICAgICAgLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgICAudG9EYXRhVVJMKCdpbWFnZS93ZWJwJylcbiAgICAgIC5pbmRleE9mKCdkYXRhOmltYWdlL3dlYnAnKSA9PT0gMDtcbiAgcmV0dXJuIHJzO1xufVxuXG5mdW5jdGlvbiB3ZWJwKCkge1xuICBpZiAoaXNTdXBwb3J0V2VicCA9PT0gbnVsbCkge1xuICAgIGlzU3VwcG9ydFdlYnAgPSBzdXBwb3J0KCk7XG4gIH1cbiAgcmV0dXJuIGlzU3VwcG9ydFdlYnA7XG59XG5cbndlYnAuc3VwcG9ydCA9IHN1cHBvcnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gd2VicDtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKipcbiAqIEEgbW9kdWxlIHRoYXQgY2FuIGJlIG1peGVkIGluIHRvICphbnkgb2JqZWN0KiBpbiBvcmRlciB0byBwcm92aWRlIGl0XG4gKiB3aXRoIGN1c3RvbSBldmVudHMuIFlvdSBtYXkgYmluZCB3aXRoIGBvbmAgb3IgcmVtb3ZlIHdpdGggYG9mZmAgY2FsbGJhY2tcbiAqIGZ1bmN0aW9ucyB0byBhbiBldmVudDsgYHRyaWdnZXJgLWluZyBhbiBldmVudCBmaXJlcyBhbGwgY2FsbGJhY2tzIGluXG4gKiBzdWNjZXNzaW9uLlxuICogLSDkuIDkuKrlj6/ku6Xooqvmt7flkIjliLDku7vkvZXlr7nosaHnmoTmqKHlnZfvvIznlKjkuo7mj5Dkvpvoh6rlrprkuYnkuovku7bjgIJcbiAqIC0g5Y+v5Lul55SoIG9uLCBvZmYg5pa55rOV5p2l57uR5a6a56e76Zmk5LqL5Lu244CCXG4gKiAtIOeUqCB0cmlnZ2VyIOadpeinpuWPkeS6i+S7tumAmuefpeOAglxuICogQGNsYXNzIGV2dC9FdmVudHNcbiAqIEBzZWUgW21pdHRdKGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZlbG9waXQvbWl0dClcbiAqIEBzZWUgW2FyYWxlanNdKGh0dHA6Ly9hcmFsZWpzLm9yZy8pXG4gKiBAc2VlIFtiYWNrYm9uZV0oaHR0cHM6Ly9naXRodWIuY29tL2RvY3VtZW50Y2xvdWQvYmFja2JvbmUvYmxvYi9tYXN0ZXIvYmFja2JvbmUuanMpXG4gKiBAc2VlIFtldmVudHNdKGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9ibG9iL21hc3Rlci9saWIvZXZlbnRzLmpzKVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnQvZXZlbnRzJyk7XG4gKiB2YXIgZXZ0ID0gbmV3ICRldmVudHMoKTtcbiAqIGV2dC5vbignYWN0aW9uJywgZnVuY3Rpb24oKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnYWN0aW9uIHRyaWdnZXJlZCcpO1xuICogfSk7XG4gKiBldnQudHJpZ2dlcignYWN0aW9uJyk7XG4gKi9cblxuLy8gUmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gc3BsaXQgZXZlbnQgc3RyaW5nc1xudmFyIGV2ZW50U3BsaXR0ZXIgPSAvXFxzKy87XG5cbnZhciBFdmVudHMgPSBmdW5jdGlvbiAoKSB7fTtcblxuLyoqXG4gKiBCaW5kIG9uZSBvciBtb3JlIHNwYWNlIHNlcGFyYXRlZCBldmVudHMsIGBldmVudHNgLCB0byBhIGBjYWxsYmFja2BcbiAqIGZ1bmN0aW9uLiBQYXNzaW5nIGBcImFsbFwiYCB3aWxsIGJpbmQgdGhlIGNhbGxiYWNrIHRvIGFsbCBldmVudHMgZmlyZWQuXG4gKiAtIOe7keWumuS4gOS4quS6i+S7tuWbnuiwg+WHveaVsO+8jOaIluiAheeUqOWkmuS4quepuuagvOWIhumalOadpee7keWumuWkmuS4quS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDkvKDlhaXlj4LmlbAgYCdhbGwnYCDkvJrlnKjmiYDmnInkuovku7blj5HnlJ/ml7booqvop6blj5HjgIJcbiAqIEBtZXRob2QgRXZlbnRzI29uXG4gKiBAbWVtYmVyb2YgZXZ0L0V2ZW50c1xuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50cyDkuovku7blkI3np7BcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIOS6i+S7tuWbnuiwg+WHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSDlm57osIPlh73mlbDnmoTmiafooYznjq/looPlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGV2ZW50cyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKlxuICogLy8g57uR5a6aMeS4quS6i+S7tlxuICogZXZ0Lm9uKCdldmVudC1uYW1lJywgZnVuY3Rpb24gKCkge30pO1xuICpcbiAqIC8vIOe7keWumjLkuKrkuovku7ZcbiAqIGV2dC5vbignZXZlbnQxIGV2ZW50MicsIGZ1bmN0aW9uICgpIHt9KTtcbiAqXG4gKiAvLyDnu5HlrprkuLrmiYDmnInkuovku7ZcbiAqIGV2dC5vbignYWxsJywgZnVuY3Rpb24gKCkge30pO1xuICovXG5cbkV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnRzLCBjYWxsYmFjaywgY29udGV4dCkge1xuICB2YXIgY2FjaGU7XG4gIHZhciBldmVudDtcbiAgdmFyIGxpc3Q7XG4gIGlmICghY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNhY2hlID0gdGhpcy5fX2V2ZW50cyB8fCAodGhpcy5fX2V2ZW50cyA9IHt9KTtcbiAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuXG4gIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gIHdoaWxlIChldmVudCkge1xuICAgIGxpc3QgPSBjYWNoZVtldmVudF0gfHwgKGNhY2hlW2V2ZW50XSA9IFtdKTtcbiAgICBsaXN0LnB1c2goY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIG9uZSBvciBtYW55IGNhbGxiYWNrcy4gSWYgYGNvbnRleHRgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrc1xuICogd2l0aCB0aGF0IGZ1bmN0aW9uLiBJZiBgY2FsbGJhY2tgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGNhbGxiYWNrcyBmb3IgdGhlXG4gKiBldmVudC4gSWYgYGV2ZW50c2AgaXMgbnVsbCwgcmVtb3ZlcyBhbGwgYm91bmQgY2FsbGJhY2tzIGZvciBhbGwgZXZlbnRzLlxuICogLSDnp7vpmaTkuIDkuKrmiJbogIXlpJrkuKrkuovku7blm57osIPlh73mlbDjgIJcbiAqIC0g5aaC5p6c5LiN5Lyg6YCSIGNhbGxiYWNrIOWPguaVsO+8jOS8muenu+mZpOaJgOacieivpeaXtumXtOWQjeensOeahOS6i+S7tuWbnuiwg+WHveaVsOOAglxuICogLSDlpoLmnpzkuI3mjIflrprkuovku7blkI3np7DvvIznp7vpmaTmiYDmnInoh6rlrprkuYnkuovku7blm57osIPlh73mlbDjgIJcbiAqIEBtZXRob2QgRXZlbnRzI29mZlxuICogQG1lbWJlcm9mIGV2dC9FdmVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRzXSDkuovku7blkI3np7BcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10g6KaB56e76Zmk55qE5LqL5Lu25Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIOimgeenu+mZpOeahOWbnuiwg+WHveaVsOeahOaJp+ihjOeOr+Wig+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnQvZXZlbnRzJyk7XG4gKiB2YXIgZXZ0ID0gbmV3ICRldmVudHMoKTtcbiAqIHZhciBib3VuZCA9IHt9O1xuICogYm91bmQudGVzdCA9IGZ1bmN0aW9uICgpIHt9O1xuICpcbiAqIC8vIOenu+mZpOS6i+S7tuWQjeS4uiBldmVudC1uYW1lIOeahOS6i+S7tuWbnuiwg+WHveaVsCBib3VuZC50ZXN0XG4gKiBldnQub2ZmKCdldmVudC1uYW1lJywgYm91bmQudGVzdCk7XG4gKlxuICogLy8g56e76Zmk5LqL5Lu25ZCN5Li6ICdldmVudCcg55qE5omA5pyJ5LqL5Lu25Zue6LCD5Ye95pWwXG4gKiBldnQub2ZmKCdldmVudCcpO1xuICpcbiAqIC8vIOenu+mZpOaJgOacieiHquWumuS5ieS6i+S7tlxuICogZXZ0Lm9mZigpO1xuICovXG5cbkV2ZW50cy5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgdmFyIGNhY2hlO1xuICB2YXIgZXZlbnQ7XG4gIHZhciBsaXN0O1xuICB2YXIgaTtcblxuICAvLyBObyBldmVudHMsIG9yIHJlbW92aW5nICphbGwqIGV2ZW50cy5cbiAgY2FjaGUgPSB0aGlzLl9fZXZlbnRzO1xuICBpZiAoIWNhY2hlKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgaWYgKCEoZXZlbnRzIHx8IGNhbGxiYWNrIHx8IGNvbnRleHQpKSB7XG4gICAgZGVsZXRlIHRoaXMuX19ldmVudHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBldmVudHMgPSBldmVudHMgPyBldmVudHMuc3BsaXQoZXZlbnRTcGxpdHRlcikgOiBPYmplY3Qua2V5cyhjYWNoZSk7XG5cbiAgLy8gTG9vcCB0aHJvdWdoIHRoZSBjYWxsYmFjayBsaXN0LCBzcGxpY2luZyB3aGVyZSBhcHByb3ByaWF0ZS5cbiAgZm9yIChldmVudCA9IGV2ZW50cy5zaGlmdCgpOyBldmVudDsgZXZlbnQgPSBldmVudHMuc2hpZnQoKSkge1xuICAgIGxpc3QgPSBjYWNoZVtldmVudF07XG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoIShjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuICAgICAgZGVsZXRlIGNhY2hlW2V2ZW50XTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMjsgaSA+PSAwOyBpIC09IDIpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICAoY2FsbGJhY2sgJiYgbGlzdFtpXSAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdFtpICsgMV0gIT09IGNvbnRleHQpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBsaXN0LnNwbGljZShpLCAyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVHJpZ2dlciBvbmUgb3IgbWFueSBldmVudHMsIGZpcmluZyBhbGwgYm91bmQgY2FsbGJhY2tzLiBDYWxsYmFja3MgYXJlXG4gKiBwYXNzZWQgdGhlIHNhbWUgYXJndW1lbnRzIGFzIGB0cmlnZ2VyYCBpcywgYXBhcnQgZnJvbSB0aGUgZXZlbnQgbmFtZVxuICogKHVubGVzcyB5b3UncmUgbGlzdGVuaW5nIG9uIGBcImFsbFwiYCwgd2hpY2ggd2lsbCBjYXVzZSB5b3VyIGNhbGxiYWNrIHRvXG4gKiByZWNlaXZlIHRoZSB0cnVlIG5hbWUgb2YgdGhlIGV2ZW50IGFzIHRoZSBmaXJzdCBhcmd1bWVudCkuXG4gKiAtIOa0vuWPkeS4gOS4quaIluiAheWkmuS4quS6i+S7tu+8jOS8muinpuWPkeWvueW6lOS6i+S7tuWQjeensOe7keWumueahOaJgOacieS6i+S7tuWHveaVsOOAglxuICogLSDnrKzkuIDkuKrlj4LmlbDmmK/kuovku7blkI3np7DvvIzliankuIvlhbbku5blj4LmlbDlsIbkvZzkuLrkuovku7blm57osIPnmoTlj4LmlbDjgIJcbiAqIEBtZXRob2QgRXZlbnRzI3RyaWdnZXJcbiAqIEBtZW1iZXJvZiBldnQvRXZlbnRzXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRzIOS6i+S7tuWQjeensFxuICogQHBhcmFtIHsuLi4qfSBbYXJnXSDkuovku7blj4LmlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGV2ZW50cyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKlxuICogLy8g6Kem5Y+R5LqL5Lu25ZCN5Li6ICdldmVudC1uYW1lJyDnmoTkuovku7ZcbiAqIGV2dC50cmlnZ2VyKCdldmVudC1uYW1lJyk7XG4gKlxuICogLy8g5ZCM5pe26Kem5Y+RMuS4quS6i+S7tlxuICogZXZ0LnRyaWdnZXIoJ2V2ZW50MSBldmVudDInKTtcbiAqXG4gKiAvLyDop6blj5Hkuovku7blkIzml7bkvKDpgJLlj4LmlbBcbiAqIGV2dC5vbignZXZlbnQteCcsIGZ1bmN0aW9uIChhLCBiKSB7XG4gKiAgIGNvbnNvbGUuaW5mbyhhLCBiKTsgLy8gMSwgMlxuICogfSk7XG4gKiBldnQudHJpZ2dlcignZXZlbnQteCcsIDEsIDIpO1xuICovXG5FdmVudHMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnRzKSB7XG4gIHZhciBjYWNoZTtcbiAgdmFyIGV2ZW50O1xuICB2YXIgYWxsO1xuICB2YXIgbGlzdDtcbiAgdmFyIGk7XG4gIHZhciBsZW47XG4gIHZhciByZXN0ID0gW107XG4gIHZhciBhcmdzO1xuXG4gIGNhY2hlID0gdGhpcy5fX2V2ZW50cztcbiAgaWYgKCFjYWNoZSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpO1xuXG4gIC8vIEZpbGwgdXAgYHJlc3RgIHdpdGggdGhlIGNhbGxiYWNrIGFyZ3VtZW50cy4gIFNpbmNlIHdlJ3JlIG9ubHkgY29weWluZ1xuICAvLyB0aGUgdGFpbCBvZiBgYXJndW1lbnRzYCwgYSBsb29wIGlzIG11Y2ggZmFzdGVyIHRoYW4gQXJyYXkjc2xpY2UuXG4gIGZvciAoaSA9IDEsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIHJlc3RbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggZXZlbnQsIHdhbGsgdGhyb3VnaCB0aGUgbGlzdCBvZiBjYWxsYmFja3MgdHdpY2UsIGZpcnN0IHRvXG4gIC8vIHRyaWdnZXIgdGhlIGV2ZW50LCB0aGVuIHRvIHRyaWdnZXIgYW55IGBcImFsbFwiYCBjYWxsYmFja3MuXG4gIGZvciAoZXZlbnQgPSBldmVudHMuc2hpZnQoKTsgZXZlbnQ7IGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCkpIHtcbiAgICAvLyBDb3B5IGNhbGxiYWNrIGxpc3RzIHRvIHByZXZlbnQgbW9kaWZpY2F0aW9uLlxuICAgIGFsbCA9IGNhY2hlLmFsbDtcbiAgICBpZiAoYWxsKSB7XG4gICAgICBhbGwgPSBhbGwuc2xpY2UoKTtcbiAgICB9XG5cbiAgICBsaXN0ID0gY2FjaGVbZXZlbnRdO1xuICAgIGlmIChsaXN0KSB7XG4gICAgICBsaXN0ID0gbGlzdC5zbGljZSgpO1xuICAgIH1cblxuICAgIC8vIEV4ZWN1dGUgZXZlbnQgY2FsbGJhY2tzLlxuICAgIGlmIChsaXN0KSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgIGxpc3RbaV0uYXBwbHkobGlzdFtpICsgMV0gfHwgdGhpcywgcmVzdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhlY3V0ZSBcImFsbFwiIGNhbGxiYWNrcy5cbiAgICBpZiAoYWxsKSB7XG4gICAgICBhcmdzID0gW2V2ZW50XS5jb25jYXQocmVzdCk7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhbGwubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgYWxsW2ldLmFwcGx5KGFsbFtpICsgMV0gfHwgdGhpcywgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE1peCBgRXZlbnRzYCB0byBvYmplY3QgaW5zdGFuY2Ugb3IgQ2xhc3MgZnVuY3Rpb24uXG4gKiAtIOWwhuiHquWumuS6i+S7tuWvueixoe+8jOa3t+WQiOWIsOS4gOS4quexu+eahOWunuS+i+OAglxuICogQG1ldGhvZCBFdmVudHMubWl4VG9cbiAqIEBtZW1iZXJvZiBldnQvRXZlbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjZWl2ZXIg6KaB5re35ZCI5LqL5Lu25Ye95pWw55qE5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRldmVudHMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIC8vIOe7meS4gOS4quWunuS+i+a3t+WQiOiHquWumuS5ieS6i+S7tuaWueazlVxuICogdmFyIG9iaiA9IHt9O1xuICogJGV2ZW50cy5taXhUbyhvYmopO1xuICpcbiAqIC8vIOeUn+aIkOS4gOS4quWunuS+i1xuICogdmFyIG8xID0gT2JqZWN0LmNyZWF0ZShvYmopO1xuICpcbiAqIC8vIOWPr+S7peWcqOi/meS4quWvueixoeS4iuiwg+eUqOiHquWumuS5ieS6i+S7tueahOaWueazleS6hlxuICogbzEub24oJ2V2ZW50JywgZnVuY3Rpb24gKCkge30pO1xuICovXG5FdmVudHMubWl4VG8gPSBmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgcmVjZWl2ZXIgPSByZWNlaXZlci5wcm90b3R5cGUgfHwgcmVjZWl2ZXI7XG4gIHZhciBwcm90byA9IEV2ZW50cy5wcm90b3R5cGU7XG5cbiAgZm9yICh2YXIgcCBpbiBwcm90bykge1xuICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgcmVjZWl2ZXJbcF0gPSBwcm90b1twXTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRzO1xuIiwiLyoqXG4gKiDlpITnkIbkuovku7bkuI7lub/mkq1cbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvZXZ0XG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZXZ0Lm9jY3VySW5zaWRlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnRcbiAqIHZhciAkZXZ0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnQnKTtcbiAqIGNvbnNvbGUuaW5mbygkZXZ0Lm9jY3VySW5zaWRlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkb2NjdXJJbnNpZGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dC9vY2N1ckluc2lkZScpO1xuICovXG5cbmV4cG9ydHMuRXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbmV4cG9ydHMuTGlzdGVuZXIgPSByZXF1aXJlKCcuL2xpc3RlbmVyJyk7XG5leHBvcnRzLm9jY3VySW5zaWRlID0gcmVxdWlyZSgnLi9vY2N1ckluc2lkZScpO1xuZXhwb3J0cy50YXBTdG9wID0gcmVxdWlyZSgnLi90YXBTdG9wJyk7XG4iLCIvKipcbiAqIOW5v+aSree7hOS7tlxuICogLSDmnoTpgKDlrp7kvovml7bvvIzpnIDopoHkvKDlhaXkuovku7bnmb3lkI3ljZXliJfooajjgIJcbiAqIC0g5Y+q5pyJ5Zyo55m95ZCN5Y2V5YiX6KGo5LiK55qE5LqL5Lu25omN5Y+v5Lul6KKr6Kem5Y+R44CCXG4gKiAtIOS6i+S7tua3u+WKoO+8jOenu+mZpO+8jOa/gOWPkeeahOiwg+eUqOaWueazleWPguiAgyBFdmVudHPjgIJcbiAqIEBzZWUgW2V2dC9FdmVudHNdKCNldnQtZXZlbnRzKVxuICogQGNsYXNzIGV2dC9MaXN0ZW5lclxuICogQGV4YW1wbGVcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxpc3RlbmVyID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnQvbGlzdGVuZXInKTtcbiAqXG4gKiAvLyDnmb3lkI3ljZXph4zlj6rorrDlvZXkuoYgZXZlbnQxIOS6i+S7tlxuICogdmFyIGNoYW5uZWxHbG9iYWwgPSBuZXcgJGxpc3RlbmVyKFtcbiAqICAgJ2V2ZW50MSdcbiAqIF0pO1xuICogY2hhbm5lbEdsb2JhbC5vbignZXZlbnQxJywgZnVuY3Rpb24oKXtcbiAqICAgY29uc29sZS5sb2coJ2V2ZW50MScpO1xuICogfSk7XG4gKiBjaGFubmVsR2xvYmFsLm9uKCdldmVudDInLCBmdW5jdGlvbigpe1xuICogICAvLyB3aWxsIG5vdCBydW5cbiAqICAgY29uc29sZS5sb2coJ2V2ZW50MicpO1xuICogfSk7XG4gKiBjaGFubmVsR2xvYmFsLnRyaWdnZXIoJ2V2ZW50MScpO1xuICogY2hhbm5lbEdsb2JhbC50cmlnZ2VyKCdldmVudDInKTtcbiAqL1xuXG52YXIgJGV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG5cbnZhciBMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudHMpIHtcbiAgdGhpcy5wcml2YXRlV2hpdGVMaXN0ID0ge307XG4gIHRoaXMucHJpdmF0ZVJlY2VpdmVyID0gbmV3ICRldmVudHMoKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnRzKSkge1xuICAgIGV2ZW50cy5mb3JFYWNoKHRoaXMuZGVmaW5lLmJpbmQodGhpcykpO1xuICB9XG59O1xuXG5MaXN0ZW5lci5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBMaXN0ZW5lcixcbiAgLyoqXG4gICAqIOWcqOeZveWQjeWNleS4iuWumuS5ieS4gOS4quS6i+S7tuWQjeensFxuICAgKiBAbWV0aG9kIExpc3RlbmVyI2RlZmluZVxuICAgKiBAbWVtYmVyb2YgZXZ0L0xpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICovXG4gIGRlZmluZTogZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgIHRoaXMucHJpdmF0ZVdoaXRlTGlzdFtldmVudE5hbWVdID0gdHJ1ZTtcbiAgfSxcbiAgLyoqXG4gICAqIOenu+mZpOeZveWQjeWNleS4iuWumuS5ieeahOS6i+S7tuWQjeensFxuICAgKiBAbWV0aG9kIExpc3RlbmVyI3VuZGVmaW5lXG4gICAqIEBtZW1iZXJvZiBldnQvTGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgKi9cbiAgdW5kZWZpbmU6IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5wcml2YXRlV2hpdGVMaXN0W2V2ZW50TmFtZV07XG4gIH0sXG4gIC8qKlxuICAgKiDlub/mkq3nu4Tku7bnu5Hlrprkuovku7ZcbiAgICogQHNlZSBbRXZlbnRzI29uXSgjZXZlbnRzLW9uKVxuICAgKiBAbWV0aG9kIExpc3RlbmVyI29uXG4gICAqIEBtZW1iZXJvZiBldnQvTGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSDopoHnu5HlrprnmoTkuovku7blkI3np7BcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB57uR5a6a55qE5LqL5Lu25Zue6LCD5Ye95pWwXG4gICAqL1xuICBvbjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJpdmF0ZVJlY2VpdmVyLm9uLmFwcGx5KHRoaXMucHJpdmF0ZVJlY2VpdmVyLCBhcmd1bWVudHMpO1xuICB9LFxuICAvKipcbiAgICog5bm/5pKt57uE5Lu256e76Zmk5LqL5Lu2XG4gICAqIEBzZWUgW0V2ZW50cyNvZmZdKCNldmVudHMtb2ZmKVxuICAgKiBAbWV0aG9kIExpc3RlbmVyI29mZlxuICAgKiBAbWVtYmVyb2YgZXZ0L0xpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUg6KaB56e76Zmk57uR5a6a55qE5LqL5Lu25ZCN56ewXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeenu+mZpOe7keWumueahOS6i+S7tuWbnuiwg+WHveaVsFxuICAgKi9cbiAgb2ZmOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcml2YXRlUmVjZWl2ZXIub2ZmLmFwcGx5KHRoaXMucHJpdmF0ZVJlY2VpdmVyLCBhcmd1bWVudHMpO1xuICB9LFxuICAvKipcbiAgICog5bm/5pKt57uE5Lu25rS+5Y+R5LqL5Lu2XG4gICAqIEBzZWUgW0V2ZW50cyN0cmlnZ2VyXSgjZXZlbnRzLXRyaWdnZXIpXG4gICAqIEBtZXRob2QgTGlzdGVuZXIjdHJpZ2dlclxuICAgKiBAbWVtYmVyb2YgZXZ0L0xpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUg6KaB6Kem5Y+R55qE5LqL5Lu25ZCN56ewXG4gICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10g5LqL5Lu25Y+C5pWwXG4gICAqL1xuICB0cmlnZ2VyOiBmdW5jdGlvbiAoZXZlbnRzKSB7XG4gICAgdmFyIHJlc3QgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAvLyDmjInnhadFdmVudHMudHJpZ2dlcueahOiwg+eUqOaWueW8j++8jOesrOS4gOS4quWPguaVsOaYr+eUqOepuuagvOWIhumalOeahOS6i+S7tuWQjeensOWIl+ihqFxuICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdCgvXFxzKy8pO1xuXG4gICAgLy8g6YGN5Y6G5LqL5Lu25YiX6KGo77yM5L6d5o2u55m95ZCN5Y2V5Yaz5a6a5LqL5Lu25piv5ZCm5r+A5Y+RXG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGV2dE5hbWUpIHtcbiAgICAgIGlmICh0aGlzLnByaXZhdGVXaGl0ZUxpc3RbZXZ0TmFtZV0pIHtcbiAgICAgICAgdGhpcy5wcml2YXRlUmVjZWl2ZXIudHJpZ2dlci5hcHBseSh0aGlzLnByaXZhdGVSZWNlaXZlciwgW2V2dE5hbWVdLmNvbmNhdChyZXN0KSk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdGVuZXI7XG4iLCIvKipcbiAqIOWIpOaWreS6i+S7tuaYr+WQpuWPkeeUn+WcqOS4gOS4qiBEb20g5YWD57Sg5YaF44CCXG4gKiAtIOW4uOeUqOS6juWIpOaWreeCueWHu+S6i+S7tuWPkeeUn+WcqOa1ruWxguWkluaXtuWFs+mXrea1ruWxguOAglxuICogQG1ldGhvZCBldnQvb2NjdXJJbnNpZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCDmtY/op4jlmajkuovku7blr7nosaFcbiAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIOeUqOS6juavlOi+g+S6i+S7tuWPkeeUn+WMuuWfn+eahCBEb20g5a+56LGhXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5LqL5Lu25piv5ZCm5Y+R55Sf5ZyoIG5vZGUg5YaFXG4gKiBAZXhhbXBsZVxuICogdmFyICRvY2N1ckluc2lkZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L29jY3VySW5zaWRlJyk7XG4gKiAkKCcubGF5ZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldnQpe1xuICogICBpZigkb2NjdXJJbnNpZGUoZXZ0LCAkKHRoaXMpLmZpbmQoJ2Nsb3NlJykuZ2V0KDApKSl7XG4gKiAgICAgJCh0aGlzKS5oaWRlKCk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbmZ1bmN0aW9uIG9jY3VySW5zaWRlKGV2ZW50LCBub2RlKSB7XG4gIGlmIChub2RlICYmIGV2ZW50ICYmIGV2ZW50LnRhcmdldCkge1xuICAgIHZhciBwb3MgPSBldmVudC50YXJnZXQ7XG4gICAgd2hpbGUgKHBvcykge1xuICAgICAgaWYgKHBvcyA9PT0gbm9kZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHBvcyA9IHBvcy5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2NjdXJJbnNpZGU7XG4iLCIvKipcbiAqIOeUqOmBrue9qeeahOaWueW8j+mYu+atoiB0YXAg5LqL5Lu256m/6YCP5byV5Y+R6KGo5Y2V5YWD57Sg6I635Y+W54Sm54K544CCXG4gKiAtIOaOqOiNkOeUqCBmYXN0Y2xpY2sg5p2l6Kej5Yaz6Kem5bGP5LqL5Lu256m/6YCP6Zeu6aKY44CCXG4gKiAtIOatpOe7hOS7tueUqOWcqCBmYXN0Y2xpY2sg5pyq6IO96Kej5Yaz6Zeu6aKY5pe244CC5oiW6ICF5LiN5pa55L6/5L2/55SoIGZhc3RjbGljayDml7bjgIJcbiAqIEBtZXRob2QgZXZ0L3RhcFN0b3BcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOeCueWHu+mAiemhuVxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZGVsYXkg5Li05pe25rWu5bGC5Zyo6L+Z5Liq5bu26L+f5pe26Ze0KG1zKeS5i+WQjuWFs+mXrVxuICogQGV4YW1wbGVcbiAqIHZhciAkdGFwU3RvcCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L3RhcFN0b3AnKTtcbiAqICQoJy5tYXNrJykub24oJ3RhcCcsIGZ1bmN0aW9uKCl7XG4gKiAgICR0YXBTdG9wKCk7XG4gKiAgICQodGhpcykuaGlkZSgpO1xuICogfSk7XG4gKi9cbnZhciBtaW5pTWFzayA9IG51bGw7XG52YXIgcG9zID0ge307XG52YXIgdGltZXIgPSBudWxsO1xudmFyIHRvdWNoU3RhcnRCb3VuZCA9IGZhbHNlO1xuXG52YXIgdGFwU3RvcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciAkID0gd2luZG93LiQgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnk7XG5cbiAgdmFyIGNvbmYgPSAkLmV4dGVuZCh7XG4gICAgLy8g6YGu572p5a2Y5Zyo5pe26Ze0XG4gICAgZGVsYXk6IDUwMCxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgaWYgKCFtaW5pTWFzaykge1xuICAgIG1pbmlNYXNrID0gJCgnPGRpdiBjbGFzcz1cInRhcC1zdG9wLW1hc2tcIj48L2Rpdj4nKTtcbiAgICBtaW5pTWFzay5jc3Moe1xuICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgJ21hcmdpbi1sZWZ0JzogJy0yMHB4JyxcbiAgICAgICdtYXJnaW4tdG9wJzogJy0yMHB4JyxcbiAgICAgICd6LWluZGV4JzogMTAwMDAsXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICdyZ2JhKDAsMCwwLDApJyxcbiAgICAgIHdpZHRoOiAnNDBweCcsXG4gICAgICBoZWlnaHQ6ICc0MHB4JyxcbiAgICB9KS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgfVxuXG4gIGlmICghdG91Y2hTdGFydEJvdW5kKSB7XG4gICAgJChkb2N1bWVudCkub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoIShldnQgJiYgZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdG91Y2ggPSBldnQudG91Y2hlc1swXTtcbiAgICAgIHBvcy5wYWdlWCA9IHRvdWNoLnBhZ2VYO1xuICAgICAgcG9zLnBhZ2VZID0gdG91Y2gucGFnZVk7XG4gICAgfSk7XG4gICAgdG91Y2hTdGFydEJvdW5kID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBkZWxheSA9IHBhcnNlSW50KGNvbmYuZGVsYXksIDEwKSB8fCAwO1xuICBtaW5pTWFzay5zaG93KCkuY3NzKHtcbiAgICBsZWZ0OiBwb3MucGFnZVggKyAncHgnLFxuICAgIHRvcDogcG9zLnBhZ2VZICsgJ3B4JyxcbiAgfSk7XG4gIGNsZWFyVGltZW91dCh0aW1lcik7XG4gIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgbWluaU1hc2suaGlkZSgpO1xuICB9LCBkZWxheSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRhcFN0b3A7XG4iLCIvKipcbiAqIOWMheijheS4uuW7tui/n+inpuWPkeeahOWHveaVsFxuICogLSDnlKjkuo7lpITnkIblr4bpm4bkuovku7bvvIzlu7bov5/ml7bpl7TlhoXlkIzml7bop6blj5HnmoTlh73mlbDosIPnlKjjgIJcbiAqIC0g5pyA57uI5Y+q5Zyo5pyA5ZCO5LiA5qyh6LCD55So5bu26L+f5ZCO77yM5omn6KGM5LiA5qyh44CCXG4gKiBAbWV0aG9kIGZuL2RlbGF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahHRoaXPmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE5bu26L+f6Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRkZWxheSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZm4vZGVsYXknKTtcbiAqIHZhciBjb21wID0ge1xuICogICBjb3VudFdvcmRzIDogZnVuY3Rpb24oKXtcbiAqICAgICBjb25zb2xlLmluZm8odGhpcy5sZW5ndGgpO1xuICogICB9XG4gKiB9O1xuICpcbiAqICAvLyDnlq/ni4Lngrnlh7sgaW5wdXQg77yM5YGc5LiL5p2lIDUwMCBtcyDlkI7vvIzop6blj5Hlh73mlbDosIPnlKhcbiAqICQoJyNpbnB1dCcpLmtleWRvd24oJGRlbGF5KGZ1bmN0aW9uKCl7XG4gKiAgIHRoaXMubGVuZ3RoID0gJCgnI2lucHV0JykudmFsKCkubGVuZ3RoO1xuICogICB0aGlzLmNvdW50V29yZHMoKTtcbiAqIH0sIDUwMCwgY29tcCkpO1xuICovXG5cbmZ1bmN0aW9uIGRlbGF5KGZuLCBkdXJhdGlvbiwgYmluZCkge1xuICB2YXIgdGltZXIgPSBudWxsO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbi5hcHBseShiaW5kLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9LCBkdXJhdGlvbik7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsYXk7XG4iLCIvKipcbiAqIOWHveaVsOWMheijhe+8jOiOt+WPlueJueauiuaJp+ihjOaWueW8j1xuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvZm5cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2ZuXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZm4uZGVsYXkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2ZuXG4gKiB2YXIgJGZuID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mbicpO1xuICogY29uc29sZS5pbmZvKCRmbi5kZWxheSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGRlbGF5ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mbi9kZWxheScpO1xuICovXG5cbmV4cG9ydHMuZGVsYXkgPSByZXF1aXJlKCcuL2RlbGF5Jyk7XG5leHBvcnRzLmxvY2sgPSByZXF1aXJlKCcuL2xvY2snKTtcbmV4cG9ydHMubm9vcCA9IHJlcXVpcmUoJy4vbm9vcCcpO1xuZXhwb3J0cy5vbmNlID0gcmVxdWlyZSgnLi9vbmNlJyk7XG5leHBvcnRzLnF1ZXVlID0gcmVxdWlyZSgnLi9xdWV1ZScpO1xuZXhwb3J0cy5wcmVwYXJlID0gcmVxdWlyZSgnLi9wcmVwYXJlJyk7XG5leHBvcnRzLnJlZ3VsYXIgPSByZXF1aXJlKCcuL3JlZ3VsYXInKTtcbiIsIi8qKlxuICog5YyF6KOF5Li66Kem5Y+R5LiA5qyh5ZCO77yM6aKE572u5pe26Ze05YaF5LiN6IO95YaN5qyh6Kem5Y+R55qE5Ye95pWwXG4gKiAtIOexu+S8vOS6juaKgOiDveWGt+WNtOOAglxuICogQG1ldGhvZCBmbi9sb2NrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDnu4/ov4fljIXoo4XnmoTlhrfljbTop6blj5Hlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxvY2sgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2ZuL2xvY2snKTtcbiAqIHZhciByZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICogICBjb25zb2xlLmluZm8oJ2RvIHJlcXVlc3QnKTtcbiAqIH07XG4gKiAkKCcjaW5wdXQnKS5rZXlkb3duKCRsb2NrKHJlcXVlc3QsIDUwMCkpO1xuICogLy8g56ys5LiA5qyh5oyJ6ZSu77yM5bCx5Lya6Kem5Y+R5LiA5qyh5Ye95pWw6LCD55SoXG4gKiAvLyDkuYvlkI7ov57nu63mjInplK7vvIzku4XlnKggNTAwbXMg57uT5p2f5ZCO5YaN5qyh5oyJ6ZSu77yM5omN5Lya5YaN5qyh6Kem5Y+RIHJlcXVlc3Qg5Ye95pWw6LCD55SoXG4gKi9cblxuZnVuY3Rpb24gbG9jayhmbiwgZGVsYXksIGJpbmQpIHtcbiAgdmFyIHRpbWVyID0gbnVsbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgIH0sIGRlbGF5KTtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbi5hcHBseShiaW5kLCBhcmdzKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9jaztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge307XG4iLCIvKipcbiAqIOWMheijheS4uuS7heinpuWPkeS4gOasoeeahOWHveaVsFxuICogLSDooqvljIXoo4XnmoTlh73mlbDmmbrog73miafooYzkuIDmrKHvvIzkuYvlkI7kuI3kvJrlho3miafooYxcbiAqIEBtZXRob2QgZm4vb25jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDor6Xlh73mlbDku4Xog73op6blj5HmiafooYzkuIDmrKFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG9uY2UgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2ZuL29uY2UnKTtcbiAqIHZhciBmbiA9ICRvbmNlKGZ1bmN0aW9uICgpIHtcbiAqICAgY29uc29sZS5pbmZvKCdvdXRwdXQnKTtcbiAqIH0pO1xuICogZm4oKTsgLy8gJ291dHB1dCdcbiAqIGZuKCk7IC8vIHdpbGwgZG8gbm90aGluZ1xuICovXG5cbmZ1bmN0aW9uIG9uY2UoZm4sIGJpbmQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBiaW5kID0gYmluZCB8fCB0aGlzO1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZuLmFwcGx5KGJpbmQsIGFyZ3VtZW50cyk7XG4gICAgICBmbiA9IG51bGw7XG4gICAgICBiaW5kID0gbnVsbDtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIi8qKlxuICog5YyF6KOF5Li65LiA5Liq5p2h5Lu26Kem5Y+R566h55CG5ZmoXG4gKiAtIOiwg+eUqOeuoeeQhuWZqOeahCByZWFkeSDlh73mlbDmnaXmv4DmtLvmnaHku7bjgIJcbiAqIC0g5LmL5YmN5o+S5YWl566h55CG5Zmo55qE5Ye95pWw5oyJ6Zif5YiX6aG65bqP5omn6KGM44CCXG4gKiAtIOS5i+WQjuaPkuWFpeeuoeeQhuWZqOeahOWHveaVsOeri+WNs+aJp+ihjOOAglxuICogLSDkvZznlKjmnLrliLbnsbvkvLwgalF1ZXJ5LnJlYWR5LCDlj6/ku6Xorr7nva7ku7vkvZXmnaHku7bjgIJcbiAqIEBtb2R1bGUgZm4vcHJlcGFyZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSDmnaHku7bop6blj5HnrqHnkIblmajlh73mlbDvvIzkvKDlhaXkuIDkuKogZnVuY3Rpb24g5L2c5Li65Lu75Yqh5omn6KGM5Ye95pWw5Y+C5pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRwcmVwYXJlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mbi9wcmVwYXJlJyk7XG4gKiAvLyDnlJ/miJDkuIDkuKrnrqHnkIblmajlh73mlbAgdGltZVJlYWR5XG4gKiB2YXIgdGltZVJlYWR5ID0gJHByZXBhcmUoKTtcbiAqXG4gKiAvLyDorr7nva7mnaHku7bkuLoy56eS5ZCO5bCx57uqXG4gKiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAqICAgdGltZVJlYWR5LnJlYWR5KCk7XG4gKiB9LCAyMDAwKTtcbiAqXG4gKiAvLyDosIPnlKjnrqHnkIblmajlh73mlbAgdGltZVJlYWR577yM5o+S5YWl6KaB5omn6KGM55qE5Lu75Yqh5Ye95pWwXG4gKiB0aW1lUmVhZHkoZnVuY3Rpb24gKCkge1xuICogICAvLyAyIOenkuWQjui+k+WHuiAxXG4gKiAgIGNvbnNvbGUuaW5mbygxKTtcbiAqIH0pO1xuICpcbiAqIC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqIHRpbWVSZWFkeShmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIDIg56eS5ZCO6L6T5Ye6IDJcbiAqICAgY29uc29sZS5pbmZvKDIpO1xuICogfSk7XG4gKlxuICogLy8gMjEwMG1zIOWQjuaJp+ihjFxuICogc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIOiwg+eUqOeuoeeQhuWZqOWHveaVsCB0aW1lUmVhZHnvvIzmj5LlhaXopoHmiafooYznmoTku7vliqHlh73mlbBcbiAqICAgdGltZVJlYWR5KGZ1bmN0aW9uICgpIHtcbiAqICAgICAvLyDnq4vljbPmiafooYzvvIzovpPlh7ogM1xuICogICAgIGNvbnNvbGUuaW5mbygzKTtcbiAqICAgfSk7XG4gKiB9LCAyMTAwKTtcbiAqL1xuXG4vKipcbiAqIOa/gOa0u+S7u+WKoeeuoeeQhuWZqOeahOinpuWPkeadoeS7tu+8jOWcqOatpOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOS7u+WKoeaMiemYn+WIl+mhuuW6j+aJp+ihjO+8jOS5i+WQjuaPkuWFpeeahOS7u+WKoeWHveaVsOeri+WNs+aJp+ihjOOAglxuICogQG1ldGhvZCBwcmVwYXJlI3JlYWR5XG4gKiBAbWVtYmVyb2YgcHJlcGFyZVxuICovXG5mdW5jdGlvbiBwcmVwYXJlKCkge1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIGNvbmRpdGlvbiA9IGZhbHNlO1xuICB2YXIgbW9kZWw7XG5cbiAgdmFyIGF0dGFtcHQgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZuKG1vZGVsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcXVldWUucHVzaChmbik7XG4gICAgfVxuICB9O1xuXG4gIGF0dGFtcHQucmVhZHkgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbmRpdGlvbiA9IHRydWU7XG4gICAgbW9kZWwgPSBkYXRhO1xuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZuKG1vZGVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGF0dGFtcHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJlcGFyZTtcbiIsIi8qKlxuICog5YyF6KOF5Li65LiA5Liq6Zif5YiX77yM5oyJ6K6+572u55qE5pe26Ze06Ze06ZqU6Kem5Y+R5Lu75Yqh5Ye95pWwXG4gKiAtIOaPkuWFpemYn+WIl+eahOaJgOacieWHveaVsOmDveS8muaJp+ihjO+8jOS9huavj+asoeaJp+ihjOS5i+mXtOmDveS8muacieS4gOS4quWbuuWumueahOaXtumXtOmXtOmalOOAglxuICogQG1ldGhvZCBmbi9xdWV1ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE6Zif5YiX6Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRxdWV1ZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZm4vcXVldWUnKTtcbiAqIHZhciB0MSA9IERhdGUubm93KCk7XG4gKiB2YXIgZG9Tb210aGluZyA9ICRxdWV1ZShmdW5jdGlvbiAoaW5kZXgpIHtcbiAqICAgY29uc29sZS5pbmZvKGluZGV4ICsgJzonICsgKERhdGUubm93KCkgLSB0MSkpO1xuICogfSwgMjAwKTtcbiAqIC8vIOavj+malDIwMG1z6L6T5Ye65LiA5Liq5pel5b+X44CCXG4gKiBmb3IodmFyIGkgPSAwOyBpIDwgMTA7IGkrKyl7XG4gKiAgIGRvU29tdGhpbmcoaSk7XG4gKiB9XG4gKi9cblxuZnVuY3Rpb24gcXVldWUoZm4sIGRlbGF5LCBiaW5kKSB7XG4gIHZhciB0aW1lciA9IG51bGw7XG4gIHZhciBhcnIgPSBbXTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBiaW5kID0gYmluZCB8fCB0aGlzO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIGFyci5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm4uYXBwbHkoYmluZCwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF0aW1lcikge1xuICAgICAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghYXJyLmxlbmd0aCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcnIuc2hpZnQoKSgpO1xuICAgICAgICB9XG4gICAgICB9LCBkZWxheSk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXVlO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrop4Tlvovop6blj5HnmoTlh73mlbDvvIznlKjkuo7pmY3kvY7lr4bpm4bkuovku7bnmoTlpITnkIbpopHnjodcbiAqIC0g5Zyo55av54uC5pON5L2c5pyf6Ze077yM5oyJ54Wn6KeE5b6L5pe26Ze06Ze06ZqU77yM5p2l6LCD55So5Lu75Yqh5Ye95pWwXG4gKiBAbWV0aG9kIGZuL3JlZ3VsYXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeW7tui/n+inpuWPkeeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5IOW7tui/n+aXtumXtChtcylcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYmluZF0g5Ye95pWw55qEIHRoaXMg5oyH5ZCRXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE5a6a5pe26Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRyZWd1bGFyID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mbi9yZWd1bGFyJyk7XG4gKiB2YXIgY29tcCA9IHtcbiAqICAgY291bnRXb3JkcyA6IGZ1bmN0aW9uKCl7XG4gKiAgICAgY29uc29sZS5pbmZvKHRoaXMubGVuZ3RoKTtcbiAqICAgfVxuICogfTtcbiAqIC8vIOeWr+eLguaMiemUru+8jOavj+malCAyMDBtcyDmiY3mnInkuIDmrKHmjInplK7mnInmlYhcbiAqICQoJyNpbnB1dCcpLmtleWRvd24oJHJlZ3VsYXIoZnVuY3Rpb24oKXtcbiAqICAgdGhpcy5sZW5ndGggPSAkKCcjaW5wdXQnKS52YWwoKS5sZW5ndGg7XG4gKiAgIHRoaXMuY291bnRXb3JkcygpO1xuICogfSwgMjAwLCBjb21wKSk7XG4gKi9cblxuZnVuY3Rpb24gcmVndWxhcihmbiwgZGVsYXksIGJpbmQpIHtcbiAgdmFyIGVuYWJsZSA9IHRydWU7XG4gIHZhciB0aW1lciA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICBlbmFibGUgPSB0cnVlO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIGlmICghdGltZXIpIHtcbiAgICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZm4uYXBwbHkoYmluZCwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbmFibGUpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZW5hYmxlID0gZmFsc2U7XG4gICAgICB9LCBkZWxheSk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ3VsYXI7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wbHVzcGx1cyAqL1xuXG4vKipcbiAqIOeugOWNleeahCBFYXNpbmcgRnVuY3Rpb25zXG4gKiAtIOWAvOWfn+WPmOWMluiMg+WbtO+8jOS7jiBbMCwgMV0g5YiwIFswLCAxXVxuICogLSDljbPovpPlhaXlgLzojIPlm7Tku44gMCDliLAgMVxuICogLSDovpPlh7rkuZ/kuLrku44gMCDliLAgMVxuICogLSDpgILlkIjov5vooYznmb7liIbmr5TliqjnlLvov5DnrpdcbiAqXG4gKiDliqjnlLvlh73mlbBcbiAqIC0gbGluZWFyXG4gKiAtIGVhc2VJblF1YWRcbiAqIC0gZWFzZU91dFF1YWRcbiAqIC0gZWFzZUluT3V0UXVhZFxuICogLSBlYXNlSW5DdWJpY1xuICogLSBlYXNlSW5RdWFydFxuICogLSBlYXNlT3V0UXVhcnRcbiAqIC0gZWFzZUluT3V0UXVhcnRcbiAqIC0gZWFzZUluUXVpbnRcbiAqIC0gZWFzZU91dFF1aW50XG4gKiAtIGVhc2VJbk91dFF1aW50XG4gKiBAbW9kdWxlIGZ4L2Vhc2luZ1xuICogQHNlZSBbZWFzaW5nLmpzXShodHRwczovL2dpc3QuZ2l0aHViLmNvbS9ncmUvMTY1MDI5NClcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVhc2luZyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZWFzaW5nJyk7XG4gKiAkZWFzaW5nLmxpbmVhcigwLjUpOyAvLyAwLjVcbiAqICRlYXNpbmcuZWFzZUluUXVhZCgwLjUpOyAvLyAwLjI1XG4gKiAkZWFzaW5nLmVhc2VJbkN1YmljKDAuNSk7IC8vIDAuMTI1XG4gKi9cbnZhciBlYXNpbmcgPSB7XG4gIC8vIG5vIGVhc2luZywgbm8gYWNjZWxlcmF0aW9uXG4gIGxpbmVhcjogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdDtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuICBlYXNlSW5RdWFkOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0ICogdDtcbiAgfSxcbiAgLy8gZGVjZWxlcmF0aW5nIHRvIHplcm8gdmVsb2NpdHlcbiAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgKiAoMiAtIHQpO1xuICB9LFxuICAvLyBhY2NlbGVyYXRpb24gdW50aWwgaGFsZndheSwgdGhlbiBkZWNlbGVyYXRpb25cbiAgZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDIgKiB0ICogdCA6IC0xICsgKDQgLSAyICogdCkgKiB0O1xuICB9LFxuICAvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VJbkN1YmljOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0ICogdCAqIHQ7XG4gIH0sXG4gIC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gKC0tdCkgKiB0ICogdCArIDE7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDQgKiB0ICogdCAqIHQgOiAodCAtIDEpICogKDIgKiB0IC0gMikgKiAoMiAqIHQgLSAyKSArIDE7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHlcbiAgZWFzZUluUXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdCAqIHQ7XG4gIH0sXG4gIC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gMSAtICgtLXQpICogdCAqIHQgKiB0O1xuICB9LFxuICAvLyBhY2NlbGVyYXRpb24gdW50aWwgaGFsZndheSwgdGhlbiBkZWNlbGVyYXRpb25cbiAgZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyA4ICogdCAqIHQgKiB0ICogdCA6IDEgLSA4ICogKC0tdCkgKiB0ICogdCAqIHQ7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHlcbiAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdCAqIHQgKiB0O1xuICB9LFxuICAvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuICBlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIDEgKyAoLS10KSAqIHQgKiB0ICogdCAqIHQ7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGlvbiB1bnRpbCBoYWxmd2F5LCB0aGVuIGRlY2VsZXJhdGlvblxuICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDE2ICogdCAqIHQgKiB0ICogdCAqIHQgOiAxICsgMTYgKiAoLS10KSAqIHQgKiB0ICogdCAqIHQ7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2luZztcbiIsIi8qKlxuICog5bCB6KOF6Zeq54OB5Yqo5L2cXG4gKiBAbWV0aG9kIGZ4L2ZsYXNoQWN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyDpgInpoblcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy50aW1lcz0zXSDpl6rng4HmrKHmlbDvvIzpu5jorqQz5qyhXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZGVsYXk9MTAwXSDpl6rng4Hpl7TpmpTml7bpl7QobXMpXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5hY3Rpb25PZGRdIOWlh+aVsOWbnuiwg1xuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMuYWN0aW9uRXZlbl0g5YG25pWw5Zue6LCDXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5yZWNvdmVyXSDnirbmgIHmgaLlpI3lm57osINcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZsYXNoQWN0aW9uID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9mbGFzaEFjdGlvbicpO1xuICogLy8g5paH5a2X6Zeq54OB77yM5aWH5pWw5qyh5ZGI546w5Li657qi6Imy77yM5YG25pWw5qyh5oiQ57qk57u06JOd6Imy77yM5Yqo55S757uT5p2f5ZGI546w5Li66buR6ImyXG4gKiB2YXIgdGV4dCA9ICQoJyN0YXJnZXQgc3Bhbi50eHQnKTtcbiAqICRmbGFzaEFjdGlvbih7XG4gKiAgIGFjdGlvbk9kZCA6IGZ1bmN0aW9uICgpe1xuICogICAgIHRleHQuY3NzKCdjb2xvcicsICcjZjAwJyk7XG4gKiAgIH0sXG4gKiAgIGFjdGlvbkV2ZW4gOiBmdW5jdGlvbiAoKXtcbiAqICAgICB0ZXh0LmNzcygnY29sb3InLCAnIzAwZicpO1xuICogICB9LFxuICogICByZWNvdmVyIDogZnVuY3Rpb24gKCl7XG4gKiAgICAgdGV4dC5jc3MoJ2NvbG9yJywgJyMwMDAnKTtcbiAqICAgfVxuICogfSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG5mdW5jdGlvbiBmbGFzaEFjdGlvbihvcHRpb25zKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgdGltZXM6IDMsXG4gICAgZGVsYXk6IDEwMCxcbiAgICBhY3Rpb25PZGQ6IG51bGwsXG4gICAgYWN0aW9uRXZlbjogbnVsbCxcbiAgICByZWNvdmVyOiBudWxsLFxuICB9LCBvcHRpb25zKTtcblxuICB2YXIgcXVldWUgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25mLnRpbWVzICogMiArIDE7IGkgKz0gMSkge1xuICAgIHF1ZXVlLnB1c2goKGkgKyAxKSAqIGNvbmYuZGVsYXkpO1xuICB9XG5cbiAgcXVldWUuZm9yRWFjaChmdW5jdGlvbiAodGltZSwgaW5kZXgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpbmRleCA+PSBxdWV1ZS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZi5yZWNvdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29uZi5yZWNvdmVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggJSAyID09PSAwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZi5hY3Rpb25FdmVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29uZi5hY3Rpb25FdmVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmYuYWN0aW9uT2RkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbmYuYWN0aW9uT2RkKCk7XG4gICAgICB9XG4gICAgfSwgdGltZSk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXNoQWN0aW9uO1xuIiwiLyoqXG4gKiDliqjnlLvnsbsgLSDnlKjkuo7lpITnkIbkuI3pgILlkIjkvb/nlKggdHJhbnNpdGlvbiDnmoTliqjnlLvlnLrmma9cbiAqXG4gKiDlj6/nu5HlrprnmoTkuovku7ZcbiAqIC0gc3RhcnQg5Yqo55S75byA5aeL5pe26Kem5Y+RXG4gKiAtIGNvbXBsZXRlIOWKqOeUu+W3suWujOaIkFxuICogLSBzdG9wIOWKqOeUu+WwmuacquWujOaIkOWwseiiq+S4reaWrVxuICogLSBjYW5jZWwg5Yqo55S76KKr5Y+W5raIXG4gKiBAY2xhc3MgZngvRnhcbiAqIEBzZWUgW21vb3Rvb2xzL0Z4XShodHRwczovL21vb3Rvb2xzLm5ldC9jb3JlL2RvY3MvMS42LjAvRngvRngpXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g5Yqo55S76YCJ6aG5XG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnBzPTYwXSDluKfpgJ/njocoZi9zKe+8jOWunumZheS4iuWKqOeUu+i/kOihjOeahOacgOmrmOW4p+mAn+eOh+S4jeS8mumrmOS6jiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg5o+Q5L6b55qE5bin6YCf546HXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZHVyYXRpb249NTAwXSDliqjnlLvmjIHnu63ml7bpl7QobXMpXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gW29wdGlvbnMudHJhbnNpdGlvbl0g5Yqo55S75omn6KGM5pa55byP77yM5Y+C6KeBIFtmeC90cmFuc2l0aW9uc10oI2Z4LXRyYW5zaXRpb25zKVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lc10g5LuO5ZOq5LiA5bin5byA5aeL5omn6KGMXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZyYW1lU2tpcD10cnVlXSDmmK/lkKbot7PluKdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5saW5rPSdpZ25vcmUnXSDliqjnlLvooZTmjqXmlrnlvI/vvIzlj6/pgInvvJpbJ2lnbm9yZScsICdjYW5jZWwnXVxuICogQGV4YW1wbGVcbiAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gKiB2YXIgZnggPSBuZXcgJGZ4KHtcbiAqICAgZHVyYXRpb24gOiAxMDAwXG4gKiB9KTtcbiAqIGZ4LnNldCA9IGZ1bmN0aW9uIChub3cpIHtcbiAqICAgbm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gbm93ICsgJ3B4JztcbiAqIH07XG4gKiBmeC5vbignY29tcGxldGUnLCBmdW5jdGlvbigpe1xuICogICBjb25zb2xlLmluZm8oJ2FuaW1hdGlvbiBlbmQnKTtcbiAqIH0pO1xuICogZnguc3RhcnQoMCwgNjAwKTsgLy8gMeenkuWGheaVsOWtl+S7jjDlop7liqDliLA2MDBcbiAqL1xuXG52YXIgJGtsYXNzID0gcmVxdWlyZSgnLi4vbXZjL2tsYXNzJyk7XG52YXIgJGV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2dC9ldmVudHMnKTtcbnZhciAkZXJhc2UgPSByZXF1aXJlKCcuLi9hcnIvZXJhc2UnKTtcbnZhciAkY29udGFpbnMgPSByZXF1aXJlKCcuLi9hcnIvY29udGFpbnMnKTtcbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICR0aW1lciA9IHJlcXVpcmUoJy4vdGltZXInKTtcblxuLy8gZ2xvYmFsIHRpbWVyc1xuLy8g5L2/55So5YWs5YWx5a6a5pe25Zmo5Y+v5Lul5YeP5bCR5rWP6KeI5Zmo6LWE5rqQ5raI6ICXXG52YXIgaW5zdGFuY2VzID0ge307XG52YXIgdGltZXJzID0ge307XG5cbnZhciBsb29wID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoOyBpID49IDA7IGkgLT0gMSkge1xuICAgIHZhciBpbnN0YW5jZSA9IHRoaXNbaV07XG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICBpbnN0YW5jZS5zdGVwKG5vdyk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgcHVzaEluc3RhbmNlID0gZnVuY3Rpb24gKGZwcykge1xuICB2YXIgbGlzdCA9IGluc3RhbmNlc1tmcHNdIHx8IChpbnN0YW5jZXNbZnBzXSA9IFtdKTtcbiAgbGlzdC5wdXNoKHRoaXMpO1xuICBpZiAoIXRpbWVyc1tmcHNdKSB7XG4gICAgdmFyIGxvb3BNZXRob2QgPSBsb29wLmJpbmQobGlzdCk7XG4gICAgdmFyIGxvb3BEdXIgPSBNYXRoLnJvdW5kKDEwMDAgLyBmcHMpO1xuICAgIHRpbWVyc1tmcHNdID0gJHRpbWVyLnNldEludGVydmFsKGxvb3BNZXRob2QsIGxvb3BEdXIpO1xuICB9XG59O1xuXG52YXIgcHVsbEluc3RhbmNlID0gZnVuY3Rpb24gKGZwcykge1xuICB2YXIgbGlzdCA9IGluc3RhbmNlc1tmcHNdO1xuICBpZiAobGlzdCkge1xuICAgICRlcmFzZShsaXN0LCB0aGlzKTtcbiAgICBpZiAoIWxpc3QubGVuZ3RoICYmIHRpbWVyc1tmcHNdKSB7XG4gICAgICBkZWxldGUgaW5zdGFuY2VzW2Zwc107XG4gICAgICB0aW1lcnNbZnBzXSA9ICR0aW1lci5jbGVhckludGVydmFsKHRpbWVyc1tmcHNdKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBGeCA9ICRrbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJGFzc2lnbih7XG4gICAgICBmcHM6IDYwLFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIHRyYW5zaXRpb246IG51bGwsXG4gICAgICBmcmFtZXM6IG51bGwsXG4gICAgICBmcmFtZVNraXA6IHRydWUsXG4gICAgICBsaW5rOiAnaWdub3JlJyxcbiAgICB9LCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICog6K6+572u5a6e5L6L55qE6YCJ6aG5XG4gICAqIEBtZXRob2QgRngjc2V0T3B0aW9uc1xuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5Yqo55S76YCJ6aG5XG4gICAqL1xuICBzZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXMuY29uZiA9ICRhc3NpZ24oe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiuvue9ruWKqOeUu+eahOaJp+ihjOaWueW8j++8jOmFjee9rue8k+WKqOaViOaenFxuICAgKiBAaW50ZXJmYWNlIEZ4I2dldFRyYW5zaXRpb25cbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguZ2V0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICogICByZXR1cm4gZnVuY3Rpb24gKHApIHtcbiAgICogICAgIHJldHVybiAtKE1hdGguY29zKE1hdGguUEkgKiBwKSAtIDEpIC8gMjtcbiAgICogICB9O1xuICAgKiB9O1xuICAgKi9cbiAgZ2V0VHJhbnNpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIC0oTWF0aC5jb3MoTWF0aC5QSSAqIHApIC0gMSkgLyAyO1xuICAgIH07XG4gIH0sXG5cbiAgc3RlcDogZnVuY3Rpb24gKG5vdykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZnJhbWVTa2lwKSB7XG4gICAgICB2YXIgZGlmZiA9IHRoaXMudGltZSAhPSBudWxsID8gbm93IC0gdGhpcy50aW1lIDogMDtcbiAgICAgIHZhciBmcmFtZXMgPSBkaWZmIC8gdGhpcy5mcmFtZUludGVydmFsO1xuICAgICAgdGhpcy50aW1lID0gbm93O1xuICAgICAgdGhpcy5mcmFtZSArPSBmcmFtZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJhbWUgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mcmFtZSA8IHRoaXMuZnJhbWVzKSB7XG4gICAgICB2YXIgZGVsdGEgPSB0aGlzLnRyYW5zaXRpb24odGhpcy5mcmFtZSAvIHRoaXMuZnJhbWVzKTtcbiAgICAgIHRoaXMuc2V0KHRoaXMuY29tcHV0ZSh0aGlzLmZyb20sIHRoaXMudG8sIGRlbHRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJhbWUgPSB0aGlzLmZyYW1lcztcbiAgICAgIHRoaXMuc2V0KHRoaXMuY29tcHV0ZSh0aGlzLmZyb20sIHRoaXMudG8sIDEpKTtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICog6K6+572u5b2T5YmN5Yqo55S75bin55qE6L+H5rih5pWw5YC8XG4gICAqIEBpbnRlcmZhY2UgRngjc2V0XG4gICAqIEBtZW1iZXJvZiBmeC9GeFxuICAgKiBAcGFyYW0ge051bWJlcn0gbm93IOW9k+WJjeWKqOeUu+W4p+eahOi/h+a4oeaVsOWAvFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9meCcpO1xuICAgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG4gICAqIGZ4LnNldCA9IGZ1bmN0aW9uIChub3cpIHtcbiAgICogICBub2RlLnN0eWxlLm1hcmdpbkxlZnQgPSBub3cgKyAncHgnO1xuICAgKiB9O1xuICAgKi9cbiAgc2V0OiBmdW5jdGlvbiAobm93KSB7XG4gICAgcmV0dXJuIG5vdztcbiAgfSxcblxuICBjb21wdXRlOiBmdW5jdGlvbiAoZnJvbSwgdG8sIGRlbHRhKSB7XG4gICAgcmV0dXJuIEZ4LmNvbXB1dGUoZnJvbSwgdG8sIGRlbHRhKTtcbiAgfSxcblxuICBjaGVjazogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc1J1bm5pbmcoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMubGluayA9PT0gJ2NhbmNlbCcpIHtcbiAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiDlvIDlp4vmiafooYzliqjnlLtcbiAgICogQG1ldGhvZCBGeCNzdGFydFxuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb20g5Yqo55S75byA5aeL5pWw5YC8XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0byDliqjnlLvnu5PmnZ/mlbDlgLxcbiAgICogQGV4YW1wbGVcbiAgICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpOyAvLyDlvIDlp4vliqjnlLtcbiAgICovXG4gIHN0YXJ0OiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICBpZiAoIXRoaXMuY2hlY2soZnJvbSwgdG8pKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy5mcm9tID0gZnJvbTtcbiAgICB0aGlzLnRvID0gdG87XG4gICAgdGhpcy5mcmFtZSA9IHRoaXMub3B0aW9ucy5mcmFtZVNraXAgPyAwIDogLTE7XG4gICAgdGhpcy50aW1lID0gbnVsbDtcbiAgICB0aGlzLnRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24oKTtcbiAgICB2YXIgZnJhbWVzID0gdGhpcy5vcHRpb25zLmZyYW1lcztcbiAgICB2YXIgZnBzID0gdGhpcy5vcHRpb25zLmZwcztcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLm9wdGlvbnMuZHVyYXRpb247XG4gICAgdGhpcy5kdXJhdGlvbiA9IEZ4LkR1cmF0aW9uc1tkdXJhdGlvbl0gfHwgcGFyc2VJbnQoZHVyYXRpb24sIDEwKSB8fCAwO1xuICAgIHRoaXMuZnJhbWVJbnRlcnZhbCA9IDEwMDAgLyBmcHM7XG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXMgfHwgTWF0aC5yb3VuZCh0aGlzLmR1cmF0aW9uIC8gdGhpcy5mcmFtZUludGVydmFsKTtcbiAgICB0aGlzLnRyaWdnZXIoJ3N0YXJ0Jyk7XG4gICAgcHVzaEluc3RhbmNlLmNhbGwodGhpcywgZnBzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICog5YGc5q2i5Yqo55S7XG4gICAqIEBtZXRob2QgRngjc3RvcFxuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQGV4YW1wbGVcbiAgICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5zdG9wKCk7IC8vIOeri+WIu+WBnOatouWKqOeUu1xuICAgKi9cbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICB0aGlzLnRpbWUgPSBudWxsO1xuICAgICAgcHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgICBpZiAodGhpcy5mcmFtZXMgPT09IHRoaXMuZnJhbWUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdjb21wbGV0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzdG9wJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDlj5bmtojliqjnlLtcbiAgICogQG1ldGhvZCBGeCNjYW5jZWxcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTtcbiAgICogZnguY2FuY2VsKCk7IC8vIOeri+WIu+WPlua2iOWKqOeUu1xuICAgKi9cbiAgY2FuY2VsOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHRoaXMudGltZSA9IG51bGw7XG4gICAgICBwdWxsSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcbiAgICAgIHRoaXMuZnJhbWUgPSB0aGlzLmZyYW1lcztcbiAgICAgIHRoaXMudHJpZ2dlcignY2FuY2VsJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmmoLlgZzliqjnlLtcbiAgICogQG1ldGhvZCBGeCNwYXVzZVxuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQGV4YW1wbGVcbiAgICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5wYXVzZSgpOyAvLyDnq4vliLvmmoLlgZzliqjnlLtcbiAgICovXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHRoaXMudGltZSA9IG51bGw7XG4gICAgICBwdWxsSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOe7p+e7reaJp+ihjOWKqOeUu1xuICAgKiBAbWV0aG9kIEZ4I3Jlc3VtZVxuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQGV4YW1wbGVcbiAgICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5wYXVzZSgpO1xuICAgKiBmeC5yZXN1bWUoKTsgLy8g56uL5Yi757un57ut5Yqo55S7XG4gICAqL1xuICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5mcmFtZSA8IHRoaXMuZnJhbWVzICYmICF0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICBwdXNoSW5zdGFuY2UuY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZnBzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOWIpOaWreWKqOeUu+aYr+WQpuato+WcqOi/kOihjFxuICAgKiBAbWV0aG9kIEZ4I2lzUnVubmluZ1xuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQHJldHVybnMge0Jvb2xlYW59IOWKqOeUu+aYr+WQpuato+WcqOi/kOihjFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9meCcpO1xuICAgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG4gICAqIGZ4LnN0YXJ0KCk7XG4gICAqIGZ4LnBhdXNlKCk7XG4gICAqIGZ4LmlzUnVubmluZygpOyAvLyBmYWxzZVxuICAgKi9cbiAgaXNSdW5uaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxpc3QgPSBpbnN0YW5jZXNbdGhpcy5vcHRpb25zLmZwc107XG4gICAgcmV0dXJuIGxpc3QgJiYgJGNvbnRhaW5zKGxpc3QsIHRoaXMpO1xuICB9LFxufSk7XG5cbiRldmVudHMubWl4VG8oRngpO1xuXG5GeC5jb21wdXRlID0gZnVuY3Rpb24gKGZyb20sIHRvLCBkZWx0YSkge1xuICByZXR1cm4gKHRvIC0gZnJvbSkgKiBkZWx0YSArIGZyb207XG59O1xuXG5GeC5EdXJhdGlvbnMgPSB7IHNob3J0OiAyNTAsIG5vcm1hbDogNTAwLCBsb25nOiAxMDAwIH07XG5cbm1vZHVsZS5leHBvcnRzID0gRng7XG4iLCIvKipcbiAqIOWKqOeUu+S6pOS6kuebuOWFs+W3peWFt1xuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvZnhcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2Z4XG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuZnguc21vb3RoU2Nyb2xsVG8pO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4XG4gKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meCcpO1xuICogY29uc29sZS5pbmZvKCRmeC5zbW9vdGhTY3JvbGxUbyk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9zbW9vdGhTY3JvbGxUbycpO1xuICovXG5cbmV4cG9ydHMuZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcnKTtcbmV4cG9ydHMuZmxhc2hBY3Rpb24gPSByZXF1aXJlKCcuL2ZsYXNoQWN0aW9uJyk7XG5leHBvcnRzLkZ4ID0gcmVxdWlyZSgnLi9meCcpO1xuZXhwb3J0cy5zbW9vdGhTY3JvbGxUbyA9IHJlcXVpcmUoJy4vc21vb3RoU2Nyb2xsVG8nKTtcbmV4cG9ydHMuc3RpY2t5ID0gcmVxdWlyZSgnLi9zdGlja3knKTtcbmV4cG9ydHMudGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJyk7XG5leHBvcnRzLnRyYW5zaXRpb25zID0gcmVxdWlyZSgnLi90cmFuc2l0aW9ucycpO1xuIiwiLyoqXG4gKiDlubPmu5Hmu5rliqjliLDmn5DkuKrlhYPntKDvvIzlj6rov5vooYzlnoLnm7TmlrnlkJHnmoTmu5rliqhcbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAbWV0aG9kIGZ4L3Ntb290aFNjcm9sbFRvXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnm67moIdET03lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOmAiemhuVxuICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVjLmRlbHRhPTBdIOebruagh+a7muWKqOS9jee9ruS4juebruagh+WFg+e0oOmhtumDqOeahOmXtOi3ne+8jOWPr+S7peS4uui0n+WAvFxuICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVjLm1heERlbGF5PTMwMDBdIOWKqOeUu+aJp+ihjOaXtumXtOmZkOWItihtcynvvIzliqjnlLvmiafooYzotoXov4fmraTml7bpl7TliJnnm7TmjqXlgZzmraLvvIznq4vliLvmu5rliqjliLDnm67moIfkvY3nva5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmNhbGxiYWNrXSDmu5rliqjlrozmiJDnmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNtb290aFNjcm9sbFRvID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9zbW9vdGhTY3JvbGxUbycpO1xuICogLy8g5rua5Yqo5Yiw6aG16Z2i6aG256uvXG4gKiAkc21vb3RoU2Nyb2xsVG8oZG9jdW1lbnQuYm9keSk7XG4gKi9cblxudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbmZ1bmN0aW9uIHNtb290aFNjcm9sbFRvKG5vZGUsIHNwZWMpIHtcbiAgdmFyICQgPSB3aW5kb3cuJCB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcblxuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIGRlbHRhOiAwLFxuICAgIG1heERlbGF5OiAzMDAwLFxuICAgIGNhbGxiYWNrOiBudWxsLFxuICB9LCBzcGVjKTtcblxuICB2YXIgb2Zmc2V0ID0gJChub2RlKS5vZmZzZXQoKTtcbiAgdmFyIHRhcmdldCA9IG9mZnNldC50b3AgKyBjb25mLmRlbHRhO1xuICB2YXIgY2FsbGJhY2sgPSBjb25mLmNhbGxiYWNrO1xuXG4gIHZhciBwcmV2U3RlcDtcbiAgdmFyIHN0YXlDb3VudCA9IDM7XG5cbiAgdmFyIHRpbWVyID0gbnVsbDtcblxuICB2YXIgc3RvcFRpbWVyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICB0aW1lciA9IG51bGw7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgdGFyZ2V0KTtcbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBkZWx0YSA9IHNUb3AgLSB0YXJnZXQ7XG4gICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgZGVsdGEgPSBNYXRoLmZsb29yKGRlbHRhICogMC44KTtcbiAgICB9IGVsc2UgaWYgKGRlbHRhIDwgMCkge1xuICAgICAgZGVsdGEgPSBNYXRoLmNlaWwoZGVsdGEgKiAwLjgpO1xuICAgIH1cblxuICAgIHZhciBzdGVwID0gdGFyZ2V0ICsgZGVsdGE7XG4gICAgaWYgKHN0ZXAgPT09IHByZXZTdGVwKSB7XG4gICAgICBzdGF5Q291bnQgLT0gMTtcbiAgICB9XG4gICAgcHJldlN0ZXAgPSBzdGVwO1xuXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHN0ZXApO1xuXG4gICAgaWYgKHN0ZXAgPT09IHRhcmdldCB8fCBzdGF5Q291bnQgPD0gMCkge1xuICAgICAgc3RvcFRpbWVyKCk7XG4gICAgfVxuICB9LCAxNik7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgc3RvcFRpbWVyKCk7XG4gIH0sIGNvbmYubWF4RGVsYXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNtb290aFNjcm9sbFRvO1xuIiwiLyoqXG4gKiBJT1Mgc3RpY2t5IOaViOaenCBwb2x5ZmlsbFxuICogLSByZXF1aXJlcyBqUXVlcnkvWmVwdG9cbiAqIEBtZXRob2QgZngvc3RpY2t5XG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnm67moIdET03lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jbG9uZT10cnVlXSDmmK/lkKbliJvlu7rkuIDkuKogY2xvbmUg5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucGxhY2Vob2xkZXI9bnVsbF0gc3RpY2t5IOaViOaenOWQr+WKqOaXtueahOWNoOS9jSBkb20g5YWD57SgXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmRpc2FibGVBbmRyb2lkPWZhbHNlXSDmmK/lkKblnKggQW5kcm9pZCDkuIvlgZznlKggc3RpY2t5IOaViOaenFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9mZnNldFBhcmVudD1udWxsXSDmj5DkvpvkuIDkuKrnm7jlr7nlrprkvY3lhYPntKDmnaXljLnphY3mta7liqjml7bnmoTlrprkvY3moLflvI9cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdHlsZXM9e31dIOi/m+WFpSBzdGlja3kg54q25oCB5pe255qE5qC35byPXG4gKiBAZXhhbXBsZVxuICogdmFyICRzdGlja3kgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L3N0aWNreScpO1xuICogJHN0aWNreSgkKCdoMScpLmdldCgwKSk7XG4gKi9cblxuZnVuY3Rpb24gc3RpY2t5KG5vZGUsIG9wdGlvbnMpIHtcbiAgdmFyICQgPSB3aW5kb3cuJCB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeTtcblxuICB2YXIgJHdpbiA9ICQod2luZG93KTtcbiAgdmFyICRkb2MgPSAkKGRvY3VtZW50KTtcblxuICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICB2YXIgaXNJT1MgPSAhIXVhLm1hdGNoKC9cXChpW147XSs7KCBVOyk/IENQVS4rTWFjIE9TIFgvaSk7XG4gIHZhciBpc0FuZHJvaWQgPSB1YS5pbmRleE9mKCdBbmRyb2lkJykgPiAtMSB8fCB1YS5pbmRleE9mKCdMaW51eCcpID4gLTE7XG5cbiAgdmFyIHRoYXQgPSB7fTtcbiAgdGhhdC5pc0lPUyA9IGlzSU9TO1xuICB0aGF0LmlzQW5kcm9pZCA9IGlzQW5kcm9pZDtcblxuICB2YXIgY29uZiA9ICQuZXh0ZW5kKHtcbiAgICBjbG9uZTogdHJ1ZSxcbiAgICBwbGFjZWhvbGRlcjogbnVsbCxcbiAgICBkaXNhYmxlQW5kcm9pZDogZmFsc2UsXG4gICAgb2Zmc2V0UGFyZW50OiBudWxsLFxuICAgIHN0eWxlczoge30sXG4gIH0sIG9wdGlvbnMpO1xuXG4gIHRoYXQucm9vdCA9ICQobm9kZSk7XG5cbiAgaWYgKCF0aGF0LnJvb3QuZ2V0KDApKSB7IHJldHVybjsgfVxuICB0aGF0Lm9mZnNldFBhcmVudCA9IHRoYXQucm9vdC5vZmZzZXRQYXJlbnQoKTtcblxuICBpZiAoY29uZi5vZmZzZXRQYXJlbnQpIHtcbiAgICB0aGF0Lm9mZnNldFBhcmVudCA9ICQoY29uZi5vZmZzZXRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKCF0aGF0Lm9mZnNldFBhcmVudFswXSkge1xuICAgIHRoYXQub2Zmc2V0UGFyZW50ID0gJChkb2N1bWVudC5ib2R5KTtcbiAgfVxuXG4gIHRoYXQuaXNTdGlja3kgPSBmYWxzZTtcblxuICBpZiAoY29uZi5wbGFjZWhvbGRlcikge1xuICAgIHRoYXQucGxhY2Vob2xkZXIgPSAkKGNvbmYucGxhY2Vob2xkZXIpO1xuICB9IGVsc2Uge1xuICAgIHRoYXQucGxhY2Vob2xkZXIgPSAkKCc8ZGl2Lz4nKTtcbiAgfVxuXG4gIGlmIChjb25mLmNsb25lKSB7XG4gICAgdGhhdC5jbG9uZSA9IHRoYXQucm9vdC5jbG9uZSgpO1xuICAgIHRoYXQuY2xvbmUuYXBwZW5kVG8odGhhdC5wbGFjZWhvbGRlcik7XG4gIH1cblxuICB0aGF0LnBsYWNlaG9sZGVyLmNzcyh7XG4gICAgdmlzaWJpbGl0eTogJ2hpZGRlbicsXG4gIH0pO1xuXG4gIHRoYXQuc3RpY2t5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhhdC5pc1N0aWNreSkge1xuICAgICAgdGhhdC5pc1N0aWNreSA9IHRydWU7XG4gICAgICB0aGF0LnJvb3QuY3NzKCdwb3NpdGlvbicsICdmaXhlZCcpO1xuICAgICAgdGhhdC5yb290LmNzcyhjb25mLnN0eWxlcyk7XG4gICAgICB0aGF0LnBsYWNlaG9sZGVyLmluc2VydEJlZm9yZSh0aGF0LnJvb3QpO1xuICAgIH1cbiAgfTtcblxuICB0aGF0LnVuU3RpY2t5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGF0LmlzU3RpY2t5KSB7XG4gICAgICB0aGF0LmlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICB0aGF0LnBsYWNlaG9sZGVyLnJlbW92ZSgpO1xuICAgICAgdGhhdC5yb290LmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgICAkLmVhY2goY29uZi5zdHlsZXMsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdGhhdC5yb290LmNzcyhrZXksICcnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb3JpZ09mZnNldFkgPSB0aGF0LnJvb3QuZ2V0KDApLm9mZnNldFRvcDtcbiAgdGhhdC5jaGVja1Njcm9sbFkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGF0LmlzU3RpY2t5KSB7XG4gICAgICBvcmlnT2Zmc2V0WSA9IHRoYXQucm9vdC5nZXQoMCkub2Zmc2V0VG9wO1xuICAgIH1cblxuICAgIHZhciBzY3JvbGxZID0gMDtcbiAgICBpZiAodGhhdC5vZmZzZXRQYXJlbnQuZ2V0KDApID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjcm9sbFkgPSB0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkuc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIGlmIChzY3JvbGxZID4gb3JpZ09mZnNldFkpIHtcbiAgICAgIHRoYXQuc3RpY2t5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQudW5TdGlja3koKTtcbiAgICB9XG5cbiAgICBpZiAodGhhdC5pc1N0aWNreSkge1xuICAgICAgdGhhdC5yb290LmNzcyh7XG4gICAgICAgIHdpZHRoOiB0aGF0LnBsYWNlaG9sZGVyLndpZHRoKCkgKyAncHgnLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQucm9vdC5jc3Moe1xuICAgICAgICB3aWR0aDogJycsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdGhhdC5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0FuZHJvaWQgJiYgY29uZi5kaXNhYmxlQW5kcm9pZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNJT1MgJiYgdGhhdC5vZmZzZXRQYXJlbnQuZ2V0KDApID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAvLyBJT1M5KyDmlK/mjIEgcG9zaXRpb246c3RpY2t5IOWxnuaAp1xuICAgICAgdGhhdC5yb290LmNzcygncG9zaXRpb24nLCAnc3RpY2t5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOS4gOiIrOa1j+iniOWZqOebtOaOpeaUr+aMgVxuICAgICAgaWYgKHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKSA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAkd2luLm9uKCdzY3JvbGwnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0Lm9mZnNldFBhcmVudC5vbignc2Nyb2xsJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuICAgICAgfVxuXG4gICAgICAkd2luLm9uKCdyZXNpemUnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG4gICAgICAkZG9jLm9uKCd0b3VjaHN0YXJ0JywgdGhhdC5jaGVja1Njcm9sbFkpO1xuICAgICAgJGRvYy5vbigndG91Y2htb3ZlJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuICAgICAgJGRvYy5vbigndG91Y2hlbmQnLCB0aGF0LmNoZWNrU2Nyb2xsWSk7XG4gICAgICB0aGF0LmNoZWNrU2Nyb2xsWSgpO1xuICAgIH1cbiAgfTtcblxuICB0aGF0LmluaXQoKTtcbiAgcmV0dXJuIHRoYXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RpY2t5O1xuIiwiLyoqXG4gKiDnlKggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOWMheijheWumuaXtuWZqFxuICogLSDlpoLmnpzmtY/op4jlmajkuI3mlK/mjIEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEFQSe+8jOWImeS9v+eUqCBCT00g5Y6f5pys55qE5a6a5pe25ZmoQVBJXG4gKiBAbW9kdWxlIGZ4L3RpbWVyXG4gKiBAZXhhbXBsZVxuICogdmFyICR0aW1lciA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvdGltZXInKTtcbiAqICR0aW1lci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAqICAgY29uc29sZS5pbmZvKCdvdXRwdXQgdGhpcyBsb2cgYWZ0ZXIgMTAwMG1zJyk7XG4gKiB9LCAxMDAwKTtcbiAqL1xuXG52YXIgVGltZXIgPSB7fTtcblxudmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxuZnVuY3Rpb24gZmFjdG9yeShtZXRob2ROYW1lKSB7XG4gIHZhciB3cmFwcGVkTWV0aG9kID0gbnVsbDtcblxuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcbiAgdmFyIHdpbiA9IHdpbmRvdztcblxuICAvLyDlpoLmnpzmnInlr7nlupTlkI3np7DnmoTmlrnms5XvvIznm7TmjqXov5Tlm57or6Xmlrnms5XvvIzlkKbliJnov5Tlm57luKbmnInlr7nlupTmtY/op4jlmajliY3nvIDnmoTmlrnms5VcbiAgdmFyIGdldFByZWZpeE1ldGhvZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHVwRmlyc3ROYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpO1xuICAgIHZhciBtZXRob2QgPSB3aW5bbmFtZV1cbiAgICAgIHx8IHdpblsnd2Via2l0JyArIHVwRmlyc3ROYW1lXVxuICAgICAgfHwgd2luWydtb3onICsgdXBGaXJzdE5hbWVdXG4gICAgICB8fCB3aW5bJ28nICsgdXBGaXJzdE5hbWVdXG4gICAgICB8fCB3aW5bJ21zJyArIHVwRmlyc3ROYW1lXTtcbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKHdpbik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHZhciBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGdldFByZWZpeE1ldGhvZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJyk7XG4gIHZhciBsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lID0gZ2V0UHJlZml4TWV0aG9kKCdjYW5jZWxBbmltYXRpb25GcmFtZScpIHx8IG5vb3A7XG5cbiAgaWYgKGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgdmFyIGNsZWFyVGltZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICBpZiAob2JqLnJlcXVlc3RJZCAmJiB0eXBlb2Ygb2JqLnN0ZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb2JqLnN0ZXAgPSBub29wO1xuICAgICAgICBsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lKG9iai5yZXF1ZXN0SWQpO1xuICAgICAgICBvYmoucmVxdWVzdElkID0gMDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNldFRpbWVyID0gZnVuY3Rpb24gKGZuLCBkZWxheSwgdHlwZSkge1xuICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgdmFyIHRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgZGVsYXkgPSBkZWxheSB8fCAwO1xuICAgICAgZGVsYXkgPSBNYXRoLm1heChkZWxheSwgMCk7XG4gICAgICBvYmouc3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGlmIChub3cgLSB0aW1lID4gZGVsYXkpIHtcbiAgICAgICAgICBmbigpO1xuICAgICAgICAgIGlmICh0eXBlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZXIob2JqKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZSA9IG5vdztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb2JqLnJlcXVlc3RJZCA9IGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9iai5zdGVwKTtcbiAgICAgIH07XG4gICAgICBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZShvYmouc3RlcCk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICBpZiAobWV0aG9kTmFtZSA9PT0gJ3NldEludGVydmFsJykge1xuICAgICAgd3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uIChmbiwgZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVyKGZuLCBkZWxheSwgJ2ludGVydmFsJyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobWV0aG9kTmFtZSA9PT0gJ3NldFRpbWVvdXQnKSB7XG4gICAgICB3cmFwcGVkTWV0aG9kID0gZnVuY3Rpb24gKGZuLCBkZWxheSkge1xuICAgICAgICByZXR1cm4gc2V0VGltZXIoZm4sIGRlbGF5LCAndGltZW91dCcpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1ldGhvZE5hbWUgPT09ICdjbGVhclRpbWVvdXQnKSB7XG4gICAgICB3cmFwcGVkTWV0aG9kID0gY2xlYXJUaW1lcjtcbiAgICB9IGVsc2UgaWYgKG1ldGhvZE5hbWUgPT09ICdjbGVhckludGVydmFsJykge1xuICAgICAgd3JhcHBlZE1ldGhvZCA9IGNsZWFyVGltZXI7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF3cmFwcGVkTWV0aG9kICYmIHRoaXNbbWV0aG9kTmFtZV0pIHtcbiAgICB3cmFwcGVkTWV0aG9kID0gdGhpc1ttZXRob2ROYW1lXS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmV0dXJuIHdyYXBwZWRNZXRob2Q7XG59XG5cbi8qKlxuICog6K6+572u6YeN5aSN6LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyI3NldEludGVydmFsXG4gKiBAbWVtYmVyb2YgZngvdGltZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOWumuaXtumHjeWkjeiwg+eUqOeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXSDph43lpI3osIPnlKjnmoTpl7TpmpTml7bpl7QobXMpXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlrprml7blmajlr7nosaHvvIzlj6/kvKDlhaUgY2xlYXJJbnRlcnZhbCDmlrnms5XmnaXnu4jmraLov5nkuKrlrprml7blmahcbiAqL1xuVGltZXIuc2V0SW50ZXJ2YWwgPSBmYWN0b3J5KCdzZXRJbnRlcnZhbCcpO1xuXG4vKipcbiAqIOa4hemZpOmHjeWkjeiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lciNjbGVhckludGVydmFsXG4gKiBAbWVtYmVyb2YgZngvdGltZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog5a6a5pe25Zmo5a+56LGhXG4gKi9cblRpbWVyLmNsZWFySW50ZXJ2YWwgPSBmYWN0b3J5KCdjbGVhckludGVydmFsJyk7XG5cbi8qKlxuICog6K6+572u5bu25pe26LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyI3NldFRpbWVvdXRcbiAqIEBtZW1iZXJvZiBmeC90aW1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g5bu25pe26LCD55So55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbGF5PTBdIOW7tuaXtuiwg+eUqOeahOmXtOmalOaXtumXtChtcylcbiAqIEByZXR1cm5zIHtPYmplY3R9IOWumuaXtuWZqOWvueixoe+8jOWPr+S8oOWFpSBjbGVhclRpbWVvdXQg5pa55rOV5p2l57uI5q2i6L+Z5Liq5a6a5pe25ZmoXG4gKi9cblRpbWVyLnNldFRpbWVvdXQgPSBmYWN0b3J5KCdzZXRUaW1lb3V0Jyk7XG5cbi8qKlxuICog5riF6Zmk5bu25pe26LCD55So5a6a5pe25ZmoXG4gKiBAbWV0aG9kIHRpbWVyI2NsZWFyVGltZW91dFxuICogQG1lbWJlcm9mIGZ4L3RpbWVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIOWumuaXtuWZqOWvueixoVxuICovXG5UaW1lci5jbGVhclRpbWVvdXQgPSBmYWN0b3J5KCdjbGVhclRpbWVvdXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1peGVkLW9wZXJhdG9ycyAqL1xuLyoqXG4gKiDliqjnlLvov5DooYzmlrnlvI/lupNcbiAqIC0gUG93XG4gKiAtIEV4cG9cbiAqIC0gQ2lyY1xuICogLSBTaW5lXG4gKiAtIEJhY2tcbiAqIC0gQm91bmNlXG4gKiAtIEVsYXN0aWNcbiAqIC0gUXVhZFxuICogLSBDdWJpY1xuICogLSBRdWFydFxuICogLSBRdWludFxuICogQG1vZHVsZSBmeC90cmFuc2l0aW9uc1xuICogQHNlZSBbbW9vdG9vbHMvRnguVHJhbnNpdGlvbnNdKGh0dHBzOi8vbW9vdG9vbHMubmV0L2NvcmUvZG9jcy8xLjYuMC9GeC9GeC5UcmFuc2l0aW9ucyNGeC1UcmFuc2l0aW9ucylcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9meCcpO1xuICogdmFyICR0cmFuc2l0aW9ucyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvdHJhbnNpdGlvbnMnKTtcbiAqIG5ldyAkZngoe1xuICogICB0cmFuc2l0aW9uIDogJHRyYW5zaXRpb25zLlNpbmUuZWFzZUluT3V0XG4gKiB9KTtcbiAqIG5ldyAkZngoe1xuICogICB0cmFuc2l0aW9uIDogJ1NpbmU6SW4nXG4gKiB9KTtcbiAqIG5ldyAkZngoe1xuICogICB0cmFuc2l0aW9uIDogJ1NpbmU6SW46T3V0J1xuICogfSk7XG4gKi9cblxudmFyICR0eXBlID0gcmVxdWlyZSgnLi4vb2JqL3R5cGUnKTtcbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG52YXIgJGZ4ID0gcmVxdWlyZSgnLi9meCcpO1xuXG4kZnguVHJhbnNpdGlvbiA9IGZ1bmN0aW9uICh0cmFuc2l0aW9uLCBwYXJhbXMpIHtcbiAgaWYgKCR0eXBlKHBhcmFtcykgIT09ICdhcnJheScpIHtcbiAgICBwYXJhbXMgPSBbcGFyYW1zXTtcbiAgfVxuICB2YXIgZWFzZUluID0gZnVuY3Rpb24gKHBvcykge1xuICAgIHJldHVybiB0cmFuc2l0aW9uKHBvcywgcGFyYW1zKTtcbiAgfTtcbiAgcmV0dXJuICRhc3NpZ24oZWFzZUluLCB7XG4gICAgZWFzZUluOiBlYXNlSW4sXG4gICAgZWFzZU91dDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIDEgLSB0cmFuc2l0aW9uKDEgLSBwb3MsIHBhcmFtcyk7XG4gICAgfSxcbiAgICBlYXNlSW5PdXQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIChwb3MgPD0gMC41XG4gICAgICAgICAgPyB0cmFuc2l0aW9uKDIgKiBwb3MsIHBhcmFtcylcbiAgICAgICAgICA6IDIgLSB0cmFuc2l0aW9uKDIgKiAoMSAtIHBvcyksIHBhcmFtcykpIC8gMlxuICAgICAgKTtcbiAgICB9LFxuICB9KTtcbn07XG5cbnZhciBUcmFuc2l0aW9ucyA9IHtcbiAgbGluZWFyOiBmdW5jdGlvbiAoemVybykge1xuICAgIHJldHVybiB6ZXJvO1xuICB9LFxufTtcblxuVHJhbnNpdGlvbnMuZXh0ZW5kID0gZnVuY3Rpb24gKHRyYW5zaXRpb25zKSB7XG4gIE9iamVjdC5rZXlzKHRyYW5zaXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgVHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0gPSBuZXcgJGZ4LlRyYW5zaXRpb24odHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0pO1xuICB9KTtcbn07XG5cblRyYW5zaXRpb25zLmV4dGVuZCh7XG4gIFBvdzogZnVuY3Rpb24gKHAsIHgpIHtcbiAgICByZXR1cm4gTWF0aC5wb3cocCwgKHggJiYgeFswXSkgfHwgNik7XG4gIH0sXG5cbiAgRXhwbzogZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgOCAqIChwIC0gMSkpO1xuICB9LFxuXG4gIENpcmM6IGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIDEgLSBNYXRoLnNpbihNYXRoLmFjb3MocCkpO1xuICB9LFxuXG4gIFNpbmU6IGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIDEgLSBNYXRoLmNvcyhwICogTWF0aC5QSSAvIDIpO1xuICB9LFxuXG4gIEJhY2s6IGZ1bmN0aW9uIChwLCB4KSB7XG4gICAgeCA9ICh4ICYmIHhbMF0pIHx8IDEuNjE4O1xuICAgIHJldHVybiBNYXRoLnBvdyhwLCAyKSAqICgoeCArIDEpICogcCAtIHgpO1xuICB9LFxuXG4gIEJvdW5jZTogZnVuY3Rpb24gKHApIHtcbiAgICB2YXIgdmFsdWU7XG4gICAgdmFyIGEgPSAwO1xuICAgIHZhciBiID0gMTtcbiAgICB3aGlsZSAocCA8ICg3IC0gNCAqIGEpIC8gMTEpIHtcbiAgICAgIHZhbHVlID0gYiAqIGIgLSBNYXRoLnBvdygoMTEgLSA2ICogYSAtIDExICogcCkgLyA0LCAyKTtcbiAgICAgIGEgKz0gYjtcbiAgICAgIGIgLz0gMjtcbiAgICB9XG4gICAgdmFsdWUgPSBiICogYiAtIE1hdGgucG93KCgxMSAtIDYgKiBhIC0gMTEgKiBwKSAvIDQsIDIpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSxcblxuICBFbGFzdGljOiBmdW5jdGlvbiAocCwgeCkge1xuICAgIHJldHVybiAoXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGx1c3BsdXNcbiAgICAgIE1hdGgucG93KDIsIDEwICogLS1wKVxuICAgICAgKiBNYXRoLmNvcygyMCAqIHAgKiBNYXRoLlBJICogKCh4ICYmIHhbMF0pIHx8IDEpIC8gMylcbiAgICApO1xuICB9LFxufSk7XG5cblsnUXVhZCcsICdDdWJpYycsICdRdWFydCcsICdRdWludCddLmZvckVhY2goZnVuY3Rpb24gKHRyYW5zaXRpb24sIGkpIHtcbiAgVHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0gPSBuZXcgJGZ4LlRyYW5zaXRpb24oZnVuY3Rpb24gKHApIHtcbiAgICByZXR1cm4gTWF0aC5wb3cocCwgaSArIDIpO1xuICB9KTtcbn0pO1xuXG4kZnguc3RhdGljcyh7XG4gIGdldFRyYW5zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdHJhbnMgPSB0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiB8fCBUcmFuc2l0aW9ucy5TaW5lLmVhc2VJbk91dDtcbiAgICBpZiAodHlwZW9mIHRyYW5zID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIGRhdGEgPSB0cmFucy5zcGxpdCgnOicpO1xuICAgICAgdHJhbnMgPSBUcmFuc2l0aW9ucztcbiAgICAgIHRyYW5zID0gdHJhbnNbZGF0YVswXV0gfHwgdHJhbnNbZGF0YVswXV07XG4gICAgICBpZiAoZGF0YVsxXSkge1xuICAgICAgICB0cmFucyA9IHRyYW5zWydlYXNlJyArIGRhdGFbMV0gKyAoZGF0YVsyXSA/IGRhdGFbMl0gOiAnJyldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhbnM7XG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2l0aW9ucztcbiIsIi8qKlxuICogYWpheCDor7fmsYLmlrnms5XvvIzkvb/nlKjmlrnlvI/kuI4galF1ZXJ5LCBaZXB0byDnsbvkvLzvvIzlr7kgalF1ZXJ5LCBaZXB0byDml6Dkvp3otZZcbiAqIEBtZXRob2QgaW8vYWpheFxuICogQHNlZSBbYWpheF0oaHR0cHM6Ly9naXRodWIuY29tL0ZvcmJlc0xpbmRlc2F5L2FqYXgpXG4gKiBAZXhhbXBsZVxuICogdmFyICRhamF4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9pby9hamF4Jyk7XG4gKiBkb2N1bWVudC5kb21haW4gPSAncXEuY29tJztcbiAqICRhamF4KHtcbiAqICAgdXJsOiAnaHR0cDovL2EucXEuY29tL2Zvcm0nLFxuICogICBkYXRhOiBbe1xuICogICAgIG4xOiAndjEnLFxuICogICAgIG4yOiAndjInXG4gKiAgIH1dLFxuICogICBzdWNjZXNzOiBmdW5jdGlvbiAocnMpIHtcbiAqICAgICBjb25zb2xlLmluZm8ocnMpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgdHlwZSA9IHJlcXVpcmUoJy4uL29iai90eXBlJylcblxudmFyIGpzb25wSUQgPSAwLFxuICAgIGtleSxcbiAgICBuYW1lLFxuICAgIHJzY3JpcHQgPSAvPHNjcmlwdFxcYltePF0qKD86KD8hPFxcL3NjcmlwdD4pPFtePF0qKSo8XFwvc2NyaXB0Pi9naSxcbiAgICBzY3JpcHRUeXBlUkUgPSAvXig/OnRleHR8YXBwbGljYXRpb24pXFwvamF2YXNjcmlwdC9pLFxuICAgIHhtbFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC94bWwvaSxcbiAgICBqc29uVHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBodG1sVHlwZSA9ICd0ZXh0L2h0bWwnLFxuICAgIGJsYW5rUkUgPSAvXlxccyokL1xuXG52YXIgYWpheCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gIHZhciBzZXR0aW5ncyA9IGV4dGVuZCh7fSwgb3B0aW9ucyB8fCB7fSlcbiAgZm9yIChrZXkgaW4gYWpheC5zZXR0aW5ncykgaWYgKHNldHRpbmdzW2tleV0gPT09IHVuZGVmaW5lZCkgc2V0dGluZ3Nba2V5XSA9IGFqYXguc2V0dGluZ3Nba2V5XVxuXG4gIGFqYXhTdGFydChzZXR0aW5ncylcblxuICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSBzZXR0aW5ncy5jcm9zc0RvbWFpbiA9IC9eKFtcXHctXSs6KT9cXC9cXC8oW15cXC9dKykvLnRlc3Qoc2V0dGluZ3MudXJsKSAmJlxuICAgIFJlZ0V4cC4kMiAhPSB3aW5kb3cubG9jYXRpb24uaG9zdFxuXG4gIHZhciBkYXRhVHlwZSA9IHNldHRpbmdzLmRhdGFUeXBlLCBoYXNQbGFjZWhvbGRlciA9IC89XFw/Ly50ZXN0KHNldHRpbmdzLnVybClcbiAgaWYgKGRhdGFUeXBlID09ICdqc29ucCcgfHwgaGFzUGxhY2Vob2xkZXIpIHtcbiAgICBpZiAoIWhhc1BsYWNlaG9sZGVyKSBzZXR0aW5ncy51cmwgPSBhcHBlbmRRdWVyeShzZXR0aW5ncy51cmwsICdjYWxsYmFjaz0/JylcbiAgICByZXR1cm4gYWpheC5KU09OUChzZXR0aW5ncylcbiAgfVxuXG4gIGlmICghc2V0dGluZ3MudXJsKSBzZXR0aW5ncy51cmwgPSB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKVxuICBzZXJpYWxpemVEYXRhKHNldHRpbmdzKVxuXG4gIHZhciBtaW1lID0gc2V0dGluZ3MuYWNjZXB0c1tkYXRhVHlwZV0sXG4gICAgICBiYXNlSGVhZGVycyA9IHsgfSxcbiAgICAgIHByb3RvY29sID0gL14oW1xcdy1dKzopXFwvXFwvLy50ZXN0KHNldHRpbmdzLnVybCkgPyBSZWdFeHAuJDEgOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wsXG4gICAgICB4aHIgPSBhamF4LnNldHRpbmdzLnhocigpLCBhYm9ydFRpbWVvdXRcblxuICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSBiYXNlSGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICBpZiAobWltZSkge1xuICAgIGJhc2VIZWFkZXJzWydBY2NlcHQnXSA9IG1pbWVcbiAgICBpZiAobWltZS5pbmRleE9mKCcsJykgPiAtMSkgbWltZSA9IG1pbWUuc3BsaXQoJywnLCAyKVswXVxuICAgIHhoci5vdmVycmlkZU1pbWVUeXBlICYmIHhoci5vdmVycmlkZU1pbWVUeXBlKG1pbWUpXG4gIH1cbiAgaWYgKHNldHRpbmdzLmNvbnRlbnRUeXBlIHx8IChzZXR0aW5ncy5kYXRhICYmIHNldHRpbmdzLnR5cGUudG9VcHBlckNhc2UoKSAhPSAnR0VUJykpXG4gICAgYmFzZUhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gKHNldHRpbmdzLmNvbnRlbnRUeXBlIHx8ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICBzZXR0aW5ncy5oZWFkZXJzID0gZXh0ZW5kKGJhc2VIZWFkZXJzLCBzZXR0aW5ncy5oZWFkZXJzIHx8IHt9KVxuXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxuICAgICAgdmFyIHJlc3VsdCwgZXJyb3IgPSBmYWxzZVxuICAgICAgaWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09IDMwNCB8fCAoeGhyLnN0YXR1cyA9PSAwICYmIHByb3RvY29sID09ICdmaWxlOicpKSB7XG4gICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUgfHwgbWltZVRvRGF0YVR5cGUoeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKSlcbiAgICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dFxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGRhdGFUeXBlID09ICdzY3JpcHQnKSAgICAoMSxldmFsKShyZXN1bHQpXG4gICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT0gJ3htbCcpICByZXN1bHQgPSB4aHIucmVzcG9uc2VYTUxcbiAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PSAnanNvbicpIHJlc3VsdCA9IGJsYW5rUkUudGVzdChyZXN1bHQpID8gbnVsbCA6IEpTT04ucGFyc2UocmVzdWx0KVxuICAgICAgICB9IGNhdGNoIChlKSB7IGVycm9yID0gZSB9XG5cbiAgICAgICAgaWYgKGVycm9yKSBhamF4RXJyb3IoZXJyb3IsICdwYXJzZXJlcnJvcicsIHhociwgc2V0dGluZ3MpXG4gICAgICAgIGVsc2UgYWpheFN1Y2Nlc3MocmVzdWx0LCB4aHIsIHNldHRpbmdzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWpheEVycm9yKG51bGwsICdlcnJvcicsIHhociwgc2V0dGluZ3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGFzeW5jID0gJ2FzeW5jJyBpbiBzZXR0aW5ncyA/IHNldHRpbmdzLmFzeW5jIDogdHJ1ZVxuICB4aHIub3BlbihzZXR0aW5ncy50eXBlLCBzZXR0aW5ncy51cmwsIGFzeW5jKVxuXG4gIGZvciAobmFtZSBpbiBzZXR0aW5ncy5oZWFkZXJzKSB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBzZXR0aW5ncy5oZWFkZXJzW25hbWVdKVxuXG4gIGlmIChhamF4QmVmb3JlU2VuZCh4aHIsIHNldHRpbmdzKSA9PT0gZmFsc2UpIHtcbiAgICB4aHIuYWJvcnQoKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKHNldHRpbmdzLnRpbWVvdXQgPiAwKSBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHlcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzKVxuICAgIH0sIHNldHRpbmdzLnRpbWVvdXQpXG5cbiAgLy8gYXZvaWQgc2VuZGluZyBlbXB0eSBzdHJpbmcgKCMzMTkpXG4gIHhoci5zZW5kKHNldHRpbmdzLmRhdGEgPyBzZXR0aW5ncy5kYXRhIDogbnVsbClcbiAgcmV0dXJuIHhoclxufVxuXG5cbi8vIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgYW5kIHJldHVybiBmYWxzZSBpZiBpdCB3YXMgY2FuY2VsbGVkXG5mdW5jdGlvbiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xuICAvL3RvZG86IEZpcmUgb2ZmIHNvbWUgZXZlbnRzXG4gIC8vdmFyIGV2ZW50ID0gJC5FdmVudChldmVudE5hbWUpXG4gIC8vJChjb250ZXh0KS50cmlnZ2VyKGV2ZW50LCBkYXRhKVxuICByZXR1cm4gdHJ1ZTsvLyFldmVudC5kZWZhdWx0UHJldmVudGVkXG59XG5cbi8vIHRyaWdnZXIgYW4gQWpheCBcImdsb2JhbFwiIGV2ZW50XG5mdW5jdGlvbiB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCkgcmV0dXJuIHRyaWdnZXJBbmRSZXR1cm4oY29udGV4dCB8fCBkb2N1bWVudCwgZXZlbnROYW1lLCBkYXRhKVxufVxuXG4vLyBOdW1iZXIgb2YgYWN0aXZlIEFqYXggcmVxdWVzdHNcbmFqYXguYWN0aXZlID0gMFxuXG5mdW5jdGlvbiBhamF4U3RhcnQoc2V0dGluZ3MpIHtcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiBhamF4LmFjdGl2ZSsrID09PSAwKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0YXJ0Jylcbn1cbmZ1bmN0aW9uIGFqYXhTdG9wKHNldHRpbmdzKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwgJiYgISgtLWFqYXguYWN0aXZlKSkgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgbnVsbCwgJ2FqYXhTdG9wJylcbn1cblxuLy8gdHJpZ2dlcnMgYW4gZXh0cmEgZ2xvYmFsIGV2ZW50IFwiYWpheEJlZm9yZVNlbmRcIiB0aGF0J3MgbGlrZSBcImFqYXhTZW5kXCIgYnV0IGNhbmNlbGFibGVcbmZ1bmN0aW9uIGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIGlmIChzZXR0aW5ncy5iZWZvcmVTZW5kLmNhbGwoY29udGV4dCwgeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlIHx8XG4gICAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEJlZm9yZVNlbmQnLCBbeGhyLCBzZXR0aW5nc10pID09PSBmYWxzZSlcbiAgICByZXR1cm4gZmFsc2VcblxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFNlbmQnLCBbeGhyLCBzZXR0aW5nc10pXG59XG5mdW5jdGlvbiBhamF4U3VjY2VzcyhkYXRhLCB4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dCwgc3RhdHVzID0gJ3N1Y2Nlc3MnXG4gIHNldHRpbmdzLnN1Y2Nlc3MuY2FsbChjb250ZXh0LCBkYXRhLCBzdGF0dXMsIHhocilcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTdWNjZXNzJywgW3hociwgc2V0dGluZ3MsIGRhdGFdKVxuICBhamF4Q29tcGxldGUoc3RhdHVzLCB4aHIsIHNldHRpbmdzKVxufVxuLy8gdHlwZTogXCJ0aW1lb3V0XCIsIFwiZXJyb3JcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcbmZ1bmN0aW9uIGFqYXhFcnJvcihlcnJvciwgdHlwZSwgeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgc2V0dGluZ3MuZXJyb3IuY2FsbChjb250ZXh0LCB4aHIsIHR5cGUsIGVycm9yKVxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEVycm9yJywgW3hociwgc2V0dGluZ3MsIGVycm9yXSlcbiAgYWpheENvbXBsZXRlKHR5cGUsIHhociwgc2V0dGluZ3MpXG59XG4vLyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBcIm5vdG1vZGlmaWVkXCIsIFwiZXJyb3JcIiwgXCJ0aW1lb3V0XCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXG5mdW5jdGlvbiBhamF4Q29tcGxldGUoc3RhdHVzLCB4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICBzZXR0aW5ncy5jb21wbGV0ZS5jYWxsKGNvbnRleHQsIHhociwgc3RhdHVzKVxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheENvbXBsZXRlJywgW3hociwgc2V0dGluZ3NdKVxuICBhamF4U3RvcChzZXR0aW5ncylcbn1cblxuLy8gRW1wdHkgZnVuY3Rpb24sIHVzZWQgYXMgZGVmYXVsdCBjYWxsYmFja1xuZnVuY3Rpb24gZW1wdHkoKSB7fVxuXG5hamF4LkpTT05QID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gIGlmICghKCd0eXBlJyBpbiBvcHRpb25zKSkgcmV0dXJuIGFqYXgob3B0aW9ucylcblxuICB2YXIgY2FsbGJhY2tOYW1lID0gJ2pzb25wJyArICgrK2pzb25wSUQpLFxuICAgIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuICAgIGFib3J0ID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vdG9kbzogcmVtb3ZlIHNjcmlwdFxuICAgICAgLy8kKHNjcmlwdCkucmVtb3ZlKClcbiAgICAgIGlmIChjYWxsYmFja05hbWUgaW4gd2luZG93KSB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGVtcHR5XG4gICAgICBhamF4Q29tcGxldGUoJ2Fib3J0JywgeGhyLCBvcHRpb25zKVxuICAgIH0sXG4gICAgeGhyID0geyBhYm9ydDogYWJvcnQgfSwgYWJvcnRUaW1lb3V0LFxuICAgIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF1cbiAgICAgIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuXG4gIGlmIChvcHRpb25zLmVycm9yKSBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHhoci5hYm9ydCgpXG4gICAgb3B0aW9ucy5lcnJvcigpXG4gIH1cblxuICB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXG4gICAgICAvL3RvZG86IHJlbW92ZSBzY3JpcHRcbiAgICAgIC8vJChzY3JpcHQpLnJlbW92ZSgpXG4gICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja05hbWVdXG4gICAgYWpheFN1Y2Nlc3MoZGF0YSwgeGhyLCBvcHRpb25zKVxuICB9XG5cbiAgc2VyaWFsaXplRGF0YShvcHRpb25zKVxuICBzY3JpcHQuc3JjID0gb3B0aW9ucy51cmwucmVwbGFjZSgvPVxcPy8sICc9JyArIGNhbGxiYWNrTmFtZSlcblxuICAvLyBVc2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgYXBwZW5kQ2hpbGQgdG8gY2lyY3VtdmVudCBhbiBJRTYgYnVnLlxuICAvLyBUaGlzIGFyaXNlcyB3aGVuIGEgYmFzZSBub2RlIGlzIHVzZWQgKHNlZSBqUXVlcnkgYnVncyAjMjcwOSBhbmQgIzQzNzgpLlxuICBoZWFkLmluc2VydEJlZm9yZShzY3JpcHQsIGhlYWQuZmlyc3RDaGlsZCk7XG5cbiAgaWYgKG9wdGlvbnMudGltZW91dCA+IDApIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgICBhamF4Q29tcGxldGUoJ3RpbWVvdXQnLCB4aHIsIG9wdGlvbnMpXG4gICAgfSwgb3B0aW9ucy50aW1lb3V0KVxuXG4gIHJldHVybiB4aHJcbn1cblxuYWpheC5zZXR0aW5ncyA9IHtcbiAgLy8gRGVmYXVsdCB0eXBlIG9mIHJlcXVlc3RcbiAgdHlwZTogJ0dFVCcsXG4gIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgYmVmb3JlIHJlcXVlc3RcbiAgYmVmb3JlU2VuZDogZW1wdHksXG4gIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZHNcbiAgc3VjY2VzczogZW1wdHksXG4gIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgdGhlIHRoZSBzZXJ2ZXIgZHJvcHMgZXJyb3JcbiAgZXJyb3I6IGVtcHR5LFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIG9uIHJlcXVlc3QgY29tcGxldGUgKGJvdGg6IGVycm9yIGFuZCBzdWNjZXNzKVxuICBjb21wbGV0ZTogZW1wdHksXG4gIC8vIFRoZSBjb250ZXh0IGZvciB0aGUgY2FsbGJhY2tzXG4gIGNvbnRleHQ6IG51bGwsXG4gIC8vIFdoZXRoZXIgdG8gdHJpZ2dlciBcImdsb2JhbFwiIEFqYXggZXZlbnRzXG4gIGdsb2JhbDogdHJ1ZSxcbiAgLy8gVHJhbnNwb3J0XG4gIHhocjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcbiAgfSxcbiAgLy8gTUlNRSB0eXBlcyBtYXBwaW5nXG4gIGFjY2VwdHM6IHtcbiAgICBzY3JpcHQ6ICd0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQnLFxuICAgIGpzb246ICAganNvblR5cGUsXG4gICAgeG1sOiAgICAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCcsXG4gICAgaHRtbDogICBodG1sVHlwZSxcbiAgICB0ZXh0OiAgICd0ZXh0L3BsYWluJ1xuICB9LFxuICAvLyBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIHRvIGFub3RoZXIgZG9tYWluXG4gIGNyb3NzRG9tYWluOiBmYWxzZSxcbiAgLy8gRGVmYXVsdCB0aW1lb3V0XG4gIHRpbWVvdXQ6IDBcbn1cblxuZnVuY3Rpb24gbWltZVRvRGF0YVR5cGUobWltZSkge1xuICByZXR1cm4gbWltZSAmJiAoIG1pbWUgPT0gaHRtbFR5cGUgPyAnaHRtbCcgOlxuICAgIG1pbWUgPT0ganNvblR5cGUgPyAnanNvbicgOlxuICAgIHNjcmlwdFR5cGVSRS50ZXN0KG1pbWUpID8gJ3NjcmlwdCcgOlxuICAgIHhtbFR5cGVSRS50ZXN0KG1pbWUpICYmICd4bWwnICkgfHwgJ3RleHQnXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFF1ZXJ5KHVybCwgcXVlcnkpIHtcbiAgcmV0dXJuICh1cmwgKyAnJicgKyBxdWVyeSkucmVwbGFjZSgvWyY/XXsxLDJ9LywgJz8nKVxufVxuXG4vLyBzZXJpYWxpemUgcGF5bG9hZCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBVUkwgZm9yIEdFVCByZXF1ZXN0c1xuZnVuY3Rpb24gc2VyaWFsaXplRGF0YShvcHRpb25zKSB7XG4gIGlmICh0eXBlKG9wdGlvbnMuZGF0YSkgPT09ICdvYmplY3QnKSBvcHRpb25zLmRhdGEgPSBwYXJhbShvcHRpb25zLmRhdGEpXG4gIGlmIChvcHRpb25zLmRhdGEgJiYgKCFvcHRpb25zLnR5cGUgfHwgb3B0aW9ucy50eXBlLnRvVXBwZXJDYXNlKCkgPT0gJ0dFVCcpKVxuICAgIG9wdGlvbnMudXJsID0gYXBwZW5kUXVlcnkob3B0aW9ucy51cmwsIG9wdGlvbnMuZGF0YSlcbn1cblxuYWpheC5nZXQgPSBmdW5jdGlvbih1cmwsIHN1Y2Nlc3MpeyByZXR1cm4gYWpheCh7IHVybDogdXJsLCBzdWNjZXNzOiBzdWNjZXNzIH0pIH1cblxuYWpheC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBzdWNjZXNzLCBkYXRhVHlwZSl7XG4gIGlmICh0eXBlKGRhdGEpID09PSAnZnVuY3Rpb24nKSBkYXRhVHlwZSA9IGRhdGFUeXBlIHx8IHN1Y2Nlc3MsIHN1Y2Nlc3MgPSBkYXRhLCBkYXRhID0gbnVsbFxuICByZXR1cm4gYWpheCh7IHR5cGU6ICdQT1NUJywgdXJsOiB1cmwsIGRhdGE6IGRhdGEsIHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGFUeXBlOiBkYXRhVHlwZSB9KVxufVxuXG5hamF4LmdldEpTT04gPSBmdW5jdGlvbih1cmwsIHN1Y2Nlc3Mpe1xuICByZXR1cm4gYWpheCh7IHVybDogdXJsLCBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhVHlwZTogJ2pzb24nIH0pXG59XG5cbnZhciBlc2NhcGUgPSBlbmNvZGVVUklDb21wb25lbnRcblxuZnVuY3Rpb24gc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbCwgc2NvcGUpe1xuICB2YXIgYXJyYXkgPSB0eXBlKG9iaikgPT09ICdhcnJheSc7XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgIGlmIChzY29wZSkga2V5ID0gdHJhZGl0aW9uYWwgPyBzY29wZSA6IHNjb3BlICsgJ1snICsgKGFycmF5ID8gJycgOiBrZXkpICsgJ10nXG4gICAgLy8gaGFuZGxlIGRhdGEgaW4gc2VyaWFsaXplQXJyYXkoKSBmb3JtYXRcbiAgICBpZiAoIXNjb3BlICYmIGFycmF5KSBwYXJhbXMuYWRkKHZhbHVlLm5hbWUsIHZhbHVlLnZhbHVlKVxuICAgIC8vIHJlY3Vyc2UgaW50byBuZXN0ZWQgb2JqZWN0c1xuICAgIGVsc2UgaWYgKHRyYWRpdGlvbmFsID8gKHR5cGUodmFsdWUpID09PSAnYXJyYXknKSA6ICh0eXBlKHZhbHVlKSA9PT0gJ29iamVjdCcpKVxuICAgICAgc2VyaWFsaXplKHBhcmFtcywgdmFsdWUsIHRyYWRpdGlvbmFsLCBrZXkpXG4gICAgZWxzZSBwYXJhbXMuYWRkKGtleSwgdmFsdWUpXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyYW0ob2JqLCB0cmFkaXRpb25hbCl7XG4gIHZhciBwYXJhbXMgPSBbXVxuICBwYXJhbXMuYWRkID0gZnVuY3Rpb24oaywgdil7IHRoaXMucHVzaChlc2NhcGUoaykgKyAnPScgKyBlc2NhcGUodikpIH1cbiAgc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbClcbiAgcmV0dXJuIHBhcmFtcy5qb2luKCcmJykucmVwbGFjZSgnJTIwJywgJysnKVxufVxuXG5mdW5jdGlvbiBleHRlbmQodGFyZ2V0KSB7XG4gIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbiAgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgZm9yIChrZXkgaW4gc291cmNlKVxuICAgICAgaWYgKHNvdXJjZVtrZXldICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgfSlcbiAgcmV0dXJuIHRhcmdldFxufVxuIiwiLyoqXG4gKiDliqDovb0gc2NyaXB0IOaWh+S7tlxuICogQG1ldGhvZCBpby9nZXRTY3JpcHRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuc3JjIHNjcmlwdCDlnLDlnYBcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jaGFyc2V0PSd1dGYtOCddIHNjcmlwdCDnvJbnoIFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uTG9hZF0gc2NyaXB0IOWKoOi9veWujOaIkOeahOWbnuiwg+WHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0U2NyaXB0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9pby9nZXRTY3JpcHQnKTtcbiAqICRnZXRTY3JpcHQoe1xuICogICBzcmM6ICdodHRwczovL2NvZGUuanF1ZXJ5LmNvbS9qcXVlcnktMy4zLjEubWluLmpzJyxcbiAqICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKHdpbmRvdy5qUXVlcnkpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG5mdW5jdGlvbiBnZXRTY3JpcHQob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgc3JjID0gb3B0aW9ucy5zcmMgfHwgJyc7XG4gIHZhciBjaGFyc2V0ID0gb3B0aW9ucy5jaGFyc2V0IHx8ICcnO1xuICB2YXIgb25Mb2FkID0gb3B0aW9ucy5vbkxvYWQgfHwgZnVuY3Rpb24gKCkge307XG4gIHZhciB3dG9wID0gb3B0aW9ucy53dG9wIHx8IHdpbmRvdztcbiAgdmFyIGRvYyA9IHd0b3AuZG9jdW1lbnQ7XG5cbiAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LmFzeW5jID0gJ2FzeW5jJztcbiAgc2NyaXB0LnNyYyA9IHNyYztcblxuICBpZiAoY2hhcnNldCkge1xuICAgIHNjcmlwdC5jaGFyc2V0ID0gY2hhcnNldDtcbiAgfVxuICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnJlYWR5U3RhdGVcbiAgICAgIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCdcbiAgICAgIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuICAgICkge1xuICAgICAgaWYgKHR5cGVvZiBvbkxvYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb25Mb2FkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ubG9hZCA9IG51bGw7XG4gICAgICB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgfVxuICB9O1xuICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgcmV0dXJuIHNjcmlwdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTY3JpcHQ7XG4iLCIvKipcbiAqIOWwgeijhSBpZnJhbWUgcG9zdCDmqKHlvI9cbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAbWV0aG9kIGlvL2lmcmFtZVBvc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOivt+axgumAiemhuVxuICogQHBhcmFtIHtPYmplY3R9IFtzcGVjLmZvcm09bnVsbF0g6KaB6K+35rGC55qE6KGo5Y2VXG4gKiBAcGFyYW0ge1N0cmluZ30gc3BlYy51cmwg6K+35rGC5Zyw5Z2AXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gc3BlYy5kYXRhIOivt+axguaVsOaNrlxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLnRhcmdldD0nJ10g55uu5qCHIGlmcmFtZSDlkI3np7BcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5tZXRob2Q9J3Bvc3QnXSDor7fmsYLmlrnlvI9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5hY2NlcHRDaGFyc2V0PScnXSDor7fmsYLnm67moIfnmoTnvJbnoIFcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucD0nY2FsbGJhY2snXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlj4LmlbDlkI3np7BcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucE1ldGhvZD0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Y+C5pWw55qE5Lyg6YCS5pa55byP77yM5Y+v6YCJWydwb3N0JywgJ2dldCddXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMuanNvbnBDYWxsYmFjaz0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Ye95pWw5ZCN56ew77yM6buY6K6k6Ieq5Yqo55Sf5oiQXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMuanNvbnBBZGRQYXJlbnQ9JyddIOS8oOmAkue7meaOpeWPo+eahOWbnuiwg+WHveaVsOWQjeensOmcgOimgemZhOW4pueahOWJjee8gOiwg+eUqOi3r+W+hFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3NwZWMuY29tcGxldGVdIOiOt+W+l+aVsOaNrueahOWbnuiwg+WHveaVsFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3NwZWMuc3VjY2Vzc10g5oiQ5Yqf6I635b6X5pWw5o2u55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRpZnJhbWVQb3N0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9pby9pZnJhbWVQb3N0Jyk7XG4gKiBkb2N1bWVudC5kb21haW4gPSAncXEuY29tJztcbiAqIGlmcmFtZVBvc3Qoe1xuICogICB1cmw6ICdodHRwOi8vYS5xcS5jb20vZm9ybScsXG4gKiAgIGRhdGE6IFt7XG4gKiAgICAgbjE6ICd2MScsXG4gKiAgICAgbjI6ICd2MidcbiAqICAgfV0sXG4gKiAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChycykge1xuICogICAgIGNvbnNvbGUuaW5mbyhycyk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbnZhciBoaWRkZW5EaXYgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXQkKCkge1xuICB2YXIgJDtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgJCA9IHdpbmRvdy4kIHx8IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvO1xuICB9XG4gIGlmICghJCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVlZCB3aW5kZG93LiQgbGlrZSBqUXVlcnkgb3IgWmVwdG8uJyk7XG4gIH1cbiAgcmV0dXJuICQ7XG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlbkJveCgpIHtcbiAgdmFyICQgPSBnZXQkKCk7XG4gIGlmIChoaWRkZW5EaXYgPT09IG51bGwpIHtcbiAgICBoaWRkZW5EaXYgPSAkKCc8ZGl2Lz4nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIGhpZGRlbkRpdi5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgfVxuICByZXR1cm4gaGlkZGVuRGl2O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtKCkge1xuICB2YXIgJCA9IGdldCQoKTtcbiAgdmFyIGZvcm0gPSAkKCc8Zm9ybSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIj48L2Zvcm0+Jyk7XG4gIGZvcm0uYXBwZW5kVG8oZ2V0SGlkZGVuQm94KCkpO1xuICByZXR1cm4gZm9ybTtcbn1cblxuZnVuY3Rpb24gZ2V0SGlkZGVuSW5wdXQoZm9ybSwgbmFtZSkge1xuICB2YXIgJCA9IGdldCQoKTtcbiAgdmFyIGlucHV0ID0gJChmb3JtKS5maW5kKCdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScpO1xuICBpZiAoIWlucHV0LmdldCgwKSkge1xuICAgIGlucHV0ID0gJCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiJyArIG5hbWUgKyAnXCIgdmFsdWU9XCJcIi8+Jyk7XG4gICAgaW5wdXQuYXBwZW5kVG8oZm9ybSk7XG4gIH1cbiAgcmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiBnZXRJZnJhbWUobmFtZSkge1xuICB2YXIgJCA9IGdldCQoKTtcbiAgdmFyIGh0bWwgPSBbXG4gICAgJzxpZnJhbWUnLFxuICAgICdpZD1cIicgKyBuYW1lICsgJ1wiICcsXG4gICAgJ25hbWU9XCInICsgbmFtZSArICdcIicsXG4gICAgJ3NyYz1cImFib3V0OmJsYW5rXCInLFxuICAgICdzdHlsZT1cImRpc3BsYXk6bm9uZTtcIj48L2lmcmFtZT4nLFxuICBdLmpvaW4oJyAnKTtcbiAgdmFyIGlmcmFtZSA9ICQoaHRtbCk7XG4gIGlmcmFtZS5hcHBlbmRUbyhnZXRIaWRkZW5Cb3goKSk7XG4gIHJldHVybiBpZnJhbWU7XG59XG5cbmZ1bmN0aW9uIGlmcmFtZVBvc3Qoc3BlYykge1xuICB2YXIgJCA9IGdldCQoKTtcbiAgdmFyIGNvbmYgPSAkLmV4dGVuZCh7XG4gICAgZm9ybTogbnVsbCxcbiAgICB1cmw6ICcnLFxuICAgIGRhdGE6IFtdLFxuICAgIHRhcmdldDogJycsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgYWNjZXB0Q2hhcnNldDogJycsXG4gICAganNvbnA6ICdjYWxsYmFjaycsXG4gICAganNvbnBNZXRob2Q6ICcnLFxuICAgIGpzb25wQ2FsbGJhY2s6ICcnLFxuICAgIGpzb25wQWRkUGFyZW50OiAnJyxcbiAgICBjb21wbGV0ZTogJC5ub29wLFxuICAgIHN1Y2Nlc3M6ICQubm9vcCxcbiAgfSwgc3BlYyk7XG5cbiAgdmFyIHRoYXQgPSB7fTtcbiAgdGhhdC51cmwgPSBjb25mLnVybDtcblxuICB0aGF0Lmpzb25wID0gY29uZi5qc29ucCB8fCAnY2FsbGJhY2snO1xuICB0aGF0Lm1ldGhvZCA9IGNvbmYubWV0aG9kIHx8ICdwb3N0JztcbiAgdGhhdC5qc29ucE1ldGhvZCA9ICQudHlwZShjb25mLmpzb25wTWV0aG9kKSA9PT0gJ3N0cmluZydcbiAgICA/IGNvbmYuanNvbnBNZXRob2QudG9Mb3dlckNhc2UoKVxuICAgIDogJyc7XG5cbiAgdmFyIGZvcm0gPSAkKGNvbmYuZm9ybSk7XG4gIGlmICghZm9ybS5sZW5ndGgpIHtcbiAgICBmb3JtID0gZ2V0Rm9ybSgpO1xuXG4gICAgdmFyIGh0bWwgPSBbXTtcbiAgICBpZiAoJC5pc0FycmF5KGNvbmYuZGF0YSkpIHtcbiAgICAgICQuZWFjaChjb25mLmRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlucHV0SHRtbCA9IFtcbiAgICAgICAgICAnPGlucHV0JyxcbiAgICAgICAgICAndHlwZT1cImhpZGRlblwiJyxcbiAgICAgICAgICAnbmFtZT1cIicgKyBpdGVtLm5hbWUgKyAnXCInLFxuICAgICAgICAgICd2YWx1ZT1cIicgKyBpdGVtLnZhbHVlICsgJ1wiPicsXG4gICAgICAgIF0uam9pbignICcpO1xuICAgICAgICBodG1sLnB1c2goaW5wdXRIdG1sKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KGNvbmYuZGF0YSkpIHtcbiAgICAgICQuZWFjaChjb25mLmRhdGEsIGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgaW5wdXRIdG1sID0gW1xuICAgICAgICAgICc8aW5wdXQnLFxuICAgICAgICAgICd0eXBlPVwiaGlkZGVuXCInLFxuICAgICAgICAgICduYW1lPVwiJyArIG5hbWUgKyAnXCInLFxuICAgICAgICAgICd2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj4nLFxuICAgICAgICBdLmpvaW4oJyAnKTtcbiAgICAgICAgaHRtbC5wdXNoKGlucHV0SHRtbCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgJChodG1sLmpvaW4oJycpKS5hcHBlbmRUbyhmb3JtKTtcbiAgfVxuICB0aGF0LmZvcm0gPSBmb3JtO1xuICB0aGF0LmNvbmYgPSBjb25mO1xuXG4gIHZhciB0aW1lU3RhbXAgPSArbmV3IERhdGUoKTtcbiAgdmFyIGlmcmFtZU5hbWUgPSAnaWZyYW1lJyArIHRpbWVTdGFtcDtcblxuICB0aGF0LnRpbWVTdGFtcCA9IHRpbWVTdGFtcDtcbiAgdGhhdC5pZnJhbWVOYW1lID0gaWZyYW1lTmFtZTtcblxuICBpZiAoY29uZi5hY2NlcHRDaGFyc2V0KSB7XG4gICAgZm9ybS5hdHRyKCdhY2NlcHQtY2hhcnNldCcsIGNvbmYuYWNjZXB0Q2hhcnNldCk7XG4gICAgdGhhdC5hY2NlcHRDaGFyc2V0ID0gY29uZi5hY2NlcHRDaGFyc2V0O1xuICB9XG5cbiAgdmFyIGlmcmFtZSA9IG51bGw7XG4gIHZhciB0YXJnZXQgPSAnJztcbiAgaWYgKGNvbmYudGFyZ2V0KSB7XG4gICAgdGFyZ2V0ID0gY29uZi50YXJnZXQ7XG4gICAgaWYgKFsnX2JsYW5rJywgJ19zZWxmJywgJ19wYXJlbnQnLCAnX3RvcCddLmluZGV4T2YoY29uZi50YXJnZXQpIDwgMCkge1xuICAgICAgaWZyYW1lID0gJCgnaWZyYW1lW25hbWU9XCInICsgY29uZi50YXJnZXQgKyAnXCJdJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRhcmdldCA9IGlmcmFtZU5hbWU7XG4gICAgaWZyYW1lID0gZ2V0SWZyYW1lKGlmcmFtZU5hbWUpO1xuICB9XG4gIGZvcm0uYXR0cigndGFyZ2V0JywgdGFyZ2V0KTtcbiAgdGhhdC50YXJnZXQgPSB0YXJnZXQ7XG4gIHRoYXQuaWZyYW1lID0gaWZyYW1lO1xuXG4gIHZhciBqc29ucENhbGxiYWNrID0gY29uZi5qc29ucENhbGxiYWNrIHx8ICdpZnJhbWVDYWxsYmFjaycgKyB0aW1lU3RhbXA7XG4gIHRoYXQuanNvbnBDYWxsYmFjayA9IGpzb25wQ2FsbGJhY2s7XG5cbiAgaWYgKCF0aGF0Lmpzb25wTWV0aG9kIHx8IHRoYXQuanNvbnBNZXRob2QgPT09ICdwb3N0Jykge1xuICAgIHZhciBpbnB1dCA9IGdldEhpZGRlbklucHV0KGZvcm0sIHRoYXQuanNvbnApO1xuICAgIGlucHV0LnZhbChjb25mLmpzb25wQWRkUGFyZW50ICsganNvbnBDYWxsYmFjayk7XG4gIH0gZWxzZSBpZiAodGhhdC5qc29ucE1ldGhvZCA9PT0gJ2dldCcpIHtcbiAgICB0aGF0LnVybCA9IHRoYXQudXJsXG4gICAgICArICh0aGF0LnVybC5pbmRleE9mKCc/JykgPj0gMCA/ICcmJyA6ICc/JylcbiAgICAgICsgdGhhdC5qc29ucFxuICAgICAgKyAnPSdcbiAgICAgICsganNvbnBDYWxsYmFjaztcbiAgfVxuXG4gIGlmICghY29uZi5qc29ucENhbGxiYWNrKSB7XG4gICAgdGhhdC5jYWxsYmFjayA9IGZ1bmN0aW9uIChycykge1xuICAgICAgaWYgKCQuaXNGdW5jdGlvbihjb25mLnN1Y2Nlc3MpKSB7XG4gICAgICAgIGNvbmYuc3VjY2VzcyhycywgdGhhdCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oY29uZi5jb21wbGV0ZSkpIHtcbiAgICAgICAgY29uZi5jb21wbGV0ZShycywgdGhhdCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvd1tqc29ucENhbGxiYWNrXSA9IHRoYXQuY2FsbGJhY2s7XG4gIH1cblxuICBmb3JtLmF0dHIoe1xuICAgIGFjdGlvbjogdGhhdC51cmwsXG4gICAgbWV0aG9kOiB0aGF0Lm1ldGhvZCxcbiAgfSk7XG5cbiAgZm9ybS5zdWJtaXQoKTtcblxuICByZXR1cm4gdGhhdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZnJhbWVQb3N0O1xuIiwiLyoqXG4gKiDlpITnkIbnvZHnu5zkuqTkupJcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2lvXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9pb1xuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmlvLmdldFNjcmlwdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvaW9cbiAqIHZhciAkaW8gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2lvJyk7XG4gKiBjb25zb2xlLmluZm8oJGlvLmdldFNjcmlwdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGdldFNjcmlwdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0Jyk7XG4gKi9cblxuZXhwb3J0cy5hamF4ID0gcmVxdWlyZSgnLi9hamF4Jyk7XG5leHBvcnRzLmdldFNjcmlwdCA9IHJlcXVpcmUoJy4vZ2V0U2NyaXB0Jyk7XG5leHBvcnRzLmlmcmFtZVBvc3QgPSByZXF1aXJlKCcuL2lmcmFtZVBvc3QnKTtcbmV4cG9ydHMubG9hZFNkayA9IHJlcXVpcmUoJy4vbG9hZFNkaycpO1xuIiwidmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJGdldCA9IHJlcXVpcmUoJy4uL29iai9nZXQnKTtcbnZhciAkZ2V0U2NyaXB0ID0gcmVxdWlyZSgnLi9nZXRTY3JpcHQnKTtcblxudmFyIHByb3BOYW1lID0gJ1NQT1JFX1NES19QUk9NSVNFJztcbnZhciBjYWNoZSA9IG51bGw7XG5cbi8qKlxuICogc2RrIOWKoOi9vee7n+S4gOWwgeijhVxuICogLSDlpJrmrKHosIPnlKjkuI3kvJrlj5Hotbfph43lpI3or7fmsYJcbiAqIEBtZXRob2QgaW8vbG9hZFNka1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5uYW1lIHNkayDlhajlsYDlj5jph4/lkI3np7BcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCBzY3JpcHQg5Zyw5Z2AXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2hhcnNldD0ndXRmLTgnXSBzY3JpcHQg57yW56CBXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkxvYWRdIHNjcmlwdCDliqDovb3lrozmiJDnmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGxvYWRTZGsgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2lvL2xvYWRTZGsnKTtcbiAqICRsb2FkU2RrKHtcbiAqICAgbmFtZTogJ1RlbmNlbnRDYXB0Y2hhJyxcbiAqICAgdXJsOiAnaHR0cHM6Ly9zc2wuY2FwdGNoYS5xcS5jb20vVENhcHRjaGEuanMnXG4gKiB9KS50aGVuKFRlbmNlbnRDYXB0Y2hhID0+IHt9KVxuICovXG52YXIgbG9hZFNkayA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgbmFtZTogJycsXG4gICAgdXJsOiAnJyxcbiAgICBjaGFyc2V0OiAndXRmLTgnLFxuICAgIHd0b3A6IHdpbmRvdyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgaWYgKHR5cGVvZiBjb25mLnd0b3AgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgY2FjaGUgPSBjb25mLnd0b3BbcHJvcE5hbWVdO1xuICAgIGlmICghY2FjaGUpIHtcbiAgICAgIGNhY2hlID0ge307XG4gICAgICBjb25mLnd0b3BbcHJvcE5hbWVdID0gY2FjaGU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNhY2hlID0ge307XG4gIH1cblxuICB2YXIgbmFtZSA9IGNvbmYubmFtZTtcbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmVxdWlyZSBwYXJhbWV0ZXI6IG9wdGlvbnMubmFtZScpKTtcbiAgfVxuICBpZiAoIWNvbmYudXJsKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignUmVxdWlyZSBwYXJhbWV0ZXI6IG9wdGlvbnMudXJsJykpO1xuICB9XG5cbiAgdmFyIHBtID0gY2FjaGVbbmFtZV07XG4gIGlmIChwbSkge1xuICAgIGlmIChwbS5zZGspIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocG0uc2RrKTtcbiAgICB9XG4gICAgcmV0dXJuIHBtO1xuICB9XG5cbiAgcG0gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICRnZXRTY3JpcHQoe1xuICAgICAgc3JjOiBjb25mLnVybCxcbiAgICAgIGNoYXJzZXQ6IGNvbmYuY2hhcnNldCxcbiAgICAgIHd0b3A6IGNvbmYud3RvcCxcbiAgICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2RrID0gJGdldChjb25mLnd0b3AsIG5hbWUpO1xuICAgICAgICBwbS5zZGsgPSBzZGs7XG4gICAgICAgIHJlc29sdmUoc2RrKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICBjYWNoZVtuYW1lXSA9IHBtO1xuXG4gIHJldHVybiBwbTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZFNkaztcbiIsIi8qKlxuICog6Kej5p6QIGxvY2F0aW9uLnNlYXJjaCDkuLrkuIDkuKpKU09O5a+56LGhXG4gKiAtIOaIluiAheiOt+WPluWFtuS4reafkOS4quWPguaVsFxuICogQG1ldGhvZCBsb2NhdGlvbi9nZXRRdWVyeVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkzlrZfnrKbkuLJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIOWPguaVsOWQjeensFxuICogQHJldHVybnMge09iamVjdHxTdHJpbmd9IHF1ZXJ55a+56LGhIHwg5Y+C5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRRdWVyeSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbG9jYXRpb24vZ2V0UXVlcnknKTtcbiAqIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdC9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSc7XG4gKiBjb25zb2xlLmluZm8oICRnZXRRdWVyeSh1cmwpICk7XG4gKiAvLyB7YmVpamluZyA6ICdodWFueWluZ25pJ31cbiAqIGNvbnNvbGUuaW5mbyggJGdldFF1ZXJ5KHVybCwgJ2JlaWppbmcnKSApO1xuICogLy8gJ2h1YW55aW5nbmknXG4gKi9cblxudmFyIGNhY2hlID0ge307XG5cbmZ1bmN0aW9uIGdldFF1ZXJ5KHVybCwgbmFtZSkge1xuICB2YXIgcXVlcnkgPSBjYWNoZVt1cmxdIHx8IHt9O1xuXG4gIGlmICh1cmwpIHtcbiAgICB2YXIgc2VhcmNoSW5kZXggPSB1cmwuaW5kZXhPZignPycpO1xuICAgIGlmIChzZWFyY2hJbmRleCA+PSAwKSB7XG4gICAgICB2YXIgc2VhcmNoID0gdXJsLnNsaWNlKHNlYXJjaEluZGV4ICsgMSwgdXJsLmxlbmd0aCk7XG4gICAgICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgvIy4qLywgJycpO1xuXG4gICAgICB2YXIgcGFyYW1zID0gc2VhcmNoLnNwbGl0KCcmJyk7XG4gICAgICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAoZ3JvdXApIHtcbiAgICAgICAgdmFyIGVxdWFsSW5kZXggPSBncm91cC5pbmRleE9mKCc9Jyk7XG4gICAgICAgIGlmIChlcXVhbEluZGV4ID4gMCkge1xuICAgICAgICAgIHZhciBrZXkgPSBncm91cC5zbGljZSgwLCBlcXVhbEluZGV4KTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBncm91cC5zbGljZShlcXVhbEluZGV4ICsgMSwgZ3JvdXAubGVuZ3RoKTtcbiAgICAgICAgICBxdWVyeVtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBjYWNoZVt1cmxdID0gcXVlcnk7XG4gIH1cblxuICBpZiAoIW5hbWUpIHtcbiAgICByZXR1cm4gcXVlcnk7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5W25hbWVdIHx8ICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFF1ZXJ5O1xuIiwiLyoqXG4gKiDlpITnkIblnLDlnYDlrZfnrKbkuLJcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2xvY2F0aW9uXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9sb2NhdGlvblxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmxvY2F0aW9uLmdldFF1ZXJ5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9sb2NhdGlvblxuICogdmFyICRsb2NhdGlvbiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbG9jYXRpb24nKTtcbiAqIGNvbnNvbGUuaW5mbygkbG9jYXRpb24uZ2V0UXVlcnkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRnZXRRdWVyeSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbG9jYXRpb24vZ2V0UXVlcnknKTtcbiAqL1xuXG5leHBvcnRzLmdldFF1ZXJ5ID0gcmVxdWlyZSgnLi9nZXRRdWVyeScpO1xuZXhwb3J0cy5zZXRRdWVyeSA9IHJlcXVpcmUoJy4vc2V0UXVlcnknKTtcbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG4iLCIvKipcbiAqIOino+aekFVSTOS4uuS4gOS4quWvueixoVxuICogQG1ldGhvZCBsb2NhdGlvbi9wYXJzZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBVUkzlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVSTOWvueixoVxuICogQHNlZSBbdXJsLXBhcnNlXShodHRwczovL2dpdGh1Yi5jb20vdW5zaGlmdGlvL3VybC1wYXJzZSlcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHBhcnNlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZScpO1xuICogJHBhcnNlKCdodHRwOi8vbG9jYWxob3N0L3Byb2ZpbGU/YmVpamluZz1odWFueWluZ25pIzEyMycpO1xuICogLy8ge1xuICogLy8gICBzbGFzaGVzOiB0cnVlLFxuICogLy8gICBwcm90b2NvbDogJ2h0dHA6JyxcbiAqIC8vICAgaGFzaDogJyMxMjMnLFxuICogLy8gICBxdWVyeTogJz9iZWlqaW5nPWh1YW55aW5nbmknLFxuICogLy8gICBwYXRobmFtZTogJy9wcm9maWxlJyxcbiAqIC8vICAgYXV0aDogJ3VzZXJuYW1lOnBhc3N3b3JkJyxcbiAqIC8vICAgaG9zdDogJ2xvY2FsaG9zdDo4MDgwJyxcbiAqIC8vICAgcG9ydDogJzgwODAnLFxuICogLy8gICBob3N0bmFtZTogJ2xvY2FsaG9zdCcsXG4gKiAvLyAgIHBhc3N3b3JkOiAncGFzc3dvcmQnLFxuICogLy8gICB1c2VybmFtZTogJ3VzZXJuYW1lJyxcbiAqIC8vICAgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAqIC8vICAgaHJlZjogJ2h0dHA6Ly91c2VybmFtZTpwYXNzd29yZEBsb2NhbGhvc3Q6ODA4MC9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSMxMjMnXG4gKiAvLyB9XG4gKi9cblxudmFyIFVybCA9IHJlcXVpcmUoJ3VybC1wYXJzZScpO1xuXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgcmV0dXJuIG5ldyBVcmwodXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsIi8qKlxuICog5bCG5Y+C5pWw6K6+572u5YiwIGxvY2F0aW9uLnNlYXJjaCDkuIpcbiAqIEBtZXRob2QgbG9jYXRpb24vc2V0UXVlcnlcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJM5a2X56ym5LiyXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnkg5Y+C5pWw5a+56LGhXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDmi7zmjqXlpb3lj4LmlbDnmoRVUkzlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNldFF1ZXJ5ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9sb2NhdGlvbi9zZXRRdWVyeScpO1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3QnKTsgLy8gJ2xvY2FsaG9zdCdcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0Jywge2E6IDF9KTsgLy8gJ2xvY2FsaG9zdD9hPTEnXG4gKiAkc2V0UXVlcnkoJycsIHthOiAxfSk7IC8vICc/YT0xJ1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2E6IDJ9KTsgLy8gJ2xvY2FsaG9zdD9hPTInXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEnLCB7YTogJyd9KTsgLy8gJ2xvY2FsaG9zdD9hPSdcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHthOiBudWxsfSk7IC8vICdsb2NhbGhvc3QnXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEnLCB7YjogMn0pOyAvLyAnbG9jYWxob3N0P2E9MSZiPTInXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEmYj0xJywge2E6IDIsIGI6IDN9KTsgLy8gJ2xvY2FsaG9zdD9hPTImYj0zJ1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3QjYT0xJywge2E6IDIsIGI6IDN9KTsgLy8gJ2xvY2FsaG9zdD9hPTImYj0zI2E9MSdcbiAqICRzZXRRdWVyeSgnI2E9MScsIHthOiAyLCBiOiAzfSk7IC8vICc/YT0yJmI9MyNhPTEnXG4gKi9cblxuZnVuY3Rpb24gc2V0UXVlcnkodXJsLCBxdWVyeSkge1xuICB1cmwgPSB1cmwgfHwgJyc7XG4gIGlmICghcXVlcnkpIHsgcmV0dXJuIHVybDsgfVxuXG4gIHZhciByZWcgPSAvKFtePyNdKikoXFw/ezAsMX1bXj8jXSopKCN7MCwxfS4qKS87XG4gIHJldHVybiB1cmwucmVwbGFjZShyZWcsIGZ1bmN0aW9uIChtYXRjaCwgcGF0aCwgc2VhcmNoLCBoYXNoKSB7XG4gICAgc2VhcmNoID0gc2VhcmNoIHx8ICcnO1xuICAgIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpO1xuXG4gICAgdmFyIHBhcmEgPSBzZWFyY2guc3BsaXQoJyYnKS5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwgcGFpcikge1xuICAgICAgdmFyIGFyciA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICAgIGlmIChhcnJbMF0pIHtcbiAgICAgICAgb2JqW2FyclswXV0gPSBhcnJbMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9KTtcblxuICAgIE9iamVjdC5rZXlzKHF1ZXJ5KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHF1ZXJ5W2tleV07XG4gICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWxldGUgcGFyYVtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYVtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgcGFyYUtleXMgPSBPYmplY3Qua2V5cyhwYXJhKTtcbiAgICBpZiAoIXBhcmFLZXlzLmxlbmd0aCkge1xuICAgICAgc2VhcmNoID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaCA9ICc/JyArIHBhcmFLZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgKyAnPScgKyBwYXJhW2tleV07XG4gICAgICB9KS5qb2luKCcmJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGggKyBzZWFyY2ggKyBoYXNoO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRRdWVyeTtcbiIsIi8qKlxuICog5Z+656GA5bel5Y6C5YWD5Lu257G7XG4gKiAtIOivpeexu+a3t+WQiOS6hiBbZXZ0L0V2ZW50c10oI2V2dC1ldmVudHMpIOeahOaWueazleOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAqIEBtb2R1bGUgbXZjL0Jhc2VcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGJhc2UgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL212Yy9iYXNlJyk7XG4gKlxuICogdmFyIENoaWxkQ2xhc3MgPSAkYmFzZS5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICBub2RlIDogbnVsbFxuICogICB9LFxuICogICBidWlsZCA6IGZ1bmN0aW9uKCkge1xuICogICAgIHRoaXMubm9kZSA9ICQodGhpcy5jb25mLm5vZGUpO1xuICogICB9LFxuICogICBzZXRFdmVudHMgOiBmdW5jdGlvbihhY3Rpb24pIHtcbiAqICAgICB2YXIgcHJveHkgPSB0aGlzLnByb3h5KCk7XG4gKiAgICAgdGhpcy5ub2RlW2FjdGlvbl0oJ2NsaWNrJywgcHJveHkoJ29uY2xpY2snKSk7XG4gKiAgIH0sXG4gKiAgIG9uY2xpY2sgOiBmdW5jdGlvbigpIHtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NsaWNrZWQnKTtcbiAqICAgICB0aGlzLnRyaWdnZXIoJ2NsaWNrJyk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIHZhciBvYmogPSBuZXcgQ2hpbGRDbGFzcyh7XG4gKiAgIG5vZGUgOiBkb2N1bWVudC5ib2R5XG4gKiB9KTtcbiAqXG4gKiBvYmoub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnb2JqIGlzIGNsaWNrZWQnKTtcbiAqIH0pO1xuICovXG5cbnZhciAkbWVyZ2UgPSByZXF1aXJlKCcuLi9vYmovbWVyZ2UnKTtcbnZhciAkdHlwZSA9IHJlcXVpcmUoJy4uL29iai90eXBlJyk7XG52YXIgJG5vb3AgPSByZXF1aXJlKCcuLi9mbi9ub29wJyk7XG52YXIgJGV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2dC9ldmVudHMnKTtcbnZhciAka2xhc3MgPSByZXF1aXJlKCcuL2tsYXNzJyk7XG52YXIgJHByb3h5ID0gcmVxdWlyZSgnLi9wcm94eScpO1xuXG52YXIgQmFzZSA9ICRrbGFzcyh7XG4gIC8qKlxuICAgKiDnsbvnmoTpu5jorqTpgInpobnlr7nosaHvvIznu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaFcbiAgICogQG5hbWUgQmFzZSNkZWZhdWx0c1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgbXZjL0Jhc2VcbiAgICovXG4gIGRlZmF1bHRzOiB7fSxcblxuICAvKipcbiAgICog57G755qE5a6e6ZmF6YCJ6aG577yMc2V0T3B0aW9ucyDmlrnms5XkvJrkv67mlLnov5nkuKrlr7nosaFcbiAgICogQG5hbWUgQmFzZSNjb25mXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBtdmMvQmFzZVxuICAgKi9cblxuICAvKipcbiAgICog5a2Y5pS+5Luj55CG5Ye95pWw55qE6ZuG5ZCIXG4gICAqIEBuYW1lIEJhc2UjYm91bmRcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9CYXNlXG4gICAqL1xuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuYnVpbGQoKTtcbiAgICB0aGlzLnNldEV2ZW50cygnb24nKTtcbiAgfSxcblxuICAvKipcbiAgICog5re35ZCI5Lyg5YWl55qE6YCJ6aG55LiO6buY6K6k6YCJ6aG577yM5re35ZCI5a6M5oiQ55qE6YCJ6aG55a+56LGh5Y+v6YCa6L+HIHRoaXMuY29uZiDlsZ7mgKforr/pl65cbiAgICogQG1ldGhvZCBCYXNlI3NldE9wdGlvbnNcbiAgICogQG1lbWJlcm9mIG12Yy9CYXNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g6YCJ6aG5XG4gICAqL1xuICBzZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXMuY29uZiA9IHRoaXMuY29uZiB8fCAkbWVyZ2Uoe30sIHRoaXMuZGVmYXVsdHMpO1xuICAgIGlmICgkdHlwZShvcHRpb25zKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgJG1lcmdlKHRoaXMuY29uZiwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOWFg+S7tuWIneWni+WMluaOpeWPo+WHveaVsO+8jOWunuS+i+WMluWFg+S7tuaXtuS8muiHquWKqOmmluWFiOiwg+eUqFxuICAgKiBAYWJzdHJhY3RcbiAgICogQG1ldGhvZCBCYXNlI2J1aWxkXG4gICAqIEBtZW1iZXJvZiBtdmMvQmFzZVxuICAgKi9cbiAgYnVpbGQ6ICRub29wLFxuXG4gIC8qKlxuICAgKiDlhYPku7bkuovku7bnu5HlrprmjqXlj6Plh73mlbDvvIzlrp7kvovljJblhYPku7bml7bkvJroh6rliqjlnKggYnVpbGQg5LmL5ZCO6LCD55SoXG4gICAqIEBtZXRob2QgQmFzZSNzZXRFdmVudHNcbiAgICogQG1lbWJlcm9mIG12Yy9CYXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbYWN0aW9uPSdvbiddIOe7keWumuaIluiAheenu+mZpOS6i+S7tueahOagh+iusO+8jOWPr+mAieWAvOacie+8mlsnb24nLCAnb2ZmJ11cbiAgICovXG4gIHNldEV2ZW50czogJG5vb3AsXG5cbiAgLyoqXG4gICAqIOWHveaVsOS7o+eQhu+8jOehruS/neWHveaVsOWcqOW9k+WJjeexu+WIm+W7uueahOWunuS+i+S4iuS4i+aWh+S4reaJp+ihjOOAglxuICAgKiDov5nkupvnlKjkuo7nu5Hlrprkuovku7bnmoTku6PnkIblh73mlbDpg73mlL7lnKjlsZ7mgKcgdGhpcy5ib3VuZCDkuIrjgIJcbiAgICogQG1ldGhvZCBCYXNlI3Byb3h5XG4gICAqIEBtZW1iZXJvZiBtdmMvQmFzZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW25hbWU9J3Byb3h5J10g5Ye95pWw5ZCN56ewXG4gICAqL1xuICBwcm94eTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgcHJveHlBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gJHByb3h5KHRoaXMsIG5hbWUsIHByb3h5QXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOenu+mZpOaJgOaciee7keWumuS6i+S7tu+8jOa4hemZpOeUqOS6jue7keWumuS6i+S7tueahOS7o+eQhuWHveaVsFxuICAgKiBAbWV0aG9kIEJhc2UjZGVzdHJveVxuICAgKiBAbWVtYmVyb2YgbXZjL0Jhc2VcbiAgICovXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldEV2ZW50cygnb2ZmJyk7XG4gICAgdGhpcy5vZmYoKTtcbiAgICB0aGlzLmJvdW5kID0gbnVsbDtcbiAgfSxcbn0pO1xuXG5CYXNlLm1ldGhvZHMoJGV2ZW50cy5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCIvKipcbiAqIOS6i+S7tuWvueixoee7keWumu+8jOWwhmV2ZW50c+S4reWMheWQq+eahOmUruWAvOWvueaYoOWwhOS4uuS7o+eQhueahOS6i+S7tuOAglxuICogLSDkuovku7bplK7lgLzlr7nmoLzlvI/lj6/ku6XkuLrvvJpcbiAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZCd9XG4gKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cbiAqIC0geydldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gKiBAbWV0aG9kIG12Yy9kZWxlZ2F0ZVxuICogQHBhcmFtIHtCb29sZWFufSBhY3Rpb24g5byAL+WFs+S7o+eQhu+8jOWPr+mAie+8mlsnb24nLCAnb2ZmJ13jgIJcbiAqIEBwYXJhbSB7T2JqZWN0fSByb290IOiuvue9ruS7o+eQhueahOagueiKgueCue+8jOWPr+S7peaYr+S4gOS4qmpxdWVyeeWvueixoe+8jOaIluiAheaYr+a3t+WQiOS6hiBzcG9yZS1raXQvcGFja2FnZXMvZXZ0L2V2ZW50cyDmlrnms5XnmoTlr7nosaHjgIJcbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMg5LqL5Lu26ZSu5YC85a+5XG4gKiBAcGFyYW0ge09iamVjdH0gYmluZCDmjIflrprkuovku7blh73mlbDnu5HlrprnmoTlr7nosaHvvIzlv4XpobvkuLpNVkPnsbvnmoTlrp7kvovjgIJcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdHlwZSA9IHJlcXVpcmUoJy4uL29iai90eXBlJyk7XG5cbmZ1bmN0aW9uIGRlbGVnYXRlKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKSB7XG4gIHZhciBwcm94eTtcbiAgdmFyIGRsZztcbiAgaWYgKCFyb290KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghYmluZCB8fCAkdHlwZShiaW5kLnByb3h5KSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb3h5ID0gYmluZC5wcm94eSgpO1xuICBhY3Rpb24gPSBhY3Rpb24gPT09ICdvbicgPyAnb24nIDogJ29mZic7XG4gIGRsZyA9IGFjdGlvbiA9PT0gJ29uJyA/ICdkZWxlZ2F0ZScgOiAndW5kZWxlZ2F0ZSc7XG4gIGV2ZW50cyA9ICRhc3NpZ24oe30sIGV2ZW50cyk7XG5cbiAgT2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgbWV0aG9kID0gZXZlbnRzW2hhbmRsZV07XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIHZhciBldmVudDtcbiAgICB2YXIgZm5zID0gW107XG4gICAgaGFuZGxlID0gaGFuZGxlLnNwbGl0KC9cXHMrLyk7XG5cbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGZucyA9IG1ldGhvZC5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbiAoZm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHByb3h5KGZuYW1lKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoJHR5cGUobWV0aG9kKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm5zID0gW21ldGhvZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudCA9IGhhbmRsZS5wb3AoKTtcblxuICAgIGlmIChoYW5kbGUubGVuZ3RoID49IDEpIHtcbiAgICAgIHNlbGVjdG9yID0gaGFuZGxlLmpvaW4oJyAnKTtcbiAgICAgIGlmICgkdHlwZShyb290W2RsZ10pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgIHJvb3RbZGxnXShzZWxlY3RvciwgZXZlbnQsIGZuKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgkdHlwZShyb290W2FjdGlvbl0pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcm9vdFthY3Rpb25dKGV2ZW50LCBmbik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiLyoqXG4gKiDlhbzlrrkgSUU4IOeahCBNVkMg566A5Y2V5a6e546wXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9tdmNcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL212Y1xuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0Lm12Yy5Nb2RlbCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvbXZjXG4gKiB2YXIgJG12YyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbXZjJyk7XG4gKiBjb25zb2xlLmluZm8oJG12Yy5Nb2RlbCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq57uE5Lu2XG4gKiB2YXIgJG1vZGVsID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9tdmMvbW9kZWwnKTtcbiAqL1xuXG5leHBvcnRzLmtsYXNzID0gcmVxdWlyZSgnLi9rbGFzcycpO1xuZXhwb3J0cy5kZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmV4cG9ydHMucHJveHkgPSByZXF1aXJlKCcuL3Byb3h5Jyk7XG5leHBvcnRzLkJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbmV4cG9ydHMuTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyk7XG5leHBvcnRzLlZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKipcbiAqIGNsYXNzIOeahCBFUzUg5a6e546wXG4gKiAtIOS4uuS7o+eggemAmui/hyBlc2xpbnQg5qOA5p+l5YGa5LqG5Lqb5L+u5pS5XG4gKiBAbW9kdWxlIG12Yy9rbGFzc1xuICogQHNlZSBba2xhc3NdKGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQva2xhc3MpXG4gKi9cblxudmFyIGZuVGVzdCA9ICgveHl6LykudGVzdChmdW5jdGlvbiAoKSB7IHZhciB4eXo7IHJldHVybiB4eXo7IH0pID8gKC9cXGJzdXByXFxiLykgOiAoLy4qLyk7XG52YXIgcHJvdG8gPSAncHJvdG90eXBlJztcblxuZnVuY3Rpb24gaXNGbihvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gd3JhcChrLCBmbiwgc3Vwcikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0bXAgPSB0aGlzLnN1cHI7XG4gICAgdGhpcy5zdXByID0gc3Vwcltwcm90b11ba107XG4gICAgdmFyIHVuZGVmID0ge30uZmFicmljYXRlZFVuZGVmaW5lZDtcbiAgICB2YXIgcmV0ID0gdW5kZWY7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc3VwciA9IHRtcDtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXhlY1Byb2Nlc3Mod2hhdCwgbywgc3Vwcikge1xuICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgd2hhdFtrXSA9IChcbiAgICAgICAgaXNGbihvW2tdKVxuICAgICAgICAmJiBpc0ZuKHN1cHJbcHJvdG9dW2tdKVxuICAgICAgICAmJiBmblRlc3QudGVzdChvW2tdKVxuICAgICAgKSA/IHdyYXAoaywgb1trXSwgc3VwcikgOiBvW2tdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBleHRlbmQobywgZnJvbVN1Yikge1xuICAvLyBtdXN0IHJlZGVmaW5lIG5vb3AgZWFjaCB0aW1lIHNvIGl0IGRvZXNuJ3QgaW5oZXJpdCBmcm9tIHByZXZpb3VzIGFyYml0cmFyeSBjbGFzc2VzXG4gIHZhciBOb29wID0gZnVuY3Rpb24gKCkge307XG4gIE5vb3BbcHJvdG9dID0gdGhpc1twcm90b107XG5cbiAgdmFyIHN1cHIgPSB0aGlzO1xuICB2YXIgcHJvdG90eXBlID0gbmV3IE5vb3AoKTtcbiAgdmFyIGlzRnVuY3Rpb24gPSBpc0ZuKG8pO1xuICB2YXIgX2NvbnN0cnVjdG9yID0gaXNGdW5jdGlvbiA/IG8gOiB0aGlzO1xuICB2YXIgX21ldGhvZHMgPSBpc0Z1bmN0aW9uID8ge30gOiBvO1xuXG4gIGZ1bmN0aW9uIGZuKCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemUpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZnJvbVN1YiB8fCBpc0Z1bmN0aW9uKSB7XG4gICAgICAgIHN1cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIF9jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGZuLm1ldGhvZHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgZXhlY1Byb2Nlc3MocHJvdG90eXBlLCBvYmosIHN1cHIpO1xuICAgIGZuW3Byb3RvXSA9IHByb3RvdHlwZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBmbi5tZXRob2RzLmNhbGwoZm4sIF9tZXRob2RzKS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmbjtcblxuICBmbi5leHRlbmQgPSBleHRlbmQ7XG4gIGZuLnN0YXRpY3MgPSBmdW5jdGlvbiAoc3BlYywgb3B0Rm4pIHtcbiAgICBzcGVjID0gdHlwZW9mIHNwZWMgPT09ICdzdHJpbmcnID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgIG9ialtzcGVjXSA9IG9wdEZuO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KCkpIDogc3BlYztcbiAgICBleGVjUHJvY2Vzcyh0aGlzLCBzcGVjLCBzdXByKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBmbltwcm90b10uaW1wbGVtZW50ID0gZm4uc3RhdGljcztcblxuICByZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGtsYXNzKG8pIHtcbiAgcmV0dXJuIGV4dGVuZC5jYWxsKGlzRm4obykgPyBvIDogZnVuY3Rpb24gKCkge30sIG8sIDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtsYXNzO1xuIiwiLyoqXG4gKiDmqKHlnovnsbs6IOWfuuehgOW3peWOguWFg+S7tuexu++8jOeUqOS6juWBmuaVsOaNruWMheijhe+8jOaPkOS+m+WPr+inguWvn+eahOaVsOaNruWvueixoVxuICogLSDnu6fmib/oh6ogW212Yy9iYXNlXSgjbXZjLWJhc2UpXG4gKiBAbW9kdWxlIG12Yy9Nb2RlbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDliJ3lp4vmlbDmja5cbiAqIEBleGFtcGxlXG4gKiB2YXIgJG1vZGVsID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9tdmMvbW9kZWwnKTtcbiAqXG4gKiB2YXIgbTEgPSBuZXcgJG1vZGVsKHtcbiAqICAgYSA6IDFcbiAqIH0pO1xuICogbTEub24oJ2NoYW5nZTphJywgZnVuY3Rpb24ocHJldkEpe1xuICogICBjb25zb2xlLmluZm8ocHJldkEpOyAvLyAxXG4gKiB9KTtcbiAqIG0xLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICogICBjb25zb2xlLmluZm8oJ21vZGVsIGNoYW5nZWQnKTtcbiAqIH0pO1xuICogbTEuc2V0KCdhJywgMik7XG4gKlxuICogdmFyIE15TW9kZWwgPSBNb2RlbC5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICBhIDogMixcbiAqICAgICBiIDogMlxuICogICB9LFxuICogICBldmVudHMgOiB7XG4gKiAgICAgJ2NoYW5nZTphJyA6ICd1cGRhdGVCJ1xuICogICB9LFxuICogICB1cGRhdGVCIDogZnVuY3Rpb24oKXtcbiAqICAgICB0aGlzLnNldCgnYicsIHRoaXMuZ2V0KCdhJykgKyAxKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogdmFyIG0yID0gbmV3IE15TW9kZWwoKTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7IC8vIDJcbiAqXG4gKiBtMi5zZXQoJ2EnLCAzKTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7IC8vIDRcbiAqXG4gKiBtMi5zZXQoJ2InLCA1KTtcbiAqIGNvbnNvbGUuaW5mbyhtMi5nZXQoJ2InKSk7IC8vIDVcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdHlwZSA9IHJlcXVpcmUoJy4uL29iai90eXBlJyk7XG52YXIgJGNsb25lRGVlcCA9IHJlcXVpcmUoJy4uL29iai9jbG9uZURlZXAnKTtcbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuLy8g5pWw5o2u5bGe5oCn5ZCN56ewXG52YXIgREFUQSA9ICdfX2RhdGFfXyc7XG5cbnZhciBzZXRBdHRyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIGRhdGEgPSB0aGlzW0RBVEFdO1xuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHByZXZWYWx1ZSA9IGRhdGFba2V5XTtcblxuICB2YXIgcHJvY2Vzc29yID0gdGhpcy5wcm9jZXNzb3JzW2tleV07XG4gIGlmIChwcm9jZXNzb3IgJiYgJHR5cGUocHJvY2Vzc29yLnNldCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YWx1ZSA9IHByb2Nlc3Nvci5zZXQodmFsdWUpO1xuICB9XG5cbiAgaWYgKHZhbHVlICE9PSBwcmV2VmFsdWUpIHtcbiAgICBkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICB0aGF0LmNoYW5nZWQgPSB0cnVlO1xuICAgIHRoYXQudHJpZ2dlcignY2hhbmdlOicgKyBrZXksIHByZXZWYWx1ZSk7XG4gIH1cbn07XG5cbnZhciBnZXRBdHRyID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgdmFsdWUgPSB0aGlzW0RBVEFdW2tleV07XG4gIGlmICgkdHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnKSB7XG4gICAgdmFsdWUgPSAkY2xvbmVEZWVwKHZhbHVlKTtcbiAgfSBlbHNlIGlmICgkdHlwZSh2YWx1ZSA9PT0gJ2FycmF5JykpIHtcbiAgICB2YWx1ZSA9ICRjbG9uZURlZXAodmFsdWUpO1xuICB9XG5cbiAgdmFyIHByb2Nlc3NvciA9IHRoaXMucHJvY2Vzc29yc1trZXldO1xuICBpZiAocHJvY2Vzc29yICYmICR0eXBlKHByb2Nlc3Nvci5nZXQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFsdWUgPSBwcm9jZXNzb3IuZ2V0KHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciByZW1vdmVBdHRyID0gZnVuY3Rpb24gKGtleSkge1xuICBkZWxldGUgdGhpc1tEQVRBXVtrZXldO1xuICB0aGlzLnRyaWdnZXIoJ2NoYW5nZTonICsga2V5KTtcbn07XG5cbnZhciBNb2RlbCA9ICRiYXNlLmV4dGVuZCh7XG5cbiAgLyoqXG4gICAqIOaooeWei+eahOm7mOiupOaVsOaNrlxuICAgKiAtIOe7keWumuWcqOWOn+Wei+S4iu+8jOS4jeimgeWcqOWunuS+i+S4reebtOaOpeS/ruaUuei/meS4quWvueixoeOAglxuICAgKiBAbmFtZSBNb2RlbCNkZWZhdWx0c1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgbXZjL01vZGVsXG4gICAqL1xuICBkZWZhdWx0czoge30sXG5cbiAgLyoqXG4gICAqIOaooeWei+eahOS6i+S7tue7keWumuWIl+ihqOOAglxuICAgKiAtIOe7keWumuWcqOWOn+Wei+S4iu+8jOS4jeimgeWcqOWunuS+i+S4reebtOaOpeS/ruaUuei/meS4quWvueixoeOAglxuICAgKiAtIOWwvemHj+WcqCBldmVudHMg5a+56LGh5a6a5LmJ5bGe5oCn5YWz6IGU5LqL5Lu244CCXG4gICAqIC0g5LqL5Lu25bqU5b2T5LuF55So5LqO6Ieq6Lqr5bGe5oCn55qE5YWz6IGU6L+Q566X44CCXG4gICAqIC0g5LqL5Lu257uR5a6a5qC85byP5Y+v5Lul5Li677yaXG4gICAqIC0geydldmVudCc6J21ldGhvZCd9XG4gICAqIC0geydldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gICAqIEBuYW1lIE1vZGVsI2V2ZW50c1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgbXZjL01vZGVsXG4gICAqL1xuICBldmVudHM6IHt9LFxuXG4gIC8qKlxuICAgKiDmqKHlnovmlbDmja7nmoTpooTlpITnkIblmajjgIJcbiAgICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogQG5hbWUgTW9kZWwjcHJvY2Vzc29yc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgbXZjL01vZGVsXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2Nlc3NvcnMgOiB7XG4gICAqICAgbmFtZSA6IHtcbiAgICogICAgIHNldCA6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICogICAgICAgcmV0dXJuIHZhbHVlO1xuICAgKiAgICAgfSxcbiAgICogICAgIGdldCA6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICogICAgICAgcmV0dXJuIHZhbHVlO1xuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICogfVxuICAgKi9cbiAgcHJvY2Vzc29yczoge30sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzW0RBVEFdID0ge307XG4gICAgdGhpcy5kZWZhdWx0cyA9ICRhc3NpZ24oe30sIHRoaXMuZGVmYXVsdHMpO1xuICAgIHRoaXMuZXZlbnRzID0gJGFzc2lnbih7fSwgdGhpcy5ldmVudHMpO1xuICAgIHRoaXMucHJvY2Vzc29ycyA9ICRhc3NpZ24oe30sIHRoaXMucHJvY2Vzc29ycyk7XG4gICAgdGhpcy5jaGFuZ2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmJ1aWxkKCk7XG4gICAgdGhpcy5kZWxlZ2F0ZSgnb24nKTtcbiAgICB0aGlzLnNldEV2ZW50cygnb24nKTtcbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOa3seW6pua3t+WQiOS8oOWFpeeahOmAiemhueS4jum7mOiupOmAiemhue+8jOeEtuWQjua3t+WQiOWIsOaVsOaNruWvueixoeS4rVxuICAgKiBAbWV0aG9kIE1vZGVsI3NldE9wdGlvbnNcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuICAgKi9cbiAgc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLnNldCh0aGlzLmRlZmF1bHRzKTtcbiAgICB0aGlzLnN1cHIob3B0aW9ucyk7XG4gICAgdGhpcy5zZXQob3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOe7keWumiBldmVudHMg5a+56LGh5YiX5Li+55qE5LqL5Lu244CC5Zyo5Yid5aeL5YyW5pe26Ieq5Yqo5omn6KGM5LqGIHRoaXMuZGVsZWdhdGUoJ29uJynjgIJcbiAgICogQG1ldGhvZCBNb2RlbCNkZWxlZ2F0ZVxuICAgKiBAbWVtYmVyb2YgbXZjL01vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbYWN0aW9uPSdvbiddIOe7keWumuWKqOS9nOagh+iusOOAguWPr+mAie+8mlsnb24nLCAnb2ZmJ11cbiAgICovXG4gIGRlbGVnYXRlOiBmdW5jdGlvbiAoYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpIHtcbiAgICBhY3Rpb24gPSBhY3Rpb24gfHwgJ29uJztcbiAgICByb290ID0gcm9vdCB8fCB0aGlzO1xuICAgIGV2ZW50cyA9IGV2ZW50cyB8fCB0aGlzLmV2ZW50cztcbiAgICBiaW5kID0gYmluZCB8fCB0aGlzO1xuICAgICRkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOaVsOaNrumihOWkhOeQhlxuICAgKiBAbWV0aG9kIE1vZGVsI3Byb2Nlc3NcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IOaooeWei+WxnuaAp+WQjeensOOAguaIluiAhUpTT07mlbDmja7jgIJcbiAgICogQHBhcmFtIHsqfSBbdmFsXSDmlbDmja5cbiAgICovXG4gIHByb2Nlc3M6IGZ1bmN0aW9uIChuYW1lLCBzcGVjKSB7XG4gICAgc3BlYyA9ICRhc3NpZ24oe1xuICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGdldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgfSwgc3BlYyk7XG4gICAgdGhpcy5wcm9jZXNzb3JzW25hbWVdID0gc3BlYztcbiAgfSxcblxuICAvKipcbiAgICog6K6+572u5qih5Z6L5pWw5o2uXG4gICAqIEBtZXRob2QgTW9kZWwjc2V0XG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBrZXkg5qih5Z6L5bGe5oCn5ZCN56ew44CC5oiW6ICFSlNPTuaVsOaNruOAglxuICAgKiBAcGFyYW0geyp9IFt2YWxdIOaVsOaNrlxuICAgKi9cbiAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICBpZiAoJHR5cGUoa2V5KSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgdiA9IGtleVtrXTtcbiAgICAgICAgc2V0QXR0ci5jYWxsKHRoaXMsIGssIHYpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzZXRBdHRyLmNhbGwodGhpcywga2V5LCB2YWwpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGFuZ2VkKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgdGhpcy5jaGFuZ2VkID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiDojrflj5bmqKHlnovlr7nlupTlsZ7mgKfnmoTlgLznmoTmi7fotJ1cbiAgICogLSDlpoLmnpzkuI3kvKDlj4LmlbDvvIzliJnnm7TmjqXojrflj5bmlbTkuKrmqKHlnovmlbDmja7jgIJcbiAgICogLSDlpoLmnpzlgLzmmK/kuIDkuKrlr7nosaHvvIzliJnor6Xlr7nosaHkvJrooqvmt7Hmi7fotJ3jgIJcbiAgICogQG1ldGhvZCBNb2RlbCNnZXRcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2tleV0g5qih5Z6L5bGe5oCn5ZCN56ew44CCXG4gICAqIEByZXR1cm5zIHsqfSDlsZ7mgKflkI3np7Dlr7nlupTnmoTlgLxcbiAgICovXG4gIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCF0aGlzW0RBVEFdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXRBdHRyLmNhbGwodGhpcywga2V5KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgdGhpcy5rZXlzKCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBkYXRhW2tdID0gZ2V0QXR0ci5jYWxsKHRoaXMsIGspO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICog6I635Y+W5qih5Z6L5LiK6K6+572u55qE5omA5pyJ6ZSu5ZCNXG4gICAqIEBtZXRob2QgTW9kZWwja2V5c1xuICAgKiBAbWVtYmVyb2YgbXZjL01vZGVsXG4gICAqIEByZXR1cm5zIHtBcnJheX0g5bGe5oCn5ZCN56ew5YiX6KGoXG4gICAqL1xuICBrZXlzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbREFUQV0gfHwge30pO1xuICB9LFxuXG4gIC8qKlxuICAgKiDliKDpmaTmqKHlnovkuIrnmoTkuIDkuKrplK5cbiAgICogQG1ldGhvZCBNb2RlbCNyZW1vdmVcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IOWxnuaAp+WQjeensOOAglxuICAgKi9cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmVtb3ZlQXR0ci5jYWxsKHRoaXMsIGtleSk7XG4gICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgfSxcblxuICAvKipcbiAgICog5riF6Zmk5qih5Z6L5Lit5omA5pyJ5pWw5o2uXG4gICAqIEBtZXRob2QgTW9kZWwjY2xlYXJcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKi9cbiAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzW0RBVEFdKS5mb3JFYWNoKHJlbW92ZUF0dHIsIHRoaXMpO1xuICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOmUgOavgeaooeWei++8jOS4jeS8muinpuWPkeS7u+S9lWNoYW5nZeS6i+S7tuOAglxuICAgKiAtIOaooeWei+mUgOavgeWQju+8jOaXoOazleWGjeiuvue9ruS7u+S9leaVsOaNruOAglxuICAgKiBAbWV0aG9kIE1vZGVsI2Rlc3Ryb3lcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKi9cbiAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGVsZWdhdGUoJ29mZicpO1xuICAgIHRoaXMuc3VwcigpO1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzW0RBVEFdID0gbnVsbDtcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwiLyoqXG4gKiDlh73mlbDku6PnkIbvvIznoa7kv53lh73mlbDlnKjlvZPliY3nsbvliJvlu7rnmoTlrp7kvovkuIrkuIvmlofkuK3miafooYzjgIJcbiAqIC0g6L+Z5Lqb55So5LqO57uR5a6a5LqL5Lu255qE5Luj55CG5Ye95pWw6YO95pS+5Zyo5bGe5oCnIGluc3RhbmNlLmJvdW5kIOS4iuOAglxuICogLSDlip/og73nsbvkvLwgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQg44CCXG4gKiAtIOWPr+S7peS8oOmAkumineWkluWPguaVsOS9nOS4uuWHveaVsOaJp+ihjOeahOm7mOiupOWPguaVsO+8jOi/veWKoOWcqOWunumZheWPguaVsOS5i+WQjuOAglxuICogQG1ldGhvZCBtdmMvcHJveHlcbiAqIEBwYXJhbSB7b2JqZWN0fSBpbnN0YW5jZSDlr7nosaHlrp7kvotcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZT0ncHJveHknXSDlh73mlbDlkI3np7BcbiAqL1xuXG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xuXG52YXIgQVAgPSBBcnJheS5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIHByb3h5KGluc3RhbmNlLCBuYW1lLCBwcm94eUFyZ3MpIHtcbiAgaWYgKCFpbnN0YW5jZS5ib3VuZCkge1xuICAgIGluc3RhbmNlLmJvdW5kID0ge307XG4gIH1cbiAgdmFyIGJvdW5kID0gaW5zdGFuY2UuYm91bmQ7XG4gIHByb3h5QXJncyA9IHByb3h5QXJncyB8fCBbXTtcbiAgcHJveHlBcmdzLnNoaWZ0KCk7XG4gIG5hbWUgPSBuYW1lIHx8ICdwcm94eSc7XG4gIGlmICgkdHlwZShib3VuZFtuYW1lXSkgIT09ICdmdW5jdGlvbicpIHtcbiAgICBib3VuZFtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkdHlwZShpbnN0YW5jZVtuYW1lXSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBUC5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZVtuYW1lXS5hcHBseShpbnN0YW5jZSwgYXJncy5jb25jYXQocHJveHlBcmdzKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4gYm91bmRbbmFtZV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJveHk7XG4iLCIvKipcbiAqIOinhuWbvuexuzog5Z+656GA5bel5Y6C5YWD5Lu257G777yM55So5LqO5a+56KeG5Zu+57uE5Lu255qE5YyF6KOFXG4gKiAtIOS+nei1liBqUXVlcnkvWmVwdG9cbiAqIC0g57un5om/6IeqIFttdmMvYmFzZV0oI212Yy1iYXNlKVxuICogQG1vZHVsZSBtdmMvVmlld1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gW29wdGlvbnMubm9kZV0g6YCJ5oup5Zmo5a2X56ym5Liy77yM5oiW6ICFRE9N5YWD57Sg77yM5oiW6ICFanF1ZXJ55a+56LGh77yM55So5LqO5oyH5a6a6KeG5Zu+55qE5qC56IqC54K544CCXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudGVtcGxhdGVdIOinhuWbvueahOaooeadv+Wtl+espuS4su+8jOS5n+WPr+S7peaYr+S4quWtl+espuS4suaVsOe7hO+8jOWIm+W7uuinhuWbvkRPTeaXtuS8muiHquWKqGpvaW7kuLrlrZfnrKbkuLLlpITnkIbjgIJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5ldmVudHNdIOeUqOS6juimhuebluS7o+eQhuS6i+S7tuWIl+ihqOOAglxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnJvbGVdIOinkuiJsuWvueixoeaYoOWwhOihqO+8jOWPr+aMh+WumnJvbGXmlrnms5Xov5Tlm57nmoRqcXVlcnnlr7nosaHjgIJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHZpZXcgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL212Yy92aWV3Jyk7XG4gKlxuICogdmFyIFRQTCA9IHtcbiAqICAgYm94IDogW1xuICogICAgICc8ZGl2PicsXG4gKiAgICAgICAnPGJ1dHRvbiByb2xlPVwiYnV0dG9uXCI+PC9idXR0b24+JyxcbiAqICAgICAnPC9kaXY+J1xuICogICBdXG4gKiB9O1xuICpcbiAqIHZhciBUZXN0VmlldyA9ICR2aWV3LmV4dGVuZCh7XG4gKiAgIGRlZmF1bHRzIDoge1xuICogICAgIHRlbXBsYXRlIDogVFBMLmJveFxuICogICB9LFxuICogICBldmVudHMgOiB7XG4gKiAgICAgJ2J1dHRvbiBjbGljaycgOiAnbWV0aG9kMSdcbiAqICAgfSxcbiAqICAgYnVpbGQgOiBmdW5jdGlvbigpe1xuICogICAgIHRoaXMucm9sZSgncm9vdCcpLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICogICB9LFxuICogICBtZXRob2QxIDogZnVuY3Rpb24oZXZ0KXtcbiAqICAgICBjb25zb2xlLmluZm8oMSk7XG4gKiAgIH0sXG4gKiAgIG1ldGhvZDIgOiBmdW5jdGlvbihldnQpe1xuICogICAgIGNvbnNvbGUuaW5mbygyKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogdmFyIG9iajEgPSBuZXcgVGVzdFZpZXcoKTtcbiAqIHZhciBvYmoyID0gbmV3IFRlc3RWaWV3KHtcbiAqICAgZXZlbnRzIDoge1xuICogICAgICdidXR0b24gY2xpY2snIDogJ21ldGhvZDInXG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIG9iajEucm9sZSgnYnV0dG9uJykudHJpZ2dlcignY2xpY2snKTsgLy8gMVxuICogb2JqMi5yb2xlKCdidXR0b24nKS50cmlnZ2VyKCdjbGljaycpOyAvLyAyXG4gKi9cblxudmFyICRiYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG52YXIgJGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuXG5mdW5jdGlvbiBnZXQkKCkge1xuICByZXR1cm4gKHdpbmRvdy4kIHx8IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbn1cblxuLy8g6I635Y+W6KeG5Zu+55qE5qC56IqC54K5XG52YXIgZ2V0Um9vdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyICQgPSBnZXQkKCk7XG4gIHZhciBjb25mID0gdGhpcy5jb25mO1xuICB2YXIgdGVtcGxhdGUgPSBjb25mLnRlbXBsYXRlO1xuICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICB2YXIgcm9vdCA9IG5vZGVzLnJvb3Q7XG4gIGlmICghcm9vdCkge1xuICAgIGlmIChjb25mLm5vZGUpIHtcbiAgICAgIHJvb3QgPSAkKGNvbmYubm9kZSk7XG4gICAgfVxuICAgIGlmICghcm9vdCB8fCAhcm9vdC5sZW5ndGgpIHtcbiAgICAgIGlmICgkLnR5cGUodGVtcGxhdGUpID09PSAnYXJyYXknKSB7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuam9pbignJyk7XG4gICAgICB9XG4gICAgICByb290ID0gJCh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIG5vZGVzLnJvb3QgPSByb290O1xuICB9XG4gIHJldHVybiByb290O1xufTtcblxudmFyIFZpZXcgPSAkYmFzZS5leHRlbmQoe1xuICAvKipcbiAgICog57G755qE6buY6K6k6YCJ6aG55a+56LGh77yM57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG4gICAqIEBuYW1lIFZpZXcjZGVmYXVsdHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9WaWV3XG4gICAqL1xuICBkZWZhdWx0czoge1xuICAgIG5vZGU6ICcnLFxuICAgIHRlbXBsYXRlOiAnJyxcbiAgICBldmVudHM6IHt9LFxuICAgIHJvbGU6IHt9LFxuICB9LFxuXG4gIC8qKlxuICAgKiDop4blm77nmoTku6PnkIbkuovku7bnu5HlrprliJfooajvvIznu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogLSDkuovku7bnu5HlrprmoLzlvI/lj6/ku6XkuLrvvJpcbiAgICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kJ31cbiAgICogLSB7J3NlbGVjdG9yIGV2ZW50JzonbWV0aG9kMSBtZXRob2QyJ31cbiAgICogQG5hbWUgVmlldyNldmVudHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9WaWV3XG4gICAqL1xuICBldmVudHM6IHt9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuXG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuYnVpbGQoKTtcbiAgICB0aGlzLmRlbGVnYXRlKCdvbicpO1xuICAgIHRoaXMuc2V0RXZlbnRzKCdvbicpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmt7Hluqbmt7flkIjkvKDlhaXnmoTpgInpobnkuI7pu5jorqTpgInpobnvvIzmt7flkIjlrozmiJDnmoTpgInpobnlr7nosaHlj6/pgJrov4cgdGhpcy5jb25mIOWxnuaAp+iuv+mXrlxuICAgKiBAbWV0aG9kIFZpZXcjc2V0T3B0aW9uc1xuICAgKiBAbWVtYmVyb2YgbXZjL1ZpZXdcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAgICovXG4gIHNldE9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyICQgPSBnZXQkKCk7XG4gICAgdGhpcy5jb25mID0gdGhpcy5jb25mIHx8ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRlZmF1bHRzKTtcbiAgICBpZiAoISQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLmNvbmYsIG9wdGlvbnMpO1xuICAgIHRoaXMuZXZlbnRzID0gJC5leHRlbmQoe30sIHRoaXMuZXZlbnRzLCBvcHRpb25zLmV2ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOe7keWumiBldmVudHMg5a+56LGh5YiX5Li+55qE5LqL5Lu244CCXG4gICAqIC0g5Zyo5Yid5aeL5YyW5pe26Ieq5Yqo5omn6KGM5LqGIHRoaXMuZGVsZWdhdGUoJ29uJynjgIJcbiAgICogQG1ldGhvZCBWaWV3I2RlbGVnYXRlXG4gICAqIEBtZW1iZXJvZiBtdmMvVmlld1xuICAgKiBAc2VlIFttdmMvZGVsZWdhdGVdKCNtdmMtZGVsZWdhdGUpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbYWN0aW9uPSdvbiddIOe7keWumuWKqOS9nOagh+iusOOAguWPr+mAie+8mlsnb24nLCAnb2ZmJ11cbiAgICovXG4gIGRlbGVnYXRlOiBmdW5jdGlvbiAoYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpIHtcbiAgICBhY3Rpb24gPSBhY3Rpb24gfHwgJ29uJztcbiAgICByb290ID0gcm9vdCB8fCB0aGlzLnJvbGUoJ3Jvb3QnKTtcbiAgICBldmVudHMgPSBldmVudHMgfHwgdGhpcy5ldmVudHM7XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICAkZGVsZWdhdGUoYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDojrflj5YgLyDorr7nva7op5LoibLlr7nosaHmjIflrprnmoQgalF1ZXJ5IOWvueixoeOAglxuICAgKiAtIOazqOaEj++8muiOt+WPluWIsOinkuiJsuWFg+e0oOWQju+8jOivpSBqUXVlcnkg5a+56LGh5Lya57yT5a2Y5Zyo6KeG5Zu+5a+56LGh5LitXG4gICAqIEBtZXRob2QgVmlldyNyb2xlXG4gICAqIEBtZW1iZXJvZiBtdmMvVmlld1xuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSDop5LoibLlr7nosaHlkI3np7BcbiAgICogQHBhcmFtIHtPYmplY3R9IFtlbGVtZW50XSDop5LoibLlr7nosaHmjIflrprnmoRkb23lhYPntKDmiJbogIUgalF1ZXJ5IOWvueixoeOAglxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSDop5LoibLlkI3lr7nlupTnmoQgalF1ZXJ5IOWvueixoeOAglxuICAgKi9cbiAgcm9sZTogZnVuY3Rpb24gKG5hbWUsIGVsZW1lbnQpIHtcbiAgICB2YXIgJCA9IGdldCQoKTtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgIHZhciByb290ID0gZ2V0Um9vdC5jYWxsKHRoaXMpO1xuICAgIHZhciByb2xlID0gdGhpcy5jb25mLnJvbGUgfHwge307XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICBpZiAobm9kZXNbbmFtZV0pIHtcbiAgICAgICAgZWxlbWVudCA9IG5vZGVzW25hbWVdO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWUgPT09ICdyb290Jykge1xuICAgICAgICBlbGVtZW50ID0gcm9vdDtcbiAgICAgIH0gZWxzZSBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQubGVuZ3RoKSB7XG4gICAgICAgIGlmIChyb2xlW25hbWVdKSB7XG4gICAgICAgICAgZWxlbWVudCA9IHJvb3QuZmluZChyb2xlW25hbWVdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50ID0gcm9vdC5maW5kKCdbcm9sZT1cIicgKyBuYW1lICsgJ1wiXScpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGVzW25hbWVdID0gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICBub2Rlc1tuYW1lXSA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50O1xuICB9LFxuXG4gIC8qKlxuICAgKiDmuIXpmaTop4blm77nvJPlrZjnmoTop5LoibLlr7nosaFcbiAgICogQG1ldGhvZCBWaWV3I3Jlc2V0Um9sZXNcbiAgICogQG1lbWJlcm9mIG12Yy9WaWV3XG4gICAqL1xuICByZXNldFJvbGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICQgPSBnZXQkKCk7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICAkLmVhY2gobm9kZXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAobmFtZSAhPT0gJ3Jvb3QnKSB7XG4gICAgICAgIG5vZGVzW25hbWVdID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIG5vZGVzW25hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiDplIDmr4Hop4blm77vvIzph4rmlL7lhoXlrZhcbiAgICogQG1ldGhvZCBWaWV3I2Rlc3Ryb3lcbiAgICogQG1lbWJlcm9mIG12Yy9WaWV3XG4gICAqL1xuICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kZWxlZ2F0ZSgnb2ZmJyk7XG4gICAgdGhpcy5zdXByKCk7XG4gICAgdGhpcy5yZXNldFJvbGVzKCk7XG4gICAgdGhpcy5ub2RlcyA9IHt9O1xuICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcbiIsIi8qKlxuICog5pWw5a2X55qE5Y2D5YiG5L2N6YCX5Y+35YiG6ZqU6KGo56S65rOVXG4gKiAtIElFOCDnmoQgdG9Mb2NhbFN0cmluZyDnu5nlh7rkuoblsI/mlbDngrnlkI4y5L2NOiBOLjAwXG4gKiBAbWV0aG9kIG51bS9jb21tYVxuICogQHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI5MDExMDIvaG93LXRvLXByaW50LWEtbnVtYmVyLXdpdGgtY29tbWFzLWFzLXRob3VzYW5kcy1zZXBhcmF0b3JzLWluLWphdmFzY3JpcHRcbiAqIEBwYXJhbSB7TnVtYmVyfSBudW0g5pWw5a2XXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDljYPliIbkvY3ooajnpLrnmoTmlbDlrZdcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvbW1hID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9udW0vY29tbWEnKTtcbiAqICRjb21tYSgxMjM0NTY3KTsgLy8nMSwyMzQsNTY3J1xuICovXG5cbmZ1bmN0aW9uIGNvbW1hKG51bSkge1xuICB2YXIgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tbWE7XG4iLCIvKipcbiAqIOS/ruato+ihpeS9jVxuICogQG1ldGhvZCBudW0vZml4VG9cbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gbnVtIOimgeihpeS9jeeahOaVsOWtl1xuICogQHBhcmFtIHtOdW1iZXJ9IFt3PTJdIHcg6KGl5L2N5pWw6YePXG4gKiBAcmV0dXJuIHtTdHJpbmd9IOe7j+i/h+ihpeS9jeeahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZml4VG8gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL251bS9maXhUbycpO1xuICogJGZpeFRvKDAsIDIpOyAvL3JldHVybiAnMDAnXG4gKi9cblxuZnVuY3Rpb24gZml4VG8obnVtLCB3KSB7XG4gIHZhciBzdHIgPSBudW0udG9TdHJpbmcoKTtcbiAgdyA9IE1hdGgubWF4KCh3IHx8IDIpIC0gc3RyLmxlbmd0aCArIDEsIDApO1xuICByZXR1cm4gbmV3IEFycmF5KHcpLmpvaW4oJzAnKSArIHN0cjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaXhUbztcbiIsIi8qKlxuICog5aSE55CG5pWw5a2X77yM5pWw5o2u6L2s5o2iXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9udW1cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL251bVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0Lm51bS5saW1pdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtXG4gKiB2YXIgJG51bSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtJyk7XG4gKiBjb25zb2xlLmluZm8oJG51bS5saW1pdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGxpbWl0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9udW0vbGltaXQnKTtcbiAqL1xuXG5leHBvcnRzLmNvbW1hID0gcmVxdWlyZSgnLi9jb21tYScpO1xuZXhwb3J0cy5maXhUbyA9IHJlcXVpcmUoJy4vZml4VG8nKTtcbmV4cG9ydHMubGltaXQgPSByZXF1aXJlKCcuL2xpbWl0Jyk7XG5leHBvcnRzLm51bWVyaWNhbCA9IHJlcXVpcmUoJy4vbnVtZXJpY2FsJyk7XG4iLCIvKipcbiAqIOmZkOWItuaVsOWtl+WcqOS4gOS4quiMg+WbtOWGhVxuICogQG1ldGhvZCBudW0vbGltaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSBudW0g6KaB6ZmQ5Yi255qE5pWw5a2XXG4gKiBAcGFyYW0ge051bWJlcn0gbWluIOacgOWwj+i+ueeVjOaVsOWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IG1heCDmnIDlpKfovrnnlYzmlbDlgLxcbiAqIEByZXR1cm4ge051bWJlcn0g57uP6L+H6ZmQ5Yi255qE5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRsaW1pdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtL2xpbWl0Jyk7XG4gKiAkbGltaXQoMSwgNSwgMTApOyAvLyA1XG4gKiAkbGltaXQoNiwgNSwgMTApOyAvLyA2XG4gKiAkbGltaXQoMTEsIDUsIDEwKTsgLy8gMTBcbiAqL1xuXG5mdW5jdGlvbiBsaW1pdChudW0sIG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChudW0sIG1pbiksIG1heCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGltaXQ7XG4iLCIvKipcbiAqIOWwhuaVsOaNruexu+Wei+i9rOS4uuaVtOaVsOaVsOWtl++8jOi9rOaNouWksei0peWImei/lOWbnuS4gOS4qum7mOiupOWAvFxuICogQG1ldGhvZCBudW0vbnVtZXJpY2FsXG4gKiBAcGFyYW0geyp9IHN0ciDopoHovazmjaLnmoTmlbDmja5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVmPTBdIOi9rOaNouWksei0peaXtueahOm7mOiupOWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IFtzeXM9MTBdIOi/m+WItlxuICogQHJldHVybiB7TnVtYmVyfSDovazmjaLogIzlvpfnmoTmlbTmlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG51bWVyaWNhbCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtL251bWVyaWNhbCcpO1xuICogJG51bWVyaWNhbCgnMTB4Jyk7IC8vIDEwXG4gKiAkbnVtZXJpY2FsKCd4MTAnKTsgLy8gMFxuICovXG5cbmZ1bmN0aW9uIG51bWVyaWNhbChzdHIsIGRlZiwgc3lzKSB7XG4gIGRlZiA9IGRlZiB8fCAwO1xuICBzeXMgPSBzeXMgfHwgMTA7XG4gIHJldHVybiBwYXJzZUludChzdHIsIHN5cykgfHwgZGVmO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG51bWVyaWNhbDtcbiIsIi8qKlxuICog5omp5bGV5bm26KaG55uW5a+56LGhXG4gKiBAbWV0aG9kIG9iai9hc3NpZ25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog6KaB5omp5bGV55qE5a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSDopoHmianlsZXnmoTlsZ7mgKfplK7lgLzlr7lcbiAqIEByZXR1cm5zIHtPYmplY3R9IOaJqeWxleWQjueahOa6kOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkYXNzaWduID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9vYmovYXNzaWduJyk7XG4gKiB2YXIgb2JqID0ge2E6IDEsIGI6IDJ9O1xuICogY29uc29sZS5pbmZvKCRhc3NpZ24ob2JqLCB7YjogMywgYzogNH0pKTsgLy8ge2E6IDEsIGI6IDMsIGM6IDR9XG4gKiBjb25zb2xlLmluZm8oJGFzc2lnbih7fSwgb2JqLCB7YjogMywgYzogNH0pKTsgLy8ge2E6IDEsIGI6IDMsIGM6IDR9XG4gKi9cblxuZnVuY3Rpb24gYXNzaWduKG9iaikge1xuICBvYmogPSBvYmogfHwge307XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgdmFyIHByb3A7XG4gICAgc291cmNlID0gc291cmNlIHx8IHt9O1xuICAgIGZvciAocHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwiLyoqXG4gKiDnroDmmJPlhYvpmoblr7nosaHvvIzkvJrkuKLlpLHlh73mlbDnrYnkuI3og73ooqsgSlNPTiDluo/liJfljJbnmoTlhoXlrrlcbiAqIEBtZXRob2Qgb2JqL2Nsb25lXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IOimgeWFi+mahueahOWvueixoVxuICogQHJldHVybnMge09iamVjdH0g5YWL6ZqG5ZCO55qE5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRjbG9uZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL2Nsb25lJyk7XG4gKiB2YXIgb2JqID0ge2E6IDEsIGI6IDJ9O1xuICogY29uc29sZS5pbmZvKCRjbG9uZShvYmopKTsgLy97YTogMSwgYjogMn1cbiAqL1xuXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCJ2YXIgJHR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcblxuLyoqXG4gKiDmt7HluqblhYvpmoblr7nosaHvvIzkvJrkv53nlZnlh73mlbDlvJXnlKhcbiAqIEBtZXRob2Qgb2JqL2Nsb25lRGVlcFxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0g6KaB5YWL6ZqG55qE5a+56LGhXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlhYvpmoblkI7nmoTlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNsb25lRGVlcCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL2Nsb25lRGVlcCcpO1xuICogdmFyIG9iaiA9IHthOiAxLCBiOiAyLCBjOiBmdW5jdGlvbiAoKSB7fX07XG4gKiBjb25zb2xlLmluZm8oJGNsb25lRGVlcChvYmopKTsgLy97YTogMSwgYjogMiwgYzogZnVuY3Rpb24gKCkge319XG4gKi9cblxudmFyIGNsb25lQXJyO1xudmFyIGNsb25lT2JqO1xudmFyIGNsb25lRGVlcDtcblxuY2xvbmVBcnIgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIHZhciBjYXJyID0gW107XG4gIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgIGNhcnJbaW5kZXhdID0gY2xvbmVEZWVwKGl0ZW0pO1xuICB9KTtcbiAgcmV0dXJuIGNhcnI7XG59O1xuXG5jbG9uZU9iaiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGNvYmogPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgaXRlbSA9IG9ialtrZXldO1xuICAgIGNvYmpba2V5XSA9IGNsb25lRGVlcChpdGVtKTtcbiAgfSk7XG4gIHJldHVybiBjb2JqO1xufTtcblxuY2xvbmVEZWVwID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgaWYgKCR0eXBlKGl0ZW0pID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIGNsb25lQXJyKGl0ZW0pO1xuICB9XG4gIGlmICgkdHlwZShpdGVtKSA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gY2xvbmVPYmooaXRlbSk7XG4gIH1cbiAgcmV0dXJuIGl0ZW07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGVlcDtcbiIsIi8qKlxuICog6KaG55uW5a+56LGh77yM5LiN5re75Yqg5paw55qE6ZSuXG4gKiBAbWV0aG9kIG9iai9jb3ZlclxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCDopoHopobnm5bnmoTlr7nosaFcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIOimgeimhueblueahOWxnuaAp+mUruWAvOWvuVxuICogQHJldHVybnMge09iamVjdH0g6KaG55uW5ZCO55qE5rqQ5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb3ZlciA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL2NvdmVyJyk7XG4gKiB2YXIgb2JqID0ge2E6IDEsIGI6IDJ9O1xuICogY29uc29sZS5pbmZvKCRjb3ZlcihvYmose2I6IDMsIGM6IDR9KSk7IC8ve2E6IDEsIGI6IDN9XG4gKi9cblxuZnVuY3Rpb24gY292ZXIoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgdmFyIG9iamVjdCA9IGFyZ3Muc2hpZnQoKTtcbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0Lmhhc093blByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0uaGFzT3duUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvdmVyO1xuIiwiLyoqXG4gKiDmn6Xmib7lr7nosaHot6/lvoTkuIrnmoTlgLwo566A5piT54mIKVxuICogQHNlZSBbbG9kYXNoLmdldF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MvNC4xNy4xNSNnZXQpXG4gKiBAbWV0aG9kIG9iai9maW5kXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IOimgeafpeaJvueahOWvueixoVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGgg6KaB5p+l5om+55qE6Lev5b6EXG4gKiBAcmV0dXJuIHsqfSDlr7nosaHot6/lvoTkuIrnmoTlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZpbmQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai9maW5kJyk7XG4gKiB2YXIgb2JqID0ge2E6e2I6e2M6MX19fTtcbiAqIGNvbnNvbGUuaW5mbygkZmluZChvYmosJ2EuYi5jJykpOyAvLyAxXG4gKiBjb25zb2xlLmluZm8oJGZpbmQob2JqLCdhLmMnKSk7IC8vIHVuZGVmaW5lZFxuICovXG5cbmZ1bmN0aW9uIGZpbmRQYXRoKG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCAnJztcbiAgaWYgKCFwYXRoKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcXVldWUgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBuYW1lO1xuICB2YXIgcG9zID0gb2JqZWN0O1xuXG4gIHdoaWxlIChxdWV1ZS5sZW5ndGgpIHtcbiAgICBuYW1lID0gcXVldWUuc2hpZnQoKTtcbiAgICBpZiAoIXBvc1tuYW1lXSkge1xuICAgICAgcmV0dXJuIHBvc1tuYW1lXTtcbiAgICB9XG4gICAgcG9zID0gcG9zW25hbWVdO1xuICB9XG5cbiAgcmV0dXJuIHBvcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kUGF0aDtcbiIsInZhciAkdHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xudmFyICRrZXlQYXRoU3BsaXQgPSByZXF1aXJlKCcuLi9zdHIva2V5UGF0aFNwbGl0Jyk7XG5cbi8qKlxuICog5LuO5a+56LGh6Lev5b6E5Y+W5YC8KOeugOaYk+eJiClcbiAqIEBtZXRob2Qgb2JqL2dldFxuICogQHNlZSBbbG9kYXNoLmdldF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MvNC4xNy4xNSNnZXQpXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIOimgeWPluWAvOeahOWvueixoeaIluiAheaVsOe7hFxuICogQHBhcmFtIHtTdHJpbmd9IHhwYXRoIOimgeWPluWAvOeahOi3r+W+hFxuICogQHBhcmFtIHtBbnl9IFtkZWZhdWx0VmFsdWVdIOWAvOS4uiB1bmRlZmluZWQg5YiZ5Y+W5q2k6buY6K6k5YC8XG4gKiBAcmV0dXJucyB7QW55fSDlj5blvpfnmoTlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL2dldCcpO1xuICogdmFyIG9iaiA9IHthOiB7Yjoge2M6IDF9fX07XG4gKiBjb25zb2xlLmluZm8oJGdldChvYmosICdhLmIuYycpOyAvLyAxXG4gKiBjb25zb2xlLmluZm8oJGdldChvYmosICdlJyk7IC8vIHVuZGVmaW5lZFxuICogY29uc29sZS5pbmZvKCRnZXQob2JqLCAnZScsIDMpOyAvLyAzXG4gKiB2YXIgYXJyID0gWzEsIHthOiBbMiwgM119XTtcbiAqIGNvbnNvbGUuaW5mbygkZ2V0KGFyciwgJ1sxXS5hWzFdJyk7IC8vIDNcbiAqL1xuXG4vLyDlvJXnlKggbG9kYXNoL2dldCDkvJrlvJXlhaXotoXov4cxMGtiIOS7o+egge+8jOeUqOi/meS4quaWueazleadpeeyvueugCBzZGsg5L2T56evXG5cbmZ1bmN0aW9uIGdldChvYmosIHhwYXRoLCBkZWYpIHtcbiAgaWYgKCFvYmopIHJldHVybiB1bmRlZmluZWQ7XG4gIGlmICh0eXBlb2YgeHBhdGggIT09ICdzdHJpbmcnKSByZXR1cm4gdW5kZWZpbmVkO1xuICB2YXIgYXJyWHBhdGggPSAka2V5UGF0aFNwbGl0KHhwYXRoKTtcbiAgdmFyIHBvaW50ID0gb2JqO1xuICB2YXIgbGVuID0gYXJyWHBhdGgubGVuZ3RoO1xuICB2YXIgaW5kZXg7XG4gIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbjsgaW5kZXggKz0gMSkge1xuICAgIHZhciBrZXkgPSBhcnJYcGF0aFtpbmRleF07XG4gICAgdmFyIG90eXBlID0gJHR5cGUocG9pbnQpO1xuICAgIGlmIChvdHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgaWYgKC9eXFxkKyQvLnRlc3Qoa2V5KSkge1xuICAgICAgICBrZXkgPSBwYXJzZUludChrZXksIDEwKTtcbiAgICAgIH1cbiAgICAgIHBvaW50ID0gcG9pbnRba2V5XTtcbiAgICB9IGVsc2UgaWYgKHBvaW50ID09PSBudWxsKSB7XG4gICAgICBwb2ludCA9IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBvaW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgcG9pbnQgPSBwb2ludFtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludCA9IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgdmFsdWUgPSBwb2ludDtcbiAgaWYgKCR0eXBlKHZhbHVlKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoJHR5cGUoZGVmKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhbHVlID0gZGVmO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwiLyoqXG4gKiDlr7nosaHlpITnkIbkuI7liKTmlq1cbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL29ialxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvb2JqXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQub2JqLnR5cGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29ialxuICogdmFyICRvYmogPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iaicpO1xuICogY29uc29sZS5pbmZvKCRvYmoudHlwZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHR5cGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai90eXBlJyk7XG4gKi9cblxuZXhwb3J0cy5hc3NpZ24gPSByZXF1aXJlKCcuL2Fzc2lnbicpO1xuZXhwb3J0cy5jbG9uZSA9IHJlcXVpcmUoJy4vY2xvbmUnKTtcbmV4cG9ydHMuY2xvbmVEZWVwID0gcmVxdWlyZSgnLi9jbG9uZURlZXAnKTtcbmV4cG9ydHMubWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG5leHBvcnRzLmNvdmVyID0gcmVxdWlyZSgnLi9jb3ZlcicpO1xuZXhwb3J0cy5maW5kID0gcmVxdWlyZSgnLi9maW5kJyk7XG5leHBvcnRzLmdldCA9IHJlcXVpcmUoJy4vZ2V0Jyk7XG5leHBvcnRzLnNldCA9IHJlcXVpcmUoJy4vc2V0Jyk7XG5leHBvcnRzLnR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcbiIsInZhciAkdHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xuXG52YXIgbWVyZ2VBcnI7XG52YXIgbWVyZ2VPYmo7XG5cbnZhciBpc09iaiA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHJldHVybiAoXG4gICAgaXRlbVxuICAgICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0J1xuICApO1xufTtcblxudmFyIG1lcmdlSXRlbSA9IGZ1bmN0aW9uIChvcmlnaW4sIGl0ZW0sIGtleSkge1xuICB2YXIgcHJldiA9IG9yaWdpbltrZXldO1xuICBpZiAoXG4gICAgJHR5cGUocHJldikgPT09ICdhcnJheSdcbiAgICAmJiAkdHlwZShpdGVtKSA9PT0gJ2FycmF5J1xuICApIHtcbiAgICBtZXJnZUFycihwcmV2LCBpdGVtKTtcbiAgfSBlbHNlIGlmIChcbiAgICBpc09iaihwcmV2KVxuICAgICYmIGlzT2JqKGl0ZW0pXG4gICkge1xuICAgIG1lcmdlT2JqKHByZXYsIGl0ZW0pO1xuICB9IGVsc2Uge1xuICAgIG9yaWdpbltrZXldID0gaXRlbTtcbiAgfVxufTtcblxubWVyZ2VBcnIgPSBmdW5jdGlvbiAob3JpZ2luLCBzb3VyY2UpIHtcbiAgc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgbWVyZ2VJdGVtKG9yaWdpbiwgaXRlbSwgaW5kZXgpO1xuICB9KTtcbn07XG5cbm1lcmdlT2JqID0gZnVuY3Rpb24gKG9yaWdpbiwgc291cmNlKSB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgbWVyZ2VJdGVtKG9yaWdpbiwgc291cmNlW2tleV0sIGtleSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiDmt7Hluqbmt7flkIjmupDlr7nosaHvvIzkvJrkv53nlZnlh73mlbDlvJXnlKhcbiAqIEBtZXRob2Qgb2JqL21lcmdlXG4gKiBAcGFyYW0ge09iamVjdH0gb3JpZ2luIOimgea3t+WQiOeahOa6kOWvueixoVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCDopoHmt7flkIjnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtPYmplY3R9IOa3t+WQiOS5i+WQjueahOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkbWVyZ2UgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai9tZXJnZScpO1xuICogdmFyIG9yaWdpbiA9IHthOntiOntjOjF9fX07XG4gKiB2YXIgdGFyZ2V0ID0ge2E6e2I6e2Q6Mn19fTtcbiAqIGNvbnNvbGUuaW5mbygkbWVyZ2Uob3JpZ2luLCB0YXJnZXQpKTtcbiAqIC8vIHthOntiOntjOjEsZDoyfX19O1xuICovXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAob3JpZ2luKSB7XG4gIGlmICh0eXBlb2Ygb3JpZ2luICE9PSAnb2JqZWN0JykgcmV0dXJuIG9yaWdpbjtcbiAgdmFyIHJlc3RzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmVzdHMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKCR0eXBlKHNvdXJjZSkgPT09ICdhcnJheScpIHtcbiAgICAgIG1lcmdlQXJyKG9yaWdpbiwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqKHNvdXJjZSkpIHtcbiAgICAgIG1lcmdlT2JqKG9yaWdpbiwgc291cmNlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3JpZ2luO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsInZhciAkdHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xudmFyICRnZXQgPSByZXF1aXJlKCcuL2dldCcpO1xudmFyICRrZXlQYXRoU3BsaXQgPSByZXF1aXJlKCcuLi9zdHIva2V5UGF0aFNwbGl0Jyk7XG5cbi8qKlxuICog5ZCR5a+56LGh6Lev5b6E6K6+572u5YC8KOeugOaYk+eJiClcbiAqIEBtZXRob2Qgb2JqL3NldFxuICogQHNlZSBbbG9kYXNoLnNldF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MvNC4xNy4xNSNzZXQpXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIOimgeiuvue9ruWAvOeahOWvueixoeaIluiAheaVsOe7hFxuICogQHBhcmFtIHtTdHJpbmd9IHhwYXRoIOimgeWPluWAvOeahOi3r+W+hFxuICogQHBhcmFtIHtBbnl9IHZhbHVlIOimgeiuvue9rueahOWAvFxuICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAqIEBleGFtcGxlXG4gKiB2YXIgJHNldCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL3NldCcpO1xuICogdmFyIG9iaiA9IHthOiB7Yjoge2M6IDF9fX07XG4gKiAkc2V0KG9iaiwgJ2EuYi5jJywgMik7XG4gKiBjb25zb2xlLmluZm8ob2JqLmEuYi5jKSAvLyAyXG4gKi9cbmZ1bmN0aW9uIHNldChvYmosIHhwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikgcmV0dXJuO1xuICBpZiAodHlwZW9mIHhwYXRoICE9PSAnc3RyaW5nJykgcmV0dXJuO1xuICBpZiAoIXhwYXRoKSByZXR1cm47XG4gIHZhciBhcnJYcGF0aCA9ICRrZXlQYXRoU3BsaXQoeHBhdGgpO1xuICB2YXIga2V5ID0gYXJyWHBhdGgucG9wKCk7XG4gIHZhciB0YXJnZXQgPSAkZ2V0KG9iaiwgYXJyWHBhdGguam9pbignLicpKTtcbiAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgaWYgKCR0eXBlKHRhcmdldCkgPT09ICdhcnJheScpIHtcbiAgICBpZiAoL15cXGQrJC8udGVzdChrZXkpKSB7XG4gICAgICBrZXkgPSBwYXJzZUludChrZXksIDEwKTtcbiAgICB9XG4gICAgaWYgKCR0eXBlKHZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKCR0eXBlKHRhcmdldCkgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKCR0eXBlKHZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0O1xuIiwiLyoqXG4gKiDojrflj5bmlbDmja7nsbvlnotcbiAqIEBtZXRob2Qgb2JqL3R5cGVcbiAqIEBwYXJhbSB7Kn0gaXRlbSDku7vkvZXnsbvlnovmlbDmja5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IOWvueixoeexu+Wei1xuICogQGV4YW1wbGVcbiAqIHZhciAkdHlwZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL3R5cGUnKTtcbiAqICR0eXBlKHt9KTsgLy8gJ29iamVjdCdcbiAqICR0eXBlKDEpOyAvLyAnbnVtYmVyJ1xuICogJHR5cGUoJycpOyAvLyAnc3RyaW5nJ1xuICogJHR5cGUoZnVuY3Rpb24oKXt9KTsgLy8gJ2Z1bmN0aW9uJ1xuICogJHR5cGUoKTsgLy8gJ3VuZGVmaW5lZCdcbiAqICR0eXBlKG51bGwpOyAvLyAnbnVsbCdcbiAqICR0eXBlKG5ldyBEYXRlKCkpOyAvLyAnZGF0ZSdcbiAqICR0eXBlKC9hLyk7IC8vICdyZWdleHAnXG4gKiAkdHlwZShTeW1ib2woJ2EnKSk7IC8vICdzeW1ib2wnXG4gKiAkdHlwZSh3aW5kb3cpIC8vICd3aW5kb3cnXG4gKiAkdHlwZShkb2N1bWVudCkgLy8gJ2h0bWxkb2N1bWVudCdcbiAqICR0eXBlKGRvY3VtZW50LmJvZHkpIC8vICdodG1sYm9keWVsZW1lbnQnXG4gKiAkdHlwZShkb2N1bWVudC5oZWFkKSAvLyAnaHRtbGhlYWRlbGVtZW50J1xuICogJHR5cGUoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpKSAvLyAnaHRtbGNvbGxlY3Rpb24nXG4gKiAkdHlwZShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JylbMF0pIC8vICdodG1sZGl2ZWxlbWVudCdcbiAqL1xuXG5mdW5jdGlvbiB0eXBlKGl0ZW0pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAuY2FsbChpdGVtKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL15cXFtvYmplY3RcXHMqfFxcXSQvZ2ksICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29udHJvbC1yZWdleCAqL1xuLyoqXG4gKiDojrflj5blrZfnrKbkuLLplb/luqbvvIzkuIDkuKrkuK3mlofnrpcy5Liq5a2X56ymXG4gKiBAbWV0aG9kIHN0ci9iTGVuZ3RoXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOimgeiuoeeul+mVv+W6pueahOWtl+espuS4slxuICogQHJldHVybnMge051bWJlcn0g5a2X56ym5Liy6ZW/5bqmXG4gKiBAZXhhbXBsZVxuICogdmFyICRiTGVuZ3RoID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvYkxlbmd0aCcpO1xuICogJGJMZW5ndGgoJ+S4reaWh2NjJyk7IC8vIDZcbiAqL1xuXG5mdW5jdGlvbiBiTGVuZ3RoKHN0cikge1xuICB2YXIgYU1hdGNoO1xuICBpZiAoIXN0cikge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGFNYXRjaCA9IHN0ci5tYXRjaCgvW15cXHgwMC1cXHhmZl0vZyk7XG4gIHJldHVybiAoc3RyLmxlbmd0aCArICghYU1hdGNoID8gMCA6IGFNYXRjaC5sZW5ndGgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiTGVuZ3RoO1xuIiwiLyoqXG4gKiDlhajop5LlrZfnrKbovazljYrop5LlrZfnrKZcbiAqIEBtZXRob2Qgc3RyL2RiY1RvU2JjXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWMheWQq+S6huWFqOinkuWtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g57uP6L+H6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRkYmNUb1NiYyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL2RiY1RvU2JjJyk7XG4gKiAkZGJjVG9TYmMoJ++8s++8oe+8oe+8s++8pO+8pu+8s++8oe+8pO+8picpOyAvLyAnU0FBU0RGU0FERidcbiAqL1xuXG5mdW5jdGlvbiBkYmNUb1NiYyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFx1ZmYwMS1cXHVmZjVlXS9nLCBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGEuY2hhckNvZGVBdCgwKSAtIDY1MjQ4KTtcbiAgfSkucmVwbGFjZSgvXFx1MzAwMC9nLCAnICcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRiY1RvU2JjO1xuIiwiLyoqXG4gKiDop6PnoIFIVE1M77yM5bCG5a6e5L2T5a2X56ym6L2s5o2i5Li6SFRNTOWtl+esplxuICogQG1ldGhvZCBzdHIvZGVjb2RlSFRNTFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDlkKvmnInlrp7kvZPlrZfnrKbnmoTlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IEhUTUzlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGRlY29kZUhUTUwgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9kZWNvZGVIVE1MJyk7XG4gKiAkZGVjb2RlSFRNTCgnJmFtcDsmbHQ7Jmd0OyZxdW90OyYjMzk7JiMzMjsnKTsgLy8gJyY8PlwiXFwnICdcbiAqL1xuXG5mdW5jdGlvbiBkZWNvZGVIVE1MKHN0cikge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlY29kZUhUTUwgbmVlZCBhIHN0cmluZyBhcyBwYXJhbWV0ZXInKTtcbiAgfVxuICByZXR1cm4gc3RyLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgIC5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgLnJlcGxhY2UoLyYjMzk7L2csICdcXCcnKVxuICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgJ1xcdTAwQTAnKVxuICAgIC5yZXBsYWNlKC8mIzMyOy9nLCAnXFx1MDAyMCcpXG4gICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb2RlSFRNTDtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnRyb2wtcmVnZXggKi9cbi8qKlxuICog57yW56CBSFRNTO+8jOWwhkhUTUzlrZfnrKbovazkuLrlrp7kvZPlrZfnrKZcbiAqIEBtZXRob2Qgc3RyL2VuY29kZUhUTUxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg5ZCr5pyJSFRNTOWtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g57uP6L+H6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRlbmNvZGVIVE1MID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvZW5jb2RlSFRNTCcpO1xuICogJGVuY29kZUhUTUwoYCY8PlwiXFwnIGApOyAvLyAnJmFtcDsmbHQ7Jmd0OyZxdW90OyYjMzk7JiMzMjsnXG4gKi9cblxuZnVuY3Rpb24gZW5jb2RlSFRNTChzdHIpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdlbmNvZGVIVE1MIG5lZWQgYSBzdHJpbmcgYXMgcGFyYW1ldGVyJyk7XG4gIH1cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoLycvZywgJyYjMzk7JylcbiAgICAucmVwbGFjZSgvXFx1MDBBMC9nLCAnJm5ic3A7JylcbiAgICAucmVwbGFjZSgvKFxcdTAwMjB8XFx1MDAwQnxcXHUyMDI4fFxcdTIwMjl8XFxmKS9nLCAnJiMzMjsnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbmNvZGVIVE1MO1xuIiwiLyoqXG4gKiDojrflj5YzNui/m+WItumaj+acuuWtl+espuS4slxuICogQG1ldGhvZCBzdHIvZ2V0Um5kMzZcbiAqIEBwYXJhbSB7RmxvYXR9IFtybmRdIOmaj+acuuaVsO+8jOS4jeS8oOWImeeUn+aIkOS4gOS4qumaj+acuuaVsFxuICogQHJldHVybiB7U3RyaW5nfSDovazmiJDkuLozNui/m+WItueahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0Um5kMzYgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9nZXRSbmQzNicpO1xuICogJGdldFJuZDM2KDAuNTgxMDc2NjgzMjU5MDQ0Nik7IC8vICdreDJwb3p6OXJnZidcbiAqL1xuXG5mdW5jdGlvbiBnZXRSbmQzNihybmQpIHtcbiAgcm5kID0gcm5kIHx8IE1hdGgucmFuZG9tKCk7XG4gIHJldHVybiBybmQudG9TdHJpbmcoMzYpLnJlcGxhY2UoL14wLi8sICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSbmQzNjtcbiIsIi8qKlxuICog6I635Y+WMzbov5vliLbml6XmnJ/lrZfnrKbkuLJcbiAqIEBtZXRob2Qgc3RyL2dldFRpbWUzNlxuICogQHBhcmFtIHtEYXRlfSBbZGF0ZV0g56ym5ZCI6KeE6IyD55qE5pel5pyf5a2X56ym5Liy5oiW6ICF5pWw5a2X77yM5LiN5Lyg5Y+C5pWw5YiZ5L2/55So5b2T5YmN5a6i5oi356uv5pe26Ze0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IOi9rOaIkOS4ujM26L+b5Yi255qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRUaW1lMzYgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9nZXRUaW1lMzYnKTtcbiAqICRnZXRUaW1lMzYoJzIwMjAnKTsgLy8gJ2s0dWphaW8wJ1xuICovXG5cbmZ1bmN0aW9uIGdldFRpbWUzNihkYXRlKSB7XG4gIGRhdGUgPSBkYXRlID8gbmV3IERhdGUoZGF0ZSkgOiBuZXcgRGF0ZSgpO1xuICByZXR1cm4gZGF0ZS5nZXRUaW1lKCkudG9TdHJpbmcoMzYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRpbWUzNjtcbiIsIi8qKlxuICog55Sf5oiQ5LiA5Liq5LiN5LiO5LmL5YmN6YeN5aSN55qE6ZqP5py65a2X56ym5LiyXG4gKiBAbWV0aG9kIHN0ci9nZXRVbmlxdWVLZXlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOmaj+acuuWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0VW5pcXVlS2V5ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvZ2V0VW5pcXVlS2V5Jyk7XG4gKiAkZ2V0VW5pcXVlS2V5KCk7IC8vICcxNjZhYWUxZmE5ZidcbiAqL1xuXG52YXIgdGltZSA9ICtuZXcgRGF0ZSgpO1xudmFyIGluZGV4ID0gMDtcblxuZnVuY3Rpb24gZ2V0VW5pcXVlS2V5KCkge1xuICBpbmRleCArPSAxO1xuICByZXR1cm4gKHRpbWUgKyAoaW5kZXgpKS50b1N0cmluZygxNik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VW5pcXVlS2V5O1xuIiwiLyoqXG4gKiDlsIbpqbzls7DmoLzlvI/lj5jkuLrov57lrZfnrKbmoLzlvI9cbiAqIEBtZXRob2Qgc3RyL2h5cGhlbmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpqbzls7DmoLzlvI/nmoTlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IOi/nuWtl+espuagvOW8j+eahOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkaHlwaGVuYXRlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvaHlwaGVuYXRlJyk7XG4gKiAkaHlwaGVuYXRlKCdsaWJLaXRTdHJIeXBoZW5hdGUnKTsgLy8gJ2xpYi1raXQtc3RyLWh5cGhlbmF0ZSdcbiAqL1xuXG5mdW5jdGlvbiBoeXBoZW5hdGUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvW0EtWl0vZywgZnVuY3Rpb24gKCQwKSB7XG4gICAgcmV0dXJuICctJyArICQwLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh5cGhlbmF0ZTtcbiIsIi8qKlxuICog5a2X56ym5Liy5aSE55CG5LiO5Yik5patXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHJcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL3N0clxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LnN0ci5zdWJzdGl0dXRlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHJcbiAqIHZhciAkc3RyID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHInKTtcbiAqIGNvbnNvbGUuaW5mbygkc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRzdWJzdGl0dXRlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvc3Vic3RpdHV0ZScpO1xuICovXG5cbmV4cG9ydHMuYkxlbmd0aCA9IHJlcXVpcmUoJy4vYkxlbmd0aCcpO1xuZXhwb3J0cy5kYmNUb1NiYyA9IHJlcXVpcmUoJy4vZGJjVG9TYmMnKTtcbmV4cG9ydHMuZGVjb2RlSFRNTCA9IHJlcXVpcmUoJy4vZGVjb2RlSFRNTCcpO1xuZXhwb3J0cy5lbmNvZGVIVE1MID0gcmVxdWlyZSgnLi9lbmNvZGVIVE1MJyk7XG5leHBvcnRzLmdldFJuZDM2ID0gcmVxdWlyZSgnLi9nZXRSbmQzNicpO1xuZXhwb3J0cy5nZXRUaW1lMzYgPSByZXF1aXJlKCcuL2dldFRpbWUzNicpO1xuZXhwb3J0cy5nZXRVbmlxdWVLZXkgPSByZXF1aXJlKCcuL2dldFVuaXF1ZUtleScpO1xuZXhwb3J0cy5oeXBoZW5hdGUgPSByZXF1aXJlKCcuL2h5cGhlbmF0ZScpO1xuZXhwb3J0cy5pcFRvSGV4ID0gcmVxdWlyZSgnLi9pcFRvSGV4Jyk7XG5leHBvcnRzLmxlZnRCID0gcmVxdWlyZSgnLi9sZWZ0QicpO1xuZXhwb3J0cy5zaXplT2ZVVEY4U3RyaW5nID0gcmVxdWlyZSgnLi9zaXplT2ZVVEY4U3RyaW5nJyk7XG5leHBvcnRzLnN1YnN0aXR1dGUgPSByZXF1aXJlKCcuL3N1YnN0aXR1dGUnKTtcbmV4cG9ydHMua2V5UGF0aFNwbGl0ID0gcmVxdWlyZSgnLi9rZXlQYXRoU3BsaXQnKTtcbiIsIi8qKlxuICog5Y2B6L+b5Yi2SVDlnLDlnYDovazljYHlha3ov5vliLZcbiAqIEBtZXRob2Qgc3RyL2lwVG9IZXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBpcCDljYHov5vliLbmlbDlrZfnmoRJUFY05Zyw5Z2AXG4gKiBAcmV0dXJuIHtTdHJpbmd9IDE26L+b5Yi25pWw5a2XSVBWNOWcsOWdgFxuICogQGV4YW1wbGVcbiAqIHZhciAkaXBUb0hleCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL2lwVG9IZXgnKTtcbiAqICRpcFRvSGV4KCcyNTUuMjU1LjI1NS4yNTUnKTsgLy9yZXR1cm4gJ2ZmZmZmZmZmJ1xuICovXG5cbmZ1bmN0aW9uIGlwVG9IZXgoaXApIHtcbiAgcmV0dXJuIGlwLnJlcGxhY2UoLyhcXGQrKVxcLiovZywgZnVuY3Rpb24gKG1hdGNoLCBudW0pIHtcbiAgICBudW0gPSBwYXJzZUludChudW0sIDEwKSB8fCAwO1xuICAgIG51bSA9IG51bS50b1N0cmluZygxNik7XG4gICAgaWYgKG51bS5sZW5ndGggPCAyKSB7XG4gICAgICBudW0gPSAnMCcgKyBudW07XG4gICAgfVxuICAgIHJldHVybiBudW07XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlwVG9IZXg7XG4iLCIvKipcbiAqIOino+aekOWvueixoei3r+W+hOS4uuS4gOS4quaVsOe7hFxuICogQG1ldGhvZCBzdHIva2V5UGF0aFNwbGl0XG4gKiBAcGFyYW0ge1N0cmluZ30g5a+56LGh6Lev5b6EXG4gKiBAcmV0dXJucyB7QXJyYXl9IOWvueixoei3r+W+hOaVsOe7hFxuICogQGV4YW1wbGVcbiAqIHZhciAka2V5UGF0aFNwbGl0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIva2V5UGF0aFNwbGl0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtleVBhdGhTcGxpdCgnWzFdLmFbMV1bMl1iLmMnKTsgLy8gWycxJywgJ2EnLCAnMScsICcyJywgJ2InLCAnYyddXG4gKi9cblxuZnVuY3Rpb24ga2V5UGF0aFNwbGl0KHhwYXRoKSB7XG4gIGlmICh0eXBlb2YgeHBhdGggIT09ICdzdHJpbmcnKSByZXR1cm4gW107XG4gIHZhciBhcnJYcGF0aCA9IFtdO1xuICB4cGF0aC5zcGxpdCgnLicpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW1QYXRoKSB7XG4gICAgdmFyIHN0ckl0ZW0gPSBpdGVtUGF0aC5yZXBsYWNlKC9cXFsoW15bXFxdXSspXFxdL2csICcuJDEnKTtcbiAgICB2YXIgaXRlbUFyciA9IHN0ckl0ZW0uc3BsaXQoJy4nKTtcbiAgICBpZiAoaXRlbUFyclswXSA9PT0gJycpIHtcbiAgICAgIGl0ZW1BcnIuc2hpZnQoKTtcbiAgICB9XG4gICAgaXRlbUFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICBhcnJYcGF0aC5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGFyclhwYXRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleVBhdGhTcGxpdDtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnRyb2wtcmVnZXggKi9cbi8qKlxuICog5LuO5bem5Yiw5Y+z5Y+W5a2X56ym5Liy77yM5Lit5paH566X5Lik5Liq5a2X56ymXG4gKiBAbWV0aG9kIHN0ci9sZWZ0QlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbnNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0clxuICogQGV4YW1wbGVcbiAqIHZhciAkbGVmdEIgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9sZWZ0QicpO1xuICogLy/lkJHmsYnnvJboh7TmlaxcbiAqICRsZWZ0Qign5LiW55WM55yf5ZKM6LCQJywgNik7IC8vICfkuJbnlYznnJ8nXG4qL1xuXG52YXIgJGJMZW5ndGggPSByZXF1aXJlKCcuL2JMZW5ndGgnKTtcblxuZnVuY3Rpb24gbGVmdEIoc3RyLCBsZW5zKSB7XG4gIHZhciBzID0gc3RyLnJlcGxhY2UoL1xcKi9nLCAnICcpXG4gICAgLnJlcGxhY2UoL1teXFx4MDAtXFx4ZmZdL2csICcqKicpO1xuICBzdHIgPSBzdHIuc2xpY2UoMCwgcy5zbGljZSgwLCBsZW5zKVxuICAgIC5yZXBsYWNlKC9cXCpcXCovZywgJyAnKVxuICAgIC5yZXBsYWNlKC9cXCovZywgJycpLmxlbmd0aCk7XG4gIGlmICgkYkxlbmd0aChzdHIpID4gbGVucyAmJiBsZW5zID4gMCkge1xuICAgIHN0ciA9IHN0ci5zbGljZSgwLCBzdHIubGVuZ3RoIC0gMSk7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsZWZ0QjtcbiIsIi8qKlxuICog5Y+W5a2X56ym5LiyIHV0Zjgg57yW56CB6ZW/5bqm77yMZnJvbSDnjovpm4bpuYRcbiAqIEBtZXRob2Qgc3RyL3NpemVPZlVURjhTdHJpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWtl+espuS4sumVv+W6plxuICogQGV4YW1wbGVcbiAqIHZhciAkc2l6ZU9mVVRGOFN0cmluZyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL3NpemVPZlVURjhTdHJpbmcnKTtcbiAqICRzaXplT2ZVVEY4U3RyaW5nKCfkuK3mlodjYycpOyAvL3JldHVybiA4XG4qL1xuXG5mdW5jdGlvbiBzaXplT2ZVVEY4U3RyaW5nKHN0cikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB1bmVzY2FwZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpLmxlbmd0aFxuICAgICAgOiBuZXcgQXJyYXlCdWZmZXIoc3RyLCAndXRmOCcpLmxlbmd0aFxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpemVPZlVURjhTdHJpbmc7XG4iLCIvKipcbiAqIOeugOWNleaooeadv+WHveaVsFxuICogQG1ldGhvZCBzdHIvc3Vic3RpdHV0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDopoHmm7/mjaLmqKHmnb/nmoTlrZfnrKbkuLJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmog5qih5p2/5a+55bqU55qE5pWw5o2u5a+56LGhXG4gKiBAcGFyYW0ge1JlZ0V4cH0gW3JlZz0vXFxcXD9cXHtcXHsoW157fV0rKVxcfVxcfS9nXSDop6PmnpDmqKHmnb/nmoTmraPliJnooajovr7lvI9cbiAqIEByZXR1cm4ge1N0cmluZ30g5pu/5o2i5LqG5qih5p2/55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRzdWJzdGl0dXRlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvc3Vic3RpdHV0ZScpO1xuICogJHN1YnN0aXR1dGUoJ3t7Y2l0eX195qyi6L+O5oKoJywge2NpdHk6J+WMl+S6rCd9KTsgLy8gJ+WMl+S6rOasoui/juaCqCdcbiAqL1xuXG5mdW5jdGlvbiBzdWJzdGl0dXRlKHN0ciwgb2JqLCByZWcpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZyB8fCAoL1xcXFw/XFx7XFx7KFtee31dKylcXH1cXH0vZyksIGZ1bmN0aW9uIChtYXRjaCwgbmFtZSkge1xuICAgIGlmIChtYXRjaC5jaGFyQXQoMCkgPT09ICdcXFxcJykge1xuICAgICAgcmV0dXJuIG1hdGNoLnNsaWNlKDEpO1xuICAgIH1cbiAgICAvLyDms6jmhI/vvJpvYmpbbmFtZV0gIT0gbnVsbCDnrYnlkIzkuo4gb2JqW25hbWVdICE9PSBudWxsICYmIG9ialtuYW1lXSAhPT0gdW5kZWZpbmVkXG4gICAgcmV0dXJuIChvYmpbbmFtZV0gIT0gbnVsbCkgPyBvYmpbbmFtZV0gOiAnJztcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3Vic3RpdHV0ZTtcbiIsIi8qKlxuICog5o+Q5L6b5YCS6K6h5pe25Zmo57uf5LiA5bCB6KOFXG4gKiBAbWV0aG9kIHRpbWUvY291bnREb3duXG4gKiBAcGFyYW0ge09iamVjdH0gc3BlYyDpgInpoblcbiAqIEBwYXJhbSB7RGF0ZX0gW3NwZWMuYmFzZV0g55+r5q2j5pe26Ze077yM5aaC5p6c6ZyA6KaB55So5pyN5Yqh56uv5pe26Ze055+r5q2j5YCS6K6h5pe277yM5L2/55So5q2k5Y+C5pWwXG4gKiBAcGFyYW0ge0RhdGV9IFtzcGVjLnRhcmdldD1EYXRlLm5vdygpICsgMzAwMF0g55uu5qCH5pe26Ze0XG4gKiBAcGFyYW0ge051bWJlcn0gW3NwZWMuaW50ZXJ2YWw9MTAwMF0g5YCS6K6h5pe26Kem5Y+R6Ze06ZqUXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5vbkNoYW5nZV0g5YCS6K6h5pe26Kem5Y+R5Y+Y5pu055qE5LqL5Lu25Zue6LCDXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5vblN0b3BdIOWAkuiuoeaXtue7k+adn+eahOWbnuiwg1xuICogQHJldHVybnMge09iamVjdH0g5YCS6K6h5pe25a+56LGh5a6e5L6LXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb3VudERvd24gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3RpbWUvY291bnREb3duJyk7XG4gKiB2YXIgdGFyZ2V0ID0gRGF0ZS5ub3coKSArIDUwMDA7XG4gKiB2YXIgY2QxID0gJGNvdW50RG93bih7XG4gKiAgIHRhcmdldCA6IHRhcmdldCxcbiAqICAgb25DaGFuZ2UgOiBmdW5jdGlvbihkZWx0YSl7XG4gKiAgICAgY29uc29sZS5pbmZvKCdjZDEgY2hhbmdlJywgZGVsdGEpO1xuICogICB9LFxuICogICBvblN0b3AgOiBmdW5jdGlvbihkZWx0YSl7XG4gKiAgICAgY29uc29sZS5pbmZvKCdjZDEgc3RvcCcsIGRlbHRhKTtcbiAqICAgfVxuICogfSk7XG4gKiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gKiAgIC8vdHJpZ2dlciBzdG9wXG4gKiAgIGNkMS5zdG9wKCk7XG4gKiB9LCAyMDAwKTtcbiAqIHZhciBjZDIgPSBjb3VudERvd24oe1xuICogICB0YXJnZXQgOiB0YXJnZXQsXG4gKiAgIGludGVydmFsIDogMjAwMCxcbiAqICAgb25DaGFuZ2UgOiBmdW5jdGlvbihkZWx0YSl7XG4gKiAgICAgY29uc29sZS5pbmZvKCdjZDIgY2hhbmdlJywgZGVsdGEpO1xuICogICB9LFxuICogICBvblN0b3AgOiBmdW5jdGlvbihkZWx0YSl7XG4gKiAgICAgY29uc29sZS5pbmZvKCdjZDIgc3RvcCcsIGRlbHRhKTtcbiAqICAgfVxuICogfSk7XG4gKi9cblxudmFyICRlcmFzZSA9IHJlcXVpcmUoJy4uL2Fyci9lcmFzZScpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbnZhciBhbGxNb25pdG9ycyA9IHt9O1xudmFyIGxvY2FsQmFzZVRpbWUgPSBEYXRlLm5vdygpO1xuXG5mdW5jdGlvbiBjb3VudERvd24oc3BlYykge1xuICB2YXIgdGhhdCA9IHt9O1xuXG4gIC8vIOS4uuS7gOS5iOS4jeS9v+eUqCB0aW1lTGVmdCDlj4LmlbDmm7/mjaIgYmFzZSDlkowgdGFyZ2V0OlxuICAvLyDlpoLmnpznlKggdGltZUxlZnQg5L2c5Li65Y+C5pWw77yM6K6h5pe25Zmo5Yid5aeL5YyW5LmL5YmN5aaC5p6c5pyJ6L+b56iL6Zi75aGe77yM5pyJ5Y+v6IO95Lya5a+86Ie05LiO55uu5qCH5pe26Ze05Lqn55Sf6K+v5beuXG4gIC8vIOmhtemdouWkmuS4quWumuaXtuWZqOS4gOi1t+WIneWni+WMluaXtu+8jOS8muWHuueOsOiuoeaXtuWZqOabtOaWsOS4jeWQjOatpeeahOeOsOixoe+8jOWQjOaXtuW8leWPkemhtemdouWkmuWkhOayoeacieS4gOi1t+Wbnua1gVxuICAvLyDkv53nlZnnm67liY3ov5nkuKrmlrnmoYjvvIznlKjkuo7pnIDopoHnsr7noa7lgJLorqHml7bnmoTmg4XlhrVcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICBiYXNlOiBudWxsLFxuICAgIHRhcmdldDogRGF0ZS5ub3coKSArIDMwMDAsXG4gICAgaW50ZXJ2YWw6IDEwMDAsXG4gICAgb25DaGFuZ2U6IG51bGwsXG4gICAgb25TdG9wOiBudWxsLFxuICB9LCBzcGVjKTtcblxuICB2YXIgdGltZURpZmYgPSAwO1xuICB2YXIgdGFyZ2V0ID0gK25ldyBEYXRlKGNvbmYudGFyZ2V0KTtcbiAgdmFyIGludGVydmFsID0gcGFyc2VJbnQoY29uZi5pbnRlcnZhbCwgMTApIHx8IDA7XG4gIHZhciBvbkNoYW5nZSA9IGNvbmYub25DaGFuZ2U7XG4gIHZhciBvblN0b3AgPSBjb25mLm9uU3RvcDtcblxuICAvLyDkvb/lgJLorqHml7bop6blj5Hml7bpl7Tnsr7noa7ljJZcbiAgLy8g5L2/55So5Zu65a6a55qE6Kem5Y+R6aKR546H77yM5YeP5bCR6ZyA6KaB5Yib5bu655qE5a6a5pe25ZmoXG4gIHZhciB0aW1lSW50ZXJ2YWwgPSBpbnRlcnZhbDtcbiAgaWYgKHRpbWVJbnRlcnZhbCA8IDUwMCkge1xuICAgIHRpbWVJbnRlcnZhbCA9IDEwO1xuICB9IGVsc2UgaWYgKHRpbWVJbnRlcnZhbCA8IDUwMDApIHtcbiAgICB0aW1lSW50ZXJ2YWwgPSAxMDA7XG4gIH0gZWxzZSB7XG4gICAgdGltZUludGVydmFsID0gMTAwMDtcbiAgfVxuXG4gIHZhciBkZWx0YTtcbiAgdmFyIGN1clVuaXQ7XG5cbiAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uIChub3cpIHtcbiAgICBkZWx0YSA9IHRhcmdldCAtIG5vdztcbiAgICB2YXIgdW5pdCA9IE1hdGguY2VpbChkZWx0YSAvIGludGVydmFsKTtcbiAgICBpZiAodW5pdCAhPT0gY3VyVW5pdCkge1xuICAgICAgY3VyVW5pdCA9IHVuaXQ7XG4gICAgICBpZiAodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9uQ2hhbmdlKGRlbHRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIOmHjeiuvuebruagh+aXtumXtFxuICAgKiBAbWV0aG9kIGNvdW50RG93biNzZXRUYXJnZXRcbiAgICogQG1lbWJlcm9mIHRpbWUvY291bnREb3duXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBjZCA9IGNvdW50RG93bigpO1xuICAgKiB2YXIgbG9jYWxUaW1lID0gJzIwMTkvMDEvMDEnO1xuICAgKiBjZC5zZXRUYXJnZXQoc2VydmVyVGltZSk7XG4gICAqL1xuICB0aGF0LnNldFRhcmdldCA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgdGFyZ2V0ID0gK25ldyBEYXRlKHRpbWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiDnuqDmraPml7bpl7Tlt65cbiAgICogQG1ldGhvZCBjb3VudERvd24jY29ycmVjdFxuICAgKiBAbWVtYmVyb2YgdGltZS9jb3VudERvd25cbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNkID0gY291bnREb3duKCk7XG4gICAqIHZhciBzZXJ2ZXJUaW1lID0gJzIwMTkvMDEvMDEnO1xuICAgKiB2YXIgbG9jYWxUaW1lID0gJzIwMjAvMDEvMDEnO1xuICAgKiBjZC5jb3JyZWN0KHNlcnZlclRpbWUpO1xuICAgKiBjZC5jb3JyZWN0KHNlcnZlclRpbWUsIGxvY2FsVGltZSk7XG4gICAqL1xuICB0aGF0LmNvcnJlY3QgPSBmdW5jdGlvbiAoc2VydmVyVGltZSwgbG9jYWxUaW1lKSB7XG4gICAgdmFyIG5vdyA9IGxvY2FsVGltZSA/IG5ldyBEYXRlKGxvY2FsVGltZSkgOiArbmV3IERhdGUoKTtcbiAgICB2YXIgc2VydmVyRGF0ZSA9IHNlcnZlclRpbWUgPyBuZXcgRGF0ZShzZXJ2ZXJUaW1lKSA6IDA7XG4gICAgaWYgKHNlcnZlckRhdGUpIHtcbiAgICAgIHRpbWVEaWZmID0gc2VydmVyRGF0ZSAtIG5vdztcbiAgICB9XG4gIH07XG5cbiAgaWYgKGNvbmYuYmFzZSkge1xuICAgIHRoYXQuY29ycmVjdChjb25mLmJhc2UpO1xuICB9XG5cbiAgdmFyIGNoZWNrID0gZnVuY3Rpb24gKGxvY2FsRGVsdGEpIHtcbiAgICB2YXIgbm93ID0gbG9jYWxCYXNlVGltZSArIHRpbWVEaWZmICsgbG9jYWxEZWx0YTtcbiAgICB1cGRhdGUobm93KTtcbiAgICBpZiAoZGVsdGEgPD0gMCkge1xuICAgICAgdGhhdC5zdG9wKG5vdyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiDlgZzmraLlgJLorqHml7ZcbiAgICogQG1ldGhvZCBjb3VudERvd24jc3RvcFxuICAgKiBAbWVtYmVyb2YgdGltZS9jb3VudERvd25cbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNkID0gY291bnREb3duKCk7XG4gICAqIGNkLnN0b3AoKTtcbiAgICovXG4gIHRoYXQuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9iaiA9IGFsbE1vbml0b3JzW3RpbWVJbnRlcnZhbF07XG4gICAgaWYgKG1vYmogJiYgbW9iai5xdWV1ZSkge1xuICAgICAgJGVyYXNlKG1vYmoucXVldWUsIGNoZWNrKTtcbiAgICB9XG4gICAgLy8gb25TdG9w5LqL5Lu26Kem5Y+R5b+F6aG75Zyo5LuO6Zif5YiX56e76Zmk5Zue6LCD5LmL5ZCOXG4gICAgLy8g5ZCm5YiZ5b6q546v5o6l5pu/55qE5a6a5pe25Zmo5Lya5byV5Y+R5q275b6q546vXG4gICAgaWYgKHR5cGVvZiBvblN0b3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9uU3RvcChkZWx0YSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiDplIDmr4HlgJLorqHml7ZcbiAgICogQG1ldGhvZCBjb3VudERvd24jZGVzdHJveVxuICAgKiBAbWVtYmVyb2YgdGltZS9jb3VudERvd25cbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNkID0gY291bnREb3duKCk7XG4gICAqIGNkLmRlc3Ryb3koKTtcbiAgICovXG4gIHRoYXQuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICBvbkNoYW5nZSA9IG51bGw7XG4gICAgb25TdG9wID0gbnVsbDtcbiAgICB0aGF0LnN0b3AoKTtcbiAgfTtcblxuICB2YXIgbW9uaXRvciA9IGFsbE1vbml0b3JzW3RpbWVJbnRlcnZhbF07XG5cbiAgaWYgKCFtb25pdG9yKSB7XG4gICAgbW9uaXRvciA9IHt9O1xuICAgIG1vbml0b3IucXVldWUgPSBbXTtcbiAgICBtb25pdG9yLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgIHZhciBtb2JqID0gYWxsTW9uaXRvcnNbdGltZUludGVydmFsXTtcbiAgICAgIHZhciBsb2NhbERlbHRhID0gbm93IC0gbG9jYWxCYXNlVGltZTtcbiAgICAgIGlmIChtb2JqLnF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAvLyDlvqrnjq/lvZPkuK3kvJrliKDpmaTmlbDnu4TlhYPntKDvvIzlm6DmraTpnIDopoHlhYjlpI3liLbkuIDkuIvmlbDnu4RcbiAgICAgICAgbW9iai5xdWV1ZS5zbGljZSgwKS5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgIGZuKGxvY2FsRGVsdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW9iai50aW1lcik7XG4gICAgICAgIGFsbE1vbml0b3JzW3RpbWVJbnRlcnZhbF0gPSBudWxsO1xuICAgICAgICBkZWxldGUgbW9iai50aW1lcjtcbiAgICAgIH1cbiAgICB9O1xuICAgIGFsbE1vbml0b3JzW3RpbWVJbnRlcnZhbF0gPSBtb25pdG9yO1xuICB9XG5cbiAgbW9uaXRvci5xdWV1ZS5wdXNoKGNoZWNrKTtcblxuICBpZiAoIW1vbml0b3IudGltZXIpIHtcbiAgICBtb25pdG9yLnRpbWVyID0gc2V0SW50ZXJ2YWwobW9uaXRvci5pbnNwZWN0LCB0aW1lSW50ZXJ2YWwpO1xuICB9XG5cbiAgbW9uaXRvci5pbnNwZWN0KCk7XG5cbiAgcmV0dXJuIHRoYXQ7XG59XG5cbmNvdW50RG93bi5hbGxNb25pdG9ycyA9IGFsbE1vbml0b3JzO1xubW9kdWxlLmV4cG9ydHMgPSBjb3VudERvd247XG4iLCIvKipcbiAqIOaXtumXtOWkhOeQhuS4juS6pOS6kuW3peWFt1xuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvdGltZVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdGltZVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LnRpbWUucGFyc2VVbml0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy90aW1lXG4gKiB2YXIgJHRpbWUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3RpbWUnKTtcbiAqIGNvbnNvbGUuaW5mbygkdGltZS5wYXJzZVVuaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRwYXJzZVVuaXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3RpbWUvcGFyc2VVbml0Jyk7XG4gKi9cblxuZXhwb3J0cy5jb3VudERvd24gPSByZXF1aXJlKCcuL2NvdW50RG93bicpO1xuZXhwb3J0cy5wYXJzZVVuaXQgPSByZXF1aXJlKCcuL3BhcnNlVW5pdCcpO1xuIiwiLyoqXG4gKiDml7bpl7TmlbDlrZfmi4bliIbkuLrlpKnml7bliIbnp5JcbiAqIEBtZXRob2QgdGltZS9wYXJzZVVuaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIOavq+enkuaVsFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMubWF4VW5pdD0nZGF5J10g5ouG5YiG5pe26Ze055qE5pyA5aSn5Y2V5L2N77yM5Y+v6YCJIFsnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCddXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDmi4bliIblrozmiJDnmoTlpKnml7bliIbnp5JcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHBhcnNlVW5pdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdGltZS9wYXJzZVVuaXQnKTtcbiAqIGNvbnNvbGUuaW5mbyggJHBhcnNlVW5pdCgxMjM0NSAqIDY3ODkwKSApO1xuICogLy8gT2JqZWN0IHtkYXk6IDksIGhvdXI6IDE2LCBtaW51dGU6IDQ4LCBzZWNvbmQ6IDIyLCBtczogNTB9XG4gKiBjb25zb2xlLmluZm8oICRwYXJzZVVuaXQoMTIzNDUgKiA2Nzg5MCwge21heFVuaXQgOiAnaG91cid9KSApO1xuICogLy8gT2JqZWN0IHtob3VyOiAyMzIsIG1pbnV0ZTogNDgsIHNlY29uZDogMjIsIG1zOiA1MH1cbiAqL1xuXG52YXIgJG51bWVyaWNhbCA9IHJlcXVpcmUoJy4uL251bS9udW1lcmljYWwnKTtcbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG52YXIgVU5JVCA9IHtcbiAgZGF5OiAyNCAqIDYwICogNjAgKiAxMDAwLFxuICBob3VyOiA2MCAqIDYwICogMTAwMCxcbiAgbWludXRlOiA2MCAqIDEwMDAsXG4gIHNlY29uZDogMTAwMCxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdCh0aW1lLCBzcGVjKSB7XG4gIHZhciBjb25mID0gJGFzc2lnbih7XG4gICAgbWF4VW5pdDogJ2RheScsXG4gIH0sIHNwZWMpO1xuXG4gIHZhciBkYXRhID0ge307XG4gIHZhciBtYXhVbml0ID0gJG51bWVyaWNhbChVTklUW2NvbmYubWF4VW5pdF0pO1xuICB2YXIgdURheSA9IFVOSVQuZGF5O1xuICB2YXIgdUhvdXIgPSBVTklULmhvdXI7XG4gIHZhciB1TWludXRlID0gVU5JVC5taW51dGU7XG4gIHZhciB1U2Vjb25kID0gVU5JVC5zZWNvbmQ7XG5cbiAgaWYgKG1heFVuaXQgPj0gdURheSkge1xuICAgIHRpbWUgPSAkbnVtZXJpY2FsKHRpbWUpO1xuICAgIGRhdGEuZGF5ID0gTWF0aC5mbG9vcih0aW1lIC8gdURheSk7XG4gIH1cblxuICBpZiAobWF4VW5pdCA+PSB1SG91cikge1xuICAgIHRpbWUgLT0gJG51bWVyaWNhbChkYXRhLmRheSAqIHVEYXkpO1xuICAgIGRhdGEuaG91ciA9IE1hdGguZmxvb3IodGltZSAvIHVIb3VyKTtcbiAgfVxuXG4gIGlmIChtYXhVbml0ID49IHVNaW51dGUpIHtcbiAgICB0aW1lIC09ICRudW1lcmljYWwoZGF0YS5ob3VyICogdUhvdXIpO1xuICAgIGRhdGEubWludXRlID0gTWF0aC5mbG9vcih0aW1lIC8gdU1pbnV0ZSk7XG4gIH1cblxuICBpZiAobWF4VW5pdCA+PSB1U2Vjb25kKSB7XG4gICAgdGltZSAtPSAkbnVtZXJpY2FsKGRhdGEubWludXRlICogdU1pbnV0ZSk7XG4gICAgZGF0YS5zZWNvbmQgPSBNYXRoLmZsb29yKHRpbWUgLyB1U2Vjb25kKTtcbiAgfVxuXG4gIGRhdGEubXMgPSB0aW1lIC0gZGF0YS5zZWNvbmQgKiB1U2Vjb25kO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlVW5pdDtcbiIsIi8qKlxuICogQXJyYXlCdWZmZXLovawxNui/m+WItuWtl+espuS4slxuICogQG1ldGhvZCB1dGlsL2FiVG9IZXhcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGJ1ZmZlciDpnIDopoHovazmjaLnmoQgQXJyYXlCdWZmZXJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IDE26L+b5Yi25a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRhYlRvSGV4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL2FiVG9IZXgnKTtcbiAqIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAqIHZhciBkdiA9IG5ldyBEYXRhVmlldyhhYik7XG4gKiBkdi5zZXRVaW50OCgwLCAxNzEpO1xuICogZHYuc2V0VWludDgoMSwgMjA1KTtcbiAqICRhYlRvSGV4KGFiKTsgLy8gPT4gJ2FiY2QnXG4gKi9cblxuZnVuY3Rpb24gYWJUb0hleChidWZmZXIpIHtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChidWZmZXIpICE9PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHZhciB1OGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gIHZhciBmbiA9IGZ1bmN0aW9uIChiaXQpIHtcbiAgICByZXR1cm4gKCcwMCcgKyBiaXQudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gIH07XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwodThhcnIsIGZuKS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhYlRvSGV4O1xuIiwiLyoqXG4gKiBBU0NJSeWtl+espuS4sui9rDE26L+b5Yi25a2X56ym5LiyXG4gKiBAbWV0aG9kIHV0aWwvYXNjVG9IZXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg6ZyA6KaB6L2s5o2i55qEQVNDSUnlrZfnrKbkuLJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IDE26L+b5Yi25a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRhc2NUb0hleCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbC9hc2NUb0hleCcpO1xuICogJGFzY1RvSGV4KCk7IC8vID0+ICcnXG4gKiAkYXNjVG9IZXgoJyorJyk7IC8vID0+ICcyYTJiJ1xuICovXG5cbmZ1bmN0aW9uIGFzY1RvSGV4KHN0cikge1xuICBpZiAoIXN0cikge1xuICAgIHJldHVybiAnJztcbiAgfVxuICB2YXIgaGV4ID0gJyc7XG4gIHZhciBpbmRleDtcbiAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XG4gIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbjsgaW5kZXggKz0gMSkge1xuICAgIHZhciBpbnQgPSBzdHIuY2hhckNvZGVBdChpbmRleCk7XG4gICAgdmFyIGNvZGUgPSAoaW50KS50b1N0cmluZygxNik7XG4gICAgaGV4ICs9IGNvZGU7XG4gIH1cbiAgcmV0dXJuIGhleDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc2NUb0hleDtcbiIsIi8qKlxuICog5q+U6L6D54mI5pys5Y+3XG4gKiBAbWV0aG9kIHV0aWwvY29tcGFyZVZlcnNpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSB2MSDniYjmnKzlj7cxXG4gKiBAcGFyYW0ge1N0cmluZ30gdjIg54mI5pys5Y+3MlxuICogQHJldHVybnMge09iamVjdH0gaW5mbyDniYjmnKzlj7fmr5TovoPkv6Hmga9cbiAqIEByZXR1cm5zIHtPYmplY3R9IGluZm8ubGV2ZWwg54mI5pys5Y+35beu5byC5omA5Zyo57qn5YirXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBpbmZvLmRlbHRhIOeJiOacrOWPt+W3ruW8guaVsOWAvFxuICogQGV4YW1wbGVcbiAqIHZhciAkY29tcGFyZVZlcnNpb24gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvY29tcGFyZVZlcnNpb24nKTtcbiAqIC8vIGRlbHRhIOWPluWAvOWPr+S7peeQhuino+S4uiDliY3pnaLnmoTlgLwg5YeP5Y67IOWQjumdoueahOWAvFxuICogdmFyIGluZm8xID0gJGNvbXBhcmVWZXJzaW9uKCcxLjAuMScsICcxLjIuMicpO1xuICogLy8ge2xldmVsOiAxLCBkZWx0YTogLTJ9XG4gKiB2YXIgaW5mbzIgPSAkY29tcGFyZVZlcnNpb24oJzEuMy4xJywgJzEuMi4yJyk7XG4gKiAvLyB7bGV2ZWw6IDEsIGRlbHRhOiAxfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBhcmVWZXJzaW9uKHYxLCB2Mikge1xuICB2YXIgYXJyVjEgPSB2MS5zcGxpdCgnLicpO1xuICB2YXIgYXJyVjIgPSB2Mi5zcGxpdCgnLicpO1xuICB2YXIgbWF4TGVuZ3RoID0gTWF0aC5tYXgoYXJyVjEubGVuZ3RoLCBhcnJWMi5sZW5ndGgpO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgZGVsdGEgPSAwO1xuXG4gIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IG1heExlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHZhciBwdjEgPSBwYXJzZUludChhcnJWMVtpbmRleF0sIDEwKSB8fCAwO1xuICAgIHZhciBwdjIgPSBwYXJzZUludChhcnJWMltpbmRleF0sIDEwKSB8fCAwO1xuICAgIGRlbHRhID0gcHYxIC0gcHYyO1xuICAgIGlmIChkZWx0YSAhPT0gMCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF2MSAmJiAhdjIpIHtcbiAgICBpbmRleCA9IDA7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxldmVsOiBpbmRleCxcbiAgICBkZWx0YTogZGVsdGEsXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGFyZVZlcnNpb247XG4iLCIvKipcbiAqIDE26L+b5Yi25a2X56ym5Liy6L2sQXJyYXlCdWZmZXJcbiAqIEBtZXRob2QgdXRpbC9oZXhUb0FiXG4gKiBAc2VlIGh0dHBzOi8vY2FuaXVzZS5jb20vI3NlYXJjaD1BcnJheUJ1ZmZlclxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpnIDopoHovazmjaLnmoQxNui/m+WItuWtl+espuS4slxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSDooqvovazmjaLlkI7nmoQgQXJyYXlCdWZmZXIg5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRoZXhUb0FiID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL2hleFRvQWInKTtcbiAqIHZhciBhYiA9ICRoZXhUb0FiKCk7XG4gKiBhYi5ieXRlTGVuZ3RoOyAvLyA9PiAwXG4gKiBhYiA9ICRoZXhUb0FiKCdhYmNkJyk7XG4gKiB2YXIgZHYgPSBuZXcgRGF0YVZpZXcoYWIpO1xuICogYWIuYnl0ZUxlbmd0aDsgLy8gPT4gMlxuICogZHYuZ2V0VWludDgoMCk7IC8vID0+IDE3MVxuICogZHYuZ2V0VWludDgoMSk7IC8vID0+IDIwNVxuICovXG5cbmZ1bmN0aW9uIGhleFRvQWIoc3RyKSB7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheUJ1ZmZlcigwKTtcbiAgfVxuICB2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKE1hdGguY2VpbChzdHIubGVuZ3RoIC8gMikpO1xuICB2YXIgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGk7XG4gIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY29kZSA9IHBhcnNlSW50KHN0ci5zdWJzdHIoaSwgMiksIDE2KTtcbiAgICBkYXRhVmlldy5zZXRVaW50OChpbmRleCwgY29kZSk7XG4gICAgaW5kZXggKz0gMTtcbiAgfVxuICByZXR1cm4gYnVmZmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhleFRvQWI7XG4iLCIvKipcbiAqIDE26L+b5Yi25a2X56ym5Liy6L2sQVNDSUnlrZfnrKbkuLJcbiAqIEBtZXRob2QgdXRpbC9oZXhUb0FzY1xuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpnIDopoHovazmjaLnmoQxNui/m+WItuWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gQVNDSUnlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGhleFRvQXNjID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL2hleFRvQXNjJyk7XG4gKiAkaGV4VG9Bc2MoKTsgLy8gPT4gJydcbiAqICRoZXhUb0FzYygnMmEyYicpOyAvLyA9PiAnKisnXG4gKi9cblxuZnVuY3Rpb24gaGV4VG9Bc2MoaGV4KSB7XG4gIGlmICghaGV4KSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBoZXgucmVwbGFjZSgvW1xcZGEtZl17Mn0vZ2ksIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHZhciBpbnQgPSBwYXJzZUludChtYXRjaCwgMTYpO1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGludCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhleFRvQXNjO1xuIiwiLyoqXG4gKiBIU0zpopzoibLlgLzovazmjaLkuLpSR0JcbiAqIC0g5o2i566X5YWs5byP5pS557yW6IeqIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFNMX2NvbG9yX3NwYWNlLlxuICogLSBoLCBzLCDlkowgbCDorr7lrprlnKggWzAsIDFdIOS5i+mXtFxuICogLSDov5Tlm57nmoQgciwgZywg5ZKMIGIg5ZyoIFswLCAyNTVd5LmL6Ze0XG4gKiBAbWV0aG9kIHV0aWwvaHNsVG9SZ2JcbiAqIEBwYXJhbSB7TnVtYmVyfSBoIOiJsuebuFxuICogQHBhcmFtIHtOdW1iZXJ9IHMg6aWx5ZKM5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbCDkuq7luqZcbiAqIEByZXR1cm5zIHtBcnJheX0gUkdC6Imy5YC85pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRoc2xUb1JnYiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbC9oc2xUb1JnYicpO1xuICogJGhzbFRvUmdiKDAsIDAsIDApOyAvLyA9PiBbMCwwLDBdXG4gKiAkaHNsVG9SZ2IoMCwgMCwgMSk7IC8vID0+IFsyNTUsMjU1LDI1NV1cbiAqICRoc2xUb1JnYigwLjU1NTU1NTU1NTU1NTU1NTUsIDAuOTM3NDk5OTk5OTk5OTk5OSwgMC42ODYyNzQ1MDk4MDM5MjE2KTsgLy8gPT4gWzEwMCwyMDAsMjUwXVxuICovXG5cbmZ1bmN0aW9uIGh1ZVRvUmdiKHAsIHEsIHQpIHtcbiAgaWYgKHQgPCAwKSB0ICs9IDE7XG4gIGlmICh0ID4gMSkgdCAtPSAxO1xuICBpZiAodCA8IDEgLyA2KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgaWYgKHQgPCAxIC8gMikgcmV0dXJuIHE7XG4gIGlmICh0IDwgMiAvIDMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyIC8gMyAtIHQpICogNjtcbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGhzbFRvUmdiKGgsIHMsIGwpIHtcbiAgdmFyIHI7XG4gIHZhciBnO1xuICB2YXIgYjtcblxuICBpZiAocyA9PT0gMCkge1xuICAgIC8vIGFjaHJvbWF0aWNcbiAgICByID0gbDtcbiAgICBnID0gbDtcbiAgICBiID0gbDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgciA9IGh1ZVRvUmdiKHAsIHEsIGggKyAxIC8gMyk7XG4gICAgZyA9IGh1ZVRvUmdiKHAsIHEsIGgpO1xuICAgIGIgPSBodWVUb1JnYihwLCBxLCBoIC0gMSAvIDMpO1xuICB9XG4gIHJldHVybiBbTWF0aC5yb3VuZChyICogMjU1KSwgTWF0aC5yb3VuZChnICogMjU1KSwgTWF0aC5yb3VuZChiICogMjU1KV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHNsVG9SZ2I7XG4iLCIvKipcbiAqIOWFtuS7luW3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdXRpbFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LnV0aWwuaHNsVG9SZ2IpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWxcbiAqIHZhciAkdXRpbCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbCcpO1xuICogY29uc29sZS5pbmZvKCR1dGlsLmhzbFRvUmdiKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkaHNsVG9SZ2IgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvaHNsVG9SZ2InKTtcbiAqL1xuXG5leHBvcnRzLmFiVG9IZXggPSByZXF1aXJlKCcuL2FiVG9IZXgnKTtcbmV4cG9ydHMuYXNjVG9IZXggPSByZXF1aXJlKCcuL2FzY1RvSGV4Jyk7XG5leHBvcnRzLmNvbXBhcmVWZXJzaW9uID0gcmVxdWlyZSgnLi9jb21wYXJlVmVyc2lvbicpO1xuZXhwb3J0cy5oZXhUb0FiID0gcmVxdWlyZSgnLi9oZXhUb0FiJyk7XG5leHBvcnRzLmhleFRvQXNjID0gcmVxdWlyZSgnLi9oZXhUb0FzYycpO1xuZXhwb3J0cy5oc2xUb1JnYiA9IHJlcXVpcmUoJy4vaHNsVG9SZ2InKTtcbmV4cG9ydHMuam9iID0gcmVxdWlyZSgnLi9qb2InKTtcbmV4cG9ydHMubWVhc3VyZURpc3RhbmNlID0gcmVxdWlyZSgnLi9tZWFzdXJlRGlzdGFuY2UnKTtcbmV4cG9ydHMucGFyc2VSR0IgPSByZXF1aXJlKCcuL3BhcnNlUkdCJyk7XG5leHBvcnRzLnJnYlRvSHNsID0gcmVxdWlyZSgnLi9yZ2JUb0hzbCcpO1xuIiwiLyoqXG4gKiDku7vliqHliIbml7bmiafooYxcbiAqIC0g5LiA5pa56Z2i6YG/5YWN5Y2V5qyhcmVmbG935rWB56iL5omn6KGM5aSq5aSaanPku7vliqHlr7zoh7TmtY/op4jlmajljaHmrbtcbiAqIC0g5Y+m5LiA5pa56Z2i5Y2V5Liq5Lu75Yqh55qE5oql6ZSZ5LiN5Lya5b2x5ZON5ZCO57ut5Lu75Yqh55qE5omn6KGMXG4gKiBAbWV0aG9kIHV0aWwvam9iXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDku7vliqHlh73mlbBcbiAqIEByZXR1cm5zIHtPYmplY3R9IOS7u+WKoemYn+WIl+WvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkam9iID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL2pvYicpO1xuICogJGpvYihmdW5jdGlvbigpIHtcbiAqICAgLy90YXNrMSBzdGFydFxuICogfSk7XG4gKiAkam9iKGZ1bmN0aW9uKCkge1xuICogICAvL3Rhc2syIHN0YXJ0XG4gKiB9KTtcbiAqL1xuXG52YXIgbWFuYWdlciA9IHt9O1xuXG5tYW5hZ2VyLnF1ZXVlID0gW107XG5cbm1hbmFnZXIuYWRkID0gZnVuY3Rpb24gKGZuLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBtYW5hZ2VyLnF1ZXVlLnB1c2goe1xuICAgIGZuOiBmbixcbiAgICBjb25mOiBvcHRpb25zLFxuICB9KTtcbiAgbWFuYWdlci5zdGVwKCk7XG59O1xuXG5tYW5hZ2VyLnN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghbWFuYWdlci5xdWV1ZS5sZW5ndGggfHwgbWFuYWdlci50aW1lcikgeyByZXR1cm47IH1cbiAgbWFuYWdlci50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtID0gbWFuYWdlci5xdWV1ZS5zaGlmdCgpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICBpZiAoaXRlbS5mbiAmJiB0eXBlb2YgaXRlbS5mbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtLmZuLmNhbGwobnVsbCk7XG4gICAgICB9XG4gICAgICBtYW5hZ2VyLnRpbWVyID0gbnVsbDtcbiAgICAgIG1hbmFnZXIuc3RlcCgpO1xuICAgIH1cbiAgfSwgMSk7XG59O1xuXG5mdW5jdGlvbiBqb2IoZm4sIG9wdGlvbnMpIHtcbiAgbWFuYWdlci5hZGQoZm4sIG9wdGlvbnMpO1xuICByZXR1cm4gbWFuYWdlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqb2I7XG4iLCIvKipcbiAqIOa1i+mHj+WcsOeQhuWdkOagh+eahOi3neemu1xuICogQG1ldGhvZCB1dGlsL21lYXN1cmVEaXN0YW5jZVxuICogQHBhcmFtIHtOdW1iZXJ9IGxhdDEg5Z2Q5qCHMeeyvuW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxuZzEg5Z2Q5qCHMee6rOW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxhdDIg5Z2Q5qCHMueyvuW6plxuICogQHBhcmFtIHtOdW1iZXJ9IGxuZzIg5Z2Q5qCHMue6rOW6plxuICogQHJldHVybnMge051bWJlcn0gMuS4quWdkOagh+S5i+mXtOeahOi3neemu++8iOWNg+exs++8iVxuICogQGV4YW1wbGVcbiAqIHZhciAkbWVhc3VyZURpc3RhbmNlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL21lYXN1cmVEaXN0YW5jZScpO1xuICogdmFyIGRpc3RhbmNlID0gJG1lYXN1cmVEaXN0YW5jZSgwLCAwLCAxMDAsIDEwMCk7XG4gKiAvLyA5ODI2LjQwMDY1MTA5OTc4XG4gKi9cblxuZnVuY3Rpb24gbWVhc3VyZURpc3RhbmNlKGxhdDEsIGxuZzEsIGxhdDIsIGxuZzIpIHtcbiAgdmFyIHJhZExhdDEgPSAobGF0MSAqIE1hdGguUEkpIC8gMTgwLjA7XG4gIHZhciByYWRMYXQyID0gKGxhdDIgKiBNYXRoLlBJKSAvIDE4MC4wO1xuICB2YXIgYSA9IHJhZExhdDEgLSByYWRMYXQyO1xuICB2YXIgYiA9IChsbmcxICogTWF0aC5QSSkgLyAxODAuMCAtIChsbmcyICogTWF0aC5QSSkgLyAxODAuMDtcbiAgdmFyIHBvd1ZhbCA9IE1hdGgucG93KE1hdGguc2luKGEgLyAyKSwgMik7XG4gIHZhciBjY3BWYWwgPSBNYXRoLmNvcyhyYWRMYXQxKSAqIE1hdGguY29zKHJhZExhdDIpICogTWF0aC5wb3coTWF0aC5zaW4oYiAvIDIpLCAyKTtcbiAgdmFyIHNxcnRWYWwgPSBNYXRoLnNxcnQocG93VmFsICsgY2NwVmFsKTtcbiAgdmFyIHMgPSAyICogTWF0aC5hc2luKHNxcnRWYWwpO1xuICAvLyDlnLDnkIPljYrlvoRcbiAgcyAqPSA2Mzc4LjEzNztcbiAgcmV0dXJuIHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVhc3VyZURpc3RhbmNlO1xuIiwiLyoqXG4gKiByZ2LlrZfnrKbkuLLop6PmnpBcbiAqIC0g5o2i566X5YWs5byP5pS557yW6IeqIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFNMX2NvbG9yX3NwYWNlLlxuICogLSBoLCBzLCDlkowgbCDorr7lrprlnKggWzAsIDFdIOS5i+mXtFxuICogLSDov5Tlm57nmoQgciwgZywg5ZKMIGIg5ZyoIFswLCAyNTVd5LmL6Ze0XG4gKiBAbWV0aG9kIHV0aWwvcGFyc2VSR0JcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciAxNui/m+WItuiJsuWAvFxuICogQHJldHVybnMge0FycmF5fSBSR0LoibLlgLzmlbDlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHBhcnNlUkdCID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL3BhcnNlUkdCJyk7XG4gKiAkcGFyc2VSR0IoJyNmZmZmZmYnKTsgLy8gPT4gWzI1NSwyNTUsMjU1XVxuICogJHBhcnNlUkdCKCcjZmZmJyk7IC8vID0+IFsyNTUsMjU1LDI1NV1cbiAqL1xuXG5jb25zdCBSRUdfSEVYID0gLyheIz9bMC05QS1GXXs2fSQpfCheIz9bMC05QS1GXXszfSQpL2k7XG5cbmZ1bmN0aW9uIHBhcnNlUkdCKGNvbG9yKSB7XG4gIHZhciBzdHIgPSBjb2xvcjtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvciBzaG91bGQgYmUgc3RyaW5nJyk7XG4gIH1cbiAgaWYgKCFSRUdfSEVYLnRlc3Qoc3RyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignV3JvbmcgUkdCIGNvbG9yIGZvcm1hdCcpO1xuICB9XG5cbiAgc3RyID0gc3RyLnJlcGxhY2UoJyMnLCAnJyk7XG4gIHZhciBhcnI7XG4gIGlmIChzdHIubGVuZ3RoID09PSAzKSB7XG4gICAgYXJyID0gc3RyLnNwbGl0KCcnKS5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjICsgYztcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhcnIgPSBzdHIubWF0Y2goL1thLWZBLUYwLTldezJ9L2cpO1xuICB9XG4gIGFyci5sZW5ndGggPSAzO1xuICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAoYykge1xuICAgIHJldHVybiBwYXJzZUludChjLCAxNik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlUkdCO1xuIiwiLyoqXG4gKiBSR0Ig6aKc6Imy5YC86L2s5o2i5Li6IEhTTC5cbiAqIC0g6L2s5o2i5YWs5byP5Y+C6ICD6IeqIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFNMX2NvbG9yX3NwYWNlLlxuICogLSByLCBnLCDlkowgYiDpnIDopoHlnKggWzAsIDI1NV0g6IyD5Zu05YaFXG4gKiAtIOi/lOWbnueahCBoLCBzLCDlkowgbCDlnKggWzAsIDFdIOS5i+mXtFxuICogQG1ldGhvZCB1dGlsL3JnYlRvSHNsXG4gKiBAcGFyYW0ge051bWJlcn0gciDnuqLoibLoibLlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBnIOe7v+iJsuiJsuWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IGIg6JOd6Imy6Imy5YC8XG4gKiBAcmV0dXJucyB7QXJyYXl9IEhTTOWQhOWAvOaVsOe7hFxuICogQGV4YW1wbGVcbiAqIHZhciAkcmdiVG9Ic2wgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvcmdiVG9Ic2wnKTtcbiAqICRyZ2JUb0hzbCgxMDAsIDIwMCwgMjUwKTsgLy8gPT4gWzAuNTU1NTU1NTU1NTU1NTU1NSwwLjkzNzQ5OTk5OTk5OTk5OTksMC42ODYyNzQ1MDk4MDM5MjE2XVxuICogJHJnYlRvSHNsKDAsIDAsIDApOyAvLyA9PiBbMCwwLDBdXG4gKiAkcmdiVG9Ic2woMjU1LCAyNTUsIDI1NSk7IC8vID0+IFswLDAsMV1cbiAqL1xuXG5mdW5jdGlvbiByZ2JUb0hzbChyLCBnLCBiKSB7XG4gIHIgLz0gMjU1O1xuICBnIC89IDI1NTtcbiAgYiAvPSAyNTU7XG4gIHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgdmFyIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICB2YXIgaDtcbiAgdmFyIHM7XG4gIHZhciBsID0gKG1heCArIG1pbikgLyAyO1xuXG4gIGlmIChtYXggPT09IG1pbikge1xuICAgIHMgPSAwOyAvLyBhY2hyb21hdGljXG4gICAgaCA9IHM7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGQgPSBtYXggLSBtaW47XG4gICAgcyA9IGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pO1xuICAgIHN3aXRjaCAobWF4KSB7XG4gICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICBjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuICAgICAgY2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcbiAgICAgIGRlZmF1bHQ6IGJyZWFrO1xuICAgIH1cbiAgICBoIC89IDY7XG4gIH1cbiAgcmV0dXJuIFtoLCBzLCBsXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZ2JUb0hzbDtcbiJdfQ==
(1)
});
