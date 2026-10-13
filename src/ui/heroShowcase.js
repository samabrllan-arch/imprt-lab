import { DECAL_PRESETS } from '../config/presets.js';
import { FABRIC_COLORS } from '../config/colors.js';
import { setColor, setSilhouette } from '../state/actions.js';
import { getAssetPath } from '../config/paths.js';

/**
 * Showcase Interactivo del Hero con Render 3D de Camiseta Masculina, Femenina y Taza 11 Oz
 */
export function initHeroShowcase(container) {
  if (!container) return;

  let currentGender = 'man'; // 'man' | 'woman' | 'mug'
  let currentColorKey = 'black';

  const showcaseColors = [
    { key: 'black', name: 'Negro Grafito', hex: '#121214' },
    { key: 'white', name: 'Blanco Puro', hex: '#ffffff' },
    { key: 'carbon', name: 'Gris Carbón', hex: '#2b2a33' },
    { key: 'green', name: 'Verde Bosque', hex: '#203328' },
    { key: 'navy', name: 'Azul Marino', hex: '#1e293b' }
  ];

  const heroPreset = DECAL_PRESETS[0]; // brand-logo oficial

  const mugSvgDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="mugBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e222d"/>
          <stop offset="35%" stop-color="#2e3444"/>
          <stop offset="75%" stop-color="#141720"/>
          <stop offset="100%" stop-color="#0b0d13"/>
        </linearGradient>
        <linearGradient id="mugRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <radialGradient id="heatGlow" cx="50%" cy="65%" r="48%">
          <stop offset="0%" stop-color="#ff5722" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#ff5722" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="190" cy="220" r="150" fill="url(#heatGlow)"/>
      <!-- Asa derecha -->
      <path d="M 272 135 C 342 135, 342 285, 272 285" fill="none" stroke="#181b24" stroke-width="26" stroke-linecap="round"/>
      <path d="M 272 135 C 332 135, 332 285, 272 285" fill="none" stroke="#2d3343" stroke-width="8" stroke-linecap="round"/>
      <!-- Cuerpo cilíndrico 11 Oz -->
      <rect x="95" y="92" width="185" height="228" rx="18" fill="url(#mugBody)" stroke="rgba(255,87,34,0.45)" stroke-width="2"/>
      <!-- Boca interior de porcelana blanca -->
      <ellipse cx="187.5" cy="94" rx="91" ry="18" fill="url(#mugRim)" stroke="#334155" stroke-width="2"/>
      <!-- Onda termosensible -->
      <path d="M 96 235 Q 142 222, 188 235 T 279 232 L 279 304 Q 279 318, 264 318 L 111 318 Q 96 318, 96 304 Z" fill="rgba(255,87,34,0.18)"/>
      <path d="M 96 235 Q 142 222, 188 235 T 279 232" fill="none" stroke="#ff6d3a" stroke-width="3"/>
    </svg>
  `);

  function getImagePath(gender, colorKey) {
    if (gender === 'mug') return mugSvgDataUrl;
    return getAssetPath(`assets/showcase/shirt_${gender}_${colorKey}.webp`);
  }

  function getBadgeText() {
    if (currentGender === 'mug') return 'TAZA 11 OZ • CLÁSICA & MÁGICA';
    return currentGender === 'man' ? 'HOMBRE • BOXY FIT OVERSIZE' : 'MUJER • SLIM FIT ENTALLADO';
  }

  function getTechTagText() {
    if (currentGender === 'mug') return '✨ REVELA CON CALOR';
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

          <!-- Selector Rápido de Producto (Hombre / Mujer / Taza 11 Oz) -->
          <div class="showcase-controls-stack">
            <div class="showcase-gender-bar" role="group" aria-label="Selección de producto">
              <button type="button" class="gender-btn ${currentGender === 'man' ? 'active' : ''}" data-gender="man">
                <span>👕 Hombre</span>
              </button>
              <button type="button" class="gender-btn ${currentGender === 'woman' ? 'active' : ''}" data-gender="woman">
                <span>👚 Mujer</span>
              </button>
              <button type="button" class="gender-btn ${currentGender === 'mug' ? 'active' : ''}" data-gender="mug">
                <span>☕ Taza 11 Oz</span>
              </button>
            </div>
          </div>

          <!-- Prenda / Taza 3D Renderizada con Logo Oficial -->
          <div class="showcase-shirt-container">
            <img 
              id="hero-shirt-img" 
              src="${getImagePath(currentGender, currentColorKey)}" 
              alt="Producto Oficial IMPRNT [LAB]"
              class="showcase-shirt-render"
              loading="eager"
            />

            <!-- Logo Oficial de la Empresa -->
            <div class="showcase-shirt-art brand-logo-art" title="${heroPreset?.name || 'IMPRNT [LAB]'}">
              ${heroPreset?.src ? `<img src="${heroPreset.src}" alt="${heroPreset.name}" style="width:100%;height:100%;object-fit:contain;" />` : (heroPreset ? heroPreset.svg : '')}
            </div>
          </div>

          <!-- Selector de Colores en Tiempo Real -->
          <div class="showcase-color-bar" title="Cambiar color base">
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
            <span id="showcase-cta-label">Personalizar en Estudio 3D</span>
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
    const ctaLabel = container.querySelector('#showcase-cta-label');
    const colorBtns = container.querySelectorAll('.showcase-color-btn');
    const genderBtns = container.querySelectorAll('.gender-btn');

    function syncBadges() {
      if (badgeTitle) badgeTitle.textContent = getBadgeText();
      if (techTag) techTag.textContent = getTechTagText();
      if (ctaLabel) {
        ctaLabel.textContent = currentGender === 'mug'
          ? '☕ Personalizar Taza 11 Oz en 3D'
          : 'Personalizar en Estudio 3D';
      }
    }

    // Cambio de producto (Hombre / Mujer / Taza 11 Oz)
    genderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const gender = btn.getAttribute('data-gender');
        currentGender = gender;
        setSilhouette(gender);
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
