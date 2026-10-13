/**
 * Definición de zonas de personalización de la camiseta calibradas con el patrón UV de CLO3D y Meshy
 * Zonas activas: Frente, Pecho Izquierdo (Bolsillo) y Espalda
 */

export const ZONES = {
  front: {
    id: 'front',
    name: 'Frente Central',
    icon: '👕',
    defaultView: 'front',
    // Coordenadas UV centradas ópticamente con la costura del cuello
    canvasArea: { x: 572, y: 720, width: 440, height: 440 },
    canvasAreaBySilhouette: {
      man: {
        x: 572, y: 720, width: 440, height: 440,
        bounds: { minX: 354, maxX: 790, minY: 320, maxY: 940 }
      },
      woman: {
        x: 570, y: 990, width: 380, height: 380,
        bounds: { minX: 330, maxX: 810, minY: 500, maxY: 1230 }
      },
      mug: {
        x: 1540, y: 1024, width: 520, height: 520,
        bounds: { minX: 240, maxX: 1860, minY: 560, maxY: 1488 }
      }
    },
    limits: { minScale: 0.2, maxScale: 2.2, minOffset: -2.5, maxOffset: 2.2 }
  },
  frontPocket: {
    id: 'frontPocket',
    name: 'Logo Pecho (Bolsillo)',
    icon: '🏷️',
    defaultView: 'front',
    // Coordenadas UV en el pectoral izquierdo con límites físicos
    canvasArea: { x: 428, y: 755, width: 220, height: 220 },
    canvasAreaBySilhouette: {
      man: {
        x: 428, y: 755, width: 220, height: 220,
        bounds: { minX: 260, maxX: 560, minY: 520, maxY: 940 }
      },
      woman: {
        x: 420, y: 1100, width: 190, height: 190,
        bounds: { minX: 280, maxX: 540, minY: 920, maxY: 1250 }
      }
    },
    limits: { minScale: 0.2, maxScale: 1.8, minOffset: -2.2, maxOffset: 2.2 }
  },
  back: {
    id: 'back',
    name: 'Espalda',
    icon: '🔙',
    defaultView: 'back',
    // Coordenadas UV exactas de la espalda alta (omóplatos) en Canvas 2048x2048
    canvasArea: { x: 1536, y: 720, width: 460, height: 460 },
    canvasAreaBySilhouette: {
      man: {
        x: 1536, y: 720, width: 460, height: 460,
        bounds: { minX: 1306, maxX: 1766, minY: 320, maxY: 940 }
      },
      woman: {
        x: 1536, y: 990, width: 400, height: 400,
        bounds: { minX: 1296, maxX: 1776, minY: 500, maxY: 1230 }
      }
    },
    limits: { minScale: 0.2, maxScale: 2.2, minOffset: -2.5, maxOffset: 2.2 }
  }
};

export const CAMERA_VIEWS = {
  front: { pos: [0, 0.05, 2.10], target: [0, -0.02, 0], name: 'Frente' },
  back: { pos: [0, 0.05, -2.10], target: [0, -0.02, 0], name: 'Espalda' },
  free: { pos: [1.1, 0.5, 1.7], target: [0, -0.02, 0], name: 'Libre 360°' }
};
