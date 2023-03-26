import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const directionallight = new THREE.DirectionalLight(0xFFFFFF, 1);
const ambientlight = new THREE.AmbientLight(0xFFFFFF, 0.2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

const controls = new OrbitControls( camera, renderer.domElement );

const threeTone = new THREE.TextureLoader().load('threeTone.jpg')
threeTone.minFilter = THREE.NearestFilter
threeTone.magFilter = THREE.NearestFilter

const knotgeo = new THREE.TorusKnotGeometry(1,0.4,64,8,2,3);
const material = new THREE.MeshToonMaterial({color: 0x00ff00, side: THREE.FrontSide, gradientMap: threeTone});
const material2 = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.BackSide});

const cube = new THREE.Mesh(knotgeo, material);
const cube2 = new THREE.Mesh(knotgeo, material2);

const scaling = 1.1;
cube2.scale.set(scaling,scaling,scaling);

directionallight.position.x = 5;
directionallight.position.y = 10;
directionallight.position.z = 7.5;
scene.add(cube,cube2,directionallight,ambientlight);

camera.position.z = 5;

renderer.setAnimationLoop( function () {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
    cube2.rotation.x += 0.01;
	cube2.rotation.y += 0.01;

	renderer.render( scene, camera);

    controls.update();

} );