/**
 * Acciones compartidas de las tarjetas del Lookbook y de la Galería completa (NODE-014 / NODE-027):
 * estampar un diseño en el Estudio 3D, reportarlo y mostrar un reportado. Un único listener delegado por contenedor.
 */
import { DECAL_PRESETS, svgToDataUrl } from '../config/presets.js';
import { FABRIC_COLORS } from '../config/colors.js';
import { setDecal, setColor } from '../state/actions.js';
import { loadImage } from '../services/vaultImage.js';
import { revealReported } from '../services/reportService.js';
import { openReportModal } from './reportModal.js';

/** Carga el diseño en el frente de la prenda (y su color de tela si existe en la paleta). */
export function applyDesignToStudio(item) {
  if (item.shirtColor) {
    const matched = FABRIC_COLORS.find((c) => c.hex.toLowerCase() === item.shirtColor.toLowerCase());
    if (matched) setColor(matched);
  }
  if (item.imageSrc) {
    loadImage(item.imageSrc).then((img) => setDecal('front', { name: item.title, src: item.imageSrc, imageElement: img })).catch(() => {});
  } else if (item.decalPresetId) {
    const preset = DECAL_PRESETS.find((p) => p.id === item.decalPresetId);
    if (preset) {
      const dataUrl = svgToDataUrl(preset.svg);
      const img = new Image();
      img.onload = () => setDecal('front', { name: preset.name, src: dataUrl, imageElement: img });
      img.src = dataUrl;
    }
  }
  window.location.hash = '#estudio';
}

/**
 * @param {HTMLElement} root  contenedor de tarjetas (se enlaza una sola vez)
 * @param {(id:string) => object|undefined} findItem  resuelve un diseño por su id
 */
export function bindCardActions(root, findItem) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-load-preset, .btn-report-design, .btn-reveal-reported');
    if (!btn || btn.disabled || !root.contains(btn)) return;
    e.preventDefault();
    const item = findItem(btn.getAttribute('data-drop-id'));
    if (!item) return;
    if (btn.classList.contains('btn-load-preset')) applyDesignToStudio(item);
    else if (btn.classList.contains('btn-report-design')) openReportModal(item);
    else revealReported(item.id);
  });
}
