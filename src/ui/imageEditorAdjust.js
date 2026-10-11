import '../styles/imageEditorAdjust.css';
import { applyTonal, isNeutralTonal, NEUTRAL_TONAL } from '../services/imageTonal.js';
import { rotateCanvas, flipCanvas } from '../services/imageTransform.js';
import { applyStyleFilter, STYLE_FILTERS } from '../services/imageStyles.js';
import { paint } from './rangeFill.js';

const PREVIEW_EDGE = 900; // la vista previa se calcula sobre una copia reducida: sliders fluidos a 60 FPS
const FMT = { brightness: (v) => (v > 0 ? `+${v}` : `${v}`), contrast: (v) => (v > 0 ? `+${v}` : `${v}`), saturation: (v) => `${v}%`, sharpen: (v) => `${v}` };

/**
 * Pestaña "Ajustes" (NODE-010). Un solo cambio pendiente a la vez:
 *  - 'tonal'  brillo/contraste/saturación/nitidez: vista previa en un canvas superpuesto (copia reducida);
 *             "Aplicar" lo hornea a resolución completa como UN paso de deshacer.
 *  - 'rotate' giro libre: vista previa con transform CSS; "Aplicar" rota los píxeles y amplía el lienzo.
 * Los pendientes se aplican solos al cambiar de pestaña, usar otra herramienta o pulsar "Aplicar a Camiseta".
 */
export function initEditorAdjust(ed) {
  const { q, engine, canvas, wrap, viewport } = ed;
  const params = { ...NEUTRAL_TONAL };
  let pending = null; // 'tonal' | 'rotate' | null
  let angle = 0;
  let base = null;
  let raf = 0;

  const overlay = document.createElement('canvas');
  overlay.className = 'adjust-preview-overlay';
  wrap.appendChild(overlay);

  const el = (key) => q(`#adj-${key}`);
  const label = (key, text) => { const n = q(`#adj-${key}-val`); if (n) n.textContent = text; };
  const setEnabled = (ids, on) => ids.forEach((id) => { const b = q(id); if (b) b.disabled = !on; });

  function setPending(kind) {
    if (pending && pending !== kind) commitPending();
    pending = kind;
    setEnabled(['#adj-apply-tonal', '#adj-reset-tonal'], kind === 'tonal');
    setEnabled(['#adj-apply-rot'], kind === 'rotate');
  }

  // ── Tono y color ──────────────────────────────────────────────────────────
  function prepareBase() {
    if (base && base.revision === engine.revision) return base;
    const k = Math.min(1, PREVIEW_EDGE / Math.max(canvas.width, canvas.height));
    const small = document.createElement('canvas');
    small.width = Math.max(1, Math.round(canvas.width * k));
    small.height = Math.max(1, Math.round(canvas.height * k));
    const ctx = small.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, small.width, small.height);
    base = { revision: engine.revision, data: ctx.getImageData(0, 0, small.width, small.height) };
    return base;
  }

  function renderPreview() {
    raf = 0;
    const { data } = prepareBase();
    if (overlay.width !== data.width || overlay.height !== data.height) { overlay.width = data.width; overlay.height = data.height; }
    overlay.getContext('2d', { willReadFrequently: true }).putImageData(data, 0, 0);
    applyTonal(overlay, params);
    wrap.classList.add('is-adjust-preview');
  }

  function onTonalInput(key, value) {
    setPending('tonal');
    params[key] = value;
    label(key, FMT[key](value));
    if (isNeutralTonal(params)) { hidePreview(); setEnabled(['#adj-apply-tonal', '#adj-reset-tonal'], true); return; }
    if (!raf) raf = requestAnimationFrame(renderPreview);
  }

  function hidePreview() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    wrap.classList.remove('is-adjust-preview');
  }

  function resetSliders() {
    Object.assign(params, NEUTRAL_TONAL);
    for (const key of Object.keys(NEUTRAL_TONAL)) {
      const s = el(key);
      if (s) { s.value = NEUTRAL_TONAL[key]; paint(s); }
      label(key, FMT[key](NEUTRAL_TONAL[key]));
    }
    hidePreview();
  }

  // ── Giro libre ────────────────────────────────────────────────────────────
  function setAngle(deg) {
    angle = deg;
    canvas.style.transform = deg ? `rotate(${deg}deg)` : '';
    label('rotation', `${deg}°`);
    const s = el('rotation');
    if (s) { s.value = deg; paint(s); }
  }

  function bake(newCanvas) {
    engine.pushUndo();
    engine.lastAction = null;
    engine.commit(newCanvas.getContext('2d').getImageData(0, 0, newCanvas.width, newCanvas.height));
    viewport.zoomFit();
    ed.updateStatus();
  }

  function rotateNow(deg) {
    if (!deg) return;
    bake(rotateCanvas(canvas, deg));
    ed.updateStatus(`🔄 Girado ${deg}°`);
  }

  // ── Pendientes ────────────────────────────────────────────────────────────
  function commitPending() {
    const kind = pending;
    pending = null;
    setEnabled(['#adj-apply-tonal', '#adj-reset-tonal', '#adj-apply-rot'], false);
    if (kind === 'tonal') {
      if (!isNeutralTonal(params)) engine.drawOnto((ctx, c) => applyTonal(c, params));
      resetSliders();
      ed.updateStatus('🎚️ Ajustes de tono aplicados');
    } else if (kind === 'rotate') {
      const deg = angle;
      setAngle(0);
      rotateNow(deg);
    }
    return !!kind;
  }

  function cancelPending() {
    const kind = pending;
    pending = null;
    setEnabled(['#adj-apply-tonal', '#adj-reset-tonal', '#adj-apply-rot'], false);
    resetSliders();
    setAngle(0);
    return !!kind;
  }

  // ── Eventos ───────────────────────────────────────────────────────────────
  Object.keys(NEUTRAL_TONAL).forEach((key) => {
    el(key)?.addEventListener('input', (e) => onTonalInput(key, +e.target.value));
    q(`#adj-${key}-val`)?.addEventListener('dblclick', () => { const s = el(key); if (s) { s.value = NEUTRAL_TONAL[key]; paint(s); onTonalInput(key, NEUTRAL_TONAL[key]); } });
  });
  q('#adj-apply-tonal')?.addEventListener('click', commitPending);
  q('#adj-reset-tonal')?.addEventListener('click', cancelPending);

  el('rotation')?.addEventListener('input', (e) => {
    setPending('rotate');
    setAngle(+e.target.value);
    setEnabled(['#adj-apply-rot'], true);
  });
  q('#adj-rotation-val')?.addEventListener('dblclick', () => { setAngle(0); });
  q('#adj-apply-rot')?.addEventListener('click', commitPending);
  q('#adj-rot-ccw')?.addEventListener('click', () => { commitPending(); rotateNow(-90); });
  q('#adj-rot-cw')?.addEventListener('click', () => { commitPending(); rotateNow(90); });
  q('#adj-flip-x')?.addEventListener('click', () => { commitPending(); bake(flipCanvas(canvas, 'x')); ed.updateStatus('↔ Volteo horizontal'); });
  q('#adj-flip-y')?.addEventListener('click', () => { commitPending(); bake(flipCanvas(canvas, 'y')); ed.updateStatus('↕ Volteo vertical'); });
  q('#adj-go-crop')?.addEventListener('click', () => { commitPending(); ed.openCropTool?.(); });

  q('.adj-filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-style]');
    if (!btn || btn.classList.contains('is-busy')) return;
    commitPending();
    const def = STYLE_FILTERS.find((f) => f.id === btn.dataset.style);
    btn.classList.add('is-busy');
    ed.updateStatus('⏳ Procesando…');
    requestAnimationFrame(() => setTimeout(() => {
      try {
        engine.drawOnto((ctx, c) => applyStyleFilter(c, def.id));
        ed.updateStatus(`🎨 Filtro «${def.label}» aplicado`);
      } finally { btn.classList.remove('is-busy'); }
    }, 0));
  });

  return { commitPending, cancelPending, hasPending: () => !!pending, reset: () => { cancelPending(); } };
}
