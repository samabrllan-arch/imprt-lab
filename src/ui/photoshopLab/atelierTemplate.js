/**
 * PLANTILLA HTML DE ATELIER STUDIO CON HERRAMIENTAS INTEGRADAS (<190 Líneas)
 */
export function getAtelierLayoutTemplate() {
  return `
    <div class="atelier-studio-layout">
      <!-- 1. Dock de Herramientas -->
      <aside class="atelier-tools-sidebar">
        <button type="button" class="tool-tab-btn active" data-tool="text" title="Texto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          <span>Texto</span>
        </button>
        <button type="button" class="tool-tab-btn" data-tool="image" title="Subir Imagen & Quitar Fondo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Imagen</span>
        </button>
        <button type="button" class="tool-tab-btn" data-tool="effects" title="Efectos Streetwear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>Efectos</span>
        </button>
        <button type="button" class="tool-tab-btn" data-tool="bg" title="Color de Fondo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11l-8-8-8 8 8 8 8-8z"/><path d="M5 19h14"/></svg>
          <span>Fondo</span>
        </button>
      </aside>

      <!-- 2. Cajón de Herramienta Activa -->
      <div class="atelier-drawer" id="atelier-drawer">
        <!-- Panel de Texto -->
        <div class="drawer-panel" id="panel-tool-text">
          <h4 class="drawer-title">Tipografía</h4>
          <button type="button" class="btn-atelier-primary" id="btn-add-text-layer">+ Añadir Texto</button>
          <div class="drawer-section" style="margin-top: 10px;">
            <label class="drawer-label">Contenido:</label>
            <input type="text" id="input-layer-text" class="input-field-atelier" value="STREETWEAR" />
          </div>
          <div class="drawer-section">
            <label class="drawer-label">Fuente:</label>
            <select id="select-font-family" class="input-field-atelier">
              <option value="Anton">Anton (Street Impact)</option>
              <option value="Bebas Neue">Bebas Neue (Street Tall)</option>
              <option value="Permanent Marker">Permanent Marker (Graffiti)</option>
              <option value="Montserrat">Montserrat 900 (Heavy)</option>
              <option value="Outfit">Outfit (Cyber Luxury)</option>
            </select>
          </div>
          <div class="drawer-section">
            <label class="drawer-label">Color:</label>
            <div class="color-palette-compact" id="text-colors-mount">
              <span class="color-swatch-sm active" data-color="#ffffff" style="background:#fff;"></span>
              <span class="color-swatch-sm" data-color="#ff5722" style="background:#ff5722;"></span>
              <span class="color-swatch-sm" data-color="#00f0ff" style="background:#00f0ff;"></span>
              <span class="color-swatch-sm" data-color="#ffea00" style="background:#ffea00;"></span>
              <span class="color-swatch-sm" data-color="#ec4899" style="background:#ec4899;"></span>
              <span class="color-swatch-sm" data-color="#111215" style="background:#111215; border: 1px solid #444;"></span>
            </div>
          </div>
        </div>

        <!-- Panel de Imagen: Quitar Fondo Integrado & Calidad HD -->
        <div class="drawer-panel" id="panel-tool-image" style="display: none;">
          <h4 class="drawer-title">Mi Imagen</h4>
          <label class="btn-atelier-primary" style="display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
            <span>📁 Subir Imagen (PNG/JPG)</span>
            <input type="file" id="input-upload-image" accept="image/*" style="display: none;" />
          </label>

          <!-- Herramientas de Extracción de Fondo Directas -->
          <div class="bg-cleaner-box">
            <span class="drawer-label" style="color: #00f0ff;">🪄 Quitar Fondo Aquí Mismo:</span>
            <div class="quick-clean-buttons">
              <button type="button" class="btn-clean-action btn-green-chroma" id="btn-clean-green" title="Eliminar fondo verde con despill anti-halo">
                🟢 Quitar Fondo Verde
              </button>
              <button type="button" class="btn-clean-action" id="btn-clean-auto" title="Detectar y eliminar fondo en 1 clic">
                ✨ Quitar Fondo Auto
              </button>
            </div>
            <div class="slider-field-row" style="margin-top: 6px;">
              <span>Tolerancia de Fondo: <b id="val-clean-tol">35%</b></span>
              <input type="range" id="slider-clean-tol" min="5" max="75" value="35" class="range-slider-atelier" />
            </div>
            <div class="slider-field-row">
              <span>Recorte de Borde (Choke): <b id="val-clean-choke">1px</b></span>
              <input type="range" id="slider-clean-choke" min="0" max="3" value="1" class="range-slider-atelier" />
            </div>
            <div class="quick-clean-buttons" style="margin-top: 6px;">
              <button type="button" class="btn-clean-action" id="btn-refine-edges" style="border-color: #00f0ff; color: #00f0ff;" title="Elimina neblina y halos sucios en el contorno">
                🎯 Perfilar Bordes (Quitar Halos)
              </button>
            </div>
            <button type="button" class="btn-restore-img" id="btn-restore-original-img">
              ↩️ Restaurar Imagen Original
            </button>
          </div>

          <!-- Ajustes de Calidad, Subtonos & Nitidez -->
          <div class="drawer-section" style="margin-top: 10px;">
            <label class="drawer-label">Ajustes & Subtonos:</label>
            <button type="button" class="btn-sharpen-hd" id="btn-sharpen-hd">✨ Claridad HD Suave (Sin Ruido)</button>
            <div class="slider-field-row">
              <span>Subtono de Color (Tono)</span>
              <input type="range" id="slider-img-hue" min="-180" max="180" value="0" class="range-slider-atelier" />
            </div>
            <div class="slider-field-row">
              <span>Saturación</span>
              <input type="range" id="slider-img-sat" min="0" max="200" value="100" class="range-slider-atelier" />
            </div>
            <div class="slider-field-row">
              <span>Brillo</span>
              <input type="range" id="slider-img-bright" min="50" max="180" value="100" class="range-slider-atelier" />
            </div>
            <div class="slider-field-row">
              <span>Contraste</span>
              <input type="range" id="slider-img-contrast" min="50" max="200" value="100" class="range-slider-atelier" />
            </div>
          </div>
        </div>

        <!-- Panel de Efectos Streetwear -->
        <div class="drawer-panel" id="panel-tool-effects" style="display: none;">
          <h4 class="drawer-title">Efectos & Elementos</h4>
          <div class="effects-filter-tabs">
            <button type="button" class="btn-fx-tab active" data-cat="all">Todos</button>
            <button type="button" class="btn-fx-tab" data-cat="chroma_green">🟢 Croma Verde</button>
            <button type="button" class="btn-fx-tab" data-cat="lightning">⚡ Rayos</button>
            <button type="button" class="btn-fx-tab" data-cat="clouds">☁️ Nubes</button>
            <button type="button" class="btn-fx-tab" data-cat="fire">🔥 Fuego</button>
          </div>
          <div class="effects-grid-mount" id="effects-grid"></div>
        </div>

        <!-- Panel de Fondo -->
        <div class="drawer-panel" id="panel-tool-bg" style="display: none;">
          <h4 class="drawer-title">Fondo del Lienzo</h4>
          <div class="drawer-section">
            <button type="button" class="btn-bg-option active" data-bg="transparent">🏁 Transparente (DTF)</button>
            <button type="button" class="btn-bg-option" data-bg="#111215">👕 Negro Camiseta</button>
            <button type="button" class="btn-bg-option" data-bg="#ffffff">👕 Blanco Camiseta</button>
            <button type="button" class="btn-bg-option" data-bg="#8b1e1e">👕 Vinotinto</button>
          </div>
        </div>
      </div>

      <!-- 3. Escenario Central -->
      <main class="atelier-canvas-stage">
        <div class="canvas-shadow-frame" id="canvas-frame">
          <canvas id="atelier-main-canvas"></canvas>
        </div>

        <div class="stage-transform-bar" id="transform-bar">
          <div class="trans-group">
            <span class="trans-label">📐 Escala</span>
            <button type="button" class="btn-scale-step" id="btn-scale-down">−</button>
            <input type="range" id="slider-layer-scale" min="0.2" max="3.0" step="0.05" value="1.0" class="range-slider-atelier" />
            <button type="button" class="btn-scale-step" id="btn-scale-up">+</button>
            <span id="label-scale-val" class="trans-val">100%</span>
          </div>
          <div class="trans-group">
            <span class="trans-label">🔄 Rotación</span>
            <input type="range" id="slider-layer-rot" min="-180" max="180" step="5" value="0" class="range-slider-atelier" />
            <button type="button" class="btn-scale-step" id="btn-rot-zero">0°</button>
          </div>
          <div class="trans-group-actions">
            <button type="button" class="btn-trans-act" id="btn-layer-forward" title="Traer al frente">⬆️</button>
            <button type="button" class="btn-trans-act" id="btn-layer-backward" title="Enviar atrás">⬇️</button>
            <button type="button" class="btn-trans-act" id="btn-layer-clone" title="Duplicar">📋</button>
            <button type="button" class="btn-trans-act btn-danger" id="btn-layer-del" title="Eliminar">🗑️</button>
          </div>
        </div>
      </main>

      <!-- 4. Inspector de Capas & Enviar -->
      <aside class="atelier-layers-sidebar">
        <div class="layers-header">
          <span class="layers-title">CAPAS (<span id="layers-count">0</span>)</span>
          <button type="button" class="btn-layer-sub" id="btn-clear-all" title="Limpiar todo">Limpiar</button>
        </div>
        <div class="layers-list" id="layers-list-mount"></div>
        <div class="layers-footer-action">
          <button type="button" class="btn-send-to-shirt" id="btn-submit-to-shirt">
            <span>👕 Enviar a Camiseta 3D</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </aside>
    </div>
  `;
}
