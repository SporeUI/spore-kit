/**
 * 判断事件是否发生在一个元素内
 * @example
 * 	$('.layer').on('click', function(evt){
 * 		if(occurInside(evt, $(this).find('close'))){
 * 			$(this).hide();
 * 		}
 * 	});
 */

function occurInside(event, node) {
	var $ = window.$ || window.Zepto || window.jQuery;
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
}

module.exports = occurInside;
