/**
 * Modal "Mi Perfil & Datos de Envío" (NODE-025): contacto y despacho del cliente.
 * Persistencia 100% frontend vía `authService.updateUserProfile` (notifica a la navbar).
 */
import '../styles/userProfileModal.css';
import { authService } from '../services/authService.js';
import { ALIAS_MAX, normalizeAlias, takenAliases, validateAlias } from '../services/userAlias.js';
import { LEGAL_CONSENT_LABEL, LEGAL_TERMS_VERSION } from '../config/legalTerms.js';
import { openLegalTermsModal, isLegalTermsOpen } from './legalTermsModal.js';
import { showToast } from './toast.js';
import { escapeHtml } from './htmlEscape.js';
import { ICONS } from './uiIcons.js';

const OVERLAY_ID = 'user-profile-overlay';

function field({ id, label, value = '', type = 'text', placeholder = '', autocomplete = 'off', full = false, extra = '', hint = '' }) {
  return `
    <div class="pf-field${full ? ' pf-full' : ''}">
      <label for="pf-${id}">${label}</label>
      <input id="pf-${id}" name="${id}" type="${type}" class="pf-input" value="${escapeHtml(value)}"
        placeholder="${escapeHtml(placeholder)}" autocomplete="${autocomplete}" aria-describedby="pf-${id}-msg" ${extra} />
      <p class="pf-msg${hint ? ' is-hint' : ''}" id="pf-${id}-msg" data-hint="${escapeHtml(hint)}">${hint}</p>
    </div>`;
}

function renderHtml(user) {
  const accepted = user.termsVersion === LEGAL_TERMS_VERSION;
  return `
    <form class="modal-card profile-modal-card" id="pf-form" role="dialog" aria-modal="true" aria-labelledby="pf-title" novalidate>
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">MI CUENTA</span>
          <h3 class="modal-title" id="pf-title">Mi Perfil &amp; Datos de Envío</h3>
        </div>
        <button type="button" class="btn-close-modal" data-pf="cancel" aria-label="Cerrar">${ICONS.cross(16)}</button>
      </div>

      <div class="modal-body pf-body">
        <p class="pf-intro">Usaremos estos datos para liquidar tus pedidos y coordinar el despacho por WhatsApp.</p>
        <div class="pf-grid">
          ${field({ id: 'name', label: 'Nombre Completo', value: user.name, placeholder: 'Ej. Carlos Mendoza', autocomplete: 'name', full: true, extra: 'required maxlength="80"' })}
          ${field({ id: 'alias', label: 'Alias de Autor <span class="pf-opt">(público)</span>', value: user.alias, placeholder: 'tu_alias', autocomplete: 'nickname', full: true, extra: `maxlength="${ALIAS_MAX}" autocapitalize="none" spellcheck="false"`, hint: 'Se muestra como @alias en tus diseños públicos del Lookbook. 3–20 caracteres: letras, números, _ o .' })}
          ${field({ id: 'email', label: 'Correo Electrónico', value: user.email, type: 'email', full: true, extra: 'readonly aria-readonly="true"', hint: 'Es tu llave de acceso y la de tus pedidos, por eso no se edita aquí.' })}
          ${field({ id: 'phone', label: 'Celular / WhatsApp de Entrega', value: user.phone, type: 'tel', placeholder: '+57 300 123 4567', autocomplete: 'tel', extra: 'inputmode="tel" maxlength="20"' })}
          ${field({ id: 'city', label: 'Ciudad / Municipio', value: user.city, placeholder: 'Bogotá, Medellín, Cali…', autocomplete: 'address-level2', extra: 'maxlength="60"' })}
          ${field({ id: 'address', label: 'Dirección de Despacho', value: user.address, placeholder: 'Calle 100 # 15-20, Apto 402', autocomplete: 'street-address', full: true, extra: 'maxlength="140"' })}
          <div class="pf-field pf-full">
            <label for="pf-deliveryNotes">Notas de Entrega <span class="pf-opt">(opcional)</span></label>
            <textarea id="pf-deliveryNotes" name="deliveryNotes" class="pf-input pf-textarea" rows="2" maxlength="200"
              placeholder="Ej. Dejar en portería">${escapeHtml(user.deliveryNotes)}</textarea>
          </div>
        </div>

        <div class="pf-consent">
          <label class="pf-check" for="pf-terms">
            <input type="checkbox" id="pf-terms" ${accepted ? 'checked' : ''} aria-describedby="pf-terms-msg" />
            <span class="pf-check-box" aria-hidden="true">${ICONS.check(14)}</span>
            <span class="pf-check-text">${escapeHtml(LEGAL_CONSENT_LABEL)}</span>
          </label>
          <button type="button" class="pf-link" data-pf="terms">${ICONS.scale(14)}<span>Leer Términos &amp; Propiedad Intelectual</span></button>
          <p class="pf-msg" id="pf-terms-msg" role="alert"></p>
        </div>
      </div>

      <div class="modal-footer pf-footer">
        <button type="button" class="btn-secondary pf-cancel" data-pf="cancel">Cancelar</button>
        <button type="submit" class="pf-save">${ICONS.save(16)}<span>Guardar Cambios</span></button>
      </div>
    </form>`;
}

export function openUserProfileModal() {
  const user = authService.getCurrentUser();
  if (!user) return null;
  document.getElementById(OVERLAY_ID)?.remove();

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'modal-overlay profile-overlay';
  overlay.innerHTML = renderHtml(user);
  document.body.appendChild(overlay);
  const form = overlay.querySelector('#pf-form');

  const onKey = (e) => {
    // Con el visor de TyC encima, Esc cierra solo ese visor
    if (e.key === 'Escape' && !isLegalTermsOpen()) close();
  };
  function close() {
    document.removeEventListener('keydown', onKey);
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 220);
  }

  function showErrors(errors) {
    form.querySelectorAll('.pf-input').forEach((el) => {
      const msg = errors[el.name];
      el.classList.toggle('is-invalid', !!msg);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const box = form.querySelector(`#pf-${el.name}-msg`);
      if (box) { box.textContent = msg || box.dataset.hint || ''; box.classList.toggle('is-hint', !msg && !!box.dataset.hint); }
    });
    form.querySelector('#pf-terms-msg').textContent = errors.terms || '';
    form.querySelector('.pf-consent').classList.toggle('is-invalid', !!errors.terms);
    const first = Object.keys(errors)[0];
    if (first) form.querySelector(first === 'terms' ? '#pf-terms' : `#pf-${first}`)?.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const termsAccepted = form.querySelector('#pf-terms').checked;
    if (!termsAccepted) return showErrors({ terms: 'Debes aceptar los Términos para guardar tus datos.' });
    try {
      authService.updateUserProfile({ ...data, termsAccepted });
    } catch (err) {
      return showErrors(err.fields || { name: err.message });
    }
    showToast('¡Datos personales actualizados con éxito!', 'success');
    close();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return close();
    const action = e.target.closest('[data-pf]')?.dataset.pf;
    if (action === 'cancel') close();
    if (action === 'terms') {
      openLegalTermsModal({
        onAccept: () => { form.querySelector('#pf-terms').checked = true; showErrors({}); }
      });
    }
  });
  // Al corregir un campo se limpia solo su error
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.matches('.pf-input.is-invalid')) return;
    el.classList.remove('is-invalid');
    el.setAttribute('aria-invalid', 'false');
    const box = form.querySelector(`#pf-${el.name}-msg`);
    if (box) { box.textContent = box.dataset.hint || ''; box.classList.toggle('is-hint', !!box.dataset.hint); }
  });
  // Al salir del campo se normaliza el alias (sin @, minúsculas, sin tildes) y se avisa si ya está en uso
  form.querySelector('#pf-alias').addEventListener('blur', (e) => {
    const input = e.target;
    input.value = normalizeAlias(input.value);
    if (!input.value) return;
    const msg = validateAlias(input.value, takenAliases(authService.getUsers(), user.id));
    const box = form.querySelector('#pf-alias-msg');
    input.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    box.textContent = msg || box.dataset.hint;
    box.classList.toggle('is-hint', !msg);
  });
  form.querySelector('#pf-terms').addEventListener('change', () => {
    form.querySelector('#pf-terms-msg').textContent = '';
    form.querySelector('.pf-consent').classList.remove('is-invalid');
  });

  document.addEventListener('keydown', onKey);
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    form.querySelector('#pf-name')?.focus({ preventScroll: true });
  });
  return { close };
}
