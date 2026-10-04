import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { HOKKAIDO_SPOTS } from './data/spots.js';
import {
  createIsland,
  createCherryBlossoms,
  createSalmonJump,
  createPotatoHarvest,
  createSnowCrystals,
  createRailwayWithTrain
} from './objects/geometry.js';
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
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0xb0e0e6, 0.015);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(30, 28, 80);

const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.screenSpacePanning = true;
controls.minDistance = 18;
controls.maxDistance = 180;
controls.maxPolarAngle = Math.PI * 0.5;
controls.minPolarAngle = Math.PI * 0.15;
controls.target.set(0, 8, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

setupLights(scene);

const island = createIsland(scene);
const cherryBlossoms = createCherryBlossoms(scene);
const salmonJump = createSalmonJump(scene);
const potatoHarvest = createPotatoHarvest(scene);
const snowCrystals = createSnowCrystals(scene);

const markerGroup = new THREE.Group();
scene.add(markerGroup);
const markerMeshes = createMarkers(markerGroup, HOKKAIDO_SPOTS);

const { rail, train, railCurve } = createRailwayWithTrain(scene, HOKKAIDO_SPOTS);

const SEASON_PRESETS = {
  spring: {
    background: 0xf0e8d8,
    fog: 0xe8dcc8,
    fogDensity: 0.012,
    islandColor: 0x9ad8a6,
    topColor: 0xb9e8bf,
    particleVisible: 'cherry'
  },
  summer: {
    background: 0xcfe8ff,
    fog: 0xb0e0e6,
    fogDensity: 0.014,
    islandColor: 0x7bcf9d,
    topColor: 0x9ee1b1,
    particleVisible: 'salmon'
  },
  autumn: {
    background: 0xd4a574,
    fog: 0xcc9966,
    fogDensity: 0.02,
    islandColor: 0xb56d4a,
    topColor: 0xd98761,
    particleVisible: 'potato'
  },
  winter: {
    background: 0x091d2d,
    fog: 0xdfeaf8,
    fogDensity: 0.025,
    islandColor: 0x9cc7d9,
    topColor: 0xcceaf7,
    particleVisible: 'snow'
  }
};

const uiState = {
  season: 'spring',
  currentSpot: HOKKAIDO_SPOTS[0]
};

const { updateInfo, focusOnSpot } = setupInteractions(
  scene,
  markerGroup,
  camera,
  controls,
  uiState,
  island
);

function setSeason(seasonName) {
  const preset = SEASON_PRESETS[seasonName];
  uiState.season = seasonName;

  scene.background = new THREE.Color(preset.background);
  scene.fog.color.set(preset.fog);
  scene.fog.density = preset.fogDensity;

  island.userData.islandMaterial.color.set(preset.islandColor);
  island.userData.topMaterial.color.set(preset.topColor);

  // すべてのパーティクルを非表示
  cherryBlossoms.visible = false;
  salmonJump.visible = false;
  potatoHarvest.visible = false;
  snowCrystals.visible = false;

  // 季節に応じたパーティクルを表示
  if (preset.particleVisible === 'cherry') cherryBlossoms.visible = true;
  else if (preset.particleVisible === 'salmon') salmonJump.visible = true;
  else if (preset.particleVisible === 'potato') potatoHarvest.visible = true;
  else if (preset.particleVisible === 'snow') snowCrystals.visible = true;

  document.querySelectorAll('.season-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.season === seasonName);
  });
}

const resetBtn = document.getElementById('resetBtn');
const seasonButtons = [...document.querySelectorAll('.season-btn')];

resetBtn.addEventListener('click', () => {
  camera.position.set(30, 28, 80);
  controls.target.set(0, 8, 0);
  controls.update();
  focusOnSpot(HOKKAIDO_SPOTS[0], false);
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

function animateParticles() {
  const t = clock.getElapsedTime();

  // 桜の花びら
  if (cherryBlossoms.visible) {
    const positions = cherryBlossoms.geometry.attributes.position.array;
    const velocities = cherryBlossoms.geometry.userData.velocities;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // 波の動き
      positions[i3] += Math.sin(t * 2 + i) * 0.02;

      if (positions[i3 + 1] < -4) {
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = 50 + Math.random() * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
      }
    }
    cherryBlossoms.geometry.attributes.position.needsUpdate = true;
  }

  // 鮭のジャンプ
  if (salmonJump.visible) {
    const positions = salmonJump.geometry.attributes.position.array;
    const spawnTimes = salmonJump.geometry.userData.spawnTimes;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const lifetime = (t - spawnTimes[i]) % 4;

      if (lifetime < 4) {
        // 放物線で跳ねる
        const progress = lifetime / 4;
        positions[i3 + 1] = 2 + Math.sin(progress * Math.PI) * 6;
      }
    }
    salmonJump.geometry.attributes.position.needsUpdate = true;
  }

  // ジャガイモ
  if (potatoHarvest.visible) {
    const positions = potatoHarvest.geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= 0.08;
      positions[i3] += Math.sin(t * 2 + i) * 0.01;

      if (positions[i3 + 1] < -2) {
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = Math.random() * 40 + 3;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
      }
    }
    potatoHarvest.geometry.attributes.position.needsUpdate = true;
  }

  // 雪の結晶
  if (snowCrystals.visible) {
    const positions = snowCrystals.geometry.attributes.position.array;
    const velocities = snowCrystals.geometry.userData.velocities;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // ふわふわした動き
      positions[i3] += Math.cos(t + i) * 0.015;

      if (positions[i3 + 1] < -4) {
        positions[i3] = (Math.random() - 0.5) * 110;
        positions[i3 + 1] = 50 + Math.random() * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 110;
      }
    }
    snowCrystals.geometry.attributes.position.needsUpdate = true;
  }
}

function animateTrain() {
  const t = clock.getElapsedTime();
  const progress = (t * 0.25) % 1; // ゆっくり移動

  const trainPos = railCurve.getPoint(progress);
  train.position.copy(trainPos);
  train.position.y += 0.5;

  // 進行方向に向かせる
  const nextPos = railCurve.getPoint(Math.min(progress + 0.01, 1));
  train.lookAt(nextPos);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();
  animateTrain();

  markerMeshes.forEach((marker, index) => {
    const t = clock.getElapsedTime();
    const bob = Math.sin(t * 1.5 + index * 0.6) * 0.6;
    const sway = Math.cos(t * 0.9 + index) * 0.1;
    marker.position.y = marker.userData.spot.position.y + bob;
    marker.rotation.z = sway * 0.15;
  });

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
