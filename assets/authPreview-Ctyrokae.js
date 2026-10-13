import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */class i{constructor(){this.currentConcept="sliding",this.stageMount=document.getElementById("lab-stage-mount"),this.infoTitle=document.getElementById("lab-info-title"),this.infoDesc=document.getElementById("lab-info-desc"),this.tabButtons=document.querySelectorAll(".lab-tab-btn"),this.init()}init(){this.bindTopTabs(),this.renderConcept("sliding")}bindTopTabs(){this.tabButtons.forEach(t=>{t.addEventListener("click",()=>{this.tabButtons.forEach(s=>s.classList.remove("active")),t.classList.add("active");const a=t.getAttribute("data-concept");this.renderConcept(a)})});const e=document.getElementById("btn-adopt-current");e&&e.addEventListener("click",()=>{alert("¡Excelente elección! Adoptaremos esta versión refinada del Doble Panel Deslizante en la tienda principal.")})}renderConcept(e){this.currentConcept=e,this.stageMount.innerHTML="",e==="sliding"?(this.renderSlidingOverlay(),this.updateInfo("Concepto 1: Doble Panel Deslizante (Edición Atelier Ultra HD)","Física de deslizamiento a 60 FPS con aceleración suave (cubic-bezier(0.65, 0.05, 0.36, 1)), micro-parallax interno, tipografía pulida y credenciales oficiales.")):e==="flip3d"?(this.render3dFlip(),this.updateInfo("Concepto 2: Quantum Parallax 3D (Giro Espacial)","Efecto de rotación 3D tridimensional en el eje Y con perspectiva de 1400px.")):e==="runway"?(this.renderLuxuryRunway(),this.updateInfo("Concepto 3: Minimalist Luxury Runway (Atelier Alta Costura)","Diseño editorial de revista de moda con fotografía a gran escala y cristal esmerilado.")):e==="cyberhud"&&(this.renderCyberHud(),this.updateInfo("Concepto 4: Cyberpunk HUD Terminal (Escáner & Láser Neón)","Estética futurista con líneas de escaneo continuo y telemetría técnica en vivo."))}renderSlidingOverlay(){this.stageMount.innerHTML=`
      <div class="sliding-box" id="sliding-auth-card">
        <!-- Formulario Iniciar Sesión (Izquierda) -->
        <div class="form-container sign-in-container">
          <form onsubmit="event.preventDefault()">
            <h2 class="auth-form-title">Acceso al Atelier</h2>
            <p class="auth-form-subtitle">Ingresa para retomar tus diseños en 3D y pedidos guardados.</p>
            <button type="button" class="btn-google-row">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Continuar con Google</span>
            </button>
            <div class="divider-line"><span>o con tu correo electrónico</span></div>
            <div class="field-group">
              <label class="field-label"><span>Correo electrónico</span></label>
              <input type="email" placeholder="tu@correo.com" class="input-styled" required />
            </div>
            <div class="field-group">
              <label class="field-label"><span>Contraseña</span><a href="#" style="color:#ff5722;text-decoration:none;font-size:0.7rem;">¿Olvidaste tu contraseña?</a></label>
              <input type="password" placeholder="••••••••" class="input-styled" required />
            </div>
            <button type="submit" class="btn-primary-gradient">Ingresar a mi Taller →</button>
          </form>
        </div>

        <!-- Formulario Crear Cuenta (Derecha) -->
        <div class="form-container sign-up-container">
          <form onsubmit="event.preventDefault()">
            <h2 class="auth-form-title">Crear Cuenta</h2>
            <p class="auth-form-subtitle">Comienza a personalizar en 3D en menos de 1 minuto.</p>
            <button type="button" class="btn-google-row">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Registrarme con Google</span>
            </button>
            <div class="divider-line"><span>o crea tu perfil con correo</span></div>
            <div class="field-group">
              <label class="field-label"><span>Nombre completo</span></label>
              <input type="text" placeholder="Ej. Camila Silva" class="input-styled" required />
            </div>
            <div class="field-group">
              <label class="field-label"><span>Correo electrónico</span></label>
              <input type="email" placeholder="tu@correo.com" class="input-styled" required />
            </div>
            <div class="field-group">
              <label class="field-label"><span>Contraseña</span></label>
              <input type="password" placeholder="Mínimo 6 caracteres" class="input-styled" required />
            </div>
            <div class="field-group">
              <label class="field-label"><span>Chat ID Telegram (Opcional)</span></label>
              <input type="text" placeholder="Ej. 123456789 (/start en @Notificaciones_inc_bot)" class="input-styled" />
              <span class="field-helper">💡 Activa 2FA gratis y avisos de despacho directos.</span>
            </div>
            <button type="submit" class="btn-primary-gradient">Crear Cuenta y Diseñar →</button>
          </form>
        </div>

        <!-- Overlay Deslizante que Cruza de un Lado a Otro -->
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel overlay-left">
              <span class="overlay-badge">✦ ATELIER PRIVÉ</span>
              <h2 class="overlay-title">¿Ya eres parte?</h2>
              <p class="overlay-desc">Inicia sesión para continuar editando tus proyectos en 3D, consultar tus pedidos y acceder a precios VIP de taller.</p>
              <div class="overlay-feature-tags">
                <span class="overlay-tag">🎨 Diseños Guardados</span>
                <span class="overlay-tag">🛡️ 2FA Telegram</span>
                <span class="overlay-tag">⚡ Pedidos 1-Clic</span>
              </div>
              <button type="button" class="btn-ghost-pill" id="btn-slide-to-signin">Iniciar Sesión</button>
            </div>
            <div class="overlay-panel overlay-right">
              <span class="overlay-badge">✦ COMUNIDAD EXCLUSIVA</span>
              <h2 class="overlay-title">¡Hola, Diseñador!</h2>
              <p class="overlay-desc">Crea tu cuenta gratis para personalizar camisetas Heavyweight de 240g con estampados DTF Ultra HD desde 1 unidad.</p>
              <div class="overlay-feature-tags">
                <span class="overlay-tag">🧵 Algodón 240 GSM</span>
                <span class="overlay-tag">✨ DTF Ultra HD</span>
                <span class="overlay-tag">📦 Despacho Express</span>
              </div>
              <button type="button" class="btn-ghost-pill" id="btn-slide-to-signup">Crear Cuenta</button>
            </div>
          </div>
        </div>
      </div>
    `;const e=document.getElementById("sliding-auth-card"),t=document.getElementById("btn-slide-to-signup"),a=document.getElementById("btn-slide-to-signin");t.addEventListener("click",()=>{e.classList.add("right-panel-active")}),a.addEventListener("click",()=>{e.classList.remove("right-panel-active")})}render3dFlip(){this.stageMount.innerHTML=`
      <div class="stage-3d-perspective" id="flip-perspective-card">
        <div class="card-3d-flipper">
          <div class="card-3d-face front">
            <div class="face-banner">
              <div><span class="lab-badge">ATELIER 3D</span></div>
              <div><h2 class="overlay-title">Acceso Studio</h2><p class="overlay-desc">Gira la tarjeta para registrarte</p></div>
            </div>
            <div class="face-form">
              <h2 class="auth-form-title">Entrar</h2>
              <input type="email" placeholder="Correo" class="input-styled" />
              <input type="password" placeholder="Contraseña" class="input-styled" />
              <button class="btn-primary-gradient">Ingresar</button>
              <button type="button" id="btn-do-flip" style="background:transparent;border:none;color:#00f0ff;margin-top:15px;cursor:pointer;font-weight:700;">🔄 ¿No tienes cuenta? Girar tarjeta</button>
            </div>
          </div>
          <div class="card-3d-face back">
            <div class="face-banner">
              <div><span class="lab-badge">NUEVO MIEMBRO</span></div>
              <div><h2 class="overlay-title">Registro VIP</h2><p class="overlay-desc">Camisetas 240g DTF Ultra HD</p></div>
            </div>
            <div class="face-form">
              <h2 class="auth-form-title">Crear Cuenta</h2>
              <input type="text" placeholder="Nombre" class="input-styled" />
              <input type="email" placeholder="Correo" class="input-styled" />
              <input type="password" placeholder="Contraseña" class="input-styled" />
              <button class="btn-primary-gradient">Registrarme</button>
              <button type="button" id="btn-do-unflip" style="background:transparent;border:none;color:#ff5722;margin-top:15px;cursor:pointer;font-weight:700;">🔄 ¿Ya tienes cuenta? Volver a girar</button>
            </div>
          </div>
        </div>
      </div>
    `;const e=document.getElementById("flip-perspective-card");document.getElementById("btn-do-flip").addEventListener("click",()=>e.classList.add("flipped")),document.getElementById("btn-do-unflip").addEventListener("click",()=>e.classList.remove("flipped"))}renderLuxuryRunway(){this.stageMount.innerHTML=`
      <div class="stage-luxury-runway">
        <div class="luxury-media-col">
          <div class="luxury-media-overlay"></div>
          <div class="luxury-media-content">
            <h2 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; margin: 0;">SHIRT STUDIO</h2>
            <p style="color: #cbd5e1; font-size: 0.88rem; margin: 6px 0 0 0;">Colección Heavyweight • Acabado Alta Costura</p>
          </div>
        </div>
        <div style="padding: 2.8rem; display: flex; flex-direction: column; justify-content: center;">
          <div class="luxury-pill-tabs">
            <div class="luxury-tab-item active" id="lux-tab-login">Acceso</div>
            <div class="luxury-tab-item" id="lux-tab-reg">Registro</div>
          </div>
          <input type="email" placeholder="Tu correo electrónico" class="input-styled" />
          <input type="password" placeholder="Contraseña de atelier" class="input-styled" />
          <button class="btn-primary-gradient" style="background: #ffffff; color: #0f172a; border-radius: 999px;">Continuar →</button>
        </div>
      </div>
    `;const e=document.getElementById("lux-tab-login"),t=document.getElementById("lux-tab-reg");e.addEventListener("click",()=>{e.classList.add("active"),t.classList.remove("active")}),t.addEventListener("click",()=>{t.classList.add("active"),e.classList.remove("active")})}renderCyberHud(){this.stageMount.innerHTML=`
      <div class="stage-cyber-hud">
        <div class="hud-telemetry-col">
          <div>
            <div class="hud-tag">/// SYS.ATELIER.ONLINE</div>
            <h2 style="font-size: 1.8rem; color: #fff; margin: 10px 0;">CYBER HUD 3D</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div class="hud-tag">SECURE LINK: 2FA TELEGRAM</div>
            <div class="hud-tag">FABRIC: 240G DTF READY</div>
            <div class="hud-tag">FPS: 60 RENDER ENGINE</div>
          </div>
        </div>
        <div class="hud-form-col">
          <input type="email" placeholder="ID / Correo" class="input-styled" style="border-color: rgba(0,240,255,0.4);" />
          <input type="password" placeholder="Código de acceso" class="input-styled" style="border-color: rgba(0,240,255,0.4);" />
          <button class="btn-primary-gradient" style="background: linear-gradient(90deg, #00f0ff, #0088ff); color: #050b14;">Autenticar Terminal →</button>
        </div>
      </div>
    `}updateInfo(e,t){this.infoTitle&&(this.infoTitle.textContent=e),this.infoDesc&&(this.infoDesc.textContent=t)}}document.addEventListener("DOMContentLoaded",()=>{new i});
