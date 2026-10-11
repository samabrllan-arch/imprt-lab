/**
 * Catálogo de Materiales Textiles y Gramajes
 */
export const FABRIC_MATERIALS = [
  {
    id: 'algodon',
    name: 'Algodón 100% Peinado',
    shortName: 'Algodón',
    badge: 'Heavyweight & Soft Touch',
    description: 'Tejido natural peinado de alta densidad, tacto sedoso y máxima fijación térmica para estampados DTF.',
    icon: '🧵'
  },
  {
    id: 'poliester',
    name: 'Poliéster Deportivo Dry-Fit',
    shortName: 'Poliéster',
    badge: 'Transpirable & Flex',
    description: 'Microfibra técnica ligera de secado rápido, elástica y resistente para alto rendimiento y estilo urbano.',
    icon: '⚡'
  }
];

export const FABRIC_GRAMMAGES = [
  {
    id: '120',
    label: '120 GSM',
    title: 'Ultra Liviana',
    tag: 'Dry-Fit / Liviano',
    priceModifier: -5000,
    description: 'Tejido ultra fresco, flexible y ligero para climas cálidos y deportes.'
  },
  {
    id: '180',
    label: '180 GSM',
    title: 'Standard Fit',
    tag: 'Clásico Urbano',
    priceModifier: 0,
    description: 'Calibre intermedio clásico, suave al tacto y equilibrado para todo el día.'
  },
  {
    id: '240',
    label: '240 GSM',
    title: 'Heavyweight Boxy',
    tag: 'Atelier Streetwear',
    priceModifier: 4000,
    description: 'Gramaje grueso estructurado con caída pesada y cuello indeformable de 3 cm.'
  }
];
