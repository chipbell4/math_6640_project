var POLYGON_MAX_SIZE = 100;

/**
 * A class representing drawing state during polygon draw mode
 */
var PolygonDrawingState = function() {

	var half = 1 / 2;

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera(-half, half, -half, half, 1, 10000);
	this.camera.up = new THREE.Vector3(0, 1, 0);
	this.camera.position.x = this.camera.position.y = half;
	this.camera.position.z = 50;
	this.camera.lookAt(new THREE.Vector3(half, half, 0));

	// Seed with empties
	this.polygonPoints = new Array(POLYGON_MAX_SIZE);
	this.resetPolygonPoints();
	
	// now setup the meshes
	this.refreshGeometries();

	// Add the meshes to the scene
	this.showPolygon();
};

/**
 * Resets the polygon to size 0
 */
PolygonDrawingState.prototype.resetPolygonPoints = function() {
	for(var i = 0; i < POLYGON_MAX_SIZE; i++) {
		this.polygonPoints[i] = new THREE.Vector3(0, 0, 0);
	}
	this.currentPolygonSize = 0;
};

/**
 * Fills the tail of the vertex buffer so that we don't get lingering (0,0,0) points
 */
PolygonDrawingState.prototype.fillTail = function() {
	if(this.currentPolygonSize === 0) {
		return;
	}

	// copy last point over the rest of the buffer, so we don't get lingering (0,0,0) points
	for(var i = this.currentPolygonSize; i < POLYGON_MAX_SIZE; i++) {
		this.polygonPoints[i] = this.polygonPoints[this.currentPolygonSize - 1].clone();
	}
};

/**
 * Refreshes a geometry's vertices and faces with the current point set
 */
PolygonDrawingState.prototype.refreshGeometry = function(geometry) {
	geometry.vertices = this.polygonPoints;
	geometry.verticesNeedUpdate = true;

	var N = this.polygonPoints.length;
	
	// NOTE: This algorithm for forming faces assumes a convex polygon...
	// TODO: Make this better
	for(var i=0; i<N-2; i++) {
		geometry.faces.push(new THREE.Face3(0, i+1, i+2));
	}

	geometry.computeBoundingSphere();
};

/**
 * Refreshes all geometries for drawing
 */
PolygonDrawingState.prototype.refreshGeometries = function() {
	this.fillTail();

	if(!this.lineMesh) {
		this.lineMesh = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({
			color: '#ffffff',
			linewidth: 2
		}));
	}

	if(!this.polygonMesh) {
		this.polygonMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({
			color: '#ffffff'
		}));
		this.polygonMesh.material.side = THREE.DoubleSide;
	}


	this.refreshGeometry(this.lineMesh.geometry);
	this.refreshGeometry(this.polygonMesh.geometry);
};

// Switches to drawing only the polygon
PolygonDrawingState.prototype.showPolygon = function() {
	if(!this.scene) {
		return;
	}

	this.scene.remove(this.lineMesh);
	this.scene.add(this.polygonMesh);
};

// Switches to drawing only the line
PolygonDrawingState.prototype.showLine = function() {
	if(!this.scene) {
		return;
	}

	this.scene.add(this.lineMesh);
	this.scene.remove(this.polygonMesh);
};

// Handler for mouse up
PolygonDrawingState.prototype.mouseup = function() {
	this.showPolygon();
	this.editingPolygon = false;
};

// Handler for mouse down
PolygonDrawingState.prototype.mousedown = function() {
	this.showLine();
	this.editingPolygon = true;
	this.pointSkipIndex = 0;
	this.resetPolygonPoints();
};

PolygonDrawingState.prototype.mousemove = function(evt) {
	if(!this.editingPolygon) {
		return;
	}

	this.pointSkipIndex = (this.pointSkipIndex + 1) % 3;

	// We'll skip every couple of points, since we don't want to store too many
	if(this.pointSkipIndex !== 0) {
		return;
	}

	// scale screen coordinates to world
	var flippedScreenCoordinates = new THREE.Vector3(evt.offsetX, window.innerHeight - evt.offsetY, 0);
	var worldCoordinates = flippedScreenCoordinates.divideScalar(window.innerHeight);

	// push onto the mesh
	this.polygonPoints[this.currentPolygonSize] = worldCoordinates;
	this.currentPolygonSize = (this.currentPolygonSize + 1) % POLYGON_MAX_SIZE;
	this.refreshGeometries();
};

module.exports = PolygonDrawingState;
