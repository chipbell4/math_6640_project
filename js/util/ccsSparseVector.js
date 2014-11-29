var numeric = require('numeric');

var ccsSparseVector = function(vector) {
    // first, convert to a matrix (still a column vector though)
    return numeric.ccsSparse(vector.map(function(element) {
        return [element];
    }));
};

module.exports = ccsSparseVector;
