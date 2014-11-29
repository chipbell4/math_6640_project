
var FMatrixCalculator = function(femGeometry, weight) {
    this.geometry = femGeometry;
    this.weight = weight;
};

FMatrixCalculator.prototype.weightForClickAtNode = function(clickLocation, node) {
    if(this.geometry.isBoundaryNode(node)) {
        return 0;
    }

    node = this.geometry.threeGeometry.vertices[node];
    return this.weight / (node.distanceToSquared(clickLocation) + 1);
};

FMatrixCalculator.prototype.buildMatrix = function(clickLocation) {
    var N = this.geometry.threeGeometry.vertices.length;

    var F = [];
    for(var i = 0; i < N; i++) {
        F.push(this.weightForClickAtNode(clickLocation, i));
    }

    return F;
};

module.exports = FMatrixCalculator;
