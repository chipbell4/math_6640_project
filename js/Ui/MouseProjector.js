var THREE = require('three');

var MouseProjector = function(camera, screenWidth, screenHeight) {
    this.camera = camera;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
};

MouseProjector.prototype.projectClick = function(screenCoordinate) {
    // convert the screen coordinate to a world coordinate, relative to the camera
    var clickProjection = screenCoordinate.clone();
    clickProjection.x /= this.screenHeight; 
    clickProjection.x = 1 - clickProjection.x;
    clickProjection.y /= this.screenHeight;

    // first center around (0.5, 0.5)
    clickProjection.add(new THREE.Vector3(-0.5, -0.5, 0));

    // rotate the start point based on camera rotation
    var azimuth = Math.atan2(this.camera.position.y, this.camera.position.x);
    clickProjection.applyAxisAngle(new THREE.Vector3(0, 0, 1), azimuth);

    // translate back
    return clickProjection.add(new THREE.Vector3(0.5, 0.5, 0));
};

module.exports = MouseProjector;
