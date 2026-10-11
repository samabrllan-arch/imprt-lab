/**
 * API CLIENT CENTRAL (NODE / MYSQL BACKEND)
 * Maneja llamadas a /api con token JWT y gestión de errores.
 */
const TOKEN_KEY = 'shirt_studio_jwt_token';

export const API_BASE_URL = (
  (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '' : 'https://api-camisas.onrender.com')
).replace(/\/$/, '');

export const apiClient = {
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (_) {}
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const targetUrl = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    const res = await fetch(targetUrl, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || `Error HTTP ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  },

  // --- Módulo Auth ---
  async register({ email, password, displayName }) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName })
    });
    if (data?.token) this.setToken(data.token);
    return data;
  },

  async login({ email, password }) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data?.token) this.setToken(data.token);
    return data;
  },

  async getMe() {
    return this.request('/api/auth/me');
  },

  logout() {
    this.setToken(null);
  },

  // --- Módulo Diseños 3D ---
  async saveDesign(designPayload) {
    return this.request('/api/designs', {
      method: 'POST',
      body: JSON.stringify(designPayload)
    });
  },

  async getMyDesigns({ q = '' } = {}) {
    const queryStr = q ? `?q=${encodeURIComponent(q)}` : '';
    return this.request(`/api/designs${queryStr}`);
  },

  async getDesignById(id) {
    return this.request(`/api/designs/${id}`);
  },

  // Soft delete: solo desvincula el link en base de datos; la imagen en Drive NO se borra
  async deleteDesign(id) {
    return this.request(`/api/designs/${id}`, {
      method: 'DELETE'
    });
  },

  // --- Módulo Galería Comunitaria ---
  async getGallery({ limit = 20, offset = 0, sort = 'recent', q = '', gender = '' } = {}) {
    const params = new URLSearchParams({ limit, offset, sort });
    if (q) params.set('q', q);
    if (gender) params.set('gender', gender);
    return this.request(`/api/gallery?${params.toString()}`);
  },

  async toggleLike(designId) {
    return this.request(`/api/gallery/${designId}/like`, {
      method: 'POST'
    });
  },

  // --- Módulo Google Drive Assets ---
  async registerDriveAsset(assetPayload) {
    return this.request('/api/upload-link', {
      method: 'POST',
      body: JSON.stringify(assetPayload)
    });
  },

  async getMyDriveAssets() {
    return this.request('/api/upload-link/my-assets');
  },

  // --- Módulo Administrador (Auditoría de imágenes) ---
  async getUnlinkedAssets() {
    return this.request('/api/admin/unlinked-assets');
  },

  async getAssetsComparison() {
    return this.request('/api/admin/assets-comparison');
  },

  async purgeAssetRecord(id) {
    return this.request(`/api/admin/purge-asset-record/${id}`, {
      method: 'DELETE'
    });
  }
};
