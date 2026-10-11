import { ShirtEngine } from './three/engine.js';
import { initColorPicker } from './ui/colorPicker.js';
import { initDecalUploader } from './ui/decalUploader.js';
import { initDecalControls } from './ui/decalControls.js';
import { initViewSwitcher } from './ui/viewSwitcher.js';
import { initSilhouetteSelector } from './ui/silhouetteSelector.js';
import { initPricingBar } from './ui/pricingBar.js';
import { initThemeToggle } from './ui/themeToggle.js';
import { openOrderModal } from './ui/orderModal.js';
import { openOrdersModal } from './ui/ordersModal.js';
import { setActiveZone, setActiveView, setDecal, setColor } from './state/actions.js';
import { store } from './state/store.js';
import { DECAL_PRESETS, svgToDataUrl } from './config/presets.js';
import { FABRIC_COLORS } from './config/colors.js';
import { StudioLoader } from './ui/studioLoader.js';

function startStudio() {
  console.log('[Studio] Inicializando Atelier 3D en página dedicada...');

  // 1. Selector de tema Claro / Oscuro
  initThemeToggle();

  // 2. Loader Cyber-Luxury de alto impacto
  const loaderMount = document.getElementById('studio-loader-mount');
  const loader = new StudioLoader(loaderMount);

  // 3. Motor 3D WebGL a pantalla completa
  const canvasContainer = document.getElementById('canvas-container');
  let engine = null;
  if (canvasContainer) {
    engine = new ShirtEngine(canvasContainer);
    window.engine = engine;
  }
  window.store = store;

  // 4. Componentes UI del estudio
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

  // 5. Sincronización de las 4 pestañas de zonas (Frente, Espalda, Manga Izq, Manga Der)
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

  // 6. Cargar preset y color inicial (desde URL o por defecto)
  const params = new URLSearchParams(window.location.search);
  const paramPresetId = params.get('preset');
  const paramColorHex = params.get('color');

  if (paramColorHex) {
    const matchedColor = FABRIC_COLORS.find(c => c.hex.toLowerCase() === paramColorHex.toLowerCase());
    if (matchedColor) {
      setColor(matchedColor);
    }
  }

  const initialPreset = (paramPresetId && DECAL_PRESETS.find(p => p.id === paramPresetId)) || DECAL_PRESETS[0];
  if (initialPreset) {
    const dataUrl = svgToDataUrl(initialPreset.svg);
    const img = new Image();
    img.onload = () => {
      setDecal('front', {
        name: initialPreset.name,
        src: dataUrl,
        imageElement: img
      });
    };
    img.src = dataUrl;
  }

  // Reproducir cyber loader de bienvenida en carga inicial
  if (loader) {
    loader.play(1350);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startStudio);
} else {
  startStudio();
}
