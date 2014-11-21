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
	
    var currentDrawingState = femDrawingState;

	var renderer;

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

		animate();
	};

})(window);
