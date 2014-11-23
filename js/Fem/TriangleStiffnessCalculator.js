var numeric = require('numeric');

var to2DNumericHomogeneousVector = function(vector) {
    return [vector.x, vector.y, 1];
};

var from2DNumericHomogeneousVector = function(vector) {
    return new THREE.Vector2(vector[0], vector[1]);
};

var buildUnitTriangleTransformToPoints = function(p1, p2, p3) {
    var transform = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    transform[0][0] = p2.x - p1.x;
    transform[0][1] = p1.x - p2.x + p3.x;
    transform[0][2] = p1.x;
    transform[1][0] = p2.y - p1.y;
    transform[1][1] = p1.y - p2.y + p3.y;
    transform[1][2] = p1.y;
    transform[2][2] = 1;
    
    return transform;
};

var calculateStiffness = function() {
};

module.exports = {
    buildUnitTriangleTransformToPoints: buildUnitTriangleTransformToPoints,
    calculateStiffness: calculateStiffness,
    to2DNumericHomogeneousVector: to2DNumericHomogeneousVector,
};
