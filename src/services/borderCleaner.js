/**
 * LIMPIADOR DE BORDES Y HALOS RESIDUALES (NODE-010).
 * Limpia píxeles oscuros/halos residuales en el borde con transparencia.
 * Soporta delimitar por `bounds` (rectángulo de pantalla visible) para NO tocar el resto del arte.
 */

export function cleanResidualEdgeBorders(imageData, bounds = null, options = {}) {
  const { data, width: w, height: h } = imageData;
  const { maxLuma = 95, passes = 2 } = options;

  const minX = bounds ? Math.max(0, bounds.minX) : 0;
  const minY = bounds ? Math.max(0, bounds.minY) : 0;
  const maxX = bounds ? Math.min(w - 1, bounds.maxX) : w - 1;
  const maxY = bounds ? Math.min(h - 1, bounds.maxY) : h - 1;

  let totalCleaned = 0;

  for (let pass = 0; pass < passes; pass++) {
    const toErase = [];

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const idx = (y * w + x) * 4;
        const a = data[idx + 3];
        if (a < 25) continue;

        // Verificar si toca transparencia (8 vecinos)
        let touchesAlpha = false;
        let maxNeighborLuma = 0;

        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= h) { touchesAlpha = true; continue; }
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            if (nx < 0 || nx >= w) { touchesAlpha = true; continue; }
            const nidx = (ny * w + nx) * 4;
            const na = data[nidx + 3];
            if (na < 25) {
              touchesAlpha = true;
            } else {
              const nlum = 0.299 * data[nidx] + 0.587 * data[nidx + 1] + 0.114 * data[nidx + 2];
              if (nlum > maxNeighborLuma) maxNeighborLuma = nlum;
            }
          }
        }

        if (!touchesAlpha) continue;

        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        // Es halo oscuro si su luminosidad es baja o contrasta fuertemente con el vecino interior
        const isDarkFringe = lum < maxLuma || (maxNeighborLuma > 140 && maxNeighborLuma - lum > 55);

        if (isDarkFringe) {
          toErase.push(idx);
        }
      }
    }

    if (toErase.length === 0) break;
    for (let i = 0; i < toErase.length; i++) {
      data[toErase[i] + 3] = 0; // Transparencia total
    }
    totalCleaned += toErase.length;
  }

  return { modified: totalCleaned > 0, cleanedCount: totalCleaned };
}
