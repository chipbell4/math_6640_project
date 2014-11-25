var TSC = require('./TriangleStiffnessCalculator.js');

/**
 * Represents a class for generating the matrix of inner products of basis functions over our domain
 */
var StiffnessMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

/**
 * Returns true if the inner product between two nodes is trivially 0
 */
StiffnessMatrixCalculator.prototype.innerProductTriviallyZero = function(i, j) {
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
StiffnessMatrixCalculator.prototype.massBetweenDifferentAdjacentNodes = function(i, j) {
    var total = 0;
    var sharedNodes = this.geometry.sharedAdjacentVertices(i, j);
    var N = sharedNodes.length;

    var firstNode = this.geometry.threeGeometry.vertices[i];
    var secondNode = this.geometry.threeGeometry.vertices[j];
    for(var k = 0; k < N; k++) {
        var sharedNode = this.geometry.threeGeometry.vertices[sharedNodes[k]];
        total += TSC.singleTriangleInnerProduct([firstNode, secondNode, sharedNode], [0, 1]);
    }
    return total;
};

/**
 * Extracts an array of vertex indices from a face, shifting the provided node (if its in the face) to the front
 */
var extractTriangleFromFace = function(face, firstNode) {
    var nodes = [face.a, face.b, face.c];

    return nodes.sort(function(node1, node2) {
        if(node1 == firstNode) {
            return -1;
        }
        if(node2 == firstNode) {
            return 1;
        }
        return 0;
    });
};

/**
 * Calculates the inner product of basis function with itself.
 */
StiffnessMatrixCalculator.prototype.squaredMassForNode = function(i) {
    var that = this;
    // get only the faces that node i is in
    return this.geometry.threeGeometry.faces.filter(function(face) {
        return face.a == i || face.b == i || face.c == i;
    })
    // map that to an array of vertex indices
    .map(function(face) {
        return extractTriangleFromFace(face, i);
    })
    // map to actual triangle values
    .map(function(triangleVertices) {
        return triangleVertices.map(function(index) {
            return that.geometry.threeGeometry.vertices[index];
        });
    })
    // calculate the integral over the triangle
    .map(function(triangleVertices) {
        return TSC.singleTriangleInnerProduct(triangleVertices, [0, 0]);
    })
    // sum up the result
    .reduce(function(carry, currentValue) {
        return carry + currentValue;
    }, 0);
};

/**
 * Calculates the mass between two nodes i and j.
 */
StiffnessMatrixCalculator.prototype.massBetweenNodes = function(i, j) {
    if(this.innerProductTriviallyZero(i, j)) {
        return 0;
    }
    
    if(i == j) {
        return this.squaredMassForNode(i);
    }

    return this.massBetweenDifferentAdjacentNodes(i, j);
};

/**
 * Builds the actual stiffness matrix
 */
StiffnessMatrixCalculator.prototype.buildMatrix = function() {
    // build an empty array
    var i, j, N = this.geometry.threeGeometry.vertices.length;
    var matrix = Array(N);
    for(i = 0; i < N; i++) {
        matrix[i] = Array(N);
    }

    // now build the mass matrix...
    for(i = 0; i < N; i++) {
        // save ourselves some work, by taking advantage of symmetry
        for(j = i; j < N; j++) {
            matrix[i][j] = this.massBetweenNodes(i, j);
        }
        for(j = 0; j < i; j++) {
            matrix[i][j] = matrix[j][i];
        }
    }

    return matrix;
};

module.exports = StiffnessMatrixCalculator;
