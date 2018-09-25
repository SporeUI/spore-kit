/**
 * 动画运行方式库
 * @module
 * @see http://mootools.net/
 * @example:
 * 	new fx({
 * 		transition : transitions.Sine.easeInOut
 * 	});
 * 	new fx({
 * 		transition : 'Sine:In'
 * 	});
 * 	new fx({
 * 		transition : 'Sine:In:Out'
 * 	});
 */

var $ = window.$ || window.Zepto || window.jQuery;

var $fx = require('./fx');

$fx.Transition = function(transition, params) {
	if ($.type(params) !== 'array') {
		params = [params];
	}
	var easeIn = function(pos) {
		return transition(pos, params);
	};
	return $.extend(easeIn, {
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
	$.each(transitions, function(transition) {
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

$fx.implement({
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
