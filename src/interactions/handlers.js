import * as THREE from 'three';

export function setupInteractions(scene, markerGroup, camera, controls, uiState, island) {
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
    const desiredCamera = targetPosition.clone().add(new THREE.Vector3(16, 16, 22));
    if (smooth) {
      controls.target.lerp(targetPosition.clone().add(new THREE.Vector3(0, 4, 0)), 0.08);
      camera.position.lerp(desiredCamera, 0.08);
    } else {
      controls.target.copy(targetPosition.clone().add(new THREE.Vector3(0, 4, 0)));
      camera.position.copy(desiredCamera);
    }
    controls.update();
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
    focusOnSpot
  };
}
