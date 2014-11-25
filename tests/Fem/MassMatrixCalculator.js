var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var MassMatrixCalculator = require('../../js/Fem/MassMatrixCalculator.js');

describe('SMC', function() {
    it('should exist', function() {
        expect(MassMatrixCalculator).to.be.instanceOf(Function);
    });

    var calculatorFactory = function(vertices, faces, boundaryNodes) {
        var threeGeometry = new THREE.Geometry();
        Array.prototype.push.apply(threeGeometry.vertices, vertices);
        Array.prototype.push.apply(threeGeometry.faces, faces);
        geometry = new FemGeometry(threeGeometry, boundaryNodes);
        return new MassMatrixCalculator(geometry);
    };

    describe('massBetweenNodes', function() {
        it('should exist', function() {
            expect(MassMatrixCalculator.prototype.massBetweenNodes).to.be.instanceOf(Function);
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

        it('should return the sum of the triangle inner products if they are the same node', function() {
            var geometry = calculatorFactory(
                [new THREE.Vector3(), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 0)],
                [new THREE.Face3(0, 1, 2), new THREE.Face3(0, 1, 3)],
                []
            );

            // TODO: Make this test more exact plz
             expect(geometry.massBetweenNodes(0, 0)).to.not.equal(0);
        });

        it('should return the sum of all neighboring triangles if the nodes are the same');
    });

    describe('buildMatrix', function() {
        it('should exist', function() {
            expect(MassMatrixCalculator.prototype.buildMatrix).to.be.instanceOf(Function);
        });
        
        it('should return a matrix', function() {
            var calculator = calculatorFactory([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1/3, 1/3, 0),
                new THREE.Vector3(2/3, 2/3, 0),
            ], [
                new THREE.Face3(0, 1, 4),
                new THREE.Face3(0, 2, 4),
                new THREE.Face3(2, 4, 5),
                new THREE.Face3(2, 5, 3),
                new THREE.Face3(5, 1, 4),
                new THREE.Face3(5, 1, 3),
            ],
            [0, 1, 2, 3]);

            var matrix = calculator.buildMatrix();
            expect(matrix).to.be.instanceOf(Array);

            // make sure dimensions are correct
            expect(matrix.length).to.equal(6);
            matrix.forEach(function(row) {
                expect(row.length).to.equal(6);
            });

            // make sure boundary nodes have zeroes
            [0, 1, 2, 3].forEach(function(node) {
                expect(matrix[node]).to.deep.equal([0, 0, 0, 0, 0, 0]);
            });

            // make sure the interior nodes have non-zeros
            expect(matrix[4][4]).to.be.greaterThan(0);
            expect(matrix[5][5]).to.be.greaterThan(0);
            expect(matrix[4][5]).to.be.greaterThan(0);
            expect(matrix[5][4]).to.not.equal(0);

            // make sure we're symmetric
            expect(matrix[5][4]).to.equal(matrix[4][5]);
        });
    });
});
