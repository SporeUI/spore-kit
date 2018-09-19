/**
 * 判断对象是否为dom元素
 * @param {element} node
 * @return {boolean} true/false
 */
function isNode(node) {
	return (
		node
		&& node.nodeName
		&& node.nodeType
	);
}

module.exports = isNode;
