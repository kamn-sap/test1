# 北海道トラベルマップ 🗾

**Interactive 3D Hokkaido Map** using Three.js r186 with volumetric fog, 3DGS-inspired particles, and humorous UI.

## Features

✨ **Three.js r186 Latest Technologies**
- Volumetric fog shader with dynamic waves
- 3DGS-inspired particle cloud (2400+ particles)
- Physical material rendering with clearcoat effects
- Real-time shadow mapping

🎮 **Interactive Controls**
- **Orbit Camera**: Drag to rotate, scroll to zoom
- **Click Markers**: Select travel spots for details
- **Theme Toggle**: Switch between classic and dream modes
- **Fog Toggle**: Show/hide volumetric effects
- **Particle Toggle**: Enable/disable particle effects
- **Reset View**: Return to default camera position

🌍 **7 Hokkaido Travel Spots**
1. **札幌 (Sapporo)** - Ramen capital 🍜
2. **小樽 (Otaru)** - Historic canal town 🌊
3. **富良野 (Furano)** - Lavender fields 🌼
4. **ニセコ (Niseko)** - Skiing paradise ⛷️
5. **洞爺湖 (Toyako)** - Lake & hot springs 🚤
6. **釧路 (Kushiro)** - Fresh seafood 🦐
7. **網走 (Abashiri)** - Drift ice viewing 🧊

## Installation

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Project Structure

```
├── index.html                 # Main entry point
├── src/
│   ├── main.js               # Application entry
│   ├── styles.css            # Global styles
│   ├── data/
│   │   └── spots.js          # Hokkaido travel spots data
│   ├── objects/
│   │   ├── geometry.js       # 3D geometries (island, fog, particles, route)
│   │   ├── lights.js         # Lighting setup
│   │   └── markers.js        # Travel spot markers
│   ├── interactions/
│   │   └── handlers.js       # User interactions & camera control
│   └── utils/
│       └── stats.js          # Performance monitoring
├── package.json
└── vite.config.js
```

## Customization Guide

### Adding New Travel Spots

Edit `src/data/spots.js`:

```javascript
{
  id: 'newplace',
  name: 'New Place',
  emoji: '📍',
  color: '#ff6b6b',
  position: new THREE.Vector3(x, y, z),
  description: 'Description of the place',
  mood: 'Travel mood or feeling',
  fact: 'Interesting fact'
}
```

### Changing Colors & Theme

Modify `src/interactions/handlers.js` in the `toggleTheme()` function to customize color schemes.

### Adjusting Particle Count

In `src/objects/geometry.js`, change `splatCount` in `createParticles()`:

```javascript
const splatCount = 3000; // Increase for more particles
```

### Modifying Island Shape

Edit the `islandPts` array in `src/objects/geometry.js` to reshape Hokkaido's outline.

## Performance Tips

- Reduce `splatCount` if experiencing frame drops
- Adjust `fogGeometry` detail (currently 32x32) for performance
- Use `minDistance` and `maxDistance` in `src/main.js` to control camera range

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ WebGL 2 required
- Mobile: ✅ Touch-friendly controls

## License

MIT

## Made with ❤️

Celebrating Hokkaido's beauty and travel spirit through interactive 3D visualization.
