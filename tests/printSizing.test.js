import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDimsCm, getDecalDimensionsCm, getMaxScale, clampScale, scaleFromWidthCm,
  getWidthRangeCm, buildSizeTable, buildPresetWidths, getSizeRatio
} from '../src/config/printSizing.js';
import { SIZES } from '../src/config/colors.js';
import { store } from '../src/state/store.js';
import { setDecal, setSize, setSizeMode, updateDecalTransform, toggleLockAspect } from '../src/state/actions.js';
import { computeDecalSize } from '../src/config/decalLayout.js';

const L = SIZES.find((s) => s.id === 'L');
const S = SIZES.find((s) => s.id === 'S');
const XL = SIZES.find((s) => s.id === 'XL');
const square = { naturalWidth: 400, naturalHeight: 400 };
const wide = { naturalWidth: 800, naturalHeight: 200 };
const tall = { naturalWidth: 200, naturalHeight: 800 };

function resetStore() {
  const st = store.getState();
  st.selectedSize = L;
  st.sizeMode = 'fixed';
  st.selectedSilhouette = 'man';
  for (const z of Object.values(st.customizations)) {
    Object.assign(z, { hasDecal: false, imageElement: null, name: '', offsetX: 0, offsetY: 0, rotation: 0, widthCm: null });
  }
  st.customizations.front.scale = 1;
  st.customizations.frontPocket.scale = 0.85;
  st.customizations.back.scale = 1;
}

test('talla de referencia L: ratio 1 y 28 cm a escala 1 en frente', () => {
  assert.equal(getSizeRatio(L), 1);
  const d = computeDimsCm(1, 'front', L, 1);
  assert.equal(d.w, 28);
  assert.equal(d.h, 28);
});

test('el ancho crece linealmente con la talla', () => {
  const wS = computeDimsCm(1, 'front', S, 1).w;
  const wXL = computeDimsCm(1, 'front', XL, 1).w;
  assert.ok(wS < 28 && wXL > 28);
  assert.ok(Math.abs(wS - 28 * 46 / 54) < 1e-9);
});

test('imagen panorámica y vertical respetan la proporción', () => {
  const w = computeDimsCm(1, 'front', L, 4);
  assert.ok(Math.abs(w.w / w.h - 4) < 1e-9);
  const t = computeDimsCm(1, 'front', L, 0.25);
  assert.equal(t.h, 28); // limitado por alto
  assert.ok(Math.abs(t.w / t.h - 0.25) < 1e-9);
});

test('scaleFromWidthCm es la inversa exacta de computeDimsCm', () => {
  for (const size of SIZES) {
    for (const img of [square, wide, tall]) {
      const s = 0.77;
      const aspect = img.naturalWidth / img.naturalHeight;
      const { w } = computeDimsCm(s, 'back', size, aspect);
      assert.ok(Math.abs(scaleFromWidthCm(w, 'back', size, img) - s) < 1e-9);
    }
  }
});

test('el límite de escala nunca excede el área máxima de impresión', () => {
  for (const size of SIZES) {
    for (const zone of ['front', 'frontPocket', 'back']) {
      for (const img of [square, wide, tall]) {
        const aspect = img.naturalWidth / img.naturalHeight;
        const max = getMaxScale(zone, size, aspect);
        const dims = getDecalDimensionsCm({ scale: max, imageElement: img }, zone, size);
        assert.ok(dims.widthCm <= dims.maxWidthCm + 0.05, `${zone}/${size.id} ancho`);
        assert.ok(dims.heightCm <= dims.maxHeightCm + 0.05, `${zone}/${size.id} alto`);
      }
    }
  }
});

test('rango de ancho y atajos coherentes', () => {
  const range = getWidthRangeCm('front', L, square);
  assert.ok(range.min > 0 && range.max <= 32);
  const presets = buildPresetWidths('front', range);
  assert.equal(presets.at(-1).isMax, true);
  assert.ok(presets.every((p) => p.cm <= range.max));
});

test('tabla por talla: modo fijo conserva cm, modo proporcional conserva escala', () => {
  const decal = { scale: 0.5, widthCm: 14, imageElement: square };
  const fixed = buildSizeTable(decal, 'front', SIZES, 'fixed', L);
  assert.ok(fixed.every((r) => Math.abs(r.widthCm - 14) < 0.06));
  const prop = buildSizeTable(decal, 'front', SIZES, 'proportional', L);
  assert.ok(prop.every((r) => r.scale === 0.5));
  assert.ok(prop[0].widthCm < prop[4].widthCm);
});

test('modo fijo marca como reducida la talla que no admite el ancho pedido', () => {
  const decal = { scale: 1.14, widthCm: 31.9, imageElement: square };
  const rows = buildSizeTable(decal, 'front', SIZES, 'fixed', L);
  const rowS = rows.find((r) => r.id === 'S');
  assert.equal(rowS.reduced, true);
  assert.ok(rowS.widthCm <= S.maxPrintWidthCm);
});

test('store: setSize en modo fijo conserva los cm y recupera la intención al volver', () => {
  resetStore();
  setDecal('front', { name: 'a', src: 'x', imageElement: square });
  updateDecalTransform('front', { widthCm: 30 });
  assert.equal(getDecalDimensionsCm(store.getState().customizations.front, 'front', L).widthCm, 30);

  const reduced = setSize(S);
  const atS = getDecalDimensionsCm(store.getState().customizations.front, 'front', S);
  assert.equal(atS.widthCm, S.maxPrintWidthCm);
  assert.equal(reduced.length, 1);

  setSize(L);
  assert.equal(getDecalDimensionsCm(store.getState().customizations.front, 'front', L).widthCm, 30);
});

test('store: modo proporcional conserva la escala visual entre tallas', () => {
  resetStore();
  setDecal('front', { name: 'a', src: 'x', imageElement: square });
  setSizeMode('proportional');
  updateDecalTransform('front', { scale: 0.6 });
  setSize(XL);
  assert.equal(store.getState().customizations.front.scale, 0.6);
  const dims = getDecalDimensionsCm(store.getState().customizations.front, 'front', XL);
  assert.ok(dims.widthCm > 0.6 * 28);
});

test('store: setDecal limita la escala a la nueva proporción de imagen', () => {
  resetStore();
  store.getState().customizations.front.scale = 2.2;
  setDecal('front', { name: 'a', src: 'x', imageElement: tall });
  const z = store.getState().customizations.front;
  assert.equal(z.scale, clampScale(2.2, 'front', L, tall));
  assert.ok(z.widthCm > 0);
});

test('proporción libre (desbloqueada) permite modificar alto y ancho de forma no simétrica (ej. 24 x 35 cm)', () => {
  resetStore();
  setDecal('front', { name: 'a', src: 'x', imageElement: square });
  toggleLockAspect('front');
  const z = store.getState().customizations.front;
  assert.equal(z.lockAspect, false);

  updateDecalTransform('front', { widthCm: 24, heightCm: 35 });
  const dims = getDecalDimensionsCm(z, 'front', L);
  assert.equal(dims.widthCm, 24);
  assert.equal(dims.heightCm, 35);
  assert.equal(dims.isLocked, false);

  // Proyección exacta en el lienzo 2D / Three.js
  const area = { x: 572, y: 720, width: 440, height: 440 };
  const layout = computeDecalSize(square, area, z.scale, z);
  const pxPerCm = 440 / 28;
  assert.ok(Math.abs(layout.w - 24 * pxPerCm) < 1e-6);
  assert.ok(Math.abs(layout.h - 35 * pxPerCm) < 1e-6);
});
