/**
 * Descarga una imagen DataURL como archivo en el dispositivo
 */
export function downloadImage(dataUrl, filename = 'mi-camiseta-3d.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
