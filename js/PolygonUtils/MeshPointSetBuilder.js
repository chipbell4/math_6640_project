var THREE = require('three');

/**
 * Helper class for building a list of all points within a polygon, passed as a
 * containment checker. Assumes that polygon lies within the unit square [0, 1]x[0, 1]
 */
var MeshPointSetBuilder = function(dx, dy, containmentChecker) {
	this.dx = dx;
	this.dy = dy;
	this.containmentChecker = containmentChecker;
};

/**
 * Helper to clone a point set
 */
function clonePointSet(pointSet) {
	return pointSet.map(function(point) {
		return point.clone();
	});
}

function addPointIfInMesh(pointSet, point, containmentChecker) {
	if(containmentChecker.containsPoint(point)) {
		pointSet.push(point);
	}

	return pointSet;
}

/**
 * Pushes any points with the given x value onto point set using a given y-step and containmentChecker
 */
function addAllYsInRangeForX(pointSet, x, dy, containmentChecker) {
	for(var y = 0; y <= 1.0; y += dy) {
		pointSet = addPointIfInMesh(pointSet, new THREE.Vector3(x, y, 0), containmentChecker);
	}

	return pointSet;
}

/**
 * Calculates the set of points within the mesh
 */
MeshPointSetBuilder.prototype.calculateMeshPoints = function() {
	// Be sure to include the polygon points which define the edge
	var meshPoints = clonePointSet(this.containmentChecker.points);

	// now query each point for containment
	for(var x = 0; x <= 1.0; x += this.dx) {
		meshPoints = addAllYsInRangeForX(meshPoints, x, this.dy, this.containmentChecker);
	}

	return meshPoints;
};

module.exports = MeshPointSetBuilder;
