/**
 * Render de texto sobre el arte del editor (NODE-010): catálogo de caligrafías y arco en Canvas 2D.
 * Funciones puras (solo dependen del contexto recibido): sirven tanto para la vista previa como para
 * fijar el texto en el lienzo final.
 */

/** Catálogo visual. Las fuentes se cargan desde Google Fonts en index.html. */
export const TEXT_FONTS = [
  { id: 'anton',     label: 'Anton',      family: "'Anton', Impact, sans-serif",         weight: 400, group: 'Bold' },
  { id: 'bebas',     label: 'Bebas Neue',  family: "'Bebas Neue', Impact, sans-serif",    weight: 400, group: 'Bold' },
  { id: 'kaushan',   label: 'Kaushan',    family: "'Kaushan Script', cursive",           weight: 400, group: 'Streetwear' },
  { id: 'bangers',   label: 'Bangers Pop', family: "'Bangers', cursive",                  weight: 400, group: 'Comic / Pop' },
  { id: 'creepster', label: 'Creepster',  family: "'Creepster', cursive",                weight: 400, group: 'Terror / Metal' },
  { id: 'sedgwick',  label: 'Sedgwick',   family: "'Sedgwick Ave', cursive",             weight: 400, group: 'Graffiti' },
  { id: 'marker',    label: 'Marker',     family: "'Permanent Marker', cursive",         weight: 400, group: 'Graffiti' },
  { id: 'rocksalt',  label: 'Rock Salt',  family: "'Rock Salt', cursive",                weight: 400, group: 'Graffiti' },
  { id: 'unifraktur', label: 'Fraktur',   family: "'UnifrakturCook', serif",            weight: 700, group: 'Gótica' },
  { id: 'medieval',  label: 'Medieval',   family: "'MedievalSharp', serif",              weight: 400, group: 'Gótica' },
  { id: 'pirata',    label: 'Pirata',     family: "'Pirata One', cursive",               weight: 400, group: 'Gótica' },
  { id: 'pacifico',  label: 'Pacifico',   family: "'Pacifico', cursive",                 weight: 400, group: 'Cursiva' },
  { id: 'dancing',   label: 'Dancing',    family: "'Dancing Script', cursive",           weight: 700, group: 'Cursiva' },
  { id: 'greatvibes', label: 'Great Vibes', family: "'Great Vibes', cursive",            weight: 400, group: 'Cursiva' },
  { id: 'blackops',  label: 'Black Ops',  family: "'Black Ops One', cursive",            weight: 400, group: 'Militar' },
  { id: 'specialelite', label: 'Typewriter', family: "'Special Elite', cursive",          weight: 400, group: 'Vintage' },
  { id: 'righteous', label: 'Righteous',  family: "'Righteous', cursive",                weight: 400, group: 'Retro 80s' },
  { id: 'cinzel',    label: 'Cinzel',     family: "'Cinzel', serif",                     weight: 700, group: 'Lujo' },
  { id: 'syne',      label: 'Syne Haute', family: "'Syne', sans-serif",                  weight: 700, group: 'Alta Costura' },
  { id: 'grotesk',   label: 'Grotesk',    family: "'Space Grotesk', sans-serif",         weight: 600, group: 'Cyber' }
];

export const DEFAULT_TEXT_LAYER = {
  text: 'TU TEXTO', fontId: 'anton', sizePct: 14, curve: 0,
  fill: '#ffffff', stroke: '#000000', strokeW: 3, shadow: 0, shadowColor: '#000000', x: 0.5, y: 0.2
};

const MAX_ARC = Math.PI * 1.2; // ángulo que abarca el texto con curvatura ±100%

export const fontById = (id) => TEXT_FONTS.find(f => f.id === id) || TEXT_FONTS[0];

/** Sombra paralela (canvas): el desplazamiento va en coordenadas del lienzo, sin importar la rotación de la letra. */
function setShadow(ctx, sh) {
  ctx.shadowColor = sh ? sh.color : 'transparent';
  ctx.shadowBlur = sh ? sh.blur : 0;
  ctx.shadowOffsetX = sh ? sh.dx : 0;
  ctx.shadowOffsetY = sh ? sh.dy : 0;
}

function shadowFor(layer, px) {
  const k = Math.max(0, Math.min(100, layer.shadow || 0)) / 100;
  if (!k) return null;
  const hex = /^#[0-9a-f]{6}$/i.test(layer.shadowColor) ? layer.shadowColor : '#000000';
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');
  return { color: `rgba(${rgb},${(0.45 + 0.5 * k).toFixed(2)})`, blur: px * 0.1 * k, dx: px * 0.07 * k, dy: px * 0.09 * k };
}

function paint(ctx, str, x, y, lineWidth, sh) {
  setShadow(ctx, sh); // la sombra se proyecta una sola vez: bajo el contorno (o bajo el relleno si no hay contorno)
  if (lineWidth > 0) { ctx.strokeText(str, x, y); setShadow(ctx, null); }
  ctx.fillText(str, x, y);
  setShadow(ctx, null);
}

/**
 * Dibuja `layer` en `ctx` (lienzo de w × h). x / y del layer son fracciones (independientes de la resolución);
 * el tamaño es un % del ancho. Curvatura: 0 = recto, >0 arco ∩ (sonrisa invertida), <0 arco ∪.
 * @returns {{x0:number,y0:number,x1:number,y1:number}|null} caja aproximada del texto (para el recuadro guía)
 */
export function drawTextLayer(ctx, layer, w, h) {
  const text = (layer.text || '').trim();
  if (!text) return null;
  const font = fontById(layer.fontId);
  const px = Math.max(8, (w * layer.sizePct) / 100);
  const lineWidth = (px * layer.strokeW) / 60;
  const sh = shadowFor(layer, px);
  const cx = layer.x * w, cy = layer.y * h;

  ctx.save();
  ctx.font = `${font.weight} ${px}px ${font.family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.fillStyle = layer.fill;
  ctx.strokeStyle = layer.stroke;
  ctx.lineWidth = lineWidth;

  let box;
  if (Math.abs(layer.curve) < 2) {
    paint(ctx, text, cx, cy, lineWidth, sh);
    const half = ctx.measureText(text).width / 2;
    box = { x0: cx - half, y0: cy - px * 0.6, x1: cx + half, y1: cy + px * 0.6 };
  } else {
    // Cada letra se coloca sobre una circunferencia de radio R = anchoTotal / ángulo y se rota hacia el centro.
    const chars = Array.from(text);
    const widths = chars.map(c => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0);
    const theta = (Math.abs(layer.curve) / 100) * MAX_ARC;
    const R = total / theta;
    const up = layer.curve > 0;
    const ccy = up ? cy + R : cy - R;           // ∩: centro debajo del texto · ∪: centro encima
    box = { x0: cx, y0: cy, x1: cx, y1: cy };
    let acc = 0;
    chars.forEach((ch, i) => {
      const frac = (acc + widths[i] / 2) / R - theta / 2; // ángulo respecto al centro del arco
      acc += widths[i];
      const a = up ? -Math.PI / 2 + frac : Math.PI / 2 - frac;
      const x = cx + R * Math.cos(a), y = ccy + R * Math.sin(a);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(up ? frac : -frac);
      paint(ctx, ch, 0, 0, lineWidth, sh);
      ctx.restore();
      box.x0 = Math.min(box.x0, x - px * 0.6); box.x1 = Math.max(box.x1, x + px * 0.6);
      box.y0 = Math.min(box.y0, y - px * 0.6); box.y1 = Math.max(box.y1, y + px * 0.6);
    });
  }
  ctx.restore();
  return box;
}
