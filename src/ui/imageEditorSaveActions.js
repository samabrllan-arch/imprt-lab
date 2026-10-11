/**
 * Acciones de guardado del Editor de Imagen (NODE-010): 💾 Reemplazar · ➕ Guardar como Copia · 📥 Descargar.
 * Las tres parten del mismo arte "aplanado" (ajuste en vista previa + texto en borrador ya incorporados).
 */
import '../styles/imageEditorSave.css';
import { clampToPrintDpi, buildMaster } from '../services/dpiClamp.js';
import { loadImage } from '../services/vaultImage.js';
import { downloadImage } from '../services/exporter.js';
import { store } from '../state/store.js';
import { showToast } from './toast.js';
import { saveVaultCopy, vaultSlotsLeft, VAULT_SAVE_ERRORS } from './vaultEditorSave.js';

const slug = (name) => String(name || 'diseno').replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'diseno';

/**
 * @param {object} ed  contexto del editor (q, canvas, textLayer)
 * @param {{adjust: object, getName: () => string, getContext: () => {onReplace?: Function}}} deps
 */
export function initEditorSaveActions(ed, { adjust, getName, getContext }) {
  const btnReplace = ed.q('#btn-replace-editor');
  const btnCopy = ed.q('#btn-copy-editor');
  const btnDownload = ed.q('#btn-download-editor');
  const grid = ed.q('.editor-save-grid');
  const busy = new Set();

  /** Incorpora lo pendiente y devuelve el lienzo final (reducido al tope de 300 DPI si hace falta). */
  function flatten() {
    adjust.commitPending();
    ed.textLayer.commit();
    const fit = clampToPrintDpi(ed.canvas, store.getState().activeZone);
    return fit.clamped ? fit.source : ed.canvas;
  }

  async function guard(btn, job) {
    if (busy.has(btn)) return;
    busy.add(btn); btn.classList.add('is-busy'); btn.setAttribute('aria-busy', 'true');
    try { await job(); }
    catch (err) { console.error('[EditorSave]', err); showToast('No se pudo completar la acción. Inténtalo de nuevo.', 'error'); }
    finally { busy.delete(btn); btn.classList.remove('is-busy'); btn.removeAttribute('aria-busy'); }
  }

  btnReplace?.addEventListener('click', () => guard(btnReplace, async () => {
    const ctx = getContext();
    if (!ctx.onReplace) return;
    const url = flatten().toDataURL('image/png');
    const res = await ctx.onReplace(url, await loadImage(url), getName());
    showToast(res?.ok === false ? (VAULT_SAVE_ERRORS[res.error] || VAULT_SAVE_ERRORS.invalid) : (res?.message || 'Imagen reemplazada.'),
      res?.ok === false ? 'error' : 'success', 4200);
  }));

  btnCopy?.addEventListener('click', () => guard(btnCopy, async () => {
    const res = await saveVaultCopy(flatten().toDataURL('image/png'), getName());
    if (!res.ok) return showToast(VAULT_SAVE_ERRORS[res.error] || VAULT_SAVE_ERRORS.invalid, 'error', 4500);
    refresh();
    const left = vaultSlotsLeft();
    showToast(`Copia guardada en tu Bóveda${left === null ? '' : ` (${left} ${left === 1 ? 'cupo libre' : 'cupos libres'})`}.`, 'success', 4200);
  }));

  btnDownload?.addEventListener('click', () => guard(btnDownload, async () => {
    const master = await buildMaster(flatten(), store.getState().activeZone); // PNG con alfa y pHYs de 300 DPI
    const url = URL.createObjectURL(master.blob);
    downloadImage(url, `${slug(getName())}_300DPI.png`);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    showToast(`PNG transparente a 300 DPI descargado (${master.width}×${master.height} px).`, 'success', 4200);
  }));

  /** Muestra u oculta Reemplazar según el origen y deshabilita Copia si la Bóveda está llena. */
  function refresh() {
    const canReplace = !!getContext().onReplace;
    if (btnReplace) btnReplace.hidden = !canReplace;
    if (grid) grid.dataset.solo = String(!canReplace);
    const left = vaultSlotsLeft();
    if (!btnCopy) return;
    const full = left !== null && left <= 0;
    btnCopy.disabled = full;
    btnCopy.title = full ? 'Bóveda llena (5/5): elimina un diseño gratuito para liberar un cupo'
      : left === null ? 'Inicia sesión para guardar una copia en tu Bóveda'
      : `Guarda una copia nueva en tu Bóveda sin tocar el original (${left} ${left === 1 ? 'cupo libre' : 'cupos libres'})`;
  }

  return { refresh };
}
