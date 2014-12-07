var THREE = require('three');

var MouseProjector = function(camera, screenWidth, screenHeight) {
    this.camera = camera;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.bigPlane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial());
};

MouseProjector.prototype.projectClick = function(screenCoordinate) {

    // the tilt axis and angle
    var tiltAxis = new THREE.Vector3(0, 0, 1).cross(this.camera.position).normalize();
    var tiltAngle = Math.PI / 4 * ( (this.screenHeight / 2) - screenCoordinate.y) / this.screenHeight;

    // the pan axis
    var panAxis = this.camera.position.clone().cross(tiltAxis).normalize();
    var panAngle = -Math.PI / 4 * ( screenCoordinate.x - this.screenWidth / 2) / this.screenHeight;

    // the actual look direction (from http://stackoverflow.com/a/15697227)
    var direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    // tilt and pan
    direction.applyAxisAngle(tiltAxis, tiltAngle).applyAxisAngle(panAxis, panAngle);

    // create a ray caster from the direction vector
    var raycaster = new THREE.Raycaster(this.camera.position, direction);

    var intersections = raycaster.intersectObject(this.bigPlane);

    if(intersections.length === 0) {
        return;
    }

    return intersections[0].point;
};

module.exports = MouseProjector;
