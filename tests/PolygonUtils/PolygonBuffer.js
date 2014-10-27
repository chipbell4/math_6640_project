var expect = require('chai').expect;
var THREE = require('three');
var PolygonBuffer = require('../../js/PolygonUtils/PolygonBuffer.js');

describe('PolygonBuffer', function() {
	it('Should exist', function() {
		expect(PolygonBuffer).to.be.ok;
	});

	it('Should be able to add a point', function() {
		var buffer = new PolygonBuffer(100);
		expect(buffer.vertices.length).to.equal(100);
		expect(buffer.length).to.equal(0);

		buffer.addPoint(new THREE.Vector3(1, 2, 3));

		expect(buffer.vertices.length).to.equal(100);
		expect(buffer.length).to.equal(1);
	});

	it('Should be able to wipe the internal buffer', function() {
		var buffer = new PolygonBuffer(100);

		buffer.addPoint(new THREE.Vector3(1, 2, 3));
		expect(buffer.length).to.equal(1);

		buffer.resetVertexBuffer();

		expect(buffer.length).to.equal(0);
	});

	it('Should reset the buffer when first created', function() {
		var buffer = new PolygonBuffer(5);

		for(var i=0; i<5; i++) {
			expect(buffer.vertices[i] instanceof THREE.Vector3).to.be.ok;
		}
	});

	it('Should copy the last point to the entire buffer', function() {
		var buffer = new PolygonBuffer(10);

		buffer.addPoint(new THREE.Vector3(1, 2, 3));
		for(var i = 1; i < 10; i++) {
			expect(buffer.vertices[i].x).to.equal(1);
			expect(buffer.vertices[i].y).to.equal(2);
			expect(buffer.vertices[i].z).to.equal(3);
		}
	});

	it('Should keep an internal faces array', function() {
		var buffer = new PolygonBuffer(10);

		expect(buffer.faces.length).to.equal(8);

		for(var i = 0; i < 8; i++) {
			expect(buffer.faces[i] instanceof THREE.Face3).to.be.ok;
		}
	});
});
