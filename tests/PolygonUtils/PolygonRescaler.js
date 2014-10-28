var expect = require('chai').expect;
var THREE = require('three');
var PolygonRescaler = require('../../js/PolygonUtils/PolygonRescaler.js');

describe('PolygonRescaler', function() {
	it('Should Exist', function() {
		expect(PolygonRescaler).to.be.ok;
	});

	it('Should throw an exception if passed no points', function() {
		expect(function() {
			new PolygonRescaler([]);
		}).to.throw(Error);
	});

	it('Should throw an exception if passed 1 point', function() {
		expect(function() {
			new PolygonRescaler([new THREE.Vector3(0, 0, 0)]);
		}).to.throw(Error);
	});

	it('Should enforce a non-zero x range', function() {
		expect(function() {
			new PolygonRescaler([
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 1, 0),
			]);
		}).to.throw(Error);
	});

	it('Should enforce a non-zero y range', function() {
		expect(function() {
			new PolygonRescaler([
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(1, 0, 0),
			]);
		}).to.throw(Error);
	});

	it('Should construct a translated and scaled set', function() {
		var rescaler = new PolygonRescaler([
			new THREE.Vector3(3, 1, 0),
			new THREE.Vector3(1, 2, 0)
		]);

		expect(rescaler.translatedPoints).to.be.ok;
		var firstTranslatedPoint = rescaler.translatedPoints[0];
		var secondTranslatedPoint = rescaler.translatedPoints[1];

		var epsilon = 0.001;
		expect(firstTranslatedPoint.x).to.be.closeTo(1, epsilon);
		expect(firstTranslatedPoint.y).to.be.closeTo(0, epsilon);
		expect(secondTranslatedPoint.x).to.be.closeTo(0, epsilon);
		expect(secondTranslatedPoint.y).to.be.closeTo(1, epsilon);
	});
});
