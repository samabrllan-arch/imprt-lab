/**
 * LABORATORIO DE LOADERS 3D
 * Controlador interactivo para comparar y probar diferentes estilos de loader.
 */
import { LOADER_VARIANTS } from '../config/loaderVariants.js';

export class LoaderPreviewApp {
  constructor() {
    this.currentVariant = 'hologram';
    this.isPlaying = false;
    this.isFrozen = false;
    this.currentPct = 71;

    this.initDoms();
    this.renderCurrentVariant();
    this.bindEvents();
  }

  initDoms() {
    this.container = document.getElementById('loader-stage-container');
    this.tabBtns = document.querySelectorAll('.variant-tab-btn');
    this.btnPlay = document.getElementById('btn-play-sim');
    this.btnFreeze = document.getElementById('btn-freeze-toggle');
    this.rangePct = document.getElementById('range-progress-scrubber');
    this.scrubberVal = document.getElementById('scrubber-val');
    this.btnApply = document.getElementById('btn-apply-choice');
    this.activeVariantName = document.getElementById('active-variant-name');
  }

  bindEvents() {
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const variantId = btn.getAttribute('data-variant');
        this.selectVariant(variantId);
      });
    });

    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', () => this.runSimulation(1400));
    }

    if (this.btnFreeze) {
      this.btnFreeze.addEventListener('click', () => {
        this.isFrozen = !this.isFrozen;
        this.btnFreeze.classList.toggle('active', this.isFrozen);
        this.btnFreeze.textContent = this.isFrozen ? '▶ Reanudar' : '⏸ Congelar';
      });
    }

    if (this.rangePct) {
      this.rangePct.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.setManualProgress(val);
      });
    }

    if (this.btnApply) {
      this.btnApply.addEventListener('click', () => {
        localStorage.setItem('shirt_preferred_loader', this.currentVariant);
        alert(`¡Listo! El estilo [${LOADER_VARIANTS[this.currentVariant].title}] ahora está activo en la tienda principal.`);
      });
    }
  }

  selectVariant(variantId) {
    if (!LOADER_VARIANTS[variantId]) return;
    this.currentVariant = variantId;

    this.tabBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-variant') === variantId);
    });

    if (this.activeVariantName) {
      this.activeVariantName.textContent = LOADER_VARIANTS[variantId].title;
    }

    this.renderCurrentVariant();
    this.setManualProgress(this.currentPct);
  }

  renderCurrentVariant() {
    const data = LOADER_VARIANTS[this.currentVariant];
    if (!this.container) return;

    let centerVisualHtml = '';
    if (data.imgSrc) {
      centerVisualHtml = `
        <div class="hologram-visual-frame ${data.themeClass}">
          <div class="loader-hologram-scanner"></div>
          <div class="loader-hologram-scanner-inner"></div>
          <div class="loader-scanline-laser"></div>
          <img src="${data.imgSrc}" width="136" height="136" loading="eager" alt="${data.title}" class="hologram-asset-img" />
        </div>
      `;
    } else {
      centerVisualHtml = `
        <div class="kinetic-reactor-core">
          <div class="kinetic-ring ring-outer"></div>
          <div class="kinetic-ring ring-mid"></div>
          <div class="kinetic-ring ring-inner"></div>
          <div class="kinetic-center-emblem">👕</div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="loader-content-box" style="margin: 0 auto;">
        <div class="loader-hud-corner corner-tl"></div>
        <div class="loader-hud-corner corner-tr"></div>
        <div class="loader-hud-corner corner-bl"></div>
        <div class="loader-hud-corner corner-br"></div>

        <div class="loader-top-meta">
          <span class="loader-meta-chip">
            <span class="loader-chip-dot"></span>
            ${data.tag}
          </span>
          <span class="loader-meta-coord" id="preview-meta-coord">${data.meshTag}</span>
        </div>

        ${centerVisualHtml}

        <div class="loader-info-group">
          <h2 class="loader-headline">${data.headline}</h2>
          <div class="loader-status-stream" id="preview-status-msg">
            ${data.steps[0].msg}
          </div>
        </div>

        <div class="loader-phases-grid">
          <div class="phase-pill active" id="p-phase-1"><span class="phase-idx">01</span> WebGL</div>
          <div class="phase-pill" id="p-phase-2"><span class="phase-idx">02</span> Malla CLO3D</div>
          <div class="phase-pill" id="p-phase-3"><span class="phase-idx">03</span> Texturas DTF</div>
          <div class="phase-pill" id="p-phase-4"><span class="phase-idx">04</span> Atelier Listo</div>
        </div>

        <div class="loader-progress-module">
          <div class="loader-progress-track">
            <div class="loader-progress-bar" id="preview-progress-fill" style="width: ${this.currentPct}%;">
              <span class="progress-bar-head"></span>
            </div>
          </div>
          <div class="loader-progress-footer">
            <span class="loader-specs-tag">PBR COTTON • UV MAP 2048x2048</span>
            <span class="loader-number-readout" id="preview-percent-num">${this.currentPct}%</span>
          </div>
        </div>
      </div>
    `;
  }

  setManualProgress(pct) {
    this.currentPct = pct;
    if (this.scrubberVal) this.scrubberVal.textContent = `${pct}%`;
    if (this.rangePct) this.rangePct.value = pct;

    const fill = document.getElementById('preview-progress-fill');
    const num = document.getElementById('preview-percent-num');
    const msg = document.getElementById('preview-status-msg');
    const coord = document.getElementById('preview-meta-coord');
    const phases = [
      document.getElementById('p-phase-1'),
      document.getElementById('p-phase-2'),
      document.getElementById('p-phase-3'),
      document.getElementById('p-phase-4')
    ];

    if (fill) fill.style.width = `${pct}%`;
    if (num) num.textContent = `${pct}%`;

    const data = LOADER_VARIANTS[this.currentVariant];
    for (let i = data.steps.length - 1; i >= 0; i--) {
      if (pct >= data.steps[i].pct || i === 0) {
        if (msg) msg.textContent = data.steps[i].msg;
        if (coord) coord.textContent = data.steps[i].coord;

        const phaseIdx = Math.min(Math.floor((pct / 100) * 4), 3);
        phases.forEach((p, idx) => {
          if (p) {
            p.classList.toggle('active', idx <= phaseIdx);
            p.classList.toggle('current', idx === phaseIdx);
          }
        });
        break;
      }
    }
  }

  runSimulation(durationMs = 1400) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const start = performance.now();

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const pct = Math.floor(progress * 100);

      this.setManualProgress(pct);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        this.isPlaying = false;
      }
    };
    requestAnimationFrame(frame);
  }
}
