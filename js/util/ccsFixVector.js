var ccsFixVector = function(vector, expectedLength) {
    if(vector[1].length == 0) {
        vector[1] = [expectedLength - 1];
    }
    return vector;
};

module.exports = ccsFixVector;
