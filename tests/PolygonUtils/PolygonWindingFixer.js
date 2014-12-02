var expect = require('chai').expect;
var THREE = require('three');
var PolygonWindingFixer = require('../../js/PolygonUtils/PolygonWindingFixer.js');

describe('PolygonWindingFixer', function() {
	it('Should Exist', function() {
		expect(PolygonWindingFixer).to.be.ok;
	});

	var expectPointsEqual = function(p1, p2) {
		expect(p1.x).to.be.closeTo(p2.x, 0.001);
		expect(p1.y).to.be.closeTo(p2.y, 0.001)
	};

	it('Should leave the point set unchanged if the point set is counter clockwise', function() {
		var originalPoints = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(0, 1, 0)
		];
		var correctedPoints = PolygonWindingFixer(originalPoints);

		// check that the second point hasn't been moved
		expectPointsEqual(correctedPoints[1], new THREE.Vector3(1, 0, 0));

	});

	it('Should reverse the point set if the point is is clockwise', function() {
		var originalPoints = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 1, 0),
			new THREE.Vector3(1, 0, 0)
		];
		var correctedPoints = PolygonWindingFixer(originalPoints);

		expectPointsEqual(correctedPoints[1], new THREE.Vector3(0, 1, 0));
	});
});
