var expect = require('chai').expect;
var scale = require('../../js/util/scale.js');

describe('scale', function() {
    it('should be a function', function() {
        expect(scale).to.be.instanceOf(Function);
    });

    it('should scale vectors by a constant', function() {
        var V = [1, 2, 3];
        expect(scale(V, 2)).to.deep.equal([2, 4, 6]);
    });

    it('should scale matrices correctly', function() {
        var M = [ [1, 2], [3, 4] ];
        expect(scale(M, 2)).to.deep.equal([ [2, 4], [6, 8] ]);
    });
});
