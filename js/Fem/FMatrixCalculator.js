
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

FMatrixCalculator.prototype.buildMatrix = function(clickLocation) {
    var N = this.geometry.internalNodes.length;

    var F = [];
    for(var i = 0; i < N; i++) {
        var node = this.geometry.internalNodes[i];
        F.push(this.weightForClickAtNode(clickLocation, node));
    }

    return F;
};

module.exports = FMatrixCalculator;
