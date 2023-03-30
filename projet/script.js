import * as THREE from "three";
import { Sphere } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

			let container;
			let camera, scene, renderer;
			let controller1, controller2;
			let controllerGrip1, controllerGrip2;

			let raycaster;

			const intersected = [];
			const tempMatrix = new THREE.Matrix4();

			let controls, group;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x202020 );

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );
				camera.position.set( 0, 1.6, 3 );

				controls = new OrbitControls( camera, container );
				controls.target.set( 0, 1.6, 0 );
				controls.update();

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.shadowMap.enabled = true;
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				document.body.appendChild( VRButton.createButton( renderer ) );

				// controllers

				controller1 = renderer.xr.getController( 1 );
				controller1.addEventListener( 'selectstart', onSelectStart );
				controller1.addEventListener( 'selectend', onSelectEnd );
				scene.add( controller1 );

				controller2 = renderer.xr.getController( 0 );
				scene.add( controller2 );

				const controllerModelFactory = new XRControllerModelFactory();

				controllerGrip1 = renderer.xr.getControllerGrip( 1 );
				controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
				scene.add( controllerGrip1 );

				controllerGrip2 = renderer.xr.getControllerGrip( 0 );
				controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
				scene.add( controllerGrip2 );

				//

				const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

				const line = new THREE.Line( geometry );
				line.name = 'line';
				line.scale.z = 5;

				controller1.add( line.clone() );

				raycaster = new THREE.Raycaster();

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			// create an AudioListener and add it to the camera
			const listener = new THREE.AudioListener();
			camera.add( listener );

			// create a global audio source
			const sound = new THREE.Audio( listener );

			// load a sound and set it as the Audio object's buffer
			const audioLoader = new THREE.AudioLoader();
			audioLoader.load( 'sounds/rainworld.mp3', function( buffer ) {
				sound.setBuffer( buffer );
				sound.setLoop( true );
				sound.setVolume( 0.15 );
			});

			renderer.xr.setSession();

			renderer.xr.addEventListener( 'sessionstart', function ( event ) {

				sound.play();
			
			} );
			
			renderer.xr.addEventListener( 'sessionend', function ( event ) {
			
				sound.stop();
			
			} );

			group = new THREE.Group();

				const cube = new THREE.BoxGeometry(0.1,0.1,0.1);
				const red = new THREE.MeshToonMaterial({color: 0xFF0000});
				const green = new THREE.MeshToonMaterial({color: 0x00FF00});
				const blue = new THREE.MeshToonMaterial({color: 0x0000FF});

				const buttonred = new THREE.Mesh(cube, red);
				const buttongreen = new THREE.Mesh(cube, green);
				const buttonblue = new THREE.Mesh(cube, blue);

				buttonred.userData.name = red;
				buttongreen.userData.name = green;
				buttonblue.userData.name = blue;

				group.position.y = 0.5;
				group.position.z = -0.5;

				buttonred.position.x = -0.1;
				buttongreen.position.x = 0.1;

				group.add(buttonred, buttongreen, buttonblue);
				scene.add( group );

				/////// LIGHTS

				const ambientlight = new THREE.AmbientLight (0xFFFFFF, 0.2)
				const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
				light.position.set( 0, 6, 0 );
				light.castShadow = true;
				light.shadow.camera.top = 2;
				light.shadow.camera.bottom = - 2;
				light.shadow.camera.right = 2;
				light.shadow.camera.left = - 2;
				light.shadow.mapSize.set( 4096, 4096 );
				scene.add( light, ambientlight );
				const lightred = new THREE.DirectionalLight( 0xffffff, 0.8 );

				/////// Transition

			function Transition() {
				let percentage = 100;
				for(let i = 0; i <= 200; i++){
					setTimeout(function(){
						if(i <= 100){
							percentage--;
							light.intensity = percentage/100*0.8
							ambientlight.intensity = percentage/100*0.2
						}else{
							percentage++;
							light.intensity = percentage/100*0.8
							ambientlight.intensity = percentage/100*0.2
						}
					},i*5);
				};
			};
				/////// LOCK/UNLOCK BUTTONS

				function lockbuttons(){
					buttonred.userData.name = null;
					buttongreen.userData.name = null;
					buttonblue.userData.name = null;
				};

				function unlockbuttons(){
					buttonred.userData.name = red;
					buttongreen.userData.name = green;
					buttonblue.userData.name = blue;
				};


				///////

			function buttonRedPress() {
				Transition();
				setTimeout(function(){
					redscene()
				},500);
				setTimeout(function(){
					unlockbuttons()
				},1000);
				lockbuttons()
			};

			function buttonGreenPress() {
				Transition();
				setTimeout(function(){
					greenscene()
				},500);
				setTimeout(function(){
					unlockbuttons()
				},1000);
				lockbuttons()
			};

			function buttonBluePress() {
				Transition();
				setTimeout(function(){
					bluescene()
				},500);
				setTimeout(function(){
					unlockbuttons()
				},1000);
				lockbuttons()
			};

				///////

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			};


	let scenered;
	let scenegreen;
	let sceneblue;
	const loader = new GLTFLoader();

	loader.load( 'models/redscene.glb',(gltfScenered) => {
		scenered = gltfScenered.scene;
		scenered.visible = false;
		scenered.position.x = -3;
		scenered.position.z = -2;
		scene.add(scenered);
	});
	loader.load( 'models/greenscene.glb',(gltfScenegreen) => {
		scenegreen = gltfScenegreen.scene;
		scenegreen.visible = false;
		scene.add(scenegreen);
	});
	loader.load( 'models/bluescene.glb',(gltfSceneblue) => {
		sceneblue = gltfSceneblue.scene;
		sceneblue.visible = false;
		sceneblue.position.x = -2;
		sceneblue.position.z = -2.2;
		scene.add(sceneblue);
	});

	function redscene(){
		scene.background = new THREE.Color( 0x241C49 );
		if(scenered){
			scenered.visible = true;
		};
		if(scenegreen){
			scenegreen.visible = false;
		};
		if(sceneblue){
			sceneblue.visible = false;
		};
	};
	function greenscene(){
		scene.background = new THREE.Color( 0xA0DDFF );
		if(scenered){
			scenered.visible = false;
		};
		if(scenegreen){
			scenegreen.visible = true;
		};
		if(sceneblue){
			sceneblue.visible = false;
		};
	};
	function bluescene(){
		scene.background = new THREE.Color( 0x202020 );
		if(scenered){
			scenered.visible = false;
		};
		if(scenegreen){
			scenegreen.visible = false;
		};
		if(sceneblue){
			sceneblue.visible = true;
		};
	};



			function onSelectStart( event ) {

				const controller = event.target;

				const intersections = getIntersections( controller );

				if ( intersections.length > 0 ) {

					const intersection = intersections[ 0 ];

					const object = intersection.object;

					controller.userData.selected = object;
					if( object.userData.name == red){
						buttonRedPress();
					}
					if( object.userData.name == green){
						buttonGreenPress();
					}
					if( object.userData.name == blue){
						buttonBluePress();
					}

				}

			};

			function onSelectEnd( event ) {

				const controller = event.target;

				if ( controller.userData.selected !== undefined ) {

					const object = controller.userData.selected;

				}


			};

			function getIntersections( controller ) {

				tempMatrix.identity().extractRotation( controller.matrixWorld );

				raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
				raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

				return raycaster.intersectObjects( group.children, false );

			};

			function intersectObjects( controller ) {

				const line = controller.getObjectByName( 'line' );
				const intersections = getIntersections( controller );

				if ( intersections.length > 0 ) {

					const intersection = intersections[ 0 ];

					const object = intersection.object;
					object.material.emissive.r = 0.2;
					object.material.emissive.g = 0.2;
					object.material.emissive.b = 0.2;
					intersected.push( object );

					line.scale.z = intersection.distance;

				} else {

					line.scale.z = 5;

				}

			};

			function cleanIntersected() {

				while ( intersected.length ) {

					const object = intersected.pop();
					object.material.emissive.r = 0;
					object.material.emissive.g = 0;
					object.material.emissive.b = 0;

				}

			};

			//

			function animate() {
				
				renderer.setAnimationLoop( render );

			};

			function render() {

				cleanIntersected();
				
				intersectObjects( controller1 );

				renderer.render( scene, camera );

			};