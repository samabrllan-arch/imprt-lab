/**
 * Buzón de sugerencias (NODE-014): bandeja local + mensaje de WhatsApp pre-armado.
 *
 * No hay backend: "Enviar al equipo" guarda el mensaje en este navegador (`shirt_feedback_inbox`, máx. 20)
 * y el canal que SÍ llega al equipo es WhatsApp. WhatsApp no admite adjuntar imágenes por enlace, así que
 * el mensaje avisa que la captura se envía aparte dentro del chat.
 */
import { PRICING_CONFIG } from '../config/pricing.js';

const STORAGE_KEY = 'shirt_feedback_inbox';
const MAX_ENTRIES = 20;

export const FEEDBACK_TYPES = [
  { id: 'sugerencia', icon: '💡', label: 'Sugerencia' },
  { id: 'queja', icon: '⚠️', label: 'Queja / Reclamo' },
  { id: 'felicitacion', icon: '⭐', label: 'Felicitación' },
  { id: 'consulta', icon: '❓', label: 'Consulta' }
];

export const RATING_LABELS = ['', 'Deficiente', 'Regular', 'Bueno', 'Muy Bueno', '¡Excelente!'];

export function getFeedbackInbox() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

/** Guarda el mensaje (el más reciente primero). Si no hay cupo descarta la captura y luego los más viejos. */
export function saveFeedback(entry) {
  const record = { ...entry, id: `FB-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString() };
  const base = [record, ...getFeedbackInbox()].slice(0, MAX_ENTRIES);
  const attempts = [
    base,
    base.map((e, i) => (i === 0 ? e : { ...e, attachment: '' })),
    base.map((e) => ({ ...e, attachment: '' })),
    base.slice(0, 5).map((e) => ({ ...e, attachment: '' }))
  ];
  for (const list of attempts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return record;
    } catch (_) { /* siguiente intento */ }
  }
  return null;
}

/** Texto formateado para WhatsApp (markdown de WhatsApp: *negrita*). */
export function buildFeedbackMessage(entry) {
  const type = FEEDBACK_TYPES.find((t) => t.id === entry.type);
  const stars = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);
  const lines = [
    `*Buzón de ${type ? type.label : 'Sugerencias'} - IMPRNT [LAB]*`,
    `• *Nombre:* ${entry.name || 'Cliente'}`,
    entry.alias ? `• *Usuario:* @${entry.alias}` : '',
    `• *Contacto:* ${entry.contact || 'No indicado'}`,
    `• *Pedido:* ${entry.order ? `#${entry.order}` : 'Sin pedido asociado'}`,
    `• *Calificación:* ${stars} (${entry.rating}/5)`,
    `• *Mensaje:* ${entry.message || '(Sin mensaje)'}`,
    entry.attachmentName ? `• *Captura:* ${entry.attachmentName} (te la envío en este chat)` : ''
  ];
  return lines.filter(Boolean).join('\n');
}

export function buildFeedbackWhatsAppUrl(entry) {
  return `https://wa.me/${PRICING_CONFIG.supportPhone}?text=${encodeURIComponent(buildFeedbackMessage(entry))}`;
}
