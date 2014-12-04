var expect = require('chai').expect;
var THREE = require('three');
var Polygon = require('../../js/PolygonUtils/Polygon.js');

describe('Polygon', function() {
    it('should exist', function() {
        expect(Polygon).to.be.instanceOf(Function);
    });

    describe('addMap', function() {
        it('should add a function', function() {
            var polygon = new Polygon([]);
            expect(polygon.maps.length).to.equal(0);
            var result = polygon.addMap(function() { });
            expect(result).to.equal(polygon);
            expect(polygon.maps.length).to.equal(1);
        });
        it('should throw an exception if the map is not a function', function() {
            var polygon = new Polygon([]);
            expect(function() {
                polygon.addMap('asdf');
            }).to.throw(Error);
        });
    });

    describe('mappedPoints', function() {
        it('should return the points passed in if there are no points', function() {
            var polygon = new Polygon([1, 2, 3]);
            expect(polygon.mappedPoints()).to.deep.equal([1, 2, 3]);
        });
        it('should apply the maps in order that they were provided', function() {
            var squareAll = function(points) {
                return points.map(function(point) { return point * point; });
            };
            var addOne = function(points) {
                return points.map(function(point) { return point + 1; });
            };

            var polygon = new Polygon([1, 2, 3]);
            polygon.addMap(squareAll);
            polygon.addMap(addOne);
            expect(polygon.mappedPoints()).to.deep.equal([2, 5, 10]);
        });
    });

    describe('factory', function() {
        it('should work', function() {
            var polygon = Polygon.factory([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(2, 0, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(0.5, 0.5, 0)
            ]);

            polygon.mappedPoints();
        });
    });
});
