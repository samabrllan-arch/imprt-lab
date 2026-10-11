/**
 * Relleno de progreso de los sliders (`--pct-ratio` y `--pct`) para que el track
 * muestre el valor actual con sincronización milimétrica respecto al centro del thumb.
 * Incluye listener delegado global en document para 'input' y 'change'.
 */
export function paint(range) {
  if (!range || typeof range.getAttribute !== 'function') return;
  const min = parseFloat(range.min !== '' ? range.min : 0);
  const max = parseFloat(range.max !== '' ? range.max : 100);
  const val = parseFloat(range.value !== '' ? range.value : 0);
  const span = (max - min) || 1;
  const pct = Math.min(Math.max(((val - min) / span) * 100, 0), 100);
  const ratio = (pct / 100).toFixed(4);
  range.style.setProperty('--pct', `${pct.toFixed(2)}%`);
  range.style.setProperty('--pct-ratio', ratio);
}

export function paintRanges(root = document) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('.range-slider').forEach(paint);
}

let initialized = false;
export function initRangeFill() {
  if (initialized) return;
  initialized = true;

  const onSliderEvent = (e) => {
    if (e.target instanceof HTMLInputElement && e.target.classList.contains('range-slider')) {
      paint(e.target);
    }
  };

  document.addEventListener('input', onSliderEvent, { passive: true });
  document.addEventListener('change', onSliderEvent, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => paintRanges(document));
  } else {
    paintRanges(document);
  }
}
