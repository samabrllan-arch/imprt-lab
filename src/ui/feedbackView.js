/**
 * Plantillas del Buzón de Sugerencias (NODE-014). Sin estado: reciben datos y devuelven HTML.
 * Todo texto del usuario pasa por `escapeHtml`.
 */
import { FEEDBACK_TYPES, RATING_LABELS } from '../services/feedbackInbox.js';
import { attachDropHtml } from './feedbackAttach.js';
import { escapeHtml } from './htmlEscape.js';

const header = `
  <div class="section-header-box">
    <span class="section-eyebrow">ATENCIÓN & MEJORA CONTINUA</span>
    <h2 class="section-title">Buzón de Sugerencias & Retroalimentación</h2>
    <p class="section-description">
      Tu voz impulsa cada corte y estampado. Comparte tus sugerencias, dudas o quejas para seguir perfeccionando nuestras prendas y servicio.
    </p>
  </div>`;

const stars = (rating) => [1, 2, 3, 4, 5].map((n) => `
  <button type="button" class="rating-star-btn ${n <= rating ? 'active' : ''}" data-star="${n}" aria-label="${n} de 5">★</button>`).join('');

/** Formulario completo; `account` (opcional) solo pinta la barra de sesión, los datos se rellenan en el controlador. */
export function renderFormHtml({ type, rating }) {
  return `
    <section class="feedback-section" id="sugerencias" aria-label="Buzón de Quejas y Sugerencias">
      <div class="landing-container">
        ${header}
        <div class="feedback-card-wrapper">
          <div class="fb-account" id="fb-account"></div>
          <div class="feedback-types-nav">
            ${FEEDBACK_TYPES.map((t) => `
              <button type="button" class="feedback-type-btn ${type === t.id ? 'active' : ''}" data-type="${t.id}">
                <span>${t.icon}</span><span>${t.label}</span>
              </button>`).join('')}
          </div>
          <form class="feedback-form-grid" id="feedback-form" novalidate>
            <div class="form-row-dual">
              <div class="form-field-group">
                <label class="form-field-label" for="fb-name">Nombre o Apodo *</label>
                <input type="text" class="form-field-input" id="fb-name" placeholder="Tu nombre" autocomplete="name" maxlength="80">
              </div>
              <div class="form-field-group">
                <label class="form-field-label" for="fb-contact">Email o Celular *</label>
                <input type="text" class="form-field-input" id="fb-contact" placeholder="Ej: usuario@correo.com o +57 300 123 4567" autocomplete="email" maxlength="80">
              </div>
            </div>
            <div class="form-row-dual">
              <div class="form-field-group" id="fb-order-group">
                <label class="form-field-label" for="fb-order">Pedido <span class="fb-optional">(Opcional)</span></label>
                <input type="text" class="form-field-input" id="fb-order" placeholder="Ej: ORD-1A2B o 'Sin pedido aún'" maxlength="30">
              </div>
              <div class="form-field-group">
                <label class="form-field-label">Calificación</label>
                <div class="star-rating-box" id="star-box">
                  ${stars(rating)}
                  <span class="rating-label-hint" id="rating-hint">${RATING_LABELS[rating]}</span>
                </div>
              </div>
            </div>
            <div class="form-field-group">
              <label class="form-field-label" for="fb-message">Mensaje o Detalle *</label>
              <textarea class="form-field-textarea" id="fb-message" rows="4" maxlength="1200" placeholder="Escribe aquí tu sugerencia, queja o mensaje con el mayor detalle posible..."></textarea>
            </div>
            ${attachDropHtml()}
            <p class="fb-error" id="fb-error" role="alert" hidden></p>
            <div class="feedback-actions-row">
              <button type="submit" class="btn-submit-feedback"><span>📨 Enviar Mensaje al Soporte</span></button>
            </div>
            <p class="fb-note">Tu reporte o sugerencia se envía directamente a nuestro sistema para ser gestionado por el equipo de soporte.</p>
          </form>
        </div>
      </div>
    </section>`;
}

/** Estado de éxito con micro-animación y confirmación directa de ticket registrado. */
export function renderSuccessHtml({ entry, saved }) {
  const note = saved
    ? 'Tu mensaje ha sido registrado exitosamente en nuestro sistema de atención. Nuestro equipo de soporte lo revisará en el panel administrativo.'
    : 'Tu reporte ha sido procesado y registrado para revisión por el equipo técnico.';
  const shot = entry.attachmentName
    ? `<p class="fb-success-shot">🖼️ Archivo adjunto: <strong>${escapeHtml(entry.attachmentName)}</strong> vinculado al reporte.</p>`
    : '';
  return `
    <section class="feedback-section" id="sugerencias">
      <div class="landing-container">
        <div class="feedback-card-wrapper">
          <div class="feedback-success-state">
            <div class="feedback-success-icon fb-pop"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path class="fb-check" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3 class="feedback-success-title">¡Mensaje Enviado con Éxito!</h3>
            <p class="feedback-success-desc">${escapeHtml(note)}</p>
            ${shot}
            <button type="button" class="fb-link-btn" id="btn-reset-feedback">Enviar otro comentario</button>
          </div>
        </div>
      </div>
    </section>`;
}
