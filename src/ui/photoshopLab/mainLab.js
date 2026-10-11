/**
 * ORQUESTADOR PRINCIPAL DEL ESTUDIO GRÁFICO (<50 Líneas)
 */
import { mountAtelierStudio } from './atelierUI.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[GraphicStudio] Inicializando estudio gráfico...');

  const mountAtelier = document.getElementById('editor-mount-atelier');
  if (mountAtelier) {
    mountAtelierStudio(mountAtelier);
  }
});
