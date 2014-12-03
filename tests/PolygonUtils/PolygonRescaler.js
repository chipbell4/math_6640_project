var expect = require('chai').expect;
var THREE = require('three');
var PolygonRescaler = require('../../js/PolygonUtils/PolygonRescaler.js');

describe('PolygonRescaler', function() {
	it('should exist', function() {
		expect(PolygonRescaler).to.be.ok;
	});

	it('Should throw an exception if passed no points', function() {
		expect(function() {
            var rescaler = PolygonRescaler();
            rescaler([]);
		}).to.throw(Error);
	});

	it('Should throw an exception if passed 1 point', function() {
		expect(function() {
            var rescaler = PolygonRescaler();
	        rescaler([new THREE.Vector3(0, 0, 0)]);
		}).to.throw(Error);
	});

	it('Should enforce a non-zero x range', function() {
		expect(function() {
            var rescaler = PolygonRescaler();
			rescaler([
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 1, 0),
			]);
		}).to.throw(Error);
	});

	it('Should enforce a non-zero y range', function() {
		expect(function() {
            var rescaler = polygonrescaler();
			rescaler([
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(1, 0, 0),
			]);
		}).to.throw(Error);
	});

	it('Should construct a translated and scaled set', function() {
        var rescaler = PolygonRescaler();
		var translatedPoints = rescaler([
			new THREE.Vector3(3, 1, 0),
			new THREE.Vector3(1, 2, 0)
		]);

		expect(translatedPoints).to.be.ok;
		var firstTranslatedPoint = translatedPoints[0];
		var secondTranslatedPoint = translatedPoints[1];

		var epsilon = 0.001;
		expect(firstTranslatedPoint.x).to.be.closeTo(1, epsilon);
		expect(firstTranslatedPoint.y).to.be.closeTo(0, epsilon);
		expect(secondTranslatedPoint.x).to.be.closeTo(0, epsilon);
		expect(secondTranslatedPoint.y).to.be.closeTo(1, epsilon);
	});
});
