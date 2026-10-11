/**
 * MOTOR DE CANVAS 2D CON ALTA NITIDEZ & PROCESAMIENTO HD (<260 Líneas)
 * imageSmoothingQuality 'high', subtonos, rotación y exportación nítida
 */
export class AtelierStudioEngine {
  constructor(canvasElement, onUpdateCallback = null) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.onUpdate = onUpdateCallback;
    this.layers = [];
    this.selectedLayerIndex = -1;
    this.bgColor = 'transparent';
    this.isDragging = false;
    this.dragMode = 'none';
    this.dragStart = { x: 0, y: 0 };
    this.initialScale = 1;
    this.initialDist = 1;
    this.handleRadius = 8;
    this.canvas.width = 600;
    this.canvas.height = 700;
    this.isReady = true;
    this.initMouseEvents();
  }

  addTextLayer(text = 'STREETWEAR', opt = {}) {
    const layer = {
      id: 'layer_' + Date.now(), type: 'text', text: text,
      fontFamily: opt.fontFamily || 'Anton', fontSize: opt.fontSize || 54,
      fillColor: opt.fillColor || '#ffffff', strokeColor: opt.strokeColor || '#000000',
      strokeWidth: opt.strokeWidth || 0, scale: 1.0, rotation: 0,
      x: this.canvas.width / 2, y: this.canvas.height / 2, visible: true
    };
    this.layers.push(layer);
    this.selectedLayerIndex = this.layers.length - 1;
    this.render();
    return layer;
  }

  addImageLayer(imgElement, name = 'Imagen') {
    const factor = Math.min(350 / imgElement.width, 350 / imgElement.height, 1);
    const layer = {
      id: 'layer_' + Date.now(), type: 'image', name: name, img: imgElement,
      originalSrc: imgElement.src,
      w: imgElement.width * factor, h: imgElement.height * factor,
      scale: 1.0, rotation: 0, x: this.canvas.width / 2, y: this.canvas.height / 2,
      filterGrayscale: 0, filterBrightness: 100, filterContrast: 100,
      filterHueRotate: 0, filterSaturate: 100, visible: true
    };
    this.layers.push(layer);
    this.selectedLayerIndex = this.layers.length - 1;
    this.render();
    return layer;
  }

  addEffectLayer(imgElement, name = 'Efecto') {
    const l = this.addImageLayer(imgElement, name);
    l.type = 'effect';
    this.render();
    return l;
  }

  getSelectedLayer() { return this.layers[this.selectedLayerIndex] || null; }

  updateSelectedLayerImage(newImgElement) {
    const l = this.getSelectedLayer();
    if (l && (l.type === 'image' || l.type === 'effect')) {
      l.img = newImgElement;
      this.render();
    }
  }

  restoreSelectedLayerImage() {
    const l = this.getSelectedLayer();
    if (l && l.originalSrc) {
      const restored = new Image();
      restored.crossOrigin = 'anonymous';
      restored.onload = () => { l.img = restored; this.render(); };
      restored.src = l.originalSrc;
    }
  }

  deleteSelectedLayer() {
    if (this.selectedLayerIndex >= 0) {
      this.layers.splice(this.selectedLayerIndex, 1);
      this.selectedLayerIndex = Math.min(this.selectedLayerIndex, this.layers.length - 1);
      this.render();
    }
  }

  duplicateSelectedLayer() {
    const c = this.getSelectedLayer();
    if (!c) return;
    this.layers.push({ ...c, id: 'layer_' + Date.now(), x: c.x + 20, y: c.y + 20 });
    this.selectedLayerIndex = this.layers.length - 1;
    this.render();
  }

  bringForward() {
    const i = this.selectedLayerIndex;
    if (i >= 0 && i < this.layers.length - 1) {
      [this.layers[i], this.layers[i + 1]] = [this.layers[i + 1], this.layers[i]];
      this.selectedLayerIndex = i + 1;
      this.render();
    }
  }

  sendBackward() {
    const i = this.selectedLayerIndex;
    if (i > 0) {
      [this.layers[i], this.layers[i - 1]] = [this.layers[i - 1], this.layers[i]];
      this.selectedLayerIndex = i - 1;
      this.render();
    }
  }

  getLayerBounds(l) {
    let w = 150, h = 60;
    if (l.type === 'text') {
      this.ctx.font = `${l.fontSize}px "${l.fontFamily}"`;
      w = this.ctx.measureText(l.text).width + 20;
      h = l.fontSize * 1.2;
    } else if (l.w && l.h) {
      w = l.w; h = l.h;
    }
    const sw = w * (l.scale || 1), sh = h * (l.scale || 1);
    return { w: sw, h: sh, halfW: sw / 2, halfH: sh / 2 };
  }

  buildFilterString(l) {
    const fl = [];
    if (l.filterGrayscale > 0) fl.push(`grayscale(${l.filterGrayscale}%)`);
    if (l.filterBrightness !== 100) fl.push(`brightness(${l.filterBrightness}%)`);
    if (l.filterContrast !== 100) fl.push(`contrast(${l.filterContrast}%)`);
    if (l.filterHueRotate) fl.push(`hue-rotate(${l.filterHueRotate}deg)`);
    if (l.filterSaturate !== 100) fl.push(`saturate(${l.filterSaturate}%)`);
    return fl.length ? fl.join(' ') : 'none';
  }

  render() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.bgColor && this.bgColor !== 'transparent') {
      ctx.fillStyle = this.bgColor; ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.layers.forEach((l, idx) => {
      if (!l.visible) return;
      ctx.save();
      ctx.translate(l.x, l.y);
      if (l.rotation) ctx.rotate((l.rotation * Math.PI) / 180);
      const b = this.getLayerBounds(l);

      if (l.type === 'text') {
        const sc = l.scale || 1;
        ctx.font = `${Math.round(l.fontSize * sc)}px "${l.fontFamily}", system-ui`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (l.strokeWidth > 0) {
          ctx.strokeStyle = l.strokeColor; ctx.lineWidth = l.strokeWidth * sc; ctx.strokeText(l.text, 0, 0);
        }
        ctx.fillStyle = l.fillColor; ctx.fillText(l.text, 0, 0);
      } else {
        ctx.filter = this.buildFilterString(l);
        ctx.drawImage(l.img, -b.halfW, -b.halfH, b.w, b.h);
        ctx.filter = 'none';
      }

      if (idx === this.selectedLayerIndex) {
        ctx.strokeStyle = '#ff5722'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.strokeRect(-b.halfW, -b.halfH, b.w, b.h); ctx.setLineDash([]);
        const hr = this.handleRadius; ctx.fillStyle = '#ff5722';
        [[-b.halfW, -b.halfH], [b.halfW, -b.halfH], [b.halfW, b.halfH], [-b.halfW, b.halfH]].forEach(([cx, cy]) => {
          ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        });
      }
      ctx.restore();
    });

    if (this.isReady && this.onUpdate) this.onUpdate(this);
  }

  initMouseEvents() {
    const getPos = (e) => {
      const r = this.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (this.canvas.width / r.width), y: (e.clientY - r.top) * (this.canvas.height / r.height) };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getPos(e);
      const sel = this.getSelectedLayer();
      if (sel) {
        const b = this.getLayerBounds(sel);
        const corners = [{ x: sel.x - b.halfW, y: sel.y - b.halfH }, { x: sel.x + b.halfW, y: sel.y - b.halfH }, { x: sel.x + b.halfW, y: sel.y + b.halfH }, { x: sel.x - b.halfW, y: sel.y + b.halfH }];
        if (corners.some(c => Math.hypot(pos.x - c.x, pos.y - c.y) <= this.handleRadius + 4)) {
          this.isDragging = true; this.dragMode = 'scale';
          this.initialDist = Math.hypot(pos.x - sel.x, pos.y - sel.y) || 1;
          this.initialScale = sel.scale || 1.0;
          return;
        }
      }

      let hitIdx = -1;
      for (let i = this.layers.length - 1; i >= 0; i--) {
        const l = this.layers[i];
        if (!l.visible) continue;
        const b = this.getLayerBounds(l);
        if (Math.abs(pos.x - l.x) <= b.halfW && Math.abs(pos.y - l.y) <= b.halfH) { hitIdx = i; break; }
      }
      if (hitIdx !== -1) {
        this.selectedLayerIndex = hitIdx; this.isDragging = true; this.dragMode = 'move';
        this.dragStart = { x: pos.x - this.layers[hitIdx].x, y: pos.y - this.layers[hitIdx].y };
      } else {
        this.selectedLayerIndex = -1;
      }
      this.render();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || this.selectedLayerIndex === -1) return;
      const pos = getPos(e);
      const sel = this.getSelectedLayer();
      if (!sel) return;
      if (this.dragMode === 'move') {
        sel.x = Math.round(pos.x - this.dragStart.x); sel.y = Math.round(pos.y - this.dragStart.y);
      } else if (this.dragMode === 'scale') {
        const curDist = Math.hypot(pos.x - sel.x, pos.y - sel.y);
        sel.scale = Math.max(0.15, Math.min(4.0, parseFloat(((curDist / this.initialDist) * this.initialScale).toFixed(2))));
      }
      this.render();
    });

    window.addEventListener('mouseup', () => { this.isDragging = false; this.dragMode = 'none'; });
  }

  getExportDataUrl(size = 2048) {
    const off = document.createElement('canvas');
    off.width = size; off.height = Math.round(size * (this.canvas.height / this.canvas.width));
    const octx = off.getContext('2d'), scale = size / this.canvas.width;
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = 'high';

    if (this.bgColor && this.bgColor !== 'transparent') {
      octx.fillStyle = this.bgColor; octx.fillRect(0, 0, off.width, off.height);
    }
    this.layers.forEach((l) => {
      if (!l.visible) return;
      octx.save(); octx.translate(l.x * scale, l.y * scale);
      if (l.rotation) octx.rotate((l.rotation * Math.PI) / 180);
      const b = this.getLayerBounds(l), sw = b.w * scale, sh = b.h * scale;
      if (l.type === 'text') {
        const sc = (l.scale || 1) * scale;
        octx.font = `${Math.round(l.fontSize * sc)}px "${l.fontFamily}", system-ui`;
        octx.textAlign = 'center'; octx.textBaseline = 'middle';
        if (l.strokeWidth > 0) {
          octx.strokeStyle = l.strokeColor; octx.lineWidth = l.strokeWidth * sc; octx.strokeText(l.text, 0, 0);
        }
        octx.fillStyle = l.fillColor; octx.fillText(l.text, 0, 0);
      } else {
        octx.filter = this.buildFilterString(l);
        octx.drawImage(l.img, -sw / 2, -sh / 2, sw, sh);
        octx.filter = 'none';
      }
      octx.restore();
    });
    return off.toDataURL('image/png');
  }
}
