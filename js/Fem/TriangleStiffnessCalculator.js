var numeric = require('numeric');
var PartialBasisFunction = require('./PartialBasisFunction.js');

var to2DNumericHomogeneousVector = function(vector) {
    return [vector.x, vector.y, 1];
};

var buildUnitTriangleTransformToPoints = function(p1, p2, p3) {
    var transform = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    transform[0][0] = p2.x - p1.x;
    transform[0][1] = p3.x - p2.x;
    transform[0][2] = p1.x;
    transform[1][0] = p2.y - p1.y;
    transform[1][1] = p3.y - p2.y;
    transform[1][2] = p1.y;
    transform[2][2] = 1;
    
    return transform;
};

var calculateUVPlaneCoefficientsForPoints = function(p1, p2, p3) {
    var transform = buildUnitTriangleTransformToPoints(p1, p2, p3);
    var originalPlane = new PartialBasisFunction(p1, p2, p3);
    originalPlane = [originalPlane.A, originalPlane.B, originalPlane.C];

    // transform the original plane coordinates 
    return numeric.dot(originalPlane, transform);
};

var singleTriangleInnerProduct = function(firstWeightedPoint, secondWeightedPoint, sharedPoint) {
    // build the plane that's 1 only at the first weighted point
    firstWeightedPoint.z = 1;
    secondWeightedPoint.z = 0;
    sharedPoint.z = 0;
    var firstUVPoints = calculateUVPlaneCoefficientsForPoints(firstWeightedPoint, secondWeightedPoint, sharedPoint);

    // build the plane that's 1 only at the second weighted point
    firstWeightedPoint.z = 0;
    secondWeightedPoint.z = 1;
    var secondUVPoints = calculateUVPlaneCoefficientsForPoints(firstWeightedPoint, secondWeightedPoint, sharedPoint);

    // now apply the closed form of the integral, calculated in the paper
    var A1 = firstUVPoints[0],
        B1 = firstUVPoints[1],
        C1 = firstUVPoints[2],
        A2 = secondUVPoints[0],
        B2 = secondUVPoints[1],
        C2 = secondUVPoints[2];

    var unscaledIntegral = (A1 * A2) / 4 + (B1 * B2) / 12 + (A1 * B2 + A2 * B1) / 8 +
        (A1 * C2 + A2 * C1) / 3 + (B1 * C2 + B2 * C1) / 6 + (C1 * C2) / 2;

    var coordinateTransform = buildUnitTriangleTransformToPoints(firstWeightedPoint, secondWeightedPoint, sharedPoint);
    return unscaledIntegral * Math.abs(numeric.det(coordinateTransform));
};

module.exports = {
    buildUnitTriangleTransformToPoints: buildUnitTriangleTransformToPoints,
    calculateUVPlaneCoefficientsForPoints: calculateUVPlaneCoefficientsForPoints,
    singleTriangleInnerProduct: singleTriangleInnerProduct,
    to2DNumericHomogeneousVector: to2DNumericHomogeneousVector,
};
