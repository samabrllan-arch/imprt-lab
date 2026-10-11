import { showToast } from './toast.js';

export function applyTheme(theme, notify = false) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('shirt_studio_theme', theme);
  localStorage.setItem('theme', theme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

  const isDark = theme === 'dark';
  const iconHtml = isDark
    ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>`
    : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;

  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.innerHTML = iconHtml;
    btn.setAttribute('title', isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro');
  });

  if (notify) {
    showToast(theme === 'dark' ? 'Modo Oscuro activado 🌙' : 'Modo Claro activado ☀️', 'info');
  }
}

export function initThemeToggle() {
  const storedTheme = localStorage.getItem('shirt_studio_theme') || localStorage.getItem('theme') || 'dark';
  applyTheme(storedTheme, false);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-theme-toggle');
    if (btn) {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    }
  });
}
