/**
 * BIBLIOTECA DE EFECTOS VECTORIALES STREETWEAR & FONDOS CROMA (<260 Líneas)
 * Incluye presets con fondo verde #00FF00 para pruebas de extracción croma
 */

export const STREETWEAR_EFFECTS = [
  // 🟢 1. EFECTOS CON FONDO VERDE PURO (#00FF00) (Para probar quitar fondo verde)
  {
    id: 'fx_green_lightning',
    name: '⚡ Rayo (Fondo Verde)',
    category: 'chroma_green',
    color: '#00ff00',
    svg: `<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M145 15 L70 135 L125 135 L85 265 L180 145 L130 145 Z" fill="#00f0ff" />
      <path d="M145 15 L70 135 L125 135 L85 265 L180 145 L130 145 Z" fill="#ffffff" opacity="0.8" />
    </svg>`
  },
  {
    id: 'fx_green_fire',
    name: '🔥 Fuego (Fondo Verde)',
    category: 'chroma_green',
    color: '#00ff00',
    svg: `<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M120 15 C135 65 180 100 180 155 C180 200 155 215 145 245 C200 220 210 155 190 105 C220 155 220 225 175 270 C135 300 80 290 50 250 C20 215 25 150 70 95 C65 130 80 160 100 170 C90 130 95 90 120 15 Z" fill="#ff3d00" />
      <path d="M120 75 C130 110 155 140 155 175 C155 210 140 230 125 255 C110 230 100 210 100 175 C100 140 110 110 120 75 Z" fill="#ffea00" />
    </svg>`
  },
  {
    id: 'fx_green_clouds',
    name: '☁️ Nube (Fondo Verde)',
    category: 'chroma_green',
    color: '#00ff00',
    svg: `<svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M50 150 C30 150 15 135 15 115 C15 95 30 80 48 76 C55 48 80 28 110 28 C140 28 165 48 172 75 C182 70 192 68 205 68 C235 68 255 92 255 120 C255 150 230 175 200 175 L50 175 Z" fill="#475569" />
      <path d="M60 142 C42 142 28 128 28 112 C28 96 40 82 55 80 C62 55 85 38 112 38 C138 38 158 55 165 78 C175 73 185 71 195 71 C222 71 240 92 240 118 C240 145 220 165 195 165 L60 165 Z" fill="#94a3b8" />
    </svg>`
  },
  {
    id: 'fx_green_stars',
    name: '✨ Stars (Fondo Verde)',
    category: 'chroma_green',
    color: '#00ff00',
    svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#00ff00" />
      <path d="M120 10 C120 85 145 110 220 120 C145 130 120 155 120 230 C120 155 95 130 20 120 C95 110 120 85 120 10 Z" fill="#ffffff" />
      <circle cx="120" cy="120" r="16" fill="#00f0ff" opacity="0.8" />
    </svg>`
  },

  // ⚡ 2. RAYOS & RELÁMPAGOS TRANSPARENTES
  {
    id: 'fx_lightning_storm',
    name: 'Rayo Tormenta',
    category: 'lightning',
    color: '#00f0ff',
    svg: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <path d="M125 10 L55 125 L105 125 L75 270 L165 140 L115 140 Z" fill="#00f0ff" />
      <path d="M125 10 L55 125 L105 125 L75 270 L165 140 L115 140 Z" fill="#ffffff" opacity="0.85" />
    </svg>`
  },
  {
    id: 'fx_lightning_fork',
    name: 'Rayo Bifurcado',
    category: 'lightning',
    color: '#ffea00',
    svg: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <path d="M110 5 L60 95 L95 95 L40 210 L80 185 L50 275 L120 155 L85 155 L145 75 L110 75 Z" fill="#ffea00" />
      <path d="M110 5 L60 95 L95 95 L40 210 L80 185 L50 275 L120 155 L85 155 L145 75 L110 75 Z" fill="#ffffff" opacity="0.6" />
    </svg>`
  },

  // ☁️ 3. NUBES & HUMO TRANSPARENTES
  {
    id: 'fx_cloud_dense',
    name: 'Nube Tormentosa',
    category: 'clouds',
    color: '#94a3b8',
    svg: `<svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 140 C30 140 15 125 15 105 C15 88 28 73 45 70 C52 45 75 25 105 25 C132 25 155 42 163 67 C172 62 182 60 193 60 C223 60 248 83 248 112 C248 141 223 165 193 165 L50 165 Z" fill="#64748b" opacity="0.85" />
      <path d="M60 135 C42 135 28 122 28 105 C28 90 40 77 55 75 C62 52 82 35 108 35 C132 35 152 50 160 72 C168 68 178 66 188 66 C214 66 235 86 235 112 C235 137 214 158 188 158 L60 158 Z" fill="#cbd5e1" opacity="0.5" />
    </svg>`
  },

  // 🔥 4. FUEGO TRANSPARENTE
  {
    id: 'fx_fire_tribal',
    name: 'Llamas Tribales',
    category: 'fire',
    color: '#ff5722',
    svg: `<svg viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg">
      <path d="M110 10 C125 60 165 95 165 145 C165 185 145 200 135 230 C185 205 195 145 175 100 C205 145 205 210 160 255 C125 285 75 275 45 240 C15 205 20 145 60 95 C55 125 70 155 90 165 C80 125 85 85 110 10 Z" fill="#ff3d00" />
      <path d="M110 70 C120 105 145 130 145 165 C145 195 130 215 115 240 C100 215 90 195 90 165 C90 130 100 105 110 70 Z" fill="#ffeb3b" />
    </svg>`
  },

  // ✨ 5. STARS & DESTELLOS TRANSPARENTES
  {
    id: 'fx_star_y2k_4pt',
    name: 'Estrella Y2K 4P',
    category: 'stars',
    color: '#ffffff',
    svg: `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <path d="M110 5 C110 75 135 100 205 110 C135 120 110 145 110 215 C110 145 85 120 15 110 C85 100 110 75 110 5 Z" fill="#ffffff" />
      <circle cx="110" cy="110" r="14" fill="#00f0ff" opacity="0.75" />
    </svg>`
  }
];

export function svgEffectToImage(svgString) {
  return new Promise((resolve, reject) => {
    const encoded = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = encoded;
  });
}
