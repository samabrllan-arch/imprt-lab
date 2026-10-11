import { TouchLoupe } from './imageEditorTouchLoupe.js';
import { ZOOM_RANGE } from './imageEditorViewport.js';

/**
 * Edición táctil del editor (NODE-010): resuelve que el dedo tape lo que se borra y que un toque borre a ciegas.
 *   · Modo ✏️ Editar (varita/goma): un dedo APUNTA. Con la varita aparece la lupa 66 px sobre el dedo y la zona roja de lo que
 *     se borraría; al soltar queda la vista previa con ✓ Borrar / ✕ (nada se borra sin confirmar). La goma dibuja bajo el dedo
 *     con la lupa encima.
 *   · Modo 🖐️ Mover: un dedo desplaza el lienzo sin riesgo de borrar.
 *   · Dos dedos (en cualquier modo): pellizco = zoom y desplazamiento a la vez; cancelan el gesto de edición en curso.
 * Solo atiende `pointerType === 'touch'`; ratón y lápiz siguen el flujo de imageEditorTools.js.
 */
const PEN_DELAY = 90;     // ms de espera antes de empezar un trazo de goma (da tiempo a que llegue el segundo dedo)
const SLOP = 5;           // px de desplazamiento que convierten un toque en trazo
const HOVER_MS = 50;      // el flood-fill de la vista previa se agrupa cada ~50 ms; la lupa sigue al dedo a 60 FPS
const EDIT_LABEL = { wand: '🪄 Varita', brush: '🧹 Goma', crop: '✂️ Recorte' };

/** @param {object} ed contexto del editor @param {{eraseWandAt: Function}} tools */
export function initEditorTouch(ed, tools) {
  const { q, engine, viewport, viewportEl, hover, updateStatus } = ed;
  const loupe = new TouchLoupe(viewportEl, engine, viewport, hover);
  const btnMove = q('#btn-touch-move'), btnEdit = q('#btn-touch-edit');
  const pts = new Map();               // pointerId → { x, y }
  let mode = 'edit';                   // 'edit' | 'move'
  let gesture = null;                  // 'aim' | 'brush-wait' | 'brush' | 'pan' | 'pinch' | 'ignore'
  let brushTimer = 0, down = null, pan = null, pinch = null, pending = null;
  let hoverTimer = 0, hoverAt = 0, hoverPt = null;   // throttle (con cola final) de hover.move

  const bar = document.createElement('div');
  bar.className = 'touch-confirm-bar';
  bar.hidden = true;
  bar.innerHTML = '<button type="button" class="touch-confirm-ok">✓ Borrar</button><button type="button" class="touch-confirm-cancel" aria-label="Cancelar">✕</button>';
  viewportEl.appendChild(bar);

  const hideConfirm = () => { pending = null; bar.hidden = true; };
  hover.onPaint = () => loupe.refresh();
  hover.onClear = hideConfirm;          // cambiar de herramienta, pestaña o sensibilidad descarta la vista previa

  const bgTab = () => ed.getTab() === 'bg';
  const tool = () => engine.activeTool;
  const canEdit = () => tool() === 'wand' || tool() === 'brush';
  const coords = (p) => viewport.getCanvasCoords({ clientX: p.x, clientY: p.y });
  const evPt = (e) => ({ x: e.clientX, y: e.clientY });

  function setMode(next) {
    mode = next;
    btnMove?.classList.toggle('active', mode === 'move');
    btnEdit?.classList.toggle('active', mode === 'edit');
    viewportEl.dataset.touchMode = mode;
    cancelSingle();
    hideConfirm();
    hover.clear();
  }
  btnMove?.addEventListener('click', () => setMode('move'));
  btnEdit?.addEventListener('click', () => setMode('edit'));

  /** La etiqueta del botón de edición sigue a la herramienta activa. */
  const syncLabel = () => {
    if (btnEdit) btnEdit.textContent = EDIT_LABEL[tool()] || '✏️ Editar';
    cancelSingle();
  };
  new MutationObserver(syncLabel).observe(viewportEl, { attributes: true, attributeFilter: ['data-active-tool'] });

  /** Cancela un gesto de un dedo (apuntar o trazo) sin tocar lo ya pintado. */
  function cancelSingle() {
    clearTimeout(brushTimer);
    stopHover();
    if (gesture === 'brush') { engine.brush.end(); updateStatus(); }
    if (gesture === 'aim') hover.clear();
    loupe.hide();
    if (gesture !== 'pinch') gesture = null;
  }

  const fireHover = () => {
    hoverTimer = 0;
    hoverAt = performance.now();
    if (hoverPt) hover.move({ clientX: hoverPt.x, clientY: hoverPt.y });
  };
  const stopHover = () => { clearTimeout(hoverTimer); hoverTimer = 0; hoverPt = null; };

  /** La lupa se coloca en cada movimiento (barato); el cálculo caro de la zona roja se limita a una vez cada HOVER_MS. */
  function aim(p) {
    loupe.show(p.x, p.y);
    hoverPt = p;
    const wait = HOVER_MS - (performance.now() - hoverAt);
    if (wait <= 0) { clearTimeout(hoverTimer); fireHover(); }
    else if (!hoverTimer) hoverTimer = setTimeout(fireHover, wait);
  }

  function beginBrush(p) {
    if (gesture !== 'brush-wait') return;
    gesture = 'brush';
    const c = coords(p);
    engine.brush.start(c.x, c.y);
    loupe.show(p.x, p.y);
    updateStatus('🧹 Borrando · la lupa muestra el área bajo tu dedo');
  }

  function startPinch() {
    cancelSingle();
    viewport.stopAnimation();
    const [a, b] = [...pts.values()];
    const r = viewportEl.getBoundingClientRect();
    gesture = 'pinch';
    pinch = {
      d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: viewport.zoom, px0: viewport.panX, py0: viewport.panY,
      cx0: (a.x + b.x) / 2 - r.left - r.width / 2, cy0: (a.y + b.y) / 2 - r.top - r.height / 2
    };
  }

  function movePinch() {
    const [a, b] = [...pts.values()];
    const r = viewportEl.getBoundingClientRect();
    const z = Math.min(ZOOM_RANGE[1], Math.max(ZOOM_RANGE[0], pinch.z0 * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d0)));
    const cx = (a.x + b.x) / 2 - r.left - r.width / 2, cy = (a.y + b.y) / 2 - r.top - r.height / 2;
    // El punto del lienzo que había bajo el centro inicial sigue bajo el centro actual
    viewport.moveTo(z, cx - z * ((pinch.cx0 - pinch.px0) / pinch.z0), cy - z * ((pinch.cy0 - pinch.py0) / pinch.z0), true);
  }

  viewportEl.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || !ed.isOpen() || !bgTab() || e.target.closest('.touch-confirm-bar')) return;
    ed.backdrop.classList.add('has-touch');          // en equipos híbridos, el interruptor aparece con el primer toque
    viewportEl.setPointerCapture?.(e.pointerId);
    pts.set(e.pointerId, evPt(e));
    if (pts.size >= 2) { startPinch(); return; }
    if (tool() === 'crop') { gesture = 'ignore'; return; } // el recorte maneja sus propios gestos
    hideConfirm();
    const p = evPt(e);
    down = p;
    if (mode === 'move' || !canEdit()) {
      gesture = 'pan';
      viewport.stopAnimation();
      pan = { x: p.x - viewport.panX, y: p.y - viewport.panY };
    } else if (tool() === 'wand') {
      gesture = 'aim';
      aim(p);
      updateStatus('👆 Apunta con la lupa · suelta y pulsa ✓ Borrar');
    } else {
      gesture = 'brush-wait';
      brushTimer = setTimeout(() => beginBrush(pts.values().next().value || p), PEN_DELAY);
    }
  });

  viewportEl.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'touch' || !pts.has(e.pointerId)) return;
    const p = evPt(e);
    pts.set(e.pointerId, p);
    if (gesture === 'pinch') movePinch();
    else if (gesture === 'pan') viewport.moveTo(viewport.zoom, p.x - pan.x, p.y - pan.y, true);
    else if (gesture === 'aim') aim(p);
    else if (gesture === 'brush-wait' && Math.hypot(p.x - down.x, p.y - down.y) > SLOP) { clearTimeout(brushTimer); beginBrush(p); }
    else if (gesture === 'brush') {
      for (const ev of (e.getCoalescedEvents?.() || [e])) { const c = coords(evPt(ev)); engine.brush.to(c.x, c.y); }
      loupe.show(p.x, p.y);
    }
  });

  function release(e) {
    if (e.pointerType !== 'touch' || !pts.has(e.pointerId)) return;
    const last = pts.get(e.pointerId);
    pts.delete(e.pointerId);
    if (gesture === 'pinch') { if (pts.size < 2) gesture = pts.size ? 'ignore' : null; return; }
    if (pts.size) return;
    const g = gesture;
    gesture = null;
    clearTimeout(brushTimer);
    loupe.hide();
    if (g === 'aim') {
      stopHover();
      if (e.type !== 'pointercancel') hover.flush({ clientX: last.x, clientY: last.y }); // la vista previa final = el punto donde se soltó
      if (e.type === 'pointercancel' || hover.overlay.style.opacity !== '1') { hover.clear(); updateStatus(); return; }
      const c = coords(last);
      pending = { x: c.x, y: c.y };
      bar.hidden = false;
      updateStatus('Vista previa en rojo · ✓ Borrar para confirmar');
    } else if (g === 'brush-wait') {            // toque rápido: un punto de goma
      const c = coords(last);
      engine.brush.start(c.x, c.y); engine.brush.end(); updateStatus();
    } else if (g === 'brush') { engine.brush.end(); updateStatus(); }
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  bar.querySelector('.touch-confirm-ok').addEventListener('click', () => {
    const at = pending;
    hideConfirm();
    hover.clear();
    if (at) tools.eraseWandAt(at.x, at.y);
  });
  bar.querySelector('.touch-confirm-cancel').addEventListener('click', () => { hover.clear(); updateStatus(); });

  return {
    /** Cierre del editor: suelta cualquier gesto, la lupa y la confirmación pendiente. */
    reset() { pts.clear(); cancelSingle(); gesture = null; hideConfirm(); hover.clear(); setMode('edit'); }
  };
}
