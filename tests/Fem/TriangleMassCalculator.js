var expect = require('chai').expect;
var THREE = require('three');
var TMC = require('../../js/Fem/TriangleMassCalculator.js');
var numeric = require('numeric');

var expectVectorEquals = function(v1, v2) {
    expect(v1.x).to.be.closeTo(v2.x, 0.001);
    expect(v1.y).to.be.closeTo(v2.y, 0.001);
};

describe('TMC', function() {
    it('should exist', function() {
        expect(TMC).to.be.instanceOf(Object);
    });

    describe('singleTriangleInnerProduct', function() {
        it('should calculate the value, when there is no scaling', function() {
            var p1 = new THREE.Vector3(0, 0, 0);
            var p2 = new THREE.Vector3(1, 0, 0);
            var p3 = new THREE.Vector3(1, 1, 0);

            var points = [p1, p2, p3];
            expect(TMC.twoNodeInnerProduct(points)).to.be.closeTo(1 / 24, 0.0001);
        });

        it('should calculate the value, when there is scaling', function() {
            var p1 = new THREE.Vector3(0, 0, 0);
            var p2 = new THREE.Vector3(3, 2, 0);
            var p3 = new THREE.Vector3(3, 0, 0);

            var points = [p1, p2, p3];
            expect(TMC.twoNodeInnerProduct(points)).to.be.closeTo(1 / 4, 0.0001);
        });

        it('should calculate the inner product when the nodes are shared', function() {
            var p1 = new THREE.Vector3(0, 0, 0);
            var p2 = new THREE.Vector3(1, 0, 0);
            var p3 = new THREE.Vector3(1, 1, 0);

            var points = [p1, p2, p3];
            expect(TMC.oneNodeInnerProduct(points)).to.be.closeTo(1 / 12, 0.0001);
        });
    });
});
