import * as THREE from 'three';

export function setupInteractions(scene, markerGroup, camera, controls, uiState, fogMaterial, splatMat, island) {
  const titleNode = document.getElementById('title');
  const descriptionNode = document.getElementById('description');
  const detailNode = document.getElementById('spot-detail');

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function updateInfo(spot) {
    titleNode.textContent = `${spot.name} – 旅行の気分`;
    descriptionNode.textContent = spot.description + ' ' + spot.mood;
    detailNode.textContent = spot.fact;
    uiState.currentSpot = spot;
  }

  function toggleTheme(scene, splatMat, fogMaterial, island) {
    uiState.theme = uiState.theme === 'classic' ? 'dream' : 'classic';

    if (uiState.theme === 'dream') {
      scene.background = new THREE.Color(0x140e2a);
      scene.fog.color.set(0x8a71ff);
      scene.fog.density = 0.045;

      splatMat.opacity = 0.88;
      fogMaterial.uniforms.uColor.value = new THREE.Color(0xb496ff);
      fogMaterial.uniforms.uAlpha.value = 0.28;

      island.userData.islandMaterial.color.set(0x7ecb9b);
      island.userData.topMaterial.color.set(0x9fe6b2);
    } else {
      scene.background = new THREE.Color(0x091827);
      scene.fog.color.set(0x9ad7ff);
      scene.fog.density = 0.035;

      splatMat.opacity = 0.75;
      fogMaterial.uniforms.uColor.value = new THREE.Color(0x96d7ff);
      fogMaterial.uniforms.uAlpha.value = 0.17;

      island.userData.islandMaterial.color.set(0x6fcf9c);
      island.userData.topMaterial.color.set(0x8ee2a1);
    }
  }

  function toggleFog(fogMaterial) {
    uiState.fogEnabled = !uiState.fogEnabled;
    if (uiState.fogEnabled) {
      if (uiState.theme === 'classic') {
        scene.fog = new THREE.FogExp2(0x9ad7ff, 0.035);
      } else {
        scene.fog = new THREE.FogExp2(0x8a71ff, 0.045);
      }
      fogMaterial.visible = true;
    } else {
      scene.fog = null;
      fogMaterial.visible = false;
    }
  }

  function toggleParticles(splatCloud, splatMat) {
    uiState.particlesEnabled = !uiState.particlesEnabled;
    splatCloud.visible = uiState.particlesEnabled;
  }

  // Mouse interaction for marker selection
  window.addEventListener('pointerdown', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(markerGroup.children, true);

    if (hit.length > 0) {
      let marker = null;
      let obj = hit[0].object;

      while (obj && !marker) {
        if (obj.userData && obj.userData.spot) {
          marker = obj.userData.spot;
        }
        obj = obj.parent;
      }

      if (marker) {
        updateInfo(marker);
        // Animate camera to marker
        const targetPos = marker.position.clone();
        targetPos.y += 12;
        targetPos.z += 20;
        controls.target.copy(marker.position);
        controls.update();
      }
    }
  });

  return {
    updateInfo,
    toggleTheme: () => toggleTheme(scene, splatMat, fogMaterial, island),
    toggleFog: () => toggleFog(fogMaterial),
    toggleParticles: (splatCloud, splatMat) => toggleParticles(splatCloud, splatMat)
  };
}
