var expect = require('chai').expect;
var THREE = require('THREE');
var MouseProjector = require('../../js/Ui/MouseProjector.js');

describe('MouseProjector', function() {
    var projector;
    var origin = new THREE.Vector3();

    beforeEach(function() {
        var camera = new THREE.OrthographicCamera(-1.5, 1.5, -1.5, 1.5, 0.01, 10000);
        camera.up = new THREE.Vector3(0, 0, 1);
        projector = new MouseProjector(camera, 10, 10);
    });

    it('should project a center click into (0.5, 0.5)', function() {
        projector.camera.position.x = 1;
        projector.camera.position.y = 1;
        projector.camera.position.z = 1;
        projector.camera.lookAt(origin);
        var result = projector.projectClick(new THREE.Vector3(5,5))
        
        expect(result.x).to.be.closeTo(0.5, 0.001);
        expect(result.y).to.be.closeTo(0.5, 0.001);
    });
});
