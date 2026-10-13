import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */import{r as F,a as A,b as R,d as _}from"./imageEnhancerService-C14pYpge.js";import"./imageProcessing-XXxTQDrn.js";class D{constructor(e,a=null){this.canvas=e,this.ctx=this.canvas.getContext("2d"),this.ctx.imageSmoothingEnabled=!0,this.ctx.imageSmoothingQuality="high",this.onUpdate=a,this.layers=[],this.selectedLayerIndex=-1,this.bgColor="transparent",this.isDragging=!1,this.dragMode="none",this.dragStart={x:0,y:0},this.initialScale=1,this.initialDist=1,this.handleRadius=8,this.canvas.width=600,this.canvas.height=700,this.isReady=!0,this.initMouseEvents()}addTextLayer(e="STREETWEAR",a={}){const i={id:"layer_"+Date.now(),type:"text",text:e,fontFamily:a.fontFamily||"Anton",fontSize:a.fontSize||54,fillColor:a.fillColor||"#ffffff",strokeColor:a.strokeColor||"#000000",strokeWidth:a.strokeWidth||0,scale:1,rotation:0,x:this.canvas.width/2,y:this.canvas.height/2,visible:!0};return this.layers.push(i),this.selectedLayerIndex=this.layers.length-1,this.render(),i}addImageLayer(e,a="Imagen"){const i=Math.min(350/e.width,350/e.height,1),s={id:"layer_"+Date.now(),type:"image",name:a,img:e,originalSrc:e.src,w:e.width*i,h:e.height*i,scale:1,rotation:0,x:this.canvas.width/2,y:this.canvas.height/2,filterGrayscale:0,filterBrightness:100,filterContrast:100,filterHueRotate:0,filterSaturate:100,visible:!0};return this.layers.push(s),this.selectedLayerIndex=this.layers.length-1,this.render(),s}addEffectLayer(e,a="Efecto"){const i=this.addImageLayer(e,a);return i.type="effect",this.render(),i}getSelectedLayer(){return this.layers[this.selectedLayerIndex]||null}updateSelectedLayerImage(e){const a=this.getSelectedLayer();a&&(a.type==="image"||a.type==="effect")&&(a.img=e,this.render())}restoreSelectedLayerImage(){const e=this.getSelectedLayer();if(e&&e.originalSrc){const a=new Image;a.crossOrigin="anonymous",a.onload=()=>{e.img=a,this.render()},a.src=e.originalSrc}}deleteSelectedLayer(){this.selectedLayerIndex>=0&&(this.layers.splice(this.selectedLayerIndex,1),this.selectedLayerIndex=Math.min(this.selectedLayerIndex,this.layers.length-1),this.render())}duplicateSelectedLayer(){const e=this.getSelectedLayer();e&&(this.layers.push({...e,id:"layer_"+Date.now(),x:e.x+20,y:e.y+20}),this.selectedLayerIndex=this.layers.length-1,this.render())}bringForward(){const e=this.selectedLayerIndex;e>=0&&e<this.layers.length-1&&([this.layers[e],this.layers[e+1]]=[this.layers[e+1],this.layers[e]],this.selectedLayerIndex=e+1,this.render())}sendBackward(){const e=this.selectedLayerIndex;e>0&&([this.layers[e],this.layers[e-1]]=[this.layers[e-1],this.layers[e]],this.selectedLayerIndex=e-1,this.render())}getLayerBounds(e){let a=150,i=60;e.type==="text"?(this.ctx.font=`${e.fontSize}px "${e.fontFamily}"`,a=this.ctx.measureText(e.text).width+20,i=e.fontSize*1.2):e.w&&e.h&&(a=e.w,i=e.h);const s=a*(e.scale||1),o=i*(e.scale||1);return{w:s,h:o,halfW:s/2,halfH:o/2}}buildFilterString(e){const a=[];return e.filterGrayscale>0&&a.push(`grayscale(${e.filterGrayscale}%)`),e.filterBrightness!==100&&a.push(`brightness(${e.filterBrightness}%)`),e.filterContrast!==100&&a.push(`contrast(${e.filterContrast}%)`),e.filterHueRotate&&a.push(`hue-rotate(${e.filterHueRotate}deg)`),e.filterSaturate!==100&&a.push(`saturate(${e.filterSaturate}%)`),a.length?a.join(" "):"none"}render(){const e=this.ctx;e.imageSmoothingEnabled=!0,e.imageSmoothingQuality="high",e.clearRect(0,0,this.canvas.width,this.canvas.height),this.bgColor&&this.bgColor!=="transparent"&&(e.fillStyle=this.bgColor,e.fillRect(0,0,this.canvas.width,this.canvas.height)),this.layers.forEach((a,i)=>{if(!a.visible)return;e.save(),e.translate(a.x,a.y),a.rotation&&e.rotate(a.rotation*Math.PI/180);const s=this.getLayerBounds(a);if(a.type==="text"){const o=a.scale||1;e.font=`${Math.round(a.fontSize*o)}px "${a.fontFamily}", system-ui`,e.textAlign="center",e.textBaseline="middle",a.strokeWidth>0&&(e.strokeStyle=a.strokeColor,e.lineWidth=a.strokeWidth*o,e.strokeText(a.text,0,0)),e.fillStyle=a.fillColor,e.fillText(a.text,0,0)}else e.filter=this.buildFilterString(a),e.drawImage(a.img,-s.halfW,-s.halfH,s.w,s.h),e.filter="none";if(i===this.selectedLayerIndex){e.strokeStyle="#ff5722",e.lineWidth=2,e.setLineDash([5,4]),e.strokeRect(-s.halfW,-s.halfH,s.w,s.h),e.setLineDash([]);const o=this.handleRadius;e.fillStyle="#ff5722",[[-s.halfW,-s.halfH],[s.halfW,-s.halfH],[s.halfW,s.halfH],[-s.halfW,s.halfH]].forEach(([c,f])=>{e.beginPath(),e.arc(c,f,o,0,Math.PI*2),e.fill(),e.strokeStyle="#fff",e.lineWidth=1.5,e.stroke()})}e.restore()}),this.isReady&&this.onUpdate&&this.onUpdate(this)}initMouseEvents(){const e=a=>{const i=this.canvas.getBoundingClientRect();return{x:(a.clientX-i.left)*(this.canvas.width/i.width),y:(a.clientY-i.top)*(this.canvas.height/i.height)}};this.canvas.addEventListener("mousedown",a=>{const i=e(a),s=this.getSelectedLayer();if(s){const c=this.getLayerBounds(s);if([{x:s.x-c.halfW,y:s.y-c.halfH},{x:s.x+c.halfW,y:s.y-c.halfH},{x:s.x+c.halfW,y:s.y+c.halfH},{x:s.x-c.halfW,y:s.y+c.halfH}].some(h=>Math.hypot(i.x-h.x,i.y-h.y)<=this.handleRadius+4)){this.isDragging=!0,this.dragMode="scale",this.initialDist=Math.hypot(i.x-s.x,i.y-s.y)||1,this.initialScale=s.scale||1;return}}let o=-1;for(let c=this.layers.length-1;c>=0;c--){const f=this.layers[c];if(!f.visible)continue;const h=this.getLayerBounds(f);if(Math.abs(i.x-f.x)<=h.halfW&&Math.abs(i.y-f.y)<=h.halfH){o=c;break}}o!==-1?(this.selectedLayerIndex=o,this.isDragging=!0,this.dragMode="move",this.dragStart={x:i.x-this.layers[o].x,y:i.y-this.layers[o].y}):this.selectedLayerIndex=-1,this.render()}),window.addEventListener("mousemove",a=>{if(!this.isDragging||this.selectedLayerIndex===-1)return;const i=e(a),s=this.getSelectedLayer();if(s){if(this.dragMode==="move")s.x=Math.round(i.x-this.dragStart.x),s.y=Math.round(i.y-this.dragStart.y);else if(this.dragMode==="scale"){const o=Math.hypot(i.x-s.x,i.y-s.y);s.scale=Math.max(.15,Math.min(4,parseFloat((o/this.initialDist*this.initialScale).toFixed(2))))}this.render()}}),window.addEventListener("mouseup",()=>{this.isDragging=!1,this.dragMode="none"})}getExportDataUrl(e=2048){const a=document.createElement("canvas");a.width=e,a.height=Math.round(e*(this.canvas.height/this.canvas.width));const i=a.getContext("2d"),s=e/this.canvas.width;return i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",this.bgColor&&this.bgColor!=="transparent"&&(i.fillStyle=this.bgColor,i.fillRect(0,0,a.width,a.height)),this.layers.forEach(o=>{if(!o.visible)return;i.save(),i.translate(o.x*s,o.y*s),o.rotation&&i.rotate(o.rotation*Math.PI/180);const c=this.getLayerBounds(o),f=c.w*s,h=c.h*s;if(o.type==="text"){const p=(o.scale||1)*s;i.font=`${Math.round(o.fontSize*p)}px "${o.fontFamily}", system-ui`,i.textAlign="center",i.textBaseline="middle",o.strokeWidth>0&&(i.strokeStyle=o.strokeColor,i.lineWidth=o.strokeWidth*p,i.strokeText(o.text,0,0)),i.fillStyle=o.fillColor,i.fillText(o.text,0,0)}else i.filter=this.buildFilterString(o),i.drawImage(o.img,-f/2,-h/2,f,h),i.filter="none";i.restore()}),a.toDataURL("image/png")}}const x=[{id:"fx_green_lightning",name:"⚡ Rayo (Fondo Verde)",category:"chroma_green",color:"#00ff00",svg:`<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M145 15 L70 135 L125 135 L85 265 L180 145 L130 145 Z" fill="#00f0ff" />
      <path d="M145 15 L70 135 L125 135 L85 265 L180 145 L130 145 Z" fill="#ffffff" opacity="0.8" />
    </svg>`},{id:"fx_green_fire",name:"🔥 Fuego (Fondo Verde)",category:"chroma_green",color:"#00ff00",svg:`<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M120 15 C135 65 180 100 180 155 C180 200 155 215 145 245 C200 220 210 155 190 105 C220 155 220 225 175 270 C135 300 80 290 50 250 C20 215 25 150 70 95 C65 130 80 160 100 170 C90 130 95 90 120 15 Z" fill="#ff3d00" />
      <path d="M120 75 C130 110 155 140 155 175 C155 210 140 230 125 255 C110 230 100 210 100 175 C100 140 110 110 120 75 Z" fill="#ffea00" />
    </svg>`},{id:"fx_green_clouds",name:"☁️ Nube (Fondo Verde)",category:"chroma_green",color:"#00ff00",svg:`<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M50 150 C30 150 15 135 15 115 C15 95 30 80 48 76 C55 48 80 28 110 28 C140 28 165 48 172 75 C182 70 192 68 205 68 C235 68 255 92 255 120 C255 150 230 175 200 175 L50 175 Z" fill="#475569" />
      <path d="M60 142 C42 142 28 128 28 112 C28 96 40 82 55 80 C62 55 85 38 112 38 C138 38 158 55 165 78 C175 73 185 71 195 71 C222 71 240 92 240 118 C240 145 220 165 195 165 L60 165 Z" fill="#94a3b8" />
    </svg>`},{id:"fx_green_stars",name:"✨ Stars (Fondo Verde)",category:"chroma_green",color:"#00ff00",svg:`<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M120 10 C120 85 145 110 220 120 C145 130 120 155 120 230 C120 155 95 130 20 120 C95 110 120 85 120 10 Z" fill="#ffffff" />
      <circle cx="120" cy="120" r="16" fill="#00f0ff" opacity="0.8" />
    </svg>`},{id:"fx_lightning_storm",name:"Rayo Tormenta",category:"lightning",color:"#00f0ff",svg:`<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <path d="M125 10 L55 125 L105 125 L75 270 L165 140 L115 140 Z" fill="#00f0ff" />
      <path d="M125 10 L55 125 L105 125 L75 270 L165 140 L115 140 Z" fill="#ffffff" opacity="0.85" />
    </svg>`},{id:"fx_lightning_fork",name:"Rayo Bifurcado",category:"lightning",color:"#ffea00",svg:`<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <path d="M110 5 L60 95 L95 95 L40 210 L80 185 L50 275 L120 155 L85 155 L145 75 L110 75 Z" fill="#ffea00" />
      <path d="M110 5 L60 95 L95 95 L40 210 L80 185 L50 275 L120 155 L85 155 L145 75 L110 75 Z" fill="#ffffff" opacity="0.6" />
    </svg>`},{id:"fx_cloud_dense",name:"Nube Tormentosa",category:"clouds",color:"#94a3b8",svg:`<svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 140 C30 140 15 125 15 105 C15 88 28 73 45 70 C52 45 75 25 105 25 C132 25 155 42 163 67 C172 62 182 60 193 60 C223 60 248 83 248 112 C248 141 223 165 193 165 L50 165 Z" fill="#64748b" opacity="0.85" />
      <path d="M60 135 C42 135 28 122 28 105 C28 90 40 77 55 75 C62 52 82 35 108 35 C132 35 152 50 160 72 C168 68 178 66 188 66 C214 66 235 86 235 112 C235 137 214 158 188 158 L60 158 Z" fill="#cbd5e1" opacity="0.5" />
    </svg>`},{id:"fx_fire_tribal",name:"Llamas Tribales",category:"fire",color:"#ff5722",svg:`<svg viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg">
      <path d="M110 10 C125 60 165 95 165 145 C165 185 145 200 135 230 C185 205 195 145 175 100 C205 145 205 210 160 255 C125 285 75 275 45 240 C15 205 20 145 60 95 C55 125 70 155 90 165 C80 125 85 85 110 10 Z" fill="#ff3d00" />
      <path d="M110 70 C120 105 145 130 145 165 C145 195 130 215 115 240 C100 215 90 195 90 165 C90 130 100 105 110 70 Z" fill="#ffeb3b" />
    </svg>`},{id:"fx_star_y2k_4pt",name:"Estrella Y2K 4P",category:"stars",color:"#ffffff",svg:`<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <path d="M110 5 C110 75 135 100 205 110 C135 120 110 145 110 215 C110 145 85 120 15 110 C85 100 110 75 110 5 Z" fill="#ffffff" />
      <circle cx="110" cy="110" r="14" fill="#00f0ff" opacity="0.75" />
    </svg>`}];function I(r){return new Promise((e,a)=>{const i="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(r),s=new Image;s.crossOrigin="anonymous",s.onload=()=>e(s),s.onerror=a,s.src=i})}function H(){return`
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
  `}function W(r){var k,M;r.innerHTML=H();const e=r.querySelector("#atelier-main-canvas"),a=r.querySelector("#input-layer-text"),i=r.querySelector("#layers-list-mount"),s=r.querySelector("#slider-layer-scale"),o=r.querySelector("#label-scale-val"),c=r.querySelector("#slider-layer-rot");let f=35,h=1;const p=t=>!!t&&(t.type==="image"||t.type==="effect");function b(t,{fromSharpenBase:l=!1}={}){const d=n.getSelectedLayer();if(!p(d))return;const u=l&&d.sharpenBase?d.sharpenBase:d.img;let g;try{g=t(u)}catch(m){console.error("[Atelier] No se pudo procesar la imagen:",m);return}const y=new Image;y.onload=()=>{n.getSelectedLayer()===d&&(n.updateSelectedLayerImage(y),d.sharpenBase=l?u:null)},y.src=g}function L(t){t&&(s.value=t.scale||1,o.textContent=`${Math.round((t.scale||1)*100)}%`,c.value=t.rotation||0)}function q(t){if(!i||!t)return;i.innerHTML="",r.querySelector("#layers-count").textContent=t.layers.length,t.layers.forEach((d,u)=>{const g=u===t.selectedLayerIndex,y=document.createElement("div");y.className="layer-item"+(g?" selected":"");const m=d.type==="text"?"🔤":d.type==="effect"?"⚡":"🖼️",B=d.type==="text"?d.text:d.name||"Capa";y.innerHTML=`
        <span class="layer-name">${m} ${B}</span>
        <button type="button" class="btn-layer-sub btn-vis">${d.visible?"👁️":"🙈"}</button>
      `,y.addEventListener("click",()=>{t.selectedLayerIndex=u,d.type==="text"&&a&&(a.value=d.text),L(d),t.render()}),y.querySelector(".btn-vis").addEventListener("click",T=>{T.stopPropagation(),d.visible=!d.visible,t.render()}),i.appendChild(y)});const l=t.getSelectedLayer();l&&L(l)}const n=new D(e,t=>{q(t)}),w=r.querySelector("#effects-grid");function S(t="all"){w.innerHTML="",(t==="all"?x:x.filter(d=>d.category===t)).forEach(d=>{const u=document.createElement("div");u.className="fx-card-item",u.innerHTML=`<div class="fx-preview-box">${d.svg}</div><span class="fx-name">${d.name}</span>`,u.addEventListener("click",async()=>{const g=await I(d.svg);n.addEffectLayer(g,d.name)}),w.appendChild(u)})}S(),r.querySelectorAll(".btn-fx-tab").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll(".btn-fx-tab").forEach(l=>l.classList.remove("active")),t.classList.add("active"),S(t.getAttribute("data-cat"))})}),n.addTextLayer("STREETWEAR",{fontFamily:"Anton",fontSize:62,fillColor:"#ffffff"});const C=x[0];I(C.svg).then(t=>n.addEffectLayer(t,C.name)),r.querySelectorAll(".tool-tab-btn").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll(".tool-tab-btn").forEach(d=>d.classList.remove("active")),t.classList.add("active");const l=t.getAttribute("data-tool");r.querySelector("#panel-tool-text").style.display=l==="text"?"block":"none",r.querySelector("#panel-tool-image").style.display=l==="image"?"block":"none",r.querySelector("#panel-tool-effects").style.display=l==="effects"?"block":"none",r.querySelector("#panel-tool-bg").style.display=l==="bg"?"block":"none"})}),r.querySelector("#btn-clean-green").addEventListener("click",()=>{b(t=>F(t,f,h))});const E=r.querySelector("#btn-clean-auto");E.title="Detecta y elimina el fondo conectado al borde. Shift+clic: también quita zonas encerradas del mismo color.",E.addEventListener("click",t=>{b(l=>A(l,f,h,!t.shiftKey))}),(k=r.querySelector("#btn-refine-edges"))==null||k.addEventListener("click",()=>{b(t=>R(t,110,h))}),r.querySelector("#btn-restore-original-img").addEventListener("click",()=>{n.restoreSelectedLayerImage();const t=n.getSelectedLayer();t&&(t.sharpenBase=null)}),r.querySelector("#btn-sharpen-hd").addEventListener("click",()=>{b(t=>_(t),{fromSharpenBase:!0})}),r.querySelector("#slider-clean-tol").addEventListener("input",t=>{f=parseInt(t.target.value,10),r.querySelector("#val-clean-tol").textContent=f+"%"}),(M=r.querySelector("#slider-clean-choke"))==null||M.addEventListener("input",t=>{h=parseInt(t.target.value,10),r.querySelector("#val-clean-choke").textContent=h+"px"});const v=(t,l)=>{var d;(d=r.querySelector(t))==null||d.addEventListener("input",u=>{const g=n.getSelectedLayer();p(g)&&(g[l]=parseInt(u.target.value,10),n.render())})};return v("#slider-img-hue","filterHueRotate"),v("#slider-img-sat","filterSaturate"),v("#slider-img-bright","filterBrightness"),v("#slider-img-contrast","filterContrast"),r.querySelector("#input-upload-image").addEventListener("change",t=>{const l=t.target.files[0];if(!l)return;const d=new FileReader;d.onload=u=>{const g=new Image;g.onload=()=>n.addImageLayer(g,l.name.replace(/\.[^/.]+$/,"")),g.src=u.target.result},d.readAsDataURL(l),t.target.value=""}),r.querySelector("#btn-add-text-layer").addEventListener("click",()=>{n.addTextLayer("NUEVO TEXTO",{fontFamily:"Bebas Neue",fontSize:50,fillColor:"#ffffff"})}),a==null||a.addEventListener("input",t=>{const l=n.getSelectedLayer();l&&l.type==="text"&&(l.text=t.target.value,n.render())}),r.querySelector("#select-font-family").addEventListener("change",t=>{const l=n.getSelectedLayer();l&&l.type==="text"&&(l.fontFamily=t.target.value,n.render())}),r.querySelectorAll("#text-colors-mount .color-swatch-sm").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll("#text-colors-mount .color-swatch-sm").forEach(d=>d.classList.remove("active")),t.classList.add("active");const l=n.getSelectedLayer();l&&l.type==="text"&&(l.fillColor=t.getAttribute("data-color"),n.render())})}),s.addEventListener("input",t=>{const l=n.getSelectedLayer();l&&(l.scale=parseFloat(t.target.value),o.textContent=`${Math.round(l.scale*100)}%`,n.render())}),r.querySelector("#btn-scale-up").addEventListener("click",()=>{const t=n.getSelectedLayer();t&&(t.scale=Math.min(3,(t.scale||1)+.1),s.value=t.scale,o.textContent=`${Math.round(t.scale*100)}%`,n.render())}),r.querySelector("#btn-scale-down").addEventListener("click",()=>{const t=n.getSelectedLayer();t&&(t.scale=Math.max(.2,(t.scale||1)-.1),s.value=t.scale,o.textContent=`${Math.round(t.scale*100)}%`,n.render())}),c.addEventListener("input",t=>{const l=n.getSelectedLayer();l&&(l.rotation=parseInt(t.target.value,10),n.render())}),r.querySelector("#btn-rot-zero").addEventListener("click",()=>{const t=n.getSelectedLayer();t&&(t.rotation=0,c.value=0,n.render())}),r.querySelector("#btn-layer-forward").addEventListener("click",()=>n.bringForward()),r.querySelector("#btn-layer-backward").addEventListener("click",()=>n.sendBackward()),r.querySelector("#btn-layer-clone").addEventListener("click",()=>n.duplicateSelectedLayer()),r.querySelector("#btn-layer-del").addEventListener("click",()=>n.deleteSelectedLayer()),r.querySelector("#btn-clear-all").addEventListener("click",()=>{n.layers=[],n.selectedLayerIndex=-1,n.render()}),r.querySelectorAll(".btn-bg-option").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll(".btn-bg-option").forEach(l=>l.classList.remove("active")),t.classList.add("active"),n.bgColor=t.getAttribute("data-bg"),n.render()})}),r.querySelector("#btn-submit-to-shirt").addEventListener("click",()=>{try{sessionStorage.setItem("shirt_lab_exported_art",n.getExportDataUrl(2048))}catch{try{sessionStorage.setItem("shirt_lab_exported_art",n.getExportDataUrl(1200))}catch(t){console.error("[Atelier] Quota excedida en sessionStorage:",t)}}window.location.href="/#estudio"}),{engine:n}}document.addEventListener("DOMContentLoaded",()=>{console.log("[GraphicStudio] Inicializando estudio gráfico...");const r=document.getElementById("editor-mount-atelier");r&&W(r)});
