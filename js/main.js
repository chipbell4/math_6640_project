var THREE = require('three');
var PolygonDrawingState = require('./PolygonDrawingState.js');
var FemDrawingState = require('./FemDrawingState.js');

(function() {
	var polygonDrawingState = new PolygonDrawingState();
    var femDrawingState = new FemDrawingState();

    var currentDrawingState = femDrawingState;

	var renderer;

    window.scene = new THREE.Scene();

	var animate = function() {
		renderer.render(currentDrawingState.scene, currentDrawingState.camera);

		requestAnimationFrame(animate.bind(this));

        // hook into an update function if it exists
        if(currentDrawingState.update) {
            currentDrawingState.update();
        }
	};

	var generateListener = function(eventName) {
		return function(evt) {
			if(currentDrawingState[eventName]) {
				currentDrawingState[eventName](evt);
			}
		};
	};

    var toggleDrawingState = function() {
        if(currentDrawingState == femDrawingState) {
            polygonDrawingState.showPolygon();
            currentDrawingState = polygonDrawingState;
        }
        else {
            // clear the previous scene
            femDrawingState.setCurrentPolygon(polygonDrawingState.buffer.vertices);
            currentDrawingState = femDrawingState;
        }
    };

	window.setup = function() {
		if(window.WebGLRenderingContext) {
			renderer = new THREE.WebGLRenderer();
		}
		else {
			renderer = new THREE.CanvasRenderer();
		}
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		
		// Setup event listeners
		var events = ['mousedown', 'mouseup', 'mousemove'];
		for(var i in events) {
			var eventName = events[i];
			document.addEventListener(eventName, generateListener(eventName));
		}
        document.addEventListener('keydown', toggleDrawingState);
    
        femDrawingState.setCurrentPolygon([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(0, 1, 0),
        ]);

		animate();
	};

})(window);
