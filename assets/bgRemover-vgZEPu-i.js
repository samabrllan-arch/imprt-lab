import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */import{a as C}from"./imageProcessing-XXxTQDrn.js";import{k as E,b as M,c as T}from"./colorKey-C1nSbH-k.js";function z(a,v,{tolerance:o=30,feather:s=10,choke:l=0}={}){const{width:c,height:h}=a,u=E(a,v,{tolerance:o,feather:s,seeds:M(c,h)}),y=Math.max(4,Math.min(10,o*.35)),p=E(a,v,{tolerance:y,hueTolerance:o,feather:Math.min(s,6),despill:!1});return l>0&&(u.modified||p.modified)&&T(a.data,c,h,l),{modified:u.modified||p.modified,erasedCount:u.erasedCount+p.erasedCount,sampledColor:v}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("remover-stage-mount");if(!a)return;let v=null,o=null,s=[],l="wand",c=30,h=25,u=!1;y();function y(){a.innerHTML=`
      <div class="remover-dropzone-view">
        <div class="dropzone-box" id="dropzone-box">
          <div class="dropzone-icon">🪄</div>
          <div class="dropzone-title">Sube o arrastra una imagen con fondo</div>
          <div class="dropzone-sub">PNG, JPG, WebP • También puedes pegar con <b>Ctrl + V</b></div>
          <input type="file" id="remover-file-input" accept="image/*" style="display: none;" />
        </div>
      </div>
    `;const i=a.querySelector("#dropzone-box"),e=a.querySelector("#remover-file-input");i.addEventListener("click",()=>e.click()),e.addEventListener("change",t=>{t.target.files[0]&&p(t.target.files[0])}),i.addEventListener("dragover",t=>{t.preventDefault(),i.classList.add("dragover")}),i.addEventListener("dragleave",()=>i.classList.remove("dragover")),i.addEventListener("drop",t=>{t.preventDefault(),i.classList.remove("dragover"),t.dataTransfer.files[0]&&p(t.dataTransfer.files[0])}),window.addEventListener("paste",t=>{const r=Array.from(t.clipboardData.items).find(m=>m.type.startsWith("image/"));r&&p(r.getAsFile())})}function p(i){const e=new FileReader;e.onload=t=>{const r=new Image;r.onload=()=>{k(r)},r.src=t.target.result},e.readAsDataURL(i)}function k(i){a.innerHTML=`
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
    `;const e=a.querySelector("#remover-canvas"),t=e.getContext("2d"),r=1200,m=Math.min(r/i.width,r/i.height,1);e.width=Math.round(i.width*m),e.height=Math.round(i.height*m),t.drawImage(i,0,0,e.width,e.height),v=t.getImageData(0,0,e.width,e.height),o=t.getImageData(0,0,e.width,e.height),s=[];function g(){s.length>5&&s.shift(),s.push(t.getImageData(0,0,e.width,e.height))}a.querySelector("#btn-auto-clean").addEventListener("click",()=>{g();const n=C(o)||{r:255,g:255,b:255};z(o,n,{tolerance:c}),t.putImageData(o,0,0)});const w=a.querySelector("#btn-tool-wand"),L=a.querySelector("#btn-tool-brush"),S=a.querySelector("#wand-opts"),D=a.querySelector("#brush-opts");w.addEventListener("click",()=>{l="wand",w.classList.add("active"),L.classList.remove("active"),S.style.display="flex",D.style.display="none"}),L.addEventListener("click",()=>{l="brush",L.classList.add("active"),w.classList.remove("active"),D.style.display="flex",S.style.display="none"}),a.querySelector("#slider-tol").addEventListener("input",n=>{c=parseInt(n.target.value,10),a.querySelector("#val-tol").textContent=c+"%"}),a.querySelector("#slider-brush").addEventListener("input",n=>{h=parseInt(n.target.value,10),a.querySelector("#val-brush").textContent=h+"px"}),a.querySelector("#btn-undo").addEventListener("click",()=>{s.length>0&&(o=s.pop(),t.putImageData(o,0,0))}),a.querySelector("#btn-reset").addEventListener("click",()=>{g(),t.putImageData(v,0,0),o=t.getImageData(0,0,e.width,e.height)}),e.addEventListener("click",n=>{if(l!=="wand")return;g();const d=e.getBoundingClientRect(),b=Math.floor((n.clientX-d.left)*(e.width/d.width)),f=Math.floor((n.clientY-d.top)*(e.height/d.height)),x=(f*e.width+b)*4,q={r:o.data[x],g:o.data[x+1],b:o.data[x+2]};E(o,q,{tolerance:c,seeds:[b,f]}),t.putImageData(o,0,0)}),e.addEventListener("mousedown",n=>{l==="brush"&&(g(),u=!0,I(n))}),window.addEventListener("mousemove",n=>{u&&I(n)}),window.addEventListener("mouseup",()=>{u=!1});function I(n){const d=e.getBoundingClientRect(),b=(n.clientX-d.left)*(e.width/d.width),f=(n.clientY-d.top)*(e.height/d.height);t.save(),t.globalCompositeOperation="destination-out",t.beginPath(),t.arc(b,f,h,0,Math.PI*2),t.fill(),t.restore(),o=t.getImageData(0,0,e.width,e.height)}a.querySelector("#btn-use-in-effects").addEventListener("click",()=>{const n=e.toDataURL("image/png");sessionStorage.setItem("shirt_lab_imported_image",n),window.location.href="/photoshop-lab.html"}),a.querySelector("#btn-send-to-shirt").addEventListener("click",()=>{const n=e.toDataURL("image/png");sessionStorage.setItem("shirt_lab_exported_art",n),window.location.href="/#estudio"}),a.querySelector("#btn-download-hd").addEventListener("click",()=>{const n=document.createElement("a");n.download="arte-sin-fondo.png",n.href=e.toDataURL("image/png"),n.click()})}});
