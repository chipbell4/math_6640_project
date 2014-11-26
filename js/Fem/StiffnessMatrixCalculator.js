var THREE = require('three');
var PartialBasisFunction = require('./PartialBasisFunction.js');

var StiffnessMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

var triangleArea = function(points) {
    var side1 = points[1].sub(points[0]);
    var side2 = points[2].sub(points[0]);

    var areaVector = new THREE.Vector3();
    areaVector.crossVectors(side1, side2);

    return areaVector.length() / 2;
};

var buildBasisFunctionWithAWeightedPoint = function(points, weightedIndex) {
    points.forEach(function(point) {
        point.z = 0;
    });
    points[weightedIndex] = 1;

    return new PartialBasisFunction(points[0], points[1], points[2]);
};

var basisFunctionGradient = function(basisFunction) {
    return new THREE.Vector2(basisFunction.A, basisFunction.B);
};

StiffnessMatrixCalculator.prototype.singleTriangleInnerProduct = function(points, weightedPoints) {
    points = points.map(function(pointIndex) {
        return this.geometry.threeGeometry.vertices[pointIndex];
    });

    // calculate the triangle area
    var area = triangleArea(points);

    // calculate the basis function
    var basis1 = buildBasisFunctionWithAWeightedPoint(points, weightedPoints[0]);
    var basis2 = buildBasisFunctionWithAWeightedPoint(points, weightedPoints[1]);

    // calculate the gradients
    var gradient1 = basisFunctionGradient(basis1);
    var gradient2 = basisFunctionGradient(basis2);

    return gradient1.dot(gradient2) * area;
};

module.exports = StiffnessMatrixCalculator;
