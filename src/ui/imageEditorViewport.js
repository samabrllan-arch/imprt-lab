/**
 * Gestor de Viewport, Zoom Interactivo y Pan para el Editor DTF PRO (NODE-010).
 *
 * Fluidez: zoom y encuadre NO saltan. Cada orden (rueda, + / −, 📐 Ajustar) fija un destino y un bucle
 * rAF acerca el estado actual a él con suavizado exponencial (el zoom se interpola en escala
 * logarítmica, así 25% → 50% se siente igual de rápido que 400% → 800%). Las órdenes repetidas de la
 * rueda se acumulan sobre el destino, no sobre el estado intermedio. El paneo por arrastre es directo.
 */
const MIN_ZOOM = 0.02;   // "Ajustar" nunca debe topar con el mínimo: una foto de 4096px cabe en cualquier panel
const MAX_ZOOM = 8.0;
const EASE = 0.3;        // fracción del camino recorrida por fotograma (≈ 160 ms hasta asentarse)
const PIXELATED_FROM = 3; // a partir de 300% se ven los píxeles reales (retoque de precisión)
export const ZOOM_RANGE = [MIN_ZOOM, MAX_ZOOM]; // lo usa el pellizco táctil (imageEditorTouch.js)

export class ImageEditorViewport {
  constructor(viewportEl, wrapEl, canvas, ringEl, zoomBadgeEl, options = {}) {
    this.viewportEl = viewportEl;
    this.wrapEl = wrapEl;
    this.canvas = canvas;
    this.ringEl = ringEl;
    this.zoomBadgeEl = zoomBadgeEl;
    this.getActiveTool = options.getActiveTool || (() => 'wand');

    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.target = { zoom: 1, panX: 0, panY: 0 };
    this.raf = 0;
    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.isSpacePressed = false;

    if (this.ringEl) { this.ringEl.style.left = '0'; this.ringEl.style.top = '0'; }
    this.bindEvents();
  }

  isEditorOpen() {
    return !!document.querySelector('#image-editor-backdrop.open');
  }

  applyTransform() {
    if (this.wrapEl) {
      this.wrapEl.style.transform = `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.zoom})`;
    }
    if (this.zoomBadgeEl) this.zoomBadgeEl.textContent = `${Math.round(this.zoom * 100)}%`;
    this.canvas.classList.toggle('is-pixelated', this.zoom >= PIXELATED_FROM);
  }

  /** Fija el destino y arranca la animación (o salta directo con `instant`). */
  moveTo(zoom, panX, panY, instant = false) {
    const target = { zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)), panX, panY };
    if (instant) {
      this.stopAnimation();          // primero se detiene (reinicia el destino) y DESPUÉS se fija el nuevo: así el salto sí ocurre
      this.target = target;
      this.zoom = target.zoom; this.panX = panX; this.panY = panY;
      this.applyTransform();
    } else {
      this.target = target;
      if (!this.raf) this.raf = requestAnimationFrame(() => this.step());
    }
  }

  step() {
    this.raf = 0;
    const t = this.target;
    this.zoom *= Math.pow(t.zoom / this.zoom, EASE);
    this.panX += (t.panX - this.panX) * EASE;
    this.panY += (t.panY - this.panY) * EASE;
    const settled = Math.abs(t.zoom / this.zoom - 1) < 0.002
      && Math.abs(t.panX - this.panX) < 0.4 && Math.abs(t.panY - this.panY) < 0.4;
    if (settled) {
      this.zoom = t.zoom; this.panX = t.panX; this.panY = t.panY;
    } else {
      this.raf = requestAnimationFrame(() => this.step());
    }
    this.applyTransform();
  }

  stopAnimation() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.target = { zoom: this.zoom, panX: this.panX, panY: this.panY };
  }

  /** Zoom hacia un punto de pantalla (o hacia el centro), acumulando sobre el destino actual. */
  setZoom(newZoom, centerX = null, centerY = null, instant = false) {
    const t = this.target;
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
    let { panX, panY } = t;
    if (centerX !== null && centerY !== null && this.viewportEl) {
      const rect = this.viewportEl.getBoundingClientRect();
      const mx = centerX - rect.left - rect.width / 2;
      const my = centerY - rect.top - rect.height / 2;
      panX = mx - (mx - t.panX) * (clamped / t.zoom);
      panY = my - (my - t.panY) * (clamped / t.zoom);
    }
    this.moveTo(clamped, panX, panY, instant);
  }

  zoomIn() { this.setZoom(this.target.zoom * 1.35); }
  zoomOut() { this.setZoom(this.target.zoom / 1.35); }
  zoomReset() { this.moveTo(1, 0, 0); }

  /** 📐 Ajustar: encuadra la imagen completa (con margen) con transición suave. */
  zoomFit(instant = false) {
    if (!this.viewportEl || !this.canvas.width) return;
    const vp = this.viewportEl.getBoundingClientRect();
    if (!vp.width || !vp.height) return;
    const pad = 24;
    const fit = Math.min((vp.width - pad) / this.canvas.width, (vp.height - pad) / this.canvas.height, 1.2);
    this.moveTo(fit, 0, 0, instant);
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  /** Retorna el recuadro del lienzo visible actualmente en pantalla (para retoque acotado a la vista). */
  getVisibleCanvasRect() {
    if (!this.viewportEl || !this.canvas.width || !this.canvas.height) return null;
    const vp = this.viewportEl.getBoundingClientRect();
    const tl = this.getCanvasCoords({ clientX: vp.left, clientY: vp.top });
    const br = this.getCanvasCoords({ clientX: vp.right, clientY: vp.bottom });
    return {
      minX: Math.max(0, Math.floor(Math.min(tl.x, br.x))),
      minY: Math.max(0, Math.floor(Math.min(tl.y, br.y))),
      maxX: Math.min(this.canvas.width - 1, Math.ceil(Math.max(tl.x, br.x))),
      maxY: Math.min(this.canvas.height - 1, Math.ceil(Math.max(tl.y, br.y)))
    };
  }

  /** Anillo de la goma: se mueve con transform (sin re-layout) y refleja el tamaño real en pantalla. */
  updateRing(e, brushRadius) {
    if (!this.ringEl) return;
    if (this.getActiveTool() !== 'brush' || this.isPanning || this.isSpacePressed) {
      this.ringEl.style.display = 'none';
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const size = brushRadius * 2 * (rect.width / this.canvas.width);
    this.ringEl.style.display = 'block';
    this.ringEl.style.width = `${size}px`;
    this.ringEl.style.height = `${size}px`;
    this.ringEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }

  hideRing() {
    if (this.ringEl) this.ringEl.style.display = 'none';
  }

  shouldPan(e) {
    return this.isSpacePressed || e.button === 1 || e.button === 2 || this.getActiveTool() === 'hand';
  }

  resetPan() {
    this.isPanning = false;
    this.isSpacePressed = false;
    this.viewportEl?.classList.remove('is-panning', 'space-panning');
  }

  bindEvents() {
    if (!this.viewportEl) return;

    // Zoom con rueda hacia el cursor (acumulativo y suavizado)
    this.viewportEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = Math.exp(-Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0016);
      this.setZoom(this.target.zoom * factor, e.clientX, e.clientY);
    }, { passive: false });

    // Barra espaciadora = mano temporal, como en Photoshop
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isSpacePressed && this.isEditorOpen() && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) {
        this.isSpacePressed = true;
        this.viewportEl.classList.add('space-panning');
        this.hideRing();
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.viewportEl.classList.remove('space-panning');
      }
    });

    this.viewportEl.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || !this.shouldPan(e)) return; // el dedo lo gestiona imageEditorTouch.js
      this.stopAnimation(); // el arrastre manda: se cancela cualquier transición en curso
      this.isPanning = true;
      this.panStartX = e.clientX - this.panX;
      this.panStartY = e.clientY - this.panY;
      this.viewportEl.classList.add('is-panning');
      e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPanning || !this.isEditorOpen()) return;
      this.panX = e.clientX - this.panStartX;
      this.panY = e.clientY - this.panStartY;
      this.target = { zoom: this.zoom, panX: this.panX, panY: this.panY };
      this.applyTransform();
    });

    const stopPan = () => {
      if (!this.isPanning) return;
      this.isPanning = false;
      this.viewportEl.classList.remove('is-panning');
    };
    window.addEventListener('pointerup', stopPan);
    window.addEventListener('pointercancel', stopPan);

    this.viewportEl.addEventListener('contextmenu', (e) => {
      if (this.shouldPan(e) || this.zoom > 1.05) e.preventDefault();
    });
  }
}
