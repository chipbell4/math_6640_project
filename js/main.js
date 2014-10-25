var PolygonDrawingState = require('./PolygonDrawingState.js');

(function() {
	var polygonDrawingState = new PolygonDrawingState();

	var currentDrawingState = polygonDrawingState;

	var renderer, keyboard;

	var animate = function() {
		renderer.render(currentDrawingState.scene, currentDrawingState.camera);

		requestAnimationFrame(animate.bind(this));
	};

	var generateListener = function(eventName) {
		return function(evt) {
			console.log(eventName);
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
