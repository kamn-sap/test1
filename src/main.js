import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HOKKAIDO_SPOTS } from './data/spots.js';
import { createIsland, createFog, createParticles, createRoute } from './objects/geometry.js';
import { setupLights } from './objects/lights.js';
import { createMarkers } from './objects/markers.js';
import { setupInteractions } from './interactions/handlers.js';
import { updateStats } from './utils/stats.js';

// ============================================================
// Scene Setup
// ============================================================
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
renderer.shadowMap.type = THREE.PCFShadowShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x091827);
scene.fog = new THREE.FogExp2(0x9ad7ff, 0.035);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 36, 68);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.autoRotate = false;
controls.minDistance = 28;
controls.maxDistance = 140;
controls.target.set(0, 10, 0);

// ============================================================
// Lighting
// ============================================================
setupLights(scene);

// ============================================================
// Geometry & Objects
// ============================================================
const island = createIsland(scene);
const { fog, fogMaterial } = createFog(scene);
const { splatCloud, splatMat } = createParticles(scene);
const route = createRoute(scene, HOKKAIDO_SPOTS);

// ============================================================
// Markers
// ============================================================
const markerGroup = new THREE.Group();
scene.add(markerGroup);

const markerMeshes = createMarkers(markerGroup, HOKKAIDO_SPOTS);

// ============================================================
// UI State
// ============================================================
const uiState = {
  fogEnabled: true,
  particlesEnabled: true,
  theme: 'classic',
  currentSpot: HOKKAIDO_SPOTS[0]
};

// ============================================================
// Interactions
// ============================================================
const { updateInfo, toggleTheme, toggleFog, toggleParticles } = setupInteractions(
  scene,
  markerGroup,
  camera,
  controls,
  uiState,
  fogMaterial,
  splatMat,
  island
);

// ============================================================
// Event Listeners
// ============================================================
const resetBtn = document.getElementById('resetBtn');
const toggleFogBtn = document.getElementById('toggleFogBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const toggleParticlesBtn = document.getElementById('toggleParticlesBtn');

resetBtn.addEventListener('click', () => {
  camera.position.set(0, 36, 68);
  controls.target.set(0, 10, 0);
  controls.update();
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

// ============================================================
// Animation Loop
// ============================================================
const clock = new THREE.Clock();
let frameCount = 0;
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const dt = clock.getDelta();

  // Fog animation
  fog.rotation.y = t * 0.08;
  fog.rotation.x = Math.sin(t * 0.5) * 0.15;

  // Particle animation
  splatCloud.rotation.y = t * 0.06;
  splatCloud.rotation.z = Math.sin(t * 0.7) * 0.08;
  splatCloud.position.y = 8 + Math.sin(t * 0.85) * 0.8;

  // Marker animation
  markerMeshes.forEach((marker, index) => {
    const bob = Math.sin(t * 1.6 + index * 0.5) * 0.7;
    const wobble = Math.cos(t * 0.9 + index) * 0.15;
    marker.position.y = marker.userData.spot.position.y + bob;
    marker.rotation.z = wobble * 0.1;
  });

  // Route animation
  route.rotation.y = t * 0.12;
  route.position.y = Math.sin(t * 1.2) * 0.3;

  // Update fog shader
  fogMaterial.uniforms.uTime.value = t;

  // Controls update
  controls.update();

  // Render
  renderer.render(scene, camera);

  // FPS counter
  frameCount++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    updateStats(frameCount);
    frameCount = 0;
    lastTime = currentTime;
  }
}

// Initial info
setTimeout(() => {
  updateInfo(HOKKAIDO_SPOTS[0]);
}, 100);

animate();
