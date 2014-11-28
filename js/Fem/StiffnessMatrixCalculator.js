var THREE = require('three');
var PartialBasisFunction = require('./PartialBasisFunction.js');

/**
 * A class for building the stiffness matrix for a mesh
 */
var StiffnessMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

/**
 * Calculates the area of a triangle
 */
var triangleArea = function(points) {
    var side1 = points[1].clone().sub(points[0]);
    var side2 = points[2].clone().sub(points[0]);

    var areaVector = new THREE.Vector3();
    areaVector.crossVectors(side1, side2);

    return areaVector.length() / 2;
};

/**
 * Calculates the gradient of a basis function
 */
var basisFunctionGradient = function(points, weightedIndex) {
    points.forEach(function(point) {
        point.z = 0;
    });
    points[weightedIndex].z = 1;

    var basisFunction = new PartialBasisFunction(points[0], points[1], points[2]);

    return new THREE.Vector2(basisFunction.A, basisFunction.B);
};

/**
 * Calculates the gradient inner product over a triangle, given as indices
 */
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

    return gradient1.dot(gradient2) * area;
};

/**
 * Calculates the stiffness between two nodes
 */
StiffnessMatrixCalculator.prototype.stiffnessBetweenNodes = function(i, j) {
    if(this.geometry.isBoundaryNode(i) || this.geometry.isBoundaryNode(j)) {
        return 0;
    }

    var that = this;
    if(i == j) {
        return this.geometry.trianglesAttachedToNodeAsIndices(i).reduce(function(carry, triangle) {
            return carry + that.singleTriangleInnerProduct(triangle, [0, 0]);
        }, 0);
    }

    return this.geometry.sharedTriangleIndices(i, j).reduce(function(carry, triangle) {
        return carry + that.singleTriangleInnerProduct(triangle, [0, 1]);
    }, 0);
};

/**
 * Actually builds the stiffness matrix
 */
StiffnessMatrixCalculator.prototype.buildMatrix = function() {
    var N = this.geometry.threeGeometry.vertices.length;
    var matrix = Array(N);

    var i, j;
    for(i = 0; i < N; i++) {
        matrix[i] = Array(N);
    }

    // fill in the entries
    for(i = 0; i < N; i++) {
        for(j = i; j < N; j++) {
            matrix[i][j] = this.stiffnessBetweenNodes(i, j);
        }

        for(j = 0; j < i; j++) {
            matrix[i][j] = matrix[j][i];
        }
    }

    return matrix;
}

module.exports = StiffnessMatrixCalculator;
