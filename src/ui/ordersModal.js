/**
 * "Mis Pedidos" (NODE-024): lista los pedidos de la cuenta, muestra los datos de pago
 * (Nequi / Bancolombia) y permite subir el comprobante o enviarlo por WhatsApp.
 */
import '../styles/ordersModal.css';
import { authService } from '../services/authService.js';
import { getOrdersForUser, getLocalOrderById, updateLocalOrder, deleteLocalOrder } from '../services/orderStorage.js';
import { compressProofImage } from '../services/paymentProof.js';
import { buildPaymentProofWhatsAppUrl } from '../services/whatsapp.js';
import { downloadImage } from '../services/exporter.js';
import { ORDER_STATUS, getPaymentMethod } from '../config/paymentConfig.js';
import { getNextStage, getStageMeta } from '../config/orderTimeline.js';
import { renderOrdersModalHtml } from './ordersModalView.js';
import { authModal } from './authModal.js';
import { reportPaymentToGoogleDrive } from '../services/driveUploader.js';
import { showToast } from './toast.js';

const OVERLAY_ID = 'saved-orders-modal-overlay';

export function openOrdersModal({ highlightId = null, expandPayment = false } = {}) {
  document.getElementById(OVERLAY_ID)?.remove();

  const ui = { expandedId: expandPayment ? highlightId : null, highlightId, methods: {}, pending: {} };
  let scrollToHighlight = !!highlightId;

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);
  const unsubscribeAuth = authService.subscribe(() => render());

  function close() {
    unsubscribeAuth();
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 200);
  }

  function render() {
    const prevScroll = overlay.querySelector('.mp-body')?.scrollTop || 0;
    const user = authService.getCurrentUser();
    overlay.innerHTML = renderOrdersModalHtml({ orders: getOrdersForUser(user), user, ui });

    const body = overlay.querySelector('.mp-body');
    if (scrollToHighlight) {
      scrollToHighlight = false;
      overlay.querySelector('.mp-card.is-highlight')?.scrollIntoView({ block: 'nearest' });
    } else if (body) {
      body.scrollTop = prevScroll;
    }
    ui.highlightId = null; // el destello del pedido nuevo se muestra una sola vez
  }

  async function handleFile(orderId, file) {
    if (!file) return;
    try {
      ui.pending[orderId] = await compressProofImage(file);
      ui.expandedId = orderId;
      render();
    } catch (err) {
      showToast(err.message, 'error', 4500);
    }
  }

  function markPaid(orderId) {
    const order = getLocalOrderById(orderId);
    if (!order) return;
    const method = ui.methods[orderId] || order?.paymentMethod || 'nequi';
    const image = ui.pending[orderId] || order?.paymentProof?.image || null;

    const { ok } = updateLocalOrder(orderId, {
      status: ORDER_STATUS.PROOF_SUBMITTED,
      stage: 'validation',
      paymentMethod: method,
      paymentProof: {
        channel: image ? 'web' : 'direct_claim',
        image,
        submittedAt: new Date().toISOString()
      }
    });
    if (!ok) {
      return showToast('No se pudo actualizar el estado. Intenta de nuevo.', 'error', 4500);
    }

    reportPaymentToGoogleDrive({
      orderId,
      status: ORDER_STATUS.PROOF_SUBMITTED,
      paymentMethod: method,
      proofImage: image,
      customerEmail: order.customer?.email,
      notes: `Canal: ${image ? 'web' : 'direct_claim'}`
    }).catch((err) => console.warn('[PaymentCloud] Sync diferido:', err));

    delete ui.pending[orderId];
    ui.expandedId = null;
    showToast('¡Pago reportado! Tu pedido entró en validación. En menos de 24 horas te notificaremos.', 'success', 6000);
    render();
  }

  function advanceStage(orderId) {
    const order = getLocalOrderById(orderId);
    if (!order) return;
    const currentStage = order.stage || 'validation';
    const nextStage = getNextStage(currentStage);
    const meta = getStageMeta(nextStage);
    const isDelivered = nextStage === 'delivered';

    updateLocalOrder(orderId, {
      stage: nextStage,
      status: isDelivered ? ORDER_STATUS.PAID : (order.status || ORDER_STATUS.PROOF_SUBMITTED)
    });
    showToast(`Paso actualizado: "${meta.short}"`, 'info', 3000);
    render();
  }

  function sendWhatsApp(orderId) {
    const order = getLocalOrderById(orderId);
    if (!order) return;
    const method = ui.methods[orderId] || order.paymentMethod || null;
    // window.open debe ejecutarse dentro del gesto del clic para no ser bloqueado
    window.open(buildPaymentProofWhatsAppUrl(order, getPaymentMethod(method)?.label || ''), '_blank', 'noopener');

    const now = new Date().toISOString();
    updateLocalOrder(orderId, {
      paymentMethod: method,
      stage: order.stage || 'validation',
      status: order.status === ORDER_STATUS.PAID ? ORDER_STATUS.PAID : ORDER_STATUS.PROOF_SUBMITTED,
      paymentProof: order.paymentProof?.image
        ? { ...order.paymentProof, whatsappSentAt: now }
        : { channel: 'whatsapp', image: null, submittedAt: now }
    });
    reportPaymentToGoogleDrive({
      orderId,
      status: ORDER_STATUS.PROOF_SUBMITTED,
      paymentMethod: method,
      customerEmail: order.customer?.email,
      notes: 'Notificado vía WhatsApp'
    }).catch((err) => console.warn('[PaymentCloud] Sync diferido:', err));

    showToast('Abrimos WhatsApp: adjunta tu comprobante. Tu pedido entró en validación.', 'info', 5500);
    render();
  }

  const actions = {
    close,
    login: () => authModal.open('login'),
    'toggle-pay': (id) => { ui.expandedId = ui.expandedId === id ? null : id; render(); },
    'select-method': (id, el) => { ui.methods[id] = el.dataset.method; render(); },
    'mark-paid': markPaid,
    'submit-proof': markPaid,
    'advance-stage': advanceStage,
    'send-whatsapp': sendWhatsApp,
    copy: (id, el) => {
      navigator.clipboard?.writeText(el.dataset.copy).then(
        () => showToast('Copiado al portapapeles', 'success', 1800),
        () => showToast('No se pudo copiar. Selecciónalo manualmente.', 'error')
      );
    },
    'download-photo': (id) => {
      const order = getLocalOrderById(id);
      if (order?.screenshot) downloadImage(order.screenshot, `pedido-${order.id}-talla-${order.garment?.size}.png`);
    },
    delete: (id) => {
      if (!confirm(`¿Eliminar pedido ${id}?`)) return;
      deleteLocalOrder(id);
      render();
    }
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return close();
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) actions[el.dataset.action](el.dataset.id, el);
  });
  overlay.addEventListener('change', (e) => {
    if (e.target.matches('.mp-file-input')) handleFile(e.target.dataset.id, e.target.files[0]);
  });
  overlay.addEventListener('dragover', (e) => { if (e.target.closest('.mp-drop')) e.preventDefault(); });
  overlay.addEventListener('drop', (e) => {
    const zone = e.target.closest('.mp-drop');
    if (!zone) return;
    e.preventDefault();
    handleFile(zone.dataset.dropId, e.dataTransfer.files[0]);
  });

  render();
  requestAnimationFrame(() => overlay.classList.add('active'));
}
