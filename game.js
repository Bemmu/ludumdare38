if (!window.console) {
	console = {log : function (str) { }};
}

var music = null;
var soundEffect = null;

var beatPositions = [0, 1000, 2000, 3000, 4000];
var beatIndex = 0;

var prevMusicPos = null;
var prevBeat = null;

var loops = [
	[0, 3990],
	[7500, 8000 + 3990]
];

var loopStart = loops[1][0];
var loopEnd = loops[1][1];

$(function () {
	music = new Gapless5("music", {
		loop: true, 
		tracks: "song.wav"
	});
	soundEffect = new Gapless5("soundEffect", {
		loop: false, 
		tracks: "soundEffect.wav"
	});

	// music.play();
	// setInterval(function () {
	// 	musicEvents();
	// }, 0);
	// me.music.scrub(me.loopStart);
});

function beat() {
	console.log("beat");
}

var musicEvents = function() {
	var pos = music.mgr.sources[0].getPosition();
	if (prevMusicPos === null) {
		prevMusicPos = pos;
		return;
	}

	// Looped around?
	if (pos < prevMusicPos) {
		beatIndex = 0;
	}

	var len = music.mgr.sources[0].getLength();
	r = pos;

	var thisBeat = Math.floor((pos - loopStart) / 500); // 120 bpm = 2 bps
	if (thisBeat != prevBeat) {
		// l(thisBeat);
		if ((thisBeat % 1) === 0) {
			beat();
		}

	}
	prevBeat = thisBeat;

	prevMusicPos = pos;
};

// music.setGain(0);

var keys = {};
var input = {
	x: 0,
	y: 0,
	fire: false
};

var W = 87, A = 65, S = 83, D = 68;
var SPACE = 32, Z = 90;
var UP = 38, LEFT = 37, DOWN = 40, RIGHT = 39;

function logInputState() {
	console.log('x = ' + input.x + ', y = ' + input.y + ', fire = ' + input.fire);
};

function fire() {
	soundEffect.scrub(0);
	soundEffect.play();
}

var mesh = null;
var mixer = null;

function initMesh() {
	mixer = new THREE.AnimationMixer( scene );
	var loader = new THREE.JSONLoader();

    // var loader = new THREE.ObjectLoader();
    loader.load('dino.js', function(geometry, materials) {

    	var material = materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( 0xffaaaa );

    	console.log('odel loaded');
        mesh = new THREE.Mesh(geometry, materials);
        mesh.position.z = -5000;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        scene.add(mesh);

        mixer.clipAction( geometry.animations[ 0 ], mesh )
						.setDuration( 1 )			// one second
						.startAt( - Math.random() )	// random phase (already running)
						.play();					// let's go

    });
}

document.body.onkeydown = function (e) {
	if (e.repeat) return;
	keys[e.keyCode] = true;

	if (e.keyCode == A || e.keyCode == LEFT) {
		input.x = -1;
	}
	if (e.keyCode == D || e.keyCode == RIGHT) {
		input.x = 1;
	}
	if (e.keyCode == W || e.keyCode == UP) {
		input.y = -1;
	}
	if (e.keyCode == S || e.keyCode == DOWN) {
		input.y = 1;
	}
	if (e.keyCode == Z || e.keyCode == SPACE) {
		input.fire = true;
		fire();
	}
	logInputState();
}
document.body.onkeyup = function (e) {
	if (input.x == -1 && (e.keyCode == A || e.keyCode == LEFT)) {
		input.x = 0;
	}
	if (input.x == 1 && (e.keyCode == D || e.keyCode == RIGHT)) {
		input.x = 0;
	}
	if (input.y == -1 && (e.keyCode == W || e.keyCode == UP)) {
		input.y = 0;
	}
	if (input.y == 1 && (e.keyCode == S || e.keyCode == DOWN)) {
		input.y = 0;
	}
	if (input.fire == true && (e.keyCode == Z || e.keyCode == SPACE)) {
		input.fire = false;
	}
	delete keys[e.keyCode];
	logInputState();
}

var container = document.querySelector('#canvas');

var clock = new THREE.Clock();

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

// scene.add(sphere);
initMesh();
// scene.add(dot);

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

var prevFrame = null;

(function update() {
	stats.begin();
	if (prevFrame === null) {
		prevFrame = Date.now();
		requestAnimationFrame(update);
		return;
	}
	var now = Date.now();
	var elapsed = now - prevFrame;
	prevFrame = now;

	// dot.rotation.x = Date.now() * 0.001 + Math.PI;

	// dots.applyMatrix(matrix);
	var foo = dot.matrix.clone();
	foo.identity();
	foo.multiply(new THREE.Matrix4().makeRotationZ(Date.now() * 0.001));
	dot.matrix = foo;

	sphere.position.z = -300 + Math.sin(Date.now() * 0.001) * 200;

	mixer.update( clock.getDelta() );

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

	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(update);
})();

// update();


