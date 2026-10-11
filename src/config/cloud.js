/**
 * Configuración de Servicios Cloud y Almacenamiento de Pedidos (Google Drive / Sheets).
 * ID Carpeta Google Drive: 1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN
 */
export const CLOUD_CONFIG = {
  // URL Web App oficial de Google Apps Script conectada al Drive del usuario:
  googleDriveWebhookUrl: 'https://script.google.com/macros/s/AKfycbwixHbpoJH0MulyLlL1SPU50V-85Y4wPdlfPag7FDnpH-U33G3FS43HO6BCovvzpBmF/exec',

  // Carpeta destino en Google Drive
  driveFolderId: '1ZJqQF6EbzBWZXBEOk6U66H9EfJ2atTzN',
  driveFolderName: 'IMPRNT [LAB] Cloud Hub',

  // Si está activo, sincroniza automáticamente con Google Drive
  enableAutoDriveUpload: true,

  // Límite máximo de pedidos en estado pendiente de pago
  maxPendingOrders: 2
};
