/**
 * Vista dedicada #conocenos (NODE-028): "Quiénes Somos" a pantalla completa, igual que #galeria, #estudio o #login.
 * Cuatro tarjetas (identidad, misión, visión y licencias) con un contenedor de imagen que muestra un skeleton elegante
 * mientras el archivo no exista (`onerror` → `.is-loading`). El CSS se enlaza en el <head> de index.html (sin parpadeo con F5).
 */
import { applyTheme } from './themeToggle.js';
import { ABOUT_CARDS, ABOUT_LEAD, ABOUT_TITLE_LEAD, ABOUT_TITLE_GLOW } from '../config/aboutContent.js';
import { getAssetPath } from '../config/paths.js';

const LOGO_SRC = getAssetPath('assets/new_brand_logo_nav.webp');
const PENDING_LABEL = 'Ilustración en camino';

/** Las imágenes pasan siempre por estos dos manejadores: `onload` apaga el shimmer y `onerror` deja el placeholder. */
const imageBox = ({ src, alt }) => `
  <div class="about-card-image-box" data-label="${PENDING_LABEL}">
    <img src="${getAssetPath(src)}" alt="${alt}" class="about-card-img" loading="lazy" decoding="async"
      onload="this.parentElement.classList.add('is-ready')"
      onerror="this.parentElement.classList.add('is-loading')" />
  </div>`;

const card = (c) => `
  <article class="about-card${c.legal ? ' about-card--legal' : ''}" data-card="${c.id}">
    ${imageBox(c.img)}
    <div class="about-card-body">
      <div class="about-card-badge-row">
        <div class="about-card-icon" aria-hidden="true">${c.icon}</div>
        <span class="about-tag-pill">${c.tag}</span>
      </div>
      <h2 class="about-card-title">${c.title}</h2>
      <p class="about-card-desc">${c.desc}</p>
      <div class="about-chips-list">${c.chips.map((chip) => `<span class="about-chip">${chip}</span>`).join('')}</div>
    </div>
  </article>`;

const shell = () => `
  <header class="studio-app-topbar about-topbar">
    <div class="topbar-left-group">
      <button type="button" class="btn-back-to-store" data-about="back" title="Volver a la tienda">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Volver a la Tienda</span>
      </button>
      <div class="about-brand brand-kinetic">
        <img src="${LOGO_SRC}" alt="IMPRNT [LAB]" class="about-brand-logo" width="24" height="24" style="filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.45));" />
        <span class="brand-title" style="font-size: 0.95rem;">IMPRNT</span>
        <span class="brand-lab-cyan" style="font-size: 0.74rem;">[LAB]</span>
      </div>
    </div>
    <button type="button" class="btn-theme-toggle" title="Cambiar tema" aria-label="Cambiar tema"></button>
  </header>
  <main class="about-main" aria-labelledby="about-title">
    <section class="about-hero">
      <span class="section-eyebrow">ATELIER DIGITAL & MANIFIESTO</span>
      <h1 class="about-title" id="about-title">${ABOUT_TITLE_LEAD}<span class="about-title-glow">${ABOUT_TITLE_GLOW.replace('On-Demand', '<span class="about-nowrap">On-Demand</span>')}</span></h1>
      <p class="about-lead">${ABOUT_LEAD}</p>
    </section>
    <div class="about-grid">${ABOUT_CARDS.map(card).join('')}</div>
    <div class="about-cta-row">
      <button type="button" class="btn-hero-primary" data-action="open-studio"><span>🚀 Diseña tu Estilo en 3D</span></button>
      <a href="#galeria" class="btn-hero-secondary about-cta-secondary" data-action="open-gallery"><span>✨ Ver Galería de Diseños</span></a>
    </div>
  </main>`;

export class AboutFullscreenView {
  /** @param {HTMLElement} mount `#about-view` @param {{closeAbout?: Function}} router */
  constructor(mount, router) {
    this.mount = mount;
    this.router = router;
    this.built = false;
  }

  build() {
    this.mount.innerHTML = shell();
    this.mount.addEventListener('click', (e) => {
      if (e.target.closest('[data-about="back"]')) this.router?.closeAbout?.();
    });
    this.built = true;
  }

  open() {
    if (!this.built) this.build();
    applyTheme(document.documentElement.getAttribute('data-theme') || 'dark', false); // icono correcto en el botón de tema
    this.mount.scrollTop = 0;
  }

  close() { /* sin estado que liberar: la vista es estática */ }
}
