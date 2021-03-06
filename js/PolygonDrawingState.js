var THREE = require('three');
var PolygonBuffer = require('./PolygonUtils/PolygonBuffer.js');

/**
 * A class representing drawing state during polygon draw mode
 */
var PolygonDrawingState = function() {

	var half = 1 / 2;

    this.aspectRatio = window.innerWidth / window.innerHeight;
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera(
        -half * this.aspectRatio,
        half * this.aspectRatio,
        -half,
        half,
        1,
        10000
    );
	this.camera.up = new THREE.Vector3(0, -1, 0);
	this.camera.position.x = this.camera.position.y = half;
	this.camera.position.z = -50;
	this.camera.lookAt(new THREE.Vector3(half, half, 0));

	// Create the buffer
	this.buffer = new PolygonBuffer(1000);
    this.buffer.addPoint(new THREE.Vector3(0, 0, 0));
    this.buffer.addPoint(new THREE.Vector3(1, 0, 0));
    this.buffer.addPoint(new THREE.Vector3(1, 1, 0));
    this.buffer.addPoint(new THREE.Vector3(0, 1, 0));

	// now setup the meshes
	this.refreshGeometries();

	// Add the meshes to the scene
	this.showPolygon();
};

/**
 * Refreshes a geometry's vertices and faces with the current point set
 */
PolygonDrawingState.prototype.refreshGeometry = function(geometry) {
	geometry.vertices = this.buffer.vertices;
	geometry.faces = this.buffer.faces;
	geometry.verticesNeedUpdate = true;
	geometry.elementsNeedUpdate = true;
	geometry.computeBoundingSphere();
};

/**
 * Refreshes all geometries for drawing
 */
PolygonDrawingState.prototype.refreshGeometries = function() {
	if(!this.lineMesh) {
		this.lineMesh = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({
			color: '#ffffff',
			linewidth: 2
		}));
	}

	if(!this.polygonMesh) {
		this.polygonMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({
			color: '#ffffff',
            side: THREE.DoubleSide,
		}));
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
    this.scene.remove(this.polygonMesh);
	this.scene.add(this.polygonMesh);
};

// Switches to drawing only the line
PolygonDrawingState.prototype.showLine = function() {
	if(!this.scene) {
		return;
	}

	this.scene.remove(this.lineMesh);
	this.scene.add(this.lineMesh);
	this.scene.remove(this.polygonMesh);
};

// Handler for mouse up
PolygonDrawingState.prototype.mouseup = function() {
	this.showPolygon();
	this.editingPolygon = false;

    // If the polygon is of zero length, reset back to a plane so it doesn't break
    if(this.buffer.length <= 2) {
        this.buffer.addPoint(new THREE.Vector3(0, 0, 0));
        this.buffer.addPoint(new THREE.Vector3(1, 0, 0));
        this.buffer.addPoint(new THREE.Vector3(1, 1, 0));
        this.buffer.addPoint(new THREE.Vector3(0, 1, 0));
        this.refreshGeometries();
    }
};

// Handler for mouse down
PolygonDrawingState.prototype.mousedown = function() {
	this.showLine();
	this.editingPolygon = true;
	this.pointSkipIndex = 0;
	this.buffer.resetVertexBuffer();
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
	var screenCoordinates = new THREE.Vector3(evt.clientX, window.innerHeight - evt.clientY, 0);
	var worldCoordinates = screenCoordinates.clone();
	worldCoordinates.y /= window.innerHeight;
    
    var leftOffset = (window.innerWidth - window.innerHeight) / 2;
    var clampedScreenX = Math.max(leftOffset, screenCoordinates.x);
    clampedScreenX = Math.min(clampedScreenX, window.innerWidth - leftOffset);
    worldCoordinates.x = (clampedScreenX - leftOffset) / window.innerHeight; 

	// push onto the mesh
	this.buffer.addPoint(worldCoordinates);
	this.refreshGeometries();
};

module.exports = PolygonDrawingState;
