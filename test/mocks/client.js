const $jsdom = require('jsdom');
const jQuery = require('jquery');

const dom = new $jsdom.JSDOM();
global.document = dom.window.document;
global.window = dom.window;

window.$ = jQuery;
global.$ = jQuery;
