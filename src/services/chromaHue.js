/**
 * Llave por tono (hue) para fondos croma (verde, cian, magenta, azul, amarillo...).
 *
 * La distancia RGB falla en el borde del dibujo: el antialiasing mezcla el verde con el negro del
 * contorno y produce tonos "verde oscuro" que quedan lejos del verde puro, aunque siguen siendo
 * claramente fondo (conservan el MISMO tono). Como el color croma se elige para que no exista en el
 * arte, comparar el tono es seguro y atrapa halos, sombras verdosas y huecos interiores.
 *
 * Solo se activa si el color objetivo es un croma muy saturado; para fondos blancos, negros o
 * pastel devuelve null y el motor usa únicamente la distancia de color.
 */

const MIN_TARGET_CHROMA = 120;   // el objetivo debe ser un color vivo
const MIN_TARGET_SAT = 0.75;
const MIN_PIXEL_CHROMA = 30;     // ignora grises y negros con ruido JPEG
const MIN_PIXEL_SAT = 0.35;

/** Tono 0-360 a partir de canales y su máximo/mínimo ya calculados. */
function hueOf(r, g, b, mx, mn) {
  const c = mx - mn;
  let h;
  if (mx === r) h = ((g - b) / c) % 6;
  else if (mx === g) h = (b - r) / c + 2;
  else h = (r - g) / c + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

/**
 * @param {{r:number,g:number,b:number}} target color de fondo
 * @param {number} tolerance sensibilidad 0-100 (la misma del slider)
 * @returns {null | ((r:number,g:number,b:number)=>boolean)}
 */
export function makeHueKey(target, tolerance) {
  const tMax = Math.max(target.r, target.g, target.b);
  const tMin = Math.min(target.r, target.g, target.b);
  const tChroma = tMax - tMin;
  if (tChroma < MIN_TARGET_CHROMA || tChroma / tMax < MIN_TARGET_SAT) return null;

  const tHue = hueOf(target.r, target.g, target.b, tMax, tMin);
  const maxDiff = 16 + tolerance * 0.4; // 30% -> 28°, 75% -> 46°

  return (r, g, b) => {
    const mx = r > g ? (r > b ? r : b) : (g > b ? g : b);
    const mn = r < g ? (r < b ? r : b) : (g < b ? g : b);
    const c = mx - mn;
    if (c < MIN_PIXEL_CHROMA || c / mx < MIN_PIXEL_SAT) return false;
    let d = Math.abs(hueOf(r, g, b, mx, mn) - tHue);
    if (d > 180) d = 360 - d;
    return d <= maxDiff;
  };
}
