import { ImageEditorEngine } from './imageEditorEngine.js';
import { ImageEditorViewport } from './imageEditorViewport.js';
import { getImageEditorTemplate } from './imageEditorTemplate.js';
import { WandHover } from './imageEditorWandHover.js';
import { TextLayer } from './imageEditorTextLayer.js';
import { initEditorTools } from './imageEditorTools.js';
import { initEditorTouch } from './imageEditorTouch.js';
import { createEditorTour } from './imageEditorTour.js';
import { initAiPromptPanel } from './editorAiPromptPanel.js';
import { paintRanges } from './rangeFill.js';
import { initEditorAdjust } from './imageEditorAdjust.js';
import { createDpiBadge } from './imageEditorDpiBadge.js';
import { initEditorSaveActions } from './imageEditorSaveActions.js';
import { clampToPrintDpi, describeClamp } from '../services/dpiClamp.js';
import { computeEffectiveDpi } from '../services/printResolution.js';
import { showToast } from './toast.js';
import { store } from '../state/store.js';

/**
 * Ventana "Estudio de Tratamiento de Imagen" (NODE-010). Este archivo solo ENSAMBLA los módulos:
 *   Engine (píxeles + deshacer) · Viewport (zoom/encuadre) · Tools (1 clic, croma, varita, goma)
 *   WandHover (vista previa de la varita) · TextLayer (textos y arco) · Adjust (tono, giro, filtros)
 *   DpiBadge (telemetría 300 DPI) · Tour (guía de pasos) · Touch (lupa y modo Mover) · SaveActions (reemplazar, copia y descarga).
 */
let modalInstance = null;

export function initImageEditorModal() {
  if (modalInstance) return modalInstance;
  const backdrop = document.createElement('div');
  backdrop.className = 'image-editor-modal-backdrop';
  backdrop.id = 'image-editor-backdrop';
  backdrop.innerHTML = getImageEditorTemplate();
  document.body.appendChild(backdrop);
  modalInstance = setupEditorLogic(backdrop);
  return modalInstance;
}

function setupEditorLogic(backdrop) {
  const q = sel => backdrop.querySelector(sel);
  const canvas = q('#editor-canvas'), wrap = q('#editor-canvas-wrap'), viewportEl = q('#editor-viewport');
  const metaBadge = q('#editor-meta-badge'), btnUndo = q('#btn-undo-step'), undoCounter = q('#undo-counter');
  const btnBgShirt = q('#btn-bg-shirt'), btnBgCheckers = q('#btn-bg-checkers');

  // Contexto compartido entre módulos
  const ed = { backdrop, q, canvas, wrap, viewportEl, tab: 'bg' };
  ed.getTab = () => ed.tab;
  ed.isOpen = () => backdrop.classList.contains('open');
  ed.engine = new ImageEditorEngine(canvas, { maxUndo: 15 });
  ed.viewport = new ImageEditorViewport(viewportEl, wrap, canvas, q('#brush-cursor-ring'), q('#zoom-level-badge'), {
    getActiveTool: () => (ed.tab === 'text' ? 'text' : ed.engine.activeTool)
  });
  const { engine, viewport } = ed;

  ed.updateStatus = (customText = null) => {
    const count = engine.getUndoCount();
    if (btnUndo) btnUndo.disabled = count === 0;
    if (undoCounter) undoCounter.textContent = count;
    metaBadge.textContent = customText || `${canvas.width} × ${canvas.height} px • ${count} retoques`;
    ed.dpiBadge?.update();
  };
  const { updateStatus } = ed;

  ed.hover = new WandHover(engine, viewport, wrap, () => ed.tab === 'bg');
  ed.textLayer = new TextLayer(ed);
  const tools = initEditorTools(ed);
  ed.touch = initEditorTouch(ed, tools); // dedo: lupa, vista previa de la varita y modo Mover (celular)
  const aiPanel = initAiPromptPanel(backdrop);
  ed.openCropTool = () => { switchTab('bg'); tools.setActiveTool('crop'); };
  const adjust = initEditorAdjust(ed);
  ed.dpiBadge = createDpiBadge(ed);

  // --- Pestañas de la columna derecha ---
  function switchTab(tab) {
    if (ed.tab === 'adjust' && tab !== 'adjust') adjust.commitPending(); // lo que se ve en la vista previa se aplica
    ed.tab = tab;
    backdrop.querySelectorAll('.editor-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    backdrop.querySelectorAll('.editor-tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
    viewportEl.setAttribute('data-tab', tab);
    ed.textLayer.setActive(tab === 'text');
    viewport.hideRing();
    ed.hover.clear();
    paintRanges(backdrop);
  }
  backdrop.querySelectorAll('.editor-tab').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

  const tour = createEditorTour({ backdrop, switchTab });
  q('#btn-editor-tour')?.addEventListener('click', () => tour.start());

  // --- Zoom y fondo de vista previa ---
  q('#btn-zoom-in')?.addEventListener('click', () => viewport.zoomIn());
  q('#btn-zoom-out')?.addEventListener('click', () => viewport.zoomOut());
  q('#btn-zoom-fit')?.addEventListener('click', () => viewport.zoomFit());

  function setStageBg(mode) {
    const shirt = mode === 'shirt';
    btnBgShirt?.classList.toggle('active', shirt);
    btnBgCheckers?.classList.toggle('active', !shirt);
    viewportEl.setAttribute('data-stage-bg', mode);
    viewportEl.style.backgroundColor = shirt ? (store.getState().selectedColor?.hex || '#1a1a24') : '';
  }
  btnBgShirt?.addEventListener('click', () => setStageBg('shirt'));
  btnBgCheckers?.addEventListener('click', () => setStageBg('checkers'));

  // --- Deshacer y restablecer ---
  const undo = () => {
    if (adjust.cancelPending()) { updateStatus(); return; } // primero se descarta el ajuste pendiente
    if (engine.undo()) { ed.textLayer.draw(); viewport.zoomFit(); updateStatus(); } };
  btnUndo?.addEventListener('click', undo);
  q('#btn-reset-editor')?.addEventListener('click', () => {
    adjust.cancelPending();
    engine.reset();
    ed.textLayer.reset();
    viewport.zoomFit();
    updateStatus();
  });
  window.addEventListener('keydown', (e) => {
    if (!ed.isOpen() || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
    if (/INPUT|TEXTAREA/.test(e.target.tagName)) return; // Ctrl+Z dentro de un campo de texto es del navegador
    e.preventDefault();
    undo();
  });

  // --- Cierre limpio: libera por completo el lienzo 3D ---
  let originalFileName = 'diseno';
  let applyCallback = null;
  let sourceCtx = {};   // { onReplace } del llamador: lienzo (decal) o ítem de la Bóveda
  const saveActions = initEditorSaveActions(ed, { adjust, getName: () => originalFileName, getContext: () => sourceCtx });

  function close() {
    tour.stop();
    tools.stopBrush();
    ed.touch.reset();
    adjust.cancelPending();
    ed.textLayer.discard();
    ed.hover.clear();
    viewport.resetPan();
    viewport.hideRing();
    backdrop.classList.remove('open');
    window.engine?.resumeRender?.(); // también al aplicar: btn-apply-editor termina siempre en close()
  }
  [q('#btn-close-editor'), q('#btn-cancel-editor')].forEach(b => b?.addEventListener('click', close));

  q('#btn-apply-editor')?.addEventListener('click', () => {
    adjust.commitPending(); // un ajuste en vista previa también forma parte del arte
    ed.textLayer.commit(); // un texto en borrador también forma parte del arte
    // Tope de 300 DPI: una imagen mayor que el área física máxima no se imprime más nítida, solo pesa más
    const fit = clampToPrintDpi(canvas, store.getState().activeZone);
    if (fit.clamped) showToast(describeClamp(fit, computeEffectiveDpi(fit.from.w, fit.max.wCm)), 'info', 6000);
    const finalDataUrl = (fit.clamped ? fit.source : canvas).toDataURL('image/png');
    const finalImg = new Image();
    finalImg.onload = () => {
      if (applyCallback) applyCallback(finalDataUrl, finalImg, originalFileName);
      close();
    };
    finalImg.src = finalDataUrl;
  });

  return {
    /** `ctx.onReplace(dataUrl, img, name)` (opcional) habilita 💾 Reemplazar Imagen sobre el arte de origen. */
    open(imageElement, fileName, onApply, ctx = {}) {
      originalFileName = fileName;
      applyCallback = onApply;
      sourceCtx = ctx || {};
      saveActions.refresh();
      adjust.reset();
      engine.setRawImage(clampToPrintDpi(imageElement, store.getState().activeZone).source);
      ed.textLayer.reset();
      setStageBg('shirt');
      switchTab('bg');
      tools.resetControls();
      tools.setActiveTool('wand');

      // Croma más seguro (que no exista en la imagen) para el prompt de IA
      try {
        aiPanel.analyzeImage(engine.getImageData());
      } catch (err) {
        console.warn('No se pudo analizar croma:', err);
      }

      updateStatus();
      paintRanges(backdrop);
      backdrop.classList.add('open');
      window.engine?.pauseRender?.();  // el estudio 3D no se dibuja bajo el editor (libera la GPU móvil; NODE-005 v1.5.0)
      setTimeout(() => viewport.zoomFit(true), 60);   // encuadre inmediato, sin animación
      setTimeout(() => viewport.zoomFit(), 280);      // reajuste suave cuando termina la animación de entrada
      if (tour.shouldAutoStart()) setTimeout(() => { if (ed.isOpen()) tour.start(); }, 700);
    }
  };
}
