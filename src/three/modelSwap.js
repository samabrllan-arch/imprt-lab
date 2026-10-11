import { getAssetPath } from '../config/paths.js';

/**
 * Controlador de transición y precarga de siluetas 3D (Hombre Boxy Fit <-> Mujer Slim Fit).
 * Evita cruce visual o UVs desplazadas con un overlay cyber-luxury suave y cache en memoria.
 */

export const MODEL_URLS = {
  get man() { return getAssetPath('models/shirt_clo_draco.glb?v=17'); },
  get woman() { return getAssetPath('models/shirt_woman_seam_draco.glb?v=1'); }
};

export const MODEL_LABELS = {
  man: 'Cargando silueta masculina • Boxy Fit...',
  woman: 'Cargando silueta femenina • Slim Fit...'
};

export class ModelSwapController {
  constructor(engine, container) {
    this.engine = engine;
    this.container = container;
    this.cache = new Map();
    this.swapToken = 0;
    this.currentKey = 'man';
    this.overlay = null;
    this.labelEl = null;

    this.createOverlay();
  }

  createOverlay() {
    if (!this.container) return;
    const overlay = document.createElement('div');
    overlay.className = 'model-swap-overlay';
    overlay.innerHTML = `
      <div class="model-swap-spinner"></div>
      <div class="model-swap-pill" id="model-swap-label">Cargando silueta...</div>
    `;
    this.container.appendChild(overlay);
    this.overlay = overlay;
    this.labelEl = overlay.querySelector('#model-swap-label');
  }

  showOverlay(label) {
    if (this.labelEl && label) this.labelEl.textContent = label;
    if (this.overlay) this.overlay.classList.add('active');
  }

  hideOverlay() {
    if (this.overlay) this.overlay.classList.remove('active');
  }

  /**
   * Precarga en segundo plano la otra silueta para que el cambio sea instantáneo.
   */
  async preload(key) {
    const url = MODEL_URLS[key];
    if (!url || this.cache.has(url)) return;
    try {
      const tex = this.engine.textureComposer.getTexture();
      const loaded = await this.engine.gltfLoader.loadModel(url, tex);
      if (loaded) this.cache.set(url, loaded);
    } catch (err) {
      console.warn(`[ModelSwap] Falló precarga en background para ${key}:`, err);
    }
  }

  schedulePreloadOther(currentKey) {
    const otherKey = currentKey === 'man' ? 'woman' : 'man';
    setTimeout(() => this.preload(otherKey), 1200);
  }

  /**
   * Realiza la transición atómica entre siluetas.
   */
  async swapTo(targetKey, state) {
    if (this.currentKey === targetKey && this.engine.activeMeshGroup) return;

    this.swapToken++;
    const token = this.swapToken;
    const targetUrl = MODEL_URLS[targetKey] || MODEL_URLS.man;
    const label = MODEL_LABELS[targetKey] || 'Cargando silueta...';

    this.showOverlay(label);

    // Ocultar modelo anterior inmediatamente para evitar cruce o solapamiento visual
    if (this.engine.activeMeshGroup) {
      this.engine.activeMeshGroup.visible = false;
    }

    try {
      let result = this.cache.get(targetUrl);
      if (!result) {
        const tex = this.engine.textureComposer.getTexture();
        result = await this.engine.gltfLoader.loadModel(targetUrl, tex);
        if (result) this.cache.set(targetUrl, result);
      }

      // Si el usuario cambió de opinión rápidamente, no montar un modelo obsoleto
      if (token !== this.swapToken) return;

      if (result && result.scene) {
        // 1. Quitar modelo anterior de la escena de Three.js
        if (this.engine.activeMeshGroup) {
          this.engine.sceneManager.scene.remove(this.engine.activeMeshGroup);
        }

        // 2. Montar nuevo modelo
        result.scene.visible = true;
        this.engine.activeMeshGroup = result.scene;
        this.engine.cloModelInstance = result;
        this.engine.sceneManager.scene.add(result.scene);
        this.currentKey = targetKey;

        // 3. Sincronizar color interior de la tela
        const currentColor = state.selectedColor;
        if (result.material?.userData?.uBaseFabricColor && currentColor?.hex) {
          result.material.userData.uBaseFabricColor.value.set(currentColor.hex);
        }

        // 4. Componer textura UV sincronizada con la nueva silueta
        this.engine.textureComposer.compose(state);

        // 5. Ocultar overlay tras una pausa perceptible suave
        setTimeout(() => {
          if (token === this.swapToken) this.hideOverlay();
        }, 220);
      }
    } catch (err) {
      console.error('[ModelSwap] Error durante cambio de modelo:', err);
      this.hideOverlay();
    }
  }

  dispose() {
    this.cache.clear();
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
