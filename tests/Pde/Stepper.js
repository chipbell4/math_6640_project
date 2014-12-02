var expect = require('chai').expect;
var numeric = require('numeric');
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
        stepper = new Stepper(femGeometry, 1, 0.1);
    });

    it('should not blow up after many empty steps', function() {
        var many = 1;
        for(var i = 0; i < many; i++) {
            stepper.step(0.01);
        }

        expect(stepper.currentWavePosition[0]).to.equal(0);
        expect(stepper.currentWavePosition[1]).to.equal(0);
    });

    it('should limit to zero if a click is registered at the start', function() {
        var Zero = [0, 0];
        var many = 1000;
        var currentWavePosition = stepper.step(0.01, new THREE.Vector3(0.5, 0.5, 0));
        
        // Make sure the energy DID propogate
        expect(currentWavePosition).to.not.deep.equal(Zero);
        
        for(var i = 0; i < many; i++) {
            var nextWavePosition = stepper.step(0.01);
            
            currentWavePosition = nextWavePosition;
        }
        
        expect(stepper.currentWavePosition[0]).to.be.closeTo(0, 0.001);
        expect(stepper.currentWavePosition[1]).to.be.closeTo(0, 0.001);
    });
});
