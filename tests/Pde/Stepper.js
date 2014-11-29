var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var Stepper = require('../../js/Pde/Stepper.js');

describe('Stepper', function() {

    var threeGeometry = new THREE.Geometry();
    threeGeometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(1/3, 1/3, 0),
        new THREE.Vector3(2/3, 2/3, 0)
    );
    threeGeometry.faces.push(
        new THREE.Face3(0, 1, 4),
        new THREE.Face3(0, 2, 4),
        new THREE.Face3(2, 4, 5),
        new THREE.Face3(2, 5, 3),
        new THREE.Face3(5, 1, 4),
        new THREE.Face3(5, 1, 3)
    );
    var femGeometry = new FemGeometry(threeGeometry, [0, 1, 2, 3]);

    var stepper;
    beforeEach(function() {
        stepper = new Stepper(femGeometry, 1, 1);
    });

    it('should not blow up after many empty steps', function() {
        var many = 1000;
        for(var i = 0; i < many; i++) {
            stepper.step(0.01);
        }

       expect(stepper.currentWavePosition).to.equal([0, 0, 0, 0, 0, 0]); 
    });

    it('should limit to zero if a click is registered at the start');
});
