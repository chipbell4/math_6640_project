(function() {
	var renderer, scene, camera, keyboard;

	var animate = function() {
		renderer.render(scene, camera);

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

		eyboard = new THREEx.KeyboardState();

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

		animate();
	};

})(window);
