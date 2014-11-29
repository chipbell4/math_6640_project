var expect = require('chai').expect;
var numeric = require('numeric');
var ccsFullVector = require('../../js/util/ccsFullVector.js');

describe('ccsFullVector', function() {
    it('should work', function() {
        var sparseColumn = numeric.ccsSparse([ [1, 2, 3] ]);
        expect(ccsFullVector(sparseColumn)).to.deep.equal([1, 2, 3]);
    });
    
    it('should work with the zero vector', function() {
        var sparseColumn = numeric.ccsSparse([ [0, 0, 0] ]);
        console.log(sparseColumn);
        expect(ccsFullVector(sparseColumn)).to.deep.equal([0, 0, 0]);
    });
});
