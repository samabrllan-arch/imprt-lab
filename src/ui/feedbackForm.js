/**
 * Buzón de Quejas, Sugerencias y Retroalimentación (NODE-014).
 *
 * - Se pinta UNA vez; los cambios de sesión solo actualizan la barra de cuenta, los campos autollenados
 *   que el usuario aún no tocó y el selector de pedidos (así nunca se pierde lo que está escribiendo).
 * - Con sesión: nombre, correo y @alias vienen de la cuenta; los pedidos propios salen en un desplegable.
 * - Sin backend: "Enviar al Equipo" guarda en `shirt_feedback_inbox`; WhatsApp es el canal que llega al equipo.
 */
import '../styles/feedbackExtras.css';
import { authService } from '../services/authService.js';
import { getOrdersForUser } from '../services/orderStorage.js';
import { ORDER_STATUS_META } from '../config/paymentConfig.js';
import { formatAlias } from '../services/userAlias.js';
import { RATING_LABELS, saveFeedback } from '../services/feedbackInbox.js';
import { renderFormHtml, renderSuccessHtml } from './feedbackView.js';
import { bindAttach } from './feedbackAttach.js';
import { authModal } from './authModal.js';
import { escapeHtml } from './htmlEscape.js';

const ORDER_TEXT_FIELD = `<label class="form-field-label" for="fb-order">Pedido <span class="fb-optional">(Opcional)</span></label>
  <input type="text" class="form-field-input" id="fb-order" placeholder="Ej: ORD-1A2B o 'Sin pedido aún'" maxlength="30">`;

export function initFeedbackForm(container) {
  if (!container) return;

  const state = { type: 'sugerencia', rating: 5, entry: null, saved: false };
  let attach = null;
  const q = (sel) => container.querySelector(sel);

  /* ---------- Cuenta: barra, autollenado y pedidos ---------- */

  function fillAuto(input, value) {
    if (!input) return;
    const untouched = input.dataset.touched !== '1';
    if (value && untouched && !input.value) { input.value = value; input.dataset.auto = '1'; }
    // Al cerrar sesión se retira solo lo que se había autollenado
    if (!value && input.dataset.auto === '1' && untouched) { input.value = ''; input.dataset.auto = ''; }
  }

  function renderAccountBar(user) {
    const bar = q('#fb-account');
    if (!bar) return;
    bar.innerHTML = user
      ? `<span class="fb-chip">👤 Sesión iniciada${user.alias ? ` · <strong>${escapeHtml(formatAlias(user.alias))}</strong>` : ''}</span><span class="fb-account-hint">Tus datos se completaron solos</span>`
      : `<span class="fb-account-hint">¿Ya tienes cuenta? Inicia sesión y completamos tus datos y pedidos.</span><button type="button" class="fb-link-btn" data-action="login">Iniciar sesión</button>`;
  }

  function renderOrderField(user) {
    const group = q('#fb-order-group');
    if (!group) return;
    const orders = user ? getOrdersForUser(user) : [];
    const previous = q('#fb-order')?.value || '';
    if (!orders.length) {
      if (group.querySelector('select')) group.innerHTML = ORDER_TEXT_FIELD;
      return;
    }
    const options = orders.map((o) => {
      const status = ORDER_STATUS_META[o.status]?.label || '';
      return `<option value="${escapeHtml(o.id)}">#${escapeHtml(o.id)}${status ? ` · ${escapeHtml(status)}` : ''}</option>`;
    }).join('');
    group.innerHTML = `<label class="form-field-label" for="fb-order">¿Sobre qué pedido? <span class="fb-optional">(Opcional)</span></label>
      <select class="form-field-input fb-select" id="fb-order"><option value="">Sin pedido asociado</option>${options}</select>`;
    const sel = q('#fb-order');
    if (previous && [...sel.options].some((o) => o.value === previous)) sel.value = previous;
  }

  function syncAccount(user = authService.getCurrentUser()) {
    renderAccountBar(user);
    fillAuto(q('#fb-name'), user?.name || '');
    fillAuto(q('#fb-contact'), user?.email || '');
    renderOrderField(user);
  }

  /* ---------- Lectura / validación ---------- */

  function readEntry() {
    const user = authService.getCurrentUser();
    const file = attach?.get();
    return {
      type: state.type,
      rating: state.rating,
      name: q('#fb-name').value.trim(),
      contact: q('#fb-contact').value.trim(),
      alias: user?.alias || '',
      order: (q('#fb-order')?.value || '').trim().replace(/^#/, ''),
      message: q('#fb-message').value.trim(),
      attachment: file?.dataUrl || '',
      attachmentName: file?.name || ''
    };
  }

  function validate(entry) {
    const errors = {};
    if (entry.name.length < 2) errors['fb-name'] = 'Escribe tu nombre o apodo.';
    if (entry.contact.length < 5) errors['fb-contact'] = 'Déjanos un correo o teléfono para responderte.';
    if (entry.message.length < 10) errors['fb-message'] = 'Cuéntanos un poco más (mínimo 10 caracteres).';
    return errors;
  }

  function showErrors(errors) {
    container.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    const ids = Object.keys(errors);
    const box = q('#fb-error');
    box.hidden = !ids.length;
    box.textContent = ids.length ? errors[ids[0]] : '';
    ids.forEach((id) => q(`#${id}`)?.classList.add('is-invalid'));
    if (ids.length) q(`#${ids[0]}`)?.focus();
    return !ids.length;
  }

  /* ---------- Pintado ---------- */

  function render() {
    if (state.entry) {
      container.innerHTML = renderSuccessHtml({ entry: state.entry, saved: state.saved });
      return;
    }
    container.innerHTML = renderFormHtml({ type: state.type, rating: state.rating });
    attach = bindAttach(container);
    syncAccount();
  }

  function setStars(value, hover = false) {
    container.querySelectorAll('.rating-star-btn').forEach((b) => {
      const on = Number(b.dataset.star) <= value;
      if (hover) b.classList.toggle('hovered', on);
      else { b.classList.toggle('active', on); b.classList.remove('hovered'); }
    });
    const hint = q('#rating-hint');
    if (hint) hint.textContent = RATING_LABELS[value];
  }

  /* ---------- Eventos (delegación: el contenedor persiste entre renders) ---------- */

  container.addEventListener('click', (e) => {
    const typeBtn = e.target.closest('.feedback-type-btn');
    if (typeBtn) {
      state.type = typeBtn.dataset.type;
      container.querySelectorAll('.feedback-type-btn').forEach((b) => b.classList.toggle('active', b === typeBtn));
      return;
    }
    const star = e.target.closest('.rating-star-btn');
    if (star) { state.rating = Number(star.dataset.star); setStars(state.rating); return; }
    if (e.target.closest('[data-action="login"]')) { authModal.open('login'); return; }
    if (e.target.closest('#btn-reset-feedback')) { state.entry = null; state.rating = 5; render(); }
  });

  container.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.rating-star-btn');
    if (star) setStars(Number(star.dataset.star), true);
  });
  container.addEventListener('mouseout', (e) => {
    if (e.target.closest('.rating-star-btn')) setStars(state.rating);
  });

  container.addEventListener('input', (e) => {
    if (e.target.matches('#fb-name, #fb-contact')) { e.target.dataset.touched = '1'; e.target.dataset.auto = ''; }
    e.target.classList?.remove('is-invalid');
  });

  container.addEventListener('submit', (e) => {
    e.preventDefault();
    const entry = readEntry();
    if (!showErrors(validate(entry))) return;
    state.saved = !!saveFeedback(entry);
    state.entry = entry;
    render();
    q('.feedback-success-state')?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  });

  authService.subscribe((user) => { if (!state.entry) syncAccount(user); });
  window.addEventListener('storage', () => { if (!state.entry) syncAccount(); });

  render();
}
