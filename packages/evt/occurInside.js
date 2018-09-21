/**
 * 判断事件是否发生在一个元素内
 * @module spore-kit-evt/src/occurInside
 * @example
 * 	var $occurInside = require('spore-kit-evt/src/occurInside');
 * 	$('.layer').on('click', function(evt){
 * 		if($occurInside(evt, $(this).find('close'))){
 * 			$(this).hide();
 * 		}
 * 	});
 */

var $ = window.$ || window.Zepto || window.jQuery;

module.exports = function(event, node) {
	node = $(node);

	if (node.length && event && event.target) {
		var element = node[0];
		var pos = event.target;
		while (pos.parentNode) {
			if (pos === element) {
				return true;
			} else {
				pos = pos.parentNode;
			}
		}
	}

	return false;
};
