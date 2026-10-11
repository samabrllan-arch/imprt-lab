import { DECAL_PRESETS } from '../config/presets.js';
import { renderSizePanel } from './decalSizeView.js';

export function renderEmptyZone(zoneConfig) {
  return `
    <div class="control-card ready-zone-card">
      <div class="card-header-clean">
        <span class="card-eyebrow">PERSONALIZAR ${zoneConfig.name.toUpperCase()}</span>
        <span class="zone-ready-badge">✨ LISTO</span>
      </div>
      <p class="ready-zone-hint">Elige un arte de la galería o sube tu logo/diseño para verlo en 3D.</p>
      <div class="quick-preset-actions">
        ${DECAL_PRESETS.slice(0, 3).map(p => `
          <button type="button" class="btn-quick-apply" data-preset-id="${p.id}">
            <span>${p.name.split(' ')[0]}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function sliderField(id, label, valueText, attrs) {
  return `
    <div class="slider-field">
      <div class="slider-info">
        <label class="slider-name" for="${id}-slider">${label}</label>
        <span id="${id}-val" class="slider-val-badge">${valueText}</span>
      </div>
      <input type="range" id="${id}-slider" ${attrs} class="range-slider" />
    </div>`;
}

export function renderActivePanel(decal, zoneConfig, state, zoneId) {
  return `
    <div class="control-card decal-active-panel">
      <div class="card-header-clean">
        <span class="card-eyebrow">AJUSTES DE TRANSFORMACIÓN</span>
        <button type="button" id="btn-remove-decal" class="btn-remove-luxury" title="Retirar estampado">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          <span>Quitar</span>
        </button>
      </div>

      <!-- Ficha del Diseño Activo -->
      <div class="active-decal-card">
        <div class="decal-meta-col">
          <div class="decal-title-line">
            <span class="decal-dot-glow"></span>
            <span class="decal-filename" title="${decal.name}">${decal.name}</span>
          </div>
          <div class="decal-tags-row">
            <span class="decal-pill-tag">DTF HD</span>
            <span class="decal-pill-dim">${zoneConfig.name}</span>
          </div>
        </div>
      </div>

      ${renderSizePanel(state, zoneId)}

      <!-- Sliders de Precisión -->
      <div class="sliders-container">
        ${sliderField('rot', 'Rotación', `${Math.round(decal.rotation)}°`, `min="0" max="360" step="1" value="${decal.rotation}"`)}
        <div class="sliders-grid-2col">
          ${sliderField('posx', 'Posición X', decal.offsetX.toFixed(2), `min="-2.0" max="2.0" step="0.02" value="${decal.offsetX}"`)}
          ${sliderField('posy', 'Posición Y', decal.offsetY.toFixed(2), `min="-2.0" max="2.0" step="0.02" value="${decal.offsetY}"`)}
        </div>
      </div>

      <!-- Botón Principal: Abrir Editor HD -->
      <button type="button" id="btn-edit-decal" class="btn-editor-hero" title="Ajustes avanzados con gotero, filtros y recorte">
        <span class="btn-hero-icon">🎨</span>
        <span class="btn-hero-text">Abrir Editor HD &amp; Fondos</span>
      </button>

      <!-- Botón Único Secundario: Centrar Estampado -->
      <button type="button" id="btn-recenter" class="btn-recenter-luxury" title="Re-centrar diseño al eje de la prenda">
        <span class="btn-recenter-icon">🎯</span>
        <span>Centrar Estampado</span>
      </button>
    </div>
  `;
}
