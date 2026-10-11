import { showToast } from './toast.js';
import { ImageEditorCrop } from './imageEditorCrop.js';
import { paint } from './rangeFill.js';

/**
 * Herramientas del editor (NODE-010): 1 clic, varita (vista previa roja al pasar el cursor), goma (anillo real y
 * trazos coalescidos), recorte libre (recuadro/lazo con guías de tercios), sensibilidad y eventos del lienzo.
 * Extraído de imageEditorModal.js para respetar el límite de 300 líneas.
 *
 * @param {object} ed contexto compartido: { q, engine, viewport, canvas, viewportEl, hover, updateStatus, isOpen, getTab, backdrop }
 */
export function initEditorTools(ed) {
  const { q, engine, viewport, canvas, viewportEl, hover, updateStatus, isOpen, backdrop } = ed;
  const btnWand = q('#btn-tool-wand'), btnBrush = q('#btn-tool-brush'), btnCrop = q('#btn-tool-crop');
  const wandPanel = q('#wand-options-panel'), brushPanel = q('#brush-options-panel'), cropPanel = q('#crop-options-panel');
  const btnApplyCrop = q('#btn-apply-crop'), btnCancelCrop = q('#btn-cancel-crop');
  const btnCropModeRect = q('#btn-crop-mode-rect'), btnCropModeLasso = q('#btn-crop-mode-lasso');
  const cropModeHint = q('#crop-mode-hint'), btnCropAutoTrim = q('#btn-crop-autotrim');
  const btnConnected = q('#btn-mode-connected'), btnGlobal = q('#btn-mode-global'), btnViewportWand = q('#btn-mode-viewport'), btnCleanScreen = q('#btn-clean-screen-border');
  const tolSlider = q('#tolerance-slider'), tolVal = q('#tol-val');
  const brushSlider = q('#brush-size-slider'), brushVal = q('#brush-size-val');
  let isBrushing = false;
  let wandScope = 'connected'; // 'connected' | 'global' | 'viewport'

  const crop = new ImageEditorCrop(
    engine,
    viewport,
    backdrop.querySelector('#editor-canvas-wrap'),
    (valid) => { if (btnApplyCrop) btnApplyCrop.disabled = !valid; }
  );

  const CROP_HINTS = {
    rect: 'Arrastra un recuadro sobre la imagen para seleccionar el área deseada.',
    lasso: 'Dibuja a mano alzada rodeando el elemento que deseas aislar.'
  };
  const setCropMode = (mode) => {
    crop.setMode(mode);
    btnCropModeRect?.classList.toggle('active', mode === 'rect');
    btnCropModeLasso?.classList.toggle('active', mode === 'lasso');
    if (cropModeHint) cropModeHint.textContent = CROP_HINTS[mode];
  };
  btnCropModeRect?.addEventListener('click', () => setCropMode('rect'));
  btnCropModeLasso?.addEventListener('click', () => setCropMode('lasso'));

  btnCropAutoTrim?.addEventListener('click', () => {
    crop.autoTrim();
    updateStatus('📐 Lienzo ajustado sin sobrantes');
    showToast('¡Lienzo ajustado al dibujo sin sobrantes!', 'success');
  });

  btnCleanScreen?.addEventListener('click', () => {
    const bounds = viewport.getVisibleCanvasRect();
    const res = engine.cleanVisibleEdges(bounds);
    if (res && res.modified) {
      updateStatus(`🧹 Limpiados ${res.cleanedCount} px de borde`);
      showToast(`¡Borde limpiado en pantalla! (${res.cleanedCount} px)`, 'success');
    } else {
      showToast('No se detectaron bordes oscuros en este encuadre', 'info');
    }
  });

  const toolUi = { wand: [btnWand, wandPanel], brush: [btnBrush, brushPanel], crop: [btnCrop, cropPanel] };
  function setActiveTool(tool) {
    engine.activeTool = tool;
    viewportEl.setAttribute('data-active-tool', tool);
    for (const [name, [btn, panel]] of Object.entries(toolUi)) {
      btn?.classList.toggle('active', tool === name);
      if (panel) panel.style.display = tool === name ? 'block' : 'none';
    }
    crop.setActive(tool === 'crop');
    viewport.hideRing();
    hover.clear();
  }
  Object.entries(toolUi).forEach(([name, [btn]]) => btn?.addEventListener('click', () => setActiveTool(name)));

  btnApplyCrop?.addEventListener('click', () => {
    if (crop.apply()) {
      updateStatus('✂️ Recorte libre aplicado');
      viewport.zoomFit();
      setActiveTool('wand');
      showToast('¡Arte aislado con éxito!', 'success');
    }
  });

  btnCancelCrop?.addEventListener('click', () => {
    crop.clear();
    setActiveTool('wand');
  });

  // --- Goma: grosor y presets ---
  const setBrushSize = (size) => {
    engine.brush.radius = size;
    if (brushSlider) {
      brushSlider.value = size;
      paint(brushSlider);
    }
    if (brushVal) brushVal.textContent = `${size}px`;
  };
  brushSlider?.addEventListener('input', (e) => setBrushSize(parseInt(e.target.value, 10)));
  ed.backdrop.querySelectorAll('.btn-brush-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      ed.backdrop.querySelectorAll('.btn-brush-preset').forEach(b => b.classList.toggle('active', b === btn));
      setBrushSize(parseInt(btn.getAttribute('data-brush-size'), 10));
    });
  });

  // --- Sensibilidad: ajusta la tolerancia del motor y refresca la varita ---
  let tolFrame = 0;
  tolSlider?.addEventListener('input', (e) => {
    engine.settings.tolerance = parseInt(e.target.value, 10);
    if (tolVal) tolVal.textContent = `${engine.settings.tolerance}%`;
    hover.clear();
    if (engine.lastAction) {
      if (tolFrame) return;
      tolFrame = requestAnimationFrame(() => {
        tolFrame = 0;
        if (engine.previewAction()) updateStatus('Vista previa • suelta para afinar a calidad completa');
      });
    }
  });
  tolSlider?.addEventListener('change', () => {
    if (tolFrame) { cancelAnimationFrame(tolFrame); tolFrame = 0; }
    if (engine.lastAction) {
      engine.rerunLastAction();
      updateStatus();
    }
  });

  // --- Alcance de la varita: zona tocada / todo el color / solo en pantalla visible ---
  const setWandScope = (scope) => {
    wandScope = scope;
    const isContiguous = (scope !== 'global');
    engine.settings.contiguous = isContiguous;
    btnConnected?.classList.toggle('active', scope === 'connected');
    btnGlobal?.classList.toggle('active', scope === 'global');
    btnViewportWand?.classList.toggle('active', scope === 'viewport');
    hover.clear();
    if (engine.lastAction?.type === 'pixel') {
      engine.lastAction.contiguous = isContiguous;
      engine.lastAction.bounds = (scope === 'viewport') ? viewport.getVisibleCanvasRect() : null;
      engine.rerunLastAction();
      updateStatus();
    }
  };
  Object.entries({ connected: btnConnected, global: btnGlobal, viewport: btnViewportWand })
    .forEach(([scope, btn]) => btn?.addEventListener('click', () => setWandScope(scope)));

  // --- Interacción en el lienzo ---
  /** Borra con la varita en (x, y) del lienzo respetando el alcance elegido (zona, todo el color o solo lo visible). */
  const eraseWandAt = (x, y) => {
    const bounds = (wandScope === 'viewport') ? viewport.getVisibleCanvasRect() : null;
    if (engine.eraseAtPixel(x, y, { bounds }).success) updateStatus();
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // el dedo apunta antes de borrar: imageEditorTouch.js
    if (!isOpen() || ed.getTab() !== 'bg' || viewport.shouldPan(e) || engine.activeTool === 'crop') return;
    const { x, y } = viewport.getCanvasCoords(e);
    if (engine.activeTool === 'brush') {
      isBrushing = true;
      engine.brush.start(x, y);
    } else if (engine.activeTool === 'wand') {
      hover.clear();
      eraseWandAt(x, y);
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!isOpen() || e.pointerType === 'touch') return;
    viewport.updateRing(e, engine.brush.radius);
    if (isBrushing && engine.activeTool === 'brush') {
      // getCoalescedEvents recupera los puntos intermedios del ratón: trazos continuos y sin saltos
      const evs = e.getCoalescedEvents?.() ?? [];
      for (const ev of evs.length ? evs : [e]) {
        const { x, y } = viewport.getCanvasCoords(ev);
        engine.brush.to(x, y);
      }
    } else if (!viewport.isPanning && !viewport.isSpacePressed && engine.activeTool === 'wand') {
      hover.move(e);
    }
  });

  const stopBrush = () => {
    if (!isBrushing) return;
    isBrushing = false;
    engine.brush.end();
    updateStatus();
  };
  ['pointerup', 'pointercancel'].forEach((ev) => window.addEventListener(ev, stopBrush));
  viewportEl.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return; // al soltar el dedo la vista previa debe quedarse hasta confirmar
    viewport.hideRing(); hover.clear();
  });

  // --- Botones principales: recorte HD con estado "ocupado" para que el clic responda al instante ---
  function runHeavy(btn, job) {
    btn.classList.add('is-busy');
    updateStatus('⏳ Procesando…');
    requestAnimationFrame(() => setTimeout(() => { try { job(); } finally { btn.classList.remove('is-busy'); } }, 0));
  }

  const btnAuto = q('#btn-hero-auto');
  btnAuto?.addEventListener('click', () => runHeavy(btnAuto, () => {
    const res = engine.autoErase();
    if (res.transparent) { updateStatus('El fondo ya es transparente'); return; }
    updateStatus('✨ Fondo removido • borde afinado 1 px, sin halos');
    showToast('¡Fondo eliminado con borde limpio!', 'success');
  }));

  return {
    setActiveTool,
    eraseWandAt,
    stopBrush: () => { isBrushing = false; engine.brush.end(); },
    /** Imagen nueva: sensibilidad, modo de la varita y grosor de la goma vuelven a sus valores iniciales. */
    resetControls() {
      engine.settings.tolerance = 30;
      if (tolSlider) {
        tolSlider.value = 30;
        paint(tolSlider);
      }
      if (tolVal) tolVal.textContent = '30%';
      setWandScope('connected');
      setBrushSize(20);
      ed.backdrop.querySelectorAll('.btn-brush-preset').forEach(b => b.classList.toggle('active', b.dataset.brushSize === '20'));
      setCropMode('rect');
      crop.clear();
    }
  };
}
