import { colorDistance, keyBackground, borderSeeds } from './colorKey.js';

/**
 * Tratamiento de imagen para DTF.
 * v4.0 - la eliminación de fondo vive en `colorKey.js` (máscara + matting de borde).
 */

export { applyVisualFilters, autoCropCanvas } from './imageFilters.js';
export { colorDistance };

/** Índices del perímetro muestreado (≈60 muestras por lado). */
function sampleBorder(width, height) {
  const samples = [];
  const sx = Math.max(1, Math.floor(width / 60));
  const sy = Math.max(1, Math.floor(height / 60));
  for (let x = 0; x < width; x += sx) samples.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y += sy) samples.push(y * width, y * width + (width - 1));
  return samples;
}

/** True si la mayor parte del borde ya es transparente (no hay fondo que quitar). */
export function isBorderMostlyTransparent(imageData) {
  const { data, width, height } = imageData;
  const samples = sampleBorder(width, height);
  const transparent = samples.filter((idx) => data[idx * 4 + 3] < 30).length;
  return transparent / samples.length > 0.6;
}

/**
 * Detecta el color de fondo por moda (histograma) en el perímetro, evitando
 * contaminación si el arte toca los bordes. Devuelve null si el borde ya es transparente.
 */
export function autoDetectBackgroundColor(imageData) {
  const { data, width, height } = imageData;
  if (isBorderMostlyTransparent(imageData)) return null;

  const buckets = new Map();
  for (const idx of sampleBorder(width, height)) {
    const p = idx * 4;
    if (data[p + 3] < 30) continue;
    const key = `${data[p] >> 4},${data[p + 1] >> 4},${data[p + 2] >> 4}`;
    const b = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    b.count++;
    b.r += data[p];
    b.g += data[p + 1];
    b.b += data[p + 2];
    buckets.set(key, b);
  }

  let best = null;
  for (const b of buckets.values()) if (!best || b.count > best.count) best = b;
  if (!best) return null;
  return { r: Math.round(best.r / best.count), g: Math.round(best.g / best.count), b: Math.round(best.b / best.count) };
}

/**
 * Remueve el color de fondo indicado.
 * contiguous: false -> limpia también huecos interiores (modo DTF total)
 * contiguous: true  -> solo el fondo conectado al perímetro (conserva interiores cerrados)
 */
export function removeBackgroundColor(imageData, options = {}) {
  const {
    targetColor = { r: 255, g: 255, b: 255 },
    tolerance = 30,
    feather = 12,
    contiguous = false,
    choke = 0
  } = options;

  keyBackground(imageData, targetColor, {
    tolerance,
    feather,
    choke,
    seeds: contiguous ? borderSeeds(imageData.width, imageData.height) : null
  });
  return imageData;
}
