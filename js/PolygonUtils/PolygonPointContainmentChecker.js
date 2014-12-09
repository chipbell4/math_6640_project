var range = require('range-function');

var PolygonPointContainmentChecker = function(points) {
	this.points = points;
};

PolygonPointContainmentChecker.prototype.pointAt = function(i) {
    return this.points[ (i + this.points.length) % this.points.length ];
};

/**
 * Calculates the winding number for a point only at a particular vertex of the polygon, given by the index
 */
PolygonPointContainmentChecker.prototype.calculateWindingForPointAtIndex = function(point, index) {
	var currentPoint = this.points[index].clone();
	var nextPoint = this.points[ (index + 1) % this.points.length ].clone();

	// The polygon edge
	var firstAxis = nextPoint.clone().sub(currentPoint.clone());
    firstAxis.setZ(0);
    if(firstAxis.length() < 0.0001) {
        return -1;
    }

	// A vector from point[i] to the provided point
	var secondAxis = point.clone().sub(currentPoint.clone());
    secondAxis.setZ(0);
    if(secondAxis.length() < 0.0001) {
        return -1;
    }

	// return the sign (the z-component) of the cross product to determine which side of the axis the point is
	var crossProduct = firstAxis.clone().cross(secondAxis);

    var relativeCrossProductMagnitude = crossProduct.z / firstAxis.length() / secondAxis.length();
    
	if(relativeCrossProductMagnitude <= 0.001) {
		return -1;
	}

	return 1;
};

PolygonPointContainmentChecker.prototype.containsPoint = function(point) {
	var winding = 0;

	var N = this.points.length;
	for(var i = 0; i < N; i++) {
		winding += this.calculateWindingForPointAtIndex(point, i);
	}

    if(winding != N) {
        return false;
    }

    
    var that = this;
    var pointCloseToEdge = range(this.points.length).some(function(index) {
        var start = that.pointAt(index), end = that.pointAt(index + 1);
        var direction = end.clone().sub(start);
        var lengthSquared = direction.lengthSq();
        var t = direction.dot(point.clone().sub(start)) / lengthSquared;
        var nearestPoint = start.clone().add(direction.clone().multiplyScalar(t));
        return t >= 0 && t <= 1 && nearestPoint.distanceTo(point) < 0.05;
    });

    return !pointCloseToEdge;
};

module.exports = PolygonPointContainmentChecker;
