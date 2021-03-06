var N = require('numeric');
N.scale = require('../util/scale.js');
var FMatrixCalculator = require('../Fem/FMatrixCalculator.js');
var StiffnessMatrixCalculator = require('../Fem/StiffnessMatrixCalculator.js');
var MassMatrixCalculator = require('../Fem/MassMatrixCalculator.js');

/**
 * Class implementing a stepper for a wave PDE
 *
 * Required Options:
 *     geometry: a FemGeometry instance
 * Optional options:
 *     waveSpeed, dampingCoefficient, clickWeight, clickTightness
 */
var Stepper = function(options) {
    this.geometry = options.geometry;
    this.massMatrix = new MassMatrixCalculator(options.geometry).buildMatrix();
    this.stiffnessMatrix = new StiffnessMatrixCalculator(options.geometry).buildMatrix();

    this.elasticity = options.elasticity || 0;
    this.dampingCoefficient = options.dampingCoefficient || 0;
    this.waveSpeed = options.waveSpeed || 0.3;
    this.clickWeight = options.clickWeight || 2000;
    this.clickTightness = options.clickTightness || 5000;
    this.currentWavePosition = this.zeroVector();
    this.previousWavePosition = this.zeroVector();

    // precalculate some values needed in the calculation
    this.massLU = N.LU(this.massMatrix);
};

Stepper.prototype.zeroVector = function() {
    var n = this.geometry.internalNodes.length;

    var array = [];
    for(var i = 0; i < n; i++) {
        array.push(0);
    }

    return array;
};

Stepper.prototype.resolveF = function(mouseClickLocation) {
    if(mouseClickLocation === undefined) {
        return this.zeroVector();
    }
    return new FMatrixCalculator(this.geometry, this.clickWeight, this.clickTightness).buildMatrix(mouseClickLocation); 
};

Stepper.prototype.currentWaveTerm = function(deltaT) {
    return N.scale(this.currentWavePosition, 2/deltaT - this.elasticity);
};

Stepper.prototype.currentDiffusionTerm = function() {
    var scaledStiffness = N.scale(this.stiffnessMatrix, -this.waveSpeed * this.waveSpeed);
    return N.LUsolve(this.massLU, N.dot(scaledStiffness, this.currentWavePosition));
};

Stepper.prototype.previousTerm = function(deltaT) {
    return N.scale(
        this.previousWavePosition,
        this.dampingCoefficient / (2 * deltaT) - 1 / (deltaT * deltaT)
    );
};

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var currentWaveTerm = this.currentWaveTerm(deltaT);
    var currentDiffusionTerm = this.currentDiffusionTerm(deltaT);
    var previousTerm = this.previousTerm(deltaT);
    var F = this.resolveF(mouseClickLocation);

    // now solve for the next timestep
    var nextWavePosition = N.add(currentWaveTerm, N.add(currentDiffusionTerm, N.add(previousTerm, F)));
    var scale = (1 / deltaT / deltaT) + (this.dampingCoefficient / 2 / deltaT);
    nextWavePosition = N.scale(nextWavePosition, 1 / scale);

    this.previousWavePosition = this.currentWavePosition;
    this.currentWavePosition = nextWavePosition;
    return this.currentWavePosition;
};

Stepper.prototype.calculatePreferredTimeStep = function() {
    var mInvNorm = 1 / N.norm2(this.massMatrix);
    var aNorm = N.norm2(this.stiffnessMatrix);

    var a = this.elasticity + this.waveSpeed * this.waveSpeed * mInvNorm * aNorm;
    var b = this.dampingCoefficient;
    var c = -2;

    // solve and scale up a tad, so we're above the limit
    return (-b + Math.sqrt(b*b - 4 * a * c)) / (2 * a) * 1.1;
};

module.exports = Stepper;
