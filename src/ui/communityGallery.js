/**
 * Sección "Comunidad" de la Galería de Diseños de Autor (NODE-026): diseños que los usuarios marcaron
 * como públicos en su Bóveda. Solo frontend: se listan los públicos guardados en este navegador.
 */
import '../styles/communityGallery.css';
import { getPublicVaultItems } from '../services/vaultStorage.js';
import { loadImage } from '../services/vaultImage.js';
import { setDecal } from '../state/actions.js';
import { store } from '../state/store.js';
import { ZONES } from '../config/zones.js';
import { formatAlias } from '../services/userAlias.js';
import { escapeHtml } from './htmlEscape.js';
import { isHidden } from '../services/reportService.js';
import { showToast } from './toast.js';

function card(item) {
  const by = item.authorAlias ? `por ${escapeHtml(formatAlias(item.authorAlias))}` : item.ownerName ? `por ${escapeHtml(item.ownerName)}` : 'Comunidad';
  return `
    <div class="author-design-card community-card" data-vault-id="${escapeHtml(item.id)}">
      <div class="author-card-preview"><img class="community-img" src="${escapeHtml(item.thumb || item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" /></div>
      <div class="author-card-footer">
        <div class="author-card-meta">
          <span class="author-card-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
          <span class="author-card-cat">${by}</span>
        </div>
        <button type="button" class="btn-apply-author-preset"><span>Usar Arte</span></button>
      </div>
    </div>`;
}

/** Pinta la sección y enlaza el clic; `onApplied` cierra la galería. */
export function renderCommunity(container, onApplied) {
  const items = getPublicVaultItems().filter((i) => !isHidden(`vault-${i.id}`)); // lo reportado queda oculto (NODE-027)
  container.innerHTML = items.length
    ? items.map(card).join('')
    : `<p class="community-empty">Aún no hay diseños públicos en este dispositivo. Publica uno desde <strong>Mi Bóveda de Diseños</strong> con el interruptor Público.</p>`;

  container.onclick = async (e) => {
    const id = e.target.closest('.community-card')?.dataset.vaultId;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const img = await loadImage(item.image);
    const zone = store.getState().activeZone;
    setDecal(zone, { name: item.name, src: item.image, imageElement: img });
    showToast(`¡"${item.name}" aplicado en ${ZONES[zone]?.name || zone}!`, 'success');
    onApplied();
  };
}
