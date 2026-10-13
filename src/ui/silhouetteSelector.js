import { setSilhouette } from '../state/actions.js';
import { store } from '../state/store.js';

function syncSidebarForProduct(silhouette) {
  const isMug = silhouette === 'mug';
  const sidebarTitle = document.querySelector('.sidebar-title');
  const fabricTag = document.querySelector('.fabric-tag');
  if (sidebarTitle) sidebarTitle.textContent = isMug ? 'Configuración de Vaso 11 Oz' : 'Configuración de Prenda';
  if (fabricTag) fabricTag.textContent = isMug ? 'Cerámica AAA • Sublimación HD' : 'Heavyweight 240 GSM';

  const frontTab = document.querySelector('.zone-tab-btn[data-zone="front"] .zone-title');
  const pocketTab = document.querySelector('.zone-tab-btn[data-zone="frontPocket"]');
  const backTab = document.querySelector('.zone-tab-btn[data-zone="back"]');
  if (frontTab) frontTab.textContent = isMug ? '☕ Área de Estampado (Vaso 11 Oz)' : 'Frente Central';
  if (pocketTab) pocketTab.style.display = isMug ? 'none' : '';
  if (backTab) backTab.style.display = isMug ? 'none' : '';
}

/**
 * Selector flotante de producto/silueta 3D (Hombre Boxy Fit | Mujer Slim Fit | Vaso 11 Oz)
 */
export function initSilhouetteSelector(container) {
  if (!container) return;
  let current = store.getState().selectedSilhouette || 'man';

  container.innerHTML = `
    <div class="silhouette-viewport-dock" id="silhouette-switcher-dock" role="group" aria-label="Selección de Producto 3D">
      <button 
        type="button" 
        class="btn-silhouette-top ${current === 'man' ? 'active' : ''}" 
        data-silhouette="man"
        title="Camiseta Masculina Oversized Boxy Fit"
      >
        <span class="sil-icon">👕</span>
        <span class="sil-label">Hombre <span class="sil-fit">(Boxy)</span></span>
      </button>
      <button 
        type="button" 
        class="btn-silhouette-top ${current === 'woman' ? 'active' : ''}" 
        data-silhouette="woman"
        title="Camiseta Femenina Slim Fit"
      >
        <span class="sil-icon">👚</span>
        <span class="sil-label">Mujer <span class="sil-fit">(Slim)</span></span>
      </button>
      <button 
        type="button" 
        class="btn-silhouette-top ${current === 'mug' ? 'active' : ''}" 
        data-silhouette="mug"
        title="Vaso / Mug Cerámico 11 Oz (Clásico y Mágico Termosensible)"
      >
        <span class="sil-icon">☕</span>
        <span class="sil-label">Vaso <span class="sil-fit">(11 Oz)</span></span>
      </button>
    </div>
  `;

  const buttons = container.querySelectorAll('.btn-silhouette-top');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-silhouette');
      if (target === current) return;
      current = target;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      syncSidebarForProduct(target);
      setSilhouette(target);
    });
  });

  syncSidebarForProduct(current);

  store.subscribe((state, changeKey) => {
    if (changeKey === 'silhouette') {
      current = state.selectedSilhouette;
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-silhouette') === current);
      });
      syncSidebarForProduct(current);
    }
  });
}
