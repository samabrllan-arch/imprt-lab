/**
 * Acciones de la Bóveda sobre el archivo máster (NODE-026): cargar, guardar y descargar el PNG de 300 DPI.
 * El máster vive en IndexedDB (`vaultMasterStore`); la copia reducida (`item.image`, ≤ 1024 px) es el respaldo.
 */
import { getMaster, putMaster } from '../services/vaultMasterStore.js';
import { loadImage } from '../services/vaultImage.js';
import { downloadImage } from '../services/exporter.js';

const slug = (name) => String(name || 'diseno').replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'diseno';

/** Guarda el máster (`out.master` de `imageToVault`) y devuelve los metadatos para el ítem. */
export async function storeMaster(id, master) {
  if (!master?.blob) return { hasMaster: false };
  const ok = await putMaster(id, master.blob, { width: master.width, height: master.height });
  return ok
    ? { hasMaster: true, masterW: master.width, masterH: master.height, masterBytes: master.blob.size, masterType: master.blob.type }
    : { hasMaster: false };
}

/** Imagen de máxima calidad disponible: el máster si existe y, si no, la copia reducida. */
export async function loadItemImage(item) {
  if (item.hasMaster) {
    const blob = await getMaster(item.id);
    if (blob) {
      const url = URL.createObjectURL(blob);
      try { return await loadImage(url); } finally { setTimeout(() => URL.revokeObjectURL(url), 30000); }
    }
  }
  return loadImage(item.image);
}

/**
 * "Descargar HD": el PNG máster a 300 DPI con alfa. Si el navegador ya no lo tiene, descarga la copia reducida
 * y lo avisa (`kind: 'preview'`), para que nadie crea que tiene el archivo de imprenta.
 * @returns {Promise<{kind:'master'|'preview', bytes?:number}>}
 */
export async function downloadItemHd(item) {
  const blob = item.hasMaster ? await getMaster(item.id) : null;
  if (blob) {
    const url = URL.createObjectURL(blob);
    const ext = blob.type === 'image/jpeg' ? 'jpg' : 'png';
    downloadImage(url, `${slug(item.name)}_300DPI.${ext}`);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    return { kind: 'master', bytes: blob.size };
  }
  const ext = (item.image.match(/^data:image\/(\w+)/) || [])[1] || 'png';
  downloadImage(item.image, `${slug(item.name)}.${ext}`);
  return { kind: 'preview' };
}
