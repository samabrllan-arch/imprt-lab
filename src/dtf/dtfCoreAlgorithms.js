/**
 * Algoritmos matemáticos de preprensa textil DTF
 * Choke separable, Knockout con tacto cero, Micro-Halftoning senoidal, Simulación de planchado y Auditoría pre-vuelo.
 */

export function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function applyChokeSeparable(alphaMap, width, height, radius) {
  const r = Math.max(1, Math.round(radius));
  const temp = new Uint8ClampedArray(alphaMap.length);
  const output = new Uint8ClampedArray(alphaMap.length);

  // 1. Erosión horizontal
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      let minVal = 255;
      const xStart = Math.max(0, x - r);
      const xEnd = Math.min(width - 1, x + r);
      for (let k = xStart; k <= xEnd; k++) {
        const v = alphaMap[rowOffset + k];
        if (v < minVal) minVal = v;
        if (minVal === 0) break;
      }
      temp[rowOffset + x] = minVal;
    }
  }

  // 2. Erosión vertical
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let minVal = 255;
      const yStart = Math.max(0, y - r);
      const yEnd = Math.min(height - 1, y + r);
      for (let k = yStart; k <= yEnd; k++) {
        const v = temp[k * width + x];
        if (v < minVal) minVal = v;
        if (minVal === 0) break;
      }
      output[y * width + x] = minVal;
    }
  }
  return output;
}

export function processDtfKnockoutAndHalftone(imgData, options = {}) {
  const { mode = 'none', threshold = 20, fadeRange = 15, hazeFactor = 0, lpi = 0 } = options;
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  const isHalftone = lpi > 0;
  const halftoneFrequency = isHalftone ? (lpi / 65) * 0.8 : 0;
  const thresholdPlusFade = threshold + fadeRange;
  const whiteThreshold = 255 - threshold;
  const whiteThresholdFade = 255 - thresholdPlusFade;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let alphaFactor = 1.0;

    if (mode === 'black') {
      alphaFactor = smoothstep(threshold, thresholdPlusFade, brightness);
    } else if (mode === 'white') {
      alphaFactor = smoothstep(whiteThreshold, whiteThresholdFade, brightness);
    }

    let finalAlpha = a * alphaFactor;

    if (hazeFactor > 0 && finalAlpha < 240 && brightness > 150) {
      finalAlpha *= (1 - (hazeFactor * (1 - (brightness / 255))));
    }

    if (isHalftone && finalAlpha > 0 && finalAlpha < 250) {
      const pIdx = i / 4;
      const px = pIdx % width;
      const py = (pIdx / width) | 0;
      const pattern = (Math.sin(px * halftoneFrequency) + Math.cos(py * halftoneFrequency) + 2) / 4;
      finalAlpha = (finalAlpha / 255 < pattern) ? 0 : 255;
    }

    data[i + 3] = Math.max(0, Math.min(255, Math.round(finalAlpha)));
  }
}

export function applyHeatPressSimulation(imgData, intensity = 0) {
  if (intensity <= 0) return;
  const data = imgData.data;
  const factor = intensity / 100;
  const contrast = 1 + (factor * 0.35);
  const saturation = 1 + (factor * 0.25);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    let r = data[i], g = data[i + 1], b = data[i + 2];

    r = ((r - 128) * contrast) + 128;
    g = ((g - 128) * contrast) + 128;
    b = ((b - 128) * contrast) + 128;

    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = lum + (r - lum) * saturation;
    g = lum + (g - lum) * saturation;
    b = lum + (g - lum) * saturation;

    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
  }
}

export function auditDtfPrintQuality(imgData, printWidthCm = 25) {
  const data = imgData.data;
  const w = imgData.width;
  const h = imgData.height;
  const total = w * h;
  let transparent = 0;
  let semiTrans = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) transparent++;
    else if (a < 240) semiTrans++;
  }

  const dpi = Math.round(w / (printWidthCm / 2.54));
  const results = [];

  // 1. Diagnóstico de resolución
  if (dpi >= 240) {
    results.push({ status: 'ok', title: `${dpi} DPI • Resolución Óptima`, desc: `Excelente nitidez para ${printWidthCm} cm.` });
  } else if (dpi >= 150) {
    results.push({ status: 'ok', title: `${dpi} DPI • Calidad Estándar`, desc: `Impresión nítida para producción textil regular.` });
  } else {
    results.push({ status: 'warn', title: `${dpi} DPI • Remasterización Recomendada`, desc: `Para ${printWidthCm} cm el motor auto-escalará a 300 DPI con Lanczos-3.` });
  }

  // 2. Semitransparencias
  const semiRatio = semiTrans / total;
  if (semiRatio > 0.08) {
    results.push({ status: 'warn', title: 'Degradados Semitransparentes Detectados', desc: 'Activa Micro-Halftone para convertir desvanecidos en trama que adhiera firme la poliamida.' });
  } else {
    results.push({ status: 'ok', title: 'Bordes Opacos y Limpios', desc: 'Adherencia óptima del adhesivo térmico en los bordes.' });
  }

  // 3. Transparencia de fondo
  if (transparent / total < 0.05) {
    results.push({ status: 'warn', title: 'Fondo Opaco / Rectangular', desc: 'Considera activar Knockout para eliminar fondo o ahorrar tinta sobre tela oscura.' });
  } else {
    results.push({ status: 'ok', title: 'Fondo Transparente Adecuado', desc: 'El arte no tiene bloque opaco innecesario alrededor.' });
  }

  return { dpi, results };
}
