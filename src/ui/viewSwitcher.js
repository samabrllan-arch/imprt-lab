import { ZONES } from '../config/zones.js';
import { setActiveView, setActiveZone, toggleAutoRotate, setViewMode } from '../state/actions.js';
import { store } from '../state/store.js';

export function initViewSwitcher(container) {
  const views = [
    { id: 'front', label: 'Frente', icon: '👕' },
    { id: 'back', label: 'Espalda', icon: '🔙' },
    { id: 'free', label: 'Libre 360°', icon: '🔄' }
  ];

  const html = `
    <div class="view-switcher-bar modern-hud-dock">
      <!-- Grupo de Ángulos de Cámara -->
      <div class="view-buttons-group">
        ${views.map(v => `
          <button 
            type="button" 
            class="view-btn ${v.id === 'front' ? 'active' : ''}" 
            data-view-id="${v.id}"
            title="Ver ${v.label}"
          >
            <span class="view-icon">${v.icon}</span>
            <span class="view-text">${v.label}</span>
          </button>
        `).join('')}
      </div>

      <div class="hud-divider"></div>

      <!-- Selector de Modo: 3D vs Plano (Mockup 2D) -->
      <div class="mode-buttons-group">
        <button type="button" class="mode-btn active" data-mode="3d" title="Modo 3D Interactivo 360°">
          <span class="mode-icon">🌐</span>
          <span class="mode-text">3D</span>
        </button>
        <button type="button" class="mode-btn" data-mode="flat" title="Modo Técnico Plano (Flat Lay)">
          <span class="mode-icon">📐</span>
          <span class="mode-text">Plano</span>
        </button>
      </div>

      <div class="hud-divider"></div>

      <!-- Toggle Partículas -->
      <button type="button" id="btn-particles" class="action-circle-btn" title="Activar partículas ambientales">
        <span class="particles-icon">✨</span>
      </button>

      <!-- Giro Automático -->
      <button type="button" id="btn-autorotate" class="action-circle-btn" title="Activar/Desactivar giro continuo">
        <span class="spin-icon">💫</span>
      </button>
    </div>
  `;

  container.innerHTML = html;

  const viewBtns = container.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-view-id');
      setActiveView(viewId);
      if (ZONES[viewId]) {
        setActiveZone(viewId);
      }
    });
  });

  const modeBtns = container.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      setViewMode(mode);
    });
  });

  const autoRotateBtn = container.querySelector('#btn-autorotate');
  autoRotateBtn.addEventListener('click', () => {
    toggleAutoRotate();
  });

  // Control de Partículas Ambientales
  const particlesBtn = container.querySelector('#btn-particles');
  let particlesOn = false;
  particlesBtn.addEventListener('click', () => {
    particlesOn = !particlesOn;
    particlesBtn.classList.toggle('active', particlesOn);
    particlesBtn.title = particlesOn ? 'Desactivar partículas' : 'Activar partículas';
    if (window.engine && window.engine.particles) {
      window.engine.particles.setVisible(particlesOn);
    }
  });

  store.subscribe((state, changeKey) => {
    if (changeKey === 'view') {
      viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view-id') === state.activeView);
      });
    }

    if (changeKey === 'viewMode') {
      modeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === state.viewMode);
      });
    }

    if (changeKey === 'autoRotate') {
      autoRotateBtn.classList.toggle('active', state.isAutoRotate);
    }
  });
}
