import { ShirtEngine } from './three/engine.js';
import { initColorPicker } from './ui/colorPicker.js';
import { initDecalUploader } from './ui/decalUploader.js';
import { initDecalControls } from './ui/decalControls.js';
import { initViewSwitcher } from './ui/viewSwitcher.js';
import { initSilhouetteSelector } from './ui/silhouetteSelector.js';
import { initPricingBar } from './ui/pricingBar.js';
import { initLookbook } from './ui/lookbook.js';
import { initThemeToggle } from './ui/themeToggle.js';
import { initFeedbackForm } from './ui/feedbackForm.js';
import { openOrderModal } from './ui/orderModal.js';
import { openOrdersModal } from './ui/ordersModal.js';
import { initOrderDraftResume } from './ui/checkoutOrderFlow.js';
import { setActiveZone, setActiveView, setDecal } from './state/actions.js';
import { store } from './state/store.js';
import { DECAL_PRESETS, svgToDataUrl } from './config/presets.js';
import { StudioLoader } from './ui/studioLoader.js';
import { AppRouter } from './ui/appRouter.js';
import { initCommunityGalleryView } from './ui/communityGalleryView.js';
import { initHeroShowcase } from './ui/heroShowcase.js';
import { initUserProfileMenu } from './ui/userProfileMenu.js';
import { AuthFullscreenView } from './ui/authFullscreenView.js';
import { initFeaturesSection } from './ui/featuresSection.js';
import { AboutFullscreenView } from './ui/aboutFullscreenView.js';
import { initRangeFill } from './ui/rangeFill.js';
import { openLegalTermsModal } from './ui/legalTermsModal.js';
import './styles/navbar.css';
import './styles/navbarMobile.css';
import './styles/authFullscreen.css';

function startApp() {
  console.log('[Main] Inicializando IMPRNT [LAB] Atelier 3D...');

  // 0. Sincronización milimétrica de sliders
  initRangeFill();

  // 1. Selector de tema Claro / Oscuro sincronizado
  initThemeToggle();

  // 2. Showcase interactivo del Hero
  const heroMount = document.getElementById('hero-showcase-mount');
  if (heroMount) initHeroShowcase(heroMount);

  // 3. Galería de trabajos y lookbook
  const lookbookMount = document.getElementById('lookbook-mount');
  if (lookbookMount) initLookbook(lookbookMount);

  // 3.1 Sección de Tecnología Textil & Materiales DTF (Tarjetas fotográficas IA)
  const featuresMount = document.getElementById('features-mount');
  if (featuresMount) initFeaturesSection(featuresMount);

  // 3.2 Buzón de soporte y retroalimentación técnica (sin WhatsApp)
  const feedbackMount = document.getElementById('feedback-mount');
  if (feedbackMount) initFeedbackForm(feedbackMount);

  // 4. Loader Cyber-Luxury de alto impacto
  const loaderMount = document.getElementById('studio-loader-mount');
  const loader = new StudioLoader(loaderMount);

  // 5. Motor 3D WebGL
  const canvasContainer = document.getElementById('canvas-container');
  let engine = null;
  if (canvasContainer) {
    engine = new ShirtEngine(canvasContainer);
    window.engine = engine;
  }
  window.store = store;

  // 6. Enrutador de vistas (Landing <-> Estudio 3D Fullscreen <-> Auth Fullscreen)
  const router = new AppRouter({ engine, loader });

  // 6.1 Vista Dedicada de Autenticación Fullscreen Atelier
  const authViewMount = document.getElementById('auth-view');
  if (authViewMount) {
    const authFullscreen = new AuthFullscreenView(authViewMount, router);
    router.setAuthController(authFullscreen);
  }

  // 6.15 Vista dedicada de la Galería completa (#galeria)
  const galleryMount = document.getElementById('gallery-view');
  if (galleryMount) router.setGalleryController(initCommunityGalleryView(galleryMount, router));

  // 6.16 Vista dedicada "Conócenos" (#conocenos): identidad, misión, visión y licencias
  const aboutMount = document.getElementById('about-view');
  if (aboutMount) router.setAboutController(new AboutFullscreenView(aboutMount, router));

  // 6.2 Montaje del Menú de Usuario en Navbar
  const authMount = document.getElementById('nav-auth-mount');
  if (authMount) initUserProfileMenu(authMount, router);

  // 6.25 Retoma automática del pedido guardado en caché al iniciar sesión (Checkout Atelier)
  initOrderDraftResume();

  // 6.3 Verificación de la ruta inicial una vez los controladores están enlazados
  router.checkInitialRoute();

  // 7. Componentes del estudio 3D
  const colorMount = document.getElementById('color-picker-mount');
  if (colorMount) initColorPicker(colorMount);

  const uploaderMount = document.getElementById('decal-uploader-mount');
  if (uploaderMount) initDecalUploader(uploaderMount);

  const controlsMount = document.getElementById('decal-controls-mount');
  if (controlsMount) initDecalControls(controlsMount);

  const viewSwitcherMount = document.getElementById('view-switcher-mount');
  if (viewSwitcherMount) initViewSwitcher(viewSwitcherMount);

  const silhouetteMount = document.getElementById('silhouette-switcher-mount');
  if (silhouetteMount) initSilhouetteSelector(silhouetteMount);

  const pricingMount = document.getElementById('pricing-bar-mount');
  if (pricingMount) {
    initPricingBar(pricingMount, () => {
      const screenshot = engine ? engine.captureScreenshot() : null;
      openOrderModal(screenshot);
    });
  }

  const btnOrders = document.getElementById('btn-orders-history');
  if (btnOrders) {
    btnOrders.addEventListener('click', () => {
      openOrdersModal();
    });
  }

  // 8. Sincronización de pestañas de zonas (Frente, Espalda, Mangas)
  const zoneTabs = document.querySelectorAll('.zone-tab-btn');
  zoneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const zoneId = tab.getAttribute('data-zone');
      setActiveZone(zoneId);
      setActiveView(zoneId);
    });
  });

  store.subscribe((state, changeKey) => {
    if (changeKey === 'activeZone') {
      zoneTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-zone') === state.activeZone);
      });
    }
  });

  // 9. Cargar arte exportado del laboratorio o preset inicial
  const labExportedArt = sessionStorage.getItem('shirt_lab_exported_art');
  if (labExportedArt) {
    sessionStorage.removeItem('shirt_lab_exported_art');
    const customImg = new Image();
    customImg.onload = () => {
      setDecal('front', {
        name: 'Diseño Personalizado Lab',
        src: labExportedArt,
        imageElement: customImg
      });
    };
    customImg.src = labExportedArt;
  } else {
    const initialPreset = DECAL_PRESETS[0];
    if (initialPreset) {
      const src = initialPreset.src || svgToDataUrl(initialPreset.svg);
      const img = new Image();
      img.onload = () => {
        setDecal('front', {
          name: initialPreset.name,
          src,
          imageElement: img
        });
      };
      img.src = src;
    }
  }

  // 10. Control del Menú Móvil
  const menuBtn = document.getElementById('btn-mobile-menu');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  if (menuBtn && mobileDrawer) {
    const iconOpen = menuBtn.querySelector('.icon-menu-open');
    const iconClose = menuBtn.querySelector('.icon-menu-close');

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      if (iconOpen && iconClose) {
        iconOpen.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
      }
    });

    mobileDrawer.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        if (iconOpen && iconClose) {
          iconOpen.style.display = 'block';
          iconClose.style.display = 'none';
        }
      });
    });
  }

  // 11. Modal de Términos, Privacidad & Propiedad Intelectual en Footer
  document.querySelectorAll('#btn-footer-terms, #btn-footer-terms-bottom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalTermsModal();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
