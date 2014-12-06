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

Stepper.prototype.currentWaveTerm = function() {
    return N.scale(this.currentWavePosition, 4);
};

Stepper.prototype.currentDiffusionTerm = function(deltaT) {
    var scaledStiffness = N.scale(this.stiffnessMatrix, -2 * this.waveSpeed * this.waveSpeed);
    var solved = N.LUsolve(this.massLU, N.dot(scaledStiffness, this.currentWavePosition));
    return N.scale(solved, deltaT * deltaT);
};

Stepper.prototype.elasticityTerm = function(deltaT) {
    return N.scale(this.currentWavePosition, -2 * this.elasticity * deltaT * deltaT);
};

Stepper.prototype.previousTerm = function(deltaT) {
    return N.scale(
        this.previousWavePosition,
        this.dampingCoefficient * deltaT - 2
    );
};

Stepper.prototype.fTerm = function(deltaT, F) {
    return N.scale(F, 2 * deltaT * deltaT);
};

function clamp(x, a, b) {
    if(x < a) {
        x = a;
    }
    if(x > b) {
        x = b;
    }
    return x;
}

function clamper(a, b) {
    return function(x) {
        return clamp(x, a, b);
    };
}

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var currentWaveTerm = this.currentWaveTerm(deltaT);
    var currentDiffusionTerm = this.currentDiffusionTerm(deltaT);
    var elasticityTerm = this.elasticityTerm(deltaT);
    var previousTerm = this.previousTerm(deltaT);
    var fTerm = this.fTerm(deltaT, this.resolveF(mouseClickLocation));

    // now solve for the next timestep
    var nextWavePosition = N.add(currentWaveTerm, N.add(currentDiffusionTerm, N.add(elasticityTerm, N.add(previousTerm, fTerm))));
    nextWavePosition = N.scale(nextWavePosition, 1 / (2 + this.dampingCoefficient * deltaT));

    this.previousWavePosition = this.currentWavePosition;
    this.currentWavePosition = nextWavePosition.map(clamper(-0.1, 0.1));
    return this.currentWavePosition;
};

module.exports = Stepper;
