/**
 * 解析对象路径为一个数组
 * @method str/keyPathSplit
 * @param {String} 对象路径
 * @returns {Array} 对象路径数组
 * @example
 * var $keyPathSplit = require('@spore-ui/kit/packages/str/keyPathSplit');
 * console.info($keyPathSplit('[1].a[1][2]b.c'); // ['1', 'a', '1', '2', 'b', 'c']
 */

function keyPathSplit(xpath) {
  if (typeof xpath !== 'string') return [];
  var arrXpath = [];
  xpath.split('.').forEach(function (itemPath) {
    var strItem = itemPath.replace(/\[([^[\]]+)\]/g, '.$1');
    var itemArr = strItem.split('.');
    if (itemArr[0] === '') {
      itemArr.shift();
    }
    itemArr.forEach(function (item) {
      arrXpath.push(item);
    });
  });
  return arrXpath;
}

module.exports = keyPathSplit;
