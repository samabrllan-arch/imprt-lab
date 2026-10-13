/**
 * Matriz de precios dinámicos para camiseta y estampados adicionales
 */
export const PRICING_CONFIG = {
  currency: 'COP',
  symbol: '$',
  baseShirtPrice: 55000, // Camiseta premium básica
  baseMugPrice: 28000,   // Vaso / Mug Cerámico 11 Oz con estampado incluido
  magicMugAddon: 10000,  // Recargo por Mug Mágico Termosensible (revela con calor)
  zonePrices: {
    front: 0,           // Estampado principal incluido en prenda/vaso base
    frontPocket: 12000, // Logo adicional en pecho / bolsillo
    back: 18000         // Estampado en espalda
  },
  sizeAddons: {
    S: 0,
    M: 0,
    L: 0,
    XL: 3000,
    XXL: 6000
  },
  supportPhone: '573015063187' // Número de WhatsApp para pedidos
};

/**
 * Formateador de moneda colombiana
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}
