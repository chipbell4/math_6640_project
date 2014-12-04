var CollinearityFilter = require('./CollinearityFilter.js');
var PointSetDensifier = require('./PointSetDensifier.js');
var PolygonRescaler = require('./PolygonRescaler.js');
var PolygonWindingFixer = require('./PolygonWindingFixer.js');
var Smoother = require('./Smoother.js');

var Polygon = function(vertices) {
    this.vertices = vertices;
    this.maps = [];
};

Polygon.prototype.addMap = function(map) {
    if(map instanceof Function) {
        this.maps.push(map);
        return this;
    }
    else {
        throw new Error('You need to pass a map');
    }
};

Polygon.prototype.mappedPoints = function() {
    // apply each map in order to generate a new list
    return this.maps.reduce(function(vertices, map) {
        return map(vertices);
    }, this.vertices);
};

/**
 * Helper function for building a polygon, with some default filtering
 */
Polygon.factory = function(vertices) {
    var polygon = new Polygon(vertices);

    // add some maps to clean up the points
    polygon
        .addMap(CollinearityFilter(0.001))
        .addMap(Smoother(0))
        .addMap(CollinearityFilter(0.001))
        .addMap(PointSetDensifier(0.1))
        .addMap(PolygonWindingFixer())
        .addMap(PolygonRescaler());

    return polygon;
};

module.exports = Polygon;
