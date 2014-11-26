
var StiffnessMatrixCalculator = function(femGeometry) {
    this.geometry = femGeometry;
};

StiffnessMatrixCalculator.prototype.singleTriangleInnerProduct = function(points, weightedPoints) {
    return 0;
};

module.exports = StiffnessMatrixCalculator;
