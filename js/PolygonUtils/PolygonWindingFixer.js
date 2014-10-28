var THREE = require('three');

var PolygonWindingFixer = function(points) {
	// clone the array
	this.correctedPoints = points.slice(0);

	// fix if the windedness is wrong
	if(calculateWindedness(points) < 0) {
		this.correctedPoints = this.correctedPoints.reverse();
	}
};

/**
 * Computes the winding of the polygon via the shoelace formula:
 * http://en.wikipedia.org/wiki/Shoelace_formula
 * TODO: Convert to a better reference
 */
var calculateWindedness = function(points) {
	var windingFactor = 0;

	var N = points.length;

	for(var i = 0; i < N; i++) {
		var previousI = (i - 1 + N) % N;
		var nextI = (i + 1 + N) % N;

		windingFactor += points[i].x * (points[nextI].y - points[previousI].y);
	}

	return windingFactor;
};

module.exports = PolygonWindingFixer;