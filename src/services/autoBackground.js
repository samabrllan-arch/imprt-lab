import { keyBackground, borderSeeds, chokeAlpha } from './colorKey.js';

/**
 * Quitar fondo "en 1 clic" (v5).
 *
 * Antes el modo automático borraba ese color en TODA la imagen con la tolerancia completa,
 * lo que se comía las zonas oscuras del arte (azul marino, sombras internas) y aun así dejaba
 * restos de la sombra exterior. Ahora se hace en dos pasadas:
 *  1. Fondo exterior: inundación desde el perímetro con la tolerancia del usuario
 *     (atrapa degradados y sombras suaves pero no cruza el contorno del arte).
 *  2. Bolsillos internos (huecos de letras, aros): solo píxeles casi idénticos al fondo
 *     (tolerancia estricta), para no tocar detalles propios del dibujo.
 */
export function eraseBackgroundAuto(imageData, bgColor, { tolerance = 30, feather = 10, choke = 0 } = {}) {
  const { width, height } = imageData;

  const outer = keyBackground(imageData, bgColor, {
    tolerance,
    feather,
    seeds: borderSeeds(width, height)
  });

  const innerTolerance = Math.max(4, Math.min(10, tolerance * 0.35));
  const inner = keyBackground(imageData, bgColor, {
    tolerance: innerTolerance,
    hueTolerance: tolerance, // fondos croma: el tono sí sigue la sensibilidad del usuario
    feather: Math.min(feather, 6),
    despill: false
  });

  if (choke > 0 && (outer.modified || inner.modified)) {
    chokeAlpha(imageData.data, width, height, choke);
  }

  return {
    modified: outer.modified || inner.modified,
    erasedCount: outer.erasedCount + inner.erasedCount,
    sampledColor: bgColor
  };
}
