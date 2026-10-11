/**
 * SERVICIO DE MEJORA DE IMAGEN, CALIDAD HD Y PERFILADO DE BORDES (<260 Líneas)
 * Recortes nítidos estilo vector/DTF: matte suave, choke real de N px, defringe de color,
 * anti-aliasing de ~1px y nitidez sobre luminancia consciente del alfa.
 * Las funciones públicas conservan su firma y devuelven un data URL PNG.
 */
import { autoDetectBackgroundColor } from './imageProcessing.js';
import { clamp01, floodFromBorder, softenAlphaNearEdge, finalizeCutout, dilateMask } from './cutoutMask.js';

const MAX_DIM = 4096;           // tope por lado: evita congelar la UI con fotos enormes
const MATTE_WIDTH = 0.55;       // ancho de la rampa suave del matte (en unidades de cobertura)
const DEFAULT_KEY = { r: 0, g: 255, b: 0 };

function readPixels(imgElement) {
  const sw = imgElement.naturalWidth || imgElement.width;
  const sh = imgElement.naturalHeight || imgElement.height;
  const scale = Math.min(1, MAX_DIM / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imgElement, 0, 0, w, h);
  return { canvas, ctx, imgData: ctx.getImageData(0, 0, w, h), w, h };
}

function commitPixels({ canvas, ctx, imgData }) {
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

const median = (arr) => { arr.sort((a, b) => a - b); return arr[arr.length >> 1]; };

/** Recorre el perímetro de la imagen y llama a `visit(p)` con el índice RGBA de cada muestra. */
function sampleBorder(w, h, visit) {
  const step = Math.max(1, Math.floor(Math.max(w, h) / 400));
  for (let x = 0; x < w; x += step) { visit(x * 4); visit(((h - 1) * w + x) * 4); }
  for (let y = 0; y < h; y += step) { visit(y * w * 4); visit((y * w + w - 1) * 4); }
}

/** Color real del croma: mediana de los píxeles verdes del perímetro (no se asume #00FF00). */
function estimateKeyColor(d, w, h) {
  const rs = [], gs = [], bs = [];
  sampleBorder(w, h, (p) => {
    if (d[p + 3] < 128 || d[p + 1] - Math.max(d[p], d[p + 2]) < 60) return;
    rs.push(d[p]); gs.push(d[p + 1]); bs.push(d[p + 2]);
  });
  if (rs.length < 12) return DEFAULT_KEY;
  return { r: median(rs), g: median(gs), b: median(bs) };
}

function estimateBorderColor(d, w, h) {
  const rs = [], gs = [], bs = [];
  sampleBorder(w, h, (p) => {
    if (d[p + 3] < 128) return;
    rs.push(d[p]); gs.push(d[p + 1]); bs.push(d[p + 2]);
  });
  if (!rs.length) return { r: 255, g: 255, b: 255 };
  return { r: median(rs), g: median(gs), b: median(bs) };
}

/**
 * Matte "color → alfa" respecto a un color de fondo K: cobertura mínima compatible con P = a·F + (1-a)·K.
 * Reproduce el anti-aliasing real de origen. Lo que está a menos de `tolerance` de K es 0 exacto
 * (sin neblina); por encima sube linealmente hasta 1 en MATTE_WIDTH.
 */
function buildMatte(d, w, h, K, tolerance) {
  const t = Math.max(0.02, clamp01(tolerance / 100));
  const { r: kr, g: kg, b: kb } = K;
  const raw = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    if (d[p + 3] < 128) continue;                                   // ya transparente
    const r = d[p], g = d[p + 1], b = d[p + 2];
    const ar = r > kr ? (r - kr) / (255 - kr) : (kr - r) / (kr || 1);
    const ag = g > kg ? (g - kg) / (255 - kg) : (kg - g) / (kg || 1);
    const ab = b > kb ? (b - kb) / (255 - kb) : (kb - b) / (kb || 1);
    raw[i] = clamp01((Math.max(ar, ag, ab) - t) / MATTE_WIDTH);
  }
  return raw;
}

/**
 * Recorte croma (verde) sobre un ImageData, in situ: color clave estimado del perímetro, matte suave
 * "color → alfa", choke real de N px y defringe. Lo comparte el editor del estudio (sin pasar por PNG).
 */
function chromaCutout(imgData, tolerance, choke) {
  const { width: w, height: h, data } = imgData;
  const raw = buildMatte(data, w, h, estimateKeyColor(data, w, h), tolerance);
  return finalizeCutout(imgData, softenAlphaNearEdge(raw, w, h), { choke, despill: 0.5 });
}

/**
 * Recorte de fondo general (blanco, negro, color plano) sobre un ImageData, in situ.
 * `contiguousOnly` conserva los blancos internos (ojos, brillos, contrapesos de letras).
 */
function autoCutout(imgData, tolerance, choke, contiguousOnly) {
  const { width: w, height: h, data: d } = imgData;
  const total = w * h;

  const bg = autoDetectBackgroundColor(imgData) || estimateBorderColor(d, w, h);
  const raw = buildMatte(d, w, h, bg, tolerance);

  const candidate = new Uint8Array(total);                          // píxeles con aspecto de fondo
  for (let i = 0; i < total; i++) candidate[i] = raw[i] === 0 ? 1 : 0;
  const isBg = contiguousOnly ? floodFromBorder(candidate, w, h) : candidate;
  const enclosed = new Uint8Array(total);
  let hasEnclosed = false;
  for (let i = 0; i < total; i++) {
    if (candidate[i] && !isBg[i] && d[i * 4 + 3] >= 128) { raw[i] = 1; enclosed[i] = 1; hasEnclosed = true; } // zona encerrada: se conserva
  }
  if (hasEnclosed) {
    // El anti-aliasing que rodea una zona conservada también es arte: sin esto queda un aro translúcido con tinte del fondo
    const ring = dilateMask(enclosed, w, h, 2);
    for (let i = 0; i < total; i++) if (ring[i] && raw[i] > 0) raw[i] = 1;
  }
  return finalizeCutout(imgData, softenAlphaNearEdge(raw, w, h), { choke, despill: 0 });
}

/**
 * API para el editor del estudio (NODE-010): recorte síncrono sobre ImageData, sin DOM ni PNG intermedio.
 * @param {ImageData} imgData  se modifica in situ y se devuelve
 * @param {'auto'|'chroma'} mode
 */
export function cutoutImageData(imgData, mode, { tolerance = 30, choke = 1, contiguous = true } = {}) {
  return mode === 'chroma'
    ? chromaCutout(imgData, tolerance, choke)
    : autoCutout(imgData, tolerance, choke, contiguous);
}

/** Elimina fondo verde croma de un <img>/<canvas> y devuelve un data URL PNG. */
export function removeChromaGreenFromImage(imgElement, tolerance = 35, choke = 1) {
  const px = readPixels(imgElement);
  chromaCutout(px.imgData, tolerance, choke);
  return commitPixels(px);
}

/** Eliminación de fondo general de un <img>/<canvas>; devuelve un data URL PNG. */
export function removeAutoBackgroundFromImage(imgElement, tolerance = 30, choke = 1, contiguousOnly = true) {
  const px = readPixels(imgElement);
  autoCutout(px.imgData, tolerance, choke, contiguousOnly);
  return commitPixels(px);
}

/**
 * Perfilar bordes (defringe): quita neblina (alfa < alphaThreshold), erosiona `choke` px y
 * sustituye el color del borde por el del interior. Conserva la suavidad de los degradados
 * interiores (nubes, fuego, brillos); solo se endurece la transición del contorno.
 */
export function refineAndCleanEdges(imgElement, alphaThreshold = 110, choke = 1) {
  const px = readPixels(imgElement);
  const { imgData, w, h } = px;
  const d = imgData.data, total = w * h;
  const black = Math.min(250, Math.max(0, alphaThreshold));

  const alpha = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const a = d[i * 4 + 3];
    alpha[i] = a <= black ? 0 : Math.round(((a - black) / (255 - black)) * 255);
  }
  finalizeCutout(imgData, alpha, { choke, despill: 0 });
  return commitPixels(px);
}

/**
 * Claridad HD: máscara de enfoque sobre LUMINANCIA (sin franjas de color), con promedio ponderado
 * por alfa (los vecinos transparentes no crean aros claros) y umbral progresivo (sin ruido en planos).
 */
export function applySmartSharpenHD(imgElement, strength = 0.6, threshold = 10) {
  const px = readPixels(imgElement);
  const { imgData, w, h } = px;
  const d = imgData.data;

  const luma = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    luma[i] = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
  }

  const offs = [-w - 1, -w, -w + 1, -1, 0, 1, w - 1, w, w + 1];
  const kern = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const p = i * 4;
      if (d[p + 3] < 16) continue;

      let sum = 0, wsum = 0;
      for (let k = 0; k < 9; k++) {
        const j = i + offs[k];
        const wt = kern[k] * d[j * 4 + 3];
        sum += luma[j] * wt;
        wsum += wt;
      }
      const diff = luma[i] - sum / wsum;
      const ad = Math.abs(diff);
      if (ad <= threshold) continue;

      const ramp = Math.min(1, (ad - threshold) / threshold);   // 0→1 entre T y 2T (sin escalón)
      const delta = diff * strength * ramp;
      d[p] += delta; d[p + 1] += delta; d[p + 2] += delta;      // Uint8ClampedArray satura solo
    }
  }
  return commitPixels(px);
}
