var expect = require('chai').expect;
var numeric = require('numeric');
numeric.ccsScale = require('../../js/util/ccsScale.js');

describe('ccsScale', function() {
    it('should be able to scale matrix correctly', function() {
        var M = numeric.ccsSparse([ [1, 2], [3, 4] ]);
        var sparseResult = numeric.ccsScale(M, 2);
        expect(numeric.ccsFull(sparseResult)).to.deep.equal([ [2, 4], [6, 8] ]);
    });
});
