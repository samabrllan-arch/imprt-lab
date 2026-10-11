import { FABRIC_COLORS } from '../config/colors.js';
import { setColor } from '../state/actions.js';
import { store } from '../state/store.js';

export function initColorPicker(container) {
  const current = store.getState().selectedColor;

  const html = `
    <!-- Selector de Color de Tejido -->
    <div class="control-card color-picker-card">
      <div class="card-header-clean">
        <span class="card-eyebrow">TONO DE LA PRENDA</span>
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

        <!-- Tono Libre / Personalizado -->
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
  `;

  container.innerHTML = html;

  // Lógica de Colores
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

  store.subscribe((state, changeKey) => {
    if (changeKey === 'color') {
      const colorNameEl = container.querySelector('#selected-color-name');
      const dotEl = container.querySelector('#color-dot-indicator');
      if (colorNameEl) colorNameEl.textContent = state.selectedColor.name;
      if (dotEl) dotEl.style.backgroundColor = state.selectedColor.hex;

      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-color-id') === state.selectedColor.id);
      });
      if (customInput) customInput.value = state.selectedColor.hex;
    }
  });
}
