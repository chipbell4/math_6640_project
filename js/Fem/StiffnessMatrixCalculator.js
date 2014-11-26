var THREE = require('three');
var PartialBasisFunction = require('./PartialBasisFunction.js');

var StiffnessMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

var triangleArea = function(points) {
    var side1 = points[1].clone().sub(points[0]);
    var side2 = points[2].clone().sub(points[0]);

    var areaVector = new THREE.Vector3();
    areaVector.crossVectors(side1, side2);

    return areaVector.length() / 2;
};

var basisFunctionGradient = function(points, weightedIndex) {
    points.forEach(function(point) {
        point.z = 0;
    });
    points[weightedIndex].z = 1;

    var basisFunction = new PartialBasisFunction(points[0], points[1], points[2]);
    console.log(points);

    return new THREE.Vector2(basisFunction.A, basisFunction.B);
};

StiffnessMatrixCalculator.prototype.singleTriangleInnerProduct = function(points, weightedPoints) {
    // if any of the weighted points are boundary points
    var that = this;
    var hasBoundaryPoint = weightedPoints.some(function(node) {
        return that.geometry.boundaryNodes.indexOf(node) > -1;
    });
    if(hasBoundaryPoint) {
        return 0;
    }
    
    var vertices = this.geometry.threeGeometry.vertices;
    points = points.map(function(pointIndex) {
        return vertices[pointIndex];
    });

    // calculate the triangle area
    var area = triangleArea(points);

    // calculate the gradients
    var gradient1 = basisFunctionGradient(points, weightedPoints[0]);
    var gradient2 = basisFunctionGradient(points, weightedPoints[1]);

    console.log(gradient1);
    console.log(gradient2);
    console.log(gradient1.dot(gradient2));
    console.log(area);

    return gradient1.dot(gradient2) * area;
};

module.exports = StiffnessMatrixCalculator;
