/**
 * Límite inteligente de 300 DPI (NODE-019): protege el almacenamiento (Drive, bóveda) y la memoria del navegador.
 *
 *   DPI = anchoPx / (anchoCm / 2.54)
 *
 * Una imagen con más de 300 DPI efectivos para el área física máxima de la zona no se imprime más nítida:
 * solo pesa más. Aquí se reduce (nunca se amplía) a ese tope con remuestreo de alta calidad conservando el
 * canal alfa. Ampliar imágenes pequeñas sigue siendo trabajo de `upscaleTo300Dpi` al exportar el pedido.
 */
import { DPI_TARGET, PX_PER_CM_300DPI, lanczosResize, insertPhysChunk } from './printResolution.js';
import { getPrintLimits } from '../config/printSizing.js';
import { SIZES } from '../config/colors.js';

const srcSize = (s) => ({ w: s.naturalWidth || s.width || 1, h: s.naturalHeight || s.height || 1 });

/** Píxeles máximos útiles a 300 DPI para la zona: el área imprimible de la talla más grande. */
export function getZoneMaxPx(zoneId = 'front') {
  const limits = SIZES.map((size) => getPrintLimits(zoneId, size));
  const wCm = Math.max(...limits.map((l) => l.maxW));
  const hCm = Math.max(...limits.map((l) => l.maxH));
  return { wCm, hCm, w: Math.round(wCm * PX_PER_CM_300DPI), h: Math.round(hCm * PX_PER_CM_300DPI) };
}

/** Escala (≤ 1) que deja la imagen dentro del máximo, o 1 si ya cabe. */
export function clampScaleFor(w, h, max) {
  return Math.min(1, max.w / w, max.h / h);
}

function stepDown(source, w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);
  return c;
}

/**
 * Reduce `source` (imagen o canvas) a ≤ 300 DPI efectivos para la zona. Si ya cabe devuelve `source` tal cual.
 * Reduce a mitades sucesivas mientras la imagen sea más de 2× el destino (evita el aliasing de saltos grandes).
 * @returns {{ source: CanvasImageSource, clamped: boolean, from: {w:number,h:number}, to: {w:number,h:number}, max: object }}
 */
export function clampToPrintDpi(source, zoneId = 'front') {
  const from = srcSize(source);
  const max = getZoneMaxPx(zoneId);
  const k = clampScaleFor(from.w, from.h, max);
  if (k >= 1) return { source, clamped: false, from, to: from, max };

  const to = { w: Math.max(1, Math.round(from.w * k)), h: Math.max(1, Math.round(from.h * k)) };
  let current = source;
  let cur = from;
  while (cur.w > to.w * 2 || cur.h > to.h * 2) {
    cur = { w: Math.max(to.w, Math.ceil(cur.w / 2)), h: Math.max(to.h, Math.ceil(cur.h / 2)) };
    current = stepDown(current, cur.w, cur.h);
  }
  return { source: lanczosResize(current, to.w, to.h), clamped: true, from, to, max };
}

const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => {
  canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo codificar la imagen.'))), type, quality);
});

/** Dibuja `source` en un canvas del tamaño dado (sin tocar el original). */
export function toCanvas(source) {
  if (source instanceof HTMLCanvasElement) return source;
  const { w, h } = srcSize(source);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  c.getContext('2d').drawImage(source, 0, 0);
  return c;
}

/**
 * Archivo máster: PNG sin pérdida con canal alfa y metadato pHYs de 300 DPI (los RIPs y Photoshop lo
 * leen como 300 ppp). Es el que se guarda en la bóveda y el que descarga "Descargar HD".
 */
export async function canvasToMasterPng(canvas, dpi = DPI_TARGET) {
  const blob = await canvasToBlob(canvas, 'image/png');
  const bytes = insertPhysChunk(new Uint8Array(await blob.arrayBuffer()), dpi);
  return bytes ? new Blob([bytes], { type: 'image/png' }) : blob;
}

/**
 * Pipeline completo para una imagen cargada: tope de 300 DPI + PNG máster.
 * @returns {Promise<{ blob: Blob, canvas: HTMLCanvasElement, width: number, height: number, clamped: boolean, from: object }>}
 */
export async function buildMaster(source, zoneId = 'front', { opaque = false } = {}) {
  const fit = clampToPrintDpi(source, zoneId);
  const canvas = toCanvas(fit.source);
  // Fotos sin transparencia (JPEG): un PNG pesaría 10× más sin ganar nitidez; JPEG q95 es visualmente idéntico
  const blob = opaque ? await canvasToBlob(canvas, 'image/jpeg', 0.95) : await canvasToMasterPng(canvas);
  return { blob, canvas, width: canvas.width, height: canvas.height, clamped: fit.clamped, from: fit.from };
}

/** Convierte un canvas en un <img> PNG (con alfa) listo para `setDecal`. */
export function canvasToImage(canvas) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo preparar la imagen.'));
    img.src = canvas.toDataURL('image/png');
  });
}

/** Texto corto para avisar al usuario cuando se redujo una imagen enorme. */
export function describeClamp({ from, to }, dpiBefore) {
  const mp = (n) => n.toLocaleString('es-CO');
  return `Imagen de ${mp(from.w)}×${mp(from.h)} px (≈${dpiBefore} DPI) optimizada a ${mp(to.w)}×${mp(to.h)} px = 300 DPI reales para impresión.`;
}
