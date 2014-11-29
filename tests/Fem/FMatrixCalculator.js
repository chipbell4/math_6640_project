var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var FMatrixCalculator = require('../../js/Fem/FMatrixCalculator.js');

describe('FMatrixCalculator', function() {
    it('should exist', function() {
        expect(FMatrixCalculator).to.be.instanceOf(Function);
    });

    var calculator;

    beforeEach(function() {
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(1,0,0),
            new THREE.Vector3(0,1,0)
        );
        var femGeometry = new FemGeometry(threeGeometry, []);
        calculator = new FMatrixCalculator(femGeometry, 1);
    });

    describe('weightForNode', function() {
        it('should calculate the weight inversely proportional to distance squared', function() {
            var weight = calculator.weightForClickAtNode(new THREE.Vector3(1, 1, 0), 0);
            expect(weight).to.be.closeTo(0.333, 0.001);
        });
        it('should not blow up if click is directly at point', function() {
            var weight = calculator.weightForClickAtNode(new THREE.Vector3(0,0,0),0);
            expect(weight).to.be.lessThan(Infinity);
        });
        it('should return 0 for boundary nodes', function() {
            calculator.geometry.boundaryNodes = [0];
            var weight = calculator.weightForClickAtNode(new THREE.Vector3(0,0,0), 0);
            expect(weight).to.equal(0);
        });
    });

    describe('buildMatrix', function() {
        it('should return a correct value', function() {
            var F = calculator.buildMatrix(new THREE.Vector3(0, 0, 0));
            expect(F.length).to.equal(3);

            expect(F[0]).to.be.closeTo(1, 0.001);
            expect(F[1]).to.be.closeTo(0.5, 0.001);
            expect(F[2]).to.be.closeTo(0.5, 0.001);
        });
    });
});
