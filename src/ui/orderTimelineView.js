/**
 * Componente Visual de Rastreo y Línea de Tiempo del Pedido (NODE-024)
 * Muestra las fases de producción: validación, impresión, estampado, empaque y despacho.
 */
import '../styles/orderTimeline.css';
import { PRODUCTION_STAGES, getStageIndex } from '../config/orderTimeline.js';

function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export function renderOrderTimeline(order) {
  const stageId = order.stage || 'validation';
  const currentIdx = getStageIndex(stageId);
  const id = escapeText(order.id);

  return `
    <div class="mp-timeline" data-timeline-id="${id}">
      <div class="mp-timeline-header">
        <div class="mp-timeline-title">
          <span class="mp-timeline-live-dot"></span>
          <span>Rastreo del Pedido en Vivo</span>
        </div>
        <button type="button" class="mp-sim-btn" data-action="advance-stage" data-id="${id}" title="Simular avance al siguiente paso">
          Simular paso siguiente ⏩
        </button>
      </div>

      <div class="mp-timeline-stepper">
        ${PRODUCTION_STAGES.map((stage, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const stateClass = isDone ? 'is-done' : (isCurrent ? 'is-current' : 'is-upcoming');
          return `
            <div class="mp-timeline-step ${stateClass}">
              <div class="mp-step-indicator">
                <span class="mp-step-node">
                  ${isDone ? '✓' : stage.icon}
                </span>
                ${idx < PRODUCTION_STAGES.length - 1 ? '<span class="mp-step-line"></span>' : ''}
              </div>
              <div class="mp-step-content">
                <div class="mp-step-label-row">
                  <span class="mp-step-label">${escapeText(stage.short)}</span>
                  ${isCurrent ? '<span class="mp-step-badge">En curso</span>' : (isDone ? '<span class="mp-step-badge done">Listo</span>' : '')}
                </div>
                <p class="mp-step-desc">${escapeText(stage.desc)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
