var numeric = require('numeric');

var ccsFullVector = function(sparseVector) {

    if(sparseVector[1].length == 0 && sparseVector[2].length == 0) {
        sparseVector[1] = [0];
        sparseVector[2] = [0];
    }

    // make vector full again, then un-nest arrays (so its a flat array instead of 1D matrix)
    return numeric.ccsFull(sparseVector)[0];
};

module.exports = ccsFullVector;
