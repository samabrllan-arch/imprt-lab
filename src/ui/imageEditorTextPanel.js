import { TEXT_FONTS, DEFAULT_TEXT_LAYER as D } from './imageEditorTextRender.js';

/**
 * Plantilla de la pestaña "Textos & Caligrafías" del editor (NODE-010).
 * Selector desplegable con scroll de 20 caligrafías + controles de espacio exterior para textos fuera de la imagen.
 */
export function getTextPanelTemplate() {
  const dropdownItems = TEXT_FONTS.map(f => `
    <div class="font-dropdown-item ${f.id === 'anton' ? 'active' : ''}" data-font="${f.id}" role="option">
      <span class="font-item-name" style="font-family:${f.family};font-weight:${f.weight}">${f.label}</span>
      <span class="font-item-badge">${f.group}</span>
    </div>`).join('');

  return `
    <div class="text-panel" id="editor-text-panel">
      <div class="text-input-row">
        <input type="text" id="text-input" class="text-input" maxlength="40" placeholder="Escribe tu título…" value="${D.text}" autocomplete="off" />
        <button type="button" class="btn-text-add" id="btn-text-add" title="Añadir texto al arte">＋ Añadir</button>
      </div>

      <div class="font-select-field">
        <label class="font-select-label">Tipo de Caligrafía</label>
        <div class="font-dropdown-container" id="font-dropdown-container">
          <button type="button" class="font-dropdown-trigger" id="font-dropdown-trigger" aria-haspopup="listbox">
            <span class="font-trigger-text" id="font-trigger-text" style="font-family:'Anton', Impact, sans-serif">Anton</span>
            <span class="font-trigger-badge" id="font-trigger-badge">Bold</span>
            <span class="font-trigger-arrow">▾</span>
          </button>
          <div class="font-dropdown-menu" id="font-dropdown-menu" role="listbox" style="display:none;">
            ${dropdownItems}
          </div>
        </div>
      </div>

      <div class="text-sliders">
        <label class="text-slider-row"><span>Tamaño</span>
          <input type="range" id="text-size" class="range-slider" min="4" max="45" step="1" value="${D.sizePct}" style="--pct-ratio: ${(((D.sizePct - 4) / 41)).toFixed(4)};" />
          <b id="text-size-val">${D.sizePct}%</b></label>
        <label class="text-slider-row"><span>Curvatura</span>
          <input type="range" id="text-curve" class="range-slider" min="-100" max="100" step="1" value="${D.curve}" style="--pct-ratio: ${(((D.curve + 100) / 200)).toFixed(4)};" />
          <b id="text-curve-val" title="Clic para dejar recto">${D.curve}%</b></label>
        <label class="text-slider-row"><span>Borde</span>
          <input type="range" id="text-stroke-w" class="range-slider" min="0" max="12" step="1" value="${D.strokeW}" style="--pct-ratio: ${((D.strokeW / 12)).toFixed(4)};" />
          <b id="text-stroke-val">${D.strokeW}</b></label>
        <label class="text-slider-row"><span>Sombra</span>
          <input type="range" id="text-shadow" class="range-slider" min="0" max="100" step="1" value="${D.shadow}" style="--pct-ratio: ${(D.shadow / 100).toFixed(4)};" />
          <b id="text-shadow-val">${D.shadow}</b></label>
      </div>

      <div class="text-colors">
        <label class="color-field">Color <input type="color" id="text-fill" value="${D.fill}" /></label>
        <label class="color-field">Contorno <input type="color" id="text-stroke" value="${D.stroke}" /></label>
        <label class="color-field">Sombra <input type="color" id="text-shadow-color" value="${D.shadowColor}" /></label>
      </div>

      <div class="text-canvas-margin-block">
        <div class="text-padding-header">
          <span>📐 Espacio exterior para texto fuera del arte</span>
        </div>
        <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr 1fr;">
          <button type="button" class="btn-tool-pill" id="btn-pad-top" title="Añade margen transparente arriba">⬆ + Arriba</button>
          <button type="button" class="btn-tool-pill" id="btn-pad-bottom" title="Añade margen transparente abajo">⬇ + Abajo</button>
          <button type="button" class="btn-tool-pill" id="btn-pad-sides" title="Añade margen a los lados">↔ + Lados</button>
        </div>
      </div>

      <div class="quick-tools-grid">
        <button type="button" class="btn-tool-pill active" id="btn-text-commit" disabled>✓ Fijar en el arte</button>
        <button type="button" class="btn-tool-pill" id="btn-text-discard" disabled>🗑 Quitar</button>
      </div>
      <p class="text-hint">Arrastra el texto para moverlo. Con los botones de arriba dale espacio para que quede por fuera.</p>
    </div>`;
}
