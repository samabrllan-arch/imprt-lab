import { autoDetectBackgroundColor, autoCropCanvas, applyVisualFilters } from '../services/imageProcessing.js';
import { eraseColorAtPixel } from '../services/magicWandEraser.js';
import { cutoutImageData } from '../services/imageEnhancerService.js';
import { cleanResidualEdgeBorders } from '../services/borderCleaner.js';
import { LivePreview } from './editorLivePreview.js';
import { BrushEraser } from './imageEditorBrush.js';

/**
 * Motor desacoplado de procesamiento y pila de deshacer para el editor DTF (NODE-010).
 *
 * Tipos de acción re-ejecutables (los usa el slider de sensibilidad, con vista previa fluida):
 *  - 'pixel'   varita mágica (zona tocada o todo el color)
 *  - 'color'   borrado global de un color
 *  - 'cutout'  quitar fondo en 1 clic con el motor nuevo (imageEnhancerService + cutoutMask):
 *              choke real de N px, defringe de color y anti-aliasing de ~1px
 *  - 'chroma'  quitar fondo verde croma con el mismo motor (color clave estimado del perímetro)
 */
export class ImageEditorEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.undoStack = [];
    this.maxUndo = options.maxUndo || 15;
    this.lastAction = null;
    this.revision = 0;          // sube con cada cambio de píxeles (caché de la vista previa de la varita)
    this.preview = new LivePreview(this);
    this.brush = new BrushEraser(this);
    this.rawImage = null;
    this.activeTool = 'wand';   // 'wand' | 'brush' | 'hand'
    this.settings = {
      tolerance: 30,
      feather: 10,
      choke: 1,                 // choke REAL de 1px en el recorte
      contiguous: true          // contiguo por defecto: no borra partes del dibujo
    };
  }

  /** Marca que el lienzo cambió (invalida cachés dependientes del contenido). */
  touch() {
    this.revision++;
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Escribe píxeles en el lienzo y avisa del cambio. */
  commit(imageData) {
    if (this.canvas.width !== imageData.width || this.canvas.height !== imageData.height) {
      this.canvas.width = imageData.width;
      this.canvas.height = imageData.height;
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.touch();
  }

  setRawImage(imageElement, maxDim = 4096) {
    this.rawImage = imageElement;
    let w = imageElement.naturalWidth || imageElement.width;
    let h = imageElement.naturalHeight || imageElement.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(imageElement, 0, 0, w, h);
    this.undoStack.length = 0;
    this.lastAction = null;
    this.preview.reset();
    this.touch();
  }

  cloneImageData(src) {
    return new ImageData(new Uint8ClampedArray(src.data), src.width, src.height);
  }

  pushUndo(snapshot) {
    if (this.undoStack.length >= this.maxUndo) this.undoStack.shift();
    this.undoStack.push(snapshot || this.getImageData());
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    this.commit(this.undoStack.pop());
    this.lastAction = null;
    return true;
  }

  reset() {
    if (this.rawImage) this.setRawImage(this.rawImage);
  }

  /** Ejecuta una acción sobre una copia de su imagen base. Devuelve { work, res }. */
  runErase(action, settings) {
    const work = this.cloneImageData(action.baseData);
    const { tolerance, feather, choke } = settings;
    let res;

    if (action.type === 'pixel') {
      res = eraseColorAtPixel(work, action.x, action.y, { tolerance, feather, choke, contiguous: action.contiguous, bounds: action.bounds });
    } else if (action.type === 'color') {
      res = eraseColorAtPixel(work, 0, 0, { tolerance, feather, choke, contiguous: false, targetColor: action.color, bounds: action.bounds });
    } else if (action.type === 'cutout' || action.type === 'chroma') {
      cutoutImageData(work, action.type === 'chroma' ? 'chroma' : 'auto', { tolerance, choke, contiguous: true });
      res = { modified: true };
    }

    return { work, res };
  }

  /** Aplica una acción nueva sobre el lienzo actual y la registra para deshacer / re-ejecutar. */
  applyAction(action, settings = this.settings) {
    const baseData = this.getImageData();
    const full = { ...action, baseData };
    const { work, res } = this.runErase(full, settings);
    if (res && res.modified) {
      this.pushUndo(baseData);
      this.lastAction = full;
      this.commit(work);
      return { success: true, res };
    }
    return { success: false, res };
  }

  eraseAtPixel(x, y, extra = {}) {
    return this.applyAction({ type: 'pixel', x, y, contiguous: this.settings.contiguous, ...extra });
  }

  /** Limpia bordes negros o halos residuales acotados a la pantalla visible actual. */
  cleanVisibleEdges(bounds = null) {
    const imgData = this.getImageData();
    const res = cleanResidualEdgeBorders(imgData, bounds);
    if (res.modified) {
      this.pushUndo();
      this.lastAction = null;
      this.commit(imgData);
      return res;
    }
    return res;
  }

  /** ✨ Quitar fondo en 1 clic: detección automática del fondo + choke de 1px + defringe. */
  autoErase() {
    const detected = autoDetectBackgroundColor(this.getImageData());
    if (!detected) return { transparent: true };
    const out = this.applyAction({ type: 'cutout', color: detected, contiguous: true });
    return { ...out, color: detected };
  }

  /** 🟢 Quitar fondo verde (croma) sin halos. */
  chromaErase() {
    return this.applyAction({ type: 'chroma', contiguous: true });
  }

  rerunLastAction() {
    if (!this.lastAction) return false;
    const { work } = this.runErase(this.lastAction, this.settings);
    this.commit(work); // siempre: al bajar la sensibilidad debe restaurar píxeles
    return true;
  }

  /** Acción sobre la que opera el slider: la última acción ejecutada por el usuario (o null si ninguna). */
  ensureAction() {
    return this.lastAction || null;
  }

  /** Vista previa rápida (resolución reducida) mientras se arrastra el slider. */
  previewAction() {
    const action = this.ensureAction();
    if (!action) return false;
    this.preview.render(action, this.settings);
    this.touch();
    return true;
  }

  /** Dibuja sobre el lienzo (p. ej. texto) como UN paso de deshacer. */
  drawOnto(painter) {
    this.pushUndo();
    this.lastAction = null;
    painter(this.ctx, this.canvas);
    this.touch();
  }

  applyFilter(filterName) {
    this.pushUndo();
    this.lastAction = null;
    const imgData = this.getImageData();
    if (filterName === 'invert') applyVisualFilters(imgData, { invert: true });
    else if (filterName === 'grayscale') applyVisualFilters(imgData, { grayscale: true });
    this.commit(imgData);
    return true;
  }

  autoCrop() {
    this.pushUndo();
    this.lastAction = null;
    const cropped = autoCropCanvas(this.canvas);
    this.canvas.width = cropped.width;
    this.canvas.height = cropped.height;
    this.ctx.clearRect(0, 0, cropped.width, cropped.height);
    this.ctx.drawImage(cropped, 0, 0);
    this.touch();
    return { width: cropped.width, height: cropped.height };
  }

  crop(rect) {
    if (!rect || rect.w < 10 || rect.h < 10) return false;
    const baseData = this.getImageData();
    this.pushUndo(baseData);
    this.lastAction = null;
    const sx = Math.max(0, Math.min(this.canvas.width - 1, Math.round(rect.x)));
    const sy = Math.max(0, Math.min(this.canvas.height - 1, Math.round(rect.y)));
    const sw = Math.max(10, Math.min(this.canvas.width - sx, Math.round(rect.w)));
    const sh = Math.max(10, Math.min(this.canvas.height - sy, Math.round(rect.h)));
    const cropped = this.ctx.getImageData(sx, sy, sw, sh);
    this.canvas.width = sw;
    this.canvas.height = sh;
    this.ctx.putImageData(cropped, 0, 0);
    this.touch();
    return true;
  }

  expandCanvas(padding = { top: 0, bottom: 0, left: 0, right: 0 }) {
    const top = Math.max(0, Math.round(padding.top || 0));
    const bottom = Math.max(0, Math.round(padding.bottom || 0));
    const left = Math.max(0, Math.round(padding.left || 0));
    const right = Math.max(0, Math.round(padding.right || 0));
    if (top === 0 && bottom === 0 && left === 0 && right === 0) return false;

    this.pushUndo();
    this.lastAction = null;
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    const newW = oldW + left + right;
    const newH = oldH + top + bottom;

    const oldData = this.ctx.getImageData(0, 0, oldW, oldH);
    this.canvas.width = newW;
    this.canvas.height = newH;
    this.ctx.clearRect(0, 0, newW, newH);
    this.ctx.putImageData(oldData, left, top);
    this.touch();
    return { width: newW, height: newH, left, top };
  }

  getUndoCount() {
    return this.undoStack.length;
  }
}
