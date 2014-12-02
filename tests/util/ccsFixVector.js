var expect = require('chai').expect;
var numeric = require('numeric');
var ccsFixVector = require('../../js/util/ccsFixVector.js');

describe('ccsFixVector', function() {
    it('should fix vectors', function() {
        var sparseV = [ [0,0], [], [] ];
        sparseV = ccsFixVector(sparseV, 3);
        expect(numeric.ccsFull(sparseV)).to.deep.equal([[0], [0], [0]]);
    });
});
