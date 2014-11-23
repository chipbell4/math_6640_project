var numeric = require('numeric');

/**
 * A class representing a section of the piece-wise linear basis function of H^1 over our domain.
 * This is essentially a plane class
 */
var PartialBasisFunction = function(p1, p2, p3) {
    // solve for the A, B, and C of the plane
    var coefficients = [
        [ p1.x, p1.y, 1],
        [ p2.x, p2.y, 1],
        [ p3.x, p3.y, 1],
    ];
    var result = [ p1.z, p2.z, p3.z ];

    var planeCoefficients = numeric.solve(coefficients, result);
    this.A = planeCoefficients[0];
    this.B = planeCoefficients[1];
    this.C = planeCoefficients[2];
};

/**
 * Calculates the value of the plane a given point. Returns a copied vector of the passed vector,
 * with the z property set to the correct value
 */
PartialBasisFunction.prototype.at = function(vector) {
    var z = this.A * vector.x + this.B * vector.y + this.C;
    var asVector = vector.clone();
    asVector.z = z;
    return asVector;
};

module.exports = PartialBasisFunction;
