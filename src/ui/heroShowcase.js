import { DECAL_PRESETS } from '../config/presets.js';
import { FABRIC_COLORS } from '../config/colors.js';
import { setColor } from '../state/actions.js';

/**
 * Showcase Interactivo del Hero con Render 3D de Camiseta Masculina (Boxy Fit)
 * Renders fotorealistas generados desde el modelo 3D con iluminación de estudio.
 */
export function initHeroShowcase(container) {
  if (!container) return;

  let currentGender = 'man'; // 'man' | 'woman'
  let currentColorKey = 'black';

  const showcaseColors = [
    { key: 'black', name: 'Negro Grafito', hex: '#121214' },
    { key: 'white', name: 'Blanco Puro', hex: '#ffffff' },
    { key: 'carbon', name: 'Gris Carbón', hex: '#2b2a33' },
    { key: 'green', name: 'Verde Bosque', hex: '#203328' },
    { key: 'navy', name: 'Azul Marino', hex: '#1e293b' }
  ];

  const heroPreset = DECAL_PRESETS[0]; // brand-logo oficial

  function getImagePath(gender, colorKey) {
    return `/assets/showcase/shirt_${gender}_${colorKey}.webp`;
  }

  function getBadgeText() {
    return currentGender === 'man' ? 'HOMBRE • BOXY FIT OVERSIZE' : 'MUJER • SLIM FIT ENTALLADO';
  }

  function getTechTagText() {
    return currentGender === 'man' ? '★ CORTE STREETWEAR' : '★ SILUETA FEMENINA';
  }

  function render() {
    container.innerHTML = `
      <div class="hero-showcase-wrapper">
        <div class="hero-showcase-stage" id="hero-stage-card">
          <!-- Barra Superior del Showcase -->
          <div class="stage-header-row">
            <div class="stage-top-badge">
              <span class="stage-live-dot"></span>
              <span id="showcase-badge-title">${getBadgeText()}</span>
            </div>
            <div class="stage-tech-tag" id="showcase-tech-tag">${getTechTagText()}</div>
          </div>

          <!-- Selector Rápido de Silueta (Hombre / Mujer) -->
          <div class="showcase-controls-stack">
            <div class="showcase-gender-bar" role="group" aria-label="Selección de silueta">
              <button type="button" class="gender-btn ${currentGender === 'man' ? 'active' : ''}" data-gender="man">
                <span>Hombre</span>
              </button>
              <button type="button" class="gender-btn ${currentGender === 'woman' ? 'active' : ''}" data-gender="woman">
                <span>Mujer</span>
              </button>
            </div>
          </div>

          <!-- Prenda 3D Renderizada con Logo Oficial en el Pecho -->
          <div class="showcase-shirt-container">
            <img 
              id="hero-shirt-img" 
              src="${getImagePath(currentGender, currentColorKey)}" 
              alt="Camiseta Oficial IMPRNT [LAB]"
              class="showcase-shirt-render"
              loading="eager"
            />

            <!-- Logo Oficial de la Empresa en el Pecho -->
            <div class="showcase-shirt-art brand-logo-art" title="${heroPreset?.name || 'IMPRNT [LAB]'}">
              ${heroPreset?.src ? `<img src="${heroPreset.src}" alt="${heroPreset.name}" style="width:100%;height:100%;object-fit:contain;" />` : (heroPreset ? heroPreset.svg : '')}
            </div>
          </div>


          <!-- Selector de Colores en Tiempo Real -->
          <div class="showcase-color-bar" title="Cambiar color de la prenda">
            ${showcaseColors.map(c => `
              <button 
                type="button" 
                class="showcase-color-btn ${currentColorKey === c.key ? 'active' : ''}" 
                data-key="${c.key}" 
                data-hex="${c.hex}" 
                style="background-color: ${c.hex};" 
                title="${c.name}">
              </button>
            `).join('')}
          </div>

          <!-- Botón de Acción Directo al Estudio 3D -->
          <button type="button" class="showcase-action-btn" data-action="open-studio">
            <span>Personalizar en Estudio 3D</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const stage = container.querySelector('#hero-stage-card');
    const shirtImg = container.querySelector('#hero-shirt-img');
    const badgeTitle = container.querySelector('#showcase-badge-title');
    const techTag = container.querySelector('#showcase-tech-tag');
    const colorBtns = container.querySelectorAll('.showcase-color-btn');
    const genderBtns = container.querySelectorAll('.gender-btn');

    function syncBadges() {
      if (badgeTitle) badgeTitle.textContent = getBadgeText();
      if (techTag) techTag.textContent = getTechTagText();
    }

    // Cambio de silueta (Hombre / Mujer)
    genderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const gender = btn.getAttribute('data-gender');
        if (gender === currentGender) return;
        currentGender = gender;
        genderBtns.forEach(b => b.classList.toggle('active', b === btn));
        syncBadges();
        updateShirtImage();
      });
    });

    // Cambio de colores
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        const hex = btn.getAttribute('data-hex');
        currentColorKey = key;

        colorBtns.forEach(b => b.classList.toggle('active', b === btn));
        updateShirtImage();

        const matched = FABRIC_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
        if (matched) setColor(matched);
      });
    });

    function updateShirtImage() {
      if (!shirtImg) return;
      const targetSrc = getImagePath(currentGender, currentColorKey);
      shirtImg.style.opacity = '0.6';
      shirtImg.src = targetSrc;
      shirtImg.onload = () => {
        shirtImg.style.opacity = '1';
      };
    }

    // Efecto 3D Parallax Tilt con el cursor
    if (stage) {
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = (y / rect.height) * -8;
        const rotY = (x / rect.width) * 8;
        stage.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      });

      stage.addEventListener('mouseleave', () => {
        stage.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  render();
}
