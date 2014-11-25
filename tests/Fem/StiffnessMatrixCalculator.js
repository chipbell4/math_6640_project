var expect = require('chai').expect;
var THREE = require('three');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var StiffnessMatrixCalculator = require('../../js/Fem/StiffnessMatrixCalculator.js');

describe('StiffnessMatrixCalculator', function() {
    it('Should exist', function() {
        expect(StiffnessMatrixCalculator).to.be.instanceOf(Function);
    });
});
