var range = require('range-function');

/**
 * Retrieves the point at a particular index, handling negatives
 */
var pointAt = function(points, index) {
    index = (index + points.length) % points.length;
    return points[index];
};

/**
 * Gets a list of points that need to replace the single point at an index. If the following point is close enough,
 * returns a single, unchanged element. Otherwise, it interpolates extra values in to keep the distances short enough
 */
var getDensePointsAtIndex = function(points, index, maxDistanceAllowed) {
    // get the distance to the next point, if its small enough, we don't need any points
    var distance = pointAt(points, index).distanceTo(pointAt(points, index + 1));

    if(distance <= maxDistanceAllowed) {
        return [ pointAt(points, index) ];
    }

    // Linear interpolate between the point and the next point, squeezing in new points to keep the distances shorter
    var directionVector = pointAt(points, index + 1).clone().sub(pointAt(points, index)).normalize();
    var pointsNeeded = Math.ceil(distance / maxDistanceAllowed) - 1;
    var stepValues = range(0, pointsNeeded, 'inclusive').map(function(number) {
        return number * distance / (pointsNeeded + 1);
    });
    return stepValues.map(function(step) {
        return directionVector.clone().setLength(step).add(pointAt(points, index));
    });
};

/**
 * Densifies a point set into a potentially larger point set
 */
var densifyPoints = function(points, maxDistanceAllowed) {
    var densePoints = range(points.length).map(function(index) {
        return getDensePointsAtIndex(points, index, maxDistanceAllowed);
    });
    return densePoints.reduce(function(carry, densePointSet) {
        Array.prototype.push.apply(carry, densePointSet);
        return carry;
    }, []);
};

/**
 * Pseudo-constructor for a point set densifier
 */
var PointSetDensifier = function(maxDistanceAllowed) {
    return function(points) {
        return densifyPoints(points, maxDistanceAllowed);
    };
};

module.exports = PointSetDensifier;
