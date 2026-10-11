/**
 * MODAL DE AUTENTICACIÓN MULTICANAL (Cuenta Propia + Google + 2FA Telegram)
 */
import { authService } from '../services/authService.js';
import { Telegram2FAService } from '../services/telegram2fa.js';
import { getFormViewsTemplate, get2faScreenTemplate } from './authTemplates.js';

export class AuthModal {
  constructor() {
    this.currentView = 'login'; // 'login' | 'register' | '2fa'
    this.active2faChallenge = null;
    this.timerInterval = null;
    this.createDom();
    this.bindEvents();
    this.initGoogleAuth();
  }

  createDom() {
    let overlay = document.getElementById('auth-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'auth-modal-overlay';
      overlay.className = 'auth-modal-overlay';
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;
    this.render();
  }

  render() {
    this.overlay.innerHTML = `
      <div class="auth-modal-card">
        <button class="auth-modal-close" id="btn-auth-close" title="Cerrar">&times;</button>
        ${this.currentView === '2fa' ? get2faScreenTemplate() : getFormViewsTemplate(this.currentView === 'login')}
      </div>
    `;
    this.attachViewEvents();
  }

  bindEvents() {
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  attachViewEvents() {
    const btnClose = this.overlay.querySelector('#btn-auth-close');
    if (btnClose) btnClose.addEventListener('click', () => this.close());

    const tabBtns = this.overlay.querySelectorAll('.auth-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentView = btn.getAttribute('data-tab');
        this.render();
      });
    });

    const form = this.overlay.querySelector('#auth-main-form');
    if (form) form.addEventListener('submit', (e) => this.handleFormSubmit(e));

    const btnGoogle = this.overlay.querySelector('#btn-google-login');
    if (btnGoogle) btnGoogle.addEventListener('click', () => this.handleGoogleLogin());

    const form2fa = this.overlay.querySelector('#form-2fa-verify');
    if (form2fa) form2fa.addEventListener('submit', (e) => this.handle2faSubmit(e));

    const btnResend = this.overlay.querySelector('#btn-resend-2fa');
    if (btnResend) btnResend.addEventListener('click', () => this.handleResend2fa());
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const errBox = this.overlay.querySelector('#auth-error-msg');
    if (errBox) errBox.textContent = '';

    const email = this.overlay.querySelector('#auth-email')?.value;
    const password = this.overlay.querySelector('#auth-password')?.value;

    try {
      if (this.currentView === 'login') {
        const res = await authService.login({ email, password });
        if (res.requires2fa) this.start2faChallenge(res);
        else this.close();
      } else {
        const name = this.overlay.querySelector('#auth-name')?.value;
        const telegramId = this.overlay.querySelector('#auth-tg-id')?.value;
        await authService.register({ name, email, password, telegramId });
        this.close();
      }
    } catch (err) {
      if (errBox) errBox.textContent = err.message;
    }
  }

  handleGoogleLogin() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      const mockEmail = prompt('Ingresa tu correo de Google para la prueba:', 'usuario.prueba@gmail.com');
      if (mockEmail) {
        authService.loginWithGoogle({
          name: mockEmail.split('@')[0],
          email: mockEmail,
          picture: null
        }).then(res => {
          if (res.requires2fa) this.start2faChallenge(res);
          else this.close();
        }).catch(err => alert(err.message));
      }
    }
  }

  start2faChallenge(challengeData) {
    this.active2faChallenge = challengeData;
    this.currentView = '2fa';
    this.render();
    this.startCountdown(300);
  }

  handle2faSubmit(e) {
    e.preventDefault();
    const errBox = this.overlay.querySelector('#auth-2fa-error');
    if (errBox) errBox.textContent = '';
    const otp = this.overlay.querySelector('#input-2fa-otp')?.value;

    try {
      authService.complete2faLogin(this.active2faChallenge.userId, otp);
      this.stopCountdown();
      this.close();
    } catch (err) {
      if (errBox) errBox.textContent = err.message;
    }
  }

  async handleResend2fa() {
    const errBox = this.overlay.querySelector('#auth-2fa-error');
    if (errBox) errBox.textContent = 'Reenviando código a Telegram...';
    try {
      await Telegram2FAService.sendVerificationCode({
        telegramId: this.active2faChallenge.telegramId,
        userName: this.active2faChallenge.user.name,
        userId: this.active2faChallenge.userId
      });
      if (errBox) errBox.textContent = '¡Código reenviado con éxito!';
      this.startCountdown(300);
    } catch (err) {
      if (errBox) errBox.textContent = err.message;
    }
  }

  startCountdown(seconds) {
    this.stopCountdown();
    let remaining = seconds;
    const tag = this.overlay.querySelector('#timer-2fa-countdown');
    this.timerInterval = setInterval(() => {
      remaining--;
      if (tag) {
        const min = String(Math.floor(remaining / 60)).padStart(2, '0');
        const sec = String(remaining % 60).padStart(2, '0');
        tag.textContent = `Expira en: ${min}:${sec}`;
      }
      if (remaining <= 0) this.stopCountdown();
    }, 1000);
  }

  stopCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  open(view = 'login') {
    this.currentView = view;
    this.render();
    this.overlay.classList.add('open');
  }

  close() {
    this.stopCountdown();
    this.overlay.classList.remove('open');
  }

  initGoogleAuth() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: (response) => {
          authService.loginWithGoogle(response.credential).then(res => {
            if (res.requires2fa) this.start2faChallenge(res);
            else this.close();
          });
        }
      });
    }
  }
}

export const authModal = new AuthModal();
