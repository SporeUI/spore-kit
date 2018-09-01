/**
 * 封装 iframe post 模式
 */

var $ = window.$;
var hiddenDiv = null;

function getHiddenBox() {
	if (hiddenDiv === null) {
		hiddenDiv = $('<div/>').css('display', 'none');
		hiddenDiv.appendTo(document.body);
	}
	return hiddenDiv;
}

function getForm() {
	var form = $('<form style="display:none;"></form>');
	form.appendTo(getHiddenBox());
	return form;
}

function getHiddenInput(form, name) {
	var input = $(form).find('[name="' + name + '"]');
	if (!input.get(0)) {
		input = $('<input type="hidden" name="' + name + '" value=""/>');
		input.appendTo(form);
	}
	return input;
}

function getIframe(name) {
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

function iframePost(spec) {
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
		error: $.noop,
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
