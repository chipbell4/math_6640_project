var _ = require('underscore');

/**
 * A wrapper class for the THREE geometry class that provides "mesh"-like capabilities, such as adjacency tests.
 */
var FemGeometry = function(threeGeometry, boundaryNodes) {
    this.threeGeometry = threeGeometry;
    this.boundaryNodes = boundaryNodes;

    this.rebuildAdjacencyList();
};

/**
 * Builds an array of all nodes connected to a given node on a particular face. If the node provided is not on the
 * face, the method returns an empty array.
 */
var attachedNodesToNodeAtFace = function(nodeIndex, face) {
    // check if the face is simply not connected to the node
    if(face.a != nodeIndex && face.b != nodeIndex && face.c != nodeIndex) {
        return [];
    }

    // return all other nodes of the face that aren't the passed node
    var adjacent = [face.a, face.b, face.c];
    return adjacent.filter(function(value) {
        return value != nodeIndex;
    });
};

/**
 * Returns all nodes adjacent to a particular node by examining the geometries face array
 */
FemGeometry.prototype.calculateAdjacentNodesTo = function(nodeIndex) {
    var adjacentNodes = [];

    var faceCount = this.threeGeometry.faces.length;
    for(var i=0; i < faceCount; i++) {
        // push all adjacent at once
        Array.prototype.push.apply(
            adjacentNodes,
            attachedNodesToNodeAtFace(nodeIndex, this.threeGeometry.faces[i])
        );
    }

    return _.uniq(adjacentNodes);
};

/**
 * Rebuilds the adjacency list for the mesh
 */
FemGeometry.prototype.rebuildAdjacencyList = function() {
    this.adjacency = [];
    var vertexCount = this.threeGeometry.vertices.length;

    for(var i = 0; i < vertexCount; i++) {
        this.adjacency[i] = this.calculateAdjacentNodesTo(i);
    }
};

/**
 * Returns true if the provided node is a boundary node
 */
FemGeometry.prototype.isBoundaryNode = function(nodeIndex) {
    return this.boundaryNodes.indexOf(nodeIndex) != -1;
};

/**
 * Returns a list of the shared adjacent nodes between two nodes
 */
FemGeometry.prototype.sharedAdjacentVertices = function(firstNode, secondNode) {
    return _.intersection(this.adjacency[firstNode], this.adjacency[secondNode]);
};

/**
 * Returns true if two nodes are adjacent. Otherwise, returns false
 */
FemGeometry.prototype.nodesAreAdjacent = function(firstNode, secondNode) {
    return this.adjacency[firstNode].indexOf(secondNode) != -1;
};

module.exports = FemGeometry;
