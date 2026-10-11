/**
 * Ajustes tonales del editor (NODE-010): brillo, contraste, saturación y nitidez.
 *
 * Las fórmulas siguen las de los filtros CSS (`brightness()`, `contrast()`, `saturate()`), de modo que la
 * vista previa y el resultado final coinciden. Los píxeles totalmente transparentes no se tocan: el borde del
 * recorte DTF no cambia de forma. Todo funciona sobre un canvas, en el sitio.
 */
import { applyGaussianSharpen } from './printResolution.js';

export const NEUTRAL_TONAL = Object.freeze({ brightness: 0, contrast: 0, saturation: 100, sharpen: 0 });

export const isNeutralTonal = (p) =>
  !p || (p.brightness === 0 && p.contrast === 0 && p.saturation === 100 && !p.sharpen);

/** Sigma del enfoque según el tamaño: una imagen grande necesita un radio mayor para el mismo aspecto. */
export const sharpenSigma = (width) => Math.min(2.5, Math.max(0.7, width / 1200));

/**
 * @param {HTMLCanvasElement} canvas se modifica en el sitio
 * @param {{brightness:number, contrast:number, saturation:number, sharpen:number}} params
 *   brillo y contraste de -100 a +100 · saturación 0–200 % (100 = igual) · nitidez 0–100
 */
export function applyTonal(canvas, params) {
  if (isNeutralTonal(params)) return canvas;
  const { brightness = 0, contrast = 0, saturation = 100, sharpen = 0 } = params;
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (brightness !== 0 || contrast !== 0 || saturation !== 100) {
    const im = ctx.getImageData(0, 0, w, h), d = im.data;
    const kb = 1 + brightness / 100, kc = 1 + contrast / 100, s = saturation / 100;
    // Matriz de saturación (coeficientes de luminancia de la especificación de filtros CSS)
    const m00 = 0.213 + 0.787 * s, m01 = 0.715 - 0.715 * s, m02 = 0.072 - 0.072 * s;
    const m10 = 0.213 - 0.213 * s, m11 = 0.715 + 0.285 * s, m12 = 0.072 - 0.072 * s;
    const m20 = 0.213 - 0.213 * s, m21 = 0.715 - 0.715 * s, m22 = 0.072 + 0.928 * s;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      let r = d[i] * kb, g = d[i + 1] * kb, b = d[i + 2] * kb;
      if (kc !== 1) { r = (r - 127.5) * kc + 127.5; g = (g - 127.5) * kc + 127.5; b = (b - 127.5) * kc + 127.5; }
      if (s !== 1) {
        r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
        const r2 = m00 * r + m01 * g + m02 * b, g2 = m10 * r + m11 * g + m12 * b, b2 = m20 * r + m21 * g + m22 * b;
        r = r2; g = g2; b = b2;
      }
      d[i] = r < 0 ? 0 : r > 255 ? 255 : r;
      d[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
      d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    ctx.putImageData(im, 0, 0);
  }
  if (sharpen > 0) applyGaussianSharpen(canvas, (sharpen / 100) * 1.6, sharpenSigma(w));
  return canvas;
}
