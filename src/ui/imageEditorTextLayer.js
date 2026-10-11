import { drawTextLayer, DEFAULT_TEXT_LAYER, fontById } from './imageEditorTextRender.js';
import { paint } from './rangeFill.js';
import { bindFontDropdown } from './imageEditorFontDropdown.js';

/**
 * Capa de texto del editor (NODE-010): gestiona el texto en borrador, selector desplegable de fuentes,
 * posicionamiento exterior y expansión de lienzo para colocar títulos fuera del arte.
 */
export class TextLayer {
  constructor(ed) {
    this.ed = ed;
    this.layer = null;
    this.active = false;
    this.drag = null;
    this.raf = 0;
    this.q = (sel) => ed.backdrop.querySelector(sel);

    this.overlay = document.createElement('canvas');
    this.overlay.className = 'text-layer-overlay';
    this.octx = this.overlay.getContext('2d');
    ed.wrap.appendChild(this.overlay);
    this.bind();
  }

  setActive(on) {
    this.active = on;
    this.overlay.classList.toggle('is-active', on);
  }

  hasDraft() {
    return !!this.layer;
  }

  reset() {
    this.layer = null;
    const inp = this.q('#text-input');
    if (inp) inp.value = DEFAULT_TEXT_LAYER.text;
    this.refreshButtons();
    this.draw();
  }

  create() {
    const v = (id) => this.q(id).value;
    const activeItem = this.q('.font-dropdown-item.active');
    const fontId = activeItem?.dataset.font || DEFAULT_TEXT_LAYER.fontId;

    this.layer = {
      ...DEFAULT_TEXT_LAYER,
      ...(this.layer || {}),
      text: v('#text-input') || DEFAULT_TEXT_LAYER.text,
      fontId,
      sizePct: +v('#text-size'),
      curve: +v('#text-curve'),
      strokeW: +v('#text-stroke-w'),
      shadow: +v('#text-shadow'),
      fill: v('#text-fill'),
      stroke: v('#text-stroke'),
      shadowColor: v('#text-shadow-color')
    };
    this.loadFont();
    this.refreshButtons();
    this.render();
  }

  loadFont() {
    const f = fontById(this.layer.fontId);
    document.fonts?.load(`${f.weight} 40px ${f.family}`, this.layer.text)
      .then(() => this.render())
      .catch(() => {});
  }

  refreshButtons() {
    const btnCommit = this.q('#btn-text-commit');
    const btnDiscard = this.q('#btn-text-discard');
    if (btnCommit) btnCommit.disabled = !this.layer;
    if (btnDiscard) btnDiscard.disabled = !this.layer;
  }

  render() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  }

  draw() {
    const { canvas } = this.ed;
    const { width: w, height: h } = canvas;
    if (this.overlay.width !== w || this.overlay.height !== h) {
      this.overlay.width = w;
      this.overlay.height = h;
    }
    this.octx.clearRect(0, 0, w, h);
    if (!this.layer) return;

    const box = drawTextLayer(this.octx, this.layer, w, h);
    if (!box) return;

    const lw = Math.max(3, w / 250), pad = lw * 3;
    this.octx.save();
    this.octx.strokeStyle = '#00f0ff';
    this.octx.lineWidth = lw;
    this.octx.setLineDash([lw * 4, lw * 3]);
    this.octx.strokeRect(box.x0 - pad, box.y0 - pad, box.x1 - box.x0 + pad * 2, box.y1 - box.y0 + pad * 2);
    this.octx.restore();
  }

  commit() {
    if (!this.layer) return false;
    const { canvas } = this.ed;

    // Verificar si el texto desborda el lienzo para expandirlo automáticamente
    const testCanvas = document.createElement('canvas');
    testCanvas.width = canvas.width;
    testCanvas.height = canvas.height;
    const testCtx = testCanvas.getContext('2d');
    const box = drawTextLayer(testCtx, this.layer, canvas.width, canvas.height);

    if (box) {
      const padTop = box.y0 < 0 ? Math.ceil(-box.y0 + 15) : 0;
      const padBottom = box.y1 > canvas.height ? Math.ceil(box.y1 - canvas.height + 15) : 0;
      const padLeft = box.x0 < 0 ? Math.ceil(-box.x0 + 15) : 0;
      const padRight = box.x1 > canvas.width ? Math.ceil(box.x1 - canvas.width + 15) : 0;

      if (padTop > 0 || padBottom > 0 || padLeft > 0 || padRight > 0) {
        const oldW = canvas.width, oldH = canvas.height;
        const res = this.ed.engine.expandCanvas({ top: padTop, bottom: padBottom, left: padLeft, right: padRight });
        if (res) {
          const px = (this.layer.x * oldW) + padLeft;
          const py = (this.layer.y * oldH) + padTop;
          this.layer.x = px / res.width;
          this.layer.y = py / res.height;
        }
      }
    }

    const layer = this.layer;
    this.ed.engine.drawOnto((ctx, c) => drawTextLayer(ctx, layer, c.width, c.height));
    this.layer = null;
    this.refreshButtons();
    this.draw();
    this.ed.updateStatus('Texto fijado en el arte');
    return true;
  }

  discard() {
    this.layer = null;
    this.refreshButtons();
    this.draw();
  }

  bind() {
    const q = this.q;
    const onChange = () => { if (this.layer) this.create(); };
    const label = (id, text) => { const el = q(id); if (el) el.textContent = text; };

    q('#text-input')?.addEventListener('input', onChange);
    q('#btn-text-add')?.addEventListener('click', () => {
      this.layer = null;
      this.create();
      q('#text-input')?.focus();
    });

    bindFontDropdown(q, () => this.create()); // desplegable de caligrafías

    // ── Sliders ──
    q('#text-size')?.addEventListener('input', (e) => { label('#text-size-val', `${e.target.value}%`); onChange(); });
    q('#text-curve')?.addEventListener('input', (e) => { label('#text-curve-val', `${e.target.value}%`); onChange(); });
    q('#text-curve-val')?.addEventListener('click', () => {
      const sl = q('#text-curve');
      if (sl) {
        sl.value = 0;
        paint(sl);
      }
      label('#text-curve-val', '0%'); onChange();
    });
    q('#text-stroke-w')?.addEventListener('input', (e) => { label('#text-stroke-val', e.target.value); onChange(); });
    q('#text-shadow')?.addEventListener('input', (e) => { label('#text-shadow-val', e.target.value); onChange(); });
    ['#text-fill', '#text-stroke', '#text-shadow-color'].forEach(id => q(id)?.addEventListener('input', onChange));
    q('#btn-text-commit')?.addEventListener('click', () => this.commit());
    q('#btn-text-discard')?.addEventListener('click', () => this.discard());

    // ── Botones de Margen Exterior (Texto Fuera de la Imagen) ──
    q('#btn-pad-top')?.addEventListener('click', () => {
      const pad = Math.round(this.ed.canvas.height * 0.22);
      const res = this.ed.engine.expandCanvas({ top: pad });
      if (res) {
        if (!this.layer) this.create();
        this.layer.y = (pad * 0.5) / res.height;
        this.draw();
        this.ed.updateStatus('Espacio superior añadido para títulos');
      }
    });

    q('#btn-pad-bottom')?.addEventListener('click', () => {
      const pad = Math.round(this.ed.canvas.height * 0.22);
      const oldH = this.ed.canvas.height;
      const res = this.ed.engine.expandCanvas({ bottom: pad });
      if (res) {
        if (!this.layer) this.create();
        this.layer.y = (oldH + pad * 0.5) / res.height;
        this.draw();
        this.ed.updateStatus('Espacio inferior añadido para subtítulos');
      }
    });

    q('#btn-pad-sides')?.addEventListener('click', () => {
      const pad = Math.round(this.ed.canvas.width * 0.15);
      const res = this.ed.engine.expandCanvas({ left: pad, right: pad });
      if (res) {
        if (!this.layer) this.create();
        this.draw();
        this.ed.updateStatus('Margen lateral añadido');
      }
    });

    // ── Arrastre interactivo libre ──
    const o = this.overlay;
    o.addEventListener('pointerdown', (e) => {
      if (!this.active || this.ed.viewport.shouldPan(e)) return;
      const p = this.frac(e);
      const fresh = !this.layer;
      if (fresh) this.create();
      this.drag = fresh ? { dx: 0, dy: 0 } : { dx: this.layer.x - p.x, dy: this.layer.y - p.y };
      o.setPointerCapture(e.pointerId);
      this.move(p);
      e.preventDefault();
    });

    o.addEventListener('pointermove', (e) => { if (this.drag) this.move(this.frac(e)); });
    const stop = () => { this.drag = null; };
    o.addEventListener('pointerup', stop);
    o.addEventListener('pointercancel', stop);
  }

  frac(e) {
    const { x, y } = this.ed.viewport.getCanvasCoords(e);
    const { width, height } = this.ed.canvas;
    return { x: x / width, y: y / height };
  }

  move(p) {
    if (!this.layer || !this.drag) return;
    // Permite mover el texto incluso en márgenes exteriores sin bloqueo rígido
    this.layer.x = Math.min(1.3, Math.max(-0.3, p.x + this.drag.dx));
    this.layer.y = Math.min(1.3, Math.max(-0.3, p.y + this.drag.dy));
    this.render();
  }
}
