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

	var quarter = 1/4;
	var threeQuarters = 3/4;

	this.polygonPoints = [
		new THREE.Vector3(quarter, quarter, 0),
		new THREE.Vector3(threeQuarters, quarter, 0),
		new THREE.Vector3(threeQuarters, threeQuarters, 0),
		new THREE.Vector3(quarter, threeQuarters, 0),
	];
	
	// now setup the meshes
	this.refreshGeometries();

	// Add the meshes to the scene
	this.showPolygon();
};

/**
 * Calculates a geometry object for a line from the current polygonPoints
 */
PolygonDrawingState.prototype.calculateLineGeometry = function() {
	var geometry = new THREE.Geometry();

	var N = this.polygonPoints.length;
	for(var i=0; i<N; i++) {
		geometry.vertices.push(this.polygonPoints[i]);
	}

	geometry.computeBoundingSphere();

	return geometry;
};

/**
 * Calculates a geometry object for a filled polygon from the current polygonPoints
 */
PolygonDrawingState.prototype.calculatePolygonGeometry = function() {
	
	var geometry = this.calculateLineGeometry();

	var N = this.polygonPoints.length;
	
	// NOTE: This algorithm for forming faces assumes a convex polygon...
	// TODO: Make this better
	for(var i=0; i<N-2; i++) {
		geometry.faces.push(new THREE.Face3(0, i+1, i+2));
	}

	geometry.computeBoundingSphere();

	return geometry;
};

/**
 * Refreshes all geometries for drawing
 */
PolygonDrawingState.prototype.refreshGeometries = function() {
	if(!this.lineMesh) {
		var lineMaterial = new THREE.LineBasicMaterial({
			color: '#ffffff',
			linewidth: 2
		});
		this.lineMesh = new THREE.Line(new THREE.Geometry(), lineMaterial);
	}

	this.lineMesh.geometry.vertices = this.polygonPoints;
	this.lineMesh.geometry.computeBoundingSphere();
	this.lineMesh.geometry.verticesNeedUpdate = true;
	this.lineMesh.material.needsUpdate = true;

	if(!this.polygonMesh) {
		var polygonMaterial = new THREE.MeshBasicMaterial({color:'#ffffff'});
		polygonMaterial.side = THREE.DoubleSide;
		this.polygonMesh = new THREE.Mesh(new THREE.Geometry(), polygonMaterial);
	}

	this.polygonMesh.geometry = this.calculatePolygonGeometry();
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
	this.polygonPoints = [];
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
	this.polygonPoints.push(worldCoordinates);
	this.refreshGeometries();
};

module.exports = PolygonDrawingState;
