/**
 * Estados del pedido y datos de pago (Nequi / Bancolombia) — NODE-024.
 *
 * IMPORTANTE: completa los `value` de cada método con los datos reales del negocio.
 * Mientras un campo esté vacío la UI muestra "Pídelo por WhatsApp" y NUNCA inventa datos bancarios.
 */

export const ORDER_STATUS = Object.freeze({
  PENDING_PAYMENT: 'pending_payment',
  PROOF_SUBMITTED: 'proof_submitted',
  PAID: 'paid'
});

/** tone → color semántico en CSS (`.mp-status[data-tone]`) */
export const ORDER_STATUS_META = Object.freeze({
  [ORDER_STATUS.PENDING_PAYMENT]: {
    label: 'Pendiente de Pago',
    tone: 'pending',
    hint: 'Paga con Nequi o Bancolombia y marca como pagado para iniciar la producción.'
  },
  [ORDER_STATUS.PROOF_SUBMITTED]: {
    label: 'En Validación',
    tone: 'review',
    hint: 'Tu pago entró en validación. En menos de 24 horas te notificaremos y validaremos tu pedido.'
  },
  [ORDER_STATUS.PAID]: {
    label: 'Pago Confirmado',
    tone: 'paid',
    hint: 'Pago validado. Tu pedido entra a producción.'
  }
});

export const PAYMENT_METHODS = Object.freeze([
  {
    id: 'nequi',
    label: 'Nequi',
    icon: '📱',
    fields: [
      { label: 'Número Nequi', value: '', copy: true },
      { label: 'Titular', value: '' }
    ]
  },
  {
    id: 'bancolombia',
    label: 'Bancolombia',
    icon: '🏦',
    fields: [
      { label: 'Tipo de cuenta', value: '' },
      { label: 'Número de cuenta', value: '', copy: true },
      { label: 'Titular', value: '' },
      { label: 'Documento', value: '' }
    ]
  }
]);

export function getPaymentMethod(id) {
  return PAYMENT_METHODS.find((m) => m.id === id) || null;
}

export function getStatusMeta(status) {
  return ORDER_STATUS_META[status] || ORDER_STATUS_META[ORDER_STATUS.PENDING_PAYMENT];
}

/** Pedidos creados antes del flujo de pago no tienen `status`: se tratan como pendientes. */
export function isPayable(order) {
  return (order?.status || ORDER_STATUS.PENDING_PAYMENT) !== ORDER_STATUS.PAID;
}
