/**
 * Galería completa de diseños (#galeria, NODE-014 / NODE-027): pantalla dedicada, igual que #estudio o #login.
 * Buscador, filtros por categoría, orden y paginación por bloques de 12 (cada página sustituye a la anterior, sin acumular
 * tarjetas) con tarjetas content-visibility para mantener 60 FPS. Cada tarjeta ofrece 👕 Estampar en 3D y 🚩 Reportar.
 * El CSS se enlaza en el <head> de index.html (regla html.route-gallery: sin parpadeo del landing al recargar con F5).
 */
import { allDesigns, findDesign } from './designCatalog.js';
import { renderLookbookCard, COMMUNITY_CATEGORY } from './lookbookCard.js';
import { bindCardActions } from './lookbookActions.js';
import { applyTheme } from './themeToggle.js';
import { escapeHtml } from './htmlEscape.js';
import { PAGE_SIZE, clampPage, sliceFor, renderPagination } from './galleryPagination.js';

const SEARCH_DELAY = 140;
const norm = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Categorías presentes (en orden de aparición) con su conteo; "Comunidad" siempre al final. */
export function buildCategories(items) {
  const counts = new Map();
  items.forEach((i) => counts.set(i.category, (counts.get(i.category) || 0) + 1));
  const names = [...counts.keys()].filter((c) => c !== COMMUNITY_CATEGORY);
  if (counts.has(COMMUNITY_CATEGORY)) names.push(COMMUNITY_CATEGORY);
  return names.map((name) => ({ name, count: counts.get(name) }));
}

/** Aplica búsqueda, categoría y orden sin mutar el catálogo. */
export function filterDesigns(items, { q = '', cat = 'all', sort = 'recent' } = {}) {
  const needle = norm(q);
  let out = items.filter((i) => (cat === 'all' || i.category === cat)
    && (!needle || norm(`${i.title} ${i.category} ${i.author} ${i.description}`).includes(needle)));
  if (sort === 'az') out = [...out].sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
  return out;
}

const SEARCH_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';

const shell = () => `
  <header class="studio-app-topbar gallery-topbar">
    <div class="topbar-left-group">
      <button type="button" class="btn-back-to-store" data-gallery="back" title="Volver a la tienda">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Volver a la Tienda</span>
      </button>
      <div class="gallery-brand brand-kinetic"><span class="brand-title" style="font-size: 0.95rem;">IMPRNT</span><span class="brand-lab-cyan" style="font-size: 0.74rem;">[LAB]</span><span class="gallery-badge" style="margin-left: 6px;">GALERÍA</span></div>
    </div>
    <button type="button" class="btn-theme-toggle" title="Cambiar tema" aria-label="Cambiar tema"></button>
  </header>
  <main class="gallery-main">
    <div class="gallery-head">
      <span class="section-eyebrow">BIBLIOTECA COMPLETA</span>
      <h1 class="gallery-title">Galería de Diseños</h1>
      <p class="gallery-lead">Todos los drops oficiales y los diseños públicos de la comunidad. Pruébalos en tu camiseta con un clic.</p>
    </div>
    <div class="gallery-controls">
      <label class="gallery-search">${SEARCH_ICON}
        <input type="search" id="gallery-search" placeholder="Buscar por nombre, estilo o @alias…" aria-label="Buscar diseños" autocomplete="off" />
      </label>
      <label class="gallery-sort"><span>Orden</span>
        <select id="gallery-sort" aria-label="Ordenar diseños"><option value="recent">Más recientes</option><option value="az">Nombre A–Z</option></select>
      </label>
    </div>
    <div class="gallery-filters" id="gallery-filters" role="group" aria-label="Filtrar por categoría"></div>
    <p class="gallery-count" id="gallery-count" aria-live="polite"></p>
    <div class="lookbook-grid gallery-grid" id="gallery-grid"></div>
    <p class="gallery-empty" id="gallery-empty" role="status" hidden>No encontramos diseños con esos filtros. Prueba con otra búsqueda o categoría.</p>
    <nav class="gallery-pagination" id="gallery-pagination" aria-label="Paginación de la galería" hidden></nav>
  </main>`;

/** @returns {{open: Function, close: Function}} controlador que usa el enrutador */
export function initCommunityGalleryView(mount, router) {
  const state = { q: '', cat: 'all', sort: 'recent', page: 1, list: [] };
  let built = false, isOpen = false, searchTimer = 0;
  const $ = (sel) => mount.querySelector(sel);

  function paintFilters(items) {
    const cats = buildCategories(items);
    if (state.cat !== 'all' && !cats.some((c) => c.name === state.cat)) state.cat = 'all';
    const pill = (value, label, count) => `<button type="button" class="filter-pill-btn${state.cat === value ? ' active' : ''}"
      data-cat="${escapeHtml(value)}" aria-pressed="${state.cat === value}">${escapeHtml(label)} <span class="pill-count">${count}</span></button>`;
    $('#gallery-filters').innerHTML = pill('all', 'Ver Todos', items.length) + cats.map((c) => pill(c.name, c.name, c.count)).join('');
  }

  function updateCount() {
    const total = allDesigns().length;
    const n = state.list.length;
    $('#gallery-count').textContent = `${n} ${n === 1 ? 'diseño' : 'diseños'}${n === total ? '' : ` (${total} en total)`}`;
    $('#gallery-empty').hidden = n > 0;
  }

  /** Barra de paginación: oculta si todo cabe en una página (≤ 12) o no hay resultados. */
  function paintPagination() {
    const nav = $('#gallery-pagination');
    nav.hidden = state.list.length <= PAGE_SIZE;
    nav.innerHTML = nav.hidden ? '' : renderPagination(state.page, state.list.length);
  }

  /** Pinta solo los 12 diseños de la página actual (la cuadrícula se vacía antes: nada se acumula). */
  function paintPage() {
    state.page = clampPage(state.page, state.list.length);
    $('#gallery-grid').innerHTML = sliceFor(state.list, state.page).map(renderLookbookCard).join('');
    updateCount();
    paintPagination();
  }

  /** Recalcula la lista filtrada y pinta. `page` = página a mostrar (1 al buscar/filtrar; la actual al resincronizar). */
  function paintList(page = 1) {
    const items = allDesigns();
    paintFilters(items);
    state.list = filterDesigns(items, state);
    state.page = page;
    paintPage();
  }

  function goToPage(page) {
    const next = clampPage(page, state.list.length);
    if (next === state.page) return;
    state.page = next;
    paintPage();
    mount.scrollTop = 0; // el contenedor tiene scroll-behavior: smooth (desactivado con prefers-reduced-motion)
    $('#gallery-pagination .page-num.active')?.focus({ preventScroll: true });
  }

  function build() {
    mount.innerHTML = shell();
    built = true;
    $('#gallery-search').addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.q = e.target.value; paintList(); }, SEARCH_DELAY);
    });
    $('#gallery-sort').addEventListener('change', (e) => { state.sort = e.target.value; paintList(); });
    $('#gallery-filters').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.cat = btn.dataset.cat;
      paintList();
    });
    mount.addEventListener('click', (e) => { if (e.target.closest('[data-gallery="back"]')) router?.closeGallery?.(); });
    $('#gallery-pagination').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-page]');
      if (btn && !btn.disabled) goToPage(Number(btn.dataset.page));
    });
    bindCardActions(mount, findDesign);
  }

  let syncTimer = 0;
  const resync = () => {
    if (!isOpen) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => paintList(state.page), 60);
  };
  window.addEventListener('vault:changed', resync);
  window.addEventListener('reports:changed', resync);
  window.addEventListener('storage', (e) => { if (!e.key || e.key === 'shirt_user_vault_db' || e.key === 'shirt_reported_content') resync(); });

  return {
    open() {
      if (!built) build();
      isOpen = true;
      paintList();
      applyTheme(document.documentElement.getAttribute('data-theme') || 'dark', false); // pone el icono correcto en el botón de tema
      mount.scrollTop = 0;
    },
    close() { isOpen = false; }
  };
}
