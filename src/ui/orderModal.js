import { store } from '../state/store.js';
import { SIZES } from '../config/colors.js';
import { setSize, setMaterial, setGrammage } from '../state/actions.js';
import { downloadImage } from '../services/exporter.js';
import { authService } from '../services/authService.js';
import { buildOrderDraft } from '../services/orderDraft.js';
import { renderCheckoutModalHtml } from './checkoutModalView.js';
import { createArtGenerator } from './checkoutArt300.js';
import { confirmOrder } from './checkoutOrderFlow.js';

/**
 * Modal interactivo de Checkout: único lugar para Talla, Material, Gramaje y validación de precios.
 * "Confirmar Pedido" delega en `checkoutOrderFlow.js` (borrador en caché → Auth Gate → pedido pendiente de pago).
 */
export function openOrderModal(screenshotDataUrl) {
  document.getElementById('order-modal-overlay')?.remove();

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  let customerName = authService.getCurrentUser()?.name || '';
  let customerCity = authService.getCurrentUser()?.city || ''; // prefill desde Mi Perfil (NODE-025)
  const getOrGenerate300Dpi = createArtGenerator(orderId);

  const overlay = document.createElement('div');
  overlay.id = 'order-modal-overlay';
  overlay.className = 'modal-overlay checkout-modal-overlay';

  function closeModal() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 250);
  }

  function renderModal() {
    const state = store.getState();
    const activeDecals = Object.entries(state.customizations).filter(([, z]) => z.hasDecal);

    overlay.innerHTML = renderCheckoutModalHtml({
      orderId,
      state,
      screenshotDataUrl,
      activeDecals,
      authUser: authService.getCurrentUser()
    });

    // Restaurar valores tipeados tras cada re-render
    const nameIn = overlay.querySelector('#cust-name');
    const cityIn = overlay.querySelector('#cust-city');
    if (nameIn && customerName) nameIn.value = customerName;
    if (cityIn && customerCity) cityIn.value = customerCity;

    bindEvents();
  }

  function validateContact() {
    const fields = [['#cust-name', 'tu nombre y apellido'], ['#cust-city', 'la ciudad de envío']];
    const missing = fields.filter(([sel]) => !overlay.querySelector(sel)?.value.trim());
    fields.forEach(([sel]) => {
      const input = overlay.querySelector(sel);
      input?.classList.toggle('is-invalid', !input.value.trim());
    });

    const errBox = overlay.querySelector('#checkout-form-error');
    if (!missing.length) {
      if (errBox) errBox.textContent = '';
      return true;
    }
    if (errBox) errBox.textContent = `Completa ${missing.map((m) => m[1]).join(' y ')} para continuar.`;
    overlay.querySelector(missing[0][0])?.focus();
    return false;
  }

  async function handleConfirm(confirmBtn) {
    if (!validateContact()) return;

    const label = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span>⏳ Registrando pedido…</span>';
    try {
      const draft = buildOrderDraft({
        orderId,
        state: store.getState(),
        screenshot: screenshotDataUrl,
        customer: { name: customerName.trim(), city: customerCity.trim() }
      });
      await confirmOrder(draft);
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = label;
    }
  }

  function bindOption(selector, attr, apply) {
    overlay.querySelectorAll(selector).forEach((btn) => {
      btn.addEventListener('click', () => {
        apply(btn.getAttribute(attr));
        renderModal();
      });
    });
  }

  function bindEvents() {
    overlay.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);
    overlay.querySelector('#btn-cancel')?.addEventListener('click', closeModal);

    // Guardar campos al teclear
    [['#cust-name', (v) => { customerName = v; }], ['#cust-city', (v) => { customerCity = v; }]].forEach(([sel, save]) => {
      overlay.querySelector(sel)?.addEventListener('input', (e) => {
        save(e.target.value);
        e.target.classList.remove('is-invalid');
      });
    });

    // 1. Talla (único selector de la app)
    bindOption('.btn-checkout-size', 'data-size-id', (sizeId) => {
      const found = SIZES.find((s) => s.id === sizeId);
      if (found) setSize(found);
    });

    // 2. Material (ajusta el gramaje por defecto si el actual no existe en el nuevo material)
    bindOption('.btn-checkout-mat', 'data-mat-id', (matId) => {
      setMaterial(matId);
      const gram = store.getState().selectedGrammage;
      if ((matId === 'algodon' && gram === '120') || (matId === 'poliester' && gram === '240')) setGrammage('180');
    });

    // 3. Gramaje
    bindOption('.btn-checkout-gram', 'data-gram-id', setGrammage);

    // 4. Descargas
    overlay.querySelector('#btn-download-preview')?.addEventListener('click', () => {
      downloadImage(screenshotDataUrl, `camiseta-3d-${Date.now()}.png`);
    });

    const btn300Dpi = overlay.querySelector('#btn-download-300dpi');
    btn300Dpi?.addEventListener('click', async () => {
      const originalText = btn300Dpi.innerHTML;
      btn300Dpi.disabled = true;
      btn300Dpi.innerHTML = '⏳ Procesando 300 DPI...';
      try {
        const art = await getOrGenerate300Dpi();
        if (art) downloadImage(art.png, art.fileName);
      } finally {
        btn300Dpi.disabled = false;
        btn300Dpi.innerHTML = originalText;
      }
    });

    // 5. Confirmar pedido
    const confirmBtn = overlay.querySelector('#btn-confirm-order');
    confirmBtn?.addEventListener('click', () => handleConfirm(confirmBtn));
  }

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
  renderModal();
  requestAnimationFrame(() => overlay.classList.add('active'));
}
