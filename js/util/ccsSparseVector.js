var numeric = require('numeric');

var ccsSparseVector = function(vector) {
    // first, convert to a matrix (still a column vector though)
    var sparse = numeric.ccsSparse([ vector ]);

    if(sparse[1].length === 0) {
        sparse[1] = [0];
    }

    if(sparse[2].length === 0) {
        sparse[2] = [0];
    }

    return sparse;
};

module.exports = ccsSparseVector;
