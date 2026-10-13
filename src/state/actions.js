import { store } from './store.js';
import { FABRIC_COLORS } from '../config/colors.js';
import { constrainOffsets } from '../config/decalLayout.js';
import {
  SIZE_MODES, clampScale, scaleFromWidthCm, syncIntentWidth, resolveScaleForSize,
  computeDimsCm, getImageAspect
} from '../config/printSizing.js';

export function setColor(color) {
  const state = store.getState();
  state.selectedColor = color;
  store.notify('color');
}

/**
 * Cambia la talla y recalcula los estampados según el modo de graduación:
 *  - 'fixed': conserva los cm reales (la escala visual se ajusta a la nueva prenda).
 *  - 'proportional': conserva la proporción con la prenda (se re-limita al área imprimible).
 * Devuelve las zonas cuyo estampado debió reducirse por exceder el área máxima de la talla.
 */
export function setSize(size) {
  const state = store.getState();
  const prevSize = state.selectedSize;
  state.selectedSize = size;
  const silhouette = state.selectedSilhouette || 'man';
  const reduced = [];

  for (const [zoneId, zone] of Object.entries(state.customizations)) {
    if (!zone || !zone.hasDecal) continue;
    const r = resolveScaleForSize(zone, zoneId, size, state.sizeMode, prevSize);
    zone.scale = r.scale;
    if (state.sizeMode === SIZE_MODES.FIXED) {
      zone.widthCm = r.intentCm; // la intención se conserva aunque esta talla la recorte
    } else {
      syncIntentWidth(zone, zoneId, size);
    }
    if (r.reduced) reduced.push({ zoneId, requestedCm: r.requestedWidthCm, appliedCm: r.widthCm });

    const fitted = constrainOffsets(zoneId, silhouette, zone);
    zone.offsetX = fitted.offsetX;
    zone.offsetY = fitted.offsetY;
  }

  store.notify('size');
  return reduced;
}

export function setSizeMode(mode) {
  const state = store.getState();
  if (!Object.values(SIZE_MODES).includes(mode) || state.sizeMode === mode) return;
  state.sizeMode = mode;
  for (const [zoneId, zone] of Object.entries(state.customizations)) {
    if (zone && zone.hasDecal) syncIntentWidth(zone, zoneId, state.selectedSize);
  }
  store.notify('sizeMode');
}

export function setActiveZone(zoneId) {
  const state = store.getState();
  state.activeZone = zoneId;
  store.notify('activeZone');
}

export function setActiveView(viewName) {
  const state = store.getState();
  state.activeView = viewName;
  store.notify('view');
}

export function toggleAutoRotate() {
  const state = store.getState();
  state.isAutoRotate = !state.isAutoRotate;
  store.notify('autoRotate');
}

export function setDecal(zoneId, { name, src, imageElement }) {
  const state = store.getState();
  if (typeof window !== 'undefined') window.__STORE_SILHOUETTE__ = state.selectedSilhouette;
  const zone = state.customizations[zoneId];
  if (!zone) return;

  zone.hasDecal = true;
  zone.name = name || 'Diseño personalizado';
  zone.imageSrc = src;
  zone.imageElement = imageElement;
  zone.lockAspect = true;
  zone.customAspect = null;
  zone.widthCm = null;
  zone.heightCm = null;
  zone.offsetX = 0;
  zone.offsetY = 0;
  zone.scale = 1.0;
  // La proporción de la nueva imagen cambia el área ocupada: re-limitar y fijar los cm reales.
  zone.scale = clampScale(zone.scale, zoneId, state.selectedSize, imageElement);
  syncIntentWidth(zone, zoneId, state.selectedSize);
  store.notify(`decal:${zoneId}`);
}

export function removeDecal(zoneId) {
  const state = store.getState();
  const zone = state.customizations[zoneId];
  if (!zone) return;

  zone.hasDecal = false;
  zone.name = '';
  zone.imageSrc = null;
  zone.imageElement = null;
  zone.widthCm = null;
  zone.heightCm = null;
  zone.lockAspect = true;
  zone.customAspect = null;
  store.notify(`decal:${zoneId}`);
}

export function toggleLockAspect(zoneId) {
  const state = store.getState();
  if (typeof window !== 'undefined') window.__STORE_SILHOUETTE__ = state.selectedSilhouette;
  const zone = state.customizations[zoneId];
  if (!zone) return;
  const newLock = zone.lockAspect === false;
  zone.lockAspect = newLock;
  if (!newLock) {
    const dims = computeDimsCm(zone.scale ?? 1, zoneId, state.selectedSize, getImageAspect(zone.imageElement));
    if (!zone.widthCm) zone.widthCm = dims.w;
    if (!zone.heightCm) zone.heightCm = dims.h;
    zone.customAspect = zone.widthCm / (zone.heightCm || 1);
  }
  store.notify(`transform:${zoneId}`);
}

/**
 * Actualiza la transformación del estampado. `widthCm` o `heightCm` permiten indicar el tamaño real
 * deseado: se convierten a escala con el mismo motor que usa el render.
 */
export function updateDecalTransform(zoneId, { scale, widthCm, heightCm, lockAspect, offsetX, offsetY, rotation }) {
  const state = store.getState();
  if (typeof window !== 'undefined') window.__STORE_SILHOUETTE__ = state.selectedSilhouette;
  const zone = state.customizations[zoneId];
  if (!zone) return;

  if (lockAspect !== undefined) {
    zone.lockAspect = lockAspect;
  }

  const isLocked = zone.lockAspect !== false;
  const isMug = state.selectedSilhouette === 'mug';
  const naturalAspect = getImageAspect(zone.imageElement);
  const currentAspect = (isLocked && isMug) ? naturalAspect : (zone.customAspect || naturalAspect);

  if (widthCm !== undefined && heightCm !== undefined) {
    zone.widthCm = widthCm;
    zone.heightCm = heightCm;
    zone.customAspect = widthCm / (heightCm || 1);
    scale = scaleFromWidthCm(widthCm, zoneId, state.selectedSize, zone.imageElement);
  } else if (widthCm !== undefined) {
    if (isLocked) {
      zone.widthCm = widthCm;
      zone.heightCm = widthCm / currentAspect;
      scale = scaleFromWidthCm(widthCm, zoneId, state.selectedSize, zone.imageElement);
    } else {
      zone.widthCm = widthCm;
      zone.customAspect = zone.heightCm ? widthCm / zone.heightCm : currentAspect;
      scale = scaleFromWidthCm(widthCm, zoneId, state.selectedSize, zone.imageElement);
    }
  } else if (heightCm !== undefined) {
    if (isLocked) {
      zone.heightCm = heightCm;
      zone.widthCm = heightCm * currentAspect;
      scale = scaleFromWidthCm(zone.widthCm, zoneId, state.selectedSize, zone.imageElement);
    } else {
      zone.heightCm = heightCm;
      zone.customAspect = zone.widthCm ? zone.widthCm / heightCm : currentAspect;
    }
  }

  if (scale !== undefined) {
    zone.scale = clampScale(scale, zoneId, state.selectedSize, zone.imageElement);
    syncIntentWidth(zone, zoneId, state.selectedSize);
  }
  if (offsetX !== undefined) zone.offsetX = Math.max(-2.5, Math.min(2.5, offsetX));
  if (offsetY !== undefined) zone.offsetY = Math.max(-2.5, Math.min(2.5, offsetY));
  if (rotation !== undefined) zone.rotation = ((rotation % 360) + 360) % 360;

  // Mantener el estampado dentro de la isla UV de la silueta activa (si tiene `bounds`).
  const silhouette = state.selectedSilhouette || 'man';
  const fitted = constrainOffsets(zoneId, silhouette, zone);
  zone.offsetX = fitted.offsetX;
  zone.offsetY = fitted.offsetY;

  store.notify(`transform:${zoneId}`);
}

export function setViewMode(mode) {
  const state = store.getState();
  if (state.viewMode === mode) return;
  state.viewMode = mode;
  store.notify('viewMode');
}

export function setSilhouette(silhouette) {
  const state = store.getState();
  if (state.selectedSilhouette === silhouette) return;
  const wasMug = state.selectedSilhouette === 'mug';
  const isMug = silhouette === 'mug';
  state.selectedSilhouette = silhouette;
  if (typeof window !== 'undefined') window.__STORE_SILHOUETTE__ = silhouette;

  // En modo Vaso/Mug solo existe una zona frontal/envolvente única y por defecto inicia en cerámica blanca
  if (isMug) {
    if (state.activeZone !== 'front') {
      state.activeZone = 'front';
      store.notify('activeZone');
    }
    if (state.selectedColor?.id === 'terracotta') {
      const white = FABRIC_COLORS.find(c => c.id === 'chalk-white');
      if (white) {
        state.selectedColor = white;
        store.notify('color');
      }
    }
  }

  // Al cambiar entre prenda y vaso (o entre siluetas), recalibrar escala y centrar en el punto de inicio
  let changed = false;
  for (const [zoneId, zone] of Object.entries(state.customizations || {})) {
    if (!zone || !zone.hasDecal) continue;
    if (wasMug !== isMug) {
      zone.scale = 1.0;
      zone.offsetX = 0;
      zone.offsetY = 0;
      zone.widthCm = null;
      zone.heightCm = null;
      zone.customAspect = null;
      syncIntentWidth(zone, zoneId, state.selectedSize);
      changed = true;
    }
    const fitted = constrainOffsets(zoneId, silhouette, zone);
    if (Math.abs(fitted.offsetX - (zone.offsetX || 0)) > 1e-6 || Math.abs(fitted.offsetY - (zone.offsetY || 0)) > 1e-6) {
      zone.offsetX = fitted.offsetX;
      zone.offsetY = fitted.offsetY;
      changed = true;
    }
  }

  store.notify('silhouette');
  if (changed && state.activeZone) store.notify(`transform:${state.activeZone}`);
}

export function setMagicMug(enabled) {
  const state = store.getState();
  const next = !!enabled;
  if (state.isMagicMug === next) return;
  state.isMagicMug = next;
  if (!next) state.mugHeatLevel = 0.0;
  store.notify('magicMug');
}

export function setMugHeatLevel(level) {
  const state = store.getState();
  const clamped = Math.max(0, Math.min(1, Number(level) || 0));
  if (Math.abs(state.mugHeatLevel - clamped) < 1e-4) return;
  state.mugHeatLevel = clamped;
  store.notify('mugHeat');
}

export function setMaterial(materialId) {
  const state = store.getState();
  if (state.selectedMaterial === materialId) return;
  state.selectedMaterial = materialId;
  store.notify('material');
}

export function setGrammage(grammage) {
  const state = store.getState();
  if (state.selectedGrammage === grammage) return;
  state.selectedGrammage = grammage;
  store.notify('grammage');
}
