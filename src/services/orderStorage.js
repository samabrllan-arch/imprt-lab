/**
 * Persistencia local de pedidos (Atelier Archive) — NODE-011 / NODE-024.
 *
 * Esquema de un pedido:
 *  { id, createdAt, status, paymentMethod, paymentProof, customer{name,email,city}, userId,
 *    garment{...}, decals[], pricing{total,formatted}, driveUrl, screenshot }
 * `status`: 'pending_payment' | 'proof_submitted' | 'paid' (ver `config/paymentConfig.js`).
 */
import { ORDER_STATUS } from '../config/paymentConfig.js';

const STORAGE_KEY = 'shirt_studio_saved_orders';
const MAX_ORDERS = 30;

function withoutScreenshot(order) {
  const { screenshot, ...rest } = order;
  return rest;
}

/**
 * Escribe la lista con degradación progresiva si localStorage no tiene cupo:
 * 1) completa, 2) sin capturas de los pedidos antiguos (conserva los 3 más recientes),
 * 3) solo el más reciente con captura, 4) sin ninguna captura.
 */
function writeOrders(orders) {
  const attempts = [
    (list) => list,
    (list) => list.map((o, i) => (i < 3 ? o : withoutScreenshot(o))),
    (list) => list.map((o, i) => (i < 1 ? o : withoutScreenshot(o))),
    (list) => list.map(withoutScreenshot)
  ];
  for (const shrink of attempts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shrink(orders)));
      return true;
    } catch (_) { /* siguiente intento */ }
  }
  console.error('[OrderStorage] Sin cupo en localStorage para guardar los pedidos.');
  return false;
}

export function getLocalOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('[OrderStorage] Error al leer pedidos locales:', err);
    return [];
  }
}

export function getLocalOrderById(id) {
  return getLocalOrders().find((o) => o.id === id) || null;
}

/** Pedidos de la cuenta + pedidos antiguos sin dueño (creados antes del Auth Gate). */
export function getOrdersForUser(user) {
  if (!user) return [];
  const email = String(user.email || '').toLowerCase();
  return getLocalOrders().filter((o) => {
    const owner = String(o.customer?.email || '').toLowerCase();
    return owner ? owner === email : !o.userId;
  });
}

/** Compatibilidad con el contrato anterior (guardado directo sin borrador). */
export function saveLocalOrder(orderData) {
  const order = {
    id: orderData.id || `ORD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: ORDER_STATUS.PENDING_PAYMENT,
    paymentMethod: null,
    paymentProof: null,
    ...orderData
  };
  writeOrders([order, ...getLocalOrders().filter((o) => o.id !== order.id)].slice(0, MAX_ORDERS));
  return order;
}

/**
 * Crea el pedido `pending_payment` a partir del borrador y del usuario autenticado.
 * Idempotente: si ya existe un pedido con ese id lo devuelve sin tocarlo (`existed: true`).
 * @returns {{ ok: boolean, order: object, existed?: boolean }}
 */
export function createOrderFromDraft(draft, user) {
  const existing = getLocalOrderById(draft.id);
  if (existing) return { ok: true, order: existing, existed: true };

  const order = {
    id: draft.id,
    createdAt: new Date().toISOString(),
    status: ORDER_STATUS.PENDING_PAYMENT,
    paymentMethod: null,
    paymentProof: null,
    customer: {
      name: draft.customer?.name || user?.name || '',
      email: user?.email || '',
      city: draft.customer?.city || user?.city || '',
      // Datos de despacho guardados en Mi Perfil (NODE-025); vacíos si el cliente no los completó
      phone: user?.phone || '',
      address: user?.address || '',
      deliveryNotes: user?.deliveryNotes || ''
    },
    userId: user?.id || null,
    garment: draft.garment,
    decals: draft.decals || [],
    pricing: draft.pricing,
    driveUrl: null,
    screenshot: draft.screenshot || null
  };
  const ok = writeOrders([order, ...getLocalOrders()].slice(0, MAX_ORDERS));
  return { ok, order };
}

/** Actualiza campos de un pedido (estado, método, comprobante, driveUrl…). */
export function updateLocalOrder(id, patch) {
  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return { ok: false, order: null };
  orders[idx] = { ...orders[idx], ...patch, updatedAt: new Date().toISOString() };
  return { ok: writeOrders(orders), order: orders[idx] };
}

export function deleteLocalOrder(id) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getLocalOrders().filter((o) => o.id !== id)));
    return true;
  } catch (err) {
    console.error('[OrderStorage] Error al eliminar pedido:', err);
    return false;
  }
}
