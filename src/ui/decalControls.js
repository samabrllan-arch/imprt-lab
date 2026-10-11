import { updateDecalTransform, removeDecal, setDecal } from '../state/actions.js';
import { store } from '../state/store.js';
import { ZONES } from '../config/zones.js';
import { DECAL_PRESETS, svgToDataUrl } from '../config/presets.js';
import { getDefaultScale } from '../config/printSizing.js';
import { showToast } from './toast.js';
import { initImageEditorModal } from './imageEditorModal.js';
import { renderEmptyZone, renderActivePanel } from './decalControlsView.js';
import { bindSizePanel } from './decalSizeControls.js';
import { refreshSizePanel } from './decalSizeView.js';
import { initRangeFill, paintRanges } from './rangeFill.js';

export function initDecalControls(container) {
  function render() {
    const state = store.getState();
    const zoneId = state.activeZone;
    const zoneConfig = ZONES[zoneId] || { name: 'Esta Zona' };
    const decal = state.customizations[zoneId];

    if (!decal || !decal.hasDecal) {
      container.innerHTML = renderEmptyZone(zoneConfig);
      bindEmptyEvents(container, zoneId);
      return;
    }

    container.innerHTML = renderActivePanel(decal, zoneConfig, state, zoneId);
    bindActiveEvents(container, zoneId);
    paintRanges(container);
  }

  function bindEmptyEvents(wrapper, zoneId) {
    const quickBtns = wrapper.querySelectorAll('.btn-quick-apply');
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-preset-id');
        const preset = DECAL_PRESETS.find(p => p.id === presetId);
        if (!preset) return;
        const src = preset.src || svgToDataUrl(preset.svg);
        const img = new Image();
        img.onload = () => {
          setDecal(zoneId, { name: preset.name, src, imageElement: img });
          showToast(`"${preset.name}" aplicado`, 'success');
        };
        img.src = src;
      });
    });
  }

  function bindActiveEvents(wrapper, zoneId) {
    const sliders = {
      rotation: wrapper.querySelector('#rot-slider'),
      offsetX: wrapper.querySelector('#posx-slider'),
      offsetY: wrapper.querySelector('#posy-slider')
    };

    bindSizePanel(wrapper, zoneId);

    wrapper.querySelector('#btn-edit-decal')?.addEventListener('click', () => {
      const activeDecal = store.getState().customizations[zoneId];
      if (!activeDecal || !activeDecal.imageElement) return;
      const editor = initImageEditorModal();
      editor.open(activeDecal.imageElement, activeDecal.name || 'estampado', (processedDataUrl, processedImg, finalName) => {
        setDecal(zoneId, { ...activeDecal, name: finalName, src: processedDataUrl, imageElement: processedImg });
        showToast('Fondo y filtros actualizados', 'success');
      });
    });

    // Los sliders solo envían la transformación; el store notifica y syncControls
    // refresca etiquetas y valores efectivamente aplicados (tras límites UV).
    Object.entries(sliders).forEach(([key, slider]) => {
      slider?.addEventListener('input', (e) => updateDecalTransform(zoneId, { [key]: parseFloat(e.target.value) }));
    });

    wrapper.querySelector('#btn-remove-decal')?.addEventListener('click', () => {
      removeDecal(zoneId);
      showToast('Estampado retirado', 'info');
    });

    wrapper.querySelector('#btn-recenter')?.addEventListener('click', () => {
      updateDecalTransform(zoneId, { offsetX: 0, offsetY: 0, rotation: 0, scale: getDefaultScale(zoneId) });
      showToast('Estampado centrado', 'success');
    });
  }

  /** Sincroniza in-place sliders y panel de medidas con el estado (sin recrear el DOM). */
  function syncControls(state) {
    const zoneId = state.activeZone;
    const decal = state.customizations[zoneId];
    if (!decal || !decal.hasDecal) return;

    const fields = [
      ['#rot-slider', '#rot-val', decal.rotation, (v) => `${Math.round(v)}°`],
      ['#posx-slider', '#posx-val', decal.offsetX, (v) => v.toFixed(2)],
      ['#posy-slider', '#posy-val', decal.offsetY, (v) => v.toFixed(2)]
    ];
    for (const [sliderSel, valSel, value, format] of fields) {
      const slider = container.querySelector(sliderSel);
      const label = container.querySelector(valSel);
      if (slider && document.activeElement !== slider) slider.value = value;
      if (label) label.textContent = format(value);
    }
    refreshSizePanel(container, state, zoneId);
    paintRanges(container);
  }

  initRangeFill();
  render();

  store.subscribe((state, changeKey) => {
    if (changeKey === 'activeZone' || (changeKey && changeKey.startsWith('decal:'))) {
      render();
    } else if (changeKey === 'size' || changeKey === 'sizeMode' || changeKey === `transform:${state.activeZone}`) {
      syncControls(state);
    }
  });
}
