if (!window.console) {
	console = {log : function (str) { }};
}

var container = document.querySelector('#canvas');
var width = parseInt(getComputedStyle(container).width);
var height = parseInt(getComputedStyle(container).height);

var fov = 45;
var aspect = width / height;
var near = 0.1;
var far = 10000;

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var scene = new THREE.Scene();

scene.add(camera);


// Set up the sphere vars
const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;

const sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000
    });

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
const sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    RADIUS,
    SEGMENTS,
    RINGS),

  sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
sphere.position.z = -300;

// Finally, add the sphere to the scene.
scene.add(sphere);


var dotGeometry = new THREE.Geometry();

var yep = function () { return Math.random()*100 - 50; }

var r = 60;
var a;

function randomSpherePoint(x0,y0,z0,radius){
   var u = Math.random();
   var v = Math.random();
   var theta = 2 * Math.PI * u;
   var phi = Math.acos(2 * v - 1);
   var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
   var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
   var z = z0 + (radius * Math.cos(phi));
   return [x,y,z];
}

for (var i = 0; i < 10000; i++) {
	var pt = randomSpherePoint(0, 0, -200, r);

	dotGeometry.vertices.push(new THREE.Vector3( 
		pt[0], pt[1], pt[2]
		)
	);
}

var dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
var dot = new THREE.Points( dotGeometry, dotMaterial );
scene.add(dot);

// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

renderer.setSize(width, height);
renderer.domElement.style.opacity = 0;
container.appendChild(renderer.domElement);

function increaseOpacity() {
	var current = getComputedStyle(renderer.domElement).opacity;
	var newOpacity = 1.0;
	var target = 1.0;

	if (current >= 0.999) {
		newOpacity = 1.0;
	} else {
		newOpacity = current * 0.90 + target * 0.10;
		setTimeout(increaseOpacity, 1000 / 60);
	}
	renderer.domElement.style.opacity = newOpacity;	
}
increaseOpacity();

// var matrix = ;

dot.matrixAutoUpdate = false;

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {


	// monitored code goes here


	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );

(function update() {
	// dot.rotation.x = Date.now() * 0.001 + Math.PI;

	// dots.applyMatrix(matrix);
	var foo = dot.matrix.clone();
	foo.identity();
	foo.multiply(new THREE.Matrix4().makeRotationZ(Date.now() * 0.001));
	dot.matrix = foo;

	sphere.position.z = -300 + Math.sin(Date.now() * 0.001) * 200;

	// var rotation = new THREE.Matrix4().makeRotationZ(Math.PI/2 + Date.now() * 0.1);
	// dot.matrix.set(rotation);

	// dot.matrix.identity();
	// dot.matrix.makeRotationX(Math.random());

	// var rotationMatrix = new THREE.Matrix4();
	// rotationMatrix.makeRotationX(Date.now() * 0.001 + Math.PI);
	// console.log(rotationMatrix);

	// rotationMatrix.multiply(dot.matrix);
	// dot.matrix.multiply(rotationMatrix);

	// dot.matrix.

	stats.begin();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(update);
})();

// update();


