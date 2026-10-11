import { autoCropCanvas } from '../services/imageProcessing.js';

/**
 * HERRAMIENTA DE RECORTE: RECTÁNGULO + LAZO LIBRE + RECORTE DE SOBRANTES (NODE-010).
 *  - Rectángulo: recorte dimensional preciso con guías de tercios.
 *  - Lazo Libre: selección a mano alzada para aislar cualquier figura irregular.
 *  - Recorte de sobrantes: encoge el lienzo automáticamente si tiene espacio vacío.
 */
export class ImageEditorCrop {
  constructor(engine, viewport, container, onCropChange = () => {}) {
    this.engine = engine;
    this.viewport = viewport;
    this.onCropChange = onCropChange;
    this.isActive = false;
    this.isDragging = false;
    this.mode = 'rect'; // 'rect' | 'lasso'

    this.rect = null; // { x, y, w, h }
    this.lassoPoints = null; // [{ x, y }]
    this.startPt = null;

    this.overlay = document.createElement('canvas');
    this.overlay.className = 'crop-overlay';
    this.overlay.style.position = 'absolute';
    this.overlay.style.inset = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.pointerEvents = 'none';
    this.overlay.style.zIndex = '3';
    this.octx = this.overlay.getContext('2d');
    container.appendChild(this.overlay);

    this.bindEvents();
  }

  setMode(mode) {
    this.mode = mode;
    this.clear();
    this.onCropChange(false);
  }

  autoTrim() {
    const res = this.engine.autoCrop();
    this.clear();
    this.viewport.zoomFit();
    return res;
  }

  getHasValidSelection() {
    if (this.mode === 'rect') return !!(this.rect && this.rect.w >= 10 && this.rect.h >= 10);
    if (this.mode === 'lasso') return !!(this.lassoPoints && this.lassoPoints.length >= 3);
    return false;
  }

  bindEvents() {
    const el = this.viewport.viewportEl;
    if (!el) return;

    el.addEventListener('pointerdown', (e) => {
      if (!this.isActive || e.button !== 0 || this.viewport.shouldPan(e)) return;
      const pt = this.viewport.getCanvasCoords(e);
      const W = this.engine.canvas.width, H = this.engine.canvas.height;
      if (pt.x < 0 || pt.y < 0 || pt.x > W || pt.y > H) return;

      this.isDragging = true;
      this.startPt = pt;
      if (this.mode === 'rect') {
        this.rect = { x: pt.x, y: pt.y, w: 0, h: 0 };
      } else {
        this.lassoPoints = [{ x: pt.x, y: pt.y }];
      }
      this.render();
      e.stopPropagation();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isActive || !this.isDragging || !this.startPt) return;
      const pt = this.viewport.getCanvasCoords(e);
      const W = this.engine.canvas.width, H = this.engine.canvas.height;
      const curX = Math.max(0, Math.min(W, pt.x));
      const curY = Math.max(0, Math.min(H, pt.y));

      if (this.mode === 'rect') {
        const x = Math.min(this.startPt.x, curX);
        const y = Math.min(this.startPt.y, curY);
        const w = Math.abs(curX - this.startPt.x);
        const h = Math.abs(curY - this.startPt.y);
        this.rect = { x, y, w, h };
      } else {
        const last = this.lassoPoints[this.lassoPoints.length - 1];
        if (!last || Math.hypot(curX - last.x, curY - last.y) >= 3) {
          this.lassoPoints.push({ x: curX, y: curY });
        }
      }
      this.render();
    });

    window.addEventListener('pointerup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.mode === 'rect' && this.rect && (this.rect.w < 10 || this.rect.h < 10)) {
          this.rect = null;
        } else if (this.mode === 'lasso' && this.lassoPoints && this.lassoPoints.length < 3) {
          this.lassoPoints = null;
        }
        this.render();
        this.onCropChange(this.getHasValidSelection());
      }
    });
  }

  setActive(on) {
    this.isActive = on;
    this.overlay.style.display = on ? 'block' : 'none';
    if (!on) this.clear();
    else this.render();
  }

  clear() {
    this.rect = null;
    this.lassoPoints = null;
    this.startPt = null;
    this.isDragging = false;
    this.octx.clearRect(0, 0, this.overlay.width, this.overlay.height);
  }

  render() {
    const { canvas } = this.engine;
    if (this.overlay.width !== canvas.width || this.overlay.height !== canvas.height) {
      this.overlay.width = canvas.width;
      this.overlay.height = canvas.height;
    }
    const ctx = this.octx;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (!this.isActive) return;

    if (this.mode === 'rect' && this.rect && this.rect.w >= 4 && this.rect.h >= 4) {
      const { x, y, w, h } = this.rect;

      // Sombreado exterior
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, W, y);
      ctx.fillRect(0, y + h, W, H - (y + h));
      ctx.fillRect(0, y, x, h);
      ctx.fillRect(x + w, y, W - (x + w), h);

      // Borde cyan
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = Math.max(2, Math.round(W / 400));
      ctx.strokeRect(x, y, w, h);

      // Guías de tercios
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + w / 3, y); ctx.lineTo(x + w / 3, y + h);
      ctx.moveTo(x + (2 * w) / 3, y); ctx.lineTo(x + (2 * w) / 3, y + h);
      ctx.moveTo(x, y + h / 3); ctx.lineTo(x + w, y + h / 3);
      ctx.moveTo(x, y + (2 * h) / 3); ctx.lineTo(x + w, y + (2 * h) / 3);
      ctx.stroke();

      // Badge de dimensiones
      const label = `${Math.round(w)} × ${Math.round(h)} px`;
      this.drawBadge(ctx, label, x + 8, y + 8, '#ffffff', '#00f0ff');
    } else if (this.mode === 'lasso' && this.lassoPoints && this.lassoPoints.length >= 2) {
      const pts = this.lassoPoints;

      // Sombreado exterior a la figura
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fill('evenodd');

      // Trazo del lazo
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = Math.max(2, Math.round(W / 400));
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (!this.isDragging) ctx.closePath();
      ctx.stroke();

      if (!this.isDragging && pts.length >= 3) {
        const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        this.drawBadge(ctx, '✨ AISLAR SILUETA', cx - 50, cy, '#00f0ff', '#00f0ff');
      }
    }
  }

  drawBadge(ctx, text, x, y, textColor, borderColor) {
    const fontSize = Math.max(12, Math.round(this.engine.canvas.width / 48));
    ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
    const tw = ctx.measureText(text).width;
    const padX = 10, padY = 5;
    const bx = Math.max(8, Math.min(this.engine.canvas.width - tw - 24, x));
    const by = Math.max(8, Math.min(this.engine.canvas.height - fontSize - 18, y));

    ctx.fillStyle = 'rgba(10, 14, 22, 0.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, tw + padX * 2, fontSize + padY * 2, 6);
    else ctx.rect(bx, by, tw + padX * 2, fontSize + padY * 2);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.fillText(text, bx + padX, by + fontSize + padY - 2);
  }

  apply() {
    if (!this.getHasValidSelection()) return false;

    if (this.mode === 'rect') {
      const success = this.engine.crop(this.rect);
      this.clear();
      return success;
    }

    if (this.mode === 'lasso') {
      const { canvas, ctx } = this.engine;
      const W = canvas.width, H = canvas.height;
      const pts = this.lassoPoints;
      this.engine.pushUndo();
      this.engine.lastAction = null;

      const mask = document.createElement('canvas');
      mask.width = W; mask.height = H;
      const mctx = mask.getContext('2d');
      mctx.beginPath();
      mctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) mctx.lineTo(pts[i].x, pts[i].y);
      mctx.closePath();
      mctx.fillStyle = '#ffffff';
      mctx.fill();

      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0);
      ctx.restore();

      const cropped = autoCropCanvas(canvas);
      canvas.width = cropped.width;
      canvas.height = cropped.height;
      ctx.clearRect(0, 0, cropped.width, cropped.height);
      ctx.drawImage(cropped, 0, 0);

      this.clear();
      this.engine.touch();
      return true;
    }

    return false;
  }
}
