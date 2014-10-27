var THREE = require('three');

var PolygonBuffer = function(BUFFER_SIZE) {
	this.BUFFER_SIZE = BUFFER_SIZE;

	// Allocate the full buffer
	this.vertices = new Array(BUFFER_SIZE);
	this.faces = new Array(BUFFER_SIZE - 2);

	// However, the length is starting at 0
	this.length = 0;

	// now, fill up with points
	this.resetVertexBuffer();

	for(var i = 0; i < this.BUFFER_SIZE - 2; i++) {
		this.faces[i] = new THREE.Face3(0, i + 1, i + 2);
	}
};

PolygonBuffer.prototype.addPoint = function(newPoint) {
	this.vertices[ this.length ] = newPoint;

	this.length = (this.length + 1) % this.BUFFER_SIZE;

	// now fill tail of the buffer with the new point as well, so the line generated
	// won't jump back to the origin
	for(var i = this.length; i < this.BUFFER_SIZE; i++) {
		this.vertices[ i ] = newPoint.clone();
	}
};

PolygonBuffer.prototype.resetVertexBuffer = function() {
	// Wipe the vertices
	for(var i = 0; i < this.BUFFER_SIZE; i++) {
		this.vertices[i] = new THREE.Vector3(0, 0, 0);
	}

	this.length = 0;
};

module.exports = PolygonBuffer;
