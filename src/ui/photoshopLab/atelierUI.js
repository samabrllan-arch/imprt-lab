/**
 * CONTROLADOR DE INTERFAZ PARA ATELIER STUDIO (<290 Líneas)
 * Integra extracción directa de fondos croma/auto, subtonos y nitidez HD
 * (todas las operaciones de píxeles pasan por processSelectedImage)
 */
import { AtelierStudioEngine } from './atelierStudio.js';
import { STREETWEAR_EFFECTS, svgEffectToImage } from './effectsLibrary.js';
import { getAtelierLayoutTemplate } from './atelierTemplate.js';
import {
  removeChromaGreenFromImage,
  removeAutoBackgroundFromImage,
  refineAndCleanEdges,
  applySmartSharpenHD
} from '../../services/imageEnhancerService.js';

export function mountAtelierStudio(container) {
  container.innerHTML = getAtelierLayoutTemplate();

  const canvas = container.querySelector('#atelier-main-canvas');
  const inputText = container.querySelector('#input-layer-text');
  const layersMount = container.querySelector('#layers-list-mount');
  const scaleSlider = container.querySelector('#slider-layer-scale');
  const scaleValLabel = container.querySelector('#label-scale-val');
  const rotSlider = container.querySelector('#slider-layer-rot');

  let cleanTolerance = 35;
  let cleanChoke = 1;

  const isBitmapLayer = (l) => !!l && (l.type === 'image' || l.type === 'effect');

  /**
   * Aplica un procesador de píxeles a la capa seleccionada.
   * - La nitidez parte siempre de la imagen previa a nitidez (fromSharpenBase): pulsar varias veces
   *   no acumula halos ni sobre-enfoque. Cualquier otra operación invalida esa base.
   * - Si el usuario cambia de capa mientras se decodifica el resultado, se descarta.
   */
  function processSelectedImage(processor, { fromSharpenBase = false } = {}) {
    const l = engine.getSelectedLayer();
    if (!isBitmapLayer(l)) return;
    const base = fromSharpenBase && l.sharpenBase ? l.sharpenBase : l.img;
    let dataUrl;
    try {
      dataUrl = processor(base);
    } catch (err) {
      console.error('[Atelier] No se pudo procesar la imagen:', err);
      return;
    }
    const out = new Image();
    out.onload = () => {
      if (engine.getSelectedLayer() !== l) return;
      engine.updateSelectedLayerImage(out);
      l.sharpenBase = fromSharpenBase ? base : null;
    };
    out.src = dataUrl;
  }

  function syncTransformUI(layer) {
    if (!layer) return;
    scaleSlider.value = layer.scale || 1.0;
    scaleValLabel.textContent = `${Math.round((layer.scale || 1) * 100)}%`;
    rotSlider.value = layer.rotation || 0;
  }

  function updateLayersUI(eng) {
    if (!layersMount || !eng) return;
    layersMount.innerHTML = '';
    container.querySelector('#layers-count').textContent = eng.layers.length;

    eng.layers.forEach((layer, idx) => {
      const isSel = idx === eng.selectedLayerIndex;
      const item = document.createElement('div');
      item.className = 'layer-item' + (isSel ? ' selected' : '');
      const icon = layer.type === 'text' ? '🔤' : (layer.type === 'effect' ? '⚡' : '🖼️');
      const label = layer.type === 'text' ? layer.text : (layer.name || 'Capa');
      item.innerHTML = `
        <span class="layer-name">${icon} ${label}</span>
        <button type="button" class="btn-layer-sub btn-vis">${layer.visible ? '👁️' : '🙈'}</button>
      `;
      item.addEventListener('click', () => {
        eng.selectedLayerIndex = idx;
        if (layer.type === 'text' && inputText) inputText.value = layer.text;
        syncTransformUI(layer);
        eng.render();
      });
      item.querySelector('.btn-vis').addEventListener('click', (e) => {
        e.stopPropagation();
        layer.visible = !layer.visible;
        eng.render();
      });
      layersMount.appendChild(item);
    });

    const activeSel = eng.getSelectedLayer();
    if (activeSel) syncTransformUI(activeSel);
  }

  const engine = new AtelierStudioEngine(canvas, (eng) => {
    updateLayersUI(eng);
  });

  // Catálogo de Efectos
  const gridMount = container.querySelector('#effects-grid');
  function renderEffects(category = 'all') {
    gridMount.innerHTML = '';
    const filtered = category === 'all' ? STREETWEAR_EFFECTS : STREETWEAR_EFFECTS.filter(e => e.category === category);
    filtered.forEach(fx => {
      const card = document.createElement('div');
      card.className = 'fx-card-item';
      card.innerHTML = `<div class="fx-preview-box">${fx.svg}</div><span class="fx-name">${fx.name}</span>`;
      card.addEventListener('click', async () => {
        const img = await svgEffectToImage(fx.svg);
        engine.addEffectLayer(img, fx.name);
      });
      gridMount.appendChild(card);
    });
  }
  renderEffects();

  container.querySelectorAll('.btn-fx-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.btn-fx-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderEffects(tab.getAttribute('data-cat'));
    });
  });

  // Cargar imagen de bienvenida
  engine.addTextLayer('STREETWEAR', { fontFamily: 'Anton', fontSize: 62, fillColor: '#ffffff' });
  const greenLightning = STREETWEAR_EFFECTS[0]; // Rayo en fondo verde
  svgEffectToImage(greenLightning.svg).then(img => engine.addEffectLayer(img, greenLightning.name));

  // Pestañas
  container.querySelectorAll('.tool-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = btn.getAttribute('data-tool');
      container.querySelector('#panel-tool-text').style.display = tool === 'text' ? 'block' : 'none';
      container.querySelector('#panel-tool-image').style.display = tool === 'image' ? 'block' : 'none';
      container.querySelector('#panel-tool-effects').style.display = tool === 'effects' ? 'block' : 'none';
      container.querySelector('#panel-tool-bg').style.display = tool === 'bg' ? 'block' : 'none';
    });
  });

  // Quitar Fondo Verde Croma directo en la capa seleccionada
  container.querySelector('#btn-clean-green').addEventListener('click', () => {
    processSelectedImage((img) => removeChromaGreenFromImage(img, cleanTolerance, cleanChoke));
  });

  // Quitar Fondo Auto: solo el fondo conectado al borde (Shift+clic: también zonas encerradas)
  const btnCleanAuto = container.querySelector('#btn-clean-auto');
  btnCleanAuto.title = 'Detecta y elimina el fondo conectado al borde. Shift+clic: también quita zonas encerradas del mismo color.';
  btnCleanAuto.addEventListener('click', (e) => {
    processSelectedImage((img) => removeAutoBackgroundFromImage(img, cleanTolerance, cleanChoke, !e.shiftKey));
  });

  // Perfilar y Limpiar Bordes (quita neblina, halos y contaminación de color del contorno)
  container.querySelector('#btn-refine-edges')?.addEventListener('click', () => {
    processSelectedImage((img) => refineAndCleanEdges(img, 110, cleanChoke));
  });

  // Restaurar imagen original
  container.querySelector('#btn-restore-original-img').addEventListener('click', () => {
    engine.restoreSelectedLayerImage();
    const l = engine.getSelectedLayer();
    if (l) l.sharpenBase = null;
  });

  // Claridad HD Suave (luminancia, sin ruido en planos ni aros en los bordes)
  container.querySelector('#btn-sharpen-hd').addEventListener('click', () => {
    processSelectedImage((img) => applySmartSharpenHD(img), { fromSharpenBase: true });
  });

  // Sliders de limpieza
  container.querySelector('#slider-clean-tol').addEventListener('input', (e) => {
    cleanTolerance = parseInt(e.target.value, 10);
    container.querySelector('#val-clean-tol').textContent = cleanTolerance + '%';
  });
  container.querySelector('#slider-clean-choke')?.addEventListener('input', (e) => {
    cleanChoke = parseInt(e.target.value, 10);
    container.querySelector('#val-clean-choke').textContent = cleanChoke + 'px';
  });

  // Subtonos de Color y Filtros
  const bindFilter = (id, prop) => {
    container.querySelector(id)?.addEventListener('input', (e) => {
      const l = engine.getSelectedLayer();
      if (isBitmapLayer(l)) {
        l[prop] = parseInt(e.target.value, 10);
        engine.render();
      }
    });
  };
  bindFilter('#slider-img-hue', 'filterHueRotate');
  bindFilter('#slider-img-sat', 'filterSaturate');
  bindFilter('#slider-img-bright', 'filterBrightness');
  bindFilter('#slider-img-contrast', 'filterContrast');

  // Subir imagen
  container.querySelector('#input-upload-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => engine.addImageLayer(img, file.name.replace(/\.[^/.]+$/, ''));
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Eventos de Texto
  container.querySelector('#btn-add-text-layer').addEventListener('click', () => {
    engine.addTextLayer('NUEVO TEXTO', { fontFamily: 'Bebas Neue', fontSize: 50, fillColor: '#ffffff' });
  });
  inputText?.addEventListener('input', (e) => {
    const l = engine.getSelectedLayer();
    if (l && l.type === 'text') { l.text = e.target.value; engine.render(); }
  });
  container.querySelector('#select-font-family').addEventListener('change', (e) => {
    const l = engine.getSelectedLayer();
    if (l && l.type === 'text') { l.fontFamily = e.target.value; engine.render(); }
  });
  container.querySelectorAll('#text-colors-mount .color-swatch-sm').forEach(sw => {
    sw.addEventListener('click', () => {
      container.querySelectorAll('#text-colors-mount .color-swatch-sm').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      const l = engine.getSelectedLayer();
      if (l && l.type === 'text') { l.fillColor = sw.getAttribute('data-color'); engine.render(); }
    });
  });

  // Transformación
  scaleSlider.addEventListener('input', (e) => {
    const l = engine.getSelectedLayer();
    if (l) { l.scale = parseFloat(e.target.value); scaleValLabel.textContent = `${Math.round(l.scale * 100)}%`; engine.render(); }
  });
  container.querySelector('#btn-scale-up').addEventListener('click', () => {
    const l = engine.getSelectedLayer();
    if (l) { l.scale = Math.min(3.0, (l.scale || 1) + 0.1); scaleSlider.value = l.scale; scaleValLabel.textContent = `${Math.round(l.scale * 100)}%`; engine.render(); }
  });
  container.querySelector('#btn-scale-down').addEventListener('click', () => {
    const l = engine.getSelectedLayer();
    if (l) { l.scale = Math.max(0.2, (l.scale || 1) - 0.1); scaleSlider.value = l.scale; scaleValLabel.textContent = `${Math.round(l.scale * 100)}%`; engine.render(); }
  });
  rotSlider.addEventListener('input', (e) => {
    const l = engine.getSelectedLayer();
    if (l) { l.rotation = parseInt(e.target.value, 10); engine.render(); }
  });
  container.querySelector('#btn-rot-zero').addEventListener('click', () => {
    const l = engine.getSelectedLayer();
    if (l) { l.rotation = 0; rotSlider.value = 0; engine.render(); }
  });

  // Capas
  container.querySelector('#btn-layer-forward').addEventListener('click', () => engine.bringForward());
  container.querySelector('#btn-layer-backward').addEventListener('click', () => engine.sendBackward());
  container.querySelector('#btn-layer-clone').addEventListener('click', () => engine.duplicateSelectedLayer());
  container.querySelector('#btn-layer-del').addEventListener('click', () => engine.deleteSelectedLayer());
  container.querySelector('#btn-clear-all').addEventListener('click', () => {
    engine.layers = []; engine.selectedLayerIndex = -1; engine.render();
  });

  // Fondo
  container.querySelectorAll('.btn-bg-option').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.btn-bg-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.bgColor = btn.getAttribute('data-bg');
      engine.render();
    });
  });

  // Enviar a la Camiseta 3D
  container.querySelector('#btn-submit-to-shirt').addEventListener('click', () => {
    try {
      sessionStorage.setItem('shirt_lab_exported_art', engine.getExportDataUrl(2048));
    } catch {
      try { sessionStorage.setItem('shirt_lab_exported_art', engine.getExportDataUrl(1200)); } catch (e) {
        console.error('[Atelier] Quota excedida en sessionStorage:', e);
      }
    }
    window.location.href = '/#estudio';
  });

  return { engine };
}
