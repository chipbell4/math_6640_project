var TSC = require('./TriangleStiffnessCalculator.js');

var StiffnessMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

StiffnessMatrixCalculator.prototype.massBetweenNodes = function(i, j) {
    if(this.geometry.isBoundaryNode(i) || this.geometry.isBoundaryNode(j)) {
        return 0;
    }

    if(!this.geometry.nodesAreAdjacent(i, j)) {
        return 0;
    }

    // they are adjacent, sum each of the mini inner products
    var total = 0;
    var sharedNodes = this.geometry.sharedAdjacentVertices(i, i);
    var N = sharedNodes.length;

    var firstNode = this.geometry.threeGeometry.vertices[i];
    var secondNode = this.geometry.threeGeometry.vertices[j];
    for(var k = 0; k < N; k++) {
        var sharedNode = this.geometry.threeGeometry.vertices[k];
        total += TSC.singleTriangleInnerProduct(firstNode, secondNode, sharedNode);
    }
    return total;
};

StiffnessMatrixCalculator.prototype.buildMatrix = function() {
};

// TSC.singleTriangleInnerProduct(p1, p2, sharedPoint);

module.exports = StiffnessMatrixCalculator;
