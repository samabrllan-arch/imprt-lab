import { getTextPanelTemplate } from './imageEditorTextPanel.js';
import { getAdjustPanelTemplate } from './imageEditorAdjustPanel.js';

/**
 * Plantilla HTML de la Ventana Studio de Tratamiento de Imagen (NODE-010).
 * Columna derecha en dos pestañas: 🎨 Fondo & Retoque (1 clic, croma, varita/goma, prompt IA) y
 * 🔤 Textos (caligrafías + curvatura). Los botones de acción final quedan fijos bajo las pestañas.
 */
export function getImageEditorTemplate() {
  return `
    <div class="image-editor-dialog">
      <!-- Cabecera de la Ventana -->
      <div class="image-editor-header">
        <div class="editor-header-info">
          <span class="editor-eyebrow">ESTUDIO DE TRATAMIENTO DE IMAGEN</span>
          <h3 class="editor-title">Acondicionar Arte para Estampado</h3>
        </div>
        <div class="editor-header-actions">
          <button type="button" class="btn-editor-tour" id="btn-editor-tour" title="Tour guiado de 6 pasos">💡 ¿Cómo funciona? / Tour</button>
          <button type="button" class="editor-close-btn" id="btn-close-editor" title="Cerrar ventana">✕</button>
        </div>
      </div>

      <!-- Cuerpo Principal en 2 Columnas Limpias -->
      <div class="image-editor-body">
        <!-- Columna Izquierda: Lienzo Amplio y Controles de Zoom -->
        <div class="editor-preview-column">
          <!-- Barra superior flotante de vista y zoom -->
          <div class="editor-viewport-nav">
            <div class="viewport-nav-group">
              <button type="button" class="btn-zoom-ctrl" id="btn-zoom-out" title="Alejar">−</button>
              <span class="zoom-level-badge" id="zoom-level-badge">100%</span>
              <button type="button" class="btn-zoom-ctrl" id="btn-zoom-in" title="Acercar">+</button>
              <button type="button" class="btn-zoom-ctrl" id="btn-zoom-fit" title="Ajustar a pantalla">📐 Ajustar</button>
            </div>
            <!-- Solo en pantallas táctiles (imageEditorTouch.css): Mover/zoom sin borrar vs herramienta de edición -->
            <div class="viewport-nav-group touch-mode-group" id="touch-mode-group" role="group" aria-label="Modo táctil">
              <button type="button" class="btn-zoom-ctrl btn-touch-mode" id="btn-touch-move" title="Mover y hacer zoom sin borrar">🖐️ Mover</button>
              <button type="button" class="btn-zoom-ctrl btn-touch-mode active" id="btn-touch-edit" title="Editar con la herramienta activa">🪄 Varita</button>
            </div>
            <div class="viewport-nav-group">
              <button type="button" class="btn-zoom-ctrl btn-preview-toggle active" data-stage-bg="shirt" id="btn-bg-shirt">
                👕 Prenda
              </button>
              <button type="button" class="btn-zoom-ctrl btn-preview-toggle" data-stage-bg="checkers" id="btn-bg-checkers">
                🏁 Transparente
              </button>
            </div>
          </div>

          <!-- Viewport Interactivo -->
          <div class="editor-viewport" id="editor-viewport" data-stage-bg="shirt" data-active-tool="auto">
            <div class="editor-canvas-container" id="editor-canvas-wrap">
              <canvas id="editor-canvas"></canvas>
            </div>
            <div class="brush-cursor-ring" id="brush-cursor-ring"></div>
          </div>

          <!-- Barra inferior del lienzo: Deshacer y Estado -->
          <div class="editor-stage-bottom-bar">
            <button type="button" class="btn-undo-action" id="btn-undo-step" disabled title="Deshacer (Ctrl+Z)">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v6h6M3 13a9 9 0 1 0 2.5-6.3L3 13"/></svg>
              <span>Deshacer (<b id="undo-counter">0</b>)</span>
            </button>
            <div class="editor-dpi-wrap">
              <span class="dpi-badge dpi-optimal" id="editor-dpi-badge" role="status"><span id="editor-dpi-label">Calculando DPI…</span></span>
              <span class="editor-preview-badge" id="editor-meta-badge">Listo</span>
              <span class="editor-dpi-note" id="editor-dpi-note"></span>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: pestañas + acciones finales fijas -->
        <div class="editor-tools-column">
          <div class="editor-tabs" role="tablist">
            <button type="button" class="editor-tab active" id="tab-bg" data-tab="bg" role="tab">🎨 Fondo &amp; Retoque</button>
            <button type="button" class="editor-tab" id="tab-adjust" data-tab="adjust" role="tab">🎛️ Ajustes</button>
            <button type="button" class="editor-tab" id="tab-text" data-tab="text" role="tab">🔤 Textos</button>
          </div>

          <div class="editor-tab-panels">
            <!-- Pestaña 1: Fondo y retoque -->
            <div class="editor-tab-panel active" id="panel-bg">
              <div class="hero-autoclean-card" id="editor-hero-card">
                <button type="button" class="btn-hero-autoclean" id="btn-hero-auto" style="width: 100%;">✨ Quitar Fondo en 1 Clic</button>
                <div class="hero-autoclean-sub">Detecta automáticamente el fondo, afina 1&nbsp;px el contorno y elimina halos</div>
              </div>

              <div id="editor-manual-block">
                <div class="tool-section-compact">
                  <div class="tool-group-title">🛠️ Retoque &amp; Recorte</div>
                  <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <button type="button" class="btn-tool-pill active" id="btn-tool-wand">🪄 Varita</button>
                    <button type="button" class="btn-tool-pill" id="btn-tool-brush">🧹 Goma</button>
                    <button type="button" class="btn-tool-pill" id="btn-tool-crop">✂️ Recorte Libre</button>
                  </div>
                </div>

                <div id="wand-options-panel" class="tool-detail-box">
                  <div class="slider-group-field">
                    <div class="slider-info"><span>Sensibilidad de borrado</span><span id="tol-val">30%</span></div>
                    <input type="range" id="tolerance-slider" min="5" max="75" step="1" value="30" class="range-slider" style="--pct-ratio: 0.3571;" />
                  </div>
                  <div class="quick-tools-grid" style="margin-top: 6px; grid-template-columns: 1fr 1fr 1fr;">
                    <button type="button" class="btn-tool-pill active" id="btn-mode-connected">📍 Zona</button>
                    <button type="button" class="btn-mode-global btn-tool-pill" id="btn-mode-global">🌐 Todo</button>
                    <button type="button" class="btn-tool-pill" id="btn-mode-viewport" title="Solo borra en la pantalla visible">👁️ En Vista</button>
                  </div>
                  <button type="button" class="btn-tool-pill full-width" id="btn-clean-screen-border" style="margin-top: 6px; justify-content: center; gap: 6px; font-weight: 600;" title="Borra el borde negro o halo oscuro visible en este encuadre">
                    <span>🧹 Limpiar Borde en Pantalla</span>
                  </button>
                </div>

                <div id="brush-options-panel" class="tool-detail-box" style="display: none;">
                  <div class="slider-group-field">
                    <div class="slider-info"><span>Grosor de la goma</span><span id="brush-size-val">20px</span></div>
                    <input type="range" id="brush-size-slider" min="4" max="80" step="2" value="20" class="range-slider" style="--pct-ratio: 0.2105;" />
                  </div>
                  <div class="brush-presets-row">
                    <button type="button" class="btn-brush-preset" data-brush-size="8">Fino</button>
                    <button type="button" class="btn-brush-preset active" data-brush-size="20">Medio</button>
                    <button type="button" class="btn-brush-preset" data-brush-size="45">Grueso</button>
                  </div>
                </div>

                <div id="crop-options-panel" class="tool-detail-box" style="display: none;">
                  <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 6px;">
                    <button type="button" class="btn-tool-pill active" id="btn-crop-mode-rect">⬛ Rectángulo</button>
                    <button type="button" class="btn-tool-pill" id="btn-crop-mode-lasso">➰ Lazo Libre</button>
                  </div>

                  <p id="crop-mode-hint" style="font-size: 0.71rem; color: var(--text-secondary); margin: 0 0 6px 0; line-height: 1.35;">
                    Arrastra un recuadro sobre la imagen para seleccionar el área deseada.
                  </p>

                  <button type="button" class="btn-tool-pill full-width" id="btn-crop-autotrim" style="margin-bottom: 8px; justify-content: center; gap: 6px; font-weight: 600;" title="Encoge el lienzo automáticamente eliminando todo el espacio vacío transparente">
                    <span>📐 Recortar Sobrantes</span>
                    <span style="font-size: 0.64rem; opacity: 0.75;">(Auto-ajustar)</span>
                  </button>

                  <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr;">
                    <button type="button" class="btn-tool-pill active" id="btn-apply-crop" style="border-color: #00f0ff; color: #00f0ff;" disabled>✓ Aplicar</button>
                    <button type="button" class="btn-tool-pill" id="btn-cancel-crop">✕ Cancelar</button>
                  </div>
                </div>
              </div>

              <!-- Asistente de Prompt para IA (fondos limpios y contrastantes) -->
              <div class="ai-prompt-card">
                <div class="ai-prompt-header" id="btn-toggle-ai-card">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span>💡 Prompt para IA</span>
                    <span class="chroma-badge-pill" id="ai-chroma-badge">🎨 Auto</span>
                  </div>
                  <span class="ai-toggle-icon" id="ai-toggle-arrow">▾</span>
                </div>
                <div class="ai-prompt-body" id="ai-prompt-body" style="display: none;">
                  <div class="ai-prompt-tabs">
                    <button type="button" class="btn-prompt-lang active" data-lang="en">Midjourney / Gemini</button>
                    <button type="button" class="btn-prompt-lang" data-lang="es">ChatGPT</button>
                  </div>
                  <textarea readonly class="ai-prompt-text" id="ai-prompt-input" rows="3"></textarea>
                  <button type="button" class="btn-copy-prompt" id="btn-copy-prompt">📋 Copiar Prompt</button>
                </div>
              </div>
            </div>

            <!-- Pestaña 2: Ajustes de tono, transformaciones y filtros -->
            <div class="editor-tab-panel" id="panel-adjust">${getAdjustPanelTemplate()}</div>

            <!-- Pestaña 3: Textos y caligrafías -->
            <div class="editor-tab-panel" id="panel-text">${getTextPanelTemplate()}</div>
          </div>

          <!-- 4. Acciones Finales -->
          <div class="editor-actions-stack">
            <div class="editor-save-grid" role="group" aria-label="Guardar el arte">
              <button type="button" class="btn-editor-save" id="btn-replace-editor" title="Sobrescribe el arte actual con estos cambios">💾 Reemplazar Imagen</button>
              <button type="button" class="btn-editor-save" id="btn-copy-editor" title="Guarda una copia nueva en tu Bóveda sin tocar el original">➕ Guardar como Copia</button>
            </div>
            <button type="button" class="btn-editor-download" id="btn-download-editor" title="PNG transparente a 300 DPI, sin pasar por la camiseta 3D">📥 Descargar Imagen</button>
            <button type="button" class="btn-apply-editor full-width" id="btn-apply-editor">
              Aplicar a Camiseta →
            </button>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn-cancel-editor" id="btn-cancel-editor" style="flex: 1;">Cancelar</button>
              <button type="button" class="btn-reset-clean" id="btn-reset-editor" title="Restablecer original">↺ Original</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
