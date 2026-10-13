import * as THREE from 'three';
import { ZONES } from '../config/zones.js';
import { computeDecalSize, getHalfExtents, offsetsToCenter, clampCenterToBounds } from '../config/decalLayout.js';
import { createFabricPatternCanvas, drawFabricShading } from './fabricPattern.js';

export class TextureComposer {
  constructor(size = 2048) {
    this.size = size;
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext('2d');

    // Patrón de algodón precargado
    this.patternCanvas = createFabricPatternCanvas(512, 512);

    // Capa base cacheada (color + trama + sombreado): solo se regenera al cambiar el color,
    // de modo que mover/escalar un estampado no repinta 4 M de píxeles por frame.
    this.baseCanvas = document.createElement('canvas');
    this.baseCanvas.width = size;
    this.baseCanvas.height = size;
    this.baseCtx = this.baseCanvas.getContext('2d');
    this.baseKey = null;

    // Three.js CanvasTexture optimizada
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 16;
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
  }

  getTexture() {
    return this.texture;
  }

  getCanvas() {
    return this.canvas;
  }

  /** Regenera la capa base solo si cambió el color o el tipo de superficie (tela vs cerámica). */
  ensureBaseLayer(hex, isMug = false, isMagicMug = false) {
    const effectiveHex = (isMug && isMagicMug) ? '#f8fafc' : hex;
    const key = `${effectiveHex}_${isMug ? 'mug' : 'shirt'}`;
    if (this.baseKey === key) return;
    const { baseCtx: ctx, size } = this;

    // 1. Color base de la prenda o cerámica
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = effectiveHex;
    ctx.fillRect(0, 0, size, size);

    if (!isMug) {
      // 2. Trama de algodón sutil (solo para camisetas)
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = ctx.createPattern(this.patternCanvas, 'repeat');
      ctx.fillRect(0, 0, size, size);
      ctx.restore();

      // 3. Sombreado de volumen y costuras textiles
      drawFabricShading(ctx, size, size);
    }
    this.baseKey = key;
  }

  /**
   * Renderiza la textura completa de la prenda o vaso en el canvas
   */
  compose(state) {
    const { ctx, size } = this;
    const { selectedColor, customizations } = state;
    const silhouette = state.selectedSilhouette || 'man';
    const isMug = silhouette === 'mug';

    // 1-3. Capa base cacheada (tela con trama o cerámica lisa)
    this.ensureBaseLayer(selectedColor.hex, isMug, !!state.isMagicMug);
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.baseCanvas, 0, 0);

    // 4. Renderizar estampados en cada zona activa según la silueta (Hombre, Mujer o Vaso 11 Oz)
    for (const [zoneId, zoneConfig] of Object.entries(ZONES)) {
      if (isMug && zoneId !== 'front') continue;
      const decal = customizations[zoneId];
      if (decal && decal.hasDecal && decal.imageElement) {
        const area = (zoneConfig.canvasAreaBySilhouette && zoneConfig.canvasAreaBySilhouette[silhouette])
          || zoneConfig.canvasArea;
        this.drawDecal(ctx, decal, area, silhouette);
      }
    }

    // Notificar a Three.js que la textura cambió en GPU
    this.texture.needsUpdate = true;
  }

  /**
   * Dibuja un estampado con traslación, escala y rotación precisas
   */
  drawDecal(ctx, decal, area, silhouette = 'man') {
    const img = decal.imageElement;
    if (!img) return;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Delimitar al área imprimible (en vaso 11 Oz respeta el borde superior e inferior cerámico y el asa)
    ctx.beginPath();
    if (silhouette === 'mug') {
      ctx.rect(140, 390, 1800, 1268);
    } else {
      ctx.rect(
        area.x - area.width * 0.90,
        area.y - area.height * 2.20,
        area.width * 1.80,
        area.height * 4.40
      );
    }
    ctx.clip();

    // Dimensiones proporcionales manteniendo el aspect ratio original o medidas libres
    const { w: targetW, h: targetH } = computeDecalSize(img, area, decal.scale, decal);

    // Centro según offsets (en la silueta femenina el eje vertical UV está invertido)
    let center = offsetsToCenter(area, silhouette, decal.offsetX, decal.offsetY);

    // Red de seguridad: mantener el estampado dentro de la isla UV real de la malla.
    // Fuera de ella no hay textura propia y el diseño se vería cortado en línea recta.
    if (area.bounds) {
      const half = getHalfExtents(targetW, targetH, decal.rotation || 0);
      center = clampCenterToBounds(center, half, area.bounds);
    }
    const centerX = center.x;
    const centerY = center.y;

    // Aplicar transformación (eje vertical invertido para WebGL, eje horizontal natural LTR)
    ctx.translate(centerX, centerY);
    ctx.scale(1, -1);
    if (decal.rotation) {
      ctx.rotate((decal.rotation * Math.PI) / 180);
    }
    ctx.globalAlpha = decal.opacity ?? 1.0;

    // Dibujar estampado centrado
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);

    ctx.restore();
  }

  dispose() {
    this.texture.dispose();
  }
}
