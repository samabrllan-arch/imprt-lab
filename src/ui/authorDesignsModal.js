import { DECAL_PRESETS, svgToDataUrl } from '../config/presets.js';
import { setDecal } from '../state/actions.js';
import { store } from '../state/store.js';
import { ZONES } from '../config/zones.js';
import { showToast } from './toast.js';
import { renderCommunity } from './communityGallery.js';

let modalBackdrop = null;

const CATEGORIES = ['Todos', 'Streetwear', 'Cyberpunk', 'Retro', 'Minimal', 'Comunidad'];

export function initAuthorDesignsModal() {
  if (modalBackdrop) return { open: () => openModal() };

  modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'author-designs-modal-backdrop';
  modalBackdrop.id = 'author-designs-modal-backdrop';

  modalBackdrop.innerHTML = `
    <div class="author-designs-dialog">
      <div class="author-designs-header">
        <div class="author-header-texts">
          <div class="author-badge-row">
            <span class="author-modal-badge">COLECCIÓN ATELIER 240 GSM</span>
            <span class="author-modal-count">6 Estampados Exclusivos</span>
          </div>
          <h3 class="author-modal-title">Galería de Diseños de Autor</h3>
          <p class="author-modal-desc">Gráficos de autor en alta definición listos para estampar en tu prenda.</p>
        </div>
        <button type="button" class="author-modal-close" id="btn-close-author-modal" title="Cerrar ventana">✕</button>
      </div>

      <!-- Filtros Rápidos de Estilo -->
      <div class="author-filters-bar">
        ${CATEGORIES.map((cat, i) => `
          <button type="button" class="author-filter-btn ${i === 0 ? 'active' : ''}" data-cat="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Diseños públicos de la Bóveda de los usuarios -->
      <div class="author-designs-grid author-community" id="author-community-grid" hidden></div>

      <!-- Cuadrícula 3x2 Compacta de Alta Gama -->
      <div class="author-designs-grid" id="author-presets-grid">
        ${DECAL_PRESETS.map(p => `
          <div class="author-design-card" data-preset-id="${p.id}" data-category="${p.category || 'Streetwear'}">
            <div class="author-card-preview">
              <div class="author-svg-box">${p.svg}</div>
              <span class="author-active-badge">EN PRENDA</span>
            </div>
            <div class="author-card-footer">
              <div class="author-card-meta">
                <span class="author-card-name" title="${p.name}">${p.name}</span>
                <span class="author-card-cat">${p.category || 'Streetwear'}</span>
              </div>
              <button type="button" class="btn-apply-author-preset" title="Aplicar a la camiseta">
                <span>Usar Arte</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);

  // Cerrar modal
  const closeBtn = modalBackdrop.querySelector('#btn-close-author-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Filtros de categoría
  const filterBtns = modalBackdrop.querySelectorAll('.author-filter-btn');
  const cards = modalBackdrop.querySelectorAll('.author-design-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      const community = cat === 'Comunidad';
      modalBackdrop.querySelector('#author-presets-grid').hidden = community;
      const communityGrid = modalBackdrop.querySelector('#author-community-grid');
      communityGrid.hidden = !community;
      if (community) renderCommunity(communityGrid, closeModal);

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const show = cat === 'Todos' || cardCat.toLowerCase() === cat.toLowerCase();
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });

  // Aplicar diseño a la prenda
  cards.forEach(card => {
    const applyBtn = card.querySelector('.btn-apply-author-preset');
    const selectAction = () => {
      const presetId = card.getAttribute('data-preset-id');
      const preset = DECAL_PRESETS.find(p => p.id === presetId);
      if (!preset) return;

      const dataUrl = svgToDataUrl(preset.svg);
      const img = new Image();
      img.onload = () => {
        const activeZone = store.getState().activeZone;
        const zoneConfig = ZONES[activeZone] || { name: activeZone.toUpperCase() };

        setDecal(activeZone, {
          name: preset.name,
          src: dataUrl,
          imageElement: img
        });
        showToast(`¡"${preset.name}" aplicado en ${zoneConfig.name}!`, 'success');
        closeModal();
      };
      img.src = dataUrl;
    };

    if (applyBtn) applyBtn.addEventListener('click', (e) => { e.stopPropagation(); selectAction(); });
    card.addEventListener('click', selectAction);
  });

  return { open: () => openModal() };
}

function updateActiveBadges() {
  if (!modalBackdrop) return;
  const state = store.getState();
  const currentDecal = state.customizations[state.activeZone];
  const cards = modalBackdrop.querySelectorAll('.author-design-card');

  cards.forEach(card => {
    const presetId = card.getAttribute('data-preset-id');
    const preset = DECAL_PRESETS.find(p => p.id === presetId);
    const isCurrent = currentDecal && currentDecal.hasDecal && preset && currentDecal.name === preset.name;
    card.classList.toggle('is-active-on-shirt', Boolean(isCurrent));
  });
}

function openModal() {
  if (!modalBackdrop) initAuthorDesignsModal();
  updateActiveBadges();
  modalBackdrop.classList.add('open');
}

function closeModal() {
  if (modalBackdrop) modalBackdrop.classList.remove('open');
}
