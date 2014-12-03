var THREE = require('three');

/**
 * Private function to pluck a particular key from an array and find the min of the list
 */
function minValueInArrayForKey(array, key) {
	var pluckedValues = array.map(function(point) {
		return point[key];
	});

	return Math.min.apply(Math, pluckedValues);
}

/**
 * Private function to pluck a key from an array and find the max of that list
 */
function maxValueInArrayForKey(array, key) {
	var pluckedValues = array.map(function(point) {
		return point[key];
	});

	return Math.max.apply(Math, pluckedValues);
}

var rescalePolygon = function(points) {
	if(points.length < 2) {
		throw new Error('Point list must have at least two points');
	}

	var minX = minValueInArrayForKey(points, 'x');
	var maxX = maxValueInArrayForKey(points, 'x');
	var minY = minValueInArrayForKey(points, 'y');
	var maxY = maxValueInArrayForKey(points, 'y');

	var epsilon = 0.000001;

	if(maxX - minX < epsilon || maxY - minY < epsilon) {
		throw new Error('Point range encloses a zero area region');
	}

	var translationVector = new THREE.Vector3(minX, minY, 0);
	var xScaleFactor = 1.0 / (maxX - minX);
	var yScaleFactor = 1.0 / (maxY - minY);
	return points.map(function(point) {
		var centeredPoint = point.sub(translationVector);

		centeredPoint.x *= xScaleFactor;
		centeredPoint.y *= yScaleFactor;

		return centeredPoint;
	});
};

var PolygonRescaler = function() {
    return function(points) {
        return rescalePolygon(points);
    };
};

module.exports = PolygonRescaler;
