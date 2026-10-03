import * as THREE from 'three';

export function createMarkers(markerGroup, spots) {
  const markerMeshes = [];

  spots.forEach((spot, index) => {
    const holder = new THREE.Group();

    // Pin geometry
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.9, 3.5, 12),
      new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.35,
        roughness: 0.42,
        metalness: 0.16
      })
    );
    pin.position.y = 1.5;
    pin.castShadow = true;
    holder.add(pin);

    // Glow effect
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 18, 18),
      new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.45
      })
    );
    glow.position.y = 4.2;
    holder.add(glow);

    // Text label
    const labelCanvas = document.createElement('canvas');
    const labelCtx = labelCanvas.getContext('2d');
    const size = 256;

    labelCanvas.width = size;
    labelCanvas.height = size;

    labelCtx.clearRect(0, 0, size, size);
    labelCtx.fillStyle = 'rgba(6, 16, 27, 0.68)';
    labelCtx.strokeStyle = 'rgba(255,255,255,0.25)';
    labelCtx.lineWidth = 3;

    // Rounded rectangle for label
    const radius = 12;
    labelCtx.beginPath();
    labelCtx.moveTo(20, 64 + radius);
    labelCtx.lineTo(20, size - 20 - radius);
    labelCtx.quadraticCurveTo(20, size - 20, 20 + radius, size - 20);
    labelCtx.lineTo(size - 20 - radius, size - 20);
    labelCtx.quadraticCurveTo(size - 20, size - 20, size - 20, size - 20 - radius);
    labelCtx.lineTo(size - 20, 64 + radius);
    labelCtx.quadraticCurveTo(size - 20, 64, size - 20 - radius, 64);
    labelCtx.lineTo(20 + radius, 64);
    labelCtx.quadraticCurveTo(20, 64, 20, 64 + radius);
    labelCtx.closePath();
    labelCtx.fill();
    labelCtx.stroke();

    labelCtx.font = 'bold 48px "Segoe UI", sans-serif';
    labelCtx.fillStyle = '#ffffff';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillText(spot.emoji, size / 2, 96);

    labelCtx.font = 'bold 32px "Segoe UI", sans-serif';
    labelCtx.fillStyle = '#7be4d9';
    labelCtx.fillText(spot.name, size / 2, 140);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
      depthWrite: false
    });

    const label = new THREE.Sprite(labelMat);
    label.position.set(0, 9.2, 0);
    label.scale.set(9.5, 9.5, 1);
    holder.add(label);

    holder.position.copy(spot.position);
    markerGroup.add(holder);

    holder.userData = { spot, index };
    markerMeshes.push(holder);
  });

  return markerMeshes;
}
