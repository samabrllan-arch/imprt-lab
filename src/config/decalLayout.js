import { ZONES } from './zones.js';

/**
 * Geometría compartida del estampado (usada por textureComposer, actions,
 * canvasDragController y decalControls) para sincronización exacta.
 */

const OFFSET_X_FACTOR = 0.42; // offsetX 1.0 = 42% del ancho del área
const OFFSET_Y_FACTOR = 0.50; // offsetY 1.0 = 50% del alto del área

export function getZoneArea(zoneId, silhouette = 'man') {
  const zone = ZONES[zoneId];
  if (!zone) return null;
  return (zone.canvasAreaBySilhouette && zone.canvasAreaBySilhouette[silhouette]) || zone.canvasArea;
}

/**
 * Orientación vertical en la prenda: un offset positivo (+Y) sube el estampado hacia el cuello,
 * coherente con el arrastre hacia arriba y el slider de posición Y (hacia abajo baja en la prenda).
 */
export function getVertSign(silhouette = 'man') {
  return 1;
}

/** Tamaño dibujado del estampado en px de canvas (misma fórmula que el composer). */
export function computeDecalSize(img, area, scale = 1, decal = null) {
  const baseCm = area.baseCm || 28;
  const pxPerCm = (area.width || 440) / baseCm;
  if (decal && (decal.lockAspect === false || area.baseCm === 8) && decal.widthCm && decal.heightCm) {
    const maxW = area.bounds?.strict ? (area.bounds.maxX - area.bounds.minX) : Infinity;
    const maxH = area.bounds?.strict ? (area.bounds.maxY - area.bounds.minY) : Infinity;
    return {
      w: Math.min(decal.widthCm * pxPerCm, maxW),
      h: Math.min(decal.heightCm * pxPerCm, maxH)
    };
  }

  const imgAspect = (decal && decal.customAspect)
    ? decal.customAspect
    : ((img.naturalWidth || img.width) / (img.naturalHeight || img.height || 1));

  let w = area.width * scale;
  let h = w / imgAspect;
  if (area.bounds?.strict) {
    const maxW = area.bounds.maxX - area.bounds.minX;
    const maxH = area.bounds.maxY - area.bounds.minY;
    w = Math.min(w, maxW);
    h = Math.min(h, maxH);
  } else if (h > area.height * scale * 1.8) {
    // Permitimos altura extendida hasta 1.8 veces el área para estampados largos hacia abajo
    h = area.height * scale * 1.8;
    w = h * imgAspect;
  }
  return { w, h };
}

/** Semi-extensiones de la caja envolvente del estampado ya rotado. */
export function getHalfExtents(w, h, rotationDeg = 0) {
  const r = (rotationDeg * Math.PI) / 180;
  const c = Math.abs(Math.cos(r));
  const s = Math.abs(Math.sin(r));
  return { w: (w * c + h * s) / 2, h: (w * s + h * c) / 2 };
}

export function getSilhouetteOffsetX(silhouette, area) {
  // Las coordenadas de zones.js están perfectamente calibradas por silueta (hombre: 572, mujer: 564)
  return 0;
}

export function offsetsToCenter(area, silhouette, offsetX, offsetY) {
  const alignX = getSilhouetteOffsetX(silhouette, area);
  return {
    x: area.x + alignX + offsetX * (area.width * OFFSET_X_FACTOR),
    y: area.y + offsetY * getVertSign(silhouette) * (area.height * OFFSET_Y_FACTOR)
  };
}

export function centerToOffsets(area, silhouette, cx, cy) {
  const alignX = getSilhouetteOffsetX(silhouette, area);
  return {
    offsetX: (cx - (area.x + alignX)) / (area.width * OFFSET_X_FACTOR),
    offsetY: (cy - area.y) / (getVertSign(silhouette) * area.height * OFFSET_Y_FACTOR)
  };
}

/** Limita el centro para que el estampado se mantenga dentro de la zona útil de la prenda o vaso sin colapsar. */
export function clampCenterToBounds(center, half, bounds) {
  if (!bounds) return center;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  if (bounds.strict) {
    const loX = bounds.minX + half.w;
    const hiX = bounds.maxX - half.w;
    const loY = bounds.minY + half.h;
    const hiY = bounds.maxY - half.h;
    return {
      x: loX <= hiX ? clamp(center.x, loX, hiX) : (bounds.minX + bounds.maxX) * 0.5,
      y: loY <= hiY ? clamp(center.y, loY, hiY) : (bounds.minY + bounds.maxY) * 0.5
    };
  }
  const marginX = (bounds.maxX - bounds.minX) * 0.35;
  const marginY = (bounds.maxY - bounds.minY) * 0.60;
  const minX = bounds.minX - marginX;
  const maxX = bounds.maxX + marginX;
  const minY = bounds.minY - marginY;
  const maxY = bounds.maxY + marginY;
  return {
    x: clamp(center.x, minX, maxX),
    y: clamp(center.y, minY, maxY)
  };
}

/**
 * Dado el estado de un estampado, devuelve offsetX/offsetY calibrados.
 */
export function constrainOffsets(zoneId, silhouette, decal) {
  const offsetX = decal.offsetX || 0;
  const offsetY = decal.offsetY || 0;
  const area = getZoneArea(zoneId, silhouette);
  if (!area || !area.bounds || !decal.imageElement) return { offsetX, offsetY };

  const { w, h } = computeDecalSize(decal.imageElement, area, decal.scale ?? 1, decal);
  const half = getHalfExtents(w, h, decal.rotation || 0);
  const center = offsetsToCenter(area, silhouette, offsetX, offsetY);
  const clamped = clampCenterToBounds(center, half, area.bounds);
  return centerToOffsets(area, silhouette, clamped.x, clamped.y);
}

/**
 * Medidas reales (cm) y límite de escala: delegadas al motor único `printSizing.js`
 * para que UI, store, WhatsApp y render usen exactamente la misma fórmula.
 */
export { getDecalDimensionsCm, clampScale as constrainScale } from './printSizing.js';
