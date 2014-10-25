/**
 * A class representing drawing state during polygon draw mode
 */
var PolygonDrawingState = function() {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	this.camera.up = new THREE.Vector3(0, 1, 0);
	this.camera.position.z = 5;
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.polygonPoints = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(0, 1, 0),
	];
	
	// now setup the meshes
	this.refreshGeometries();

	// Add the meshes to the scene
	this.showLine();
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

	var lineGeometry = this.calculateLineGeometry();
	var polygonGeometry = this.calculatePolygonGeometry();

	if(!this.lineMesh) {
		var lineMaterial = new THREE.LineBasicMaterial({
			color: '#ffffff',
			linewidth: 2
		});
		this.lineMesh = new THREE.Line(lineGeometry, lineMaterial);
	}
	else {
		this.lineMesh.setGeometry(lineGeometry);
	}

	if(!this.polygonMesh) {
		var polygonMaterial = new THREE.MeshBasicMaterial({color:'#ffffff'});
		this.polygonMesh = new THREE.Mesh(polygonGeometry, polygonMaterial);
	}
	else {
		this.polygonMesh.setGeometry(polygonGeometry);
	}
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

module.exports = PolygonDrawingState;
