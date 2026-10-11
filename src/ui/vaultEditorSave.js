/**
 * Puente Editor de imagen -> Bóveda (NODE-010 / NODE-026): reemplazar el arte de un ítem y guardar copias.
 * Reutiliza el pipeline de la Bóveda (copia ≤ 1024 px + miniatura + máster 300 DPI en IndexedDB).
 */
import { authService } from '../services/authService.js';
import { getVaultUsage, saveVaultItem, updateVaultItem, newVaultId } from '../services/vaultStorage.js';
import { imageToVault } from '../services/vaultImage.js';
import { deleteMaster } from '../services/vaultMasterStore.js';
import { storeMaster } from './vaultAssets.js';

export const VAULT_SAVE_ERRORS = {
  no_session: 'Inicia sesión para guardar copias en tu Bóveda.',
  no_slots: 'Bóveda llena: elimina un diseño gratuito para liberar un cupo.',
  storage_full: 'El navegador no tiene espacio. Elimina diseños o pedidos antiguos e inténtalo de nuevo.',
  invalid: 'No se pudo guardar el diseño.'
};

const MAX_NAME = 60;
const SUFFIX = ' (copia)';

/** "Logo (copia)" sin acumular sufijos y sin pasar de 60 caracteres. */
export function copyName(name) {
  const base = String(name || 'Diseño').replace(/\s*\(copia\)$/i, '').trim() || 'Diseño';
  return base.slice(0, MAX_NAME - SUFFIX.length) + SUFFIX;
}

/** Cupos libres del usuario con sesión; `null` si no hay sesión. */
export function vaultSlotsLeft() {
  const user = authService.getCurrentUser();
  return user ? getVaultUsage(user.id).left : null;
}

/** Sobrescribe imagen, miniatura y máster de un ítem existente (no consume cupos). */
export async function replaceVaultArt(itemId, dataUrl) {
  const art = await imageToVault(dataUrl, { master: true });
  const meta = await storeMaster(itemId, art.master);
  const res = updateVaultItem(itemId, { image: art.image, thumb: art.thumb, ...meta });
  return res.ok ? { ok: true, item: res.item } : { ok: false, error: res.error || 'invalid' };
}

/** Crea un ítem gratuito nuevo; el original no se toca. */
export async function saveVaultCopy(dataUrl, name) {
  const user = authService.getCurrentUser();
  if (!user) return { ok: false, error: 'no_session' };
  if (getVaultUsage(user.id).left <= 0) return { ok: false, error: 'no_slots' };

  const art = await imageToVault(dataUrl, { master: true });
  const id = newVaultId();
  const meta = await storeMaster(id, art.master); // primero el máster: si el cupo falla se revierte
  const res = saveVaultItem({
    id, userId: user.id, type: 'free', name: copyName(name), authorAlias: user.alias,
    ownerName: String(user.name || '').split(' ')[0], image: art.image, thumb: art.thumb, ...meta
  });
  if (!res.ok) deleteMaster(id);
  return res;
}
