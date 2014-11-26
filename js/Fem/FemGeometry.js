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
 * Function generator for determining if a passed face has a node (used for array filters)
 */
var faceHasNode = function(node) {
    return function(face) {
        return face.a == node || face.b == node || face.c == node;
    };
};

/**
 * Converts a face to an array of node indices
 */
var faceToArray = function(face) {
    return [face.a, face.b, face.c];
};

/**
 * Converts a node index to the vertex at that index
 */
var indicesToNodes = function(nodeIndex) {
    return this.threeGeometry.vertices[nodeIndex];
};

/**
 * Returns a list of the shared adjacent nodes between two nodes
 */
FemGeometry.prototype.sharedAdjacentVertices = function(firstNode, secondNode) {
    // filter out only faces that have both nodes in them
    var nodes = this.threeGeometry.faces.filter(faceHasNode(firstNode))
        .filter(faceHasNode(secondNode))
        // convert the face to an array
        .map(faceToArray)
        // flatten: [ [1,2], [3,4] ] => [1, 2, 3, 4]
        .reduce(function(carry, faceArray) {
            Array.prototype.push.apply(carry, faceArray);
            return carry;
        }, [])
        // don't include the passed nodes, since we "assume" they're there
        .filter(function(index) {
            return index != firstNode && index != secondNode;
        });

    // remove dupes
    return _.unique(nodes);
};

/**
 * Returns true if two nodes are adjacent. Otherwise, returns false
 */
FemGeometry.prototype.nodesAreAdjacent = function(firstNode, secondNode) {
    return this.adjacency[firstNode].indexOf(secondNode) != -1;
};

/**
 * Returns all of the triangles (as an array of arrays of vectors) attached to a particular node
 */
FemGeometry.prototype.trianglesAttachedToNode = function(node) {
    var that = this;
    
    return this.threeGeometry.faces.filter(faceHasNode(node))
        .map(faceToArray)
        .map(function(faceArray) {
            return faceArray.sort(function(a, b) {
                if(a == node) {
                    return -1;
                }
                else if(b == node) {
                    return 1;
                }
                return 0;    
            });
        }).map(function(faceArray) {
            return faceArray.map(indicesToNodes.bind(that));
        });
};

/**
 * Returns all of the triangles shared between two nodes as an array of arrays of vectors
 */
FemGeometry.prototype.sharedTriangles = function(i, j) {
    var vertexI = this.threeGeometry.vertices[i];
    var vertexJ = this.threeGeometry.vertices[j];

    var that = this;
    return this.sharedAdjacentVertices(i, j).map(function(node) {
        var vertexK = that.threeGeometry.vertices[node];
        return [vertexI, vertexJ, vertexK];
    });
};

module.exports = FemGeometry;
