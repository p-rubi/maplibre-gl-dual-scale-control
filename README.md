# maplibre-dual-scale-control

This repository is a small fork of `mapbox-gl-dual-scale-control`, adapted to work with MapLibre GL JS (tested in v5.0).
This project preserves the original authorship and license while applying compatibility fixes and minor styling adjustments. 
It provides a dual-unit (metric and imperial) scale control for MapLibre GL, inspired by dual-unit scale controls available in other map frameworks such as Leaflet.

## Quick usage

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

## Browser demo

View the [live demo](https://p-rubi.github.io/maplibre-gl-dual-scale-control/demo/) or open `demo/index.html` locally (serve it from a static server) to try a minimal MapLibre demo that uses the control.

## Attribution

This project is based on `mapbox-gl-dual-scale-control`. Original license and authorship are preserved.
