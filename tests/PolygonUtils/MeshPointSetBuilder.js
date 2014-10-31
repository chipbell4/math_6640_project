var expect = require('chai').expect;
var THREE = require('three');
var MeshPointSetBuilder = require('../../js/PolygonUtils/MeshPointSetBuilder.js');

describe('MeshPointSetBuilder', function() {
	it('Should exist', function() {
		expect(MeshPointSetBuilder).to.be.instanceOf(Function);
	});

	it('Should add points if the containment checker agrees', function() {
		var containmentChecker = {
			points: [],
			containsPoint: function() { return true; }
		};

		builder = new MeshPointSetBuilder(0.5, 0.5, containmentChecker);

		expect(builder.calculateMeshPoints().length).to.equal(9);
	});

	it('Should not add points if the containment checker disagrees', function() {
		var containmentChecker = {
			points: [],
			containsPoint: function() { return false; }
		};

		builder = new MeshPointSetBuilder(0.5, 0.5, containmentChecker);

		expect(builder.calculateMeshPoints().length).to.equal(0);
	});

	it('Should keep the polygon points from the containment checker but clone them', function() {

		var point = new THREE.Vector3(1, 2, 3);

		var containmentChecker = {
			points: [point, point, point],
			containsPoint: function() { return false; }
		};

		var builder = new MeshPointSetBuilder(0.5, 0.5, containmentChecker);
		var meshPoints = builder.calculateMeshPoints();

		expect(meshPoints.length).to.equal(3);
		expect(meshPoints[0]).to.not.equal(point);
	});
});
