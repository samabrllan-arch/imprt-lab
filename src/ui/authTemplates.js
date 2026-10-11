/**
 * PLANTILLAS HTML PARA EL MODAL DE AUTENTICACIÓN
 */

export function getFormViewsTemplate(isLogin) {
  return `
    <div class="auth-tabs-header">
      <button class="auth-tab-btn ${isLogin ? 'active' : ''}" data-tab="login">Iniciar Sesión</button>
      <button class="auth-tab-btn ${!isLogin ? 'active' : ''}" data-tab="register">Crear Cuenta</button>
    </div>

    <form id="auth-main-form">
      ${!isLogin ? `
        <div class="auth-form-group">
          <label class="auth-form-label">NOMBRE COMPLETO</label>
          <input type="text" class="auth-form-input" id="auth-name" placeholder="Tu nombre o alias" required />
        </div>
      ` : ''}

      <div class="auth-form-group">
        <label class="auth-form-label">CORREO ELECTRÓNICO</label>
        <input type="email" class="auth-form-input" id="auth-email" placeholder="ejemplo@correo.com" required />
      </div>

      <div class="auth-form-group">
        <label class="auth-form-label">CONTRASEÑA</label>
        <input type="password" class="auth-form-input" id="auth-password" placeholder="••••••••" required />
      </div>

      ${!isLogin ? `
        <div class="auth-form-group">
          <label class="auth-form-label">TELEGRAM CHAT ID (2FA Opcional)</label>
          <input type="text" class="auth-form-input" id="auth-tg-id" placeholder="Ej: 7788892109" />
          <div class="auth-tg-helper">
            <span>Protege tu cuenta con 2FA</span>
            <a href="https://t.me/Notificaciones_inc_bot" target="_blank" rel="noopener">🤖 Obtener ID en Telegram</a>
          </div>
        </div>
      ` : ''}

      <div id="auth-error-msg" style="color: #f87171; font-size: 0.78rem; min-height: 1.2rem; margin-top: 4px;"></div>

      <button type="submit" class="btn-auth-submit" id="btn-auth-submit">
        ${isLogin ? 'Ingresar a mi Cuenta' : 'Registrarme y Entrar'}
      </button>
    </form>

    <div class="auth-divider"><span>O CONTINUAR CON</span></div>

    <button type="button" class="btn-google-auth" id="btn-google-login">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
      Continuar con Google
    </button>
  `;
}

export function get2faScreenTemplate() {
  return `
    <div class="auth-2fa-screen">
      <div class="auth-2fa-icon">🛡️</div>
      <h3 class="auth-2fa-title">Verificación en Dos Pasos (2FA)</h3>
      <p class="auth-2fa-desc">
        Enviamos un código de 6 dígitos a tu bot de <strong>Telegram</strong> (@Notificaciones_inc_bot). Ingresa el código para confirmar tu identidad.
      </p>

      <form id="form-2fa-verify">
        <input type="text" maxlength="6" class="auth-form-input auth-otp-input" id="input-2fa-otp" placeholder="000000" autofocus required />
        <div class="auth-timer-tag" id="timer-2fa-countdown">Expira en: 05:00</div>
        <div id="auth-2fa-error" style="color: #f87171; font-size: 0.8rem; min-height: 1.4rem; margin-top: 8px;"></div>

        <button type="submit" class="btn-auth-submit" style="margin-top: 10px;">Verificar y Acceder</button>
        <button type="button" class="btn-dropdown-action" id="btn-resend-2fa" style="margin-top: 8px; width: 100%; text-align: center; color: #00f0ff;">
          ¿No llegó? Reenviar código
        </button>
      </form>
    </div>
  `;
}
