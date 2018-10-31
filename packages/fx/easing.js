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
 * easing.linear(0.5); // 0.5
 * easing.easeInQuad(0.5); // 0.25
 * easing.easeInCubic(0.5); // 0.125
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
