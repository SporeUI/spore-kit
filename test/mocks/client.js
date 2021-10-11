const $jsdom = require('jsdom');

const dom = new $jsdom.JSDOM();
global.document = dom.window.document;
global.window = dom.window;
