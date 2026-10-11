/**
 * Colección cromática de telas de temporada (Mineral & Earth Streetwear)
 * Tonos curados para reproducción textil realista bajo iluminación PBR
 */
export const FABRIC_COLORS = [
  { id: 'terracotta', name: 'Washed Terracotta', hex: '#874438', roughness: 0.86, metalness: 0.03 },
  { id: 'pitch-black', name: 'Pitch Black', hex: '#111215', roughness: 0.88, metalness: 0.02 },
  { id: 'chalk-white', name: 'Chalk White', hex: '#f2f2ef', roughness: 0.90, metalness: 0.01 },
  { id: 'washed-slate', name: 'Washed Slate', hex: '#3d434f', roughness: 0.86, metalness: 0.03 },
  { id: 'sandstone', name: 'Sandstone Cream', hex: '#d6c8b4', roughness: 0.89, metalness: 0.02 },
  { id: 'mocha-earth', name: 'Mocha Earth', hex: '#44332a', roughness: 0.87, metalness: 0.02 },
  { id: 'military-olive', name: 'Military Olive', hex: '#323c33', roughness: 0.88, metalness: 0.02 },
  { id: 'midnight-navy', name: 'Midnight Navy', hex: '#182133', roughness: 0.85, metalness: 0.03 }
];

export const SIZES = [
  {
    id: 'S',
    label: 'S',
    name: 'Small (Largo 50cm · Pecho 46cm)',
    lengthCm: 50,
    widthCm: 46,
    maxPrintWidthCm: 28,
    maxPrintHeightCm: 35
  },
  {
    id: 'M',
    label: 'M',
    name: 'Medium (Largo 55cm · Pecho 50cm)',
    lengthCm: 55,
    widthCm: 50,
    maxPrintWidthCm: 30,
    maxPrintHeightCm: 38
  },
  {
    id: 'L',
    label: 'L',
    name: 'Large (Largo 60cm · Pecho 54cm)',
    lengthCm: 60,
    widthCm: 54,
    maxPrintWidthCm: 32,
    maxPrintHeightCm: 42
  },
  {
    id: 'XL',
    label: 'XL',
    name: 'X-Large (Largo 65cm · Pecho 58cm)',
    lengthCm: 65,
    widthCm: 58,
    maxPrintWidthCm: 34,
    maxPrintHeightCm: 46
  },
  {
    id: 'XXL',
    label: 'XXL',
    name: '2X-Large (Largo 70cm · Pecho 62cm)',
    lengthCm: 70,
    widthCm: 62,
    maxPrintWidthCm: 36,
    maxPrintHeightCm: 50
  }
];
