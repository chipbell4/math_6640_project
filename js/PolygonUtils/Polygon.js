var Polygon = function(vertices) {
    this.vertices = vertices;
    this.maps = [];
};

Polygon.prototype.addMap = function(map) {
    if(map instanceof Function) {
        this.maps.push(map);
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

module.exports = Polygon;
