/**
 * Goma manual del editor (NODE-010): borrado por trazo con interpolación continua.
 * Extraída de imageEditorEngine.js para mantener cada archivo por debajo de 300 líneas.
 * Cada trazo es UN solo paso de deshacer (se guarda la instantánea al empezar).
 */
export class BrushEraser {
  constructor(engine) {
    this.engine = engine;
    this.radius = 20;
    this.last = null;
  }

  start(x, y, radius = this.radius) {
    this.engine.pushUndo();
    this.engine.lastAction = null;
    this.last = { x, y };
    this.dot(x, y, radius);
  }

  /** Traza un segmento redondeado desde el último punto: sin huecos aunque el ratón vaya rápido. */
  to(x, y, radius = this.radius) {
    if (!this.last) { this.start(x, y, radius); return; }
    const { ctx } = this.engine;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = radius * 2;
    ctx.beginPath();
    ctx.moveTo(this.last.x, this.last.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
    this.last = { x, y };
    this.engine.touch();
  }

  end() {
    this.last = null;
  }

  dot(x, y, radius = this.radius) {
    const { ctx } = this.engine;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    this.engine.touch();
  }
}
