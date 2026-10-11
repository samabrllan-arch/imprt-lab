import { setSilhouette } from '../state/actions.js';
import { store } from '../state/store.js';

/**
 * Selector flotante de silueta 3D (Hombre Boxy Fit vs Mujer Slim Fit)
 * Ubicado en la barra superior del visor 3D junto a la indicación de rotación 360°.
 */
export function initSilhouetteSelector(container) {
  if (!container) return;
  let current = store.getState().selectedSilhouette || 'man';

  container.innerHTML = `
    <div class="silhouette-viewport-dock" id="silhouette-switcher-dock" role="group" aria-label="Selección de Silueta">
      <button 
        type="button" 
        class="btn-silhouette-top ${current === 'man' ? 'active' : ''}" 
        data-silhouette="man"
        title="Silueta Oversized Boxy Fit Masculina"
      >
        <span class="sil-icon">👕</span>
        <span class="sil-label">Hombre <span class="sil-fit">(Boxy Fit)</span></span>
      </button>
      <button 
        type="button" 
        class="btn-silhouette-top ${current === 'woman' ? 'active' : ''}" 
        data-silhouette="woman"
        title="Silueta Slim Fit Femenina"
      >
        <span class="sil-icon">👚</span>
        <span class="sil-label">Mujer <span class="sil-fit">(Slim Fit)</span></span>
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
      setSilhouette(target);
    });
  });

  store.subscribe((state, changeKey) => {
    if (changeKey === 'silhouette') {
      current = state.selectedSilhouette;
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-silhouette') === current);
      });
    }
  });
}
