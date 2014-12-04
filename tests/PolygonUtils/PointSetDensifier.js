var expect = require('chai').expect;
var THREE = require('three');
var PointSetDensifier = require('../../js/PolygonUtils/PointSetDensifier.js');

describe('PointSetDensifier', function() {
    var densifier = PointSetDensifier(0.1);

    it('should exist', function() {
        expect(densifier).to.be.instanceOf(Function);
    });

    it('should not do anything to points that are close together', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.01, 0, 0)
        ];

        expect(densifier(points).length).to.equal(2);
    });

    it('should insert multiple points to make the lengths less than the tolerance', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.25, 0, 0)
        ];

        var newPoints = densifier(points);
        expect(newPoints.length).to.equal(6);

        for(var i = 1; i < newPoints.length; i++) {
            expect(newPoints[i].distanceTo(newPoints[i-1])).to.be.lessThan(0.1);
        }
    });
});
