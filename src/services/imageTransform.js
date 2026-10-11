/**
 * Transformaciones geométricas del editor (NODE-010): rotación libre 360° y volteos.
 * Devuelven un canvas NUEVO (el original no se modifica) con fondo transparente: el alfa se conserva.
 */
const newCanvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
};

/** Tamaño del lienzo que contiene la imagen girada `deg` grados (múltiplos de 90° = intercambio exacto). */
export function rotatedSize(w, h, deg) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
  const snap = (v) => (Math.abs(v - Math.round(v)) < 1e-6 ? Math.round(v) : Math.ceil(v));
  return { w: snap(w * cos + h * sin), h: snap(w * sin + h * cos) };
}

export function rotateCanvas(source, deg) {
  const norm = ((deg % 360) + 360) % 360;
  if (norm === 0) return source;
  const { w, h } = rotatedSize(source.width, source.height, norm);
  const out = newCanvas(w, h);
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((norm * Math.PI) / 180);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  return out;
}

/** axis: 'x' = espejo horizontal (izquierda↔derecha) · 'y' = espejo vertical (arriba↔abajo). */
export function flipCanvas(source, axis) {
  const out = newCanvas(source.width, source.height);
  const ctx = out.getContext('2d');
  if (axis === 'x') { ctx.translate(out.width, 0); ctx.scale(-1, 1); }
  else { ctx.translate(0, out.height); ctx.scale(1, -1); }
  ctx.drawImage(source, 0, 0);
  return out;
}
