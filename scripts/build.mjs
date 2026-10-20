// Builds the CommonJS and browser (UMD-style global) bundles into dist/.
// The ESM source in src/ is published as-is.
import { build } from 'esbuild';

const entry = 'src/index.js';

await build({
  entryPoints: [entry],
  outfile: 'dist/index.cjs',
  bundle: true,
  format: 'cjs',
  platform: 'neutral',
  target: 'es2018',
  // require('maplibre-gl-dual-scale-control') returns the class itself
  footer: {
    js: 'module.exports = Object.assign(module.exports.DualScaleControl, { default: module.exports.DualScaleControl, DualScaleControl: module.exports.DualScaleControl });'
  }
});

await build({
  entryPoints: [entry],
  outfile: 'dist/maplibre-gl-dual-scale-control.umd.js',
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'DualScaleControl',
  target: 'es2018',
  // window.DualScaleControl is the class (also exposes .DualScaleControl / .default)
  footer: {
    js: 'DualScaleControl=Object.assign(DualScaleControl.DualScaleControl,{default:DualScaleControl.DualScaleControl,DualScaleControl:DualScaleControl.DualScaleControl});'
  }
});

console.log('built dist/');
