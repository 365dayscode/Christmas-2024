

import * as THREE from 'three';

import { OrbitControls } from 'jsm/controls/OrbitControls.js';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
//import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
//import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

//import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
////

/////
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';


import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'jsm/shaders/FXAAShader.js';

import { DRACOLoader } from 'jsm/loaders/DRACOLoader.js';


//loadre
const dLoader = new DRACOLoader();
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dLoader.setDecoderConfig({type: 'js'});


//

const w = window.innerWidth; 
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
    //powerPreference: "high-performance",

    
    antialias: false

});
renderer.setSize(w,h);
renderer.setPixelRatio(2);
document.body.appendChild(renderer.domElement);
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();


const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w,h),1.5,0.1);
bloomPass.threshold =0.6;
bloomPass.strength=0.2;
bloomPass.radius=0.4;
const compos = new EffectComposer(renderer);
compos.addPass(renderScene);
compos.addPass(bloomPass);
let omodx = 0.02; 
let omody = 0.02;
let modx = 0;
let mody= 0;// Initial value
// Variable to store updated values

document.addEventListener("touchmove", (eventnon) => {
  // Calculate the normalized mouse position (modx)
  const touch = eventnon.touches[0];
  omodx = (touch.clientX / window.innerWidth);
  omody = (touch.clientY / window.innerHeight);

  // Update the new variable with the current value of modx


  // Log the updated value
  
});


document.addEventListener("mousemove", (eventnon) => {
  // Handle mouse input
  omodx = eventnon.clientX / window.innerWidth;
  omody = eventnon.clientY / window.innerHeight;

  // Log the updated values
 
});

setInterval(() => {
  // Assuming you have fxxass and the necessary variables (mody, modx, lam)
  mody = omody;
  modx = omodx;

  // Additional updates if necessary
  // fxxass.material.uniforms['someOtherUniform'].value = someNewValue;


}, 200); 



const fxxass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();


//compos.addPass(fxxass);


//key glitch




// Event listener for mouse movement
document.addEventListener("mousemove", (event) => {
  // Store the raw screen coordinates in variables
  modx = event.clientX/window.innerWidth;
  

  // Log the values (optional)
 
});

camera.position.set(0,0,1);



const loadingManager = new THREE.LoadingManager();


//const gltfloader = new GLTFLoader(loadingManager);







window.addEventListener('resize', () => {
    
    updateCameraFOV();
});


const controls = new OrbitControls(camera, renderer.domElement);



controls.enableDamping = true
controls.dampingFactor = 0.1;
controls.enableZoom = true;


controls.target.set(0,0,0);


//fog 


// fog end









const loader = new GLTFLoader(loadingManager);
const mixers = [];
loader.setDRACOLoader(dLoader);

loader.load('assets/models/bol.gltf', function(gltf) {
    scene.add(gltf.scene);

    gltf.scene.traverse((node) => {
        if (node.isMesh && node.material && node.material.isMeshStandardMaterial) {
            node.material.roughness = 0.8;
            node.material.metalness = 0;
            node.material.emissiveIntensity = 30;
            node.material.needsUpdate = true;
        }
    });

    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.position.set(0, 0, 0);

   
});

// main buildings



loader.load('assets/models/smoke.gltf', function(gltf) {
    scene.add(gltf.scene);



    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.position.set(0, 0, 0);


    const mixer1 = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
        mixer1.clipAction(clip).play();
    });
    mixers.push(mixer1);
    
});


const snowflakeCount = 1000;
const radius = 5; 
const positions = new Float32Array(snowflakeCount * 3);
for (let i = 0; i < snowflakeCount; i++) {
    const [x, y, z] = randomSphericalCoordinates(radius);
    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
}

const snowflakeGeometry = new THREE.IcosahedronGeometry(0.2,5);
//
snowflakeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const snowflakeMaterial = new THREE.PointsMaterial({
    color: 0xffffff,    // Snowflake color
    size: 0.03,          
    transparent: true,  // Allows particles to blend with background
    opacity: 0.7         // Semi-transparent for better effect
});

const snowflakeSystem = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
scene.add(snowflakeSystem);

// Random Spherical Coordinates
function randomSphericalCoordinates(radius) {
    const theta = Math.random() * Math.PI * 2; // Random angle in the xy-plane
    const phi = Math.acos(2 * Math.random() - 1); // Random angle in the polar direction
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return [x, y, z];
}




const poin = new THREE.PointLight(0xf2007a, 280, 100);
poin.position.set(1,-4, 3);
//scene.add(poin);

const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white light
scene.add(ambientLight);

// fog ------------------------------
const sunlo = new THREE.DirectionalLight(0xffde79,3, 60, 90);
sunlo.rotation.y=20;
sunlo.position.set(0,5,3);
scene.add(sunlo);


//bgsky



const fogColor = new THREE.Color(0x00496f);
scene.background = new THREE.Color(0x003255);
scene.fog = new THREE.FogExp2(fogColor, 0.38);

// Position above and to the side, like the sun
//sunlight1.castShadow = true;

const rectLi = new THREE.RectAreaLight(0xfffff,0.7,30,5);
//scene.add(rectLi);

rectLi.position.set(0,-2.9,-1.25);



const hei = new THREE.HemisphereLight(0xfffff, 0xfffff, 1);
hei.position.set(0,-6,0);
scene.add(hei);

fxxass.material.uniforms['resolution'].value.x = 1 / window.innerWidth;
  fxxass.material.uniforms['resolution'].value.y = 1/ window.innerHeight;

const clock = new THREE.Clock();



function animate() {
    requestAnimationFrame(animate);
    
    const positions = snowflakeSystem.geometry.attributes.position.array;
    for (let i = 0; i < snowflakeCount; i++) {
        positions[i * 3 + 1] -= 0.05; // Move particles down slowly
        if (positions[i * 3 + 1] < -radius) {
            // Reset particles when they go off-screen
            const [x, y, z] = randomSphericalCoordinates(radius);
            positions[i * 3 + 0] = x;
            positions[i * 3 + 1] = radius; // Reset y position to top
            positions[i * 3 + 2] = z;
        }
    }
    snowflakeSystem.geometry.attributes.position.needsUpdate = true;

    const delta = clock.getDelta();
    mixers.forEach((mixer) => mixer.update(delta)); // Update animations

    // Update camera and empty object positions
    
    controls.update();
    

    

    
    




    // Render the scene
    compos.render(scene,camera);
}

animate();

// Button Event Listeners
const moveForwardButton = document.getElementById('moveForward');
moveForwardButton.addEventListener('mousedown', () => mdir = 1);
moveForwardButton.addEventListener('dblclick', () => mdir = 0);

const moveBackwardButton = document.getElementById('moveBackward');
moveBackwardButton.addEventListener('mousedown', () => mdir = -1);
moveBackwardButton.addEventListener('dblclick', () => mdir = 0);


function handleWindowResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    fxxass.material.uniforms['resolution'].value.x=1/(window.innerWidth * renderer.getPixelRatio());
    fxxass.material.uniforms['resolution'].value.y=1/(window.innerHeight * renderer.getPixelRatio());
}

window.addEventListener('resize',handleWindowResize, false);



