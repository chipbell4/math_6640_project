var THREE = require('three');

/**
 * shorthand for [] that allows negative and positive indices
 */
var pointAt = function(points, offset) {
    var index = (offset + points.length) % points.length;
    return points[index];
};

var smoothPoint = function(points, index, boxCarWidth) {
    var averagePoint = new THREE.Vector3(0, 0, 0);
    for(var i = -boxCarWidth; i <= boxCarWidth; i++) {
        averagePoint = averagePoint.add(pointAt(points, index + i));
    }

    // scale the point by the number of points we averaged in
    averagePoint.x /= 2 * boxCarWidth + 1;
    averagePoint.y /= 2 * boxCarWidth + 1;
    averagePoint.z /= 2 * boxCarWidth + 1;

    return averagePoint;
};

var smoothPoints = function(points, boxCarWidth) {
    var smoothPoints = [];
    var N = points.length;
    for(var i = 0; i < N; i++) {
        smoothPoints.push(smoothPoint(points, i, boxCarWidth));
    }
    return smoothPoints;
};

/**
 * A function for smoothing a polygon to remove jitters, so that we can later
 * remove collinear points
 */
var Smoother = function(boxCarWidth) {
    return function(points) {
        return smoothPoints(points, boxCarWidth);
    };
};

module.exports = Smoother;
