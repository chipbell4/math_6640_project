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

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var sparseF  = N.ccsSparseVector(this.resolveF(mouseClickLocation));

    // form the currentWavePosition scale factor
    var currentScale = N.ccsadd(
        N.ccsScale(this.massMatrix, 2 / deltaT / deltaT),
        N.ccsScale(this.stiffnessMatrix, this.waveSpeed * this.waveSpeed)
    );
    var previousScale = N.ccsScale(this.massMatrix, (2 + this.dampingCoefficient * deltaT) / (2 * deltaT));

    var sparseCurrentPosition = N.ccsSparseVector(this.currentWavePosition);
    var sparsePreviousPosition = N.ccsSparseVector(this.previousWavePosition);

    var currentTerm = N.ccsDot(currentScale, sparseCurrentPosition);
    var previousTerm = N.ccsDot(previousScale, sparsePreviousPosition);
    currentTerm = N.ccsFixVector(currentTerm, this.massMatrix.length);
    previousTerm = N.ccsFixVector(previousTerm, this.massMatrix.length);

    // calculate the right side to solve
    var rightHandSide = N.ccsadd(currentTerm, previousTerm);
    rightHandSide = N.ccsadd(rightHandSide, sparseF);
    rightHandSide = N.ccsScale(rightHandSide, 2 * deltaT * deltaT / (2 - this.dampingCoefficient * deltaT));

    // now solve for the next timestep
    var nextWavePosition = N.ccsLUPSolve(this.massLUP, N.ccsFullVector(rightHandSide));

    console.log("F");
    console.log(N.ccsFullVector(sparseF));
    console.log("MASS MATRIX");
    console.log(N.ccsFull(this.massMatrix));
    console.log("RHS");
    console.log(N.ccsFullVector(rightHandSide));
    console.log("RESULT");
    console.log(nextWavePosition);
    console.log("\n");

    this.previousWavePosition = this.currentWavePosition;
    this.currentWavePosition = nextWavePosition;
    return this.currentWavePosition;
};

module.exports = Stepper;
