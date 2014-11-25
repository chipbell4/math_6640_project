var numeric = require('numeric');
var PartialBasisFunction = require('./PartialBasisFunction.js');

/**
 * Converts a THREE vector into a homogeneous vector, so we can use numeric.js functions on it
 */
var to2DNumericHomogeneousVector = function(vector) {
    return [vector.x, vector.y, 1];
};

/**
 * Builds the transform matrix that translates (0,0), (0,1), and (1,1) to p1, p2, p3 respectively, using homogeneous
 * coordinates.
 */
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

/**
 * Calculates the plane passing through p1, p2, and p3, then converts the coordinates into uv triangle space, which
 * has corners at (0,0) (1,0) and (1,1).
 */
var calculateUVPlaneCoefficientsForPoints = function(p1, p2, p3) {
    var transform = buildUnitTriangleTransformToPoints(p1, p2, p3);
    var originalPlane = new PartialBasisFunction(p1, p2, p3);
    originalPlane = [originalPlane.A, originalPlane.B, originalPlane.C];

    // transform the original plane coordinates 
    return numeric.dot(originalPlane, transform);
};

/**
 * Sets all of the points to have z=0, except for point[nonzeroIndex] which will have z=1
 */
var setBasisFunctionZ = function(points, nonzeroIndex) {
    points.forEach(function(point, index) {
        point.z = (index == nonzeroIndex) ? 1 : 0;
    });
};

/**
 * Calculates the inner product over a triangle defined by the points provided, weighted at the
 * indices provided
 */
var singleTriangleInnerProduct = function(points, weightedPoints) {
    // build the plane that's 1 only at the first weighted point
    setBasisFunctionZ(points, weightedPoints[0]);
    var firstUVPoints = calculateUVPlaneCoefficientsForPoints(points[0], points[1], points[2]);

    // build the plane that's 1 only at the second weighted point
    setBasisFunctionZ(points, weightedPoints[1]);
    var secondUVPoints = calculateUVPlaneCoefficientsForPoints(points[0], points[1], points[2]);

    // now apply the closed form of the integral, calculated in the paper
    var A1 = firstUVPoints[0],
        B1 = firstUVPoints[1],
        C1 = firstUVPoints[2],
        A2 = secondUVPoints[0],
        B2 = secondUVPoints[1],
        C2 = secondUVPoints[2];

    var unscaledIntegral = (A1 * A2) / 4 + (B1 * B2) / 12 + (A1 * B2 + A2 * B1) / 8 +
        (A1 * C2 + A2 * C1) / 3 + (B1 * C2 + B2 * C1) / 6 + (C1 * C2) / 2;

    var coordinateTransform = buildUnitTriangleTransformToPoints(points[0], points[1], points[2]);
    return unscaledIntegral * Math.abs(numeric.det(coordinateTransform));
};

module.exports = {
    buildUnitTriangleTransformToPoints: buildUnitTriangleTransformToPoints,
    calculateUVPlaneCoefficientsForPoints: calculateUVPlaneCoefficientsForPoints,
    singleTriangleInnerProduct: singleTriangleInnerProduct,
    to2DNumericHomogeneousVector: to2DNumericHomogeneousVector,
};
