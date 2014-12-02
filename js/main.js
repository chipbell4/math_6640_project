var THREE = require('three');
var PolygonDrawingState = require('./PolygonDrawingState.js');
var FemDrawingState = require('./FemDrawingState.js');

(function() {
	var polygonDrawingState = new PolygonDrawingState();
    var femDrawingState = new FemDrawingState();

    // test code
    var geometry = new THREE.PlaneGeometry( 1, 1, 2, 2);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    femDrawingState.scene.add(plane);
	
    var currentDrawingState = polygonDrawingState;

	var renderer;

    window.scene = new THREE.Scene();

	var animate = function() {
		renderer.render(currentDrawingState.scene, currentDrawingState.camera);

		requestAnimationFrame(animate.bind(this));
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
            femDrawingState.scene.remove(femDrawingState.scene.children[0]);
            femDrawingState.scene.add(polygonDrawingState.polygonMesh.clone());
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

		animate();
	};

})(window);
