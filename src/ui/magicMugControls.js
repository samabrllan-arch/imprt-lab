import '../styles/magicMug.css';
import { store } from '../state/store.js';
import { setMagicMug, setMugHeatLevel } from '../state/actions.js';
import { formatCurrency, PRICING_CONFIG } from '../config/pricing.js';
import { paintRanges } from './rangeFill.js';

let animFrameId = 0;

function animateHeatTo(targetLevel, durationMs = 1500) {
  cancelAnimationFrame(animFrameId);
  const startLevel = store.getState().mugHeatLevel || 0;
  const delta = targetLevel - startLevel;
  if (Math.abs(delta) < 0.01) {
    setMugHeatLevel(targetLevel);
    return;
  }
  const startTime = performance.now();
  function step(now) {
    const t = Math.min(1, (now - startTime) / durationMs);
    // Ease in-out cubic para simular transferencia térmica progresiva
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    setMugHeatLevel(startLevel + delta * eased);
    if (t < 1) {
      animFrameId = requestAnimationFrame(step);
    }
  }
  animFrameId = requestAnimationFrame(step);
}

function formatTempLabel(heatLevel) {
  const celsius = Math.round(20 + (heatLevel || 0) * 65);
  const pct = Math.round((heatLevel || 0) * 100);
  if (pct <= 5) return `❄️ ${celsius}°C · Frío (Negro Oculto)`;
  if (pct >= 95) return `🔥 ${celsius}°C · Caliente (100% Visible)`;
  return `🌡️ ${celsius}°C · Revelando (${pct}%)`;
}

export function renderMagicMugCard(state) {
  if (state.selectedSilhouette !== 'mug') return '';
  const isMagic = !!state.isMagicMug;
  const heat = state.mugHeatLevel ?? 0;
  const isHot = heat >= 0.5;
  const basePrice = formatCurrency(PRICING_CONFIG.baseMugPrice || 28000);
  const magicPrice = formatCurrency((PRICING_CONFIG.baseMugPrice || 28000) + (PRICING_CONFIG.magicMugAddon || 10000));

  return `
    <div class="control-card magic-mug-card" id="magic-mug-card">
      <div class="card-header-clean">
        <span class="card-eyebrow">ACABADO DEL VASO 11 OZ</span>
        <span class="color-pill-tag">${isMagic ? '✨ Termosensible' : '☕ Cerámico Clásico'}</span>
      </div>

      <div class="mug-type-grid" role="group" aria-label="Tipo de Vaso">
        <button type="button" class="btn-mug-type ${!isMagic ? 'active' : ''}" data-mug-mode="classic">
          <div class="mug-type-head">
            <span>☕ Clásico</span>
            <span class="mug-type-price">${basePrice}</span>
          </div>
          <span class="mug-type-desc">Cerámica brillante a color. Diseño siempre visible.</span>
        </button>

        <button type="button" class="btn-mug-type ${isMagic ? 'active' : ''}" data-mug-mode="magic">
          <div class="mug-type-head">
            <span>✨ Mágico</span>
            <span class="mug-type-price">${magicPrice}</span>
          </div>
          <span class="mug-type-desc">Negro en frío ❄️ que revela tu imagen con calor 🔥.</span>
        </button>
      </div>

      ${isMagic ? `
        <div class="mug-heat-simulator">
          <button type="button" class="btn-pour-hot ${isHot ? 'is-hot' : ''}" id="btn-toggle-mug-heat">
            <span>${isHot ? '❄️ Enfriar Vaso (Cubrir de Negro)' : '☕ Servir Líquido Caliente (Revelar Imagen)'}</span>
          </button>

          <div class="mug-temp-header">
            <span>Simulador Térmico en Vivo</span>
            <span class="mug-temp-badge" id="mug-temp-badge">${formatTempLabel(heat)}</span>
          </div>

          <input
            type="range"
            id="mug-heat-slider"
            class="range-slider"
            min="0"
            max="1"
            step="0.01"
            value="${heat.toFixed(2)}"
            aria-label="Temperatura del vaso mágico"
          />
          <div class="mug-temp-scale">
            <span>❄️ 20°C (Negro)</span>
            <span>🌡️ 52°C (Mitad)</span>
            <span>🔥 85°C (Revelado)</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function bindMagicMugEvents(container) {
  container.querySelectorAll('[data-mug-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isMagic = btn.getAttribute('data-mug-mode') === 'magic';
      cancelAnimationFrame(animFrameId);
      setMagicMug(isMagic);
      if (isMagic) {
        // Pequeña demostración automática: inicia frío y tras 350ms revela con calor
        setMugHeatLevel(0);
        setTimeout(() => animateHeatTo(1.0, 1650), 320);
      }
    });
  });

  const pourBtn = container.querySelector('#btn-toggle-mug-heat');
  pourBtn?.addEventListener('click', () => {
    const current = store.getState().mugHeatLevel || 0;
    animateHeatTo(current >= 0.5 ? 0.0 : 1.0, 1500);
  });

  const heatSlider = container.querySelector('#mug-heat-slider');
  heatSlider?.addEventListener('input', (e) => {
    cancelAnimationFrame(animFrameId);
    setMugHeatLevel(parseFloat(e.target.value));
  });
}

export function syncMagicMugHeatUi(container, state) {
  const slider = container.querySelector('#mug-heat-slider');
  const badge = container.querySelector('#mug-temp-badge');
  const pourBtn = container.querySelector('#btn-toggle-mug-heat');
  const heat = state.mugHeatLevel || 0;
  if (slider && document.activeElement !== slider) {
    slider.value = heat.toFixed(2);
    paintRanges(container);
  }
  if (badge) badge.textContent = formatTempLabel(heat);
  if (pourBtn) {
    const isHot = heat >= 0.5;
    pourBtn.classList.toggle('is-hot', isHot);
    pourBtn.innerHTML = `<span>${isHot ? '❄️ Enfriar Vaso (Cubrir de Negro)' : '☕ Servir Líquido Caliente (Revelar Imagen)'}</span>`;
  }
}
