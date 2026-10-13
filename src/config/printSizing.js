import { ZONES } from './zones.js';

/**
 * Motor único de dimensiones reales (cm) del estampado.
 *
 * Modelo físico (fuente de verdad compartida por UI, store, WhatsApp y tests):
 *  - El modelo 3D se calibra visualmente sobre la talla de referencia (L, 54 cm de pecho).
 *  - A escala 1.0 el estampado mide `baseCm` de la zona en la talla de referencia.
 *  - En otras tallas, `baseCm` se multiplica por (ancho de prenda / ancho de referencia).
 *  - Dos modos de graduación:
 *      · 'fixed'        → el estampado conserva sus cm en todas las tallas.
 *      · 'proportional' → el estampado conserva su proporción con la prenda.
 *  - Todas las medidas son lineales respecto a `scale`, por lo que se puede invertir exacto.
 */

export const REFERENCE_WIDTH_CM = 54;
export const MIN_SCALE = 0.2;
export const SIZE_MODES = { FIXED: 'fixed', PROPORTIONAL: 'proportional' };

const DEFAULT_MAX_SCALE = 2.2;
const TALL_ASPECT_LIMIT = 1.3; // misma regla que computeDecalSize (px)
const FALLBACK_BASE_CM = 28;
const MUG_BASE_CM = 8.0;
const MUG_MAX_W_CM = 21.0;
const MUG_MAX_H_CM = 8.5;

const isMugActive = () => typeof window !== 'undefined' && window.__STORE_SILHOUETTE__ === 'mug';

/** Ancho (cm) del estampado a escala 1.0 en talla de referencia y límites propios de zona. */
export const ZONE_PRINT = {
  front: { baseCm: 28, defaultScale: 1.0 },
  frontPocket: { baseCm: 11, defaultScale: 0.85, maxWidthCm: 12, maxHeightCm: 12 },
  back: { baseCm: 29, defaultScale: 1.0 }
};

/** Anchos (cm) sugeridos como atajos, por zona. */
export const ZONE_PRESET_WIDTHS_CM = {
  front: [10, 15, 21, 28],
  frontPocket: [5, 8, 10],
  back: [10, 15, 21, 28],
  mug: [6, 10, 15]
};

const round1 = (n) => Math.round(n * 10) / 10;

export function getDefaultScale(zoneId) {
  return ZONE_PRINT[zoneId]?.defaultScale ?? 1.0;
}

export function getSizeRatio(size) {
  if (isMugActive()) return 1;
  return (size?.widthCm || REFERENCE_WIDTH_CM) / REFERENCE_WIDTH_CM;
}

export function getImageAspect(img) {
  if (!img) return 1;
  const w = img.naturalWidth || img.width || 1;
  const h = img.naturalHeight || img.height || 1;
  return w / h;
}

/** Medidas en cm (sin redondear) para una escala dada. */
export function computeDimsCm(scale, zoneId, size, aspect = 1) {
  if (isMugActive()) {
    const w = Math.min(MUG_BASE_CM * scale, MUG_MAX_W_CM);
    const h = Math.min(w / (aspect || 1), MUG_MAX_H_CM);
    return { w, h };
  }
  const base = (ZONE_PRINT[zoneId]?.baseCm ?? FALLBACK_BASE_CM) * getSizeRatio(size) * scale;
  let w = base;
  let h = w / aspect;
  if (h > base * TALL_ASPECT_LIMIT) {
    h = base;
    w = h * aspect;
  }
  return { w, h };
}

/** Área máxima imprimible (cm) para la zona y talla. */
export function getPrintLimits(zoneId, size) {
  if (isMugActive()) {
    return { maxW: MUG_MAX_W_CM, maxH: MUG_MAX_H_CM };
  }
  const zone = ZONE_PRINT[zoneId] || {};
  const ratio = getSizeRatio(size);
  return {
    maxW: zone.maxWidthCm ? zone.maxWidthCm * ratio : (size?.maxPrintWidthCm || 32),
    maxH: zone.maxHeightCm ? zone.maxHeightCm * ratio : (size?.maxPrintHeightCm || 42)
  };
}

/** Escala máxima para que ni ancho ni alto superen el área imprimible. */
export function getMaxScale(zoneId, size, aspect = 1) {
  if (isMugActive()) {
    return MUG_MAX_W_CM / MUG_BASE_CM;
  }
  const { maxW, maxH } = getPrintLimits(zoneId, size);
  const unit = computeDimsCm(1, zoneId, size, aspect);
  const zoneMax = ZONES[zoneId]?.limits?.maxScale ?? DEFAULT_MAX_SCALE;
  return Math.max(Math.min(maxW / unit.w, maxH / unit.h, zoneMax), 0.4);
}

export function clampScale(scale, zoneId, size, img) {
  const max = getMaxScale(zoneId, size, getImageAspect(img));
  return Math.min(Math.max(scale, MIN_SCALE), max);
}

export function scaleFromWidthCm(widthCm, zoneId, size, img) {
  if (isMugActive()) {
    return widthCm / MUG_BASE_CM;
  }
  const unit = computeDimsCm(1, zoneId, size, getImageAspect(img));
  return widthCm / unit.w;
}

/** Rango de ancho (cm) permitido por el control para la zona/talla/imagen actuales. */
export function getWidthRangeCm(zoneId, size, img) {
  if (isMugActive()) {
    return { min: 2.0, max: MUG_MAX_W_CM };
  }
  const aspect = getImageAspect(img);
  const unit = computeDimsCm(1, zoneId, size, aspect);
  return { min: round1(unit.w * MIN_SCALE), max: Math.floor(unit.w * getMaxScale(zoneId, size, aspect) * 10) / 10 };
}

/** Rango de alto (cm) imprimible permitido para la zona y talla. */
export function getHeightRangeCm(zoneId, size) {
  const { maxH } = getPrintLimits(zoneId, size);
  return { min: isMugActive() ? 2.0 : 4, max: round1(maxH) };
}

/** Medidas redondeadas + uso del área máxima de impresión. */
export function getDecalDimensionsCm(decal, zoneId, size) {
  const { maxW, maxH } = getPrintLimits(zoneId, size);
  const base = { maxWidthCm: round1(maxW), maxHeightCm: round1(maxH) };
  if (!decal) return { widthCm: 0, heightCm: 0, ...base, usage: 0, atLimit: false, isLocked: true };

  const isLocked = decal.lockAspect !== false;
  let w, h;
  if ((!isLocked || isMugActive()) && decal.widthCm && decal.heightCm) {
    w = Math.min(decal.widthCm, maxW);
    h = Math.min(decal.heightCm, maxH);
  } else {
    const aspect = decal.customAspect || getImageAspect(decal.imageElement);
    const dims = computeDimsCm(decal.scale ?? 1, zoneId, size, aspect);
    w = Math.min(dims.w, maxW);
    h = Math.min(dims.h, maxH);
  }

  const usage = Math.max(w / maxW, h / maxH);
  return {
    widthCm: round1(w),
    heightCm: round1(h),
    ...base,
    usage: Math.min(usage, 1),
    atLimit: usage >= 0.995,
    isLocked
  };
}

/** Guarda el ancho y alto real (intención de diseño) a partir de la escala vigente. */
export function syncIntentWidth(decal, zoneId, size) {
  if ((decal.lockAspect === false || isMugActive()) && decal.widthCm && decal.heightCm) {
    const { maxW, maxH } = getPrintLimits(zoneId, size);
    decal.widthCm = Math.min(Math.max(decal.widthCm, 2.0), maxW);
    decal.heightCm = Math.min(Math.max(decal.heightCm, 2.0), maxH);
    decal.customAspect = decal.widthCm / (decal.heightCm || 1);
    return;
  }
  const dims = computeDimsCm(decal.scale ?? 1, zoneId, size, getImageAspect(decal.imageElement));
  decal.widthCm = dims.w;
  decal.heightCm = dims.h;
}

/**
 * Calcula cómo queda el estampado en `targetSize` según el modo.
 * `fromSize` es la talla en la que se diseñó (para derivar los cm si aún no hay intención).
 */
export function resolveScaleForSize(decal, zoneId, targetSize, mode, fromSize) {
  const aspect = decal?.customAspect || getImageAspect(decal.imageElement);
  if (decal?.lockAspect === false && decal.widthCm && decal.heightCm) {
    const { maxW, maxH } = getPrintLimits(zoneId, targetSize);
    const rFrom = getSizeRatio(fromSize);
    const rTarget = getSizeRatio(targetSize);
    const widthCm = mode === SIZE_MODES.FIXED ? decal.widthCm : (decal.widthCm * rTarget / (rFrom || 1));
    const heightCm = mode === SIZE_MODES.FIXED ? decal.heightCm : (decal.heightCm * rTarget / (rFrom || 1));
    const clampedW = Math.min(widthCm, maxW);
    const clampedH = Math.min(heightCm, maxH);
    const reduced = clampedW < widthCm - 1e-6 || clampedH < heightCm - 1e-6;
    return {
      scale: decal.scale ?? 1,
      intentCm: decal.widthCm,
      reduced,
      widthCm: round1(clampedW),
      heightCm: round1(clampedH),
      requestedWidthCm: round1(widthCm)
    };
  }

  const intentCm = decal.widthCm ?? computeDimsCm(decal.scale ?? 1, zoneId, fromSize, aspect).w;
  const requested = mode === SIZE_MODES.FIXED
    ? scaleFromWidthCm(intentCm, zoneId, targetSize, decal.imageElement)
    : (decal.scale ?? 1);
  const scale = clampScale(requested, zoneId, targetSize, decal.imageElement);
  const dims = computeDimsCm(scale, zoneId, targetSize, aspect);
  const requestedDims = computeDimsCm(requested, zoneId, targetSize, aspect);
  return {
    scale,
    intentCm,
    reduced: scale < requested - 1e-6,
    widthCm: round1(dims.w),
    heightCm: round1(dims.h),
    requestedWidthCm: round1(requestedDims.w)
  };
}

/** Tabla comparativa: cómo queda el diseño en cada talla. */
export function buildSizeTable(decal, zoneId, sizes, mode, currentSize) {
  return sizes.map((size) => ({
    id: size.id,
    label: size.label,
    ...resolveScaleForSize(decal, zoneId, size, mode, currentSize)
  }));
}

/** Atajos en cm válidos para el rango actual (incluye "Máx"). */
export function buildPresetWidths(zoneId, range) {
  const key = isMugActive() ? 'mug' : zoneId;
  const list = (ZONE_PRESET_WIDTHS_CM[key] || []).filter((cm) => cm >= range.min && cm <= range.max - 0.8);
  return [...list.map((cm) => ({ cm, label: `${cm}` })), { cm: range.max, label: 'Máx', isMax: true }];
}
