var expect = require('chai').expect;
var Concaver = require('../../js/PolygonUtils/Concaver.js');
var THREE = require('three');

describe('Concaver', function() {
    var concaver = Concaver();

    var expectPointsEqual = function(p1, p2) {
        expect(p2.distanceTo(p1)).to.be.lessThan(0.00001);
    };

    it('should fix polygons so that they are concave', function() {
        var polygon = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0.7, 0.5, 0),
            new THREE.Vector3(1, 1, 0),
        ];

        var concavePolygon = concaver(polygon);

        expect(concavePolygon.length).to.equal(3);
        expectPointsEqual(concavePolygon[0], new THREE.Vector3(0, 0, 0));
        expectPointsEqual(concavePolygon[1], new THREE.Vector3(1, 0, 0));
        expectPointsEqual(concavePolygon[2], new THREE.Vector3(1, 1, 0));
    });

    it('should filter at the end of the array', function() {
        var polygon = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(0.6, 0.5, 0),
        ];

        var concavePolygon = concaver(polygon);

        expect(concavePolygon.length).to.equal(3);
        expectPointsEqual(concavePolygon[0], new THREE.Vector3(0, 0, 0));
        expectPointsEqual(concavePolygon[1], new THREE.Vector3(1, 0, 0));
        expectPointsEqual(concavePolygon[2], new THREE.Vector3(1, 1, 0));
    });
});
