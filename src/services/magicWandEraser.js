import { keyBackground, borderSeeds } from './colorKey.js';

/**
 * Borrador mágico interactivo multiclic para DTF.
 * Cada clic toma el color del píxel (o uno indicado) y elimina ese fondo con matting de borde.
 *  - contiguous=false: ese color en toda la imagen (incluye huecos entre letras).
 *  - contiguous=true : solo la región conectada al clic.
 * Con `targetColor` y contiguous=true se inunda desde el perímetro (fondo exterior).
 */
export function eraseColorAtPixel(imageData, startX, startY, options = {}) {
  const {
    tolerance = 30,
    feather = 12,
    contiguous = false,
    targetColor = null,
    choke = 0,
    bounds = null
  } = options;
  const { data, width, height } = imageData;

  let target = targetColor;
  let seeds = null;

  if (target) {
    if (contiguous) seeds = borderSeeds(width, height);
  } else {
    const x = Math.max(0, Math.min(width - 1, Math.round(startX)));
    const y = Math.max(0, Math.min(height - 1, Math.round(startY)));
    const p = (y * width + x) * 4;
    target = { r: data[p], g: data[p + 1], b: data[p + 2] };
    if (data[p + 3] < 15) return { modified: false, erasedCount: 0, sampledColor: { ...target, a: data[p + 3] } };
    if (contiguous) seeds = [y * width + x];
  }

  const result = keyBackground(imageData, target, { tolerance, feather, choke, seeds, bounds });
  return { ...result, sampledColor: target };
}
