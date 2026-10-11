/** Markup de "Mi Bóveda de Diseños" (NODE-026). Todo dato de usuario pasa por `escapeHtml`. */
import { escapeHtml } from './htmlEscape.js';
import { ICONS } from './uiIcons.js';
import { formatAlias } from '../services/userAlias.js';

const fmtDate = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

function btn(action, id, icon, label, cls = '') {
  return `<button type="button" class="vt-btn ${cls}" data-action="${action}" data-id="${id}">${ICONS[icon](15)}<span>${label}</span></button>`;
}

function renderActions(item, confirming) {
  const id = escapeHtml(item.id);
  const free = item.type === 'free';
  if (confirming) {
    return `<div class="vt-confirm" role="alert"><span>¿Eliminar y liberar el cupo?</span>
      ${btn('delete-yes', id, 'check', 'Sí, eliminar', 'vt-btn-danger')}${btn('delete-no', id, 'cross', 'No')}</div>`;
  }
  return `
    ${free ? btn('stamp', id, 'shirt', 'Estampar en 3D', 'vt-btn-primary') : ''}
    ${free ? btn('edit', id, 'palette', 'Editar Arte') : ''}
    ${btn('download', id, 'download', 'Descargar HD')}
    ${free ? btn('delete', id, 'trash', 'Eliminar', 'vt-btn-ghost-danger') : ''}`;
}

const fmtMb = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/** "HD 3543×3543 px · 300 DPI · 2.4 MB": lo que realmente descarga "Descargar HD". */
function specLine(item) {
  return item.hasMaster
    ? `<span class="vt-spec" title="Archivo máster que descarga «Descargar HD»">HD ${item.masterW}×${item.masterH} px · 300 DPI · ${fmtMb(item.masterBytes || 0)}</span>`
    : '';
}

function renderCard(item, freeIndex, max, confirming, ownAlias) {
  const id = escapeHtml(item.id);
  const free = item.type === 'free';
  const badge = free ? `Gratis (${freeIndex}/${max})` : 'Impreso';
  return `
    <article class="vt-card${free ? '' : ' is-purchased'}" data-id="${id}">
      <div class="vt-thumb">
        <img src="${escapeHtml(item.thumb || item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" />
        <span class="vt-badge ${free ? 'is-free' : 'is-printed'}">${free ? '' : ICONS.shirt(12)}${badge}</span>
      </div>
      <div class="vt-meta">
        <h4 class="vt-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h4>
        <span class="vt-date">${escapeHtml(fmtDate(item.createdAt))} · <b class="vt-author">${escapeHtml(formatAlias(item.authorAlias || ownAlias))}</b></span>
        ${specLine(item)}
      </div>
      <button type="button" class="vt-privacy${item.isPublic ? ' is-public' : ''}" role="switch" aria-checked="${!!item.isPublic}"
        data-action="privacy" data-id="${id}" title="${item.isPublic ? 'Visible en la galería comunitaria' : 'Solo tú puedes verlo'}">
        ${ICONS[item.isPublic ? 'globe' : 'lock'](15)}<span>${item.isPublic ? 'Público' : 'Privado'}</span><i class="vt-switch" aria-hidden="true"></i>
      </button>
      <div class="vt-actions">${renderActions(item, confirming)}</div>
    </article>`;
}

export function renderVaultHtml({ items, usage, confirmId, busy, alias = '' }) {
  const full = usage.left <= 0;
  const freeOrdered = items.filter((i) => i.type === 'free').reverse(); // más antiguo = 1/5
  const pips = Array.from({ length: usage.max }, (_, i) => `<i class="${i < usage.free ? 'is-used' : ''}"></i>`).join('');
  const cards = items.map((i) => renderCard(i, freeOrdered.indexOf(i) + 1, usage.max, confirmId === i.id, alias)).join('');
  return `
    <div class="modal-card vault-modal-card" role="dialog" aria-modal="true" aria-labelledby="vt-title">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">ATELIER SAFE VAULT</span>
          <h3 class="modal-title" id="vt-title">Mi Bóveda de Diseños</h3>
        </div>
        <button type="button" class="btn-close-modal" data-action="close" aria-label="Cerrar">${ICONS.cross(16)}</button>
      </div>
      <div class="vt-quota">
        <div class="vt-quota-text">
          <strong>Cupo de la Bóveda: ${usage.free} / ${usage.max} gratuitos utilizados</strong>
          <span>(+ ${usage.purchased} ${usage.purchased === 1 ? 'prenda impresa' : 'prendas impresas'}, sin límite)</span>
        </div>
        <div class="vt-pips" aria-hidden="true">${pips}</div>
        <label class="vt-upload${full || busy ? ' is-disabled' : ''}" for="vt-file">${ICONS.upload(16)}<span>${busy ? 'Procesando…' : 'Subir diseño'}</span></label>
        <input type="file" id="vt-file" class="vt-file" accept="image/png,image/jpeg,image/webp,image/svg+xml" ${full || busy ? 'disabled' : ''} />
      </div>
      <p class="vt-note" id="vt-note" role="status">${full ? 'Bóveda llena: elimina un diseño gratuito para liberar un cupo.' : 'Guarda logos e ilustraciones sin imprimir ni pagar. Privados por defecto.'}</p>
      <div class="modal-body vt-body">
        ${items.length ? `<div class="vt-grid">${cards}</div>` : `
          <div class="vt-empty">${ICONS.vault(44)}<h4>Tu bóveda está vacía</h4>
            <p>Sube un logo o ilustración, o confirma un pedido: tus prendas impresas se archivan aquí solas.</p></div>`}
      </div>
    </div>`;
}
