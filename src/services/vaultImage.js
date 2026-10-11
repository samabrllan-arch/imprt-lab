/**
 * Compresión de imágenes para la Bóveda (NODE-026). `localStorage` tiene ~5 MB por origen, así que cada
 * diseño guarda una versión de trabajo acotada (≤ 1024 px y ≈ 450 KB) más una miniatura de 320 px.
 * PNG conserva la transparencia (logos DTF); si pesa demasiado se prueba WebP con alfa y, al final, se reduce.
 */
import { buildMaster, getZoneMaxPx } from './dpiClamp.js';

const MAX_EDGE = 1024;
const THUMB_EDGE = 320;
const MAX_CHARS = 600_000; // ≈ 450 KB en binario
const MIN_EDGE = 480;

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = src;
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

function draw(img, edge) {
  const w0 = img.naturalWidth || img.width || 1024;
  const h0 = img.naturalHeight || img.height || 1024;
  const k = Math.min(1, edge / Math.max(w0, h0));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w0 * k));
  canvas.height = Math.max(1, Math.round(h0 * k));
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function encode(img, edge, alpha) {
  let current = edge;
  for (;;) {
    const canvas = draw(img, current);
    let url = alpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.82);
    if (alpha && url.length > MAX_CHARS) {
      const webp = canvas.toDataURL('image/webp', 0.9); // los navegadores sin soporte devuelven PNG
      if (webp.startsWith('data:image/webp') && webp.length < url.length) url = webp;
    }
    if (url.length <= MAX_CHARS || current <= MIN_EDGE) return { url, width: canvas.width, height: canvas.height };
    current = Math.max(MIN_EDGE, Math.round(current * 0.75));
  }
}

/** Un SVG no tiene resolución propia: se rasteriza al tamaño de 300 DPI de la zona (nítido y con alfa). */
function rasterizeSvg(img) {
  const w = img.naturalWidth || 1024, h = img.naturalHeight || 1024;
  const max = getZoneMaxPx('front');
  const k = Math.min(max.w / w, max.h / h);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/**
 * `alpha: true` para logos/ilustraciones; `false` para fotos de prendas (JPEG más liviano).
 * `master: true` además genera el archivo máster a 300 DPI (PNG con alfa; JPEG q95 si `opaque`): lo guarda
 * `vaultMasterStore` (IndexedDB). `image` es la copia de trabajo ≤ 1024 px que vive en `localStorage`.
 */
export async function imageToVault(source, { alpha = true, master = false, opaque = false, svg = false } = {}) {
  const img = await loadImage(source);
  const base = svg ? rasterizeSvg(img) : img;
  const main = encode(base, MAX_EDGE, alpha);
  const thumb = encode(base, THUMB_EDGE, alpha);
  const out = { image: main.url, thumb: thumb.url, width: main.width, height: main.height };
  if (master) out.master = await buildMaster(base, 'front', { opaque });
  return out;
}

export async function fileToVault(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Selecciona una imagen válida (PNG, JPG, WebP o SVG).');
  if (file.size > 12 * 1024 * 1024) throw new Error('La imagen supera 12 MB. Reduce su tamaño e inténtalo de nuevo.');
  const jpeg = file.type === 'image/jpeg';
  return imageToVault(await readFile(file), { alpha: !jpeg, master: true, opaque: jpeg, svg: file.type === 'image/svg+xml' });
}
