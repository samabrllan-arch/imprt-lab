/**
 * Vista previa fluida del slider de sensibilidad.
 *
 * Reprocesar una imagen de 2048x2048 (4 M de píxeles) en cada movimiento del slider tarda cientos de
 * milisegundos y se siente "tosco". Mientras se arrastra se procesa una copia reducida (~0.1 s -> ~20 ms)
 * y se dibuja escalada sobre el lienzo; al soltar el slider el motor ejecuta el borrado a resolución
 * completa, por lo que el resultado final no pierde calidad.
 */
export class LivePreview {
  constructor(engine, maxDim = 512) {
    this.engine = engine;
    this.maxDim = maxDim;
    this.sourceKey = null;   // baseData de la acción para la que existe la copia reducida
    this.small = null;       // canvas reducido (también sirve de buffer de salida)
    this.smallCtx = null;
    this.baseSmall = null;   // ImageData reducida de la base (sin borrar)
    this.scale = 1;
  }

  /** Crea (o reutiliza) la copia reducida de la imagen original de la acción. */
  prepare(baseData) {
    if (this.sourceKey === baseData) return;
    const { width: w, height: h } = baseData;
    this.scale = Math.min(1, this.maxDim / Math.max(w, h));
    const sw = Math.max(1, Math.round(w * this.scale));
    const sh = Math.max(1, Math.round(h * this.scale));

    const full = document.createElement('canvas');
    full.width = w;
    full.height = h;
    full.getContext('2d').putImageData(baseData, 0, 0);

    this.small = document.createElement('canvas');
    this.small.width = sw;
    this.small.height = sh;
    this.smallCtx = this.small.getContext('2d', { willReadFrequently: true });
    this.smallCtx.imageSmoothingQuality = 'high';
    this.smallCtx.drawImage(full, 0, 0, sw, sh);
    this.baseSmall = this.smallCtx.getImageData(0, 0, sw, sh);
    this.sourceKey = baseData;
  }

  /** Procesa la acción sobre la copia reducida y la dibuja en el lienzo principal. */
  render(action, settings) {
    this.prepare(action.baseData);
    const k = this.scale;
    const scaledAction = {
      ...action,
      x: action.x !== undefined ? action.x * k : undefined,
      y: action.y !== undefined ? action.y * k : undefined,
      baseData: this.baseSmall
    };
    const scaledSettings = {
      ...settings,
      feather: Math.max(2, settings.feather * k),
      choke: Math.round(settings.choke * k)
    };

    const { work } = this.engine.runErase(scaledAction, scaledSettings);
    this.smallCtx.putImageData(work, 0, 0);

    const { canvas, ctx } = this.engine;
    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.small, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  /** Libera la copia reducida (al cambiar de imagen o de acción). */
  reset() {
    this.sourceKey = null;
    this.baseSmall = null;
    this.small = null;
    this.smallCtx = null;
  }
}
