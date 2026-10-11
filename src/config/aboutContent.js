/**
 * Contenido de la vista #conocenos (NODE-028). Textos estáticos y de confianza (sin datos de usuario),
 * por eso las descripciones pueden llevar <strong>. Las ilustraciones viven en /public/assets/about/.
 */
/** Título principal: "La Nueva Era del Streetwear On-Demand & Prototipado 3D" (la segunda parte lleva el glow). */
export const ABOUT_TITLE_LEAD = 'La Nueva Era del ';
export const ABOUT_TITLE_GLOW = 'Streetwear On-Demand & Prototipado 3D';

export const ABOUT_LEAD =
  'En <strong>IMPRNT [LAB]</strong> fusionamos computación gráfica WebGL en tiempo real, inteligencia artificial y confección textil ' +
  'de alto gramaje para transformar cómo creas y vistes tu propia marca.';

/** @type {{id:string, icon:string, tag:string, title:string, desc:string, chips:string[], img:{src:string, alt:string}, legal?:boolean}[]} */
export const ABOUT_CARDS = [
  {
    id: 'identity', icon: '🏛️', tag: 'IDENTIDAD', title: '¿Quiénes Somos?',
    desc: 'Somos un laboratorio colombiano de manufactura textil bajo demanda y prototipado 3D en tiempo real. Eliminamos la incertidumbre de la ' +
      'estampación tradicional permitiendo a cualquier creador o marca visualizar sus prendas en 360° antes de cortar una sola yarda de tela.',
    chips: ['Algodón Heavyweight 240 GSM', 'Corte Boxy Streetwear', 'Desde 1 Unidad'],
    img: { src: '/assets/about/about_identity.webp', alt: 'Identidad IMPRNT [LAB]' }
  },
  {
    id: 'mision', icon: '🎯', tag: 'MISIÓN', title: 'Nuestra Misión',
    desc: 'Democratizar la moda de autor y el streetwear de lujo accesible. Ponemos herramientas de diseño industrial y estampación textil DTF Ultra HD ' +
      'sin tacto plástico (+60 lavadas) en manos de artistas, marcas emergentes y apasionados de la moda, sin pedidos mínimos y con cero desperdicio textil.',
    chips: ['Cero Tacto Plástico', '300 DPI de Alta Fidelidad', '+60 Lavadas Garantizadas'],
    img: { src: '/assets/about/about_mision.webp', alt: 'Misión IMPRNT [LAB]' }
  },
  {
    id: 'vision', icon: '🚀', tag: 'VISIÓN', title: 'Nuestra Visión',
    desc: 'Consolidarnos como el atelier digital y micro-factoría inteligente de referencia en Latinoamérica. Visualizamos un ecosistema donde la inteligencia ' +
      'artificial y la computación en el navegador potencian la creatividad humana con confección local, ética y trazable.',
    chips: ['Atelier Digital 2026', 'IA + Confección Local', 'Envíos a Todo el País'],
    img: { src: '/assets/about/about_vision.webp', alt: 'Visión IMPRNT [LAB]' }
  },
  {
    id: 'licencia', icon: '⚖️', tag: 'CUMPLIMIENTO & LICENCIAS', title: 'Transparencia y Derechos de Autor', legal: true,
    desc: 'En estricto compromiso con la transparencia y el uso ético de tecnologías generativas, la silueta textil femenina fue generada ' +
      'con asistencia de IA en <strong>Meshy.ai</strong> (modalidad gratuita). Su topología tridimensional, retopología, alineación de costuras, mapeo UV ' +
      'y optimización de renderizado fueron modelados y calibrados por nuestro equipo técnico para ejecución fluida en WebGL a 60 FPS. 100% transparente y legal.',
    chips: ['Generador 3D Meshy.ai', 'Topología & UV Calibrados', '100% Transparente & Legal'],
    img: { src: '/assets/about/about_licencia.webp', alt: 'Transparencia Silueta 3D Meshy.ai y Calibración UV' }
  }
];
