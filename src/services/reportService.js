/**
 * Reportes de contenido indebido (NODE-027), 100 % frontend: `localStorage['shirt_reported_content']`.
 * Un diseño reportado se oculta preventivamente para quien reporta; los motivos de tolerancia cero
 * (material ilícito) no se pueden volver a mostrar. Sin backend: el aviso real al equipo es por WhatsApp.
 */
import { PRICING_CONFIG } from '../config/pricing.js';
import { formatAlias } from './userAlias.js';

export const REPORTS_KEY = 'shirt_reported_content';
const MAX_REPORTS = 200;
export const DETAILS_MAX = 500;
export const OTHER_MIN = 10;

/** Categorías de denuncia (orden de la interfaz). `zero` = tolerancia cero: nunca se vuelve a mostrar. */
export const REPORT_CATEGORIES = [
  { id: 'illicit', icon: '🚫', label: 'Material ilícito / Pornografía / CSAM', hint: 'Tolerancia cero. Se oculta de inmediato.', zero: true },
  { id: 'copyright', icon: '⚖️', label: 'Infracción de Derechos de Autor o Marcas Registradas', hint: 'Arte o marca usados sin autorización.' },
  { id: 'hate', icon: '🛑', label: 'Discurso de Odio, Racismo o Discriminación', hint: 'Ataca a personas por su origen, género, religión u otra condición.' },
  { id: 'violence', icon: '⚠️', label: 'Violencia o Contenido Explícito', hint: 'Violencia gráfica o imágenes explícitas.' },
  { id: 'other', icon: '📝', label: 'Otro motivo', hint: 'Cuéntanos qué ocurre.' }
];

export const getCategory = (id) => REPORT_CATEGORIES.find((c) => c.id === id) || null;
const revealed = new Set(); // "Mostrar de todos modos": solo durante esta visita
const notify = () => { try { window.dispatchEvent(new CustomEvent('reports:changed')); } catch (_) {} };

let memo = { raw: null, list: [] }; // las tarjetas consultan cada diseño: se re-parsea solo si el JSON cambió

function read() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY) || '[]';
    if (raw === memo.raw) return memo.list;
    const list = JSON.parse(raw);
    memo = { raw, list: Array.isArray(list) ? list : [] };
    return memo.list;
  } catch (_) {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(list.slice(0, MAX_REPORTS)));
    notify();
    return true;
  } catch (_) {
    return false;
  }
}

/** Id corto y legible para el equipo: "vault-VLT-AB12" → "VLT-AB12". */
export const displayDesignId = (designId) => String(designId || '').replace(/^vault-/, '');

/**
 * Valida el borrador. Devuelve el mensaje de error o '' si es válido.
 * @param {{category?: string, details?: string}} draft
 */
export function validateReport({ category, details = '' } = {}) {
  if (!getCategory(category)) return 'Elige un motivo para el reporte.';
  if (category === 'other' && String(details).trim().length < OTHER_MIN) return `Describe el motivo (mínimo ${OTHER_MIN} caracteres).`;
  return '';
}

/**
 * Guarda el reporte (uno por diseño: reportar de nuevo lo actualiza).
 * @returns {{ok:boolean, report?:object, error?:string}}
 */
export function addReport({ designId, title = '', authorAlias = '', category, details = '', reporterId = '' }) {
  const error = !designId ? 'Diseño no válido.' : validateReport({ category, details });
  if (error) return { ok: false, error };
  const report = {
    id: `RPT-${Date.now().toString(36).toUpperCase()}`,
    designId: String(designId),
    title: String(title).slice(0, 80),
    authorAlias: String(authorAlias).replace(/^@+/, '').slice(0, 24),
    category,
    details: String(details).trim().slice(0, DETAILS_MAX),
    reporterId: String(reporterId || ''),
    createdAt: new Date().toISOString()
  };
  revealed.delete(report.designId);
  return write([report, ...read().filter((r) => r.designId !== report.designId)])
    ? { ok: true, report } : { ok: false, error: 'El navegador no tiene espacio para guardar el reporte.' };
}

export const getReports = () => read();
export const getReport = (designId) => read().find((r) => r.designId === designId) || null;

/** ¿Hay que ocultar el diseño? (reportado y no "mostrado de todos modos"). */
export const isHidden = (designId) => !!getReport(designId) && !revealed.has(designId);

/** Solo los motivos que no son de tolerancia cero se pueden volver a mostrar. */
export function canReveal(designId) {
  const report = getReport(designId);
  return !!report && !getCategory(report.category)?.zero;
}

export function revealReported(designId) {
  if (!canReveal(designId)) return false;
  revealed.add(designId);
  notify();
  return true;
}

/** Plantilla de WhatsApp: `🚩 REPORTE URGENTE: Diseño #[ID] por @[Alias] - Motivo: [Categoría]`. */
export function buildReportWhatsAppUrl(report) {
  const cat = getCategory(report.category);
  const alias = formatAlias(report.authorAlias) || '@comunidad';
  const lines = [`🚩 REPORTE URGENTE: Diseño #${displayDesignId(report.designId)} por ${alias} - Motivo: ${cat ? cat.label : report.category}`];
  if (report.details) lines.push(`Detalle: ${report.details}`);
  const phone = PRICING_CONFIG.supportPhone.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
