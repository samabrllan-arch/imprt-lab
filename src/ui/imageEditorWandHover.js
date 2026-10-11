import { eraseColorAtPixel } from '../services/magicWandEraser.js';

/**
 * Vista previa EN VIVO de la varita mágica (NODE-010).
 *
 * Al pasar el cursor, la zona que se borraría al hacer clic se tiñe de rojo al instante:
 * el usuario ve el efecto antes de comprometerse. Para no bloquear el hilo, el cálculo se hace sobre una
 * copia reducida (~448 px) del lienzo, como máximo una vez por fotograma (rAF) y solo cuando cambió la celda
 * bajo el cursor, la sensibilidad, el modo o el contenido del lienzo (`engine.revision`).
 */
const MAX_DIM = 448;
const MIN_DELTA = 40;     // alfa mínimo perdido para considerar el píxel "afectado"

export class WandHover {
  /** @param {() => boolean} isAllowed  p. ej. false mientras la pestaña de texto está activa */
  constructor(engine, viewport, container, isAllowed = () => true) {
    this.engine = engine;
    this.viewport = viewport;
    this.isAllowed = isAllowed;
    this.enabled = true;
    this.pending = null;
    this.raf = 0;
    this.lastKey = '';
    this.cache = null;
    this.onPaint = null;   // gancho: la lupa táctil se redibuja cuando el tinte rojo está listo
    this.onClear = null;   // gancho: se descarta la confirmación táctil pendiente

    this.overlay = document.createElement('canvas');
    this.overlay.className = 'wand-hover-overlay';
    this.octx = this.overlay.getContext('2d');
    container.appendChild(this.overlay);
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) this.clear();
  }

  clear() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.pending = null;
    this.lastKey = '';
    this.overlay.style.opacity = '0';
    this.onClear?.();
  }

  /** Recibe cada pointermove; el trabajo real se agrupa en un único rAF. */
  move(e) {
    if (!this.enabled || this.engine.activeTool !== 'wand' || !this.isAllowed()) return;
    this.pending = { clientX: e.clientX, clientY: e.clientY };
    if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.paint(); this.onPaint?.(); });
  }

  /** Calcula YA, sin esperar al rAF: el dedo lo usa al soltar para que la vista previa coincida con el punto final. */
  flush(e) {
    if (!this.enabled || this.engine.activeTool !== 'wand' || !this.isAllowed()) return;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.pending = { clientX: e.clientX, clientY: e.clientY };
    this.paint();
    this.onPaint?.();
  }

  /** Copia reducida del lienzo; se rehace solo si el contenido cambió. */
  prepare() {
    const { canvas, revision } = this.engine;
    if (this.cache && this.cache.rev === revision && this.cache.w0 === canvas.width && this.cache.h0 === canvas.height) return this.cache;
    const k = Math.min(1, MAX_DIM / Math.max(canvas.width, canvas.height));
    const w = Math.max(1, Math.round(canvas.width * k));
    const h = Math.max(1, Math.round(canvas.height * k));
    const small = document.createElement('canvas');
    small.width = w; small.height = h;
    const sctx = small.getContext('2d', { willReadFrequently: true });
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(canvas, 0, 0, w, h);
    this.cache = { rev: revision, k, w, h, w0: canvas.width, h0: canvas.height, base: sctx.getImageData(0, 0, w, h) };
    return this.cache;
  }

  paint() {
    const p = this.pending;
    if (!p) return;
    const { canvas, settings } = this.engine;
    const { x, y } = this.viewport.getCanvasCoords(p);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) { this.overlay.style.opacity = '0'; this.lastKey = ''; return; }

    const c = this.prepare();
    const sx = Math.min(c.w - 1, Math.floor(x * c.k)), sy = Math.min(c.h - 1, Math.floor(y * c.k));
    const key = `${c.rev}|${sx},${sy}|${settings.tolerance}|${settings.contiguous}`;
    if (key === this.lastKey) return;
    this.lastKey = key;

    const work = new ImageData(new Uint8ClampedArray(c.base.data), c.w, c.h);
    const res = eraseColorAtPixel(work, sx, sy, { tolerance: settings.tolerance, feather: 2, choke: 0, contiguous: settings.contiguous });
    if (!res.modified) { this.overlay.style.opacity = '0'; return; }

    const out = this.octx.createImageData(c.w, c.h);
    const a = c.base.data, b = work.data, o = out.data;
    for (let i = 3; i < a.length; i += 4) {
      const lost = a[i] - b[i];
      if (lost > MIN_DELTA) {
        o[i - 3] = 255; o[i - 2] = 45; o[i - 1] = 85;
        o[i] = Math.min(150, lost * 0.6);
      }
    }
    if (this.overlay.width !== c.w || this.overlay.height !== c.h) { this.overlay.width = c.w; this.overlay.height = c.h; }
    this.octx.putImageData(out, 0, 0);
    this.overlay.style.opacity = '1';
  }
}
