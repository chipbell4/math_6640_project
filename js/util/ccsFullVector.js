var numeric = require('numeric');

var ccsFullVector = function(sparseVector) {
    // make vector full again, then un-nest arrays (so its a flat array instead of 1D matrix)
    return numeric.ccsFull(sparseVector).map(function(element) {
        return element[0];
    });
};

module.exports = ccsFullVector;
