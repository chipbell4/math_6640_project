/**
 * Extension of [] to allow -1 and too large indices
 */
var pointAt = function(points, index) {
    index = (index + points.length) % points.length;
    return points[index];
};

/**
 * Returns true if the points around a given index are collinear, meaning that the middle point can be deleted
 */
var canBeRemoved = function(points, index, tolerance) {
    var previous = pointAt(points, index - 1);
    var current = pointAt(points, index);
    var next = pointAt(points, index + 1);

    // calculate the magnitude of the cross product
    var directionOne = current.clone().sub(previous);
    var directionTwo = next.clone().sub(current);
    var magnitude = directionOne.cross(directionTwo).length();

    return magnitude <= tolerance;
};

/**
 * Returns an updated array, where collinear points have been removed
 */
var removeCollinearPoints = function(points, tolerance) {
    var index = 1;

    while(index < points.length - 1) {
        // if the current point is collinear, remove it
        if(canBeRemoved(points, index, tolerance)) {
            points.splice(index, 1);
        }
        else {
            index++;
        }
    }

    return points;
};

/**
 * Constructor for building collinearity filter
 */
var CollinearityFilter = function(tolerance) {
    return function(points) {
        return removeCollinearPoints(points, tolerance);
    };
};

module.exports = CollinearityFilter;
