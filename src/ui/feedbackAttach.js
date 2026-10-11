/**
 * Adjunto visual opcional del buzón (NODE-014): arrastrar o elegir una captura de pantalla.
 * Se comprime con la misma rutina del comprobante de pago (JPEG ≤ 1280 px) para no llenar localStorage.
 */
import { compressProofImage } from '../services/paymentProof.js';
import { showToast } from './toast.js';

export function attachDropHtml() {
  return `
    <div class="form-field-group">
      <label class="form-field-label">Captura de pantalla <span class="fb-optional">(Opcional)</span></label>
      <div class="fb-drop" id="fb-drop" tabindex="0" role="button" aria-label="Adjuntar captura de pantalla">
        <input type="file" id="fb-file" accept="image/*" hidden>
        <div class="fb-drop-empty" id="fb-drop-empty">
          <span class="fb-drop-icon">🖼️</span>
          <span><strong>Arrastra una captura</strong> o toca para elegirla</span>
        </div>
        <div class="fb-drop-preview" id="fb-drop-preview" hidden>
          <img id="fb-drop-img" alt="Vista previa de la captura adjunta">
          <span class="fb-drop-name" id="fb-drop-name"></span>
          <button type="button" class="fb-drop-remove" id="fb-drop-remove" aria-label="Quitar captura">✕</button>
        </div>
      </div>
    </div>`;
}

/** Enlaza la zona de adjunto. @returns {{ get: () => {dataUrl:string,name:string}|null, clear: () => void }} */
export function bindAttach(root) {
  const q = (s) => root.querySelector(s);
  const drop = q('#fb-drop');
  const input = q('#fb-file');
  const state = { dataUrl: '', name: '' };

  const show = () => {
    const has = !!state.dataUrl;
    q('#fb-drop-empty').hidden = has;
    q('#fb-drop-preview').hidden = !has;
    drop.classList.toggle('has-file', has);
    if (has) {
      q('#fb-drop-img').src = state.dataUrl;
      q('#fb-drop-name').textContent = state.name;
    }
  };

  const clear = () => { state.dataUrl = ''; state.name = ''; input.value = ''; show(); };

  async function take(file) {
    if (!file) return;
    try {
      state.dataUrl = await compressProofImage(file);
      state.name = file.name || 'captura.jpg';
      show();
    } catch (err) {
      showToast(err.message || 'No se pudo adjuntar la imagen.', 'error');
    }
  }

  drop.addEventListener('click', (e) => {
    if (e.target.closest('#fb-drop-remove')) { e.stopPropagation(); clear(); return; }
    input.click();
  });
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('click', (e) => e.stopPropagation());
  input.addEventListener('change', () => take(input.files[0]));
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (e) => take(e.dataTransfer?.files?.[0]));

  return { get: () => (state.dataUrl ? { ...state } : null), clear };
}
