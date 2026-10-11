/**
 * COMPONENTE DE USUARIO EN NAVBAR & DROPDOWN DE PERFIL (NODE-020 / NODE-025)
 * Acciones por `data-action`: open-profile, open-orders, toggle-2fa, open-terms, logout.
 */
import '../styles/userMenu.css';
import { authService } from '../services/authService.js';
import { authModal } from './authModal.js';
import { Telegram2FAService } from '../services/telegram2fa.js';
import { openOrdersModal } from './ordersModal.js';
import { openUserProfileModal } from './userProfileModal.js';
import { openLegalTermsModal, warmLegalTermsModal } from './legalTermsModal.js';
import { openVaultModal } from './vaultModal.js';
import { escapeHtml } from './htmlEscape.js';
import { ICONS } from './uiIcons.js';
import { formatAlias } from '../services/userAlias.js';

function menuItem(action, icon, label, { id = '', extra = '', danger = false } = {}) {
  return `
    <button type="button" class="btn-dropdown-action um-item${danger ? ' btn-dropdown-logout um-danger' : ''}"
      role="menuitem" data-action="${action}"${id ? ` id="${id}"` : ''}>
      <span class="um-item-icon">${ICONS[icon](18)}</span>
      <span class="um-item-label">${label}</span>${extra}
    </button>`;
}

function renderUserMenuHtml(user, isOpen) {
  const name = escapeHtml(user.name || user.email);
  const email = escapeHtml(user.email);
  const alias = escapeHtml(formatAlias(user.alias));
  const initial = escapeHtml((user.name || user.email || 'U').trim().charAt(0).toUpperCase());
  const has2fa = !!user.twoFactorEnabled;
  const incomplete = !user.phone || !user.address;
  const avatar = (cls) => user.picture
    ? `<img src="${escapeHtml(user.picture)}" alt="" class="${cls}" referrerpolicy="no-referrer" />`
    : `<div class="${cls}">${initial}</div>`;

  return `
    <div class="nav-user-chip" id="btn-toggle-user-menu" role="button" tabindex="0"
      aria-haspopup="menu" aria-expanded="${isOpen}" aria-controls="user-profile-dropdown">
      ${avatar('nav-user-avatar')}
      <span class="nav-user-name">${name}</span>${alias ? `<span class="nav-user-alias">${alias}</span>` : ''}
      <span class="nav-user-caret">${ICONS.chevron(14)}</span>
    </div>

    <div class="nav-user-dropdown ${isOpen ? 'open' : ''}" id="user-profile-dropdown" role="menu" aria-label="Menú de cuenta">
      <div class="dropdown-user-header">
        ${avatar('um-avatar')}
        <div class="um-identity">
          <div class="um-name">${name}</div>${alias ? `<div class="um-alias">${alias}</div>` : ''}
          <div class="dropdown-email">${email}</div>
        </div>
      </div>

      <div class="dropdown-2fa-badge">
        <div class="um-2fa-text">
          <span class="um-2fa-title">Seguridad 2FA Telegram</span>
          <span class="um-2fa-sub">${user.telegramId ? 'ID: ' + escapeHtml(user.telegramId) : 'Sin vincular'}</span>
        </div>
        <span class="badge-2fa-status ${has2fa ? 'status-active' : 'status-inactive'}">
          ${has2fa ? ICONS.check(12) + 'ACTIVO' : ICONS.cross(12) + 'INACTIVO'}
        </span>
      </div>

      <div class="um-list">
        ${menuItem('open-profile', 'user', 'Mi Perfil &amp; Datos de Envío', { extra: incomplete ? '<span class="um-pill">Completar</span>' : '' })}
        ${menuItem('open-vault', 'vault', 'Mi Bóveda de Diseños')}
        ${menuItem('open-orders', 'box', 'Mis Pedidos', { id: 'btn-dropdown-orders' })}
        ${menuItem('toggle-2fa', 'shield', has2fa ? 'Desactivar 2FA Telegram' : 'Configurar 2FA Telegram', { id: 'btn-toggle-2fa' })}
        ${menuItem('open-terms', 'scale', 'Términos &amp; Propiedad Intelectual')}
      </div>
      <div class="um-sep" role="separator"></div>
      ${menuItem('logout', 'logout', 'Cerrar Sesión', { id: 'btn-logout', danger: true })}
    </div>`;
}

export class UserProfileMenu {
  constructor(mountElement, router = null) {
    this.mount = mountElement;
    this.router = router;
    this.isOpen = false;
    this.init();
  }

  setRouter(router) {
    this.router = router;
  }

  init() {
    this.render();
    warmLegalTermsModal(); // TyC pre-montado en reposo: el primer clic abre al instante
    authService.subscribe(() => this.render());
    document.addEventListener('click', (e) => {
      if (!this.mount.contains(e.target)) {
        this.closeDropdown();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeDropdown();
    });
  }

  render() {
    const user = authService.getCurrentUser();
    this.mount.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'nav-auth-container';

    if (!user) {
      container.innerHTML = `
        <button class="btn-nav-login" id="btn-open-login" title="Iniciar sesión o registrarte">
          <svg class="nav-login-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/></svg>
          <span class="nav-login-label">Iniciar Sesión</span>
        </button>
      `;
      container.querySelector('#btn-open-login').addEventListener('click', () => {
        if (this.router) {
          this.router.openAuth('login');
        } else {
          window.location.hash = '#login';
        }
      });
    } else {
      container.innerHTML = renderUserMenuHtml(user, this.isOpen);

      const chip = container.querySelector('#btn-toggle-user-menu');
      const toggle = (e) => {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
        this.render();
        if (e.type === 'keydown') this.mount.querySelector('#btn-toggle-user-menu')?.focus();
      };
      chip.addEventListener('click', toggle);
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
      });

      const actions = {
        'open-profile': () => { this.closeDropdown(); openUserProfileModal(); },
        'open-vault': () => { this.closeDropdown(); openVaultModal({ router: this.router }); },
        'open-orders': () => { this.closeDropdown(); openOrdersModal(); },
        'toggle-2fa': () => this.handleToggle2fa(user),
        'open-terms': () => { this.closeDropdown(); openLegalTermsModal(); },
        logout: () => { authService.logout(); this.closeDropdown(); }
      };
      container.querySelector('#user-profile-dropdown').addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (action && actions[action]) actions[action]();
      });
    }

    this.mount.appendChild(container);
  }

  async handleToggle2fa(user) {
    if (user.twoFactorEnabled) {
      if (confirm('¿Deseas desactivar la verificación en dos pasos (2FA)?')) {
        await authService.update2faSettings({ enabled: false });
        alert('2FA Desactivado.');
      }
    } else {
      const tgId = prompt(
        'Ingresa tu Chat ID de Telegram para vincular tu cuenta.\n(Escribe /start en @Notificaciones_inc_bot para obtenerlo):',
        user.telegramId || ''
      );
      if (tgId && tgId.trim().length >= 5) {
        try {
          // Despachar reto de activación
          await Telegram2FAService.sendVerificationCode({
            telegramId: tgId.trim(),
            userName: user.name,
            userId: user.id,
            isActivation: true
          });
          const code = prompt('¡Código enviado a tu Telegram!\nIngresa los 6 dígitos para confirmar la activación:');
          const verify = Telegram2FAService.verifyCode(user.id, code);
          if (verify.valid) {
            await authService.update2faSettings({ enabled: true, telegramId: tgId.trim() });
            alert('¡Excelente! 2FA activado con éxito con tu Telegram.');
          } else {
            alert(verify.error || 'Código incorrecto. No se pudo activar.');
          }
        } catch (e) {
          alert('Error conectando con Telegram: ' + e.message);
        }
      }
    }
    this.closeDropdown();
  }

  closeDropdown() {
    this.isOpen = false;
    const dropdown = this.mount.querySelector('#user-profile-dropdown');
    if (dropdown) dropdown.classList.remove('open');
  }
}

export function initUserProfileMenu(mountElement, router = null) {
  return new UserProfileMenu(mountElement, router);
}
