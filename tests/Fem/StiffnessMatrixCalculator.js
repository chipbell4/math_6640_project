var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var StiffnessMatrixCalculator = require('../../js/Fem/StiffnessMatrixCalculator.js');

describe('StiffnessMatrixCalculator', function() {
    var stiffnessMatrixCalculator;

    beforeEach(function() {
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(2, 2, 0)
        );
        threeGeometry.faces.push(new THREE.Face3(0, 1, 2));
        
        var femGeometry = new FemGeometry(threeGeometry, []);

        stiffnessMatrixCalculator = new StiffnessMatrixCalculator(femGeometry);
    });

    it('Should exist', function() {
        expect(StiffnessMatrixCalculator).to.be.instanceOf(Function);
    });

    describe('singleTriangleInnerProduct', function() {
        it('should exist', function() {
            expect(stiffnessMatrixCalculator.singleTriangleInnerProduct).to.be.instanceOf(Function);
        });
            
        it('should handle orthogonal gradients', function() {
            var result = stiffnessMatrixCalculator.singleTriangleInnerProduct([0, 1, 2], [0, 2]);
            expect(result).to.equal(0);
        });

        it('should handle non-orthogonal gradients', function() {
            var result = stiffnessMatrixCalculator.singleTriangleInnerProduct([0, 1, 2], [0, 1])
            expect(result).to.be.closeTo(-0.5, 0.001);
        });

        it('should return zero if the first weighted point is a boundary node', function() {
            stiffnessMatrixCalculator.geometry.boundaryNodes.push(0);
            var result = stiffnessMatrixCalculator.singleTriangleInnerProduct([0, 1, 2], [0, 1])
            expect(result).to.equal(0);
        });

        it('should return zero if the second weighted point is a boundary node', function() {
            stiffnessMatrixCalculator.geometry.boundaryNodes.push(1);
            var result = stiffnessMatrixCalculator.singleTriangleInnerProduct([0, 1, 2], [0, 1])
            expect(result).to.equal(0);
        });
    });
});
