import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { HOKKAIDO_SPOTS } from './data/spots.js';
import { createIsland, createFog, createParticles, createRoute } from './objects/geometry.js';
import { setupLights } from './objects/lights.js';
import { createMarkers } from './objects/markers.js';
import { setupInteractions } from './interactions/handlers.js';
import { updateStats } from './utils/stats.js';

const canvas = document.createElement('canvas');
document.body.insertBefore(canvas, document.body.firstChild);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x091827);
scene.fog = new THREE.FogExp2(0x9ad7ff, 0.032);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(30, 26, 74);

const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.screenSpacePanning = true;
controls.minDistance = 18;
controls.maxDistance = 160;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minPolarAngle = Math.PI * 0.18;
controls.target.set(0, 8, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.55;

setupLights(scene);

const island = createIsland(scene);
const { fog, fogMaterial } = createFog(scene);
const { splatCloud, splatMat } = createParticles(scene);
const route = createRoute(scene, HOKKAIDO_SPOTS);

const markerGroup = new THREE.Group();
scene.add(markerGroup);

const markerMeshes = createMarkers(markerGroup, HOKKAIDO_SPOTS);

const uiState = {
  fogEnabled: true,
  particlesEnabled: true,
  theme: 'classic',
  currentSpot: HOKKAIDO_SPOTS[0]
};

const { updateInfo, toggleTheme, toggleFog, toggleParticles, focusOnSpot } = setupInteractions(
  scene,
  markerGroup,
  camera,
  controls,
  uiState,
  fogMaterial,
  splatMat,
  island
);

const resetBtn = document.getElementById('resetBtn');
const toggleFogBtn = document.getElementById('toggleFogBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const toggleParticlesBtn = document.getElementById('toggleParticlesBtn');

resetBtn.addEventListener('click', () => {
  camera.position.set(30, 26, 74);
  controls.target.set(0, 8, 0);
  controls.update();
  focusOnSpot(HOKKAIDO_SPOTS[0], false);
});

toggleFogBtn.addEventListener('click', () => {
  toggleFog(fogMaterial);
});

toggleThemeBtn.addEventListener('click', () => {
  toggleTheme(scene, splatMat, fogMaterial, island);
});

toggleParticlesBtn.addEventListener('click', () => {
  toggleParticles(splatCloud, splatMat);
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

const clock = new THREE.Clock();
let frameCount = 0;
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  fog.rotation.y = t * 0.08;
  fog.rotation.x = Math.sin(t * 0.5) * 0.18;

  splatCloud.rotation.y = t * 0.05;
  splatCloud.rotation.z = Math.sin(t * 0.7) * 0.08;
  splatCloud.position.y = 8 + Math.sin(t * 0.85) * 0.8;

  markerMeshes.forEach((marker, index) => {
    const bob = Math.sin(t * 1.5 + index * 0.6) * 0.8;
    const sway = Math.cos(t * 0.9 + index) * 0.12;
    marker.position.y = marker.userData.spot.position.y + bob;
    marker.rotation.z = sway * 0.18;
  });

  route.rotation.y = t * 0.12;
  route.position.y = Math.sin(t * 1.1) * 0.22;

  fogMaterial.uniforms.uTime.value = t;
  controls.update();
  renderer.render(scene, camera);

  frameCount++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    updateStats(frameCount);
    frameCount = 0;
    lastTime = currentTime;
  }
}

setTimeout(() => {
  updateInfo(HOKKAIDO_SPOTS[0]);
  focusOnSpot(HOKKAIDO_SPOTS[0], false);
}, 120);

animate();
