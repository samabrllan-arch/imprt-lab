import { getAssetPath } from './paths.js';

/**
 * Catálogo de Trabajos Realizados y Colecciones Lookbook DTF
 */
const RAW_LOOKBOOK_ITEMS = [
  {
    id: 'skeleton-savage',
    title: 'Bone Savage • Muscle Skull',
    category: 'Streetwear',
    shirtColor: '#111215',
    badge: 'DROP DESTACADO',
    tagColor: '#ea580c',
    imageSrc: '/assets/drops/drop_skeleton.png',
    author: '@skull_atelier',
    visibility: 'Público',
    description: 'Ilustración anatómica visceral en alto contraste lista para estampado DTF frontal.'
  },
  {
    id: 'goku-saiyan',
    title: 'Son Goku • Super Saiyan Aura',
    category: 'Anime',
    shirtColor: '#874438',
    badge: 'ANIME SPECIAL',
    tagColor: '#eab308',
    imageSrc: '/assets/drops/drop_goku.png',
    author: '@dbz_crew',
    visibility: 'Público',
    description: 'Ilustración anime de poder y aura dorada Super Saiyan en impresión textil HD.'
  },
  {
    id: 'rick-morty-portal',
    title: 'Multiverse Portal • Streetwear',
    category: 'Series & Pop',
    shirtColor: '#111215',
    badge: 'CULT DROP',
    tagColor: '#22c55e',
    imageSrc: '/assets/drops/drop_rick_morty.png',
    author: '@portal_lab',
    visibility: 'Público',
    description: 'Rick y Morty urbanos con portal interdimensional en gradientes neón Ultra HD.'
  },
  {
    id: 'cyber-oni',
    title: 'Neo-Tokyo • Mecha Oni Mask',
    category: 'Cyberpunk',
    shirtColor: '#3d434f',
    badge: 'CYBER SPECIAL',
    tagColor: '#f43f5e',
    imageSrc: '/assets/drops/drop_oni.png',
    author: '@tokyo_forge',
    visibility: 'Público',
    description: 'Máscara samurai cibernética con circuitos carmesí y cian para prendas streetwear oscuras.'
  },
  {
    id: 'vintage-wolf',
    title: 'Gentleman Wolf • Top Hat',
    category: 'Streetwear',
    shirtColor: '#874438',
    badge: 'VINTAGE DROP',
    tagColor: '#a855f7',
    imageSrc: '/assets/drops/drop_vintage_wolf.png',
    author: '@lupus_tailor',
    visibility: 'Público',
    description: 'Lobo gentleman musculoso con sombrero de copa en estética vintage urbana limpia.'
  },
  {
    id: 'shadow-mage',
    title: 'Shadow Mage • Mystic Hood',
    category: 'Fantasy',
    shirtColor: '#111215',
    badge: 'DARK FANTASY',
    tagColor: '#38bdf8',
    imageSrc: '/assets/drops/drop_shadow_mage.png',
    author: '@arcane_roots',
    visibility: 'Público',
    description: 'Mago sombrío 3D con ojos luminosos dorados y túnica de cuero artesanal con cuernos.'
  },
  {
    id: 'samurai-sun',
    title: 'Blood Sun • Ronin Armor',
    category: 'Streetwear',
    shirtColor: '#111215',
    badge: 'RONIN SPECIAL',
    tagColor: '#ef4444',
    imageSrc: '/assets/drops/drop_samurai_sun.png',
    author: '@kyoto_rebel',
    visibility: 'Público',
    description: 'Guerrero samurai dorado con katana frente al sol naciente escarlata en salpicadura.'
  },
  {
    id: 'kenshin-blade',
    title: 'Battōjutsu • Crimson Blade',
    category: 'Anime',
    shirtColor: '#874438',
    badge: 'ANIME ICON',
    tagColor: '#f97316',
    imageSrc: '/assets/drops/drop_kenshin.png',
    author: '@shogun_draw',
    visibility: 'Público',
    description: 'Espadachín legendario en postura battōjutsu con kimono carmesí y katana desenfundada.'
  },
  {
    id: 'spiderman-leap',
    title: 'Web Crawler • Dynamic Leap',
    category: 'Series & Pop',
    shirtColor: '#3d434f',
    badge: 'HERO DROP',
    tagColor: '#0ea5e9',
    imageSrc: '/assets/drops/drop_spiderman.png',
    author: '@queens_vault',
    visibility: 'Público',
    description: 'Spider-Man en salto acrobático con perspectiva frontal de alto dinamismo.'
  },
  {
    id: 'ironman-repulsor',
    title: 'Arc Repulsor • Gold & Red',
    category: 'Series & Pop',
    shirtColor: '#111215',
    badge: 'MECHA HERO',
    tagColor: '#eab308',
    imageSrc: '/assets/drops/drop_ironman.png',
    author: '@stark_lab',
    visibility: 'Público',
    description: 'Armadura biónica con pulso repulsor cargado en pose de impacto lista para DTF.'
  },
  {
    id: 'musashi-ink',
    title: 'Musashi • Sumi-e Brush',
    category: 'Streetwear',
    shirtColor: '#ede9e0',
    badge: 'INK ART',
    tagColor: '#64748b',
    imageSrc: '/assets/drops/drop_musashi.png',
    author: '@vagabond_ink',
    visibility: 'Público',
    description: 'Silueta samurai en caligrafía sumi-e japonesa con doble katana de alta elegancia.'
  },
  {
    id: 'astronaut-cosmic',
    title: 'Deep Cosmos • Spaceman',
    category: 'Streetwear',
    shirtColor: '#111215',
    badge: 'COSMIC VIBE',
    tagColor: '#06b6d4',
    imageSrc: '/assets/drops/drop_astronaut.png',
    author: '@orbit_studios',
    visibility: 'Público',
    description: 'Astronauta retro con visor de cristal cian y traje de exploración profunda.'
  }
];

export const LOOKBOOK_ITEMS = RAW_LOOKBOOK_ITEMS.map((item) => ({
  ...item,
  imageSrc: getAssetPath(item.imageSrc)
}));

export const CLIENT_REVIEWS = [
  {
    name: 'Sebastián M.',
    city: 'Medellín',
    rating: 5,
    comment: 'La calidad del 240 GSM es una locura, el cuello es bien ajustado y el estampado DTF se siente parte de la tela. Ya pedí 3 más para mi marca.',
    verified: true
  },
  {
    name: 'Valentina R.',
    city: 'Bogotá',
    rating: 5,
    comment: 'Poder ver la camiseta en 3D antes de comprar me dio mucha seguridad. Le quité el fondo a mi logo con el editor y llegó idéntica.',
    verified: true
  },
  {
    name: 'Camilo D.',
    city: 'Cali',
    rating: 5,
    comment: 'El mejor servicio de camisetas personalizadas en Colombia. El envío fue rápido y el pedido por WhatsApp súper fluido.',
    verified: true
  }
];
