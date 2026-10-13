import { formatCurrency } from '../config/pricing.js';
import { store } from '../state/store.js';

export function initPricingBar(container, onOrderClick) {
  function render() {
    const state = store.getState();
    const { pricing, selectedSilhouette, isMagicMug, customizations } = state;
    const isMug = selectedSilhouette === 'mug';
    const activeDecals = isMug
      ? (customizations.front?.hasDecal ? 1 : 0)
      : Object.values(customizations).filter(c => c.hasDecal).length;

    const subText = isMug
      ? (isMagicMug ? 'Mug Mágico Termosensible ✨ · 11 Oz' : 'Vaso Cerámico 11 Oz · Sublimación HD')
      : `${activeDecals} zona(s) con estampado DTF`;

    const html = `
      <div class="checkout-footer-dock">
        <!-- Fila de Precio y Acción Principal -->
        <div class="checkout-dock-main">
          <div class="dock-price-stack">
            <span class="dock-price-sub">${subText}</span>
            <div class="dock-price-val">${formatCurrency(pricing.total)}</div>
          </div>

          <button type="button" id="btn-checkout" class="btn-checkout-primary" title="Abrir checkout para confirmar pedido">
            <span>🛒 Confirmar Pedido</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const checkoutBtn = container.querySelector('#btn-checkout');
    if (checkoutBtn && onOrderClick) {
      checkoutBtn.addEventListener('click', onOrderClick);
    }
  }

  render();

  store.subscribe((state, changeKey) => {
    // El precio no depende de la transformación (mover/escalar): re-renderizar aquí causaría tirones al arrastrar
    if (
      changeKey === 'silhouette' ||
      changeKey === 'magicMug' ||
      changeKey === 'size' ||
      changeKey === 'color' ||
      changeKey === 'material' ||
      changeKey === 'grammage' ||
      (changeKey && changeKey.startsWith('decal:'))
    ) {
      render();
    }
  });
}
