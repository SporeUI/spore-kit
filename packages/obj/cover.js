/**
 * 覆盖对象，不添加新的键
 * @module
 * @param {object} object 要覆盖的对象
 * @param {object} item 要覆盖的属性键值对
 * @return {object} 覆盖后的源对象
 * @example
 * var obj = {a:1,b:2};
 * console.info(cover(obj,{b:3,c:4}));	//{a:1,b:3}
 */

function cover() {
	var args = Array.prototype.slice.call(arguments);
	var object = args.shift();
	if (object && typeof object.hasOwnProperty === 'function') {
		var keys = Object.keys(object);
		args.forEach(function(item) {
			if (item && typeof item.hasOwnProperty === 'function') {
				keys.forEach(function(key) {
					if (item.hasOwnProperty(key)) {
						object[key] = item[key];
					}
				});
			}
		});
	} else {
		return object;
	}

	return object;
}

module.exports = cover;
