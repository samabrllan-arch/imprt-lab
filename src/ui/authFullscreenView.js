/**
 * CONTROLADOR DE AUTENTICACIÓN FULLSCREEN (<160 Líneas)
 * Deslizamiento a 60 FPS, verificación 2FA y sincronización reactiva
 */
import { authService } from '../services/authService.js';
import { Telegram2FAService } from '../services/telegram2fa.js';
import { showToast } from './toast.js';
import { renderAuthFullscreenHtml } from './authFullscreenTemplates.js';
import { AuthParticles } from './authParticles.js';

export class AuthFullscreenView {
  constructor(mountElement, router) {
    this.mount = mountElement;
    this.router = router;
    this.currentTab = 'login';
    this.pending2faUser = null;
    this.particlesSignin = null;
    this.particlesSignup = null;
    this.render();
    this.initParticles();
    this.initEvents();
  }

  render() {
    this.mount.innerHTML = renderAuthFullscreenHtml();
  }

  initParticles() {
    const cIn = this.mount.querySelector('#auth-particles-signin');
    const cUp = this.mount.querySelector('#auth-particles-signup');
    if (cIn) this.particlesSignin = new AuthParticles(cIn);
    if (cUp) this.particlesSignup = new AuthParticles(cUp);
    this.particlesSignin?.start();
  }

  initEvents() {
    this.mount.querySelector('#btn-slide-to-signup')?.addEventListener('click', () => this.switchTab('register'));
    this.mount.querySelector('#btn-slide-to-signin')?.addEventListener('click', () => this.switchTab('login'));
    this.mount.querySelector('#link-mob-signup')?.addEventListener('click', (e) => { e.preventDefault(); this.switchTab('register'); });
    this.mount.querySelector('#link-mob-signin')?.addEventListener('click', (e) => { e.preventDefault(); this.switchTab('login'); });
    this.mount.querySelector('#btn-auth-back-store')?.addEventListener('click', () => this.router?.closeAuth());
    this.mount.querySelector('#link-forgot-pass')?.addEventListener('click', (e) => e.preventDefault());

    // Toggle de visibilidad de contraseñas
    this.mount.querySelectorAll('.btn-toggle-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = this.mount.querySelector(`#${btn.dataset.target}`);
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.textContent = isPass ? '🔒' : '👁️';
      });
    });

    // Login con Google simulado
    const triggerGoogle = () => {
      authService.loginWithGoogle({
        name: 'Diseñador Studio',
        email: 'designer.studio@gmail.com',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      });
      showToast('¡Bienvenido! Sesión iniciada con Google');
      this.router?.closeAuth();
    };
    this.mount.querySelector('#btn-login-google')?.addEventListener('click', triggerGoogle);
    this.mount.querySelector('#btn-register-google')?.addEventListener('click', triggerGoogle);

    // Envío de Formulario Login
    this.mount.querySelector('#form-auth-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearAlert('login');
      const email = this.mount.querySelector('#login-email').value.trim();
      const password = this.mount.querySelector('#login-password').value;
      try {
        const res = await authService.login({ email, password });
        if (res.requires2fa) {
          this.start2faChallenge(res);
        } else {
          showToast('¡Sesión iniciada con éxito!');
          this.router?.closeAuth();
        }
      } catch (err) {
        this.showAlert(err.message || 'Credenciales inválidas', 'login');
      }
    });

    // Envío de Formulario Registro
    this.mount.querySelector('#form-auth-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearAlert('reg');
      const name = this.mount.querySelector('#reg-name').value.trim();
      const email = this.mount.querySelector('#reg-email').value.trim();
      const password = this.mount.querySelector('#reg-password').value;
      const telegramId = this.mount.querySelector('#reg-telegram').value.trim();
      try {
        await authService.register({ name, email, password, telegramId });
        showToast('¡Cuenta creada con éxito! Bienvenido al Atelier');
        this.router?.closeAuth();
      } catch (err) {
        this.showAlert(err.message || 'Error al registrar usuario', 'reg');
      }
    });

    // Verificación 2FA OTP
    this.mount.querySelector('#btn-verify-otp')?.addEventListener('click', () => this.handleOtpVerify());
    this.mount.querySelector('#auth-otp-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleOtpVerify();
    });
    this.mount.querySelector('#btn-cancel-otp')?.addEventListener('click', () => this.exit2faChallenge());

    this.updateThemeIcon();
    window.addEventListener('themechange', () => this.updateThemeIcon());
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.mount.querySelector('#sliding-auth-card')?.classList.toggle('right-panel-active', tab === 'register');
    try { sessionStorage.setItem('shirt_auth_tab', tab); } catch (_) {}
    const newHash = tab === 'register' ? '#registro' : '#login';
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
    if (tab === 'register') {
      this.particlesSignup?.start();
    } else {
      this.particlesSignin?.start();
    }
  }

  startParticles() {
    this.particlesSignin?.start();
    this.particlesSignup?.start();
  }

  stopParticles() {
    this.particlesSignin?.stop();
    this.particlesSignup?.stop();
  }

  start2faChallenge(challengeData) {
    this.pending2faChallenge = challengeData;
    this.mount.querySelector('#signin-form-box').style.display = 'none';
    this.mount.querySelector('#auth-2fa-wrapper').classList.add('active');
    setTimeout(() => this.mount.querySelector('#auth-otp-input')?.focus(), 80);
  }

  exit2faChallenge() {
    this.pending2faChallenge = null;
    this.mount.querySelector('#signin-form-box').style.display = 'flex';
    this.mount.querySelector('#auth-2fa-wrapper').classList.remove('active');
  }

  async handleOtpVerify() {
    if (!this.pending2faChallenge) return;
    const code = this.mount.querySelector('#auth-otp-input').value.trim();
    try {
      await authService.complete2faLogin(this.pending2faChallenge.userId, code);
      showToast('¡Verificación 2FA correcta! Bienvenido');
      this.exit2faChallenge();
      this.router?.closeAuth();
    } catch (err) {
      alert(err.message || 'Código incorrecto');
    }
  }

  showAlert(msg, prefix) {
    const box = this.mount.querySelector(`#${prefix}-alert-box`);
    if (box) { box.textContent = msg; box.className = 'auth-alert error'; }
  }

  clearAlert(prefix) {
    const box = this.mount.querySelector(`#${prefix}-alert-box`);
    if (box) { box.textContent = ''; box.className = 'auth-alert'; }
  }

  updateThemeIcon() {
    const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    const btn = this.mount.querySelector('#btn-auth-theme-toggle');
    if (!btn) return;
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">${isDark ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>' : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'}</svg>`;
    btn.setAttribute('title', isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro');
  }
}
