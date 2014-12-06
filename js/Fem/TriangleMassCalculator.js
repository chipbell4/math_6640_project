var doubleTriangleArea = function(triangle) {
    var firstSide = triangle[1].clone().sub(triangle[0]);
    var secondSide = triangle[2].clone().sub(triangle[0]);
    return firstSide.cross(secondSide).length();
};

/**
 * Calculates the mass inner product where two different nodes are weighted
 */
var twoNodeInnerProduct = function(triangle) {
    return doubleTriangleArea(triangle) / 24;
};

/**
 * Calculates the mass inner product where a single node is weighted twice
 */
var oneNodeInnerProduct = function(triangle) {
    return doubleTriangleArea(triangle) / 12;
};


module.exports = {
    twoNodeInnerProduct: twoNodeInnerProduct,
    oneNodeInnerProduct: oneNodeInnerProduct
};
