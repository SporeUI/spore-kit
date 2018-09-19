// @see https://www.npmjs.com/package/js-cookie

const Cookie = require('js-cookie');

const instance = Cookie.withConverter({
	read: val => decodeURIComponent(val),
	write: val => encodeURIComponent(val)
});

module.exports = instance;
