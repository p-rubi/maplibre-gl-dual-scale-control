import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceMeters, roundNice, metricScale, imperialScale } from '../src/scale.js';

test('distanceMeters: one degree of latitude is about 111.2 km', () => {
  const d = distanceMeters({ lng: 0, lat: 0 }, { lng: 0, lat: 1 });
  assert.ok(Math.abs(d - 111195) < 100, `got ${d}`);
});

test('distanceMeters: stays accurate for sub-metre distances', () => {
  // ~0.1 m along the equator; the law of cosines returns 0 or noise here
  const d = distanceMeters({ lng: 0, lat: 0 }, { lng: 0.000001, lat: 0 });
  assert.ok(Math.abs(d - 0.1112) < 0.001, `got ${d}`);
});

test('distanceMeters: identical points give 0', () => {
  assert.equal(distanceMeters({ lng: 12, lat: 41 }, { lng: 12, lat: 41 }), 0);
});

test('roundNice: picks 1, 2, 3 or 5 times a power of ten, rounding down', () => {
  const cases = [
    [1, 1], [1.9, 1], [2, 2], [2.9, 2], [3, 3], [4.9, 3], [5, 5], [9.99, 5],
    [10, 10], [99, 50], [100, 100], [1000, 1000], [2500, 2000], [0.93, 0.5], [0.25, 0.2], [0.03, 0.03]
  ];
  for (const [input, expected] of cases) assert.equal(roundNice(input), expected, `roundNice(${input})`);
});

test('metricScale: switches to km from 1000 m and never exceeds the max width', () => {
  assert.equal(metricScale(999).label, '500 m');
  assert.equal(metricScale(1000).label, '1 km');
  assert.equal(metricScale(1234567).label, '1000 km');
  for (const m of [0.7, 1, 7, 99, 100, 1234, 987654]) {
    const { ratio } = metricScale(m);
    assert.ok(ratio > 0.5 - 1e-9 && ratio <= 1, `ratio ${ratio} for ${m} m`);
  }
});

test('imperialScale: feet below one mile, miles above', () => {
  assert.equal(imperialScale(100).label, '300 ft'); // 328 ft
  assert.equal(imperialScale(1000).label, '3000 ft'); // 3281 ft
  assert.equal(imperialScale(2000).label, '1 mi'); // 1.24 mi
  assert.equal(imperialScale(1609.344 * 7).label, '5 mi');
  for (const m of [0.3, 1, 50, 1500, 80000, 4e6]) {
    const { ratio } = imperialScale(m);
    assert.ok(ratio > 0.5 - 1e-9 && ratio <= 1, `ratio ${ratio} for ${m} m`);
  }
});
