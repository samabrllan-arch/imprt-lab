/**
 * Enrutador de Vistas: Alterna limpiamente entre Landing Page, Estudio 3D, Galería, Conócenos y Auth Fullscreen
 */
import { openGallery, closeGallery } from './appRouterGallery.js';
import { openAbout, closeAbout } from './appRouterAbout.js';
import { bindViewTriggers } from './appRouterTriggers.js';

export class AppRouter {
  constructor({ engine, loader }) {
    this.engine = engine;
    this.loader = loader;
    this.landingView = document.getElementById('landing-view');
    this.studioView = document.getElementById('studio-view');
    this.authView = document.getElementById('auth-view');
    this.galleryView = document.getElementById('gallery-view');
    this.aboutView = document.getElementById('about-view');
    this.authController = null;
    this.galleryController = null;
    this.aboutController = null;
    this.isStudioOpen = false;
    this.isAuthOpen = false;
    this.isGalleryOpen = false;
    this.isAboutOpen = false;
    this.landingScrollY = 0;

    this.initEvents();
  }

  setAuthController(controller) {
    this.authController = controller;
  }

  setGalleryController(controller) {
    this.galleryController = controller;
  }

  setAboutController(controller) {
    this.aboutController = controller;
  }

  openGallery(pushHash = true) { openGallery(this, pushHash); }
  closeGallery(updateHash = true) { closeGallery(this, updateHash); }
  openAbout(pushHash = true) { openAbout(this, pushHash); }
  closeAbout(updateHash = true) { closeAbout(this, updateHash); }

  initEvents() {
    // 1. Escuchar cambios de hash (#estudio, #galeria, #conocenos, #cuenta, #login, #registro)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#galeria') {
        this.openGallery(false);
      } else if (hash === '#conocenos' || hash === '#nosotros') {
        this.openAbout(false);
      } else if (hash === '#estudio' || hash === '#disenar') {
        if (this.isAuthOpen) this.closeAuth(false);
        this.openStudio();
      } else if (hash === '#cuenta' || hash === '#login' || hash === '#registro') {
        if (this.isStudioOpen) this.closeStudio(false);
        this.openAuth(hash === '#registro' ? 'register' : 'login');
      } else if (hash === '' || hash === '#' || hash === '#hero') {
        if (this.isStudioOpen) this.closeStudio();
        if (this.isAuthOpen) this.closeAuth();
        if (this.isGalleryOpen) this.closeGallery(false);
        if (this.isAboutOpen) this.closeAbout(false);
      }
    });

    // 2. Interceptar clicks de los disparadores (data-action / enlaces #estudio, #galeria, #conocenos, #login…)
    bindViewTriggers(this);

    // 3. Botón volver a la tienda en Estudio
    const btnBack = document.getElementById('btn-back-to-store');
    if (btnBack) {
      btnBack.addEventListener('click', () => this.closeStudio());
    }

    // 4. Tecla ESC para volver a la tienda si no hay modales abiertos
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const hasOpenModal = document.querySelector('.modal-overlay.active, .image-editor-modal.active');
        if (hasOpenModal) return;
        if (this.isAuthOpen) this.closeAuth();
        else if (this.isGalleryOpen) this.closeGallery();
        else if (this.isAboutOpen) this.closeAbout();
        else if (this.isStudioOpen) this.closeStudio();
      }
    });
  }

  checkInitialRoute() {
    const hash = (window.location.hash || '').toLowerCase();
    let savedView = null;
    let savedAuthTab = null;
    try {
      savedView = sessionStorage.getItem('shirt_current_view');
      savedAuthTab = sessionStorage.getItem('shirt_auth_tab');
    } catch (_) {}

    if (hash.includes('galeria')) {
      this.openGallery(false);
      return;
    }
    if (hash.includes('conocenos') || hash.includes('nosotros')) {
      this.openAbout(false);
      return;
    }

    const isAuth = hash.includes('login') || hash.includes('registro') || hash.includes('cuenta') || savedView === 'auth';
    const isStudio = hash.includes('estudio') || hash.includes('disenar') || savedView === 'studio' || document.documentElement.classList.contains('route-studio');

    if (isAuth) {
      const tab = (hash.includes('registro') || savedAuthTab === 'register') ? 'register' : 'login';
      this.openAuth(tab, false);
    } else if (isStudio) {
      this.openStudio(false);
    } else if (savedView === 'gallery') {
      this.openGallery(false);
    } else if (savedView === 'about') {
      this.openAbout(false);
    }

    if (!this.isStudioOpen && this.engine?.sceneManager) {
      this.engine.sceneManager.stopLoop();
    }
  }

  async openStudio(withAnimation = true) {
    if (this.isStudioOpen) return;
    if (this.isAuthOpen) this.closeAuth(false);
    this.isStudioOpen = true;
    if (this.isGalleryOpen) this.closeGallery(false);
    if (this.isAboutOpen) this.closeAbout(false);

    document.documentElement.classList.add('route-studio');
    document.documentElement.classList.remove('route-auth');
    try {
      sessionStorage.setItem('shirt_current_view', 'studio');
      sessionStorage.removeItem('shirt_auth_tab');
    } catch (_) {}

    if (window.location.hash !== '#estudio') {
      history.pushState(null, '', '#estudio');
    }

    if (withAnimation && this.loader) {
      await this.loader.play(1350);
    }

    if (this.landingView) this.landingView.style.display = 'none';
    if (this.studioView) {
      this.studioView.style.display = 'flex';
      const ws = this.studioView.querySelector('.studio-fullscreen-workspace');
      if (ws) ws.scrollTop = 0;
      window.scrollTo(0, 0);
    }

    if (this.engine?.sceneManager && this.engine.cameraManager) {
      this.engine.sceneManager.startLoop(this.engine.cameraManager.camera);
    }

    this.engine?.setStudioVisible?.(true); // el bucle WebGL corre solo con el estudio a la vista

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (this.engine && this.engine.sceneManager) {
        this.engine.sceneManager.handleResize();
      }
    }, 60);
  }

  closeStudio(updateHash = true) {
    if (!this.isStudioOpen) return;
    this.isStudioOpen = false;

    if (this.engine?.sceneManager) {
      this.engine.sceneManager.stopLoop();
    }

    document.documentElement.classList.remove('route-studio');
    try { sessionStorage.removeItem('shirt_current_view'); } catch (_) {}

    if (updateHash) history.pushState(null, '', window.location.pathname);

    if (this.studioView) this.studioView.style.display = 'none';
    this.engine?.setStudioVisible?.(false); // sin estudio visible no hay nada que dibujar: ahorra GPU y batería
    if (!this.isAuthOpen && this.landingView) this.landingView.style.display = 'block';

    window.dispatchEvent(new Event('resize'));
  }

  openAuth(tab = 'login', pushHash = true) {
    if (this.isStudioOpen) this.closeStudio(false);
    this.isAuthOpen = true;
    if (this.isGalleryOpen) this.closeGallery(false);
    if (this.isAboutOpen) this.closeAbout(false);

    document.documentElement.classList.add('route-auth');
    document.documentElement.classList.remove('route-studio');
    try {
      sessionStorage.setItem('shirt_current_view', 'auth');
      sessionStorage.setItem('shirt_auth_tab', tab);
    } catch (_) {}

    if (pushHash && !window.location.hash.includes(tab)) {
      history.pushState(null, '', `#${tab}`);
    }

    if (this.authController) {
      this.authController.switchTab(tab);
      this.authController.startParticles?.();
    }

    if (this.landingView) this.landingView.style.display = 'none';
    if (this.authView) {
      this.authView.style.display = 'flex';
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        this.authView.classList.add('active');
      });
    }
  }

  closeAuth(updateHash = true) {
    if (!this.isAuthOpen) return;
    this.isAuthOpen = false;

    document.documentElement.classList.remove('route-auth');
    try {
      sessionStorage.removeItem('shirt_current_view');
      sessionStorage.removeItem('shirt_auth_tab');
    } catch (_) {}

    if (updateHash) history.pushState(null, '', window.location.pathname);

    if (this.authView) {
      this.authController?.stopParticles?.();
      this.authView.classList.remove('active');
      setTimeout(() => {
        if (!this.isAuthOpen) this.authView.style.display = 'none';
      }, 260);
    }

    if (!this.isStudioOpen && this.landingView) {
      this.landingView.style.display = 'block';
    }
  }
}
