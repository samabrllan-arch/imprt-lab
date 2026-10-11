/**
 * Filtros visuales y utilidades de recorte para diseño de estampados
 */

/**
 * Aplica ajustes de brillo, contraste, inversión y escala de grises
 */
export function applyVisualFilters(imageData, filters = {}) {
  const { brightness = 0, contrast = 0, invert = false, grayscale = false } = filters;
  const data = imageData.data;
  const total = data.length;

  // Factor de contraste (-100 a 100)
  const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  // Brillo (-100 a 100)
  const bVal = (brightness / 100) * 255;

  for (let i = 0; i < total; i += 4) {
    if (data[i + 3] === 0) continue; // Ignorar píxeles completamente transparentes

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brillo y Contraste
    if (brightness !== 0) {
      r += bVal;
      g += bVal;
      b += bVal;
    }
    if (contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;
    }

    // Escala de grises
    if (grayscale) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = lum;
      g = lum;
      b = lum;
    }

    // Inversión
    if (invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  return imageData;
}

/**
 * Recorta automáticamente los bordes transparentes sobrantes
 */
export function autoCropCanvas(sourceCanvas) {
  const ctx = sourceCanvas.getContext('2d');
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let minX = w, minY = h, maxX = 0, maxY = 0;
  let hasPixels = false;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3];
      if (alpha > 5) {
        hasPixels = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasPixels) return sourceCanvas;

  const pad = 12; // Margen de seguridad estético
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const cropped = document.createElement('canvas');
  cropped.width = cropW;
  cropped.height = cropH;
  const cCtx = cropped.getContext('2d');
  cCtx.drawImage(sourceCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  return cropped;
}
