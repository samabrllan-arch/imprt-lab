import { store } from '../state/store.js';
import { computeDimsCm, ZONE_PRINT } from '../config/printSizing.js';
import { computeEffectiveDpi, getDpiQuality } from '../services/printResolution.js';
import { clampScaleFor, getZoneMaxPx } from '../services/dpiClamp.js';

/**
 * Insignia de telemetría DTF del editor (NODE-010 / NODE-019): DPI efectivos del lienzo actual según el
 * ancho físico con el que se imprimirá en la zona activa (talla y escala vigentes).
 *   🟢 300 DPI • Óptimo DTF   ·   ⚠️ 120 DPI • Calidad Baja (Remuestreado a 300 DPI para impresión)
 */
export function createDpiBadge(ed) {
  const badge = ed.q('#editor-dpi-badge');
  const label = ed.q('#editor-dpi-label');
  const note = ed.q('#editor-dpi-note');

  /** Ancho de impresión (cm) del lienzo actual: escala vigente de la zona y la talla elegida. */
  function printWidthCm() {
    const state = store.getState();
    const zoneId = state.activeZone;
    const decal = state.customizations?.[zoneId];
    const scale = decal?.scale ?? ZONE_PRINT[zoneId]?.defaultScale ?? 1;
    const aspect = ed.canvas.width / Math.max(1, ed.canvas.height);
    return computeDimsCm(scale, zoneId, state.selectedSize, aspect).w;
  }

  function update() {
    if (!badge || !ed.canvas.width) return null;
    const dpi = computeEffectiveDpi(ed.canvas.width, printWidthCm());
    const q = getDpiQuality(dpi);
    badge.className = `dpi-badge ${q.badgeClass}`;
    badge.dataset.level = q.level;
    label.textContent = `${q.icon} ${q.label}`;

    const zoneId = store.getState().activeZone;
    const over = clampScaleFor(ed.canvas.width, ed.canvas.height, getZoneMaxPx(zoneId)) < 1;
    badge.title = over
      ? `Tu arte tiene ${dpi} DPI efectivos: más de 300 no se nota en la tela. Se reducirá a 300 DPI al aplicar para ahorrar espacio.`
      : q.summary;
    if (note) note.textContent = over ? 'Se optimizará a 300 DPI al aplicar' : '';
    return { dpi, level: q.level, over };
  }

  return { update };
}
