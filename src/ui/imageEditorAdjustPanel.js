import { STYLE_FILTERS } from '../services/imageStyles.js';

/**
 * Plantilla de la pestaña "Ajustes" del editor (NODE-010): tono y color, transformaciones y filtros streetwear.
 * Los ids los consume `imageEditorAdjust.js`.
 */
function row(id, label, min, max, value, step = 1) {
  const ratio = ((value - min) / (max - min)).toFixed(4);
  return `
    <label class="adj-row"><span>${label}</span>
      <input type="range" id="adj-${id}" class="range-slider" min="${min}" max="${max}" step="${step}" value="${value}" style="--pct-ratio: ${ratio};" />
      <b id="adj-${id}-val" title="Doble clic para restablecer">${value}</b></label>`;
}

export function getAdjustPanelTemplate() {
  const filters = STYLE_FILTERS.map((f) => `
    <button type="button" class="adj-filter" data-style="${f.id}" title="${f.hint}">
      <span class="adj-filter-swatch" style="background:${f.swatch}"></span>
      <span class="adj-filter-text"><b>${f.label}</b><small>${f.hint}</small></span>
    </button>`).join('');

  return `
    <div class="adjust-panel" id="editor-adjust-panel">
      <div class="tool-detail-box adj-block">
        <div class="tool-group-title">🎚️ Tono &amp; Color <small class="adj-live">en vivo</small></div>
        ${row('brightness', 'Brillo', -100, 100, 0)}
        ${row('contrast', 'Contraste', -100, 100, 0)}
        ${row('saturation', 'Saturación', 0, 200, 100)}
        ${row('sharpen', 'Nitidez', 0, 100, 0)}
        <div class="quick-tools-grid">
          <button type="button" class="btn-tool-pill active" id="adj-apply-tonal" disabled>✓ Aplicar ajustes</button>
          <button type="button" class="btn-tool-pill" id="adj-reset-tonal" disabled>↺ Restablecer</button>
        </div>
      </div>

      <div class="tool-detail-box adj-block">
        <div class="tool-group-title">🔄 Transformar</div>
        ${row('rotation', 'Giro libre', -180, 180, 0, 0.5)}
        <div class="quick-tools-grid adj-grid-4">
          <button type="button" class="btn-tool-pill" id="adj-rot-ccw" title="Girar 90° a la izquierda">⟲ 90°</button>
          <button type="button" class="btn-tool-pill" id="adj-rot-cw" title="Girar 90° a la derecha">⟳ 90°</button>
          <button type="button" class="btn-tool-pill" id="adj-flip-x" title="Voltear horizontalmente">↔ Flip X</button>
          <button type="button" class="btn-tool-pill" id="adj-flip-y" title="Voltear verticalmente">↕ Flip Y</button>
        </div>
        <div class="quick-tools-grid">
          <button type="button" class="btn-tool-pill active" id="adj-apply-rot" disabled>✓ Aplicar giro</button>
          <button type="button" class="btn-tool-pill" id="adj-go-crop" title="Abre el recorte libre con guía de encuadre">✂️ Recorte libre</button>
        </div>
      </div>

      <div class="tool-detail-box adj-block">
        <div class="tool-group-title">🎨 Filtros Streetwear</div>
        <div class="adj-filters">${filters}</div>
        <p class="text-hint">Cada filtro es un paso que se puede deshacer. Los píxeles transparentes no cambian.</p>
      </div>
    </div>`;
}
