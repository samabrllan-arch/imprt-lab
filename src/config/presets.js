/**
 * Diseños vectoriales y estampados de alta definición listos para usar
 */
export const DECAL_PRESETS = [
  {
    id: 'brand-logo',
    name: 'IMPRNT [LAB] Official',
    category: 'Brand',
    src: '/assets/new_brand_logo.png',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <image href="/assets/new_brand_logo.png" x="10" y="10" width="480" height="480" preserveAspectRatio="xMidYMid meet" />
    </svg>`
  },
  {
    id: 'cyber-tiger',
    name: 'Cyber Neo Tiger',
    category: 'Cyberpunk',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff007f" />
          <stop offset="50%" stop-color="#7928ca" />
          <stop offset="100%" stop-color="#00f0ff" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="210" fill="none" stroke="url(#grad1)" stroke-width="12" stroke-dasharray="16 12"/>
      <polygon points="250,70 330,190 430,210 350,300 370,420 250,360 130,420 150,300 70,210 170,190" fill="url(#grad1)" opacity="0.9"/>
      <path d="M190,210 Q250,150 310,210 Q250,290 190,210 Z" fill="#090a10" stroke="#00f0ff" stroke-width="6"/>
      <circle cx="215" cy="210" r="14" fill="#ff007f"/>
      <circle cx="285" cy="210" r="14" fill="#ff007f"/>
      <text x="250" y="470" font-family="'Outfit', sans-serif" font-weight="900" font-size="34" fill="#00f0ff" text-anchor="middle" letter-spacing="8">TOKYO CYBER</text>
    </svg>`
  },
  {
    id: 'kanji-energy',
    name: 'Kanji Street Energy',
    category: 'Streetwear',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <linearGradient id="gradFire" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff3300" />
          <stop offset="100%" stop-color="#ffaa00" />
        </linearGradient>
      </defs>
      <rect x="50" y="50" width="400" height="400" rx="30" fill="#12131a" stroke="url(#gradFire)" stroke-width="8"/>
      <path d="M140,160 L360,160 M250,110 L250,390 M180,240 L320,240 M160,330 L340,330" stroke="url(#gradFire)" stroke-width="26" stroke-linecap="round"/>
      <circle cx="380" cy="120" r="28" fill="#ff3300"/>
      <text x="250" y="435" font-family="'Outfit', sans-serif" font-weight="800" font-size="26" fill="#ffffff" text-anchor="middle" letter-spacing="6">LIMITLESS</text>
    </svg>`
  },
  {
    id: 'retro-wave',
    name: 'Sunset Retro Wave',
    category: 'Retro',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffe600" />
          <stop offset="50%" stop-color="#ff0066" />
          <stop offset="100%" stop-color="#49006a" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="220" r="160" fill="url(#sunGrad)"/>
      <line x1="90" y1="210" x2="410" y2="210" stroke="#090a10" stroke-width="8"/>
      <line x1="95" y1="240" x2="405" y2="240" stroke="#090a10" stroke-width="12"/>
      <line x1="110" y1="275" x2="390" y2="275" stroke="#090a10" stroke-width="16"/>
      <line x1="140" y1="320" x2="360" y2="320" stroke="#090a10" stroke-width="22"/>
      <text x="250" y="445" font-family="'Outfit', sans-serif" font-weight="900" font-size="36" fill="#ffe600" text-anchor="middle" letter-spacing="5">OVERDRIVE 1988</text>
    </svg>`
  },
  {
    id: 'minimal-botanical',
    name: 'Minimal Floral Palm',
    category: 'Minimal',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <circle cx="250" cy="250" r="190" fill="none" stroke="#22c55e" stroke-width="6"/>
      <path d="M250,380 Q250,220 250,110 M250,310 C210,270 170,260 140,290 M250,260 C290,220 330,220 360,250 M250,210 C210,180 180,180 160,200 M250,160 C290,130 320,130 340,150" stroke="#22c55e" stroke-width="12" fill="none" stroke-linecap="round"/>
      <text x="250" y="440" font-family="'Inter', sans-serif" font-weight="600" font-size="20" fill="#ffffff" text-anchor="middle" letter-spacing="10">ORGANIC STUDIO</text>
    </svg>`
  },
  {
    id: 'cyber-skull',
    name: 'Mecha Cyber Skull',
    category: 'Cyberpunk',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <linearGradient id="neonSkullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="50%" stop-color="#7928ca"/>
          <stop offset="100%" stop-color="#ff007f"/>
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="200" fill="none" stroke="url(#neonSkullGrad)" stroke-width="4" stroke-dasharray="10 8"/>
      <!-- Calavera geométrica mecha -->
      <path d="M160,180 C160,110 340,110 340,180 C340,240 310,270 310,310 L190,310 C190,270 160,240 160,180 Z" fill="#12131a" stroke="url(#neonSkullGrad)" stroke-width="8"/>
      <polygon points="190,190 225,235 195,245" fill="#00f0ff"/>
      <polygon points="310,190 275,235 305,245" fill="#00f0ff"/>
      <polygon points="250,250 240,280 260,280" fill="#ff007f"/>
      <!-- Dientes mecha -->
      <rect x="205" y="325" width="16" height="24" rx="3" fill="#00f0ff"/>
      <rect x="227" y="325" width="16" height="28" rx="3" fill="#00f0ff"/>
      <rect x="257" y="325" width="16" height="28" rx="3" fill="#00f0ff"/>
      <rect x="279" y="325" width="16" height="24" rx="3" fill="#00f0ff"/>
      <text x="250" y="440" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="8">CYBER MECHA 01</text>
    </svg>`
  },
  {
    id: 'acid-smile',
    name: 'Acid Future Rave',
    category: 'Streetwear',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="acidYellowGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fffb00"/>
          <stop offset="85%" stop-color="#ccff00"/>
          <stop offset="100%" stop-color="#99e600"/>
        </radialGradient>
      </defs>
      <circle cx="250" cy="230" r="160" fill="url(#acidYellowGrad)" stroke="#090a10" stroke-width="12"/>
      <!-- Ojos 'X' estilo rave / streetwear -->
      <path d="M180,180 L215,215 M215,180 L180,215" stroke="#090a10" stroke-width="14" stroke-linecap="round"/>
      <path d="M285,180 L320,215 M320,180 L285,215" stroke="#090a10" stroke-width="14" stroke-linecap="round"/>
      <!-- Sonrisa derretida -->
      <path d="M175,270 Q250,350 325,270" stroke="#090a10" stroke-width="16" fill="none" stroke-linecap="round"/>
      <text x="250" y="445" font-family="'Outfit', sans-serif" font-weight="900" font-size="30" fill="#ccff00" text-anchor="middle" letter-spacing="6">ACID ATELIER</text>
    </svg>`
  }
];

export function svgToDataUrl(svgString) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}
