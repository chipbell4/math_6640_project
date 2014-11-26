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
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 1),
            new THREE.Vector3(1, 1, 0)
        );
        threeGeometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(1, 2, 3),
            new THREE.Face3(0, 2, 1) // add a duplicate face, so we know we ignore dupes
        );
        var geometry = new FemGeometry(threeGeometry, []); 
        
        it('should return zero points if the points are not adjacent', function() {
            expect(geometry.sharedAdjacentVertices(0,3).length).to.equal(0);
        });

        it('should return 1 point if the only a single point are shared', function() {
            expect(geometry.sharedAdjacentVertices(0, 1)).to.deep.equal([2]);
        });

        it('should return 2 points if two points are shared', function() {
            expect(geometry.sharedAdjacentVertices(1, 2)).to.deep.equal([0, 3]);
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

    describe('sharedTriangles', function() {
        var threeGeometry = new THREE.Geometry();
        threeGeometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(1, 1, 0)
        );
        threeGeometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(1, 2, 3)
        );

        var geometry = new FemGeometry(threeGeometry, []);

        it('should return two triangles if the points share two triangles', function() {
            var triangles = geometry.sharedTriangles(1, 2);
            expect(triangles.length).to.equal(2);
            expect(triangles[0].length).to.equal(3);
            expect(triangles[1].length).to.equal(3);
        });

        it('should return one triangle if the points share one triangle', function() {
            var triangles = geometry.sharedTriangles(0, 2);
            expect(triangles.length).to.equal(1);
            expect(triangles[0].length).to.equal(3);
        });

        it('should return no triangles if the points share no triangles', function() {
            var triangles = geometry.sharedTriangles(0, 3);
            expect(triangles.length).to.equal(0);
        });
    });
});
