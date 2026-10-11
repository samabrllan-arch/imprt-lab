import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyBackground, borderSeeds, dilate, removeSpecks } from '../src/services/colorKey.js';
import { autoDetectBackgroundColor, isBorderMostlyTransparent, removeBackgroundColor } from '../src/services/imageProcessing.js';
import { eraseColorAtPixel } from '../src/services/magicWandEraser.js';

const W = 120;
const H = 120;
const FG = { r: 200, g: 30, b: 30 };

/** Disco con agujero (anillo) antialiased con 4x4 supersampling; devuelve píxeles + cobertura real. */
function makeRing(bg, { noise = 0 } = {}) {
  const data = new Uint8ClampedArray(W * H * 4);
  const coverage = new Float32Array(W * H);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let hit = 0;
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const dx = x + (sx + 0.5) / 4 - 60;
          const dy = y + (sy + 0.5) / 4 - 60;
          const d = Math.hypot(dx, dy);
          if (d <= 44 && d >= 18) hit++;
        }
      }
      const a = hit / 16;
      coverage[y * W + x] = a;
      const p = (y * W + x) * 4;
      data[p] = a * FG.r + (1 - a) * bg.r + rnd() * noise;
      data[p + 1] = a * FG.g + (1 - a) * bg.g + rnd() * noise;
      data[p + 2] = a * FG.b + (1 - a) * bg.b + rnd() * noise;
      data[p + 3] = 255;
    }
  }
  return { img: { data, width: W, height: H }, coverage };
}

/** Error medio de composición sobre un fondo de prueba vs. el resultado ideal. */
function compositeError(img, coverage, onto) {
  let err = 0;
  let n = 0;
  let worst = 0;
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    const a = img.data[p + 3] / 255;
    const ideal = coverage[i];
    for (let c = 0; c < 3; c++) {
      const got = a * img.data[p + c] + (1 - a) * onto[c];
      const want = ideal * [FG.r, FG.g, FG.b][c] + (1 - ideal) * onto[c];
      const e = Math.abs(got - want);
      err += e;
      worst = Math.max(worst, e);
      n++;
    }
  }
  return { mean: err / n, worst };
}

test('fondo blanco: el borde no conserva tinte blanco (halo) sobre fondo oscuro', () => {
  const white = { r: 255, g: 255, b: 255 };
  const { img, coverage } = makeRing(white);
  const res = keyBackground(img, white, { tolerance: 30, feather: 12 });
  assert.equal(res.modified, true);
  const onDark = compositeError(img, coverage, [20, 20, 25]);
  assert.ok(onDark.mean < 1.2, `error medio sobre oscuro ${onDark.mean}`);
  assert.ok(onDark.worst < 60, `peor píxel ${onDark.worst}`);
});

test('fondo negro: sin borde oscuro sobre prenda clara', () => {
  const black = { r: 0, g: 0, b: 0 };
  const { img, coverage } = makeRing(black);
  keyBackground(img, black, { tolerance: 30, feather: 12 });
  const onLight = compositeError(img, coverage, [240, 240, 240]);
  assert.ok(onLight.mean < 1.5, `error medio sobre claro ${onLight.mean}`);
});

test('ruido tipo JPEG: el fondo desaparece por completo y no quedan motas', () => {
  const bg = { r: 250, g: 250, b: 250 };
  const { img } = makeRing(bg, { noise: 14 });
  keyBackground(img, bg, { tolerance: 30, feather: 12 });
  let stray = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - 59.5, y - 59.5);
      if ((d > 49 || d < 13) && img.data[(y * W + x) * 4 + 3] > 8) stray++;
    }
  }
  assert.ok(stray < 8, `píxeles sueltos de fondo: ${stray}`);
});

test('modo conectado: conserva el interior cerrado, el global lo elimina', () => {
  const white = { r: 255, g: 255, b: 255 };
  const connected = makeRing(white).img;
  keyBackground(connected, white, { tolerance: 30, feather: 12, seeds: borderSeeds(W, H) });
  const center = (60 * W + 60) * 4 + 3;
  assert.equal(connected.data[(5 * W + 5) * 4 + 3], 0);
  assert.equal(connected.data[center], 255);

  const global = makeRing(white).img;
  keyBackground(global, white, { tolerance: 30, feather: 12 });
  assert.equal(global.data[center], 0);
});

test('autodetección: color de fondo y fondos ya transparentes', () => {
  const bg = { r: 12, g: 200, b: 14 };
  const { img } = makeRing(bg);
  const found = autoDetectBackgroundColor(img);
  assert.ok(Math.abs(found.g - 200) < 6);

  const clear = { data: new Uint8ClampedArray(W * H * 4), width: W, height: H };
  assert.equal(isBorderMostlyTransparent(clear), true);
  assert.equal(autoDetectBackgroundColor(clear), null);
});

test('borrador mágico y removeBackgroundColor comparten el motor', () => {
  const white = { r: 255, g: 255, b: 255 };
  const a = makeRing(white).img;
  const r1 = eraseColorAtPixel(a, 2, 2, { tolerance: 30, feather: 12, contiguous: false });
  assert.equal(r1.modified, true);

  const b = makeRing(white).img;
  removeBackgroundColor(b, { targetColor: white, tolerance: 30, feather: 12, contiguous: true });
  assert.equal(b.data[(5 * W + 5) * 4 + 3], 0);

  const again = eraseColorAtPixel(a, 2, 2, { tolerance: 30, feather: 12 });
  assert.equal(again.modified, false);
});

test('utilidades: dilatación y eliminación de motas', () => {
  const mask = new Uint8Array(25);
  mask[12] = 1;
  const d = dilate(mask, 5, 5, 1);
  assert.equal(d.reduce((s, v) => s + v, 0), 9);

  const m = new Uint8Array(100); // todo "arte"
  m.fill(1);
  m[55] = 0; // una mota aislada
  removeSpecks(m, 10, 10, 4);
  assert.equal(m[55], 1);
});

test('fondo verde: elimina el halo verde de los bordes con despill', () => {
  const green = { r: 31, g: 89, b: 48 };
  const { img } = makeRing(green, { art: [255, 255, 255] });
  keyBackground(img, green, { tolerance: 35, feather: 12, despill: true, choke: 1 });
  let greenishEdge = 0;
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    const a = img.data[p + 3];
    if (a > 10) {
      const r = img.data[p], g = img.data[p + 1], b = img.data[p + 2];
      if (g > r * 1.3 && g > b * 1.2 && g > 40) greenishEdge++;
    }
  }
  assert.equal(greenishEdge, 0, `píxeles con halo verde residual: ${greenishEdge}`);
});
