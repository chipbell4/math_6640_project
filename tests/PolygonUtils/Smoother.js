var expect = require('chai').expect;
var THREE = require('three');
var Smoother = require('../../js/PolygonUtils/Smoother.js');

describe('Smoother', function() {
    it('should be a function', function() {
        expect(Smoother).to.be.instanceOf(Function);
    });

    it('should smooth out points', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.5, 0.1, 0),
            new THREE.Vector3(1, 0, 0),
        ];

        var smoother = Smoother(2);
        var smoothedPoints = smoother(points);
        expect(smoothedPoints[0].y).to.be.greaterThan(0);
        expect(smoothedPoints[1].y).to.be.lessThan(0.1);
        expect(smoothedPoints[2].y).to.be.greaterThan(0);
    });
});
