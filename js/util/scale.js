/**
 * A "polyfill" for vector/matrix scaling (which apparently is NOT present in numeric.js :(
 */
var scale = function(vector, scaleFactor) {
    var N = vector.length;
    var scaled = [];
    for(var i = 0; i < N; i++) {
        if(vector[i] instanceof Array) {
            scaled.push(scale(vector[i], scaleFactor));
        }
        else {
            scaled.push(scaleFactor * vector[i]);
        }
    } 

    return scaled;
};

module.exports = scale;
