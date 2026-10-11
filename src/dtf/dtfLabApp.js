import { createDtf2DCanvas } from './dtf2dCanvas.js';
import { createDtf3DViewer } from './dtf3dViewer.js';
import { auditDtfPrintQuality } from './dtfCoreAlgorithms.js';
import { FABRIC_COLORS } from '../config/colors.js';

const DROPS = [
  { id: 'goku', name: 'Son Goku SSJ', path: '/assets/drops/goku.png' },
  { id: 'rick', name: 'Rick & Morty', path: '/assets/drops/rick.png' },
  { id: 'oni', name: 'Cyber Oni', path: '/assets/drops/oni.png' },
  { id: 'bone', name: 'Bone Savage', path: '/assets/drops/bone.png' },
  { id: 'wolf', name: 'Gentleman Wolf', path: '/assets/drops/wolf.png' },
  { id: 'iron', name: 'Iron Man Arc', path: '/assets/drops/iron.png' }
];

export function initDtfLab() {
  const canvasContainer = document.getElementById('workbench-2d');
  const viewerContainer = document.getElementById('viewport-3d');
  if (!canvasContainer || !viewerContainer) return;

  let viewer3d = null;
  const canvas2d = createDtf2DCanvas(canvasContainer, () => {
    if (viewer3d) viewer3d.updateTexture();
  });
  viewer3d = createDtf3DViewer(viewerContainer, canvas2d.master3dCanvas);

  // Cargar drop inicial
  const defaultImg = new Image();
  defaultImg.onload = () => canvas2d.setDecalImage(defaultImg);
  defaultImg.src = DROPS[0].path;

  bindControls(canvas2d, viewer3d);
}

function bindControls(canvas2d, viewer3d) {
  const s = canvas2d.state;

  // 1. Selector de silueta
  document.querySelectorAll('.btn-sil').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-sil').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const sil = btn.dataset.sil;
      s.silhouette = sil;
      viewer3d.loadSilhouette(sil);
      canvas2d.redrawAll();
    });
  });

  // 2. Swatches de color
  const swatchesEl = document.getElementById('color-swatches');
  if (swatchesEl) {
    FABRIC_COLORS.forEach((col, idx) => {
      const dot = document.createElement('button');
      dot.className = `color-dot ${idx === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = col.hex;
      dot.title = col.name;
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        s.shirtColor = col.hex;
        canvas2d.redrawAll();
      });
      swatchesEl.appendChild(dot);
    });
  }

  // 3. Sliders de transformación básica
  const slScale = document.getElementById('sl-scale');
  slScale?.addEventListener('input', (e) => {
    s.scale = parseFloat(e.target.value);
    document.getElementById('v-scale').textContent = Math.round(s.scale * 100) + '%';
    canvas2d.redrawAll();
  });

  const slRot = document.getElementById('sl-rotation');
  slRot?.addEventListener('input', (e) => {
    s.rotation = parseFloat(e.target.value);
    document.getElementById('v-rotation').textContent = s.rotation + '°';
    canvas2d.redrawAll();
  });

  // 4. Cama de blanco y Choke
  const chkWhite = document.getElementById('chk-white-layer');
  chkWhite?.addEventListener('change', (e) => {
    s.showWhiteUnderbase = e.target.checked;
    document.getElementById('choke-controls').style.display = s.showWhiteUnderbase ? 'block' : 'none';
    canvas2d.reprocessDecal();
  });

  const slChoke = document.getElementById('sl-choke');
  slChoke?.addEventListener('input', (e) => {
    s.chokePx = parseFloat(e.target.value);
    document.getElementById('v-choke').textContent = s.chokePx + ' px';
    canvas2d.reprocessDecal();
  });

  // 5. Knockout
  const selKnockout = document.getElementById('sel-knockout');
  selKnockout?.addEventListener('change', (e) => {
    s.knockoutMode = e.target.value;
    canvas2d.reprocessDecal();
  });

  const slThreshold = document.getElementById('sl-threshold');
  slThreshold?.addEventListener('input', (e) => {
    s.threshold = parseInt(e.target.value, 10);
    document.getElementById('v-threshold').textContent = s.threshold;
    canvas2d.reprocessDecal();
  });

  // 6. Micro-Halftone
  const selHalftone = document.getElementById('sel-halftone');
  selHalftone?.addEventListener('change', (e) => {
    s.lpi = parseFloat(e.target.value);
    canvas2d.reprocessDecal();
  });

  // 7. Simulación de planchado
  const slPress = document.getElementById('sl-press');
  slPress?.addEventListener('input', (e) => {
    s.pressIntensity = parseInt(e.target.value, 10);
    document.getElementById('v-press').textContent = s.pressIntensity + '%';
    canvas2d.reprocessDecal();
  });

  // 8. Grid de drops
  const dropsGrid = document.getElementById('drops-grid');
  if (dropsGrid) {
    DROPS.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.className = `drop-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<img src="${d.path}" alt="${d.name}" /><span>${d.name}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.drop-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const img = new Image();
        img.onload = () => canvas2d.setDecalImage(img);
        img.src = d.path;
      });
      dropsGrid.appendChild(btn);
    });
  }

  // 9. Subida de imagen
  const fileInp = document.getElementById('input-file');
  fileInp?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => canvas2d.setDecalImage(img);
      img.src = ev.target.result;
      document.querySelectorAll('.drop-btn').forEach((b) => b.classList.remove('active'));
    };
    reader.readAsDataURL(file);
  });

  // 10. Auditoría de calidad
  const modal = document.getElementById('audit-modal');
  const modalBody = document.getElementById('audit-modal-body');
  document.getElementById('btn-audit')?.addEventListener('click', () => {
    const imgData = canvas2d.getProcessedImageData();
    const audit = auditDtfPrintQuality(imgData, 25);
    renderAudit(audit, modalBody);
    modal.style.display = 'flex';
  });

  document.getElementById('btn-close-audit')?.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

function renderAudit(audit, container) {
  container.innerHTML = '';
  audit.results.forEach((r) => {
    const card = document.createElement('div');
    card.className = `audit-card ${r.status}`;
    card.innerHTML = `
      <div class="audit-icon">${r.status === 'ok' ? '🟢' : '⚠️'}</div>
      <div>
        <h4>${r.title}</h4>
        <p>${r.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDtfLab);
} else {
  initDtfLab();
}
