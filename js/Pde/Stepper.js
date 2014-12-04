var N = require('numeric');
N.scale = require('../util/scale.js');
N.ccsScale = require('../util/ccsScale.js');
N.ccsSparseVector = require('../util/ccsSparseVector.js');
N.ccsFullVector = require('../util/ccsFullVector.js');
N.ccsFixVector = require('../util/ccsFixVector.js');
var FMatrixCalculator = require('../Fem/FMatrixCalculator.js');
var StiffnessMatrixCalculator = require('../Fem/StiffnessMatrixCalculator.js');
var MassMatrixCalculator = require('../Fem/MassMatrixCalculator.js');

var Stepper = function(femGeometry, dampingCoefficient, waveSpeed) {
    this.geometry = femGeometry;
    this.massMatrix = N.ccsSparse(new MassMatrixCalculator(femGeometry).buildMatrix());
    this.stiffnessMatrix = N.ccsSparse(new StiffnessMatrixCalculator(femGeometry).buildMatrix());
    this.dampingCoefficient = dampingCoefficient;
    this.waveSpeed = waveSpeed;
    this.currentWavePosition = this.zeroVector();
    this.previousWavePosition = this.zeroVector();

    // precalculate some values needed in the calculation
    this.massLUP = N.ccsLUP(this.massMatrix);
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
    return new FMatrixCalculator(this.geometry, 0.01).buildMatrix(mouseClickLocation); 
};

Stepper.prototype.currentWaveTerm = function(deltaT) {
    var scaleFactor = 4 / (2 + this.dampingCoefficient * deltaT);
    var sparseCurrentPosition = N.ccsSparseVector(this.currentWavePosition);
    return N.ccsScale(sparseCurrentPosition, scaleFactor);
};

Stepper.prototype.currentDiffusionTerm = function(deltaT) {
    var sparseCurrentPosition = N.ccsSparseVector(this.currentWavePosition);
    var rhs = N.ccsScale(
        N.ccsDot(this.stiffnessMatrix, sparseCurrentPosition),
        - 2 * this.waveSpeed * this.waveSpeed / (2 + this.dampingCoefficient * deltaT)
    );

    var fullResult = N.ccsLUPSolve(this.massLUP, N.ccsFullVector(rhs));
    return N.ccsSparseVector(fullResult);
};

Stepper.prototype.previousTerm = function(deltaT) {
    return N.ccsScale(
        N.ccsSparseVector(this.previousWavePosition),
        -(2 - this.dampingCoefficient * deltaT) / (2 + this.dampingCoefficient * deltaT)
    );
};

Stepper.prototype.fTerm = function(deltaT, F) {
    var sparseF = N.ccsSparseVector(F);
    return N.ccsScale(sparseF, 2 * deltaT * deltaT / (2 + this.dampingCoefficient * deltaT));
};

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var currentWaveTerm = this.currentWaveTerm(deltaT);
    var currentDiffusionTerm = this.currentDiffusionTerm(deltaT);
    var previousTerm = this.previousTerm(deltaT);
    var fTerm = this.fTerm(deltaT, this.resolveF(mouseClickLocation));

    // now solve for the next timestep
    var nextWavePosition = N.ccsadd(currentWaveTerm, currentDiffusionTerm);
    nextWavePosition = N.ccsadd(nextWavePosition, previousTerm);
    nextWavePosition = N.ccsadd(nextWavePosition, fTerm);
    nextWavePosition = N.ccsFullVector(nextWavePosition);

    this.previousWavePosition = this.currentWavePosition;
    this.currentWavePosition = nextWavePosition;
    return this.currentWavePosition;
};

module.exports = Stepper;
