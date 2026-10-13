import { setSilhouette } from '../state/actions.js';
import { store } from '../state/store.js';

function syncSidebarForProduct(silhouette) {
  const isMug = silhouette === 'mug';
  const sidebarTitle = document.querySelector('.sidebar-title');
  const fabricTag = document.querySelector('.fabric-tag');
  if (sidebarTitle) sidebarTitle.textContent = isMug ? 'Configuración de Taza / Vaso 11 Oz' : 'Configuración de Prenda';
  if (fabricTag) fabricTag.textContent = isMug ? 'Cerámica AAA • Sublimación HD' : 'Heavyweight 240 GSM';

  const frontTab = document.querySelector('.zone-tab-btn[data-zone="front"] .zone-title');
  const pocketTab = document.querySelector('.zone-tab-btn[data-zone="frontPocket"]');
  const backTab = document.querySelector('.zone-tab-btn[data-zone="back"]');
  if (frontTab) frontTab.textContent = isMug ? '☕ Área de Estampado (Taza / Vaso 11 Oz)' : 'Frente Central';
  if (pocketTab) pocketTab.style.display = isMug ? 'none' : '';
  if (backTab) backTab.style.display = isMug ? 'none' : '';

  document.querySelectorAll('[data-silhouette]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-silhouette') === silhouette);
  });
}

/**
 * Selector de producto/silueta 3D en el visor y en el panel lateral (Hombre | Mujer | Taza / Vaso 11 Oz)
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
        title="Taza / Mug Cerámico 11 Oz (Clásico y Mágico Termosensible)"
      >
        <span class="sil-icon">☕</span>
        <span class="sil-label">Taza / Vaso <span class="sil-fit">(11 Oz)</span></span>
      </button>
    </div>
  `;

  // Inyectar también el selector de producto en el encabezado del Sidebar para acceso inmediato
  const sidebarHeader = document.querySelector('.sidebar-header');
  if (sidebarHeader && !document.getElementById('sidebar-product-switcher')) {
    const switcher = document.createElement('div');
    switcher.id = 'sidebar-product-switcher';
    switcher.className = 'sidebar-product-switcher';
    switcher.innerHTML = `
      <button type="button" class="sidebar-prod-btn ${current === 'man' ? 'active' : ''}" data-silhouette="man">
        <span>👕</span><span>Hombre</span>
      </button>
      <button type="button" class="sidebar-prod-btn ${current === 'woman' ? 'active' : ''}" data-silhouette="woman">
        <span>👚</span><span>Mujer</span>
      </button>
      <button type="button" class="sidebar-prod-btn ${current === 'mug' ? 'active' : ''}" data-silhouette="mug">
        <span>☕</span><span>Taza / Vaso 11 Oz</span>
      </button>
    `;
    sidebarHeader.appendChild(switcher);
  }

  function handleSelect(target) {
    if (!target || target === current) return;
    current = target;
    syncSidebarForProduct(target);
    setSilhouette(target);
  }

  document.querySelectorAll('[data-silhouette]').forEach(btn => {
    btn.addEventListener('click', () => handleSelect(btn.getAttribute('data-silhouette')));
  });

  syncSidebarForProduct(current);

  store.subscribe((state, changeKey) => {
    if (changeKey === 'silhouette') {
      current = state.selectedSilhouette;
      syncSidebarForProduct(current);
    }
  });
}
