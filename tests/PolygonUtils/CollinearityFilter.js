var expect = require('chai').expect;
var THREE = require('three');
var CollinearityFilter = require('../../js/PolygonUtils/CollinearityFilter.js');

describe('CollinearityFilter', function() {
    it('should exist', function() {
        expect(CollinearityFilter).to.be.instanceOf(Function);
    });

    it('should do nothing to a point set of size less than three', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0)
        ];

        var filter = CollinearityFilter(0.001);

        expect(filter(points)).to.deep.equal(points);
    });

    it('should do nothing to points that are not collinear', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(1, 0, 0)
        ];

        var filter = CollinearityFilter(0.001);

        expect(filter(points)).to.deep.equal(points);
    });

    it('should remove the middle point if the points are collinear', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(3, 0, 0),
        ];

        var filter = CollinearityFilter(0.001);

        expect(filter(points).length).to.equal(2);
    });
});
