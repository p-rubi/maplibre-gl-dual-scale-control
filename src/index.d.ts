import type { ControlPosition, IControl, Map } from 'maplibre-gl';

export interface DualScaleControlOptions {
  /** Maximum length of the bars, in pixels. Default: `100`. */
  maxWidth?: number;
  /** Show the longitude/latitude under the mouse pointer. Default: `false`. */
  showCoordinates?: boolean;
  /** Decimal places of the displayed coordinates. Default: `6`. */
  coordinatePrecision?: number;
  /** Colour theme of the control. Default: `'light'`. */
  theme?: 'light' | 'dark';
}

/**
 * A MapLibre GL JS control that shows a metric and an imperial scale bar at
 * the same time.
 */
export class DualScaleControl implements IControl {
  constructor(options?: DualScaleControlOptions);
  options: Required<DualScaleControlOptions>;
  getDefaultPosition(): ControlPosition;
  onAdd(map: Map): HTMLElement;
  onRemove(): void;
}

export default DualScaleControl;
