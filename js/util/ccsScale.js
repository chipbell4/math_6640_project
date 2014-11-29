var numeric = require('numeric');
var scale = require('./scale.js');

var ccsScale = function(M, scaleFactor) {
   var mClone = numeric.clone(M);
   mClone[2] = scale(M[2], scaleFactor);
   return mClone;
};

module.exports = ccsScale;
