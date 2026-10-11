/**
 * Almacén de la Bóveda de Diseños, 100 % frontend (NODE-026): `localStorage['shirt_user_vault_db']`.
 *  - `free`: hasta 5 por usuario (FREE_SLOTS); borrar libera el cupo.
 *  - `purchased`: prenda archivada al confirmar el pedido; no consume cupos y no se puede borrar.
 *  - `isPublic`: privado por defecto; los públicos alimentan la galería comunitaria (solo en este navegador).
 */
import { imageToVault } from './vaultImage.js';
import { deleteMaster } from './vaultMasterStore.js';

export const VAULT_KEY = 'shirt_user_vault_db';
export const FREE_SLOTS = 5;
const inFlight = new Set(); // evita archivar dos veces el mismo pedido en paralelo

const notify = () => { try { window.dispatchEvent(new CustomEvent('vault:changed')); } catch (_) {} };

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(VAULT_KEY, JSON.stringify(items));
    notify(); // el Lookbook comunitario se actualiza solo al publicar / despublicar / eliminar
    return true;
  } catch (_) {
    return false; // cuota del navegador agotada
  }
}

export const newVaultId = () =>
  `VLT-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

const newest = (a, b) => String(b.createdAt).localeCompare(String(a.createdAt));

export function getVaultItems(userId) {
  return read().filter((i) => i.userId === userId).sort(newest);
}

export function getVaultUsage(userId) {
  const items = getVaultItems(userId);
  const free = items.filter((i) => i.type === 'free').length;
  return { free, max: FREE_SLOTS, left: FREE_SLOTS - free, purchased: items.length - free };
}

/** @returns {{ok:boolean, item?:object, error?:'invalid'|'no_slots'|'storage_full'}} */
export function saveVaultItem(item) {
  if (!item?.userId || !item.image) return { ok: false, error: 'invalid' };
  const type = item.type === 'purchased' ? 'purchased' : 'free';
  if (type === 'free' && getVaultUsage(item.userId).left <= 0) return { ok: false, error: 'no_slots' };

  const saved = {
    id: newVaultId(),
    name: String(item.name || 'Diseño sin título').slice(0, 60),
    thumb: item.thumb || item.image,
    isPublic: false,
    createdAt: new Date().toISOString(),
    ...item,
    type
  };
  return write([saved, ...read()]) ? { ok: true, item: saved } : { ok: false, error: 'storage_full' };
}

export function updateVaultItem(id, patch) {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return { ok: false };
  items[idx] = { ...items[idx], ...patch, id, userId: items[idx].userId, type: items[idx].type };
  return write(items) ? { ok: true, item: items[idx] } : { ok: false, error: 'storage_full' };
}

/** Al publicar se fija el crédito del autor (`authorAlias`, sin @): lo muestra el Lookbook comunitario. */
export function toggleItemPrivacy(id, authorAlias = '') {
  const current = read().find((i) => i.id === id);
  if (!current) return { ok: false };
  const isPublic = !current.isPublic;
  return updateVaultItem(id, isPublic && authorAlias ? { isPublic, authorAlias } : { isPublic });
}

/** Cuando el usuario cambia su alias, sus diseños (públicos o no) pasan a firmarse con el nuevo. */
export function renameVaultAuthor(userId, authorAlias) {
  const items = read();
  if (!items.some((i) => i.userId === userId && i.authorAlias !== authorAlias)) return false;
  return write(items.map((i) => (i.userId === userId ? { ...i, authorAlias } : i)));
}

/** Solo los diseños gratuitos se pueden eliminar; el archivo de compras es permanente. */
export function deleteVaultItem(id) {
  const items = read();
  const target = items.find((i) => i.id === id);
  if (!target) return { ok: false, error: 'not_found' };
  if (target.type !== 'free') return { ok: false, error: 'purchased_protected' };
  if (!write(items.filter((i) => i.id !== id))) return { ok: false, error: 'storage_full' };
  deleteMaster(id); // el cupo se libera también en IndexedDB (no se espera: es limpieza)
  return { ok: true };
}

/** Diseños que sus dueños marcaron como públicos (galería comunitaria). */
export function getPublicVaultItems() {
  return read().filter((i) => i.isPublic).sort(newest);
}

/** Archiva la imagen de la prenda de un pedido. Idempotente; NO consume cupos gratuitos. */
export async function archivePurchasedDesign(order) {
  const userId = order?.userId;
  if (!userId || !order.screenshot || inFlight.has(order.id)) return { ok: false, skipped: true };
  const existing = read().find((i) => i.type === 'purchased' && i.orderId === order.id && i.userId === userId);
  if (existing) return { ok: true, item: existing, existed: true };

  inFlight.add(order.id);
  try {
    const { image, thumb } = await imageToVault(order.screenshot, { alpha: false });
    return saveVaultItem({
      userId, type: 'purchased', orderId: order.id, name: `Prenda Impresa #${order.id}`,
      ownerName: String(order.customer?.name || '').split(' ')[0], image, thumb
    });
  } catch (_) {
    return { ok: false, error: 'invalid' };
  } finally {
    inFlight.delete(order.id);
  }
}
