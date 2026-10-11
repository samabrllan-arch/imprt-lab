import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const CAMERA_ANGLES = {
  front: { radius: 2.30, theta: 0, phi: Math.PI * 0.49, targetY: 0.0 },
  back: { radius: 2.30, theta: Math.PI, phi: Math.PI * 0.49, targetY: 0.0 },
  free: { radius: 2.30, theta: Math.PI * 0.25, phi: Math.PI * 0.38, targetY: 0.0 }
};

export class CameraManager {
  constructor(container, rendererElement) {
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);

    // Controles orbitales con amortiguación suave
    this.controls = new OrbitControls(this.camera, rendererElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 1.0;
    this.controls.maxDistance = 3.8;
    this.controls.maxPolarAngle = Math.PI * 0.78;
    this.controls.minPolarAngle = Math.PI * 0.18;
    this.controls.target.set(0, 0, 0);

    // Estado esférico actual
    this.currentRadius = 2.30;
    this.currentTheta = 0;
    this.currentPhi = Math.PI * 0.49;
    this.currentTargetY = 0;

    // Estado objetivo de transición
    this.targetRadius = 2.30;
    this.targetTheta = 0;
    this.targetPhi = Math.PI * 0.49;
    this.targetTargetY = 0;

    this.isTransitioning = false;
    this.spherical = new THREE.Spherical();
    this._scratchOffset = new THREE.Vector3();
    this.applySpherical();
    this.controls.update();

    // Puente táctil: permite scroll vertical fluido del workspace en celulares sin bloquear el visor 3D
    this.bindTouchScrollBridge(container, rendererElement);
  }

  applySpherical() {
    this.spherical.set(this.currentRadius, this.currentPhi, this.currentTheta);
    this.camera.position.setFromSpherical(this.spherical);
    this.camera.position.y += this.currentTargetY;
    this.controls.target.set(0, this.currentTargetY, 0);
    this.camera.lookAt(this.controls.target);
  }

  update(delta) {
    if (this.isTransitioning) {
      const t = Math.min(delta * 14.0, 0.45);

      // Interpolación más corta para theta (evita dar vueltas de 360°)
      let dTheta = this.targetTheta - this.currentTheta;
      while (dTheta > Math.PI) dTheta -= 2 * Math.PI;
      while (dTheta < -Math.PI) dTheta += 2 * Math.PI;

      this.currentTheta += dTheta * t;
      this.currentPhi += (this.targetPhi - this.currentPhi) * t;
      this.currentRadius += (this.targetRadius - this.currentRadius) * t;
      this.currentTargetY += (this.targetTargetY - this.currentTargetY) * t;

      this.applySpherical();

      if (Math.abs(dTheta) < 0.005 && Math.abs(this.targetPhi - this.currentPhi) < 0.005) {
        this.currentTheta = this.targetTheta;
        this.currentPhi = this.targetPhi;
        this.currentRadius = this.targetRadius;
        this.currentTargetY = this.targetTargetY;
        this.applySpherical();
        this.isTransitioning = false;
        this.controls.update();
      }
    } else {
      this.controls.update();
      // Sincronizar coordenadas esféricas cuando el usuario manipula libremente con el mouse
      const offset = this._scratchOffset.copy(this.camera.position).sub(this.controls.target);
      this.spherical.setFromVector3(offset);
      this.currentRadius = this.spherical.radius;
      this.currentPhi = this.spherical.phi;
      this.currentTheta = this.spherical.theta;
      this.currentTargetY = this.controls.target.y;
    }
  }

  flyToView(viewKey) {
    const config = CAMERA_ANGLES[viewKey];
    if (!config) return;

    // Sincronizar estado esférico actual antes de iniciar el vuelo
    const offset = this._scratchOffset.copy(this.camera.position).sub(this.controls.target);
    this.spherical.setFromVector3(offset);
    this.currentRadius = this.spherical.radius;
    this.currentPhi = this.spherical.phi;
    this.currentTheta = this.spherical.theta;
    this.currentTargetY = this.controls.target.y;

    this.targetRadius = config.radius;
    this.targetTheta = config.theta;
    this.targetPhi = config.phi;
    this.targetTargetY = config.targetY;
    this.isTransitioning = true;
  }

  setAutoRotate(enabled) {
    this.controls.autoRotate = enabled;
    this.controls.autoRotateSpeed = 1.4;
  }

  setFlatMode(enabled, activeView = 'front') {
    this.isFlatMode = enabled;
    this.controls.enableRotate = !enabled;
    if (enabled) {
      const isBack = activeView === 'back';
      this.targetRadius = 2.20;
      this.targetTheta = isBack ? Math.PI : 0;
      this.targetPhi = Math.PI * 0.50;
      this.targetTargetY = 0.0;
      this.isTransitioning = true;
    }
  }

  /**
   * Conecta gestos táctiles para que deslices verticales sobre el lienzo en móviles
   * muevan fluidamente el contenedor de la pantalla sin bloquear la navegación.
   */
  bindTouchScrollBridge(container, rendererElement) {
    let startY = 0;
    let startX = 0;
    let isVerticalSwipe = false;
    let gestureDetermined = false;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isVerticalSwipe = false;
      gestureDetermined = false;
    };

    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const curY = e.touches[0].clientY;
      const curX = e.touches[0].clientX;
      const dy = curY - startY;
      const dx = curX - startX;

      if (!gestureDetermined) {
        if (Math.abs(dy) > 7 || Math.abs(dx) > 7) {
          gestureDetermined = true;
          isVerticalSwipe = Math.abs(dy) > Math.abs(dx) * 1.15;
        }
      }

      if (isVerticalSwipe) {
        const workspace = document.querySelector('.studio-fullscreen-workspace');
        if (workspace) {
          workspace.scrollTop -= dy;
          startY = curY;
        }
      }
    };

    rendererElement.addEventListener('touchstart', onTouchStart, { passive: true });
    rendererElement.addEventListener('touchmove', onTouchMove, { passive: true });

    this._cleanupTouch = () => {
      rendererElement.removeEventListener('touchstart', onTouchStart);
      rendererElement.removeEventListener('touchmove', onTouchMove);
    };
  }

  dispose() {
    if (this._cleanupTouch) this._cleanupTouch();
    this.controls.dispose();
  }
}
