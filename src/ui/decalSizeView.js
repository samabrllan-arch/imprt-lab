import { SIZES } from '../config/colors.js';
import {
  getDecalDimensionsCm, getWidthRangeCm, getHeightRangeCm, getImageAspect, buildSizeTable, buildPresetWidths, SIZE_MODES
} from '../config/printSizing.js';
import { computeEffectiveDpi, getDpiQuality } from '../services/printResolution.js';

/**
 * Panel "Medida real de impresión": lectura en cm, medidor de área máxima,
 * atajos, modo de graduación y comparativa por talla.
 * `renderSizePanel` genera el HTML; `refreshSizePanel` actualiza los nodos in-place
 * (sin re-render) para mantener 60 FPS mientras se arrastra un slider.
 */

const MODE_HINTS = {
  [SIZE_MODES.FIXED]: 'Mismos centímetros en todas las tallas. En prendas más pequeñas el estampado se verá proporcionalmente más grande.',
  [SIZE_MODES.PROPORTIONAL]: 'El estampado crece o se reduce con la prenda, conservando siempre la misma proporción visual.'
};

function setHtml(el, html) {
  if (el._sig === html) return;
  el._sig = html;
  el.innerHTML = html;
}

export const fmtCm = (n) => String(Number(n.toFixed(1)));

export function buildSizeViewModel(state, zoneId) {
  const decal = state.customizations[zoneId];
  if (!decal || !decal.hasDecal) return null;
  const size = state.selectedSize;
  const mode = state.sizeMode;
  const range = getWidthRangeCm(zoneId, size, decal.imageElement);
  const heightRange = getHeightRangeCm(zoneId, size);
  const dims = getDecalDimensionsCm(decal, zoneId, size);
  const naturalW = decal.imageElement?.naturalWidth || decal.imageElement?.width || 0;
  const effectiveDpi = computeEffectiveDpi(naturalW, dims.widthCm);
  const dpiQuality = getDpiQuality(effectiveDpi);
  const isLocked = decal.lockAspect !== false;
  return {
    decal, size, mode, range, heightRange,
    isLocked,
    aspect: decal.customAspect || getImageAspect(decal.imageElement),
    dims,
    effectiveDpi,
    dpiQuality,
    presets: buildPresetWidths(zoneId, range),
    table: buildSizeTable(decal, zoneId, SIZES, mode, size)
  };
}

function meterState(dims) {
  if (dims.atLimit) return 'max';
  return dims.usage >= 0.85 ? 'warn' : 'ok';
}

function meterText(dims) {
  if (dims.atLimit) return `Límite de impresión alcanzado (${fmtCm(dims.maxWidthCm)} × ${fmtCm(dims.maxHeightCm)} cm)`;
  return `${Math.round(dims.usage * 100)}% del área máxima · ${fmtCm(dims.maxWidthCm)} × ${fmtCm(dims.maxHeightCm)} cm`;
}

function presetsHtml(vm) {
  return vm.presets.map((p) => `
    <button type="button" class="btn-cm-preset ${p.isMax ? 'is-max' : ''} ${Math.abs(vm.dims.widthCm - p.cm) < 0.3 ? 'active' : ''}" data-cm="${p.cm}" title="Ancho de ${fmtCm(p.cm)} cm">
      ${p.isMax ? 'Máx' : `${p.label}<small>cm</small>`}
    </button>`).join('');
}

function tableHtml(vm) {
  return vm.table.map((r) => `
    <button type="button" class="size-cell ${r.id === vm.size.id ? 'active' : ''} ${r.reduced ? 'is-reduced' : ''}" data-size-id="${r.id}" role="listitem"
      title="${r.reduced ? `Se reduce de ${fmtCm(r.requestedWidthCm)} cm al máximo de la talla` : `Ver en talla ${r.label}`}">
      <span class="size-cell-label">${r.label}</span>
      <span class="size-cell-dim">${fmtCm(r.widthCm)}×${fmtCm(r.heightCm)}</span>
    </button>`).join('');
}

export function renderSizePanel(state, zoneId) {
  const vm = buildSizeViewModel(state, zoneId);
  if (!vm) return '';
  const { dims, range, mode } = vm;
  const isMug = state.selectedSilhouette === 'mug';
  return `
    <section class="size-panel" aria-label="Medida real de impresión">
      <div class="size-panel-head">
        <span class="card-eyebrow">MEDIDA REAL DE IMPRESIÓN</span>
        <div class="size-badge-cluster">
          <span class="size-badge" id="size-badge">${isMug ? 'Vaso 11 Oz' : `Talla ${vm.size.label}`}</span>
          <span class="dpi-badge ${vm.dpiQuality.badgeClass}" id="dpi-badge" title="${vm.dpiQuality.summary}">
            ${vm.dpiQuality.icon} <span id="dpi-badge-label">${vm.dpiQuality.label}</span>
          </span>
        </div>
      </div>

      <div class="size-readout">
        <div class="size-readout-main"><strong id="decal-cm-val">${fmtCm(dims.widthCm)} × ${fmtCm(dims.heightCm)}</strong><span class="size-unit">cm</span></div>
      </div>
      <div class="size-meter" id="size-meter" data-state="${meterState(dims)}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(dims.usage * 100)}">
        <span class="size-meter-fill" id="size-meter-fill" style="transform: scaleX(${dims.usage.toFixed(3)})"></span>
      </div>
      <p class="size-meter-text" id="size-meter-text">${meterText(dims)}</p>

      <div class="size-inputs">
        <div class="size-inputs-row">
          <div class="size-field">
            <label for="width-cm-input">Ancho</label>
            <div class="size-input-wrap">
              <button type="button" class="btn-step" data-axis="w" data-step="-0.5" aria-label="Reducir ancho 0,5 cm">−</button>
              <input type="number" id="width-cm-input" inputmode="decimal" step="0.5" min="${range.min}" max="${range.max}" value="${fmtCm(dims.widthCm)}" />
              <button type="button" class="btn-step" data-axis="w" data-step="0.5" aria-label="Aumentar ancho 0,5 cm">+</button>
            </div>
          </div>
          <button type="button" class="btn-lock-aspect ${vm.isLocked ? 'is-locked' : 'is-unlocked'}" id="btn-lock-aspect"
            title="${vm.isLocked ? 'Proporción vinculada (clic para desbloquear y estirar libremente)' : 'Proporción libre (clic para vincular)'}"
            aria-label="${vm.isLocked ? 'Desbloquear proporción' : 'Vincular proporción'}">
            ${vm.isLocked ? '🔗' : '🔓'}
          </button>
          <div class="size-field">
            <label for="height-cm-input">Alto</label>
            <div class="size-input-wrap">
              <button type="button" class="btn-step" data-axis="h" data-step="-0.5" aria-label="Reducir alto 0,5 cm">−</button>
              <input type="number" id="height-cm-input" inputmode="decimal" step="0.5" min="${vm.heightRange.min}" max="${vm.heightRange.max}" value="${fmtCm(dims.heightCm)}" />
              <button type="button" class="btn-step" data-axis="h" data-step="0.5" aria-label="Aumentar alto 0,5 cm">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="size-sliders">
        <div class="slider-field" id="width-slider-field">
          <div class="slider-field-head">
            <span id="width-slider-label">${vm.isLocked ? 'Escala (proporcional)' : 'Barra de Ancho'}</span>
            <span class="slider-field-val" id="width-slider-val">${fmtCm(dims.widthCm)} cm</span>
          </div>
          <input type="range" id="width-cm-slider" class="range-slider" min="${range.min}" max="${range.max}" step="0.1" value="${dims.widthCm}" aria-label="Ancho del estampado en centímetros" />
        </div>

        <div class="slider-field ${vm.isLocked ? 'is-hidden' : ''}" id="height-slider-field">
          <div class="slider-field-head">
            <span>Barra de Alto</span>
            <span class="slider-field-val" id="height-slider-val">${fmtCm(dims.heightCm)} cm</span>
          </div>
          <input type="range" id="height-cm-slider" class="range-slider" min="${vm.heightRange.min}" max="${vm.heightRange.max}" step="0.1" value="${dims.heightCm}" aria-label="Alto del estampado en centímetros" />
        </div>
      </div>
      <div class="size-presets" id="size-presets">${presetsHtml(vm)}</div>

      ${!isMug ? `
        <div class="size-mode" role="radiogroup" aria-label="Cómo escalar el estampado entre tallas">
          <button type="button" class="size-mode-btn ${mode === SIZE_MODES.FIXED ? 'active' : ''}" data-mode="${SIZE_MODES.FIXED}" role="radio" aria-checked="${mode === SIZE_MODES.FIXED}">📏 Medida fija</button>
          <button type="button" class="size-mode-btn ${mode === SIZE_MODES.PROPORTIONAL ? 'active' : ''}" data-mode="${SIZE_MODES.PROPORTIONAL}" role="radio" aria-checked="${mode === SIZE_MODES.PROPORTIONAL}">↔ Proporcional</button>
        </div>
        <p class="size-mode-hint" id="size-mode-hint">${MODE_HINTS[mode]}</p>

        <div class="size-table-head">
          <span>Tu diseño en cada talla</span>
          <small>ancho × alto (cm)</small>
        </div>
        <div class="size-table" id="size-table" role="list">
          ${tableHtml(vm)}
        </div>
      ` : ''}
    </section>`;
}

/**
 * Actualiza el panel sin recrearlo. `force` también reescribe los inputs enfocados
 * (se usa al confirmar un valor tecleado para mostrar el valor realmente aplicado).
 */
export function refreshSizePanel(root, state, zoneId, force = false) {
  const vm = buildSizeViewModel(state, zoneId);
  const panel = root.querySelector('.size-panel');
  if (!vm || !panel) return;
  const { dims, range } = vm;
  const isMug = state.selectedSilhouette === 'mug';
  const q = (sel) => panel.querySelector(sel);
  const editable = (el) => el && (force || document.activeElement !== el);

  q('#decal-cm-val').textContent = `${fmtCm(dims.widthCm)} × ${fmtCm(dims.heightCm)}`;
  const sizeBadge = q('#size-badge');
  if (sizeBadge) sizeBadge.textContent = isMug ? 'Vaso 11 Oz' : `Talla ${vm.size.label}`;

  const dpiBadge = q('#dpi-badge');
  if (dpiBadge) {
    dpiBadge.className = `dpi-badge ${vm.dpiQuality.badgeClass}`;
    dpiBadge.title = vm.dpiQuality.summary;
    const dpiLbl = q('#dpi-badge-label');
    if (dpiLbl) dpiLbl.textContent = vm.dpiQuality.label;
  }

  const meter = q('#size-meter');
  meter.dataset.state = meterState(dims);
  meter.setAttribute('aria-valuenow', Math.round(dims.usage * 100));
  q('#size-meter-fill').style.transform = `scaleX(${dims.usage.toFixed(3)})`;
  q('#size-meter-text').textContent = meterText(dims);

  const lockBtn = q('#btn-lock-aspect');
  if (lockBtn) {
    lockBtn.className = `btn-lock-aspect ${vm.isLocked ? 'is-locked' : 'is-unlocked'}`;
    lockBtn.textContent = vm.isLocked ? '🔗' : '🔓';
    lockBtn.title = vm.isLocked
      ? 'Proporción vinculada (clic para desbloquear y poner medidas libres)'
      : 'Proporción libre (clic para vincular)';
  }

  const wSliderLabel = q('#width-slider-label');
  if (wSliderLabel) {
    wSliderLabel.textContent = vm.isLocked ? 'Escala (proporcional)' : 'Barra de Ancho';
  }
  const hSliderField = q('#height-slider-field');
  if (hSliderField) {
    hSliderField.classList.toggle('is-hidden', vm.isLocked);
  }

  const wIn = q('#width-cm-input');
  const hIn = q('#height-cm-input');
  const wSlider = q('#width-cm-slider');
  const hSlider = q('#height-cm-slider');

  wIn.min = range.min; wIn.max = range.max;
  hIn.min = vm.heightRange.min; hIn.max = vm.heightRange.max;
  wSlider.min = range.min; wSlider.max = range.max;
  if (hSlider) {
    hSlider.min = vm.heightRange.min;
    hSlider.max = vm.heightRange.max;
    if (editable(hSlider)) hSlider.value = dims.heightCm;
  }

  if (editable(wIn)) wIn.value = fmtCm(dims.widthCm);
  if (editable(hIn)) hIn.value = fmtCm(dims.heightCm);
  if (editable(wSlider)) wSlider.value = dims.widthCm;

  const wSliderVal = q('#width-slider-val');
  if (wSliderVal) wSliderVal.textContent = `${fmtCm(dims.widthCm)} cm`;
  const hSliderVal = q('#height-slider-val');
  if (hSliderVal) hSliderVal.textContent = `${fmtCm(dims.heightCm)} cm`;

  setHtml(q('#size-presets'), presetsHtml(vm));
  const tableEl = q('#size-table');
  if (tableEl) setHtml(tableEl, tableHtml(vm));
  const modeHintEl = q('#size-mode-hint');
  if (modeHintEl) modeHintEl.textContent = MODE_HINTS[vm.mode];
  panel.querySelectorAll('.size-mode-btn').forEach((b) => {
    const on = b.dataset.mode === vm.mode;
    b.classList.toggle('active', on);
    b.setAttribute('aria-checked', String(on));
  });
}
