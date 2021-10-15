/**
 * 判断对象是否为dom元素
 * @param {Object} node 要判断的对象
 * @return {Boolean} 是否为dom元素
 * @example
 * var $isNode = require('spore-kit/packages/dom/isNode');
 * $isNode(document.body) // 1
 */
function isNode(node) {
  return (
    node
    && node.nodeName
    && node.nodeType
  );
}

module.exports = isNode;
