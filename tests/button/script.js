import * as THREE from "three";
import { Sphere } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

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

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
				camera.position.set( 0, 1.6, 3 );

				controls = new OrbitControls( camera, container );
				controls.target.set( 0, 1.6, 0 );
				controls.update();

				const floorGeometry = new THREE.PlaneGeometry( 4, 4 );
				const floorMaterial = new THREE.MeshStandardMaterial( {
					color: 0x303030,
					roughness: 1.0,
					metalness: 0.0
				} );
				const floor = new THREE.Mesh( floorGeometry, floorMaterial );
				floor.rotation.x = - Math.PI / 2;
				floor.receiveShadow = true;
				scene.add( floor );

				const light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0, 6, 0 );
				light.castShadow = true;
				light.shadow.camera.top = 2;
				light.shadow.camera.bottom = - 2;
				light.shadow.camera.right = 2;
				light.shadow.camera.left = - 2;
				light.shadow.mapSize.set( 4096, 4096 );
				scene.add( light );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.shadowMap.enabled = true;
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				document.body.appendChild( VRButton.createButton( renderer ) );

				// controllers

				controller1 = renderer.xr.getController( 0 );
				controller1.addEventListener( 'selectstart', onSelectStart );
				controller1.addEventListener( 'selectend', onSelectEnd );
				scene.add( controller1 );

				controller2 = renderer.xr.getController( 1 );
				scene.add( controller2 );

				const controllerModelFactory = new XRControllerModelFactory();

				controllerGrip1 = renderer.xr.getControllerGrip( 0 );
				controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
				scene.add( controllerGrip1 );

				controllerGrip2 = renderer.xr.getControllerGrip( 1 );
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

			group = new THREE.Group();

				const cube = new THREE.BoxGeometry(0.1,0.1,0.1);
				const cyan = new THREE.MeshToonMaterial({color: 0x00FFFF});
				const magenta = new THREE.MeshToonMaterial({color: 0xFF00FF});
				const yellow = new THREE.MeshToonMaterial({color: 0xFFFF00});
				const black = new THREE.MeshToonMaterial({color: 0x000000});

				const cyan2 = new THREE.MeshToonMaterial({color: 0x00FFFF});
				const magenta2 = new THREE.MeshToonMaterial({color: 0xFF00FF});
				const yellow2 = new THREE.MeshToonMaterial({color: 0xFFFF00});
				const black2 = new THREE.MeshToonMaterial({color: 0x000000});

				const buttoncyan = new THREE.Mesh(cube, cyan);
				const buttonmagenta = new THREE.Mesh(cube, magenta);
				const buttonyellow = new THREE.Mesh(cube, yellow);
				const buttonblack = new THREE.Mesh(cube, black);

				buttoncyan.userData.name = cyan;
				buttonmagenta.userData.name = magenta;
				buttonyellow.userData.name = yellow;
				buttonblack.userData.name = black;

				group.position.y = 0.5;
				group.position.z = -0.5;

				buttoncyan.position.x = -0.3;
				buttonmagenta.position.x = -0.1;
				buttonyellow.position.x = 0.1;
				buttonblack.position.x = 0.3;

				group.add(buttonblack, buttoncyan, buttonmagenta, buttonyellow);
				scene.add( group );

				///////

				const groupreactive = new THREE.Group();
				scene.add( groupreactive );

				const sphere = new THREE.SphereGeometry(0.2,6,4);

				const spherecyan = new THREE.Mesh(sphere, cyan2);
				const spheremagenta = new THREE.Mesh(sphere, magenta2);
				const sphereyellow = new THREE.Mesh(sphere, yellow2);
				const sphereblack = new THREE.Mesh(sphere, black2);

				groupreactive.position.y = 1;
				groupreactive.position.z = -1;

				groupreactive.add(spherecyan, spheremagenta, sphereyellow, sphereblack);

				spherecyan.visible = false;
				spheremagenta.visible = false;
				sphereyellow.visible = false;
				sphereblack.visible = false;

			function buttonCyanPress() {
				spherecyan.visible = true;
				spheremagenta.visible = false;
				sphereyellow.visible = false;
				sphereblack.visible = false;
			}

			function buttonMagentaPress() {
				spherecyan.visible = false;
				spheremagenta.visible = true;
				sphereyellow.visible = false;
				sphereblack.visible = false;
			}

			function buttonYellowPress() {
				spherecyan.visible = false;
				spheremagenta.visible = false;
				sphereyellow.visible = true;
				sphereblack.visible = false;
			}

			function buttonBlackPress() {
				spherecyan.visible = false;
				spheremagenta.visible = false;
				sphereyellow.visible = false;
				sphereblack.visible = true;
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}







			function onSelectStart( event ) {

				const controller = event.target;

				const intersections = getIntersections( controller );

				if ( intersections.length > 0 ) {

					const intersection = intersections[ 0 ];

					const object = intersection.object;

					controller.userData.selected = object;
					if( object.userData.name == cyan){
						buttonCyanPress();
					}
					if( object.userData.name == magenta){
						buttonMagentaPress();
					}
					if( object.userData.name == yellow){
						buttonYellowPress();
					}
					if( object.userData.name == black){
						buttonBlackPress();
					}

				}

			}

			function onSelectEnd( event ) {

				const controller = event.target;

				if ( controller.userData.selected !== undefined ) {

					const object = controller.userData.selected;

				}


			}

			function getIntersections( controller ) {

				tempMatrix.identity().extractRotation( controller.matrixWorld );

				raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
				raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

				return raycaster.intersectObjects( group.children, false );

			}

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

			}

			function cleanIntersected() {

				while ( intersected.length ) {

					const object = intersected.pop();
					object.material.emissive.r = 0;
					object.material.emissive.g = 0;
					object.material.emissive.b = 0;

				}

			}

			//

			function animate() {

				renderer.setAnimationLoop( render );

			}

			function render() {

				groupreactive.rotation.y += 0.01;

				cleanIntersected();

				intersectObjects( controller1 );

				renderer.render( scene, camera );

			}