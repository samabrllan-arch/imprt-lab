import { applyChokeSeparable, processDtfKnockoutAndHalftone, applyHeatPressSimulation } from './dtfCoreAlgorithms.js';

export function createDtf2DCanvas(containerEl, onUpdateCallback) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1200;
  canvas.className = 'dtf-interactive-canvas';
  containerEl.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Master texture 2048x2048 para el modelo 3D
  const master3dCanvas = document.createElement('canvas');
  master3dCanvas.width = 2048;
  master3dCanvas.height = 2048;
  const masterCtx = master3dCanvas.getContext('2d');

  // Estado del decal
  const state = {
    x: 600,
    y: 600,
    scale: 0.85,
    rotation: 0,
    shirtColor: '#874438',
    silhouette: 'woman',
    zone: 'chest',
    // Opciones DTF
    showWhiteUnderbase: false,
    chokePx: 1.5,
    knockoutMode: 'none',
    threshold: 25,
    fadeRange: 20,
    hazeFactor: 0.2,
    lpi: 0,
    pressIntensity: 0
  };

  let rawImg = null;
  let processedCanvas = document.createElement('canvas');
  let whiteCanvas = document.createElement('canvas');

  // Variables de arrastre
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startX = 0;
  let startY = 0;

  function setDecalImage(img) {
    rawImg = img;
    reprocessDecal();
  }

  function reprocessDecal() {
    if (!rawImg || !rawImg.complete || !rawImg.naturalWidth) {
      redrawAll();
      return;
    }

    // 1. Clonar imagen cruda en canvas temporal
    const w = rawImg.naturalWidth;
    const h = rawImg.naturalHeight;
    processedCanvas.width = w;
    processedCanvas.height = h;
    const pCtx = processedCanvas.getContext('2d');
    pCtx.clearRect(0, 0, w, h);
    pCtx.drawImage(rawImg, 0, 0);

    const imgData = pCtx.getImageData(0, 0, w, h);

    // 2. Aplicar Knockout y Tramado LPI
    processDtfKnockoutAndHalftone(imgData, {
      mode: state.knockoutMode,
      threshold: state.threshold,
      fadeRange: state.fadeRange,
      hazeFactor: state.hazeFactor,
      lpi: state.lpi
    });

    // 3. Aplicar simulación de planchado térmico
    applyHeatPressSimulation(imgData, state.pressIntensity);
    pCtx.putImageData(imgData, 0, 0);

    // 4. Generar cama de blanco si está activa
    if (state.showWhiteUnderbase) {
      whiteCanvas.width = w;
      whiteCanvas.height = h;
      const wCtx = whiteCanvas.getContext('2d');
      const wData = wCtx.createImageData(w, h);
      const alphaMap = new Uint8ClampedArray(w * h);
      for (let i = 0, j = 0; i < imgData.data.length; i += 4, j++) {
        alphaMap[j] = imgData.data[i + 3];
      }
      const choked = applyChokeSeparable(alphaMap, w, h, state.chokePx);
      for (let i = 0, j = 0; i < wData.data.length; i += 4, j++) {
        wData.data[i] = 255;
        wData.data[i + 1] = 255;
        wData.data[i + 2] = 255;
        wData.data[i + 3] = choked[j];
      }
      wCtx.putImageData(wData, 0, 0);
    }

    redrawAll();
  }

  function redrawAll() {
    // A. Dibujar lienzo 2D de trabajo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo tela
    ctx.fillStyle = state.shirtColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cuadrícula sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let p = 0; p < canvas.width; p += 60) {
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(canvas.width, p); ctx.stroke();
    }

    // Guía de zona de estampado en el centro
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(300, 300, 600, 600);
    ctx.setLineDash([]);

    if (rawImg && rawImg.naturalWidth) {
      const dw = 450 * state.scale;
      const dh = (dw * (rawImg.naturalHeight / rawImg.naturalWidth));

      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate((state.rotation * Math.PI) / 180);

      if (state.showWhiteUnderbase) {
        // Modo vista de máscara de blanco
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(-dw / 2 - 10, -dh / 2 - 10, dw + 20, dh + 20);
        ctx.drawImage(whiteCanvas, -dw / 2, -dh / 2, dw, dh);
      } else {
        // Arte procesado
        ctx.drawImage(processedCanvas, -dw / 2, -dh / 2, dw, dh);
      }

      // Caja selectora interactiva
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }

    // B. Componer textura maestra 2048x2048 para Three.js
    compose3DTexture();
    if (onUpdateCallback) onUpdateCallback(master3dCanvas);
  }

  function compose3DTexture() {
    masterCtx.fillStyle = state.shirtColor;
    masterCtx.fillRect(0, 0, 2048, 2048);

    if (!rawImg || !rawImg.naturalWidth) return;

    // Centros según silueta
    const uvBaseX = state.silhouette === 'man' ? 572 : 570;
    const uvBaseY = state.silhouette === 'man' ? 720 : 990;

    // Mapear offset relativo del canvas 1200x1200 a coordenadas UV
    const offsetX = (state.x - 600) * 0.8;
    const offsetY = (state.y - 600) * 0.8;
    const finalX = uvBaseX + offsetX;
    const finalY = uvBaseY - offsetY;

    const dw = 440 * state.scale;
    const dh = dw * (rawImg.naturalHeight / rawImg.naturalWidth);

    masterCtx.save();
    masterCtx.translate(finalX, finalY);
    masterCtx.scale(1, -1);
    masterCtx.rotate((state.rotation * Math.PI) / 180);
    masterCtx.drawImage(processedCanvas, -dw / 2, -dh / 2, dw, dh);
    masterCtx.restore();
  }

  // Pointer drag
  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    dragStartX = (e.clientX - rect.left) * scale;
    dragStartY = (e.clientY - rect.top) * scale;
    startX = state.x;
    startY = state.y;
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const currentX = (e.clientX - rect.left) * scale;
    const currentY = (e.clientY - rect.top) * scale;
    state.x = startX + (currentX - dragStartX);
    state.y = startY + (currentY - dragStartY);
    redrawAll();
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  return {
    state,
    canvas,
    master3dCanvas,
    setDecalImage,
    reprocessDecal,
    redrawAll,
    getProcessedImageData: () => {
      const pCtx = processedCanvas.getContext('2d');
      return pCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    }
  };
}
