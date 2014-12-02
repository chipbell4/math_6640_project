var THREE = require('three');

/**
 * shorthand for [] that allows negative and positive indices
 */
var pointAt = function(points, offset) {
    var index = (offset + points.length) % points.length;
    return points[index];
};

var smoothPoint = function(points, index) {
    var averagePoint = new THREE.Vector3(0, 0, 0);
    for(var i = -Smoother.BOX_CAR_WIDTH; i <= -Smoother.BOX_CAR_WIDTH; i++) {
        averagePoint = averagePoint.add(pointAt(points, i));
    }

    // scale the point by the number of points we averaged in
    averagePoint.x /= 2 * Smoother.BOX_CAR_WIDTH + 1;
    averagePoint.y /= 2 * Smoother.BOX_CAR_WIDTH + 1;
    averagePoint.z /= 2 * Smoother.BOX_CAR_WIDTH + 1;

    return averagePoint;
};

/**
 * A function for smoothing a polygon to remove jitters, so that we can later
 * remove collinear points
 */
var Smoother = function(points) {
    var smoothPoints = [];
    var N = points.length;
    for(var i = 0; i < N; i++) {
        smoothPoints.push(smoothPoint(points, i));
    }
    return smoothPoints;
};

Smoother.BOX_CAR_WIDTH = 2;

module.exports = Smoother;
