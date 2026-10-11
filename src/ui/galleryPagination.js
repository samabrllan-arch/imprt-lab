/**
 * Paginación por bloques de la galería #galeria (NODE-027): lógica pura + HTML de la barra de navegación.
 * Cada página muestra solo PAGE_SIZE tarjetas; la barra se oculta si todo cabe en una página.
 */
export const PAGE_SIZE = 12;

/** Cantidad de páginas (mínimo 1) para `total` registros. */
export const pageCount = (total, size = PAGE_SIZE) => Math.max(1, Math.ceil(total / size));

/** Ajusta una página al rango válido [1, pageCount]. */
export const clampPage = (page, total, size = PAGE_SIZE) => Math.min(pageCount(total, size), Math.max(1, Math.floor(Number(page)) || 1));

/** Rango visible 1-indexado de la página: { from, to }. Con 0 registros devuelve { from: 0, to: 0 }. */
export function pageRange(page, total, size = PAGE_SIZE) {
  if (total <= 0) return { from: 0, to: 0 };
  const from = (page - 1) * size + 1;
  return { from, to: Math.min(total, page * size) };
}

/** Registros de la página actual (copia, no muta la lista). */
export const sliceFor = (list, page, size = PAGE_SIZE) => list.slice((page - 1) * size, page * size);

/** Números a mostrar con elipsis: 1 … 4 5 6 … 12. Hasta 7 páginas se muestran todas. */
export function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

const ARROW_L = '<span aria-hidden="true">←</span>';
const ARROW_R = '<span aria-hidden="true">→</span>';

/** HTML interior de `<nav id="gallery-pagination">`. */
export function renderPagination(page, total, size = PAGE_SIZE) {
  const pages = pageCount(total, size);
  const { from, to } = pageRange(page, total, size);
  const numbers = pageItems(page, pages).map((n) => (n === '…'
    ? '<span class="page-gap" aria-hidden="true">…</span>'
    : `<button type="button" class="page-btn page-num${n === page ? ' active' : ''}" data-page="${n}"
        aria-label="Página ${n}"${n === page ? ' aria-current="page"' : ''}>${n}</button>`)).join('');
  return `
    <div class="page-controls">
      <button type="button" class="page-btn page-step" data-page="${page - 1}" aria-label="Página anterior"${page <= 1 ? ' disabled' : ''}>${ARROW_L} Anterior</button>
      <div class="page-numbers">${numbers}</div>
      <button type="button" class="page-btn page-step" data-page="${page + 1}" aria-label="Página siguiente"${page >= pages ? ' disabled' : ''}>Siguiente ${ARROW_R}</button>
    </div>
    <p class="page-info" aria-live="polite">Mostrando registros ${from}–${to} de ${total} diseños</p>`;
}
