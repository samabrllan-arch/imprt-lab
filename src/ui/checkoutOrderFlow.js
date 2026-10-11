/**
 * Flujo "Checkout Atelier" (NODE-024): borrador en caché → Auth Gate → pedido `pending_payment`.
 *
 *  1. confirmOrder(draft)   guarda el borrador y verifica la sesión.
 *  2. Sin sesión            abre el Auth Gate; `initOrderDraftResume()` retoma el borrador al iniciar sesión.
 *  3. finalizeOrder(draft)  crea el pedido, limpia el borrador y abre "Mis Pedidos" en el panel de pago.
 */
import { authService } from '../services/authService.js';
import { saveOrderDraft, loadOrderDraft, clearOrderDraft, getPrimaryDecal } from '../services/orderDraft.js';
import { createOrderFromDraft, updateLocalOrder, getOrdersForUser } from '../services/orderStorage.js';
import { ORDER_STATUS } from '../config/paymentConfig.js';
import { archivePurchasedDesign } from '../services/vaultStorage.js';
import { sendOrderToGoogleDrive } from '../services/driveUploader.js';
import { downloadImage } from '../services/exporter.js';
import { store } from '../state/store.js';
import { createArtGenerator } from './checkoutArt300.js';
import { openOrderAuthGate, closeOrderAuthGate } from './orderAuthGate.js';
import { openOrdersModal } from './ordersModal.js';
import { showToast } from './toast.js';

let finalizing = false;

function dismissCheckoutModal() {
  const overlay = document.getElementById('order-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  setTimeout(() => overlay.remove(), 250);
}

/** Sube el arte 300 DPI a Drive; si no hay webhook o falla, lo descarga localmente como respaldo. */
async function deliverPrintArt(order, draft) {
  const primary = getPrimaryDecal(store.getState());
  if (!primary || primary.key !== draft.artKey) return; // el diseño actual ya no es el del pedido

  const art = await createArtGenerator(order.id)();
  if (!art) return;

  const u = authService.getCurrentUser();
  const g = draft.garment;
  const res = await sendOrderToGoogleDrive({
    orderId: order.id,
    customerName: order.customer?.name || u?.name,
    customerEmail: order.customer?.email || u?.email,
    customerCity: order.customer?.city || u?.city,
    userId: u?.id,
    userAlias: u?.alias,
    garment: `${g.silhouette} • ${g.material}`,
    size: g.size,
    color: `${g.color} (${g.colorHex})`,
    dimensions: draft.decals.map((d) => `${d.zone}: ${d.widthCm}x${d.heightCm} cm`).join(' | '),
    total: draft.pricing.formatted,
    screenshot: order.screenshot || null,
    image300Dpi: art.png
  });

  if (res.success && res.fileUrl) {
    updateLocalOrder(order.id, { driveUrl: res.fileUrl });
  } else if (res.code === 'LIMIT_REACHED') {
    showToast(res.message, 'warning', 7000);
  } else {
    downloadImage(art.png, art.fileName);
    updateLocalOrder(order.id, { hasLocalFile: true });
    showToast('Descargamos tu arte 300 DPI. Adjúntalo al enviar tu comprobante por WhatsApp.', 'info', 5000);
  }
}

/** Registra el pedido para el usuario autenticado actual. */
export async function finalizeOrder(draft, { fromResume = false } = {}) {
  if (finalizing) return null;
  finalizing = true;
  try {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const pendingCount = getOrdersForUser(user).filter((o) => o.status === ORDER_STATUS.PENDING_PAYMENT).length;
    if (pendingCount >= 2) {
      dismissCheckoutModal();
      openOrdersModal({ expandPayment: true });
      showToast('Límite alcanzado: Tienes 2 pedidos pendientes de pago. Por favor marca como pagado uno anterior antes de generar uno nuevo.', 'warning', 7000);
      return null;
    }

    const { ok, order, existed } = createOrderFromDraft(draft, user);
    if (!ok) {
      showToast('No hay espacio para guardar el pedido en este dispositivo. Elimina pedidos antiguos e inténtalo de nuevo.', 'error', 6000);
      return null;
    }

    archivePurchasedDesign(order); // la prenda queda en la Bóveda (NODE-026); no consume cupos gratuitos
    clearOrderDraft();
    closeOrderAuthGate();
    dismissCheckoutModal();
    openOrdersModal({ highlightId: order.id, expandPayment: true });
    showToast(
      fromResume ? `Retomamos tu pedido #${order.id}. Ya puedes pagarlo.` : `Pedido #${order.id} registrado · Pendiente de pago`,
      'success',
      4500
    );

    if (!existed) deliverPrintArt(order, draft).catch((err) => console.warn('[CheckoutFlow] Arte 300 DPI:', err));
    return order;
  } finally {
    finalizing = false;
  }
}

/** Punto de entrada del botón "Confirmar Pedido". */
export async function confirmOrder(draft) {
  if (!saveOrderDraft(draft)) {
    showToast('No pudimos guardar el borrador en el navegador. No cierres la página mientras inicias sesión.', 'error', 5000);
  }
  if (!authService.isAuthenticated()) {
    openOrderAuthGate(draft);
    return { status: 'auth_required' };
  }
  const order = await finalizeOrder(draft);
  return { status: order ? 'created' : 'failed', order };
}

/**
 * Retoma automáticamente el borrador cuando el usuario pasa de anónimo a autenticado
 * (login, registro, Google o 2FA) y también al abrir la app con sesión y un borrador vigente.
 */
export function initOrderDraftResume() {
  let wasAuthenticated = authService.isAuthenticated();

  const resume = () => {
    const draft = loadOrderDraft();
    if (draft && authService.isAuthenticated()) finalizeOrder(draft, { fromResume: true });
  };

  authService.subscribe((user) => {
    const isNow = !!user;
    if (!wasAuthenticated && isNow) setTimeout(resume, 0);
    wasAuthenticated = isNow;
  });

  if (wasAuthenticated) setTimeout(resume, 800);
}
