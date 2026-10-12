/**
 * Tarjeta del Lookbook (NODE-014) y adaptador de los diseños públicos de la Bóveda (NODE-026).
 * Todo texto que puede venir de un usuario (título, alias, imagen) pasa por `escapeHtml`.
 * Cada tarjeta ofrece 🚩 Reportar (NODE-027); un diseño reportado se atenúa y desactiva su CTA.
 */
import { DECAL_PRESETS } from '../config/presets.js';
import { getPublicVaultItems } from '../services/vaultStorage.js';
import { formatAlias } from '../services/userAlias.js';
import { escapeHtml } from './htmlEscape.js';
import '../styles/lookbookReport.css';
import { getReport, isHidden, canReveal } from '../services/reportService.js';

export const COMMUNITY_CATEGORY = 'Comunidad';

/** Diseño público de la Bóveda → forma de un ítem del Lookbook. */
export function communityItems() {
  return getPublicVaultItems().map((v) => ({
    id: `vault-${v.id}`,
    community: true,
    title: v.name,
    category: COMMUNITY_CATEGORY,
    badge: 'COMUNIDAD',
    tagColor: '#06b6d4',
    imageSrc: v.image,
    thumb: v.thumb || v.image,
    authorAlias: v.authorAlias || '',
    createdAt: v.createdAt || '',
    author: v.authorAlias ? formatAlias(v.authorAlias) : '@comunidad',
    visibility: 'Público',
    description: 'Diseño compartido por la comunidad. Pruébalo en tu camiseta con un clic.'
  }));
}

/** "Título • por @alias": el crédito oficial del creador. */
export const creditTitle = (item) => (item.community ? `${item.title} • por ${item.author}` : item.title);

/** Velo de "reportado": oculta la imagen preventivamente; solo los motivos sin tolerancia cero se pueden mostrar. */
function reportedVeil(id) {
  return `
    <div class="card-reported-veil" role="status">
      <span class="veil-title">🚩 Contenido reportado</span>
      <small>Oculto preventivamente mientras se revisa.</small>
      ${canReveal(id) ? `<button type="button" class="btn-reveal-reported" data-drop-id="${escapeHtml(id)}">Mostrar de todos modos</button>` : ''}
    </div>`;
}

function resolveThumbUrl(item) {
  if (item.thumb) return item.thumb;
  const src = item.imageSrc || '';
  if (src.includes('lh3.googleusercontent.com/d/') && !src.includes('=s')) {
    return `${src}=s220-rw`;
  }
  if (src.includes('/assets/drops/')) {
    return src.replace('/assets/drops/', '/assets/drops/thumbs/').replace('.png', '.webp');
  }
  return src;
}

export function renderLookbookCard(item) {
  const preset = DECAL_PRESETS.find((p) => p.id === item.decalPresetId);
  const id = escapeHtml(item.id);
  const title = escapeHtml(creditTitle(item));
  const hidden = isHidden(item.id);
  const reported = !!getReport(item.id);
  const thumbSrc = resolveThumbUrl(item);
  const art = item.imageSrc
    ? `<img src="${escapeHtml(thumbSrc)}" alt="${title}" class="card-artwork-png" width="155" height="155" loading="lazy" decoding="async" />`
    : (preset ? `<div class="card-artwork-svg">${preset.svg}</div>` : '');
  const cta = item.community ? '👕 Estampar en 3D' : '🚀 Probar en Estudio 3D';
  return `
    <div class="lookbook-card${item.community ? ' is-community' : ''}${hidden ? ' is-reported' : ''}" data-drop-id="${id}">
      <div class="card-visual-wrapper">
        <span class="card-badge" style="border-color: ${item.tagColor}; color: ${item.tagColor};">${escapeHtml(item.badge)}</span>
        <span class="card-author-chip">${escapeHtml(item.author || '@comunidad')}</span>
        <div class="card-artwork-frame">
          <div class="card-artwork-ambient" style="background: radial-gradient(circle, ${item.tagColor}40 0%, transparent 70%);"></div>
          <div class="card-artwork-container">${art}</div>
        </div>
        ${hidden ? reportedVeil(item.id) : ''}
      </div>
      <div class="card-content-box">
        <div class="card-meta-line">
          <span class="card-category">${escapeHtml(item.category)}</span>
          <span class="card-visibility-pill">${escapeHtml(item.visibility || 'Público')}</span>
        </div>
        <h3 class="card-title">${title}</h3>
        <p class="card-desc">${escapeHtml(item.description)}</p>
        <button type="button" class="btn-load-preset" data-drop-id="${id}"${hidden ? ' disabled' : ''}>
          <span>${cta}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button type="button" class="btn-report-design" data-drop-id="${id}"${reported ? ' disabled' : ''}
          title="${reported ? 'Ya reportaste este diseño' : 'Avisar de contenido indebido'}">${reported ? '🚩 Reportado' : '🚩 Reportar'}</button>
      </div>
    </div>`;
}
