/**
 * Visor de Términos de Servicio & Propiedad Intelectual (NODE-025).
 * Singleton pre-montado: el DOM legal se construye UNA vez (`prepareLegalTermsModal`, en reposo del hilo
 * principal) y abrir/cerrar solo alterna la clase `.open` → transición compuesta (opacity + transform).
 * Contenido: `config/legalTerms.js`.
 */
import '../styles/legalTermsModal.css';
import {
  LEGAL_SECTIONS, LEGAL_TERMS_TITLE, LEGAL_TERMS_VERSION, LEGAL_TERMS_UPDATED, LEGAL_INTRO, LEGAL_CALLOUT
} from '../config/legalTerms.js';
import { escapeHtml } from './htmlEscape.js';
import { ICONS } from './uiIcons.js';

export const LEGAL_OVERLAY_ID = 'legal-terms-modal-overlay';
const TONE_ICON = { warning: 'alert', danger: 'alert', info: 'shield' };

let overlay = null;
let acceptCallback = null;
let returnFocus = null;

function renderClause(section, index) {
  const tone = section.tone || 'info';
  return `
    <article class="legal-clause" data-tone="${tone}" id="legal-${escapeHtml(section.id)}">
      <header class="legal-clause-head">
        <span class="legal-clause-n">${String(index + 1).padStart(2, '0')}</span>
        <h4 class="legal-clause-title">${escapeHtml(section.title)}</h4>
        <span class="legal-clause-icon">${ICONS[TONE_ICON[tone]](16)}</span>
      </header>
      <p class="legal-clause-text">${escapeHtml(section.text)}</p>
    </article>`;
}

function renderHtml() {
  return `
    <div class="modal-card legal-modal-card" role="dialog" aria-modal="true" aria-labelledby="legal-terms-title">
      <div class="modal-header">
        <div class="legal-head">
          <span class="legal-head-icon">${ICONS.scale(22)}</span>
          <div class="modal-title-box">
            <span class="modal-badge">LEGAL · v${escapeHtml(LEGAL_TERMS_VERSION)}</span>
            <h3 class="modal-title" id="legal-terms-title">${escapeHtml(LEGAL_TERMS_TITLE)}</h3>
          </div>
        </div>
        <button type="button" class="btn-close-modal" data-legal="close" aria-label="Cerrar">${ICONS.cross(16)}</button>
      </div>

      <div class="modal-body legal-body">
        <p class="legal-intro">${escapeHtml(LEGAL_INTRO)}</p>
        <div class="legal-callout" role="note">
          <span class="legal-callout-icon">${ICONS.alert(18)}</span>
          <strong>${escapeHtml(LEGAL_CALLOUT)}</strong>
        </div>
        ${LEGAL_SECTIONS.map(renderClause).join('')}
      </div>

      <div class="modal-footer legal-footer">
        <span class="legal-updated">Actualizado el ${escapeHtml(LEGAL_TERMS_UPDATED)}</span>
        <button type="button" class="legal-accept" data-legal="accept">${ICONS.check(16)}<span>Entendido y Acepto</span></button>
      </div>
    </div>`;
}

function onKey(e) {
  if (e.key === 'Escape') closeLegalTermsModal();
}

/** Construye el overlay oculto una sola vez. Idempotente. */
export function prepareLegalTermsModal() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = LEGAL_OVERLAY_ID;
  overlay.className = 'legal-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = renderHtml();
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return closeLegalTermsModal();
    const action = e.target.closest('[data-legal]')?.dataset.legal;
    if (action === 'close') closeLegalTermsModal();
    if (action === 'accept') {
      const cb = acceptCallback;
      closeLegalTermsModal();
      cb?.();
    }
  });
  return overlay;
}

/** Pre-monta el visor cuando el navegador está libre, para que el primer clic ya sea instantáneo. */
export function warmLegalTermsModal() {
  const run = () => prepareLegalTermsModal();
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2500 });
  else setTimeout(run, 400);
}

/** @param {{ onAccept?: () => void }} [opts] `onAccept` se ejecuta solo con "Entendido y Acepto". */
export function openLegalTermsModal({ onAccept } = {}) {
  prepareLegalTermsModal();
  acceptCallback = onAccept || null;
  returnFocus = document.activeElement;
  overlay.querySelector('.legal-body').scrollTop = 0;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open'); // único cambio síncrono: el resto lo anima el compositor
  document.addEventListener('keydown', onKey);
  overlay.querySelector('.legal-accept').focus({ preventScroll: true });
}

export function closeLegalTermsModal() {
  if (!overlay || !overlay.classList.contains('open')) return;
  document.removeEventListener('keydown', onKey);
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  acceptCallback = null;
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}

export function isLegalTermsOpen() {
  return !!overlay?.classList.contains('open');
}
