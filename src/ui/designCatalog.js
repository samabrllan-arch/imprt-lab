/**
 * Catálogo unificado de diseños (NODE-014): drops oficiales vinculados a Google Drive + base de datos TiDB Cloud.
 */
import { LOOKBOOK_ITEMS } from '../config/lookbook.js';
import { communityItems } from './lookbookCard.js';
import { apiClient } from '../services/apiClient.js';

let dbGalleryItems = [];

/**
 * Consulta la base de datos remota en TiDB Cloud para obtener los diseños públicos en vivo.
 */
export async function syncGalleryFromDb() {
  try {
    const res = await apiClient.getGallery({ limit: 50, sort: 'recent' });
    if (res && Array.isArray(res.designs) && res.designs.length > 0) {
      dbGalleryItems = res.designs.map((d) => ({
        id: `db-${d.id}`,
        title: d.title,
        category: 'Streetwear',
        shirtColor: d.shirtColor || '#111215',
        badge: 'DROP DESTACADO',
        tagColor: '#00f0ff',
        imageSrc: d.previewImageUrl,
        author: d.authorName ? `@${d.authorName}` : '@imprnt_lab',
        visibility: 'Público',
        likesCount: d.likesCount,
        description: d.title
      }));
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

export const latestDesigns = (n) => {
  const all = allDesigns();
  return typeof n === 'number' ? all.slice(0, n) : all;
};

export const findDesign = (id) => allDesigns().find((item) => String(item.id) === String(id));
