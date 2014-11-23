var expect = require('chai').expect;
var THREE = require('three');
var TSC = require('../../js/Fem/TriangleStiffnessCalculator.js');

var expectVectorEquals = function(v1, v2) {
    expect(v1.x).to.be.closeTo(v2.x, 0.001);
    expect(v1.y).to.be.closeTo(v2.y, 0.001);
};

describe('TSC', function() {
    it('should exist', function() {
        expect(TSC).to.be.instanceOf(Object);
    });

    describe('calculateStiffness', function() {
        it('should exist', function() {
            expect(TSC.calculateStiffness).to.be.instanceOf(Function);
        });
    });

    describe('buildUnitTriangleTransformToPoints', function() {
        it('should exist', function() {
            expect(TSC.buildUnitTriangleTransformToPoints).to.be.instanceOf(Function);
        });
        
        var p1 = new THREE.Vector3(10, 11, 1);
        var p2 = new THREE.Vector3(12, 13, 1);
        var p3 = new THREE.Vector3(8, 13, 1);

        it('should transform points correctly', function() {

            var transform = TSC.buildUnitTriangleTransformToPoints(p1, p2, p3);
            console.log(transform);

            // make sure the points are transformed correctly
            expect(numeric.dot(transform, [0, 0, 1])).to.deep.equal(TSC.to2DNumericHomogeneousVector(p1));
            expect(numeric.dot(transform, [1, 0, 1])).to.deep.equal(TSC.to2DNumericHomogeneousVector(p2));
            expect(numeric.dot(transform, [1, 1, 1])).to.deep.equal(TSC.to2DNumericHomogeneousVector(p3));
        });
    });

    describe('to2DNumericHomogeneousVector', function() {
        it('should be able to transform', function() {
            expect(TSC.to2DNumericHomogeneousVector).to.be.instanceOf(Function);

            var result;

            var twoDPoint = new THREE.Vector2(1, 2);
            result = TSC.to2DNumericHomogeneousVector(twoDPoint); 
            expect(result).to.deep.equal([1, 2, 1]);

            var threeDPoint = new THREE.Vector3(1, 2, 3);
            result = TSC.to2DNumericHomogeneousVector(threeDPoint); 
            expect(result).to.deep.equal([1, 2, 1]);
        });
    });
});
