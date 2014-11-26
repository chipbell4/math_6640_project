var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var StiffnessMatrixCalculator = require('../../js/Fem/StiffnessMatrixCalculator.js');

describe('StiffnessMatrixCalculator', function() {
    it('Should exist', function() {
        expect(StiffnessMatrixCalculator).to.be.instanceOf(Function);
    });

    describe('singleTriangleInnerProduct', function() {
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(1, 2, 0)
        );
        threeGeometry.faces.push(new THREE.Face3(0, 1, 2));
        var femGeometry;

        beforeEach(function() {
            femGeometry = new FemGeometry(threeGeometry, []);
        });

        it('should exist', function() {
            expect(StiffnessMatrixCalculator.prototype.singleTriangleInnerProduct).to.be.instanceOf(Function);
        });
            

        it('should calculate values using the correct formulat');

        it('should return zero if the first weighted point is a boundary node');

        it('should return zero if the second weighted point is a boundary node');
    });
});
