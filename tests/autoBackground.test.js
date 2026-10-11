import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eraseBackgroundAuto } from '../src/services/autoBackground.js';
import { autoDetectBackgroundColor } from '../src/services/imageProcessing.js';

const N = 80;
const BG = { r: 17, g: 17, b: 19 };
const RING = [255, 110, 0];
const NAVY = [20, 30, 90];

/** Panel oscuro con sombra suave exterior, aro naranja, bolsillo de fondo y bloque azul marino interior. */
function makeArt() {
  const data = new Uint8ClampedArray(N * N * 4);
  const set = (x, y, c) => { const p = (y * N + x) * 4; data[p] = c[0]; data[p + 1] = c[1]; data[p + 2] = c[2]; data[p + 3] = 255; };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const edge = Math.min(x, y, N - 1 - x, N - 1 - y);
      const shade = Math.max(0, 8 - edge); // sombra más oscura hacia el borde
      set(x, y, [BG.r - shade, BG.g - shade, BG.b - shade]);
    }
  }
  for (let y = 15; y < 65; y++) {
    for (let x = 15; x < 65; x++) {
      const onRing = x < 19 || x >= 61 || y < 19 || y >= 61;
      if (onRing) set(x, y, RING);
    }
  }
  for (let y = 36; y < 44; y++) for (let x = 36; x < 44; x++) set(x, y, NAVY);
  return { data, width: N, height: N };
}

const alphaAt = (img, x, y) => img.data[(y * N + x) * 4 + 3];

test('auto: el fondo exterior y su sombra desaparecen por completo', () => {
  const img = makeArt();
  const bg = autoDetectBackgroundColor(img);
  eraseBackgroundAuto(img, bg, { tolerance: 30, feather: 10, choke: 0 });
  for (const [x, y] of [[0, 0], [N - 1, N - 1], [3, 40], [40, 2], [10, 70]]) {
    assert.equal(alphaAt(img, x, y), 0, `fondo en (${x},${y}) debe ser transparente`);
  }
});

test('auto: conserva el aro y el detalle azul marino interior (no se come lo oscuro del arte)', () => {
  const img = makeArt();
  eraseBackgroundAuto(img, autoDetectBackgroundColor(img), { tolerance: 30, feather: 10, choke: 0 });
  assert.equal(alphaAt(img, 16, 40), 255, 'aro intacto');
  assert.equal(alphaAt(img, 40, 40), 255, 'bloque azul marino intacto');
});

test('auto: elimina el bolsillo interior que tiene el color exacto del fondo', () => {
  const img = makeArt();
  eraseBackgroundAuto(img, autoDetectBackgroundColor(img), { tolerance: 30, feather: 10, choke: 0 });
  assert.equal(alphaAt(img, 24, 24), 0, 'hueco interior transparente');
});
