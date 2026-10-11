/**
 * Perfil de rendimiento del dispositivo (NODE-005 v1.5.0).
 * Móvil = ventana <= 768 px o puntero principal táctil (`pointer: coarse`). Se usa `pointer: coarse` y no
 * `'ontouchstart' in window` para que un monitor 4K con pantalla táctil conserve su resolución completa.
 */
export const MOBILE_DPR_MAX = 1.3;   // en pantallas de 6" se ve igual que 2.0 y ahorra ~58 % de píxeles de fragment shader
export const DESKTOP_DPR_MAX = 2;
export const MOBILE_PARTICLES = 40;
export const DESKTOP_PARTICLES = 160;

export function isMobileGpu() {
  return window.innerWidth <= 768 || !!window.matchMedia?.('(pointer: coarse)').matches;
}

export const maxPixelRatio = () => Math.min(window.devicePixelRatio || 1, isMobileGpu() ? MOBILE_DPR_MAX : DESKTOP_DPR_MAX);
export const particleCount = () => (isMobileGpu() ? MOBILE_PARTICLES : DESKTOP_PARTICLES);
