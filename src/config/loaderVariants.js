/**
 * Definición de Variantes de Loaders para el Laboratorio y el Estudio 3D
 */

export const LOADER_VARIANTS = {
  hologram: {
    id: 'hologram',
    title: 'Holograma Cyber-Tech 3D (IA)',
    subtitle: 'Camiseta translúcida holográfica con nodos de datos y haz láser',
    tag: 'ATELIER 3D // CYBER-TECH v3.0',
    meshTag: 'MESH: DRACO 240G',
    headline: 'INICIALIZANDO ESTUDIO 3D',
    imgSrc: './assets/loader/loader_hologram.jpg',
    themeClass: '',
    steps: [
      { pct: 15, msg: 'Conectando aceleración de hardware WebGL...', coord: 'GPU: ACTIVADA' },
      { pct: 45, msg: 'Cargando geometría CLO3D Oversize (577k vértices)...', coord: 'MESH: DRACO 240G' },
      { pct: 75, msg: 'Compilando shaders PBR & compositor UV 2048px...', coord: 'DTF: 1200 DPI' },
      { pct: 95, msg: 'Calibrando iluminación Studio HDRI & sombras...', coord: 'RENDER: 60 FPS' },
      { pct: 100, msg: '¡Estudio listo! Abriendo Atelier 3D...', coord: 'READY: 100%' }
    ]
  },
  cyberscan: {
    id: 'cyberscan',
    title: 'Escaneo Cuántico Orbital (IA)',
    subtitle: 'Prenda streetwear de algodón pesado con anillo cuántico en órbita',
    tag: 'CLO3D CAD // ORBITAL SCANNER',
    meshTag: 'COTTON 240 GSM',
    headline: 'ESCANEO DE PRENDA EN TIEMPO REAL',
    imgSrc: './assets/loader/loader_cyber_scan.jpg',
    themeClass: 'orbit-theme',
    steps: [
      { pct: 20, msg: 'Iniciando escáner fotogramétrico 360°...', coord: 'RADAR: ACTIVO' },
      { pct: 50, msg: 'Mapeando grosor de hilo y caída de tela...', coord: 'TELA: 240 GSM' },
      { pct: 78, msg: 'Indexando zonas DTF de alta resolución...', coord: 'ZONAS: F/B/M' },
      { pct: 95, msg: 'Alineando coordenadas UV con la malla...', coord: 'UV: 100%' },
      { pct: 100, msg: '¡Escaneo completado con éxito!', coord: 'ESTUDIO LISTO' }
    ]
  },
  luxury: {
    id: 'luxury',
    title: 'Haute Couture Facetada (IA)',
    subtitle: 'Diseño geométrico de lujo con aristas en oro y cristal facetado',
    tag: 'HAUTE COUTURE // ATELIER GOLD',
    meshTag: 'PARIS EDITION',
    headline: 'ATELIER DE ALTA COSTURA',
    imgSrc: './assets/loader/loader_luxury_faceted.jpg',
    themeClass: 'gold-theme',
    steps: [
      { pct: 18, msg: 'Preparando entorno de diseño de lujo...', coord: 'LUXURY: ACTIVE' },
      { pct: 48, msg: 'Modelando facetas geométricas de alta costura...', coord: 'FACET: LOW-POLY' },
      { pct: 75, msg: 'Aplicando refracción dorada y sombras suaves...', coord: 'HDRI: STUDIO 8K' },
      { pct: 95, msg: 'Pulido final de materiales prémium...', coord: 'FINISH: 100%' },
      { pct: 100, msg: 'Bienvenido al taller exclusivo.', coord: 'ATELIER READY' }
    ]
  },
  kinetic: {
    id: 'kinetic',
    title: 'Reactor Cinético Vectorial (CSS)',
    subtitle: 'Núcleo procedural giratorio a 60 FPS sin imágenes estáticas',
    tag: 'REACTOR CORE // 60 FPS VECTOR',
    meshTag: 'ENGINE: CSS3D',
    headline: 'TEJIENDO MATRIZ DE PRENDA',
    imgSrc: null,
    themeClass: '',
    steps: [
      { pct: 20, msg: 'Encendiendo motor cinético de vectores...', coord: 'CSS3D: ON' },
      { pct: 50, msg: 'Tejiendo trama y urdimbre del algodón...', coord: 'THREAD: 240G' },
      { pct: 75, msg: 'Ensamblando mallas y costuras anatómicas...', coord: 'MESH: READY' },
      { pct: 95, msg: 'Calibrando respuesta a 60 FPS...', coord: 'FPS: 60' },
      { pct: 100, msg: '¡Listo para personalizar!', coord: 'GO!' }
    ]
  }
};
