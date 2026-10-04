import * as THREE from 'three';

// 北海道の詳細なシルエット
export function createIsland(scene) {
  const islandShape = new THREE.Shape();
  // より詳細で北海道らしいシルエット
  const islandPts = [
    // 北西部
    new THREE.Vector2(-38, -32),
    new THREE.Vector2(-42, -28),
    new THREE.Vector2(-44, -18),
    new THREE.Vector2(-40, -10),
    // 北部
    new THREE.Vector2(-30, -38),
    new THREE.Vector2(-15, -44),
    new THREE.Vector2(5, -42),
    new THREE.Vector2(20, -35),
    // 東北部
    new THREE.Vector2(32, -26),
    new THREE.Vector2(40, -14),
    // 東部
    new THREE.Vector2(42, 4),
    new THREE.Vector2(38, 18),
    // 南東部
    new THREE.Vector2(28, 28),
    new THREE.Vector2(16, 34),
    // 南部
    new THREE.Vector2(2, 36),
    new THREE.Vector2(-8, 34),
    new THREE.Vector2(-18, 30),
    // 南西部
    new THREE.Vector2(-32, 22),
    new THREE.Vector2(-40, 12),
    new THREE.Vector2(-44, 2),
    new THREE.Vector2(-46, -8),
    new THREE.Vector2(-42, -20),
    new THREE.Vector2(-38, -32)
  ];

  islandShape.moveTo(islandPts[0].x, islandPts[0].y);
  for (let i = 1; i < islandPts.length; i++) {
    islandShape.lineTo(islandPts[i].x, islandPts[i].y);
  }

  const islandGeo = new THREE.ExtrudeGeometry(islandShape, {
    depth: 8,
    bevelEnabled: false
  });
  islandGeo.center();

  const islandMat = new THREE.MeshPhysicalMaterial({
    color: 0x8dd499,
    roughness: 0.85,
    metalness: 0.05,
    clearcoat: 0.4,
    clearcoatRoughness: 0.8
  });

  const island = new THREE.Mesh(islandGeo, islandMat);
  island.rotation.x = -Math.PI / 2;
  island.position.y = -6;
  island.castShadow = true;
  island.receiveShadow = true;
  scene.add(island);

  const islandTop = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 120, 120),
    new THREE.MeshStandardMaterial({
      color: 0xa8e6b8,
      roughness: 0.95,
      metalness: 0
    })
  );
  islandTop.rotation.x = -Math.PI / 2;
  islandTop.position.y = -1.4;
  islandTop.receiveShadow = true;
  scene.add(islandTop);

  island.userData.topMaterial = islandTop.material;
  island.userData.islandMaterial = islandMat;
  return island;
}

// 春：桜の花びら
export function createCherryBlossoms(scene) {
  const count = 800;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = Math.random() * 50 + 5;
    positions[i3 + 2] = (Math.random() - 0.5) * 100;

    velocities[i3] = (Math.random() - 0.5) * 0.08;
    velocities[i3 + 1] = -0.12 - Math.random() * 0.06;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.08;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.velocities = velocities;

  const mat = new THREE.PointsMaterial({
    size: 0.8,
    color: 0xf5a7d8,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geo, mat);
  particles.visible = false;
  scene.add(particles);

  return particles;
}

// 夏：鮭が跳ねる
export function createSalmonJump(scene) {
  const count = 20;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.spawnTimes = new Float32Array(count).map(() => Math.random() * 4);

  const mat = new THREE.PointsMaterial({
    size: 1.2,
    color: 0xff6b4a,
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

// 秋：ジャガイモ収穫（茶色い粒子）
export function createPotatoHarvest(scene) {
  const count = 600;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = Math.random() * 40 + 3;
    positions[i3 + 2] = (Math.random() - 0.5) * 100;

    const c = new THREE.Color().setHSL(0.08, 0.65, 0.45);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
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
  const count = 1200;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 110;
    positions[i3 + 1] = Math.random() * 50 + 5;
    positions[i3 + 2] = (Math.random() - 0.5) * 110;

    velocities[i3] = (Math.random() - 0.5) * 0.04;
    velocities[i3 + 1] = -0.15 - Math.random() * 0.05;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.04;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.velocities = velocities;

  const mat = new THREE.PointsMaterial({
    size: 1.2,
    color: 0xffffff,
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

// 線路と電車
export function createRailwayWithTrain(scene, spots) {
  const railPoints = [
    spots[0].position,
    spots[1].position,
    spots[4].position,
    spots[2].position,
    spots[3].position,
    spots[5].position
  ];

  const railCurve = new THREE.CatmullRomCurve3(railPoints);

  // 線路
  const railGeometry = new THREE.TubeGeometry(railCurve, 200, 0.25, 8, false);
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    emissive: 0x4a3c2a,
    emissiveIntensity: 0.3,
    roughness: 0.8
  });

  const rail = new THREE.Mesh(railGeometry, railMaterial);
  rail.castShadow = true;
  rail.receiveShadow = true;
  scene.add(rail);

  // 電車（小さいボックス）
  const trainGeometry = new THREE.BoxGeometry(0.6, 0.8, 1.2);
  const trainMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    emissive: 0xff6b35,
    emissiveIntensity: 0.4,
    metalness: 0.6
  });

  const train = new THREE.Mesh(trainGeometry, trainMaterial);
  train.castShadow = true;
  scene.add(train);

  // 電車の初期位置
  const trainPos = railCurve.getPoint(0);
  train.position.copy(trainPos);
  train.position.y += 0.5;

  return { rail, train, railCurve };
}
