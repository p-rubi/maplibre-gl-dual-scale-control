// Pure scale maths: no DOM and no MapLibre, so it can be unit-tested in Node.

const EARTH_RADIUS_M = 6371008.8; // mean Earth radius, same value MapLibre uses
const FEET_PER_METER = 3.280839895;
const FEET_PER_MILE = 5280;

/**
 * Great-circle distance in metres between two `{ lng, lat }` points (haversine).
 * Unlike the spherical law of cosines it stays accurate for very short
 * distances, which is exactly what a scale bar needs at high zoom levels.
 */
export function distanceMeters(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Largest "nice" number (1, 2, 3, 5 x 10^n) that is not greater than `num`.
 * Works for numbers below 1 as well.
 */
export function roundNice(num) {
  let pow10 = Math.pow(10, Math.floor(Math.log10(num)));
  if (pow10 * 10 <= num) pow10 *= 10; // guard against floating-point log10
  const d = num / pow10;
  const step = d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
  return Number((pow10 * step).toPrecision(12));
}

/**
 * Metric scale for a bar that would span `maxMeters` on the ground.
 * @returns {{ label: string, ratio: number }} `ratio` is the fraction of the
 *   maximum bar width the bar should use (always between 0.5 and 1).
 */
export function metricScale(maxMeters) {
  const nice = roundNice(maxMeters);
  const label = nice >= 1000 ? `${nice / 1000} km` : `${nice} m`;
  return { label, ratio: nice / maxMeters };
}

/**
 * Imperial scale (feet, switching to miles above one mile) for a bar that
 * would span `maxMeters` on the ground.
 * @returns {{ label: string, ratio: number }}
 */
export function imperialScale(maxMeters) {
  const maxFeet = maxMeters * FEET_PER_METER;
  if (maxFeet > FEET_PER_MILE) {
    const maxMiles = maxFeet / FEET_PER_MILE;
    const nice = roundNice(maxMiles);
    return { label: `${nice} mi`, ratio: nice / maxMiles };
  }
  const nice = roundNice(maxFeet);
  return { label: `${nice} ft`, ratio: nice / maxFeet };
}
