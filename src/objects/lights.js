import * as THREE from 'three';

export function setupLights(scene) {
  // Ambient Light
  const ambient = new THREE.AmbientLight(0xffffff, 1.65);
  scene.add(ambient);

  // Directional (Sun) Light
  const sun = new THREE.DirectionalLight(0xfff8d8, 1.8);
  sun.position.set(26, 36, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.far = 500;
  sun.shadow.camera.left = -80;
  sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  scene.add(sun);

  // Hemisphere Light
  const hemi = new THREE.HemisphereLight(0x9dd7ff, 0x234d3a, 0.9);
  scene.add(hemi);

  return { ambient, sun, hemi };
}
