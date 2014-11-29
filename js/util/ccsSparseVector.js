var numeric = require('numeric');

var isZeroVector = function(vector) {
    return vector.every(function(element) {
        return element === 0;
    });
};

var ccsSparseVector = function(vector) {
    if(isZeroVector(vector)) {
        // this is sort of a workaround to numeric's zero-vector bug (that'll probably never be patched)
        return [ [0, 1], [vector.length - 1], [0] ];
    }

    return numeric.ccsSparse(vector.map(function(element) {
        return [element];
    })); 
};

module.exports = ccsSparseVector;
