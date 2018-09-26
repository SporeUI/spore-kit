// @see https://www.npmjs.com/package/js-cookie

var Cookie = require('js-cookie');

var instance = Cookie.withConverter({
	read: function(val) {
		return decodeURIComponent(val);
	},
	write: function(val) {
		return encodeURIComponent(val);
	}
});

module.exports = instance;
