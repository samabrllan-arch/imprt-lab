/**
 * Auth Gate del checkout (NODE-024): aviso elegante "Inicia sesión o regístrate para continuar tu pedido".
 * El borrador ya está en `shirt_pending_order_draft`; al autenticarse `checkoutOrderFlow` lo retoma solo.
 */
import '../styles/orderAuthGate.css';
import { authModal } from './authModal.js';
import { clearOrderDraft } from '../services/orderDraft.js';

const GATE_ID = 'order-auth-gate-overlay';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function closeOrderAuthGate() {
  const overlay = document.getElementById(GATE_ID);
  if (!overlay) return;
  overlay.classList.remove('active');
  setTimeout(() => overlay.remove(), 250);
}

export function openOrderAuthGate(draft) {
  document.getElementById(GATE_ID)?.remove();

  const overlay = document.createElement('div');
  overlay.id = GATE_ID;
  overlay.className = 'modal-overlay order-gate-overlay';
  overlay.innerHTML = `
    <div class="order-gate-card" role="dialog" aria-modal="true" aria-labelledby="og-title">
      <div class="og-lock" aria-hidden="true">🔐</div>
      <span class="og-eyebrow">Último paso</span>
      <h3 class="og-title" id="og-title">Inicia sesión o regístrate para continuar tu pedido</h3>
      <p class="og-sub">Guardamos tu diseño en este dispositivo. En cuanto ingreses, lo retomamos automáticamente y lo verás en <strong>Mis Pedidos</strong> listo para pagar.</p>

      <div class="og-summary">
        ${draft.screenshot ? `<img class="og-thumb" src="${draft.screenshot}" alt="Tu diseño" />` : '<div class="og-thumb og-thumb-empty">👕</div>'}
        <div class="og-summary-text">
          <span class="og-order-id">#${escapeHtml(draft.id)}</span>
          <strong>${escapeHtml(draft.garment.silhouette)} · Talla ${escapeHtml(draft.garment.size)}</strong>
          <span class="og-muted">${escapeHtml(draft.garment.color)} · ${escapeHtml(draft.garment.material)}</span>
        </div>
        <span class="og-total">${escapeHtml(draft.pricing.formatted)}</span>
      </div>

      <div class="og-actions">
        <button type="button" class="og-btn og-btn-primary" id="og-login">Iniciar sesión</button>
        <button type="button" class="og-btn og-btn-ghost" id="og-register">Crear cuenta</button>
      </div>
      <button type="button" class="og-back" id="og-cancel">Volver al checkout</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  const cancel = () => {
    clearOrderDraft(); // el usuario desistió explícitamente: no retomar un pedido que no quiere
    closeOrderAuthGate();
  };
  overlay.querySelector('#og-login').addEventListener('click', () => authModal.open('login'));
  overlay.querySelector('#og-register').addEventListener('click', () => authModal.open('register'));
  overlay.querySelector('#og-cancel').addEventListener('click', cancel);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cancel(); });
}
