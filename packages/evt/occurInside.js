/**
 * 判断事件是否发生在一个 Dom 元素内。
 *
 * 常用于判断点击事件发生在浮层外时关闭浮层。
 * @method occurInside
 * @param {Object} event 浏览器事件对象
 * @param {Object} node 用于比较事件发生区域的 Dom 对象
 * @returns {Boolean} 事件是否发生在 node 内
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
