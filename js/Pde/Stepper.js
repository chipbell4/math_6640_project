var numeric = require('numeric');
var FMatrixCalculator = require('../Fem/FMatrixCalculator.js');
var StiffnessMatrixCalculator = require('../Fem/StiffnessMatrixCalculator.js');
var MassMatrixCalculator = require('../Fem/MassMatrixCalculator.js');

var Stepper = function(femGeometry, dampingCoefficient, waveSpeed) {
    this.geometry = femGeometry;
    this.massMatrix = new MassMatrixCalculator(femGeometry).buildMatrix();
    this.stiffnessMatrix = new StiffnessMatrixCalculator(femGeometry).buildMatrix();
    this.dampingCoefficient = this.dampingCoefficient;
    this.waveSpeed = waveSpeed;
    this.currentWavePosition = this.zeroVector();
    this.previousWavePosition = this.zeroVector();

    // precalculate some values needed in the calculation
    //this.inverseMassWithScaling = 
};

Stepper.prototype.zeroVector = function() {
    var N = this.massMatrix.length;

    var array = [];
    for(var i = 0; i < N; i++) {
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

    
};

module.exports = Stepper;
