import { distanceMeters, metricScale, imperialScale } from './scale.js';

const DEFAULT_OPTIONS = {
  maxWidth: 100,
  showCoordinates: false,
  coordinatePrecision: 6,
  theme: 'light'
};

function createEl(className, parent) {
  const el = document.createElement('div');
  el.className = className;
  if (parent) parent.appendChild(el);
  return el;
}

/**
 * A MapLibre GL JS control that shows a metric and an imperial scale bar at
 * the same time, sharing one central axis.
 *
 * @implements {maplibregl.IControl}
 * @param {object} [options]
 * @param {number} [options.maxWidth=100] Maximum length of the bars, in pixels.
 * @param {boolean} [options.showCoordinates=false] Show the lng/lat under the mouse pointer.
 * @param {number} [options.coordinatePrecision=6] Decimal places of the coordinates.
 * @param {'light'|'dark'} [options.theme='light'] Colour theme of the control.
 * @example
 * map.addControl(new DualScaleControl({ maxWidth: 120 }), 'bottom-left');
 */
export class DualScaleControl {
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._onMove = this._onMove.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
  }

  getDefaultPosition() {
    return 'bottom-left';
  }

  onAdd(map) {
    this._map = map;

    const { theme, showCoordinates } = this.options;
    this._container = createEl('maplibregl-ctrl maplibregl-ctrl-dual-scale');
    if (theme === 'dark') this._container.classList.add('maplibregl-ctrl-dual-scale--dark');

    if (showCoordinates) {
      this._coordsEl = createEl('maplibregl-ctrl-dual-scale-coords', this._container);
      map.on('mousemove', this._onMouseMove);
    }
    this._metricEl = createEl('maplibregl-ctrl-dual-scale-metric', this._container);
    this._imperialEl = createEl('maplibregl-ctrl-dual-scale-imperial', this._container);

    map.on('move', this._onMove);
    map.on('resize', this._onMove);
    this._onMove();

    // MapLibre inserts the returned element into the corner chosen in addControl().
    return this._container;
  }

  onRemove() {
    const map = this._map;
    if (map) {
      map.off('move', this._onMove);
      map.off('resize', this._onMove);
      map.off('mousemove', this._onMouseMove);
    }
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
    this._container = this._coordsEl = this._metricEl = this._imperialEl = undefined;
  }

  _onMove() {
    const map = this._map;
    if (!map) return;
    const { maxWidth } = this.options;

    // A horizontal bar is measured along the vertical centre of the map, like
    // MapLibre's own ScaleControl.
    const y = map.getContainer().clientHeight / 2;
    const maxMeters = distanceMeters(map.unproject([0, y]), map.unproject([maxWidth, y]));
    if (!Number.isFinite(maxMeters) || maxMeters <= 0) return;

    this._setBar(this._metricEl, metricScale(maxMeters), maxWidth);
    this._setBar(this._imperialEl, imperialScale(maxMeters), maxWidth);
  }

  _setBar(el, { label, ratio }, maxWidth) {
    if (el.textContent !== label) el.textContent = label;
    el.style.width = `${maxWidth * ratio}px`;
  }

  _onMouseMove(e) {
    const { coordinatePrecision } = this.options;
    this._coordsEl.textContent =
      `${e.lngLat.lat.toFixed(coordinatePrecision)}, ${e.lngLat.lng.toFixed(coordinatePrecision)}`;
  }
}

export default DualScaleControl;
