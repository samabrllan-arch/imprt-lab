import { SceneManager } from './scene.js';
import { CameraManager } from './camera.js';
import { StudioLighting } from './lights.js';
import { GltfShirtLoader } from './gltfShirtLoader.js';
import { TextureComposer } from '../textures/textureComposer.js';
import { AmbientParticleSystem } from './particles.js';
import { CanvasDragController } from './canvasDragController.js';
import { ModelSwapController, MODEL_URLS } from './modelSwap.js';
import { store } from '../state/store.js';
import { particleCount } from './deviceProfile.js';

export class ShirtEngine {
  constructor(container) {
    this.container = container;

    // 1. Iniciar gestor de escena y compositor de texturas
    this.sceneManager = new SceneManager(container);
    this.textureComposer = new TextureComposer(2048);

    // 2. Iniciar cámara, luces y partículas de showroom
    this.cameraManager = new CameraManager(container, this.sceneManager.renderer.domElement);
    this.lighting = new StudioLighting(this.sceneManager.scene);
    this.particles = new AmbientParticleSystem(this.sceneManager.scene, particleCount()); // 40 en móvil, 160 en escritorio

    // 3. Controlador de arrastre táctil / ratón en pantalla (Drag & Drop)
    this.dragController = new CanvasDragController(container);

    // 4. Inicializar grupo activo directamente para el modelo CLO3D real
    this.activeMeshGroup = null;

    // 5. Cargar modelo masculino original CLO3D con compresión Draco y controlador de intercambio
    this.gltfLoader = new GltfShirtLoader();
    this.modelSwap = new ModelSwapController(this, container);
    this.loadCloModel(MODEL_URLS.man);

    // 5. Conectar loop de animación con partículas y oscilación armónica
    let elapsed = 0;
    this.sceneManager.addUpdateCallback((delta) => {
      elapsed += delta;
      this.cameraManager.update(delta);
      this.particles.update(delta);

      // Flotación sutil de showroom en el modelo activo (solo en modo 3D)
      if (this.activeMeshGroup) {
        const isFlat = store.getState().viewMode === 'flat';
        this.activeMeshGroup.position.y = isFlat ? 0.0 : -0.02 + Math.sin(elapsed * 1.3) * 0.005;
      }
    });

    const isStudioInitial = (window.location.hash || '').toLowerCase().includes('estudio') ||
                            document.documentElement.classList.contains('route-studio');
    if (isStudioInitial) {
      this.sceneManager.startLoop(this.cameraManager.camera);
    }

    // 6. Suscribirse a cambios del store reactivo
    this.unsubscribe = store.subscribe((state, changeKey) => {
      this.handleStateChange(state, changeKey);
    });

    // Render inicial
    this.textureComposer.compose(store.getState());
  }

  async loadCloModel(url) {
    try {
      console.log('[ShirtEngine] Cargando modelo real CLO3D desde:', url);
      if (this.modelSwap) {
        this.modelSwap.showOverlay('Cargando silueta masculina • Boxy Fit...');
      }
      const result = await this.gltfLoader.loadModel(url, this.textureComposer.getTexture());
      if (result && result.scene) {
        if (this.activeMeshGroup) {
          this.sceneManager.scene.remove(this.activeMeshGroup);
        }
        this.activeMeshGroup = result.scene;
        this.sceneManager.scene.add(this.activeMeshGroup);
        this.cloModelInstance = result;
        if (this.modelSwap) {
          this.modelSwap.cache.set(url, result);
          this.modelSwap.schedulePreloadOther('man');
          setTimeout(() => this.modelSwap.hideOverlay(), 250);
        }

        // Ocultar indicador de carga suavemente
        const loader = document.getElementById('studio-canvas-loader');
        if (loader) {
          loader.classList.add('fade-out');
          setTimeout(() => loader.remove(), 400);
        }

        // Sincronizar el color base de la tela interior
        const currentColor = store.getState().selectedColor;
        if (result.material?.userData?.uBaseFabricColor && currentColor?.hex) {
          result.material.userData.uBaseFabricColor.value.set(currentColor.hex);
        }

        this.textureComposer.compose(store.getState());
        console.log('[ShirtEngine] Modelo real de CLO3D renderizándose en escena.');
      }
    } catch (err) {
      console.error('[ShirtEngine] Error al cargar modelo CLO3D:', err);
      if (this.modelSwap) this.modelSwap.hideOverlay();
    }
  }

  /**
   * Permite cambiar entre silueta de Hombre (Boxy Fit) y Mujer (Slim Fit) con transición
   */
  switchModel(modelKey = 'man', state = store.getState()) {
    if (this.modelSwap) {
      this.modelSwap.swapTo(modelKey, state);
    }
  }

  /**
   * Agrupa recomposiciones de textura: aunque lleguen decenas de eventos de
   * slider/arrastre por frame, se compone una sola vez por frame de animación.
   */
  scheduleCompose() {
    if (this._composeQueued) return;
    this._composeQueued = true;
    requestAnimationFrame(() => {
      this._composeQueued = false;
      this.textureComposer.compose(store.getState());
    });
  }

  handleStateChange(state, changeKey) {
    if (changeKey === 'silhouette') {
      this.switchModel(state.selectedSilhouette, state);
    }

    if (changeKey === 'color') {
      if (this.cloModelInstance?.material?.userData?.uBaseFabricColor && state.selectedColor?.hex) {
        this.cloModelInstance.material.userData.uBaseFabricColor.value.set(state.selectedColor.hex);
      }
    }

    if (changeKey === 'color' || changeKey === 'size' || (changeKey && (changeKey.startsWith('decal:') || changeKey.startsWith('transform:')))) {
      this.scheduleCompose();
    }

    if (changeKey === 'view') {
      if (state.viewMode === 'flat') {
        this.cameraManager.setFlatMode(true, state.activeView);
      } else {
        this.cameraManager.flyToView(state.activeView);
      }
    }

    if (changeKey === 'viewMode') {
      const isFlat = state.viewMode === 'flat';
      this.cameraManager.setFlatMode(isFlat, state.activeView);
      if (isFlat && this.activeMeshGroup) {
        this.activeMeshGroup.position.y = 0;
      }
    }

    if (changeKey === 'autoRotate') {
      this.cameraManager.setAutoRotate(state.isAutoRotate);
    }
  }

  setView(viewName) {
    this.cameraManager.flyToView(viewName);
  }

  /**
   * Captura una foto HD en base64 del modelo 3D con el diseño
   */
  captureScreenshot() {
    this.sceneManager.renderer.render(this.sceneManager.scene, this.cameraManager.camera);
    return this.sceneManager.renderer.domElement.toDataURL('image/png', 0.95);
  }

  /** El router lo llama al abrir/cerrar el estudio: el bucle corre solo con el estudio a la vista (idempotente). */
  setStudioVisible(visible) {
    if (visible) this.sceneManager.startLoop(this.cameraManager.camera);
    else this.sceneManager.stopLoop();
  }

  /**
   * Suspende el bucle WebGL mientras otra ventana (editor de imágenes) ocupa la pantalla y recuerda si estaba activo.
   * Idempotente: una segunda llamada sin `resumeRender()` no pisa el estado guardado.
   */
  pauseRender() {
    if (this._renderPaused) return;
    this._renderPaused = true;
    this._wasRunning = this.sceneManager.isRunning;
    this.sceneManager.stopLoop();
  }

  /** Reanuda el bucle solo si estaba corriendo antes de `pauseRender()` (en el landing no se debe iniciar). */
  resumeRender() {
    if (!this._renderPaused) return;
    this._renderPaused = false;
    if (this._wasRunning) this.sceneManager.startLoop(this.cameraManager.camera);
    this._wasRunning = false;
  }

  dispose() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.particles) this.particles.dispose();
    this.sceneManager.dispose();
    this.cameraManager.dispose();
    if (this.modelSwap) this.modelSwap.dispose();
    if (this.cloModelInstance) this.cloModelInstance.dispose();
    this.gltfLoader.dispose();
    this.textureComposer.dispose();
  }
}
