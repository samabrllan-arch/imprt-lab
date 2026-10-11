/**
 * Generador memoizado del arte DTF a 300 DPI (extraído de orderModal.js, NODE-019 / NODE-024).
 * Se ejecuta bajo demanda para no bloquear el hilo al abrir el checkout.
 */
import { store } from '../state/store.js';
import { getPrimaryDecal } from '../services/orderDraft.js';
import { upscaleTo300Dpi, embedDpiInPng } from '../services/printResolution.js';

export function createArtGenerator(orderId) {
  let cached = null;
  let cachedKey = '';

  return async function getOrGenerate300Dpi() {
    const primary = getPrimaryDecal(store.getState());
    if (!primary) return null;
    if (cached && cachedKey === primary.key) return cached;
    if (!primary.zone.imageElement) return null;

    // Cede el hilo para que el feedback visual (spinner) se pinte antes del cálculo pesado.
    await new Promise((resolve) => setTimeout(resolve, 30));

    try {
      const { zoneId, zone, dims } = primary;
      const upscaled = upscaleTo300Dpi(zone.imageElement, dims.widthCm, dims.heightCm);
      const png = embedDpiInPng(upscaled.toDataURL('image/png'), 300);
      cached = { png, fileName: `PEDIDO_${orderId}_${zoneId}_${dims.widthCm}x${dims.heightCm}cm_300DPI.png`, dims };
      cachedKey = primary.key;
      return cached;
    } catch (err) {
      console.warn('[Art300] Error generando 300 DPI:', err);
      return null;
    }
  };
}
