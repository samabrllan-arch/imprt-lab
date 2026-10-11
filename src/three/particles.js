import * as THREE from 'three';

/**
 * Sistema de partículas ambientales flotantes (polvo de luz / cyber-atelier embers)
 * Da atmósfera y profundidad cinematográfica a la escena 3D
 */
export class AmbientParticleSystem {
  constructor(scene, count = 180) {
    this.scene = scene;
    this.count = count;
    this.clock = new THREE.Clock();

    // Generar textura de círculo suave proceduralmente
    const texture = this.createCircleTexture();

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Dispersión cilíndrica alrededor de la camiseta
      const radius = 0.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      scales[i] = Math.random() * 0.8 + 0.3;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    this.phases = phases;
    this.initialY = positions.filter((_, idx) => idx % 3 === 1);

    this.material = new THREE.PointsMaterial({
      color: 0xff6622,
      size: 0.045,
      map: texture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geometry, this.material);
    this.points.visible = false;
    this.scene.add(this.points);

    // Adaptar color al cambiar tema
    window.addEventListener('themechange', (e) => {
      const isLight = e.detail?.theme === 'light';
      this.material.color.setHex(isLight ? 0x0044bb : 0xff6622);
      this.material.opacity = isLight ? 0.55 : 0.45;
    });
  }

  createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 180, 100, 0.7)');
    gradient.addColorStop(0.8, 'rgba(255, 100, 20, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    return texture;
  }

  /**
   * Muestra u oculta las partículas
   */
  setVisible(visible) {
    if (this.points) {
      this.points.visible = visible;
    }
  }

  /**
   * Devuelve si las partículas están visibles
   */
  isVisible() {
    return this.points ? this.points.visible : false;
  }

  update(delta) {
    if (!this.points || !this.points.visible) return;
    const elapsed = this.clock.getElapsedTime();
    const posAttr = this.points.geometry.attributes.position;
    const pos = posAttr.array;

    for (let i = 0; i < this.count; i++) {
      const pIdx = i * 3;
      // Deriva suave vertical y oscilación horizontal sutil
      pos[pIdx + 1] += Math.sin(elapsed * 0.8 + this.phases[i]) * 0.0018;
      pos[pIdx] += Math.cos(elapsed * 0.5 + this.phases[i]) * 0.0012;

      // Mantener dentro del volumen
      if (pos[pIdx + 1] > 1.8) pos[pIdx + 1] = -1.5;
      if (pos[pIdx + 1] < -1.5) pos[pIdx + 1] = 1.8;
    }

    posAttr.needsUpdate = true;
    this.points.rotation.y = elapsed * 0.025;
  }

  dispose() {
    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
      this.material.dispose();
    }
  }
}
