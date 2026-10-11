/**
 * Fases de producción y seguimiento del pedido (NODE-024)
 * Diseñado para simular en frontend el ciclo de vida antes de conectar el backend real.
 */
export const PRODUCTION_STAGES = Object.freeze([
  {
    id: 'validation',
    label: 'Validación de Pago',
    short: 'El pago está siendo validado',
    desc: 'Revisando tu transferencia en menos de 24 horas.',
    icon: '⏳'
  },
  {
    id: 'printing',
    label: 'Impresión Textil',
    short: 'Tu estampado está siendo impreso',
    desc: 'Inyección de tinta DTF a 300 DPI en alta fidelidad.',
    icon: '🖨️'
  },
  {
    id: 'pressing',
    label: 'Estampado & Curado',
    short: 'Se estampó tu camiseta',
    desc: 'Fijación por termo-fijado y curado térmico.',
    icon: '👕'
  },
  {
    id: 'packing',
    label: 'Empaque Atelier',
    short: 'Se está empacando el pedido',
    desc: 'Control de calidad y embalaje streetwear exclusivo.',
    icon: '📦'
  },
  {
    id: 'shipped',
    label: 'En Camino',
    short: 'El pedido ya salió',
    desc: 'En ruta de transporte con guía de despacho.',
    icon: '🚚'
  },
  {
    id: 'delivered',
    label: 'Entregado',
    short: '¡Pedido entregado con éxito!',
    desc: 'Prenda recibida y lista para vestir.',
    icon: '✨'
  }
]);

export function getStageIndex(stageId) {
  const idx = PRODUCTION_STAGES.findIndex((s) => s.id === stageId);
  return idx === -1 ? 0 : idx;
}

export function getStageMeta(stageId) {
  return PRODUCTION_STAGES.find((s) => s.id === stageId) || PRODUCTION_STAGES[0];
}

export function getNextStage(currentStageId) {
  const idx = getStageIndex(currentStageId);
  if (idx < PRODUCTION_STAGES.length - 1) {
    return PRODUCTION_STAGES[idx + 1].id;
  }
  return PRODUCTION_STAGES[0].id;
}
