var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');

describe('FemGeometry', function() {
    it('Should exist', function() {
        expect(FemGeometry).to.be.instanceOf(Function);
    });

    describe('isBoundaryNode', function() {
        // Global one-time setup
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3( -10,  10, 0 ),
            new THREE.Vector3( -10, -10, 0 ),
            new THREE.Vector3(  10, -10, 0 )
        );
        var geometry = new FemGeometry(
            threeGeometry,
            [ 1 ]
        );

        it('should return true if a node is a boundary node', function() {
            expect(geometry.isBoundaryNode(1)).to.be.ok;
        });

        it('should return false if a node is not a boundary node', function() {
            expect(geometry.isBoundaryNode(2)).to.not.be.ok;
        });
    });

    describe('nodesAreAdjacent', function() {
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(0, 1, 0)
        );
        threeGeometry.faces.push(
            new THREE.Face3(0, 1, 2)
        );
        var geometry = new FemGeometry(
            threeGeometry,
            []
        ); 

        it('Should return true for two adjacent nodes', function() {
            expect(geometry.nodesAreAdjacent(1, 2)).to.be.ok;
            expect(geometry.nodesAreAdjacent(2, 1)).to.be.ok;
        });
        
        it('should return false for two non-adjacent nodes', function() {
            expect(geometry.nodesAreAdjacent(3, 0)).to.not.be.ok;
        });
    });

    describe('sharedAdjacentVertices', function() {
        it('should be able to return shared vertices based on the faces on the internal geometry', function() {
            var threeGeometry = new THREE.Geometry();
            threeGeometry.vertices.push(
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1, 1, 1),
                new THREE.Vector3(0, 1, 0)
            );
            threeGeometry.faces.push(
                new THREE.Face3(0, 1, 2),
                new THREE.Face3(0, 2, 3),
                new THREE.Face3(0, 2, 1) // add a duplicate face, so we know we uniq out doubles
            );
            var geometry = new FemGeometry(threeGeometry, []); 

            var results = geometry.sharedAdjacentVertices(0, 2);
            results.sort();

            expect(results).to.have.members([1, 3]);
        });
    });

    describe('trianglesAttachedToNode', function() {
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0)
        );
        threeGeometry.faces.push(
            new THREE.Face3(0, 1, 2)
        );
        var geometry = new FemGeometry(threeGeometry, []);

        it('should orient the requested node if it is the first in the face list', function() {
            var result = geometry.trianglesAttachedToNode(0);
            expect(result.length).to.equal(1);
            expect(result[0].length).to.equal(3);

            var point = result[0][0];
            expect(point.x).to.be.closeTo(0, 0.001);
            expect(point.y).to.be.closeTo(0, 0.001);
        });

        it('should orient the requested node if is the second in the face list', function() {
            var result = geometry.trianglesAttachedToNode(1);
            expect(result.length).to.equal(1);
            expect(result[0].length).to.equal(3);

            var point = result[0][0];
            expect(point.x).to.be.closeTo(1, 0.001);
            expect(point.y).to.be.closeTo(0, 0.001);
        });

        it('should orient the requested node if it is the last in the face list', function() {
            var result = geometry.trianglesAttachedToNode(2);
            expect(result.length).to.equal(1);
            expect(result[0].length).to.equal(3);

            var point = result[0][0];
            expect(point.x).to.be.closeTo(0, 0.001);
            expect(point.y).to.be.closeTo(1, 0.001);
        });
    });
});
