var N = require('numeric');
N.scale = require('../util/scale.js');
N.ccsScale = require('../util/ccsScale.js');
var FMatrixCalculator = require('../Fem/FMatrixCalculator.js');
var StiffnessMatrixCalculator = require('../Fem/StiffnessMatrixCalculator.js');
var MassMatrixCalculator = require('../Fem/MassMatrixCalculator.js');

var Stepper = function(femGeometry, dampingCoefficient, waveSpeed) {
    this.geometry = femGeometry;
    this.massMatrix = N.ccsSparse(new MassMatrixCalculator(femGeometry).buildMatrix());
    this.stiffnessMatrix = N.ccsSparse(new StiffnessMatrixCalculator(femGeometry).buildMatrix());
    this.dampingCoefficient = this.dampingCoefficient;
    this.waveSpeed = waveSpeed;
    this.currentWavePosition = this.zeroVector();
    this.previousWavePosition = this.zeroVector();

    // precalculate some values needed in the calculation
};

Stepper.prototype.zeroVector = function() {
    var n = this.massMatrix.length;

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
    return new FMatrixCalculator(this.geometry).buildMatrix(mouseClickLocation); 
};

Stepper.prototype.step = function(deltaT, mouseClickLocation) {
    var F  = this.resolveF(mouseClickLocation);

    // form the currentWavePosition scale factor
    var currentScale = N.ccsAdd(
        N.ccsScale(this.massMatrix, 2 / deltaT / deltaT),
        N.ccsScale(this.stiffnessMatrix, this.waveSpeed * this.waveSpeed)
    );
    var previousScale = N.ccsScale(this.massMatrix, (2 - this.dampingCoefficient * deltaT) / (2 * deltaT));
};

module.exports = Stepper;
