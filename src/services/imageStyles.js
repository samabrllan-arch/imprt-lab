/**
 * Filtros creativos streetwear del editor (NODE-010). Cada filtro modifica el canvas en el sitio y respeta el
 * canal alfa: los píxeles transparentes siguen transparentes, así el contorno recortado para DTF no cambia.
 */
export const STYLE_FILTERS = [
  { id: 'street', label: 'Street Grayscale', hint: 'Blanco y negro de alto contraste', swatch: 'linear-gradient(135deg,#0b0b0b,#8a8a8a 55%,#f5f5f5)' },
  { id: 'duotone', label: 'Cyberpunk Duotone', hint: 'Cian y magenta neón', swatch: 'linear-gradient(135deg,#16002e,#ff2bd6 50%,#00f5ff)' },
  { id: 'halftone', label: 'Halftone DTF', hint: 'Punteado serigráfico', swatch: 'radial-gradient(circle,#111 38%,transparent 42%) 0 0/9px 9px, #f1ede4' },
  { id: 'vintage', label: 'Vintage Grain', hint: 'Tono cálido gastado con grano', swatch: 'linear-gradient(135deg,#3a2a1c,#b98d5a 55%,#efdcb6)' }
];

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const clamp8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

const DUO_STOPS = [[0, 22, 0, 46], [0.5, 255, 43, 214], [1, 0, 245, 255]]; // sombra violeta → magenta → cian

function duoColor(t) {
  const i = t < DUO_STOPS[1][0] ? 0 : 1;
  const [t0, r0, g0, b0] = DUO_STOPS[i], [t1, r1, g1, b1] = DUO_STOPS[i + 1];
  const k = (t - t0) / (t1 - t0);
  return [r0 + (r1 - r0) * k, g0 + (g1 - g0) * k, b0 + (b1 - b0) * k];
}

/** Generador pseudo-aleatorio determinista (el mismo grano siempre: la vista previa y el final coinciden). */
function rng(seed = 1234567) {
  let s = seed >>> 0;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

function perPixel(canvas, fn) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const im = ctx.getImageData(0, 0, canvas.width, canvas.height), d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    fn(d, i);
  }
  ctx.putImageData(im, 0, 0);
}

function street(canvas) {
  perPixel(canvas, (d, i) => {
    const v = clamp8((luma(d[i], d[i + 1], d[i + 2]) - 128) * 1.4 + 124);
    d[i] = d[i + 1] = d[i + 2] = v;
  });
}

function duotone(canvas) {
  const lut = Array.from({ length: 256 }, (_, v) => duoColor(v / 255));
  perPixel(canvas, (d, i) => {
    const c = lut[Math.round(luma(d[i], d[i + 1], d[i + 2]))];
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
  });
}

function vintage(canvas) {
  const rand = rng();
  perPixel(canvas, (d, i) => {
    const r = d[i], g = d[i + 1], b = d[i + 2], l = luma(r, g, b);
    // 40 % de desaturación + tinte sepia cálido + negros levantados (look "lavado")
    const gr = (rand() + rand() + rand() - 1.5) * 26; // grano monocromo ≈ gaussiano
    d[i] = clamp8((r * 0.6 + l * 0.4) * 0.9 + 30 + gr);
    d[i + 1] = clamp8((g * 0.6 + l * 0.4) * 0.84 + 20 + gr);
    d[i + 2] = clamp8((b * 0.6 + l * 0.4) * 0.68 + 12 + gr);
  });
}

/** Punteado: una celda → un punto del color promedio; más oscuro y opaco = punto más grande. */
function halftone(canvas) {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const d = ctx.getImageData(0, 0, w, h).data;
  const cell = Math.max(6, Math.round(Math.max(w, h) / 110));
  ctx.clearRect(0, 0, w, h);
  for (let y0 = 0; y0 < h; y0 += cell) {
    for (let x0 = 0; x0 < w; x0 += cell) {
      const x1 = Math.min(w, x0 + cell), y1 = Math.min(h, y0 + cell);
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const p = (y * w + x) * 4, al = d[p + 3];
          r += d[p] * al; g += d[p + 1] * al; b += d[p + 2] * al; a += al; n++;
        }
      }
      if (a < 255 * n * 0.06) continue; // celda casi transparente: no se puntea
      const cov = a / (255 * n);
      const col = [r / a, g / a, b / a];
      const dark = 1 - luma(...col) / 255;
      const radius = (cell / 2) * 1.08 * Math.sqrt(Math.min(1, cov * (0.4 + 0.6 * dark)));
      ctx.fillStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`;
      ctx.beginPath();
      ctx.arc((x0 + x1) / 2, (y0 + y1) / 2, Math.max(0.6, radius), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const RUNNERS = { street, duotone, halftone, vintage };

/** @param {'street'|'duotone'|'halftone'|'vintage'} id */
export function applyStyleFilter(canvas, id) {
  const run = RUNNERS[id];
  if (run) run(canvas);
  return canvas;
}
