import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { HOKKAIDO_SPOTS } from './data/spots.js';
import { createIsland, createFog, createParticles, createSnowParticles, createRoute } from './objects/geometry.js';
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
const snowParticles = createSnowParticles(scene);
const route = createRoute(scene, HOKKAIDO_SPOTS);

const markerGroup = new THREE.Group();
scene.add(markerGroup);
const markerMeshes = createMarkers(markerGroup, HOKKAIDO_SPOTS);

const SEASON_PRESETS = {
  spring: {
    background: 0xeaf7f1,
    fogColor: 0xd8eadf,
    fogDensity: 0.026,
    fogAlpha: 0.18,
    islandColor: 0x9ad8a6,
    topColor: 0xb9e8bf,
    particleHue: 0.95,
    particleSaturation: 0.52,
    particleLightness: 0.72,
    snow: false
  },
  summer: {
    background: 0xcfe8ff,
    fogColor: 0x9ad7ff,
    fogDensity: 0.03,
    fogAlpha: 0.2,
    islandColor: 0x7bcf9d,
    topColor: 0x9ee1b1,
    particleHue: 0.58,
    particleSaturation: 0.6,
    particleLightness: 0.69,
    snow: false
  },
  autumn: {
    background: 0x2b1c18,
    fogColor: 0xcc8457,
    fogDensity: 0.04,
    fogAlpha: 0.24,
    islandColor: 0xb56d4a,
    topColor: 0xd98761,
    particleHue: 0.09,
    particleSaturation: 0.7,
    particleLightness: 0.62,
    snow: false
  },
  winter: {
    background: 0x091d2d,
    fogColor: 0xdfeaf8,
    fogDensity: 0.055,
    fogAlpha: 0.3,
    islandColor: 0x9cc7d9,
    topColor: 0xcceaf7,
    particleHue: 0.58,
    particleSaturation: 0.25,
    particleLightness: 0.9,
    snow: true
  }
};

const uiState = {
  fogEnabled: true,
  particlesEnabled: true,
  theme: 'classic',
  season: 'spring',
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

function recolorParticles(seasonName) {
  const preset = SEASON_PRESETS[seasonName];
  const color = new THREE.Color();
  const attr = splatCloud.geometry.attributes.color;
  for (let i = 0; i < attr.count; i++) {
    color.setHSL(
      preset.particleHue + (Math.random() - 0.5) * 0.08,
      preset.particleSaturation,
      preset.particleLightness
    );
    attr.array[i * 3] = color.r;
    attr.array[i * 3 + 1] = color.g;
    attr.array[i * 3 + 2] = color.b;
  }
  attr.needsUpdate = true;
}

function setSeason(seasonName) {
  const preset = SEASON_PRESETS[seasonName];
  uiState.season = seasonName;

  scene.background = new THREE.Color(preset.background);
  scene.fog.color.set(preset.fogColor);
  scene.fog.density = preset.fogDensity;
  fogMaterial.uniforms.uColor.value = new THREE.Color(preset.fogColor);
  fogMaterial.uniforms.uAlpha.value = preset.fogAlpha;

  island.userData.islandMaterial.color.set(preset.islandColor);
  island.userData.topMaterial.color.set(preset.topColor);

  recolorParticles(seasonName);
  snowParticles.visible = preset.snow && uiState.particlesEnabled;

  document.querySelectorAll('.season-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.season === seasonName);
  });
}

const resetBtn = document.getElementById('resetBtn');
const toggleFogBtn = document.getElementById('toggleFogBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const toggleParticlesBtn = document.getElementById('toggleParticlesBtn');
const seasonButtons = [...document.querySelectorAll('.season-btn')];

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
  if (uiState.season === 'winter') {
    snowParticles.visible = uiState.particlesEnabled;
  }
});

seasonButtons.forEach((button) => {
  button.addEventListener('click', () => setSeason(button.dataset.season));
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

function animateSnow() {
  const positions = snowParticles.geometry.attributes.position.array;
  const count = positions.length / 3;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3 + 1] -= 0.15 + (i % 5) * 0.02;

    if (positions[i3 + 1] < -4) {
      positions[i3] = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = 26 + Math.random() * 18;
      positions[i3 + 2] = (Math.random() - 0.5) * 120;
    }
  }

  snowParticles.geometry.attributes.position.needsUpdate = true;
  snowParticles.rotation.y += 0.004;
}

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

  if (uiState.season === 'winter' && snowParticles.visible) {
    animateSnow();
  }

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

setSeason('spring');
setTimeout(() => {
  updateInfo(HOKKAIDO_SPOTS[0]);
  focusOnSpot(HOKKAIDO_SPOTS[0], false);
}, 120);

animate();
