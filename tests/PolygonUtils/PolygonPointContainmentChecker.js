var expect = require('chai').expect;
var THREE = require('three');
var PolygonPointContainmentChecker = require('../../js/PolygonUtils/PolygonPointContainmentChecker.js');

describe('PolygonPointContainmentChecker', function() {
	it('Should exist', function() {
		expect(PolygonPointContainmentChecker).to.be.instanceOf(Function);
	});
	
	var pointSet = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(0, 1, 0),
	];

	var checker = new PolygonPointContainmentChecker(pointSet);

	it('Should be able to determine if a point is inside the polygon', function() {
		var candidate = new THREE.Vector3(0.5, 0.5, 0);

		expect(checker.containsPoint(candidate)).to.be.ok;
	});

	it('Should be able to determine if a point is outside the polygon', function() {
		var candidate = new THREE.Vector3(0.5, 1.5, 0);

		expect(checker.containsPoint(candidate)).to.be.not.ok;
	});


});
