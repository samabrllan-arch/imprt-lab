/**
 * SERVICIO CENTRAL DE AUTENTICACIÓN
 * Gestión de usuarios, sesiones, Google Sign-In y 2FA reactivo.
 */
import { Telegram2FAService } from './telegram2fa.js';
import { applyProfileUpdate } from './profileUpdate.js';
import { ensureAliases, suggestAlias, takenAliases } from './userAlias.js';
import { renameVaultAuthor } from './vaultStorage.js';
import { decodeJwt } from './jwtDecode.js';

const USERS_STORAGE_KEY = 'shirt_studio_users_v1';
const SESSION_STORAGE_KEY = 'shirt_studio_session_v1';

class AuthService {
  constructor() {
    this.listeners = new Set();
    this.currentUser = this.loadSession();
    this.migrateAliases();
  }

  /** Las cuentas creadas antes de existir el alias reciben uno inicial (`pepito@gmail.com` → `@pepito`). */
  migrateAliases() {
    const { users, changed } = ensureAliases(this.getUsers());
    if (changed) this.saveUsers(users);
    const mine = this.currentUser && users.find((u) => u.id === this.currentUser.id);
    if (mine && this.currentUser.alias !== mine.alias) {
      this.currentUser = this.sanitizeUser(mine);
      try { localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.currentUser)); } catch (_) {}
    }
  }

  // --- Almacén y Sesiones ---
  getUsers() {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (_) {}
  }

  loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  setSession(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    this.notify();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  // --- Registro de Usuario ---
  async register({ name, email, password, telegramId = '' }) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim();
    const cleanPass = String(password || '').trim();
    const cleanTgId = String(telegramId || '').trim();

    if (!cleanEmail || !cleanPass) throw new Error('Email y contraseña requeridos.');
    if (cleanPass.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

    const users = this.getUsers();
    if (users.find(u => u.email === cleanEmail)) {
      throw new Error('Ya existe una cuenta con este correo.');
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: cleanName || cleanEmail.split('@')[0],
      alias: suggestAlias(cleanEmail, takenAliases(users)),
      email: cleanEmail,
      password: cleanPass, // En producción se hashearía en backend
      telegramId: cleanTgId,
      twoFactorEnabled: !!cleanTgId,
      provider: 'local',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    const safeUser = this.sanitizeUser(newUser);
    this.setSession(safeUser);
    return safeUser;
  }

  // --- Login con Cuenta Propia ---
  async login({ email, password }) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const users = this.getUsers();
    const user = users.find(u => u.email === cleanEmail && u.password === cleanPass);

    if (!user) {
      throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
    }

    return this.finishLogin(user);
  }

  /** Si la cuenta tiene 2FA con Telegram genera el reto OTP; si no, abre la sesión. */
  async finishLogin(user) {
    if (user.twoFactorEnabled && user.telegramId) {
      await Telegram2FAService.sendVerificationCode({
        telegramId: user.telegramId,
        userName: user.name,
        userId: user.id
      });
      return {
        requires2fa: true,
        userId: user.id,
        telegramId: user.telegramId,
        user: this.sanitizeUser(user)
      };
    }

    const safeUser = this.sanitizeUser(user);
    this.setSession(safeUser);
    return { requires2fa: false, user: safeUser };
  }

  // --- Completar Login con Reto 2FA ---
  complete2faLogin(userId, otpCode) {
    const result = Telegram2FAService.verifyCode(userId, otpCode);
    if (!result.valid) {
      throw new Error(result.error);
    }

    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado.');

    const safeUser = this.sanitizeUser(user);
    this.setSession(safeUser);
    return safeUser;
  }

  // --- Login con Google (Google Identity OAuth) ---
  async loginWithGoogle(credentialOrProfile) {
    let profile = null;

    if (typeof credentialOrProfile === 'string') {
      profile = decodeJwt(credentialOrProfile);
    } else {
      profile = credentialOrProfile;
    }

    if (!profile || !profile.email) {
      throw new Error('No se pudo obtener el perfil de Google.');
    }

    const users = this.getUsers();
    let user = users.find(u => u.email === profile.email.toLowerCase());

    if (!user) {
      user = {
        id: 'usr_g_' + Date.now(),
        name: profile.name || profile.email.split('@')[0],
        alias: suggestAlias(profile.email, takenAliases(users)),
        email: profile.email.toLowerCase(),
        picture: profile.picture || null,
        provider: 'google',
        telegramId: '',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      this.saveUsers(users);
    }

    return this.finishLogin(user);
  }

  // --- Configuración de 2FA en Perfil ---
  async update2faSettings({ enabled, telegramId }) {
    if (!this.currentUser) throw new Error('Debes iniciar sesión.');

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === this.currentUser.id);
    if (idx === -1) throw new Error('Usuario no encontrado.');

    users[idx].twoFactorEnabled = !!enabled;
    if (telegramId !== undefined) {
      users[idx].telegramId = String(telegramId).trim();
    }

    this.saveUsers(users);
    const safeUser = this.sanitizeUser(users[idx]);
    this.setSession(safeUser);
    return safeUser;
  }

  // --- Perfil de cliente: datos de contacto y despacho (NODE-025) ---
  // El correo no se edita aquí: es la llave de acceso y de propiedad de los pedidos.
  updateUserProfile(fields = {}) {
    if (!this.currentUser) throw new Error('Debes iniciar sesión.');
    const { users, user, aliasChanged } = applyProfileUpdate(this.getUsers(), this.currentUser.id, fields);
    this.saveUsers(users);
    if (aliasChanged) renameVaultAuthor(user.id, user.alias); // sus diseños públicos muestran el alias nuevo
    const safeUser = this.sanitizeUser(user);
    this.setSession(safeUser); // persiste la sesión y notifica a la navbar y al perfil
    return safeUser;
  }

  logout() {
    this.setSession(null);
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => {
      try { fn(this.currentUser); } catch (e) { console.error(e); }
    });
  }
}

export const authService = new AuthService();
