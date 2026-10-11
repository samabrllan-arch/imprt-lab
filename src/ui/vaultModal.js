/**
 * "Mi Bóveda de Diseños" (NODE-026): 5 cupos gratuitos + archivo ilimitado de prendas impresas.
 * Acciones por `data-action`: privacy, stamp, edit, download, delete (con confirmación en la tarjeta).
 */
import '../styles/vaultModal.css';
import { authService } from '../services/authService.js';
import { getOrdersForUser } from '../services/orderStorage.js';
import { LEGAL_TERMS_VERSION } from '../config/legalTerms.js';
import { ZONES } from '../config/zones.js';
import {
  getVaultItems, getVaultUsage, saveVaultItem, toggleItemPrivacy, deleteVaultItem, archivePurchasedDesign, newVaultId
} from '../services/vaultStorage.js';
import { fileToVault } from '../services/vaultImage.js';
import { downloadItemHd, loadItemImage, storeMaster } from './vaultAssets.js';
import { deleteMaster } from '../services/vaultMasterStore.js';
import { setDecal } from '../state/actions.js';
import { store } from '../state/store.js';
import { initImageEditorModal } from './imageEditorModal.js';
import { openUserProfileModal } from './userProfileModal.js';
import { renderVaultHtml } from './vaultModalView.js';
import { replaceVaultArt } from './vaultEditorSave.js';
import { uploadVaultToGoogleDrive } from '../services/driveUploader.js';
import { showToast } from './toast.js';

const OVERLAY_ID = 'vault-modal-overlay';
const ERRORS = {
  no_slots: 'Bóveda llena: elimina un diseño gratuito para liberar un cupo.',
  storage_full: 'El navegador no tiene espacio. Elimina diseños o pedidos antiguos e inténtalo de nuevo.'
};

export function openVaultModal({ router = null } = {}) {
  if (!authService.getCurrentUser()) return null;
  document.getElementById(OVERLAY_ID)?.remove();

  const ui = { confirmId: null, busy: false };
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'modal-overlay vault-overlay';
  document.body.appendChild(overlay);

  const user = () => authService.getCurrentUser();
  const find = (id) => getVaultItems(user()?.id).find((i) => i.id === id);
  const onKey = (e) => { if (e.key === 'Escape') close(); };

  function close() {
    document.removeEventListener('keydown', onKey);
    unsubscribe();
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 220);
  }

  function render() {
    const u = user();
    if (!u) return close();
    const scroll = overlay.querySelector('.vt-body')?.scrollTop || 0;
    overlay.innerHTML = renderVaultHtml({ items: getVaultItems(u.id), usage: getVaultUsage(u.id), confirmId: ui.confirmId, busy: ui.busy, alias: u.alias });
    const body = overlay.querySelector('.vt-body');
    if (body) body.scrollTop = scroll;
  }
  const unsubscribe = authService.subscribe(render);

  const showStudio = () => { if (router && !router.isStudioOpen) router.openStudio?.(); };
  const say = (msg, type = 'error') => showToast(msg, type, 4500);

  async function upload(file) {
    if (!file || ui.busy) return;
    ui.busy = true; render();
    try {
      const art = await fileToVault(file);
      const id = newVaultId();
      const meta = await storeMaster(id, art.master); // primero el máster: si el cupo falla se revierte
      const res = saveVaultItem({
        id, userId: user().id, type: 'free', name: file.name.replace(/\.[^/.]+$/, ''), authorAlias: user().alias,
        ownerName: String(user().name || '').split(' ')[0], image: art.image, thumb: art.thumb, ...meta
      });
      if (!res.ok) {
        deleteMaster(id);
        say(ERRORS[res.error] || 'No se pudo guardar el diseño.');
      } else {
        uploadVaultToGoogleDrive({
          designId: id,
          designName: file.name.replace(/\.[^/.]+$/, ''),
          userAlias: user().alias,
          userEmail: user().email,
          userId: user().id,
          image: art.image,
          dimensions: `${meta.masterW || art.width || 0}x${meta.masterH || art.height || 0}`,
          isPublic: false
        }).catch((e) => console.warn('[VaultCloud] Sync diferido:', e));

        if (art.master?.clamped) say(`Guardado a 300 DPI reales: reducimos tu imagen de ${art.master.from.w}×${art.master.from.h} px a ${meta.masterW}×${meta.masterH} px.`, 'success');
        else say(meta.hasMaster ? 'Diseño guardado en tu bóveda a 300 DPI (privado).' : 'Diseño guardado (copia reducida: tu navegador no permite archivos grandes).', meta.hasMaster ? 'success' : 'info');
      }
    } catch (err) {
      say(err.message);
    }
    ui.busy = false; render();
  }

  async function stamp(item) {
    const img = await loadItemImage(item);
    const zone = store.getState().activeZone;
    setDecal(zone, { name: item.name, src: item.image, imageElement: img });
    say(`¡"${item.name}" aplicado en ${ZONES[zone]?.name || zone}!`, 'success');
    close(); showStudio();
  }

  async function edit(item) {
    const img = await loadItemImage(item);
    close();
    initImageEditorModal().open(img, item.name, async (dataUrl, processedImg, finalName) => {
      setDecal(store.getState().activeZone, { name: finalName || item.name, src: dataUrl, imageElement: processedImg });
      showStudio();
      try { await replaceVaultArt(item.id, dataUrl); } // la versión retocada también queda guardada en la bóveda
      catch (_) { /* el retoque ya se aplicó a la prenda */ }
      say('Arte retocado y actualizado en tu bóveda.', 'success');
    }, {
      // 💾 Reemplazar Imagen: sobrescribe este ítem de la bóveda sin cerrar el editor
      onReplace: async (dataUrl) => {
        const res = await replaceVaultArt(item.id, dataUrl);
        return res.ok ? { ok: true, message: 'Arte reemplazado en tu Bóveda (máster 300 DPI actualizado).' } : res;
      }
    });
  }

  function togglePrivacy(item) {
    const needsTerms = !item.isPublic && user().termsVersion !== LEGAL_TERMS_VERSION;
    if (needsTerms) { // publicar exige haber declarado la titularidad (perfil → consentimiento)
      say('Para publicar un diseño acepta los Términos y declara su titularidad en tu perfil.');
      close(); openUserProfileModal();
      return;
    }
    const res = toggleItemPrivacy(item.id, user().alias);
    if (!res.ok) return say(ERRORS.storage_full);
    say(res.item.isPublic ? 'Ahora es público: aparece en la galería comunitaria.' : 'Ahora es privado.', 'info');
    render();
  }

  const actions = {
    close,
    stamp: (item) => stamp(item),
    edit: (item) => edit(item),
    privacy: togglePrivacy,
    download: async (item) => {
      const r = await downloadItemHd(item);
      if (r.kind === 'master') say(`Descargando el máster a 300 DPI (${(r.bytes / 1048576).toFixed(1)} MB).`, 'success');
      else say('Tu navegador ya no tiene el archivo máster: se descargó la copia reducida.', 'info');
    },
    delete: (item) => { ui.confirmId = item.id; render(); },
    'delete-no': () => { ui.confirmId = null; render(); },
    'delete-yes': (item) => {
      ui.confirmId = null;
      const res = deleteVaultItem(item.id);
      say(res.ok ? 'Diseño eliminado. Cupo liberado.' : 'No se pudo eliminar este diseño.', res.ok ? 'success' : 'error');
      render();
    }
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return close();
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const item = el.dataset.id ? find(el.dataset.id) : null;
    if (el.dataset.id && !item) return;
    actions[el.dataset.action]?.(item);
  });
  overlay.addEventListener('change', (e) => {
    if (e.target.id === 'vt-file') { upload(e.target.files[0]); e.target.value = ''; }
  });
  overlay.addEventListener('dragover', (e) => e.preventDefault());
  overlay.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.target.closest('.vault-modal-card')) upload(e.dataTransfer.files[0]);
  });
  document.addEventListener('keydown', onKey);

  // Archiva las prendas de pedidos ya confirmados que aún no están en la bóveda (idempotente)
  const u0 = user();
  getOrdersForUser(u0).filter((o) => o.userId === u0.id || o.customer?.email === u0.email).forEach((o) => {
    archivePurchasedDesign({ ...o, userId: u0.id }).then((r) => { if (r.ok && !r.existed && overlay.isConnected) render(); });
  });

  render();
  requestAnimationFrame(() => overlay.classList.add('active'));
  return { close };
}
