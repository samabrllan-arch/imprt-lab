import { store } from '../state/store.js';
import { updateDecalTransform } from '../state/actions.js';

/**
 * Controlador de arrastre táctil / ratón (Drag & Drop) para mover estampados
 * directamente en la pantalla de la camiseta en Modo Plano y Modo 3D.
 */
export class CanvasDragController {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.initOffsetX = 0;
    this.initOffsetY = 0;

    this.createHudIndicator();
    this.bindEvents();
  }

  createHudIndicator() {
    this.hud = document.createElement('div');
    this.hud.className = 'flat-drag-hud-badge';
    this.hud.innerHTML = `
      <span class="drag-hud-icon">✋</span>
      <span class="drag-hud-text">Arrastra en pantalla para mover el estampado</span>
    `;
    this.container.appendChild(this.hud);
    this.updateHudVisibility();
  }

  updateHudVisibility() {
    const state = store.getState();
    const isFlat = state.viewMode === 'flat';
    const activeDecal = state.customizations[state.activeZone];
    const hasDecal = activeDecal && activeDecal.hasDecal;

    if (this.hud) {
      if (isFlat && hasDecal) {
        this.hud.classList.add('visible');
        this.container.style.cursor = this.isDragging ? 'grabbing' : 'grab';
      } else {
        this.hud.classList.remove('visible');
        this.container.style.cursor = 'default';
      }
    }
  }

  bindEvents() {
    const onPointerDown = (e) => {
      const state = store.getState();
      const isFlat = state.viewMode === 'flat';
      // Permite arrastrar en Modo Plano, o en 3D si se mantiene pulsada la tecla Alt o Shift
      const isDragAllowed = isFlat || e.altKey || e.shiftKey;
      if (!isDragAllowed) return;

      const activeDecal = state.customizations[state.activeZone];
      if (!activeDecal || !activeDecal.hasDecal) return;

      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.initOffsetX = activeDecal.offsetX || 0;
      this.initOffsetY = activeDecal.offsetY || 0;

      this.container.setPointerCapture?.(e.pointerId);
      this.container.style.cursor = 'grabbing';
      if (this.hud) {
        this.hud.classList.add('dragging');
      }
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const state = store.getState();
      const rect = this.container.getBoundingClientRect();
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;

      // Factor de escala calibrado 1:1 con el movimiento del ratón
      const scaleFactor = 2.4 / (rect.height || 600);
      const isBack = state.activeView === 'back';

      // En la espalda el eje X se invierte; el eje Y natural: arrastre hacia arriba aumenta Y (sube en prenda)
      const newX = this.initOffsetX + (isBack ? -deltaX : deltaX) * scaleFactor;
      const newY = this.initOffsetY - deltaY * scaleFactor;

      // Los límites (incluida la isla UV de cada silueta) los aplica updateDecalTransform:
      // es la única fuente de verdad. Después leemos el valor realmente aplicado.
      updateDecalTransform(state.activeZone, {
        offsetX: newX,
        offsetY: newY
      });

      const applied = store.getState().customizations[state.activeZone];
      const appliedX = applied ? applied.offsetX : newX;
      const appliedY = applied ? applied.offsetY : newY;

      if (this.hud) {
        const hudText = this.hud.querySelector('.drag-hud-text');
        if (hudText) {
          hudText.textContent = `Posición: X: ${appliedX > 0 ? '+' : ''}${appliedX.toFixed(2)} | Y: ${appliedY > 0 ? '+' : ''}${appliedY.toFixed(2)}`;
        }
      }
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.container.releasePointerCapture?.(e.pointerId);
      const state = store.getState();
      this.container.style.cursor = state.viewMode === 'flat' ? 'grab' : 'default';

      if (this.hud) {
        this.hud.classList.remove('dragging');
        const hudText = this.hud.querySelector('.drag-hud-text');
        if (hudText) {
          hudText.textContent = 'Arrastra en pantalla para mover el estampado';
        }
      }
    };

    this.container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    store.subscribe((state, changeKey) => {
      if (changeKey === 'viewMode' || changeKey === 'activeZone' || (changeKey && changeKey.startsWith('decal:'))) {
        this.updateHudVisibility();
      }
    });
  }
}
