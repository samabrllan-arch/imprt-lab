/**
 * Markup de "Mis Pedidos" (NODE-024): tarjetas de pedido, estado, datos de pago y subida de comprobante.
 * Todo texto del usuario (nombre, ciudad, nombres de archivo) pasa por `escapeHtml`.
 */
import { PAYMENT_METHODS, ORDER_STATUS, getPaymentMethod, getStatusMeta, isPayable } from '../config/paymentConfig.js';
import { getZoneName } from '../services/orderDraft.js';
import { renderOrderTimeline } from './orderTimelineView.js';

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
}

function renderBankCard(method) {
  const rows = method.fields.map((f) => `
    <div class="mp-field">
      <span class="mp-field-label">${escapeHtml(f.label)}</span>
      ${f.value
        ? `<span class="mp-field-value">${escapeHtml(f.value)}</span>
           ${f.copy ? `<button type="button" class="mp-copy" data-action="copy" data-copy="${escapeHtml(f.value)}" title="Copiar">Copiar</button>` : ''}`
        : '<span class="mp-field-empty">Pídelo por WhatsApp</span>'}
    </div>`).join('');
  return `<div class="mp-bank"><div class="mp-bank-title">${method.icon} ${escapeHtml(method.label)}</div>${rows}</div>`;
}

function renderPaymentPanel(order, ui) {
  const id = escapeHtml(order.id);
  const methodId = ui.methods[order.id] || order.paymentMethod || 'nequi';
  const method = getPaymentMethod(methodId);
  const pending = ui.pending[order.id];
  const savedProof = order.paymentProof?.image;
  const preview = pending || savedProof;
  const isValidating = order.status === ORDER_STATUS.PROOF_SUBMITTED;

  return `
    <div class="mp-pay">
      ${isValidating ? `
        <div class="mp-validation-banner">
          <div class="mp-validation-icon">⏳</div>
          <div class="mp-validation-text">
            <strong>Pago en proceso de validación</strong>
            <p>Tu pago fue recibido y entró en validación. En <strong>menos de 24 horas</strong> lo verificaremos y te notificaremos. Si deseas, puedes adjuntar tu comprobante abajo o enviarlo por WhatsApp.</p>
          </div>
        </div>
      ` : ''}

      <div class="mp-step"><span class="mp-step-n">1</span> Elige cómo transferir ${escapeHtml(order.pricing?.formatted || '')}</div>
      <div class="mp-methods" role="tablist">
        ${PAYMENT_METHODS.map((m) => `
          <button type="button" role="tab" aria-selected="${m.id === methodId}" class="mp-method ${m.id === methodId ? 'active' : ''}"
            data-action="select-method" data-id="${id}" data-method="${m.id}">${m.icon} ${escapeHtml(m.label)}</button>`).join('')}
      </div>
      ${method ? renderBankCard(method) : '<p class="mp-hint">Selecciona Nequi o Bancolombia para ver los datos de transferencia.</p>'}

      <div class="mp-step"><span class="mp-step-n">2</span> Comprobante de transferencia (Opcional)</div>
      <label class="mp-drop ${preview ? 'has-preview' : ''}" for="proof-${id}" data-drop-id="${id}">
        <input type="file" class="mp-file-input" id="proof-${id}" data-id="${id}" accept="image/*" hidden />
        ${preview
          ? `<img src="${preview}" alt="Comprobante" class="mp-proof-img" /><span class="mp-drop-cta">${pending ? 'Cambiar imagen' : 'Reemplazar comprobante'}</span>`
          : '<span class="mp-drop-icon" aria-hidden="true">🧾</span><span class="mp-drop-cta">Toca para subir el pantallazo (opcional)</span><span class="mp-drop-sub">JPG, PNG o WEBP · máx. 10 MB</span>'}
      </label>

      <div class="mp-pay-actions">
        <button type="button" class="mp-btn mp-btn-primary" data-action="mark-paid" data-id="${id}">
          ✓ Marcar como pagado
        </button>
        <button type="button" class="mp-btn mp-btn-wa" data-action="send-whatsapp" data-id="${id}">
          📲 Enviar por WhatsApp
        </button>
      </div>
      <p class="mp-hint">Al marcar como pagado, tu pedido entra en validación y se te notificará en menos de 24 horas.</p>
    </div>`;
}

function renderOrderCard(order, ui) {
  const id = escapeHtml(order.id);
  const meta = getStatusMeta(order.status);
  const g = order.garment || {};
  const payable = isPayable(order);
  const expanded = ui.expandedId === order.id;
  const decals = (order.decals || []).map((d) => `
    <li><span class="mp-zone">${escapeHtml(d.zoneName || getZoneName(d.zone))}</span> ${escapeHtml(d.name || 'Diseño')} → <strong>${escapeHtml(d.widthCm)} × ${escapeHtml(d.heightCm)} cm</strong></li>`).join('');

  return `
    <article class="mp-card ${ui.highlightId === order.id ? 'is-highlight' : ''}" data-order-id="${id}">
      <div class="mp-card-main">
        ${order.screenshot ? `<img class="mp-thumb" src="${order.screenshot}" alt="Diseño del pedido ${id}" />` : '<div class="mp-thumb mp-thumb-empty">👕</div>'}
        <div class="mp-info">
          <div class="mp-head">
            <span class="mp-id">#${id}</span>
            <span class="mp-status" data-tone="${meta.tone}">${escapeHtml(meta.label)}</span>
          </div>
          <div class="mp-title">${escapeHtml(g.silhouette || 'Camiseta')} · Talla <strong>${escapeHtml(g.size || '')}</strong></div>
          <div class="mp-meta">
            <span>${escapeHtml(g.color || '')}</span><span>${escapeHtml(g.material || '')} ${escapeHtml(g.grammage || '')}</span>
            <span class="mp-date">${escapeHtml(formatDate(order.createdAt))}</span>
          </div>
          <div class="mp-total">${escapeHtml(order.pricing?.formatted || '')}</div>
        </div>
      </div>

      ${decals ? `<ul class="mp-decals">${decals}</ul>` : ''}
      ${order.customer?.name ? `<div class="mp-customer">👤 ${escapeHtml(order.customer.name)}${order.customer.city ? ` · ${escapeHtml(order.customer.city)}` : ''}</div>` : ''}
      <p class="mp-status-hint" data-tone="${meta.tone}">${escapeHtml(meta.hint)}</p>

      ${(order.status === ORDER_STATUS.PROOF_SUBMITTED || order.status === ORDER_STATUS.PAID || order.stage) ? renderOrderTimeline(order) : ''}

      ${payable && expanded ? renderPaymentPanel(order, ui) : ''}

      <div class="mp-actions">
        ${payable ? `<button type="button" class="mp-btn mp-btn-primary" data-action="toggle-pay" data-id="${id}">
          ${expanded ? 'Ocultar datos de pago' : (order.status === ORDER_STATUS.PROOF_SUBMITTED ? '🔍 Ver estado de pago' : '💳 Pagar ahora')}</button>` : ''}
        ${order.screenshot ? `<button type="button" class="mp-btn mp-btn-ghost" data-action="download-photo" data-id="${id}">📥 Foto HD</button>` : ''}
        ${order.driveUrl ? `<a class="mp-btn mp-btn-ghost" href="${escapeHtml(order.driveUrl)}" target="_blank" rel="noopener">☁️ Arte 300 DPI</a>` : ''}
        ${order.status === ORDER_STATUS.PENDING_PAYMENT || !order.status ? `<button type="button" class="mp-btn mp-btn-danger" data-action="delete" data-id="${id}">🗑️ Eliminar</button>` : ''}
      </div>
    </article>`;
}

function renderEmpty(user) {
  return user
    ? `<div class="mp-empty"><div class="mp-empty-icon">📋</div><h4>Aún no tienes pedidos</h4>
       <p>Cuando confirmes un pedido en el estudio 3D aparecerá aquí, listo para pagar.</p></div>`
    : `<div class="mp-empty"><div class="mp-empty-icon">🔐</div><h4>Inicia sesión para ver tus pedidos</h4>
       <p>Tus pedidos y pagos están asociados a tu cuenta.</p>
       <button type="button" class="mp-btn mp-btn-primary" data-action="login">Iniciar sesión</button></div>`;
}

export function renderOrdersModalHtml({ orders, user, ui }) {
  return `
    <div class="modal-card orders-modal-card">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">${user ? escapeHtml(user.email) : 'Panel del cliente'}</span>
          <h3 class="modal-title">📦 Mis Pedidos${user ? ` (${orders.length})` : ''}</h3>
        </div>
        <button type="button" class="btn-close-modal" data-action="close" title="Cerrar">✕</button>
      </div>
      <div class="modal-body mp-body">
        ${orders.length ? orders.map((o) => renderOrderCard(o, ui)).join('') : renderEmpty(user)}
      </div>
      <div class="modal-footer mp-footer">
        <button type="button" class="btn-secondary" data-action="close">Cerrar</button>
      </div>
    </div>`;
}
