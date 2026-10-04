import * as THREE from 'three';

export function createIsland(scene) {
  const islandShape = new THREE.Shape();
  const islandPts = [
    new THREE.Vector2(-34, -28),
    new THREE.Vector2(-28, -36),
    new THREE.Vector2(-18, -42),
    new THREE.Vector2(-5, -38),
    new THREE.Vector2(10, -30),
    new THREE.Vector2(18, -24),
    new THREE.Vector2(30, -18),
    new THREE.Vector2(36, -8),
    new THREE.Vector2(34, 2),
    new THREE.Vector2(28, 12),
    new THREE.Vector2(22, 22),
    new THREE.Vector2(12, 30),
    new THREE.Vector2(2, 34),
    new THREE.Vector2(-7, 32),
    new THREE.Vector2(-18, 28),
    new THREE.Vector2(-30, 18),
    new THREE.Vector2(-38, 8),
    new THREE.Vector2(-40, -4),
    new THREE.Vector2(-34, -28)
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
    color: 0x7ccf99,
    roughness: 0.88,
    metalness: 0.08,
    clearcoat: 0.5,
    clearcoatRoughness: 0.8
  });

  const island = new THREE.Mesh(islandGeo, islandMat);
  island.rotation.x = -Math.PI / 2;
  island.position.y = -6;
  island.castShadow = true;
  island.receiveShadow = true;
  scene.add(island);

  const islandTop = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80, 100, 100),
    new THREE.MeshStandardMaterial({
      color: 0x9ce6b4,
      roughness: 1,
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

export function createFog(scene) {
  const fogGeometry = new THREE.SphereGeometry(82, 32, 32);
  const fogMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x96d7ff) },
      uAlpha: { value: 0.2 }
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
        return sin(x * 2.2 + t * 1.1) * sin(y * 2.8 - t * 1.3) * sin((x + y) * 1.7 + t);
      }

      void main() {
        float n = wave(vPos.x, vPos.y, uTime) * 0.5 + 0.5;
        float alpha = smoothstep(0.2, 1.0, n);
        gl_FragColor = vec4(uColor, alpha * uAlpha);
      }
    `
  });

  const fog = new THREE.Mesh(fogGeometry, fogMaterial);
  scene.add(fog);

  return { fog, fogMaterial };
}

export function createParticles(scene) {
  const splatCount = 1800;
  const splatPositions = new Float32Array(splatCount * 3);
  const splatColors = new Float32Array(splatCount * 3);

  for (let i = 0; i < splatCount; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 90;
    const y = (Math.random() - 0.5) * 26 + 10;
    const z = (Math.random() - 0.5) * 90;

    splatPositions[i3] = x;
    splatPositions[i3 + 1] = y;
    splatPositions[i3 + 2] = z;

    const color = new THREE.Color().setHSL(0.53 + Math.random() * 0.08, 0.6, 0.65);
    splatColors[i3] = color.r;
    splatColors[i3 + 1] = color.g;
    splatColors[i3 + 2] = color.b;
  }

  const splatGeo = new THREE.BufferGeometry();
  splatGeo.setAttribute('position', new THREE.BufferAttribute(splatPositions, 3));
  splatGeo.setAttribute('color', new THREE.BufferAttribute(splatColors, 3));

  const splatMat = new THREE.PointsMaterial({
    size: 1.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    sizeAttenuation: true
  });

  const splatCloud = new THREE.Points(splatGeo, splatMat);
  scene.add(splatCloud);

  return { splatCloud, splatMat };
}

export function createSnowParticles(scene) {
  const count = 1400;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = Math.random() * 40 + 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 120;

    const color = new THREE.Color().setHSL(0.58, 0.2, 0.96);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    sizeAttenuation: true
  });

  const snow = new THREE.Points(geo, mat);
  snow.visible = false;
  scene.add(snow);

  return snow;
}

export function createRoute(scene, spots) {
  const routePoints = [
    spots[0].position,
    spots[1].position,
    spots[4].position,
    spots[2].position,
    spots[3].position,
    spots[5].position
  ];

  const routeCurve = new THREE.CatmullRomCurve3(routePoints);
  const routeGeometry = new THREE.TubeGeometry(routeCurve, 120, 0.35, 14, false);
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
