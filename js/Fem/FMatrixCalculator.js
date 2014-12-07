var range = require('range-function');

var FMatrixCalculator = function(femGeometry, weight, tightness) {
    this.geometry = femGeometry;
    this.weight = weight;
    this.tightness = tightness;
};

FMatrixCalculator.prototype.weightForClickAtNode = function(clickLocation, node) {
    if(this.geometry.isBoundaryNode(node)) {
        return 0;
    }

    node = this.geometry.threeGeometry.vertices[node];
    return this.weight / (this.tightness * node.distanceToSquared(clickLocation) + 1);
};

FMatrixCalculator.prototype.nearestNodes = function(clickLocation, nodeCount) {
    var vertices = this.geometry.threeGeometry.vertices;
    var internalNodes = this.geometry.internalNodes;
    return range(this.geometry.internalNodes.length).sort(function(a, b) {
        var nodeA = internalNodes[a];
        var nodeB = internalNodes[b];
        var nodeADistance = vertices[nodeA].distanceTo(clickLocation);
        var nodeBDistance = vertices[nodeB].distanceTo(clickLocation);
        if(nodeADistance < nodeBDistance) {
            return -1;
        }
        return 1;
    }).slice(0, nodeCount);
};

FMatrixCalculator.prototype.buildMatrix = function(clickLocation) {
    var N = this.geometry.internalNodes.length;

    var F = [];
    var nearestNodes = this.nearestNodes(clickLocation, Math.ceil(N / 10));
    for(var i = 0; i < N; i++) {
        if(nearestNodes.indexOf(i) < 0) {
            F.push(0);
        } 
        else {
            var node = this.geometry.internalNodes[i];
            F.push(this.weightForClickAtNode(clickLocation, node));
        }
    }

    return F;
};

module.exports = FMatrixCalculator;
