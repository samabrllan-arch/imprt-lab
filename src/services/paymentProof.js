/**
 * Preparación del comprobante de pago (pantallazo) para guardarlo en localStorage — NODE-024.
 * Se reescala a 1280 px y se recomprime a JPEG para no agotar el cupo de almacenamiento.
 */
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_SIDE = 1280;
const JPEG_QUALITY = 0.78;

export function validateProofFile(file) {
  if (!file) return { ok: false, error: 'No seleccionaste ningún archivo.' };
  if (!file.type.startsWith('image/')) return { ok: false, error: 'El comprobante debe ser una imagen (JPG, PNG o WEBP).' };
  if (file.size > MAX_INPUT_BYTES) return { ok: false, error: 'La imagen supera los 10 MB. Sube un pantallazo más liviano.' };
  return { ok: true };
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('El archivo no es una imagen válida.'));
    img.src = src;
  });
}

/** @returns {Promise<string>} data URL JPEG optimizada */
export async function compressProofImage(file) {
  const check = validateProofFile(file);
  if (!check.ok) throw new Error(check.error);

  const img = await loadImage(await readAsDataUrl(file));
  const ratio = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // los PNG con transparencia no deben quedar negros en JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}
