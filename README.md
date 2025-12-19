# maplibre-dual-scale-control

Dual-unit barscale control adapted for Maplibre GL — fork by **p-rubi**.

Usage

- Install as a dependency (from GitHub or npm if published):

```bash
npm install p-rubi/maplibre-dual-scale-control
# maplibre-dual-scale-control

Dual-unit barscale control adapted for Maplibre GL — fork by **p-rubi**.

This repository is a small fork that adapts `mapbox-gl-dual-scale-control` to work with Maplibre GL (tested with Maplibre GL v5.0). Maplibre is a community fork of Mapbox GL; this project preserves original authorship and license while applying compatibility fixes and small styling adjustments.

Quick usage

- Install from GitHub (no npm publish required):

```bash
npm install p-rubi/maplibre-gl-dual-scale-control
```

- Example (ES module / bundler):

```js
import maplibregl from 'maplibre-gl';
import DualScaleControl from 'maplibre-dual-scale-control';

const map = new maplibregl.Map({ /* ... */ });
map.addControl(new DualScaleControl(), 'bottom-left');
```

Browser demo

Open `demo/index.html` (serve it from a static server) to try a minimal Maplibre demo that uses the control.

Attribution

This project is based on `mapbox-gl-dual-scale-control`. Original license and authorship are preserved. Changes and compatibility fixes by **p-rubi** are documented in the repo history.
