import { SIZES } from '../config/colors.js';
import { formatCurrency, PRICING_CONFIG } from '../config/pricing.js';
import { FABRIC_MATERIALS, FABRIC_GRAMMAGES } from '../config/materials.js';
import { getZoneName } from '../services/orderDraft.js';

/**
 * Markup del Checkout Atelier (Talla, Tela, Gramaje, recibo de precio y datos de entrega).
 * Los indicadores de selección se dibujan por CSS (`checkoutSelectors.css`), sin elementos extra.
 */

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function receiptRow(label, amount, extraClass = '') {
  return `
    <div class="receipt-row ${extraClass}">
      <span class="receipt-label">${label}</span>
      <span class="receipt-dots" aria-hidden="true"></span>
      <span class="receipt-amount">${amount}</span>
    </div>`;
}

function renderReceipt({ orderId, state, selectedSize, selectedGrammage, extraZones, sizeAddon, basePrice, grammageModifier }) {
  const zoneRows = extraZones.map(([zoneId, price]) => receiptRow(`Estampado · ${getZoneName(zoneId)}`, `+${formatCurrency(price)}`)).join('');
  return `
    <div class="atelier-receipt" role="group" aria-label="Desglose de precio">
      <div class="receipt-head">
        <span class="receipt-title">Atelier Receipt</span>
        <span class="receipt-id">#${escapeHtml(orderId)}</span>
      </div>
      ${receiptRow(`Camiseta base · Talla ${selectedSize.label}`, formatCurrency(basePrice + sizeAddon))}
      ${grammageModifier !== 0 ? receiptRow(`Ajuste gramaje · ${selectedGrammage} GSM`, `${grammageModifier > 0 ? '+' : '−'}${formatCurrency(Math.abs(grammageModifier))}`) : ''}
      ${zoneRows}
      <div class="receipt-tear" aria-hidden="true"></div>
      <div class="receipt-total">
        <span class="receipt-total-label">Total a pagar</span>
        <strong class="checkout-total-val" id="checkout-total-val">${formatCurrency(state.pricing.total)}</strong>
      </div>
      <p class="receipt-note">Pagas por Nequi o Bancolombia después de confirmar.</p>
    </div>`;
}

export function renderCheckoutModalHtml({ orderId, state, screenshotDataUrl, activeDecals, authUser }) {
  const { selectedColor, selectedSize, selectedSilhouette, selectedMaterial, selectedGrammage, pricing } = state;
  const silName = selectedSilhouette === 'woman' ? 'Mujer (Slim Fit)' : 'Hombre (Boxy Fit)';

  // Gramajes permitidos según el material seleccionado
  const availableGrammages = selectedMaterial === 'algodon'
    ? FABRIC_GRAMMAGES.filter((g) => g.id === '180' || g.id === '240')
    : FABRIC_GRAMMAGES.filter((g) => g.id === '120' || g.id === '180');

  const basePrice = pricing.basePrice || PRICING_CONFIG.baseShirtPrice;
  const sizeAddon = PRICING_CONFIG.sizeAddons[selectedSize.id] || 0;
  const grammageObj = FABRIC_GRAMMAGES.find((g) => g.id === selectedGrammage);
  const grammageModifier = grammageObj ? grammageObj.priceModifier : 0;
  const extraZones = Object.entries(state.customizations)
    .filter(([zoneId, decal]) => decal && decal.hasDecal && (PRICING_CONFIG.zonePrices[zoneId] || 0) > 0)
    .map(([zoneId]) => [zoneId, PRICING_CONFIG.zonePrices[zoneId]]);

  const authHint = authUser
    ? `Pedido a nombre de <strong>${escapeHtml(authUser.email)}</strong>`
    : 'Al confirmar te pediremos iniciar sesión o registrarte. Tu diseño queda guardado.';

  return `
    <div class="modal-card checkout-modal-card">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">CHECKOUT ATELIER</span>
          <h3 class="modal-title">Confirmar y Personalizar Pedido</h3>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-modal" title="Cerrar">✕</button>
      </div>

      <div class="modal-body checkout-modal-body">
        <!-- Columna Izquierda: Vista Previa y Descargas -->
        <div class="checkout-preview-col">
          <div class="modal-preview-box">
            <img src="${screenshotDataUrl}" alt="Prenda 3D Personalizada" class="modal-preview-img" />
            <div class="checkout-preview-actions">
              <button type="button" id="btn-download-preview" class="btn-download-tag">📥 Mockup 3D</button>
              ${activeDecals.length > 0 ? `
                <button type="button" id="btn-download-300dpi" class="btn-download-tag btn-download-dpi" title="Generar y descargar archivo listo para impresión a 300 DPI">
                  🖨️ Arte 300 DPI
                </button>` : ''}
            </div>
          </div>

          <div class="checkout-garment-summary">
            <div class="summary-chip-item"><span class="chip-label">Silueta</span><strong>${silName}</strong></div>
            <div class="summary-chip-item">
              <span class="chip-label">Color</span>
              <span class="color-dot-inline" style="background:${selectedColor.hex};"></span>
              <strong>${selectedColor.name}</strong>
            </div>
            <div class="summary-chip-item">
              <span class="chip-label">Estampados</span>
              <strong>${activeDecals.map(([id]) => id.toUpperCase()).join(', ') || 'Sin estampado'}</strong>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Configuración de Prenda & Validación de Precio -->
        <div class="checkout-config-col">
          <div class="checkout-field-section">
            <div class="section-label-row">
              <span class="checkout-field-title">1. Elige tu Talla</span>
              <span class="checkout-field-hint" id="size-dimensions-hint">Largo ${selectedSize.lengthCm} cm • Pecho ${selectedSize.widthCm} cm</span>
            </div>
            <div class="checkout-sizes-grid">
              ${SIZES.map((s) => {
                const isSelected = s.id === selectedSize.id;
                const addon = PRICING_CONFIG.sizeAddons[s.id] || 0;
                return `
                  <button type="button" class="btn-checkout-size ${isSelected ? 'active' : ''}" aria-pressed="${isSelected}" data-size-id="${s.id}">
                    <span class="size-letter">${s.label}</span>
                    <span class="size-sub">${s.lengthCm}x${s.widthCm}cm</span>
                    ${addon > 0 ? `<span class="size-addon-badge">+${formatCurrency(addon)}</span>` : ''}
                  </button>`;
              }).join('')}
            </div>
          </div>

          <div class="checkout-field-section">
            <span class="checkout-field-title">2. Tipo de Material Textil</span>
            <div class="checkout-materials-row">
              ${FABRIC_MATERIALS.map((m) => `
                <button type="button" class="btn-checkout-mat ${m.id === selectedMaterial ? 'active' : ''}" aria-pressed="${m.id === selectedMaterial}" data-mat-id="${m.id}">
                  <span class="mat-icon">${m.icon}</span>
                  <div class="mat-info-text">
                    <strong class="mat-name">${m.name}</strong>
                    <small class="mat-desc">${m.badge}</small>
                  </div>
                </button>`).join('')}
            </div>
          </div>

          <div class="checkout-field-section">
            <span class="checkout-field-title">3. Gramaje del Tejido</span>
            <div class="checkout-grammages-row">
              ${availableGrammages.map((g) => {
                const isSelected = g.id === selectedGrammage;
                const modText = g.priceModifier > 0
                  ? `(+${formatCurrency(g.priceModifier)})`
                  : (g.priceModifier < 0 ? `(${formatCurrency(g.priceModifier)})` : '(Incluido)');
                return `
                  <button type="button" class="btn-checkout-gram ${isSelected ? 'active' : ''}" aria-pressed="${isSelected}" data-gram-id="${g.id}">
                    <strong class="gram-title">${g.label} • ${g.title}</strong>
                    <span class="gram-mod">${modText}</span>
                  </button>`;
              }).join('')}
            </div>
          </div>

          ${renderReceipt({ orderId, state, selectedSize, selectedGrammage, extraZones, sizeAddon, basePrice, grammageModifier })}

          <div class="checkout-field-section">
            <span class="checkout-field-title">4. Datos de Entrega</span>
            <div class="checkout-contact-grid">
              <div class="input-field">
                <label for="cust-name">Nombre y Apellido</label>
                <input type="text" id="cust-name" placeholder="Ej. Carlos Mendoza" class="text-input" autocomplete="name" aria-required="true" />
              </div>
              <div class="input-field">
                <label for="cust-city">Ciudad de Envío</label>
                <input type="text" id="cust-city" placeholder="Ej. Bogotá / Medellín / Cali" class="text-input" autocomplete="address-level2" aria-required="true" />
              </div>
            </div>
            <p class="checkout-form-error" id="checkout-form-error" role="alert"></p>
          </div>
        </div>
      </div>

      <div class="modal-footer checkout-modal-footer">
        <p class="checkout-footer-note" id="checkout-auth-hint">${authHint}</p>
        <div class="checkout-footer-actions">
          <button type="button" id="btn-cancel" class="btn-secondary">Volver al Editor</button>
          <button type="button" id="btn-confirm-order" class="btn-confirm-primary"><span>✓ Confirmar Pedido</span></button>
        </div>
      </div>
    </div>
  `;
}
