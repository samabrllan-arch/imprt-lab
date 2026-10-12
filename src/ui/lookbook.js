import { authService } from '../services/authService.js';
import { authModal } from './authModal.js';
import { openVaultModal } from './vaultModal.js';
import { renderLookbookCard } from './lookbookCard.js';
import { latestDesigns, LANDING_LATEST, findDesign } from './designCatalog.js';
import { bindCardActions } from './lookbookActions.js';
import '../styles/lookbookCommunity.css';

// El Lookbook no tiene router: abre el estudio con el hash, como el resto de la landing
const hashRouter = { isStudioOpen: false, openStudio() { window.location.hash = '#estudio'; } };

/**
 * Landing (NODE-014): solo los últimos 4 diseños (drops oficiales + comunidad con crédito @alias) para aligerar el scroll.
 * La biblioteca completa, paginada de a 12 registros con buscador y filtros, vive en la vista dedicada `#galeria` (communityGalleryView.js).
 */
export function initLookbook(container) {
  if (!container) return;

  function render() {
    const items = latestDesigns(LANDING_LATEST);

    container.innerHTML = `
      <section class="lookbook-section" id="trabajos">
        <div class="landing-container">
          <div class="section-header-box">
            <span class="section-eyebrow">BIBLIOTECA COMUNITARIA & DROPS DTF</span>
            <h2 class="section-title">Explora Estilos y Tendencias</h2>
            <p class="section-description">
              Diseños listos para estampar en DTF Ultra HD. Elige cualquier drop de la biblioteca abierta, pruébalo en el Estudio 3D o sube tu diseño gratis (Público o Privado).
            </p>
          </div>

          <div class="lookbook-toolbar-row">
            <span class="lookbook-latest-label">🔥 Diseños Destacados Listos para Estampar</span>
            <button type="button" class="btn-community-upload" id="btn-community-drop" title="Sube tu arte y compártelo o úsalo privado">
              <span>✨ Subir a Biblioteca</span>
              <span class="btn-drop-subtag">(Público / Privado)</span>
            </button>
          </div>

          <div class="lookbook-grid has-gallery-cta">${items.map(renderLookbookCard).join('')}</div>

          <div class="lookbook-gallery-cta">
            <a href="#galeria" class="btn-gallery-cta" data-action="open-gallery">Ver Más Diseños →</a>
          </div>
        </div>
      </section>
    `;

    // Subir a la biblioteca: el diseño se guarda en la Bóveda (privado por defecto) y se publica con su interruptor
    container.querySelector('#btn-community-drop')?.addEventListener('click', () => {
      if (!authService.isAuthenticated()) {
        authModal.open('login');
        return;
      }
      openVaultModal({ router: hashRouter });
    });
  }

  bindCardActions(container, findDesign); // listener delegado: sobrevive a cada repintado
  render();

  // Sincronización: al publicar / despublicar / borrar en la Bóveda, o al reportar, el Lookbook se repinta
  let syncTimer = 0;
  const resync = () => { clearTimeout(syncTimer); syncTimer = setTimeout(render, 60); };
  window.addEventListener('vault:changed', resync);
  window.addEventListener('reports:changed', resync);
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key === 'shirt_user_vault_db' || e.key === 'shirt_reported_content') resync();
  });
}
