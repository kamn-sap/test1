import * as THREE from 'three';

// ============================================================
// Island (Hokkaido shape)
// ============================================================
export function createIsland(scene) {
  const islandShape = new THREE.Shape();
  const islandPts = [
    new THREE.Vector2(-18, -30),
    new THREE.Vector2(-10, -34),
    new THREE.Vector2(-2, -32),
    new THREE.Vector2(8, -28),
    new THREE.Vector2(18, -22),
    new THREE.Vector2(26, -12),
    new THREE.Vector2(26, -2),
    new THREE.Vector2(20, 10),
    new THREE.Vector2(16, 20),
    new THREE.Vector2(8, 26),
    new THREE.Vector2(0, 32),
    new THREE.Vector2(-10, 30),
    new THREE.Vector2(-18, 20),
    new THREE.Vector2(-28, 10),
    new THREE.Vector2(-30, -4),
    new THREE.Vector2(-26, -18),
    new THREE.Vector2(-18, -30),
  ];

  islandShape.moveTo(islandPts[0].x, islandPts[0].y);
  for (let i = 1; i < islandPts.length; i++) {
    islandShape.lineTo(islandPts[i].x, islandPts[i].y);
  }

  const islandGeo = new THREE.ExtrudeGeometry(islandShape, {
    depth: 6,
    bevelEnabled: false
  });
  islandGeo.center();

  const islandMat = new THREE.MeshPhysicalMaterial({
    color: 0x6fcf9c,
    roughness: 0.8,
    metalness: 0.08,
    clearcoat: 0.4,
    clearcoatRoughness: 0.8
  });

  const island = new THREE.Mesh(islandGeo, islandMat);
  island.rotation.x = -Math.PI / 2;
  island.position.y = -5;
  island.castShadow = true;
  island.receiveShadow = true;
  scene.add(island);

  // Island top surface
  const islandTop = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60, 80, 80),
    new THREE.MeshStandardMaterial({
      color: 0x8ee2a1,
      roughness: 1,
      metalness: 0
    })
  );
  islandTop.rotation.x = -Math.PI / 2;
  islandTop.position.y = -1;
  islandTop.receiveShadow = true;
  scene.add(islandTop);

  island.userData.topMaterial = islandTop.material;
  island.userData.islandMaterial = islandMat;

  return island;
}

// ============================================================
// Volumetric Fog (Shader-based)
// ============================================================
export function createFog(scene) {
  const fogGeometry = new THREE.SphereGeometry(74, 32, 32);
  const fogMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x96d7ff) },
      uAlpha: { value: 0.17 }
    },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uAlpha;
      varying vec3 vPos;

      float wave(float x, float y, float t) {
        return sin(x * 2.4 + t * 1.2) * sin(y * 3.1 - t * 1.4) * sin((x + y) * 1.7 + t);
      }

      void main() {
        float n = wave(vPos.x, vPos.y, uTime) * 0.5 + 0.5;
        float alpha = smoothstep(0.25, 1.0, n);
        gl_FragColor = vec4(uColor, alpha * uAlpha);
      }
    `
  });

  const fog = new THREE.Mesh(fogGeometry, fogMaterial);
  scene.add(fog);

  return { fog, fogMaterial };
}

// ============================================================
// 3DGS-like Particle Cloud
// ============================================================
export function createParticles(scene) {
  const splatCount = 2400;
  const splatPositions = new Float32Array(splatCount * 3);
  const splatColors = new Float32Array(splatCount * 3);
  const splatSizes = new Float32Array(splatCount);

  for (let i = 0; i < splatCount; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 90;
    const y = (Math.random() - 0.5) * 28 + 10;
    const z = (Math.random() - 0.5) * 90;

    splatPositions[i3] = x;
    splatPositions[i3 + 1] = y;
    splatPositions[i3 + 2] = z;

    const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.08, 0.65, 0.62);
    splatColors[i3] = color.r;
    splatColors[i3 + 1] = color.g;
    splatColors[i3 + 2] = color.b;

    splatSizes[i] = Math.random() * 1.8 + 0.4;
  }

  const splatGeo = new THREE.BufferGeometry();
  splatGeo.setAttribute('position', new THREE.BufferAttribute(splatPositions, 3));
  splatGeo.setAttribute('color', new THREE.BufferAttribute(splatColors, 3));
  splatGeo.setAttribute('size', new THREE.BufferAttribute(splatSizes, 1));

  const splatMat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    sizeAttenuation: true
  });

  const splatCloud = new THREE.Points(splatGeo, splatMat);
  scene.add(splatCloud);

  return { splatCloud, splatMat };
}

// ============================================================
// Route Path (Travel route visualization)
// ============================================================
export function createRoute(scene, spots) {
  const routePoints = [
    spots[0].position, // Sapporo
    spots[1].position, // Otaru
    spots[4].position, // Toyako
    spots[2].position, // Furano
  ];

  const routeCurve = new THREE.CatmullRomCurve3(routePoints);
  const routeGeometry = new THREE.TubeGeometry(routeCurve, 100, 0.32, 10, false);
  const routeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffb703,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.72
  });

  const route = new THREE.Mesh(routeGeometry, routeMaterial);
  route.castShadow = true;
  route.receiveShadow = true;
  scene.add(route);

  return route;
}
