import * as THREE from 'three';

export const HOKKAIDO_MAP_CENTER = [143, 43.5];
export const HOKKAIDO_MAP_SCALE = 8;

export function geoToMap([longitude, latitude], elevation = 0) {
  const [centerLongitude, centerLatitude] = HOKKAIDO_MAP_CENTER;
  return new THREE.Vector3(
    (longitude - centerLongitude) * HOKKAIDO_MAP_SCALE,
    elevation,
    -(latitude - centerLatitude) * HOKKAIDO_MAP_SCALE
  );
}
