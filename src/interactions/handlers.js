import * as THREE from 'three';

export function setupInteractions(scene, markerGroup, camera, controls, uiState, fogMaterial, splatMat, island) {
  const titleNode = document.getElementById('title');
  const descriptionNode = document.getElementById('description');
  const detailNode = document.getElementById('spot-detail');
  const linkNode = document.getElementById('spot-link');

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function updateInfo(spot) {
    titleNode.textContent = `${spot.name} – 旅の見どころ`;
    descriptionNode.textContent = `${spot.description} ${spot.mood}`;
    detailNode.textContent = spot.fact;
    uiState.currentSpot = spot;

    if (spot.website) {
      linkNode.href = spot.website;
      linkNode.textContent = `${spot.name} の公式サイト`;
      linkNode.style.display = 'inline-flex';
    } else {
      linkNode.style.display = 'none';
    }
  }

  function focusOnSpot(spot, smooth = true) {
    if (!spot) return;
    const targetPosition = spot.position.clone();
    const desiredCamera = targetPosition.clone().add(new THREE.Vector3(18, 18, 24));
    if (smooth) {
      controls.target.lerp(targetPosition.clone().add(new THREE.Vector3(0, 4, 0)), 0.08);
      camera.position.lerp(desiredCamera, 0.08);
    } else {
      controls.target.copy(targetPosition.clone().add(new THREE.Vector3(0, 4, 0)));
      camera.position.copy(desiredCamera);
    }
    controls.update();
  }

  function toggleTheme(scene, splatMat, fogMaterial, island) {
    uiState.theme = uiState.theme === 'classic' ? 'dream' : 'classic';

    if (uiState.theme === 'dream') {
      scene.background = new THREE.Color(0x140e2a);
      scene.fog.color.set(0x8a71ff);
      scene.fog.density = 0.045;

      splatMat.opacity = 0.88;
      fogMaterial.uniforms.uColor.value = new THREE.Color(0xb496ff);
      fogMaterial.uniforms.uAlpha.value = 0.26;

      island.userData.islandMaterial.color.set(0x7ecb9b);
      island.userData.topMaterial.color.set(0x9fe6b2);
    } else {
      scene.background = new THREE.Color(0x091827);
      scene.fog.color.set(0x9ad7ff);
      scene.fog.density = 0.032;

      splatMat.opacity = 0.7;
      fogMaterial.uniforms.uColor.value = new THREE.Color(0x96d7ff);
      fogMaterial.uniforms.uAlpha.value = 0.2;

      island.userData.islandMaterial.color.set(0x7ccf99);
      island.userData.topMaterial.color.set(0x9ce6b4);
    }
  }

  function toggleFog(fogMaterial) {
    uiState.fogEnabled = !uiState.fogEnabled;
    if (uiState.fogEnabled) {
      if (uiState.theme === 'classic') {
        scene.fog = new THREE.FogExp2(0x9ad7ff, 0.032);
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
        focusOnSpot(marker, true);
      }
    }
  });

  return {
    updateInfo,
    focusOnSpot,
    toggleTheme: () => toggleTheme(scene, splatMat, fogMaterial, island),
    toggleFog: () => toggleFog(fogMaterial),
    toggleParticles: (splatCloud, splatMat) => toggleParticles(splatCloud, splatMat)
  };
}
