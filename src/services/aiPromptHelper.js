/**
 * Asistente de Prompts para IA y Detector de Color de Fondo Contrastante (NODE-010 / NODE-019).
 * Selecciona automáticamente un color de fondo croma ausente en la imagen para recorte perfecto.
 */

export const CHROMA_CANDIDATES = [
  { id: 'green', name: 'Verde Croma', nameEn: 'solid chroma green', hex: '#00FF00', r: 0, g: 255, b: 0 },
  { id: 'magenta', name: 'Magenta Croma', nameEn: 'solid magenta pink', hex: '#FF00FF', r: 255, g: 0, b: 255 },
  { id: 'blue', name: 'Azul Croma', nameEn: 'solid chroma blue', hex: '#0047FF', r: 0, g: 71, b: 255 },
  { id: 'cyan', name: 'Cyan Croma', nameEn: 'solid bright cyan', hex: '#00FFFF', r: 0, g: 255, b: 255 },
  { id: 'yellow', name: 'Amarillo Croma', nameEn: 'solid bright yellow', hex: '#FFFF00', r: 255, g: 255, b: 0 }
];

function colorDistSq(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

/**
 * Analiza la paleta de la imagen y devuelve el color croma más lejano/contrastante
 * que NO exista dentro del diseño, evitando que el borrador elimine partes del arte.
 */
export function getSafestChromaColor(imageData) {
  if (!imageData || !imageData.data) return CHROMA_CANDIDATES[0];
  const data = imageData.data;
  const len = data.length;
  const step = Math.max(1, Math.floor(len / 4 / 3000)) * 4; // Muestreo rápido de hasta 3000 píxeles

  // Calcular la distancia mínima de cada candidato a los píxeles visibles de la imagen
  const minDists = CHROMA_CANDIDATES.map(() => Infinity);

  for (let i = 0; i < len; i += step) {
    if (data[i + 3] < 30) continue; // ignorar píxeles transparentes
    const r = data[i], g = data[i + 1], b = data[i + 2];

    for (let c = 0; c < CHROMA_CANDIDATES.length; c++) {
      const cand = CHROMA_CANDIDATES[c];
      const d = colorDistSq(r, g, b, cand.r, cand.g, cand.b);
      if (d < minDists[c]) minDists[c] = d;
    }
  }

  // Escoger el candidato cuya distancia mínima sea la más alta (el color más ajeno al arte)
  let bestIdx = 0;
  let maxMinDist = -1;
  for (let c = 0; c < CHROMA_CANDIDATES.length; c++) {
    if (minDists[c] > maxMinDist) {
      maxMinDist = minDists[c];
      bestIdx = c;
    }
  }

  return CHROMA_CANDIDATES[bestIdx];
}

/**
 * Genera el prompt exacto instruyendo a la IA a NO modificar el sujeto y colocar
 * el fondo plano contrastante sugerido.
 */
export function buildAiPrompt(chromaColor, lang = 'es') {
  const color = chromaColor || CHROMA_CANDIDATES[0];

  if (lang === 'en') {
    return `STRICT PREPRESS RULE: Do NOT modify, redraw, or change the original subject in any way (must remain 100% identical). Use ONLY ONE single flat solid background color: ${color.nameEn} (${color.hex}). It is mandatory to use exclusively this single background color because it is NOT present in the character or anywhere in the artwork. The background must be completely flat and uniform, zero shadows, zero reflections, zero gradients, with razor-sharp cutout sticker edges for DTF printing.`;
  }

  return `REGLA ESTRICTA DE PREPRENSA: No modifiques, alteres ni redibujes ningún detalle del personaje o ilustración (la figura debe quedar 100% idéntica al original). Utiliza ÚNICAMENTE un solo color plano de fondo: ${color.name} (${color.hex}). Es mandatorio usar exclusivamente este color de fondo porque NO existe en el personaje ni en ningún elemento del diseño. El fondo debe ser 100% uniforme, plano, sin degradados, sin sombras y con bordes limpios y nítidos tipo calcomanía/sticker para calado perfecto DTF.`;
}
