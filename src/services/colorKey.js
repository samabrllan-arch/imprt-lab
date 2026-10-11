/**
 * Motor de eliminación de fondo para DTF (v4): máscara de fondo + matting de borde.
 *
 * Por qué no queda "halo": el fondo se elimina por máscara, pero los píxeles del borde
 * (antialiasing) son una mezcla  P = a·F + (1-a)·B  entre el color del arte (F) y el del
 * fondo (B). Para cada píxel de borde se estima F con el núcleo cercano del arte y se
 * resuelve la opacidad `a` proyectando P sobre la recta B→F. El color se reemplaza por F
 * (sin tinte del fondo) y se conserva la opacidad parcial: bordes limpios sobre cualquier prenda.
 */

import { makeHueKey } from './chromaHue.js';

const ALPHA_VISIBLE = 16;   // por debajo se considera ya transparente
const SOLID_ALPHA = 250;    // por encima se considera píxel opaco procesable

/** Distancia euclidiana ponderada por percepción visual humana */
export function colorDistance(r1, g1, b1, r2, g2, b2) {
  const rmean = (r1 + r2) / 2;
  const r = r1 - r2;
  const g = g1 - g2;
  const b = b1 - b2;
  return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
}

/** Índices de todos los píxeles del perímetro (semillas para inundar el fondo exterior). */
export function borderSeeds(width, height) {
  const seeds = [];
  for (let x = 0; x < width; x++) seeds.push(x, (height - 1) * width + x);
  for (let y = 1; y < height - 1; y++) seeds.push(y * width, y * width + width - 1);
  return seeds;
}

/**
 * Máscara de fondo (1 = se elimina). Sin `seeds`, global; con `seeds`, solo la región
 * conectada (4 vecinos) a esas semillas. Los píxeles ya transparentes cuentan como fondo.
 * `hueKey` (opcional, fondos croma): también cuenta como fondo todo píxel del mismo tono.
 */
export function buildBackgroundMask(imageData, target, tolerance, seeds = null, hueKey = null, bounds = null) {
  const { data, width: w, height: h } = imageData;
  const total = w * h;
  const maxDist = (tolerance / 100) * 440;
  const mask = new Uint8Array(total);
  const minX = bounds ? Math.max(0, bounds.minX) : 0;
  const minY = bounds ? Math.max(0, bounds.minY) : 0;
  const maxX = bounds ? Math.min(w - 1, bounds.maxX) : w - 1;
  const maxY = bounds ? Math.min(h - 1, bounds.maxY) : h - 1;

  const isBg = (i) => {
    const p = i * 4;
    if (data[p + 3] < ALPHA_VISIBLE) return true;
    if (colorDistance(data[p], data[p + 1], data[p + 2], target.r, target.g, target.b) <= maxDist) return true;
    return hueKey !== null && hueKey(data[p], data[p + 1], data[p + 2]);
  };

  if (!seeds) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const i = y * w + x;
        mask[i] = isBg(i) ? 1 : 0;
      }
    }
    return mask;
  }

  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  const push = (i) => {
    if (mask[i] || !isBg(i)) return;
    if (bounds) {
      const x = i % w, y = (i / w) | 0;
      if (x < minX || x > maxX || y < minY || y > maxY) return;
    }
    mask[i] = 1;
    queue[tail++] = i;
  };
  for (const s of seeds) push(s);
  while (head < tail) {
    const i = queue[head++];
    const x = i % w;
    if (x > (bounds ? minX : 0)) push(i - 1);
    if (x < (bounds ? maxX : w - 1)) push(i + 1);
    if (i >= w && (bounds ? ((i / w) | 0) > minY : true)) push(i - w);
    if (i < total - w && (bounds ? ((i / w) | 0) < maxY : true)) push(i + w);
  }
  return mask;
}

/** Elimina islas pequeñas de "arte" (ruido JPEG, motas) rodeadas de fondo. */
export function removeSpecks(mask, w, h, minSize = 12) {
  const total = w * h;
  const seen = new Uint8Array(total);
  const queue = new Int32Array(total);
  for (let s = 0; s < total; s++) {
    if (mask[s] || seen[s]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = s;
    seen[s] = 1;
    while (head < tail) {
      const i = queue[head++];
      const x = i % w;
      const visit = (j) => { if (!mask[j] && !seen[j]) { seen[j] = 1; queue[tail++] = j; } };
      if (x > 0) visit(i - 1);
      if (x < w - 1) visit(i + 1);
      if (i >= w) visit(i - w);
      if (i < total - w) visit(i + w);
    }
    if (tail < minSize) for (let k = 0; k < tail; k++) mask[queue[k]] = 1;
  }
}

/** Dilatación cuadrada (Chebyshev) separable en O(N): 1 si hay fondo a ≤ r píxeles. */
export function dilate(mask, w, h, r) {
  const tmp = new Uint8Array(w * h);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let count = 0;
    for (let x = 0; x <= Math.min(r, w - 1); x++) count += mask[row + x];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = count > 0 ? 1 : 0;
      if (x + r + 1 < w) count += mask[row + x + r + 1];
      if (x - r >= 0) count -= mask[row + x - r];
    }
  }
  for (let x = 0; x < w; x++) {
    let count = 0;
    for (let y = 0; y <= Math.min(r, h - 1); y++) count += tmp[y * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = count > 0 ? 1 : 0;
      if (y + r + 1 < h) count += tmp[(y + r + 1) * w + x];
      if (y - r >= 0) count -= tmp[(y - r) * w + x];
    }
  }
  return out;
}

/**
 * Matting de borde: separa arte y fondo en los píxeles de transición.
 * `residual`: distancia máxima (RGB) a la recta B→F para considerarlo una mezcla real.
 */
export function matteEdges(imageData, mask, target, { radius = 2, residual = 36 } = {}) {
  const { data, width: w, height: h } = imageData;
  const src = new Uint8ClampedArray(data);
  const near = dilate(mask, w, h, radius);
  const R = radius + 2;
  const { r: br, g: bg, b: bb } = target;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const p = i * 4;
      if (mask[i]) { data[p + 3] = 0; continue; }
      if (!near[i] || src[p + 3] < SOLID_ALPHA) continue; // núcleo del arte o píxel ya parcial

      // Estimar el color puro del arte (F) con el núcleo cercano; si no hay (trazo fino),
      // usar el vecino más alejado del fondo.
      let ws = 0, fr = 0, fg = 0, fb = 0;
      let bestD = -1, sr = 0, sg = 0, sb = 0;
      for (let yy = Math.max(0, y - R); yy <= Math.min(h - 1, y + R); yy++) {
        for (let xx = Math.max(0, x - R); xx <= Math.min(w - 1, x + R); xx++) {
          const j = yy * w + xx;
          if (mask[j]) continue;
          const q = j * 4;
          if (src[q + 3] < SOLID_ALPHA) continue;
          if (!near[j]) {
            const wt = 1 / (1 + (xx - x) * (xx - x) + (yy - y) * (yy - y));
            ws += wt; fr += src[q] * wt; fg += src[q + 1] * wt; fb += src[q + 2] * wt;
          } else {
            const d = (src[q] - br) ** 2 + (src[q + 1] - bg) ** 2 + (src[q + 2] - bb) ** 2;
            if (d > bestD) { bestD = d; sr = src[q]; sg = src[q + 1]; sb = src[q + 2]; }
          }
        }
      }
      let Fr, Fg, Fb;
      if (ws > 0) { Fr = fr / ws; Fg = fg / ws; Fb = fb / ws; }
      else if (bestD >= 0) { Fr = sr; Fg = sg; Fb = sb; }
      else continue;

      const dx = Fr - br, dy = Fg - bg, dz = Fb - bb;
      const len2 = dx * dx + dy * dy + dz * dz;
      if (len2 < 600) continue; // arte casi igual al fondo: no hay información para separar

      const pr = src[p] - br, pg = src[p + 1] - bg, pb = src[p + 2] - bb;
      const a = Math.min(1, Math.max(0, (pr * dx + pg * dy + pb * dz) / len2));
      const er = br + a * dx - src[p], eg = bg + a * dy - src[p + 1], eb = bb + a * dz - src[p + 2];
      if (Math.sqrt(er * er + eg * eg + eb * eb) > residual) continue; // detalle propio del arte
      if (a >= 0.97) continue;                                          // opaco: conservar color
      if (a <= 0.03) { data[p + 3] = 0; continue; }

      data[p] = Fr; data[p + 1] = Fg; data[p + 2] = Fb;
      data[p + 3] = Math.round(a * 255);
    }
  }
}

/** Afina el borde del arte `n` píxeles (erosión suave del canal alfa). */
export function chokeAlpha(data, w, h, n) {
  for (let it = 0; it < n; it++) {
    const snap = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) snap[i] = data[i * 4 + 3];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const a = snap[i];
        if (a === 0) continue;
        const nb = Math.min(
          x > 0 ? snap[i - 1] : 0, x < w - 1 ? snap[i + 1] : 0,
          y > 0 ? snap[i - w] : 0, y < h - 1 ? snap[i + w] : 0
        );
        if (nb < a) data[i * 4 + 3] = Math.round((a + nb) / 2);
      }
    }
  }
}

/**
 * Supresión de color de fondo (Despill): neutraliza el tinte del color de fondo
 * en los píxeles del perímetro y de transición para eliminar halos verdes, azules o cromáticos.
 */
export function suppressColorSpill(data, w, h, target, mask, radius = 4) {
  const near = dilate(mask, w, h, radius);
  const { r: br, g: bg, b: bb } = target;

  const isGreenDominant = bg > br * 1.10 && bg > bb * 1.05;
  const isBlueDominant = bb > br * 1.10 && bb > bg * 1.05;
  const isRedDominant = br > bg * 1.10 && br > bb * 1.05;

  for (let i = 0; i < w * h; i++) {
    if (mask[i] || !near[i]) continue;
    const p = i * 4;
    const a = data[p + 3];
    if (a === 0) continue;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    if (isGreenDominant && g > r && g > b) {
      data[p + 1] = Math.max(r, b);
    } else if (isBlueDominant && b > r && b > g) {
      data[p + 2] = Math.max(r, g);
    } else if (isRedDominant && r > g && r > b) {
      data[p] = Math.max(g, b);
    }
  }
}

/**
 * Pipeline completo. Modifica `imageData` en sitio.
 * @returns {{modified:boolean, erasedCount:number}}
 */
export function keyBackground(imageData, target, options = {}) {
  const { tolerance = 30, feather = 12, seeds = null, choke = 0, despeckle = true, despill = true, residual = 36, hueTolerance = tolerance, bounds = null } = options;
  const { data, width: w, height: h } = imageData;

  const hueKey = makeHueKey(target, hueTolerance);
  const mask = buildBackgroundMask(imageData, target, tolerance, seeds, hueKey, bounds);
  if (despeckle && !seeds) removeSpecks(mask, w, h, 12);

  let erasedCount = 0;
  for (let i = 0; i < w * h; i++) if (mask[i] && data[i * 4 + 3] >= ALPHA_VISIBLE) erasedCount++;
  if (erasedCount === 0) return { modified: false, erasedCount };

  matteEdges(imageData, mask, target, { radius: 1 + Math.round(feather / 10), residual });

  if (despill && target) {
    suppressColorSpill(data, w, h, target, mask, 3 + Math.round(feather / 6));
  }

  if (choke > 0) chokeAlpha(data, w, h, choke);
  return { modified: true, erasedCount };
}


