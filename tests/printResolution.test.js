import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeEffectiveDpi,
  getDpiQuality,
  embedDpiInPng,
  PX_PER_CM_300DPI,
  PNG_PHYS_PPM_300
} from '../src/services/printResolution.js';

test('cálculo de DPI efectivo según ancho nativo y centímetros', () => {
  // 28 cm a 300 DPI requiere ≈ 3307 px
  const exactDpi = computeEffectiveDpi(3307, 28);
  assert.equal(exactDpi, 300);

  // Imagen estándar web de 800 px para 28 cm -> ≈ 72 DPI
  const lowDpi = computeEffectiveDpi(800, 28);
  assert.equal(lowDpi, 73);

  // Logo de bolsillo de 1200 px para 10 cm -> ≈ 305 DPI
  const pocketDpi = computeEffectiveDpi(1200, 10);
  assert.equal(pocketDpi, 305);

  // Valores límite o no válidos
  assert.equal(computeEffectiveDpi(0, 28), 0);
  assert.equal(computeEffectiveDpi(1000, 0), 0);
});

test('clasificación de calidad (Semáforo DPI)', () => {
  const opt = getDpiQuality(320);
  assert.equal(opt.level, 'optimal');
  assert.equal(opt.icon, '🟢');

  const good = getDpiQuality(200);
  assert.equal(good.level, 'good');
  assert.equal(good.icon, '🟢');

  const low = getDpiQuality(120);
  assert.equal(low.level, 'low');
  assert.equal(low.icon, '⚠️');
});

test('inyección de metadatos físicos pHYs a 300 DPI en PNG', () => {
  // PNG mínimo válido de 1x1 píxel
  const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const originalDataUrl = 'data:image/png;base64,' + minimalPngBase64;

  const withDpi = embedDpiInPng(originalDataUrl, 300);
  assert.ok(withDpi.startsWith('data:image/png;base64,'));

  // Decodificar bytes resultantes y buscar el chunk 'pHYs'
  const b64 = withDpi.replace('data:image/png;base64,', '');
  const buf = Buffer.from(b64, 'base64');

  // Firma PNG
  assert.equal(buf[0], 0x89);
  assert.equal(buf[1], 0x50);
  assert.equal(buf[2], 0x4E);
  assert.equal(buf[3], 0x47);

  // El chunk pHYs debe estar ubicado en el offset 33
  const chunkLen = buf.readUInt32BE(33);
  assert.equal(chunkLen, 9);

  const chunkType = buf.subarray(37, 41).toString('ascii');
  assert.equal(chunkType, 'pHYs');

  const ppmX = buf.readUInt32BE(41);
  const ppmY = buf.readUInt32BE(45);
  const unit = buf[49];

  assert.equal(ppmX, PNG_PHYS_PPM_300); // 11811
  assert.equal(ppmY, PNG_PHYS_PPM_300); // 11811
  assert.equal(unit, 1); // 1 = metro
});
