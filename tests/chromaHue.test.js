import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeHueKey } from '../src/services/chromaHue.js';
import { eraseColorAtPixel } from '../src/services/magicWandEraser.js';
import { eraseBackgroundAuto } from '../src/services/autoBackground.js';
import { autoDetectBackgroundColor } from '../src/services/imageProcessing.js';

const N = 100;
const GREEN = { r: 0, g: 255, b: 0 };
const OUTLINE = [10, 10, 12];
const ORANGE = [255, 140, 30];
// Halo de antialiasing/JPEG: verde que se oscurece hacia el contorno (d = distancia al dibujo).
// Los tonos oscuros quedan MUY lejos del verde puro en RGB, pero siguen siendo "verde".
const HALO = { 1: [10, 45, 14], 2: [12, 90, 18], 3: [14, 140, 22], 4: [15, 190, 25] };

function makeGreenScreenArt() {
  const data = new Uint8ClampedArray(N * N * 4);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const p = (y * N + x) * 4;
      let c = [0, 255, 0];
      const inside = x >= 30 && x <= 69 && y >= 30 && y <= 69;
      if (inside) {
        const edge = Math.min(x - 30, 69 - x, y - 30, 69 - y);
        c = edge < 4 ? OUTLINE : ORANGE;
        // franja verde atrapada entre trazos (hueco interior, desconectado del fondo exterior)
        if (x >= 48 && x <= 49 && y >= 40 && y <= 60) c = [14, 140, 22];
      } else {
        const d = Math.max(30 - x, x - 69, 30 - y, y - 69);
        if (HALO[d]) c = HALO[d];
      }
      data[p] = c[0]; data[p + 1] = c[1]; data[p + 2] = c[2]; data[p + 3] = 255;
    }
  }
  return { data, width: N, height: N };
}

const px = (img, x, y) => { const p = (y * N + x) * 4; return [img.data[p], img.data[p + 1], img.data[p + 2], img.data[p + 3]]; };
const isGreenish = ([r, g, b, a]) => a > 40 && g - Math.max(r, b) > 30;

/** Cuenta píxeles verdosos visibles en el anillo del halo (fuera del dibujo, hasta 6 px). */
function greenishHaloCount(img) {
  let n = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const outside = x < 30 || x > 69 || y < 30 || y > 69;
      if (outside && isGreenish(px(img, x, y))) n++;
    }
  }
  return n;
}

test('llave por tono: solo se activa con fondos croma saturados', () => {
  assert.equal(makeHueKey({ r: 255, g: 255, b: 255 }, 30), null);
  assert.equal(makeHueKey({ r: 17, g: 17, b: 19 }, 30), null);
  assert.equal(makeHueKey({ r: 200, g: 170, b: 160 }, 30), null);
  const key = makeHueKey(GREEN, 30);
  assert.ok(key);
  assert.equal(key(12, 90, 18), true, 'verde oscuro del halo');
  assert.equal(key(10, 10, 12), false, 'negro del contorno');
  assert.equal(key(255, 140, 30), false, 'naranja del arte');
});

for (const tolerance of [30, 75]) {
  test(`varita contigua al ${tolerance}%: no quedan restos verdes y el dibujo queda intacto`, () => {
    const img = makeGreenScreenArt();
    eraseColorAtPixel(img, 0, 0, { tolerance, feather: 10, contiguous: true, choke: 1 });
    assert.equal(greenishHaloCount(img), 0, 'sin halo verde alrededor del dibujo');
    assert.equal(px(img, 31, 50)[3], 255, 'el contorno negro sigue opaco');
    assert.deepEqual(px(img, 40, 40).slice(0, 3), ORANGE, 'el relleno naranja no cambia');
  });
}

test('quitar fondo en 1 clic: elimina halo y la franja verde atrapada entre trazos', () => {
  const img = makeGreenScreenArt();
  eraseBackgroundAuto(img, autoDetectBackgroundColor(img), { tolerance: 30, feather: 10, choke: 1 });
  assert.equal(greenishHaloCount(img), 0, 'sin halo verde');
  assert.equal(px(img, 48, 50)[3], 0, 'la franja verde interior queda transparente');
  assert.equal(px(img, 31, 50)[3], 255, 'contorno intacto');
  assert.deepEqual(px(img, 40, 40).slice(0, 3), ORANGE, 'relleno intacto');
});
