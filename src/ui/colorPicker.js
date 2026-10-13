import { FABRIC_COLORS } from '../config/colors.js';
import { setColor } from '../state/actions.js';
import { store } from '../state/store.js';
import { renderMagicMugCard, bindMagicMugEvents, syncMagicMugHeatUi } from './magicMugControls.js';
import { paintRanges } from './rangeFill.js';

export function initColorPicker(container) {
  function render() {
    const state = store.getState();
    const current = state.selectedColor;
    const isMug = state.selectedSilhouette === 'mug';
    const isMagic = isMug && state.isMagicMug;

    const html = `
      ${renderMagicMugCard(state)}
      ${!isMagic ? `
        <div class="control-card color-picker-card">
          <div class="card-header-clean">
            <span class="card-eyebrow">${isMug ? 'TONO CERÁMICO DEL VASO' : 'TONO DE LA PRENDA'}</span>
            <div class="selected-color-meta">
              <span class="color-dot-live" id="color-dot-indicator" style="background-color: ${current.hex};"></span>
              <span id="selected-color-name" class="color-pill-tag">${current.name}</span>
            </div>
          </div>

          <div class="swatches-luxury-grid">
            ${FABRIC_COLORS.map(c => `
              <button 
                type="button" 
                class="swatch-luxury ${c.id === current.id ? 'active' : ''}" 
                data-color-id="${c.id}" 
                title="${c.name}" 
                style="--swatch-color: ${c.hex};"
              >
                <span class="swatch-core"></span>
                <span class="swatch-check-icon">✓</span>
              </button>
            `).join('')}

            <label class="swatch-luxury swatch-custom" title="Elegir tono personalizado (Rueda cromática)">
              <input type="color" id="custom-color-input" value="${current.hex}" class="custom-color-hidden" />
              <span class="swatch-custom-core">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </span>
            </label>
          </div>
        </div>
      ` : ''}
    `;

    container.innerHTML = html;
    bindMagicMugEvents(container);
    paintRanges(container);

    const buttons = container.querySelectorAll('.swatch-luxury[data-color-id]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const colorId = btn.getAttribute('data-color-id');
        const found = FABRIC_COLORS.find(c => c.id === colorId);
        if (found) setColor(found);
      });
    });

    const customInput = container.querySelector('#custom-color-input');
    if (customInput) {
      customInput.addEventListener('input', (e) => {
        setColor({
          id: 'custom',
          name: 'A Medida',
          hex: e.target.value,
          roughness: 0.88,
          metalness: 0.02
        });
      });
    }
  }

  render();

  store.subscribe((state, changeKey) => {
    if (changeKey === 'silhouette' || changeKey === 'magicMug') {
      render();
    } else if (changeKey === 'mugHeat') {
      syncMagicMugHeatUi(container, state);
    } else if (changeKey === 'color') {
      const colorNameEl = container.querySelector('#selected-color-name');
      const dotEl = container.querySelector('#color-dot-indicator');
      if (colorNameEl) colorNameEl.textContent = state.selectedColor.name;
      if (dotEl) dotEl.style.backgroundColor = state.selectedColor.hex;

      container.querySelectorAll('.swatch-luxury[data-color-id]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-color-id') === state.selectedColor.id);
      });
      const customInput = container.querySelector('#custom-color-input');
      if (customInput) customInput.value = state.selectedColor.hex;
    }
  });
}
