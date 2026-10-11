import { CLOUD_CONFIG } from '../config/cloud.js';

/**
 * Cliente de comunicación con Google Apps Script Hub (Google Drive & Sheets).
 */
async function postToWebhook(payload, timeoutMs = 20000) {
  const url = CLOUD_CONFIG.googleDriveWebhookUrl?.trim();
  if (!url) return { success: false, reason: 'unconfigured' };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);

    const result = await response.json();
    return { success: result.status === 'success', ...result };
  } catch (err) {
    console.warn('[DriveUploader] Error de conexión con Webhook:', err);
    return { success: false, reason: 'network_error', error: err.message };
  }
}

/**
 * Envía un pedido confirmado al backend de Apps Script (valida tope de 2 pedidos pendientes).
 */
export async function sendOrderToGoogleDrive(orderPayload) {
  const payload = { action: 'create_order', ...orderPayload };
  const res = await postToWebhook(payload);

  if (res.success) {
    return {
      success: true,
      fileUrl: res.fileUrl || null,
      mockupUrl: res.mockupUrl || null,
      sheetUrl: res.sheetUrl || null,
      pendingCount: res.pendingCount,
      message: res.message || 'Pedido guardado en Google Drive'
    };
  }

  if (res.code === 'LIMIT_REACHED') {
    return {
      success: false,
      reason: 'limit_reached',
      code: 'LIMIT_REACHED',
      pendingCount: res.pendingCount,
      message: res.message
    };
  }

  return { success: false, reason: res.reason || 'server_error', details: res };
}

/**
 * Sube un diseño de la Bóveda hacia Google Drive (subcarpeta Boveda_Disenos).
 */
export async function uploadVaultToGoogleDrive(vaultPayload) {
  const payload = { action: 'upload_vault', ...vaultPayload };
  const res = await postToWebhook(payload);
  if (res.success) {
    return {
      success: true,
      fileUrl: res.fileUrl || null,
      fileId: res.fileId || null,
      message: res.message || 'Diseño sincronizado en la Bóveda de Google Drive'
    };
  }
  return { success: false, reason: res.reason || 'server_error', details: res };
}

/**
 * Notifica el pago de una orden y libera el cupo de pedidos pendientes.
 */
export async function reportPaymentToGoogleDrive(paymentPayload) {
  const payload = { action: 'mark_paid', ...paymentPayload };
  const res = await postToWebhook(payload);
  if (res.success) {
    return {
      success: true,
      newStatus: res.newStatus || 'proof_submitted',
      proofUrl: res.proofUrl || null,
      message: res.message || 'Pago registrado en la nube'
    };
  }
  return { success: false, reason: res.reason || 'server_error', details: res };
}

/**
 * Consulta la cantidad de pedidos pendientes en Google Sheets para el usuario.
 */
export async function checkUserPendingOrdersCloud(userKey) {
  const payload = { action: 'check_pending', userEmail: userKey, userId: userKey, userAlias: userKey };
  const res = await postToWebhook(payload, 8000);
  if (res.success) {
    return {
      success: true,
      pendingCount: res.pendingCount ?? 0,
      canOrder: res.canOrder ?? true
    };
  }
  return { success: false, reason: res.reason || 'server_error' };
}
