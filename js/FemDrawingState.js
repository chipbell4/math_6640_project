var THREE = require('three');
var Polygon = require('./PolygonUtils/Polygon.js');
var PolygonPointContainmentChecker = require('./PolygonUtils/PolygonPointContainmentChecker.js');
var MeshPointSetBuilder = require('./PolygonUtils/MeshPointSetBuilder.js');
var GeometryBuilder = require('./GeometryBuilder.js');
var FemGeometry = require('./Fem/FemGeometry.js');
var range = require('range-function');

/**
 * A class representing a drawing state of the simulated FEM
 */
var FemDrawingState = function() {
    this.cameraDistance = 1;
    this.elevation = 0;
    this.azimuth = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1.5, 1.5, -1.5, 1.5, 0.01, 10000);
    this.camera.up = new THREE.Vector3(0, 0, 1);
    this.positionCamera();
};

/**
 * Repositions the camera according to the current look angle
 */
FemDrawingState.prototype.positionCamera = function() {
    // set the camera to be offset from the center of the surface wave (0.5, 0.5)
    this.camera.position.x = 0.5 + this.cameraDistance * Math.cos(this.azimuth) * Math.sin(this.elevation);
    this.camera.position.y = 0.5 + this.cameraDistance * Math.sin(this.azimuth) * Math.sin(this.elevation);
    this.camera.position.z = this.cameraDistance * Math.cos(this.elevation);

    // look back at the middle of the sim
    this.camera.lookAt(new THREE.Vector3(0.5, 0.5, 0));
};

FemDrawingState.prototype.mousemove = function(evt) {
    // set the rotation angle based off of the mouse's position relative to the document size
    this.azimuth = evt.clientX / document.body.clientWidth * 2 * Math.PI;
    this.elevation = -evt.clientY / document.body.clientHeight * (Math.PI / 2) + Math.PI / 2;
    this.positionCamera();
};


/**
 * Sets the current polygon on the fem drawing side
 */
FemDrawingState.prototype.setCurrentPolygon = function(points) {
    var filteredPoints = Polygon.factory(points).mappedPoints();
    var containmentChecker = new PolygonPointContainmentChecker(filteredPoints);    
    var pointSetBuilder = new MeshPointSetBuilder(0.1, 0.1, containmentChecker);
    
    var meshPoints = pointSetBuilder.calculateMeshPoints();
    var boundaryNodes = range(filteredPoints.length, 'inclusive');

    // create the Fem geometry
    var threeGeometry = new GeometryBuilder(meshPoints).buildGeometry();
    var femGeometry = new FemGeometry(threeGeometry, boundaryNodes);

    var mesh = femGeometry.asMesh();
    this.scene.remove(this.scene.children[0]);
    this.scene.add(mesh);
};

module.exports = FemDrawingState;
