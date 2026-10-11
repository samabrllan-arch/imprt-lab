import * as THREE from 'three';

const DEFAULT_COORDS = {
  woman: {
    chest: { x: 570, y: 990, scale: 0.85 },
    back: { x: 1536, y: 990, scale: 0.90 }
  },
  man: {
    chest: { x: 572, y: 720, scale: 1.0 },
    back: { x: 1536, y: 720, scale: 1.0 }
  }
};

export function createTextureRenderer(initialColor = '#874438') {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  let shirtColor = initialColor;
  let activeSilhouette = 'woman';
  let activeDecalImage = null;
  let showChest = true;
  let showBack = true;

  function render() {
    // 1. Color base de tela
    ctx.fillStyle = shirtColor;
    ctx.fillRect(0, 0, 2048, 2048);

    // 2. Grano sutil de algodón
    ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
    for (let i = 0; i < 2048; i += 8) {
      ctx.fillRect(0, i, 2048, 2);
    }

    if (!activeDecalImage || !activeDecalImage.complete || !activeDecalImage.naturalWidth) {
      texture.needsUpdate = true;
      return;
    }

    const cfg = DEFAULT_COORDS[activeSilhouette] || DEFAULT_COORDS.woman;

    // 3. Estampado Frente (Pecho)
    if (showChest && cfg.chest) {
      const c = cfg.chest;
      const size = 440 * c.scale;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(1, -1);
      ctx.drawImage(activeDecalImage, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    // 4. Estampado Espalda
    if (showBack && cfg.back) {
      const c = cfg.back;
      const size = 460 * c.scale;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(1, -1);
      ctx.drawImage(activeDecalImage, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    texture.needsUpdate = true;
  }

  function setShirtColor(hex) {
    shirtColor = hex;
    render();
  }

  function setSilhouette(silKey) {
    activeSilhouette = silKey === 'man' ? 'man' : 'woman';
    render();
  }

  function setDecalImage(img) {
    activeDecalImage = img;
    render();
  }

  function setZones(chest, back) {
    showChest = !!chest;
    showBack = !!back;
    render();
  }

  // Render inicial
  render();

  return {
    texture,
    setShirtColor,
    setSilhouette,
    setDecalImage,
    setZones,
    render
  };
}
