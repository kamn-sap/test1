import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { HOKKAIDO_SPOTS } from './data/spots.js';
import {
  createOceanBackground,
  createIsland,
  createCherryBlossoms,
  createOtterFloat,
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
// 背景を海の色に
scene.background = new THREE.Color(0x1a6b8c);
scene.fog = new THREE.FogExp2(0x2a7ba8, 0.008);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(35, 32, 90);

const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.screenSpacePanning = true;
controls.minDistance = 20;
controls.maxDistance = 200;
controls.maxPolarAngle = Math.PI * 0.52;
controls.minPolarAngle = Math.PI * 0.12;
controls.target.set(0, 5, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;

setupLights(scene);

// 背景の海
const ocean = createOceanBackground(scene);

const island = createIsland(scene);
const cherryBlossoms = createCherryBlossoms(scene);
const otterFloat = createOtterFloat(scene);
const salmonJump = createSalmonJump(scene);
const potatoHarvest = createPotatoHarvest(scene);
const snowCrystals = createSnowCrystals(scene);

const markerGroup = new THREE.Group();
scene.add(markerGroup);
const markerMeshes = createMarkers(markerGroup, HOKKAIDO_SPOTS);

const { rail, train, railCurve } = createRailwayWithTrain(scene, HOKKAIDO_SPOTS);

const SEASON_PRESETS = {
  spring: {
    background: 0x2a8fb8,
    fog: 0x3aa8d0,
    fogDensity: 0.01,
    islandColor: 0x9ad8a6,
    topColor: 0xb9e8bf,
    particleVisible: 'cherry',
    lightColor: 0xfff8dc
  },
  summer: {
    background: 0x1a7ba8,
    fog: 0x2a9ec8,
    fogDensity: 0.012,
    islandColor: 0x7bcf9d,
    topColor: 0x9ee1b1,
    particleVisible: 'otter',
    lightColor: 0xfffacd
  },
  autumn: {
    background: 0x3a6b88,
    fog: 0x5a7ba0,
    fogDensity: 0.015,
    islandColor: 0xb56d4a,
    topColor: 0xd98761,
    particleVisible: 'salmon',
    lightColor: 0xff8c00
  },
  winter: {
    background: 0x0a3a4a,
    fog: 0x2a5a7a,
    fogDensity: 0.02,
    islandColor: 0x9cc7d9,
    topColor: 0xcceaf7,
    particleVisible: 'snow',
    lightColor: 0xe0f4ff
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

  ocean.material.color.set(preset.background);

  // すべてのパーティクルを非表示
  cherryBlossoms.visible = false;
  otterFloat.visible = false;
  salmonJump.visible = false;
  potatoHarvest.visible = false;
  snowCrystals.visible = false;

  // 季節に応じたパーティクルを表示
  if (preset.particleVisible === 'cherry') cherryBlossoms.visible = true;
  else if (preset.particleVisible === 'otter') otterFloat.visible = true;
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
  camera.position.set(35, 32, 90);
  controls.target.set(0, 5, 0);
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

  // 春：桜の花びら
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
      positions[i3] += Math.sin(t * 1.5 + i) * 0.03;

      if (positions[i3 + 1] < -4) {
        positions[i3] = (Math.random() - 0.5) * 120;
        positions[i3 + 1] = 60 + Math.random() * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 120;
      }
    }
    cherryBlossoms.geometry.attributes.position.needsUpdate = true;
  }

  // 夏：ラッコが浮く
  if (otterFloat.visible) {
    const positions = otterFloat.geometry.attributes.position.array;
    const spawnTimes = otterFloat.geometry.userData.spawnTimes;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const lifetime = (t - spawnTimes[i]) % 6;

      // 海面で浮いている（軽く波に揺られる）
      positions[i3 + 1] = 0.5 + Math.sin(t * 0.8 + i) * 0.3 + Math.cos(t * 1.2 + i * 0.5) * 0.2;
      positions[i3] += Math.sin(t * 0.5 + i) * 0.02;
      positions[i3 + 2] += Math.cos(t * 0.6 + i) * 0.02;
    }
    otterFloat.geometry.attributes.position.needsUpdate = true;
  }

  // 秋：鮭が跳ねる
  if (salmonJump.visible) {
    const positions = salmonJump.geometry.attributes.position.array;
    const spawnTimes = salmonJump.geometry.userData.spawnTimes;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const lifetime = (t - spawnTimes[i]) % 4.5;

      if (lifetime < 4.5) {
        // 放物線で跳ねる
        const progress = lifetime / 4.5;
        positions[i3 + 1] = 1 + Math.sin(progress * Math.PI) * 8;
      }
    }
    salmonJump.geometry.attributes.position.needsUpdate = true;
  }

  // 秋：ジャガイモ収穫
  if (potatoHarvest.visible) {
    const positions = potatoHarvest.geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= 0.1;
      positions[i3] += Math.sin(t * 1.8 + i) * 0.012;

      if (positions[i3 + 1] < -2) {
        positions[i3] = (Math.random() - 0.5) * 110;
        positions[i3 + 1] = Math.random() * 50 + 5;
        positions[i3 + 2] = (Math.random() - 0.5) * 110;
      }
    }
    potatoHarvest.geometry.attributes.position.needsUpdate = true;
  }

  // 冬：雪の結晶
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
      positions[i3] += Math.cos(t * 1.2 + i) * 0.02;

      if (positions[i3 + 1] < -4) {
        positions[i3] = (Math.random() - 0.5) * 130;
        positions[i3 + 1] = 60 + Math.random() * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 130;
      }
    }
    snowCrystals.geometry.attributes.position.needsUpdate = true;
  }
}

function animateTrain() {
  const t = clock.getElapsedTime();
  const progress = (t * 0.15) % 1; // ゆっくり移動

  const trainPos = railCurve.getPoint(progress);
  train.position.copy(trainPos);
  train.position.y += 1;

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
    const bob = Math.sin(t * 1.4 + index * 0.6) * 0.5;
    const sway = Math.cos(t * 0.8 + index) * 0.08;
    marker.position.y = marker.userData.spot.position.y + bob;
    marker.rotation.z = sway * 0.12;
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
