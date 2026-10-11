/**
 * CONTROLADOR PRINCIPAL DEL REMOVEDOR DE FONDOS DTF (<280 Líneas)
 * Integra detección automática de fondo, varita mágica y goma con matting anti-halo
 */
import { autoDetectBackgroundColor } from '../../services/imageProcessing.js';
import { eraseBackgroundAuto } from '../../services/autoBackground.js';
import { keyBackground } from '../../services/colorKey.js';

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('remover-stage-mount');
  if (!mount) return;

  let originalImageData = null;
  let currentImageData = null;
  let undoStack = [];
  let activeTool = 'wand'; // 'wand' | 'brush'
  let wandTolerance = 30;
  let brushSize = 25;
  let isErasingBrush = false;

  renderDropzone();

  function renderDropzone() {
    mount.innerHTML = `
      <div class="remover-dropzone-view">
        <div class="dropzone-box" id="dropzone-box">
          <div class="dropzone-icon">🪄</div>
          <div class="dropzone-title">Sube o arrastra una imagen con fondo</div>
          <div class="dropzone-sub">PNG, JPG, WebP • También puedes pegar con <b>Ctrl + V</b></div>
          <input type="file" id="remover-file-input" accept="image/*" style="display: none;" />
        </div>
      </div>
    `;

    const drop = mount.querySelector('#dropzone-box');
    const input = mount.querySelector('#remover-file-input');

    drop.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
      if (e.target.files[0]) loadImageFile(e.target.files[0]);
    });

    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('dragover');
      if (e.dataTransfer.files[0]) loadImageFile(e.dataTransfer.files[0]);
    });

    window.addEventListener('paste', (e) => {
      const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
      if (item) loadImageFile(item.getAsFile());
    });
  }

  function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setupEditor(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function setupEditor(img) {
    mount.innerHTML = `
      <div class="remover-editor-layout">
        <!-- Lienzo Central -->
        <main class="remover-canvas-area">
          <div class="remover-canvas-frame" id="canvas-frame">
            <canvas id="remover-canvas"></canvas>
          </div>
        </main>

        <!-- Barra Lateral de Herramientas -->
        <aside class="remover-sidebar">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="tool-card">
              <button type="button" class="btn-magic-auto" id="btn-auto-clean">
                ✨ Quitar Fondo en 1 Clic
              </button>
            </div>

            <div class="tool-card">
              <span class="tool-card-title">Retoque Manual</span>
              <div class="tool-pills-row">
                <button type="button" class="btn-tool-pill active" id="btn-tool-wand">🪄 Varita</button>
                <button type="button" class="btn-tool-pill" id="btn-tool-brush">🧹 Goma</button>
              </div>

              <div id="wand-opts" class="slider-field" style="margin-top: 6px;">
                <span>Sensibilidad Varita: <b id="val-tol">30%</b></span>
                <input type="range" id="slider-tol" min="5" max="80" value="30" class="range-slider-remover" />
              </div>

              <div id="brush-opts" class="slider-field" style="display: none; margin-top: 6px;">
                <span>Tamaño Goma: <b id="val-brush">25px</b></span>
                <input type="range" id="slider-brush" min="5" max="80" value="25" class="range-slider-remover" />
              </div>

              <div style="display: flex; gap: 6px; margin-top: 6px;">
                <button type="button" class="btn-download-png" style="flex: 1;" id="btn-undo">↩️ Deshacer</button>
                <button type="button" class="btn-download-png" style="flex: 1;" id="btn-reset">🔄 Reiniciar</button>
              </div>
            </div>
          </div>

          <!-- Acciones de Destino -->
          <div class="remover-export-group">
            <button type="button" class="btn-to-effects" id="btn-use-in-effects">
              ⚡ Usar en Editor de Efectos
            </button>
            <button type="button" class="btn-download-png" id="btn-send-to-shirt">
              👕 Enviar a Camiseta 3D
            </button>
            <button type="button" class="btn-download-png" id="btn-download-hd">
              💾 Descargar PNG Transparente
            </button>
          </div>
        </aside>
      </div>
    `;

    const canvas = mount.querySelector('#remover-canvas');
    const ctx = canvas.getContext('2d');

    const maxDim = 1200;
    const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack = [];

    function saveUndo() {
      if (undoStack.length > 5) undoStack.shift();
      undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    // Auto clean
    mount.querySelector('#btn-auto-clean').addEventListener('click', () => {
      saveUndo();
      const detected = autoDetectBackgroundColor(currentImageData) || { r: 255, g: 255, b: 255 };
      eraseBackgroundAuto(currentImageData, detected, { tolerance: wandTolerance });
      ctx.putImageData(currentImageData, 0, 0);
    });

    // Varita / Goma toggle
    const btnWand = mount.querySelector('#btn-tool-wand');
    const btnBrush = mount.querySelector('#btn-tool-brush');
    const wandOpts = mount.querySelector('#wand-opts');
    const brushOpts = mount.querySelector('#brush-opts');

    btnWand.addEventListener('click', () => {
      activeTool = 'wand';
      btnWand.classList.add('active'); btnBrush.classList.remove('active');
      wandOpts.style.display = 'flex'; brushOpts.style.display = 'none';
    });
    btnBrush.addEventListener('click', () => {
      activeTool = 'brush';
      btnBrush.classList.add('active'); btnWand.classList.remove('active');
      brushOpts.style.display = 'flex'; wandOpts.style.display = 'none';
    });

    mount.querySelector('#slider-tol').addEventListener('input', (e) => {
      wandTolerance = parseInt(e.target.value, 10);
      mount.querySelector('#val-tol').textContent = wandTolerance + '%';
    });
    mount.querySelector('#slider-brush').addEventListener('input', (e) => {
      brushSize = parseInt(e.target.value, 10);
      mount.querySelector('#val-brush').textContent = brushSize + 'px';
    });

    // Deshacer / Reset
    mount.querySelector('#btn-undo').addEventListener('click', () => {
      if (undoStack.length > 0) {
        currentImageData = undoStack.pop();
        ctx.putImageData(currentImageData, 0, 0);
      }
    });
    mount.querySelector('#btn-reset').addEventListener('click', () => {
      saveUndo();
      ctx.putImageData(originalImageData, 0, 0);
      currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    });

    // Interacción sobre canvas
    canvas.addEventListener('click', (e) => {
      if (activeTool !== 'wand') return;
      saveUndo();
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
      const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
      const idx = (y * canvas.width + x) * 4;
      const targetColor = {
        r: currentImageData.data[idx],
        g: currentImageData.data[idx + 1],
        b: currentImageData.data[idx + 2]
      };
      keyBackground(currentImageData, targetColor, { tolerance: wandTolerance, seeds: [x, y] });
      ctx.putImageData(currentImageData, 0, 0);
    });

    canvas.addEventListener('mousedown', (e) => {
      if (activeTool === 'brush') { saveUndo(); isErasingBrush = true; eraseAtPoint(e); }
    });
    window.addEventListener('mousemove', (e) => {
      if (isErasingBrush) eraseAtPoint(e);
    });
    window.addEventListener('mouseup', () => { isErasingBrush = false; });

    function eraseAtPoint(e) {
      const rect = canvas.getBoundingClientRect();
      const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const cy = (e.clientY - rect.top) * (canvas.height / rect.height);
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    // Exportar
    mount.querySelector('#btn-use-in-effects').addEventListener('click', () => {
      const url = canvas.toDataURL('image/png');
      sessionStorage.setItem('shirt_lab_imported_image', url);
      window.location.href = '/photoshop-lab.html';
    });

    mount.querySelector('#btn-send-to-shirt').addEventListener('click', () => {
      const url = canvas.toDataURL('image/png');
      sessionStorage.setItem('shirt_lab_exported_art', url);
      window.location.href = '/#estudio';
    });

    mount.querySelector('#btn-download-hd').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'arte-sin-fondo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
});
