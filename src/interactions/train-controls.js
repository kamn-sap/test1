import * as THREE from 'three';

const RAIL_HEIGHT = 3.22;
const TRAIN_CENTER_HEIGHT = RAIL_HEIGHT + 0.8;
const ROUTE_SAMPLE_COUNT = 160;

export function setupTrainControls(canvas, camera, controls, train, routeCurves, spots, onStop) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -RAIL_HEIGHT);
  const dragPoint = new THREE.Vector3();
  const stopIds = new Set(routeCurves.flatMap(({ stationIds }) => stationIds));
  const stops = spots.filter((spot) => stopIds.has(spot.id));
  const routeSamples = routeCurves.flatMap(({ curve }) =>
    Array.from({ length: ROUTE_SAMPLE_COUNT + 1 }, (_, index) => {
      const progress = index / ROUTE_SAMPLE_COUNT;
      return {
        point: curve.getPointAt(progress),
        tangent: curve.getTangentAt(progress)
      };
    })
  );
  let dragging = false;
  let pointerId = null;

  if (routeSamples.length === 0 || stops.length === 0) {
    throw new Error('Train controls require railway routes and station stops.');
  }

  function setRayFromEvent(event) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
  }

  function nearestRoutePoint(position) {
    let nearest = null;
    let nearestDistance = Infinity;

    routeSamples.forEach((sample) => {
      const dx = sample.point.x - position.x;
      const dz = sample.point.z - position.z;
      const distance = dx * dx + dz * dz;
      if (distance < nearestDistance) {
        nearest = sample;
        nearestDistance = distance;
      }
    });

    return nearestDistance < 30.25 ? nearest : null;
  }

  function placeTrain(point, tangent) {
    train.position.set(point.x, TRAIN_CENTER_HEIGHT, point.z);
    train.rotation.y = Math.atan2(tangent.x, tangent.z);
  }

  function moveToStop(spot) {
    const sample = nearestRoutePoint(spot.position);
    if (!sample) throw new Error(`No railway route found near ${spot.name}.`);
    placeTrain(sample.point, sample.tangent);
  }

  function finishDrag(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    event.preventDefault();
    event.stopPropagation();

    const nearestStop = stops.reduce((nearest, spot) => {
      const dx = spot.position.x - train.position.x;
      const dz = spot.position.z - train.position.z;
      const distance = dx * dx + dz * dz;
      return distance < nearest.distance ? { spot, distance } : nearest;
    }, { spot: null, distance: Infinity }).spot;

    dragging = false;
    pointerId = null;
    controls.enabled = true;
    canvas.style.cursor = 'grab';
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);

    if (nearestStop) {
      moveToStop(nearestStop);
      onStop(nearestStop);
    }
  }

  if (routeSamples.length > 0) placeTrain(routeSamples[0].point, routeSamples[0].tangent);

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    setRayFromEvent(event);
    if (raycaster.intersectObject(train, false).length === 0) return;

    event.preventDefault();
    event.stopPropagation();
    dragging = true;
    pointerId = event.pointerId;
    controls.enabled = false;
    canvas.style.cursor = 'grabbing';
    canvas.setPointerCapture(event.pointerId);
  }, true);

  canvas.addEventListener('pointermove', (event) => {
    setRayFromEvent(event);

    if (!dragging) {
      canvas.style.cursor = raycaster.intersectObject(train, false).length ? 'grab' : '';
      return;
    }

    if (event.pointerId !== pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const position = raycaster.ray.intersectPlane(dragPlane, dragPoint);
    const nearest = position && nearestRoutePoint(position);
    if (nearest) placeTrain(nearest.point, nearest.tangent);
  }, true);

  canvas.addEventListener('pointerup', finishDrag, true);
  canvas.addEventListener('pointercancel', finishDrag, true);

  return { moveToStop };
}
