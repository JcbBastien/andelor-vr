import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
const materialred = new THREE.MeshBasicMaterial( { color: 0xff9e42,
    side: THREE.FrontSide
} );

const knot1 = new THREE.Mesh( geometry, materialred );

const outline_shader = {
    uniforms: {
        "linewidth":  { type: "f", value: 0.3 },
    },
    vertex_shader: [
        "uniform float linewidth;",
        "void main() {",
            "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;",
            "gl_Position = projectionMatrix * displacement;",
        "}"
    ].join("\n"),
    fragment_shader: [
        "void main() {",
            "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );",
        "}"
    ].join("\n")
};

const outline_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader.uniforms),
    vertexShader: outline_shader.vertex_shader,
    fragmentShader: outline_shader.fragment_shader,
    side: THREE.BackSide 
});

const knot2outline = new THREE.Mesh( geometry, outline_material );

const obj = new THREE.Group();
obj.add( knot1 );
obj.add( knot2outline );

scene.add( obj );

camera.position.z = 50;
function animate() {
	requestAnimationFrame( animate );

	obj.rotation.x += 0.01;
	obj.rotation.y += 0.01;

	renderer.render( scene, camera, directionalLight );
}

animate();

            