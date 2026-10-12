/**
 * Catálogo unificado de diseños (NODE-014): drops oficiales vinculados a Google Drive + base de datos TiDB Cloud.
 */
import { LOOKBOOK_ITEMS } from '../config/lookbook.js';
import { communityItems } from './lookbookCard.js';
import { apiClient } from '../services/apiClient.js';

export const LANDING_LATEST = 4;

let dbGalleryItems = [];

function toDriveThumb(url) {
  if (!url) return '';
  if (url.includes('lh3.googleusercontent.com/d/') && !url.includes('=s')) {
    return `${url}=s220-rw`;
  }
  return url;
}

/**
 * Consulta la base de datos remota en TiDB Cloud para obtener los diseños públicos en vivo.
 */
export async function syncGalleryFromDb() {
  try {
    const res = await apiClient.getGallery({ limit: 50, sort: 'recent' });
    if (res && Array.isArray(res.designs) && res.designs.length > 0) {
      const mapped = res.designs.map((d) => {
        const matchIdx = LOOKBOOK_ITEMS.findIndex(
          (item) => item.imageSrc === d.previewImageUrl || item.title === d.title
        );
        const meta = matchIdx !== -1 ? LOOKBOOK_ITEMS[matchIdx] : null;
        return {
          id: `db-${d.id}`,
          title: d.title,
          category: meta?.category || 'Streetwear',
          shirtColor: d.shirtColor || meta?.shirtColor || '#111215',
          badge: meta?.badge || 'DROP DESTACADO',
          tagColor: meta?.tagColor || '#00f0ff',
          imageSrc: d.previewImageUrl,
          thumb: meta?.thumb || toDriveThumb(d.previewImageUrl),
          author: meta?.author || (d.authorName ? `@${d.authorName}` : '@imprnt_lab'),
          visibility: 'Público',
          likesCount: d.likesCount,
          description: meta?.description || 'Diseño exclusivo listo para estampar en DTF Ultra HD.',
          _orderIdx: matchIdx !== -1 ? matchIdx : -1
        };
      });
      // Nuevos diseños de usuarios primero; los 12 drops oficiales en su orden curado (1..12)
      mapped.sort((a, b) => {
        if (a._orderIdx === -1 && b._orderIdx === -1) return 0;
        if (a._orderIdx === -1) return -1;
        if (b._orderIdx === -1) return 1;
        return a._orderIdx - b._orderIdx;
      });
      dbGalleryItems = mapped;
      window.dispatchEvent(new CustomEvent('vault:changed'));
    }
  } catch (err) {
    console.warn('[Gallery] Usando catálogo oficial de Google Drive:', err.message);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(syncGalleryFromDb, 150);
}

export const allDesigns = () => {
  const drops = dbGalleryItems.length > 0 ? dbGalleryItems : LOOKBOOK_ITEMS;
  return [...communityItems(), ...drops];
};

export const latestDesigns = (n = LANDING_LATEST) => {
  const all = allDesigns();
  return typeof n === 'number' ? all.slice(0, n) : all;
};

export const findDesign = (id) => allDesigns().find((item) => String(item.id) === String(id));
