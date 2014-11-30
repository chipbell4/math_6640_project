var _ = require('underscore');
var TMC = require('./TriangleMassCalculator.js');

/**
 * Represents a class for generating the matrix of inner products of basis functions over our domain
 */
var MassMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

/**
 * Returns true if the inner product between two nodes is trivially 0
 */
MassMatrixCalculator.prototype.innerProductTriviallyZero = function(i, j) {
    if(i == j) {
        return this.geometry.isBoundaryNode(i);
    }

    return this.geometry.isBoundaryNode(i) || 
        this.geometry.isBoundaryNode(j) ||
        !this.geometry.nodesAreAdjacent(i, j);
};

/**
 * Calculates the inner product between two adjacent nodes, no assumptions
 */
MassMatrixCalculator.prototype.massBetweenDifferentAdjacentNodes = function(i, j) {
    return this.geometry.sharedTriangles(i, j).reduce(function(carry, triangle) {
        return carry + TMC.singleTriangleInnerProduct(triangle, [0, 1]);
    }, 0);
};

/**
 * Calculates the inner product of basis function with itself.
 */
MassMatrixCalculator.prototype.squaredMassForNode = function(i) {
    return this.geometry.trianglesAttachedToNode(i).reduce(function(carry, triangle) {
        return carry + TMC.singleTriangleInnerProduct(triangle, [0, 0]);
    }, 0);
};

/**
 * Calculates the mass between two nodes i and j.
 */
MassMatrixCalculator.prototype.massBetweenNodes = function(i, j) {
    if(this.innerProductTriviallyZero(i, j)) {
        return 0;
    }
    
    if(i == j) {
        return this.squaredMassForNode(i);
    }

    return this.massBetweenDifferentAdjacentNodes(i, j);
};

/**
 * Builds the actual mass matrix
 */
MassMatrixCalculator.prototype.buildMatrix = function() {
    var i, j;

    // stub out the matrix
    var N = this.geometry.internalNodes.length;
    var matrix = Array(N);
    for(i = 0; i < N; i++) {
        matrix[i] = Array(N);
    }

    // now build the mass matrix...
    for(i = 0; i < N; i++) {
        for(j = i; j < N; j++) {
            matrix[i][j] = this.massBetweenNodes(
                this.geometry.internalNodes[i],
                this.geometry.internalNodes[j]
            );
        }
        
        // save ourselves some work, by taking advantage of symmetry
        for(j = 0; j < i; j++) {
            matrix[i][j] = matrix[j][i];
        }
    }

    return matrix;
};

module.exports = MassMatrixCalculator;
