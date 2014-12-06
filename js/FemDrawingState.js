var THREE = require('three');
var Polygon = require('./PolygonUtils/Polygon.js');
var PolygonPointContainmentChecker = require('./PolygonUtils/PolygonPointContainmentChecker.js');
var MeshPointSetBuilder = require('./PolygonUtils/MeshPointSetBuilder.js');
var GeometryBuilder = require('./GeometryBuilder.js');
var FemGeometry = require('./Fem/FemGeometry.js');
var MouseProjector = require('./Ui/MouseProjector.js');
var range = require('range-function');
var Stepper = require('./Pde/Stepper.js');
var DAT = require('dat-gui');

/**
 * A class representing a drawing state of the simulated FEM
 */
var FemDrawingState = function() {
    this.cameraDistance = 2.5;
    this.elevation = 0;
    this.azimuth = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
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

FemDrawingState.prototype.mousedown = function(evt) {
    var projector = new MouseProjector(this.camera, window.innerWidth, window.innerHeight);
    var screenCoordinate = new THREE.Vector3(evt.clientX, evt.clientY, 0);
    this.currentClick = projector.projectClick(screenCoordinate);
};

FemDrawingState.prototype.mouseup = function() {
    delete this.currentClick;
};

FemDrawingState.prototype.update = function() {
    this.stepper.step(0.001, this.currentClick);

    // set the z position of each internal node
    var that = this;
    this.stepper.geometry.internalNodes.forEach(function(nodeIndex, arrayIndex) {
        that.scene.children[0].geometry.vertices[nodeIndex].z = that.stepper.currentWavePosition[arrayIndex];
    });
	
    this.scene.children[0].geometry.verticesNeedUpdate = true;
	this.scene.children[0].geometry.elementsNeedUpdate = true;
	this.scene.children[0].geometry.computeBoundingSphere();
};

/**
 * Callback builder for dat-gui when a field is updated
 */
FemDrawingState.prototype.datGuiListenerFactory = function(fieldName) {
    var that = this;
    return function(newValue) {
        that.stepper[fieldName] = newValue;
    }
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

    // make it drawable
    var mesh = femGeometry.asMesh();
    this.scene.remove(this.scene.children[0]);
    this.scene.add(mesh);

    // setup the Fem Model
    this.stepper = new Stepper({
        geometry: femGeometry,
        elasticity: 0.01,
        dampingCoefficient: 2,
        waveSpeed: 2
    });

    // setup dat-gui
    var gui = new DAT.GUI();
    gui.add(this.stepper, 'elasticity').min(0).max(0.1);
    gui.add(this.stepper, 'dampingCoefficient').min(0).max(20);
    gui.add(this.stepper, 'clickWeight').min(100).max(10000);
    gui.add(this.stepper, 'clickTightness').min(10).max(10000);
};

module.exports = FemDrawingState;
