var expect = require('chai').expect;
var numeric = require('numeric');
var ccsSparseVector = require('../../js/util/ccsSparseVector.js');

describe('ccsSparseVector', function() {
    it('should work', function() {
        var V = [1, 2, 3];
        var sparse = ccsSparseVector(V);
        expect(sparse[2]).to.deep.equal(V);
        
        // make sure that "un-sparsing" works okay
        numeric.ccsFull(sparse);
    });

    it('should convert the zero vector ok', function() {
        var V = [0, 0, 0];
        var sparse = ccsSparseVector(V);
        expect(sparse[1].length).to.not.equal(0);
        expect(sparse[2].length).to.not.equal(0);
    });
});
