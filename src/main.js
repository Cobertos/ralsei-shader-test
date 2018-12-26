import * as THREE from "three";
window.THREE = THREE;
import "three-examples/controls/OrbitControls.js";
import "three-examples/shaders/CopyShader.js";
import "three-examples/shaders/PixelShader.js";
import "three-examples/shaders/FXAAShader.js";
import "three-examples/postprocessing/EffectComposer.js";
import "three-examples/postprocessing/RenderPass.js";
import "three-examples/postprocessing/ShaderPass.js";
import "three-examples/postprocessing/OutlinePass.js";
import "./FixOutlinePass.js";

import Stats from "stats.js";

const stats = new Stats();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( new THREE.Color(0.3,0.3,0.3) );
const scene = window._debug_scene = new THREE.Scene();

const playerFOV = 75;
let cam;
const camera = cam = new THREE.PerspectiveCamera(playerFOV, window.innerWidth / window.innerHeight, 0.1, 1000);

//post processing
const composer = new THREE.EffectComposer( renderer );
const renderPass = new THREE.RenderPass( scene, camera );
composer.addPass( renderPass );
const outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
/*From OutlinePass.js
this.renderScene = scene;
this.renderCamera = camera;
this.selectedObjects = selectedObjects !== undefined ? selectedObjects : [];
this.visibleEdgeColor = new THREE.Color( 1, 1, 1 );
this.hiddenEdgeColor = new THREE.Color( 0.1, 0.04, 0.02 );
this.edgeGlow = 0.0;
this.usePatternTexture = false;
this.edgeThickness = 1.0;
this.edgeStrength = 3.0;
this.downSampleRatio = 2;
this.pulsePeriod = 0;
*/
outlinePass.visibleEdgeColor = new THREE.Vector4(0,0,0,1);
outlinePass.hiddenEdgeColor = new THREE.Vector4(0,0,0,0);
composer.addPass( outlinePass );
const pixelPass = new THREE.ShaderPass( THREE.PixelShader );
pixelPass.uniforms.resolution.value = new THREE.Vector2( window.innerWidth, window.innerHeight );
pixelPass.uniforms.resolution.value.multiplyScalar( window.devicePixelRatio );
pixelPass.uniforms.pixelSize.value = 6;
composer.addPass( pixelPass );
const effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
effectFXAA.renderToScreen = true;
composer.addPass( effectFXAA );

scene.add( new THREE.Mesh(
    new THREE.SphereBufferGeometry(1,10,10),
    new THREE.MeshToonMaterial({
        color: 0x026655,
        specular: 0x000000,
        reflectivity: 0,
        shininess: 0,
    })
    ));
scene.children[0].position.set(0,0,-5);
outlinePass.selectedObjects = [scene.children[0]];
let ms = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
    );
ms.position.set(0,1,-6)
scene.add(ms);

let controls = new THREE.OrbitControls( cam, renderer.domElement );
controls.target.set(0,0,-5);
cam.position.set( 0, 0, 0 );
controls.update();

// ambient light
let am_light = new THREE.AmbientLight( 0x222222 );
scene.add( am_light );
// directional light
let dir_light = new THREE.DirectionalLight( 0x222222 );
dir_light.position.set( 20, 30, -5 );
dir_light.target.position.set(0,0,0);
dir_light.castShadow = true;
dir_light.shadow.camera.left = -30;
dir_light.shadow.camera.top = -30;
dir_light.shadow.camera.right = 30;
dir_light.shadow.camera.bottom = 30;
dir_light.shadow.camera.near = 20;
dir_light.shadow.camera.far = 200;
dir_light.shadow.bias = -.001
dir_light.shadow.mapSize.width = dir_light.shadow.mapSize.height = 2048;
scene.add( dir_light );

let light = new THREE.PointLight( 0xffffdd, 1, 0, 2 );
light.position.set(0,3,-4);
scene.add(light);

let lastTime = Date.now();
const updates = [];
const render = ()=>{
	let time = Date.now();
	let deltaTime = time - lastTime;
	lastTime = time;
    //Call ever registered update
    updates.forEach((f)=>f(time, deltaTime));
	composer.render();
};

const renderLoop = ()=>{
	stats.begin();
	render();
	stats.end();
	requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);

window.addEventListener("DOMContentLoaded", ()=>{
    document.body.appendChild(stats.dom);
    document.body.appendChild(renderer.domElement);
});
window.addEventListener("resize", ()=>{
    renderer.setSize( window.innerWidth, window.innerHeight );
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
});
