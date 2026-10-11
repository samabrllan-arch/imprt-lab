/**
 * PLANTILLAS HTML PARA LA VISTA DE AUTENTICACIÓN FULLSCREEN (<180 Líneas)
 * Diseño sobrio, elegante, sin elementos toscos ni botones redundantes
 */

const GOOGLE_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;

const ARROW_RIGHT_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

export function renderAuthFullscreenHtml() {
  return `
    <!-- Controles Superiores Flotantes (Sin Barra Horizontal) -->
    <button type="button" class="btn-floating-back" id="btn-auth-back-store" title="Volver a la tienda">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      <span>Volver a la Tienda</span>
    </button>
    <div class="floating-theme-wrap">
      <button type="button" class="btn-floating-theme btn-theme-toggle" id="btn-auth-theme-toggle" title="Cambiar tema"></button>
    </div>

    <main class="auth-main-container">
      <div class="sliding-box" id="sliding-auth-card">
        <!-- Columna Formulario 1: Iniciar Sesión (Izquierda) -->
        <div class="form-container sign-in-container">
          <canvas class="auth-particles-bg" id="auth-particles-signin"></canvas>
          <div class="form-content-wrap" id="signin-form-box">
            <h1 class="auth-form-title">Bienvenido de Nuevo</h1>
            <p class="auth-form-subtitle">Ingresa para continuar personalizando y gestionando tus pedidos.</p>

            <button type="button" class="btn-google-row" id="btn-login-google">
              ${GOOGLE_ICON_SVG}
              <span>Continuar con Google</span>
            </button>

            <div class="divider-line"><span>o con tu correo</span></div>
            <div id="login-alert-box" class="auth-alert"></div>

            <form id="form-auth-login">
              <div class="field-group">
                <label class="field-label"><span>Correo electrónico</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" id="login-email" class="input-styled with-icon" placeholder="tu@correo.com" required autocomplete="email" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Contraseña</span>
                  <a href="#" id="link-forgot-pass" class="link-subtle">¿Olvidaste tu contraseña?</a>
                </label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" id="login-password" class="input-styled with-icon with-toggle" placeholder="••••••••" required autocomplete="current-password" />
                  <button type="button" class="btn-toggle-pass" data-target="login-password" title="Ver contraseña">👁️</button>
                </div>
              </div>
              <button type="submit" class="btn-primary-gradient" id="btn-submit-login">
                <span>Entrar a Diseñar</span>
                ${ARROW_RIGHT_SVG}
              </button>
            </form>
            <p class="mobile-auth-switch">¿No tienes cuenta? <a href="#" id="link-mob-signup">Crear cuenta</a></p>
          </div>

          <!-- Desafío 2FA Telegram -->
          <div id="auth-2fa-wrapper" class="auth-2fa-container form-content-wrap">
            <div class="otp-badge-icon">🛡️</div>
            <h2 class="auth-form-title">Verificación 2FA</h2>
            <p class="auth-form-subtitle">Ingresa los 6 dígitos enviados a tu Telegram <strong>@Notificaciones_inc_bot</strong>.</p>
            <input type="text" id="auth-otp-input" class="input-styled auth-otp-input" maxlength="6" placeholder="000000" autocomplete="one-time-code" />
            <button type="button" class="btn-primary-gradient" id="btn-verify-otp">Verificar Código →</button>
            <button type="button" id="btn-cancel-otp" class="btn-link-subtle">← Volver al inicio de sesión</button>
          </div>
        </div>

        <!-- Columna Formulario 2: Crear Cuenta (Derecha) -->
        <div class="form-container sign-up-container">
          <canvas class="auth-particles-bg" id="auth-particles-signup"></canvas>
          <div class="form-content-wrap">
            <h1 class="auth-form-title">Crear mi Cuenta</h1>
            <p class="auth-form-subtitle">Personaliza en 3D desde 1 unidad con algodón 240g.</p>

            <button type="button" class="btn-google-row" id="btn-register-google">
              ${GOOGLE_ICON_SVG}
              <span>Registrarme con Google</span>
            </button>

            <div class="divider-line"><span>o con tu correo</span></div>
            <div id="reg-alert-box" class="auth-alert"></div>

            <form id="form-auth-register">
              <div class="field-group">
                <label class="field-label"><span>Nombre completo</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" id="reg-name" class="input-styled with-icon" placeholder="Ej. Camila Silva" required autocomplete="name" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label"><span>Correo electrónico</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" id="reg-email" class="input-styled with-icon" placeholder="tu@correo.com" required autocomplete="email" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label"><span>Contraseña</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" id="reg-password" class="input-styled with-icon with-toggle" placeholder="Mínimo 6 caracteres" required minlength="6" autocomplete="new-password" />
                  <button type="button" class="btn-toggle-pass" data-target="reg-password" title="Ver contraseña">👁️</button>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label"><span>Telegram Chat ID (Opcional)</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  <input type="text" id="reg-telegram" class="input-styled with-icon" placeholder="Ej. 123456789 (/start en @Notificaciones_inc_bot)" />
                </div>
                <span class="field-helper">💡 Activa 2FA gratis y avisos de despacho directos.</span>
              </div>
              <button type="submit" class="btn-primary-gradient" id="btn-submit-reg">
                <span>Crear Cuenta y Comenzar</span>
                ${ARROW_RIGHT_SVG}
              </button>
            </form>
            <p class="mobile-auth-switch">¿Ya tienes cuenta? <a href="#" id="link-mob-signin">Iniciar sesión</a></p>
          </div>
        </div>

        <!-- Columna Gráfica: Overlay Deslizante con Imagen de Fondo y Parallax -->
        <div class="overlay-container">
          <div class="overlay">
            <!-- Panel Izquierdo (Modo Registro activo -> muestra "¿Ya tienes cuenta?") -->
            <div class="overlay-panel overlay-left">
              <div class="overlay-content-wrap">
                <span class="overlay-badge">✦ MIEMBRO ATELIER</span>
                <h2 class="overlay-title">¿Ya tienes cuenta?</h2>
                <p class="overlay-desc">Inicia sesión para retomar tus proyectos 3D, consultar tus pedidos y acceder a precios VIP de taller.</p>
                <div class="overlay-feature-tags">
                  <span class="overlay-tag">🎨 Diseños Guardados</span>
                  <span class="overlay-tag">🛡️ 2FA Telegram</span>
                  <span class="overlay-tag">⚡ Pedidos 1-Clic</span>
                </div>
                <button type="button" class="btn-ghost-pill" id="btn-slide-to-signin">Iniciar Sesión</button>
              </div>
            </div>

            <!-- Panel Derecho (Modo Login activo -> muestra "¡Hola, Diseñador!") -->
            <div class="overlay-panel overlay-right">
              <div class="overlay-content-wrap">
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
      </div>
    </main>
  `;
}
