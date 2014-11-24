var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var StiffnessMatrixCalculator = require('../../js/Fem/StiffnessMatrixCalculator.js');

describe('SMC', function() {
    it('should exist', function() {
        expect(StiffnessMatrixCalculator).to.be.instanceOf(Function);
    });

    var calculatorFactory = function(vertices, faces, boundaryNodes) {
        var threeGeometry = new THREE.Geometry();
        Array.prototype.push.apply(threeGeometry.vertices, vertices);
        Array.prototype.push.apply(threeGeometry.faces, faces);
        geometry = new FemGeometry(threeGeometry, boundaryNodes);
        return new StiffnessMatrixCalculator(geometry);
    };

    describe('massBetweenNodes', function() {
        it('should exist', function() {
            expect(StiffnessMatrixCalculator.prototype.massBetweenNodes).to.be.instanceOf(Function);
        });

        it('should return 0 if the first node is a boundary node', function() {
            var geometry = calculatorFactory(
                [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
                [new THREE.Face3(0, 1, 2)],
                [0]
                );
             expect(geometry.massBetweenNodes(0, 1)).to.equal(0);
        });
        
        it('should return 0 if the second node is a boundary node', function() {
            var geometry = calculatorFactory(
                [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
                [new THREE.Face3(0, 1, 2)],
                [0]
                );
             expect(geometry.massBetweenNodes(1, 0)).to.equal(0);
        });

        it('should return 0 if the nodes are not adjacent', function() {
            var geometry = calculatorFactory(
                [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
                [new THREE.Face3(0, 1, 2)],
                [1]
                );
             expect(geometry.massBetweenNodes(0, 3)).to.equal(0);
        });

        it('should return the sum of the triangle inner products if they are adjacent interior nodes', function() {
            var geometry = calculatorFactory(
                [new THREE.Vector3(), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 0)],
                [new THREE.Face3(0, 1, 2), new THREE.Face3(0, 1, 3)],
                []
            );

            // TODO: Make this test more exact plz
             expect(geometry.massBetweenNodes(0, 1)).to.not.equal(0);
        });

        it('should return the sum of all neighboring triangles if the nodes are the same');
    });

    describe('buildMatrix', function() {
        it('should exist', function() {
            expect(StiffnessMatrixCalculator.prototype.buildMatrix).to.be.instanceOf(Function);
        });
    });
});
