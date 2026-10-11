/**
 * NÚCLEO DE MÁSCARAS PARA RECORTES NÍTIDOS ESTILO VECTOR / DTF (<220 Líneas)
 * Morfología de alfa (choke real), defringe de color, bleed de borde y curva de endurecimiento.
 * Trabaja solo sobre typed arrays / ImageData: no depende del DOM.
 */

/** Mezcla con el color interior según la profundidad del píxel de borde (1 = el más externo). */
export const EDGE_BAND_WEIGHTS = [1.0, 0.5];
const BLEED_RADIUS = 2;      // px que se rellenan fuera del núcleo con color limpio
const CORE_ALPHA = 128;      // alfa mínimo para considerar un píxel "sólido"
const HARDEN_LO = 0.05;      // por debajo: transparente (mata la neblina residual)
const HARDEN_HI = 0.95;      // por encima: opaco (borde firme); entre ambos: transición suave

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function smoothstep(e0, e1, x) {
  if (e1 <= e0) return x >= e1 ? 1 : 0;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

const HARDEN_LUT = (() => {
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) lut[v] = Math.round(255 * smoothstep(HARDEN_LO, HARDEN_HI, v / 255));
  return lut;
})();

/** Mínimo/máximo 3x3 separable. Fuera de la imagen no cuenta (el arte pegado al borde no se come). */
function morph3x3(src, w, h, iterations, useMax) {
  const cur = src.slice();
  const tmp = new Uint8Array(w * h);
  const s = useMax ? 1 : -1;               // comparar v*s > m*s equivale a max (s=1) o min (s=-1)
  for (let n = 0; n < iterations; n++) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const i = row + x;
        let m = cur[i];
        if (x > 0 && cur[i - 1] * s > m * s) m = cur[i - 1];
        if (x < w - 1 && cur[i + 1] * s > m * s) m = cur[i + 1];
        tmp[i] = m;
      }
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let m = tmp[i];
        if (y > 0 && tmp[i - w] * s > m * s) m = tmp[i - w];
        if (y < h - 1 && tmp[i + w] * s > m * s) m = tmp[i + w];
        cur[i] = m;
      }
    }
  }
  return cur;
}

/** Choke real: erosiona el alfa N píxeles (8 vecinos), conservando la rampa suave del original. */
export const erodeAlpha = (alpha, w, h, iterations) => morph3x3(alpha, w, h, Math.max(0, iterations | 0), false);
export const dilateMask = (mask, w, h, iterations) => morph3x3(mask, w, h, Math.max(0, iterations | 0), true);

/** Relleno por inundación (4-conectado) desde el perímetro sobre los píxeles candidatos. */
export function floodFromBorder(candidate, w, h) {
  const total = w * h;
  const out = new Uint8Array(total);
  const stack = new Int32Array(total);
  let sp = 0;
  const push = (i) => { if (candidate[i] && !out[i]) { out[i] = 1; stack[sp++] = i; } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (sp > 0) {
    const i = stack[--sp];
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i + w < total) push(i + w);
  }
  return out;
}

/**
 * Convierte el alfa crudo (0..1) en Uint8. Los píxeles de primer plano lejos de cualquier fondo
 * (>2px) se fuerzan a opacos: así ninguna zona interior queda translúcida por parecerse al fondo.
 */
export function softenAlphaNearEdge(raw, w, h) {
  const total = w * h;
  const bg = new Uint8Array(total);
  for (let i = 0; i < total; i++) bg[i] = raw[i] < 0.5 ? 1 : 0;
  const near = morph3x3(bg, w, h, 2, true);
  const out = new Uint8Array(total);
  for (let i = 0; i < total; i++) out[i] = (!bg[i] && !near[i]) ? 255 : Math.round(raw[i] * 255);
  return out;
}

/** Profundidad Chebyshev al borde: 0 = fuera del núcleo, 1..band = cerca del borde, band+1 = interior. */
function computeEdgeDepth(core, w, h, band) {
  const depth = new Uint8Array(w * h);
  let inner = core;
  for (let k = 1; k <= band; k++) {
    const eroded = morph3x3(inner, w, h, 1, false);
    for (let i = 0; i < w * h; i++) if (inner[i] && !eroded[i]) depth[i] = k;
    inner = eroded;
  }
  for (let i = 0; i < w * h; i++) if (inner[i]) depth[i] = band + 1;
  return depth;
}

/** Promedia el RGB de vecinos del conjunto `accept(j)`; radio 1 y, si no hay, radio 2. */
function averageNeighbors(src, w, h, x, y, accept) {
  for (let rad = 1; rad <= BLEED_RADIUS; rad++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let dy = -rad; dy <= rad; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= h) continue;
      for (let dx = -rad; dx <= rad; dx++) {
        const nx = x + dx;
        if ((dx === 0 && dy === 0) || nx < 0 || nx >= w) continue;
        const j = ny * w + nx;
        if (!accept(j)) continue;
        const p = j * 4;
        r += src[p]; g += src[p + 1]; b += src[p + 2]; n++;
      }
    }
    if (n > 0) return [r / n, g / n, b / n];
  }
  return null;
}

/** Defringe real: el color del borde se sustituye por el de los píxeles más profundos (limpia verde/negro/neblina). */
function defringeColors(src, dst, depth, w, h, band, despill) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const dp = depth[i];
      if (dp === 0 || dp > band) continue;
      const p = i * 4;
      const avg = averageNeighbors(src, w, h, x, y, (j) => depth[j] > dp);
      if (avg) {
        const wgt = EDGE_BAND_WEIGHTS[Math.min(dp, EDGE_BAND_WEIGHTS.length) - 1];
        dst[p] = src[p] + (avg[0] - src[p]) * wgt;
        dst[p + 1] = src[p + 1] + (avg[1] - src[p + 1]) * wgt;
        dst[p + 2] = src[p + 2] + (avg[2] - src[p + 2]) * wgt;
      } else if (despill > 0) {
        // Trazo finísimo sin interior: solo se atenúa el exceso de verde
        const spill = src[p + 1] - Math.max(src[p], src[p + 2]);
        if (spill > 0) dst[p + 1] = src[p + 1] - spill * despill;
      }
    }
  }
}

/** Los píxeles parciales fuera del núcleo toman el color limpio del núcleo (si no hay vecino, se descartan). */
function bleedColors(data, alpha8, core, w, h) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (core[i] || alpha8[i] === 0) continue;
      const avg = averageNeighbors(data, w, h, x, y, (j) => core[j] === 1);
      if (!avg) { alpha8[i] = 0; continue; }
      const p = i * 4;
      data[p] = avg[0]; data[p + 1] = avg[1]; data[p + 2] = avg[2];
    }
  }
}

/**
 * Cierre del pipeline: choke → defringe de color → bleed → curva de alfa.
 * `alpha` es un Uint8Array (0..255) por píxel; `imgData.data` se modifica in situ.
 */
export function finalizeCutout(imgData, alpha, { choke = 1, despill = 0 } = {}) {
  const { data, width: w, height: h } = imgData;
  const total = w * h;
  const a8 = erodeAlpha(alpha, w, h, choke);
  const core = new Uint8Array(total);
  for (let i = 0; i < total; i++) core[i] = a8[i] >= CORE_ALPHA ? 1 : 0;

  const band = EDGE_BAND_WEIGHTS.length;
  const depth = computeEdgeDepth(core, w, h, band);
  const src = new Uint8ClampedArray(data);
  defringeColors(src, data, depth, w, h, band, despill);
  bleedColors(data, a8, core, w, h);

  for (let i = 0; i < total; i++) data[i * 4 + 3] = HARDEN_LUT[a8[i]];
  return imgData;
}
