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

},{"./packages/app":12,"./packages/arr":18,"./packages/cookie":20,"./packages/date":26,"./packages/dom":27,"./packages/env":34,"./packages/evt":41,"./packages/fn":46,"./packages/fx":56,"./packages/io":64,"./packages/location":67,"./packages/mvc":72,"./packages/num":79,"./packages/obj":88,"./packages/str":100,"./packages/time":107,"./packages/util":115}],2:[function(_dereq_,module,exports){
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

},{"dom-support":3,"get-document":5,"within-element":10}],3:[function(_dereq_,module,exports){
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

},{}],8:[function(_dereq_,module,exports){
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

},{}],9:[function(_dereq_,module,exports){
(function (global){
'use strict';

var required = _dereq_('requires-port')
  , qs = _dereq_('querystringify')
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
},{"querystringify":7,"requires-port":8}],10:[function(_dereq_,module,exports){

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

},{}],11:[function(_dereq_,module,exports){
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

},{"../env/browser":31,"../obj/assign":82}],12:[function(_dereq_,module,exports){
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

exports.callUp = _dereq_('./callUp');

},{"./callUp":11}],13:[function(_dereq_,module,exports){
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

},{}],14:[function(_dereq_,module,exports){
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

},{}],15:[function(_dereq_,module,exports){
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

},{}],16:[function(_dereq_,module,exports){
/**
 * 数组扁平化
 * @method arr/flatten
 * @param {array} arr 要操作的数组
 * @returns {array} 经过扁平化处理的数组
 * @example
 * var $flatten = require('@spore-ui/kit/packages/arr/flatten');
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

},{"../obj/type":91}],17:[function(_dereq_,module,exports){
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

var $contains = _dereq_('./contains');

function include(arr, item) {
  if (!$contains(arr, item)) {
    arr.push(item);
  }
  return arr;
}

module.exports = include;

},{"./contains":13}],18:[function(_dereq_,module,exports){
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

exports.contains = _dereq_('./contains');
exports.erase = _dereq_('./erase');
exports.find = _dereq_('./find');
exports.flatten = _dereq_('./flatten');
exports.include = _dereq_('./include');

},{"./contains":13,"./erase":14,"./find":15,"./flatten":16,"./include":17}],19:[function(_dereq_,module,exports){
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

},{"js-cookie":6}],20:[function(_dereq_,module,exports){
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

exports.cookie = _dereq_('./cookie');
exports.origin = _dereq_('./origin');

},{"./cookie":19,"./origin":21}],21:[function(_dereq_,module,exports){
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
module.exports = _dereq_('js-cookie');

},{"js-cookie":6}],22:[function(_dereq_,module,exports){
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

},{"../num/fixTo":78,"../obj/assign":82,"../str/substitute":105,"./getUTCDate":25}],23:[function(_dereq_,module,exports){
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

},{"./getTimeSplit":24,"./getUTCDate":25}],24:[function(_dereq_,module,exports){
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

},{"./getUTCDate":25}],25:[function(_dereq_,module,exports){
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

},{}],26:[function(_dereq_,module,exports){
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

exports.format = _dereq_('./format');
exports.getLastStart = _dereq_('./getLastStart');
exports.getTimeSplit = _dereq_('./getTimeSplit');

},{"./format":22,"./getLastStart":23,"./getTimeSplit":24}],27:[function(_dereq_,module,exports){
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

exports.isNode = _dereq_('./isNode');
exports.offset = _dereq_('./offset');
exports.scrollLimit = _dereq_('./scrollLimit');

},{"./isNode":28,"./offset":29,"./scrollLimit":30}],28:[function(_dereq_,module,exports){
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

},{}],29:[function(_dereq_,module,exports){
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
  offset = _dereq_('document-offset');
}

module.exports = offset;

},{"document-offset":2}],30:[function(_dereq_,module,exports){
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
var $assign = _dereq_('../obj/assign');

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

},{"../obj/assign":82}],31:[function(_dereq_,module,exports){
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

},{"../obj/assign":82,"./uaMatch":38}],32:[function(_dereq_,module,exports){
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

},{"../obj/assign":82,"./uaMatch":38}],33:[function(_dereq_,module,exports){
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

},{"../obj/assign":82,"./uaMatch":38}],34:[function(_dereq_,module,exports){
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

exports.browser = _dereq_('./browser');
exports.core = _dereq_('./core');
exports.device = _dereq_('./device');
exports.network = _dereq_('./network');
exports.os = _dereq_('./os');
exports.touchable = _dereq_('./touchable');
exports.uaMatch = _dereq_('./uaMatch');
exports.webp = _dereq_('./webp');

},{"./browser":31,"./core":32,"./device":33,"./network":35,"./os":36,"./touchable":37,"./uaMatch":38,"./webp":39}],35:[function(_dereq_,module,exports){
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

},{}],36:[function(_dereq_,module,exports){
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

},{"../obj/assign":82,"./uaMatch":38}],37:[function(_dereq_,module,exports){
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

},{}],38:[function(_dereq_,module,exports){
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

},{}],39:[function(_dereq_,module,exports){
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

},{}],40:[function(_dereq_,module,exports){
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

},{}],41:[function(_dereq_,module,exports){
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

exports.Events = _dereq_('./events');
exports.Listener = _dereq_('./listener');
exports.occurInside = _dereq_('./occurInside');
exports.tapStop = _dereq_('./tapStop');

},{"./events":40,"./listener":42,"./occurInside":43,"./tapStop":44}],42:[function(_dereq_,module,exports){
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

},{"./events":40}],43:[function(_dereq_,module,exports){
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

},{}],44:[function(_dereq_,module,exports){
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

},{}],45:[function(_dereq_,module,exports){
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

},{}],46:[function(_dereq_,module,exports){
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

exports.delay = _dereq_('./delay');
exports.lock = _dereq_('./lock');
exports.noop = _dereq_('./noop');
exports.once = _dereq_('./once');
exports.queue = _dereq_('./queue');
exports.prepare = _dereq_('./prepare');
exports.regular = _dereq_('./regular');

},{"./delay":45,"./lock":47,"./noop":48,"./once":49,"./prepare":50,"./queue":51,"./regular":52}],47:[function(_dereq_,module,exports){
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

},{}],48:[function(_dereq_,module,exports){
module.exports = function () {};

},{}],49:[function(_dereq_,module,exports){
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

},{}],50:[function(_dereq_,module,exports){
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

},{}],51:[function(_dereq_,module,exports){
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

},{}],52:[function(_dereq_,module,exports){
/**
 * 包装为规律触发的函数，用于降低密集事件的处理频率
 * - 在疯狂操作期间，按照规律时间间隔，来调用任务函数
 * @method fn/reqular
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

},{}],53:[function(_dereq_,module,exports){
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

},{}],54:[function(_dereq_,module,exports){
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

},{"../obj/assign":82}],55:[function(_dereq_,module,exports){
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

var $klass = _dereq_('../mvc/klass');
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

},{"../arr/contains":13,"../arr/erase":14,"../evt/events":40,"../mvc/klass":73,"../obj/assign":82,"./timer":59}],56:[function(_dereq_,module,exports){
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

exports.easing = _dereq_('./easing');
exports.flashAction = _dereq_('./flashAction');
exports.Fx = _dereq_('./fx');
exports.smoothScrollTo = _dereq_('./smoothScrollTo');
exports.sticky = _dereq_('./sticky');
exports.timer = _dereq_('./timer');
exports.transitions = _dereq_('./transitions');

},{"./easing":53,"./flashAction":54,"./fx":55,"./smoothScrollTo":57,"./sticky":58,"./timer":59,"./transitions":60}],57:[function(_dereq_,module,exports){
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

},{"../obj/assign":82}],58:[function(_dereq_,module,exports){
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

},{}],59:[function(_dereq_,module,exports){
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

},{}],60:[function(_dereq_,module,exports){
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

},{"../obj/assign":82,"../obj/type":91,"./fx":55}],61:[function(_dereq_,module,exports){
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

},{"../obj/type":91}],62:[function(_dereq_,module,exports){
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

},{}],63:[function(_dereq_,module,exports){
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

},{}],64:[function(_dereq_,module,exports){
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

exports.ajax = _dereq_('./ajax');
exports.getScript = _dereq_('./getScript');
exports.iframePost = _dereq_('./iframePost');
exports.loadSdk = _dereq_('./loadSdk');

},{"./ajax":61,"./getScript":62,"./iframePost":63,"./loadSdk":65}],65:[function(_dereq_,module,exports){
var $assign = _dereq_('../obj/assign');
var $get = _dereq_('../obj/get');
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

},{"../obj/assign":82,"../obj/get":87,"./getScript":62}],66:[function(_dereq_,module,exports){
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

},{}],67:[function(_dereq_,module,exports){
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

exports.getQuery = _dereq_('./getQuery');
exports.setQuery = _dereq_('./setQuery');
exports.parse = _dereq_('./parse');

},{"./getQuery":66,"./parse":68,"./setQuery":69}],68:[function(_dereq_,module,exports){
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

var Url = _dereq_('url-parse');

function parse(url) {
  return new Url(url);
}

module.exports = parse;

},{"url-parse":9}],69:[function(_dereq_,module,exports){
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

},{}],70:[function(_dereq_,module,exports){
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

var $merge = _dereq_('../obj/merge');
var $type = _dereq_('../obj/type');
var $noop = _dereq_('../fn/noop');
var $events = _dereq_('../evt/events');
var $klass = _dereq_('./klass');
var $proxy = _dereq_('./proxy');

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

},{"../evt/events":40,"../fn/noop":48,"../obj/merge":89,"../obj/type":91,"./klass":73,"./proxy":75}],71:[function(_dereq_,module,exports){
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

var $assign = _dereq_('../obj/assign');
var $type = _dereq_('../obj/type');

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

},{"../obj/assign":82,"../obj/type":91}],72:[function(_dereq_,module,exports){
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

exports.klass = _dereq_('./klass');
exports.delegate = _dereq_('./delegate');
exports.proxy = _dereq_('./proxy');
exports.Base = _dereq_('./base');
exports.Model = _dereq_('./model');
exports.View = _dereq_('./view');

},{"./base":70,"./delegate":71,"./klass":73,"./model":74,"./proxy":75,"./view":76}],73:[function(_dereq_,module,exports){
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

},{}],74:[function(_dereq_,module,exports){
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

var $assign = _dereq_('../obj/assign');
var $type = _dereq_('../obj/type');
var $cloneDeep = _dereq_('../obj/cloneDeep');
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

},{"../obj/assign":82,"../obj/cloneDeep":84,"../obj/type":91,"./base":70,"./delegate":71}],75:[function(_dereq_,module,exports){
/**
 * 函数代理，确保函数在当前类创建的实例上下文中执行。
 * - 这些用于绑定事件的代理函数都放在属性 instance.bound 上。
 * - 功能类似 Function.prototype.bind 。
 * - 可以传递额外参数作为函数执行的默认参数，追加在实际参数之后。
 * @method mvc/proxy
 * @param {object} instance 对象实例
 * @param {string} [name='proxy'] 函数名称
 */

var $type = _dereq_('../obj/type');

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

},{"../obj/type":91}],76:[function(_dereq_,module,exports){
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

},{"./base":70,"./delegate":71}],77:[function(_dereq_,module,exports){
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

},{}],78:[function(_dereq_,module,exports){
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

},{}],79:[function(_dereq_,module,exports){
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

exports.comma = _dereq_('./comma');
exports.fixTo = _dereq_('./fixTo');
exports.limit = _dereq_('./limit');
exports.numerical = _dereq_('./numerical');

},{"./comma":77,"./fixTo":78,"./limit":80,"./numerical":81}],80:[function(_dereq_,module,exports){
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

},{}],81:[function(_dereq_,module,exports){
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

},{}],82:[function(_dereq_,module,exports){
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

},{}],83:[function(_dereq_,module,exports){
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

},{}],84:[function(_dereq_,module,exports){
var $type = _dereq_('./type');

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

},{"./type":91}],85:[function(_dereq_,module,exports){
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

},{}],86:[function(_dereq_,module,exports){
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

},{}],87:[function(_dereq_,module,exports){
var $type = _dereq_('./type');
var $keyPathSplit = _dereq_('../str/keyPathSplit');

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

},{"../str/keyPathSplit":102,"./type":91}],88:[function(_dereq_,module,exports){
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

exports.assign = _dereq_('./assign');
exports.clone = _dereq_('./clone');
exports.cloneDeep = _dereq_('./cloneDeep');
exports.merge = _dereq_('./merge');
exports.cover = _dereq_('./cover');
exports.find = _dereq_('./find');
exports.get = _dereq_('./get');
exports.set = _dereq_('./set');
exports.type = _dereq_('./type');

},{"./assign":82,"./clone":83,"./cloneDeep":84,"./cover":85,"./find":86,"./get":87,"./merge":89,"./set":90,"./type":91}],89:[function(_dereq_,module,exports){
var $type = _dereq_('./type');

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

},{"./type":91}],90:[function(_dereq_,module,exports){
var $type = _dereq_('./type');
var $get = _dereq_('./get');
var $keyPathSplit = _dereq_('../str/keyPathSplit');

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

},{"../str/keyPathSplit":102,"./get":87,"./type":91}],91:[function(_dereq_,module,exports){
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

},{}],92:[function(_dereq_,module,exports){
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

},{}],93:[function(_dereq_,module,exports){
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

},{}],94:[function(_dereq_,module,exports){
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

},{}],95:[function(_dereq_,module,exports){
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

},{}],96:[function(_dereq_,module,exports){
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

},{}],97:[function(_dereq_,module,exports){
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

},{}],98:[function(_dereq_,module,exports){
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

},{}],99:[function(_dereq_,module,exports){
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

},{}],100:[function(_dereq_,module,exports){
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
exports.keyPathSplit = _dereq_('./keyPathSplit');

},{"./bLength":92,"./dbcToSbc":93,"./decodeHTML":94,"./encodeHTML":95,"./getRnd36":96,"./getTime36":97,"./getUniqueKey":98,"./hyphenate":99,"./ipToHex":101,"./keyPathSplit":102,"./leftB":103,"./sizeOfUTF8String":104,"./substitute":105}],101:[function(_dereq_,module,exports){
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

},{}],102:[function(_dereq_,module,exports){
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

},{}],103:[function(_dereq_,module,exports){
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

},{"./bLength":92}],104:[function(_dereq_,module,exports){
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

},{}],105:[function(_dereq_,module,exports){
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

},{}],106:[function(_dereq_,module,exports){
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

},{"../arr/erase":14,"../obj/assign":82}],107:[function(_dereq_,module,exports){
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

exports.countDown = _dereq_('./countDown');
exports.parseUnit = _dereq_('./parseUnit');

},{"./countDown":106,"./parseUnit":108}],108:[function(_dereq_,module,exports){
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

},{"../num/numerical":81,"../obj/assign":82}],109:[function(_dereq_,module,exports){
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

},{}],110:[function(_dereq_,module,exports){
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

},{}],111:[function(_dereq_,module,exports){
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

},{}],112:[function(_dereq_,module,exports){
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

},{}],113:[function(_dereq_,module,exports){
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

},{}],114:[function(_dereq_,module,exports){
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

},{}],115:[function(_dereq_,module,exports){
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

exports.abToHex = _dereq_('./abToHex');
exports.ascToHex = _dereq_('./ascToHex');
exports.compareVersion = _dereq_('./compareVersion');
exports.hexToAb = _dereq_('./hexToAb');
exports.hexToAsc = _dereq_('./hexToAsc');
exports.hslToRgb = _dereq_('./hslToRgb');
exports.job = _dereq_('./job');
exports.measureDistance = _dereq_('./measureDistance');
exports.parseRGB = _dereq_('./parseRGB');
exports.rgbToHsl = _dereq_('./rgbToHsl');

},{"./abToHex":109,"./ascToHex":110,"./compareVersion":111,"./hexToAb":112,"./hexToAsc":113,"./hslToRgb":114,"./job":116,"./measureDistance":117,"./parseRGB":118,"./rgbToHsl":119}],116:[function(_dereq_,module,exports){
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

},{}],117:[function(_dereq_,module,exports){
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

},{}],118:[function(_dereq_,module,exports){
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

},{}],119:[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvZmFrZV8yNTFhM2I1OC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2RvY3VtZW50LW9mZnNldC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL2RvbS1zdXBwb3J0L2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9ub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9nZXQtZG9jdW1lbnQvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9qcy1jb29raWUvZGlzdC9qcy5jb29raWUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZ2lmeS9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvbm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy91cmwtcGFyc2UvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L25vZGVfbW9kdWxlcy93aXRoaW4tZWxlbWVudC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXBwL2NhbGxVcC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXBwL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvY29udGFpbnMuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9lcmFzZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2ZpbmQuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9hcnIvaW5jbHVkZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvYXJyL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvY29va2llLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9jb29raWUvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Nvb2tpZS9vcmlnaW4uanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kYXRlL2dldExhc3RTdGFydC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9nZXRUaW1lU3BsaXQuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZGF0ZS9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZG9tL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vaXNOb2RlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vb2Zmc2V0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9kb20vc2Nyb2xsTGltaXQuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Vudi9icm93c2VyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvY29yZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L2RldmljZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvbmV0d29yay5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L29zLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9lbnYvdWFNYXRjaC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZW52L3dlYnAuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZXZ0L2xpc3RlbmVyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9ldnQvb2NjdXJJbnNpZGUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2V2dC90YXBTdG9wLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9kZWxheS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZm4vaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL2xvY2suanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL25vb3AuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL29uY2UuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3ByZXBhcmUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2ZuL3F1ZXVlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9mbi9yZWd1bGFyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9lYXNpbmcuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L2ZsYXNoQWN0aW9uLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9meC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvZngvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3Ntb290aFNjcm9sbFRvLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC9zdGlja3kuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2Z4L3RpbWVyLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9meC90cmFuc2l0aW9ucy5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvaW8vYWpheC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9pZnJhbWVQb3N0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9pby9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvaW8vbG9hZFNkay5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vZ2V0UXVlcnkuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL2xvY2F0aW9uL2luZGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9sb2NhdGlvbi9wYXJzZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbG9jYXRpb24vc2V0UXVlcnkuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9iYXNlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvZGVsZWdhdGUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbXZjL2tsYXNzLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9tdmMvbW9kZWwuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL212Yy9wcm94eS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbXZjL3ZpZXcuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL251bS9jb21tYS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbnVtL2ZpeFRvLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9udW0vaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL251bS9saW1pdC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvbnVtL251bWVyaWNhbC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2Fzc2lnbi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL2Nsb25lLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovY2xvbmVEZWVwLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovY292ZXIuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL29iai9maW5kLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovZ2V0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9vYmovaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL29iai9tZXJnZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL3NldC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvb2JqL3R5cGUuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9iTGVuZ3RoLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZGJjVG9TYmMuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9kZWNvZGVIVE1MLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZW5jb2RlSFRNTC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvc3RyL2dldFJuZDM2LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VGltZTM2LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvZ2V0VW5pcXVlS2V5LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvaHlwaGVuYXRlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9pcFRvSGV4LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIva2V5UGF0aFNwbGl0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvbGVmdEIuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3N0ci9zaXplT2ZVVEY4U3RyaW5nLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy9zdHIvc3Vic3RpdHV0ZS5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdGltZS9jb3VudERvd24uanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvaW5kZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3RpbWUvcGFyc2VVbml0LmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL2FiVG9IZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvYXNjVG9IZXguanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvY29tcGFyZVZlcnNpb24uanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9BYi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oZXhUb0FzYy5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9oc2xUb1JnYi5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9pbmRleC5qcyIsIi9ob21lL3J1bm5lci93b3JrL3Nwb3JlLWtpdC9zcG9yZS1raXQvcGFja2FnZXMvdXRpbC9qb2IuanMiLCIvaG9tZS9ydW5uZXIvd29yay9zcG9yZS1raXQvc3BvcmUta2l0L3BhY2thZ2VzL3V0aWwvbWVhc3VyZURpc3RhbmNlLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL3BhcnNlUkdCLmpzIiwiL2hvbWUvcnVubmVyL3dvcmsvc3BvcmUta2l0L3Nwb3JlLWtpdC9wYWNrYWdlcy91dGlsL3JnYlRvSHNsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL2tCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy5hcHAgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2FwcCcpO1xuZXhwb3J0cy5hcnIgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2FycicpO1xuZXhwb3J0cy5jb29raWUgPSByZXF1aXJlKCcuL3BhY2thZ2VzL2Nvb2tpZScpO1xuZXhwb3J0cy5kYXRlID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9kYXRlJyk7XG5leHBvcnRzLmRvbSA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZG9tJyk7XG5leHBvcnRzLmVudiA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZW52Jyk7XG5leHBvcnRzLmV2dCA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZXZ0Jyk7XG5leHBvcnRzLmZuID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9mbicpO1xuZXhwb3J0cy5meCA9IHJlcXVpcmUoJy4vcGFja2FnZXMvZngnKTtcbmV4cG9ydHMuaW8gPSByZXF1aXJlKCcuL3BhY2thZ2VzL2lvJyk7XG5leHBvcnRzLmxvY2F0aW9uID0gcmVxdWlyZSgnLi9wYWNrYWdlcy9sb2NhdGlvbicpO1xuZXhwb3J0cy5tdmMgPSByZXF1aXJlKCcuL3BhY2thZ2VzL212YycpO1xuZXhwb3J0cy5udW0gPSByZXF1aXJlKCcuL3BhY2thZ2VzL251bScpO1xuZXhwb3J0cy5vYmogPSByZXF1aXJlKCcuL3BhY2thZ2VzL29iaicpO1xuZXhwb3J0cy5zdHIgPSByZXF1aXJlKCcuL3BhY2thZ2VzL3N0cicpO1xuZXhwb3J0cy50aW1lID0gcmVxdWlyZSgnLi9wYWNrYWdlcy90aW1lJyk7XG5leHBvcnRzLnV0aWwgPSByZXF1aXJlKCcuL3BhY2thZ2VzL3V0aWwnKTtcbiIsInZhciBzdXBwb3J0ID0gcmVxdWlyZSgnZG9tLXN1cHBvcnQnKVxudmFyIGdldERvY3VtZW50ID0gcmVxdWlyZSgnZ2V0LWRvY3VtZW50JylcbnZhciB3aXRoaW5FbGVtZW50ID0gcmVxdWlyZSgnd2l0aGluLWVsZW1lbnQnKVxuXG4vKipcbiAqIEdldCBvZmZzZXQgb2YgYSBET00gRWxlbWVudCBvciBSYW5nZSB3aXRoaW4gdGhlIGRvY3VtZW50LlxuICpcbiAqIEBwYXJhbSB7RE9NRWxlbWVudHxSYW5nZX0gZWwgLSB0aGUgRE9NIGVsZW1lbnQgb3IgUmFuZ2UgaW5zdGFuY2UgdG8gbWVhc3VyZVxuICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCBgdG9wYCBhbmQgYGxlZnRgIE51bWJlciB2YWx1ZXNcbiAqIEBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9mZnNldChlbCkge1xuICB2YXIgZG9jID0gZ2V0RG9jdW1lbnQoZWwpXG4gIGlmICghZG9jKSByZXR1cm5cblxuICAvLyBNYWtlIHN1cmUgaXQncyBub3QgYSBkaXNjb25uZWN0ZWQgRE9NIG5vZGVcbiAgaWYgKCF3aXRoaW5FbGVtZW50KGVsLCBkb2MpKSByZXR1cm5cblxuICB2YXIgYm9keSA9IGRvYy5ib2R5XG4gIGlmIChib2R5ID09PSBlbCkge1xuICAgIHJldHVybiBib2R5T2Zmc2V0KGVsKVxuICB9XG5cbiAgdmFyIGJveCA9IHsgdG9wOiAwLCBsZWZ0OiAwIH1cbiAgaWYgKCB0eXBlb2YgZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgZ0JDUiwganVzdCB1c2UgMCwwIHJhdGhlciB0aGFuIGVycm9yXG4gICAgLy8gQmxhY2tCZXJyeSA1LCBpT1MgMyAob3JpZ2luYWwgaVBob25lKVxuICAgIGJveCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBpZiAoZWwuY29sbGFwc2VkICYmIGJveC5sZWZ0ID09PSAwICYmIGJveC50b3AgPT09IDApIHtcbiAgICAgIC8vIGNvbGxhcHNlZCBSYW5nZSBpbnN0YW5jZXMgc29tZXRpbWVzIHJlcG9ydCAwLCAwXG4gICAgICAvLyBzZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY4NDczMjgvMzc2NzczXG4gICAgICB2YXIgc3BhbiA9IGRvYy5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblxuICAgICAgLy8gRW5zdXJlIHNwYW4gaGFzIGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uIGJ5XG4gICAgICAvLyBhZGRpbmcgYSB6ZXJvLXdpZHRoIHNwYWNlIGNoYXJhY3RlclxuICAgICAgc3Bhbi5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUoXCJcXHUyMDBiXCIpKTtcbiAgICAgIGVsLmluc2VydE5vZGUoc3Bhbik7XG4gICAgICBib3ggPSBzcGFuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAvLyBSZW1vdmUgdGVtcCBTUEFOIGFuZCBnbHVlIGFueSBicm9rZW4gdGV4dCBub2RlcyBiYWNrIHRvZ2V0aGVyXG4gICAgICB2YXIgc3BhblBhcmVudCA9IHNwYW4ucGFyZW50Tm9kZTtcbiAgICAgIHNwYW5QYXJlbnQucmVtb3ZlQ2hpbGQoc3Bhbik7XG4gICAgICBzcGFuUGFyZW50Lm5vcm1hbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkb2NFbCA9IGRvYy5kb2N1bWVudEVsZW1lbnRcbiAgdmFyIGNsaWVudFRvcCAgPSBkb2NFbC5jbGllbnRUb3AgIHx8IGJvZHkuY2xpZW50VG9wICB8fCAwXG4gIHZhciBjbGllbnRMZWZ0ID0gZG9jRWwuY2xpZW50TGVmdCB8fCBib2R5LmNsaWVudExlZnQgfHwgMFxuICB2YXIgc2Nyb2xsVG9wICA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2NFbC5zY3JvbGxUb3BcbiAgdmFyIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsTGVmdFxuXG4gIHJldHVybiB7XG4gICAgdG9wOiBib3gudG9wICArIHNjcm9sbFRvcCAgLSBjbGllbnRUb3AsXG4gICAgbGVmdDogYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdFxuICB9XG59XG5cbmZ1bmN0aW9uIGJvZHlPZmZzZXQoYm9keSkge1xuICB2YXIgdG9wID0gYm9keS5vZmZzZXRUb3BcbiAgdmFyIGxlZnQgPSBib2R5Lm9mZnNldExlZnRcblxuICBpZiAoc3VwcG9ydC5kb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldCkge1xuICAgIHRvcCAgKz0gcGFyc2VGbG9hdChib2R5LnN0eWxlLm1hcmdpblRvcCB8fCAwKVxuICAgIGxlZnQgKz0gcGFyc2VGbG9hdChib2R5LnN0eWxlLm1hcmdpbkxlZnQgfHwgMClcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiB0b3AsXG4gICAgbGVmdDogbGVmdFxuICB9XG59XG4iLCJ2YXIgZG9tcmVhZHkgPSByZXF1aXJlKCdkb21yZWFkeScpXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBzdXBwb3J0LFxuXHRcdGFsbCxcblx0XHRhLFxuXHRcdHNlbGVjdCxcblx0XHRvcHQsXG5cdFx0aW5wdXQsXG5cdFx0ZnJhZ21lbnQsXG5cdFx0ZXZlbnROYW1lLFxuXHRcdGksXG5cdFx0aXNTdXBwb3J0ZWQsXG5cdFx0Y2xpY2tGbixcblx0XHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG5cdC8vIFNldHVwXG5cdGRpdi5zZXRBdHRyaWJ1dGUoIFwiY2xhc3NOYW1lXCIsIFwidFwiICk7XG5cdGRpdi5pbm5lckhUTUwgPSBcIiAgPGxpbmsvPjx0YWJsZT48L3RhYmxlPjxhIGhyZWY9Jy9hJz5hPC9hPjxpbnB1dCB0eXBlPSdjaGVja2JveCcvPlwiO1xuXG5cdC8vIFN1cHBvcnQgdGVzdHMgd29uJ3QgcnVuIGluIHNvbWUgbGltaXRlZCBvciBub24tYnJvd3NlciBlbnZpcm9ubWVudHNcblx0YWxsID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKTtcblx0YSA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbIDAgXTtcblx0aWYgKCAhYWxsIHx8ICFhIHx8ICFhbGwubGVuZ3RoICkge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdC8vIEZpcnN0IGJhdGNoIG9mIHRlc3RzXG5cdHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG5cdG9wdCA9IHNlbGVjdC5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSApO1xuXHRpbnB1dCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWyAwIF07XG5cblx0YS5zdHlsZS5jc3NUZXh0ID0gXCJ0b3A6MXB4O2Zsb2F0OmxlZnQ7b3BhY2l0eTouNVwiO1xuXHRzdXBwb3J0ID0ge1xuXHRcdC8vIElFIHN0cmlwcyBsZWFkaW5nIHdoaXRlc3BhY2Ugd2hlbiAuaW5uZXJIVE1MIGlzIHVzZWRcblx0XHRsZWFkaW5nV2hpdGVzcGFjZTogKCBkaXYuZmlyc3RDaGlsZC5ub2RlVHlwZSA9PT0gMyApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgdGJvZHkgZWxlbWVudHMgYXJlbid0IGF1dG9tYXRpY2FsbHkgaW5zZXJ0ZWRcblx0XHQvLyBJRSB3aWxsIGluc2VydCB0aGVtIGludG8gZW1wdHkgdGFibGVzXG5cdFx0dGJvZHk6ICFkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKS5sZW5ndGgsXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBsaW5rIGVsZW1lbnRzIGdldCBzZXJpYWxpemVkIGNvcnJlY3RseSBieSBpbm5lckhUTUxcblx0XHQvLyBUaGlzIHJlcXVpcmVzIGEgd3JhcHBlciBlbGVtZW50IGluIElFXG5cdFx0aHRtbFNlcmlhbGl6ZTogISFkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIpLmxlbmd0aCxcblxuXHRcdC8vIEdldCB0aGUgc3R5bGUgaW5mb3JtYXRpb24gZnJvbSBnZXRBdHRyaWJ1dGVcblx0XHQvLyAoSUUgdXNlcyAuY3NzVGV4dCBpbnN0ZWFkKVxuXHRcdHN0eWxlOiAvdG9wLy50ZXN0KCBhLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBVUkxzIGFyZW4ndCBtYW5pcHVsYXRlZFxuXHRcdC8vIChJRSBub3JtYWxpemVzIGl0IGJ5IGRlZmF1bHQpXG5cdFx0aHJlZk5vcm1hbGl6ZWQ6ICggYS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIi9hXCIgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGVsZW1lbnQgb3BhY2l0eSBleGlzdHNcblx0XHQvLyAoSUUgdXNlcyBmaWx0ZXIgaW5zdGVhZClcblx0XHQvLyBVc2UgYSByZWdleCB0byB3b3JrIGFyb3VuZCBhIFdlYktpdCBpc3N1ZS4gU2VlICM1MTQ1XG5cdFx0b3BhY2l0eTogL14wLjUvLnRlc3QoIGEuc3R5bGUub3BhY2l0eSApLFxuXG5cdFx0Ly8gVmVyaWZ5IHN0eWxlIGZsb2F0IGV4aXN0ZW5jZVxuXHRcdC8vIChJRSB1c2VzIHN0eWxlRmxvYXQgaW5zdGVhZCBvZiBjc3NGbG9hdClcblx0XHRjc3NGbG9hdDogISFhLnN0eWxlLmNzc0Zsb2F0LFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgaWYgbm8gdmFsdWUgaXMgc3BlY2lmaWVkIGZvciBhIGNoZWNrYm94XG5cdFx0Ly8gdGhhdCBpdCBkZWZhdWx0cyB0byBcIm9uXCIuXG5cdFx0Ly8gKFdlYktpdCBkZWZhdWx0cyB0byBcIlwiIGluc3RlYWQpXG5cdFx0Y2hlY2tPbjogKCBpbnB1dC52YWx1ZSA9PT0gXCJvblwiICksXG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBhIHNlbGVjdGVkLWJ5LWRlZmF1bHQgb3B0aW9uIGhhcyBhIHdvcmtpbmcgc2VsZWN0ZWQgcHJvcGVydHkuXG5cdFx0Ly8gKFdlYktpdCBkZWZhdWx0cyB0byBmYWxzZSBpbnN0ZWFkIG9mIHRydWUsIElFIHRvbywgaWYgaXQncyBpbiBhbiBvcHRncm91cClcblx0XHRvcHRTZWxlY3RlZDogb3B0LnNlbGVjdGVkLFxuXG5cdFx0Ly8gVGVzdCBzZXRBdHRyaWJ1dGUgb24gY2FtZWxDYXNlIGNsYXNzLiBJZiBpdCB3b3Jrcywgd2UgbmVlZCBhdHRyRml4ZXMgd2hlbiBkb2luZyBnZXQvc2V0QXR0cmlidXRlIChpZTYvNylcblx0XHRnZXRTZXRBdHRyaWJ1dGU6IGRpdi5jbGFzc05hbWUgIT09IFwidFwiLFxuXG5cdFx0Ly8gVGVzdHMgZm9yIGVuY3R5cGUgc3VwcG9ydCBvbiBhIGZvcm0gKCM2NzQzKVxuXHRcdGVuY3R5cGU6ICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIikuZW5jdHlwZSxcblxuXHRcdC8vIE1ha2VzIHN1cmUgY2xvbmluZyBhbiBodG1sNSBlbGVtZW50IGRvZXMgbm90IGNhdXNlIHByb2JsZW1zXG5cdFx0Ly8gV2hlcmUgb3V0ZXJIVE1MIGlzIHVuZGVmaW5lZCwgdGhpcyBzdGlsbCB3b3Jrc1xuXHRcdGh0bWw1Q2xvbmU6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIikuY2xvbmVOb2RlKCB0cnVlICkub3V0ZXJIVE1MICE9PSBcIjw6bmF2PjwvOm5hdj5cIixcblxuXHRcdC8vIGpRdWVyeS5zdXBwb3J0LmJveE1vZGVsIERFUFJFQ0FURUQgaW4gMS44IHNpbmNlIHdlIGRvbid0IHN1cHBvcnQgUXVpcmtzIE1vZGVcblx0XHRib3hNb2RlbDogKCBkb2N1bWVudC5jb21wYXRNb2RlID09PSBcIkNTUzFDb21wYXRcIiApLFxuXG5cdFx0Ly8gV2lsbCBiZSBkZWZpbmVkIGxhdGVyXG5cdFx0c3VibWl0QnViYmxlczogdHJ1ZSxcblx0XHRjaGFuZ2VCdWJibGVzOiB0cnVlLFxuXHRcdGZvY3VzaW5CdWJibGVzOiBmYWxzZSxcblx0XHRkZWxldGVFeHBhbmRvOiB0cnVlLFxuXHRcdG5vQ2xvbmVFdmVudDogdHJ1ZSxcblx0XHRpbmxpbmVCbG9ja05lZWRzTGF5b3V0OiBmYWxzZSxcblx0XHRzaHJpbmtXcmFwQmxvY2tzOiBmYWxzZSxcblx0XHRyZWxpYWJsZU1hcmdpblJpZ2h0OiB0cnVlLFxuXHRcdGJveFNpemluZ1JlbGlhYmxlOiB0cnVlLFxuXHRcdHBpeGVsUG9zaXRpb246IGZhbHNlXG5cdH07XG5cblx0Ly8gTWFrZSBzdXJlIGNoZWNrZWQgc3RhdHVzIGlzIHByb3Blcmx5IGNsb25lZFxuXHRpbnB1dC5jaGVja2VkID0gdHJ1ZTtcblx0c3VwcG9ydC5ub0Nsb25lQ2hlY2tlZCA9IGlucHV0LmNsb25lTm9kZSggdHJ1ZSApLmNoZWNrZWQ7XG5cblx0Ly8gTWFrZSBzdXJlIHRoYXQgdGhlIG9wdGlvbnMgaW5zaWRlIGRpc2FibGVkIHNlbGVjdHMgYXJlbid0IG1hcmtlZCBhcyBkaXNhYmxlZFxuXHQvLyAoV2ViS2l0IG1hcmtzIHRoZW0gYXMgZGlzYWJsZWQpXG5cdHNlbGVjdC5kaXNhYmxlZCA9IHRydWU7XG5cdHN1cHBvcnQub3B0RGlzYWJsZWQgPSAhb3B0LmRpc2FibGVkO1xuXG5cdC8vIFRlc3QgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZGVsZXRlIGFuIGV4cGFuZG8gZnJvbSBhbiBlbGVtZW50XG5cdC8vIEZhaWxzIGluIEludGVybmV0IEV4cGxvcmVyXG5cdHRyeSB7XG5cdFx0ZGVsZXRlIGRpdi50ZXN0O1xuXHR9IGNhdGNoKCBlICkge1xuXHRcdHN1cHBvcnQuZGVsZXRlRXhwYW5kbyA9IGZhbHNlO1xuXHR9XG5cblx0aWYgKCAhZGl2LmFkZEV2ZW50TGlzdGVuZXIgJiYgZGl2LmF0dGFjaEV2ZW50ICYmIGRpdi5maXJlRXZlbnQgKSB7XG5cdFx0ZGl2LmF0dGFjaEV2ZW50KCBcIm9uY2xpY2tcIiwgY2xpY2tGbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gQ2xvbmluZyBhIG5vZGUgc2hvdWxkbid0IGNvcHkgb3ZlciBhbnlcblx0XHRcdC8vIGJvdW5kIGV2ZW50IGhhbmRsZXJzIChJRSBkb2VzIHRoaXMpXG5cdFx0XHRzdXBwb3J0Lm5vQ2xvbmVFdmVudCA9IGZhbHNlO1xuXHRcdH0pO1xuXHRcdGRpdi5jbG9uZU5vZGUoIHRydWUgKS5maXJlRXZlbnQoXCJvbmNsaWNrXCIpO1xuXHRcdGRpdi5kZXRhY2hFdmVudCggXCJvbmNsaWNrXCIsIGNsaWNrRm4gKTtcblx0fVxuXG5cdC8vIENoZWNrIGlmIGEgcmFkaW8gbWFpbnRhaW5zIGl0cyB2YWx1ZVxuXHQvLyBhZnRlciBiZWluZyBhcHBlbmRlZCB0byB0aGUgRE9NXG5cdGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuXHRpbnB1dC52YWx1ZSA9IFwidFwiO1xuXHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCBcInJhZGlvXCIgKTtcblx0c3VwcG9ydC5yYWRpb1ZhbHVlID0gaW5wdXQudmFsdWUgPT09IFwidFwiO1xuXG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJjaGVja2VkXCIsIFwiY2hlY2tlZFwiICk7XG5cblx0Ly8gIzExMjE3IC0gV2ViS2l0IGxvc2VzIGNoZWNrIHdoZW4gdGhlIG5hbWUgaXMgYWZ0ZXIgdGhlIGNoZWNrZWQgYXR0cmlidXRlXG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwidFwiICk7XG5cblx0ZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuXHRmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdi5sYXN0Q2hpbGQgKTtcblxuXHQvLyBXZWJLaXQgZG9lc24ndCBjbG9uZSBjaGVja2VkIHN0YXRlIGNvcnJlY3RseSBpbiBmcmFnbWVudHNcblx0c3VwcG9ydC5jaGVja0Nsb25lID0gZnJhZ21lbnQuY2xvbmVOb2RlKCB0cnVlICkuY2xvbmVOb2RlKCB0cnVlICkubGFzdENoaWxkLmNoZWNrZWQ7XG5cblx0Ly8gQ2hlY2sgaWYgYSBkaXNjb25uZWN0ZWQgY2hlY2tib3ggd2lsbCByZXRhaW4gaXRzIGNoZWNrZWRcblx0Ly8gdmFsdWUgb2YgdHJ1ZSBhZnRlciBhcHBlbmRlZCB0byB0aGUgRE9NIChJRTYvNylcblx0c3VwcG9ydC5hcHBlbmRDaGVja2VkID0gaW5wdXQuY2hlY2tlZDtcblxuXHRmcmFnbWVudC5yZW1vdmVDaGlsZCggaW5wdXQgKTtcblx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXG5cdC8vIFRlY2huaXF1ZSBmcm9tIEp1cml5IFpheXRzZXZcblx0Ly8gaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vZGV0ZWN0aW5nLWV2ZW50LXN1cHBvcnQtd2l0aG91dC1icm93c2VyLXNuaWZmaW5nL1xuXHQvLyBXZSBvbmx5IGNhcmUgYWJvdXQgdGhlIGNhc2Ugd2hlcmUgbm9uLXN0YW5kYXJkIGV2ZW50IHN5c3RlbXNcblx0Ly8gYXJlIHVzZWQsIG5hbWVseSBpbiBJRS4gU2hvcnQtY2lyY3VpdGluZyBoZXJlIGhlbHBzIHVzIHRvXG5cdC8vIGF2b2lkIGFuIGV2YWwgY2FsbCAoaW4gc2V0QXR0cmlidXRlKSB3aGljaCBjYW4gY2F1c2UgQ1NQXG5cdC8vIHRvIGdvIGhheXdpcmUuIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vU2VjdXJpdHkvQ1NQXG5cdGlmICggIWRpdi5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdGZvciAoIGkgaW4ge1xuXHRcdFx0c3VibWl0OiB0cnVlLFxuXHRcdFx0Y2hhbmdlOiB0cnVlLFxuXHRcdFx0Zm9jdXNpbjogdHJ1ZVxuXHRcdH0pIHtcblx0XHRcdGV2ZW50TmFtZSA9IFwib25cIiArIGk7XG5cdFx0XHRpc1N1cHBvcnRlZCA9ICggZXZlbnROYW1lIGluIGRpdiApO1xuXHRcdFx0aWYgKCAhaXNTdXBwb3J0ZWQgKSB7XG5cdFx0XHRcdGRpdi5zZXRBdHRyaWJ1dGUoIGV2ZW50TmFtZSwgXCJyZXR1cm47XCIgKTtcblx0XHRcdFx0aXNTdXBwb3J0ZWQgPSAoIHR5cGVvZiBkaXZbIGV2ZW50TmFtZSBdID09PSBcImZ1bmN0aW9uXCIgKTtcblx0XHRcdH1cblx0XHRcdHN1cHBvcnRbIGkgKyBcIkJ1YmJsZXNcIiBdID0gaXNTdXBwb3J0ZWQ7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUnVuIHRlc3RzIHRoYXQgbmVlZCBhIGJvZHkgYXQgZG9jIHJlYWR5XG5cdGRvbXJlYWR5KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250YWluZXIsIGRpdiwgdGRzLCBtYXJnaW5EaXYsXG5cdFx0XHRkaXZSZXNldCA9IFwicGFkZGluZzowO21hcmdpbjowO2JvcmRlcjowO2Rpc3BsYXk6YmxvY2s7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaXppbmc6Y29udGVudC1ib3g7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94Oy13ZWJraXQtYm94LXNpemluZzpjb250ZW50LWJveDtcIixcblx0XHRcdGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG5cblx0XHRpZiAoICFib2R5ICkge1xuXHRcdFx0Ly8gUmV0dXJuIGZvciBmcmFtZXNldCBkb2NzIHRoYXQgZG9uJ3QgaGF2ZSBhIGJvZHlcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGNvbnRhaW5lci5zdHlsZS5jc3NUZXh0ID0gXCJ2aXNpYmlsaXR5OmhpZGRlbjtib3JkZXI6MDt3aWR0aDowO2hlaWdodDowO3Bvc2l0aW9uOnN0YXRpYzt0b3A6MDttYXJnaW4tdG9wOjFweFwiO1xuXHRcdGJvZHkuaW5zZXJ0QmVmb3JlKCBjb250YWluZXIsIGJvZHkuZmlyc3RDaGlsZCApO1xuXG5cdFx0Ly8gQ29uc3RydWN0IHRoZSB0ZXN0IGVsZW1lbnRcblx0XHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggZGl2ICk7XG5cbiAgICAvL0NoZWNrIGlmIHRhYmxlIGNlbGxzIHN0aWxsIGhhdmUgb2Zmc2V0V2lkdGgvSGVpZ2h0IHdoZW4gdGhleSBhcmUgc2V0XG4gICAgLy90byBkaXNwbGF5Om5vbmUgYW5kIHRoZXJlIGFyZSBzdGlsbCBvdGhlciB2aXNpYmxlIHRhYmxlIGNlbGxzIGluIGFcbiAgICAvL3RhYmxlIHJvdzsgaWYgc28sIG9mZnNldFdpZHRoL0hlaWdodCBhcmUgbm90IHJlbGlhYmxlIGZvciB1c2Ugd2hlblxuICAgIC8vZGV0ZXJtaW5pbmcgaWYgYW4gZWxlbWVudCBoYXMgYmVlbiBoaWRkZW4gZGlyZWN0bHkgdXNpbmdcbiAgICAvL2Rpc3BsYXk6bm9uZSAoaXQgaXMgc3RpbGwgc2FmZSB0byB1c2Ugb2Zmc2V0cyBpZiBhIHBhcmVudCBlbGVtZW50IGlzXG4gICAgLy9oaWRkZW47IGRvbiBzYWZldHkgZ29nZ2xlcyBhbmQgc2VlIGJ1ZyAjNDUxMiBmb3IgbW9yZSBpbmZvcm1hdGlvbikuXG4gICAgLy8ob25seSBJRSA4IGZhaWxzIHRoaXMgdGVzdClcblx0XHRkaXYuaW5uZXJIVE1MID0gXCI8dGFibGU+PHRyPjx0ZD48L3RkPjx0ZD50PC90ZD48L3RyPjwvdGFibGU+XCI7XG5cdFx0dGRzID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGRcIik7XG5cdFx0dGRzWyAwIF0uc3R5bGUuY3NzVGV4dCA9IFwicGFkZGluZzowO21hcmdpbjowO2JvcmRlcjowO2Rpc3BsYXk6bm9uZVwiO1xuXHRcdGlzU3VwcG9ydGVkID0gKCB0ZHNbIDAgXS5vZmZzZXRIZWlnaHQgPT09IDAgKTtcblxuXHRcdHRkc1sgMCBdLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdHRkc1sgMSBdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXHRcdC8vIENoZWNrIGlmIGVtcHR5IHRhYmxlIGNlbGxzIHN0aWxsIGhhdmUgb2Zmc2V0V2lkdGgvSGVpZ2h0XG5cdFx0Ly8gKElFIDw9IDggZmFpbCB0aGlzIHRlc3QpXG5cdFx0c3VwcG9ydC5yZWxpYWJsZUhpZGRlbk9mZnNldHMgPSBpc1N1cHBvcnRlZCAmJiAoIHRkc1sgMCBdLm9mZnNldEhlaWdodCA9PT0gMCApO1xuXG5cdFx0Ly8gQ2hlY2sgYm94LXNpemluZyBhbmQgbWFyZ2luIGJlaGF2aW9yXG5cdFx0ZGl2LmlubmVySFRNTCA9IFwiXCI7XG5cdFx0ZGl2LnN0eWxlLmNzc1RleHQgPSBcImJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDstd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDtwYWRkaW5nOjFweDtib3JkZXI6MXB4O2Rpc3BsYXk6YmxvY2s7d2lkdGg6NHB4O21hcmdpbi10b3A6MSU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjElO1wiO1xuXHRcdHN1cHBvcnQuYm94U2l6aW5nID0gKCBkaXYub2Zmc2V0V2lkdGggPT09IDQgKTtcblx0XHRzdXBwb3J0LmRvZXNOb3RJbmNsdWRlTWFyZ2luSW5Cb2R5T2Zmc2V0ID0gKCBib2R5Lm9mZnNldFRvcCAhPT0gMSApO1xuXG5cdFx0Ly8gTk9URTogVG8gYW55IGZ1dHVyZSBtYWludGFpbmVyLCB3ZSd2ZSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZVxuXHRcdC8vIGJlY2F1c2UganNkb20gb24gbm9kZS5qcyB3aWxsIGJyZWFrIHdpdGhvdXQgaXQuXG5cdFx0aWYgKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSApIHtcblx0XHRcdHN1cHBvcnQucGl4ZWxQb3NpdGlvbiA9ICggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGRpdiwgbnVsbCApIHx8IHt9ICkudG9wICE9PSBcIjElXCI7XG5cdFx0XHRzdXBwb3J0LmJveFNpemluZ1JlbGlhYmxlID0gKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZGl2LCBudWxsICkgfHwgeyB3aWR0aDogXCI0cHhcIiB9ICkud2lkdGggPT09IFwiNHB4XCI7XG5cblx0XHRcdC8vIENoZWNrIGlmIGRpdiB3aXRoIGV4cGxpY2l0IHdpZHRoIGFuZCBubyBtYXJnaW4tcmlnaHQgaW5jb3JyZWN0bHlcblx0XHRcdC8vIGdldHMgY29tcHV0ZWQgbWFyZ2luLXJpZ2h0IGJhc2VkIG9uIHdpZHRoIG9mIGNvbnRhaW5lci4gRm9yIG1vcmVcblx0XHRcdC8vIGluZm8gc2VlIGJ1ZyAjMzMzM1xuXHRcdFx0Ly8gRmFpbHMgaW4gV2ViS2l0IGJlZm9yZSBGZWIgMjAxMSBuaWdodGxpZXNcblx0XHRcdC8vIFdlYktpdCBCdWcgMTMzNDMgLSBnZXRDb21wdXRlZFN0eWxlIHJldHVybnMgd3JvbmcgdmFsdWUgZm9yIG1hcmdpbi1yaWdodFxuXHRcdFx0bWFyZ2luRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdG1hcmdpbkRpdi5zdHlsZS5jc3NUZXh0ID0gZGl2LnN0eWxlLmNzc1RleHQgPSBkaXZSZXNldDtcblx0XHRcdG1hcmdpbkRpdi5zdHlsZS5tYXJnaW5SaWdodCA9IG1hcmdpbkRpdi5zdHlsZS53aWR0aCA9IFwiMFwiO1xuXHRcdFx0ZGl2LnN0eWxlLndpZHRoID0gXCIxcHhcIjtcblx0XHRcdGRpdi5hcHBlbmRDaGlsZCggbWFyZ2luRGl2ICk7XG5cdFx0XHRzdXBwb3J0LnJlbGlhYmxlTWFyZ2luUmlnaHQgPVxuXHRcdFx0XHQhcGFyc2VGbG9hdCggKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggbWFyZ2luRGl2LCBudWxsICkgfHwge30gKS5tYXJnaW5SaWdodCApO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIGRpdi5zdHlsZS56b29tICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgbmF0aXZlbHkgYmxvY2stbGV2ZWwgZWxlbWVudHMgYWN0IGxpa2UgaW5saW5lLWJsb2NrXG5cdFx0XHQvLyBlbGVtZW50cyB3aGVuIHNldHRpbmcgdGhlaXIgZGlzcGxheSB0byAnaW5saW5lJyBhbmQgZ2l2aW5nXG5cdFx0XHQvLyB0aGVtIGxheW91dFxuXHRcdFx0Ly8gKElFIDwgOCBkb2VzIHRoaXMpXG5cdFx0XHRkaXYuaW5uZXJIVE1MID0gXCJcIjtcblx0XHRcdGRpdi5zdHlsZS5jc3NUZXh0ID0gZGl2UmVzZXQgKyBcIndpZHRoOjFweDtwYWRkaW5nOjFweDtkaXNwbGF5OmlubGluZTt6b29tOjFcIjtcblx0XHRcdHN1cHBvcnQuaW5saW5lQmxvY2tOZWVkc0xheW91dCA9ICggZGl2Lm9mZnNldFdpZHRoID09PSAzICk7XG5cblx0XHRcdC8vIENoZWNrIGlmIGVsZW1lbnRzIHdpdGggbGF5b3V0IHNocmluay13cmFwIHRoZWlyIGNoaWxkcmVuXG5cdFx0XHQvLyAoSUUgNiBkb2VzIHRoaXMpXG5cdFx0XHRkaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRcdGRpdi5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuXHRcdFx0ZGl2LmlubmVySFRNTCA9IFwiPGRpdj48L2Rpdj5cIjtcblx0XHRcdGRpdi5maXJzdENoaWxkLnN0eWxlLndpZHRoID0gXCI1cHhcIjtcblx0XHRcdHN1cHBvcnQuc2hyaW5rV3JhcEJsb2NrcyA9ICggZGl2Lm9mZnNldFdpZHRoICE9PSAzICk7XG5cblx0XHRcdGNvbnRhaW5lci5zdHlsZS56b29tID0gMTtcblx0XHR9XG5cblx0XHQvLyBOdWxsIGVsZW1lbnRzIHRvIGF2b2lkIGxlYWtzIGluIElFXG5cdFx0Ym9keS5yZW1vdmVDaGlsZCggY29udGFpbmVyICk7XG5cdFx0Y29udGFpbmVyID0gZGl2ID0gdGRzID0gbWFyZ2luRGl2ID0gbnVsbDtcblx0fSk7XG5cblx0Ly8gTnVsbCBlbGVtZW50cyB0byBhdm9pZCBsZWFrcyBpbiBJRVxuXHRmcmFnbWVudC5yZW1vdmVDaGlsZCggZGl2ICk7XG5cdGFsbCA9IGEgPSBzZWxlY3QgPSBvcHQgPSBpbnB1dCA9IGZyYWdtZW50ID0gZGl2ID0gbnVsbDtcblxuXHRyZXR1cm4gc3VwcG9ydDtcbn0pKCk7XG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IHNldFRpbWVvdXQoZm4sIDApIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBnZXREb2N1bWVudDtcblxuLy8gZGVmaW5lZCBieSB3M2NcbnZhciBET0NVTUVOVF9OT0RFID0gOTtcblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiBgd2AgaXMgYSBEb2N1bWVudCBvYmplY3QsIG9yIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7P30gZCAtIERvY3VtZW50IG9iamVjdCwgbWF5YmVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzRG9jdW1lbnQgKGQpIHtcbiAgcmV0dXJuIGQgJiYgZC5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfTk9ERTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBgZG9jdW1lbnRgIG9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIGBub2RlYCwgd2hpY2ggbWF5IGJlXG4gKiBhIERPTSBlbGVtZW50LCB0aGUgV2luZG93IG9iamVjdCwgYSBTZWxlY3Rpb24sIGEgUmFuZ2UuIEJhc2ljYWxseSBhbnkgRE9NXG4gKiBvYmplY3QgdGhhdCByZWZlcmVuY2VzIHRoZSBEb2N1bWVudCBpbiBzb21lIHdheSwgdGhpcyBmdW5jdGlvbiB3aWxsIGZpbmQgaXQuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gbm9kZSAtIERPTSBub2RlLCBzZWxlY3Rpb24sIG9yIHJhbmdlIGluIHdoaWNoIHRvIGZpbmQgdGhlIGBkb2N1bWVudGAgb2JqZWN0XG4gKiBAcmV0dXJuIHtEb2N1bWVudH0gdGhlIGBkb2N1bWVudGAgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCBgbm9kZWBcbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBnZXREb2N1bWVudChub2RlKSB7XG4gIGlmIChpc0RvY3VtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgfSBlbHNlIGlmIChpc0RvY3VtZW50KG5vZGUub3duZXJEb2N1bWVudCkpIHtcbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50O1xuXG4gIH0gZWxzZSBpZiAoaXNEb2N1bWVudChub2RlLmRvY3VtZW50KSkge1xuICAgIHJldHVybiBub2RlLmRvY3VtZW50O1xuXG4gIH0gZWxzZSBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgcmV0dXJuIGdldERvY3VtZW50KG5vZGUucGFyZW50Tm9kZSk7XG5cbiAgLy8gUmFuZ2Ugc3VwcG9ydFxuICB9IGVsc2UgaWYgKG5vZGUuY29tbW9uQW5jZXN0b3JDb250YWluZXIpIHtcbiAgICByZXR1cm4gZ2V0RG9jdW1lbnQobm9kZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcik7XG5cbiAgfSBlbHNlIGlmIChub2RlLnN0YXJ0Q29udGFpbmVyKSB7XG4gICAgcmV0dXJuIGdldERvY3VtZW50KG5vZGUuc3RhcnRDb250YWluZXIpO1xuXG4gIC8vIFNlbGVjdGlvbiBzdXBwb3J0XG4gIH0gZWxzZSBpZiAobm9kZS5hbmNob3JOb2RlKSB7XG4gICAgcmV0dXJuIGdldERvY3VtZW50KG5vZGUuYW5jaG9yTm9kZSk7XG4gIH1cbn1cbiIsIi8qISBqcy1jb29raWUgdjMuMC4xIHwgTUlUICovXG47XG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IGdsb2JhbC5Db29raWVzO1xuICAgIHZhciBleHBvcnRzID0gZ2xvYmFsLkNvb2tpZXMgPSBmYWN0b3J5KCk7XG4gICAgZXhwb3J0cy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkgeyBnbG9iYWwuQ29va2llcyA9IGN1cnJlbnQ7IHJldHVybiBleHBvcnRzOyB9O1xuICB9KCkpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuICBmdW5jdGlvbiBhc3NpZ24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbiAgdmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gICAgcmVhZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICAgIGRlY29kZVVSSUNvbXBvbmVudFxuICAgICAgKVxuICAgIH1cbiAgfTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuICBmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIsIGRlZmF1bHRBdHRyaWJ1dGVzKSB7XG4gICAgZnVuY3Rpb24gc2V0IChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRyaWJ1dGVzLmV4cGlyZXMpIHtcbiAgICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgICAgdmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuICAgICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxuICAgICAgICAvLyAuLi5cbiAgICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgICAvLyAgICAgY2hhcmFjdGVyOlxuICAgICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoZG9jdW1lbnQuY29va2llID1cbiAgICAgICAga2V5ICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCAoa2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAha2V5KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgICAgLy8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXG4gICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuICAgICAgdmFyIGphciA9IHt9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGZvdW5kS2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKTtcbiAgICAgICAgICBqYXJbZm91bmRLZXldID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kS2V5KTtcblxuICAgICAgICAgIGlmIChrZXkgPT09IGZvdW5kS2V5KSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleSA/IGphcltrZXldIDogamFyXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICB7XG4gICAgICAgIHNldDogc2V0LFxuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgc2V0KFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgICAgZXhwaXJlczogLTFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2l0aEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgICAgfSxcbiAgICAgICAgd2l0aENvbnZlcnRlcjogZnVuY3Rpb24gKGNvbnZlcnRlcikge1xuICAgICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcbiAgICAgICAgY29udmVydGVyOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGNvbnZlcnRlcikgfVxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIHZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIHJldHVybiBhcGk7XG5cbn0pKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgdW5kZWY7XG5cbi8qKlxuICogRGVjb2RlIGEgVVJJIGVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgVVJJIGVuY29kZWQgc3RyaW5nLlxuICogQHJldHVybnMge1N0cmluZ3xOdWxsfSBUaGUgZGVjb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChpbnB1dC5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIGVuY29kZSBhIGdpdmVuIGlucHV0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgZW5jb2RlZC5cbiAqIEByZXR1cm5zIHtTdHJpbmd8TnVsbH0gVGhlIGVuY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuICB0cnkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaW5wdXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgcXVlcnkgc3RyaW5nIHBhcnNlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIHF1ZXJ5IHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIHBhcnNlZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeSkge1xuICB2YXIgcGFyc2VyID0gLyhbXj0/IyZdKyk9PyhbXiZdKikvZ1xuICAgICwgcmVzdWx0ID0ge31cbiAgICAsIHBhcnQ7XG5cbiAgd2hpbGUgKHBhcnQgPSBwYXJzZXIuZXhlYyhxdWVyeSkpIHtcbiAgICB2YXIga2V5ID0gZGVjb2RlKHBhcnRbMV0pXG4gICAgICAsIHZhbHVlID0gZGVjb2RlKHBhcnRbMl0pO1xuXG4gICAgLy9cbiAgICAvLyBQcmV2ZW50IG92ZXJyaWRpbmcgb2YgZXhpc3RpbmcgcHJvcGVydGllcy4gVGhpcyBlbnN1cmVzIHRoYXQgYnVpbGQtaW5cbiAgICAvLyBtZXRob2RzIGxpa2UgYHRvU3RyaW5nYCBvciBfX3Byb3RvX18gYXJlIG5vdCBvdmVycmlkZW4gYnkgbWFsaWNpb3VzXG4gICAgLy8gcXVlcnlzdHJpbmdzLlxuICAgIC8vXG4gICAgLy8gSW4gdGhlIGNhc2UgaWYgZmFpbGVkIGRlY29kaW5nLCB3ZSB3YW50IHRvIG9taXQgdGhlIGtleS92YWx1ZSBwYWlyc1xuICAgIC8vIGZyb20gdGhlIHJlc3VsdC5cbiAgICAvL1xuICAgIGlmIChrZXkgPT09IG51bGwgfHwgdmFsdWUgPT09IG51bGwgfHwga2V5IGluIHJlc3VsdCkgY29udGludWU7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGEgcXVlcnkgc3RyaW5nIHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIE9iamVjdCB0aGF0IHNob3VsZCBiZSB0cmFuc2Zvcm1lZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggT3B0aW9uYWwgcHJlZml4LlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5naWZ5KG9iaiwgcHJlZml4KSB7XG4gIHByZWZpeCA9IHByZWZpeCB8fCAnJztcblxuICB2YXIgcGFpcnMgPSBbXVxuICAgICwgdmFsdWVcbiAgICAsIGtleTtcblxuICAvL1xuICAvLyBPcHRpb25hbGx5IHByZWZpeCB3aXRoIGEgJz8nIGlmIG5lZWRlZFxuICAvL1xuICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBwcmVmaXgpIHByZWZpeCA9ICc/JztcblxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgICAvL1xuICAgICAgLy8gRWRnZSBjYXNlcyB3aGVyZSB3ZSBhY3R1YWxseSB3YW50IHRvIGVuY29kZSB0aGUgdmFsdWUgdG8gYW4gZW1wdHlcbiAgICAgIC8vIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBzdHJpbmdpZmllZCB2YWx1ZS5cbiAgICAgIC8vXG4gICAgICBpZiAoIXZhbHVlICYmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWYgfHwgaXNOYU4odmFsdWUpKSkge1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBlbmNvZGUoa2V5KTtcbiAgICAgIHZhbHVlID0gZW5jb2RlKHZhbHVlKTtcblxuICAgICAgLy9cbiAgICAgIC8vIElmIHdlIGZhaWxlZCB0byBlbmNvZGUgdGhlIHN0cmluZ3MsIHdlIHNob3VsZCBiYWlsIG91dCBhcyB3ZSBkb24ndFxuICAgICAgLy8gd2FudCB0byBhZGQgaW52YWxpZCBzdHJpbmdzIHRvIHRoZSBxdWVyeS5cbiAgICAgIC8vXG4gICAgICBpZiAoa2V5ID09PSBudWxsIHx8IHZhbHVlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIHBhaXJzLnB1c2goa2V5ICsnPScrIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFpcnMubGVuZ3RoID8gcHJlZml4ICsgcGFpcnMuam9pbignJicpIDogJyc7XG59XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5leHBvcnRzLnN0cmluZ2lmeSA9IHF1ZXJ5c3RyaW5naWZ5O1xuZXhwb3J0cy5wYXJzZSA9IHF1ZXJ5c3RyaW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENoZWNrIGlmIHdlJ3JlIHJlcXVpcmVkIHRvIGFkZCBhIHBvcnQgbnVtYmVyLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly91cmwuc3BlYy53aGF0d2cub3JnLyNkZWZhdWx0LXBvcnRcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gcG9ydCBQb3J0IG51bWJlciB3ZSBuZWVkIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgd2UgbmVlZCB0byBjaGVjayBhZ2FpbnN0LlxuICogQHJldHVybnMge0Jvb2xlYW59IElzIGl0IGEgZGVmYXVsdCBwb3J0IGZvciB0aGUgZ2l2ZW4gcHJvdG9jb2xcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcXVpcmVkKHBvcnQsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wuc3BsaXQoJzonKVswXTtcbiAgcG9ydCA9ICtwb3J0O1xuXG4gIGlmICghcG9ydCkgcmV0dXJuIGZhbHNlO1xuXG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwJzpcbiAgICBjYXNlICd3cyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDgwO1xuXG4gICAgY2FzZSAnaHR0cHMnOlxuICAgIGNhc2UgJ3dzcyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDQ0MztcblxuICAgIGNhc2UgJ2Z0cCc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDIxO1xuXG4gICAgY2FzZSAnZ29waGVyJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNzA7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcG9ydCAhPT0gMDtcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciByZXF1aXJlZCA9IHJlcXVpcmUoJ3JlcXVpcmVzLXBvcnQnKVxuICAsIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmdpZnknKVxuICAsIGNvbnRyb2xPcldoaXRlc3BhY2UgPSAvXltcXHgwMC1cXHgyMFxcdTAwYTBcXHUxNjgwXFx1MjAwMC1cXHUyMDBhXFx1MjAyOFxcdTIwMjlcXHUyMDJmXFx1MjA1ZlxcdTMwMDBcXHVmZWZmXSsvXG4gICwgQ1JIVExGID0gL1tcXG5cXHJcXHRdL2dcbiAgLCBzbGFzaGVzID0gL15bQS1aYS16XVtBLVphLXowLTkrLS5dKjpcXC9cXC8vXG4gICwgcG9ydCA9IC86XFxkKyQvXG4gICwgcHJvdG9jb2xyZSA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFxcL1xcLyk/KFtcXFxcL10rKT8oW1xcU1xcc10qKS9pXG4gICwgd2luZG93c0RyaXZlTGV0dGVyID0gL15bYS16QS1aXTovO1xuXG4vKipcbiAqIFJlbW92ZSBjb250cm9sIGNoYXJhY3RlcnMgYW5kIHdoaXRlc3BhY2UgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gc3RyIFN0cmluZyB0byB0cmltLlxuICogQHJldHVybnMge1N0cmluZ30gQSBuZXcgc3RyaW5nIHJlcHJlc2VudGluZyBgc3RyYCBzdHJpcHBlZCBvZiBjb250cm9sXG4gKiAgICAgY2hhcmFjdGVycyBhbmQgd2hpdGVzcGFjZSBmcm9tIGl0cyBiZWdpbm5pbmcuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRyaW1MZWZ0KHN0cikge1xuICByZXR1cm4gKHN0ciA/IHN0ciA6ICcnKS50b1N0cmluZygpLnJlcGxhY2UoY29udHJvbE9yV2hpdGVzcGFjZSwgJycpO1xufVxuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgcGFyc2UgcnVsZXMgZm9yIHRoZSBVUkwgcGFyc2VyLCBpdCBpbmZvcm1zIHRoZSBwYXJzZXJcbiAqIGFib3V0OlxuICpcbiAqIDAuIFRoZSBjaGFyIGl0IE5lZWRzIHRvIHBhcnNlLCBpZiBpdCdzIGEgc3RyaW5nIGl0IHNob3VsZCBiZSBkb25lIHVzaW5nXG4gKiAgICBpbmRleE9mLCBSZWdFeHAgdXNpbmcgZXhlYyBhbmQgTmFOIG1lYW5zIHNldCBhcyBjdXJyZW50IHZhbHVlLlxuICogMS4gVGhlIHByb3BlcnR5IHdlIHNob3VsZCBzZXQgd2hlbiBwYXJzaW5nIHRoaXMgdmFsdWUuXG4gKiAyLiBJbmRpY2F0aW9uIGlmIGl0J3MgYmFja3dhcmRzIG9yIGZvcndhcmQgcGFyc2luZywgd2hlbiBzZXQgYXMgbnVtYmVyIGl0J3NcbiAqICAgIHRoZSB2YWx1ZSBvZiBleHRyYSBjaGFycyB0aGF0IHNob3VsZCBiZSBzcGxpdCBvZmYuXG4gKiAzLiBJbmhlcml0IGZyb20gbG9jYXRpb24gaWYgbm9uIGV4aXN0aW5nIGluIHRoZSBwYXJzZXIuXG4gKiA0LiBgdG9Mb3dlckNhc2VgIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gKi9cbnZhciBydWxlcyA9IFtcbiAgWycjJywgJ2hhc2gnXSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIFsnPycsICdxdWVyeSddLCAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBmdW5jdGlvbiBzYW5pdGl6ZShhZGRyZXNzLCB1cmwpIHsgICAgIC8vIFNhbml0aXplIHdoYXQgaXMgbGVmdCBvZiB0aGUgYWRkcmVzc1xuICAgIHJldHVybiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSA/IGFkZHJlc3MucmVwbGFjZSgvXFxcXC9nLCAnLycpIDogYWRkcmVzcztcbiAgfSxcbiAgWycvJywgJ3BhdGhuYW1lJ10sICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIFsnQCcsICdhdXRoJywgMV0sICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBmcm9udC5cbiAgW05hTiwgJ2hvc3QnLCB1bmRlZmluZWQsIDEsIDFdLCAgICAgICAvLyBTZXQgbGVmdCBvdmVyIHZhbHVlLlxuICBbLzooXFxkKikkLywgJ3BvcnQnLCB1bmRlZmluZWQsIDFdLCAgICAvLyBSZWdFeHAgdGhlIGJhY2suXG4gIFtOYU4sICdob3N0bmFtZScsIHVuZGVmaW5lZCwgMSwgMV0gICAgLy8gU2V0IGxlZnQgb3Zlci5cbl07XG5cbi8qKlxuICogVGhlc2UgcHJvcGVydGllcyBzaG91bGQgbm90IGJlIGNvcGllZCBvciBpbmhlcml0ZWQgZnJvbS4gVGhpcyBpcyBvbmx5IG5lZWRlZFxuICogZm9yIGFsbCBub24gYmxvYiBVUkwncyBhcyBhIGJsb2IgVVJMIGRvZXMgbm90IGluY2x1ZGUgYSBoYXNoLCBvbmx5IHRoZVxuICogb3JpZ2luLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgaWdub3JlID0geyBoYXNoOiAxLCBxdWVyeTogMSB9O1xuXG4vKipcbiAqIFRoZSBsb2NhdGlvbiBvYmplY3QgZGlmZmVycyB3aGVuIHlvdXIgY29kZSBpcyBsb2FkZWQgdGhyb3VnaCBhIG5vcm1hbCBwYWdlLFxuICogV29ya2VyIG9yIHRocm91Z2ggYSB3b3JrZXIgdXNpbmcgYSBibG9iLiBBbmQgd2l0aCB0aGUgYmxvYmJsZSBiZWdpbnMgdGhlXG4gKiB0cm91YmxlIGFzIHRoZSBsb2NhdGlvbiBvYmplY3Qgd2lsbCBjb250YWluIHRoZSBVUkwgb2YgdGhlIGJsb2IsIG5vdCB0aGVcbiAqIGxvY2F0aW9uIG9mIHRoZSBwYWdlIHdoZXJlIG91ciBjb2RlIGlzIGxvYWRlZCBpbi4gVGhlIGFjdHVhbCBvcmlnaW4gaXNcbiAqIGVuY29kZWQgaW4gdGhlIGBwYXRobmFtZWAgc28gd2UgY2FuIHRoYW5rZnVsbHkgZ2VuZXJhdGUgYSBnb29kIFwiZGVmYXVsdFwiXG4gKiBsb2NhdGlvbiBmcm9tIGl0IHNvIHdlIGNhbiBnZW5lcmF0ZSBwcm9wZXIgcmVsYXRpdmUgVVJMJ3MgYWdhaW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBsb2MgT3B0aW9uYWwgZGVmYXVsdCBsb2NhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBsb2xjYXRpb24gb2JqZWN0LlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBsb2xjYXRpb24obG9jKSB7XG4gIHZhciBnbG9iYWxWYXI7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSBnbG9iYWxWYXIgPSB3aW5kb3c7XG4gIGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSBnbG9iYWxWYXIgPSBnbG9iYWw7XG4gIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gc2VsZjtcbiAgZWxzZSBnbG9iYWxWYXIgPSB7fTtcblxuICB2YXIgbG9jYXRpb24gPSBnbG9iYWxWYXIubG9jYXRpb24gfHwge307XG4gIGxvYyA9IGxvYyB8fCBsb2NhdGlvbjtcblxuICB2YXIgZmluYWxkZXN0aW5hdGlvbiA9IHt9XG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY1xuICAgICwga2V5O1xuXG4gIGlmICgnYmxvYjonID09PSBsb2MucHJvdG9jb2wpIHtcbiAgICBmaW5hbGRlc3RpbmF0aW9uID0gbmV3IFVybCh1bmVzY2FwZShsb2MucGF0aG5hbWUpLCB7fSk7XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGUpIHtcbiAgICBmaW5hbGRlc3RpbmF0aW9uID0gbmV3IFVybChsb2MsIHt9KTtcbiAgICBmb3IgKGtleSBpbiBpZ25vcmUpIGRlbGV0ZSBmaW5hbGRlc3RpbmF0aW9uW2tleV07XG4gIH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGUpIHtcbiAgICBmb3IgKGtleSBpbiBsb2MpIHtcbiAgICAgIGlmIChrZXkgaW4gaWdub3JlKSBjb250aW51ZTtcbiAgICAgIGZpbmFsZGVzdGluYXRpb25ba2V5XSA9IGxvY1trZXldO1xuICAgIH1cblxuICAgIGlmIChmaW5hbGRlc3RpbmF0aW9uLnNsYXNoZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID0gc2xhc2hlcy50ZXN0KGxvYy5ocmVmKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmluYWxkZXN0aW5hdGlvbjtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGEgcHJvdG9jb2wgc2NoZW1lIGlzIHNwZWNpYWwuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFRoZSBwcm90b2NvbCBzY2hlbWUgb2YgdGhlIFVSTFxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBwcm90b2NvbCBzY2hlbWUgaXMgc3BlY2lhbCwgZWxzZSBgZmFsc2VgXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc1NwZWNpYWwoc2NoZW1lKSB7XG4gIHJldHVybiAoXG4gICAgc2NoZW1lID09PSAnZmlsZTonIHx8XG4gICAgc2NoZW1lID09PSAnZnRwOicgfHxcbiAgICBzY2hlbWUgPT09ICdodHRwOicgfHxcbiAgICBzY2hlbWUgPT09ICdodHRwczonIHx8XG4gICAgc2NoZW1lID09PSAnd3M6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ3dzczonXG4gICk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgUHJvdG9jb2xFeHRyYWN0XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCBtYXRjaGVkIGluIHRoZSBVUkwsIGluIGxvd2VyY2FzZS5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2xhc2hlcyBgdHJ1ZWAgaWYgcHJvdG9jb2wgaXMgZm9sbG93ZWQgYnkgXCIvL1wiLCBlbHNlIGBmYWxzZWAuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcmVzdCBSZXN0IG9mIHRoZSBVUkwgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgcHJvdG9jb2wuXG4gKi9cblxuLyoqXG4gKiBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGZyb20gYSBVUkwgd2l0aC93aXRob3V0IGRvdWJsZSBzbGFzaCAoXCIvL1wiKS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBleHRyYWN0IGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gbG9jYXRpb25cbiAqIEByZXR1cm4ge1Byb3RvY29sRXh0cmFjdH0gRXh0cmFjdGVkIGluZm9ybWF0aW9uLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFByb3RvY29sKGFkZHJlc3MsIGxvY2F0aW9uKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcbiAgYWRkcmVzcyA9IGFkZHJlc3MucmVwbGFjZShDUkhUTEYsICcnKTtcbiAgbG9jYXRpb24gPSBsb2NhdGlvbiB8fCB7fTtcblxuICB2YXIgbWF0Y2ggPSBwcm90b2NvbHJlLmV4ZWMoYWRkcmVzcyk7XG4gIHZhciBwcm90b2NvbCA9IG1hdGNoWzFdID8gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSA6ICcnO1xuICB2YXIgZm9yd2FyZFNsYXNoZXMgPSAhIW1hdGNoWzJdO1xuICB2YXIgb3RoZXJTbGFzaGVzID0gISFtYXRjaFszXTtcbiAgdmFyIHNsYXNoZXNDb3VudCA9IDA7XG4gIHZhciByZXN0O1xuXG4gIGlmIChmb3J3YXJkU2xhc2hlcykge1xuICAgIGlmIChvdGhlclNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSBtYXRjaFsyXSArIG1hdGNoWzNdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFsyXS5sZW5ndGggKyBtYXRjaFszXS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3QgPSBtYXRjaFsyXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbMl0ubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAob3RoZXJTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gbWF0Y2hbM10gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzNdLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdCA9IG1hdGNoWzRdXG4gICAgfVxuICB9XG5cbiAgaWYgKHByb3RvY29sID09PSAnZmlsZTonKSB7XG4gICAgaWYgKHNsYXNoZXNDb3VudCA+PSAyKSB7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZSgyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNTcGVjaWFsKHByb3RvY29sKSkge1xuICAgIHJlc3QgPSBtYXRjaFs0XTtcbiAgfSBlbHNlIGlmIChwcm90b2NvbCkge1xuICAgIGlmIChmb3J3YXJkU2xhc2hlcykge1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoMik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHNsYXNoZXNDb3VudCA+PSAyICYmIGlzU3BlY2lhbChsb2NhdGlvbi5wcm90b2NvbCkpIHtcbiAgICByZXN0ID0gbWF0Y2hbNF07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBzbGFzaGVzOiBmb3J3YXJkU2xhc2hlcyB8fCBpc1NwZWNpYWwocHJvdG9jb2wpLFxuICAgIHNsYXNoZXNDb3VudDogc2xhc2hlc0NvdW50LFxuICAgIHJlc3Q6IHJlc3RcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgcmVsYXRpdmUgVVJMIHBhdGhuYW1lIGFnYWluc3QgYSBiYXNlIFVSTCBwYXRobmFtZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpdmUgUGF0aG5hbWUgb2YgdGhlIHJlbGF0aXZlIFVSTC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlIFBhdGhuYW1lIG9mIHRoZSBiYXNlIFVSTC5cbiAqIEByZXR1cm4ge1N0cmluZ30gUmVzb2x2ZWQgcGF0aG5hbWUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZXNvbHZlKHJlbGF0aXZlLCBiYXNlKSB7XG4gIGlmIChyZWxhdGl2ZSA9PT0gJycpIHJldHVybiBiYXNlO1xuXG4gIHZhciBwYXRoID0gKGJhc2UgfHwgJy8nKS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5jb25jYXQocmVsYXRpdmUuc3BsaXQoJy8nKSlcbiAgICAsIGkgPSBwYXRoLmxlbmd0aFxuICAgICwgbGFzdCA9IHBhdGhbaSAtIDFdXG4gICAgLCB1bnNoaWZ0ID0gZmFsc2VcbiAgICAsIHVwID0gMDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHBhdGhbaV0gPT09ICcuJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXRoW2ldID09PSAnLi4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgaWYgKGkgPT09IDApIHVuc2hpZnQgPSB0cnVlO1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bnNoaWZ0KSBwYXRoLnVuc2hpZnQoJycpO1xuICBpZiAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHBhdGgucHVzaCgnJyk7XG5cbiAgcmV0dXJuIHBhdGguam9pbignLycpO1xufVxuXG4vKipcbiAqIFRoZSBhY3R1YWwgVVJMIGluc3RhbmNlLiBJbnN0ZWFkIG9mIHJldHVybmluZyBhbiBvYmplY3Qgd2UndmUgb3B0ZWQtaW4gdG9cbiAqIGNyZWF0ZSBhbiBhY3R1YWwgY29uc3RydWN0b3IgYXMgaXQncyBtdWNoIG1vcmUgbWVtb3J5IGVmZmljaWVudCBhbmRcbiAqIGZhc3RlciBhbmQgaXQgcGxlYXNlcyBteSBPQ0QuXG4gKlxuICogSXQgaXMgd29ydGggbm90aW5nIHRoYXQgd2Ugc2hvdWxkIG5vdCB1c2UgYFVSTGAgYXMgY2xhc3MgbmFtZSB0byBwcmV2ZW50XG4gKiBjbGFzaGVzIHdpdGggdGhlIGdsb2JhbCBVUkwgaW5zdGFuY2UgdGhhdCBnb3QgaW50cm9kdWNlZCBpbiBicm93c2Vycy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIFVSTCB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBbbG9jYXRpb25dIExvY2F0aW9uIGRlZmF1bHRzIGZvciByZWxhdGl2ZSBwYXRocy5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gW3BhcnNlcl0gUGFyc2VyIGZvciB0aGUgcXVlcnkgc3RyaW5nLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpIHtcbiAgYWRkcmVzcyA9IHRyaW1MZWZ0KGFkZHJlc3MpO1xuICBhZGRyZXNzID0gYWRkcmVzcy5yZXBsYWNlKENSSFRMRiwgJycpO1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVcmwpKSB7XG4gICAgcmV0dXJuIG5ldyBVcmwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcik7XG4gIH1cblxuICB2YXIgcmVsYXRpdmUsIGV4dHJhY3RlZCwgcGFyc2UsIGluc3RydWN0aW9uLCBpbmRleCwga2V5XG4gICAgLCBpbnN0cnVjdGlvbnMgPSBydWxlcy5zbGljZSgpXG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY2F0aW9uXG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBpID0gMDtcblxuICAvL1xuICAvLyBUaGUgZm9sbG93aW5nIGlmIHN0YXRlbWVudHMgYWxsb3dzIHRoaXMgbW9kdWxlIHR3byBoYXZlIGNvbXBhdGliaWxpdHkgd2l0aFxuICAvLyAyIGRpZmZlcmVudCBBUEk6XG4gIC8vXG4gIC8vIDEuIE5vZGUuanMncyBgdXJsLnBhcnNlYCBhcGkgd2hpY2ggYWNjZXB0cyBhIFVSTCwgYm9vbGVhbiBhcyBhcmd1bWVudHNcbiAgLy8gICAgd2hlcmUgdGhlIGJvb2xlYW4gaW5kaWNhdGVzIHRoYXQgdGhlIHF1ZXJ5IHN0cmluZyBzaG91bGQgYWxzbyBiZSBwYXJzZWQuXG4gIC8vXG4gIC8vIDIuIFRoZSBgVVJMYCBpbnRlcmZhY2Ugb2YgdGhlIGJyb3dzZXIgd2hpY2ggYWNjZXB0cyBhIFVSTCwgb2JqZWN0IGFzXG4gIC8vICAgIGFyZ3VtZW50cy4gVGhlIHN1cHBsaWVkIG9iamVjdCB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdCB2YWx1ZXMgLyBmYWxsLWJhY2tcbiAgLy8gICAgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICAvL1xuICBpZiAoJ29iamVjdCcgIT09IHR5cGUgJiYgJ3N0cmluZycgIT09IHR5cGUpIHtcbiAgICBwYXJzZXIgPSBsb2NhdGlvbjtcbiAgICBsb2NhdGlvbiA9IG51bGw7XG4gIH1cblxuICBpZiAocGFyc2VyICYmICdmdW5jdGlvbicgIT09IHR5cGVvZiBwYXJzZXIpIHBhcnNlciA9IHFzLnBhcnNlO1xuXG4gIGxvY2F0aW9uID0gbG9sY2F0aW9uKGxvY2F0aW9uKTtcblxuICAvL1xuICAvLyBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGJlZm9yZSBydW5uaW5nIHRoZSBpbnN0cnVjdGlvbnMuXG4gIC8vXG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RQcm90b2NvbChhZGRyZXNzIHx8ICcnLCBsb2NhdGlvbik7XG4gIHJlbGF0aXZlID0gIWV4dHJhY3RlZC5wcm90b2NvbCAmJiAhZXh0cmFjdGVkLnNsYXNoZXM7XG4gIHVybC5zbGFzaGVzID0gZXh0cmFjdGVkLnNsYXNoZXMgfHwgcmVsYXRpdmUgJiYgbG9jYXRpb24uc2xhc2hlcztcbiAgdXJsLnByb3RvY29sID0gZXh0cmFjdGVkLnByb3RvY29sIHx8IGxvY2F0aW9uLnByb3RvY29sIHx8ICcnO1xuICBhZGRyZXNzID0gZXh0cmFjdGVkLnJlc3Q7XG5cbiAgLy9cbiAgLy8gV2hlbiB0aGUgYXV0aG9yaXR5IGNvbXBvbmVudCBpcyBhYnNlbnQgdGhlIFVSTCBzdGFydHMgd2l0aCBhIHBhdGhcbiAgLy8gY29tcG9uZW50LlxuICAvL1xuICBpZiAoXG4gICAgZXh0cmFjdGVkLnByb3RvY29sID09PSAnZmlsZTonICYmIChcbiAgICAgIGV4dHJhY3RlZC5zbGFzaGVzQ291bnQgIT09IDIgfHwgd2luZG93c0RyaXZlTGV0dGVyLnRlc3QoYWRkcmVzcykpIHx8XG4gICAgKCFleHRyYWN0ZWQuc2xhc2hlcyAmJlxuICAgICAgKGV4dHJhY3RlZC5wcm90b2NvbCB8fFxuICAgICAgICBleHRyYWN0ZWQuc2xhc2hlc0NvdW50IDwgMiB8fFxuICAgICAgICAhaXNTcGVjaWFsKHVybC5wcm90b2NvbCkpKVxuICApIHtcbiAgICBpbnN0cnVjdGlvbnNbM10gPSBbLyguKikvLCAncGF0aG5hbWUnXTtcbiAgfVxuXG4gIGZvciAoOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSBpbnN0cnVjdGlvbnNbaV07XG5cbiAgICBpZiAodHlwZW9mIGluc3RydWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhZGRyZXNzID0gaW5zdHJ1Y3Rpb24oYWRkcmVzcywgdXJsKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBhcnNlID0gaW5zdHJ1Y3Rpb25bMF07XG4gICAga2V5ID0gaW5zdHJ1Y3Rpb25bMV07XG5cbiAgICBpZiAocGFyc2UgIT09IHBhcnNlKSB7XG4gICAgICB1cmxba2V5XSA9IGFkZHJlc3M7XG4gICAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHBhcnNlKSB7XG4gICAgICBpbmRleCA9IHBhcnNlID09PSAnQCdcbiAgICAgICAgPyBhZGRyZXNzLmxhc3RJbmRleE9mKHBhcnNlKVxuICAgICAgICA6IGFkZHJlc3MuaW5kZXhPZihwYXJzZSk7XG5cbiAgICAgIGlmICh+aW5kZXgpIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgaW5zdHJ1Y3Rpb25bMl0pIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKGluZGV4ICsgaW5zdHJ1Y3Rpb25bMl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZShpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgoaW5kZXggPSBwYXJzZS5leGVjKGFkZHJlc3MpKSkge1xuICAgICAgdXJsW2tleV0gPSBpbmRleFsxXTtcbiAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4LmluZGV4KTtcbiAgICB9XG5cbiAgICB1cmxba2V5XSA9IHVybFtrZXldIHx8IChcbiAgICAgIHJlbGF0aXZlICYmIGluc3RydWN0aW9uWzNdID8gbG9jYXRpb25ba2V5XSB8fCAnJyA6ICcnXG4gICAgKTtcblxuICAgIC8vXG4gICAgLy8gSG9zdG5hbWUsIGhvc3QgYW5kIHByb3RvY29sIHNob3VsZCBiZSBsb3dlcmNhc2VkIHNvIHRoZXkgY2FuIGJlIHVzZWQgdG9cbiAgICAvLyBjcmVhdGUgYSBwcm9wZXIgYG9yaWdpbmAuXG4gICAgLy9cbiAgICBpZiAoaW5zdHJ1Y3Rpb25bNF0pIHVybFtrZXldID0gdXJsW2tleV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEFsc28gcGFyc2UgdGhlIHN1cHBsaWVkIHF1ZXJ5IHN0cmluZyBpbiB0byBhbiBvYmplY3QuIElmIHdlJ3JlIHN1cHBsaWVkXG4gIC8vIHdpdGggYSBjdXN0b20gcGFyc2VyIGFzIGZ1bmN0aW9uIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgYnVpbGQtaW5cbiAgLy8gcGFyc2VyLlxuICAvL1xuICBpZiAocGFyc2VyKSB1cmwucXVlcnkgPSBwYXJzZXIodXJsLnF1ZXJ5KTtcblxuICAvL1xuICAvLyBJZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCByZXNvbHZlIHRoZSBwYXRobmFtZSBhZ2FpbnN0IHRoZSBiYXNlIFVSTC5cbiAgLy9cbiAgaWYgKFxuICAgICAgcmVsYXRpdmVcbiAgICAmJiBsb2NhdGlvbi5zbGFzaGVzXG4gICAgJiYgdXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nXG4gICAgJiYgKHVybC5wYXRobmFtZSAhPT0gJycgfHwgbG9jYXRpb24ucGF0aG5hbWUgIT09ICcnKVxuICApIHtcbiAgICB1cmwucGF0aG5hbWUgPSByZXNvbHZlKHVybC5wYXRobmFtZSwgbG9jYXRpb24ucGF0aG5hbWUpO1xuICB9XG5cbiAgLy9cbiAgLy8gRGVmYXVsdCB0byBhIC8gZm9yIHBhdGhuYW1lIGlmIG5vbmUgZXhpc3RzLiBUaGlzIG5vcm1hbGl6ZXMgdGhlIFVSTFxuICAvLyB0byBhbHdheXMgaGF2ZSBhIC9cbiAgLy9cbiAgaWYgKHVybC5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJyAmJiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSkge1xuICAgIHVybC5wYXRobmFtZSA9ICcvJyArIHVybC5wYXRobmFtZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIHNob3VsZCBub3QgYWRkIHBvcnQgbnVtYmVycyBpZiB0aGV5IGFyZSBhbHJlYWR5IHRoZSBkZWZhdWx0IHBvcnQgbnVtYmVyXG4gIC8vIGZvciBhIGdpdmVuIHByb3RvY29sLiBBcyB0aGUgaG9zdCBhbHNvIGNvbnRhaW5zIHRoZSBwb3J0IG51bWJlciB3ZSdyZSBnb2luZ1xuICAvLyBvdmVycmlkZSBpdCB3aXRoIHRoZSBob3N0bmFtZSB3aGljaCBjb250YWlucyBubyBwb3J0IG51bWJlci5cbiAgLy9cbiAgaWYgKCFyZXF1aXJlZCh1cmwucG9ydCwgdXJsLnByb3RvY29sKSkge1xuICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgIHVybC5wb3J0ID0gJyc7XG4gIH1cblxuICAvL1xuICAvLyBQYXJzZSBkb3duIHRoZSBgYXV0aGAgZm9yIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQuXG4gIC8vXG4gIHVybC51c2VybmFtZSA9IHVybC5wYXNzd29yZCA9ICcnO1xuXG4gIGlmICh1cmwuYXV0aCkge1xuICAgIGluZGV4ID0gdXJsLmF1dGguaW5kZXhPZignOicpO1xuXG4gICAgaWYgKH5pbmRleCkge1xuICAgICAgdXJsLnVzZXJuYW1lID0gdXJsLmF1dGguc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgdXJsLnVzZXJuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudCh1cmwudXNlcm5hbWUpKTtcblxuICAgICAgdXJsLnBhc3N3b3JkID0gdXJsLmF1dGguc2xpY2UoaW5kZXggKyAxKTtcbiAgICAgIHVybC5wYXNzd29yZCA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLnBhc3N3b3JkKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsLnVzZXJuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudCh1cmwuYXV0aCkpO1xuICAgIH1cblxuICAgIHVybC5hdXRoID0gdXJsLnBhc3N3b3JkID8gdXJsLnVzZXJuYW1lICsnOicrIHVybC5wYXNzd29yZCA6IHVybC51c2VybmFtZTtcbiAgfVxuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgIT09ICdmaWxlOicgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiYgdXJsLmhvc3RcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICAvL1xuICAvLyBUaGUgaHJlZiBpcyBqdXN0IHRoZSBjb21waWxlZCByZXN1bHQuXG4gIC8vXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogVGhpcyBpcyBjb252ZW5pZW5jZSBtZXRob2QgZm9yIGNoYW5naW5nIHByb3BlcnRpZXMgaW4gdGhlIFVSTCBpbnN0YW5jZSB0b1xuICogaW5zdXJlIHRoYXQgdGhleSBhbGwgcHJvcGFnYXRlIGNvcnJlY3RseS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFydCAgICAgICAgICBQcm9wZXJ0eSB3ZSBuZWVkIHRvIGFkanVzdC5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlICAgICAgICAgIFRoZSBuZXdseSBhc3NpZ25lZCB2YWx1ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gZm4gIFdoZW4gc2V0dGluZyB0aGUgcXVlcnksIGl0IHdpbGwgYmUgdGhlIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkIHRvIHBhcnNlIHRoZSBxdWVyeS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdoZW4gc2V0dGluZyB0aGUgcHJvdG9jb2wsIGRvdWJsZSBzbGFzaCB3aWxsIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkIGZyb20gdGhlIGZpbmFsIHVybCBpZiBpdCBpcyB0cnVlLlxuICogQHJldHVybnMge1VSTH0gVVJMIGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gc2V0KHBhcnQsIHZhbHVlLCBmbikge1xuICB2YXIgdXJsID0gdGhpcztcblxuICBzd2l0Y2ggKHBhcnQpIHtcbiAgICBjYXNlICdxdWVyeSc6XG4gICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFsdWUgPSAoZm4gfHwgcXMucGFyc2UpKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BvcnQnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICghcmVxdWlyZWQodmFsdWUsIHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWU7XG4gICAgICAgIHVybFtwYXJ0XSA9ICcnO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZSArJzonKyB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdob3N0bmFtZSc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKHVybC5wb3J0KSB2YWx1ZSArPSAnOicrIHVybC5wb3J0O1xuICAgICAgdXJsLmhvc3QgPSB2YWx1ZTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdCc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKHBvcnQudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdCgnOicpO1xuICAgICAgICB1cmwucG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZS5qb2luKCc6Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZTtcbiAgICAgICAgdXJsLnBvcnQgPSAnJztcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwcm90b2NvbCc6XG4gICAgICB1cmwucHJvdG9jb2wgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdXJsLnNsYXNoZXMgPSAhZm47XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BhdGhuYW1lJzpcbiAgICBjYXNlICdoYXNoJzpcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB2YXIgY2hhciA9IHBhcnQgPT09ICdwYXRobmFtZScgPyAnLycgOiAnIyc7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlLmNoYXJBdCgwKSAhPT0gY2hhciA/IGNoYXIgKyB2YWx1ZSA6IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3VzZXJuYW1lJzpcbiAgICBjYXNlICdwYXNzd29yZCc6XG4gICAgICB1cmxbcGFydF0gPSBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhdXRoJzpcbiAgICAgIHZhciBpbmRleCA9IHZhbHVlLmluZGV4T2YoJzonKTtcblxuICAgICAgaWYgKH5pbmRleCkge1xuICAgICAgICB1cmwudXNlcm5hbWUgPSB2YWx1ZS5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIHVybC51c2VybmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLnVzZXJuYW1lKSk7XG5cbiAgICAgICAgdXJsLnBhc3N3b3JkID0gdmFsdWUuc2xpY2UoaW5kZXggKyAxKTtcbiAgICAgICAgdXJsLnBhc3N3b3JkID0gZW5jb2RlVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudCh1cmwucGFzc3dvcmQpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybC51c2VybmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW5zID0gcnVsZXNbaV07XG5cbiAgICBpZiAoaW5zWzRdKSB1cmxbaW5zWzFdXSA9IHVybFtpbnNbMV1dLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB1cmwuYXV0aCA9IHVybC5wYXNzd29yZCA/IHVybC51c2VybmFtZSArJzonKyB1cmwucGFzc3dvcmQgOiB1cmwudXNlcm5hbWU7XG5cbiAgdXJsLm9yaWdpbiA9IHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6JyAmJiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSAmJiB1cmwuaG9zdFxuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIHByb3BlcnRpZXMgYmFjayBpbiB0byBhIHZhbGlkIGFuZCBmdWxsIFVSTCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5naWZ5IE9wdGlvbmFsIHF1ZXJ5IHN0cmluZ2lmeSBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IENvbXBpbGVkIHZlcnNpb24gb2YgdGhlIFVSTC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcoc3RyaW5naWZ5KSB7XG4gIGlmICghc3RyaW5naWZ5IHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdHJpbmdpZnkpIHN0cmluZ2lmeSA9IHFzLnN0cmluZ2lmeTtcblxuICB2YXIgcXVlcnlcbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIGhvc3QgPSB1cmwuaG9zdFxuICAgICwgcHJvdG9jb2wgPSB1cmwucHJvdG9jb2w7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLmNoYXJBdChwcm90b2NvbC5sZW5ndGggLSAxKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgdmFyIHJlc3VsdCA9XG4gICAgcHJvdG9jb2wgK1xuICAgICgodXJsLnByb3RvY29sICYmIHVybC5zbGFzaGVzKSB8fCBpc1NwZWNpYWwodXJsLnByb3RvY29sKSA/ICcvLycgOiAnJyk7XG5cbiAgaWYgKHVybC51c2VybmFtZSkge1xuICAgIHJlc3VsdCArPSB1cmwudXNlcm5hbWU7XG4gICAgaWYgKHVybC5wYXNzd29yZCkgcmVzdWx0ICs9ICc6JysgdXJsLnBhc3N3b3JkO1xuICAgIHJlc3VsdCArPSAnQCc7XG4gIH0gZWxzZSBpZiAodXJsLnBhc3N3b3JkKSB7XG4gICAgcmVzdWx0ICs9ICc6JysgdXJsLnBhc3N3b3JkO1xuICAgIHJlc3VsdCArPSAnQCc7XG4gIH0gZWxzZSBpZiAoXG4gICAgdXJsLnByb3RvY29sICE9PSAnZmlsZTonICYmXG4gICAgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiZcbiAgICAhaG9zdCAmJlxuICAgIHVybC5wYXRobmFtZSAhPT0gJy8nXG4gICkge1xuICAgIC8vXG4gICAgLy8gQWRkIGJhY2sgdGhlIGVtcHR5IHVzZXJpbmZvLCBvdGhlcndpc2UgdGhlIG9yaWdpbmFsIGludmFsaWQgVVJMXG4gICAgLy8gbWlnaHQgYmUgdHJhbnNmb3JtZWQgaW50byBhIHZhbGlkIG9uZSB3aXRoIGB1cmwucGF0aG5hbWVgIGFzIGhvc3QuXG4gICAgLy9cbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9XG5cbiAgLy9cbiAgLy8gVHJhaWxpbmcgY29sb24gaXMgcmVtb3ZlZCBmcm9tIGB1cmwuaG9zdGAgd2hlbiBpdCBpcyBwYXJzZWQuIElmIGl0IHN0aWxsXG4gIC8vIGVuZHMgd2l0aCBhIGNvbG9uLCB0aGVuIGFkZCBiYWNrIHRoZSB0cmFpbGluZyBjb2xvbiB0aGF0IHdhcyByZW1vdmVkLiBUaGlzXG4gIC8vIHByZXZlbnRzIGFuIGludmFsaWQgVVJMIGZyb20gYmVpbmcgdHJhbnNmb3JtZWQgaW50byBhIHZhbGlkIG9uZS5cbiAgLy9cbiAgaWYgKGhvc3RbaG9zdC5sZW5ndGggLSAxXSA9PT0gJzonIHx8IChwb3J0LnRlc3QodXJsLmhvc3RuYW1lKSAmJiAhdXJsLnBvcnQpKSB7XG4gICAgaG9zdCArPSAnOic7XG4gIH1cblxuICByZXN1bHQgKz0gaG9zdCArIHVybC5wYXRobmFtZTtcblxuICBxdWVyeSA9ICdvYmplY3QnID09PSB0eXBlb2YgdXJsLnF1ZXJ5ID8gc3RyaW5naWZ5KHVybC5xdWVyeSkgOiB1cmwucXVlcnk7XG4gIGlmIChxdWVyeSkgcmVzdWx0ICs9ICc/JyAhPT0gcXVlcnkuY2hhckF0KDApID8gJz8nKyBxdWVyeSA6IHF1ZXJ5O1xuXG4gIGlmICh1cmwuaGFzaCkgcmVzdWx0ICs9IHVybC5oYXNoO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblVybC5wcm90b3R5cGUgPSB7IHNldDogc2V0LCB0b1N0cmluZzogdG9TdHJpbmcgfTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgVVJMIHBhcnNlciBhbmQgc29tZSBhZGRpdGlvbmFsIHByb3BlcnRpZXMgdGhhdCBtaWdodCBiZSB1c2VmdWwgZm9yXG4vLyBvdGhlcnMgb3IgdGVzdGluZy5cbi8vXG5VcmwuZXh0cmFjdFByb3RvY29sID0gZXh0cmFjdFByb3RvY29sO1xuVXJsLmxvY2F0aW9uID0gbG9sY2F0aW9uO1xuVXJsLnRyaW1MZWZ0ID0gdHJpbUxlZnQ7XG5VcmwucXMgPSBxcztcblxubW9kdWxlLmV4cG9ydHMgPSBVcmw7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXG4vKipcbiAqIENoZWNrIGlmIHRoZSBET00gZWxlbWVudCBgY2hpbGRgIGlzIHdpdGhpbiB0aGUgZ2l2ZW4gYHBhcmVudGAgRE9NIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fFJhbmdlfSBjaGlsZCAtIHRoZSBET00gZWxlbWVudCBvciBSYW5nZSB0byBjaGVjayBpZiBpdCdzIHdpdGhpbiBgcGFyZW50YFxuICogQHBhcmFtIHtET01FbGVtZW50fSBwYXJlbnQgIC0gdGhlIHBhcmVudCBub2RlIHRoYXQgYGNoaWxkYCBjb3VsZCBiZSBpbnNpZGUgb2ZcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgYGNoaWxkYCBpcyB3aXRoaW4gYHBhcmVudGAuIEZhbHNlIG90aGVyd2lzZS5cbiAqIEBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdpdGhpbiAoY2hpbGQsIHBhcmVudCkge1xuICAvLyBkb24ndCB0aHJvdyBpZiBgY2hpbGRgIGlzIG51bGxcbiAgaWYgKCFjaGlsZCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFJhbmdlIHN1cHBvcnRcbiAgaWYgKGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSBjaGlsZCA9IGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICBlbHNlIGlmIChjaGlsZC5lbmRDb250YWluZXIpIGNoaWxkID0gY2hpbGQuZW5kQ29udGFpbmVyO1xuXG4gIC8vIHRyYXZlcnNlIHVwIHRoZSBgcGFyZW50Tm9kZWAgcHJvcGVydGllcyB1bnRpbCBgcGFyZW50YCBpcyBmb3VuZFxuICB2YXIgbm9kZSA9IGNoaWxkO1xuICB3aGlsZSAobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkge1xuICAgIGlmIChub2RlID09IHBhcmVudCkgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLyoqXG4gKiDmraTmlrnms5XnlKjkuo7lkbzotbfmnKzlnLDlrqLmiLfnq6/vvIzlkbzotbflpLHotKXml7bvvIzot7PovazliLDlrqLmiLfnq6/kuIvovb3lnLDlnYDmiJbogIXkuK3pl7TpobVcbiAqIC0g6aaW5YWI6ZyA6KaB5a6i5oi356uv5o+Q5L6b5LiA5Liq5Y2P6K6u5Zyw5Z2AIHByb3RvY29sXG4gKiAtIOeEtuWQjumAmui/h+a1j+iniOWZqOiuv+mXruivpeWcsOWdgOaIluiAhSBpZnJhbWUg6K6/6Zeu6K+l5Y2P6K6u5Zyw5Z2A5p2l6Kem5Y+R5a6i5oi356uv55qE5omT5byA5Yqo5L2cXG4gKiAtIOWcqOiuvuWumuWlveeahOi2heaXtuaXtumXtCAod2FpdGluZykg5Yiw6L6+5pe26L+b6KGM5qOA5p+lXG4gKiAtIOeUseS6jiBJT1Mg5LiL77yM6Lez6L2s5YiwIEFQUO+8jOmhtemdoiBKUyDkvJrooqvpmLvmraLmiafooYxcbiAqIC0g5omA5Lul5aaC5p6c6LaF5pe25pe26Ze05aSn5aSn6LaF6L+H5LqG6aKE5pyf5pe26Ze06IyD5Zu077yM5Y+v5pat5a6aIEFQUCDlt7LooqvmiZPlvIDvvIzmraTml7bop6blj5Egb25UaW1lb3V0IOWbnuiwg+S6i+S7tuWHveaVsFxuICogLSDlr7nkuo4gSU9T77yM5q2k5pe25aaC5p6c5LuOIEFQUCDov5Tlm57pobXpnaLvvIzlsLHlj6/ku6XpgJrov4cgd2FpdGluZ0xpbWl0IOaXtumXtOW3ruadpeWIpOaWreaYr+WQpuimgeaJp+ihjCBmYWxsYmFjayDlm57osIPkuovku7blh73mlbBcbiAqIC0gQW5kcm9pZCDkuIvvvIzot7PovazliLAgQVBQ77yM6aG16Z2iIEpTIOS8mue7p+e7reaJp+ihjFxuICogLSDmraTml7bml6DorrogQVBQIOaYr+WQpuW3suaJk+W8gO+8jOmDveS8muinpuWPkSBvbkZhbGxiYWNrIOS6i+S7tuS4jiBmYWxsYmFjayDlm57osIPkuovku7blh73mlbBcbiAqIC0gZmFsbGJhY2sg6buY6K6k5pON5L2c5piv6Lez6L2s5YiwIGZhbGxiYWNrVXJsIOWuouaIt+err+S4i+i9veWcsOWdgOaIluiAheS4remXtOmhteWcsOWdgFxuICogLSDov5nmoLflr7nkuo7msqHmnInlronoo4UgQVBQIOeahOenu+WKqOerr++8jOmhtemdouS8muWcqOi2heaXtuS6i+S7tuWPkeeUn+aXtu+8jOebtOaOpei3s+i9rOWIsCBmYWxsYmFja1VybFxuICogQG1ldGhvZCBhcHAvY2FsbFVwXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMucHJvdG9jb2wg5a6i5oi356uvQVBQ5ZG86LW35Y2P6K6u5Zyw5Z2AXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5mYWxsYmFja1VybCDlrqLmiLfnq6/kuIvovb3lnLDlnYDmiJbogIXkuK3pl7TpobXlnLDlnYBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuYWN0aW9uIOiHquWumuS5ieWRvOi1t+WuouaIt+err+eahOaWueW8j1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN0YXJ0VGltZT1uZXcgRGF0ZSgpLmdldFRpbWUoKV0g5ZG86LW35a6i5oi356uv55qE5byA5aeL5pe26Ze0KG1zKe+8jOS7peaXtumXtOaVsOWAvOS9nOS4uuWPguaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndhaXRpbmc9ODAwXSDlkbzotbfotoXml7bnrYnlvoXml7bpl7QobXMpXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2FpdGluZ0xpbWl0PTUwXSDotoXml7blkI7mo4Dmn6Xlm57osIPmmK/lkKblnKjmraTml7bpl7TpmZDliLblhoXop6blj5EobXMpXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5mYWxsYmFjaz1mdW5jdGlvbiAoKSB7IHdpbmRvdy5sb2NhdGlvbiA9IGZhbGxiYWNrVXJsOyB9XSDpu5jorqTlm57pgIDmk43kvZxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRmFsbGJhY2s9bnVsbF0g5ZG86LW35pON5L2c5pyq6IO95oiQ5Yqf5omn6KGM5pe26Kem5Y+R55qE5Zue6LCD5LqL5Lu25Ye95pWwXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vblRpbWVvdXQ9bnVsbF0g5ZG86LW36LaF5pe26Kem5Y+R55qE5Zue6LCD5LqL5Lu25Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRjYWxsVXAgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2FwcC9jYWxsVXAnKTtcbiAqICRjYWxsVXAoe1xuICogICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gKiAgIHdhaXRpbmc6IDgwMCxcbiAqICAgd2FpdGluZ0xpbWl0OiA1MCxcbiAqICAgcHJvdG9jb2wgOiBzY2hlbWUsXG4gKiAgIGZhbGxiYWNrVXJsIDogZG93bmxvYWQsXG4gKiAgIG9uRmFsbGJhY2sgOiBmdW5jdGlvbiAoKSB7XG4gKiAgICAgLy8gc2hvdWxkIGRvd25sb2FkXG4gKiAgIH1cbiAqIH0pO1xuICovXG5cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICRicm93c2VyID0gcmVxdWlyZSgnLi4vZW52L2Jyb3dzZXInKTtcblxuZnVuY3Rpb24gY2FsbFVwKG9wdGlvbnMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICBwcm90b2NvbDogJycsXG4gICAgZmFsbGJhY2tVcmw6ICcnLFxuICAgIGFjdGlvbjogbnVsbCxcbiAgICBzdGFydFRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgIHdhaXRpbmc6IDgwMCxcbiAgICB3YWl0aW5nTGltaXQ6IDUwLFxuICAgIGZhbGxiYWNrOiBmdW5jdGlvbiAoZmFsbGJhY2tVcmwpIHtcbiAgICAgIC8vIOWcqOS4gOWumuaXtumXtOWGheaXoOazleWUpOi1t+WuouaIt+err++8jOi3s+i9rOS4i+i9veWcsOWdgOaIluWIsOS4remXtOmhtVxuICAgICAgd2luZG93LmxvY2F0aW9uID0gZmFsbGJhY2tVcmw7XG4gICAgfSxcbiAgICBvbkZhbGxiYWNrOiBudWxsLFxuICAgIG9uVGltZW91dDogbnVsbCxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgdmFyIHdJZDtcbiAgdmFyIGlmcmFtZTtcblxuICBpZiAodHlwZW9mIGNvbmYuYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uZi5hY3Rpb24oKTtcbiAgfSBlbHNlIGlmICgkYnJvd3NlcigpLmNocm9tZSkge1xuICAgIC8vIGNocm9tZeS4i2lmcmFtZeaXoOazleWUpOi1t0FuZHJvaWTlrqLmiLfnq6/vvIzov5nph4zkvb/nlKh3aW5kb3cub3BlblxuICAgIC8vIOWPpuS4gOS4quaWueahiOWPguiAgyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9jaHJvbWUvbW9iaWxlL2RvY3MvaW50ZW50c1xuICAgIHZhciB3aW4gPSB3aW5kb3cub3Blbihjb25mLnByb3RvY29sKTtcbiAgICB3SWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIHdpbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh3SWQpO1xuICAgICAgICB3aW4uY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9LCAxMCk7XG4gIH0gZWxzZSB7XG4gICAgLy8g5Yib5bu6aWZyYW1lXG4gICAgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgaWZyYW1lLnNyYyA9IGNvbmYucHJvdG9jb2w7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICB9XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdJZCkge1xuICAgICAgY2xlYXJJbnRlcnZhbCh3SWQpO1xuICAgIH1cblxuICAgIGlmIChpZnJhbWUpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbmYub25UaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25mLm9uVGltZW91dCgpO1xuICAgIH1cblxuICAgIC8vIGlvc+S4i++8jOi3s+i9rOWIsEFQUO+8jOmhtemdokpT5Lya6KKr6Zi75q2i5omn6KGM44CCXG4gICAgLy8g5Zug5q2k5aaC5p6c6LaF5pe25pe26Ze05aSn5aSn6LaF6L+H5LqG6aKE5pyf5pe26Ze06IyD5Zu077yM5Y+v5pat5a6aQVBQ5bey6KKr5omT5byA44CCXG4gICAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gY29uZi5zdGFydFRpbWUgPCBjb25mLndhaXRpbmcgKyBjb25mLndhaXRpbmdMaW1pdCkge1xuICAgICAgaWYgKHR5cGVvZiBjb25mLm9uRmFsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uZi5vbkZhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvbmYuZmFsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uZi5mYWxsYmFjayhjb25mLmZhbGxiYWNrVXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIGNvbmYud2FpdGluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FsbFVwO1xuIiwiLyoqXG4gKiDlpITnkIbkuI7lrqLmiLfnq6/nm7jlhbPnmoTkuqTkupJcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2FwcFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvYXBwXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuYXBwLmNhbGxVcCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvYXBwXG4gKiB2YXIgJGFwcCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvYXBwJyk7XG4gKiBjb25zb2xlLmluZm8oJGFwcC5jYWxsVXApO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRjYWxsVXAgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2FwcC9jYWxsVXAnKTtcbiAqL1xuXG5leHBvcnRzLmNhbGxVcCA9IHJlcXVpcmUoJy4vY2FsbFVwJyk7XG4iLCIvKipcbiAqIOehruiupOWvueixoeaYr+WQpuWcqOaVsOe7hOS4rVxuICogQG1ldGhvZCBhcnIvY29udGFpbnNcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7Kn0gaXRlbSDopoHmkJzntKLnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtCb29sZWFufSDlpoLmnpzlr7nosaHlnKjmlbDnu4TkuK3vvIzov5Tlm54gdHJ1ZVxuICogQGV4YW1wbGVcbiAqIHZhciAkY29udGFpbnMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Fyci8kY29udGFpbnMnKTtcbiAqIGNvbnNvbGUuaW5mbygkY29udGFpbnMoWzEsMiwzLDQsNV0sIDMpKTsgLy8gdHJ1ZVxuICovXG5cbmZ1bmN0aW9uIGNvbnRhaW5zKGFyciwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgcmV0dXJuIGluZGV4ID49IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7XG4iLCIvKipcbiAqIOWIoOmZpOaVsOe7hOS4reeahOWvueixoVxuICogQG1ldGhvZCBhcnIvZXJhc2VcbiAqIEBwYXJhbSB7QXJyYXl9IGFyciDopoHmk43kvZznmoTmlbDnu4RcbiAqIEBwYXJhbSB7Kn0gaXRlbSDopoHmuIXpmaTnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWvueixoeWOn+acrOaJgOWcqOS9jee9rlxuICogQGV4YW1wbGVcbiAqIHZhciAkZXJhc2UgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Fyci9lcmFzZScpO1xuICogY29uc29sZS5pbmZvKCRlcmFzZShbMSwyLDMsNCw1XSwzKSk7IC8vIFsxLDIsNCw1XVxuICovXG5cbmZ1bmN0aW9uIGVyYXNlKGFyciwgaXRlbSkge1xuICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gaW5kZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXJhc2U7XG4iLCIvKipcbiAqIOafpeaJvuespuWQiOadoeS7tueahOWFg+e0oOWcqOaVsOe7hOS4reeahOS9jee9rlxuICogQG1ldGhvZCBhcnIvZmluZFxuICogQHBhcmFtIHtBcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g5p2h5Lu25Ye95pWwXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIOWHveaVsOeahHRoaXPmjIflkJFcbiAqIEByZXR1cm4ge0FycmF5fSDnrKblkIjmnaHku7bnmoTlhYPntKDlnKjmlbDnu4TkuK3nmoTkvY3nva5cbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZpbmQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Fyci9maW5kJyk7XG4gKiBjb25zb2xlLmluZm8oJGZpbmQoWzEsMiwzLDQsNV0sIGZ1bmN0aW9uIChpdGVtKSB7XG4gKiAgIHJldHVybiBpdGVtIDwgMztcbiAqIH0pOyAvLyBbMCwgMV1cbiAqL1xuXG5mdW5jdGlvbiBmaW5kSW5BcnIoYXJyLCBmbiwgY29udGV4dCkge1xuICB2YXIgcG9zaXRpb25zID0gW107XG4gIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgIGlmIChmbi5jYWxsKGNvbnRleHQsIGl0ZW0sIGluZGV4LCBhcnIpKSB7XG4gICAgICBwb3NpdGlvbnMucHVzaChpbmRleCk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHBvc2l0aW9ucztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW5BcnI7XG4iLCIvKipcbiAqIOaVsOe7hOaJgeW5s+WMllxuICogQG1ldGhvZCBhcnIvZmxhdHRlblxuICogQHBhcmFtIHthcnJheX0gYXJyIOimgeaTjeS9nOeahOaVsOe7hFxuICogQHJldHVybnMge2FycmF5fSDnu4/ov4fmiYHlubPljJblpITnkIbnmoTmlbDnu4RcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZsYXR0ZW4gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Fyci9mbGF0dGVuJyk7XG4gKiBjb25zb2xlLmluZm8oJGZsYXR0ZW4oWzEsIFsyLDNdLCBbNCw1XV0pKTsgLy8gWzEsMiwzLDQsNV1cbiAqL1xuXG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xuXG5mdW5jdGlvbiBmbGF0dGVuKGFycikge1xuICB2YXIgYXJyYXkgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgdmFyIHR5cGUgPSAkdHlwZShhcnJbaV0pO1xuICAgIGlmICh0eXBlID09PSAnbnVsbCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB2YXIgZXh0cmFBcnIgPSB0eXBlID09PSAnYXJyYXknID8gZmxhdHRlbihhcnJbaV0pIDogYXJyW2ldO1xuICAgIGFycmF5ID0gYXJyYXkuY29uY2F0KGV4dHJhQXJyKTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlbjtcbiIsIi8qKlxuICog56Gu6K6k5a+56LGh5piv5ZCm5Zyo5pWw57uE5Lit77yM5LiN5a2Y5Zyo5YiZ5bCG5a+56LGh5o+S5YWl5Yiw5pWw57uE5LitXG4gKiBAbWV0aG9kIGFyci9pbmNsdWRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIg6KaB5pON5L2c55qE5pWw57uEXG4gKiBAcGFyYW0geyp9IGl0ZW0g6KaB5o+S5YWl55qE5a+56LGhXG4gKiBAcmV0dXJucyB7QXJyYXl9IOe7j+i/h+WkhOeQhueahOa6kOaVsOe7hFxuICogQGV4YW1wbGVcbiAqIHZhciAkaW5jbHVkZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvYXJyL2luY2x1ZGUnKTtcbiAqIGNvbnNvbGUuaW5mbygkaW5jbHVkZShbMSwyLDNdLDQpKTsgLy8gWzEsMiwzLDRdXG4gKiBjb25zb2xlLmluZm8oJGluY2x1ZGUoWzEsMiwzXSwzKSk7IC8vIFsxLDIsM11cbiAqL1xuXG52YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnLi9jb250YWlucycpO1xuXG5mdW5jdGlvbiBpbmNsdWRlKGFyciwgaXRlbSkge1xuICBpZiAoISRjb250YWlucyhhcnIsIGl0ZW0pKSB7XG4gICAgYXJyLnB1c2goaXRlbSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmNsdWRlO1xuIiwiLyoqXG4gKiDnsbvmlbDnu4Tlr7nosaHnm7jlhbPlt6Xlhbflh73mlbBcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2FyclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvYXJyXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuYXJyLmNvbnRhaW5zKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnJcbiAqIHZhciAkYXJyID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9hcnInKTtcbiAqIGNvbnNvbGUuaW5mbygkYXJyLmNvbnRhaW5zKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkY29udGFpbnMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Fyci9jb250YWlucycpO1xuICovXG5cbmV4cG9ydHMuY29udGFpbnMgPSByZXF1aXJlKCcuL2NvbnRhaW5zJyk7XG5leHBvcnRzLmVyYXNlID0gcmVxdWlyZSgnLi9lcmFzZScpO1xuZXhwb3J0cy5maW5kID0gcmVxdWlyZSgnLi9maW5kJyk7XG5leHBvcnRzLmZsYXR0ZW4gPSByZXF1aXJlKCcuL2ZsYXR0ZW4nKTtcbmV4cG9ydHMuaW5jbHVkZSA9IHJlcXVpcmUoJy4vaW5jbHVkZScpO1xuIiwiLyoqXG4gKiDmj5Dkvpvlr7kgY29va2llIOeahOivu+WGmeiDveWKm1xuICogLSDlhpnlhaXml7boh6rliqjnlKggZW5jb2RlVVJJQ29tcG9uZW50IOe8lueggVxuICogLSDor7vlj5bml7boh6rliqjnlKggZGVjb2RlVVJJQ29tcG9uZW50IOino+eggVxuICogQG1vZHVsZSBjb29raWUvY29va2llXG4gKiBAc2VlIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2pzLWNvb2tpZVxuICogQGV4YW1wbGVcbiAqIHZhciAkY29va2llID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9jb29raWUvY29va2llJyk7XG4gKiAkY29va2llLnNldCgnbmFtZScsICfkuK3mlocnLCB7XG4gKiAgIGV4cGlyZXM6IDFcbiAqIH0pO1xuICogJGNvb2tpZS5yZWFkKCduYW1lJykgLy8gJ+S4reaWhydcbiAqL1xuXG52YXIgQ29va2llID0gcmVxdWlyZSgnanMtY29va2llJyk7XG5cbnZhciBpbnN0YW5jZSA9IENvb2tpZS53aXRoQ29udmVydGVyKHtcbiAgcmVhZDogZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodmFsKTtcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCk7XG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnN0YW5jZTtcbiIsIi8qKlxuICog5pys5Zyw5a2Y5YKo55u45YWz5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9jb29raWVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2Nvb2tpZVxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmNvb2tpZS5jb29raWUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBzcG9yZS11aS9raXQvcGFja2FnZXMvY29va2llXG4gKiB2YXIgJGNvb2tpZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvY29va2llJyk7XG4gKiBjb25zb2xlLmluZm8oJGNvb2tpZS5jb29raWUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quW3peWFt+WvueixoVxuICogdmFyICRjb29raWUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Nvb2tpZS9jb29raWUnKTtcbiAqL1xuXG5leHBvcnRzLmNvb2tpZSA9IHJlcXVpcmUoJy4vY29va2llJyk7XG5leHBvcnRzLm9yaWdpbiA9IHJlcXVpcmUoJy4vb3JpZ2luJyk7XG4iLCIvKipcbiAqIOaPkOS+m+WvuSBjb29raWUg55qE6K+75YaZ6IO95YqbXG4gKiAtIOatpOaooeWdl+ebtOaOpeaPkOS+myBqcy1jb29raWUg55qE5Y6f55Sf6IO95Yqb77yM5LiN5YGa5Lu75L2V6Ieq5Yqo57yW6Kej56CBXG4gKiBAbW9kdWxlIGNvb2tpZS9vcmlnaW5cbiAqIEBzZWUgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvanMtY29va2llXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb29raWUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Nvb2tpZS9vcmlnaW4nKTtcbiAqICRjb29raWUuc2V0KCduYW1lJywgJ3ZhbHVlJywge1xuICogICBleHBpcmVzOiAxXG4gKiB9KTtcbiAqICRjb29raWUucmVhZCgnbmFtZScpIC8vICd2YWx1ZSdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdqcy1jb29raWUnKTtcbiIsIi8qKlxuICog5pel5pyf5a+56LGh5qC85byP5YyW6L6T5Ye6XG4gKlxuICog5qC85byP5YyW5pel5pyf5a+56LGh5qih5p2/6ZSu5YC86K+05piOXG4gKiAtIHllYXIg5bm05Lu95Y6f5aeL5pWw5YC8XG4gKiAtIG1vbnRoIOaciOS7veWOn+Wni+aVsOWAvFsxLCAxMl1cbiAqIC0gZGF0ZSDml6XmnJ/ljp/lp4vmlbDlgLxbMSwgMzFdXG4gKiAtIGRheSDmmJ/mnJ/ljp/lp4vmlbDlgLxbMCwgNl1cbiAqIC0gaG91cnMg5bCP5pe25Y6f5aeL5pWw5YC8WzAsIDIzXVxuICogLSBtaW5pdXRlcyDliIbpkp/ljp/lp4vmlbDlgLxbMCwgNTldXG4gKiAtIHNlY29uZHMg56eS5Y6f5aeL5pWw5YC8WzAsIDU5XVxuICogLSBtaWxsaVNlY29uZHMg5q+r56eS5Y6f5aeL5pWw5YC8WzAsIDk5OV1cbiAqIC0gWVlZWSDlubTku73mlbDlgLzvvIznsr7noa7liLA05L2NKDEyID0+ICcwMDEyJylcbiAqIC0gWVkg5bm05Lu95pWw5YC877yM57K+56Gu5YiwMuS9jSgyMDE4ID0+ICcxOCcpXG4gKiAtIFkg5bm05Lu95Y6f5aeL5pWw5YC8XG4gKiAtIE1NIOaciOS7veaVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBNIOaciOS7veWOn+Wni+aVsOWAvFxuICogLSBERCDml6XmnJ/mlbDlgLzvvIznsr7noa7liLAy5L2NKDMgPT4gJzAzJylcbiAqIC0gRCDml6XmnJ/ljp/lp4vmlbDlgLxcbiAqIC0gZCDmmJ/mnJ/mlbDlgLzvvIzpgJrov4cgd2Vla2RheSDlj4LmlbDmmKDlsITlj5blvpcoMCA9PiAn5pelJylcbiAqIC0gaGgg5bCP5pe25pWw5YC877yM57K+56Gu5YiwMuS9jSg5ID0+ICcwOScpXG4gKiAtIGgg5bCP5pe25Y6f5aeL5pWw5YC8XG4gKiAtIG1tIOWIhumSn+aVsOWAvO+8jOeyvuehruWIsDLkvY0oOSA9PiAnMDknKVxuICogLSBtIOWIhumSn+WOn+Wni+aVsOWAvFxuICogLSBzcyDnp5LmlbDlgLzvvIznsr7noa7liLAy5L2NKDkgPT4gJzA5JylcbiAqIC0gcyDnp5Lljp/lp4vmlbDlgLxcbiAqIC0gbXNzIOavq+enkuaVsOWAvO+8jOeyvuehruWIsDPkvY0oOSA9PiAnMDA5JylcbiAqIC0gbXMg5q+r56eS5Y6f5aeL5pWw5YC8XG4gKiBAbWV0aG9kIGRhdGUvZm9ybWF0XG4gKiBAcGFyYW0ge0RhdGV9IGRvYmog5pel5pyf5a+56LGh77yM5oiW6ICF5Y+v5Lul6KKr6L2s5o2i5Li65pel5pyf5a+56LGh55qE5pWw5o2uXG4gKiBAcGFyYW0ge09iamVjdH0gW3NwZWNdIOagvOW8j+WMlumAiemhuVxuICogQHBhcmFtIHtBcnJheX0gW3NwZWMud2Vla2RheT0n5pel5LiA5LqM5LiJ5Zub5LqU5YWtJy5zcGxpdCgnJyldIOS4gOWRqOWGheWQhOWkqeWvueW6lOWQjeensO+8jOmhuuW6j+S7juWRqOaXpeeul+i1t1xuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLnRlbXBsYXRlPSd7e1lZWVl9fS17e01NfX0te3tERH19IHt7aGh9fTp7e21tfX0nXSDmoLzlvI/ljJbmqKHmnb9cbiAqIEByZXR1cm4ge1N0cmluZ30g5qC85byP5YyW5a6M5oiQ55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRmb3JtYXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGUvZm9ybWF0Jyk7XG4gKiBjb25zb2xlLmluZm8oXG4gKiAgICRmb3JtYXQobmV3IERhdGUoKSx7XG4gKiAgICAgdGVtcGxhdGUgOiAne3tZWVlZfX3lubR7e01NfX3mnIh7e0REfX3ml6Ug5ZGoe3tkfX0ge3toaH195pe2e3ttbX195YiGe3tzc31956eSJ1xuICogICB9KVxuICogKTtcbiAqIC8vIDIwMTXlubQwOeaciDA55pelIOWRqOS4iSAxNOaXtjE55YiGNDLnp5JcbiAqL1xuXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkc3Vic3RpdHV0ZSA9IHJlcXVpcmUoJy4uL3N0ci9zdWJzdGl0dXRlJyk7XG52YXIgJGZpeFRvID0gcmVxdWlyZSgnLi4vbnVtL2ZpeFRvJyk7XG52YXIgJGdldFVUQ0RhdGUgPSByZXF1aXJlKCcuL2dldFVUQ0RhdGUnKTtcblxudmFyIHJMaW1pdCA9IGZ1bmN0aW9uIChudW0sIHcpIHtcbiAgdmFyIHN0ciA9ICRmaXhUbyhudW0sIHcpO1xuICB2YXIgZGVsdGEgPSBzdHIubGVuZ3RoIC0gdztcbiAgcmV0dXJuIGRlbHRhID4gMCA/IHN0ci5zdWJzdHIoZGVsdGEpIDogc3RyO1xufTtcblxuZnVuY3Rpb24gZm9ybWF0KGRvYmosIHNwZWMpIHtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICB2YXIgZGF0YSA9IHt9O1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHdlZWtkYXk6ICfml6XkuIDkuozkuInlm5vkupTlha0nLnNwbGl0KCcnKSxcbiAgICB0ZW1wbGF0ZTogJ3t7WVlZWX19LXt7TU19fS17e0REfX0ge3toaH19Ont7bW19fScsXG4gIH0sIHNwZWMpO1xuXG4gIC8vIOino+WGs+S4jeWQjOacjeWKoeWZqOaXtuWMuuS4jeS4gOiHtOWPr+iDveS8muWvvOiHtOaXpeacn+WIneWni+WMluaXtumXtOS4jeS4gOiHtOeahOmXrumimFxuICAvLyDkvKDlhaXmlbDlrZfku6XljJfkuqzml7bljLrml7bpl7TkuLrlh4ZcbiAgdmFyIHV0Y0RhdGUgPSAkZ2V0VVRDRGF0ZShkb2JqKTtcbiAgZGF0YS55ZWFyID0gdXRjRGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICBkYXRhLm1vbnRoID0gdXRjRGF0ZS5nZXRVVENNb250aCgpICsgMTtcbiAgZGF0YS5kYXRlID0gdXRjRGF0ZS5nZXRVVENEYXRlKCk7XG4gIGRhdGEuZGF5ID0gdXRjRGF0ZS5nZXRVVENEYXkoKTtcbiAgZGF0YS5ob3VycyA9IHV0Y0RhdGUuZ2V0VVRDSG91cnMoKTtcbiAgZGF0YS5taW5pdXRlcyA9IHV0Y0RhdGUuZ2V0VVRDTWludXRlcygpO1xuICBkYXRhLnNlY29uZHMgPSB1dGNEYXRlLmdldFVUQ1NlY29uZHMoKTtcbiAgZGF0YS5taWxsaVNlY29uZHMgPSB1dGNEYXRlLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuXG4gIGRhdGEuWVlZWSA9IHJMaW1pdChkYXRhLnllYXIsIDQpO1xuICBkYXRhLllZID0gckxpbWl0KGRhdGEueWVhciwgMik7XG4gIGRhdGEuWSA9IGRhdGEueWVhcjtcblxuICBkYXRhLk1NID0gJGZpeFRvKGRhdGEubW9udGgsIDIpO1xuICBkYXRhLk0gPSBkYXRhLm1vbnRoO1xuXG4gIGRhdGEuREQgPSAkZml4VG8oZGF0YS5kYXRlLCAyKTtcbiAgZGF0YS5EID0gZGF0YS5kYXRlO1xuXG4gIGRhdGEuZCA9IGNvbmYud2Vla2RheVtkYXRhLmRheV07XG5cbiAgZGF0YS5oaCA9ICRmaXhUbyhkYXRhLmhvdXJzLCAyKTtcbiAgZGF0YS5oID0gZGF0YS5ob3VycztcblxuICBkYXRhLm1tID0gJGZpeFRvKGRhdGEubWluaXV0ZXMsIDIpO1xuICBkYXRhLm0gPSBkYXRhLm1pbml1dGVzO1xuXG4gIGRhdGEuc3MgPSAkZml4VG8oZGF0YS5zZWNvbmRzLCAyKTtcbiAgZGF0YS5zID0gZGF0YS5zZWNvbmRzO1xuXG4gIGRhdGEubXNzID0gJGZpeFRvKGRhdGEubWlsbGlTZWNvbmRzLCAzKTtcbiAgZGF0YS5tcyA9IGRhdGEubWlsbGlTZWNvbmRzO1xuXG4gIG91dHB1dCA9ICRzdWJzdGl0dXRlKGNvbmYudGVtcGxhdGUsIGRhdGEpO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdDtcbiIsIi8qKlxuICog6I635Y+W6L+H5Y675LiA5q615pe26Ze055qE6LW35aeL5pel5pyf77yM5aaCM+aciOWJjeesrDHlpKnvvIwy5ZGo5YmN56ysMeWkqe+8jDPlsI/ml7bliY3mlbTngrlcbiAqIEBtZXRob2QgZGF0ZS9nZXRMYXN0U3RhcnRcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSDljZXkvY3ml7bpl7TnsbvlnovvvIzlj6/pgIkgWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInXVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IOWkmuWwkeWNleS9jeaXtumXtOS5i+WJjVxuICogQHJldHVybnMge0RhdGV9IOacgOi/keWNleS9jeaXtumXtOeahOi1t+Wni+aXtumXtOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0TGFzdFN0YXJ0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kYXRlL2dldExhc3RTdGFydCcpO1xuICogdmFyIHRpbWUgPSAkZ2V0TGFzdFN0YXJ0KFxuICogICBuZXcgRGF0ZSgnMjAxOC0xMC0yNScpLFxuICogICAnbW9udGgnLFxuICogICAwXG4gKiApLmdldFRpbWUoKTsgLy8gMTUzODMyMzIwMDAwMFxuICogbmV3IERhdGUodGltZSk7IC8vIE1vbiBPY3QgMDEgMjAxOCAwMDowMDowMCBHTVQrMDgwMCAo5Lit5Zu95qCH5YeG5pe26Ze0KVxuICovXG5cbnZhciAkZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnLi9nZXRUaW1lU3BsaXQnKTtcbnZhciAkZ2V0VVRDRGF0ZSA9IHJlcXVpcmUoJy4vZ2V0VVRDRGF0ZScpO1xuXG52YXIgSE9VUiA9IDYwICogNjAgKiAxMDAwO1xudmFyIERBWSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbmZ1bmN0aW9uIGdldExhc3RTdGFydCh0aW1lLCB0eXBlLCBjb3VudCkge1xuICB2YXIgbG9jYWxUaW1lID0gbmV3IERhdGUodGltZSk7XG4gIHZhciB1dGNUaW1lID0gJGdldFVUQ0RhdGUodGltZSk7XG4gIHZhciBzdGFtcCA9IHV0Y1RpbWU7XG4gIHZhciB5ZWFyO1xuICB2YXIgbW9udGg7XG4gIHZhciBhbGxNb250aHM7XG4gIHZhciB1bml0O1xuICBpZiAoIXR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVpcmVkIHBhcmFtIHR5cGUnKTtcbiAgfVxuICBjb3VudCA9IGNvdW50IHx8IDA7XG4gIGlmICh0eXBlID09PSAneWVhcicpIHtcbiAgICB5ZWFyID0gdXRjVGltZS5nZXRVVENGdWxsWWVhcigpO1xuICAgIHllYXIgLT0gY291bnQ7XG4gICAgc3RhbXAgPSBuZXcgRGF0ZSh5ZWFyICsgJy8xLzEnKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbW9udGgnKSB7XG4gICAgeWVhciA9IHV0Y1RpbWUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICBtb250aCA9IHV0Y1RpbWUuZ2V0VVRDTW9udGgoKTtcbiAgICBhbGxNb250aHMgPSB5ZWFyICogMTIgKyBtb250aCAtIGNvdW50O1xuICAgIHllYXIgPSBNYXRoLmZsb29yKGFsbE1vbnRocyAvIDEyKTtcbiAgICBtb250aCA9IGFsbE1vbnRocyAtIHllYXIgKiAxMjtcbiAgICBtb250aCArPSAxO1xuICAgIHN0YW1wID0gbmV3IERhdGUoW3llYXIsIG1vbnRoLCAxXS5qb2luKCcvJykpO1xuICB9IGVsc2Uge1xuICAgIHVuaXQgPSBIT1VSO1xuICAgIGlmICh0eXBlID09PSAnZGF5Jykge1xuICAgICAgdW5pdCA9IERBWTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICd3ZWVrJykge1xuICAgICAgdW5pdCA9IDcgKiBEQVk7XG4gICAgfVxuICAgIHZhciBuZXdMb2NhbFRpbWUgPSBsb2NhbFRpbWUgLSBjb3VudCAqIHVuaXQ7XG4gICAgc3RhbXAgPSAkZ2V0VGltZVNwbGl0KG5ld0xvY2FsVGltZSwgdHlwZSk7XG4gIH1cblxuICByZXR1cm4gc3RhbXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TGFzdFN0YXJ0O1xuIiwiLyoqXG4gKiDojrflj5bmn5DkuKrml7bpl7TnmoQg5pW05bm0fOaVtOaciHzmlbTml6V85pW05pe2fOaVtOWIhiDml7bpl7Tlr7nosaFcbiAqIEBtZXRob2QgZGF0ZS9nZXRUaW1lU3BsaXRcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUg5a6e6ZmF5pe26Ze0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSDljZXkvY3ml7bpl7TnsbvlnovvvIzlj6/pgIkgWyd5ZWFyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInXVxuICogQHJldHVybnMge0RhdGV9IOaXtumXtOaVtOeCueWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kYXRlL2dldFRpbWVTcGxpdCcpO1xuICogbmV3IERhdGUoXG4gKiAgICRnZXRUaW1lU3BsaXQoXG4gKiAgICAgJzIwMTgtMDktMjAnLFxuICogICAgICdtb250aCdcbiAqICAgKVxuICogKS50b0dNVFN0cmluZygpO1xuICogLy8gU2F0IFNlcCAwMSAyMDE4IDAwOjAwOjAwIEdNVCswODAwICjkuK3lm73moIflh4bml7bpl7QpXG4gKlxuICogbmV3IERhdGUoXG4gKiAgICRnZXRUaW1lU3BsaXQoXG4gKiAgICAgJzIwMTgtMDktMjAgMTk6MjM6MzYnLFxuICogICAgICdob3VyJ1xuICogICApXG4gKiApLnRvR01UU3RyaW5nKCk7XG4gKiAvLyBUaHUgU2VwIDIwIDIwMTggMTk6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqL1xudmFyICRnZXRVVENEYXRlID0gcmVxdWlyZSgnLi9nZXRVVENEYXRlJyk7XG5cbnZhciBEQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG52YXIgVElNRV9VTklUUyA9IFtcbiAgJ2hvdXInLFxuICAnZGF5JyxcbiAgJ3dlZWsnLFxuICAnbW9udGgnLFxuICAneWVhcicsXG5dO1xuXG5mdW5jdGlvbiBnZXRUaW1lU3BsaXQodGltZSwgdHlwZSkge1xuICBpZiAoIXR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVpcmVkIHBhcmFtIHR5cGUnKTtcbiAgfVxuXG4gIHZhciBsb2NhbFRpbWUgPSBuZXcgRGF0ZSh0aW1lKTtcbiAgdmFyIHV0Y1RpbWUgPSAkZ2V0VVRDRGF0ZSh0aW1lKTtcblxuICAvLyDku6XlkajkuIDkuLrotbflp4vml7bpl7RcbiAgdmFyIGRheSA9IHV0Y1RpbWUuZ2V0RGF5KCk7XG4gIGRheSA9IGRheSA9PT0gMCA/IDYgOiBkYXkgLSAxO1xuXG4gIHZhciBpbmRleCA9IFRJTUVfVU5JVFMuaW5kZXhPZih0eXBlKTtcbiAgaWYgKGluZGV4ID09PSAyKSB7XG4gICAgdXRjVGltZSA9IG5ldyBEYXRlKGxvY2FsVGltZSAtIGRheSAqIERBWSk7XG4gIH1cbiAgdmFyIHllYXIgPSB1dGNUaW1lLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIHZhciBtb250aCA9IHV0Y1RpbWUuZ2V0VVRDTW9udGgoKSArIDE7XG4gIHZhciBkYXRlID0gdXRjVGltZS5nZXRVVENEYXRlKCk7XG4gIHZhciBob3VyID0gdXRjVGltZS5nZXRVVENIb3VycygpO1xuICB2YXIgbWludXRlcyA9IHV0Y1RpbWUuZ2V0VVRDTWludXRlcygpO1xuXG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgbWludXRlcyA9ICcwMCc7XG4gIH1cbiAgaWYgKGluZGV4ID49IDEpIHtcbiAgICBob3VyID0gJzAwJztcbiAgfVxuICBpZiAoaW5kZXggPj0gMykge1xuICAgIGRhdGUgPSAxO1xuICB9XG4gIGlmIChpbmRleCA+PSA0KSB7XG4gICAgbW9udGggPSAxO1xuICB9XG5cbiAgdmFyIHN0ciA9IFtcbiAgICBbeWVhciwgbW9udGgsIGRhdGVdLmpvaW4oJy8nKSxcbiAgICBbaG91ciwgbWludXRlc10uam9pbignOicpLFxuICBdLmpvaW4oJyAnKTtcblxuICByZXR1cm4gbmV3IERhdGUoc3RyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUaW1lU3BsaXQ7XG4iLCIvKipcbiAqIOiOt+WPluS4gOS4quaXtumXtOWvueixoe+8jOWFtuW5tOaciOWRqOaXpeaXtuWIhuenkuetiSBVVEMg5YC85LiO5YyX5Lqs5pe26Ze05L+d5oyB5LiA6Ie044CCXG4gKiDop6PlhrPkuI3lkIzmnI3liqHlmajml7bljLrkuI3kuIDoh7TlnLrmma/kuIvvvIzlj6/og73kvJrlr7zoh7Tml6XmnJ/orqHnrpfkuI3kuIDoh7TnmoTpl67popguXG4gKiBAbWV0aG9kIGRhdGUvZ2V0VVRDRGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ8RGF0ZX0gdGltZSDlrp7pmYXml7bpl7RcbiAqIEByZXR1cm5zIHtEYXRlfSBVVEPml7bpl7RcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFVUQ0RhdGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGUvZ2V0VVRDRGF0ZScpO1xuICogdmFyIGNuVGltZSA9IDE1NDA5MTUyMDAwMDA7IC8vIChXZWQgT2N0IDMxIDIwMTggMDA6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtCkpXG4gKiB2YXIgdXRjRGF0ZSA9ICRnZXRVVENEYXRlKGNuVGltZSkuZ2V0VGltZSgpO1xuICogLy8gMTU0MDg4NjQwMDAwMCBUdWUgT2N0IDMwIDIwMTggMTY6MDA6MDAgR01UKzA4MDAgKOS4reWbveagh+WHhuaXtumXtClcbiAqIHV0Y0RhdGUuZ2V0VVRDZGF0ZSgpOyAvLyAzMVxuICogdXRjRGF0ZS5nZXRIb3VycygpOyAvLyA4XG4gKiB1dGNEYXRlLmdldFVUQ0hvdXJzKCk7IC8vIDBcbiAqL1xuZnVuY3Rpb24gZ2V0VVRDRGF0ZSh0aW1lKSB7XG4gIHZhciB1dGNEYXRlID0gbmV3IERhdGUobmV3IERhdGUodGltZSkuZ2V0VGltZSgpICsgMjg4MDAwMDApO1xuICByZXR1cm4gdXRjRGF0ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRVVENEYXRlO1xuIiwiLyoqXG4gKiDml6XmnJ/nm7jlhbPlt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2RhdGVcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2RhdGVcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgQHNwb3JlLXVpL2tpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5kYXRlLmZvcm1hdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvZGF0ZVxuICogdmFyICRkYXRlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kYXRlJyk7XG4gKiBjb25zb2xlLmluZm8oJGRhdGUuZm9ybWF0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZm9ybWF0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kYXRlL2Zvcm1hdCcpO1xuICovXG5cbmV4cG9ydHMuZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcbmV4cG9ydHMuZ2V0TGFzdFN0YXJ0ID0gcmVxdWlyZSgnLi9nZXRMYXN0U3RhcnQnKTtcbmV4cG9ydHMuZ2V0VGltZVNwbGl0ID0gcmVxdWlyZSgnLi9nZXRUaW1lU3BsaXQnKTtcbiIsIi8qKlxuICogRE9NIOaTjeS9nOebuOWFs+W3peWFt+WHveaVsFxuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvZG9tXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9kb21cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgQHNwb3JlLXVpL2tpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5kb20uaXNOb2RlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb21cbiAqIHZhciAkZG9tID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb20nKTtcbiAqIGNvbnNvbGUuaW5mbygkZG9tLmlzTm9kZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJGlzTm9kZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZG9tL2lzTm9kZScpO1xuICovXG5cbmV4cG9ydHMuaXNOb2RlID0gcmVxdWlyZSgnLi9pc05vZGUnKTtcbmV4cG9ydHMub2Zmc2V0ID0gcmVxdWlyZSgnLi9vZmZzZXQnKTtcbmV4cG9ydHMuc2Nyb2xsTGltaXQgPSByZXF1aXJlKCcuL3Njcm9sbExpbWl0Jyk7XG4iLCIvKipcbiAqIOWIpOaWreWvueixoeaYr+WQpuS4umRvbeWFg+e0oFxuICogQG1ldGhvZCBkb20vaXNOb2RlXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDopoHliKTmlq3nmoTlr7nosaFcbiAqIEByZXR1cm4ge0Jvb2xlYW59IOaYr+WQpuS4umRvbeWFg+e0oFxuICogQGV4YW1wbGVcbiAqIHZhciAkaXNOb2RlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb20vaXNOb2RlJyk7XG4gKiAkaXNOb2RlKGRvY3VtZW50LmJvZHkpIC8vIDFcbiAqL1xuZnVuY3Rpb24gaXNOb2RlKG5vZGUpIHtcbiAgcmV0dXJuIChcbiAgICBub2RlXG4gICAgJiYgbm9kZS5ub2RlTmFtZVxuICAgICYmIG5vZGUubm9kZVR5cGVcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05vZGU7XG4iLCIvKipcbiAqIOiOt+WPliBET00g5YWD57Sg55u45a+55LqOIGRvY3VtZW50IOeahOi+uei3nVxuICogQG1ldGhvZCBkb20vb2Zmc2V0XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90aW1veGxleS9vZmZzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIOimgeiuoeeulyBvZmZzZXQg55qEIGRvbSDlr7nosaFcbiAqIEByZXR1cm4ge09iamVjdH0gb2Zmc2V0IOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkb2Zmc2V0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9kb20vb2Zmc2V0Jyk7XG4gKiB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhcmdldCcpO1xuICogY29uc29sZS5sb2coJG9mZnNldCh0YXJnZXQpKTtcbiAqIC8vIHt0b3A6IDY5LCBsZWZ0OiAxMDh9XG4gKi9cblxudmFyIG9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHt9O1xufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICBvZmZzZXQgPSByZXF1aXJlKCdkb2N1bWVudC1vZmZzZXQnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmZzZXQ7XG4iLCIvKipcbiAqIOaYvuekuua7muWKqOWMuuWfn+a7keWKqOa7muWKqOS6i+S7tuS4jeWGjeepv+mAj+WIsOW6lemDqFxuICogLSBpb3Mg6ZyA6KaB57uZ5rua5Yqo5Yy65Z+f5re75Yqg5qC35byP5bGe5oCnOiAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7XG4gKiAtIOS7heaUr+aMgeWNleaWueWQkea7keWKqOemgeeUqFxuICogQG1ldGhvZCBkb20vc2Nyb2xsTGltaXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbCDopoHpmZDliLbmu5rliqjnqb/pgI/nmoTmu5rliqjljLrln5/lhYPntKBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmZkOWItua7muWKqOepv+mAj+eahOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmRpcmVjdGlvbj0neSddIOmZkOWItua7muWKqOeahOaWueWQke+8jOWPluWAvDogWyd4JywgJ3knXVxuICogQHJldHVybiB7Qm9vbGVhbn0g5piv5ZCm5Li6ZG9t5YWD57SgXG4gKiBAZXhhbXBsZVxuICogdmFyICRzY3JvbGxMaW1pdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZG9tL3Njcm9sbExpbWl0Jyk7XG4gKiB2YXIgc2Nyb2xsZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsZXInKTtcbiAqIHZhciBsaW1pdGVyID0gJHNjcm9sbExpbWl0KHNjcm9sbGVyLCB7IGRpcmVjdGlvbjogJ3knIH0pO1xuICogLy8g5Yid5aeL5YyW5pe2XG4gKiBsaW1pdGVyLmF0dGFjaCgpO1xuICogLy8g5Y246L2957uE5Lu25pe2XG4gKiBsaW1pdGVyLmRldGFjaCgpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxuZnVuY3Rpb24gc2Nyb2xsTGltaXQoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGluc3QgPSB7fTtcblxuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIGRpcmVjdGlvbjogJ3knLFxuICB9LCBvcHRpb25zKTtcblxuICB2YXIgc2Nyb2xsVG9wID0gMDtcbiAgdmFyIHNjcm9sbExlZnQgPSAwO1xuICB2YXIgY2xpZW50SGVpZ2h0ID0gMDtcbiAgdmFyIGNsaWVudFdpZHRoID0gMDtcbiAgdmFyIHNjcm9sbEhlaWdodCA9IDA7XG4gIHZhciBzY3JvbGxXaWR0aCA9IDA7XG4gIHZhciB0b1RvcCA9IGZhbHNlO1xuICB2YXIgdG9Cb3R0b20gPSBmYWxzZTtcbiAgdmFyIHRvTGVmdCA9IGZhbHNlO1xuICB2YXIgdG9SaWdodCA9IGZhbHNlO1xuICB2YXIgbW92ZVN0YXJ0WCA9IDA7XG4gIHZhciBtb3ZlU3RhcnRZID0gMDtcblxuICB2YXIgdXBkYXRlU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2Nyb2xsVG9wID0gZWwuc2Nyb2xsVG9wO1xuICAgIHNjcm9sbExlZnQgPSBlbC5zY3JvbGxMZWZ0O1xuICAgIGNsaWVudEhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICBzY3JvbGxIZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQ7XG4gICAgc2Nyb2xsV2lkdGggPSBlbC5zY3JvbGxXaWR0aDtcblxuICAgIHRvVG9wID0gc2Nyb2xsVG9wIDw9IDA7XG4gICAgdG9Cb3R0b20gPSBzY3JvbGxUb3AgKyBjbGllbnRIZWlnaHQgPj0gc2Nyb2xsSGVpZ2h0O1xuICAgIHRvTGVmdCA9IHNjcm9sbExlZnQgPD0gMDtcbiAgICB0b1JpZ2h0ID0gc2Nyb2xsTGVmdCArIGNsaWVudFdpZHRoID49IHNjcm9sbFdpZHRoO1xuICB9O1xuXG4gIHZhciBnZXRFdmVudCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgdGV2ID0gZXZ0O1xuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgIHRldiA9IGV2dC50b3VjaGVzWzBdO1xuICAgIH1cbiAgICByZXR1cm4gdGV2O1xuICB9O1xuXG4gIGluc3QuY2hlY2tTY3JvbGwgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHVwZGF0ZVN0YXRlKCk7XG4gIH07XG5cbiAgaW5zdC5jaGVja1N0YXJ0ID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0ZXYgPSBnZXRFdmVudChldnQpO1xuICAgIG1vdmVTdGFydFggPSB0ZXYuY2xpZW50WDtcbiAgICBtb3ZlU3RhcnRZID0gdGV2LmNsaWVudFk7XG4gIH07XG5cbiAgaW5zdC5jaGVja01vdmUgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdXBkYXRlU3RhdGUoKTtcbiAgICB2YXIgdGV2ID0gZ2V0RXZlbnQoZXZ0KTtcbiAgICBpZiAoY29uZi5kaXJlY3Rpb24gPT09ICd4Jykge1xuICAgICAgaWYgKHRvTGVmdCAmJiAodGV2LmNsaWVudFggPiBtb3ZlU3RhcnRYKSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0b1JpZ2h0ICYmICh0ZXYuY2xpZW50WCA8IG1vdmVTdGFydFgpKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodG9Ub3AgJiYgKHRldi5jbGllbnRZID4gbW92ZVN0YXJ0WSkpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBpZiAodG9Cb3R0b20gJiYgKHRldi5jbGllbnRZIDwgbW92ZVN0YXJ0WSkpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBzZXRFdmVudHMgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBwcmVmaXggPSB0eXBlID09PSAnb24nID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICB2YXIgbWV0aG9kID0gcHJlZml4ICsgJ0V2ZW50TGlzdGVuZXInO1xuICAgIGlmICh0eXBlb2YgZWxbbWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZWxbbWV0aG9kXSgnc2Nyb2xsJywgaW5zdC5jaGVja1Njcm9sbCk7XG4gICAgICBlbFttZXRob2RdKCd0b3VjaG1vdmUnLCBpbnN0LmNoZWNrTW92ZSk7XG4gICAgICBlbFttZXRob2RdKCd0b3VjaHN0YXJ0JywgaW5zdC5jaGVja1N0YXJ0KTtcbiAgICB9XG4gIH07XG5cbiAgaW5zdC5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdXBkYXRlU3RhdGUoKTtcbiAgICBzZXRFdmVudHMoJ29uJyk7XG4gIH07XG5cbiAgaW5zdC5kZXRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0RXZlbnRzKCdvZmYnKTtcbiAgfTtcblxuICByZXR1cm4gaW5zdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzY3JvbGxMaW1pdDtcbiIsIi8qKlxuICog5qOA5rWL5rWP6KeI5Zmo57G75Z6LXG4gKlxuICog5pSv5oyB55qE57G75Z6L5qOA5rWLXG4gKiAtIHFxXG4gKiAtIHVjXG4gKiAtIGJhaWR1XG4gKiAtIG1pdWlcbiAqIC0gd2VpeGluXG4gKiAtIHF6b25lXG4gKiAtIHFxbmV3c1xuICogLSBxcWhvdXNlXG4gKiAtIHFxYnJvd3NlclxuICogLSBjaHJvbWVcbiAqIEBtZXRob2QgZW52L2Jyb3dzZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkYnJvd3NlciA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZW52L2Jyb3dzZXInKTtcbiAqIGNvbnNvbGUuaW5mbygkYnJvd3NlcigpLmNocm9tZSk7XG4gKiBjb25zb2xlLmluZm8oJGJyb3dzZXIuZGV0ZWN0KCkpO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuXG52YXIgdGVzdGVycyA9IHtcbiAgcXE6ICgvcXFcXC8oW1xcZC5dKykvaSksXG4gIHVjOiAoL3VjYnJvd3Nlci9pKSxcbiAgYmFpZHU6ICgvYmFpZHVicm93c2VyL2kpLFxuICBtaXVpOiAoL21pdWlicm93c2VyL2kpLFxuICB3ZWl4aW46ICgvbWljcm9tZXNzZW5nZXIvaSksXG4gIHF6b25lOiAoL3F6b25lXFwvL2kpLFxuICBxcW5ld3M6ICgvcXFuZXdzXFwvKFtcXGQuXSspL2kpLFxuICBxcWhvdXNlOiAoL3FxaG91c2UvaSksXG4gIHFxYnJvd3NlcjogKC9xcWJyb3dzZXIvaSksXG4gIGNocm9tZTogKC9jaHJvbWUvaSksXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICB1YTogJycsXG4gIH0sIG9wdGlvbnMpO1xuXG4gICRhc3NpZ24odGVzdGVycywgY2hlY2tlcnMpO1xuXG4gIHJldHVybiAkdWFNYXRjaCh0ZXN0ZXJzLCBjb25mLnVhLCBjb25mKTtcbn1cblxudmFyIHJlc3VsdCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVudkJyb3dzZXIoKSB7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gZGV0ZWN0KCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZW52QnJvd3Nlci5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gZW52QnJvd3NlcjtcbiIsIi8qKlxuICog5qOA5rWL5rWP6KeI5Zmo5qC45b+DXG4gKlxuICog5pSv5oyB55qE57G75Z6L5qOA5rWLXG4gKiAtIHRyaWRlbnRcbiAqIC0gcHJlc3RvXG4gKiAtIHdlYmtpdFxuICogLSBnZWNrb1xuICogQG1ldGhvZCBlbnYvY29yZVxuICogQHJldHVybnMge09iamVjdH0gVUEg5qOA5p+l57uT5p6cXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb3JlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvY29yZScpO1xuICogY29uc29sZS5pbmZvKCRjb3JlKCkud2Via2l0KTtcbiAqIGNvbnNvbGUuaW5mbygkY29yZS5kZXRlY3QoKSk7XG4gKi9cblxudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHVhTWF0Y2ggPSByZXF1aXJlKCcuL3VhTWF0Y2gnKTtcblxudmFyIHRlc3RlcnMgPSB7XG4gIHRyaWRlbnQ6ICgvdHJpZGVudC9pKSxcbiAgcHJlc3RvOiAoL3ByZXN0by9pKSxcbiAgd2Via2l0OiAoL3dlYmtpdC9pKSxcbiAgZ2Vja286IGZ1bmN0aW9uICh1YSkge1xuICAgIHJldHVybiB1YS5pbmRleE9mKCdnZWNrbycpID4gLTEgJiYgdWEuaW5kZXhPZigna2h0bWwnKSA9PT0gLTE7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICB1YTogJycsXG4gIH0sIG9wdGlvbnMpO1xuXG4gICRhc3NpZ24odGVzdGVycywgY2hlY2tlcnMpO1xuXG4gIHJldHVybiAkdWFNYXRjaCh0ZXN0ZXJzLCBjb25mLnVhLCBjb25mKTtcbn1cblxudmFyIHJlc3VsdCA9IG51bGw7XG5cbmZ1bmN0aW9uIGNvcmUoKSB7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gZGV0ZWN0KCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuY29yZS5kZXRlY3QgPSBkZXRlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZTtcbiIsIi8qKlxuICog5qOA5rWL6K6+5aSH57G75Z6LXG4gKlxuICog5pSv5oyB55qE57G75Z6L5qOA5rWLXG4gKiAtIGh1YXdlaVxuICogLSBvcHBvXG4gKiAtIHZpdm9cbiAqIC0geGlhb21pXG4gKiAtIHNhbXNvbmdcbiAqIC0gaXBob25lXG4gKiBAbWV0aG9kIGVudi9kZXZpY2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFVBIOajgOafpee7k+aenFxuICogQGV4YW1wbGVcbiAqIHZhciAkZGV2aWNlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvZGV2aWNlJyk7XG4gKiBjb25zb2xlLmluZm8oJGRldmljZSgpLmh1YXdlaSk7XG4gKiBjb25zb2xlLmluZm8oJGRldmljZS5kZXRlY3QoKSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICR1YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5cbnZhciB0ZXN0ZXJzID0ge1xuICBodWF3ZWk6ICgvaHVhd2VpL2kpLFxuICBvcHBvOiAoL29wcG8vaSksXG4gIHZpdm86ICgvdml2by9pKSxcbiAgeGlhb21pOiAoL3hpYW9taS9pKSxcbiAgc2Ftc29uZzogKC9zbS0vaSksXG4gIGlwaG9uZTogKC9pcGhvbmUvaSksXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICB1YTogJycsXG4gIH0sIG9wdGlvbnMpO1xuXG4gICRhc3NpZ24odGVzdGVycywgY2hlY2tlcnMpO1xuXG4gIHJldHVybiAkdWFNYXRjaCh0ZXN0ZXJzLCBjb25mLnVhLCBjb25mKTtcbn1cblxudmFyIHJlc3VsdCA9IG51bGw7XG5cbmZ1bmN0aW9uIGRldmljZSgpIHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXN1bHQgPSBkZXRlY3QoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5kZXZpY2UuZGV0ZWN0ID0gZGV0ZWN0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRldmljZTtcbiIsIi8qKlxuICog546v5aKD5qOA5rWL5LiO5Yik5pat5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnZcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2VudlxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmVudi50b3VjaGFibGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2VudlxuICogdmFyICRlbnYgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2VudicpO1xuICogY29uc29sZS5pbmZvKCRlbnYudG91Y2hhYmxlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkdG91Y2hhYmxlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvdG91Y2hhYmxlJyk7XG4gKi9cblxuZXhwb3J0cy5icm93c2VyID0gcmVxdWlyZSgnLi9icm93c2VyJyk7XG5leHBvcnRzLmNvcmUgPSByZXF1aXJlKCcuL2NvcmUnKTtcbmV4cG9ydHMuZGV2aWNlID0gcmVxdWlyZSgnLi9kZXZpY2UnKTtcbmV4cG9ydHMubmV0d29yayA9IHJlcXVpcmUoJy4vbmV0d29yaycpO1xuZXhwb3J0cy5vcyA9IHJlcXVpcmUoJy4vb3MnKTtcbmV4cG9ydHMudG91Y2hhYmxlID0gcmVxdWlyZSgnLi90b3VjaGFibGUnKTtcbmV4cG9ydHMudWFNYXRjaCA9IHJlcXVpcmUoJy4vdWFNYXRjaCcpO1xuZXhwb3J0cy53ZWJwID0gcmVxdWlyZSgnLi93ZWJwJyk7XG4iLCIvKipcbiAqIOe9kee7nOeOr+Wig+ajgOa1i1xuICogQG1vZHVsZSBlbnYvbmV0d29ya1xuICovXG5cbnZhciBzdXBwb3J0T25saW5lID0gbnVsbDtcblxuLyoqXG4gKiDliKTmlq3pobXpnaLmmK/lkKbmlK/mjIHogZTnvZHmo4DmtYtcbiAqIEBtZXRob2QgZW52L25ldHdvcmsuc3VwcG9ydFxuICogQG1lbWJlcm9mIGVudi9uZXR3b3JrXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5piv5ZCm5pSv5oyB6IGU572R5qOA5rWLXG4gKiBAZXhhbXBsZVxuICogdmFyICRuZXR3b3JrID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvbmV0d29yaycpO1xuICogJG5ldHdvcmsuc3VwcG9ydCgpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN1cHBvcnQoKSB7XG4gIGlmIChzdXBwb3J0T25saW5lID09PSBudWxsKSB7XG4gICAgc3VwcG9ydE9ubGluZSA9ICEhKCdvbkxpbmUnIGluIHdpbmRvdy5uYXZpZ2F0b3IpO1xuICB9XG4gIHJldHVybiBzdXBwb3J0T25saW5lO1xufVxuXG4vKipcbiAqIOWIpOaWremhtemdouaYr+WQpuiBlOe9kVxuICogQG1ldGhvZCBlbnYvbmV0d29yay5vbkxpbmVcbiAqIEBtZW1iZXJvZiBlbnYvbmV0d29ya1xuICogQHJldHVybnMge0Jvb2xlYW59IOaYr+WQpuiBlOe9kVxuICogQGV4YW1wbGVcbiAqIHZhciAkbmV0d29yayA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZW52L25ldHdvcmsnKTtcbiAqICRuZXR3b3JrLm9uTGluZSgpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIG9uTGluZSgpIHtcbiAgcmV0dXJuIHN1cHBvcnQoKSA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lIDogdHJ1ZTtcbn1cblxuZXhwb3J0cy5zdXBwb3J0ID0gc3VwcG9ydDtcbmV4cG9ydHMub25MaW5lID0gb25MaW5lO1xuIiwiLyoqXG4gKiDmo4DmtYvmk43kvZzns7vnu5/nsbvlnotcbiAqXG4gKiDmlK/mjIHnmoTnsbvlnovmo4DmtYtcbiAqIC0gaW9zXG4gKiAtIGFuZHJvaWRcbiAqIEBtZXRob2QgZW52L29zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBVQSDmo4Dmn6Xnu5PmnpxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJG9zID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvb3MnKTtcbiAqIGNvbnNvbGUuaW5mbygkb3MoKS5pb3MpO1xuICogY29uc29sZS5pbmZvKCRvcy5kZXRlY3QoKSk7XG4gKi9cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xudmFyICR1YU1hdGNoID0gcmVxdWlyZSgnLi91YU1hdGNoJyk7XG5cbnZhciB0ZXN0ZXJzID0ge1xuICBpb3M6IC9saWtlIG1hYyBvcyB4L2ksXG4gIGFuZHJvaWQ6IGZ1bmN0aW9uICh1YSkge1xuICAgIHJldHVybiB1YS5pbmRleE9mKCdhbmRyb2lkJykgPiAtMSB8fCB1YS5pbmRleE9mKCdsaW51eCcpID4gLTE7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBkZXRlY3Qob3B0aW9ucywgY2hlY2tlcnMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICB1YTogJycsXG4gIH0sIG9wdGlvbnMpO1xuXG4gICRhc3NpZ24odGVzdGVycywgY2hlY2tlcnMpO1xuXG4gIHJldHVybiAkdWFNYXRjaCh0ZXN0ZXJzLCBjb25mLnVhLCBjb25mKTtcbn1cblxudmFyIHJlc3VsdCA9IG51bGw7XG5cbmZ1bmN0aW9uIG9zKCkge1xuICBpZiAoIXJlc3VsdCkge1xuICAgIHJlc3VsdCA9IGRldGVjdCgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm9zLmRldGVjdCA9IGRldGVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBvcztcbiIsIi8qKlxuICog5Yik5pat5rWP6KeI5Zmo5piv5ZCm5pSv5oyB6Kem5pG45bGPXG4gKiBAbWV0aG9kIGVudi90b3VjaGFibGVcbiAqIEByZXR1cm5zIHtCb29sZWFufSDmmK/lkKbmlK/mjIHop6bmkbjlsY9cbiAqIEBleGFtcGxlXG4gKiB2YXIgJHRvdWNoYWJsZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZW52L3RvdWNoYWJsZScpO1xuICogaWYgKCR0b3VjaGFibGUoKSkge1xuICogICAvLyBJdCBpcyBhIHRvdWNoIGRldmljZS5cbiAqIH1cbiAqL1xuXG52YXIgaXNUb3VjaGFibGUgPSBudWxsO1xuXG5mdW5jdGlvbiB0b3VjaGFibGUoKSB7XG4gIGlmIChpc1RvdWNoYWJsZSA9PT0gbnVsbCkge1xuICAgIGlzVG91Y2hhYmxlID0gISEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93XG4gICAgfHwgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpKTtcbiAgfVxuICByZXR1cm4gaXNUb3VjaGFibGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG91Y2hhYmxlO1xuIiwiLyoqXG4gKiBVQeWtl+espuS4suWMuemFjeWIl+ihqFxuICogQG1ldGhvZCBlbnYvdWFNYXRjaFxuICogQHBhcmFtIHtPYmplY3R9IGxpc3Qg5qOA5rWLIEhhc2gg5YiX6KGoXG4gKiBAcGFyYW0ge1N0cmluZ30gdWEg55So5LqO5qOA5rWL55qEIFVBIOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IGNvbmYg5qOA5rWL5Zmo6YCJ6aG577yM5Lyg6YCS57uZ5qOA5rWL5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICR1YU1hdGNoID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9lbnYvdWFNYXRjaCcpO1xuICogdmFyIHJzID0gJHVhTWF0Y2goe1xuICogICB0cmlkZW50OiAndHJpZGVudCcsXG4gKiAgIHByZXN0bzogL3ByZXN0by8sXG4gKiAgIGdlY2tvOiBmdW5jdGlvbih1YSl7XG4gKiAgICAgcmV0dXJuIHVhLmluZGV4T2YoJ2dlY2tvJykgPiAtMSAmJiB1YS5pbmRleE9mKCdraHRtbCcpID09PSAtMTtcbiAqICAgfVxuICogfSwgJ3h4eCBwcmVzdG8geHh4Jyk7XG4gKiBjb25zb2xlLmluZm8ocnMucHJlc3RvKTsgLy8gdHJ1ZVxuICogY29uc29sZS5pbmZvKHJzLnRyaWRlbnQpOyAvLyB1bmRlZmluZWRcbiAqL1xuXG5mdW5jdGlvbiB1YU1hdGNoKGxpc3QsIHVhLCBjb25mKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgaWYgKCF1YSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdWEgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB9XG4gIH1cbiAgdWEgPSB1YS50b0xvd2VyQ2FzZSgpO1xuICBpZiAodHlwZW9mIGxpc3QgPT09ICdvYmplY3QnKSB7XG4gICAgT2JqZWN0LmtleXMobGlzdCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgdGVzdGVyID0gbGlzdFtrZXldO1xuICAgICAgaWYgKHRlc3Rlcikge1xuICAgICAgICBpZiAodHlwZW9mIHRlc3RlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAodWEuaW5kZXhPZih0ZXN0ZXIpID4gLTEpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRlc3RlcikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXG4gICAgICAgICkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IHVhLm1hdGNoKHRlc3Rlcik7XG4gICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlc3RlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICh0ZXN0ZXIodWEsIGNvbmYpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHRlc3Rlcih1YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVhTWF0Y2g7XG4iLCJ2YXIgaXNTdXBwb3J0V2VicCA9IG51bGw7XG5cbi8qKlxuICog5Yik5pat5rWP6KeI5Zmo5piv5ZCm5pSv5oyBd2VicFxuICogQG1ldGhvZCBlbnYvd2VicFxuICogQHJldHVybnMge0Jvb2xlYW59IOaYr+WQpuaUr+aMgXdlYnBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHdlYnAgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Vudi93ZWJwJyk7XG4gKiBjb25zb2xlLmluZm8oJHdlYnAoKSk7IC8vIHRydWUvZmFsc2VcbiAqL1xuXG4vKipcbiAqIOWIpOaWrea1j+iniOWZqOaYr+WQpuaUr+aMgXdlYnBcbiAqIEBtZXRob2QgZW52L3dlYnAuc3VwcG9ydFxuICogQG1lbWJlcm9mIGVudi93ZWJwXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0g5piv5ZCm5pSv5oyBd2VicFxuICogQGV4YW1wbGVcbiAqIHZhciAkd2VicCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZW52L3dlYnAnKTtcbiAqIGNvbnNvbGUuaW5mbygkd2VicC5zdXBwb3J0KCkpOyAvLyB0cnVlL2ZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN1cHBvcnQoKSB7XG4gIHZhciBycyA9ICEhW10ubWFwXG4gICAgJiYgZG9jdW1lbnRcbiAgICAgIC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICAgICAgLnRvRGF0YVVSTCgnaW1hZ2Uvd2VicCcpXG4gICAgICAuaW5kZXhPZignZGF0YTppbWFnZS93ZWJwJykgPT09IDA7XG4gIHJldHVybiBycztcbn1cblxuZnVuY3Rpb24gd2VicCgpIHtcbiAgaWYgKGlzU3VwcG9ydFdlYnAgPT09IG51bGwpIHtcbiAgICBpc1N1cHBvcnRXZWJwID0gc3VwcG9ydCgpO1xuICB9XG4gIHJldHVybiBpc1N1cHBvcnRXZWJwO1xufVxuXG53ZWJwLnN1cHBvcnQgPSBzdXBwb3J0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdlYnA7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuLyoqXG4gKiBBIG1vZHVsZSB0aGF0IGNhbiBiZSBtaXhlZCBpbiB0byAqYW55IG9iamVjdCogaW4gb3JkZXIgdG8gcHJvdmlkZSBpdFxuICogd2l0aCBjdXN0b20gZXZlbnRzLiBZb3UgbWF5IGJpbmQgd2l0aCBgb25gIG9yIHJlbW92ZSB3aXRoIGBvZmZgIGNhbGxiYWNrXG4gKiBmdW5jdGlvbnMgdG8gYW4gZXZlbnQ7IGB0cmlnZ2VyYC1pbmcgYW4gZXZlbnQgZmlyZXMgYWxsIGNhbGxiYWNrcyBpblxuICogc3VjY2Vzc2lvbi5cbiAqIC0g5LiA5Liq5Y+v5Lul6KKr5re35ZCI5Yiw5Lu75L2V5a+56LGh55qE5qih5Z2X77yM55So5LqO5o+Q5L6b6Ieq5a6a5LmJ5LqL5Lu244CCXG4gKiAtIOWPr+S7peeUqCBvbiwgb2ZmIOaWueazleadpee7keWumuenu+mZpOS6i+S7tuOAglxuICogLSDnlKggdHJpZ2dlciDmnaXop6blj5Hkuovku7bpgJrnn6XjgIJcbiAqIEBjbGFzcyBldnQvRXZlbnRzXG4gKiBAc2VlIFttaXR0XShodHRwczovL2dpdGh1Yi5jb20vZGV2ZWxvcGl0L21pdHQpXG4gKiBAc2VlIFthcmFsZWpzXShodHRwOi8vYXJhbGVqcy5vcmcvKVxuICogQHNlZSBbYmFja2JvbmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9kb2N1bWVudGNsb3VkL2JhY2tib25lL2Jsb2IvbWFzdGVyL2JhY2tib25lLmpzKVxuICogQHNlZSBbZXZlbnRzXShodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvYmxvYi9tYXN0ZXIvbGliL2V2ZW50cy5qcylcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGV2ZW50cyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKiBldnQub24oJ2FjdGlvbicsIGZ1bmN0aW9uKCkge1xuICogICBjb25zb2xlLmluZm8oJ2FjdGlvbiB0cmlnZ2VyZWQnKTtcbiAqIH0pO1xuICogZXZ0LnRyaWdnZXIoJ2FjdGlvbicpO1xuICovXG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIHNwbGl0IGV2ZW50IHN0cmluZ3NcbnZhciBldmVudFNwbGl0dGVyID0gL1xccysvO1xuXG52YXIgRXZlbnRzID0gZnVuY3Rpb24gKCkge307XG5cbi8qKlxuICogQmluZCBvbmUgb3IgbW9yZSBzcGFjZSBzZXBhcmF0ZWQgZXZlbnRzLCBgZXZlbnRzYCwgdG8gYSBgY2FsbGJhY2tgXG4gKiBmdW5jdGlvbi4gUGFzc2luZyBgXCJhbGxcImAgd2lsbCBiaW5kIHRoZSBjYWxsYmFjayB0byBhbGwgZXZlbnRzIGZpcmVkLlxuICogLSDnu5HlrprkuIDkuKrkuovku7blm57osIPlh73mlbDvvIzmiJbogIXnlKjlpJrkuKrnqbrmoLzliIbpmpTmnaXnu5HlrprlpJrkuKrkuovku7blm57osIPlh73mlbDjgIJcbiAqIC0g5Lyg5YWl5Y+C5pWwIGAnYWxsJ2Ag5Lya5Zyo5omA5pyJ5LqL5Lu25Y+R55Sf5pe26KKr6Kem5Y+R44CCXG4gKiBAbWV0aG9kIEV2ZW50cyNvblxuICogQG1lbWJlcm9mIGV2dC9FdmVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHMg5LqL5Lu25ZCN56ewXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayDkuovku7blm57osIPlh73mlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0g5Zue6LCD5Ye95pWw55qE5omn6KGM546v5aKD5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRldmVudHMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIHZhciBldnQgPSBuZXcgJGV2ZW50cygpO1xuICpcbiAqIC8vIOe7keWumjHkuKrkuovku7ZcbiAqIGV2dC5vbignZXZlbnQtbmFtZScsIGZ1bmN0aW9uICgpIHt9KTtcbiAqXG4gKiAvLyDnu5Hlrpoy5Liq5LqL5Lu2XG4gKiBldnQub24oJ2V2ZW50MSBldmVudDInLCBmdW5jdGlvbiAoKSB7fSk7XG4gKlxuICogLy8g57uR5a6a5Li65omA5pyJ5LqL5Lu2XG4gKiBldnQub24oJ2FsbCcsIGZ1bmN0aW9uICgpIHt9KTtcbiAqL1xuXG5FdmVudHMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50cywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgdmFyIGNhY2hlO1xuICB2YXIgZXZlbnQ7XG4gIHZhciBsaXN0O1xuICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjYWNoZSA9IHRoaXMuX19ldmVudHMgfHwgKHRoaXMuX19ldmVudHMgPSB7fSk7XG4gIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcblxuICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICB3aGlsZSAoZXZlbnQpIHtcbiAgICBsaXN0ID0gY2FjaGVbZXZlbnRdIHx8IChjYWNoZVtldmVudF0gPSBbXSk7XG4gICAgbGlzdC5wdXNoKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICBldmVudCA9IGV2ZW50cy5zaGlmdCgpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBvbmUgb3IgbWFueSBjYWxsYmFja3MuIElmIGBjb250ZXh0YCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3NcbiAqIHdpdGggdGhhdCBmdW5jdGlvbi4gSWYgYGNhbGxiYWNrYCBpcyBudWxsLCByZW1vdmVzIGFsbCBjYWxsYmFja3MgZm9yIHRoZVxuICogZXZlbnQuIElmIGBldmVudHNgIGlzIG51bGwsIHJlbW92ZXMgYWxsIGJvdW5kIGNhbGxiYWNrcyBmb3IgYWxsIGV2ZW50cy5cbiAqIC0g56e76Zmk5LiA5Liq5oiW6ICF5aSa5Liq5LqL5Lu25Zue6LCD5Ye95pWw44CCXG4gKiAtIOWmguaenOS4jeS8oOmAkiBjYWxsYmFjayDlj4LmlbDvvIzkvJrnp7vpmaTmiYDmnInor6Xml7bpl7TlkI3np7DnmoTkuovku7blm57osIPlh73mlbDjgIJcbiAqIC0g5aaC5p6c5LiN5oyH5a6a5LqL5Lu25ZCN56ew77yM56e76Zmk5omA5pyJ6Ieq5a6a5LmJ5LqL5Lu25Zue6LCD5Ye95pWw44CCXG4gKiBAbWV0aG9kIEV2ZW50cyNvZmZcbiAqIEBtZW1iZXJvZiBldnQvRXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gW2V2ZW50c10g5LqL5Lu25ZCN56ewXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIOimgeenu+mZpOeahOS6i+S7tuWbnuiwg+WHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSDopoHnp7vpmaTnmoTlm57osIPlh73mlbDnmoTmiafooYznjq/looPlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGV2ZW50cyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L2V2ZW50cycpO1xuICogdmFyIGV2dCA9IG5ldyAkZXZlbnRzKCk7XG4gKiB2YXIgYm91bmQgPSB7fTtcbiAqIGJvdW5kLnRlc3QgPSBmdW5jdGlvbiAoKSB7fTtcbiAqXG4gKiAvLyDnp7vpmaTkuovku7blkI3kuLogZXZlbnQtbmFtZSDnmoTkuovku7blm57osIPlh73mlbAgYm91bmQudGVzdFxuICogZXZ0Lm9mZignZXZlbnQtbmFtZScsIGJvdW5kLnRlc3QpO1xuICpcbiAqIC8vIOenu+mZpOS6i+S7tuWQjeS4uiAnZXZlbnQnIOeahOaJgOacieS6i+S7tuWbnuiwg+WHveaVsFxuICogZXZ0Lm9mZignZXZlbnQnKTtcbiAqXG4gKiAvLyDnp7vpmaTmiYDmnInoh6rlrprkuYnkuovku7ZcbiAqIGV2dC5vZmYoKTtcbiAqL1xuXG5FdmVudHMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIHZhciBjYWNoZTtcbiAgdmFyIGV2ZW50O1xuICB2YXIgbGlzdDtcbiAgdmFyIGk7XG5cbiAgLy8gTm8gZXZlbnRzLCBvciByZW1vdmluZyAqYWxsKiBldmVudHMuXG4gIGNhY2hlID0gdGhpcy5fX2V2ZW50cztcbiAgaWYgKCFjYWNoZSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGlmICghKGV2ZW50cyB8fCBjYWxsYmFjayB8fCBjb250ZXh0KSkge1xuICAgIGRlbGV0ZSB0aGlzLl9fZXZlbnRzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZXZlbnRzID0gZXZlbnRzID8gZXZlbnRzLnNwbGl0KGV2ZW50U3BsaXR0ZXIpIDogT2JqZWN0LmtleXMoY2FjaGUpO1xuXG4gIC8vIExvb3AgdGhyb3VnaCB0aGUgY2FsbGJhY2sgbGlzdCwgc3BsaWNpbmcgd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGZvciAoZXZlbnQgPSBldmVudHMuc2hpZnQoKTsgZXZlbnQ7IGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCkpIHtcbiAgICBsaXN0ID0gY2FjaGVbZXZlbnRdO1xuICAgIGlmICghbGlzdCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKCEoY2FsbGJhY2sgfHwgY29udGV4dCkpIHtcbiAgICAgIGRlbGV0ZSBjYWNoZVtldmVudF07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDI7IGkgPj0gMDsgaSAtPSAyKSB7XG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgKGNhbGxiYWNrICYmIGxpc3RbaV0gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIHx8IChjb250ZXh0ICYmIGxpc3RbaSArIDFdICE9PSBjb250ZXh0KVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbGlzdC5zcGxpY2UoaSwgMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgb25lIG9yIG1hbnkgZXZlbnRzLCBmaXJpbmcgYWxsIGJvdW5kIGNhbGxiYWNrcy4gQ2FsbGJhY2tzIGFyZVxuICogcGFzc2VkIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyBgdHJpZ2dlcmAgaXMsIGFwYXJ0IGZyb20gdGhlIGV2ZW50IG5hbWVcbiAqICh1bmxlc3MgeW91J3JlIGxpc3RlbmluZyBvbiBgXCJhbGxcImAsIHdoaWNoIHdpbGwgY2F1c2UgeW91ciBjYWxsYmFjayB0b1xuICogcmVjZWl2ZSB0aGUgdHJ1ZSBuYW1lIG9mIHRoZSBldmVudCBhcyB0aGUgZmlyc3QgYXJndW1lbnQpLlxuICogLSDmtL7lj5HkuIDkuKrmiJbogIXlpJrkuKrkuovku7bvvIzkvJrop6blj5Hlr7nlupTkuovku7blkI3np7Dnu5HlrprnmoTmiYDmnInkuovku7blh73mlbDjgIJcbiAqIC0g56ys5LiA5Liq5Y+C5pWw5piv5LqL5Lu25ZCN56ew77yM5Ymp5LiL5YW25LuW5Y+C5pWw5bCG5L2c5Li65LqL5Lu25Zue6LCD55qE5Y+C5pWw44CCXG4gKiBAbWV0aG9kIEV2ZW50cyN0cmlnZ2VyXG4gKiBAbWVtYmVyb2YgZXZ0L0V2ZW50c1xuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50cyDkuovku7blkI3np7BcbiAqIEBwYXJhbSB7Li4uKn0gW2FyZ10g5LqL5Lu25Y+C5pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRldmVudHMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dC9ldmVudHMnKTtcbiAqIHZhciBldnQgPSBuZXcgJGV2ZW50cygpO1xuICpcbiAqIC8vIOinpuWPkeS6i+S7tuWQjeS4uiAnZXZlbnQtbmFtZScg55qE5LqL5Lu2XG4gKiBldnQudHJpZ2dlcignZXZlbnQtbmFtZScpO1xuICpcbiAqIC8vIOWQjOaXtuinpuWPkTLkuKrkuovku7ZcbiAqIGV2dC50cmlnZ2VyKCdldmVudDEgZXZlbnQyJyk7XG4gKlxuICogLy8g6Kem5Y+R5LqL5Lu25ZCM5pe25Lyg6YCS5Y+C5pWwXG4gKiBldnQub24oJ2V2ZW50LXgnLCBmdW5jdGlvbiAoYSwgYikge1xuICogICBjb25zb2xlLmluZm8oYSwgYik7IC8vIDEsIDJcbiAqIH0pO1xuICogZXZ0LnRyaWdnZXIoJ2V2ZW50LXgnLCAxLCAyKTtcbiAqL1xuRXZlbnRzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50cykge1xuICB2YXIgY2FjaGU7XG4gIHZhciBldmVudDtcbiAgdmFyIGFsbDtcbiAgdmFyIGxpc3Q7XG4gIHZhciBpO1xuICB2YXIgbGVuO1xuICB2YXIgcmVzdCA9IFtdO1xuICB2YXIgYXJncztcblxuICBjYWNoZSA9IHRoaXMuX19ldmVudHM7XG4gIGlmICghY2FjaGUpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChldmVudFNwbGl0dGVyKTtcblxuICAvLyBGaWxsIHVwIGByZXN0YCB3aXRoIHRoZSBjYWxsYmFjayBhcmd1bWVudHMuICBTaW5jZSB3ZSdyZSBvbmx5IGNvcHlpbmdcbiAgLy8gdGhlIHRhaWwgb2YgYGFyZ3VtZW50c2AsIGEgbG9vcCBpcyBtdWNoIGZhc3RlciB0aGFuIEFycmF5I3NsaWNlLlxuICBmb3IgKGkgPSAxLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICByZXN0W2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgfVxuXG4gIC8vIEZvciBlYWNoIGV2ZW50LCB3YWxrIHRocm91Z2ggdGhlIGxpc3Qgb2YgY2FsbGJhY2tzIHR3aWNlLCBmaXJzdCB0b1xuICAvLyB0cmlnZ2VyIHRoZSBldmVudCwgdGhlbiB0byB0cmlnZ2VyIGFueSBgXCJhbGxcImAgY2FsbGJhY2tzLlxuICBmb3IgKGV2ZW50ID0gZXZlbnRzLnNoaWZ0KCk7IGV2ZW50OyBldmVudCA9IGV2ZW50cy5zaGlmdCgpKSB7XG4gICAgLy8gQ29weSBjYWxsYmFjayBsaXN0cyB0byBwcmV2ZW50IG1vZGlmaWNhdGlvbi5cbiAgICBhbGwgPSBjYWNoZS5hbGw7XG4gICAgaWYgKGFsbCkge1xuICAgICAgYWxsID0gYWxsLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgbGlzdCA9IGNhY2hlW2V2ZW50XTtcbiAgICBpZiAobGlzdCkge1xuICAgICAgbGlzdCA9IGxpc3Quc2xpY2UoKTtcbiAgICB9XG5cbiAgICAvLyBFeGVjdXRlIGV2ZW50IGNhbGxiYWNrcy5cbiAgICBpZiAobGlzdCkge1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICBsaXN0W2ldLmFwcGx5KGxpc3RbaSArIDFdIHx8IHRoaXMsIHJlc3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV4ZWN1dGUgXCJhbGxcIiBjYWxsYmFja3MuXG4gICAgaWYgKGFsbCkge1xuICAgICAgYXJncyA9IFtldmVudF0uY29uY2F0KHJlc3QpO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gYWxsLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgIGFsbFtpXS5hcHBseShhbGxbaSArIDFdIHx8IHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNaXggYEV2ZW50c2AgdG8gb2JqZWN0IGluc3RhbmNlIG9yIENsYXNzIGZ1bmN0aW9uLlxuICogLSDlsIboh6rlrprkuovku7blr7nosaHvvIzmt7flkIjliLDkuIDkuKrnsbvnmoTlrp7kvovjgIJcbiAqIEBtZXRob2QgRXZlbnRzLm1peFRvXG4gKiBAbWVtYmVyb2YgZXZ0L0V2ZW50c1xuICogQHBhcmFtIHtPYmplY3R9IHJlY2VpdmVyIOimgea3t+WQiOS6i+S7tuWHveaVsOeahOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkZXZlbnRzID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnQvZXZlbnRzJyk7XG4gKiAvLyDnu5nkuIDkuKrlrp7kvovmt7flkIjoh6rlrprkuYnkuovku7bmlrnms5VcbiAqIHZhciBvYmogPSB7fTtcbiAqICRldmVudHMubWl4VG8ob2JqKTtcbiAqXG4gKiAvLyDnlJ/miJDkuIDkuKrlrp7kvotcbiAqIHZhciBvMSA9IE9iamVjdC5jcmVhdGUob2JqKTtcbiAqXG4gKiAvLyDlj6/ku6XlnKjov5nkuKrlr7nosaHkuIrosIPnlKjoh6rlrprkuYnkuovku7bnmoTmlrnms5XkuoZcbiAqIG8xLm9uKCdldmVudCcsIGZ1bmN0aW9uICgpIHt9KTtcbiAqL1xuRXZlbnRzLm1peFRvID0gZnVuY3Rpb24gKHJlY2VpdmVyKSB7XG4gIHJlY2VpdmVyID0gcmVjZWl2ZXIucHJvdG90eXBlIHx8IHJlY2VpdmVyO1xuICB2YXIgcHJvdG8gPSBFdmVudHMucHJvdG90eXBlO1xuXG4gIGZvciAodmFyIHAgaW4gcHJvdG8pIHtcbiAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIHJlY2VpdmVyW3BdID0gcHJvdG9bcF07XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50cztcbiIsIi8qKlxuICog5aSE55CG5LqL5Lu25LiO5bm/5pKtXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnRcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2V2dFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmV2dC5vY2N1ckluc2lkZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0XG4gKiB2YXIgJGV2dCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGV2dC5vY2N1ckluc2lkZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJG9jY3VySW5zaWRlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9ldnQvb2NjdXJJbnNpZGUnKTtcbiAqL1xuXG5leHBvcnRzLkV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG5leHBvcnRzLkxpc3RlbmVyID0gcmVxdWlyZSgnLi9saXN0ZW5lcicpO1xuZXhwb3J0cy5vY2N1ckluc2lkZSA9IHJlcXVpcmUoJy4vb2NjdXJJbnNpZGUnKTtcbmV4cG9ydHMudGFwU3RvcCA9IHJlcXVpcmUoJy4vdGFwU3RvcCcpO1xuIiwiLyoqXG4gKiDlub/mkq3nu4Tku7ZcbiAqIC0g5p6E6YCg5a6e5L6L5pe277yM6ZyA6KaB5Lyg5YWl5LqL5Lu255m95ZCN5Y2V5YiX6KGo44CCXG4gKiAtIOWPquacieWcqOeZveWQjeWNleWIl+ihqOS4iueahOS6i+S7tuaJjeWPr+S7peiiq+inpuWPkeOAglxuICogLSDkuovku7bmt7vliqDvvIznp7vpmaTvvIzmv4Dlj5HnmoTosIPnlKjmlrnms5Xlj4LogIMgRXZlbnRz44CCXG4gKiBAc2VlIFtldnQvRXZlbnRzXSgjZXZ0LWV2ZW50cylcbiAqIEBjbGFzcyBldnQvTGlzdGVuZXJcbiAqIEBleGFtcGxlXG4gKiBAZXhhbXBsZVxuICogdmFyICRsaXN0ZW5lciA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZXZ0L2xpc3RlbmVyJyk7XG4gKlxuICogLy8g55m95ZCN5Y2V6YeM5Y+q6K6w5b2V5LqGIGV2ZW50MSDkuovku7ZcbiAqIHZhciBjaGFubmVsR2xvYmFsID0gbmV3ICRsaXN0ZW5lcihbXG4gKiAgICdldmVudDEnXG4gKiBdKTtcbiAqIGNoYW5uZWxHbG9iYWwub24oJ2V2ZW50MScsIGZ1bmN0aW9uKCl7XG4gKiAgIGNvbnNvbGUubG9nKCdldmVudDEnKTtcbiAqIH0pO1xuICogY2hhbm5lbEdsb2JhbC5vbignZXZlbnQyJywgZnVuY3Rpb24oKXtcbiAqICAgLy8gd2lsbCBub3QgcnVuXG4gKiAgIGNvbnNvbGUubG9nKCdldmVudDInKTtcbiAqIH0pO1xuICogY2hhbm5lbEdsb2JhbC50cmlnZ2VyKCdldmVudDEnKTtcbiAqIGNoYW5uZWxHbG9iYWwudHJpZ2dlcignZXZlbnQyJyk7XG4gKi9cblxudmFyICRldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xuXG52YXIgTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnRzKSB7XG4gIHRoaXMucHJpdmF0ZVdoaXRlTGlzdCA9IHt9O1xuICB0aGlzLnByaXZhdGVSZWNlaXZlciA9IG5ldyAkZXZlbnRzKCk7XG4gIGlmIChBcnJheS5pc0FycmF5KGV2ZW50cykpIHtcbiAgICBldmVudHMuZm9yRWFjaCh0aGlzLmRlZmluZS5iaW5kKHRoaXMpKTtcbiAgfVxufTtcblxuTGlzdGVuZXIucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogTGlzdGVuZXIsXG4gIC8qKlxuICAgKiDlnKjnmb3lkI3ljZXkuIrlrprkuYnkuIDkuKrkuovku7blkI3np7BcbiAgICogQG1ldGhvZCBMaXN0ZW5lciNkZWZpbmVcbiAgICogQG1lbWJlcm9mIGV2dC9MaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAqL1xuICBkZWZpbmU6IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICB0aGlzLnByaXZhdGVXaGl0ZUxpc3RbZXZlbnROYW1lXSA9IHRydWU7XG4gIH0sXG4gIC8qKlxuICAgKiDnp7vpmaTnmb3lkI3ljZXkuIrlrprkuYnnmoTkuovku7blkI3np7BcbiAgICogQG1ldGhvZCBMaXN0ZW5lciN1bmRlZmluZVxuICAgKiBAbWVtYmVyb2YgZXZ0L0xpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICovXG4gIHVuZGVmaW5lOiBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMucHJpdmF0ZVdoaXRlTGlzdFtldmVudE5hbWVdO1xuICB9LFxuICAvKipcbiAgICog5bm/5pKt57uE5Lu257uR5a6a5LqL5Lu2XG4gICAqIEBzZWUgW0V2ZW50cyNvbl0oI2V2ZW50cy1vbilcbiAgICogQG1ldGhvZCBMaXN0ZW5lciNvblxuICAgKiBAbWVtYmVyb2YgZXZ0L0xpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUg6KaB57uR5a6a55qE5LqL5Lu25ZCN56ewXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgee7keWumueahOS6i+S7tuWbnuiwg+WHveaVsFxuICAgKi9cbiAgb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByaXZhdGVSZWNlaXZlci5vbi5hcHBseSh0aGlzLnByaXZhdGVSZWNlaXZlciwgYXJndW1lbnRzKTtcbiAgfSxcbiAgLyoqXG4gICAqIOW5v+aSree7hOS7tuenu+mZpOS6i+S7tlxuICAgKiBAc2VlIFtFdmVudHMjb2ZmXSgjZXZlbnRzLW9mZilcbiAgICogQG1ldGhvZCBMaXN0ZW5lciNvZmZcbiAgICogQG1lbWJlcm9mIGV2dC9MaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIOimgeenu+mZpOe7keWumueahOS6i+S7tuWQjeensFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHnp7vpmaTnu5HlrprnmoTkuovku7blm57osIPlh73mlbBcbiAgICovXG4gIG9mZjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJpdmF0ZVJlY2VpdmVyLm9mZi5hcHBseSh0aGlzLnByaXZhdGVSZWNlaXZlciwgYXJndW1lbnRzKTtcbiAgfSxcbiAgLyoqXG4gICAqIOW5v+aSree7hOS7tua0vuWPkeS6i+S7tlxuICAgKiBAc2VlIFtFdmVudHMjdHJpZ2dlcl0oI2V2ZW50cy10cmlnZ2VyKVxuICAgKiBAbWV0aG9kIExpc3RlbmVyI3RyaWdnZXJcbiAgICogQG1lbWJlcm9mIGV2dC9MaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensFxuICAgKiBAcGFyYW0gey4uLip9IFthcmddIOS6i+S7tuWPguaVsFxuICAgKi9cbiAgdHJpZ2dlcjogZnVuY3Rpb24gKGV2ZW50cykge1xuICAgIHZhciByZXN0ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgLy8g5oyJ54WnRXZlbnRzLnRyaWdnZXLnmoTosIPnlKjmlrnlvI/vvIznrKzkuIDkuKrlj4LmlbDmmK/nlKjnqbrmoLzliIbpmpTnmoTkuovku7blkI3np7DliJfooahcbiAgICBldmVudHMgPSBldmVudHMuc3BsaXQoL1xccysvKTtcblxuICAgIC8vIOmBjeWOhuS6i+S7tuWIl+ihqO+8jOS+neaNrueZveWQjeWNleWGs+WumuS6i+S7tuaYr+WQpua/gOWPkVxuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldnROYW1lKSB7XG4gICAgICBpZiAodGhpcy5wcml2YXRlV2hpdGVMaXN0W2V2dE5hbWVdKSB7XG4gICAgICAgIHRoaXMucHJpdmF0ZVJlY2VpdmVyLnRyaWdnZXIuYXBwbHkodGhpcy5wcml2YXRlUmVjZWl2ZXIsIFtldnROYW1lXS5jb25jYXQocmVzdCkpO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RlbmVyO1xuIiwiLyoqXG4gKiDliKTmlq3kuovku7bmmK/lkKblj5HnlJ/lnKjkuIDkuKogRG9tIOWFg+e0oOWGheOAglxuICogLSDluLjnlKjkuo7liKTmlq3ngrnlh7vkuovku7blj5HnlJ/lnKjmta7lsYLlpJbml7blhbPpl63mta7lsYLjgIJcbiAqIEBtZXRob2QgZXZ0L29jY3VySW5zaWRlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQg5rWP6KeI5Zmo5LqL5Lu25a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZSDnlKjkuo7mr5TovoPkuovku7blj5HnlJ/ljLrln5/nmoQgRG9tIOWvueixoVxuICogQHJldHVybnMge0Jvb2xlYW59IOS6i+S7tuaYr+WQpuWPkeeUn+WcqCBub2RlIOWGhVxuICogQGV4YW1wbGVcbiAqIHZhciAkb2NjdXJJbnNpZGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dC9vY2N1ckluc2lkZScpO1xuICogJCgnLmxheWVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KXtcbiAqICAgaWYoJG9jY3VySW5zaWRlKGV2dCwgJCh0aGlzKS5maW5kKCdjbG9zZScpLmdldCgwKSkpe1xuICogICAgICQodGhpcykuaGlkZSgpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG5mdW5jdGlvbiBvY2N1ckluc2lkZShldmVudCwgbm9kZSkge1xuICBpZiAobm9kZSAmJiBldmVudCAmJiBldmVudC50YXJnZXQpIHtcbiAgICB2YXIgcG9zID0gZXZlbnQudGFyZ2V0O1xuICAgIHdoaWxlIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPT09IG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBwb3MgPSBwb3MucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9jY3VySW5zaWRlO1xuIiwiLyoqXG4gKiDnlKjpga7nvannmoTmlrnlvI/pmLvmraIgdGFwIOS6i+S7tuepv+mAj+W8leWPkeihqOWNleWFg+e0oOiOt+WPlueEpueCueOAglxuICogLSDmjqjojZDnlKggZmFzdGNsaWNrIOadpeino+WGs+inpuWxj+S6i+S7tuepv+mAj+mXrumimOOAglxuICogLSDmraTnu4Tku7bnlKjlnKggZmFzdGNsaWNrIOacquiDveino+WGs+mXrumimOaXtuOAguaIluiAheS4jeaWueS+v+S9v+eUqCBmYXN0Y2xpY2sg5pe244CCXG4gKiBAbWV0aG9kIGV2dC90YXBTdG9wXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDngrnlh7vpgInpoblcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmRlbGF5IOS4tOaXtua1ruWxguWcqOi/meS4quW7tui/n+aXtumXtChtcynkuYvlkI7lhbPpl61cbiAqIEBleGFtcGxlXG4gKiB2YXIgJHRhcFN0b3AgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2V2dC90YXBTdG9wJyk7XG4gKiAkKCcubWFzaycpLm9uKCd0YXAnLCBmdW5jdGlvbigpe1xuICogICAkdGFwU3RvcCgpO1xuICogICAkKHRoaXMpLmhpZGUoKTtcbiAqIH0pO1xuICovXG52YXIgbWluaU1hc2sgPSBudWxsO1xudmFyIHBvcyA9IHt9O1xudmFyIHRpbWVyID0gbnVsbDtcbnZhciB0b3VjaFN0YXJ0Qm91bmQgPSBmYWxzZTtcblxudmFyIHRhcFN0b3AgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgJCA9IHdpbmRvdy4kIHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5O1xuXG4gIHZhciBjb25mID0gJC5leHRlbmQoe1xuICAgIC8vIOmBrue9qeWtmOWcqOaXtumXtFxuICAgIGRlbGF5OiA1MDAsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIGlmICghbWluaU1hc2spIHtcbiAgICBtaW5pTWFzayA9ICQoJzxkaXYgY2xhc3M9XCJ0YXAtc3RvcC1tYXNrXCI+PC9kaXY+Jyk7XG4gICAgbWluaU1hc2suY3NzKHtcbiAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgICdtYXJnaW4tbGVmdCc6ICctMjBweCcsXG4gICAgICAnbWFyZ2luLXRvcCc6ICctMjBweCcsXG4gICAgICAnei1pbmRleCc6IDEwMDAwLFxuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICB3aWR0aDogJzQwcHgnLFxuICAgICAgaGVpZ2h0OiAnNDBweCcsXG4gICAgfSkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gIH1cblxuICBpZiAoIXRvdWNoU3RhcnRCb3VuZCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKCEoZXZ0ICYmIGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHRvdWNoID0gZXZ0LnRvdWNoZXNbMF07XG4gICAgICBwb3MucGFnZVggPSB0b3VjaC5wYWdlWDtcbiAgICAgIHBvcy5wYWdlWSA9IHRvdWNoLnBhZ2VZO1xuICAgIH0pO1xuICAgIHRvdWNoU3RhcnRCb3VuZCA9IHRydWU7XG4gIH1cblxuICB2YXIgZGVsYXkgPSBwYXJzZUludChjb25mLmRlbGF5LCAxMCkgfHwgMDtcbiAgbWluaU1hc2suc2hvdygpLmNzcyh7XG4gICAgbGVmdDogcG9zLnBhZ2VYICsgJ3B4JyxcbiAgICB0b3A6IHBvcy5wYWdlWSArICdweCcsXG4gIH0pO1xuICBjbGVhclRpbWVvdXQodGltZXIpO1xuICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIG1pbmlNYXNrLmhpZGUoKTtcbiAgfSwgZGVsYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0YXBTdG9wO1xuIiwiLyoqXG4gKiDljIXoo4XkuLrlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIC0g55So5LqO5aSE55CG5a+G6ZuG5LqL5Lu277yM5bu26L+f5pe26Ze05YaF5ZCM5pe26Kem5Y+R55qE5Ye95pWw6LCD55So44CCXG4gKiAtIOacgOe7iOWPquWcqOacgOWQjuS4gOasoeiwg+eUqOW7tui/n+WQju+8jOaJp+ihjOS4gOasoeOAglxuICogQG1ldGhvZCBmbi9kZWxheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24g5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoR0aGlz5oyH5ZCRXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IOe7j+i/h+WMheijheeahOW7tui/n+inpuWPkeWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkZGVsYXkgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2ZuL2RlbGF5Jyk7XG4gKiB2YXIgY29tcCA9IHtcbiAqICAgY291bnRXb3JkcyA6IGZ1bmN0aW9uKCl7XG4gKiAgICAgY29uc29sZS5pbmZvKHRoaXMubGVuZ3RoKTtcbiAqICAgfVxuICogfTtcbiAqXG4gKiAgLy8g55av54uC54K55Ye7IGlucHV0IO+8jOWBnOS4i+adpSA1MDAgbXMg5ZCO77yM6Kem5Y+R5Ye95pWw6LCD55SoXG4gKiAkKCcjaW5wdXQnKS5rZXlkb3duKCRkZWxheShmdW5jdGlvbigpe1xuICogICB0aGlzLmxlbmd0aCA9ICQoJyNpbnB1dCcpLnZhbCgpLmxlbmd0aDtcbiAqICAgdGhpcy5jb3VudFdvcmRzKCk7XG4gKiB9LCA1MDAsIGNvbXApKTtcbiAqL1xuXG5mdW5jdGlvbiBkZWxheShmbiwgZHVyYXRpb24sIGJpbmQpIHtcbiAgdmFyIHRpbWVyID0gbnVsbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBiaW5kID0gYmluZCB8fCB0aGlzO1xuICAgIGlmICh0aW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm4uYXBwbHkoYmluZCwgYXJncyk7XG4gICAgICB9XG4gICAgfSwgZHVyYXRpb24pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGF5O1xuIiwiLyoqXG4gKiDlh73mlbDljIXoo4XvvIzojrflj5bnibnmrormiafooYzmlrnlvI9cbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2ZuXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9mblxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmZuLmRlbGF5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mblxuICogdmFyICRmbiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZm4nKTtcbiAqIGNvbnNvbGUuaW5mbygkZm4uZGVsYXkpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRkZWxheSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZm4vZGVsYXknKTtcbiAqL1xuXG5leHBvcnRzLmRlbGF5ID0gcmVxdWlyZSgnLi9kZWxheScpO1xuZXhwb3J0cy5sb2NrID0gcmVxdWlyZSgnLi9sb2NrJyk7XG5leHBvcnRzLm5vb3AgPSByZXF1aXJlKCcuL25vb3AnKTtcbmV4cG9ydHMub25jZSA9IHJlcXVpcmUoJy4vb25jZScpO1xuZXhwb3J0cy5xdWV1ZSA9IHJlcXVpcmUoJy4vcXVldWUnKTtcbmV4cG9ydHMucHJlcGFyZSA9IHJlcXVpcmUoJy4vcHJlcGFyZScpO1xuZXhwb3J0cy5yZWd1bGFyID0gcmVxdWlyZSgnLi9yZWd1bGFyJyk7XG4iLCIvKipcbiAqIOWMheijheS4uuinpuWPkeS4gOasoeWQju+8jOmihOe9ruaXtumXtOWGheS4jeiDveWGjeasoeinpuWPkeeahOWHveaVsFxuICogLSDnsbvkvLzkuo7mioDog73lhrfljbTjgIJcbiAqIEBtZXRob2QgZm4vbG9ja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4g6KaB5bu26L+f6Kem5Y+R55qE5Ye95pWwXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsYXkg5bu26L+f5pe26Ze0KG1zKVxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g57uP6L+H5YyF6KOF55qE5Ya35Y206Kem5Y+R5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRsb2NrID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mbi9sb2NrJyk7XG4gKiB2YXIgcmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAqICAgY29uc29sZS5pbmZvKCdkbyByZXF1ZXN0Jyk7XG4gKiB9O1xuICogJCgnI2lucHV0Jykua2V5ZG93bigkbG9jayhyZXF1ZXN0LCA1MDApKTtcbiAqIC8vIOesrOS4gOasoeaMiemUru+8jOWwseS8muinpuWPkeS4gOasoeWHveaVsOiwg+eUqFxuICogLy8g5LmL5ZCO6L+e57ut5oyJ6ZSu77yM5LuF5ZyoIDUwMG1zIOe7k+adn+WQjuWGjeasoeaMiemUru+8jOaJjeS8muWGjeasoeinpuWPkSByZXF1ZXN0IOWHveaVsOiwg+eUqFxuICovXG5cbmZ1bmN0aW9uIGxvY2soZm4sIGRlbGF5LCBiaW5kKSB7XG4gIHZhciB0aW1lciA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9LCBkZWxheSk7XG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm4uYXBwbHkoYmluZCwgYXJncyk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvY2s7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHt9O1xuIiwiLyoqXG4gKiDljIXoo4XkuLrku4Xop6blj5HkuIDmrKHnmoTlh73mlbBcbiAqIC0g6KKr5YyF6KOF55qE5Ye95pWw5pm66IO95omn6KGM5LiA5qyh77yM5LmL5ZCO5LiN5Lya5YaN5omn6KGMXG4gKiBAbWV0aG9kIGZuL29uY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeW7tui/n+inpuWPkeeahOWHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IFtiaW5kXSDlh73mlbDnmoQgdGhpcyDmjIflkJFcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g6K+l5Ye95pWw5LuF6IO96Kem5Y+R5omn6KGM5LiA5qyhXG4gKiBAZXhhbXBsZVxuICogdmFyICRvbmNlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9mbi9vbmNlJyk7XG4gKiB2YXIgZm4gPSAkb25jZShmdW5jdGlvbiAoKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnb3V0cHV0Jyk7XG4gKiB9KTtcbiAqIGZuKCk7IC8vICdvdXRwdXQnXG4gKiBmbigpOyAvLyB3aWxsIGRvIG5vdGhpbmdcbiAqL1xuXG5mdW5jdGlvbiBvbmNlKGZuLCBiaW5kKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbi5hcHBseShiaW5kLCBhcmd1bWVudHMpO1xuICAgICAgZm4gPSBudWxsO1xuICAgICAgYmluZCA9IG51bGw7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIvKipcbiAqIOWMheijheS4uuS4gOS4quadoeS7tuinpuWPkeeuoeeQhuWZqFxuICogLSDosIPnlKjnrqHnkIblmajnmoQgcmVhZHkg5Ye95pWw5p2l5r+A5rS75p2h5Lu244CCXG4gKiAtIOS5i+WJjeaPkuWFpeeuoeeQhuWZqOeahOWHveaVsOaMiemYn+WIl+mhuuW6j+aJp+ihjOOAglxuICogLSDkuYvlkI7mj5LlhaXnrqHnkIblmajnmoTlh73mlbDnq4vljbPmiafooYzjgIJcbiAqIC0g5L2c55So5py65Yi257G75Ly8IGpRdWVyeS5yZWFkeSwg5Y+v5Lul6K6+572u5Lu75L2V5p2h5Lu244CCXG4gKiBAbW9kdWxlIGZuL3ByZXBhcmVcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0g5p2h5Lu26Kem5Y+R566h55CG5Zmo5Ye95pWw77yM5Lyg5YWl5LiA5LiqIGZ1bmN0aW9uIOS9nOS4uuS7u+WKoeaJp+ihjOWHveaVsOWPguaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkcHJlcGFyZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZm4vcHJlcGFyZScpO1xuICogLy8g55Sf5oiQ5LiA5Liq566h55CG5Zmo5Ye95pWwIHRpbWVSZWFkeVxuICogdmFyIHRpbWVSZWFkeSA9ICRwcmVwYXJlKCk7XG4gKlxuICogLy8g6K6+572u5p2h5Lu25Li6MuenkuWQjuWwsee7qlxuICogc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKiAgIHRpbWVSZWFkeS5yZWFkeSgpO1xuICogfSwgMjAwMCk7XG4gKlxuICogLy8g6LCD55So566h55CG5Zmo5Ye95pWwIHRpbWVSZWFkee+8jOaPkuWFpeimgeaJp+ihjOeahOS7u+WKoeWHveaVsFxuICogdGltZVJlYWR5KGZ1bmN0aW9uICgpIHtcbiAqICAgLy8gMiDnp5LlkI7ovpPlh7ogMVxuICogICBjb25zb2xlLmluZm8oMSk7XG4gKiB9KTtcbiAqXG4gKiAvLyDosIPnlKjnrqHnkIblmajlh73mlbAgdGltZVJlYWR577yM5o+S5YWl6KaB5omn6KGM55qE5Lu75Yqh5Ye95pWwXG4gKiB0aW1lUmVhZHkoZnVuY3Rpb24gKCkge1xuICogICAvLyAyIOenkuWQjui+k+WHuiAyXG4gKiAgIGNvbnNvbGUuaW5mbygyKTtcbiAqIH0pO1xuICpcbiAqIC8vIDIxMDBtcyDlkI7miafooYxcbiAqIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICogICAvLyDosIPnlKjnrqHnkIblmajlh73mlbAgdGltZVJlYWR577yM5o+S5YWl6KaB5omn6KGM55qE5Lu75Yqh5Ye95pWwXG4gKiAgIHRpbWVSZWFkeShmdW5jdGlvbiAoKSB7XG4gKiAgICAgLy8g56uL5Y2z5omn6KGM77yM6L6T5Ye6IDNcbiAqICAgICBjb25zb2xlLmluZm8oMyk7XG4gKiAgIH0pO1xuICogfSwgMjEwMCk7XG4gKi9cblxuLyoqXG4gKiDmv4DmtLvku7vliqHnrqHnkIblmajnmoTop6blj5HmnaHku7bvvIzlnKjmraTkuYvliY3mj5LlhaXnrqHnkIblmajnmoTku7vliqHmjInpmJ/liJfpobrluo/miafooYzvvIzkuYvlkI7mj5LlhaXnmoTku7vliqHlh73mlbDnq4vljbPmiafooYzjgIJcbiAqIEBtZXRob2QgcHJlcGFyZSNyZWFkeVxuICogQG1lbWJlcm9mIHByZXBhcmVcbiAqL1xuZnVuY3Rpb24gcHJlcGFyZSgpIHtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciBjb25kaXRpb24gPSBmYWxzZTtcbiAgdmFyIG1vZGVsO1xuXG4gIHZhciBhdHRhbXB0ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbihtb2RlbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgIH1cbiAgfTtcblxuICBhdHRhbXB0LnJlYWR5ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjb25kaXRpb24gPSB0cnVlO1xuICAgIG1vZGVsID0gZGF0YTtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoKSB7XG4gICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbihtb2RlbCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBhdHRhbXB0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByZXBhcmU7XG4iLCIvKipcbiAqIOWMheijheS4uuS4gOS4qumYn+WIl++8jOaMieiuvue9rueahOaXtumXtOmXtOmalOinpuWPkeS7u+WKoeWHveaVsFxuICogLSDmj5LlhaXpmJ/liJfnmoTmiYDmnInlh73mlbDpg73kvJrmiafooYzvvIzkvYbmr4/mrKHmiafooYzkuYvpl7Tpg73kvJrmnInkuIDkuKrlm7rlrprnmoTml7bpl7Tpl7TpmpTjgIJcbiAqIEBtZXRob2QgZm4vcXVldWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOimgeW7tui/n+inpuWPkeeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5IOW7tui/n+aXtumXtChtcylcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYmluZF0g5Ye95pWw55qEIHRoaXMg5oyH5ZCRXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IOe7j+i/h+WMheijheeahOmYn+WIl+inpuWPkeWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkcXVldWUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2ZuL3F1ZXVlJyk7XG4gKiB2YXIgdDEgPSBEYXRlLm5vdygpO1xuICogdmFyIGRvU29tdGhpbmcgPSAkcXVldWUoZnVuY3Rpb24gKGluZGV4KSB7XG4gKiAgIGNvbnNvbGUuaW5mbyhpbmRleCArICc6JyArIChEYXRlLm5vdygpIC0gdDEpKTtcbiAqIH0sIDIwMCk7XG4gKiAvLyDmr4/pmpQyMDBtc+i+k+WHuuS4gOS4quaXpeW/l+OAglxuICogZm9yKHZhciBpID0gMDsgaSA8IDEwOyBpKyspe1xuICogICBkb1NvbXRoaW5nKGkpO1xuICogfVxuICovXG5cbmZ1bmN0aW9uIHF1ZXVlKGZuLCBkZWxheSwgYmluZCkge1xuICB2YXIgdGltZXIgPSBudWxsO1xuICB2YXIgYXJyID0gW107XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICBhcnIucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdGltZXIpIHtcbiAgICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJyLnNoaWZ0KCkoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZGVsYXkpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWV1ZTtcbiIsIi8qKlxuICog5YyF6KOF5Li66KeE5b6L6Kem5Y+R55qE5Ye95pWw77yM55So5LqO6ZmN5L2O5a+G6ZuG5LqL5Lu255qE5aSE55CG6aKR546HXG4gKiAtIOWcqOeWr+eLguaTjeS9nOacn+mXtO+8jOaMieeFp+inhOW+i+aXtumXtOmXtOmalO+8jOadpeiwg+eUqOS7u+WKoeWHveaVsFxuICogQG1ldGhvZCBmbi9yZXF1bGFyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDopoHlu7bov5/op6blj5HnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSDlu7bov5/ml7bpl7QobXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW2JpbmRdIOWHveaVsOeahCB0aGlzIOaMh+WQkVxuICogQHJldHVybiB7RnVuY3Rpb259IOe7j+i/h+WMheijheeahOWumuaXtuinpuWPkeWHveaVsFxuICogQGV4YW1wbGVcbiAqIHZhciAkcmVndWxhciA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZm4vcmVndWxhcicpO1xuICogdmFyIGNvbXAgPSB7XG4gKiAgIGNvdW50V29yZHMgOiBmdW5jdGlvbigpe1xuICogICAgIGNvbnNvbGUuaW5mbyh0aGlzLmxlbmd0aCk7XG4gKiAgIH1cbiAqIH07XG4gKiAvLyDnlq/ni4LmjInplK7vvIzmr4/pmpQgMjAwbXMg5omN5pyJ5LiA5qyh5oyJ6ZSu5pyJ5pWIXG4gKiAkKCcjaW5wdXQnKS5rZXlkb3duKCRyZWd1bGFyKGZ1bmN0aW9uKCl7XG4gKiAgIHRoaXMubGVuZ3RoID0gJCgnI2lucHV0JykudmFsKCkubGVuZ3RoO1xuICogICB0aGlzLmNvdW50V29yZHMoKTtcbiAqIH0sIDIwMCwgY29tcCkpO1xuICovXG5cbmZ1bmN0aW9uIHJlcXVsYXIoZm4sIGRlbGF5LCBiaW5kKSB7XG4gIHZhciBlbmFibGUgPSB0cnVlO1xuICB2YXIgdGltZXIgPSBudWxsO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgZW5hYmxlID0gdHJ1ZTtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICBpZiAoIXRpbWVyKSB7XG4gICAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGZuLmFwcGx5KGJpbmQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5hYmxlKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVuYWJsZSA9IGZhbHNlO1xuICAgICAgfSwgZGVsYXkpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1bGFyO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGx1c3BsdXMgKi9cblxuLyoqXG4gKiDnroDljZXnmoQgRWFzaW5nIEZ1bmN0aW9uc1xuICogLSDlgLzln5/lj5jljJbojIPlm7TvvIzku44gWzAsIDFdIOWIsCBbMCwgMV1cbiAqIC0g5Y2z6L6T5YWl5YC86IyD5Zu05LuOIDAg5YiwIDFcbiAqIC0g6L6T5Ye65Lmf5Li65LuOIDAg5YiwIDFcbiAqIC0g6YCC5ZCI6L+b6KGM55m+5YiG5q+U5Yqo55S76L+Q566XXG4gKlxuICog5Yqo55S75Ye95pWwXG4gKiAtIGxpbmVhclxuICogLSBlYXNlSW5RdWFkXG4gKiAtIGVhc2VPdXRRdWFkXG4gKiAtIGVhc2VJbk91dFF1YWRcbiAqIC0gZWFzZUluQ3ViaWNcbiAqIC0gZWFzZUluUXVhcnRcbiAqIC0gZWFzZU91dFF1YXJ0XG4gKiAtIGVhc2VJbk91dFF1YXJ0XG4gKiAtIGVhc2VJblF1aW50XG4gKiAtIGVhc2VPdXRRdWludFxuICogLSBlYXNlSW5PdXRRdWludFxuICogQG1vZHVsZSBmeC9lYXNpbmdcbiAqIEBzZWUgW2Vhc2luZy5qc10oaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTQpXG4gKiBAZXhhbXBsZVxuICogdmFyICRlYXNpbmcgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Vhc2luZycpO1xuICogJGVhc2luZy5saW5lYXIoMC41KTsgLy8gMC41XG4gKiAkZWFzaW5nLmVhc2VJblF1YWQoMC41KTsgLy8gMC4yNVxuICogJGVhc2luZy5lYXNlSW5DdWJpYygwLjUpOyAvLyAwLjEyNVxuICovXG52YXIgZWFzaW5nID0ge1xuICAvLyBubyBlYXNpbmcsIG5vIGFjY2VsZXJhdGlvblxuICBsaW5lYXI6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQ7XG4gIH0sXG4gIC8vIGFjY2VsZXJhdGluZyBmcm9tIHplcm8gdmVsb2NpdHlcbiAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCAqIHQ7XG4gIH0sXG4gIC8vIGRlY2VsZXJhdGluZyB0byB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0ICogKDIgLSB0KTtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW9uIHVudGlsIGhhbGZ3YXksIHRoZW4gZGVjZWxlcmF0aW9uXG4gIGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyAyICogdCAqIHQgOiAtMSArICg0IC0gMiAqIHQpICogdDtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW5nIGZyb20gemVybyB2ZWxvY2l0eVxuICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0O1xuICB9LFxuICAvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuICBlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuICgtLXQpICogdCAqIHQgKyAxO1xuICB9LFxuICAvLyBhY2NlbGVyYXRpb24gdW50aWwgaGFsZndheSwgdGhlbiBkZWNlbGVyYXRpb25cbiAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xuICB9LFxuICAvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0ICogdCAqIHQgKiB0O1xuICB9LFxuICAvLyBkZWNlbGVyYXRpbmcgdG8gemVybyB2ZWxvY2l0eVxuICBlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIDEgLSAoLS10KSAqIHQgKiB0ICogdDtcbiAgfSxcbiAgLy8gYWNjZWxlcmF0aW9uIHVudGlsIGhhbGZ3YXksIHRoZW4gZGVjZWxlcmF0aW9uXG4gIGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0IDwgMC41ID8gOCAqIHQgKiB0ICogdCAqIHQgOiAxIC0gOCAqICgtLXQpICogdCAqIHQgKiB0O1xuICB9LFxuICAvLyBhY2NlbGVyYXRpbmcgZnJvbSB6ZXJvIHZlbG9jaXR5XG4gIGVhc2VJblF1aW50OiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0ICogdCAqIHQgKiB0ICogdDtcbiAgfSxcbiAgLy8gZGVjZWxlcmF0aW5nIHRvIHplcm8gdmVsb2NpdHlcbiAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiAxICsgKC0tdCkgKiB0ICogdCAqIHQgKiB0O1xuICB9LFxuICAvLyBhY2NlbGVyYXRpb24gdW50aWwgaGFsZndheSwgdGhlbiBkZWNlbGVyYXRpb25cbiAgZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyAxNiAqIHQgKiB0ICogdCAqIHQgKiB0IDogMSArIDE2ICogKC0tdCkgKiB0ICogdCAqIHQgKiB0O1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlYXNpbmc7XG4iLCIvKipcbiAqIOWwgeijhemXqueDgeWKqOS9nFxuICogQG1ldGhvZCBmeC9mbGFzaEFjdGlvblxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMg6YCJ6aG5XG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGltZXM9M10g6Zeq54OB5qyh5pWw77yM6buY6K6kM+asoVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmRlbGF5PTEwMF0g6Zeq54OB6Ze06ZqU5pe26Ze0KG1zKVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMuYWN0aW9uT2RkXSDlpYfmlbDlm57osINcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLmFjdGlvbkV2ZW5dIOWBtuaVsOWbnuiwg1xuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMucmVjb3Zlcl0g54q25oCB5oGi5aSN5Zue6LCDXG4gKiBAZXhhbXBsZVxuICogdmFyICRmbGFzaEFjdGlvbiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZmxhc2hBY3Rpb24nKTtcbiAqIC8vIOaWh+Wtl+mXqueDge+8jOWlh+aVsOasoeWRiOeOsOS4uue6ouiJsu+8jOWBtuaVsOasoeaIkOe6pOe7tOiTneiJsu+8jOWKqOeUu+e7k+adn+WRiOeOsOS4uum7keiJslxuICogdmFyIHRleHQgPSAkKCcjdGFyZ2V0IHNwYW4udHh0Jyk7XG4gKiAkZmxhc2hBY3Rpb24oe1xuICogICBhY3Rpb25PZGQgOiBmdW5jdGlvbiAoKXtcbiAqICAgICB0ZXh0LmNzcygnY29sb3InLCAnI2YwMCcpO1xuICogICB9LFxuICogICBhY3Rpb25FdmVuIDogZnVuY3Rpb24gKCl7XG4gKiAgICAgdGV4dC5jc3MoJ2NvbG9yJywgJyMwMGYnKTtcbiAqICAgfSxcbiAqICAgcmVjb3ZlciA6IGZ1bmN0aW9uICgpe1xuICogICAgIHRleHQuY3NzKCdjb2xvcicsICcjMDAwJyk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxuZnVuY3Rpb24gZmxhc2hBY3Rpb24ob3B0aW9ucykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIHRpbWVzOiAzLFxuICAgIGRlbGF5OiAxMDAsXG4gICAgYWN0aW9uT2RkOiBudWxsLFxuICAgIGFjdGlvbkV2ZW46IG51bGwsXG4gICAgcmVjb3ZlcjogbnVsbCxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgdmFyIHF1ZXVlID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZi50aW1lcyAqIDIgKyAxOyBpICs9IDEpIHtcbiAgICBxdWV1ZS5wdXNoKChpICsgMSkgKiBjb25mLmRlbGF5KTtcbiAgfVxuXG4gIHF1ZXVlLmZvckVhY2goZnVuY3Rpb24gKHRpbWUsIGluZGV4KSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaW5kZXggPj0gcXVldWUubGVuZ3RoIC0gMSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmYucmVjb3ZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbmYucmVjb3ZlcigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ICUgMiA9PT0gMCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmYuYWN0aW9uRXZlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbmYuYWN0aW9uRXZlbigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25mLmFjdGlvbk9kZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25mLmFjdGlvbk9kZCgpO1xuICAgICAgfVxuICAgIH0sIHRpbWUpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGFzaEFjdGlvbjtcbiIsIi8qKlxuICog5Yqo55S757G7IC0g55So5LqO5aSE55CG5LiN6YCC5ZCI5L2/55SoIHRyYW5zaXRpb24g55qE5Yqo55S75Zy65pmvXG4gKlxuICog5Y+v57uR5a6a55qE5LqL5Lu2XG4gKiAtIHN0YXJ0IOWKqOeUu+W8gOWni+aXtuinpuWPkVxuICogLSBjb21wbGV0ZSDliqjnlLvlt7LlrozmiJBcbiAqIC0gc3RvcCDliqjnlLvlsJrmnKrlrozmiJDlsLHooqvkuK3mlq1cbiAqIC0gY2FuY2VsIOWKqOeUu+iiq+WPlua2iFxuICogQGNsYXNzIGZ4L0Z4XG4gKiBAc2VlIFttb290b29scy9GeF0oaHR0cHM6Ly9tb290b29scy5uZXQvY29yZS9kb2NzLzEuNi4wL0Z4L0Z4KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOWKqOeUu+mAiemhuVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZwcz02MF0g5bin6YCf546HKGYvcynvvIzlrp7pmYXkuIrliqjnlLvov5DooYznmoTmnIDpq5jluKfpgJ/njofkuI3kvJrpq5jkuo4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOaPkOS+m+eahOW4p+mAn+eOh1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTUwMF0g5Yqo55S75oyB57ut5pe26Ze0KG1zKVxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IFtvcHRpb25zLnRyYW5zaXRpb25dIOWKqOeUu+aJp+ihjOaWueW8j++8jOWPguingSBbZngvdHJhbnNpdGlvbnNdKCNmeC10cmFuc2l0aW9ucylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZXNdIOS7juWTquS4gOW4p+W8gOWni+aJp+ihjFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5mcmFtZVNraXA9dHJ1ZV0g5piv5ZCm6Lez5binXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubGluaz0naWdub3JlJ10g5Yqo55S76KGU5o6l5pa55byP77yM5Y+v6YCJ77yaWydpZ25vcmUnLCAnY2FuY2VsJ11cbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9meCcpO1xuICogdmFyIGZ4ID0gbmV3ICRmeCh7XG4gKiAgIGR1cmF0aW9uIDogMTAwMFxuICogfSk7XG4gKiBmeC5zZXQgPSBmdW5jdGlvbiAobm93KSB7XG4gKiAgIG5vZGUuc3R5bGUubWFyZ2luTGVmdCA9IG5vdyArICdweCc7XG4gKiB9O1xuICogZngub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAqICAgY29uc29sZS5pbmZvKCdhbmltYXRpb24gZW5kJyk7XG4gKiB9KTtcbiAqIGZ4LnN0YXJ0KDAsIDYwMCk7IC8vIDHnp5LlhoXmlbDlrZfku44w5aKe5Yqg5YiwNjAwXG4gKi9cblxudmFyICRrbGFzcyA9IHJlcXVpcmUoJy4uL212Yy9rbGFzcycpO1xudmFyICRldmVudHMgPSByZXF1aXJlKCcuLi9ldnQvZXZlbnRzJyk7XG52YXIgJGVyYXNlID0gcmVxdWlyZSgnLi4vYXJyL2VyYXNlJyk7XG52YXIgJGNvbnRhaW5zID0gcmVxdWlyZSgnLi4vYXJyL2NvbnRhaW5zJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkdGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJyk7XG5cbi8vIGdsb2JhbCB0aW1lcnNcbi8vIOS9v+eUqOWFrOWFseWumuaXtuWZqOWPr+S7peWHj+Wwkea1j+iniOWZqOi1hOa6kOa2iOiAl1xudmFyIGluc3RhbmNlcyA9IHt9O1xudmFyIHRpbWVycyA9IHt9O1xuXG52YXIgbG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aDsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzW2ldO1xuICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2Uuc3RlcChub3cpO1xuICAgIH1cbiAgfVxufTtcblxudmFyIHB1c2hJbnN0YW5jZSA9IGZ1bmN0aW9uIChmcHMpIHtcbiAgdmFyIGxpc3QgPSBpbnN0YW5jZXNbZnBzXSB8fCAoaW5zdGFuY2VzW2Zwc10gPSBbXSk7XG4gIGxpc3QucHVzaCh0aGlzKTtcbiAgaWYgKCF0aW1lcnNbZnBzXSkge1xuICAgIHZhciBsb29wTWV0aG9kID0gbG9vcC5iaW5kKGxpc3QpO1xuICAgIHZhciBsb29wRHVyID0gTWF0aC5yb3VuZCgxMDAwIC8gZnBzKTtcbiAgICB0aW1lcnNbZnBzXSA9ICR0aW1lci5zZXRJbnRlcnZhbChsb29wTWV0aG9kLCBsb29wRHVyKTtcbiAgfVxufTtcblxudmFyIHB1bGxJbnN0YW5jZSA9IGZ1bmN0aW9uIChmcHMpIHtcbiAgdmFyIGxpc3QgPSBpbnN0YW5jZXNbZnBzXTtcbiAgaWYgKGxpc3QpIHtcbiAgICAkZXJhc2UobGlzdCwgdGhpcyk7XG4gICAgaWYgKCFsaXN0Lmxlbmd0aCAmJiB0aW1lcnNbZnBzXSkge1xuICAgICAgZGVsZXRlIGluc3RhbmNlc1tmcHNdO1xuICAgICAgdGltZXJzW2Zwc10gPSAkdGltZXIuY2xlYXJJbnRlcnZhbCh0aW1lcnNbZnBzXSk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgRnggPSAka2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICRhc3NpZ24oe1xuICAgICAgZnBzOiA2MCxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICB0cmFuc2l0aW9uOiBudWxsLFxuICAgICAgZnJhbWVzOiBudWxsLFxuICAgICAgZnJhbWVTa2lwOiB0cnVlLFxuICAgICAgbGluazogJ2lnbm9yZScsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiuvue9ruWunuS+i+eahOmAiemhuVxuICAgKiBAbWV0aG9kIEZ4I3NldE9wdGlvbnNcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOWKqOeUu+mAiemhuVxuICAgKi9cbiAgc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbmYgPSAkYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDorr7nva7liqjnlLvnmoTmiafooYzmlrnlvI/vvIzphY3nva7nvJPliqjmlYjmnpxcbiAgICogQGludGVyZmFjZSBGeCNnZXRUcmFuc2l0aW9uXG4gICAqIEBtZW1iZXJvZiBmeC9GeFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9meCcpO1xuICAgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG4gICAqIGZ4LmdldFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAqICAgcmV0dXJuIGZ1bmN0aW9uIChwKSB7XG4gICAqICAgICByZXR1cm4gLShNYXRoLmNvcyhNYXRoLlBJICogcCkgLSAxKSAvIDI7XG4gICAqICAgfTtcbiAgICogfTtcbiAgICovXG4gIGdldFRyYW5zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiAtKE1hdGguY29zKE1hdGguUEkgKiBwKSAtIDEpIC8gMjtcbiAgICB9O1xuICB9LFxuXG4gIHN0ZXA6IGZ1bmN0aW9uIChub3cpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZyYW1lU2tpcCkge1xuICAgICAgdmFyIGRpZmYgPSB0aGlzLnRpbWUgIT0gbnVsbCA/IG5vdyAtIHRoaXMudGltZSA6IDA7XG4gICAgICB2YXIgZnJhbWVzID0gZGlmZiAvIHRoaXMuZnJhbWVJbnRlcnZhbDtcbiAgICAgIHRoaXMudGltZSA9IG5vdztcbiAgICAgIHRoaXMuZnJhbWUgKz0gZnJhbWVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyYW1lICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZnJhbWUgPCB0aGlzLmZyYW1lcykge1xuICAgICAgdmFyIGRlbHRhID0gdGhpcy50cmFuc2l0aW9uKHRoaXMuZnJhbWUgLyB0aGlzLmZyYW1lcyk7XG4gICAgICB0aGlzLnNldCh0aGlzLmNvbXB1dGUodGhpcy5mcm9tLCB0aGlzLnRvLCBkZWx0YSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyYW1lID0gdGhpcy5mcmFtZXM7XG4gICAgICB0aGlzLnNldCh0aGlzLmNvbXB1dGUodGhpcy5mcm9tLCB0aGlzLnRvLCAxKSk7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiuvue9ruW9k+WJjeWKqOeUu+W4p+eahOi/h+a4oeaVsOWAvFxuICAgKiBAaW50ZXJmYWNlIEZ4I3NldFxuICAgKiBAbWVtYmVyb2YgZngvRnhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vdyDlvZPliY3liqjnlLvluKfnmoTov4fmuKHmlbDlgLxcbiAgICogQGV4YW1wbGVcbiAgICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zZXQgPSBmdW5jdGlvbiAobm93KSB7XG4gICAqICAgbm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gbm93ICsgJ3B4JztcbiAgICogfTtcbiAgICovXG4gIHNldDogZnVuY3Rpb24gKG5vdykge1xuICAgIHJldHVybiBub3c7XG4gIH0sXG5cbiAgY29tcHV0ZTogZnVuY3Rpb24gKGZyb20sIHRvLCBkZWx0YSkge1xuICAgIHJldHVybiBGeC5jb21wdXRlKGZyb20sIHRvLCBkZWx0YSk7XG4gIH0sXG5cbiAgY2hlY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmxpbmsgPT09ICdjYW5jZWwnKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICog5byA5aeL5omn6KGM5Yqo55S7XG4gICAqIEBtZXRob2QgRngjc3RhcnRcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tIOWKqOeUu+W8gOWni+aVsOWAvFxuICAgKiBAcGFyYW0ge051bWJlcn0gdG8g5Yqo55S757uT5p2f5pWw5YC8XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTsgLy8g5byA5aeL5Yqo55S7XG4gICAqL1xuICBzdGFydDogZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrKGZyb20sIHRvKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMuZnJvbSA9IGZyb207XG4gICAgdGhpcy50byA9IHRvO1xuICAgIHRoaXMuZnJhbWUgPSB0aGlzLm9wdGlvbnMuZnJhbWVTa2lwID8gMCA6IC0xO1xuICAgIHRoaXMudGltZSA9IG51bGw7XG4gICAgdGhpcy50cmFuc2l0aW9uID0gdGhpcy5nZXRUcmFuc2l0aW9uKCk7XG4gICAgdmFyIGZyYW1lcyA9IHRoaXMub3B0aW9ucy5mcmFtZXM7XG4gICAgdmFyIGZwcyA9IHRoaXMub3B0aW9ucy5mcHM7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5vcHRpb25zLmR1cmF0aW9uO1xuICAgIHRoaXMuZHVyYXRpb24gPSBGeC5EdXJhdGlvbnNbZHVyYXRpb25dIHx8IHBhcnNlSW50KGR1cmF0aW9uLCAxMCkgfHwgMDtcbiAgICB0aGlzLmZyYW1lSW50ZXJ2YWwgPSAxMDAwIC8gZnBzO1xuICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzIHx8IE1hdGgucm91bmQodGhpcy5kdXJhdGlvbiAvIHRoaXMuZnJhbWVJbnRlcnZhbCk7XG4gICAgdGhpcy50cmlnZ2VyKCdzdGFydCcpO1xuICAgIHB1c2hJbnN0YW5jZS5jYWxsKHRoaXMsIGZwcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOWBnOatouWKqOeUu1xuICAgKiBAbWV0aG9kIEZ4I3N0b3BcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTtcbiAgICogZnguc3RvcCgpOyAvLyDnq4vliLvlgZzmraLliqjnlLtcbiAgICovXG4gIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1J1bm5pbmcoKSkge1xuICAgICAgdGhpcy50aW1lID0gbnVsbDtcbiAgICAgIHB1bGxJbnN0YW5jZS5jYWxsKHRoaXMsIHRoaXMub3B0aW9ucy5mcHMpO1xuICAgICAgaWYgKHRoaXMuZnJhbWVzID09PSB0aGlzLmZyYW1lKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcignY29tcGxldGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcignc3RvcCcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICog5Y+W5raI5Yqo55S7XG4gICAqIEBtZXRob2QgRngjY2FuY2VsXG4gICAqIEBtZW1iZXJvZiBmeC9GeFxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgJGZ4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9meCcpO1xuICAgKiB2YXIgZnggPSBuZXcgJGZ4KCk7XG4gICAqIGZ4LnN0YXJ0KCk7XG4gICAqIGZ4LmNhbmNlbCgpOyAvLyDnq4vliLvlj5bmtojliqjnlLtcbiAgICovXG4gIGNhbmNlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICB0aGlzLnRpbWUgPSBudWxsO1xuICAgICAgcHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgICB0aGlzLmZyYW1lID0gdGhpcy5mcmFtZXM7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2NhbmNlbCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICog5pqC5YGc5Yqo55S7XG4gICAqIEBtZXRob2QgRngjcGF1c2VcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTtcbiAgICogZngucGF1c2UoKTsgLy8g56uL5Yi75pqC5YGc5Yqo55S7XG4gICAqL1xuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzUnVubmluZygpKSB7XG4gICAgICB0aGlzLnRpbWUgPSBudWxsO1xuICAgICAgcHVsbEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnu6fnu63miafooYzliqjnlLtcbiAgICogQG1ldGhvZCBGeCNyZXN1bWVcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEBleGFtcGxlXG4gICAqIHZhciAkZnggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L2Z4Jyk7XG4gICAqIHZhciBmeCA9IG5ldyAkZngoKTtcbiAgICogZnguc3RhcnQoKTtcbiAgICogZngucGF1c2UoKTtcbiAgICogZngucmVzdW1lKCk7IC8vIOeri+WIu+e7p+e7reWKqOeUu1xuICAgKi9cbiAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZnJhbWUgPCB0aGlzLmZyYW1lcyAmJiAhdGhpcy5pc1J1bm5pbmcoKSkge1xuICAgICAgcHVzaEluc3RhbmNlLmNhbGwodGhpcywgdGhpcy5vcHRpb25zLmZwcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDliKTmlq3liqjnlLvmmK/lkKbmraPlnKjov5DooYxcbiAgICogQG1ldGhvZCBGeCNpc1J1bm5pbmdcbiAgICogQG1lbWJlcm9mIGZ4L0Z4XG4gICAqIEByZXR1cm5zIHtCb29sZWFufSDliqjnlLvmmK/lkKbmraPlnKjov5DooYxcbiAgICogQGV4YW1wbGVcbiAgICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAgICogdmFyIGZ4ID0gbmV3ICRmeCgpO1xuICAgKiBmeC5zdGFydCgpO1xuICAgKiBmeC5wYXVzZSgpO1xuICAgKiBmeC5pc1J1bm5pbmcoKTsgLy8gZmFsc2VcbiAgICovXG4gIGlzUnVubmluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBsaXN0ID0gaW5zdGFuY2VzW3RoaXMub3B0aW9ucy5mcHNdO1xuICAgIHJldHVybiBsaXN0ICYmICRjb250YWlucyhsaXN0LCB0aGlzKTtcbiAgfSxcbn0pO1xuXG4kZXZlbnRzLm1peFRvKEZ4KTtcblxuRnguY29tcHV0ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bywgZGVsdGEpIHtcbiAgcmV0dXJuICh0byAtIGZyb20pICogZGVsdGEgKyBmcm9tO1xufTtcblxuRnguRHVyYXRpb25zID0geyBzaG9ydDogMjUwLCBub3JtYWw6IDUwMCwgbG9uZzogMTAwMCB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ4O1xuIiwiLyoqXG4gKiDliqjnlLvkuqTkupLnm7jlhbPlt6XlhbdcbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9meFxuICogQGV4YW1wbGVcbiAqIC8vIOe7n+S4gOW8leWFpSBAc3BvcmUtdWkva2l0XG4gKiB2YXIgJGtpdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2l0LmZ4LnNtb290aFNjcm9sbFRvKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meFxuICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngnKTtcbiAqIGNvbnNvbGUuaW5mbygkZnguc21vb3RoU2Nyb2xsVG8pO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRzbW9vdGhTY3JvbGxUbyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvc21vb3RoU2Nyb2xsVG8nKTtcbiAqL1xuXG5leHBvcnRzLmVhc2luZyA9IHJlcXVpcmUoJy4vZWFzaW5nJyk7XG5leHBvcnRzLmZsYXNoQWN0aW9uID0gcmVxdWlyZSgnLi9mbGFzaEFjdGlvbicpO1xuZXhwb3J0cy5GeCA9IHJlcXVpcmUoJy4vZngnKTtcbmV4cG9ydHMuc21vb3RoU2Nyb2xsVG8gPSByZXF1aXJlKCcuL3Ntb290aFNjcm9sbFRvJyk7XG5leHBvcnRzLnN0aWNreSA9IHJlcXVpcmUoJy4vc3RpY2t5Jyk7XG5leHBvcnRzLnRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpO1xuZXhwb3J0cy50cmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMnKTtcbiIsIi8qKlxuICog5bmz5ruR5rua5Yqo5Yiw5p+Q5Liq5YWD57Sg77yM5Y+q6L+b6KGM5Z6C55u05pa55ZCR55qE5rua5YqoXG4gKiAtIHJlcXVpcmVzIGpRdWVyeS9aZXB0b1xuICogQG1ldGhvZCBmeC9zbW9vdGhTY3JvbGxUb1xuICogQHBhcmFtIHtPYmplY3R9IG5vZGUg55uu5qCHRE9N5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gc3BlYyDpgInpoblcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5kZWx0YT0wXSDnm67moIfmu5rliqjkvY3nva7kuI7nm67moIflhYPntKDpobbpg6jnmoTpl7Tot53vvIzlj6/ku6XkuLrotJ/lgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5tYXhEZWxheT0zMDAwXSDliqjnlLvmiafooYzml7bpl7TpmZDliLYobXMp77yM5Yqo55S75omn6KGM6LaF6L+H5q2k5pe26Ze05YiZ55u05o6l5YGc5q2i77yM56uL5Yi75rua5Yqo5Yiw55uu5qCH5L2N572uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5jYWxsYmFja10g5rua5Yqo5a6M5oiQ55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRzbW9vdGhTY3JvbGxUbyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvc21vb3RoU2Nyb2xsVG8nKTtcbiAqIC8vIOa7muWKqOWIsOmhtemdoumhtuerr1xuICogJHNtb290aFNjcm9sbFRvKGRvY3VtZW50LmJvZHkpO1xuICovXG5cbnZhciAkYXNzaWduID0gcmVxdWlyZSgnLi4vb2JqL2Fzc2lnbicpO1xuXG5mdW5jdGlvbiBzbW9vdGhTY3JvbGxUbyhub2RlLCBzcGVjKSB7XG4gIHZhciAkID0gd2luZG93LiQgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnk7XG5cbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICBkZWx0YTogMCxcbiAgICBtYXhEZWxheTogMzAwMCxcbiAgICBjYWxsYmFjazogbnVsbCxcbiAgfSwgc3BlYyk7XG5cbiAgdmFyIG9mZnNldCA9ICQobm9kZSkub2Zmc2V0KCk7XG4gIHZhciB0YXJnZXQgPSBvZmZzZXQudG9wICsgY29uZi5kZWx0YTtcbiAgdmFyIGNhbGxiYWNrID0gY29uZi5jYWxsYmFjaztcblxuICB2YXIgcHJldlN0ZXA7XG4gIHZhciBzdGF5Q291bnQgPSAzO1xuXG4gIHZhciB0aW1lciA9IG51bGw7XG5cbiAgdmFyIHN0b3BUaW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRhcmdldCk7XG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgZGVsdGEgPSBzVG9wIC0gdGFyZ2V0O1xuICAgIGlmIChkZWx0YSA+IDApIHtcbiAgICAgIGRlbHRhID0gTWF0aC5mbG9vcihkZWx0YSAqIDAuOCk7XG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDApIHtcbiAgICAgIGRlbHRhID0gTWF0aC5jZWlsKGRlbHRhICogMC44KTtcbiAgICB9XG5cbiAgICB2YXIgc3RlcCA9IHRhcmdldCArIGRlbHRhO1xuICAgIGlmIChzdGVwID09PSBwcmV2U3RlcCkge1xuICAgICAgc3RheUNvdW50IC09IDE7XG4gICAgfVxuICAgIHByZXZTdGVwID0gc3RlcDtcblxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGVwKTtcblxuICAgIGlmIChzdGVwID09PSB0YXJnZXQgfHwgc3RheUNvdW50IDw9IDApIHtcbiAgICAgIHN0b3BUaW1lcigpO1xuICAgIH1cbiAgfSwgMTYpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHN0b3BUaW1lcigpO1xuICB9LCBjb25mLm1heERlbGF5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzbW9vdGhTY3JvbGxUbztcbiIsIi8qKlxuICogSU9TIHN0aWNreSDmlYjmnpwgcG9seWZpbGxcbiAqIC0gcmVxdWlyZXMgalF1ZXJ5L1plcHRvXG4gKiBAbWV0aG9kIGZ4L3N0aWNreVxuICogQHBhcmFtIHtPYmplY3R9IG5vZGUg55uu5qCHRE9N5YWD57SgXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDpgInpoblcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2xvbmU9dHJ1ZV0g5piv5ZCm5Yib5bu65LiA5LiqIGNsb25lIOWFg+e0oFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnBsYWNlaG9sZGVyPW51bGxdIHN0aWNreSDmlYjmnpzlkK/liqjml7bnmoTljaDkvY0gZG9tIOWFg+e0oFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kaXNhYmxlQW5kcm9pZD1mYWxzZV0g5piv5ZCm5ZyoIEFuZHJvaWQg5LiL5YGc55SoIHN0aWNreSDmlYjmnpxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vZmZzZXRQYXJlbnQ9bnVsbF0g5o+Q5L6b5LiA5Liq55u45a+55a6a5L2N5YWD57Sg5p2l5Yy56YWN5rWu5Yqo5pe255qE5a6a5L2N5qC35byPXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc3R5bGVzPXt9XSDov5vlhaUgc3RpY2t5IOeKtuaAgeaXtueahOagt+W8j1xuICogQGV4YW1wbGVcbiAqIHZhciAkc3RpY2t5ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9meC9zdGlja3knKTtcbiAqICRzdGlja3koJCgnaDEnKS5nZXQoMCkpO1xuICovXG5cbmZ1bmN0aW9uIHN0aWNreShub2RlLCBvcHRpb25zKSB7XG4gIHZhciAkID0gd2luZG93LiQgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnk7XG5cbiAgdmFyICR3aW4gPSAkKHdpbmRvdyk7XG4gIHZhciAkZG9jID0gJChkb2N1bWVudCk7XG5cbiAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgdmFyIGlzSU9TID0gISF1YS5tYXRjaCgvXFwoaVteO10rOyggVTspPyBDUFUuK01hYyBPUyBYL2kpO1xuICB2YXIgaXNBbmRyb2lkID0gdWEuaW5kZXhPZignQW5kcm9pZCcpID4gLTEgfHwgdWEuaW5kZXhPZignTGludXgnKSA+IC0xO1xuXG4gIHZhciB0aGF0ID0ge307XG4gIHRoYXQuaXNJT1MgPSBpc0lPUztcbiAgdGhhdC5pc0FuZHJvaWQgPSBpc0FuZHJvaWQ7XG5cbiAgdmFyIGNvbmYgPSAkLmV4dGVuZCh7XG4gICAgY2xvbmU6IHRydWUsXG4gICAgcGxhY2Vob2xkZXI6IG51bGwsXG4gICAgZGlzYWJsZUFuZHJvaWQ6IGZhbHNlLFxuICAgIG9mZnNldFBhcmVudDogbnVsbCxcbiAgICBzdHlsZXM6IHt9LFxuICB9LCBvcHRpb25zKTtcblxuICB0aGF0LnJvb3QgPSAkKG5vZGUpO1xuXG4gIGlmICghdGhhdC5yb290LmdldCgwKSkgeyByZXR1cm47IH1cbiAgdGhhdC5vZmZzZXRQYXJlbnQgPSB0aGF0LnJvb3Qub2Zmc2V0UGFyZW50KCk7XG5cbiAgaWYgKGNvbmYub2Zmc2V0UGFyZW50KSB7XG4gICAgdGhhdC5vZmZzZXRQYXJlbnQgPSAkKGNvbmYub2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIGlmICghdGhhdC5vZmZzZXRQYXJlbnRbMF0pIHtcbiAgICB0aGF0Lm9mZnNldFBhcmVudCA9ICQoZG9jdW1lbnQuYm9keSk7XG4gIH1cblxuICB0aGF0LmlzU3RpY2t5ID0gZmFsc2U7XG5cbiAgaWYgKGNvbmYucGxhY2Vob2xkZXIpIHtcbiAgICB0aGF0LnBsYWNlaG9sZGVyID0gJChjb25mLnBsYWNlaG9sZGVyKTtcbiAgfSBlbHNlIHtcbiAgICB0aGF0LnBsYWNlaG9sZGVyID0gJCgnPGRpdi8+Jyk7XG4gIH1cblxuICBpZiAoY29uZi5jbG9uZSkge1xuICAgIHRoYXQuY2xvbmUgPSB0aGF0LnJvb3QuY2xvbmUoKTtcbiAgICB0aGF0LmNsb25lLmFwcGVuZFRvKHRoYXQucGxhY2Vob2xkZXIpO1xuICB9XG5cbiAgdGhhdC5wbGFjZWhvbGRlci5jc3Moe1xuICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxuICB9KTtcblxuICB0aGF0LnN0aWNreSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoYXQuaXNTdGlja3kpIHtcbiAgICAgIHRoYXQuaXNTdGlja3kgPSB0cnVlO1xuICAgICAgdGhhdC5yb290LmNzcygncG9zaXRpb24nLCAnZml4ZWQnKTtcbiAgICAgIHRoYXQucm9vdC5jc3MoY29uZi5zdHlsZXMpO1xuICAgICAgdGhhdC5wbGFjZWhvbGRlci5pbnNlcnRCZWZvcmUodGhhdC5yb290KTtcbiAgICB9XG4gIH07XG5cbiAgdGhhdC51blN0aWNreSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhhdC5pc1N0aWNreSkge1xuICAgICAgdGhhdC5pc1N0aWNreSA9IGZhbHNlO1xuICAgICAgdGhhdC5wbGFjZWhvbGRlci5yZW1vdmUoKTtcbiAgICAgIHRoYXQucm9vdC5jc3MoJ3Bvc2l0aW9uJywgJycpO1xuICAgICAgJC5lYWNoKGNvbmYuc3R5bGVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHRoYXQucm9vdC5jc3Moa2V5LCAnJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9yaWdPZmZzZXRZID0gdGhhdC5yb290LmdldCgwKS5vZmZzZXRUb3A7XG4gIHRoYXQuY2hlY2tTY3JvbGxZID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhhdC5pc1N0aWNreSkge1xuICAgICAgb3JpZ09mZnNldFkgPSB0aGF0LnJvb3QuZ2V0KDApLm9mZnNldFRvcDtcbiAgICB9XG5cbiAgICB2YXIgc2Nyb2xsWSA9IDA7XG4gICAgaWYgKHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKSA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY3JvbGxZID0gdGhhdC5vZmZzZXRQYXJlbnQuZ2V0KDApLnNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsWSA+IG9yaWdPZmZzZXRZKSB7XG4gICAgICB0aGF0LnN0aWNreSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LnVuU3RpY2t5KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoYXQuaXNTdGlja3kpIHtcbiAgICAgIHRoYXQucm9vdC5jc3Moe1xuICAgICAgICB3aWR0aDogdGhhdC5wbGFjZWhvbGRlci53aWR0aCgpICsgJ3B4JyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LnJvb3QuY3NzKHtcbiAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHRoYXQuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaXNBbmRyb2lkICYmIGNvbmYuZGlzYWJsZUFuZHJvaWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzSU9TICYmIHRoYXQub2Zmc2V0UGFyZW50LmdldCgwKSA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgLy8gSU9TOSsg5pSv5oyBIHBvc2l0aW9uOnN0aWNreSDlsZ7mgKdcbiAgICAgIHRoYXQucm9vdC5jc3MoJ3Bvc2l0aW9uJywgJ3N0aWNreScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDkuIDoiKzmtY/op4jlmajnm7TmjqXmlK/mjIFcbiAgICAgIGlmICh0aGF0Lm9mZnNldFBhcmVudC5nZXQoMCkgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgJHdpbi5vbignc2Nyb2xsJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5vZmZzZXRQYXJlbnQub24oJ3Njcm9sbCcsIHRoYXQuY2hlY2tTY3JvbGxZKTtcbiAgICAgIH1cblxuICAgICAgJHdpbi5vbigncmVzaXplJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuICAgICAgJGRvYy5vbigndG91Y2hzdGFydCcsIHRoYXQuY2hlY2tTY3JvbGxZKTtcbiAgICAgICRkb2Mub24oJ3RvdWNobW92ZScsIHRoYXQuY2hlY2tTY3JvbGxZKTtcbiAgICAgICRkb2Mub24oJ3RvdWNoZW5kJywgdGhhdC5jaGVja1Njcm9sbFkpO1xuICAgICAgdGhhdC5jaGVja1Njcm9sbFkoKTtcbiAgICB9XG4gIH07XG5cbiAgdGhhdC5pbml0KCk7XG4gIHJldHVybiB0aGF0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0aWNreTtcbiIsIi8qKlxuICog55SoIHJlcXVlc3RBbmltYXRpb25GcmFtZSDljIXoo4Xlrprml7blmahcbiAqIC0g5aaC5p6c5rWP6KeI5Zmo5LiN5pSv5oyBIHJlcXVlc3RBbmltYXRpb25GcmFtZSBBUEnvvIzliJnkvb/nlKggQk9NIOWOn+acrOeahOWumuaXtuWZqEFQSVxuICogQG1vZHVsZSBmeC90aW1lclxuICogQGV4YW1wbGVcbiAqIHZhciAkdGltZXIgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L3RpbWVyJyk7XG4gKiAkdGltZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gKiAgIGNvbnNvbGUuaW5mbygnb3V0cHV0IHRoaXMgbG9nIGFmdGVyIDEwMDBtcycpO1xuICogfSwgMTAwMCk7XG4gKi9cblxudmFyIFRpbWVyID0ge307XG5cbnZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbmZ1bmN0aW9uIGZhY3RvcnkobWV0aG9kTmFtZSkge1xuICB2YXIgd3JhcHBlZE1ldGhvZCA9IG51bGw7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgLy8g5aaC5p6c5pyJ5a+55bqU5ZCN56ew55qE5pa55rOV77yM55u05o6l6L+U5Zue6K+l5pa55rOV77yM5ZCm5YiZ6L+U5Zue5bim5pyJ5a+55bqU5rWP6KeI5Zmo5YmN57yA55qE5pa55rOVXG4gIHZhciBnZXRQcmVmaXhNZXRob2QgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciB1cEZpcnN0TmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKTtcbiAgICB2YXIgbWV0aG9kID0gd2luW25hbWVdXG4gICAgICB8fCB3aW5bJ3dlYmtpdCcgKyB1cEZpcnN0TmFtZV1cbiAgICAgIHx8IHdpblsnbW96JyArIHVwRmlyc3ROYW1lXVxuICAgICAgfHwgd2luWydvJyArIHVwRmlyc3ROYW1lXVxuICAgICAgfHwgd2luWydtcycgKyB1cEZpcnN0TmFtZV07XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBtZXRob2QuYmluZCh3aW4pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICB2YXIgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBnZXRQcmVmaXhNZXRob2QoJ3JlcXVlc3RBbmltYXRpb25GcmFtZScpO1xuICB2YXIgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSA9IGdldFByZWZpeE1ldGhvZCgnY2FuY2VsQW5pbWF0aW9uRnJhbWUnKSB8fCBub29wO1xuXG4gIGlmIChsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIHZhciBjbGVhclRpbWVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgaWYgKG9iai5yZXF1ZXN0SWQgJiYgdHlwZW9mIG9iai5zdGVwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9iai5zdGVwID0gbm9vcDtcbiAgICAgICAgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZShvYmoucmVxdWVzdElkKTtcbiAgICAgICAgb2JqLnJlcXVlc3RJZCA9IDA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzZXRUaW1lciA9IGZ1bmN0aW9uIChmbiwgZGVsYXksIHR5cGUpIHtcbiAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcbiAgICAgIGRlbGF5ID0gTWF0aC5tYXgoZGVsYXksIDApO1xuICAgICAgb2JqLnN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAobm93IC0gdGltZSA+IGRlbGF5KSB7XG4gICAgICAgICAgZm4oKTtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVyKG9iaik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWUgPSBub3c7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iai5yZXF1ZXN0SWQgPSBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZShvYmouc3RlcCk7XG4gICAgICB9O1xuICAgICAgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUob2JqLnN0ZXApO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgaWYgKG1ldGhvZE5hbWUgPT09ICdzZXRJbnRlcnZhbCcpIHtcbiAgICAgIHdyYXBwZWRNZXRob2QgPSBmdW5jdGlvbiAoZm4sIGRlbGF5KSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lcihmbiwgZGVsYXksICdpbnRlcnZhbCcpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1ldGhvZE5hbWUgPT09ICdzZXRUaW1lb3V0Jykge1xuICAgICAgd3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uIChmbiwgZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVyKGZuLCBkZWxheSwgJ3RpbWVvdXQnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnY2xlYXJUaW1lb3V0Jykge1xuICAgICAgd3JhcHBlZE1ldGhvZCA9IGNsZWFyVGltZXI7XG4gICAgfSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAnY2xlYXJJbnRlcnZhbCcpIHtcbiAgICAgIHdyYXBwZWRNZXRob2QgPSBjbGVhclRpbWVyO1xuICAgIH1cbiAgfVxuXG4gIGlmICghd3JhcHBlZE1ldGhvZCAmJiB0aGlzW21ldGhvZE5hbWVdKSB7XG4gICAgd3JhcHBlZE1ldGhvZCA9IHRoaXNbbWV0aG9kTmFtZV0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiB3cmFwcGVkTWV0aG9kO1xufVxuXG4vKipcbiAqIOiuvue9rumHjeWkjeiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lciNzZXRJbnRlcnZhbFxuICogQG1lbWJlcm9mIGZ4L3RpbWVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiDlrprml7bph43lpI3osIPnlKjnmoTlh73mlbBcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF0g6YeN5aSN6LCD55So55qE6Ze06ZqU5pe26Ze0KG1zKVxuICogQHJldHVybnMge09iamVjdH0g5a6a5pe25Zmo5a+56LGh77yM5Y+v5Lyg5YWlIGNsZWFySW50ZXJ2YWwg5pa55rOV5p2l57uI5q2i6L+Z5Liq5a6a5pe25ZmoXG4gKi9cblRpbWVyLnNldEludGVydmFsID0gZmFjdG9yeSgnc2V0SW50ZXJ2YWwnKTtcblxuLyoqXG4gKiDmuIXpmaTph43lpI3osIPnlKjlrprml7blmahcbiAqIEBtZXRob2QgdGltZXIjY2xlYXJJbnRlcnZhbFxuICogQG1lbWJlcm9mIGZ4L3RpbWVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIOWumuaXtuWZqOWvueixoVxuICovXG5UaW1lci5jbGVhckludGVydmFsID0gZmFjdG9yeSgnY2xlYXJJbnRlcnZhbCcpO1xuXG4vKipcbiAqIOiuvue9ruW7tuaXtuiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lciNzZXRUaW1lb3V0XG4gKiBAbWVtYmVyb2YgZngvdGltZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOW7tuaXtuiwg+eUqOeahOWHveaVsFxuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXSDlu7bml7bosIPnlKjnmoTpl7TpmpTml7bpl7QobXMpXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlrprml7blmajlr7nosaHvvIzlj6/kvKDlhaUgY2xlYXJUaW1lb3V0IOaWueazleadpee7iOatoui/meS4quWumuaXtuWZqFxuICovXG5UaW1lci5zZXRUaW1lb3V0ID0gZmFjdG9yeSgnc2V0VGltZW91dCcpO1xuXG4vKipcbiAqIOa4hemZpOW7tuaXtuiwg+eUqOWumuaXtuWZqFxuICogQG1ldGhvZCB0aW1lciNjbGVhclRpbWVvdXRcbiAqIEBtZW1iZXJvZiBmeC90aW1lclxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDlrprml7blmajlr7nosaFcbiAqL1xuVGltZXIuY2xlYXJUaW1lb3V0ID0gZmFjdG9yeSgnY2xlYXJUaW1lb3V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1taXhlZC1vcGVyYXRvcnMgKi9cbi8qKlxuICog5Yqo55S76L+Q6KGM5pa55byP5bqTXG4gKiAtIFBvd1xuICogLSBFeHBvXG4gKiAtIENpcmNcbiAqIC0gU2luZVxuICogLSBCYWNrXG4gKiAtIEJvdW5jZVxuICogLSBFbGFzdGljXG4gKiAtIFF1YWRcbiAqIC0gQ3ViaWNcbiAqIC0gUXVhcnRcbiAqIC0gUXVpbnRcbiAqIEBtb2R1bGUgZngvdHJhbnNpdGlvbnNcbiAqIEBzZWUgW21vb3Rvb2xzL0Z4LlRyYW5zaXRpb25zXShodHRwczovL21vb3Rvb2xzLm5ldC9jb3JlL2RvY3MvMS42LjAvRngvRnguVHJhbnNpdGlvbnMjRngtVHJhbnNpdGlvbnMpXG4gKiBAZXhhbXBsZVxuICogdmFyICRmeCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvZngvZngnKTtcbiAqIHZhciAkdHJhbnNpdGlvbnMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2Z4L3RyYW5zaXRpb25zJyk7XG4gKiBuZXcgJGZ4KHtcbiAqICAgdHJhbnNpdGlvbiA6ICR0cmFuc2l0aW9ucy5TaW5lLmVhc2VJbk91dFxuICogfSk7XG4gKiBuZXcgJGZ4KHtcbiAqICAgdHJhbnNpdGlvbiA6ICdTaW5lOkluJ1xuICogfSk7XG4gKiBuZXcgJGZ4KHtcbiAqICAgdHJhbnNpdGlvbiA6ICdTaW5lOkluOk91dCdcbiAqIH0pO1xuICovXG5cbnZhciAkdHlwZSA9IHJlcXVpcmUoJy4uL29iai90eXBlJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxudmFyICRmeCA9IHJlcXVpcmUoJy4vZngnKTtcblxuJGZ4LlRyYW5zaXRpb24gPSBmdW5jdGlvbiAodHJhbnNpdGlvbiwgcGFyYW1zKSB7XG4gIGlmICgkdHlwZShwYXJhbXMpICE9PSAnYXJyYXknKSB7XG4gICAgcGFyYW1zID0gW3BhcmFtc107XG4gIH1cbiAgdmFyIGVhc2VJbiA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICByZXR1cm4gdHJhbnNpdGlvbihwb3MsIHBhcmFtcyk7XG4gIH07XG4gIHJldHVybiAkYXNzaWduKGVhc2VJbiwge1xuICAgIGVhc2VJbjogZWFzZUluLFxuICAgIGVhc2VPdXQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAxIC0gdHJhbnNpdGlvbigxIC0gcG9zLCBwYXJhbXMpO1xuICAgIH0sXG4gICAgZWFzZUluT3V0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAocG9zIDw9IDAuNVxuICAgICAgICAgID8gdHJhbnNpdGlvbigyICogcG9zLCBwYXJhbXMpXG4gICAgICAgICAgOiAyIC0gdHJhbnNpdGlvbigyICogKDEgLSBwb3MpLCBwYXJhbXMpKSAvIDJcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG59O1xuXG52YXIgVHJhbnNpdGlvbnMgPSB7XG4gIGxpbmVhcjogZnVuY3Rpb24gKHplcm8pIHtcbiAgICByZXR1cm4gemVybztcbiAgfSxcbn07XG5cblRyYW5zaXRpb25zLmV4dGVuZCA9IGZ1bmN0aW9uICh0cmFuc2l0aW9ucykge1xuICBPYmplY3Qua2V5cyh0cmFuc2l0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgIFRyYW5zaXRpb25zW3RyYW5zaXRpb25dID0gbmV3ICRmeC5UcmFuc2l0aW9uKHRyYW5zaXRpb25zW3RyYW5zaXRpb25dKTtcbiAgfSk7XG59O1xuXG5UcmFuc2l0aW9ucy5leHRlbmQoe1xuICBQb3c6IGZ1bmN0aW9uIChwLCB4KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KHAsICh4ICYmIHhbMF0pIHx8IDYpO1xuICB9LFxuXG4gIEV4cG86IGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIDggKiAocCAtIDEpKTtcbiAgfSxcblxuICBDaXJjOiBmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiAxIC0gTWF0aC5zaW4oTWF0aC5hY29zKHApKTtcbiAgfSxcblxuICBTaW5lOiBmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiAxIC0gTWF0aC5jb3MocCAqIE1hdGguUEkgLyAyKTtcbiAgfSxcblxuICBCYWNrOiBmdW5jdGlvbiAocCwgeCkge1xuICAgIHggPSAoeCAmJiB4WzBdKSB8fCAxLjYxODtcbiAgICByZXR1cm4gTWF0aC5wb3cocCwgMikgKiAoKHggKyAxKSAqIHAgLSB4KTtcbiAgfSxcblxuICBCb3VuY2U6IGZ1bmN0aW9uIChwKSB7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhciBhID0gMDtcbiAgICB2YXIgYiA9IDE7XG4gICAgd2hpbGUgKHAgPCAoNyAtIDQgKiBhKSAvIDExKSB7XG4gICAgICB2YWx1ZSA9IGIgKiBiIC0gTWF0aC5wb3coKDExIC0gNiAqIGEgLSAxMSAqIHApIC8gNCwgMik7XG4gICAgICBhICs9IGI7XG4gICAgICBiIC89IDI7XG4gICAgfVxuICAgIHZhbHVlID0gYiAqIGIgLSBNYXRoLnBvdygoMTEgLSA2ICogYSAtIDExICogcCkgLyA0LCAyKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG5cbiAgRWxhc3RpYzogZnVuY3Rpb24gKHAsIHgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBsdXNwbHVzXG4gICAgICBNYXRoLnBvdygyLCAxMCAqIC0tcClcbiAgICAgICogTWF0aC5jb3MoMjAgKiBwICogTWF0aC5QSSAqICgoeCAmJiB4WzBdKSB8fCAxKSAvIDMpXG4gICAgKTtcbiAgfSxcbn0pO1xuXG5bJ1F1YWQnLCAnQ3ViaWMnLCAnUXVhcnQnLCAnUXVpbnQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0cmFuc2l0aW9uLCBpKSB7XG4gIFRyYW5zaXRpb25zW3RyYW5zaXRpb25dID0gbmV3ICRmeC5UcmFuc2l0aW9uKGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KHAsIGkgKyAyKTtcbiAgfSk7XG59KTtcblxuJGZ4LnN0YXRpY3Moe1xuICBnZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyYW5zID0gdGhpcy5vcHRpb25zLnRyYW5zaXRpb24gfHwgVHJhbnNpdGlvbnMuU2luZS5lYXNlSW5PdXQ7XG4gICAgaWYgKHR5cGVvZiB0cmFucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBkYXRhID0gdHJhbnMuc3BsaXQoJzonKTtcbiAgICAgIHRyYW5zID0gVHJhbnNpdGlvbnM7XG4gICAgICB0cmFucyA9IHRyYW5zW2RhdGFbMF1dIHx8IHRyYW5zW2RhdGFbMF1dO1xuICAgICAgaWYgKGRhdGFbMV0pIHtcbiAgICAgICAgdHJhbnMgPSB0cmFuc1snZWFzZScgKyBkYXRhWzFdICsgKGRhdGFbMl0gPyBkYXRhWzJdIDogJycpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zO1xuICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbnM7XG4iLCIvKipcbiAqIGFqYXgg6K+35rGC5pa55rOV77yM5L2/55So5pa55byP5LiOIGpRdWVyeSwgWmVwdG8g57G75Ly877yM5a+5IGpRdWVyeSwgWmVwdG8g5peg5L6d6LWWXG4gKiBAbWV0aG9kIGlvL2FqYXhcbiAqIEBzZWUgW2FqYXhdKGh0dHBzOi8vZ2l0aHViLmNvbS9Gb3JiZXNMaW5kZXNheS9hamF4KVxuICogQGV4YW1wbGVcbiAqIHZhciAkYWpheCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvaW8vYWpheCcpO1xuICogZG9jdW1lbnQuZG9tYWluID0gJ3FxLmNvbSc7XG4gKiAkYWpheCh7XG4gKiAgIHVybDogJ2h0dHA6Ly9hLnFxLmNvbS9mb3JtJyxcbiAqICAgZGF0YTogW3tcbiAqICAgICBuMTogJ3YxJyxcbiAqICAgICBuMjogJ3YyJ1xuICogICB9XSxcbiAqICAgc3VjY2VzczogZnVuY3Rpb24gKHJzKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKHJzKTtcbiAqICAgfVxuICogfSk7XG4gKi9cblxudmFyIHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpXG5cbnZhciBqc29ucElEID0gMCxcbiAgICBrZXksXG4gICAgbmFtZSxcbiAgICByc2NyaXB0ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2ksXG4gICAgc2NyaXB0VHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL2phdmFzY3JpcHQvaSxcbiAgICB4bWxUeXBlUkUgPSAvXig/OnRleHR8YXBwbGljYXRpb24pXFwveG1sL2ksXG4gICAganNvblR5cGUgPSAnYXBwbGljYXRpb24vanNvbicsXG4gICAgaHRtbFR5cGUgPSAndGV4dC9odG1sJyxcbiAgICBibGFua1JFID0gL15cXHMqJC9cblxudmFyIGFqYXggPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICB2YXIgc2V0dGluZ3MgPSBleHRlbmQoe30sIG9wdGlvbnMgfHwge30pXG4gIGZvciAoa2V5IGluIGFqYXguc2V0dGluZ3MpIGlmIChzZXR0aW5nc1trZXldID09PSB1bmRlZmluZWQpIHNldHRpbmdzW2tleV0gPSBhamF4LnNldHRpbmdzW2tleV1cblxuICBhamF4U3RhcnQoc2V0dGluZ3MpXG5cbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikgc2V0dGluZ3MuY3Jvc3NEb21haW4gPSAvXihbXFx3LV0rOik/XFwvXFwvKFteXFwvXSspLy50ZXN0KHNldHRpbmdzLnVybCkgJiZcbiAgICBSZWdFeHAuJDIgIT0gd2luZG93LmxvY2F0aW9uLmhvc3RcblxuICB2YXIgZGF0YVR5cGUgPSBzZXR0aW5ncy5kYXRhVHlwZSwgaGFzUGxhY2Vob2xkZXIgPSAvPVxcPy8udGVzdChzZXR0aW5ncy51cmwpXG4gIGlmIChkYXRhVHlwZSA9PSAnanNvbnAnIHx8IGhhc1BsYWNlaG9sZGVyKSB7XG4gICAgaWYgKCFoYXNQbGFjZWhvbGRlcikgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLCAnY2FsbGJhY2s9PycpXG4gICAgcmV0dXJuIGFqYXguSlNPTlAoc2V0dGluZ3MpXG4gIH1cblxuICBpZiAoIXNldHRpbmdzLnVybCkgc2V0dGluZ3MudXJsID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcbiAgc2VyaWFsaXplRGF0YShzZXR0aW5ncylcblxuICB2YXIgbWltZSA9IHNldHRpbmdzLmFjY2VwdHNbZGF0YVR5cGVdLFxuICAgICAgYmFzZUhlYWRlcnMgPSB7IH0sXG4gICAgICBwcm90b2NvbCA9IC9eKFtcXHctXSs6KVxcL1xcLy8udGVzdChzZXR0aW5ncy51cmwpID8gUmVnRXhwLiQxIDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sLFxuICAgICAgeGhyID0gYWpheC5zZXR0aW5ncy54aHIoKSwgYWJvcnRUaW1lb3V0XG5cbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikgYmFzZUhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXSA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgaWYgKG1pbWUpIHtcbiAgICBiYXNlSGVhZGVyc1snQWNjZXB0J10gPSBtaW1lXG4gICAgaWYgKG1pbWUuaW5kZXhPZignLCcpID4gLTEpIG1pbWUgPSBtaW1lLnNwbGl0KCcsJywgMilbMF1cbiAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSAmJiB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lKVxuICB9XG4gIGlmIChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAoc2V0dGluZ3MuZGF0YSAmJiBzZXR0aW5ncy50eXBlLnRvVXBwZXJDYXNlKCkgIT0gJ0dFVCcpKVxuICAgIGJhc2VIZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgc2V0dGluZ3MuaGVhZGVycyA9IGV4dGVuZChiYXNlSGVhZGVycywgc2V0dGluZ3MuaGVhZGVycyB8fCB7fSlcblxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGFib3J0VGltZW91dClcbiAgICAgIHZhciByZXN1bHQsIGVycm9yID0gZmFsc2VcbiAgICAgIGlmICgoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgfHwgeGhyLnN0YXR1cyA9PSAzMDQgfHwgKHhoci5zdGF0dXMgPT0gMCAmJiBwcm90b2NvbCA9PSAnZmlsZTonKSkge1xuICAgICAgICBkYXRhVHlwZSA9IGRhdGFUeXBlIHx8IG1pbWVUb0RhdGFUeXBlKHhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJykpXG4gICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChkYXRhVHlwZSA9PSAnc2NyaXB0JykgICAgKDEsZXZhbCkocmVzdWx0KVxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICd4bWwnKSAgcmVzdWx0ID0geGhyLnJlc3BvbnNlWE1MXG4gICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT0gJ2pzb24nKSByZXN1bHQgPSBibGFua1JFLnRlc3QocmVzdWx0KSA/IG51bGwgOiBKU09OLnBhcnNlKHJlc3VsdClcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBlcnJvciA9IGUgfVxuXG4gICAgICAgIGlmIChlcnJvcikgYWpheEVycm9yKGVycm9yLCAncGFyc2VyZXJyb3InLCB4aHIsIHNldHRpbmdzKVxuICAgICAgICBlbHNlIGFqYXhTdWNjZXNzKHJlc3VsdCwgeGhyLCBzZXR0aW5ncylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFqYXhFcnJvcihudWxsLCAnZXJyb3InLCB4aHIsIHNldHRpbmdzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBhc3luYyA9ICdhc3luYycgaW4gc2V0dGluZ3MgPyBzZXR0aW5ncy5hc3luYyA6IHRydWVcbiAgeGhyLm9wZW4oc2V0dGluZ3MudHlwZSwgc2V0dGluZ3MudXJsLCBhc3luYylcblxuICBmb3IgKG5hbWUgaW4gc2V0dGluZ3MuaGVhZGVycykgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgc2V0dGluZ3MuaGVhZGVyc1tuYW1lXSlcblxuICBpZiAoYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlKSB7XG4gICAgeGhyLmFib3J0KClcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmIChzZXR0aW5ncy50aW1lb3V0ID4gMCkgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGVtcHR5XG4gICAgICB4aHIuYWJvcnQoKVxuICAgICAgYWpheEVycm9yKG51bGwsICd0aW1lb3V0JywgeGhyLCBzZXR0aW5ncylcbiAgICB9LCBzZXR0aW5ncy50aW1lb3V0KVxuXG4gIC8vIGF2b2lkIHNlbmRpbmcgZW1wdHkgc3RyaW5nICgjMzE5KVxuICB4aHIuc2VuZChzZXR0aW5ncy5kYXRhID8gc2V0dGluZ3MuZGF0YSA6IG51bGwpXG4gIHJldHVybiB4aHJcbn1cblxuXG4vLyB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IGFuZCByZXR1cm4gZmFsc2UgaWYgaXQgd2FzIGNhbmNlbGxlZFxuZnVuY3Rpb24gdHJpZ2dlckFuZFJldHVybihjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcbiAgLy90b2RvOiBGaXJlIG9mZiBzb21lIGV2ZW50c1xuICAvL3ZhciBldmVudCA9ICQuRXZlbnQoZXZlbnROYW1lKVxuICAvLyQoY29udGV4dCkudHJpZ2dlcihldmVudCwgZGF0YSlcbiAgcmV0dXJuIHRydWU7Ly8hZXZlbnQuZGVmYXVsdFByZXZlbnRlZFxufVxuXG4vLyB0cmlnZ2VyIGFuIEFqYXggXCJnbG9iYWxcIiBldmVudFxuZnVuY3Rpb24gdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwpIHJldHVybiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQgfHwgZG9jdW1lbnQsIGV2ZW50TmFtZSwgZGF0YSlcbn1cblxuLy8gTnVtYmVyIG9mIGFjdGl2ZSBBamF4IHJlcXVlc3RzXG5hamF4LmFjdGl2ZSA9IDBcblxuZnVuY3Rpb24gYWpheFN0YXJ0KHNldHRpbmdzKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwgJiYgYWpheC5hY3RpdmUrKyA9PT0gMCkgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgbnVsbCwgJ2FqYXhTdGFydCcpXG59XG5mdW5jdGlvbiBhamF4U3RvcChzZXR0aW5ncykge1xuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmICEoLS1hamF4LmFjdGl2ZSkpIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RvcCcpXG59XG5cbi8vIHRyaWdnZXJzIGFuIGV4dHJhIGdsb2JhbCBldmVudCBcImFqYXhCZWZvcmVTZW5kXCIgdGhhdCdzIGxpa2UgXCJhamF4U2VuZFwiIGJ1dCBjYW5jZWxhYmxlXG5mdW5jdGlvbiBhamF4QmVmb3JlU2VuZCh4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICBpZiAoc2V0dGluZ3MuYmVmb3JlU2VuZC5jYWxsKGNvbnRleHQsIHhociwgc2V0dGluZ3MpID09PSBmYWxzZSB8fFxuICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhCZWZvcmVTZW5kJywgW3hociwgc2V0dGluZ3NdKSA9PT0gZmFsc2UpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTZW5kJywgW3hociwgc2V0dGluZ3NdKVxufVxuZnVuY3Rpb24gYWpheFN1Y2Nlc3MoZGF0YSwgeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHQsIHN0YXR1cyA9ICdzdWNjZXNzJ1xuICBzZXR0aW5ncy5zdWNjZXNzLmNhbGwoY29udGV4dCwgZGF0YSwgc3RhdHVzLCB4aHIpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4U3VjY2VzcycsIFt4aHIsIHNldHRpbmdzLCBkYXRhXSlcbiAgYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncylcbn1cbi8vIHR5cGU6IFwidGltZW91dFwiLCBcImVycm9yXCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXG5mdW5jdGlvbiBhamF4RXJyb3IoZXJyb3IsIHR5cGUsIHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIHNldHRpbmdzLmVycm9yLmNhbGwoY29udGV4dCwgeGhyLCB0eXBlLCBlcnJvcilcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhFcnJvcicsIFt4aHIsIHNldHRpbmdzLCBlcnJvcl0pXG4gIGFqYXhDb21wbGV0ZSh0eXBlLCB4aHIsIHNldHRpbmdzKVxufVxuLy8gc3RhdHVzOiBcInN1Y2Nlc3NcIiwgXCJub3Rtb2RpZmllZFwiLCBcImVycm9yXCIsIFwidGltZW91dFwiLCBcImFib3J0XCIsIFwicGFyc2VyZXJyb3JcIlxuZnVuY3Rpb24gYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgc2V0dGluZ3MuY29tcGxldGUuY2FsbChjb250ZXh0LCB4aHIsIHN0YXR1cylcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhDb21wbGV0ZScsIFt4aHIsIHNldHRpbmdzXSlcbiAgYWpheFN0b3Aoc2V0dGluZ3MpXG59XG5cbi8vIEVtcHR5IGZ1bmN0aW9uLCB1c2VkIGFzIGRlZmF1bHQgY2FsbGJhY2tcbmZ1bmN0aW9uIGVtcHR5KCkge31cblxuYWpheC5KU09OUCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICBpZiAoISgndHlwZScgaW4gb3B0aW9ucykpIHJldHVybiBhamF4KG9wdGlvbnMpXG5cbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdqc29ucCcgKyAoKytqc29ucElEKSxcbiAgICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSxcbiAgICBhYm9ydCA9IGZ1bmN0aW9uKCl7XG4gICAgICAvL3RvZG86IHJlbW92ZSBzY3JpcHRcbiAgICAgIC8vJChzY3JpcHQpLnJlbW92ZSgpXG4gICAgICBpZiAoY2FsbGJhY2tOYW1lIGluIHdpbmRvdykgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBlbXB0eVxuICAgICAgYWpheENvbXBsZXRlKCdhYm9ydCcsIHhociwgb3B0aW9ucylcbiAgICB9LFxuICAgIHhociA9IHsgYWJvcnQ6IGFib3J0IH0sIGFib3J0VGltZW91dCxcbiAgICBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdXG4gICAgICB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblxuICBpZiAob3B0aW9ucy5lcnJvcikgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB4aHIuYWJvcnQoKVxuICAgIG9wdGlvbnMuZXJyb3IoKVxuICB9XG5cbiAgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKXtcbiAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxuICAgICAgLy90b2RvOiByZW1vdmUgc2NyaXB0XG4gICAgICAvLyQoc2NyaXB0KS5yZW1vdmUoKVxuICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tOYW1lXVxuICAgIGFqYXhTdWNjZXNzKGRhdGEsIHhociwgb3B0aW9ucylcbiAgfVxuXG4gIHNlcmlhbGl6ZURhdGEob3B0aW9ucylcbiAgc2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsLnJlcGxhY2UoLz1cXD8vLCAnPScgKyBjYWxsYmFja05hbWUpXG5cbiAgLy8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkIHRvIGNpcmN1bXZlbnQgYW4gSUU2IGJ1Zy5cbiAgLy8gVGhpcyBhcmlzZXMgd2hlbiBhIGJhc2Ugbm9kZSBpcyB1c2VkIChzZWUgalF1ZXJ5IGJ1Z3MgIzI3MDkgYW5kICM0Mzc4KS5cbiAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQpO1xuXG4gIGlmIChvcHRpb25zLnRpbWVvdXQgPiAwKSBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgICAgYWpheENvbXBsZXRlKCd0aW1lb3V0JywgeGhyLCBvcHRpb25zKVxuICAgIH0sIG9wdGlvbnMudGltZW91dClcblxuICByZXR1cm4geGhyXG59XG5cbmFqYXguc2V0dGluZ3MgPSB7XG4gIC8vIERlZmF1bHQgdHlwZSBvZiByZXF1ZXN0XG4gIHR5cGU6ICdHRVQnLFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGJlZm9yZSByZXF1ZXN0XG4gIGJlZm9yZVNlbmQ6IGVtcHR5LFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXG4gIHN1Y2Nlc3M6IGVtcHR5LFxuICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIHRoZSB0aGUgc2VydmVyIGRyb3BzIGVycm9yXG4gIGVycm9yOiBlbXB0eSxcbiAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBvbiByZXF1ZXN0IGNvbXBsZXRlIChib3RoOiBlcnJvciBhbmQgc3VjY2VzcylcbiAgY29tcGxldGU6IGVtcHR5LFxuICAvLyBUaGUgY29udGV4dCBmb3IgdGhlIGNhbGxiYWNrc1xuICBjb250ZXh0OiBudWxsLFxuICAvLyBXaGV0aGVyIHRvIHRyaWdnZXIgXCJnbG9iYWxcIiBBamF4IGV2ZW50c1xuICBnbG9iYWw6IHRydWUsXG4gIC8vIFRyYW5zcG9ydFxuICB4aHI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG4gIH0sXG4gIC8vIE1JTUUgdHlwZXMgbWFwcGluZ1xuICBhY2NlcHRzOiB7XG4gICAgc2NyaXB0OiAndGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcbiAgICBqc29uOiAgIGpzb25UeXBlLFxuICAgIHhtbDogICAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnLFxuICAgIGh0bWw6ICAgaHRtbFR5cGUsXG4gICAgdGV4dDogICAndGV4dC9wbGFpbidcbiAgfSxcbiAgLy8gV2hldGhlciB0aGUgcmVxdWVzdCBpcyB0byBhbm90aGVyIGRvbWFpblxuICBjcm9zc0RvbWFpbjogZmFsc2UsXG4gIC8vIERlZmF1bHQgdGltZW91dFxuICB0aW1lb3V0OiAwXG59XG5cbmZ1bmN0aW9uIG1pbWVUb0RhdGFUeXBlKG1pbWUpIHtcbiAgcmV0dXJuIG1pbWUgJiYgKCBtaW1lID09IGh0bWxUeXBlID8gJ2h0bWwnIDpcbiAgICBtaW1lID09IGpzb25UeXBlID8gJ2pzb24nIDpcbiAgICBzY3JpcHRUeXBlUkUudGVzdChtaW1lKSA/ICdzY3JpcHQnIDpcbiAgICB4bWxUeXBlUkUudGVzdChtaW1lKSAmJiAneG1sJyApIHx8ICd0ZXh0J1xufVxuXG5mdW5jdGlvbiBhcHBlbmRRdWVyeSh1cmwsIHF1ZXJ5KSB7XG4gIHJldHVybiAodXJsICsgJyYnICsgcXVlcnkpLnJlcGxhY2UoL1smP117MSwyfS8sICc/Jylcbn1cblxuLy8gc2VyaWFsaXplIHBheWxvYWQgYW5kIGFwcGVuZCBpdCB0byB0aGUgVVJMIGZvciBHRVQgcmVxdWVzdHNcbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuICBpZiAodHlwZShvcHRpb25zLmRhdGEpID09PSAnb2JqZWN0Jykgb3B0aW9ucy5kYXRhID0gcGFyYW0ob3B0aW9ucy5kYXRhKVxuICBpZiAob3B0aW9ucy5kYXRhICYmICghb3B0aW9ucy50eXBlIHx8IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpID09ICdHRVQnKSlcbiAgICBvcHRpb25zLnVybCA9IGFwcGVuZFF1ZXJ5KG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEpXG59XG5cbmFqYXguZ2V0ID0gZnVuY3Rpb24odXJsLCBzdWNjZXNzKXsgcmV0dXJuIGFqYXgoeyB1cmw6IHVybCwgc3VjY2Vzczogc3VjY2VzcyB9KSB9XG5cbmFqYXgucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUpe1xuICBpZiAodHlwZShkYXRhKSA9PT0gJ2Z1bmN0aW9uJykgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBzdWNjZXNzLCBzdWNjZXNzID0gZGF0YSwgZGF0YSA9IG51bGxcbiAgcmV0dXJuIGFqYXgoeyB0eXBlOiAnUE9TVCcsIHVybDogdXJsLCBkYXRhOiBkYXRhLCBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhVHlwZTogZGF0YVR5cGUgfSlcbn1cblxuYWpheC5nZXRKU09OID0gZnVuY3Rpb24odXJsLCBzdWNjZXNzKXtcbiAgcmV0dXJuIGFqYXgoeyB1cmw6IHVybCwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6ICdqc29uJyB9KVxufVxuXG52YXIgZXNjYXBlID0gZW5jb2RlVVJJQ29tcG9uZW50XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwsIHNjb3BlKXtcbiAgdmFyIGFycmF5ID0gdHlwZShvYmopID09PSAnYXJyYXknO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICBpZiAoc2NvcGUpIGtleSA9IHRyYWRpdGlvbmFsID8gc2NvcGUgOiBzY29wZSArICdbJyArIChhcnJheSA/ICcnIDoga2V5KSArICddJ1xuICAgIC8vIGhhbmRsZSBkYXRhIGluIHNlcmlhbGl6ZUFycmF5KCkgZm9ybWF0XG4gICAgaWYgKCFzY29wZSAmJiBhcnJheSkgcGFyYW1zLmFkZCh2YWx1ZS5uYW1lLCB2YWx1ZS52YWx1ZSlcbiAgICAvLyByZWN1cnNlIGludG8gbmVzdGVkIG9iamVjdHNcbiAgICBlbHNlIGlmICh0cmFkaXRpb25hbCA/ICh0eXBlKHZhbHVlKSA9PT0gJ2FycmF5JykgOiAodHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnKSlcbiAgICAgIHNlcmlhbGl6ZShwYXJhbXMsIHZhbHVlLCB0cmFkaXRpb25hbCwga2V5KVxuICAgIGVsc2UgcGFyYW1zLmFkZChrZXksIHZhbHVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhcmFtKG9iaiwgdHJhZGl0aW9uYWwpe1xuICB2YXIgcGFyYW1zID0gW11cbiAgcGFyYW1zLmFkZCA9IGZ1bmN0aW9uKGssIHYpeyB0aGlzLnB1c2goZXNjYXBlKGspICsgJz0nICsgZXNjYXBlKHYpKSB9XG4gIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwpXG4gIHJldHVybiBwYXJhbXMuam9pbignJicpLnJlcGxhY2UoJyUyMCcsICcrJylcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4gIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIGZvciAoa2V5IGluIHNvdXJjZSlcbiAgICAgIGlmIChzb3VyY2Vba2V5XSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gIH0pXG4gIHJldHVybiB0YXJnZXRcbn1cbiIsIi8qKlxuICog5Yqg6L29IHNjcmlwdCDmlofku7ZcbiAqIEBtZXRob2QgaW8vZ2V0U2NyaXB0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDpgInpoblcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnNyYyBzY3JpcHQg5Zyw5Z2AXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2hhcnNldD0ndXRmLTgnXSBzY3JpcHQg57yW56CBXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkxvYWRdIHNjcmlwdCDliqDovb3lrozmiJDnmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFNjcmlwdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvaW8vZ2V0U2NyaXB0Jyk7XG4gKiAkZ2V0U2NyaXB0KHtcbiAqICAgc3JjOiAnaHR0cHM6Ly9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTMuMy4xLm1pbi5qcycsXG4gKiAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICogICAgIGNvbnNvbGUuaW5mbyh3aW5kb3cualF1ZXJ5KTtcbiAqICAgfVxuICogfSk7XG4gKi9cblxuZnVuY3Rpb24gZ2V0U2NyaXB0KG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHNyYyA9IG9wdGlvbnMuc3JjIHx8ICcnO1xuICB2YXIgY2hhcnNldCA9IG9wdGlvbnMuY2hhcnNldCB8fCAnJztcbiAgdmFyIG9uTG9hZCA9IG9wdGlvbnMub25Mb2FkIHx8IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LmFzeW5jID0gJ2FzeW5jJztcbiAgc2NyaXB0LnNyYyA9IHNyYztcblxuICBpZiAoY2hhcnNldCkge1xuICAgIHNjcmlwdC5jaGFyc2V0ID0gY2hhcnNldDtcbiAgfVxuICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnJlYWR5U3RhdGVcbiAgICAgIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCdcbiAgICAgIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuICAgICkge1xuICAgICAgaWYgKHR5cGVvZiBvbkxvYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb25Mb2FkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ubG9hZCA9IG51bGw7XG4gICAgICB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgfVxuICB9O1xuICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICByZXR1cm4gc2NyaXB0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFNjcmlwdDtcbiIsIi8qKlxuICog5bCB6KOFIGlmcmFtZSBwb3N0IOaooeW8j1xuICogLSByZXF1aXJlcyBqUXVlcnkvWmVwdG9cbiAqIEBtZXRob2QgaW8vaWZyYW1lUG9zdFxuICogQHBhcmFtIHtPYmplY3R9IHNwZWMg6K+35rGC6YCJ6aG5XG4gKiBAcGFyYW0ge09iamVjdH0gW3NwZWMuZm9ybT1udWxsXSDopoHor7fmsYLnmoTooajljZVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnVybCDor7fmsYLlnLDlnYBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBzcGVjLmRhdGEg6K+35rGC5pWw5o2uXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NwZWMudGFyZ2V0PScnXSDnm67moIcgaWZyYW1lIOWQjeensFxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLm1ldGhvZD0ncG9zdCddIOivt+axguaWueW8j1xuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmFjY2VwdENoYXJzZXQ9JyddIOivt+axguebruagh+eahOe8lueggVxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmpzb25wPSdjYWxsYmFjayddIOS8oOmAkue7meaOpeWPo+eahOWbnuiwg+WPguaVsOWQjeensFxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGVjLmpzb25wTWV0aG9kPScnXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlj4LmlbDnmoTkvKDpgJLmlrnlvI/vvIzlj6/pgIlbJ3Bvc3QnLCAnZ2V0J11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucENhbGxiYWNrPScnXSDkvKDpgJLnu5nmjqXlj6PnmoTlm57osIPlh73mlbDlkI3np7DvvIzpu5jorqToh6rliqjnlJ/miJBcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5qc29ucEFkZFBhcmVudD0nJ10g5Lyg6YCS57uZ5o6l5Y+j55qE5Zue6LCD5Ye95pWw5ZCN56ew6ZyA6KaB6ZmE5bim55qE5YmN57yA6LCD55So6Lev5b6EXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5jb21wbGV0ZV0g6I635b6X5pWw5o2u55qE5Zue6LCD5Ye95pWwXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc3BlYy5zdWNjZXNzXSDmiJDlip/ojrflvpfmlbDmja7nmoTlm57osIPlh73mlbBcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGlmcmFtZVBvc3QgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2lvL2lmcmFtZVBvc3QnKTtcbiAqIGRvY3VtZW50LmRvbWFpbiA9ICdxcS5jb20nO1xuICogaWZyYW1lUG9zdCh7XG4gKiAgIHVybDogJ2h0dHA6Ly9hLnFxLmNvbS9mb3JtJyxcbiAqICAgZGF0YTogW3tcbiAqICAgICBuMTogJ3YxJyxcbiAqICAgICBuMjogJ3YyJ1xuICogICB9XSxcbiAqICAgc3VjY2VzczogZnVuY3Rpb24gKHJzKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKHJzKTtcbiAqICAgfVxuICogfSk7XG4gKi9cblxudmFyIGhpZGRlbkRpdiA9IG51bGw7XG5cbmZ1bmN0aW9uIGdldCQoKSB7XG4gIHZhciAkO1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAkID0gd2luZG93LiQgfHwgd2luZG93LmpRdWVyeSB8fCB3aW5kb3cuWmVwdG87XG4gIH1cbiAgaWYgKCEkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWVkIHdpbmRkb3cuJCBsaWtlIGpRdWVyeSBvciBaZXB0by4nKTtcbiAgfVxuICByZXR1cm4gJDtcbn1cblxuZnVuY3Rpb24gZ2V0SGlkZGVuQm94KCkge1xuICB2YXIgJCA9IGdldCQoKTtcbiAgaWYgKGhpZGRlbkRpdiA9PT0gbnVsbCkge1xuICAgIGhpZGRlbkRpdiA9ICQoJzxkaXYvPicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgaGlkZGVuRGl2LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICB9XG4gIHJldHVybiBoaWRkZW5EaXY7XG59XG5cbmZ1bmN0aW9uIGdldEZvcm0oKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICB2YXIgZm9ybSA9ICQoJzxmb3JtIHN0eWxlPVwiZGlzcGxheTpub25lO1wiPjwvZm9ybT4nKTtcbiAgZm9ybS5hcHBlbmRUbyhnZXRIaWRkZW5Cb3goKSk7XG4gIHJldHVybiBmb3JtO1xufVxuXG5mdW5jdGlvbiBnZXRIaWRkZW5JbnB1dChmb3JtLCBuYW1lKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICB2YXIgaW5wdXQgPSAkKGZvcm0pLmZpbmQoJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyk7XG4gIGlmICghaW5wdXQuZ2V0KDApKSB7XG4gICAgaW5wdXQgPSAkKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInICsgbmFtZSArICdcIiB2YWx1ZT1cIlwiLz4nKTtcbiAgICBpbnB1dC5hcHBlbmRUbyhmb3JtKTtcbiAgfVxuICByZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIGdldElmcmFtZShuYW1lKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICB2YXIgaHRtbCA9IFtcbiAgICAnPGlmcmFtZScsXG4gICAgJ2lkPVwiJyArIG5hbWUgKyAnXCIgJyxcbiAgICAnbmFtZT1cIicgKyBuYW1lICsgJ1wiJyxcbiAgICAnc3JjPVwiYWJvdXQ6YmxhbmtcIicsXG4gICAgJ3N0eWxlPVwiZGlzcGxheTpub25lO1wiPjwvaWZyYW1lPicsXG4gIF0uam9pbignICcpO1xuICB2YXIgaWZyYW1lID0gJChodG1sKTtcbiAgaWZyYW1lLmFwcGVuZFRvKGdldEhpZGRlbkJveCgpKTtcbiAgcmV0dXJuIGlmcmFtZTtcbn1cblxuZnVuY3Rpb24gaWZyYW1lUG9zdChzcGVjKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICB2YXIgY29uZiA9ICQuZXh0ZW5kKHtcbiAgICBmb3JtOiBudWxsLFxuICAgIHVybDogJycsXG4gICAgZGF0YTogW10sXG4gICAgdGFyZ2V0OiAnJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBhY2NlcHRDaGFyc2V0OiAnJyxcbiAgICBqc29ucDogJ2NhbGxiYWNrJyxcbiAgICBqc29ucE1ldGhvZDogJycsXG4gICAganNvbnBDYWxsYmFjazogJycsXG4gICAganNvbnBBZGRQYXJlbnQ6ICcnLFxuICAgIGNvbXBsZXRlOiAkLm5vb3AsXG4gICAgc3VjY2VzczogJC5ub29wLFxuICB9LCBzcGVjKTtcblxuICB2YXIgdGhhdCA9IHt9O1xuICB0aGF0LnVybCA9IGNvbmYudXJsO1xuXG4gIHRoYXQuanNvbnAgPSBjb25mLmpzb25wIHx8ICdjYWxsYmFjayc7XG4gIHRoYXQubWV0aG9kID0gY29uZi5tZXRob2QgfHwgJ3Bvc3QnO1xuICB0aGF0Lmpzb25wTWV0aG9kID0gJC50eXBlKGNvbmYuanNvbnBNZXRob2QpID09PSAnc3RyaW5nJ1xuICAgID8gY29uZi5qc29ucE1ldGhvZC50b0xvd2VyQ2FzZSgpXG4gICAgOiAnJztcblxuICB2YXIgZm9ybSA9ICQoY29uZi5mb3JtKTtcbiAgaWYgKCFmb3JtLmxlbmd0aCkge1xuICAgIGZvcm0gPSBnZXRGb3JtKCk7XG5cbiAgICB2YXIgaHRtbCA9IFtdO1xuICAgIGlmICgkLmlzQXJyYXkoY29uZi5kYXRhKSkge1xuICAgICAgJC5lYWNoKGNvbmYuZGF0YSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5wdXRIdG1sID0gW1xuICAgICAgICAgICc8aW5wdXQnLFxuICAgICAgICAgICd0eXBlPVwiaGlkZGVuXCInLFxuICAgICAgICAgICduYW1lPVwiJyArIGl0ZW0ubmFtZSArICdcIicsXG4gICAgICAgICAgJ3ZhbHVlPVwiJyArIGl0ZW0udmFsdWUgKyAnXCI+JyxcbiAgICAgICAgXS5qb2luKCcgJyk7XG4gICAgICAgIGh0bWwucHVzaChpbnB1dEh0bWwpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICgkLmlzUGxhaW5PYmplY3QoY29uZi5kYXRhKSkge1xuICAgICAgJC5lYWNoKGNvbmYuZGF0YSwgZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBpbnB1dEh0bWwgPSBbXG4gICAgICAgICAgJzxpbnB1dCcsXG4gICAgICAgICAgJ3R5cGU9XCJoaWRkZW5cIicsXG4gICAgICAgICAgJ25hbWU9XCInICsgbmFtZSArICdcIicsXG4gICAgICAgICAgJ3ZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPicsXG4gICAgICAgIF0uam9pbignICcpO1xuICAgICAgICBodG1sLnB1c2goaW5wdXRIdG1sKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAkKGh0bWwuam9pbignJykpLmFwcGVuZFRvKGZvcm0pO1xuICB9XG4gIHRoYXQuZm9ybSA9IGZvcm07XG4gIHRoYXQuY29uZiA9IGNvbmY7XG5cbiAgdmFyIHRpbWVTdGFtcCA9ICtuZXcgRGF0ZSgpO1xuICB2YXIgaWZyYW1lTmFtZSA9ICdpZnJhbWUnICsgdGltZVN0YW1wO1xuXG4gIHRoYXQudGltZVN0YW1wID0gdGltZVN0YW1wO1xuICB0aGF0LmlmcmFtZU5hbWUgPSBpZnJhbWVOYW1lO1xuXG4gIGlmIChjb25mLmFjY2VwdENoYXJzZXQpIHtcbiAgICBmb3JtLmF0dHIoJ2FjY2VwdC1jaGFyc2V0JywgY29uZi5hY2NlcHRDaGFyc2V0KTtcbiAgICB0aGF0LmFjY2VwdENoYXJzZXQgPSBjb25mLmFjY2VwdENoYXJzZXQ7XG4gIH1cblxuICB2YXIgaWZyYW1lID0gbnVsbDtcbiAgdmFyIHRhcmdldCA9ICcnO1xuICBpZiAoY29uZi50YXJnZXQpIHtcbiAgICB0YXJnZXQgPSBjb25mLnRhcmdldDtcbiAgICBpZiAoWydfYmxhbmsnLCAnX3NlbGYnLCAnX3BhcmVudCcsICdfdG9wJ10uaW5kZXhPZihjb25mLnRhcmdldCkgPCAwKSB7XG4gICAgICBpZnJhbWUgPSAkKCdpZnJhbWVbbmFtZT1cIicgKyBjb25mLnRhcmdldCArICdcIl0nKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gaWZyYW1lTmFtZTtcbiAgICBpZnJhbWUgPSBnZXRJZnJhbWUoaWZyYW1lTmFtZSk7XG4gIH1cbiAgZm9ybS5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpO1xuICB0aGF0LnRhcmdldCA9IHRhcmdldDtcbiAgdGhhdC5pZnJhbWUgPSBpZnJhbWU7XG5cbiAgdmFyIGpzb25wQ2FsbGJhY2sgPSBjb25mLmpzb25wQ2FsbGJhY2sgfHwgJ2lmcmFtZUNhbGxiYWNrJyArIHRpbWVTdGFtcDtcbiAgdGhhdC5qc29ucENhbGxiYWNrID0ganNvbnBDYWxsYmFjaztcblxuICBpZiAoIXRoYXQuanNvbnBNZXRob2QgfHwgdGhhdC5qc29ucE1ldGhvZCA9PT0gJ3Bvc3QnKSB7XG4gICAgdmFyIGlucHV0ID0gZ2V0SGlkZGVuSW5wdXQoZm9ybSwgdGhhdC5qc29ucCk7XG4gICAgaW5wdXQudmFsKGNvbmYuanNvbnBBZGRQYXJlbnQgKyBqc29ucENhbGxiYWNrKTtcbiAgfSBlbHNlIGlmICh0aGF0Lmpzb25wTWV0aG9kID09PSAnZ2V0Jykge1xuICAgIHRoYXQudXJsID0gdGhhdC51cmxcbiAgICAgICsgKHRoYXQudXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKVxuICAgICAgKyB0aGF0Lmpzb25wXG4gICAgICArICc9J1xuICAgICAgKyBqc29ucENhbGxiYWNrO1xuICB9XG5cbiAgaWYgKCFjb25mLmpzb25wQ2FsbGJhY2spIHtcbiAgICB0aGF0LmNhbGxiYWNrID0gZnVuY3Rpb24gKHJzKSB7XG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKGNvbmYuc3VjY2VzcykpIHtcbiAgICAgICAgY29uZi5zdWNjZXNzKHJzLCB0aGF0LCAnc3VjY2VzcycpO1xuICAgICAgfVxuICAgICAgaWYgKCQuaXNGdW5jdGlvbihjb25mLmNvbXBsZXRlKSkge1xuICAgICAgICBjb25mLmNvbXBsZXRlKHJzLCB0aGF0LCAnc3VjY2VzcycpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2luZG93W2pzb25wQ2FsbGJhY2tdID0gdGhhdC5jYWxsYmFjaztcbiAgfVxuXG4gIGZvcm0uYXR0cih7XG4gICAgYWN0aW9uOiB0aGF0LnVybCxcbiAgICBtZXRob2Q6IHRoYXQubWV0aG9kLFxuICB9KTtcblxuICBmb3JtLnN1Ym1pdCgpO1xuXG4gIHJldHVybiB0aGF0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlmcmFtZVBvc3Q7XG4iLCIvKipcbiAqIOWkhOeQhue9kee7nOS6pOS6klxuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvaW9cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1Nwb3JlVUkvc3BvcmUta2l0L3RyZWUvbWFzdGVyL3BhY2thZ2VzL2lvXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuaW8uZ2V0U2NyaXB0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaUgQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9pb1xuICogdmFyICRpbyA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvaW8nKTtcbiAqIGNvbnNvbGUuaW5mbygkaW8uZ2V0U2NyaXB0KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZ2V0U2NyaXB0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9pby9nZXRTY3JpcHQnKTtcbiAqL1xuXG5leHBvcnRzLmFqYXggPSByZXF1aXJlKCcuL2FqYXgnKTtcbmV4cG9ydHMuZ2V0U2NyaXB0ID0gcmVxdWlyZSgnLi9nZXRTY3JpcHQnKTtcbmV4cG9ydHMuaWZyYW1lUG9zdCA9IHJlcXVpcmUoJy4vaWZyYW1lUG9zdCcpO1xuZXhwb3J0cy5sb2FkU2RrID0gcmVxdWlyZSgnLi9sb2FkU2RrJyk7XG4iLCJ2YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcbnZhciAkZ2V0ID0gcmVxdWlyZSgnLi4vb2JqL2dldCcpO1xudmFyICRnZXRTY3JpcHQgPSByZXF1aXJlKCcuL2dldFNjcmlwdCcpO1xuXG52YXIgcHJvcE5hbWUgPSAnU1BPUkVfU0RLX1BST01JU0UnO1xudmFyIGNhY2hlID0gbnVsbDtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGNhY2hlID0gd2luZG93W3Byb3BOYW1lXTtcbiAgaWYgKCFjYWNoZSkge1xuICAgIGNhY2hlID0ge307XG4gICAgd2luZG93W3Byb3BOYW1lXSA9IGNhY2hlO1xuICB9XG59IGVsc2Uge1xuICBjYWNoZSA9IHt9O1xufVxuXG4vKipcbiAqIHNkayDliqDovb3nu5/kuIDlsIHoo4VcbiAqIC0g5aSa5qyh6LCD55So5LiN5Lya5Y+R6LW36YeN5aSN6K+35rGCXG4gKiBAbWV0aG9kIGlvL2xvYWRTZGtcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubmFtZSBzZGsg5YWo5bGA5Y+Y6YeP5ZCN56ewXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgc2NyaXB0IOWcsOWdgFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNoYXJzZXQ9J3V0Zi04J10gc2NyaXB0IOe8lueggVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25Mb2FkXSBzY3JpcHQg5Yqg6L295a6M5oiQ55qE5Zue6LCD5Ye95pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRsb2FkU2RrID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9pby9sb2FkU2RrJyk7XG4gKiAkbG9hZFNkayh7XG4gKiAgIG5hbWU6ICdUZW5jZW50Q2FwdGNoYScsXG4gKiAgIHVybDogJ2h0dHBzOi8vc3NsLmNhcHRjaGEucXEuY29tL1RDYXB0Y2hhLmpzJ1xuICogfSkudGhlbihUZW5jZW50Q2FwdGNoYSA9PiB7fSlcbiAqL1xudmFyIGxvYWRTZGsgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIG5hbWU6ICcnLFxuICAgIHVybDogJycsXG4gICAgY2hhcnNldDogJ3V0Zi04JyxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgdmFyIG5hbWUgPSBjb25mLm5hbWU7XG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1JlcXVpcmUgcGFyYW1ldGVyOiBvcHRpb25zLm5hbWUnKSk7XG4gIH1cbiAgaWYgKCFjb25mLnVybCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1JlcXVpcmUgcGFyYW1ldGVyOiBvcHRpb25zLnVybCcpKTtcbiAgfVxuXG4gIHZhciBwbSA9IGNhY2hlW25hbWVdO1xuICBpZiAocG0pIHtcbiAgICBpZiAocG0uc2RrKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBtLnNkayk7XG4gICAgfVxuICAgIHJldHVybiBwbTtcbiAgfVxuXG4gIHBtID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAkZ2V0U2NyaXB0KHtcbiAgICAgIHNyYzogY29uZi51cmwsXG4gICAgICBjaGFyc2V0OiBjb25mLmNoYXJzZXQsXG4gICAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNkayA9ICRnZXQod2luZG93LCBuYW1lKTtcbiAgICAgICAgcG0uc2RrID0gc2RrO1xuICAgICAgICByZXNvbHZlKHNkayk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbiAgY2FjaGVbbmFtZV0gPSBwbTtcblxuICByZXR1cm4gcG07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRTZGs7XG4iLCIvKipcbiAqIOino+aekCBsb2NhdGlvbi5zZWFyY2gg5Li65LiA5LiqSlNPTuWvueixoVxuICogLSDmiJbogIXojrflj5blhbbkuK3mn5DkuKrlj4LmlbBcbiAqIEBtZXRob2QgbG9jYXRpb24vZ2V0UXVlcnlcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJM5a2X56ym5LiyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSDlj4LmlbDlkI3np7BcbiAqIEByZXR1cm5zIHtPYmplY3R8U3RyaW5nfSBxdWVyeeWvueixoSB8IOWPguaVsOWAvFxuICogQGV4YW1wbGVcbiAqIHZhciAkZ2V0UXVlcnkgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2xvY2F0aW9uL2dldFF1ZXJ5Jyk7XG4gKiB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3QvcHJvZmlsZT9iZWlqaW5nPWh1YW55aW5nbmknO1xuICogY29uc29sZS5pbmZvKCAkZ2V0UXVlcnkodXJsKSApO1xuICogLy8ge2JlaWppbmcgOiAnaHVhbnlpbmduaSd9XG4gKiBjb25zb2xlLmluZm8oICRnZXRRdWVyeSh1cmwsICdiZWlqaW5nJykgKTtcbiAqIC8vICdodWFueWluZ25pJ1xuICovXG5cbnZhciBjYWNoZSA9IHt9O1xuXG5mdW5jdGlvbiBnZXRRdWVyeSh1cmwsIG5hbWUpIHtcbiAgdmFyIHF1ZXJ5ID0gY2FjaGVbdXJsXSB8fCB7fTtcblxuICBpZiAodXJsKSB7XG4gICAgdmFyIHNlYXJjaEluZGV4ID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgICBpZiAoc2VhcmNoSW5kZXggPj0gMCkge1xuICAgICAgdmFyIHNlYXJjaCA9IHVybC5zbGljZShzZWFyY2hJbmRleCArIDEsIHVybC5sZW5ndGgpO1xuICAgICAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoLyMuKi8sICcnKTtcblxuICAgICAgdmFyIHBhcmFtcyA9IHNlYXJjaC5zcGxpdCgnJicpO1xuICAgICAgcGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XG4gICAgICAgIHZhciBlcXVhbEluZGV4ID0gZ3JvdXAuaW5kZXhPZignPScpO1xuICAgICAgICBpZiAoZXF1YWxJbmRleCA+IDApIHtcbiAgICAgICAgICB2YXIga2V5ID0gZ3JvdXAuc2xpY2UoMCwgZXF1YWxJbmRleCk7XG4gICAgICAgICAgdmFyIHZhbHVlID0gZ3JvdXAuc2xpY2UoZXF1YWxJbmRleCArIDEsIGdyb3VwLmxlbmd0aCk7XG4gICAgICAgICAgcXVlcnlba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgY2FjaGVbdXJsXSA9IHF1ZXJ5O1xuICB9XG5cbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9XG4gIHJldHVybiBxdWVyeVtuYW1lXSB8fCAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRRdWVyeTtcbiIsIi8qKlxuICog5aSE55CG5Zyw5Z2A5a2X56ym5LiyXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9sb2NhdGlvblxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvbG9jYXRpb25cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgQHNwb3JlLXVpL2tpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5sb2NhdGlvbi5nZXRRdWVyeSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvbG9jYXRpb25cbiAqIHZhciAkbG9jYXRpb24gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2xvY2F0aW9uJyk7XG4gKiBjb25zb2xlLmluZm8oJGxvY2F0aW9uLmdldFF1ZXJ5KTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkZ2V0UXVlcnkgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL2xvY2F0aW9uL2dldFF1ZXJ5Jyk7XG4gKi9cblxuZXhwb3J0cy5nZXRRdWVyeSA9IHJlcXVpcmUoJy4vZ2V0UXVlcnknKTtcbmV4cG9ydHMuc2V0UXVlcnkgPSByZXF1aXJlKCcuL3NldFF1ZXJ5Jyk7XG5leHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xuIiwiLyoqXG4gKiDop6PmnpBVUkzkuLrkuIDkuKrlr7nosaFcbiAqIEBtZXRob2QgbG9jYXRpb24vcGFyc2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVVJM5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBVUkzlr7nosaFcbiAqIEBzZWUgW3VybC1wYXJzZV0oaHR0cHM6Ly9naXRodWIuY29tL3Vuc2hpZnRpby91cmwtcGFyc2UpXG4gKiBAZXhhbXBsZVxuICogdmFyICRwYXJzZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbG9jYXRpb24vcGFyc2UnKTtcbiAqICRwYXJzZSgnaHR0cDovL2xvY2FsaG9zdC9wcm9maWxlP2JlaWppbmc9aHVhbnlpbmduaSMxMjMnKTtcbiAqIC8vIHtcbiAqIC8vICAgc2xhc2hlczogdHJ1ZSxcbiAqIC8vICAgcHJvdG9jb2w6ICdodHRwOicsXG4gKiAvLyAgIGhhc2g6ICcjMTIzJyxcbiAqIC8vICAgcXVlcnk6ICc/YmVpamluZz1odWFueWluZ25pJyxcbiAqIC8vICAgcGF0aG5hbWU6ICcvcHJvZmlsZScsXG4gKiAvLyAgIGF1dGg6ICd1c2VybmFtZTpwYXNzd29yZCcsXG4gKiAvLyAgIGhvc3Q6ICdsb2NhbGhvc3Q6ODA4MCcsXG4gKiAvLyAgIHBvcnQ6ICc4MDgwJyxcbiAqIC8vICAgaG9zdG5hbWU6ICdsb2NhbGhvc3QnLFxuICogLy8gICBwYXNzd29yZDogJ3Bhc3N3b3JkJyxcbiAqIC8vICAgdXNlcm5hbWU6ICd1c2VybmFtZScsXG4gKiAvLyAgIG9yaWdpbjogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gKiAvLyAgIGhyZWY6ICdodHRwOi8vdXNlcm5hbWU6cGFzc3dvcmRAbG9jYWxob3N0OjgwODAvcHJvZmlsZT9iZWlqaW5nPWh1YW55aW5nbmkjMTIzJ1xuICogLy8gfVxuICovXG5cbnZhciBVcmwgPSByZXF1aXJlKCd1cmwtcGFyc2UnKTtcblxuZnVuY3Rpb24gcGFyc2UodXJsKSB7XG4gIHJldHVybiBuZXcgVXJsKHVybCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG4iLCIvKipcbiAqIOWwhuWPguaVsOiuvue9ruWIsCBsb2NhdGlvbi5zZWFyY2gg5LiKXG4gKiBAbWV0aG9kIGxvY2F0aW9uL3NldFF1ZXJ5XG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSTOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IOWPguaVsOWvueixoVxuICogQHJldHVybnMge1N0cmluZ30g5ou85o6l5aW95Y+C5pWw55qEVVJM5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRzZXRRdWVyeSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbG9jYXRpb24vc2V0UXVlcnknKTtcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0Jyk7IC8vICdsb2NhbGhvc3QnXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdCcsIHthOiAxfSk7IC8vICdsb2NhbGhvc3Q/YT0xJ1xuICogJHNldFF1ZXJ5KCcnLCB7YTogMX0pOyAvLyAnP2E9MSdcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0P2E9MScsIHthOiAyfSk7IC8vICdsb2NhbGhvc3Q/YT0yJ1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2E6ICcnfSk7IC8vICdsb2NhbGhvc3Q/YT0nXG4gKiAkc2V0UXVlcnkoJ2xvY2FsaG9zdD9hPTEnLCB7YTogbnVsbH0pOyAvLyAnbG9jYWxob3N0J1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJywge2I6IDJ9KTsgLy8gJ2xvY2FsaG9zdD9hPTEmYj0yJ1xuICogJHNldFF1ZXJ5KCdsb2NhbGhvc3Q/YT0xJmI9MScsIHthOiAyLCBiOiAzfSk7IC8vICdsb2NhbGhvc3Q/YT0yJmI9MydcbiAqICRzZXRRdWVyeSgnbG9jYWxob3N0I2E9MScsIHthOiAyLCBiOiAzfSk7IC8vICdsb2NhbGhvc3Q/YT0yJmI9MyNhPTEnXG4gKiAkc2V0UXVlcnkoJyNhPTEnLCB7YTogMiwgYjogM30pOyAvLyAnP2E9MiZiPTMjYT0xJ1xuICovXG5cbmZ1bmN0aW9uIHNldFF1ZXJ5KHVybCwgcXVlcnkpIHtcbiAgdXJsID0gdXJsIHx8ICcnO1xuICBpZiAoIXF1ZXJ5KSB7IHJldHVybiB1cmw7IH1cblxuICB2YXIgcmVnID0gLyhbXj8jXSopKFxcP3swLDF9W14/I10qKSgjezAsMX0uKikvO1xuICByZXR1cm4gdXJsLnJlcGxhY2UocmVnLCBmdW5jdGlvbiAobWF0Y2gsIHBhdGgsIHNlYXJjaCwgaGFzaCkge1xuICAgIHNlYXJjaCA9IHNlYXJjaCB8fCAnJztcbiAgICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKTtcblxuICAgIHZhciBwYXJhID0gc2VhcmNoLnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uIChvYmosIHBhaXIpIHtcbiAgICAgIHZhciBhcnIgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgICBpZiAoYXJyWzBdKSB7XG4gICAgICAgIG9ialthcnJbMF1dID0gYXJyWzFdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSk7XG5cbiAgICBPYmplY3Qua2V5cyhxdWVyeSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBxdWVyeVtrZXldO1xuICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVsZXRlIHBhcmFba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHBhcmFLZXlzID0gT2JqZWN0LmtleXMocGFyYSk7XG4gICAgaWYgKCFwYXJhS2V5cy5sZW5ndGgpIHtcbiAgICAgIHNlYXJjaCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWFyY2ggPSAnPycgKyBwYXJhS2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ICsgJz0nICsgcGFyYVtrZXldO1xuICAgICAgfSkuam9pbignJicpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoICsgc2VhcmNoICsgaGFzaDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0UXVlcnk7XG4iLCIvKipcbiAqIOWfuuehgOW3peWOguWFg+S7tuexu1xuICogLSDor6Xnsbvmt7flkIjkuoYgW2V2dC9FdmVudHNdKCNldnQtZXZlbnRzKSDnmoTmlrnms5XjgIJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g6YCJ6aG5XG4gKiBAbW9kdWxlIG12Yy9CYXNlXG4gKiBAZXhhbXBsZVxuICogdmFyICRiYXNlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9tdmMvYmFzZScpO1xuICpcbiAqIHZhciBDaGlsZENsYXNzID0gJGJhc2UuZXh0ZW5kKHtcbiAqICAgZGVmYXVsdHMgOiB7XG4gKiAgICAgbm9kZSA6IG51bGxcbiAqICAgfSxcbiAqICAgYnVpbGQgOiBmdW5jdGlvbigpIHtcbiAqICAgICB0aGlzLm5vZGUgPSAkKHRoaXMuY29uZi5ub2RlKTtcbiAqICAgfSxcbiAqICAgc2V0RXZlbnRzIDogZnVuY3Rpb24oYWN0aW9uKSB7XG4gKiAgICAgdmFyIHByb3h5ID0gdGhpcy5wcm94eSgpO1xuICogICAgIHRoaXMubm9kZVthY3Rpb25dKCdjbGljaycsIHByb3h5KCdvbmNsaWNrJykpO1xuICogICB9LFxuICogICBvbmNsaWNrIDogZnVuY3Rpb24oKSB7XG4gKiAgICAgY29uc29sZS5pbmZvKCdjbGlja2VkJyk7XG4gKiAgICAgdGhpcy50cmlnZ2VyKCdjbGljaycpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiB2YXIgb2JqID0gbmV3IENoaWxkQ2xhc3Moe1xuICogICBub2RlIDogZG9jdW1lbnQuYm9keVxuICogfSk7XG4gKlxuICogb2JqLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICogICBjb25zb2xlLmluZm8oJ29iaiBpcyBjbGlja2VkJyk7XG4gKiB9KTtcbiAqL1xuXG52YXIgJG1lcmdlID0gcmVxdWlyZSgnLi4vb2JqL21lcmdlJyk7XG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xudmFyICRub29wID0gcmVxdWlyZSgnLi4vZm4vbm9vcCcpO1xudmFyICRldmVudHMgPSByZXF1aXJlKCcuLi9ldnQvZXZlbnRzJyk7XG52YXIgJGtsYXNzID0gcmVxdWlyZSgnLi9rbGFzcycpO1xudmFyICRwcm94eSA9IHJlcXVpcmUoJy4vcHJveHknKTtcblxudmFyIEJhc2UgPSAka2xhc3Moe1xuICAvKipcbiAgICog57G755qE6buY6K6k6YCJ6aG55a+56LGh77yM57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGhXG4gICAqIEBuYW1lIEJhc2UjZGVmYXVsdHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9CYXNlXG4gICAqL1xuICBkZWZhdWx0czoge30sXG5cbiAgLyoqXG4gICAqIOexu+eahOWunumZhemAiemhue+8jHNldE9wdGlvbnMg5pa55rOV5Lya5L+u5pS56L+Z5Liq5a+56LGhXG4gICAqIEBuYW1lIEJhc2UjY29uZlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgbXZjL0Jhc2VcbiAgICovXG5cbiAgLyoqXG4gICAqIOWtmOaUvuS7o+eQhuWHveaVsOeahOmbhuWQiFxuICAgKiBAbmFtZSBCYXNlI2JvdW5kXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBtdmMvQmFzZVxuICAgKi9cblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLmJ1aWxkKCk7XG4gICAgdGhpcy5zZXRFdmVudHMoJ29uJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOa3t+WQiOS8oOWFpeeahOmAiemhueS4jum7mOiupOmAiemhue+8jOa3t+WQiOWujOaIkOeahOmAiemhueWvueixoeWPr+mAmui/hyB0aGlzLmNvbmYg5bGe5oCn6K6/6ZeuXG4gICAqIEBtZXRob2QgQmFzZSNzZXRPcHRpb25zXG4gICAqIEBtZW1iZXJvZiBtdmMvQmFzZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIOmAiemhuVxuICAgKi9cbiAgc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbmYgPSB0aGlzLmNvbmYgfHwgJG1lcmdlKHt9LCB0aGlzLmRlZmF1bHRzKTtcbiAgICBpZiAoJHR5cGUob3B0aW9ucykgIT09ICdvYmplY3QnKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgICRtZXJnZSh0aGlzLmNvbmYsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDlhYPku7bliJ3lp4vljJbmjqXlj6Plh73mlbDvvIzlrp7kvovljJblhYPku7bml7bkvJroh6rliqjpppblhYjosIPnlKhcbiAgICogQGFic3RyYWN0XG4gICAqIEBtZXRob2QgQmFzZSNidWlsZFxuICAgKiBAbWVtYmVyb2YgbXZjL0Jhc2VcbiAgICovXG4gIGJ1aWxkOiAkbm9vcCxcblxuICAvKipcbiAgICog5YWD5Lu25LqL5Lu257uR5a6a5o6l5Y+j5Ye95pWw77yM5a6e5L6L5YyW5YWD5Lu25pe25Lya6Ieq5Yqo5ZyoIGJ1aWxkIOS5i+WQjuiwg+eUqFxuICAgKiBAbWV0aG9kIEJhc2Ujc2V0RXZlbnRzXG4gICAqIEBtZW1iZXJvZiBtdmMvQmFzZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprmiJbogIXnp7vpmaTkuovku7bnmoTmoIforrDvvIzlj6/pgInlgLzmnInvvJpbJ29uJywgJ29mZiddXG4gICAqL1xuICBzZXRFdmVudHM6ICRub29wLFxuXG4gIC8qKlxuICAgKiDlh73mlbDku6PnkIbvvIznoa7kv53lh73mlbDlnKjlvZPliY3nsbvliJvlu7rnmoTlrp7kvovkuIrkuIvmlofkuK3miafooYzjgIJcbiAgICog6L+Z5Lqb55So5LqO57uR5a6a5LqL5Lu255qE5Luj55CG5Ye95pWw6YO95pS+5Zyo5bGe5oCnIHRoaXMuYm91bmQg5LiK44CCXG4gICAqIEBtZXRob2QgQmFzZSNwcm94eVxuICAgKiBAbWVtYmVyb2YgbXZjL0Jhc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lPSdwcm94eSddIOWHveaVsOWQjeensFxuICAgKi9cbiAgcHJveHk6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHByb3h5QXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuICRwcm94eSh0aGlzLCBuYW1lLCBwcm94eUFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnp7vpmaTmiYDmnInnu5Hlrprkuovku7bvvIzmuIXpmaTnlKjkuo7nu5Hlrprkuovku7bnmoTku6PnkIblh73mlbBcbiAgICogQG1ldGhvZCBCYXNlI2Rlc3Ryb3lcbiAgICogQG1lbWJlcm9mIG12Yy9CYXNlXG4gICAqL1xuICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRFdmVudHMoJ29mZicpO1xuICAgIHRoaXMub2ZmKCk7XG4gICAgdGhpcy5ib3VuZCA9IG51bGw7XG4gIH0sXG59KTtcblxuQmFzZS5tZXRob2RzKCRldmVudHMucHJvdG90eXBlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuIiwiLyoqXG4gKiDkuovku7blr7nosaHnu5HlrprvvIzlsIZldmVudHPkuK3ljIXlkKvnmoTplK7lgLzlr7nmmKDlsITkuLrku6PnkIbnmoTkuovku7bjgIJcbiAqIC0g5LqL5Lu26ZSu5YC85a+55qC85byP5Y+v5Lul5Li677yaXG4gKiAtIHsnc2VsZWN0b3IgZXZlbnQnOidtZXRob2QnfVxuICogLSB7J2V2ZW50JzonbWV0aG9kJ31cbiAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gKiAtIHsnZXZlbnQnOidtZXRob2QxIG1ldGhvZDInfVxuICogQG1ldGhvZCBtdmMvZGVsZWdhdGVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYWN0aW9uIOW8gC/lhbPku6PnkIbvvIzlj6/pgInvvJpbJ29uJywgJ29mZidd44CCXG4gKiBAcGFyYW0ge09iamVjdH0gcm9vdCDorr7nva7ku6PnkIbnmoTmoLnoioLngrnvvIzlj6/ku6XmmK/kuIDkuKpqcXVlcnnlr7nosaHvvIzmiJbogIXmmK/mt7flkIjkuoYgc3BvcmUta2l0L3BhY2thZ2VzL2V2dC9ldmVudHMg5pa55rOV55qE5a+56LGh44CCXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIOS6i+S7tumUruWAvOWvuVxuICogQHBhcmFtIHtPYmplY3R9IGJpbmQg5oyH5a6a5LqL5Lu25Ye95pWw57uR5a6a55qE5a+56LGh77yM5b+F6aG75Li6TVZD57G755qE5a6e5L6L44CCXG4gKi9cblxudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xuXG5mdW5jdGlvbiBkZWxlZ2F0ZShhY3Rpb24sIHJvb3QsIGV2ZW50cywgYmluZCkge1xuICB2YXIgcHJveHk7XG4gIHZhciBkbGc7XG4gIGlmICghcm9vdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWJpbmQgfHwgJHR5cGUoYmluZC5wcm94eSkgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm94eSA9IGJpbmQucHJveHkoKTtcbiAgYWN0aW9uID0gYWN0aW9uID09PSAnb24nID8gJ29uJyA6ICdvZmYnO1xuICBkbGcgPSBhY3Rpb24gPT09ICdvbicgPyAnZGVsZWdhdGUnIDogJ3VuZGVsZWdhdGUnO1xuICBldmVudHMgPSAkYXNzaWduKHt9LCBldmVudHMpO1xuXG4gIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgdmFyIG1ldGhvZCA9IGV2ZW50c1toYW5kbGVdO1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICB2YXIgZXZlbnQ7XG4gICAgdmFyIGZucyA9IFtdO1xuICAgIGhhbmRsZSA9IGhhbmRsZS5zcGxpdCgvXFxzKy8pO1xuXG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnKSB7XG4gICAgICBmbnMgPSBtZXRob2Quc3BsaXQoL1xccysvKS5tYXAoZnVuY3Rpb24gKGZuYW1lKSB7XG4gICAgICAgIHJldHVybiBwcm94eShmbmFtZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCR0eXBlKG1ldGhvZCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZucyA9IFttZXRob2RdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZlbnQgPSBoYW5kbGUucG9wKCk7XG5cbiAgICBpZiAoaGFuZGxlLmxlbmd0aCA+PSAxKSB7XG4gICAgICBzZWxlY3RvciA9IGhhbmRsZS5qb2luKCcgJyk7XG4gICAgICBpZiAoJHR5cGUocm9vdFtkbGddKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICByb290W2RsZ10oc2VsZWN0b3IsIGV2ZW50LCBmbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoJHR5cGUocm9vdFthY3Rpb25dKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm5zLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJvb3RbYWN0aW9uXShldmVudCwgZm4pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiIsIi8qKlxuICog5YW85a65IElFOCDnmoQgTVZDIOeugOWNleWunueOsFxuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvbXZjXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9tdmNcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgQHNwb3JlLXVpL2tpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5tdmMuTW9kZWwpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL212Y1xuICogdmFyICRtdmMgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL212YycpO1xuICogY29uc29sZS5pbmZvKCRtdmMuTW9kZWwpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4que7hOS7tlxuICogdmFyICRtb2RlbCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbXZjL21vZGVsJyk7XG4gKi9cblxuZXhwb3J0cy5rbGFzcyA9IHJlcXVpcmUoJy4va2xhc3MnKTtcbmV4cG9ydHMuZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5leHBvcnRzLnByb3h5ID0gcmVxdWlyZSgnLi9wcm94eScpO1xuZXhwb3J0cy5CYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5leHBvcnRzLk1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpO1xuZXhwb3J0cy5WaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuLyoqXG4gKiBjbGFzcyDnmoQgRVM1IOWunueOsFxuICogLSDkuLrku6PnoIHpgJrov4cgZXNsaW50IOajgOafpeWBmuS6huS6m+S/ruaUuVxuICogQG1vZHVsZSBtdmMva2xhc3NcbiAqIEBzZWUgW2tsYXNzXShodHRwczovL2dpdGh1Yi5jb20vZGVkL2tsYXNzKVxuICovXG5cbnZhciBmblRlc3QgPSAoL3h5ei8pLnRlc3QoZnVuY3Rpb24gKCkgeyB2YXIgeHl6OyByZXR1cm4geHl6OyB9KSA/ICgvXFxic3VwclxcYi8pIDogKC8uKi8pO1xudmFyIHByb3RvID0gJ3Byb3RvdHlwZSc7XG5cbmZ1bmN0aW9uIGlzRm4obykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIHdyYXAoaywgZm4sIHN1cHIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG1wID0gdGhpcy5zdXByO1xuICAgIHRoaXMuc3VwciA9IHN1cHJbcHJvdG9dW2tdO1xuICAgIHZhciB1bmRlZiA9IHt9LmZhYnJpY2F0ZWRVbmRlZmluZWQ7XG4gICAgdmFyIHJldCA9IHVuZGVmO1xuICAgIHRyeSB7XG4gICAgICByZXQgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnN1cHIgPSB0bXA7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4ZWNQcm9jZXNzKHdoYXQsIG8sIHN1cHIpIHtcbiAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgaWYgKG8uaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIHdoYXRba10gPSAoXG4gICAgICAgIGlzRm4ob1trXSlcbiAgICAgICAgJiYgaXNGbihzdXByW3Byb3RvXVtrXSlcbiAgICAgICAgJiYgZm5UZXN0LnRlc3Qob1trXSlcbiAgICAgICkgPyB3cmFwKGssIG9ba10sIHN1cHIpIDogb1trXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG8sIGZyb21TdWIpIHtcbiAgLy8gbXVzdCByZWRlZmluZSBub29wIGVhY2ggdGltZSBzbyBpdCBkb2Vzbid0IGluaGVyaXQgZnJvbSBwcmV2aW91cyBhcmJpdHJhcnkgY2xhc3Nlc1xuICB2YXIgTm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuICBOb29wW3Byb3RvXSA9IHRoaXNbcHJvdG9dO1xuXG4gIHZhciBzdXByID0gdGhpcztcbiAgdmFyIHByb3RvdHlwZSA9IG5ldyBOb29wKCk7XG4gIHZhciBpc0Z1bmN0aW9uID0gaXNGbihvKTtcbiAgdmFyIF9jb25zdHJ1Y3RvciA9IGlzRnVuY3Rpb24gPyBvIDogdGhpcztcbiAgdmFyIF9tZXRob2RzID0gaXNGdW5jdGlvbiA/IHt9IDogbztcblxuICBmdW5jdGlvbiBmbigpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZyb21TdWIgfHwgaXNGdW5jdGlvbikge1xuICAgICAgICBzdXByLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBfY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBmbi5tZXRob2RzID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGV4ZWNQcm9jZXNzKHByb3RvdHlwZSwgb2JqLCBzdXByKTtcbiAgICBmbltwcm90b10gPSBwcm90b3R5cGU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgZm4ubWV0aG9kcy5jYWxsKGZuLCBfbWV0aG9kcykucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gZm47XG5cbiAgZm4uZXh0ZW5kID0gZXh0ZW5kO1xuICBmbi5zdGF0aWNzID0gZnVuY3Rpb24gKHNwZWMsIG9wdEZuKSB7XG4gICAgc3BlYyA9IHR5cGVvZiBzcGVjID09PSAnc3RyaW5nJyA/IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb2JqID0ge307XG4gICAgICBvYmpbc3BlY10gPSBvcHRGbjtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSgpKSA6IHNwZWM7XG4gICAgZXhlY1Byb2Nlc3ModGhpcywgc3BlYywgc3Vwcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgZm5bcHJvdG9dLmltcGxlbWVudCA9IGZuLnN0YXRpY3M7XG5cbiAgcmV0dXJuIGZuO1xufVxuXG5mdW5jdGlvbiBrbGFzcyhvKSB7XG4gIHJldHVybiBleHRlbmQuY2FsbChpc0ZuKG8pID8gbyA6IGZ1bmN0aW9uICgpIHt9LCBvLCAxKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrbGFzcztcbiIsIi8qKlxuICog5qih5Z6L57G7OiDln7rnoYDlt6XljoLlhYPku7bnsbvvvIznlKjkuo7lgZrmlbDmja7ljIXoo4XvvIzmj5Dkvpvlj6/op4Llr5/nmoTmlbDmja7lr7nosaFcbiAqIC0g57un5om/6IeqIFttdmMvYmFzZV0oI212Yy1iYXNlKVxuICogQG1vZHVsZSBtdmMvTW9kZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g5Yid5aeL5pWw5o2uXG4gKiBAZXhhbXBsZVxuICogdmFyICRtb2RlbCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbXZjL21vZGVsJyk7XG4gKlxuICogdmFyIG0xID0gbmV3ICRtb2RlbCh7XG4gKiAgIGEgOiAxXG4gKiB9KTtcbiAqIG0xLm9uKCdjaGFuZ2U6YScsIGZ1bmN0aW9uKHByZXZBKXtcbiAqICAgY29uc29sZS5pbmZvKHByZXZBKTsgLy8gMVxuICogfSk7XG4gKiBtMS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAqICAgY29uc29sZS5pbmZvKCdtb2RlbCBjaGFuZ2VkJyk7XG4gKiB9KTtcbiAqIG0xLnNldCgnYScsIDIpO1xuICpcbiAqIHZhciBNeU1vZGVsID0gTW9kZWwuZXh0ZW5kKHtcbiAqICAgZGVmYXVsdHMgOiB7XG4gKiAgICAgYSA6IDIsXG4gKiAgICAgYiA6IDJcbiAqICAgfSxcbiAqICAgZXZlbnRzIDoge1xuICogICAgICdjaGFuZ2U6YScgOiAndXBkYXRlQidcbiAqICAgfSxcbiAqICAgdXBkYXRlQiA6IGZ1bmN0aW9uKCl7XG4gKiAgICAgdGhpcy5zZXQoJ2InLCB0aGlzLmdldCgnYScpICsgMSk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIHZhciBtMiA9IG5ldyBNeU1vZGVsKCk7XG4gKiBjb25zb2xlLmluZm8obTIuZ2V0KCdiJykpOyAvLyAyXG4gKlxuICogbTIuc2V0KCdhJywgMyk7XG4gKiBjb25zb2xlLmluZm8obTIuZ2V0KCdiJykpOyAvLyA0XG4gKlxuICogbTIuc2V0KCdiJywgNSk7XG4gKiBjb25zb2xlLmluZm8obTIuZ2V0KCdiJykpOyAvLyA1XG4gKi9cblxudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG52YXIgJHR5cGUgPSByZXF1aXJlKCcuLi9vYmovdHlwZScpO1xudmFyICRjbG9uZURlZXAgPSByZXF1aXJlKCcuLi9vYmovY2xvbmVEZWVwJyk7XG52YXIgJGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbnZhciAkZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5cbi8vIOaVsOaNruWxnuaAp+WQjeensFxudmFyIERBVEEgPSAnX19kYXRhX18nO1xuXG52YXIgc2V0QXR0ciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBkYXRhID0gdGhpc1tEQVRBXTtcbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBwcmV2VmFsdWUgPSBkYXRhW2tleV07XG5cbiAgdmFyIHByb2Nlc3NvciA9IHRoaXMucHJvY2Vzc29yc1trZXldO1xuICBpZiAocHJvY2Vzc29yICYmICR0eXBlKHByb2Nlc3Nvci5zZXQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFsdWUgPSBwcm9jZXNzb3Iuc2V0KHZhbHVlKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSAhPT0gcHJldlZhbHVlKSB7XG4gICAgZGF0YVtrZXldID0gdmFsdWU7XG4gICAgdGhhdC5jaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGF0LnRyaWdnZXIoJ2NoYW5nZTonICsga2V5LCBwcmV2VmFsdWUpO1xuICB9XG59O1xuXG52YXIgZ2V0QXR0ciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIHZhbHVlID0gdGhpc1tEQVRBXVtrZXldO1xuICBpZiAoJHR5cGUodmFsdWUpID09PSAnb2JqZWN0Jykge1xuICAgIHZhbHVlID0gJGNsb25lRGVlcCh2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoJHR5cGUodmFsdWUgPT09ICdhcnJheScpKSB7XG4gICAgdmFsdWUgPSAkY2xvbmVEZWVwKHZhbHVlKTtcbiAgfVxuXG4gIHZhciBwcm9jZXNzb3IgPSB0aGlzLnByb2Nlc3NvcnNba2V5XTtcbiAgaWYgKHByb2Nlc3NvciAmJiAkdHlwZShwcm9jZXNzb3IuZ2V0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhbHVlID0gcHJvY2Vzc29yLmdldCh2YWx1ZSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG52YXIgcmVtb3ZlQXR0ciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgZGVsZXRlIHRoaXNbREFUQV1ba2V5XTtcbiAgdGhpcy50cmlnZ2VyKCdjaGFuZ2U6JyArIGtleSk7XG59O1xuXG52YXIgTW9kZWwgPSAkYmFzZS5leHRlbmQoe1xuXG4gIC8qKlxuICAgKiDmqKHlnovnmoTpu5jorqTmlbDmja5cbiAgICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogQG5hbWUgTW9kZWwjZGVmYXVsdHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKi9cbiAgZGVmYXVsdHM6IHt9LFxuXG4gIC8qKlxuICAgKiDmqKHlnovnmoTkuovku7bnu5HlrprliJfooajjgIJcbiAgICogLSDnu5HlrprlnKjljp/lnovkuIrvvIzkuI3opoHlnKjlrp7kvovkuK3nm7TmjqXkv67mlLnov5nkuKrlr7nosaHjgIJcbiAgICogLSDlsL3ph4/lnKggZXZlbnRzIOWvueixoeWumuS5ieWxnuaAp+WFs+iBlOS6i+S7tuOAglxuICAgKiAtIOS6i+S7tuW6lOW9k+S7heeUqOS6juiHqui6q+WxnuaAp+eahOWFs+iBlOi/kOeul+OAglxuICAgKiAtIOS6i+S7tue7keWumuagvOW8j+WPr+S7peS4uu+8mlxuICAgKiAtIHsnZXZlbnQnOidtZXRob2QnfVxuICAgKiAtIHsnZXZlbnQnOidtZXRob2QxIG1ldGhvZDInfVxuICAgKiBAbmFtZSBNb2RlbCNldmVudHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKi9cbiAgZXZlbnRzOiB7fSxcblxuICAvKipcbiAgICog5qih5Z6L5pWw5o2u55qE6aKE5aSE55CG5Zmo44CCXG4gICAqIC0g57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG4gICAqIEBuYW1lIE1vZGVsI3Byb2Nlc3NvcnNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAZXhhbXBsZVxuICAgKiBwcm9jZXNzb3JzIDoge1xuICAgKiAgIG5hbWUgOiB7XG4gICAqICAgICBzZXQgOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAqICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICogICAgIH0sXG4gICAqICAgICBnZXQgOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAqICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICogICAgIH1cbiAgICogICB9XG4gICAqIH1cbiAgICovXG4gIHByb2Nlc3NvcnM6IHt9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpc1tEQVRBXSA9IHt9O1xuICAgIHRoaXMuZGVmYXVsdHMgPSAkYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzKTtcbiAgICB0aGlzLmV2ZW50cyA9ICRhc3NpZ24oe30sIHRoaXMuZXZlbnRzKTtcbiAgICB0aGlzLnByb2Nlc3NvcnMgPSAkYXNzaWduKHt9LCB0aGlzLnByb2Nlc3NvcnMpO1xuICAgIHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5idWlsZCgpO1xuICAgIHRoaXMuZGVsZWdhdGUoJ29uJyk7XG4gICAgdGhpcy5zZXRFdmVudHMoJ29uJyk7XG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmt7Hluqbmt7flkIjkvKDlhaXnmoTpgInpobnkuI7pu5jorqTpgInpobnvvIznhLblkI7mt7flkIjliLDmlbDmja7lr7nosaHkuK1cbiAgICogQG1ldGhvZCBNb2RlbCNzZXRPcHRpb25zXG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSDpgInpoblcbiAgICovXG4gIHNldE9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cyk7XG4gICAgdGhpcy5zdXByKG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0KG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnu5HlrpogZXZlbnRzIOWvueixoeWIl+S4vueahOS6i+S7tuOAguWcqOWIneWni+WMluaXtuiHquWKqOaJp+ihjOS6hiB0aGlzLmRlbGVnYXRlKCdvbicp44CCXG4gICAqIEBtZXRob2QgTW9kZWwjZGVsZWdhdGVcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprliqjkvZzmoIforrDjgILlj6/pgInvvJpbJ29uJywgJ29mZiddXG4gICAqL1xuICBkZWxlZ2F0ZTogZnVuY3Rpb24gKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKSB7XG4gICAgYWN0aW9uID0gYWN0aW9uIHx8ICdvbic7XG4gICAgcm9vdCA9IHJvb3QgfHwgdGhpcztcbiAgICBldmVudHMgPSBldmVudHMgfHwgdGhpcy5ldmVudHM7XG4gICAgYmluZCA9IGJpbmQgfHwgdGhpcztcbiAgICAkZGVsZWdhdGUoYWN0aW9uLCByb290LCBldmVudHMsIGJpbmQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmlbDmja7pooTlpITnkIZcbiAgICogQG1ldGhvZCBNb2RlbCNwcm9jZXNzXG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSDmqKHlnovlsZ7mgKflkI3np7DjgILmiJbogIVKU09O5pWw5o2u44CCXG4gICAqIEBwYXJhbSB7Kn0gW3ZhbF0g5pWw5o2uXG4gICAqL1xuICBwcm9jZXNzOiBmdW5jdGlvbiAobmFtZSwgc3BlYykge1xuICAgIHNwZWMgPSAkYXNzaWduKHtcbiAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBnZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgIH0sIHNwZWMpO1xuICAgIHRoaXMucHJvY2Vzc29yc1tuYW1lXSA9IHNwZWM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiuvue9ruaooeWei+aVsOaNrlxuICAgKiBAbWV0aG9kIE1vZGVsI3NldFxuICAgKiBAbWVtYmVyb2YgbXZjL01vZGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0ga2V5IOaooeWei+WxnuaAp+WQjeensOOAguaIluiAhUpTT07mlbDmja7jgIJcbiAgICogQHBhcmFtIHsqfSBbdmFsXSDmlbDmja5cbiAgICovXG4gIHNldDogZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgaWYgKCR0eXBlKGtleSkgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhrZXkpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHYgPSBrZXlba107XG4gICAgICAgIHNldEF0dHIuY2FsbCh0aGlzLCBrLCB2KTtcbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgc2V0QXR0ci5jYWxsKHRoaXMsIGtleSwgdmFsKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhbmdlZCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICog6I635Y+W5qih5Z6L5a+55bqU5bGe5oCn55qE5YC855qE5ou36LSdXG4gICAqIC0g5aaC5p6c5LiN5Lyg5Y+C5pWw77yM5YiZ55u05o6l6I635Y+W5pW05Liq5qih5Z6L5pWw5o2u44CCXG4gICAqIC0g5aaC5p6c5YC85piv5LiA5Liq5a+56LGh77yM5YiZ6K+l5a+56LGh5Lya6KKr5rex5ou36LSd44CCXG4gICAqIEBtZXRob2QgTW9kZWwjZ2V0XG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtrZXldIOaooeWei+WxnuaAp+WQjeensOOAglxuICAgKiBAcmV0dXJucyB7Kn0g5bGe5oCn5ZCN56ew5a+55bqU55qE5YC8XG4gICAqL1xuICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICghdGhpc1tEQVRBXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0QXR0ci5jYWxsKHRoaXMsIGtleSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIHRoaXMua2V5cygpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgZGF0YVtrXSA9IGdldEF0dHIuY2FsbCh0aGlzLCBrKTtcbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiOt+WPluaooeWei+S4iuiuvue9rueahOaJgOaciemUruWQjVxuICAgKiBAbWV0aG9kIE1vZGVsI2tleXNcbiAgICogQG1lbWJlcm9mIG12Yy9Nb2RlbFxuICAgKiBAcmV0dXJucyB7QXJyYXl9IOWxnuaAp+WQjeensOWIl+ihqFxuICAgKi9cbiAga2V5czogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzW0RBVEFdIHx8IHt9KTtcbiAgfSxcblxuICAvKipcbiAgICog5Yig6Zmk5qih5Z6L5LiK55qE5LiA5Liq6ZSuXG4gICAqIEBtZXRob2QgTW9kZWwjcmVtb3ZlXG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSDlsZ7mgKflkI3np7DjgIJcbiAgICovXG4gIHJlbW92ZTogZnVuY3Rpb24gKGtleSkge1xuICAgIHJlbW92ZUF0dHIuY2FsbCh0aGlzLCBrZXkpO1xuICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOa4hemZpOaooeWei+S4reaJgOacieaVsOaNrlxuICAgKiBAbWV0aG9kIE1vZGVsI2NsZWFyXG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICovXG4gIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpc1tEQVRBXSkuZm9yRWFjaChyZW1vdmVBdHRyLCB0aGlzKTtcbiAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDplIDmr4HmqKHlnovvvIzkuI3kvJrop6blj5Hku7vkvZVjaGFuZ2Xkuovku7bjgIJcbiAgICogLSDmqKHlnovplIDmr4HlkI7vvIzml6Dms5Xlho3orr7nva7ku7vkvZXmlbDmja7jgIJcbiAgICogQG1ldGhvZCBNb2RlbCNkZXN0cm95XG4gICAqIEBtZW1iZXJvZiBtdmMvTW9kZWxcbiAgICovXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNoYW5nZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRlbGVnYXRlKCdvZmYnKTtcbiAgICB0aGlzLnN1cHIoKTtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpc1tEQVRBXSA9IG51bGw7XG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcbiIsIi8qKlxuICog5Ye95pWw5Luj55CG77yM56Gu5L+d5Ye95pWw5Zyo5b2T5YmN57G75Yib5bu655qE5a6e5L6L5LiK5LiL5paH5Lit5omn6KGM44CCXG4gKiAtIOi/meS6m+eUqOS6jue7keWumuS6i+S7tueahOS7o+eQhuWHveaVsOmDveaUvuWcqOWxnuaApyBpbnN0YW5jZS5ib3VuZCDkuIrjgIJcbiAqIC0g5Yqf6IO957G75Ly8IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIOOAglxuICogLSDlj6/ku6XkvKDpgJLpop3lpJblj4LmlbDkvZzkuLrlh73mlbDmiafooYznmoTpu5jorqTlj4LmlbDvvIzov73liqDlnKjlrp7pmYXlj4LmlbDkuYvlkI7jgIJcbiAqIEBtZXRob2QgbXZjL3Byb3h5XG4gKiBAcGFyYW0ge29iamVjdH0gaW5zdGFuY2Ug5a+56LGh5a6e5L6LXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWU9J3Byb3h5J10g5Ye95pWw5ZCN56ewXG4gKi9cblxudmFyICR0eXBlID0gcmVxdWlyZSgnLi4vb2JqL3R5cGUnKTtcblxudmFyIEFQID0gQXJyYXkucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBwcm94eShpbnN0YW5jZSwgbmFtZSwgcHJveHlBcmdzKSB7XG4gIGlmICghaW5zdGFuY2UuYm91bmQpIHtcbiAgICBpbnN0YW5jZS5ib3VuZCA9IHt9O1xuICB9XG4gIHZhciBib3VuZCA9IGluc3RhbmNlLmJvdW5kO1xuICBwcm94eUFyZ3MgPSBwcm94eUFyZ3MgfHwgW107XG4gIHByb3h5QXJncy5zaGlmdCgpO1xuICBuYW1lID0gbmFtZSB8fCAncHJveHknO1xuICBpZiAoJHR5cGUoYm91bmRbbmFtZV0pICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgYm91bmRbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHR5cGUoaW5zdGFuY2VbbmFtZV0pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBhcmdzID0gQVAuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2VbbmFtZV0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MuY29uY2F0KHByb3h5QXJncykpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGJvdW5kW25hbWVdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb3h5O1xuIiwiLyoqXG4gKiDop4blm77nsbs6IOWfuuehgOW3peWOguWFg+S7tuexu++8jOeUqOS6juWvueinhuWbvue7hOS7tueahOWMheijhVxuICogLSDkvp3otZYgalF1ZXJ5L1plcHRvXG4gKiAtIOe7p+aJv+iHqiBbbXZjL2Jhc2VdKCNtdmMtYmFzZSlcbiAqIEBtb2R1bGUgbXZjL1ZpZXdcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g6YCJ6aG5XG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IFtvcHRpb25zLm5vZGVdIOmAieaLqeWZqOWtl+espuS4su+8jOaIluiAhURPTeWFg+e0oO+8jOaIluiAhWpxdWVyeeWvueixoe+8jOeUqOS6juaMh+WumuinhuWbvueahOagueiKgueCueOAglxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRlbXBsYXRlXSDop4blm77nmoTmqKHmnb/lrZfnrKbkuLLvvIzkuZ/lj6/ku6XmmK/kuKrlrZfnrKbkuLLmlbDnu4TvvIzliJvlu7rop4blm75ET03ml7bkvJroh6rliqhqb2lu5Li65a2X56ym5Liy5aSE55CG44CCXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZXZlbnRzXSDnlKjkuo7opobnm5bku6PnkIbkuovku7bliJfooajjgIJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5yb2xlXSDop5LoibLlr7nosaHmmKDlsITooajvvIzlj6/mjIflrppyb2xl5pa55rOV6L+U5Zue55qEanF1ZXJ55a+56LGh44CCXG4gKiBAZXhhbXBsZVxuICogdmFyICR2aWV3ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9tdmMvdmlldycpO1xuICpcbiAqIHZhciBUUEwgPSB7XG4gKiAgIGJveCA6IFtcbiAqICAgICAnPGRpdj4nLFxuICogICAgICAgJzxidXR0b24gcm9sZT1cImJ1dHRvblwiPjwvYnV0dG9uPicsXG4gKiAgICAgJzwvZGl2PidcbiAqICAgXVxuICogfTtcbiAqXG4gKiB2YXIgVGVzdFZpZXcgPSAkdmlldy5leHRlbmQoe1xuICogICBkZWZhdWx0cyA6IHtcbiAqICAgICB0ZW1wbGF0ZSA6IFRQTC5ib3hcbiAqICAgfSxcbiAqICAgZXZlbnRzIDoge1xuICogICAgICdidXR0b24gY2xpY2snIDogJ21ldGhvZDEnXG4gKiAgIH0sXG4gKiAgIGJ1aWxkIDogZnVuY3Rpb24oKXtcbiAqICAgICB0aGlzLnJvbGUoJ3Jvb3QnKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAqICAgfSxcbiAqICAgbWV0aG9kMSA6IGZ1bmN0aW9uKGV2dCl7XG4gKiAgICAgY29uc29sZS5pbmZvKDEpO1xuICogICB9LFxuICogICBtZXRob2QyIDogZnVuY3Rpb24oZXZ0KXtcbiAqICAgICBjb25zb2xlLmluZm8oMik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIHZhciBvYmoxID0gbmV3IFRlc3RWaWV3KCk7XG4gKiB2YXIgb2JqMiA9IG5ldyBUZXN0Vmlldyh7XG4gKiAgIGV2ZW50cyA6IHtcbiAqICAgICAnYnV0dG9uIGNsaWNrJyA6ICdtZXRob2QyJ1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBvYmoxLnJvbGUoJ2J1dHRvbicpLnRyaWdnZXIoJ2NsaWNrJyk7IC8vIDFcbiAqIG9iajIucm9sZSgnYnV0dG9uJykudHJpZ2dlcignY2xpY2snKTsgLy8gMlxuICovXG5cbnZhciAkYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyICRkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcblxuZnVuY3Rpb24gZ2V0JCgpIHtcbiAgcmV0dXJuICh3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byk7XG59XG5cbi8vIOiOt+WPluinhuWbvueahOagueiKgueCuVxudmFyIGdldFJvb3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciAkID0gZ2V0JCgpO1xuICB2YXIgY29uZiA9IHRoaXMuY29uZjtcbiAgdmFyIHRlbXBsYXRlID0gY29uZi50ZW1wbGF0ZTtcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgdmFyIHJvb3QgPSBub2Rlcy5yb290O1xuICBpZiAoIXJvb3QpIHtcbiAgICBpZiAoY29uZi5ub2RlKSB7XG4gICAgICByb290ID0gJChjb25mLm5vZGUpO1xuICAgIH1cbiAgICBpZiAoIXJvb3QgfHwgIXJvb3QubGVuZ3RoKSB7XG4gICAgICBpZiAoJC50eXBlKHRlbXBsYXRlKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLmpvaW4oJycpO1xuICAgICAgfVxuICAgICAgcm9vdCA9ICQodGVtcGxhdGUpO1xuICAgIH1cbiAgICBub2Rlcy5yb290ID0gcm9vdDtcbiAgfVxuICByZXR1cm4gcm9vdDtcbn07XG5cbnZhciBWaWV3ID0gJGJhc2UuZXh0ZW5kKHtcbiAgLyoqXG4gICAqIOexu+eahOm7mOiupOmAiemhueWvueixoe+8jOe7keWumuWcqOWOn+Wei+S4iu+8jOS4jeimgeWcqOWunuS+i+S4reebtOaOpeS/ruaUuei/meS4quWvueixoeOAglxuICAgKiBAbmFtZSBWaWV3I2RlZmF1bHRzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBtdmMvVmlld1xuICAgKi9cbiAgZGVmYXVsdHM6IHtcbiAgICBub2RlOiAnJyxcbiAgICB0ZW1wbGF0ZTogJycsXG4gICAgZXZlbnRzOiB7fSxcbiAgICByb2xlOiB7fSxcbiAgfSxcblxuICAvKipcbiAgICog6KeG5Zu+55qE5Luj55CG5LqL5Lu257uR5a6a5YiX6KGo77yM57uR5a6a5Zyo5Y6f5Z6L5LiK77yM5LiN6KaB5Zyo5a6e5L6L5Lit55u05o6l5L+u5pS56L+Z5Liq5a+56LGh44CCXG4gICAqIC0g5LqL5Lu257uR5a6a5qC85byP5Y+v5Lul5Li677yaXG4gICAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZCd9XG4gICAqIC0geydzZWxlY3RvciBldmVudCc6J21ldGhvZDEgbWV0aG9kMid9XG4gICAqIEBuYW1lIFZpZXcjZXZlbnRzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBtdmMvVmlld1xuICAgKi9cbiAgZXZlbnRzOiB7fSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHRoaXMubm9kZXMgPSB7fTtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLmJ1aWxkKCk7XG4gICAgdGhpcy5kZWxlZ2F0ZSgnb24nKTtcbiAgICB0aGlzLnNldEV2ZW50cygnb24nKTtcbiAgfSxcblxuICAvKipcbiAgICog5rex5bqm5re35ZCI5Lyg5YWl55qE6YCJ6aG55LiO6buY6K6k6YCJ6aG577yM5re35ZCI5a6M5oiQ55qE6YCJ6aG55a+56LGh5Y+v6YCa6L+HIHRoaXMuY29uZiDlsZ7mgKforr/pl65cbiAgICogQG1ldGhvZCBWaWV3I3NldE9wdGlvbnNcbiAgICogQG1lbWJlcm9mIG12Yy9WaWV3XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10g6YCJ6aG5XG4gICAqL1xuICBzZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciAkID0gZ2V0JCgpO1xuICAgIHRoaXMuY29uZiA9IHRoaXMuY29uZiB8fCAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgaWYgKCEkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgJC5leHRlbmQodHJ1ZSwgdGhpcy5jb25mLCBvcHRpb25zKTtcbiAgICB0aGlzLmV2ZW50cyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmV2ZW50cywgb3B0aW9ucy5ldmVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnu5HlrpogZXZlbnRzIOWvueixoeWIl+S4vueahOS6i+S7tuOAglxuICAgKiAtIOWcqOWIneWni+WMluaXtuiHquWKqOaJp+ihjOS6hiB0aGlzLmRlbGVnYXRlKCdvbicp44CCXG4gICAqIEBtZXRob2QgVmlldyNkZWxlZ2F0ZVxuICAgKiBAbWVtYmVyb2YgbXZjL1ZpZXdcbiAgICogQHNlZSBbbXZjL2RlbGVnYXRlXSgjbXZjLWRlbGVnYXRlKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2FjdGlvbj0nb24nXSDnu5HlrprliqjkvZzmoIforrDjgILlj6/pgInvvJpbJ29uJywgJ29mZiddXG4gICAqL1xuICBkZWxlZ2F0ZTogZnVuY3Rpb24gKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKSB7XG4gICAgYWN0aW9uID0gYWN0aW9uIHx8ICdvbic7XG4gICAgcm9vdCA9IHJvb3QgfHwgdGhpcy5yb2xlKCdyb290Jyk7XG4gICAgZXZlbnRzID0gZXZlbnRzIHx8IHRoaXMuZXZlbnRzO1xuICAgIGJpbmQgPSBiaW5kIHx8IHRoaXM7XG4gICAgJGRlbGVnYXRlKGFjdGlvbiwgcm9vdCwgZXZlbnRzLCBiaW5kKTtcbiAgfSxcblxuICAvKipcbiAgICog6I635Y+WIC8g6K6+572u6KeS6Imy5a+56LGh5oyH5a6a55qEIGpRdWVyeSDlr7nosaHjgIJcbiAgICogLSDms6jmhI/vvJrojrflj5bliLDop5LoibLlhYPntKDlkI7vvIzor6UgalF1ZXJ5IOWvueixoeS8mue8k+WtmOWcqOinhuWbvuWvueixoeS4rVxuICAgKiBAbWV0aG9kIFZpZXcjcm9sZVxuICAgKiBAbWVtYmVyb2YgbXZjL1ZpZXdcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUg6KeS6Imy5a+56LGh5ZCN56ewXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZWxlbWVudF0g6KeS6Imy5a+56LGh5oyH5a6a55qEZG9t5YWD57Sg5oiW6ICFIGpRdWVyeSDlr7nosaHjgIJcbiAgICogQHJldHVybnMge09iamVjdH0g6KeS6Imy5ZCN5a+55bqU55qEIGpRdWVyeSDlr7nosaHjgIJcbiAgICovXG4gIHJvbGU6IGZ1bmN0aW9uIChuYW1lLCBlbGVtZW50KSB7XG4gICAgdmFyICQgPSBnZXQkKCk7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICB2YXIgcm9vdCA9IGdldFJvb3QuY2FsbCh0aGlzKTtcbiAgICB2YXIgcm9sZSA9IHRoaXMuY29uZi5yb2xlIHx8IHt9O1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgaWYgKG5vZGVzW25hbWVdKSB7XG4gICAgICAgIGVsZW1lbnQgPSBub2Rlc1tuYW1lXTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lID09PSAncm9vdCcpIHtcbiAgICAgICAgZWxlbWVudCA9IHJvb3Q7XG4gICAgICB9IGVsc2UgaWYgKCFlbGVtZW50IHx8ICFlbGVtZW50Lmxlbmd0aCkge1xuICAgICAgICBpZiAocm9sZVtuYW1lXSkge1xuICAgICAgICAgIGVsZW1lbnQgPSByb290LmZpbmQocm9sZVtuYW1lXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudCA9IHJvb3QuZmluZCgnW3JvbGU9XCInICsgbmFtZSArICdcIl0nKTtcbiAgICAgICAgfVxuICAgICAgICBub2Rlc1tuYW1lXSA9IGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgbm9kZXNbbmFtZV0gPSBlbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSxcblxuICAvKipcbiAgICog5riF6Zmk6KeG5Zu+57yT5a2Y55qE6KeS6Imy5a+56LGhXG4gICAqIEBtZXRob2QgVmlldyNyZXNldFJvbGVzXG4gICAqIEBtZW1iZXJvZiBtdmMvVmlld1xuICAgKi9cbiAgcmVzZXRSb2xlczogZnVuY3Rpb24gKCkge1xuICAgIHZhciAkID0gZ2V0JCgpO1xuICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gICAgJC5lYWNoKG5vZGVzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKG5hbWUgIT09ICdyb290Jykge1xuICAgICAgICBub2Rlc1tuYW1lXSA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSBub2Rlc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICog6ZSA5q+B6KeG5Zu+77yM6YeK5pS+5YaF5a2YXG4gICAqIEBtZXRob2QgVmlldyNkZXN0cm95XG4gICAqIEBtZW1iZXJvZiBtdmMvVmlld1xuICAgKi9cbiAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGVsZWdhdGUoJ29mZicpO1xuICAgIHRoaXMuc3VwcigpO1xuICAgIHRoaXMucmVzZXRSb2xlcygpO1xuICAgIHRoaXMubm9kZXMgPSB7fTtcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG4iLCIvKipcbiAqIOaVsOWtl+eahOWNg+WIhuS9jemAl+WPt+WIhumalOihqOekuuazlVxuICogLSBJRTgg55qEIHRvTG9jYWxTdHJpbmcg57uZ5Ye65LqG5bCP5pWw54K55ZCOMuS9jTogTi4wMFxuICogQG1ldGhvZCBudW0vY29tbWFcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yOTAxMTAyL2hvdy10by1wcmludC1hLW51bWJlci13aXRoLWNvbW1hcy1hcy10aG91c2FuZHMtc2VwYXJhdG9ycy1pbi1qYXZhc2NyaXB0XG4gKiBAcGFyYW0ge051bWJlcn0gbnVtIOaVsOWtl1xuICogQHJldHVybnMge1N0cmluZ30g5Y2D5YiG5L2N6KGo56S655qE5pWw5a2XXG4gKiBAZXhhbXBsZVxuICogdmFyICRjb21tYSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtL2NvbW1hJyk7XG4gKiAkY29tbWEoMTIzNDU2Nyk7IC8vJzEsMjM0LDU2NydcbiAqL1xuXG5mdW5jdGlvbiBjb21tYShudW0pIHtcbiAgdmFyIHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgcGFydHNbMF0gPSBwYXJ0c1swXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICByZXR1cm4gcGFydHMuam9pbignLicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbW1hO1xuIiwiLyoqXG4gKiDkv67mraPooaXkvY1cbiAqIEBtZXRob2QgbnVtL2ZpeFRvXG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IG51bSDopoHooaXkvY3nmoTmlbDlrZdcbiAqIEBwYXJhbSB7TnVtYmVyfSBbdz0yXSB3IOihpeS9jeaVsOmHj1xuICogQHJldHVybiB7U3RyaW5nfSDnu4/ov4fooaXkvY3nmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGZpeFRvID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9udW0vZml4VG8nKTtcbiAqICRmaXhUbygwLCAyKTsgLy9yZXR1cm4gJzAwJ1xuICovXG5cbmZ1bmN0aW9uIGZpeFRvKG51bSwgdykge1xuICB2YXIgc3RyID0gbnVtLnRvU3RyaW5nKCk7XG4gIHcgPSBNYXRoLm1heCgodyB8fCAyKSAtIHN0ci5sZW5ndGggKyAxLCAwKTtcbiAgcmV0dXJuIG5ldyBBcnJheSh3KS5qb2luKCcwJykgKyBzdHI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZml4VG87XG4iLCIvKipcbiAqIOWkhOeQhuaVsOWtl++8jOaVsOaNrui9rOaNolxuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9udW1cbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgQHNwb3JlLXVpL2tpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5udW0ubGltaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL251bVxuICogdmFyICRudW0gPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL251bScpO1xuICogY29uc29sZS5pbmZvKCRudW0ubGltaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRsaW1pdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvbnVtL2xpbWl0Jyk7XG4gKi9cblxuZXhwb3J0cy5jb21tYSA9IHJlcXVpcmUoJy4vY29tbWEnKTtcbmV4cG9ydHMuZml4VG8gPSByZXF1aXJlKCcuL2ZpeFRvJyk7XG5leHBvcnRzLmxpbWl0ID0gcmVxdWlyZSgnLi9saW1pdCcpO1xuZXhwb3J0cy5udW1lcmljYWwgPSByZXF1aXJlKCcuL251bWVyaWNhbCcpO1xuIiwiLyoqXG4gKiDpmZDliLbmlbDlrZflnKjkuIDkuKrojIPlm7TlhoVcbiAqIEBtZXRob2QgbnVtL2xpbWl0XG4gKiBAcGFyYW0ge051bWJlcn0gbnVtIOimgemZkOWItueahOaVsOWtl1xuICogQHBhcmFtIHtOdW1iZXJ9IG1pbiDmnIDlsI/ovrnnlYzmlbDlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBtYXgg5pyA5aSn6L6555WM5pWw5YC8XG4gKiBAcmV0dXJuIHtOdW1iZXJ9IOe7j+i/h+mZkOWItueahOaVsOWAvFxuICogQGV4YW1wbGVcbiAqIHZhciAkbGltaXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL251bS9saW1pdCcpO1xuICogJGxpbWl0KDEsIDUsIDEwKTsgLy8gNVxuICogJGxpbWl0KDYsIDUsIDEwKTsgLy8gNlxuICogJGxpbWl0KDExLCA1LCAxMCk7IC8vIDEwXG4gKi9cblxuZnVuY3Rpb24gbGltaXQobnVtLCBtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobnVtLCBtaW4pLCBtYXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpbWl0O1xuIiwiLyoqXG4gKiDlsIbmlbDmja7nsbvlnovovazkuLrmlbTmlbDmlbDlrZfvvIzovazmjaLlpLHotKXliJnov5Tlm57kuIDkuKrpu5jorqTlgLxcbiAqIEBtZXRob2QgbnVtL251bWVyaWNhbFxuICogQHBhcmFtIHsqfSBzdHIg6KaB6L2s5o2i55qE5pWw5o2uXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlZj0wXSDovazmjaLlpLHotKXml7bnmoTpu5jorqTlgLxcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3lzPTEwXSDov5vliLZcbiAqIEByZXR1cm4ge051bWJlcn0g6L2s5o2i6ICM5b6X55qE5pW05pWwXG4gKiBAZXhhbXBsZVxuICogdmFyICRudW1lcmljYWwgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL251bS9udW1lcmljYWwnKTtcbiAqICRudW1lcmljYWwoJzEweCcpOyAvLyAxMFxuICogJG51bWVyaWNhbCgneDEwJyk7IC8vIDBcbiAqL1xuXG5mdW5jdGlvbiBudW1lcmljYWwoc3RyLCBkZWYsIHN5cykge1xuICBkZWYgPSBkZWYgfHwgMDtcbiAgc3lzID0gc3lzIHx8IDEwO1xuICByZXR1cm4gcGFyc2VJbnQoc3RyLCBzeXMpIHx8IGRlZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBudW1lcmljYWw7XG4iLCIvKipcbiAqIOaJqeWxleW5tuimhuebluWvueixoVxuICogQG1ldGhvZCBvYmovYXNzaWduXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIOimgeaJqeWxleeahOWvueixoVxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0g6KaB5omp5bGV55qE5bGe5oCn6ZSu5YC85a+5XG4gKiBAcmV0dXJucyB7T2JqZWN0fSDmianlsZXlkI7nmoTmupDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGFzc2lnbiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL2Fzc2lnbicpO1xuICogdmFyIG9iaiA9IHthOiAxLCBiOiAyfTtcbiAqIGNvbnNvbGUuaW5mbygkYXNzaWduKG9iaiwge2I6IDMsIGM6IDR9KSk7IC8vIHthOiAxLCBiOiAzLCBjOiA0fVxuICogY29uc29sZS5pbmZvKCRhc3NpZ24oe30sIG9iaiwge2I6IDMsIGM6IDR9KSk7IC8vIHthOiAxLCBiOiAzLCBjOiA0fVxuICovXG5cbmZ1bmN0aW9uIGFzc2lnbihvYmopIHtcbiAgb2JqID0gb2JqIHx8IHt9O1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciBwcm9wO1xuICAgIHNvdXJjZSA9IHNvdXJjZSB8fCB7fTtcbiAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsIi8qKlxuICog566A5piT5YWL6ZqG5a+56LGh77yM5Lya5Lii5aSx5Ye95pWw562J5LiN6IO96KKrIEpTT04g5bqP5YiX5YyW55qE5YaF5a65XG4gKiBAbWV0aG9kIG9iai9jbG9uZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCDopoHlhYvpmobnmoTlr7nosaFcbiAqIEByZXR1cm5zIHtPYmplY3R9IOWFi+mahuWQjueahOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkY2xvbmUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai9jbG9uZScpO1xuICogdmFyIG9iaiA9IHthOiAxLCBiOiAyfTtcbiAqIGNvbnNvbGUuaW5mbygkY2xvbmUob2JqKSk7IC8ve2E6IDEsIGI6IDJ9XG4gKi9cblxuZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwidmFyICR0eXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XG5cbi8qKlxuICog5rex5bqm5YWL6ZqG5a+56LGh77yM5Lya5L+d55WZ5Ye95pWw5byV55SoXG4gKiBAbWV0aG9kIG9iai9jbG9uZURlZXBcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIOimgeWFi+mahueahOWvueixoVxuICogQHJldHVybnMge09iamVjdH0g5YWL6ZqG5ZCO55qE5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRjbG9uZURlZXAgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai9jbG9uZURlZXAnKTtcbiAqIHZhciBvYmogPSB7YTogMSwgYjogMiwgYzogZnVuY3Rpb24gKCkge319O1xuICogY29uc29sZS5pbmZvKCRjbG9uZURlZXAob2JqKSk7IC8ve2E6IDEsIGI6IDIsIGM6IGZ1bmN0aW9uICgpIHt9fVxuICovXG5cbnZhciBjbG9uZUFycjtcbnZhciBjbG9uZU9iajtcbnZhciBjbG9uZURlZXA7XG5cbmNsb25lQXJyID0gZnVuY3Rpb24gKGFycikge1xuICB2YXIgY2FyciA9IFtdO1xuICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICBjYXJyW2luZGV4XSA9IGNsb25lRGVlcChpdGVtKTtcbiAgfSk7XG4gIHJldHVybiBjYXJyO1xufTtcblxuY2xvbmVPYmogPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBjb2JqID0ge307XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGl0ZW0gPSBvYmpba2V5XTtcbiAgICBjb2JqW2tleV0gPSBjbG9uZURlZXAoaXRlbSk7XG4gIH0pO1xuICByZXR1cm4gY29iajtcbn07XG5cbmNsb25lRGVlcCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIGlmICgkdHlwZShpdGVtKSA9PT0gJ2FycmF5Jykge1xuICAgIHJldHVybiBjbG9uZUFycihpdGVtKTtcbiAgfVxuICBpZiAoJHR5cGUoaXRlbSkgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGNsb25lT2JqKGl0ZW0pO1xuICB9XG4gIHJldHVybiBpdGVtO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURlZXA7XG4iLCIvKipcbiAqIOimhuebluWvueixoe+8jOS4jea3u+WKoOaWsOeahOmUrlxuICogQG1ldGhvZCBvYmovY292ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3Qg6KaB6KaG55uW55qE5a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSDopoHopobnm5bnmoTlsZ7mgKfplK7lgLzlr7lcbiAqIEByZXR1cm5zIHtPYmplY3R9IOimhuebluWQjueahOa6kOWvueixoVxuICogQGV4YW1wbGVcbiAqIHZhciAkY292ZXIgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai9jb3ZlcicpO1xuICogdmFyIG9iaiA9IHthOiAxLCBiOiAyfTtcbiAqIGNvbnNvbGUuaW5mbygkY292ZXIob2JqLHtiOiAzLCBjOiA0fSkpOyAvL3thOiAxLCBiOiAzfVxuICovXG5cbmZ1bmN0aW9uIGNvdmVyKCkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIHZhciBvYmplY3QgPSBhcmdzLnNoaWZ0KCk7XG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdC5oYXNPd25Qcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtLmhhc093blByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3ZlcjtcbiIsIi8qKlxuICog5p+l5om+5a+56LGh6Lev5b6E5LiK55qE5YC8KOeugOaYk+eJiClcbiAqIEBzZWUgW2xvZGFzaC5nZXRdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzLzQuMTcuMTUjZ2V0KVxuICogQG1ldGhvZCBvYmovZmluZFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCDopoHmn6Xmib7nmoTlr7nosaFcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIOimgeafpeaJvueahOi3r+W+hFxuICogQHJldHVybiB7Kn0g5a+56LGh6Lev5b6E5LiK55qE5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRmaW5kID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9vYmovZmluZCcpO1xuICogdmFyIG9iaiA9IHthOntiOntjOjF9fX07XG4gKiBjb25zb2xlLmluZm8oJGZpbmQob2JqLCdhLmIuYycpKTsgLy8gMVxuICogY29uc29sZS5pbmZvKCRmaW5kKG9iaiwnYS5jJykpOyAvLyB1bmRlZmluZWRcbiAqL1xuXG5mdW5jdGlvbiBmaW5kUGF0aChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgJyc7XG4gIGlmICghcGF0aCkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHF1ZXVlID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbmFtZTtcbiAgdmFyIHBvcyA9IG9iamVjdDtcblxuICB3aGlsZSAocXVldWUubGVuZ3RoKSB7XG4gICAgbmFtZSA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKCFwb3NbbmFtZV0pIHtcbiAgICAgIHJldHVybiBwb3NbbmFtZV07XG4gICAgfVxuICAgIHBvcyA9IHBvc1tuYW1lXTtcbiAgfVxuXG4gIHJldHVybiBwb3M7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZFBhdGg7XG4iLCJ2YXIgJHR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcbnZhciAka2V5UGF0aFNwbGl0ID0gcmVxdWlyZSgnLi4vc3RyL2tleVBhdGhTcGxpdCcpO1xuXG4vKipcbiAqIOS7juWvueixoei3r+W+hOWPluWAvCjnroDmmJPniYgpXG4gKiBAbWV0aG9kIG9iai9nZXRcbiAqIEBzZWUgW2xvZGFzaC5nZXRdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzLzQuMTcuMTUjZ2V0KVxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiDopoHlj5blgLznmoTlr7nosaHmiJbogIXmlbDnu4RcbiAqIEBwYXJhbSB7U3RyaW5nfSB4cGF0aCDopoHlj5blgLznmoTot6/lvoRcbiAqIEBwYXJhbSB7QW55fSBbZGVmYXVsdFZhbHVlXSDlgLzkuLogdW5kZWZpbmVkIOWImeWPluatpOm7mOiupOWAvFxuICogQHJldHVybnMge0FueX0g5Y+W5b6X55qE5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL29iai9nZXQnKTtcbiAqIHZhciBvYmogPSB7YToge2I6IHtjOiAxfX19O1xuICogY29uc29sZS5pbmZvKCRnZXQob2JqLCAnYS5iLmMnKTsgLy8gMVxuICogY29uc29sZS5pbmZvKCRnZXQob2JqLCAnZScpOyAvLyB1bmRlZmluZWRcbiAqIGNvbnNvbGUuaW5mbygkZ2V0KG9iaiwgJ2UnLCAzKTsgLy8gM1xuICogdmFyIGFyciA9IFsxLCB7YTogWzIsIDNdfV07XG4gKiBjb25zb2xlLmluZm8oJGdldChhcnIsICdbMV0uYVsxXScpOyAvLyAzXG4gKi9cblxuLy8g5byV55SoIGxvZGFzaC9nZXQg5Lya5byV5YWl6LaF6L+HMTBrYiDku6PnoIHvvIznlKjov5nkuKrmlrnms5XmnaXnsr7nroAgc2RrIOS9k+enr1xuXG5mdW5jdGlvbiBnZXQob2JqLCB4cGF0aCwgZGVmKSB7XG4gIGlmICghb2JqKSByZXR1cm4gdW5kZWZpbmVkO1xuICBpZiAodHlwZW9mIHhwYXRoICE9PSAnc3RyaW5nJykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgdmFyIGFyclhwYXRoID0gJGtleVBhdGhTcGxpdCh4cGF0aCk7XG4gIHZhciBwb2ludCA9IG9iajtcbiAgdmFyIGxlbiA9IGFyclhwYXRoLmxlbmd0aDtcbiAgdmFyIGluZGV4O1xuICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4ICs9IDEpIHtcbiAgICB2YXIga2V5ID0gYXJyWHBhdGhbaW5kZXhdO1xuICAgIHZhciBvdHlwZSA9ICR0eXBlKHBvaW50KTtcbiAgICBpZiAob3R5cGUgPT09ICdhcnJheScpIHtcbiAgICAgIGlmICgvXlxcZCskLy50ZXN0KGtleSkpIHtcbiAgICAgICAga2V5ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG4gICAgICB9XG4gICAgICBwb2ludCA9IHBvaW50W2tleV07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcG9pbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICBwb2ludCA9IHBvaW50W2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50ID0gdW5kZWZpbmVkO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciB2YWx1ZSA9IHBvaW50O1xuICBpZiAoJHR5cGUodmFsdWUpID09PSAndW5kZWZpbmVkJykge1xuICAgIGlmICgkdHlwZShkZWYpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFsdWUgPSBkZWY7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG4iLCIvKipcbiAqIOWvueixoeWkhOeQhuS4juWIpOaWrVxuICogQG1vZHVsZSBzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy9vYmpcbiAqIEBleGFtcGxlXG4gKiAvLyDnu5/kuIDlvJXlhaUgQHNwb3JlLXVpL2tpdFxuICogdmFyICRraXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0Jyk7XG4gKiBjb25zb2xlLmluZm8oJGtpdC5vYmoudHlwZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqXG4gKiB2YXIgJG9iaiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqJyk7XG4gKiBjb25zb2xlLmluZm8oJG9iai50eXBlKTtcbiAqXG4gKiAvLyDljZXni6zlvJXlhaXkuIDkuKrmlrnms5VcbiAqIHZhciAkdHlwZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL3R5cGUnKTtcbiAqL1xuXG5leHBvcnRzLmFzc2lnbiA9IHJlcXVpcmUoJy4vYXNzaWduJyk7XG5leHBvcnRzLmNsb25lID0gcmVxdWlyZSgnLi9jbG9uZScpO1xuZXhwb3J0cy5jbG9uZURlZXAgPSByZXF1aXJlKCcuL2Nsb25lRGVlcCcpO1xuZXhwb3J0cy5tZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcbmV4cG9ydHMuY292ZXIgPSByZXF1aXJlKCcuL2NvdmVyJyk7XG5leHBvcnRzLmZpbmQgPSByZXF1aXJlKCcuL2ZpbmQnKTtcbmV4cG9ydHMuZ2V0ID0gcmVxdWlyZSgnLi9nZXQnKTtcbmV4cG9ydHMuc2V0ID0gcmVxdWlyZSgnLi9zZXQnKTtcbmV4cG9ydHMudHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xuIiwidmFyICR0eXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XG5cbnZhciBtZXJnZUFycjtcbnZhciBtZXJnZU9iajtcblxudmFyIGlzT2JqID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgcmV0dXJuIChcbiAgICBpdGVtXG4gICAgJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnXG4gICk7XG59O1xuXG52YXIgbWVyZ2VJdGVtID0gZnVuY3Rpb24gKG9yaWdpbiwgaXRlbSwga2V5KSB7XG4gIHZhciBwcmV2ID0gb3JpZ2luW2tleV07XG4gIGlmIChcbiAgICAkdHlwZShwcmV2KSA9PT0gJ2FycmF5J1xuICAgICYmICR0eXBlKGl0ZW0pID09PSAnYXJyYXknXG4gICkge1xuICAgIG1lcmdlQXJyKHByZXYsIGl0ZW0pO1xuICB9IGVsc2UgaWYgKFxuICAgIGlzT2JqKHByZXYpXG4gICAgJiYgaXNPYmooaXRlbSlcbiAgKSB7XG4gICAgbWVyZ2VPYmoocHJldiwgaXRlbSk7XG4gIH0gZWxzZSB7XG4gICAgb3JpZ2luW2tleV0gPSBpdGVtO1xuICB9XG59O1xuXG5tZXJnZUFyciA9IGZ1bmN0aW9uIChvcmlnaW4sIHNvdXJjZSkge1xuICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICBtZXJnZUl0ZW0ob3JpZ2luLCBpdGVtLCBpbmRleCk7XG4gIH0pO1xufTtcblxubWVyZ2VPYmogPSBmdW5jdGlvbiAob3JpZ2luLCBzb3VyY2UpIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBtZXJnZUl0ZW0ob3JpZ2luLCBzb3VyY2Vba2V5XSwga2V5KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIOa3seW6pua3t+WQiOa6kOWvueixoe+8jOS8muS/neeVmeWHveaVsOW8leeUqFxuICogQG1ldGhvZCBvYmovbWVyZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW4g6KaB5re35ZCI55qE5rqQ5a+56LGhXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IOimgea3t+WQiOeahOWvueixoVxuICogQHJldHVybnMge09iamVjdH0g5re35ZCI5LmL5ZCO55qE5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRtZXJnZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvb2JqL21lcmdlJyk7XG4gKiB2YXIgb3JpZ2luID0ge2E6e2I6e2M6MX19fTtcbiAqIHZhciB0YXJnZXQgPSB7YTp7Yjp7ZDoyfX19O1xuICogY29uc29sZS5pbmZvKCRtZXJnZShvcmlnaW4sIHRhcmdldCkpO1xuICogLy8ge2E6e2I6e2M6MSxkOjJ9fX07XG4gKi9cbnZhciBtZXJnZSA9IGZ1bmN0aW9uIChvcmlnaW4pIHtcbiAgaWYgKHR5cGVvZiBvcmlnaW4gIT09ICdvYmplY3QnKSByZXR1cm4gb3JpZ2luO1xuICB2YXIgcmVzdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICByZXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoJHR5cGUoc291cmNlKSA9PT0gJ2FycmF5Jykge1xuICAgICAgbWVyZ2VBcnIob3JpZ2luLCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmooc291cmNlKSkge1xuICAgICAgbWVyZ2VPYmoob3JpZ2luLCBzb3VyY2UpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyICR0eXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XG52YXIgJGdldCA9IHJlcXVpcmUoJy4vZ2V0Jyk7XG52YXIgJGtleVBhdGhTcGxpdCA9IHJlcXVpcmUoJy4uL3N0ci9rZXlQYXRoU3BsaXQnKTtcblxuLyoqXG4gKiDlkJHlr7nosaHot6/lvoTorr7nva7lgLwo566A5piT54mIKVxuICogQG1ldGhvZCBvYmovc2V0XG4gKiBAc2VlIFtsb2Rhc2guc2V0XShodHRwczovL2xvZGFzaC5jb20vZG9jcy80LjE3LjE1I3NldClcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmog6KaB6K6+572u5YC855qE5a+56LGh5oiW6ICF5pWw57uEXG4gKiBAcGFyYW0ge1N0cmluZ30geHBhdGgg6KaB5Y+W5YC855qE6Lev5b6EXG4gKiBAcGFyYW0ge0FueX0gdmFsdWUg6KaB6K6+572u55qE5YC8XG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogQGV4YW1wbGVcbiAqIHZhciAkc2V0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9vYmovc2V0Jyk7XG4gKiB2YXIgb2JqID0ge2E6IHtiOiB7YzogMX19fTtcbiAqICRzZXQob2JqLCAnYS5iLmMnLCAyKTtcbiAqIGNvbnNvbGUuaW5mbyhvYmouYS5iLmMpIC8vIDJcbiAqL1xuZnVuY3Rpb24gc2V0KG9iaiwgeHBhdGgsIHZhbHVlKSB7XG4gIGlmICghb2JqKSByZXR1cm47XG4gIGlmICh0eXBlb2YgeHBhdGggIT09ICdzdHJpbmcnKSByZXR1cm47XG4gIGlmICgheHBhdGgpIHJldHVybjtcbiAgdmFyIGFyclhwYXRoID0gJGtleVBhdGhTcGxpdCh4cGF0aCk7XG4gIHZhciBrZXkgPSBhcnJYcGF0aC5wb3AoKTtcbiAgdmFyIHRhcmdldCA9ICRnZXQob2JqLCBhcnJYcGF0aC5qb2luKCcuJykpO1xuICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICBpZiAoJHR5cGUodGFyZ2V0KSA9PT0gJ2FycmF5Jykge1xuICAgIGlmICgvXlxcZCskLy50ZXN0KGtleSkpIHtcbiAgICAgIGtleSA9IHBhcnNlSW50KGtleSwgMTApO1xuICAgIH1cbiAgICBpZiAoJHR5cGUodmFsdWUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJHR5cGUodGFyZ2V0KSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoJHR5cGUodmFsdWUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXQ7XG4iLCIvKipcbiAqIOiOt+WPluaVsOaNruexu+Wei1xuICogQG1ldGhvZCBvYmovdHlwZVxuICogQHBhcmFtIHsqfSBpdGVtIOS7u+S9leexu+Wei+aVsOaNrlxuICogQHJldHVybnMge1N0cmluZ30g5a+56LGh57G75Z6LXG4gKiBAZXhhbXBsZVxuICogdmFyICR0eXBlID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9vYmovdHlwZScpO1xuICogJHR5cGUoe30pOyAvLyAnb2JqZWN0J1xuICogJHR5cGUoMSk7IC8vICdudW1iZXInXG4gKiAkdHlwZSgnJyk7IC8vICdzdHJpbmcnXG4gKiAkdHlwZShmdW5jdGlvbigpe30pOyAvLyAnZnVuY3Rpb24nXG4gKiAkdHlwZSgpOyAvLyAndW5kZWZpbmVkJ1xuICogJHR5cGUobnVsbCk7IC8vICdudWxsJ1xuICogJHR5cGUobmV3IERhdGUoKSk7IC8vICdkYXRlJ1xuICogJHR5cGUoL2EvKTsgLy8gJ3JlZ2V4cCdcbiAqICR0eXBlKFN5bWJvbCgnYScpKTsgLy8gJ3N5bWJvbCdcbiAqICR0eXBlKHdpbmRvdykgLy8gJ3dpbmRvdydcbiAqICR0eXBlKGRvY3VtZW50KSAvLyAnaHRtbGRvY3VtZW50J1xuICogJHR5cGUoZG9jdW1lbnQuYm9keSkgLy8gJ2h0bWxib2R5ZWxlbWVudCdcbiAqICR0eXBlKGRvY3VtZW50LmhlYWQpIC8vICdodG1saGVhZGVsZW1lbnQnXG4gKiAkdHlwZShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JykpIC8vICdodG1sY29sbGVjdGlvbidcbiAqICR0eXBlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKVswXSkgLy8gJ2h0bWxkaXZlbGVtZW50J1xuICovXG5cbmZ1bmN0aW9uIHR5cGUoaXRlbSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuICAgIC5jYWxsKGl0ZW0pXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXlxcW29iamVjdFxccyp8XFxdJC9naSwgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb250cm9sLXJlZ2V4ICovXG4vKipcbiAqIOiOt+WPluWtl+espuS4sumVv+W6pu+8jOS4gOS4quS4reaWh+eulzLkuKrlrZfnrKZcbiAqIEBtZXRob2Qgc3RyL2JMZW5ndGhcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg6KaB6K6h566X6ZW/5bqm55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7TnVtYmVyfSDlrZfnrKbkuLLplb/luqZcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGJMZW5ndGggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9iTGVuZ3RoJyk7XG4gKiAkYkxlbmd0aCgn5Lit5paHY2MnKTsgLy8gNlxuICovXG5cbmZ1bmN0aW9uIGJMZW5ndGgoc3RyKSB7XG4gIHZhciBhTWF0Y2g7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgYU1hdGNoID0gc3RyLm1hdGNoKC9bXlxceDAwLVxceGZmXS9nKTtcbiAgcmV0dXJuIChzdHIubGVuZ3RoICsgKCFhTWF0Y2ggPyAwIDogYU1hdGNoLmxlbmd0aCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJMZW5ndGg7XG4iLCIvKipcbiAqIOWFqOinkuWtl+espui9rOWNiuinkuWtl+esplxuICogQG1ldGhvZCBzdHIvZGJjVG9TYmNcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIg5YyF5ZCr5LqG5YWo6KeS5a2X56ym55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDnu4/ov4fovazmjaLnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGRiY1RvU2JjID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvZGJjVG9TYmMnKTtcbiAqICRkYmNUb1NiYygn77yz77yh77yh77yz77yk77ym77yz77yh77yk77ymJyk7IC8vICdTQUFTREZTQURGJ1xuICovXG5cbmZ1bmN0aW9uIGRiY1RvU2JjKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXHVmZjAxLVxcdWZmNWVdL2csIGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoYS5jaGFyQ29kZUF0KDApIC0gNjUyNDgpO1xuICB9KS5yZXBsYWNlKC9cXHUzMDAwL2csICcgJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGJjVG9TYmM7XG4iLCIvKipcbiAqIOino+eggUhUTUzvvIzlsIblrp7kvZPlrZfnrKbovazmjaLkuLpIVE1M5a2X56ymXG4gKiBAbWV0aG9kIHN0ci9kZWNvZGVIVE1MXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOWQq+acieWunuS9k+Wtl+espueahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gSFRNTOWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkZGVjb2RlSFRNTCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL2RlY29kZUhUTUwnKTtcbiAqICRkZWNvZGVIVE1MKCcmYW1wOyZsdDsmZ3Q7JnF1b3Q7JiMzOTsmIzMyOycpOyAvLyAnJjw+XCJcXCcgJ1xuICovXG5cbmZ1bmN0aW9uIGRlY29kZUhUTUwoc3RyKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignZGVjb2RlSFRNTCBuZWVkIGEgc3RyaW5nIGFzIHBhcmFtZXRlcicpO1xuICB9XG4gIHJldHVybiBzdHIucmVwbGFjZSgvJnF1b3Q7L2csICdcIicpXG4gICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAucmVwbGFjZSgvJiMzOTsvZywgJ1xcJycpXG4gICAgLnJlcGxhY2UoLyZuYnNwOy9nLCAnXFx1MDBBMCcpXG4gICAgLnJlcGxhY2UoLyYjMzI7L2csICdcXHUwMDIwJylcbiAgICAucmVwbGFjZSgvJmFtcDsvZywgJyYnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWNvZGVIVE1MO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29udHJvbC1yZWdleCAqL1xuLyoqXG4gKiDnvJbnoIFIVE1M77yM5bCGSFRNTOWtl+espui9rOS4uuWunuS9k+Wtl+esplxuICogQG1ldGhvZCBzdHIvZW5jb2RlSFRNTFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDlkKvmnIlIVE1M5a2X56ym55qE5a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSDnu4/ov4fovazmjaLnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGVuY29kZUhUTUwgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9lbmNvZGVIVE1MJyk7XG4gKiAkZW5jb2RlSFRNTChgJjw+XCJcXCcgYCk7IC8vICcmYW1wOyZsdDsmZ3Q7JnF1b3Q7JiMzOTsmIzMyOydcbiAqL1xuXG5mdW5jdGlvbiBlbmNvZGVIVE1MKHN0cikge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuY29kZUhUTUwgbmVlZCBhIHN0cmluZyBhcyBwYXJhbWV0ZXInKTtcbiAgfVxuICByZXR1cm4gc3RyLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvJy9nLCAnJiMzOTsnKVxuICAgIC5yZXBsYWNlKC9cXHUwMEEwL2csICcmbmJzcDsnKVxuICAgIC5yZXBsYWNlKC8oXFx1MDAyMHxcXHUwMDBCfFxcdTIwMjh8XFx1MjAyOXxcXGYpL2csICcmIzMyOycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVuY29kZUhUTUw7XG4iLCIvKipcbiAqIOiOt+WPljM26L+b5Yi26ZqP5py65a2X56ym5LiyXG4gKiBAbWV0aG9kIHN0ci9nZXRSbmQzNlxuICogQHBhcmFtIHtGbG9hdH0gW3JuZF0g6ZqP5py65pWw77yM5LiN5Lyg5YiZ55Sf5oiQ5LiA5Liq6ZqP5py65pWwXG4gKiBAcmV0dXJuIHtTdHJpbmd9IOi9rOaIkOS4ujM26L+b5Yi255qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRSbmQzNiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL2dldFJuZDM2Jyk7XG4gKiAkZ2V0Um5kMzYoMC41ODEwNzY2ODMyNTkwNDQ2KTsgLy8gJ2t4MnBveno5cmdmJ1xuICovXG5cbmZ1bmN0aW9uIGdldFJuZDM2KHJuZCkge1xuICBybmQgPSBybmQgfHwgTWF0aC5yYW5kb20oKTtcbiAgcmV0dXJuIHJuZC50b1N0cmluZygzNikucmVwbGFjZSgvXjAuLywgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJuZDM2O1xuIiwiLyoqXG4gKiDojrflj5YzNui/m+WItuaXpeacn+Wtl+espuS4slxuICogQG1ldGhvZCBzdHIvZ2V0VGltZTM2XG4gKiBAcGFyYW0ge0RhdGV9IFtkYXRlXSDnrKblkIjop4TojIPnmoTml6XmnJ/lrZfnrKbkuLLmiJbogIXmlbDlrZfvvIzkuI3kvKDlj4LmlbDliJnkvb/nlKjlvZPliY3lrqLmiLfnq6/ml7bpl7RcbiAqIEByZXR1cm4ge1N0cmluZ30g6L2s5oiQ5Li6Mzbov5vliLbnmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGdldFRpbWUzNiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL2dldFRpbWUzNicpO1xuICogJGdldFRpbWUzNignMjAyMCcpOyAvLyAnazR1amFpbzAnXG4gKi9cblxuZnVuY3Rpb24gZ2V0VGltZTM2KGRhdGUpIHtcbiAgZGF0ZSA9IGRhdGUgPyBuZXcgRGF0ZShkYXRlKSA6IG5ldyBEYXRlKCk7XG4gIHJldHVybiBkYXRlLmdldFRpbWUoKS50b1N0cmluZygzNik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGltZTM2O1xuIiwiLyoqXG4gKiDnlJ/miJDkuIDkuKrkuI3kuI7kuYvliY3ph43lpI3nmoTpmo/mnLrlrZfnrKbkuLJcbiAqIEBtZXRob2Qgc3RyL2dldFVuaXF1ZUtleVxuICogQHJldHVybnMge1N0cmluZ30g6ZqP5py65a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRnZXRVbmlxdWVLZXkgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9nZXRVbmlxdWVLZXknKTtcbiAqICRnZXRVbmlxdWVLZXkoKTsgLy8gJzE2NmFhZTFmYTlmJ1xuICovXG5cbnZhciB0aW1lID0gK25ldyBEYXRlKCk7XG52YXIgaW5kZXggPSAwO1xuXG5mdW5jdGlvbiBnZXRVbmlxdWVLZXkoKSB7XG4gIGluZGV4ICs9IDE7XG4gIHJldHVybiAodGltZSArIChpbmRleCkpLnRvU3RyaW5nKDE2KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRVbmlxdWVLZXk7XG4iLCIvKipcbiAqIOWwhumpvOWzsOagvOW8j+WPmOS4uui/nuWtl+espuagvOW8j1xuICogQG1ldGhvZCBzdHIvaHlwaGVuYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmpvOWzsOagvOW8j+eahOWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30g6L+e5a2X56ym5qC85byP55qE5a2X56ym5LiyXG4gKiBAZXhhbXBsZVxuICogdmFyICRoeXBoZW5hdGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9oeXBoZW5hdGUnKTtcbiAqICRoeXBoZW5hdGUoJ2xpYktpdFN0ckh5cGhlbmF0ZScpOyAvLyAnbGliLWtpdC1zdHItaHlwaGVuYXRlJ1xuICovXG5cbmZ1bmN0aW9uIGh5cGhlbmF0ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAoJDApIHtcbiAgICByZXR1cm4gJy0nICsgJDAudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwaGVuYXRlO1xuIiwiLyoqXG4gKiDlrZfnrKbkuLLlpITnkIbkuI7liKTmlq1cbiAqIEBtb2R1bGUgc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0clxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3BvcmVVSS9zcG9yZS1raXQvdHJlZS9tYXN0ZXIvcGFja2FnZXMvc3RyXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQuc3RyLnN1YnN0aXR1dGUpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0clxuICogdmFyICRzdHIgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0cicpO1xuICogY29uc29sZS5pbmZvKCRzdHIuc3Vic3RpdHV0ZSk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHN1YnN0aXR1dGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9zdWJzdGl0dXRlJyk7XG4gKi9cblxuZXhwb3J0cy5iTGVuZ3RoID0gcmVxdWlyZSgnLi9iTGVuZ3RoJyk7XG5leHBvcnRzLmRiY1RvU2JjID0gcmVxdWlyZSgnLi9kYmNUb1NiYycpO1xuZXhwb3J0cy5kZWNvZGVIVE1MID0gcmVxdWlyZSgnLi9kZWNvZGVIVE1MJyk7XG5leHBvcnRzLmVuY29kZUhUTUwgPSByZXF1aXJlKCcuL2VuY29kZUhUTUwnKTtcbmV4cG9ydHMuZ2V0Um5kMzYgPSByZXF1aXJlKCcuL2dldFJuZDM2Jyk7XG5leHBvcnRzLmdldFRpbWUzNiA9IHJlcXVpcmUoJy4vZ2V0VGltZTM2Jyk7XG5leHBvcnRzLmdldFVuaXF1ZUtleSA9IHJlcXVpcmUoJy4vZ2V0VW5pcXVlS2V5Jyk7XG5leHBvcnRzLmh5cGhlbmF0ZSA9IHJlcXVpcmUoJy4vaHlwaGVuYXRlJyk7XG5leHBvcnRzLmlwVG9IZXggPSByZXF1aXJlKCcuL2lwVG9IZXgnKTtcbmV4cG9ydHMubGVmdEIgPSByZXF1aXJlKCcuL2xlZnRCJyk7XG5leHBvcnRzLnNpemVPZlVURjhTdHJpbmcgPSByZXF1aXJlKCcuL3NpemVPZlVURjhTdHJpbmcnKTtcbmV4cG9ydHMuc3Vic3RpdHV0ZSA9IHJlcXVpcmUoJy4vc3Vic3RpdHV0ZScpO1xuZXhwb3J0cy5rZXlQYXRoU3BsaXQgPSByZXF1aXJlKCcuL2tleVBhdGhTcGxpdCcpO1xuIiwiLyoqXG4gKiDljYHov5vliLZJUOWcsOWdgOi9rOWNgeWFrei/m+WItlxuICogQG1ldGhvZCBzdHIvaXBUb0hleFxuICogQHBhcmFtIHtTdHJpbmd9IGlwIOWNgei/m+WItuaVsOWtl+eahElQVjTlnLDlnYBcbiAqIEByZXR1cm4ge1N0cmluZ30gMTbov5vliLbmlbDlrZdJUFY05Zyw5Z2AXG4gKiBAZXhhbXBsZVxuICogdmFyICRpcFRvSGV4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvaXBUb0hleCcpO1xuICogJGlwVG9IZXgoJzI1NS4yNTUuMjU1LjI1NScpOyAvL3JldHVybiAnZmZmZmZmZmYnXG4gKi9cblxuZnVuY3Rpb24gaXBUb0hleChpcCkge1xuICByZXR1cm4gaXAucmVwbGFjZSgvKFxcZCspXFwuKi9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bSkge1xuICAgIG51bSA9IHBhcnNlSW50KG51bSwgMTApIHx8IDA7XG4gICAgbnVtID0gbnVtLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAobnVtLmxlbmd0aCA8IDIpIHtcbiAgICAgIG51bSA9ICcwJyArIG51bTtcbiAgICB9XG4gICAgcmV0dXJuIG51bTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXBUb0hleDtcbiIsIi8qKlxuICog6Kej5p6Q5a+56LGh6Lev5b6E5Li65LiA5Liq5pWw57uEXG4gKiBAbWV0aG9kIHN0ci9rZXlQYXRoU3BsaXRcbiAqIEBwYXJhbSB7U3RyaW5nfSDlr7nosaHot6/lvoRcbiAqIEByZXR1cm5zIHtBcnJheX0g5a+56LGh6Lev5b6E5pWw57uEXG4gKiBAZXhhbXBsZVxuICogdmFyICRrZXlQYXRoU3BsaXQgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9rZXlQYXRoU3BsaXQnKTtcbiAqIGNvbnNvbGUuaW5mbygka2V5UGF0aFNwbGl0KCdbMV0uYVsxXVsyXWIuYycpOyAvLyBbJzEnLCAnYScsICcxJywgJzInLCAnYicsICdjJ11cbiAqL1xuXG5mdW5jdGlvbiBrZXlQYXRoU3BsaXQoeHBhdGgpIHtcbiAgaWYgKHR5cGVvZiB4cGF0aCAhPT0gJ3N0cmluZycpIHJldHVybiBbXTtcbiAgdmFyIGFyclhwYXRoID0gW107XG4gIHhwYXRoLnNwbGl0KCcuJykuZm9yRWFjaChmdW5jdGlvbiAoaXRlbVBhdGgpIHtcbiAgICB2YXIgc3RySXRlbSA9IGl0ZW1QYXRoLnJlcGxhY2UoL1xcWyhbXltcXF1dKylcXF0vZywgJy4kMScpO1xuICAgIHZhciBpdGVtQXJyID0gc3RySXRlbS5zcGxpdCgnLicpO1xuICAgIGlmIChpdGVtQXJyWzBdID09PSAnJykge1xuICAgICAgaXRlbUFyci5zaGlmdCgpO1xuICAgIH1cbiAgICBpdGVtQXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIGFyclhwYXRoLnB1c2goaXRlbSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXJyWHBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5UGF0aFNwbGl0O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29udHJvbC1yZWdleCAqL1xuLyoqXG4gKiDku47lt6bliLDlj7Plj5blrZfnrKbkuLLvvIzkuK3mlofnrpfkuKTkuKrlrZfnrKZcbiAqIEBtZXRob2Qgc3RyL2xlZnRCXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuc1xuICogQHJldHVybnMge1N0cmluZ30gc3RyXG4gKiBAZXhhbXBsZVxuICogdmFyICRsZWZ0QiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvc3RyL2xlZnRCJyk7XG4gKiAvL+WQkeaxiee8luiHtOaVrFxuICogJGxlZnRCKCfkuJbnlYznnJ/lkozosJAnLCA2KTsgLy8gJ+S4lueVjOecnydcbiovXG5cbnZhciAkYkxlbmd0aCA9IHJlcXVpcmUoJy4vYkxlbmd0aCcpO1xuXG5mdW5jdGlvbiBsZWZ0QihzdHIsIGxlbnMpIHtcbiAgdmFyIHMgPSBzdHIucmVwbGFjZSgvXFwqL2csICcgJylcbiAgICAucmVwbGFjZSgvW15cXHgwMC1cXHhmZl0vZywgJyoqJyk7XG4gIHN0ciA9IHN0ci5zbGljZSgwLCBzLnNsaWNlKDAsIGxlbnMpXG4gICAgLnJlcGxhY2UoL1xcKlxcKi9nLCAnICcpXG4gICAgLnJlcGxhY2UoL1xcKi9nLCAnJykubGVuZ3RoKTtcbiAgaWYgKCRiTGVuZ3RoKHN0cikgPiBsZW5zICYmIGxlbnMgPiAwKSB7XG4gICAgc3RyID0gc3RyLnNsaWNlKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxlZnRCO1xuIiwiLyoqXG4gKiDlj5blrZfnrKbkuLIgdXRmOCDnvJbnoIHplb/luqbvvIxmcm9tIOeOi+mbhum5hFxuICogQG1ldGhvZCBzdHIvc2l6ZU9mVVRGOFN0cmluZ1xuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge051bWJlcn0g5a2X56ym5Liy6ZW/5bqmXG4gKiBAZXhhbXBsZVxuICogdmFyICRzaXplT2ZVVEY4U3RyaW5nID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy9zdHIvc2l6ZU9mVVRGOFN0cmluZycpO1xuICogJHNpemVPZlVURjhTdHJpbmcoJ+S4reaWh2NjJyk7IC8vcmV0dXJuIDhcbiovXG5cbmZ1bmN0aW9uIHNpemVPZlVURjhTdHJpbmcoc3RyKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHVuZXNjYXBlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSkubGVuZ3RoXG4gICAgICA6IG5ldyBBcnJheUJ1ZmZlcihzdHIsICd1dGY4JykubGVuZ3RoXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2l6ZU9mVVRGOFN0cmluZztcbiIsIi8qKlxuICog566A5Y2V5qih5p2/5Ye95pWwXG4gKiBAbWV0aG9kIHN0ci9zdWJzdGl0dXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOimgeabv+aNouaooeadv+eahOWtl+espuS4slxuICogQHBhcmFtIHtPYmplY3R9IG9iaiDmqKHmnb/lr7nlupTnmoTmlbDmja7lr7nosaFcbiAqIEBwYXJhbSB7UmVnRXhwfSBbcmVnPS9cXFxcP1xce1xceyhbXnt9XSspXFx9XFx9L2ddIOino+aekOaooeadv+eahOato+WImeihqOi+vuW8j1xuICogQHJldHVybiB7U3RyaW5nfSDmm7/mjaLkuobmqKHmnb/nmoTlrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJHN1YnN0aXR1dGUgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3N0ci9zdWJzdGl0dXRlJyk7XG4gKiAkc3Vic3RpdHV0ZSgne3tjaXR5fX3mrKLov47mgqgnLCB7Y2l0eTon5YyX5LqsJ30pOyAvLyAn5YyX5Lqs5qyi6L+O5oKoJ1xuICovXG5cbmZ1bmN0aW9uIHN1YnN0aXR1dGUoc3RyLCBvYmosIHJlZykge1xuICByZXR1cm4gc3RyLnJlcGxhY2UocmVnIHx8ICgvXFxcXD9cXHtcXHsoW157fV0rKVxcfVxcfS9nKSwgZnVuY3Rpb24gKG1hdGNoLCBuYW1lKSB7XG4gICAgaWYgKG1hdGNoLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG4gICAgICByZXR1cm4gbWF0Y2guc2xpY2UoMSk7XG4gICAgfVxuICAgIC8vIOazqOaEj++8mm9ialtuYW1lXSAhPSBudWxsIOetieWQjOS6jiBvYmpbbmFtZV0gIT09IG51bGwgJiYgb2JqW25hbWVdICE9PSB1bmRlZmluZWRcbiAgICByZXR1cm4gKG9ialtuYW1lXSAhPSBudWxsKSA/IG9ialtuYW1lXSA6ICcnO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdWJzdGl0dXRlO1xuIiwiLyoqXG4gKiDmj5DkvpvlgJLorqHml7blmajnu5/kuIDlsIHoo4VcbiAqIEBtZXRob2QgdGltZS9jb3VudERvd25cbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIOmAiemhuVxuICogQHBhcmFtIHtEYXRlfSBbc3BlYy5iYXNlXSDnn6vmraPml7bpl7TvvIzlpoLmnpzpnIDopoHnlKjmnI3liqHnq6/ml7bpl7Tnn6vmraPlgJLorqHml7bvvIzkvb/nlKjmraTlj4LmlbBcbiAqIEBwYXJhbSB7RGF0ZX0gW3NwZWMudGFyZ2V0PURhdGUubm93KCkgKyAzMDAwXSDnm67moIfml7bpl7RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlYy5pbnRlcnZhbD0xMDAwXSDlgJLorqHml7bop6blj5Hpl7TpmpRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzcGVjLm9uQ2hhbmdlXSDlgJLorqHml7bop6blj5Hlj5jmm7TnmoTkuovku7blm57osINcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzcGVjLm9uU3RvcF0g5YCS6K6h5pe257uT5p2f55qE5Zue6LCDXG4gKiBAcmV0dXJucyB7T2JqZWN0fSDlgJLorqHml7blr7nosaHlrp7kvotcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGNvdW50RG93biA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdGltZS9jb3VudERvd24nKTtcbiAqIHZhciB0YXJnZXQgPSBEYXRlLm5vdygpICsgNTAwMDtcbiAqIHZhciBjZDEgPSAkY291bnREb3duKHtcbiAqICAgdGFyZ2V0IDogdGFyZ2V0LFxuICogICBvbkNoYW5nZSA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMSBjaGFuZ2UnLCBkZWx0YSk7XG4gKiAgIH0sXG4gKiAgIG9uU3RvcCA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMSBzdG9wJywgZGVsdGEpO1xuICogICB9XG4gKiB9KTtcbiAqIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAqICAgLy90cmlnZ2VyIHN0b3BcbiAqICAgY2QxLnN0b3AoKTtcbiAqIH0sIDIwMDApO1xuICogdmFyIGNkMiA9IGNvdW50RG93bih7XG4gKiAgIHRhcmdldCA6IHRhcmdldCxcbiAqICAgaW50ZXJ2YWwgOiAyMDAwLFxuICogICBvbkNoYW5nZSA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMiBjaGFuZ2UnLCBkZWx0YSk7XG4gKiAgIH0sXG4gKiAgIG9uU3RvcCA6IGZ1bmN0aW9uKGRlbHRhKXtcbiAqICAgICBjb25zb2xlLmluZm8oJ2NkMiBzdG9wJywgZGVsdGEpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuXG52YXIgJGVyYXNlID0gcmVxdWlyZSgnLi4vYXJyL2VyYXNlJyk7XG52YXIgJGFzc2lnbiA9IHJlcXVpcmUoJy4uL29iai9hc3NpZ24nKTtcblxudmFyIGFsbE1vbml0b3JzID0ge307XG52YXIgbG9jYWxCYXNlVGltZSA9IERhdGUubm93KCk7XG5cbmZ1bmN0aW9uIGNvdW50RG93bihzcGVjKSB7XG4gIHZhciB0aGF0ID0ge307XG5cbiAgLy8g5Li65LuA5LmI5LiN5L2/55SoIHRpbWVMZWZ0IOWPguaVsOabv+aNoiBiYXNlIOWSjCB0YXJnZXQ6XG4gIC8vIOWmguaenOeUqCB0aW1lTGVmdCDkvZzkuLrlj4LmlbDvvIzorqHml7blmajliJ3lp4vljJbkuYvliY3lpoLmnpzmnInov5vnqIvpmLvloZ7vvIzmnInlj6/og73kvJrlr7zoh7TkuI7nm67moIfml7bpl7TkuqfnlJ/or6/lt65cbiAgLy8g6aG16Z2i5aSa5Liq5a6a5pe25Zmo5LiA6LW35Yid5aeL5YyW5pe277yM5Lya5Ye6546w6K6h5pe25Zmo5pu05paw5LiN5ZCM5q2l55qE546w6LGh77yM5ZCM5pe25byV5Y+R6aG16Z2i5aSa5aSE5rKh5pyJ5LiA6LW35Zue5rWBXG4gIC8vIOS/neeVmeebruWJjei/meS4quaWueahiO+8jOeUqOS6jumcgOimgeeyvuehruWAkuiuoeaXtueahOaDheWGtVxuICB2YXIgY29uZiA9ICRhc3NpZ24oe1xuICAgIGJhc2U6IG51bGwsXG4gICAgdGFyZ2V0OiBEYXRlLm5vdygpICsgMzAwMCxcbiAgICBpbnRlcnZhbDogMTAwMCxcbiAgICBvbkNoYW5nZTogbnVsbCxcbiAgICBvblN0b3A6IG51bGwsXG4gIH0sIHNwZWMpO1xuXG4gIHZhciB0aW1lRGlmZiA9IDA7XG4gIHZhciB0YXJnZXQgPSArbmV3IERhdGUoY29uZi50YXJnZXQpO1xuICB2YXIgaW50ZXJ2YWwgPSBwYXJzZUludChjb25mLmludGVydmFsLCAxMCkgfHwgMDtcbiAgdmFyIG9uQ2hhbmdlID0gY29uZi5vbkNoYW5nZTtcbiAgdmFyIG9uU3RvcCA9IGNvbmYub25TdG9wO1xuXG4gIC8vIOS9v+WAkuiuoeaXtuinpuWPkeaXtumXtOeyvuehruWMllxuICAvLyDkvb/nlKjlm7rlrprnmoTop6blj5HpopHnjofvvIzlh4/lsJHpnIDopoHliJvlu7rnmoTlrprml7blmahcbiAgdmFyIHRpbWVJbnRlcnZhbCA9IGludGVydmFsO1xuICBpZiAodGltZUludGVydmFsIDwgNTAwKSB7XG4gICAgdGltZUludGVydmFsID0gMTA7XG4gIH0gZWxzZSBpZiAodGltZUludGVydmFsIDwgNTAwMCkge1xuICAgIHRpbWVJbnRlcnZhbCA9IDEwMDtcbiAgfSBlbHNlIHtcbiAgICB0aW1lSW50ZXJ2YWwgPSAxMDAwO1xuICB9XG5cbiAgdmFyIGRlbHRhO1xuICB2YXIgY3VyVW5pdDtcblxuICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKG5vdykge1xuICAgIGRlbHRhID0gdGFyZ2V0IC0gbm93O1xuICAgIHZhciB1bml0ID0gTWF0aC5jZWlsKGRlbHRhIC8gaW50ZXJ2YWwpO1xuICAgIGlmICh1bml0ICE9PSBjdXJVbml0KSB7XG4gICAgICBjdXJVbml0ID0gdW5pdDtcbiAgICAgIGlmICh0eXBlb2Ygb25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb25DaGFuZ2UoZGVsdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICog6YeN6K6+55uu5qCH5pe26Ze0XG4gICAqIEBtZXRob2QgY291bnREb3duI3NldFRhcmdldFxuICAgKiBAbWVtYmVyb2YgdGltZS9jb3VudERvd25cbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNkID0gY291bnREb3duKCk7XG4gICAqIHZhciBsb2NhbFRpbWUgPSAnMjAxOS8wMS8wMSc7XG4gICAqIGNkLnNldFRhcmdldChzZXJ2ZXJUaW1lKTtcbiAgICovXG4gIHRoYXQuc2V0VGFyZ2V0ID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICB0YXJnZXQgPSArbmV3IERhdGUodGltZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIOe6oOato+aXtumXtOW3rlxuICAgKiBAbWV0aG9kIGNvdW50RG93biNjb3JyZWN0XG4gICAqIEBtZW1iZXJvZiB0aW1lL2NvdW50RG93blxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcbiAgICogdmFyIHNlcnZlclRpbWUgPSAnMjAxOS8wMS8wMSc7XG4gICAqIHZhciBsb2NhbFRpbWUgPSAnMjAyMC8wMS8wMSc7XG4gICAqIGNkLmNvcnJlY3Qoc2VydmVyVGltZSk7XG4gICAqIGNkLmNvcnJlY3Qoc2VydmVyVGltZSwgbG9jYWxUaW1lKTtcbiAgICovXG4gIHRoYXQuY29ycmVjdCA9IGZ1bmN0aW9uIChzZXJ2ZXJUaW1lLCBsb2NhbFRpbWUpIHtcbiAgICB2YXIgbm93ID0gbG9jYWxUaW1lID8gbmV3IERhdGUobG9jYWxUaW1lKSA6ICtuZXcgRGF0ZSgpO1xuICAgIHZhciBzZXJ2ZXJEYXRlID0gc2VydmVyVGltZSA/IG5ldyBEYXRlKHNlcnZlclRpbWUpIDogMDtcbiAgICBpZiAoc2VydmVyRGF0ZSkge1xuICAgICAgdGltZURpZmYgPSBzZXJ2ZXJEYXRlIC0gbm93O1xuICAgIH1cbiAgfTtcblxuICBpZiAoY29uZi5iYXNlKSB7XG4gICAgdGhhdC5jb3JyZWN0KGNvbmYuYmFzZSk7XG4gIH1cblxuICB2YXIgY2hlY2sgPSBmdW5jdGlvbiAobG9jYWxEZWx0YSkge1xuICAgIHZhciBub3cgPSBsb2NhbEJhc2VUaW1lICsgdGltZURpZmYgKyBsb2NhbERlbHRhO1xuICAgIHVwZGF0ZShub3cpO1xuICAgIGlmIChkZWx0YSA8PSAwKSB7XG4gICAgICB0aGF0LnN0b3Aobm93KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIOWBnOatouWAkuiuoeaXtlxuICAgKiBAbWV0aG9kIGNvdW50RG93biNzdG9wXG4gICAqIEBtZW1iZXJvZiB0aW1lL2NvdW50RG93blxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcbiAgICogY2Quc3RvcCgpO1xuICAgKi9cbiAgdGhhdC5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2JqID0gYWxsTW9uaXRvcnNbdGltZUludGVydmFsXTtcbiAgICBpZiAobW9iaiAmJiBtb2JqLnF1ZXVlKSB7XG4gICAgICAkZXJhc2UobW9iai5xdWV1ZSwgY2hlY2spO1xuICAgIH1cbiAgICAvLyBvblN0b3Dkuovku7bop6blj5Hlv4XpobvlnKjku47pmJ/liJfnp7vpmaTlm57osIPkuYvlkI5cbiAgICAvLyDlkKbliJnlvqrnjq/mjqXmm7/nmoTlrprml7blmajkvJrlvJXlj5Hmrbvlvqrnjq9cbiAgICBpZiAodHlwZW9mIG9uU3RvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb25TdG9wKGRlbHRhKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIOmUgOavgeWAkuiuoeaXtlxuICAgKiBAbWV0aG9kIGNvdW50RG93biNkZXN0cm95XG4gICAqIEBtZW1iZXJvZiB0aW1lL2NvdW50RG93blxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgY2QgPSBjb3VudERvd24oKTtcbiAgICogY2QuZGVzdHJveSgpO1xuICAgKi9cbiAgdGhhdC5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIG9uQ2hhbmdlID0gbnVsbDtcbiAgICBvblN0b3AgPSBudWxsO1xuICAgIHRoYXQuc3RvcCgpO1xuICB9O1xuXG4gIHZhciBtb25pdG9yID0gYWxsTW9uaXRvcnNbdGltZUludGVydmFsXTtcblxuICBpZiAoIW1vbml0b3IpIHtcbiAgICBtb25pdG9yID0ge307XG4gICAgbW9uaXRvci5xdWV1ZSA9IFtdO1xuICAgIG1vbml0b3IuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgdmFyIG1vYmogPSBhbGxNb25pdG9yc1t0aW1lSW50ZXJ2YWxdO1xuICAgICAgdmFyIGxvY2FsRGVsdGEgPSBub3cgLSBsb2NhbEJhc2VUaW1lO1xuICAgICAgaWYgKG1vYmoucXVldWUubGVuZ3RoKSB7XG4gICAgICAgIC8vIOW+queOr+W9k+S4reS8muWIoOmZpOaVsOe7hOWFg+e0oO+8jOWboOatpOmcgOimgeWFiOWkjeWItuS4gOS4i+aVsOe7hFxuICAgICAgICBtb2JqLnF1ZXVlLnNsaWNlKDApLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgZm4obG9jYWxEZWx0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb2JqLnRpbWVyKTtcbiAgICAgICAgYWxsTW9uaXRvcnNbdGltZUludGVydmFsXSA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSBtb2JqLnRpbWVyO1xuICAgICAgfVxuICAgIH07XG4gICAgYWxsTW9uaXRvcnNbdGltZUludGVydmFsXSA9IG1vbml0b3I7XG4gIH1cblxuICBtb25pdG9yLnF1ZXVlLnB1c2goY2hlY2spO1xuXG4gIGlmICghbW9uaXRvci50aW1lcikge1xuICAgIG1vbml0b3IudGltZXIgPSBzZXRJbnRlcnZhbChtb25pdG9yLmluc3BlY3QsIHRpbWVJbnRlcnZhbCk7XG4gIH1cblxuICBtb25pdG9yLmluc3BlY3QoKTtcblxuICByZXR1cm4gdGhhdDtcbn1cblxuY291bnREb3duLmFsbE1vbml0b3JzID0gYWxsTW9uaXRvcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGNvdW50RG93bjtcbiIsIi8qKlxuICog5pe26Ze05aSE55CG5LiO5Lqk5LqS5bel5YW3XG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy90aW1lXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy90aW1lXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQudGltZS5wYXJzZVVuaXQpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpSBAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3RpbWVcbiAqIHZhciAkdGltZSA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdGltZScpO1xuICogY29uc29sZS5pbmZvKCR0aW1lLnBhcnNlVW5pdCk7XG4gKlxuICogLy8g5Y2V54us5byV5YWl5LiA5Liq5pa55rOVXG4gKiB2YXIgJHBhcnNlVW5pdCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdGltZS9wYXJzZVVuaXQnKTtcbiAqL1xuXG5leHBvcnRzLmNvdW50RG93biA9IHJlcXVpcmUoJy4vY291bnREb3duJyk7XG5leHBvcnRzLnBhcnNlVW5pdCA9IHJlcXVpcmUoJy4vcGFyc2VVbml0Jyk7XG4iLCIvKipcbiAqIOaXtumXtOaVsOWtl+aLhuWIhuS4uuWkqeaXtuWIhuenklxuICogQG1ldGhvZCB0aW1lL3BhcnNlVW5pdFxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUg5q+r56eS5pWwXG4gKiBAcGFyYW0ge09iamVjdH0gc3BlYyDpgInpoblcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3BlYy5tYXhVbml0PSdkYXknXSDmi4bliIbml7bpl7TnmoTmnIDlpKfljZXkvY3vvIzlj6/pgIkgWydkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJ11cbiAqIEByZXR1cm5zIHtPYmplY3R9IOaLhuWIhuWujOaIkOeahOWkqeaXtuWIhuenklxuICogQGV4YW1wbGVcbiAqIHZhciAkcGFyc2VVbml0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy90aW1lL3BhcnNlVW5pdCcpO1xuICogY29uc29sZS5pbmZvKCAkcGFyc2VVbml0KDEyMzQ1ICogNjc4OTApICk7XG4gKiAvLyBPYmplY3Qge2RheTogOSwgaG91cjogMTYsIG1pbnV0ZTogNDgsIHNlY29uZDogMjIsIG1zOiA1MH1cbiAqIGNvbnNvbGUuaW5mbyggJHBhcnNlVW5pdCgxMjM0NSAqIDY3ODkwLCB7bWF4VW5pdCA6ICdob3VyJ30pICk7XG4gKiAvLyBPYmplY3Qge2hvdXI6IDIzMiwgbWludXRlOiA0OCwgc2Vjb25kOiAyMiwgbXM6IDUwfVxuICovXG5cbnZhciAkbnVtZXJpY2FsID0gcmVxdWlyZSgnLi4vbnVtL251bWVyaWNhbCcpO1xudmFyICRhc3NpZ24gPSByZXF1aXJlKCcuLi9vYmovYXNzaWduJyk7XG5cbnZhciBVTklUID0ge1xuICBkYXk6IDI0ICogNjAgKiA2MCAqIDEwMDAsXG4gIGhvdXI6IDYwICogNjAgKiAxMDAwLFxuICBtaW51dGU6IDYwICogMTAwMCxcbiAgc2Vjb25kOiAxMDAwLFxufTtcblxuZnVuY3Rpb24gcGFyc2VVbml0KHRpbWUsIHNwZWMpIHtcbiAgdmFyIGNvbmYgPSAkYXNzaWduKHtcbiAgICBtYXhVbml0OiAnZGF5JyxcbiAgfSwgc3BlYyk7XG5cbiAgdmFyIGRhdGEgPSB7fTtcbiAgdmFyIG1heFVuaXQgPSAkbnVtZXJpY2FsKFVOSVRbY29uZi5tYXhVbml0XSk7XG4gIHZhciB1RGF5ID0gVU5JVC5kYXk7XG4gIHZhciB1SG91ciA9IFVOSVQuaG91cjtcbiAgdmFyIHVNaW51dGUgPSBVTklULm1pbnV0ZTtcbiAgdmFyIHVTZWNvbmQgPSBVTklULnNlY29uZDtcblxuICBpZiAobWF4VW5pdCA+PSB1RGF5KSB7XG4gICAgdGltZSA9ICRudW1lcmljYWwodGltZSk7XG4gICAgZGF0YS5kYXkgPSBNYXRoLmZsb29yKHRpbWUgLyB1RGF5KTtcbiAgfVxuXG4gIGlmIChtYXhVbml0ID49IHVIb3VyKSB7XG4gICAgdGltZSAtPSAkbnVtZXJpY2FsKGRhdGEuZGF5ICogdURheSk7XG4gICAgZGF0YS5ob3VyID0gTWF0aC5mbG9vcih0aW1lIC8gdUhvdXIpO1xuICB9XG5cbiAgaWYgKG1heFVuaXQgPj0gdU1pbnV0ZSkge1xuICAgIHRpbWUgLT0gJG51bWVyaWNhbChkYXRhLmhvdXIgKiB1SG91cik7XG4gICAgZGF0YS5taW51dGUgPSBNYXRoLmZsb29yKHRpbWUgLyB1TWludXRlKTtcbiAgfVxuXG4gIGlmIChtYXhVbml0ID49IHVTZWNvbmQpIHtcbiAgICB0aW1lIC09ICRudW1lcmljYWwoZGF0YS5taW51dGUgKiB1TWludXRlKTtcbiAgICBkYXRhLnNlY29uZCA9IE1hdGguZmxvb3IodGltZSAvIHVTZWNvbmQpO1xuICB9XG5cbiAgZGF0YS5tcyA9IHRpbWUgLSBkYXRhLnNlY29uZCAqIHVTZWNvbmQ7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VVbml0O1xuIiwiLyoqXG4gKiBBcnJheUJ1ZmZlcui9rDE26L+b5Yi25a2X56ym5LiyXG4gKiBAbWV0aG9kIHV0aWwvYWJUb0hleFxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYnVmZmVyIOmcgOimgei9rOaNoueahCBBcnJheUJ1ZmZlclxuICogQHJldHVybnMge1N0cmluZ30gMTbov5vliLblrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGFiVG9IZXggPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvYWJUb0hleCcpO1xuICogdmFyIGFiID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICogdmFyIGR2ID0gbmV3IERhdGFWaWV3KGFiKTtcbiAqIGR2LnNldFVpbnQ4KDAsIDE3MSk7XG4gKiBkdi5zZXRVaW50OCgxLCAyMDUpO1xuICogJGFiVG9IZXgoYWIpOyAvLyA9PiAnYWJjZCdcbiAqL1xuXG5mdW5jdGlvbiBhYlRvSGV4KGJ1ZmZlcikge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJ1ZmZlcikgIT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXScpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgdmFyIHU4YXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgdmFyIGZuID0gZnVuY3Rpb24gKGJpdCkge1xuICAgIHJldHVybiAoJzAwJyArIGJpdC50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgfTtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh1OGFyciwgZm4pLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFiVG9IZXg7XG4iLCIvKipcbiAqIEFTQ0lJ5a2X56ym5Liy6L2sMTbov5vliLblrZfnrKbkuLJcbiAqIEBtZXRob2QgdXRpbC9hc2NUb0hleFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciDpnIDopoHovazmjaLnmoRBU0NJSeWtl+espuS4slxuICogQHJldHVybnMge1N0cmluZ30gMTbov5vliLblrZfnrKbkuLJcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGFzY1RvSGV4ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL2FzY1RvSGV4Jyk7XG4gKiAkYXNjVG9IZXgoKTsgLy8gPT4gJydcbiAqICRhc2NUb0hleCgnKisnKTsgLy8gPT4gJzJhMmInXG4gKi9cblxuZnVuY3Rpb24gYXNjVG9IZXgoc3RyKSB7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHZhciBoZXggPSAnJztcbiAgdmFyIGluZGV4O1xuICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCArPSAxKSB7XG4gICAgdmFyIGludCA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICB2YXIgY29kZSA9IChpbnQpLnRvU3RyaW5nKDE2KTtcbiAgICBoZXggKz0gY29kZTtcbiAgfVxuICByZXR1cm4gaGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzY1RvSGV4O1xuIiwiLyoqXG4gKiDmr5TovoPniYjmnKzlj7dcbiAqIEBtZXRob2QgdXRpbC9jb21wYXJlVmVyc2lvblxuICogQHBhcmFtIHtTdHJpbmd9IHYxIOeJiOacrOWPtzFcbiAqIEBwYXJhbSB7U3RyaW5nfSB2MiDniYjmnKzlj7cyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBpbmZvIOeJiOacrOWPt+avlOi+g+S/oeaBr1xuICogQHJldHVybnMge09iamVjdH0gaW5mby5sZXZlbCDniYjmnKzlj7flt67lvILmiYDlnKjnuqfliKtcbiAqIEByZXR1cm5zIHtPYmplY3R9IGluZm8uZGVsdGEg54mI5pys5Y+35beu5byC5pWw5YC8XG4gKiBAZXhhbXBsZVxuICogdmFyICRjb21wYXJlVmVyc2lvbiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbC9jb21wYXJlVmVyc2lvbicpO1xuICogLy8gZGVsdGEg5Y+W5YC85Y+v5Lul55CG6Kej5Li6IOWJjemdoueahOWAvCDlh4/ljrsg5ZCO6Z2i55qE5YC8XG4gKiB2YXIgaW5mbzEgPSAkY29tcGFyZVZlcnNpb24oJzEuMC4xJywgJzEuMi4yJyk7XG4gKiAvLyB7bGV2ZWw6IDEsIGRlbHRhOiAtMn1cbiAqIHZhciBpbmZvMiA9ICRjb21wYXJlVmVyc2lvbignMS4zLjEnLCAnMS4yLjInKTtcbiAqIC8vIHtsZXZlbDogMSwgZGVsdGE6IDF9XG4gKi9cblxuZnVuY3Rpb24gY29tcGFyZVZlcnNpb24odjEsIHYyKSB7XG4gIHZhciBhcnJWMSA9IHYxLnNwbGl0KCcuJyk7XG4gIHZhciBhcnJWMiA9IHYyLnNwbGl0KCcuJyk7XG4gIHZhciBtYXhMZW5ndGggPSBNYXRoLm1heChhcnJWMS5sZW5ndGgsIGFyclYyLmxlbmd0aCk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBkZWx0YSA9IDA7XG5cbiAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbWF4TGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdmFyIHB2MSA9IHBhcnNlSW50KGFyclYxW2luZGV4XSwgMTApIHx8IDA7XG4gICAgdmFyIHB2MiA9IHBhcnNlSW50KGFyclYyW2luZGV4XSwgMTApIHx8IDA7XG4gICAgZGVsdGEgPSBwdjEgLSBwdjI7XG4gICAgaWYgKGRlbHRhICE9PSAwKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIXYxICYmICF2Mikge1xuICAgIGluZGV4ID0gMDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGV2ZWw6IGluZGV4LFxuICAgIGRlbHRhOiBkZWx0YSxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wYXJlVmVyc2lvbjtcbiIsIi8qKlxuICogMTbov5vliLblrZfnrKbkuLLovaxBcnJheUJ1ZmZlclxuICogQG1ldGhvZCB1dGlsL2hleFRvQWJcbiAqIEBzZWUgaHR0cHM6Ly9jYW5pdXNlLmNvbS8jc2VhcmNoPUFycmF5QnVmZmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmcgOimgei9rOaNoueahDE26L+b5Yi25a2X56ym5LiyXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IOiiq+i9rOaNouWQjueahCBBcnJheUJ1ZmZlciDlr7nosaFcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGhleFRvQWIgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9BYicpO1xuICogdmFyIGFiID0gJGhleFRvQWIoKTtcbiAqIGFiLmJ5dGVMZW5ndGg7IC8vID0+IDBcbiAqIGFiID0gJGhleFRvQWIoJ2FiY2QnKTtcbiAqIHZhciBkdiA9IG5ldyBEYXRhVmlldyhhYik7XG4gKiBhYi5ieXRlTGVuZ3RoOyAvLyA9PiAyXG4gKiBkdi5nZXRVaW50OCgwKTsgLy8gPT4gMTcxXG4gKiBkdi5nZXRVaW50OCgxKTsgLy8gPT4gMjA1XG4gKi9cblxuZnVuY3Rpb24gaGV4VG9BYihzdHIpIHtcbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5QnVmZmVyKDApO1xuICB9XG4gIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoTWF0aC5jZWlsKHN0ci5sZW5ndGggLyAyKSk7XG4gIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgaTtcbiAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjb2RlID0gcGFyc2VJbnQoc3RyLnN1YnN0cihpLCAyKSwgMTYpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQ4KGluZGV4LCBjb2RlKTtcbiAgICBpbmRleCArPSAxO1xuICB9XG4gIHJldHVybiBidWZmZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGV4VG9BYjtcbiIsIi8qKlxuICogMTbov5vliLblrZfnrKbkuLLovaxBU0NJSeWtl+espuS4slxuICogQG1ldGhvZCB1dGlsL2hleFRvQXNjXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIOmcgOimgei9rOaNoueahDE26L+b5Yi25a2X56ym5LiyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBBU0NJSeWtl+espuS4slxuICogQGV4YW1wbGVcbiAqIHZhciAkaGV4VG9Bc2MgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvaGV4VG9Bc2MnKTtcbiAqICRoZXhUb0FzYygpOyAvLyA9PiAnJ1xuICogJGhleFRvQXNjKCcyYTJiJyk7IC8vID0+ICcqKydcbiAqL1xuXG5mdW5jdGlvbiBoZXhUb0FzYyhoZXgpIHtcbiAgaWYgKCFoZXgpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIGhleC5yZXBsYWNlKC9bXFxkYS1mXXsyfS9naSwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgdmFyIGludCA9IHBhcnNlSW50KG1hdGNoLCAxNik7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoaW50KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGV4VG9Bc2M7XG4iLCIvKipcbiAqIEhTTOminOiJsuWAvOi9rOaNouS4ulJHQlxuICogLSDmjaLnrpflhazlvI/mlLnnvJboh6ogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfY29sb3Jfc3BhY2UuXG4gKiAtIGgsIHMsIOWSjCBsIOiuvuWumuWcqCBbMCwgMV0g5LmL6Ze0XG4gKiAtIOi/lOWbnueahCByLCBnLCDlkowgYiDlnKggWzAsIDI1NV3kuYvpl7RcbiAqIEBtZXRob2QgdXRpbC9oc2xUb1JnYlxuICogQHBhcmFtIHtOdW1iZXJ9IGgg6Imy55u4XG4gKiBAcGFyYW0ge051bWJlcn0gcyDppbHlkozluqZcbiAqIEBwYXJhbSB7TnVtYmVyfSBsIOS6ruW6plxuICogQHJldHVybnMge0FycmF5fSBSR0LoibLlgLzmlbDlgLxcbiAqIEBleGFtcGxlXG4gKiB2YXIgJGhzbFRvUmdiID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsL2hzbFRvUmdiJyk7XG4gKiAkaHNsVG9SZ2IoMCwgMCwgMCk7IC8vID0+IFswLDAsMF1cbiAqICRoc2xUb1JnYigwLCAwLCAxKTsgLy8gPT4gWzI1NSwyNTUsMjU1XVxuICogJGhzbFRvUmdiKDAuNTU1NTU1NTU1NTU1NTU1NSwgMC45Mzc0OTk5OTk5OTk5OTk5LCAwLjY4NjI3NDUwOTgwMzkyMTYpOyAvLyA9PiBbMTAwLDIwMCwyNTBdXG4gKi9cblxuZnVuY3Rpb24gaHVlVG9SZ2IocCwgcSwgdCkge1xuICBpZiAodCA8IDApIHQgKz0gMTtcbiAgaWYgKHQgPiAxKSB0IC09IDE7XG4gIGlmICh0IDwgMSAvIDYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICBpZiAodCA8IDEgLyAyKSByZXR1cm4gcTtcbiAgaWYgKHQgPCAyIC8gMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIgLyAzIC0gdCkgKiA2O1xuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gaHNsVG9SZ2IoaCwgcywgbCkge1xuICB2YXIgcjtcbiAgdmFyIGc7XG4gIHZhciBiO1xuXG4gIGlmIChzID09PSAwKSB7XG4gICAgLy8gYWNocm9tYXRpY1xuICAgIHIgPSBsO1xuICAgIGcgPSBsO1xuICAgIGIgPSBsO1xuICB9IGVsc2Uge1xuICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcbiAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICByID0gaHVlVG9SZ2IocCwgcSwgaCArIDEgLyAzKTtcbiAgICBnID0gaHVlVG9SZ2IocCwgcSwgaCk7XG4gICAgYiA9IGh1ZVRvUmdiKHAsIHEsIGggLSAxIC8gMyk7XG4gIH1cbiAgcmV0dXJuIFtNYXRoLnJvdW5kKHIgKiAyNTUpLCBNYXRoLnJvdW5kKGcgKiAyNTUpLCBNYXRoLnJvdW5kKGIgKiAyNTUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoc2xUb1JnYjtcbiIsIi8qKlxuICog5YW25LuW5bel5YW35Ye95pWwXG4gKiBAbW9kdWxlIHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TcG9yZVVJL3Nwb3JlLWtpdC90cmVlL21hc3Rlci9wYWNrYWdlcy91dGlsXG4gKiBAZXhhbXBsZVxuICogLy8g57uf5LiA5byV5YWlIEBzcG9yZS11aS9raXRcbiAqIHZhciAka2l0ID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdCcpO1xuICogY29uc29sZS5pbmZvKCRraXQudXRpbC5oc2xUb1JnYik7XG4gKlxuICogLy8g5Y2V54us5byV5YWlIEBzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbFxuICogdmFyICR1dGlsID0gcmVxdWlyZSgnQHNwb3JlLXVpL2tpdC9wYWNrYWdlcy91dGlsJyk7XG4gKiBjb25zb2xlLmluZm8oJHV0aWwuaHNsVG9SZ2IpO1xuICpcbiAqIC8vIOWNleeLrOW8leWFpeS4gOS4quaWueazlVxuICogdmFyICRoc2xUb1JnYiA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbC9oc2xUb1JnYicpO1xuICovXG5cbmV4cG9ydHMuYWJUb0hleCA9IHJlcXVpcmUoJy4vYWJUb0hleCcpO1xuZXhwb3J0cy5hc2NUb0hleCA9IHJlcXVpcmUoJy4vYXNjVG9IZXgnKTtcbmV4cG9ydHMuY29tcGFyZVZlcnNpb24gPSByZXF1aXJlKCcuL2NvbXBhcmVWZXJzaW9uJyk7XG5leHBvcnRzLmhleFRvQWIgPSByZXF1aXJlKCcuL2hleFRvQWInKTtcbmV4cG9ydHMuaGV4VG9Bc2MgPSByZXF1aXJlKCcuL2hleFRvQXNjJyk7XG5leHBvcnRzLmhzbFRvUmdiID0gcmVxdWlyZSgnLi9oc2xUb1JnYicpO1xuZXhwb3J0cy5qb2IgPSByZXF1aXJlKCcuL2pvYicpO1xuZXhwb3J0cy5tZWFzdXJlRGlzdGFuY2UgPSByZXF1aXJlKCcuL21lYXN1cmVEaXN0YW5jZScpO1xuZXhwb3J0cy5wYXJzZVJHQiA9IHJlcXVpcmUoJy4vcGFyc2VSR0InKTtcbmV4cG9ydHMucmdiVG9Ic2wgPSByZXF1aXJlKCcuL3JnYlRvSHNsJyk7XG4iLCIvKipcbiAqIOS7u+WKoeWIhuaXtuaJp+ihjFxuICogLSDkuIDmlrnpnaLpgb/lhY3ljZXmrKFyZWZsb3fmtYHnqIvmiafooYzlpKrlpJpqc+S7u+WKoeWvvOiHtOa1j+iniOWZqOWNoeatu1xuICogLSDlj6bkuIDmlrnpnaLljZXkuKrku7vliqHnmoTmiqXplJnkuI3kvJrlvbHlk43lkI7nu63ku7vliqHnmoTmiafooYxcbiAqIEBtZXRob2QgdXRpbC9qb2JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIOS7u+WKoeWHveaVsFxuICogQHJldHVybnMge09iamVjdH0g5Lu75Yqh6Zif5YiX5a+56LGhXG4gKiBAZXhhbXBsZVxuICogdmFyICRqb2IgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvam9iJyk7XG4gKiAkam9iKGZ1bmN0aW9uKCkge1xuICogICAvL3Rhc2sxIHN0YXJ0XG4gKiB9KTtcbiAqICRqb2IoZnVuY3Rpb24oKSB7XG4gKiAgIC8vdGFzazIgc3RhcnRcbiAqIH0pO1xuICovXG5cbnZhciBtYW5hZ2VyID0ge307XG5cbm1hbmFnZXIucXVldWUgPSBbXTtcblxubWFuYWdlci5hZGQgPSBmdW5jdGlvbiAoZm4sIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG1hbmFnZXIucXVldWUucHVzaCh7XG4gICAgZm46IGZuLFxuICAgIGNvbmY6IG9wdGlvbnMsXG4gIH0pO1xuICBtYW5hZ2VyLnN0ZXAoKTtcbn07XG5cbm1hbmFnZXIuc3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFtYW5hZ2VyLnF1ZXVlLmxlbmd0aCB8fCBtYW5hZ2VyLnRpbWVyKSB7IHJldHVybjsgfVxuICBtYW5hZ2VyLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW0gPSBtYW5hZ2VyLnF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtLmZuICYmIHR5cGVvZiBpdGVtLmZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGl0ZW0uZm4uY2FsbChudWxsKTtcbiAgICAgIH1cbiAgICAgIG1hbmFnZXIudGltZXIgPSBudWxsO1xuICAgICAgbWFuYWdlci5zdGVwKCk7XG4gICAgfVxuICB9LCAxKTtcbn07XG5cbmZ1bmN0aW9uIGpvYihmbiwgb3B0aW9ucykge1xuICBtYW5hZ2VyLmFkZChmbiwgb3B0aW9ucyk7XG4gIHJldHVybiBtYW5hZ2VyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGpvYjtcbiIsIi8qKlxuICog5rWL6YeP5Zyw55CG5Z2Q5qCH55qE6Led56a7XG4gKiBAbWV0aG9kIHV0aWwvbWVhc3VyZURpc3RhbmNlXG4gKiBAcGFyYW0ge051bWJlcn0gbGF0MSDlnZDmoIcx57K+5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbG5nMSDlnZDmoIcx57qs5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbGF0MiDlnZDmoIcy57K+5bqmXG4gKiBAcGFyYW0ge051bWJlcn0gbG5nMiDlnZDmoIcy57qs5bqmXG4gKiBAcmV0dXJucyB7TnVtYmVyfSAy5Liq5Z2Q5qCH5LmL6Ze055qE6Led56a777yI5Y2D57Gz77yJXG4gKiBAZXhhbXBsZVxuICogdmFyICRtZWFzdXJlRGlzdGFuY2UgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvbWVhc3VyZURpc3RhbmNlJyk7XG4gKiB2YXIgZGlzdGFuY2UgPSAkbWVhc3VyZURpc3RhbmNlKDAsIDAsIDEwMCwgMTAwKTtcbiAqIC8vIDk4MjYuNDAwNjUxMDk5NzhcbiAqL1xuXG5mdW5jdGlvbiBtZWFzdXJlRGlzdGFuY2UobGF0MSwgbG5nMSwgbGF0MiwgbG5nMikge1xuICB2YXIgcmFkTGF0MSA9IChsYXQxICogTWF0aC5QSSkgLyAxODAuMDtcbiAgdmFyIHJhZExhdDIgPSAobGF0MiAqIE1hdGguUEkpIC8gMTgwLjA7XG4gIHZhciBhID0gcmFkTGF0MSAtIHJhZExhdDI7XG4gIHZhciBiID0gKGxuZzEgKiBNYXRoLlBJKSAvIDE4MC4wIC0gKGxuZzIgKiBNYXRoLlBJKSAvIDE4MC4wO1xuICB2YXIgcG93VmFsID0gTWF0aC5wb3coTWF0aC5zaW4oYSAvIDIpLCAyKTtcbiAgdmFyIGNjcFZhbCA9IE1hdGguY29zKHJhZExhdDEpICogTWF0aC5jb3MocmFkTGF0MikgKiBNYXRoLnBvdyhNYXRoLnNpbihiIC8gMiksIDIpO1xuICB2YXIgc3FydFZhbCA9IE1hdGguc3FydChwb3dWYWwgKyBjY3BWYWwpO1xuICB2YXIgcyA9IDIgKiBNYXRoLmFzaW4oc3FydFZhbCk7XG4gIC8vIOWcsOeQg+WNiuW+hFxuICBzICo9IDYzNzguMTM3O1xuICByZXR1cm4gcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZWFzdXJlRGlzdGFuY2U7XG4iLCIvKipcbiAqIHJnYuWtl+espuS4suino+aekFxuICogLSDmjaLnrpflhazlvI/mlLnnvJboh6ogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfY29sb3Jfc3BhY2UuXG4gKiAtIGgsIHMsIOWSjCBsIOiuvuWumuWcqCBbMCwgMV0g5LmL6Ze0XG4gKiAtIOi/lOWbnueahCByLCBnLCDlkowgYiDlnKggWzAsIDI1NV3kuYvpl7RcbiAqIEBtZXRob2QgdXRpbC9wYXJzZVJHQlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIDE26L+b5Yi26Imy5YC8XG4gKiBAcmV0dXJucyB7QXJyYXl9IFJHQuiJsuWAvOaVsOWAvFxuICogQGV4YW1wbGVcbiAqIHZhciAkcGFyc2VSR0IgPSByZXF1aXJlKCdAc3BvcmUtdWkva2l0L3BhY2thZ2VzL3V0aWwvcGFyc2VSR0InKTtcbiAqICRwYXJzZVJHQignI2ZmZmZmZicpOyAvLyA9PiBbMjU1LDI1NSwyNTVdXG4gKiAkcGFyc2VSR0IoJyNmZmYnKTsgLy8gPT4gWzI1NSwyNTUsMjU1XVxuICovXG5cbmNvbnN0IFJFR19IRVggPSAvKF4jP1swLTlBLUZdezZ9JCl8KF4jP1swLTlBLUZdezN9JCkvaTtcblxuZnVuY3Rpb24gcGFyc2VSR0IoY29sb3IpIHtcbiAgdmFyIHN0ciA9IGNvbG9yO1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIHNob3VsZCBiZSBzdHJpbmcnKTtcbiAgfVxuICBpZiAoIVJFR19IRVgudGVzdChzdHIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdXcm9uZyBSR0IgY29sb3IgZm9ybWF0Jyk7XG4gIH1cblxuICBzdHIgPSBzdHIucmVwbGFjZSgnIycsICcnKTtcbiAgdmFyIGFycjtcbiAgaWYgKHN0ci5sZW5ndGggPT09IDMpIHtcbiAgICBhcnIgPSBzdHIuc3BsaXQoJycpLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgKyBjO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGFyciA9IHN0ci5tYXRjaCgvW2EtZkEtRjAtOV17Mn0vZyk7XG4gIH1cbiAgYXJyLmxlbmd0aCA9IDM7XG4gIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGMsIDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VSR0I7XG4iLCIvKipcbiAqIFJHQiDpopzoibLlgLzovazmjaLkuLogSFNMLlxuICogLSDovazmjaLlhazlvI/lj4LogIPoh6ogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfY29sb3Jfc3BhY2UuXG4gKiAtIHIsIGcsIOWSjCBiIOmcgOimgeWcqCBbMCwgMjU1XSDojIPlm7TlhoVcbiAqIC0g6L+U5Zue55qEIGgsIHMsIOWSjCBsIOWcqCBbMCwgMV0g5LmL6Ze0XG4gKiBAbWV0aG9kIHV0aWwvcmdiVG9Ic2xcbiAqIEBwYXJhbSB7TnVtYmVyfSByIOe6ouiJsuiJsuWAvFxuICogQHBhcmFtIHtOdW1iZXJ9IGcg57u/6Imy6Imy5YC8XG4gKiBAcGFyYW0ge051bWJlcn0gYiDok53oibLoibLlgLxcbiAqIEByZXR1cm5zIHtBcnJheX0gSFNM5ZCE5YC85pWw57uEXG4gKiBAZXhhbXBsZVxuICogdmFyICRyZ2JUb0hzbCA9IHJlcXVpcmUoJ0BzcG9yZS11aS9raXQvcGFja2FnZXMvdXRpbC9yZ2JUb0hzbCcpO1xuICogJHJnYlRvSHNsKDEwMCwgMjAwLCAyNTApOyAvLyA9PiBbMC41NTU1NTU1NTU1NTU1NTU1LDAuOTM3NDk5OTk5OTk5OTk5OSwwLjY4NjI3NDUwOTgwMzkyMTZdXG4gKiAkcmdiVG9Ic2woMCwgMCwgMCk7IC8vID0+IFswLDAsMF1cbiAqICRyZ2JUb0hzbCgyNTUsIDI1NSwgMjU1KTsgLy8gPT4gWzAsMCwxXVxuICovXG5cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcbiAgciAvPSAyNTU7XG4gIGcgLz0gMjU1O1xuICBiIC89IDI1NTtcbiAgdmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICB2YXIgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gIHZhciBoO1xuICB2YXIgcztcbiAgdmFyIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cbiAgaWYgKG1heCA9PT0gbWluKSB7XG4gICAgcyA9IDA7IC8vIGFjaHJvbWF0aWNcbiAgICBoID0gcztcbiAgfSBlbHNlIHtcbiAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICBzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG4gICAgc3dpdGNoIChtYXgpIHtcbiAgICAgIGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcbiAgICAgIGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XG4gICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogYnJlYWs7XG4gICAgfVxuICAgIGggLz0gNjtcbiAgfVxuICByZXR1cm4gW2gsIHMsIGxdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJnYlRvSHNsO1xuIl19
(1)
});
