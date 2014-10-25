var PolygonDrawingState = require('./PolygonDrawingState.js');

(function() {
	var polygonDrawingState = new PolygonDrawingState();

	var currentDrawingState = polygonDrawingState;

	var renderer, keyboard;

	var animate = function() {
		renderer.render(currentDrawingState.scene, currentDrawingState.camera);

		requestAnimationFrame(animate.bind(this));
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

		keyboard = new THREEx.KeyboardState();

		animate();
	};

})(window);
