/**
 * Lupa táctil del editor (NODE-010): mirilla circular que flota 66 px POR ENCIMA del dedo y muestra, ampliada,
 * la zona exacta que hay bajo él (más el tinte rojo de la varita o el diámetro de la goma), para que la mano no
 * tape lo que se va a borrar. Se dibuja como mucho una vez por fotograma (rAF) sobre un canvas de 104 px.
 */
const SIZE = 104;       // diámetro de la lupa (px CSS)
const OFFSET = 66;      // separación vertical entre el dedo y el centro de la lupa
const EDGE = 6;         // margen mínimo contra los bordes del lienzo de trabajo

export class TouchLoupe {
  /** @param {HTMLElement} viewportEl @param {object} engine @param {object} viewport @param {{overlay: HTMLCanvasElement}} hover */
  constructor(viewportEl, engine, viewport, hover) {
    this.viewportEl = viewportEl;
    this.engine = engine;
    this.viewport = viewport;
    this.hover = hover;
    this.pt = null;
    this.raf = 0;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);

    this.el = document.createElement('canvas');
    this.el.className = 'touch-loupe';
    this.el.width = this.el.height = Math.round(SIZE * this.dpr);
    this.el.setAttribute('aria-hidden', 'true');
    this.ctx = this.el.getContext('2d');
    viewportEl.appendChild(this.el);
  }

  /** Muestra (o mueve) la lupa para un dedo en `clientX/clientY`. */
  show(clientX, clientY) {
    this.pt = { clientX, clientY };
    this.el.classList.add('on');
    this.place();
    this.schedule();
  }

  hide() {
    this.pt = null;
    this.el.classList.remove('on');
  }

  /** Redibuja (p. ej. cuando la varita termina de calcular el tinte rojo). */
  refresh() { if (this.pt) this.schedule(); }

  schedule() {
    if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; if (this.pt) this.draw(); });
  }

  /** Centro de la lupa: arriba del dedo; si no cabe, a un lado. Siempre dentro del área de trabajo. */
  place() {
    const r = this.viewportEl.getBoundingClientRect();
    const half = SIZE / 2;
    const fx = this.pt.clientX - r.left, fy = this.pt.clientY - r.top;
    let cx = fx, cy = fy - OFFSET;
    if (cy < half + EDGE) {                     // sin sitio arriba: se desplaza al lado contrario al borde cercano
      cy = Math.max(half + EDGE, fy);
      cx = fx < r.width / 2 ? fx + half + 34 : fx - half - 34;
    }
    cx = Math.min(r.width - half - EDGE, Math.max(half + EDGE, cx));
    cy = Math.min(r.height - half - EDGE, Math.max(half + EDGE, cy));
    this.el.style.transform = `translate3d(${cx - half}px, ${cy - half}px, 0)`;
  }

  /** Fondo de la lupa = el del lienzo (color de la prenda o cuadrícula), para que lo ya borrado se distinga de lo que queda. */
  paintStage() {
    const { ctx } = this;
    const shirt = this.viewportEl.dataset.stageBg !== 'checkers';
    ctx.fillStyle = shirt ? (this.viewportEl.style.backgroundColor || '#1a1a24') : '#e2e8f0';
    ctx.fillRect(0, 0, SIZE, SIZE);
    if (shirt) return;
    ctx.fillStyle = '#94a3b8';
    for (let y = 0; y < SIZE; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < SIZE; x += 20) ctx.fillRect(x, y, 10, 10);
  }

  draw() {
    const { canvas, brush } = this.engine;
    const { ctx, dpr } = this;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !canvas.width) return;
    const screenPerPx = rect.width / canvas.width;             // píxeles de pantalla por píxel del lienzo
    const scale = Math.min(10, Math.max(3, screenPerPx * 2.2)); // píxeles de la lupa por píxel del lienzo
    const side = SIZE / scale;                                  // lado de la zona mostrada, en píxeles del lienzo
    const { x, y } = this.viewport.getCanvasCoords(this.pt);
    const sx = x - side / 2, sy = y - side / 2;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.paintStage();
    ctx.imageSmoothingEnabled = scale < 4;
    ctx.drawImage(canvas, sx, sy, side, side, 0, 0, SIZE, SIZE);

    const ov = this.hover?.overlay;
    if (ov && ov.style.opacity === '1' && this.engine.activeTool === 'wand') { // tinte rojo de lo que se borraría
      const k = ov.width / canvas.width;
      ctx.drawImage(ov, sx * k, sy * k, side * k, side * k, 0, 0, SIZE, SIZE);
    }
    const c = SIZE / 2;
    ctx.lineWidth = 1.5;
    if (this.engine.activeTool === 'brush') {                    // diámetro real de la goma
      ctx.strokeStyle = '#00f0ff';
      ctx.beginPath(); ctx.arc(c, c, Math.min(c - 3, brush.radius * scale), 0, Math.PI * 2); ctx.stroke();
    } else {                                                     // mirilla de la varita
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 2;
      ctx.beginPath(); ctx.moveTo(c - 10, c); ctx.lineTo(c - 3, c); ctx.moveTo(c + 3, c); ctx.lineTo(c + 10, c);
      ctx.moveTo(c, c - 10); ctx.lineTo(c, c - 3); ctx.moveTo(c, c + 3); ctx.lineTo(c, c + 10); ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}
