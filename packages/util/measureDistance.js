/**
 * 测量地理坐标的距离
 * @method measureDistance
 * @param {Number} lat1 坐标1精度
 * @param {Number} lng1 坐标1纬度
 * @param {Number} lat2 坐标2精度
 * @param {Number} lng2 坐标2纬度
 * @returns {Number} 2个坐标之间的距离（千米）
 * @example
 * var $measureDistance = require('spore-kit/packages/util/measureDistance');
 * var distance = $measureDistance(0, 0, 100, 100);
 * // 9826.40065109978
 */

function measureDistance (lat1, lng1, lat2, lng2) {
	var radLat1 = (lat1 * Math.PI) / 180.0;
	var radLat2 = (lat2 * Math.PI) / 180.0;
	var a = radLat1 - radLat2;
	var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
	var s = 2 * Math.asin(
		Math.sqrt(
			Math.pow(Math.sin(a / 2), 2)
			+ Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
		)
	);
	// 地球半径
	s *= 6378.137;
	return s;
}

module.exports = measureDistance;
