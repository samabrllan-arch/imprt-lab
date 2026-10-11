import * as THREE from 'three';
import { maxPixelRatio } from './deviceProfile.js';

export class SceneManager {
  constructor(container) {
    this.container = container;

    // Escena principal
    this.scene = new THREE.Scene();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.scene.background = new THREE.Color(currentTheme === 'light' ? '#f0f3f8' : '#08090d');

    window.addEventListener('themechange', (e) => {
      const t = e.detail?.theme || 'dark';
      this.scene.background = new THREE.Color(t === 'light' ? '#f0f3f8' : '#08090d');
    });

    // Renderer WebGL con tone mapping y anti-aliasing de calidad
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Permite captura HD para cotizaciones
    });

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    // DPR adaptativo (NODE-005 v1.5.0): 1.3 en móvil/táctil, 2 en escritorio
    this.renderer.setPixelRatio(maxPixelRatio());
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Callbacks de animación por frame
    this.updateCallbacks = [];
    this.clock = new THREE.Clock();
    this.isRunning = false;
    this._isScrolling = false;
    this._scrollTimeout = 0;

    this._onScroll = () => {
      this._isScrolling = true;
      clearTimeout(this._scrollTimeout);
      this._scrollTimeout = setTimeout(() => {
        this._isScrolling = false;
      }, 120);
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    document.addEventListener('scroll', this._onScroll, { passive: true, capture: true });

    // Listener de redimensión responsive
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  addUpdateCallback(cb) {
    this.updateCallbacks.push(cb);
  }

  startLoop(camera) {
    if (this.isRunning) return;
    this.camera = camera;
    this.isRunning = true;
    this.clock.getDelta(); // descarta el tiempo pausado: sin salto de cámara/partículas al reanudar

    let skipFrame = false;
    const animate = () => {
      if (!this.isRunning) return;
      this.rafId = requestAnimationFrame(animate);

      // Durante scroll veloz, reparte ciclos de GPU con el compositor para evitar tirones
      if (this._isScrolling) {
        skipFrame = !skipFrame;
        if (skipFrame) return;
      }

      const delta = this.clock.getDelta();
      for (const cb of this.updateCallbacks) {
        cb(delta);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  stopLoop() {
    this.isRunning = false;
    // Cancela el fotograma ya agendado: pausar y reanudar en el mismo fotograma no duplica el bucle
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  handleResize() {
    if (!this.container || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.stopLoop();
    window.removeEventListener('resize', this.onResize);
    if (this._onScroll) {
      window.removeEventListener('scroll', this._onScroll);
      document.removeEventListener('scroll', this._onScroll, true);
    }
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
