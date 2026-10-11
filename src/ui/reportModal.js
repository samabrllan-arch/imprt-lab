/**
 * Modal "Reportar contenido" (#report-content-modal, NODE-027). Categorías por tarjeta-radio, descripción
 * obligatoria en "Otro motivo", ocultamiento preventivo y aviso opcional al WhatsApp de soporte.
 * Todo texto de usuario (título, alias) pasa por `escapeHtml`.
 */
import '../styles/reportModal.css';
import { REPORT_CATEGORIES, DETAILS_MAX, OTHER_MIN, addReport, validateReport, buildReportWhatsAppUrl } from '../services/reportService.js';
import { authService } from '../services/authService.js';
import { formatAlias } from '../services/userAlias.js';
import { escapeHtml } from './htmlEscape.js';
import { showToast } from './toast.js';

export const REPORT_MODAL_ID = 'report-content-modal';

const optionHtml = (c) => `
  <label class="rp-opt${c.zero ? ' is-zero' : ''}" data-cat="${c.id}">
    <input type="radio" name="rp-category" value="${c.id}" />
    <span class="rp-icon" aria-hidden="true">${c.icon}</span>
    <span class="rp-text"><b>${escapeHtml(c.label)}</b><small>${escapeHtml(c.hint)}</small></span>
  </label>`;

function template(item) {
  const alias = formatAlias(String(item.authorAlias || item.author || '').replace(/^@+/, '')) || '@comunidad';
  return `
    <div class="modal-card report-card" role="dialog" aria-modal="true" aria-labelledby="rp-title">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">MODERACIÓN DE CONTENIDO</span>
          <h3 class="modal-title" id="rp-title">🚩 Reportar este diseño</h3>
        </div>
        <button type="button" class="btn-close-modal" data-rp="close" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-body rp-body">
        <p class="rp-target">Diseño: <strong>${escapeHtml(item.title)}</strong> · por <b>${escapeHtml(alias)}</b></p>
        <div class="rp-options" role="radiogroup" aria-label="Motivo del reporte">${REPORT_CATEGORIES.map(optionHtml).join('')}</div>
        <label class="rp-details" for="rp-details">
          <span id="rp-details-label">Descripción (opcional)</span>
          <textarea id="rp-details" maxlength="${DETAILS_MAX}" rows="3" placeholder="Añade contexto que ayude a revisar el diseño…"></textarea>
          <small class="rp-count"><span id="rp-count">0</span>/${DETAILS_MAX}</small>
        </label>
        <p class="rp-error" id="rp-error" role="alert" hidden></p>
        <p class="rp-note">El diseño se oculta para ti de inmediato. Para que el equipo lo revise más rápido, puedes avisar también por WhatsApp.</p>
      </div>
      <div class="modal-footer rp-footer">
        <button type="button" class="btn-secondary" data-rp="close">Cancelar</button>
        <button type="button" class="rp-submit" data-rp="submit">Enviar reporte</button>
        <button type="button" class="rp-whatsapp" data-rp="whatsapp">💬 Reportar y avisar por WhatsApp</button>
      </div>
    </div>`;
}

/**
 * @param {{id:string, title:string, authorAlias?:string, author?:string}} item  diseño a reportar
 * @param {{onDone?: Function}} [opts]
 */
export function openReportModal(item, { onDone } = {}) {
  if (!item?.id) return null;
  document.getElementById(REPORT_MODAL_ID)?.remove();
  const opener = document.activeElement;
  const overlay = document.createElement('div');
  overlay.id = REPORT_MODAL_ID;
  overlay.className = 'modal-overlay report-overlay';
  overlay.innerHTML = template(item);
  document.body.appendChild(overlay);

  const $ = (sel) => overlay.querySelector(sel);
  const state = { category: '' };
  const details = $('#rp-details');
  const errorBox = $('#rp-error');

  function close() {
    document.removeEventListener('keydown', onKey, true);
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 200);
    if (opener?.isConnected) opener.focus?.();
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') { // el foco no se escapa a la página de fondo mientras el modal está abierto
      const items = [...overlay.querySelectorAll('input, textarea, button')].filter((el) => !el.disabled && el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function selectCategory(id) {
    state.category = id;
    overlay.querySelectorAll('.rp-opt').forEach((el) => el.classList.toggle('is-selected', el.dataset.cat === id));
    $('#rp-details-label').textContent = id === 'other' ? `Descripción (obligatoria, mín. ${OTHER_MIN} caracteres)` : 'Descripción (opcional)';
    showError('');
  }
  function showError(msg) {
    errorBox.hidden = !msg;
    errorBox.textContent = msg;
  }

  function submit(escalate) {
    const draft = { category: state.category, details: details.value };
    const error = validateReport(draft);
    if (error) { showError(error); (state.category ? details : $('.rp-opt input')).focus(); return; }
    const res = addReport({
      designId: item.id, title: item.title, authorAlias: item.authorAlias || item.author || '',
      reporterId: authService.getCurrentUser()?.id, ...draft
    });
    if (!res.ok) { showError(res.error); return; }
    if (escalate) window.open(buildReportWhatsAppUrl(res.report), '_blank', 'noopener,noreferrer');
    showToast('Reporte enviado. El diseño quedó oculto para ti mientras se revisa.', 'success', 4500);
    close();
    onDone?.(res.report);
  }

  overlay.addEventListener('change', (e) => { if (e.target.name === 'rp-category') selectCategory(e.target.value); });
  overlay.addEventListener('input', (e) => {
    if (e.target !== details) return;
    $('#rp-count').textContent = String(details.value.length);
    showError('');
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return close();
    const action = e.target.closest('[data-rp]')?.dataset.rp;
    if (action === 'close') close();
    else if (action === 'submit') submit(false);
    else if (action === 'whatsapp') submit(true);
  });
  document.addEventListener('keydown', onKey, true);

  requestAnimationFrame(() => {
    overlay.classList.add('active');
    $('.rp-opt input')?.focus();
  });
  return { close };
}
