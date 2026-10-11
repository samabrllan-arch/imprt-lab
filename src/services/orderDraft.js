/**
 * Borrador del pedido en caché (`shirt_pending_order_draft`) — NODE-024.
 * Se guarda ANTES de verificar la sesión; si el usuario no está autenticado, el borrador espera
 * en localStorage y `checkoutOrderFlow.js` lo retoma automáticamente al iniciar sesión.
 */
import { getDecalDimensionsCm } from '../config/decalLayout.js';
import { formatCurrency } from '../config/pricing.js';

export const DRAFT_STORAGE_KEY = 'shirt_pending_order_draft';
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const ZONE_NAMES = { front: 'Frente Central', frontPocket: 'Logo Pecho', back: 'Espalda' };

/** Copia en memoria: conserva la captura 3D aunque localStorage no tenga cupo para ella. */
let memoryDraft = null;

export function getZoneName(zoneId) {
  return ZONE_NAMES[zoneId] || zoneId;
}

/** Primer estampado activo + su clave de arte (misma fórmula que la caché de 300 DPI). */
export function getPrimaryDecal(state) {
  const entry = Object.entries(state.customizations).find(([, z]) => z.hasDecal);
  if (!entry) return null;
  const [zoneId, zone] = entry;
  const dims = getDecalDimensionsCm(zone, zoneId, state.selectedSize);
  const key = `${zoneId}_${zone.name}_${state.selectedSize.id}_${dims.widthCm}_${dims.heightCm}`;
  return { zoneId, zone, dims, key };
}

export function buildOrderDraft({ orderId, state, screenshot, customer }) {
  const { selectedColor, selectedSize, selectedSilhouette, selectedMaterial, selectedGrammage, pricing } = state;
  const decals = Object.entries(state.customizations)
    .filter(([, z]) => z.hasDecal)
    .map(([zoneId, z]) => {
      const dims = getDecalDimensionsCm(z, zoneId, selectedSize);
      return { zone: zoneId, zoneName: getZoneName(zoneId), name: z.name, widthCm: dims.widthCm, heightCm: dims.heightCm };
    });

  return {
    version: 1,
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: { name: customer.name, city: customer.city },
    garment: {
      silhouette: selectedSilhouette === 'woman' ? 'Mujer (Slim Fit)' : 'Hombre (Boxy Fit)',
      size: selectedSize.label,
      sizeName: selectedSize.name,
      dimensionsCm: `${selectedSize.lengthCm}x${selectedSize.widthCm}`,
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      material: selectedMaterial === 'poliester' ? 'Poliéster Dry-Fit' : 'Algodón 100% Peinado',
      grammage: `${selectedGrammage || '240'} GSM`
    },
    decals,
    pricing: { total: pricing.total, formatted: formatCurrency(pricing.total) },
    artKey: getPrimaryDecal(state)?.key || null,
    screenshot: screenshot || null
  };
}

/** @returns {boolean} true si quedó persistido (con o sin captura). */
export function saveOrderDraft(draft) {
  memoryDraft = draft;
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (_) {
    try {
      const { screenshot, ...lite } = draft;
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ ...lite, screenshotOmitted: true }));
      return true;
    } catch (err) {
      console.warn('[OrderDraft] Sin cupo en localStorage:', err);
      return false;
    }
  }
}

export function loadOrderDraft() {
  let draft = null;
  try { draft = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)); } catch (_) { /* borrador corrupto */ }
  if (memoryDraft && (!draft || memoryDraft.id === draft.id)) draft = memoryDraft;
  if (!draft || !draft.id || !draft.garment || !draft.pricing) return null;
  if (Date.now() - Date.parse(draft.createdAt) > DRAFT_TTL_MS) {
    clearOrderDraft();
    return null;
  }
  return draft;
}

export function clearOrderDraft() {
  memoryDraft = null;
  try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch (_) { /* sin acceso a storage */ }
}
