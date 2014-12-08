var pointAt = function(points, index) {
    index = (index + points.length) % points.length;
    return points[index];
};

var pointsAreConcave = function(previous, current, next) {
    var direction1 = current.clone().sub(previous);
    var direction2 = next.clone().sub(previous);

    return direction1.cross(direction2).z >= 0;
};

var filterNonConcavePoints = function(points) {
    var newPoints = [points[0]];
    var N = points.length;
    for(var i = 1; i < N; i++) {
        var lastNewPoints = newPoints[ newPoints.length - 1];
        var current = points[i];
        var next = pointAt(points, i + 1);
        if(pointsAreConcave(lastNewPoints, current, next)) {
            newPoints.push(current);
        }
    }

    return newPoints;
};

/**
 * A filter for making points a concave set
 */
var Concaver = function() {
    return filterNonConcavePoints;
};

module.exports = Concaver;
