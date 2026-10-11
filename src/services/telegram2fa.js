/**
 * SERVICIO 2FA VÍA TELEGRAM API
 * Despacha códigos de verificación de 6 dígitos a través de wsp-x3j7.onrender.com
 */

const RENDER_2FA_URL = 'https://wsp-x3j7.onrender.com/webhook/2fa';
const BOT_SECURITY_TOKEN = 'KEY_SECRETA_JEICO_999';

// Almacén en memoria de retos 2FA activos (expiración: 5 minutos)
const pendingChallenges = new Map();

export class Telegram2FAService {
  /**
   * Genera un código OTP aleatorio de 6 dígitos
   */
  static generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Envía un código 2FA al Telegram ID del usuario
   * @param {Object} params
   * @param {string} params.telegramId - ID numérico de chat en Telegram
   * @param {string} params.userName - Nombre del usuario
   * @param {string} params.userId - Identificador único de usuario
   * @param {boolean} [params.isActivation=false] - Si es un reto para activar 2FA
   */
  static async sendVerificationCode({ telegramId, userName, userId, isActivation = false }) {
    if (!telegramId || String(telegramId).trim().length < 5) {
      throw new Error('Telegram ID inválido o no configurado.');
    }

    const code = this.generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos

    // Guardar reto pendiente
    pendingChallenges.set(userId, {
      code,
      expiresAt,
      attempts: 0,
      telegramId: String(telegramId).trim()
    });

    const payload = {
      bot_token: BOT_SECURITY_TOKEN,
      usuario: userName || 'Cliente 3D Studio',
      telegram_id: String(telegramId).trim(),
      canal: 'telegram',
      codigo: code,
      panel: 'cliente',
      es_activacion_codigo: isActivation
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const res = await fetch(RENDER_2FA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        throw new Error(data.error || `Error ${res.status} al conectar con el bot de Telegram`);
      }

      return {
        success: true,
        expiresInSeconds: 300,
        telegramId: String(telegramId).trim()
      };
    } catch (err) {
      console.error('[2FA Telegram Error]', err);
      // Si falla por CORS o conectividad en Render, devolvemos feedback claro
      if (err.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado al conectar con el bot.');
      }
      throw err;
    }
  }

  /**
   * Valida el código 2FA ingresado por el usuario
   */
  static verifyCode(userId, inputCode) {
    const challenge = pendingChallenges.get(userId);
    if (!challenge) {
      return { valid: false, error: 'No hay un código pendiente o ya ha expirado.' };
    }

    if (Date.now() > challenge.expiresAt) {
      pendingChallenges.delete(userId);
      return { valid: false, error: 'El código ha expirado (límite 5 min). Solicita uno nuevo.' };
    }

    challenge.attempts++;
    if (challenge.attempts > 4) {
      pendingChallenges.delete(userId);
      return { valid: false, error: 'Demasiados intentos fallidos. Solicita un nuevo código.' };
    }

    const cleanInput = String(inputCode || '').trim();
    if (cleanInput === challenge.code) {
      pendingChallenges.delete(userId);
      return { valid: true };
    }

    return {
      valid: false,
      error: `Código incorrecto. Te quedan ${5 - challenge.attempts} intentos.`
    };
  }

  /**
   * Cancela o limpia el reto pendiente
   */
  static clearChallenge(userId) {
    pendingChallenges.delete(userId);
  }
}
