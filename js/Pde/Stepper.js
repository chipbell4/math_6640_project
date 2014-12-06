var N = require('numeric');
N.scale = require('../util/scale.js');
var FMatrixCalculator = require('../Fem/FMatrixCalculator.js');
var StiffnessMatrixCalculator = require('../Fem/StiffnessMatrixCalculator.js');
var MassMatrixCalculator = require('../Fem/MassMatrixCalculator.js');

var Stepper = function(femGeometry, dampingCoefficient, waveSpeed, clickWeight, clickTightness) {
    this.geometry = femGeometry;
    this.massMatrix = new MassMatrixCalculator(femGeometry).buildMatrix();
    this.stiffnessMatrix = new StiffnessMatrixCalculator(femGeometry).buildMatrix();
    this.dampingCoefficient = dampingCoefficient;
    this.waveSpeed = waveSpeed;
    this.clickWeight = clickWeight;
    this.clickTightness = clickTightness;
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
    return N.scale(this.currentWavePosition, 4);
};

Stepper.prototype.currentDiffusionTerm = function(deltaT) {
    var scaledStiffness = N.scale(this.stiffnessMatrix, -4 * this.waveSpeed * this.waveSpeed);
    var solved = N.LUsolve(this.massLU, N.dot(scaledStiffness, this.currentWavePosition));
    return N.scale(solved, deltaT * deltaT);
    return solved;
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

Math.sign = Math.sign || function(x) {
    if(x < 0) {
        return -1;
    }
    return 1;
};

function clampToOne(x) {
    return Math.sign(x) * Math.min(Math.abs(x), 1);
}

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var currentWaveTerm = this.currentWaveTerm(deltaT);
    var currentDiffusionTerm = this.currentDiffusionTerm(deltaT);
    var previousTerm = this.previousTerm(deltaT);
    var fTerm = this.fTerm(deltaT, this.resolveF(mouseClickLocation));

    // now solve for the next timestep
    var nextWavePosition = N.add(currentWaveTerm, N.add(currentDiffusionTerm, N.add(previousTerm, fTerm)));
    nextWavePosition = N.scale(nextWavePosition, 1 / (2 + this.dampingCoefficient * deltaT));

    console.log(N.norminf(nextWavePosition));

    this.previousWavePosition = this.currentWavePosition;
    this.currentWavePosition = nextWavePosition;//.map(clampToOne);
    return this.currentWavePosition;
};

module.exports = Stepper;
