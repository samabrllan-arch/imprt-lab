import { updateDecalTransform, toggleLockAspect, setSizeMode, setSize } from '../state/actions.js';
import { SIZES } from '../config/colors.js';
import { store } from '../state/store.js';
import { getImageAspect } from '../config/printSizing.js';
import { refreshSizePanel } from './decalSizeView.js';
import { showToast } from './toast.js';

/**
 * Eventos del panel de medida real. Usa delegación sobre `.size-panel`, de modo que
 * los atajos y la tabla (que se refrescan in-place) nunca pierden sus listeners.
 */
export function bindSizePanel(wrapper, zoneId) {
  const panel = wrapper.querySelector('.size-panel');
  if (!panel) return;

  const widthIn = panel.querySelector('#width-cm-input');
  const heightIn = panel.querySelector('#height-cm-input');
  const widthSlider = panel.querySelector('#width-cm-slider');
  const heightSlider = panel.querySelector('#height-cm-slider');

  const current = () => store.getState().customizations[zoneId];
  const aspect = () => (current()?.customAspect || getImageAspect(current()?.imageElement));
  const isLocked = () => (current()?.lockAspect !== false);
  const currentWidth = () => parseFloat(widthIn.value) || 0;
  const currentHeight = () => parseFloat(heightIn.value) || 0;

  const applyWidth = (cm) => {
    if (isLocked()) {
      updateDecalTransform(zoneId, { widthCm: cm });
    } else {
      updateDecalTransform(zoneId, { widthCm: cm, heightCm: currentHeight() });
    }
  };

  const applyHeight = (cm) => {
    if (isLocked()) {
      applyWidth(cm * aspect());
    } else {
      updateDecalTransform(zoneId, { heightCm: cm, widthCm: currentWidth() });
    }
  };

  const confirmValue = () => refreshSizePanel(wrapper, store.getState(), zoneId, true);

  widthSlider?.addEventListener('input', () => applyWidth(parseFloat(widthSlider.value)));
  heightSlider?.addEventListener('input', () => applyHeight(parseFloat(heightSlider.value)));

  // Mientras se teclea solo se aplica un valor ya válido (evita saltos por valores parciales)
  widthIn.addEventListener('input', () => {
    const v = parseFloat(widthIn.value);
    if (v >= parseFloat(widthIn.min) && v <= parseFloat(widthIn.max)) applyWidth(v);
  });
  heightIn.addEventListener('input', () => {
    const v = parseFloat(heightIn.value);
    const min = parseFloat(heightIn.min) || 4;
    const max = parseFloat(heightIn.max) || 60;
    if (v >= min && v <= max) applyHeight(v);
  });
  [widthIn, heightIn].forEach((input, i) => {
    input.addEventListener('change', () => {
      const v = parseFloat(input.value);
      if (v > 0) (i === 0 ? applyWidth : applyHeight)(v);
      confirmValue();
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
  });

  panel.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target || !panel.contains(target)) return;

    if (target.id === 'btn-lock-aspect' || target.closest('#btn-lock-aspect')) {
      toggleLockAspect(zoneId);
      const locked = current()?.lockAspect !== false;
      showToast(
        locked ? 'Proporción vinculada' : 'Proporción libre: ahora puedes modificar alto y ancho por separado',
        'info'
      );
      confirmValue();
      return;
    }

    if (target.classList.contains('btn-step')) {
      const step = parseFloat(target.dataset.step);
      const isH = target.dataset.axis === 'h';
      const cm = isH ? currentHeight() : currentWidth();
      (isH ? applyHeight : applyWidth)(cm + step);
    } else if (target.classList.contains('btn-cm-preset')) {
      applyWidth(parseFloat(target.dataset.cm));
    } else if (target.classList.contains('size-mode-btn')) {
      setSizeMode(target.dataset.mode);
    } else if (target.classList.contains('size-cell')) {
      const sizeId = target.dataset.sizeId;
      const found = SIZES.find((s) => s.id === sizeId);
      if (found) {
        setSize(found);
        showToast(`Visualizando en Talla ${found.label}`, 'info');
      }
    }
  });
}
