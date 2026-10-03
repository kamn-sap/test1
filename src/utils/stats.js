export function updateStats(fps) {
  const fpsElement = document.getElementById('fps');
  if (fpsElement) {
    fpsElement.textContent = `FPS: ${fps}`;
  }
}
