import * as THREE from 'three';
import { HOKKAIDO_BOUNDARY } from '../data/hokkaido-boundary.js';
import { BUS_ROUTES, RAIL_ROUTES } from '../data/routes.js';
import { geoToMap } from '../utils/geo.js';

// 背景として海を作成（北海道を囲む大きな海）
export function createOceanBackground(scene) {
  const geometry = new THREE.PlaneGeometry(600, 600, 48, 48);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0a5b7a,
    roughness: 0.7,
    metalness: 0.2
  });
  
  const ocean = new THREE.Mesh(geometry, material);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -8;
  ocean.receiveShadow = true;
  scene.add(ocean);
  
  return ocean;
}

// 波のアニメーション用シェーダー
export function createWaveShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
      uWaveAmplitude: { value: 0.3 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWaveAmplitude;
      varying float vWave;
      
      void main() {
        vec3 pos = position;
        float wave = sin(pos.x * 0.02 + uTime) * cos(pos.z * 0.02 + uTime * 0.7) * uWaveAmplitude;
        pos.y += wave;
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying float vWave;
      
      void main() {
        vec3 color = mix(vec3(0.04, 0.35, 0.47), vec3(0.1, 0.5, 0.6), vWave * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  };
}

// 北海道の詳細な地図シルエット（より正確で詳細な形）
export function createIsland(scene) {
  const island = new THREE.Group();
  const islandMat = new THREE.MeshPhysicalMaterial({
    color: 0x8dd499,
    roughness: 0.85,
    metalness: 0.05,
    clearcoat: 0.4,
    clearcoatRoughness: 0.8
  });
  HOKKAIDO_BOUNDARY.forEach((polygon) => {
    const shape = new THREE.Shape();
    polygon[0].forEach((point, index) => {
      const { x, z } = geoToMap(point);
      if (index === 0) shape.moveTo(x, -z);
      else shape.lineTo(x, -z);
    });

    for (let ringIndex = 1; ringIndex < polygon.length; ringIndex++) {
      const hole = new THREE.Path();
      polygon[ringIndex].forEach((point, index) => {
        const { x, z } = geoToMap(point);
        if (index === 0) hole.moveTo(x, -z);
        else hole.lineTo(x, -z);
      });
      shape.holes.push(hole);
    }

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 5, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, islandMat);
    mesh.position.y = -2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    island.add(mesh);
  });

  island.userData.topMaterial = islandMat;
  island.userData.islandMaterial = islandMat;
  scene.add(island);
  return island;
}

// 春：桜の花びら
export function createCherryBlossoms(scene) {
  const count = 700;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = Math.random() * 60 + 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 120;

    velocities[i3] = (Math.random() - 0.5) * 0.1;
    velocities[i3 + 1] = -0.15 - Math.random() * 0.08;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.velocities = velocities;

  const mat = new THREE.PointsMaterial({
    size: 1.0,
    color: 0xf5a7d8,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  particles.visible = false;
  scene.add(particles);

  return particles;
}

// 夏：ラッコが浮く
export function createOtterFloat(scene) {
  const count = 15;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 150;
    positions[i3 + 1] = 0.5;
    positions[i3 + 2] = (Math.random() - 0.5) * 150;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.spawnTimes = new Float32Array(count).map(() => Math.random() * 6);

  const mat = new THREE.PointsMaterial({
    size: 1.8,
    color: 0x8b6f47,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  particles.visible = false;
  scene.add(particles);

  return particles;
}

// 秋：鮭が跳ねる
export function createSalmonJump(scene) {
  const count = 25;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = 1;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.spawnTimes = new Float32Array(count).map(() => Math.random() * 4);

  const mat = new THREE.PointsMaterial({
    size: 1.4,
    color: 0xff6b4a,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  particles.visible = false;
  scene.add(particles);

  return particles;
}

// 秋：ジャガイモ収穫（茶色い粒子が落ちる）
export function createPotatoHarvest(scene) {
  const count = 500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 110;
    positions[i3 + 1] = Math.random() * 50 + 5;
    positions[i3 + 2] = (Math.random() - 0.5) * 110;

    const c = new THREE.Color().setHSL(0.08, 0.68, 0.48);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  particles.visible = false;
  scene.add(particles);

  return particles;
}

// 冬：雪の結晶
export function createSnowCrystals(scene) {
  const count = 900;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 130;
    positions[i3 + 1] = Math.random() * 60 + 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 130;

    velocities[i3] = (Math.random() - 0.5) * 0.06;
    velocities[i3 + 1] = -0.18 - Math.random() * 0.06;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.06;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.velocities = velocities;

  const mat = new THREE.PointsMaterial({
    size: 1.3,
    color: 0xffffff,
    transparent: true,
    opacity: 0.98,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  particles.visible = false;
  scene.add(particles);

  return particles;
}

function createRouteCurve(coordinates, elevation) {
  const points = coordinates.map((coordinate) => geoToMap(coordinate, elevation));
  return new THREE.CatmullRomCurve3(points, false, 'centripetal');
}

// 北海道の主要路線を位置模式図として描画
export function createRailwayWithTrain(scene) {
  const railGroup = new THREE.Group();
  const sleeperGeometry = new THREE.BoxGeometry(0.82, 0.12, 0.2);
  const sleeperMaterial = new THREE.MeshStandardMaterial({
    color: 0x55483b,
    roughness: 0.9
  });
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9cbd0,
    metalness: 0.72,
    roughness: 0.32,
    emissive: 0x26373b,
    emissiveIntensity: 0.2
  });
  let railCurve;

  RAIL_ROUTES.forEach((route, routeIndex) => {
    const curve = createRouteCurve(route.coordinates, 3.22);
    const sleeperCount = Math.ceil(curve.getLength() / 0.72);
    const sleepers = new THREE.InstancedMesh(sleeperGeometry, sleeperMaterial, sleeperCount);
    const sleeper = new THREE.Object3D();

    for (let index = 0; index < sleeperCount; index++) {
      const t = (index + 0.5) / sleeperCount;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      sleeper.position.copy(point);
      sleeper.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0);
      sleeper.updateMatrix();
      sleepers.setMatrixAt(index, sleeper.matrix);
    }

    sleepers.instanceMatrix.needsUpdate = true;
    railGroup.add(sleepers);

    [-0.2, 0.2].forEach((offset) => {
      const railCurve = new THREE.CatmullRomCurve3(
        curve.getPoints(100).map((point, index, points) => {
          const tangent = curve.getTangent(index / (points.length - 1));
          return point.clone().add(new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(offset));
        }),
        false,
        'centripetal'
      );
      const rail = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 100, 0.045, 6, false), railMaterial);
      railGroup.add(rail);
    });

    if (routeIndex === 0) {
      railCurve = curve;
    }
  });

  scene.add(railGroup);

  // 電車（小さなボックス）
  const trainGeometry = new THREE.BoxGeometry(0.7, 0.9, 1.4);
  const trainMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    emissive: 0xff6b35,
    emissiveIntensity: 0.35,
    metalness: 0.65
  });

  const train = new THREE.Mesh(trainGeometry, trainMaterial);
  train.castShadow = true;
  scene.add(train);

  const trainPos = railCurve.getPoint(0);
  train.position.copy(trainPos);
  train.position.y += 0.8;

  return { train, railCurve };
}

export function createBusRoutes(scene) {
  const routeGroup = new THREE.Group();
  const material = new THREE.LineDashedMaterial({
    color: 0x56e0d1,
    dashSize: 0.85,
    gapSize: 0.48,
    transparent: true,
    opacity: 0.9
  });

  BUS_ROUTES.forEach((route) => {
    const curve = createRouteCurve(route.coordinates, 3.48);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
      material
    );
    line.computeLineDistances();
    line.userData.routeName = route.name;
    routeGroup.add(line);
  });

  scene.add(routeGroup);
  return routeGroup;
}
