/**
 * Loader Cyber-Luxury de Alta Fidelidad para el Estudio 3D
 * Reemplaza iconos genéricos por un Blueprint Holográfico de Camiseta Streetwear con telemetría técnica.
 */
export class StudioLoader {
  constructor(mountElement) {
    this.mount = mountElement || document.body;
    this.container = null;
    this.createDom();
  }

  createDom() {
    // Si ya existe un loader previo, reutilizarlo o reemplazarlo
    const existing = document.getElementById('studio-cyber-loader');
    if (existing) existing.remove();

    const preferred = (typeof localStorage !== 'undefined' && localStorage.getItem('shirt_preferred_loader')) || 'cyberscan';
    let assetImg = './assets/loader/loader_cyber_scan.jpg';
    let themeClass = 'orbit-theme';
    let tag = 'CLO3D CAD // ORBITAL SCANNER';
    let coord = 'COTTON 240 GSM';
    let headline = 'ESCANEO DE PRENDA EN TIEMPO REAL';
    let initialMsg = 'Iniciando escáner fotogramétrico 360°...';

    if (preferred === 'hologram') {
      assetImg = './assets/loader/loader_hologram.jpg';
      themeClass = '';
      tag = 'ATELIER 3D // CYBER-TECH v3.0';
      coord = 'MESH: DRACO 240G';
      headline = 'INICIALIZANDO ESTUDIO 3D';
      initialMsg = 'Conectando aceleración de hardware WebGL...';
    } else if (preferred === 'luxury') {
      assetImg = './assets/loader/loader_luxury_faceted.jpg';
      themeClass = 'gold-theme';
      tag = 'HAUTE COUTURE // ATELIER GOLD';
      coord = 'PARIS EDITION';
      headline = 'ATELIER DE ALTA COSTURA';
      initialMsg = 'Preparando entorno de diseño de lujo...';
    }

    const el = document.createElement('div');
    el.id = 'studio-cyber-loader';
    el.className = 'studio-cyber-loader';
    el.innerHTML = `
      <div class="loader-backdrop">
        <div class="loader-grid-overlay"></div>
        <div class="loader-ambient-glow loader-ambient-primary"></div>
        <div class="loader-ambient-glow loader-ambient-secondary"></div>
      </div>

      <div class="loader-content-box">
        <div class="loader-hud-corner corner-tl"></div>
        <div class="loader-hud-corner corner-tr"></div>
        <div class="loader-hud-corner corner-bl"></div>
        <div class="loader-hud-corner corner-br"></div>

        <div class="loader-top-meta">
          <span class="loader-meta-chip">
            <span class="loader-chip-dot"></span>
            ${tag}
          </span>
          <span class="loader-meta-coord" id="loader-coord-display">${coord}</span>
        </div>

        <div class="loader-hologram-stage ${themeClass}">
          <div class="loader-hologram-scanner"></div>
          <div class="loader-hologram-scanner-inner"></div>
          <div class="loader-scanline-laser"></div>
          <img src="${assetImg}" width="136" height="136" loading="eager" alt="Atelier 3D Garment" class="hologram-asset-img" />
        </div>

        <div class="loader-info-group">
          <h2 class="loader-headline">${headline}</h2>
          <div class="loader-status-stream" id="loader-status-msg">
            ${initialMsg}
          </div>
        </div>

        <!-- 4 Fases de Carga Interactiva -->
        <div class="loader-phases-grid">
          <div class="phase-pill active" id="phase-1"><span class="phase-idx">01</span> WebGL</div>
          <div class="phase-pill" id="phase-2"><span class="phase-idx">02</span> Malla CLO3D</div>
          <div class="phase-pill" id="phase-3"><span class="phase-idx">03</span> Texturas DTF</div>
          <div class="phase-pill" id="phase-4"><span class="phase-idx">04</span> Atelier Listo</div>
        </div>

        <div class="loader-progress-module">
          <div class="loader-progress-track">
            <div class="loader-progress-bar" id="loader-progress-fill">
              <span class="progress-bar-head"></span>
            </div>
          </div>
          <div class="loader-progress-footer">
            <span class="loader-specs-tag">PBR COTTON • UV MAP 2048x2048</span>
            <span class="loader-number-readout" id="loader-percent-num">0%</span>
          </div>
        </div>
      </div>
    `;
    this.container = el;
    this.mount.appendChild(el);
  }

  /**
   * Muestra la animación de carga con fases realistas de inicialización 3D
   */
  async play(durationMs = 1200) {
    return new Promise((resolve) => {
      this.container.classList.remove('hidden');
      this.container.classList.add('visible');

      const fill = this.container.querySelector('#loader-progress-fill');
      const percentNum = this.container.querySelector('#loader-percent-num');
      const statusMsg = this.container.querySelector('#loader-status-msg');
      const coordDisplay = this.container.querySelector('#loader-coord-display');

      const phases = [
        this.container.querySelector('#phase-1'),
        this.container.querySelector('#phase-2'),
        this.container.querySelector('#phase-3'),
        this.container.querySelector('#phase-4')
      ];

      const steps = [
        { pct: 20, phase: 0, msg: 'Iniciando escáner fotogramétrico 360°...', coord: 'RADAR: ACTIVO' },
        { pct: 50, phase: 1, msg: 'Mapeando grosor de hilo y caída de tela...', coord: 'TELA: 240 GSM' },
        { pct: 78, phase: 2, msg: 'Indexando zonas DTF de alta resolución...', coord: 'ZONAS: F/B/M' },
        { pct: 95, phase: 3, msg: 'Alineando coordenadas UV con la malla...', coord: 'UV: 100%' },
        { pct: 100, phase: 3, msg: '¡Escaneo completado! Abriendo Atelier 3D...', coord: 'READY: 100%' }
      ];

      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / durationMs, 1);
        const currentPct = Math.floor(progress * 100);

        if (fill) fill.style.width = `${currentPct}%`;
        if (percentNum) percentNum.textContent = `${currentPct}%`;

        // Actualizar fases y mensajes
        for (let i = steps.length - 1; i >= 0; i--) {
          if (currentPct >= steps[i].pct) {
            if (statusMsg && statusMsg.textContent !== steps[i].msg) {
              statusMsg.textContent = steps[i].msg;
            }
            if (coordDisplay && steps[i].coord) {
              coordDisplay.textContent = steps[i].coord;
            }

            // Marcar fases activas
            phases.forEach((p, idx) => {
              if (p) {
                p.classList.toggle('active', idx <= steps[i].phase);
                p.classList.toggle('current', idx === steps[i].phase);
              }
            });
            break;
          }
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setTimeout(() => {
            this.container.classList.add('fade-out');
            setTimeout(() => {
              this.container.classList.remove('visible', 'fade-out');
              this.container.classList.add('hidden');
              resolve();
            }, 360);
          }, 180);
        }
      };

      requestAnimationFrame(update);
    });
  }

  hide() {
    if (this.container) {
      this.container.classList.remove('visible', 'fade-out');
      this.container.classList.add('hidden');
    }
  }
}
