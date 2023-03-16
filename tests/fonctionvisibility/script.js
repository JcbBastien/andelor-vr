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
const material2 = new THREE.MeshBasicMaterial( { color: 0x0000ff,
    side: THREE.FrontSide
} );
const material3 = new THREE.MeshBasicMaterial( { color: 0x00ff00,
    side: THREE.FrontSide
} );


const cube = new THREE.BoxGeometry(8,8,8);
const cubemat = new THREE.MeshBasicMaterial({color: 0xff0000});
const button = new THREE.Mesh( cube, cubemat)

button.position.x = 20;

button.visible = true;

// scene.add( button );




const knot1 = new THREE.Mesh( geometry, materialred );
const knot2 = new THREE.Mesh( geometry, material2 );
const knot3 = new THREE.Mesh( geometry, material3 );

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
const outline_shader2 = {
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
            "gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );",
        "}"
    ].join("\n")
};
const outline_shader3 = {
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
            "gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0 );",
        "}"
    ].join("\n")
};

const outline_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader.uniforms),
    vertexShader: outline_shader.vertex_shader,
    fragmentShader: outline_shader.fragment_shader,
    side: THREE.BackSide 
});

const outline_material2 = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader2.uniforms),
    vertexShader: outline_shader2.vertex_shader,
    fragmentShader: outline_shader2.fragment_shader,
    side: THREE.BackSide 
});

const outline_material3 = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader3.uniforms),
    vertexShader: outline_shader3.vertex_shader,
    fragmentShader: outline_shader3.fragment_shader,
    side: THREE.BackSide 
});

const knot2outline = new THREE.Mesh( geometry, outline_material );
const knot2outline2 = new THREE.Mesh( geometry, outline_material2 );
const knot2outline3 = new THREE.Mesh( geometry, outline_material3 );

const obj = new THREE.Group();
obj.add( knot1 );
obj.add( knot2outline );

const obj2 = new THREE.Group();
obj2.add( knot2 );
obj2.add( knot2outline2 );

const obj3 = new THREE.Group();
obj3.add( knot3 );
obj3.add( knot2outline3 );

obj.position.x = 0;
obj2.position.x = 0;
obj3.position.x = 0;

scene.add( obj);
scene.add( obj2);
scene.add( obj3);

let showvalue = 0;
function scenaryTrolling() {
    if(showvalue == 0){
        obj.visible = true;
        obj2.visible = false;
        obj3.visible = false;
        showvalue = 1
    }else{
        if(showvalue == 1){
            obj.visible = false;
            obj2.visible = true;
            obj3.visible = false;
            showvalue = 2
        }else{
            obj.visible = false;
            obj2.visible = false;
            obj3.visible = true;
            showvalue = 0
        };
    };
};

camera.position.z = 50;
function animate() {
	requestAnimationFrame( animate );

	obj.rotation.x += 0.01;
	obj.rotation.y += 0.01;

    obj2.rotation.x += 0.01;
	obj2.rotation.y += 0.01;

    obj3.rotation.x += 0.01;
	obj3.rotation.y += 0.01;

    // button.rotation.x -= 0.01;
	// button.rotation.y -= 0.01;

    scenaryTrolling()

	renderer.render( scene, camera, directionalLight );
};

animate();

            