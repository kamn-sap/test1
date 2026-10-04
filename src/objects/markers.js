import * as THREE from 'three';

export function createMarkers(markerGroup, spots) {
  const markerMeshes = [];

  spots.forEach((spot) => {
    const holder = new THREE.Group();

    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 1.0, 3.8, 12),
      new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.4,
        roughness: 0.42,
        metalness: 0.16
      })
    );
    pin.position.y = 1.6;
    pin.castShadow = true;
    holder.add(pin);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.7, 18, 18),
      new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.55
      })
    );
    glow.position.y = 4.5;
    holder.add(glow);

    const labelCanvas = document.createElement('canvas');
    const labelCtx = labelCanvas.getContext('2d');
    const size = 256;
    labelCanvas.width = size;
    labelCanvas.height = size;

    labelCtx.clearRect(0, 0, size, size);
    labelCtx.fillStyle = 'rgba(6, 16, 27, 0.7)';
    labelCtx.strokeStyle = 'rgba(255,255,255,0.2)';
    labelCtx.lineWidth = 3;

    const radius = 14;
    labelCtx.beginPath();
    labelCtx.moveTo(20, 64 + radius);
    labelCtx.lineTo(20, size - 24 - radius);
    labelCtx.quadraticCurveTo(20, size - 24, 20 + radius, size - 24);
    labelCtx.lineTo(size - 24 - radius, size - 24);
    labelCtx.quadraticCurveTo(size - 24, size - 24, size - 24, size - 24 - radius);
    labelCtx.lineTo(size - 24, 64 + radius);
    labelCtx.quadraticCurveTo(size - 24, 64, size - 24 - radius, 64);
    labelCtx.lineTo(20 + radius, 64);
    labelCtx.quadraticCurveTo(20, 64, 20, 64 + radius);
    labelCtx.closePath();
    labelCtx.fill();
    labelCtx.stroke();

    labelCtx.font = 'bold 42px "Segoe UI", sans-serif';
    labelCtx.fillStyle = '#ffffff';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillText(spot.emoji, size / 2, 90);

    labelCtx.font = 'bold 28px "Segoe UI", sans-serif';
    labelCtx.fillStyle = '#7be4d9';
    labelCtx.fillText(spot.name, size / 2, 150);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
      depthWrite: false
    });

    const label = new THREE.Sprite(labelMat);
    label.position.set(0, 9.4, 0);
    label.scale.set(9.5, 9.5, 1);
    holder.add(label);

    holder.position.copy(spot.position);
    holder.userData = { spot };
    markerGroup.add(holder);
    markerMeshes.push(holder);
  });

  return markerMeshes;
}
