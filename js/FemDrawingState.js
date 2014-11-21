/**
 * A class representing a drawing state of the simulated FEM
 */
var FemDrawingState = function() {

    this.cameraHeight = 2;
    this.cameraDistance = 3;
    this.azimuth = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-4, 4, -4, 4, 1, 10000);
    this.camera.up = new THREE.Vector3(0, 0, 1);
    this.positionCamera();
};

/**
 * Repositions the camera according to the current look angle
 */
FemDrawingState.prototype.positionCamera = function() {
    // set the camera to be offset from the center of the surface wave (0.5, 0.5)
    this.camera.position.x = 0.5 - this.cameraDistance * Math.cos(this.azimuth);
    this.camera.position.y = 0.5 - this.cameraDistance * Math.sin(this.azimuth);
    this.camera.position.z = this.cameraHeight;

    // look back at the middle of the sim
    this.camera.lookAt(new THREE.Vector3(0.5, 0.5, 0));
};

FemDrawingState.prototype.mousemove = function(evt) {
    // set the rotation angle based off of the mouse's position relative to the document size
    this.azimuth = evt.clientX / document.body.clientWidth * 2 * Math.PI;
    this.positionCamera();
};

module.exports = FemDrawingState;
