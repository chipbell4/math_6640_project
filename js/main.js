window.scene = window.camera = window.keyboard = null;

window.animate = function() {
	window.renderer.render(window.scene, window.camera);

	requestAnimationFrame(window.animate.bind(this));
};

window.setup = function() {
	window.renderer;
	if(window.WebGLRenderingContext) {
		renderer = new THREE.WebGLRenderer();
	}
	else {
		renderer = new THREE.CanvasRenderer();
	}
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	window.keyboard = new THREEx.KeyboardState();

	window.scene = new THREE.Scene();
	window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

	window.animate();
};
