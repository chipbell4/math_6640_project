var expect = require('chai').expect;
var THREE = require('three');
var PartialBasisFunction = require('../../js/Fem/PartialBasisFunction.js');

describe('PartialBasisFunction', function() {
    it('should exist', function() {
        expect(PartialBasisFunction).to.be.instanceOf(Function);
    });
            
    var p1 = new THREE.Vector3(0, 0, 1);
    var p2 = new THREE.Vector3(1, 0, 0);
    var p3 = new THREE.Vector3(0, 1, 0);

    var basisFunction = new PartialBasisFunction(p1, p2, p3);

    describe('at', function() {
        it('should be able to calculate the value at each of its points as a vector', function() {
            expect(basisFunction.at(p1).z).to.be.closeTo(p1.z, 0.001);
            expect(basisFunction.at(p2).z).to.be.closeTo(p2.z, 0.001);
            expect(basisFunction.at(p3).z).to.be.closeTo(p3.z, 0.001);
            
            var outsideVector = new THREE.Vector3(1, 1, 0);
            expect(basisFunction.at(outsideVector).z).to.be.closeTo(-1, 0.001);
        });
    });
});
