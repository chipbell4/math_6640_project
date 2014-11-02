var expect = require('chai').expect;
var THREE = require('three');
var GeometryBuilder = require('../js/GeometryBuilder.js');

describe('GeometryBuilder', function() {
	it('Should exist', function() {
		expect(GeometryBuilder).to.be.instanceOf(Function);
	});

	it('Should have a method to build a geometry', function() {
		expect(GeometryBuilder.prototype.buildGeometry).to.be.instanceOf(Function);
	});

	it('Should build a geometry with both vertices and faces', function() {
		var points = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(0, 1, 0)
		];

		var builder = new GeometryBuilder(points);

		var result = builder.buildGeometry();

		expect(result).to.be.instanceOf(THREE.Geometry);

		expect(result.vertices.length).to.equal(3);
		expect(result.faces.length).to.equal(1);
		expect(result.faces[0]).to.be.instanceOf(THREE.Face3);
	});
});
