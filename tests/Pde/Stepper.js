var expect = require('chai').expect;
var numeric = require('numeric');
var THREE = require('three');
var Polygon = require('../../js/PolygonUtils/Polygon.js');
var PolygonPointContainmentChecker = require('../../js/PolygonUtils/PolygonPointContainmentChecker.js');
var MeshPointSetBuilder = require('../../js/PolygonUtils/MeshPointSetBuilder.js');
var GeometryBuilder = require('../../js/GeometryBuilder.js');
var FemGeometry = require('../../js/Fem/FemGeometry.js');
var MouseProjector = require('../../js/Ui/MouseProjector.js');
var range = require('range-function');
var Stepper = require('../../js/Pde/Stepper.js');

describe('Stepper', function() {

    var threeGeometry = new THREE.Geometry();
    threeGeometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(1/3, 1/3, 0),
        new THREE.Vector3(2/3, 2/3, 0)
    );
    threeGeometry.faces.push(
        new THREE.Face3(0, 1, 4),
        new THREE.Face3(0, 2, 4),
        new THREE.Face3(2, 4, 5),
        new THREE.Face3(2, 5, 3),
        new THREE.Face3(5, 1, 4),
        new THREE.Face3(5, 1, 3)
    );
    var femGeometry = new FemGeometry(threeGeometry, [0, 1, 2, 3]);

    var stepper;
    beforeEach(function() {
        stepper = new Stepper({
            geometry: femGeometry,
            dampingCoefficient: 1,
            waveSpeed: 0.1,
            clickWeight: 1,
            clickTightness: 1
        });
    });

    it('should not blow up after many empty steps', function() {
        var many = 1;
        for(var i = 0; i < many; i++) {
            stepper.step(0.01);
        }

        expect(stepper.currentWavePosition[0]).to.equal(0);
        expect(stepper.currentWavePosition[1]).to.equal(0);
    });

    it('should limit to zero if a click is registered at the start', function() {
        var Zero = [0, 0];
        var many = 1000;
        var currentWavePosition = stepper.step(0.01, new THREE.Vector3(0.5, 0.5, 0));
        
        // Make sure the energy DID propogate
        expect(currentWavePosition).to.not.deep.equal(Zero);
        // Make sure we didn't get NaN
        expect(currentWavePosition).to.deep.equal(currentWavePosition);
        
        for(var i = 0; i < many; i++) {
            var nextWavePosition = stepper.step(0.01);
            
            currentWavePosition = nextWavePosition;
        }
        
        expect(stepper.currentWavePosition[0]).to.be.closeTo(0, 0.001);
        expect(stepper.currentWavePosition[1]).to.be.closeTo(0, 0.001);
    });

    it('does not blow up after many steps without diffusion', function() {
        var many = 10000;
        stepper.dampingCoefficient = 0;
        stepper.step(0.01, new THREE.Vector3(0.5, 0.5, 0));

        for(var i = 0; i < many; i++) {
            stepper.step(0.01);
        }

        expect(stepper.currentWavePosition[0]).to.be.lessThan(100);
        expect(stepper.currentWavePosition[1]).to.be.lessThan(100);

    });

    it('does not blow up with points offset sort of high', function() {
        var many = 10000;
        stepper.currentWavePosition = [0.1000, .1000];
        stepper.previousWavePosition = [0.0500, 0.0500];

        for(var i = 0; i < many; i++) {
            stepper.step(0.01);
        }

        expect(stepper.currentWavePosition[0]).to.be.lessThan(100);
        expect(stepper.currentWavePosition[1]).to.be.lessThan(100);
    });

    it('does not blow up with a normal mesh', function() {
        var many = 50000;
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(0.5, 0.5, 0),
            new THREE.Vector3(0.75, 0.5, 0),
            new THREE.Vector3(0.25, 0.5, 0),
            new THREE.Vector3(0.5, 0.25, 0),
            new THREE.Vector3(0.5, 0.75, 0),
        ];
        var boundaryNodes = [0, 1, 2, 3];
        var threeGeometry = new GeometryBuilder(points).buildGeometry();
        var femGeometry = new FemGeometry(threeGeometry, boundaryNodes) 

        var stepper = new Stepper({
            geometry: femGeometry,
            dampingCoefficient: 1,
            waveSpeed: 0.1,
            clickWeight: 1,
            clickTightness: 1
        });

        // add energy to the system
        for(var i = 0; i < 1; i++) {
            stepper.step(0.01, new THREE.Vector3(0.5, 0.5));
        }

        for(var i = 0; i < many; i++) {
            stepper.step(0.001);
        }

        expect(numeric.norminf(stepper.currentWavePosition)).to.be.lessThan(100);
    });

    it('should not blow up with a generated mesh', function() {
        var points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(0, 1, 0),
        ];
        var filteredPoints = Polygon.factory(points).mappedPoints();
        var containmentChecker = new PolygonPointContainmentChecker(filteredPoints);    
        var pointSetBuilder = new MeshPointSetBuilder(0.09, 0.09, containmentChecker);
        
        var meshPoints = pointSetBuilder.calculateMeshPoints();
        var boundaryNodes = range(filteredPoints.length, 'inclusive');

        // create the Fem geometry
        var threeGeometry = new GeometryBuilder(meshPoints).buildGeometry();
        var femGeometry = new FemGeometry(threeGeometry, boundaryNodes);

        // setup the Fem Model
        var stepper = new Stepper({
            geometry: femGeometry,
            elasticity: 0.01,
            dampingCoefficient: 20,
            waveSpeed: 0.5
        });

        // add a click
        stepper.step(0.01, new THREE.Vector3(0.5, 0.5));
        console.log(stepper.currentWavePosition);

        range(1).forEach(function() {
            stepper.step(0.01);
        });

        expect(numeric.norminf(stepper.currentWavePosition)).to.be.lessThan(1);
    });

});
