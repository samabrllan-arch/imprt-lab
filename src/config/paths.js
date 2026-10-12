/**
 * Resuelve rutas de activos (modelos 3D, imágenes, draco) de forma agnóstica al entorno.
 * Funciona transparentemente en:
 * - GitHub Pages (ej. https://<usuario>.github.io/imprt-lab/) -> /imprt-lab/assets/...
 * - Render / Vercel / Dominios raíz (ej. https://tienda.com/) -> /assets/...
 * - Servidor local de desarrollo (http://localhost:3000/) -> /assets/...
 */
export function getAssetPath(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  // Limpiar prefijo '/', './' o '/imprt-lab/' previo para que getAssetPath sea 100% idempotente
  const cleanPath = path
    .replace(/^(\.\/|\/)+/, '')
    .replace(/^imprt-lab\/+/i, '');

  if (typeof window !== 'undefined') {
    const isGhPages = window.location.pathname.startsWith('/imprt-lab') ||
                      window.location.hostname.endsWith('github.io');
    if (isGhPages) {
      return `/imprt-lab/${cleanPath}`;
    }
  }

  return `/${cleanPath}`;
}
