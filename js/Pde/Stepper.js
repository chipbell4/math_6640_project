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
    return new FMatrixCalculator(this.geometry, 0.1).buildMatrix(mouseClickLocation); 
};

Stepper.prototype.globalScaleFactor = function(deltaT) {
    var inverse = (1 / deltaT / deltaT) + (this.dampingCoefficient / 2 / deltaT);
    return 1 / inverse;
};

Stepper.prototype.currentStateScaleTerm = function(deltaT) {
    var scaledMassMatrix = N.ccsScale(this.massMatrix, 2 / deltaT / deltaT);
    var scaledStiffnessMatrix = N.ccsScale(this.stiffnessMatrix, -this.waveSpeed * this.waveSpeed);
    return N.ccsadd(scaledMassMatrix, scaledStiffnessMatrix);
};

Stepper.prototype.previousStateScaleTerm = function(deltaT) {
    var scaleFactor = (1 / deltaT / deltaT) - (this.dampingCoefficient / (2 * deltaT));
    return N.ccsScale(this.massMatrix, -scaleFactor);
};

Stepper.prototype.currentStateTerm = function(deltaT) {
    var scaleTerm = this.currentStateScaleTerm(deltaT);
    var sparseCurrentState = N.ccsSparseVector(this.currentWavePosition);
    var currentTerm = N.ccsDot(scaleTerm, sparseCurrentState);
    return N.ccsFixVector(currentTerm, this.geometry.internalNodes.length);
};

Stepper.prototype.previousStateTerm = function(deltaT) {
    var scaleTerm = this.previousStateScaleTerm(deltaT);
    var sparsePreviousState = N.ccsSparseVector(this.previousWavePosition);
    var previousTerm = N.ccsDot(scaleTerm, sparsePreviousState);
    return N.ccsFixVector(previousTerm, this.geometry.internalNodes.length);
};

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var F = N.ccsSparseVector(this.resolveF(mouseClickLocation));
    var currentTerm = this.currentStateTerm(deltaT);
    var previousTerm = this.previousStateTerm(deltaT);

    var solved = N.ccsLUPSolve(
        this.massLUP,
        N.ccsFullVector(N.ccsScale(currentTerm, this.globalScaleFactor(deltaT)))
    );

    // calculate the right side to solve
    var rightHandSide = N.ccsadd(currentTerm, previousTerm);
    rightHandSide = N.ccsadd(rightHandSide, F);
    rightHandSide = N.ccsScale(rightHandSide, this.globalScaleFactor(deltaT));

    // now solve for the next timestep
    var nextWavePosition = N.ccsLUPSolve(this.massLUP, N.ccsFullVector(rightHandSide));

    this.previousWavePosition = this.currentWavePosition;
    this.currentWavePosition = nextWavePosition;
    return this.currentWavePosition;
};

module.exports = Stepper;
