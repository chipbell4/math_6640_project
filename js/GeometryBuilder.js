var THREE = require('three');
var triangulate = require('delaunay-triangulate');

/**
 * The big Kahuna. Converts a list of Vectors defining a polygon's boundaries into Geometry
 */
var GeometryBuilder = function(points) {
	this.points = points;
};

/**
 * Calculates the delaunay triangulated faces for a given point set
 */
var buildFaces = function(points) {
	// map points to the format wanted by the delaunay triangulator
	var delaunayPoints = points.map(function(point) {
		return [point.x, point.y];
	});

	// get the triangulated polygon and map to three.js faces
	return triangulate(delaunayPoints).map(function(face) {
		return new THREE.Face3(face[0], face[1], face[2]);
	});
};

/**
 * Builds a geometry from the current point set, with vertices and faces
 */
GeometryBuilder.prototype.buildGeometry = function() {
	var geometry = new THREE.Geometry();

	geometry.vertices = this.points.map(function(point) {
		return point.clone();
	});

	geometry.faces = buildFaces(geometry.vertices);

	return geometry;
};

module.exports = GeometryBuilder;
